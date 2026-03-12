// =============================================================================
// utils/injectStyles.ts
// =============================================================================

export const GLOBAL_CSS = `
  /* -- Google Fonts --------------------------------------------------------- */
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  /* -- Reset ---------------------------------------------------------------- */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-font-smoothing: antialiased; }
  button { font-family: var(--font-body); cursor: pointer; border: none; background: none; }
  textarea, input, select { font-family: var(--font-body); }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }

  /* -- Override globals.css body background --------------------------------- */
  html, body {
    background-color: var(--bg) !important;
    color: var(--text1) !important;
  }

  /* -- CSS custom properties (design tokens) ------------------------------- */
  :root {
    --red:         #D22030;
    --red-dark:    #A5182A;
    --red-light:   #FDECEA;
    --red-muted:   rgba(210,32,48,0.07);
    --red-glow:    0 4px 22px rgba(210,32,48,0.28);

    --bg:          #F2F4F8;
    --bg-card:     #FFFFFF;
    --bg-card-rgb: 255,255,255;
    --bg-hover:    #F5F7FA;
    --bg-input:    #F0F2F6;
    --bg-elevated: #FFFFFF;

    --border:      #E2E5EB;
    --border-hard: #CDD1DA;

    --text1:       #0F1117;
    --text2:       #525A6A;
    --text3:       #8C95A3;

    --blue:        #1D6EE8;
    --green:       #0A9E6B;
    --amber:       #D97706;
    --purple:      #7B38ED;

    --shadow-sm:   0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md:   0 2px 6px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
    --shadow-lg:   0 4px 12px rgba(0,0,0,0.05), 0 12px 40px rgba(0,0,0,0.10);
    --shadow-xl:   0 8px 24px rgba(0,0,0,0.06), 0 24px 60px rgba(0,0,0,0.14);

    --r-sm:   8px;
    --r-md:   14px;
    --r-lg:   20px;
    --r-xl:   26px;
    --r-full: 9999px;

    --ease:   cubic-bezier(0.4, 0, 0.2, 1);
    --spring: cubic-bezier(0.34, 1.56, 0.64, 1);

    --font-head: 'Sora', system-ui, sans-serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
  }

  /* -- Scrollbar ------------------------------------------------------------ */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-hard); border-radius: var(--r-full); }
  ::-webkit-scrollbar-thumb:hover { background: var(--text3); }

  /* -- Keyframe animations -------------------------------------------------- */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
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
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: translateX(0); }
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
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.5; }
  }

  /* -- Utility classes ------------------------------------------------------ */
  .anim-fade-up  { animation: fadeUp  0.32s var(--ease)   both; }
  .anim-scale-in { animation: scaleIn 0.22s var(--spring) both; }

  .feed-card:nth-child(1) { animation-delay: 0.00s; }
  .feed-card:nth-child(2) { animation-delay: 0.04s; }
  .feed-card:nth-child(3) { animation-delay: 0.06s; }
  .feed-card:nth-child(4) { animation-delay: 0.08s; }
  .feed-card:nth-child(5) { animation-delay: 0.10s; }
  .feed-card:nth-child(n+6) { animation-delay: 0.12s; }

  .img-shimmer {
    background: linear-gradient(90deg, #f5e3e9 25%, #eacdd5 50%, #f5e3e9 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite linear;
  }
`;

export function injectGlobalStyles(): void {
  const TAG_ID = 'mc-global-styles';
  if (document.getElementById(TAG_ID)) return;
  const el = document.createElement('style');
  el.id = TAG_ID;
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}

export function applyTheme(theme: 'system' | 'light' | 'dark'): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  const root = document.documentElement;

  if (isDark) {
    root.style.setProperty('--bg',          '#0F1117');
    root.style.setProperty('--bg-card',     '#1A1D27');
    root.style.setProperty('--bg-card-rgb', '26,29,39');
    root.style.setProperty('--bg-hover',    '#232737');
    root.style.setProperty('--bg-input',    '#1E2130');
    root.style.setProperty('--bg-elevated', '#22253A');
    root.style.setProperty('--border',      '#2C3045');
    root.style.setProperty('--border-hard', '#3A3F58');
    root.style.setProperty('--text1',       '#F0F2F8');
    root.style.setProperty('--text2',       '#9BA3BA');
    root.style.setProperty('--text3',       '#5C6480');
    root.style.setProperty('--red-muted',   'rgba(210,32,48,0.12)');
    root.style.setProperty('--red-light',   'rgba(210,32,48,0.15)');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.style.setProperty('--bg',          '#F2F4F8');
    root.style.setProperty('--bg-card',     '#FFFFFF');
    root.style.setProperty('--bg-card-rgb', '255,255,255');
    root.style.setProperty('--bg-hover',    '#F5F7FA');
    root.style.setProperty('--bg-input',    '#F0F2F6');
    root.style.setProperty('--bg-elevated', '#FFFFFF');
    root.style.setProperty('--border',      '#E2E5EB');
    root.style.setProperty('--border-hard', '#CDD1DA');
    root.style.setProperty('--text1',       '#0F1117');
    root.style.setProperty('--text2',       '#525A6A');
    root.style.setProperty('--text3',       '#8C95A3');
    root.style.setProperty('--red-muted',   'rgba(210,32,48,0.07)');
    root.style.setProperty('--red-light',   '#FDECEA');
    root.setAttribute('data-theme', 'light');
  }
}
