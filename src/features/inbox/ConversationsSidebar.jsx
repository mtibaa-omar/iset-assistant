import { useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import ConversationItem from "./ConversationItem";
import Spinner from "../../ui/components/Spinner";

export default function ConversationsSidebar({ conversations, activeConversationId, onSelectConversation, currentUserId, isLoading }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.user1.id === currentUserId ? conv.user2 : conv.user1;
    return otherUser.full_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white border-r dark:bg-zinc-900 border-slate-200 dark:border-white/10">
      <div className="p-4 border-b border-slate-200 dark:border-white/10">
        <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>

        <div className="relative">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher des conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm transition-colors border rounded-lg bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Spinner />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
              <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              {searchQuery ? "Aucun résultat" : "Aucune conversation"}
            </h3>
            <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
              {searchQuery 
                ? "Aucune conversation ne correspond à votre recherche."
                : "Commencez une nouvelle conversation en cliquant sur l'icône ci-dessus."
              }
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv)}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}
