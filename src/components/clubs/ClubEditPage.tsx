'use client';

import React, { useState } from 'react';
import { Club, ClubMember } from '@/components/clubs/ClubPage';

// ─── ICONS ────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const BanIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', background: '#1e1e1e', border: '1px solid #3a3a3a', borderRadius: 10,
  padding: '10px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = { display: 'block', color: '#bbb', fontSize: 13, fontWeight: 600, marginBottom: 6 };
const sectionStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14, padding: 24, marginBottom: 20,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 18px', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {children}
    </h3>
  );
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1a8a4a', color: '#fff', borderRadius: 10, padding: '12px 20px', fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      ✓ {msg}
    </div>
  );
}

// ─── NEW EVENT FORM ───────────────────────────────────────────────────────────
type NewEvent = { title: string; description: string; date: string; time: string; location: string };

function NewEventForm({ accentColor, onAdd }: { accentColor: string; onAdd: (e: NewEvent) => void }) {
  const [form, setForm] = useState<NewEvent>({ title: '', description: '', date: '', time: '', location: '' });
  const [open, setOpen] = useState(false);

  const submit = () => {
    if (!form.title || !form.date) return;
    // BACKEND: POST /api/clubs/:clubId/events — body: form
    onAdd(form);
    setForm({ title: '', description: '', date: '', time: '', location: '' });
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: accentColor + '22', border: `1px dashed ${accentColor}66`, borderRadius: 10, padding: '12px 18px', color: accentColor, cursor: 'pointer', fontWeight: 600, fontSize: 14, width: '100%', justifyContent: 'center' }}>
        <AddIcon /> Create New Event
      </button>
    );
  }

  return (
    <div style={{ background: '#1a1a1a', border: `1px solid ${accentColor}44`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>New Event</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Event Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Workshop, Meeting, Showcase..." />
        </div>
        <div>
          <label style={labelStyle}>Date *</label>
          <input style={inputStyle} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Time</label>
          <input style={inputStyle} type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Location</label>
          <input style={inputStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Building, room, or 'Online'" />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What should members know?" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={submit} style={{ background: accentColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Add Event</button>
        <button onClick={() => setOpen(false)} style={{ background: 'transparent', color: '#888', border: '1px solid #444', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── MEMBER ROW ───────────────────────────────────────────────────────────────
const roleColor = (role: ClubMember['role']) => {
  switch (role) {
    case 'President': return '#FFD700';
    case 'VP': return '#C0C0C0';
    case 'Officer': return '#D22030';
    default: return '#6b7280';
  }
};

function MemberRow({ member, onKick, onBlock, onRoleChange, accentColor }: {
  member: ClubMember;
  onKick: (id: string) => void;
  onBlock: (id: string) => void;
  onRoleChange: (id: string, role: ClubMember['role']) => void;
  accentColor: string;
}) {
  const [confirm, setConfirm] = useState<'kick' | 'block' | null>(null);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: '#333', flexShrink: 0 }}>
        {member.avatar
          ? <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>{member.name[0]}</div>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: member.blocked ? '#666' : '#fff', fontWeight: 600, fontSize: 14 }}>
          {member.name} {member.blocked && <span style={{ color: '#D22030', fontSize: 11 }}>(blocked)</span>}
        </div>
        <div style={{ color: '#666', fontSize: 12 }}>{member.major}</div>
      </div>
      <select
        value={member.role}
        onChange={e => onRoleChange(member.id, e.target.value as ClubMember['role'])}
        disabled={member.role === 'President'}
        style={{ background: '#1e1e1e', border: `1px solid ${roleColor(member.role)}44`, borderRadius: 6, color: roleColor(member.role), padding: '4px 8px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}
      >
        {/* BACKEND: PATCH /api/clubs/:clubId/members/:memberId — body: { role } */}
        <option value="President">President</option>
        <option value="VP">VP</option>
        <option value="Officer">Officer</option>
        <option value="Member">Member</option>
      </select>
      {confirm ? (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#ccc', fontSize: 12 }}>Sure?</span>
          <button onClick={() => { confirm === 'kick' ? onKick(member.id) : onBlock(member.id); setConfirm(null); }}
            style={{ background: '#D22030', color: '#fff', border: 'none', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 12 }}>Yes</button>
          <button onClick={() => setConfirm(null)}
            style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 12 }}>No</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6 }}>
          <button title="Remove member" onClick={() => setConfirm('kick')} disabled={member.role === 'President'}
            style={{ background: 'rgba(210,32,48,0.1)', border: '1px solid rgba(210,32,48,0.3)', color: '#D22030', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: member.role === 'President' ? 0.3 : 1 }}>
            <TrashIcon />
          </button>
          <button title={member.blocked ? 'Unblock' : 'Block'} onClick={() => setConfirm('block')} disabled={member.role === 'President'}
            style={{ background: 'rgba(255,160,0,0.1)', border: '1px solid rgba(255,160,0,0.3)', color: '#FFA000', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: member.role === 'President' ? 0.3 : 1 }}>
            <BanIcon />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface ClubEditPageProps {
  club: Club;
  members: ClubMember[];
  onSave: (updated: Club) => void;
  onBack: () => void;
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function ClubEditPage({ club, members: initialMembers, onSave, onBack }: ClubEditPageProps) {
  const [form, setForm] = useState<Club>({ ...club });
  const [memberList, setMemberList] = useState<ClubMember[]>(initialMembers);
  const [events, setEvents] = useState([
    { id: 'e1', title: 'Intro to ROS2 Workshop', date: '2025-02-27', time: '18:00', location: 'Eng. Bldg 204' },
    { id: 'e2', title: 'Spring Robotics Showcase', date: '2025-04-12', time: '14:00', location: 'Main Quad' },
  ]);
  const [toast, setToast] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [activeSection, setActiveSection] = useState<'info' | 'media' | 'events' | 'members'>('info');

  const accentColor = form.accentColor;

  const handleSave = () => {
    // BACKEND: PATCH /api/clubs/:clubId — body: form fields
    onSave(form);
    setToast('Club updated successfully!');
  };

  const kickMember = (id: string) => {
    // BACKEND: DELETE /api/clubs/:clubId/members/:memberId
    setMemberList(m => m.filter(member => member.id !== id));
    setToast('Member removed.');
  };

  const blockMember = (id: string) => {
    // BACKEND: PATCH /api/clubs/:clubId/members/:memberId — body: { blocked: true }
    setMemberList(m => m.map(member => member.id === id ? { ...member, blocked: !member.blocked } : member));
    setToast('Member block status updated.');
  };

  const changeRole = (id: string, role: ClubMember['role']) => {
    // BACKEND: PATCH /api/clubs/:clubId/members/:memberId — body: { role }
    setMemberList(m => m.map(member => member.id === id ? { ...member, role } : member));
    setToast('Role updated.');
  };

  const removeEvent = (id: string) => {
    // BACKEND: DELETE /api/clubs/:clubId/events/:eventId
    setEvents(e => e.filter(ev => ev.id !== id));
    setToast('Event deleted.');
  };

  const filteredMembers = memberList.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()));

  const navItems = [
    { id: 'info', label: '📝 Club Info' },
    { id: 'media', label: '🖼️ Media' },
    { id: 'events', label: '📅 Events' },
    { id: 'members', label: '👥 Members' },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}

      {/* ── HEADER ── */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <button onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#ccc', padding: '7px 14px', cursor: 'pointer', fontSize: 13 }}>
          <BackIcon /> Back to Club
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>Manage Club</h1>
          <div style={{ color: '#666', fontSize: 12 }}>{club.name}</div>
        </div>
        <button onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: accentColor, border: 'none', borderRadius: 8, color: '#fff', padding: '9px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          <SaveIcon /> Save Changes
        </button>
      </div>

      <div style={{ display: 'flex', maxWidth: 960, margin: '0 auto', padding: '24px 16px', gap: 24, alignItems: 'flex-start' }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: 180, flexShrink: 0, position: 'sticky', top: 80 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setActiveSection(n.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: activeSection === n.id ? accentColor + '22' : 'none',
                border: activeSection === n.id ? `1px solid ${accentColor}44` : '1px solid transparent',
                borderRadius: 9, padding: '10px 14px',
                color: activeSection === n.id ? accentColor : '#888',
                cursor: 'pointer', fontSize: 14,
                fontWeight: activeSection === n.id ? 700 : 400,
                marginBottom: 4, transition: 'all 0.15s',
              }}>
              {n.label}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div style={{ flex: 1 }}>

          {/* INFO */}
          {activeSection === 'info' && (
            <div>
              <div style={sectionStyle}>
                <SectionTitle>Basic Information</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Club Name</label>
                    {/* BACKEND: PATCH /api/clubs/:clubId — body: { name } */}
                    <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tagline</label>
                    <input style={inputStyle} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="One line that sums up your club" />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      <option>STEM</option><option>Arts</option><option>Sports</option><option>Social</option>
                      <option>Academic</option><option>Cultural</option><option>Service</option><option>Gaming</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <SectionTitle>Intro Message (Welcome Modal)</SectionTitle>
                <p style={{ color: '#888', fontSize: 13, marginBottom: 14 }}>This message appears as a popup when someone first visits your club page.</p>
                <textarea style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }} value={form.introMessage} onChange={e => setForm(f => ({ ...f, introMessage: e.target.value }))} />
              </div>

              <div style={sectionStyle}>
                <SectionTitle>Links & Social</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Discord Server Invite URL</label>
                    {/* BACKEND: PATCH /api/clubs/:clubId — body: { discordUrl } */}
                    <input style={inputStyle} value={form.discordUrl || ''} onChange={e => setForm(f => ({ ...f, discordUrl: e.target.value }))} placeholder="https://discord.gg/..." />
                  </div>
                  <div>
                    <label style={labelStyle}>Accent Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input type="color" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                        style={{ width: 44, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none', padding: 2 }} />
                      <input style={{ ...inputStyle, flex: 1 }} value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} placeholder="#D22030" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA */}
          {activeSection === 'media' && (
            <div>
              <div style={sectionStyle}>
                <SectionTitle>Club Logo / Profile Picture</SectionTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: '#222', border: `3px solid ${accentColor}`, flexShrink: 0 }}>
                    {form.logoUrl && <img src={form.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Logo URL</label>
                    {/* BACKEND: POST /api/clubs/:clubId/upload — multipart/form-data, field: 'logo'. Returns { logoUrl } */}
                    <input style={inputStyle} value={form.logoUrl || ''} onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))} placeholder="https://... or upload below" />
                    <label style={{ ...labelStyle, cursor: 'pointer', color: accentColor, marginTop: 8 }}>
                      📎 Upload from device
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => {
                          // BACKEND: POST /api/clubs/:clubId/upload — send file, receive { logoUrl }
                          const file = e.target.files?.[0];
                          if (file) { const r = new FileReader(); r.onload = () => setForm(f => ({ ...f, logoUrl: r.result as string })); r.readAsDataURL(file); }
                        }} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <SectionTitle>Banner Image</SectionTitle>
                <p style={{ color: '#777', fontSize: 12, marginBottom: 12 }}>Recommended: 1280×320px </p>
                <div style={{ width: '100%', height: 140, borderRadius: 10, overflow: 'hidden', background: '#1a1a1a', border: '1px solid #333', marginBottom: 14 }}>
                  {form.bannerUrl && <img src={form.bannerUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <label style={labelStyle}>Banner URL</label>
                {/* BACKEND: POST /api/clubs/:clubId/upload — multipart/form-data, field: 'banner'. Returns { bannerUrl } */}
                <input style={inputStyle} value={form.bannerUrl || ''} onChange={e => setForm(f => ({ ...f, bannerUrl: e.target.value }))} placeholder="https://... (1280×320 recommended)" />
                <label style={{ ...labelStyle, cursor: 'pointer', color: accentColor, marginTop: 8 }}>
                  📎 Upload banner image
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      // BACKEND: POST /api/clubs/:clubId/upload — send file, receive { bannerUrl }
                      const file = e.target.files?.[0];
                      if (file) { const r = new FileReader(); r.onload = () => setForm(f => ({ ...f, bannerUrl: r.result as string })); r.readAsDataURL(file); }
                    }} />
                </label>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {activeSection === 'events' && (
            <div style={sectionStyle}>
              <SectionTitle>Manage Events</SectionTitle>
              <NewEventForm accentColor={accentColor} onAdd={ev => {
                // BACKEND: POST /api/clubs/:clubId/events — body: ev
                setEvents(e => [...e, { ...ev, id: Date.now().toString() }]);
                setToast('Event created!');
              }} />
              <div style={{ marginTop: 16 }}>
                {events.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                      <div style={{ color: '#777', fontSize: 12 }}>📅 {ev.date} · ⏰ {ev.time} · 📍 {ev.location}</div>
                    </div>
                    <button onClick={() => removeEvent(ev.id)}
                      style={{ background: 'rgba(210,32,48,0.12)', border: '1px solid rgba(210,32,48,0.3)', color: '#D22030', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <TrashIcon /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMBERS */}
          {activeSection === 'members' && (
            <div style={sectionStyle}>
              <SectionTitle>Member Management ({memberList.length})</SectionTitle>
              <p style={{ color: '#777', fontSize: 13, marginBottom: 14 }}>
                Change roles, remove members, or block users from rejoining.
                <br /><span style={{ color: '#555', fontSize: 12 }}>The club President cannot be kicked or blocked.</span>
              </p>
              <input
                placeholder="Search members..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                style={{ ...inputStyle, marginBottom: 14 }}
              />
              {/* BACKEND: GET /api/clubs/:clubId/members — returns member list with roles */}
              {filteredMembers.map(m => (
                <MemberRow key={m.id} member={m} onKick={kickMember} onBlock={blockMember} onRoleChange={changeRole} accentColor={accentColor} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
