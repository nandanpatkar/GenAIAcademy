import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock3,
  Code2,
  ExternalLink,
  FilePenLine,
  FileCode2,
  ListChecks,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Server,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import TestCasePanel from "../../components/leetcode/TestCasePanel";
import DsaAiCoach from "./DsaAiCoach";
import { configureMonaco } from "../../config/monacoLoader";
import { useTheme } from "../../contexts/ThemeContext";
import catalog from "../../data/codelab/catalog.json";
import videoReferences from "../../data/dsaVideoReferences.json";
import { codelabStatementBody, loadCodelabProblem } from "../../services/codelabProblemService";
import { RUN_PROVIDERS } from "../../services/jdoodleService";
import { runLeetCodeTests, submitLeetCodeSolution } from "../../services/leetcodeJudgeService";
import DsaBrandMark from "./DsaBrandMark";
import "../../styles/LeetCode.css";
import "../../styles/DsaWorkspace.css";

configureMonaco();

const problems = catalog.problems || [];
const bySlug = new Map(problems.map((problem) => [problem.slug, problem]));
const patternOf = (problem) => problem?.patterns?.[0]?.pattern || "Core DSA";
const categoryOf = (problem) => problem?.patterns?.[0]?.category || problem?.topicTags?.[0] || "DSA";
const difficultyClass = (value) => String(value || "").toLowerCase();
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

/**
 * Runtime picker for the editor toolbar. A native <select> renders with OS
 * chrome that clashes with the workspace, so this is a light popover: a labelled
 * trigger plus a menu, with roving-focus keyboard support and outside/Escape
 * dismissal.
 */
function RuntimeSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const active = options.find((option) => option.id === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") { setOpen(false); rootRef.current?.querySelector("button")?.focus(); }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const moveFocus = useCallback((event, index) => {
    const items = [...event.currentTarget.parentElement.querySelectorAll("[role='option']")];
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next].focus();
    }
  }, []);

  return (
    <div className="dsa-runtime-select" ref={rootRef}>
      <button
        type="button"
        className={`dsa-runtime-trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Server size={13} />
        <span className="dsa-runtime-label">Runtime</span>
        <b>{active?.label}</b>
        <ChevronDown size={13} />
      </button>

      {open && (
        <ul className="dsa-runtime-menu" role="listbox" aria-label="Code execution provider">
          {options.map((option, index) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                className={option.id === value ? "is-active" : ""}
                onKeyDown={(event) => moveFocus(event, index)}
                onClick={() => { onChange(option.id); setOpen(false); }}
              >
                <span>{option.label}</span>
                {option.id === value && <Check size={13} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DsaProblemWorkspace({ initialSlug, onBack, onClose }) {
  const { theme } = useTheme();
  const monacoTheme = theme === "light" ? "vs" : "vs-dark";
  const fallback = problems.find((problem) => problem.judgeAvailable) || problems[0];
  const [selectedSlug, setSelectedSlug] = useState(initialSlug || fallback?.slug);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [questionListOpen, setQuestionListOpen] = useState(false);
  const [questionQuery, setQuestionQuery] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completed, setCompleted] = useState(() => readArray("leetcode_completed"));
  const [judgeTab, setJudgeTab] = useState("testcase");
  const [activeCaseId, setActiveCaseId] = useState("");
  const [customCases, setCustomCases] = useState([]);
  const [judgeResult, setJudgeResult] = useState(null);
  const [judgeError, setJudgeError] = useState("");
  const [judgeAction, setJudgeAction] = useState("");
  const [judgeProvider, setJudgeProvider] = useState("jdoodle");
  const selected = bySlug.get(selectedSlug) || fallback;
  const videoReference = videoReferences[selected?.slug] || null;
  const videoEmbed = youtubeEmbedUrl(videoReference?.videoUrl);

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
    setJudgeTab("testcase");
    setActiveTab("description");
    try {
      setCustomCases(JSON.parse(localStorage.getItem(`leetcode_custom_cases_${selected.slug}`) || "[]"));
    } catch {
      setCustomCases([]);
    }
    loadCodelabProblem(selected.slug)
      .then((payload) => {
        if (cancelled) return;
        setDetail(payload);
        setCode(localStorage.getItem(`dsa_workspace_code_${selected.slug}`) || payload.starterCode || "");
        setActiveCaseId(payload.visibleTests?.[0]?.id || "");
      })
      .catch((error) => { if (!cancelled) setDetailError(error.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected?.slug]);

  useEffect(() => {
    if (!selected || !code) return;
    const saveTimer = window.setTimeout(() => localStorage.setItem(`dsa_workspace_code_${selected.slug}`, code), 350);
    return () => window.clearTimeout(saveTimer);
  }, [code, selected]);

  const filteredProblems = useMemo(() => {
    const needle = questionQuery.trim().toLowerCase();
    if (!needle) return problems;
    return problems.filter((problem) => `${problem.number || ""} ${problem.title} ${categoryOf(problem)} ${patternOf(problem)}`.toLowerCase().includes(needle));
  }, [questionQuery]);

  const manifest = detail ? { visibleTests: detail.visibleTests || [], judgeAvailable: detail.judgeAvailable } : null;
  const judgeReady = Boolean(detail?.judgeAvailable) && !loading;
  const selectedIndex = Math.max(0, problems.findIndex((problem) => problem.slug === selected?.slug));
  const notesKey = `dsa_workspace_notes_${selected?.slug || "problem"}`;
  const [notes, setNotes] = useState("");

  useEffect(() => setNotes(localStorage.getItem(notesKey) || ""), [notesKey]);

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

  const parsedCustomCases = (cases) => cases.map((test) => ({
    id: test.id,
    input: JSON.parse(test.inputText),
    expected: JSON.parse(test.expectedText),
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

  const run = async () => {
    if (!judgeReady || judgeAction) return;
    if (!code.trim()) { setJudgeError("Enter a Python solution before running tests."); setJudgeTab("result"); return; }
    setJudgeAction("run"); setJudgeError(""); setJudgeResult(null);
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
      setJudgeResult(result); setJudgeTab("result");
    } catch (error) {
      setJudgeError(error.message); setJudgeTab("result");
    } finally {
      setJudgeAction("");
    }
  };

  const submit = async () => {
    if (!judgeReady || judgeAction) return;
    if (!code.trim()) { setJudgeError("Enter a Python solution before submitting."); setJudgeTab("result"); return; }
    setJudgeAction("submit"); setJudgeError(""); setJudgeResult(null);
    try {
      const result = await submitLeetCodeSolution({ problemId: selected.slug, code, provider: judgeProvider });
      setJudgeResult(result); setJudgeTab("result");
      if (result.accepted) recordAccepted(result);
    } catch (error) {
      setJudgeError(error.message); setJudgeTab("result");
    } finally {
      setJudgeAction("");
    }
  };

  const tabs = [
    { id: "description", label: "Description", icon: BookOpen },
    { id: "editorial", label: "Editorial", icon: Clapperboard },
    { id: "solution", label: "Solution", icon: FileCode2 },
    { id: "ai", label: "AI", icon: Sparkles },
    { id: "notes", label: "Notes", icon: FilePenLine },
  ];

  return (
    <div className="dsa-workspace-shell">
      <header className="dsa-workspace-topbar">
        <button type="button" className="dsa-workspace-brand" onClick={onBack} aria-label="Back to Zero to Hero 450 sheet">
          <DsaBrandMark /><strong>DSA</strong>
        </button>
        <div className="dsa-workspace-timer" aria-label={`Problem timer ${formatTime(elapsed)}`}>
          <Clock3 size={15} /><span>{formatTime(elapsed)}</span>
          <button type="button" onClick={() => setTimerRunning((value) => !value)} aria-label={timerRunning ? "Pause timer" : "Start timer"}>{timerRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button>
          <button type="button" onClick={() => { setElapsed(0); setTimerRunning(false); }} aria-label="Reset timer"><RotateCcw size={13} /></button>
        </div>
        <div className="dsa-workspace-top-actions">
          <button type="button" onClick={() => setQuestionListOpen(true)}><ListChecks size={16} /> Question List</button>
          <span className="dsa-workspace-stat"><BarChart3 size={15} /> {completed.length}</span>
          <span className="dsa-workspace-stat"><Zap size={15} fill="currentColor" /> 0</span>
          <button type="button" className="dsa-workspace-close" onClick={onClose} aria-label="Close DSA"><X size={17} /></button>
        </div>
      </header>

      <div className="dsa-workspace-titlebar">
        <div className="dsa-workspace-title">
          <button type="button" className="dsa-workspace-back" onClick={onBack}><ArrowLeft size={16} /> Back</button>
          <div><h1>{selected?.number ? `${selected.number}. ` : `${selectedIndex + 1}. `}{selected?.title}</h1><span className={`dsa-workspace-difficulty ${difficultyClass(selected?.difficulty)}`}>{selected?.difficulty || "Unknown"}</span></div>
        </div>
        <div className="dsa-workspace-run-actions">
          <span className="dsa-problem-id">ID: {selected?.number || selectedIndex + 1}</span>
          <button type="button" className="run" onClick={run} disabled={!judgeReady || Boolean(judgeAction)}><Play size={15} fill="currentColor" /> {judgeAction === "run" ? "Running…" : "Run"}</button>
          <button type="button" className="submit" onClick={submit} disabled={!judgeReady || Boolean(judgeAction)}><Send size={15} /> {judgeAction === "submit" ? "Judging…" : completed.includes(selected?.slug) ? "Accepted" : "Submit"}</button>
        </div>
      </div>

      <nav className="dsa-workspace-tabs" aria-label="Problem sections">
        {tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={activeTab === id ? "is-active" : ""} onClick={() => setActiveTab(id)}><Icon size={15} /> {label}</button>)}
      </nav>

      <main className="dsa-workspace-main">
        <article className="dsa-workspace-problem-panel">
          {loading && <div className="dsa-workspace-state"><Loader2 size={18} className="dsa-spin" /> Loading problem…</div>}
          {detailError && <div className="dsa-workspace-state error">{detailError}</div>}
          {!loading && detail && activeTab === "description" && (
            <div className="dsa-workspace-copy">
              <div className="dsa-workspace-meta"><span>{categoryOf(selected)}</span><span>{patternOf(selected)}</span><span>{detail.visibleTests?.length || 0} sample cases</span></div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{codelabStatementBody(detail.statement)}</ReactMarkdown>
            </div>
          )}
          {!loading && detail && activeTab === "editorial" && (
            <div className="dsa-editorial-view">
              <div className="dsa-editorial-heading"><span className="dsa-workspace-kicker">EDITORIAL</span><h2>Understand the approach</h2><p>Build the reasoning first, then use the video walkthrough to see the pattern applied step by step.</p></div>
              {videoReference && videoEmbed ? <section className="dsa-video-reference"><header><span><Clapperboard size={17} /></span><div><small>DSA VIDEO REFERENCE</small><h3>{videoReference.title}</h3><p>{videoReference.topic} · {videoReference.pattern}</p></div><a href={videoReference.videoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${videoReference.title} video on YouTube`}><ExternalLink size={14} /> Watch on YouTube</a></header><div className="dsa-video-frame"><iframe src={videoEmbed} title={`${videoReference.title} DSA video explanation`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div><footer><span>Video reference from your DSA question library</span><a href={videoReference.problemUrl || selected?.url} target="_blank" rel="noreferrer">Open original problem <ExternalLink size={12} /></a></footer></section> : <section className="dsa-video-reference is-empty"><span><Clapperboard size={20} /></span><div><h3>Video reference not mapped yet</h3><p>The written editorial is available now. A matching preview will appear when this problem is added to the DSA video library.</p></div></section>}
              <section className="dsa-approach-card"><header><span><BookOpen size={16} /></span><div><small>REFERENCE APPROACH</small><h3>{patternOf(selected)}</h3></div></header><p>{detail.approach || "Break the problem into smaller states, validate the edge cases, and choose the data structure that keeps each operation efficient."}</p><div className="dsa-complexity-row"><span>Time <b>{selected?.timeComplexity || "See solution"}</b></span><span>Space <b>{selected?.spaceComplexity || "See solution"}</b></span></div></section>
            </div>
          )}
          {!loading && detail && activeTab === "solution" && (
            <div className="dsa-solution-view">
              <div className="dsa-solution-heading"><span className="dsa-workspace-kicker">REFERENCE SOLUTION</span><h2>Python 3 solution</h2><p>Review the implementation after working through the approach. The code is read-only and separate from your editor.</p></div>
              <div className="dsa-solution-facts"><span><Code2 size={14} /><small>Pattern</small><b>{patternOf(selected)}</b></span><span><Clock3 size={14} /><small>Time</small><b>{selected?.timeComplexity || "Documented in code"}</b></span><span><BarChart3 size={14} /><small>Space</small><b>{selected?.spaceComplexity || "Documented in code"}</b></span></div>
              <div className="dsa-reference-code"><div className="dsa-reference-code-head"><span><FileCode2 size={14} /> solution.py</span><small>Read only</small></div><Editor height="calc(100% - 42px)" language="python" theme={monacoTheme} value={detail.solution || "# Reference solution unavailable"} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, lineHeight: 22, scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 16 }, renderLineHighlight: "none" }} /></div>
            </div>
          )}
          {!loading && detail && activeTab === "ai" && (
            <DsaAiCoach problem={selected} pattern={patternOf(selected)} code={code} onInsertCode={setCode} />
          )}
          {!loading && activeTab === "notes" && (
            <div className="dsa-notes-view">
              <div><span className="dsa-workspace-kicker">PRIVATE NOTES</span><h2>Capture your reasoning</h2><p>Notes are saved automatically for this problem on this device.</p></div>
              <textarea value={notes} onChange={(event) => { setNotes(event.target.value); localStorage.setItem(notesKey, event.target.value); }} placeholder="Write down the key observation, edge cases, and complexity…" />
              <span><Check size={13} /> Saved locally</span>
            </div>
          )}
        </article>

        <section className="dsa-workspace-code-panel">
          <div className="dsa-workspace-editor-toolbar">
            <RuntimeSelect value={judgeProvider} options={RUN_PROVIDERS} onChange={setJudgeProvider} />
            <span className="dsa-language-chip" title="This judge runs Python 3 only"><i aria-hidden="true" />Python 3</span>
            <span className="dsa-autosave"><Check size={12} /> Auto saved</span>
          </div>
          <div className="dsa-workspace-editor">
            <Editor height="100%" language="python" theme={monacoTheme} value={code} onChange={(value) => setCode(value || "")} options={{ minimap: { enabled: false }, fontSize: 14, lineHeight: 22, scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 18 }, tabSize: 4, lineNumbersMinChars: 3 }} />
          </div>
          <div className="dsa-workspace-test-panel">
            <TestCasePanel manifest={manifest} tab={judgeTab} onTabChange={setJudgeTab} activeCaseId={activeCaseId} onActiveCaseChange={setActiveCaseId} customCases={customCases} onCustomCasesChange={handleCustomCasesChange} result={judgeResult} requestError={judgeError} />
          </div>
        </section>
      </main>

      {questionListOpen && <button type="button" className="dsa-workspace-scrim" onClick={() => setQuestionListOpen(false)} aria-label="Close question list" />}
      <aside className={`dsa-question-drawer${questionListOpen ? " is-open" : ""}`} aria-label="Question list">
        <div className="dsa-question-drawer-head"><div><span>ZERO TO HERO 450</span><h2>Question List</h2></div><button type="button" onClick={() => setQuestionListOpen(false)} aria-label="Close question list"><X size={17} /></button></div>
        <label><Search size={15} /><input value={questionQuery} onChange={(event) => setQuestionQuery(event.target.value)} placeholder="Search questions" /></label>
        <div className="dsa-question-drawer-list">{filteredProblems.map((problem, index) => <button type="button" key={problem.slug} className={problem.slug === selected?.slug ? "is-active" : ""} onClick={() => selectProblem(problem)}><span className={completed.includes(problem.slug) ? "is-done" : ""}>{completed.includes(problem.slug) ? <Check size={12} /> : problem.number || index + 1}</span><div><b>{problem.title}</b><small>{patternOf(problem)}</small></div><em className={difficultyClass(problem.difficulty)}>{problem.difficulty}</em></button>)}</div>
        <div className="dsa-question-drawer-nav"><button type="button" onClick={() => moveProblem(-1)}><ChevronLeft size={14} /> Previous</button><span>{selectedIndex + 1} / {problems.length}</span><button type="button" onClick={() => moveProblem(1)}>Next <ChevronRight size={14} /></button></div>
      </aside>
    </div>
  );
}
