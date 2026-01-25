import { X, Bell } from "lucide-react";

export default function NotificationPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 z-50 mt-2 overflow-hidden border shadow-xl top-full w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700 dark:text-white" />
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-3 border-t border-slate-200/60 dark:border-white/10">
          <button className="w-full py-2 text-sm font-medium transition-colors rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10">
            Marquer tout comme lu
          </button>
        </div>
      </div>
    </>
  );
}
