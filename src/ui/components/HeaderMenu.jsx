import { LogOut, Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";

export default function HeaderMenu() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  function handleLogout() {
    console.log("Logout clicked");
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/account"
        className="p-2 rounded-full bg-slate-100/10 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
        title="Mon compte"
      >
        <User className="w-5 h-5 text-slate-600 dark:text-white" />
      </Link>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-slate-100/10 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
        title={isDarkMode ? "Mode clair" : "Mode sombre"}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-white" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      <button
        onClick={handleLogout}
        className="p-2 rounded-full bg-slate-100/10 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-red-100 dark:hover:bg-red-500/30 hover:border-red-300 dark:hover:border-red-500/50 transition-colors cursor-pointer"
        title="Déconnexion"
      >
        <LogOut className="w-5 h-5 text-slate-600 dark:text-white" />
      </button>
    </div>
  );
}
