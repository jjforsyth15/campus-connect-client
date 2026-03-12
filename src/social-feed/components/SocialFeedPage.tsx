// =============================================================================
// SocialFeedPage.tsx — Main shell for the Matador Connect social feed
//
// This is the top-level layout component. It renders a 3-column grid:
//   Left  (220px) — sticky sidebar with logo, nav links, theme toggle, user info
//   Center (flex) — main content area: feed, events, marketplace, profile, etc.
//   Right  (300px) — sticky sidebar with search, trending hashtags, quick links
//
// Sub-pages (EventsPage, MarketplacePage, ProfilePage, etc.) are rendered inside
// the center column via renderCenter(). The active page is tracked with `page` state.
//
// Feed tabs (For You / Campus / Clubs / Following) are only shown on the feed page.
// =============================================================================
"use client";

import React, { useState, useCallback, useRef, useEffect, ChangeEvent } from "react";
import Link                 from "next/link";
import { Layers }           from "lucide-react";
import { useTheme }         from "../context/ThemeContext";
import { useFeed }          from "../hooks/useFeed";
import { useNotifications } from "../hooks/useNotifications";
import type { AppPage }     from "../types/feed.types";

import { PostCard }      from "./PostCard";
import { PostComposer }  from "./PostComposer";
import { SkeletonPost }  from "./SkeletonPost";

import NotificationsPage     from "../pages/NotificationsPage";
import SavedPostsPage        from "../pages/SavedPostsPage";
import { EventsPage }        from "../pages/EventsPage";
import { MarketplacePage }   from "../pages/MarketplacePage";
import ProfilePage           from "../pages/ProfilePage";
import SettingsPage          from "../pages/SettingsPage";

const CURRENT_USER_ID       = "u-sarah";
const CURRENT_USER_INITIALS = "SH";

// The four tabs shown inside the main feed column
type FeedTab = "for-you" | "campus" | "clubs" | "following";

// ── Inline SVG icon components ─────────────────────────────────────────────
// These are small, self-contained SVGs so we avoid an extra icon-library import.
// Each returns a single <svg> element sized for the nav sidebar (18×18) or
// smaller utility uses (search: 15×15, hash: 13×13, sun/moon: 16×16).
function IcoHome()     { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IcoBell()     { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function IcoBookmark() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }
function IcoCalendar() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IcoBag()      { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; }
function IcoUser()     { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IcoSettings() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 1 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function IcoSun()      { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }
function IcoMoon()     { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function IcoSearch()   { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
// Used as a prefix bullet in the Trending at CSUN section
function IcoHash()     { return <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>; }

// Left sidebar nav items — order here controls the order they appear in the sidebar.
// Each item maps to an AppPage route and uses one of the inline SVG icons above.
const NAV_ITEMS: { page: AppPage; Icon: () => React.ReactElement; label: string }[] = [
  { page: "feed",          Icon: IcoHome,     label: "Home"          },
  { page: "notifications", Icon: IcoBell,     label: "Notifications" },
  { page: "saved",         Icon: IcoBookmark, label: "Saved"         },
  { page: "events",        Icon: IcoCalendar, label: "Events"        },
  { page: "marketplace",   Icon: IcoBag,      label: "Marketplace"   },
  { page: "profile",       Icon: IcoUser,     label: "Profile"       },
  { page: "settings",      Icon: IcoSettings, label: "Settings"      },
];

// Trending hashtags shown in the right sidebar.
// These are real CSUN topics — update counts/labels each semester as needed.
const TRENDING = [
  { tag: "FinalsWeek",          count: "2.1K posts"              },
  { tag: "SpringCareerFair",    count: "Trending · Career"       },
  { tag: "CSUNEvents",          count: "1.4K posts"              },
  { tag: "MatadorPride",        count: "Trending · CSUN"         },
  { tag: "COMP490",             count: "Trending · Academics"    },
  { tag: "OviattLibrary",       count: "612 posts"               },
  { tag: "SRCOpenGym",          count: "Trending · Recreation"   },
  { tag: "HousingApplications", count: "Trending · Student Life" },
];

// SVG icons used in the Campus Quick Links grid (right sidebar).
// Kept separate from the nav icons above because they use a thinner stroke (1.8).
function IcoPhone()   { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.1 6.1l.72-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function IcoBookOpen(){ return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function IcoClock()   { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IcoGradCap() { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>; }
function IcoCoffee()  { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>; }
function IcoTruck()   { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }

// Quick links shown in the right sidebar grid.
// `internal: true` means it's a Next.js route inside this app (uses href without target="_blank").
// `internal: false` opens in a new tab (external CSUN website).
const QUICK_LINKS = [
  { label: "SRC",     href: "/StudentRecCenter",             Icon: IcoPhone,    internal: true  },
  { label: "Library", href: "https://library.csun.edu",      Icon: IcoBookOpen, internal: false },
  { label: "SOLAR",   href: "https://www.csun.edu/it/software-services/services/solar", Icon: IcoClock, internal: false },
  { label: "Canvas",  href: "https://canvas.csun.edu",       Icon: IcoGradCap,  internal: false },
  { label: "Dining",  href: "https://dineoncampus.com/CSUN", Icon: IcoCoffee,   internal: false },
  { label: "Parking", href: "https://www.csun.edu/parking",  Icon: IcoTruck,    internal: false },
];

// Search index powering the right-sidebar search bar.
// When a user types, this array is filtered and clicking a result calls navTo(page)
// for in-app pages, or opens an external link for CSUN resources.
// Only includes destinations that actually exist and work — no dead ends.
const SEARCH_INDEX = [
  // ── In-app pages (navigate within the social feed shell) ──────────────────
  { label: "Home",              page: "feed"          as AppPage },
  { label: "Campus Events",     page: "events"        as AppPage },
  { label: "Marketplace",       page: "marketplace"   as AppPage },
  { label: "Notifications",     page: "notifications" as AppPage },
  { label: "My Profile",        page: "profile"       as AppPage },
  { label: "Saved Posts",       page: "saved"         as AppPage },
  { label: "Settings",          page: "settings"      as AppPage },
  // ── Feed tabs (navigate to feed then open the right tab) ──────────────────
  { label: "Campus Resources",  page: "feed"          as AppPage },
  { label: "Student Resources", page: "feed"          as AppPage },
  { label: "Clubs",             page: "feed"          as AppPage },
  { label: "Following",         page: "feed"          as AppPage },
  { label: "Study Groups",      page: "feed"          as AppPage },
  // ── Campus Resource links (open csun.edu in new tab via Quick Links) ──────
  { label: "Academic Calendar", page: "events"        as AppPage },
  { label: "Financial Aid",     page: "feed"          as AppPage },
  { label: "Student Health Center", page: "feed"      as AppPage },
  { label: "Career Center",     page: "feed"          as AppPage },
  { label: "Oviatt Library",    page: "feed"          as AppPage },
  { label: "Student Housing",   page: "feed"          as AppPage },
  { label: "IT Help Desk",      page: "settings"      as AppPage },
  { label: "Tutoring Center",   page: "feed"          as AppPage },
  { label: "Disability Resources", page: "feed"       as AppPage },
  { label: "SOLAR",             page: "settings"      as AppPage },
  { label: "Canvas",            page: "feed"          as AppPage },
  { label: "Library",           page: "feed"          as AppPage },
  { label: "Dining",            page: "feed"          as AppPage },
  { label: "Parking",           page: "feed"          as AppPage },
  { label: "Student Rec Center", page: "feed"         as AppPage },
  { label: "SRC",               page: "feed"          as AppPage },
];

type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

// ── FollowingPeopleView ────────────────────────────────────────────────────────
// Rendered when the user clicks the "Following" feed tab.
// Shows all teammates (team members for this project) with a follow/unfollow toggle.
// Follow state is local — it's not persisted or synced to the backend in this version.
const FOLLOWING_USERS = [
  { id:"u1", name:"Sara Hussein",    role:"Student",  initials:"SH" },
  { id:"u2", name:"Justin Ayson",    role:"Student",  initials:"JA" },
  { id:"u3", name:"Joseph Forsyth",  role:"Student",  initials:"JF" },
  { id:"u4", name:"Elijah Cortez",   role:"Student",  initials:"EC" },
  { id:"u5", name:"Ivan Juarez",     role:"Student",  initials:"IJ" },
  { id:"u6", name:"Vram Ghazourian", role:"Student",  initials:"VG" },
  { id:"u7", name:"Gisselle Burgos", role:"Student",  initials:"GB" },
];

function FollowingPeopleView() {
  const [followState, setFollowState] = useState<Record<string, boolean>>(
    () => Object.fromEntries(FOLLOWING_USERS.map(u => [u.id, true]))
  );
  return (
    <div style={{ padding:"20px" }}>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"var(--text-primary)", marginBottom:4 }}>People You Follow</h2>
      <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:18 }}>{FOLLOWING_USERS.length} teammates · their posts appear in your For You feed</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {FOLLOWING_USERS.map(u => (
          <div key={u.id}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-lg)", transition:"background 150ms" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-surface)")}
          >
            <div className="avatar" style={{ width:44, height:44, fontSize:15, flexShrink:0 }}>
              <span className="avatar-initials">{u.initials}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:14, color:"var(--text-primary)" }}>{u.name}</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>
                <span style={{ background: u.role === "Faculty" ? "var(--csun-red)" : "var(--info)", color:"#fff", padding:"1px 7px", borderRadius:99, fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{u.role}</span>
              </div>
            </div>
            <button
              onClick={() => setFollowState(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
              style={{
                padding:"7px 18px", borderRadius:99, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 150ms",
                border: followState[u.id] ? "1px solid var(--border-medium)" : "none",
                background: followState[u.id] ? "transparent" : "var(--csun-red)",
                color: followState[u.id] ? "var(--text-secondary)" : "#fff",
                boxShadow: followState[u.id] ? "none" : "0 2px 10px var(--csun-red-glow)",
              }}
            >
              {followState[u.id] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop:24, padding:"16px 20px", background:"var(--bg-elevated)", borderRadius:"var(--radius-lg)", border:"1px solid var(--border-subtle)" }}>
        <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>Want to discover more? Switch to <strong style={{ color:"var(--text-primary)" }}>For You</strong> or <strong style={{ color:"var(--text-primary)" }}>Campus</strong>.</p>
      </div>
    </div>
  );
}

// ── ClubsTabView ──────────────────────────────────────────────────────────────
// Rendered when the user clicks the "Clubs" feed tab.
// Shows a preview of popular CSUN clubs and links to the full clubs page (/clubs),
// which is managed by a separate teammate's module.
const CLUBS_PREVIEW = [
  { id:"acm",  name:"ACM @ CSUN",       category:"Computer Science", tagline:"Software, workshops, and networking." },
  { id:"ieee", name:"IEEE Student Branch", category:"Engineering",   tagline:"Projects, competitions, and speaker events." },
  { id:"gdc",  name:"Game Dev Club",    category:"Creative Tech",    tagline:"Build games and ship projects together." },
  { id:"ai",   name:"AI / ML Club",     category:"Computer Science", tagline:"Machine learning, deep dives, and research projects." },
];

function ClubsTabView() {
  return (
    <div style={{ padding:20 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"var(--text-primary)", margin:0 }}>Campus Clubs</h2>
          <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:4, marginBottom:0 }}>Discover clubs and organizations at CSUN</p>
        </div>
        <a href="/clubs" style={{ fontSize:12, fontWeight:600, color:"var(--csun-red)", textDecoration:"none", padding:"7px 16px", border:"1px solid var(--csun-red)", borderRadius:99, whiteSpace:"nowrap", transition:"all 150ms" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--csun-red)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--csun-red)"; }}
        >
          Browse All Clubs →
        </a>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {CLUBS_PREVIEW.map(club => (
          <a key={club.id} href={`/clubs?slug=${club.id}`}
            style={{ display:"block", padding:"16px 18px", background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-lg)", textDecoration:"none", transition:"background 150ms, border-color 150ms" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--csun-red)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"; }}
          >
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
              <div style={{ minWidth:0 }}>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"var(--csun-red)", background:"rgba(168,5,50,.12)", padding:"2px 8px", borderRadius:99 }}>{club.category}</span>
                <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, color:"var(--text-primary)", marginTop:7, marginBottom:4 }}>{club.name}</div>
                <div style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.5 }}>{club.tagline}</div>
              </div>
              <svg width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:4 }}><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </a>
        ))}
      </div>

      <div style={{ marginTop:20, padding:"16px 18px", background:"var(--bg-elevated)", borderRadius:"var(--radius-lg)", border:"1px solid var(--border-subtle)", textAlign:"center" }}>
        <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>
          Want to see all clubs?{" "}
          <a href="/clubs" style={{ color:"var(--csun-red)", fontWeight:600, textDecoration:"none" }}>Visit the Clubs Hub →</a>
        </p>
      </div>
    </div>
  );
}

// ── CampusResourcesView ────────────────────────────────────────────────────────
// Rendered when the user clicks the "Campus" feed tab.
// A curated hub linking students to the most commonly needed CSUN services.
// Each resource has a color-coded icon, category badge, title, description, and URL.
// All links open in a new tab (external csun.edu pages).

// SVG icons for each campus resource card, keyed by resource `id`.
const RESOURCE_ICONS: Record<string, JSX.Element> = {
  "academic-cal": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  "tutoring": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  "financial-aid": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  "health": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  "career": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  "library": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  "disability": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2"/><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" strokeDasharray="1 0"/><path d="M12 8v5l3 3"/>
    </svg>
  ),
  "housing": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  "it-help": (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
};

const CAMPUS_RESOURCES = [
  {
    id: "academic-cal",
    category: "Academics",
    color: "#2563eb",
    title: "Academic Calendar",
    desc: "Key dates: registration, finals, holidays, and semester deadlines.",
    url: "https://www.csun.edu/current-students/student-academic-calendars",
  },
  {
    id: "tutoring",
    category: "Learning Support",
    color: "#7c3aed",
    title: "Tutoring & Learning Resources",
    desc: "Free tutoring, writing workshops, and supplemental instruction at the Learning Resource Center.",
    url: "https://www.csun.edu/undergraduate-studies/learning-resource-center",
  },
  {
    id: "financial-aid",
    category: "Financial Aid",
    color: "#16a34a",
    title: "Financial Aid & Scholarships",
    desc: "Apply for grants, loans, scholarships, and check your aid status via SOLAR.",
    url: "https://www.csun.edu/financialaid",
  },
  {
    id: "health",
    category: "Health & Wellness",
    color: "#dc2626",
    title: "Student Health Center",
    desc: "Medical appointments, mental health counseling, wellness programs, and urgent care on campus.",
    url: "https://www.csun.edu/shc",
  },
  {
    id: "career",
    category: "Career",
    color: "#0891b2",
    title: "Career Center",
    desc: "Resume reviews, interview prep, job/internship postings, and employer fairs via Handshake.",
    url: "https://www.csun.edu/career-center",
  },
  {
    id: "library",
    category: "Research",
    color: "#b45309",
    title: "Oviatt Library",
    desc: "Research databases, study rooms, 3D printing, media lab, and 24/7 online resources.",
    url: "https://library.csun.edu",
  },
  {
    id: "disability",
    category: "Accessibility",
    color: "#4f46e5",
    title: "Disability Resources & Educational Services",
    desc: "Accommodations, adaptive technology, testing services, and support for students with disabilities.",
    url: "https://www.csun.edu/dres",
  },
  {
    id: "housing",
    category: "Student Life",
    color: "#e11d48",
    title: "Housing & Residential Life",
    desc: "On-campus housing applications, move-in info, and residential community resources.",
    url: "https://www.csun.edu/housing",
  },
  {
    id: "it-help",
    category: "Technology",
    color: "#0e7490",
    title: "IT Help Center",
    desc: "Wi-Fi, software downloads, laptop loaner program, and tech support for all Matadors.",
    url: "https://www.csun.edu/it/it-help-center",
  },
];

function CampusResourcesView() {
  return (
    <div style={{ padding:20 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"var(--text-primary)", margin:0 }}>Student Resources</h2>
          <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:4, marginBottom:0 }}>Everything you need at CSUN, in one place</p>
        </div>
        <a href="https://www.csun.edu/student-life/student-services-support" target="_blank" rel="noreferrer"
          style={{ fontSize:12, fontWeight:600, color:"var(--csun-red)", textDecoration:"none", padding:"7px 16px", border:"1px solid var(--csun-red)", borderRadius:99, whiteSpace:"nowrap", transition:"all 150ms" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--csun-red)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--csun-red)"; }}
        >
          All Resources →
        </a>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {CAMPUS_RESOURCES.map(r => (
          <a key={r.id} href={r.url} target="_blank" rel="noreferrer"
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-lg)", textDecoration:"none", transition:"background 150ms, border-color 150ms" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"; (e.currentTarget as HTMLElement).style.borderColor = r.color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"; }}
          >
            {/* Icon chip */}
            <div style={{ width:42, height:42, borderRadius:12, background:`${r.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:r.color }}>
              {RESOURCE_ICONS[r.id]}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:r.color }}>{r.category}</span>
              </div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"var(--text-primary)", marginBottom:3, lineHeight:1.3 }}>{r.title}</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.5 }}>{r.desc}</div>
            </div>
            <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        ))}
      </div>

      <div style={{ marginTop:16, padding:"14px 18px", background:"var(--bg-elevated)", borderRadius:"var(--radius-lg)", border:"1px solid var(--border-subtle)", textAlign:"center" }}>
        <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>
          Need help? Visit <a href="https://www.csun.edu/student-life/student-services-support" target="_blank" rel="noreferrer" style={{ color:"var(--csun-red)", fontWeight:600, textDecoration:"none" }}>csun.edu/student-services →</a>
        </p>
      </div>
    </div>
  );
}


// Shown when clicking another user's name/avatar in a post.
// Renders a mini profile header + all posts by that user.
// The `onBack` button returns to the main feed.
function UserProfileView({
  userId,
  posts,
  savedPostIds,
  currentUserId,
  onLike,
  onDelete,
  onSave,
  onRepost,
  onBlock,
  onBack,
}: {
  userId: string;
  posts: ReturnType<typeof useFeed>["posts"];
  savedPostIds: Set<string>;
  currentUserId: string;
  onLike: ReturnType<typeof useFeed>["handleLike"];
  onDelete: ReturnType<typeof useFeed>["handleDelete"];
  onSave: ReturnType<typeof useFeed>["handleSave"];
  onRepost: ReturnType<typeof useFeed>["handleRepost"];
  onBlock: (uid: string) => void;
  onBack: () => void;
}) {
  const userPosts = posts.filter(p => p.User.id === userId);
  const user = userPosts[0]?.User;
  const initials = user ? `${(user.firstName[0] ?? "").toUpperCase()}${(user.lastName[0] ?? "").toUpperCase()}` : "?";
  const name = user ? `${user.firstName} ${user.lastName}` : "User";

  return (
    <div>
      {/* Back bar */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", borderBottom:"1px solid var(--border-subtle)", background:"var(--bg-surface)", position:"sticky", top:0, zIndex:10 }}>
        <button
          onClick={onBack}
          style={{ width:32, height:32, borderRadius:"50%", border:"none", background:"transparent", color:"var(--text-secondary)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 150ms" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:700, color:"var(--text-primary)" }}>{name}</span>
      </div>

      {/* Mini profile header */}
      <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid var(--border-subtle)", background:"var(--bg-surface)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div className="avatar" style={{ width:56, height:56, fontSize:20, flexShrink:0 }}>
            <span className="avatar-initials">{initials}</span>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:17, fontWeight:700, color:"var(--text-primary)" }}>{name}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{user?.userType === "faculty" ? "Faculty" : "Student"}</div>
          </div>
        </div>
      </div>

      {/* Their posts */}
      {userPosts.length === 0 ? (
        <div style={{ padding:"60px 20px", textAlign:"center", color:"var(--text-muted)" }}>
          <p style={{ fontWeight:600, fontSize:15 }}>No posts yet</p>
        </div>
      ) : (
        userPosts.map(p => (
          <PostCard key={p.id} post={p} currentUserId={currentUserId}
            isSaved={savedPostIds.has(p.id)}
            onLike={onLike} onDelete={onDelete} onSave={onSave} onRepost={onRepost}
            onViewProfile={onBack} onBlock={onBlock}
          />
        ))
      )}
    </div>
  );
}

export default function SocialFeedPage() {
  const { isDark, toggleTheme } = useTheme();
  const {
    posts, savedPostIds, isLoading, isLoadingMore, error,
    refresh, loadMore, handleLike, handleCreate, handleDelete, handleSave, handleRepost,
  } = useFeed();
  const { unreadCount } = useNotifications();

  // ── Read logged-in user from localStorage ─────────────────────────────────
  // The backend stores the authenticated user as a JSON string under the key "user".
  // We parse it once on mount to get the name, initials, and role for the sidebar.
  // Falls back to a default ("Sara Hussein") if nothing is stored — e.g. on first load.
  const [currentUserInfo, setCurrentUserInfo] = useState<{ id: string; initials: string; name: string; role: string }>({
    id: CURRENT_USER_ID, initials: "?", name: "Loading…", role: "Student",
  });
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw) as Record<string, unknown>;
        const first = (u.firstName as string) || (u.name as string)?.split(" ")[0] || "Matador";
        const last  = (u.lastName  as string) || (u.name as string)?.split(" ").slice(1).join(" ") || "";
        const initials = `${first[0] ?? "?"}${last[0] ?? ""}`.toUpperCase();
        setCurrentUserInfo({
          id:       (u.id as string) || CURRENT_USER_ID,
          initials,
          name:     last ? `${first} ${last}` : first,
          role:     (u.userType as string) === "faculty" ? "Faculty" : "Student",
        });
      } else {
        // No user found in localStorage — use a safe guest fallback
        setCurrentUserInfo({ id: CURRENT_USER_ID, initials: "SH", name: "Sara Hussein", role: "Student" });
      }
    } catch {
      setCurrentUserInfo({ id: CURRENT_USER_ID, initials: "SH", name: "Sara Hussein", role: "Student" });
    }
  }, []);

  const [page,          setPage]    = useState<AppPage>("feed");
  const [feedTab,       setFeedTab] = useState<FeedTab>("for-you");
  const [viewedUserId,  setViewedUserId] = useState<string | null>(null);
  const [searchQuery,   setSearch]  = useState("");
  const [searchFocused, setFocused] = useState(false);
  const [searchIdx,     setSearchIdx] = useState(-1);
  const [toasts,        setToasts]  = useState<Toast[]>([]);
  const [blockedIds,    setBlockedIds] = useState<Set<string>>(new Set());
  const toastId     = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string, type: ToastType = "info") => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const filteredSearch = searchQuery.trim()
    ? SEARCH_INDEX.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [loadMore]);

  const navTo = useCallback((p: AppPage) => {
    setPage(p);
    setSearch("");
    setViewedUserId(null);
  }, []);

  const handleViewProfile = useCallback((uid: string) => {
    if (uid === CURRENT_USER_ID) {
      setViewedUserId(null);
      setPage("profile");
    } else {
      setViewedUserId(uid);
      setPage("feed");
    }
    setSearch("");
  }, []);

  const handleBlock = useCallback((uid: string) => {
    setBlockedIds(prev => {
      const next = new Set(prev);
      next.add(uid);
      return next;
    });
    showToast("User blocked — their posts are hidden.", "info");
  }, [showToast]);

  const handleUnblock = useCallback((uid: string) => {
    setBlockedIds(prev => {
      const next = new Set(prev);
      next.delete(uid);
      return next;
    });
  }, []);

  function renderFeed() {
    const TAB_LABELS: Record<FeedTab, string> = {
      "for-you": "For You", "campus": "Campus", "clubs": "Clubs", "following": "Following",
    };

  // Filter posts per tab — also hides posts from users the current user has blocked
    const filteredPosts = posts.filter(p => !blockedIds.has(p.User.id));

    const tabs = (
      <div style={{ display:"flex", borderBottom:"1px solid var(--border-subtle)", background:"var(--bg-surface)", position:"sticky", top:0, zIndex:10 }}>
        {(["for-you","campus","clubs","following"] as FeedTab[]).map(tab => {
          const active = feedTab === tab;
          return (
            <button key={tab} onClick={() => setFeedTab(tab)} style={{
              flex:1, padding:"16px 8px", border:"none", background:"transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: active ? 700 : 400, fontSize:14, cursor:"pointer",
              borderBottom: active ? "2px solid var(--csun-red)" : "2px solid transparent",
              marginBottom:-1, transition:"color 150ms",
            }}>
              {TAB_LABELS[tab]}
            </button>
          );
        })}
      </div>
    );

    // ── Following tab: dedicated people-list view ────────────────────────────
    if (feedTab === "following") {
      return (
        <>
          {tabs}
          <FollowingPeopleView />
        </>
      );
    }

    // ── Campus tab: student resource hub ────────────────────────────────────
    if (feedTab === "campus") {
      return (
        <>
          {tabs}
          <CampusResourcesView />
        </>
      );
    }

    // ── Clubs tab: clubs directory preview ──────────────────────────────────
    if (feedTab === "clubs") {
      return (
        <>
          {tabs}
          <ClubsTabView />
        </>
      );
    }

    // ── For You tab: main post feed ──────────────────────────────────────────
    // Campus / Clubs / Following tabs are handled above with early returns.
    return (
      <>
        {tabs}

        {/* Composer */}
        <div style={{ padding:"16px 20px 0" }}>
          <PostComposer currentUserInitials={currentUserInfo.initials} onPost={async (b, imgs) => { await handleCreate(b, imgs); }} />
        </div>

        {error && (
          <div style={{ margin:"0 20px 12px", padding:12, borderRadius:"var(--radius-md)", background:"#fff0f0", border:"1px solid #fecaca", color:"#b91c1c", fontSize:13 }}>
            {error} <button onClick={refresh} style={{ fontWeight:600, background:"none", border:"none", color:"#b91c1c", cursor:"pointer" }}>Retry</button>
          </div>
        )}

        {isLoading && !posts.length
          ? <div style={{ padding:"0 20px" }}><SkeletonPost count={4} /></div>
          : <>
              {filteredPosts.length === 0 && !isLoading && (
                <div style={{ padding:"60px 20px", textAlign:"center", color:"var(--text-muted)" }}>
                  <p style={{ fontWeight:600, fontSize:15, marginBottom:4 }}>Nothing here yet</p>
                  <p style={{ fontSize:13 }}>Be the first to post something!</p>
                </div>
              )}
              {filteredPosts.map(p => (
                <PostCard key={p.id} post={p} currentUserId={currentUserInfo.id}
                  isSaved={savedPostIds.has(p.id)}
                  onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost}
                  onViewProfile={handleViewProfile} onBlock={handleBlock} />
              ))}
              <div ref={sentinelRef} style={{ height:1 }} />
              {isLoadingMore && <div style={{ padding:"0 20px" }}><SkeletonPost count={2} /></div>}
            </>
        }
      </>
    );
  }

  function renderCenter() {
    // If the user clicked on someone else's name in a post, show that user's mini-profile.
    // This takes priority over the page-level routing below.
    if (viewedUserId !== null && page === "feed") {
      return (
        <UserProfileView
          userId={viewedUserId}
          posts={posts}
          savedPostIds={savedPostIds}
          currentUserId={currentUserInfo.id}
          onLike={handleLike}
          onDelete={handleDelete}
          onSave={handleSave}
          onRepost={handleRepost}
          onBlock={handleBlock}
          onBack={() => { setViewedUserId(null); }}
        />
      );
    }

    switch (page) {
      case "notifications": return <NotificationsPage />;
      case "saved":         return <SavedPostsPage posts={posts} savedPostIds={savedPostIds} currentUserId={currentUserInfo.id} onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost} onViewProfile={handleViewProfile} />;
      case "events":        return <EventsPage onToast={showToast} />;
      case "marketplace":   return <MarketplacePage onToast={showToast} />;
      case "profile":       return <ProfilePage currentUserId={currentUserInfo.id} posts={posts} savedPostIds={savedPostIds} onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost} onNavigateSettings={() => navTo("settings")} />;
      case "settings": {
        // Build the blocked-users list by looking up each blocked ID in the posts array.
        // This avoids a separate API call — we already have the user data from useFeed.
        const blockedUsersList = Array.from(blockedIds).map(uid => {
          const user = posts.find(p => p.User.id === uid)?.User;
          const name = user ? `${user.firstName} ${user.lastName}` : uid;
          const initials = user
            ? `${(user.firstName[0] ?? "").toUpperCase()}${(user.lastName[0] ?? "").toUpperCase()}`
            : "??";
          return { id: uid, name, initials };
        });
        return <SettingsPage onToast={showToast} blockedUsers={blockedUsersList} onUnblock={handleUnblock} />;
      }
      default:              return renderFeed();
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-base)", color:"var(--text-primary)", fontFamily:"'Inter',system-ui,sans-serif", transition:"background 250ms,color 250ms" }}>
      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr 300px", minHeight:"100vh", width:"100%" }}>

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <nav style={{ position:"sticky", top:0, height:"100vh", overflowY:"auto", borderRight:"1px solid var(--border-subtle)", background:"var(--bg-surface)", display:"flex", flexDirection:"column" }}>
          {/* Logo */}
          <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid var(--border-subtle)", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Layers size={26} color="var(--csun-red)" strokeWidth={2} />
              <span style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:17, fontWeight:800, color:"var(--csun-red)", letterSpacing:"-0.5px", whiteSpace:"nowrap" }}>
                MatadorConnect
              </span>
            </div>
          </div>

          {/* Nav */}
          <div style={{ flex:1, padding:"12px 10px" }}>
            {NAV_ITEMS.map(({ page: p, Icon, label }) => {
              const active = page === p;
              return (
                <button key={p} onClick={() => navTo(p)} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:11,
                  padding:"10px 12px", borderRadius:10, border:"none",
                  background: active ? "var(--csun-red)" : "transparent",
                  color: active ? "#fff" : "var(--text-secondary)",
                  fontSize:14, fontWeight: active ? 600 : 400,
                  cursor:"pointer", textAlign:"left", marginBottom:2,
                  transition:"background 150ms, color 150ms",
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon />
                  <span style={{ flex:1 }}>{label}</span>
                  {p === "notifications" && unreadCount > 0 && (
                    <span style={{ minWidth:18, height:18, borderRadius:99, background: active ? "rgba(255,255,255,.35)" : "var(--csun-red)", color:"#fff", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px" }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom: theme + user */}
          <div style={{ borderTop:"1px solid var(--border-subtle)", padding:"10px 10px 14px", flexShrink:0 }}>
            <button onClick={toggleTheme} style={{ width:"100%", display:"flex", alignItems:"center", gap:11, padding:"10px 12px", borderRadius:10, border:"none", background:"transparent", color:"var(--text-muted)", fontSize:14, cursor:"pointer", transition:"background 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {isDark ? <IcoSun /> : <IcoMoon />}
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
            </button>
            <div
              onClick={() => navTo("profile")}
              title="Go to your profile"
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, cursor:"pointer", transition:"background 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div className="avatar" style={{ width:32, height:32, fontSize:12, flexShrink:0 }}>
                <span className="avatar-initials">{currentUserInfo.initials}</span>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{currentUserInfo.name}</div>
                <div style={{ fontSize:11, color:"var(--text-muted)" }}>{currentUserInfo.role}</div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Centre ──────────────────────────────────────────────────── */}
        <main style={{ minHeight:"100vh", borderRight:"1px solid var(--border-subtle)", paddingBottom:60 }}>
          <div style={{ maxWidth:680, width:"100%", margin:"0 auto" }}>
            {renderCenter()}
          </div>
        </main>

        {/* ── Right sidebar ────────────────────────────────────────────── */}
        <aside style={{ position:"sticky", top:0, height:"100vh", overflowY:"auto", padding:"20px 16px", background:"var(--bg-surface)" }}>
          {/* Search */}
          <div style={{ marginBottom:20, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg-elevated)", border:`1px solid ${searchFocused ? "var(--csun-red)" : "var(--border-subtle)"}`, borderRadius:99, padding:"9px 14px", boxShadow: searchFocused ? "0 0 0 3px var(--csun-red-glow)" : "none", transition:"border-color 150ms" }}>
              <IcoSearch />
              <input
                type="text"
                placeholder="Search Campus Connect..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setSearchIdx(-1); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => { setFocused(false); setSearchIdx(-1); }, 150)}
                onKeyDown={e => {
                  if (!filteredSearch.length) return;
                  if (e.key === "ArrowDown") { e.preventDefault(); setSearchIdx(i => Math.min(i + 1, filteredSearch.length - 1)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setSearchIdx(i => Math.max(i - 1, 0)); }
                  else if (e.key === "Enter" && searchIdx >= 0) { e.preventDefault(); navTo(filteredSearch[searchIdx].page); setSearch(""); }
                  else if (e.key === "Escape") { setFocused(false); setSearchIdx(-1); }
                }}
                style={{ flex:1, border:"none", outline:"none", background:"transparent", color:"var(--text-primary)", fontSize:13 }}
              />
            </div>
            {searchFocused && filteredSearch.length > 0 && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)", boxShadow:"var(--shadow-md)", zIndex:50, overflow:"hidden" }}>
                {filteredSearch.map((r, idx) => (
                  <button key={r.label} onMouseDown={() => { navTo(r.page); setSearch(""); }}
                    style={{ width:"100%", padding:"10px 14px", border:"none", background: idx === searchIdx ? "var(--bg-hover)" : "transparent", color:"var(--text-primary)", fontSize:13, textAlign:"left", cursor:"pointer", transition:"background 100ms" }}
                    onMouseEnter={() => setSearchIdx(idx)}
                  >{r.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* Trending at CSUN */}
          <div style={{ marginBottom:20, background:"var(--bg-surface)", borderRadius:12, border:"1px solid var(--border-subtle)", overflow:"hidden" }}>
            <div style={{ padding:"14px 16px 10px", fontWeight:800, fontSize:16, letterSpacing:"-0.3px", color:"var(--text-primary)", borderBottom:"1px solid var(--border-subtle)" }}>Trending at CSUN</div>
            <div style={{ padding:"4px 0 6px" }}>
              {TRENDING.map(({ tag, count }) => (
                <div key={tag} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 16px", cursor:"pointer", transition:"background 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color:"var(--csun-red)", flexShrink:0 }}><IcoHash /></span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>{tag}</div>
                    <div style={{ fontSize:11, color:"var(--text-muted)" }}>{count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Quick Links */}
          <div style={{ background:"var(--bg-surface)", borderRadius:12, border:"1px solid var(--border-subtle)", overflow:"hidden" }}>
            <div style={{ padding:"14px 16px 10px", fontWeight:800, fontSize:16, letterSpacing:"-0.3px", color:"var(--text-primary)", borderBottom:"1px solid var(--border-subtle)" }}>Campus Quick Links</div>
            <div style={{ padding:"10px 12px 12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {QUICK_LINKS.map(({ label, href, Icon, internal }) => (
                <a key={label} href={href} {...(!internal && { target:"_blank", rel:"noreferrer" })}
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 10px", borderRadius:10, background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)", fontSize:12, fontWeight:500, textDecoration:"none", transition:"background 150ms, color 150ms" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--csun-red)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--csun-red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
                ><Icon />{label}</a>
              ))}
            </div>
          </div>

          <div style={{ marginTop:16, fontSize:11, color:"var(--text-muted)", textAlign:"center" }}>
            Matador Connect &copy; 2026 &mdash; CSUN
          </div>
        </aside>
      </div>

      {/* Toasts */}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ padding:"11px 18px", borderRadius:"var(--radius-md)", boxShadow:"var(--shadow-md)", fontSize:14, fontWeight:500, color:"#fff", pointerEvents:"auto", background: t.type === "success" ? "#16a34a" : t.type === "error" ? "#dc2626" : "var(--csun-red)", animation:"fadeUp 200ms ease" }}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
