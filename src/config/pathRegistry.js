// Who can see which study path.
//
// The mirror of sidebarRegistry's item visibility, for the curriculum paths
// themselves. Paths are not a fixed list — an admin can import a new blueprint
// from the Forge — so there is no registry of ids here, only the rules that
// apply to whatever keys `paths_data` happens to hold.
//
// Overrides live in the same admin-persisted `sidebarConfig` blob as the
// sidebar ones, under `pathVisibility`, so one save covers both.

// Keys inside paths_data that are storage, not curricula: workspace notes,
// saved algorithms, the onboarding answers, and so on. Every surface that
// walks paths_data has to skip them.
export const NON_PATH_KEYS = [
  "workspace",
  "videoIntelligence",
  "saved_algos",
  "genai-roadmap-campusx",
  "onboarding",
  "appearance",
  "leetcode",
  "sidebarConfig",
];

export const isPathKey = (key) => !NON_PATH_KEYS.includes(key);

/** Every curriculum key in a paths_data blob, in insertion order. */
export const listPathKeys = (paths) => Object.keys(paths || {}).filter(isPathKey);

/** 'all' | 'admin'. An explicit override wins; everything else is public. */
export const resolvePathVisibility = (pathKey, { overrides } = {}) =>
  (overrides && overrides[pathKey]) || "all";

/**
 * The paths a given viewer may see.
 *
 * Returns a new object with admin-only paths removed for non-admins, leaving
 * the non-path storage keys alone — callers pass the result to display
 * components, never to anything that writes paths_data back, since a hidden
 * path missing from a saved blob would be a data loss rather than a hidden one.
 */
export const filterVisiblePaths = (paths, { overrides, isAdmin } = {}) => {
  if (!paths) return paths;
  if (isAdmin) return paths;
  const hidden = listPathKeys(paths)
    .filter((key) => resolvePathVisibility(key, { overrides }) === "admin");
  if (!hidden.length) return paths;

  const next = {};
  for (const key of Object.keys(paths)) {
    if (!hidden.includes(key)) next[key] = paths[key];
  }
  return next;
};

/** Display label for a path, falling back to its key. */
export const pathLabel = (path, key) =>
  path?.label || path?.title || path?.id || key;
