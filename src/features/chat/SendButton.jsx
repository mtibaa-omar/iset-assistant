import { Send } from "lucide-react";

export default function SendButton({ disabled, uploading, isSending }) {
  const isDisabled = disabled || uploading || isSending;
  
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:from-slate-400 disabled:to-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      title={uploading ? "Envoi en cours..." : "Envoyer"}
    >
      {isSending || uploading ? (
        <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
      ) : (
        <Send className="w-5 h-5" />
      )}
    </button>
  );
}
