import React from "react";

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

export default function ClubProfilePage({ club }: { club: Club }) {
  const themeColor = club.themeColor ?? "#1d4ed8";
  const textMode = club.textMode ?? "auto";
  const effectiveText = textMode === "auto" ? autoTextModeFromHex(themeColor) : textMode;
  const rootStyle: React.CSSProperties = {
    backgroundColor: themeColor,
    color: effectiveText === "light" ? "#ffffff" : "#111111",
    minHeight: "200px",
    padding: "24px",
    borderRadius: 8,
  };

  return (
    <div style={rootStyle} className={`club-profile ${effectiveText === "light" ? "text-light" : "text-dark"}`}>
      <h1 style={{ marginTop: 0 }}>{club.name ?? "Club name"}</h1>
      <p>Example content with the chosen text mode applied.</p>
      <div style={{ marginTop: 12 }}>
        <strong>Theme color:</strong> <code>{themeColor}</code> <br />
        <strong>Text mode setting:</strong> {textMode} <br />
        <strong>Resolved text:</strong> {effectiveText}
      </div>
    </div>
  );
}
