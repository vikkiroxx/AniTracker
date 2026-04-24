"use client";

import { useNotifications } from "@/hooks/useNotifications";
import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, MessageCircle, Play, UserPlus } from "lucide-react";

export default function NotificationsPage() {
  const { data, isLoading, error } = useNotifications(1);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-muted-foreground">Loading notifications...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-destructive">Failed to load notifications.</div>;

  const notifications = data?.Page?.notifications || [];

  const formatTime = (timestamp: number) => {
    const diff = Math.floor(Date.now() / 1000) - timestamp;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const renderNotification = (item: any) => {
    const time = formatTime(item.createdAt);

    switch (item.type) {
      case "AIRING":
        return (
          <Link href={`/anime/${item.media?.id}`} key={item.id} className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/10 group">
            <div className="w-12 h-16 relative rounded-md overflow-hidden flex-shrink-0">
              {item.media?.coverImage?.large ? (
                <Image src={item.media.coverImage.large} alt="cover" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Play className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
              <p className="text-sm group-hover:text-primary transition-colors">
                {item.contexts?.join("") || `Episode ${item.episode} of ${item.media?.title?.romaji} aired.`}
              </p>
            </div>
          </Link>
        );

      case "RELATED_MEDIA_ADDITION":
        return (
          <Link href={`/anime/${item.media?.id}`} key={item.id} className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/10 group">
            <div className="w-12 h-16 relative rounded-md overflow-hidden flex-shrink-0">
              {item.media?.coverImage?.large ? (
                <Image src={item.media.coverImage.large} alt="cover" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
              <p className="text-sm">
                <span className="font-bold text-primary">{item.media?.title?.romaji}</span> {item.context}
              </p>
            </div>
          </Link>
        );

      case "FOLLOWING":
        return (
          <Link href={`/profile/${item.user?.name}`} key={item.id} className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/10 group">
            <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0 border border-white/10">
              {item.user?.avatar?.large ? (
                <Image src={item.user.avatar.large} alt="avatar" fill className="object-cover" />
              ) : (
                <UserPlus className="w-full h-full p-2 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="w-4 h-4 text-green-400" />
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
              <p className="text-sm group-hover:text-primary transition-colors">
                <span className="font-bold text-accent">{item.user?.name}</span> {item.context}
              </p>
            </div>
          </Link>
        );

      case "ACTIVITY_MESSAGE":
      case "ACTIVITY_REPLY":
        return (
          <Link href={`/profile/${item.user?.name}`} key={item.id} className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/10 group">
            <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0 border border-white/10">
              {item.user?.avatar?.large && (
                <Image src={item.user.avatar.large} alt="avatar" fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
              <p className="text-sm group-hover:text-primary transition-colors">
                <span className="font-bold text-accent">{item.user?.name}</span> {item.context}
              </p>
            </div>
          </Link>
        );
        
      case "ACTIVITY_LIKE":
      case "ACTIVITY_REPLY_LIKE":
        return (
          <Link href={`/profile/${item.user?.name}`} key={item.id} className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/10 group">
            <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0 border border-white/10">
              {item.user?.avatar?.large && (
                <Image src={item.user.avatar.large} alt="avatar" fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
              <p className="text-sm group-hover:text-primary transition-colors">
                <span className="font-bold text-accent">{item.user?.name}</span> {item.context}
              </p>
            </div>
          </Link>
        );

      default:
        // Generic fallback for any other unhandled notification type
        return (
          <div key={item.id || Math.random()} className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/10">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {time !== "NaNd ago" && <span className="text-xs text-muted-foreground mb-1">{time}</span>}
              <p className="text-sm">
                {item.context || item.contexts?.join("") || item.type || item.__typename || "New notification"}
              </p>
            </div>
          </div>
        );
    }
  };

  const validNotifications = notifications.filter((n: any) => n && (n.type || n.__typename));

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto pb-24">
      <header className="flex items-center gap-3 mb-8 pt-4 md:pt-0">
        <div className="p-3 bg-primary/20 rounded-full">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Notifications</h1>
      </header>

      <main className="space-y-2">
        {validNotifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">You have no new notifications.</div>
        ) : (
          validNotifications.map(renderNotification)
        )}
      </main>
    </div>
  );
}
