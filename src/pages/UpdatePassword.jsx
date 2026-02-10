import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lock, Save, Sun, Moon } from "lucide-react";
import { toast } from "react-toastify";
import { useUpdateUser } from "../features/auth/useUpdateUser";
import { supabase } from "../services/supabase";
import AuthCard from "../features/auth/AuthCard";
import Input from "../ui/components/Input";
import Button from "../ui/components/Button";
import Spinner from "../ui/components/Spinner";
import { useDarkMode } from "../context/DarkModeContext";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isUpdating, updateUser } = useUpdateUser();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Lien invalide ou expiré. Veuillez demander un nouveau lien.");
          setTimeout(() => navigate("/forgot-password"), 2000);
          return;
        }

        if (!session) {
          toast.error("Session invalide. Veuillez demander un nouveau lien de réinitialisation.");
          setTimeout(() => navigate("/forgot-password"), 2000);
          return;
        }

        setHasValidSession(true);
      } catch (err) {
        console.error("Session verification error:", err);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        setTimeout(() => navigate("/forgot-password"), 2000);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const onSubmit = (data) => {
    updateUser(
      { password: data.password },
      {
        onSuccess: async () => {
          toast.success("Mot de passe mis à jour avec succès ! Veuillez vous reconnecter.");
          sessionStorage.removeItem("isPasswordRecovery");
          await supabase.auth.signOut();
          setTimeout(() => navigate("/login"), 1000);
        },
        onError: (err) => {
          console.error("Password update error:", err);
          toast.error("Erreur lors de la mise à jour du mot de passe. Veuillez réessayer.");
        }
      }
    );
  };

  if (isCheckingSession) {
    return (
      <>
        <div className="fixed z-10 top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full cursor-pointer transition-all duration-200 backdrop-blur-md shadow-sm bg-white/70 dark:bg-white/10 border border-slate-300/60 dark:border-white/20 hover:bg-white/90 dark:hover:bg-white/20 hover:shadow-md hover:scale-105"
            title={isDarkMode ? "Mode clair" : "Mode sombre"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </>
    );
  }

  if (!hasValidSession) {
    return null;
  }

  return (
    <>
      <div className="fixed z-10 top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full cursor-pointer transition-all duration-200 backdrop-blur-md shadow-sm bg-white/70 dark:bg-white/10 border border-slate-300/60 dark:border-white/20 hover:bg-white/90 dark:hover:bg-white/20 hover:shadow-md hover:scale-105"
          title={isDarkMode ? "Mode clair" : "Mode sombre"}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-gray-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </div>

      <AuthCard 
        title="Mettre à jour le mot de passe" 
        subtitle="Choisissez un nouveau mot de passe pour votre compte"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="password"
            type="password"
            label="Nouveau mot de passe"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            hint={!errors.password ? "8+ caractères, majuscule, minuscule, chiffre & symbole" : undefined}
            disabled={isUpdating}
            {...register("password", {
              required: "Le mot de passe est requis",
              minLength: {
                value: 8,
                message: "Au moins 8 caractères",
              },
              validate: {
                hasUpperCase: (value) => /[A-Z]/.test(value) || "Doit contenir une majuscule",
                hasLowerCase: (value) => /[a-z]/.test(value) || "Doit contenir une minuscule",
                hasNumber: (value) => /[0-9]/.test(value) || "Doit contenir un chiffre",
                hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Doit contenir un caractère spécial",
              },
            })}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            disabled={isUpdating}
            {...register("confirmPassword", {
              required: "Veuillez confirmer votre mot de passe",
              validate: (value) => 
                value === watch("password") || "Les mots de passe ne correspondent pas",
            })}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
            fullWidth
            isLoading={isUpdating}
            loadingText="Mise à jour..."
          >
            Mettre à jour le mot de passe
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
