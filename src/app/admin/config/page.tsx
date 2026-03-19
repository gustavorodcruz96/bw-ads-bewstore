"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Link as LinkIcon,
} from "lucide-react";

type ConfigStatus = {
  tiktokPixel: boolean;
  tiktokToken: boolean;
  helenaToken: boolean;
  supabase: boolean;
  webhookUrl: string;
};

export default function ConfigPage() {
  const [status, setStatus] = useState<ConfigStatus>({
    tiktokPixel: false,
    tiktokToken: false,
    helenaToken: false,
    supabase: false,
    webhookUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch config:", err);
    } finally {
      setLoading(false);
    }
  }

  function copyWebhook() {
    const url =
      status.webhookUrl || "https://ads.bewstore.com.br/api/helena/webhook";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const configs = [
    {
      label: "TikTok Pixel ID",
      configured: status.tiktokPixel,
      description: "Pixel instalado na landing page (client-side)",
    },
    {
      label: "TikTok Access Token",
      configured: status.tiktokToken,
      description: "Events API para tracking server-side",
    },
    {
      label: "Helena API Token",
      configured: status.helenaToken,
      description: "Integração com Helena CRM",
    },
    {
      label: "Supabase",
      configured: status.supabase,
      description: "Banco de dados para persistência",
    },
  ];

  const configuredCount = configs.filter((c) => c.configured).length;

  const usefulLinks = [
    {
      label: "TikTok Ads Manager",
      href: "https://ads.tiktok.com",
      description: "Gerenciar campanhas e anúncios",
    },
    {
      label: "Helena CRM",
      href: "https://app.helena.run",
      description: "Atendimento e gestão de conversas",
    },
    {
      label: "Supabase Dashboard",
      href: "https://supabase.com/dashboard",
      description: "Banco de dados e configurações",
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">Configurações</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Status das integrações e configuração do sistema
        </p>
      </div>

      {/* Overview summary */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {configs.map((cfg) => (
            <div
              key={cfg.label}
              className={`rounded-2xl border p-4 flex flex-col gap-2 ${
                cfg.configured
                  ? "border-emerald-800/40 bg-emerald-500/[0.04]"
                  : "border-gray-800 bg-white/[0.02]"
              }`}
            >
              {cfg.configured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <p className="text-xs font-medium text-white/80 leading-tight">
                {cfg.label}
              </p>
              <span
                className={`text-xs font-medium ${
                  cfg.configured ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {cfg.configured ? "Configurado" : "Pendente"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Integration details */}
      <div className="rounded-2xl border border-gray-800 bg-white/[0.03] overflow-hidden mb-6">
        <div className="px-5 py-4 md:px-6 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white/90">
            Status das Integrações
          </h2>
          {!loading && (
            <p className="text-xs text-gray-400 mt-0.5">
              {configuredCount} de {configs.length} integração
              {configs.length !== 1 ? "s" : ""} ativa
              {configuredCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="divide-y divide-gray-800/50">
          {configs.map((config) => (
            <div
              key={config.label}
              className="flex items-center justify-between px-5 py-4 md:px-6"
            >
              <div>
                <p className="text-sm font-medium text-white/90">
                  {config.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {config.description}
                </p>
              </div>
              {loading ? (
                <span className="inline-block w-20 h-5 bg-gray-800 rounded animate-pulse" />
              ) : config.configured ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Configurado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Pendente
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Webhook URL */}
      <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6 mb-6">
        <h2 className="text-base font-semibold text-white/90 mb-1">
          Webhook Helena
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Configure este URL no Helena em{" "}
          <span className="text-gray-300">
            Ajustes → Integrações → Webhooks
          </span>
          :
        </p>
        <div className="flex items-center gap-3 rounded-xl bg-gray-900 border border-gray-800 px-4 py-3">
          <code className="flex-1 text-sm text-emerald-400 font-mono break-all">
            {status.webhookUrl || "https://ads.bewstore.com.br/api/helena/webhook"}
          </code>
          <button
            onClick={copyWebhook}
            title="Copiar URL"
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && (
          <p className="text-xs text-emerald-400 mt-2">URL copiado!</p>
        )}
        <div className="mt-3 rounded-lg bg-gray-900/50 border border-gray-800/50 px-4 py-3">
          <p className="text-xs text-gray-500">
            <span className="text-gray-400 font-medium">
              Eventos necessários:
            </span>{" "}
            SESSION_NEW, CONTACT_UPDATE, SESSION_UPDATED
          </p>
        </div>
      </div>

      {/* Useful links */}
      <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <LinkIcon className="w-4 h-4 text-gray-400" />
          <h2 className="text-base font-semibold text-white/90">
            Links Úteis
          </h2>
        </div>
        <div className="space-y-2">
          {usefulLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-gray-500">{link.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
