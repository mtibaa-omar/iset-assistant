import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import { Input } from "../ui/components/Input";
import Button from "../ui/components/Button";
import GoogleButton from "../features/auth/GoogleButton";
import { useSignupContext } from "../features/auth/signup/SignupContext";
import { useSignup } from "../features/auth/useSignup";

export default function SignupStep1() {
  const navigate = useNavigate();
  const { signupData, updateSignupData, markStepCompleted } =
    useSignupContext();
  const { isLoading, signup } = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: signupData.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    signup(
      {
        email: data.email,
        password: data.password,
        userData: { full_name: data.fullName },
      },
      {
        onSuccess: () => {
          updateSignupData({ email: data.email });
          markStepCompleted(1);
          navigate("/signup/verify");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 2xl:space-y-4">
      <div className="space-y-3 duration-300 md:space-y-2 animate-in fade-in slide-in-from-right">
        <GoogleButton mode="signup" />

        <Input
          id="fullName"
          type="text"
          label="Full name"
          placeholder="Votre nom complet"
          icon={User}
          error={errors.fullName?.message}
          disabled={isLoading}
          {...register("fullName", { required: "Full name is required" })}
        />

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="votre.email@example.com"
          icon={Mail}
          error={errors.email?.message}
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email invalide",
            },
          })}
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          hint={!errors.password ? "8+ chars, uppercase, lowercase, number & symbol" : undefined}
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "At least 8 characters",
            },
            validate: {
              hasUpperCase: (value) => /[A-Z]/.test(value) || "Must contain uppercase letter",
              hasLowerCase: (value) => /[a-z]/.test(value) || "Must contain lowercase letter",
              hasNumber: (value) => /[0-9]/.test(value) || "Must contain a number",
              hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Must contain a special character",
            },
          })}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            minLength: {
              value: 8,
              message: "At least 8 characters",
            },
            validate: (value) => {
              if (value !== watch("password")) {
                return "Passwords do not match";
              }
              return true;
            },
          })}
        />
      </div>

      <div className="pt-1.5 md:pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Continue"}
        </Button>
      </div>

      <p className="mt-2 text-xs text-center 2xl:mt-4 md:text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
