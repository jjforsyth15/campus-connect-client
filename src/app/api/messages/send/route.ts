import { NextResponse } from "next/server";

/**
 * Placeholder: send a message in a thread.
 * Backend will handle validation, persistence, and delivery.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Not implemented. Backend will provide this." },
    { status: 501 }
  );
}
