// =============================================================================
// pages/ProfilePage.tsx
// Current user's profile: banner, avatar, bio, stats, tabbed post list.
// =============================================================================

import { useState } from "react";
import type { Post } from "../types/feed.types";
import { useProfile } from "../hooks/useProfile";
import { PostCard } from "../components/PostCard";

interface ProfilePageProps {
  currentUserId: string;
  posts: Post[];
  savedPostIds: Set<string>;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onRepost: (id: string, comment?: string) => void;
  onNavigateSettings: () => void;
}

type ProfileTab = "posts" | "replies" | "media";

export default function ProfilePage({
  currentUserId, posts, savedPostIds,
  onLike, onSave, onDelete, onRepost, onNavigateSettings,
}: ProfilePageProps) {
  const { profile, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  const myPosts    = posts.filter(p => p.User.id === currentUserId);
  const shownPosts = activeTab === "posts"
    ? myPosts
    : activeTab === "media"
    ? myPosts.filter(p => p.images.length > 0)
    : []; // replies — backend endpoint not yet live

  if (isLoading || !profile) {
    return <ProfileSkeleton />;
  }

  const joinYear = new Date(profile.joinedAt).getFullYear();

  return (
    <div style={{ animation: "fadeUp 240ms ease both" }}>

      {/* Banner */}
      <div style={{ height:140, background:"linear-gradient(135deg,#7B0124 0%,var(--csun-red) 40%,#3A0A18 100%)", position:"relative" }} />

      {/* Avatar + Edit */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 20px", marginTop:-36, marginBottom:12 }}>
        {/* Outer ring wrapper keeps the outline away from overflow:hidden */}
        <div style={{ borderRadius:"50%", outline:"4px solid var(--bg-base)", flexShrink:0 }}>
          <div className="avatar" style={{ width:72, height:72, fontSize:26 }}>
            {profile.profilePicture
              ? <img src={profile.profilePicture} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : <span className="avatar-initials">{profile.firstName[0]}{profile.lastName[0]}</span>
            }
          </div>
        </div>
        <button
          className="btn-secondary"
          onClick={onNavigateSettings}
          style={{ marginBottom:4, padding:"7px 18px" }}
        >
          Edit Profile
        </button>
      </div>

      {/* Info */}
      <div style={{ padding:"0 20px 16px", borderBottom:"1px solid var(--border-subtle)" }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:700, color:"var(--text-primary)", marginBottom:2 }}>
          {profile.firstName} {profile.lastName}
          {profile.isVerified && (
            <svg style={{ display:"inline", marginLeft:6, verticalAlign:"middle" }} width="18" height="18" viewBox="0 0 24 24" fill="var(--csun-red)">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
            </svg>
          )}
        </div>
        <div style={{ fontSize:13, color:"var(--text-muted)", marginBottom:10 }}>
          @{profile.username} · {profile.major}
        </div>
        {profile.bio && (
          <p style={{ fontSize:14, lineHeight:1.6, color:"var(--text-secondary)", marginBottom:10 }}>{profile.bio}</p>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          {profile.location && (
            <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--text-muted)" }}>
              <PinIcon /> {profile.location}
            </span>
          )}
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--text-muted)" }}>
            <CalIcon /> Joined {joinYear}
          </span>
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--csun-red)" }}>
              <LinkIcon /> {profile.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:20, padding:"14px 20px", borderBottom:"1px solid var(--border-subtle)" }}>
        {[
          { count: myPosts.length,           label: "Posts"     },
          { count: profile.followingCount,   label: "Following" },
          { count: profile.followerCount,    label: "Followers" },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize:16, fontWeight:700, color:"var(--text-primary)" }}>{s.count.toLocaleString()}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border-subtle)" }}>
        {(["posts","replies","media"] as ProfileTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex:1, padding:"16px", border:"none", background:"transparent",
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize:14, position:"relative", cursor:"pointer",
              transition:"color 150ms", textTransform:"capitalize",
            }}
          >
            {tab}
            {activeTab === tab && (
              <span style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:28, height:2, background:"var(--csun-red)", borderRadius:99 }} />
            )}
          </button>
        ))}
      </div>

      {/* Post list */}
      {shownPosts.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div className="empty-title">
            {activeTab === "replies" ? "No replies yet" : activeTab === "media" ? "No media posts" : "No posts yet"}
          </div>
          <div className="empty-sub">
            {activeTab === "posts" ? "Share something with the campus community!" : "Nothing here yet."}
          </div>
        </div>
      ) : (
        shownPosts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            isSaved={savedPostIds.has(post.id)}
            onLike={onLike}
            onSave={onSave}
            onDelete={onDelete}
            onRepost={onRepost}
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height:140 }} />
      <div style={{ padding:"0 20px", marginTop:-32, marginBottom:16 }}>
        <div className="skeleton" style={{ width:72, height:72, borderRadius:"50%", marginBottom:12 }} />
        <div className="skeleton" style={{ width:"40%", height:14, borderRadius:6, marginBottom:8 }} />
        <div className="skeleton" style={{ width:"60%", height:12, borderRadius:6 }} />
      </div>
    </div>
  );
}

// Icons
const PinIcon  = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const CalIcon  = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const LinkIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
