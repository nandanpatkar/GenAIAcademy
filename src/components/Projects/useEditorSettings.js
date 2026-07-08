/**
 * useEditorSettings.js — persisted Monaco editor preferences.
 *
 * Stored in localStorage so they survive reloads without a schema change.
 */
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ide-editor-settings';

export const DEFAULT_SETTINGS = {
  fontSize: 13,
  tabSize: 4,
  wordWrap: 'off',   // 'off' | 'on'
  minimap: true,
  lineNumbers: 'on', // 'on' | 'off' | 'relative'
  theme: 'vs-dark',  // 'vs-dark' | 'hc-black' | 'vs'
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

// Simple cross-instance sync so both editor and settings popover stay in step.
const listeners = new Set();

export function useEditorSettings() {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    const l = (s) => setSettings(s);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const update = useCallback((patch) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      listeners.forEach(l => l(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS)); } catch {}
    listeners.forEach(l => l({ ...DEFAULT_SETTINGS }));
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  return { settings, update, reset };
}

// Merge persisted settings into a Monaco options object.
export const applySettings = (base, s) => ({
  ...base,
  fontSize: s.fontSize,
  tabSize: s.tabSize,
  wordWrap: s.wordWrap,
  minimap: { ...(base.minimap || {}), enabled: s.minimap },
  lineNumbers: s.lineNumbers,
  theme: s.theme,
});
