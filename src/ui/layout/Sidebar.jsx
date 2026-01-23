import {
  Calculator,
  ChevronLeft,
  Home,
  ShieldUser,
  MonitorPlayIcon,
  Newspaper,
  Notebook,
  ToolCase,
} from "lucide-react";
import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import UserAvatar from "../components/UserAvatar";

export default function Sidebar({ className }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex flex-col ${collapsed ? "w-20" : "w-72"} h-[calc(100vh-2rem)] items-center gap-4 bg-white/30 dark:bg-black/30 rounded-2xl border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-md transition-[width] duration-300 ease-in-out flex-shrink-0 ${className}`} >
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} p-4 relative self-stretch w-full z-[1]`}>
        <UserAvatar collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center justify-center p-1.5 absolute -right-3 top-5 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/20 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/20 transition-all cursor-pointer"
        >
          <ChevronLeft className={`w-4 h-4 text-slate-700 dark:text-white transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="flex flex-col flex-1 self-stretch w-full overflow-y-auto">
        <div
          className={`flex flex-col items-start gap-1 ${collapsed ? "px-2" : "px-3"} py-0 relative self-stretch w-full`}
        >
          <SidebarItem icon={<Home />} label="Accueil" to="/" collapsed={collapsed} />

          <SidebarItem icon={<Newspaper />} label="Actualités" to="/actualites" collapsed={collapsed} />

          <SidebarItem icon={<Notebook />} label="Espace Matières" to="/matieres" collapsed={collapsed} />

          <SidebarItem icon={<Calculator />} label="Calcul de moyenne" to="/moyenne" collapsed={collapsed} />

          <SidebarItem icon={<ToolCase />} label="Outils" to="/outils" collapsed={collapsed} />
          <SidebarItem icon={<MonitorPlayIcon />} label="Tutoriels" to="/tutoriels" collapsed={collapsed} />

          <div className="w-full px-2 my-3">
            <hr className="border-t border-slate-200 dark:border-white/20" />
          </div>

          <SidebarItem icon={<ShieldUser className="w-5 h-5" />} label="Admin" to="/admin" collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
