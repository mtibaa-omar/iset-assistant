import React from "react";
import { Clock, ArrowUpRight, Bookmark, Share2, Eye } from "lucide-react";

export default function NewsCard({
  title,
  excerpt,
  image,
  category,
  date,
  readTime,
  author,
  views,
  isBookmarked = false,
  variant = "default",
}) {
  const categoryColors = {
    Événements: "from-purple-500 to-pink-500",
    Académique: "from-blue-500 to-cyan-500",
    Sport: "from-green-500 to-emerald-500",
    Culture: "from-orange-500 to-amber-500",
    Annonces: "from-red-500 to-rose-500",
    default: "from-slate-500 to-slate-600",
  };

  const gradientColor = categoryColors[category] || categoryColors.default;

  if (variant === "horizontal") {
    return (
      <article className="group relative flex flex-col sm:flex-row gap-4 p-4 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 hover:-translate-y-0.5">
        <div className="relative w-full sm:w-48 h-32 sm:h-full min-h-[8rem] flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-20 group-hover:opacity-30 transition-opacity`}
          />
          <span
            className={`absolute top-2 left-2 px-2.5 py-1 text-xs font-semibold text-white bg-gradient-to-r ${gradientColor} rounded-full shadow-lg`}
          >
            {category}
          </span>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-white/60 line-clamp-2">
            {excerpt}
          </p>
          <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-white/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
              {views && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {views}
                </span>
              )}
            </div>
            <span>{date}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowUpRight className="w-5 h-5 text-purple-500 dark:text-purple-400" />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex items-center gap-3 p-3 bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/40 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-500/30 transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/10 cursor-pointer">
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-20`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
            {title}
          </h4>
          <span className="text-xs text-slate-500 dark:text-white/50">
            {date}
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-10 group-hover:opacity-20 transition-opacity`}
        />

        <span
          className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r ${gradientColor} rounded-full shadow-lg backdrop-blur-sm`}
        >
          {category}
        </span>
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${isBookmarked ? "bg-purple-500 text-white" : "bg-white/80 dark:bg-black/50 text-slate-700 dark:text-white hover:bg-purple-500 hover:text-white"}`}
          >
            <Bookmark
              className="w-4 h-4"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
          <button className="p-2 bg-white/80 dark:bg-black/50 rounded-full backdrop-blur-md text-slate-700 dark:text-white hover:bg-purple-500 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {author && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md object-cover"
            />
            <span className="text-sm font-medium text-white drop-shadow-md">
              {author.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/60 line-clamp-3 flex-1">
          {excerpt}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-sm text-slate-500 dark:text-white/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
            {views && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {views}
              </span>
            )}
          </div>
          <span className="text-xs">{date}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </article>
  );
}
