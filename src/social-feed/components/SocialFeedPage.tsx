// =============================================================================
// components/SocialFeedPage.tsx  — v2 main shell
// Matches the Campus Connect design: CC logo, SVG nav icons, feed tabs,
// trending at CSUN with counts, Campus Quick Links, toast system.
// NO emojis anywhere.
// =============================================================================
"use client";

import React, { useState, useCallback, useRef, useEffect, ChangeEvent } from "react";
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
const CURRENT_USER_INITIALS = "SM";

type FeedTab = "for-you" | "campus" | "clubs" | "following";

// SVG icons — no emojis
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
function IcoHash()     { return <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>; }

const NAV_ITEMS: { page: AppPage; Icon: () => React.ReactElement; label: string }[] = [
  { page: "feed",          Icon: IcoHome,     label: "Home"          },
  { page: "notifications", Icon: IcoBell,     label: "Notifications" },
  { page: "saved",         Icon: IcoBookmark, label: "Saved"         },
  { page: "events",        Icon: IcoCalendar, label: "Events"        },
  { page: "marketplace",   Icon: IcoBag,      label: "Marketplace"   },
  { page: "profile",       Icon: IcoUser,     label: "Profile"       },
  { page: "settings",      Icon: IcoSettings, label: "Settings"      },
];

const TRENDING = [
  { tag: "FinalsWeek",     count: "412 posts" },
  { tag: "CSUNDining",     count: "287 posts" },
  { tag: "MatadorNetwork", count: "201 posts" },
  { tag: "CompSci490",     count: "178 posts" },
  { tag: "LibraryHours",   count: "134 posts" },
  { tag: "CampusEvents",   count: "96 posts"  },
];

const QUICK_LINKS = [
  { label: "SRC",     href: "https://src.csun.edu"         },
  { label: "Library", href: "https://library.csun.edu"     },
  { label: "SOLAR",   href: "https://www.csun.edu/solar"   },
  { label: "Canvas",  href: "https://canvas.csun.edu"      },
  { label: "Dining",  href: "https://www.csun.edu/dining"  },
  { label: "Parking", href: "https://www.csun.edu/parking" },
];

const SEARCH_INDEX = [
  { label: "Campus Events",     page: "events"        as AppPage },
  { label: "Study Groups",      page: "feed"          as AppPage },
  { label: "Marketplace",       page: "marketplace"   as AppPage },
  { label: "Notifications",     page: "notifications" as AppPage },
  { label: "My Profile",        page: "profile"       as AppPage },
  { label: "Saved Posts",       page: "saved"         as AppPage },
  { label: "Settings",          page: "settings"      as AppPage },
];

type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

export default function SocialFeedPage() {
  const { isDark, toggleTheme } = useTheme();
  const {
    posts, savedPostIds, isLoading, isLoadingMore, error,
    refresh, loadMore, handleLike, handleCreate, handleDelete, handleSave, handleRepost,
  } = useFeed();
  const { unreadCount } = useNotifications();

  const [page,          setPage]    = useState<AppPage>("feed");
  const [feedTab,       setFeedTab] = useState<FeedTab>("for-you");
  const [searchQuery,   setSearch]  = useState("");
  const [searchFocused, setFocused] = useState(false);
  const [toasts,        setToasts]  = useState<Toast[]>([]);
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
  }, []);

  function renderFeed() {
    const TAB_LABELS: Record<FeedTab, string> = {
      "for-you": "For You", "campus": "Campus", "clubs": "Clubs", "following": "Following",
    };
    return (
      <>
        {/* Tabs */}
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

        {/* Composer */}
        <div style={{ padding:"16px 20px 0" }}>
          <PostComposer currentUserInitials={CURRENT_USER_INITIALS} onPost={async b => { await handleCreate(b); }} />
        </div>

        {error && (
          <div style={{ margin:"0 20px 12px", padding:12, borderRadius:"var(--radius-md)", background:"#fff0f0", border:"1px solid #fecaca", color:"#b91c1c", fontSize:13 }}>
            {error} <button onClick={refresh} style={{ fontWeight:600, background:"none", border:"none", color:"#b91c1c", cursor:"pointer" }}>Retry</button>
          </div>
        )}

        {isLoading && !posts.length
          ? <div style={{ padding:"0 20px" }}><SkeletonPost count={4} /></div>
          : <>
              {posts.length === 0 && !isLoading && (
                <div style={{ padding:"60px 20px", textAlign:"center", color:"var(--text-muted)" }}>
                  <p style={{ fontWeight:600, fontSize:15, marginBottom:4 }}>Nothing here yet</p>
                  <p style={{ fontSize:13 }}>Be the first to post something!</p>
                </div>
              )}
              {posts.map(p => (
                <PostCard key={p.id} post={p} currentUserId={CURRENT_USER_ID}
                  isSaved={savedPostIds.has(p.id)}
                  onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost} />
              ))}
              <div ref={sentinelRef} style={{ height:1 }} />
              {isLoadingMore && <div style={{ padding:"0 20px" }}><SkeletonPost count={2} /></div>}
            </>
        }
      </>
    );
  }

  function renderCenter() {
    switch (page) {
      case "notifications": return <NotificationsPage />;
      case "saved":         return <SavedPostsPage posts={posts} savedPostIds={savedPostIds} currentUserId={CURRENT_USER_ID} onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost} />;
      case "events":        return <EventsPage onToast={showToast} />;
      case "marketplace":   return <MarketplacePage onToast={showToast} />;
      case "profile":       return <ProfilePage currentUserId={CURRENT_USER_ID} posts={posts} savedPostIds={savedPostIds} onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost} onNavigateSettings={() => navTo("settings")} />;
      case "settings":      return <SettingsPage onToast={showToast} />;
      default:              return renderFeed();
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-base)", color:"var(--text-primary)", fontFamily:"'Inter',system-ui,sans-serif", transition:"background 250ms,color 250ms" }}>
      <div style={{ maxWidth:1260, margin:"0 auto", display:"grid", gridTemplateColumns:"220px 1fr 280px", minHeight:"100vh" }}>

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <nav style={{ position:"sticky", top:0, height:"100vh", overflowY:"auto", borderRight:"1px solid var(--border-subtle)", background:"var(--bg-surface)", display:"flex", flexDirection:"column" }}>
          {/* Logo */}
          <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid var(--border-subtle)", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"var(--csun-red)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:"#fff", fontWeight:800, fontSize:14, letterSpacing:"-1px" }}>CC</span>
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)", letterSpacing:"-0.3px", lineHeight:1.25 }}>
                Campus<br />Connect
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
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px" }}>
              <div className="avatar" style={{ width:32, height:32, fontSize:12, flexShrink:0 }}>
                <span className="avatar-initials">SM</span>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>Sara Medhat</div>
                <div style={{ fontSize:11, color:"var(--text-muted)" }}>Student</div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Centre ──────────────────────────────────────────────────── */}
        <main style={{ minHeight:"100vh", borderRight:"1px solid var(--border-subtle)", paddingBottom:60 }}>
          {renderCenter()}
        </main>

        {/* ── Right sidebar ────────────────────────────────────────────── */}
        <aside style={{ position:"sticky", top:0, height:"100vh", overflowY:"auto", padding:"20px 16px", background:"var(--bg-surface)" }}>
          {/* Search */}
          <div style={{ marginBottom:20, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg-elevated)", border:`1px solid ${searchFocused ? "var(--csun-red)" : "var(--border-subtle)"}`, borderRadius:99, padding:"9px 14px", boxShadow: searchFocused ? "0 0 0 3px var(--csun-red-glow)" : "none", transition:"border-color 150ms" }}>
              <IcoSearch />
              <input type="text" placeholder="Search Campus Connect..." value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                style={{ flex:1, border:"none", outline:"none", background:"transparent", color:"var(--text-primary)", fontSize:13 }}
              />
            </div>
            {searchFocused && filteredSearch.length > 0 && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)", boxShadow:"var(--shadow-md)", zIndex:50, overflow:"hidden" }}>
                {filteredSearch.map(r => (
                  <button key={r.label} onMouseDown={() => navTo(r.page)}
                    style={{ width:"100%", padding:"10px 14px", border:"none", background:"transparent", color:"var(--text-primary)", fontSize:13, textAlign:"left", cursor:"pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >{r.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* Trending at CSUN */}
          <div style={{ marginBottom:20, background:"var(--bg-surface)", borderRadius:12, border:"1px solid var(--border-subtle)", overflow:"hidden" }}>
            <div style={{ padding:"14px 16px 10px", fontWeight:700, fontSize:15, borderBottom:"1px solid var(--border-subtle)" }}>Trending at CSUN</div>
            <div style={{ padding:"4px 0 6px" }}>
              {TRENDING.map(({ tag, count }) => (
                <div key={tag} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 16px", cursor:"pointer", transition:"background 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <IcoHash />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{tag}</div>
                    <div style={{ fontSize:11, color:"var(--text-muted)" }}>{count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Quick Links */}
          <div style={{ background:"var(--bg-surface)", borderRadius:12, border:"1px solid var(--border-subtle)", overflow:"hidden" }}>
            <div style={{ padding:"14px 16px 10px", fontWeight:700, fontSize:15, borderBottom:"1px solid var(--border-subtle)" }}>Campus Quick Links</div>
            <div style={{ padding:"10px 12px 12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {QUICK_LINKS.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"9px 6px", borderRadius:8, background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)", fontSize:12, fontWeight:500, textDecoration:"none", transition:"background 150ms, color 150ms" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--csun-red)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >{label}</a>
              ))}
            </div>
          </div>

          <div style={{ marginTop:16, fontSize:11, color:"var(--text-muted)", textAlign:"center" }}>
            Campus Connect &copy; 2026 &mdash; CSUN
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
