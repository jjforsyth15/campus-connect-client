import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as any));
  // TODO: persist to your Events store
  console.log("Add to Events:", body);
  return NextResponse.json({ ok: true });
}
