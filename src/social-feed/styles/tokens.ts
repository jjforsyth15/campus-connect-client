// =============================================================================
// styles/tokens.ts
//
// Design tokens for Matador Connect.
// All colors, radii, shadows, and motion values live here.
// Components import TOKENS — never hardcode values inline.
//
// These are injected as CSS custom properties once at app mount via
// injectGlobalStyles() in utils/injectStyles.ts.
// =============================================================================

export const TOKENS = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  red:        '#D22030',   // CSUN official red
  redDark:    '#A5182A',
  redLight:   '#FDECEA',
  redMuted:   'rgba(210,32,48,0.07)',
  redGlow:    '0 4px 22px rgba(210,32,48,0.28)',

  // ── Surface ────────────────────────────────────────────────────────────────
  bg:         '#EEF0F4',   // page background
  bgCard:     '#FFFFFF',
  bgHover:    '#F8F9FB',
  bgInput:    '#F3F5F8',

  // ── Border ─────────────────────────────────────────────────────────────────
  border:     '#E3E6EC',
  borderHard: '#CDD1DA',

  // ── Text ───────────────────────────────────────────────────────────────────
  text1:      '#0F1117',   // headings
  text2:      '#525A6A',   // body
  text3:      '#8C95A3',   // muted / timestamps

  // ── Semantic accents ───────────────────────────────────────────────────────
  blue:       '#1D6EE8',
  green:      '#0A9E6B',
  amber:      '#D97706',
  purple:     '#7B38ED',

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadowSm:   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd:   '0 4px 18px rgba(0,0,0,0.08)',
  shadowLg:   '0 14px 44px rgba(0,0,0,0.13)',
  shadowXl:   '0 24px 64px rgba(0,0,0,0.18)',

  // ── Radius ─────────────────────────────────────────────────────────────────
  rSm:   '8px',
  rMd:   '14px',
  rLg:   '20px',
  rXl:   '26px',
  rFull: '9999px',

  // ── Font families ──────────────────────────────────────────────────────────
  fontHead: "'Sora', system-ui, sans-serif",
  fontBody: "'DM Sans', system-ui, sans-serif",

  // ── Motion ─────────────────────────────────────────────────────────────────
  ease:   'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// Tag → accent color map (used for tag badges throughout the feed)
export const TAG_COLOR_MAP: Record<string, string> = {
  AI:          '#7B38ED',
  AR:          '#0891B2',
  Dev:         '#0A9E6B',
  Design:      '#DB2777',
  SRC:         '#EA580C',
  Campus:      '#D22030',
  Marketplace: '#65A30D',
  Ideas:       '#D97706',
  Career:      '#1D6EE8',
  Events:      '#0284C7',
  Clubs:       '#9333EA',
};

export function tagColor(tag: string): string {
  return TAG_COLOR_MAP[tag] ?? '#6B7280';
}
