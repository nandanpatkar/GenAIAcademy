// Local-first persistence for the DSA prep sections.
//
// Every collection lives under one `dsa_prep_v1:` prefix so the whole hub can be
// exported, imported or wiped as a unit (Profile › Your data). Writes broadcast a
// `dsa-prep-change` event so any mounted section re-reads the key it cares about;
// the browser's own `storage` event covers other tabs.
//
// Storage can be unavailable (private windows, blocked site data) — reads fall
// back to the default and writes fail quietly, so every section still renders.

export const STORE_PREFIX = "dsa_prep_v1:";
export const STORE_EVENT = "dsa-prep-change";

// Keys the hub wrote before this module existed. They stay where they are
// because other parts of the app (dashboard, Code Lab) read them directly.
export const LEGACY_KEYS = {
  completed: "leetcode_completed",
  bookmarks: "dsa_dashboard_bookmarks",
  submissions: "leetcode_submissions",
  // Shared with the main sidebar's AI from Scratch viewer, which owns their
  // format: progress is a JSON { slug: timestamp } map, last lesson a raw slug.
  aifsProgress: "aifs_progress",
  aifsLast: "aifs_last_lesson",
  // Shared with the main sidebar's Visual Learning viewer, which owns their
  // format: watched lessons are a JSON array of lesson paths, the last lesson
  // a raw path, the streak { day, count }.
  visualRead: "chai_visual_read",
  visualLast: "chai_visual_last_lesson",
  visualStreak: "chai_visual_streak",
  // The SQL & Query Plan Lab's solved challenges, { [id]: true } (SqlLab.jsx).
  sqlLabSolved: "sql_lab_solved",
};

const storage = () => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
};

const emit = (key) => {
  try {
    window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key } }));
  } catch {
    // Non-browser environment.
  }
};

export function readRaw(fullKey, fallback) {
  const store = storage();
  if (!store) return fallback;
  try {
    const raw = store.getItem(fullKey);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeRaw(fullKey, value) {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(fullKey, JSON.stringify(value));
    emit(fullKey);
    return true;
  } catch {
    return false;
  }
}

export const readStore = (key, fallback) => readRaw(STORE_PREFIX + key, fallback);
export const writeStore = (key, value) => writeRaw(STORE_PREFIX + key, value);

/** Read-modify-write against the latest stored value, never a stale React copy. */
export function updateStore(key, fallback, updater) {
  const next = updater(readStore(key, fallback));
  writeStore(key, next);
  return next;
}

export function readLegacyArray(key) {
  const value = readRaw(key, []);
  return Array.isArray(value) ? value : [];
}

export function writeLegacyArray(key, value) {
  writeRaw(key, value);
  // The dashboard and Code Lab listen for this event rather than ours.
  if (key === LEGACY_KEYS.completed) {
    try { window.dispatchEvent(new CustomEvent("leetcode-progress", { detail: { completed: value.length } })); } catch { /* noop */ }
  }
}

/** Every key this hub owns, including the legacy ones, for export/reset. */
export function listOwnedKeys() {
  const store = storage();
  if (!store) return [];
  const keys = [];
  for (let i = 0; i < store.length; i += 1) {
    const key = store.key(i);
    if (!key) continue;
    if (key.startsWith(STORE_PREFIX) || Object.values(LEGACY_KEYS).includes(key)
      || key.startsWith("dsa_workspace_code_") || key.startsWith("dsa_workspace_tabs_") || key.startsWith("leetcode_custom_cases_")) keys.push(key);
  }
  return keys.sort();
}

export function removeKeys(keys) {
  const store = storage();
  if (!store) return;
  keys.forEach((key) => {
    try { store.removeItem(key); } catch { /* noop */ }
  });
  emit("*");
}

let counter = 0;
export const uid = (prefix = "id") => {
  counter = (counter + 1) % 1e6;
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}${counter.toString(36)}`;
};
