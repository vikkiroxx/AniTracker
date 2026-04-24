"use client";

import { useState, useEffect } from "react";
import { useAnimeSearch } from "@/hooks/useAnimeSearch";
import { Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { data, isLoading, error } = useAnimeSearch(debouncedSearch, 1, 30);

  const animeList = data?.Page?.media || [];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto pb-24">
      <header className="mb-8 pt-4 md:pt-0">
        <h1 className="text-3xl font-bold mb-6">Discover Anime</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="w-full bg-card/50 backdrop-blur-md border border-white/10 rounded-full py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg"
            placeholder="Search for anime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main>
        {isLoading && <div className="text-muted-foreground animate-pulse text-center mt-12">Searching...</div>}
        {error && <div className="text-destructive text-center mt-12">Failed to load results.</div>}
        
        {!isLoading && !error && animeList.length === 0 && (
          <div className="text-muted-foreground text-center mt-12">No anime found for "{debouncedSearch}"</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {animeList.map((anime: any) => (
            <Link 
              href={`/anime/${anime.id}`} 
              key={anime.id}
              className="group flex flex-col gap-2 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(200,50,255,0.5)]"
            >
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-white/5">
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {anime.averageScore && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-xs font-bold px-2 py-1 rounded-md text-white">
                    ★ {(anime.averageScore / 10).toFixed(1)}
                  </div>
                )}
              </div>
              <div className="px-1">
                <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {anime.title.romaji}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {anime.format?.replace("_", " ").toLowerCase()} • {anime.status?.replace("_", " ").toLowerCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
