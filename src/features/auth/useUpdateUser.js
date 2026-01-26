import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api/apiAuth";
import { authKeys } from "./authKeys";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { isPending: isUpdating, mutate: updateUser } = useMutation({
    mutationFn: authAPI.updateCurrentUser,
    onSuccess: () => {
      toast.success("User data Successfully updated");
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updateUser };
}
