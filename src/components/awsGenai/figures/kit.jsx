import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

/* Shared toolkit for the AWS GenAI lesson figures.
 *
 * Every figure draws from the --aipf-* custom properties AwsGenAi.css defines
 * on the viewer root, so they follow the app's light/dark switch without
 * reading the theme. Animations run on requestAnimationFrame and stop when a
 * figure scrolls out of view, the pointer rests on it, or the reader asked
 * for reduced motion — a long lesson can hold several figures at once.
 */

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
export const fmt = (value, digits = 0) =>
  Number(value).toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });

/** AWS architecture-icon families, as CSS variables (see AwsGenAi.css). */
export const KIND_COLOR = {
  client: "var(--aipf-k-client)",
  compute: "var(--aipf-k-compute)",
  ai: "var(--aipf-k-ai)",
  storage: "var(--aipf-k-storage)",
  db: "var(--aipf-k-db)",
  integration: "var(--aipf-k-integration)",
  security: "var(--aipf-k-security)",
  network: "var(--aipf-k-network)",
  monitor: "var(--aipf-k-monitor)",
  analytics: "var(--aipf-k-analytics)",
  human: "var(--aipf-k-human)",
  devtools: "var(--aipf-k-devtools)",
  external: "var(--aipf-k-external)",
};

export const TONE_COLOR = {
  accent: "var(--aipf-accent)",
  ok: "var(--aipf-ok)",
  warn: "var(--aipf-warn)",
  bad: "var(--aipf-bad)",
  muted: "var(--aipf-ink-3)",
};

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export function useInView(ref, margin = "120px") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: margin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, margin]);
  return visible;
}

/**
 * A frame clock: calls back with elapsed milliseconds while `running`.
 * The callback owns the state update, so a figure re-renders only for what it
 * actually draws.
 */
export function useFrame(running, onFrame) {
  const callback = useRef(onFrame);
  callback.current = onFrame;
  useEffect(() => {
    if (!running) return undefined;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      callback.current(dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/**
 * Play state shared by every animated figure: plays while visible and not
 * hovered, starts paused under reduced motion, and remembers an explicit
 * pause so scrolling back does not restart a figure the reader stopped.
 */
export function usePlayback(ref, { autoplay = true } = {}) {
  const reduced = useReducedMotion();
  const inView = useInView(ref);
  const [wanted, setWanted] = useState(autoplay && !reduced);
  const [hovered, setHovered] = useState(false);
  useEffect(() => { if (reduced) setWanted(false); }, [reduced]);
  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
  return {
    playing: wanted && inView && !hovered,
    wanted,
    reduced,
    toggle: useCallback(() => setWanted((value) => !value), []),
    play: useCallback(() => setWanted(true), []),
    pause: useCallback(() => setWanted(false), []),
    hoverProps,
  };
}

/* ── chrome ──────────────────────────────────────────────────────────── */

export function FigureFrame({ kind = "Interactive", title, controls, children, caption, footer, frameRef, className = "", ...rest }) {
  return (
    <figure className={`aipf ${className}`} ref={frameRef} {...rest}>
      <header className="aipf-head">
        <span className="aipf-kind"><i />{kind}</span>
        <span className="aipf-title">{title}</span>
        {controls ? <span className="aipf-controls">{controls}</span> : null}
      </header>
      <div className="aipf-body">{children}</div>
      {caption ? <figcaption className="aipf-caption">{caption}</figcaption> : null}
      {footer ? <div className="aipf-foot">{footer}</div> : null}
    </figure>
  );
}

export function IconButton({ label, onClick, children, disabled }) {
  return (
    <button type="button" className="aipf-icon" onClick={onClick} aria-label={label} title={label} disabled={disabled}>
      {children}
    </button>
  );
}

export function PlayControls({ playback, onReset, onPrev, onNext }) {
  return (
    <>
      {onPrev ? <IconButton label="Previous step" onClick={onPrev}><SkipBack size={13} /></IconButton> : null}
      <IconButton label={playback.wanted ? "Pause" : "Play"} onClick={playback.toggle}>
        {playback.wanted ? <Pause size={13} /> : <Play size={13} />}
      </IconButton>
      {onNext ? <IconButton label="Next step" onClick={onNext}><SkipForward size={13} /></IconButton> : null}
      {onReset ? <IconButton label="Restart" onClick={onReset}><RotateCcw size={13} /></IconButton> : null}
    </>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => fmt(v), hint }) {
  return (
    <label className="aipf-slider">
      <span className="aipf-slider-top">
        <span>{label}</span>
        <b>{format(value)}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function Segmented({ label, value, options, onChange }) {
  return (
    <div className="aipf-seg" role="radiogroup" aria-label={label}>
      {label ? <span className="aipf-seg-label">{label}</span> : null}
      <div className="aipf-seg-row">
        {options.map((option) => {
          const id = typeof option === "string" ? option : option.id;
          const text = typeof option === "string" ? option : option.label;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={value === id}
              className={`aipf-seg-btn${value === id ? " is-on" : ""}`}
              onClick={() => onChange(id)}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className={`aipf-toggle${checked ? " is-on" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="aipf-toggle-track"><span /></span>
      <span>{label}</span>
    </label>
  );
}

export function Stat({ label, value, tone, sub }) {
  return (
    <div className={`aipf-stat${tone ? ` is-${tone}` : ""}`}>
      <span className="aipf-stat-label">{label}</span>
      <b className="aipf-stat-value">{value}</b>
      {sub ? <small>{sub}</small> : null}
    </div>
  );
}

export function Controls({ children }) {
  return <div className="aipf-ctl">{children}</div>;
}

export function Badge({ tone = "accent", children }) {
  return <span className={`aipf-badge is-${tone}`}>{children}</span>;
}

/* ── service glyphs ──────────────────────────────────────────────────────
   One white stroke glyph per icon family, drawn into a 16×16 box on the
   family's colored tile, the way AWS architecture icons read. */

const GLYPHS = {
  client: <><circle cx="8" cy="5.2" r="2.6" /><path d="M3 14c.6-2.9 2.6-4.4 5-4.4s4.4 1.5 5 4.4" /></>,
  human: <><circle cx="7" cy="5.2" r="2.5" /><path d="M2.4 14c.5-2.8 2.4-4.3 4.6-4.3 1 0 1.9.3 2.6.8" /><path d="M10.4 12.4l1.5 1.5 2.7-3" /></>,
  compute: <><rect x="4" y="4" width="8" height="8" rx="1.2" /><path d="M6 1.8v2.2M10 1.8v2.2M6 12v2.2M10 12v2.2M1.8 6h2.2M1.8 10h2.2M12 6h2.2M12 10h2.2" /></>,
  ai: <path d="M8 1.6c.5 3 1.7 4.3 4.7 4.8-3 .5-4.2 1.8-4.7 4.8-.5-3-1.7-4.3-4.7-4.8 3-.5 4.2-1.8 4.7-4.8zM12.6 10.4c.2 1.3.7 1.8 2 2-1.3.2-1.8.7-2 2-.2-1.3-.7-1.8-2-2 1.3-.2 1.8-.7 2-2z" />,
  storage: <><path d="M2.6 4.2l1.5 9.2c.1.7 1.8 1.2 3.9 1.2s3.8-.5 3.9-1.2l1.5-9.2" /><ellipse cx="8" cy="4.2" rx="5.4" ry="1.8" /></>,
  db: <><ellipse cx="8" cy="3.8" rx="5" ry="1.9" /><path d="M3 3.8v8.4c0 1 2.2 1.9 5 1.9s5-.9 5-1.9V3.8M3 8c0 1 2.2 1.9 5 1.9s5-.9 5-1.9" /></>,
  integration: <><path d="M2.5 5.5h10M10 3l2.5 2.5L10 8" /><path d="M13.5 10.5h-10M6 8l-2.5 2.5L6 13" /></>,
  security: <><rect x="3.2" y="7" width="9.6" height="7" rx="1.4" /><path d="M5.2 7V5.3a2.8 2.8 0 0 1 5.6 0V7" /><path d="M8 9.6v1.8" /></>,
  network: <><circle cx="8" cy="8" r="5.8" /><ellipse cx="8" cy="8" rx="2.5" ry="5.8" /><path d="M2.4 8h11.2" /></>,
  monitor: <><rect x="2" y="2.4" width="12" height="11.2" rx="1.4" /><path d="M4.2 10.6l2.6-3 2 1.8 3-4" /></>,
  analytics: <><path d="M2.4 13.6h11.2" /><rect x="3.4" y="8" width="2.2" height="5.6" /><rect x="6.9" y="4.4" width="2.2" height="9.2" /><rect x="10.4" y="6.4" width="2.2" height="7.2" /></>,
  devtools: <path d="M5.6 4.4L2 8l3.6 3.6M10.4 4.4L14 8l-3.6 3.6M9 2.8L7 13.2" />,
  external: <path d="M4.6 12.6h7.2a2.8 2.8 0 0 0 .4-5.6 3.8 3.8 0 0 0-7.3-1 2.9 2.9 0 0 0-.3 6.6z" />,
};

export function ServiceTile({ kind = "compute", x, y, size = 24 }) {
  const glyph = GLYPHS[kind] || GLYPHS.compute;
  const scale = size / 24;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={size} height={size} rx={6 * scale} style={{ fill: KIND_COLOR[kind] || KIND_COLOR.compute }} />
      <g
        transform={`translate(${4 * scale} ${4 * scale}) scale(${scale})`}
        fill="none"
        stroke="#fff"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {glyph}
      </g>
    </g>
  );
}

/* ── small SVG helpers ───────────────────────────────────────────────── */

export function ArrowDefs({ id }) {
  return (
    <defs>
      {Object.entries({ idle: "var(--aipf-edge)", accent: "var(--aipf-accent)", ok: "var(--aipf-ok)", warn: "var(--aipf-warn)", bad: "var(--aipf-bad)" }).map(([name, color]) => (
        <marker key={name} id={`${id}-${name}`} viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" style={{ fill: color }} />
        </marker>
      ))}
    </defs>
  );
}

/** A soft rounded label pill, for notes and values drawn inside an SVG. */
export function Pill({ x, y, text, tone = "accent", anchor = "middle", size = 10 }) {
  const width = Math.max(28, text.length * size * 0.6 + 14);
  const left = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  return (
    <g className="aipf-pill">
      <rect x={left} y={y - size - 3} width={width} height={size + 9} rx={(size + 9) / 2}
        style={{ fill: `color-mix(in srgb, ${TONE_COLOR[tone] || tone} 16%, var(--aipf-bg))`, stroke: TONE_COLOR[tone] || tone }} strokeWidth="1" />
      <text x={left + width / 2} y={y + 1.5} textAnchor="middle" className="aipf-mono" style={{ fill: TONE_COLOR[tone] || tone, fontSize: size }}>
        {text}
      </text>
    </g>
  );
}

/** Deterministic pseudo-random numbers, so simulated traffic looks the same on every render. */
export function seeded(seed = 7) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/* ── charts ──────────────────────────────────────────────────────────── */

export const scale = (d0, d1, r0, r1) => (value) => r0 + ((value - d0) / (d1 - d0 || 1)) * (r1 - r0);
export const linePath = (points) =>
  points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
export const areaPath = (points, baseY) =>
  points.length ? `${linePath(points)}L${points[points.length - 1][0].toFixed(1)},${baseY}L${points[0][0].toFixed(1)},${baseY}Z` : "";

/** Horizontal gridlines with value labels on the left edge of a plot box. */
export function GridY({ x0, x1, ticks, y, format = (v) => fmt(v) }) {
  return (
    <g className="aipf-grid">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={x0} x2={x1} y1={y(tick)} y2={y(tick)} />
          <text x={x0 - 6} y={y(tick) + 3} textAnchor="end">{format(tick)}</text>
        </g>
      ))}
    </g>
  );
}

/**
 * A looping 0→1 sweep for time-based simulations: advances while the figure
 * plays, holds at the end for `hold` ms, then restarts. Under reduced motion
 * it starts finished, so the whole result is visible at once.
 */
export function useSweep(playback, durationMs, { hold = 1600, loop = true } = {}) {
  const [t, setT] = useState(() => (playback.reduced ? 1 : 0));
  const extra = hold / durationMs;
  useFrame(playback.playing, (dt) => {
    setT((prev) => {
      const next = prev + dt / durationMs;
      if (next < 1 + extra) return next;
      return loop ? 0 : 1 + extra;
    });
  });
  return [Math.min(1, t), setT];
}
