"use client";

import { useAnimeDetails } from "@/hooks/useAnimeDetails";
import { useUpdateProgress } from "@/hooks/useAnimeList";
import { use, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Play, Star, Clock, Calendar, Check, Plus } from "lucide-react";
import Link from "next/link";
import { AnimeEditDialog } from "@/components/AnimeEditDialog";

export default function AnimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const animeId = parseInt(id, 10);
  
  const { data, isLoading, error } = useAnimeDetails(animeId);
  const { mutate: updateProgress, isPending: isUpdating } = useUpdateProgress();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-muted-foreground">Loading details...</div>;
  if (error || !data?.Media) return <div className="min-h-screen flex items-center justify-center text-destructive">Failed to load anime details.</div>;

  const anime = data.Media;
  const entry = anime.mediaListEntry;
  
  const handleQuickAdd = () => {
    updateProgress({
      id: entry?.id,
      mediaId: anime.id,
      progress: (entry?.progress || 0) + 1,
      status: (entry?.progress || 0) + 1 === anime.episodes ? "COMPLETED" : "CURRENT"
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-96 bg-muted">
        {anime.bannerImage ? (
          <Image src={anime.bannerImage} alt={anime.title.romaji} fill className="object-cover opacity-60" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <Link href="/search" className="absolute top-4 left-4 md:top-8 md:left-8 p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors z-10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image & Quick Actions */}
          <div className="flex flex-col items-center md:items-start gap-4 flex-shrink-0">
            <div className="w-48 h-72 md:w-64 md:h-96 relative rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] border border-white/10">
              <Image src={anime.coverImage.extraLarge || anime.coverImage.large} alt={anime.title.romaji} fill className="object-cover" priority />
            </div>
            
            <div className="w-full flex flex-col gap-2 mt-2">
              {entry ? (
                <button 
                  onClick={() => setIsEditDialogOpen(true)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium transition-colors backdrop-blur-md"
                >
                  Edit List Entry
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditDialogOpen(true)}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors shadow-[0_0_30px_-10px_rgba(200,50,255,0.6)]"
                >
                  Add to List
                </button>
              )}
              
              {(!entry || entry.progress < anime.episodes) && (
                <button 
                  onClick={handleQuickAdd}
                  disabled={isUpdating}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  +1 Episode
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-2 md:pt-32">
            <div className="flex items-center flex-wrap gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {anime.title.romaji}
              </h1>
              {entry && (
                <span className={`px-3 py-1 text-sm font-bold rounded-full border ${
                  entry.status === 'CURRENT' ? 'bg-primary/20 text-primary border-primary/30' :
                  entry.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  entry.status === 'PAUSED' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  entry.status === 'DROPPED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30' // PLANNING
                }`}>
                  {entry.status === 'CURRENT' ? 'Watching' :
                   entry.status === 'COMPLETED' ? 'Completed' :
                   entry.status === 'PAUSED' ? 'Paused' :
                   entry.status === 'DROPPED' ? 'Dropped' : 'Planning'}
                </span>
              )}
            </div>
            
            {anime.title.english && anime.title.english !== anime.title.romaji && (
              <h2 className="text-xl text-muted-foreground mb-4">{anime.title.english}</h2>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {anime.averageScore ? `${anime.averageScore}%` : "N/A"}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full text-sm font-medium">
                <Play className="w-4 h-4 text-accent" />
                {anime.episodes ? `${anime.episodes} Episodes` : "Ongoing"}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4 text-primary" />
                {anime.duration ? `${anime.duration} mins` : "?"}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full text-sm font-medium capitalize">
                <Calendar className="w-4 h-4 text-green-400" />
                {anime.season?.toLowerCase()} {anime.seasonYear}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {anime.genres?.map((genre: string) => (
                <span key={genre} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-muted-foreground">
                  {genre}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
              <p 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: anime.description || "No description available." }}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimeEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        entry={entry ? { ...entry, media: anime } : { media: anime, progress: 0, score: 0, repeat: 0, status: "CURRENT" }}
      />
    </div>
  );
}
