import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", request.url));
  }

  const clientId = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID;
  const clientSecret = process.env.ANILIST_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_ANILIST_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL("/?error=missing_config", request.url));
  }

  try {
    const response = await fetch("https://anilist.co/api/v2/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      const cookieStore = await cookies();
      
      cookieStore.set({
        name: "anilist_token",
        value: data.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // AniList tokens usually last 1 year
        maxAge: data.expires_in || 31536000,
      });

      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      console.error("Token exchange failed:", data);
      return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url));
    }
  } catch (error) {
    console.error("Error during token exchange:", error);
    return NextResponse.redirect(new URL("/?error=auth_error", request.url));
  }
}
