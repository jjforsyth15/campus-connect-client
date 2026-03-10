// =============================================================================
// components/PostCard.tsx
// Individual post card for the feed.
// Props match the new SocialFeedPage v2 API.
// =============================================================================

import { useState, useRef, CSSProperties } from "react";
import type { Post } from "../types/feed.types";
import { CommentsPanel } from "./CommentsPanel";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  isSaved: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onRepost: (id: string, comment?: string) => void;
  style?: CSSProperties;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return `${s}s`;
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PostCard({ post, currentUserId, isSaved, onLike, onSave, onDelete, onRepost, style }: PostCardProps) {
  const [showComments,  setShowComments]  = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [likeAnim,      setLikeAnim]      = useState(false);
  const [repostInput,   setRepostInput]   = useState("");
  const [showRepostBox, setShowRepostBox] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = post.User.id === currentUserId;
  const isLiked = post.isLikedByUser ?? false;

  function handleLike() {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    onLike(post.id);
  }

  function handleRepostSubmit() {
    onRepost(post.id, repostInput.trim() || undefined);
    setShowRepostBox(false);
    setRepostInput("");
  }

  const authorInits = initials(post.User.firstName, post.User.lastName);
  const badge = post.User.userType === "faculty" ? "Faculty" : post.User.userType === "alumni" ? "Alumni" : "Student";
  const badgeColor = post.User.userType === "faculty" ? "var(--info)" : post.User.userType === "alumni" ? "var(--accent-gold)" : "var(--csun-red)";
  const badgeBg    = post.User.userType === "faculty" ? "var(--info-dim)" : post.User.userType === "alumni" ? "var(--accent-gold-dim)" : "var(--csun-red-dim)";

  return (
    <article
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        padding: "18px 20px",
        animation: "fadeUp 240ms ease both",
        transition: "background 150ms",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {/* ── Repost banner ────────────────────────────────────────────────── */}
      {post.isRepost && (
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, fontSize:12, color:"var(--text-muted)", fontWeight:500 }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          {post.User.firstName} {post.User.lastName} reposted
          {post.repostComment && <span style={{ fontStyle:"italic" }}>— "{post.repostComment}"</span>}
        </div>
      )}

      {/* ── Author row ───────────────────────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
        {/* Avatar */}
        <div className="avatar" style={{ width:42, height:42, fontSize:15, flexShrink:0 }}>
          {post.User.profilePicture
            ? <img src={post.User.profilePicture} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <span className="avatar-initials">{authorInits}</span>
          }
        </div>

        {/* Name + meta */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>
              {post.User.firstName} {post.User.lastName}
            </span>
            <span style={{ fontSize:11, fontWeight:600, color:badgeColor, background:badgeBg, padding:"2px 8px", borderRadius:99 }}>
              {badge}
            </span>
            <span style={{ fontSize:12, color:"var(--text-muted)", marginLeft:"auto" }}>{timeAgo(post.createdAt)}</span>
          </div>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:6 }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ fontSize:11, fontWeight:500, color:"var(--text-muted)", background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", padding:"1px 8px", borderRadius:99 }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Overflow menu */}
        <div ref={menuRef} style={{ position:"relative" }} onBlur={e => { if (!menuRef.current?.contains(e.relatedTarget as Node)) setMenuOpen(false); }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ width:32, height:32, borderRadius:"50%", border:"none", background:"transparent", color:"var(--text-muted)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"background 150ms" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            aria-label="More options"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
          </button>
          {menuOpen && (
            <div style={{ position:"absolute", right:0, top:"110%", background:"var(--bg-surface)", border:"1px solid var(--border-medium)", borderRadius:"var(--radius-md)", boxShadow:"var(--shadow-panel)", zIndex:50, minWidth:160, animation:"scaleIn 150ms ease both", overflow:"hidden" }}>
              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/social#${post.id}`); setMenuOpen(false); }} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", border:"none", background:"transparent", color:"var(--text-secondary)", fontSize:13, cursor:"pointer", transition:"background 150ms" }} onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Copy link
              </button>
              <button onClick={() => { onSave(post.id); setMenuOpen(false); }} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", border:"none", background:"transparent", color:"var(--text-secondary)", fontSize:13, cursor:"pointer", transition:"background 150ms" }} onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {isSaved ? "Remove from saved" : "Save post"}
              </button>
              {isOwner && (
                <button onClick={() => { onDelete(post.id); setMenuOpen(false); }} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", border:"none", background:"transparent", color:"var(--danger)", fontSize:13, cursor:"pointer", transition:"background 150ms" }} onMouseEnter={e => (e.currentTarget.style.background = "var(--danger-dim)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  Delete post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Post body ────────────────────────────────────────────────────── */}
      <p style={{ fontSize:14, lineHeight:1.65, color:"var(--text-primary)", marginBottom: post.images.length > 0 ? 14 : 0, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
        {post.content}
      </p>

      {/* ── Image(s) ─────────────────────────────────────────────────────── */}
      {post.images.length > 0 && (
        <div style={{
          display:"grid",
          gridTemplateColumns: post.images.length === 1 ? "1fr" : "1fr 1fr",
          gap:3, borderRadius:"var(--radius-md)", overflow:"hidden", marginBottom:14,
        }}>
          {post.images.slice(0, 4).map((src, idx) => (
            <div key={src} style={{ position:"relative", aspectRatio: post.images.length === 1 ? "16/9" : "1/1", overflow:"hidden" }}>
              <img
                src={src}
                alt=""
                style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 300ms" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "")}
              />
              {idx === 3 && post.images.length > 4 && (
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:22, fontWeight:700 }}>
                  +{post.images.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Repost quote embed ───────────────────────────────────────────── */}
      {post.Post && (
        <div style={{ border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)", padding:"12px 14px", marginBottom:14, background:"var(--bg-elevated)" }}>
          <div style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", marginBottom:5 }}>
            {post.Post.User.firstName} {post.Post.User.lastName}
          </div>
          <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.5 }}>{post.Post.content}</p>
        </div>
      )}

      {/* ── Action bar ───────────────────────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:12 }}>

        {/* Comment */}
        <ActionBtn
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          count={fmtCount(post._count.Comment)}
          label="Comment"
          onClick={() => setShowComments(v => !v)}
          active={showComments}
          activeColor="var(--info)"
        />

        {/* Repost */}
        <ActionBtn
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
          count={fmtCount(post._count.other_Post)}
          label="Repost"
          onClick={() => setShowRepostBox(v => !v)}
          active={showRepostBox}
          activeColor="var(--success)"
        />

        {/* Like */}
        <ActionBtn
          icon={
            <svg
              width="16" height="16"
              fill={isLiked ? "var(--csun-red)" : "none"}
              stroke={isLiked ? "var(--csun-red)" : "currentColor"}
              strokeWidth="1.7"
              viewBox="0 0 24 24"
              style={{ transform: likeAnim ? "scale(1.35)" : "scale(1)", transition: "transform 200ms" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          }
          count={fmtCount(post._count.Like)}
          label="Like"
          onClick={handleLike}
          active={isLiked}
          activeColor="var(--csun-red)"
        />

        {/* Bookmark */}
        <button
          onClick={() => onSave(post.id)}
          aria-label={isSaved ? "Unsave post" : "Save post"}
          style={{
            marginLeft:"auto",
            width:34, height:34, borderRadius:"50%", border:"none",
            background:"transparent", display:"flex", alignItems:"center", justifyContent:"center",
            color: isSaved ? "var(--csun-red)" : "var(--text-muted)",
            cursor:"pointer", transition:"background 150ms, color 150ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="16" height="16" fill={isSaved ? "var(--csun-red)" : "none"} stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* ── Repost input box ─────────────────────────────────────────────── */}
      {showRepostBox && (
        <div style={{ marginTop:12, display:"flex", gap:8, alignItems:"center", animation:"fadeUp 180ms ease both" }}>
          <input
            type="text"
            value={repostInput}
            onChange={e => setRepostInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleRepostSubmit(); } }}
            placeholder="Add a comment (optional)…"
            maxLength={280}
            style={{ flex:1, padding:"8px 14px", borderRadius:99, border:"1px solid var(--border-subtle)", background:"var(--bg-input)", color:"var(--text-primary)", fontSize:13, outline:"none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--csun-red)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
          />
          <button
            onClick={handleRepostSubmit}
            style={{ padding:"8px 16px", borderRadius:99, border:"none", background:"var(--csun-red)", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", transition:"opacity 150ms" }}
          >
            Repost
          </button>
          <button onClick={() => setShowRepostBox(false)} style={{ padding:"8px 12px", borderRadius:99, border:"1px solid var(--border-subtle)", background:"transparent", color:"var(--text-muted)", fontSize:12, cursor:"pointer" }}>
            Cancel
          </button>
        </div>
      )}

      {/* ── Comments panel ───────────────────────────────────────────────── */}
      {showComments && (
        <CommentsPanel postId={post.id} currentUserId={currentUserId} />
      )}
    </article>
  );
}

// ── Avatar re-export (referenced in index.ts barrel) ──────────────────────────
export function Avatar({ firstName, lastName, src, size = 40 }: { firstName: string; lastName: string; src?: string | null; size?: number }) {
  const inits = initials(firstName, lastName);
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {src
        ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span className="avatar-initials">{inits}</span>
      }
    </div>
  );
}

// ── Helper sub-component ──────────────────────────────────────────────────────
function ActionBtn({
  icon, count, label, onClick, active, activeColor,
}: {
  icon: React.ReactNode;
  count: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        display:"flex", alignItems:"center", gap:5,
        padding:"5px 10px", borderRadius:99, border:"none",
        background:"transparent", cursor:"pointer",
        color: active ? activeColor : "var(--text-muted)",
        fontSize:13, fontWeight:500,
        transition:"background 150ms, color 150ms",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
      <span>{count}</span>
    </button>
  );
}
