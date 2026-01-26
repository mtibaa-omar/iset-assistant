import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api/apiAuth";
import { authKeys } from "./authKeys";

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isPending: isLoading, mutate: login } = useMutation({
        mutationFn: ({ email, password }) => authAPI.signIn(email, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.user });
            queryClient.invalidateQueries({ queryKey: authKeys.session });
            queryClient.invalidateQueries({ queryKey: authKeys.profile });
            toast.success("Login successful!");
            navigate("/", { replace: true });
        },
        onError: (err) => {
            const message = err.message || "Email or password incorrect";
            toast.error(message);
        },
    });

    return { isLoading, login };
}

export function useLoginWithGoogle() {
  const {
    isPending: isLoading,
    mutate: loginWithGoogle,
  } = useMutation({
    mutationFn: authAPI.signInWithGoogle,
    onError: (err) => {
      const message = err.message || "Google login failed";
      toast.error(message);
    },
  });

  return { isLoading, loginWithGoogle };
}
