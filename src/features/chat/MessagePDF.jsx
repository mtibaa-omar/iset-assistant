import { FileText, Download, ExternalLink } from "lucide-react";

export default function PDFMessage({ cloudinaryUrl, fileName, isOwn }) {
  const handleFileDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cloudinaryUrl) return;

    try {
      const response = await fetch(cloudinaryUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        isOwn
          ? "bg-white/10 hover:bg-white/20"
          : "bg-slate-50 dark:bg-zinc-700/50 hover:bg-slate-100 dark:hover:bg-zinc-700"
      }`}
      onClick={handleFileDownload}
    >
      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 shadow-sm bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
        <FileText className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate ${
            isOwn ? "text-white" : "text-slate-900 dark:text-white"
          }`}
        >
          {fileName || "Document.pdf"}
        </p>
        <p
          className={`text-xs ${
            isOwn ? "text-white/70" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          PDF • Cliquez pour télécharger
        </p>
      </div>

      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
          isOwn
            ? "bg-white/20 text-white"
            : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        }`}
      >
        <Download className="w-4 h-4" />
      </div>
    </div>
  );
}
