---
title: "Problemas Identificados na Integração Helena + Agente IA — Bew Store"
subtitle: "Documento técnico para reunião com equipe Helena"
date: "25 de Março de 2026"
author: "Bew Store — Equipe de Tecnologia"
---

<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; line-height: 1.6; }
  h1 { color: #1a1a1a; border-bottom: 3px solid #2563eb; padding-bottom: 8px; font-size: 1.6em; }
  h2 { color: #2563eb; margin-top: 2em; font-size: 1.3em; }
  h3 { color: #374151; font-size: 1.1em; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.9em; }
  th { background-color: #2563eb; color: white; padding: 10px 12px; text-align: left; }
  td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) { background-color: #f9fafb; }
  code { background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
  pre { background-color: #f3f4f6; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 0.85em; }
  blockquote { border-left: 4px solid #2563eb; margin: 1em 0; padding: 0.5em 1em; background: #eff6ff; }
  .critico { color: #dc2626; font-weight: bold; }
  .alto { color: #ea580c; font-weight: bold; }
  .medio { color: #ca8a04; font-weight: bold; }
  .baixo { color: #16a34a; font-weight: bold; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 2em 0; }
</style>

# Problemas Identificados na Integração Helena + Agente IA

**Empresa:** Bew Store (ads.bewstore.com.br)
**Data:** 25 de Março de 2026
**Contexto:** Operamos um agente de IA (pré-atendente) que responde automaticamente via WhatsApp usando a API do Helena. O agente qualifica leads vindos de campanhas TikTok Ads e encaminha para vendedores humanos.

**Stack:** Next.js (Vercel) + OpenAI + Supabase + Helena API (webhooks + REST)

---

## Resumo Executivo

Identificamos **11 problemas técnicos** na integração entre nosso agente IA e a plataforma Helena. Os 3 mais críticos causam: respostas da IA quando um humano já assumiu, vendas não registradas no tracking, e leads abandonados sem atendimento.

| # | Problema | Impacto | Prioridade |
|---|----------|---------|------------|
| 1 | Race condition — IA responde junto com humano | IA interfere no atendimento | <span class="critico">CRITICO</span> |
| 2 | GET extra a cada mensagem (performance) | Lentidão + risco de rate limit | <span class="alto">ALTO</span> |
| 3 | contactId ≠ sessionId na detecção de venda | Vendas não registram | <span class="critico">CRITICO</span> |
| 4 | Transferência não acontece de verdade | Leads ficam sem atendimento | <span class="critico">CRITICO</span> |
| 5 | Conflito com chatbot nativo do Helena | Mensagens duplicadas | <span class="alto">ALTO</span> |
| 6 | Webhook sem validação de segurança | Vulnerabilidade | <span class="medio">MEDIO</span> |
| 7 | Webhook sem retry / ordenação | Mensagens perdidas em deploy | <span class="alto">ALTO</span> |
| 8 | MESSAGE_RECEIVED chega antes de SESSION_NEW | Sessões criadas fora de ordem | <span class="medio">MEDIO</span> |
| 9 | UTM se perde em conversas recorrentes | Tracking de campanha quebrado | <span class="alto">ALTO</span> |
| 10 | URL de áudio pode expirar | Transcrição falha | <span class="medio">MEDIO</span> |
| 11 | API v1 vs v2 — qual usar? | Risco de deprecação | <span class="baixo">BAIXO</span> |

---

## Problema 1 — Race Condition: IA Responde Junto com o Humano

**Severidade:** <span class="critico">CRITICO</span>

**O que acontece:** Quando um vendedor assume a conversa no Helena, existe um delay entre ele assumir e o webhook `SESSION_UPDATE` chegar no nosso servidor. Nesse intervalo, se o cliente manda mensagem, a IA responde antes de saber que o humano assumiu.

**Fluxo atual (bugado):**

```
Cliente manda mensagem
  → Webhook MESSAGE_RECEIVED chega ao nosso servidor (~1s)
  → IA processa e responde (~2-3s)

Enquanto isso...
  → Vendedor assume a conversa no Helena
  → Webhook SESSION_UPDATE chega (~5-10s depois?)
  → Nosso servidor desativa IA (tarde demais)
```

**Resultado:** Cliente recebe resposta da IA E do vendedor ao mesmo tempo.

### Perguntas para o Helena:

1. Qual o delay médio entre o vendedor assumir a conversa e o webhook `SESSION_UPDATE` ser disparado?
2. O payload do webhook `MESSAGE_RECEIVED` inclui algum campo que indique que um humano já está atribuído (ex: `userId`, `assignedTo`)?
3. Existe algum webhook tipo `AGENT_ASSIGNED` que dispare instantaneamente quando alguém assume?
4. Existe como fazer o Helena "segurar" o envio de `MESSAGE_RECEIVED` até confirmar se tem humano atribuído?

---

## Problema 2 — Checagem de Humano a Cada Mensagem (Performance)

**Severidade:** <span class="alto">ALTO</span>

**O que acontece:** Para contornar o problema 1, fazemos um `GET /chat/v2/session/{id}` a **cada mensagem recebida** do cliente, verificando se `userId` está preenchido (indicando humano atribuído). Isso adiciona latência e consome cota da API.

**Chamada atual:**

```
GET https://api.helena.run/chat/v2/session/{sessionId}
→ Verificar se session.userId existe E session.status === "IN_PROGRESS"
```

### Perguntas para o Helena:

1. Qual o rate limit da API v2? (requisições por minuto/segundo)
2. O payload do webhook `MESSAGE_RECEIVED` poderia incluir o `userId` da sessão? Assim eliminamos esse GET.
3. Existe algum campo no `content` do webhook de mensagem que já contenha essa informação?

---

## Problema 3 — Venda Não Registra (contactId ≠ sessionId)

**Severidade:** <span class="critico">CRITICO</span>

**O que acontece:** Quando detectamos a tag "venda-confirmada" via webhook `CONTACT_TAG_UPDATE`, tentamos atualizar a sessão no banco. Porém, o webhook envia o `contactId` e nós buscamos por `helena_session_id`, que é um ID diferente. O update não encontra nada.

**Código problemático:**

```javascript
// Webhook CONTACT_TAG_UPDATE
const contactId = content.id;  // ← Este é o ID do CONTATO

await supabase
  .from("sessions")
  .update({ status: "sale" })
  .eq("helena_session_id", contactId);  // ← BUG: contactId ≠ sessionId
```

**Resultado:** Vendas confirmadas não são registradas, e o evento `CompletePayment` do TikTok não é enviado corretamente.

### Perguntas para o Helena:

1. No webhook `CONTACT_TAG_UPDATE`, o payload inclui o `sessionId` da conversa ativa, ou apenas o `contactId`?
2. Um contato pode ter múltiplas sessões ativas simultaneamente?
3. Existe algum webhook que dispare quando uma tag é adicionada à **sessão** (não ao contato)?
4. Qual a estrutura completa do payload de `CONTACT_TAG_UPDATE`?

---

## Problema 4 — Transferência Não Acontece de Verdade

**Severidade:** <span class="critico">CRITICO</span>

**O que acontece:** Quando a IA qualifica o lead e marca `shouldTransfer: true`, ela envia a mensagem "vou te passar pro especialista" mas **não executa nenhuma ação no Helena**. O lead fica no limbo — nenhum vendedor é notificado ou atribuído.

**Fluxo esperado vs. atual:**

```
ESPERADO: IA qualifica → transfere sessão → vendedor é notificado → vendedor atende
ATUAL:    IA qualifica → manda msg de despedida → nada acontece → lead abandona
```

### Perguntas para o Helena:

1. Qual a forma correta de notificar vendedores via API que um lead está pronto?
2. `PUT /chat/v1/session/{id}/transfer` com `departmentId` faz a sessão aparecer na fila dos vendedores automaticamente?
3. É possível atribuir a um vendedor específico via API (round-robin)?
4. Quando eu transfiro para um departamento, o chatbot nativo do Helena para de responder automaticamente?
5. Existe endpoint para listar vendedores online em um departamento?

---

## Problema 5 — Conflito com Chatbot Nativo do Helena

**Severidade:** <span class="alto">ALTO</span>

**O que acontece:** Não está claro se o chatbot nativo do Helena está desativado para conversas que vêm da landing page. Se ambos (nosso agente IA + chatbot Helena) respondem, o cliente recebe mensagens duplicadas ou contraditórias.

### Perguntas para o Helena:

1. Como desativar o chatbot nativo para conversas específicas (ex: vindas de UTM)?
2. Transferir para um departamento sem chatbot configurado resolve o problema?
3. O campo `origin: "BOT"` no webhook identifica exclusivamente mensagens do chatbot Helena?
4. É possível configurar: "se a conversa tem UTM, não ativar chatbot nativo"?
5. Qual departamento/configuração garante que só nosso agente responde?

---

## Problema 6 — Webhook Sem Validação de Segurança

**Severidade:** <span class="medio">MEDIO</span>

**O que acontece:** Qualquer pessoa que descubra a URL do nosso webhook pode enviar payloads falsos, simulando mensagens de clientes ou eventos de venda.

### Perguntas para o Helena:

1. Vocês enviam algum header de autenticação nos webhooks (ex: `X-Helena-Signature`, HMAC SHA-256)?
2. Existe IP fixo de saída dos webhooks para whitelist?
3. Suportam webhook secret/token para validação?
4. Qual a recomendação de segurança para proteger endpoints de webhook?

---

## Problema 7 — Webhook Sem Retry e Sem Garantia de Ordem

**Severidade:** <span class="alto">ALTO</span>

**O que acontece:** Se nosso servidor estiver fora do ar por alguns segundos (deploy no Vercel, cold start), perdemos webhooks. Mensagens de clientes simplesmente desaparecem e a IA nunca responde.

### Perguntas para o Helena:

1. Vocês fazem retry de webhooks que recebem HTTP 5xx ou timeout?
2. Se sim, quantas tentativas? Com qual intervalo entre elas?
3. Os webhooks têm garantia de ordem cronológica?
4. Existe um `eventId` ou `messageId` único para deduplicação?
5. Existe endpoint para listar webhooks não entregues ou fazer replay manual?
6. Qual o timeout para considerar que o webhook falhou?

---

## Problema 8 — MESSAGE_RECEIVED Chega Antes de SESSION_NEW

**Severidade:** <span class="medio">MEDIO</span>

**O que acontece:** Em alguns casos, o webhook `MESSAGE_RECEIVED` chega ao nosso servidor antes do `SESSION_NEW`. Como a sessão ainda não existe no nosso banco, precisamos criá-la on-the-fly com um GET extra na API. Isso é frágil e adiciona complexidade.

### Perguntas para o Helena:

1. É comportamento esperado que `MESSAGE_RECEIVED` chegue antes de `SESSION_NEW`?
2. Existe garantia de ordem entre esses dois eventos para a mesma conversa?
3. Existe algum evento alternativo mais confiável para detectar novas conversas?

---

## Problema 9 — UTM Se Perde em Conversas Recorrentes

**Severidade:** <span class="alto">ALTO</span>

**O que acontece:** O UTM que passamos pela landing page (via link WhatsApp com parâmetros) nem sempre aparece no webhook `SESSION_NEW`. Isso acontece especialmente quando o contato já existe no Helena (cliente recorrente).

**Impacto:** Sem UTM, não conseguimos atribuir o lead à campanha do TikTok, e o ROI das campanhas fica impreciso.

### Perguntas para o Helena:

1. Como funciona a propagação de UTM? Se o contato já existe, o UTM da nova sessão é preservado?
2. O UTM fica vinculado à **sessão** ou ao **contato**?
3. Se o cliente fecha e reabre a conversa, o UTM é mantido?
4. Qual a forma recomendada de passar UTM via link WhatsApp que o Helena reconheça?
5. O `clid` (TikTok Click ID) é preservado da mesma forma que os UTMs?

---

## Problema 10 — URL de Áudio Pode Expirar

**Severidade:** <span class="medio">MEDIO</span>

**O que acontece:** Quando o cliente manda áudio, recebemos o `publicUrl` no webhook e fazemos download para transcrever com OpenAI Whisper. Se houver qualquer atraso no processamento, a URL pode ter expirado.

### Perguntas para o Helena:

1. O `publicUrl` dos arquivos de mídia (áudio, imagem, vídeo) tem tempo de expiração?
2. Se sim, quanto tempo a URL permanece válida?
3. Existe URL permanente ou é necessário baixar imediatamente?
4. O formato de áudio é sempre OGG/Opus ou pode variar (MP3, AAC, M4A)?

---

## Problema 11 — API v1 vs v2: Qual Usar?

**Severidade:** <span class="baixo">BAIXO</span>

**O que acontece:** Estamos usando endpoints mistos — v1 para mensagens e transferência, v2 para sessões. Não está claro qual versão é a recomendada.

**Endpoints que usamos:**

| Operação | Endpoint | Versão |
|----------|----------|--------|
| Listar mensagens | `/chat/v1/session/{id}/message` | v1 |
| Enviar mensagem | `/chat/v1/session/{id}/message` | v1 |
| Transferir sessão | `/chat/v1/session/{id}/transfer` | v1 |
| Consultar sessão | `/chat/v2/session/{id}` | v2 |
| Listar sessões | `/chat/v2/session` | v2 |
| Consultar contato | `/core/v1/contact/{id}` | v1 |

### Perguntas para o Helena:

1. A v1 será descontinuada? Qual o timeline?
2. Todos os endpoints de v1 existem em v2?
3. Qual a versão recomendada para cada operação?
4. Existe documentação atualizada com todos os endpoints disponíveis?

---

## Proposta de Solução (para discussão)

Se o Helena puder implementar **uma** mudança que resolveria os problemas 1, 2 e parte do 5:

> **Incluir `userId` e `departmentId` no payload do webhook `MESSAGE_RECEIVED`.**

Com essa informação no payload, nosso agente saberia instantaneamente se um humano está atribuído, sem precisar fazer GET extra e sem race condition.

**Alternativa:** Um campo booleano `hasHumanAgent: true/false` no payload da mensagem.

---

## Contato

**Gustavo Rodrigues**
Bew Store — Tecnologia
ads.bewstore.com.br

---

*Documento gerado em 25/03/2026*
