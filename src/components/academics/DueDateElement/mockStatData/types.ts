/**
 * mockStatData/types.ts
 *
 * Shared TypeScript types for the DueDateElement component.
 * These extend the base Assignment/ExamItem from shared/constants
 * with additional fields (weight, points, starred, courseId).
 *
 * BACKEND NOTE:
 * When integrating a real API, your Assignment model should include:
 *   - weight: determines sort order in "by weight" filter
 *   - points: used for "most points" sort and meter graph weighting
 *   - starred: persisted per user (PATCH /api/assignments/:id/star)
 *   - completed: toggled via PATCH /api/assignments/:id
 */

export type AssignmentWeight = "exam" | "quiz" | "project" | "homework";

export interface MockCourse {
  id: string;
  subject: string;
  number: string;
  name: string; // Full course name e.g. "Intro to Computer Science"
}

export interface MockAssignment {
  id: string;
  courseCode: string;   // e.g. "CS 101"
  courseId: string;     // e.g. "cs101"  — matches MockCourse.id
  title: string;
  dueDate: string;      // ISO date string
  weight: AssignmentWeight;
  points: number;       // max points this assignment is worth
  completed: boolean;
  starred: boolean;     // user-flagged as important
}

export interface MockExam {
  id: string;
  courseCode: string;
  courseId: string;
  title: string;
  date: string;         // ISO date string
  type: "exam" | "quiz" | "final";
  location?: string;
}

// ─── Filter / sort options surfaced to the UI ────────────────────────────────
export type FilterOption =
  | "due-soon"    // within 2 days
  | "due-today"   // due today
  | "upcoming"    // more than 2 days away
  | "done";       // completed === true

export type SortOption =
  | "most-points"
  | "due-date"
  | "group-by-class"
  | "weight-high-to-low"  // exam → quiz → project → homework
  | "weight-low-to-high"; // homework → project → quiz → exam

// ─── Reminder payload (POST /api/reminders) ─────────────────────────────────
export interface ReminderPayload {
  assignmentId: string;
  email: string;
  reminderDate: string; // ISO date — when to send the reminder email
}
