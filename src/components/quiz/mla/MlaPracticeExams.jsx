import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  X, Play, Clock, ListChecks, Trophy, Loader2, AlertCircle, GraduationCap,
  BookOpen, Timer, RotateCcw, CheckCircle2, Target, CloudOff,
} from "lucide-react";
import {
  MLA_PRACTICE_EXAMS, MLA_EXAM_MINUTES, MLA_PASSING_SCORE, MLA_SCORE_MAX,
  MLA_CERTIFICATION,
} from "../../../data/mlaPracticeExams";
import {
  loadActiveAttempts, loadCompletedAttempts, startAttempt, saveAttempt,
  completeAttempt, abandonAttempts,
} from "../../../services/mlaExamProgressService";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { gradeAttempt, formatDuration } from "./scoring";
import MlaExamRunner from "./MlaExamRunner";
import MlaExamResults from "./MlaExamResults";
import "../../../styles/MlaPracticeExams.css";

/* AWS MLA-C01 practice exams — three full papers, two ways to sit them.
 *
 * Practice mode has no clock and lets any question be checked in place, with
 * the full explanation. Exam mode is the real thing: a 210-minute countdown, no
 * answers until the end, and a score on the AWS 100–1000 scale against the 720
 * pass mark.
 *
 * This component owns the flow (landing → running → results → review) and the
 * persistence. The runner and the score report are presentational; every write
 * to Supabase goes through mlaExamProgressService, which falls back to
 * localStorage when nobody is signed in.
 *
 * Question bodies are fetched from public/exams/practice/ on demand — the whole
 * bank is a megabyte, and no one sits three papers at once.
 */

const SAVE_DEBOUNCE_MS = 2500;
// Exam mode reports progress once a second as the clock ticks, which would
// re-arm the debounce forever and mean nothing was ever written until the tab
// closed. A checkpoint therefore always lands at least this often.
const SAVE_MAX_INTERVAL_MS = 15000;
const EXAM_SECONDS = MLA_EXAM_MINUTES * 60;

const MODE_COPY = {
  practice: {
    label: "Practice mode",
    icon: BookOpen,
    blurb: "No clock. Check any answer as you go and read the full explanation before moving on.",
  },
  exam: {
    label: "Exam mode",
    icon: Timer,
    blurb: `${MLA_EXAM_MINUTES} minutes, answers hidden until you finish, scored out of ${MLA_SCORE_MAX} with ${MLA_PASSING_SCORE} to pass.`,
  },
};

/** Fetch one paper, refusing the SPA's index.html fallback as a question bank. */
async function fetchExamQuestions(slug) {
  const response = await fetch(`/exams/practice/${slug}.json`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Could not load this practice test (${response.status}).`);
  const payload = await response.json().catch(() => null);
  if (!payload?.questions?.length) throw new Error("This practice test came back empty. Please retry in a moment.");
  return payload.questions;
}

export default function MlaPracticeExams({ onClose }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme !== "light";
  const userId = user?.id || null;

  const [view, setView] = useState("landing");
  const [exam, setExam] = useState(null);
  const [mode, setMode] = useState("practice");
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [result, setResult] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const [activeAttempts, setActiveAttempts] = useState([]);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // The last state the runner reported, held so the debounced save and the
  // unmount flush both write the same thing.
  const pendingRef = useRef(null);
  const saveTimerRef = useRef(null);
  const lastSavedAtRef = useRef(0);
  const attemptRef = useRef(null);
  attemptRef.current = attempt;

  // ── Landing data ─────────────────────────────────────────────────────────
  const refreshAttempts = useCallback(async () => {
    const [active, completed] = await Promise.all([
      loadActiveAttempts(userId),
      loadCompletedAttempts(userId),
    ]);
    setActiveAttempts(active);
    setHistory(completed);
  }, [userId]);

  useEffect(() => { refreshAttempts(); }, [refreshAttempts]);

  const bestByExam = useMemo(() => {
    const best = {};
    history.forEach((entry) => {
      const current = best[entry.examSlug];
      if (!current || (entry.score || 0) > (current.score || 0)) best[entry.examSlug] = entry;
    });
    return best;
  }, [history]);

  const resumableFor = useCallback(
    (slug, wantedMode) => activeAttempts.find((a) => a.examSlug === slug && a.mode === wantedMode) || null,
    [activeAttempts]
  );

  // ── Save pipeline ────────────────────────────────────────────────────────
  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const pending = pendingRef.current;
    const currentAttempt = attemptRef.current;
    if (!pending || !currentAttempt) return;
    pendingRef.current = null;
    lastSavedAtRef.current = Date.now();
    await saveAttempt(userId, { ...currentAttempt, ...pending });
  }, [userId]);

  const handleProgress = useCallback((snapshot) => {
    pendingRef.current = snapshot;
    setAttempt((prev) => (prev ? { ...prev, ...snapshot } : prev));
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (Date.now() - lastSavedAtRef.current >= SAVE_MAX_INTERVAL_MS) {
      flushSave();
      return;
    }
    saveTimerRef.current = setTimeout(() => { flushSave(); }, SAVE_DEBOUNCE_MS);
  }, [flushSave]);

  // A closed tab is the most common way an attempt is abandoned, so checkpoint
  // synchronously-ish on the way out rather than losing up to a debounce window.
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden") flushSave(); };
    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushSave);
    return () => {
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushSave);
      flushSave();
    };
  }, [flushSave]);

  // ── Flow ─────────────────────────────────────────────────────────────────
  const openExam = async (examMeta, wantedMode, { resume = false } = {}) => {
    setBusy(true);
    setError(null);
    try {
      const loaded = await fetchExamQuestions(examMeta.slug);
      let nextAttempt = resume ? resumableFor(examMeta.slug, wantedMode) : null;
      if (!nextAttempt) {
        nextAttempt = await startAttempt(userId, examMeta.slug, wantedMode, {
          secondsRemaining: wantedMode === "exam" ? EXAM_SECONDS : null,
        });
      }
      // An exam attempt saved before this field existed, or one resumed from a
      // practice run, still needs a clock to count down from.
      if (wantedMode === "exam" && (nextAttempt.secondsRemaining ?? null) === null) {
        nextAttempt = { ...nextAttempt, secondsRemaining: EXAM_SECONDS };
      }
      lastSavedAtRef.current = Date.now();
      setQuestions(loaded);
      setExam(examMeta);
      setMode(wantedMode);
      setAttempt(nextAttempt);
      setAutoSubmitted(false);
      setResult(null);
      setView("running");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleFinish = async (snapshot) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    pendingRef.current = null;

    const merged = { ...attempt, ...snapshot };
    const graded = gradeAttempt(questions, merged.answers || {});

    const elapsed = mode === "exam"
      ? EXAM_SECONDS - (merged.secondsRemaining ?? 0)
      : Math.max(0, Math.round((Date.now() - new Date(merged.startedAt || Date.now()).getTime()) / 1000));

    setElapsedSeconds(elapsed);
    setAutoSubmitted(Boolean(snapshot.autoSubmitted));
    setAttempt(merged);
    setResult(graded);
    setView("results");

    await completeAttempt(userId, merged, {
      score: graded.score,
      correctCount: graded.correctCount,
      passed: graded.passed,
      domainBreakdown: graded.domainBreakdown,
    });
    refreshAttempts();
  };

  const backToLanding = async () => {
    await flushSave();
    setView("landing");
    setQuestions([]);
    setAttempt(null);
    setResult(null);
    refreshAttempts();
  };

  const retake = async () => {
    if (!exam) return;
    await abandonAttempts(userId, exam.slug, mode);
    openExam(exam, mode);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  if (view === "running" || view === "review") {
    return (
      <div className="mla-root" data-theme={dark ? "dark" : "light"}>
        <MlaExamRunner
          exam={exam}
          questions={questions}
          mode={view === "review" ? "review" : mode}
          attempt={attempt}
          onProgress={view === "review" ? undefined : handleProgress}
          onFinish={handleFinish}
          onExit={view === "review" ? () => setView("results") : backToLanding}
        />
      </div>
    );
  }

  if (view === "results" && result) {
    return (
      <div className="mla-root" data-theme={dark ? "dark" : "light"}>
        <MlaExamResults
          exam={exam}
          result={result}
          mode={mode}
          elapsedSeconds={elapsedSeconds}
          autoSubmitted={autoSubmitted}
          onReview={() => setView("review")}
          onRetake={retake}
          onExit={backToLanding}
        />
      </div>
    );
  }

  const totalQuestions = MLA_PRACTICE_EXAMS.reduce((sum, entry) => sum + entry.questionCount, 0);

  return (
    <div className="mla-root" data-theme={dark ? "dark" : "light"}>
      <div className="mla-landing">
        <header className="mla-hero">
          <div className="mla-hero-copy">
            <span className="mla-eyebrow"><GraduationCap size={15} /> {MLA_CERTIFICATION.code}</span>
            <h1>{MLA_CERTIFICATION.name}</h1>
            <p>
              {MLA_PRACTICE_EXAMS.length} full-length practice papers, {totalQuestions} questions,
              every one with a written explanation. Sit them untimed to learn, or on the clock to
              find out where you actually stand.
            </p>
            <div className="mla-hero-facts">
              <span><ListChecks size={15} /> 65 questions per paper</span>
              <span><Clock size={15} /> {MLA_EXAM_MINUTES} minutes in exam mode</span>
              <span><Trophy size={15} /> {MLA_PASSING_SCORE} of {MLA_SCORE_MAX} to pass</span>
            </div>
          </div>
          {onClose && (
            <button type="button" className="mla-icon-btn" onClick={onClose} aria-label="Close practice exams">
              <X size={20} />
            </button>
          )}
        </header>

        <div className="mla-mode-cards">
          {Object.entries(MODE_COPY).map(([id, copy]) => {
            const Icon = copy.icon;
            return (
              <div key={id} className={`mla-mode-card mla-mode-card--${id}`}>
                <Icon size={18} />
                <div>
                  <strong>{copy.label}</strong>
                  <p>{copy.blurb}</p>
                </div>
              </div>
            );
          })}
        </div>

        {!userId && (
          <p className="mla-signin-note">
            <CloudOff size={15} />
            You are not signed in, so progress is kept in this browser only. Sign in to resume an
            attempt on another device.
          </p>
        )}

        {error && (
          <p className="mla-error"><AlertCircle size={16} /> {error}</p>
        )}

        <div className="mla-exam-grid">
          {MLA_PRACTICE_EXAMS.map((entry) => {
            const best = bestByExam[entry.slug];
            const practiceResume = resumableFor(entry.slug, "practice");
            const examResume = resumableFor(entry.slug, "exam");
            const answeredIn = (a) => (a ? Object.values(a.answers || {}).filter((v) => v.length).length : 0);

            return (
              <article key={entry.slug} className="mla-exam-card">
                <div className="mla-exam-card-head">
                  <h2>{entry.title}</h2>
                  {best && (
                    <span className={`mla-best${best.passed ? " is-pass" : ""}`}>
                      {best.passed ? <Trophy size={13} /> : <Target size={13} />}
                      Best {best.score}
                    </span>
                  )}
                </div>

                <div className="mla-exam-meta">
                  <span>{entry.questionCount} questions</span>
                  <span>{entry.multiSelectCount} multi-select</span>
                </div>

                <ul className="mla-domain-list">
                  {entry.domains.map((domainEntry) => (
                    <li key={domainEntry.name}>
                      <span>{domainEntry.name}</span>
                      <strong>{domainEntry.count}</strong>
                    </li>
                  ))}
                </ul>

                {(practiceResume || examResume) && (
                  <div className="mla-resume-strip">
                    {[["practice", practiceResume], ["exam", examResume]]
                      .filter(([, a]) => a)
                      .map(([resumeMode, a]) => (
                        <button
                          key={resumeMode}
                          type="button"
                          className="mla-resume"
                          onClick={() => openExam(entry, resumeMode, { resume: true })}
                          disabled={busy}
                        >
                          <RotateCcw size={14} />
                          <span>
                            Resume {resumeMode} — {answeredIn(a)}/{entry.questionCount} answered
                            {resumeMode === "exam" && a.secondsRemaining != null && (
                              <> · {formatDuration(a.secondsRemaining)} left</>
                            )}
                          </span>
                        </button>
                      ))}
                  </div>
                )}

                <div className="mla-exam-actions">
                  <button
                    type="button"
                    className="mla-btn mla-btn--ghost"
                    onClick={() => openExam(entry, "practice")}
                    disabled={busy}
                  >
                    <BookOpen size={16} /> Practice mode
                  </button>
                  <button
                    type="button"
                    className="mla-btn mla-btn--primary"
                    onClick={() => openExam(entry, "exam")}
                    disabled={busy}
                  >
                    <Play size={16} /> Exam mode
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {history.length > 0 && (
          <section className="mla-history">
            <h3>Your attempts</h3>
            <table>
              <thead>
                <tr>
                  <th>Test</th><th>Mode</th><th>Score</th><th>Correct</th><th>Result</th><th>Finished</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 12).map((entry) => {
                  const meta = MLA_PRACTICE_EXAMS.find((e) => e.slug === entry.examSlug);
                  return (
                    <tr key={entry.id || `${entry.examSlug}-${entry.completedAt}`}>
                      <td>{meta?.title || entry.examSlug}</td>
                      <td className="mla-history-mode">{entry.mode}</td>
                      <td><strong>{entry.score}</strong></td>
                      <td>{entry.correctCount}/{meta?.questionCount || 65}</td>
                      <td>
                        <span className={`mla-history-verdict${entry.passed ? " is-pass" : ""}`}>
                          {entry.passed ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                          {entry.passed ? "Pass" : "Below 720"}
                        </span>
                      </td>
                      <td>{entry.completedAt ? new Date(entry.completedAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}

        {busy && (
          <div className="mla-busy"><Loader2 className="mla-spin" size={18} /> Loading questions…</div>
        )}
      </div>
    </div>
  );
}
