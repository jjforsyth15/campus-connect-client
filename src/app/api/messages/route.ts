import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  if (action === "threads") return NextResponse.json({ threads: [], users: [] });
  if (action === "notes") return NextResponse.json({ notes: [] });
  if (action === "messages") return NextResponse.json({ messages: [] });
  return NextResponse.json({ error: "Missing or invalid action" }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  const action = body.action as string | undefined;
  if (action === "send") return NextResponse.json({ ok: true });
  if (action === "updateNote") return NextResponse.json({ ok: true });
  if (action === "createThread") return NextResponse.json(null);
  return NextResponse.json({ error: "Missing or invalid action" }, { status: 400 });
}
