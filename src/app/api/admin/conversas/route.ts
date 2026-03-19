import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ sessions: data || [] });
  } catch (error) {
    console.error("[Admin Conversas] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
