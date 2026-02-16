export type Club = {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  category?: string;
  description?: string;
  tags?: string[];
  logoUrl?: string;
  href?: string;
  story?: string;
  whyJoin?: string[];
  contact?: { email?: string; instagram?: string; website?: string };
};

export const CLUBS: Club[] = [
  {
    id: "acm",
    slug: "acm",
    name: "ACM @ CSUN",
    tagline: "Student chapter focused on software, workshops, and networking.",
    category: "Computer Science",
    description: "Student chapter focused on software, workshops, and networking.",
    tags: ["Workshops", "Hackathons", "Career"],
    href: "#",
    story: "We build community around computing at CSUN.",
    whyJoin: ["Workshops & talks", "Hackathons", "Career support"],
    contact: { email: "acm@csun.edu", instagram: "acm_csun", website: "https://acm.csun.edu" },
  },
  {
    id: "ieee",
    slug: "ieee",
    name: "IEEE Student Branch",
    tagline: "Projects, competitions, and speaker events for engineering students.",
    category: "Engineering",
    description: "Projects, competitions, and speaker events for engineering students.",
    tags: ["Hardware", "Projects", "Events"],
    href: "#",
    story: "IEEE at CSUN connects engineering students with industry.",
    whyJoin: ["Hands-on projects", "Competitions", "Networking"],
    contact: { email: "ieee@csun.edu", website: "https://ieee.csun.edu" },
  },
  {
    id: "gdc",
    slug: "game-dev",
    name: "Game Dev Club",
    tagline: "Build games, form teams, and ship projects together.",
    category: "Creative Tech",
    description: "Build games, form teams, and ship projects together.",
    tags: ["Unity", "Unreal", "Art"],
    href: "#",
    story: "From concept to playable — we make games.",
    whyJoin: ["Game jams", "Portfolio projects", "Art & dev collaboration"],
    contact: { email: "gdc@csun.edu", instagram: "gdc_csun" },
  },
  {
    id: "ai",
    slug: "ai-ml",
    name: "AI / ML Club",
    tagline: "Learn ML concepts through study jams and fun builds.",
    category: "Computer Science",
    description: "Learn ML concepts through study jams and fun builds.",
    tags: ["ML", "Study", "Projects"],
    href: "#",
    story: "Demystifying AI and machine learning together.",
    whyJoin: ["Study jams", "Beginner-friendly", "Project teams"],
    contact: { email: "aiml@csun.edu" },
  },
];
