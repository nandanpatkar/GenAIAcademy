import React from "react";
import {
  Trophy, XCircle, CheckCircle2, Circle, Clock, RotateCcw, ListChecks,
  ArrowLeft, Timer,
} from "lucide-react";
import { questionsNeededToPass, formatDuration } from "./scoring";
import {
  MLA_PASSING_SCORE, MLA_SCORE_MAX, MLA_SCORE_MIN,
} from "../../../data/mlaPracticeExams";

/* The score report for a finished attempt.
 *
 * The headline is the AWS-scale score against the 720 pass mark, because that
 * is the number the real result letter carries. Underneath it, the raw count
 * and the per-domain split, which are the parts that actually tell a learner
 * what to go back and study.
 */

const DIAL_CIRCUMFERENCE = 2 * Math.PI * 78;

export default function MlaExamResults({ exam, result, mode, elapsedSeconds, autoSubmitted, onReview, onRetake, onExit }) {
  const { score, passed, correctCount, incorrectCount, skippedCount, total, percent, domainBreakdown } = result;

  // The dial fills across the reported range, not from zero — a 100 is the
  // floor of the scale, so drawing it as "10% of the way there" would be wrong.
  const span = MLA_SCORE_MAX - MLA_SCORE_MIN;
  const filled = Math.max(0, Math.min(1, (score - MLA_SCORE_MIN) / span));
  const passMarkAngle = ((MLA_PASSING_SCORE - MLA_SCORE_MIN) / span) * 360;
  const needed = questionsNeededToPass(total);

  return (
    <div className="mla-results">
      <div className="mla-results-inner">
        <button type="button" className="mla-btn mla-btn--ghost mla-results-back" onClick={onExit}>
          <ArrowLeft size={16} /> All practice tests
        </button>

        <header className={`mla-verdict${passed ? " is-pass" : " is-fail"}`}>
          <div className="mla-dial">
            <svg viewBox="0 0 176 176" aria-hidden="true">
              <circle className="mla-dial-track" cx="88" cy="88" r="78" />
              {/* A round cap on a zero-length arc still paints a dot, which at
                  the floor of the scale would read as a stray mark. */}
              {filled > 0.004 && (
                <circle
                  className="mla-dial-fill"
                  cx="88" cy="88" r="78"
                  strokeDasharray={`${filled * DIAL_CIRCUMFERENCE} ${DIAL_CIRCUMFERENCE}`}
                />
              )}
              {/* The 720 tick, so the score reads against the bar it had to clear. */}
              <line
                className="mla-dial-mark"
                x1="88" y1="4" x2="88" y2="20"
                transform={`rotate(${passMarkAngle} 88 88)`}
              />
            </svg>
            <div className="mla-dial-value">
              <strong>{score}</strong>
              <small>of {MLA_SCORE_MAX}</small>
            </div>
          </div>

          <div className="mla-verdict-copy">
            <span className="mla-verdict-badge">
              {passed ? <><Trophy size={16} /> Pass</> : <><XCircle size={16} /> Not yet</>}
            </span>
            <h2>{exam.title}</h2>
            <p>
              {passed
                ? `You scored ${score}, clearing the ${MLA_PASSING_SCORE} pass mark with ${correctCount} of ${total} correct.`
                : `You scored ${score}. The pass mark is ${MLA_PASSING_SCORE} — about ${needed} of ${total} questions right, and you had ${correctCount}.`}
            </p>
            {autoSubmitted && (
              <p className="mla-verdict-note">
                <Timer size={14} /> Time ran out, so the paper was submitted where you left it.
              </p>
            )}
            <div className="mla-verdict-actions">
              <button type="button" className="mla-btn mla-btn--primary" onClick={onReview}>
                <ListChecks size={16} /> Review answers
              </button>
              <button type="button" className="mla-btn mla-btn--ghost" onClick={onRetake}>
                <RotateCcw size={16} /> Retake in {mode === "exam" ? "exam" : "practice"} mode
              </button>
            </div>
          </div>
        </header>

        <div className="mla-stat-grid">
          <div className="mla-stat is-right">
            <CheckCircle2 size={18} /><strong>{correctCount}</strong><span>Correct</span>
          </div>
          <div className="mla-stat is-wrong">
            <XCircle size={18} /><strong>{incorrectCount}</strong><span>Incorrect</span>
          </div>
          <div className="mla-stat is-skipped">
            <Circle size={18} /><strong>{skippedCount}</strong><span>Unanswered</span>
          </div>
          <div className="mla-stat">
            <Clock size={18} /><strong>{elapsedSeconds ? formatDuration(elapsedSeconds) : "—"}</strong><span>Time taken</span>
          </div>
          <div className="mla-stat">
            <Trophy size={18} /><strong>{percent}%</strong><span>Raw score</span>
          </div>
        </div>

        <section className="mla-domains">
          <h3>By exam domain</h3>
          <p className="mla-domains-hint">
            The domain a question belongs to on the MLA-C01 blueprint. Whichever bar is shortest is
            where the next study session belongs.
          </p>
          {domainBreakdown.map((domain) => (
            <div key={domain.name} className="mla-domain">
              <div className="mla-domain-head">
                <span>{domain.name}</span>
                <strong>{domain.correct}/{domain.total}</strong>
              </div>
              <div className="mla-domain-track">
                <div
                  className={`mla-domain-fill${domain.percent >= 70 ? " is-strong" : domain.percent >= 50 ? " is-mid" : " is-weak"}`}
                  style={{ width: `${domain.percent}%` }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
