import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useForgotPassword } from "../features/auth/useForgotPassword";
import AuthCard from "../features/auth/AuthCard";
import Input from "../ui/components/Input";
import Button from "../ui/components/Button";
import { useDarkMode } from "../context/DarkModeContext";
import { Sun, Moon } from "lucide-react";

export default function ForgotPassword() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isLoading, forgotPassword } = useForgotPassword();
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && emailSent) {
      setEmailSent(false);
    }
  }, [countdown, emailSent]);

  const onSubmit = (data) => {
    forgotPassword(data.email, {
      onSuccess: () => {
        setCountdown(60);
        setEmailSent(true);
      },
    });
  };

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
        title="Mot de passe oublié" 
        subtitle="Entrez votre e-mail pour recevoir un lien de réinitialisation"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="votre.email@example.com"
            icon={Mail}
            error={errors.email?.message}
            disabled={isLoading || countdown > 0}
            {...register("email", {
              required: "L'e-mail est requis",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email invalide",
              },
            })}
          />

          

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Send}
            fullWidth
            isLoading={isLoading}
            disabled={countdown > 0}
            loadingText="Envoi en cours..."
          >
            {countdown > 0 
              ? `Renvoyer dans ${countdown}s` 
              : "Envoyer le lien"
            }
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      </AuthCard>
    </>
  );
}
