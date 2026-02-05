import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export default function UserAvatarWithMenu({ 
  avatarUrl, 
  senderName, 
  username, 
  isOwn 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isInDMConversation = location.pathname.startsWith('/messages');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleAvatarClick = () => {
    if (isOwn) return;
    setShowDropdown(!showDropdown);
  };

  const handleSendMessage = () => {
    setShowDropdown(false);
    navigate(`/messages/${username}`);
  };

  return (
    <div className="relative self-start" ref={dropdownRef}>
      <img
        src={avatarUrl || '/image.png'}
        alt={senderName}
        onClick={handleAvatarClick}
        onError={(e) => { e.target.src = '/image.png'; }}
        className={`w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-zinc-700 shadow-sm transition-all ${
          !isOwn ? "cursor-pointer hover:ring-2 hover:ring-purple-500/50" : ""
        }`}
      />

      {showDropdown && !isOwn && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[200px] bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-700">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
              {senderName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{username}
            </p>
          </div>

          {!isInDMConversation && (
            <button
              onClick={handleSendMessage}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Envoyer un message</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
