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
  lineHeight: 'cozy',
  borderRadius: 'rounded',
  themePalette: 'obsidian',
  bgPattern: 'solid',
  panelStyle: 'glass',
  reduceMotion: false,
  highContrast: false,
  scrollbarStyle: 'thin',
  syncWithSystem: false,
};

// ─── System Theme Palettes (dark mode) ────────────────────────────────────────
export const THEME_PALETTES = [
  { key: 'obsidian',      label: 'Obsidian',       desc: 'Default pitch black',   preview: ['#0a0a0c','#111114','#00ff88'] },
  { key: 'dracula',       label: 'Dracula',        desc: 'Purple haze dark',      preview: ['#282a36','#44475a','#bd93f9'] },
  { key: 'nord',          label: 'Nord',           desc: 'Arctic cool blue',      preview: ['#2e3440','#3b4252','#88c0d0'] },
  { key: 'midnight',      label: 'Midnight',       desc: 'Deep blue ocean',       preview: ['#0d1117','#161b22','#58a6ff'] },
  { key: 'cyberpunk',     label: 'Cyberpunk',      desc: 'Neon city futurism',    preview: ['#0d0d1a','#1a0533','#ff00ff'] },
  { key: 'monokai',       label: 'Monokai',        desc: 'Editor classic dark',   preview: ['#272822','#3e3d32','#a6e22e'] },
  { key: 'synthwave',     label: 'Synthwave',      desc: 'Retro 80s aesthetic',   preview: ['#1a0533','#2d1b55','#ff79c6'] },
  { key: 'tokyo-night',   label: 'Tokyo Night',    desc: 'Neon Shibuya skyline',  preview: ['#1a1b26','#292e42','#7aa2f7'] },
  { key: 'gruvbox',       label: 'Gruvbox',        desc: 'Warm retro contrast',   preview: ['#282828','#3c3836','#fe8019'] },
  { key: 'catppuccin',    label: 'Catppuccin Mocha', desc: 'Soothing pastel',     preview: ['#1e1e2e','#313244','#cba6f7'] },
  { key: 'rosepine',      label: 'Rosé Pine',      desc: 'Moody botanical',       preview: ['#191724','#26233a','#c4a7e7'] },
  { key: 'onedark',       label: 'One Dark',       desc: 'Atom editor classic',   preview: ['#282c34','#2c313c','#61afef'] },
  { key: 'solarized-dark',label: 'Solarized Dark', desc: 'Precision low-contrast',preview: ['#002b36','#073642','#268bd2'] },
];

// ─── System Theme Palettes (light mode) ───────────────────────────────────────
export const LIGHT_PALETTES = [
  { key: 'paper',            label: 'Paper',            desc: 'Default bright & clean', preview: ['#fcfcfc','#ebebf0','#00cc66'] },
  { key: 'solarized-light',  label: 'Solarized Light',  desc: 'Precision cream light',  preview: ['#fdf6e3','#eee8d5','#268bd2'] },
  { key: 'sepia',            label: 'Sepia',            desc: 'Warm paper for reading', preview: ['#f4ecd8','#e8dcc0','#b8622d'] },
  { key: 'catppuccin-latte', label: 'Catppuccin Latte', desc: 'Soft pastel daylight',   preview: ['#eff1f5','#e6e9ef','#8839ef'] },
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

// ─── Line height ──────────────────────────────────────────────────────────────
export const LINE_HEIGHTS = [
  { key: 'compact', label: 'Compact', value: '1.35', desc: 'Tight & dense' },
  { key: 'cozy',     label: 'Cozy',    value: '1.6',  desc: 'Default balance' },
  { key: 'relaxed',  label: 'Relaxed', value: '1.85', desc: 'Airy reading' },
];

// ─── Scrollbar style ──────────────────────────────────────────────────────────
export const SCROLLBAR_STYLES = [
  { key: 'thin',    label: 'Thin',    width: 'thin', size: '6px',  desc: 'Minimal' },
  { key: 'classic', label: 'Classic', width: 'auto', size: '14px', desc: 'OS default width' },
];

// ─── Font maps ────────────────────────────────────────────────────────────────
export const FONT_MAP = {
  syne:              { css: "'Syne', sans-serif",             url: null }, // already loaded
  inter:             { css: "'Inter', sans-serif",             url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
  outfit:            { css: "'Outfit', sans-serif",            url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap' },
  'space-grotesk':   { css: "'Space Grotesk', sans-serif",     url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap' },
  poppins:           { css: "'Poppins', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap' },
  manrope:           { css: "'Manrope', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap' },
  sora:              { css: "'Sora', sans-serif",              url: 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap' },
  'dm-sans':         { css: "'DM Sans', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap' },
  'plus-jakarta':    { css: "'Plus Jakarta Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap' },
  lexend:            { css: "'Lexend', sans-serif",            url: 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap' },
  'jetbrains-mono':  { css: "'JetBrains Mono', monospace",     url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap' },
  'fira-code':       { css: "'Fira Code', monospace",          url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap' },
  'ibm-plex-mono':   { css: "'IBM Plex Mono', monospace",      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap' },
  'source-code-pro': { css: "'Source Code Pro', monospace",    url: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700&display=swap' },
  'roboto-mono':     { css: "'Roboto Mono', monospace",        url: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap' },
  'system-ui':       { css: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", url: null },
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

// ─── Curated one-click presets ─────────────────────────────────────────────────
export const APPEARANCE_PRESETS = [
  { key: 'obsidian-neon', name: 'Obsidian Neon', desc: 'The default — pitch black & electric green', preview: ['#0a0a0c','#00ff88'],
    values: { theme: 'dark', themePalette: 'obsidian', accentColor: '#00ff88', fontFamily: 'syne', headingFontFamily: 'system-ui', monoFontFamily: 'jetbrains-mono', borderRadius: 'rounded', bgPattern: 'solid', panelStyle: 'glass', lineHeight: 'cozy' } },
  { key: 'tokyo-nights', name: 'Tokyo Nights', desc: 'Neon skyline blues, grid backdrop', preview: ['#1a1b26','#7aa2f7'],
    values: { theme: 'dark', themePalette: 'tokyo-night', accentColor: '#7aa2f7', fontFamily: 'space-grotesk', headingFontFamily: 'space-grotesk', monoFontFamily: 'jetbrains-mono', borderRadius: 'rounded', bgPattern: 'grid', panelStyle: 'glass', lineHeight: 'cozy' } },
  { key: 'gruvbox-warmth', name: 'Gruvbox Warmth', desc: 'Retro terminal, warm orange accent', preview: ['#282828','#fe8019'],
    values: { theme: 'dark', themePalette: 'gruvbox', accentColor: '#fe8019', fontFamily: 'inter', headingFontFamily: 'inter', monoFontFamily: 'ibm-plex-mono', borderRadius: 'sharp', bgPattern: 'dots', panelStyle: 'solid', lineHeight: 'cozy' } },
  { key: 'rose-garden', name: 'Rosé Garden', desc: 'Moody botanical, soft iris glow', preview: ['#191724','#c4a7e7'],
    values: { theme: 'dark', themePalette: 'rosepine', accentColor: '#c4a7e7', fontFamily: 'outfit', headingFontFamily: 'outfit', monoFontFamily: 'fira-code', borderRadius: 'pill', bgPattern: 'solid', panelStyle: 'glass', lineHeight: 'relaxed' } },
  { key: 'onedark-classic', name: 'One Dark Classic', desc: 'The timeless editor look', preview: ['#282c34','#61afef'],
    values: { theme: 'dark', themePalette: 'onedark', accentColor: '#61afef', fontFamily: 'inter', headingFontFamily: 'system-ui', monoFontFamily: 'jetbrains-mono', borderRadius: 'rounded', bgPattern: 'solid', panelStyle: 'solid', lineHeight: 'cozy' } },
  { key: 'solarized-focus', name: 'Solarized Focus', desc: 'Low-contrast precision for long sessions', preview: ['#002b36','#268bd2'],
    values: { theme: 'dark', themePalette: 'solarized-dark', accentColor: '#268bd2', fontFamily: 'dm-sans', headingFontFamily: 'dm-sans', monoFontFamily: 'source-code-pro', borderRadius: 'rounded', bgPattern: 'solid', panelStyle: 'solid', lineHeight: 'relaxed' } },
  { key: 'sepia-reader', name: 'Sepia Reader', desc: 'Warm paper tones for distraction-free reading', preview: ['#f4ecd8','#b8622d'],
    values: { theme: 'light', themePalette: 'sepia', accentColor: '#b8622d', fontFamily: 'lexend', headingFontFamily: 'lexend', monoFontFamily: 'ibm-plex-mono', borderRadius: 'rounded', bgPattern: 'solid', panelStyle: 'solid', lineHeight: 'relaxed' } },
  { key: 'cyberpunk-rush', name: 'Cyberpunk Rush', desc: 'Magenta neon city futurism', preview: ['#0d0d1a','#ff00ff'],
    values: { theme: 'dark', themePalette: 'cyberpunk', accentColor: '#ff00ff', fontFamily: 'space-grotesk', headingFontFamily: 'space-grotesk', monoFontFamily: 'fira-code', borderRadius: 'pill', bgPattern: 'grid', panelStyle: 'glass', lineHeight: 'compact' } },
  { key: 'accessible-contrast', name: 'Accessible Contrast', desc: 'Maximum legibility & reduced motion', preview: ['#0a0a0c','#ffffff'],
    values: { theme: 'dark', themePalette: 'obsidian', accentColor: '#ffffff', fontFamily: 'system-ui', headingFontFamily: 'system-ui', monoFontFamily: 'roboto-mono', borderRadius: 'sharp', bgPattern: 'solid', panelStyle: 'solid', lineHeight: 'relaxed', highContrast: true, reduceMotion: true } },
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
function applyThemeToDOM({ theme, accentColor, fontFamily, headingFontFamily, monoFontFamily, fontSize, lineHeight, borderRadius, themePalette, bgPattern, panelStyle, reduceMotion, highContrast, scrollbarStyle }) {
  const root = document.documentElement;

  // Build body class list: base theme + palette + bg pattern + panel style + a11y
  const defaultPalette = theme === 'light' ? 'paper' : 'obsidian';
  const paletteClass = (themePalette && themePalette !== defaultPalette) ? `palette-${themePalette}` : '';
  const patternClass = (bgPattern && bgPattern !== 'solid') ? `bg-${bgPattern}` : '';
  const panelClass   = panelStyle === 'glass' ? 'panel-glass' : '';
  const motionClass  = reduceMotion ? 'reduce-motion' : '';
  const contrastClass = highContrast ? 'high-contrast' : '';
  const classes = [`${theme}-theme`, paletteClass, patternClass, panelClass, motionClass, contrastClass].filter(Boolean).join(' ');
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

  // Line height
  const lineHeightEntry = LINE_HEIGHTS.find(l => l.key === lineHeight) || LINE_HEIGHTS[1];
  root.style.setProperty('--line-height-base', lineHeightEntry.value);

  // Border radius
  root.style.setProperty('--radius', RADIUS_MAP[borderRadius] || '8px');

  // Scrollbar
  const scrollbarEntry = SCROLLBAR_STYLES.find(s => s.key === scrollbarStyle) || SCROLLBAR_STYLES[0];
  root.style.setProperty('--scrollbar-width', scrollbarEntry.width);
  root.style.setProperty('--scrollbar-size', scrollbarEntry.size);
  // reduceMotion / highContrast are applied purely via the .reduce-motion / .high-contrast
  // body classes in global.css (with !important) so they reliably win over any active palette.
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext({});
export const useTheme = () => useContext(ThemeContext);

// ─── Local-storage key ───────────────────────────────────────────────────────
const LS_KEY = 'genai_appearance';

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const merged = { ...THEME_DEFAULTS, ...JSON.parse(raw) };
      // Migration: Reduce Motion defaults off — clear any stale persisted `true`.
      if (merged.reduceMotion) {
        merged.reduceMotion = false;
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
      }
      return merged;
    }
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
          // Migration: Reduce Motion defaults off — clear any stale persisted `true`.
          remote.reduceMotion = false;
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

  // Follow OS light/dark preference when syncWithSystem is enabled
  useEffect(() => {
    if (!appearance.syncWithSystem || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystemPref = (matches) => {
      setAppearance(prev => {
        const nextTheme = matches ? 'dark' : 'light';
        if (prev.theme === nextTheme) return prev;
        const next = { ...prev, theme: nextTheme };
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        return next;
      });
    };
    applySystemPref(mql.matches);
    const listener = (e) => applySystemPref(e.matches);
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener);
    };
  }, [appearance.syncWithSystem]);

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

  /** Convenience: toggle dark / light only (manual toggle disables OS sync) */
  const toggleTheme = useCallback(() => {
    updateAppearance({ theme: appearance.theme === 'dark' ? 'light' : 'dark', syncWithSystem: false });
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

  /** Apply a curated preset bundle in one shot */
  const applyPreset = useCallback((presetKey) => {
    const preset = APPEARANCE_PRESETS.find(p => p.key === presetKey);
    if (!preset) return;
    updateAppearance({ ...preset.values, syncWithSystem: false });
  }, [updateAppearance]);

  /** Download the current appearance config as a shareable JSON file */
  const exportAppearanceJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(appearance, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appearance-theme.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [appearance]);

  /** Import a previously exported (or hand-authored) appearance JSON object */
  const importAppearanceJSON = useCallback((raw) => {
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const allowedKeys = Object.keys(THEME_DEFAULTS);
      const sanitized = {};
      allowedKeys.forEach(k => { if (parsed[k] !== undefined) sanitized[k] = parsed[k]; });
      updateAppearance(sanitized);
      return true;
    } catch (e) {
      console.warn('ThemeContext: failed to import appearance JSON', e);
      return false;
    }
  }, [updateAppearance]);

  const value = {
    ...appearance,
    updateAppearance,
    toggleTheme,
    resetAppearance,
    applyPreset,
    exportAppearanceJSON,
    importAppearanceJSON,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
