import { useNavigate } from "react-router-dom";
import { Timer, MoreVertical, Share2, Trash2, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PomodoroCard({ session, currentUserId, onShare, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isOwner = session.owner_id === currentUserId;
  const collaborators = session.pomodoro_collaborators || [];

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      onClick={() => navigate(`/pomodoro/${session.id}`)}
      className="relative flex flex-col p-5 transition-all duration-200 border cursor-pointer bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border-slate-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg hover:shadow-purple-500/10 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100 line-clamp-1">
              {session.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              {isOwner ? "Propriétaire" : `Par ${session.owner?.full_name}`}
            </p>
          </div>
        </div>

        {isOwner && (
          <div ref={menuRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-10 w-44 py-1 mt-1 border shadow-lg bg-white dark:bg-zinc-800 rounded-xl border-slate-200 dark:border-zinc-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(session);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left transition-colors text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
          {session.work_duration}min travail
        </span>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
          {session.short_break}min pause
        </span>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          {session.long_break}min longue
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          {collaborators.length > 0 ? (
            <>
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((c) => (
                  <img
                    key={c.user_id}
                    src={c.user?.avatar_url || "/image.png"}
                    alt={c.user?.full_name}
                    className="w-6 h-6 border-2 border-white rounded-full dark:border-zinc-900"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src = "/image.png";
                    }}
                  />
                ))}
              </div>
              {collaborators.length > 3 && (
                <span className="ml-1 text-xs font-medium text-slate-500 dark:text-zinc-500">
                  +{collaborators.length - 3}
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1 text-slate-400 dark:text-zinc-600">
              <Users className="w-4 h-4" />
              <span className="text-xs">Solo</span>
            </div>
          )}
        </div>

        <span className="px-3 py-1 text-xs font-semibold text-purple-600 transition-colors rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40">
          Rejoindre →
        </span>
      </div>
    </div>
  );
}
