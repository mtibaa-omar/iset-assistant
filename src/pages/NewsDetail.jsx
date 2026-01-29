import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, Share2, ChevronRight, User, Tag } from "lucide-react";
import { useNewsDetail } from "../features/news/useNewsDetail";
import { useIncrementViews } from "../features/news/useIncrementViews";
import Spinner from "../ui/components/Spinner";
import Button from "../ui/components/Button";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { newsItem: news, isLoading } = useNewsDetail(id);
  
  useIncrementViews(id);

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
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Tag className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Article introuvable
        </h2>
        <p className="text-slate-500 delay-75 mb-6">
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

  const date = news.published_at ? new Date(news.published_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : "";

  return (
    <div className="">
      <Button
          onClick={() => navigate("/actualites")}
          variant="secondary"
          icon={ArrowLeft}
          size="sm"
          className="ml-4 shrink-0"
        >
          <span className="hidden md:inline">Retour</span>
        </Button>
    <div className="max-w-7xl mx-auto pb-12 px-4 md:px-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        <nav className="flex items-center text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-purple-600 transition-colors">Accueil</Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <Link to="/actualites" className="hover:text-purple-600 transition-colors">Actualités</Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-slate-900 dark:text-slate-200 font-medium truncate">
            {news.title}
          </span>
        </nav>
        
        
      </div>

      <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-700/50">
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            {news.title}
          </h1>

          <div className="flex flex-row justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                {news.author_avatar_url ? (
                  <img 
                    src={news.author_avatar_url} 
                    alt={news.author_name} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {news.author_name || "Administration ISET"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Rédacteur officiel
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleShare}
                  variant="secondary"
                  size="sm"
                  icon={Share2}
                  className="!text-purple-600 dark:!text-purple-400 !border-purple-200 dark:!border-purple-800 hover:!bg-purple-50 dark:hover:!bg-purple-900/20"
                >
                  <span className="hidden sm:inline">Partager</span>
                </Button>
                
              </div>
              
          </div>
          
        </div>

        {news.image_url && (
          <div className="w-full relative group">
            <div className="h-64 md:h-96 w-full overflow-hidden">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        )}

        <div className="p-6 md:p-10 md:px-16">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-justify mx-auto">
            <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-serif md:font-sans">
              {news.content}
            </p>
          </div>
        </div>

      </article>
    </div>
    </div>
  );
}
