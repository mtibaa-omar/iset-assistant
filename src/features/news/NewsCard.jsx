import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowUpRight, Eye } from "lucide-react";
import { CATEGORY_COLORS_GRADIENT } from "../../styles/newsConstants";
import { formatFullDate } from "../../utils/dateUtils";

export default function NewsCard({
  id,
  title,
  content,
  image_url,
  category,
  published_at,
  views_count = 0,
  author_name,
  author_avatar_url,
  variant = "default",
}) {
  const navigate = useNavigate();
  const gradientColor = CATEGORY_COLORS_GRADIENT[category] || CATEGORY_COLORS_GRADIENT.default;
  
  const handleClick = () => {
    navigate(`/actualites/${id}`);
  };
  
  const excerpt = content ? content.substring(0, 120) + (content.length > 120 ? "..." : "") : "";
  
  const date = formatFullDate(published_at);
  
  const author = author_name || "ISET";

  if (variant === "horizontal") {
    return (
      <article onClick={handleClick} className="group relative flex flex-col sm:flex-row gap-4 p-4 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 hover:-translate-y-0.5 cursor-pointer">
        <div className="relative w-full sm:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={image_url}
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
              {views_count > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {views_count}
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

  return (
    <article onClick={handleClick} className="group relative flex flex-col bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 hover:-translate-y-1 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image_url}
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

        {author_name && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            {author_avatar_url && (
              <img
                src={author_avatar_url}
                alt={author_name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-md object-cover"
              />
            )}
            <span className="text-sm font-medium text-white drop-shadow-md">
              {author_name}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-2 h-14 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/60 line-clamp-3 flex-1">
          {excerpt}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-sm text-slate-500 dark:text-white/50">
          <div className="flex items-center gap-4">
            {views_count > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {views_count}
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
