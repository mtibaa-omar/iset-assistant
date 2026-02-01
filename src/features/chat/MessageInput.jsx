import { useState, useRef, useEffect } from "react";
import InputFileButton from "./InputFileButton";
import InputFilePreview from "./InputFilePreview";
import InputContainer from "./InputContainer";
import SendButton from "./SendButton";
import { useFileUpload } from "./useFileUpload";

export default function MessageInput({ onSend, onSendFile, isSending, disabled }) {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const {
    selectedFile,
    uploading,
    error,
    selectFile,
    removeFile,
    uploadFile,
  } = useFileUpload();

  useEffect(() => {
    if (!disabled && !isSending && !uploading) {
      inputRef.current?.focus();
    }
  }, [disabled, isSending, uploading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending || disabled || uploading) return;

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
      <div className="flex items-center gap-2 p-3">
        <InputFileButton
          onFileSelect={selectFile}
          disabled={disabled || isSending || uploading}
        />

        <InputContainer
          selectedFile={selectedFile}
          message={message}
          disabled={disabled}
          uploading={uploading}
          onMessageChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        >
          <InputFilePreview
            file={selectedFile}
            onRemove={removeFile}
            disabled={uploading}
          />
        </InputContainer>

        <SendButton
          disabled={isSubmitDisabled}
          uploading={uploading}
          isSending={isSending}
        />
      </div>

      {error && (
        <p className="px-5 pb-2 text-xs text-red-500">{error}</p>
      )}
    </form>
  );
}
