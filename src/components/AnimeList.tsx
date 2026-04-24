"use client";

import { useAnimeList, useUpdateProgress } from "@/hooks/useAnimeList";
import { Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { AnimeEditDialog } from "./AnimeEditDialog";

const TABS = [
  { id: "CURRENT", label: "Watching" },
  { id: "COMPLETED", label: "Completed" },
  { id: "PLANNING", label: "Planning" },
  { id: "PAUSED", label: "Paused" },
  { id: "DROPPED", label: "Dropped" },
];

export default function AnimeList({ userId }: { userId: number }) {
  const [activeTab, setActiveTab] = useState("CURRENT");
  const [editingEntry, setEditingEntry] = useState<any>(null);
  
  const { data, isLoading, error } = useAnimeList(userId);
  const { mutate: updateProgress, isPending } = useUpdateProgress();

  if (isLoading) return <div className="text-muted-foreground animate-pulse">Loading your anime list...</div>;
  if (error) return <div className="text-destructive">Failed to load list.</div>;

  const lists = data?.MediaListCollection?.lists || [];
  
  // Find the current list and sort by updatedAt descending (latest updated on top)
  let currentList = lists.find((list: any) => list.status === activeTab)?.entries || [];
  currentList = [...currentList].sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border pb-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-medium pb-2 -mb-[9px] whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentList.length === 0 ? (
        <p className="text-muted-foreground">You have no anime in this list.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentList.map((entry: any) => {
            const media = entry.media;
            const nextAiring = media.nextAiringEpisode;
            const isFinished = entry.progress === media.episodes;

            return (
              <div 
                key={entry.id} 
                className="flex bg-card/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] cursor-pointer group"
                onClick={() => setEditingEntry(entry)}
              >
                <div className="w-24 h-32 relative flex-shrink-0">
                  <Image 
                    src={media.coverImage.large} 
                    alt={media.title.romaji} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors" title={media.title.romaji}>
                      {media.title.romaji}
                    </h3>
                    <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                      <p>Ep {entry.progress} / {media.episodes || "?"}</p>
                      {entry.score > 0 && <p className="text-accent">★ {entry.score}</p>}
                    </div>
                    {nextAiring && (
                      <p className="text-xs text-accent mt-1">
                        Ep {nextAiring.episode} in {Math.floor(nextAiring.timeUntilAiring / 86400)}d
                      </p>
                    )}
                  </div>
                  
                  {!isFinished && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the dialog
                        updateProgress({ 
                          id: entry.id, 
                          mediaId: media.id, 
                          progress: entry.progress + 1,
                          status: entry.progress + 1 === media.episodes ? "COMPLETED" : entry.status
                        });
                      }}
                      disabled={isPending}
                      className="mt-2 self-start flex items-center gap-1 text-xs font-medium bg-primary/20 hover:bg-primary/40 text-primary px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-3 h-3" />
                      1 Episode
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <AnimeEditDialog 
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
      />
    </div>
  );
}
