import Icon from './Icon.jsx';

/*
 * Post-attempt review of the questions answered incorrectly. Read-only: it
 * shows the learner's choice, the correct answer, and the rationale, with no
 * way to re-answer (restart the quiz for that).
 */

export default function MissedQuestionReview({ questions, answers, domains, onBack }) {
  return (
    <div className="shell view">
      <div className="page-head">
        <h1 className="page-head__title">Missed questions</h1>
        <p className="page-head__lede">
          {questions.length} question{questions.length === 1 ? '' : 's'} to revisit. Each
          shows the answer you chose, the correct answer, and why.
        </p>
      </div>

      <div className="quiz">
        <button type="button" className="btn btn--outline" onClick={onBack}>
          <Icon name="arrowLeft" />
          Back to results
        </button>

        <div className="missed">
          {questions.map((question, index) => {
            const chosen = answers[question.id];
            const domain = domains.find((item) => item.id === question.domainId);

            return (
              <article key={question.id} className="card missed__item">
                <div className="quiz-q__head">
                  <span className="chip chip--error">Missed · {index + 1}</span>
                  {domain ? <span className="eyebrow">{domain.title}</span> : null}
                  <span className="chip">{question.ref}</span>
                </div>

                <h2 className="missed__q">{question.question}</h2>

                <div className="missed__rows">
                  {question.options.map((option) => {
                    const isRight = option.id === question.correctOptionId;
                    const isChosen = option.id === chosen;
                    const rowClass = isRight
                      ? ' missed__row--correct'
                      : isChosen
                        ? ' missed__row--chosen'
                        : '';

                    return (
                      <p key={option.id} className={`missed__row${rowClass}`}>
                        <span className="missed__row-id">{option.id}.</span>
                        <span>{option.text}</span>
                        {isRight ? (
                          <span className="missed__row-tag">Correct</span>
                        ) : isChosen ? (
                          <span className="missed__row-tag">Your answer</span>
                        ) : null}
                      </p>
                    );
                  })}
                </div>

                <div className="review-q__rationale">
                  <p className="review-q__rationale-label">Rationale</p>
                  <p className="review-q__rationale-text">{question.rationale}</p>
                  {question.note ? (
                    <p className="feedback__note">Source note: {question.note}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
