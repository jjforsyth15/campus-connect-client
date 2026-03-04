"use client";

/**
 * Smart Planner page — /academics/smart-planner
 *
 * This page hosts the degree roadmap builder using React Flow.
 * It dynamically renders a tiered tree diagram for any CSUN degree plan,
 * fetching requirement data from the CSUN curriculum API.
 *
 * TODO (backend):
 *   - GET https://www.csun.edu/web-dev/api/curriculum/2.0/plans
 *     → List all undergraduate plans to populate the degree selector
 *   - GET https://www.csun.edu/web-dev/api/curriculum/2.0/plans/{plan_id}
 *     → Fetch requirement tree for a selected major (groups, courses, units)
 *   - GET https://www.csun.edu/web-dev/api/degrees/2.0/{subject}/{catalog_number}
 *     → Fetch per-course details (prerequisites, units, description) for each node
 *
 * The React Flow diagram should:
 *   - Show each required course as a node
 *   - Connect prerequisite chains with directed edges
 *   - Color-code nodes by completion status (taken / in-progress / upcoming / locked)
 *   - Support drag-to-reorder and zoom/pan
 *   - Persist user's completion state to Supabase (user_course_completions table)
 */

// This component is already mocked up in another branch.
// Drop the React Flow implementation here once merged.

export default function SmartPlannerPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", background: "linear-gradient(135deg, #A80532 0%, #6b0020 100%)", color: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Smart Planner</h1>
        <p style={{ opacity: 0.8 }}>React Flow degree roadmap — coming soon from feature branch merge.</p>
      </div>
    </div>
  );
}
