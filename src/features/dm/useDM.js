import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../services/supabase";
import { dmAPI } from "../../services/api/apiDM";
import { dmKeys } from "./dmKeys";
import { useUser } from "../auth/useUser";
import { playSound, SOUNDS } from "../../utils/soundUtils";

// Hook to search users
export function useSearchUsers(query) {
  const { data: users, isLoading } = useQuery({
    queryKey: dmKeys.searchUsers(query),
    queryFn: () => dmAPI.searchUsers(query),
    enabled: query.trim().length >= 3,
  });

  return { users: users || [], isLoading };
}

// Hook to get user by username
export function useUserByUsername(username) {
  const {
    data: targetUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: dmKeys.user(username),
    queryFn: () => dmAPI.getUserByUsername(username),
    enabled: !!username,
    retry: false,
  });

  return { targetUser, isLoading, error };
}

// Hook to get or create conversation and fetch messages
export function useDMConversation(targetUserId) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [conversationId, setConversationId] = useState(null);
  const channelRef = useRef(null);

  // Get or create conversation
  useEffect(() => {
    if (!user?.id || !targetUserId || user.id === targetUserId) return;

    const initConversation = async () => {
      try {
        const conv = await dmAPI.getOrCreateConversation(targetUserId);
        setConversationId(conv.id);
        // Invalidate conversations list to show the new conversation in sidebar
        queryClient.invalidateQueries({
          queryKey: dmKeys.conversations(user.id),
        });
      } catch (err) {
        console.error("[DM] Error getting conversation:", err);
      }
    };

    initConversation();
  }, [user?.id, targetUserId, queryClient]);

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: dmKeys.messages(conversationId),
    queryFn: () => dmAPI.getMessages(conversationId),
    enabled: !!conversationId,
  });

  // Real-time subscription for messages in this conversation
  // Only updates message cache — sound is handled by the global useDMRealtime hook
  useEffect(() => {
    if (!conversationId) return;

    // Clean up previous channel if conversationId changed
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current).catch(() => {});
      channelRef.current = null;
    }

    const channelName = `dm-chat-${conversationId}-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          try {
            const { data: sender, error } = await supabase
              .from("profile_public")
              .select("id, full_name, avatar_url")
              .eq("id", payload.new.sender_id)
              .single();

            if (error) {
              console.error("[DM] Error fetching sender:", error);
              queryClient.invalidateQueries({
                queryKey: dmKeys.messages(conversationId),
              });
              return;
            }

            const newMessage = {
              id: payload.new.id,
              body: payload.new.body,
              kind: payload.new.kind,
              created_at: payload.new.created_at,
              sender_id: payload.new.sender_id,
              cloudinary_url: payload.new.cloudinary_url,
              file_name: payload.new.file_name,
              sender,
            };

            queryClient.setQueryData(
              dmKeys.messages(conversationId),
              (old) => {
                if (!old) return [newMessage];
                if (old.some((msg) => msg.id === newMessage.id)) return old;
                return [...old, newMessage];
              },
            );
          } catch (err) {
            console.error("[DM] Subscription error:", err);
            queryClient.invalidateQueries({
              queryKey: dmKeys.messages(conversationId),
            });
          }
        },
      )
      .subscribe((status) => {
        console.log("[DM] Chat subscription status:", status);
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          // Retry: remove and resubscribe after a delay
          setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: dmKeys.messages(conversationId),
            });
          }, 2000);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current).catch(() => {});
        channelRef.current = null;
      }
    };
  }, [conversationId, queryClient]);

  return { conversationId, messages: messages || [], isLoading };
}

// Hook to send a DM message
export function useSendDM() {
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: ({
      conversationId,
      body,
      kind,
      cloudinaryUrl,
      cloudinaryPublicId,
      fileName,
      examId,
    }) =>
      dmAPI.sendMessage({
        conversationId,
        body,
        kind,
        cloudinaryUrl,
        cloudinaryPublicId,
        fileName,
        examId,
      }),
    onSuccess: (newMessage, { conversationId }) => {
      queryClient.setQueryData(dmKeys.messages(conversationId), (old) => {
        if (!old) return [newMessage];
        if (old.some((msg) => msg.id === newMessage.id)) return old;
        return [...old, newMessage];
      });

      // Play sound when DM is sent successfully
      playSound(SOUNDS.MESSAGE_SENT);
    },
  });

  return { sendMessage, isSending };
}

// Hook to get all conversations for current user (with unread counts)
// Pure data hook — no realtime subscription here. Use useDMRealtime() once in AppLayout.
export function useConversations() {
  const { user } = useUser();

  const { data: conversations, isLoading } = useQuery({
    queryKey: dmKeys.conversations(user?.id),
    queryFn: () => dmAPI.getConversations(),
    enabled: !!user?.id,
  });

  return { conversations: conversations || [], isLoading };
}

// Global realtime hook — call ONCE in AppLayout
// Handles: sidebar invalidation, notification sound, read state updates
export function useDMRealtime() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const channelRef = useRef(null);
  const subIdRef = useRef(0);

  useEffect(() => {
    if (!user?.id) return;

    // Increment subscription ID to make channel name unique per mount
    subIdRef.current += 1;
    const subId = subIdRef.current;

    // Clean up any previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current).catch(() => {});
      channelRef.current = null;
    }

    // Use unique channel name per subscription to avoid stale channel reuse
    const channelName = `dm-global-${user.id}-${subId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
        },
        (payload) => {
          // Refresh conversations list (sidebar, unread counts, etc.)
          queryClient.invalidateQueries({
            queryKey: dmKeys.conversations(user.id),
          });

          // Play notification sound for incoming messages from other users
          if (payload.new && payload.new.sender_id !== user.id) {
            playSound(SOUNDS.MESSAGE_GET);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "dm_read_state",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: dmKeys.conversations(user.id),
          });
        },
      )
      .subscribe((status) => {
        console.log("[DM] Global subscription status:", status);
        // If subscription fails, retry after a delay
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[DM] Global subscription failed, retrying...");
          setTimeout(() => {
            supabase.removeChannel(channel).catch(() => {});
            if (channelRef.current === channel) {
              channelRef.current = null;
            }
            // Trigger re-subscription by invalidating queries
            queryClient.invalidateQueries({
              queryKey: dmKeys.conversations(user.id),
            });
          }, 3000);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current).catch(() => {});
        channelRef.current = null;
      }
    };
  }, [user?.id, queryClient]);
}

// Hook to mark a conversation as read
export function useMarkAsRead() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const markAsRead = async (conversationId) => {
    if (!user?.id || !conversationId) return;

    await dmAPI.markAsRead(conversationId, user.id);

    // Invalidate conversations to refresh unread counts
    queryClient.invalidateQueries({ queryKey: dmKeys.conversations(user.id) });
  };

  return { markAsRead };
}

// Hook to delete a DM message
export function useDeleteDMMessage() {
  const queryClient = useQueryClient();

  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: ({ messageId }) => dmAPI.deleteMessage(messageId),
    onSuccess: (_, { conversationId, messageId }) => {
      queryClient.setQueryData(dmKeys.messages(conversationId), (old) => {
        if (!old) return [];
        return old.map((msg) =>
          msg.id === messageId
            ? { ...msg, deleted_at: new Date().toISOString() }
            : msg,
        );
      });
    },
  });

  return { deleteMessage, isDeleting };
}

// Hook to update a DM message
export function useUpdateDMMessage() {
  const queryClient = useQueryClient();

  const { mutate: updateMessage, isPending: isUpdating } = useMutation({
    mutationFn: ({ messageId, newBody }) =>
      dmAPI.updateMessage(messageId, newBody),
    onSuccess: (updatedMessage, { conversationId }) => {
      queryClient.setQueryData(dmKeys.messages(conversationId), (old) => {
        if (!old) return [];
        return old.map((msg) =>
          msg.id === updatedMessage.id
            ? {
                ...msg,
                body: updatedMessage.body,
                edited_at: updatedMessage.edited_at,
              }
            : msg,
        );
      });
    },
  });

  return { updateMessage, isUpdating };
}
