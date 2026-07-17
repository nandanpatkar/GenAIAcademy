import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, Palette, Type, Sliders, Circle, Layers, Grid, Wind } from 'lucide-react';
import { useTheme, ACCENT_PRESETS, FONT_MAP, THEME_DEFAULTS, THEME_PALETTES, BG_PATTERNS, PANEL_STYLES } from '../contexts/ThemeContext';
import '../styles/AppearanceSettings.css';

const FONT_OPTIONS = [
  { key: 'syne',            label: 'Syne',           sample: 'AaBbCc 123', desc: 'Default — Geometric' },
  { key: 'inter',           label: 'Inter',          sample: 'AaBbCc 123', desc: 'Clean — Readable' },
  { key: 'outfit',          label: 'Outfit',         sample: 'AaBbCc 123', desc: 'Modern — Friendly' },
  { key: 'space-grotesk',   label: 'Space Grotesk',  sample: 'AaBbCc 123', desc: 'Tech — Unique' },
  { key: 'system-ui',       label: 'System UI',      sample: 'AaBbCc 123', desc: 'OS Default — Native' },
];

const MONO_FONT_OPTIONS = [
  { key: 'jetbrains-mono',  label: 'JetBrains', sample: '0Oo 1Il', desc: 'Developer default' },
  { key: 'fira-code',       label: 'Fira Code', sample: '0Oo 1Il', desc: 'Ligature rich' },
];

const SIZE_OPTIONS = [
  { key: 'sm', label: 'S', tooltip: 'Compact (12px)' },
  { key: 'md', label: 'M', tooltip: 'Default (14px)' },
  { key: 'lg', label: 'L', tooltip: 'Comfortable (16px)' },
];

const RADIUS_OPTIONS = [
  { key: 'sharp',   label: 'Sharp',   icon: '■' },
  { key: 'rounded', label: 'Rounded', icon: '◼' },
  { key: 'pill',    label: 'Pill',    icon: '⬤' },
];

export default function AppearanceSettings({ onClose }) {
  const { theme, accentColor, fontFamily, headingFontFamily, monoFontFamily, fontSize, borderRadius, themePalette, bgPattern, panelStyle, updateAppearance, toggleTheme, resetAppearance } = useTheme();
  const [customColor, setCustomColor] = useState(accentColor);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    } else {
      resetAppearance();
      setResetConfirm(false);
      setCustomColor(THEME_DEFAULTS.accentColor);
    }
  };

  const handleCustomColorChange = (hex) => {
    setCustomColor(hex);
    updateAppearance({ accentColor: hex });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="appearance-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="appearance-panel"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* ── Header ── */}
          <div className="ap-header">
            <div className="ap-header-left">
              <div className="ap-header-icon">
                <Palette size={16} />
              </div>
              <div>
                <div className="ap-title">Appearance</div>
                <div className="ap-subtitle">Customize your workspace theme</div>
              </div>
            </div>
            <button className="ap-close" onClick={onClose} title="Close">
              <X size={14} />
            </button>
          </div>

          {/* ── Live Preview Strip ── */}
          <div className="ap-preview">
            <div className="ap-preview-label">PREVIEW</div>
            <div className="ap-preview-row">
              <button className="ap-preview-btn ap-preview-btn--primary">Get Started</button>
              <button className="ap-preview-btn ap-preview-btn--ghost">Learn More</button>
              <span className="ap-preview-badge">Beta</span>
              <span className="ap-preview-text">The quick brown fox jumps.</span>
            </div>
          </div>

          <div className="ap-body">

            {/* ── System Theme Palette ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Layers size={12} />
                <span>System Theme</span>
              </div>
              <div className="ap-palette-grid">
                {/* Light mode card */}
                <button
                  className={`ap-palette-card ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => { if (theme !== 'light') { toggleTheme(); } }}
                  title="Light"
                >
                  <div className="ap-palette-swatches">
                    <span style={{ background: '#fcfcfc' }} />
                    <span style={{ background: '#ebebf0' }} />
                    <span style={{ background: '#00cc66' }} />
                  </div>
                  <div className="ap-palette-meta">
                    <span className="ap-palette-name">Light</span>
                    <span className="ap-palette-desc">Bright & clean</span>
                  </div>
                  {theme === 'light' && <Check size={11} className="ap-check" />}
                </button>

                {/* Dark palette cards */}
                {THEME_PALETTES.map(p => (
                  <button
                    key={p.key}
                    className={`ap-palette-card ${
                      theme === 'dark' && themePalette === p.key ? 'active' : ''
                    }`}
                    onClick={() => {
                      if (theme !== 'dark') {
                        updateAppearance({ theme: 'dark', themePalette: p.key });
                      } else {
                        updateAppearance({ themePalette: p.key });
                      }
                    }}
                    title={p.label}
                  >
                    <div className="ap-palette-swatches">
                      {p.preview.map((c, i) => <span key={i} style={{ background: c }} />)}
                    </div>
                    <div className="ap-palette-meta">
                      <span className="ap-palette-name">{p.label}</span>
                      <span className="ap-palette-desc">{p.desc}</span>
                    </div>
                    {theme === 'dark' && themePalette === p.key && <Check size={11} className="ap-check" />}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Accent Colour ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Palette size={12} />
                <span>Accent Color</span>
              </div>
              <div className="ap-color-grid">
                {ACCENT_PRESETS.map(preset => (
                  <button
                    key={preset.hex}
                    className={`ap-color-swatch ${accentColor === preset.hex ? 'active' : ''}`}
                    style={{
                      '--swatch-color': preset.hex,
                      background: preset.hex,
                      boxShadow: accentColor === preset.hex ? `0 0 12px ${preset.hex}80, 0 0 0 2px var(--bg), 0 0 0 3.5px ${preset.hex}` : 'none',
                    }}
                    title={preset.name}
                    onClick={() => { updateAppearance({ accentColor: preset.hex }); setCustomColor(preset.hex); }}
                  >
                    {accentColor === preset.hex && <Check size={10} style={{ color: '#000' }} />}
                  </button>
                ))}

                {/* Custom colour picker */}
                <label className="ap-color-custom" title="Custom color">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                  />
                  <span className="ap-color-custom-icon" style={{ background: `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)` }} />
                </label>
              </div>
            </section>

            {/* ── Font Family ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Type size={12} />
                <span>Font Family</span>
              </div>
              <div className="ap-font-list">
                {FONT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-font-card ${fontFamily === opt.key ? 'active' : ''}`}
                    onClick={() => updateAppearance({ fontFamily: opt.key })}
                    style={{ fontFamily: FONT_MAP[opt.key]?.css }}
                  >
                    <div className="ap-font-sample">{opt.sample}</div>
                    <div className="ap-font-meta">
                      <span className="ap-font-name">{opt.label}</span>
                      <span className="ap-font-desc">{opt.desc}</span>
                    </div>
                    {fontFamily === opt.key && <Check size={12} className="ap-check" />}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Heading / UI Font Family ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Type size={12} />
                <span>Heading / UI Font</span>
              </div>
              <div className="ap-font-list">
                {FONT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-font-card ${headingFontFamily === opt.key ? 'active' : ''}`}
                    onClick={() => updateAppearance({ headingFontFamily: opt.key })}
                    style={{ fontFamily: FONT_MAP[opt.key]?.css }}
                  >
                    <div className="ap-font-sample">{opt.sample}</div>
                    <div className="ap-font-meta">
                      <span className="ap-font-name">{opt.label}</span>
                      <span className="ap-font-desc">{opt.desc}</span>
                    </div>
                    {headingFontFamily === opt.key && <Check size={12} className="ap-check" />}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Monospace / Code Font ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Type size={12} />
                <span>Monospace / Code Font</span>
              </div>
              <div className="ap-font-list">
                {MONO_FONT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-font-card ${monoFontFamily === opt.key ? 'active' : ''}`}
                    onClick={() => updateAppearance({ monoFontFamily: opt.key })}
                    style={{ fontFamily: FONT_MAP[opt.key]?.css }}
                  >
                    <div className="ap-font-sample">{opt.sample}</div>
                    <div className="ap-font-meta">
                      <span className="ap-font-name">{opt.label}</span>
                      <span className="ap-font-desc">{opt.desc}</span>
                    </div>
                    {monoFontFamily === opt.key && <Check size={12} className="ap-check" />}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Font Size ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Sliders size={12} />
                <span>Font Size</span>
              </div>
              <div className="ap-toggle-row">
                {SIZE_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-toggle-btn ${fontSize === opt.key ? 'active' : ''}`}
                    title={opt.tooltip}
                    onClick={() => updateAppearance({ fontSize: opt.key })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Border Radius ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <div style={{ width: 12, height: 12, border: '1.5px solid currentColor', borderRadius: 3 }} />
                <span>Corner Style</span>
              </div>
              <div className="ap-toggle-row">
                {RADIUS_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-toggle-btn ${borderRadius === opt.key ? 'active' : ''}`}
                    title={opt.label}
                    onClick={() => updateAppearance({ borderRadius: opt.key })}
                  >
                    <span className="ap-radius-icon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Background Pattern ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Grid size={12} />
                <span>Background Pattern</span>
              </div>
              <div className="ap-toggle-row">
                {BG_PATTERNS.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-toggle-btn ap-pattern-btn ${bgPattern === opt.key ? 'active' : ''}`}
                    title={opt.desc}
                    onClick={() => updateAppearance({ bgPattern: opt.key })}
                  >
                    <span className="ap-pattern-icon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Panel Material ── */}
            <section className="ap-section">
              <div className="ap-section-header">
                <Wind size={12} />
                <span>Panel Material</span>
              </div>
              <div className="ap-toggle-row">
                {PANEL_STYLES.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-toggle-btn ${panelStyle === opt.key ? 'active' : ''}`}
                    title={opt.desc}
                    onClick={() => updateAppearance({ panelStyle: opt.key })}
                  >
                    {opt.key === 'glass' && <span style={{ fontSize: 10 }}>✦</span>}
                    <span>{opt.label}</span>
                    {panelStyle === opt.key && <Check size={10} className="ap-check" style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* ── Footer ── */}
          <div className="ap-footer">
            <button
              className={`ap-reset-btn ${resetConfirm ? 'confirm' : ''}`}
              onClick={handleReset}
            >
              <RotateCcw size={12} className={resetConfirm ? 'spin' : ''} />
              <span>{resetConfirm ? 'Confirm Reset' : 'Reset to Defaults'}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
