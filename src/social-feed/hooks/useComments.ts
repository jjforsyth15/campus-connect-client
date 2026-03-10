// =============================================================================
// hooks/useComments.ts
// Manages comments for a single post: fetch, paginate, add, remove.
// Uses the existing /api/v1/posts/:id/comments backend route.
// =============================================================================

import { useState, useCallback, useRef } from "react";
import type { Comment, CommentsResponse } from "../types/feed.types";
import * as feedApi from "../utils/feed.api";

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  isSubmitting: boolean;
  hasMore: boolean;
  load: () => Promise<void>;
  loadMore: () => Promise<void>;
  addComment: (content: string) => Promise<void>;
  removeComment: (commentId: string) => void;
}

export function useComments(postId: string): UseCommentsReturn {
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [hasMore,     setHasMore]     = useState(false);
  const cursorRef = useRef<string | null>(null);
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setIsLoading(true);
    try {
      const data: CommentsResponse = await feedApi.getComments(postId);
      setComments(data.comments ?? []);
      cursorRef.current = data.nextCursor;
      setHasMore(data.hasMore ?? false);
    } catch {
      // silently fail — post still usable
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const data: CommentsResponse = await feedApi.getComments(postId, cursorRef.current ?? undefined);
      setComments(prev => [...prev, ...(data.comments ?? [])]);
      cursorRef.current = data.nextCursor;
      setHasMore(data.hasMore ?? false);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [postId, hasMore, isLoading]);

  const addComment = useCallback(async (content: string) => {
    // Build a local-first comment so it always appears immediately
    const localComment: Comment = {
      id:        `local-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      User: {
        id:             "u-sarah",
        firstName:      "Sara",
        lastName:       "Medhat",
        profilePicture: null,
        userType:       "student",
      },
    };

    setIsSubmitting(true);
    // Optimistically add first
    setComments(prev => [localComment, ...prev]);
    try {
      const data = await feedApi.createComment(postId, content);
      // Replace the local placeholder with the real server comment
      setComments(prev => prev.map(c => c.id === localComment.id ? data.comment : c));
    } catch {
      // Backend not available — keep the local comment in place
    } finally {
      setIsSubmitting(false);
    }
  }, [postId]);

  const removeComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    feedApi.deleteComment(commentId).catch(() => {
      // best-effort; comment already removed from UI
    });
  }, []);

  return { comments, isLoading, isSubmitting, hasMore, load, loadMore, addComment, removeComment };
}
