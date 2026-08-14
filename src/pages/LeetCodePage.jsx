import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { configureMonaco } from "../config/monacoLoader";

// Point Monaco at its CDN before any editor mounts. Moved out of main.jsx
// so @monaco-editor/react stays out of the app entry chunk.
configureMonaco();
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUpRight, BookOpen, Brain, CalendarDays, Check, ChevronDown, ChevronRight, Code2, Eye, Flame,
  Filter, Home, LayoutGrid, Layers, ListChecks, Play, Search, Shuffle, Sparkles, Target, Terminal,
  TrendingUp, X, ChevronLeft, Loader2
} from "lucide-react";
import AITutorPanel from "../components/AITutorPanel";
import TestCasePanel from "../components/leetcode/TestCasePanel";
import { runLeetCodeTests, submitLeetCodeSolution } from "../services/leetcodeJudgeService";
import { RUN_PROVIDERS } from "../services/jdoodleService";
import { loadCodelabProblem } from "../services/codelabProblemService";
import catalog from "../data/codelab/catalog.json";
import "../styles/LeetCode.css";

/* The catalog is the pattern-wise DSA dataset in `dsanew/`: every problem ships
   a statement, a reference solution and judge-verified tests. Only the index is
   bundled; each problem's statement/tests are fetched from /codelab on demand. */
const problems = catalog.problems;
const categories = catalog.categories;
const problemBySlug = new Map(problems.map(problem => [problem.slug, problem]));

const patternOf = (problem) => problem.patterns?.[0]?.pattern || "DSA";
const categoryOf = (problem) => problem.patterns?.[0]?.category || "DSA";
const problemLabel = (problem) => (problem.number ? `#${problem.number}` : "Classic");

const CATEGORY_ACCENTS = ["mint", "amber", "violet", "cyan"];

const markdownComponents = {
  a: ({ node, href, children, ...props }) => {
    const isLeetCodeProblem = /^https?:\/\/(?:www\.)?leetcode\.com\/problems\//i.test(href || "");
    if (isLeetCodeProblem) {
      return (
        <a
          {...props}
          href={href}
          className="leetcode-external-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open this problem on LeetCode"
        >
          <Code2 size={14} aria-hidden="true" />
          <span>Open on LeetCode</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      );
    }
    return <a {...props} href={href}>{children}</a>;
  },
};

const getDayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const readActivity = () => {
  try { return JSON.parse(localStorage.getItem("leetcode_activity") || "{}"); } catch { return {}; }
};

export default function LeetCodePage({ onClose, onSubmitLeetCode, savedSubmissions = {} }) {
  const initial = problems.find(problem => problem.slug === "two-sum-ii-input-array-is-sorted") || problems[0];
  const [view, setView] = useState("home");
  const [showProblemList, setShowProblemList] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(initial?.slug);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openCategory, setOpenCategory] = useState(categories[0]?.title || "");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [code, setCode] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("leetcode_streak") || 4));
  const [workspaceSplit, setWorkspaceSplit] = useState(50);
  const [outputHeight, setOutputHeight] = useState(320);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const workspaceRef = useRef(null);
  const dragRef = useRef(null);
  const [completed, setCompleted] = useState(() => { try { return JSON.parse(localStorage.getItem("leetcode_completed") || "[]"); } catch { return []; } });
  const [activity, setActivity] = useState(readActivity);
  const [judgeTab, setJudgeTab] = useState("testcase");
  const [activeCaseId, setActiveCaseId] = useState("");
  const [customCases, setCustomCases] = useState([]);
  const [judgeResult, setJudgeResult] = useState(null);
  const [judgeError, setJudgeError] = useState("");
  const [judgeAction, setJudgeAction] = useState(null);
  const [judgeProvider, setJudgeProvider] = useState("jdoodle");

  const selected = problemBySlug.get(selectedSlug) || initial;
  const isRunning = judgeAction === "run";
  const isSubmitting = judgeAction === "submit";
  const judgeReady = Boolean(detail?.judgeAvailable) && !detailLoading;
  const manifest = useMemo(
    () => (detail ? { visibleTests: detail.visibleTests, judgeAvailable: detail.judgeAvailable } : null),
    [detail],
  );

  /* Statement, starter code and tests arrive lazily so the index stays small. */
  useEffect(() => {
    if (!selected || view !== "problem") return;
    let cancelled = false;
    setDetailLoading(true);
    setDetailError("");
    loadCodelabProblem(selected.slug)
      .then(payload => {
        if (cancelled) return;
        setDetail(payload);
        setCode(payload.starterCode);
        setActiveCaseId(payload.visibleTests?.[0]?.id || "");
      })
      .catch(error => { if (!cancelled) { setDetail(null); setDetailError(error.message); } })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [selected?.slug, view]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return problems.filter(problem =>
      (!needle || `${problem.number || ""} ${problem.title} ${patternOf(problem)} ${problem.topicTags.join(" ")}`.toLowerCase().includes(needle)) &&
      (difficulty === "all" || difficulty === problem.difficulty.toLowerCase()) &&
      (categoryFilter === "all" || problem.patterns.some(entry => entry.category === categoryFilter))
    );
  }, [query, difficulty, categoryFilter]);
  const filteredSlugs = useMemo(() => new Set(filtered.map(problem => problem.slug)), [filtered]);
  const isBrowsing = !query.trim() && difficulty === "all" && categoryFilter === "all";

  const selectProblem = useCallback((problem) => {
    if (!problem) return;
    let savedCustom = [];
    try { savedCustom = JSON.parse(localStorage.getItem(`leetcode_custom_cases_${problem.slug}`) || "[]"); } catch { savedCustom = []; }
    setSelectedSlug(problem.slug);
    setDetail(null); setCode(""); setShowSolution(false); setView("problem"); setShowProblemList(false);
    setJudgeResult(null); setJudgeError(""); setJudgeTab("testcase"); setCustomCases(savedCustom);
    setActiveCaseId("");
    setOpenCategory(categoryOf(problem));
  }, []);

  const recordAccepted = (result) => {
    if (completed.includes(selected.slug)) return;
    const next = [...completed, selected.slug];
    setCompleted(next); localStorage.setItem("leetcode_completed", JSON.stringify(next));
    const nextStreak = streak + 1;
    const today = getDayKey();
    const nextActivity = { ...activity, [today]: (activity[today] || 0) + 1 };
    setStreak(nextStreak); setActivity(nextActivity);
    localStorage.setItem("leetcode_streak", String(nextStreak));
    localStorage.setItem("leetcode_activity", JSON.stringify(nextActivity));
    const submission = { problemId: selected.slug, problemNumber: selected.number, title: selected.title, pattern: patternOf(selected), code, status: "accepted", passedTests: result.summary?.passed, totalTests: result.summary?.total, submittedAt: new Date().toISOString() };
    try { const history = JSON.parse(localStorage.getItem("leetcode_submissions") || "[]"); localStorage.setItem("leetcode_submissions", JSON.stringify([submission, ...history].slice(0, 100))); } catch { localStorage.setItem("leetcode_submissions", JSON.stringify([submission])); }
    window.dispatchEvent(new CustomEvent("leetcode-progress", { detail: { streak: nextStreak, completed: next.length } }));
    onSubmitLeetCode?.(submission);
  };

  const parsedCustomCases = (cases) => cases.map((test) => ({ id: test.id, input: JSON.parse(test.inputText), expected: JSON.parse(test.expectedText) }));
  const requireCode = (action) => {
    if (code.trim()) return true;
    setJudgeError(`Enter a Python solution before you ${action}.`);
    setJudgeTab("result");
    return false;
  };
  const handleCustomCasesChange = (next) => {
    setCustomCases(next);
    localStorage.setItem(`leetcode_custom_cases_${selected.slug}`, JSON.stringify(next));
  };
  const handleRun = async () => {
    if (!judgeReady || judgeAction || !requireCode("run the tests")) return;
    setJudgeAction("run"); setJudgeError(""); setJudgeResult(null);
    try {
      const selectedVisible = detail.visibleTests.some(test => test.id === activeCaseId);
      const selectedCustom = customCases.filter(test => test.id === activeCaseId);
      const result = await runLeetCodeTests({ problemId: selected.slug, code, caseIds: selectedVisible ? [activeCaseId] : undefined, customCases: parsedCustomCases(selectedCustom), provider: judgeProvider });
      setJudgeResult(result); setJudgeTab("result");
    } catch (error) { setJudgeError(error.message); setJudgeTab("result"); }
    finally { setJudgeAction(null); }
  };
  const handleSubmit = async () => {
    if (!judgeReady || judgeAction || !requireCode("submit")) return;
    setJudgeAction("submit"); setJudgeError(""); setJudgeResult(null);
    try {
      const result = await submitLeetCodeSolution({ problemId: selected.slug, code, provider: judgeProvider });
      setJudgeResult(result); setJudgeTab("result");
      if (result.accepted) recordAccepted(result);
    } catch (error) { setJudgeError(error.message); setJudgeTab("result"); }
    finally { setJudgeAction(null); }
  };

  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const problemOfDay = problems[(dayOfYear * 7) % Math.max(problems.length, 1)] || initial;
  const difficultyClass = (value) => String(value || "").toLowerCase();
  const recommended = useMemo(() => {
    const unsolved = problems.filter(problem => !completed.includes(problem.slug));
    return (unsolved.length ? unsolved : problems).slice(0, 4);
  }, [completed]);
  const weeklySolved = Object.entries(activity).reduce((total, [date, count]) => {
    const age = Math.floor((Date.now() - new Date(`${date}T00:00:00`).getTime()) / 86400000);
    return age >= 0 && age < 7 ? total + Number(count || 0) : total;
  }, 0);
  const weeklyGoal = 5;
  const contributionCalendar = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() - (52 * 7));
    const weeks = Array.from({ length: 53 }, (_, weekIndex) => Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start);
      date.setDate(start.getDate() + (weekIndex * 7) + dayIndex);
      const key = getDayKey(date);
      const count = date <= today ? Number(activity[key] || 0) : 0;
      return { key, date, count, isFuture: date > today, isToday: key === getDayKey(today) };
    }));
    const months = weeks.map((week, weekIndex) => {
      const firstOfMonth = week.find(day => day.date.getDate() === 1 && !day.isFuture);
      return firstOfMonth ? { weekIndex, label: firstOfMonth.date.toLocaleDateString(undefined, { month: "short" }) } : null;
    }).filter(Boolean);
    const total = weeks.flat().reduce((sum, day) => sum + day.count, 0);
    return { weeks, months, total, start, today };
  }, [activity]);

  const categoryStats = useMemo(() => categories.map(category => {
    const slugs = new Set(category.patterns.flatMap(pattern => pattern.problems));
    return {
      ...category,
      total: slugs.size,
      solved: [...slugs].filter(slug => completed.includes(slug)).length,
    };
  }), [completed]);

  const openLibrary = ({ nextQuery = "", nextDifficulty = "all", nextCategory = "all" } = {}) => {
    setQuery(nextQuery); setDifficulty(nextDifficulty); setCategoryFilter(nextCategory);
    setView("problem"); setShowProblemList(true);
  };
  const pickRandomProblem = () => {
    const pool = problems.filter(problem => !completed.includes(problem.slug));
    selectProblem((pool.length ? pool : problems)[Math.floor(Math.random() * (pool.length || problems.length))]);
  };
  const navigateProblem = (direction) => {
    const currentIndex = problems.findIndex(problem => problem.slug === selected.slug);
    const nextIndex = (currentIndex + direction + problems.length) % problems.length;
    selectProblem(problems[nextIndex]);
  };

  useEffect(() => {
    const move = (event) => {
      if (!dragRef.current) return;
      if (dragRef.current.type === "split" && workspaceRef.current) {
        const bounds = workspaceRef.current.getBoundingClientRect();
        setWorkspaceSplit(Math.min(70, Math.max(30, ((event.clientX - bounds.left) / bounds.width) * 100)));
      }
      if (dragRef.current.type === "output") {
        const pane = dragRef.current.pane;
        const bounds = pane?.getBoundingClientRect();
        if (bounds) setOutputHeight(Math.min(bounds.height - 120, Math.max(110, bounds.bottom - event.clientY)));
      }
    };
    const stop = () => { dragRef.current = null; document.body.style.cursor = ""; document.body.style.userSelect = ""; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
  }, []);

  const startDrag = (type, event) => {
    event.preventDefault();
    dragRef.current = { type, pane: event.currentTarget.closest(".leetcode-editor-pane") };
    document.body.style.cursor = type === "split" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  const renderProblemRow = (problem, { showPattern = true } = {}) => (
    <button
      key={problem.slug}
      className={`leetcode-problem-row ${problem.slug === selected.slug ? "active" : ""}`}
      onClick={() => selectProblem(problem)}
    >
      <span className={`leetcode-status ${completed.includes(problem.slug) ? "done" : ""}`}>
        {completed.includes(problem.slug) ? <Check size={11} /> : (problem.number || "·")}
      </span>
      <span className="leetcode-problem-name">
        <b>{problem.title}</b>
        <small>{showPattern ? patternOf(problem) : `${problem.testCount} tests`}</small>
      </span>
      <span className={`leetcode-difficulty ${difficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
    </button>
  );

  const renderProblemList = () => (
    <aside className="leetcode-list-pane">
      <div className="leetcode-list-heading">
        <div><small>PATTERN LIBRARY</small><h2>Problems</h2></div>
        <span className="leetcode-count">{filtered.length}</span>
      </div>
      <div className="leetcode-search"><Search size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, pattern or tag..." /></div>
      <div className="leetcode-filters">
        <Filter size={12} />
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="all">All difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(category => <option key={category.slug} value={category.title}>{category.title}</option>)}
        </select>
      </div>
      <div className="leetcode-problem-list">
        {isBrowsing ? categoryStats.map(category => {
          const isOpen = openCategory === category.title;
          return (
            <div className="leetcode-category-group" key={category.slug}>
              <button
                className={`leetcode-category-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setOpenCategory(isOpen ? "" : category.title)}
                aria-expanded={isOpen}
              >
                {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                <b>{category.title}</b>
                <small>{category.solved}/{category.total}</small>
              </button>
              {isOpen && category.patterns.map(pattern => (
                <div className="leetcode-pattern-group" key={pattern.slug}>
                  <div className="leetcode-pattern-label" title={pattern.subtitle}>
                    <Layers size={11} /> {pattern.title}
                  </div>
                  {pattern.problems
                    .map(slug => problemBySlug.get(slug))
                    .filter(Boolean)
                    .map(problem => renderProblemRow(problem, { showPattern: false }))}
                </div>
              ))}
            </div>
          );
        }) : filtered.map(problem => renderProblemRow(problem))}
        {!isBrowsing && !filtered.length && <div className="leetcode-list-empty">No problem matches that filter.</div>}
      </div>
    </aside>
  );

  const headerSubtitle = view === "problem"
    ? `${problemLabel(selected)} · ${selected.difficulty} · ${patternOf(selected)}`
    : `${problems.length} problems · ${catalog.counts.patterns} patterns`;

  return (
    <div className="leetcode-shell">
      <header className={`leetcode-topbar ${view === "problem" ? "leetcode-lab-topbar" : ""}`}>
        <div className="leetcode-brand"><div className="leetcode-mark"><Code2 size={16} /></div><div><b>Code Lab</b><span>{headerSubtitle}</span></div></div>
        {view === "problem" ? <>
          <nav className="leetcode-lab-navigation" aria-label="Problem navigation">
            <button className="leetcode-problem-list-button" onClick={() => setShowProblemList(value => !value)} aria-expanded={showProblemList}><LayoutGrid size={16} /> Problem List</button>
            <span className="leetcode-header-divider" />
            <button className="leetcode-icon-button" onClick={() => navigateProblem(-1)} aria-label="Previous problem"><ChevronLeft size={18} /></button>
            <button className="leetcode-icon-button" onClick={() => navigateProblem(1)} aria-label="Next problem"><ChevronRight size={18} /></button>
          </nav>
          <div className="leetcode-lab-actions" aria-label="Code actions">
            <button className="leetcode-run-top" onClick={handleRun} disabled={Boolean(judgeAction) || !judgeReady}>{isRunning ? <Terminal size={15} className="leetcode-spin" /> : <Play size={15} fill="currentColor" />}<span>{isRunning ? "Running" : "Run"}</span></button>
            <button className={`leetcode-submit-top ${completed.includes(selected.slug) ? "completed" : ""}`} onClick={handleSubmit} disabled={Boolean(judgeAction) || !judgeReady}><Check size={16} /><span>{isSubmitting ? "Judging..." : completed.includes(selected.slug) ? "Accepted" : "Submit"}</span></button>
          </div>
          <div className="leetcode-nav-actions"><button onClick={() => setView("home")}><Home size={14} /> Home</button><span className="leetcode-top-stat"><Flame size={15} /> {streak} day streak</span><button className="leetcode-ai-button" onClick={() => setShowTutor(true)}><Sparkles size={14} /> AI Coach</button><button className="leetcode-close" onClick={onClose} aria-label="Close Code Lab"><X size={17} /></button></div>
        </> : <div className="leetcode-nav-actions"><button onClick={() => setView("home")} className="active"><Home size={14} /> Home</button><button onClick={() => { setView("problem"); setShowProblemList(true); }}><LayoutGrid size={14} /> Problem list</button><span className="leetcode-top-stat"><Flame size={15} /> {streak} day streak</span><button className="leetcode-ai-button" onClick={() => setShowTutor(true)}><Sparkles size={14} /> AI Coach</button><button className="leetcode-close" onClick={onClose} aria-label="Close Code Lab"><X size={17} /></button></div>}
      </header>
      {view === "home" ? (
        <main className="leetcode-home">
          <div className="leetcode-home-inner">
            <section className="leetcode-command-hero">
              <div className="leetcode-hero-copy">
                <div className="leetcode-eyebrow"><span className="leetcode-live-dot" /> YOUR PRACTICE ROOM</div>
                <h1>One focused pattern.<br /><span>Every day.</span></h1>
                <p>{problems.length} problems mapped to {catalog.counts.patterns} interview patterns, each with a worked statement, judge-verified tests, and a reference solution when you want to compare.</p>
                <div className="leetcode-command-search"><Search size={18} /><input aria-label="Search the problem library" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter") openLibrary({ nextQuery: query }); }} placeholder={`Search ${problems.length} problems by title, pattern or tag`} /><kbd>ENTER</kbd></div>
                <div className="leetcode-hero-actions"><button className="leetcode-primary-action" onClick={() => selectProblem(problemOfDay)}><Play size={15} fill="currentColor" /> Solve today’s challenge</button><button className="leetcode-secondary-action" onClick={pickRandomProblem}><Shuffle size={15} /> Surprise me</button></div>
              </div>
              <div className="leetcode-daily-card">
                <div className="leetcode-daily-top"><span><CalendarDays size={13} /> DAILY CHALLENGE</span><span className={`leetcode-tag ${difficultyClass(problemOfDay.difficulty)}`}>{problemOfDay.difficulty}</span></div>
                <div className="leetcode-daily-number">{problemOfDay.number ? `#${String(problemOfDay.number).padStart(4, "0")}` : patternOf(problemOfDay)}</div>
                <h2>{problemOfDay.title}</h2>
                <p>{problemOfDay.headline || `${categoryOf(problemOfDay)} · ${patternOf(problemOfDay)}`}</p>
                <div className="leetcode-daily-footer"><span><Code2 size={13} /> Python 3</span><button onClick={() => selectProblem(problemOfDay)} aria-label={`Solve ${problemOfDay.title}`}><ArrowUpRight size={18} /></button></div>
              </div>
            </section>

            <section className="leetcode-progress-strip" aria-label="Practice progress">
              <div><span className="leetcode-metric-icon flame"><Flame size={18} /></span><span><b>{streak}</b><small>day streak</small></span></div>
              <div><span className="leetcode-metric-icon solved"><Check size={18} /></span><span><b>{completed.length}</b><small>problems solved</small></span></div>
              <div className="leetcode-week-goal"><span className="leetcode-metric-icon goal"><Target size={18} /></span><span><b>{Math.min(weeklySolved, weeklyGoal)} / {weeklyGoal}</b><small>weekly goal</small></span><span className="leetcode-goal-track"><i style={{ width: `${Math.min(100, (weeklySolved / weeklyGoal) * 100)}%` }} /></span></div>
              <button onClick={() => openLibrary()}><ListChecks size={16} /><span><b>{problems.length}</b><small>browse library</small></span><ChevronRight size={16} /></button>
            </section>

            <section className="leetcode-contribution-card" aria-labelledby="leetcode-contribution-title">
              <div className="leetcode-contribution-head"><div><span className="leetcode-card-kicker"><Flame size={12} /> PRACTICE ACTIVITY</span><h2 id="leetcode-contribution-title">{contributionCalendar.total} problems solved in the last year</h2></div><span className="leetcode-contribution-streak"><Flame size={14} /> {streak} day streak</span></div>
              <div className="leetcode-contribution-scroll" tabIndex="0" aria-label="Scrollable contribution calendar">
                <div className="leetcode-contribution-chart" role="grid" aria-label="Problem solving contributions over the last year">
                  <div className="leetcode-contribution-months" aria-hidden="true">{contributionCalendar.months.map(month => <span key={`${month.label}-${month.weekIndex}`} style={{ gridColumn: `${month.weekIndex + 1} / span 4` }}>{month.label}</span>)}</div>
                  <div className="leetcode-contribution-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
                  <div className="leetcode-contribution-weeks">{contributionCalendar.weeks.map((week) => <div className="leetcode-contribution-week" role="row" key={week[0].key}>{week.map(day => { const level = day.count === 0 ? 0 : day.count === 1 ? 1 : day.count === 2 ? 2 : day.count === 3 ? 3 : 4; const label = `${day.count || "No"} ${day.count === 1 ? "problem" : "problems"} solved on ${day.date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`; return <span role="gridcell" aria-label={label} title={label} key={day.key} className={`leetcode-contribution-cell level-${level}${day.isToday ? " is-today" : ""}${day.isFuture ? " is-future" : ""}`} />; })}</div>)}</div>
                </div>
              </div>
              <div className="leetcode-contribution-foot"><span>Solutions marked as solved count toward your activity.</span><div className="leetcode-contribution-legend" aria-label="Contribution intensity from less to more"><span>Less</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More</span></div></div>
            </section>

            <section className="leetcode-dashboard-grid leetcode-dashboard-grid-new">
              <div className="leetcode-recommended-card">
                <div className="leetcode-section-heading"><div><span className="leetcode-card-kicker"><Sparkles size={12} /> PICKED FOR YOUR NEXT SESSION</span><h2>Keep your momentum</h2></div><button onClick={() => openLibrary()}>All problems <ChevronRight size={14} /></button></div>
                <div className="leetcode-recommended-list">{recommended.map((problem, index) => <button key={problem.slug} onClick={() => selectProblem(problem)}><span className="leetcode-recommended-index">0{index + 1}</span><span className="leetcode-recommended-copy"><b>{problem.title}</b><small>{problemLabel(problem)} · {patternOf(problem)}</small></span><span className={`leetcode-difficulty ${difficultyClass(problem.difficulty)}`}>{problem.difficulty}</span><ChevronRight size={15} /></button>)}</div>
              </div>
              <aside className="leetcode-coach-card">
                <div className="leetcode-coach-orb"><Brain size={23} /><span /></div>
                <span className="leetcode-card-kicker">AI PATTERN COACH</span><h2>Think out loud.</h2><p>Validate an approach, ask for the smallest useful hint, or review complexity before you submit.</p>
                <div className="leetcode-coach-prompts"><span>“Give me one hint”</span><span>“Review my complexity”</span></div>
                <button onClick={() => setShowTutor(true)}>Start a coaching session <ArrowUpRight size={14} /></button>
              </aside>
            </section>

            <section className="leetcode-library-section">
              <div className="leetcode-section-heading">
                <div><span className="leetcode-card-kicker">PATTERN TRACKS</span><h2>Practice by pattern</h2></div>
                <div className="leetcode-difficulty-actions"><button onClick={() => openLibrary({ nextDifficulty: "easy" })}>Easy</button><button onClick={() => openLibrary({ nextDifficulty: "medium" })}>Medium</button><button onClick={() => openLibrary({ nextDifficulty: "hard" })}>Hard</button></div>
              </div>
              <div className="leetcode-collection-grid">{categoryStats.map((category, index) => (
                <button className={`leetcode-topic-card ${CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length]}`} key={category.slug} onClick={() => openLibrary({ nextCategory: category.title })}>
                  <span className="leetcode-topic-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="leetcode-topic-icon"><TrendingUp size={19} /></span>
                  <b>{category.title}</b>
                  <p>{category.subtitle || `${category.patterns.length} patterns to work through.`}</p>
                  <small>{category.solved}/{category.total} solved <ChevronRight size={12} /></small>
                </button>
              ))}</div>
            </section>

          </div>
        </main>
      ) : (
        <div className="leetcode-workspace-view">
          {showProblemList && renderProblemList()}
          <section className="leetcode-main">
            <div ref={workspaceRef} className="leetcode-workspace" style={{ gridTemplateColumns: `${workspaceSplit}% 8px calc(${100 - workspaceSplit}% - 8px)` }}>
              <article className="leetcode-description">
                <div className="leetcode-tabs"><button className={!showSolution ? "active" : ""} onClick={() => setShowSolution(false)}><BookOpen size={15} /> Description</button><button className={showSolution ? "active" : ""} onClick={() => setShowSolution(true)}><Eye size={15} /> Solution</button></div>
                <div className="leetcode-description-scroll">
                  <div className="leetcode-problem-heading">
                    <span className="leetcode-breadcrumb">{categoryOf(selected).toUpperCase()} · {patternOf(selected).toUpperCase()}</span>
                    <h1>{selected.number ? `${selected.number}. ` : ""}{selected.title}</h1>
                    <div className="leetcode-tags">
                      <span className={`leetcode-tag ${difficultyClass(selected.difficulty)}`}>{selected.difficulty}</span>
                      <span className="leetcode-tag muted">Python 3</span>
                      <span className="leetcode-tag muted">{selected.testCount} test cases</span>
                      {selected.premium && <span className="leetcode-tag muted">Premium · restated</span>}
                      {selected.source === "authored" && <span className="leetcode-tag muted">Classic</span>}
                    </div>
                  </div>
                  {detailLoading && <div className="leetcode-detail-state"><Loader2 size={15} className="leetcode-spin" /> Loading problem…</div>}
                  {detailError && <div className="leetcode-detail-state error">{detailError}</div>}
                  {!detailLoading && !detailError && detail && (showSolution
                    ? <div className="leetcode-solution-view">
                        <div className="leetcode-solution-toolbar"><span><Code2 size={14} /> Reference solution · read only</span><button onClick={() => { setCode(detail.solution); setShowSolution(false); }}><Code2 size={13} /> Use this solution</button></div>
                        <div className="leetcode-solution-editor"><Editor height="100%" language="python" theme="vs-dark" value={detail.solution} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, padding: { top: 18 }, lineNumbersMinChars: 3, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, domReadOnly: true }} /></div>
                      </div>
                    : <div className="leetcode-copy"><ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{detail.statement}</ReactMarkdown></div>)}
                </div>
              </article>
              <div className="leetcode-horizontal-splitter" onPointerDown={(event) => startDrag("split", event)} title="Drag to resize panels" role="separator" aria-orientation="vertical"><span /></div>
              <section className="leetcode-editor-pane">
                <div className="leetcode-pane-title"><span><Code2 size={15} /> Code</span></div>
                <div className="leetcode-editor-toolbar">
                  <div className="leetcode-toolbar-left">
                    <span className="leetcode-language">Python3</span>
                    <select
                      className="leetcode-provider-select"
                      value={judgeProvider}
                      onChange={e => setJudgeProvider(e.target.value)}
                      title="Code execution provider"
                    >
                      {RUN_PROVIDERS.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <span className="leetcode-editor-mode">Auto save</span>
                </div>
                <div className="leetcode-editor"><Editor height="100%" language="python" theme="vs-dark" value={code} onChange={value => setCode(value || "")} options={{ minimap: { enabled: false }, fontSize: 14, lineHeight: 22, padding: { top: 18 }, lineNumbersMinChars: 3, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4 }} /></div>
                <div className="leetcode-runbar"><span><Check size={13} /> Saved</span><span>{detail?.hiddenTestCount ? `${detail.visibleTests.length} sample · ${detail.hiddenTestCount} hidden on submit` : "Select a case, then run or submit"}</span></div>
                <div className="leetcode-output-splitter" onPointerDown={(event) => startDrag("output", event)} title="Drag to resize test panel" role="separator" aria-orientation="horizontal"><span /></div>
                <div className={`leetcode-output ${outputExpanded ? "expanded" : ""}`} style={{ height: outputExpanded ? "60%" : outputHeight }}><button className="leetcode-output-expand" onClick={() => setOutputExpanded(value => !value)}>{outputExpanded ? "Collapse" : "Expand"}</button><TestCasePanel manifest={manifest} tab={judgeTab} onTabChange={setJudgeTab} activeCaseId={activeCaseId} onActiveCaseChange={setActiveCaseId} customCases={customCases} onCustomCasesChange={handleCustomCasesChange} result={judgeResult} requestError={judgeError} /></div>
              </section>
            </div>
          </section>
        </div>
      )}
      {showTutor && <AITutorPanel isOpen={showTutor} onClose={() => setShowTutor(false)} activeTopic={`${selected.title} (${patternOf(selected)})`} activeModule="Code Lab problem" activeCode={code} onInsertCode={(insertedCode) => { setCode(insertedCode); setShowTutor(false); }} />}
    </div>
  );
}
