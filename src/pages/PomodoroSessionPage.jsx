import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  Share2,
  Crown,
  Pencil,
  Check,
  BarChart3,
  X,
} from "lucide-react";
import { useUser } from "../features/auth/useUser";
import {
  usePomodoroSession,
  useUpdatePomodoro,
} from "../features/pomodoro/usePomodoro";
import { usePomodoroSync } from "../features/pomodoro/usePomodoroSync";
import Spinner from "../ui/components/Spinner";
import PomodoroTimer from "../features/pomodoro/PomodoroTimer";
import PomodoroStats from "../features/pomodoro/PomodoroStats";
import PomodoroSettings from "../features/pomodoro/PomodoroSettings";
import SharePomodoroModal from "../features/pomodoro/SharePomodoroModal";

export default function PomodoroSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();

  const { data: session, isLoading: sessionLoading } = usePomodoroSession(id);
  const updatePomodoro = useUpdatePomodoro();

  const isOwner = session?.owner_id === user?.id;

  const currentUser = user
    ? {
        id: user.id,
        full_name:
          user.user_metadata?.full_name ||
          user.profile_full_name ||
          "Utilisateur",
        avatar_url:
          user.user_metadata?.avatar_url || user.profile_avatar_url,
      }
    : null;

  const { onlineUsers, broadcastTimerState, remoteTimerState } =
    usePomodoroSync(id, currentUser, isOwner);

  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showStats, setShowStats] = useState(false); // mobile stats toggle
  const [stats, setStats] = useState({
    completedSessions: session?.completed_count || 0,
    totalMinutes: (session?.completed_count || 0) * (session?.work_duration || 25),
  });
  const [completedTasks, setCompletedTasks] = useState([]);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const titleInputRef = useRef(null);

  const startEditingTitle = () => {
    if (!isOwner) return;
    setTitleDraft(session?.title || "");
    setIsEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 50);
  };

  const saveTitle = () => {
    const trimmed = titleDraft.trim();
    setIsEditingTitle(false);
    if (trimmed && trimmed !== session?.title) {
      updatePomodoro.mutate({ id, title: trimmed });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") saveTitle();
    if (e.key === "Escape") setIsEditingTitle(false);
  };

  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUsersDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSaveSettings = (settings) => {
    updatePomodoro.mutate(
      { id, ...settings },
      { onSuccess: () => setShowSettings(false) }
    );
  };

  const handleStatsUpdate = (newStats) => {
    setStats(newStats);
  };

  if (userLoading || sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-medium text-slate-500 dark:text-zinc-500">
          Session introuvable
        </p>
        <button
          onClick={() => navigate("/pomodoro")}
          className="text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          ← Retour aux sessions
        </button>
      </div>
    );
  }

  const maxVisibleAvatars = 2;
  const visibleUsers = onlineUsers.slice(0, maxVisibleAvatars);
  const overflowCount = Math.max(0, onlineUsers.length - maxVisibleAvatars);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl px-3 py-4 mx-auto sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-3 mb-4 sm:mb-8">
          <div className="flex items-center gap-2 min-w-0 sm:gap-3">
            <button
              onClick={() => navigate("/pomodoro")}
              className="p-1.5 sm:p-2 transition-colors rounded-xl text-slate-500 hover:bg-slate-100 dark:text-zinc-500 dark:hover:bg-zinc-800 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {isEditingTitle ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={saveTitle}
                  className="min-w-0 w-full max-w-[200px] sm:max-w-none px-2 py-1 text-base sm:text-xl font-bold border-2 rounded-xl border-purple-400 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-purple-500"
                  maxLength={60}
                />
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={saveTitle}
                  className="p-1 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 shrink-0"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : (
              <div
                className={`flex items-center gap-1.5 min-w-0 group ${isOwner ? "cursor-pointer" : ""}`}
                onClick={startEditingTitle}
              >
                <h1 className="text-base font-bold truncate text-slate-900 dark:text-zinc-100 sm:text-xl lg:text-2xl">
                  {session.title}
                </h1>
                {isOwner && (
                  <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-opacity opacity-0 text-slate-400 group-hover:opacity-100 shrink-0" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            {onlineUsers.length > 0 && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                  className="flex items-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full" />
                  </span>

                  <div className="flex -space-x-2">
                    {visibleUsers.map((u) => (
                      <img
                        key={u.user_id}
                        src={u.avatar_url || "/image.png"}
                        alt={u.full_name}
                        className="object-cover border-2 border-white rounded-full w-6 h-6 sm:w-7 sm:h-7 dark:border-zinc-900"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.src = "/image.png";
                        }}
                      />
                    ))}
                  </div>

                  {overflowCount > 0 && (
                    <span className="flex items-center justify-center -ml-2 text-[10px] sm:text-xs font-bold border-2 border-white rounded-full w-6 h-6 sm:w-7 sm:h-7 dark:border-zinc-900 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                      +{overflowCount}
                    </span>
                  )}

                  <span className="hidden text-xs font-semibold sm:inline text-slate-500 dark:text-zinc-500">
                    {onlineUsers.length}
                  </span>
                </button>

                {showUsersDropdown && (
                  <div className="absolute right-0 z-20 w-60 py-2 mt-2 overflow-y-auto border shadow-xl bg-white dark:bg-zinc-900 rounded-2xl border-slate-200 dark:border-zinc-700 max-h-72">
                    <div className="px-3 py-1.5 mb-1">
                      <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-zinc-600">
                        Connectés ({onlineUsers.length})
                      </p>
                    </div>
                    {onlineUsers.map((u) => (
                      <div
                        key={u.user_id}
                        className="flex items-center gap-2.5 px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={u.avatar_url || "/image.png"}
                            alt={u.full_name}
                            className="object-cover w-7 h-7 rounded-full"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.src = "/image.png";
                            }}
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                        </div>
                        <p className="flex-1 text-sm font-medium truncate text-slate-900 dark:text-zinc-100">
                          {u.full_name}
                        </p>
                        {u.is_owner && (
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 shrink-0">
                            <Crown className="w-3 h-3 text-amber-500" />
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
                              Admin
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowStats(!showStats)}
              className="p-1.5 sm:p-2.5 transition-colors rounded-xl text-slate-500 hover:bg-slate-100 dark:text-zinc-500 dark:hover:bg-zinc-800"
              title="Statistiques"
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            {isOwner && (
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 sm:p-2.5 transition-colors rounded-xl text-slate-500 hover:bg-slate-100 dark:text-zinc-500 dark:hover:bg-zinc-800"
                title="Paramètres"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-200 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <PomodoroTimer
            session={session}
            isOwner={isOwner}
            broadcastTimerState={broadcastTimerState}
            remoteTimerState={remoteTimerState}
            onStatsUpdate={handleStatsUpdate}
          />
        </div>
      </div>

      {showStats && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowStats(false)}
          />
          <div className="absolute top-0 right-0 h-full w-80 sm:w-96 overflow-y-auto bg-white dark:bg-zinc-900 shadow-2xl animate-slide-right">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                Statistiques du jour
              </h3>
              <button
                onClick={() => setShowStats(false)}
                className="p-1.5 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5">
              <PomodoroStats
                completedSessions={stats.completedSessions}
                totalMinutes={stats.totalMinutes}
                tasks={completedTasks}
              />
            </div>
          </div>
        </div>
      )}

      <PomodoroSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        session={session}
        onSave={handleSaveSettings}
        isSaving={updatePomodoro.isPending}
      />

      <SharePomodoroModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        session={session}
      />
    </div>
  );
}
