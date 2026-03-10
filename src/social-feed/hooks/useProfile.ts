// =============================================================================
// hooks/useProfile.ts
// Manages the current user's profile for the profile and settings pages.
// Uses mock data — replace the fetch call with real API when ready.
// NOTE: No backend/schema changes made here.
// =============================================================================

import { useState, useCallback } from "react";
import type { UserProfile, ProfileUpdatePayload } from "../types/feed.types";

// Mock profile matching the seed user in SocialFeedPage
const MOCK_PROFILE: UserProfile = {
  id:             "u-sarah",
  firstName:      "Sara",
  lastName:       "Medhat",
  username:       "sarahmedhat",
  email:          "sarah.medhat@my.csun.edu",
  bio:            "Computer Science student at CSUN. Building Campus Connect 🚀",
  major:          "Computer Science",
  year:           "Senior",
  userType:       "STUDENT",
  profilePicture: null,
  location:       "Northridge, CA",
  website:        "",
  joinedAt:       "2023-09-01T00:00:00Z",
  isVerified:     false,
  followerCount:  142,
  followingCount: 89,
};

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile,   setProfile]   = useState<UserProfile | null>(MOCK_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);

  const updateProfile = useCallback(async (payload: ProfileUpdatePayload) => {
    setIsSaving(true);
    try {
      // TODO: call real PATCH /api/v1/users/profile when endpoint is ready
      // const data = await req("/api/v1/users/profile", { method: "PATCH", body: JSON.stringify(payload) });
      // Optimistic local update for now
      await new Promise(r => setTimeout(r, 600)); // simulate network
      setProfile(prev => prev ? { ...prev, ...payload } : prev);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { profile, isLoading, isSaving, updateProfile };
}
