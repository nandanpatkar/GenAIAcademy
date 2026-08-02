import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, RotateCcw, Check, Palette, Type, Layers, Grid, Wind, Sparkles,
  Sun, Moon, Monitor, Eye, SlidersHorizontal, Download, Upload, ClipboardCopy,
} from 'lucide-react';
import {
  useTheme, ACCENT_PRESETS, FONT_MAP, THEME_DEFAULTS, THEME_PALETTES, LIGHT_PALETTES,
  BG_PATTERNS, PANEL_STYLES, LINE_HEIGHTS, SCROLLBAR_STYLES, APPEARANCE_PRESETS,
} from '../contexts/ThemeContext';
import '../styles/AppearanceSettings.css';

const FONT_OPTIONS = [
  { key: 'syne',           label: 'Syne',            sample: 'AaBbCc 123', desc: 'Default — Geometric' },
  { key: 'inter',          label: 'Inter',           sample: 'AaBbCc 123', desc: 'Clean — Readable' },
  { key: 'outfit',         label: 'Outfit',          sample: 'AaBbCc 123', desc: 'Modern — Friendly' },
  { key: 'space-grotesk',  label: 'Space Grotesk',   sample: 'AaBbCc 123', desc: 'Tech — Unique' },
  { key: 'poppins',        label: 'Poppins',         sample: 'AaBbCc 123', desc: 'Rounded — Friendly' },
  { key: 'manrope',        label: 'Manrope',         sample: 'AaBbCc 123', desc: 'Balanced — Editorial' },
  { key: 'sora',           label: 'Sora',            sample: 'AaBbCc 123', desc: 'Confident — Modern' },
  { key: 'dm-sans',        label: 'DM Sans',         sample: 'AaBbCc 123', desc: 'Neutral — Versatile' },
  { key: 'plus-jakarta',   label: 'Plus Jakarta',    sample: 'AaBbCc 123', desc: 'Warm — Contemporary' },
  { key: 'lexend',         label: 'Lexend',          sample: 'AaBbCc 123', desc: 'Legible — Reading' },
  { key: 'system-ui',      label: 'System UI',       sample: 'AaBbCc 123', desc: 'OS Default — Native' },
];

const MONO_FONT_OPTIONS = [
  { key: 'jetbrains-mono',  label: 'JetBrains',    sample: '0Oo 1Il', desc: 'Developer default' },
  { key: 'fira-code',       label: 'Fira Code',    sample: '0Oo 1Il', desc: 'Ligature rich' },
  { key: 'ibm-plex-mono',   label: 'IBM Plex',     sample: '0Oo 1Il', desc: 'Technical & crisp' },
  { key: 'source-code-pro', label: 'Source Code',  sample: '0Oo 1Il', desc: 'Adobe classic' },
  { key: 'roboto-mono',     label: 'Roboto Mono',  sample: '0Oo 1Il', desc: 'Neutral & wide' },
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

const TABS = [
  { key: 'presets',       label: 'Presets',        icon: Sparkles },
  { key: 'mode',          label: 'Mode',            icon: Monitor },
  { key: 'palette',       label: 'Color Palette',   icon: Layers },
  { key: 'accent',        label: 'Accent Color',    icon: Palette },
  { key: 'typography',    label: 'Typography',      icon: Type },
  { key: 'layout',        label: 'Layout & Effects',icon: Grid },
  { key: 'accessibility', label: 'Accessibility',   icon: Eye },
  { key: 'advanced',      label: 'Advanced',        icon: SlidersHorizontal },
];

/** Small reusable on/off switch */
function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`ap-switch ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="ap-switch-thumb" />
    </button>
  );
}

/** Live, always-visible mockup that reflects every appearance setting in real time */
function LivePreview() {
  const {
    accentColor, fontFamily, headingFontFamily, monoFontFamily, borderRadius,
    theme, panelStyle,
  } = useTheme();

  return (
    <div className="ap-live-preview">
      <div className="ap-live-preview-label">
        <span className="ap-live-dot" />
        LIVE PREVIEW
      </div>

      <div className="ap-mock-window">
        <div className="ap-mock-titlebar">
          <span /><span /><span />
          <span className="ap-mock-titlebar-text">workspace.app</span>
        </div>

        <div className="ap-mock-body">
          <div className="ap-mock-sidebar">
            {['Dashboard', 'Projects', 'Settings'].map((label, i) => (
              <div key={label} className={`ap-mock-nav-item ${i === 0 ? 'active' : ''}`}>
                <span className="ap-mock-nav-dot" />
                {label}
              </div>
            ))}
          </div>

          <div className="ap-mock-content">
            <div className="ap-mock-heading" style={{ fontFamily: FONT_MAP[headingFontFamily]?.css }}>
              Design your workspace
            </div>
            <div className="ap-mock-paragraph" style={{ fontFamily: FONT_MAP[fontFamily]?.css }}>
              The quick brown fox jumps over the lazy dog — every change here applies instantly across the whole app.
            </div>

            <div className="ap-mock-row">
              <button className="ap-mock-btn ap-mock-btn--primary">Get Started</button>
              <button className="ap-mock-btn ap-mock-btn--ghost">Learn More</button>
              <span className="ap-mock-badge">{theme === 'dark' ? <Moon size={9} /> : <Sun size={9} />} {panelStyle === 'glass' ? 'Glass' : 'Solid'}</span>
            </div>

            <div className="ap-mock-card">
              <div className="ap-mock-card-title">Session Summary</div>
              <div className="ap-mock-code" style={{ fontFamily: FONT_MAP[monoFontFamily]?.css }}>
                const accent = "{accentColor}";
              </div>
            </div>

            <div className="ap-mock-input">Search the workspace…</div>
          </div>
        </div>
      </div>

      <div className="ap-live-preview-hint">
        This mock reflects palette, accent, fonts, radius, background and panel material together.
      </div>
    </div>
  );
}

export default function AppearanceSettings({ onClose }) {
  const {
    theme, accentColor, fontFamily, headingFontFamily, monoFontFamily, fontSize, lineHeight,
    borderRadius, themePalette, bgPattern, panelStyle, reduceMotion, highContrast,
    scrollbarStyle, syncWithSystem,
    updateAppearance, toggleTheme, resetAppearance, applyPreset,
    exportAppearanceJSON, importAppearanceJSON,
  } = useTheme();

  const [activeTab, setActiveTab] = useState('presets');
  const [customColor, setCustomColor] = useState(accentColor);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importMsg, setImportMsg] = useState(null); // { ok: bool, text: string }
  const fileInputRef = useRef(null);

  // Escape to close, lock background scroll while the studio is open
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

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

  const handleExport = () => exportAppearanceJSON();

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importAppearanceJSON(reader.result);
      setImportMsg(ok
        ? { ok: true, text: 'Theme imported successfully.' }
        : { ok: false, text: 'Could not read that file — is it a valid theme JSON?' });
      setTimeout(() => setImportMsg(null), 3500);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyCode = async () => {
    const current = {
      theme, accentColor, fontFamily, headingFontFamily, monoFontFamily, fontSize, lineHeight,
      borderRadius, themePalette, bgPattern, panelStyle, reduceMotion, highContrast,
      scrollbarStyle, syncWithSystem,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(current, null, 2));
      setImportMsg({ ok: true, text: 'Theme code copied to clipboard.' });
    } catch (_) {
      setImportMsg({ ok: false, text: 'Clipboard access was blocked.' });
    }
    setTimeout(() => setImportMsg(null), 3500);
  };

  const activePalettes = theme === 'light' ? LIGHT_PALETTES : THEME_PALETTES;
  const defaultPaletteKey = theme === 'light' ? 'paper' : 'obsidian';

  return (
    <AnimatePresence>
      <motion.div
        className="appearance-studio-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="appearance-studio"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        >
          {/* ── Top bar ── */}
          <div className="as-topbar">
            <div className="as-topbar-left">
              <div className="as-topbar-icon"><Palette size={18} /></div>
              <div>
                <div className="as-title">Appearance Studio</div>
                <div className="as-subtitle">Customize themes, fonts, layout & accessibility across your entire workspace</div>
              </div>
            </div>
            <div className="as-topbar-right">
              <button className="as-reset-btn-top" onClick={handleReset}>
                <RotateCcw size={13} className={resetConfirm ? 'spin' : ''} />
                <span>{resetConfirm ? 'Confirm Reset' : 'Reset All'}</span>
              </button>
              <button className="as-close" onClick={onClose} title="Close (Esc)">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="as-body">
            {/* ── Left nav rail ── */}
            <nav className="as-rail">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    className={`as-rail-item ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* ── Center content ── */}
            <div className="as-content">
              <div className="as-content-inner">

                {activeTab === 'presets' && (
                  <section className="as-panel">
                    <h2 className="as-panel-title">Curated Presets</h2>
                    <p className="as-panel-desc">One click applies a full bundle — palette, accent, fonts, radius, background & panel material.</p>
                    <div className="as-preset-grid">
                      {APPEARANCE_PRESETS.map(p => {
                        const active = themePalette === p.values.themePalette && accentColor === p.values.accentColor && theme === p.values.theme;
                        return (
                          <button key={p.key} className={`as-preset-card ${active ? 'active' : ''}`} onClick={() => applyPreset(p.key)}>
                            <div className="as-preset-swatches">
                              {p.preview.map((c, i) => <span key={i} style={{ background: c }} />)}
                            </div>
                            <div className="as-preset-meta">
                              <span className="as-preset-name">{p.name}</span>
                              <span className="as-preset-desc">{p.desc}</span>
                            </div>
                            {active && <Check size={13} className="ap-check" />}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {activeTab === 'mode' && (
                  <section className="as-panel">
                    <h2 className="as-panel-title">Appearance Mode</h2>
                    <p className="as-panel-desc">Choose light, dark, or sync automatically with your operating system.</p>
                    <div className="as-mode-grid">
                      <button
                        className={`as-mode-card ${theme === 'light' && !syncWithSystem ? 'active' : ''}`}
                        onClick={() => updateAppearance({ theme: 'light', syncWithSystem: false })}
                      >
                        <Sun size={20} />
                        <span className="as-mode-name">Light</span>
                        <span className="as-mode-desc">Bright & clean</span>
                      </button>
                      <button
                        className={`as-mode-card ${theme === 'dark' && !syncWithSystem ? 'active' : ''}`}
                        onClick={() => updateAppearance({ theme: 'dark', syncWithSystem: false })}
                      >
                        <Moon size={20} />
                        <span className="as-mode-name">Dark</span>
                        <span className="as-mode-desc">Easy on the eyes</span>
                      </button>
                      <button
                        className={`as-mode-card ${syncWithSystem ? 'active' : ''}`}
                        onClick={() => updateAppearance({ syncWithSystem: true })}
                      >
                        <Monitor size={20} />
                        <span className="as-mode-name">Sync with System</span>
                        <span className="as-mode-desc">Follows your OS setting</span>
                      </button>
                    </div>
                  </section>
                )}

                {activeTab === 'palette' && (
                  <section className="as-panel">
                    <h2 className="as-panel-title">Color Palette</h2>
                    <p className="as-panel-desc">
                      Showing {theme === 'light' ? 'light' : 'dark'} palettes — switch mode from the “Mode” tab to see the other set.
                    </p>
                    <div className="ap-palette-grid">
                      {activePalettes.map(p => (
                        <button
                          key={p.key}
                          className={`ap-palette-card ${themePalette === p.key || (themePalette === defaultPaletteKey && p.key === defaultPaletteKey) ? 'active' : ''}`}
                          onClick={() => updateAppearance({ themePalette: p.key })}
                          title={p.label}
                        >
                          <div className="ap-palette-swatches">
                            {p.preview.map((c, i) => <span key={i} style={{ background: c }} />)}
                          </div>
                          <div className="ap-palette-meta">
                            <span className="ap-palette-name">{p.label}</span>
                            <span className="ap-palette-desc">{p.desc}</span>
                          </div>
                          {themePalette === p.key && <Check size={12} className="ap-check" />}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === 'accent' && (
                  <section className="as-panel">
                    <h2 className="as-panel-title">Accent Color</h2>
                    <p className="as-panel-desc">Pick a signature highlight color, or mix your own.</p>
                    <div className="ap-color-grid">
                      {ACCENT_PRESETS.map(preset => (
                        <button
                          key={preset.hex}
                          className={`ap-color-swatch ${accentColor === preset.hex ? 'active' : ''}`}
                          style={{
                            background: preset.hex,
                            boxShadow: accentColor === preset.hex ? `0 0 12px ${preset.hex}80, 0 0 0 2px var(--bg), 0 0 0 3.5px ${preset.hex}` : 'none',
                          }}
                          title={preset.name}
                          onClick={() => { updateAppearance({ accentColor: preset.hex }); setCustomColor(preset.hex); }}
                        >
                          {accentColor === preset.hex && <Check size={10} style={{ color: '#000' }} />}
                        </button>
                      ))}
                      <label className="ap-color-custom" title="Custom color">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                          style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                        />
                        <span className="ap-color-custom-icon" style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }} />
                      </label>
                    </div>
                  </section>
                )}

                {activeTab === 'typography' && (
                  <>
                    <section className="as-panel">
                      <h2 className="as-panel-title">Body Font</h2>
                      <p className="as-panel-desc">Used across paragraphs, cards and general UI copy.</p>
                      <div className="ap-font-list">
                        {FONT_OPTIONS.map(opt => (
                          <button key={opt.key} className={`ap-font-card ${fontFamily === opt.key ? 'active' : ''}`} onClick={() => updateAppearance({ fontFamily: opt.key })} style={{ fontFamily: FONT_MAP[opt.key]?.css }}>
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

                    <section className="as-panel">
                      <h2 className="as-panel-title">Heading / UI Font</h2>
                      <p className="as-panel-desc">Used for titles, navigation and emphasized labels.</p>
                      <div className="ap-font-list">
                        {FONT_OPTIONS.map(opt => (
                          <button key={opt.key} className={`ap-font-card ${headingFontFamily === opt.key ? 'active' : ''}`} onClick={() => updateAppearance({ headingFontFamily: opt.key })} style={{ fontFamily: FONT_MAP[opt.key]?.css }}>
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

                    <section className="as-panel">
                      <h2 className="as-panel-title">Monospace / Code Font</h2>
                      <p className="as-panel-desc">Used in code blocks, terminals and technical output.</p>
                      <div className="ap-font-list">
                        {MONO_FONT_OPTIONS.map(opt => (
                          <button key={opt.key} className={`ap-font-card ${monoFontFamily === opt.key ? 'active' : ''}`} onClick={() => updateAppearance({ monoFontFamily: opt.key })} style={{ fontFamily: FONT_MAP[opt.key]?.css }}>
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

                    <section className="as-panel">
                      <h2 className="as-panel-title">Font Size &amp; Line Height</h2>
                      <p className="as-panel-desc">Base UI text size and paragraph spacing.</p>
                      <div className="ap-toggle-row" style={{ marginBottom: 8 }}>
                        {SIZE_OPTIONS.map(opt => (
                          <button key={opt.key} className={`ap-toggle-btn ${fontSize === opt.key ? 'active' : ''}`} title={opt.tooltip} onClick={() => updateAppearance({ fontSize: opt.key })}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <div className="ap-toggle-row">
                        {LINE_HEIGHTS.map(opt => (
                          <button key={opt.key} className={`ap-toggle-btn ${lineHeight === opt.key ? 'active' : ''}`} title={opt.desc} onClick={() => updateAppearance({ lineHeight: opt.key })}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'layout' && (
                  <>
                    <section className="as-panel">
                      <h2 className="as-panel-title">Corner Style</h2>
                      <p className="as-panel-desc">Border radius applied to buttons, cards and inputs.</p>
                      <div className="ap-toggle-row">
                        {RADIUS_OPTIONS.map(opt => (
                          <button key={opt.key} className={`ap-toggle-btn ${borderRadius === opt.key ? 'active' : ''}`} title={opt.label} onClick={() => updateAppearance({ borderRadius: opt.key })}>
                            <span className="ap-radius-icon">{opt.icon}</span>
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="as-panel">
                      <h2 className="as-panel-title">Background Pattern</h2>
                      <p className="as-panel-desc">A subtle texture layered behind the whole app.</p>
                      <div className="ap-toggle-row">
                        {BG_PATTERNS.map(opt => (
                          <button key={opt.key} className={`ap-toggle-btn ap-pattern-btn ${bgPattern === opt.key ? 'active' : ''}`} title={opt.desc} onClick={() => updateAppearance({ bgPattern: opt.key })}>
                            <span className="ap-pattern-icon">{opt.icon}</span>
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="as-panel">
                      <h2 className="as-panel-title">Panel Material</h2>
                      <p className="as-panel-desc">How sidebars, modals and cards render their surface.</p>
                      <div className="ap-toggle-row">
                        {PANEL_STYLES.map(opt => (
                          <button key={opt.key} className={`ap-toggle-btn ${panelStyle === opt.key ? 'active' : ''}`} title={opt.desc} onClick={() => updateAppearance({ panelStyle: opt.key })}>
                            {opt.key === 'glass' && <Wind size={11} />}
                            <span>{opt.label}</span>
                            {panelStyle === opt.key && <Check size={10} className="ap-check" style={{ marginLeft: 'auto' }} />}
                          </button>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'accessibility' && (
                  <>
                    <section className="as-panel">
                      <h2 className="as-panel-title">Motion</h2>
                      <div className="as-switch-row">
                        <div>
                          <div className="as-switch-label">Reduce Motion</div>
                          <div className="as-switch-desc">Removes animation & transition delays app-wide.</div>
                        </div>
                        <Switch checked={reduceMotion} onChange={(v) => updateAppearance({ reduceMotion: v })} />
                      </div>
                    </section>

                    <section className="as-panel">
                      <h2 className="as-panel-title">Contrast</h2>
                      <div className="as-switch-row">
                        <div>
                          <div className="as-switch-label">High Contrast</div>
                          <div className="as-switch-desc">Boosts secondary text & borders for maximum legibility.</div>
                        </div>
                        <Switch checked={highContrast} onChange={(v) => updateAppearance({ highContrast: v })} />
                      </div>
                    </section>

                    <section className="as-panel">
                      <h2 className="as-panel-title">Scrollbars</h2>
                      <p className="as-panel-desc">Applies to any unstyled scroll area across the app.</p>
                      <div className="ap-toggle-row">
                        {SCROLLBAR_STYLES.map(opt => (
                          <button key={opt.key} className={`ap-toggle-btn ${scrollbarStyle === opt.key ? 'active' : ''}`} title={opt.desc} onClick={() => updateAppearance({ scrollbarStyle: opt.key })}>
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'advanced' && (
                  <section className="as-panel">
                    <h2 className="as-panel-title">Import &amp; Export</h2>
                    <p className="as-panel-desc">Back up your theme, share it, or hand-edit the JSON.</p>
                    <div className="as-advanced-actions">
                      <button className="as-advanced-btn" onClick={handleExport}>
                        <Download size={13} /> Export Theme JSON
                      </button>
                      <button className="as-advanced-btn" onClick={handleImportClick}>
                        <Upload size={13} /> Import Theme JSON
                      </button>
                      <button className="as-advanced-btn" onClick={handleCopyCode}>
                        <ClipboardCopy size={13} /> Copy Theme Code
                      </button>
                      <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportFile} />
                    </div>
                    {importMsg && (
                      <div className={`as-import-msg ${importMsg.ok ? 'ok' : 'err'}`}>{importMsg.text}</div>
                    )}

                    <h2 className="as-panel-title" style={{ marginTop: 22 }}>Reset</h2>
                    <p className="as-panel-desc">Restore every setting on this screen back to the defaults.</p>
                    <button className={`ap-reset-btn ${resetConfirm ? 'confirm' : ''}`} onClick={handleReset} style={{ maxWidth: 260 }}>
                      <RotateCcw size={12} className={resetConfirm ? 'spin' : ''} />
                      <span>{resetConfirm ? 'Confirm Reset' : 'Reset to Defaults'}</span>
                    </button>
                  </section>
                )}

              </div>
            </div>

            {/* ── Right live preview rail ── */}
            <LivePreview />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
