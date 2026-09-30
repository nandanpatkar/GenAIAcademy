// Versioned study tracks over the Code Lab catalog.
//
// Shape: Track → ordered Module (catalog category) → Section (pattern) → Item
// (problem). Each item is either required or optional, and progress is always
// computed against the *required* items of the version the learner enrolled in,
// so a track that later gains problems never silently moves someone's
// percentage — the research flagged inconsistent denominators as a real
// problem in the reference product (495 total vs 83/288/109 by difficulty).

import { difficultyKey, estimateMinutes } from "./problems.js";

const byDifficulty = (level) => (problem) => difficultyKey(problem) === level;

/**
 * Track definitions. `select(problems, pattern)` returns the pattern's items as
 * `{ slug, required }` in catalog order. Bump `version` whenever a selection
 * rule changes; enrollments keep the snapshot they started with.
 */
export const TRACK_DEFS = [
  {
    id: "zero-to-hero",
    version: 1,
    title: "Zero to Hero 450",
    level: "All levels",
    summary: "The complete pattern-wise sheet: every Code Lab problem, module by module.",
    audience: "You want one exhaustive path from arrays to dynamic programming.",
    select: (list) => list.map((problem) => ({ slug: problem.slug, required: true })),
  },
  {
    id: "foundations",
    version: 1,
    title: "Foundations",
    level: "Beginner",
    summary: "Easy problems only, so each pattern clicks before difficulty rises.",
    audience: "You are new to DSA or returning after a long break.",
    select: (list) => list.filter(byDifficulty("easy")).map((problem) => ({ slug: problem.slug, required: true })),
  },
  {
    id: "pattern-sprint",
    version: 1,
    title: "Pattern Sprint",
    level: "Intermediate",
    summary: "Two problems per pattern — the shortest route to recognising every pattern once.",
    audience: "You have a few weeks and want breadth before depth.",
    select: (list) => list.slice(0, 2).map((problem) => ({ slug: problem.slug, required: true })),
  },
  {
    id: "interview-refresher",
    version: 1,
    title: "Interview Refresher",
    level: "Advanced",
    summary: "Medium and hard problems. One of each per pattern is required; the rest are optional stretch work.",
    audience: "You know the patterns and want interview-level repetitions.",
    select: (list) => {
      const pool = list.filter((problem) => ["medium", "hard"].includes(difficultyKey(problem)));
      const firstMedium = pool.find(byDifficulty("medium"));
      const firstHard = pool.find(byDifficulty("hard"));
      return pool.map((problem) => ({ slug: problem.slug, required: problem === firstMedium || problem === firstHard }));
    },
  },
];

export const trackDefById = (id) => TRACK_DEFS.find((def) => def.id === id) || null;

/** Materialise a track definition against the catalog. */
export function buildTrack(def, categories, problemBySlug) {
  // Some problems are filed under several patterns. Only the first occurrence
  // is a tracked item; later ones stay visible as cross-references (`repeat`)
  // but never count, so one solve can't be tallied twice.
  const seen = new Set();
  const modules = categories.map((category) => {
    const sections = category.patterns.map((pattern) => {
      const list = [...new Set(pattern.problems)].map((slug) => problemBySlug.get(slug)).filter(Boolean);
      const items = def.select(list, pattern).map((item) => {
        if (seen.has(item.slug)) return { ...item, required: false, repeat: true };
        seen.add(item.slug);
        return item;
      });
      return {
        id: `${category.slug}/${pattern.slug}`,
        title: pattern.title,
        subtitle: pattern.subtitle || "",
        items,
      };
    }).filter((section) => section.items.length);
    return { id: category.slug, title: category.title, subtitle: category.subtitle || "", sections };
  }).filter((module) => module.sections.length);

  const items = modules.flatMap((module) => module.sections.flatMap((section) => section.items)).filter((item) => !item.repeat);
  const required = items.filter((item) => item.required);
  const counts = { total: items.length, required: required.length, optional: items.length - required.length, easy: 0, medium: 0, hard: 0, other: 0 };
  let minutes = 0;
  required.forEach((item) => {
    const problem = problemBySlug.get(item.slug);
    const level = difficultyKey(problem);
    if (level in counts && level !== "total") counts[level] += 1; else counts.other += 1;
    minutes += estimateMinutes(problem);
  });

  return {
    id: def.id,
    version: def.version,
    title: def.title,
    level: def.level,
    summary: def.summary,
    audience: def.audience,
    modules,
    counts, // easy + medium + hard + other === required, always.
    estimatedMinutes: minutes,
    requiredSlugs: required.map((item) => item.slug),
  };
}

export function buildAllTracks(categories, problemBySlug) {
  return TRACK_DEFS.map((def) => buildTrack(def, categories, problemBySlug));
}

/** Frozen snapshot recorded on enrollment. */
export function enrollmentFor(track, now = new Date().toISOString()) {
  return { trackId: track.id, version: track.version, requiredSlugs: [...track.requiredSlugs], enrolledAt: now };
}

/**
 * Learning state of one item, most advanced first:
 * - recalled: solved, then re-solved or graded "good" on a spaced review
 * - passed: an accepted submission (or manually marked complete)
 * - attempted: at least one submission that was not accepted
 * - new
 */
export function itemStatus(slug, { completed, attempted, recalled }) {
  if (recalled?.has(slug)) return "recalled";
  if (completed?.has(slug)) return "passed";
  if (attempted?.has(slug)) return "attempted";
  return "new";
}

export const isDoneStatus = (status) => status === "passed" || status === "recalled";

/** Progress against an enrollment snapshot (or the live track when not enrolled). */
export function trackProgress(track, enrollment, state) {
  const requiredSlugs = enrollment ? enrollment.requiredSlugs : track.requiredSlugs;
  const done = requiredSlugs.filter((slug) => isDoneStatus(itemStatus(slug, state))).length;
  const optional = track.modules.flatMap((module) => module.sections.flatMap((section) => section.items)).filter((item) => !item.required && !item.repeat);
  const optionalDone = optional.filter((item) => isDoneStatus(itemStatus(item.slug, state))).length;
  return {
    done,
    total: requiredSlugs.length,
    optionalDone,
    optionalTotal: optional.length,
    percent: requiredSlugs.length ? Math.round((done / requiredSlugs.length) * 100) : 0,
    outdated: Boolean(enrollment && enrollment.version !== track.version),
  };
}

/** Done/total for a module or section, counting required items only. */
export function groupProgress(items, state) {
  const required = items.filter((item) => item.required);
  return {
    done: required.filter((item) => isDoneStatus(itemStatus(item.slug, state))).length,
    total: required.length,
  };
}

/** First required item not yet done, in track order — "continue where you left off". */
export function nextItem(track, state) {
  for (const module of track.modules) {
    for (const section of module.sections) {
      const item = section.items.find((entry) => entry.required && !isDoneStatus(itemStatus(entry.slug, state)));
      if (item) return { item, module, section };
    }
  }
  return null;
}
