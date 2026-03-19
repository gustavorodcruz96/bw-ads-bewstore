# TikTok Events API - Reference Completa

> Documentacao consolidada da TikTok Events API para integracao server-side no projeto bw-ads-bewstore (ads.bewstore.com.br).
> Ultima atualizacao: 2026-03-19

---

## Indice

1. [Visao Geral](#1-visao-geral)
2. [Endpoint e Autenticacao](#2-endpoint-e-autenticacao)
3. [Estrutura do Request](#3-estrutura-do-request)
4. [Campos do Payload](#4-campos-do-payload)
5. [User Data e Hashing SHA256](#5-user-data-e-hashing-sha256)
6. [Eventos Padrao (Standard Events)](#6-eventos-padrao-standard-events)
7. [Parametros de Conteudo (Properties)](#7-parametros-de-conteudo-properties)
8. [Deduplicacao com Pixel (event_id)](#8-deduplicacao-com-pixel-event_id)
9. [TTP Cookie e TTCLID](#9-ttp-cookie-e-ttclid)
10. [Setup do Pixel no Client-Side](#10-setup-do-pixel-no-client-side)
11. [Exemplos Completos de Payload](#11-exemplos-completos-de-payload)
12. [Fluxo Completo: Ads -> Landing -> WhatsApp -> Venda](#12-fluxo-completo-ads---landing---whatsapp---venda)
13. [Eventos Relevantes para Bew Store](#13-eventos-relevantes-para-bew-store)
14. [Teste e Validacao](#14-teste-e-validacao)
15. [Rate Limits e Batch](#15-rate-limits-e-batch)
16. [Fontes e Referencias](#16-fontes-e-referencias)

---

## 1. Visao Geral

A **TikTok Events API** (tambem chamada de Conversion API ou CAPI) eh uma integracao server-to-server (S2S) que permite enviar dados de marketing/conversao diretamente do seu servidor para o TikTok, sem depender exclusivamente do pixel client-side.

### Beneficios

- **Confiabilidade**: Nao eh afetada por ad blockers, ITP ou restricoes de cookies
- **Privacidade**: Dados sao hasheados (SHA256) antes do envio
- **Precisao**: Melhora a atribuicao combinando sinais server-side + client-side
- **Cookieless Ready**: Preparado para o futuro sem cookies de terceiros

### Arquitetura Consolidada (Enhanced Events API)

Desde novembro de 2023, o TikTok unificou os endpoints antes separados (Web, App, Offline) em um **unico endpoint consolidado**. Agora voce integra uma vez e envia dados de multiplas fontes (web, app, offline, CRM) pelo mesmo endpoint.

### Event Sources Suportados

| event_source | Descricao |
|-------------|-----------|
| `web` | Eventos de website (landing pages, e-commerce) |
| `app` | Eventos de aplicativo mobile |
| `offline` | Eventos offline (loja fisica, CRM) |
| `crm` | Eventos de CRM (ex: venda concluida no Helena) |

---

## 2. Endpoint e Autenticacao

### Endpoint

```
POST https://business-api.tiktok.com/open_api/v1.3/event/track/
```

**Versao da API:** v1.3 (Events 2.0)

### Headers Obrigatorios

| Header | Valor | Obrigatorio |
|--------|-------|-------------|
| `Access-Token` | Token gerado no TikTok Ads Manager | Sim |
| `Content-Type` | `application/json` | Sim |

### Como Gerar o Access Token

1. Acesse o **TikTok Ads Manager**
2. Va em **Assets > Events > Web Events**
3. Selecione seu Pixel
4. Em **Settings**, clique em **Generate Access Token**
5. **SALVE IMEDIATAMENTE** - o TikTok nao armazena o token por seguranca

> IMPORTANTE: O token gerado deve ser armazenado de forma segura (variavel de ambiente, secret manager). Nunca hardcode no codigo-fonte.

### Exemplo de Request cURL

```bash
curl -X POST \
  'https://business-api.tiktok.com/open_api/v1.3/event/track/' \
  -H 'Access-Token: YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "event_source": "web",
    "event_source_id": "YOUR_PIXEL_CODE",
    "data": [...]
  }'
```

---

## 3. Estrutura do Request

### Payload JSON - Estrutura Geral

```json
{
  "event_source": "web",
  "event_source_id": "PIXEL_CODE",
  "data": [
    {
      "event": "EVENT_NAME",
      "event_time": 1679000000,
      "event_id": "unique-event-id-uuid",
      "user": {
        "ttclid": "TTCLID_VALUE",
        "ttp": "TTP_COOKIE_VALUE",
        "external_id": "SHA256_HASHED_USER_ID",
        "email": "SHA256_HASHED_EMAIL",
        "phone": "SHA256_HASHED_PHONE",
        "ip": "123.45.67.89",
        "user_agent": "Mozilla/5.0...",
        "locale": "pt_BR"
      },
      "page": {
        "url": "https://ads.bewstore.com.br/iphone-15",
        "referrer": "https://www.tiktok.com/"
      },
      "properties": {
        "currency": "BRL",
        "value": 3999.00,
        "content_type": "product",
        "description": "iPhone 15 128GB Seminovo",
        "order_id": "ORDER-12345",
        "contents": [
          {
            "content_id": "iphone-15-128gb",
            "content_name": "iPhone 15 128GB Seminovo",
            "content_category": "Smartphones",
            "price": 3999.00,
            "quantity": 1,
            "brand": "Apple"
          }
        ]
      }
    }
  ]
}
```

---

## 4. Campos do Payload

### Nivel Raiz

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `event_source` | string | Sim | Fonte do evento: `web`, `app`, `offline`, `crm` |
| `event_source_id` | string | Sim | ID do Pixel (para web) ou App ID (para app) |
| `data` | array | Sim | Array de objetos de evento (max 50 por request) |

### Nivel do Evento (cada item em `data[]`)

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `event` | string | Sim | Nome do evento (ex: `ViewContent`, `CompletePayment`) |
| `event_time` | integer | Sim | Timestamp Unix em segundos |
| `event_id` | string | Recomendado | ID unico para deduplicacao (UUID recomendado) |
| `user` | object | Sim | Dados do usuario (ver secao 5) |
| `page` | object | Recomendado (web) | Dados da pagina (url, referrer) |
| `properties` | object | Recomendado | Propriedades do evento (ver secao 7) |
| `limited_data_use` | boolean | Opcional | Flag de uso limitado de dados (LDU) |
| `test_event_code` | string | Opcional | Codigo para eventos de teste (nao conta como real) |

### Objeto `page`

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `url` | string | Recomendado | URL completa da pagina |
| `referrer` | string | Opcional | URL de referencia |

---

## 5. User Data e Hashing SHA256

### Campos do Objeto `user`

| Campo | Tipo | Hashing | Descricao |
|-------|------|---------|-----------|
| `ttclid` | string | Nao | TikTok Click ID (do parametro URL `ttclid`) |
| `ttp` | string | Nao | TikTok Cookie ID (do cookie `_ttp`) |
| `external_id` | string | SHA256 | ID unico do usuario no seu sistema |
| `email` | string | SHA256 | Email do usuario (lowercase antes de hashear) |
| `phone` | string | SHA256 | Telefone em formato E.164 (ex: +5511999998888) |
| `ip` | string | Nao | IP publico do usuario (IPv4 ou IPv6) |
| `user_agent` | string | Nao | User-Agent do navegador |
| `locale` | string | Nao | Locale BCP 47 (ex: `pt_BR`, `en_US`) |
| `idfa` | string | Nao | iOS Identifier for Advertisers (app only) |
| `idfv` | string | Nao | iOS Identifier for Vendors (app only) |
| `gaid` | string | Nao | Google Advertising ID - Android (app only) |
| `att_status` | string | Nao | iOS App Tracking Transparency status (app only) |

### Regras de Hashing SHA256

1. **Converter para lowercase** antes de hashear
2. **Remover espacos** antes e depois
3. **Formato E.164 para telefone**: incluir codigo do pais (ex: `+5511999998888`)
4. Aplicar **SHA256** no valor tratado
5. **IP e User-Agent NAO sao hasheados** - enviar em texto plano

### Exemplo de Hashing (Node.js)

```javascript
const crypto = require('crypto');

function hashSHA256(value) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Exemplo de uso
const userData = {
  email: hashSHA256('cliente@email.com'),
  // Resultado: "a1b2c3d4e5f6..." (64 chars hex)

  phone: hashSHA256('+5511999998888'),
  // Resultado: "f6e5d4c3b2a1..." (64 chars hex)

  external_id: hashSHA256('user-12345'),
  // Resultado: "1a2b3c4d5e6f..." (64 chars hex)

  ip: '177.45.123.89',  // NAO hashear
  user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)',  // NAO hashear
};
```

### Exemplo de Hashing (PHP)

```php
function hashSHA256($value) {
    if (empty($value)) return null;
    $normalized = strtolower(trim($value));
    return hash('sha256', $normalized);
}

$userData = [
    'email' => hashSHA256('cliente@email.com'),
    'phone' => hashSHA256('+5511999998888'),
    'external_id' => hashSHA256('user-12345'),
    'ip' => '177.45.123.89',  // NAO hashear
    'user_agent' => $_SERVER['HTTP_USER_AGENT'],  // NAO hashear
];
```

### Match Quality Score

Para maximizar o **Event Match Quality (EMQ)** score no TikTok:
- Envie o maximo de campos possivel
- Prioridade: `ttclid` > `ttp` > `email` + `phone` > `external_id` > `ip` + `user_agent`
- O `ttclid` eh o mais valioso pois vincula diretamente ao clique no anuncio

---

## 6. Eventos Padrao (Standard Events)

### Lista Completa de Eventos Web

| Evento | Descricao | Uso Principal |
|--------|-----------|---------------|
| `ViewContent` | Usuario visualizou conteudo/produto | Paginas de produto, landing pages |
| `ClickButton` | Clique em botao importante | CTAs, botoes de acao |
| `Search` | Realizou uma busca | Barra de pesquisa |
| `AddToWishlist` | Adicionou a lista de desejos | Favoritos |
| `AddToCart` | Adicionou ao carrinho | E-commerce |
| `InitiateCheckout` | Iniciou o checkout | Pagina de checkout |
| `AddPaymentInfo` | Adicionou informacoes de pagamento | Formulario de pagamento |
| `CompletePayment` | Concluiu o pagamento | Confirmacao de pagamento |
| `PlaceAnOrder` | Fez um pedido | Confirmacao de pedido |
| `Contact` | Realizou contato (telefone, WhatsApp, chat) | Clique no WhatsApp, formulario de contato |
| `Download` | Fez download de algo | PDFs, arquivos |
| `SubmitForm` | Enviou um formulario | Formularios de lead |
| `CompleteRegistration` | Completou um cadastro | Signup, registro |
| `Subscribe` | Assinou um servico | Newsletter, plano |

### Eventos Adicionais (App / Offline)

| Evento | Fonte | Descricao |
|--------|-------|-----------|
| `AchieveLevel` | App | Alcancou um nivel |
| `CompleteTutorial` | App | Completou tutorial |
| `CreateGroup` | App | Criou um grupo |
| `CreateRole` | App | Criou um perfil/role |
| `GenerateLead` | App | Gerou um lead |
| `InAppADClick` | App | Clicou em anuncio in-app |
| `InAppAdImpr` | App | Impressao de anuncio in-app |
| `InstallApp` | App | Instalou o aplicativo |
| `JoinGroup` | App | Entrou em um grupo |
| `LaunchAPP` | App | Abriu o aplicativo |
| `Login` | App | Fez login |
| `Rate` | App | Avaliou algo |
| `SpendCredits` | App | Gastou creditos |
| `UnlockAchievement` | App | Desbloqueou conquista |
| `Purchase` | Multi | Realizou uma compra |
| `StartTrial` | Multi | Iniciou um periodo de teste |

### Eventos Customizados

Alem dos standard events, voce pode enviar **eventos customizados** com nomes proprios. Eventos customizados:
- Suportam reporting e construcao de audiencias
- **NAO suportam** otimizacao de campanhas (apenas standard events suportam)
- Devem ser registrados no TikTok Events Manager antes do uso

---

## 7. Parametros de Conteudo (Properties)

### Objeto `properties`

| Campo | Tipo | Descricao | Eventos Relevantes |
|-------|------|-----------|-------------------|
| `currency` | string | Moeda ISO 4217 (ex: `BRL`, `USD`) | CompletePayment, PlaceAnOrder, AddToCart |
| `value` | float | Valor monetario total | CompletePayment, PlaceAnOrder, AddToCart |
| `content_type` | string | `product` ou `product_group` | ViewContent, AddToCart, CompletePayment |
| `description` | string | Descricao do evento | Qualquer evento |
| `query` | string | Termo de busca | Search |
| `order_id` | string | ID do pedido | CompletePayment, PlaceAnOrder |
| `shop_id` | string | ID da loja | CompletePayment (multi-loja) |
| `status` | string | Status do evento | Qualquer evento |
| `num_items` | integer | Numero de itens | AddToCart, CompletePayment |
| `content_ids` | array | Array de IDs de conteudo | Video Shopping Ads (obrigatorio) |
| `contents` | array | Array de objetos de conteudo | Todos com produtos |

### Objeto `contents[]` (Item Individual)

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `content_id` | string | ID unico do produto/SKU |
| `content_name` | string | Nome do produto |
| `content_category` | string | Categoria do produto |
| `price` | float | Preco unitario |
| `quantity` | integer | Quantidade |
| `brand` | string | Marca do produto |

### Valores de `content_type`

| Valor | Quando Usar |
|-------|-------------|
| `product` | Quando content_id refere-se a um produto individual (SKU) |
| `product_group` | Quando content_id refere-se a um grupo de produtos (ex: variantes) |

---

## 8. Deduplicacao com Pixel (event_id)

### Como Funciona

Quando voce usa **Pixel (client-side) + Events API (server-side)** simultaneamente, o TikTok pode receber o mesmo evento duas vezes. Para evitar contagem dupla, use o `event_id`.

### Regras de Deduplicacao

1. Gere um **UUID unico** para cada evento
2. Envie o **mesmo `event_id`** tanto no Pixel quanto na Events API
3. O TikTok deduplica eventos com o mesmo:
   - `event_source_id` (Pixel Code)
   - `event` (nome do evento)
   - `event_id`
4. **Janela de deduplicacao**: 48 horas
5. Eventos duplicados recebidos **dentro de 5 minutos** sao mesclados automaticamente
6. O TikTok usa o **primeiro evento** recebido e descarta os subsequentes

### Implementacao no Client-Side (Pixel)

```javascript
// Gerar event_id unico
const eventId = crypto.randomUUID(); // ou uuid v4

// Enviar via Pixel (client-side)
ttq.track('ViewContent', {
  content_type: 'product',
  content_id: 'iphone-15-128gb',
  content_name: 'iPhone 15 128GB Seminovo',
  value: 3999.00,
  currency: 'BRL'
}, {
  event_id: eventId  // MESMO event_id
});

// Enviar o event_id para o servidor (via query param, hidden field, etc.)
// para que o server-side envie o MESMO event_id na Events API
```

### Implementacao no Server-Side (Events API)

```javascript
// No servidor, usar o MESMO event_id recebido do client
const payload = {
  event_source: 'web',
  event_source_id: 'PIXEL_CODE',
  data: [{
    event: 'ViewContent',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId, // MESMO event_id do pixel
    user: { /* ... */ },
    properties: { /* ... */ }
  }]
};
```

---

## 9. TTP Cookie e TTCLID

### TTCLID (TikTok Click ID)

- Adicionado automaticamente a URL quando alguem clica em um anuncio do TikTok
- Formato: parametro `ttclid` na URL (ex: `?ttclid=E.C.P.abc123xyz`)
- **Validade**: 30 dias
- **Importancia**: Vinculo direto entre clique no anuncio e conversao
- **Deve ser**: Capturado da URL e armazenado (cookie, session, banco de dados)

### Como Capturar o TTCLID

```javascript
// No client-side (landing page)
function getTtclid() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ttclid') || null;
}

// Armazenar em cookie para uso posterior
function storeTtclid() {
  const ttclid = getTtclid();
  if (ttclid) {
    document.cookie = `ttclid=${ttclid}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
  }
}
```

### TTP (TikTok Cookie `_ttp`)

- Cookie definido automaticamente pelo **TikTok Pixel SDK** no navegador do usuario
- Nome do cookie: `_ttp`
- Contem um identificador unico do visitante
- **Prioridade**: Se `ttclid` nao estiver disponivel, o `_ttp` eh usado para matching

### Como Capturar o TTP

```javascript
// Ler o cookie _ttp
function getTtp() {
  const match = document.cookie.match(/(^|; )_ttp=([^;]*)/);
  return match ? match[2] : null;
}
```

### Prioridade de Matching (do mais forte ao mais fraco)

1. `ttclid` - Vinculo direto ao clique no anuncio (melhor match)
2. `ttp` - Cookie do pixel (vinculo ao visitante)
3. `email` + `phone` - Dados do usuario hasheados
4. `external_id` - ID do usuario no seu sistema
5. `ip` + `user_agent` - Matching probabilistico (menos preciso)

---

## 10. Setup do Pixel no Client-Side

### Instalacao do Pixel Base

```html
<!-- TikTok Pixel Base Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e+""+(o?"_"+o:"")]=+new Date;(document.readyState==="complete"||document.readyState==="interactive")&&document.dispatchEvent(new Event("DOMContentLoaded"));var s=d.createElement("script");s.async=!0;s.src=r+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a)};

  ttq.load('YOUR_PIXEL_CODE');
  ttq.page();
}(window, document, 'ttq');
</script>
```

### Disparo de Eventos no Pixel

```javascript
// ViewContent
ttq.track('ViewContent', {
  content_type: 'product',
  content_id: 'iphone-15-128gb',
  content_name: 'iPhone 15 128GB Seminovo',
  content_category: 'Smartphones',
  value: 3999.00,
  currency: 'BRL'
});

// ClickButton (ex: clique no WhatsApp)
ttq.track('ClickButton', {
  content_name: 'WhatsApp CTA',
  description: 'Clique no botao WhatsApp para compra'
});

// Contact
ttq.track('Contact', {
  content_name: 'WhatsApp Contact',
  description: 'Contato via WhatsApp'
});

// CompletePayment (se aplicavel)
ttq.track('CompletePayment', {
  content_type: 'product',
  value: 3999.00,
  currency: 'BRL',
  order_id: 'ORDER-12345',
  contents: [{
    content_id: 'iphone-15-128gb',
    content_name: 'iPhone 15 128GB Seminovo',
    quantity: 1,
    price: 3999.00
  }]
});
```

### Advanced Matching (Identificacao Aprimorada)

```javascript
// Antes de ttq.page(), configure o identify
ttq.identify({
  email: 'sha256_hashed_email',
  phone_number: 'sha256_hashed_phone',
  external_id: 'sha256_hashed_user_id'
});
```

---

## 11. Exemplos Completos de Payload

### Exemplo 1: ViewContent (usuario viu pagina de produto)

```json
{
  "event_source": "web",
  "event_source_id": "CXXXXXXXXXXXXXXX",
  "data": [
    {
      "event": "ViewContent",
      "event_time": 1710849600,
      "event_id": "vc-550e8400-e29b-41d4-a716-446655440000",
      "user": {
        "ttclid": "E.C.P.abc123xyz456",
        "ttp": "bfqAAKDjeSiGDBTuFPao",
        "ip": "177.45.123.89",
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        "locale": "pt_BR"
      },
      "page": {
        "url": "https://ads.bewstore.com.br/iphone-15-128gb",
        "referrer": "https://www.tiktok.com/"
      },
      "properties": {
        "content_type": "product",
        "currency": "BRL",
        "value": 3999.00,
        "contents": [
          {
            "content_id": "iphone-15-128gb",
            "content_name": "iPhone 15 128GB Seminovo",
            "content_category": "Smartphones",
            "price": 3999.00,
            "quantity": 1,
            "brand": "Apple"
          }
        ]
      }
    }
  ]
}
```

### Exemplo 2: ClickButton (clicou no botao WhatsApp)

```json
{
  "event_source": "web",
  "event_source_id": "CXXXXXXXXXXXXXXX",
  "data": [
    {
      "event": "ClickButton",
      "event_time": 1710849660,
      "event_id": "cb-660e8400-e29b-41d4-a716-446655440001",
      "user": {
        "ttclid": "E.C.P.abc123xyz456",
        "ttp": "bfqAAKDjeSiGDBTuFPao",
        "email": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
        "phone": "f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2",
        "ip": "177.45.123.89",
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
      },
      "page": {
        "url": "https://ads.bewstore.com.br/iphone-15-128gb",
        "referrer": "https://www.tiktok.com/"
      },
      "properties": {
        "content_type": "product",
        "description": "Clique no WhatsApp - iPhone 15 128GB",
        "contents": [
          {
            "content_id": "iphone-15-128gb",
            "content_name": "iPhone 15 128GB Seminovo",
            "content_category": "Smartphones",
            "price": 3999.00,
            "quantity": 1,
            "brand": "Apple"
          }
        ]
      }
    }
  ]
}
```

### Exemplo 3: Contact (contato via WhatsApp)

```json
{
  "event_source": "web",
  "event_source_id": "CXXXXXXXXXXXXXXX",
  "data": [
    {
      "event": "Contact",
      "event_time": 1710849720,
      "event_id": "ct-770e8400-e29b-41d4-a716-446655440002",
      "user": {
        "ttclid": "E.C.P.abc123xyz456",
        "ttp": "bfqAAKDjeSiGDBTuFPao",
        "email": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
        "phone": "f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2",
        "external_id": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
        "ip": "177.45.123.89",
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
      },
      "page": {
        "url": "https://ads.bewstore.com.br/iphone-15-128gb"
      },
      "properties": {
        "content_type": "product",
        "description": "Contato WhatsApp - Interesse em iPhone 15 128GB",
        "value": 3999.00,
        "currency": "BRL",
        "contents": [
          {
            "content_id": "iphone-15-128gb",
            "content_name": "iPhone 15 128GB Seminovo",
            "content_category": "Smartphones",
            "price": 3999.00,
            "quantity": 1,
            "brand": "Apple"
          }
        ]
      }
    }
  ]
}
```

### Exemplo 4: CompletePayment (venda concluida via CRM/Helena)

```json
{
  "event_source": "crm",
  "event_source_id": "CXXXXXXXXXXXXXXX",
  "data": [
    {
      "event": "CompletePayment",
      "event_time": 1710936000,
      "event_id": "cp-880e8400-e29b-41d4-a716-446655440003",
      "user": {
        "email": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
        "phone": "f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2",
        "external_id": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2"
      },
      "properties": {
        "currency": "BRL",
        "value": 3999.00,
        "content_type": "product",
        "order_id": "HELENA-ORDER-789",
        "contents": [
          {
            "content_id": "iphone-15-128gb",
            "content_name": "iPhone 15 128GB Seminovo",
            "content_category": "Smartphones",
            "price": 3999.00,
            "quantity": 1,
            "brand": "Apple"
          }
        ]
      }
    }
  ]
}
```

---

## 12. Fluxo Completo: Ads -> Landing -> WhatsApp -> Venda

### Fluxo de Eventos para Bew Store

```
TikTok Ad (com ttclid na URL)
    |
    v
[1] Landing Page (ads.bewstore.com.br/produto?ttclid=xxx)
    -> Capturar ttclid da URL
    -> Capturar _ttp cookie
    -> Pixel: ttq.page() (PageView automatico)
    -> Pixel: ttq.track('ViewContent', {...})
    -> Events API: POST ViewContent (server-side)
    |
    v
[2] Clique no botao WhatsApp
    -> Pixel: ttq.track('ClickButton', {...})
    -> Events API: POST ClickButton (server-side)
    -> Pixel: ttq.track('Contact', {...})
    -> Events API: POST Contact (server-side)
    -> Redireciona para wa.me/55xxxxx?text=...
    |
    v
[3] Conversa no WhatsApp (Helena CRM)
    -> Helena recebe o contato (com UTM params do cookie/session)
    -> Helena webhook -> seu backend
    -> Events API: POST SubmitForm (lead qualificado)
    |
    v
[4] Venda Concluida (Helena CRM marca como vendido)
    -> Helena webhook de atualizacao de card/deal
    -> Events API: POST CompletePayment (event_source: "crm")
```

### UTM Parameters para Rastreio Completo

Na URL do anuncio TikTok, inclua:
```
https://ads.bewstore.com.br/iphone-15?
  ttclid=__CLICKID__
  &utm_source=tiktok
  &utm_medium=paid
  &utm_campaign={{campaign_name}}
  &utm_content={{adgroup_name}}
  &utm_term={{ad_name}}
```

> Nota: O TikTok adiciona automaticamente o `ttclid` a URL quando o auto-tagging esta habilitado.

---

## 13. Eventos Relevantes para Bew Store

### Mapeamento de Eventos por Etapa do Funil

| Etapa | Evento TikTok | Trigger |
|-------|--------------|---------|
| Visualizou produto | `ViewContent` | Carregamento da landing page |
| Clicou no CTA WhatsApp | `ClickButton` | Clique no botao WhatsApp |
| Iniciou contato | `Contact` | Redirecionamento para WhatsApp |
| Preencheu formulario (se houver) | `SubmitForm` | Envio do formulario de interesse |
| Lead qualificado no CRM | `CompleteRegistration` | Helena marca como lead qualificado |
| Venda concluida | `CompletePayment` | Helena marca deal como ganho |

### Parametros Recomendados por Evento

**ViewContent:**
```json
{
  "content_type": "product",
  "content_id": "iphone-15-128gb",
  "content_name": "iPhone 15 128GB Seminovo",
  "content_category": "Smartphones",
  "value": 3999.00,
  "currency": "BRL"
}
```

**ClickButton (WhatsApp CTA):**
```json
{
  "content_type": "product",
  "content_id": "iphone-15-128gb",
  "description": "WhatsApp CTA Click"
}
```

**Contact:**
```json
{
  "content_type": "product",
  "value": 3999.00,
  "currency": "BRL",
  "description": "WhatsApp Contact - iPhone 15 128GB"
}
```

**CompletePayment:**
```json
{
  "content_type": "product",
  "value": 3999.00,
  "currency": "BRL",
  "order_id": "HELENA-DEAL-123",
  "contents": [{
    "content_id": "iphone-15-128gb",
    "content_name": "iPhone 15 128GB Seminovo",
    "price": 3999.00,
    "quantity": 1
  }]
}
```

---

## 14. Teste e Validacao

### Test Event Code

Use o `test_event_code` para testar eventos sem afetar dados reais:

```json
{
  "event_source": "web",
  "event_source_id": "PIXEL_CODE",
  "test_event_code": "TEST12345",
  "data": [...]
}
```

### Onde Encontrar o Test Event Code

1. TikTok Ads Manager > Events > Web Events
2. Selecione seu Pixel
3. Aba **Test Events**
4. Copie o codigo de teste exibido

### Validacao no TikTok Events Manager

1. Envie eventos com `test_event_code`
2. Va em **Events Manager > Test Events**
3. Verifique se os eventos aparecem em tempo real
4. Confirme os parametros recebidos
5. Verifique o **Event Match Quality** score

### Resposta da API

**Sucesso:**
```json
{
  "code": 0,
  "message": "OK",
  "request_id": "2024xxxxxxxxxxxx"
}
```

**Erro:**
```json
{
  "code": 40001,
  "message": "Invalid access token",
  "request_id": "2024xxxxxxxxxxxx"
}
```

---

## 15. Rate Limits e Batch

### Limites

| Parametro | Valor |
|-----------|-------|
| Max eventos por request (array `data`) | 50 |
| Max requests por segundo | Consultar documentacao oficial (varia por conta) |
| Janela de deduplicacao | 48 horas |
| Merge automatico de duplicatas | 5 minutos |
| Validade do ttclid | 30 dias |
| Validade do Access Token | Nao expira (mas pode ser revogado) |

### Batch Processing

Para enviar multiplos eventos de uma vez:

```json
{
  "event_source": "web",
  "event_source_id": "PIXEL_CODE",
  "data": [
    {
      "event": "ViewContent",
      "event_time": 1710849600,
      "event_id": "evt-001",
      "user": { "ip": "177.45.123.89" },
      "properties": { "content_id": "iphone-15" }
    },
    {
      "event": "ClickButton",
      "event_time": 1710849660,
      "event_id": "evt-002",
      "user": { "ip": "177.45.123.89" },
      "properties": { "description": "WhatsApp CTA" }
    }
  ]
}
```

### Recomendacoes de Batch (Tealium)

- Max 50 requests por batch
- Max 5 minutos desde o request mais antigo
- Max 1 MB por request
- Enviar assim que o threshold for atingido

---

## 16. Fontes e Referencias

### Documentacao Oficial TikTok

- [About Events API | TikTok For Business](https://ads.tiktok.com/help/article/events-api)
- [Get Started with Events API | TikTok Ads Manager](https://ads.tiktok.com/help/article/getting-started-events-api)
- [Standard Events and Parameters | TikTok Ads Manager](https://ads.tiktok.com/help/article/standard-events-parameters?lang=en)
- [Set up and Verify Pixel | TikTok Ads Manager](https://ads.tiktok.com/help/article/get-started-pixel)
- [Supported Standard Events | TikTok Ads Manager](https://ads.tiktok.com/help/article/supported-standard-events)
- [Enhanced Events API Consolidated Endpoint (Blog)](https://ads.tiktok.com/business/en-US/blog/events-api-consolidated-endpoint)
- [TikTok Marketing API Portal (Developer Docs)](https://business-api.tiktok.com/portal/docs?id=1741601162187777)
- [TikTok SignalSight EAPI Implementation Guide](https://ads.tiktok.com/help/article/tiktok-signalsight-eapi-implementation-guide?lang=en)

### Fontes Tecnicas de Terceiros

- [TikTok Conversion Tracking: Pixel & Events API Guide (Kevin Leary)](https://www.kevinleary.net/blog/tiktok-conversion-attribution-tracking/)
- [TikTok Conversion API: Boost Ad Performance (AdNabu)](https://blog.adnabu.com/tiktok/tiktok-conversion-api/)
- [TikTok Events API | Commanders Act X](https://doc.commandersact.com/features/destinations/destinations-catalog/tiktok/tiktok)
- [TikTok Events Connector | Tealium Docs](https://docs.tealium.com/server-side-connectors/tiktok-events-connector/)
- [TikTok Destination | Hightouch Docs](https://hightouch.com/docs/destinations/tiktok)
- [Adobe TikTok Web Events API Extension](https://experienceleague.adobe.com/en/docs/experience-platform/tags/extensions/server/tiktok/overview)
- [How to Set Up TikTok Events API (Stape)](https://stape.io/blog/how-to-set-up-tiktok-events-api)
- [TikTok Events API Gateway (Stape)](https://stape.io/tiktok-events-api-gateway)

---

## Apendice: Quick Reference Card

```
ENDPOINT:     POST https://business-api.tiktok.com/open_api/v1.3/event/track/
AUTH HEADER:  Access-Token: <token>
CONTENT-TYPE: application/json

PAYLOAD:
{
  "event_source": "web|app|offline|crm",
  "event_source_id": "<PIXEL_CODE>",
  "data": [{
    "event": "<EVENT_NAME>",
    "event_time": <UNIX_TIMESTAMP>,
    "event_id": "<UUID_FOR_DEDUP>",
    "user": {
      "ttclid": "<CLICK_ID>",
      "ttp": "<COOKIE_TTP>",
      "email": "<SHA256>",
      "phone": "<SHA256>",
      "external_id": "<SHA256>",
      "ip": "<PLAIN_TEXT>",
      "user_agent": "<PLAIN_TEXT>"
    },
    "page": { "url": "<PAGE_URL>", "referrer": "<REFERRER>" },
    "properties": {
      "currency": "BRL",
      "value": 0.00,
      "content_type": "product|product_group",
      "order_id": "<ORDER_ID>",
      "contents": [{
        "content_id": "<SKU>",
        "content_name": "<NAME>",
        "content_category": "<CATEGORY>",
        "price": 0.00,
        "quantity": 1,
        "brand": "<BRAND>"
      }]
    }
  }]
}

HASHING:  SHA256( lowercase( trim( value ) ) )
          Hash: email, phone, external_id
          Plain: ip, user_agent, ttclid, ttp

DEDUP:    Same event_id + event_source_id + event = deduplicated (48h window)
BATCH:    Max 50 events per request
```
