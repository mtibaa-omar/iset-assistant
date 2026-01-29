import { Navigate } from "react-router-dom";
import { useUser } from "../../features/auth/useUser";
import Spinner from "./Spinner";

export default function AdminRoute({ children }) {
  const { user, isLoading, isAdmin } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
