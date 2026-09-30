import React from "react";
import { AlertTriangle, ArrowRight, BrainCircuit, CalendarClock, Check, Clapperboard, Repeat } from "lucide-react";
import { problemBySlug } from "../catalog";
import { dayKey, formatDuration } from "../lib/dates";
import { isTaskDone, isWork, missedTasks } from "../lib/planner";
import { Badge, EmptyState, Panel } from "../ui";
import { toggleTaskDone, usePlanDone, usePlanner } from "./plannerStore";

/** Today's study-plan tasks, for the Today view. */
export default function TodayPlan({ navigate, openProblem }) {
  const { state, revision } = usePlanner();
  const planDone = usePlanDone();
  const today = dayKey();

  if (!revision) {
    return (
      <Panel title="Today's plan">
        <EmptyState compact icon={CalendarClock} title="No study plan yet" body="Tell the planner your goal and weekly hours and it lays out each day for you." action={<button type="button" className="dsp-btn is-small" onClick={() => navigate("planner")}>Plan my prep</button>} />
      </Panel>
    );
  }

  const tasks = revision.tasks.filter((task) => task.day === today);
  const work = tasks.filter(isWork);
  const done = work.filter((task) => isTaskDone(task, state.taskState, planDone)).length;
  const minutes = work.reduce((sum, task) => sum + task.minutes, 0);
  const missed = missedTasks(revision, state.taskState, planDone, today).length;

  return (
    <Panel title="Today's plan" subtitle={work.length ? `${done}/${work.length} done · ${formatDuration(minutes)} planned` : "Nothing scheduled today"} actions={<button type="button" className="dsp-btn is-small is-quiet" onClick={() => navigate("planner")}>Full plan</button>}>
      {missed > 0 && <div className="dsp-notice is-warning"><AlertTriangle size={15} /><span>{missed} overdue from earlier days. <button type="button" className="dsp-link" onClick={() => navigate("planner")}>Rebalance</button></span></div>}
      {tasks.length ? (
        <ul className="dsp-list">
          {tasks.map((task) => {
            if (task.kind === "review") {
              return (
                <li key={task.id}>
                  <button type="button" className="dsp-list-row" onClick={() => navigate("review")}>
                    <span className="dsp-list-icon"><Repeat size={14} /></span>
                    <div><b>Review & buffer</b><small>{task.minutes}m kept for spaced review</small></div>
                  </button>
                </li>
              );
            }
            const taskDone = isTaskDone(task, state.taskState, planDone);
            return (
              <li key={task.id} className="dsp-list-row">
                <button type="button" className={`dsp-list-icon dsp-plan-check${taskDone ? " is-done" : ""}`} onClick={() => toggleTaskDone(task.id)} aria-pressed={taskDone} aria-label={`Mark ${task.title} ${taskDone ? "not done" : "done"}`} disabled={planDone.has(task.slug) && !state.taskState[task.id]?.done}>{taskDone ? <Check size={14} /> : null}</button>
                <div><b>{task.kind === "lesson" ? <><BrainCircuit size={12} className="dsp-lesson-mark" /> {task.title}</> : task.kind === "visual" ? <><Clapperboard size={12} className="dsp-lesson-mark is-visual" /> Watch: {task.title}</> : problemBySlug.get(task.slug)?.title || task.title}</b><small>{task.minutes}m{task.estimated ? " (estimate)" : ""} · {task.reason}</small></div>
                {taskDone && <Badge tone="success">Done</Badge>}
                <button type="button" className="dsp-icon-btn" onClick={() => (task.kind === "lesson" ? navigate("aifs", { slug: task.slug }) : task.kind === "visual" ? navigate("visual", { path: task.slug }) : openProblem(task.slug))} aria-label={`Open ${task.title}`}><ArrowRight size={15} /></button>
              </li>
            );
          })}
        </ul>
      ) : <EmptyState compact icon={CalendarClock} title="Rest day" body="No problems planned for today." />}
    </Panel>
  );
}
