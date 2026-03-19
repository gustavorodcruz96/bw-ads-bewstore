# Plano Completo - BW Ads Bewstore

## Contexto

**Negócio:** Bew Store - Venda de iPhones Seminovos
**Objetivo:** Sistema completo de rastreamento de anúncios TikTok, desde o clique no ad até a venda confirmada no WhatsApp via Helena CRM, com painel admin e agente IA de atendimento/vendas.

**Problema atual:** O projeto é SPA puro (Vite + React) sem backend. Precisamos de server-side para:
- TikTok Events API (server-to-server tracking)
- Receber webhooks do Helena CRM
- Agente IA de atendimento
- Painel administrativo com dados reais

---

## Decisão Arquitetural: Migrar para Next.js

**Por que:** Vite + React puro não suporta API Routes. Precisamos de server-side.

**Opções analisadas:**
1. ~~Adicionar Express separado~~ - Complexidade de deploy duplo
2. ~~Vercel Serverless Functions~~ - Funciona, mas acoplado ao Vercel
3. **Next.js (App Router)** - API Routes nativas, SSR, deploy fácil, reusa componentes React

**Decisão:** Migrar para Next.js App Router. A migração é simples:
- Mover componentes de `src/components/` para `app/components/`
- Converter pages para `app/page.tsx` format
- Adicionar `app/api/` para rotas server-side
- TailwindCSS + ShadCN continuam funcionando

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        TIKTOK ADS                               │
│  (Campanha → Anúncio → Click)                                   │
│  URL: ads.bewstore.com.br/?ttclid=xxx&utm_source=tiktok...     │
└────────────────────────┬────────────────────────────────────────┘
                         │ Click
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LANDING PAGE (Next.js)                         │
│  ads.bewstore.com.br                                            │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐        │
│  │ TikTok   │  │ Captura      │  │ Botão WhatsApp     │        │
│  │ Pixel    │  │ ttclid + ttp │  │ → Helena UTM URL   │        │
│  │ Client   │  │ cookies      │  │                     │        │
│  └────┬─────┘  └──────┬───────┘  └─────────┬──────────┘        │
│       │               │                     │                    │
│  ViewContent     Salva localStorage    ClickButton              │
└───────┼───────────────┼─────────────────────┼───────────────────┘
        │               │                     │
        │               │                     ▼
        │               │  ┌──────────────────────────────────┐
        │               │  │  HELENA CRM (WhatsApp)            │
        │               │  │  URL: api.helena.run/chat/v1/     │
        │               │  │  channel/wa/5531990742171         │
        │               │  │  ?text=...&utm_source=tiktok      │
        │               │  │  &utm_medium=cpc                  │
        │               │  │  &utm_campaign={campaign_name}    │
        │               │  └──────────┬───────────────────────┘
        │               │             │
        │               │             │ Webhook events
        │               │             ▼
        ▼               ▼  ┌──────────────────────────────────┐
   ┌────────────────────── │  BACKEND API (Next.js API Routes) │
   │                       │                                    │
   │  POST /api/track      │  POST /api/helena/webhook          │
   │  → TikTok Events API  │  → Recebe SESSION_NEW,            │
   │  → ViewContent        │    MESSAGE_RECEIVED, etc           │
   │  → ClickButton        │  → Detecta conversão (venda)      │
   │  → Contact            │  → Envia CompletePayment           │
   │                       │    ao TikTok Events API            │
   │                       │                                    │
   │  GET /api/admin/*     │  POST /api/agent                   │
   │  → Dados para painel  │  → Agente IA de vendas             │
   │                       │  → OpenAI + Helena API             │
   └───────────────────────┴──────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │  TIKTOK EVENTS API         │
                    │  POST /open_api/v1.3/      │
                    │  event/track/              │
                    │                            │
                    │  Eventos server-side:      │
                    │  - Contact                 │
                    │  - CompletePayment (VENDA) │
                    └───────────────────────────┘
```

---

## Fases de Implementação

### FASE 1 — Migração para Next.js + Landing Page
**Prioridade:** ALTA | **Estimativa:** 1-2 dias

**Tarefas:**
- [ ] 1.1 Criar projeto Next.js App Router com TailwindCSS + ShadCN
- [ ] 1.2 Migrar componentes existentes (Header, Hero, CTA, Footer, etc)
- [ ] 1.3 Criar nova landing page focada em **venda de iPhones seminovos**
  - Hero com iPhone em destaque + oferta irresistível
  - Cards de iPhones disponíveis (preços, modelos)
  - Seção de confiança (garantia, satisfação, avaliações)
  - CTA forte: "Fale com especialista no WhatsApp"
  - Botão flutuante WhatsApp
- [ ] 1.4 Implementar lógica de captura de UTMs e ttclid na URL
- [ ] 1.5 Gerar URL do Helena com UTMs para o botão WhatsApp:
  ```
  https://api.helena.run/chat/v1/channel/wa/5531990742171
  ?text=Olá! Vi os iPhones seminovos no anúncio e quero saber mais! 📱
  &utm_source=tiktok
  &utm_medium=cpc
  &utm_campaign={campaign_name}
  ```

**Arquivos:**
```
app/
├── layout.tsx              # Layout raiz com TikTok Pixel
├── page.tsx                # Landing page (venda iPhones)
├── components/
│   ├── hero-section.tsx
│   ├── iphone-cards.tsx
│   ├── trust-section.tsx
│   ├── cta-section.tsx
│   ├── whatsapp-button.tsx
│   └── ui/                 # ShadCN (migrados)
├── lib/
│   ├── utm.ts              # Captura/propaga UTMs
│   └── utils.ts
```

---

### FASE 2 — TikTok Pixel + Events API (Tracking Completo)
**Prioridade:** ALTA | **Estimativa:** 1 dia

**Tarefas:**
- [ ] 2.1 Instalar TikTok Pixel (client-side) no `layout.tsx`
  ```html
  <script>
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;
    var ttq=w[t]=w[t]||[];
    ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
    ttq.load('{PIXEL_ID}');
    ttq.page();
  }(window, document, 'ttq');
  </script>
  ```
- [ ] 2.2 Disparar eventos client-side:
  - `ViewContent` - ao carregar a landing page
  - `ClickButton` - ao clicar no botão WhatsApp
- [ ] 2.3 Criar `app/api/track/route.ts` (server-side tracking)
  - Receber eventos do frontend
  - Enviar ao TikTok Events API com dados enriquecidos (IP, User-Agent)
  - Deduplicação via `event_id` compartilhado com pixel
- [ ] 2.4 Criar `lib/tiktok.ts` (TikTok Events API client)
  ```typescript
  // POST https://business-api.tiktok.com/open_api/v1.3/event/track/
  // Headers: { Access-Token, Content-Type: application/json }
  // Body: { pixel_code, event, event_id, timestamp, context, properties, user }
  ```
- [ ] 2.5 Capturar `ttclid` da URL e cookie `_ttp` para matching

**Arquivos:**
```
app/
├── api/
│   └── track/
│       └── route.ts         # Server-side tracking proxy
├── lib/
│   ├── tiktok.ts            # TikTok Events API client
│   └── tracking.ts          # Lógica de tracking compartilhada
```

**Variáveis de ambiente (.env.local):**
```
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=    # Para testes
```

---

### FASE 3 — Helena Webhooks + Tracking de Conversões
**Prioridade:** ALTA | **Estimativa:** 1-2 dias

**Tarefas:**
- [ ] 3.1 Criar `lib/helena.ts` (Helena API client)
  ```typescript
  // Base URL: https://api.helena.run
  // Auth: Bearer {HELENA_TOKEN}
  // Endpoints: /chat/v2/session, /chat/v1/message/send, etc
  ```
- [ ] 3.2 Criar `app/api/helena/webhook/route.ts` (Webhook receiver)
  - Receber eventos: SESSION_NEW, MESSAGE_RECEIVED, SESSION_UPDATED
  - Validar payload
- [ ] 3.3 Registrar webhook subscription via Helena API
  ```
  POST /core/v1/webhook/subscription
  { "url": "https://ads.bewstore.com.br/api/helena/webhook", "events": [...] }
  ```
- [ ] 3.4 Implementar detecção de conversão (venda):
  - **Opção A:** Tag automática - quando atendente adiciona tag "venda-confirmada" ao contato
  - **Opção B:** Palavra-chave na conversa - detectar mensagens como "pagamento confirmado"
  - **Opção C:** CRM Card movido para coluna "Vendido" no painel Helena
  - **Recomendado:** Opção A (mais confiável e controlável)
- [ ] 3.5 Ao detectar conversão, enviar `CompletePayment` ao TikTok:
  ```typescript
  await tiktokTrack({
    event: 'CompletePayment',
    event_id: `sale-${sessionId}`,
    properties: {
      currency: 'BRL',
      value: valorVenda,
      content_type: 'product',
      contents: [{ content_id: 'iphone-seminovo', content_name: modeloIphone }]
    },
    user: {
      phone_number: sha256(telefoneCliente),
      external_id: sha256(contactId)
    }
  });
  ```
- [ ] 3.6 Mapeamento de UTM → Conversão:
  - Helena retorna UTM data na session (`source`, `medium`, `campaign`)
  - Usar esses dados para enriquecer o evento server-side

**Arquivos:**
```
app/
├── api/
│   └── helena/
│       ├── webhook/route.ts     # Webhook receiver
│       └── setup/route.ts       # Setup inicial de webhooks
├── lib/
│   ├── helena.ts                # Helena API client
│   └── conversion.ts            # Lógica de detecção de conversão
```

**Variáveis de ambiente:**
```
HELENA_API_TOKEN=
HELENA_PHONE=5531990742171
HELENA_WEBHOOK_SECRET=     # Para validação
```

---

### FASE 4 — Painel Administrativo
**Prioridade:** MÉDIA | **Estimativa:** 2-3 dias

**Tarefas:**
- [ ] 4.1 Criar layout admin com sidebar (`app/admin/layout.tsx`)
- [ ] 4.2 Dashboard principal (`app/admin/page.tsx`)
  - Total de visitas (via pixel)
  - Total de cliques WhatsApp
  - Total de conversas iniciadas
  - Total de vendas confirmadas
  - Taxa de conversão por etapa do funil
  - Gráfico de funil visual
- [ ] 4.3 Página de conversas (`app/admin/conversas/page.tsx`)
  - Lista de conversas do Helena em tempo real
  - Status: Novo → Em atendimento → Venda → Concluído
  - Filtros por data, status, origem (UTM)
- [ ] 4.4 Página de configurações (`app/admin/config/page.tsx`)
  - Configurar TikTok Pixel ID e Access Token
  - Configurar Helena Token
  - Webhook URL e status
  - Test mode toggle
- [ ] 4.5 Autenticação simples (senha fixa ou NextAuth)
- [ ] 4.6 API routes para dados do dashboard:
  - `GET /api/admin/stats` - Estatísticas
  - `GET /api/admin/conversas` - Lista conversas Helena
  - `GET /api/admin/funnel` - Dados do funil

**Arquivos:**
```
app/
├── admin/
│   ├── layout.tsx
│   ├── page.tsx                 # Dashboard
│   ├── conversas/page.tsx       # Monitor conversas
│   └── config/page.tsx          # Configurações
├── api/
│   └── admin/
│       ├── stats/route.ts
│       ├── conversas/route.ts
│       └── funnel/route.ts
```

---

### FASE 5 — Agente IA de Vendas
**Prioridade:** MÉDIA | **Estimativa:** 2-3 dias

**Tarefas:**
- [ ] 5.1 Criar agente IA via OpenAI Assistants API
  - Persona: Vendedor especialista em iPhones seminovos da Bew Store
  - Conhecimento: Modelos disponíveis, preços, garantia, diferenciais
  - Tom: Profissional mas amigável, consultivo
  - Objetivo: Guiar o cliente até a venda
- [ ] 5.2 Integrar com Helena via chatbot loop (conforme docs):
  - Passo 1: Criar assistente no OpenAI
  - Passo 2: Criar loop no chatbot Helena
  - Passo 3: Ler mensagens → enviar para OpenAI → responder
  - Passo 4: Processar áudios (transcrição)
  - Passo 5: Processar imagens (se cliente enviar foto)
- [ ] 5.3 Criar `app/api/agent/route.ts`
  - Receber mensagem do Helena webhook
  - Processar com OpenAI
  - Responder via Helena API (`POST /chat/v1/message/send`)
- [ ] 5.4 Lógica de handoff humano:
  - Agente responde automaticamente
  - Se cliente pedir atendimento humano → transferir conversa
  - Se agente não souber responder → transferir conversa
- [ ] 5.5 Sistema de contexto do agente:
  - Saber qual iPhone o cliente viu no anúncio (via UTM/content)
  - Acessar catálogo de produtos atualizado
  - Registrar interesse em CRM card
- [ ] 5.6 Página no admin para configurar agente:
  - Ativar/desativar agente
  - Ver conversas do agente
  - Prompt do agente editável
  - Catálogo de produtos

**Arquivos:**
```
app/
├── api/
│   └── agent/
│       ├── route.ts             # Webhook handler + OpenAI
│       ├── prompt.ts            # System prompt do agente
│       └── products.ts          # Catálogo de produtos
├── admin/
│   └── agente/page.tsx          # Config do agente no admin
├── lib/
│   └── agent.ts                 # OpenAI Assistants client
```

**Variáveis de ambiente:**
```
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
```

---

## Fluxo Completo (End-to-End)

```
1. Pessoa vê anúncio no TikTok
   ↓
2. Clica → ads.bewstore.com.br/?ttclid=xxx&utm_source=tiktok&utm_campaign=iphone13
   ↓
3. Landing page carrega
   → Pixel dispara ViewContent (client + server dedup)
   → ttclid e _ttp capturados
   ↓
4. Pessoa clica "Falar no WhatsApp"
   → Pixel dispara ClickButton
   → Redireciona para Helena UTM URL
   ↓
5. WhatsApp abre com mensagem pré-preenchida
   → Helena registra novo session com UTMs
   → Webhook SESSION_NEW → server envia Contact ao TikTok
   ↓
6. Agente IA responde automaticamente
   → "Oi! Vi que você se interessou pelo iPhone 13! Temos opções incríveis..."
   → Conversa de vendas começa
   ↓
7. Venda confirmada → atendente adiciona tag "venda-confirmada"
   → Webhook detecta tag
   → Server envia CompletePayment ao TikTok com valor
   ↓
8. TikTok recebe conversão → Otimiza campanha automaticamente!
```

---

## Supabase (Banco de Dados)

### Por que Supabase?
- Landing page e tracking precisam de dados persistidos para o painel admin
- Sem banco, não há funil, histórico de conversões, nem catálogo de produtos
- Free tier cobre tranquilo o volume da Bew Store
- Auth built-in para o painel admin
- Real-time subscriptions para dashboard ao vivo

### Schema de Tabelas

```sql
-- 1. Eventos de tracking (cada interação rastreada)
CREATE TABLE tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,              -- ViewContent, ClickButton, Contact, CompletePayment
  event_id TEXT UNIQUE NOT NULL,         -- Para deduplicação TikTok
  ttclid TEXT,                           -- TikTok click ID
  ttp TEXT,                              -- TikTok cookie _ttp
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  ip_address TEXT,
  user_agent TEXT,
  page_url TEXT,
  metadata JSONB DEFAULT '{}',           -- Dados extras (valor venda, modelo iPhone, etc)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sessões de conversa (liga TikTok click → Helena session → venda)
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  helena_session_id TEXT UNIQUE,         -- ID da sessão no Helena
  helena_contact_id TEXT,                -- ID do contato no Helena
  phone TEXT,                            -- Telefone do cliente
  name TEXT,                             -- Nome do cliente
  ttclid TEXT,                           -- Link com tracking_events
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'new',             -- new, in_progress, sale, completed
  sale_value DECIMAL(10,2),              -- Valor da venda (se houve)
  sale_product TEXT,                      -- Modelo do iPhone vendido
  agent_handled BOOLEAN DEFAULT false,   -- Se o agente IA atendeu
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Catálogo de produtos (para o agente IA)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model TEXT NOT NULL,                   -- ex: "iPhone 13 128GB"
  storage TEXT,                          -- ex: "128GB"
  color TEXT,                            -- ex: "Azul"
  condition TEXT DEFAULT 'seminovo',     -- seminovo, vitrine, lacrado
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),          -- Preço original para mostrar desconto
  battery_health INTEGER,                -- Saúde da bateria (%)
  available BOOLEAN DEFAULT true,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Configurações do sistema
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Logs do agente IA
CREATE TABLE agent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  helena_session_id TEXT,
  role TEXT NOT NULL,                    -- user, assistant, system
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tracking_events_type ON tracking_events(event_type);
CREATE INDEX idx_tracking_events_ttclid ON tracking_events(ttclid);
CREATE INDEX idx_tracking_events_created ON tracking_events(created_at);
CREATE INDEX idx_sessions_helena_id ON sessions(helena_session_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created ON sessions(created_at);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_agent_logs_session ON agent_logs(session_id);

-- RLS (Row Level Security) para o painel admin
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Policies para service_role (backend)
CREATE POLICY "Service role full access" ON tracking_events FOR ALL USING (true);
CREATE POLICY "Service role full access" ON sessions FOR ALL USING (true);
CREATE POLICY "Service role full access" ON products FOR ALL USING (true);
CREATE POLICY "Service role full access" ON settings FOR ALL USING (true);
CREATE POLICY "Service role full access" ON agent_logs FOR ALL USING (true);
```

### Configuração Supabase

```
app/
├── lib/
│   └── supabase.ts            # Supabase client (service_role para backend)
```

### Dados iniciais (seed)

```sql
-- Settings iniciais
INSERT INTO settings (key, value, description) VALUES
  ('tiktok_pixel_id', '', 'TikTok Pixel ID'),
  ('tiktok_access_token', '', 'TikTok Events API Access Token'),
  ('helena_api_token', '', 'Helena CRM API Token'),
  ('helena_phone', '5531990742171', 'Número WhatsApp da Bew Store'),
  ('openai_api_key', '', 'OpenAI API Key'),
  ('openai_assistant_id', '', 'OpenAI Assistant ID'),
  ('agent_enabled', 'false', 'Agente IA ativo'),
  ('agent_prompt', 'Você é um vendedor especialista...', 'System prompt do agente');

-- Produtos exemplo
INSERT INTO products (model, storage, color, condition, price, original_price, battery_health) VALUES
  ('iPhone 13', '128GB', 'Azul', 'seminovo', 2499.00, 4499.00, 92),
  ('iPhone 14', '128GB', 'Preto', 'seminovo', 3299.00, 5999.00, 95),
  ('iPhone 15', '256GB', 'Natural', 'seminovo', 4499.00, 7999.00, 98);
```

---

## Variáveis de Ambiente Completas

```env
# TikTok Ads
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=

# Helena CRM
HELENA_API_TOKEN=
HELENA_PHONE=5531990742171
HELENA_WEBHOOK_SECRET=

# OpenAI (Agente IA)
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_SITE_URL=https://ads.bewstore.com.br
ADMIN_PASSWORD=
```

---

## Ordem de Execução Recomendada

1. **FASE 1** → Landing Page funcional com botão WhatsApp + UTMs ✅
2. **FASE 2** → TikTok Pixel + Events API tracking ✅
3. **FASE 3** → Helena webhooks + detecção de conversão ✅
4. **FASE 4** → Painel admin com dashboard ✅
5. **FASE 5** → Agente IA de vendas ✅

Cada fase é deployável independentemente. Após Fase 1+2, os anúncios já estão sendo rastreados. Fase 3 fecha o loop de conversão. Fases 4 e 5 são melhorias incrementais.

---

## Documentação de Referência

- [docs/helena-api-reference.md](helena-api-reference.md) - API completa do Helena
- [docs/tiktok-events-api-reference.md](tiktok-events-api-reference.md) - TikTok Events API completa
