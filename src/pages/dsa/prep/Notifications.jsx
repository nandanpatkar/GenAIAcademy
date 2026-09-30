import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CalendarClock, Flame, Gavel, PenSquare, Repeat, Timer, X } from "lucide-react";
import { problemBySlug } from "./catalog";
import { useHabitSummary } from "./habit";
import { useStore } from "./hooks";
import { KEYS } from "./keys";
import { isTaskDone, isWork, missedTasks } from "./lib/planner";
import { usePlanDone, usePlanner } from "./planner/plannerStore";

/**
 * Notifications are derived from current state every render — nothing is
 * queued or pushed. Dismissing one hides that exact notice (its id includes
 * the day or count), so tomorrow's reminder still appears.
 */
export function useNotifications() {
  const habit = useHabitSummary();
  const planDone = usePlanDone();
  const { state: planState, revision } = usePlanner();
  const [aptitude] = useStore(KEYS.aptitude, { sessions: [] });
  const [reports] = useStore(KEYS.reports, []);
  const [draft] = useStore(KEYS.postDraft, null);
  const [dismissed, setDismissed] = useStore(KEYS.dismissed, []);

  const all = useMemo(() => {
    const list = [];
    const potd = problemBySlug.get(habit.potdSlug);
    if (potd && !habit.potdSolved) list.push({ id: `potd:${habit.today}`, icon: Flame, title: "Problem of the Day is open", body: potd.title, target: "potd" });
    if (habit.due.length) list.push({ id: `review:${habit.today}:${habit.due.length}`, icon: Repeat, title: `${habit.due.length} review${habit.due.length === 1 ? "" : "s"} due`, body: "Re-solve them to keep them fresh.", target: "review" });
    if (revision) {
      const left = revision.tasks.filter((task) => isWork(task) && task.day === habit.today && !isTaskDone(task, planState.taskState, planDone)).length;
      const missed = missedTasks(revision, planState.taskState, planDone, habit.today).length;
      if (left) list.push({ id: `plan:${habit.today}:${left}`, icon: CalendarClock, title: `${left} planned task${left === 1 ? "" : "s"} today`, body: "From your study plan.", target: "planner" });
      if (missed) list.push({ id: `plan-missed:${habit.today}:${missed}`, icon: CalendarClock, title: `${missed} planned task${missed === 1 ? " is" : "s are"} overdue`, body: "Rebalance to re-pack them from today.", target: "planner" });
    }
    const running = (aptitude.sessions || []).find((session) => session.status === "in_progress");
    if (running) list.push({ id: `mock:${running.id}`, icon: Timer, title: "A timed test is still running", body: "The clock doesn't stop while you're away.", target: "aptitude" });
    const openReports = reports.filter((report) => report.status === "open").length;
    if (openReports) list.push({ id: `mod:${openReports}`, icon: Gavel, title: `${openReports} report${openReports === 1 ? "" : "s"} to review`, body: "Community moderation queue.", target: "my-posts" });
    if (draft && (draft.title || draft.body)) list.push({ id: `draft:${draft.title}`, icon: PenSquare, title: "Unpublished community draft", body: draft.title || "Untitled", target: "my-posts" });
    return list;
  }, [aptitude.sessions, draft, habit, planDone, planState, reports, revision]);

  const visible = all.filter((entry) => !dismissed.includes(entry.id));
  const dismiss = (id) => setDismissed((list) => [...list.filter((entry) => entry !== id), id].slice(-200));
  return { notifications: visible, dismiss, dismissAll: () => setDismissed((list) => [...new Set([...list, ...visible.map((entry) => entry.id)])].slice(-200)) };
}

export default function NotificationBell({ navigate }) {
  const { notifications, dismiss, dismissAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    const onKeyDown = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("mousedown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  return (
    <div className="dsp-popover-root" ref={rootRef}>
      <button type="button" className="dsa-icon-button" aria-label={`Notifications${notifications.length ? ` (${notifications.length})` : ""}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <Bell size={17} />{notifications.length > 0 && <i />}
      </button>
      {open && (
        <div className="dsp-popover dsp-notifications" role="dialog" aria-label="Notifications">
          <div className="dsp-row"><strong className="dsp-grow">Notifications</strong>{notifications.length > 0 && <button type="button" className="dsp-link dsp-small" onClick={dismissAll}>Dismiss all</button>}</div>
          {notifications.length ? (
            <ul>
              {notifications.map((entry) => {
                const Icon = entry.icon;
                return (
                  <li key={entry.id} className="dsp-notification">
                    <button type="button" onClick={() => { setOpen(false); navigate(entry.target); }}>
                      <span className="dsp-list-icon"><Icon size={14} /></span>
                      <span><b>{entry.title}</b><small>{entry.body}</small></span>
                    </button>
                    <button type="button" className="dsp-icon-btn" onClick={() => dismiss(entry.id)} aria-label={`Dismiss: ${entry.title}`}><X size={13} /></button>
                  </li>
                );
              })}
            </ul>
          ) : <p>You're all caught up.</p>}
        </div>
      )}
    </div>
  );
}
