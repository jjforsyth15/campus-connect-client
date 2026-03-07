export type Club = {
  id: string;
  slug?: string;
  name: string;
  category?: string;
  description?: string;
  tagline?: string;
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
    category: "Computer Science",
    description: "Student chapter focused on software, workshops, and networking.",
    tagline: "Software, workshops, and networking.",
    tags: ["Workshops", "Hackathons", "Career"],
    href: "#",
    story: "We run workshops, hackathons, and career panels for CSUN students interested in software and tech.",
    whyJoin: ["Workshops and talks", "Hackathon teams", "Resume and interview prep"],
    contact: { email: "acm@csun.edu", instagram: "@acmcsun", website: "https://acm.org" },
  },
  {
    id: "ieee",
    slug: "ieee",
    name: "IEEE Student Branch",
    category: "Engineering",
    description: "Projects, competitions, and speaker events for engineering students.",
    tagline: "Projects, competitions, and speaker events.",
    tags: ["Hardware", "Projects", "Events"],
    href: "#",
    story: "IEEE at CSUN focuses on hands-on projects and competitions for engineering students.",
    whyJoin: ["Hardware projects", "Competitions", "Industry speakers"],
    contact: { email: "ieee@csun.edu", website: "https://ieee.org" },
  },
  {
    id: "gdc",
    slug: "gdc",
    name: "Game Dev Club",
    category: "Creative Tech",
    description: "Build games, form teams, and ship projects together.",
    tagline: "Build games and ship projects together.",
    tags: ["Unity", "Unreal", "Art"],
    href: "#",
    story: "From concept to playable: we build games in Unity, Unreal, and more.",
    whyJoin: ["Game jams", "Portfolio projects", "Art and design collaboration"],
    contact: { email: "gdc@csun.edu", instagram: "@gdc csun" },
  },
  {
    id: "ai",
    slug: "ai",
    name: "AI / ML Club",
    category: "Computer Science",
    description: "Learn ML concepts through study jams and fun builds.",
    tagline: "ML study jams and fun builds.",
    tags: ["ML", "Study", "Projects"],
    href: "#",
    story: "We run study jams and small projects to learn ML and AI together.",
    whyJoin: ["Study jams", "Kaggle and projects", "Reading group"],
    contact: { email: "aiml@csun.edu" },
  },
];
