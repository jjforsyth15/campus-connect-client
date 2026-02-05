'use client';

import React, { useEffect, useMemo, useState } from 'react';

/* -------------------------------------------------------
   Types
--------------------------------------------------------*/
type Tab = 'forYou' | 'following' | 'trending';
type Sort = 'top' | 'latest';

type Post = {
  id: string;
  author: string;
  handle: string;
  initials: string;
  content: string;
  tags: string[];
  images?: string[];          // optional images per post
  likes: number;
  comments: number;
  reposts: number;
  timeAgo: string;
};

type User = {
  handle: string;
  name: string;
  initials: string;
};

const CSUN_RED = '#D22030';

/* -------------------------------------------------------
   Demo users (your team)
--------------------------------------------------------*/
const TEAM: User[] = [
  { handle: 'gisselle', name: 'Gisselle Burgos',   initials: 'GB' },
  { handle: 'ivan',     name: 'Ivan Juarez',       initials: 'IJ' },
  { handle: 'vram',     name: 'Vram Ghazourian',   initials: 'VG' },
  { handle: 'sara',     name: 'Sara Hussein',      initials: 'SH' },
  { handle: 'elijah',   name: 'Elijah Cortez',     initials: 'EC' },
  { handle: 'justin',   name: 'Justin Ayson',      initials: 'JA' },
  { handle: 'joseph',   name: 'Joseph Forsyth',    initials: 'JF' },
];

// Logged-in user (for the demo)
const ME = TEAM.find(u => u.handle === 'sara')!;

/* -------------------------------------------------------
   Starter posts w/ images that match the content
--------------------------------------------------------*/
const START_POSTS: Post[] = [
  {
    id: 'p1',
    author: 'Sara Hussein',
    handle: 'sara',
    initials: 'SH',
    content: 'AI Resume Generator is live! It tailors resumes per job description — perfect for internship season.',
    tags: ['AI', 'Career', 'Ideas'],
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=60&auto=format&fit=crop'
    ],
    likes: 52, comments: 15, reposts: 11, timeAgo: '15m'
  },
  {
    id: 'p2',
    author: 'Justin Ayson',
    handle: 'justin',
    initials: 'JA',
    content: 'AI Closet: outfit suggestions from weather + schedule. ',
    tags: ['AI', 'Ideas', 'Campus'],
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=60&auto=format&fit=crop'
    ],
    likes: 44, comments: 8, reposts: 7, timeAgo: '30m'
  },
  {
    id: 'p3',
    author: 'Joseph Forsyth',
    handle: 'joseph',
    initials: 'JF',
    content: 'Marketplace card layout A vs B — vote! Aims for faster browse-to-contact. ',
    tags: ['Design', 'Marketplace'],
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=60&auto=format&fit=crop'
    ],
    likes: 29, comments: 12, reposts: 3, timeAgo: '25m'
  },
  {
    id: 'p4',
    author: 'Elijah Cortez',
    handle: 'elijah',
    initials: 'EC',
    content: 'SRC schedules + animations running at 60fps. Added micro-interactions on the dashboard. ',
    tags: ['SRC', 'Campus', 'Design'],
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=60&auto=format&fit=crop'
    ],
    likes: 24, comments: 5, reposts: 3, timeAgo: '50m'
  },
  {
    id: 'p5',
    author: 'Ivan Juarez',
    handle: 'ivan',
    initials: 'IJ',
    content: 'AR campus map: scan building markers for directions + room info. ',
    tags: ['AR', 'Dev', 'Campus'],
    images: [
      'https://images.unsplash.com/photo-1529336953121-ad3ffefc7748?w=1200&q=60&auto=format&fit=crop'
    ],
    likes: 31, comments: 9, reposts: 5, timeAgo: '1h'
  },
  {
    id: 'p6',
    author: 'Vram Ghazourian',
    handle: 'vram',
    initials: 'VG',
    content: 'Auth flow refactor: clearer error states + faster redirect after OTP. ',
    tags: ['Dev'],
    likes: 16, comments: 2, reposts: 1, timeAgo: '45m'
  },
  {
    id: 'p7',
    author: 'Gisselle Burgos',
    handle: 'gisselle',
    initials: 'GB',
    content: 'Waste Scanner: AI recognition sorts recyclables vs trash. CSUN gets greener',
    tags: ['AI', 'Campus'],
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=60&auto=format&fit=crop'
    ],
    likes: 38, comments: 7, reposts: 6, timeAgo: '2h'
  },
];

/* -------------------------------------------------------
   Helpers
--------------------------------------------------------*/
const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: '0.5rem 1rem',
  borderRadius: 9999,
  border: `1px solid ${active ? CSUN_RED : '#e5e7eb'}`,
  background: active ? CSUN_RED : '#fff',
  color: active ? '#fff' : '#374151',
  fontWeight: 700,
  cursor: 'pointer',
});

function avatarBg(initials: string) {
  const seed = initials.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = seed % 360;
  return `linear-gradient(135deg, hsl(${hue} 80% 64%), hsl(${(hue + 40) % 360} 80% 55%))`;
}

/* -------------------------------------------------------
   Small shared UI pieces (MOVED OUTSIDE to preserve identity)
--------------------------------------------------------*/
const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { dense?: boolean }> = ({ children, style, dense, ...rest }) => (
  <div
    {...rest}
    style={{
      background: '#fff',
      borderRadius: 16,
      padding: dense ? '0.9rem' : '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,.08)',
      ...style
    }}
  >
    {children}
  </div>
);

const ActionBtn: React.FC<{
  label?: string;
  active?: boolean;
  hoverBg: string;
  hoverColor: string;
  onClick: () => void;
  icon: (color: string, active?: boolean) => React.ReactNode;
}> = ({ label, active, hoverBg, hoverColor, onClick, icon }) => {
  const [h, setH] = useState(false);
  const color = active ? CSUN_RED : h ? hoverColor : '#6b7280';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '.6rem .65rem',
        borderRadius: 10, border: '1px solid #eef0f2',
        background: h ? hoverBg : '#fff',
        cursor: 'pointer', fontWeight: 700, color
      }}
    >
      {icon(color, active)}
      {label && <span>{label}</span>}
    </button>
  );
};

/* -------------------------------------------------------
   Page
--------------------------------------------------------*/
const SocialPage: React.FC = () => {
  // Feed + UI State
  const [posts, setPosts] = useState<Post[]>(START_POSTS);
  const [activeTab, setActiveTab] = useState<Tab>('forYou');
  const [sortBy, setSortBy] = useState<Sort>('top');
  const [filterTag, setFilterTag] = useState('All');

  // Interactions
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [following, setFollowing] = useState<Set<string>>(new Set(['sara', 'ivan']));

  // Composer
  const [content, setContent] = useState('');
  const [composerTags, setComposerTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [commentFor, setCommentFor] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Preferences
  const [dense, setDense] = useState(false);
  const [showImages, setShowImages] = useState(true);

  // persist prefs
  useEffect(() => {
    const p = localStorage.getItem('mc_prefs');
    if (p) {
      const { dense, showImages } = JSON.parse(p);
      setDense(!!dense);
      setShowImages(showImages !== false);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('mc_prefs', JSON.stringify({ dense, showImages }));
  }, [dense, showImages]);

  /* ---------- Derived ---------- */
  const availableTags = useMemo(() => {
    const s = new Set<string>(['AI','AR','Dev','Design','SRC','Campus','Marketplace','Ideas','Career','Events','Clubs']);
    posts.forEach(p => p.tags.forEach(t => s.add(t)));
    return ['All', ...[...s].sort()];
  }, [posts]);

  const followingUsers = TEAM.filter(u => following.has(u.handle));

  const list = useMemo(() => {
    let l = posts;
    if (filterTag !== 'All') l = l.filter(p => p.tags.includes(filterTag));
    if (activeTab === 'following') l = l.filter(p => following.has(p.handle));
    if (activeTab === 'trending') {
      l = [...l].sort((a,b) =>
        (b.likes + b.reposts + b.comments) - (a.likes + a.reposts + a.comments)
      );
    } else if (sortBy === 'top') {
      l = [...l].sort((a,b) => b.likes - a.likes);
    }
    return l;
  }, [posts, filterTag, activeTab, sortBy, following]);

  /* ---------- Handlers ---------- */
  function toggleLike(id: string) {
    setLiked(prev => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
        setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: Math.max(0, p.likes - 1) } : p));
      } else {
        n.add(id);
        setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      }
      return n;
    });
  }
  function toggleSave(id: string) {
    setSaved(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function handleRepost(id: string) {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, reposts: p.reposts + 1 } : p));
    alert('Reposted ');
  }
  function submitComment() {
    if (!commentFor || !commentText.trim()) return;
    setPosts(ps => ps.map(p => p.id === commentFor ? { ...p, comments: p.comments + 1 } : p));
    setCommentText('');
    setCommentFor(null);
  }
  function toggleFollow(handle: string) {
    setFollowing(prev => {
      const n = new Set(prev);
      n.has(handle) ? n.delete(handle) : n.add(handle);
      return n;
    });
  }
  function toggleComposerTag(tag: string) {
    setComposerTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }
  function createPost() {
    if (!content.trim()) return;
    const newPost: Post = {
      id: 'p' + (Date.now() % 100000),
      author: ME.name,
      handle: ME.handle,
      initials: ME.initials,
      content: content.trim(),
      tags: composerTags.length ? composerTags : ['Campus'],
      images: imageUrl.trim() ? [imageUrl.trim()] : undefined,
      likes: 0, comments: 0, reposts: 0, timeAgo: 'now'
    };
    setPosts(p => [newPost, ...p]);
    setContent(''); setComposerTags([]); setImageUrl('');
    setActiveTab('forYou'); setFilterTag('All');
  }

  /* -------------------------------------------------------
     UI
  --------------------------------------------------------*/
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(#ffffff, #f6f7f9)' }}>
      {/* Header */}
      <header style={{ background: CSUN_RED, color: '#fff', padding: '2rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0 }}>Matador Connect</h1>
          <p style={{ marginTop: '.25rem', opacity: .95 }}>Share ideas, collaborate, and connect with fellow Matadors </p>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '1.25rem' }}>
          {/* LEFT: Quick Actions + Following */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card dense={dense}>
              <h3 style={{ marginTop: 0, marginBottom: '.75rem' }}>Quick Actions</h3>
              {[
                { label: 'Create Post', onClick: () => document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) },
                { label: 'View Saved', onClick: () => setShowSaved(true) },
                { label: 'My Profile', onClick: () => setShowProfile(true) },
                { label: 'Settings', onClick: () => setShowSettings(true) },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  style={{
                    width: '100%', background: '#f3f4f6', border: 'none',
                    borderRadius: 10, padding: '.75rem', textAlign: 'left',
                    fontWeight: 600, cursor: 'pointer', marginBottom: '.5rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                >
                  {btn.label}
                </button>
              ))}
            </Card>

            <Card dense={dense}>
              <h3 style={{ marginTop: 0, marginBottom: '.75rem' }}>You’re Following</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {followingUsers.length === 0 && <span style={{ color: '#6b7280' }}>No one yet — explore the feed!</span>}
                {followingUsers.map(u => (
                  <span key={u.handle} title={u.name}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                      padding: '.35rem .6rem', borderRadius: 9999, background: '#f8fafc',
                      border: '1px solid #e5e7eb', fontWeight: 600
                    }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: avatarBg(u.initials), color: '#fff', display: 'grid', placeItems: 'center',
                      fontSize: 12, fontWeight: 800
                    }}>{u.initials}</span>
                    @{u.handle}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* CENTER: Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Tabs + Sort */}
            <Card dense={dense}>
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.75rem' }}>
                {(['forYou','following','trending'] as const).map(t => (
                  <button key={t} style={chipStyle(activeTab === t)} onClick={() => setActiveTab(t)}>
                    {t === 'forYou' ? 'For You' : t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '.9rem', color: '#6b7280', fontWeight: 600 }}>Sort:</span>
                {(['top','latest'] as const).map(s => (
                  <button key={s}
                    style={{
                      padding: '.4rem .8rem', borderRadius: 8, border: '1px solid #e5e7eb',
                      background: sortBy === s ? '#f3f4f6' : '#fff', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
                    }}
                    onClick={() => setSortBy(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>

            {/* Composer */}
            <Card id="composer" dense={dense}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: avatarBg(ME.initials), color: '#fff',
                  display: 'grid', placeItems: 'center', fontWeight: 800
                }}>{ME.initials}</div>

                <div style={{ flex: 1 }}>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="What’s happening at CSUN?"
                    maxLength={500}
                    style={{
                      width: '100%', border: 'none', outline: 'none', resize: 'none',
                      fontSize: '1.05rem', minHeight: dense ? 60 : 90, fontFamily: 'inherit'
                    }}
                  />
                  <input
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="Optional image URL (https://...)"
                    style={{
                      width: '100%', marginTop: '.5rem', padding: '.6rem .75rem',
                      borderRadius: 10, border: '1px solid #e5e7eb', fontFamily: 'inherit'
                    }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.75rem' }}>
                    {availableTags.slice(1).map(t => (
                      <button key={t} onClick={() => toggleComposerTag(t)} style={chipStyle(composerTags.includes(t))}>#{t}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: '.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '.9rem', color: '#6b7280' }}>{content.length}/500</span>
                    <button
                      onClick={createPost}
                      disabled={!content.trim()}
                      style={{
                        padding: '.7rem 1.2rem', borderRadius: 10, border: 'none',
                        background: content.trim() ? CSUN_RED : '#e5e7eb',
                        color: '#fff', fontWeight: 800, cursor: content.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tag filter */}
            <div style={{ display: 'flex', gap: '.5rem', overflowX: 'auto', paddingBottom: '.25rem' }}>
              {availableTags.map(tag => (
                <button key={tag} onClick={() => setFilterTag(tag)} style={chipStyle(filterTag === tag)}>
                  {tag === 'All' ? tag : '#' + tag}
                </button>
              ))}
            </div>

            {/* Feed */}
            {list.map(post => (
              <Card key={post.id} dense={dense} style={{ padding: dense ? '.9rem' : '1rem' }}>
                {/* header */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: avatarBg(post.initials),
                    color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, flexShrink: 0
                  }}>
                    {post.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{post.author}</strong>
                        <span style={{ color: '#6b7280', marginLeft: 8 }}>@{post.handle}</span>
                        <span style={{ color: '#6b7280', marginLeft: 8 }}>· {post.timeAgo}</span>
                      </div>
                      <details>
                        <summary style={{ listStyle: 'none', cursor: 'pointer' }}>
                          <svg width="20" height="20" fill="#6b7280"><circle cx="10" cy="5" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="15" r="1.5" /></svg>
                        </summary>
                        <div style={{
                          position: 'absolute', right: 8, background: '#fff', border: '1px solid #e5e7eb',
                          borderRadius: 10, boxShadow: '0 6px 16px rgba(0,0,0,.12)', padding: '.25rem', zIndex: 10
                        }}>
                          <button onClick={() => toggleSave(post.id)} style={menuBtn}>
                            {saved.has(post.id) ? 'Unsave' : 'Save'}
                          </button>
                          <button onClick={() => navigator.clipboard.writeText(location.origin + '/social#' + post.id)} style={menuBtn}>
                            Copy link
                          </button>
                          <button onClick={() => alert('Muted @' + post.handle)} style={menuBtn}>
                            Mute @{post.handle}
                          </button>
                        </div>
                      </details>
                    </div>

                    {/* tags */}
                    <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {post.tags.map(t => (
                        <button key={t} onClick={() => setFilterTag(t)} style={{ ...chipStyle(filterTag === t), padding: '.25rem .65rem' }}>
                          #{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* content */}
                <p style={{ marginTop: 12, lineHeight: 1.6 }}>{post.content}</p>

                {/* image */}
                {showImages && post.images && post.images.length > 0 && (
                  <div style={{ marginTop: 10, overflow: 'hidden', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                    <img
                      src={post.images[0]}
                      alt="post media"
                      style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 420, objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* actions (responsive, never cropped) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gap: 8,
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px solid #eef0f2'
                  }}
                >
                  <ActionBtn
                    label={String(post.comments)}
                    onClick={() => setCommentFor(post.id)}
                    icon={(c) => (
                      <svg width="18" height="18" fill="none" stroke={c} strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    )}
                    hoverBg="#eff6ff"
                    hoverColor="#2563eb"
                  />
                  <ActionBtn
                    label={String(post.reposts)}
                    onClick={() => handleRepost(post.id)}
                    icon={(c) => (
                      <svg width="18" height="18" fill="none" stroke={c} strokeWidth="2">
                        <polyline points="17 1 21 5 17 9" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <polyline points="7 23 3 19 7 15" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                      </svg>
                    )}
                    hoverBg="#ecfdf5"
                    hoverColor="#059669"
                  />
                  <ActionBtn
                    label={String(post.likes)}
                    active={liked.has(post.id)}
                    onClick={() => toggleLike(post.id)}
                    icon={(c, a) => (
                      <svg width="18" height="18" fill={a ? c : 'none'} stroke={c} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    )}
                    hoverBg="#fef2f2"
                    hoverColor={CSUN_RED}
                  />
                  <ActionBtn
                    label={saved.has(post.id) ? 'Saved' : 'Share'}
                    onClick={() => toggleSave(post.id)}
                    icon={(c) => (
                      <svg width="18" height="18" fill="none" stroke={c} strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    )}
                    hoverBg="#f3f4f6"
                    hoverColor="#374151"
                  />
                </div>

                {/* follow/unfollow */}
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => toggleFollow(post.handle)}
                    style={{
                      padding: '.45rem .8rem', borderRadius: 10, border: '1px solid #e5e7eb',
                      background: following.has(post.handle) ? '#f8fafc' : '#fff',
                      fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {following.has(post.handle) ? 'Following' : 'Follow'}
                  </button>
                </div>
              </Card>
            ))}

          </div>

          {/* RIGHT: Explore + About */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card dense={dense}>
              <h3 style={{ marginTop: 0, marginBottom: '.75rem' }}>Explore Hashtags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {availableTags.slice(1, 10).map(tag => (
                  <button key={tag} onClick={() => { setFilterTag(tag); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={chipStyle(filterTag === tag)}>
                    #{tag}
                  </button>
                ))}
              </div>
            </Card>

            <Card dense={dense}>
              <h3 style={{ marginTop: 0, marginBottom: '.75rem' }}>About Matador Connect</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                A campus hub for ideas, projects, and updates—built by CSUN students, for CSUN students.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <Modal onClose={() => setShowSettings(false)} title="Settings">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <ToggleRow
              label="Compact density"
              checked={dense}
              onChange={setDense}
              hint="Reduce paddings and composer height"
            />
            <ToggleRow
              label="Show images"
              checked={showImages}
              onChange={setShowImages}
              hint="Hide media for data-saving"
            />
          </div>
        </Modal>
      )}

      {/* SAVED MODAL */}
      {showSaved && (
        <Modal onClose={() => setShowSaved(false)} title="Saved Posts">
          {posts.filter(p => saved.has(p.id)).length === 0 ? (
            <p style={{ color: '#6b7280' }}>No saved posts yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              {posts.filter(p => saved.has(p.id)).map(p => (
                <li key={p.id} style={{ marginBottom: '.5rem' }}>
                  <strong>{p.author}</strong> — <span style={{ color: '#6b7280' }}>{p.content.slice(0, 80)}…</span>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}

      {/* PROFILE MODAL */}
      {showProfile && (
        <Modal onClose={() => setShowProfile(false)} title={`${ME.name} (@${ME.handle})`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: avatarBg(ME.initials),
              color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900
            }}>{ME.initials}</div>
            <div>
              <div style={{ fontWeight: 800 }}>{ME.name}</div>
              <div style={{ color: '#6b7280' }}>@{ME.handle}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div><strong>{following.size}</strong> following</div>
            <div><strong>{posts.filter(p => p.handle === ME.handle).length}</strong> posts</div>
          </div>
        </Modal>
      )}

      {/* COMMENTS MODAL */}
      {commentFor && (
        <Modal onClose={() => setCommentFor(null)} title="Comments">
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Write a comment…"
            style={{
              width: '100%', minHeight: 90, borderRadius: 12, border: '1px solid #e5e7eb',
              padding: '.75rem', fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end', marginTop: '.75rem' }}>
            <button onClick={() => setCommentFor(null)} style={ghostBtn}>Cancel</button>
            <button onClick={submitComment} style={solidBtn}>Post Comment</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* -------------------------------------------------------
   Small shared UI pieces
--------------------------------------------------------*/
const menuBtn: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '.55rem .75rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600
};

const ghostBtn: React.CSSProperties = {
  padding: '.6rem 1.1rem',
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontWeight: 800,
  cursor: 'pointer'
};
const solidBtn: React.CSSProperties = {
  padding: '.6rem 1.1rem',
  borderRadius: 10,
  border: 'none',
  background: CSUN_RED,
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer'
};

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center', zIndex: 50
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{
      width: 'min(560px, 92vw)', background: '#fff', borderRadius: 16,
      boxShadow: '0 12px 30px rgba(0,0,0,.25)', padding: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8
        }}>
          <svg width="18" height="18" stroke="#374151" fill="none" strokeWidth="2">
            <line x1="4" y1="4" x2="14" y2="14" />
            <line x1="14" y1="4" x2="4" y2="14" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ToggleRow: React.FC<{
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, hint, checked, onChange }) => (
  <label style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '1rem', padding: '.6rem .75rem', border: '1px solid #e5e7eb', borderRadius: 12
  }}>
    <div>
      <div style={{ fontWeight: 800 }}>{label}</div>
      {hint && <div style={{ color: '#6b7280', fontSize: '.9rem' }}>{hint}</div>}
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ width: 20, height: 20, cursor: 'pointer' }}
    />
  </label>
);

export default SocialPage;
