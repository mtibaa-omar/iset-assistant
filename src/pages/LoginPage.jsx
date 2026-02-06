import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, Mail, Lock, Sun, Moon } from "lucide-react";
import { useLogin } from "../features/auth/useLogin";
import { useUser } from "../features/auth/useUser";
import { useDarkMode } from "../context/DarkModeContext";
import { useEffect } from "react";
import FormError from "../ui/components/FormError";
import Input from "../ui/components/Input";
import Button from "../ui/components/Button";
import AuthCard from "../features/auth/AuthCard";
import GoogleButton from "../features/auth/GoogleButton";

export default function LoginPage() {
  const { isLoading: loginLoading, login } = useLogin();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !userLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, userLoading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    login({ email: data.email, password: data.password });
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

      <AuthCard title="Connexion" subtitle="Connectez-vous à votre compte">
      <FormError message={errors.root?.message} />

      <GoogleButton mode="login" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input id="email" type="email" label="Email" placeholder="votre.email@example.com" icon={Mail} error={errors.email?.message} {...register("email", { required: "L'email est requis" })} />

        <Input id="password" type="password" label="Mot de passe" placeholder="••••••••" icon={Lock} error={errors.password?.message} {...register("password", { required: "Le mot de passe est requis" })} />

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-purple-600 bg-white rounded border-slate-300 dark:border-white/20 focus:ring-purple-500 dark:bg-white/5"
            />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
              Se souvenir de moi
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" icon={LogIn} fullWidth isLoading={isSubmitting || loginLoading} loadingText="Connexion...">Connexion</Button>
      </form>

      <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-400">
        Vous n'avez pas de compte ?{" "}
        <Link
          to="/signup"
          className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          S'inscrire
        </Link>
      </p>
    </AuthCard >
    </>
  );
}
