"use client";

import dynamic from "next/dynamic";


const ClubsUI = dynamic(() => import("@/components/clubs/ClubsUI"), {
  ssr: false,
});

// UI-only mock data (no backend logic
const CLUBS = [
  {
    id: "acm",
    slug: "acm",
    name: "ACM @ CSUN",
    category: "Computer Science",
    description: "Workshops, networking, and project building.",
    tags: ["Workshops", "Career", "Projects"],
  },
  {
    id: "ieee",
    slug: "ieee",
    name: "IEEE Student Branch",
    category: "Engineering",
    description: "Hands-on engineering projects and events.",
    tags: ["Hardware", "Events", "Projects"],
  },
  {
    id: "gdc",
    slug: "game-dev",
    name: "Game Dev Club",
    category: "Creative Tech",
    description: "Build games together and ship cool stuff.",
    tags: ["Unity", "Unreal", "Art"],
  },
  {
    id: "ai-ml",
    slug: "ai-ml",
    name: "AI / ML Club",
    category: "Computer Science",
    description: "Study jams + beginner-friendly ML projects.",
    tags: ["ML", "Study", "Projects"],
  },
];

export default function ClubsPage() {
  return <ClubsUI clubs={CLUBS} mode="hub" />;
}
