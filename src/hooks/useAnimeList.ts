import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET_USER_ANIME_LIST } from "@/lib/api/queries";
import { UPDATE_ANIME_PROGRESS } from "@/lib/api/mutations";

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

export function useAnimeList(userId: number | undefined) {
  return useQuery({
    queryKey: ["animeList", userId],
    queryFn: () => proxyFetch(GET_USER_ANIME_LIST, { userId }),
    enabled: !!userId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; mediaId: number; progress?: number; status?: string; scoreRaw?: number; repeat?: number }) =>
      proxyFetch(UPDATE_ANIME_PROGRESS, variables),
    onSuccess: () => {
      // Invalidate the cache so the list refetches
      queryClient.invalidateQueries({ queryKey: ["animeList"] });
    },
  });
}
