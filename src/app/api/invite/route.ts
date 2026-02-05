import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as any));
  // TODO: send invites to selected friends
  console.log("Invite friends:", body);
  return NextResponse.json({ ok: true });
}
