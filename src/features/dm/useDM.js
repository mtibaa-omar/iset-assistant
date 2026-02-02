import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { dmAPI } from "../../services/api/apiDM";
import { dmKeys } from "./dmKeys";
import { useUser } from "../auth/useUser";

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
  const { data: targetUser, isLoading, error } = useQuery({
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

  // Get or create conversation
  useEffect(() => {
    if (!user?.id || !targetUserId || user.id === targetUserId) return;

    const initConversation = async () => {
      try {
        const conv = await dmAPI.getOrCreateConversation(targetUserId);
        setConversationId(conv.id);
      } catch (err) {
        console.error("[DM] Error getting conversation:", err);
      }
    };

    initConversation();
  }, [user?.id, targetUserId]);

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: dmKeys.messages(conversationId),
    queryFn: () => dmAPI.getMessages(conversationId),
    enabled: !!conversationId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = dmAPI.subscribeToMessages(conversationId, (newMessage) => {
      queryClient.setQueryData(dmKeys.messages(conversationId), (old) => {
        if (!old) return [newMessage];
        if (old.some((msg) => msg.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return { conversationId, messages: messages || [], isLoading };
}

// Hook to send a DM message
export function useSendDM() {
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: ({ conversationId, body, kind, cloudinaryUrl, cloudinaryPublicId, fileName, examId }) =>
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
    },
  });

  return { sendMessage, isSending };
}

// Hook to get all conversations for current user (with unread counts)
export function useConversations() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading, refetch } = useQuery({
    queryKey: dmKeys.conversations(user?.id),
    queryFn: () => dmAPI.getConversations(),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id) return;

    console.log("[DM] Setting up real-time subscription for user:", user.id);

    const channelName = `dm-conversations-${user.id}-${Date.now()}`;
    const messagesChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
        },
        (payload) => {
          console.log("[DM] New message detected:", payload);
          // Refetch conversations to update unread counts
          queryClient.invalidateQueries({ queryKey: dmKeys.conversations(user.id) });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "dm_read_state",
        },
        (payload) => {
          console.log("[DM] Read state changed:", payload);
          queryClient.invalidateQueries({ queryKey: dmKeys.conversations(user.id) });
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("[DM] Subscription error:", err);
        } else {
          console.log("[DM] Subscription status:", status);
        }
      });

    return () => {
      console.log("[DM] Cleaning up subscription");
      messagesChannel.unsubscribe();
    };
  }, [user?.id, queryClient]);

  return { conversations: conversations || [], isLoading, refetch };
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
            : msg
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
    mutationFn: ({ messageId, newBody }) => dmAPI.updateMessage(messageId, newBody),
    onSuccess: (updatedMessage, { conversationId }) => {
      queryClient.setQueryData(dmKeys.messages(conversationId), (old) => {
        if (!old) return [];
        return old.map((msg) => 
          msg.id === updatedMessage.id 
            ? { ...msg, body: updatedMessage.body, edited_at: updatedMessage.edited_at } 
            : msg
        );
      });
    },
  });

  return { updateMessage, isUpdating };
}
