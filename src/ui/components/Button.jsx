import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
  secondary:
    "bg-white dark:bg-white/10 border-2 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 hover:border-slate-300 dark:hover:border-white/30",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/25",
  ghost:
    "bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  isLoading = false,
  loadingText,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}

