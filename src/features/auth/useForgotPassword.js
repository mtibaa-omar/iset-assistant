import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../services/api/apiAuth";
import { toast } from "react-toastify";

export function useForgotPassword() {
  const { isPending, mutate: forgotPassword } = useMutation({
    mutationFn: (email) => authAPI.resetPassword(email),
    onSuccess: () => {
      toast.success("E-mail de réinitialisation envoyé.");
    },
    onError: (err) => {
      const message = err.message || "Une erreur est survenue lors de l'envoi de l'e-mail.";
      toast.error(message);
    },
  });

  return { 
    isLoading: isPending, 
    forgotPassword: (email, options) => {
      forgotPassword(email, options);
    }
  };
}
