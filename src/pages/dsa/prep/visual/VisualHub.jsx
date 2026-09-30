import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookOpenCheck, Check, ChevronDown, ChevronsDownUp, ChevronsUpDown, Circle, CircleCheckBig, Clapperboard, Flame, Info, Link2, Play, Repeat, Sparkles,
} from "lucide-react";
import { CV_TRACKS } from "../../../../data/chaiVisualCourseData";
import { readStreak, toggleWatched } from "../../../../components/visual/visualProgress";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { useLearnerState } from "../learner";
import { dayKey } from "../lib/dates";
import { Badge, EmptyState, Panel, PrepPage, Progress, SearchInput, Stat } from "../ui";
import VisualLesson from "./VisualLesson";
import { SECTION_TRACKS, sectionForPath, useWatched, visualIndex } from "./visualStore";
import "../../../../styles/DsaVisual.css";

/** A linked practice problem as a compact, clickable chip. */
export function ProblemChip({ problem, solved, onOpen }) {
  return (
    <button type="button" className={`dsv-problem-chip${solved ? " is-solved" : ""}`} onClick={() => onOpen(problem.id)} title={`${solved ? "Solved · " : ""}Open ${problem.title} in the workspace`}>
      {solved ? <Check size={11} /> : <BookOpenCheck size={11} />}
      <span>{problem.title}</span>
    </button>
  );
}

function LessonRow({ lesson, n, watched, completed, onOpen, openProblem }) {
  const problems = visualIndex.problemsForLesson(lesson.path);
  const isIntro = visualIndex.isIntro(lesson.path);
  return (
    <li className={`dsp-item dsv-row${watched ? " is-passed" : ""}`}>
      <button type="button" className={`dsp-status dsv-status${watched ? " is-passed" : ""}`} onClick={() => toggleWatched(lesson.path)} aria-pressed={watched} aria-label={`Mark ${lesson.title} as ${watched ? "not watched" : "watched"}`} title={watched ? "Watched — click to unmark" : "Mark watched"}>
        {watched ? <CircleCheckBig size={17} /> : <Circle size={17} />}
      </button>
      <div className="dsp-item-main">
        <button type="button" className="dsp-item-title" onClick={() => onOpen(lesson.path)}>{n}. {lesson.title}</button>
        <div className="dsp-item-meta">
          {lesson.subtitle && <span className="dsp-muted">{lesson.subtitle}</span>}
        </div>
      </div>
      {problems.length > 0 && (
        <div className="dsv-row-problems">
          {problems.slice(0, 2).map((problem) => <ProblemChip key={problem.id} problem={problem} solved={completed.has(problem.id)} onOpen={openProblem} />)}
        </div>
      )}
      {isIntro && <Badge tone="info">Start here</Badge>}
      <button type="button" className="dsp-icon-btn dsv-play" onClick={() => onOpen(lesson.path)} aria-label={`Watch ${lesson.title}`}><Play size={14} fill="currentColor" /></button>
    </li>
  );
}

/** The three-step loop the section is built around, with the learner's own numbers. */
function LoopBand({ watchedCount, solvedAfter, due, onContinue, continueLabel }) {
  const steps = [
    { icon: Clapperboard, title: "Watch", body: "See the pattern move — brute force first, then the optimisation.", value: watchedCount, unit: "watched" },
    { icon: BookOpenCheck, title: "Solve", body: "Every linked lesson opens its problem in the workspace.", value: solvedAfter, unit: "solved after watching" },
    { icon: Repeat, title: "Recall", body: "Solved problems join the review queue; rewatch before a retry.", value: due, unit: "due for review" },
  ];
  return (
    <section className="dsv-band" aria-label="How Visual Learning works">
      <div className="dsv-band-copy">
        <span className="dsv-band-eyebrow"><Sparkles size={12} /> Watch → Solve → Recall</span>
        <h2>See the idea move, then make it yours.</h2>
        <p>Lessons are animated walkthroughs. Where a lesson teaches a problem in the practice set, it links straight to it — watch, solve it in the workspace, and let review bring it back.</p>
        {onContinue && <button type="button" className="dsp-btn dsv-btn-primary" onClick={onContinue}><Play size={14} fill="currentColor" /> {continueLabel}</button>}
      </div>
      <ol className="dsv-steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="dsv-step">
              <span className="dsv-step-index">{index + 1}</span>
              <span className="dsv-step-icon"><Icon size={16} /></span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
              <b className="dsv-step-value">{step.value}<small>{step.unit}</small></b>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* The track each section shows, with the copy that heads its page. */
const TRACK_PAGES = {
  dsa: {
    title: "DSA Visual",
    unit: "patterns",
    description: "Animated walkthroughs from two pointers to dynamic programming — brute force first, then the optimisation. Lessons that teach a practice problem link straight to it.",
  },
  lld: {
    title: "Low-Level Design",
    unit: "modules",
    description: "Object-oriented design with animated UML — class and sequence diagrams that build themselves, SOLID, the design patterns and machine-coding case studies.",
  },
  os: {
    title: "Operating Systems",
    unit: "sections",
    description: "Processes, scheduling, concurrency, virtual memory and file systems, from a system call down to the kernel — illustrated chapter by chapter.",
  },
  networking: {
    title: "Computer Networks",
    unit: "parts",
    description: "From a single fetch() down to bits on the wire and back up through TCP, DNS, HTTP and TLS — every step illustrated.",
  },
};

/** The band that heads a non-DSA track: what it covers and where you are in it. */
function TrackBand({ track, watchedCount, total, next, onContinue }) {
  const pct = total ? watchedCount / total : 0;
  return (
    <section className="dsv-band" aria-label={`About ${track.name}`}>
      <div className="dsv-band-copy">
        <span className="dsv-band-eyebrow"><Clapperboard size={12} /> {track.summary}</span>
        <h2>{track.subtitle}</h2>
        <p>{track.tagline}</p>
        <div className="dsp-chips dsv-band-chips">{track.chips.map((chip) => <span key={chip} className="dsp-chip">{chip}</span>)}</div>
      </div>
      <div className="dsv-where">
        <div className="dsv-where-ring" style={{ "--pct": `${Math.round(pct * 100)}%` }}>
          <b>{Math.round(pct * 100)}%</b>
          <small>{watchedCount}/{total} watched</small>
        </div>
        <div className="dsv-where-next">
          <small>{next ? (watchedCount ? "Up next" : "Start with") : "Track complete"}</small>
          <strong>{next ? next.title : "Every lesson watched"}</strong>
          {next && <span>{next.group.title}</span>}
          {next && <button type="button" className="dsp-btn dsv-btn-primary is-small" onClick={() => onContinue(next.path)}><Play size={13} fill="currentColor" /> {watchedCount ? "Continue" : "Start"}</button>}
        </div>
      </div>
    </section>
  );
}

export default function VisualHub({ section, params, navigate, openProblem }) {
  const trackId = SECTION_TRACKS[section] || "dsa";
  const track = CV_TRACKS.find((entry) => entry.id === trackId) || CV_TRACKS[0];
  const page = TRACK_PAGES[track.id] || TRACK_PAGES.dsa;
  const watched = useWatched();
  const learner = useLearnerState();
  const [ledger] = useStore(KEYS.ledger, []);
  const [reviewCards] = useStore(KEYS.review, {});
  const [last] = useStore(KEYS.visualLast, null);
  // `path` from the hub's own links; `slug` from a note linked to a lesson.
  const requested = params?.path || params?.slug || "";
  const requestedLesson = requested ? visualIndex.lesson(requested) : null;
  const initialPath = requestedLesson?.track.id === track.id ? requested : "";
  const [openPath, setOpenPath] = useState(initialPath);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [linkedOnly, setLinkedOnly] = useState(false);
  const next = visualIndex.nextUnwatched(track, watched);
  const [openGroups, setOpenGroups] = useState(() => new Set(next ? [next.group.title] : []));

  // A lesson from another track (a link inside a lesson, a note, ⌘K) opens in
  // that track's own section.
  const openLesson = useCallback((path) => {
    const lesson = visualIndex.lesson(path);
    if (!lesson) return;
    if (lesson.track.id !== track.id) { navigate(sectionForPath(path), { path }); return; }
    setOpenPath(path);
  }, [navigate, track.id]);

  // The hub keeps this section mounted while it stays selected, so a new
  // lesson asked for from ⌘K, Today or a note arrives as a params change.
  useEffect(() => {
    if (!requestedLesson) return;
    if (requestedLesson.track.id !== track.id) navigate(sectionForPath(requested), { path: requested });
    else setOpenPath(requested);
  }, [navigate, requested, requestedLesson, track.id]);

  const trackLessons = useMemo(() => track.groups.flatMap((group) => group.items), [track]);
  const trackWatched = trackLessons.filter((item) => watched.has(item.path)).length;
  const linkedProblems = useMemo(() => {
    const seen = new Map();
    trackLessons.forEach((item) => visualIndex.problemsForLesson(item.path).forEach((problem) => seen.set(problem.id, problem)));
    return [...seen.values()];
  }, [trackLessons]);
  const linkedSolved = linkedProblems.filter((problem) => learner.completed.has(problem.id)).length;
  const solvedAfter = (ledger || []).filter((entry) => entry.ruleId === "visual_solve").length;
  const today = dayKey();
  const dueLinked = Object.entries(reviewCards || {}).filter(([slug, card]) => card?.dueDay <= today && visualIndex.hasVisual(slug)).length;
  const streak = readStreak();
  const isDsa = track.id === "dsa";

  const filtering = Boolean(query.trim()) || status !== "all" || linkedOnly;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return track.groups.map((group) => ({
      group,
      lessons: group.items
        .map((item, index) => ({ item, n: index + 1 }))
        .filter(({ item }) => {
          if (visualIndex.isLocked(item.path)) return false;
          if (status === "todo" && watched.has(item.path)) return false;
          if (status === "done" && !watched.has(item.path)) return false;
          if (linkedOnly && !visualIndex.problemsForLesson(item.path).length) return false;
          if (q && !`${item.title} ${item.subtitle || ""} ${group.title}`.toLowerCase().includes(q)) return false;
          return true;
        }),
    })).filter((entry) => entry.lessons.length);
  }, [linkedOnly, query, status, track, watched]);

  if (openPath) {
    return <VisualLesson key={openPath} path={openPath} backLabel={page.title} onBack={() => setOpenPath("")} onOpen={openLesson} navigate={navigate} openProblem={openProblem} />;
  }

  const toggleGroup = (title) => setOpenGroups((prev) => {
    const copy = new Set(prev);
    if (copy.has(title)) copy.delete(title); else copy.add(title);
    return copy;
  });

  const lastLesson = last?.path ? visualIndex.lesson(last.path) : null;
  const resume = lastLesson?.track.id === track.id && !watched.has(lastLesson.path) ? lastLesson : null;
  const continueTarget = resume || next;
  const trackStarted = trackWatched > 0;

  return (
    <PrepPage
      className="dsv-page"
      eyebrow="Learn · Visual Learning"
      title={page.title}
      description={`${page.description} Progress is shared with Visual Learning in the main sidebar.`}
      actions={continueTarget && <button type="button" className="dsp-btn dsv-btn-primary" onClick={() => openLesson(continueTarget.path)}>{trackStarted ? "Continue" : "Start"}: {continueTarget.title} <ArrowRight size={15} /></button>}
    >
      {isDsa ? (
        <LoopBand
          watchedCount={trackWatched}
          solvedAfter={solvedAfter}
          due={dueLinked}
          onContinue={dueLinked ? () => navigate("review") : null}
          continueLabel={`Review ${dueLinked} due`}
        />
      ) : (
        <TrackBand track={track} watchedCount={trackWatched} total={trackLessons.length} next={continueTarget} onContinue={openLesson} />
      )}

      <div className={`dsp-grid ${isDsa ? "cols-4" : "cols-3"}`}>
        <div className="dsp-stat"><Progress value={trackWatched} max={trackLessons.length} label="Lessons watched" tone="info" /><small>{next ? `Next: ${next.title}` : "Track complete"}</small></div>
        {isDsa
          ? <Stat icon={Link2} label="Linked problems solved" value={`${linkedSolved}/${linkedProblems.length}`} hint="Problems a lesson here teaches" tone="success" />
          : <Stat icon={Clapperboard} label={page.unit.replace(/^./, (c) => c.toUpperCase())} value={track.groups.length} hint={`${trackLessons.length} lessons in all`} tone="info" />}
        <Stat icon={Flame} label="Watch streak" value={`${streak} day${streak === 1 ? "" : "s"}`} hint="Days in a row you opened any visual lesson" tone="warning" />
        {isDsa && <Stat icon={Sparkles} label="Watch-then-solve bonus" value={solvedAfter} hint="Problems solved after their lesson" tone="accent" />}
      </div>

      <div className="dsp-toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder={`Search ${page.title} lessons`} />
        <div className="dsp-chips" aria-label="Status">{[["all", "All"], ["todo", "To watch"], ["done", "Watched"]].map(([value, label]) => <button type="button" key={value} className={`dsp-chip${status === value ? " is-active" : ""}`} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}</div>
        {isDsa && <button type="button" className={`dsp-chip${linkedOnly ? " is-active" : ""}`} aria-pressed={linkedOnly} onClick={() => setLinkedOnly((value) => !value)}><Link2 size={12} /> Has a problem</button>}
        <div className="dsp-row dsp-toolbar-end">
          <button type="button" className="dsp-btn is-quiet is-small" onClick={() => setOpenGroups(new Set(track.groups.map((group) => group.title)))}><ChevronsUpDown size={14} /> Expand all</button>
          <button type="button" className="dsp-btn is-quiet is-small" onClick={() => setOpenGroups(new Set())}><ChevronsDownUp size={14} /> Collapse</button>
        </div>
      </div>

      {!visible.length && <Panel><EmptyState icon={Clapperboard} title="No lessons match" body="Clear the search or pick another filter." /></Panel>}

      <div className="dsp-modules">
        {visible.map(({ group, lessons }) => {
          const groupIndex = track.groups.indexOf(group);
          const done = group.items.filter((item) => watched.has(item.path)).length;
          const open = filtering || openGroups.has(group.title);
          const topics = isDsa ? visualIndex.topicsForGroup(group.title) : [];
          return (
            <section key={group.title} className={`dsp-module dsv-module${open ? " is-open" : ""}${done === group.items.length ? " is-complete" : ""}`}>
              <button type="button" className="dsp-module-head" aria-expanded={open} onClick={() => toggleGroup(group.title)}>
                <span className="dsp-module-index dsv-module-index">{String(groupIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.items.length} lesson{group.items.length === 1 ? "" : "s"}{topics.length ? ` · practises ${topics.join(", ")}` : ""}</p>
                </div>
                <div className="dsp-module-progress">
                  <b>{done}/{group.items.length}</b>
                  <span className="dsp-progress-track"><span style={{ width: `${(done / group.items.length) * 100}%` }} /></span>
                </div>
                <ChevronDown size={17} />
              </button>
              {open && (
                <ul className="dsp-items">
                  {lessons.map(({ item, n }) => (
                    <LessonRow key={item.path} lesson={visualIndex.lessonByPath.get(item.path)} n={n} watched={watched.has(item.path)} completed={learner.completed} onOpen={openLesson} openProblem={openProblem} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className="dsp-notice"><Info size={16} /><span>{isDsa
        ? "A lesson counts as watched once it has loaded. Watching alone earns nothing — solving a linked problem after watching its lesson pays a +5 bonus on top of the usual coins."
        : "A lesson counts as watched once it has loaded. Select any text in a lesson to ask the AI tutor about it, or open the tutor to be quizzed on the chapter."}</span></div>
    </PrepPage>
  );
}
