import Icon from './Icon.jsx';
import ProgressBar from './ProgressBar.jsx';
import { unitLabel } from '../data/courses.js';

/*
 * Course landing view: a reading-progress summary, the entry points, and the
 * outline.
 *
 * Not every course has a scored quiz — the Amazon Connect track carries its
 * knowledge checks inside each topic instead — so the Quiz entry point appears
 * only when there is a bank to draw from.
 */

export default function CourseHome({
  course,
  completedModuleIds,
  onOpenMaterial,
  onOpenQuiz,
  onOpenModule,
}) {
  const units = unitLabel(course);
  const total = course.modules.length;
  const done = completedModuleIds.size;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const quizQuestions = course.quiz?.questions.length ?? 0;
  const reviewQuestions = course.modules.reduce(
    (sum, module) => sum + module.reviewQuestions.length,
    0
  );

  return (
    <div className="shell view">
      <section className="card course-hero">
        <div className="course-hero__body">
          <span className="chip chip--primary">
            <Icon name="award" />
            {course.category
              ? `${course.category} · ${course.level}`
              : `${course.level} certification · ${course.code}`}
          </span>
          <h1 className="course-hero__title">{course.title}</h1>
          <p className="course-hero__desc">{course.description}</p>
          <p className="eyebrow">{course.examFormat}</p>
        </div>

        <div className="course-hero__stats">
          {total > 0 ? (
            <>
              <div className="progress__head">
                <span>Reading progress</span>
                <span className="course-hero__pct">{percent}%</span>
              </div>
              <ProgressBar
                value={done}
                max={total}
                label="Reading progress"
                showHeader={false}
                valueText={`${done} of ${total} ${units.many} complete`}
              />
              <div className="course-hero__stat-row">
                <span>
                  {done} of {total} {units.many}
                </span>
                <span>
                  {quizQuestions > 0
                    ? `${quizQuestions} practice questions`
                    : `${reviewQuestions} review questions`}
                </span>
              </div>
            </>
          ) : (
            <div className="course-hero__stat-row">
              <span>No reading material — quiz only</span>
              <span>{quizQuestions} practice questions</span>
            </div>
          )}
        </div>
      </section>

      <section className="mode-grid" aria-label="Study modes">
        {/* Not every course has reading material — this one is a pure question
            bank — so the Course Material entry point appears only when there
            is at least one module, mirroring how the Quiz entry point below
            appears only when there is a quiz bank. */}
        {total > 0 ? (
          <button type="button" className="card mode-card" onClick={onOpenMaterial}>
            <span className="mode-card__inner">
              <span className="mode-card__mark">
                <Icon name="book" />
              </span>
              <span>
                <span className="mode-card__title">Course Material</span>
                <span className="mode-card__desc">
                  Read all {total} {units.many}, with review questions inline.
                </span>
              </span>
            </span>
            <Icon name="arrowRight" className="mode-card__arrow" />
          </button>
        ) : (
          <div className="card mode-card mode-card--static">
            <span className="mode-card__inner">
              <span className="mode-card__mark">
                <Icon name="book" />
              </span>
              <span>
                <span className="mode-card__title">Course Material</span>
                <span className="mode-card__desc">
                  This course has no reading material — it's a practice-question bank only.
                </span>
              </span>
            </span>
          </div>
        )}

        {quizQuestions > 0 ? (
          <button type="button" className="card mode-card" onClick={onOpenQuiz}>
            <span className="mode-card__inner">
              <span className="mode-card__mark mode-card__mark--alt">
                <Icon name="quiz" />
              </span>
              <span>
                <span className="mode-card__title">Quiz</span>
                <span className="mode-card__desc">
                  Scored practice with immediate feedback and a results breakdown.
                </span>
              </span>
            </span>
            <Icon name="arrowRight" className="mode-card__arrow" />
          </button>
        ) : (
          <div className="card mode-card mode-card--static">
            <span className="mode-card__inner">
              <span className="mode-card__mark mode-card__mark--alt">
                <Icon name="quiz" />
              </span>
              <span>
                <span className="mode-card__title">Knowledge checks</span>
                <span className="mode-card__desc">
                  {reviewQuestions > 0
                    ? `${reviewQuestions} questions from the source course, at the end of the ${units.many} they belong to. Unscored.`
                    : `This export carries no answer key, so its knowledge checks are shown as part of the ${units.one} text.`}
                </span>
              </span>
            </span>
          </div>
        )}
      </section>

      {total > 0 ? (
      <section style={{ marginTop: 'var(--space-xl)' }} aria-labelledby="course-outline-heading">
        <h2 className="section-title" id="course-outline-heading">
          {units.Cap} outline
        </h2>
        <div className="outline-list">
          {course.modules.map((module) => {
            const isDone = completedModuleIds.has(module.id);
            return (
              <button
                key={module.id}
                type="button"
                className="outline-list__item"
                onClick={() => onOpenModule(module.id)}
              >
                <span
                  className={`outline-list__num${isDone ? ' outline-list__num--done' : ''}`}
                  aria-hidden="true"
                >
                  {isDone ? <Icon name="check" /> : module.number}
                </span>
                <span className="outline-list__text">
                  <span className="outline-list__title">
                    {units.Cap} {module.number}: {module.title}
                  </span>
                  <span className="outline-list__sub">{module.summary}</span>
                </span>
                <span className="chip">
                  {isDone ? 'Read' : module.duration}
                  {isDone ? <span className="sr-only"> — {units.one} complete</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      ) : null}
    </div>
  );
}
