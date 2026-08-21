import React, { useEffect, useId, useMemo, useRef } from "react";
import "../styles/NinjaEye.css";

/**
 * NinjaEye — the app's loading indicator.
 *
 * A ninja's eye watching through the slit of a mask. It blinks on an irregular
 * human-ish cadence and its iris follows the mouse cursor anywhere on the page.
 * Everything that moves is driven by CSS custom properties written straight to
 * the DOM node from one shared rAF loop, so a screen with a dozen eyes on it
 * still costs a single animation frame and zero React re-renders.
 *
 *   <NinjaEye size={64} />                          raw eye
 *   <NinjaLoader label="Loading roadmap…" />        eye + caption, centred
 *   <NinjaLoaderOverlay label="…" />                fills its positioned parent
 *   <NinjaEye size={12} />                          auto-simplifies for buttons
 */

/* ── Shared pointer + animation driver ────────────────────────────────────── */

/* One listener and one rAF loop for the whole application, ref-counted by the
   eyes that are currently mounted. Each eye is a plain object in `eyes`; the
   loop writes --ne-x / --ne-y onto its element and never touches React state. */

const pointer = { x: 0, y: 0, seen: false, movedAt: 0 };
const eyes = new Set();

let listening = false;
let frame = 0;
let tick = 0;

function handlePointer(event) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.seen = true;
  pointer.movedAt = performance.now();
}

/** Clamp a vector to the ellipse the iris is allowed to travel inside. */
function clampToEllipse(dx, dy, rx, ry) {
  const scale = Math.hypot(dx / rx, dy / ry);
  return scale > 1 ? [dx / scale, dy / scale] : [dx, dy];
}

function step() {
  const now = performance.now();
  /* Rects are only re-read every 12th frame: an eye's position changes when the
     page scrolls or reflows, not between frames, and reading all of them every
     frame would force a layout flush each time. */
  const remeasure = tick++ % 12 === 0;
  /* No pointer yet, or the mouse has been still for a while — the eye scans the
     room on a slow Lissajous instead of staring at nothing. */
  const idle = !pointer.seen || now - pointer.movedAt > 2600;

  for (const eye of eyes) {
    const el = eye.el;
    if (!el) continue;
    if (remeasure || !eye.rect) {
      const rect = el.getBoundingClientRect();
      /* Skip eyes that are display:none or scrolled far out of view. */
      eye.visible = rect.width > 0 && rect.bottom > -400 && rect.top < window.innerHeight + 400;
      eye.rect = rect;
    }
    if (!eye.visible) continue;

    const rect = eye.rect;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let tx;
    let ty;
    if (idle) {
      const t = now / 1000;
      tx = Math.sin(t * 0.62 + eye.phase) * 0.55;
      ty = Math.sin(t * 0.41 + eye.phase * 1.7) * 0.42;
    } else {
      /* Normalised gaze: 1.0 once the cursor is a couple of eye-widths away, so
         the iris is at full deflection long before the pointer reaches a screen
         edge and small movements near the eye still register. */
      const reach = Math.max(rect.width, 220) * 1.6;
      [tx, ty] = clampToEllipse((pointer.x - cx) / reach, (pointer.y - cy) / reach, 1, 1);
    }

    /* Critically-damped-ish follow. The iris lags the cursor just enough to feel
       like a physical eye rather than a cursor-locked sprite. */
    eye.x += (tx - eye.x) * 0.14;
    eye.y += (ty - eye.y) * 0.14;

    el.style.setProperty("--ne-x", eye.x.toFixed(4));
    el.style.setProperty("--ne-y", eye.y.toFixed(4));
  }

  frame = requestAnimationFrame(step);
}

function registerEye(eye) {
  eyes.add(eye);
  if (!listening) {
    listening = true;
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    frame = requestAnimationFrame(step);
  }
  return () => {
    eyes.delete(eye);
    if (eyes.size === 0 && listening) {
      listening = false;
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      cancelAnimationFrame(frame);
    }
  };
}

function prefersReducedMotion() {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ── Geometry ─────────────────────────────────────────────────────────────── */

/* Everything lives in a 100×100 viewBox centred on (50, 50). The lens is the
   opening in the mask; the hood is the cloth around it; the lids slide inside
   the lens clip so their edges always follow its outline exactly. */
const LENS = "M 12 50 C 26 24, 74 24, 88 50 C 74 76, 26 76, 12 50 Z";
const HOOD_OUTER = "M 2 50 C 22 16, 78 16, 98 50 C 78 84, 22 84, 2 50 Z";

/* Each lid edge is the matching half of the lens, pushed LID_TRAVEL toward the
   centre line. So at --ne-lid: 0 the lid retracts onto the lens outline exactly
   — invisible, no seam across the open eye — and at 1 the two edges cross the
   centre and the slit is shut. Change LID_TRAVEL and both ends stay correct. */
const LID_TRAVEL = 20;
const LID_TOP_EDGE = `M -12 ${50 + LID_TRAVEL} L 12 ${50 + LID_TRAVEL} C 26 ${24 + LID_TRAVEL}, 74 ${24 + LID_TRAVEL}, 88 ${50 + LID_TRAVEL} L 112 ${50 + LID_TRAVEL}`;
const LID_BOTTOM_EDGE = `M -12 ${50 - LID_TRAVEL} L 12 ${50 - LID_TRAVEL} C 26 ${76 - LID_TRAVEL}, 74 ${76 - LID_TRAVEL}, 88 ${50 - LID_TRAVEL} L 112 ${50 - LID_TRAVEL}`;
const LID_TOP = `${LID_TOP_EDGE} L 112 -80 L -12 -80 Z`;
const LID_BOTTOM = `${LID_BOTTOM_EDGE} L 112 180 L -12 180 Z`;

/* Cloth gathered at the two tips of the slit — the detail that separates a
   ninja's mask from a plain glowing eye. */
const FOLDS = [
  "M 4.5 43 L 14 46.5", "M 4.5 57 L 14 53.5",
  "M 95.5 43 L 86 46.5", "M 95.5 57 L 86 53.5",
  "M 33.5 30 L 31.5 23", "M 50 28 L 50 21", "M 66.5 30 L 68.5 23",
];

/** Twelve iris striations, drawn once and rotated as a group. */
const STRIATIONS = Array.from({ length: 12 }, (_, i) => i * 30);

/* ── The eye ──────────────────────────────────────────────────────────────── */

export function NinjaEye({
  size = 64,
  className = "",
  style,
  /** Set false on decorative eyes that sit next to their own status text. */
  labelled = true,
  label = "Loading",
}) {
  const rootRef = useRef(null);
  /* useId is unique per instance but contains ':' — legal in an HTML id, but it
     breaks any selector built from it, so sanitise before use. */
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduced = useMemo(prefersReducedMotion, []);

  /* Gaze tracking. */
  useEffect(() => {
    if (reduced) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    return registerEye({ el, x: 0, y: 0, phase: Math.random() * Math.PI * 2, rect: null, visible: true });
  }, [reduced]);

  /* Blinking. Scheduled in JS rather than as a keyframe loop so the rhythm is
     irregular — a long stare, then sometimes a quick double-blink — which is
     what stops it reading as a spinner with an eye painted on it. */
  useEffect(() => {
    if (reduced) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;

    let timer;
    const closeFor = (openDelay) => {
      el.style.setProperty("--ne-lid-ms", "70ms");
      el.style.setProperty("--ne-lid", "1");
      timer = setTimeout(() => {
        el.style.setProperty("--ne-lid-ms", "130ms");
        el.style.setProperty("--ne-lid", "0");
        timer = setTimeout(schedule, openDelay);
      }, 78);
    };

    function schedule() {
      /* ~55% single blink, ~20% a double, the rest a long hold. */
      const roll = Math.random();
      const wait = roll < 0.2 ? 130 : 2200 + Math.random() * 3800;
      timer = setTimeout(() => closeFor(roll < 0.2 ? 90 : 0), wait);
    }

    timer = setTimeout(schedule, 600 + Math.random() * 1400);
    return () => clearTimeout(timer);
  }, [reduced]);

  /* Below ~26px the striations, orbit rings and sparks turn into grey mush, so
     the tiny variant drops them and keeps only the silhouette that reads. */
  const tiny = size < 26;
  const compact = size < 44;

  return (
    <span
      ref={rootRef}
      className={`ninja-eye${tiny ? " ninja-eye--tiny" : ""}${compact ? " ninja-eye--compact" : ""} ${className}`.trim()}
      style={{ width: size, height: size, "--ne-lid-travel": LID_TRAVEL, ...style }}
      role={labelled ? "status" : undefined}
      aria-live={labelled ? "polite" : undefined}
      aria-hidden={labelled ? undefined : "true"}
    >
      <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}-aura`} cx="50%" cy="50%" r="50%">
            <stop offset="35%" stopColor="var(--ne-accent)" stopOpacity="0.30" />
            <stop offset="70%" stopColor="var(--ne-accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--ne-accent)" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`${uid}-iris`} cx="42%" cy="36%" r="72%">
            <stop offset="0%" stopColor="var(--ne-iris-hi)" />
            <stop offset="48%" stopColor="var(--ne-accent)" />
            <stop offset="100%" stopColor="var(--ne-iris-lo)" />
          </radialGradient>

          <radialGradient id={`${uid}-sclera`} cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor="var(--ne-sclera-hi)" />
            <stop offset="100%" stopColor="var(--ne-sclera-lo)" />
          </radialGradient>

          <linearGradient id={`${uid}-cloth`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#242835" />
            <stop offset="100%" stopColor="#05060a" />
          </linearGradient>

          <clipPath id={`${uid}-lens`}>
            <path d={LENS} />
          </clipPath>
        </defs>

        {/* Aura + indeterminate orbit: the part that says "still working". */}
        <circle className="ne-aura" cx="50" cy="50" r="50" fill={`url(#${uid}-aura)`} />
        <g className="ne-orbit">
          <circle className="ne-orbit-ring ne-orbit-ring--outer" cx="50" cy="50" r="47" />
          <circle className="ne-orbit-ring ne-orbit-ring--inner" cx="50" cy="50" r="42" />
        </g>
        <g className="ne-sparks">
          {[0, 120, 240].map(angle => (
            <rect
              key={angle}
              className="ne-spark"
              x="48.4" y="1.6" width="3.2" height="3.2" rx="0.5"
              transform={`rotate(${angle} 50 50) rotate(45 50 3.2)`}
            />
          ))}
        </g>

        {/* The mask cloth: outer almond minus the lens, so the eye reads as a
            slit cut through fabric rather than a floating eyeball. */}
        <path className="ne-hood" d={`${HOOD_OUTER} ${LENS}`} fillRule="evenodd" fill={`url(#${uid}-cloth)`} />
        <path className="ne-hood-rim" d={HOOD_OUTER} />
        <g className="ne-folds">
          {FOLDS.map(d => <path key={d} d={d} />)}
        </g>

        <g clipPath={`url(#${uid}-lens)`}>
          <rect x="0" y="0" width="100" height="100" fill={`url(#${uid}-sclera)`} />

          {/* Gaze group: --ne-x / --ne-y are written by the shared rAF loop. */}
          <g className="ne-gaze">
            <circle className="ne-iris" cx="50" cy="50" r="15.5" fill={`url(#${uid}-iris)`} />
            <g className="ne-striations">
              {STRIATIONS.map(angle => (
                <line key={angle} x1="50" y1="42" x2="50" y2="35.6" transform={`rotate(${angle} 50 50)`} />
              ))}
            </g>
            <circle className="ne-iris-rim" cx="50" cy="50" r="15.5" />
            <circle className="ne-pupil" cx="50" cy="50" r="6.6" />
            <circle className="ne-glint" cx="44.6" cy="44" r="3" />
            <circle className="ne-glint ne-glint--small" cx="55.4" cy="55.6" r="1.5" />
          </g>

          {/* Lids ride inside the clip, so their edges trace the lens outline. */}
          <g className="ne-lid ne-lid--top">
            <path className="ne-lid-fill" d={LID_TOP} fill={`url(#${uid}-cloth)`} />
            <path className="ne-lid-edge" d={LID_TOP_EDGE} />
          </g>
          <g className="ne-lid ne-lid--bottom">
            <path className="ne-lid-fill" d={LID_BOTTOM} fill={`url(#${uid}-cloth)`} />
            <path className="ne-lid-edge" d={LID_BOTTOM_EDGE} />
          </g>
        </g>

        <path className="ne-lens-rim" d={LENS} />
      </svg>
      {labelled ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

/* ── Compositions ─────────────────────────────────────────────────────────── */

/**
 * Centred eye with a caption. The default for "this panel is fetching".
 * `size` accepts the tokens xs / sm / md / lg / xl or a raw pixel number.
 */
const SIZES = { xs: 18, sm: 32, md: 64, lg: 96, xl: 132 };

export function NinjaLoader({
  label = "Loading…",
  hint,
  size = "md",
  className = "",
  style,
  /** Lay the eye and its label out on one line — for inline / dense contexts. */
  inline = false,
}) {
  const px = typeof size === "number" ? size : (SIZES[size] ?? SIZES.md);
  return (
    <div
      className={`ninja-loader${inline ? " ninja-loader--inline" : ""} ${className}`.trim()}
      style={style}
      role="status"
      aria-live="polite"
    >
      <NinjaEye size={px} labelled={false} />
      {label ? <span className="ninja-loader-label">{label}</span> : null}
      {hint ? <span className="ninja-loader-hint">{hint}</span> : null}
    </div>
  );
}

/** Fills the nearest positioned ancestor (or the viewport) with a scrim + eye. */
export function NinjaLoaderOverlay({ label = "Loading…", hint, size = "lg", fixed = false, className = "", style }) {
  return (
    <div
      className={`ninja-overlay${fixed ? " ninja-overlay--fixed" : ""} ${className}`.trim()}
      style={style}
      role="status"
      aria-live="polite"
    >
      <NinjaLoader label={label} hint={hint} size={size} />
    </div>
  );
}

export default NinjaEye;
