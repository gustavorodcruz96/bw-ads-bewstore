import OpenAI from "openai";
import { createServiceClient } from "./supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Você é um atendente da Bew Store, uma loja de iPhones seminovos em Belo Horizonte.

COMO SE COMPORTAR:
- Fale como um vendedor real, informal e amigável
- Use linguagem natural do WhatsApp (pode usar emoji com moderação)
- Seja consultivo: ajude o cliente a encontrar o melhor iPhone pro uso dele
- Nunca diga que é IA, bot ou assistente virtual
- Responda de forma curta e objetiva (é WhatsApp, não email)

SEU OBJETIVO:
1. Entender o que o cliente procura (modelo, cor, armazenamento)
2. Saber o orçamento do cliente
3. Entender a urgência (precisa pra quando?)
4. Quando tiver essas 3 informações, falar: "Deixa eu verificar aqui as opções que temos pra você, um momento!"
5. Após isso, a conversa será transferida para um vendedor humano

INFORMAÇÕES DA BEW STORE:
- Todos os iPhones são seminovos com garantia de 90 dias
- IMEI limpo e verificado
- Bateria acima de 85%
- Aceitamos PIX, cartão de crédito, débito e parcelamento
- Localização: Belo Horizonte, MG
- Fazemos entrega em BH e região

REGRAS:
- NUNCA invente preços ou disponibilidade de modelos específicos
- Se perguntarem preço, diga "depende do modelo e condição, deixa eu verificar as opções"
- Se o cliente perguntar algo fora do escopo, diga que vai passar para o setor responsável
- Se o cliente ficar agressivo, mantenha a calma e profissionalismo

FORMATO DE RESPOSTA (JSON):
{
  "reply": "sua resposta ao cliente",
  "shouldTransfer": false,
  "leadQualified": false,
  "extractedInfo": {
    "modeloDesejado": "se mencionou ou null",
    "orcamento": "se mencionou ou null",
    "urgencia": "se mencionou ou null"
  }
}
- shouldTransfer: true quando lead qualificado (tem modelo + orçamento + urgência) ou pediu atendimento humano
- leadQualified: true quando coletou as 3 informações`;

type AgentResponse = {
  reply: string;
  shouldTransfer: boolean;
  leadQualified: boolean;
  extractedInfo: {
    modeloDesejado?: string;
    orcamento?: string;
    urgencia?: string;
  };
};

export async function processMessage(
  helenaSessionId: string,
  messageText: string,
  messageType: string = "text"
): Promise<AgentResponse> {
  const supabase = createServiceClient();

  // Buscar histórico da conversa
  const { data: history } = await supabase
    .from("agent_logs")
    .select("role, content")
    .eq("helena_session_id", helenaSessionId)
    .order("created_at", { ascending: true })
    .limit(20);

  // Montar mensagens para o OpenAI
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    }
  }

  // Mensagem atual
  let userContent = messageText;
  if (messageType === "audio") {
    userContent = "[Cliente enviou um áudio que não consegui ouvir no momento]";
  } else if (messageType === "image") {
    userContent = "[Cliente enviou uma imagem]";
  }

  messages.push({ role: "user", content: userContent });

  // Chamar OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content || "";
  let parsed: AgentResponse;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    parsed = {
      reply: responseText || "Oi! Tudo bem? Como posso te ajudar?",
      shouldTransfer: false,
      leadQualified: false,
      extractedInfo: {},
    };
  }

  // Salvar no histórico
  const tokensUsed = completion.usage?.total_tokens || 0;

  await supabase.from("agent_logs").insert([
    {
      helena_session_id: helenaSessionId,
      role: "user",
      content: userContent,
      tokens_used: 0,
    },
    {
      helena_session_id: helenaSessionId,
      role: "assistant",
      content: parsed.reply,
      tokens_used: tokensUsed,
    },
  ]);

  // Atualizar status do lead no pipeline
  if (parsed.shouldTransfer || parsed.leadQualified) {
    await supabase
      .from("sessions")
      .update({
        status: "negotiation",
        agent_handled: true,
        updated_at: new Date().toISOString(),
      })
      .eq("helena_session_id", helenaSessionId);
  } else {
    await supabase
      .from("sessions")
      .update({
        status: "in_progress",
        agent_handled: true,
        updated_at: new Date().toISOString(),
      })
      .eq("helena_session_id", helenaSessionId);
  }

  return parsed;
}

export async function isAgentEnabled(): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "agent_enabled")
    .single();

  return data?.value === "true";
}
