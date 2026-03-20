import { NextRequest, NextResponse } from "next/server";
import { sendTikTokEvent } from "@/lib/tiktok";
import { createServiceClient } from "@/lib/supabase";
import { processMessage, isAgentEnabled } from "@/lib/agent";
import { sendMessage, transferSession } from "@/lib/helena";

// Verificar se um atendente humano está atribuído à sessão no Helena
// Consulta a sessão diretamente - se userId existe, um humano assumiu
async function isHumanAssigned(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.helena.run/chat/v2/session/${sessionId}`,
      { headers: { Authorization: `Bearer ${process.env.HELENA_API_TOKEN}` } }
    );
    if (!res.ok) return false;

    const session = await res.json();
    const userId = session.userId;
    const status = session.status;

    console.log(`[Webhook] Helena session check: userId=${userId || "none"}, status=${status}`);

    // Se tem userId atribuído E status é IN_PROGRESS, um humano está atendendo
    if (userId && status === "IN_PROGRESS") {
      console.log(`[Webhook] Human agent ${userId} is assigned to ${sessionId}`);
      return true;
    }

    return false;
  } catch (e) {
    console.error("[Webhook] Failed to check session assignment:", e);
    // Em caso de erro, NÃO responder (seguro)
    return true;
  }
}

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
        const direction = String(content.direction || "");
        const origin = String(content.origin || "");
        const sessionId = String(content.sessionId || "");
        console.log(`[Webhook] MESSAGE direction=${direction}, origin=${origin}, session=${sessionId}`);

        if (!sessionId) break;

        const msgText = String(content.text || "").trim();

        // Atendente humano respondeu → IA para nessa conversa
        if (direction === "TO_HUB" && origin !== "BOT" && origin !== "SYSTEM") {
          console.log(`[Webhook] Human agent responded in ${sessionId}, stopping AI`);
          await supabase
            .from("sessions")
            .update({ status: "negotiation", agent_handled: false, updated_at: new Date().toISOString() })
            .eq("helena_session_id", sessionId);
          break;
        }

        // Só processar mensagens do cliente (FROM_HUB) e não de bots
        if (direction !== "FROM_HUB") break;
        if (origin === "BOT") break;

        const agentOn = await isAgentEnabled();
        console.log(`[Webhook] Agent enabled: ${agentOn}`);
        if (!agentOn) break;

        const text = msgText;
        const msgType = String(content.type || "TEXT").toLowerCase();

        // Detectar mensagem da LP: "Atendimento #XXXXX: ..."
        const isFromLPMessage = /^Atendimento\s+#\d+:/i.test(text) ||
          text.includes("Vi os iPhones seminovos") ||
          text.includes("quero saber mais");

        // Extrair URL do áudio
        const details = content.details as Record<string, unknown> | null;
        const fileInfo = details?.file as Record<string, string> | null;
        const audioUrl = (msgType === "audio" || msgType === "ptt") ? (fileInfo?.publicUrl || "") : "";

        console.log(`[Webhook] MSG: type=${msgType}, isFromLP=${isFromLPMessage}, text="${(text || "").substring(0, 50)}"${audioUrl ? `, audio=${audioUrl.substring(0, 60)}` : ""}`);

        // Verificar se sessão existe no Supabase
        let { data: session } = await supabase
          .from("sessions")
          .select("status, helena_contact_id, utm_source, agent_handled")
          .eq("helena_session_id", sessionId)
          .single();

        // Se sessão não existe, criar automaticamente
        if (!session) {
          console.log(`[Webhook] Session not found, creating...`);
          try {
            const sessionRes = await fetch(`https://api.helena.run/chat/v2/session/${sessionId}`, {
              headers: { Authorization: `Bearer ${process.env.HELENA_API_TOKEN}` },
            });
            if (sessionRes.ok) {
              const helenaSession = await sessionRes.json();
              const utm = (helenaSession.utm || {}) as Record<string, string>;

              // Buscar telefone e nome do contato
              let phone = "";
              let name = "";
              const contactId = helenaSession.contactId || "";
              if (contactId) {
                try {
                  const cRes = await fetch(`https://api.helena.run/core/v1/contact/${contactId}`, {
                    headers: { Authorization: `Bearer ${process.env.HELENA_API_TOKEN}` },
                  });
                  if (cRes.ok) {
                    const c = await cRes.json();
                    phone = (c.phoneNumber || "").replace("|", "");
                    name = c.name || "";
                  }
                } catch {}
              }

              // Se mensagem veio da LP mas Helena não registrou UTM, forçar como SITE
              const utmSource = utm?.source || (isFromLPMessage ? "SITE" : null);

              await supabase.from("sessions").insert({
                helena_session_id: sessionId,
                helena_contact_id: contactId || null,
                phone: phone || null,
                name: name || null,
                utm_source: utmSource,
                utm_medium: utm?.medium || null,
                utm_campaign: utm?.campaign || null,
                utm_content: utm?.content || null,
                ttclid: utm?.clid || null,
                status: "new",
              });

              const { data: newSession } = await supabase
                .from("sessions")
                .select("status, helena_contact_id, utm_source, agent_handled")
                .eq("helena_session_id", sessionId)
                .single();
              session = newSession;
              console.log(`[Webhook] Session created: ${sessionId}`);
            }
          } catch (e) {
            console.error("[Webhook] Failed to create session:", e);
          }
        }

        if (!session) {
          console.log(`[Webhook] Session ${sessionId} not found/created, skipping`);
          break;
        }

        // Mensagem da LP (Atendimento #xxx) → reativar agente e resetar status
        if (isFromLPMessage) {
          console.log(`[Webhook] LP message detected in ${sessionId}, reactivating agent`);
          await supabase
            .from("sessions")
            .update({
              utm_source: session.utm_source || "SITE",
              status: "in_progress",
              agent_handled: true,
              updated_at: new Date().toISOString(),
            })
            .eq("helena_session_id", sessionId);
          session = { ...session, utm_source: session.utm_source || "SITE", status: "in_progress", agent_handled: true };
        }

        // Se IA foi desativada manualmente pelo atendente (/parar)
        if (session.agent_handled === false) {
          console.log(`[Webhook] Session ${sessionId} AI disabled by agent command, skipping`);
          break;
        }

        if (["sale", "completed"].includes(session.status)) {
          console.log(`[Webhook] Session ${sessionId} status=${session.status}, skipping`);
          break;
        }

        // VERIFICAÇÃO DEFINITIVA: consultar Helena se um humano está atribuído
        // userId no Helena = vendedor assumiu → IA NÃO responde
        if (!isFromLPMessage) {
          const humanActive = await isHumanAssigned(sessionId);
          if (humanActive) {
            console.log(`[Webhook] Human agent assigned in Helena for ${sessionId}, AI will NOT respond`);
            await supabase
              .from("sessions")
              .update({ status: "negotiation", agent_handled: false, updated_at: new Date().toISOString() })
              .eq("helena_session_id", sessionId);
            break;
          }
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

      case "SESSION_UPDATE": {
        const sessionId = String(content.id || "");
        const status = content.status as string;
        const userId = content.userId as string | null;

        console.log(`[Webhook] SESSION_UPDATE: session=${sessionId}, status=${status}, userId=${userId || "none"}`);

        // Se um atendente humano foi atribuído (userId preenchido + IN_PROGRESS)
        // → desativar IA nessa sessão IMEDIATAMENTE
        if (userId && status === "IN_PROGRESS") {
          console.log(`[Webhook] Human assigned to ${sessionId}, disabling AI immediately`);
          await supabase
            .from("sessions")
            .update({ status: "negotiation", agent_handled: false, updated_at: new Date().toISOString() })
            .eq("helena_session_id", sessionId);
        }

        if (status === "COMPLETED") {
          await supabase
            .from("sessions")
            .update({ status: "completed", updated_at: new Date().toISOString() })
            .eq("helena_session_id", sessionId);
        }

        break;
      }

      case "SESSION_COMPLETE": {
        const sessionId = String(content.id || "");

        await supabase
          .from("sessions")
          .update({ status: "completed", updated_at: new Date().toISOString() })
          .eq("helena_session_id", sessionId);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
