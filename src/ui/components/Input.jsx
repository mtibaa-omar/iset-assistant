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
    inputClassName = "",
    disabled = false,
    ...props
  },
  ref
) {
  const baseInputStyles =
    "w-full pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600";
  const iconPadding = Icon ? "pl-10" : "pl-4";
  const errorStyles = error
    ? "border-red-400 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500"
    : "border-slate-200 dark:border-zinc-800 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";
  const disabledStyles = disabled
    ? "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 cursor-not-allowed"
    : "";

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-400"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute w-5 h-5 text-slate-400 dark:text-zinc-500 -translate-y-1/2 left-3 top-1/2" />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputStyles} ${iconPadding} ${errorStyles} ${disabledStyles} ${inputClassName}`}
          {...props}
        />
      </div>

      {error && <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-500">{hint}</p>}
    </div>
  );
});

export default Input;
