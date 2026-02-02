import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Notebook, BookOpen, Users } from "lucide-react";
import { useAccessibleSubjectsWithUnread } from "../../features/chat/useSubjects";
import CollapsedSubjectsMenu from "./CollapsedSubjectsMenu";

export default function SubjectsSection({ collapsed, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const { data: subjects = [], isLoading } = useAccessibleSubjectsWithUnread();
  
  const unreadSubjects = subjects.filter(s => s.unread_count > 0);

  const handleSubjectClick = (subject) => {
    navigate(`/chat/${subject.id}`);
    onNavigate?.();
  };

  if (collapsed) {
    const totalUnread = unreadSubjects.reduce((sum, s) => sum + (s.unread_count || 0), 0);
    
    if (totalUnread === 0) return null;
    
    return (
      <div className="relative w-full">
        <button
          className={`relative flex items-center justify-center w-full p-3 transition-all rounded-xl ${
            isMenuOpen 
              ? "bg-slate-100 dark:bg-white/10 text-blue-600 dark:text-blue-400" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
          }`}
          title="Matières"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Notebook className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-sm">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        </button>

        <CollapsedSubjectsMenu 
          subjects={unreadSubjects}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  if (unreadSubjects.length === 0) return null;

  return (
    <div className="w-full">
       <div className="w-full px-1 my-2">
        <hr className="border-t border-slate-200 dark:border-white/10" />
      </div>
      <div className="space-y-0.5">
        {isLoading ? (
          <div className="px-3 py-2 text-xs text-slate-400">Chargement...</div>
        ) : (
          (isExpanded ? unreadSubjects : unreadSubjects.slice(0, 5)).map((subject) => {
            const isActive = location.pathname === `/chat/${subject.id}`;
            const unreadCount = subject.unread_count || 0;

            return (
              <button
                key={subject.id}
                onClick={() => handleSubjectClick(subject)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    subject.mode === 'cours' 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <Users className={`w-4 h-4 ${
                      subject.mode === 'cours'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-sm">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className={`text-sm truncate ${unreadCount > 0 ? "font-semibold" : "font-medium"}`}>
                    {subject.subject_name}
                  </div>
                  <div className="text-xs truncate text-slate-500 dark:text-slate-400">
                    {subject.mode === 'cours' ? 'Cours' : 'Atelier'} • {subject.semester}
                  </div>
                </div>
              </button>
            );
          })
        )}
        
        {unreadSubjects.length > 5 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-3 py-2 text-xs text-center transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {isExpanded ? "Voir moins" : `Voir toutes (${unreadSubjects.length})`}
          </button>
        )}
      </div>
    </div>
  );
}