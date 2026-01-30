import { Edit2, Trash2 } from "lucide-react";


export default function ActionsCellRenderer({ data, context }) {
  const { onEdit, onDelete, isDeleting } = context;

  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <button
        onClick={() => onEdit(data)}
        className="p-1.5 text-purple-600 transition-colors rounded hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
        title="Modifier"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(data.id)}
        disabled={isDeleting}
        className="p-1.5 text-red-600 transition-colors rounded hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
