import type {
  MajorPlan,
  SemesterBucket,
  UniCartClass,
  UniCartProfile,
  StudyGroup,
  SharedNote,
  NoteShareCategory,
  NoteFolder,
  NoteFolderItem,
  NoteComment,
} from "./constants";

// TODO (backend): Replace with GET with actual api routes once available. For now, these are used to build and test the frontend components in isolation from the backend development timeline.
export const seedSemesters: SemesterBucket[] = [
  {
    id: "Spring 2026",
    courses: [
      {
        id: "seed-comp333",
        subject: "COMP",
        number: "333",
        title: "Concepts of Programming Languages",
        professor: "Prof. Verma",
        units: 3,
        days: ["Mon", "Wed"],
        startTime: "10:00",
        endTime: "11:15",
        semester: "Spring 2026",
        isOnline: false,
        location: "JD 1600",
        sectionId: "12345",
        cardColor: "default",
        notes: [],
        resources: [],
        assignments: [
          { id: "a1", title: "Homework 1 – Lambda Calculus", dueDate: "2026-02-10T23:59:00", completed: true, priority: "medium" },
          { id: "a2", title: "Homework 2 – Type Systems", dueDate: "2026-04-28T23:59:00", completed: false, priority: "high" },
          { id: "a3", title: "Project Proposal", dueDate: "2026-05-15T23:59:00", completed: false, priority: "high" },
        ],
        exams: [
          { id: "e1", title: "Midterm Exam", date: "2026-03-10T10:00:00", type: "midterm", location: "JD 1600" },
          { id: "e2", title: "Final Exam", date: "2026-05-14T10:00:00", type: "final", location: "JD 1600" },
        ],
      },
      {
        id: "seed-math340",
        subject: "MATH",
        number: "340",
        title: "Introduction to Probability and Statistics",
        professor: "Dr. Smith",
        units: 3,
        days: ["Tue", "Thu"],
        startTime: "12:30",
        endTime: "13:45",
        semester: "Spring 2026",
        isOnline: false,
        location: "SN 120",
        sectionId: "23456",
        cardColor: "blue",
        notes: [],
        resources: [],
        assignments: [
          { id: "a4", title: "Problem Set 3", dueDate: "2026-04-20T23:59:00", completed: false, priority: "medium" },
          { id: "a5", title: "Problem Set 4", dueDate: "2026-05-05T23:59:00", completed: false, priority: "low" },
        ],
        exams: [
          { id: "e3", title: "Quiz 2", date: "2026-04-08T12:30:00", type: "quiz", location: "SN 120" },
          { id: "e4", title: "Midterm", date: "2026-04-12T12:30:00", type: "midterm", location: "SN 120" },
        ],
      },
      {
        id: "seed-comp356",
        subject: "COMP",
        number: "356",
        title: "File Structures & Object Oriented Programming",
        professor: "Dr. Chen",
        units: 3,
        days: ["Mon", "Wed", "Fri"],
        startTime: "09:00",
        endTime: "09:50",
        semester: "Spring 2026",
        isOnline: false,
        location: "JD 2208",
        sectionId: "34567",
        cardColor: "emerald",
        notes: [],
        resources: [],
        assignments: [
          { id: "a6", title: "Lab 4 – B-Trees", dueDate: "2026-04-14T23:59:00", completed: false, priority: "high" },
          { id: "a7", title: "Final Project", dueDate: "2026-05-10T23:59:00", completed: false, priority: "high" },
        ],
        exams: [
          { id: "e5", title: "Quiz 1", date: "2026-04-16T09:00:00", type: "quiz", location: "JD 2208" },
        ],
      },
    ],
  },
];

export const seedSelectedSemesterId = "Spring 2026";

// ─── Majors ─────────────────────────────────────────────────────────────────
// TODO (backend): Fetch from GET https://www.csun.edu/web-dev/api/curriculum/2.0/plans
export const mockMajors: MajorPlan[] = [
  { plan_id: "cs", plan_title: "Computer Science", academic_groups_title: "Engineering and Computer Science" },
  { plan_id: "bus", plan_title: "Business Administration", academic_groups_title: "David Nazarian College of Business" },
  { plan_id: "psy", plan_title: "Psychology", academic_groups_title: "Social & Behavioral Sciences" },
  { plan_id: "ce", plan_title: "Computer Engineering", academic_groups_title: "Engineering and Computer Science" },
  { plan_id: "math", plan_title: "Mathematics", academic_groups_title: "Science and Mathematics" },
  { plan_id: "bio", plan_title: "Biology", academic_groups_title: "Science and Mathematics" },
  { plan_id: "art", plan_title: "Art", academic_groups_title: "Arts, Media, and Communication" },
  { plan_id: "eng", plan_title: "English", academic_groups_title: "Humanities" },
  { plan_id: "chem", plan_title: "Chemistry", academic_groups_title: "Science and Mathematics" },
  { plan_id: "me", plan_title: "Mechanical Engineering", academic_groups_title: "Engineering and Computer Science" },
];

// ─── UniCart Class Library ───────────────────────────────────────────────────
// TODO (backend): Replace with live CSUN class search API
// Catalog search: https://cmsweb.csun.edu/psc/CNRPRD_1/EMPLOYEE/SA/c/NR_SSS_COMMON_MENU.CATALOG_SEARCH.GBL
// New class search: https://cmsweb.csun.edu/psc/CNRPRD_1/EMPLOYEE/SA/c/NR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL
// Catalog URL pattern: https://catalog.csun.edu/academics/{department}/courses/{section}
export const mockClassLibrary: UniCartClass[] = [
  {
    id: "c1", subject: "COMP", number: "322", title: "Internet & WWW",
    professor: "Dr. Rose", units: 3, semester: "Spring 2026", isOnline: false,
    days: ["Mon", "Wed"], startTime: "14:00", endTime: "15:15", section: "01",
    sectionId: "10001", seats: 35, seatsAvailable: 8, materialCost: 0,
    location: "JD 1600", building: "Jacaranda Hall", room: "1600",
    courseType: "Lecture", prerequisites: ["COMP 282"],
    catalogUrl: "https://catalog.csun.edu/academics/comp/courses/comp-322/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Rose",
    tags: ["Upper Division", "CS Core", "Web"],
  },
  {
    id: "c2", subject: "COMP", number: "380", title: "Software Engineering",
    professor: "Dr. Kazerouni", units: 3, semester: "Spring 2026", isOnline: false,
    days: ["Tue", "Thu"], startTime: "09:30", endTime: "10:45", section: "01",
    sectionId: "10002", seats: 40, seatsAvailable: 2, materialCost: 45,
    location: "JD 2208", building: "Jacaranda Hall", room: "2208",
    courseType: "Lecture", prerequisites: ["COMP 282", "COMP 256"],
    catalogUrl: "https://catalog.csun.edu/academics/comp/courses/comp-380/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Kazerouni",
    tags: ["Upper Division", "CS Core", "GE: Lifelong Learning"],
  },
  {
    id: "c3", subject: "COMP", number: "420", title: "Operating Systems",
    professor: "Prof. Lee", units: 3, semester: "Spring 2026", isOnline: false,
    days: ["Mon", "Wed", "Fri"], startTime: "11:00", endTime: "11:50", section: "02",
    sectionId: "10003", seats: 30, seatsAvailable: 15, materialCost: 0,
    location: "JD 1610", building: "Jacaranda Hall", room: "1610",
    courseType: "Lecture", prerequisites: ["COMP 310", "COMP 356"],
    catalogUrl: "https://catalog.csun.edu/academics/comp/courses/comp-420/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Lee",
    tags: ["Upper Division", "CS Core"],
  },
  {
    id: "c4", subject: "MATH", number: "250", title: "Calculus II",
    professor: "Dr. Patel", units: 4, semester: "Spring 2026", isOnline: false,
    days: ["Mon", "Tue", "Wed", "Thu"], startTime: "08:00", endTime: "08:50", section: "05",
    sectionId: "10004", seats: 45, seatsAvailable: 20, materialCost: 120,
    location: "SN 120", building: "Science Hall North", room: "120",
    courseType: "Lecture", prerequisites: ["MATH 150A"],
    catalogUrl: "https://catalog.csun.edu/academics/math/courses/math-250/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Patel",
    tags: ["Lower Division", "GE: Quantitative Reasoning", "Math Requirement"],
  },
  {
    id: "c5", subject: "COMP", number: "490", title: "Senior Design Project",
    professor: "Dr. Tseng", units: 3, semester: "Spring 2026", isOnline: false,
    days: ["Thu"], startTime: "18:00", endTime: "20:45", section: "01",
    sectionId: "10005", seats: 25, seatsAvailable: 6, materialCost: 0,
    location: "JD 2410", building: "Jacaranda Hall", room: "2410",
    courseType: "Seminar", prerequisites: ["COMP 380", "Senior Standing"],
    catalogUrl: "https://catalog.csun.edu/academics/comp/courses/comp-490/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Tseng",
    tags: ["Senior Capstone", "Upper Division"],
  },
  {
    id: "c6", subject: "ENGL", number: "115", title: "College Writing",
    professor: "Prof. Garcia", units: 3, semester: "Spring 2026", isOnline: true,
    days: [], startTime: "", endTime: "", section: "80",
    sectionId: "10006", seats: 30, seatsAvailable: 12, materialCost: 0,
    location: "Online", building: "", room: "",
    courseType: "Lecture", prerequisites: [],
    catalogUrl: "https://catalog.csun.edu/academics/engl/courses/engl-115/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Garcia",
    tags: ["GE: Basic Skills", "Lower Division", "Writing"],
  },
  {
    id: "c7", subject: "COMP", number: "310", title: "Computer Architecture",
    professor: "Dr. Hoang", units: 3, semester: "Spring 2026", isOnline: false,
    days: ["Tue", "Thu"], startTime: "14:00", endTime: "15:15", section: "01",
    sectionId: "10007", seats: 35, seatsAvailable: 0, materialCost: 60,
    location: "JD 1600", building: "Jacaranda Hall", room: "1600",
    courseType: "Lecture", prerequisites: ["COMP 110", "COMP 182"],
    catalogUrl: "https://catalog.csun.edu/academics/comp/courses/comp-310/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Hoang",
    tags: ["Upper Division", "CS Core"],
    waitlistCount: 12,
  },
  {
    id: "c8", subject: "COMP", number: "350", title: "Database Management",
    professor: "Prof. Alami", units: 3, semester: "Spring 2026", isOnline: false,
    days: ["Mon", "Wed"], startTime: "16:00", endTime: "17:15", section: "01",
    sectionId: "10008", seats: 40, seatsAvailable: 18, materialCost: 0,
    location: "JD 2208", building: "Jacaranda Hall", room: "2208",
    courseType: "Lecture", prerequisites: ["COMP 256"],
    catalogUrl: "https://catalog.csun.edu/academics/comp/courses/comp-350/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Alami",
    tags: ["Upper Division", "CS Elective", "Database"],
  },
  {
    id: "c9", subject: "COMP", number: "350L", title: "Database Management Lab",
    professor: "Prof. Alami", units: 1, semester: "Spring 2026", isOnline: false,
    days: ["Wed"], startTime: "17:30", endTime: "18:20", section: "01",
    sectionId: "10009", seats: 40, seatsAvailable: 18, materialCost: 0,
    location: "JD 2210", building: "Jacaranda Hall", room: "2210",
    courseType: "Lab", linkedLab: "10008", prerequisites: ["COMP 256"],
    catalogUrl: "https://catalog.csun.edu/academics/comp/courses/comp-350l/",
    tags: ["Lab", "Correlated Lab for COMP 350"],
  },
  {
    id: "c10", subject: "ART", number: "100L", title: "Fundamentals of Drawing",
    professor: "Prof. Martinez", units: 3, semester: "Spring 2026", isOnline: false,
    days: ["Mon", "Wed"], startTime: "13:00", endTime: "15:40", section: "01",
    sectionId: "10010", seats: 20, seatsAvailable: 5, materialCost: 85,
    location: "FA 102", building: "Fine Arts Building", room: "102",
    courseType: "Activity", prerequisites: [],
    catalogUrl: "https://catalog.csun.edu/academics/art/courses/art-100l/",
    rmpUrl: "https://www.ratemyprofessors.com/search/professors/1800?q=Martinez",
    tags: ["GE: Arts", "Lower Division", "Studio Art"],
  },
];

// ─── Student Profiles for UniCart matching ──────────────────────────────────
// TODO (backend): Replace with real user profiles from Supabase
export const mockStudentProfiles: UniCartProfile[] = [
  {
    id: "u1", name: "Alex Rivera", major: "Computer Science", year: "Junior",
    classes: [mockClassLibrary[0], mockClassLibrary[2], mockClassLibrary[4]],
  },
  {
    id: "u2", name: "Jordan Kim", major: "Computer Science", year: "Senior",
    classes: [mockClassLibrary[1], mockClassLibrary[4], mockClassLibrary[7]],
  },
  {
    id: "u3", name: "Sam Patel", major: "Computer Engineering", year: "Junior",
    classes: [mockClassLibrary[0], mockClassLibrary[3], mockClassLibrary[6]],
  },
  {
    id: "u4", name: "Morgan Lee", major: "Mathematics", year: "Sophomore",
    classes: [mockClassLibrary[3], mockClassLibrary[5]],
  },
];

// ─── Study Groups ────────────────────────────────────────────────────────────
// TODO (backend): Replace with Supabase study_groups table queries
// Auto-prune: groups expire 3 days after their dateTime
export const mockStudyGroups: StudyGroup[] = [
  {
    id: "sg1",
    courseSubject: "COMP",
    courseNumber: "333",
    topic: "Midterm Review – Type Systems & Lambda Calculus",
    tags: ["STEM", "Computer Science"],
    dateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
    location: "Oviatt Library – Room 2",
    isVirtual: false,
    members: [{ id: "m1", name: "alex@my.csun.edu" }, { id: "m2", name: "jordan@my.csun.edu" }],
    createdBy: "alex@my.csun.edu",
    createdAt: new Date().toISOString(),
    maxMembers: 6,
    notes: "Bring your typed notes from weeks 1-7. We'll be going over the midterm practice problems.",
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    isPrivate: false,
  },
  {
    id: "sg2",
    courseSubject: "MATH",
    courseNumber: "340",
    topic: "Probability Distributions Deep Dive",
    tags: ["STEM", "Math"],
    dateTime: new Date(Date.now() + 4 * 86400000).toISOString(),
    location: "Zoom",
    isVirtual: true,
    meetingLink: "https://csun.zoom.us/j/123456",
    members: [{ id: "m3", name: "sam@my.csun.edu" }],
    createdBy: "sam@my.csun.edu",
    createdAt: new Date().toISOString(),
    maxMembers: 5,
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    isPrivate: true,
    invitedEmails: ["alex@my.csun.edu", "jordan@my.csun.edu"],
  },
];

// ─── Note Share ──────────────────────────────────────────────────────────────
// TODO (backend): Replace with Supabase note_share table
export const mockNoteCategories: NoteShareCategory[] = [
  { id: "nc1", department: "COMP", courseCode: "COMP 333", courseTitle: "Concepts of Programming Languages" },
  { id: "nc2", department: "COMP", courseCode: "COMP 356", courseTitle: "File Structures & OOP" },
  { id: "nc3", department: "COMP", courseCode: "COMP 350", courseTitle: "Database Management" },
  { id: "nc4", department: "MATH", courseCode: "MATH 340", courseTitle: "Intro to Probability & Statistics" },
  { id: "nc5", department: "ENGL", courseCode: "ENGL 115", courseTitle: "College Writing" },
];

export const mockSharedNotes: SharedNote[] = [
  {
    id: "sn1", title: "Lambda Calculus Cheat Sheet", author: "Alex R.", authorEmail: "alex@my.csun.edu",
    category: "COMP 333", body: "α-reduction, β-reduction, η-conversion explained with examples...",
    fileType: "pdf", isPublic: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    likes: 14, views: 82,
  },
  {
    id: "sn2", title: "B-Tree Visualization Notes", author: "Jordan K.", authorEmail: "jordan@my.csun.edu",
    category: "COMP 356", body: "Complete visual guide to B-Tree insertion and deletion...",
    fileType: "image", isPublic: true, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    likes: 22, views: 130,
  },
];

// ─── Note Share v2 (Folders) ───────────────────────────────────────────────
// TODO (backend): Replace with note_folders, note_items, and note_comments tables

export const mockNoteFolders: NoteFolder[] = [
  {
    id: "nf1",
    topic: "Lambda Calculus Cheat Sheet",
    description: "Compact reference for \u03b1/\u03b2/\u03b7 conversions and common reductions.",
    subject: "COMP",
    courseNumber: "333",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    createdByEmail: "alex@my.csun.edu",
    visibility: "public",
    tags: ["STEM", "Computer Science"],
    savedByMe: true,
  },
  {
    id: "nf2",
    topic: "B-Tree Visual Guides",
    description: "Visual notes for insertions, deletions, and rebalancing.",
    subject: "COMP",
    courseNumber: "356",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    createdByEmail: "jordan@my.csun.edu",
    visibility: "public",
    tags: ["STEM", "Computer Science"],
  },
  {
    id: "nf3",
    topic: "Probability Distributions Practice",
    description: "Worked examples and practice sets for common distributions.",
    subject: "MATH",
    courseNumber: "340",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdByEmail: "sam@my.csun.edu",
    visibility: "private",
    invitedEmails: ["alex@my.csun.edu", "jordan@my.csun.edu"],
    tags: ["STEM", "Math"],
    savedByMe: true,
  },
];

export const mockNoteFolderItems: NoteFolderItem[] = [
  {
    id: "nfi1",
    folderId: "nf1",
    title: "Complete Lambda Calc Sheet (PDF)",
    description: "One-page summary with examples and common pitfalls.",
    uploadedBy: "Alex R.",
    uploadedByEmail: "alex@my.csun.edu",
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    type: "pdf",
    fileName: "lambda-cheat-sheet.pdf",
    fileSize: "412 KB",
    url: "https://example.com/lambda-cheat-sheet.pdf",
    visibility: "public",
  },
  {
    id: "nfi2",
    folderId: "nf2",
    title: "Insertion + Split Visuals (PNG)",
    description: "Step-by-step diagrams for B-Tree insertion and split cases.",
    uploadedBy: "Jordan K.",
    uploadedByEmail: "jordan@my.csun.edu",
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    type: "image",
    fileName: "btree-insertion.png",
    fileSize: "1.2 MB",
    url: "https://example.com/btree-insertion.png",
    visibility: "public",
  },
  {
    id: "nfi3",
    folderId: "nf3",
    title: "Distribution Practice Set (DOCX)",
    description: "Problems + solutions for Binomial, Poisson, Normal, Exponential.",
    uploadedBy: "Sam P.",
    uploadedByEmail: "sam@my.csun.edu",
    uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    type: "doc",
    fileName: "distributions-practice.docx",
    fileSize: "238 KB",
    url: "https://example.com/distributions-practice.docx",
    visibility: "private",
  },
  {
    id: "nfi4",
    folderId: "nf1",
    title: "Video Walkthrough: \u03b2-reduction (Link)",
    description: "Short walkthrough showing reductions on common expressions.",
    uploadedBy: "Alex R.",
    uploadedByEmail: "alex@my.csun.edu",
    uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    type: "link",
    url: "https://example.com/lambda-beta-video",
    visibility: "public",
  },
];

export const mockNoteComments: NoteComment[] = [
  {
    id: "ncmt1",
    folderId: "nf1",
    itemId: "nfi1",
    author: "Jordan K.",
    authorEmail: "jordan@my.csun.edu",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    rating: 5,
    body: "Super clear and compact. Helped a lot for midterm review.",
  },
  {
    id: "ncmt2",
    folderId: "nf2",
    itemId: "nfi2",
    author: "Alex R.",
    authorEmail: "alex@my.csun.edu",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rating: 4,
    body: "Diagrams are great. Would love one more example for deletion merges.",
  },
];
