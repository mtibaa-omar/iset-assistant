import { useState, useEffect } from "react";
import { useDMConversation, useSendDM, useMarkAsRead, useDeleteDMMessage, useUpdateDMMessage } from "../dm/useDM";

export function useInboxConversation(targetUser, conversationId) {
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const { conversationId: activeConversationId, messages, isLoading: isLoadingMessages } = useDMConversation(targetUser?.id);
  const { sendMessage, isSending } = useSendDM();
  const { markAsRead } = useMarkAsRead();
  const { deleteMessage } = useDeleteDMMessage();
  const { updateMessage } = useUpdateDMMessage();

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [conversationId, markAsRead]);

  const handleSendMessage = (body) => {
    if (!activeConversationId) return;
    sendMessage({ conversationId: activeConversationId, body });
  };

  const handleSendFile = async (uploadResult) => {
    if (!activeConversationId) return;
    await sendMessage({
      conversationId: activeConversationId,
      body: uploadResult.caption,
      kind: "file",
      cloudinaryUrl: uploadResult.cloudinaryUrl,
      cloudinaryPublicId: uploadResult.cloudinaryPublicId,
      fileName: uploadResult.fileName,
    });
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
  };

  const confirmDelete = () => {
    if (messageToDelete && activeConversationId) {
      deleteMessage({ messageId: messageToDelete, conversationId: activeConversationId });
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setMessageToDelete(null);
  };

  const handleEditMessage = (messageId, currentBody) => {
    setEditingMessage({ id: messageId, body: currentBody });
  };

  const handleSaveEdit = (newBody) => {
    if (editingMessage && newBody.trim() && activeConversationId) {
      updateMessage({ 
        messageId: editingMessage.id, 
        newBody: newBody.trim(), 
        conversationId: activeConversationId 
      });
      setEditingMessage(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  return {
    conversationId: activeConversationId,
    messages,
    isLoadingMessages,
    isSending,
    editingMessage,
    messageToDelete,
    handleSendMessage,
    handleSendFile,
    handleDeleteMessage,
    handleEditMessage,
    handleSaveEdit,
    handleCancelEdit,
    confirmDelete,
    cancelDelete,
  };
}
