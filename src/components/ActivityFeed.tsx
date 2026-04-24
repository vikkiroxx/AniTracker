"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET_ACTIVITY_FEED } from "@/lib/api/queries";
import { TOGGLE_ACTIVITY_LIKE } from "@/lib/api/mutations";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

const proxyFetch = async (query: string, variables: any = {}) => {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
};

export function ActivityFeed({ userId }: { userId: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["activityFeed", userId];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => proxyFetch(GET_ACTIVITY_FEED, { userId, page: 1 }),
    enabled: !!userId,
  });

  const toggleLikeMutation = useMutation({
    mutationFn: (activityId: number) => proxyFetch(TOGGLE_ACTIVITY_LIKE, { id: activityId }),
    onMutate: async (activityId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.Page?.activities) return old;
        return {
          ...old,
          Page: {
            ...old.Page,
            activities: old.Page.activities.map((act: any) => {
              if (act.id === activityId) {
                return {
                  ...act,
                  isLiked: !act.isLiked,
                  likeCount: act.isLiked ? act.likeCount - 1 : act.likeCount + 1,
                };
              }
              return act;
            }),
          },
        };
      });

      return { previousData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSettled: () => {
      // We don't invalidate here to avoid jarring re-fetches, the optimistic update is enough
    },
  });

  if (isLoading) return <div className="space-y-4 animate-pulse"><div className="h-24 bg-white/5 rounded-2xl w-full" /><div className="h-24 bg-white/5 rounded-2xl w-full" /></div>;
  if (error || !data) return <div className="text-muted-foreground text-sm">Could not load activity feed.</div>;

  const activities = data?.Page?.activities || [];

  if (activities.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No recent activity.</p>;
  }

  const formatTime = (timestamp: number) => {
    const diff = Math.floor(Date.now() / 1000) - timestamp;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const renderActivity = (act: any) => {
    const isListActivity = act.type === "ANIME_LIST" || act.type === "MANGA_LIST" || !!act.status;
    const isTextActivity = act.type === "TEXT";
    const isMessageActivity = act.type === "MESSAGE";

    // Standardize user field depending on activity type
    const user = isMessageActivity ? act.messenger : act.user;

    return (
      <div key={act.id} className="p-4 bg-card border border-white/5 rounded-2xl shadow-sm hover:border-white/10 transition-colors">
        <div className="flex gap-4">
          <Link href={`/profile/${user?.name}`} className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0 border border-white/10 hover:opacity-80 transition-opacity">
            <Image src={user?.avatar?.large} alt="avatar" fill className="object-cover" />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <Link href={`/profile/${user?.name}`} className="font-bold text-sm text-primary hover:underline">
                {user?.name}
              </Link>
              <span className="text-xs text-muted-foreground">{formatTime(act.createdAt)}</span>
            </div>

            {isListActivity && (
              <div className="text-sm">
                <span className="text-muted-foreground">
                  {act.status} {act.progress} of
                </span>{" "}
                <Link href={`/anime/${act.media?.id}`} className="font-medium text-accent hover:underline">
                  {act.media?.title?.romaji}
                </Link>
              </div>
            )}

            {isTextActivity && (
              <div 
                className="text-sm prose prose-invert max-w-none prose-p:my-1" 
                dangerouslySetInnerHTML={{ __html: act.text?.replace(/\n/g, "<br/>") }} 
              />
            )}

            {isMessageActivity && (
              <div 
                className="text-sm prose prose-invert max-w-none prose-p:my-1" 
                dangerouslySetInnerHTML={{ __html: act.message?.replace(/\n/g, "<br/>") }} 
              />
            )}

            {isListActivity && act.media?.coverImage?.large && (
              <div className="mt-3 w-16 h-20 relative rounded-md overflow-hidden">
                <Image src={act.media.coverImage.large} alt="cover" fill className="object-cover" />
              </div>
            )}

            <div className="flex items-center gap-6 mt-4">
              <button 
                onClick={() => toggleLikeMutation.mutate(act.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  act.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                }`}
              >
                <Heart className={`w-4 h-4 ${act.isLiked ? "fill-red-500" : ""}`} />
                {act.likeCount > 0 && <span>{act.likeCount}</span>}
              </button>
              
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                {act.replyCount > 0 && <span>{act.replyCount}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {activities.map(renderActivity)}
    </div>
  );
}
