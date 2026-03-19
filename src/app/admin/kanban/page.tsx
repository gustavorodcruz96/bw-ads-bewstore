"use client";

import { useEffect, useState } from "react";
import {
  Phone,
  Clock,
  Tag,
  GripVertical,
  MessageSquare,
  Bot,
  ArrowRight,
} from "lucide-react";

type Lead = {
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

const COLUMNS = [
  {
    id: "new",
    title: "Novo Lead",
    color: "bg-gray-500",
    borderColor: "border-gray-700",
    bgColor: "bg-gray-800/20",
    description: "Leads que chegaram do TikTok",
  },
  {
    id: "in_progress",
    title: "Em Atendimento",
    color: "bg-gray-500",
    borderColor: "border-gray-700",
    bgColor: "bg-gray-800/20",
    description: "Conversando com vendedor ou IA",
  },
  {
    id: "negotiation",
    title: "Negociação",
    color: "bg-gray-500",
    borderColor: "border-gray-700",
    bgColor: "bg-gray-800/20",
    description: "Interesse confirmado, negociando",
  },
  {
    id: "sale",
    title: "Venda Fechada",
    color: "bg-emerald-500",
    borderColor: "border-emerald-800/40",
    bgColor: "bg-emerald-500/5",
    description: "Conversão confirmada",
  },
  {
    id: "lost",
    title: "Perdido",
    color: "bg-gray-600",
    borderColor: "border-gray-700",
    bgColor: "bg-gray-800/10",
    description: "Não converteu",
  },
];

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/admin/kanban");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }

  async function moveCard(leadId: string, newStatus: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      await fetch("/api/admin/kanban", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to move card:", err);
      fetchLeads();
    }
  }

  function handleDragStart(e: React.DragEvent, leadId: string) {
    e.dataTransfer.setData("leadId", leadId);
    setDragging(leadId);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent, columnId: string) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) {
      moveCard(leadId, columnId);
    }
    setDragging(null);
  }

  function getColumnLeads(columnId: string) {
    return leads.filter((l) => l.status === columnId);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white/90">Pipeline de Leads</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Arraste os cards para mover leads entre estágios. A IA pode mover
          automaticamente.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const count = getColumnLeads(col.id).length;
          return (
            <div
              key={col.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-gray-800 flex-shrink-0"
            >
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <span className="text-xs text-gray-400">{col.title}</span>
              <span className="text-xs font-bold text-white/90">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[60vh]">
        {COLUMNS.map((column) => {
          const columnLeads = getColumnLeads(column.id);

          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column header */}
              <div
                className={`rounded-t-xl border-t-2 ${column.borderColor} bg-white/[0.03] border border-gray-800 border-t-0 px-4 py-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                    <h3 className="text-sm font-semibold text-white/90">
                      {column.title}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                    {columnLeads.length}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {column.description}
                </p>
              </div>

              {/* Cards */}
              <div
                className={`space-y-2 p-2 rounded-b-xl border border-gray-800 border-t-0 min-h-[200px] transition-colors ${
                  dragging ? `${column.bgColor}` : "bg-transparent"
                }`}
              >
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-24 rounded-xl bg-white/[0.02] animate-pulse"
                      />
                    ))}
                  </div>
                ) : columnLeads.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-gray-600 text-xs">
                    Arraste leads aqui
                  </div>
                ) : (
                  columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className={`rounded-xl bg-white/[0.03] border border-gray-800 p-3 cursor-grab active:cursor-grabbing hover:border-gray-600 transition-all ${
                        dragging === lead.id ? "opacity-50 scale-95" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/90 leading-tight">
                              {lead.name || "Sem nome"}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {lead.phone}
                            </p>
                          </div>
                        </div>
                        <GripVertical className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.utm_source && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-gray-800 text-gray-400">
                            <Tag className="w-2.5 h-2.5" />
                            {lead.utm_source}
                          </span>
                        )}
                        {lead.utm_campaign && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800 text-gray-400">
                            {lead.utm_campaign}
                          </span>
                        )}
                        {lead.agent_handled && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400">
                            <Bot className="w-2.5 h-2.5" />
                            IA
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDate(lead.created_at)}
                        </span>
                        {lead.sale_value && (
                          <span className="text-xs font-semibold text-emerald-400">
                            R$ {lead.sale_value.toLocaleString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
