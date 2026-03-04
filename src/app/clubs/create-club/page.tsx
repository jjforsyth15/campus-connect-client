'use client';

// app/clubs/create-club/page.tsx
// Route: /clubs/create-club
// Access: Admin / club leaders with `canCreateClub` permission
// BACKEND: Add middleware to protect this route with Supabase auth:
//   import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
//   Redirect to /login if !session or !session.user.app_metadata.canCreateClub

import { useRouter } from 'next/navigation';
import CreateClubPage from '@/components/clubs/CreateClubePage';
import { useClubStore } from '@/components/clubs/useClubStore';
import type { Club, ClubDetail } from '@/components/clubs/data/clubs.data';

export default function CreateClubRoute() {
  const router = useRouter();
  const { addClub } = useClubStore();

  const handleCreated = (club: Club, detail: ClubDetail) => {
    // Optimistically push the new club into the global store so
    // ClubsUI and ClubProfilePage reflect it instantly.
    addClub(club, detail);
    // BACKEND: POST /api/clubs → Supabase insert, then router.push(`/clubs/${club.id}`)
  };

  return (
    <CreateClubPage
      onClubCreated={handleCreated}
      onBack={() => router.push('/clubs')}
    />
  );
}
