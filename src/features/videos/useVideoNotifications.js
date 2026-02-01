import { useQuery } from "@tanstack/react-query";
import { videosAPI } from "../../services/api/apiVideos";
import { videoKeys } from "./videoKeys";
import { useUser } from "../auth/useUser";

export function useRecentVideos() {
  const { user } = useUser();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: videoKeys.recent(),
    queryFn: () => videosAPI.getRecentVideos(user?.specialty_id, user?.level_id, user?.created_at),
    enabled: !!user?.id && !!user?.specialty_id && !!user?.level_id && !!user?.created_at,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const videos = data || [];
  const count = videos.length;

  return { videos, count, isLoading, error, refetch };
}