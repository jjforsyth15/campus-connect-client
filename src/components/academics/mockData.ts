import type { MajorPlan, SemesterBucket } from "./constants";

export const seedSemesters: SemesterBucket[] = [
  {
    id: "Spring 2026",
    courses: [
      { id: "seed-comp333", subject: "COMP", number: "333", title: "Concepts of Programming Languages", professor: "Prof. Verma", notes: [], resources: [] },
      { id: "seed-math340", subject: "MATH", number: "340", title: "Introduction to Probability and Statistics", professor: "Dr. Smith", notes: [], resources: [] },
    ],
  },
];

export const seedSelectedSemesterId = "Spring 2026";

export const mockMajors: MajorPlan[] = [
  { plan_id: "cs", plan_title: "Computer Science", academic_groups_title: "Engineering" },
  { plan_id: "bus", plan_title: "Business Administration", academic_groups_title: "Business" },
  { plan_id: "psy", plan_title: "Psychology", academic_groups_title: "Social & Behavioral" },
];
