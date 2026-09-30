import React, { Suspense, lazy, useMemo } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  Building2,
  CalendarClock,
  CircleCheck,
  CircleX,
  Clapperboard,
  Database,
  Flame,
  History,
  Layers,
  ListChecks,
  MessagesSquare,
  NotebookPen,
  Play,
  Repeat,
  Zap,
} from "lucide-react";
import visualLinks from "../../../data/practice/visualLinks.json";
import { useHabitSummary } from "../prep/habit";
import { useLegacyValue, useStore } from "../prep/hooks";
import { KEYS } from "../prep/keys";
import { useLearnerState } from "../prep/learner";
import Heatmap, { activityCounts } from "../prep/Heatmap";
import { relativeTime } from "../prep/lib/dates";
import { LEGACY_KEYS } from "../prep/lib/store";
import { sectionForPath } from "../prep/visual/sections";
import { practiceById, practiceProblems, sheetItems, sheets } from "../practice/practiceData";
import { LevelProgress, levelClass } from "../practice/ProblemTable";
import "../../../styles/DsaPractice.css";
import "../../../styles/DsaVisual.css";

// The Learn row carries the Visual Learning course tree, so it loads after
// the rest of Home has painted.
const HomeLearn = lazy(() => import("./HomeLearn"));

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 5 ? "Working late" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
};

// Practice and tools. The Learn sections have their own row above.
const EXPLORE = [
  { id: "problems", icon: ListChecks, title: "DSA Problems", body: "The full practice set, by topic and pattern." },
  { id: "sheet", icon: Layers, title: "Zero to Hero 450", body: "Every Code Lab problem, module by module." },
  { id: "sql", icon: Database, title: "SQL problems", body: "Judged query problems on a real database." },
  { id: "aptitude", icon: Brain, title: "Aptitude", body: "Quant, logical and verbal practice sets." },
  { id: "companies", icon: Building2, title: "Companies", body: "Questions by company and interview loop." },
  { id: "planner", icon: CalendarClock, title: "Study plan", body: "A day-by-day plan that adapts to missed days." },
  { id: "notes", icon: NotebookPen, title: "Notes", body: "Your notes and AI drafts, linked to problems." },
  { id: "community", icon: MessagesSquare, title: "Community", body: "Interview experiences and discussions." },
];

const VERDICT = { accepted: "Accepted", wrong_answer: "Wrong answer", runtime_error: "Runtime error", syntax_error: "Syntax error", timeout: "Time limit" };

/**
 * The DSA hub's home: what to do next (continue, today's problem, reviews),
 * how it's going (level progress, activity), and where everything lives.
 */
export default function DsaHome({ navigate, openProblem, displayName }) {
  const learner = useLearnerState();
  const habit = useHabitSummary();
  const [last] = useStore(KEYS.lastProblem, null);
  // The hub falls back to "Your profile" when there's no name to show.
  const firstName = displayName && displayName !== "Your profile" ? String(displayName).split(/[\s@._]/)[0] : "there";

  const potd = practiceById.get(habit.potdSlug) || practiceProblems.find((problem) => problem.codelab === habit.potdSlug);
  const lastProblem = last?.id ? practiceById.get(last.id) : null;
  const sheetProgress = useMemo(() => sheets.filter((sheet) => sheet.available).map((sheet) => {
    const items = sheetItems(sheet).filter((item) => item.id && practiceById.has(item.id));
    const done = items.filter((item) => learner.completed.has(item.id)).length;
    const next = items.find((item) => !learner.completed.has(item.id));
    return { sheet, done, total: items.length, next };
  }), [learner.completed]);
  const started = sheetProgress.filter((entry) => entry.done > 0).sort((a, b) => b.done / b.total - a.done / a.total);
  const continueSheet = started[0] || sheetProgress.find((entry) => entry.sheet.id === "strivers-a2z-dsa-sheet");
  const resume = lastProblem && !learner.completed.has(lastProblem.id) ? lastProblem : continueSheet?.next ? practiceById.get(continueSheet.next.id) : null;
  const counts = useMemo(() => activityCounts(habit.submissions, habit.ledger), [habit.ledger, habit.submissions]);
  const recent = habit.submissions.slice(0, 5);

  // Learning progress, from the saved keys alone (see HomeLearn for the cards).
  const watchedList = useLegacyValue(LEGACY_KEYS.visualRead, []);
  const watched = useMemo(() => new Set(Array.isArray(watchedList) ? watchedList : []), [watchedList]);
  const [visualLast] = useStore(KEYS.visualLast, null);
  const [aifsLast] = useStore(KEYS.aifsLast, null);
  const aifsProgress = useLegacyValue(LEGACY_KEYS.aifsProgress, {});
  const sqlSolved = useLegacyValue(LEGACY_KEYS.sqlLabSolved, {});
  // Watch → solve: the next problem's lesson, when it has one not yet watched.
  const resumeLesson = resume ? visualLinks.byProblem[resume.id] : null;
  const watchFirst = resumeLesson && !watched.has(resumeLesson);
  const dueWithVisual = habit.due.filter((card) => visualLinks.byProblem[card.slug]).length;

  return (
    <div className="dsa-practice dpx-home">
      <header className="dpx-home-head">
        <div>
          <span className="dpx-home-date">{new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</span>
          <h1>{greeting()}, {firstName}</h1>
          <p>{learner.completed.size ? `${learner.completed.size} problems solved so far. Keep the streak going.` : "Pick a sheet or today's problem to get started."}</p>
        </div>
        <div className="dpx-home-stats">
          <span className="dpx-home-stat is-streak" title={`Longest streak: ${habit.streak.longest} days`}><Flame size={15} /> <b>{habit.streak.current}</b> day streak</span>
          <span className="dpx-home-stat is-coins" title="Coins this week"><Zap size={15} /> <b>{habit.points.total}</b> coins</span>
          <button type="button" className="dpx-home-stat is-visual" title="Visual Learning lessons watched" onClick={() => navigate("visual")}><Clapperboard size={15} /> <b>{watched.size}</b> lessons watched</button>
        </div>
      </header>

      <div className="dpx-home-next">
        <section className="dpx-home-card is-primary">
          <span className="dpx-home-kicker"><Play size={13} /> {resume === lastProblem ? "Continue where you left off" : "Up next"}</span>
          {resume ? (
            <>
              <h2>{resume.title}</h2>
              <p><span className={`dpx-level ${levelClass(resume.difficulty)}`}>{resume.difficulty}</span> {resume.topics.slice(0, 2).join(" · ")}</p>
              <div className="dpx-home-actions">
                <button type="button" className="dpx-btn is-primary" onClick={() => openProblem(resume.id)}>{resume === lastProblem ? "Resume" : "Start"} <ArrowRight size={14} /></button>
                {watchFirst && <button type="button" className="dpx-btn dsv-home-watch" onClick={() => openProblem(resume.id, { tab: "visualize" })}><Clapperboard size={14} /> Watch the visual first</button>}
              </div>
            </>
          ) : (
            <>
              <h2>Everything in your sheets is solved</h2>
              <p>Pick a new sheet or browse the full practice set.</p>
              <button type="button" className="dpx-btn is-primary" onClick={() => navigate("problems")}>Browse problems <ArrowRight size={14} /></button>
            </>
          )}
        </section>

        {potd && (
          <section className="dpx-home-card">
            <span className="dpx-home-kicker"><Flame size={13} /> Problem of the Day</span>
            <h2>{potd.title}</h2>
            <p><span className={`dpx-level ${levelClass(potd.difficulty)}`}>{potd.difficulty}</span> {habit.potdSolved ? "Solved today" : "Accepted today earns the daily bonus"}</p>
            <button type="button" className="dpx-btn" onClick={() => openProblem(potd.id)}>{habit.potdSolved ? "Review it" : "Solve now"} <ArrowRight size={14} /></button>
          </section>
        )}

        <section className="dpx-home-card">
          <span className="dpx-home-kicker"><Repeat size={13} /> Review queue</span>
          <h2>{habit.due.length ? `${habit.due.length} problem${habit.due.length === 1 ? "" : "s"} due` : "Nothing due today"}</h2>
          <p>{habit.due.length ? (dueWithVisual ? `${dueWithVisual} of them ha${dueWithVisual === 1 ? "s" : "ve"} a visual lesson to rewatch first.` : "Spaced review keeps solved problems solvable.") : "Solved problems come back here on a spaced schedule."}</p>
          <button type="button" className="dpx-btn" onClick={() => navigate("review")}>{habit.due.length ? "Start review" : "Open queue"} <ArrowRight size={14} /></button>
        </section>
      </div>

      <section className="dpx-home-section">
        <header>
          <h2>Learn visually</h2>
          {visualLast?.path && <button type="button" className="dpx-link" onClick={() => navigate(sectionForPath(visualLast.path), { path: visualLast.path })}>Continue watching: {visualLast.title} <ArrowRight size={13} /></button>}
        </header>
        <Suspense fallback={<div className="dsv-home-grid is-loading" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className="dsv-tile is-skeleton" />)}</div>}>
          <HomeLearn navigate={navigate} watched={watched} visualLast={visualLast} aifsDone={Object.keys(aifsProgress || {}).length} aifsLast={aifsLast} sqlSolved={sqlSolved || {}} />
        </Suspense>
      </section>

      <div className="dpx-home-split">
        <LevelProgress problems={practiceProblems} learner={learner} label="Overall progress" />
        <section className="dpx-home-activity" aria-label="Activity">
          <span className="dpx-progress-label">Activity</span>
          <div className="dpx-progress-card">
            <Heatmap counts={counts} weeks={26} label="Practice activity" />
            <div className="dpx-home-streaks">
              <span>Current streak <b>{habit.streak.current} days</b></span>
              <span>Longest <b>{habit.streak.longest} days</b></span>
              <span>This week <b>{habit.points.week} coins</b></span>
            </div>
          </div>
        </section>
      </div>

      <section className="dpx-home-section">
        <header><h2>Your sheets</h2><button type="button" className="dpx-link" onClick={() => navigate("tracks")}>All sheets and tracks <ArrowRight size={13} /></button></header>
        <div className="dpx-home-sheets">
          {sheetProgress.map(({ sheet, done, total, next }) => (
            <button type="button" key={sheet.id} className="dpx-home-sheet" onClick={() => navigate("tracks", { sheetId: sheet.id })}>
              <span className="dpx-home-sheet-group">{sheet.group}</span>
              <b>{sheet.title}</b>
              <span className="dpx-home-sheet-meta">{done} / {total} solved{next && done ? ` · next: ${next.title}` : ""}</span>
              <span className="dpx-bar"><span style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></span>
            </button>
          ))}
        </div>
      </section>

      <div className="dpx-home-split is-wide-left">
        <section className="dpx-home-section">
          <header><h2>Explore</h2></header>
          <div className="dpx-home-explore">
            {EXPLORE.map(({ id, icon: Icon, title, body }) => (
              <button type="button" key={id} onClick={() => navigate(id)}>
                <span className="dpx-home-explore-icon"><Icon size={17} /></span>
                <b>{title}</b>
                <span>{body}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="dpx-home-section">
          <header><h2>Recent submissions</h2><button type="button" className="dpx-link" onClick={() => navigate("dashboard")}>Dashboard <ArrowRight size={13} /></button></header>
          <div className="dpx-home-recent">
            {recent.length ? recent.map((entry) => {
              const problem = practiceById.get(entry.slug);
              const accepted = entry.verdict === "accepted";
              return (
                <button type="button" key={entry.id} onClick={() => openProblem(entry.slug, { tab: "submissions" })}>
                  {accepted ? <CircleCheck size={16} className="is-pass" /> : <CircleX size={16} className="is-fail" />}
                  <span><b>{problem?.title || entry.title}</b><small>{VERDICT[entry.verdict] || entry.verdict} · {entry.passed}/{entry.total} cases</small></span>
                  <time dateTime={entry.at}>{relativeTime(entry.at)}</time>
                </button>
              );
            }) : (
              <div className="dpx-home-empty"><History size={18} /><span>Submissions you make appear here.</span><button type="button" className="dpx-link" onClick={() => navigate("problems")}><BookOpenCheck size={13} /> Find a problem</button></div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
