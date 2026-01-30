import {
  Calculator,
  Home,
  ShieldUser,
  MonitorPlayIcon,
  Newspaper,
  Notebook,
  ToolCase,
  Layers,
  BookOpen,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { useUser } from "../../features/auth/useUser";

export default function MenuItems({ collapsed, onNavigate }) {
  const { isAdmin } = useUser();
  
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

      {isAdmin && (
        <>
          <div className="w-full px-2 my-3">
            <hr className="border-t border-slate-200 dark:border-white/20" />
          </div>

          
          <SidebarItem
            icon={<Newspaper className="w-5 h-5" />}
            label="Admin News"
            to="/admin/news"
            onNavigate={onNavigate}
            collapsed={collapsed}
          />

          <SidebarItem
            icon={<BookOpen className="w-5 h-5" />}
            label="Admin Subjects"
            to="/admin/subjects"
            onNavigate={onNavigate}
            collapsed={collapsed}
          />

          <SidebarItem
            icon={<Layers className="w-5 h-5" />}
            label="Admin Unités"
            to="/admin/unites"
            onNavigate={onNavigate}
            collapsed={collapsed}
          />

          <SidebarItem
            icon={<Layers className="w-5 h-5" />}
            label="Admin Affectations"
            to="/admin/programs"
            onNavigate={onNavigate}
            collapsed={collapsed}
          />
        </>
      )}
    </>
  );
}

