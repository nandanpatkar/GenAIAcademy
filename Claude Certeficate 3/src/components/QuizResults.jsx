import Icon from './Icon.jsx';
import ProgressBar from './ProgressBar.jsx';
import { scoreByDomain } from '../utils/quizSelection.js';

/*
 * End-of-attempt summary: score, percentage, per-domain breakdown, and the
 * routes onward — review the misses, retake the same scope, or reconfigure.
 */

export default function QuizResults({
  course,
  attempt,
  answers,
  missedQuestions,
  onReviewMissed,
  onRestartSame,
  onReconfigure,
}) {
  const total = attempt.length;
  const correct = total - missedQuestions.length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percent >= course.passMarkPercent;

  const breakdown = scoreByDomain(attempt, answers, course.quiz.domains);

  return (
    <div className="shell view">
      <div className="quiz">
        <section className="card results" aria-labelledby="results-heading">
          <span className={`chip ${passed ? 'chip--success' : 'chip--error'}`}>
            <Icon name={passed ? 'checkCircle' : 'target'} />
            {passed
              ? `At or above the ${course.passMarkPercent}% pass mark`
              : `Below the ${course.passMarkPercent}% pass mark`}
          </span>

          <h1
            className={`results__score results__score--${passed ? 'pass' : 'fail'}`}
            id="results-heading"
          >
            {percent}%
          </h1>
          <p className="results__sub">
            {correct} of {total} correct
            {missedQuestions.length > 0
              ? ` · ${missedQuestions.length} to review`
              : ' · nothing missed'}
          </p>

          <div className="results__meter">
            <ProgressBar
              value={correct}
              max={total}
              label="Final score"
              showHeader={false}
              tone={passed ? 'success' : 'primary'}
              valueText={`${correct} of ${total} correct, ${percent} percent`}
            />
          </div>

          <div className="results__actions">
            {missedQuestions.length > 0 ? (
              <button type="button" className="btn btn--primary" onClick={onReviewMissed}>
                <Icon name="list" />
                Review {missedQuestions.length} missed
              </button>
            ) : null}
            <button type="button" className="btn btn--outline" onClick={onRestartSame}>
              <Icon name="refresh" />
              Retake this quiz
            </button>
            <button type="button" className="btn btn--ghost" onClick={onReconfigure}>
              Change quiz settings
            </button>
          </div>
        </section>

        {breakdown.length > 0 ? (
          <section className="card quiz-setup__group" aria-labelledby="breakdown-heading">
            <h2 className="quiz-setup__legend" id="breakdown-heading">
              Breakdown by exam domain
            </h2>
            <p className="quiz-setup__hint">
              Strongest first. The weakest domain here is the highest-leverage module to
              re-read.
            </p>
            <div className="results__breakdown">
              {breakdown.map((domain) => (
                <div key={domain.id} className="results__domain">
                  <span className="results__domain-name">{domain.title}</span>
                  <span className="results__domain-score">
                    {domain.correct}/{domain.total} ·{' '}
                    {Math.round((domain.correct / domain.total) * 100)}%
                  </span>
                  <span className="results__domain-bar">
                    <ProgressBar
                      value={domain.correct}
                      max={domain.total}
                      label={domain.title}
                      showHeader={false}
                      tone={
                        domain.correct / domain.total >= course.passMarkPercent / 100
                          ? 'success'
                          : 'primary'
                      }
                      valueText={`${domain.title}: ${domain.correct} of ${domain.total} correct`}
                    />
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
