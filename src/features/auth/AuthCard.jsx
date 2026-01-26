export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full w-96 h-96 -top-48 -left-48 bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-500/20 dark:to-pink-500/20 blur-3xl animate-pulse" />
        <div className="absolute rounded-full w-96 h-96 -bottom-48 -right-48 bg-gradient-to-br from-pink-400/30 to-violet-400/30 dark:from-pink-500/20 dark:to-violet-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-64 h-64 rounded-full top-1/4 right-1/4 bg-gradient-to-br from-violet-300/20 to-purple-300/20 dark:from-violet-400/10 dark:to-purple-400/10 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className="p-8 border shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border-white/60 dark:border-slate-700/50 shadow-purple-500/10 dark:shadow-purple-500/5">
          {children}
        </div>

        <p className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
          ISET Assistant • Votre compagnon d'études
        </p>
      </div>
    </div>
  );
}

export default AuthCard;

