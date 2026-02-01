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
      <div className={`relative border-2 rounded-2xl transition-all overflow-hidden
        ${selectedFile 
          ? "border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10" 
          : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
        }
        focus-within:border-purple-500 dark:focus-within:border-purple-500
        focus-within:ring-2 focus-within:ring-purple-500/20`}
      >
        {children}

        <textarea
          ref={inputRef}
          value={message}
          onChange={onMessageChange}
          onKeyDown={onKeyDown}
          placeholder={selectedFile ? "Ajouter un message..." : "Écrivez un message..."}
          disabled={disabled || uploading}
          rows={1}
          className="w-full px-4 py-2 overflow-y-auto bg-transparent resize-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
          style={{ minHeight: "24px" }}
        />
      </div>
    </div>
  );
}
