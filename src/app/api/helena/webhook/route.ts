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
        // Tentar múltiplos formatos de campos do Helena
        const sessionId = String(content.id || content.sessionId || content.session_id || "");
        const phone = String(
          content.phonenumber || content.phoneNumber || content.phone ||
          (content.contact as Record<string, unknown>)?.phonenumber ||
          (content.contact as Record<string, unknown>)?.phoneNumber ||
          ""
        );
        const name = String(
          content.name ||
          (content.contact as Record<string, unknown>)?.name ||
          ""
        );

        // UTM pode estar em content.utm, content.utmParams, content.metadata, ou no nível root
        const utm = (
          content.utm || content.utmParams || content.utm_params ||
          content.metadata || content.tracking || {}
        ) as Record<string, string>;

        // Também verificar se UTMs estão no nível root do content
        const utmSource = utm?.utm_source || utm?.utmSource || content.utm_source as string || null;
        const utmMedium = utm?.utm_medium || utm?.utmMedium || content.utm_medium as string || null;
        const utmCampaign = utm?.utm_campaign || utm?.utmCampaign || content.utm_campaign as string || null;
        const utmContent = utm?.utm_content || utm?.utmContent || content.utm_content as string || null;
        const ttclid = utm?.ttclid || content.ttclid as string || null;

        console.log(`[Webhook] SESSION_NEW parsed: sessionId=${sessionId}, phone=${phone}, utmSource=${utmSource}`);

        // Salvar sessão no Supabase
        const { error } = await supabase.from("sessions").insert({
          helena_session_id: sessionId,
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
        const direction = String(content.direction || content.type || "");
        console.log(`[Webhook] MESSAGE direction=${direction}`);

        if (direction !== "INCOMING" && direction !== "incoming") break;

        const agentOn = await isAgentEnabled();
        console.log(`[Webhook] Agent enabled: ${agentOn}`);
        if (!agentOn) break;

        // Tentar múltiplos formatos de campo
        const sessionId = String(content.sessionId || content.session_id || content.session?.id || "");
        const channelId = String(content.channelId || content.channel_id || content.channel?.id || "");
        const contactId = String(content.contactId || content.contact_id || content.contact?.id || "");
        const text = String(content.text || content.body || content.message || "");
        const msgType = String(content.type || content.messageType || "text");

        console.log(`[Webhook] MSG parsed: session=${sessionId}, channel=${channelId}, contact=${contactId}, text="${text.substring(0, 50)}"`);

        if (!sessionId) {
          console.log("[Webhook] No sessionId found, skipping");
          break;
        }

        // Verificar se sessão existe no Supabase (veio da LP)
        const { data: session } = await supabase
          .from("sessions")
          .select("status")
          .eq("helena_session_id", sessionId)
          .single();

        console.log(`[Webhook] Session lookup result:`, session);

        if (!session) {
          console.log(`[Webhook] Session ${sessionId} not in Supabase, skipping`);
          break;
        }

        if (["negotiation", "sale", "completed"].includes(session.status)) {
          console.log(`[Webhook] Session ${sessionId} status=${session.status}, handled by human, skipping`);
          break;
        }

        console.log(`[Webhook] Processing message with agent...`);

        try {
          const response = await processMessage(sessionId, text, msgType);
          console.log(`[Webhook] Agent response:`, JSON.stringify(response));

          if (response.reply) {
            console.log(`[Webhook] Sending reply via Helena: channel=${channelId}, contact=${contactId}`);
            await sendMessage(channelId, contactId, response.reply);
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
