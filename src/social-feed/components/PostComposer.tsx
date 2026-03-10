// =============================================================================
// components/PostComposer.tsx
// Rich compose box for creating new posts on the social feed.
// =============================================================================

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";

interface PostComposerProps {
  currentUserInitials: string;
  currentUserAvatar?: string;
  onPost: (body: string) => Promise<void>;
}

const MAX_CHARS = 500;

export function PostComposer({ currentUserInitials, currentUserAvatar, onPost }: PostComposerProps) {
  const [value, setValue]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_CHARS - value.length;
  const overLimit = remaining < 0;
  const progress  = Math.min(value.length / MAX_CHARS, 1);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 240) + "px";
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    autoResize();
  }

  async function handleSubmit() {
    const text = value.trim();
    if (!text || overLimit || submitting) return;
    setSubmitting(true);
    try {
      await onPost(text);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  // char ring colour
  const ringColour = overLimit ? "#ef4444" : remaining < 30 ? "#f59e0b" : "var(--csun-red)";
  const circumference = 2 * Math.PI * 10; // r=10
  const dash = circumference * progress;

  return (
    <div style={{
      background: "var(--bg-surface)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "16px 18px",
      boxShadow: "var(--shadow-sm)",
      marginBottom: 16,
    }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        {/* Avatar */}
        <div className="avatar" style={{ width:38, height:38, fontSize:13, flexShrink:0, marginTop:2 }}>
          {currentUserAvatar
            ? <img src={currentUserAvatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <span className="avatar-initials">{currentUserInitials}</span>
          }
        </div>

        {/* Input area */}
        <div style={{ flex:1 }}>
          <textarea
            ref={textareaRef}
            placeholder="What's on your mind? (Cmd+Enter to post)"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            rows={2}
            maxLength={MAX_CHARS + 50}
            style={{
              width: "100%",
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--text-primary)",
              fontSize: 15,
              lineHeight: 1.6,
              fontFamily: "inherit",
              overflowY: "hidden",
              boxSizing: "border-box",
            }}
          />

          {/* Toolbar row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", marginTop:10, paddingTop:10, borderTop:"1px solid var(--border-subtle)", gap:12 }}>
            {/* Char ring */}
            {value.length > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <svg width={24} height={24} style={{ transform:"rotate(-90deg)" }}>
                  <circle cx={12} cy={12} r={10} fill="none" stroke="var(--border-subtle)" strokeWidth={2.5} />
                  <circle
                    cx={12} cy={12} r={10} fill="none"
                    stroke={ringColour} strokeWidth={2.5}
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition:"stroke-dasharray 150ms, stroke 150ms" }}
                  />
                </svg>
                <span style={{ fontSize:12, fontWeight:500, color: overLimit ? "#ef4444" : remaining < 30 ? "#f59e0b" : "var(--text-muted)" }}>
                  {remaining < 30 ? remaining : ""}
                </span>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!value.trim() || overLimit || submitting}
              style={{ opacity: (!value.trim() || overLimit || submitting) ? .5 : 1, transition:"opacity 150ms" }}
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
