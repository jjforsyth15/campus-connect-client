export type Club = {
    slug: string;
    name: string;
    category: string;
    tagline: string;
    story: string;
    whyJoin: string[];
    contact: {
      email: string;
      instagram?: string;
      website?: string;
    };
  };
  
  export const CLUBS: Club[] = [
    // Engineering / Tech / STEM (10)
    {
      slug: "acm",
      name: "Association for Computing Machinery (ACM)",
      category: "Engineering",
      tagline: "Workshops, projects, and a CS community for builders.",
      story:
        "ACM connects students interested in computing through workshops, project collaboration, and community events.",
      whyJoin: ["Build technical skills", "Meet collaborators", "Grow your network"],
      contact: { email: "acm@my.csun.edu" },
    },
    {
      slug: "ieee",
      name: "IEEE Student Branch",
      category: "Engineering",
      tagline: "Engineering community with events, mentoring, and hands-on learning.",
      story:
        "IEEE Student Branch supports engineering growth through talks, project teams, and peer support.",
      whyJoin: ["Hands-on experience", "Professional development", "Meet engineers across majors"],
      contact: { email: "ieee@my.csun.edu" },
    },
    {
      slug: "shpe",
      name: "Society of Hispanic Professional Engineers (SHPE)",
      category: "Engineering",
      tagline: "Career development and community for future engineers.",
      story:
        "SHPE supports students through mentorship, professional development, and community events.",
      whyJoin: ["Mentorship", "Career support", "Community"],
      contact: { email: "info@shpecsun.org" },
    },
    {
      slug: "swe",
      name: "Society of Women Engineers (SWE)",
      category: "Engineering",
      tagline: "Leadership, support, and engineering professional growth.",
      story:
        "SWE builds community and leadership through events, mentorship, and career preparation.",
      whyJoin: ["Mentorship", "Leadership opportunities", "Career development"],
      contact: { email: "swe@my.csun.edu" },
    },
    {
      slug: "girls-who-code",
      name: "Girls Who Code (CSUN)",
      category: "Engineering",
      tagline: "Inclusive coding community with projects and workshops.",
      story:
        "Girls Who Code at CSUN builds a supportive community focused on learning and creating with code.",
      whyJoin: ["Learn together", "Build projects", "Supportive community"],
      contact: { email: "csungwc@gmail.com" },
    },
    {
      slug: "asme",
      name: "American Society of Mechanical Engineers (ASME)",
      category: "Engineering",
      tagline: "Mechanical engineering community with projects and growth.",
      story:
        "ASME supports mechanical engineering interests through events, projects, and professional connections.",
      whyJoin: ["Projects", "Networking", "Hands-on learning"],
      contact: { email: "americansociety.mechanicalengineers@my.csun.edu" },
    },
    {
      slug: "asce",
      name: "American Society of Civil Engineers (ASCE)",
      category: "Engineering",
      tagline: "Civil engineering community and professional development.",
      story:
        "ASCE helps students grow in civil engineering through events, workshops, and community involvement.",
      whyJoin: ["Professional development", "Peer learning", "Networking"],
      contact: { email: "csun.asce@gmail.com" },
    },
    {
      slug: "vex-matabots",
      name: "VEX Robotics / Matabots",
      category: "Engineering",
      tagline: "Robotics teams, builds, and competition preparation.",
      story:
        "VEX/Matabots focuses on robotics design, building, iteration, and competitive teamwork.",
      whyJoin: ["Build robots", "Team experience", "Competition prep"],
      contact: { email: "csun.vex@my.csun.edu" },
    },
    {
      slug: "hpvc",
      name: "Human Powered Vehicle Club (HPVC)",
      category: "Engineering",
      tagline: "Design and build human-powered vehicles as a team.",
      story:
        "HPVC collaborates on designing, prototyping, and building human-powered vehicle projects.",
      whyJoin: ["Design experience", "Hands-on builds", "Team projects"],
      contact: { email: "csunhpvc@gmail.com" },
    },
    {
      slug: "esports",
      name: "CSUN Esports",
      category: "Engineering",
      tagline: "Competitive gaming community and esports events.",
      story:
        "CSUN Esports brings students together through competitive teams, events, and community activities.",
      whyJoin: ["Team competition", "Community events", "Meet other players"],
      contact: { email: "esports@csunas.org" },
    },
  
    // Business / Career / Professional (5)
    {
      slug: "ama",
      name: "American Marketing Association (AMA)",
      category: "Academic",
      tagline: "Marketing community focused on career growth and networking.",
      story:
        "AMA supports professional development through events, speakers, and student networking.",
      whyJoin: ["Career growth", "Networking", "Industry exposure"],
      contact: { email: "ama@my.csun.edu" },
    },
    {
      slug: "delta-sigma-pi",
      name: "Delta Sigma Pi (Business Fraternity)",
      category: "Academic",
      tagline: "Professional business fraternity for leadership and networking.",
      story:
        "Delta Sigma Pi focuses on professional development, leadership, and business networking.",
      whyJoin: ["Leadership", "Professional network", "Career readiness"],
      contact: { email: "dsp.csun@gmail.com" },
    },
    {
      slug: "alpfa",
      name: "Association of Latino Professionals for America (ALPFA)",
      category: "Academic",
      tagline: "Professional development and community for future leaders.",
      story:
        "ALPFA supports students through professional events, leadership development, and community.",
      whyJoin: ["Professional events", "Mentorship", "Networking"],
      contact: { email: "alpfa.csun@gmail.com" },
    },
    {
      slug: "prssa",
      name: "Public Relations Student Society of America (PRSSA)",
      category: "Academic",
      tagline: "Public relations professional development and networking.",
      story:
        "PRSSA supports students interested in PR through events, speakers, and practical growth.",
      whyJoin: ["Industry exposure", "Skill building", "Networking"],
      contact: { email: "prssa@my.csun.edu" },
    },
    {
      slug: "pre-law",
      name: "Pre-Law Association",
      category: "Academic",
      tagline: "Support and resources for students exploring law.",
      story:
        "Pre-Law Association provides guidance, community, and events for students considering law school.",
      whyJoin: ["Guidance", "Community", "Law school preparation"],
      contact: { email: "prelaw@my.csun.edu" },
    },
  
    // Cultural / Identity / Advocacy (5)
    {
      slug: "asa",
      name: "Armenian Student Association (ASA)",
      category: "Cultural",
      tagline: "Community and cultural events for Armenian students and allies.",
      story:
        "ASA builds community through cultural events, social gatherings, and student support.",
      whyJoin: ["Community", "Cultural events", "Student connection"],
      contact: { email: "asa.csun@gmail.com" },
    },
    {
      slug: "msa",
      name: "Muslim Student Association (MSA)",
      category: "Cultural",
      tagline: "Community, service, and faith-based student support.",
      story:
        "MSA supports students through community events, service, and campus connection.",
      whyJoin: ["Community", "Service", "Support"],
      contact: { email: "msa.csun@gmail.com" },
    },
    {
      slug: "young-democrats",
      name: "CSUN Young Democrats",
      category: "Cultural",
      tagline: "Civic engagement and community involvement.",
      story:
        "CSUN Young Democrats supports civic engagement, discussions, and community involvement.",
      whyJoin: ["Engagement", "Community", "Discussions"],
      contact: { email: "csunyoungdemocrats@gmail.com" },
    },
    {
      slug: "young-republicans",
      name: "CSUN Young Republicans",
      category: "Cultural",
      tagline: "Civic engagement and political community on campus.",
      story:
        "CSUN Young Republicans provides a space for civic engagement, events, and discussions.",
      whyJoin: ["Engagement", "Community", "Events"],
      contact: { email: "csunyr@gmail.com" },
    },
    {
      slug: "latino-journalists",
      name: "Latino Journalists Association",
      category: "Cultural",
      tagline: "Community for journalism interests and storytelling.",
      story:
        "Latino Journalists Association supports students interested in journalism and media through community and development.",
      whyJoin: ["Community", "Skill growth", "Networking"],
      contact: { email: "csunlja@gmail.com" },
    },
  
    // Arts / Media / Performance (4)
    {
      slug: "acasola",
      name: "ACASOLA (A Cappella Group)",
      category: "Service",
      tagline: "A cappella performance group and music community.",
      story:
        "ACASOLA is a performance-focused community for students interested in a cappella singing.",
      whyJoin: ["Perform", "Collaborate", "Music community"],
      contact: { email: "acasola.csun@gmail.com" },
    },
    {
      slug: "forensics",
      name: "Forensics Speech & Debate Team",
      category: "Service",
      tagline: "Speech, debate, competitions, and communication skills.",
      story:
        "Forensics supports students in speech and debate through practice, coaching, and competitions.",
      whyJoin: ["Improve speaking", "Compete", "Build confidence"],
      contact: { email: "forensics@csun.edu" },
    },
    {
      slug: "art-education",
      name: "Art Education Club",
      category: "Service",
      tagline: "Community for art education and creative teaching.",
      story:
        "Art Education Club connects students interested in art education through events and community.",
      whyJoin: ["Creative community", "Teaching support", "Events"],
      contact: { email: "arteducation@my.csun.edu" },
    },
    {
      slug: "film-production",
      name: "Film Production Club",
      category: "Service",
      tagline: "Film community for creators, production, and collaboration.",
      story:
        "Film Production Club supports filmmakers through collaboration, practice, and community projects.",
      whyJoin: ["Collaborate", "Create films", "Meet creators"],
      contact: { email: "filmclubcsun@gmail.com" },
    },
  
    // Health / Service / General Interest (4)
    {
      slug: "blues-project",
      name: "BLUES Project (Mental Health Advocacy)",
      category: "Service",
      tagline: "Mental health advocacy and student support.",
      story:
        "BLUES Project promotes mental health awareness and student support through advocacy and events.",
      whyJoin: ["Advocacy", "Support community", "Awareness"],
      contact: { email: "bluesproject@csun.edu" },
    },
    {
      slug: "pre-nursing",
      name: "Pre-Nursing Club",
      category: "Service",
      tagline: "Support for students pursuing nursing pathways.",
      story:
        "Pre-Nursing Club supports students through community, resources, and preparation for nursing programs.",
      whyJoin: ["Resources", "Community", "Preparation"],
      contact: { email: "prenursing@my.csun.edu" },
    },
    {
      slug: "chess",
      name: "Chess Club",
      category: "Service",
      tagline: "Chess community for casual and competitive players.",
      story:
        "Chess Club brings together students to play, learn, and improve through community and matches.",
      whyJoin: ["Play regularly", "Improve skills", "Meet players"],
      contact: { email: "chess@my.csun.edu" },
    },
    {
      slug: "cada",
      name: "Child & Adolescent Development Association (CADA)",
      category: "Service",
      tagline: "Community for students interested in child and adolescent development.",
      story:
        "CADA supports students through community, events, and resources related to development studies.",
      whyJoin: ["Community", "Resources", "Events"],
      contact: { email: "cada@my.csun.edu" },
    },
  
    // Greek Life (2)
    {
      slug: "phi-mu",
      name: "Phi Mu (Sorority)",
      category: "Cultural",
      tagline: "Sorority community focused on connection and involvement.",
      story:
        "Phi Mu provides community, campus involvement, and member connection through events and activities.",
      whyJoin: ["Community", "Campus involvement", "Connection"],
      contact: { email: "phimu.csun@gmail.com" },
    },
    {
      slug: "phi-kappa-psi",
      name: "Phi Kappa Psi (Fraternity)",
      category: "Cultural",
      tagline: "Fraternity community focused on connection and involvement.",
      story:
        "Phi Kappa Psi provides community, campus involvement, and member connection through events and activities.",
      whyJoin: ["Community", "Campus involvement", "Connection"],
      contact: { email: "phikappapsi.csun@gmail.com" },
    },
  ];
  