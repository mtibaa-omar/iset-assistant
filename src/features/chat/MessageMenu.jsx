import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Trash2, Edit2 } from "lucide-react";

export default function MessageMenu({ onDelete, onEdit, isOwn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = menuRef.current?.offsetHeight || 96;
    const gap = 8;
    const padding = 12;
    const spaceAbove = buttonRect.top - padding;
    const spaceBelow = window.innerHeight - buttonRect.bottom - padding;
    const opensDown = spaceAbove < menuHeight + gap && spaceBelow > spaceAbove;

    const top = opensDown
      ? Math.min(buttonRect.bottom + gap, window.innerHeight - menuHeight - padding)
      : Math.max(padding, buttonRect.top - menuHeight - gap);
    const maxLeft = Math.max(padding, window.innerWidth - menuWidth - padding);
    const left = Math.min(Math.max(padding, buttonRect.right - menuWidth), maxLeft);

    setMenuPosition({ top, left });
  }, []);

  const toggleMenu = () => {
    if (!isOpen) {
      updateMenuPosition();
    }
    setIsOpen((open) => !open);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedButton = buttonRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedButton && !clickedMenu) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();
    const scrollContainer = buttonRef.current?.closest("[data-chat-messages]");

    window.addEventListener("resize", updateMenuPosition);
    scrollContainer?.addEventListener("scroll", updateMenuPosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      scrollContainer?.removeEventListener("scroll", updateMenuPosition);
    };
  }, [isOpen, updateMenuPosition]);

  if (!isOwn) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1.5 transition-colors rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-zinc-700"
        title="Options"
      >
        <MoreVertical className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[1200] min-w-[160px] overflow-hidden bg-white border rounded-lg shadow-lg dark:bg-zinc-800 border-slate-200 dark:border-zinc-700"
          style={{
            top: menuPosition?.top ?? 0,
            left: menuPosition?.left ?? 0,
            visibility: menuPosition ? "visible" : "hidden",
          }}
        >
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-t-lg"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
