// =============================================================================
// app/api/csun-events/route.ts
// Server-side proxy for the CSUN events RSS feed.
// Because Next.js API routes run on the server, there are no CORS restrictions
// when fetching the upstream feed. The client fetches /api/csun-events instead
// of the RSS URL directly.
// =============================================================================

import { NextResponse } from "next/server";

const CSUN_EVENTS_RSS = "https://news.csun.edu/events/feed/";

export async function GET() {
  try {
    const res = await fetch(CSUN_EVENTS_RSS, {
      next: { revalidate: 600 }, // cache for 10 minutes
      headers: {
        "User-Agent": "CampusConnect/1.0 (campus.connect@csun.edu)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Upstream error: ${res.status}`, { status: 502 });
    }

    const xml = await res.text();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[csun-events proxy]", err);
    return new NextResponse("Failed to fetch CSUN events feed", { status: 503 });
  }
}
