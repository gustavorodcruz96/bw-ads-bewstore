import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { processMessage } from "@/lib/agent";
import { sendMessage } from "@/lib/helena";

// Vercel Cron: roda a cada hora
// Configurar em vercel.json: { "crons": [{ "path": "/api/cron/followup", "schedule": "0 * * * *" }] }

export async function GET(request: NextRequest) {
  // Verificar auth do cron (Vercel envia header especial)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Buscar sessões em "negotiation" onde:
    // - agent_handled = false (humano assumiu mas pode ter parado)
    // - updated_at > 1 hora atrás
    // - status = "negotiation" (não sale/completed)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: staleSessions } = await supabase
      .from("sessions")
      .select("helena_session_id, name, utm_source, updated_at")
      .eq("status", "negotiation")
      .eq("agent_handled", false)
      .lt("updated_at", oneHourAgo);

    if (!staleSessions || staleSessions.length === 0) {
      console.log("[Cron] No stale sessions found");
      return NextResponse.json({ processed: 0 });
    }

    console.log(`[Cron] Found ${staleSessions.length} stale sessions for follow-up`);

    let processed = 0;

    for (const session of staleSessions) {
      try {
        // Verificar se a última mensagem é do atendente (não do cliente)
        // Se o cliente respondeu por último, o atendente que demorou - não fazer follow-up
        const msgRes = await fetch(
          `https://api.helena.run/chat/v1/session/${session.helena_session_id}/message?limit=1&order=createdAt:desc`,
          { headers: { Authorization: `Bearer ${process.env.HELENA_API_TOKEN}` } }
        );

        if (!msgRes.ok) continue;

        const msgData = await msgRes.json();
        const items = msgData?.items || [];
        const lastMsg = items[0];

        if (!lastMsg) continue;

        // Se a última mensagem é do atendente (TO_HUB) e passou 1h sem resposta do cliente
        // → não fazer follow-up (o cliente que não respondeu)
        // Se a última mensagem é do cliente (FROM_HUB) e o atendente não respondeu em 1h
        // → IA faz follow-up
        if (lastMsg.direction !== "FROM_HUB") {
          console.log(`[Cron] Session ${session.helena_session_id}: last msg from agent, skipping`);
          continue;
        }

        console.log(`[Cron] Follow-up for session ${session.helena_session_id}`);

        // Reativar agente na sessão
        await supabase
          .from("sessions")
          .update({ agent_handled: true, status: "in_progress", updated_at: new Date().toISOString() })
          .eq("helena_session_id", session.helena_session_id);

        // Gerar mensagem de follow-up com contexto
        const response = await processMessage(
          session.helena_session_id,
          "[SISTEMA: O cliente enviou uma mensagem há mais de 1 hora e nenhum atendente respondeu. Faça um follow-up natural e amigável, retomando o assunto da conversa. NÃO mencione que ninguém respondeu, apenas retome naturalmente.]",
          "system"
        );

        if (response.reply) {
          await sendMessage(session.helena_session_id, response.reply);
          console.log(`[Cron] Follow-up sent: ${session.helena_session_id}`);
          processed++;
        }
      } catch (err) {
        console.error(`[Cron] Error processing ${session.helena_session_id}:`, err);
      }
    }

    return NextResponse.json({ processed, total: staleSessions.length });
  } catch (error) {
    console.error("[Cron] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
