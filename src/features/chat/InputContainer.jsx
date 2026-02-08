export default function InputContainer({ 
  selectedFile, 
  message, 
  disabled, 
  uploading,
  onMessageChange, 
  onKeyDown, 
  inputRef,
  children 
}) {
  return (
    <div className="flex-1 min-w-0">
      {children}

      <textarea
        ref={inputRef}
        value={message}
        onChange={onMessageChange}
        onKeyDown={onKeyDown}
        placeholder={selectedFile ? "Ajouter un message..." : "Tapez votre message..."}
        disabled={disabled || uploading}
        rows={1}
        className="w-full px-4 py-2 text-sm border-0 rounded-lg resize-none bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
