import { useState, useEffect } from "react";

export const MOBILE_BREAKPOINT = 768;

/**
 * useIsMobile
 * Single source of truth for "are we on a mobile viewport".
 *
 * Replaces ad-hoc `width <= 768` checks scattered through App.jsx and
 * individual section components. Every new mobile-specific view or
 * conditional should read from this hook rather than re-deriving the
 * breakpoint locally, so the breakpoint only ever needs to change in
 * one place.
 *
 * Uses a matchMedia listener (rather than a resize listener recalculating
 * window.innerWidth on every pixel) so it only re-renders when the
 * boolean actually flips.
 */
export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const query = `(max-width: ${breakpoint}px)`;

  const getMatch = () =>
    typeof window !== "undefined" && "matchMedia" in window
      ? window.matchMedia(query).matches
      : false;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const mql = window.matchMedia(query);
    const handleChange = (e) => setIsMobile(e.matches);

    // Sync in case the breakpoint arg changed or we missed an update
    setIsMobile(mql.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
    // Safari < 14 fallback
    mql.addListener(handleChange);
    return () => mql.removeListener(handleChange);
  }, [query]);

  return isMobile;
}
