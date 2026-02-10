import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../services/api/apiAuth";
import { toast } from "react-toastify";

export function useForgotPassword() {
  const { isPending, mutate: forgotPassword } = useMutation({
    mutationFn: (email) => authAPI.resetPassword(email),
    onSuccess: () => {
      toast.success("E-mail de réinitialisation envoyé. Vérifiez votre boîte de réception.");
    },
    onError: (err) => {
      console.error("Password reset error:", err);
      let message = "Une erreur est survenue lors de l'envoi de l'e-mail.";
      
      if (err.message?.includes("email not confirmed")) {
        message = "Veuillez d'abord confirmer votre adresse e-mail.";
      } else if (err.message?.includes("user not found")) {
        message = "Aucun compte n'est associé à cet e-mail.";
      } else if (err.message?.includes("rate limit")) {
        message = "Trop de tentatives. Veuillez réessayer dans quelques minutes.";
      } else if (err.message) {
        message = err.message;
      }
      
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
