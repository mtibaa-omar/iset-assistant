import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import DarkVeil from "../components/DarkVeil";
import HeaderMenu from "../components/HeaderMenu";
import { useDarkMode } from "../../context/DarkModeContext";
import LightVeil from "../components/LightVeil";

export default function AppLayout() {
  const { isDarkMode } = useDarkMode();

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
            speed={0.52}
            scanlineFrequency={0}
            warpAmount={0}
          />
        )}
      </div>
      <div className="relative z-10 flex h-screen p-4 gap-4">
        <Sidebar />
        <main className="flex-1 bg-white/30 dark:bg-black/30 rounded-2xl backdrop-blur-md border border-white/50 dark:border-white/10 shadow-xl p-6 overflow-auto relative">
          <div className="absolute top-6 right-6 z-20">
            <HeaderMenu />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
