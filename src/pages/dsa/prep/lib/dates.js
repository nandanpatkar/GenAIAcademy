// Local-calendar date helpers. Everything the learner sees — streaks, the daily
// challenge, plan days — is keyed by the *local* date, never UTC, so a problem
// solved at 11pm counts for that evening wherever the learner is.

export const DAY_MS = 86400000;

export const pad2 = (value) => String(value).padStart(2, "0");

export function dayKey(date = new Date()) {
  const value = new Date(date);
  return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
}

/** Parse a YYYY-MM-DD key as local midnight. */
export function fromDayKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function addDays(key, days) {
  const date = fromDayKey(key);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

/** Whole calendar days from a to b (b - a); DST-safe because it rounds. */
export function daysBetween(a, b) {
  return Math.round((fromDayKey(b) - fromDayKey(a)) / DAY_MS);
}

export const weekdayOf = (key) => fromDayKey(key).getDay();

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDay(key, { weekday = true } = {}) {
  const date = fromDayKey(key);
  const base = `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
  return weekday ? `${WEEKDAY_SHORT[date.getDay()]}, ${base}` : base;
}

/** Monday-based start of the week containing `key`. */
export function weekStart(key) {
  const offset = (weekdayOf(key) + 6) % 7;
  return addDays(key, -offset);
}

/**
 * Length of the run of consecutive days ending today (or yesterday, so a
 * streak is not shown as broken before the learner has had a chance today).
 */
export function streakLength(daySet, today = dayKey()) {
  if (!daySet.size) return 0;
  let cursor = daySet.has(today) ? today : addDays(today, -1);
  let run = 0;
  while (daySet.has(cursor)) {
    run += 1;
    cursor = addDays(cursor, -1);
  }
  return run;
}

export function longestStreak(daySet) {
  const days = [...daySet].sort();
  let best = 0;
  let run = 0;
  let previous = null;
  days.forEach((key) => {
    run = previous && daysBetween(previous, key) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = key;
  });
  return best;
}

export function formatDuration(minutes) {
  const value = Math.max(0, Math.round(minutes));
  if (value < 60) return `${value}m`;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function relativeTime(iso, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
