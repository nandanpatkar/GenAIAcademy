#!/usr/bin/env node
// Joins the Pattern Wise DSA curriculum (src/data/dsa_part*.js) to the Code Lab
// catalog (src/data/codelab/catalog.json), so a study-path topic can show the
// same statement the Code Lab serves from /codelab/problems/<slug>.json.
//
// Both datasets are built from dsanew/, and the catalog keeps each pattern's
// problems in curriculum order — `categories[].patterns[].problems` is a slug
// per subtopic, in the same sequence, including repeats where two curriculum
// topics are the same LeetCode problem ("Allocate Minimum Number of Pages" and
// "Split Array Largest Sum"). That positional pairing is the primary join.
//
// It only holds while the two stay in step, so it is used per pattern and only
// when the counts match; a pattern that has drifted falls back to matching on
// the curated LeetCode URL and then on titles. Every entry records which stage
// claimed it, and pairings whose titles diverge are printed for review.
//
// Output: public/codelab/topicMap.json (committed; the app fetches it alongside
// the problem payloads it points at).
//   npm run build:codelab-map
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const catalogPath = path.join(repoRoot, "src", "data", "codelab", "catalog.json");
const outPath = path.join(repoRoot, "public", "codelab", "topicMap.json");

/** Lowercase, drop parentheticals and punctuation — titles differ mostly in those. */
const norm = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Curriculum module titles carry a progress suffix the catalog drops:
// "KMP Algorithm / Prefix Function (0/4)".
const patternTitle = (title = "") => String(title).replace(/\s*\(\d+\s*\/\s*\d+\)\s*$/, "").trim();

const leetSlug = (url = "") => (String(url).match(/\/problems\/([^/?#]+)/) || [])[1] || null;
const tokens = (value) => new Set(norm(value).split(" ").filter(Boolean));
const similarity = (a, b) => {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  const shared = [...left].filter(token => right.has(token)).length;
  return shared / Math.min(left.size, right.size);
};

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const problems = catalog.problems || [];
const bySlug = new Map(problems.map(problem => [problem.slug, problem]));
const byLeetSlug = new Map();
for (const problem of problems) {
  const slug = leetSlug(problem.url);
  if (slug && !byLeetSlug.has(slug)) byLeetSlug.set(slug, problem);
}

// category|pattern -> ordered slug list, straight from the catalog.
const orderedByPattern = new Map();
for (const category of catalog.categories || []) {
  for (const pattern of category.patterns || []) {
    orderedByPattern.set(`${norm(category.title)}|${norm(pattern.title)}`, pattern.problems || []);
  }
}
const globalByTitle = new Map();
for (const problem of problems) {
  const key = norm(problem.title);
  // Ambiguous titles are recorded as null so they can never win a global match.
  globalByTitle.set(key, globalByTitle.has(key) ? null : problem);
}

const nodes = [];
for (let part = 1; part <= 9; part += 1) {
  const file = path.join(repoRoot, "src", "data", `dsa_part${part}.js`);
  const loaded = await import(pathToFileURL(file).href);
  nodes.push(...(loaded[`dsaPart${part}`] || []));
}

const entries = {};
const stageCounts = {};
const unmatched = [];
const looseMatches = [];
let topicCount = 0;

const topicsOf = (module) =>
  (module.subtopics || [])
    .map(raw => (typeof raw === "object" ? raw : { title: raw }))
    .filter(topic => topic.title);

for (const node of nodes) {
  for (const module of node.modules || []) {
    const pattern = patternTitle(module.title);
    const patternKey = `${norm(node.title)}|${norm(pattern)}`;
    const ordered = orderedByPattern.get(patternKey) || [];
    const pool = ordered.map(slug => bySlug.get(slug)).filter(Boolean);
    const poolByTitle = new Map(pool.map(problem => [norm(problem.title), problem]));
    const topics = topicsOf(module);
    const aligned = ordered.length === topics.length;

    // The curated links are "<Problem> — Practice" pointing at the real
    // LeetCode URL, the one join key both sides literally share.
    const linkByTitle = new Map();
    for (const link of module.links || []) {
      const title = norm(String(link.title || "").split(/[—–-]\s*Practice/i)[0]);
      const slug = leetSlug(link.url);
      if (title && slug) linkByTitle.set(title, slug);
    }

    topics.forEach((topic, index) => {
      topicCount += 1;
      const key = norm(topic.title);
      let match = null;
      let stage = null;

      if (aligned) {
        const problem = bySlug.get(ordered[index]);
        if (problem) { match = problem; stage = "position"; }
      }
      if (!match) {
        const linked = linkByTitle.get(key);
        const problem = linked ? bySlug.get(linked) || byLeetSlug.get(linked) : null;
        if (problem) { match = problem; stage = "link-url"; }
      }
      if (!match && poolByTitle.has(key)) { match = poolByTitle.get(key); stage = "pattern-title"; }
      if (!match && globalByTitle.get(key)) { match = globalByTitle.get(key); stage = "global-title"; }
      if (!match) {
        // "Inorder Traversal" ⊂ "Binary Tree Inorder Traversal". Only accept a
        // containment hit when exactly one problem in the pattern qualifies.
        const candidates = pool.filter(problem => {
          const other = norm(problem.title);
          return other.includes(key) || key.includes(other);
        });
        if (candidates.length === 1) { [match] = candidates; stage = "pattern-substring"; }
      }

      if (!match) {
        unmatched.push({ category: node.title, pattern, title: topic.title });
        return;
      }

      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
      const score = similarity(topic.title, match.title);
      if (score < 0.5) looseMatches.push({ category: node.title, pattern, title: topic.title, mapped: match.title, via: stage });

      entries[`${norm(node.title)}|${norm(pattern)}|${key}`] = {
        slug: match.slug,
        title: match.title,
        number: match.number ?? null,
        difficulty: match.difficulty,
        url: match.url || null,
        testCount: match.testCount ?? null,
        timeComplexity: match.timeComplexity || null,
        spaceComplexity: match.spaceComplexity || null,
        judgeAvailable: Boolean(match.judgeAvailable),
        via: stage,
      };
    });
  }
}

// A title-only index for topics whose node or module was renamed by a user
// edit. Only titles that resolve to a single slug across the path are kept.
const titleIndex = {};
for (const [key, value] of Object.entries(entries)) {
  const title = key.split("|").pop();
  if (!(title in titleIndex)) titleIndex[title] = value.slug;
  else if (titleIndex[title] !== value.slug) titleIndex[title] = null;
}
for (const [title, slug] of Object.entries(titleIndex)) {
  if (!slug) delete titleIndex[title];
}

const output = {
  generatedFrom: "src/data/dsa_part*.js + src/data/codelab/catalog.json",
  counts: {
    topics: topicCount,
    mapped: Object.keys(entries).length,
    unmapped: unmatched.length,
    byStage: stageCounts,
  },
  entries,
  titleIndex,
  unmapped: unmatched,
};

// Minified, like catalog.json — it ships to the browser.
writeFileSync(outPath, JSON.stringify(output));
console.log(`codelab topic map: ${output.counts.mapped}/${topicCount} topics mapped, ${unmatched.length} without a Code Lab problem`);
console.log(`stages: ${JSON.stringify(stageCounts)}`);
if (looseMatches.length) {
  console.log(`\n${looseMatches.length} pairing(s) whose titles differ — check these read as the same problem:`);
  for (const item of looseMatches) console.log(`  ${item.category} / ${item.pattern}: "${item.title}" -> "${item.mapped}" (${item.via})`);
}
