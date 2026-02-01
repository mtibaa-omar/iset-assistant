import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, AlertCircle } from "lucide-react";
import { useUserByUsername, useDMConversation, useSendDM, useMarkAsRead } from "../features/dm/useDM";
import { useUser } from "../features/auth/useUser";
import MessageBubble from "../features/chat/MessageBubble";
import MessageInput from "../features/chat/MessageInput";
import Button from "../ui/components/Button";
import Spinner from "../ui/components/Spinner";

export default function DMPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  const { targetUser, isLoading: isLoadingUser, error: userError } = useUserByUsername(username);

  const { conversationId, messages, isLoading: isLoadingMessages } = useDMConversation(targetUser?.id);

  const { sendMessage, isSending } = useSendDM();

  const { markAsRead } = useMarkAsRead();

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [conversationId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (body) => {
    if (!conversationId) return;
    sendMessage({ conversationId, body });
  };
  const handleSendFile = async (uploadResult) => {
    if (!conversationId) return;
    await sendMessage({
      conversationId,
      body: uploadResult.caption,
      kind: "file",
      cloudinaryUrl: uploadResult.cloudinaryUrl,
      cloudinaryPublicId: uploadResult.cloudinaryPublicId,
      fileName: uploadResult.fileName,
    });
  };
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (userError || !targetUser) {
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
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>
    );
  }

  if (targetUser.id === user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800">
          <MessageSquare className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Oops !
        </h3>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Vous ne pouvez pas vous envoyer un message à vous-même.
        </p>
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100%+2rem)] md:h-[calc(100%+3rem)] -m-4 md:-m-6 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
          className="!p-2"
        />

        <img
          src={targetUser.avatar_url || "/image.png"}
          alt={targetUser.full_name}
          className="object-cover w-10 h-10 border-2 border-white rounded-full dark:border-zinc-700"
        />

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate text-slate-900 dark:text-white">
            {targetUser.full_name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            @{username}
          </p>
        </div>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
              <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              Commencez la conversation
            </h3>
            <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Envoyez un message à {targetUser.full_name} pour démarrer la discussion.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSendMessage}
        isSending={isSending}
        onSendFile={handleSendFile}
        disabled={!conversationId}
      />
    </div>
  );
}
