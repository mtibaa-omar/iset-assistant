import { useState, useMemo } from "react";
import { PlayCircle, Filter, Search } from "lucide-react";
import { useUserVideos } from "../features/videos/useVideos";
import VideoCard from "../features/videos/VideoCard";
import Spinner from "../ui/components/Spinner";
import Input from "../ui/components/Input";

export default function Tutorials() {
  const { videos, isLoading, error } = useUserVideos();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    
    const query = searchQuery.toLowerCase();
    return videos.filter(video => {
      const titleMatch = video.title?.toLowerCase().includes(query);
      const descriptionMatch = video.description?.toLowerCase().includes(query);
      return titleMatch || descriptionMatch;
    });
  }, [videos, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full dark:bg-red-900/30">
          <PlayCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Erreur de chargement
        </h3>
        <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-12 overflow-y-auto md:px-6 lg:px-10 md:py-6" >
      <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Tutoriels Vidéo
              </h1>
            </div>
          </div>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            Découvrez des tutoriels vidéo adaptés à votre spécialité et niveau d'études.
          </p>
          
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Rechercher par titre ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
              <Filter className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              {searchQuery ? "Aucun résultat" : "Aucune vidéo disponible"}
            </h3>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
              {searchQuery 
                ? "Aucune vidéo ne correspond à votre recherche. Essayez avec d'autres mots-clés."
                : "Il n'y a actuellement aucune vidéo disponible pour votre spécialité et niveau. Revenez plus tard pour découvrir de nouveaux contenus !"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
    </div>
  );
}
