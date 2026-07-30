const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "ttclid",
] as const;

type UTMData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  ttclid?: string;
  ttp?: string;
};

const STORAGE_KEY = "bw_utm_data";
export const WHATSAPP_URL = "https://weare.leaper.com.br/flow/CSZ1785415950";

export function captureUTMs(): UTMData {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const data: UTMData = {};

  for (const param of UTM_PARAMS) {
    const value = params.get(param);
    if (value) {
      data[param] = value;
    }
  }

  // Captura o cookie _ttp do TikTok Pixel (se existir)
  const ttpMatch = document.cookie.match(/_ttp=([^;]+)/);
  if (ttpMatch) {
    data.ttp = ttpMatch[1];
  }

  // Salva no localStorage se houver dados novos
  if (Object.keys(data).length > 0) {
    const existing = getStoredUTMs();
    const merged = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  return getStoredUTMs();
}

export function getStoredUTMs(): UTMData {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function buildWhatsAppURL(): string {
  return WHATSAPP_URL;
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
