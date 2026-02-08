import { useState, useRef, useEffect } from "react";
import InputFileButton from "./InputFileButton";
import InputFilePreview from "./InputFilePreview";
import InputContainer from "./InputContainer";
import SendButton from "./SendButton";
import { useFileUpload } from "./useFileUpload";
import { X } from "lucide-react";

export default function MessageInput({ onSend, onSendFile, isSending, disabled, editingMessage, onCancelEdit, onSaveEdit }) {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const prevEditingIdRef = useRef(null);

  const {
    selectedFile,
    uploading,
    error,
    selectFile,
    removeFile,
    uploadFile,
  } = useFileUpload();

  useEffect(() => {
    const currentEditingId = editingMessage?.id;
    
    if (currentEditingId && currentEditingId !== prevEditingIdRef.current) {
      setMessage(editingMessage.body);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else if (!currentEditingId && prevEditingIdRef.current) {
      setMessage("");
    }
    
    prevEditingIdRef.current = currentEditingId;
  }, [editingMessage]);

  useEffect(() => {
    if (!disabled && !isSending && !uploading) {
      inputRef.current?.focus();
    }
  }, [disabled, isSending, uploading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending || disabled || uploading) return;

    if (editingMessage) {
      if (message.trim()) {
        onSaveEdit(message.trim());
        setMessage("");
      }
      return;
    }

    if (selectedFile) {
      await handleFileUpload();
    } else {
      handleTextMessage();
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await uploadFile(message.trim() || selectedFile.name);
      if (result && onSendFile) {
        await onSendFile(result);
      }
      setMessage("");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleTextMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isSubmitDisabled = (!message.trim() && !selectedFile) || isSending || disabled || uploading;

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t dark:bg-zinc-900 border-slate-200 dark:border-zinc-700">
      {editingMessage && (
        <div className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 border-b border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <span className="text-xs text-blue-700 md:text-sm dark:text-blue-300">
            Modification du message...
          </span>
          <button
            type="button"
            onClick={() => {
              onCancelEdit();
              setMessage("");
            }}
            className="p-0.5 md:p-1 transition-colors rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-700 dark:text-blue-300" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3">
        {!editingMessage && (
          <InputFileButton
            onFileSelect={selectFile}
            disabled={disabled || isSending || uploading}
          />
        )}

        <InputContainer
          selectedFile={selectedFile}
          message={message}
          disabled={disabled}
          uploading={uploading}
          onMessageChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        >
          {!editingMessage && (
            <InputFilePreview
              file={selectedFile}
              onRemove={removeFile}
              disabled={uploading}
            />
          )}
        </InputContainer>

        <SendButton
          disabled={isSubmitDisabled}
          uploading={uploading}
          isSending={isSending}
        />
      </div>

      {error && (
        <p className="px-3 md:px-5 pb-1.5 md:pb-2 text-[10px] md:text-xs text-red-500">{error}</p>
      )}
    </form>
  );
}
