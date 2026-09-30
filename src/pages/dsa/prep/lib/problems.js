// Shared views over a Code Lab catalog problem. Pure — callers pass the problem.

export const categoryOf = (problem) => problem?.patterns?.[0]?.category || problem?.topicTags?.[0] || "DSA";
export const patternOf = (problem) => problem?.patterns?.[0]?.pattern || "Core concepts";
export const difficultyKey = (problem) => String(problem?.difficulty || "unknown").toLowerCase();

export const sourceLabel = (source) => ({ leetcode: "LeetCode", authored: "Code Lab", gfg: "GeeksforGeeks" }[source] || source || "Code Lab");

// Coins per accepted problem. Same weights the global dashboard has always
// used, so the rewards ledger and the dashboard agree on a problem's value.
export const COIN_VALUE = { easy: 10, medium: 20, hard: 40 };
export const coinsFor = (problem) => COIN_VALUE[difficultyKey(problem)] ?? 10;

// Planning estimates in minutes. Deliberately round numbers: the planner
// scales them by the learner's own pace once there is history to learn from.
export const ESTIMATED_MINUTES = { easy: 25, medium: 40, hard: 60 };
export const estimateMinutes = (problem) => ESTIMATED_MINUTES[difficultyKey(problem)] ?? 40;

/** Stable 32-bit FNV-1a hash — used for deterministic picks and seeds. */
export function hashString(value) {
  let hash = 0x811c9dc5;
  const text = String(value);
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Small seeded PRNG (mulberry32). Same seed → same sequence, everywhere. */
export function seededRandom(seed) {
  let state = (typeof seed === "number" ? seed : hashString(seed)) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(items, seed) {
  const random = seededRandom(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
