/**
 * Scoring for the MLA-C01 practice exams.
 *
 * AWS reports this exam on a scaled 100–1000 range with 720 to pass, not as a
 * raw percentage, so that is what exam mode shows: the raw count is scaled
 * linearly across the range. A linear scale is an approximation — the real
 * exam weights by item difficulty, which the bank does not carry — so the
 * results screen prints the raw count next to the scaled score rather than
 * presenting the scaled number as the whole truth.
 */

import { MLA_SCORE_MIN, MLA_SCORE_MAX, MLA_PASSING_SCORE } from "../../../data/mlaPracticeExams";

/** Did the learner pick exactly the correct set? Partial credit is not awarded. */
export const isCorrect = (question, answer) => {
  const picked = answer || [];
  if (picked.length !== question.correct.length) return false;
  return question.correct.every((key) => picked.includes(key));
};

export const scaleScore = (correctCount, total) => {
  if (!total) return MLA_SCORE_MIN;
  const ratio = correctCount / total;
  return Math.round(MLA_SCORE_MIN + ratio * (MLA_SCORE_MAX - MLA_SCORE_MIN));
};

/** The raw count that first reaches a passing scaled score, for "you needed N". */
export const questionsNeededToPass = (total) => {
  if (!total) return 0;
  const ratio = (MLA_PASSING_SCORE - MLA_SCORE_MIN) / (MLA_SCORE_MAX - MLA_SCORE_MIN);
  return Math.ceil(ratio * total);
};

/**
 * Grade a whole attempt.
 *
 * `answers` is keyed by question id, holding the option letters picked. An
 * unanswered question counts as wrong, exactly as it would on the real exam.
 */
export const gradeAttempt = (questions, answers) => {
  const perDomain = {};
  let correctCount = 0;

  questions.forEach((question) => {
    const answer = answers[question.id];
    const right = isCorrect(question, answer);
    if (right) correctCount += 1;

    const domain = perDomain[question.domain] || { name: question.domain, correct: 0, total: 0, skipped: 0 };
    domain.total += 1;
    if (right) domain.correct += 1;
    if (!answer || !answer.length) domain.skipped += 1;
    perDomain[question.domain] = domain;
  });

  const answeredCount = questions.filter((q) => (answers[q.id] || []).length).length;

  return {
    total: questions.length,
    correctCount,
    incorrectCount: answeredCount - correctCount,
    skippedCount: questions.length - answeredCount,
    answeredCount,
    score: scaleScore(correctCount, questions.length),
    passed: scaleScore(correctCount, questions.length) >= MLA_PASSING_SCORE,
    percent: questions.length ? Math.round((correctCount / questions.length) * 100) : 0,
    domainBreakdown: Object.values(perDomain)
      .map((domain) => ({
        ...domain,
        percent: domain.total ? Math.round((domain.correct / domain.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total),
  };
};

/** 7384 → "2:03:04"; under an hour drops the hours field, like a real timer. */
export const formatClock = (totalSeconds) => {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
};

/** "1h 12m" / "48m" / "<1m" — for elapsed time on the results screen. */
export const formatDuration = (totalSeconds) => {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.round((safe % 3600) / 60);
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return minutes ? `${minutes}m` : "<1m";
};
