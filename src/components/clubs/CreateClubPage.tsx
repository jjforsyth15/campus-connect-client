'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Club, ClubDetail, ClubMember } from './data/clubs.data';

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>;
const ChevronLeft  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>;
const CheckIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon        = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SparkleIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
const ImageIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const PaletteIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
const TagIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const InfoIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const RocketIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
const EyeIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

// ─── Types ───────────────────────────────────────────────────────────────────
type ClubDraft = {
  // Step 1 - Identity
  name: string;
  category: string;
  tagline: string;
  description: string;
  founded: string;
  // Step 2 - Card
  cardHeadline: string;
  cardBlurb: string;
  cardChips: string[];
  tags: string[];
  // Step 3 - Appearance
  accentColor: string;
  bgColor: string;
  textMode: 'dark' | 'light';
  logoUrl: string;
  bannerUrl: string;
  // Step 4 - Details
  introMessage: string;
  discordUrl: string;
  memberCount: number;
};

const EMPTY_DRAFT: ClubDraft = {
  name: '', category: 'STEM', tagline: '', description: '', founded: '',
  cardHeadline: '', cardBlurb: '', cardChips: [], tags: [],
  accentColor: '#B4002E', bgColor: '#0d0d0d', textMode: 'dark',
  logoUrl: '', bannerUrl: '',
  introMessage: '', discordUrl: '', memberCount: 0,
};

const CATEGORIES = ['STEM','Business','Arts','Cultural','Sports','Literature','Fraternity','Sorority'];

const CATEGORY_META: Record<string, { color: string; gradient: string; suggestedTags: string[] }> = {
  STEM:        { color: 'rgba(59,130,246,0.9)',   gradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',   suggestedTags: ['Workshops','Competitions','Projects','Research','Hackathons','Networking'] },
  Business:    { color: 'rgba(16,185,129,0.9)',   gradient: 'linear-gradient(135deg,#064e3b,#10b981)',   suggestedTags: ['Networking','Case Competitions','Startups','Finance','Marketing','Leadership'] },
  Arts:        { color: 'rgba(236,72,153,0.9)',   gradient: 'linear-gradient(135deg,#831843,#ec4899)',   suggestedTags: ['Exhibitions','Performances','Digital Art','Illustration','Film','Music'] },
  Cultural:    { color: 'rgba(245,158,11,0.9)',   gradient: 'linear-gradient(135deg,#78350f,#f59e0b)',   suggestedTags: ['Heritage','Food','Dance','Language','Community','Festivals'] },
  Sports:      { color: 'rgba(239,68,68,0.9)',    gradient: 'linear-gradient(135deg,#7f1d1d,#ef4444)',   suggestedTags: ['Intramurals','Fitness','Tournaments','Training','Leagues','Recreation'] },
  Literature:  { color: 'rgba(139,92,246,0.9)',   gradient: 'linear-gradient(135deg,#4c1d95,#8b5cf6)',   suggestedTags: ['Workshops','Fiction','Poetry','Open Mic','Publishing','Book Club'] },
  Fraternity:  { color: 'rgba(20,184,166,0.9)',   gradient: 'linear-gradient(135deg,#134e4a,#14b8a6)',   suggestedTags: ['Brotherhood','Rush','Philanthropy','Greek Life','Leadership','Alumni'] },
  Sorority:    { color: 'rgba(244,114,182,0.9)',  gradient: 'linear-gradient(135deg,#831843,#f472b6)',   suggestedTags: ['Sisterhood','Rush','Service','Greek Life','Empowerment','Recruitment'] },
};

const BG_PRESETS = [
  { label: 'Midnight', value: '#0d0d0d' }, { label: 'Obsidian', value: '#111827' },
  { label: 'Crimson',  value: '#12000a' }, { label: 'Navy',     value: '#050d1a' },
  { label: 'Forest',   value: '#030f08' }, { label: 'Slate',    value: '#0c0e12' },
  { label: 'White',    value: '#f8f8f8' }, { label: 'Light',    value: '#f0f2f5' },
];

const STEPS = [
  { id: 1, label: 'Identity',   icon: InfoIcon   },
  { id: 2, label: 'Card',       icon: TagIcon    },
  { id: 3, label: 'Appearance', icon: PaletteIcon },
  { id: 4, label: 'Details',    icon: SparkleIcon },
  { id: 5, label: 'Review',     icon: EyeIcon    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeInputSx(bg = '#2a0010', border = '#6b0020', color = '#fff'): React.CSSProperties {
  return { width: '100%', background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: '11px 16px', color, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' };
}
function labelSx(color = '#cc6677'): React.CSSProperties {
  return { display: 'block', color, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 7 };
}

// ─── Live Flip Card Preview ───────────────────────────────────────────────────
function LiveFlipCard({ draft }: { draft: ClubDraft }) {
  const [flipped, setFlipped] = useState(false);
  const meta = CATEGORY_META[draft.category] ?? CATEGORY_META['STEM'];
  const initials = draft.name.split(' ').filter(Boolean).slice(0,2).map(p => p[0]?.toUpperCase() ?? '').join('') || '?';

  return (
    <div style={{ perspective: '1200px', width: 260, margin: '0 auto', cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setFlipped(v => !v)}>
      <div style={{
        position: 'relative', height: 290,
        transformStyle: 'preserve-3d',
        transition: 'transform 540ms cubic-bezier(0.2,0.8,0.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        borderRadius: 20,
        boxShadow: '0 16px 50px rgba(0,0,0,0.6)',
      }}>
        {/* FRONT */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', borderRadius:20, overflow:'hidden', background:'rgba(255,255,255,0.97)' }}>
          <div style={{
            height: 110,
            background: draft.bannerUrl ? undefined : meta.gradient,
            backgroundImage: draft.bannerUrl ? `url(${draft.bannerUrl})` : undefined,
            backgroundSize: 'cover', backgroundPosition: 'center',
            position: 'relative',
          }}>
            <div style={{ position:'absolute', top:8, right:8, background: meta.color, color:'#fff', borderRadius:99, padding:'3px 10px', fontSize:11, fontWeight:800, letterSpacing:0.5, textTransform:'uppercase' }}>
              {draft.category || 'Category'}
            </div>
          </div>
          <div style={{ position:'absolute', top:74, left:14, width:56, height:56, borderRadius:'50%', border:'3px solid white', overflow:'hidden', background: meta.color, display:'grid', placeItems:'center', zIndex:10 }}>
            {draft.logoUrl
              ? <img src={draft.logoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => (e.target as HTMLImageElement).style.display='none'} />
              : <span style={{ color:'#fff', fontWeight:900, fontSize:18 }}>{initials}</span>}
          </div>
          <div style={{ paddingTop:34, paddingLeft:16, paddingRight:16, paddingBottom:12 }}>
            <div style={{ fontWeight:900, fontSize:15, color:'#1a0408', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {draft.name || 'Club Name'}
            </div>
            <div style={{ fontSize:12, color:'rgba(45,16,18,0.6)', marginTop:4, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {draft.tagline || 'Your tagline will appear here…'}
            </div>
          </div>
          <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'rgba(45,16,18,0.35)', fontWeight:700, letterSpacing:0.5, whiteSpace:'nowrap' }}>
            CLICK TO FLIP
          </div>
        </div>

        {/* BACK */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)', borderRadius:20, overflow:'hidden', background:'rgba(255,255,255,0.97)', padding:20, boxSizing:'border-box', display:'flex', flexDirection:'column' }}>
          <div style={{ fontWeight:900, fontSize:14, color:'#1a0408' }}>{draft.cardHeadline || draft.name || 'Club Name'}</div>
          <div style={{ fontSize:12, color:'rgba(45,16,18,0.72)', lineHeight:1.55, marginTop:8, flex:1, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical' }}>
            {draft.cardBlurb || draft.description || 'Your back-of-card description will appear here.'}
          </div>
          {draft.cardChips.length > 0 && (
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:10 }}>
              {draft.cardChips.map(c => (
                <span key={c} style={{ fontSize:11, fontWeight:800, background:'rgba(180,0,46,0.09)', color:'#B4002E', border:'1px solid rgba(180,0,46,0.18)', borderRadius:99, padding:'2px 8px' }}>{c}</span>
              ))}
            </div>
          )}
          <div style={{ marginTop:10, fontSize:11, color:'rgba(45,16,18,0.4)', fontWeight:700 }}>Click to flip back</div>
        </div>
      </div>
      <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:10, fontWeight:600 }}>Live preview · click card to flip</p>
    </div>
  );
}

// ─── Chip input ───────────────────────────────────────────────────────────────
function ChipInput({ label, chips, onChange, suggestions = [], placeholder, accentColor = '#B4002E' }: {
  label: string; chips: string[]; onChange: (c: string[]) => void;
  suggestions?: string[]; placeholder?: string; accentColor?: string;
}) {
  const [val, setVal] = useState('');
  const add = (s: string) => {
    const t = s.trim();
    if (!t || chips.includes(t)) return;
    onChange([...chips, t]);
    setVal('');
  };
  const remove = (c: string) => onChange(chips.filter(x => x !== c));
  const remaining = suggestions.filter(s => !chips.includes(s));

  return (
    <div>
      <label style={labelSx('#999')}>{label}</label>
      {chips.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
          {chips.map(c => (
            <span key={c} style={{ display:'inline-flex', alignItems:'center', gap:5, background: accentColor+'22', border:`1px solid ${accentColor}55`, borderRadius:99, padding:'4px 12px', fontSize:12, fontWeight:700, color: accentColor }}>
              {c}
              <button onClick={() => remove(c)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color: accentColor, display:'flex', alignItems:'center', opacity:0.7, lineHeight:1 }}>
                <XIcon />
              </button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display:'flex', gap:8 }}>
        <input
          style={{ ...makeInputSx(), flex:1 }}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(val); } }}
          placeholder={placeholder ?? 'Type and press Enter…'}
        />
        <button onClick={() => add(val)}
          style={{ background: accentColor, color:'#fff', border:'none', borderRadius:12, padding:'0 18px', cursor:'pointer', fontWeight:700, fontSize:13, flexShrink:0 }}>
          Add
        </button>
      </div>
      {remaining.length > 0 && (
        <div style={{ marginTop:10 }}>
          <div style={{ fontSize:11, color:'rgba(255,120,120,0.5)', marginBottom:6, fontWeight:600 }}>SUGGESTED</div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {remaining.map(s => (
              <button key={s} onClick={() => add(s)}
                style={{ background:'rgba(180,0,46,0.08)', border:'1px solid rgba(255,80,80,0.18)', borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:700, color:'rgba(255,160,160,0.7)', cursor:'pointer', transition:'all 0.15s' }}>
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepIdentity({ draft, set }: { draft: ClubDraft; set: (k: keyof ClubDraft, v: any) => void }) {
  const inp = makeInputSx();
  const lbl = labelSx('#999');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <label style={lbl}>Club Name *</label>
        <input style={{ ...inp, fontSize:18, fontWeight:700 }} value={draft.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Robotics & AI Society" />
      </div>

      <div>
        <label style={lbl}>Category *</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat];
            const active = draft.category === cat;
            return (
              <button key={cat} onClick={() => set('category', cat)}
                style={{
                  border: active ? `2px solid ${meta.color}` : '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius:12, padding:'10px 6px', cursor:'pointer', fontWeight:800, fontSize:12,
                  background: active ? meta.color.replace('0.9','0.18') : 'rgba(180,0,46,0.08)',
                  color: active ? '#fff' : 'rgba(255,160,160,0.5)',
                  transition:'all 0.18s', display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background: meta.color, flexShrink:0 }} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label style={lbl}>Tagline *</label>
        <input style={inp} value={draft.tagline} onChange={e => set('tagline', e.target.value)} placeholder="One line that captures your club's vibe" maxLength={80} />
        <div style={{ textAlign:'right', fontSize:11, color:'rgba(255,120,120,0.55)', marginTop:4 }}>{draft.tagline.length}/80</div>
      </div>

      <div>
        <label style={lbl}>Full Description *</label>
        <textarea style={{ ...inp, minHeight:120, resize:'vertical', lineHeight:1.6 }} value={draft.description} onChange={e => set('description', e.target.value)} placeholder="Tell prospective members what your club is about, what you do, and why they should join." />
      </div>

      <div>
        <label style={lbl}>Year Founded</label>
        <input style={{ ...inp, maxWidth:160 }} value={draft.founded} onChange={e => set('founded', e.target.value)} placeholder="e.g. 2019" />
      </div>
    </div>
  );
}

function StepCard({ draft, set }: { draft: ClubDraft; set: (k: keyof ClubDraft, v: any) => void }) {
  const inp = makeInputSx();
  const lbl = labelSx('#999');
  const meta = CATEGORY_META[draft.category] ?? CATEGORY_META['STEM'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div style={{ background:'rgba(180,0,46,0.1)', border:'1px solid rgba(255,80,80,0.15)', borderRadius:14, padding:'14px 16px' }}>
        <div style={{ fontSize:12, color:'rgba(255,180,180,0.65)', lineHeight:1.6 }}>
          <strong style={{ color:'rgba(255,210,210,0.9)' }}>Front of card</strong> — shows your name and tagline (set in Step 1).<br/>
          <strong style={{ color:'rgba(255,210,210,0.9)' }}>Back of card</strong> — shown when users flip the card on the hub grid.
        </div>
      </div>

      <div>
        <label style={lbl}>Card Headline (back)</label>
        <input style={inp} value={draft.cardHeadline} onChange={e => set('cardHeadline', e.target.value)} placeholder="e.g. Weekly builds and workshops" />
        <div style={{ fontSize:11, color:'rgba(255,120,120,0.55)', marginTop:4 }}>Defaults to your club name if left blank.</div>
      </div>

      <div>
        <label style={lbl}>Card Short Description (back)</label>
        <textarea style={{ ...inp, minHeight:80, resize:'vertical' }} value={draft.cardBlurb} onChange={e => set('cardBlurb', e.target.value)} placeholder="2–3 sentence hook for curious students…" />
      </div>

      <ChipInput
        label="Card Chips / Tags (back)"
        chips={draft.cardChips}
        onChange={v => set('cardChips', v)}
        suggestions={meta.suggestedTags}
        placeholder="e.g. Hackathons · press Enter"
        accentColor={draft.accentColor}
      />

      <ChipInput
        label="Search Tags"
        chips={draft.tags}
        onChange={v => set('tags', v)}
        suggestions={meta.suggestedTags.filter(s => !draft.cardChips.includes(s))}
        placeholder="e.g. ROS · Vision · Competitions"
        accentColor={draft.accentColor}
      />
    </div>
  );
}

function StepAppearance({ draft, set }: { draft: ClubDraft; set: (k: keyof ClubDraft, v: any) => void }) {
  const inp = makeInputSx();
  const lbl = labelSx('#999');
  const meta = CATEGORY_META[draft.category] ?? CATEGORY_META['STEM'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Logo */}
      <div>
        <label style={lbl}>Club Logo / Avatar</label>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', overflow:'hidden', background: meta.color.replace('0.9','0.3'), border:`3px solid ${draft.accentColor}`, flexShrink:0, display:'grid', placeItems:'center' }}>
            {draft.logoUrl
              ? <img src={draft.logoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => (e.target as HTMLImageElement).style.display='none'} />
              : <span style={{ color:'#fff', fontWeight:900, fontSize:22 }}>{draft.name.split(' ').slice(0,2).map(p=>p[0]?.toUpperCase()).join('') || '?'}</span>}
          </div>
          <div style={{ flex:1 }}>
            <input style={{ ...inp, marginBottom:8 }} value={draft.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="https://… (image URL)" />
            <label style={{ cursor:'pointer', color: draft.accentColor, fontSize:13, fontWeight:700 }}>
              📎 Upload from device
              <input type="file" accept="image/*" style={{ display:'none' }}
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { const r = new FileReader(); r.onload = () => set('logoUrl', r.result as string); r.readAsDataURL(f); }
                }} />
            </label>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div>
        <label style={lbl}>Banner Image</label>
        <div style={{ width:'100%', height:120, borderRadius:12, overflow:'hidden', background: meta.gradient, marginBottom:12, position:'relative' }}>
          {draft.bannerUrl && <img src={draft.bannerUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => (e.target as HTMLImageElement).style.display='none'} />}
          {!draft.bannerUrl && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6 }}>
              <ImageIcon />
              <span style={{ color:'rgba(255,180,180,0.4)', fontSize:12 }}>Category gradient preview</span>
            </div>
          )}
        </div>
        <input style={{ ...inp, marginBottom:8 }} value={draft.bannerUrl} onChange={e => set('bannerUrl', e.target.value)} placeholder="https://… (banner image URL, 1280×320 recommended)" />
        <label style={{ cursor:'pointer', color: draft.accentColor, fontSize:13, fontWeight:700 }}>
          📎 Upload banner
          <input type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) { const r = new FileReader(); r.onload = () => set('bannerUrl', r.result as string); r.readAsDataURL(f); }
            }} />
        </label>
      </div>

      {/* Accent color */}
      <div>
        <label style={lbl}>Accent Color</label>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'#1a1a1a', border:'1.5px solid #333', borderRadius:12, padding:'8px 12px' }}>
          <input type="color" value={draft.accentColor} onChange={e => set('accentColor', e.target.value)}
            style={{ width:38, height:38, border:'none', borderRadius:8, cursor:'pointer', background:'none', padding:2, flexShrink:0 }} />
          <input style={{ ...inp, flex:1, background:'transparent', border:'1.5px solid #333', padding:'7px 12px', borderRadius:8 }}
            value={draft.accentColor} onChange={e => set('accentColor', e.target.value)} placeholder="#B4002E" />
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
          {['#B4002E','#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#14b8a6','#ef4444'].map(c => (
            <button key={c} onClick={() => set('accentColor', c)}
              style={{ width:28, height:28, borderRadius:'50%', background:c, border: draft.accentColor===c ? '3px solid white' : '2px solid transparent', cursor:'pointer', transition:'all 0.15s' }} />
          ))}
        </div>
      </div>

      {/* Background color */}
      <div>
        <label style={lbl}>Profile Page Background</label>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'#1a1a1a', border:'1.5px solid #333', borderRadius:12, padding:'8px 12px', marginBottom:10 }}>
          <input type="color" value={draft.bgColor} onChange={e => set('bgColor', e.target.value)}
            style={{ width:38, height:38, border:'none', borderRadius:8, cursor:'pointer', background:'none', padding:2, flexShrink:0 }} />
          <input style={{ ...inp, flex:1, background:'transparent', border:'1.5px solid #333', padding:'7px 12px', borderRadius:8 }}
            value={draft.bgColor} onChange={e => set('bgColor', e.target.value)} placeholder="#0d0d0d" />
          <div style={{ width:1, height:28, background:'#333', flexShrink:0 }} />
          <button onClick={() => set('textMode', draft.textMode === 'light' ? 'dark' : 'light')}
            style={{ display:'flex', alignItems:'center', gap:6, background: draft.textMode==='light'?'#fff':'#222', border:`1px solid ${draft.textMode==='light'?'#ccc':'#555'}`, borderRadius:20, padding:'5px 14px', cursor:'pointer', flexShrink:0 }}>
            <span style={{ fontSize:13 }}>{draft.textMode==='light'?'☀️':'🌙'}</span>
            <span style={{ fontSize:12, fontWeight:700, color: draft.textMode==='light'?'#111':'#fff' }}>{draft.textMode==='light'?'Light':'Dark'}</span>
          </button>
        </div>
        <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
          {BG_PRESETS.map(p => (
            <button key={p.value} onClick={() => set('bgColor', p.value)}
              style={{ display:'flex', alignItems:'center', gap:5, background: draft.bgColor===p.value?draft.accentColor+'33':'rgba(180,0,46,0.08)', border:`1px solid ${draft.bgColor===p.value?draft.accentColor:'rgba(255,80,80,0.15)'}`, borderRadius:8, padding:'5px 10px', cursor:'pointer', fontSize:11, fontWeight:700, color:'rgba(255,170,170,0.7)', transition:'all 0.15s' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:p.value, border:'1px solid rgba(255,255,255,0.2)', display:'inline-block', flexShrink:0 }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepDetails({ draft, set }: { draft: ClubDraft; set: (k: keyof ClubDraft, v: any) => void }) {
  const inp = makeInputSx();
  const lbl = labelSx('#999');
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <label style={lbl}>Welcome / Intro Message</label>
        <p style={{ fontSize:12, color:'rgba(255,150,150,0.55)', marginBottom:10, lineHeight:1.5 }}>
          This pops up the first time a student visits your club page. Use it to introduce your club, share how to join, and set the tone.
        </p>
        <textarea style={{ ...inp, minHeight:140, resize:'vertical', lineHeight:1.7 }}
          value={draft.introMessage}
          onChange={e => set('introMessage', e.target.value)}
          placeholder={`Welcome to ${draft.name || 'our club'}! We're so glad you're here.\n\nWe meet every [day] at [time] in [location].\n\nTo join, [instructions]…`}
        />
      </div>
      <div>
        <label style={lbl}>Discord Server Invite URL</label>
        <input style={inp} value={draft.discordUrl} onChange={e => set('discordUrl', e.target.value)} placeholder="https://discord.gg/…" />
      </div>
      <div>
        <label style={lbl}>Estimated Member Count</label>
        <input style={{ ...inp, maxWidth:160 }} type="number" min={0} value={draft.memberCount || ''} onChange={e => set('memberCount', parseInt(e.target.value) || 0)} placeholder="e.g. 45" />
      </div>
    </div>
  );
}

function StepReview({ draft }: { draft: ClubDraft }) {
  const meta = CATEGORY_META[draft.category] ?? CATEGORY_META['STEM'];
  const checks = [
    { ok: !!draft.name,        label: 'Club name set' },
    { ok: !!draft.tagline,     label: 'Tagline set' },
    { ok: !!draft.description, label: 'Description written' },
    { ok: !!draft.cardBlurb || !!draft.description, label: 'Card description ready' },
    { ok: draft.cardChips.length > 0, label: 'Card chips added' },
    { ok: !!draft.logoUrl,     label: 'Logo / avatar uploaded' },
    { ok: !!draft.bannerUrl,   label: 'Banner image set' },
    { ok: !!draft.introMessage,label: 'Intro message written' },
    { ok: !!draft.discordUrl,  label: 'Discord link added' },
  ];
  const done = checks.filter(c => c.ok).length;
  const pct = Math.round((done / checks.length) * 100);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Completion bar */}
      <div style={{ background:'rgba(180,0,46,0.12)', borderRadius:14, padding:'18px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>Profile Completion</span>
          <span style={{ color: pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444', fontWeight:800, fontSize:16 }}>{pct}%</span>
        </div>
        <div style={{ background:'rgba(180,0,46,0.25)', borderRadius:99, height:6, overflow:'hidden' }}>
          <div style={{ width:`${pct}%`, height:'100%', background: pct>=80?'#22c55e':pct>=50?'#f59e0b':'#ef4444', borderRadius:99, transition:'width 0.5s ease' }} />
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'10px 20px', marginTop:14 }}>
          {checks.map((c,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color: c.ok ? '#ff8080' : 'rgba(255,120,120,0.3)', fontWeight:600 }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background: c.ok?'rgba(180,0,46,0.25)':'rgba(255,80,80,0.06)', border:`1.5px solid ${c.ok?'#ff6060':'rgba(255,80,80,0.15)'}`, display:'grid', placeItems:'center', flexShrink:0 }}>
                {c.ok && <CheckIcon />}
              </div>
              {c.label}
            </div>
          ))}
        </div>
      </div>

      {/* Summary table */}
      <div style={{ background:'rgba(60,0,20,0.4)', borderRadius:14, overflow:'hidden', border:'1px solid rgba(255,80,80,0.12)' }}>
        {[
          ['Name', draft.name || '—'],
          ['Category', draft.category],
          ['Tagline', draft.tagline || '—'],
          ['Card Chips', draft.cardChips.join(', ') || '—'],
          ['Search Tags', draft.tags.join(', ') || '—'],
          ['Accent Color', draft.accentColor],
          ['Discord', draft.discordUrl || '—'],
          ['Members', draft.memberCount ? `~${draft.memberCount}` : '—'],
        ].map(([k, v], i) => (
          <div key={i} style={{ display:'flex', padding:'11px 16px', borderBottom:'1px solid rgba(255,80,80,0.08)', gap:16 }}>
            <div style={{ width:120, flexShrink:0, color:'rgba(255,150,150,0.55)', fontSize:12, fontWeight:700 }}>{k}</div>
            <div style={{ flex:1, color:'#fff', fontSize:13, wordBreak:'break-all' }}>
              {k === 'Accent Color' ? (
                <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:14, height:14, borderRadius:'50%', background: v, display:'inline-block', border:'1px solid rgba(255,255,255,0.2)' }} />
                  {v}
                </span>
              ) : v}
            </div>
          </div>
        ))}
      </div>

      {pct < 50 && (
        <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'12px 16px', fontSize:13, color:'#fca5a5', lineHeight:1.6 }}>
          ⚠️ Your club profile is less than 50% complete. Consider filling in more details before publishing — a complete profile gets more members!
        </div>
      )}
    </div>
  );
}

// ─── Window width hook (SSR-safe) ────────────────────────────────────────────
function useIsNarrow(breakpoint = 900) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return narrow;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
interface CreateClubPageProps {
  onClubCreated?: (club: Club, detail: ClubDetail) => void;
  onBack?: () => void;
}

export default function CreateClubPage({ onClubCreated, onBack }: CreateClubPageProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ClubDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const set = useCallback((k: keyof ClubDraft, v: any) => {
    setDraft(d => ({ ...d, [k]: v }));
  }, []);

  // Validation per step
  const stepValid = (s: number): boolean => {
    if (s === 1) return !!draft.name.trim() && !!draft.tagline.trim() && !!draft.description.trim();
    if (s === 2) return true; // card is optional
    if (s === 3) return true; // appearance optional
    if (s === 4) return true; // details optional
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API

    const newId = `club-${Date.now()}`;
    const slug = draft.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newClub: Club = {
      id: newId,
      slug,
      name: draft.name,
      category: draft.category,
      tagline: draft.tagline,
      description: draft.description,
      tags: draft.tags,
      logoUrl: draft.logoUrl || undefined,
      bannerUrl: draft.bannerUrl || undefined,
      href: `/clubs/${newId}`,
      card: {
        headline: draft.cardHeadline || draft.name,
        blurb: draft.cardBlurb || draft.description,
        chips: draft.cardChips,
      },
    };

    const newDetail: ClubDetail = {
      id: newId,
      name: draft.name,
      tagline: draft.tagline,
      description: draft.description,
      introMessage: draft.introMessage || `Welcome to ${draft.name}!`,
      logoUrl: draft.logoUrl || undefined,
      bannerUrl: draft.bannerUrl || undefined,
      accentColor: draft.accentColor,
      discordUrl: draft.discordUrl || undefined,
      memberCount: draft.memberCount,
      category: draft.category,
      founded: draft.founded || new Date().getFullYear().toString(),
    };

    // BACKEND: POST /api/clubs — body: { club: newClub, detail: newDetail }
    // Optimistic update — in real app this would go to Supabase then revalidate
    onClubCreated?.(newClub, newDetail);

    setSaving(false);
    setSaved(true);
  };

  const isNarrow = useIsNarrow(900);
  const isDark = true;
  const txt = { primary:'#ffffff', secondary:'rgba(255,255,255,0.65)', muted:'rgba(255,255,255,0.35)' };
  const accent = draft.accentColor || '#B4002E';

  if (saved) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#3a0010 0%,#1a000a 50%,#2a0008 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
        <div style={{ textAlign:'center', maxWidth:480 }}>
          <div style={{ fontSize:72, marginBottom:16 }}>🎉</div>
          <h1 style={{ color:'#fff', fontSize:36, fontWeight:900, margin:'0 0 12px', letterSpacing:-1 }}>
            {draft.name} is live!
          </h1>
          <p style={{ color:'rgba(255,180,180,0.65)', fontSize:16, lineHeight:1.6, marginBottom:32 }}>
            Your club has been created and is now visible in the Club Connect hub.
            Students can discover, join, and follow updates.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button
              onClick={() => router.push(`/clubs/${draft.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}`)}
              style={{ background: accent, color:'#fff', border:'none', borderRadius:12, padding:'13px 28px', cursor:'pointer', fontWeight:800, fontSize:15 }}>
              View Club Page →
            </button>
            <button
              onClick={() => router.push('/clubs')}
              style={{ background:'rgba(180,0,46,0.15)', color:'rgba(255,180,180,0.9)', border:'1px solid rgba(255,80,80,0.25)', borderRadius:12, padding:'13px 28px', cursor:'pointer', fontWeight:700, fontSize:15 }}>
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#3a0010 0%,#1a000a 40%,#2a0008 100%)', color:'#fff', fontFamily:"'Segoe UI',system-ui,sans-serif", position:'relative' }}>
      {/* Aurora glow layers */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', background:'radial-gradient(ellipse 80% 50% at 10% 5%, rgba(230,20,50,0.35), transparent 55%), radial-gradient(ellipse 70% 45% at 90% 10%, rgba(180,0,40,0.3), transparent 55%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(140,0,35,0.25), transparent 60%)', filter:'blur(40px)' }} />
      {/* ── Sticky Header ── */}
      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(42,0,12,0.88)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,80,80,0.12)', padding:'14px 24px', display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={onBack ?? (() => router.push('/clubs'))}
          style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.2)', borderRadius:8, color:'rgba(255,180,180,0.8)', padding:'7px 14px', cursor:'pointer', fontSize:13 }}>
          <ChevronLeft /> Back
        </button>
        <div style={{ flex:1 }}>
          <h1 style={{ margin:0, fontSize:17, fontWeight:800, color:'#fff' }}>Create New Club</h1>
          <div style={{ color:'rgba(255,150,150,0.5)', fontSize:12 }}>
            {draft.name ? `"${draft.name}"` : 'Fill in the details below'}
          </div>
        </div>

        {/* Step progress pills */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {STEPS.map((s, i) => {
            const state = step === s.id ? 'active' : step > s.id ? 'done' : 'todo';
            return (
              <React.Fragment key={s.id}>
                <button onClick={() => step > s.id && setStep(s.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:6,
                    borderRadius:99, padding:'5px 12px',
                    background: state==='active'?'rgba(180,0,46,0.3)':state==='done'?'rgba(180,0,46,0.15)':'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${state==='active'?accent:state==='done'?'rgba(220,60,80,0.5)':'rgba(255,80,80,0.1)'}`,
                    color: state==='active'?accent:state==='done'?'#ff8080':'rgba(255,255,255,0.3)',
                    fontWeight:700, fontSize:12, cursor: state==='done'?'pointer':'default', transition:'all 0.2s',
                  }}>
                  {state==='done' ? <CheckIcon /> : <span style={{ width:14, height:14, borderRadius:'50%', background:'currentColor', opacity:0.5, flexShrink:0, display:'inline-block' }} />}
                  <span style={{ display: isNarrow ? 'none' : 'inline' }}>{s.label}</span>
                </button>
                {i < STEPS.length-1 && <div style={{ width:16, height:1, background:'rgba(255,80,80,0.15)' }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 20px', display:'grid', gridTemplateColumns: showPreview ? '1fr 300px' : '1fr', gap:32, alignItems:'start', position:'relative', zIndex:1 }}>

        {/* Left: Form */}
        <div>
          {/* Step header */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:36, height:36, borderRadius:10, background: 'rgba(180,0,46,0.25)', border:`1.5px solid rgba(180,0,46,0.45)`, display:'grid', placeItems:'center', color: accent }}>
                {React.createElement(STEPS[step-1].icon)}
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:-0.5 }}>
                  Step {step} — {STEPS[step-1].label}
                </div>
                <div style={{ fontSize:13, color:'rgba(255,150,150,0.5)', marginTop:2 }}>
                  {step===1 && 'Give your club a name, category, and description'}
                  {step===2 && 'Customize how your club appears on the hub flip card'}
                  {step===3 && 'Set your branding — logo, banner, colors'}
                  {step===4 && 'Intro message, Discord, and extra details'}
                  {step===5 && 'Review everything before publishing'}
                </div>
              </div>
            </div>
          </div>

          {/* Step content */}
          <div style={{ background:'rgba(60,0,20,0.55)', border:'1px solid rgba(255,80,80,0.12)', borderRadius:18, padding:28, backdropFilter:'blur(12px)' }}>
            {step===1 && <StepIdentity draft={draft} set={set} />}
            {step===2 && <StepCard     draft={draft} set={set} />}
            {step===3 && <StepAppearance draft={draft} set={set} />}
            {step===4 && <StepDetails  draft={draft} set={set} />}
            {step===5 && <StepReview   draft={draft} />}
          </div>

          {/* Navigation */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:24 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s-1)}
                  style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(180,0,46,0.12)', border:'1px solid rgba(255,80,80,0.2)', borderRadius:10, padding:'10px 20px', cursor:'pointer', color:'rgba(255,180,180,0.8)', fontWeight:700, fontSize:14 }}>
                  <ChevronLeft /> Back
                </button>
              )}
              <button onClick={() => setShowPreview(v=>!v)}
                style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(255,80,80,0.15)', borderRadius:10, padding:'10px 16px', cursor:'pointer', color:'rgba(255,150,150,0.5)', fontSize:12, fontWeight:600 }}>
                <EyeIcon /> {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>

            {step < 5 ? (
              <button onClick={() => setStep(s => s+1)}
                disabled={!stepValid(step)}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  background: stepValid(step) ? accent : 'rgba(255,255,255,0.08)',
                  color: stepValid(step) ? '#fff' : 'rgba(255,255,255,0.3)',
                  border:'none', borderRadius:12, padding:'12px 28px',
                  cursor: stepValid(step) ? 'pointer' : 'not-allowed',
                  fontWeight:800, fontSize:15, transition:'all 0.2s',
                }}>
                Continue <ChevronRight />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving}
                style={{ display:'flex', alignItems:'center', gap:10, background: saving?'rgba(255,255,255,0.1)':accent, color:'#fff', border:'none', borderRadius:12, padding:'14px 36px', cursor: saving?'wait':'pointer', fontWeight:900, fontSize:16, boxShadow: saving?'none':`0 8px 30px ${accent}55`, transition:'all 0.3s' }}>
                {saving ? (
                  <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⟳</span> Creating…</>
                ) : (
                  <><RocketIcon /> Publish Club</>
                )}
              </button>
            )}
          </div>

          {/* Step indicators */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
            {STEPS.map(s => (
              <div key={s.id}
                style={{ width: step===s.id?28:8, height:8, borderRadius:99, background: step===s.id?accent:step>s.id?'rgba(180,0,46,0.45)':'rgba(255,80,80,0.15)', transition:'all 0.3s ease' }} />
            ))}
          </div>
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div style={{ position:'sticky', top:88 }}>
            <div style={{ background:'rgba(60,0,20,0.55)', border:'1px solid rgba(255,80,80,0.12)', borderRadius:18, padding:24, backdropFilter:'blur(12px)' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,150,150,0.5)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:16, textAlign:'center' }}>
                Card Preview
              </div>
              <LiveFlipCard draft={draft} />

              {step >= 3 && (
                <div style={{ marginTop:20 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,150,150,0.4)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:12, textAlign:'center' }}>
                    Profile Page Theme
                  </div>
                  <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ height:50, background: draft.bannerUrl?`url(${draft.bannerUrl}) center/cover`:`linear-gradient(135deg,${draft.accentColor},${draft.accentColor}88)` }} />
                    <div style={{ background: draft.bgColor, padding:'8px 12px', display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background: draft.accentColor, border:`2px solid ${draft.accentColor}`, flexShrink:0, overflow:'hidden' }}>
                        {draft.logoUrl && <img src={draft.logoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>(e.target as HTMLImageElement).style.display='none'} />}
                      </div>
                      <div>
                        <div style={{ fontSize:11, fontWeight:800, color: draft.textMode==='light'?'#111':'#fff', lineHeight:1.2 }}>{draft.name || 'Club Name'}</div>
                        <div style={{ fontSize:9, color: draft.textMode==='light'?'#666':'rgba(255,255,255,0.45)' }}>{draft.category}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus {
          border-color: ${accent} !important;
          box-shadow: 0 0 0 3px rgba(180,0,46,0.25) !important;
        }
        input::placeholder, textarea::placeholder { color: rgba(255,120,120,0.35) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(60,0,20,0.3); }
        ::-webkit-scrollbar-thumb { background: rgba(180,0,46,0.4); border-radius: 99px; }
      `}</style>
    </div>
  );
}
