import { X } from "lucide-react";
import { useEffect } from "react";

export default function ImageModal({ imageUrl, fileName, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center duration-200 bg-black/90 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute z-10 p-2 text-white transition-colors rounded-full top-4 right-4 bg-black/50 hover:bg-black/70"
        title="Fermer (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="relative max-w-[95vw] max-h-[95vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={fileName || "Image"}
          className="max-w-full max-h-[90vh] w-auto h-auto rounded-lg shadow-2xl object-contain"
        /> 
      </div>
    </div>
  );
}
