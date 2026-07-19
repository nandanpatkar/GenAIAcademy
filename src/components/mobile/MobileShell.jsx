import React from "react";
import { ChevronLeft } from "lucide-react";
import "../../styles/mobile-foundation.css";

/**
 * MobileShell
 * -----------
 * Local header + scroll container for a single mobile-optimized section
 * view (e.g. RoadmapMobile, PlaygroundMobile). This sits *inside* the
 * app's existing global mobile chrome (MobileHeader at the top, the
 * MobileBottomNav at the bottom) — it's the per-section wrapper, not a
 * replacement for the app shell.
 *
 * Usage:
 *   <MobileShell title="Roadmap" accentColor={pathData.color} onBack={...}>
 *     ...section content...
 *   </MobileShell>
 *
 * Props:
 *  - title:        string, required. Section/screen title.
 *  - subtitle:     optional secondary line under the title.
 *  - onBack:       optional. If provided, shows a back chevron.
 *  - accentColor:  optional. Colors the header underline/back icon.
 *  - rightSlot:    optional node rendered on the right of the header
 *                  (icon buttons, a toggle, etc).
 *  - scrollPadBottom: pixels of bottom padding reserved so content isn't
 *                  hidden behind the global bottom nav + any local sheet.
 *                  Defaults to 84 (64px nav + safe-area buffer).
 */
export default function MobileShell({
  title,
  subtitle,
  onBack,
  accentColor,
  rightSlot,
  scrollPadBottom = 84,
  className = "",
  children,
}) {
  return (
    <div className={`mshell ${className}`.trim()}>
      <div
        className="mshell-header"
        style={accentColor ? { "--mshell-accent": accentColor } : undefined}
      >
        <div className="mshell-header-left">
          {onBack && (
            <button
              type="button"
              className="mshell-back-btn"
              onClick={onBack}
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="mshell-titles">
            <div className="mshell-title">{title}</div>
            {subtitle && <div className="mshell-subtitle">{subtitle}</div>}
          </div>
        </div>
        {rightSlot && <div className="mshell-header-right">{rightSlot}</div>}
      </div>

      <div
        className="mshell-scroll"
        style={{ paddingBottom: scrollPadBottom }}
      >
        {children}
      </div>
    </div>
  );
}
