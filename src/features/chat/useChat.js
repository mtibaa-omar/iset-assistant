import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../services/supabase";
import { chatAPI } from "../../services/api/apiChat";
import { chatKeys } from "./chatKeys";
import { playSound, SOUNDS } from "../../utils/soundUtils";
import { useUser } from "../auth/useUser";

export function useMessages(programSubjectId) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: chatKeys.messages(programSubjectId),
    queryFn: () => chatAPI.getMessages(programSubjectId),
    enabled: !!programSubjectId,
  });

  useEffect(() => {
    if (!programSubjectId) return;

    const channelName = `subject-chat-${programSubjectId}-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "subject_messages",
          filter: `program_subject_id=eq.${programSubjectId}`,
        },
        async (payload) => {
          try {
            const { data: sender, error: senderError } = await supabase
              .from("profile_public")
              .select("id, full_name, avatar_url")
              .eq("id", payload.new.sender_id)
              .single();

            if (senderError) {
              console.error("[Chat] Error fetching sender:", senderError);
              queryClient.invalidateQueries({
                queryKey: chatKeys.messages(programSubjectId),
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
              exam_id: payload.new.exam_id,
              sender,
            };

            queryClient.setQueryData(
              chatKeys.messages(programSubjectId),
              (old) => {
                if (!old) return [newMessage];
                if (old.some((msg) => msg.id === newMessage.id)) return old;
                return [...old, newMessage];
              },
            );

            if (user && payload.new.sender_id !== user.id) {
              playSound(SOUNDS.MESSAGE_GET);
            }

            // Invalidate sidebar unread counts
            queryClient.invalidateQueries({
              queryKey: chatKeys.accessibleSubjectsWithUnread(),
            });
          } catch (err) {
            console.error("[Chat] Subscription error:", err);
            queryClient.invalidateQueries({
              queryKey: chatKeys.messages(programSubjectId),
            });
          }
        },
      )
      .subscribe((status) => {
        console.log("[Chat] Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel).catch(() => {});
    };
  }, [programSubjectId, queryClient, user]);

  return { messages: messages || [], isLoading, error };
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: ({ programSubjectId, body, kind, cloudinaryUrl, cloudinaryPublicId, fileName, examId }) =>
      chatAPI.sendMessage({
        programSubjectId,
        body,
        kind,
        cloudinaryUrl,
        cloudinaryPublicId,
        fileName,
        examId,
      }),
    onSuccess: (newMessage, { programSubjectId }) => {
      queryClient.setQueryData(chatKeys.messages(programSubjectId), (old) => {
        if (!old) return [newMessage];
        if (old.some((msg) => msg.id === newMessage.id)) return old;
        return [...old, newMessage];
      });

      playSound(SOUNDS.MESSAGE_SENT);
    },
  });

  return { sendMessage, isSending };
}

export function useSubjectInfo(programSubjectId) {
  const { data: subject, isLoading, error } = useQuery({
    queryKey: chatKeys.subject(programSubjectId),
    queryFn: () => chatAPI.getSubjectInfo(programSubjectId),
    enabled: !!programSubjectId,
  });

  return { subject, isLoading, error };
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const markAsRead = async (programSubjectId) => {
    if (!programSubjectId) return;
    
    await chatAPI.markAsRead(programSubjectId);
    
    queryClient.invalidateQueries({ queryKey: chatKeys.accessibleSubjectsWithUnread() });
  };

  return { markAsRead };
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: ({ messageId }) => chatAPI.deleteMessage(messageId),
    onSuccess: (_, { programSubjectId, messageId }) => {
      queryClient.setQueryData(chatKeys.messages(programSubjectId), (old) => {
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

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  const { mutate: updateMessage, isPending: isUpdating } = useMutation({
    mutationFn: ({ messageId, newBody }) => chatAPI.updateMessage(messageId, newBody),
    onSuccess: (updatedMessage, { programSubjectId }) => {
      queryClient.setQueryData(chatKeys.messages(programSubjectId), (old) => {
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
