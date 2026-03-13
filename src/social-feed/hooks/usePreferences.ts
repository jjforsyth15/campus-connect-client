// =============================================================================
// hooks/usePreferences.ts
//
// Reads and writes UserPreferences to localStorage.
// Returns current prefs and a stable update function.
// Components never touch localStorage directly.
// =============================================================================

import { useState, useCallback } from 'react';
import type { UserPreferences } from '../types';
import { DEFAULT_PREFERENCES } from '../types';

const LS_KEY = 'mc_preferences_v1';

function load(): UserPreferences {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function usePreferences() {
  const [prefs, setPrefsState] = useState<UserPreferences>(load);

  const setPrefs = useCallback((next: Partial<UserPreferences>) => {
    setPrefsState(prev => {
      const updated = { ...prev, ...next };
      try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefsState(DEFAULT_PREFERENCES);
    try { localStorage.removeItem(LS_KEY); } catch {}
  }, []);

  return { prefs, setPrefs, resetPrefs };
}
