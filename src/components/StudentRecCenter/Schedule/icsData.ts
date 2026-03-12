// ---------------------------------------------------------------------------
// icsData.ts  —  STATIC MOCK DATA (dev/preview only)
// ---------------------------------------------------------------------------
// This file is a stand-in for two live data sources:
//   1. CSUN ICS calendar feed  →  EventsBanner (CalEvent[])
//   2. SRC scheduling system   →  WeeklySchedule (WeeklyClass[])
//
// ═══════════════════════════════════════════════════════════════════════════
// BACKEND TODO A — Live ICS feed for CalEvent[] (EventsBanner)
// ═══════════════════════════════════════════════════════════════════════════
//
// SOURCE:  https://news.csun.edu/events/feed/ical/
// TTL:     X-PUBLISHED-TTL: PT1H  (refresh every hour)
//
// ROUTE HANDLER  →  /app/api/src-events/route.ts
// ──────────────────────────────────────────────
//   import ical from "node-ical";                    // npm i node-ical
//   // or: import ICAL from "ical.js";               // npm i ical.js
//
//   export async function GET() {
//     const icsUrl = "https://news.csun.edu/events/feed/ical/";
//     const data   = await ical.fromURL(icsUrl);     // node-ical: async HTTP fetch + parse
//
//     const events: CalEvent[] = Object.values(data)
//       .filter((e: any) => e.type === "VEVENT")
//       .map((e: any) => ({
//         uid:         e.uid,
//         summary:     e.summary,
//         description: e.description?.replace(/\\n/g, "\n") ?? "",
//         location:    e.location ?? "",
//         dtstart:     e.start?.toISOString() ?? "",
//         dtend:       e.end?.toISOString()   ?? "",
//         url:         e.url ?? "",
//         imageUrl:    e["x-wp-image"] ?? "",         // CSUN-specific extension prop
//         allDay:      e.datetype === "date",          // node-ical: "date" = all-day
//         categories:  Array.isArray(e.categories)
//                        ? e.categories
//                        : (e.categories ? [e.categories] : []),
//       }));
//
//     return Response.json(events, {
//       headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=300" },
//     });
//   }
//
// CLIENT USAGE (replace SRC_EVENTS import in EventsBanner.tsx):
//   const { data: events } = useSWR<CalEvent[]>("/api/src-events", fetcher, {
//     refreshInterval: 60 * 60 * 1000,   // re-fetch every hour, matches ICS TTL
//   });
//
// FILTER RELEVANCE (keep only SRC / sport-club events):
//   .filter((e) => e.categories.some((c) =>
//     ["Student Recreation Center", "University Student Union"].includes(c)))
//
// ═══════════════════════════════════════════════════════════════════════════
// BACKEND TODO B — Live class schedule for WeeklyClass[] (WeeklySchedule)
// ═══════════════════════════════════════════════════════════════════════════
//
// SOURCE:  SRC scheduling platform (Fusion / IMLeagues / ActiveNet / 25Live)
//          Check with SRC staff which system is in use and whether a REST or
//          GraphQL API / export is available.
//
// RECOMMENDED APPROACH — scheduled nightly sync:
//   1. Pull the week's class schedule from the SRC API or exported JSON/CSV.
//   2. Store normalized rows in your DB:
//        Table: src_gx_classes
//          id          TEXT PRIMARY KEY,
//          name        TEXT,
//          instructor  TEXT,
//          location    TEXT,
//          day_of_week INT,   -- 0=Sun … 6=Sat
//          start_time  TIME,  -- "07:00"
//          end_time    TIME,  -- "07:50"
//          category    TEXT,  -- cardio | strength | mind-body | aquatics | dance | hiit
//          spots       INT,
//          spots_left  INT,   -- UPDATE via live booking webhook if available
//          updated_at  TIMESTAMPTZ DEFAULT NOW()
//   3. Expose via:
//        GET /api/src-schedule?week=2026-03-09
//        Returns: WeeklyClass[] for the given week (or current week if no param)
//
// ROUTE HANDLER  →  /app/api/src-schedule/route.ts
// ──────────────────────────────────────────────────
//   export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const week = searchParams.get("week") ?? dayjs().startOf("week").format("YYYY-MM-DD");
//
//     // If provider has a direct API:
//     const classes = await fetchFromSrcProvider(week);
//
//     // Or query your own DB (Supabase example):
//     const { data } = await supabase
//       .from("src_gx_classes")
//       .select("*")
//       .order("day_of_week")
//       .order("start_time");
//
//     return Response.json(data, {
//       headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=300" },
//     });
//   }
//
// CLIENT USAGE (replace WEEKLY_CLASSES import in WeeklySchedule.tsx):
//   const [weekStart, setWeekStart] = React.useState(dayjs().startOf("week"));
//   const { data: classes = [] } = useSWR<WeeklyClass[]>(
//     `/api/src-schedule?week=${weekStart.format("YYYY-MM-DD")}`,
//     fetcher
//   );
//   // Pass `classes` as a prop or lift into context so WeeklySchedule
//   // re-fetches automatically when the user navigates to a different week.
//
// SPOTS REAL-TIME (optional):
//   If the SRC booking system supports webhooks, listen for booking events:
//     POST /api/webhooks/src-booking
//     body: { classId, spotsLeft }
//   Update the DB row and invalidate the SWR cache key.
// ---------------------------------------------------------------------------

export type CalEvent = {
  uid: string;
  summary: string;
  description: string;
  location: string;
  dtstart: string;
  dtend: string;
  url: string;
  imageUrl?: string;
  allDay: boolean;
  categories: string[];
};

export const SRC_EVENTS: CalEvent[] = [
  {
    uid: "10010319-1770595200-1773359999@news.csun.edu",
    summary: "Level Up Your Fitness",
    description:
      "Level up on your fitness journey at the SRC's group exercise (GX) classes and unlock special items throughout the month! After GX attendance reaches a total of 1,500, those who took one or more classes will be entered into a drawing for a Wellness Bundle and Beats Studio Pro Premium Wireless Over-Ear Headphones.",
    location: "Student Recreation Center, University Student Union, 18111 Nordhoff St., Northridge, CA 91330",
    dtstart: "2026-02-09",
    dtend: "2026-03-13",
    url: "https://news.csun.edu/event/level-up-your-fitness/",
    imageUrl: "https://news.csun.edu/wp-content/uploads/2026/01/Calendar-LevelUpYourFitness_SP26.png",
    allDay: true,
    categories: ["Student Recreation Center", "University Student Union"],
  },
  {
    uid: "10010243-1772150400-1778371199@news.csun.edu",
    summary: "American Red Cross CPR / First-Aid / AED Classes",
    description:
      "Get certified and equipped with important life-saving skills through American Red Cross Adult and Pediatric CPR/First-Aid/AED training! Learn to respond to cardio-respiratory emergencies calmly and confidently through this hands-on course. Register on the SRC Portal or at the SRC Front Desk today!",
    location: "Student Recreation Center, University Student Union, 18111 Nordhoff St., Northridge, CA 91330",
    dtstart: "2026-02-27",
    dtend: "2026-05-10",
    url: "https://news.csun.edu/event/american-red-cross-cpr-first-aid-aed-classes/",
    imageUrl: "https://news.csun.edu/wp-content/uploads/2026/01/Calendar_AmericanRedCrossCPR_SP26.png",
    allDay: true,
    categories: ["Student Recreation Center", "University Student Union"],
  },
  {
    uid: "10010499-1772409600-1778284799@news.csun.edu",
    summary: "Spring 2026 Intramural Sports Season",
    description:
      "Sign up through Fusion Play today and get ready to bring the heat! Basketball, Ultimate Frisbee, Volleyball, Indoor Soccer, and Softball leagues running through May.",
    location: "Student Recreation Center, University Student Union, 18111 Nordhoff St., Northridge, CA 91330",
    dtstart: "2026-03-02",
    dtend: "2026-05-09",
    url: "https://news.csun.edu/event/spring-2026-intramural-sports-season-registration/",
    imageUrl: "https://news.csun.edu/wp-content/uploads/2026/02/Calendar-IntramuralSports-SP26.png",
    allDay: true,
    categories: ["Student Recreation Center", "University Student Union"],
  },
  {
    uid: "10010581-1773014400-1775260799@news.csun.edu",
    summary: "Gear Up for Round 4 Round",
    description:
      "Slip into the Boxing Training Program (BTP), collect prizes and be entered in drawings for TITLE boxing gloves and a JBL speaker! All first-timers must complete a 45-minute orientation. Hand wraps available for purchase at the SRC Front Desk.",
    location: "Determination Studio, Student Recreation Center, University Student Union, 18111 Nordhoff Street, Northridge 91330",
    dtstart: "2026-03-09",
    dtend: "2026-04-04",
    url: "https://news.csun.edu/event/gear-up-for-round-4-round/",
    imageUrl: "https://news.csun.edu/wp-content/uploads/2026/02/Cal-BTP-R4R-SP26.png",
    allDay: true,
    categories: ["Student Recreation Center", "University Student Union"],
  },
  {
    uid: "10010570-1773014400-1776643199@news.csun.edu",
    summary: "Strong 5 Personal Training Program",
    description:
      "Build strength, muscle and confidence with the Strong 5 training program! Over six weeks, you'll work weekly with a personal trainer to improve squat, hinge, press, pull and gait. Program costs $140 for students, $295 for non-students.",
    location: "Student Recreation Center, University Student Union, 18111 Nordhoff St., Northridge, CA 91330",
    dtstart: "2026-03-09",
    dtend: "2026-04-20",
    url: "https://news.csun.edu/event/strong-5/",
    imageUrl: "",
    allDay: true,
    categories: ["Student Recreation Center", "University Student Union"],
  },
  {
    uid: "fifa-20260326@news.csun.edu",
    summary: "FIFA Tournament",
    description:
      "Game on, Matadors! The SRC is hosting a series of tournaments in the Games Room for you to show off your skills and win amazing prizes. Sign up and let the games begin!",
    location: "Games Room, University Student Union, 18111 Nordhoff St., Northridge, CA 91330",
    dtstart: "2026-03-26T17:00:00-07:00",
    dtend: "2026-03-26T21:00:00-07:00",
    url: "https://news.csun.edu/event/fifa/",
    imageUrl: "",
    allDay: false,
    categories: ["Student Recreation Center", "University Student Union"],
  },
];

// ---------------------------------------------------------------------------
// WEEKLY_CLASSES mock data — replace with live /api/src-schedule response.
// See BACKEND TODO B above for full implementation details.
// ---------------------------------------------------------------------------

export type WeeklyClass = {
  id: string;
  name: string;
  instructor: string;
  location: string;
  /** 0=Sun … 6=Sat */
  dayOfWeek: number;
  /** "HH:mm" 24-hour */
  startTime: string;
  endTime: string;
  category: "cardio" | "strength" | "mind-body" | "aquatics" | "dance" | "hiit";
  spots?: number;
  spotsLeft?: number;
};

export const WEEKLY_CLASSES: WeeklyClass[] = [
  // Monday
  { id: "m1", name: "Morning Yoga Flow", instructor: "Sofia R.", location: "Studio A", dayOfWeek: 1, startTime: "07:00", endTime: "07:50", category: "mind-body", spots: 20, spotsLeft: 6 },
  { id: "m2", name: "Spin & Burn", instructor: "Marcus T.", location: "Cycle Studio", dayOfWeek: 1, startTime: "09:00", endTime: "09:50", category: "cardio", spots: 16, spotsLeft: 3 },
  { id: "m3", name: "HIIT Fusion", instructor: "Dana K.", location: "Studio B", dayOfWeek: 1, startTime: "12:00", endTime: "12:45", category: "hiit", spots: 24, spotsLeft: 12 },
  { id: "m4", name: "Zumba", instructor: "Lucia V.", location: "Studio A", dayOfWeek: 1, startTime: "18:00", endTime: "19:00", category: "dance", spots: 30, spotsLeft: 18 },
  // Tuesday
  { id: "t1", name: "Boxing Conditioning", instructor: "Carlos M.", location: "Determination Studio", dayOfWeek: 2, startTime: "08:00", endTime: "08:55", category: "hiit", spots: 18, spotsLeft: 0 },
  { id: "t2", name: "Aqua Aerobics", instructor: "Kim L.", location: "Aquatic Center", dayOfWeek: 2, startTime: "10:00", endTime: "10:50", category: "aquatics", spots: 14, spotsLeft: 7 },
  { id: "t3", name: "Power Sculpt", instructor: "Jordan P.", location: "Studio B", dayOfWeek: 2, startTime: "17:00", endTime: "17:55", category: "strength", spots: 20, spotsLeft: 9 },
  { id: "t4", name: "Restorative Yoga", instructor: "Sofia R.", location: "Studio A", dayOfWeek: 2, startTime: "19:00", endTime: "20:00", category: "mind-body", spots: 20, spotsLeft: 14 },
  // Wednesday
  { id: "w1", name: "Pilates Core", instructor: "Anna S.", location: "Studio A", dayOfWeek: 3, startTime: "07:30", endTime: "08:20", category: "mind-body", spots: 16, spotsLeft: 5 },
  { id: "w2", name: "Tabata Blast", instructor: "Marcus T.", location: "Studio B", dayOfWeek: 3, startTime: "12:00", endTime: "12:45", category: "hiit", spots: 22, spotsLeft: 11 },
  { id: "w3", name: "Barre Fit", instructor: "Mia F.", location: "Studio A", dayOfWeek: 3, startTime: "17:00", endTime: "17:55", category: "dance", spots: 18, spotsLeft: 8 },
  { id: "w4", name: "Spin & Burn", instructor: "Dana K.", location: "Cycle Studio", dayOfWeek: 3, startTime: "18:30", endTime: "19:20", category: "cardio", spots: 16, spotsLeft: 2 },
  // Thursday
  { id: "th1", name: "Morning Yoga Flow", instructor: "Sofia R.", location: "Studio A", dayOfWeek: 4, startTime: "07:00", endTime: "07:50", category: "mind-body", spots: 20, spotsLeft: 10 },
  { id: "th2", name: "Boxing Conditioning", instructor: "Carlos M.", location: "Determination Studio", dayOfWeek: 4, startTime: "09:00", endTime: "09:55", category: "hiit", spots: 18, spotsLeft: 4 },
  { id: "th3", name: "TRX Suspension", instructor: "Jordan P.", location: "Total Training Zone", dayOfWeek: 4, startTime: "12:00", endTime: "12:50", category: "strength", spots: 12, spotsLeft: 12 },
  { id: "th4", name: "Zumba", instructor: "Lucia V.", location: "Studio A", dayOfWeek: 4, startTime: "17:00", endTime: "18:00", category: "dance", spots: 30, spotsLeft: 22 },
  // Friday
  { id: "f1", name: "HIIT Fusion", instructor: "Marcus T.", location: "Studio B", dayOfWeek: 5, startTime: "07:30", endTime: "08:15", category: "hiit", spots: 24, spotsLeft: 8 },
  { id: "f2", name: "Aqua Aerobics", instructor: "Kim L.", location: "Aquatic Center", dayOfWeek: 5, startTime: "10:00", endTime: "10:50", category: "aquatics", spots: 14, spotsLeft: 5 },
  { id: "f3", name: "Power Sculpt", instructor: "Jordan P.", location: "Studio B", dayOfWeek: 5, startTime: "15:00", endTime: "15:55", category: "strength", spots: 20, spotsLeft: 16 },
  // Saturday
  { id: "sa1", name: "Weekend Warriors", instructor: "Dana K.", location: "Studio B", dayOfWeek: 6, startTime: "09:00", endTime: "09:55", category: "hiit", spots: 26, spotsLeft: 13 },
  { id: "sa2", name: "Slow Flow Yoga", instructor: "Anna S.", location: "Studio A", dayOfWeek: 6, startTime: "10:30", endTime: "11:30", category: "mind-body", spots: 20, spotsLeft: 7 },
  // Sunday
  { id: "su1", name: "Sunday Stretch", instructor: "Mia F.", location: "Studio A", dayOfWeek: 0, startTime: "10:00", endTime: "10:50", category: "mind-body", spots: 20, spotsLeft: 15 },
  { id: "su2", name: "Cycle & Recover", instructor: "Marcus T.", location: "Cycle Studio", dayOfWeek: 0, startTime: "11:00", endTime: "11:50", category: "cardio", spots: 16, spotsLeft: 9 },
];
