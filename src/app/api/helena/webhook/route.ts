import { NextRequest, NextResponse } from "next/server";
import { sendTikTokEvent } from "@/lib/tiktok";
import { createServiceClient } from "@/lib/supabase";
import { processMessage, isAgentEnabled } from "@/lib/agent";
import { sendMessage } from "@/lib/helena";

type WebhookPayload = {
  eventType: string;
  date: string;
  content: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    const { eventType, content } = payload;

    console.log(`[Helena Webhook] Event: ${eventType}`);

    switch (eventType) {
      case "SESSION_NEW":
        await handleNewSession(content);
        break;

      case "MESSAGE_RECEIVED":
        await handleMessageReceived(content);
        break;

      case "CONTACT_UPDATE":
        await handleContactUpdate(content);
        break;

      case "SESSION_UPDATED":
        await handleSessionUpdate(content);
        break;

      default:
        console.log(`[Helena Webhook] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Helena Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleNewSession(content: Record<string, unknown>) {
  const sessionId = content.id as string;
  const contactPhone = content.phonenumber as string;
  const contactName = (content.name as string) || null;
  const utm = content.utm as Record<string, string> | null;

  console.log(`[Helena Webhook] New session: ${sessionId}, UTM:`, utm);

  // Enviar evento Contact ao TikTok
  await sendTikTokEvent({
    event: "Contact",
    event_id: `contact-${sessionId}`,
    properties: {
      content_type: "product",
      content_name: "WhatsApp Contact - iPhone Seminovo",
    },
    user: {
      phone_number: contactPhone,
      external_id: sessionId,
      ttclid: utm?.ttclid,
    },
  });

  // Salvar no Supabase
  try {
    const supabase = createServiceClient();
    await supabase.from("sessions").insert({
      helena_session_id: sessionId,
      phone: contactPhone || null,
      name: contactName,
      utm_source: utm?.utm_source || null,
      utm_medium: utm?.utm_medium || null,
      utm_campaign: utm?.utm_campaign || null,
      utm_content: utm?.utm_content || null,
      ttclid: utm?.ttclid || null,
      status: "new",
    });
  } catch (dbError) {
    console.error("[Helena Webhook] Failed to save session:", dbError);
  }
}

async function handleMessageReceived(content: Record<string, unknown>) {
  // Só processa mensagens do cliente (não do atendente)
  const direction = content.direction as string;
  if (direction !== "INCOMING") return;

  const agentEnabled = await isAgentEnabled();
  if (!agentEnabled) {
    console.log("[Helena Webhook] Agent disabled, skipping");
    return;
  }

  const sessionId = content.sessionId as string;
  const channelId = content.channelId as string;
  const contactId = content.contactId as string;
  const messageText = (content.text as string) || "";
  const messageType = (content.type as string) || "text";

  // Verificar sessão no Supabase
  const supabase = createServiceClient();
  const { data: session } = await supabase
    .from("sessions")
    .select("status, utm_source")
    .eq("helena_session_id", sessionId)
    .single();

  // Só atender leads que vieram do TikTok Ads
  if (!session?.utm_source?.toLowerCase().includes("tiktok")) {
    console.log(`[Helena Webhook] Session ${sessionId} not from TikTok (source: ${session?.utm_source}), skipping agent`);
    return;
  }

  // Se já está em negociação ou venda, não interferir (humano atendendo)
  if (session?.status === "negotiation" || session?.status === "sale" || session?.status === "completed") {
    console.log(`[Helena Webhook] Session ${sessionId} already handled by human, skipping agent`);
    return;
  }

  console.log(`[Helena Webhook] Processing message with agent: ${sessionId}`);

  try {
    // Processar com IA
    const agentResponse = await processMessage(
      sessionId,
      messageText,
      messageType
    );

    // Responder via Helena API
    if (agentResponse.reply) {
      await sendMessage(channelId, contactId, agentResponse.reply);
      console.log(`[Helena Webhook] Agent replied to session ${sessionId}`);
    }

    // Se precisa transferir, atualizar status e parar de responder
    if (agentResponse.shouldTransfer) {
      console.log(`[Helena Webhook] Lead qualified, transferring session ${sessionId}`);
      // O status já foi atualizado para "negotiation" pelo agent.ts
      // Aqui poderia transferir para um departamento específico via Helena API
    }
  } catch (agentError) {
    console.error("[Helena Webhook] Agent processing failed:", agentError);
    // Falha silenciosa - não responder nada é melhor que responder errado
  }
}

async function handleContactUpdate(content: Record<string, unknown>) {
  const tags = (content.tags as Array<{ name: string }>) || [];
  const contactId = content.id as string;
  const phone = content.phonenumber as string;

  const hasVendaTag = tags.some(
    (tag) =>
      tag.name?.toLowerCase().includes("venda-confirmada") ||
      tag.name?.toLowerCase().includes("venda confirmada")
  );

  if (hasVendaTag) {
    console.log(`[Helena Webhook] VENDA CONFIRMADA! Contact: ${contactId}`);
    await sendConversionEvent(contactId, phone);

    try {
      const supabase = createServiceClient();
      await supabase
        .from("sessions")
        .update({ status: "sale", updated_at: new Date().toISOString() })
        .eq("helena_session_id", contactId);
    } catch (dbError) {
      console.error("[Helena Webhook] Failed to update session:", dbError);
    }
  }
}

async function handleSessionUpdate(content: Record<string, unknown>) {
  const status = content.status as string;
  const sessionId = content.id as string;

  if (status === "COMPLETED") {
    try {
      const supabase = createServiceClient();
      await supabase
        .from("sessions")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("helena_session_id", sessionId);
    } catch (dbError) {
      console.error("[Helena Webhook] Failed to update session:", dbError);
    }
  }
}

async function sendConversionEvent(contactId: string, phone: string) {
  const result = await sendTikTokEvent({
    event: "CompletePayment",
    event_id: `sale-${contactId}-${Date.now()}`,
    properties: {
      currency: "BRL",
      value: 0,
      content_type: "product",
      contents: [
        {
          content_id: "iphone-seminovo",
          content_name: "iPhone Seminovo",
        },
      ],
    },
    user: {
      phone_number: phone,
      external_id: contactId,
    },
  });

  console.log("[Helena Webhook] CompletePayment sent to TikTok:", result);
}
