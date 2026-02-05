import { formatSmartTime } from "../../utils/dateUtils";

export default function ConversationItem({ conversation, isActive, onClick, currentUserId, isOnline }) {
  const otherUser = conversation.user1.id === currentUserId 
    ? conversation.user2 
    : conversation.user1;

  const getLastMessagePreview = () => {
    if (!conversation.last_message?.body && !conversation.last_message?.kind) {
      return "Aucun message";
    }

    const isOwn = conversation.last_message?.sender_id === currentUserId;
    const prefix = isOwn ? "Vous: " : "";

    if (conversation.last_message?.kind === "file") {
      return `${prefix}📎 Fichier`;
    }

    return `${prefix}${conversation.last_message?.body || "Message"}`;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-l-4 border-b border-b-slate-100 dark:border-b-white/5 last:border-b-0 ${
        isActive
          ? "bg-purple-50 dark:bg-purple-900/20 border-l-purple-600"
          : "hover:bg-slate-50 dark:hover:bg-zinc-800/50 border-l-transparent"
      }`}
    >
      <div className="relative">
        <img
          src={otherUser.avatar_url || "/image.png"}
          alt={otherUser.full_name}
          className="object-cover w-12 h-12 border-2 border-white rounded-full dark:border-zinc-700"
          onError={(e) => { e.target.src = '/image.png'; }}
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full"></div>
        )}
        {conversation.unread_count > 0 && (
          <div className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-600 rounded-full -top-1 -right-1">
            {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-semibold truncate ${
            conversation.unread_count > 0 
              ? "text-slate-900 dark:text-white" 
              : "text-slate-700 dark:text-slate-300"
          }`}>
            {otherUser.full_name}
          </h3>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {formatSmartTime(conversation.last_message_at)}
          </span>
        </div>
        <p className={`text-sm truncate ${
          conversation.unread_count > 0
            ? "text-slate-900 dark:text-white font-medium"
            : "text-slate-500 dark:text-slate-400"
        }`}>
          {getLastMessagePreview()}
        </p>
      </div>
    </div>
  );
}
