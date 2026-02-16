"use client";

import RecommendUI from "@/components/clubs/RecommendUI";
import { CLUBS } from "@/components/clubs/clubs.data";

export default function RecommendPage() {
  return <RecommendUI clubs={CLUBS} />;
}
