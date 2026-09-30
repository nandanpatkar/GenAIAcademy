#!/usr/bin/env node
/* Link Visual Learning lessons to DSA practice problems.
 *
 *   node scripts/build_visual_links.mjs            write src/data/practice/visualLinks.json
 *   node scripts/build_visual_links.mjs --report   also list unlinked lessons with candidates
 *
 * A lesson in the DSA Visual track links to a practice problem when, in order:
 *   1. scripts/data/visual_aliases.json `links` names it (a problem id, a list
 *      of ids, or null to say "deliberately none");
 *   2. its path's last segment is the problem's LeetCode slug;
 *   3. its title, normalised, is the problem's title.
 * Nothing is guessed beyond that — --report prints likely candidates for the
 * rest so an alias can be added by hand.
 *
 * Each lesson group (pattern) also maps to the practice topics it teaches, and
 * its intro/overview lessons — plus the `concepts` the alias file names — are
 * recorded so a topic can offer "watch the intro first". Lessons whose
 * mirrored page is the paywall screen are listed as locked and never linked.
 *
 * Rerun after scripts/build_chaivisual_course.py or scripts/build_tuf_practice.py.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/practice/visualLinks.json");
const ALIASES = path.join(ROOT, "scripts/data/visual_aliases.json");
const MIRROR = path.join(ROOT, "public/chai-visual");
const LOCKED_MARK = /This (?:chapter|pattern|problem|topic) is locked/;

const { CV_TRACKS } = await import(path.join(ROOT, "src/data/chaiVisualCourseData.js"));
const index = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/practice/index.json"), "utf8"));
const aliasFile = fs.existsSync(ALIASES) ? JSON.parse(fs.readFileSync(ALIASES, "utf8")) : {};
const aliases = aliasFile.links || {};
const concepts = new Set(aliasFile.concepts || []);
const report = process.argv.includes("--report");

/* Which practice topics each DSA Visual pattern teaches. Practice topics come
   from takeUforward's taxonomy, the lesson groups from the visual course's, so
   this is the one hand-kept bridge between the two. */
const GROUP_TOPICS = {
  "Two Pointers": ["Sliding Window / Two Pointers", "Arrays"],
  "Arrays & Hashing": ["Arrays", "Hashing"],
  "Sliding Window": ["Sliding Window / Two Pointers"],
  "Stack": ["Stack / Queues"],
  "Linked List": ["Linked List"],
  "Heap": ["Heaps"],
  "Binary Search": ["Binary Search"],
  "Depth-First Search": ["Binary Trees", "Binary Search Trees", "Graphs", "Recursion"],
  "Greedy Algorithms": ["Greedy Algorithms"],
  "Dynamic Programming": ["Dynamic Programming"],
  "Graphs": ["Graphs"],
  "Backtracking": ["Backtracking", "Recursion"],
  "Breadth-First Search": ["Graphs", "Binary Trees"],
  "Trie": ["Tries"],
  "Prefix Sum": ["Arrays"],
  "Matrices": ["Arrays"],
  "Intervals": ["Arrays", "Greedy Algorithms"],
  "Bit Manipulation": ["Bit Manipulation"],
};

const INTRO = /(^|[-/])(intro|introduction|overview|fundamentals|basics|getting-started)([-/]|$)/;

const normalise = (text) => String(text || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
const words = (text) => new Set(String(text || "").toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2));

const problems = index.problems || [];
const byId = new Map(problems.map((problem) => [problem.id, problem]));
const byLc = new Map(problems.filter((problem) => problem.lc).map((problem) => [problem.lc, problem]));
const byTitle = new Map(problems.map((problem) => [normalise(problem.title), problem]));

const isLocked = (lessonPath) => {
  const file = path.join(MIRROR, `${lessonPath}.html`);
  if (!fs.existsSync(file)) return false;
  return LOCKED_MARK.test(fs.readFileSync(file, "utf8"));
};

const dsa = CV_TRACKS.find((track) => track.id === "dsa");
if (!dsa) throw new Error("No DSA track in chaiVisualCourseData.js");

const byLesson = {};
const locked = [];
const unlinked = [];
const unknownAliases = [];
const groups = {};

for (const group of dsa.groups) {
  const topics = GROUP_TOPICS[group.title] || [];
  if (!GROUP_TOPICS[group.title]) console.warn(`! No topic mapping for lesson group "${group.title}"`);
  const entry = { topics, intros: [], lessons: [] };
  groups[group.title] = entry;

  for (const item of group.items) {
    entry.lessons.push(item.path);
    if (isLocked(item.path)) { locked.push(item.path); continue; }
    const leaf = item.path.split("/").pop();

    let ids = null;
    if (Object.prototype.hasOwnProperty.call(aliases, item.path)) {
      const alias = aliases[item.path];
      ids = alias == null ? [] : [].concat(alias);
      ids.forEach((id) => { if (!byId.has(id)) unknownAliases.push(`${item.path} → ${id}`); });
      ids = ids.filter((id) => byId.has(id));
    } else {
      const match = byLc.get(leaf) || byTitle.get(normalise(item.title));
      ids = match ? [match.id] : [];
    }

    if (ids.length) byLesson[item.path] = ids;
    else if (INTRO.test(leaf) || concepts.has(item.path)) entry.intros.push(item.path);
    else unlinked.push({ item, group, topics });
  }
}

const byProblem = {};
for (const [lessonPath, ids] of Object.entries(byLesson)) {
  ids.forEach((id) => { if (!byProblem[id]) byProblem[id] = lessonPath; });
}

// Titles of the intro lessons, so pages that only load this file (the practice
// lists) can name them without pulling in the whole course tree.
const introTitles = {};
for (const group of dsa.groups) {
  group.items.forEach((item) => { if (groups[group.title].intros.includes(item.path)) introTitles[item.path] = item.title; });
}

const byTopic = {};
for (const [title, entry] of Object.entries(groups)) {
  entry.topics.forEach((topic) => {
    if (!byTopic[topic]) byTopic[topic] = [];
    byTopic[topic].push(title);
  });
}

const out = {
  generatedBy: "scripts/build_visual_links.mjs",
  counts: {
    lessons: dsa.groups.reduce((sum, group) => sum + group.items.length, 0),
    linkedLessons: Object.keys(byLesson).length,
    linkedProblems: Object.keys(byProblem).length,
    intros: Object.values(groups).reduce((sum, entry) => sum + entry.intros.length, 0),
    locked: locked.length,
  },
  byLesson,
  byProblem,
  groups,
  byTopic,
  introTitles,
  locked,
};

fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${path.relative(ROOT, OUT)}:`, out.counts);
if (unknownAliases.length) console.warn(`! Aliases naming unknown problems:\n  ${unknownAliases.join("\n  ")}`);

if (report) {
  console.log(`\n${unlinked.length} lessons without a problem:`);
  for (const { item, topics } of unlinked) {
    const want = words(`${item.title} ${item.path.split("/").pop().replace(/-/g, " ")}`);
    const candidates = problems
      .map((problem) => {
        const have = words(`${problem.title} ${problem.lc || ""}`.replace(/-/g, " "));
        let score = 0;
        want.forEach((word) => { if (have.has(word)) score += 1; });
        if (topics.some((topic) => problem.topics.includes(topic))) score += 0.5;
        return { problem, score };
      })
      .filter((candidate) => candidate.score >= 1.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    console.log(`- ${item.path} (${item.title})${candidates.length ? `\n    ${candidates.map((c) => `${c.problem.id} · ${c.problem.title}`).join("\n    ")}` : ""}`);
  }
}
