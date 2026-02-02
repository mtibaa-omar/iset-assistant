import { useQuery } from "@tanstack/react-query";
import { videosAPI } from "../../services/api/apiVideos";
import { videoKeys } from "./videoKeys";
import { useUser } from "../auth/useUser";

export function useUserVideos() {
  const { user } = useUser();
  const specialtyId = user?.specialty_id;
  const levelId = user?.level_id;

  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: videoKeys.user(specialtyId, levelId),
    queryFn: () => videosAPI.getUserVideos(specialtyId, levelId),
    enabled: !!specialtyId && !!levelId,
  });

  return { videos, isLoading, error };
}
