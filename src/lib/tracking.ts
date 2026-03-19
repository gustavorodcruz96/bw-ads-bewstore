import { getStoredUTMs, generateEventId } from "./utm";

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      instance: (id: string) => {
        track: (event: string, params?: Record<string, unknown>) => void;
      };
    };
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

  // 2. Server-side: enviar para nossa API (que repassa ao TikTok Events API)
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

export function trackViewContent() {
  return trackEvent({
    event: "ViewContent",
    properties: {
      content_type: "product",
      content_id: "iphone-seminovo-lp",
      content_name: "iPhone Seminovo - Landing Page",
    },
  });
}

export function trackClickButton() {
  return trackEvent({
    event: "ClickButton",
    properties: {
      content_type: "product",
      content_id: "whatsapp-cta",
      content_name: "WhatsApp CTA - iPhone Seminovo",
    },
  });
}
