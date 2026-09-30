import React, { useEffect, useRef, useState } from "react";
import { Check, ListPlus, Plus } from "lucide-react";
import { createListWith, toggleInList } from "./actions";
import { useStore } from "./hooks";
import { KEYS } from "./keys";

/**
 * "Add to list" popover: tick the lists a problem belongs to, or create a new
 * list with the problem already in it. Closes on outside click or Escape and
 * hands focus back to the trigger.
 */
export default function AddToList({ slug, title, compact = false, className = "" }) {
  const [lists] = useStore(KEYS.lists, []);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const active = lists.filter((list) => !list.archived);
  const memberCount = active.filter((list) => list.items.some((item) => item.slug === slug)).length;

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    const onKeyDown = (event) => { if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const create = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    createListWith(name.trim(), slug);
    setName("");
  };

  return (
    <div className={`dsp-popover-root ${className}`.trim()} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={compact ? `dsp-icon-btn${memberCount ? " is-active" : ""}` : `dsp-btn is-small${memberCount ? " is-active" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Add ${title || "problem"} to a list${memberCount ? ` (in ${memberCount})` : ""}`}
        title="Add to list"
      >
        <ListPlus size={15} />
        {!compact && <span>{memberCount ? `In ${memberCount} list${memberCount > 1 ? "s" : ""}` : "Add to list"}</span>}
      </button>
      {open && (
        <div className="dsp-popover" role="dialog" aria-label="Add to list">
          <strong>Save to list</strong>
          {active.length ? (
            <ul>
              {active.map((list) => {
                const checked = list.items.some((item) => item.slug === slug);
                return (
                  <li key={list.id}>
                    <button type="button" aria-pressed={checked} onClick={() => toggleInList(list.id, slug)}>
                      <span className={`dsp-popover-check${checked ? " is-checked" : ""}`}>{checked && <Check size={11} />}</span>
                      <span>{list.name}</span>
                      <small>{list.items.length}</small>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : <p>No lists yet — name one below.</p>}
          <form onSubmit={create}>
            <input className="dsp-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="New list name" aria-label="New list name" />
            <button type="submit" className="dsp-icon-btn" disabled={!name.trim()} aria-label="Create list"><Plus size={15} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
