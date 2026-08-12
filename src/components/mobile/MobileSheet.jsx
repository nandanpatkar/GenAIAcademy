import React, { useRef, useState, useEffect, useCallback, useId } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  const closeButtonRef = useRef(null);
  const lastFocusedElement = useRef(null);
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

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

  useEffect(() => {
    if (!open) return undefined;

    lastFocusedElement.current = document.activeElement;
    document.body.classList.add("msheet-open");
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.classList.remove("msheet-open");
      lastFocusedElement.current?.focus?.();
    };
  }, [open]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose?.();
      return;
    }

    if (event.key !== "Tab" || !sheetRef.current) return;
    const focusable = sheetRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, [onClose]);

  const sheetTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", damping: 32, stiffness: 300 };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="msheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.18 }}
            onClick={onClose}
            aria-hidden="true"
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
            transition={sheetTransition}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={handleKeyDown}
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
                  <div id={titleId} className="msheet-title">{title}</div>
                  {subtitle && <div className="msheet-subtitle">{subtitle}</div>}
                </div>
                <button
                  type="button"
                  className="msheet-close-btn"
                  onClick={onClose}
                  aria-label="Close"
                  ref={closeButtonRef}
                >
                  <X size={16} />
                </button>
              </div>

              {tabs && tabs.length > 0 && (
                <div className="msheet-tabs" role="tablist" aria-label={`${title} sections`}>
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      className={`msheet-tab ${activeTab === t.id ? "active" : ""}`}
                      onClick={() => onTabChange?.(t.id)}
                      aria-selected={activeTab === t.id}
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
