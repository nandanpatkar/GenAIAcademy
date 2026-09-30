import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Clipboard, ClipboardCheck, Code2, Download, Eye, Maximize2, RotateCw, Wand2, X } from "lucide-react";
import { buildHtmlDocument, buildReactDocument } from "./sandbox";

/**
 * Claude-style artifact chrome for the coach: a card with the artifact's
 * title and kind, Preview / Code, copy, download, fullscreen and reload, and
 * a "Fix with AI" bar when a sandboxed artifact reports an error.
 *
 * `renderPreview({ full })` draws the artifact (full = inside the fullscreen
 * view). `code` / `language` / `filename` enable the Code tab and download.
 */

const HOST_SELECTOR = ".dsa-workspace-shell, .dcx-host";

export function ArtifactModal({ title, kind, onClose, children, actions }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div className="dcx-modal dcx dcx-artifact-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="dcx-modal-scrim" aria-label="Close" onClick={onClose} />
      <div className="dcx-modal-body is-artifact">
        <header>
          <b>{title}</b>
          {kind && <span className="dcx-kind">{kind}</span>}
          {actions}
          <button type="button" className="dcx-icon" onClick={onClose} aria-label="Close"><X size={15} /></button>
        </header>
        <div className="dcx-artifact-full">{children}</div>
      </div>
    </div>,
    document.querySelector(HOST_SELECTOR) || document.body,
  );
}

function CopyIcon({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="dcx-icon"
      aria-label={copied ? "Copied" : "Copy source"}
      title={copied ? "Copied" : "Copy source"}
      onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { /* blocked */ } }}
    >
      {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
    </button>
  );
}

const download = (filename, text, type = "text/plain") => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export function ArtifactShell({ icon: Icon, kind, title, code, language, filename, mime, renderPreview, error, onFix, onReload, className = "" }) {
  const [view, setView] = useState("preview");
  const [expanded, setExpanded] = useState(false);
  const hasCode = typeof code === "string" && code.length > 0;

  const tools = (
    <>
      {hasCode && (
        <div className="dcx-seg dcx-artifact-toggle" role="tablist" aria-label="View">
          <button type="button" role="tab" aria-selected={view === "preview"} className={view === "preview" ? "is-active" : ""} onClick={() => setView("preview")}><Eye size={12} /> Preview</button>
          <button type="button" role="tab" aria-selected={view === "code"} className={view === "code" ? "is-active" : ""} onClick={() => setView("code")}><Code2 size={12} /> Code</button>
        </div>
      )}
      {hasCode && <CopyIcon text={code} />}
      {hasCode && filename && <button type="button" className="dcx-icon" aria-label="Download" title={`Download ${filename}`} onClick={() => download(filename, code, mime)}><Download size={14} /></button>}
      {onReload && <button type="button" className="dcx-icon" aria-label="Reload" title="Reload" onClick={onReload}><RotateCw size={14} /></button>}
    </>
  );

  const body = (full) => (view === "code" && hasCode
    ? <pre className={`dcx-artifact-code${full ? " is-full" : ""}`} data-language={language}><code>{code}</code></pre>
    : renderPreview({ full }));

  return (
    <section className={`dcx-artifact ${className}`}>
      <header className="dcx-artifact-head">
        {Icon && <span className="dcx-card-icon"><Icon size={14} /></span>}
        <div className="dcx-card-title"><small>{kind}</small><h4>{title}</h4></div>
        <div className="dcx-artifact-tools">
          {tools}
          <button type="button" className="dcx-icon" aria-label="Open fullscreen" title="Fullscreen" onClick={() => setExpanded(true)}><Maximize2 size={14} /></button>
        </div>
      </header>
      {body(false)}
      {error && (
        <div className="dcx-artifact-error" role="alert">
          <AlertTriangle size={14} />
          <span>{error}</span>
          {onFix && <button type="button" className="dcx-btn is-ghost" onClick={onFix}><Wand2 size={13} /> Fix with AI</button>}
        </div>
      )}
      {expanded && (
        <ArtifactModal title={title} kind={kind} onClose={() => setExpanded(false)} actions={<div className="dcx-artifact-tools">{tools}</div>}>
          {body(true)}
        </ArtifactModal>
      )}
    </section>
  );
}

/* ── Sandboxed frame (HTML pages, React components) ────────────────────── */

const MIN_HEIGHT = 140;
const INLINE_MAX = 560;

/**
 * An <iframe sandbox="allow-scripts"> (opaque origin: no access to the app,
 * its storage or cookies) fed through srcdoc. The document inside posts its
 * height and errors, tagged with this frame's token.
 */
export function SandboxFrame({ source, mode = "html", theme = "dark", full = false, title, onError, reloadKey = 0 }) {
  const frameRef = useRef(null);
  const token = useMemo(() => Math.random().toString(36).slice(2) + Date.now().toString(36), [source, mode, theme, reloadKey]);
  const [height, setHeight] = useState(360);
  const doc = useMemo(
    () => (mode === "react" ? buildReactDocument(source, { token, theme }) : buildHtmlDocument(source, { token, theme })),
    [source, mode, token, theme],
  );
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data;
      if (!data || data.__dcx !== token || event.source !== frameRef.current?.contentWindow) return;
      if (data.type === "height" && Number.isFinite(data.height)) setHeight(Math.max(MIN_HEIGHT, Math.min(data.height, 4000)));
      if (data.type === "error") onErrorRef.current?.(String(data.message || "The artifact hit an error.").slice(0, 500));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [token]);

  return (
    <iframe
      ref={frameRef}
      key={token}
      className={`dcx-sandbox${full ? " is-full" : ""}`}
      title={title || "Artifact preview"}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      srcDoc={doc}
      style={full ? undefined : { height: Math.min(height, INLINE_MAX) }}
    />
  );
}
