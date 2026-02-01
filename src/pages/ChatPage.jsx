import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useMessages, useSendMessage, useSubjectInfo, useMarkAsRead } from "../features/chat/useChat";
import ChatHeader from "../features/chat/ChatHeader";
import MessageBubble from "../features/chat/MessageBubble";
import MessageInput from "../features/chat/MessageInput";
import Spinner from "../ui/components/Spinner";

export default function ChatPage() {
  const { subjectId } = useParams();
  const messagesEndRef = useRef(null);

  const { subject, isLoading: isLoadingSubject } = useSubjectInfo(subjectId);
  const { messages, isLoading: isLoadingMessages } = useMessages(subjectId);
  const { sendMessage, isSending } = useSendMessage();
  const { markAsRead } = useMarkAsRead();

  useEffect(() => {
    if (subjectId) {
      markAsRead(subjectId);
    }
  }, [subjectId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (body) => {
    sendMessage({ programSubjectId: subjectId, body });
  };

  const handleSendFile = async (uploadResult) => {
    await sendMessage({
      programSubjectId: subjectId,
      body: uploadResult.caption,
      kind: "file",
      cloudinaryUrl: uploadResult.cloudinaryUrl,
      cloudinaryPublicId: uploadResult.cloudinaryPublicId,
      fileName: uploadResult.fileName,
    });
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100%+2rem)] md:h-[calc(100%+3rem)] -m-4 overflow-hidden md:-m-6 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <ChatHeader subject={subject} isLoading={isLoadingSubject} />

      <div className="flex-1 py-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
              <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              Aucun message
            </h3>
            <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Soyez le premier à démarrer la discussion ! Partagez vos questions ou ressources avec vos camarades.
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
        onSendFile={handleSendFile}
        isSending={isSending}
        disabled={!subjectId}
      />
    </div>
  );
}
