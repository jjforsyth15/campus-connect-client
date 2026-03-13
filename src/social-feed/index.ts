// =============================================================================
// index.ts — barrel export for @/social-feed
// Import the feed module cleanly from anywhere in the Next.js app:
//   import SocialFeedPage from '@/social-feed'
//   import { PostCard, useTheme } from '@/social-feed'
// =============================================================================

// ── Main shell ─────────────────────────────────────────────────────────────
export { default } from "./components/SocialFeedPage";
export { default as SocialFeedPage } from "./components/SocialFeedPage";

// ── Page components ────────────────────────────────────────────────────────
export { default as NotificationsPage } from "./pages/NotificationsPage";
export { default as SavedPostsPage }    from "./pages/SavedPostsPage";
export { EventsPage }                   from "./pages/EventsPage";
export { MarketplacePage }              from "./pages/MarketplacePage";
export { default as ProfilePage }       from "./pages/ProfilePage";
export { default as SettingsPage }      from "./pages/SettingsPage";

// ── Feed components ────────────────────────────────────────────────────────
export { PostCard }      from "./components/PostCard";
export { PostComposer }  from "./components/PostComposer";
export { CommentsPanel } from "./components/CommentsPanel";
export { SkeletonPost }  from "./components/SkeletonPost";

// ── Context ────────────────────────────────────────────────────────────────
export { ThemeProvider, useTheme } from "./context/ThemeContext";

// ── Hooks ──────────────────────────────────────────────────────────────────
export { useFeed }          from "./hooks/useFeed";
export { useComments }      from "./hooks/useComments";
export { useNotifications } from "./hooks/useNotifications";
export { useProfile }       from "./hooks/useProfile";

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  Post,
  PostAuthor,
  FeedResponse,
  Comment,
  CommentsResponse,
  AppNotification,
  NotifFilter,
  CampusEvent,
  MarketItem,
  UserProfile,
  ProfileUpdatePayload,
  SearchResult,
  AppPage,
  FeedTab,
  Theme,
} from "./types/feed.types";

// ── API utility ────────────────────────────────────────────────────────────
export * as feedApi from "./utils/feed.api";
