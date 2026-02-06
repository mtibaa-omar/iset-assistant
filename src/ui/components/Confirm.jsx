import { Unlock, AlertTriangle } from "lucide-react";
import Spinner from "./Spinner";
import Modal from "./Modal";

const ICON_SIZES = {
  sm: { wrapper: "w-8 h-8", icon: "w-4 h-4" },
  md: { wrapper: "w-12 h-12", icon: "w-6 h-6" },
  lg: { wrapper: "w-16 h-16", icon: "w-8 h-8" },
};

const VARIANTS = {
  default: {
    icon: Unlock,
    iconColor: "blue",
    confirmBgColor: "bg-blue-600 hover:bg-blue-700",
    loadingText: "Loading...",
  },
  delete: {
    icon: AlertTriangle,
    iconColor: "red",
    confirmBgColor: "bg-red-600 hover:bg-red-700",
    title: "Confirm Deletion",
    message:
      "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText: "Supprimer",
    loadingText: "Deleting...",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "amber",
    confirmBgColor: "bg-amber-600 hover:bg-amber-700",
    loadingText: "Loading...",
  },
  success: {
    icon: Unlock,
    iconColor: "green",
    confirmBgColor: "bg-green-600 hover:bg-green-700",
    loadingText: "Loading...",
  },
};

export default function Confirm({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  variant = "default",
  title,
  message,
  confirmText,
  cancelText = "Annuler",
  icon,
  iconColor,
  confirmBgColor,
  loadingText,
}) {
  const variantConfig = VARIANTS[variant] || VARIANTS.default;

  const FinalIcon = icon || variantConfig.icon;
  const finalIconColor = iconColor || variantConfig.iconColor;
  const finalConfirmBgColor = confirmBgColor || variantConfig.confirmBgColor;
  const finalTitle = title || variantConfig.title || "Confirm";
  const finalMessage =
    message || variantConfig.message || "Are you sure you want to continue?";
  const finalConfirmText =
    confirmText || variantConfig.confirmText || "Confirm";
  const finalLoadingText = loadingText || variantConfig.loadingText;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showHeader={false} maxWidth="max-w-md">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`${ICON_SIZES.md.wrapper} rounded-full flex items-center justify-center shrink-0 bg-${finalIconColor}-100 dark:bg-${finalIconColor}-900/20`}
          >
            <FinalIcon className={`${ICON_SIZES.md.icon} text-${finalIconColor}-600 dark:text-${finalIconColor}-400`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{finalTitle}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{finalMessage}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            disabled={isLoading}
            onClick={handleConfirm}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${finalConfirmBgColor}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4">
                  <Spinner />
                </div>
                {finalLoadingText}
              </>
            ) : (
              finalConfirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export { Confirm };
