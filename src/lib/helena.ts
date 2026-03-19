const HELENA_BASE_URL = "https://api.helena.run";

function getHeaders(): HeadersInit {
  const token = process.env.HELENA_API_TOKEN;
  if (!token) {
    throw new Error("Missing HELENA_API_TOKEN");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function helenaFetch(path: string, options?: RequestInit) {
  const url = `${HELENA_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Helena API error (${response.status}): ${error}`);
  }

  return response.json();
}

// Webhooks
export async function listWebhookEvents() {
  return helenaFetch("/core/v1/webhook/event");
}

export async function createWebhookSubscription(url: string, events: string[]) {
  return helenaFetch("/core/v1/webhook/subscription", {
    method: "POST",
    body: JSON.stringify({ url, events }),
  });
}

export async function listWebhookSubscriptions() {
  return helenaFetch("/core/v1/webhook/subscription");
}

// Contatos
export async function getContactByPhone(phone: string) {
  return helenaFetch(`/core/v1/contact/phonenumber/${phone}`);
}

export async function updateContactTags(
  contactId: string,
  tags: string[]
) {
  return helenaFetch(`/core/v1/contact/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tags }),
  });
}

// Sessões (Conversas)
export async function listSessions(params?: { status?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.limit) query.set("limit", params.limit.toString());
  return helenaFetch(`/chat/v2/session?${query.toString()}`);
}

export async function getSession(sessionId: string) {
  return helenaFetch(`/chat/v2/session/${sessionId}`);
}

// Transferir sessão para departamento (tira do chatbot)
export async function transferSession(
  sessionId: string,
  departmentId: string
) {
  return helenaFetch(`/chat/v1/session/${sessionId}/transfer`, {
    method: "PUT",
    body: JSON.stringify({ departmentId }),
  });
}

// Alterar sessão (pode pausar chatbot)
export async function updateSession(
  sessionId: string,
  data: Record<string, unknown>
) {
  return helenaFetch(`/chat/v2/session/${sessionId}/partial`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function listSessionMessages(sessionId: string) {
  return helenaFetch(`/chat/v1/session/${sessionId}/message`);
}

// Mensagens
export async function sendMessage(
  channelId: string,
  contactId: string,
  text: string
) {
  return helenaFetch("/chat/v1/message/send", {
    method: "POST",
    body: JSON.stringify({
      channelId,
      contactId,
      text,
    }),
  });
}

// Etiquetas
export async function listTags() {
  return helenaFetch("/core/v1/tag");
}

// CRM - Painéis
export async function listPanels() {
  return helenaFetch("/core/v1/panel");
}

export async function createCard(
  panelId: string,
  data: { title: string; contactId?: string; columnId?: string }
) {
  return helenaFetch("/core/v1/panel/card", {
    method: "POST",
    body: JSON.stringify({ panelId, ...data }),
  });
}
