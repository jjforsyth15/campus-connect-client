// =============================================================================
// hooks/useProfile.ts
// Manages the current user's profile for the profile and settings pages.
// Uses mock data — replace the fetch call with real API when ready.
// NOTE: No backend/schema changes made here.
// =============================================================================

import { useState, useCallback, useEffect } from "react";
import type { UserProfile, ProfileUpdatePayload } from "../types/feed.types";

// Default fallback profile — used only when localStorage has no user data.
const DEFAULT_PROFILE: UserProfile = {
  id:             "u-guest",
  firstName:      "Matador",
  lastName:       "Student",
  username:       "matador",
  email:          "",
  bio:            "Computer Science student at CSUN.",
  major:          "Computer Science",
  year:           "Senior",
  userType:       "STUDENT",
  profilePicture: null,
  location:       "Northridge, CA",
  website:        "",
  joinedAt:       "2023-09-01T00:00:00Z",
  isVerified:     false,
  followerCount:  0,
  followingCount: 0,
};

/** Build a UserProfile from the raw localStorage "user" object. */
function profileFromStorage(raw: Record<string, unknown>): UserProfile {
  const firstName = (raw.firstName as string) || (raw.name as string)?.split(" ")[0] || DEFAULT_PROFILE.firstName;
  const lastName  = (raw.lastName  as string) || (raw.name as string)?.split(" ").slice(1).join(" ") || DEFAULT_PROFILE.lastName;
  return {
    ...DEFAULT_PROFILE,
    id:             (raw.id as string)             || DEFAULT_PROFILE.id,
    firstName,
    lastName,
    username:       (raw.username as string)       || `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    email:          (raw.email as string)          || DEFAULT_PROFILE.email,
    major:          (raw.major as string)          || DEFAULT_PROFILE.major,
    userType:       (raw.userType as string)       || DEFAULT_PROFILE.userType,
    profilePicture: (raw.profilePicture as string) || null,
    bio:            (raw.bio as string)            || DEFAULT_PROFILE.bio,
    followerCount:  Number(raw.followerCount)      || DEFAULT_PROFILE.followerCount,
    followingCount: Number(raw.followingCount)     || DEFAULT_PROFILE.followingCount,
    joinedAt:       (raw.joinedAt as string)       || (raw.createdAt as string) || DEFAULT_PROFILE.joinedAt,
    isVerified:     Boolean(raw.isVerified),
  };
}

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile,   setProfile]   = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);

  // Load from localStorage on mount — this way every user sees their own profile.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        setProfile(profileFromStorage(parsed));
      } else {
        setProfile(DEFAULT_PROFILE);
      }
    } catch {
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: ProfileUpdatePayload) => {
    setIsSaving(true);
    try {
      // TODO: call real PATCH /api/v1/users/profile when endpoint is ready
      await new Promise(r => setTimeout(r, 600)); // simulate network
      setProfile(prev => {
        if (!prev) return prev;
        const updated = { ...prev, ...payload };
        // Persist the updated name/fields back to localStorage
        try {
          const raw = localStorage.getItem("user");
          const stored = raw ? JSON.parse(raw) : {};
          localStorage.setItem("user", JSON.stringify({ ...stored, ...payload }));
        } catch { /* ignore */ }
        return updated;
      });
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { profile, isLoading, isSaving, updateProfile };
}
