// Visual Learning ↔ practice link map (src/data/practice/visualLinks.json),
// its lookups (src/pages/dsa/prep/lib/visual.js) and the planner's
// pattern-intro tasks (src/pages/dsa/prep/lib/planner.js).
// Run: npm run test:dsa-prep
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import catalog from "../src/data/codelab/catalog.json" with { type: "json" };
import { CV_TRACKS } from "../src/data/chaiVisualCourseData.js";
import { buildAllTracks } from "../src/pages/dsa/prep/lib/curriculum.js";
import { buildPlan, defaultGoal, isTaskDone, isWork, planItems } from "../src/pages/dsa/prep/lib/planner.js";
import { buildVisualIndex, patternForProblems } from "../src/pages/dsa/prep/lib/visual.js";
import { SECTION_TRACKS, TRACK_SECTIONS, sectionForPath, trackForPath } from "../src/pages/dsa/prep/visual/sections.js";

const links = JSON.parse(readFileSync(new URL("../src/data/practice/visualLinks.json", import.meta.url), "utf8"));
const practice = JSON.parse(readFileSync(new URL("../src/data/practice/index.json", import.meta.url), "utf8"));
const problemIds = new Set(practice.problems.map((problem) => problem.id));
const topics = new Set(practice.topics.map((topic) => topic.name));
const lessonPaths = new Set(CV_TRACKS.flatMap((track) => track.groups.flatMap((group) => group.items.map((item) => item.path))));
const index = buildVisualIndex({ tracks: CV_TRACKS, links, problems: practice.problems });

test("every linked lesson exists in the course and every linked problem in the practice set", () => {
  for (const [path, ids] of Object.entries(links.byLesson)) {
    assert.ok(lessonPaths.has(path), `unknown lesson ${path}`);
    assert.ok(ids.length > 0, `${path} links to nothing`);
    ids.forEach((id) => assert.ok(problemIds.has(id), `${path} → unknown problem ${id}`));
  }
});

test("byProblem is the inverse of byLesson", () => {
  for (const [id, path] of Object.entries(links.byProblem)) {
    assert.ok(links.byLesson[path]?.includes(id), `${id} → ${path} is not in byLesson`);
  }
  for (const [path, ids] of Object.entries(links.byLesson)) {
    ids.forEach((id) => assert.ok(links.byProblem[id], `${path} → ${id} missing from byProblem`));
  }
});

test("pattern groups map to real practice topics and real intro lessons", () => {
  for (const [title, group] of Object.entries(links.groups)) {
    assert.ok(group.topics.length > 0, `${title} maps to no topic`);
    group.topics.forEach((topic) => assert.ok(topics.has(topic), `${title} → unknown topic ${topic}`));
    group.intros.forEach((path) => {
      assert.ok(lessonPaths.has(path), `${title} intro ${path} is not a lesson`);
      assert.equal(links.byLesson[path], undefined, `${path} is both an intro and a problem lesson`);
    });
  }
});

test("locked lessons are never linked", () => {
  links.locked.forEach((path) => assert.equal(links.byLesson[path], undefined, path));
});

test("the index resolves both directions", () => {
  const lesson = index.lessonForProblem("two-sum-ii-input-array-is-sorted");
  assert.equal(lesson?.path, "two-pointers/two-sum-ii");
  assert.deepEqual(index.problemsForLesson("two-pointers/two-sum-ii").map((problem) => problem.id), ["two-sum-ii-input-array-is-sorted"]);
  assert.equal(index.lessonForProblem("no-such-problem"), null);
  assert.ok(index.hasVisual("two-sum-ii-input-array-is-sorted"));
});

test("pattern problems start with the lesson's own and stay inside the pattern", () => {
  const problems = index.patternProblems("sliding-window/longest-substring-no-repeat");
  assert.equal(problems[0].id, "longest-substring-without-repeating-characters");
  assert.equal(new Set(problems.map((problem) => problem.id)).size, problems.length);
  const group = index.lessonByPath.get("sliding-window/longest-substring-no-repeat").group;
  const inGroup = new Set(group.items.flatMap((item) => links.byLesson[item.path] || []));
  problems.forEach((problem) => assert.ok(inGroup.has(problem.id), problem.id));
});

test("topic intros come from the pattern groups teaching that topic", () => {
  const intros = index.introsForTopic("Sliding Window / Two Pointers").map((lesson) => lesson.path);
  assert.ok(intros.includes("sliding-window/intro"));
  assert.ok(intros.includes("two-pointers/intro"));
  assert.deepEqual(index.introsForTopic("No such topic"), []);
});

test("neighbours stay inside one track", () => {
  const dsa = CV_TRACKS.find((track) => track.id === "dsa");
  const last = dsa.groups.at(-1).items.at(-1).path;
  assert.equal(index.neighbours(last).next, null);
  assert.equal(index.neighbours(dsa.groups[0].items[0].path).previous, null);
});

test("next unwatched walks the track in order", () => {
  const dsa = CV_TRACKS.find((track) => track.id === "dsa");
  const first = dsa.groups[0].items[0].path;
  assert.equal(index.nextUnwatched(dsa, new Set()).path, first);
  assert.equal(index.nextUnwatched(dsa, new Set([first])).path, dsa.groups[0].items[1].path);
});

// ── Pattern lookup and planner intros ─────────────────────────────────────

test("patternForProblems needs two problems from one pattern", () => {
  const pattern = patternForProblems(links, ["longest-substring-without-repeating-characters", "maximum-points-you-can-obtain-from-cards-"]);
  assert.equal(pattern?.title, "Sliding Window");
  assert.ok(pattern.intros.some((intro) => intro.path === "sliding-window/intro" && intro.title));
  assert.equal(patternForProblems(links, ["longest-substring-without-repeating-characters"]), null);
  assert.equal(patternForProblems(links, ["no-such-problem", "another"]), null);
});

const problemBySlug = new Map(catalog.problems.map((problem) => [problem.slug, problem]));
const sprint = buildAllTracks(catalog.categories, problemBySlug).find((track) => track.id === "pattern-sprint");
const visualIntros = (slugs) => patternForProblems(links, slugs)?.intros || [];
const ctx = { problemBySlug, completed: new Set(), visualIntros, now: Date.parse("2026-09-21T08:00:00Z") };

test("planned intros open their section, once per plan", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2027-06-30" };
  const chains = planItems(goal, sprint, ctx);
  const items = chains.flatMap((chain) => chain.items);
  const visuals = items.filter((item) => item.kind === "visual");
  assert.ok(visuals.length > 0, "the sprint gets at least one intro");
  assert.equal(new Set(visuals.map((item) => item.slug)).size, visuals.length, "no intro planned twice");
  visuals.forEach((item) => {
    assert.ok(lessonPaths.has(item.slug), item.slug);
    const chain = chains.find((entry) => entry.items.includes(item));
    const at = chain.items.indexOf(item);
    const nextProblem = chain.items.slice(at).find((entry) => entry.kind === "problem");
    assert.ok(nextProblem, `${item.slug} is followed by a problem`);
  });
});

test("intros stay out of plans that didn't ask for them", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2027-06-30", visualIntros: undefined };
  assert.equal(planItems(goal, sprint, ctx).flatMap((chain) => chain.items).filter((item) => item.kind === "visual").length, 0);
  const noLookup = { ...ctx, visualIntros: null };
  assert.equal(planItems(defaultGoal("2026-09-21"), sprint, noLookup).flatMap((chain) => chain.items).filter((item) => item.kind === "visual").length, 0);
});

test("watched intros are skipped with skipSolved and tick their task off", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2027-06-30" };
  const plan = buildPlan(goal, sprint, ctx);
  const task = plan.tasks.find((entry) => entry.kind === "visual");
  assert.ok(task && isWork(task));
  assert.ok(isTaskDone(task, {}, new Set([task.slug])));
  const skipped = planItems({ ...goal, skipSolved: true }, sprint, { ...ctx, completed: new Set([task.slug]) }).flatMap((chain) => chain.items);
  assert.ok(!skipped.some((item) => item.slug === task.slug));
});

test("every lesson's path names the hub section of its own track", () => {
  for (const track of CV_TRACKS) {
    assert.ok(TRACK_SECTIONS[track.id], `${track.id} has no section`);
    assert.equal(SECTION_TRACKS[TRACK_SECTIONS[track.id]], track.id);
    track.groups.forEach((group) => group.items.forEach((item) => {
      assert.equal(trackForPath(item.path), track.id, item.path);
      assert.equal(sectionForPath(item.path), TRACK_SECTIONS[track.id], item.path);
    }));
  }
});
