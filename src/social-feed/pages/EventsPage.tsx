// =============================================================================
// pages/EventsPage.tsx
// Campus events feed. Uses mock data until backend event endpoint is ready.
// =============================================================================

import { useState } from "react";
import type { CampusEvent } from "../types/feed.types";

const MOCK_EVENTS: CampusEvent[] = [
  { id:"e1", title:"COMP 490 Project Demo Day",   date:"Sep 25, 2025", time:"2:00 PM – 5:00 PM",  location:"JD 1600",                  tag:"Academic",    tagColor:"var(--csun-red)",    attendees:24,  isRsvped:false },
  { id:"e2", title:"SRC Open Gym Night",           date:"Sep 20, 2025", time:"6:00 PM – 10:00 PM", location:"SRC Main Floor",            tag:"Recreation",  tagColor:"var(--success)",     attendees:89,  isRsvped:true  },
  { id:"e3", title:"Tech Club Hackathon Kickoff",  date:"Oct 3, 2025",  time:"10:00 AM – 12:00 PM",location:"Oviatt Library 16",          tag:"Clubs",       tagColor:"var(--info)",        attendees:41,  isRsvped:false },
  { id:"e4", title:"Campus Sustainability Fair",   date:"Oct 10, 2025", time:"11:00 AM – 3:00 PM", location:"University Student Union",  tag:"Community",   tagColor:"var(--accent-gold)", attendees:130, isRsvped:false },
  { id:"e5", title:"Fall Career Fair 2025",        date:"Oct 15, 2025", time:"10:00 AM – 4:00 PM", location:"Matadome",                  tag:"Career",      tagColor:"#78BAFF",            attendees:450, isRsvped:false },
];

interface EventsPageProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function EventsPage({ onToast }: EventsPageProps) {
  const [events, setEvents] = useState(MOCK_EVENTS);

  function toggleRsvp(id: string) {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const nowRsvped = !e.isRsvped;
      onToast(nowRsvped ? "RSVP confirmed!" : "RSVP cancelled", nowRsvped ? "success" : "info");
      return { ...e, isRsvped: nowRsvped, attendees: e.attendees + (nowRsvped ? 1 : -1) };
    }));
  }

  return (
    <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12, animation:"fadeUp 240ms ease both" }}>
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
            <div>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:ev.tagColor, background:`${ev.tagColor}22`, padding:"2px 8px", borderRadius:99 }}>
                {ev.tag}
              </span>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:600, color:"var(--text-primary)", marginTop:8 }}>{ev.title}</h3>
            </div>
            <button
              onClick={() => toggleRsvp(ev.id)}
              style={{
                padding:"7px 16px", borderRadius:99,
                border: ev.isRsvped ? "1px solid var(--border-medium)" : "none",
                background: ev.isRsvped ? "transparent" : "var(--csun-red)",
                color: ev.isRsvped ? "var(--text-secondary)" : "#fff",
                fontSize:12, fontWeight:600, flexShrink:0,
                boxShadow: ev.isRsvped ? "none" : "0 2px 10px var(--csun-red-glow)",
                cursor:"pointer", transition:"all 150ms",
              }}
            >
              {ev.isRsvped ? "Going ✓" : "RSVP"}
            </button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
            {[
              { icon:<CalIcon/>,   text:ev.date },
              { icon:<ClockIcon/>, text:ev.time },
              { icon:<PinIcon/>,   text:ev.location },
              { icon:null,         text:`${ev.attendees} attending` },
            ].map((m, j) => (
              <span key={j} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}>
                {m.icon}{m.text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const CalIcon   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PinIcon   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
