import { NextRequest, NextResponse } from "next/server";
import { sendTikTokEvent } from "@/lib/tiktok";
import { createServiceClient } from "@/lib/supabase";
import { processMessage, isAgentEnabled } from "@/lib/agent";
import { sendMessage, transferSession } from "@/lib/helena";

type WebhookPayload = {
  eventType: string;
  date: string;
  content: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    const { eventType, content } = payload;
    const supabase = createServiceClient();

    // LOG COMPLETO para debug - remover após confirmar estrutura
    console.log(`[Webhook] ${eventType} PAYLOAD:`, JSON.stringify(payload, null, 2));

    switch (eventType) {
      case "SESSION_NEW": {
        // Helena SESSION_NEW fields: id, contactId, channelId, departmentId, status, utm, etc.
        const sessionId = String(content.id || "");
        const helenaContactId = String(content.contactId || "");
        const helenaChannelId = String(content.channelId || "");

        // Buscar dados do contato via API para pegar telefone e nome
        let phone = "";
        let name = "";
        if (helenaContactId) {
          try {
            const contactRes = await fetch(`https://api.helena.run/core/v1/contact/${helenaContactId}`, {
              headers: { Authorization: `Bearer ${process.env.HELENA_API_TOKEN}` },
            });
            if (contactRes.ok) {
              const contactData = await contactRes.json();
              const rawPhone = contactData.phoneNumber || contactData.phonenumber || "";
              phone = rawPhone.replace("|", "");
              name = contactData.name || "";
            }
          } catch (e) {
            console.error("[Webhook] Failed to fetch contact:", e);
          }
        }

        // Helena UTM structure: { source, medium, campaign, content, clid, term, headline, referralUrl }
        const utm = (content.utm || {}) as Record<string, string>;
        console.log(`[Webhook] SESSION_NEW raw UTM:`, JSON.stringify(content.utm));

        const utmSource = utm?.source || utm?.utm_source || null;
        const utmMedium = utm?.medium || utm?.utm_medium || null;
        const utmCampaign = utm?.campaign || utm?.utm_campaign || null;
        const utmContent = utm?.content || utm?.utm_content || null;
        const ttclid = utm?.clid || utm?.ttclid || null;

        console.log(`[Webhook] SESSION_NEW parsed: sessionId=${sessionId}, phone=${phone}, utmSource=${utmSource}`);

        // Salvar sessão no Supabase
        const { error } = await supabase.from("sessions").insert({
          helena_session_id: sessionId,
          helena_contact_id: helenaContactId || null,
          phone: phone || null,
          name: name || null,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          ttclid: ttclid,
          status: "new",
        });

        if (error) {
          console.error("[Webhook] Session insert error:", error.message);
        } else {
          console.log(`[Webhook] Session saved: ${sessionId}`);

          // Transferir sessão para dept Varejo (tira do chatbot automático)
          if (utmSource) {
            try {
              await transferSession(sessionId, "73089578-a962-42da-9767-fbbf4ee81075");
              console.log(`[Webhook] Session transferred to Varejo: ${sessionId}`);
            } catch (e) {
              console.error("[Webhook] Transfer failed:", e);
            }
          }
        }

        // TikTok Contact event (fire-and-forget)
        sendTikTokEvent({
          event: "Contact",
          event_id: `contact-${sessionId}`,
          properties: { content_type: "product", content_id: "whatsapp-contact" },
          user: { phone_number: phone, external_id: sessionId, ttclid: ttclid || undefined },
        }).catch(() => {});

        break;
      }

      case "MESSAGE_RECEIVED": {
        // Helena direction: FROM_HUB = do cliente, TO_HUB = do agente/bot
        const direction = String(content.direction || "");
        const origin = String(content.origin || "");
        console.log(`[Webhook] MESSAGE direction=${direction}, origin=${origin}`);

        // Só processar mensagens do cliente (FROM_HUB) e não de bots
        if (direction !== "FROM_HUB") break;
        if (origin === "BOT") break;

        const agentOn = await isAgentEnabled();
        console.log(`[Webhook] Agent enabled: ${agentOn}`);
        if (!agentOn) break;

        // Helena MESSAGE_RECEIVED fields
        const sessionId = String(content.sessionId || "");
        const text = String(content.text || "");
        const msgType = String(content.type || "TEXT").toLowerCase();

        // Extrair URL do áudio se for mensagem de áudio
        const details = content.details as Record<string, unknown> | null;
        const fileInfo = details?.file as Record<string, string> | null;
        const audioUrl = (msgType === "audio" || msgType === "ptt") ? (fileInfo?.publicUrl || "") : "";

        console.log(`[Webhook] MSG parsed: session=${sessionId}, type=${msgType}, text="${(text || "").substring(0, 50)}"${audioUrl ? `, audioUrl=${audioUrl.substring(0, 80)}` : ""}`);

        if (!sessionId) {
          console.log("[Webhook] No sessionId found, skipping");
          break;
        }

        // Verificar se sessão existe no Supabase (inclui utm_source para filtro)
        let { data: session } = await supabase
          .from("sessions")
          .select("status, helena_contact_id, utm_source")
          .eq("helena_session_id", sessionId)
          .single();

        console.log(`[Webhook] Session lookup result:`, session);

        // Se sessão não existe, verificar no Helena se tem UTM (veio da LP)
        if (!session) {
          console.log(`[Webhook] Session not found, checking Helena API...`);
          try {
            const sessionRes = await fetch(`https://api.helena.run/chat/v2/session/${sessionId}`, {
              headers: { Authorization: `Bearer ${process.env.HELENA_API_TOKEN}` },
            });
            if (sessionRes.ok) {
              const helenaSession = await sessionRes.json();
              const utm = (helenaSession.utm || {}) as Record<string, string>;
              const utmSource = utm?.source || null;

              // SÓ criar sessão se veio do TikTok (LP)
              if (!utmSource || utmSource.toLowerCase() !== "tiktok") {
                console.log(`[Webhook] Session ${sessionId} utm="${utmSource}" - not from TikTok, skipping agent`);
                break;
              }

              await supabase.from("sessions").insert({
                helena_session_id: sessionId,
                helena_contact_id: helenaSession.contactId || null,
                phone: null,
                name: null,
                utm_source: utmSource,
                utm_medium: utm?.medium || null,
                utm_campaign: utm?.campaign || null,
                utm_content: utm?.content || null,
                ttclid: utm?.clid || null,
                status: "new",
              });

              const { data: newSession } = await supabase
                .from("sessions")
                .select("status, helena_contact_id, utm_source")
                .eq("helena_session_id", sessionId)
                .single();
              session = newSession;
              console.log(`[Webhook] Session created from LP: ${sessionId}, utm=${utmSource}`);
            }
          } catch (e) {
            console.error("[Webhook] Failed to check session:", e);
          }
        }

        if (!session) {
          console.log(`[Webhook] Session ${sessionId} not found/created, skipping`);
          break;
        }

        // FILTRO PRINCIPAL: só responder se sessão veio da LP do TikTok
        // Aceita: "tiktok", "TIKTOK", "Tiktok" (case-insensitive)
        const sessionUtm = (session.utm_source || "").toLowerCase().trim();
        const isFromLP = sessionUtm === "tiktok" || sessionUtm === "tik_tok";
        console.log(`[Webhook] UTM filter: utm_source="${session.utm_source}", isFromLP=${isFromLP}`);
        if (!isFromLP) {
          console.log(`[Webhook] Session ${sessionId} utm_source="${session.utm_source}" - not from TikTok LP, skipping agent`);
          break;
        }

        if (["negotiation", "sale", "completed"].includes(session.status)) {
          console.log(`[Webhook] Session ${sessionId} status=${session.status}, handled by human, skipping`);
          break;
        }

        console.log(`[Webhook] Processing message with agent...`);

        try {
          const response = await processMessage(sessionId, text, msgType, audioUrl || undefined);
          console.log(`[Webhook] Agent response:`, JSON.stringify(response));

          if (response.reply) {
            console.log(`[Webhook] Sending reply to session: ${sessionId}`);
            await sendMessage(sessionId, response.reply);
            console.log(`[Webhook] Agent replied successfully: ${sessionId}`);
          }
        } catch (err) {
          console.error("[Webhook] Agent error:", err instanceof Error ? err.message : err);
        }

        break;
      }

      case "CONTACT_UPDATE":
      case "CONTACT_TAG_UPDATE": {
        const tags = (content.tags as Array<{ name: string }>) || [];
        const contactId = String(content.id || "");
        const phone = String(content.phonenumber || "");

        const hasVenda = tags.some((t) => {
          const tagName = t.name?.toLowerCase() || "";
          return (
            tagName.includes("venda de aparelho") ||
            tagName.includes("venda26") ||
            tagName.includes("venda-confirmada") ||
            tagName.includes("venda confirmada")
          );
        });

        if (hasVenda) {
          console.log(`[Webhook] VENDA! Contact: ${contactId}`);

          await supabase
            .from("sessions")
            .update({ status: "sale", updated_at: new Date().toISOString() })
            .eq("helena_session_id", contactId);

          sendTikTokEvent({
            event: "CompletePayment",
            event_id: `sale-${contactId}-${Date.now()}`,
            properties: {
              currency: "BRL",
              value: 0,
              content_type: "product",
              contents: [{ content_id: "iphone-seminovo", content_name: "iPhone Seminovo" }],
            },
            user: { phone_number: phone, external_id: contactId },
          }).catch(() => {});
        }

        break;
      }

      case "SESSION_UPDATE":
      case "SESSION_COMPLETE": {
        const status = content.status as string;
        const sessionId = String(content.id || "");

        if (status === "COMPLETED") {
          await supabase
            .from("sessions")
            .update({ status: "completed", updated_at: new Date().toISOString() })
            .eq("helena_session_id", sessionId);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
