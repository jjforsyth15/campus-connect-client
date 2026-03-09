// =============================================================================
// components/ui/primitives.jsx
//
// Atomic, reusable UI building blocks.
// All other components import from here — never define primitives inline.
//
//  Exports: Avatar, Card, Tag, ActionButton, SectionLabel, Spinner, Divider
//  Icons:   Heart, Comment, Repost, Bookmark, Pin, Bell, Search, Close,
//           Pencil, Cog, Graduation, Image, X, Check, ChevronRight, Send
// =============================================================================

import { useState } from 'react';
import { gradientFromId, initials, fmtCount } from '../../utils/avatar';
import { tagColor } from '../../styles/tokens';

// ─── Avatar ──────────────────────────────────────────────────────────────────

/**
 * Circular avatar.
 * If user has a profilePicture URL, shows it; otherwise renders initials
 * on a deterministic gradient (seed = user.id).
 */
export function Avatar({ user, size = 40, ring = false, style = {} }) {
  const grad  = gradientFromId(user?.id ?? 'default');
  const label = initials(user?.firstName ?? '?', user?.lastName ?? '');
  const [imgErr, setImgErr] = useState(false);
  const showImg = user?.profilePicture && !imgErr;

  return (
    <div
      title={`${user?.firstName} ${user?.lastName}`}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: showImg ? 'transparent' : grad,
        display: 'grid', placeItems: 'center',
        border: ring ? '2.5px solid #fff' : 'none',
        boxShadow: ring ? 'var(--shadow-sm)' : 'none',
        overflow: 'hidden', userSelect: 'none',
        ...style,
      }}
    >
      {showImg ? (
        <img
          src={user.profilePicture}
          alt={label}
          onError={() => setImgErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{
          fontFamily: 'var(--font-head)', fontWeight: 700,
          fontSize: size * 0.36, color: '#fff', lineHeight: 1,
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, style = {}, className = '', onClick }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

/**
 * Pill tag badge.
 * active = filled background; onClick = clickable pill.
 */
export function Tag({ label, active = false, onClick, small = false }) {
  const color = tagColor(label);
  const isAll = label === 'All';

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: small ? '3px 10px' : '6px 14px',
        borderRadius: 'var(--r-full)',
        fontSize: small ? '0.72rem' : '0.80rem',
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        border: `1.5px solid ${active ? color : 'var(--border)'}`,
        background: active ? `${color}15` : 'transparent',
        color: active ? color : 'var(--text2)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s var(--ease)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { if (!active && onClick) e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {!isAll && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: active ? color : 'var(--text3)',
          flexShrink: 0, transition: 'background 0.15s',
        }} />
      )}
      {isAll ? 'All' : label}
    </button>
  );
}

// ─── ActionButton (Like / Comment / Repost / Bookmark) ────────────────────────

export function ActionButton({
  icon, label, active = false, activeColor = 'var(--red)',
  hoverBg = 'var(--bg-hover)', onClick, title,
}) {
  const [hovered, setHovered] = useState(false);
  const color = active ? activeColor : hovered ? activeColor : 'var(--text3)';

  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '7px 10px', borderRadius: 'var(--r-sm)',
        background: active ? `${activeColor}14` : hovered ? hoverBg : 'transparent',
        color,
        border: '1px solid transparent',
        fontWeight: 600, fontSize: '0.82rem',
        transition: 'all 0.15s var(--ease)',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      <span style={{
        display: 'inline-flex',
        transform: active ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s var(--spring)',
      }}>
        {icon}
      </span>
      {label !== undefined && (
        <span style={{ minWidth: 14, textAlign: 'left' }}>
          {typeof label === 'number' ? fmtCount(label) : label}
        </span>
      )}
    </button>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-head)', fontWeight: 700,
      fontSize: '0.72rem', letterSpacing: '0.09em',
      textTransform: 'uppercase', color: 'var(--text3)',
      marginBottom: 12,
    }}>
      {children}
    </p>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function Spinner({ size = 20, color = 'var(--red)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2.5px solid ${color}30`,
      borderTopColor: color,
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ my = 12 }) {
  return <div style={{ height: 1, background: 'var(--border)', margin: `${my}px 0` }} />;
}

// ─── StatPill ─────────────────────────────────────────────────────────────────

export function StatPill({ count, label }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 48 }}>
      <div style={{
        fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text1)',
      }}>
        {fmtCount(count)}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 500, marginTop: 1 }}>
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// ICONS — self-contained inline SVGs, no icon library dependency
// =============================================================================

const SVG = ({ size = 18, children, ...rest }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

export const HeartIcon      = ({ size = 18, filled = false }) => <SVG size={size} fill={filled ? 'currentColor' : 'none'}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></SVG>;
export const CommentIcon    = ({ size = 18 }) => <SVG size={size}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></SVG>;
export const RepostIcon     = ({ size = 18 }) => <SVG size={size}><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></SVG>;
export const BookmarkIcon   = ({ size = 18, filled = false }) => <SVG size={size} fill={filled ? 'currentColor' : 'none'}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></SVG>;
export const BellIcon       = ({ size = 18 }) => <SVG size={size}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></SVG>;
export const SearchIcon     = ({ size = 16 }) => <SVG size={size} strokeWidth={2.5}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></SVG>;
export const CloseIcon      = ({ size = 14 }) => <SVG size={size} strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></SVG>;
export const PencilIcon     = ({ size = 16 }) => <SVG size={size}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></SVG>;
export const CogIcon        = ({ size = 16 }) => <SVG size={size}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></SVG>;
export const GraduationIcon = ({ size = 14 }) => <SVG size={size}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></SVG>;
export const ImageIcon      = ({ size = 18 }) => <SVG size={size}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></SVG>;
export const SendIcon       = ({ size = 16 }) => <SVG size={size}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></SVG>;
export const PinIcon        = ({ size = 14 }) => <SVG size={size} strokeWidth={2.5}><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z" /></SVG>;
export const ChevronRight   = ({ size = 14 }) => <SVG size={size} strokeWidth={2.5}><polyline points="9 18 15 12 9 6" /></SVG>;
export const TrashIcon      = ({ size = 14 }) => <SVG size={size}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></SVG>;
export const ShareIcon      = ({ size = 16 }) => <SVG size={size}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></SVG>;
export const UserIcon       = ({ size = 16 }) => <SVG size={size}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></SVG>;
export const LogoIcon       = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
