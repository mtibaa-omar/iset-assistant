import { useQueryClient } from "@tanstack/react-query";
import { newsAPI } from "../../services/api/apiNews";

export function useMarkNewsAsRead() {
  const queryClient = useQueryClient();

  const markAsRead = async (newsId) => {
    await newsAPI.markAsRead(newsId);
    
    queryClient.invalidateQueries({ queryKey: ["news", "recent"] });
    queryClient.invalidateQueries({ queryKey: ["news", "views", newsId] });
  };

  return { markAsRead };
}
