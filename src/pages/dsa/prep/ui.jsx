import React, { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";

/* Shared building blocks for the prep sections. Styling lives in DsaPrep.css
   under the `dsp-` prefix and reads the hub's --dsa-* tokens, so everything
   follows the light/dark switch without per-component overrides. */

export function PrepPage({ eyebrow, title, description, actions, children, className = "" }) {
  return (
    <div className={`dsp-page ${className}`.trim()}>
      <header className="dsp-page-head">
        <div>
          {eyebrow && <span className="dsp-eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="dsp-page-actions">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function Panel({ title, subtitle, actions, children, className = "", as: Tag = "section" }) {
  return (
    <Tag className={`dsp-box ${className}`.trim()}>
      {(title || actions) && (
        <header className="dsp-box-head">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="dsp-box-actions">{actions}</div>}
        </header>
      )}
      {children}
    </Tag>
  );
}

export function EmptyState({ icon: Icon, title, body, action, compact = false }) {
  return (
    <div className={`dsp-empty${compact ? " is-compact" : ""}`}>
      {Icon && <span className="dsp-empty-icon"><Icon size={compact ? 18 : 22} /></span>}
      <strong>{title}</strong>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}

export function Stat({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className={`dsp-stat${tone ? ` is-${tone}` : ""}`}>
      <span className="dsp-stat-label">{Icon && <Icon size={14} />}{label}</span>
      <b className="dsp-stat-value">{value}</b>
      {hint && <small>{hint}</small>}
    </div>
  );
}

/** ARIA tabs with arrow-key movement. `options`: [{ id, label, count?, icon? }]. */
export function Tabs({ value, onChange, options, label = "Views", className = "" }) {
  const onKeyDown = (event, index) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = options[(index + (event.key === "ArrowRight" ? 1 : -1) + options.length) % options.length];
    onChange(next.id);
    event.currentTarget.parentElement.querySelectorAll("[role='tab']")[options.indexOf(next)]?.focus();
  };
  return (
    <div className={`dsp-tabs ${className}`.trim()} role="tablist" aria-label={label}>
      {options.map((option, index) => {
        const Icon = option.icon;
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={active ? "is-active" : ""}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {Icon && <Icon size={14} />}
            {option.label}
            {option.count != null && <span className="dsp-count">{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Numerator/denominator progress — never a bare percentage. */
export function Progress({ value, max, label, showNumbers = true, tone }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`dsp-progress${tone ? ` is-${tone}` : ""}`}>
      {(label || showNumbers) && (
        <div className="dsp-progress-meta">
          {label && <span>{label}</span>}
          {showNumbers && <b>{value}/{max}{max ? ` · ${pct}%` : ""}</b>}
        </div>
      )}
      <div className="dsp-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label || "Progress"}>
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function DifficultyPill({ difficulty }) {
  const key = String(difficulty || "unknown").toLowerCase();
  return <span className={`dsa-difficulty ${key}`}>{difficulty || "Unknown"}</span>;
}

export function Badge({ children, tone = "neutral", title }) {
  return <span className={`dsp-badge is-${tone}`} title={title}>{children}</span>;
}

export function Field({ label, hint, error, children, className = "" }) {
  const id = useId();
  const child = React.isValidElement(children) ? React.cloneElement(children, { id: children.props.id || id, "aria-describedby": hint ? `${id}-hint` : undefined }) : children;
  return (
    <div className={`dsp-field ${className}`.trim()}>
      <label htmlFor={child?.props?.id || id}>{label}</label>
      {child}
      {hint && !error && <small id={`${id}-hint`}>{hint}</small>}
      {error && <small className="is-error" role="alert">{error}</small>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search", label }) {
  return (
    <label className="dsp-search">
      <span className="sr-only">{label || placeholder}</span>
      <Search size={15} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {value && <button type="button" onClick={() => onChange("")} aria-label="Clear search"><X size={13} /></button>}
    </label>
  );
}

/**
 * Modal dialog: Escape closes, focus moves in on open and returns to the
 * trigger on close, and Tab cycles inside the dialog.
 */
export function Dialog({ open, title, description, onClose, children, footer, size = "md" }) {
  const panelRef = useRef(null);
  const returnRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    returnRef.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = () => [...panel.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((node) => !node.disabled);
    window.setTimeout(() => (panel.querySelector("[data-autofocus]") || focusables()[0] || panel).focus(), 0);
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); return; }
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    panel.addEventListener("keydown", onKeyDown);
    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      if (returnRef.current?.focus) returnRef.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="dsp-dialog-layer">
      <button type="button" className="dsp-dialog-scrim" onClick={onClose} aria-label="Close dialog" tabIndex={-1} />
      <div className={`dsp-dialog is-${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} tabIndex={-1}>
        <header>
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="dsp-icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </header>
        <div className="dsp-dialog-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

/** Destructive action that needs a second click within a few seconds. */
export function ConfirmButton({ onConfirm, children, confirmLabel = "Click again to confirm", className = "dsp-btn is-danger", ...rest }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return undefined;
    const timer = window.setTimeout(() => setArmed(false), 3500);
    return () => window.clearTimeout(timer);
  }, [armed]);
  return (
    <button
      type="button"
      className={`${className}${armed ? " is-armed" : ""}`}
      onClick={() => { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); }}
      {...rest}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}

/** Download a string as a file. */
export function downloadFile(filename, content, type = "application/json") {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Read a user-picked file as text. */
export const readFileText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.onerror = () => reject(reader.error || new Error("Could not read the file."));
  reader.readAsText(file);
});
