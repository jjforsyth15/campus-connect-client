"use client";

import * as React from "react";
import { EmailAgentButton } from "./EmailAgentButton";

type ChatRole = "user" | "assistant";
type ChatItem = { role: ChatRole; content: string };

const DISCLAIMER = "Not official CSUN advice. Verify with CSUN sources.";
const MAX_MESSAGE_CHARS = 2000;
const PANEL_W = 360;
const PANEL_H = 520;
const BUTTON_W = 140;
const BUTTON_H = 56;
const MARGIN = 20;

export function CsunChatbotWidget() {
  const [open, setOpen] = React.useState(false);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [position, setPosition] = React.useState<{ left: number; top: number } | null>(null);
  const [items, setItems] = React.useState<ChatItem[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help with general CSUN questions.\n\n" +
        "Ask away, or choose “Email Agent instead”.\n\n" +
        DISCLAIMER,
    },
  ]);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null);
  const didDragRef = React.useRef(false);

  React.useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [open, items, loading]);

  const handleDragStart = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (fullScreen) return;
      didDragRef.current = false;
      const w = typeof window === "undefined" ? 0 : window.innerWidth;
      const h = typeof window === "undefined" ? 0 : window.innerHeight;
      const startLeft =
        position?.left ?? Math.max(0, w - (open ? PANEL_W : BUTTON_W) - MARGIN);
      const startTop =
        position?.top ?? Math.max(0, h - (open ? PANEL_H : BUTTON_H) - MARGIN);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft,
        startTop,
      };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        didDragRef.current = true;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        setPosition({
          left: Math.max(0, dragRef.current.startLeft + dx),
          top: Math.max(0, dragRef.current.startTop + dy),
        });
      };
      const onUp = () => {
        if (!dragRef.current) return;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        dragRef.current = null;
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [fullScreen, open, position?.left, position?.top]
  );

  async function send() {
    const text = message.trim();
    if (!text || loading) return;
    if (text.length > MAX_MESSAGE_CHARS) {
      setError(`Please keep your message under ${MAX_MESSAGE_CHARS} characters.`);
      return;
    }

    setError(null);
    setLoading(true);
    setMessage("");

    const nextItems = [...items, { role: "user", content: text } satisfies ChatItem];
    setItems(nextItems);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: items.map((i) => ({ role: i.role, content: i.content })),
        }),
      });

      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.reply) {
        const msg = typeof data?.error === "string" ? data.error : "Something went wrong.";
        throw new Error(msg);
      }

      setItems((prev) => [...prev, { role: "assistant", content: String(data.reply) }]);
    } catch (e: any) {
      setError(String(e?.message ?? "Request failed."));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (!fullScreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullScreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullScreen]);

  return (
    <div
      style={{
        position: "fixed",
        ...(fullScreen
          ? { left: 0, top: 0, width: "100vw", height: "100vh" }
          : position === null
            ? { right: MARGIN, bottom: MARGIN }
            : { left: position.left, top: position.top }),
        zIndex: 2147483647,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        display: "flex",
        alignItems: fullScreen ? "center" : undefined,
        justifyContent: fullScreen ? "center" : undefined,
      }}
    >
      {!open && (
        <button
          type="button"
          onMouseDown={(e) => {
            if (e.button === 0) handleDragStart(e);
          }}
          onClick={() => {
            if (didDragRef.current) {
              didDragRef.current = false;
              return;
            }
            setOpen(true);
          }}
          style={{
            width: BUTTON_W,
            height: BUTTON_H,
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "#800020",
            color: "white",
            fontWeight: 900,
            cursor: "grab",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          }}
          title="Drag to move · Click to open"
        >
          Need Help?
        </button>
      )}

      {open && (
        <div
          style={{
            width: fullScreen ? "min(480px, 95vw)" : PANEL_W,
            height: fullScreen ? "85vh" : PANEL_H,
            maxHeight: fullScreen ? "900px" : undefined,
            background: "white",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            boxShadow: fullScreen ? "0 24px 60px rgba(0,0,0,0.35)" : "0 18px 50px rgba(0,0,0,0.28)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            onMouseDown={(e) => {
              if (e.button === 0 && !fullScreen) handleDragStart(e);
            }}
            style={{
              padding: "12px 12px",
              background: "#800020",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              cursor: fullScreen ? "default" : "grab",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1.1 }}>CSUN Help</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>{DISCLAIMER}</div>
            </div>

            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setFullScreen(!fullScreen)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
                aria-label={fullScreen ? "Exit full screen" : "Full screen"}
                title={fullScreen ? "Exit full screen" : "Full screen"}
              >
                {fullScreen ? "⊟" : "⊞"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            style={{
              flex: 1,
              padding: 12,
              overflowY: "auto",
              background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
            }}
          >
            {items.map((it, idx) => {
              const isUser = it.role === "user";
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      whiteSpace: "pre-line",
                      background: isUser ? "#800020" : "white",
                      color: isUser ? "white" : "rgba(0,0,0,0.86)",
                      border: isUser ? "none" : "1px solid rgba(0,0,0,0.10)",
                    }}
                  >
                    {it.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "white",
                    color: "rgba(0,0,0,0.7)",
                    border: "1px solid rgba(0,0,0,0.10)",
                  }}
                >
                  Typing…
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: 12, borderTop: "1px solid rgba(0,0,0,0.08)", background: "white" }}>
            {error && (
              <div
                style={{
                  marginBottom: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(220,38,38,0.35)",
                  background: "rgba(220,38,38,0.06)",
                  color: "rgba(153,27,27,0.95)",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(0,0,0,0.65)" }}>
                Email Agent instead:
              </span>
              <EmailAgentButton label="Open email" />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a CSUN question…"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.15)",
                  padding: "0 10px",
                  outline: "none",
                }}
              />

              <button
                type="button"
                onClick={() => void send()}
                disabled={loading || !message.trim()}
                style={{
                  width: 88,
                  height: 40,
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: loading || !message.trim() ? "rgba(0,0,0,0.08)" : "#800020",
                  color: loading || !message.trim() ? "rgba(0,0,0,0.35)" : "white",
                  fontWeight: 900,
                  cursor: loading || !message.trim() ? "not-allowed" : "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

