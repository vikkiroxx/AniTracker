import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_ANILIST_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new Response("Missing AniList configuration", { status: 500 });
  }

  const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

  return NextResponse.redirect(url);
}
