import { useState } from "react";
import ImageModal from "./ImageModal";

export default function ImageMessage({ cloudinaryUrl, fileName, caption, isOwn }) {
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div>
        <div
          onClick={handleImageClick}
          className="relative cursor-pointer group"
        >
          <img
            src={cloudinaryUrl}
            alt={fileName || "Image"}
            className="object-contain w-auto h-auto max-w-full max-h-96 rounded-xl"
            loading="lazy"
          />
          
        </div>
        
        {caption && caption.trim() && caption !== fileName && (
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap break-words mt-2 px-1 ${
              isOwn ? "text-white/90" : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {caption}
          </p>
        )}
      </div>

      {showModal && (
        <ImageModal
          imageUrl={cloudinaryUrl}
          fileName={fileName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
