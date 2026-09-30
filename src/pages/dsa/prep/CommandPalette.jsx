import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BrainCircuit, Clapperboard, Code2, CornerDownLeft, FileText, Hash, ListChecks, Search, Shuffle, Zap } from "lucide-react";
import { judgeableProblems, problems } from "./catalog";
import { todaysChallenge } from "./habit";
import { readStore } from "./lib/store";
import { KEYS } from "./keys";
import { patternOf } from "./lib/problems";
import { RAIL } from "./sections";
import { sectionForPath } from "./visual/sections";

const SECTIONS = [
  ...RAIL.flatMap((entry) => (entry.items ? entry.items.map((item) => ({ id: item.id, label: item.label, group: entry.label })) : [{ id: entry.id, label: entry.label, group: "Go to" }])),
  { id: "profile", label: "Profile & data", group: "Account" },
];

const matches = (text, needle) => text.toLowerCase().includes(needle);

// The AI from Scratch index is ~420 KB, so it's imported only once someone
// actually searches, then kept.
let aifsLessons = null;
const loadAifsLessons = () => import("../../../data/aiFromScratchData").then(({ AIFS_PHASES }) => {
  aifsLessons = AIFS_PHASES.flatMap((phase) => phase.lessons.map((lesson) => ({ ...lesson, phaseTitle: phase.title })));
  return aifsLessons;
});

// Visual Learning's course tree, loaded the same way.
let visualLessons = null;
const loadVisualLessons = () => import("../../../data/chaiVisualCourseData").then(({ CV_TRACKS }) => {
  visualLessons = CV_TRACKS.flatMap((track) => track.groups.flatMap((group) => group.items.map((item) => ({
    path: item.path, title: item.title, subtitle: item.subtitle || "", where: `${track.name} · ${group.title}`,
  }))));
  return visualLessons;
});

/**
 * ⌘K / Ctrl+K: one keyboard-driven search over sections, problems, notes,
 * lists and a few actions. Results say what kind of thing they are.
 */
export default function CommandPalette({ open, onClose, navigate, openProblem }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [lessonsReady, setLessonsReady] = useState(Boolean(aifsLessons && visualLessons));
  const inputRef = useRef(null);
  const returnRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    returnRef.current = document.activeElement;
    setQuery("");
    setActive(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => returnRef.current?.focus?.();
  }, [open]);

  const results = useMemo(() => {
    if (!open) return [];
    const needle = query.trim().toLowerCase();
    const actions = [
      { kind: "Action", icon: Zap, label: "Open today's Problem of the Day", run: () => openProblem(todaysChallenge()) },
      { kind: "Action", icon: Shuffle, label: "Random problem", run: () => openProblem(judgeableProblems[Math.floor(Math.random() * judgeableProblems.length)].slug) },
      { kind: "Action", icon: FileText, label: "Write a note", run: () => navigate("notes") },
      { kind: "Action", icon: ArrowRight, label: "Start a timed aptitude test", run: () => navigate("aptitude") },
    ];
    const sections = SECTIONS.map((section) => ({ kind: section.group, icon: Hash, label: section.label, run: () => navigate(section.id) }));
    if (!needle) return [...actions, ...sections.slice(0, 8)];
    const problemHits = problems.filter((problem) => matches(`${problem.title} ${patternOf(problem)} ${(problem.topicTags || []).join(" ")}`, needle)).slice(0, 8)
      .map((problem) => ({ kind: "Problem", icon: Code2, label: problem.title, hint: `${problem.difficulty} · ${patternOf(problem)}`, run: () => openProblem(problem.slug) }));
    const noteHits = readStore(KEYS.notes, []).filter((note) => !note.deletedAt && matches(`${note.title} ${note.body}`, needle)).slice(0, 5)
      .map((note) => ({ kind: "Note", icon: FileText, label: note.title, run: () => navigate("notes", { noteId: note.id }) }));
    const lessonHits = (aifsLessons || []).filter((lesson) => matches(`${lesson.title} ${lesson.phaseTitle}`, needle)).slice(0, 6)
      .map((lesson) => ({ kind: "AI lesson", icon: BrainCircuit, label: lesson.title, hint: lesson.phaseTitle, run: () => navigate("aifs", { slug: lesson.slug }) }));
    const visualHits = (visualLessons || []).filter((lesson) => matches(`${lesson.title} ${lesson.subtitle} ${lesson.where}`, needle)).slice(0, 6)
      .map((lesson) => ({ kind: "Visual lesson", icon: Clapperboard, label: lesson.title, hint: lesson.where, run: () => navigate(sectionForPath(lesson.path), { path: lesson.path }) }));
    const listHits = readStore(KEYS.lists, []).filter((list) => matches(list.name, needle)).slice(0, 4)
      .map((list) => ({ kind: "List", icon: ListChecks, label: list.name, hint: `${list.items.length} problems`, run: () => navigate("lists") }));
    return [
      ...sections.filter((entry) => matches(`${entry.label} ${entry.kind}`, needle)),
      ...actions.filter((entry) => matches(entry.label, needle)),
      ...problemHits,
      ...noteHits,
      ...visualHits,
      ...lessonHits,
      ...listHits,
    ].slice(0, 24);
  }, [lessonsReady, navigate, open, openProblem, query]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    if (!open || lessonsReady || query.trim().length < 3) return;
    Promise.all([loadAifsLessons(), loadVisualLessons()]).then(() => setLessonsReady(true)).catch(() => {});
  }, [lessonsReady, open, query]);

  if (!open) return null;

  const choose = (entry) => { onClose(); entry?.run(); };
  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(results.length - 1, value + 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(0, value - 1)); }
    else if (event.key === "Enter") { event.preventDefault(); choose(results[active]); }
    else if (event.key === "Escape") { event.preventDefault(); onClose(); }
  };

  return (
    <div className="dsp-dialog-layer dsp-palette-layer">
      <button type="button" className="dsp-dialog-scrim" onClick={onClose} aria-label="Close search" tabIndex={-1} />
      <div className="dsp-dialog dsp-command" role="dialog" aria-modal="true" aria-label="Search and commands">
        <label className="dsp-command-input">
          <Search size={17} />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={onKeyDown} placeholder="Search problems, lessons, notes, lists, sections…" role="combobox" aria-expanded="true" aria-controls="dsp-command-list" aria-activedescendant={results[active] ? `dsp-cmd-${active}` : undefined} />
          <kbd>esc</kbd>
        </label>
        <ul id="dsp-command-list" role="listbox" className="dsp-command-list">
          {results.map((entry, index) => {
            const Icon = entry.icon;
            return (
              <li key={`${entry.kind}-${entry.label}-${index}`} id={`dsp-cmd-${index}`} role="option" aria-selected={index === active}>
                <button type="button" className={index === active ? "is-active" : ""} onMouseEnter={() => setActive(index)} onClick={() => choose(entry)}>
                  <Icon size={15} />
                  <span><b>{entry.label}</b>{entry.hint && <small>{entry.hint}</small>}</span>
                  <em>{entry.kind}</em>
                </button>
              </li>
            );
          })}
          {!results.length && <li className="dsp-command-empty">No matches for “{query}”.</li>}
        </ul>
        <footer className="dsp-command-foot"><span>↑↓ to move</span><span><CornerDownLeft size={11} /> to open</span><span>⌘K anywhere in the hub</span></footer>
      </div>
    </div>
  );
}
