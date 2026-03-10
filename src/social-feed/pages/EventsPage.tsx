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
  { id:"e1", title:"COMP 490 Project Demo Day",   date:"Sep 25, 2025", time:"2:00 PM – 5:00 PM",  location:"JD 1600",                  tag:"Academic",    tagColor:"var(--csun-red)",    attendees:24,  isRsvped:false },
  { id:"e2", title:"SRC Open Gym Night",           date:"Mar 15, 2026", time:"6:00 PM – 10:00 PM", location:"SRC Main Floor",            tag:"Recreation",  tagColor:"var(--success)",     attendees:89,  isRsvped:false },
  { id:"e3", title:"Tech Club Hackathon Kickoff",  date:"Mar 20, 2026", time:"10:00 AM – 12:00 PM",location:"Oviatt Library 16",          tag:"Clubs",       tagColor:"var(--info)",        attendees:41,  isRsvped:false },
  { id:"e4", title:"Campus Sustainability Fair",   date:"Apr 5, 2026",  time:"11:00 AM – 3:00 PM", location:"University Student Union",  tag:"Community",   tagColor:"var(--accent-gold)", attendees:130, isRsvped:false },
  { id:"e5", title:"Spring Career Fair 2026",      date:"Apr 10, 2026", time:"10:00 AM – 4:00 PM", location:"Matadome",                  tag:"Career",      tagColor:"#78BAFF",            attendees:450, isRsvped:false },
  { id:"e6", title:"AI Research Symposium",        date:"Apr 18, 2026", time:"1:00 PM – 4:00 PM",  location:"Bookstein Hall 1250",       tag:"Academic",    tagColor:"var(--csun-red)",    attendees:67,  isRsvped:false },
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
  };
}

export function EventsPage({ onToast }: EventsPageProps) {
  const [events,    setEvents]    = useState<CampusEvent[]>(MOCK_EVENTS);
  const [loading,   setLoading]   = useState(true);
  const [fromCSUN,  setFromCSUN]  = useState(false);

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
        }
      } catch {
        // Silently fall back to mock data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchEvents();
    return () => { cancelled = true; };
  }, []);

  function toggleRsvp(id: string) {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const nowRsvped = !e.isRsvped;
      onToast(nowRsvped ? "RSVP confirmed!" : "RSVP cancelled", nowRsvped ? "success" : "info");
      return { ...e, isRsvped: nowRsvped, attendees: e.attendees + (nowRsvped ? 1 : -1) };
    }));
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
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:600, color:"var(--text-primary)", marginTop:8, marginBottom:0 }}>{ev.title}</h3>
              </div>
              <button
                onClick={() => toggleRsvp(ev.id)}
                style={{
                  padding:"7px 16px", borderRadius:99, flexShrink:0,
                  border: ev.isRsvped ? "1px solid var(--border-medium)" : "none",
                  background: ev.isRsvped ? "transparent" : "var(--csun-red)",
                  color: ev.isRsvped ? "var(--text-secondary)" : "#fff",
                  fontSize:12, fontWeight:600,
                  boxShadow: ev.isRsvped ? "none" : "0 2px 10px var(--csun-red-glow)",
                  cursor:"pointer", transition:"all 150ms",
                }}
              >
                {ev.isRsvped ? "Going ✓" : "RSVP"}
              </button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
              {ev.date     && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}><CalIcon/>{ev.date}</span>}
              {ev.time     && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}><ClockIcon/>{ev.time}</span>}
              {ev.location && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}><PinIcon/>{ev.location}</span>}
              {ev.attendees > 0 && <span style={{ fontSize:12, color:"var(--text-muted)" }}>{ev.attendees} attending</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CalIcon   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PinIcon   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
