import { useQuery } from "@tanstack/react-query";
import { GET_NOTIFICATIONS } from "@/lib/api/queries";

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

export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => proxyFetch(GET_NOTIFICATIONS, { page }),
  });
}
