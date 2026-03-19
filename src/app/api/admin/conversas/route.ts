import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const allowedFields = ["name", "status", "sale_value", "sale_product"];
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    for (const field of allowedFields) {
      if (field in fields) {
        updates[field] = fields[field];
      }
    }

    const { data, error } = await supabase
      .from("sessions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error("[Admin Conversas PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
