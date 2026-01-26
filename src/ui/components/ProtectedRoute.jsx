import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../features/auth/useUser";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { data, isLoading, isAuthenticated } = useUser();

  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) return navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );


  if (data === null) navigate("/login");
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
