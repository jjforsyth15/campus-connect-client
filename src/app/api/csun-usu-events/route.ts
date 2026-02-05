import { NextResponse } from "next/server";

const ICS_URL =
  "https://news.csun.edu/?post_type=tribe_events&tribe_events_cat=usu&ical=1&eventDisplay=list";

export async function GET() {
  try {
    const res = await fetch(ICS_URL, {
      next: { revalidate: 60 * 10 }, 
      headers: {
        "User-Agent": "CSUN CampusConnect Dashboard (student project)",
      },
    });

    if (!res.ok) {
      console.error("CSUN ICS fetch failed:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch CSUN USU events" },
        { status: 500 }
      );
    }

    const text = await res.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "s-maxage=600, stale-while-revalidate=1800",
      },
    });
  } catch (err) {
    console.error("Error fetching CSUN ICS:", err);
    return NextResponse.json(
      { error: "Error fetching CSUN USU events" },
      { status: 500 }
    );
  }
}
