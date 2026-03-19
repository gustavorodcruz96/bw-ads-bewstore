"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Phone,
  Clock,
  X,
  Bot,
  User,
  Save,
  Loader2,
} from "lucide-react";

type Session = {
  id: string;
  helena_session_id: string;
  phone: string;
  name: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  status: string;
  sale_value: number | null;
  sale_product: string | null;
  modelo_desejado: string | null;
  orcamento: string | null;
  urgencia: string | null;
  agent_handled: boolean;
  created_at: string;
};

type AgentLog = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokens_used: number;
  created_at: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  new: { label: "Novo", bg: "bg-blue-500/10", text: "text-blue-400" },
  in_progress: {
    label: "Em atendimento",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
  negotiation: {
    label: "Negociação",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
  },
  sale: { label: "Venda", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  completed: {
    label: "Concluído",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
  },
};

const STATUS_OPTIONS = [
  { value: "new", label: "Novo" },
  { value: "in_progress", label: "Em atendimento" },
  { value: "negotiation", label: "Negociação" },
  { value: "sale", label: "Venda" },
  { value: "completed", label: "Concluído" },
];

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-white/90">{value || "—"}</p>
    </div>
  );
}

function SessionModal({
  session,
  onClose,
  onSave,
}: {
  session: Session;
  onClose: () => void;
  onSave: (updated: Session) => void;
}) {
  const [editName, setEditName] = useState(session.name || "");
  const [editStatus, setEditStatus] = useState(session.status || "new");
  const [editSaleValue, setEditSaleValue] = useState(
    session.sale_value != null ? String(session.sale_value) : ""
  );
  const [editSaleProduct, setEditSaleProduct] = useState(
    session.sale_product || ""
  );
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (session.agent_handled) {
      setLogsLoading(true);
      fetch(`/api/admin/agent-logs?session_id=${session.helena_session_id}`)
        .then((r) => r.json())
        .then((d) => setLogs(d.logs || []))
        .catch(() => {})
        .finally(() => setLogsLoading(false));
    }
  }, [session.helena_session_id, session.agent_handled]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/conversas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: session.id,
          name: editName || null,
          status: editStatus,
          sale_value: editSaleValue ? Number(editSaleValue) : null,
          sale_product: editSaleProduct || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onSave(data.session);
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }

  const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.new;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#0d0d0f] border-l border-gray-800 flex flex-col h-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
              <Phone className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">
                {session.name || "Sem nome"}
              </p>
              <p className="text-xs text-gray-500">{session.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}
            >
              {statusCfg.label}
            </span>
            {session.agent_handled && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                IA Ativada
              </span>
            )}
          </div>

          {/* Session info */}
          <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4 grid grid-cols-2 gap-4">
            <DetailField label="Fonte UTM" value={session.utm_source} />
            <DetailField label="Campanha" value={session.utm_campaign} />
            <DetailField label="Meio" value={session.utm_medium} />
            <DetailField label="Conteúdo" value={session.utm_content} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Data</p>
              <p className="text-sm text-white/90">
                {new Date(session.created_at).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Lead info extracted by agent */}
          {(session.modelo_desejado || session.orcamento || session.urgencia) && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Informações extraídas pelo agente
              </p>
              <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4 grid grid-cols-2 gap-4">
                <DetailField
                  label="Modelo desejado"
                  value={session.modelo_desejado}
                />
                <DetailField label="Orçamento" value={session.orcamento} />
                <DetailField label="Urgência" value={session.urgencia} />
              </div>
            </div>
          )}

          {/* Editable fields */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Editar dados
            </p>
            <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4 space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nome</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white/90 focus:outline-none focus:border-gray-500 transition-colors"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Valor da venda (R$)
                </label>
                <input
                  type="number"
                  value={editSaleValue}
                  onChange={(e) => setEditSaleValue(e.target.value)}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Produto vendido
                </label>
                <input
                  type="text"
                  value={editSaleProduct}
                  onChange={(e) => setEditSaleProduct(e.target.value)}
                  placeholder="Ex: iPhone 13 128GB"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Agent conversation log */}
          {session.agent_handled && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Conversa com o agente
              </p>
              {logsLoading ? (
                <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-6 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                  <span className="text-sm text-gray-500">
                    Carregando conversa...
                  </span>
                </div>
              ) : logs.length === 0 ? (
                <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-6 text-center">
                  <p className="text-sm text-gray-500">
                    Nenhuma mensagem registrada.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4 space-y-3 max-h-80 overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex gap-2.5 ${
                        log.role === "assistant" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          log.role === "assistant"
                            ? "bg-purple-500/20"
                            : "bg-gray-800"
                        }`}
                      >
                        {log.role === "assistant" ? (
                          <Bot className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                      <div
                        className={`flex-1 ${
                          log.role === "assistant" ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        <div
                          className={`rounded-xl px-3 py-2 text-xs text-white/90 max-w-[85%] ${
                            log.role === "assistant"
                              ? "bg-purple-500/15 border border-purple-500/20"
                              : "bg-white/[0.05] border border-gray-700"
                          }`}
                        >
                          {log.content}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1 px-1">
                          {new Date(log.created_at).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConversasPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      const res = await fetch("/api/admin/conversas");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSave(updated: Session) {
    setSessions((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    );
    setSelectedSession((prev) =>
      prev && prev.id === updated.id ? { ...prev, ...updated } : prev
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">Conversas</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Conversas rastreadas do WhatsApp via Helena
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm mt-3">Carregando...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-14 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800 mx-auto mb-5">
            <MessageSquare className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white/90 mb-2">
            Nenhuma conversa ainda
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            As conversas aparecerão aqui quando o webhook do Helena estiver
            ativo e os anúncios estiverem rodando.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-4 md:px-6 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">
              {sessions.length} conversa{sessions.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-gray-600">
              Clique em uma linha para ver detalhes
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 md:px-6">
                    Cliente
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                    Origem UTM
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">
                    Valor
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {sessions.map((session) => {
                  const statusCfg =
                    STATUS_CONFIG[session.status] || STATUS_CONFIG.new;
                  return (
                    <tr
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 md:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/90">
                              {session.name || "Sem nome"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {session.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-gray-300">
                            {session.utm_source || "direto"}
                          </span>
                          {session.utm_campaign && (
                            <span className="text-xs text-gray-500">
                              {session.utm_campaign}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}
                          >
                            {statusCfg.label}
                          </span>
                          {session.agent_handled && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                              IA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {session.sale_value ? (
                          <span className="text-sm font-semibold text-emerald-400">
                            R${" "}
                            {session.sale_value.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5 text-gray-600" />
                          {new Date(session.created_at).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
