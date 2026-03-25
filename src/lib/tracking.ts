import { getStoredUTMs, generateEventId } from "./utm";

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      instance: (id: string) => {
        track: (event: string, params?: Record<string, unknown>) => void;
      };
    };
    dataLayer?: Record<string, unknown>[];
  }
}

type TrackEventParams = {
  event: string;
  properties?: Record<string, unknown>;
  eventId?: string;
};

export async function trackEvent({ event, properties, eventId }: TrackEventParams) {
  const id = eventId || generateEventId();
  const utmData = getStoredUTMs();

  // 1. Client-side: TikTok Pixel
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, {
      ...properties,
      event_id: id,
    });
  }

  // 2. GTM dataLayer (Google Ads conversions)
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...properties,
      event_id: id,
    });
  }

  // 3. Server-side: enviar para nossa API (que repassa ao TikTok Events API)
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        event_id: id,
        properties,
        utm: utmData,
        page_url: typeof window !== "undefined" ? window.location.href : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    });
  } catch {
    // Falha silenciosa - não deve bloquear a experiência do usuário
  }
}

export function trackViewContent(options?: { content_id?: string; content_name?: string }) {
  return trackEvent({
    event: "ViewContent",
    properties: {
      content_type: "product",
      content_id: options?.content_id ?? "iphone-seminovo-lp",
      content_name: options?.content_name ?? "iPhone Seminovo - Landing Page",
    },
  });
}

export function trackClickButton(options?: { content_id?: string; content_name?: string }) {
  return trackEvent({
    event: "ClickButton",
    properties: {
      content_type: "product",
      content_id: options?.content_id ?? "whatsapp-cta",
      content_name: options?.content_name ?? "WhatsApp CTA - iPhone Seminovo",
    },
  });
}
