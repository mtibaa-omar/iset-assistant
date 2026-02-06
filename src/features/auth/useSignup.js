import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api/apiAuth";

export function useSignup() {
    const { isPending: isLoading, mutate: signup } = useMutation({
        mutationFn: ({ email, password, userData }) =>
            authAPI.signUp(email, password, userData),
        onSuccess: () => {
            toast.success("Code de vérification envoyé à votre email !");
        },
        onError: (err) => {
            const message = err.message || "Erreur lors de l'inscription";
            toast.error(message);
        },
    });

    return { isLoading, signup };
}
