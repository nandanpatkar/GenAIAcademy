// Coins, streaks, achievements and titles.
//
// The ledger is append-only and every entry is keyed by (ruleId, sourceKey):
// awarding the same rule for the same source twice is a no-op, so replays,
// double clicks or re-submitting an accepted problem can never mint coins.
// Coins are learning points — nothing is bought with them. Rules carry a
// version so the rate behind any entry stays explainable after tuning.

import { addDays, dayKey, longestStreak, streakLength } from "./dates.js";
import { coinsFor, difficultyKey } from "./problems.js";

export const RULES = {
  first_accept: { version: 1, label: "Solved a problem", points: (problem) => coinsFor(problem) },
  potd: { version: 1, label: "Problem of the Day, on the day", points: () => 15 },
  review: { version: 1, label: "Spaced review completed", points: () => 5 },
  pattern_complete: { version: 1, label: "Finished every problem in a pattern", points: () => 50 },
  streak: { version: 1, label: "Streak milestone", points: (days) => ({ 3: 20, 7: 50, 14: 100, 30: 250 }[days] || 0) },
  mock_complete: { version: 1, label: "Completed a timed test", points: () => 10 },
  first_post: { version: 1, label: "First community post", points: () => 5 },
  sql_accept: { version: 1, label: "Solved a SQL problem", points: (level) => ({ easy: 10, medium: 20, hard: 40 }[level] || 10) },
  aifs_quiz: { version: 1, label: "Passed an AI from Scratch lesson quiz", points: () => 5 },
  visual_solve: { version: 1, label: "Watched the visual, then solved it", points: () => 5 },
};

export const STREAK_MILESTONES = [3, 7, 14, 30];

/** Returns { ledger, entry } — `entry` is null when the award already exists. */
export function award(ledger, { ruleId, sourceKey, points, at = new Date(), meta = {} }) {
  const rule = RULES[ruleId];
  if (!rule || !sourceKey || !(points > 0)) return { ledger, entry: null };
  if (ledger.some((entry) => entry.ruleId === ruleId && entry.sourceKey === sourceKey)) return { ledger, entry: null };
  const when = new Date(at);
  const entry = { id: `${ruleId}:${sourceKey}`, ruleId, ruleVersion: rule.version, sourceKey, points, at: when.toISOString(), day: dayKey(when), meta };
  return { ledger: [...ledger, entry], entry };
}

export function totals(ledger, today = dayKey()) {
  const month = today.slice(0, 7);
  const weekStartKey = addDays(today, -6);
  const out = { total: 0, month: 0, week: 0, byRule: {} };
  ledger.forEach((entry) => {
    out.total += entry.points;
    if (entry.day.startsWith(month)) out.month += entry.points;
    if (entry.day >= weekStartKey && entry.day <= today) out.week += entry.points;
    out.byRule[entry.ruleId] = (out.byRule[entry.ruleId] || 0) + entry.points;
  });
  return out;
}

/**
 * Days that count toward a streak: an accepted submission, a completed review
 * or a finished timed test. Opening the app or reading does not count.
 */
export const QUALIFYING_RULES = new Set(["review", "mock_complete", "sql_accept", "aifs_quiz"]);

export function qualifyingDays(submissions, ledger) {
  const days = new Set();
  submissions.forEach((submission) => { if (submission.verdict === "accepted") days.add(submission.day); });
  ledger.forEach((entry) => { if (QUALIFYING_RULES.has(entry.ruleId)) days.add(entry.day); });
  return days;
}

export function streakStats(submissions, ledger, today = dayKey()) {
  const days = qualifyingDays(submissions, ledger);
  return { current: streakLength(days, today), longest: longestStreak(days), activeDays: days };
}

export const TITLES = [
  { min: 4000, label: "Grandmaster" },
  { min: 2000, label: "Master" },
  { min: 1000, label: "Diamond" },
  { min: 500, label: "Platinum" },
  { min: 250, label: "Gold" },
  { min: 100, label: "Silver" },
  { min: 1, label: "Bronze" },
];
export const titleFor = (points) => TITLES.find((tier) => points >= tier.min)?.label || "Unranked";
export const nextTitle = (points) => [...TITLES].reverse().find((tier) => points < tier.min) || null;

/**
 * Achievements are derived, never stored: recomputing from the same history
 * always gives the same set. Each returns { value, target } for progress.
 */
export const ACHIEVEMENTS = [
  { id: "first-solve", title: "First accept", description: "Get your first accepted submission.", measure: (s) => [s.solved, 1] },
  { id: "solve-25", title: "Warmed up", description: "Solve 25 problems.", measure: (s) => [s.solved, 25] },
  { id: "solve-100", title: "Century", description: "Solve 100 problems.", measure: (s) => [s.solved, 100] },
  { id: "hard-10", title: "Hard hitter", description: "Solve 10 hard problems.", measure: (s) => [s.hardSolved, 10] },
  { id: "pattern-1", title: "Pattern spotted", description: "Finish every problem in one pattern.", measure: (s) => [s.patternsDone, 1] },
  { id: "pattern-10", title: "Pattern library", description: "Finish every problem in ten patterns.", measure: (s) => [s.patternsDone, 10] },
  { id: "module-1", title: "Module cleared", description: "Finish a whole module, every pattern in it.", measure: (s) => [s.modulesDone, 1] },
  { id: "streak-7", title: "One good week", description: "Reach a 7-day streak.", measure: (s) => [s.longestStreak, 7] },
  { id: "streak-30", title: "Habit formed", description: "Reach a 30-day streak.", measure: (s) => [s.longestStreak, 30] },
  { id: "potd-7", title: "Daily regular", description: "Solve 7 Problems of the Day on their day.", measure: (s) => [s.potdOnTime, 7] },
  { id: "review-20", title: "Spaced out", description: "Complete 20 spaced reviews.", measure: (s) => [s.reviews, 20] },
  { id: "recall-10", title: "It stuck", description: "Recall 10 problems on a later day.", measure: (s) => [s.recalled, 10] },
  { id: "mock-1", title: "Under the clock", description: "Finish a timed aptitude test.", measure: (s) => [s.mocks, 1] },
  { id: "sql-10", title: "Query fluent", description: "Solve 10 SQL problems.", measure: (s) => [s.sqlSolved, 10] },
  { id: "aifs-10", title: "Built from scratch", description: "Pass 10 AI from Scratch lesson quizzes.", measure: (s) => [s.aifsQuizzes, 10] },
];

export function achievementStats({ completed, recalled, submissions, ledger, categories, problemBySlug }) {
  let patternsDone = 0;
  let modulesDone = 0;
  categories.forEach((category) => {
    let moduleDone = true;
    category.patterns.forEach((pattern) => {
      const slugs = pattern.problems.filter((slug) => problemBySlug.has(slug));
      const done = slugs.length > 0 && slugs.every((slug) => completed.has(slug));
      if (done) patternsDone += 1; else moduleDone = false;
    });
    if (moduleDone && category.patterns.length) modulesDone += 1;
  });
  const count = (ruleId) => ledger.filter((entry) => entry.ruleId === ruleId).length;
  return {
    solved: completed.size,
    hardSolved: [...completed].filter((slug) => difficultyKey(problemBySlug.get(slug)) === "hard").length,
    patternsDone,
    modulesDone,
    longestStreak: longestStreak(qualifyingDays(submissions, ledger)),
    potdOnTime: count("potd"),
    reviews: count("review"),
    recalled: recalled.size,
    mocks: count("mock_complete"),
    sqlSolved: count("sql_accept"),
    aifsQuizzes: count("aifs_quiz"),
  };
}

export function evaluateAchievements(stats) {
  return ACHIEVEMENTS.map((achievement) => {
    const [value, target] = achievement.measure(stats);
    return { ...achievement, value: Math.min(value, target), target, earned: value >= target };
  });
}

/* ── scorecards: a local-first leaderboard ────────────────────────────────
   There is no shared server, so peers compare by exchanging scorecards — a
   small self-reported JSON. They are labelled as such everywhere. */

export function makeScorecard({ handle, ledger, submissions, solved, today = dayKey(), now = new Date() }) {
  const sums = totals(ledger, today);
  return {
    format: "dsa-prep-scorecard",
    version: 1,
    handle: String(handle || "anonymous").trim().slice(0, 40) || "anonymous",
    total: sums.total,
    month: { key: today.slice(0, 7), points: sums.month },
    streak: streakStats(submissions, ledger, today).current,
    solved,
    generatedAt: now.toISOString(),
  };
}

export function parseScorecard(text) {
  let data;
  try { data = typeof text === "string" ? JSON.parse(text) : text; } catch { throw new Error("That isn't valid scorecard JSON."); }
  if (!data || data.format !== "dsa-prep-scorecard") throw new Error("That isn't a DSA prep scorecard.");
  const number = (value) => (Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0);
  return {
    format: data.format,
    version: 1,
    handle: String(data.handle || "anonymous").slice(0, 40),
    total: number(data.total),
    month: { key: /^\d{4}-\d{2}$/.test(data.month?.key) ? data.month.key : "", points: number(data.month?.points) },
    streak: number(data.streak),
    solved: number(data.solved),
    generatedAt: Number.isNaN(Date.parse(data.generatedAt)) ? new Date(0).toISOString() : data.generatedAt,
  };
}

/**
 * Deterministic ranking: score desc, then whoever reached it first
 * (generatedAt asc), then handle — ties never shuffle between renders.
 */
export function rankBoard(cards, period, monthKey) {
  const score = (card) => (period === "month" ? (card.month?.key === monthKey ? card.month.points : 0) : card.total);
  return [...cards]
    .map((card) => ({ ...card, score: score(card) }))
    .sort((a, b) => b.score - a.score || a.generatedAt.localeCompare(b.generatedAt) || a.handle.localeCompare(b.handle))
    .map((card, index) => ({ ...card, rank: index + 1 }));
}
