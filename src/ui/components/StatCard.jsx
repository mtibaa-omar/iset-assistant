export default function StatCard({ title, value, valueColor, subtitle}) {
  return (
    <div className="group relative p-4 bg-white border rounded-xl dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5">
      <div className="mb-2">
        <p className="text-xs font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
          {title}
        </p>
      </div>
        <p className={`text-2xl font-bold tracking-tight ${valueColor || "text-slate-800 dark:text-white"}`}>
          {value}
        </p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
