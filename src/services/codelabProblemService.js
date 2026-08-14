/**
 * codelabProblemService.js — one way to reach a Code Lab problem.
 *
 * Problem payloads (statement, starter code, reference solution, sample tests)
 * are served from /codelab/problems/<slug>.json rather than bundled, so the
 * catalog index stays small. Both the Code Lab and the Pattern Wise DSA study
 * path read them through here and share the cache.
 *
 * `findCodelabProblem` resolves a study-path topic to its Code Lab problem via
 * the generated map at /codelab/topicMap.json (see
 * scripts/build_codelab_topic_map.mjs). That map is fetched on first use, so
 * its ~150 KB only loads for someone actually opening a DSA topic.
 */

const payloadCache = new Map();

/** Fetch a problem payload by slug. Concurrent callers share one request. */
export function loadCodelabProblem(slug) {
  if (payloadCache.has(slug)) return payloadCache.get(slug);
  const request = fetch(`/codelab/problems/${slug}.json`)
    .then(response => {
      if (!response.ok) throw new Error(`Could not load this problem (HTTP ${response.status}).`);
      return response.json();
    })
    .catch(error => {
      payloadCache.delete(slug);
      throw error;
    });
  payloadCache.set(slug, request);
  return request;
}

// Every statement opens with a metadata block — title, difficulty, patterns,
// LeetCode URL, topics — then a rule, then the problem itself. A surface that
// renders those facts as its own chrome wants the body only. Anything else in
// the preamble (the premium-restatement notice, say) is kept.
const METADATA_LINE = /^\*\*(Difficulty|Patterns|LeetCode|Topics|Acceptance)[:*]/;

export function codelabStatementBody(statement = "") {
  const separator = String(statement).indexOf("\n---\n");
  if (separator === -1) return String(statement);
  const preamble = String(statement)
    .slice(0, separator)
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("# ") && !METADATA_LINE.test(line));
  const body = String(statement).slice(separator + "\n---\n".length).trim();
  return [...preamble, body].join("\n\n");
}

let topicMapPromise = null;
/**
 * The topic→problem pairings, fetched like the payloads rather than bundled:
 * ~150 KB that only a DSA topic needs, and it stays a plain cacheable JSON
 * file instead of a JS chunk.
 */
const loadTopicMap = () => {
  topicMapPromise ||= fetch("/codelab/topicMap.json")
    .then(response => {
      if (!response.ok) throw new Error(`Could not load the problem map (HTTP ${response.status}).`);
      return response.json();
    })
    .catch(error => {
      topicMapPromise = null;
      throw error;
    });
  return topicMapPromise;
};

// Must stay in step with the normalisation in scripts/build_codelab_topic_map.mjs.
const norm = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Curriculum module titles carry a progress suffix the map does not: "KMP (0/4)". */
const patternTitle = (title = "") => String(title).replace(/\s*\(\d+\s*\/\s*\d+\)\s*$/, "").trim();

/**
 * The Code Lab problem behind a study-path topic, or null when the topic has
 * no counterpart (a user-added topic, say).
 *
 * @param {{category?: string, pattern?: string, title?: string}} topic
 *        category = node title, pattern = module title, title = topic title.
 * @returns {Promise<object|null>} catalog metadata plus `slug`.
 */
export async function findCodelabProblem({ category, pattern, title } = {}) {
  if (!title) return null;
  const map = await loadTopicMap();
  const topicKey = norm(title);

  const exact = map.entries?.[`${norm(category)}|${norm(patternTitle(pattern))}|${topicKey}`];
  if (exact) return exact;

  // The node or module may have been renamed in the workspace; fall back to the
  // titles that identify exactly one problem across the whole path.
  const slug = map.titleIndex?.[topicKey];
  if (!slug) return null;
  return Object.values(map.entries || {}).find(entry => entry.slug === slug) || { slug };
}
