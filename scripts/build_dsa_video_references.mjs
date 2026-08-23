import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = process.argv[2] || "/Users/nandanpatkar/Documents/Codex/2026-08-22/you/outputs/dsa-questions-with-videos.json";
const outputPath = path.join(repoRoot, "src/data/dsaVideoReferences.json");
const catalogPath = path.join(repoRoot, "src/data/codelab/catalog.json");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")).problems || [];
const questions = source.topics.flatMap((topic) => topic.patterns.flatMap((pattern) => pattern.questions.map((question) => ({
  ...question,
  topic: topic.topic,
  pattern: pattern.pattern,
}))));

const normalize = (value) => String(value || "")
  .toLowerCase()
  .replaceAll("&", "and")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();
const identity = (value) => normalize(value).replaceAll(" ", "");

const problemSlug = (value) => String(value || "").match(/\/problems\/([^/?#]+)/)?.[1] || "";

const similarity = (left, right) => {
  const a = normalize(left);
  const b = normalize(right);
  if (a === b) return 1;
  const rows = Array.from({ length: a.length + 1 }, (_, index) => index);
  for (let i = 1; i <= b.length; i += 1) {
    let previous = rows[0];
    rows[0] = i;
    for (let j = 1; j <= a.length; j += 1) {
      const saved = rows[j];
      rows[j] = Math.min(rows[j] + 1, rows[j - 1] + 1, previous + (a[j - 1] === b[i - 1] ? 0 : 1));
      previous = saved;
    }
  }
  return 1 - (rows[a.length] / Math.max(a.length, b.length, 1));
};

const byUrl = new Map(questions.filter((question) => problemSlug(question.url)).map((question) => [problemSlug(question.url), question]));
const byTitle = new Map(questions.map((question) => [normalize(question.title), question]));
const titleAliases = {
  "find-kth-rotation": "Find kth rotation",
  "count-occurrences": "Count Occurrences",
  "matrix-median": "Matrix Median",
  "infix-to-prefix": "infix to prefix",
  "infix-to-postfix": "infix to postfix",
  "postfix-to-prefix": "postfix to prefix",
  "postfix-to-infix": "postfix to infix",
  "prefix-to-infix": "prefix to infix",
  "prefix-to-postfix": "prefix to postfix",
  "insert-at-bottom-of-stack": "Insert at Bottom of Stack",
  "search-in-linked-list": "Search in Linked List",
  "delete-head-tail-nth-node": "Delete Head / Tail / Nth Node",
  "merge-two-sorted-dlls": "Merge Two Sorted DLLs",
  "convert-dll-to-binary-tree": "Convert DLL to Binary Tree",
  "closest-leaf-in-bst": "Closest Leaf in BST",
  "directed-cycle-detection": "Cycle Detection in Directed Graph",
  "undirected-cycle-detection": "Undirected Cycle Detection",
  "articulation-points": "Articulation Points",
  "kruskal-s-algorithm": "Kruskal’s algorithm",
  "dijkstra-implementation": "Dijkstra Implementation",
  "negative-weight-cycle-detection": "Negative Weight Cycle Detection",
  "transitive-closure": "Transitive Closure",
  "all-pairs-shortest-path": "All-Pairs Shortest Path",
  "graph-coloring-m-coloring-problem": "Graph Coloring (M-Coloring Problem)",
  "minimum-platforms-resource-allocation": "Minimum Platforms / Resource Allocation",
  "minimum-number-of-insertions-and-deletions": "Minimum Number of Insertions and Deletions",
  "design-add-and-search-words-data-structure": "Add and Search Word",
  "check-kth-bit-is-set-or-not": "Check kth bit is set or not",
  "xor-queries-of-a-subarray": "Subarray XOR Queries / K-th XOR",
};
const references = {};

for (const problem of catalog) {
  let match = byUrl.get(problemSlug(problem.url));
  let matchedBy = match ? "canonical-url" : "";
  if (!match) {
    match = byTitle.get(normalize(problem.title));
    matchedBy = match ? "title" : "";
  }
  if (!match && titleAliases[problem.slug]) {
    match = byTitle.get(normalize(titleAliases[problem.slug]));
    matchedBy = match ? "title-alias" : "";
  }
  if (!match) {
    const category = identity(problem.patterns?.[0]?.category);
    const pattern = identity(problem.patterns?.[0]?.pattern);
    const candidates = questions.filter((question) => identity(question.topic) === category && identity(question.pattern) === pattern);
    const ranked = candidates.map((question) => ({ question, score: similarity(problem.title, question.title) })).sort((a, b) => b.score - a.score);
    if (ranked[0]?.score >= 0.64) {
      match = ranked[0].question;
      matchedBy = "pattern-title";
    }
  }
  if (!match?.videoUrl) continue;
  references[problem.slug] = {
    title: match.title,
    videoUrl: match.videoUrl,
    problemUrl: match.url,
    topic: match.topic,
    pattern: match.pattern,
    matchedBy,
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify(references, null, 2)}\n`);
console.log(`Wrote ${outputPath} with ${Object.keys(references).length}/${catalog.length} video references.`);
