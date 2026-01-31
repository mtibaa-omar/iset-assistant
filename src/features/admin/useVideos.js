import { useQuery } from "@tanstack/react-query";
import { videosAPI } from "../../services/api/apiVideos";
import { adminKeys } from "./adminKeys";

export function useVideos() {
  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: adminKeys.videos.list(),
    queryFn: videosAPI.getAll,
  });

  return { videos, isLoading, error };
}
