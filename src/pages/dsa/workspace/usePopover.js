import { useEffect, useRef, useState } from "react";

/**
 * Open state for a small anchored menu: closes on an outside press or Escape,
 * and Escape hands focus back to the trigger (the first button in the root).
 */
export function usePopover() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      rootRef.current?.querySelector("button")?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return { open, setOpen, rootRef };
}

/** Arrow-key movement between a menu's items. */
export function moveMenuFocus(event) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  const menu = event.currentTarget.closest("[role='menu']");
  if (!menu) return;
  event.preventDefault();
  const items = [...menu.querySelectorAll("[role='menuitem'], [role='menuitemradio']")].filter((item) => !item.disabled);
  const index = items.indexOf(event.currentTarget);
  const next = (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
  items[next]?.focus();
}
