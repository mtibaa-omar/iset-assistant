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
    "w-full pr-3 md:pr-4 py-2 md:py-2.5 lg:py-3 border-2 rounded-lg md:rounded-xl focus:outline-none transition-all text-sm md:text-base text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600";
  const iconPadding = Icon ? "pl-8 md:pl-9 lg:pl-10" : "pl-3 md:pl-4";
  const errorStyles = error
    ? "border-red-400 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500"
    : "border-slate-200 dark:border-zinc-800 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";
  const disabledStyles = disabled
    ? "bg-slate-100 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-600 cursor-not-allowed border-slate-200 dark:border-zinc-800"
    : "bg-white dark:bg-zinc-900";

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1.5 md:mb-2 text-xs md:text-sm font-semibold text-slate-700 dark:text-zinc-400"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute w-4 h-4 md:w-5 md:h-5 text-slate-400 dark:text-zinc-500 -translate-y-1/2 left-2.5 md:left-3 top-1/2" />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputStyles} ${disabledStyles} ${iconPadding} ${errorStyles} ${inputClassName}`}
          {...props}
        />
      </div>

      {error && <p className="mt-1 md:mt-1.5 text-xs md:text-sm text-red-500 dark:text-red-400">{error}</p>}
      {!error && hint && <p className="mt-1 md:mt-1.5 text-[10px] md:text-xs text-slate-500 dark:text-zinc-500">{hint}</p>}
    </div>
  );
});

export default Input;
