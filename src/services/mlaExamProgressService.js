/**
 * mlaExamProgressService.js — attempt persistence for the MLA-C01 practice exams.
 *
 * Signed-in learners get one row per attempt in `mla_exam_attempts`
 * (supabase/migrations/20260821_mla_practice_attempts.sql), so an exam paused on
 * one device resumes on another with the clock where they left it. Signed-out
 * learners get the same shape in localStorage, which keeps the runner itself
 * ignorant of which of the two it is talking to.
 *
 * Every read returns the same attempt object; every write is best-effort and
 * resolves to null on failure rather than throwing, because losing a
 * checkpoint must never interrupt a test in progress.
 */

import { supabase } from '../config/supabaseClient';

const LS_PREFIX = 'mla_exam_attempt';
const LS_HISTORY = 'mla_exam_history';

const localKey = (examSlug, mode) => `${LS_PREFIX}:${examSlug}:${mode}`;

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeLocal = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — the attempt simply won't be resumable */
  }
};

/** Database row (snake_case) → the shape the runner works in. */
const fromRow = (row) => row && ({
  id: row.id,
  examSlug: row.exam_slug,
  mode: row.mode,
  status: row.status,
  answers: row.answers || {},
  flagged: row.flagged || [],
  revealed: row.revealed || [],
  currentIndex: row.current_index || 0,
  secondsRemaining: row.seconds_remaining,
  score: row.score,
  correctCount: row.correct_count,
  passed: row.passed,
  domainBreakdown: row.domain_breakdown || null,
  startedAt: row.started_at,
  updatedAt: row.updated_at,
  completedAt: row.completed_at,
});

const toRow = (attempt) => ({
  answers: attempt.answers || {},
  flagged: attempt.flagged || [],
  revealed: attempt.revealed || [],
  current_index: attempt.currentIndex || 0,
  seconds_remaining: attempt.secondsRemaining ?? null,
  updated_at: new Date().toISOString(),
});

/**
 * The unfinished attempt at this exam in this mode, if there is one.
 *
 * Only the newest counts: an attempt abandoned earlier stays in the table as
 * history rather than competing to be resumed.
 */
export const loadActiveAttempt = async (userId, examSlug, mode) => {
  if (!userId) return readLocal(localKey(examSlug, mode));

  const { data, error } = await supabase
    .from('mla_exam_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('exam_slug', examSlug)
    .eq('mode', mode)
    .eq('status', 'in_progress')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    console.warn('[mla] could not load attempt:', error.message);
    return readLocal(localKey(examSlug, mode));
  }
  return data?.length ? fromRow(data[0]) : null;
};

/** Every unfinished attempt, so the landing screen can mark resumable tests. */
export const loadActiveAttempts = async (userId) => {
  if (!userId) {
    const attempts = [];
    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${LS_PREFIX}:`)) {
          const value = readLocal(key);
          if (value) attempts.push(value);
        }
      }
    } catch {
      /* ignore — an unreadable store just means nothing to resume */
    }
    return attempts;
  }

  const { data, error } = await supabase
    .from('mla_exam_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('updated_at', { ascending: false });

  if (error) {
    console.warn('[mla] could not load attempts:', error.message);
    return [];
  }
  return (data || []).map(fromRow);
};

/** Finished attempts, newest first — the score history under each test. */
export const loadCompletedAttempts = async (userId, limit = 40) => {
  if (!userId) return readLocal(LS_HISTORY) || [];

  const { data, error } = await supabase
    .from('mla_exam_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[mla] could not load history:', error.message);
    return [];
  }
  return (data || []).map(fromRow);
};

/** Open a fresh attempt, discarding whatever unfinished one preceded it. */
export const startAttempt = async (userId, examSlug, mode, { secondsRemaining = null } = {}) => {
  const now = new Date().toISOString();
  const blank = {
    id: null,
    examSlug,
    mode,
    status: 'in_progress',
    answers: {},
    flagged: [],
    revealed: [],
    currentIndex: 0,
    secondsRemaining,
    startedAt: now,
    updatedAt: now,
  };

  if (!userId) {
    writeLocal(localKey(examSlug, mode), blank);
    return blank;
  }

  // An abandoned attempt would otherwise keep showing up as resumable, so
  // retire it before the new one opens.
  await abandonAttempts(userId, examSlug, mode);

  const { data, error } = await supabase
    .from('mla_exam_attempts')
    .insert({
      user_id: userId,
      exam_slug: examSlug,
      mode,
      status: 'in_progress',
      seconds_remaining: secondsRemaining,
    })
    .select()
    .single();

  if (error) {
    console.warn('[mla] could not start attempt:', error.message);
    writeLocal(localKey(examSlug, mode), blank);
    return blank;
  }
  return fromRow(data);
};

/** Checkpoint an attempt in flight. Returns the attempt, or null if it failed. */
export const saveAttempt = async (userId, attempt) => {
  if (!attempt) return null;

  if (!userId || !attempt.id) {
    const next = { ...attempt, updatedAt: new Date().toISOString() };
    writeLocal(localKey(attempt.examSlug, attempt.mode), next);
    return next;
  }

  const { error } = await supabase
    .from('mla_exam_attempts')
    .update(toRow(attempt))
    .eq('id', attempt.id)
    .eq('user_id', userId);

  if (error) {
    console.warn('[mla] could not save attempt:', error.message);
    // Keep a local copy so the work is still resumable on this device.
    writeLocal(localKey(attempt.examSlug, attempt.mode), attempt);
    return null;
  }
  return attempt;
};

/** Close an attempt out with its result. */
export const completeAttempt = async (userId, attempt, result) => {
  const now = new Date().toISOString();
  const finished = {
    ...attempt,
    status: 'completed',
    score: result.score,
    correctCount: result.correctCount,
    passed: result.passed,
    domainBreakdown: result.domainBreakdown,
    completedAt: now,
    updatedAt: now,
  };

  if (!userId || !attempt?.id) {
    writeLocal(localKey(attempt.examSlug, attempt.mode), null);
    const history = readLocal(LS_HISTORY) || [];
    writeLocal(LS_HISTORY, [finished, ...history].slice(0, 40));
    return finished;
  }

  const { error } = await supabase
    .from('mla_exam_attempts')
    .update({
      ...toRow(attempt),
      status: 'completed',
      score: result.score,
      correct_count: result.correctCount,
      passed: result.passed,
      domain_breakdown: result.domainBreakdown,
      completed_at: now,
    })
    .eq('id', attempt.id)
    .eq('user_id', userId);

  if (error) console.warn('[mla] could not complete attempt:', error.message);
  writeLocal(localKey(attempt.examSlug, attempt.mode), null);
  return finished;
};

/** Drop the unfinished attempts at one exam, e.g. when a retake starts. */
export const abandonAttempts = async (userId, examSlug, mode) => {
  if (!userId) {
    writeLocal(localKey(examSlug, mode), null);
    return;
  }
  const { error } = await supabase
    .from('mla_exam_attempts')
    .delete()
    .eq('user_id', userId)
    .eq('exam_slug', examSlug)
    .eq('mode', mode)
    .eq('status', 'in_progress');
  if (error) console.warn('[mla] could not clear attempt:', error.message);
  writeLocal(localKey(examSlug, mode), null);
};
