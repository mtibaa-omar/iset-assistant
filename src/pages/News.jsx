import React, { useState } from "react";
import NewsGrid from "../features/news/NewsGrid";
import { Newspaper, Grid3X3, List } from "lucide-react";

export default function News() {
  const [viewMode, setViewMode] = useState("grid");
  return (
    <div className="min-h-full pb-8">
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
        <div className="flex items-center gap-1 p-1 border glass-light dark:glass-dark rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-primary-500 text-white shadow-md"
                : "text-secondary-light dark:text-secondary-dark hover:bg-white/50 dark:hover:bg-white/10"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-primary-500 text-white shadow-md"
                : "text-secondary-light dark:text-secondary-dark hover:bg-white/50 dark:hover:bg-white/10"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
      <NewsGrid articles={[]} loading={false} viewMode={viewMode} />
    </div>
  );
}
