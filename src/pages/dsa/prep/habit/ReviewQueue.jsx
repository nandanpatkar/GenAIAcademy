import React, { useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, CalendarClock, Check, Clapperboard, Info, Repeat, Trash2 } from "lucide-react";
import visualLinks from "../../../../data/practice/visualLinks.json";
import { problemBySlug } from "../catalog";
import { gradeReview, removeFromReview, useHabitSummary } from "../habit";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { daysBetween, formatDay } from "../lib/dates";
import { patternOf } from "../lib/problems";
import { GRADES, gradePreview, recallRate, upcomingCards } from "../lib/review";
import { Badge, DifficultyPill, EmptyState, Panel, PrepPage, Stat, Tabs } from "../ui";

const inDays = (days) => (days <= 0 ? "today" : days === 1 ? "in 1 day" : `in ${days} days`);

function DueCard({ card, today, openProblem }) {
  const problem = problemBySlug.get(card.slug);
  const [revealed, setRevealed] = useState(false);
  const preview = gradePreview(card, today);
  if (!problem) return null;
  const overdue = daysBetween(card.dueDay, today);
  // A problem with a Visual Learning lesson can be rewatched before the retry —
  // suggested first when the last review didn't go well.
  const hasVisual = Boolean(visualLinks.byProblem[card.slug]);
  const struggled = ["again", "hard"].includes(card.history?.at(-1)?.grade);
  return (
    <li className="dsp-review-tile">
      <div className="dsp-review-head">
        <div>
          <b>{problem.title}</b>
          <small>{patternOf(problem)} · reviewed {card.reps} time{card.reps === 1 ? "" : "s"}{overdue > 0 ? ` · ${overdue} day${overdue === 1 ? "" : "s"} overdue` : ""}</small>
        </div>
        <DifficultyPill difficulty={problem.difficulty} />
      </div>
      <p className="dsp-muted dsp-small">Re-solve it from a blank editor, then grade how it went. An accepted re-submission while it's due grades it “Good” automatically.</p>
      <div className="dsp-row">
        {hasVisual && struggled && <button type="button" className="dsp-btn is-small dsv-btn-primary" onClick={() => openProblem(card.slug, { tab: "visualize" })}><Clapperboard size={14} /> Rewatch first</button>}
        <button type="button" className={`dsp-btn is-small${hasVisual && struggled ? "" : " is-primary"}`} onClick={() => openProblem(card.slug)}>Re-solve <ArrowRight size={14} /></button>
        {hasVisual && !struggled && <button type="button" className="dsp-btn is-small is-quiet" onClick={() => openProblem(card.slug, { tab: "visualize" })}><Clapperboard size={14} /> Rewatch</button>}
        {!revealed && <button type="button" className="dsp-btn is-small" onClick={() => setRevealed(true)}>I've done it — grade</button>}
      </div>
      {revealed && (
        <div className="dsp-grade-row" role="group" aria-label={`Grade ${problem.title}`}>
          {GRADES.map((grade) => (
            <button type="button" key={grade.id} className={`dsp-grade is-${grade.id}`} onClick={() => gradeReview(card.slug, grade.id)} title={grade.hint}>
              <b>{grade.label}</b><small>{inDays(preview[grade.id])}</small>
            </button>
          ))}
        </div>
      )}
    </li>
  );
}

export default function ReviewQueue({ openProblem, navigate }) {
  const habit = useHabitSummary();
  const [settings, setSettings] = useStore(KEYS.reviewSettings, {});
  const [tab, setTab] = useState("due");
  const autoAdd = settings.autoAdd !== false;
  const upcoming = useMemo(() => upcomingCards(habit.cards, habit.today, 14), [habit.cards, habit.today]);
  const all = useMemo(() => Object.values(habit.cards).sort((a, b) => a.dueDay.localeCompare(b.dueDay)), [habit.cards]);
  const rate = recallRate(habit.cards);

  return (
    <PrepPage
      eyebrow="Planner"
      title="Review queue"
      description="Spaced re-solving: a solved problem comes back after 1, 3, 7 and 14 days, stretching further each time you recall it and resetting when you don't."
      actions={<label className="dsp-check"><input type="checkbox" checked={autoAdd} onChange={(event) => setSettings((prev) => ({ ...prev, autoAdd: event.target.checked }))} /> Queue every newly solved problem</label>}
    >
      <div className="dsp-grid cols-4">
        <Stat icon={Repeat} label="Due now" value={habit.due.length} tone={habit.due.length ? "warning" : undefined} />
        <Stat icon={CalendarClock} label="Next 14 days" value={upcoming.length} />
        <Stat icon={BrainCircuit} label="In rotation" value={all.length} />
        <Stat icon={Check} label="Recall rate" value={rate == null ? "—" : `${Math.round(rate * 100)}%`} hint={rate == null ? "No reviews graded yet" : "Good or Easy grades"} tone="success" />
      </div>

      <Tabs value={tab} onChange={setTab} options={[{ id: "due", label: "Due now", count: habit.due.length }, { id: "upcoming", label: "Upcoming", count: upcoming.length }, { id: "all", label: "All cards", count: all.length }]} />

      {tab === "due" && (habit.due.length ? (
        <ul className="dsp-review-list">{habit.due.map((card) => <DueCard key={card.slug} card={card} today={habit.today} openProblem={openProblem} />)}</ul>
      ) : (
        <Panel><EmptyState icon={Repeat} title={all.length ? "Nothing due — you're caught up" : "Your review queue is empty"} body={all.length ? "Come back when the next card is due. Upcoming reviews are listed in the next tab." : "Solve a problem (it's queued automatically) or use “Revise” in the workspace to schedule one."} action={!all.length && <button type="button" className="dsp-btn" onClick={() => navigate("problems")}>Find a problem</button>} /></Panel>
      ))}

      {tab !== "due" && (
        <Panel>
          {(tab === "upcoming" ? upcoming : all).length ? (
            <ul className="dsp-list">
              {(tab === "upcoming" ? upcoming : all).map((card) => {
                const problem = problemBySlug.get(card.slug);
                if (!problem) return null;
                const days = daysBetween(habit.today, card.dueDay);
                return (
                  <li key={card.slug} className="dsp-list-row">
                    <span className="dsp-list-icon"><Repeat size={15} /></span>
                    <div><b>{problem.title}</b><small>Due {formatDay(card.dueDay)} ({inDays(days)}) · step {card.step + 1} · {card.lapses} lapse{card.lapses === 1 ? "" : "s"}{card.lastGrade ? ` · last: ${card.lastGrade}` : ""}</small></div>
                    <Badge tone={card.source === "auto" ? "neutral" : "accent"}>{card.source === "auto" ? "Auto" : "Manual"}</Badge>
                    <button type="button" className="dsp-icon-btn" onClick={() => openProblem(card.slug)} aria-label={`Open ${problem.title}`}><ArrowRight size={15} /></button>
                    <button type="button" className="dsp-icon-btn" onClick={() => removeFromReview(card.slug)} aria-label={`Remove ${problem.title} from review`}><Trash2 size={15} /></button>
                  </li>
                );
              })}
            </ul>
          ) : <EmptyState compact icon={CalendarClock} title="Nothing scheduled here" />}
        </Panel>
      )}

      <div className="dsp-notice"><Info size={16} /><span>Removing a card only stops the reminders — your solved status and submissions stay. Intervals are sensible defaults from the research (1/3/7/14 days), not a tuned memory model.</span></div>
    </PrepPage>
  );
}
