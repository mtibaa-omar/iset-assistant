import { Bell, LogOut, Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileMenu({
  isDarkMode,
  toggleDarkMode,
  totalUnread,
  onNotificationToggle,
  onLogout,
  isLoading,
  onClose,
}) {
  return (
    <div className="absolute right-0 z-10 w-56 mt-2 overflow-hidden border shadow-xl rounded-xl top-full backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 border-slate-200 dark:border-zinc-700">
      <div className="p-2 space-y-1">
        <button
          onClick={() => {
            toggleDarkMode();
            onClose();
          }}
          className="flex items-center w-full gap-3 px-3 py-2 text-sm transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-white"
        >
          {isDarkMode ? (
            <>
              <Sun className="size-4" />
              <span>Mode clair</span>
            </>
          ) : (
            <>
              <Moon className="size-4" />
              <span>Mode sombre</span>
            </>
          )}
        </button>

        <Link
          to="/account"
          onClick={onClose}
          className="flex items-center w-full gap-3 px-3 py-2 text-sm transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-white"
        >
          <User className="size-4" />
          <span>Mon compte</span>
        </Link>

        <button
          onClick={() => {
            onNotificationToggle();
            onClose();
          }}
          className="relative flex items-center w-full gap-3 px-3 py-2 text-sm transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-white"
        >
          <Bell className="size-4" />
          <span>Notifications</span>
          {totalUnread > 0 && (
            <span className="w-2 h-2 ml-auto bg-red-500 rounded-full"></span>
          )}
        </button>

        <div className="my-1 border-t border-slate-200 dark:border-zinc-700"></div>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          disabled={isLoading}
          className="flex items-center w-full gap-3 px-3 py-2 text-sm text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 dark:text-red-400"
        >
          <LogOut className="size-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
