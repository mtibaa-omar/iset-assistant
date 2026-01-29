import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../services/api/apiAuth";
import { authKeys } from "./authKeys";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: authKeys.user,
    queryFn: authAPI.getUser,
  });
  
  return { 
    isLoading, 
    user, 
    isAuthenticated: user?.role === "authenticated",
    role: user?.profile_role || 'student',
    isAdmin: user?.profile_role === 'admin',
    isStaff: ['admin', 'moderator'].includes(user?.profile_role),
  };
}
