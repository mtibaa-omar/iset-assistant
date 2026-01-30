import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { unitesAPI } from "../../services/api/apiUnites";
import { adminKeys } from "./adminKeys";

export function useCreateUnite() {
  const queryClient = useQueryClient();
  
  const { isPending: isCreating, mutate: createUnite } = useMutation({
    mutationFn: unitesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.unites.all });
      toast.success("Unité créée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });   

  return { isCreating, createUnite };
}

export function useUpdateUnite() {
  const queryClient = useQueryClient();
  
  const { isPending: isUpdating, mutate: updateUnite } = useMutation({
    mutationFn: ({ id, data }) => unitesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.unites.all });
      toast.success("Unité modifiée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateUnite };
}

export function useDeleteUnite() {
  const queryClient = useQueryClient();
  
  const { isPending: isDeleting, mutate: deleteUnite } = useMutation({
    mutationFn: unitesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.unites.all });
      toast.success("Unité supprimée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteUnite };
}
