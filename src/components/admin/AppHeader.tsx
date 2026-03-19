"use client";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, X, LogOut } from "lucide-react";
import React from "react";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <header className="sticky top-0 flex w-full bg-gray-900 border-b border-gray-800 z-30 lg:hidden">
      <div className="flex items-center justify-between w-full px-4 py-3">
        <button
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <span className="text-sm font-bold text-white">Bew Ads</span>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          aria-label="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
