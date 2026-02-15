import { NextResponse } from "next/server";

/**
 * Placeholder: list messages for a thread.
 * Backend should replace with real data.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  await params;
  return NextResponse.json({ messages: [] });
}
