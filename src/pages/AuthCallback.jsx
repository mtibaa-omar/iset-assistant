import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupContext } from "../features/auth/signup/SignupContext";
import { useUser } from "../features/auth/useUser";
import Spinner from "../ui/components/Spinner";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { markStepCompleted } = useSignupContext();
  const { user, isLoading } = useUser();
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (isLoading || hasProcessed.current) return;

    try {
      if (!user) {
        navigate("/login", { replace: true });
        hasProcessed.current = true;
        return;
      }
      const levelId = user?.level_id;
      const specialtyId = user?.specialty_id;
      const isProfileComplete = levelId && specialtyId;

      if (isProfileComplete) {
        navigate("/", { replace: true });
      } else {
        markStepCompleted(1);
        markStepCompleted(2);
        navigate("/signup/profile", { replace: true });
      }
      hasProcessed.current = true;
    } catch (err) {
      console.error("Auth callback error:", err);
      setError(err.message);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
      hasProcessed.current = true;
    }
  }, [user, isLoading, navigate, markStepCompleted]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">Authentication error: {error}</p>
        <p className="text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Spinner />
      <p className="text-slate-600 dark:text-slate-400">Completing sign in...</p>
    </div>
  );
}
