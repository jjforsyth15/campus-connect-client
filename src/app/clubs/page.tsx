"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// BACKEND: In production, replace static CLUBS import with a server-side fetch:
//   const clubs = await supabase.from('clubs').select('*').order('name')
// Then pass clubs as a prop through a Server Component wrapper.
import { CLUBS } from "@/components/clubs/clubs.data";

const ClubsUI = dynamic(() => import("@/components/clubs/ClubsUI"), { ssr: false });

function ClubsContent() {
  // BACKEND: Read `view` and `slug` query params if needed for deep-linking.
  // Example: const view = searchParams.get("view");
  return <ClubsUI clubs={CLUBS} mode="hub" />;
}

export default function ClubsPage() {
  return (
    <Suspense fallback={null}>
      <ClubsContent />
    </Suspense>
  );
}
