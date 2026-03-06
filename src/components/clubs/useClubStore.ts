// useClubStore.ts

// BACKEND: Replace with SWR / React Query + Supabase:
//   const { data: clubs, mutate } = useSWR('/api/clubs', fetcher)
//   addClub → optimistic insert + mutate()

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Club, ClubDetail } from './temp(mockdata)/clubs.data';
import { CLUBS } from './temp(mockdata)/clubs.data';
import { MOCK_CLUB_DETAILS } from './temp(mockdata)/mockData';

// ── In-memory singleton (persists across component remounts in the same session)
type StoreState = {
  clubs: Club[];
  details: Record<string, ClubDetail>;
};

let _state: StoreState = {
  clubs: [...CLUBS],
  details: { ...MOCK_CLUB_DETAILS },
};

const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach(fn => fn());
}

// ── Public imperative API (usable outside React) ──────────────────────────────
export function addClubToStore(club: Club, detail: ClubDetail) {
  // Prepend so the new club appears first in the hub grid
  _state = {
    clubs: [club, ..._state.clubs],
    details: { ..._state.details, [club.id]: detail },
  };
  notify();
  // BACKEND: await supabase.from('clubs').insert([clubRow])
}

export function updateClubInStore(id: string, clubPatch: Partial<Club>, detailPatch: Partial<ClubDetail>) {
  _state = {
    clubs: _state.clubs.map(c => c.id === id ? { ...c, ...clubPatch } : c),
    details: {
      ..._state.details,
      [id]: { ..._state.details[id], ...detailPatch } as ClubDetail,
    },
  };
  notify();
}

export function getStoreClubs(): Club[] {
  return _state.clubs;
}

export function getStoreDetail(id: string): ClubDetail | undefined {
  return _state.details[id];
}

// Hook 
export function useClubStore() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender(n => n + 1);
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  }, []);

  const addClub = useCallback((club: Club, detail: ClubDetail) => {
    addClubToStore(club, detail);
  }, []);

  const updateClub = useCallback((id: string, c: Partial<Club>, d: Partial<ClubDetail>) => {
    updateClubInStore(id, c, d);
  }, []);

  return {
    clubs: _state.clubs,
    details: _state.details,
    addClub,
    updateClub,
  };
}

