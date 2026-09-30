// Persistence for AI from Scratch inside the hub. Lesson completion and the
// last-opened lesson use the main sidebar viewer's own keys and formats, so a
// lesson ticked in either place shows as done in both. Quiz results and the
// Today card's "continue" record are the hub's own.
import { grant } from "../habit";
import { useLegacyValue } from "../hooks";
import { KEYS } from "../keys";
import { recordQuizResult } from "../lib/aifs";
import { RULES } from "../lib/rewards";
import { LEGACY_KEYS, readRaw, updateStore, writeRaw, writeStore } from "../lib/store";

export const useAifsProgress = () => useLegacyValue(LEGACY_KEYS.aifsProgress, {});

/** Same toggle as the main viewer: present = done (timestamp), absent = not done. */
export function toggleLessonComplete(slug) {
  const progress = { ...readRaw(LEGACY_KEYS.aifsProgress, {}) };
  if (progress[slug]) delete progress[slug]; else progress[slug] = Date.now();
  writeRaw(LEGACY_KEYS.aifsProgress, progress);
}

export function markLessonDone(slug) {
  const progress = readRaw(LEGACY_KEYS.aifsProgress, {});
  if (!progress[slug]) writeRaw(LEGACY_KEYS.aifsProgress, { ...progress, [slug]: Date.now() });
}

export function rememberLesson({ lesson, phase }) {
  writeStore(KEYS.aifsLast, { slug: lesson.slug, title: lesson.title, phase: phase.title, track: phase.track, at: new Date().toISOString() });
  // The main viewer stores this one as a raw slug, not JSON.
  try { window.localStorage.setItem(LEGACY_KEYS.aifsLast, lesson.slug); } catch { /* storage unavailable */ }
}

/**
 * Record a graded quiz attempt. Passing pays coins once per lesson and marks
 * the lesson complete — a passed quiz is better evidence than a tick.
 */
export function saveQuizResult(lesson, result) {
  let record = null;
  updateStore(KEYS.aifsQuiz, {}, (all) => {
    record = recordQuizResult(all[lesson.slug], result);
    return { ...all, [lesson.slug]: record };
  });
  if (result.passed) {
    grant("aifs_quiz", lesson.slug, RULES.aifs_quiz.points(), { title: lesson.title });
    markLessonDone(lesson.slug);
  }
  return record;
}
