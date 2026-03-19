import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ads.bewstore.com.br";

  return NextResponse.json({
    tiktokPixel: !!process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    tiktokToken: !!process.env.TIKTOK_ACCESS_TOKEN,
    helenaToken: !!process.env.HELENA_API_TOKEN,
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    webhookUrl: `${siteUrl}/api/helena/webhook`,
  });
}
