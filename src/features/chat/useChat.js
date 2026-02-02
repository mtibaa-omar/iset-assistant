import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../services/supabase";
import { chatAPI } from "../../services/api/apiChat";
import { chatKeys } from "./chatKeys";

export function useMessages(programSubjectId) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: chatKeys.messages(programSubjectId),
    queryFn: () => chatAPI.getMessages(programSubjectId),
    enabled: !!programSubjectId,
  });

  useEffect(() => {
    if (!programSubjectId) return;
    
    const channel = chatAPI.subscribeToMessages(programSubjectId, (newMessage) => {
      queryClient.setQueryData(chatKeys.messages(programSubjectId), (old) => {
        if (!old) return [newMessage];
        if (old.some((msg) => msg.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [programSubjectId, queryClient]);

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
