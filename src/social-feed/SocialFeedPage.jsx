// =============================================================================
// SocialFeedPage.jsx -- root component of the social feed module
//
// This is the top-level page that orchestrates every piece of the social feed:
//   - TopNav (sticky header with search, notifications, avatar menu)
//   - LeftSidebar (profile card, quick actions, following list)
//   - Main feed (composer, feed controls, post cards with infinite scroll)
//   - RightSidebar (trending topics, follow suggestions, about card)
//   - Modals (comment, repost, profile, saved)
//   - SettingsPanel (drawer overlay for preferences)
//
// Layout uses CSS Grid with responsive breakpoints:
//   < 900px   -- single-column (mobile)
//   900-1279  -- two-column (left sidebar + feed)
//   >= 1280   -- three-column (left + feed + right)
//
// State management:
//   - useFeed hook handles API calls, optimistic updates, infinite scroll
//   - usePreferences hook handles theme, compact mode, etc.
//   - Local state for modals, filters, following set
// =============================================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { injectGlobalStyles, applyTheme } from './utils/injectStyles';
import { TopNav }             from './components/layout/TopNav';
import { LeftSidebar }        from './components/sidebar/LeftSidebar';
import { RightSidebar }       from './components/sidebar/RightSidebar';
import { FeedControls }       from './components/feed/FeedControls';
import { Composer }           from './components/feed/Composer';
import { PostCard }           from './components/feed/PostCard';
import { SettingsPanel }      from './components/settings/SettingsPanel';
import {
  CommentModal, RepostModal,
  ProfileModal, SavedModal,
} from './components/modals/index';
import { useFeed }            from './hooks/useFeed';
import { usePreferences }     from './hooks/usePreferences';
import { Spinner }            from './components/ui/primitives';
import { ALL_TAGS }           from './types/index';

// ---------------------------------------------------------------------------
// Demo session user -- in production this would come from auth context.
// ---------------------------------------------------------------------------
const CURRENT_USER = {
  id:        'user-me',
  firstName: 'Sara',
  lastName:  'Medhat',
  userType:  'student',
  profilePicture: null,
};

// All known users in the demo (seed + current) -- used for profile lookup
const ALL_USERS = [
  CURRENT_USER,
  { id: 'u1', firstName: 'Sara',     lastName: 'Hussein',    userType: 'student', profilePicture: null },
  { id: 'u2', firstName: 'Justin',   lastName: 'Ayson',      userType: 'student', profilePicture: null },
  { id: 'u3', firstName: 'Joseph',   lastName: 'Forsyth',    userType: 'student', profilePicture: null },
  { id: 'u4', firstName: 'Elijah',   lastName: 'Cortez',     userType: 'student', profilePicture: null },
  { id: 'u5', firstName: 'Ivan',     lastName: 'Juarez',     userType: 'student', profilePicture: null },
  { id: 'u6', firstName: 'Vram',     lastName: 'Ghazourian', userType: 'student', profilePicture: null },
  { id: 'u7', firstName: 'Gisselle', lastName: 'Burgos',     userType: 'student', profilePicture: null },
];

const TEAM_USERS = ALL_USERS.filter(u => u.id !== 'user-me');

const BREAKPOINT_MD = 900;
const BREAKPOINT_LG = 1280;

// ---------------------------------------------------------------------------

export default function SocialFeedPage() {
  // -- Bootstrap: inject global CSS custom properties and keyframes on mount
  useEffect(() => { injectGlobalStyles(); }, []);

  // -- Responsive width tracking for breakpoint-based layout switching
  const [winW, setWinW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1400
  );
  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const showLeft  = winW >= BREAKPOINT_MD;
  const showRight = winW >= BREAKPOINT_LG;

  // -- Feed state from the useFeed hook (posts, mutations, pagination)
  const {
    posts, loading, hasMore, error,
    toggleLike, addPost, removePost, incrementComments, incrementReposts, loadMore,
  } = useFeed(CURRENT_USER.id);

  // -- User preferences (theme, compact mode, image visibility, etc.)
  const { prefs, setPrefs, resetPrefs } = usePreferences();

  // Apply theme every time it changes
  useEffect(() => {
    applyTheme(prefs.theme ?? 'system');
  }, [prefs.theme]);

  // -- Feed filter state: tab selection, sort order, tag filter, following set
  const [activeTab,  setActiveTab]  = useState('forYou');
  const [sortBy,     setSortBy]     = useState('top');
  const [filterTag,  setFilterTag]  = useState(null);
  const [following,  setFollowing]  = useState(new Set());
  const [savedPosts, setSavedPosts] = useState([]);

  // -- Modal visibility state -- at most one modal is open at a time
  const [commentPost,   setCommentPost]   = useState(null);
  const [repostPost,    setRepostPost]    = useState(null);
  const [profileUserId, setProfileUserId] = useState(null);
  const [showSaved,     setShowSaved]     = useState(false);
  const [showSettings,  setShowSettings]  = useState(false);
  const [showComposer,  setShowComposer]  = useState(false);

  // -- Derived (filtered + sorted) posts based on current filter state
  const visiblePosts = posts.filter(p => {
    if (filterTag && filterTag !== 'All' && !p.tags?.includes(filterTag)) return false;
    if (activeTab === 'following' && !following.has(p.User?.id)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'top') return (b._count?.Like ?? 0) - (a._count?.Like ?? 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // -- Event handlers for follow, save, repost, delete actions
  const handleFollow = useCallback((userId) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }, []);

  const handleSave = useCallback((post) => {
    setSavedPosts(prev =>
      prev.find(p => p.id === post.id)
        ? prev.filter(p => p.id !== post.id)
        : [post, ...prev]
    );
  }, []);

  const handleRepost = useCallback(async (postId) => {
    incrementReposts(postId);
  }, [incrementReposts]);

  const handleDelete = useCallback((postId) => {
    removePost(postId);
  }, [removePost]);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) loadMore();
    }, { threshold: 0.1 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadMore]);

  // Only keep '/' shortcut (search is handled inside TopNav itself)
  // No other shortcuts to avoid interfering with typing

  // -- Render: three-column responsive grid layout
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text1)',
      fontFamily: 'var(--font-body)',
      transition: 'background 0.2s, color 0.2s',
    }}>
      {/* Top nav */}
      <TopNav
        currentUser={CURRENT_USER}
        unreadCount={3}
        onSettings={() => setShowSettings(true)}
        onViewProfile={() => setProfileUserId(CURRENT_USER.id)}
      />

      {/* Page body */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showRight
          ? '260px 1fr 260px'
          : showLeft
            ? '240px 1fr'
            : '1fr',
        gap: 24,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '24px 16px',
        alignItems: 'start',
      }}>

        {/* Left sidebar */}
        {showLeft && (
          <aside style={{ position: 'sticky', top: 80 }}>
            <LeftSidebar
              currentUser={CURRENT_USER}
              postCount={posts.filter(p => p.User?.id === CURRENT_USER.id).length}
              followingCount={following.size}
              followedUsers={TEAM_USERS.filter(u => following.has(u.id))}
              onViewProfile={() => setProfileUserId(CURRENT_USER.id)}
              onCompose={() => setShowComposer(true)}
              onSaved={() => setShowSaved(true)}
              onSettings={() => setShowSettings(true)}
            />
          </aside>
        )}

        {/* Main feed */}
        <main style={{ minWidth: 0 }}>
          {/* Composer — always visible on desktop, toggled on mobile */}
          {(showLeft || showComposer) && (
            <div style={{ marginBottom: 16 }}>
              <Composer
                currentUser={CURRENT_USER}
                availableTags={ALL_TAGS.filter(t => t !== 'All')}
                onPost={post => { addPost(post); setShowComposer(false); }}
              />
            </div>
          )}

          {/* Mobile compose button */}
          {!showLeft && !showComposer && (
            <button
              onClick={() => setShowComposer(true)}
              style={{
                width: '100%', padding: '12px', marginBottom: 16,
                borderRadius: 'var(--r-lg)', border: '1.5px dashed var(--border)',
                background: 'var(--bg-card)', color: 'var(--text3)',
                fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              + Share something with Matadors…
            </button>
          )}

          {/* Feed controls */}
          <FeedControls
            activeTab={activeTab}  setActiveTab={setActiveTab}
            sortBy={sortBy}        setSortBy={setSortBy}
            filterTag={filterTag}  setFilterTag={setFilterTag}
            tags={ALL_TAGS}
          />

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 'var(--r-md)',
              background: '#FEF2F2', color: '#DC2626',
              border: '1px solid #FECACA', fontSize: '0.875rem', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Posts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: prefs.compact ? 8 : 14 }}>
            {visiblePosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={CURRENT_USER.id}
                showImages={prefs.showImages}
                onLike={() => toggleLike(post.id)}
                onComment={() => setCommentPost(post)}
                onRepost={() => setRepostPost(post)}
                onDelete={() => handleDelete(post.id)}
                onSave={() => handleSave(post)}
                onViewProfile={uid => setProfileUserId(uid)}
                onTagClick={tag => setFilterTag(tag === filterTag ? null : tag)}
              />
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                <Spinner size={28} />
              </div>
            )}

            {!loading && visiblePosts.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '60px 0',
                color: 'var(--text3)', fontSize: '0.9rem',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--red-muted)', display: 'grid', placeItems: 'center',
                  margin: '0 auto 14px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <div style={{ fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-head)' }}>
                  Nothing here yet
                </div>
                <div>Be the first to post, or broaden your filters.</div>
              </div>
            )}

            <div ref={sentinelRef} style={{ height: 1 }} />
          </div>
        </main>

        {/* Right sidebar */}
        {showRight && (
          <aside style={{ position: 'sticky', top: 80 }}>
            <RightSidebar
              tags={ALL_TAGS}
              activeTag={filterTag}
              onTagSelect={tag => setFilterTag(tag === filterTag ? null : tag)}
              suggestions={TEAM_USERS.filter(u => !following.has(u.id))}
              following={following}
              onFollow={handleFollow}
              onViewProfile={uid => setProfileUserId(uid)}
            />
          </aside>
        )}
      </div>

      {/* -- Modal overlays -- at most one is rendered at a time */}

      {commentPost && (
        <CommentModal
          post={commentPost}
          currentUser={CURRENT_USER}
          onClose={() => setCommentPost(null)}
          onCommentPosted={id => incrementComments(id)}
        />
      )}

      {repostPost && (
        <RepostModal
          post={repostPost}
          onClose={() => setRepostPost(null)}
          onRepost={handleRepost}
        />
      )}

      {profileUserId && (
        <ProfileModal
          userId={profileUserId}
          currentUserId={CURRENT_USER.id}
          allUsers={ALL_USERS}
          posts={posts}
          following={following}
          onFollow={handleFollow}
          onClose={() => setProfileUserId(null)}
        />
      )}

      {showSaved && (
        <SavedModal
          savedPosts={savedPosts}
          onClose={() => setShowSaved(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          prefs={prefs}
          setPrefs={p => p === null ? resetPrefs() : setPrefs(p)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
