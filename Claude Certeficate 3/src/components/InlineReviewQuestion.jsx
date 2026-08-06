import { useId, useState } from 'react';
import Icon from './Icon.jsx';

/*
 * A module review question rendered as a disclosure panel.
 *
 * Flow: expand -> pick an answer (freely changeable, nothing graded yet) ->
 * press "Check answer" to reveal the verdict, the correct option and the
 * rationale. Selecting alone never gives the answer away, and expanding a
 * question does not spoil it.
 *
 * If no option is picked, the same button reads "Show answer" and reveals the
 * rationale without a verdict — useful when reading rather than testing.
 *
 * This is self-check, not assessment: no score is kept and nothing here feeds
 * the Quiz view's results.
 */

export default function InlineReviewQuestion({ question, index }) {
  const [open, setOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const panelId = useId();
  const triggerId = useId();
  const questionId = useId();

  /* Some review questions are short-answer: they carry a written `answer`
     instead of an option set, so there is nothing to select or grade. */
  const options = question.options ?? [];
  const isOpenAnswer = options.length === 0;

  const hasSelection = selectedOptionId != null;
  const isCorrect = hasSelection && selectedOptionId === question.correctOptionId;
  const correctOption = options.find(
    (option) => option.id === question.correctOptionId
  );

  function reset() {
    setSelectedOptionId(null);
    setRevealed(false);
  }

  return (
    <div className="review-q">
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          id={triggerId}
          className="review-q__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="review-q__label">
            <span className="review-q__tag" aria-hidden="true">
              Q{index + 1}
            </span>
            <span className="review-q__text" id={questionId}>
              {question.question}
            </span>
          </span>

          {revealed && hasSelection ? (
            <span
              className={`review-q__status review-q__status--${isCorrect ? 'correct' : 'wrong'}`}
            >
              <Icon name={isCorrect ? 'checkCircle' : 'xCircle'} />
              <span className="sr-only">
                {isCorrect ? 'Answered correctly' : 'Answered incorrectly'}
              </span>
            </span>
          ) : null}

          <Icon name="chevronDown" className="review-q__chev" />
        </button>
      </h3>

      {open ? (
        <div
          className="review-q__panel"
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
        >
          {isOpenAnswer ? null : (
          <div className="review-q__choices" role="group" aria-labelledby={questionId}>
            {options.map((option) => {
              const isChosen = option.id === selectedOptionId;
              const isRight = option.id === question.correctOptionId;

              /* Before the reveal the only signal is which option is picked.
                 Correctness styling is withheld until `revealed`. */
              let stateClass = '';
              if (!revealed) {
                if (isChosen) stateClass = ' review-q__choice--chosen';
              } else if (isRight) {
                stateClass = ' review-q__choice--correct';
              } else if (isChosen) {
                stateClass = ' review-q__choice--wrong';
              } else {
                stateClass = ' review-q__choice--muted';
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`review-q__choice${stateClass}`}
                  disabled={revealed}
                  aria-pressed={!revealed ? isChosen : undefined}
                  onClick={() => setSelectedOptionId(option.id)}
                >
                  <span className="review-q__choice-id" aria-hidden="true">
                    {option.id}
                  </span>
                  <span className="review-q__choice-text">
                    <span className="sr-only">Option {option.id}. </span>
                    {option.text}
                  </span>
                  {revealed && isRight ? (
                    <span className="review-q__choice-mark">
                      <Icon name="checkCircle" title="Correct answer" />
                    </span>
                  ) : null}
                  {revealed && isChosen && !isRight ? (
                    <span className="review-q__choice-mark">
                      <Icon name="xCircle" title="Your answer — incorrect" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          )}

          {revealed ? (
            <div className="feedback" role="status">
              {hasSelection ? (
                <p
                  className={`feedback__verdict feedback__verdict--${isCorrect ? 'correct' : 'wrong'}`}
                >
                  <Icon name={isCorrect ? 'checkCircle' : 'xCircle'} />
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </p>
              ) : null}

              {isOpenAnswer ? (
                <p className="feedback__line">
                  <strong>Answer.</strong> {question.answer}
                </p>
              ) : (
                <>
                  {!isCorrect ? (
                    <p className="feedback__line">
                      {hasSelection ? (
                        <>
                          You chose <strong>{selectedOptionId}</strong>. The correct answer
                          is{' '}
                        </>
                      ) : (
                        'The correct answer is '
                      )}
                      <strong>
                        {question.correctOptionId} — {correctOption?.text}
                      </strong>
                    </p>
                  ) : null}

                  <p className="feedback__line">
                    <strong>Rationale.</strong> {question.rationale}
                  </p>
                </>
              )}
            </div>
          ) : null}

          <div className="review-q__foot">
            {!revealed ? (
              <>
                <p className="review-q__hint">
                  {isOpenAnswer
                    ? 'Short answer — work it out, then reveal it to compare.'
                    : hasSelection
                      ? 'Answer selected. Check it when you are ready.'
                      : 'Select an answer, then check it. Nothing here is scored.'}
                </p>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setRevealed(true)}
                >
                  <Icon name="checkCircle" />
                  {hasSelection ? 'Check answer' : 'Show answer'}
                </button>
              </>
            ) : (
              <>
                <p className="review-q__hint">
                  {isOpenAnswer
                    ? 'Answer revealed.'
                    : `Answer ${question.correctOptionId} revealed.`}
                </p>
                <button type="button" className="btn btn--outline btn--sm" onClick={reset}>
                  <Icon name="refresh" />
                  {isOpenAnswer ? 'Hide again' : 'Try again'}
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
