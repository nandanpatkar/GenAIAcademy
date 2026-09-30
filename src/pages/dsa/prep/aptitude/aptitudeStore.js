// Aptitude persistence: per-topic practice results and timed-test sessions.
// A session stores its questions, scoring policy and absolute deadline when it
// starts, so a refresh, a closed tab or a changed default can never alter the
// clock or the marking of a test already in progress.
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { DEFAULT_POLICY, buildMock, scoreSession } from "../lib/aptitude";
import { uid, updateStore } from "../lib/store";
import { grant } from "../habit";
import { RULES } from "../lib/rewards";

const EMPTY = { practice: {}, sessions: [] };
const MAX_SESSIONS = 25;

export const useAptitude = () => useStore(KEYS.aptitude, EMPTY);

export function recordPracticeSet(topicId, setNumber, correct, total) {
  updateStore(KEYS.aptitude, EMPTY, (state) => {
    const topic = state.practice[topicId] || { sets: {} };
    const previous = topic.sets[setNumber];
    return {
      ...state,
      practice: {
        ...state.practice,
        [topicId]: { ...topic, sets: { ...topic.sets, [setNumber]: { correct, total, best: Math.max(previous?.best || 0, correct), attempts: (previous?.attempts || 0) + 1, finishedAt: new Date().toISOString() } } },
      },
    };
  });
}

/** Minutes allowed: the questions' own pacing estimates, rounded up to a whole minute. */
export const mockMinutes = (questions) => Math.max(5, Math.ceil(questions.reduce((sum, question) => sum + question.seconds, 0) / 60));

export function startMock(area, count) {
  const seed = uid("mock");
  const questions = buildMock(area, seed, count);
  const now = Date.now();
  const session = {
    id: seed,
    area,
    questions,
    policy: { ...DEFAULT_POLICY },
    startedAt: new Date(now).toISOString(),
    deadline: now + mockMinutes(questions) * 60000,
    status: "in_progress",
    answers: {},
    current: 0,
    revision: 0,
    lastSavedAt: new Date(now).toISOString(),
  };
  updateStore(KEYS.aptitude, EMPTY, (state) => ({ ...state, sessions: [session, ...state.sessions].slice(0, MAX_SESSIONS) }));
  return session.id;
}

/** Autosave: every change bumps the revision and stamps the save time. */
export function patchSession(id, updater) {
  updateStore(KEYS.aptitude, EMPTY, (state) => ({
    ...state,
    sessions: state.sessions.map((session) => {
      if (session.id !== id || session.status !== "in_progress") return session;
      // The deadline is authoritative: late edits are dropped, not counted.
      if (Date.now() > session.deadline) return session;
      const next = updater(session);
      return { ...next, revision: session.revision + 1, lastSavedAt: new Date().toISOString() };
    }),
  }));
}

/**
 * Submit (or expire) a session and grade it with the policy frozen at start.
 * Answers saved after the deadline don't count — the grade uses what was
 * saved when time ran out.
 */
export function finishSession(id, reason = "submitted") {
  let finished = null;
  updateStore(KEYS.aptitude, EMPTY, (state) => ({
    ...state,
    sessions: state.sessions.map((session) => {
      if (session.id !== id || session.status !== "in_progress") return session;
      finished = {
        ...session,
        status: reason,
        submittedAt: new Date(Math.min(Date.now(), session.deadline)).toISOString(),
        result: scoreSession(session.questions, session.answers, session.policy),
      };
      return finished;
    }),
  }));
  if (finished) grant("mock_complete", id, RULES.mock_complete.points(), { area: finished.area, score: finished.result.score });
  return finished;
}
