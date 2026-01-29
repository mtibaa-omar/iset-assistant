import { useEffect, useRef } from "react";
import { newsAPI } from "../../services/api/apiNews";

export function useIncrementViews(newsId) {
  const hasIncrementedViews = useRef(false);

  useEffect(() => {
    if (newsId && !hasIncrementedViews.current) {
      hasIncrementedViews.current = true;
      newsAPI.incrementViews(newsId).catch(err => {
        console.error('Failed to increment views:', err);
      });
    }
  }, [newsId]);
}
