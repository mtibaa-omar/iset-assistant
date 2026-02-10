import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../features/auth/useUser";
import Spinner from "./Spinner";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useUser();

  const isRecoverySession = sessionStorage.getItem("isPasswordRecovery") === "true";

  useEffect(() => {
    if (isRecoverySession) {
      navigate("/update-password", { replace: true });
      return;
    }

    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const hasLevel = user?.level_id;
    const hasSpecialty = user?.specialty_id;

    if (!hasLevel || !hasSpecialty) {
      navigate("/signup/profile", { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, user, navigate, isRecoverySession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isRecoverySession) {
    return null;
  }

  if (!isAuthenticated || !user?.level_id || !user?.specialty_id) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
