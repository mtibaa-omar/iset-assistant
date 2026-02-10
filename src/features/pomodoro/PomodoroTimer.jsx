import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { pomodoroAPI } from "../../services/api/apiPomodoro";

const PHASES = {
  work: "Travail",
  short_break: "Pause Courte",
  long_break: "Pause Longue",
};


function calcRemainingFromDB(session) {
  const phaseDurations = {
    work: (session.work_duration || 25) * 60,
    short_break: (session.short_break || 5) * 60,
    long_break: (session.long_break || 15) * 60,
  };

  const phase = session.timer_phase || "work";
  const totalDuration = phaseDurations[phase] || phaseDurations.work;

  if (session.timer_running && session.timer_started_at) {
    const elapsed = Math.floor(
      (Date.now() - new Date(session.timer_started_at).getTime()) / 1000
    );
    return Math.max(0, totalDuration - elapsed);
  }

  if (session.timer_paused_remaining != null) {
    return session.timer_paused_remaining;
  }

  return totalDuration;
}

export default function PomodoroTimer({
  session,
  isOwner,
  broadcastTimerState,
  remoteTimerState,
  onStatsUpdate,
}) {
  const workDuration = (session?.work_duration || 25) * 60;
  const shortBreakDuration = (session?.short_break || 5) * 60;
  const longBreakDuration = (session?.long_break || 15) * 60;

  const [phase, setPhase] = useState(session?.timer_phase || "work");
  const [timeRemaining, setTimeRemaining] = useState(() =>
    session ? calcRemainingFromDB(session) : workDuration
  );
  const [isRunning, setIsRunning] = useState(session?.timer_running || false);
  const [completedSessions, setCompletedSessions] = useState(
    session?.completed_count || 0
  );
  const [taskLabel, setTaskLabel] = useState("");
  const intervalRef = useRef(null);
  const sessionIdRef = useRef(session?.id);

  useEffect(() => {
    onStatsUpdate?.({
      completedSessions,
      totalMinutes: completedSessions * (session?.work_duration || 25),
    });
  }, [completedSessions]);

  const getDuration = useCallback(
    (p) => {
      if (p === "work") return workDuration;
      if (p === "short_break") return shortBreakDuration;
      return longBreakDuration;
    },
    [workDuration, shortBreakDuration, longBreakDuration]
  );

  useEffect(() => {
    if (!session || session.id === sessionIdRef.current) return;
    sessionIdRef.current = session.id;
    setPhase(session.timer_phase || "work");
    setTimeRemaining(calcRemainingFromDB(session));
    setIsRunning(session.timer_running || false);
    setCompletedSessions(session.completed_count || 0);
  }, [session?.id]);

  const persistTimerState = useCallback(
    (state) => {
      if (!isOwner || !session?.id) return;
      pomodoroAPI.updateTimerState(session.id, state).catch((err) => {
        console.error("[Pomodoro] Failed to persist timer state:", err);
      });
    },
    [isOwner, session?.id]
  );

  useEffect(() => {
    if (isOwner || !remoteTimerState) return;

    if (remoteTimerState.phase) setPhase(remoteTimerState.phase);
    if (remoteTimerState.timeRemaining !== undefined)
      setTimeRemaining(remoteTimerState.timeRemaining);
    if (remoteTimerState.isRunning !== undefined)
      setIsRunning(remoteTimerState.isRunning);
    if (remoteTimerState.completedSessions !== undefined)
      setCompletedSessions(remoteTimerState.completedSessions);
  }, [remoteTimerState, isOwner]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);

          if (phase === "work") {
            const newCompleted = completedSessions + 1;
            setCompletedSessions(newCompleted);
            const nextPhase =
              newCompleted % 4 === 0 ? "long_break" : "short_break";
            setPhase(nextPhase);

            const nextDuration = getDuration(nextPhase);
            if (isOwner) {
              const state = {
                phase: nextPhase,
                timeRemaining: nextDuration,
                isRunning: false,
                completedSessions: newCompleted,
              };
              broadcastTimerState?.(state);
              persistTimerState({
                timer_running: false,
                timer_phase: nextPhase,
                timer_started_at: null,
                timer_paused_remaining: nextDuration,
                completed_count: newCompleted,
              });
            }
            return nextDuration;
          } else {
            setPhase("work");
            if (isOwner) {
              const state = {
                phase: "work",
                timeRemaining: workDuration,
                isRunning: false,
                completedSessions,
              };
              broadcastTimerState?.(state);
              persistTimerState({
                timer_running: false,
                timer_phase: "work",
                timer_started_at: null,
                timer_paused_remaining: workDuration,
                completed_count: completedSessions,
              });
            }
            return workDuration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isRunning,
    phase,
    completedSessions,
    getDuration,
    workDuration,
    isOwner,
    broadcastTimerState,
    persistTimerState,
  ]);

  useEffect(() => {
    if (!isOwner || !isRunning) return;

    const syncInterval = setInterval(() => {
      broadcastTimerState?.({
        phase,
        timeRemaining,  
        isRunning,
        completedSessions,
      });
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [isOwner, isRunning, phase, timeRemaining, completedSessions, broadcastTimerState]);

  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(getDuration(phase));
    }
  }, [workDuration, shortBreakDuration, longBreakDuration]);

  // --- Handlers (owner only) ---
  const handleStartPause = () => {
    if (!isOwner) return;
    const newRunning = !isRunning;
    setIsRunning(newRunning);

    // Broadcast
    broadcastTimerState?.({
      phase,
      timeRemaining,
      isRunning: newRunning,
      completedSessions,
    });

    if (newRunning) {
      // Starting: store timestamp so late joiners can calculate elapsed
      persistTimerState({
        timer_running: true,
        timer_phase: phase,
        timer_started_at: new Date(
          Date.now() - (getDuration(phase) - timeRemaining) * 1000
        ).toISOString(),
        timer_paused_remaining: null,
        completed_count: completedSessions,
      });
    } else {
      // Pausing: store remaining seconds
      persistTimerState({
        timer_running: false,
        timer_phase: phase,
        timer_started_at: null,
        timer_paused_remaining: timeRemaining,
        completed_count: completedSessions,
      });
    }
  };

  const handleReset = () => {
    if (!isOwner) return;
    setIsRunning(false);
    const dur = getDuration(phase);
    setTimeRemaining(dur);

    broadcastTimerState?.({
      phase,
      timeRemaining: dur,
      isRunning: false,
      completedSessions,
    });

    persistTimerState({
      timer_running: false,
      timer_phase: phase,
      timer_started_at: null,
      timer_paused_remaining: dur,
      completed_count: completedSessions,
    });
  };

  const handlePhaseSwitch = (newPhase) => {
    if (!isOwner) return;
    setIsRunning(false);
    setPhase(newPhase);
    const dur = getDuration(newPhase);
    setTimeRemaining(dur);

    broadcastTimerState?.({
      phase: newPhase,
      timeRemaining: dur,
      isRunning: false,
      completedSessions,
    });

    persistTimerState({
      timer_running: false,
      timer_phase: newPhase,
      timer_started_at: null,
      timer_paused_remaining: dur,
      completed_count: completedSessions,
    });
  };

  // Format
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const totalDuration = getDuration(phase);
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  return (
    <div className="p-6 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl sm:p-8">
      {/* Phase tabs */}
      <div className="flex p-1 mx-auto mb-8 border rounded-full bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 max-w-md">
        {Object.entries(PHASES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handlePhaseSwitch(key)}
            disabled={!isOwner}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-sm font-semibold rounded-full transition-all duration-200 ${
              phase === key
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            } ${!isOwner ? "cursor-default" : "cursor-pointer"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="mb-6 text-center">
        <div className="font-mono text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-8xl tracking-tight">
          {display}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 mx-auto mb-8 overflow-hidden max-w-md rounded-full bg-slate-200 dark:bg-zinc-700">
        <div
          className="h-full transition-all duration-1000 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={handleStartPause}
          disabled={!isOwner}
          className={`flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
            isRunning
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
          } ${!isOwner ? "opacity-60 cursor-default" : ""}`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Démarrer
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={!isOwner}
          className={`flex items-center gap-2 px-5 py-3 text-base font-semibold border-2 rounded-xl transition-all duration-200 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 ${
            !isOwner ? "opacity-60 cursor-default" : ""
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          Réinitialiser
        </button>
      </div>

      {/* Task input */}
      <div className="mx-auto max-w-md">
        <input
          type="text"
          value={taskLabel}
          onChange={(e) => setTaskLabel(e.target.value)}
          placeholder="Sur quoi travaillez-vous ?"
          className="w-full px-4 py-3 text-sm text-center border-2 rounded-xl border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Session dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < completedSessions % 4
                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                : "bg-slate-200 dark:bg-zinc-700"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-500 dark:text-zinc-500">
          {completedSessions} sessions aujourd'hui
        </span>
      </div>
    </div>
  );
}
