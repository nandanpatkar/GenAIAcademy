import React, { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/mobile-foundation.css";

/**
 * MobileSheet
 * -----------
 * Shared bottom-sheet pattern for mobile detail/edit views. Intended to
 * replace the pattern of "hide the desktop side panel, show a fixed
 * full-screen div" that's currently duplicated per-panel (ModulePanel /
 * DetailPanel / ResourcePanel mobile branches in App.jsx). New mobile
 * section views should drill into details via this component instead of
 * a bespoke full-screen overlay.
 *
 * Usage:
 *   <MobileSheet
 *     open={!!activeModule}
 *     onClose={() => setActiveModule(null)}
 *     title={activeModule?.title}
 *     tabs={[{ id: "details", label: "Details" }, { id: "resources", label: "Resources" }]}
 *     activeTab={tab}
 *     onTabChange={setTab}
 *   >
 *     ...content for the active tab...
 *   </MobileSheet>
 *
 * Behavior:
 *  - Slides up from the bottom, dims background with a tappable backdrop.
 *  - Drag the handle (or swipe down anywhere in the header) to dismiss.
 *  - Optional in-sheet tab bar for combining panels that used to be
 *    separate (e.g. Details + Resources) into one sheet.
 */
export default function MobileSheet({
  open,
  onClose,
  title,
  subtitle,
  accentColor,
  tabs,
  activeTab,
  onTabChange,
  footer,
  children,
}) {
  const dragStartY = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (dragStartY.current == null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragOffset(delta);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 90) {
      onClose?.();
    }
    setDragOffset(0);
    dragStartY.current = null;
  }, [dragOffset, onClose]);

  // Reset drag state whenever the sheet opens fresh
  useEffect(() => {
    if (open) setDragOffset(0);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="msheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            ref={sheetRef}
            className="msheet"
            style={{
              transform: `translateY(${dragOffset}px)`,
              ...(accentColor ? { "--msheet-accent": accentColor } : {}),
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
          >
            <div
              className="msheet-drag-zone"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="msheet-handle" />
              <div className="msheet-header">
                <div className="msheet-titles">
                  <div className="msheet-title">{title}</div>
                  {subtitle && <div className="msheet-subtitle">{subtitle}</div>}
                </div>
                <button
                  type="button"
                  className="msheet-close-btn"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {tabs && tabs.length > 0 && (
                <div className="msheet-tabs">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`msheet-tab ${activeTab === t.id ? "active" : ""}`}
                      onClick={() => onTabChange?.(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="msheet-body">{children}</div>

            {footer && <div className="msheet-footer">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
