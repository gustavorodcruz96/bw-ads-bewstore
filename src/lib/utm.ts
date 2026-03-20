const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ttclid",
] as const;

type UTMData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ttclid?: string;
  ttp?: string;
};

const STORAGE_KEY = "bw_utm_data";

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

export function buildHelenaWhatsAppURL(utmData: UTMData): string {
  const phone = process.env.NEXT_PUBLIC_HELENA_PHONE || "5531990742171";
  const message = encodeURIComponent(
    "Olá! Vi os iPhones seminovos no anúncio e quero saber mais! 📱"
  );

  const base = `https://api.helena.run/chat/v1/channel/wa/${phone}?text=${message}`;

  // Helena aceita tanto utm_source quanto source - enviar ambos para garantir
  const utmParams = [
    utmData.utm_source && `utm_source=${encodeURIComponent(utmData.utm_source)}`,
    utmData.utm_source && `source=${encodeURIComponent(utmData.utm_source)}`,
    utmData.utm_medium && `utm_medium=${encodeURIComponent(utmData.utm_medium)}`,
    utmData.utm_campaign && `utm_campaign=${encodeURIComponent(utmData.utm_campaign)}`,
    utmData.utm_content && `utm_content=${encodeURIComponent(utmData.utm_content)}`,
  ].filter(Boolean);

  return utmParams.length > 0 ? `${base}&${utmParams.join("&")}` : base;
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
