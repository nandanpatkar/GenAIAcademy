import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { AIFS_PHASES } from "../../../data/aiFromScratchData";
import { getLinkedNote, saveLinkedNote } from "../prep/actions";
import CoachPanel from "./CoachPanel";
import { createLessonAdapter, loadLessonBundle } from "./lessonAdapter";
import "../../../styles/DsaCoach.css";

/**
 * The AI tutor for a course lesson: a right-hand drawer holding CoachPanel
 * with the lesson adapter. Used by both AI from Scratch viewers (AiFromScratch
 * in the main app and AifsLesson in the DSA hub) and, with `course`,
 * `lessons`, `noteType` and `codeFolder` set, by the hub's VisualLesson.
 *
 * While open on a wide screen the page makes room for it (body class
 * `dcx-drawer-open` + `--dcx-drawer-w`); on narrow screens it overlays.
 */

const LESSONS = AIFS_PHASES.flatMap((phase) => phase.lessons.map((lesson) => ({
  slug: lesson.slug,
  title: lesson.title,
  blurb: lesson.blurb,
  time: lesson.time,
  phaseTitle: phase.track === "curriculum" ? `Phase ${phase.n} · ${phase.title}` : phase.title,
})));

const WIDTH_KEY = "dcx_lesson_drawer_width";
const MIN_WIDTH = 340;
const MAX_WIDTH = 720;
const readWidth = () => {
  try { return Math.min(Math.max(Number(localStorage.getItem(WIDTH_KEY)) || 420, MIN_WIDTH), MAX_WIDTH); } catch { return 420; }
};

/** Text selected inside `containerRef` (≥ 3 characters), with a position for a chip. */
export function useSelectionAsk(containerRef, enabled = true) {
  const [selection, setSelection] = useState(null);
  const read = useCallback(() => {
    const current = window.getSelection();
    const text = current?.toString().trim() || "";
    const box = containerRef.current;
    const anchor = current?.anchorNode?.nodeType === 1 ? current.anchorNode : current?.anchorNode?.parentElement;
    if (!enabled || !box || text.length < 3 || !current.rangeCount || !box.contains(current.anchorNode) || !box.contains(current.focusNode)
      || anchor?.closest?.('input, textarea, [contenteditable="true"], .monaco-editor, button')) {
      setSelection(null);
      return;
    }
    const rect = current.getRangeAt(0).getBoundingClientRect();
    setSelection({
      text: text.slice(0, 3000),
      x: Math.min(Math.max(rect.left + rect.width / 2, 60), window.innerWidth - 60),
      y: Math.min(rect.bottom + 8, window.innerHeight - 44),
    });
  }, [containerRef, enabled]);

  // Listen on the document and check containment when reading, so a
  // container that is swapped out (home ↔ lesson) keeps working.
  useEffect(() => {
    if (!enabled) return undefined;
    const clearOnCollapse = () => { if (window.getSelection()?.isCollapsed) setSelection(null); };
    const clear = () => setSelection(null);
    document.addEventListener("mouseup", read);
    document.addEventListener("keyup", read);
    document.addEventListener("selectionchange", clearOnCollapse);
    window.addEventListener("scroll", clear, true);
    return () => {
      document.removeEventListener("mouseup", read);
      document.removeEventListener("keyup", read);
      document.removeEventListener("selectionchange", clearOnCollapse);
      window.removeEventListener("scroll", clear, true);
    };
  }, [enabled, read]);

  return [selection, () => setSelection(null)];
}

/** The floating "Ask AI" button over a selection. */
export function AskAiChip({ selection, onAsk }) {
  if (!selection) return null;
  return (
    <button
      type="button"
      className="dcx-ask-chip"
      style={{ left: selection.x, top: selection.y }}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        const { text } = selection;
        onAsk({ key: `selection:${Date.now()}`, type: "selected_text", text, label: `“${text.replace(/\s+/g, " ").slice(0, 28)}${text.length > 28 ? "…" : ""}”` });
        window.getSelection()?.removeAllRanges();
      }}
    >
      <Sparkles size={13} /> Ask AI
    </button>
  );
}

export default function LessonCoach({
  lesson, phase, markdown, onOpenLesson, open, onClose, request, isDark = true,
  lessons = LESSONS, noteType = "aifs", course, codeFolder, intro,
}) {
  const [width, setWidth] = useState(readWidth);
  const [, setBundleReady] = useState(0);
  const markdownRef = useRef(markdown);
  markdownRef.current = markdown;
  const slug = lesson?.slug;

  // Fetch the lesson's files up front so the @ menu can list them.
  useEffect(() => {
    if (!open || !slug || !(lesson.code || lesson.artifacts || lesson.quiz)) return undefined;
    let alive = true;
    loadLessonBundle(slug).then(() => { if (alive) setBundleReady((value) => value + 1); }).catch(() => {});
    return () => { alive = false; };
  }, [open, slug, lesson]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add("dcx-drawer-open");
    document.documentElement.style.setProperty("--dcx-drawer-w", `${width}px`);
    return () => document.body.classList.remove("dcx-drawer-open");
  }, [open, width]);

  useEffect(() => {
    try { localStorage.setItem(WIDTH_KEY, String(width)); } catch { /* storage unavailable */ }
  }, [width]);

  const adapter = useMemo(
    () => createLessonAdapter({
      lesson, phase, getMarkdown: () => markdownRef.current, lessons, openLesson: onOpenLesson, isDark,
      noteType, ...(course && { course }), ...(codeFolder && { codeFolder }), ...(intro && { intro }),
    }),
    [lesson, phase, onOpenLesson, isDark, lessons, noteType, course, codeFolder, intro],
  );

  // "Save as note" appends the answer to this lesson's note (the same note
  // the hub's Notes tab edits).
  const saveNote = useCallback((content) => {
    const link = { type: noteType, slug, title: lesson?.title };
    const note = getLinkedNote(link);
    saveLinkedNote(link, [note?.body?.trim(), content.trim()].filter(Boolean).join("\n\n---\n\n"), { expectedVersion: note?.version ?? null });
  }, [noteType, slug, lesson?.title]);

  const startResize = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const onMove = (move) => setWidth(Math.min(Math.max(window.innerWidth - move.clientX, MIN_WIDTH), Math.min(MAX_WIDTH, window.innerWidth - 40)));
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };
  const nudge = (event) => {
    const step = event.key === "ArrowLeft" ? 24 : event.key === "ArrowRight" ? -24 : 0;
    if (!step) return;
    event.preventDefault();
    setWidth((value) => Math.min(Math.max(value + step, MIN_WIDTH), MAX_WIDTH));
  };

  if (!open || !lesson) return null;
  return (
    <aside className="dcx-host dcx-drawer" style={{ width }} aria-label="AI tutor">
      <div className="dcx-drawer-grip" role="separator" aria-orientation="vertical" aria-label="Resize the AI tutor" aria-valuenow={width} aria-valuemin={MIN_WIDTH} aria-valuemax={MAX_WIDTH} tabIndex={0} onPointerDown={startResize} onKeyDown={nudge} />
      <CoachPanel adapter={adapter} request={request} onSaveNote={saveNote} onClose={onClose} closeLabel="Close the AI tutor" />
    </aside>
  );
}
