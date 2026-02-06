import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api/apiAuth";
import { authKeys } from "./authKeys";

export function useVerifyOtp() {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate: verifyOtp } = useMutation({
        mutationFn: ({ email, token }) => authAPI.verifyOtp(email, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.user });
            queryClient.invalidateQueries({ queryKey: authKeys.session });
            toast.success("Email vérifié avec succès !");
        },
        onError: () => {
            toast.error("Code invalide. Veuillez vérifier et réessayer.");
        },
    });

    return { isLoading, verifyOtp };
}

export function useResendOtp() {
    const { isPending: isLoading, mutate: resendOtp } = useMutation({
        mutationFn: (email) => authAPI.resendOtp(email),
        onSuccess: () => {
            toast.success("Nouveau code envoyé à votre email !");
        },
        onError: () => {
            toast.error("Échec de renvoi du code. Veuillez réessayer.");
        },
    });

    return { isLoading, resendOtp };
}
