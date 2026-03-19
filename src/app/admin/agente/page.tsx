"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  MessageSquare,
  UserCheck,
  ArrowRight,
  Clock,
  Kanban,
  Sparkles,
  Power,
  Loader2,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Pré-atendimento automático",
    description:
      "Responde como um vendedor real pelo WhatsApp. Coleta modelo desejado, orçamento e urgência do cliente.",
    color: "text-gray-400",
    bgColor: "bg-gray-800",
  },
  {
    icon: UserCheck,
    title: "Handoff inteligente",
    description:
      "Quando o lead está qualificado, transfere para o vendedor humano com todo o contexto já coletado.",
    color: "text-gray-400",
    bgColor: "bg-gray-800",
  },
  {
    icon: Clock,
    title: "Follow-up automático",
    description:
      "Se o lead não respondeu ou não fechou, a IA reengaja automaticamente. Nenhum lead esfria.",
    color: "text-gray-400",
    bgColor: "bg-gray-800",
  },
  {
    icon: Kanban,
    title: "Move cards automaticamente",
    description:
      "Atualiza o pipeline: move leads entre estágios (Novo → Em Atendimento → Negociação) conforme a conversa.",
    color: "text-gray-400",
    bgColor: "bg-gray-800",
  },
];

export default function AgentePage() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/admin/agente");
      if (res.ok) {
        const data = await res.json();
        setEnabled(data.enabled);
      }
    } catch (err) {
      console.error("Failed to fetch agent status:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAgent() {
    setToggling(true);
    try {
      const res = await fetch("/api/admin/agente", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (res.ok) {
        setEnabled(!enabled);
      }
    } catch (err) {
      console.error("Failed to toggle agent:", err);
    } finally {
      setToggling(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">Agente IA</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Pré-atendimento automático via WhatsApp
        </p>
      </div>

      {/* Status + Toggle */}
      <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                enabled ? "bg-emerald-500/10" : "bg-gray-800"
              }`}
            >
              <Bot
                className={`w-5 h-5 ${enabled ? "text-emerald-400" : "text-gray-400"}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white/90">
                  Status do Agente
                </h3>
                {loading ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-800 text-gray-400">
                    ...
                  </span>
                ) : enabled ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ativo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700">
                    Desativado
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {enabled
                  ? "O agente está respondendo automaticamente pelo WhatsApp"
                  : "O agente não está respondendo. Ative para iniciar o pré-atendimento."}
              </p>
            </div>
          </div>

          <button
            onClick={toggleAgent}
            disabled={loading || toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              enabled
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
            } disabled:opacity-50`}
          >
            {toggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {enabled ? "Desativar" : "Ativar"}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
            </div>
            <h3 className="text-sm font-semibold text-white/90 mb-2">
              {feature.title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Flow */}
      <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-6">
        <h3 className="text-sm font-semibold text-white/90 mb-4">
          Fluxo do Agente
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { label: "Lead chega", color: "bg-gray-800 text-gray-300 border-gray-700" },
            { label: "IA pré-atende", color: "bg-gray-800 text-gray-300 border-gray-700" },
            { label: "Qualifica", color: "bg-gray-800 text-gray-300 border-gray-700" },
            { label: "Passa ao vendedor", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
            { label: "Follow-up se necessário", color: "bg-gray-800 text-gray-300 border-gray-700" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-lg border font-medium ${step.color}`}
              >
                {step.label}
              </span>
              {i < arr.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
