import { useQuery } from "@tanstack/react-query";
import { newsAPI } from "../../services/api/apiNews";
import { newsKeys } from "./newsKeys";

export function useNewsDetail(id) {
  const { data: newsItem, isLoading, error } = useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsAPI.getById(id),
    enabled: !!id,
  });

  return { newsItem, isLoading, error };
}
