// =============================================================================
// utils/injectStyles.ts
//
// Injects the global CSS string into <head> exactly once at app mount.
// Keeps all global styles out of component files — one place to find them.
//
// Usage: call injectGlobalStyles() inside a useEffect with [] in the root
// component.
// =============================================================================

export const GLOBAL_CSS = `
  /* ── Google Fonts ── */
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-font-smoothing: antialiased; }
  button { font-family: var(--font-body); cursor: pointer; border: none; background: none; }
  textarea, input, select { font-family: var(--font-body); }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }

  /* ── CSS custom properties (from tokens.ts) ── */
  :root {
    --red:        #D22030;
    --red-dark:   #A5182A;
    --red-light:  #FDECEA;
    --red-muted:  rgba(210,32,48,0.07);
    --red-glow:   0 4px 22px rgba(210,32,48,0.28);
    --bg:         #EEF0F4;
    --bg-card:    #FFFFFF;
    --bg-hover:   #F8F9FB;
    --bg-input:   #F3F5F8;
    --border:     #E3E6EC;
    --border-hard:#CDD1DA;
    --text1:      #0F1117;
    --text2:      #525A6A;
    --text3:      #8C95A3;
    --blue:       #1D6EE8;
    --green:      #0A9E6B;
    --amber:      #D97706;
    --purple:     #7B38ED;
    --shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:  0 4px 18px rgba(0,0,0,0.08);
    --shadow-lg:  0 14px 44px rgba(0,0,0,0.13);
    --shadow-xl:  0 24px 64px rgba(0,0,0,0.18);
    --r-sm:       8px;
    --r-md:       14px;
    --r-lg:       20px;
    --r-xl:       26px;
    --r-full:     9999px;
    --ease:       cubic-bezier(0.4, 0, 0.2, 1);
    --spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
    --font-head:  'Sora', system-ui, sans-serif;
    --font-body:  'DM Sans', system-ui, sans-serif;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-hard); border-radius: var(--r-full); }
  ::-webkit-scrollbar-thumb:hover { background: var(--text3); }

  /* ── Keyframe animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  @keyframes heartPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.35); }
    70%  { transform: scale(0.90); }
    100% { transform: scale(1); }
  }
  @keyframes notifDot {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.3); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Utility classes ── */
  .anim-fade-up { animation: fadeUp 0.3s var(--ease) both; }
  .anim-scale-in { animation: scaleIn 0.22s var(--spring) both; }

  /* Stagger delays for feed cards */
  .feed-card:nth-child(1) { animation-delay: 0.00s; }
  .feed-card:nth-child(2) { animation-delay: 0.04s; }
  .feed-card:nth-child(3) { animation-delay: 0.08s; }
  .feed-card:nth-child(4) { animation-delay: 0.12s; }
  .feed-card:nth-child(5) { animation-delay: 0.16s; }
  .feed-card:nth-child(n+6) { animation-delay: 0.20s; }

  /* Image shimmer skeleton */
  .img-shimmer {
    background: linear-gradient(90deg, #f0f2f5 25%, #e8eaed 50%, #f0f2f5 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite linear;
  }
`;

/** Call once at app root — idempotent, safe to call multiple times */
export function injectGlobalStyles(): void {
  const TAG_ID = 'mc-global-styles';
  if (document.getElementById(TAG_ID)) return;
  const el = document.createElement('style');
  el.id = TAG_ID;
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}
