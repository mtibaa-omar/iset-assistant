export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  progress,
  variant = "blue"
}) {
  const variants = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      icon: "text-blue-600 dark:text-blue-400",
      progress: "bg-blue-600"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      progress: "bg-purple-600"
    },
    pink: {
      bg: "bg-pink-50 dark:bg-pink-500/10",
      icon: "text-pink-600 dark:text-pink-400",
      progress: "bg-pink-600"
    },
    red: {
      bg: "bg-red-50 dark:bg-red-500/10",
      icon: "text-red-600 dark:text-red-400",
      progress: "bg-red-600"
    }
  };

  const currentVariant = variants[variant] || variants.blue;

  return (
    <div className="relative p-4 transition-all bg-white border shadow-sm md:p-4.5 lg:p-5 2xl:p-6 dark:bg-zinc-900 rounded-2xl border-slate-200 dark:border-zinc-800 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between mb-2 lg:mb-0 2xl:mb-4">
        <div className="flex-1">
          <p className="text-[10px] md:text-[11px] lg:text-xs 2xl:text-sm font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2 md:mt-2 lg:mt-2.5 2xl:mt-3">
            <h3 className="text-2xl font-bold md:text-[1.75rem] lg:text-3xl 2xl:text-4xl text-slate-900 dark:text-white">
              {value}
            </h3>
            {subtitle && (
              <span className="text-xs md:text-[13px] lg:text-sm 2xl:text-base font-medium text-slate-500 dark:text-zinc-400">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 2xl:w-14 2xl:h-14 ${currentVariant.bg} rounded-full transition-colors`}>
            <Icon className={`w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 2xl:w-7 2xl:h-7 ${currentVariant.icon}`} />
          </div>
        )}
      </div>
      
      {progress && (
        <div className="lg:mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] md:text-[11px] lg:text-xs 2xl:text-sm font-medium text-slate-500 dark:text-zinc-400">{progress.label}</span>
            <span className="text-[10px] md:text-[11px] lg:text-xs 2xl:text-sm font-bold text-slate-900 dark:text-white">
              {progress.percentage}%
            </span>
          </div>
          <div className="w-full h-1.5 md:h-1.5 lg:h-2 2xl:h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full ${currentVariant.progress} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

