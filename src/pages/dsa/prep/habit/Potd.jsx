import React, { useMemo } from "react";
import { ArrowRight, CalendarDays, CircleCheckBig, CircleDashed, CircleDot, CircleX, Clock3, Coins, Flame, Info } from "lucide-react";
import { problemBySlug } from "../catalog";
import { POTD_POOL, useHabitSummary } from "../habit";
import { useNow } from "../hooks";
import { formatDay } from "../lib/dates";
import { msUntilNextChallenge, potdArchive, potdOutcome } from "../lib/potd";
import { categoryOf, patternOf } from "../lib/problems";
import { RULES } from "../lib/rewards";
import { Badge, DifficultyPill, Panel, PrepPage, Stat } from "../ui";

const OUTCOME = {
  "on-time": { label: "Solved on the day", tone: "success", icon: CircleCheckBig },
  late: { label: "Solved later", tone: "info", icon: CircleDashed },
  attempted: { label: "Attempted", tone: "warning", icon: CircleDot },
  missed: { label: "Missed", tone: "neutral", icon: CircleX },
  open: { label: "Open now", tone: "accent", icon: Flame },
};

const countdown = (ms) => {
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function Potd({ openProblem }) {
  const habit = useHabitSummary();
  const now = useNow(1000);
  const archive = useMemo(() => potdArchive(habit.today, 30, POTD_POOL), [habit.today]);
  const rows = archive.map((entry) => ({ ...entry, problem: problemBySlug.get(entry.slug), outcome: potdOutcome(entry, habit.submissions, habit.today) }));
  const today = rows[0];
  const onTime = rows.filter((row) => row.outcome === "on-time").length;
  // Consecutive on-time days. Today only counts once solved — an unsolved
  // today hasn't broken the run yet.
  const history = today?.outcome === "on-time" ? rows : rows.slice(1);
  const brokenAt = history.findIndex((row) => row.outcome !== "on-time");
  const run = brokenAt === -1 ? history.length : brokenAt;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <PrepPage
      eyebrow="Daily challenge"
      title="Problem of the Day"
      description="One problem a day, the same for everyone on the same date. Solve it before local midnight for the daily bonus; the archive stays open for practice afterwards."
    >
      {today?.problem && (
        <section className={`dsp-potd-hero is-${today.outcome}`}>
          <div className="dsp-potd-main">
            <span className="dsp-eyebrow">{formatDay(habit.today)} · {categoryOf(today.problem)}</span>
            <h2>{today.problem.title}</h2>
            <div className="dsp-row">
              <DifficultyPill difficulty={today.problem.difficulty} />
              <Badge>{patternOf(today.problem)}</Badge>
              <Badge tone={OUTCOME[today.outcome].tone}>{OUTCOME[today.outcome].label}</Badge>
            </div>
            <button type="button" className="dsp-btn is-primary" onClick={() => openProblem(today.slug)}>
              {today.outcome === "on-time" ? "Solve it again" : "Solve today's problem"} <ArrowRight size={15} />
            </button>
          </div>
          <div className="dsp-potd-clock" aria-live="off">
            <span><Clock3 size={14} /> Window closes in</span>
            <b>{countdown(msUntilNextChallenge(new Date(now)))}</b>
            <small>Local midnight · {timeZone}</small>
          </div>
        </section>
      )}

      <div className="dsp-grid cols-3">
        <Stat icon={CircleCheckBig} label="Solved on the day" value={`${onTime}/30`} hint="Last 30 challenges" tone="success" />
        <Stat icon={Flame} label="Daily run" value={`${run} day${run === 1 ? "" : "s"}`} hint="Consecutive on-time solves" tone="warning" />
        <Stat icon={Coins} label="Daily bonus" value={`+${RULES.potd.points()} coins`} hint="Once per date, on top of the normal solve reward" tone="accent" />
      </div>

      <Panel title="Archive" subtitle="The last 30 days. Late solves count as practice and keep your solved status — they just don't earn that day's bonus." actions={<CalendarDays size={16} className="dsp-muted" />}>
        <ul className="dsp-list">
          {rows.map((row) => {
            const meta = OUTCOME[row.outcome];
            const Icon = meta.icon;
            return (
              <li key={row.day}>
                <button type="button" className="dsp-list-row" onClick={() => openProblem(row.slug)} disabled={!row.problem}>
                  <span className={`dsp-list-icon dsp-outcome is-${row.outcome}`}><Icon size={15} /></span>
                  <div><b>{row.problem?.title || row.slug}</b><small>{formatDay(row.day)} · {row.problem ? patternOf(row.problem) : ""}</small></div>
                  {row.problem && <DifficultyPill difficulty={row.problem.difficulty} />}
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="dsp-notice"><Info size={16} /><span>The daily pick is derived from the date, so it needs no server and never changes after the fact. Only an accepted submission on the challenge date earns the bonus — runs and manual ticks don't.</span></div>
    </PrepPage>
  );
}
