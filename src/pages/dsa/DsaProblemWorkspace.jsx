import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock3,
  Cloud,
  Code2,
  Copy,
  EllipsisVertical,
  ExternalLink,
  FilePenLine,
  FileText,
  History,
  ListChecks,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Plus,
  Repeat,
  Rocket,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import DsaAiCoach from "./DsaAiCoach";
import { configureMonaco } from "../../config/monacoLoader";
import { useTheme } from "../../contexts/ThemeContext";
import catalog from "../../data/codelab/catalog.json";
import videoReferences from "../../data/dsaVideoReferences.json";
import visualLinks from "../../data/practice/visualLinks.json";
import { loadCodelabProblem } from "../../services/codelabProblemService";
import { codelabDifficulty, loadPracticeDetail, practiceProblems } from "./practice/practiceData";
import { RUN_PROVIDERS } from "../../services/jdoodleService";
import { runLeetCodeTests, submitLeetCodeSolution } from "../../services/leetcodeJudgeService";
import WanderingEyesLoader from "../../components/WanderingEyesLoader";
import useIsMobile from "../../hooks/useIsMobile";
import AddToList from "./prep/AddToList";
import SubmissionHistory from "./prep/SubmissionHistory";
import { getProblemNote, recordSubmission, saveAiDraft, saveProblemNote } from "./prep/actions";
import { addToReview, removeFromReview, todaysChallenge } from "./prep/habit";
import { useStore } from "./prep/hooks";
import { KEYS } from "./prep/keys";
import { useLearnerState } from "./prep/learner";
import { writeStore } from "./prep/lib/store";
import ProblemStatement from "./workspace/ProblemStatement";
import WorkspaceTestPanel from "./workspace/WorkspaceTestPanel";
import PeerSolutions from "./workspace/PeerSolutions";
import { useCodeTabs } from "./workspace/codeTabs";

// The Visualize tab frames a Visual Learning lesson; its course data and
// frame only load when the tab is opened.
const WorkspaceVisual = lazy(() => import("./workspace/WorkspaceVisual"));
import { moveMenuFocus, usePopover } from "./workspace/usePopover";
import "../../styles/DsaWorkspace.css";
import "../../styles/DsaPrep.css";

configureMonaco();

const codelabBySlug = new Map((catalog.problems || []).map((problem) => [problem.slug, problem]));

/**
 * A practice row in the shape the workspace (and the stores it writes to)
 * expects: `slug` is the practice id, which is the Code Lab slug for problems
 * both sources share, so existing progress, notes and history carry over.
 */
const toWorkspaceProblem = (row) => {
  if (!row) return null;
  const base = row.codelab ? codelabBySlug.get(row.codelab) : null;
  return {
    ...base,
    ...row,
    slug: row.id,
    number: row.n,
    level: row.difficulty,
    difficulty: base?.difficulty || codelabDifficulty(row.difficulty),
    url: base?.url || (row.lc ? `https://leetcode.com/problems/${row.lc}/` : row.tuf ? `https://takeuforward.org/practice/dsa/${row.tuf}` : ""),
    patterns: base?.patterns || [{ category: row.topics[0] || "DSA", pattern: row.patterns[0] || row.topics[0] || "Core DSA" }],
    topicTags: [...new Set([...(row.topics || []), ...(base?.topicTags || [])])],
  };
};
const problems = practiceProblems.map(toWorkspaceProblem);
const bySlug = new Map(problems.map((problem) => [problem.slug, problem]));
const patternOf = (problem) => problem?.patterns?.[0]?.pattern || "Core DSA";

/** One detail object for either source, in the Code Lab payload's shape. */
async function loadWorkspaceDetail(problem) {
  const [codelab, extras] = await Promise.all([
    problem.codelab ? loadCodelabProblem(problem.codelab) : Promise.resolve(null),
    loadPracticeDetail(problem.slug).catch(() => null),
  ]);
  if (codelab) return { ...codelab, slug: problem.slug, runnable: Boolean(codelab.judgeAvailable), extras };
  if (!extras) throw new Error("This problem's content is not available offline.");
  return {
    slug: problem.slug,
    title: extras.title,
    statement: extras.statement,
    constraints: extras.constraints,
    starterCode: extras.starterCode || "class Solution:\n    pass\n",
    solution: extras.reference || "",
    approach: "",
    visibleTests: extras.visibleTests || [],
    hiddenTestCount: extras.hiddenTestCount || 0,
    judgeAvailable: Boolean(extras.judgeAvailable),
    runnable: Boolean(extras.runnable),
    extras,
  };
}
const youtubeEmbedUrl = (url) => {
  const value = String(url || "");
  const id = value.match(/[?&]v=([^&#]+)/)?.[1] || value.match(/youtu\.be\/([^?&#]+)/)?.[1] || value.match(/youtube\.com\/embed\/([^?&#]+)/)?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
};

const readArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining].map((value) => String(value).padStart(2, "0")).join(":");
};

const clockTime = (date) => date?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const GUIDE_PROMPT = "Guide me step by step from where my code is now. Tell me what to think about next, and don't reveal the full solution.";

/* ── Layout: panel sizes the learner drags, remembered across visits ─────── */
const LAYOUT_KEY = "dsa_workspace_layout_v1";
const DEFAULT_LAYOUT = { left: 38, right: 340, tests: 290, aiOpen: true, testsCollapsed: false };
const MIN_LEFT_PX = 300;
const MIN_CODE_PX = 420;
const MIN_RIGHT_PX = 280;
const MAX_RIGHT_PX = 560;
// Below this width the panels stack and the AI panel becomes a sheet over them
// (see DsaWorkspace.css). Above it the AI panel is always a column.
const AI_OVERLAY_BREAKPOINT = 860;
const PANEL_GAP = 8;
// Narrower than this, problem + editor + AI can't all fit at their minimum
// widths, so the AI coach takes the problem panel's place instead of
// squeezing the editor (the problem is one click away, and the chat is kept).
const THREE_COLUMN_MIN = MIN_LEFT_PX + MIN_CODE_PX + MIN_RIGHT_PX + PANEL_GAP * 4;

/**
 * Column widths that fit the space: the saved sizes where they fit, otherwise
 * the AI panel and then the problem panel give way (down to their minimums)
 * so the editor keeps at least MIN_CODE_PX. Opening the AI panel therefore
 * narrows the other columns instead of covering the editor.
 */
function fitColumns(width, layout, { aiVisible, codeFull }) {
  if (!width) return { left: null, right: layout.right };
  const inner = width - PANEL_GAP * 2 - (codeFull ? 0 : PANEL_GAP) - (aiVisible ? PANEL_GAP : 0);
  let right = aiVisible ? Math.min(Math.max(layout.right, MIN_RIGHT_PX), MAX_RIGHT_PX) : 0;
  let left = codeFull ? 0 : Math.max(MIN_LEFT_PX, (layout.left / 100) * width);
  let deficit = MIN_CODE_PX - (inner - left - right);
  if (deficit > 0 && aiVisible) {
    const give = Math.min(deficit, right - MIN_RIGHT_PX);
    right -= give;
    deficit -= give;
  }
  if (deficit > 0 && !codeFull) {
    const give = Math.min(deficit, left - MIN_LEFT_PX);
    left -= give;
  }
  return { left: Math.round(left), right: Math.round(right) };
}

const readLayout = () => {
  try {
    return { ...DEFAULT_LAYOUT, ...JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}") };
  } catch {
    return DEFAULT_LAYOUT;
  }
};

/* ── Monaco themes matched to the panel surfaces ──────────────────────────── */
let themesDefined = false;
const defineEditorThemes = (monaco) => {
  if (themesDefined) return;
  themesDefined = true;
  monaco.editor.defineTheme("dsa-ws-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "7ea9ff", fontStyle: "italic" }],
    colors: {
      "editor.background": "#131316",
      "editor.lineHighlightBackground": "#1a1a1e",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#646b78",
      "editorLineNumber.activeForeground": "#c1c4cc",
      "editorIndentGuide.background1": "#24272e",
      "editorGutter.background": "#131316",
      "editorWidget.background": "#181b21",
      "editorWidget.border": "#343842",
    },
  });
  monaco.editor.defineTheme("dsa-ws-light", {
    base: "vs",
    inherit: true,
    rules: [{ token: "comment", foreground: "1b5fd0", fontStyle: "italic" }],
    colors: {
      "editor.background": "#ffffff",
      "editor.lineHighlightBackground": "#f4f7fc",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#a3adbc",
      "editorLineNumber.activeForeground": "#556277",
      "editorGutter.background": "#ffffff",
    },
  });
};

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineHeight: 22,
  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 12, bottom: 56 },
  tabSize: 4,
  lineNumbersMinChars: 3,
  renderLineHighlight: "line",
  overviewRulerLanes: 0,
  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
};

/**
 * Language + runtime menu. The judge runs Python 3 only, so the language list
 * is informational; the runtime (which service executes the code) is the real
 * choice.
 */
function LanguageMenu({ provider, onProviderChange }) {
  const { open, setOpen, rootRef } = usePopover();
  return (
    <div className="dsa-ws-popover-root" ref={rootRef}>
      <button type="button" className="dsa-ws-lang" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open}>
        Python <ChevronDown size={14} />
      </button>
      {open && (
        <div className="dsa-ws-menu" role="menu" aria-label="Language and runtime">
          <span className="dsa-ws-menu-label">Language</span>
          <button type="button" role="menuitemradio" aria-checked="true" onKeyDown={moveMenuFocus} onClick={() => setOpen(false)}>Python 3 <Check size={13} /></button>
          <span className="dsa-ws-menu-note">This judge runs Python 3 only.</span>
          <span className="dsa-ws-menu-label">Runs on</span>
          {RUN_PROVIDERS.map((option) => (
            <button type="button" role="menuitemradio" key={option.id} aria-checked={option.id === provider} onKeyDown={moveMenuFocus} onClick={() => { onProviderChange(option.id); setOpen(false); }}>
              {option.label} {option.id === provider && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EditorMenu({ canClose, onReset, onDuplicate, onClose }) {
  const { open, setOpen, rootRef } = usePopover();
  const pick = (action) => () => { setOpen(false); action(); };
  return (
    <div className="dsa-ws-popover-root" ref={rootRef}>
      <button type="button" className="dsa-ws-icon-btn" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open} aria-label="Editor options"><EllipsisVertical size={16} /></button>
      {open && (
        <div className="dsa-ws-menu is-right" role="menu" aria-label="Editor options">
          <button type="button" role="menuitem" onKeyDown={moveMenuFocus} onClick={pick(onReset)}><RotateCcw size={13} /> Reset tab to starter code</button>
          <button type="button" role="menuitem" onKeyDown={moveMenuFocus} onClick={pick(onDuplicate)}><Copy size={13} /> Duplicate tab</button>
          <button type="button" role="menuitem" onKeyDown={moveMenuFocus} disabled={!canClose} onClick={pick(onClose)}><X size={13} /> Close tab</button>
          <span className="dsa-ws-menu-label">Shortcuts</span>
          <span className="dsa-ws-menu-note dsa-ws-shortcuts"><span>Run</span><kbd>⌘ ↵</kbd><span>Submit</span><kbd>⌘ ⇧ ↵</kbd><span>Save</span><kbd>⌘ S</kbd></span>
        </div>
      )}
    </div>
  );
}

export default function DsaProblemWorkspace({ initialSlug, initialTab, onBack, onClose, onNavigate }) {
  const { theme } = useTheme();
  const monacoTheme = theme === "light" ? "dsa-ws-light" : "dsa-ws-dark";
  const fallback = problems.find((problem) => problem.judgeAvailable) || problems[0];
  const [selectedSlug, setSelectedSlug] = useState(initialSlug || fallback?.slug);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab || "problem");
  // The tab asked for on open applies to the first problem only.
  const pendingTabRef = useRef(initialTab || "");
  const [questionListOpen, setQuestionListOpen] = useState(false);
  const [questionQuery, setQuestionQuery] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completed, setCompleted] = useState(() => readArray("leetcode_completed"));
  const [judgeTab, setJudgeTab] = useState("sample");
  const [activeCaseId, setActiveCaseId] = useState("");
  const [customCases, setCustomCases] = useState([]);
  const [judgeResult, setJudgeResult] = useState(null);
  const [judgeError, setJudgeError] = useState("");
  const [judgeAction, setJudgeAction] = useState("");
  const [judgeProvider, setJudgeProvider] = useState("jdoodle");
  const [coachRequest, setCoachRequest] = useState(null);
  const [codeFull, setCodeFull] = useState(false);
  const [copied, setCopied] = useState(false);
  const [layout, setLayout] = useState(readLayout);
  // The saved `aiOpen` is the wide-screen preference. Where the panel would
  // cover the editor it starts closed and opens only on request.
  const aiOverlay = useIsMobile(AI_OVERLAY_BREAKPOINT);
  const [overlayAiOpen, setOverlayAiOpen] = useState(false);
  const aiOpen = aiOverlay ? overlayAiOpen : layout.aiOpen;
  const setAiOpen = (open) => {
    if (aiOverlay) setOverlayAiOpen(open);
    else setLayout((prev) => ({ ...prev, aiOpen: open }));
  };
  const mainRef = useRef(null);
  const panelBodyRef = useRef(null);
  // Each tab starts at its top, not wherever the previous tab was scrolled to.
  useEffect(() => { if (panelBodyRef.current) panelBodyRef.current.scrollTop = 0; }, [activeTab, selectedSlug]);
  const [mainWidth, setMainWidth] = useState(0);
  useEffect(() => {
    const node = mainRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => setMainWidth(Math.round(entry.contentRect.width + PANEL_GAP * 2)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const codePanelRef = useRef(null);
  const selected = bySlug.get(selectedSlug) || fallback;
  const learner = useLearnerState();
  const bookmarked = Boolean(selected && learner.bookmarks.has(selected.slug));
  const [reviewCards] = useStore(KEYS.review, {});
  const [ledger] = useStore(KEYS.ledger, []);
  const coins = ledger.reduce((sum, entry) => sum + entry.points, 0);
  const inReview = Boolean(selected && reviewCards[selected.slug]);
  const isChallenge = selected?.slug === todaysChallenge();
  const videoReference = videoReferences[selected?.slug] || null;
  const videoEmbed = youtubeEmbedUrl(videoReference?.videoUrl);
  const editorTabs = useCodeTabs(selected?.slug, detail?.starterCode || "", Boolean(detail) && detail.slug === selected?.slug);
  const code = editorTabs.code;

  useEffect(() => {
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch { /* storage unavailable */ }
  }, [layout]);

  // Home's "Continue where you left off".
  useEffect(() => {
    if (selected) writeStore(KEYS.lastProblem, { id: selected.slug, title: selected.title, at: new Date().toISOString() });
  }, [selected?.slug]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (!selected) return undefined;
    let cancelled = false;
    setLoading(true);
    setDetail(null);
    setDetailError("");
    setJudgeResult(null);
    setJudgeError("");
    setJudgeTab("sample");
    // A deep link to the Visualize tab falls back to Problem when there is no lesson.
    const pending = pendingTabRef.current === "visualize" && !visualLinks.byProblem[selected.slug] ? "" : pendingTabRef.current;
    setActiveTab(pending || "problem");
    pendingTabRef.current = "";
    try {
      setCustomCases(JSON.parse(localStorage.getItem(`leetcode_custom_cases_${selected.slug}`) || "[]"));
    } catch {
      setCustomCases([]);
    }
    loadWorkspaceDetail(selected)
      .then((payload) => {
        if (cancelled) return;
        setDetail(payload);
        setActiveCaseId(payload.visibleTests?.[0]?.id || "");
      })
      .catch((error) => { if (!cancelled) setDetailError(error.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected?.slug]);

  const filteredProblems = useMemo(() => {
    const needle = questionQuery.trim().toLowerCase();
    if (!needle) return problems;
    return problems.filter((problem) => `${problem.number || ""} ${problem.title} ${problem.patterns?.[0]?.category || ""} ${patternOf(problem)}`.toLowerCase().includes(needle));
  }, [questionQuery]);

  const judgeReady = Boolean(detail?.judgeAvailable) && !loading && editorTabs.loaded;
  // Run also works where expected outputs are unknown; it then just shows output.
  const runReady = Boolean(detail?.judgeAvailable || detail?.runnable) && !loading && editorTabs.loaded;
  const selectedIndex = Math.max(0, problems.findIndex((problem) => problem.slug === selected?.slug));

  // Problem notes live in NoteSpace. Saves carry the version the editor
  // loaded, so an edit made meanwhile in NoteSpace (or another tab) surfaces
  // as a conflict instead of being overwritten.
  const [notes, setNotes] = useState("");
  const [noteStatus, setNoteStatus] = useState("idle"); // idle | saving | saved | conflict
  const [noteId, setNoteId] = useState("");
  const noteVersionRef = useRef(null);
  const noteDirtyRef = useRef(false);
  const notesRef = useRef("");
  notesRef.current = notes;

  const persistNote = useCallback((slug, title, body, force = false) => {
    const outcome = saveProblemNote(slug, body, { problemTitle: title, expectedVersion: force ? null : noteVersionRef.current });
    if (outcome?.ok) {
      noteVersionRef.current = outcome.note.version;
      noteDirtyRef.current = false;
      setNoteId(outcome.note.id);
      setNoteStatus("saved");
    } else {
      setNoteStatus("conflict");
    }
  }, []);

  const loadNote = useCallback((problem) => {
    const note = getProblemNote(problem.slug, problem.title);
    setNotes(note?.body || "");
    setNoteId(note?.id || "");
    noteVersionRef.current = note?.version ?? null;
    noteDirtyRef.current = false;
    setNoteStatus(note ? "saved" : "idle");
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const problem = selected;
    loadNote(problem);
    // Flush an in-flight edit when switching problems or leaving the workspace.
    return () => { if (noteDirtyRef.current) persistNote(problem.slug, problem.title, notesRef.current); };
  }, [selected?.slug, loadNote, persistNote]);

  useEffect(() => {
    if (!noteDirtyRef.current || !selected || noteStatus === "conflict") return undefined;
    setNoteStatus("saving");
    const timer = window.setTimeout(() => persistNote(selected.slug, selected.title, notes), 500);
    return () => window.clearTimeout(timer);
    // noteStatus is read, not tracked: a conflict pauses autosave until resolved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  const selectProblem = (problem) => {
    setSelectedSlug(problem.slug);
    setQuestionListOpen(false);
    setElapsed(0);
    setTimerRunning(false);
  };

  const moveProblem = (direction) => {
    const index = (selectedIndex + direction + problems.length) % problems.length;
    selectProblem(problems[index]);
  };

  // A custom case with no expected output is run and shown, not scored.
  const parsedCustomCases = (cases) => cases.map((test) => ({
    id: test.id,
    input: JSON.parse(test.inputText),
    ...(String(test.expectedText ?? "").trim() ? { expected: JSON.parse(test.expectedText) } : {}),
  }));

  const handleCustomCasesChange = (next) => {
    setCustomCases(next);
    localStorage.setItem(`leetcode_custom_cases_${selected.slug}`, JSON.stringify(next));
  };

  const recordAccepted = (result) => {
    if (completed.includes(selected.slug)) return;
    const next = [...completed, selected.slug];
    setCompleted(next);
    localStorage.setItem("leetcode_completed", JSON.stringify(next));
    const submission = {
      problemId: selected.slug,
      problemNumber: selected.number,
      title: selected.title,
      pattern: patternOf(selected),
      code,
      status: "accepted",
      passedTests: result.summary?.passed,
      totalTests: result.summary?.total,
      submittedAt: new Date().toISOString(),
    };
    try {
      const history = JSON.parse(localStorage.getItem("leetcode_submissions") || "[]");
      localStorage.setItem("leetcode_submissions", JSON.stringify([submission, ...history].slice(0, 100)));
    } catch {
      localStorage.setItem("leetcode_submissions", JSON.stringify([submission]));
    }
    window.dispatchEvent(new CustomEvent("leetcode-progress", { detail: { completed: next.length } }));
  };

  const openResults = () => {
    setJudgeTab("result");
    setLayout((prev) => (prev.testsCollapsed ? { ...prev, testsCollapsed: false } : prev));
  };

  const run = async () => {
    if (!runReady || judgeAction) return;
    if (!code.trim()) { setJudgeError("Enter a Python solution before running tests."); openResults(); return; }
    setJudgeAction("run"); setJudgeError(""); setJudgeResult(null); openResults();
    try {
      const selectedVisible = detail.visibleTests.some((test) => test.id === activeCaseId);
      const selectedCustom = customCases.filter((test) => test.id === activeCaseId);
      const result = await runLeetCodeTests({
        problemId: selected.slug,
        code,
        caseIds: selectedVisible ? [activeCaseId] : undefined,
        customCases: parsedCustomCases(selectedCustom),
        provider: judgeProvider,
      });
      setJudgeResult(result);
    } catch (error) {
      setJudgeError(error.message);
    } finally {
      setJudgeAction("");
    }
  };

  const submit = async () => {
    if (!judgeReady || judgeAction) return;
    if (!code.trim()) { setJudgeError("Enter a Python solution before submitting."); openResults(); return; }
    setJudgeAction("submit"); setJudgeError(""); setJudgeResult(null); openResults();
    try {
      const result = await submitLeetCodeSolution({ problemId: selected.slug, code, provider: judgeProvider });
      setJudgeResult(result);
      if (result.accepted) recordAccepted(result);
      // Every verdict is kept (history, attempted status, rewards on accept).
      recordSubmission({ problem: selected, result, code, provider: judgeProvider });
    } catch (error) {
      setJudgeError(error.message);
    } finally {
      setJudgeAction("");
    }
  };

  // Monaco keybindings are registered once, so they call through a ref.
  const actionsRef = useRef({});
  actionsRef.current = { run, submit, save: editorTabs.saveNow };
  const handleEditorMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => actionsRef.current.run());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => actionsRef.current.submit());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => actionsRef.current.save());
  };

  const resetCode = () => {
    if (code.trim() && code !== detail?.starterCode && !window.confirm("Replace this tab's code with the starter code? Your changes in this tab will be lost.")) return;
    editorTabs.setCode(detail?.starterCode || "");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const openCoach = (prompt, context) => {
    setAiOpen(true);
    if (prompt || context?.length) setCoachRequest({ id: Date.now(), prompt: prompt || "", context });
  };

  /* ── "Ask AI" on text selected in the problem panel ──────────────────── */
  const [askSelection, setAskSelection] = useState(null);
  const readSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";
    const body = panelBodyRef.current;
    const anchor = selection?.anchorNode?.nodeType === 1 ? selection.anchorNode : selection?.anchorNode?.parentElement;
    if (!body || text.length < 3 || !selection.rangeCount || !body.contains(selection.anchorNode) || !body.contains(selection.focusNode)
      || anchor?.closest?.('input, textarea, [contenteditable="true"], .monaco-editor')) {
      setAskSelection(null);
      return;
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const x = Math.min(Math.max(rect.left + rect.width / 2, 60), window.innerWidth - 60);
    const y = Math.min(rect.bottom + 8, window.innerHeight - 44);
    setAskSelection({ text: text.slice(0, 3000), x, y });
  };
  useEffect(() => {
    if (!askSelection) return undefined;
    const onChange = () => { if (window.getSelection()?.isCollapsed) setAskSelection(null); };
    document.addEventListener("selectionchange", onChange);
    return () => document.removeEventListener("selectionchange", onChange);
  }, [askSelection]);
  useEffect(() => { setAskSelection(null); }, [activeTab, selectedSlug]);
  const askAboutSelection = () => {
    if (!askSelection) return;
    const { text } = askSelection;
    const label = `“${text.replace(/\s+/g, " ").slice(0, 28)}${text.length > 28 ? "…" : ""}”`;
    openCoach("", [{ key: `selection:${Date.now()}`, type: "selected_text", text, label }]);
    window.getSelection()?.removeAllRanges();
    setAskSelection(null);
  };

  /* ── Drag to resize: the two column gutters and the editor/test split ──── */
  const startDrag = (kind) => (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    document.body.classList.add("dsa-ws-resizing");
    const mainRect = mainRef.current.getBoundingClientRect();
    const codeRect = codePanelRef.current.getBoundingClientRect();
    const rightPx = aiMode === "column" ? fitted.right : 0;

    const onMove = (moveEvent) => {
      if (kind === "left") {
        const maxLeft = mainRect.width - rightPx - MIN_CODE_PX - 16;
        const px = Math.min(Math.max(moveEvent.clientX - mainRect.left, MIN_LEFT_PX), maxLeft);
        setLayout((prev) => ({ ...prev, left: (px / mainRect.width) * 100 }));
      } else if (kind === "right") {
        const leftPx = codeFull ? 0 : fitted.left ?? (layout.left / 100) * mainRect.width;
        const maxRight = Math.min(MAX_RIGHT_PX, mainRect.width - leftPx - MIN_CODE_PX - 16);
        const px = Math.min(Math.max(mainRect.right - moveEvent.clientX, MIN_RIGHT_PX), maxRight);
        setLayout((prev) => ({ ...prev, right: Math.round(px) }));
      } else {
        const px = Math.min(Math.max(codeRect.bottom - 34 - moveEvent.clientY, 120), codeRect.height - 190);
        setLayout((prev) => ({ ...prev, tests: Math.round(px), testsCollapsed: false }));
      }
    };
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      document.body.classList.remove("dsa-ws-resizing");
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  const nudge = (kind) => (event) => {
    const step = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : 0;
    if (!step) return;
    event.preventDefault();
    setLayout((prev) => {
      if (kind === "left") return { ...prev, left: Math.min(Math.max(prev.left + step * 2, 22), 60) };
      if (kind === "right") return { ...prev, right: Math.min(Math.max(prev.right - step * 16, MIN_RIGHT_PX), MAX_RIGHT_PX) };
      return { ...prev, tests: Math.min(Math.max(prev.tests - step * 16, 120), 640), testsCollapsed: false };
    });
  };

  const visualPath = selected ? visualLinks.byProblem[selected.slug] || "" : "";
  const tabs = [
    { id: "problem", label: "Problem", icon: FileText },
    ...(visualPath ? [{ id: "visualize", label: "Visualize", icon: Clapperboard }] : []),
    { id: "solution", label: "Solution", icon: Code2 },
    { id: "submissions", label: "Submissions", icon: History },
    { id: "peers", label: "Peer Solutions", icon: Users },
    { id: "notes", label: "Notes", icon: FilePenLine },
  ];

  const scrapedVideoEmbed = youtubeEmbedUrl(detail?.extras?.video);
  const video = videoReference && videoEmbed
    ? { title: videoReference.title, meta: `${videoReference.topic} · ${videoReference.pattern}`, url: videoReference.videoUrl, embed: videoEmbed }
    : scrapedVideoEmbed ? { title: selected?.title, meta: patternOf(selected), url: detail.extras.video, embed: scrapedVideoEmbed } : null;

  const aiMode = !aiOpen ? "off" : aiOverlay ? "overlay" : mainWidth && mainWidth < THREE_COLUMN_MIN && !codeFull ? "shared" : "column";
  const fitted = fitColumns(mainWidth, layout, { aiVisible: aiMode === "column", codeFull });

  // What the coach can see and do in this workspace (see DsaAiCoach).
  const coachParams = useMemo(() => Object.keys(detail?.visibleTests?.[0]?.input || {}), [detail]);
  const coachWorkspace = useMemo(() => ({
    problem: selected,
    detail,
    tabs: editorTabs.tabs,
    activeTabId: editorTabs.activeId,
    lastResult: judgeResult,
    notes,
    runReady,
    params: coachParams,
    isDark: theme !== "light",
    runCode: (source, cases = []) => runLeetCodeTests({ problemId: selected.slug, code: source, customCases: cases, provider: judgeProvider }),
    applyCode: (source, mode = "new") => {
      if (mode === "replace") {
        const current = editorTabs.tabs.find((tab) => tab.id === editorTabs.activeId);
        if (current && current.code.trim() && current.code !== detail?.starterCode && current.code !== source
          && !window.confirm(`Replace the code in ${current.name}? Your changes in this tab will be lost.`)) return "";
        editorTabs.setCode(source);
        return `Replaced ${current?.name || "the tab"}`;
      }
      const number = editorTabs.tabs.reduce((max, tab) => Math.max(max, Number(tab.id.split("-").pop()) || 0), 0) + 1;
      editorTabs.addTab(source);
      return `Opened in Tab-${number}`;
    },
    addCustomCase: (input, expected) => {
      const number = customCases.reduce((max, test) => Math.max(max, Number(test.id.split("-").pop()) || 0), 0) + 1;
      const next = { id: `custom-${number}`, inputText: JSON.stringify(input), expectedText: expected === undefined ? "" : JSON.stringify(expected) };
      handleCustomCasesChange([...customCases, next]);
      setActiveCaseId(next.id);
      setJudgeTab("sample");
      setLayout((prev) => (prev.testsCollapsed ? { ...prev, testsCollapsed: false } : prev));
    },
    openProblem: (id) => { const problem = bySlug.get(id); if (problem) selectProblem(problem); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [selected, detail, editorTabs.tabs, editorTabs.activeId, judgeResult, notes, runReady, coachParams, theme, judgeProvider, customCases]);

  const saveLabel = editorTabs.saving ? "Saving…" : editorTabs.savedAt ? `Saved to local · ${clockTime(editorTabs.savedAt)}` : "Saved to local";
  const mainClass = ["dsa-ws-main", aiMode === "column" && "has-ai", aiMode === "shared" && "is-ai-shared", aiMode === "overlay" && "is-ai-overlay", codeFull && "is-code-full"].filter(Boolean).join(" ");

  return (
    <div className="dsa-workspace-shell">
      <header className="dsa-ws-nav">
        <div className="dsa-ws-nav-group">
          <button type="button" className="dsa-ws-nav-btn" onClick={onBack} aria-label="Back to the problem list"><ArrowLeft size={15} /> Back</button>
          {/* Wordmark only: the app sidebar beside the workspace shows the fire mark. */}
          <span className="dsa-ws-brand"><strong>DSA</strong></span>
          <span className="dsa-ws-divider" aria-hidden="true" />
          <button type="button" className="dsa-ws-nav-btn" onClick={() => setQuestionListOpen(true)}><ListChecks size={15} /> <span className="dsa-ws-hide-sm">Question List</span></button>
          <button type="button" className="dsa-ws-icon-btn" onClick={() => moveProblem(-1)} aria-label="Previous problem" title="Previous problem"><ChevronLeft size={16} /></button>
          <button type="button" className="dsa-ws-icon-btn" onClick={() => moveProblem(1)} aria-label="Next problem" title="Next problem"><ChevronRight size={16} /></button>
        </div>

        <div className="dsa-ws-timer" aria-label={`Problem timer ${formatTime(elapsed)}`}>
          <Clock3 size={14} />
          <span>{formatTime(elapsed)}</span>
          <button type="button" onClick={() => setTimerRunning((value) => !value)} aria-label={timerRunning ? "Pause timer" : "Start timer"}>{timerRunning ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}</button>
          <button type="button" onClick={() => { setElapsed(0); setTimerRunning(false); }} aria-label="Reset timer"><RotateCcw size={12} /></button>
        </div>

        <div className="dsa-ws-nav-group is-end">
          <span className="dsa-ws-stat" title="Problems solved"><BarChart3 size={14} /> {completed.length}</span>
          <span className="dsa-ws-stat is-coins" title="Coins earned (Unlock › Achievements)"><Zap size={14} fill="currentColor" /> {coins}</span>
          {!aiOpen && <button type="button" className="dsa-ws-nav-btn is-accent" onClick={() => openCoach()}><Sparkles size={14} /> <span className="dsa-ws-hide-sm">AI coach</span></button>}
          <button type="button" className="dsa-ws-icon-btn" onClick={onClose} aria-label="Close DSA"><X size={16} /></button>
        </div>
      </header>

      <main
        className={mainClass}
        ref={mainRef}
        style={{ "--ws-left": fitted.left === null ? `${layout.left}%` : `${fitted.left}px`, "--ws-right": `${fitted.right}px`, "--ws-tests": `${layout.tests}px` }}
      >
        {/* ── Problem panel ─────────────────────────────────────────────── */}
        <section className="dsa-ws-panel dsa-ws-problem" aria-label="Problem">
          <div className="dsa-ws-panel-tabs">
            <nav role="tablist" aria-label="Problem sections">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button type="button" role="tab" key={id} aria-selected={activeTab === id} className={activeTab === id ? "is-active" : ""} onClick={() => setActiveTab(id)}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </nav>
            {selected && (
              <button
                type="button"
                className={`dsa-ws-icon-btn dsa-ws-bookmark${bookmarked ? " is-active" : ""}`}
                onClick={() => learner.toggleBookmark(selected.slug)}
                aria-pressed={bookmarked}
                aria-label={bookmarked ? "Remove from saved questions" : "Save question"}
                title={bookmarked ? "Saved — find it under Practice › Saved questions" : "Save question"}
              >
                <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>

          <div className="dsa-ws-panel-body" ref={panelBodyRef} onMouseUp={readSelection} onKeyUp={readSelection} onScroll={() => askSelection && setAskSelection(null)}>
            {loading && <div className="dsa-ws-state"><WanderingEyesLoader block label="Loading problem…" showLabel size={22} /></div>}
            {detailError && <div className="dsa-ws-state is-error">{detailError}</div>}

            {!loading && detail && activeTab === "problem" && (
              <ProblemStatement
                problem={selected}
                detail={detail}
                isChallenge={isChallenge}
                solved={completed.includes(selected?.slug)}
                catalog={problems}
                completed={completed}
                onSelectProblem={selectProblem}
                onAskCoach={(prompt) => openCoach(prompt)}
              />
            )}

            {!loading && detail && activeTab === "solution" && (
              <div className="dsa-ws-solution">
                <div className="dsa-ws-view-head"><span className="dsa-ws-kicker">Editorial</span><h2>Understand the approach</h2><p>Build the reasoning first, then use the walkthrough and the reference code to check it.</p></div>
                {video ? (
                  <section className="dsa-video-reference">
                    <header><span><Clapperboard size={17} /></span><div><small>Video walkthrough</small><h3>{video.title}</h3><p>{video.meta}</p></div><a href={video.url} target="_blank" rel="noreferrer" aria-label={`Open ${video.title} video on YouTube`}><ExternalLink size={14} /> YouTube</a></header>
                    <div className="dsa-video-frame"><iframe src={video.embed} title={`${video.title} DSA video explanation`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
                  </section>
                ) : (
                  <section className="dsa-video-reference is-empty"><span><Clapperboard size={20} /></span><div><h3>No video walkthrough yet</h3><p>The written approach and reference code are below. A video appears here once this problem is added to the DSA video library.</p></div></section>
                )}
                <section className="dsa-approach-card"><header><span><FileText size={16} /></span><div><small>Reference approach</small><h3>{patternOf(selected)}</h3></div></header><p>{detail.approach || (!selected?.codelab ? "The editorial's final approach, as runnable Python. Trace it on the examples before comparing it with your own." : "Break the problem into smaller states, validate the edge cases, and choose the data structure that keeps each operation efficient.")}</p><div className="dsa-complexity-row"><span>Time <b>{selected?.timeComplexity || "See solution"}</b></span><span>Space <b>{selected?.spaceComplexity || "See solution"}</b></span></div></section>
                <div className="dsa-reference-code"><div className="dsa-reference-code-head"><span><Code2 size={14} /> solution.py</span><small>Read only</small></div><Editor height="calc(100% - 38px)" language="python" theme={monacoTheme} beforeMount={defineEditorThemes} value={detail.solution || "# Reference solution unavailable"} options={{ ...editorOptions, readOnly: true, renderLineHighlight: "none", padding: { top: 12 } }} /></div>
              </div>
            )}

            {!loading && detail && activeTab === "peers" && <PeerSolutions solutions={detail.extras?.peerSolutions} />}

            {!loading && activeTab === "visualize" && visualPath && (
              <Suspense fallback={<div className="dsa-ws-state"><WanderingEyesLoader block label="Loading lesson…" showLabel size={22} /></div>}>
                <WorkspaceVisual
                  lessonPath={visualPath}
                  dark={theme !== "light"}
                  onOpenInHub={(path) => onNavigate?.("visual", { path })}
                />
              </Suspense>
            )}

            {!loading && activeTab === "submissions" && selected && (
              <SubmissionHistory slug={selected.slug} currentCode={code} onLoadCode={editorTabs.setCode} />
            )}

            {!loading && activeTab === "notes" && (
              <div className="dsa-notes-view">
                <div className="dsa-ws-view-head"><span className="dsa-ws-kicker">Private notes</span><h2>Capture your reasoning</h2><p>Saved to NoteSpace and linked to this problem — find them again from My Spaces › Notes.</p></div>
                {noteStatus === "conflict" && (
                  <div className="dsp-notice is-warning" role="alert">
                    <span>This note was changed elsewhere (NoteSpace or another tab) after you opened it. Autosave is paused so nothing is lost.</span>
                    <div className="dsp-row">
                      <button type="button" className="dsp-btn is-small" onClick={() => selected && loadNote(selected)}>Load the newer version</button>
                      <button type="button" className="dsp-btn is-small is-quiet" onClick={() => selected && persistNote(selected.slug, selected.title, notes, true)}>Keep mine</button>
                    </div>
                  </div>
                )}
                <label htmlFor="dsa-ws-notes" className="sr-only">Notes for {selected?.title}</label>
                <textarea id="dsa-ws-notes" value={notes} onChange={(event) => { noteDirtyRef.current = true; setNotes(event.target.value); }} placeholder="Write down the key observation, edge cases, and complexity… Markdown works." />
                <span className="dsa-notes-status">
                  {noteStatus === "saving" ? "Saving…" : noteStatus === "conflict" ? "Not saved — resolve the conflict above" : noteStatus === "saved" ? <><Check size={13} /> Saved to NoteSpace</> : "Start typing to create a note"}
                  {onNavigate && noteId && <button type="button" className="dsp-link" onClick={() => onNavigate("notes", { noteId })}>Open in NoteSpace</button>}
                </span>
              </div>
            )}
          </div>

          <footer className="dsa-ws-panel-foot">
            <div className="dsa-ws-foot-group">
              {selected && (
                <button type="button" className={`dsa-ws-icon-btn${inReview ? " is-active" : ""}`} aria-pressed={inReview} onClick={() => (inReview ? removeFromReview(selected.slug) : addToReview(selected.slug))} title={inReview ? `In your review queue, due ${reviewCards[selected.slug].dueDay} — click to stop reviewing` : "Revise later: add to your spaced review queue"} aria-label={inReview ? "Stop reviewing this problem" : "Add to review queue"}>
                  <Repeat size={15} />
                </button>
              )}
              {selected && <AddToList compact slug={selected.slug} title={selected.title} className="dsa-ws-addlist" />}
              <button type="button" className="dsa-ws-icon-btn" onClick={() => setActiveTab("notes")} aria-label="Open notes" title="Notes"><FilePenLine size={15} /></button>
              {selected?.url && <a className="dsa-ws-icon-btn" href={selected.url} target="_blank" rel="noreferrer" aria-label="Open the original problem" title="Open the original problem"><ExternalLink size={15} /></a>}
            </div>
            <span className="dsa-ws-foot-meta">{patternOf(selected)} · {selectedIndex + 1} / {problems.length}</span>
          </footer>
        </section>

        <div className="dsa-ws-gutter is-left" role="separator" aria-orientation="vertical" aria-label="Resize problem panel" aria-valuenow={Math.round(layout.left)} aria-valuemin={22} aria-valuemax={60} tabIndex={0} onPointerDown={startDrag("left")} onKeyDown={nudge("left")} onDoubleClick={() => setLayout((prev) => ({ ...prev, left: DEFAULT_LAYOUT.left }))} />

        {/* ── Code panel ────────────────────────────────────────────────── */}
        <section className="dsa-ws-code" ref={codePanelRef} aria-label="Code editor">
          <div className="dsa-ws-code-tabs">
            <div role="tablist" aria-label="Editor tabs">
              {editorTabs.tabs.map((tab) => (
                <div key={tab.id} className={`dsa-ws-code-tab${tab.id === editorTabs.activeId ? " is-active" : ""}`}>
                  <button type="button" role="tab" aria-selected={tab.id === editorTabs.activeId} onClick={() => editorTabs.selectTab(tab.id)}>{tab.name}</button>
                  {editorTabs.tabs.length > 1 && <button type="button" className="dsa-ws-tab-close" onClick={() => editorTabs.closeTab(tab.id)} aria-label={`Close ${tab.name}`}><X size={12} /></button>}
                </div>
              ))}
              <button type="button" className="dsa-ws-icon-btn" onClick={() => editorTabs.addTab()} disabled={!editorTabs.loaded} aria-label="New editor tab" title="New tab (starts from the starter code)"><Plus size={16} /></button>
            </div>
            <EditorMenu canClose={editorTabs.tabs.length > 1} onReset={resetCode} onDuplicate={() => editorTabs.addTab(code)} onClose={() => editorTabs.closeTab(editorTabs.activeId)} />
          </div>

          <div className="dsa-ws-code-card">
            <div className="dsa-ws-code-toolbar">
              <LanguageMenu provider={judgeProvider} onProviderChange={setJudgeProvider} />
              <div className="dsa-ws-run-group">
                <button type="button" className="dsa-ws-run" onClick={run} disabled={!runReady || Boolean(judgeAction)} aria-label="Run the selected case" title="Run the selected case (⌘↵)">
                  {judgeAction === "run" ? <WanderingEyesLoader size={10} label="Running" /> : <Play size={14} fill="currentColor" />}
                </button>
                <button type="button" className="dsa-ws-submit" onClick={submit} disabled={!judgeReady || Boolean(judgeAction)} title={judgeReady ? "Submit against every test case (⌘⇧↵)" : "Submitting needs expected outputs, which this problem doesn't have yet. Run still shows your output."}>
                  {judgeAction === "submit" ? <WanderingEyesLoader size={10} label="Judging" /> : <Rocket size={14} />} {judgeAction === "submit" ? "Judging…" : "Submit"}
                </button>
              </div>
            </div>

            <div className="dsa-ws-editor">
              {editorTabs.loaded ? (
                <Editor
                  height="100%"
                  language="python"
                  theme={monacoTheme}
                  beforeMount={defineEditorThemes}
                  onMount={handleEditorMount}
                  path={`${selected?.slug}/${editorTabs.activeId}.py`}
                  value={code}
                  onChange={(value) => editorTabs.setCode(value || "")}
                  options={editorOptions}
                />
              ) : (
                <div className="dsa-ws-state">{detailError ? "The editor opens once the problem loads." : <WanderingEyesLoader block label="Preparing editor…" size={18} />}</div>
              )}
              <button type="button" className="dsa-ws-guide" onClick={() => openCoach(GUIDE_PROMPT)} disabled={!detail}><Sparkles size={13} /> Guide Me</button>
            </div>

            {!layout.testsCollapsed && (
              <div className="dsa-ws-gutter is-row" role="separator" aria-orientation="horizontal" aria-label="Resize test cases" aria-valuenow={layout.tests} aria-valuemin={120} aria-valuemax={640} tabIndex={0} onPointerDown={startDrag("tests")} onKeyDown={nudge("tests")} />
            )}
            <div className="dsa-ws-tests-slot" style={layout.testsCollapsed ? undefined : { height: "var(--ws-tests)" }}>
              <WorkspaceTestPanel
                detail={detail}
                tab={judgeTab}
                onTabChange={setJudgeTab}
                activeCaseId={activeCaseId}
                onActiveCaseChange={setActiveCaseId}
                customCases={customCases}
                onCustomCasesChange={handleCustomCasesChange}
                result={judgeResult}
                requestError={judgeError}
                busy={judgeAction}
                collapsed={layout.testsCollapsed}
                onToggleCollapsed={() => setLayout((prev) => ({ ...prev, testsCollapsed: !prev.testsCollapsed }))}
              />
            </div>

            <footer className="dsa-ws-code-foot">
              <span className="dsa-ws-save-status" aria-live="polite"><Cloud size={13} /> {saveLabel}</span>
              <div className="dsa-ws-foot-group">
                <button type="button" className="dsa-ws-icon-btn" onClick={resetCode} disabled={!editorTabs.loaded} aria-label="Reset to starter code" title="Reset to starter code"><RotateCcw size={14} /></button>
                <button type="button" className="dsa-ws-icon-btn" onClick={copyCode} disabled={!editorTabs.loaded} aria-label={copied ? "Copied" : "Copy code"} title={copied ? "Copied" : "Copy code"}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
                <button type="button" className="dsa-ws-icon-btn" onClick={editorTabs.saveNow} disabled={!editorTabs.loaded} aria-label="Save now" title="Save now (⌘S)"><Save size={14} /></button>
                <button type="button" className="dsa-ws-icon-btn" onClick={() => setCodeFull((value) => !value)} aria-pressed={codeFull} aria-label={codeFull ? "Show the problem panel" : "Expand the editor"} title={codeFull ? "Show the problem panel" : "Expand the editor"}>{codeFull ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
              </div>
            </footer>
          </div>
        </section>

        {/* ── AI panel ──────────────────────────────────────────────────── */}
        {aiOpen && (
          <>
            <div className="dsa-ws-gutter is-right" role="separator" aria-orientation="vertical" aria-label="Resize AI panel" aria-valuenow={layout.right} aria-valuemin={MIN_RIGHT_PX} aria-valuemax={MAX_RIGHT_PX} tabIndex={0} onPointerDown={startDrag("right")} onKeyDown={nudge("right")} />
            <aside className="dsa-ws-panel dsa-ws-ai">
              <DsaAiCoach
                problem={selected}
                pattern={patternOf(selected)}
                workspace={coachWorkspace}
                request={coachRequest}
                onSaveNote={(content) => saveAiDraft({ slug: selected.slug, problemTitle: selected.title, content })}
                onClose={() => setAiOpen(false)}
                closeLabel={aiMode === "shared" ? "Back to the problem" : "Close AI panel"}
              />
            </aside>
          </>
        )}
      </main>

      {askSelection && (
        <button
          type="button"
          className="dsa-ws-ask-ai"
          style={{ left: askSelection.x, top: askSelection.y }}
          onMouseDown={(event) => event.preventDefault()}
          onClick={askAboutSelection}
        >
          <Sparkles size={13} /> Ask AI
        </button>
      )}

      {questionListOpen && <button type="button" className="dsa-workspace-scrim" onClick={() => setQuestionListOpen(false)} aria-label="Close question list" />}
      <aside className={`dsa-question-drawer${questionListOpen ? " is-open" : ""}`} aria-label="Question list">
        <div className="dsa-question-drawer-head"><div><span>Zero to Hero 450</span><h2>Question List</h2></div><button type="button" onClick={() => setQuestionListOpen(false)} aria-label="Close question list"><X size={17} /></button></div>
        <label><Search size={15} /><input value={questionQuery} onChange={(event) => setQuestionQuery(event.target.value)} placeholder="Search questions" aria-label="Search questions" /></label>
        <div className="dsa-question-drawer-list">{filteredProblems.map((problem, index) => <button type="button" key={problem.slug} className={problem.slug === selected?.slug ? "is-active" : ""} onClick={() => selectProblem(problem)}><span className={completed.includes(problem.slug) ? "is-done" : ""}>{completed.includes(problem.slug) ? <Check size={12} /> : problem.number || index + 1}</span><div><b>{problem.title}</b><small>{patternOf(problem)}</small></div><em className={String(problem.level || "").toLowerCase()}>{problem.level}</em></button>)}</div>
        <div className="dsa-question-drawer-nav"><button type="button" onClick={() => moveProblem(-1)}><ChevronLeft size={14} /> Previous</button><span>{selectedIndex + 1} / {problems.length}</span><button type="button" onClick={() => moveProblem(1)}>Next <ChevronRight size={14} /></button></div>
      </aside>
    </div>
  );
}
