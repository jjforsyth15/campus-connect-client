// ---------------------------------------------------------------------------
// icsData.ts mockup data for SRC events banner and schedule — replace with live API data.
// Parsed from csun-news-events-63aa8039994.ics (CSUN SRC calendar feed).
// Source: https://news.csun.edu  — refreshed hourly per X-PUBLISHED-TTL:PT1H
//
// BACKEND TODO: Replace this static array with actual api to  live fetch from the ICS feed:
//   GET https://news.csun.edu/events/feed/ical/ 
//   Parse with a library like `ical.js` or `node-ical` in a Next.js Route Handler:
//   /app/api/src-events/route.ts  →  returns CalEvent[]
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
// Mockup weekly GX class schedule — replace with live SRC Portal API data.
// BACKEND TODO: Fetch from the SRC scheduling system (e.g. Fusion or IMLeagues)
//   and map to this WeeklyClass shape.
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
