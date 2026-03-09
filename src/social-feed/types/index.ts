// =============================================================================
// types/index.ts
//
// All TypeScript interfaces for Matador Connect — Social Feed.
// These mirror the backend posts.types.ts and Prisma schema exactly.
// Never define types inside component files — always import from here.
// =============================================================================

// ─── Auth / Session ──────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  userType: 'student' | 'alumni' | 'staff' | 'faculty' | 'recruiter' | 'admin';
  email: string;
  major?: string;
  year?: string;
  bio?: string;
}

// ─── Posts (mirror backend PostAuthor / PostWithAuthor exactly) ───────────────

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  userType: string;
}

export interface Post {
  id: string;
  content: string;
  images: string[];           // URLs stored in backend
  isRepost: boolean;
  originalPostId: string | null;
  repostComment: string | null;
  createdAt: string;
  updatedAt: string;
  User: PostAuthor;
  Post?: Post | null;         // nested original post when isRepost = true
  _count: {
    Like: number;
    Comment: number;
    other_Post: number;
  };
  isLikedByUser?: boolean;
  tags?: string[];            // UI-only: tags attached by composer
}

export interface FeedResponse {
  success: boolean;
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ─── Comments ────────────────────────────────────────────────────────────────

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

// ─── UI-only types ────────────────────────────────────────────────────────────

export type FeedTab  = 'forYou' | 'following' | 'trending';
export type SortMode = 'top' | 'latest';
export type PostTag  =
  | 'AI' | 'AR' | 'Dev' | 'Design' | 'SRC' | 'Campus'
  | 'Marketplace' | 'Ideas' | 'Career' | 'Events' | 'Clubs';

export const ALL_TAGS: Array<'All' | PostTag> = [
  'All', 'AI', 'AR', 'Campus', 'Career', 'Clubs',
  'Design', 'Dev', 'Events', 'Ideas', 'Marketplace', 'SRC',
];

/** Stored in localStorage — persists across sessions */
export interface UserPreferences {
  compactDensity: boolean;
  showImages: boolean;
  showTagColors: boolean;
  defaultTab: FeedTab;
  defaultSort: SortMode;
  notificationsEnabled: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  compactDensity: false,
  showImages: true,
  showTagColors: true,
  defaultTab: 'forYou',
  defaultSort: 'top',
  notificationsEnabled: true,
};

export interface AppNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost';
  fromUser: PostAuthor;
  postPreview?: string;
  timeAgo: string;
  read: boolean;
}

/** Controls the inline profile drawer (no React Router needed) */
export interface ProfileView {
  open: boolean;
  userId: string | null;
}
