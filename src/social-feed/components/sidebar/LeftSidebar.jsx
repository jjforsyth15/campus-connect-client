// =============================================================================
// components/sidebar/LeftSidebar.jsx
//
// Left sidebar -- sticky panel anchored to the left of the feed.
// Visible on screens >= 900px (BREAKPOINT_MD).
//
// Contains three stacked cards:
//   1. MeCard        -- profile summary with gradient cover banner,
//                       avatar, name, handle, and stat pills (posts/following)
//   2. QuickActions  -- navigation shortcuts with keyboard hint badges
//                       (Create Post, Saved Posts, My Profile, Preferences)
//   3. FollowingList -- compact avatar list of users you follow
//
// All sub-components are file-private; only LeftSidebar is exported.
// =============================================================================

import { Avatar, Card, SectionLabel, StatPill, Divider } from '../ui/primitives';
import { PencilIcon, BookmarkIcon, CogIcon, UserIcon } from '../ui/primitives';
import { displayName } from '../../utils/avatar';

// ---------------------------------------------------------------------------
// MeCard -- profile summary card with gradient cover and stat pills.
// ---------------------------------------------------------------------------──

function MeCard({ user, postCount, followingCount, onViewProfile }) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {/* Cover banner -- CSUN red gradient */}
      <div style={{
        height: 72, flexShrink: 0,
        background: 'linear-gradient(130deg, var(--red) 0%, #FF6B6B 55%, #FFAA8A 100%)',
        position: 'relative',
      }}>
        {/* Subtle pattern overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)',
        }} />
      </div>

      {/* Avatar -- positioned to overlap the banner/body boundary */}
      <div style={{ padding: '12px 16px 16px' }}>
        <div
          onClick={() => onViewProfile(user.id)}
          style={{
            display: 'inline-block', cursor: 'pointer',
            marginTop: -36,        /* pull avatar up to sit on the border */
            marginBottom: 8,
          }}
        >
          <Avatar
            user={user}
            size={52}
            style={{ border: '3px solid var(--bg-card)', borderRadius: '50%' }}
          />
        </div>

        <button
          onClick={() => onViewProfile(user.id)}
          style={{
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem',
            color: 'var(--text1)', background: 'none', border: 'none',
            cursor: 'pointer', padding: 0, display: 'block', textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text1)'}
        >
          {displayName(user)}
        </button>
        <div style={{ fontSize: '0.80rem', color: 'var(--text3)', marginTop: 2 }}>
          @{(user.firstName ?? '').toLowerCase()}{(user.lastName ?? '').toLowerCase()}
        </div>

        <Divider my={12} />

        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <StatPill count={postCount}      label="Posts" />
          <StatPill count={followingCount} label="Following" />
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// QuickActions -- sidebar navigation shortcuts with keyboard hint badges.
// ---------------------------------------------------------------------------──

function QuickActions({ onCompose, onSaved, onProfile, onSettings }) {
  const actions = [
    { icon: <PencilIcon />,   label: 'Create Post', sub: 'Cmd+N', onClick: onCompose  },
    { icon: <BookmarkIcon />, label: 'Saved Posts',  sub: '',      onClick: onSaved    },
    { icon: <UserIcon />,     label: 'My Profile',  sub: '',      onClick: onProfile  },
    { icon: <CogIcon />,      label: 'Preferences', sub: 'Cmd+,', onClick: onSettings },
  ];

  return (
    <Card style={{ padding: '16px' }}>
      <SectionLabel>Quick Actions</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {actions.map(a => <QuickBtn key={a.label} {...a} />)}
      </div>
    </Card>
  );
}

function QuickBtn({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', borderRadius: 'var(--r-md)',
        border: 'none', background: 'transparent',
        color: 'var(--text1)', width: '100%', cursor: 'pointer',
        transition: 'background 0.14s, transform 0.14s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--red)', display: 'flex', transition: 'transform 0.14s' }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</span>
      </div>
      {sub && (
        <span style={{
          fontSize: '0.70rem', color: 'var(--text3)',
          background: 'var(--bg)', padding: '2px 7px',
          borderRadius: 6, border: '1px solid var(--border)',
          fontFamily: 'monospace',
        }}>
          {sub}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// FollowingList -- compact list of users the current user follows.
// Shows up to 6 entries; clicking opens their profile modal.
// ---------------------------------------------------------------------------──

function FollowingList({ followedUsers, onViewProfile }) {
  if (!followedUsers.length) return null;

  return (
    <Card style={{ padding: '16px' }}>
      <SectionLabel>Following</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {followedUsers.slice(0, 6).map(u => (
          <button
            key={u.id}
            onClick={() => onViewProfile(u.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--r-md)', padding: '4px 0',
              textAlign: 'left', width: '100%',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Avatar user={u} size={32} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text1)', lineHeight: 1.2 }}>
                {displayName(u)}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text3)' }}>
                @{u.firstName?.toLowerCase()}{u.lastName?.toLowerCase()}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// LeftSidebar -- composed export that stacks the three cards vertically.
// ---------------------------------------------------------------------------──

export function LeftSidebar({
  currentUser,
  postCount,
  followingCount,
  followedUsers,
  onViewProfile,
  onCompose,
  onSaved,
  onSettings,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <MeCard
        user={currentUser}
        postCount={postCount}
        followingCount={followingCount}
        onViewProfile={onViewProfile}
      />
      <QuickActions
        onCompose={onCompose}
        onSaved={onSaved}
        onProfile={() => onViewProfile(currentUser.id)}
        onSettings={onSettings}
      />
      <FollowingList followedUsers={followedUsers} onViewProfile={onViewProfile} />
    </div>
  );
}
