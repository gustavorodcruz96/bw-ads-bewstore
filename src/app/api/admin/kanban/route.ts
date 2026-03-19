import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return NextResponse.json({ leads: data || [] });
  } catch (error) {
    console.error("[Admin Kanban] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { id, status } = await request.json();

    const validStatuses = ["new", "in_progress", "negotiation", "sale", "lost"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { error } = await supabase
      .from("sessions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Kanban] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
