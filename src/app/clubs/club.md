/**
 * ============================================================================
 * CLUBS FEATURE - CampusConnect
 * ============================================================================
 *
 * 
 *
 * Folder Structure (app/clubs):
 * - page.tsx               → "/clubs" hub (search/filter + browse all clubs)
 * - [slug]/page.tsx        → "/clubs/:slug" dynamic club profile page
 * - recommend/page.tsx     → "/clubs/recommend" quiz-style club matcher
 * - clubs.data.tsx         → static Club type + CLUBS dataset (source of truth)
 * - ClubsUI.tsx            → shared UI for hub + club pages (mode-driven)
 *
 * Key Features:
 * - Clubs hub with searchable/filterable list (name, tagline, category)
 * - Dynamic club profile pages based on URL slug
 * - Slug alias support (e.g., "ieee-csun" → "ieee") for friendly URLs
 * - Club recommendation quiz that ranks clubs by keyword + boost rules
 * - Tabbed club UI scaffold (About/Profile/Members/Roles/Posts/Apply/Applications)
 * - Lightweight “chat” helper (currently rule-based / placeholder)
 *
 * Routing & Data Flow:
 * - Data Source: CLUBS[] from clubs.data.tsx (static dataset)
 * - /clubs:
 *   - Renders <ClubsUI clubs={CLUBS} mode="hub" />
 *   - UI filters run client-side for instant feedback
 * - /clubs/[slug]:
 *   - Reads params.slug from route
 *   - Normalizes slug via SLUG_ALIASES mapping
 *   - Looks up club via CLUBS.find(c => c.slug === slug)
 *   - If found: <ClubsUI clubs={CLUBS} mode="club" club={club} />
 *   - If not found: renders "Club not found" fallback with rawSlug
 * - /clubs/recommend:
 *   - Maintains quiz answers in local state
 *   - Computes a scored list via useMemo()
 *   - Chooses best match (top score) and links to /clubs/${resultSlug}
 *
 * Key Variables & Naming:
 * - CLUBS: Club[]                     → master list of club objects
 * - Club (type)                       → shape of a club record (slug, name, etc.)
 * - mode: "hub" | "club"              → controls ClubsUI rendering branch
 * - params.slug (rawSlug)             → original slug from URL
 * - SLUG_ALIASES: Record<string,string>→ maps alternate slugs to canonical slugs
 * - slug                              → canonical slug used for lookup
 * - club                              → matched club object (or undefined)
 * - q / cat                           → hub search + category filter states
 * - tab                               → selected club tab on profile page
 * - answers / scored / resultSlug     → recommendation flow states
 *
 * Design System:
 * - Primary Color: #7b001c (Matador Maroon)
 * - Background: gradient + glassmorphism panels (backdrop blur + translucent cards)
 * - UI: MUI components with consistent rounded corners, shadows, and hover motion
 *
 * Performance Considerations:
 * - Hub filtering computed with useMemo() to avoid unnecessary recalculations
 * - Recommendation scoring computed with useMemo() tied only to answers changes
 * - Conditional rendering for dialogs/modals to keep DOM lighter
 *
 * Notes / Future Work:
 * - Replace static CLUBS with DB-backed clubs and role-based permissions
 * - Implement join/apply flows (save to DB, admin review, notifications)
 * - Upgrade chatbot from rule-based matching to real search/LLM retrieval
 *
 * Last Updated: February 6, 2026
 * 
 */
