import { forwardRef } from "react";

const Select = forwardRef(function Select(
  {
    label,
    error,
    icon: Icon,
    options = [],
    placeholder = "",
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-zinc-500" />
        )}
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full py-2 text-sm ${Icon ? 'pl-10' : 'pl-4'} pr-4 transition-all border outline-none rounded-xl bg-white/50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-700 dark:text-zinc-100 disabled:opacity-50 ${className}`}
          {...props}
        >
          {placeholder && <option value="" className="dark:bg-zinc-900 dark:text-zinc-400">{placeholder}</option>}
          {options.map((option) => {
            if (typeof option === "string") {
              return (
                <option key={option} value={option} className="dark:bg-zinc-900 dark:text-zinc-100">
                  {option}
                </option>
              );
            }
            return (
              <option key={option.value} value={option.value} className="dark:bg-zinc-900 dark:text-zinc-100">
                {option.label}
              </option>
            );
          })}
        </select>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default Select;
