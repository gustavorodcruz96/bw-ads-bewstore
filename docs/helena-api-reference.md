# Helena CRM - API Reference Completa

> Fonte: https://helena.readme.io/reference
> Extraido em: 2026-03-19
> Base URL: `https://api.helena.run`

---

## Sumario

1. [Autenticacao](#1-autenticacao)
2. [Webhooks](#2-webhooks)
3. [Rastreio de Campanha UTM](#3-rastreio-de-campanha-utm)
4. [Enviar Mensagem](#4-enviar-mensagem)
5. [Conversas (Sessions)](#5-conversas-sessions)
6. [Integracao com IA](#6-integracao-com-ia)
7. [Referencia Rapida - Todos os Endpoints](#7-referencia-rapida---todos-os-endpoints)

---

## 1. Autenticacao

Para uso da API deve ser gerado um token permanente atraves da plataforma web da Helena.

**Como gerar o token:**
- Acesse `Ajustes > Integracoes > Integracao via API`

**Como usar:**
- Informe o token nos `Headers` de cada requisicao, utilizando a chave `Authorization` e o schema `Bearer`.

**Exemplo:**
```
Authorization: Bearer pn_0000000000000000000000
```

---

## 2. Webhooks

### 2.1 Guia Geral de Webhooks

O envio de eventos por webhook e um mecanismo para notificar o seu sistema quando uma variedade de interacoes ou eventos acontecem, incluindo quando uma pessoa envia uma mensagem ou um contato e alterado.

#### Configuracao

E possivel realizar a configuracao atraves da plataforma da Helena (acessando `Ajustes > Integracoes > Webhooks`) ou atraves de requisicoes para os endpoints de webhooks.

Ao criar uma nova assinatura, voce devera selecionar os eventos/topicos que deseja assinar e informar uma URL valida. A Helena enviara requisicoes HTTP utilizando o metodo `POST` para a URL informada, que devera estar preparada e disponivel publicamente para receber os eventos.

E possivel pausar temporariamente o recebimento de webhooks, modificando os status da assinatura para inativo.

#### Estrutura do Payload

As mensagens de webhook enviadas possuirao o corpo no formato `application/json` e a seguinte estrutura:

```json
{
    "eventType": "NOME_DO_EVENTO",
    "date": "DATA_DE_ENVIO",
    "content": { ... }
}
```

**Campos:**
- `eventType`: o nome do evento/topico (valores possiveis listados abaixo)
- `date`: data e hora de geracao do evento na Helena, formato `YYYY-MM-DDTHH:mm:ss`
- `content`: conteudo do evento

#### Exemplo de Payload (CONTACT_UPDATE)

```json
{
    "eventType": "CONTACT_UPDATE",
    "date": "2023-08-23T16:42:35.4359934Z",
    "content": {
        "id": "ed2b52f8-cf13-449b-b3d5-ae27051f4663",
        "createdAt": "2022-10-28T21:24:26.158391Z",
        "updatedAt": "2023-08-23T16:15:35.3814324Z",
        "companyId": "626fb5de-0cc2-4209-b456-47b454ee6e14",
        "name": "John Raymond Legrasse",
        "phonenumber": "+55|00000000000",
        "phonenumberFormatted": "(00) 00000-0000",
        "email": "exemplo@email.com",
        "instagram": null,
        "annotation": "",
        "tagsId": [],
        "tags": [],
        "status": "ACTIVE",
        "origin": "CREATED_FROM_HUB",
        "utm": null,
        "customFieldValues": {},
        "metadata": null
    }
}
```

### 2.2 Eventos Disponiveis

**Endpoint:** `GET https://api.helena.run/core/v1/webhook/event`

Lista todos os eventos de webhook que podem ser assinados.

**Eventos:**

| Evento | Descricao |
|--------|-----------|
| `SESSION_NEW` | Nova conversa criada |
| `SESSION_UPDATE` | Conversa atualizada |
| `SESSION_COMPLETE` | Conversa concluida |
| `MESSAGE_RECEIVED` | Mensagem recebida |
| `MESSAGE_UPDATED` | Mensagem atualizada |
| `MESSAGE_SENT` | Mensagem enviada |
| `CONTACT_NEW` | Novo contato criado |
| `CONTACT_UPDATE` | Contato atualizado |
| `CONTACT_TAG_UPDATE` | Etiqueta de contato atualizada |
| `PAYMENT_NEW` | Novo pagamento |
| `PAYMENT_UPDATE` | Pagamento atualizado |
| `PANEL_CARD_NEW` | Novo card no painel CRM |
| `PANEL_CARD_UPDATE` | Card do painel atualizado |
| `PANEL_CARD_STEP_CHANGE` | Mudanca de etapa do card |
| `PANEL_CARD_NOTE_NEW` | Nova anotacao no card |
| `PANEL_CARD_NOTE_UPDATE` | Anotacao do card atualizada |

**cURL:**
```bash
curl --request GET \
     --url https://api.helena.run/core/v1/webhook/event \
     --header 'accept: application/json' \
     --header 'Authorization: Bearer SEU_TOKEN'
```

**Response (200):**
```json
[
  {
    "event": "SESSION_NEW",
    "description": "string"
  }
]
```

### 2.3 Criar Assinatura de Webhook

**Endpoint:** `POST https://api.helena.run/core/v1/webhook/subscription`

**Body Params:**

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `name` | string | Sim | Nome para identificacao da assinatura (1-100 chars) |
| `url` | string | Sim | URL destino para requisicoes POST (1-500 chars) |
| `enabled` | boolean | Nao | Estado inicial da assinatura (default: true) |
| `events` | array of strings | Sim | Eventos que deverao ser enviados (min: 1) |

**cURL:**
```bash
curl --request POST \
     --url https://api.helena.run/core/v1/webhook/subscription \
     --header 'accept: application/json' \
     --header 'content-type: application/*+json' \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --data '{
  "name": "Minha Assinatura",
  "url": "https://meu-servidor.com/webhook",
  "enabled": true,
  "events": ["SESSION_NEW", "MESSAGE_RECEIVED", "CONTACT_NEW"]
}'
```

**Response (200):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "createdAt": "2026-03-19T15:34:16.475Z",
  "updatedAt": "2026-03-19T15:34:16.475Z",
  "companyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "url": "string",
  "enabled": true,
  "events": [
    {
      "event": "SESSION_NEW",
      "description": "string"
    }
  ]
}
```

### 2.4 Outros Endpoints de Webhook

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/webhook/subscription` | Listar assinaturas |
| `GET` | `/core/v1/webhook/subscription/{subscriptionId}` | Buscar assinatura por ID |
| `PUT` | `/core/v1/webhook/subscription/{subscriptionId}` | Atualizar assinatura |
| `DELETE` | `/core/v1/webhook/subscription/{subscriptionId}` | Remover assinatura |

---

## 3. Rastreio de Campanha UTM

Os padroes UTM sao parametros adicionados as URLs para ajudar a rastrear a eficacia das campanhas. Esses padroes permitem que voce identifique de onde os visitantes estao vindo e quais campanhas sao mais eficazes.

### Formato da URL UTM

```
https://api.helena.run/chat/v1/channel/wa/[TELEFONE]?text=[MENSAGEM]&utm_source=[SOURCE]&utm_medium=[MEDIUM]&utm_campaign=[CAMPAIGN]
```

### Parametros

| Parametro | Descricao | Exemplo |
|-----------|-----------|---------|
| `[TELEFONE]` | Telefone da sua empresa no formato "5511980009999" | 5511980009999 |
| `[MENSAGEM]` | Mensagem que sera enviada pelo cliente no WhatsApp | Quero saber mais |
| `[MEDIUM]` | Meio onde vai ser difundida a campanha independentemente da fonte | Stories |
| `[SOURCE]` | Plataforma de origem do lead | tiktok |
| `[CAMPAIGN]` | Identifica a campanha | PublicoAberto |

### Como Funciona

1. Assim que a conversa for iniciada pelo link UTM, voce vera a origem do lead na Helena.
2. A informacao de UTM fica disponivel na origem do contato.
3. Tambem e visivel no relatorio de indicadores e de atendimentos.

### Exemplo Pratico para TikTok Ads

```
https://api.helena.run/chat/v1/channel/wa/5511999999999?text=Oi!%20Vi%20no%20TikTok&utm_source=tiktok&utm_medium=ads&utm_campaign=iphone_seminovo_marco
```

### Dados UTM no Response da API

Quando voce consulta uma conversa (session), o objeto `utm` retorna:

```json
{
  "utm": {
    "sourceId": "string",
    "source": "tiktok",
    "clid": "string",
    "medium": "ads",
    "campaign": "iphone_seminovo_marco",
    "content": "string",
    "headline": "string",
    "term": "string",
    "referralUrl": "string"
  }
}
```

---

## 4. Enviar Mensagem

### 4.1 Enviar Mensagem (Assincrono)

**Endpoint:** `POST https://api.helena.run/chat/v1/message/send`

Este endpoint segue as mesmas regras do canal de atendimento. Uma conversa so pode ser iniciada no WhatsApp utilizando um modelo de mensagem. Caso o contato nao esteja cadastrado, ele sera cadastrado automaticamente antes do envio.

O envio da mensagem sera assincrono -- ao enviar, a mensagem sera salva em uma fila de disparo e sera processada posteriormente. Para verificar a situacao do envio, consulte pelo endereco `/chat/v1/message/{id}/status`.

**Body Params:**

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `from` | string | Nao | Numero de telefone do canal cadastrado na conta |
| `to` | string | Sim | Numero de telefone do destinatario |
| `botId` | uuid | Nao | ID do bot que sera ativado apos a resposta do contato |
| `body` | object | Sim | Conteudo da mensagem |
| `department` | object | Nao | Equipe de destino |
| `user` | object | Nao | Usuario especifico |
| `options` | object | Nao | Opcoes adicionais |

**cURL:**
```bash
curl --request POST \
     --url https://api.helena.run/chat/v1/message/send \
     --header 'accept: application/json' \
     --header 'content-type: application/*+json' \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --data '{
  "from": "5511999999999",
  "to": "5511888888888",
  "body": {
    "type": "text",
    "text": "Ola! Temos uma oferta especial para voce."
  }
}'
```

**Response (200):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "senderId": "string",
  "status": "PROCESSING",
  "statusUrl": "string"
}
```

**Status possiveis da mensagem:**
- `PROCESSING` - Em processamento
- `SAVED` - Salva
- `QUEUED` - Na fila
- `SENT` - Enviada
- `DELIVERED` - Entregue
- `READ` - Lida
- `FAILED` - Falhou
- `DELETED` - Excluida

### 4.2 Enviar Mensagem Sincrono

**Endpoint:** `POST https://api.helena.run/chat/v1/message/send/sync`

Mesmos parametros do endpoint assincrono, porem aguarda o processamento antes de retornar.

### 4.3 Outros Endpoints de Mensagens

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v1/message/{id}` | Obter mensagem por ID |
| `GET` | `/chat/v1/message/{id}/status` | Obter status da mensagem por ID |
| `DELETE` | `/chat/v1/message/{id}` | Excluir mensagem |
| `GET` | `/chat/v1/message` | Listar mensagens |

---

## 5. Conversas (Sessions)

### 5.1 Listar Conversas

**Endpoint:** `GET https://api.helena.run/chat/v2/session`

Listagem paginada de conversas.

**Query Params (Filtros):**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `Status` | array of strings | Filtro por status da conversa |
| `DepartmentId` | uuid | Filtro por ID da equipe |
| `UserId` | uuid | Filtro por ID do usuario |
| `TagsId` | array of uuids | Filtro por IDs de etiquetas |
| `TagsName` | array of strings | Filtro por nomes de etiquetas |
| `ChannelsId` | array of uuids | Filtro por ID de canais |
| `ContactId` | uuid | Filtro por ID do contato |
| `EndAt.Before` | date-time | Limite superior de busca (UTC) |
| `EndAt.After` | date-time | Limite inferior de busca (UTC) |
| `ActiveAt.Before` | date-time | Limite superior de busca (UTC) |
| `ActiveAt.After` | date-time | Limite inferior de busca (UTC) |
| `LastInteractionAt.Before` | date-time | Limite superior de busca (UTC) |
| `LastInteractionAt.After` | date-time | Limite inferior de busca (UTC) |
| `IncludeDetails` | array of strings | Inclua detalhes de outras entidades |
| `Metadata` | object | Filtro por metadados |
| `Type` | string (INDIVIDUAL/GROUP) | Filtro por tipo da conversa |
| `CreatedAt.Before` | date-time | Limite superior de busca (UTC) |
| `CreatedAt.After` | date-time | Limite inferior de busca (UTC) |
| `UpdatedAt.Before` | date-time | Limite superior de busca (UTC) |
| `UpdatedAt.After` | date-time | Limite inferior de busca (UTC) |
| `PageNumber` | int32 | Numero da pagina (default: 1) |
| `PageSize` | int32 | Tamanho da pagina (1-100, default: 15) |
| `OrderBy` | string | Campo para ordenacao |
| `OrderDirection` | string (ASCENDING/DESCENDING) | Direcao da ordenacao |

**cURL:**
```bash
curl --request GET \
     --url 'https://api.helena.run/chat/v2/session?PageSize=15&PageNumber=1' \
     --header 'accept: application/json' \
     --header 'Authorization: Bearer SEU_TOKEN'
```

**Response (200):**
```json
{
  "pageNumber": 1,
  "pageSize": 15,
  "orderBy": "string",
  "orderDirection": "ASCENDING",
  "items": [
    {
      "id": "uuid",
      "createdAt": "date-time",
      "updatedAt": "date-time",
      "startAt": "date-time",
      "endAt": "date-time",
      "status": "STARTED",
      "companyId": "uuid",
      "contactId": "uuid",
      "channelId": "uuid",
      "departmentId": "uuid",
      "userId": "uuid",
      "previewUrl": "string",
      "title": "string",
      "number": "string",
      "utm": {
        "sourceId": "string",
        "source": "string",
        "clid": "string",
        "medium": "string",
        "campaign": "string",
        "content": "string",
        "headline": "string",
        "term": "string",
        "referralUrl": "string"
      },
      "origin": "string",
      "contactDetails": {
        "id": "uuid",
        "name": "string",
        "pictureUrl": "string",
        "phonenumber": "string",
        "instagram": "string",
        "phonenumberFormatted": "string",
        "tagsId": ["uuid"],
        "tagsName": ["string"],
        "status": "ACTIVE"
      },
      "agentDetails": {
        "id": "uuid",
        "userId": "uuid",
        "name": "string",
        "shortName": "string",
        "phoneNumber": "string",
        "email": "string",
        "pictureFileId": "uuid",
        "pictureUrl": "string"
      },
      "channelDetails": {
        "humanId": "string",
        "platform": "string",
        "provider": "string",
        "providerVariable": "string",
        "pictureUrl": "string",
        "displayName": "string"
      },
      "windowStatus": "ACTIVE",
      "metadata": {},
      "channelType": "CLOUDAPI_WHATSAPP",
      "type": "INDIVIDUAL"
    }
  ],
  "totalItems": 0,
  "totalPages": 0,
  "hasMorePages": false
}
```

**Status da conversa:**
- `UNDEFINED` - Indefinido
- `STARTED` - Iniciada
- `PENDING` - Pendente
- `IN_PROGRESS` - Em andamento
- `COMPLETED` - Concluida
- `HIDDEN` - Oculta

**Tipos de canal (channelType):**
- `GUPSHUP_WHATSAPP`
- `DIALOG360_WHATSAPP`
- `CLOUDAPI_WHATSAPP`
- `ZAPI_WHATSAPP`
- `EVOLUTIONAPI_WHATSAPP`
- `INSTAGRAM`
- `MESSENGER`

**Window Status:**
- `ACTIVE` - Janela ativa
- `EXPIRED` - Janela expirada
- `NOT_STARTED` - Nao iniciada

### 5.2 Outros Endpoints de Conversas

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v2/session/{id}` | Obter conversa por ID |
| `PUT` | `/chat/v1/session/{id}/transfer` | Transferir conversa |
| `PUT` | `/chat/v1/session/{id}/assignee` | Atribuir usuario |
| `PUT` | `/chat/v1/session/{id}/complete` | Concluir conversa |
| `PUT` | `/chat/v1/session/{id}/status` | Alterar status |
| `PUT` | `/chat/v2/session/{id}/partial` | Alterar parcialmente |
| `GET` | `/chat/v1/session/{id}/message` | Listar mensagens da conversa |
| `POST` | `/chat/v1/session/{id}/message` | Enviar mensagem na conversa |
| `POST` | `/chat/v1/session/{id}/message/sync` | Enviar mensagem sincrona na conversa |
| `POST` | `/chat/v1/session/{id}/note` | Salvar nota interna |
| `GET` | `/chat/v1/session/{id}/note` | Listar notas internas |
| `GET` | `/chat/v1/session/note/{id}` | Obter uma nota interna |
| `DELETE` | `/chat/v1/session/note/{id}` | Excluir nota interna |

---

## 6. Integracao com IA

A Helena possui um guia completo para integracao com IA (OpenAI) via N8N, dividido em 5 etapas.

### 6.1 Criar um Assistente (OpenAI)

**Passos:**
1. Criar conta na OpenAI em https://platform.openai.com
2. Acessar o Dashboard > Assistants
3. Clicar em "Create"
4. Configurar:
   - **Name**: Nome do assistente
   - **System instruction**: Definir comportamento (ex: "Voce deve se comportar como um vendedor de iPhones seminovos...")
   - **Model**: Recomendado `gpt-4o-mini`
   - **File search**: Opcional, para base de conhecimento
   - **Code Interpreter**: Opcional
   - **Response Format**: Text
   - **Temperature e Top P**: Deixar default inicialmente
5. Criar API Key em "API Keys" > "Create new secret key"

### 6.2 Criar o Loop no Chatbot

URL: https://helena.readme.io/reference/1-ler-textos

Configurar no chatbot da Helena um loop que:
- Recebe mensagens do contato
- Envia para a IA processar
- Retorna a resposta ao contato
- Repete o ciclo ate condicao de saida

### 6.3 Como Ler e Responder Textos

URL: https://helena.readme.io/reference/1-ler-textos-1

Integracao via N8N/webhook para:
- Ler mensagens de texto recebidas
- Processar com a IA
- Enviar resposta de volta

### 6.4 Como Processar Audios

URL: https://helena.readme.io/reference/2-processar-audios

Integracao para:
- Receber audios enviados pelo contato
- Transcrever com Whisper (OpenAI)
- Processar texto transcrito com IA
- Enviar resposta

### 6.5 Como Processar Imagens

URL: https://helena.readme.io/reference/2-ver-imagens

Integracao para:
- Receber imagens enviadas pelo contato
- Processar com modelo de visao (GPT-4o)
- Enviar resposta baseada na analise da imagem

---

## 7. Referencia Rapida - Todos os Endpoints

### Core

#### Arquivos
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v2/file` | Obter URL para upload |
| `POST` | `/core/v2/file` | Salvar arquivo |

#### Campos
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/custom-field` | Listar campos customizados |

#### Carteiras
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/portfolio` | Listar carteiras |
| `GET` | `/core/v1/portfolio/{id}/contact` | Listar contatos da carteira |
| `POST` | `/core/v1/portfolio/{id}/contact` | Adicionar contato |
| `DELETE` | `/core/v1/portfolio/{id}/contact` | Remover contato |
| `POST` | `/core/v1/portfolio/{id}/contact/batch` | Adicionar contatos em massa |
| `DELETE` | `/core/v1/portfolio/{id}/contact/batch` | Remover contatos em massa |

#### Contas
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/company` | Listar contas |
| `POST` | `/core/v1/company` | Criar conta |
| `GET` | `/core/v1/company/{id}` | Obter por ID |
| `PUT` | `/core/v1/company/{id}` | Atualizar |
| `DELETE` | `/core/v1/company/{id}` | Excluir |
| `POST` | `/core/v1/company/{id}/active` | Ativar |
| `GET` | `/core/v1/company/{id}/tokens` | Listar tokens |
| `POST` | `/core/v1/company/{id}/tokens` | Criar token |
| `DELETE` | `/core/v1/company/{id}/tokens/{tokenId}` | Remover token |

#### Contatos
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/contact` | Listar |
| `POST` | `/core/v1/contact` | Criar |
| `POST` | `/core/v1/contact/filter` | Filtrar |
| `GET` | `/core/v1/contact/phonenumber/{phone}` | Obter por telefone |
| `PUT` | `/core/v1/contact/phonenumber/{phone}` | Atualizar por telefone |
| `GET` | `/core/v1/contact/{id}` | Obter por ID |
| `PUT` | `/core/v2/contact/{id}` | Atualizar |
| `POST` | `/core/v1/contact/phonenumber/{phone}/tags` | Atualizar etiquetas por telefone |
| `POST` | `/core/v1/contact/{id}/tags` | Atualizar etiquetas |
| `POST` | `/core/v2/contact/batch` | Salvar em massa |
| `GET` | `/core/v1/contact/custom-field` | Campos personalizados |

#### Equipes
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `POST` | `/core/v1/department` | Criar |
| `GET` | `/core/v2/department` | Listar |
| `GET` | `/core/v1/department/{id}` | Obter por ID |
| `PUT` | `/core/v1/department/{id}` | Atualizar |
| `DELETE` | `/core/v1/department/{id}` | Excluir |
| `PUT` | `/core/v1/department/{id}/agents` | Atualizar usuarios |
| `GET` | `/core/v1/department/{id}/channel` | Listar canais |

#### Etiquetas
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/tag` | Listar |

#### Usuarios
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/agent` | Listar |
| `POST` | `/core/v1/agent` | Criar |
| `GET` | `/core/v1/agent/{id}` | Obter por ID |
| `PUT` | `/core/v1/agent/{id}` | Atualizar |
| `DELETE` | `/core/v1/agent/{id}` | Excluir |
| `POST` | `/core/v1/agent/{id}/departments` | Atualizar equipes |
| `POST` | `/core/v1/agent/{id}/status` | Alterar status |
| `POST` | `/core/v1/agent/{id}/logout` | Fazer logout |

#### Webhooks
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/webhook/event` | Listar eventos |
| `GET` | `/core/v1/webhook/subscription` | Listar assinaturas |
| `POST` | `/core/v1/webhook/subscription` | Criar assinatura |
| `GET` | `/core/v1/webhook/subscription/{id}` | Buscar assinatura por ID |
| `PUT` | `/core/v1/webhook/subscription/{id}` | Atualizar assinatura |
| `DELETE` | `/core/v1/webhook/subscription/{id}` | Remover assinatura |

### Chat

#### Broadcast
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `POST` | `/chat/v1/broadcast/otp` | OTP envio |
| `GET` | `/chat/v1/broadcast/otp/{id}` | OTP status |

#### Canais de Atendimento
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v1/channel` | Listar canais |

#### Chatbots
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v1/chatbot` | Listar |
| `POST` | `/chat/v1/chatbot/send` | Enviar chatbot |

#### Conversas
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v2/session` | Listar |
| `GET` | `/chat/v2/session/{id}` | Obter por ID |
| `PUT` | `/chat/v1/session/{id}/transfer` | Transferir |
| `PUT` | `/chat/v1/session/{id}/assignee` | Atribuir usuario |
| `PUT` | `/chat/v1/session/{id}/complete` | Concluir |
| `PUT` | `/chat/v1/session/{id}/status` | Alterar status |
| `PUT` | `/chat/v2/session/{id}/partial` | Alterar parcialmente |
| `GET` | `/chat/v1/session/{id}/message` | Listar mensagens |
| `POST` | `/chat/v1/session/{id}/message` | Enviar mensagem |
| `POST` | `/chat/v1/session/{id}/message/sync` | Enviar mensagem sincrona |
| `POST` | `/chat/v1/session/{id}/note` | Salvar nota interna |
| `GET` | `/chat/v1/session/{id}/note` | Listar notas internas |
| `GET` | `/chat/v1/session/note/{id}` | Obter nota interna |
| `DELETE` | `/chat/v1/session/note/{id}` | Excluir nota interna |

#### Mensagens
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `POST` | `/chat/v1/message/send` | Enviar (assincrono) |
| `POST` | `/chat/v1/message/send/sync` | Enviar (sincrono) |
| `GET` | `/chat/v1/message/{id}` | Obter por ID |
| `GET` | `/chat/v1/message/{id}/status` | Obter status por ID |
| `DELETE` | `/chat/v1/message/{id}` | Excluir |
| `GET` | `/chat/v1/message` | Listar |

#### Mensagens Agendadas
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v1/scheduled-message` | Listar |
| `POST` | `/chat/v1/scheduled-message` | Criar |
| `GET` | `/chat/v1/scheduled-message/{id}` | Obter por ID |
| `PUT` | `/chat/v1/scheduled-message/{id}` | Atualizar |
| `POST` | `/chat/v1/scheduled-message/{id}/cancel` | Cancelar |
| `POST` | `/chat/v1/scheduled-message/batch/cancel` | Cancelar em massa |

#### Modelos de Mensagem
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v1/template` | Listar templates |

#### Sequencias
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/chat/v1/sequence` | Listar |
| `GET` | `/chat/v2/sequence/{id}/contact` | Listar contatos |
| `POST` | `/chat/v1/sequence/{id}/contact` | Adicionar contato |
| `DELETE` | `/chat/v1/sequence/{id}/contact` | Remover contato |
| `POST` | `/chat/v1/sequence/{id}/contact/batch` | Adicionar contatos |
| `DELETE` | `/chat/v1/sequence/{id}/contact/batch` | Remover contatos |

### CRM

#### Cards
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/panel/card` | Listar |
| `POST` | `/core/v1/panel/card` | Criar |
| `GET` | `/core/v1/panel/card/{id}` | Obter por ID |
| `PUT` | `/core/v2/panel/card/{id}` | Atualizar |
| `POST` | `/core/v1/panel/card/{id}/duplicate` | Duplicar |
| `GET` | `/core/v1/panel/card/{cardId}/note` | Listar anotacoes |
| `POST` | `/core/v1/panel/card/{cardId}/note` | Adicionar anotacao |
| `DELETE` | `/core/v1/panel/card/{cardId}/note/{noteId}` | Remover anotacao |

#### Paineis
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/core/v1/panel` | Listar paineis |
| `GET` | `/core/v1/panel/{id}` | Obter por ID |
| `GET` | `/core/v1/panel/{id}/custom-fields` | Campos personalizados |

---

## Informacoes Adicionais

### Rate Limiting
A API possui limites de requisicoes. Consulte https://helena.readme.io/reference/rate-limiting para detalhes.

### Paginacao
Endpoints de listagem usam paginacao com `PageNumber` e `PageSize`. Response inclui `totalItems`, `totalPages` e `hasMorePages`.

### Horarios de Atendimento
**Endpoint:** `GET /core/v1/company/officehours` - Obter horarios de atendimento configurados.

### Informacoes para Firewall
Consulte https://helena.readme.io/reference/informações-para-firewall para IPs que precisam ser liberados.

### Integracoes sem Codigo
- **N8N**: https://helena.readme.io/reference/automações-via-n8n
- **Make.com**: https://helena.readme.io/reference/makecom
- **Token de integracao**: https://helena.readme.io/reference/criar-token-de-integração
