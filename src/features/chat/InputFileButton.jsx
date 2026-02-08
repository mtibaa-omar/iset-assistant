import { useState, useRef, useEffect } from "react";
import { Paperclip, FileText, Image } from "lucide-react";

export default function FileUploadButton({ onFileSelect, disabled }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setShowMenu(false);
    }
  };

  const handleTypeSelect = (type) => {
    if (type === 'pdf') {
      pdfInputRef.current?.click();
    } else if (type === 'image') {
      imageInputRef.current?.click();
    }
  };

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled}
        className="flex items-center justify-center flex-shrink-0 w-10 h-10 transition-colors rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Joindre un fichier"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      {showMenu && (
        <div className="absolute left-0 z-50 w-48 mb-2 overflow-hidden duration-200 bg-white border shadow-xl bottom-full dark:bg-zinc-800 rounded-xl border-slate-200 dark:border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
          <button
            type="button"
            onClick={() => handleTypeSelect('image')}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm transition-colors text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Image className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Image</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTypeSelect('pdf')}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm transition-colors text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
