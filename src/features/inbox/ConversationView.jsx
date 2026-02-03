import { useEffect, useRef } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import MessageBubble from "../chat/MessageBubble";
import MessageInput from "../chat/MessageInput";
import Button from "../../ui/components/Button";
import Spinner from "../../ui/components/Spinner";

export default function ConversationView({ 
  targetUser, 
  conversationId, 
  messages, 
  isLoadingMessages, 
  onSendMessage, 
  onSendFile, 
  isSending, 
  onDeleteMessage, 
  onEditMessage, 
  editingMessage, 
  onCancelEdit, 
  onSaveEdit, 
  onBack 
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={onBack}
          className="!p-2 md:hidden"
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
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Online</span>
          </div>
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
              <MessageBubble
                key={message.id}
                message={message}
                onDelete={onDeleteMessage}
                onEdit={onEditMessage}
                isEditing={editingMessage?.id === message.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput
        onSend={onSendMessage}
        onSendFile={onSendFile}
        isSending={isSending}
        disabled={!conversationId}
        editingMessage={editingMessage}
        onCancelEdit={onCancelEdit}
        onSaveEdit={onSaveEdit}
      />
    </div>
  );
}
