// Spaced review. A card schedules one problem for re-solving; intervals start
// at 1 / 3 / 7 / 14 days (the research's proposed defaults) and stretch or
// reset with the learner's self-grade. These are sensible defaults, not a
// claim of optimal memory modelling.

import { addDays, daysBetween } from "./dates.js";

export const INTERVALS = [1, 3, 7, 14, 30, 60];
export const GRADES = [
  { id: "again", label: "Again", hint: "Couldn't solve it — see it tomorrow" },
  { id: "hard", label: "Hard", hint: "Solved with a struggle" },
  { id: "good", label: "Good", hint: "Solved independently" },
  { id: "easy", label: "Easy", hint: "Trivial now — push it far out" },
];

const intervalAt = (step) => INTERVALS[Math.max(0, Math.min(step, INTERVALS.length - 1))];

export function newCard(slug, today, source = "manual") {
  return { slug, source, addedDay: today, dueDay: addDays(today, INTERVALS[0]), step: 0, reps: 0, lapses: 0, history: [] };
}

/** Apply a grade on `today`; returns the updated card. */
export function gradeCard(card, grade, today) {
  let step = card.step;
  let wait;
  if (grade === "again") { step = 0; wait = 1; }
  else if (grade === "hard") { wait = Math.max(1, Math.ceil(intervalAt(step) / 2)); }
  else if (grade === "easy") { step = card.step + 2; wait = intervalAt(step); }
  else { step = card.step + 1; wait = intervalAt(step); }
  return {
    ...card,
    step,
    reps: card.reps + 1,
    lapses: card.lapses + (grade === "again" ? 1 : 0),
    dueDay: addDays(today, wait),
    lastGrade: grade,
    lastDay: today,
    history: [...card.history, { day: today, grade }].slice(-30),
  };
}

export const isDue = (card, today) => card.dueDay <= today;

export function dueCards(cards, today) {
  return Object.values(cards || {}).filter((card) => isDue(card, today)).sort((a, b) => a.dueDay.localeCompare(b.dueDay) || a.slug.localeCompare(b.slug));
}

export function upcomingCards(cards, today, days = 7) {
  return Object.values(cards || {})
    .filter((card) => !isDue(card, today) && daysBetween(today, card.dueDay) <= days)
    .sort((a, b) => a.dueDay.localeCompare(b.dueDay));
}

/** Preview of where each grade would send a card — shown on the grade buttons. */
export function gradePreview(card, today) {
  return Object.fromEntries(GRADES.map(({ id }) => [id, daysBetween(today, gradeCard(card, id, today).dueDay)]));
}

/** Share of reviews graded good/easy over the recent history — the recall rate. */
export function recallRate(cards) {
  const events = Object.values(cards || {}).flatMap((card) => card.history);
  if (!events.length) return null;
  return events.filter((event) => event.grade === "good" || event.grade === "easy").length / events.length;
}
