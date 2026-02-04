import { useUser } from "../auth/useUser";
import { Trash2 } from "lucide-react";
import MessageAvatar from "./MessageAvatar";
import MessageContent from "./MessageContent";
import MessageMenu from "./MessageMenu";
import { formatTime } from "../../utils/dateUtils";

export default function MessageBubble({ message, onDelete, onEdit, isEditing }) {
  const { user } = useUser();
  const isOwn = message.sender_id === user?.id;
  const senderName = message.sender?.full_name;
  const avatarUrl = message.sender?.avatar_url || "/image.png";
  const username = senderName.toLowerCase().replace(/\s+/g, "_");

  const time = formatTime(message.created_at);

  const isModified = message.edited_at && !message.deleted_at;
  const isDeleted = !!message.deleted_at;

  return (
    <div
      className={`group flex gap-3 px-4 py-2 transition-all ${
        isOwn ? "flex-row-reverse" : "flex-row"
      } ${isEditing ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
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

        <div className="flex items-center gap-2">
          {isOwn && !isDeleted && (
            <MessageMenu
              onDelete={() => onDelete(message.id)}
              onEdit={() => onEdit(message.id, message.body)}
              isOwn={isOwn}
            />
          )}

          <div
            className={`rounded-2xl shadow-sm overflow-hidden max-w-md ${
              isDeleted
                ? "bg-slate-50 dark:bg-zinc-800/20 border border-dashed border-slate-200 dark:border-zinc-700 rounded-lg"
                : isOwn
                ? "bg-purple-600 text-white rounded-br-md"
                : "bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-zinc-700 rounded-bl-md"
            }`}
          >
            {isDeleted ? (
              <div className="flex items-center gap-2 px-3 py-2 italic text-slate-400 dark:text-zinc-500">
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-xs">Message supprimé</span>
              </div>
            ) : (
              <MessageContent message={message} isOwn={isOwn} />
            )}
          </div>

          {!isOwn && !isDeleted && (
            <MessageMenu
              onDelete={() => onDelete(message.id)}
              onEdit={() => onEdit(message.id, message.body)}
              isOwn={isOwn}
            />
          )}
        </div>

        <span
          className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 flex items-center gap-1 ${
            isOwn ? "text-right flex-row-reverse" : "text-left"
          }`}
        >
          {time}
          {isModified && (
            <span className="italic opacity-75">
              (modifié)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
