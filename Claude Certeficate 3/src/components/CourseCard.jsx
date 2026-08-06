import Icon from './Icon.jsx';
import ProgressBar from './ProgressBar.jsx';
import { getTrackId, unitCount, unitLabel } from '../data/courses.js';

/*
 * One tile in the course library. `completedCount` comes from App state, so a
 * fresh session always shows "0 of N complete".
 *
 * A card is rendered from catalog metadata alone — an Amazon Connect course has
 * no `modules` array until it is opened — so every figure here comes from a
 * field the catalog carries.
 */

export default function CourseCard({ course, completedCount, isLoading, onOpen }) {
  const total = unitCount(course);
  const units = unitLabel(course);
  const started = completedCount > 0;
  const finished = total > 0 && completedCount === total;

  const questionCount =
    course.quiz?.questions.length ??
    course.questionCount ??
    course.modules?.reduce((sum, module) => sum + module.reviewQuestions.length, 0) ??
    0;
  const hasQuiz = (course.quiz?.questions.length ?? 0) > 0;

  return (
    <article className="card course-card" data-track={getTrackId(course)}>
      <div className="course-card__top">
        <span className="course-card__mark">
          <Icon name={getTrackId(course) === 'amazon-connect' ? 'cloud' : 'school'} />
        </span>
        <span className="chip">{course.level}</span>
      </div>

      <div className="course-card__body">
        <p className="eyebrow">{course.category ?? course.provider}</p>
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__desc">{course.description}</p>
      </div>

      <div className="course-card__meta">
        {total > 0 ? (
          <span className="course-card__meta-item">
            <Icon name="layers" />
            {total} {total === 1 ? units.one : units.many}
          </span>
        ) : null}
        {questionCount > 0 ? (
          <>
            {total > 0 ? <span aria-hidden="true">·</span> : null}
            <span className="course-card__meta-item">
              <Icon name="quiz" />
              {questionCount} {hasQuiz ? 'practice' : 'review'} questions
            </span>
          </>
        ) : null}
      </div>

      <div className="course-card__foot">
        {total === 0 ? null : finished ? (
          <p className="chip chip--success">
            <Icon name="checkCircle" />
            All {total} {units.many} complete
          </p>
        ) : (
          <ProgressBar
            value={completedCount}
            max={total}
            label={`${completedCount} of ${total} ${units.many} complete`}
          />
        )}

        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={onOpen}
          disabled={isLoading}
          aria-label={`${started ? 'Continue' : 'Start course'}: ${course.title}`}
        >
          {isLoading ? 'Opening…' : started ? 'Continue' : 'Start course'}
          <Icon name={isLoading ? 'clock' : 'arrowRight'} />
        </button>
      </div>
    </article>
  );
}
