export type Club = {
    id: string;
    name: string;
    category?: string;
    description?: string;
    tags?: string[];
    logoUrl?: string; 
    href?: string;   
  };
  
  // mock data 
  export const CLUBS: Club[] = [
    {
      id: "acm",
      name: "ACM @ CSUN",
      category: "Computer Science",
      description: "Student chapter focused on software, workshops, and networking.",
      tags: ["Workshops", "Hackathons", "Career"],
      href: "#",
    },
    {
      id: "ieee",
      name: "IEEE Student Branch",
      category: "Engineering",
      description: "Projects, competitions, and speaker events for engineering students.",
      tags: ["Hardware", "Projects", "Events"],
      href: "#",
    },
    {
      id: "gdc",
      name: "Game Dev Club",
      category: "Creative Tech",
      description: "Build games, form teams, and ship projects together.",
      tags: ["Unity", "Unreal", "Art"],
      href: "#",
    },
    {
      id: "ai",
      name: "AI / ML Club",
      category: "Computer Science",
      description: "Learn ML concepts through study jams and fun builds.",
      tags: ["ML", "Study", "Projects"],
      href: "#",
    },
  ];
  