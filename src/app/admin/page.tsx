"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Eye,
  MousePointer,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Phone,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

type Stats = {
  viewContent: number;
  clickButton: number;
  contact: number;
  completePayment: number;
  totalRevenue: number;
};

type Session = {
  id: string;
  phone: string;
  name: string;
  utm_source: string;
  utm_campaign: string;
  status: string;
  sale_value: number | null;
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

const MONTHLY_DATA = [
  { mes: "Set", vendas: 4 },
  { mes: "Out", vendas: 7 },
  { mes: "Nov", vendas: 5 },
  { mes: "Dez", vendas: 11 },
  { mes: "Jan", vendas: 8 },
  { mes: "Fev", vendas: 6 },
  { mes: "Mar", vendas: 9 },
];

function MetricCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  change,
  changePositive,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  change?: string;
  changePositive?: boolean;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg}`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-400">{label}</span>
          <h4 className="mt-2 text-2xl font-bold text-white/90">
            {loading ? (
              <span className="inline-block w-16 h-7 bg-gray-800 rounded animate-pulse" />
            ) : (
              value
            )}
          </h4>
        </div>
        {change && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              changePositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {changePositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    viewContent: 0,
    clickButton: 0,
    contact: 0,
    completePayment: 0,
    totalRevenue: 0,
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
    fetchSessions();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSessions() {
    try {
      const res = await fetch("/api/admin/conversas");
      if (res.ok) {
        const data = await res.json();
        setSessions((data.sessions || []).slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  }

  const conversionRate =
    stats.viewContent > 0
      ? ((stats.completePayment / stats.viewContent) * 100).toFixed(1)
      : "0.0";

  const salesTarget = 20;
  const salesProgress = Math.min(
    Math.round((stats.completePayment / salesTarget) * 100),
    100
  );

  const radialData = [
    {
      name: "Meta",
      value: salesProgress,
      fill: "#25D366",
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Visão geral do funil TikTok Ads → WhatsApp → Venda
        </p>
      </div>

      {/* Metric cards + target chart */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        {/* Metric cards — col span 7 */}
        <div className="col-span-12 xl:col-span-7 grid grid-cols-2 gap-4">
          <MetricCard
            label="Visualizações"
            value={stats.viewContent.toLocaleString("pt-BR")}
            icon={Eye}
            iconBg="bg-gray-800"
            iconColor="text-gray-400"
            change="+12%"
            changePositive
            loading={loading}
          />
          <MetricCard
            label="Cliques WhatsApp"
            value={stats.clickButton.toLocaleString("pt-BR")}
            icon={MousePointer}
            iconBg="bg-gray-800"
            iconColor="text-gray-400"
            change="+8%"
            changePositive
            loading={loading}
          />
          <MetricCard
            label="Conversas"
            value={stats.contact.toLocaleString("pt-BR")}
            icon={MessageSquare}
            iconBg="bg-gray-800"
            iconColor="text-gray-400"
            change="+5%"
            changePositive
            loading={loading}
          />
          <MetricCard
            label="Vendas"
            value={stats.completePayment.toLocaleString("pt-BR")}
            icon={DollarSign}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-400"
            change={`${conversionRate}% conv.`}
            changePositive={parseFloat(conversionRate) > 0}
            loading={loading}
          />
        </div>

        {/* Meta de Vendas radial — col span 5 */}
        <div className="col-span-12 xl:col-span-5 rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6">
          <h3 className="text-base font-semibold text-white/90 mb-1">
            Meta de Vendas
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            {stats.completePayment} de {salesTarget} vendas este mês
          </p>
          <div className="flex items-center justify-center">
            <div className="relative">
              {mounted ? (
                <RadialBarChart
                  width={200}
                  height={200}
                  cx={100}
                  cy={100}
                  innerRadius={60}
                  outerRadius={90}
                  barSize={14}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    background={{ fill: "rgba(255,255,255,0.05)" }}
                    dataKey="value"
                    cornerRadius={8}
                  />
                </RadialBarChart>
              ) : (
                <div className="w-[200px] h-[200px]" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white/90">
                  {salesProgress}%
                </span>
                <span className="text-xs text-gray-400">da meta</span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-gray-800 p-3 text-center">
              <p className="text-lg font-bold text-white/90">
                R${" "}
                {loading
                  ? "..."
                  : stats.totalRevenue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Receita total</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-gray-800 p-3 text-center">
              <p className="text-lg font-bold text-white/90">
                {conversionRate}%
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Taxa conversão</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart — Vendas Mensais */}
      <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white/90">
              Vendas Mensais
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Últimos 7 meses
            </p>
          </div>
        </div>
        {mounted ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={MONTHLY_DATA}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="mes"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #1f2937",
                borderRadius: "12px",
                color: "#f9fafb",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="vendas"
              fill="#4b5563"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <div className="w-full h-[200px]" />
        )}
      </div>

      {/* Recent sessions table */}
      <div className="rounded-2xl border border-gray-800 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 md:px-6 border-b border-gray-800">
          <h3 className="text-base font-semibold text-white/90">
            Conversas Recentes
          </h3>
          <a
            href="/admin/conversas"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Ver todas →
          </a>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-10 h-10 text-gray-700 mb-3" />
            <p className="text-sm text-gray-500">Nenhuma conversa ainda</p>
          </div>
        ) : (
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
              <tbody className="divide-y divide-gray-800/50">
                {sessions.map((session) => {
                  const statusCfg =
                    STATUS_CONFIG[session.status] || STATUS_CONFIG.new;
                  return (
                    <tr
                      key={session.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3 md:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
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
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-gray-400">
                          {session.utm_source || "direto"}
                          {session.utm_campaign
                            ? ` / ${session.utm_campaign}`
                            : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {session.sale_value ? (
                          <span className="text-sm font-medium text-emerald-400">
                            R${" "}
                            {session.sale_value.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock className="w-3 h-3 text-gray-600" />
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
        )}
      </div>
    </div>
  );
}
