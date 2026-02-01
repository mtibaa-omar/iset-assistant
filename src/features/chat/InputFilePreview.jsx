import { X, FileText } from "lucide-react";

export default function FilePreview({ file, onRemove, disabled }) {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  return (
    <div className="flex items-center gap-2 p-2 m-2 mb-0 bg-white border rounded-xl dark:bg-zinc-800 border-slate-200 dark:border-zinc-700">
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="flex-shrink-0 object-cover w-10 h-10 rounded-lg"
        />
      ) : isPDF ? (
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg shadow-sm bg-gradient-to-br from-red-500 to-red-600">
          <FileText className="w-5 h-5 text-white" />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
          <FileText className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-slate-900 dark:text-white">
          {file.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {(file.size / 1024).toFixed(0)} KB • {isImage ? 'Image' : 'PDF'}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors disabled:opacity-50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
