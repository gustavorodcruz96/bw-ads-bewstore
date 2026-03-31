/**
 * GTM API v2 — Automated Tag/Trigger/Variable Setup
 * Bew Store — MacBook Landing Page (ads.bewstore.com.br/macbook)
 *
 * Creates:
 * - GA4 Configuration tag + All Pages trigger
 * - Google Ads Conversion Linker
 * - Google Ads Conversion tag (ClickButton → WhatsApp)
 * - GA4 Event tags for ViewContent and ClickButton
 * - All necessary triggers and variables
 *
 * Usage: node scripts/setup-gtm.mjs
 *
 * Prerequisites:
 * 1. Service account JSON at ./gtm-service-account.json
 * 2. Service account email added to GTM container with Edit permission
 * 3. Tag Manager API enabled in Google Cloud project
 */

import { google } from "googleapis";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ── Config ── */
const GA4_MEASUREMENT_ID = "G-6L4J4K16ET";
const ADS_CONVERSION_ID = "AW-17010296713";
const ADS_CONVERSION_LABEL_WHATSAPP = "vZEkCIjwmPYaEImPkq8_";
const GTM_PUBLIC_ID = "GTM-5XTP96CN";
const KEY_FILE = resolve(__dirname, "..", "gtm-service-account.json");

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const RATE_DELAY = 2500; // 2.5s between API calls to stay under 30/min

/* ── Auth ── */
async function getClient() {
  const key = JSON.parse(readFileSync(KEY_FILE, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: [
      "https://www.googleapis.com/auth/tagmanager.edit.containers",
      "https://www.googleapis.com/auth/tagmanager.publish",
      "https://www.googleapis.com/auth/tagmanager.readonly",
    ],
  });
  return google.tagmanager({ version: "v2", auth });
}

/* ── Discover Account/Container/Workspace IDs ── */
async function discoverIds(gtm) {
  console.log(`\n🔍 Descobrindo IDs para ${GTM_PUBLIC_ID}...\n`);

  const accountsRes = await gtm.accounts.list();
  const accounts = accountsRes.data.account || [];

  for (const account of accounts) {
    const containersRes = await gtm.accounts.containers.list({
      parent: account.path,
    });
    const containers = containersRes.data.container || [];

    for (const container of containers) {
      if (container.publicId === GTM_PUBLIC_ID) {
        const workspacesRes =
          await gtm.accounts.containers.workspaces.list({
            parent: container.path,
          });
        const workspaces = workspacesRes.data.workspace || [];
        const workspace =
          workspaces.find((w) => w.name === "Default Workspace") ||
          workspaces[0];

        if (!workspace) throw new Error("Nenhum workspace encontrado");

        console.log(`  Account: ${account.name} (${account.accountId})`);
        console.log(
          `  Container: ${container.name} (${container.containerId})`
        );
        console.log(
          `  Workspace: ${workspace.name} (${workspace.workspaceId})`
        );

        return workspace.path;
      }
    }
  }

  throw new Error(`Container ${GTM_PUBLIC_ID} não encontrado. Verifique se a service account tem acesso.`);
}

/* ── Helpers ── */
function param(key, value) {
  return { type: "template", key, value };
}

function mapParam(key, entries) {
  return {
    type: "list",
    key,
    list: entries.map(([k, v]) => ({
      type: "map",
      map: [
        { type: "template", key: "key", value: k },
        { type: "template", key: "value", value: v },
      ],
    })),
  };
}

/* ── Create Trigger ── */
async function createTrigger(gtm, parent, name, type, customEventFilter) {
  await delay(RATE_DELAY);
  const body = { name, type };

  if (type === "customEvent" && customEventFilter) {
    body.customEventFilter = [
      {
        type: "equals",
        parameter: [
          { type: "template", key: "arg0", value: "{{_event}}" },
          { type: "template", key: "arg1", value: customEventFilter },
        ],
      },
    ];
  }

  try {
    const res = await gtm.accounts.containers.workspaces.triggers.create({
      parent,
      requestBody: body,
    });
    console.log(`  ✓ Trigger: ${name} (ID: ${res.data.triggerId})`);
    return res.data.triggerId;
  } catch (e) {
    if (
      e.message?.includes("duplicate") ||
      e.message?.includes("already exists") ||
      e.response?.status === 400
    ) {
      const list = await gtm.accounts.containers.workspaces.triggers.list({
        parent,
      });
      const existing = list.data.trigger?.find((t) => t.name === name);
      if (existing) {
        console.log(
          `  → Trigger "${name}" já existe (ID: ${existing.triggerId})`
        );
        return existing.triggerId;
      }
    }
    throw e;
  }
}

/* ── Create Variable ── */
async function createVariable(gtm, parent, name, type, params) {
  await delay(RATE_DELAY);
  const body = { name, type, parameter: params };

  try {
    const res = await gtm.accounts.containers.workspaces.variables.create({
      parent,
      requestBody: body,
    });
    console.log(`  ✓ Variable: ${name} (ID: ${res.data.variableId})`);
    return res.data.variableId;
  } catch (e) {
    if (
      e.message?.includes("duplicate") ||
      e.message?.includes("already exists") ||
      e.response?.status === 400
    ) {
      console.log(`  → Variable "${name}" já existe, pulando`);
      return null;
    }
    throw e;
  }
}

/* ── Create Tag ── */
async function createTag(gtm, parent, name, type, params, firingTriggerIds) {
  await delay(RATE_DELAY);
  const body = {
    name,
    type,
    parameter: params,
    firingTriggerId: firingTriggerIds,
  };

  try {
    const res = await gtm.accounts.containers.workspaces.tags.create({
      parent,
      requestBody: body,
    });
    console.log(`  ✓ Tag: ${name} (ID: ${res.data.tagId})`);
    return res.data.tagId;
  } catch (e) {
    if (
      e.message?.includes("duplicate") ||
      e.message?.includes("already exists") ||
      e.response?.status === 400
    ) {
      console.log(`  → Tag "${name}" já existe, pulando`);
      return null;
    }
    throw e;
  }
}

/* ── Main ── */
async function main() {
  console.log("\n🔧 Configurando GTM para Bew Store — MacBook LP\n");

  const gtm = await getClient();
  const PARENT = await discoverIds(gtm);

  // ──────────────────────────────
  // 1. TRIGGERS
  // ──────────────────────────────
  console.log("\n📌 Criando Triggers...");

  // All Pages (built-in, ID = 2147479553)
  const allPagesTrigger = "2147479553";

  // ViewContent — fired on MacBook page load
  const viewContentTrigger = await createTrigger(
    gtm, PARENT, "CE - ViewContent", "customEvent", "ViewContent"
  );

  // ClickButton — fired on WhatsApp CTA click
  const clickButtonTrigger = await createTrigger(
    gtm, PARENT, "CE - ClickButton", "customEvent", "ClickButton"
  );

  // ──────────────────────────────
  // 2. DATA LAYER VARIABLES
  // ──────────────────────────────
  console.log("\n📊 Criando Variables...");

  const dlvParams = [
    ["DLV - content_type", "content_type"],
    ["DLV - content_id", "content_id"],
    ["DLV - content_name", "content_name"],
    ["DLV - event_id", "event_id"],
  ];

  for (const [name, dataLayerName] of dlvParams) {
    await createVariable(gtm, PARENT, name, "v", [
      param("name", dataLayerName),
      param("dataLayerVersion", "2"),
    ]);
  }

  // ──────────────────────────────
  // 3. TAGS
  // ──────────────────────────────
  console.log("\n🏷️  Criando Tags...");

  // --- GA4 Configuration ---
  await createTag(
    gtm, PARENT,
    "GA4 - Configuration",
    "gaawc",
    [
      param("measurementId", GA4_MEASUREMENT_ID),
      param("sendPageView", "true"),
    ],
    [allPagesTrigger]
  );

  // --- Google Ads Conversion Linker ---
  await createTag(
    gtm, PARENT,
    "Google Ads - Conversion Linker",
    "gclidw",
    [
      param("enableCrossDomain", "false"),
      param("enableUrlPassthrough", "false"),
    ],
    [allPagesTrigger]
  );

  // --- GA4 - ViewContent ---
  if (viewContentTrigger) {
    await createTag(
      gtm, PARENT,
      "GA4 - ViewContent",
      "gaawe",
      [
        param("eventName", "view_item"),
        param("measurementId", GA4_MEASUREMENT_ID),
        mapParam("eventParameters", [
          ["content_type", "{{DLV - content_type}}"],
          ["content_id", "{{DLV - content_id}}"],
          ["content_name", "{{DLV - content_name}}"],
        ]),
      ],
      [viewContentTrigger]
    );
  }

  // --- GA4 - ClickButton (WhatsApp CTA) ---
  if (clickButtonTrigger) {
    await createTag(
      gtm, PARENT,
      "GA4 - ClickButton WhatsApp",
      "gaawe",
      [
        param("eventName", "generate_lead"),
        param("measurementId", GA4_MEASUREMENT_ID),
        mapParam("eventParameters", [
          ["content_type", "{{DLV - content_type}}"],
          ["content_id", "{{DLV - content_id}}"],
          ["content_name", "{{DLV - content_name}}"],
        ]),
      ],
      [clickButtonTrigger]
    );
  }

  // --- Google Ads Conversion — WhatsApp Click ---
  if (clickButtonTrigger) {
    await createTag(
      gtm, PARENT,
      "Google Ads - Conversão WhatsApp",
      "awct",
      [
        param("conversionId", ADS_CONVERSION_ID.replace("AW-", "")),
        param("conversionLabel", ADS_CONVERSION_LABEL_WHATSAPP),
        param("enableConversionLinker", "true"),
      ],
      [clickButtonTrigger]
    );
  }

  // ──────────────────────────────
  // 4. PUBLISH
  // ──────────────────────────────
  console.log("\n🚀 Publicando container...");

  try {
    const versionRes =
      await gtm.accounts.containers.workspaces.create_version({
        path: PARENT,
        requestBody: {
          name: "Bew Store — MacBook LP Setup",
          notes:
            "GA4 (G-6L4J4K16ET), Google Ads Conversion (AW-17010296713), " +
            "ViewContent, ClickButton (WhatsApp), Conversion Linker",
        },
      });

    const versionId =
      versionRes.data.containerVersion?.containerVersionId;
    if (versionId) {
      await gtm.accounts.containers.versions.publish({
        path: `${PARENT.split("/workspaces")[0]}/versions/${versionId}`,
      });
      console.log(`  ✓ Publicado! (Version ${versionId})`);
    }
  } catch (e) {
    console.log(
      `  ⚠ Não foi possível publicar automaticamente: ${e.message}`
    );
    console.log("  → Publique manualmente no tagmanager.google.com");
  }

  console.log("\n✅ Setup completo!\n");
  console.log("Resumo:");
  console.log(`  • GA4: ${GA4_MEASUREMENT_ID}`);
  console.log(`  • Google Ads: ${ADS_CONVERSION_ID}`);
  console.log(`  • Conversion Label (WhatsApp): ${ADS_CONVERSION_LABEL_WHATSAPP}`);
  console.log("  • 2 triggers: ViewContent, ClickButton");
  console.log("  • 4 variáveis dataLayer");
  console.log(
    "  • 5 tags: GA4 Config, Conversion Linker, GA4 ViewContent, GA4 ClickButton, Ads Conversão WhatsApp"
  );
}

main().catch((e) => {
  console.error("\n❌ Erro:", e.message);
  if (e.response?.data) {
    console.error("Detalhes:", JSON.stringify(e.response.data, null, 2));
  }
  process.exit(1);
});
