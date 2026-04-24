import { anilistFetch } from "@/lib/api/anilist-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, variables } = await request.json();

    // Proxy the request. The anilistFetch utility automatically 
    // attaches the token from cookies() if requireAuth is true.
    // For safety, we always set requireAuth: true for proxied mutations.
    // For queries, we can try with requireAuth: true, and if it fails, maybe it's fine.
    // Actually, let's just use requireAuth: true for the proxy.
    const requireAuth = true;

    const data = await anilistFetch({ query, variables, requireAuth });

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
