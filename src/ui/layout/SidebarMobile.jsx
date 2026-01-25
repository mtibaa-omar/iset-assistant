import { ChevronLeft, X } from "lucide-react";
import UserAvatar from "../components/UserAvatar";
import MenuItems from "./MenuItems";

export default function SidebarMobile({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 duration-300 bg-black/50 lg:hidden animate-in fade-in" onClick={onClose} />
      )}

      {isOpen && (
        <div className="fixed z-40 flex flex-col duration-300 ease-out border shadow-xl lg:hidden left-4 top-4 bottom-4 w-72 bg-white/50 dark:bg-black/30 border-white/50 dark:border-white/10 rounded-2xl backdrop-blur-md animate-in slide-in-from-left fade-in">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
            <UserAvatar collapsed={false} />
            <button onClick={onClose} className="p-2 transition-all rounded-full bg-slate-100/50 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20" aria-label="Close menu">
              <ChevronLeft className="text-slate-700 dark:text-white" size={20} />
            </button>
          </div>

          <div className="flex flex-col flex-1 py-4 overflow-y-auto">
            <div className="flex flex-col items-start gap-1 px-3">
              <MenuItems collapsed={false} onNavigate={onClose} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
