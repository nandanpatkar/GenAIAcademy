import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { filterQuestions } from '../utils/quizSelection.js';

/*
 * Quiz configuration: attempt length, question source, and optional scope
 * filters by exam domain or by module. The live count at the bottom reflects
 * the current selection so an over-narrow filter is visible before starting.
 */

const LENGTH_OPTIONS = [
  {
    value: 'full',
    label: 'Full quiz',
    description: 'Every question matching your scope, in a random order.',
  },
  {
    value: 20,
    label: 'Quick 20-question quiz',
    description: 'A random sample of 20, with no repeats in the attempt.',
  },
  {
    value: 60,
    label: 'Exam simulation (60)',
    description: 'Matches the real exam length of 60 scenario questions.',
  },
];

const SOURCE_OPTIONS = [
  {
    value: 'course',
    label: 'Official course questions',
    description: "Part A — the modules' own quizzes, restated.",
  },
  {
    value: 'original',
    label: 'Additional practice questions',
    description: 'Part B — 50 original scenarios, blueprint-weighted.',
  },
];

export default function QuizSetup({ course, onStart }) {
  /* Not every course splits its bank into named sources the way CCAO-F and
     CCDV-F split into "course"/"original" — a course whose questions all
     share one `source` value has nothing to choose here, so the fieldset
     below is hidden and every question is included regardless. */
  const distinctSources = useMemo(
    () => [...new Set(course.quiz.questions.map((question) => question.source))],
    [course]
  );
  const hasSourceChoice = distinctSources.length > 1;
  const hasDomainScope = course.quiz.domains.length > 1;
  const hasModuleScope = course.modules.length > 0;

  const [length, setLength] = useState('full');
  const [sources, setSources] = useState(distinctSources);
  const [scope, setScope] = useState('all'); // 'all' | 'domain' | 'module'
  const [domainIds, setDomainIds] = useState([]);
  const [moduleIds, setModuleIds] = useState([]);

  const config = useMemo(
    () => ({
      length,
      sources,
      domainIds: scope === 'domain' ? domainIds : [],
      moduleIds: scope === 'module' ? moduleIds : [],
      shuffle: true,
    }),
    [length, sources, scope, domainIds, moduleIds]
  );

  const matching = useMemo(
    () => filterQuestions(course.quiz.questions, config),
    [course.quiz.questions, config]
  );

  const attemptSize =
    length === 'full' ? matching.length : Math.min(length, matching.length);

  /* Modules that actually carry quiz questions — Module 8 has none. */
  const quizzableModules = useMemo(
    () =>
      course.modules.filter((module) =>
        course.quiz.questions.some((question) => question.moduleId === module.id)
      ),
    [course]
  );

  function toggle(list, setList, value) {
    setList(
      list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    );
  }

  return (
    <div className="shell view">
      <div className="page-head">
        <h1 className="page-head__title">Practice quiz</h1>
        <p className="page-head__lede">
          {course.quiz.questions.length} questions
          {course.quiz.domains.length > 1
            ? ` across ${course.quiz.domains.length} exam domains`
            : ''}
          . Choose a length and scope, then answer one question at a time with immediate
          feedback.
        </p>
      </div>

      <div className="quiz">
        <fieldset className="card quiz-setup__group">
          <legend className="quiz-setup__legend">Length</legend>
          <div className="quiz-setup__options">
            {LENGTH_OPTIONS.map((option) => (
              <label key={String(option.value)} className="opt">
                <input
                  type="radio"
                  name="quiz-length"
                  checked={length === option.value}
                  onChange={() => setLength(option.value)}
                />
                <span className="opt__text">
                  <span className="opt__title">{option.label}</span>
                  <span className="opt__desc">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {hasSourceChoice ? (
          <fieldset className="card quiz-setup__group">
            <legend className="quiz-setup__legend">Question set</legend>
            <p className="quiz-setup__hint">
              Part A restates each module&rsquo;s own quiz, so it overlaps with the review
              questions in Course Material. Part B is entirely new material.
            </p>
            <div className="quiz-setup__options quiz-setup__options--split">
              {SOURCE_OPTIONS.map((option) => {
                const checked = sources.includes(option.value);
                const isLastChecked = checked && sources.length === 1;
                return (
                  <label
                    key={option.value}
                    className={`opt${isLastChecked ? ' opt--disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isLastChecked}
                      onChange={() => toggle(sources, setSources, option.value)}
                    />
                    <span className="opt__text">
                      <span className="opt__title">{option.label}</span>
                      <span className="opt__desc">{option.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <fieldset className="card quiz-setup__group">
          <legend className="quiz-setup__legend">Scope</legend>
          <div className="quiz-setup__options">
            <label className="opt">
              <input
                type="radio"
                name="quiz-scope"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
              />
              <span className="opt__text">
                <span className="opt__title">Full mixed quiz</span>
                <span className="opt__desc">
                  {hasDomainScope || hasModuleScope
                    ? 'All domains and modules together.'
                    : 'Every question in the bank.'}
                </span>
              </span>
            </label>
            {hasDomainScope ? (
              <label className="opt">
                <input
                  type="radio"
                  name="quiz-scope"
                  checked={scope === 'domain'}
                  onChange={() => setScope('domain')}
                />
                <span className="opt__text">
                  <span className="opt__title">By exam domain</span>
                  <span className="opt__desc">
                    Target one or more of the blueprint&rsquo;s seven domains.
                  </span>
                </span>
              </label>
            ) : null}
            {hasModuleScope ? (
              <label className="opt">
                <input
                  type="radio"
                  name="quiz-scope"
                  checked={scope === 'module'}
                  onChange={() => setScope('module')}
                />
                <span className="opt__text">
                  <span className="opt__title">By module</span>
                  <span className="opt__desc">
                    Practise the modules you have just read.
                  </span>
                </span>
              </label>
            ) : null}
          </div>

          {scope === 'domain' ? (
            <div className="quiz-setup__options quiz-setup__options--split">
              {course.quiz.domains.map((domain) => (
                <label key={domain.id} className="opt">
                  <input
                    type="checkbox"
                    checked={domainIds.includes(domain.id)}
                    onChange={() => toggle(domainIds, setDomainIds, domain.id)}
                  />
                  <span className="opt__text">
                    <span className="opt__title">{domain.title}</span>
                    <span className="opt__desc">
                      {/* Not every course publishes blueprint weights. */}
                      {domain.weight != null ? `${domain.weight}% of the exam · ` : ''}
                      {
                        course.quiz.questions.filter((q) => q.domainId === domain.id)
                          .length
                      }{' '}
                      questions
                    </span>
                  </span>
                </label>
              ))}
            </div>
          ) : null}

          {scope === 'module' ? (
            <div className="quiz-setup__options quiz-setup__options--split">
              {quizzableModules.map((module) => (
                <label key={module.id} className="opt">
                  <input
                    type="checkbox"
                    checked={moduleIds.includes(module.id)}
                    onChange={() => toggle(moduleIds, setModuleIds, module.id)}
                  />
                  <span className="opt__text">
                    <span className="opt__title">
                      Module {module.number}: {module.shortTitle}
                    </span>
                    <span className="opt__desc">
                      {
                        course.quiz.questions.filter((q) => q.moduleId === module.id)
                          .length
                      }{' '}
                      questions
                    </span>
                  </span>
                </label>
              ))}
            </div>
          ) : null}
        </fieldset>

        <div className="card quiz-setup__summary">
          <p className="quiz-setup__count" aria-live="polite">
            <strong>{attemptSize}</strong> question{attemptSize === 1 ? '' : 's'} in this
            attempt
            {length !== 'full' && matching.length > attemptSize
              ? ` (sampled from ${matching.length})`
              : ''}
            .
          </p>
          <button
            type="button"
            className="btn btn--primary"
            disabled={attemptSize === 0}
            onClick={() => onStart(config)}
          >
            Start quiz
            <Icon name="arrowRight" />
          </button>
        </div>

        {attemptSize === 0 ? (
          <p className="blk-callout blk-callout--warning">
            <span className="blk-callout__icon">
              <Icon name="alert" />
            </span>
            <span className="blk-callout__body">
              <span className="blk-callout__text">
                No questions match this scope. Widen the domain, module, or question-set
                selection.
              </span>
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
