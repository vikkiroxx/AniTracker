import { anilistFetch } from "@/lib/api/anilist-client";
import { GET_USER_PROFILE } from "@/lib/api/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User, PlayCircle, Clock, Hash } from "lucide-react";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { ActivityFeed } from "@/components/ActivityFeed";

export default async function PublicProfilePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  
  let profile;
  try {
    const profileData = await anilistFetch({
      query: GET_USER_PROFILE,
      variables: { name },
      requireAuth: true,
    });
    profile = profileData?.User;
  } catch (error) {
    console.error("Failed to fetch profile");
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">User not found or failed to load.</div>;
  }

  const stats = profile.statistics?.anime;

  return (
    <div className="min-h-screen pb-24">
      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 bg-muted">
        {profile.bannerImage ? (
          <Image src={profile.bannerImage} alt="banner" fill className="object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden border-4 border-background shadow-[0_0_30px_-5px_rgba(200,50,255,0.4)] bg-background">
            {profile.avatar?.large ? (
              <Image src={profile.avatar.large} alt={profile.name} fill className="object-cover" />
            ) : (
              <User className="w-full h-full p-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Joined {new Date(profile.createdAt * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 bg-card border border-white/5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-primary">Anime Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-accent">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.count || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Anime</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-primary">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.episodesWatched || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Episodes Watched</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-green-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round((stats?.minutesWatched || 0) / 60 / 24)}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Days Watched</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-white/5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-accent">Average Score</h2>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
                  {stats?.meanScore || 0}
                </span>
                <span className="text-muted-foreground mb-1">/ 100</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-card border border-white/5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-white">About</h2>
              {profile.about ? (
                <div 
                  className="prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: profile.about }}
                />
              ) : (
                <p className="text-muted-foreground italic text-sm">This user hasn't written a bio yet.</p>
              )}
            </div>

            <div className="p-6 bg-card border border-white/5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-primary">Activity Heatmap</h2>
              <ActivityHeatmap userId={profile.id} />
            </div>

            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">Activity Feed</h2>
              <ActivityFeed userId={profile.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
