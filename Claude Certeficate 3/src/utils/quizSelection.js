/*
 * Quiz question selection.
 *
 * Filtering and sampling are pure functions of the config so a "restart"
 * simply re-runs them — no hidden state to reset.
 */

/** Fisher–Yates shuffle on a copy; never mutates the input. */
export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Apply the scope filters (domains, modules, question source) to the full bank.
 * An empty domain or module selection means "no filter on that axis".
 */
export function filterQuestions(questions, config) {
  return questions.filter((question) => {
    if (config.sources.length > 0 && !config.sources.includes(question.source)) {
      return false;
    }
    if (config.domainIds.length > 0 && !config.domainIds.includes(question.domainId)) {
      return false;
    }
    if (config.moduleIds.length > 0 && !config.moduleIds.includes(question.moduleId)) {
      return false;
    }
    return true;
  });
}

/**
 * Build the ordered question list for one attempt.
 *
 * Sampling draws from a shuffled copy and takes a prefix, so a question can
 * never appear twice in the same attempt. `length: 'full'` keeps every match;
 * a number caps the attempt at that many questions.
 */
export function buildAttempt(questions, config) {
  const pool = filterQuestions(questions, config);

  if (config.length === 'full' && !config.shuffle) {
    return pool;
  }

  const shuffled = shuffle(pool);
  if (config.length === 'full') {
    return shuffled;
  }
  return shuffled.slice(0, Math.min(config.length, shuffled.length));
}

/** Per-domain correct/total tallies for the results breakdown. */
export function scoreByDomain(attempt, answers, domains) {
  return domains
    .map((domain) => {
      const questions = attempt.filter((question) => question.domainId === domain.id);
      if (questions.length === 0) return null;
      const correct = questions.filter(
        (question) => answers[question.id] === question.correctOptionId
      ).length;
      return { ...domain, total: questions.length, correct };
    })
    .filter(Boolean)
    .sort((a, b) => b.correct / b.total - a.correct / a.total);
}
