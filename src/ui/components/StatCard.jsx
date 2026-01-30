export default function StatCard({ title, value, valueColor, subtitle}) {
  return (
    <div className="group relative p-4 bg-white border rounded-xl dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-zinc-900/50 hover:-translate-y-0.5">
      <div className="mb-2">
        <p className="text-xs font-medium tracking-wider uppercase text-slate-500 dark:text-zinc-500">
          {title}
        </p>
      </div>
        <p className={`text-2xl font-bold tracking-tight ${valueColor || "text-slate-900 dark:text-zinc-100"}`}>
          {value}
        </p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
