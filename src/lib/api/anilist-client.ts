import { cookies } from "next/headers";

const ANILIST_API_URL = "https://graphql.anilist.co";

export async function anilistFetch({
  query,
  variables = {},
  requireAuth = false,
}: {
  query: string;
  variables?: Record<string, any>;
  requireAuth?: boolean;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (requireAuth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("anilist_token")?.value;

    if (!token) {
      throw new Error("Authentication required");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error("AniList API Error:", data.errors);
    throw new Error(data.errors[0]?.message || "GraphQL Error");
  }

  return data.data;
}
