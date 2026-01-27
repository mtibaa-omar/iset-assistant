import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SidebarMobile from "./SidebarMobile";
import { Outlet } from "react-router-dom";
import HeaderMenu from "../components/HeaderMenu";
import { Menu } from "lucide-react";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full w-96 h-96 -top-48 -left-48 bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-500/20 dark:to-pink-500/20 blur-3xl animate-pulse" />
        <div className="absolute rounded-full w-96 h-96 -bottom-48 -right-48 bg-gradient-to-br from-pink-400/30 to-violet-400/30 dark:from-pink-500/20 dark:to-violet-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-64 h-64 rounded-full top-1/4 right-1/4 bg-gradient-to-br from-violet-300/20 to-purple-300/20 dark:from-violet-400/10 dark:to-purple-400/10 blur-2xl" />
      </div>
      <div className="relative z-10 flex h-screen gap-4 p-4">
        <SidebarMobile
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <Sidebar />

        <div className="fixed z-20 top-8 right-8">
          <HeaderMenu />
        </div>

        <main className="relative flex-1 p-6 overflow-auto bg-white border shadow-xl dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 mb-4 transition-all border rounded-xl bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-slate-700 dark:text-white" />
          </button>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
