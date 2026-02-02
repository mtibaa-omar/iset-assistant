const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

export default function VideoCard({ video }) {
  const videoId = getYouTubeVideoId(video.video_url);
  
  const category = video.specialties?.name || "GÉNÉRAL";
  const level = video.levels?.name || "Tous niveaux";
  
  return (
    <div className="group relative overflow-hidden transition-all duration-300 bg-white border rounded-2xl dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:shadow-xl">
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2 pointer-events-none">
        {video.specialty_id ? (
          <>
            <span className="px-3 py-1 text-[10px] font-bold text-blue-700 bg-white/90 backdrop-blur-md border border-blue-100 rounded-full dark:bg-zinc-900/90 dark:text-blue-400 dark:border-white/10 uppercase tracking-wider shadow-sm">
              {category}
            </span>
            <span className="px-3 py-1 text-[10px] font-bold text-purple-600 bg-white/90 backdrop-blur-md border border-purple-100 rounded-full dark:bg-zinc-900/90 dark:text-purple-400 dark:border-white/10 uppercase tracking-wider shadow-sm">
              {level}
            </span>
          </>
        ) : (
          <span className="px-3 py-1 text-[10px] font-bold text-blue-700 bg-white/90 backdrop-blur-md border border-blue-100 rounded-full dark:bg-zinc-900/90 dark:text-blue-400 dark:border-white/10 uppercase tracking-wider shadow-sm">
            TOUS NIVEAUX
          </span>
        )}
      </div>

      <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-zinc-900">
        {videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}
