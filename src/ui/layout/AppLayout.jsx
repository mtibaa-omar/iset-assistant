import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SidebarMobile from "./SidebarMobile";
import { Outlet } from "react-router-dom";
import HeaderMenu from "./HeaderMenu";
import { Menu } from "lucide-react";
import { useDMRealtime } from "../../features/dm/useDM";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useDMRealtime();

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full w-96 h-96 -top-48 -left-48 bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-500/20 dark:to-pink-500/20 blur-3xl animate-pulse" />
        <div className="absolute rounded-full w-96 h-96 -bottom-48 -right-48 bg-gradient-to-br from-pink-400/30 to-violet-400/30 dark:from-pink-500/20 dark:to-violet-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-64 h-64 rounded-full top-1/4 right-1/4 bg-gradient-to-br from-violet-300/20 to-purple-300/20 dark:from-violet-400/10 dark:to-purple-400/10 blur-2xl" />
      </div>
      <div className="relative z-10 flex h-screen md:gap-4 md:p-4">
        <SidebarMobile
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <Sidebar />

        <div className="fixed z-20 hidden md:block top-8 right-10">
          <HeaderMenu />
        </div>

        <main className="relative flex flex-col flex-1 overflow-hidden bg-white dark:bg-zinc-900 md:rounded-2xl md:border md:border-slate-200 md:dark:border-slate-700 md:shadow-xl">
          <div className={`px-4 py-3 shrink-0 flex items-center justify-between relative lg:hidden ${isMobileMenuOpen ? 'z-[25]' : 'z-[40]'}`}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 transition-all border shadow-sm rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 border-slate-200/60 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
            </button>
            <div className="relative md:hidden">
              <HeaderMenu />
            </div>
          </div>

          <div className="relative flex flex-col flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
