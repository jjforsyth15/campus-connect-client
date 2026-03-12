// @/components/StudentRecCenter/Services/ServicesData.ts
// Real content from https://www.csun.edu/src/services

import type { SvgIconComponent } from "@mui/icons-material";

export type ServiceId =
  | "pro-shop"
  | "personal-training"
  | "recovery"
  | "private-instruction"
  | "cpr-firstaid"
  | "reservations"
  | "lockers"
  | "towels"
  | "accessibility";

export interface RentalItem {
  name: string;
}

export interface TrainerProfile {
  name: string;
  role: string;
  certifications: string[];
  education: string[];
  specialties: string[];
  quote: string;
  imageSrc: string;
}

export interface ReservationSpace {
  name: string;
  floor?: string;
  capacity?: string;
  features: string[];
  activities: string[];
}

export interface ServiceModule {
  id: ServiceId;
  /** Anchor hash — used by deep-link from root homepage categories */
  anchor: string;
  title: string;
  tagline: string;
  description: string;
  imageSrc: string;
  /** MUI icon name string (matched in ServicesIcons.tsx) */
  iconName: string;
  accentColor: string;
  badge?: string;
  cta?: { label: string; href: string };
  rentalItems?: RentalItem[];
  trainers?: TrainerProfile[];
  spaces?: ReservationSpace[];
  bullets?: string[];
}

export const SERVICES: ServiceModule[] = [
  {
    id: "pro-shop",
    anchor: "pro-shop",
    title: "Pro Shop",
    tagline: "Gear up. Check out. Get moving.",
    description:
      "Stop by the SRC front desk to borrow equipment for your session — from basketballs and badminton racquets to climbing shoes and resistance bands. A valid CSUN ID may be required.",
    imageSrc: "/images/proshop.png",
    iconName: "StorefrontRounded",
    accentColor: "#3b82f6",
    badge: "Free to Borrow",
    rentalItems: [
      { name: "Ab roller" },
      { name: "Agility ladder" },
      { name: "Badminton birdies" },
      { name: "Badminton rackets" },
      { name: "Balance disc" },
      { name: "Belly dancing sarong" },
      { name: "Chalk bags" },
      { name: "Climbing shoes" },
      { name: "Dip belt" },
      { name: "Futsal balls" },
      { name: "Harness package" },
      { name: "Indoor soccer balls" },
      { name: "Jump ropes" },
      { name: "Key locks" },
      { name: "Basketballs" },
      { name: "Pool/shower towels" },
      { name: "Push up bars" },
      { name: "Racquetball balls" },
      { name: "Racquetball goggles" },
      { name: "Racquetball rackets" },
      { name: "Resistance bands" },
      { name: "Table tennis balls" },
      { name: "Table tennis paddles" },
      { name: "Thera-bands" },
      { name: "Volleyballs" },
      { name: "Weight belts" },
      { name: "Workout towels" },
    ],
  },
  {
    id: "personal-training",
    anchor: "personal-training",
    title: "Personal Training",
    tagline: "One coach. Your goals. Zero guesswork.",
    description:
      "Work one-on-one with a certified personal trainer at the Bryan Green Matador Training Zone. Sign up via the SRC Portal or at the front desk. Fitness evaluations and equipment orientations are free.",
    imageSrc: "/images/private.png",
    iconName: "FitnessCenterRounded",
    accentColor: "#ef4444",
    badge: "55-min sessions",
    cta: { label: "Book on SRC Portal", href: "https://srcportal.csun.edu/" },
    bullets: [
      "Free 30-min fitness evaluation (basic body composition)",
      "Free equipment orientation for groups of 3–6",
      "55-minute personalized sessions",
      "Body composition, heart rate, blood pressure & aerobic assessments",
      "Customized programming for strength, endurance or sport-specific skills",
    ],
    trainers: [
      {
        name: "David",
        role: "Fitness Training Supervisor",
        certifications: ["ACE Certified Personal Trainer", "ACE Sports Performance Specialist"],
        education: ["B.S. in Kinesiology, Exercise Science"],
        specialties: ["Strength training", "Muscle building", "Fat loss", "Exercise program design"],
        quote: "Discipline equals freedom. — Jocko Willink",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/DavidJimenez.jpg",
      },
      {
        name: "Audrie",
        role: "Personal Trainer Supervisor",
        certifications: ["ACE Certified Personal Trainer", "USAWL1 Olympic Lifting Coach", "PNL2 Nutrition Coach"],
        education: ["B.S. Kinesiology, Exercise Science", "Pursuing M.S. Human Nutrition"],
        specialties: ["Weight loss nutrition", "Muscle growth programming", "Holistic health", "Injury prevention"],
        quote: "You have power over your mind — not outside events. — Marcus Aurelius",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Audrie.jpg",
      },
      {
        name: "Abdulla",
        role: "Personal Trainer",
        certifications: ["NCSF Certified Personal Trainer"],
        education: ["M.S. Business Analytics (In-Progress)"],
        specialties: ["Technique-first strength", "Customized programs", "Data-driven coaching"],
        quote: "Don't count the reps. Make the reps count. — Arnold Schwarzenegger",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Abdulla.jpg",
      },
      {
        name: "Damian",
        role: "Personal Trainer",
        certifications: ["ACE Certified Personal Trainer"],
        education: ["B.S. Kinesiology (In-Progress)"],
        specialties: ["Form correction", "Athletic conditioning"],
        quote: "Efforts and courage are not enough without purpose and direction. — JFK",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Damian.jpg",
      },
      {
        name: "Gregory",
        role: "Personal Trainer",
        certifications: ["NASM Certified Personal Trainer"],
        education: ["B.S. Kinesiology, Exercise Science (In-Progress)"],
        specialties: ["Strength training", "Muscle growth", "Core & functional strength"],
        quote: "He who has a why to live can bear almost any how. — Nietzsche",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Gregory.jpg",
      },
      {
        name: "Jeffrey",
        role: "Personal Trainer",
        certifications: ["ISSA Certified Personal Trainer"],
        education: ["B.S. Kinesiology, Applied Fitness (In-Progress)"],
        specialties: ["Military-grade conditioning", "Group fitness programming"],
        quote: "Whether you think you can or you can't — you're right.",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Jeffery.jpg",
      },
      {
        name: "Nicole",
        role: "Personal Trainer",
        certifications: ["ISSA Certified Personal Trainer", "BODPOD Composition Testing Certified"],
        education: ["B.S. Nutrition/Dietetics & Food Science (In-Progress)"],
        specialties: ["Sports nutrition", "Body composition testing", "Health assessments"],
        quote: "To live is the rarest thing in the world. Most people exist, that is all. — Oscar Wilde",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Nicole.jpg",
      },
      {
        name: "Tzu Ting",
        role: "Personal Trainer",
        certifications: ["NASM Certified Personal Trainer"],
        education: ["B.S. Kinesiology, Exercise Science (In-Progress)"],
        specialties: ["Speed performance", "Strength & conditioning", "Youth athlete programming"],
        quote: "One day you'll leave this world behind, so live a life you'll remember.",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Tzu-Ting.jpg",
      },
    ],
  },
  {
    id: "recovery",
    anchor: "recovery",
    title: "Recovery Sessions",
    tagline: "Recover smarter. Come back stronger.",
    description:
      "Borrow a Theragun for a free 30-minute session to support your workout recovery through percussive therapy. Targets muscle relaxation, pain relief, and improved range of motion.",
    imageSrc: "/images/recovery.png",
    iconName: "SelfImprovementRounded",
    accentColor: "#10b981",
    badge: "30 min · Free",
    cta: { label: "Book on MINDBODY", href: "https://clients.mindbodyonline.com/ASP/adm/home.asp?studioid=39370" },
    bullets: [
      "Percussive therapy with Theragun devices",
      "Targets soreness, tension, and range of motion",
      "Sign up via MINDBODY app, USU Rec & Wellness Portal, or in-person",
      "Located at Bryan Green Matador Training Zone",
    ],
  },
  {
    id: "private-instruction",
    anchor: "private-instruction",
    title: "Private Instruction",
    tagline: "Your practice. Your pace. Your instructor.",
    description:
      "Purchase affordable private lesson packages with a certified instructor in yoga, mat pilates, dance, TRX®, or boxing. Sign up at the front desk.",
    imageSrc: "/images/private.png",
    iconName: "SchoolRounded",
    accentColor: "#8b5cf6",
    badge: "5 formats",
    cta: { label: "View Fees", href: "https://www.csun.edu/src/fees" },
    bullets: [
      "Yoga — Vinyasa, Power, Aerial, Meditation",
      "Mat Pilates — posture and breath focused",
      "Dance & Belly Dancing",
      "TRX® Suspension Training",
      "Boxing Conditioning",
    ],
    trainers: [
      {
        name: "Condor",
        role: "Yoga & Meditation Instructor",
        certifications: ["Yogaworks 500-Hr RYT", "UpFlying Aerial Yoga Level 1"],
        education: ["Shamanic Coach certification"],
        specialties: ["Cardio Yoga Flow", "Pranayama & Meditation", "Shamanic Journey"],
        quote: "Walk as if you were kissing the earth with your feet. — Thich Nhat Hanh",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2024-02/Condor2023.jpg",
      },
      {
        name: "Deanna",
        role: "Dance & Pilates Instructor",
        certifications: ["AFAA Group Exercise", "AFAA Pilates Workshop", "YogaFit Level 1"],
        education: ["A.A. in Dance"],
        specialties: ["Barre Fit", "Belly Dancing", "Mindful Mat Pilates"],
        quote: "Whether you think you can, or you think you can't — you're right. — Henry Ford",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2024-05/26_large.jpg",
      },
      {
        name: "Lisa",
        role: "Yoga & TRX Instructor",
        certifications: ["500 E-RYT Yoga Alliance", "TRX Advanced Group Training", "NASM Certified Personal Trainer"],
        education: ["Masters level via Samudra School of Living Yoga"],
        specialties: ["Power Yoga", "TRX Yoga", "Yoga Sport FX", "Kettlebell"],
        quote: "",
        imageSrc: "https://live-csu-northridge.pantheonsite.io/sites/default/files/2024-05/16_large.jpg",
      },
    ],
  },
  {
    id: "cpr-firstaid",
    anchor: "cpr-firstaid",
    title: "CPR, AED & First Aid",
    tagline: "Learn lifesaving skills. Certified in a day.",
    description:
      "American Red Cross certified training in CPR, AED and First Aid. One-day Saturday sessions, $70/person, limited to 10 participants. Valid for 2 years.",
    imageSrc: "/images/firstaid.png",
    iconName: "FavoriteRounded",
    accentColor: "#f43f5e",
    badge: "$70 · Red Cross Cert",
    cta: { label: "Register on SRC Portal", href: "https://srcportal.csun.edu/program?classificationId=6be7d682-56cf-431a-b011-da2ce0800c89" },
    bullets: [
      "Saturdays, 9am – 3:45pm at the USU",
      "Max 10 participants per class",
      "Equipment provided: manikins, AEDs, gloves, masks",
      "No prerequisites required",
      "Covers adult, child, and infant emergencies",
      "Certification valid for 2 years",
      "Call Mary Chavez: 818-677-5487",
    ],
  },
  {
    id: "reservations",
    anchor: "reservations",
    title: "Reservations",
    tagline: "Your space. Your time. Your game.",
    description:
      "Reserve courts, studios, the turf field, pool, and the Oasis Wellness Center through the Mazévo portal or by contacting USU Reservations at 818-677-3644. Rock Wall reservations go through Associated Students Outdoor Adventures.",
    imageSrc: "/images/reservations.png",
    iconName: "EventAvailableRounded",
    accentColor: "#f59e0b",
    cta: { label: "Reserve via Mazévo", href: "https://west.mymazevo.com/" },
    spaces: [
      {
        name: "Red Ring Courts",
        floor: "2nd floor",
        capacity: "3 full-length basketball courts",
        features: ["Natural lighting", "Retractable backstops", "Curtain dividers", "Adjustable rim for youth"],
        activities: ["Basketball", "Volleyball", "Tournaments"],
      },
      {
        name: "MatArena",
        floor: "2nd floor",
        capacity: "Multi-court arena with bleacher seating",
        features: ["Box seating for teams", "Retractable backstops", "Curtain divider"],
        activities: ["Badminton", "Volleyball", "Indoor soccer", "Basketball", "Dodgeball"],
      },
      {
        name: "Motivation Studio",
        floor: "1st floor",
        capacity: "Studio-sized",
        features: ["Floor-to-ceiling mirrors", "Dance barres", "AV system"],
        activities: ["Yoga", "Zumba", "HIIT", "Dance"],
      },
      {
        name: "Rec Pool",
        floor: "Adjacent to SRC",
        capacity: "Max 370 pool · 204 deck",
        features: ["25-yard pool, 4ft deep", "ADA chair lift", "Wibit inflatable course", "Cabanas & speakers"],
        activities: ["Lap swimming", "Open recreation", "Swim lessons"],
      },
      {
        name: "SRC Turf Field",
        floor: "East of SRC",
        capacity: "130,000 sq ft",
        features: ["Two half-fields", "Soccer goals", "Bleacher seating", "Sports lighting"],
        activities: ["Soccer", "Flag football", "Softball", "Frisbee"],
      },
      {
        name: "Oasis Wellness Center",
        floor: "Below USU Computer Lab",
        capacity: "Multiple rooms (7–30 capacity)",
        features: ["Labyrinth", "Gardens", "Patios", "Zen Garden", "Amphitheater"],
        activities: ["Retreats", "Meditation", "Yoga", "Wellness workshops"],
      },
      {
        name: "Inspiration Studio",
        floor: "2nd floor",
        capacity: "Group class capacity",
        features: ["Floor-to-ceiling mirrors", "AV system for music"],
        activities: ["Cycling", "Yoga", "Private group exercise"],
      },
    ],
  },
  {
    id: "lockers",
    anchor: "lockers",
    title: "Lockers",
    tagline: "Stash your stuff. Focus on your workout.",
    description:
      "Secure day-use lockers in the locker rooms on a first-come, first-served basis. Full, half, quarter, and ADA sizes available. Term rentals available for members with term membership.",
    imageSrc: "/images/proshop.png",
    iconName: "LockRounded",
    accentColor: "#64748b",
    bullets: [
      "Full-size lockers — day use only",
      "Half-size, quarter-size, and ADA-accessible lockers",
      "Term-basis rentals for members with term membership",
      "Located in locker rooms throughout the facility",
    ],
  },
  {
    id: "towels",
    anchor: "towels",
    title: "Towel Service",
    tagline: "We've got you covered — literally.",
    description:
      "Workout-size towels are free at the Pro Shop or any Fitness Zone counter. Pool/shower towels available for a small fee. Enroll in towel service at the Membership Services Desk or Pro Shop (term members only).",
    imageSrc: "/images/proshop.png",
    iconName: "DryRounded",
    accentColor: "#06b6d4",
    bullets: [
      "Workout towels — free of charge at Pro Shop or Fitness Zone counters",
      "Pool/shower towels — available for a small fee",
      "Towel service enrollment at Membership Services Desk or Pro Shop",
      "Towels required in all Fitness Zones",
      "Term membership required for term-basis towel service",
    ],
  },
  {
    id: "accessibility",
    anchor: "accessibility",
    title: "Accessibility",
    tagline: "Every Matador. Every space.",
    description:
      "The SRC is fully accessible across all zones — studios, courts, training zones, locker rooms, and the Rec Pool. Interpreting services available with 7 business days notice.",
    imageSrc: "/images/classes.png",
    iconName: "AccessibleRounded",
    accentColor: "#84cc16",
    cta: { label: "Request Interpreting Services", href: "https://csun.sjc1.qualtrics.com/jfe/form/SV_2fLhq7KY9ZjSfxc" },
    bullets: [
      "Dual adjustable cable pulleys in all training zones",
      "ADA-accessible free weight areas and benches",
      "180° pool lift at Rec Pool",
      "ADA handicap lockers",
      "Two elevators",
      "Accessible seating at Mat Arena Mezzanine",
      "ADA-accessible Theragun / TRX® suspension trainers",
      "Interpreting services — request 7 business days in advance",
    ],
  },
];

// Lookup map for deep-link routing from root page categories
export const CATEGORY_TO_ANCHOR: Record<string, ServiceId> = {
  Boxing: "private-instruction",
  Yoga: "private-instruction",
  Aquatics: "reservations",
  Recovery: "recovery",
  "Personal Training": "personal-training",
  "Sport Clubs": "reservations",
};
