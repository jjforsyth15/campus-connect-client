// =============================================================================
// types/feed.types.ts
// All TypeScript interfaces for the Campus Connect social feed.
// No schema changes — these are frontend-only types.
// =============================================================================

// ── Shared author shape (mirrors backend PostAuthor) ─────────────────────────

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  userType: string;
  username?: string;
  isVerified?: boolean;
}

// ── Post ─────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  content: string;
  images: string[];
  isRepost: boolean;
  originalPostId: string | null;
  repostComment: string | null;
  createdAt: string;
  updatedAt: string;
  User: PostAuthor;
  Post?: Post | null;       // nested original when isRepost = true
  _count: {
    Like: number;
    Comment: number;
    other_Post: number;
  };
  isLikedByUser?: boolean;
  tags?: string[];
}

export interface FeedResponse {
  success: boolean;
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ── Comments ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  User: PostAuthor;
}

export interface CommentsResponse {
  success: boolean;
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export type NotifFilter = "all" | "unread" | "likes" | "comments" | "follows" | "reposts";

export interface AppNotification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "repost";
  fromUser: PostAuthor;
  postPreview?: string;
  timeAgo: string;
  read: boolean;
}

// ── Campus Events ─────────────────────────────────────────────────────────────

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  tag: string;
  tagColor: string;
  attendees: number;
  isRsvped: boolean;
  csunUrl?: string;
  description?: string;
}

// ── Marketplace ───────────────────────────────────────────────────────────────

export interface MarketItem {
  id: string;
  title: string;
  price: string;
  sellerName: string;
  condition: string;
  postedAt: string;
}

// ── User profile (for profile page & settings) ────────────────────────────────

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  major: string;
  year: string;
  userType: string;
  profilePicture: string | null;
  location: string;
  website: string;
  joinedAt: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
}

export interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  bio: string;
  major: string;
  year: string;
  userType: string;
  location: string;
  website: string;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchResult {
  type: "person" | "tag" | "event";
  id: string;
  label: string;
  sublabel: string;
  avatarInitials?: string;
}

// ── App navigation pages ──────────────────────────────────────────────────────

export type AppPage =
  | "feed"
  | "notifications"
  | "saved"
  | "events"
  | "marketplace"
  | "profile"
  | "settings";

// ── Feed tabs ─────────────────────────────────────────────────────────────────

export type FeedTab = "for-you" | "campus" | "clubs" | "following";

// ── Theme ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";
