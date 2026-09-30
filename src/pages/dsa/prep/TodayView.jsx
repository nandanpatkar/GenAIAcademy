import React, { useMemo } from "react";
import { ArrowRight, BrainCircuit, CalendarClock, CircleCheckBig, CircleX, Clapperboard, Coins, Flame, Repeat, Route, Sparkles, Target } from "lucide-react";
import visualLinks from "../../../data/practice/visualLinks.json";
import { categories, problemBySlug } from "./catalog";
import { useHabitSummary } from "./habit";
import Heatmap, { activityCounts } from "./Heatmap";
import { useLegacyValue, useStore } from "./hooks";
import { KEYS } from "./keys";
import { useLearnerState } from "./learner";
import { buildAllTracks, nextItem, trackProgress } from "./lib/curriculum";
import { formatDay, relativeTime } from "./lib/dates";
import { patternOf } from "./lib/problems";
import { LEGACY_KEYS } from "./lib/store";
import TodayPlan from "./planner/TodayPlan";
import { sectionForPath } from "./visual/sections";
import { Badge, DifficultyPill, EmptyState, Panel, PrepPage, Progress, Stat } from "./ui";

const tracks = buildAllTracks(categories, problemBySlug);

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
};

export default function TodayView({ navigate, openProblem, displayName }) {
  const habit = useHabitSummary();
  const learner = useLearnerState();
  const [enrollments] = useStore(KEYS.enrollments, {});
  const [aifsLast] = useStore(KEYS.aifsLast, null);
  const [visualLast] = useStore(KEYS.visualLast, null);
  const watchedList = useLegacyValue(LEGACY_KEYS.visualRead, []);
  const watchedCount = Array.isArray(watchedList) ? watchedList.length : 0;
  // Due reviews that have a lesson to rewatch first.
  const dueWithVisual = habit.due.filter((card) => visualLinks.byProblem[card.slug]);
  const potd = problemBySlug.get(habit.potdSlug);
  const enrolled = tracks.filter((track) => enrollments[track.id]);
  const counts = useMemo(() => activityCounts(habit.submissions, habit.ledger), [habit.ledger, habit.submissions]);
  const firstName = String(displayName || "").split(/[\s@._]/)[0];

  return (
    <PrepPage
      eyebrow={formatDay(habit.today)}
      title={`${greeting()}${firstName && firstName !== "Your" ? `, ${firstName}` : ""}`}
      description="Today's plan, the daily challenge and anything due for review — in one place."
    >
      <div className="dsp-grid cols-4">
        <Stat icon={Flame} label="Streak" value={`${habit.streak.current} day${habit.streak.current === 1 ? "" : "s"}`} hint={`Longest ${habit.streak.longest}`} tone="warning" />
        <Stat icon={Coins} label="Coins this week" value={habit.points.week} hint={`${habit.points.total} total`} tone="accent" />
        <Stat icon={Repeat} label="Reviews due" value={habit.due.length} hint={habit.due.length ? "Re-solve to keep them fresh" : "All caught up"} />
        <Stat icon={CircleCheckBig} label="Solved" value={learner.completed.size} hint={`${learner.attempted.size} attempted, not yet accepted`} tone="success" />
      </div>

      <div className="dsp-grid split">
        <div className="dsp-stack">
          <TodayPlan navigate={navigate} openProblem={openProblem} />

          <Panel title="Continue learning" subtitle="Next unsolved item in each track you're enrolled in." actions={<button type="button" className="dsp-btn is-small is-quiet" onClick={() => navigate("tracks")}>Prep Hub</button>}>
            {enrolled.length ? (
              <ul className="dsp-list">
                {enrolled.map((track) => {
                  const next = nextItem(track, learner);
                  const progress = trackProgress(track, enrollments[track.id], learner);
                  const problem = next && problemBySlug.get(next.item.slug);
                  return (
                    <li key={track.id} className="dsp-list-row">
                      <span className="dsp-list-icon"><Route size={15} /></span>
                      <div><b>{problem ? problem.title : `${track.title} complete`}</b><small>{track.title} · {next ? next.section.title : "every required item solved"}</small></div>
                      <div className="dsp-today-progress"><Progress value={progress.done} max={progress.total} /></div>
                      {problem && <button type="button" className="dsp-icon-btn" onClick={() => openProblem(problem.slug)} aria-label={`Open ${problem.title}`}><ArrowRight size={15} /></button>}
                    </li>
                  );
                })}
              </ul>
            ) : <EmptyState compact icon={Route} title="No track yet" body="Enroll in a track to get a clear next problem every day." action={<button type="button" className="dsp-btn is-small" onClick={() => navigate("tracks")}>Choose a track</button>} />}
          </Panel>

          <Panel title="Recent submissions" actions={<button type="button" className="dsp-btn is-small is-quiet" onClick={() => navigate("dashboard")}>Dashboard</button>}>
            {habit.submissions.length ? (
              <ul className="dsp-list">
                {habit.submissions.slice(0, 6).map((entry) => (
                  <li key={entry.id}>
                    <button type="button" className="dsp-list-row" onClick={() => openProblem(entry.slug)}>
                      <span className={`dsp-list-icon${entry.verdict === "accepted" ? " is-done" : ""}`}>{entry.verdict === "accepted" ? <CircleCheckBig size={15} /> : <CircleX size={15} />}</span>
                      <div><b>{entry.title}</b><small>{entry.verdict === "accepted" ? "Accepted" : entry.verdict.replace(/_/g, " ")} · {entry.passed}/{entry.total} tests · {relativeTime(entry.at)}</small></div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <EmptyState compact icon={Target} title="Nothing submitted yet" body="Your judged attempts show up here." />}
          </Panel>
        </div>

        <aside className="dsp-stack">
          <Panel title="Problem of the Day" subtitle={habit.potdSolved ? "Solved — nice." : "Solve it today for +15 coins."} actions={<Flame size={16} className={habit.potdSolved ? "dsp-ok" : "dsp-warn"} />}>
            {potd && (
              <div className="dsp-stack">
                <b className="dsp-today-potd">{potd.title}</b>
                <div className="dsp-row"><DifficultyPill difficulty={potd.difficulty} /><Badge>{patternOf(potd)}</Badge></div>
                <div className="dsp-row">
                  <button type="button" className="dsp-btn is-primary is-small" onClick={() => openProblem(potd.slug)}>{habit.potdSolved ? "Open again" : "Solve"} <ArrowRight size={14} /></button>
                  <button type="button" className="dsp-btn is-small is-quiet" onClick={() => navigate("potd")}>Archive</button>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Due for review" actions={<button type="button" className="dsp-btn is-small is-quiet" onClick={() => navigate("review")}>Queue</button>}>
            {habit.due.length ? (
              <ul className="dsp-list">
                {habit.due.slice(0, 4).map((card) => {
                  const problem = problemBySlug.get(card.slug);
                  return problem && (
                    <li key={card.slug}>
                      <button type="button" className="dsp-list-row" onClick={() => openProblem(card.slug)}>
                        <span className="dsp-list-icon"><Repeat size={14} /></span>
                        <div><b>{problem.title}</b><small>Due {formatDay(card.dueDay, { weekday: false })}</small></div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : <EmptyState compact icon={Sparkles} title="Nothing due" body="Solved problems come back here on a spaced schedule." />}
            {habit.due.length > 4 && <button type="button" className="dsp-link" onClick={() => navigate("review")}>+{habit.due.length - 4} more</button>}
          </Panel>

          <Panel title="Visual Learning" subtitle={watchedCount ? `${watchedCount} lesson${watchedCount === 1 ? "" : "s"} watched` : null} actions={<Clapperboard size={16} className="dsp-muted" />}>
            {visualLast ? (
              <div className="dsp-stack">
                <b className="dsp-today-potd">{visualLast.title}</b>
                <small className="dsp-muted">{visualLast.track} · {visualLast.group}</small>
                <div className="dsp-row"><button type="button" className="dsp-btn is-small dsv-btn-primary" onClick={() => navigate(sectionForPath(visualLast.path), { path: visualLast.path })}>Continue watching <ArrowRight size={14} /></button><button type="button" className="dsp-btn is-small is-quiet" onClick={() => navigate(sectionForPath(visualLast.path))}>All lessons</button></div>
                {dueWithVisual.length > 0 && <small className="dsp-muted">{dueWithVisual.length} due review{dueWithVisual.length === 1 ? " has" : "s have"} a lesson to rewatch first.</small>}
              </div>
            ) : <EmptyState compact icon={Clapperboard} title="Not started yet" body="Watch each pattern animate, then solve it." action={<button type="button" className="dsp-btn is-small" onClick={() => navigate("visual")}>Browse lessons</button>} />}
          </Panel>

          <Panel title="AI from Scratch" actions={<BrainCircuit size={16} className="dsp-muted" />}>
            {aifsLast ? (
              <div className="dsp-stack">
                <b className="dsp-today-potd">{aifsLast.title}</b>
                <small className="dsp-muted">{aifsLast.phase}</small>
                <div className="dsp-row"><button type="button" className="dsp-btn is-small is-primary" onClick={() => navigate("aifs", { slug: aifsLast.slug })}>Continue <ArrowRight size={14} /></button><button type="button" className="dsp-btn is-small is-quiet" onClick={() => navigate("aifs")}>All lessons</button></div>
              </div>
            ) : <EmptyState compact icon={BrainCircuit} title="Not started yet" body="Build AI from first principles, lesson by lesson." action={<button type="button" className="dsp-btn is-small" onClick={() => navigate("aifs")}>Open curriculum</button>} />}
          </Panel>

          <Panel title="Last 12 weeks" actions={<CalendarClock size={16} className="dsp-muted" />}>
            <Heatmap counts={counts} weeks={12} />
          </Panel>
        </aside>
      </div>
    </PrepPage>
  );
}
