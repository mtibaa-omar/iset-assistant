import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Confirm } from "../../ui/components/Confirm";

import { CATEGORY_COLORS } from "../../styles/newsConstants";

export default function NewsTableRow({ item, onEdit, onDelete, isDeleting }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    setIsConfirmOpen(false);
  };

  const categoryColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.default;

  return (
    <>
      <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{item.title}</td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColor}`}>
            {item.category}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
          {new Date(item.created_at).toLocaleDateString('fr-FR')}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      <Confirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="delete"
        title="Supprimer l'actualité ?"
        message="Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </>
  );
}
