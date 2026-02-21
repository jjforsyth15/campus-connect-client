'use client';

import React, { useState } from 'react';
import ClubEditPage from '@/components/clubs/ClubEditPage';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type ClubMember = {
  id: string;
  name: string;
  avatar?: string;
  role: 'President' | 'VP' | 'Officer' | 'Member';
  joinedAt: string;
  major?: string;
  blocked?: boolean;
};

export type ClubPost = {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  images?: string[];
  createdAt: string;
  likes: number;
  liked: boolean;
  comments: { id: string; author: string; text: string }[];
};

export type ClubEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  cover?: string;
  rsvpCount: number;
  rsvped: boolean;
};

export type Club = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  introMessage: string;
  logoUrl?: string;
  bannerUrl?: string;
  accentColor: string;
  discordUrl?: string;
  memberCount: number;
  category: string;
  founded: string;
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// BACKEND: Replace with GET /api/clubs/:clubId

export const MOCK_CLUB: Club = {
  id: 'club-001',
  name: 'Robotics & AI Society',
  tagline: 'Building the future, one bot at a time.',
  description:
    'We are a community of passionate engineers, designers, and visionaries dedicated to exploring the frontiers of robotics and artificial intelligence. From weekly workshops to national competitions, we push the limits of what machines can do.',
  introMessage:
    "👋 Welcome to the Robotics & AI Society!\n\nWe meet every Thursday at 6 PM in the Engineering Building, Room 204. Whether you're a seasoned coder or just curious about robots — you belong here.\n\nJoin our Discord to stay in the loop and never miss an event!",
  logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
  bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=320&fit=crop',
  accentColor: '#D22030',
  discordUrl: 'https://discord.gg/example',
  memberCount: 84,
  category: 'STEM',
  founded: '2019',
};

export const MOCK_MEMBERS: ClubMember[] = [
  { id: 'm1', name: 'Alex Rivera', role: 'President', joinedAt: '2022-09-01', major: 'Computer Science', avatar: 'https://i.pravatar.cc/60?img=1' },
  { id: 'm2', name: 'Jordan Lee', role: 'VP', joinedAt: '2022-09-10', major: 'Electrical Engineering', avatar: 'https://i.pravatar.cc/60?img=2' },
  { id: 'm3', name: 'Sam Chen', role: 'Officer', joinedAt: '2023-01-15', major: 'Mechanical Engineering', avatar: 'https://i.pravatar.cc/60?img=3' },
  { id: 'm4', name: 'Taylor Nguyen', role: 'Officer', joinedAt: '2023-02-20', major: 'Math', avatar: 'https://i.pravatar.cc/60?img=4' },
  { id: 'm5', name: 'Morgan Kim', role: 'Member', joinedAt: '2023-08-30', major: 'Physics', avatar: 'https://i.pravatar.cc/60?img=5' },
  { id: 'm6', name: 'Casey Park', role: 'Member', joinedAt: '2023-09-05', major: 'CS', avatar: 'https://i.pravatar.cc/60?img=6' },
  { id: 'm7', name: 'Drew Santos', role: 'Member', joinedAt: '2024-01-10', major: 'Engineering', avatar: 'https://i.pravatar.cc/60?img=7' },
  { id: 'm8', name: 'Riley Okonkwo', role: 'Member', joinedAt: '2024-02-14', major: 'AI Studies', avatar: 'https://i.pravatar.cc/60?img=8' },
];

const MOCK_POSTS: ClubPost[] = [
  {
    id: 'p1',
    author: 'Alex Rivera',
    authorAvatar: 'https://i.pravatar.cc/40?img=1',
    content: "🚀 Our autonomous drone project just won first place at the regional competition! Huge shoutout to the whole team for the 3 AM debugging sessions. This one's for us! 🏆",
    createdAt: '2025-02-18T14:00:00Z',
    likes: 42,
    liked: false,
    comments: [{ id: 'c1', author: 'Jordan Lee', text: 'We earned this!! 🤖' }],
  },
  {
    id: 'p2',
    author: 'Sam Chen',
    authorAvatar: 'https://i.pravatar.cc/40?img=3',
    content: "Reminder: Workshop on ROS2 this Thursday! Bring your laptops. We'll be building a basic navigation stack from scratch. Beginners welcome 🙌",
    createdAt: '2025-02-15T09:30:00Z',
    likes: 18,
    liked: true,
    comments: [],
  },
];

const MOCK_EVENTS: ClubEvent[] = [
  {
    id: 'e1',
    title: 'Intro to ROS2 Workshop',
    description: 'A hands-on workshop covering the basics of Robot Operating System 2. Perfect for beginners and intermediate members.',
    date: '2025-02-27',
    time: '6:00 PM',
    location: 'Engineering Building, Room 204',
    rsvpCount: 31,
    rsvped: false,
  },
  {
    id: 'e2',
    title: 'Spring Robotics Showcase',
    description: 'Show off your semester projects! Open to the public. Bring friends and family.',
    date: '2025-04-12',
    time: '2:00 PM',
    location: 'Main Quad',
    rsvpCount: 67,
    rsvped: true,
  },
  {
    id: 'e3',
    title: 'AI Ethics Panel Discussion',
    description: 'Faculty and industry guests discuss the ethical implications of modern AI systems.',
    date: '2025-03-08',
    time: '5:30 PM',
    location: 'Science Hall Auditorium',
    rsvpCount: 45,
    rsvped: false,
  },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const roleColor = (role: ClubMember['role']) => {
  switch (role) {
    case 'President': return '#FFD700';
    case 'VP': return '#C0C0C0';
    case 'Officer': return '#D22030';
    default: return '#6b7280';
  }
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const FeedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const EventIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ApplyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);
const MembersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#D22030' : 'none'} stroke={filled ? '#D22030' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, maxWidth: 520, width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {title && <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>{title}</span>}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', marginLeft: 'auto' }}><CloseIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── INTRO MODAL ─────────────────────────────────────────────────────────────
function IntroModal({ club, open, onClose }: { club: Club; open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: `3px solid ${club.accentColor}`, background: '#222' }}>
          {club.logoUrl && <img src={club.logoUrl} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <h2 style={{ color: '#fff', fontFamily: "'Georgia', serif", fontSize: 22, marginBottom: 6 }}>{club.name}</h2>
        <span style={{ background: club.accentColor, color: '#fff', borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 600 }}>{club.category}</span>
        <p style={{ color: '#ccc', marginTop: 18, lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: 14 }}>{club.introMessage}</p>
        {club.discordUrl && (
          <a href={club.discordUrl} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, background: '#5865F2', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            <DiscordIcon /> Join our Discord
          </a>
        )}
        <div style={{ marginTop: 20 }}>
          <button onClick={onClose}
            style={{ background: club.accentColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            Let's Go →
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── MEMBERS MODAL ────────────────────────────────────────────────────────────
function MembersModal({ open, onClose, members }: { open: boolean; onClose: () => void; members: ClubMember[] }) {
  const [search, setSearch] = useState('');
  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <Modal open={open} onClose={onClose} title={`Members (${members.length})`}>
      <input
        placeholder="Search members..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', background: '#2a2a2a', border: '1px solid #444', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#252525', borderRadius: 10, border: '1px solid #333' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: '#333', flexShrink: 0 }}>
              {m.avatar
                ? <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{m.name[0]}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{m.name}</div>
              <div style={{ color: '#888', fontSize: 12 }}>{m.major} · Joined {formatDate(m.joinedAt)}</div>
            </div>
            <span style={{ background: roleColor(m.role) + '22', color: roleColor(m.role), border: `1px solid ${roleColor(m.role)}55`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── SOCIAL FEED TAB ──────────────────────────────────────────────────────────
function SocialFeed({ posts, accentColor }: { posts: ClubPost[]; accentColor: string }) {
  const [localPosts, setLocalPosts] = useState(posts);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    // BACKEND: POST /api/clubs/:clubId/posts/:postId/like
    setLocalPosts(p => p.map(post => post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post));
  };

  const submitComment = (id: string) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;
    // BACKEND: POST /api/clubs/:clubId/posts/:postId/comments — body: { text }
    setLocalPosts(p => p.map(post => post.id === id ? { ...post, comments: [...post.comments, { id: Date.now().toString(), author: 'You', text }] } : post));
    setCommentInputs(c => ({ ...c, [id]: '' }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {localPosts.map(post => (
        <div key={post.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
              {post.authorAvatar && <img src={post.authorAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{post.author}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{timeAgo(post.createdAt)}</div>
            </div>
          </div>
          <p style={{ color: '#ddd', lineHeight: 1.65, fontSize: 14, margin: '0 0 14px' }}>{post.content}</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button onClick={() => toggleLike(post.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: post.liked ? accentColor : '#888', fontSize: 13 }}>
              <HeartIcon filled={post.liked} /> {post.likes}
            </button>
            <button
              onClick={() => setExpandedComments(s => { const n = new Set(s); n.has(post.id) ? n.delete(post.id) : n.add(post.id); return n; })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13 }}>
              💬 {post.comments.length} comments
            </button>
          </div>
          {expandedComments.has(post.id) && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {post.comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: '#aaa', fontWeight: 600, fontSize: 13 }}>{c.author}:</span>
                  <span style={{ color: '#ccc', fontSize: 13 }}>{c.text}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  value={commentInputs[post.id] || ''}
                  onChange={e => setCommentInputs(c => ({ ...c, [post.id]: e.target.value }))}
                  placeholder="Write a comment..."
                  onKeyDown={e => e.key === 'Enter' && submitComment(post.id)}
                  style={{ flex: 1, background: '#1e1e1e', border: '1px solid #444', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 13 }}
                />
                <button onClick={() => submitComment(post.id)}
                  style={{ background: accentColor, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── EVENTS TAB ───────────────────────────────────────────────────────────────
function EventsTab({ events, accentColor }: { events: ClubEvent[]; accentColor: string }) {
  const [localEvents, setLocalEvents] = useState(events);

  const toggleRsvp = (id: string) => {
    // BACKEND: POST /api/clubs/:clubId/events/:eventId/rsvp
    setLocalEvents(e => e.map(ev => ev.id === id ? { ...ev, rsvped: !ev.rsvped, rsvpCount: ev.rsvped ? ev.rsvpCount - 1 : ev.rsvpCount + 1 } : ev));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {localEvents.map(ev => (
        <div key={ev.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 22, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <div style={{ background: accentColor + '22', border: `1px solid ${accentColor}44`, borderRadius: 10, padding: '10px 14px', textAlign: 'center', flexShrink: 0, minWidth: 56 }}>
            <div style={{ color: accentColor, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              {new Date(ev.date).toLocaleString('default', { month: 'short' })}
            </div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
              {new Date(ev.date).getDate()}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{ev.title}</div>
            <div style={{ color: '#aaa', fontSize: 13, marginBottom: 6 }}>📍 {ev.location} · ⏰ {ev.time}</div>
            <p style={{ color: '#bbb', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px' }}>{ev.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => toggleRsvp(ev.id)}
                style={{ background: ev.rsvped ? accentColor : 'transparent', color: ev.rsvped ? '#fff' : accentColor, border: `1px solid ${accentColor}`, borderRadius: 8, padding: '6px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
                {ev.rsvped ? '✓ Going' : 'RSVP'}
              </button>
              <span style={{ color: '#777', fontSize: 12 }}>{ev.rsvpCount} going</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APPLICATION TAB ──────────────────────────────────────────────────────────
function ApplicationTab({ club }: { club: Club }) {
  const [form, setForm] = useState({ name: '', email: '', major: '', year: '', why: '', experience: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.why.trim()) e.why = 'Please tell us why you want to join';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // BACKEND: POST /api/clubs/:clubId/applications — body: form data
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h3 style={{ color: '#fff', fontFamily: "'Georgia', serif", fontSize: 22, marginBottom: 10 }}>Application Submitted!</h3>
        <p style={{ color: '#aaa', fontSize: 14 }}>Thanks for applying to {club.name}. Our leadership team will review your application and reach out soon.</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', major: '', year: '', why: '', experience: '' }); }}
          style={{ marginTop: 20, background: 'transparent', color: club.accentColor, border: `1px solid ${club.accentColor}`, borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 14 }}>
          Submit Another
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#1e1e1e', border: '1px solid #3a3a3a', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };
  const labelStyle: React.CSSProperties = { display: 'block', color: '#bbb', fontSize: 13, fontWeight: 600, marginBottom: 6 };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 540 }}>
      <h3 style={{ color: '#fff', fontFamily: "'Georgia', serif", fontSize: 18, marginBottom: 4 }}>Apply to {club.name}</h3>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>Fill out the form below and our officers will review your application.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input style={{ ...inputStyle, borderColor: errors.name ? '#D22030' : '#3a3a3a' }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
          {errors.name && <span style={{ color: '#D22030', fontSize: 12 }}>{errors.name}</span>}
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input style={{ ...inputStyle, borderColor: errors.email ? '#D22030' : '#3a3a3a' }} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@school.edu" />
          {errors.email && <span style={{ color: '#D22030', fontSize: 12 }}>{errors.email}</span>}
        </div>
        <div>
          <label style={labelStyle}>Major</label>
          <input style={inputStyle} value={form.major} onChange={e => setForm(f => ({ ...f, major: e.target.value }))} placeholder="e.g. Computer Science" />
        </div>
        <div>
          <label style={labelStyle}>Year</label>
          <select style={inputStyle} value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
            <option value="">Select year</option>
            <option>Freshman</option><option>Sophomore</option><option>Junior</option><option>Senior</option><option>Graduate</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Why do you want to join? *</label>
        <textarea style={{ ...inputStyle, borderColor: errors.why ? '#D22030' : '#3a3a3a', minHeight: 100, resize: 'vertical' }} value={form.why} onChange={e => setForm(f => ({ ...f, why: e.target.value }))} placeholder="Tell us your motivation..." />
        {errors.why && <span style={{ color: '#D22030', fontSize: 12 }}>{errors.why}</span>}
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Relevant Experience</label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="Any projects, skills, or experience..." />
      </div>
      <button type="submit" style={{ background: club.accentColor, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15, width: '100%' }}>
        Submit Application
      </button>
    </form>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function ClubPage() {
  // BACKEND: const { data: club } = useFetch(`/api/clubs/${clubId}`);
  const [club, setClub] = useState<Club>(MOCK_CLUB);
  const [members] = useState<ClubMember[]>(MOCK_MEMBERS);
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'apply'>('feed');
  const [showIntro, setShowIntro] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);

  // BACKEND: const isLeader = currentUser.role === 'President' || 'VP' || 'Officer'
  const isLeader = true; // mock — set false to hide the Manage Club button

  if (showEditPage) {
    return (
      <ClubEditPage
        club={club}
        members={members}
        onSave={(updated) => { setClub(updated); setShowEditPage(false); }}
        onBack={() => setShowEditPage(false)}
      />
    );
  }

  const accent = club.accentColor;
  const tabs = [
    { id: 'feed' as const, label: 'Social Feed', icon: <FeedIcon /> },
    { id: 'events' as const, label: 'Events', icon: <EventIcon /> },
    { id: 'apply' as const, label: 'Apply', icon: <ApplyIcon /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <IntroModal club={club} open={showIntro} onClose={() => setShowIntro(false)} />
      <MembersModal open={showMembers} onClose={() => setShowMembers(false)} members={members} />

      {/* ── BANNER ── */}
      <div style={{ position: 'relative', width: '100%', height: 280, background: '#222', overflow: 'hidden' }}>
        {club.bannerUrl && (
          <img src={club.bannerUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #111 100%)' }} />
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 10 }}>
          <button onClick={() => setShowMembers(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <MembersIcon /> {members.length} Members
          </button>
          {isLeader && (
            <button onClick={() => setShowEditPage(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: accent, border: 'none', borderRadius: 8, color: '#fff', padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <EditIcon /> Manage Club
            </button>
          )}
        </div>
      </div>

      {/* ── LOGO + INFO ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginTop: -48, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 128, height: 128, borderRadius: '50%', background: '#111', padding: 4, boxShadow: `0 0 0 4px ${accent}` }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#222' }}>
                {club.logoUrl
                  ? <img src={club.logoUrl} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: accent }}>{club.name[0]}</div>}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, paddingBottom: 8, paddingTop: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Georgia', serif", margin: 0, color: '#fff' }}>{club.name}</h1>
              <span style={{ background: accent + '22', color: accent, border: `1px solid ${accent}44`, borderRadius: 20, padding: '2px 12px', fontSize: 11, fontWeight: 700 }}>{club.category}</span>
            </div>
            <p style={{ color: '#aaa', fontSize: 14, margin: '4px 0 10px', fontStyle: 'italic' }}>{club.tagline}</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ color: '#777', fontSize: 13 }}>👥 {club.memberCount} members</span>
              <span style={{ color: '#777', fontSize: 13 }}>📅 Founded {club.founded}</span>
              {club.discordUrl && (
                <a href={club.discordUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#7289DA', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                  <DiscordIcon /> Join Discord
                </a>
              )}
            </div>
          </div>
          <button onClick={() => setShowIntro(true)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#ccc', padding: '8px 16px', cursor: 'pointer', fontSize: 13, flexShrink: 0, marginBottom: 8 }}>
            ℹ️ About
          </button>
        </div>

        {/* ── DESCRIPTION ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
          <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{club.description}</p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 24, gap: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab.id ? accent : '#888', fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 14,
                borderBottom: activeTab === tab.id ? `2px solid ${accent}` : '2px solid transparent',
                marginBottom: -1, transition: 'all 0.15s',
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={{ paddingBottom: 60 }}>
          {activeTab === 'feed' && <SocialFeed posts={MOCK_POSTS} accentColor={accent} />}
          {activeTab === 'events' && <EventsTab events={MOCK_EVENTS} accentColor={accent} />}
          {activeTab === 'apply' && <ApplicationTab club={club} />}
        </div>
      </div>
    </div>
  );
}
