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

FLUXO DE TROCA (quando o cliente quer dar o aparelho atual como parte do pagamento):
Se o cliente mencionar "troca", "trocar", "dar meu aparelho", "usar como entrada":
1. Diga que aceita sim, e que precisa avaliar o aparelho dele
2. Peça as seguintes informações UMA DE CADA VEZ (não mande tudo junto):
   - Modelo e armazenamento do aparelho atual (ex: iPhone 13, 128GB)
   - Saúde da bateria (pode ver em Ajustes > Bateria > Saúde da Bateria)
   - Cor do aparelho
   - Se o Face ID está funcionando
   - Se tem marcas de uso (riscos, amassados)
   - Se o vidro traseiro e a tela estão íntegros (trincados ou quebrados?)
   - Se as câmeras estão íntegras
   - Se já teve contato com água
   - Se já teve alguma peça trocada
3. Peça fotos do aparelho (frente, traseira e laterais)
4. Depois de coletar tudo, diga: "[nome], anotei tudo! Vou passar pro nosso especialista avaliar seu aparelho e te dar o melhor valor de troca, beleza?"
5. Marque shouldTransfer: true

O QUE VOCÊ SABE RESPONDER:
- Diferenças entre modelos (iPhone 12 vs 13 vs 14 vs 15, Pro vs normal, etc)
- Vantagens de cada modelo (câmera, tela, bateria, processador)
- Informações gerais: todos são seminovos, com garantia de 90 dias, IMEI limpo, bateria acima de 85%
- Formas de pagamento: PIX, cartão, débito, parcelamento
- Localização: Belo Horizonte, MG. Fazemos entrega em BH e região
- Processo de compra: o especialista vai verificar disponibilidade e condições
- Aceitamos aparelhos usados como parte do pagamento (troca)

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
- Quando receber transcrição de áudio, responda normalmente como se tivesse ouvido

FORMATO DE RESPOSTA (JSON):
{
  "reply": "sua resposta ao cliente",
  "shouldTransfer": false,
  "leadQualified": false,
  "extractedInfo": {
    "modeloDesejado": "modelo que quer COMPRAR ou null",
    "aparelhoAtual": "modelo que TEM HOJE (pra troca) ou null",
    "interesse": "resumo do que o cliente quer ou null",
    "urgencia": "se mencionou quando precisa ou null",
    "nomeCliente": "nome do cliente ou null"
  }
}
- shouldTransfer: true quando o cliente demonstrou interesse firme em um modelo, completou o fluxo de troca, ou pediu atendimento humano
- leadQualified: true quando tem nome + modelo definido (interesse claro)`;

type AgentResponse = {
  reply: string;
  shouldTransfer: boolean;
  leadQualified: boolean;
  extractedInfo: {
    modeloDesejado?: string;
    aparelhoAtual?: string;
    interesse?: string;
    urgencia?: string;
    nomeCliente?: string;
  };
};

// Transcrever áudio usando OpenAI Whisper
async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    // Baixar o arquivo de áudio
    const response = await fetch(audioUrl);
    if (!response.ok) {
      console.error(`[Agent] Failed to download audio: ${response.status}`);
      return "";
    }

    const audioBuffer = await response.arrayBuffer();
    const audioFile = new File([audioBuffer], "audio.ogg", { type: "audio/ogg" });

    // Enviar para Whisper
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      language: "pt",
    });

    console.log(`[Agent] Audio transcribed: "${transcription.text.substring(0, 100)}"`);
    return transcription.text;
  } catch (error) {
    console.error("[Agent] Transcription error:", error instanceof Error ? error.message : error);
    return "";
  }
}

// Buscar histórico de mensagens da sessão no Helena
async function fetchHelenaHistory(sessionId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.helena.run/chat/v1/session/${sessionId}/message?limit=20&order=createdAt:asc`,
      { headers: { Authorization: `Bearer ${process.env.HELENA_API_TOKEN}` } }
    );
    if (!res.ok) return "";

    const data = await res.json();
    const items = data?.items || data || [];
    if (!Array.isArray(items) || items.length === 0) return "";

    const lines = items.map((msg: Record<string, unknown>) => {
      const dir = msg.direction === "FROM_HUB" ? "Cliente" : "Vendedor";
      const text = String(msg.text || "[mídia]").substring(0, 200);
      return `${dir}: ${text}`;
    });

    return lines.join("\n");
  } catch (e) {
    console.error("[Agent] Failed to fetch Helena history:", e);
    return "";
  }
}

export async function processMessage(
  helenaSessionId: string,
  messageText: string,
  messageType: string = "text",
  audioUrl?: string
): Promise<AgentResponse> {
  const supabase = createServiceClient();

  // Buscar histórico do agente (nossas interações anteriores)
  const { data: history } = await supabase
    .from("agent_logs")
    .select("role, content")
    .eq("helena_session_id", helenaSessionId)
    .order("created_at", { ascending: true })
    .limit(20);

  // Se é a primeira interação do agente, buscar histórico do Helena (conversas anteriores com vendedores)
  let helenaContext = "";
  if (!history || history.length === 0) {
    helenaContext = await fetchHelenaHistory(helenaSessionId);
    if (helenaContext) {
      console.log(`[Agent] Loaded ${helenaContext.split("\n").length} messages from Helena history`);
    }
  }

  // Montar mensagens para o OpenAI
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Adicionar contexto do Helena se existir (como mensagem de sistema adicional)
  if (helenaContext) {
    messages.push({
      role: "system",
      content: `CONTEXTO: Este cliente já conversou antes com vendedores. Histórico recente:\n\n${helenaContext}\n\nUse este contexto para entender o que o cliente já discutiu, mas NÃO repita perguntas que já foram respondidas. Continue a conversa naturalmente.`,
    });
  }

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

  if (messageType === "audio" && audioUrl) {
    const transcription = await transcribeAudio(audioUrl);
    if (transcription) {
      userContent = `[Áudio transcrito]: ${transcription}`;
    } else {
      userContent = "[Cliente enviou um áudio mas não foi possível transcrever. Peça para digitar a mensagem.]";
    }
  } else if (messageType === "image") {
    userContent = "[Cliente enviou uma foto/imagem]";
  } else if (messageType === "video") {
    userContent = "[Cliente enviou um vídeo]";
  } else if (messageType === "audio" && !audioUrl) {
    userContent = "[Cliente enviou um áudio mas não foi possível acessar. Peça para digitar a mensagem.]";
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
