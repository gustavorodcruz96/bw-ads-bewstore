"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Phone, Clock } from "lucide-react";

type Session = {
  id: string;
  helena_session_id: string;
  phone: string;
  name: string;
  utm_source: string;
  utm_campaign: string;
  status: string;
  sale_value: number | null;
  sale_product: string | null;
  agent_handled: boolean;
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
  sale: { label: "Venda", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  completed: {
    label: "Concluído",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
  },
};

export default function ConversasPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

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
                      className="hover:bg-white/[0.02] transition-colors"
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
    </div>
  );
}
