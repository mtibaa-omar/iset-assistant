import { MessageSquare, Newspaper, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatSmartTime } from "../../utils/dateUtils";

export function DMNotificationItem({ conv, user, onClose }) {
  const navigate = useNavigate();
  const otherUser = conv.user1.id === user?.id ? conv.user2 : conv.user1;
  const username = otherUser.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";

  const date = formatSmartTime(conv.last_message_at);

  const handleClick = () => {
    navigate(`/messages/${username}`);
    onClose();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-start w-full gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50"
    >
      <div className="relative flex-shrink-0">
        <img
          src={otherUser.avatar_url || "/image.png"}
          alt={otherUser.full_name}
          className="object-cover w-10 h-10 rounded-full"
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
          {conv.unread_count > 9 ? "9+" : conv.unread_count}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">
            {otherUser.full_name}
          </span>
          {date && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
              {date}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {conv.unread_count} nouveau{conv.unread_count > 1 ? "x" : ""} message{conv.unread_count > 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
}

export function VideoNotificationItem({ video, onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/videos`);
    onClose();
  };

  const date = formatSmartTime(video.created_at);

  return (
    <button
      onClick={handleClick}
      className="flex items-start w-full gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50"
    >
      <div className="relative flex-shrink-0">
        <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-lg bg-gradient-to-br to-pink-500">
          <Play className="w-5 h-5 text-white" />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-red-500 rounded-full">
          <span className="w-2 h-2 bg-white rounded-full" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-red-500" />
          <span className="text-xs text-slate-400 dark:text-slate-500">{date}</span>
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate mt-0.5">
          {video.title}
        </p>
      </div>
    </button>
  );
}

export function NewsNotificationItem({ news, onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/actualites/${news.id}`);
    onClose();
  };

  const date = formatSmartTime(news.created_at);

  return (
    <button
      onClick={handleClick}
      className="flex items-start w-full gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50"
    >
      <div className="relative flex-shrink-0">
        {news.image_url ? (
          <img
            src={news.image_url}
            alt={news.title}
            className="object-cover w-10 h-10 rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-blue-500 rounded-full">
          <span className="w-2 h-2 bg-white rounded-full" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Newspaper className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs text-slate-400 dark:text-slate-500">{date}</span>
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate mt-0.5">
          {news.title}
        </p>
      </div>
    </button>
  );
}
