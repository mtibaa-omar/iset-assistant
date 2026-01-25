import {
  Calculator,
  Home,
  ShieldUser,
  MonitorPlayIcon,
  Newspaper,
  Notebook,
  ToolCase,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export default function MenuItems({ collapsed, onNavigate }) {
  return (
    <>
      <SidebarItem
        icon={<Home />}
        label="Accueil"
        to="/"
        onNavigate={onNavigate}
        collapsed={collapsed}
      />
      <SidebarItem
        icon={<Newspaper />}
        label="Actualités"
        to="/actualites"
        onNavigate={onNavigate}
        collapsed={collapsed}
      />
      <SidebarItem
        icon={<Notebook />}
        label="Espace Matières"
        to="/matieres"
        onNavigate={onNavigate}
        collapsed={collapsed}
      />
      <SidebarItem
        icon={<Calculator />}
        label="Calcul de moyenne"
        to="/moyenne"
        onNavigate={onNavigate}
        collapsed={collapsed}
      />
      <SidebarItem
        icon={<ToolCase />}
        label="Outils"
        to="/outils"
        onNavigate={onNavigate}
        collapsed={collapsed}
      />
      <SidebarItem
        icon={<MonitorPlayIcon />}
        label="Tutoriels"
        to="/tutoriels"
        onNavigate={onNavigate}
        collapsed={collapsed}
      />

      <div className="w-full px-2 my-3">
        <hr className="border-t border-slate-200 dark:border-white/20" />
      </div>

      <SidebarItem
        icon={<ShieldUser className="w-5 h-5" />}
        label="Admin"
        to="/admin"
        onNavigate={onNavigate}
        collapsed={collapsed}
      />
    </>
  );
}
