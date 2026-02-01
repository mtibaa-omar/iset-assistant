import { useUser } from "../auth/useUser";
import MessageAvatar from "./MessageAvatar";
import MessageContent from "./MessageContent";

export default function MessageBubble({ message }) {
  const { user } = useUser();
  const isOwn = message.sender_id === user?.id;
  const senderName = message.sender?.full_name;
  const avatarUrl = message.sender?.avatar_url || "/image.png";
  const username = senderName.toLowerCase().replace(/\s+/g, "_");

  const time = new Date(message.created_at).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex gap-3 px-4 py-2 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <MessageAvatar
        avatarUrl={avatarUrl}
        senderName={senderName}
        username={username}
        isOwn={isOwn}
      />

      <div
        className={`flex flex-col min-w-0 ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        {!isOwn && (
          <span className="px-1 mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {senderName}
          </span>
        )}

        <div
          className={`rounded-2xl shadow-sm overflow-hidden max-w-md ${
            isOwn
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md"
              : "bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-zinc-700 rounded-bl-md"
          }`}
        >
          <MessageContent message={message} isOwn={isOwn} />
        </div>

        <span
          className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
