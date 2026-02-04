import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, Share2, ChevronRight, User, Tag } from "lucide-react";
import { useNewsDetail } from "../features/news/useNewsDetail";
import { useEffect } from "react";
import { useMarkNewsAsRead } from "../features/news/useMarkNewsAsRead";
import Spinner from "../ui/components/Spinner";
import Button from "../ui/components/Button";
import { motion } from "framer-motion";
import { CATEGORY_COLORS_GRADIENT } from "../styles/newsConstants";
import { formatFullDate } from "../utils/dateUtils";
export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { newsItem: news, isLoading } = useNewsDetail(id);
  const { markAsRead } = useMarkNewsAsRead();

  const gradientColor = CATEGORY_COLORS_GRADIENT[news?.category] || CATEGORY_COLORS_GRADIENT.default;

  useEffect(() => {
    if (id) {
      markAsRead(id);
    }
  }, [id, markAsRead]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          text: news.content?.substring(0, 100) + "...",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Lien copié dans le presse-papiers!");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800">
          <Tag className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Article introuvable
        </h2>
        <p className="mb-6 delay-75 text-slate-500">
          L'article que vous cherchez n'existe pas ou a été supprimé.
        </p>
        <Button
          onClick={() => navigate("/actualites")}
          variant="secondary"
          icon={ArrowLeft}
          size="sm"
        >
          Retourner aux actualités
        </Button>
      </div>
    );
  }

  const date = formatFullDate(news.published_at);

  return (
    <div className="relative min-h-screen pb-8">
      <div className="absolute flex items-center justify-between pointer-events-none z-10 top-4 left-4 right-4 md:top-6 md:left-6 md:right-6">
        <button 
          onClick={() => navigate("/actualites")}
          className="p-2.5 md:p-3 text-white transition-all border shadow-xl pointer-events-auto bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 border-white/20"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button 
          onClick={handleShare}
          className="p-2.5 md:p-3 text-white transition-all border shadow-xl pointer-events-auto bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 border-white/20"
        >
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <div className="relative h-[40vh] md:h-[55vh] lg:h-[60vh] w-full overflow-hidden">
        {news.image_url ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={news.image_url}
            alt={news.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientColor}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end w-full px-4 pb-6 mx-auto md:px-8 md:pb-12 lg:px-12 max-w-7xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-3 md:mb-4"
          >
            <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r ${gradientColor} shadow-lg backdrop-blur-sm`}>
              {news.category}
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mb-3 text-xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl xl:text-6xl md:mb-6"
          >
            {news.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 md:gap-4 text-slate-200"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 border bg-white/10 backdrop-blur-md rounded-xl border-white/10">
              {news.author_avatar_url ? (
                <img src={news.author_avatar_url} alt={news.author_name} className="object-cover w-5 h-5 border rounded-full md:w-6 md:h-6 border-white/20" />
              ) : (
                <div className="flex items-center justify-center w-5 h-5 rounded-full md:w-6 md:h-6 bg-white/20">
                  <User className="w-3 h-3 text-white md:w-3.5 md:h-3.5" />
                </div>
              )}
              <span className="text-xs font-medium text-white md:text-sm">{news.author_name || "Admin ISET"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-medium md:gap-3 md:text-sm">
              <span className="flex items-center gap-1.5 text-white/90">
                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-70" />
                {date}
              </span>
              <span className="hidden w-1 h-1 rounded-full md:block bg-white/30" />
              <span className="flex items-center gap-1.5 text-white/90">
                <Eye className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-70" />
                {news.views_count || 0} vues
              </span>
            </div>
          </motion.div>
        </div>
      </div>
 
      <div className="px-4 mt-6 md:px-8 lg:px-12">
        <div className="max-w-4xl p-6 mx-auto overflow-hidden border shadow-lg md:p-10 lg:p-12 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl border-slate-200 dark:border-zinc-800">
          <div className="mx-auto prose prose-base prose-slate dark:prose-invert md:prose-lg max-w-none">
            <p className="font-serif leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300 md:font-sans">
              {news.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
