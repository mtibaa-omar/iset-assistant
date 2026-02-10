import { Clock, CheckCircle2, TrendingUp } from "lucide-react";

export default function PomodoroStats({ completedSessions = 0, totalMinutes = 0, tasks = [] }) {
  const productivite = completedSessions > 0 ? Math.min(Math.round((completedSessions / 8) * 100), 100) : 0;

  return (
    <div className="space-y-5">
      <div className="p-5 border bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border-slate-200 dark:border-zinc-800">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-zinc-100">
          Statistiques du Jour
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                Temps Total
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}min
              </p>
            </div>
          </div>

          {/* Sessions */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
                Sessions
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {completedSessions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Productivité
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {productivite}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border-slate-200 dark:border-zinc-800">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-zinc-100">
          Tâches du Jour
        </h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-zinc-500">
            Aucune tâche complétée pour le moment
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                  {task}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
