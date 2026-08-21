import React from "react";
import "../styles/WanderingEyesLoader.css";

/**
 * Two eyes that glance around and blink while something loads.
 *
 * Inline indicator (drop-in replacement for a spinner icon):
 *   <WanderingEyesLoader size={15} />
 *
 * Centred block for an empty panel or a whole view:
 *   <WanderingEyesLoader block label="Loading docs…" size={26} />
 *
 * `size` is the diameter of one eye in px; every other measurement scales off
 * it. Colour is inherited from `currentColor`, so the loader matches whatever
 * text colour surrounds it unless you pass `color`.
 */
export default function WanderingEyesLoader({
  size = 20,
  label = "Loading",
  block = false,
  showLabel = false,
  duration = 10,
  color,
  className = "",
  style,
  ...rest
}) {
  const eyes = (
    <span
      role="status"
      aria-live="polite"
      className={`wandering-eyes ${block ? "" : className}`.trim()}
      style={{
        "--we-eye": `${size}px`,
        "--we-duration": `${duration}s`,
        ...(color ? { color } : null),
        ...(block ? null : style),
      }}
      {...(block ? null : rest)}
    >
      <span className="wandering-eyes__pair" aria-hidden="true">
        <span className="wandering-eyes__eye" />
        <span className="wandering-eyes__eye" />
      </span>
      {/* The visible label, when there is one, already announces the wait — a
          second copy in the live region would make screen readers say it twice. */}
      {showLabel && block ? null : <span className="sr-only">{label}</span>}
    </span>
  );

  if (!block) return eyes;

  return (
    <div className={`wandering-eyes-block ${className}`.trim()} style={style} {...rest}>
      {eyes}
      {showLabel ? <span className="wandering-eyes-block__label">{label}</span> : null}
    </div>
  );
}
