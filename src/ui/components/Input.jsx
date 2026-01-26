import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  {
    label,
    id,
    type = "text",
    placeholder,
    icon: Icon,
    error,
    hint,
    className = "",
    disabled = false,
    ...props
  },
  ref
) {
  const baseInputStyles =
    "w-full pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const iconPadding = Icon ? "pl-10" : "pl-4";
  const errorStyles = error
    ? "border-red-400 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500"
    : "border-slate-200 dark:border-white/10 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20";
  const disabledStyles = disabled
    ? "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed"
    : "";

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute w-5 h-5 text-slate-400 dark:text-slate-500 -translate-y-1/2 left-3 top-1/2" />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputStyles} ${iconPadding} ${errorStyles} ${disabledStyles}`}
          {...props}
        />
      </div>

      {error && <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
});

export default Input;
