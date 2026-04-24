import { useQuery } from "@tanstack/react-query";
import { SEARCH_ANIME } from "@/lib/api/queries";

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

export function useAnimeSearch(search: string, page = 1, perPage = 20) {
  return useQuery({
    queryKey: ["animeSearch", search, page],
    queryFn: () => proxyFetch(SEARCH_ANIME, { search: search || undefined, page, perPage }),
    enabled: true, // Always fetch popular if no search string
  });
}
