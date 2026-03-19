import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("agent_logs")
      .select("id, role, content, tokens_used, created_at")
      .eq("helena_session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ logs: data || [] });
  } catch (error) {
    console.error("[Admin Agent Logs] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent logs" },
      { status: 500 }
    );
  }
}
