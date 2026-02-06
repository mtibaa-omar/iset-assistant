import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api/apiAuth";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isPending: isLoading, mutate: logout } = useMutation({
        mutationFn: authAPI.signOut,
        onSuccess: () => {
            queryClient.clear();
            toast.success("Déconnexion réussie !");
            navigate("/login", { replace: true });
        },
        onError: (err) => {
            const message = err.message || "Échec de la déconnexion !";
            toast.error(message);
        },
    });

    return { isLoading, logout };
}
