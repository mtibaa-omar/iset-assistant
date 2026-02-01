import { useEffect } from "react";
import { X, Bell } from "lucide-react";
import { useConversations } from "../../features/dm/useDM";
import { useUser } from "../../features/auth/useUser";
import { useUnreadNews } from "../../features/news/useNewsNotifications";
import { useRecentVideos } from "../../features/videos/useVideoNotifications";
import { DMNotificationItem, NewsNotificationItem, VideoNotificationItem } from "./NotificationItem";
import Spinner from "./Spinner";

export default function NotificationPanel({ isOpen, onClose }) {
  const { user } = useUser();
  const { conversations, isLoading: isLoadingDM } = useConversations();

  const { news: recentNews = [], isLoading: isLoadingNews, refetch: refetchNews } = useUnreadNews();
  const { videos: recentVideos = [], isLoading: isLoadingVideos, refetch: refetchVideos } = useRecentVideos();

  useEffect(() => {
    if (isOpen) {
      refetchNews();
      refetchVideos();
    }
  }, [isOpen, refetchNews, refetchVideos]);

  const unreadConversations = conversations.filter((c) => c.unread_count > 0);
  const totalUnreadDM = unreadConversations.reduce(
    (sum, c) => sum + c.unread_count,
    0
  );

  const unreadNews = recentNews;
  
  const notificationVideos = recentVideos;

  const isLoading = isLoadingDM || isLoadingNews || isLoadingVideos;
  const hasNotifications = unreadConversations.length > 0 || unreadNews.length > 0 || notificationVideos.length > 0;
  const totalCount = totalUnreadDM + unreadNews.length + notificationVideos.length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 z-50 mt-2 overflow-hidden border shadow-xl top-full w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-slate-200/60 dark:border-zinc-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700 dark:text-white" />
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Notifications
            </h3>
            {totalCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-80">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Spinner />
            </div>
          ) : !hasNotifications ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-zinc-800">
                <Bell className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Aucune nouvelle notification
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {unreadConversations.length > 0 && (
                <>
                  {unreadConversations.map((conv) => (
                    <DMNotificationItem
                      key={conv.id}
                      conv={conv}
                      user={user}
                      onClose={onClose}
                    />
                  ))}
                </>
              )}

              {unreadNews.length > 0 && (
                <>
                  {unreadNews.map((news) => (
                    <NewsNotificationItem
                      key={news.id}
                      news={news}
                      onClose={onClose}
                    />
                  ))}
                </>
              )}

              {notificationVideos.length > 0 && (
                <>
                  {notificationVideos.map((video) => (
                    <VideoNotificationItem
                      key={video.id}
                      video={video}
                      onClose={onClose}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
