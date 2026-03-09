// =============================================================================
// utils/avatar.ts
//
// Avatar and display-name helpers.
// Deterministic gradient from user ID — same user always gets same color.
// =============================================================================

import type { PostAuthor, SessionUser } from '../types';

const GRADIENTS: [string, string][] = [
  ['#D22030', '#FF6B6B'],
  ['#7B38ED', '#A78BFA'],
  ['#1D6EE8', '#60A5FA'],
  ['#0A9E6B', '#34D399'],
  ['#EA580C', '#FB923C'],
  ['#0891B2', '#22D3EE'],
  ['#65A30D', '#A3E635'],
  ['#DB2777', '#F472B6'],
  ['#9333EA', '#C084FC'],
  ['#D97706', '#FCD34D'],
];

/**
 * Generates a consistent gradient string from any string seed (usually user ID).
 * Same ID → same gradient every time.
 */
export function gradientFromId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const [a, b] = GRADIENTS[hash % GRADIENTS.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/** Returns initials from first + last name */
export function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

/** Full display name */
export function displayName(user: PostAuthor | SessionUser): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/** Compact number: 1234 → 1.2k */
export function fmtCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

/** Relative time string from ISO date */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)   return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60)   return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7)    return `${d}d`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
