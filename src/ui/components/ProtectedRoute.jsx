import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../features/auth/useUser";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useUser();

  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) return navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );


  if (user === null) navigate("/login");
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
