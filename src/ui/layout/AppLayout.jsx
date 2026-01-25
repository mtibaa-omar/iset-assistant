import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SidebarMobile from "./SidebarMobile";
import { Outlet } from "react-router-dom";
import DarkVeil from "../components/DarkVeil";
import HeaderMenu from "../components/HeaderMenu";
import { useDarkMode } from "../../context/DarkModeContext";
import LightVeil from "../components/LightVeil";
import { Menu } from "lucide-react";

export default function AppLayout() {
  const { isDarkMode } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="fixed inset-0 z-0 ">
        {isDarkMode ? (
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.52}
            scanlineFrequency={0}
            warpAmount={0}
          />
        ) : (
          <LightVeil
            hueShift={170}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.9}
            scanlineFrequency={0}
            warpAmount={0}
          />
        )}
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

        <main className="relative flex-1 p-6 overflow-auto border shadow-xl bg-white/30 dark:bg-black/30 rounded-2xl backdrop-blur-md border-white/50 dark:border-white/10">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 mb-4 transition-all border rounded-xl bg-white/50 dark:bg-white/10 border-slate-200 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 lg:hidden"
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
