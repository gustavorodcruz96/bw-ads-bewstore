import { createClient } from "@supabase/supabase-js";

// Server-side - usa service_role key (NUNCA expor no client)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("[Supabase] Missing URL or SERVICE_ROLE_KEY", { url: !!url, key: !!key });
    throw new Error("Supabase not configured");
  }

  return createClient(url, key);
}
