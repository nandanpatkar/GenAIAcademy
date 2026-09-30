import { LEGACY_KEYS, readRaw, writeRaw } from "../../pages/dsa/prep/lib/store";

/* Visual Learning progress, shared by the main sidebar viewer and the DSA
 * hub. The formats are the viewer's originals so nothing already stored is
 * lost: read lessons are a JSON array of lesson paths, the last lesson a raw
 * path string, the streak `{ day, count }`. Writes go through the hub store so
 * every mounted view hears about them. */

export const VISUAL_KEYS = {
  read: LEGACY_KEYS.visualRead,
  last: LEGACY_KEYS.visualLast,
  streak: LEGACY_KEYS.visualStreak,
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const yesterdayKey = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export function readWatched() {
  const value = readRaw(VISUAL_KEYS.read, []);
  return new Set(Array.isArray(value) ? value : []);
}

/** Mark a lesson watched. Returns true when it was new. */
export function markWatched(path) {
  const read = readWatched();
  if (read.has(path)) return false;
  writeRaw(VISUAL_KEYS.read, [...read, path]);
  return true;
}

export function toggleWatched(path) {
  const read = readWatched();
  if (read.has(path)) read.delete(path); else read.add(path);
  writeRaw(VISUAL_KEYS.read, [...read]);
}

export function readLastLesson() {
  try { return window.localStorage.getItem(VISUAL_KEYS.last) || ""; } catch { return ""; }
}

export function rememberLastLesson(path) {
  try { window.localStorage.setItem(VISUAL_KEYS.last, path); } catch { /* storage unavailable */ }
}

/* Consecutive days on which at least one lesson was opened. Stored as the last
   day seen plus a count, so it needs no history and survives a closed tab. */
export function bumpStreak() {
  const saved = readRaw(VISUAL_KEYS.streak, {}) || {};
  const today = todayKey();
  if (saved.day === today) return saved.count || 1;
  const count = saved.day === yesterdayKey() ? (saved.count || 0) + 1 : 1;
  writeRaw(VISUAL_KEYS.streak, { day: today, count });
  return count;
}

export function readStreak() {
  const saved = readRaw(VISUAL_KEYS.streak, {}) || {};
  if (!saved.day) return 0;
  // A gap of more than a day has already broken it, whatever the stored count.
  return saved.day === todayKey() || saved.day === yesterdayKey() ? saved.count || 0 : 0;
}

export function trackStats(track, read) {
  const items = track.groups.flatMap((group) => group.items);
  const done = items.filter((item) => read.has(item.path)).length;
  return { done, total: items.length, pct: items.length ? done / items.length : 0 };
}

export function groupStats(group, read) {
  const done = group.items.filter((item) => read.has(item.path)).length;
  return { done, total: group.items.length };
}
