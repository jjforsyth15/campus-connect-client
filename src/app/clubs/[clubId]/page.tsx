// src/app/clubs/[clubId]/page.tsx
'use client';
import ClubPage from '@/components/clubs/ClubProfilePage';

export default function Page() {
  // BACKEND: pass params.clubId to ClubPage to fetch real data
  // e.g. const { clubId } = params; then fetch /api/clubs/:clubId
  return <ClubPage />;
}
