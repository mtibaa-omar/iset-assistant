import React, { useState } from "react";
import NewsGrid from "../features/news/NewsGrid";
import { useNews } from "../features/news/useNews";
import { Newspaper, Grid3X3, List } from "lucide-react";
import Spinner from "../ui/components/Spinner";

export default function News() {
  const [viewMode, setViewMode] = useState("grid");
  const { news, isLoading } = useNews();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="min-h-full md:pl-4 lg:pl-8">
      <div className="pr-16 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl text-slate-800 dark:text-white">
              Actualités
            </h1>
            <p className="text-sm text-slate-500 dark:text-white/60">
              Restez informé des dernières nouvelles de l'ISET
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-1 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
      <NewsGrid articles={news} loading={isLoading} viewMode={viewMode} />
    </div>
  );
}
