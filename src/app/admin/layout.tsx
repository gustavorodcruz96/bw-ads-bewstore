"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  MessageSquare,
  Settings,
  Bot,
  Kanban,
  Home,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/conversas", label: "Conversas", icon: MessageSquare },
  { href: "/admin/kanban", label: "Pipeline", icon: Kanban },
  { href: "/admin/agente", label: "Agente IA", icon: Bot },
  { href: "/admin/config", label: "Configurações", icon: Settings },
];

function Sidebar({
  mobileOpen,
  collapsed,
  onClose,
  onToggleCollapse,
}: {
  mobileOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();

  // Mobile always shows expanded, desktop respects collapsed
  const isCompact = collapsed && !mobileOpen;

  return (
    <>
      {/* Backdrop mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-gray-900 border-r border-gray-800 flex flex-col z-50 transition-all duration-300",
          isCompact ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex flex-col items-center border-b border-gray-800 flex-shrink-0",
            isCompact ? "py-4 px-2" : "py-6 px-5"
          )}
        >
          <img
            src="/bew-logo.png"
            alt="Bew Store"
            className={cn("w-auto transition-all", isCompact ? "h-8" : "h-12 mb-2")}
          />
          {!isCompact && (
            <p className="text-[11px] text-gray-500 tracking-wide">
              Painel Administrativo
            </p>
          )}
        </div>

        {/* Nav */}
        <nav className={cn("flex-1 overflow-y-auto py-4 space-y-1", isCompact ? "px-2" : "px-3")}>
          {!isCompact && (
            <p className="text-[10px] uppercase text-gray-500 font-medium px-3 mb-2 tracking-wider">
              Menu
            </p>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCompact ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-xl text-sm font-medium transition-colors",
                  isCompact
                    ? "justify-center px-0 py-2.5"
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCompact && <span>{item.label}</span>}
                {!isCompact && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn("border-t border-gray-800 py-4 space-y-1", isCompact ? "px-2" : "px-3")}>
          {/* Collapse toggle - desktop only */}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expandir" : "Recolher"}
            className={cn(
              "hidden lg:flex items-center rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full",
              isCompact ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5 flex-shrink-0" />
            ) : (
              <PanelLeftClose className="w-5 h-5 flex-shrink-0" />
            )}
            {!isCompact && <span>Recolher</span>}
          </button>

          <Link
            href="/"
            title={isCompact ? "Ver Landing Page" : undefined}
            className={cn(
              "flex items-center rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors",
              isCompact ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!isCompact && <span>Ver Landing Page</span>}
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            title={isCompact ? "Sair" : undefined}
            className={cn(
              "flex items-center rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full",
              isCompact ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCompact && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Login page: no sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        onClose={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Mobile header */}
      <header className="sticky top-0 flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 z-30 lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <img src="/bew-logo.png" alt="Bew Store" className="h-7 w-auto" />
        <div className="w-10" />
      </header>

      {/* Main content */}
      <main
        className={cn(
          "p-6 md:p-8 min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-[68px]" : "lg:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
