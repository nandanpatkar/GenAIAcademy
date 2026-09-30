import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertTriangle, ArrowRight, Check, Download, FilePenLine, FileText, Link2, NotebookPen, Plus, RotateCcw, Sparkles, Trash2, Upload, X,
} from "lucide-react";
import { problemBySlug, problems } from "../catalog";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { relativeTime } from "../lib/dates";
import { applyEdit, linkedProblem, makeNote, noteToMarkdown, purgeExpired, restore, safeFilename, searchNotes, trash, TRASH_DAYS } from "../lib/notes";
import { uid, updateStore } from "../lib/store";
import { Badge, ConfirmButton, EmptyState, PrepPage, SearchInput, Tabs, downloadFile, readFileText } from "../ui";

// Problem links are edited here; other links (an AI from Scratch lesson) are
// kept as they are and shown by their stored title.
const otherLinks = (note) => (note.links || []).filter((link) => link.type !== "problem");
const linkSummary = (note) => (linkedProblem(note) ? problemBySlug.get(linkedProblem(note))?.title || "problem" : otherLinks(note)[0]?.title || "");

const FILTERS = [
  { id: "all", label: "All" },
  { id: "linked", label: "Linked" },
  { id: "drafts", label: "AI drafts" },
  { id: "trash", label: "Trash" },
];

function ProblemLinkPicker({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? problems.filter((problem) => problem.title.toLowerCase().includes(needle)).slice(0, 8) : [];
  }, [query]);
  const current = value ? problemBySlug.get(value) : null;
  if (current) {
    return <span className="dsp-link-chip"><Link2 size={12} /> {current.title}<button type="button" onClick={() => onChange(null)} aria-label="Unlink problem"><X size={12} /></button></span>;
  }
  return (
    <div className="dsp-popover-root">
      <input className="dsp-input dsp-link-input" value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} placeholder="Link a problem…" aria-label="Link a problem" />
      {open && matches.length > 0 && (
        <div className="dsp-popover is-left">
          <ul>{matches.map((problem) => <li key={problem.slug}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(problem.slug); setQuery(""); setOpen(false); }}><span>{problem.title}</span><small>{problem.difficulty}</small></button></li>)}</ul>
        </div>
      )}
    </div>
  );
}

function Editor({ note, openProblem, navigate }) {
  // The editor holds its own copy; saves carry the version it started from.
  const [draft, setDraft] = useState(() => ({ title: note.title, body: note.body, tags: note.tags.join(", "), link: linkedProblem(note) }));
  const [status, setStatus] = useState("saved");
  const [conflict, setConflict] = useState(null);
  const [view, setView] = useState("write");
  const versionRef = useRef(note.version);
  const dirtyRef = useRef(false);

  const save = (force = false, extra = {}) => {
    let outcome = null;
    updateStore(KEYS.notes, [], (list) => {
      const index = list.findIndex((entry) => entry.id === note.id);
      if (index < 0) return list;
      const patch = { title: draft.title, body: draft.body, tags: draft.tags, links: [...otherLinks(list[index]), ...(draft.link ? [{ type: "problem", slug: draft.link }] : [])], ...extra };
      outcome = applyEdit(list[index], patch, force ? null : versionRef.current);
      if (!outcome.ok) return list;
      const copy = [...list];
      copy[index] = outcome.note;
      return copy;
    });
    if (outcome?.ok) { versionRef.current = outcome.note.version; dirtyRef.current = false; setStatus("saved"); setConflict(null); }
    else if (outcome) { setStatus("conflict"); setConflict(outcome.conflict); }
  };

  useEffect(() => {
    if (!dirtyRef.current || conflict) return undefined;
    setStatus("saving");
    const timer = window.setTimeout(() => save(), 600);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const edit = (patch) => { dirtyRef.current = true; setDraft((prev) => ({ ...prev, ...patch })); };
  const takeTheirs = () => {
    setDraft({ title: conflict.title, body: conflict.body, tags: conflict.tags.join(", "), link: linkedProblem(conflict) });
    versionRef.current = conflict.version;
    dirtyRef.current = false;
    setConflict(null);
    setStatus("saved");
  };
  const mergeBoth = () => {
    versionRef.current = conflict.version;
    dirtyRef.current = true;
    setConflict(null);
    setDraft((prev) => ({ ...prev, body: `${conflict.body}\n\n---\n\n${prev.body}` }));
  };
  // Promoting an AI draft is an ordinary versioned edit, so it can't race autosave.
  const keepAsMine = () => {
    const tags = draft.tags.split(",").map((entry) => entry.trim()).filter((entry) => entry && entry !== "ai-draft").join(", ");
    setDraft((prev) => ({ ...prev, tags }));
    save(false, { draft: false, source: "manual", tags });
  };

  const linked = draft.link ? problemBySlug.get(draft.link) : null;

  return (
    <div className="dsp-note-editor">
      {note.draft && (
        <div className="dsp-notice"><Sparkles size={16} /><span><b>AI draft.</b> Generated from a workspace answer — read it, fix what's wrong, then keep it as your note. <button type="button" className="dsp-link" onClick={keepAsMine}>Keep as my note</button></span></div>
      )}
      {conflict && (
        <div className="dsp-notice is-warning" role="alert">
          <AlertTriangle size={16} />
          <div className="dsp-stack">
            <span><b>This note changed somewhere else</b> (the workspace notes tab or another browser tab) {relativeTime(conflict.updatedAt)}. Autosave is paused so neither version is lost.</span>
            <div className="dsp-row">
              <button type="button" className="dsp-btn is-small" onClick={takeTheirs}>Use the other version</button>
              <button type="button" className="dsp-btn is-small" onClick={mergeBoth}>Keep both (merge)</button>
              <button type="button" className="dsp-btn is-small is-quiet" onClick={() => save(true)}>Overwrite with mine</button>
            </div>
          </div>
        </div>
      )}
      <input className="dsp-note-title" value={draft.title} onChange={(event) => edit({ title: event.target.value })} aria-label="Note title" placeholder="Untitled note" />
      <div className="dsp-row dsp-note-meta">
        <input className="dsp-input dsp-tag-input" value={draft.tags} onChange={(event) => edit({ tags: event.target.value })} placeholder="Tags, comma separated" aria-label="Tags" />
        <ProblemLinkPicker value={draft.link} onChange={(slug) => edit({ link: slug })} />
        {linked && <button type="button" className="dsp-btn is-small is-quiet" onClick={() => openProblem(linked.slug)}>Open problem <ArrowRight size={13} /></button>}
        {otherLinks(note).map((link) => (
          <button key={`${link.type}-${link.slug}`} type="button" className="dsp-link-chip dsp-link-chip-button" onClick={() => navigate?.(link.type, { slug: link.slug })} title="Open lesson">
            <Link2 size={12} /> {link.title} <ArrowRight size={12} />
          </button>
        ))}
      </div>
      <Tabs value={view} onChange={setView} options={[{ id: "write", label: "Write", icon: FilePenLine }, { id: "preview", label: "Preview", icon: FileText }]} label="Editor mode" />
      {view === "write"
        ? <textarea className="dsp-textarea dsp-note-body" value={draft.body} onChange={(event) => edit({ body: event.target.value })} placeholder="Key insight, invariant, edge cases, complexity… Markdown supported." aria-label="Note body" />
        : <div className="dsp-markdown dsp-note-preview">{draft.body.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.body}</ReactMarkdown> : <p className="dsp-muted">Nothing to preview yet.</p>}</div>}
      <footer className="dsp-note-foot">
        <span className={`dsp-save-state is-${status}`}>{status === "saving" ? "Saving…" : status === "conflict" ? "Not saved — resolve the conflict" : <><Check size={12} /> Saved · v{versionRef.current}</>}</span>
        <div className="dsp-row">
          <button type="button" className="dsp-btn is-small is-quiet" onClick={() => downloadFile(`${safeFilename(draft.title)}.md`, noteToMarkdown({ ...note, title: draft.title, body: draft.body, tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean) }, linked?.title), "text/markdown")}><Download size={13} /> .md</button>
          <button type="button" className="dsp-btn is-small is-quiet" onClick={() => updateStore(KEYS.notes, [], (list) => list.map((entry) => (entry.id === note.id ? trash(entry) : entry)))}><Trash2 size={13} /> Move to trash</button>
        </div>
      </footer>
    </div>
  );
}

export default function Notes({ params, openProblem, navigate }) {
  const [notes, setNotes] = useStore(KEYS.notes, []);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [selectedId, setSelectedId] = useState(params?.noteId || "");
  const fileRef = useRef(null);

  useEffect(() => { setNotes((list) => purgeExpired(list)); }, [setNotes]);

  const live = notes.filter((note) => !note.deletedAt);
  const tags = useMemo(() => [...new Set(live.flatMap((note) => note.tags))].sort(), [live]);
  const visible = useMemo(() => {
    let list = filter === "trash" ? notes.filter((note) => note.deletedAt) : live;
    if (filter === "linked") list = list.filter((note) => note.links?.length);
    if (filter === "drafts") list = list.filter((note) => note.draft);
    if (tag) list = list.filter((note) => note.tags.includes(tag));
    return searchNotes(list, query).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filter, live, notes, query, tag]);
  const selected = notes.find((note) => note.id === selectedId && !note.deletedAt);

  const create = () => {
    const note = makeNote({ id: uid("note"), title: "Untitled note" });
    setNotes((list) => [note, ...list]);
    setFilter("all");
    setSelectedId(note.id);
  };

  const exportAll = async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    const used = new Set();
    live.forEach((note) => {
      let name = safeFilename(note.title);
      while (used.has(name)) name = `${name}-1`;
      used.add(name);
      zip.file(`${name}.md`, noteToMarkdown(note, problemBySlug.get(linkedProblem(note))?.title));
    });
    zip.file("manifest.json", JSON.stringify({ format: "dsa-prep-notes", version: 1, exportedAt: new Date().toISOString(), count: live.length }, null, 2));
    downloadFile("notes.zip", await zip.generateAsync({ type: "blob" }));
  };

  const importFiles = async (event) => {
    const files = [...(event.target.files || [])];
    event.target.value = "";
    const imported = [];
    for (const file of files) {
      const text = await readFileText(file);
      const front = text.match(/^---\n([\s\S]*?)\n---\n?/);
      const title = front?.[1].match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] || file.name.replace(/\.(md|markdown|txt)$/i, "");
      const tagLine = front?.[1].match(/^tags:\s*\[(.*)\]\s*$/m)?.[1] || "";
      imported.push(makeNote({ id: uid("note"), title, body: front ? text.slice(front[0].length) : text, tags: tagLine.split(",").map((entry) => entry.replace(/"/g, "").trim()), source: "manual" }));
    }
    if (imported.length) { setNotes((list) => [...imported, ...list]); setSelectedId(imported[0].id); }
  };

  return (
    <PrepPage
      eyebrow="My Spaces"
      title="Notes"
      description={`Private Markdown notes, stored on this device. Link them to problems and they show up in the workspace notes tab. Deleted notes stay in the trash for ${TRASH_DAYS} days.`}
      actions={(
        <>
          <input ref={fileRef} type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" multiple hidden onChange={importFiles} />
          <button type="button" className="dsp-btn is-quiet" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import .md</button>
          <button type="button" className="dsp-btn" onClick={exportAll} disabled={!live.length}><Download size={14} /> Export all</button>
          <button type="button" className="dsp-btn is-primary" onClick={create}><Plus size={15} /> New note</button>
        </>
      )}
    >
      <div className="dsp-grid split-left dsp-notes-layout">
        <aside className="dsp-box dsp-note-list">
          <SearchInput value={query} onChange={setQuery} placeholder="Search notes" />
          <div className="dsp-chips">{FILTERS.map((entry) => <button type="button" key={entry.id} className={`dsp-chip${filter === entry.id ? " is-active" : ""}`} aria-pressed={filter === entry.id} onClick={() => setFilter(entry.id)}>{entry.label}</button>)}</div>
          {tags.length > 0 && filter !== "trash" && <div className="dsp-chips">{tags.slice(0, 14).map((entry) => <button type="button" key={entry} className={`dsp-chip${tag === entry ? " is-active" : ""}`} onClick={() => setTag(tag === entry ? "" : entry)}>#{entry}</button>)}</div>}
          {visible.length ? (
            <ul className="dsp-list">
              {visible.map((note) => (
                <li key={note.id}>
                  {filter === "trash" ? (
                    <div className="dsp-list-row">
                      <span className="dsp-list-icon"><Trash2 size={14} /></span>
                      <div><b>{note.title}</b><small>Deleted {relativeTime(note.deletedAt)}</small></div>
                      <button type="button" className="dsp-icon-btn" onClick={() => setNotes((list) => list.map((entry) => (entry.id === note.id ? restore(entry) : entry)))} aria-label={`Restore ${note.title}`}><RotateCcw size={14} /></button>
                      <ConfirmButton className="dsp-btn is-small is-danger" confirmLabel="Sure?" aria-label={`Delete ${note.title} forever`} onConfirm={() => setNotes((list) => list.filter((entry) => entry.id !== note.id))}>Delete</ConfirmButton>
                    </div>
                  ) : (
                    <button type="button" className={`dsp-list-row${note.id === selectedId ? " is-selected" : ""}`} onClick={() => setSelectedId(note.id)}>
                      <span className="dsp-list-icon">{note.draft ? <Sparkles size={14} /> : <NotebookPen size={14} />}</span>
                      <div><b>{note.title}</b><small>{relativeTime(note.updatedAt)}{linkSummary(note) ? ` · ${linkSummary(note)}` : ""}</small></div>
                      {note.draft && <Badge tone="accent">Draft</Badge>}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : <EmptyState compact icon={NotebookPen} title={filter === "trash" ? "Trash is empty" : "No notes here"} body={filter === "trash" ? "" : "Create one, or write notes from a problem's Notes tab."} />}
        </aside>
        <section className="dsp-box">
          {selected
            ? <Editor key={selected.id} note={selected} openProblem={openProblem} navigate={navigate} />
            : <EmptyState icon={FileText} title="Pick a note" body="Select a note on the left or start a new one." action={<button type="button" className="dsp-btn" onClick={create}><Plus size={14} /> New note</button>} />}
        </section>
      </div>
    </PrepPage>
  );
}
