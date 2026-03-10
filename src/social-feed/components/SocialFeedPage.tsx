// =============================================================================
// components/SocialFeedPage.tsx  — v2 main shell
// Single-page app shell for the Campus Connect social feed.
// Routes between: feed | notifications | saved | events | marketplace | profile | settings
// =============================================================================
"use client";

import { useState, useCallback, useRef, useEffect, ChangeEvent } from "react";
import { useTheme }         from "../context/ThemeContext";
import { useFeed }          from "../hooks/useFeed";
import { useNotifications } from "../hooks/useNotifications";
import type { AppPage }     from "../types/feed.types";

import { PostCard }      from "./PostCard";
import { PostComposer }  from "./PostComposer";
import { SkeletonPost }  from "./SkeletonPost";

import NotificationsPage from "../pages/NotificationsPage";
import SavedPostsPage    from "../pages/SavedPostsPage";
import { EventsPage }        from "../pages/EventsPage";
import { MarketplacePage }   from "../pages/MarketplacePage";
import ProfilePage       from "../pages/ProfilePage";
import SettingsPage      from "../pages/SettingsPage";

// ─── constants ───────────────────────────────────────────────────────────────
const CURRENT_USER_ID       = "u-sarah";
const CURRENT_USER_INITIALS = "SM";

// ─── nav items ───────────────────────────────────────────────────────────────
const NAV_ITEMS: { page: AppPage; icon: string; label: string }[] = [
  { page: "feed",          icon: "🏠", label: "Home"         },
  { page: "notifications", icon: "🔔", label: "Notifications"},
  { page: "saved",         icon: "🔖", label: "Saved"        },
  { page: "events",        icon: "📅", label: "Events"       },
  { page: "marketplace",   icon: "🛍️", label: "Marketplace"  },
  { page: "profile",       icon: "👤", label: "Profile"      },
  { page: "settings",      icon: "⚙️", label: "Settings"     },
];

// ─── search index ─────────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  { label: "Campus Events",    page: "events"      as AppPage },
  { label: "Study Groups",     page: "feed"        as AppPage },
  { label: "Marketplace",      page: "marketplace" as AppPage },
  { label: "Notifications",    page: "notifications"as AppPage},
  { label: "My Profile",       page: "profile"     as AppPage },
  { label: "Saved Posts",      page: "saved"       as AppPage },
  { label: "Settings",         page: "settings"    as AppPage },
];

// ─── inline styles ───────────────────────────────────────────────────────────
const shell: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--bg-base)",
  color: "var(--text-primary)",
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: "background 250ms, color 250ms",
};
const layout: React.CSSProperties = {
  maxWidth: 1260,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "220px 1fr 280px",
  gap: 0,
  minHeight: "100vh",
};
const leftSidebar: React.CSSProperties = {
  position: "sticky",
  top: 0,
  height: "100vh",
  overflowY: "auto",
  borderRight: "1px solid var(--border-subtle)",
  padding: "24px 0",
  background: "var(--bg-surface)",
  display: "flex",
  flexDirection: "column",
};
const rightSidebar: React.CSSProperties = {
  position: "sticky",
  top: 0,
  height: "100vh",
  overflowY: "auto",
  borderLeft: "1px solid var(--border-subtle)",
  padding: "20px 16px",
  background: "var(--bg-surface)",
};
const centerCol: React.CSSProperties = {
  padding: "20px 20px 60px",
  minHeight: "100vh",
};

// ─── component ────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

export default function SocialFeedPage() {
  const { isDark, toggleTheme } = useTheme();
  const { posts, savedPostIds, isLoading, isLoadingMore, error, refresh, loadMore, handleLike, handleCreate, handleDelete, handleSave, handleRepost } = useFeed();
  const { unreadCount } = useNotifications();

  const [page, setPage]           = useState<AppPage>("feed");
  const [searchQuery, setSearch]  = useState("");
  const [searchFocused, setFocused] = useState(false);
  const [toasts, setToasts]       = useState<Toast[]>([]);
  const toastId = useRef(0);

  const showToast = useCallback((msg: string, type: ToastType = "info") => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const filteredSearch = searchQuery.trim()
    ? SEARCH_INDEX.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const sentinelRef = useRef<HTMLDivElement>(null);

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

  // ─── centre page switcher ──────────────────────────────────────────────────
  function renderCenter() {
    if (page === "notifications") return <NotificationsPage />;
    if (page === "saved")         return <SavedPostsPage posts={posts} savedPostIds={savedPostIds} currentUserId={CURRENT_USER_ID} onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost} />;
    if (page === "events")        return <EventsPage onToast={showToast} />;
    if (page === "marketplace")   return <MarketplacePage onToast={showToast} />;
    if (page === "profile")       return <ProfilePage currentUserId={CURRENT_USER_ID} posts={posts} savedPostIds={savedPostIds} onLike={handleLike} onDelete={handleDelete} onSave={handleSave} onRepost={handleRepost} onNavigateSettings={() => navTo("settings")} />;
    if (page === "settings")      return <SettingsPage onToast={showToast} />;

    // ── feed ─────────────────────────────────────────────────────────────────
    return (
      <>
        <PostComposer
          currentUserInitials={CURRENT_USER_INITIALS}
          onPost={async (body) => { await handleCreate(body); }}
        />

        {error && (
          <div style={{ padding:14, borderRadius:"var(--radius-md)", background:"#fff0f0", border:"1px solid #fecaca", color:"#b91c1c", marginBottom:12, fontSize:14 }}>
            {error} — <button onClick={refresh} style={{ fontWeight:600, background:"none", border:"none", color:"#b91c1c", cursor:"pointer" }}>Retry</button>
          </div>
        )}

        {isLoading && !posts.length ? <SkeletonPost count={4} /> : (
          <>
            {posts.length === 0 && !isLoading && (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p className="empty-title">Nothing here yet</p>
                <p className="empty-sub">Be the first to post something!</p>
              </div>
            )}
            {posts.map(p => (
              <PostCard
                key={p.id}
                post={p}
                currentUserId={CURRENT_USER_ID}
                isSaved={savedPostIds.has(p.id)}
                onLike={handleLike}
                onDelete={handleDelete}
                onSave={handleSave}
                onRepost={handleRepost}
              />
            ))}
            <div ref={sentinelRef} style={{ height:1 }} />
            {isLoadingMore && <SkeletonPost count={2} />}
          </>
        )}
      </>
    );
  }

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <div style={shell}>
      <div style={layout}>

        {/* ── Left sidebar ─────────────────────────────────────────────────── */}
        <nav style={leftSidebar}>
          {/* Logo */}
          <div style={{ padding:"0 20px 24px", borderBottom:"1px solid var(--border-subtle)", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:"var(--csun-red)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:18 }}>🎓</span>
              </div>
              <span style={{ fontSize:17, fontWeight:700, color:"var(--text-primary)", letterSpacing:"-0.3px" }}>Campus Connect</span>
            </div>
          </div>

          {/* Nav links */}
          <div style={{ flex:1, padding:"0 8px" }}>
            {NAV_ITEMS.map(({ page: p, icon, label }) => {
              const active = page === p;
              return (
                <button
                  key={p}
                  onClick={() => navTo(p)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:12,
                    padding:"11px 12px", borderRadius:"var(--radius-md)", border:"none",
                    background: active ? "var(--csun-red)" : "transparent",
                    color: active ? "#fff" : "var(--text-secondary)",
                    fontSize:14, fontWeight: active ? 600 : 400,
                    cursor:"pointer", textAlign:"left", marginBottom:2,
                    transition:"background 150ms, color 150ms",
                    position:"relative",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize:18, lineHeight:1 }}>{icon}</span>
                  <span>{label}</span>
                  {p === "notifications" && unreadCount > 0 && (
                    <span style={{
                      marginLeft:"auto", minWidth:18, height:18, borderRadius:99,
                      background: active ? "rgba(255,255,255,.3)" : "var(--csun-red)",
                      color:"#fff", fontSize:11, fontWeight:700,
                      display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px",
                    }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Theme toggle */}
          <div style={{ padding:"12px 20px", borderTop:"1px solid var(--border-subtle)" }}>
            <button
              onClick={toggleTheme}
              style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", fontSize:13, padding:0 }}
            >
              <span style={{ fontSize:16 }}>{isDark ? "☀️" : "🌙"}</span>
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
            </button>
          </div>
        </nav>

        {/* ── Centre ───────────────────────────────────────────────────────── */}
        <main style={centerCol}>{renderCenter()}</main>

        {/* ── Right sidebar ────────────────────────────────────────────────── */}
        <aside style={rightSidebar}>
          {/* Search */}
          <div style={{ marginBottom:20, position:"relative" }}>
            <div
              style={{
                display:"flex", alignItems:"center", gap:8,
                background:"var(--bg-elevated)", border:`1px solid ${searchFocused ? "var(--csun-red)" : "var(--border-subtle)"}`,
                borderRadius:99, padding:"8px 14px",
                boxShadow: searchFocused ? "0 0 0 3px var(--csun-red-glow)" : "none",
                transition:"border-color 150ms, box-shadow 150ms",
              }}
            >
              <span style={{ fontSize:14, opacity:.6 }}>🔍</span>
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                style={{ flex:1, border:"none", outline:"none", background:"transparent", color:"var(--text-primary)", fontSize:13 }}
              />
            </div>

            {/* Suggestions dropdown */}
            {searchFocused && filteredSearch.length > 0 && (
              <div style={{
                position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
                background:"var(--bg-surface)", border:"1px solid var(--border-subtle)",
                borderRadius:"var(--radius-md)", boxShadow:"var(--shadow-md)", zIndex:50, overflow:"hidden",
              }}>
                {filteredSearch.map(r => (
                  <button
                    key={r.label}
                    onMouseDown={() => navTo(r.page)}
                    style={{ width:"100%", padding:"10px 14px", border:"none", background:"transparent", color:"var(--text-primary)", fontSize:13, textAlign:"left", cursor:"pointer", transition:"background 100ms" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Trending topics */}
          <SideCard title="📈 Trending">
            {["#CSUN2025", "#FinalsWeek", "#Matador", "#CampusLife", "#SpringFest", "#ResearchDay"].map(tag => (
              <div key={tag} style={{ padding:"8px 0", borderBottom:"1px solid var(--border-subtle)", cursor:"pointer", color:"var(--csun-red)", fontSize:13, fontWeight:500 }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                {tag}
              </div>
            ))}
          </SideCard>

          {/* Who to follow */}
          <SideCard title="👥 Who to Follow">
            {SUGGESTED_USERS.map(u => (
              <SuggestedUser key={u.handle} {...u} />
            ))}
          </SideCard>
        </aside>

      </div>

      {/* ── Toast overlay ────────────────────────────────────────────────── */}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding:"11px 18px", borderRadius:"var(--radius-md)", boxShadow:"var(--shadow-md)",
            fontSize:14, fontWeight:500, color:"#fff", pointerEvents:"auto",
            background: t.type === "success" ? "#16a34a" : t.type === "error" ? "#dc2626" : "var(--csun-red)",
            animation:"fadeUp 200ms ease",
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── helper sub-components ────────────────────────────────────────────────────
function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:20, background:"var(--bg-elevated)", borderRadius:"var(--radius-lg)", border:"1px solid var(--border-subtle)", overflow:"hidden" }}>
      <div style={{ padding:"12px 14px", fontWeight:700, fontSize:14, borderBottom:"1px solid var(--border-subtle)" }}>{title}</div>
      <div style={{ padding:"0 14px 8px" }}>{children}</div>
    </div>
  );
}

const SUGGESTED_USERS = [
  { name:"Ana Rivera",    handle:"@ana_r",    initials:"AR" },
  { name:"Dev Patel",     handle:"@devpatel", initials:"DP" },
  { name:"Kai Chen",      handle:"@kaichen",  initials:"KC" },
];

function SuggestedUser({ name, handle, initials }: { name:string; handle:string; initials:string }) {
  const [following, setFollowing] = useState(false);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid var(--border-subtle)" }}>
      <div className="avatar" style={{ width:34, height:34, fontSize:12, flexShrink:0 }}>
        <span className="avatar-initials">{initials}</span>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600 }}>{name}</div>
        <div style={{ fontSize:12, color:"var(--text-muted)" }}>{handle}</div>
      </div>
      <button
        onClick={() => setFollowing(f => !f)}
        className={following ? "btn-secondary" : "btn-primary"}
        style={{ fontSize:12, padding:"5px 12px" }}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
