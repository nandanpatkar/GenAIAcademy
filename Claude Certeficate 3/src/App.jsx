import { useCallback, useMemo, useRef, useState } from 'react';
import { courses, tracks, getTrackId, loadCourse, unitLabel } from './data/courses.js';
import TopAppBar from './components/TopAppBar.jsx';
import CourseSelection from './components/CourseSelection.jsx';
import CourseHome from './components/CourseHome.jsx';
import CourseMaterial from './components/CourseMaterial.jsx';
import QuizSetup from './components/QuizSetup.jsx';
import QuizProgress from './components/QuizProgress.jsx';
import QuizQuestion from './components/QuizQuestion.jsx';
import QuizResults from './components/QuizResults.jsx';
import MissedQuestionReview from './components/MissedQuestionReview.jsx';
import Chatbot from './components/Chatbot.jsx';
import { buildAttempt } from './utils/quizSelection.js';

/* ===========================================================================
 * STATE PERSISTENCE — read this before adding storage.
 *
 * All progress and quiz state lives in React memory only. Refreshing the page
 * resets completed modules, quiz answers, and scores. This is deliberate for
 * this stage: there is no localStorage, sessionStorage, backend, or cookie.
 *
 * When persistence is wanted, this component is the only place that has to
 * change. Everything below is a plain value in `useState`, so the state layer
 * can be swapped for:
 *   - localStorage / sessionStorage (hydrate initial state, write on change),
 *   - a database or API (load on mount, PATCH on change),
 *   - a state library, if the app grows past this size.
 * Child components receive values and callbacks as props and never touch
 * storage themselves, so none of them need edits when that swap happens.
 * ======================================================================== */

/* Application views. State-based navigation — no router needed at this size,
   and every transition keeps the SPA on one page. */
const VIEW = {
  COURSE_SELECTION: 'course-selection',
  COURSE_HOME: 'course-home',
  COURSE_MATERIAL: 'course-material',
  QUIZ_SETUP: 'quiz-setup',
  QUIZ_ACTIVE: 'quiz-active',
  QUIZ_RESULTS: 'quiz-results',
  QUIZ_REVIEW: 'quiz-review',
};

export default function App() {
  /* --- navigation ------------------------------------------------------ */
  const [view, setView] = useState(VIEW.COURSE_SELECTION);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  /* A parent site can deep-link straight to one track's shelf, e.g. the
     Amazon Connect card on the host page embeds this app with
     ?track=amazon-connect. Filtering to that track this way is permanent for
     the session — intentionally: a track opened this way is a single-purpose
     entry point (its own card on the host page, its own palette and brand in
     the app bar below), not a doorway into the rest of the library. */
  const [trackFilter] = useState(
    () => new URLSearchParams(window.location.search).get('track')
  );

  /* --- course content --------------------------------------------------
   * Hand-written courses ship in the bundle; the Amazon Connect track loads
   * its content on demand, so the open course is held here once resolved.
   * `pendingCourseId` guards against a slow load landing after the learner has
   * moved on to a different card. */
  const [loadedCourse, setLoadedCourse] = useState(null);
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const pendingCourseId = useRef(null);

  /* --- reading progress: courseId -> Set of opened module ids ---------- */
  const [progressByCourse, setProgressByCourse] = useState({});

  /* --- quiz ------------------------------------------------------------ */
  const [quizConfig, setQuizConfig] = useState(null);
  const [attempt, setAttempt] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> chosen option id

  /* Only ever the fully loaded course — a catalog stub has no `modules`, so
     no view is rendered from one. */
  const course = loadedCourse?.id === selectedCourseId ? loadedCourse : null;

  const completedModuleIds = useMemo(
    () => progressByCourse[selectedCourseId] ?? new Set(),
    [progressByCourse, selectedCourseId]
  );

  /* --- derived quiz values --------------------------------------------- */
  const answeredCount = useMemo(
    () => attempt.filter((question) => answers[question.id] != null).length,
    [attempt, answers]
  );

  const correctCount = useMemo(
    () =>
      attempt.filter((question) => answers[question.id] === question.correctOptionId)
        .length,
    [attempt, answers]
  );

  const missedQuestions = useMemo(
    () =>
      attempt.filter(
        (question) =>
          answers[question.id] != null &&
          answers[question.id] !== question.correctOptionId
      ),
    [attempt, answers]
  );

  /* --- actions --------------------------------------------------------- */

  const goToCourseSelection = useCallback(() => {
    pendingCourseId.current = null;
    setLoadingCourseId(null);
    setLoadError(null);
    setView(VIEW.COURSE_SELECTION);
    setSelectedCourseId(null);
    setSelectedModuleId(null);
  }, []);

  const selectCourse = useCallback(async (courseId) => {
    pendingCourseId.current = courseId;
    setLoadError(null);

    const pending = loadCourse(courseId);
    if (!pending) return;

    /* Eager courses resolve synchronously; only show a pending state when the
       content actually has to be fetched. */
    const isAsync = typeof pending.then === 'function';
    if (isAsync) setLoadingCourseId(courseId);

    let resolved;
    try {
      resolved = isAsync ? await pending : pending;
    } catch (error) {
      /* A chunk that fails to arrive must not leave the card stuck on
         "Opening…" with no explanation. */
      if (pendingCourseId.current !== courseId) return;
      setLoadingCourseId(null);
      setLoadError({ courseId, message: error?.message ?? 'The course content could not be loaded.' });
      return;
    }

    /* A newer selection won the race — discard this one. */
    if (pendingCourseId.current !== courseId) return;

    setLoadingCourseId(null);
    setLoadedCourse(resolved);
    setSelectedCourseId(courseId);
    setSelectedModuleId(null);
    setView(VIEW.COURSE_HOME);
  }, []);

  const goToCourseHome = useCallback(() => setView(VIEW.COURSE_HOME), []);

  /* Opening a module marks it read — that is what drives every progress
     indicator in the app. */
  const openModule = useCallback(
    (moduleId) => {
      if (!moduleId || !selectedCourseId) return;
      setSelectedModuleId(moduleId);
      setView(VIEW.COURSE_MATERIAL);
      setProgressByCourse((previous) => {
        const existing = previous[selectedCourseId] ?? new Set();
        if (existing.has(moduleId)) return previous;
        const next = new Set(existing);
        next.add(moduleId);
        return { ...previous, [selectedCourseId]: next };
      });
    },
    [selectedCourseId]
  );

  const openMaterial = useCallback(() => {
    if (!course || course.modules.length === 0) return;
    openModule(selectedModuleId ?? course.modules[0].id);
  }, [course, openModule, selectedModuleId]);

  const openQuizSetup = useCallback(() => {
    setView(VIEW.QUIZ_SETUP);
  }, []);

  const startQuiz = useCallback(
    (config) => {
      if (!course) return;
      setQuizConfig(config);
      setAttempt(buildAttempt(course.quiz.questions, config));
      setQuestionIndex(0);
      setAnswers({});
      setView(VIEW.QUIZ_ACTIVE);
    },
    [course]
  );

  const restartSameQuiz = useCallback(() => {
    if (quizConfig) startQuiz(quizConfig);
  }, [quizConfig, startQuiz]);

  const answerQuestion = useCallback((questionId, optionId) => {
    /* Ignore repeat selections: once answered, the choice is locked. */
    setAnswers((previous) =>
      previous[questionId] != null
        ? previous
        : { ...previous, [questionId]: optionId }
    );
  }, []);

  const advanceQuestion = useCallback(() => {
    setQuestionIndex((index) => {
      if (index >= attempt.length - 1) {
        setView(VIEW.QUIZ_RESULTS);
        return index;
      }
      return index + 1;
    });
  }, [attempt.length]);

  /* --- breadcrumbs ----------------------------------------------------- */
  const crumbs = useMemo(() => {
    if (!course) return [];
    const trail = [{ label: course.title, onClick: goToCourseHome }];

    switch (view) {
      case VIEW.COURSE_MATERIAL: {
        const module = course.modules.find((item) => item.id === selectedModuleId);
        trail.push({ label: 'Course Material', onClick: openMaterial });
        if (module) trail.push({ label: `${unitLabel(course).Cap} ${module.number}` });
        break;
      }
      case VIEW.QUIZ_SETUP:
        trail.push({ label: 'Quiz' });
        break;
      case VIEW.QUIZ_ACTIVE:
        trail.push({ label: 'Quiz', onClick: openQuizSetup });
        trail.push({ label: `Question ${questionIndex + 1}` });
        break;
      case VIEW.QUIZ_RESULTS:
        trail.push({ label: 'Quiz', onClick: openQuizSetup });
        trail.push({ label: 'Results' });
        break;
      case VIEW.QUIZ_REVIEW:
        trail.push({ label: 'Quiz', onClick: openQuizSetup });
        trail.push({ label: 'Results', onClick: () => setView(VIEW.QUIZ_RESULTS) });
        trail.push({ label: 'Missed questions' });
        break;
      default:
        break;
    }
    return trail;
  }, [course, view, selectedModuleId, questionIndex, goToCourseHome, openMaterial, openQuizSetup]);

  /* --- study assistant context -----------------------------------------
   * A short description of what the learner is looking at, sent with every
   * chat turn so "explain this" has a referent. Deliberately a summary, not the
   * module body: it is prompt context on every request, so it stays small.
   * Quiz questions are described without their answer key. */
  const assistantContext = useMemo(() => {
    if (!course) return 'The learner is browsing the course library and has not opened a course yet.';

    const lines = [`Course: ${course.title}`];
    if (course.summary) lines.push(`Course summary: ${course.summary}`);

    const module =
      view === VIEW.COURSE_MATERIAL
        ? course.modules.find((item) => item.id === selectedModuleId) ?? course.modules[0]
        : null;

    if (module) {
      lines.push(`Currently reading ${unitLabel(course).one} ${module.number}: ${module.title}`);
      if (module.summary) lines.push(`Summary: ${module.summary}`);
      if (module.objectives?.length) {
        lines.push(`Learning objectives: ${module.objectives.join(' | ')}`);
      }
    }

    if (view === VIEW.QUIZ_ACTIVE) {
      const question = attempt[questionIndex];
      if (question) {
        lines.push(
          `Currently answering quiz question ${questionIndex + 1} of ${attempt.length}: ` +
            `"${question.question}". Help the learner reason about it — do not simply ` +
            'state which option is correct unless they ask outright.'
        );
      }
    }

    if (view === VIEW.QUIZ_RESULTS || view === VIEW.QUIZ_REVIEW) {
      lines.push(
        `Reviewing quiz results: ${correctCount} correct out of ${attempt.length}.`
      );
    }

    return lines.join('\n');
  }, [course, view, selectedModuleId, attempt, questionIndex, correctCount]);

  /* --- render ---------------------------------------------------------- */

  function renderView() {
    if (view === VIEW.COURSE_SELECTION || !course) {
      return (
        <CourseSelection
          courses={courses}
          tracks={tracks}
          progressByCourse={progressByCourse}
          onSelectCourse={selectCourse}
          loadingCourseId={loadingCourseId}
          loadError={loadError}
          trackFilter={trackFilter}
        />
      );
    }

    switch (view) {
      case VIEW.COURSE_HOME:
        return (
          <CourseHome
            course={course}
            completedModuleIds={completedModuleIds}
            onOpenMaterial={openMaterial}
            onOpenQuiz={openQuizSetup}
            onOpenModule={openModule}
          />
        );

      case VIEW.COURSE_MATERIAL:
        return (
          <CourseMaterial
            course={course}
            currentModuleId={selectedModuleId ?? course.modules[0].id}
            completedModuleIds={completedModuleIds}
            onSelectModule={openModule}
          />
        );

      case VIEW.QUIZ_SETUP:
        return <QuizSetup course={course} onStart={startQuiz} />;

      case VIEW.QUIZ_ACTIVE: {
        const question = attempt[questionIndex];
        if (!question) return <QuizSetup course={course} onStart={startQuiz} />;
        const domain = course.quiz.domains.find((item) => item.id === question.domainId);

        return (
          <div className="shell view">
            <div className="quiz">
              <QuizProgress
                index={questionIndex}
                total={attempt.length}
                correct={correctCount}
                answered={answeredCount}
              />
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={questionIndex + 1}
                domain={domain}
                selectedOptionId={answers[question.id] ?? null}
                onSelect={(optionId) => answerQuestion(question.id, optionId)}
                onNext={advanceQuestion}
                isLast={questionIndex === attempt.length - 1}
              />
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => setView(VIEW.QUIZ_RESULTS)}
              >
                End attempt and see results
              </button>
            </div>
          </div>
        );
      }

      case VIEW.QUIZ_RESULTS:
        return (
          <QuizResults
            course={course}
            attempt={attempt}
            answers={answers}
            missedQuestions={missedQuestions}
            onReviewMissed={() => setView(VIEW.QUIZ_REVIEW)}
            onRestartSame={restartSameQuiz}
            onReconfigure={openQuizSetup}
          />
        );

      case VIEW.QUIZ_REVIEW:
        return (
          <MissedQuestionReview
            questions={missedQuestions}
            answers={answers}
            domains={course.quiz.domains}
            onBack={() => setView(VIEW.QUIZ_RESULTS)}
          />
        );

      default:
        return null;
    }
  }

  /* The open course's track selects the palette. On the library screen no
     course is open, so a deep-linked track filter still carries the palette —
     a learner who arrived at ?track=amazon-connect sees the AWS theme and
     "Amazon Connect" brand immediately, not the default Claude chrome until
     they open a course — and otherwise the default palette applies, with each
     shelf tinting its own cards instead. */
  const activeTrackId = course ? getTrackId(course) : trackFilter ?? 'certifications';
  const isAmazonConnect = activeTrackId === 'amazon-connect';

  return (
    <div className="app" data-track={activeTrackId}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <TopAppBar
        crumbs={crumbs}
        onHome={goToCourseSelection}
        brandIcon={isAmazonConnect ? 'cloud' : 'school'}
        brandLabel={isAmazonConnect ? 'Amazon Connect' : 'Claude Certifications'}
      />

      <main className="app__main" id="main-content">
        {renderView()}
      </main>

      <footer className="footer">
        <p>
          Study workspace · progress is held in memory for this session only and resets
          on refresh.
        </p>
      </footer>

      <Chatbot context={assistantContext} />
    </div>
  );
}
