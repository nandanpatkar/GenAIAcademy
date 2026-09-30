import React, { useMemo, useState } from "react";
import {
  AlertTriangle, ArrowRight, BrainCircuit, CalendarClock, CalendarDays, CalendarRange, Check, ChevronLeft, ChevronRight, Clapperboard, Clock3,
  History, Pause, Pencil, Pin, PinOff, Play, Repeat, Route, Scale, Target, Trash2, Undo2,
} from "lucide-react";
import { problemBySlug } from "../catalog";
import { useNow } from "../hooks";
import { addDays, dayKey, formatDay, formatDuration, weekStart } from "../lib/dates";
import { EXPERIENCE, ROLES, dayCapacity, defaultGoal, isTaskDone, isWork, missedTasks, planProgress } from "../lib/planner";
import { patternOf } from "../lib/problems";
import { Badge, ConfirmButton, Dialog, DifficultyPill, EmptyState, Panel, PrepPage, Progress, Stat } from "../ui";
import PlanWizard from "./PlanWizard";
import {
  deletePlan, patchTask, previewRebalance, savePlan, startTimer, stopTimer, timerMinutes, toggleTaskDone, trackFor, undoRevision, useAifsPhases, usePlanDone, usePlanner,
} from "./plannerStore";

const STEPS_INTRO = [
  ["Goal & deadline", "What you're preparing for and when you need to be ready."],
  ["Weekly time", "Minutes per weekday, rest days, and a daily cap."],
  ["Scope", "DSA problems, AI from Scratch lessons or both — and what you already know."],
  ["A schedule you can trust", "Problems packed into each day's time — with a plain warning if it doesn't fit."],
];

function TaskFocus({ task, state, completed, onClose, openProblem, navigate }) {
  const now = useNow(1000);
  if (!task) return null;
  const problem = problemBySlug.get(task.slug);
  const done = isTaskDone(task, state.taskState, completed);
  const lesson = task.kind === "lesson";
  const visual = task.kind === "visual";
  const acceptedElsewhere = completed.has(task.slug) && !state.taskState[task.id]?.done;
  const running = state.timer?.taskId === task.id;
  const spent = timerMinutes(state, task.id, now);
  const pinned = Boolean(state.taskState[task.id]?.pinned);
  return (
    <Dialog open title={problem?.title || task.title} description={`${formatDay(task.day)} · ${task.reason}`} onClose={onClose}
      footer={(
        <>
          <button type="button" className="dsp-btn is-quiet" onClick={() => patchTask(task.id, { pinned: !pinned })}>{pinned ? <><PinOff size={14} /> Unpin</> : <><Pin size={14} /> Pin to this day</>}</button>
          <button type="button" className={`dsp-btn${done ? " is-active" : ""}`} onClick={() => toggleTaskDone(task.id)} disabled={acceptedElsewhere}>{done ? <><Check size={14} /> Done</> : "Mark done"}</button>
          <button type="button" className="dsp-btn is-primary" onClick={() => (lesson ? navigate("aifs", { slug: task.slug }) : visual ? navigate("visual", { path: task.slug }) : openProblem(task.slug))} data-autofocus>{lesson || visual ? "Open lesson" : "Open problem"} <ArrowRight size={14} /></button>
        </>
      )}
    >
      <div className="dsp-row">
        {lesson && <Badge tone="info"><BrainCircuit size={11} /> AI from Scratch</Badge>}
        {visual && <Badge tone="info"><Clapperboard size={11} /> Visual Learning · watch before the section</Badge>}
        {problem && <DifficultyPill difficulty={problem.difficulty} />}
        {problem && <Badge>{patternOf(problem)}</Badge>}
        <Badge tone="neutral">{task.moduleTitle}</Badge>
        {task.estimated && <Badge tone="warning">Time is an estimate</Badge>}
        {acceptedElsewhere && <Badge tone="success">{lesson ? "Lesson completed — ticked automatically" : visual ? "Watched — ticked automatically" : "Accepted — ticked automatically"}</Badge>}
      </div>
      <div className="dsp-focus-timer">
        <div><span className="dsp-muted dsp-small">Planned</span><b>{task.minutes}m</b></div>
        <div><span className="dsp-muted dsp-small">Time spent</span><b>{formatDuration(spent)}</b></div>
        <button type="button" className={`dsp-btn${running ? " is-active" : ""}`} onClick={() => (running ? stopTimer() : startTimer(task.id))}>{running ? <><Pause size={14} /> Pause timer</> : <><Play size={14} /> Start focus timer</>}</button>
      </div>
      <p className="dsp-muted dsp-small">The timer is for your own pacing — it doesn't decide whether the task is done. Pinned tasks stay on their day when you rebalance.</p>
    </Dialog>
  );
}

function RebalanceDialog({ open, preview, onClose, onAccept }) {
  if (!open || !preview) return null;
  return (
    <Dialog open size="lg" title="Rebalance preview" description="Completed and pinned work stays put. Everything else still outstanding is re-packed from today." onClose={onClose}
      footer={<><button type="button" className="dsp-btn is-quiet" onClick={onClose}>Keep current plan</button><button type="button" className="dsp-btn is-primary" onClick={onAccept} data-autofocus>Apply — you can undo</button></>}
    >
      <div className="dsp-grid cols-3">
        <Stat icon={Repeat} label="Tasks moving" value={preview.moved.length} />
        <Stat icon={Route} label="Last task" value={preview.stats.lastDay ? formatDay(preview.stats.lastDay, { weekday: false }) : "—"} />
        <Stat icon={AlertTriangle} label="Won't fit" value={preview.unscheduled.length} tone={preview.unscheduled.length ? "warning" : undefined} />
      </div>
      {preview.warnings.map((warning) => <div key={warning.kind} className="dsp-notice is-warning"><AlertTriangle size={16} /><span>{warning.message}{preview.suggestedDate ? ` Everything fits by ${formatDay(preview.suggestedDate)} — edit the goal to move your date.` : ""}</span></div>)}
      {preview.moved.length ? (
        <ul className="dsp-list dsp-moved-list">
          {preview.moved.map((entry) => (
            <li key={entry.slug} className="dsp-list-row">
              <span className="dsp-list-icon"><CalendarDays size={14} /></span>
              <div><b>{problemBySlug.get(entry.slug)?.title || entry.title}</b><small>{entry.slug.includes("/") ? "Lesson · " : ""}{formatDay(entry.from)} → {formatDay(entry.to)}</small></div>
            </li>
          ))}
        </ul>
      ) : <EmptyState compact icon={Check} title="Nothing needs to move" body="You're on schedule." />}
    </Dialog>
  );
}

export default function Planner({ openProblem, navigate }) {
  const { state, revision } = usePlanner();
  const planDone = usePlanDone();
  const today = dayKey();
  const aifsPhases = useAifsPhases(Boolean(revision?.goal?.aifs?.enabled));
  const [rebalanceError, setRebalanceError] = useState("");
  const [mode, setMode] = useState(null); // null | "create" | "edit"
  const [weekOffset, setWeekOffset] = useState(0);
  const [focusId, setFocusId] = useState("");
  const [rebalance, setRebalance] = useState(null);

  const progress = revision ? planProgress(revision, state.taskState, planDone, today) : null;
  const missed = revision ? missedTasks(revision, state.taskState, planDone, today) : [];
  const week = useMemo(() => {
    const start = addDays(weekStart(today), weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [today, weekOffset]);

  if (mode || !state) {
    if (!mode && !state) {
      return (
        <PrepPage eyebrow="Planner" title="Study plan" description="Turn a goal and your real weekly hours into a day-by-day schedule. It adapts when life happens: missed days are re-packed from today, and you can always undo.">
          <div className="dsp-grid cols-4">
            {STEPS_INTRO.map(([title, body], index) => (
              <div key={title} className="dsp-tile dsp-intro-step"><span>{index + 1}</span><b>{title}</b><p>{body}</p></div>
            ))}
          </div>
          <div><button type="button" className="dsp-btn is-primary" onClick={() => setMode("create")}>Plan my prep <ArrowRight size={15} /></button></div>
        </PrepPage>
      );
    }
    // Plans saved before AI from Scratch was plannable lack its fields; fill defaults.
    const initial = mode === "edit" && state ? { ...defaultGoal(today), ...state.goal, startDate: state.goal.startDate < today ? today : state.goal.startDate } : defaultGoal(today);
    return (
      <PlanWizard
        initialGoal={initial}
        today={today}
        editing={mode === "edit"}
        onCancel={() => setMode(null)}
        onConfirm={(goal, preview) => {
          savePlan({ ...preview, kind: mode === "edit" ? "edited" : "created", note: mode === "edit" ? "Goal edited" : "Plan created" });
          setMode(null);
          setWeekOffset(0);
        }}
      />
    );
  }

  const goal = revision.goal;
  const track = trackFor(goal.trackId);
  const focusTask = revision.tasks.find((task) => task.id === focusId);
  const weeklyTotal = goal.weeklyMinutes.reduce((sum, minutes) => sum + Math.min(minutes, goal.dailyCap || Infinity), 0);
  const role = ROLES.find((entry) => entry.id === goal.role)?.label;
  const experience = EXPERIENCE.find((entry) => entry.id === goal.experience)?.label;

  return (
    <PrepPage
      eyebrow={`Planner · ${track.title}`}
      title="Study plan"
      description={`${role || "Goal"} · ${experience || ""} · ready by ${formatDay(goal.targetDate)} · ${formatDuration(weeklyTotal)} a week`}
      actions={(
        <>
          {state.active > 0 && <button type="button" className="dsp-btn is-quiet" onClick={undoRevision}><Undo2 size={15} /> Undo last change</button>}
          <button type="button" className="dsp-btn" onClick={() => setMode("edit")}><Pencil size={14} /> Edit goal</button>
          <button type="button" className={`dsp-btn${missed.length ? " is-primary" : ""}`} disabled={Boolean(goal.aifs?.enabled && !aifsPhases)} title={goal.aifs?.enabled && !aifsPhases ? "Loading AI from Scratch lessons…" : undefined} onClick={() => { try { setRebalance(previewRebalance(state, today, aifsPhases)); setRebalanceError(""); } catch (error) { setRebalanceError(error.message); } }}><Scale size={14} /> Rebalance</button>
        </>
      )}
    >
      <div className="dsp-grid cols-4">
        <div className="dsp-stat"><Progress value={progress.done} max={progress.total} label="Planned tasks done" tone="success" /><small>{revision.stats.lessons ? `${revision.stats.problems} problems · ${revision.stats.lessons} lessons · ` : ""}{progress.delta > 0 ? `${progress.delta} ahead of schedule` : progress.delta < 0 ? `${-progress.delta} behind schedule` : "On schedule"}</small></div>
        <Stat icon={AlertTriangle} label="Missed" value={missed.length} hint={missed.length ? "Rebalance to re-pack them from today" : "Nothing overdue"} tone={missed.length ? "warning" : undefined} />
        <Stat icon={Target} label="Last task" value={revision.stats.lastDay ? formatDay(revision.stats.lastDay, { weekday: false }) : "—"} hint={`Target ${formatDay(goal.targetDate, { weekday: false })}`} />
        <Stat icon={History} label="Revision" value={`${state.active + 1} of ${state.revisions.length}`} hint={revision.note} />
      </div>

      {rebalanceError && <div className="dsp-notice is-danger" role="alert"><AlertTriangle size={16} /><span>{rebalanceError}</span></div>}
      {missed.length > 0 && (
        <div className="dsp-notice is-warning"><AlertTriangle size={16} /><span><b>{missed.length} planned problem{missed.length === 1 ? " is" : "s are"} overdue.</b> Rebalancing keeps what you finished and anything you pinned, then re-packs the rest from today. You'll see every move before it's applied.</span></div>
      )}
      {revision.warnings.map((warning) => (
        <div key={warning.kind} className="dsp-notice is-warning"><AlertTriangle size={16} /><span>{warning.message}{revision.suggestedDate ? <> Everything fits by <b>{formatDay(revision.suggestedDate)}</b>. <button type="button" className="dsp-link" onClick={() => setMode("edit")}>Edit the goal</button></> : null}</span></div>
      ))}

      <Panel
        title={`Week of ${formatDay(week[0], { weekday: false })}`}
        subtitle="Click a task for details, the focus timer and pinning. Solving a problem or completing a lesson anywhere ticks it off here."
        actions={(
          <div className="dsp-row">
            <button type="button" className="dsp-icon-btn" onClick={() => setWeekOffset((value) => value - 1)} aria-label="Previous week"><ChevronLeft size={16} /></button>
            <button type="button" className="dsp-btn is-small" onClick={() => setWeekOffset(0)} disabled={weekOffset === 0}>This week</button>
            <button type="button" className="dsp-icon-btn" onClick={() => setWeekOffset((value) => value + 1)} aria-label="Next week"><ChevronRight size={16} /></button>
          </div>
        )}
      >
        <div className="dsp-week">
          {week.map((day) => {
            const tasks = revision.tasks.filter((task) => task.day === day);
            const capacity = dayCapacity(goal, day);
            const used = tasks.filter(isWork).reduce((sum, task) => sum + task.minutes, 0);
            const outside = day < goal.startDate || day > goal.targetDate;
            return (
              <section key={day} className={`dsp-day${day === today ? " is-today" : ""}${day < today ? " is-past" : ""}`} aria-label={formatDay(day)}>
                <header>
                  <b>{formatDay(day)}</b>
                  <small>{outside ? "Outside the plan" : capacity.total ? `${formatDuration(used)} / ${formatDuration(capacity.work)}` : "Rest day"}</small>
                  {capacity.work > 0 && !outside && <span className="dsp-progress-track"><span style={{ width: `${Math.min(100, (used / capacity.work) * 100)}%` }} /></span>}
                </header>
                {tasks.length ? tasks.map((task) => {
                  if (task.kind === "review") {
                    return <button type="button" key={task.id} className="dsp-task is-review" onClick={() => navigate("review")}><Repeat size={13} /><span>Review & buffer</span><small>{task.minutes}m</small></button>;
                  }
                  const done = isTaskDone(task, state.taskState, planDone);
                  const late = !done && day < today;
                  return (
                    <div key={task.id} className={`dsp-task${done ? " is-done" : ""}${late ? " is-late" : ""}${task.kind === "lesson" ? " is-lesson" : ""}${task.kind === "visual" ? " is-lesson is-visual" : ""}`}>
                      <button type="button" className="dsp-task-check" onClick={() => toggleTaskDone(task.id)} aria-pressed={done} aria-label={`Mark ${task.title} ${done ? "not done" : "done"}`} disabled={planDone.has(task.slug) && !state.taskState[task.id]?.done}>{done && <Check size={11} />}</button>
                      <button type="button" className="dsp-task-body" onClick={() => setFocusId(task.id)}>
                        <span>{task.kind === "lesson" && <BrainCircuit size={11} className="dsp-lesson-mark" />}{task.kind === "visual" && <Clapperboard size={11} className="dsp-lesson-mark is-visual" />}{problemBySlug.get(task.slug)?.title || task.title}</span>
                        <small>{task.minutes}m{state.taskState[task.id]?.pinned ? " · pinned" : ""}{state.timer?.taskId === task.id ? " · timing" : ""}</small>
                      </button>
                    </div>
                  );
                }) : <p className="dsp-day-empty">{outside || !capacity.total ? "—" : "Free"}</p>}
              </section>
            );
          })}
        </div>
      </Panel>

      <div className="dsp-grid cols-2">
        <Panel title="Revision history" subtitle="Every change is a new revision. Undo steps back one.">
          <ul className="dsp-list">
            {[...state.revisions].map((entry, index) => ({ entry, index })).reverse().map(({ entry, index }) => (
              <li key={entry.id} className="dsp-list-row">
                <span className={`dsp-list-icon${index === state.active ? " is-done" : ""}`}><History size={14} /></span>
                <div><b>{entry.note}</b><small>{new Date(entry.createdAt).toLocaleString()} · {entry.stats.items ?? entry.stats.problems} tasks{entry.moved?.length ? ` · ${entry.moved.length} moved` : ""}</small></div>
                {index === state.active && <Badge tone="accent">Current</Badge>}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Plan settings">
          <dl className="dsp-kv">
            <div><dt>DSA</dt><dd>{goal.includeDsa === false ? "Not included" : track.title}</dd></div>
            <div><dt>Visual intros</dt><dd>{goal.visualIntros ? "Each pattern opens with its lesson" : "Off"}</dd></div>
            <div><dt>AI from Scratch</dt><dd>{goal.aifs?.enabled ? `${goal.aifs.phaseIds ? `${goal.aifs.phaseIds.length} phase${goal.aifs.phaseIds.length === 1 ? "" : "s"}` : "All phases"} · ${Math.round((goal.aifs.share ?? 0.4) * 100)}% of time` : "Not included"}</dd></div>
            <div><dt>Modules</dt><dd>{goal.moduleIds ? `${goal.moduleIds.length} of ${track.modules.length}` : "All"}{goal.masteredModuleIds?.length ? ` · ${goal.masteredModuleIds.length} skipped as known` : ""}</dd></div>
            <div><dt>Order</dt><dd>{goal.strategy === "interleave" ? "Interleaved" : "Module by module"}</dd></div>
            <div><dt>Pace</dt><dd>{goal.pace}</dd></div>
            <div><dt>Window</dt><dd><CalendarRange size={13} /> {formatDay(goal.startDate)} → {formatDay(goal.targetDate)}</dd></div>
            <div><dt>Review share</dt><dd><Clock3 size={13} /> {Math.round((goal.reviewShare || 0.2) * 100)}% of each study day</dd></div>
          </dl>
          <ConfirmButton onConfirm={deletePlan} confirmLabel="Delete plan and its history?"><Trash2 size={14} /> Delete plan</ConfirmButton>
        </Panel>
      </div>

      {focusTask && <TaskFocus task={focusTask} state={state} completed={planDone} onClose={() => setFocusId("")} openProblem={openProblem} navigate={navigate} />}
      <RebalanceDialog open={Boolean(rebalance)} preview={rebalance} onClose={() => setRebalance(null)} onAccept={() => { savePlan(rebalance); setRebalance(null); }} />
      {!revision.tasks.length && <EmptyState icon={CalendarClock} title="This plan has no tasks" body="Every selected problem is already solved or skipped. Edit the goal to widen the scope." />}
    </PrepPage>
  );
}
