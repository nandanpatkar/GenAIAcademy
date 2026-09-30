import React, { useMemo, useState } from "react";
import { ArrowRight, Bug, Copy, MessageSquare, Plus, ShieldAlert } from "lucide-react";
import { problemBySlug, problems } from "../catalog";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { relativeTime } from "../lib/dates";
import { AREAS, OPEN_STATUSES, SEVERITIES, STATUSES, TRANSITIONS, applyTransition, bugToMarkdown, sanitizeUrl } from "../lib/bugs";
import { uid } from "../lib/store";
import { Badge, Dialog, EmptyState, Field, Panel, PrepPage, Tabs } from "../ui";

const statusLabel = (id) => STATUSES.find((entry) => entry.id === id)?.label || id;
const severityTone = { low: "neutral", medium: "info", high: "warning", critical: "danger" };
const statusTone = (id) => (OPEN_STATUSES.has(id) ? (id === "fixed" ? "success" : "accent") : "neutral");

const blankReport = () => ({ title: "", area: AREAS[0], problem: "", url: "", steps: "", expected: "", actual: "", severity: "medium", includeEnv: false });

function ReportForm({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(blankReport);
  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const cleanUrl = sanitizeUrl(form.url);
  const valid = form.title.trim().length >= 6 && form.actual.trim();
  return (
    <Dialog open={open} size="lg" title="Report an issue" description="Reports stay private on this device. Nothing is sent anywhere unless you copy it out." onClose={onClose}
      footer={<><button type="button" className="dsp-btn is-quiet" onClick={onClose}>Cancel</button><button type="button" className="dsp-btn is-primary" disabled={!valid} onClick={() => { onSubmit({ ...form, url: cleanUrl }); setForm(blankReport()); }}>Save report</button></>}
    >
      <Field label="Title" hint="One line: what went wrong, where."><input className="dsp-input" data-autofocus value={form.title} onChange={(event) => set({ title: event.target.value })} placeholder="e.g. Two Sum judge rejects a correct O(n) answer" /></Field>
      <div className="dsp-grid cols-2">
        <Field label="Area"><select className="dsp-select" value={form.area} onChange={(event) => set({ area: event.target.value })}>{AREAS.map((area) => <option key={area}>{area}</option>)}</select></Field>
        <Field label="Related problem (optional)"><select className="dsp-select" value={form.problem} onChange={(event) => set({ problem: event.target.value })}><option value="">None</option>{problems.map((problem) => <option key={problem.slug} value={problem.slug}>{problem.title}</option>)}</select></Field>
      </div>
      <Field label="Link (optional)" hint={form.url && cleanUrl !== form.url.trim() ? `Stored as: ${cleanUrl} — tokens and credentials are redacted.` : "Tokens, keys and passwords in links are redacted before saving."}><input className="dsp-input" value={form.url} onChange={(event) => set({ url: event.target.value })} placeholder="https://…" /></Field>
      <Field label="Steps to reproduce"><textarea className="dsp-textarea" value={form.steps} onChange={(event) => set({ steps: event.target.value })} placeholder={"1. Open …\n2. Click …"} /></Field>
      <div className="dsp-grid cols-2">
        <Field label="Expected"><textarea className="dsp-textarea" value={form.expected} onChange={(event) => set({ expected: event.target.value })} /></Field>
        <Field label="What actually happened"><textarea className="dsp-textarea" value={form.actual} onChange={(event) => set({ actual: event.target.value })} /></Field>
      </div>
      <div className="dsp-field">
        <span className="dsp-run-label">How bad is it? (your estimate)</span>
        <div className="dsp-chips">{SEVERITIES.map((entry) => <button type="button" key={entry.id} className={`dsp-chip${form.severity === entry.id ? " is-active" : ""}`} aria-pressed={form.severity === entry.id} onClick={() => set({ severity: entry.id })} title={entry.hint}>{entry.label}</button>)}</div>
      </div>
      <label className="dsp-check"><input type="checkbox" checked={form.includeEnv} onChange={(event) => set({ includeEnv: event.target.checked })} /> Include browser and screen size (helps reproduce — off by default)</label>
    </Dialog>
  );
}

function BugDetail({ bug, allBugs, onChange, openProblem }) {
  const [comment, setComment] = useState("");
  const [note, setNote] = useState("");
  const [dupOf, setDupOf] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const problem = bug.problem ? problemBySlug.get(bug.problem) : null;

  const move = (to) => {
    try {
      onChange(applyTransition(bug, to, { note, duplicateOf: to === "duplicate" ? dupOf : null }));
      setNote(""); setError("");
    } catch (err) { setError(err.message); }
  };
  const addComment = () => {
    if (!comment.trim()) return;
    const now = new Date().toISOString();
    onChange({ ...bug, updatedAt: now, timeline: [...bug.timeline, { kind: "comment", text: comment.trim(), at: now }] });
    setComment("");
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(bugToMarkdown(bug)); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setError("Clipboard is unavailable in this browser."); }
  };

  return (
    <div className="dsp-stack dsp-bug-detail">
      <header>
        <div className="dsp-row"><Badge tone={statusTone(bug.status)}>{statusLabel(bug.status)}</Badge><Badge tone={severityTone[bug.severity]}>{bug.severity}</Badge><Badge>{bug.area}</Badge><span className="dsp-muted dsp-small">#{bug.number} · opened {relativeTime(bug.createdAt)}</span></div>
        <h2>{bug.title}</h2>
      </header>
      {problem && <button type="button" className="dsp-btn is-small is-quiet" onClick={() => openProblem(problem.slug)}>{problem.title} <ArrowRight size={13} /></button>}
      <dl className="dsp-kv">
        {bug.url && <div><dt>Where</dt><dd className="dsp-mono dsp-small">{bug.url}</dd></div>}
        {bug.environment && <div><dt>Environment</dt><dd className="dsp-small">{bug.environment}</dd></div>}
        {bug.duplicateOf && <div><dt>Duplicate of</dt><dd>#{allBugs.find((entry) => entry.id === bug.duplicateOf)?.number} {allBugs.find((entry) => entry.id === bug.duplicateOf)?.title}</dd></div>}
      </dl>
      <div className="dsp-grid cols-3 dsp-bug-fields">
        <div><h3>Steps</h3><p>{bug.steps || "—"}</p></div>
        <div><h3>Expected</h3><p>{bug.expected || "—"}</p></div>
        <div><h3>Actual</h3><p>{bug.actual || "—"}</p></div>
      </div>

      <Panel title="Move to" subtitle="Each change is logged below with an optional note.">
        <div className="dsp-row">
          {(TRANSITIONS[bug.status] || []).map((to) => <button type="button" key={to} className="dsp-btn is-small" onClick={() => move(to)} disabled={to === "duplicate" && !dupOf}>{statusLabel(to)}</button>)}
        </div>
        {(TRANSITIONS[bug.status] || []).includes("duplicate") && (
          <select className="dsp-select dsp-dup-select" value={dupOf} onChange={(event) => setDupOf(event.target.value)} aria-label="Duplicate of">
            <option value="">Duplicate of… (pick to enable)</option>
            {allBugs.filter((entry) => entry.id !== bug.id).map((entry) => <option key={entry.id} value={entry.id}>#{entry.number} {entry.title}</option>)}
          </select>
        )}
        <input className="dsp-input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note for this change (optional)" aria-label="Status change note" />
        {error && <p className="dsp-error" role="alert">{error}</p>}
      </Panel>

      <Panel title="Timeline">
        <ol className="dsp-timeline">
          <li><b>Reported</b><small>{new Date(bug.createdAt).toLocaleString()}</small></li>
          {bug.timeline.map((entry, index) => (
            <li key={`${entry.at}-${index}`}>
              {entry.kind === "status" ? <b>{statusLabel(entry.from)} → {statusLabel(entry.to)}</b> : <b><MessageSquare size={12} /> Comment</b>}
              {(entry.note || entry.text) && <p>{entry.note || entry.text}</p>}
              <small>{new Date(entry.at).toLocaleString()}</small>
            </li>
          ))}
        </ol>
        <div className="dsp-row">
          <input className="dsp-input dsp-grow" value={comment} onChange={(event) => setComment(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addComment(); }} placeholder="Add a comment" aria-label="Comment" />
          <button type="button" className="dsp-btn" onClick={addComment} disabled={!comment.trim()}>Comment</button>
        </div>
      </Panel>
      <div className="dsp-row"><button type="button" className="dsp-btn is-small" onClick={copy}><Copy size={13} /> {copied ? "Copied" : "Copy as Markdown"}</button><span className="dsp-muted dsp-small">Redacted and ready to paste into a public issue tracker.</span></div>
    </div>
  );
}

export default function Buganizer({ openProblem }) {
  const [bugs, setBugs] = useStore(KEYS.bugs, []);
  const [tab, setTab] = useState("open");
  const [selectedId, setSelectedId] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const visible = useMemo(() => bugs
    .filter((bug) => (tab === "open" ? OPEN_STATUSES.has(bug.status) : tab === "closed" ? !OPEN_STATUSES.has(bug.status) : true))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [bugs, tab]);
  const selected = bugs.find((bug) => bug.id === selectedId) || visible[0] || null;

  const submit = (form) => {
    const now = new Date().toISOString();
    const bug = {
      id: uid("bug"),
      number: bugs.reduce((max, entry) => Math.max(max, entry.number || 0), 0) + 1,
      title: form.title.trim(),
      area: form.area,
      problem: form.problem || null,
      url: form.url,
      steps: form.steps.trim(),
      expected: form.expected.trim(),
      actual: form.actual.trim(),
      severity: form.severity,
      environment: form.includeEnv ? `${navigator.userAgent.slice(0, 160)} · ${window.innerWidth}×${window.innerHeight}` : null,
      status: "new",
      duplicateOf: null,
      createdAt: now,
      updatedAt: now,
      timeline: [],
    };
    setBugs((list) => [bug, ...list]);
    setSelectedId(bug.id);
    setTab("open");
    setFormOpen(false);
  };

  return (
    <PrepPage
      eyebrow="My Spaces"
      title="Buganizer"
      description="Track problems you hit — a wrong test case, a confusing statement, a planner glitch — from report to verified fix. Private to this device; copy a report out as redacted Markdown to share it."
      actions={<button type="button" className="dsp-btn is-primary" onClick={() => setFormOpen(true)}><Plus size={14} /> Report an issue</button>}
    >
      <Tabs value={tab} onChange={setTab} options={[{ id: "open", label: "Open", count: bugs.filter((bug) => OPEN_STATUSES.has(bug.status)).length }, { id: "closed", label: "Closed", count: bugs.filter((bug) => !OPEN_STATUSES.has(bug.status)).length }, { id: "all", label: "All", count: bugs.length }]} />
      <div className="dsp-grid split-left">
        <aside className="dsp-box">
          {visible.length ? (
            <ul className="dsp-list">
              {visible.map((bug) => (
                <li key={bug.id}>
                  <button type="button" className={`dsp-list-row${selected?.id === bug.id ? " is-selected" : ""}`} onClick={() => setSelectedId(bug.id)}>
                    <span className="dsp-list-icon"><Bug size={14} /></span>
                    <div><b>{bug.title}</b><small>#{bug.number} · {statusLabel(bug.status)} · {relativeTime(bug.updatedAt)}</small></div>
                    <Badge tone={severityTone[bug.severity]}>{bug.severity}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          ) : <EmptyState compact icon={Bug} title={tab === "open" ? "No open reports" : "Nothing here"} body="Report anything that looks wrong — it's your own tracker." />}
        </aside>
        <section className="dsp-box">
          {selected ? <BugDetail key={selected.id} bug={selected} allBugs={bugs} onChange={(next) => setBugs((list) => list.map((bug) => (bug.id === next.id ? next : bug)))} openProblem={openProblem} /> : <EmptyState icon={ShieldAlert} title="No report selected" body="Security problems shouldn't go here in plain text — report those privately to the maintainers." />}
        </section>
      </div>
      <ReportForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={submit} />
    </PrepPage>
  );
}
