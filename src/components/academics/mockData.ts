import type { MajorPlan, SemesterBucket, UniCartClass, UniCartProfile, StudyGroup } from "./constants";

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
        notes: [],
        resources: [],
        assignments: [
          { id: "a1", title: "Homework 1 – Lambda Calculus", dueDate: "2026-02-10T23:59:00", completed: true, priority: "medium" },
          { id: "a2", title: "Homework 2 – Type Systems", dueDate: "2026-02-28T23:59:00", completed: false, priority: "high" },
          { id: "a3", title: "Project Proposal", dueDate: "2026-03-15T23:59:00", completed: false, priority: "high" },
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
        notes: [],
        resources: [],
        assignments: [
          { id: "a4", title: "Problem Set 3", dueDate: "2026-02-20T23:59:00", completed: false, priority: "medium" },
          { id: "a5", title: "Problem Set 4", dueDate: "2026-03-05T23:59:00", completed: false, priority: "low" },
        ],
        exams: [
          { id: "e3", title: "Quiz 2", date: "2026-02-18T12:30:00", type: "quiz", location: "SN 120" },
          { id: "e4", title: "Midterm", date: "2026-03-12T12:30:00", type: "midterm", location: "SN 120" },
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
        notes: [],
        resources: [],
        assignments: [
          { id: "a6", title: "Lab 4 – B-Trees", dueDate: "2026-02-14T23:59:00", completed: false, priority: "high" },
        ],
        exams: [
          { id: "e5", title: "Quiz 1", date: "2026-02-16T09:00:00", type: "quiz", location: "JD 2208" },
        ],
      },
    ],
  },
];

export const seedSelectedSemesterId = "Spring 2026";

export const mockMajors: MajorPlan[] = [
  { plan_id: "cs", plan_title: "Computer Science", academic_groups_title: "Engineering and Computer Science" },
  { plan_id: "bus", plan_title: "Business Administration", academic_groups_title: "David Nazarian College of Business" },
  { plan_id: "psy", plan_title: "Psychology", academic_groups_title: "Social & Behavioral Sciences" },
  { plan_id: "ce", plan_title: "Computer Engineering", academic_groups_title: "Engineering and Computer Science" },
  { plan_id: "math", plan_title: "Mathematics", academic_groups_title: "Science and Mathematics" },
  { plan_id: "bio", plan_title: "Biology", academic_groups_title: "Science and Mathematics" },
];

// Mock class library for UniCart search
// TODO (backend): Replace with live CSUN class search API
export const mockClassLibrary: UniCartClass[] = [
  { id: "c1", subject: "COMP", number: "322", title: "Internet & WWW", professor: "Dr. Rose", units: 3, semester: "Spring 2026", isOnline: false, days: ["Mon", "Wed"], startTime: "14:00", endTime: "15:15", section: "01", seats: 35, seatsAvailable: 8 },
  { id: "c2", subject: "COMP", number: "380", title: "Software Engineering", professor: "Dr. Kazerouni", units: 3, semester: "Spring 2026", isOnline: false, days: ["Tue", "Thu"], startTime: "09:30", endTime: "10:45", section: "01", seats: 40, seatsAvailable: 2 },
  { id: "c3", subject: "COMP", number: "420", title: "Operating Systems", professor: "Prof. Lee", units: 3, semester: "Spring 2026", isOnline: false, days: ["Mon", "Wed", "Fri"], startTime: "11:00", endTime: "11:50", section: "02", seats: 30, seatsAvailable: 15 },
  { id: "c4", subject: "MATH", number: "250", title: "Calculus II", professor: "Dr. Patel", units: 4, semester: "Spring 2026", isOnline: false, days: ["Mon", "Tue", "Wed", "Thu"], startTime: "08:00", endTime: "08:50", section: "05", seats: 45, seatsAvailable: 20 },
  { id: "c5", subject: "COMP", number: "490", title: "Senior Design Project", professor: "Dr. Tseng", units: 3, semester: "Spring 2026", isOnline: false, days: ["Thu"], startTime: "18:00", endTime: "20:45", section: "01", seats: 25, seatsAvailable: 6 },
  { id: "c6", subject: "ENGL", number: "115", title: "College Writing", professor: "Prof. Garcia", units: 3, semester: "Spring 2026", isOnline: true, days: [], startTime: "", endTime: "", section: "80", seats: 30, seatsAvailable: 12 },
  { id: "c7", subject: "COMP", number: "310", title: "Computer Architecture", professor: "Dr. Hoang", units: 3, semester: "Spring 2026", isOnline: false, days: ["Tue", "Thu"], startTime: "14:00", endTime: "15:15", section: "01", seats: 35, seatsAvailable: 0 },
  { id: "c8", subject: "COMP", number: "350", title: "Database Management", professor: "Prof. Alami", units: 3, semester: "Spring 2026", isOnline: false, days: ["Mon", "Wed"], startTime: "16:00", endTime: "17:15", section: "01", seats: 40, seatsAvailable: 18 },
];

// Mock student profiles for UniCart matching
// TODO (backend): Replace with real user profiles from Supabase
export const mockStudentProfiles: UniCartProfile[] = [
  {
    id: "u1",
    name: "Alex Rivera",
    major: "Computer Science",
    year: "Junior",
    classes: [mockClassLibrary[0], mockClassLibrary[2], mockClassLibrary[4]],
  },
  {
    id: "u2",
    name: "Jordan Kim",
    major: "Computer Science",
    year: "Senior",
    classes: [mockClassLibrary[1], mockClassLibrary[4], mockClassLibrary[7]],
  },
  {
    id: "u3",
    name: "Sam Patel",
    major: "Computer Engineering",
    year: "Junior",
    classes: [mockClassLibrary[0], mockClassLibrary[3], mockClassLibrary[6]],
  },
  {
    id: "u4",
    name: "Morgan Lee",
    major: "Mathematics",
    year: "Sophomore",
    classes: [mockClassLibrary[3], mockClassLibrary[5]],
  },
];

// Mock study groups
// TODO (backend): Replace with Supabase study_groups table queries
export const mockStudyGroups: StudyGroup[] = [
  {
    id: "sg1",
    courseSubject: "COMP",
    courseNumber: "333",
    topic: "Midterm Review – Type Systems & Lambda Calculus",
    dateTime: "2026-03-08T15:00:00",
    location: "Oviatt Library – Room 2",
    isVirtual: false,
    members: [
      { id: "m1", name: "Alex Rivera" },
      { id: "m2", name: "Jordan Kim" },
    ],
    createdBy: "Alex Rivera",
    createdAt: "2026-03-01T10:00:00",
    maxMembers: 6,
    notes: "Bring your typed notes from weeks 1-7. We'll be going over the midterm practice problems.",
  },
  {
    id: "sg2",
    courseSubject: "MATH",
    courseNumber: "340",
    topic: "Probability Distributions Deep Dive",
    dateTime: "2026-03-05T18:00:00",
    location: "Zoom",
    isVirtual: true,
    meetingLink: "https://csun.zoom.us/j/123456",
    members: [{ id: "m3", name: "Sam Patel" }],
    createdBy: "Sam Patel",
    createdAt: "2026-03-01T12:00:00",
    maxMembers: 5,
  },
];
