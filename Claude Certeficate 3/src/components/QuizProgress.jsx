import ProgressBar from './ProgressBar.jsx';

/* Position and running score for the active attempt. */

export default function QuizProgress({ index, total, correct, answered }) {
  const percent = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  return (
    <section className="card quiz-progress" aria-label="Quiz progress">
      <div className="quiz-progress__row">
        <div className="quiz-progress__stat">
          <span className="quiz-progress__stat-label">Question</span>
          <span className="quiz-progress__stat-value">
            {index + 1} <span aria-hidden="true">/</span>
            <span className="sr-only">of</span> {total}
          </span>
        </div>
        <div className="quiz-progress__stat">
          <span className="quiz-progress__stat-label">Score</span>
          <span className="quiz-progress__stat-value quiz-progress__stat-value--primary">
            {correct}
            <span aria-hidden="true">/</span>
            <span className="sr-only">out of</span>
            {answered}
            {answered > 0 ? ` · ${percent}%` : ''}
          </span>
        </div>
      </div>
      <ProgressBar
        value={index}
        max={total}
        label="Quiz progress"
        showHeader={false}
        valueText={`Question ${index + 1} of ${total}`}
      />
    </section>
  );
}
