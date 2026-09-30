// Tests for the DSA workspace AI coach (src/pages/dsa/coach): reply parsing,
// artifact normalizing, the agent loop and the system prompt.
// Run: npm run test:dsa-prep
import test from "node:test";
import assert from "node:assert/strict";
import { artifactType, normalizeArtifact, parseCaseInput, parseLiteral, parseLooseJSON, splitReply, stripToolBlocks, toolCallsOf } from "../src/pages/dsa/coach/replyParser.js";
import { CoachCancelled, runCoachAgent } from "../src/pages/dsa/coach/agent.js";
import { DEFAULT_PREFS, DSA_ARTIFACTS, LESSON_ARTIFACTS, artifactGuide, buildLessonPrompt, buildSystemPrompt, lessonHeadings, lessonSection, statusFor, summarizeResult, titleFrom } from "../src/pages/dsa/coach/prompt.js";
import { editorialApproaches, findApproach } from "../src/pages/dsa/coach/editorial.js";
import { SANDBOX_CSP, buildHtmlDocument, buildReactDocument, transformComponentSource } from "../src/pages/dsa/coach/sandbox.js";
import { circleLayout, layeredLayout, treeFromLevelOrder, treeLayout } from "../src/pages/dsa/coach/layout.js";

const fence = (lang, body) => `\`\`\`${lang}\n${body}\n\`\`\``;

/* ── Tolerant JSON ─────────────────────────────────────────────────────── */

test("parseLooseJSON repairs raw newlines, trailing commas and truncation", () => {
  assert.deepEqual(parseLooseJSON('{"code": "def f():\n    return 1",}'), { code: "def f():\n    return 1" });
  assert.deepEqual(parseLooseJSON('{"items": [1, 2, 3,], "ok": true,}'), { items: [1, 2, 3], ok: true });
  assert.deepEqual(parseLooseJSON('{"hints": [{"body": "look at the'), { hints: [{ body: "look at the" }] });
  assert.deepEqual(parseLooseJSON("{“type”: “hints”}"), { type: "hints" });
  assert.throws(() => parseLooseJSON("not json at all"));
});

test("parseLiteral reads JSON and Python spellings", () => {
  assert.deepEqual(parseLiteral("[1, 2]"), [1, 2]);
  assert.deepEqual(parseLiteral("[True, None, 'a']"), [true, null, "a"]);
  assert.equal(parseLiteral("plain words"), "plain words");
});

test("parseCaseInput accepts objects, assignment strings and single bare values", () => {
  assert.deepEqual(parseCaseInput({ nums: [1] }), { nums: [1] });
  assert.deepEqual(parseCaseInput("nums = [2, 7, 11], target = 9"), { nums: [2, 7, 11], target: 9 });
  assert.deepEqual(parseCaseInput("s = 'a,b', k = 2"), { s: "a,b", k: 2 });
  assert.deepEqual(parseCaseInput('{"grid": [[1, 0]]}'), { grid: [[1, 0]] });
  assert.deepEqual(parseCaseInput("[3, 1, 2]", ["nums"]), { nums: [3, 1, 2] });
  assert.equal(parseCaseInput("[3, 1, 2]", ["nums", "k"]), null);
});

/* ── Artifacts ─────────────────────────────────────────────────────────── */

test("artifact types resolve TUFY's response types as aliases", () => {
  assert.equal(artifactType("full_solution"), "solution");
  assert.equal(artifactType("initial_hints"), "hints");
  assert.equal(artifactType("complexity_review"), "complexity");
  assert.equal(artifactType("Test Cases"), "test_cases");
  assert.equal(artifactType("nonsense"), "");
});

test("normalizers accept loose shapes and reject empty ones", () => {
  const hints = normalizeArtifact({ type: "hints", hints: ["Use a map", { title: "Level 2", body: "Store indexes" }, { body: "" }] });
  assert.deepEqual(hints.hints, [{ title: "Hint 1", body: "Use a map" }, { title: "Level 2", body: "Store indexes" }]);
  assert.equal(normalizeArtifact({ type: "hints", hints: [] }), null);

  const cases = normalizeArtifact({ type: "test_cases", cases: [{ input: { nums: [] }, expected: [] }, { name: "no output", input: "nums = [1]" }] });
  assert.equal(cases.cases[0].name, "Case 1");
  assert.equal(cases.cases[0].hasExpected, true);
  assert.equal(cases.cases[1].hasExpected, false);

  const solution = normalizeArtifact({ response_type: "full_solution", payload: { full_code: "x = 1", language: "python" } });
  assert.equal(solution.type, "solution");
  assert.equal(solution.code, "x = 1");
  assert.equal(solution.title, "Full solution");

  const complexity = normalizeArtifact({ type: "complexity", actual_time: "O(n^2)", expected_time: "O(n)", meets_expected: false, summary: "Use a hash map" });
  assert.equal(complexity.yoursTime, "O(n^2)");
  assert.equal(complexity.meetsExpected, false);

  const mcq = normalizeArtifact({ type: "mcq", question: "Which?", options: ["A", "B", "C"], answer: 2 });
  assert.equal(mcq.answer, "2");
  assert.equal(normalizeArtifact({ type: "mcq", question: "Which?", options: ["A"] }), null);
  assert.equal(normalizeArtifact({ type: "mcq", question: "Q", options: ["yes", "no"], answer: "No" }).answer, "1");

  const trace = normalizeArtifact({ type: "trace", frames: [{ array: [1, 2], pointers: { l: 0, r: "x" }, note: "start" }, { bad: true }] });
  assert.equal(trace.frames.length, 1);
  assert.deepEqual(trace.frames[0].pointers, { l: 0 });

  const table = normalizeArtifact({ type: "table", headers: ["A", "B"], rows: [[1, "x"], { A: 2, B: "y" }] });
  assert.deepEqual(table.rows, [["1", "x"], ["2", "y"]]);

  const dryRun = normalizeArtifact({ type: "dry_run", steps: ["i = 0"], table: { headers: ["i"], rows: [["0"]] } });
  assert.equal(dryRun.runs.length, 1);
  assert.equal(dryRun.runs[0].steps[0], "i = 0");

  assert.equal(normalizeArtifact({ type: "review", improvements: ["Handle empty input"] }).improvements[0].advice, "Handle empty input");
  assert.equal(normalizeArtifact({ type: "follow_ups", items: ["a", "b", "c", "d", "e"] }).items.length, 4);
  assert.equal(normalizeArtifact(null), null);
  assert.equal(normalizeArtifact({ type: "unknown" }), null);
});

/* ── Segments ──────────────────────────────────────────────────────────── */

test("splitReply keeps order and turns fences into typed segments", () => {
  const reply = [
    "Welcome to **Sum Quest**.",
    fence("artifact", '{"type": "hints", "hints": ["Think about complements"]}'),
    "Here is the code:",
    fence("python", "def f():\n    return 1"),
    fence("mermaid", "graph TD; A-->B"),
    fence("hints", '["Look at pairs"]'),
    fence("artifact", "{ broken"),
    "Done.",
  ].join("\n");
  const types = splitReply(reply).map((segment) => segment.type);
  assert.deepEqual(types, ["markdown", "artifact", "markdown", "code", "mermaid", "artifact", "invalid", "markdown"]);
  const segments = splitReply(reply);
  assert.equal(segments[3].lang, "python");
  assert.equal(segments[3].code, "def f():\n    return 1");
});

test("an artifact tagged by its type name is read too", () => {
  const [segment] = splitReply(fence("test_cases", '{"cases": [{"input": {"n": 1}, "expected": 1}]}'));
  assert.equal(segment.type, "artifact");
  assert.equal(segment.artifact.type, "test_cases");
});

test("tool calls are found and stripped from what the learner sees", () => {
  const reply = `Let me check.\n${fence("tool", '{"name": "run_code", "args": {}}')}\n${fence("tool", '{"name": "read_editorial", "args": {"approach": "optimal"}}')}`;
  assert.deepEqual(toolCallsOf(reply).map((call) => call.name), ["run_code", "read_editorial"]);
  assert.deepEqual(toolCallsOf(reply)[1].args, { approach: "optimal" });
  assert.equal(stripToolBlocks(reply), "Let me check.");
});

test("an unclosed fence is pending only while streaming", () => {
  assert.equal(splitReply("Hi\n```artifact\n{\"type\": \"hi", { partial: true }).at(-1).type, "pending");
  assert.equal(splitReply("Hi\n```python\nx = 1").at(-1).type, "code");
});

/* ── Agent loop ────────────────────────────────────────────────────────── */

const scripted = (replies) => {
  const calls = [];
  const model = async (messages) => {
    calls.push(messages.map((message) => ({ ...message })));
    const next = replies.shift();
    return typeof next === "function" ? next(messages) : next;
  };
  return { model, calls };
};

test("the agent runs a tool, feeds the result back and returns the answer", async () => {
  const { model, calls } = scripted([
    `Checking.\n${fence("tool", '{"name": "run_code", "args": {}}')}`,
    "Your code passes 3/3.",
  ]);
  const events = [];
  const result = await runCoachAgent({
    system: "sys",
    message: "does my code work?",
    callModel: model,
    tools: { run_code: { label: () => "Running", run: async () => ({ text: "Accepted: 3/3", summary: "3/3 passed" }) } },
    onEvent: (event) => events.push(event.type),
  });
  assert.equal(result.content, "Your code passes 3/3.");
  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0].status, "ok");
  assert.equal(result.steps[0].summary, "3/3 passed");
  assert.equal(calls.length, 2);
  assert.match(calls[1].at(-1).content, /Accepted: 3\/3/);
  assert.equal(calls[1][0].role, "system");
  assert.deepEqual(events.slice(0, 2), ["tool_start", "tool_result"]);
  assert.equal(events.at(-1), "final");
});

test("an unknown tool comes back to the model as an error", async () => {
  const { model, calls } = scripted([fence("tool", '{"name": "hack", "args": {}}'), "ok"]);
  const result = await runCoachAgent({ system: "s", message: "m", callModel: model, tools: {} });
  assert.equal(result.steps[0].status, "error");
  assert.match(calls[1].at(-1).content, /Unknown tool "hack"/);
});

test("the agent stops calling tools after the step limit and still answers", async () => {
  const toolReply = fence("tool", '{"name": "read_notes", "args": {}}');
  const { model, calls } = scripted([toolReply, toolReply, toolReply, "final answer"]);
  let runs = 0;
  const result = await runCoachAgent({
    system: "s",
    message: "m",
    callModel: model,
    maxSteps: 3,
    tools: { read_notes: { run: () => { runs += 1; return "notes"; } } },
  });
  assert.equal(runs, 2);
  assert.equal(result.content, "final answer");
  assert.match(calls.at(-1).at(-1).content, /Don't call tools/);
});

test("cancelling stops the loop", async () => {
  let cancelled = false;
  const { model } = scripted([() => { cancelled = true; return "late"; }]);
  await assert.rejects(runCoachAgent({ system: "s", message: "m", callModel: model, isCancelled: () => cancelled }), CoachCancelled);
});

test("history is trimmed and error messages are left out", async () => {
  const { model, calls } = scripted(["hi"]);
  const history = [
    { role: "user", content: "a" },
    { role: "assistant", content: "failed", isError: true },
    ...Array.from({ length: 20 }, (_, index) => ({ role: index % 2 ? "assistant" : "user", content: `m${index}` })),
  ];
  await runCoachAgent({ system: "s", history, message: "now", callModel: model });
  const sent = calls[0];
  assert.equal(sent.length, 1 + 14 + 1);
  assert.ok(!sent.some((message) => message.content === "failed"));
  assert.equal(sent.at(-1).content, "now");
});

/* ── Prompt ────────────────────────────────────────────────────────────── */

const problem = { title: "Two Sum", level: "Basic", topicTags: ["Arrays", "Hashing"] };
const detail = { starterCode: "class Solution:\n    def twoSum(self, nums, target):\n        pass", visibleTests: [{ input: { nums: [2, 7], target: 9 }, expected: [0, 1] }], judgeAvailable: true };

test("the system prompt carries the problem, context, editor and policy", () => {
  const prompt = buildSystemPrompt({
    problem,
    detail,
    pattern: "Hash map",
    activeTab: { id: "tab-1", name: "Tab-1", code: "print(1)" },
    tabs: [{ id: "tab-1", name: "Tab-1" }, { id: "tab-2", name: "Tab-2" }],
    context: [{ label: "Editorial · Optimal", text: "one pass" }],
    params: ["nums", "target"],
    prefs: { ...DEFAULT_PREFS, nickname: "Nandan" },
  });
  assert.match(prompt, /Title: Two Sum/);
  assert.match(prompt, /Parameters: nums, target/);
  assert.match(prompt, /## Attached: Editorial · Optimal\none pass/);
  assert.match(prompt, /print\(1\)/);
  assert.match(prompt, /other tabs: Tab-2/);
  assert.match(prompt, /Hint first/);
  assert.match(prompt, /Call the learner "Nandan"/);
  assert.match(prompt, /run and submit/);
  assert.doesNotMatch(buildSystemPrompt({ problem, detail, prefs: { ...DEFAULT_PREFS, hintFirst: false } }), /Hint first/);
});

test("summarizeResult reports failures and keeps hidden inputs private", () => {
  const summary = summarizeResult({
    summary: { passed: 1, failed: 2, total: 3 },
    cases: [
      { id: "example-1", status: "passed" },
      { id: "example-2", status: "wrong_answer", input: { nums: [1] }, expected: [0], actual: [] },
      { id: "hidden-1", status: "wrong_answer", hidden: true, input: { secret: 1 } },
    ],
  });
  assert.match(summary, /^Failed: 1\/3 cases passed/);
  assert.match(summary, /example-2: wrong_answer; input=\{"nums":\[1\]\}; expected=\[0\]; got=\[\]/);
  assert.match(summary, /hidden-1: wrong_answer \(hidden case\)/);
  assert.doesNotMatch(summary, /secret/);
  assert.equal(summarizeResult(null), "");
});

test("status lines and chat titles", () => {
  assert.equal(statusFor("Review my code please"), "Analyzing your code…");
  assert.equal(statusFor("show the optimal editorial"), "Reviewing editorial context…");
  assert.equal(statusFor("hello"), "Thinking…");
  assert.equal(titleFrom("Explain me how to do two sum in a gamification way"), "Explain me how to do two…");
  assert.equal(titleFrom("   "), "New chat");
});

/* ── Editorial ─────────────────────────────────────────────────────────── */

test("findApproach picks brute / better / optimal, names and indexes", () => {
  const approaches = [{ name: "Brute Force Approach" }, { name: "Better Approach" }, { name: "Optimal Approach" }];
  assert.equal(findApproach(approaches, "brute").name, "Brute Force Approach");
  assert.equal(findApproach(approaches, "better").name, "Better Approach");
  assert.equal(findApproach(approaches, "optimal").name, "Optimal Approach");
  assert.equal(findApproach(approaches, "").name, "Optimal Approach");
  assert.equal(findApproach(approaches, "2").name, "Better Approach");
  assert.equal(findApproach(approaches, "force").name, "Brute Force Approach");
  assert.equal(findApproach([{ name: "Using Stack" }, { name: "Using Recursion" }], "optimal").name, "Using Recursion");
  assert.equal(findApproach([], "optimal"), null);
});

test("editorialApproaches falls back to the Code Lab reference solution", () => {
  assert.deepEqual(editorialApproaches({ solution: "code", approach: "idea" }), [{ name: "Reference solution", body: "idea", code: "code" }]);
  assert.equal(editorialApproaches({ extras: { approaches: [{ name: "Optimal", code: "x" }] }, solution: "code" })[0].name, "Optimal");
  assert.deepEqual(editorialApproaches(null), []);
});

/* ── AI from Scratch lessons ───────────────────────────────────────────── */

test("the lesson prompt carries the lesson, its context and lesson-only artifacts", () => {
  const prompt = buildLessonPrompt({
    lesson: { title: "Self-Attention", type: "Learn + Build", langs: "Python", time: "~60 minutes", prereq: "Embeddings", blurb: "Tokens looking at tokens.", code: 2, quiz: 5 },
    phase: { track: "curriculum", n: 7, title: "Transformers" },
    context: [{ label: "Lesson text (Self-Attention)", text: "Attention(Q, K, V) = softmax(QK^T / sqrt(d)) V" }],
    codeFiles: ["code/attention.py"],
  });
  assert.match(prompt, /AI from Scratch/);
  assert.match(prompt, /Title: Self-Attention/);
  assert.match(prompt, /Phase: Phase 7 · Transformers/);
  assert.match(prompt, /2 code file\(s\) \(code\/attention\.py\)/);
  assert.match(prompt, /## Attached: Lesson text \(Self-Attention\)/);
  assert.match(prompt, /Never give away the answers to the lesson's own quiz/);
  assert.match(prompt, /- flashcards:/);
  assert.doesNotMatch(prompt, /- test_cases:/);
  assert.doesNotMatch(prompt, /- problems:/);
});

test("each surface's artifact guide lists only its own types", () => {
  const dsa = artifactGuide(DSA_ARTIFACTS);
  const lesson = artifactGuide(LESSON_ARTIFACTS);
  assert.match(dsa, /- test_cases:/);
  assert.doesNotMatch(dsa, /- flashcards:/);
  assert.match(lesson, /- lessons:/);
  assert.match(lesson, /- trace/);
});

test("lessonSection returns one heading's section", () => {
  const markdown = "# Title\nintro\n## The Problem\nwhy\n### Detail\nmore\n## Build It\nsteps";
  assert.equal(lessonSection(markdown, "problem"), "## The Problem\nwhy\n### Detail\nmore");
  assert.equal(lessonSection(markdown, "build"), "## Build It\nsteps");
  assert.equal(lessonSection(markdown, "missing"), "");
  assert.deepEqual(lessonHeadings(markdown), ["The Problem", "Detail", "Build It"]);
});

test("flashcards and lesson links normalize from loose shapes", () => {
  const cards = normalizeArtifact({ type: "cards", cards: [{ q: "What is a token?", a: "A unit of text" }, { front: "no back" }] });
  assert.equal(cards.type, "flashcards");
  assert.deepEqual(cards.cards, [{ front: "What is a token?", back: "A unit of text" }]);
  const lessons = normalizeArtifact({ type: "lessons", items: ["07/01-attention", { slug: "07/02-mha", why: "next step" }] });
  assert.deepEqual(lessons.items, [{ slug: "07/01-attention", reason: "" }, { slug: "07/02-mha", reason: "next step" }]);
  assert.equal(normalizeArtifact({ type: "flashcards", cards: [] }), null);
});

/* ── Rich artifacts: sandbox documents ─────────────────────────────────── */

test("HTML artifacts get the CSP first in <head>, whatever shape the page has", () => {
  const full = buildHtmlDocument('<!doctype html><html lang="en"><head><title>x</title></head><body><p>hi</p></body></html>', { token: "t1" });
  assert.ok(full.indexOf("Content-Security-Policy") < full.indexOf("<title>"));
  assert.match(full, /connect-src 'none'/);
  assert.match(full, /"t1"/);
  const fragment = buildHtmlDocument("<div id=app></div><script>app.textContent = 1</script>", { token: "t2", theme: "light" });
  assert.match(fragment, /^<!doctype html>\n<html><head><meta http-equiv="Content-Security-Policy"/);
  assert.match(fragment, /<div id=app><\/div>/);
  assert.match(fragment, /color-scheme:light/);
  const noHead = buildHtmlDocument("<html><body>x</body></html>", {});
  assert.match(noHead, /<html>\n<head><meta http-equiv="Content-Security-Policy"/);
  assert.match(SANDBOX_CSP, /default-src 'none'/);
  assert.doesNotMatch(SANDBOX_CSP, /connect-src[^;]*https/);
});

test("React artifacts: imports become UMD globals, exports are stripped", () => {
  const source = [
    'import React, { useState } from "react";',
    "import ReactFlow, {",
    "  Background,",
    "  Controls as Ctl,",
    '} from "reactflow";',
    'import "reactflow/dist/style.css";',
    'import * as d3 from "d3";',
    "export const helper = 1;",
    "export default function Diagram() { return <div />; }",
  ].join("\n");
  const { code, modules, entry } = transformComponentSource(source);
  assert.equal(entry, "Diagram");
  assert.deepEqual(modules.sort(), ["d3", "react", "reactflow"]);
  assert.match(code, /const React = \(window\.React && window\.React\.default\) \|\| window\.React;/);
  assert.match(code, /const \{ useState \} = window\.React;/);
  assert.match(code, /const \{ Background, Controls: Ctl \} = window\.__dcxReactFlow;/);
  assert.match(code, /const d3 = window\.d3;/);
  assert.doesNotMatch(code, /import |export /);
  assert.equal(transformComponentSource("const App = () => null; export default App;").entry, "App");
  assert.throws(() => transformComponentSource('import axios from "axios";\nexport default function A(){}'), /Not available: axios/);
});

test("React documents load only the libraries a component imports", () => {
  const doc = buildReactDocument('import ReactFlow from "reactflow";\nexport default function A() { return <ReactFlow nodes={[]} edges={[]} />; }', { token: "t" });
  assert.match(doc, /reactflow@11\.11\.4\/dist\/umd\/index\.js/);
  assert.match(doc, /reactflow@11\.11\.4\/dist\/style\.css/);
  assert.doesNotMatch(doc, /<script src="[^"]*(recharts|d3\.min\.js|tailwindcss)/);
  const tail = buildReactDocument('export default function A() { return <div className="p-4">x</div>; }');
  assert.match(tail, /<script src="https:\/\/cdn\.tailwindcss\.com/);
  const escaped = buildReactDocument('export default function A() { return <div>{"</script><b>"}</div>; }');
  assert.equal((escaped.match(/<\/script>/gi) || []).length, (escaped.match(/<script/gi) || []).length);
  const broken = buildReactDocument('import x from "left-pad";\nexport default function A(){}');
  assert.match(broken, /Not available: left-pad/);
});

/* ── Layouts ───────────────────────────────────────────────────────────── */

test("layered layout: layers follow edges and loops are reported, not followed", () => {
  const nodes = ["q", "router", "retriever", "grader", "rewrite", "llm"].map((id) => ({ id }));
  const edges = [["q", "router"], ["router", "retriever"], ["retriever", "grader"], ["grader", "llm"], ["grader", "rewrite"], ["rewrite", "retriever"]]
    .map(([source, target]) => ({ source, target }));
  const { positions, backEdges } = layeredLayout(nodes, edges, { direction: "LR" });
  assert.ok(positions.q.x < positions.router.x && positions.router.x < positions.retriever.x && positions.retriever.x < positions.grader.x);
  assert.ok(positions.grader.x < positions.llm.x);
  assert.deepEqual([...backEdges], ["rewrite->retriever"]);
  const tb = layeredLayout(nodes, edges, { direction: "TB" });
  assert.ok(tb.positions.q.y < tb.positions.router.y);
  assert.ok(Object.keys(layeredLayout([{ id: "a" }, { id: "b" }], [{ source: "a", target: "zzz" }]).positions).length === 2);
});

test("trees come from LeetCode level-order arrays", () => {
  const nodes = treeFromLevelOrder([3, 9, 20, null, null, 15, 7]);
  assert.deepEqual(nodes.map((node) => [node.value, node.depth, node.parent]), [[3, 0, null], [9, 1, 0], [20, 1, 0], [15, 2, 2], [7, 2, 2]]);
  const { positions } = treeLayout(nodes);
  assert.ok(positions[1].x < positions[0].x && positions[0].x < positions[5].x && positions[5].x < positions[2].x && positions[2].x < positions[6].x);
  assert.deepEqual(treeFromLevelOrder([]), []);
  assert.deepEqual(treeFromLevelOrder([null]), []);
  const { positions: ring } = circleLayout(["a", "b", "c", "d"]);
  assert.equal(Object.keys(ring).length, 4);
});

/* ── Visual artifact shapes ────────────────────────────────────────────── */

test("html, jsx and svg fences become live artifacts only when they're whole", () => {
  const fenceIt = (lang, body) => `\`\`\`${lang}\n${body}\n\`\`\``;
  const [page] = splitReply(fenceIt('html title="Agentic RAG"', "<!doctype html><html><body><canvas></canvas></body></html>"));
  assert.deepEqual([page.type, page.title], ["html", "Agentic RAG"]);
  assert.equal(splitReply(fenceIt("html", "<b>bold</b>"))[0].type, "code");
  assert.equal(splitReply(fenceIt("jsx", "export default function App() { return null; }"))[0].type, "react");
  assert.equal(splitReply(fenceIt("jsx", "<Button onClick={go} />"))[0].type, "code");
  assert.equal(splitReply(fenceIt("svg", '<svg viewBox="0 0 10 10"><circle r="4"/></svg>'))[0].type, "svg");
});

test("flow artifacts normalize nodes, edges, groups and steps", () => {
  const flow = normalizeArtifact({
    type: "reactflow",
    direction: "top-bottom",
    nodes: [{ id: "q", label: "Question", kind: "Input", group: "in" }, "llm", { id: "vs", label: "Vector store", type: "store" }],
    edges: ["q -> llm", ["llm", "vs", "search"], { from: "vs", to: "llm" }, { from: "q", to: "ghost" }],
    groups: [{ id: "rag", label: "RAG", nodes: ["vs", "llm"] }],
    steps: [{ title: "Ask", nodes: ["q"], edges: ["q -> llm"] }, { nodes: [] }],
  });
  assert.equal(flow.type, "flow");
  assert.equal(flow.direction, "TB");
  assert.equal(flow.nodes[0].kind, "input");
  assert.equal(flow.edges.length, 3);
  assert.equal(flow.edges[1].label, "search");
  assert.deepEqual(flow.groups.map((group) => [group.id, group.nodes]), [["rag", ["llm", "vs"]], ["in", ["q"]]]);
  assert.deepEqual(flow.steps, [{ title: "Ask", note: "", nodes: ["q"], edges: ["q->llm"] }]);
});

test("tree, graph, bars and linked-list artifacts normalize from loose shapes", () => {
  const tree = normalizeArtifact({ type: "bst", tree: [2, 1, 3], frames: [{ highlight: [1] }, { tree: [2, 1, 3, null, null, null, 4], note: "insert 4" }] });
  assert.equal(tree.frames.length, 2);
  assert.deepEqual(tree.frames[0].tree, [2, 1, 3]);
  const graph = normalizeArtifact({ type: "graph", edges: [["A", "B", 3], { u: "B", v: "C" }], frames: [{ current: ["A"], path: [["A", "B"]] }] });
  assert.deepEqual(graph.nodes.map((node) => node.id), ["A", "B", "C"]);
  assert.equal(graph.weighted, true);
  assert.deepEqual(graph.frames[0].path, ["A->B"]);
  const bars = normalizeArtifact({ type: "histogram", heights: [2, 0, 2], frames: [{ water: [0, 2, 0] }] });
  assert.deepEqual([bars.type, bars.frames[0].values, bars.frames[0].water], ["bars", [2, 0, 2], [0, 2, 0]]);
  const list = normalizeArtifact({ type: "linked_list", nodes: [1, 2, 3] });
  assert.deepEqual(list.frames[0].links, [[0, 1], [1, 2], [2, null]]);
  const reversed = normalizeArtifact({ type: "linked_list", frames: [{ nodes: [1, 2], next: [null, 0] }] });
  assert.deepEqual(reversed.frames[0].links, [[0, null], [1, 0]]);
  assert.equal(normalizeArtifact({ type: "bars", values: [] }), null);
});

test("the artifact guide teaches rich artifacts and visual choice", () => {
  const guide = artifactGuide(DSA_ARTIFACTS);
  assert.match(guide, /- tree \(animated binary tree\)/);
  assert.match(guide, /- bars \(animated bar chart\)/);
  assert.match(guide, /\`\`\`html title="Name"/);
  assert.match(guide, /reactflow \(v11/);
  assert.match(guide, /heights, water, prices → bars/);
  assert.match(artifactGuide(LESSON_ARTIFACTS), /- flow \(React Flow diagram with a walkthrough\)/);
});
