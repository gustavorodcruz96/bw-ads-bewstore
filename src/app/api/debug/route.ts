import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  const checks: Record<string, unknown> = {};

  // Check env vars
  checks.supabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  checks.supabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  checks.serviceKeyPrefix = process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20);

  // Test Supabase connection
  try {
    const supabase = createServiceClient();

    // Test insert
    const { data, error } = await supabase.from("sessions").insert({
      helena_session_id: `debug-${Date.now()}`,
      phone: "+5500000000000",
      name: "Debug Test",
      utm_source: "debug",
      status: "new",
    }).select();

    if (error) {
      checks.insertError = { message: error.message, code: error.code, details: error.details };
    } else {
      checks.insertSuccess = true;
      checks.insertedId = data?.[0]?.id;

      // Cleanup
      if (data?.[0]?.id) {
        await supabase.from("sessions").delete().eq("id", data[0].id);
        checks.cleanup = true;
      }
    }
  } catch (err) {
    checks.exception = String(err);
  }

  return NextResponse.json(checks);
}
