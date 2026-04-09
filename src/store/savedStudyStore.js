// ─── Saved Study Sets Store ────────────────────────────────────────────────
// Persists AI Study Suite results (quiz / flashcards / mindmap / summary)
// to localStorage so they survive page reloads.

const STORAGE_KEY = "genai-saved-study-sets";

/**
 * Returns all saved sets, newest first.
 * @returns {Array}
 */
export function getSavedSets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new study set. Returns the newly created entry.
 * @param {"quiz"|"flashcards"|"mindmap"|"summary"} mode
 * @param {string} moduleTitle
 * @param {object} data  – the raw result from generateStudyContent
 * @returns {object}
 */
export function saveStudySet(mode, moduleTitle, data) {
  const sets = getSavedSets();
  const entry = {
    id: `ss-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    savedAt: new Date().toISOString(),
    mode,
    moduleTitle,
    data,
  };
  const updated = [entry, ...sets];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return entry;
}

/**
 * Deletes a saved set by id.
 * @param {string} id
 */
export function deleteSavedSet(id) {
  const sets = getSavedSets().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
}

/**
 * Clears all saved sets.
 */
export function clearAllSavedSets() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Returns all saved sets for a specific module title.
 * @param {string} moduleTitle
 * @returns {Array}
 */
export function getSetsForModule(moduleTitle) {
  return getSavedSets().filter((s) => s.moduleTitle === moduleTitle);
}

/** Human-readable mode labels */
export const MODE_LABELS = {
  quiz:       "Quiz",
  flashcards: "Flashcards",
  mindmap:    "Mind Map",
  summary:    "Summary",
};
