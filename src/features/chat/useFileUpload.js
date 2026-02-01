import { useState, useRef, useCallback } from "react";
import { uploadToCloudinary } from "../../utils/cloudinary";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useFileUpload({ folder = "chat-files" } = {}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Seuls les fichiers PDF et images (JPEG, PNG, GIF, WebP) sont autorisés";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Le fichier ne doit pas dépasser 10 MB";
    }
    return null;
  }, []);

  const selectFile = useCallback((file) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return false;
    }
    setSelectedFile(file);
    return true;
  }, [validateFile]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      selectFile(file);
    }
  }, [selectFile]);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const uploadFile = useCallback(async (caption) => {
    if (!selectedFile) return null;

    setUploading(true);
    setError(null);

    try {
      const { url, publicId } = await uploadToCloudinary(selectedFile, folder);
      
      const result = {
        cloudinaryUrl: url,
        cloudinaryPublicId: publicId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        caption: caption || selectedFile.name,
      };

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de l'envoi du fichier";
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [selectedFile, folder]);

  return {
    selectedFile,
    uploading,
    error,
    fileInputRef,
    selectFile,
    handleFileChange,
    removeFile,
    openFilePicker,
    uploadFile,
  };
}
