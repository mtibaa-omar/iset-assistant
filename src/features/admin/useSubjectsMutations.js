import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { subjectsAdminAPI } from "../../services/api/apiSubjectsAdmin";
import { adminKeys } from "./adminKeys";

export function useCreateSubject() {
  const queryClient = useQueryClient();
  
  const { isPending: isCreating, mutate: createSubject } = useMutation({
    mutationFn: subjectsAdminAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subjects.all });
      toast.success("Matière créée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });   

  return { isCreating, createSubject };
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  
  const { isPending: isUpdating, mutate: updateSubject } = useMutation({
    mutationFn: ({ id, data }) => subjectsAdminAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subjects.all });
      toast.success("Matière modifiée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateSubject };
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  
  const { isPending: isDeleting, mutate: deleteSubject } = useMutation({
    mutationFn: subjectsAdminAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subjects.all });
      toast.success("Matière supprimée avec succès !");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteSubject };
}
