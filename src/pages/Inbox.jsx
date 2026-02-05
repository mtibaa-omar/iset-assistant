import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConversations, useUserByUsername } from "../features/dm/useDM";
import { useUser } from "../features/auth/useUser";
import { useOnlinePresence } from "../features/dm/useOnlinePresence";
import ConversationsSidebar from "../features/inbox/ConversationsSidebar";
import ConversationView from "../features/inbox/ConversationView";
import EmptyState from "../features/inbox/EmptyState";
import { useInboxConversation } from "../features/inbox/useInbox";
import Confirm from "../ui/components/Confirm";
import Spinner from "../ui/components/Spinner";
import Button from "../ui/components/Button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function Inbox() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { isOnline } = useOnlinePresence();
  const { conversations, isLoading: isLoadingConversations } = useConversations();
  const [manuallySelectedConversation, setManuallySelectedConversation] = useState(null);
  const { targetUser: userByUsername, isLoading: isLoadingUser, error: userError } = useUserByUsername(username);

  const conversationFromUrl = username && conversations.length > 0 && userByUsername
    ? conversations.find(c => {
        const otherUser = c.user1.id === user?.id ? c.user2 : c.user1;
        return otherUser.id === userByUsername.id;
      })
    : null;

  const selectedConversation = username ? conversationFromUrl : manuallySelectedConversation;
  
  const showSidebar = !username && !manuallySelectedConversation;

  const targetUser = selectedConversation && user
    ? selectedConversation.user1.id === user.id
      ? selectedConversation.user2
      : selectedConversation.user1
    : userByUsername;

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

  const handleSelectConversation = (conv) => {
    const otherUser = conv.user1.id === user?.id ? conv.user2 : conv.user1;
    const username = otherUser.full_name.toLowerCase().replace(/\s+/g, '_');
    navigate(`/messages/${username}`);
  };

  const handleBack = () => {
    navigate('/messages');
  };

  if (username && isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (username && (userError || !userByUsername)) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full dark:bg-red-900/30">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Utilisateur introuvable
        </h3>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          L'utilisateur @{username} n'existe pas.
        </p>
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate("/messages")}>
          Retour aux messages
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden md:flex-row">
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-72 2xl:w-80 flex-shrink-0 transition-[width] duration-300`}>
        <ConversationsSidebar
          conversations={conversations}
          activeConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          currentUserId={user?.id}
          isLoading={isLoadingConversations}
          isOnline={isOnline}
        />
      </div>

      <div className={`${!showSidebar ? 'fixed inset-0 z-[60] bg-white dark:bg-zinc-900 md:relative md:z-auto' : 'hidden'} md:block md:flex-1`}>
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
            isOnline={isOnline(targetUser?.id)}
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
