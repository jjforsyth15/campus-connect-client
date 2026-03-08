import React, { useMemo, useState, useEffect } from "react";

type TextMode = "auto" | "light" | "dark";

function hexToLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const srgb = [r, g, b].map(c => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function autoTextModeFromHex(hex: string): TextMode {
  const lum = hexToLuminance(hex);
  return lum < 0.5 ? "light" : "dark";
}

type Club = {
  id?: string;
  name?: string;
  themeColor?: string;
  textMode?: TextMode;
};

export default function ClubEditPage(props: { initialClub?: Club; onSave?: (payload: Club) => Promise<any> }) {
  const { initialClub = {}, onSave } = props;

  const [themeColor, setThemeColor] = useState<string>(initialClub.themeColor ?? "#1d4ed8");
  const [textMode, setTextMode] = useState<TextMode>(initialClub.textMode ?? "auto");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const effectiveTextMode = useMemo(() => {
    return textMode === "auto" ? autoTextModeFromHex(themeColor) : textMode;
  }, [textMode, themeColor]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload: Club = {
      ...initialClub,
      themeColor,
      textMode,
    };
    try {
      if (onSave) {
        await onSave(payload);
      } else {
        // fallback: just simulate save
        console.log("Saving payload", payload);
      }
      setMessage("Saved");
    } catch (err) {
      console.error(err);
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} style={{ maxWidth: 720, padding: 12 }}>
      <h2>Club settings</h2>

      <div className="theme-box" style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="themeColor">Theme color</label>
          <input
            id="themeColor"
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            style={{ width: 56, height: 36, border: "none", background: "transparent" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="textMode">Text mode</label>
          <select id="textMode" value={textMode} onChange={(e) => setTextMode(e.target.value as TextMode)} aria-label="Text color mode">
            <option value="auto">Auto (choose best contrast)</option>
            <option value="light">Light text</option>
            <option value="dark">Dark text</option>
          </select>
        </div>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 12, marginBottom: 6 }}>
            <small>
              Preview: background <code>{themeColor}</code> with <strong>{effectiveTextMode}</strong> text.
            </small>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 80, height: 40, background: themeColor, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
              <span style={{ color: effectiveTextMode === "light" ? "#ffffff" : "#111111", fontWeight: 600 }}>Aa</span>
            </div>
            <button type="button" onClick={() => { setThemeColor("#1d4ed8"); setTextMode("auto"); }}>Reset</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        {message && <span style={{ marginLeft: 12 }}>{message}</span>}
      </div>
    </form>
  );
}
