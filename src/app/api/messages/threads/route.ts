import { NextResponse } from "next/server";

/**
 * Placeholder: list threads and users for sidebar.
 * Backend should replace this with real data (threads + users for picker).
 */
export async function GET() {
  return NextResponse.json({
    threads: [],
    users: [],
  });
}

/**
 * Placeholder: create a thread (e.g. when starting a new conversation).
 * Backend will create thread and return it.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Not implemented. Backend will provide this." },
    { status: 501 }
  );
}
