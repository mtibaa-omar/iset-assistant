import { useQuery } from "@tanstack/react-query";
import { newsAPI } from "../../services/api/apiNews";
import { newsKeys } from "./newsKeys";
import { useUser } from "../auth/useUser";
 
 export function useUnreadNews() {
   const { user } = useUser();
 
   const { data, isLoading, error, refetch } = useQuery({
     queryKey: newsKeys.unread(),
     queryFn: () => newsAPI.getUnreadNews(user?.created_at),
     enabled: !!user?.created_at,
     refetchInterval: 60000, // Refetch every minute
     staleTime: 0,
   });

   const news = data || [];
   const unreadCount = news.length;

   return { news, unreadCount, isLoading, error, refetch };
}