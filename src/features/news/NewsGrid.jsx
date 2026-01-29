import React from "react";
import NewsCard from "./NewsCard";
import { Newspaper, RefreshCw } from "lucide-react";

export default function NewsGrid({
  articles,
  loading = false,
  viewMode = "grid",
}) {
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-6">
          <Newspaper className="w-10 h-10 text-purple-500 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          Aucune actualité trouvée
        </h3>
        <p className="text-slate-500 dark:text-white/60 text-center max-w-md mb-6">
          Il n'y a pas d'actualités correspondant à vos critères de recherche.
          Essayez de modifier vos filtres ou revenez plus tard.
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors font-medium">
          <RefreshCw className="w-4 h-4" />
          Réinitialiser les filtres
        </button>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {articles.map((article) => (
          <NewsCard key={article.id} {...article} variant="horizontal" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.id} {...article} variant="default" />
      ))}
    </div>
  );
}
