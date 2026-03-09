// =============================================================================
// hooks/useFeed.ts
//
// Master hook for the social feed.
// Owns: posts state, pagination, likes, reposts, and all API calls.
// Uses optimistic updates so the UI feels instant — rolls back on error.
//
// Kept separate from the page component so the component only renders UI.
// =============================================================================

import { useState, useCallback, useRef } from 'react';
import type { Post } from '../types';
import * as api from '../api/posts';

// Demo seed data used when backend is not yet connected.
// Replace this with a real useEffect(() => { api.getFeed() }, []) call
// once your auth + backend are wired up.
const SEED: Post[] = [
  {
    id: 'p1',
    content: 'AI Resume Generator is live — it tailors your resume to each job description automatically. Internship season just got a whole lot easier for every Matador out there.',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=70&auto=format&fit=crop'],
    tags: ['AI', 'Career'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u1', firstName: 'Sara', lastName: 'Hussein', profilePicture: null, userType: 'student' },
    _count: { Like: 52, Comment: 15, other_Post: 11 },
    isLikedByUser: false,
  },
  {
    id: 'p2',
    content: 'AI Closet prototype is running — reads your schedule + weather, suggests an outfit from your saved wardrobe. Never stare at your closet again before an 8 AM.',
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=70&auto=format&fit=crop'],
    tags: ['AI', 'Ideas'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u2', firstName: 'Justin', lastName: 'Ayson', profilePicture: null, userType: 'student' },
    _count: { Like: 44, Comment: 8, other_Post: 7 },
    isLikedByUser: false,
  },
  {
    id: 'p3',
    content: 'Marketplace card layout A vs B — voting closes Friday. Goal is a faster browse-to-contact flow so we cut out the DM-then-wait loop that kills deals.',
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=70&auto=format&fit=crop'],
    tags: ['Design', 'Marketplace'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u3', firstName: 'Joseph', lastName: 'Forsyth', profilePicture: null, userType: 'student' },
    _count: { Like: 29, Comment: 12, other_Post: 3 },
    isLikedByUser: false,
  },
  {
    id: 'p4',
    content: 'SRC schedule feature is holding 60fps on the dashboard with full micro-interactions. Added spring physics to the card stack so it feels alive when you swipe between sessions.',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=70&auto=format&fit=crop'],
    tags: ['SRC', 'Dev'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u4', firstName: 'Elijah', lastName: 'Cortez', profilePicture: null, userType: 'student' },
    _count: { Like: 38, Comment: 9, other_Post: 5 },
    isLikedByUser: false,
  },
  {
    id: 'p5',
    content: 'AR campus map is scanning building markers and overlaying real-time directions. Point your camera at any CSUN entrance and it tells you exactly which room to head to.',
    images: ['https://images.unsplash.com/photo-1529336953121-ad3ffefc7748?w=900&q=70&auto=format&fit=crop'],
    tags: ['AR', 'Campus'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u5', firstName: 'Ivan', lastName: 'Juarez', profilePicture: null, userType: 'student' },
    _count: { Like: 31, Comment: 9, other_Post: 5 },
    isLikedByUser: false,
  },
  {
    id: 'p6',
    content: 'Auth flow refactor pushed — clearer inline error states, faster OTP redirect, and the signup modal no longer flickers on mobile Safari. Small details, big difference.',
    images: [],
    tags: ['Dev'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u6', firstName: 'Vram', lastName: 'Ghazourian', profilePicture: null, userType: 'student' },
    _count: { Like: 16, Comment: 2, other_Post: 1 },
    isLikedByUser: false,
  },
  {
    id: 'p7',
    content: 'Waste Scanner AI now distinguishes recyclables from trash and compost with 91% accuracy on the test set. Drop items in the bin they actually belong in. CSUN gets greener.',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=70&auto=format&fit=crop'],
    tags: ['AI', 'Campus'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u7', firstName: 'Gisselle', lastName: 'Burgos', profilePicture: null, userType: 'student' },
    _count: { Like: 38, Comment: 7, other_Post: 6 },
    isLikedByUser: false,
  },
];

export function useFeed(currentUserId: string) {
  const [posts,      setPosts]      = useState<Post[]>(SEED);
  const [loading,    setLoading]    = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore,    setHasMore]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const inFlight = useRef(new Set<string>()); // tracks pending like/repost ops

  // ── Optimistic like toggle ──────────────────────────────────────────────────
  const toggleLike = useCallback(async (postId: string) => {
    if (inFlight.current.has(`like_${postId}`)) return;
    inFlight.current.add(`like_${postId}`);

    // Read current state before mutating
    const previous = posts.find(p => p.id === postId);
    if (!previous) return;
    const wasLiked = previous.isLikedByUser ?? false;

    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id !== postId ? p : {
        ...p,
        isLikedByUser: !wasLiked,
        _count: { ...p._count, Like: p._count.Like + (wasLiked ? -1 : 1) },
      }
    ));

    try {
      if (wasLiked) await api.unlikePost(postId);
      else          await api.likePost(postId);
    } catch {
      // Roll back on failure
      setPosts(prev => prev.map(p =>
        p.id !== postId ? p : {
          ...p,
          isLikedByUser: wasLiked,
          _count: { ...p._count, Like: previous._count.Like },
        }
      ));
    } finally {
      inFlight.current.delete(`like_${postId}`);
    }
  }, [posts]);

  // ── Create post (prepend to feed) ──────────────────────────────────────────
  const addPost = useCallback((post: Post) => {
    setPosts(prev => [post, ...prev]);
  }, []);

  // ── Delete own post ────────────────────────────────────────────────────────
  const removePost = useCallback(async (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    try {
      await api.deletePost(postId);
    } catch {
      setError('Failed to delete post. Please try again.');
    }
  }, []);

  // ── Increment comment count (called after successful comment submit) ────────
  const incrementComments = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id !== postId ? p : {
        ...p, _count: { ...p._count, Comment: p._count.Comment + 1 },
      }
    ));
  }, []);

  // ── Increment repost count ─────────────────────────────────────────────────
  const incrementReposts = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id !== postId ? p : {
        ...p, _count: { ...p._count, other_Post: p._count.other_Post + 1 },
      }
    ));
  }, []);

  // ── Load more (pagination) ─────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await api.getFeed(nextCursor ?? undefined);
      setPosts(prev => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      setError('Failed to load more posts.');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, nextCursor]);

  return {
    posts,
    loading,
    hasMore,
    error,
    toggleLike,
    addPost,
    removePost,
    incrementComments,
    incrementReposts,
    loadMore,
  };
}
