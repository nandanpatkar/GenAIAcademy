import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from './AuthContext';

// ─── Defaults ────────────────────────────────────────────────────────────────
export const THEME_DEFAULTS = {
  theme: 'dark',
  accentColor: '#00ff88',
  fontFamily: 'syne',
  headingFontFamily: 'system-ui',
  monoFontFamily: 'jetbrains-mono',
  fontSize: 'md',
  borderRadius: 'rounded',
  themePalette: 'obsidian',
  bgPattern: 'solid',
  panelStyle: 'glass',
};

// ─── System Theme Palettes ────────────────────────────────────────────────────
export const THEME_PALETTES = [
  { key: 'obsidian',  label: 'Obsidian',  desc: 'Default pitch black',  preview: ['#0a0a0c','#111114','#00ff88'] },
  { key: 'dracula',   label: 'Dracula',   desc: 'Purple haze dark',     preview: ['#282a36','#44475a','#bd93f9'] },
  { key: 'nord',      label: 'Nord',      desc: 'Arctic cool blue',     preview: ['#2e3440','#3b4252','#88c0d0'] },
  { key: 'midnight',  label: 'Midnight',  desc: 'Deep blue ocean',      preview: ['#0d1117','#161b22','#58a6ff'] },
  { key: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon city futurism',   preview: ['#0d0d1a','#1a0533','#ff00ff'] },
  { key: 'monokai',   label: 'Monokai',   desc: 'Editor classic dark',  preview: ['#272822','#3e3d32','#a6e22e'] },
  { key: 'synthwave', label: 'Synthwave', desc: 'Retro 80s aesthetic',  preview: ['#1a0533','#2d1b55','#ff79c6'] },
];

// ─── Background Patterns ──────────────────────────────────────────────────────
export const BG_PATTERNS = [
  { key: 'solid', label: 'Solid',   icon: '■', desc: 'Clean flat' },
  { key: 'grid',  label: 'Grid',    icon: '⊞', desc: 'Architect' },
  { key: 'dots',  label: 'Dots',    icon: '⠿', desc: 'Matrix' },
  { key: 'noise', label: 'Noise',   icon: '▒', desc: 'Grain' },
];

// ─── Panel Styles ─────────────────────────────────────────────────────────────
export const PANEL_STYLES = [
  { key: 'solid', label: 'Solid', desc: 'Opaque panels' },
  { key: 'glass', label: 'Glass', desc: 'Frosted blur' },
];

// ─── Font maps ────────────────────────────────────────────────────────────────
export const FONT_MAP = {
  syne:           { css: "'Syne', sans-serif",          url: null }, // already loaded
  inter:          { css: "'Inter', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
  outfit:         { css: "'Outfit', sans-serif",          url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap' },
  'space-grotesk':{ css: "'Space Grotesk', sans-serif",  url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap' },
  'jetbrains-mono':{ css: "'JetBrains Mono', monospace", url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap' },
  'fira-code':    { css: "'Fira Code', monospace",      url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap' },
  'system-ui':    { css: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", url: null },
};

export const FONT_SIZE_MAP = {
  sm: '12px',
  md: '14px',
  lg: '16px',
};

export const RADIUS_MAP = {
  sharp:   '4px',
  rounded: '8px',
  pill:    '20px',
};

// ─── Accent colours preset palette ────────────────────────────────────────────
export const ACCENT_PRESETS = [
  { name: 'Emerald Pulse', hex: '#00ff88' },
  { name: 'Cobalt Flow',   hex: '#0088ff' },
  { name: 'Violet Surge',  hex: '#8b5cf6' },
  { name: 'Rose Fire',     hex: '#f43f5e' },
  { name: 'Amber Glow',    hex: '#f59e0b' },
  { name: 'Cyan Arc',      hex: '#06b6d4' },
  { name: 'Lime Shock',    hex: '#84cc16' },
  { name: 'Orange Flare',  hex: '#f97316' },
  { name: 'Pink Neon',     hex: '#ec4899' },
  { name: 'Teal Pulse',    hex: '#14b8a6' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Inject a <link> for the given Google Font URL if not already in the DOM */
function loadGoogleFont(url) {
  if (!url) return;
  const exists = document.head.querySelector(`link[href="${url}"]`);
  if (!exists) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
}

/** Hex → rgba helper for --neon-dim */
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return {
    rgb: `${r}, ${g}, ${b}`,
    rgba: `rgba(${r},${g},${b},${alpha})`
  };
}

/** Apply all appearance values to the DOM via CSS variables */
function applyThemeToDOM({ theme, accentColor, fontFamily, headingFontFamily, monoFontFamily, fontSize, borderRadius, themePalette, bgPattern, panelStyle }) {
  const root = document.documentElement;

  // Build body class list: base theme + palette + bg pattern + panel style
  const paletteClass = (themePalette && themePalette !== 'obsidian') ? `palette-${themePalette}` : '';
  const patternClass = (bgPattern && bgPattern !== 'solid') ? `bg-${bgPattern}` : '';
  const panelClass   = panelStyle === 'glass' ? 'panel-glass' : '';
  const classes = [`${theme}-theme`, paletteClass, patternClass, panelClass].filter(Boolean).join(' ');
  document.body.className = classes;

  // Accent
  const neonValues = hexToRgba(accentColor, 0.15);
  root.style.setProperty('--neon', accentColor);
  root.style.setProperty('--neon-dim', neonValues.rgba);
  root.style.setProperty('--neon-rgb', neonValues.rgb);

  // Body Font
  const fontEntry = FONT_MAP[fontFamily] || FONT_MAP.syne;
  loadGoogleFont(fontEntry.url);
  root.style.setProperty('--font', fontEntry.css);
  root.style.setProperty('--font-body', fontEntry.css); // alias

  // Heading / UI Font
  const headingFontEntry = FONT_MAP[headingFontFamily] || FONT_MAP['system-ui'];
  loadGoogleFont(headingFontEntry.url);
  root.style.setProperty('--font-heading', headingFontEntry.css);
  root.style.setProperty('--font-header', headingFontEntry.css); // alias for Community.css

  // Mono Font
  const monoFontEntry = FONT_MAP[monoFontFamily] || FONT_MAP['jetbrains-mono'];
  loadGoogleFont(monoFontEntry.url);
  root.style.setProperty('--font-mono', monoFontEntry.css);
  root.style.setProperty('--mono', monoFontEntry.css); // alias

  // Font size
  root.style.setProperty('--font-size-base', FONT_SIZE_MAP[fontSize] || '14px');

  // Border radius
  root.style.setProperty('--radius', RADIUS_MAP[borderRadius] || '8px');
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext({});
export const useTheme = () => useContext(ThemeContext);

// ─── Local-storage key ───────────────────────────────────────────────────────
const LS_KEY = 'genai_appearance';

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...THEME_DEFAULTS, ...JSON.parse(raw) };
  } catch (_) {}
  return { ...THEME_DEFAULTS };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();

  const [appearance, setAppearance] = useState(() => loadFromLocalStorage());

  // Sync from Supabase when user is known
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('user_curriculum')
          .select('paths_data')
          .eq('id', user.id)
          .single();
        if (data?.paths_data?.appearance) {
          const remote = { ...THEME_DEFAULTS, ...data.paths_data.appearance };
          setAppearance(remote);
          localStorage.setItem(LS_KEY, JSON.stringify(remote));
        }
      } catch (_) {}
    })();
  }, [user]);

  // Apply to DOM whenever appearance changes
  useEffect(() => {
    applyThemeToDOM(appearance);
  }, [appearance]);

  /** Persist to localStorage + Supabase, then update state */
  const updateAppearance = useCallback(async (partial) => {
    const next = { ...appearance, ...partial };
    setAppearance(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));

    if (user) {
      try {
        // Merge into paths_data without overwriting roadmap data
        const { data } = await supabase
          .from('user_curriculum')
          .select('paths_data')
          .eq('id', user.id)
          .single();
        const existing = data?.paths_data || {};
        await supabase
          .from('user_curriculum')
          .upsert({
            id: user.id,
            paths_data: { ...existing, appearance: next },
            updated_at: new Date().toISOString(),
          });
      } catch (e) {
        console.warn('ThemeContext: Supabase sync failed', e);
      }
    }
  }, [appearance, user]);

  /** Convenience: toggle dark / light only */
  const toggleTheme = useCallback(() => {
    updateAppearance({ theme: appearance.theme === 'dark' ? 'light' : 'dark' });
  }, [appearance.theme, updateAppearance]);

  /** Hard-reset all appearance to defaults */
  const resetAppearance = useCallback(async () => {
    setAppearance({ ...THEME_DEFAULTS });
    localStorage.setItem(LS_KEY, JSON.stringify(THEME_DEFAULTS));

    if (user) {
      try {
        const { data } = await supabase
          .from('user_curriculum')
          .select('paths_data')
          .eq('id', user.id)
          .single();
        const existing = data?.paths_data || {};
        await supabase
          .from('user_curriculum')
          .upsert({
            id: user.id,
            paths_data: { ...existing, appearance: THEME_DEFAULTS },
            updated_at: new Date().toISOString(),
          });
      } catch (e) {
        console.warn('ThemeContext: reset Supabase sync failed', e);
      }
    }
  }, [user]);

  const value = {
    ...appearance,
    updateAppearance,
    toggleTheme,
    resetAppearance,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
