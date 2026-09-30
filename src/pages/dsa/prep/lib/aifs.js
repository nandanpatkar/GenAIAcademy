// AI from Scratch inside the DSA hub. The curriculum index (phases → lessons)
// comes from src/data/aiFromScratchData.js — the same data the main sidebar's
// viewer reads — and lesson completion is the same `aifs_progress` map, so the
// two viewers always agree. Everything here is pure; callers pass the phases.

export const PASS_RATIO = 0.7;

/** Group the free-form lesson types ("Learn + Build", "Build (Capstone)"…) into filterable families. */
export function typeFamily(type) {
  const value = String(type || "");
  if (/capstone/i.test(value)) return "Capstone";
  if (/^reference/i.test(value)) return "Reference";
  if (/^build/i.test(value)) return "Build";
  if (/^(learn|use)/i.test(value)) return "Learn";
  return "Other";
}

export function buildIndex(phases) {
  const lessonBySlug = new Map();
  const phaseBySlug = new Map();
  const byTrack = {};
  phases.forEach((phase) => {
    (byTrack[phase.track] ||= []).push(phase);
    phase.lessons.forEach((lesson) => {
      lessonBySlug.set(lesson.slug, lesson);
      phaseBySlug.set(lesson.slug, phase);
    });
  });
  // Reading order within each track, for previous / next.
  const order = Object.fromEntries(Object.entries(byTrack).map(([track, list]) => [track, list.flatMap((phase) => phase.lessons.map((lesson) => lesson.slug))]));
  return { byTrack, lessonBySlug, phaseBySlug, order };
}

export function trackStats(trackPhases, progress, quizResults = {}) {
  let total = 0;
  let done = 0;
  let minutesLeft = 0;
  let quizzesTotal = 0;
  let quizzesPassed = 0;
  trackPhases.forEach((phase) => phase.lessons.forEach((lesson) => {
    total += 1;
    if (progress[lesson.slug]) done += 1; else minutesLeft += lesson.minutes || 0;
    if (lesson.quiz) {
      quizzesTotal += 1;
      if (quizResults[lesson.slug]?.passedAt) quizzesPassed += 1;
    }
  }));
  return { total, done, minutesLeft, quizzesTotal, quizzesPassed };
}

/** First lesson not marked complete, in reading order. */
export function nextLesson(trackPhases, progress) {
  for (const phase of trackPhases) {
    const lesson = phase.lessons.find((entry) => !progress[entry.slug]);
    if (lesson) return { lesson, phase };
  }
  return null;
}

export function neighbours(order, slug) {
  const index = order.indexOf(slug);
  return { previous: index > 0 ? order[index - 1] : null, next: index >= 0 && index < order.length - 1 ? order[index + 1] : null };
}

export function filterLessons(phase, { query = "", status = "all", family = "all", progress = {} }) {
  const needle = query.trim().toLowerCase();
  return phase.lessons.filter((lesson) => (!needle || `${lesson.title} ${lesson.blurb} ${lesson.langs}`.toLowerCase().includes(needle))
    && (status === "all" || (status === "done") === Boolean(progress[lesson.slug]))
    && (family === "all" || typeFamily(lesson.type) === family));
}

/**
 * Score a lesson quiz. "pre" questions are a warm-up before reading and don't
 * count; "check" and "post" are graded. Passing needs every graded question
 * answered and at least PASS_RATIO of them right.
 */
export function scoreQuiz(questions, answers) {
  const tally = { pre: { correct: 0, total: 0 }, graded: { correct: 0, total: 0, answered: 0 } };
  questions.forEach((question, index) => {
    const choice = answers[index];
    const right = choice === question.correct;
    if (question.stage === "pre") {
      tally.pre.total += 1;
      if (right) tally.pre.correct += 1;
      return;
    }
    tally.graded.total += 1;
    if (choice != null) tally.graded.answered += 1;
    if (right) tally.graded.correct += 1;
  });
  const { correct, total, answered } = tally.graded;
  return {
    ...tally,
    ratio: total ? correct / total : 0,
    complete: answered === total,
    passed: total > 0 && answered === total && correct / total >= PASS_RATIO,
  };
}

/** Keep the best graded score and when it first passed. */
export function recordQuizResult(previous, result, now = new Date().toISOString()) {
  const best = Math.max(previous?.best || 0, result.graded.correct);
  return {
    attempts: (previous?.attempts || 0) + 1,
    best,
    total: result.graded.total,
    lastRatio: result.ratio,
    lastAt: now,
    passedAt: previous?.passedAt || (result.passed ? now : null),
  };
}
