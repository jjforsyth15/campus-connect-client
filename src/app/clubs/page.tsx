"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CLUBS } from "@/components/clubs/clubs.data";
import type { Club } from "@/components/clubs/clubs.data";

const ClubsUI = dynamic(() => import("@/components/clubs/ClubsUI"), { ssr: false });
const RecommendUI = dynamic(() => import("@/components/clubs/RecommendUI"), { ssr: false });

const SLUG_ALIASES: Record<string, string> = {
  "ieee-csun": "ieee",
  "swe-csun": "swe",
  "acm-csun": "acm",
};

function getClubBySlug(slug: string | null): Club | null {
  if (!slug) return null;
  const resolved = SLUG_ALIASES[slug] ?? slug;
  return CLUBS.find((c) => (c.slug ?? c.id) === resolved) ?? null;
}

function ClubsContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const slug = searchParams.get("slug");

  if (view === "recommend") {
    return <RecommendUI clubs={CLUBS} />;
  }

  const club = getClubBySlug(slug);
  if (slug != null && slug !== "") {
    if (club) {
      return <ClubsUI clubs={CLUBS} mode="club" club={club} />;
    }
    return (
      <div style={{ padding: 24, color: "white" }}>
        <h2>Club not found</h2>
        <p>Requested slug: {slug}</p>
        <a href="/clubs" style={{ color: "rgba(255,255,255,0.9)" }}>Back to clubs</a>
      </div>
    );
  }

  return <ClubsUI clubs={CLUBS} mode="hub" />;
}

export default function ClubsPage() {
  return (
    <Suspense fallback={null}>
      <ClubsContent />
    </Suspense>
  );
}