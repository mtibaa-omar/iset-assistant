export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen px-3 py-4 overflow-hidden md:px-4 lg:px-6 bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full md:w-80 md:h-80 lg:w-96 lg:h-96 -top-32 -left-32 md:-top-40 md:-left-40 lg:-top-48 lg:-left-48 bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-500/20 dark:to-pink-500/20 blur-3xl animate-pulse" />
        <div className="absolute w-64 h-64 rounded-full md:w-80 md:h-80 lg:w-96 lg:h-96 -bottom-32 -right-32 md:-bottom-40 md:-right-40 lg:-bottom-48 lg:-right-48 bg-gradient-to-br from-pink-400/30 to-violet-400/30 dark:from-pink-500/20 dark:to-violet-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-48 h-48 rounded-full md:w-56 md:h-56 lg:w-64 lg:h-64 top-1/4 right-1/4 bg-gradient-to-br from-violet-300/20 to-purple-300/20 dark:from-violet-400/10 dark:to-purple-400/10 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-4 text-center">
          
          <h1 className="mb-1.5 md:mb-2 text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className="p-5 border shadow-2xl md:p-4 lg:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-xl md:rounded-2xl border-white/60 dark:border-slate-700/50 shadow-purple-500/10 dark:shadow-purple-500/5">
          {children}
        </div>

        <p className="mt-4 text-xs text-center md:mt-5 lg:mt-6 md:text-sm text-slate-500 dark:text-slate-400">
          ISET Assistant • Votre compagnon d'études
        </p>
      </div>
    </div>
  );
}

export default AuthCard;

