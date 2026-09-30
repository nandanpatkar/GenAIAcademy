// Problem of the Day. The pick is a pure function of the local date and the
// problem pool: each year gets its own seeded shuffle and day N of the year
// takes item N, so every learner sees the same problem on the same date and
// nothing repeats until the pool is exhausted. No server needed, no state to
// drift. The reward window is the local calendar day.

import { addDays, dayKey, fromDayKey } from "./dates.js";
import { seededShuffle } from "./problems.js";

const dayOfYear = (key) => {
  const date = fromDayKey(key);
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.round((date - start) / 86400000);
};

const shuffleCache = new Map();

/** `pool` is an array of problem slugs; order does not matter. */
export function potdFor(key, pool) {
  if (!pool.length) return null;
  const year = fromDayKey(key).getFullYear();
  const cacheKey = `${year}:${pool.length}`;
  let order = shuffleCache.get(cacheKey);
  if (!order) {
    order = seededShuffle([...pool].sort(), `potd-${year}`);
    shuffleCache.set(cacheKey, order);
  }
  return order[dayOfYear(key) % order.length];
}

/** The last `days` challenges, newest first, ending at `today`. */
export function potdArchive(today, days, pool) {
  return Array.from({ length: days }, (_, index) => {
    const key = addDays(today, -index);
    return { day: key, slug: potdFor(key, pool) };
  });
}

/** Milliseconds until the current challenge window closes (local midnight). */
export function msUntilNextChallenge(now = new Date()) {
  const next = fromDayKey(addDays(dayKey(now), 1));
  return Math.max(0, next.getTime() - now.getTime());
}

/**
 * How the learner did on one day's challenge:
 * - on-time: accepted on the challenge day (earns the daily reward)
 * - late: accepted on a later day (counts as practice, no daily reward)
 * - attempted / missed / open (today, not yet solved)
 */
export function potdOutcome(entry, submissions, today) {
  const mine = submissions.filter((submission) => submission.slug === entry.slug);
  if (mine.some((submission) => submission.verdict === "accepted" && submission.day === entry.day)) return "on-time";
  if (mine.some((submission) => submission.verdict === "accepted" && submission.day > entry.day)) return "late";
  if (mine.some((submission) => submission.day === entry.day)) return "attempted";
  return entry.day === today ? "open" : "missed";
}
