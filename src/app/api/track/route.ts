import { NextRequest, NextResponse } from "next/server";
import { sendTikTokEvent } from "@/lib/tiktok";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, event_id, properties, utm, page_url, referrer } = body;

    if (!event || !event_id) {
      return NextResponse.json(
        { error: "Missing event or event_id" },
        { status: 400 }
      );
    }

    // Extrair IP e User-Agent do request (server-side enrichment)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    // Enviar ao TikTok Events API (server-side)
    const result = await sendTikTokEvent({
      event,
      event_id,
      context: {
        user_agent: userAgent,
        ip,
        page: { url: page_url, referrer },
      },
      properties,
      user: {
        ttclid: utm?.ttclid,
        ttp: utm?.ttp,
      },
    });

    // Salvar no Supabase (tracking_events table)
    try {
      const supabase = createServiceClient();
      await supabase.from("tracking_events").insert({
        event_type: event,
        event_id,
        ttclid: utm?.ttclid || null,
        ttp: utm?.ttp || null,
        utm_source: utm?.utm_source || null,
        utm_medium: utm?.utm_medium || null,
        utm_campaign: utm?.utm_campaign || null,
        utm_content: utm?.utm_content || null,
        ip_address: ip !== "unknown" ? ip : null,
        user_agent: userAgent || null,
        page_url: page_url || null,
      });
    } catch (dbError) {
      // Log but don't fail the request — TikTok event was already sent
      console.error("[Track API] Failed to save to Supabase:", dbError);
    }

    return NextResponse.json({ success: true, tiktok: result });
  } catch (error) {
    console.error("[Track API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
