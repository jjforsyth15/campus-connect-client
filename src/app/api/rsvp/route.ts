import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as any));
  // TODO: mark RSVP for current user
  console.log("RSVP:", body);
  return NextResponse.json({ ok: true });
}
