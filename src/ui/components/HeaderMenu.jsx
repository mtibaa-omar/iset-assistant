import { useState } from "react";
import { Bell, LogOut, Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import NotificationPanel from "./NotificationPanel";
import { useLogout } from "../../features/auth/useLogout";
import { useConversations } from "../../features/dm/useDM";
import { useUnreadNews } from "../../features/news/useNewsNotifications";
import { useRecentVideos } from "../../features/videos/useVideoNotifications";

export default function HeaderMenu() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { isLoading, logout } = useLogout();
  const { conversations } = useConversations();
  const { unreadCount: newsUnread } = useUnreadNews();
  const { count: videosCount } = useRecentVideos();

  const dmUnread = conversations.reduce(
    (sum, c) => sum + (c.unread_count || 0),
    0
  );
  const totalUnread = dmUnread + newsUnread + videosCount;

  const buttonBase = `
    p-2.5 rounded-full cursor-pointer transition-all duration-200
    backdrop-blur-md shadow-sm
    bg-white/70 dark:bg-white/10
    border border-slate-300/60 dark:border-white/20
    hover:bg-white/90 dark:hover:bg-white/20
    hover:shadow-md hover:scale-105
  `;

  const logoutButton = `
    p-2.5 rounded-full cursor-pointer transition-all duration-200
    backdrop-blur-md shadow-sm
    bg-white/70 dark:bg-white/10
    border border-slate-300/60 dark:border-white/20
    hover:bg-red-50 dark:hover:bg-red-500/30
    hover:border-red-400 dark:hover:border-red-500/50
    hover:shadow-md hover:scale-105
  `;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleDarkMode}
        className={buttonBase}
        title={isDarkMode ? "Mode clair" : "Mode sombre"}
      >
        {isDarkMode ? (
          <Sun className="text-white size-5 lg:size-4" />
        ) : (
          <Moon className="text-slate-700 size-5 lg:size-4" />
        )}
      </button>
      <Link to="/account" className={buttonBase} title="Mon compte">
        <User className="text-slate-700 dark:text-white size-5 lg:size-4" />
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className={`relative ${buttonBase}`}
          title="Notifications"
        >
          <Bell className="text-slate-700 dark:text-white size-5 lg:size-4" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full ring-2 ring-white dark:ring-zinc-900">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </button>
        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>

      <button
        onClick={logout}
        className={logoutButton}
        disabled={isLoading}
        title="Déconnexion"
      >
        <LogOut className="text-slate-700 dark:text-white size-5 lg:size-4" />
      </button>
    </div>
  );
}
