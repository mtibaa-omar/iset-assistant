import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/components/Button";

export default function ChatHeader({ subject, isLoading }) {
  const navigate = useNavigate();

  const subjectName = subject?.subjects?.name || "Chargement...";
  const modeLabel = subject?.mode === "cours" ? "Cours" : "Atelier";

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        icon={ArrowLeft}
        onClick={() => navigate("/matieres")}
        className="!p-2"
      />

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
          {isLoading ? (
            <span className="inline-block w-32 h-5 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
          ) : (
            subjectName
          )}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isLoading ? (
            <span className="inline-block w-20 h-3 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
          ) : (
            `Discussion de groupe • ${modeLabel}`
          )}
        </p>
      </div>
    </div>
  );
}
