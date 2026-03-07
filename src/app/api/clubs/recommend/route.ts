import { NextResponse } from "next/server";


 // Returns { slug, name? } for the recommended club.

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    const { majorGroup, goal, interest } = body as {
      majorGroup?: string;
      goal?: string;
      interest?: string;
    };

    // Stub: pick a club by interest 
    const slugByInterest: Record<string, string> = {
      Coding: "acm",
      Robotics: "ieee",
      Gaming: "gdc",
      Marketing: "acm",
      Debate: "acm",
      MentalHealth: "ai",
      GreekLife: "ieee",
    };
    const slug = slugByInterest[interest ?? ""] ?? "acm";

    return NextResponse.json({ slug, name: null });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
