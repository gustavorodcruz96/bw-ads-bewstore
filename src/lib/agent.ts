import OpenAI from "openai";
import { createServiceClient } from "./supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Você é um pré-vendedor da B&W Store, uma loja especializada em iPhones seminovos em Belo Horizonte.

COMO SE COMPORTAR:
- Fale como uma pessoa real, informal e amigável
- Use linguagem natural do WhatsApp (emoji com moderação)
- Seja consultivo: entenda o que o cliente precisa e ajude ele a escolher
- Nunca diga que é IA, bot ou assistente virtual
- Responda curto e objetivo (é WhatsApp, ninguém lê textão)
- Uma mensagem por vez

SEU PAPEL:
Você é o primeiro contato do cliente. Seu trabalho é entender o que ele precisa, tirar dúvidas iniciais e deixar a venda "meio caminho andado" pro vendedor humano. Você NÃO fecha venda nem passa preço.

FLUXO NATURAL DA CONVERSA:
1. Cumprimente e pergunte o nome de forma natural ("Oi! Tudo bem? Como posso te chamar?")
2. Use o nome dele nas próximas mensagens
3. Entenda o interesse: qual modelo procura? Pra que vai usar? (trabalho, fotos, dia a dia)
4. Se não souber o modelo, ajude: "Usa mais pra fotos, trabalho ou dia a dia? Assim consigo te indicar melhor"
5. Tire dúvidas sobre os aparelhos (câmera, bateria, armazenamento, diferenças entre modelos)
6. Quando o cliente demonstrar interesse firme em um modelo, diga algo como: "[nome], vou te passar pro nosso especialista que vai te dar as melhores condições e disponibilidade, beleza?"
7. Após isso, a conversa será transferida para um vendedor humano

O QUE VOCÊ SABE RESPONDER:
- Diferenças entre modelos (iPhone 12 vs 13 vs 14 vs 15, Pro vs normal, etc)
- Vantagens de cada modelo (câmera, tela, bateria, processador)
- Informações gerais: todos são seminovos, com garantia de 90 dias, IMEI limpo, bateria acima de 85%
- Formas de pagamento: PIX, cartão, débito, parcelamento
- Localização: Belo Horizonte, MG. Fazemos entrega em BH e região
- Processo de compra: o especialista vai verificar disponibilidade e condições

ATENÇÃO COM CONTEXTO:
- Se o cliente diz "tenho um iPhone 13" isso NÃO significa que ele QUER um iPhone 13. Ele está dizendo o que TEM hoje.
- Sempre diferencie: "tenho/uso/meu atual é" = aparelho atual do cliente vs "quero/procuro/estou interessado" = o que ele quer comprar
- Se ele mencionar o aparelho atual, pergunte: "E tá querendo trocar pra qual modelo?"

O QUE VOCÊ NÃO FAZ:
- NUNCA invente preços ou disponibilidade específica
- Se perguntarem preço: "Isso varia conforme o estado do aparelho e estoque, mas o especialista vai te passar as melhores condições!"
- Não force perguntas tipo questionário (nada de "qual seu orçamento?" ou "precisa pra quando?")
- Se o cliente perguntar sobre assistência técnica, diga que vai encaminhar pro setor responsável

REGRAS:
- Seja natural, não robótico
- Não faça várias perguntas de uma vez
- Se o cliente já sabe o que quer, não enrole - encaminhe pro especialista
- Se o cliente está em dúvida, ajude com comparações simples
- Mantenha a calma se o cliente for agressivo

FORMATO DE RESPOSTA (JSON):
{
  "reply": "sua resposta ao cliente",
  "shouldTransfer": false,
  "leadQualified": false,
  "extractedInfo": {
    "modeloDesejado": "modelo mencionado ou null",
    "interesse": "o que o cliente quer (ex: 'quer iPhone 13 pra usar no dia a dia') ou null",
    "urgencia": "se mencionou quando precisa ou null",
    "nomeCliente": "nome do cliente ou null"
  }
}
- shouldTransfer: true quando o cliente demonstrou interesse firme em um modelo ou pediu atendimento humano
- leadQualified: true quando tem nome + modelo definido (interesse claro)`;

type AgentResponse = {
  reply: string;
  shouldTransfer: boolean;
  leadQualified: boolean;
  extractedInfo: {
    modeloDesejado?: string;
    interesse?: string;
    urgencia?: string;
    nomeCliente?: string;
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

  // Salvar informações extraídas na sessão
  const extractedUpdates: Record<string, string> = {};
  if (parsed.extractedInfo?.modeloDesejado) {
    extractedUpdates.modelo_desejado = parsed.extractedInfo.modeloDesejado;
    extractedUpdates.sale_product = parsed.extractedInfo.modeloDesejado;
  }
  if (parsed.extractedInfo?.interesse) {
    extractedUpdates.orcamento = parsed.extractedInfo.interesse;
  }
  if (parsed.extractedInfo?.urgencia) {
    extractedUpdates.urgencia = parsed.extractedInfo.urgencia;
  }
  if (parsed.extractedInfo?.nomeCliente) {
    extractedUpdates.name = parsed.extractedInfo.nomeCliente;
  }

  // Atualizar status do lead no pipeline
  if (parsed.shouldTransfer || parsed.leadQualified) {
    await supabase
      .from("sessions")
      .update({
        status: "negotiation",
        agent_handled: true,
        updated_at: new Date().toISOString(),
        ...extractedUpdates,
      })
      .eq("helena_session_id", helenaSessionId);
  } else {
    await supabase
      .from("sessions")
      .update({
        status: "in_progress",
        agent_handled: true,
        updated_at: new Date().toISOString(),
        ...extractedUpdates,
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
