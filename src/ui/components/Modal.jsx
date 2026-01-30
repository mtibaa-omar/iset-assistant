import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  showHeader = true,
}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full ${maxWidth} mx-4 max-h-[90vh] flex flex-col`}
          >
            {showHeader && (
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
