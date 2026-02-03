import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useConversations } from "../features/dm/useDM";
import { useUser } from "../features/auth/useUser";
import ConversationsSidebar from "../features/inbox/ConversationsSidebar";
import ConversationView from "../features/inbox/ConversationView";
import EmptyState from "../features/inbox/EmptyState";
import { useInboxConversation } from "../features/inbox/useInbox";
import Confirm from "../ui/components/Confirm";

export default function Inbox() {
  const { conversationId: urlConversationId } = useParams();
  const { user } = useUser();
  const { conversations, isLoading: isLoadingConversations } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const targetUser = selectedConversation && user
    ? selectedConversation.user1.id === user.id
      ? selectedConversation.user2
      : selectedConversation.user1
    : null;

  const {
    conversationId,
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
  } = useInboxConversation(targetUser, selectedConversation?.id);

  useEffect(() => {
    if (urlConversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === urlConversationId);
      if (conv) {
        setSelectedConversation(conv);
        setShowSidebar(false);
      }
    }
  }, [urlConversationId, conversations]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setShowSidebar(false);
  };

  const handleBack = () => {
    setShowSidebar(true);
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-[calc(100vh-2.1rem)] -m-4 md:-m-6 overflow-hidden">
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-72 2xl:w-80 flex-shrink-0 transition-[width] duration-300`}>
        <ConversationsSidebar
          conversations={conversations}
          activeConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          currentUserId={user?.id}
          isLoading={isLoadingConversations}
        />
      </div>

      <div className={`${!showSidebar ? 'block' : 'hidden'} md:block flex-1`}>
        {selectedConversation && targetUser ? (
          <ConversationView
            targetUser={targetUser}
            conversationId={conversationId}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
            isSending={isSending}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
            editingMessage={editingMessage}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onBack={handleBack}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <Confirm
        isOpen={!!messageToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        variant="delete"
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
