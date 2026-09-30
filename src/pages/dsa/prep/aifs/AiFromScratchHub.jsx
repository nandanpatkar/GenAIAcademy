import React, { useCallback, useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, ChevronDown, ChevronsDownUp, ChevronsUpDown, Circle, CircleCheckBig, Clock3, Code2, HelpCircle, Info, Package, Sparkles,
} from "lucide-react";
import { AIFS_PHASES, AIFS_TRACKS } from "../../../../data/aiFromScratchData";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { buildIndex, filterLessons, nextLesson, trackStats, typeFamily } from "../lib/aifs";
import { formatDuration } from "../lib/dates";
import { Badge, EmptyState, Panel, PrepPage, Progress, SearchInput, Stat, Tabs } from "../ui";
import AifsLesson from "./AifsLesson";
import { toggleLessonComplete, useAifsProgress } from "./aifsStore";
import "../../../../styles/AiFromScratch.css";

const index = buildIndex(AIFS_PHASES);
const FAMILIES = ["all", "Learn", "Build", "Capstone", "Reference"];

function LessonRow({ lesson, done, quiz, onOpen }) {
  return (
    <li className={`dsp-item${done ? " is-passed" : ""}`}>
      <button type="button" className={`dsp-status${done ? " is-passed" : ""}`} onClick={() => toggleLessonComplete(lesson.slug)} aria-pressed={done} aria-label={`Mark ${lesson.title} as ${done ? "not complete" : "complete"}`} title={done ? "Completed — click to unmark" : "Mark complete"}>
        {done ? <CircleCheckBig size={17} /> : <Circle size={17} />}
      </button>
      <div className="dsp-item-main">
        <button type="button" className="dsp-item-title" onClick={() => onOpen(lesson.slug)}>{lesson.n}. {lesson.title}</button>
        <div className="dsp-item-meta">
          {lesson.minutes > 0 && <span className="dsp-muted"><Clock3 size={11} /> {formatDuration(lesson.minutes)}</span>}
          {lesson.code > 0 && <span className="dsp-muted" title={`${lesson.code} code files`}><Code2 size={11} /> {lesson.code}</span>}
          {lesson.artifacts > 0 && <span className="dsp-muted" title={`${lesson.artifacts} artifacts`}><Package size={11} /> {lesson.artifacts}</span>}
          {lesson.quiz > 0 && <span className="dsp-muted" title={`${lesson.quiz} quiz questions`}><HelpCircle size={11} /> {lesson.quiz}</span>}
          {quiz?.passedAt && <Badge tone="success">Quiz passed</Badge>}
          {quiz && !quiz.passedAt && <Badge tone="warning">Quiz {quiz.best}/{quiz.total}</Badge>}
        </div>
      </div>
      <Badge tone={typeFamily(lesson.type) === "Build" ? "info" : typeFamily(lesson.type) === "Capstone" ? "accent" : "neutral"}>{typeFamily(lesson.type)}</Badge>
      <button type="button" className="dsp-icon-btn" onClick={() => onOpen(lesson.slug)} aria-label={`Open ${lesson.title}`}><ArrowRight size={15} /></button>
    </li>
  );
}

export default function AiFromScratchHub({ params, navigate }) {
  const progress = useAifsProgress();
  const [quizResults] = useStore(KEYS.aifsQuiz, {});
  const initialTrack = params?.slug ? index.phaseBySlug.get(params.slug)?.track : params?.track;
  const [track, setTrack] = useState(initialTrack || "curriculum");
  const [openSlug, setOpenSlug] = useState(params?.slug && index.lessonBySlug.has(params.slug) ? params.slug : "");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [family, setFamily] = useState("all");
  const phases = index.byTrack[track] || [];
  const next = nextLesson(phases, progress);
  const [openPhases, setOpenPhases] = useState(() => new Set(next ? [next.phase.id] : []));
  const stats = trackStats(phases, progress, quizResults);
  const filtering = Boolean(query.trim()) || status !== "all" || family !== "all";

  const openLesson = useCallback((slug) => {
    if (!index.lessonBySlug.has(slug)) return;
    setTrack(index.phaseBySlug.get(slug).track);
    setOpenSlug(slug);
  }, []);

  const visible = useMemo(() => phases
    .map((phase) => ({ phase, lessons: filterLessons(phase, { query, status, family, progress }) }))
    .filter((entry) => entry.lessons.length), [family, phases, progress, query, status]);

  if (openSlug) return <AifsLesson key={openSlug} index={index} slug={openSlug} onBack={() => setOpenSlug("")} onOpen={openLesson} navigate={navigate} />;

  const togglePhase = (id) => setOpenPhases((prev) => {
    const copy = new Set(prev);
    if (copy.has(id)) copy.delete(id); else copy.add(id);
    return copy;
  });

  return (
    <PrepPage
      eyebrow="Learn"
      title="AI from Scratch"
      description="The full curriculum — from setup and maths to transformers, agents and production — with each lesson's code, artifacts and quiz. Completion is shared with AI from Scratch in the main sidebar; quizzes here are graded and earn coins."
      actions={next && <button type="button" className="dsp-btn is-primary" onClick={() => openLesson(next.lesson.slug)}>{stats.done ? "Continue" : "Start"}: {next.lesson.title} <ArrowRight size={15} /></button>}
    >
      <Tabs value={track} onChange={(id) => { setTrack(id); setOpenPhases(new Set()); }} options={AIFS_TRACKS.map((entry) => ({ id: entry.id, label: entry.label, count: `${trackStats(index.byTrack[entry.id] || [], progress).done}/${(index.byTrack[entry.id] || []).reduce((sum, phase) => sum + phase.lessons.length, 0)}` }))} label="Tracks" />
      <p className="dsp-muted dsp-small">{AIFS_TRACKS.find((entry) => entry.id === track)?.blurb}</p>

      <div className="dsp-grid cols-4">
        <div className="dsp-stat"><Progress value={stats.done} max={stats.total} label="Lessons complete" tone="success" /><small>{next ? `Next: ${next.lesson.title}` : "Track complete"}</small></div>
        <Stat icon={Clock3} label="Time left" value={formatDuration(stats.minutesLeft)} hint="Estimated, for lessons not yet complete" />
        <Stat icon={HelpCircle} label="Quizzes passed" value={`${stats.quizzesPassed}/${stats.quizzesTotal}`} hint="70%+ of graded questions" tone="accent" />
        <Stat icon={BookOpen} label="Phases" value={phases.length} hint={track === "curriculum" ? "Setup → capstone" : "One collection"} />
      </div>

      <div className="dsp-toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Search lessons" />
        <div className="dsp-chips" aria-label="Lesson kind">{FAMILIES.map((value) => <button type="button" key={value} className={`dsp-chip${family === value ? " is-active" : ""}`} aria-pressed={family === value} onClick={() => setFamily(value)}>{value === "all" ? "Any kind" : value}</button>)}</div>
        <div className="dsp-chips" aria-label="Status">{[["all", "All"], ["todo", "To do"], ["done", "Done"]].map(([value, label]) => <button type="button" key={value} className={`dsp-chip${status === value ? " is-active" : ""}`} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}</div>
        <div className="dsp-row dsp-toolbar-end">
          <button type="button" className="dsp-btn is-quiet is-small" onClick={() => setOpenPhases(new Set(phases.map((phase) => phase.id)))}><ChevronsUpDown size={14} /> Expand all</button>
          <button type="button" className="dsp-btn is-quiet is-small" onClick={() => setOpenPhases(new Set())}><ChevronsDownUp size={14} /> Collapse</button>
        </div>
      </div>

      {!visible.length && <Panel><EmptyState icon={Sparkles} title="No lessons match" body="Clear the search or pick another filter." /></Panel>}

      <div className="dsp-modules">
        {visible.map(({ phase, lessons }) => {
          const phaseDone = phase.lessons.filter((lesson) => progress[lesson.slug]).length;
          const open = filtering || openPhases.has(phase.id);
          return (
            <section key={phase.id} className={`dsp-module${open ? " is-open" : ""}`}>
              <button type="button" className="dsp-module-head" aria-expanded={open} onClick={() => togglePhase(phase.id)}>
                <span className="dsp-module-index">{track === "curriculum" ? String(phase.n).padStart(2, "0") : <BookOpen size={15} />}</span>
                <div>
                  <h2>{phase.title}</h2>
                  <p>{phase.blurb}{phase.hours ? ` · ~${phase.hours}h` : ""}</p>
                </div>
                <div className="dsp-module-progress">
                  <b>{phaseDone}/{phase.lessons.length}</b>
                  <span className="dsp-progress-track"><span style={{ width: `${(phaseDone / phase.lessons.length) * 100}%` }} /></span>
                </div>
                <ChevronDown size={17} />
              </button>
              {open && (
                <ul className="dsp-items dsp-aifs-items">
                  {lessons.map((lesson) => <LessonRow key={lesson.slug} lesson={lesson} done={Boolean(progress[lesson.slug])} quiz={quizResults[lesson.slug]} onOpen={openLesson} />)}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className="dsp-notice"><Info size={16} /><span>Ticking a lesson only records that you read it. Passing its quiz marks it complete too, and is the only way these lessons earn coins or count toward your streak.</span></div>
    </PrepPage>
  );
}
