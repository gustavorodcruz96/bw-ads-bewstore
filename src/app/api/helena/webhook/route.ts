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

    console.log(`[Webhook] ${eventType}`);

    switch (eventType) {
      case "SESSION_NEW": {
        const sessionId = String(content.id || "");
        const phone = String(content.phonenumber || "");
        const name = String(content.name || "");
        const utm = content.utm as Record<string, string> | null;

        // Salvar sessão no Supabase
        const { error } = await supabase.from("sessions").insert({
          helena_session_id: sessionId,
          phone: phone || null,
          name: name || null,
          utm_source: utm?.utm_source || null,
          utm_medium: utm?.utm_medium || null,
          utm_campaign: utm?.utm_campaign || null,
          utm_content: utm?.utm_content || null,
          ttclid: utm?.ttclid || null,
          status: "new",
        });

        if (error) {
          console.error("[Webhook] Session insert error:", error.message);
        } else {
          console.log(`[Webhook] Session saved: ${sessionId}`);

          // Transferir sessão para dept Varejo (tira do chatbot automático)
          // Só se veio da LP (tem UTM)
          if (utm?.utm_source) {
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
          user: { phone_number: phone, external_id: sessionId, ttclid: utm?.ttclid },
        }).catch(() => {});

        break;
      }

      case "MESSAGE_RECEIVED": {
        const direction = content.direction as string;
        if (direction !== "INCOMING") break;

        const agentOn = await isAgentEnabled();
        if (!agentOn) break;

        const sessionId = content.sessionId as string;
        const channelId = content.channelId as string;
        const contactId = content.contactId as string;
        const text = String(content.text || "");
        const msgType = String(content.type || "text");

        // Verificar se sessão existe no Supabase (veio da LP)
        const { data: session } = await supabase
          .from("sessions")
          .select("status")
          .eq("helena_session_id", sessionId)
          .single();

        if (!session) {
          console.log(`[Webhook] Session ${sessionId} not from LP, skipping`);
          break;
        }

        if (["negotiation", "sale", "completed"].includes(session.status)) {
          console.log(`[Webhook] Session ${sessionId} handled by human, skipping`);
          break;
        }

        try {
          const response = await processMessage(sessionId, text, msgType);

          if (response.reply) {
            await sendMessage(channelId, contactId, response.reply);
            console.log(`[Webhook] Agent replied: ${sessionId}`);
          }
        } catch (err) {
          console.error("[Webhook] Agent error:", err);
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
