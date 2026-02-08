import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../../services/supabase";

/**
 *
 * @param {string} whiteboardId  - the whiteboard room id
 * @param {object} currentUser   - { id, full_name, avatar_url }
 * @param {object} editor        - tldraw editor instance
 */
export function useCollaboration(whiteboardId, currentUser, editor) {
  const channelRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const isRemoteUpdate = useRef(false);

  // ---------- Presence (who's online) ----------
  useEffect(() => {
    if (!whiteboardId || !currentUser?.id) return;

    const channel = supabase.channel(`wb:${whiteboardId}`, {
      config: { presence: { key: currentUser.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users = Object.values(state)
          .flat()
          .filter((u) => u.user_id !== currentUser.id);
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: currentUser.id,
            full_name: currentUser.full_name,
            avatar_url: currentUser.avatar_url,
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
  }, [whiteboardId, currentUser?.id, currentUser?.full_name, currentUser?.avatar_url]);

  // ---------- Broadcast outgoing changes ----------
  const broadcastChanges = useCallback(
    (changes) => {
      if (!channelRef.current || isRemoteUpdate.current) return;
      channelRef.current.send({
        type: "broadcast",
        event: "drawing",
        payload: {
          senderId: currentUser?.id,
          changes,
        },
      });
    },
    [currentUser?.id]
  );

  // ---------- Listen for incoming changes ----------
  useEffect(() => {
    if (!channelRef.current || !editor) return;

    const channel = channelRef.current;

    const handleDrawing = ({ payload }) => {
      if (!payload || payload.senderId === currentUser?.id) return;

      const { changes } = payload;
      if (!changes) return;

      // Flag so broadcastChanges ignores this store update
      isRemoteUpdate.current = true;
      try {
        editor.store.mergeRemoteChanges(() => {
          const { added, updated, removed } = changes;

          if (added) {
            for (const record of Object.values(added)) {
              editor.store.put([record]);
            }
          }
          if (updated) {
            for (const [, to] of Object.values(updated)) {
              editor.store.put([to]);
            }
          }
          if (removed) {
            const ids = Object.values(removed).map((r) => r.id);
            editor.store.remove(ids);
          }
        });
      } finally {
        isRemoteUpdate.current = false;
      }
    };

    channel.on("broadcast", { event: "drawing" }, handleDrawing);

    return () => {
      channel.unsubscribe();
    };
  }, [editor, currentUser?.id]);

  return { onlineUsers, broadcastChanges, isRemoteUpdate };
}
