import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const payloadPath = (slug) => path.join(repoRoot, "public", "codelab", "problems", `${slug}.json`);

// The service fetches everything from /codelab/, which in the browser is served
// out of public/. Serve those files from disk so the real code path runs here.
globalThis.fetch = async (url) => {
  const file = path.join(repoRoot, "public", String(url).replace(/^\//, ""));
  if (!existsSync(file)) return { ok: false, status: 404, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => JSON.parse(readFileSync(file, "utf8")) };
};

const { codelabStatementBody, findCodelabProblem } = await import("../src/services/codelabProblemService.js");

const nodes = [];
for (let part = 1; part <= 9; part += 1) {
  const loaded = await import(`../src/data/dsa_part${part}.js`);
  nodes.push(...loaded[`dsaPart${part}`]);
}
const topics = nodes.flatMap((node) =>
  (node.modules || []).flatMap((module) =>
    (module.subtopics || [])
      .map((raw) => (typeof raw === "object" ? raw : { title: raw }))
      .filter((topic) => topic.title)
      .map((topic) => ({ category: node.title, pattern: module.title, title: topic.title })),
  ),
);

test("every Pattern Wise DSA topic resolves to a Code Lab problem", async () => {
  assert.ok(topics.length > 300, `expected the full DSA path, got ${topics.length} topics`);
  const unresolved = [];
  for (const topic of topics) {
    const problem = await findCodelabProblem(topic);
    if (!problem?.slug) unresolved.push(`${topic.category} / ${topic.pattern} / ${topic.title}`);
  }
  assert.deepEqual(unresolved, []);
});

test("every mapped slug has a payload the browser can fetch", async () => {
  const missing = [];
  for (const topic of topics) {
    const problem = await findCodelabProblem(topic);
    if (!existsSync(payloadPath(problem.slug))) missing.push(problem.slug);
  }
  assert.deepEqual([...new Set(missing)], []);
});

test("mapped payloads carry the statement the panel renders", async () => {
  // Spot-check the two ends of the mapping: a plain title match and one of the
  // aliased pairs, where the curriculum and LeetCode name the problem differently.
  const cases = [
    { topic: { category: "Array", pattern: "Two Pointer", title: "Two Sum II" }, slug: "two-sum-ii-input-array-is-sorted" },
    { topic: { category: "Bit Manipulation", pattern: "Basic Bit Operations", title: "Unique Numbers 2" }, slug: "single-number-iii" },
    { topic: { category: "Strings", pattern: "KMP Algorithm / Prefix Function (0/4)", title: "Implement strStr()" }, slug: "find-the-index-of-the-first-occurrence-in-a-string" },
  ];
  for (const { topic, slug } of cases) {
    const problem = await findCodelabProblem(topic);
    assert.equal(problem.slug, slug, `${topic.title} should map to ${slug}`);
    const payload = JSON.parse(readFileSync(payloadPath(slug), "utf8"));
    assert.ok(payload.statement.trim().length > 0);
    assert.ok(payload.starterCode.trim().length > 0);
  }
});

test("statement body drops the metadata header but keeps the prose", () => {
  const statement = [
    "# 15. 3Sum",
    "",
    "**Difficulty:** Medium",
    "",
    "**LeetCode:** https://leetcode.com/problems/3sum/",
    "",
    "> **LeetCode Premium problem.** Restated below.",
    "",
    "---",
    "",
    "## Problem Statement",
    "",
    "Given an integer array nums...",
  ].join("\n");
  const body = codelabStatementBody(statement);
  assert.ok(!body.includes("**Difficulty:**"));
  assert.ok(!body.includes("# 15. 3Sum"));
  assert.ok(body.startsWith("> **LeetCode Premium problem.**"));
  assert.ok(body.includes("## Problem Statement"));
});

test("a topic with no Code Lab counterpart resolves to null", async () => {
  const problem = await findCodelabProblem({ category: "Array", pattern: "Two Pointer", title: "A topic someone just invented" });
  assert.equal(problem, null);
});
