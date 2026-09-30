import jakartaFont from "../../assets/fonts/PlusJakartaSans-Variable.woff2";

/* The DSA hub's palette, applied to a framed Visual Learning lesson.
 *
 * The mirror styles itself in two layers, and both have to be swapped for a
 * lesson to read as part of the hub rather than as the original site's warm
 * paper-and-orange:
 *
 *   - CSS custom properties on :root / :root[data-theme=dark], stored as bare
 *     "R G B" triplets (`--paper: 250 246 238`) and read as rgb(var(--paper)).
 *     A later, more specific rule overrides them.
 *   - A JS palette object (module `L` with `light` and `dark` keys, hex
 *     strings) that the canvas animations read when they paint. It is found
 *     through webpack's module table and its fields reassigned in place, since
 *     components hold a reference to the object rather than copies of it.
 *
 * Semantic colours (done green, dead red, gold) keep their meaning and only
 * lose the paper tint; everything neutral becomes the hub's zinc greys, the
 * primary accent the hub's blue and the secondary its purple. A few lessons
 * hard-code their own colours for a diagram; those stay as they are.
 */

const hex = (triplet) => `#${triplet.split(" ").map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;

// Triplets, keyed by the mirror's own variable names.
const PALETTE = {
  light: {
    paper: "255 255 255",
    surface: "250 250 250",
    ink: "9 9 11",
    sketch: "63 63 70",
    mute: "113 113 122",
    accent: "59 95 227",
    accent2: "122 61 219",
    border: "39 39 42",
    "idle-bg": "255 255 255",
    "active-bg": "228 234 252",
    "compare-bg": "238 230 252",
    "dim-bg": "244 244 245",
    flash: "199 210 254",
    "done-bg": "220 245 234",
    "dead-bg": "253 228 228",
    "gold-bg": "253 243 215",
  },
  dark: {
    paper: "15 15 15",
    surface: "20 20 20",
    ink: "244 244 245",
    sketch: "161 161 170",
    mute: "113 113 122",
    accent: "92 119 219",
    accent2: "172 132 235",
    border: "63 63 70",
    "idle-bg": "24 24 27",
    "active-bg": "29 36 66",
    "compare-bg": "40 30 60",
    "dim-bg": "28 28 31",
    flash: "52 66 122",
    "done-bg": "18 44 34",
    "dead-bg": "52 24 24",
    "gold-bg": "48 40 16",
  },
};

const OVERLAY = {
  light: { card: "rgba(9,9,11,0.022)", "card-hi": "rgba(9,9,11,0.045)", line: "rgba(9,9,11,0.1)", "line-hi": "rgba(9,9,11,0.18)" },
  dark: { card: "rgba(255,255,255,0.035)", "card-hi": "rgba(255,255,255,0.06)", line: "rgba(255,255,255,0.09)", "line-hi": "rgba(255,255,255,0.16)" },
};

const block = (mode) => [
  ...Object.entries(PALETTE[mode]).map(([name, value]) => `--${name}:${value};`),
  ...Object.entries(OVERLAY[mode]).map(([name, value]) => `--${name}:${value};`),
].join("");

// `html:root` outranks the mirror's `:root` without needing !important.
export const FRAME_THEME_CSS = `
@font-face { font-family: "Plus Jakarta Sans DSA"; src: url("${jakartaFont}") format("woff2"); font-weight: 200 800; font-display: swap; }
html:root { ${block("light")} }
html:root[data-theme=dark] { ${block("dark")} }
body, .font-hand, .font-sketch, .font-sans { font-family: "Plus Jakarta Sans DSA", "Plus Jakarta Sans", system-ui, sans-serif !important; }
.font-hand { letter-spacing: -0.015em; }
/* The host already names the lesson, and the mirror's display-size title can
   wrap to two lines and push the animation below the frame, which never
   scrolls — so it is kept to the hub's page-title scale. */
h1 { font-size: clamp(22px, 2.2vw, 30px) !important; line-height: 1.15 !important; letter-spacing: -0.02em !important; }
::selection { background: rgb(var(--accent) / 0.28); }
`;

// camelCase keys of the JS palette ↔ kebab-case CSS names.
const camel = (name) => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const JS_PALETTE = Object.fromEntries(Object.entries(PALETTE).map(([mode, values]) => [
  mode,
  Object.fromEntries(Object.entries(values).map(([name, value]) => [camel(name), hex(value)])),
]));

/** Reassign the mirror's JS palette in place. True once it has been found. */
export function patchFramePalette(win) {
  try {
    if (win.__cvPalettePatched) return true;
    const chunks = win.webpackChunk_N_E;
    if (!chunks?.push) return false;
    let require = null;
    chunks.push([[`cv-dsa-theme-${Date.now()}`], {}, (req) => { require = req; }]);
    if (!require?.m) return false;
    // Production builds don't expose the module cache, but the factory table
    // is always there: find the palette's factory by its source, then require
    // it — which returns the same, already-evaluated exports object.
    // Only modules not looked at before are scanned: the chunk holding the
    // palette may register after the first poll.
    const scanned = win.__cvScannedModules || (win.__cvScannedModules = new Set());
    const candidates = Object.keys(require.m).filter((id) => {
      if (scanned.has(id)) return false;
      scanned.add(id);
      const source = String(require.m[id]);
      return source.includes("paper:") && source.includes("accent2:") && source.includes("idleBg:");
    });
    for (const id of candidates) {
      const palette = require(id)?.L;
      if (palette?.light?.paper && palette?.dark?.paper) {
        Object.assign(palette.light, JS_PALETTE.light);
        Object.assign(palette.dark, JS_PALETTE.dark);
        win.__cvPalettePatched = true;
        return true;
      }
    }
  } catch { /* frame navigated away or not ours */ }
  return false;
}

/* The mirror's ThemeProvider decides light or dark once, on mount, from its
   own `theme` key in localStorage (default dark) — and its canvases paint from
   that React state, not from data-theme. The frame shares the app's origin,
   so the key is set here before a lesson loads; a theme switch then reloads
   the frame (see VisualLessonFrame). The app itself doesn't use this key. */
export const MIRROR_THEME_KEY = "theme";

export function seedMirrorTheme(dark) {
  try { window.localStorage.setItem(MIRROR_THEME_KEY, dark ? "dark" : "light"); } catch { /* storage unavailable */ }
}

/** Add the DSA theme stylesheet to a framed document (idempotent). */
export function applyFrameTheme(doc, dark) {
  if (!doc?.head) return;
  if (!doc.getElementById("cv-dsa-theme")) {
    const style = doc.createElement("style");
    style.id = "cv-dsa-theme";
    style.textContent = FRAME_THEME_CSS;
    doc.head.appendChild(style);
  }
  doc.documentElement?.setAttribute("data-theme", dark ? "dark" : "light");
}
