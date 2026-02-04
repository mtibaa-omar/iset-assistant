import { useState, useEffect, useRef } from "react";
import { Bell, LogOut, Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import NotificationPanel from "../components/NotificationPanel";
import { useLogout } from "../../features/auth/useLogout";
import { useConversations } from "../../features/dm/useDM";
import { useUnreadNews } from "../../features/news/useNewsNotifications";
import { useRecentVideos } from "../../features/videos/useVideoNotifications";
import { useUser } from "../../features/auth/useUser";
import MobileMenu from "./MobileMenu";

export default function HeaderMenu() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading, logout } = useLogout();
  const { user } = useUser();
  const { conversations } = useConversations();
  const { unreadCount: newsUnread } = useUnreadNews();
  const { count: videosCount } = useRecentVideos();
  const dropdownRef = useRef(null);

  const dmUnread = conversations.reduce(
    (sum, c) => sum + (c.unread_count || 0),
    0
  );
  const totalUnread = dmUnread + newsUnread + videosCount;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonBase = `
    p-1.5 md:p-2 lg:p-2.5 rounded-full cursor-pointer transition-all duration-200
    backdrop-blur-md shadow-sm
    bg-white/70 dark:bg-white/10
    border border-slate-300/60 dark:border-white/20
    hover:bg-white/90 dark:hover:bg-white/20
    hover:shadow-md hover:scale-105
  `;

  const logoutButton = `
    p-1.5 md:p-2 lg:p-2.5 rounded-full cursor-pointer transition-all duration-200
    backdrop-blur-md shadow-sm
    bg-white/70 dark:bg-white/10
    border border-slate-300/60 dark:border-white/20
    hover:bg-red-50 dark:hover:bg-red-500/30
    hover:border-red-400 dark:hover:border-red-500/50
    hover:shadow-md hover:scale-105
  `;

  return (
    <>
      <div className="hidden md:flex items-center gap-2.5 lg:gap-4">
        <button
          onClick={toggleDarkMode}
          className={buttonBase}
          title={isDarkMode ? "Mode clair" : "Mode sombre"}
        >
          {isDarkMode ? (
            <Sun className="text-white size-4 md:size-4.5 lg:size-5" />
          ) : (
            <Moon className="text-slate-700 size-4 md:size-4.5 lg:size-5" />
          )}
        </button>
        <Link to="/account" className={buttonBase} title="Mon compte">
          <User className="text-slate-700 dark:text-white size-4 md:size-4.5 lg:size-5" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`relative ${buttonBase}`}
            title="Notifications"
          >
            <Bell className="text-slate-700 dark:text-white size-4 md:size-4.5 lg:size-5" />
            {totalUnread > 0 && (
              <span className="absolute w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full -top-0.5 md:-top-1 -right-0.5 md:-right-1 ring-1 md:ring-2 ring-white dark:ring-zinc-900"></span>
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
          <LogOut className="text-slate-700 dark:text-white size-4 md:size-4.5 lg:size-5" />
        </button>
      </div>

      <div className="relative md:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative transition-all duration-200 rounded-full cursor-pointer"
        >
          <img 
            className="object-cover border rounded-full shadow-sm w-9 h-9 border-slate-200 dark:border-white/10" 
            alt={user?.user_metadata?.full_name || "User"} 
            src={user?.user_metadata?.avatar || user?.user_metadata?.avatar_url || "/image.png"} 
          />
          {totalUnread > 0 && (
            <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full top-0 right-0 ring-2 ring-white dark:ring-zinc-900 shadow-sm"></span>
          )}
        </button>

        {isMobileMenuOpen && (
          <MobileMenu
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            totalUnread={totalUnread}
            onNotificationToggle={() => setIsNotificationOpen(!isNotificationOpen)}
            onLogout={logout}
            isLoading={isLoading}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}

        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </>
  );
}
