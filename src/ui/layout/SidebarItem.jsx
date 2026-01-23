import { NavLink } from "react-router-dom";

export function SidebarItem({ icon, label, to, collapsed = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex h-11 items-center gap-3 ${collapsed ? "px-3 justify-center" : "px-4"} py-3 relative self-stretch w-full rounded-[99px] overflow-hidden cursor-pointer transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none ${
          isActive
            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 border border-purple-300/50 dark:border-white/20 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20"
            : "hover:bg-slate-100/50 dark:hover:bg-white/10 border border-transparent"
        }`
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <div
          className={`flex items-center gap-3 relative ${collapsed ? "" : "flex-1 grow"}`}
        >
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 ${
              isActive
                ? "[&>svg]:text-purple-600 dark:[&>svg]:text-purple-300"
                : "[&>svg]:text-slate-500 dark:[&>svg]:text-white/70 hover:[&>svg]:text-slate-700 dark:hover:[&>svg]:text-white"
            }`}
          >
            {icon}
          </div>

          {!collapsed && (
            <div
              className={`relative flex items-center flex-1 self-stretch font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${
                isActive
                  ? "text-purple-600 dark:text-purple-300 font-semibold"
                  : "text-slate-600 dark:text-white/70 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {label}
            </div>
          )}
        </div>
      )}
    </NavLink>
  );
}
