import { useMutation, useQueryClient } from "@tanstack/react-query";
import { videosAPI } from "../../services/api/apiVideos";
import { adminKeys } from "./adminKeys";
import { toast } from "react-toastify";

export function useCreateVideo() {
  const queryClient = useQueryClient();

  const { mutate: createVideo, isPending: isCreating } = useMutation({
    mutationFn: videosAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.videos.all });
      toast.success("Vidéo créée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });   

  return { createVideo, isCreating };
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  const { mutate: updateVideo, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => videosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.videos.all });
      toast.success("Vidéo modifiée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateVideo, isUpdating };
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  const { mutate: deleteVideo, isPending: isDeleting } = useMutation({
    mutationFn: videosAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.videos.all });
      toast.success("Vidéo supprimée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteVideo, isDeleting };
}
