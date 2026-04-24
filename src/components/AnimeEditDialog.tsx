"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProgress } from "@/hooks/useAnimeList";
import { useState, useEffect } from "react";
import Image from "next/image";

export function AnimeEditDialog({ 
  isOpen, 
  onClose, 
  entry 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  entry: any; 
}) {
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [repeat, setRepeat] = useState(0);
  const [status, setStatus] = useState("CURRENT");

  useEffect(() => {
    if (entry) {
      setProgress(entry.progress || 0);
      setScore(entry.score || 0);
      setRepeat(entry.repeat || 0);
      setStatus(entry.status || "CURRENT");
    }
  }, [entry]);

  if (!entry) return null;

  const media = entry.media;

  const handleSave = () => {
    // Score is 0-10, scoreRaw is 0-100
    // So if score is 8.5, scoreRaw is 85
    const scoreRaw = Math.round(score * 10);
    
    // Auto status based on progress only if they were watching or planning
    let newStatus = status;
    if (progress === media.episodes && media.episodes > 0 && status !== "COMPLETED") {
      newStatus = "COMPLETED";
    }

    updateProgress({
      id: entry.id,
      mediaId: media.id,
      progress,
      status: newStatus,
      scoreRaw,
      repeat,
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">{media.title.romaji}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <div className="w-24 h-32 relative rounded-md overflow-hidden flex-shrink-0">
            <Image src={media.coverImage.large} alt={media.title.romaji} fill className="object-cover" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="CURRENT">Watching</option>
                <option value="COMPLETED">Completed</option>
                <option value="PLANNING">Planning</option>
                <option value="PAUSED">Paused</option>
                <option value="DROPPED">Dropped</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress">Episodes Watched (Max: {media.episodes || "?"})</Label>
              <Input 
                id="progress" 
                type="number" 
                min={0}
                max={media.episodes || 9999}
                value={progress} 
                onChange={(e) => setProgress(Number(e.target.value))} 
                className="bg-background/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="score">Score (0 - 10)</Label>
              <Input 
                id="score" 
                type="number" 
                min={0}
                max={10}
                step={0.1}
                value={score} 
                onChange={(e) => setScore(Number(e.target.value))} 
                className="bg-background/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeat">Times Rewatched</Label>
              <Input 
                id="repeat" 
                type="number" 
                min={0}
                value={repeat} 
                onChange={(e) => setRepeat(Number(e.target.value))} 
                className="bg-background/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-[0_0_20px_-5px_rgba(200,50,255,0.5)]"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
