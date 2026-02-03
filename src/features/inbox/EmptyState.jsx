import { MessageSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="flex items-center justify-center w-20 h-20 mb-6 bg-purple-100 rounded-full dark:bg-purple-900/30">
        <MessageSquare className="w-10 h-10 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
        Sélectionnez une conversation
      </h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        Choisissez une conversation dans la liste pour commencer à discuter, ou créez-en une nouvelle.
      </p>
    </div>
  );
}
