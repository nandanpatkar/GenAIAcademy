import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The "@" menu. `groups` come from the coach's adapter: each is either a
 * single toggle ({ id, icon, label, item }) or a submenu ({ id, icon, label,
 * items, empty }). An item is { key, type, label, short? }.
 */
export default function ContextMenu({ groups, selected, onToggle, onClose }) {
  const [group, setGroup] = useState(null);
  const ref = useRef(null);
  const active = group ? groups.find((entry) => entry.id === group) : null;
  const isOn = (item) => selected.some((entry) => entry.key === item.key);

  useEffect(() => {
    const first = ref.current?.querySelector("button");
    first?.focus();
  }, [group]);

  useEffect(() => {
    const onDown = (event) => { if (ref.current && !ref.current.contains(event.target) && !event.target.closest?.("[data-dcx-at]")) onClose(); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [onClose]);

  const onKeyDown = (event) => {
    const buttons = [...ref.current.querySelectorAll("button:not(:disabled)")];
    const index = buttons.indexOf(document.activeElement);
    if (event.key === "Escape") { event.preventDefault(); if (active) setGroup(null); else onClose(); }
    if (event.key === "ArrowDown") { event.preventDefault(); buttons[(index + 1) % buttons.length]?.focus(); }
    if (event.key === "ArrowUp") { event.preventDefault(); buttons[(index - 1 + buttons.length) % buttons.length]?.focus(); }
    if (event.key === "ArrowLeft" && active) { event.preventDefault(); setGroup(null); }
  };

  return (
    <div className="dcx-ctx" role="menu" aria-label="Add context" ref={ref} onKeyDown={onKeyDown}>
      {active ? (
        <>
          <button type="button" className="dcx-ctx-back" onClick={() => setGroup(null)}><ChevronLeft size={14} /> {active.label}</button>
          {active.items.length ? active.items.map((item) => (
            <button type="button" role="menuitemcheckbox" aria-checked={isOn(item)} key={item.key} onClick={() => onToggle(item)}>
              <span>{item.short || item.label}</span>{isOn(item) && <Check size={14} />}
            </button>
          )) : <p className="dcx-ctx-empty">{active.empty}</p>}
        </>
      ) : groups.map((entry) => {
        const Icon = entry.icon;
        if (entry.item) {
          return (
            <button type="button" role="menuitemcheckbox" aria-checked={isOn(entry.item)} key={entry.id} onClick={() => onToggle(entry.item)}>
              <Icon size={14} /><span>{entry.label}</span>{isOn(entry.item) && <Check size={14} />}
            </button>
          );
        }
        const count = entry.items.filter(isOn).length;
        return (
          <button type="button" role="menuitem" aria-haspopup="menu" key={entry.id} onClick={() => setGroup(entry.id)}>
            <Icon size={14} /><span>{entry.label}</span>{count > 0 && <em>{count}</em>}<ChevronRight size={14} />
          </button>
        );
      })}
    </div>
  );
}
