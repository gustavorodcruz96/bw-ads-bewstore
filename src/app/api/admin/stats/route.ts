import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Contar eventos por tipo
    const [viewContent, clickButton, contact, completePayment, revenue] =
      await Promise.all([
        supabase
          .from("tracking_events")
          .select("id", { count: "exact", head: true })
          .eq("event_type", "ViewContent"),
        supabase
          .from("tracking_events")
          .select("id", { count: "exact", head: true })
          .eq("event_type", "ClickButton"),
        supabase
          .from("tracking_events")
          .select("id", { count: "exact", head: true })
          .eq("event_type", "Contact"),
        supabase
          .from("tracking_events")
          .select("id", { count: "exact", head: true })
          .eq("event_type", "CompletePayment"),
        supabase
          .from("sessions")
          .select("sale_value")
          .eq("status", "sale")
          .not("sale_value", "is", null),
      ]);

    const totalRevenue =
      revenue.data?.reduce((sum, s) => sum + (Number(s.sale_value) || 0), 0) ??
      0;

    return NextResponse.json({
      viewContent: viewContent.count ?? 0,
      clickButton: clickButton.count ?? 0,
      contact: contact.count ?? 0,
      completePayment: completePayment.count ?? 0,
      totalRevenue,
    });
  } catch (error) {
    console.error("[Admin Stats] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
