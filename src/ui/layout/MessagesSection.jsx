import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, MessageSquare, X, Search } from "lucide-react";
import { useConversations, useSearchUsers } from "../../features/dm/useDM";
import { useUser } from "../../features/auth/useUser";
import Input from "../components/Input";
import Spinner from "../components/Spinner";

export default function MessagesSection({ collapsed, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { conversations, isLoading } = useConversations();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const { users: searchResults, isLoading: isSearching } = useSearchUsers(searchQuery);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleConversationClick = (conversation) => {
    const otherUser = conversation.user1.id === user?.id 
      ? conversation.user2 
      : conversation.user1;
    const username = otherUser.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";
    navigate(`/messages/${username}`);
    onNavigate?.();
  };

  const handleUserSelect = (selectedUser) => {
    const username = selectedUser.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";
    navigate(`/messages/${username}`);
    setShowSearch(false);
    setSearchQuery("");
    onNavigate?.();
  };

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchQuery("");
  };

  if (collapsed) {
    if (conversations.length === 0) {
      return (
        <button
          className="relative flex items-center justify-center w-full p-3 transition-all rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
          title="Messages"
          onClick={() => {
            navigate("/messages");
            onNavigate?.();
          }}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      );
    }
    
    const displayConversations = conversations.slice(0, 3);
    const remainingCount = conversations.length - displayConversations.length;
    return (
      <div className="flex flex-col items-center pl-2 space-y-1">
        <div className="w-full px-1 my-2">
        <hr className="border-t border-slate-200 dark:border-white/10" />
      </div>
        {displayConversations.map((conv) => {
          const otherUser = conv.user1.id === user?.id ? conv.user2 : conv.user1;
          const username = otherUser.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";
          const unreadCount = conv.unread_count || 0;
          
          return (
            <button
              key={conv.id}
              className="flex items-center justify-center w-full p-2 transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
              title={otherUser.full_name || "Messages"}
              onClick={() => {
                navigate(`/messages/${username}`);
                onNavigate?.();
              }}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={otherUser.avatar_url || "/image.png"}
                  alt={otherUser.full_name}
                  className="object-cover w-8 h-8 border rounded-full border-slate-200 dark:border-zinc-700"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center px-1 text-[9px] font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {remainingCount > 0 && (
          <button
            className="flex items-center justify-center w-full p-2 transition-all rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            title={`${remainingCount} more conversation${remainingCount > 1 ? 's' : ''}`}
            onClick={() => {
              navigate("/messages");
              onNavigate?.();
            }}
          >
            <span className="text-xs font-semibold">+{remainingCount}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full px-1 my-2">
        <hr className="border-t border-slate-200 dark:border-white/10" />
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Messages
        </span>
        <button
          className="p-1 transition-all rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          title="Nouvelle conversation"
          onClick={handleToggleSearch}
        >
          {showSearch ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {showSearch && (
        <div className="px-3 pb-3">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-3"
            inputClassName="!py-2 !text-xs"
            icon={Search}
          />
          
          {searchQuery.length >= 3 && (
            <div className="mt-2 overflow-hidden border rounded-lg bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700">
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="h-6 w-6" className="my-0" />
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-3 py-2 text-xs italic text-slate-400">Aucun utilisateur trouvé</div>
              ) : (
                <div className="overflow-y-auto" style={{ maxHeight: "104px" }}>
                  {searchResults.map((searchUser) => (
                    <button
                      key={searchUser.id}
                      onClick={() => handleUserSelect(searchUser)}
                      className="flex items-center w-full gap-2 px-3 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-zinc-700"
                    >
                      <img
                        src={searchUser.avatar_url || "/image.png"}
                        alt={searchUser.full_name}
                        className="object-cover w-8 h-8 border rounded-full border-slate-200 dark:border-zinc-600"
                      />
                      <span className="text-sm font-medium truncate text-slate-700 dark:text-slate-200">
                        {searchUser.full_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-0.5">
        {isLoading ? (
          <div className="px-3 py-2 text-xs text-slate-400">Chargement...</div>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-2 text-xs italic text-slate-400">
            Aucune conversation
          </div>
        ) : (
          conversations.map((conv) => {
            const otherUser = conv.user1.id === user?.id ? conv.user2 : conv.user1;
            const username = otherUser.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";
            const isActive = location.pathname === `/messages/${username}`;
            const unreadCount = conv.unread_count || 0;

            return (
              <button
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={otherUser.avatar_url || "/image.png"}
                    alt={otherUser.full_name}
                    className="object-cover w-8 h-8 border rounded-full border-slate-200 dark:border-zinc-700"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-sm">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-sm truncate ${unreadCount > 0 ? "font-semibold" : "font-medium"}`}>
                  {otherUser.full_name || "Utilisateur"}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
