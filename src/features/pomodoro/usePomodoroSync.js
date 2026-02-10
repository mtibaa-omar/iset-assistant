import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../../services/supabase";


export function usePomodoroSync(sessionId, currentUser, isOwner) {
  const channelRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [remoteTimerState, setRemoteTimerState] = useState(null);

  // Ref to hold latest timer state so owner can broadcast it when someone joins
  const latestTimerStateRef = useRef(null);

  // Owner calls this to update the ref (used for late-joiner broadcast)
  const setLatestTimerState = useCallback((state) => {
    latestTimerStateRef.current = state;
  }, []);

  // ---------- Channel setup: Presence + Broadcast ----------
  useEffect(() => {
    if (!sessionId || !currentUser?.id) return;

    const channel = supabase.channel(`pomo:${sessionId}`, {
      config: { presence: { key: currentUser.id } },
    });

    // Presence sync → update online users (include everyone, UI filters)
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat();
      setOnlineUsers(users);
    });

    // Presence join → owner broadcasts current timer state for late joiners
    channel.on("presence", { event: "join" }, ({ newPresences }) => {
      if (!isOwner || !latestTimerStateRef.current) return;
      // Only broadcast if the joiner isn't the owner themselves
      const isNewUser = newPresences.some((p) => p.user_id !== currentUser.id);
      if (isNewUser) {
        setTimeout(() => {
          channel.send({
            type: "broadcast",
            event: "timer_sync",
            payload: {
              senderId: currentUser.id,
              ...latestTimerStateRef.current,
            },
          });
        }, 500); // small delay to ensure joiner's listener is ready
      }
    });

    // Broadcast listener → collaborators receive timer state
    channel.on("broadcast", { event: "timer_sync" }, ({ payload }) => {
      if (!payload || payload.senderId === currentUser?.id) return;
      setRemoteTimerState(payload);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: currentUser.id,
          full_name: currentUser.full_name,
          avatar_url: currentUser.avatar_url,
          is_owner: isOwner,
          online_at: new Date().toISOString(),
        });
      }
    });

    channelRef.current = channel;

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [sessionId, currentUser?.id, currentUser?.full_name, currentUser?.avatar_url, isOwner]);

  // ---------- Broadcast timer state (owner only) ----------
  const broadcastTimerState = useCallback(
    (timerState) => {
      // Always update the ref so late joiners get the latest
      latestTimerStateRef.current = timerState;

      if (!channelRef.current || !isOwner) return;
      channelRef.current.send({
        type: "broadcast",
        event: "timer_sync",
        payload: {
          senderId: currentUser?.id,
          ...timerState,
        },
      });
    },
    [currentUser?.id, isOwner]
  );

  return {
    onlineUsers,
    broadcastTimerState,
    remoteTimerState,
    setLatestTimerState,
  };
}
