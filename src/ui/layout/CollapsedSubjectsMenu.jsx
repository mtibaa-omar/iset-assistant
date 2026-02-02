import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CollapsedSubjectsMenu({ subjects, isOpen, onClose, onNavigate }) {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSubjectClick = (subject) => {
    navigate(`/chat/${subject.id}`);
    onNavigate?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef} 
      className="absolute z-[100]"
      style={{ width: "300px" }}    >
      <div className="relative pt-2">
        <div className="ml-[74px] inline-block bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2.5 min-w-[200px]">
          <div className="absolute left-[-44px] -top-2 bottom-9 w-px bg-slate-200 dark:bg-white/10" aria-hidden="true"/>
          <ul className="relative space-y-1 max-h-[280px] overflow-y-auto pr-2 scrollbar-none -ml-14 pl-14" role="menu">
            {subjects.slice(0, 10).map((subject, index) => (
              <li key={subject.id} className="relative" role="none">
                <svg 
                  className="absolute left-[-54px] top-1/2 -translate-y-1/2 w-4 h-[40px] text-slate-200 dark:text-white/10 overflow-visible"
                  viewBox="0 0 24 40"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    d="M0 0 V0 H40" 
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <button
                  onClick={() => handleSubjectClick(subject)}
                  className="flex flex-col items-start w-full gap-0.5 p-2 transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 group text-left"
                  role="menuitem"
                  type="button"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate w-full">
                    {subject.subject_name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {subject.mode === 'cours' ? 'Cours' : 'Atelier'} • {subject.unread_count} msg
                  </span>
                </button>
              </li>
            ))}

            {subjects.length > 8 && (
              <li role="none">
                <button
                  onClick={() => {
                    navigate("/matieres");
                    onClose();
                  }}
                  className="w-full pt-1.5 text-[10px] font-medium text-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  role="menuitem"
                  type="button"
                >
                  +{subjects.length - 8} more
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
