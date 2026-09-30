import React, { useMemo } from "react";
import { Award, Coins, Crown, Flame, Info, Lock, ScrollText } from "lucide-react";
import { categories, problemBySlug } from "../catalog";
import { useHabitSummary } from "../habit";
import { useLearnerState } from "../learner";
import { formatDay } from "../lib/dates";
import { achievementStats, evaluateAchievements, nextTitle, RULES, titleFor } from "../lib/rewards";
import { EmptyState, Panel, PrepPage, Progress, Stat } from "../ui";

const RULE_ROWS = [
  ["first_accept", "Easy 10 · Medium 20 · Hard 40", "Once per problem, first accepted submission"],
  ["potd", "15", "Once per date, accepted on that date"],
  ["review", "5", "Once per card per day, any grade"],
  ["pattern_complete", "50", "Once per pattern, via an accepted submission"],
  ["streak", "3d 20 · 7d 50 · 14d 100 · 30d 250", "Once per milestone, ever"],
  ["mock_complete", "10", "Once per finished timed test"],
  ["sql_accept", "Easy 10 · Medium 20 · Hard 40", "Once per SQL problem"],
  ["first_post", "5", "Your first published community post"],
  ["aifs_quiz", "5", "Once per lesson, on passing its quiz (70%+ of graded questions)"],
  ["visual_solve", "5", "Once per problem, first solved after watching its Visual Learning lesson"],
];

export default function Achievements() {
  const habit = useHabitSummary();
  const learner = useLearnerState();
  const stats = useMemo(() => achievementStats({
    completed: learner.completed, recalled: learner.recalled, submissions: habit.submissions, ledger: habit.ledger, categories, problemBySlug,
  }), [habit.ledger, habit.submissions, learner.completed, learner.recalled]);
  const achievements = evaluateAchievements(stats);
  const earned = achievements.filter((entry) => entry.earned).length;
  const total = habit.points.total;
  const upcoming = nextTitle(total);
  const history = [...habit.ledger].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 25);

  return (
    <PrepPage
      eyebrow="Unlock"
      title="Achievements"
      description="Coins are learning points from an append-only ledger — each rule pays once per source, so replays and repeat submits can't inflate them. Nothing is sold for coins; they're a record, not a currency."
    >
      <div className="dsp-grid cols-4">
        <Stat icon={Coins} label="Coins" value={total} hint={`${habit.points.month} this month`} tone="accent" />
        <Stat icon={Crown} label="Title" value={titleFor(total)} hint={upcoming ? `${upcoming.min - total} to ${upcoming.label}` : "Top title reached"} />
        <Stat icon={Flame} label="Streak" value={`${habit.streak.current}d`} hint={`Longest ${habit.streak.longest}d`} tone="warning" />
        <Stat icon={Award} label="Achievements" value={`${earned}/${achievements.length}`} hint="Derived from your history" tone="success" />
      </div>

      <Panel title="Achievements" subtitle="Recomputed from your history every time — nothing here is stored separately.">
        <div className="dsp-achievements">
          {achievements.map((entry) => (
            <article key={entry.id} className={`dsp-achievement${entry.earned ? " is-earned" : ""}`}>
              <span className="dsp-achievement-icon">{entry.earned ? <Award size={18} /> : <Lock size={16} />}</span>
              <div>
                <b>{entry.title}</b>
                <small>{entry.description}</small>
                <Progress value={entry.value} max={entry.target} showNumbers tone={entry.earned ? "success" : undefined} />
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <div className="dsp-grid cols-2">
        <Panel title="Coin history" subtitle="Most recent 25 ledger entries.">
          {history.length ? (
            <ul className="dsp-list">
              {history.map((entry) => (
                <li key={entry.id} className="dsp-list-row">
                  <span className="dsp-list-icon"><Coins size={14} /></span>
                  <div>
                    <b>{RULES[entry.ruleId]?.label || entry.ruleId}</b>
                    <small>{formatDay(entry.day)} · {entry.meta?.pattern || entry.meta?.title || problemBySlug.get(entry.sourceKey)?.title || problemBySlug.get(entry.meta?.slug)?.title || entry.sourceKey} · rule v{entry.ruleVersion}</small>
                  </div>
                  <b className="dsp-points">+{entry.points}</b>
                </li>
              ))}
            </ul>
          ) : <EmptyState compact icon={Coins} title="No coins yet" body="Get an accepted submission to earn your first." />}
        </Panel>

        <Panel title="How coins are earned" subtitle="Published rules — the same for everyone." actions={<ScrollText size={16} className="dsp-muted" />}>
          <table className="dsp-table">
            <thead><tr><th>Rule</th><th>Coins</th><th>Limit</th></tr></thead>
            <tbody>
              {RULE_ROWS.map(([id, points, limit]) => <tr key={id}><td>{RULES[id].label}</td><td>{points}</td><td>{limit}</td></tr>)}
            </tbody>
          </table>
          <div className="dsp-notice"><Info size={16} /><span>Manual ticks, runs and reading never mint coins — only judged work does. Titles follow total coins: Bronze 1 · Silver 100 · Gold 250 · Platinum 500 · Diamond 1000 · Master 2000 · Grandmaster 4000.</span></div>
        </Panel>
      </div>
    </PrepPage>
  );
}
