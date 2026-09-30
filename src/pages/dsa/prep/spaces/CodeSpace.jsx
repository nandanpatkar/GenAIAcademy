import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown, Download, FileCode2, FilePlus2, Folder, FolderPlus, History, Pencil, RotateCcw, Save, Trash2, X,
} from "lucide-react";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { relativeTime } from "../lib/dates";
import { addRevision, exportEntries, hasUnsavedChanges, languageOf, MAX_FILE_CHARS, STARTERS, validateName } from "../lib/codespace";
import { uid, updateStore } from "../lib/store";
import { Badge, ConfirmButton, EmptyState, Field, PrepPage, downloadFile } from "../ui";
import { CodeEditor, RunPanel } from "./CodeTools";

const EMPTY = { folders: [], files: [] };

export function createCodeFile({ name, content, folderName }) {
  let createdId = "";
  updateStore(KEYS.codespace, EMPTY, (state) => {
    let folders = state.folders;
    let folderId = null;
    if (folderName) {
      const existing = folders.find((folder) => folder.name.toLowerCase() === folderName.toLowerCase());
      if (existing) folderId = existing.id;
      else { folderId = uid("dir"); folders = [...folders, { id: folderId, name: folderName }]; }
    }
    const siblings = state.files.filter((file) => !file.deletedAt && file.folderId === folderId).map((file) => file.name);
    let finalName = name;
    for (let n = 2; siblings.some((sibling) => sibling.toLowerCase() === finalName.toLowerCase()); n += 1) finalName = name.replace(/(\.[^.]+)?$/, `-${n}$1`);
    const now = new Date().toISOString();
    const file = addRevision({ id: uid("file"), folderId, name: finalName, content: String(content || "").slice(0, MAX_FILE_CHARS), revisions: [], createdAt: now, updatedAt: now, deletedAt: null }, "Created", now).file;
    createdId = file.id;
    return { folders, files: [...state.files, file] };
  });
  return createdId;
}

function NewItemForm({ kind, folders, siblingsFor, onCreate, onCancel }) {
  const [name, setName] = useState(kind === "file" ? "solution.py" : "");
  const [folderId, setFolderId] = useState("");
  const error = name ? validateName(name, siblingsFor(folderId || null), { requireExtension: kind === "file" }) : null;
  return (
    <form className="dsp-stack dsp-new-item" onSubmit={(event) => { event.preventDefault(); if (!error && name.trim()) onCreate(name.trim(), folderId || null); }}>
      <Field label={kind === "file" ? "File name" : "Folder name"} error={error}><input className="dsp-input" value={name} onChange={(event) => setName(event.target.value)} data-autofocus autoFocus /></Field>
      {kind === "file" && folders.length > 0 && <select className="dsp-select" value={folderId} onChange={(event) => setFolderId(event.target.value)} aria-label="Folder"><option value="">No folder</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select>}
      <div className="dsp-row"><button type="submit" className="dsp-btn is-small is-primary" disabled={Boolean(error) || !name.trim()}>Create</button><button type="button" className="dsp-btn is-small is-quiet" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}

function FileEditor({ file, siblings, onRename }) {
  const [content, setContent] = useState(file.content);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [savedNote, setSavedNote] = useState("");
  const language = languageOf(file.name);
  const renameError = renaming ? validateName(newName, siblings.filter((name) => name !== file.name), { requireExtension: true }) : null;

  // Keep the working copy in storage (debounced) so nothing is lost on reload.
  useEffect(() => {
    if (content === file.content) return undefined;
    const timer = window.setTimeout(() => updateStore(KEYS.codespace, EMPTY, (state) => ({ ...state, files: state.files.map((entry) => (entry.id === file.id ? { ...entry, content: content.slice(0, MAX_FILE_CHARS), updatedAt: new Date().toISOString() } : entry)) })), 400);
    return () => window.clearTimeout(timer);
  }, [content, file.content, file.id]);

  const saveRevision = () => {
    let added = false;
    updateStore(KEYS.codespace, EMPTY, (state) => ({
      ...state,
      files: state.files.map((entry) => {
        if (entry.id !== file.id) return entry;
        const result = addRevision({ ...entry, content }, message);
        added = result.added;
        return result.file;
      }),
    }));
    setSavedNote(added ? "Revision saved" : "No changes since the last revision");
    setMessage("");
    window.setTimeout(() => setSavedNote(""), 2200);
  };

  const unsaved = hasUnsavedChanges({ ...file, content });

  return (
    <div className="dsp-code-editor">
      <header className="dsp-code-head">
        {renaming ? (
          <form className="dsp-row" onSubmit={(event) => { event.preventDefault(); if (!renameError) { onRename(newName.trim()); setRenaming(false); } }}>
            <input className="dsp-input dsp-rename" value={newName} onChange={(event) => setNewName(event.target.value)} aria-label="New file name" autoFocus />
            <button type="submit" className="dsp-btn is-small" disabled={Boolean(renameError)}>Rename</button>
            <button type="button" className="dsp-icon-btn" onClick={() => setRenaming(false)} aria-label="Cancel rename"><X size={14} /></button>
            {renameError && <small className="dsp-error">{renameError}</small>}
          </form>
        ) : (
          <div className="dsp-row">
            <FileCode2 size={16} className="dsp-muted" />
            <b>{file.name}</b>
            <button type="button" className="dsp-icon-btn" onClick={() => { setNewName(file.name); setRenaming(true); }} aria-label="Rename file"><Pencil size={13} /></button>
            <Badge>{language.label}</Badge>
            {unsaved ? <Badge tone="warning">Unsaved revision</Badge> : <Badge tone="success">Saved</Badge>}
          </div>
        )}
        <div className="dsp-row">
          <input className="dsp-input dsp-rev-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Revision note (optional)" aria-label="Revision note" />
          <button type="button" className="dsp-btn is-small is-primary" onClick={saveRevision}><Save size={13} /> Save revision</button>
          <button type="button" className={`dsp-btn is-small${showHistory ? " is-active" : ""}`} onClick={() => setShowHistory((value) => !value)} aria-pressed={showHistory}><History size={13} /> {file.revisions.length}</button>
          <button type="button" className="dsp-icon-btn" onClick={() => downloadFile(file.name, content, "text/plain")} aria-label="Download file"><Download size={14} /></button>
        </div>
      </header>
      {savedNote && <p className="dsp-muted dsp-small" role="status">{savedNote}</p>}

      <div className={`dsp-code-body${showHistory ? " has-history" : ""}`}>
        <div className="dsp-code-monaco">
          <CodeEditor value={viewing ? viewing.content : content} language={language.monaco} onChange={viewing ? undefined : setContent} readOnly={Boolean(viewing)} />
        </div>
        {showHistory && (
          <aside className="dsp-history">
            <strong>Revisions</strong>
            {viewing && <div className="dsp-notice"><span>Viewing “{viewing.message}” read-only.</span><div className="dsp-row"><button type="button" className="dsp-btn is-small is-primary" onClick={() => { setContent(viewing.content); setViewing(null); }}><RotateCcw size={12} /> Restore</button><button type="button" className="dsp-btn is-small is-quiet" onClick={() => setViewing(null)}>Back to editing</button></div></div>}
            <ul>
              {[...file.revisions].reverse().map((revision) => (
                <li key={revision.id}>
                  <button type="button" className={viewing?.id === revision.id ? "is-active" : ""} onClick={() => setViewing(revision)}>
                    <b>{revision.message}</b>
                    <small>{relativeTime(revision.at)} · {revision.size} chars · #{revision.hash.slice(0, 6)}</small>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
      <RunPanel code={content} runLanguage={language.run} />
    </div>
  );
}

export default function CodeSpace({ params }) {
  const [state, setState] = useStore(KEYS.codespace, EMPTY);
  const [selectedId, setSelectedId] = useState(params?.fileId || "");
  const [creating, setCreating] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [showTrash, setShowTrash] = useState(false);

  const liveFiles = state.files.filter((file) => !file.deletedAt);
  const trashed = state.files.filter((file) => file.deletedAt);
  const selected = liveFiles.find((file) => file.id === selectedId) || null;
  const siblingsFor = (folderId) => liveFiles.filter((file) => file.folderId === folderId).map((file) => file.name);
  const tree = useMemo(() => [
    ...state.folders.map((folder) => ({ folder, files: liveFiles.filter((file) => file.folderId === folder.id).sort((a, b) => a.name.localeCompare(b.name)) })),
    { folder: null, files: liveFiles.filter((file) => !file.folderId || !state.folders.some((folder) => folder.id === file.folderId)).sort((a, b) => a.name.localeCompare(b.name)) },
  ], [liveFiles, state.folders]);

  const createFile = (name, folderId) => {
    const run = languageOf(name).run;
    const folderName = state.folders.find((folder) => folder.id === folderId)?.name;
    const id = createCodeFile({ name, content: run ? STARTERS[run] : "", folderName });
    setSelectedId(id);
    setCreating(null);
  };
  const createFolder = (name) => {
    setState((current) => ({ ...current, folders: [...current.folders, { id: uid("dir"), name }] }));
    setCreating(null);
  };
  const renameFile = (id, name) => setState((current) => ({ ...current, files: current.files.map((file) => (file.id === id ? { ...file, name, updatedAt: new Date().toISOString() } : file)) }));
  const trashFile = (id) => { setState((current) => ({ ...current, files: current.files.map((file) => (file.id === id ? { ...file, deletedAt: new Date().toISOString() } : file)) })); setSelectedId(""); };
  const deleteFolder = (folderId) => setState((current) => ({ folders: current.folders.filter((folder) => folder.id !== folderId), files: current.files.map((file) => (file.folderId === folderId ? { ...file, folderId: null } : file)) }));

  const exportZip = async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    const entries = exportEntries(state);
    entries.forEach((entry) => zip.file(entry.path, entry.content));
    zip.file("manifest.json", JSON.stringify({ format: "dsa-prep-codespace", version: 1, exportedAt: new Date().toISOString(), files: entries.map(({ path, revisions }) => ({ path, revisions })) }, null, 2));
    downloadFile("codespace.zip", await zip.generateAsync({ type: "blob" }));
  };

  return (
    <PrepPage
      eyebrow="My Spaces"
      title="CodeSpace"
      description="Keep your own solutions and snippets in folders, with an explicit revision history. Files live on this device; export the lot as a ZIP whenever you like."
      actions={(
        <>
          <button type="button" className="dsp-btn is-quiet" onClick={() => setCreating("folder")}><FolderPlus size={14} /> Folder</button>
          <button type="button" className="dsp-btn" onClick={() => setCreating("file")}><FilePlus2 size={14} /> New file</button>
          <button type="button" className="dsp-btn" onClick={exportZip} disabled={!liveFiles.length}><Download size={14} /> Export ZIP</button>
        </>
      )}
    >
      <div className="dsp-grid split-left">
        <aside className="dsp-box dsp-stack dsp-tree">
          {creating && <NewItemForm key={creating} kind={creating} folders={state.folders} siblingsFor={creating === "file" ? siblingsFor : () => state.folders.map((folder) => folder.name)} onCreate={creating === "file" ? createFile : createFolder} onCancel={() => setCreating(null)} />}
          {!liveFiles.length && !state.folders.length && !creating && <EmptyState compact icon={FileCode2} title="Nothing here yet" body="Create a file, or save one from the IDE." action={<button type="button" className="dsp-btn is-small" onClick={() => setCreating("file")}>New file</button>} />}
          {tree.map(({ folder, files }) => ((folder || files.length) ? (
            <div key={folder?.id || "root"} className="dsp-tree-group">
              {folder && (
                <div className="dsp-tree-folder">
                  <button type="button" onClick={() => setCollapsed((prev) => ({ ...prev, [folder.id]: !prev[folder.id] }))} aria-expanded={!collapsed[folder.id]}>
                    <ChevronDown size={13} className={collapsed[folder.id] ? "is-collapsed" : ""} /><Folder size={14} /> {folder.name} <small>{files.length}</small>
                  </button>
                  {!files.length && <button type="button" className="dsp-icon-btn" onClick={() => deleteFolder(folder.id)} aria-label={`Delete empty folder ${folder.name}`}><Trash2 size={13} /></button>}
                </div>
              )}
              {!(folder && collapsed[folder.id]) && files.map((file) => (
                <div key={file.id} className={`dsp-tree-file${file.id === selectedId ? " is-selected" : ""}${folder ? " is-nested" : ""}`}>
                  <button type="button" onClick={() => setSelectedId(file.id)}><FileCode2 size={13} /> <span>{file.name}</span></button>
                  <button type="button" className="dsp-icon-btn" onClick={() => trashFile(file.id)} aria-label={`Move ${file.name} to trash`}><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          ) : null))}
          {trashed.length > 0 && (
            <div className="dsp-tree-group">
              <button type="button" className="dsp-btn is-small is-quiet" onClick={() => setShowTrash((value) => !value)}><Trash2 size={13} /> Trash ({trashed.length})</button>
              {showTrash && trashed.map((file) => (
                <div key={file.id} className="dsp-tree-file is-trashed">
                  <span><FileCode2 size={13} /> {file.name}</span>
                  <button type="button" className="dsp-icon-btn" onClick={() => setState((current) => ({ ...current, files: current.files.map((entry) => (entry.id === file.id ? { ...entry, deletedAt: null, name: siblingsFor(entry.folderId).includes(entry.name) ? entry.name.replace(/(\.[^.]+)?$/, "-restored$1") : entry.name } : entry)) }))} aria-label={`Restore ${file.name}`}><RotateCcw size={12} /></button>
                  <ConfirmButton className="dsp-btn is-small is-danger" confirmLabel="Sure?" onConfirm={() => setState((current) => ({ ...current, files: current.files.filter((entry) => entry.id !== file.id) }))}>Delete</ConfirmButton>
                </div>
              ))}
            </div>
          )}
        </aside>
        <section className="dsp-box">
          {selected
            ? <FileEditor key={selected.id} file={selected} siblings={siblingsFor(selected.folderId)} onRename={(name) => renameFile(selected.id, name)} />
            : <EmptyState icon={FileCode2} title="Open a file" body="Pick a file on the left. Save a revision whenever you reach a version worth keeping — you can view or restore any of the last 30." />}
        </section>
      </div>
    </PrepPage>
  );
}
