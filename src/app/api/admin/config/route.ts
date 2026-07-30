import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    tiktokPixel: !!process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    tiktokToken: !!process.env.TIKTOK_ACCESS_TOKEN,
    leaperScript: true,
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    leaperFlowUrl: "https://weare.leaper.com.br/flow/CSZ1785415950",
  });
}
