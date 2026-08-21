import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, ArrowLeft, Bookmark, BookmarkCheck, Flag,
  PanelLeft, PanelLeftClose, Clock, Info, CheckCircle2, XCircle, Circle,
  Square, CheckSquare, SkipForward, Eye, ChevronDown,
} from "lucide-react";
import { isCorrect, formatClock } from "./scoring";
import { MLA_PASSING_SCORE, MLA_SCORE_MAX } from "../../../data/mlaPracticeExams";

/* The question runner, in three modes.
 *
 *   practice — no clock, and each question can be checked in place, which
 *              reveals the right answer and the full explanation.
 *   exam     — a 210-minute countdown, no way to see an answer, and one
 *              submit at the end.
 *   review   — a finished attempt, read-only, every explanation open.
 *
 * The three share this component because they are the same screen with
 * different affordances; splitting them would mean maintaining the navigator,
 * the filters and the option list three times over.
 *
 * State lives here and is checkpointed upward through `onProgress` (debounced
 * by the parent), so a reload resumes at the same question with the same
 * flags, answers and clock.
 */

const DOMAIN_ALL = "__all__";

const FILTERS = [
  { id: "all", label: "All questions" },
  { id: "unanswered", label: "Unanswered" },
  { id: "answered", label: "Answered" },
  { id: "flagged", label: "Flagged" },
];

/** Question bodies are pre-sanitised at build time (see the build script). */
const Html = ({ html, className }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html || "" }} />
);

export default function MlaExamRunner({
  exam,
  questions,
  mode,
  attempt,
  onProgress,
  onFinish,
  onExit,
}) {
  const isReview = mode === "review";
  const isExam = mode === "exam";
  const isPractice = mode === "practice";

  const [answers, setAnswers] = useState(() => attempt?.answers || {});
  const [flagged, setFlagged] = useState(() => new Set(attempt?.flagged || []));
  const [revealed, setRevealed] = useState(() => new Set(attempt?.revealed || []));
  const [index, setIndex] = useState(() => Math.min(attempt?.currentIndex || 0, Math.max(0, questions.length - 1)));
  const [railOpen, setRailOpen] = useState(true);
  const [filter, setFilter] = useState("all");
  const [domain, setDomain] = useState(DOMAIN_ALL);
  const [filterMenu, setFilterMenu] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [showModeInfo, setShowModeInfo] = useState(false);

  // Exam mode only. `null` in the other two, which is also what keeps the
  // interval below from ever starting there.
  const [secondsLeft, setSecondsLeft] = useState(() =>
    isExam ? (attempt?.secondsRemaining ?? null) : null
  );

  const bodyRef = useRef(null);
  const finishedRef = useRef(false);
  // The clock's interval is created once, so it would otherwise auto-submit the
  // answers as they stood when the timer started. It calls through this ref
  // instead, which every render points at the current `submit`.
  const submitRef = useRef(null);

  const current = questions[index];
  const answeredCount = useMemo(
    () => questions.filter((q) => (answers[q.id] || []).length).length,
    [questions, answers]
  );

  const domains = useMemo(() => {
    const seen = [];
    questions.forEach((q) => { if (!seen.includes(q.domain)) seen.push(q.domain); });
    return seen;
  }, [questions]);

  const visibleQuestions = useMemo(() => questions.filter((q) => {
    if (domain !== DOMAIN_ALL && q.domain !== domain) return false;
    const answered = (answers[q.id] || []).length > 0;
    if (filter === "unanswered") return !answered;
    if (filter === "answered") return answered;
    if (filter === "flagged") return flagged.has(q.id);
    return true;
  }), [questions, answers, flagged, filter, domain]);

  // ── Persistence ──────────────────────────────────────────────────────────
  // One effect, so every state change that matters checkpoints the same way.
  useEffect(() => {
    if (isReview || finishedRef.current) return;
    onProgress?.({
      answers,
      flagged: [...flagged],
      revealed: [...revealed],
      currentIndex: index,
      secondsRemaining: secondsLeft,
    });
  }, [answers, flagged, revealed, index, secondsLeft, isReview, onProgress]);

  // ── Exam clock ───────────────────────────────────────────────────────────
  // Ticks down in real time and submits the attempt itself when it runs out.
  // `Date.now()` rather than a naive decrement, so a backgrounded tab that
  // throttles timers still loses the right amount of time.
  useEffect(() => {
    if (!isExam || secondsLeft === null) return undefined;
    const deadline = Date.now() + secondsLeft * 1000;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        submitRef.current?.(true);
      }
    }, 1000);
    return () => clearInterval(id);
    // Restarting on every tick would re-anchor the deadline each second, so the
    // effect deliberately depends only on what should actually restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExam, secondsLeft === null]);

  // Scrolling the reading column back to the top is what makes paging between
  // questions feel like paging, rather than landing mid-prose.
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [index]);

  useEffect(() => {
    const close = () => setFilterMenu(null);
    if (!filterMenu) return undefined;
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [filterMenu]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const pick = (key) => {
    if (isReview) return;
    // In practice mode a checked question is settled — letting the answer
    // change afterwards would just be a way to fake a streak.
    if (isPractice && revealed.has(current.id)) return;

    setAnswers((prev) => {
      const picked = prev[current.id] || [];
      if (current.multi) {
        const next = picked.includes(key) ? picked.filter((k) => k !== key) : [...picked, key].sort();
        return { ...prev, [current.id]: next };
      }
      return { ...prev, [current.id]: [key] };
    });
  };

  const toggleFlag = (questionId) => {
    if (isReview) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId); else next.add(questionId);
      return next;
    });
  };

  const checkAnswer = () => {
    if (!isPractice) return;
    setRevealed((prev) => new Set(prev).add(current.id));
  };

  const go = (nextIndex) => setIndex(Math.max(0, Math.min(questions.length - 1, nextIndex)));

  const skip = () => {
    // Skipping means moving on without an answer — so if one was already
    // picked it stays picked; this only advances.
    if (index < questions.length - 1) go(index + 1);
    else setConfirmSubmit(true);
  };

  const submit = useCallback((auto = false) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish?.({
      answers,
      flagged: [...flagged],
      revealed: [...revealed],
      currentIndex: index,
      secondsRemaining: isExam ? (secondsLeft ?? 0) : null,
      autoSubmitted: auto,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, flagged, revealed, index, secondsLeft, isExam, onFinish]);

  submitRef.current = submit;

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (event) => {
      if (!current || confirmSubmit) return;
      if (event.target.closest?.("input, textarea, [contenteditable]")) return;
      if (event.key === "ArrowRight") go(index + 1);
      else if (event.key === "ArrowLeft") go(index - 1);
      else if (event.key === "f" && !isReview) toggleFlag(current.id);
      else if (/^[1-9]$/.test(event.key)) {
        const option = current.options[Number(event.key) - 1];
        if (option) pick(option.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current, isReview, revealed, confirmSubmit]);

  const picked = answers[current.id] || [];
  const showAnswer = isReview || (isPractice && revealed.has(current.id));
  const currentRight = showAnswer && isCorrect(current, picked);
  const progressPercent = questions.length ? ((index + 1) / questions.length) * 100 : 0;
  const clockCritical = isExam && secondsLeft !== null && secondsLeft <= 300;
  const clockWarning = isExam && secondsLeft !== null && secondsLeft <= 900 && !clockCritical;

  const modeLabel = isReview ? "Review" : isExam ? "Exam mode" : "Practice mode";

  return (
    <div className={`mla-runner${railOpen ? " mla-runner--rail" : ""}`}>
      {/* ── Question navigator ─────────────────────────────────────────── */}
      <aside className="mla-rail" aria-label="Question navigator">
        <div className="mla-rail-head">
          <div className="mla-rail-filters">
            <div className="mla-select">
              <button
                type="button"
                className="mla-select-btn"
                onClick={(e) => { e.stopPropagation(); setFilterMenu(filterMenu === "filter" ? null : "filter"); }}
              >
                {FILTERS.find((f) => f.id === filter)?.label}
                <ChevronDown size={15} />
              </button>
              {filterMenu === "filter" && (
                <div className="mla-select-menu" onClick={(e) => e.stopPropagation()}>
                  {FILTERS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={option.id === filter ? "is-active" : ""}
                      onClick={() => { setFilter(option.id); setFilterMenu(null); }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mla-select">
              <button
                type="button"
                className="mla-select-btn"
                onClick={(e) => { e.stopPropagation(); setFilterMenu(filterMenu === "domain" ? null : "domain"); }}
              >
                {domain === DOMAIN_ALL ? "All domains" : domain}
                <ChevronDown size={15} />
              </button>
              {filterMenu === "domain" && (
                <div className="mla-select-menu mla-select-menu--wide" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={domain === DOMAIN_ALL ? "is-active" : ""}
                    onClick={() => { setDomain(DOMAIN_ALL); setFilterMenu(null); }}
                  >
                    All domains
                  </button>
                  {domains.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={name === domain ? "is-active" : ""}
                      onClick={() => { setDomain(name); setFilterMenu(null); }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="mla-icon-btn"
            onClick={() => setRailOpen(false)}
            aria-label="Collapse question list"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="mla-rail-list">
          {visibleQuestions.length === 0 && (
            <p className="mla-rail-empty">No questions match this filter.</p>
          )}
          {visibleQuestions.map((question) => {
            const questionIndex = questions.indexOf(question);
            const questionPicked = (answers[question.id] || []).length > 0;
            const right = (isReview || revealed.has(question.id)) && isCorrect(question, answers[question.id]);
            const wrong = (isReview || revealed.has(question.id)) && questionPicked && !right;
            return (
              <button
                key={question.id}
                type="button"
                className={[
                  "mla-rail-item",
                  questionIndex === index ? "is-current" : "",
                  questionPicked ? "is-answered" : "",
                  right ? "is-right" : "",
                  wrong ? "is-wrong" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => go(questionIndex)}
              >
                <span
                  className={`mla-rail-flag${flagged.has(question.id) ? " is-on" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleFlag(question.id); }}
                  role="button"
                  tabIndex={-1}
                  aria-label={flagged.has(question.id) ? "Remove flag" : "Flag question"}
                >
                  {flagged.has(question.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                </span>
                <span className="mla-rail-body">
                  <strong>Question {question.number}</strong>
                  <small>{question.promptText.slice(0, 90)}</small>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mla-rail-foot">
          <span>{answeredCount} of {questions.length} answered</span>
          {flagged.size > 0 && <span className="mla-rail-foot-flag"><Flag size={13} /> {flagged.size}</span>}
        </div>
      </aside>

      {/* ── Question pane ──────────────────────────────────────────────── */}
      <section className="mla-main">
        <header className="mla-topbar">
          <div className="mla-topbar-left">
            {/* Leaving mid-test is a save, not a forfeit — the parent flushes the
                checkpoint on the way out and the card offers a Resume. */}
            <button
              type="button"
              className="mla-icon-btn"
              onClick={onExit}
              aria-label={isReview ? "Back to results" : "Save and leave this test"}
              title={isReview ? "Back to results" : "Save and leave"}
            >
              <ArrowLeft size={18} />
            </button>
            {!railOpen && (
              <button type="button" className="mla-icon-btn" onClick={() => setRailOpen(true)} aria-label="Show question list">
                <PanelLeft size={18} />
              </button>
            )}
            <span className={`mla-mode-badge mla-mode-badge--${isReview ? "review" : isExam ? "exam" : "practice"}`}>
              {modeLabel}
            </span>
            <button
              type="button"
              className="mla-icon-btn mla-icon-btn--sm"
              onClick={() => setShowModeInfo((open) => !open)}
              aria-label="About this mode"
            >
              <Info size={16} />
            </button>
            {showModeInfo && (
              <div className="mla-mode-info">
                {isExam
                  ? `A full ${questions.length}-question paper on a 210-minute clock. Answers stay hidden until you finish; the score is reported on the AWS scale of ${MLA_SCORE_MAX}, with ${MLA_PASSING_SCORE} to pass.`
                  : isReview
                    ? "Your finished attempt, with every explanation open. Nothing here changes the result."
                    : "No clock. Check any answer as you go to see whether you were right and read the full explanation."}
              </div>
            )}
          </div>

          <div className="mla-topbar-right">
            {isExam && secondsLeft !== null && (
              <div className={`mla-clock${clockCritical ? " is-critical" : clockWarning ? " is-warning" : ""}`}>
                <Clock size={16} />
                <span>{formatClock(secondsLeft)}</span>
              </div>
            )}
            {isReview ? (
              <button type="button" className="mla-btn mla-btn--primary" onClick={onExit}>Back to results</button>
            ) : (
              <button type="button" className="mla-btn mla-btn--primary" onClick={() => setConfirmSubmit(true)}>
                Finish test
              </button>
            )}
          </div>
        </header>

        <div className="mla-progress">
          <span className="mla-progress-count">{index + 1}/{questions.length}</span>
          <div className="mla-progress-track">
            <div className="mla-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="mla-progress-domain">{current.domain}</span>
        </div>

        <div className="mla-body" ref={bodyRef}>
          <div className="mla-question">
            <div className="mla-question-head">
              <button
                type="button"
                className={`mla-flag-btn${flagged.has(current.id) ? " is-on" : ""}`}
                onClick={() => toggleFlag(current.id)}
                disabled={isReview}
                title={flagged.has(current.id) ? "Remove flag" : "Flag for review"}
              >
                {flagged.has(current.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
              <h2>Question {current.number}:</h2>
              {current.multi && (
                <span className="mla-multi-hint">Choose {current.correct.length}</span>
              )}
            </div>

            <Html className="mla-prose" html={current.promptHtml} />

            <div className="mla-options" role={current.multi ? "group" : "radiogroup"}>
              {current.options.map((option) => {
                const isPicked = picked.includes(option.key);
                const isRight = current.correct.includes(option.key);
                const state = !showAnswer
                  ? (isPicked ? "picked" : "idle")
                  : isRight ? "right" : isPicked ? "wrong" : "idle";
                const Marker = current.multi
                  ? (isPicked ? CheckSquare : Square)
                  : (isPicked ? CheckCircle2 : Circle);
                return (
                  <button
                    key={option.key}
                    type="button"
                    className={`mla-option is-${state}`}
                    onClick={() => pick(option.key)}
                    disabled={isReview || (isPractice && revealed.has(current.id))}
                    aria-pressed={isPicked}
                  >
                    <span className="mla-option-marker">
                      {showAnswer && isRight ? <CheckCircle2 size={20} />
                        : showAnswer && isPicked ? <XCircle size={20} />
                          : <Marker size={20} />}
                    </span>
                    <span className="mla-option-text">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {isPractice && !revealed.has(current.id) && (
              <button
                type="button"
                className="mla-btn mla-btn--check"
                onClick={checkAnswer}
                disabled={!picked.length}
              >
                <Eye size={16} /> Check answer
              </button>
            )}

            {showAnswer && (
              <div className={`mla-explain${currentRight ? " is-right" : " is-wrong"}`}>
                <div className="mla-explain-head">
                  {currentRight ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  <strong>
                    {currentRight
                      ? "Correct"
                      : picked.length
                        ? `Incorrect — the answer is ${current.correct.join(", ")}`
                        : `Not answered — the answer is ${current.correct.join(", ")}`}
                  </strong>
                  <span className="mla-explain-domain">{current.domain}</span>
                </div>
                <Html className="mla-prose mla-prose--explain" html={current.explanationHtml} />
              </div>
            )}
          </div>
        </div>

        <footer className="mla-footer">
          <button type="button" className="mla-btn mla-btn--ghost" onClick={() => go(index - 1)} disabled={index === 0}>
            <ChevronLeft size={16} /> Back
          </button>

          <div className="mla-footer-right">
            {!isReview && index < questions.length - 1 && !picked.length && (
              <button type="button" className="mla-btn mla-btn--ghost" onClick={skip}>
                <SkipForward size={16} /> Skip question
              </button>
            )}
            {index < questions.length - 1 ? (
              <button type="button" className="mla-btn mla-btn--primary" onClick={() => go(index + 1)}>
                Next <ChevronRight size={16} />
              </button>
            ) : isReview ? (
              <button type="button" className="mla-btn mla-btn--primary" onClick={onExit}>Back to results</button>
            ) : (
              <button type="button" className="mla-btn mla-btn--primary" onClick={() => setConfirmSubmit(true)}>
                Finish test
              </button>
            )}
          </div>
        </footer>
      </section>

      {/* ── Submit confirmation ────────────────────────────────────────── */}
      {confirmSubmit && (
        <div className="mla-modal-scrim" onClick={() => setConfirmSubmit(false)}>
          <div className="mla-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Finish {exam.title}?</h3>
            <p>
              You have answered <strong>{answeredCount}</strong> of {questions.length} questions
              {questions.length - answeredCount > 0 && (
                <> — {questions.length - answeredCount} will be marked incorrect</>
              )}.
              {flagged.size > 0 && <> {flagged.size} {flagged.size === 1 ? "question is" : "questions are"} still flagged.</>}
            </p>
            <div className="mla-modal-actions">
              <button type="button" className="mla-btn mla-btn--ghost" onClick={() => setConfirmSubmit(false)}>
                Keep working
              </button>
              <button type="button" className="mla-btn mla-btn--primary" onClick={() => submit(false)}>
                Finish test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
