import React, { useMemo, useRef, useState } from "react";
import {
  Archive, ArchiveRestore, ArrowDown, ArrowRight, ArrowUp, Check, Download, GripVertical, ListChecks, Play, Plus, Trash2, Upload, X,
} from "lucide-react";
import { problemBySlug, problems } from "../catalog";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { useLearnerState } from "../learner";
import { relativeTime } from "../lib/dates";
import { LIST_PURPOSES, addItem, exportLists, importLists, listProgress, makeList, moveItem, moveItemTo, removeItem } from "../lib/lists";
import { patternOf } from "../lib/problems";
import { uid } from "../lib/store";
import { Badge, ConfirmButton, DifficultyPill, EmptyState, Field, PrepPage, Progress, SearchInput, downloadFile, readFileText } from "../ui";

const purposeLabel = (id) => LIST_PURPOSES.find((entry) => entry.id === id)?.label || "Custom";

function AddProblems({ list, onAdd }) {
  const [query, setQuery] = useState("");
  const inList = new Set(list.items.map((item) => item.slug));
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return problems.filter((problem) => `${problem.title} ${patternOf(problem)}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [query]);
  return (
    <div className="dsp-stack">
      <SearchInput value={query} onChange={setQuery} placeholder="Add problems — search by title or pattern" />
      {matches.length > 0 && (
        <ul className="dsp-list dsp-add-results">
          {matches.map((problem) => (
            <li key={problem.slug} className="dsp-list-row">
              <div><b>{problem.title}</b><small>{patternOf(problem)}</small></div>
              <DifficultyPill difficulty={problem.difficulty} />
              <button type="button" className={`dsp-btn is-small${inList.has(problem.slug) ? " is-active" : ""}`} disabled={inList.has(problem.slug)} onClick={() => onAdd(problem.slug)}>{inList.has(problem.slug) ? <><Check size={13} /> Added</> : <><Plus size={13} /> Add</>}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Lists({ openProblem }) {
  const [lists, setLists] = useStore(KEYS.lists, []);
  const learner = useLearnerState();
  const [selectedId, setSelectedId] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("custom");
  const [dragSlug, setDragSlug] = useState("");
  const [importError, setImportError] = useState("");
  const fileRef = useRef(null);

  const visibleLists = lists.filter((list) => Boolean(list.archived) === showArchived);
  const selected = lists.find((list) => list.id === selectedId) || visibleLists[0] || null;
  const update = (id, fn) => setLists((all) => all.map((list) => (list.id === id ? fn(list) : list)));

  const create = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const list = makeList({ id: uid("list"), name, purpose });
    setLists((all) => [list, ...all]);
    setSelectedId(list.id);
    setShowArchived(false);
    setName("");
  };

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const imported = importLists(JSON.parse(await readFileText(file)), new Set(problemBySlug.keys()), () => uid("list"));
      setLists((all) => [...imported, ...all]);
      if (imported[0]) setSelectedId(imported[0].id);
      setImportError("");
    } catch (error) {
      setImportError(error.message || "That file couldn't be read.");
    }
  };

  const progress = selected ? listProgress(selected, learner.completed) : null;
  const nextUnsolved = selected?.items.find((item) => !learner.completed.has(item.slug));

  return (
    <PrepPage
      eyebrow="My Spaces"
      title="Lists"
      description="Your own problem collections — revision sets, target-company lists, anything. A list only points at problems: removing an item or deleting a list never touches your solved progress."
      actions={(
        <>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importFile} />
          <button type="button" className="dsp-btn is-quiet" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import</button>
          <button type="button" className="dsp-btn" disabled={!lists.length} onClick={() => downloadFile("problem-lists.json", JSON.stringify(exportLists(lists), null, 2))}><Download size={14} /> Export all</button>
        </>
      )}
    >
      {importError && <div className="dsp-notice is-danger" role="alert"><X size={16} /><span>{importError}</span></div>}
      <div className="dsp-grid split-left">
        <aside className="dsp-box dsp-stack">
          <form className="dsp-stack" onSubmit={create}>
            <Field label="New list"><input className="dsp-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Graphs to revisit" /></Field>
            <div className="dsp-row">
              <select className="dsp-select dsp-grow" value={purpose} onChange={(event) => setPurpose(event.target.value)} aria-label="List purpose">{LIST_PURPOSES.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select>
              <button type="submit" className="dsp-btn is-primary" disabled={!name.trim()}><Plus size={14} /> Create</button>
            </div>
          </form>
          <div className="dsp-chips">
            <button type="button" className={`dsp-chip${!showArchived ? " is-active" : ""}`} onClick={() => setShowArchived(false)}>Active</button>
            <button type="button" className={`dsp-chip${showArchived ? " is-active" : ""}`} onClick={() => setShowArchived(true)}>Archived <span className="dsp-count">{lists.filter((list) => list.archived).length}</span></button>
          </div>
          {visibleLists.length ? (
            <ul className="dsp-list">
              {visibleLists.map((list) => {
                const stats = listProgress(list, learner.completed);
                return (
                  <li key={list.id}>
                    <button type="button" className={`dsp-list-row${selected?.id === list.id ? " is-selected" : ""}`} onClick={() => setSelectedId(list.id)}>
                      <span className="dsp-list-icon"><ListChecks size={14} /></span>
                      <div><b>{list.name}</b><small>{purposeLabel(list.purpose)} · {stats.done}/{stats.total} solved</small></div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : <EmptyState compact icon={ListChecks} title={showArchived ? "No archived lists" : "No lists yet"} body={showArchived ? "" : "Create one here, or use “Add to list” on any problem."} />}
        </aside>

        <section className="dsp-box dsp-stack">
          {selected ? (
            <>
              <header className="dsp-list-head">
                <div className="dsp-stack dsp-grow">
                  <input className="dsp-note-title" value={selected.name} onChange={(event) => update(selected.id, (list) => ({ ...list, name: event.target.value, updatedAt: new Date().toISOString() }))} aria-label="List name" />
                  <input className="dsp-input" value={selected.description} onChange={(event) => update(selected.id, (list) => ({ ...list, description: event.target.value }))} placeholder="What's this list for? (optional)" aria-label="List description" />
                </div>
                <div className="dsp-row">
                  <select className="dsp-select" value={selected.purpose} onChange={(event) => update(selected.id, (list) => ({ ...list, purpose: event.target.value }))} aria-label="Purpose">{LIST_PURPOSES.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select>
                  {nextUnsolved && <button type="button" className="dsp-btn is-primary" onClick={() => openProblem(nextUnsolved.slug)}><Play size={14} /> Practice next</button>}
                </div>
              </header>
              <Progress value={progress.done} max={progress.total} label="Solved in this list — your own progress" tone="success" />

              <AddProblems list={selected} onAdd={(slug) => update(selected.id, (list) => addItem(list, slug))} />

              {selected.items.length ? (
                <ol className="dsp-list-items">
                  {selected.items.map((item, index) => {
                    const problem = problemBySlug.get(item.slug);
                    if (!problem) return null;
                    const done = learner.completed.has(item.slug);
                    return (
                      <li
                        key={item.slug}
                        className={`dsp-list-item${dragSlug === item.slug ? " is-dragging" : ""}`}
                        draggable
                        onDragStart={(event) => { setDragSlug(item.slug); event.dataTransfer.effectAllowed = "move"; }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => { event.preventDefault(); if (dragSlug) update(selected.id, (list) => moveItemTo(list, dragSlug, item.slug)); setDragSlug(""); }}
                        onDragEnd={() => setDragSlug("")}
                      >
                        <GripVertical size={14} className="dsp-muted dsp-grip" aria-hidden="true" />
                        <span className={`dsp-list-icon${done ? " is-done" : ""}`}>{done ? <Check size={14} /> : index + 1}</span>
                        <button type="button" className="dsp-item-title" onClick={() => openProblem(item.slug)}>{problem.title}</button>
                        <small className="dsp-muted dsp-hide-sm">added {relativeTime(item.addedAt)}</small>
                        <DifficultyPill difficulty={problem.difficulty} />
                        <button type="button" className="dsp-icon-btn" disabled={index === 0} onClick={() => update(selected.id, (list) => moveItem(list, item.slug, -1))} aria-label={`Move ${problem.title} up`}><ArrowUp size={14} /></button>
                        <button type="button" className="dsp-icon-btn" disabled={index === selected.items.length - 1} onClick={() => update(selected.id, (list) => moveItem(list, item.slug, 1))} aria-label={`Move ${problem.title} down`}><ArrowDown size={14} /></button>
                        <button type="button" className="dsp-icon-btn" onClick={() => update(selected.id, (list) => removeItem(list, item.slug))} aria-label={`Remove ${problem.title} from list`}><X size={14} /></button>
                      </li>
                    );
                  })}
                </ol>
              ) : <EmptyState compact icon={ArrowRight} title="This list is empty" body="Search above to add problems, or use “Add to list” from the problem bank and workspace." />}

              <footer className="dsp-row dsp-list-foot">
                <Badge>{purposeLabel(selected.purpose)}</Badge>
                <span className="dsp-muted dsp-small">Updated {relativeTime(selected.updatedAt)}</span>
                <span className="dsp-grow" />
                <button type="button" className="dsp-btn is-small is-quiet" onClick={() => downloadFile(`${selected.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "list"}.json`, JSON.stringify(exportLists([selected]), null, 2))}><Download size={13} /> Export</button>
                <button type="button" className="dsp-btn is-small is-quiet" onClick={() => update(selected.id, (list) => ({ ...list, archived: !list.archived }))}>{selected.archived ? <><ArchiveRestore size={13} /> Unarchive</> : <><Archive size={13} /> Archive</>}</button>
                <ConfirmButton className="dsp-btn is-small is-danger" confirmLabel="Delete list? Progress stays" onConfirm={() => { setLists((all) => all.filter((list) => list.id !== selected.id)); setSelectedId(""); }}><Trash2 size={13} /> Delete</ConfirmButton>
              </footer>
            </>
          ) : <EmptyState icon={ListChecks} title="No list selected" body="Create a list on the left to start collecting problems." />}
        </section>
      </div>
    </PrepPage>
  );
}
