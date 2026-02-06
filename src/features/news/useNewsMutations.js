import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { newsAPI } from "../../services/api/apiNews";
import { newsKeys } from "./newsKeys";

export function useCreateNews() {
  const queryClient = useQueryClient();
  
  const { isPending: isCreating, mutate: createNews } = useMutation({
    mutationFn: newsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
      toast.success("Actualité créée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });   

  return { isCreating, createNews };
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  
  const { isPending: isUpdating, mutate: updateNews } = useMutation({
    mutationFn: ({ id, data }) => newsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
      toast.success("Actualité modifiée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateNews };
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  
  const { isPending: isDeleting, mutate: deleteNews } = useMutation({
    mutationFn: newsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
      toast.success("Actualité supprimée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteNews };
}
