import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "agent_enabled")
      .single();

    return NextResponse.json({ enabled: data?.value === "true" });
  } catch (error) {
    console.error("[Admin Agente] Error:", error);
    return NextResponse.json({ enabled: false });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { enabled } = await request.json();
    const supabase = createServiceClient();

    await supabase
      .from("settings")
      .update({ value: enabled ? "true" : "false", updated_at: new Date().toISOString() })
      .eq("key", "agent_enabled");

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    console.error("[Admin Agente] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
