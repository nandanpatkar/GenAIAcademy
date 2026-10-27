import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeft, ArrowRight, List, PanelLeft,
  BookOpen, Code2, Package, CircleHelp, Check, CheckCircle2, Circle, Clock,
  Loader2, AlertCircle, Sparkles, Copy, ClipboardCheck, BadgeCheck, ShieldCheck, Gauge,
} from "lucide-react";
import { AIP_CONTENT_BASE, AIP_EXAM, AIP_MODULES, AIP_TOTAL_LESSONS, AIP_TRACKS } from "../data/awsGenAiData";
import { aipUrlTransform, extractAipToc, makeAipComponents } from "./awsGenai/AwsGenAiMarkdown";
import AwsLessonQuiz from "./awsGenai/AwsLessonQuiz";
import AwsLabCode from "./awsGenai/AwsLabCode";
import { useTheme } from "../contexts/ThemeContext";
import { fetchMarkdown } from "../utils/fetchMarkdown";
import LessonCoach, { AskAiChip, useSelectionAsk } from "../pages/dsa/coach/LessonCoach";
import { AIP_COURSE } from "../pages/dsa/coach/prompt";
import "../styles/AiFromScratch.css";
import "../styles/AwsGenAi.css";

/* The AWS Certified Generative AI Developer – Professional (AIP-C01) study
 * guide, read in-app — the same shape as AI from Scratch.
 *
 * 64 lessons in ten modules plus an exam-reference track. Every lesson is
 * prose with animated figures, and three companions built from the lesson
 * itself: the lab code (runnable where it is an offline simulation), the
 * artifacts it ships (an AI skill and an exam cheat sheet), and a quiz of
 * exam-style questions, recall checkpoints and revision cards.
 *
 * Bodies come from public/aws-genai/ on demand and are cached for the
 * session; src/data/awsGenAiData.js is the only thing loaded up front.
 * Regenerate both with `npm run build:aws-genai`.
 */

const LS_PROGRESS = "aip_progress";
const LS_LAST = "aip_last_lesson";

const LESSON_BY_SLUG = {};
const MODULE_BY_SLUG = {};
AIP_MODULES.forEach((module) => {
  module.lessons.forEach((lesson) => {
    LESSON_BY_SLUG[lesson.slug] = lesson;
    MODULE_BY_SLUG[lesson.slug] = module;
  });
});

/* Reading order within each track, for previous / next. */
const ORDER = AIP_MODULES.reduce((acc, module) => {
  acc[module.track] = [...(acc[module.track] || []), ...module.lessons.map((lesson) => lesson.slug)];
  return acc;
}, {});

const COACH_LESSONS = AIP_MODULES.flatMap((module) => module.lessons.map((lesson) => ({
  slug: lesson.slug,
  title: lesson.title,
  blurb: lesson.blurb,
  time: lesson.minutes ? `${lesson.minutes} min read` : "",
  phaseTitle: module.track === "guide" ? `Module ${String(module.n).padStart(2, "0")} · ${module.title}` : module.title,
})));

const COACH_INTRO = {
  title: "I'm your AIP-C01 tutor",
  body: "I've read this lesson, its lab code and its exam notes. Ask me to explain a service, compare two options the exam likes to confuse, quiz you, or make flashcards.",
};

const DOMAIN_NAME = Object.fromEntries(AIP_EXAM.domains.map((domain) => [domain.n, domain.short]));

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

function DomainChips({ domains = [], compact = false }) {
  if (!domains.length) return null;
  return domains.map((n) => (
    <span key={n} className={`aip-dom aip-dom-${n}${compact ? " aip-dom--compact" : ""}`} title={`Domain ${n}: ${DOMAIN_NAME[n]}`}>
      D{n}{compact ? "" : ` · ${DOMAIN_NAME[n]}`}
    </span>
  ));
}

export default function AwsGenAi({ track: initialTrack = "guide", lesson: deepLink = null, onClose, onOpenPractice }) {
  const { theme } = useTheme();
  const dark = theme !== "light";

  const [trackId, setTrackId] = useState(initialTrack);
  const [activeSlug, setActiveSlug] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("lesson");

  const [content, setContent] = useState("");
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bundle, setBundle] = useState(null);
  const [bundleState, setBundleState] = useState("idle");
  const [codeFocus, setCodeFocus] = useState(null);
  const [activeArtifact, setActiveArtifact] = useState(0);

  const [progress, setProgress] = useState(readProgress);
  const [railOpen, setRailOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorRequest, setTutorRequest] = useState(null);

  const bodyRef = useRef(null);
  const searchRef = useRef(null);
  const pendingHash = useRef(null);

  const lesson = activeSlug ? LESSON_BY_SLUG[activeSlug] : null;
  const module = activeSlug ? MODULE_BY_SLUG[activeSlug] : null;
  const trackModules = useMemo(() => AIP_MODULES.filter((item) => item.track === trackId), [trackId]);

  useEffect(() => {
    setTrackId(initialTrack);
    // A sidebar click into the other track lands on that track's home, not on
    // the lesson still open from the first one.
    setActiveSlug((current) => (current && MODULE_BY_SLUG[current]?.track !== initialTrack ? null : current));
  }, [initialTrack]);

  const [selection, clearSelection] = useSelectionAsk(bodyRef, Boolean(lesson));
  const askAbout = (item) => { setTutorOpen(true); setTutorRequest({ id: Date.now(), context: [item] }); clearSelection(); };

  /* ── navigation ── */

  const openLesson = useCallback((slug, hash = null) => {
    const target = LESSON_BY_SLUG[slug];
    if (!target) return;
    const owner = MODULE_BY_SLUG[slug];
    pendingHash.current = hash;
    setActiveSlug((current) => {
      if (current === slug && hash) {
        requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
        pendingHash.current = null;
      }
      return slug;
    });
    setTrackId(owner.track);
    setOpenModules((prev) => ({ ...prev, [owner.id]: true }));
    setTab("lesson");
    setRailOpen(false);
    setQuery("");
    try { localStorage.setItem(LS_LAST, slug); } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    if (!deepLink?.slug || !LESSON_BY_SLUG[deepLink.slug]) return;
    openLesson(deepLink.slug, deepLink.hash || null);
  }, [deepLink, openLesson]);

  const step = useCallback((delta) => {
    if (!module) return;
    const order = ORDER[module.track] || [];
    const next = order[order.indexOf(activeSlug) + delta];
    if (next) openLesson(next);
  }, [activeSlug, module, openLesson]);

  const toggleComplete = useCallback((slug) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (next[slug]) delete next[slug]; else next[slug] = Date.now();
      try { localStorage.setItem(LS_PROGRESS, JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
  }, []);

  const openCode = useCallback((path) => {
    setCodeFocus(path);
    setTab("code");
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, []);

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
      setToc(extractAipToc(text));
      setLoading(false);
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      if (pendingHash.current) {
        const id = pendingHash.current;
        pendingHash.current = null;
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    };
    if (bodyCache.has(lesson.slug)) { setError(null); apply(bodyCache.get(lesson.slug)); return undefined; }
    setLoading(true);
    setError(null);
    fetchMarkdown(`${AIP_CONTENT_BASE}/md/${lesson.slug}.md`)
      .then((text) => { bodyCache.set(lesson.slug, text); apply(text); })
      .catch((err) => { if (alive) { setError(err.message); setLoading(false); } });
    return () => { alive = false; };
  }, [lesson]);

  /* ── code / artifacts / quiz, fetched the first time one of those tabs opens ── */

  useEffect(() => {
    if (!lesson || tab === "lesson" || module?.track !== "guide") return undefined;
    const slug = lesson.slug;
    if (bundleCache.has(slug)) { setBundle(bundleCache.get(slug)); setBundleState("ready"); return undefined; }
    let alive = true;
    setBundleState("loading");
    fetch(`${AIP_CONTENT_BASE}/bundle/${slug}.json`, { headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data) => {
        bundleCache.set(slug, data);
        if (!alive) return;
        setBundle(data);
        setBundleState("ready");
      })
      .catch(() => { if (alive) { setBundle(null); setBundleState("error"); } });
    return () => { alive = false; };
  }, [lesson, tab, module]);

  useEffect(() => { setBundle(null); setBundleState("idle"); setActiveArtifact(0); setCodeFocus(null); }, [activeSlug]);

  /* ── scroll spy ── */

  useEffect(() => {
    if (!toc.length || !bodyRef.current || tab !== "lesson") return undefined;
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
    for (const item of AIP_MODULES) {
      for (const entry of item.lessons) {
        const haystack = `${entry.title} ${entry.blurb || ""} ${entry.blueprint || ""} ${item.title}`.toLowerCase();
        if (haystack.includes(needle)) found.push({ lesson: entry, module: item });
        if (found.length >= 60) break;
      }
    }
    return found;
  }, [query]);

  const components = useMemo(
    () => makeAipComponents({
      dark,
      onLessonLink: openLesson,
      onCodeLink: openCode,
      resolveLesson: (slug) => Boolean(LESSON_BY_SLUG[slug]),
    }),
    [dark, openLesson, openCode]
  );

  const completedInTrack = useMemo(() => {
    let done = 0;
    let total = 0;
    trackModules.forEach((item) => item.lessons.forEach((entry) => {
      total += 1;
      if (progress[entry.slug]) done += 1;
    }));
    return { done, total };
  }, [trackModules, progress]);

  const lastSlug = useMemo(() => {
    try { return localStorage.getItem(LS_LAST); } catch { return null; }
  }, []);

  const order = module ? ORDER[module.track] || [] : [];
  const position = activeSlug ? order.indexOf(activeSlug) : -1;
  const previous = position > 0 ? LESSON_BY_SLUG[order[position - 1]] : null;
  const next = position >= 0 && position < order.length - 1 ? LESSON_BY_SLUG[order[position + 1]] : null;

  const coachLesson = useMemo(() => lesson && ({
    ...lesson,
    type: lesson.relevance ? `${lesson.relevance} exam relevance` : "Exam reference",
    langs: lesson.labs ? "Python" : "--",
    time: lesson.minutes ? `${lesson.minutes} min read` : "",
    prereq: (lesson.prereqs || []).map((item) => item.label).join(", "),
  }), [lesson]);

  /* ── rail ── */

  const renderRail = () => (
    <aside className={`aifs-rail${railOpen ? " aifs-rail--open" : ""}`}>
      <div className="aifs-rail-head">
        <div className="aifs-brand">
          <span className="aifs-brand-mark aip-brand-mark"><BadgeCheck size={15} /></span>
          <div>
            <p className="aifs-brand-title">AWS GenAI Developer Pro</p>
            <p className="aifs-brand-sub">{AIP_EXAM.code} · {AIP_TOTAL_LESSONS} lessons</p>
          </div>
          <button className="aifs-rail-close" type="button" onClick={() => setRailOpen(false)} aria-label="Close navigation">
            <X size={15} />
          </button>
        </div>

        <div className="aifs-tracks">
          {AIP_TRACKS.map((item) => (
            <button key={item.id} type="button" className={`aifs-track${item.id === trackId ? " aifs-track--on" : ""}`} onClick={() => setTrackId(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="aifs-search">
          <Search size={14} />
          <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons and services" aria-label="Search lessons" />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button> : null}
        </div>
      </div>

      <div className="aifs-rail-body">
        {results ? (
          <div className="aifs-results">
            <p className="aifs-results-count">{results.length ? `${results.length} lesson${results.length === 1 ? "" : "s"}` : "No matches"}</p>
            {results.map(({ lesson: entry, module: owner }) => (
              <button key={entry.slug} type="button" className={`aifs-result${entry.slug === activeSlug ? " aifs-result--on" : ""}`} onClick={() => openLesson(entry.slug)}>
                <span className="aifs-result-title">{entry.title}</span>
                <span className="aifs-result-phase">{owner.title}</span>
              </button>
            ))}
          </div>
        ) : (
          trackModules.map((item) => {
            const open = openModules[item.id];
            const done = item.lessons.filter((entry) => progress[entry.slug]).length;
            return (
              <div className="aifs-phase" key={item.id}>
                <button type="button" className={`aifs-phase-head${open ? " aifs-phase-head--open" : ""}`} onClick={() => setOpenModules((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}>
                  {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  {item.track === "guide" ? <span className="aip-modnum">{String(item.n).padStart(2, "0")}</span> : null}
                  <span className="aifs-phase-title">{item.title}</span>
                  <span className="aifs-phase-count">{done ? `${done}/${item.lessons.length}` : item.lessons.length}</span>
                </button>
                {open ? (
                  <div className="aifs-lessons">
                    {item.lessons.map((entry) => (
                      <button key={entry.slug} type="button" className={`aifs-lesson${entry.slug === activeSlug ? " aifs-lesson--on" : ""}`} onClick={() => openLesson(entry.slug)}>
                        <span className="aifs-lesson-tick">{progress[entry.slug] ? <Check size={11} /> : null}</span>
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
        {onOpenPractice ? (
          <button type="button" className="aip-rail-practice" onClick={onOpenPractice}>
            <ClipboardCheck size={14} /> Practice exams · 5 × 75 questions
          </button>
        ) : null}
        <div className="aifs-progress-bar">
          <span style={{ width: `${completedInTrack.total ? (completedInTrack.done / completedInTrack.total) * 100 : 0}%` }} />
        </div>
        <p>{completedInTrack.done} of {completedInTrack.total} complete</p>
      </div>
    </aside>
  );

  /* ── home ── */

  const renderHome = () => {
    const activeTrack = AIP_TRACKS.find((item) => item.id === trackId);
    const resume = lastSlug && LESSON_BY_SLUG[lastSlug] ? LESSON_BY_SLUG[lastSlug] : null;
    return (
      <div className="aifs-home aip-home">
        <header className="aifs-home-head aip-hero">
          <p className="aifs-eyebrow">AWS Certified · Professional · {AIP_EXAM.code}</p>
          <h1>{trackId === "guide" ? "Generative AI Developer – Professional" : activeTrack?.label}</h1>
          <p className="aifs-home-blurb">{activeTrack?.blurb}</p>
          <div className="aip-facts">
            <span><CircleHelp size={13} /> {AIP_EXAM.scored} scored + {AIP_EXAM.unscored} unscored questions</span>
            <span><Gauge size={13} /> {AIP_EXAM.passing} of {AIP_EXAM.scaleMax.toLocaleString()} to pass</span>
            <span><ShieldCheck size={13} /> Pick every correct answer on multiple response</span>
          </div>
          <div className="aip-hero-actions">
            {resume ? (
              <button type="button" className="aifs-resume" onClick={() => openLesson(resume.slug)}>
                <BookOpen size={14} /> Continue — {resume.title} <ArrowRight size={14} />
              </button>
            ) : null}
            {onOpenPractice ? (
              <button type="button" className="aip-cta" onClick={onOpenPractice}>
                <ClipboardCheck size={14} /> Five practice exams <ArrowRight size={14} />
              </button>
            ) : null}
          </div>
        </header>

        {trackId === "guide" ? (
          <section className="aip-weights" aria-label="Exam domains and weights">
            <div className="aip-weights-bar">
              {AIP_EXAM.domains.map((domain) => (
                <span key={domain.n} className={`aip-dom-fill aip-dom-${domain.n}`} style={{ flexGrow: domain.weight }} title={domain.name}>
                  D{domain.n} · {domain.weight}%
                </span>
              ))}
            </div>
            <div className="aip-weights-legend">
              {AIP_EXAM.domains.map((domain) => (
                <span key={domain.n}><i className={`aip-dom-dot aip-dom-${domain.n}`} />D{domain.n} {domain.name}</span>
              ))}
            </div>
          </section>
        ) : null}

        <div className="aifs-phase-grid">
          {trackModules.flatMap((item) => (item.track === "guide" ? [item] : item.lessons.map((entry) => ({ ...item, single: entry })))).map((item) => {
            const lessons = item.single ? [item.single] : item.lessons;
            const done = lessons.filter((entry) => progress[entry.slug]).length;
            const minutes = lessons.reduce((sum, entry) => sum + (entry.minutes || 0), 0);
            const figures = lessons.reduce((sum, entry) => sum + (entry.figures || 0), 0);
            return (
              <button
                key={item.single ? item.single.slug : item.id}
                type="button"
                className="aifs-phase-card aip-module-card"
                onClick={() => {
                  setOpenModules((prev) => ({ ...prev, [item.id]: true }));
                  openLesson(lessons[0].slug);
                }}
              >
                <span className="aifs-phase-card-top">
                  <span className="aifs-phase-num">{item.single ? <BookOpen size={13} /> : String(item.n).padStart(2, "0")}</span>
                  <span className="aifs-phase-card-meta">
                    {item.single ? "" : `${lessons.length} lessons · `}{formatMinutes(minutes)}{figures ? ` · ${figures} figure${figures === 1 ? "" : "s"}` : ""}
                  </span>
                </span>
                <span className="aifs-phase-card-title">{item.single ? item.single.title : item.title}</span>
                <span className="aifs-phase-card-blurb">{item.single ? item.single.blurb : item.blurb}</span>
                {item.domains?.length ? <span className="aip-card-doms"><DomainChips domains={item.domains} compact /></span> : null}
                <span className="aifs-phase-card-bar"><span style={{ width: `${(done / lessons.length) * 100}%` }} /></span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── artifacts ── */

  const renderArtifacts = () => {
    if (bundleState === "loading") return <div className="aifs-state"><Loader2 className="aifs-spin" size={18} /> Loading artifacts…</div>;
    const artifacts = bundle?.artifacts || [];
    if (!artifacts.length) return <div className="aifs-state">This page ships no artifact.</div>;
    const artifact = artifacts[Math.min(activeArtifact, artifacts.length - 1)];
    return (
      <div className="aifs-artifacts">
        <div className="aifs-file-strip" role="tablist">
          {artifacts.map((item, index) => (
            <button key={item.name} type="button" role="tab" aria-selected={index === activeArtifact} className={`aifs-file${index === activeArtifact ? " aifs-file--on" : ""}`} onClick={() => setActiveArtifact(index)}>
              {item.kind === "skill" ? <Sparkles size={10} /> : <ClipboardCheck size={10} />} {item.name}
            </button>
          ))}
        </div>
        <p className="aip-artifact-note">
          {artifact.kind === "skill"
            ? "A reusable AI skill: paste it into an assistant (or save it as a skill file) to apply this lesson's decision rules to your own scenarios."
            : "A one-page revision sheet compiled from this lesson's exam notes, key facts, misconceptions and cards."}
        </p>
        <div className="aifs-artifact-head">
          <span>{artifact.name}.md</span>
          <button type="button" onClick={() => navigator.clipboard?.writeText(artifact.markdown)}>
            <Copy size={12} /> Copy markdown
          </button>
        </div>
        <div className="aifs-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} urlTransform={aipUrlTransform}>
            {artifact.markdown.replace(/^---\n[\s\S]*?\n---\n/, (front) => `\`\`\`yaml\n${front.replace(/^---\n|\n---\n$/g, "")}\n\`\`\`\n`)}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  const isGuide = module?.track === "guide";
  const tabs = lesson && isGuide ? [
    { id: "lesson", label: "Lesson", icon: BookOpen, count: 0 },
    { id: "code", label: "Code", icon: Code2, count: lesson.code },
    { id: "artifacts", label: "Artifacts", icon: Package, count: lesson.artifacts },
    { id: "quiz", label: "Quiz", icon: CircleHelp, count: lesson.quiz },
  ].filter((item) => item.id === "lesson" || item.count > 0) : [];

  return (
    <div className="aifs-root aip-root" data-theme={dark ? "dark" : "light"}>
      {renderRail()}
      {railOpen ? <div className="aifs-scrim" onClick={() => setRailOpen(false)} /> : null}

      <div className="aifs-main">
        <header className="aifs-topbar">
          <button className="aifs-icon-btn aifs-rail-toggle" type="button" onClick={() => setRailOpen(true)} aria-label="Open navigation">
            <PanelLeft size={16} />
          </button>
          <div className="aifs-crumbs">
            <button type="button" onClick={() => setActiveSlug(null)}><span className="aip-wide-only">AWS GenAI · </span>{AIP_EXAM.code}</button>
            {module ? (<><ChevronRight size={12} /><span>{module.track === "guide" ? `${String(module.n).padStart(2, "0")} · ` : ""}{module.title}</span></>) : null}
          </div>
          <div className="aifs-topbar-actions">
            {lesson ? (
              <button type="button" className={`aifs-complete aifs-tutor-btn${tutorOpen ? " aifs-complete--on" : ""}`} aria-pressed={tutorOpen} onClick={() => setTutorOpen((value) => !value)}>
                <Sparkles size={14} /> <span className="aip-wide-only">AI tutor</span>
              </button>
            ) : null}
            {lesson ? (
              <button type="button" className={`aifs-complete${progress[lesson.slug] ? " aifs-complete--on" : ""}`} onClick={() => toggleComplete(lesson.slug)}>
                {progress[lesson.slug] ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                <span className="aip-wide-only">{progress[lesson.slug] ? "Completed" : "Mark complete"}</span>
              </button>
            ) : null}
            {onClose ? (
              <button className="aifs-icon-btn" type="button" onClick={onClose} aria-label="Close"><X size={16} /></button>
            ) : null}
          </div>
        </header>

        {!lesson ? (
          <div className="aifs-scroll" ref={bodyRef}>{renderHome()}</div>
        ) : (
          <>
            <div className="aifs-lesson-head aip-lesson-head">
              <h1>{lesson.title}</h1>
              {lesson.blurb ? <p className="aifs-lesson-blurb">{lesson.blurb}</p> : null}
              <div className="aifs-chips">
                <DomainChips domains={lesson.domains} />
                {lesson.relevance ? <span className={`aifs-chip aip-rel aip-rel--${/high/i.test(lesson.relevance) ? "high" : /low/i.test(lesson.relevance) ? "low" : "mid"}`}>{lesson.relevance} relevance</span> : null}
                {lesson.level ? <span className="aifs-chip">{lesson.level}</span> : null}
                {lesson.minutes ? <span className="aifs-chip"><Clock size={11} />{lesson.minutes} min read</span> : null}
                {lesson.syllabus ? <span className="aifs-chip aifs-chip--muted">Course lessons {lesson.syllabus}</span> : null}
                {lesson.verified ? <span className="aifs-chip aifs-chip--muted"><CheckCircle2 size={11} />Verified {lesson.verified}</span> : null}
              </div>
              {lesson.prereqs?.length ? (
                <div className="aip-prereqs">
                  <span>Before this</span>
                  {lesson.prereqs.map((item) => (
                    <button key={item.slug} type="button" onClick={() => openLesson(item.slug)}>
                      {progress[item.slug] ? <Check size={11} /> : null}{item.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {tabs.length ? (
                <div className="aifs-tabs" role="tablist">
                  {tabs.map((item) => (
                    <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={`aifs-tab${tab === item.id ? " aifs-tab--on" : ""}`} onClick={() => setTab(item.id)}>
                      <item.icon size={13} />
                      {item.label}
                      {item.count ? <span className="aifs-tab-count">{item.count}</span> : null}
                    </button>
                  ))}
                </div>
              ) : <div className="aip-tabs-spacer" />}
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} urlTransform={aipUrlTransform}>
                          {content}
                        </ReactMarkdown>
                      </div>
                    )
                  ) : null}

                  {tab !== "lesson" && bundleState === "error" ? (
                    <div className="aifs-state aifs-state--error"><AlertCircle size={18} /> Could not load this lesson's files. Please retry.</div>
                  ) : null}
                  {tab === "code" ? (
                    bundleState === "loading" || bundleState === "idle"
                      ? <div className="aifs-state"><Loader2 className="aifs-spin" size={18} /> Loading lab code…</div>
                      : <AwsLabCode files={bundle?.code || []} dark={dark} focusPath={codeFocus} />
                  ) : null}
                  {tab === "artifacts" ? renderArtifacts() : null}
                  {tab === "quiz" ? (
                    bundleState === "loading" || bundleState === "idle"
                      ? <div className="aifs-state"><Loader2 className="aifs-spin" size={18} /> Loading quiz…</div>
                      : <AwsLessonQuiz key={lesson.slug} practice={bundle?.quiz || []} recall={bundle?.recall || []} cards={bundle?.cards || []} components={components} />
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
                    ) : onOpenPractice && isGuide ? (
                      <button type="button" className="aifs-pager-next" onClick={onOpenPractice}>
                        <span><small>Finished the guide?</small>Take a practice exam</span>
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
                      key={`${item.id}-${item.label}`}
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

      <AskAiChip selection={selection} onAsk={askAbout} />
      <LessonCoach
        lesson={coachLesson}
        phase={module}
        markdown={content}
        onOpenLesson={openLesson}
        open={tutorOpen && Boolean(lesson)}
        onClose={() => setTutorOpen(false)}
        request={tutorRequest}
        isDark={dark}
        lessons={COACH_LESSONS}
        noteType="aip"
        course={AIP_COURSE}
        codeFolder="AWS GenAI"
        intro={COACH_INTRO}
        bundleBase={AIP_CONTENT_BASE}
      />
    </div>
  );
}
