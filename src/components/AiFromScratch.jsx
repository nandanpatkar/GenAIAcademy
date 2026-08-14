import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeft, ArrowRight, List, PanelLeft,
  BookOpen, Code2, Package, CircleHelp, Check, CheckCircle2, Circle, Clock,
  Loader2, AlertCircle, Layers, Sparkles, Copy,
} from "lucide-react";
import { AIFS_PHASES, AIFS_TRACKS, AIFS_TOTAL_LESSONS, AIFS_CONTENT_BASE } from "../data/aiFromScratchData";
import { makeAifsComponents, extractToc, aifsUrlTransform, AifsCode } from "./AiFromScratchMarkdown";
import { useTheme } from "../contexts/ThemeContext";
import { fetchMarkdown } from "../utils/fetchMarkdown";
import "../styles/AiFromScratch.css";

/* The AI from Scratch curriculum, read in-app.
 *
 * 539 lessons over three tracks. Each lesson is prose plus up to three
 * companions — the runnable code it builds, the artifact it ships (a prompt, a
 * skill, an agent, an MCP server), and a pre/check/post quiz — so the reading
 * pane is tabbed rather than one long scroll.
 *
 * Bodies are fetched from public/ai-from-scratch/ on demand and cached for the
 * session; the index in src/data/aiFromScratchData.js is the only thing that
 * loads up front. Regenerate both with `npm run build:aifs`.
 */

const LS_PROGRESS = "aifs_progress";
const LS_LAST = "aifs_last_lesson";

const LESSON_BY_SLUG = {};
const PHASE_BY_SLUG = {};
AIFS_PHASES.forEach((phase) => {
  phase.lessons.forEach((lesson) => {
    LESSON_BY_SLUG[lesson.slug] = lesson;
    PHASE_BY_SLUG[lesson.slug] = phase;
  });
});

/* Reading order across the whole curriculum, for prev / next. */
const ORDER = AIFS_PHASES.flatMap((phase) => phase.lessons.map((lesson) => lesson.slug));
const ORDER_INDEX = ORDER.reduce((acc, slug, index) => { acc[slug] = index; return acc; }, {});

const bodyCache = new Map();
const bundleCache = new Map();

const readProgress = () => {
  try { return JSON.parse(localStorage.getItem(LS_PROGRESS) || "{}"); } catch { return {}; }
};

const formatMinutes = (minutes) => {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
};

export default function AiFromScratch({ track: initialTrack = "curriculum", lesson: deepLink = null, onClose }) {
  const { theme } = useTheme();
  const dark = theme !== "light";

  const [trackId, setTrackId] = useState(initialTrack);
  const [activeSlug, setActiveSlug] = useState(null);
  const [openPhases, setOpenPhases] = useState({});
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("lesson");

  const [content, setContent] = useState("");
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bundle, setBundle] = useState(null);
  const [bundleState, setBundleState] = useState("idle");
  const [activeFile, setActiveFile] = useState(0);
  const [activeArtifact, setActiveArtifact] = useState(0);

  const [progress, setProgress] = useState(readProgress);
  const [railOpen, setRailOpen] = useState(false);

  const bodyRef = useRef(null);
  const searchRef = useRef(null);
  const pendingHash = useRef(null);

  const lesson = activeSlug ? LESSON_BY_SLUG[activeSlug] : null;
  const phase = activeSlug ? PHASE_BY_SLUG[activeSlug] : null;
  const trackPhases = useMemo(
    () => AIFS_PHASES.filter((item) => item.track === trackId),
    [trackId]
  );

  useEffect(() => { setTrackId(initialTrack); }, [initialTrack]);

  /* ── navigation ── */

  const openLesson = useCallback((slug) => {
    const target = LESSON_BY_SLUG[slug];
    if (!target) return;
    const owner = PHASE_BY_SLUG[slug];
    setActiveSlug(slug);
    setTrackId(owner.track);
    setOpenPhases((prev) => ({ ...prev, [owner.id]: true }));
    setTab("lesson");
    setRailOpen(false);
    setQuery("");
    try { localStorage.setItem(LS_LAST, slug); } catch { /* ignore */ }
  }, []);

  /* A study-path click arrives as { slug, hash } — open that lesson and, once
     its body is in, scroll to the section the reader clicked. */
  useEffect(() => {
    if (!deepLink?.slug || !LESSON_BY_SLUG[deepLink.slug]) return;
    pendingHash.current = deepLink.hash || null;
    openLesson(deepLink.slug);
  }, [deepLink, openLesson]);

  const step = useCallback((delta) => {
    const index = ORDER_INDEX[activeSlug];
    if (index === undefined) return;
    const next = ORDER[index + delta];
    if (next) openLesson(next);
  }, [activeSlug, openLesson]);

  const toggleComplete = useCallback((slug) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (next[slug]) delete next[slug]; else next[slug] = Date.now();
      try { localStorage.setItem(LS_PROGRESS, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  /* ⌘K / Ctrl-K focuses search. */
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setRailOpen(true);
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── lesson body ── */

  useEffect(() => {
    if (!lesson) { setContent(""); setToc([]); setError(null); return undefined; }
    let alive = true;

    const apply = (text) => {
      if (!alive) return;
      setContent(text);
      setToc(extractToc(text));
      setLoading(false);
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      if (pendingHash.current) {
        const id = pendingHash.current;
        pendingHash.current = null;
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    if (bodyCache.has(lesson.slug)) { setError(null); apply(bodyCache.get(lesson.slug)); return undefined; }

    setLoading(true);
    setError(null);
    fetchMarkdown(`${AIFS_CONTENT_BASE}/md/${lesson.slug}.md`)
      .then((text) => { bodyCache.set(lesson.slug, text); apply(text); })
      .catch((err) => { if (alive) { setError(err.message); setLoading(false); } });

    return () => { alive = false; };
  }, [lesson]);

  /* ── code / artifacts / quiz, loaded only when one of those tabs opens ── */

  useEffect(() => {
    if (!lesson || tab === "lesson") return undefined;
    const slug = lesson.slug;
    if (bundleCache.has(slug)) { setBundle(bundleCache.get(slug)); setBundleState("ready"); return undefined; }

    let alive = true;
    setBundleState("loading");
    fetch(`${AIFS_CONTENT_BASE}/bundle/${slug}.json`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data) => {
        bundleCache.set(slug, data);
        if (!alive) return;
        setBundle(data);
        setBundleState("ready");
      })
      .catch(() => { if (alive) { setBundle(null); setBundleState("error"); } });

    return () => { alive = false; };
  }, [lesson, tab]);

  useEffect(() => { setBundle(null); setBundleState("idle"); setActiveFile(0); setActiveArtifact(0); }, [activeSlug]);

  /* ── scroll spy for the "on this page" rail ── */

  useEffect(() => {
    if (!toc.length || !bodyRef.current) return undefined;
    const targets = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveHeading(visible[0].target.id);
      },
      { root: bodyRef.current, rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [toc, content, tab]);

  /* ── search ── */

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return null;
    const found = [];
    for (const item of AIFS_PHASES) {
      for (const entry of item.lessons) {
        const haystack = `${entry.title} ${entry.blurb} ${item.title}`.toLowerCase();
        if (haystack.includes(needle)) found.push({ lesson: entry, phase: item });
        if (found.length >= 60) break;
      }
    }
    return found;
  }, [query]);

  const components = useMemo(
    () => makeAifsComponents({
      dark,
      onLessonLink: openLesson,
      resolveLesson: (slug) => Boolean(LESSON_BY_SLUG[slug]),
    }),
    [dark, openLesson]
  );

  const completedInTrack = useMemo(() => {
    let done = 0;
    let total = 0;
    trackPhases.forEach((item) => {
      item.lessons.forEach((entry) => {
        total += 1;
        if (progress[entry.slug]) done += 1;
      });
    });
    return { done, total };
  }, [trackPhases, progress]);

  const lastSlug = useMemo(() => {
    try { return localStorage.getItem(LS_LAST); } catch { return null; }
  }, []);

  const index = activeSlug !== null ? ORDER_INDEX[activeSlug] : undefined;
  const previous = index !== undefined ? LESSON_BY_SLUG[ORDER[index - 1]] : null;
  const next = index !== undefined ? LESSON_BY_SLUG[ORDER[index + 1]] : null;

  /* ── rail ── */

  const renderRail = () => (
    <aside className={`aifs-rail${railOpen ? " aifs-rail--open" : ""}`}>
      <div className="aifs-rail-head">
        <div className="aifs-brand">
          <span className="aifs-brand-mark"><Sparkles size={15} /></span>
          <div>
            <p className="aifs-brand-title">AI from Scratch</p>
            <p className="aifs-brand-sub">{AIFS_TOTAL_LESSONS} lessons</p>
          </div>
          <button className="aifs-rail-close" type="button" onClick={() => setRailOpen(false)} aria-label="Close navigation">
            <X size={15} />
          </button>
        </div>

        <div className="aifs-tracks">
          {AIFS_TRACKS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`aifs-track${item.id === trackId ? " aifs-track--on" : ""}`}
              onClick={() => setTrackId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="aifs-search">
          <Search size={14} />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons"
            aria-label="Search lessons"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>
          ) : null}
        </div>
      </div>

      <div className="aifs-rail-body">
        {results ? (
          <div className="aifs-results">
            <p className="aifs-results-count">
              {results.length ? `${results.length} lesson${results.length === 1 ? "" : "s"}` : "No matches"}
            </p>
            {results.map(({ lesson: entry, phase: owner }) => (
              <button
                key={entry.slug}
                type="button"
                className={`aifs-result${entry.slug === activeSlug ? " aifs-result--on" : ""}`}
                onClick={() => openLesson(entry.slug)}
              >
                <span className="aifs-result-title">{entry.title}</span>
                <span className="aifs-result-phase">{owner.title}</span>
              </button>
            ))}
          </div>
        ) : (
          trackPhases.map((item) => {
            const open = openPhases[item.id];
            const done = item.lessons.filter((entry) => progress[entry.slug]).length;
            return (
              <div className="aifs-phase" key={item.id}>
                <button
                  type="button"
                  className={`aifs-phase-head${open ? " aifs-phase-head--open" : ""}`}
                  onClick={() => setOpenPhases((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  <span className="aifs-phase-title">{item.title}</span>
                  <span className="aifs-phase-count">{done ? `${done}/${item.lessons.length}` : item.lessons.length}</span>
                </button>
                {open ? (
                  <div className="aifs-lessons">
                    {item.lessons.map((entry) => (
                      <button
                        key={entry.slug}
                        type="button"
                        className={`aifs-lesson${entry.slug === activeSlug ? " aifs-lesson--on" : ""}`}
                        onClick={() => openLesson(entry.slug)}
                      >
                        <span className="aifs-lesson-tick">
                          {progress[entry.slug] ? <Check size={11} /> : null}
                        </span>
                        <span className="aifs-lesson-title">{entry.title}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <div className="aifs-rail-foot">
        <div className="aifs-progress-bar">
          <span style={{ width: `${completedInTrack.total ? (completedInTrack.done / completedInTrack.total) * 100 : 0}%` }} />
        </div>
        <p>{completedInTrack.done} of {completedInTrack.total} complete</p>
      </div>
    </aside>
  );

  /* ── home ── */

  const renderHome = () => {
    const activeTrack = AIFS_TRACKS.find((item) => item.id === trackId);
    const resume = lastSlug && LESSON_BY_SLUG[lastSlug] ? LESSON_BY_SLUG[lastSlug] : null;
    return (
      <div className="aifs-home">
        <header className="aifs-home-head">
          <p className="aifs-eyebrow">AI from Scratch</p>
          <h1>{activeTrack?.label || "Curriculum"}</h1>
          <p className="aifs-home-blurb">{activeTrack?.blurb}</p>
          {resume ? (
            <button type="button" className="aifs-resume" onClick={() => openLesson(resume.slug)}>
              <BookOpen size={14} />
              Continue — {resume.title}
              <ArrowRight size={14} />
            </button>
          ) : null}
        </header>

        <div className="aifs-phase-grid">
          {trackPhases.map((item) => {
            const done = item.lessons.filter((entry) => progress[entry.slug]).length;
            const minutes = item.lessons.reduce((sum, entry) => sum + (entry.minutes || 0), 0);
            return (
              <button
                key={item.id}
                type="button"
                className="aifs-phase-card"
                onClick={() => {
                  setOpenPhases((prev) => ({ ...prev, [item.id]: true }));
                  openLesson(item.lessons[0].slug);
                }}
              >
                <span className="aifs-phase-card-top">
                  <span className="aifs-phase-num">{item.track === "curriculum" ? String(item.n).padStart(2, "0") : <Layers size={14} />}</span>
                  <span className="aifs-phase-card-meta">
                    {item.lessons.length} lessons
                    {item.hours ? ` · ~${item.hours}h` : minutes ? ` · ${formatMinutes(minutes)}` : ""}
                  </span>
                </span>
                <span className="aifs-phase-card-title">{item.title}</span>
                {item.blurb ? <span className="aifs-phase-card-blurb">{item.blurb}</span> : null}
                <span className="aifs-phase-card-bar">
                  <span style={{ width: `${(done / item.lessons.length) * 100}%` }} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── lesson panes ── */

  const renderCode = () => {
    if (bundleState === "loading") return <div className="aifs-state"><Loader2 className="aifs-spin" size={18} /> Loading code…</div>;
    const files = bundle?.code || [];
    if (!files.length) return <div className="aifs-state">This lesson ships no code files.</div>;
    const file = files[Math.min(activeFile, files.length - 1)];
    return (
      <div className="aifs-files">
        {files.length > 1 ? (
          <div className="aifs-file-strip" role="tablist">
            {files.map((item, position) => (
              <button
                key={item.path}
                type="button"
                role="tab"
                aria-selected={position === activeFile}
                className={`aifs-file${position === activeFile ? " aifs-file--on" : ""}`}
                onClick={() => setActiveFile(position)}
              >
                {item.path}
              </button>
            ))}
          </div>
        ) : null}
        <AifsCode language={file.lang} code={file.source} filename={file.path} dark={dark} />
      </div>
    );
  };

  const renderArtifacts = () => {
    if (bundleState === "loading") return <div className="aifs-state"><Loader2 className="aifs-spin" size={18} /> Loading artifacts…</div>;
    const artifacts = bundle?.artifacts || [];
    if (!artifacts.length) return <div className="aifs-state">This lesson ships no reusable artifact.</div>;
    const artifact = artifacts[Math.min(activeArtifact, artifacts.length - 1)];
    return (
      <div className="aifs-artifacts">
        {artifacts.length > 1 ? (
          <div className="aifs-file-strip" role="tablist">
            {artifacts.map((item, position) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={position === activeArtifact}
                className={`aifs-file${position === activeArtifact ? " aifs-file--on" : ""}`}
                onClick={() => setActiveArtifact(position)}
              >
                {item.name}
              </button>
            ))}
          </div>
        ) : null}
        <div className="aifs-artifact-head">
          <span>{artifact.name}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(artifact.markdown)}
          >
            <Copy size={12} /> Copy markdown
          </button>
        </div>
        <div className="aifs-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} urlTransform={aifsUrlTransform}>
            {artifact.markdown}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <div className="aifs-root" data-theme={dark ? "dark" : "light"}>
      {renderRail()}
      {railOpen ? <div className="aifs-scrim" onClick={() => setRailOpen(false)} /> : null}

      <div className="aifs-main">
        <header className="aifs-topbar">
          <button className="aifs-icon-btn aifs-rail-toggle" type="button" onClick={() => setRailOpen(true)} aria-label="Open navigation">
            <PanelLeft size={16} />
          </button>

          <div className="aifs-crumbs">
            <button type="button" onClick={() => setActiveSlug(null)}>AI from Scratch</button>
            {phase ? (<><ChevronRight size={12} /><span>{phase.title}</span></>) : null}
          </div>

          <div className="aifs-topbar-actions">
            {lesson ? (
              <button
                type="button"
                className={`aifs-complete${progress[lesson.slug] ? " aifs-complete--on" : ""}`}
                onClick={() => toggleComplete(lesson.slug)}
              >
                {progress[lesson.slug] ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                {progress[lesson.slug] ? "Completed" : "Mark complete"}
              </button>
            ) : null}
            {onClose ? (
              <button className="aifs-icon-btn" type="button" onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            ) : null}
          </div>
        </header>

        {!lesson ? (
          <div className="aifs-scroll" ref={bodyRef}>{renderHome()}</div>
        ) : (
          <>
            <div className="aifs-lesson-head">
              <h1>{lesson.title}</h1>
              {lesson.blurb ? <p className="aifs-lesson-blurb">{lesson.blurb}</p> : null}
              <div className="aifs-chips">
                {lesson.type ? <span className="aifs-chip aifs-chip--type">{lesson.type}</span> : null}
                {lesson.time ? <span className="aifs-chip"><Clock size={11} />{lesson.time.replace(/^~\s*/, "")}</span> : null}
                {lesson.langs ? <span className="aifs-chip">{lesson.langs}</span> : null}
                {lesson.prereq ? <span className="aifs-chip aifs-chip--muted">Prerequisites: {lesson.prereq}</span> : null}
              </div>

              <div className="aifs-tabs" role="tablist">
                {[
                  { id: "lesson", label: "Lesson", icon: BookOpen, count: 0 },
                  { id: "code", label: "Code", icon: Code2, count: lesson.code },
                  { id: "artifacts", label: "Artifact", icon: Package, count: lesson.artifacts },
                  { id: "quiz", label: "Quiz", icon: CircleHelp, count: lesson.quiz },
                ].filter((item) => item.id === "lesson" || item.count > 0).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === item.id}
                    className={`aifs-tab${tab === item.id ? " aifs-tab--on" : ""}`}
                    onClick={() => setTab(item.id)}
                  >
                    <item.icon size={13} />
                    {item.label}
                    {item.count ? <span className="aifs-tab-count">{item.count}</span> : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="aifs-reader">
              <div className="aifs-scroll" ref={bodyRef}>
                <div className="aifs-column">
                  {tab === "lesson" ? (
                    loading ? (
                      <div className="aifs-state"><Loader2 className="aifs-spin" size={18} /> Loading lesson…</div>
                    ) : error ? (
                      <div className="aifs-state aifs-state--error"><AlertCircle size={18} /> {error}</div>
                    ) : (
                      <div className="aifs-prose">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} urlTransform={aifsUrlTransform}>
                          {content}
                        </ReactMarkdown>
                      </div>
                    )
                  ) : null}

                  {tab === "code" ? renderCode() : null}
                  {tab === "artifacts" ? renderArtifacts() : null}
                  {tab === "quiz" ? (
                    bundleState === "loading"
                      ? <div className="aifs-state"><Loader2 className="aifs-spin" size={18} /> Loading quiz…</div>
                      : <Quiz key={lesson.slug} questions={bundle?.quiz || []} />
                  ) : null}

                  <nav className="aifs-pager">
                    {previous ? (
                      <button type="button" onClick={() => step(-1)}>
                        <ArrowLeft size={14} />
                        <span><small>Previous</small>{previous.title}</span>
                      </button>
                    ) : <span />}
                    {next ? (
                      <button type="button" className="aifs-pager-next" onClick={() => step(1)}>
                        <span><small>Next</small>{next.title}</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : <span />}
                  </nav>
                </div>
              </div>

              {tab === "lesson" && toc.length > 1 ? (
                <nav className="aifs-toc">
                  <p className="aifs-toc-head"><List size={12} /> On this page</p>
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`aifs-toc-item aifs-toc-item--${item.level}${activeHeading === item.id ? " aifs-toc-item--on" : ""}`}
                      onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── quiz ─────────────────────────────────────────────────────────────────
   Upstream tags each question `pre`, `check`, or `post` — read before the
   lesson, during it, and after. The grouping is kept because it is what makes
   the pre-questions useful: they are meant to be wrong on the first pass. */

const STAGE_LABEL = {
  pre: "Before you read",
  check: "Check your understanding",
  post: "After the lesson",
};

function Quiz({ questions }) {
  const [picked, setPicked] = useState({});

  if (!questions.length) return <div className="aifs-state">This lesson ships no quiz.</div>;

  const stages = ["pre", "check", "post"];
  const grouped = stages
    .map((stage) => ({ stage, items: questions.filter((item) => (item.stage || "check") === stage) }))
    .filter((group) => group.items.length);
  const ungrouped = questions.filter((item) => item.stage && !stages.includes(item.stage));
  if (ungrouped.length) grouped.push({ stage: "other", items: ungrouped });

  const answered = Object.keys(picked).length;
  const correct = Object.entries(picked).filter(([key, value]) => questions[Number(key)]?.correct === value).length;

  return (
    <div className="aifs-quiz">
      <div className="aifs-quiz-head">
        <span>{questions.length} questions</span>
        {answered ? <span className="aifs-quiz-score">{correct} / {answered} correct</span> : null}
      </div>

      {grouped.map((group) => (
        <section key={group.stage} className="aifs-quiz-stage">
          <h3>{STAGE_LABEL[group.stage] || "Questions"}</h3>
          {group.items.map((item) => {
            const position = questions.indexOf(item);
            const choice = picked[position];
            const decided = choice !== undefined;
            return (
              <div className="aifs-question" key={position}>
                <p className="aifs-question-text">{item.question}</p>
                <div className="aifs-options">
                  {(item.options || []).map((option, optionIndex) => {
                    const isCorrect = optionIndex === item.correct;
                    const chosen = choice === optionIndex;
                    let state = "";
                    if (decided && isCorrect) state = " aifs-option--right";
                    else if (decided && chosen) state = " aifs-option--wrong";
                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        disabled={decided}
                        className={`aifs-option${state}`}
                        onClick={() => setPicked((prev) => ({ ...prev, [position]: optionIndex }))}
                      >
                        <span className="aifs-option-key">{String.fromCharCode(65 + optionIndex)}</span>
                        {option}
                      </button>
                    );
                  })}
                </div>
                {decided && item.explanation ? (
                  <p className="aifs-explain">{item.explanation}</p>
                ) : null}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
