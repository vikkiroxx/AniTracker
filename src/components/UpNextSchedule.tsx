"use client";

import { useAnimeList } from "@/hooks/useAnimeList";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function UpNextSchedule({ userId }: { userId: number }) {
  const { data, isLoading } = useAnimeList(userId);
  const [now, setNow] = useState(Date.now());

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="animate-pulse bg-white/5 h-32 rounded-xl" />;

  const lists = data?.MediaListCollection?.lists || [];
  const currentList = lists.find((list: any) => list.status === "CURRENT")?.entries || [];

  const upcoming = currentList
    .filter((entry: any) => entry.media.nextAiringEpisode)
    .map((entry: any) => {
      const media = entry.media;
      // Calculate real time remaining
      const timeRemaining = Math.max(0, media.nextAiringEpisode.airingAt - Math.floor(now / 1000));
      return {
        ...media,
        realTimeRemaining: timeRemaining,
      };
    })
    .filter((media: any) => media.realTimeRemaining > 0)
    .sort((a: any, b: any) => a.realTimeRemaining - b.realTimeRemaining)
    .slice(0, 5); // top 5 closest

  if (upcoming.length === 0) {
    return <p className="text-muted-foreground text-sm">No upcoming episodes in your watching list.</p>;
  }

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="space-y-4">
      {upcoming.map((media: any) => (
        <Link 
          href={`/anime/${media.id}`} 
          key={media.id} 
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <div className="w-12 h-16 relative rounded-md overflow-hidden flex-shrink-0">
            <Image src={media.coverImage.large} alt={media.title.romaji} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{media.title.romaji}</h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Ep {media.nextAiringEpisode.episode}
              </span>
              <span className="text-xs text-accent font-medium">
                {formatTime(media.realTimeRemaining)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
