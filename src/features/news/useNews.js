import { useQuery } from "@tanstack/react-query";
import { newsAPI } from "../../services/api/apiNews";
import { newsKeys } from "./newsKeys";

export function useNews() {
  const { data: news, isLoading, error } = useQuery({
    queryKey: newsKeys.all,
    queryFn: newsAPI.getAll,
  });

  return { news: news || [], isLoading, error };
}
