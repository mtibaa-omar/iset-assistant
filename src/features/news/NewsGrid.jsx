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
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
          <Newspaper className="w-10 h-10 text-purple-500 dark:text-purple-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-white">
          Aucune actualité trouvée
        </h3>
        <p className="max-w-md mb-6 text-center text-slate-500 dark:text-white/60">
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 2xl:grid-cols-4">
      {articles.map((article) => (
        <NewsCard key={article.id} {...article} variant="default" />
      ))}
    </div>
  );
}
