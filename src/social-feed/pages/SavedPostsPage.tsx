// =============================================================================
// pages/SavedPostsPage.tsx
// Shows all posts the current user has bookmarked.
// Reads savedPostIds + posts from the parent feed state passed as props.
// =============================================================================

import type { Post } from "../types/feed.types";
import { PostCard } from "../components/PostCard";

interface SavedPostsPageProps {
  posts: Post[];
  savedPostIds: Set<string>;
  currentUserId: string;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onRepost: (id: string, comment?: string) => void;
}

export default function SavedPostsPage({
  posts,
  savedPostIds,
  currentUserId,
  onLike,
  onSave,
  onDelete,
  onRepost,
}: SavedPostsPageProps) {
  const saved = posts.filter(p => savedPostIds.has(p.id));

  if (!saved.length) {
    return (
      <div className="empty-state" style={{ animation: "fadeUp 240ms ease both" }}>
        <svg className="empty-icon" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <div className="empty-title">Nothing saved yet</div>
        <div className="empty-sub">
          Tap the bookmark icon on any post to save it here for later.
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp 240ms ease both" }}>
      <div style={{ padding: "10px 20px 4px", fontSize: 12, color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>
        {saved.length} saved {saved.length === 1 ? "post" : "posts"}
      </div>
      {saved.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          isSaved={true}
          onLike={onLike}
          onSave={onSave}
          onDelete={onDelete}
          onRepost={onRepost}
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}
