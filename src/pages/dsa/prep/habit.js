// Store-backed habit loop: rewards, spaced review and the daily challenge,
// wired to accepted submissions through `onAccepted`. Importing this module
// registers the listener once (the hub imports it on mount).
import { useMemo } from "react";
import { onAccepted } from "./actions";
import { categories, judgeableProblems, problemBySlug } from "./catalog";
import { useStore } from "./hooks";
import { KEYS } from "./keys";
import { dayKey } from "./lib/dates";
import { potdFor } from "./lib/potd";
import { dueCards, gradeCard, newCard } from "./lib/review";
import { award, RULES, STREAK_MILESTONES, streakStats, totals } from "./lib/rewards";
import { LEGACY_KEYS, readLegacyArray, readStore, updateStore } from "./lib/store";
import visualLinks from "../../../data/practice/visualLinks.json";

export const POTD_POOL = judgeableProblems.map((problem) => problem.slug);
export const todaysChallenge = (today = dayKey()) => potdFor(today, POTD_POOL);

/** Grant a reward; silently a no-op if this (rule, source) was already paid. */
export function grant(ruleId, sourceKey, points, meta = {}) {
  let created = null;
  updateStore(KEYS.ledger, [], (ledger) => {
    const result = award(ledger, { ruleId, sourceKey, points, meta });
    created = result.entry;
    return result.ledger;
  });
  if (created) checkStreakMilestones();
  return created;
}

function checkStreakMilestones() {
  const ledger = readStore(KEYS.ledger, []);
  const { current } = streakStats(readStore(KEYS.submissions, []), ledger);
  STREAK_MILESTONES.filter((days) => current >= days).forEach((days) => {
    // Once per milestone, ever: a broken and rebuilt streak doesn't re-pay.
    if (!ledger.some((entry) => entry.ruleId === "streak" && entry.sourceKey === `streak-${days}`)) {
      updateStore(KEYS.ledger, [], (list) => award(list, { ruleId: "streak", sourceKey: `streak-${days}`, points: RULES.streak.points(days), meta: { days } }).ledger);
    }
  });
}

/* ── spaced review ─────────────────────────────────────────────────────── */

export const reviewSettings = () => ({ autoAdd: true, ...readStore(KEYS.reviewSettings, {}) });

export function addToReview(slug, source = "manual") {
  const today = dayKey();
  updateStore(KEYS.review, {}, (cards) => (cards[slug] ? cards : { ...cards, [slug]: newCard(slug, today, source) }));
}

export function removeFromReview(slug) {
  updateStore(KEYS.review, {}, (cards) => {
    const copy = { ...cards };
    delete copy[slug];
    return copy;
  });
}

export function gradeReview(slug, grade) {
  const today = dayKey();
  updateStore(KEYS.review, {}, (cards) => (cards[slug] ? { ...cards, [slug]: gradeCard(cards[slug], grade, today) } : cards));
  // One review reward per card per day, whatever the grade — honesty about
  // "again" must never cost coins.
  grant("review", `${slug}:${today}`, RULES.review.points(), { grade });
}

/* ── accepted-submission follow-ups ────────────────────────────────────── */

function patternsContaining(slug) {
  return categories.flatMap((category) => category.patterns.filter((pattern) => pattern.problems.includes(slug)).map((pattern) => ({ category, pattern })));
}

let registered = false;
export function registerHabitLoop() {
  if (registered) return;
  registered = true;
  onAccepted(({ problem, submission, firstAccept }) => {
    if (firstAccept) grant("first_accept", problem.slug, RULES.first_accept.points(problem), { difficulty: problem.difficulty });

    // Watch → solve: a first solve of a problem whose visual lesson was
    // watched beforehand pays a small bonus, once per problem.
    const lessonPath = visualLinks.byProblem?.[problem.slug];
    if (firstAccept && lessonPath && readLegacyArray(LEGACY_KEYS.visualRead).includes(lessonPath)) {
      grant("visual_solve", problem.slug, RULES.visual_solve.points(), { lesson: lessonPath });
    }

    if (todaysChallenge(submission.day) === problem.slug) grant("potd", submission.day, RULES.potd.points(), { slug: problem.slug });

    const cards = readStore(KEYS.review, {});
    const card = cards[problem.slug];
    if (card && card.dueDay <= submission.day) gradeReview(problem.slug, "good");
    else if (!card && firstAccept && reviewSettings().autoAdd) addToReview(problem.slug, "auto");

    const completed = new Set(readLegacyArray(LEGACY_KEYS.completed));
    patternsContaining(problem.slug).forEach(({ category, pattern }) => {
      const slugs = pattern.problems.filter((slug) => problemBySlug.has(slug));
      if (slugs.length && slugs.every((slug) => completed.has(slug))) {
        grant("pattern_complete", `${category.slug}/${pattern.slug}`, RULES.pattern_complete.points(), { pattern: pattern.title });
      }
    });
  });
}
registerHabitLoop();

/* ── hooks ─────────────────────────────────────────────────────────────── */

export function useHabitSummary() {
  const [ledger] = useStore(KEYS.ledger, []);
  const [submissions] = useStore(KEYS.submissions, []);
  const [cards] = useStore(KEYS.review, {});
  return useMemo(() => {
    const today = dayKey();
    const potdSlug = todaysChallenge(today);
    const potdSolved = submissions.some((entry) => entry.slug === potdSlug && entry.verdict === "accepted" && entry.day === today);
    return {
      today,
      ledger,
      submissions,
      cards,
      points: totals(ledger, today),
      streak: streakStats(submissions, ledger, today),
      due: dueCards(cards, today),
      potdSlug,
      potdSolved,
    };
  }, [cards, ledger, submissions]);
}
