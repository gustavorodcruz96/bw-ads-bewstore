import crypto from "crypto";

const TIKTOK_API_URL =
  "https://business-api.tiktok.com/open_api/v1.3/event/track/";

type TikTokEventParams = {
  event: string;
  event_id: string;
  timestamp?: string;
  context?: {
    user_agent?: string;
    ip?: string;
    page?: { url?: string; referrer?: string };
  };
  properties?: Record<string, unknown>;
  user?: {
    external_id?: string;
    phone_number?: string;
    email?: string;
    ttp?: string;
    ttclid?: string;
  };
};

function sha256Hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function hashUserData(user: TikTokEventParams["user"]): Record<string, string> {
  if (!user) return {};
  const hashed: Record<string, string> = {};

  if (user.external_id) hashed.external_id = sha256Hash(user.external_id);
  if (user.phone_number) hashed.phone_number = sha256Hash(user.phone_number);
  if (user.email) hashed.email = sha256Hash(user.email);
  if (user.ttp) hashed.ttp = user.ttp; // ttp não é hasheado
  if (user.ttclid) hashed.ttclid = user.ttclid; // ttclid não é hasheado

  return hashed;
}

export async function sendTikTokEvent(params: TikTokEventParams) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const pixelCode = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  if (!accessToken || !pixelCode) {
    console.warn("[TikTok] Missing TIKTOK_ACCESS_TOKEN or TIKTOK_PIXEL_ID");
    return null;
  }

  const testEventCode = process.env.TIKTOK_TEST_EVENT_CODE;

  const payload: Record<string, unknown> = {
    event: params.event,
    event_id: params.event_id,
    timestamp: params.timestamp || new Date().toISOString(),
  };

  if (params.context) {
    payload.context = {
      user_agent: params.context.user_agent,
      ip: params.context.ip,
      page: params.context.page,
    };
  }

  if (params.properties) {
    payload.properties = params.properties;
  }

  if (params.user) {
    payload.user = hashUserData(params.user);
  }

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  const body = {
    event_source: "web",
    event_source_id: pixelCode,
    data: [payload],
  };

  try {
    const response = await fetch(TIKTOK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.code !== 0) {
      console.error("[TikTok] Events API error:", result);
    }

    return result;
  } catch (error) {
    console.error("[TikTok] Failed to send event:", error);
    return null;
  }
}
