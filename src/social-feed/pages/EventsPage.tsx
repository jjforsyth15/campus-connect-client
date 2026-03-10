// =============================================================================
// pages/EventsPage.tsx
// Campus events feed.
// Attempts to fetch live events from CSUN's news.csun.edu RSS feed via a
// Next.js API proxy (to avoid CORS). Falls back to curated mock data if the
// network request fails.
// =============================================================================

import { useState, useEffect } from "react";
import type { CampusEvent } from "../types/feed.types";

// Tag colours mapped by category keyword
const TAG_COLOR_MAP: Record<string, string> = {
  academic:    "var(--csun-red)",
  recreation:  "var(--success)",
  clubs:       "var(--info)",
  community:   "var(--accent-gold)",
  career:      "#78BAFF",
  arts:        "#c084fc",
  sports:      "var(--success)",
};
function tagColorFor(cat: string): string {
  const key = cat.toLowerCase();
  for (const k of Object.keys(TAG_COLOR_MAP)) if (key.includes(k)) return TAG_COLOR_MAP[k];
  return "var(--text-muted)";
}

const MOCK_EVENTS: CampusEvent[] = [
  { id:"e1", title:"COMP 490 Project Demo Day",   date:"Sep 25, 2025", time:"2:00 PM – 5:00 PM",  location:"JD 1600",                  tag:"Academic",    tagColor:"var(--csun-red)",    attendees:24,  isRsvped:false, csunUrl:"https://news.csun.edu/events",  description:"Senior capstone project demonstrations. Come see what CSUN CS seniors have been building all semester." },
  { id:"e2", title:"SRC Open Gym Night",           date:"Mar 15, 2026", time:"6:00 PM – 10:00 PM", location:"SRC Main Floor",            tag:"Recreation",  tagColor:"var(--success)",     attendees:89,  isRsvped:false, csunUrl:"https://www.csun.edu/src",      description:"Open gym hours at the Student Recreation Center. All students, faculty, and staff welcome." },
  { id:"e3", title:"Tech Club Hackathon Kickoff",  date:"Mar 20, 2026", time:"10:00 AM – 12:00 PM",location:"Oviatt Library 16",          tag:"Clubs",       tagColor:"var(--info)",        attendees:41,  isRsvped:false, csunUrl:"https://news.csun.edu/events",  description:"Kick off the semester-long hackathon with the CSUN Tech Club. Teams of 2–4. Prizes for top 3 teams." },
  { id:"e4", title:"Campus Sustainability Fair",   date:"Apr 5, 2026",  time:"11:00 AM – 3:00 PM", location:"University Student Union",  tag:"Community",   tagColor:"var(--accent-gold)", attendees:130, isRsvped:false, csunUrl:"https://news.csun.edu/events",  description:"Learn about sustainability initiatives on campus and meet environmental organizations." },
  { id:"e5", title:"Spring Career Fair 2026",      date:"Apr 10, 2026", time:"10:00 AM – 4:00 PM", location:"Matadome",                  tag:"Career",      tagColor:"#78BAFF",            attendees:450, isRsvped:false, csunUrl:"https://career.csun.edu",       description:"Meet hundreds of employers hiring CSUN students and alumni. Bring your resume and dress professionally." },
  { id:"e6", title:"AI Research Symposium",        date:"Apr 18, 2026", time:"1:00 PM – 4:00 PM",  location:"Bookstein Hall 1250",       tag:"Academic",    tagColor:"var(--csun-red)",    attendees:67,  isRsvped:false, csunUrl:"https://news.csun.edu/events",  description:"CSUN faculty and students present current AI research projects. Open to all." },
];

interface EventsPageProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

// Parse an RSS <item> element into a CampusEvent
function parseRssItem(item: Element, idx: number): CampusEvent {
  const get = (tag: string) => item.querySelector(tag)?.textContent?.trim() ?? "";
  const title = get("title");
  const pubDate = get("pubDate");
  const cat = get("category") || "Event";
  const location = get("location") || item.querySelector("ev\\:location")?.textContent?.trim() || "CSUN Campus";
  const link = get("link") || "https://news.csun.edu/events";
  const rawDesc = get("description").replace(/<[^>]*>/g, "").trim();
  // Strip RSS meta lines like "#123 posts" or "#tag count" patterns
  const cleanDesc = rawDesc
    .split(/\n|\r/)
    .filter(line => !/^#\d/.test(line.trim()) && line.trim().length > 0)
    .join(" ")
    .slice(0, 220);
  const description = cleanDesc || undefined;
  let date = "";
  let time = "";
  if (pubDate) {
    const d = new Date(pubDate);
    date = d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
    time = d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" });
  }
  return {
    id: `rss-${idx}`,
    title,
    date,
    time,
    location,
    tag: cat.split(",")[0].trim(),
    tagColor: tagColorFor(cat),
    attendees: Math.floor(20 + Math.random() * 200),
    isRsvped: false,
    csunUrl: link,
    description,
  };
}

// ── RSVP Modal ─────────────────────────────────────────────────────────────────
function RsvpModal({ event, onClose, onConfirm }: {
  event: CampusEvent;
  onClose: () => void;
  onConfirm: (name: string, email: string) => void;
}) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [done,  setDone]  = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setDone(true);
    setTimeout(() => onConfirm(name, email), 1300);
  }

  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background:"var(--bg-surface)", borderRadius:16, padding:28, width:"100%", maxWidth:440, boxShadow:"var(--shadow-panel)" }}>
        {done ? (
          <div style={{ textAlign:"center", padding:"12px 0" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--text-primary)", marginBottom:6 }}>You&apos;re registered!</div>
            <div style={{ fontSize:13, color:"var(--text-muted)" }}>RSVP confirmed for <strong>{event.title}</strong></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
              <div style={{ flex:1, minWidth:0, paddingRight:12 }}>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:event.tagColor, background:`${event.tagColor}22`, padding:"2px 8px", borderRadius:99 }}>{event.tag}</span>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:17, fontWeight:700, color:"var(--text-primary)", margin:"8px 0 4px" }}>{event.title}</h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {event.date     && <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"var(--text-muted)" }}><CalIcon/>{event.date}</span>}
                  {event.time     && <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"var(--text-muted)" }}><ClockIcon/>{event.time}</span>}
                  {event.location && <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"var(--text-muted)" }}><PinIcon/>{event.location}</span>}
                </div>
                {event.description && (
                  <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.6, marginTop:10, marginBottom:0 }}>{event.description}</p>
                )}
              </div>
              <button onClick={onClose} style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", border:"none", background:"var(--bg-elevated)", color:"var(--text-muted)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>×</button>
            </div>

            <div style={{ borderTop:"1px solid var(--border-subtle)", paddingTop:16 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:14, fontWeight:600, color:"var(--text-primary)", marginBottom:14 }}>Confirm your spot</div>
              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>CSUN Email</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="sarah.medhat@my.csun.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
                  <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                  <button
                    type="submit"
                    style={{ padding:"8px 20px", borderRadius:99, border:"none", background: (!name.trim() || !email.trim()) ? "var(--bg-elevated)" : "var(--csun-red)", color: (!name.trim() || !email.trim()) ? "var(--text-muted)" : "#fff", fontSize:13, fontWeight:600, cursor: (!name.trim() || !email.trim()) ? "not-allowed" : "pointer", transition:"all 150ms" }}
                    disabled={!name.trim() || !email.trim()}
                  >
                    Confirm RSVP
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function EventsPage({ onToast }: EventsPageProps) {
  const [events,    setEvents]    = useState<CampusEvent[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [fromCSUN,  setFromCSUN]  = useState(false);
  const [rsvpFor,   setRsvpFor]   = useState<CampusEvent | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchEvents() {
      try {
        // Use a Next.js API route proxy to avoid CORS
        const res = await fetch("/api/csun-events", { cache: "no-store" });
        if (!res.ok) throw new Error("non-200");
        const xml = await res.text();
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const items = Array.from(doc.querySelectorAll("item")).slice(0, 12);
        if (items.length > 0 && !cancelled) {
          setEvents(items.map(parseRssItem));
          setFromCSUN(true);
        } else if (!cancelled) {
          setEvents(MOCK_EVENTS);
        }
      } catch {
        // Fall back to mock data on any network/parse error
        if (!cancelled) setEvents(MOCK_EVENTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchEvents();
    return () => { cancelled = true; };
  }, []);

  function handleRsvpConfirm(ev: CampusEvent, _name: string, _email: string) {
    setEvents(prev => prev.map(e =>
      e.id !== ev.id ? e : { ...e, isRsvped: true, attendees: e.attendees + 1 }
    ));
    setRsvpFor(null);
    onToast(`RSVP confirmed for "${ev.title}"!`, "success");
  }

  function handleCancelRsvp(id: string) {
    setEvents(prev => prev.map(e =>
      e.id !== id ? e : { ...e, isRsvped: false, attendees: Math.max(0, e.attendees - 1) }
    ));
    onToast("RSVP cancelled", "info");
  }

  return (
    <div style={{ animation:"fadeUp 240ms ease both" }}>
      {/* Header bar */}
      <div style={{ padding:"16px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid var(--border-subtle)" }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"var(--text-primary)", margin:0 }}>Campus Events</h2>
          {fromCSUN
            ? <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>Live from CSUN · <a href="https://news.csun.edu/events" target="_blank" rel="noreferrer" style={{ color:"var(--csun-red)", textDecoration:"none" }}>View all on CSUN</a></p>
            : <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>Upcoming events at CSUN</p>
          }
        </div>
        <a href="https://news.csun.edu/events" target="_blank" rel="noreferrer"
          style={{ fontSize:12, fontWeight:600, color:"var(--csun-red)", textDecoration:"none", padding:"6px 14px", border:"1px solid var(--csun-red)", borderRadius:99 }}>
          All Events →
        </a>
      </div>

      {loading && (
        <div style={{ padding:"40px 20px", textAlign:"center", color:"var(--text-muted)", fontSize:13 }}>Loading events…</div>
      )}

      {!loading && (
      <div style={{ padding:"12px 20px", display:"flex", flexDirection:"column", gap:12 }}>
        {events.map((ev, i) => (
          <div
            key={ev.id}
            style={{
              background:"var(--bg-surface)", border:"1px solid var(--border-subtle)",
              borderRadius:"var(--radius-lg)", padding:18,
              animation:"fadeUp 240ms ease both", animationDelay:`${i*50}ms`,
              transition:"background 150ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-surface)")}
          >
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:10 }}>
              <div style={{ minWidth:0 }}>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:ev.tagColor, background:`${ev.tagColor}22`, padding:"2px 8px", borderRadius:99, whiteSpace:"nowrap" }}>
                  {ev.tag}
                </span>
                <h3
                  onClick={() => window.open(ev.csunUrl ?? "https://news.csun.edu/events", "_blank", "noreferrer")}
                  onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.color = "var(--csun-red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:600, color:"var(--text-primary)", marginTop:8, marginBottom:0, cursor:"pointer" }}
                >
                  {ev.title}
                </h3>
              </div>
              {ev.isRsvped ? (
                <button
                  onClick={() => handleCancelRsvp(ev.id)}
                  style={{ padding:"7px 16px", borderRadius:99, flexShrink:0, border:"1px solid var(--border-medium)", background:"transparent", color:"var(--text-secondary)", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 150ms" }}
                >
                  Going ✓
                </button>
              ) : (
                <button
                  onClick={() => setRsvpFor(ev)}
                  style={{ padding:"7px 16px", borderRadius:99, flexShrink:0, border:"none", background:"var(--csun-red)", color:"#fff", fontSize:12, fontWeight:600, boxShadow:"0 2px 10px var(--csun-red-glow)", cursor:"pointer", transition:"all 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "none")}
                >
                  RSVP
                </button>
              )}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
              {ev.date     && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}><CalIcon/>{ev.date}</span>}
              {ev.time     && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}><ClockIcon/>{ev.time}</span>}
              {ev.location && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}><PinIcon/>{ev.location}</span>}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* RSVP modal */}
      {rsvpFor && (
        <RsvpModal
          event={rsvpFor}
          onClose={() => setRsvpFor(null)}
          onConfirm={(name, email) => handleRsvpConfirm(rsvpFor, name, email)}
        />
      )}
    </div>
  );
}

const CalIcon   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PinIcon   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
