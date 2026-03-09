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
  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-hard); border-radius: var(--r-full); }
  ::-webkit-scrollbar-thumb:hover { background: var(--text3); }

  /* ── Utility animation classes ── */
  .anim-fade-up  { animation: fadeUp  0.3s var(--ease)   both; }
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

/**
 * Apply a theme by swapping CSS custom properties on :root.
 * Called whenever prefs.theme changes.
 */
export function applyTheme(theme: 'system' | 'light' | 'dark'): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  const root = document.documentElement;
  if (isDark) {
    root.style.setProperty('--bg',         '#0F1117');
    root.style.setProperty('--bg-card',    '#1A1D27');
    root.style.setProperty('--bg-hover',   '#232737');
    root.style.setProperty('--bg-input',   '#1E2130');
    root.style.setProperty('--border',     '#2C3045');
    root.style.setProperty('--border-hard','#3A3F58');
    root.style.setProperty('--text1',      '#F0F2F8');
    root.style.setProperty('--text2',      '#9BA3BA');
    root.style.setProperty('--text3',      '#5C6480');
    root.style.setProperty('--red-muted',  'rgba(210,32,48,0.12)');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.style.setProperty('--bg',         '#EEF0F4');
    root.style.setProperty('--bg-card',    '#FFFFFF');
    root.style.setProperty('--bg-hover',   '#F8F9FB');
    root.style.setProperty('--bg-input',   '#F3F5F8');
    root.style.setProperty('--border',     '#E3E6EC');
    root.style.setProperty('--border-hard','#CDD1DA');
    root.style.setProperty('--text1',      '#0F1117');
    root.style.setProperty('--text2',      '#525A6A');
    root.style.setProperty('--text3',      '#8C95A3');
    root.style.setProperty('--red-muted',  'rgba(210,32,48,0.07)');
    root.setAttribute('data-theme', 'light');
  }
}
