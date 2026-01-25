import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import UserAvatar from "../components/UserAvatar";
import MenuItems from "./MenuItems";

export default function Sidebar({ className }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`hidden lg:flex flex-col ${collapsed ? "w-20" : "w-72"} h-[calc(100vh-2rem)] items-center gap-4 bg-white/30 dark:bg-black/30 rounded-2xl border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-md transition-[width] duration-300 ease-in-out flex-shrink-0 ${className}`}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} p-4 relative self-stretch w-full z-[1]`}>
        <UserAvatar collapsed={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)} className="inline-flex items-center justify-center p-1.5 absolute -right-3 top-5 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/20 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/20 transition-all cursor-pointer">
          <ChevronLeft className={`w-4 h-4 text-slate-700 dark:text-white transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="flex flex-col self-stretch flex-1 w-full overflow-y-auto">
        <div className={`flex flex-col items-start gap-1 ${collapsed ? "px-2" : "px-3"} py-0 relative self-stretch w-full`}>
          <MenuItems collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
