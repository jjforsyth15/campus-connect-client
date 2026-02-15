import { NextResponse } from "next/server";

/**
 * Placeholder: list notes (status lines) for sidebar.
 * Backend should replace with real data.
 */
export async function GET() {
  return NextResponse.json({ notes: [] });
}

/**
 * Placeholder: update current user's note.
 * Backend will validate and persist.
 */
export async function PATCH() {
  return NextResponse.json(
    { ok: false, message: "Not implemented. Backend will provide this." },
    { status: 501 }
  );
}
