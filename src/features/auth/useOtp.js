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
            toast.success("Email verified successfully!");
        },
        onError: () => {
            toast.error("Invalid code. Please check and try again.");
        },
    });

    return { isLoading, verifyOtp };
}

export function useResendOtp() {
    const { isPending: isLoading, mutate: resendOtp } = useMutation({
        mutationFn: (email) => authAPI.resendOtp(email),
        onSuccess: () => {
            toast.success("New code sent to your email!");
        },
        onError: () => {
            toast.error("Failed to resend code. Please try again.");
        },
    });

    return { isLoading, resendOtp };
}
