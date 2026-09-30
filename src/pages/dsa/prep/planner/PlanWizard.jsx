import React, { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BrainCircuit, CalendarRange, Check, Clapperboard, Clock3, Info, Layers, Route } from "lucide-react";
import { problemBySlug } from "../catalog";
import { useLearnerState } from "../learner";
import { addDays, daysBetween, formatDay, formatDuration, WEEKDAY_LONG } from "../lib/dates";
import { DEFAULT_AIFS_SHARE, EXPERIENCE, PACES, ROLES, STRATEGIES, dayCapacity, isWork, validateGoal } from "../lib/planner";
import { useAifsProgress } from "../aifs/aifsStore";
import { Badge, Field, Panel, PrepPage, Progress } from "../ui";
import { planTracks, previewPlan, trackFor, useAifsPhases } from "./plannerStore";

// Reference pages carry no time estimates, so only these tracks can be planned.
const AIFS_PLAN_TRACKS = [
  { id: "curriculum", label: "Curriculum", hint: "Twenty phases, setup to capstone" },
  { id: "certification", label: "Certification", hint: "Focused track for the Claude exams" },
];

const STEPS = ["Goal", "Timeline", "Availability", "Content", "What you know", "Preview"];
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first on screen; data stays Sunday-first.
const PRESETS = [
  { label: "Weekday evenings + weekends", minutes: [150, 60, 60, 60, 60, 60, 150] },
  { label: "Every day, 90 minutes", minutes: [90, 90, 90, 90, 90, 90, 90] },
  { label: "Weekends only", minutes: [240, 0, 0, 0, 0, 0, 240] },
  { label: "Intensive, 3 hours daily", minutes: [180, 180, 180, 180, 180, 180, 180] },
];

function Choice({ active, onClick, title, hint, children }) {
  return (
    <button type="button" className={`dsp-choice${active ? " is-active" : ""}`} aria-pressed={active} onClick={onClick}>
      <span className="dsp-choice-check">{active && <Check size={12} />}</span>
      <span><b>{title}</b>{hint && <small>{hint}</small>}{children}</span>
    </button>
  );
}

export default function PlanWizard({ initialGoal, today, editing, onCancel, onConfirm }) {
  const learner = useLearnerState();
  const [goal, setGoal] = useState(initialGoal);
  const [step, setStep] = useState(0);
  const set = (patch) => setGoal((prev) => ({ ...prev, ...patch }));
  const track = trackFor(goal.trackId);
  const selectedModules = goal.moduleIds || track.modules.map((module) => module.id);
  const weekly = goal.weeklyMinutes.reduce((sum, minutes) => sum + Math.min(minutes, goal.dailyCap || Infinity), 0);
  const errors = validateGoal(goal, today);
  const stepErrors = {
    1: errors.filter((error) => /date|two years/i.test(error)),
    2: errors.filter((error) => /study time/i.test(error)),
    3: errors.filter((error) => /module|phase|Include/i.test(error)),
  }[step] || [];
  const aifs = goal.aifs || { enabled: false, track: "curriculum", phaseIds: null, share: DEFAULT_AIFS_SHARE };
  const aifsPhases = useAifsPhases(aifs.enabled);
  const lessonProgress = useAifsProgress();
  const lessonsWaiting = aifs.enabled && !aifsPhases;
  const preview = useMemo(() => (step === 5 && !errors.length && !lessonsWaiting ? previewPlan(goal, aifsPhases) : null), [aifsPhases, errors.length, goal, lessonsWaiting, step]);
  const solvedInTrack = track.requiredSlugs.filter((slug) => learner.completed.has(slug)).length;
  const aifsTrackPhases = (aifsPhases || []).filter((phase) => phase.track === aifs.track);
  const selectedPhases = aifs.phaseIds || aifsTrackPhases.map((phase) => phase.id);
  const lessonsDoneInScope = aifsTrackPhases.filter((phase) => selectedPhases.includes(phase.id)).reduce((sum, phase) => sum + phase.lessons.filter((lesson) => lessonProgress[lesson.slug]).length, 0);
  const setAifs = (patch) => set({ aifs: { ...aifs, ...patch } });
  const togglePhase = (id) => {
    const next = selectedPhases.includes(id) ? selectedPhases.filter((entry) => entry !== id) : [...selectedPhases, id];
    setAifs({ phaseIds: next.length === aifsTrackPhases.length ? null : next });
  };
  const includeDsa = goal.includeDsa !== false;

  const toggleModule = (id) => {
    const next = selectedModules.includes(id) ? selectedModules.filter((entry) => entry !== id) : [...selectedModules, id];
    set({ moduleIds: next.length === track.modules.length ? null : next, masteredModuleIds: (goal.masteredModuleIds || []).filter((entry) => next.includes(entry)) });
  };
  const toggleMastered = (id) => {
    const list = goal.masteredModuleIds || [];
    set({ masteredModuleIds: list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id] });
  };

  const previewDays = preview ? [...new Set(preview.tasks.map((task) => task.day))].filter((day) => day >= goal.startDate).slice(0, 10) : [];

  return (
    <PrepPage
      eyebrow={`Study plan · step ${step + 1} of ${STEPS.length}`}
      title={editing ? "Adjust your plan" : "Plan your prep"}
      description="Six quick steps. The schedule is computed from your answers — no guessing, and it tells you plainly when a goal doesn't fit."
      actions={<button type="button" className="dsp-btn is-quiet" onClick={onCancel}>Cancel</button>}
    >
      <ol className="dsp-stepper" aria-label="Plan steps">
        {STEPS.map((label, index) => (
          <li key={label} className={index === step ? "is-current" : index < step ? "is-done" : ""}>
            <button type="button" onClick={() => index < step && setStep(index)} disabled={index > step} aria-current={index === step ? "step" : undefined}>
              <span>{index < step ? <Check size={12} /> : index + 1}</span>{label}
            </button>
          </li>
        ))}
      </ol>

      <Panel className="dsp-wizard-box">
        {step === 0 && (
          <div className="dsp-stack">
            <h2 className="dsp-wizard-q">What are you preparing for?</h2>
            <div className="dsp-choice-grid">{ROLES.map((role) => <Choice key={role.id} active={goal.role === role.id} onClick={() => set({ role: role.id })} title={role.label} hint={role.hint} />)}</div>
            <h3 className="dsp-wizard-sub">Experience</h3>
            <div className="dsp-chips">{EXPERIENCE.map((entry) => <button type="button" key={entry.id} className={`dsp-chip${goal.experience === entry.id ? " is-active" : ""}`} aria-pressed={goal.experience === entry.id} onClick={() => set({ experience: entry.id })}>{entry.label}</button>)}</div>
            <p className="dsp-muted dsp-small">These shape the suggestions below; they don't lock anything.</p>
          </div>
        )}

        {step === 1 && (
          <div className="dsp-stack">
            <h2 className="dsp-wizard-q">When do you want to be ready?</h2>
            <div className="dsp-grid cols-2">
              <Field label="Start"><input type="date" className="dsp-input" value={goal.startDate} min={today} onChange={(event) => set({ startDate: event.target.value || today })} /></Field>
              <Field label="Target date" hint="Your interview or the date you want to be done by."><input type="date" className="dsp-input" value={goal.targetDate} min={goal.startDate} onChange={(event) => set({ targetDate: event.target.value })} /></Field>
            </div>
            <div className="dsp-chips">{[4, 8, 12, 16, 24].map((weeks) => <button type="button" key={weeks} className={`dsp-chip${daysBetween(goal.startDate, goal.targetDate) === weeks * 7 - 1 ? " is-active" : ""}`} onClick={() => set({ targetDate: addDays(goal.startDate, weeks * 7 - 1) })}>{weeks} weeks</button>)}</div>
            {goal.targetDate >= goal.startDate && <p className="dsp-muted"><CalendarRange size={14} /> {daysBetween(goal.startDate, goal.targetDate) + 1} days, {formatDay(goal.startDate)} → {formatDay(goal.targetDate)}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="dsp-stack">
            <h2 className="dsp-wizard-q">How much time can you give each day?</h2>
            <div className="dsp-chips">{PRESETS.map((preset) => <button type="button" key={preset.label} className={`dsp-chip${preset.minutes.join() === goal.weeklyMinutes.join() ? " is-active" : ""}`} onClick={() => set({ weeklyMinutes: [...preset.minutes] })}>{preset.label}</button>)}</div>
            <div className="dsp-availability">
              {DISPLAY_ORDER.map((weekday) => (
                <label key={weekday} className="dsp-availability-row">
                  <span>{WEEKDAY_LONG[weekday]}</span>
                  <input type="range" min={0} max={300} step={15} value={goal.weeklyMinutes[weekday]} onChange={(event) => { const next = [...goal.weeklyMinutes]; next[weekday] = Number(event.target.value); set({ weeklyMinutes: next }); }} aria-label={`${WEEKDAY_LONG[weekday]} minutes`} />
                  <b>{goal.weeklyMinutes[weekday] ? formatDuration(goal.weeklyMinutes[weekday]) : "Rest"}</b>
                </label>
              ))}
            </div>
            <div className="dsp-row">
              <Field label="Daily cap" hint="Never schedule more than this on one day."><select className="dsp-select" value={goal.dailyCap} onChange={(event) => set({ dailyCap: Number(event.target.value) })}>{[60, 90, 120, 180, 240, 300].map((value) => <option key={value} value={value}>{formatDuration(value)}</option>)}</select></Field>
              <p className="dsp-muted"><Clock3 size={14} /> {formatDuration(weekly)} a week · {Math.round((goal.reviewShare || 0.2) * 100)}% of each day is kept for review and slack</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="dsp-stack">
            <h2 className="dsp-wizard-q">What should the plan cover?</h2>
            <label className="dsp-check dsp-scope-toggle"><input type="checkbox" checked={includeDsa} onChange={(event) => set({ includeDsa: event.target.checked })} /> <b>DSA problems</b></label>
            {includeDsa && (<>
            <div className="dsp-choice-grid">
              {planTracks.map((entry) => <Choice key={entry.id} active={goal.trackId === entry.id} onClick={() => set({ trackId: entry.id, moduleIds: null, masteredModuleIds: [] })} title={entry.title} hint={`${entry.counts.required} problems · ${formatDuration(entry.estimatedMinutes)} · ${entry.level}`} />)}
            </div>
            <h3 className="dsp-wizard-sub">Modules <button type="button" className="dsp-link" onClick={() => set({ moduleIds: null })}>All</button> · <button type="button" className="dsp-link" onClick={() => set({ moduleIds: [] })}>None</button></h3>
            <div className="dsp-module-picks">
              {track.modules.map((module) => {
                const count = module.sections.reduce((sum, section) => sum + section.items.filter((item) => item.required && !item.repeat).length, 0);
                return <label key={module.id} className="dsp-check"><input type="checkbox" checked={selectedModules.includes(module.id)} onChange={() => toggleModule(module.id)} /> {module.title} <span className="dsp-muted">({count})</span></label>;
              })}
            </div>
            <h3 className="dsp-wizard-sub">Order</h3>
            <div className="dsp-choice-grid">{STRATEGIES.map((entry) => <Choice key={entry.id} active={goal.strategy === entry.id} onClick={() => set({ strategy: entry.id })} title={entry.label} hint={entry.hint} />)}</div>
            <label className="dsp-check"><input type="checkbox" checked={Boolean(goal.visualIntros)} onChange={(event) => set({ visualIntros: event.target.checked })} /> <Clapperboard size={14} /> Open each pattern with its Visual Learning intro <span className="dsp-muted">(~10 min, before the first problem)</span></label>
            </>)}

            <div className="dsp-divider" />
            <label className="dsp-check dsp-scope-toggle"><input type="checkbox" checked={aifs.enabled} onChange={(event) => setAifs({ enabled: event.target.checked })} /> <b><BrainCircuit size={14} /> AI from Scratch lessons</b></label>
            {aifs.enabled && (
              <div className="dsp-stack">
                <div className="dsp-choice-grid">{AIFS_PLAN_TRACKS.map((entry) => <Choice key={entry.id} active={aifs.track === entry.id} onClick={() => setAifs({ track: entry.id, phaseIds: null })} title={entry.label} hint={entry.hint} />)}</div>
                {lessonsWaiting ? <p className="dsp-muted dsp-small">Loading lessons…</p> : (
                  <>
                    {aifsTrackPhases.length > 1 && (
                      <>
                        <h3 className="dsp-wizard-sub">Phases <button type="button" className="dsp-link" onClick={() => setAifs({ phaseIds: null })}>All</button> · <button type="button" className="dsp-link" onClick={() => setAifs({ phaseIds: [] })}>None</button></h3>
                        <div className="dsp-module-picks">
                          {aifsTrackPhases.map((phase) => <label key={phase.id} className="dsp-check"><input type="checkbox" checked={selectedPhases.includes(phase.id)} onChange={() => togglePhase(phase.id)} /> {String(phase.n).padStart(2, "0")} {phase.title} <span className="dsp-muted">({phase.lessons.length}{phase.hours ? ` · ~${phase.hours}h` : ""})</span></label>)}
                        </div>
                      </>
                    )}
                    {includeDsa && (
                      <label className="dsp-availability-row dsp-share-row">
                        <span>Share of study time</span>
                        <input type="range" min={10} max={90} step={10} value={Math.round((aifs.share ?? DEFAULT_AIFS_SHARE) * 100)} onChange={(event) => setAifs({ share: Number(event.target.value) / 100 })} aria-label="Share of study time for AI from Scratch" />
                        <b>{Math.round((aifs.share ?? DEFAULT_AIFS_SHARE) * 100)}% AI · {100 - Math.round((aifs.share ?? DEFAULT_AIFS_SHARE) * 100)}% DSA</b>
                      </label>
                    )}
                    <p className="dsp-muted dsp-small">Lessons stay in reading order within each phase. A lesson counts as done when you mark it complete or pass its quiz — in the hub or the main AI from Scratch viewer.</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="dsp-stack">
            <h2 className="dsp-wizard-q">What do you already know?</h2>
            <label className="dsp-check"><input type="checkbox" checked={goal.skipSolved} onChange={(event) => set({ skipSolved: event.target.checked })} /> Skip what I've already done <span className="dsp-muted">({[includeDsa && `${solvedInTrack} problems solved`, aifs.enabled && aifsPhases && `${lessonsDoneInScope} lessons complete`].filter(Boolean).join(" · ") || "nothing yet"})</span></label>
            <h3 className="dsp-wizard-sub">Modules you're confident in — they'll be left out</h3>
            <div className="dsp-module-picks">
              {track.modules.filter((module) => selectedModules.includes(module.id)).map((module) => <label key={module.id} className="dsp-check"><input type="checkbox" checked={(goal.masteredModuleIds || []).includes(module.id)} onChange={() => toggleMastered(module.id)} /> {module.title}</label>)}
            </div>
            <h3 className="dsp-wizard-sub">Pace</h3>
            <div className="dsp-choice-grid">{PACES.map((pace) => <Choice key={pace.id} active={goal.pace === pace.id} onClick={() => set({ pace: pace.id })} title={pace.label} hint={`${pace.hint} · ×${pace.factor}`} />)}</div>
          </div>
        )}

        {step === 5 && lessonsWaiting && <p className="dsp-muted" role="status">Loading AI from Scratch lessons…</p>}
        {step === 5 && preview && (
          <div className="dsp-stack">
            <h2 className="dsp-wizard-q">Here's your plan</h2>
            <div className="dsp-grid cols-3">
              <div className="dsp-stat"><span className="dsp-stat-label"><Layers size={14} /> Tasks scheduled</span><b className="dsp-stat-value">{preview.stats.items}</b><small>{[preview.stats.problems && `${preview.stats.problems} problems`, preview.stats.lessons && `${preview.stats.lessons} lessons`].filter(Boolean).join(" · ")}{preview.unscheduled.length ? ` · ${preview.unscheduled.length} don't fit` : ""}</small></div>
              <div className="dsp-stat"><span className="dsp-stat-label"><Clock3 size={14} /> Study time</span><b className="dsp-stat-value">{formatDuration(preview.stats.minutes)}</b><small>plus review buffers</small></div>
              <div className="dsp-stat"><span className="dsp-stat-label"><Route size={14} /> Last task</span><b className="dsp-stat-value">{preview.stats.lastDay ? formatDay(preview.stats.lastDay, { weekday: false }) : "—"}</b><small>target {formatDay(goal.targetDate, { weekday: false })}</small></div>
            </div>
            {preview.warnings.map((warning) => (
              <div key={warning.kind} className="dsp-notice is-warning" role="alert">
                <AlertTriangle size={16} />
                <span>
                  {warning.message}{" "}
                  {warning.kind === "infeasible" && preview.suggestedDate && <>Everything fits by <b>{formatDay(preview.suggestedDate)}</b>. <button type="button" className="dsp-link" onClick={() => set({ targetDate: preview.suggestedDate })}>Use that date</button> · </>}
                  {warning.kind === "infeasible" && <><button type="button" className="dsp-link" onClick={() => setStep(3)}>Cover less</button> · <button type="button" className="dsp-link" onClick={() => setStep(2)}>Add study time</button></>}
                  {warning.kind === "too-long" && <button type="button" className="dsp-link" onClick={() => setStep(2)}>Add study time</button>}
                </span>
              </div>
            ))}
            <h3 className="dsp-wizard-sub">First days</h3>
            <ul className="dsp-preview-days">
              {previewDays.map((day) => {
                const tasks = preview.tasks.filter((task) => task.day === day);
                const used = tasks.filter(isWork).reduce((sum, task) => sum + task.minutes, 0);
                const capacity = dayCapacity(goal, day);
                return (
                  <li key={day}>
                    <header><b>{formatDay(day)}</b><small>{formatDuration(used)} of {formatDuration(capacity.work)}</small></header>
                    {tasks.map((task) => <span key={task.id} className={`dsp-preview-task is-${task.kind}`}>{task.kind === "review" ? `Review & buffer · ${task.minutes}m` : `${task.kind === "lesson" ? "AI · " : task.kind === "visual" ? "Watch · " : ""}${problemBySlug.get(task.slug)?.title || task.title} · ${task.minutes}m${task.estimated ? "*" : ""}`}</span>)}
                  </li>
                );
              })}
            </ul>
            <div className="dsp-notice"><Info size={16} /><span>Tasks are placed first-fit into each day's time without splitting anything, keeping problems and lessons in their own order.{preview.stats.lessons && preview.stats.problems ? " Each day starts with whichever of DSA or AI is behind its share, so the split holds across the week." : ""}{preview.stats.estimatedLessons ? ` ${preview.stats.estimatedLessons} lesson${preview.stats.estimatedLessons === 1 ? " has" : "s have"} no time estimate and ${preview.stats.estimatedLessons === 1 ? "is" : "are"} planned at 45 minutes (marked *).` : ""} Solving a problem or completing a lesson anywhere ticks its task off.</span></div>
          </div>
        )}

        {stepErrors.map((error) => <p key={error} className="dsp-error" role="alert">{error}</p>)}

        <footer className="dsp-wizard-foot">
          <button type="button" className="dsp-btn is-quiet" onClick={() => (step ? setStep(step - 1) : onCancel())}><ArrowLeft size={15} /> {step ? "Back" : "Cancel"}</button>
          {step > 0 && step < 5 && <Progress value={step} max={STEPS.length - 1} showNumbers={false} />}
          {step < 5
            ? <button type="button" className="dsp-btn is-primary" disabled={stepErrors.length > 0} onClick={() => setStep(step + 1)}>Next <ArrowRight size={15} /></button>
            : <button type="button" className="dsp-btn is-primary" disabled={!preview || errors.length > 0} onClick={() => onConfirm(goal, preview)}>{editing ? "Save as new revision" : "Create my plan"} <Check size={15} /></button>}
        </footer>
        {step === 5 && errors.length > 0 && <Badge tone="danger">{errors[0]}</Badge>}
      </Panel>
    </PrepPage>
  );
}
