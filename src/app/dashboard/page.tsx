import { anilistFetch } from "@/lib/api/anilist-client";
import { GET_VIEWER } from "@/lib/api/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import AnimeList from "@/components/AnimeList";
import { UpNextSchedule } from "@/components/UpNextSchedule";

export default async function DashboardPage() {
  let viewer;
  try {
    const data = await anilistFetch({
      query: GET_VIEWER,
      requireAuth: true,
    });
    viewer = data?.Viewer;
  } catch (error) {
    // If not authenticated or error, redirect to home
    redirect("/");
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto pb-24">
      <header className="flex items-center justify-between mb-8 md:mb-12 pt-4 md:pt-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground font-medium hidden sm:inline">{viewer.name}</span>
          {viewer.avatar?.large && (
            <Image
              src={viewer.avatar.large}
              alt={viewer.name}
              width={40}
              height={40}
              className="rounded-full border border-primary/20 shadow-[0_0_15px_-3px_rgba(200,50,255,0.3)]"
            />
          )}
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 md:p-6 rounded-2xl bg-card border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-primary">Your Anime</h2>
              <AnimeList userId={viewer.id} />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 md:p-6 rounded-2xl bg-card border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-accent">Up Next</h2>
              <UpNextSchedule userId={viewer.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
