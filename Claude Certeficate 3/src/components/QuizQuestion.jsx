import Icon from './Icon.jsx';

/*
 * One quiz question with immediate feedback.
 *
 * Once an answer is submitted every option button is disabled, so the choice
 * cannot be changed after the fact. The correct option and the learner's own
 * choice are both marked, in colour AND with an icon plus visually-hidden text,
 * so the verdict never depends on colour alone.
 */

export default function QuizQuestion({
  question,
  questionNumber,
  domain,
  selectedOptionId,
  onSelect,
  onNext,
  isLast,
}) {
  const answered = selectedOptionId != null;
  const isCorrect = selectedOptionId === question.correctOptionId;
  const correctOption = question.options.find(
    (option) => option.id === question.correctOptionId
  );

  return (
    <section className="card quiz-q" aria-labelledby="quiz-question-text">
      <div className="quiz-q__head">
        <span className="chip chip--primary">Question {questionNumber}</span>
        {domain ? <span className="eyebrow">{domain.title}</span> : null}
        <span className="chip">
          {question.source === 'course' ? 'Course question' : 'Practice question'} ·{' '}
          {question.ref}
        </span>
      </div>

      <h2 className="quiz-q__text" id="quiz-question-text">
        {question.question}
      </h2>

      <div className="quiz-q__options" role="group" aria-labelledby="quiz-question-text">
        {question.options.map((option) => {
          const isChosen = option.id === selectedOptionId;
          const isRight = option.id === question.correctOptionId;

          let stateClass = '';
          if (answered) {
            if (isRight) stateClass = ' answer--correct';
            else if (isChosen) stateClass = ' answer--wrong';
            else stateClass = ' answer--muted';
          }

          return (
            <button
              key={option.id}
              type="button"
              className={`answer${stateClass}`}
              disabled={answered}
              onClick={() => onSelect(option.id)}
            >
              <span className="answer__id" aria-hidden="true">
                {option.id}
              </span>
              <span className="answer__text">
                <span className="sr-only">Option {option.id}. </span>
                {option.text}
              </span>
              {answered && isRight ? (
                <span className="answer__mark">
                  <Icon name="checkCircle" title="Correct answer" />
                </span>
              ) : null}
              {answered && isChosen && !isRight ? (
                <span className="answer__mark">
                  <Icon name="xCircle" title="Your answer — incorrect" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="feedback" role="status">
          <p
            className={`feedback__verdict feedback__verdict--${isCorrect ? 'correct' : 'wrong'}`}
          >
            <Icon name={isCorrect ? 'checkCircle' : 'xCircle'} />
            {isCorrect ? 'Correct' : 'Incorrect'}
          </p>

          {!isCorrect ? (
            <p className="feedback__line">
              You chose <strong>{selectedOptionId}</strong>. The correct answer is{' '}
              <strong>
                {question.correctOptionId} — {correctOption?.text}
              </strong>
            </p>
          ) : null}

          <p className="feedback__line">{question.rationale}</p>

          {question.note ? (
            <p className="feedback__note">Source note: {question.note}</p>
          ) : null}

          {question.rationaleSource === 'derived' ? (
            <p className="feedback__note">
              The practice-question dump supplies an answer key only for this section;
              this rationale is derived from the matching module&rsquo;s teaching
              content. The answer letter is taken directly from the source key.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="quiz-q__foot">
        <p className="pager__count">
          {answered ? 'Answer locked in' : 'Select an answer to see the rationale'}
        </p>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!answered}
          onClick={onNext}
        >
          {isLast ? 'See results' : 'Next question'}
          <Icon name="arrowRight" />
        </button>
      </div>
    </section>
  );
}
