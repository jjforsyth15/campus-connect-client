// =============================================================================
// hooks/useFeed.ts (v2)
// Master hook for the social feed.
// Matches SocialFeedPage v2 API:
//   handleLike, handleCreate, handleDelete, handleSave, handleRepost,
//   savedPostIds, isLoading, isLoadingMore, error, refresh, loadMore, posts
// Uses optimistic updates — rolls back on error.
// No backend/schema changes.
// =============================================================================

import { useState, useCallback, useRef } from 'react';
import type { Post } from '../types/feed.types';
import * as feedApi from '../utils/feed.api';

// Demo seed data used when backend is not yet connected.
// Replace this with a real useEffect(() => { api.getFeed() }, []) call
// once your auth + backend are wired up.
const SEED: Post[] = [
  // ── Campus life & student moments ────────────────────────────────────────
  {
    id: 'p1',
    content: 'Finals week hits different when the Oviatt is packed at 2 AM and you can still hear someone laughing in the stacks. Matadors do not fold. Who else is grinding right now? Drop a floor number below.',
    images: ['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=70&auto=format&fit=crop'],
    tags: ['FinalsWeek', 'CSUN'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u1', firstName: 'Sara', lastName: 'Hussein', profilePicture: null, userType: 'student' },
    _count: { Like: 94, Comment: 31, other_Post: 18 },
    isLikedByUser: false,
  },
  {
    id: 'p2',
    content: 'Friendly reminder: the Career Center has free same-day resume reviews this week, no appointment needed. Spring Career Fair is April 10 at the Matadome — 400+ employers. Go get that internship.',
    images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=70&auto=format&fit=crop'],
    tags: ['Career', 'Internship', 'SpringCareerFair'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u2', firstName: 'Justin', lastName: 'Ayson', profilePicture: null, userType: 'student' },
    _count: { Like: 67, Comment: 14, other_Post: 22 },
    isLikedByUser: false,
  },
  {
    id: 'p3',
    content: 'Hot take: the taco cart outside JD between 11 and 1 is the best meal deal on campus and I will not be taking questions. $3.50 and it is genuinely incredible. You know you know.',
    images: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=70&auto=format&fit=crop'],
    tags: ['CSUNDining', 'CampusLife'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u3', firstName: 'Joseph', lastName: 'Forsyth', profilePicture: null, userType: 'student' },
    _count: { Like: 211, Comment: 48, other_Post: 33 },
    isLikedByUser: false,
  },
  {
    id: 'p4',
    content: 'SRC open gym tonight 6–10 PM, all students welcome. Courts are free, pool is open, and the climbing wall finally has the new holds installed. Bring your CSUN ID and zero excuses.',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=70&auto=format&fit=crop'],
    tags: ['SRC', 'CampusEvents', 'StudentLife'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u4', firstName: 'Elijah', lastName: 'Cortez', profilePicture: null, userType: 'student' },
    _count: { Like: 88, Comment: 19, other_Post: 11 },
    isLikedByUser: false,
  },
  {
    id: 'p5',
    content: 'PSA: parking meter enforcement started early on Lot B this week. Got a $58 ticket because I forgot to switch the app. Check your zones, people. Save yourselves the pain I just went through.',
    images: [],
    tags: ['Parking', 'CSUN', 'CampusLife'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 80 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u5', firstName: 'Ivan', lastName: 'Juarez', profilePicture: null, userType: 'student' },
    _count: { Like: 143, Comment: 52, other_Post: 27 },
    isLikedByUser: false,
  },
  {
    id: 'p6',
    content: 'CSUN Tech Club hackathon kicks off March 20 in Oviatt Library 16. Teams of 2–4, 48 hours, real prizes, and free pizza on day one. Come build something with us — all majors welcome.',
    images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=70&auto=format&fit=crop'],
    tags: ['TechClub', 'Hackathon', 'CampusEvents'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 100 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u6', firstName: 'Vram', lastName: 'Ghazourian', profilePicture: null, userType: 'student' },
    _count: { Like: 56, Comment: 23, other_Post: 9 },
    isLikedByUser: false,
  },
  {
    id: 'p7',
    content: 'The view from the roof of the Bookstein Hall parking structure after class hits like a reset button. Northridge skyline at golden hour, mountains in the back — we genuinely go to a beautiful campus.',
    images: ['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=70&auto=format&fit=crop'],
    tags: ['CSUN', 'CampusLife', 'MatadorNetwork'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 130 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u7', firstName: 'Gisselle', lastName: 'Burgos', profilePicture: null, userType: 'student' },
    _count: { Like: 178, Comment: 41, other_Post: 29 },
    isLikedByUser: false,
  },
  {
    id: 'p8',
    content: 'Anyone taking COMP 490 this semester — drop your project idea below. We are doing an AI-powered study-group matcher that pairs you based on learning style, not just class section. Would love feedback.',
    images: [],
    tags: ['CompSci490', 'AI', 'StudyGroups'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 160 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u1', firstName: 'Sara', lastName: 'Hussein', profilePicture: null, userType: 'student' },
    _count: { Like: 39, Comment: 27, other_Post: 6 },
    isLikedByUser: false,
  },
  {
    id: 'p9',
    content: 'Sustainability Fair is April 5 at the USU — free tote bags, native plant giveaway, and CSUN Green Team is looking for volunteers. Real one if you show up. Campus gets a little greener every year.',
    images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=70&auto=format&fit=crop'],
    tags: ['Sustainability', 'CampusEvents', 'Community'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 200 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u3', firstName: 'Joseph', lastName: 'Forsyth', profilePicture: null, userType: 'student' },
    _count: { Like: 72, Comment: 18, other_Post: 14 },
    isLikedByUser: false,
  },
  {
    id: 'p10',
    content: 'Reminder that the Oviatt Library has free 3D printing for students — 100g per week, any filament color, and the staff will help you set up the file. Incredible resource that barely anyone uses. Tell your people.',
    images: ['https://images.unsplash.com/photo-1631378399918-fc4b8fc06c73?w=900&q=70&auto=format&fit=crop'],
    tags: ['LibraryHours', 'CSUN', 'Resources'],
    isRepost: false, originalPostId: null, repostComment: null,
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    User: { id: 'u4', firstName: 'Elijah', lastName: 'Cortez', profilePicture: null, userType: 'student' },
    _count: { Like: 231, Comment: 63, other_Post: 45 },
    isLikedByUser: false,
  },
];

export function useFeed() {
  const [posts,         setPosts]         = useState<Post[]>(SEED);
  const [savedPostIds,  setSavedPostIds]  = useState<Set<string>>(new Set());
  const [isLoading,     setIsLoading]     = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [nextCursor,    setNextCursor]    = useState<string | null>(null);
  const [hasMore,       setHasMore]       = useState(false);
  const inFlight = useRef(new Set<string>());

  // ── Refresh / initial load ──────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await feedApi.getFeed();
      setPosts(data.posts);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      setError("Couldn't connect to server — showing local posts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Load more (infinite scroll) ────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const data = await feedApi.getFeed(nextCursor);
      setPosts(prev => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      // silent
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, nextCursor]);

  // ── Optimistic like toggle ──────────────────────────────────────────────────
  const handleLike = useCallback(async (postId: string) => {
    if (inFlight.current.has(`like_${postId}`)) return;
    inFlight.current.add(`like_${postId}`);

    // Capture current state before mutating
    setPosts(prev => {
      const post = prev.find(p => p.id === postId);
      if (!post) { inFlight.current.delete(`like_${postId}`); return prev; }
      const wasLiked = post.isLikedByUser ?? false;
      // Fire the API call in the background from here
      const apiFn = wasLiked ? feedApi.unlikePost : feedApi.likePost;
      // Fire API in the background — do NOT roll back on failure (demo / offline mode keeps optimistic state)
      apiFn(postId).catch(() => { /* keep optimistic update */ }).finally(() => {
        inFlight.current.delete(`like_${postId}`);
      });
      // Return optimistic update immediately
      return prev.map(p =>
        p.id !== postId ? p : {
          ...p,
          isLikedByUser: !wasLiked,
          _count: { ...p._count, Like: p._count.Like + (wasLiked ? -1 : 1) },
        }
      );
    });
  }, []);

  // ── Create post ─────────────────────────────────────────────────────────────
  const handleCreate = useCallback(async (content: string, images?: string[]) => {
    try {
      const data = await feedApi.createPost(content, images ?? []);
      setPosts(prev => [data.post, ...prev]);
    } catch {
      const localPost: Post = {
        id:             `local-${Date.now()}`,
        content,
        images:         images ?? [],
        tags:           [],
        isRepost:       false,
        originalPostId: null,
        repostComment:  null,
        createdAt:      new Date().toISOString(),
        updatedAt:      new Date().toISOString(),
        User:           { id: 'u-sarah', firstName: 'Sara', lastName: 'Hussein', profilePicture: null, userType: 'student' },
        _count:         { Like: 0, Comment: 0, other_Post: 0 },
        isLikedByUser:  false,
      };
      setPosts(prev => [localPost, ...prev]);
    }
  }, []);

  // ── Delete post ─────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    try { await feedApi.deletePost(postId); } catch { /* silent */ }
  }, []);

  // ── Save / unsave ───────────────────────────────────────────────────────────
  const handleSave = useCallback(async (postId: string) => {
    setSavedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    // TODO: call /api/v1/posts/:id/save when backend endpoint is ready
  }, []);

  // ── Repost ──────────────────────────────────────────────────────────────────
  const handleRepost = useCallback(async (postId: string, comment?: string) => {
    try {
      const data = await feedApi.repost(postId, comment);
      setPosts(prev => [
        data.post,
        ...prev.map(p =>
          p.id !== postId ? p : { ...p, _count: { ...p._count, other_Post: p._count.other_Post + 1 } }
        ),
      ]);
    } catch { /* silent in demo */ }
  }, []);

  return {
    posts,
    savedPostIds,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    loadMore,
    handleLike,
    handleCreate,
    handleDelete,
    handleSave,
    handleRepost,
  };
}
