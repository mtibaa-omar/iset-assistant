import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programSubjectsAPI } from "../../services/api/apiProgramSubjects";
import { adminKeys } from "./adminKeys";
import { toast } from "react-toastify";

export function useCreateProgramSubject() {
  const queryClient = useQueryClient();

  const { mutate: createProgramSubject, isPending: isCreating } = useMutation({
    mutationFn: programSubjectsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.programSubjects.all });
      toast.success("Affectation créée avec succès");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  return { createProgramSubject, isCreating };
}

export function useUpdateProgramSubject() {
  const queryClient = useQueryClient();

  const { mutate: updateProgramSubject, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => programSubjectsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.programSubjects.all });
      toast.success("Affectation modifiée avec succès");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });

  return { updateProgramSubject, isUpdating };
}

export function useDeleteProgramSubject() {
  const queryClient = useQueryClient();

  const { mutate: deleteProgramSubject, isPending: isDeleting } = useMutation({
    mutationFn: programSubjectsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.programSubjects.all });
      toast.success("Affectation supprimée avec succès");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  return { deleteProgramSubject, isDeleting };
}
