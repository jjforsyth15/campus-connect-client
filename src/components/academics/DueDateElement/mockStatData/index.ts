/**
 * mockStatData/index.ts
 *
 * BACKEND INTEGRATION NOTES:
 * Replace these mock arrays with real API calls.
 *
 * Recommended endpoints:
 *   GET /api/courses                  → Course[]
 *   GET /api/assignments?courseId=... → Assignment[]
 *   GET /api/exams?courseId=...       → ExamItem[]
 *   PATCH /api/assignments/:id        → { completed: boolean }
 *   POST  /api/reminders              → { assignmentId, email, reminderDate }
 *
 * For "star" (important flag):
 *   PATCH /api/assignments/:id/star   → { starred: boolean }
 *
 * Each function below mirrors the shape returned by those endpoints.
 * Swap `return mockXxx` for `return await fetch(...).then(r => r.json())`.
 */

import type { MockAssignment, MockExam, MockCourse } from "./types";
export type { MockAssignment, MockExam, MockCourse };

// ─── Course palette ─────────────────────────────────────────────────────────
// Each course gets a unique brand color used across ALL chart views.
export const COURSE_COLORS: Record<string, string> = {
  "CS 101":   "#6366f1", // indigo
  "MATH 201": "#f59e0b", // amber
  "ENG 102":  "#10b981", // emerald
  "PHYS 301": "#ef4444", // red
  "HIST 150": "#8b5cf6", // violet
};

// ─── Mock courses ────────────────────────────────────────────────────────────
export const mockCourses: MockCourse[] = [
  { id: "cs101",   subject: "CS",   number: "101", name: "Intro to Computer Science" },
  { id: "math201", subject: "MATH", number: "201", name: "Calculus II"               },
  { id: "eng102",  subject: "ENG",  number: "102", name: "English Composition"       },
  { id: "phys301", subject: "PHYS", number: "301", name: "Physics III"               },
  { id: "hist150", subject: "HIST", number: "150", name: "World History"             },
];

// ─── Mock assignments ────────────────────────────────────────────────────────
// weight: "exam" | "quiz" | "homework" | "project"
// points: max points this assignment is worth
export const mockAssignments: MockAssignment[] = [
  // CS 101
  { id: "a1",  courseCode: "CS 101",   courseId: "cs101",   title: "Lab 1: Variables & Types",      dueDate: new Date(Date.now() + 1*86400000).toISOString(),  weight: "homework",  points: 10,  completed: false, starred: false },
  { id: "a2",  courseCode: "CS 101",   courseId: "cs101",   title: "Project 1: Hangman",             dueDate: new Date(Date.now() + 5*86400000).toISOString(),  weight: "project",   points: 50,  completed: false, starred: true  },
  { id: "a3",  courseCode: "CS 101",   courseId: "cs101",   title: "Quiz 2: Loops",                  dueDate: new Date(Date.now() - 2*86400000).toISOString(),  weight: "quiz",      points: 20,  completed: true,  starred: false },
  { id: "a4",  courseCode: "CS 101",   courseId: "cs101",   title: "Lab 2: Functions",               dueDate: new Date(Date.now() + 3*86400000).toISOString(),  weight: "homework",  points: 10,  completed: false, starred: false },
  // MATH 201
  { id: "a5",  courseCode: "MATH 201", courseId: "math201", title: "HW 3: Integration by Parts",     dueDate: new Date(Date.now() + 0*86400000).toISOString(),  weight: "homework",  points: 15,  completed: false, starred: true  },
  { id: "a6",  courseCode: "MATH 201", courseId: "math201", title: "HW 4: Trig Substitution",        dueDate: new Date(Date.now() + 7*86400000).toISOString(),  weight: "homework",  points: 15,  completed: false, starred: false },
  { id: "a7",  courseCode: "MATH 201", courseId: "math201", title: "Quiz 3: Series Convergence",     dueDate: new Date(Date.now() - 1*86400000).toISOString(),  weight: "quiz",      points: 25,  completed: true,  starred: false },
  // ENG 102
  { id: "a8",  courseCode: "ENG 102",  courseId: "eng102",  title: "Essay 1: Rhetorical Analysis",   dueDate: new Date(Date.now() + 2*86400000).toISOString(),  weight: "project",   points: 100, completed: false, starred: false },
  { id: "a9",  courseCode: "ENG 102",  courseId: "eng102",  title: "Reading Response 4",             dueDate: new Date(Date.now() - 3*86400000).toISOString(),  weight: "homework",  points: 10,  completed: true,  starred: false },
  { id: "a10", courseCode: "ENG 102",  courseId: "eng102",  title: "Peer Review: Essay 1",           dueDate: new Date(Date.now() + 4*86400000).toISOString(),  weight: "homework",  points: 20,  completed: false, starred: false },
  // PHYS 301
  { id: "a11", courseCode: "PHYS 301", courseId: "phys301", title: "Problem Set 5: Waves",           dueDate: new Date(Date.now() + 1*86400000).toISOString(),  weight: "homework",  points: 30,  completed: false, starred: false },
  { id: "a12", courseCode: "PHYS 301", courseId: "phys301", title: "Lab Report: Diffraction",        dueDate: new Date(Date.now() + 9*86400000).toISOString(),  weight: "project",   points: 60,  completed: false, starred: true  },
  { id: "a13", courseCode: "PHYS 301", courseId: "phys301", title: "Quiz 4: Optics",                 dueDate: new Date(Date.now() - 4*86400000).toISOString(),  weight: "quiz",      points: 20,  completed: true,  starred: false },
  // HIST 150
  { id: "a14", courseCode: "HIST 150", courseId: "hist150", title: "Reading: Chapters 7-9",          dueDate: new Date(Date.now() + 2*86400000).toISOString(),  weight: "homework",  points: 10,  completed: false, starred: false },
  { id: "a15", courseCode: "HIST 150", courseId: "hist150", title: "Document Analysis: Treaty of V.", dueDate: new Date(Date.now() + 6*86400000).toISOString(), weight: "project",   points: 50,  completed: false, starred: false },
  { id: "a16", courseCode: "HIST 150", courseId: "hist150", title: "Discussion Post 3",              dueDate: new Date(Date.now() - 1*86400000).toISOString(),  weight: "homework",  points: 10,  completed: true,  starred: false },
];

// ─── Mock exams ──────────────────────────────────────────────────────────────
export const mockExams: MockExam[] = [
  { id: "e1", courseCode: "CS 101",   courseId: "cs101",   title: "Midterm Exam",    date: new Date(Date.now() + 10*86400000).toISOString(), type: "exam",     location: "Lusk 101" },
  { id: "e2", courseCode: "MATH 201", courseId: "math201", title: "Exam 2",          date: new Date(Date.now() + 14*86400000).toISOString(), type: "exam",     location: "Tyler 201" },
  { id: "e3", courseCode: "PHYS 301", courseId: "phys301", title: "Lab Practical",   date: new Date(Date.now() + 3*86400000).toISOString(),  type: "quiz",     location: "SCI 310" },
  { id: "e4", courseCode: "ENG 102",  courseId: "eng102",  title: "In-Class Essay",  date: new Date(Date.now() + 8*86400000).toISOString(),  type: "exam",     location: "HUM 105" },
];
