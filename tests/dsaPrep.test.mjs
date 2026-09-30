// Domain tests for the DSA hub prep sections (src/pages/dsa/prep/lib).
// Run: npm run test:dsa-prep
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import catalog from "../src/data/codelab/catalog.json" with { type: "json" };
import { buildAllTracks, enrollmentFor, groupProgress, itemStatus, nextItem, trackProgress } from "../src/pages/dsa/prep/lib/curriculum.js";
import { parseArticle, parseArticleIndex, topicFor } from "../src/pages/dsa/prep/lib/articles.js";
import { addDays, daysBetween, longestStreak, streakLength, weekStart } from "../src/pages/dsa/prep/lib/dates.js";

const problemBySlug = new Map(catalog.problems.map((problem) => [problem.slug, problem]));
const tracks = buildAllTracks(catalog.categories, problemBySlug);
const emptyState = { completed: new Set(), attempted: new Set(), recalled: new Set() };

test("every track's difficulty counts add up to its required total", () => {
  for (const track of tracks) {
    const { easy, medium, hard, other, required } = track.counts;
    assert.equal(easy + medium + hard + other, required, track.id);
    assert.equal(track.requiredSlugs.length, required, track.id);
    assert.ok(required > 0, `${track.id} has required items`);
  }
});

test("zero-to-hero covers every catalog problem that belongs to a pattern", () => {
  const z2h = tracks.find((track) => track.id === "zero-to-hero");
  const inPatterns = new Set(catalog.categories.flatMap((category) => category.patterns.flatMap((pattern) => pattern.problems)));
  assert.equal(z2h.counts.required, [...inPatterns].filter((slug) => problemBySlug.has(slug)).length);
});

test("interview refresher marks at most one medium and one hard required per pattern", () => {
  const track = tracks.find((entry) => entry.id === "interview-refresher");
  for (const module of track.modules) {
    for (const section of module.sections) {
      assert.ok(section.items.filter((item) => item.required).length <= 2, section.id);
    }
  }
  assert.ok(track.counts.optional > 0);
});

test("progress is measured against the enrollment snapshot, not the live track", () => {
  const track = tracks.find((entry) => entry.id === "pattern-sprint");
  const enrollment = { ...enrollmentFor(track), requiredSlugs: track.requiredSlugs.slice(0, 4), version: 0 };
  const state = { ...emptyState, completed: new Set(track.requiredSlugs.slice(0, 2)) };
  const progress = trackProgress(track, enrollment, state);
  assert.equal(progress.total, 4);
  assert.equal(progress.done, 2);
  assert.equal(progress.outdated, true);
});

test("item status prefers recalled over passed over attempted", () => {
  const slug = tracks[0].requiredSlugs[0];
  assert.equal(itemStatus(slug, emptyState), "new");
  assert.equal(itemStatus(slug, { ...emptyState, attempted: new Set([slug]) }), "attempted");
  assert.equal(itemStatus(slug, { ...emptyState, attempted: new Set([slug]), completed: new Set([slug]) }), "passed");
  assert.equal(itemStatus(slug, { ...emptyState, completed: new Set([slug]), recalled: new Set([slug]) }), "recalled");
});

test("nextItem skips solved items in track order and groupProgress counts required only", () => {
  const track = tracks.find((entry) => entry.id === "interview-refresher");
  const first = nextItem(track, emptyState);
  const solvedFirst = nextItem(track, { ...emptyState, completed: new Set([first.item.slug]) });
  assert.notEqual(first.item.slug, solvedFirst.item.slug);
  const section = track.modules[0].sections[0];
  assert.equal(groupProgress(section.items, emptyState).total, section.items.filter((item) => item.required).length);
});

test("article index parser reads the shipped README", () => {
  const rows = parseArticleIndex(readFileSync(new URL("../public/dsa/articles/README.md", import.meta.url), "utf8"));
  assert.ok(rows.length >= 150, `parsed ${rows.length} rows`);
  for (const row of rows) {
    assert.match(row.file, /\.md$/);
    assert.ok(row.title && !row.title.includes("**"));
    assert.ok(!row.keywords.includes("Test"));
  }
  assert.equal(topicFor("Arrays in Java").id, "language");
  assert.equal(topicFor("Daily Temperatures", ["Stacks"]).id, "stack");
});

test("article parser strips the metadata header and CMS cover image", () => {
  const parsed = parseArticle(readFileSync(new URL("../public/dsa/articles/daily-temperatures.md", import.meta.url), "utf8"));
  assert.equal(parsed.title, "Daily Temperatures");
  assert.match(parsed.description, /stacks/i);
  assert.deepEqual(parsed.keywords, ["Daily Temperatures", "Stacks"]);
  assert.ok(!parsed.body.includes("Cover Image"));
  assert.ok(!parsed.body.includes("[!NOTE]"));
  assert.ok(parsed.body.startsWith("## Problem Statement"));
});

test("date helpers are local-calendar and DST safe", () => {
  assert.equal(addDays("2026-03-07", 2), "2026-03-09");
  assert.equal(daysBetween("2026-10-30", "2026-11-02"), 3);
  assert.equal(weekStart("2026-09-23"), "2026-09-21");
  const days = new Set(["2026-09-20", "2026-09-21", "2026-09-22", "2026-09-10"]);
  assert.equal(streakLength(days, "2026-09-23"), 3);
  assert.equal(streakLength(days, "2026-09-25"), 0);
  assert.equal(longestStreak(days), 3);
});

import { applyEdit, makeNote, noteToMarkdown, purgeExpired, restore, trash, normalizeTags } from "../src/pages/dsa/prep/lib/notes.js";
import { addItem, exportLists, importLists, listProgress, makeList, moveItem, moveItemTo, removeItem } from "../src/pages/dsa/prep/lib/lists.js";

test("note edits detect stale versions instead of overwriting", () => {
  const note = makeNote({ id: "n1", title: "Two pointers", body: "a" }, "2026-09-01T00:00:00.000Z");
  const first = applyEdit(note, { body: "b" }, 1);
  assert.equal(first.ok, true);
  assert.equal(first.note.version, 2);
  const stale = applyEdit(first.note, { body: "c" }, 1);
  assert.equal(stale.ok, false);
  assert.equal(stale.conflict.body, "b");
  assert.equal(applyEdit(first.note, { title: "  " }, 2).note.title, "Untitled note");
  // An emptied tag field must store [], not "" (which rendered as a "#" chip).
  assert.deepEqual(applyEdit(first.note, { tags: "" }, 2).note.tags, []);
});

test("trash keeps notes for 30 days then purges; restore brings them back", () => {
  const note = makeNote({ id: "n2", title: "x" });
  const trashed = trash(note, "2026-09-01T00:00:00.000Z");
  assert.equal(purgeExpired([trashed], Date.parse("2026-09-20T00:00:00Z")).length, 1);
  assert.equal(purgeExpired([trashed], Date.parse("2026-10-02T00:00:00Z")).length, 0);
  assert.equal(restore(trashed).deletedAt, null);
  assert.deepEqual(normalizeTags("#Graph, dp , Graph,sliding window"), ["graph", "dp", "sliding-window"]);
  assert.match(noteToMarkdown(makeNote({ id: "n3", title: "T", body: "hello", tags: ["a"] })), /^---\ntitle: "T"\ntags: \["a"\][\s\S]*---\nhello\n$/);
});

test("lists are idempotent, reorderable and never own progress", () => {
  let list = makeList({ id: "l1", name: " Revision ", purpose: "revision" });
  assert.equal(list.name, "Revision");
  list = addItem(addItem(addItem(list, "a"), "b"), "a");
  assert.deepEqual(list.items.map((item) => item.slug), ["a", "b"]);
  list = addItem(list, "c");
  assert.deepEqual(moveItem(list, "c", -5).items.map((item) => item.slug), ["c", "a", "b"]);
  assert.deepEqual(moveItemTo(list, "a", "c").items.map((item) => item.slug), ["b", "c", "a"]);
  assert.deepEqual(listProgress(list, new Set(["b", "zzz"])), { done: 1, total: 3 });
  assert.deepEqual(removeItem(list, "b").items.map((item) => item.slug), ["a", "c"]);
  let n = 0;
  const round = importLists(exportLists([list]), new Set(["a", "c"]), () => `id${n++}`);
  assert.deepEqual(round[0].items.map((item) => item.slug), ["a", "c"]);
  assert.throws(() => importLists({ format: "nope" }, new Set(), () => "x"));
});

import { potdArchive, potdFor, potdOutcome } from "../src/pages/dsa/prep/lib/potd.js";
import { dueCards, gradeCard, newCard, gradePreview } from "../src/pages/dsa/prep/lib/review.js";
import { award, makeScorecard, parseScorecard, qualifyingDays, rankBoard, streakStats, totals, titleFor, evaluateAchievements, achievementStats } from "../src/pages/dsa/prep/lib/rewards.js";

const pool = catalog.problems.filter((problem) => problem.judgeAvailable).map((problem) => problem.slug);

test("POTD is deterministic, order-independent and doesn't repeat within the pool size", () => {
  assert.equal(potdFor("2026-09-23", pool), potdFor("2026-09-23", [...pool].reverse()));
  const year = potdArchive("2026-12-31", 300, pool).map((entry) => entry.slug);
  assert.equal(new Set(year).size, 300);
  const entry = { day: "2026-09-20", slug: "x" };
  assert.equal(potdOutcome(entry, [{ slug: "x", verdict: "accepted", day: "2026-09-20" }], "2026-09-23"), "on-time");
  assert.equal(potdOutcome(entry, [{ slug: "x", verdict: "accepted", day: "2026-09-21" }], "2026-09-23"), "late");
  assert.equal(potdOutcome(entry, [{ slug: "x", verdict: "wrong_answer", day: "2026-09-20" }], "2026-09-23"), "attempted");
  assert.equal(potdOutcome(entry, [], "2026-09-23"), "missed");
  assert.equal(potdOutcome({ day: "2026-09-23", slug: "x" }, [], "2026-09-23"), "open");
});

test("review intervals grow with good grades and reset on again", () => {
  let card = newCard("a", "2026-09-01");
  assert.equal(card.dueDay, "2026-09-02");
  card = gradeCard(card, "good", "2026-09-02");
  assert.equal(card.dueDay, "2026-09-05");
  card = gradeCard(card, "good", "2026-09-05");
  assert.equal(card.dueDay, "2026-09-12");
  const hard = gradeCard(card, "hard", "2026-09-12");
  assert.equal(hard.dueDay, "2026-09-16");
  card = gradeCard(card, "again", "2026-09-12");
  assert.equal(card.dueDay, "2026-09-13");
  assert.equal(card.lapses, 1);
  assert.deepEqual(gradePreview(newCard("b", "2026-09-01"), "2026-09-02"), { again: 1, hard: 1, good: 3, easy: 7 });
  assert.deepEqual(dueCards({ a: card, b: newCard("b", "2026-09-20") }, "2026-09-14").map((entry) => entry.slug), ["a"]);
});

test("the ledger pays each (rule, source) once and totals by local period", () => {
  let ledger = [];
  ledger = award(ledger, { ruleId: "first_accept", sourceKey: "two-sum", points: 10, at: new Date(2026, 8, 20, 23, 30) }).ledger;
  const again = award(ledger, { ruleId: "first_accept", sourceKey: "two-sum", points: 10 });
  assert.equal(again.entry, null);
  assert.equal(again.ledger.length, 1);
  assert.equal(award(ledger, { ruleId: "nope", sourceKey: "x", points: 5 }).entry, null);
  assert.equal(award(ledger, { ruleId: "potd", sourceKey: "x", points: 0 }).entry, null);
  ledger = award(ledger, { ruleId: "potd", sourceKey: "2026-08-30", points: 15, at: new Date(2026, 7, 30, 10) }).ledger;
  assert.equal(ledger[0].day, "2026-09-20");
  assert.deepEqual({ ...totals(ledger, "2026-09-23"), byRule: undefined }, { total: 25, month: 10, week: 10, byRule: undefined });
  assert.equal(titleFor(0), "Unranked");
  assert.equal(titleFor(250), "Gold");
});

test("streaks count accepted work and reviews, not runs or reading", () => {
  const subs = [
    { verdict: "accepted", day: "2026-09-21" },
    { verdict: "wrong_answer", day: "2026-09-22" },
  ];
  const ledger = [{ ruleId: "review", day: "2026-09-22" }, { ruleId: "potd", day: "2026-09-19" }];
  assert.deepEqual([...qualifyingDays(subs, ledger)].sort(), ["2026-09-21", "2026-09-22"]);
  assert.equal(streakStats(subs, ledger, "2026-09-23").current, 2);
});

test("achievements are derived from history", () => {
  const completed = new Set(catalog.categories[0].patterns[0].problems);
  const stats = achievementStats({ completed, recalled: new Set(), submissions: [], ledger: [], categories: catalog.categories, problemBySlug });
  assert.equal(stats.patternsDone >= 1, true);
  const byId = Object.fromEntries(evaluateAchievements(stats).map((entry) => [entry.id, entry]));
  assert.equal(byId["pattern-1"].earned, true);
  assert.equal(byId["streak-7"].earned, false);
});

test("scorecards validate input and rank deterministically", () => {
  const mine = makeScorecard({ handle: "me", ledger: [], submissions: [], solved: 3, today: "2026-09-23", now: new Date("2026-09-23T10:00:00Z") });
  assert.throws(() => parseScorecard("{bad"), /valid/);
  assert.throws(() => parseScorecard({ format: "other" }), /scorecard/);
  const peer = parseScorecard(JSON.stringify({ format: "dsa-prep-scorecard", handle: "amy", total: -5, month: { key: "2026-09", points: 40 }, generatedAt: "2026-09-22T00:00:00Z" }));
  assert.equal(peer.total, 0);
  const tie = { ...peer, handle: "bob", generatedAt: "2026-09-23T00:00:00Z" };
  const board = rankBoard([mine, tie, peer], "month", "2026-09");
  assert.deepEqual(board.map((row) => row.handle), ["amy", "bob", "me"]);
  assert.equal(rankBoard([{ ...peer, month: { key: "2026-08", points: 99 } }], "month", "2026-09")[0].score, 0);
});

import { buildPlan, dayCapacity, defaultGoal, isTaskDone, missedTasks, planProgress, rebalancePlan, validateGoal } from "../src/pages/dsa/prep/lib/planner.js";

const sprint = tracks.find((track) => track.id === "pattern-sprint");
const planCtx = { problemBySlug, completed: new Set(), now: Date.parse("2026-09-21T08:00:00Z") };
const workByDay = (plan) => plan.tasks.filter((task) => task.kind === "problem").reduce((map, task) => ({ ...map, [task.day]: (map[task.day] || 0) + task.minutes }), {});

test("planner is deterministic and never exceeds a day's work capacity", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2026-12-31" };
  const a = buildPlan(goal, sprint, planCtx);
  const b = buildPlan(goal, sprint, planCtx);
  assert.deepEqual(a.tasks, b.tasks);
  for (const [day, minutes] of Object.entries(workByDay(a))) assert.ok(minutes <= dayCapacity(goal, day).work, `${day}: ${minutes}`);
  assert.equal(a.unscheduled.length, 0);
  assert.equal(new Set(a.tasks.filter((t) => t.kind === "problem").map((t) => t.slug)).size, a.stats.problems);
});

test("items within a module stay in track order and rest days stay empty", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2027-03-31", weeklyMinutes: [0, 90, 90, 0, 90, 90, 0] };
  const plan = buildPlan(goal, sprint, planCtx);
  for (const module of sprint.modules) {
    const order = module.sections.flatMap((section) => section.items.filter((item) => item.required && !item.repeat).map((item) => item.slug));
    const days = order.map((slug) => plan.tasks.find((task) => task.slug === slug)?.day).filter(Boolean);
    assert.deepEqual(days, [...days].sort(), module.id);
  }
  assert.ok(plan.tasks.every((task) => ![0, 3, 6].includes(new Date(`${task.day}T12:00:00`).getDay())));
});

test("an infeasible deadline reports what doesn't fit and a date that would", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2026-10-04" };
  const plan = buildPlan(goal, sprint, planCtx);
  assert.ok(plan.unscheduled.length > 0);
  assert.equal(plan.warnings[0].kind, "infeasible");
  assert.ok(plan.suggestedDate > goal.targetDate);
  assert.equal(buildPlan({ ...goal, targetDate: plan.suggestedDate }, sprint, planCtx).unscheduled.length, 0);
});

test("problems longer than any study day are flagged, not split", () => {
  const goal = { ...defaultGoal("2026-09-21"), weeklyMinutes: [45, 45, 45, 45, 45, 45, 45], targetDate: "2027-06-01" };
  const plan = buildPlan(goal, sprint, planCtx);
  const tooLong = plan.warnings.find((warning) => warning.kind === "too-long");
  assert.ok(tooLong && tooLong.slugs.length > 0);
  assert.ok(plan.tasks.filter((task) => task.kind === "problem").every((task) => task.minutes <= dayCapacity(goal, task.day).work));
  assert.deepEqual(validateGoal({ ...goal, weeklyMinutes: [0, 0, 0, 0, 0, 0, 0] }, "2026-09-21"), ["Give at least one day some study time."]);
});

test("rebalancing keeps done and pinned work, moves missed work forward, never duplicates", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2027-01-31" };
  const plan = buildPlan(goal, sprint, planCtx);
  const work = plan.tasks.filter((task) => task.kind === "problem");
  const today = "2026-09-28";
  const past = work.filter((task) => task.day < today);
  const doneTask = past[0];
  const pinnedTask = work.find((task) => task.day > "2026-10-10");
  const taskState = { [doneTask.id]: { done: true }, [pinnedTask.id]: { pinned: true } };
  assert.equal(missedTasks(plan, taskState, new Set(), today).length, past.length - 1);
  const next = rebalancePlan(plan, sprint, { taskState, completed: new Set(), today, problemBySlug, now: planCtx.now });
  const nextWork = next.tasks.filter((task) => task.kind === "problem");
  assert.equal(new Set(nextWork.map((task) => task.slug)).size, nextWork.length);
  assert.equal(nextWork.length, work.length);
  assert.equal(nextWork.find((task) => task.slug === doneTask.slug).day, doneTask.day);
  assert.equal(nextWork.find((task) => task.slug === pinnedTask.slug).day, pinnedTask.day);
  assert.ok(nextWork.filter((task) => task.id !== doneTask.id).every((task) => task.day >= today));
  assert.ok(next.moved.length >= past.length - 1);
  for (const [day, minutes] of Object.entries(workByDay(next))) if (day >= today) assert.ok(minutes <= dayCapacity(goal, day).work, day);
  assert.equal(planProgress(next, taskState, new Set(), today).done, 1);
});

test("already-solved problems are skipped when asked", () => {
  const goal = { ...defaultGoal("2026-09-21"), targetDate: "2027-01-31" };
  const solved = new Set(sprint.requiredSlugs.slice(0, 10));
  const plan = buildPlan(goal, sprint, { ...planCtx, completed: solved });
  assert.equal(plan.stats.problems, sprint.requiredSlugs.length - 10);
  assert.equal(buildPlan({ ...goal, skipSolved: false }, sprint, { ...planCtx, completed: solved }).stats.problems, sprint.requiredSlugs.length);
});

import { addRevision, exportEntries, hasUnsavedChanges, languageOf, validateName } from "../src/pages/dsa/prep/lib/codespace.js";
import { applyTransition, bugToMarkdown, canTransition, sanitizeUrl } from "../src/pages/dsa/prep/lib/bugs.js";

test("CodeSpace rejects traversal, reserved and duplicate names", () => {
  assert.equal(validateName("solution.py", []), null);
  assert.match(validateName("../etc/passwd", []), /slashes/);
  assert.match(validateName("a/b.py", []), /slashes/);
  assert.match(validateName("CON.txt", []), /reserved/);
  assert.match(validateName(".hidden", []), /start/);
  assert.match(validateName("Solution.PY", ["solution.py"]), /already/);
  assert.match(validateName("noext", [], { requireExtension: true }), /extension/);
  assert.equal(languageOf("a.cpp").run, "cpp17");
  assert.equal(languageOf("notes.md").run, null);
});

test("revisions skip identical content and track unsaved changes", () => {
  let file = { id: "f", name: "a.py", content: "print(1)", revisions: [] };
  file = addRevision(file, "first", "2026-09-01T00:00:00Z").file;
  assert.equal(file.revisions.length, 1);
  assert.equal(addRevision(file, "again").added, false);
  assert.equal(hasUnsavedChanges(file), false);
  assert.equal(hasUnsavedChanges({ ...file, content: "print(2)" }), true);
  const state = { folders: [{ id: "d", name: "graphs" }], files: [{ ...file, folderId: "d" }, { ...file, id: "g", name: "b.py", folderId: null, deletedAt: "x" }] };
  assert.deepEqual(exportEntries(state).map((entry) => entry.path), ["graphs/a.py"]);
});

test("bug reports redact secrets and follow the workflow", () => {
  assert.equal(sanitizeUrl("https://user:pw@example.com/p?id=3&token=abc#x"), "https://example.com/p?id=3&token=%5Bredacted%5D#x");
  assert.equal(sanitizeUrl("https://example.com/#access_token=zzz"), "https://example.com/");
  assert.equal(sanitizeUrl("not a url"), "not a url");
  const bug = { status: "new", timeline: [], title: "T", area: "Other", severity: "low" };
  assert.equal(canTransition("new", "fixed"), false);
  assert.throws(() => applyTransition(bug, "fixed"));
  assert.throws(() => applyTransition(bug, "duplicate"), /Pick/);
  const triaged = applyTransition(bug, "triaged", { note: "seen" });
  assert.equal(triaged.timeline[0].note, "seen");
  assert.match(bugToMarkdown(triaged), /^# T[\s\S]*_Not provided_/);
});

import { AREAS, TOPICS, buildMock, generateQuestion, practiceSet, scoreSession } from "../src/pages/dsa/prep/lib/aptitude.js";

test("every aptitude generator yields four distinct options with a valid, explained answer", () => {
  for (const topic of Object.keys(TOPICS)) {
    for (let seed = 0; seed < 60; seed += 1) {
      const q = generateQuestion(topic, `s${seed}`, seed);
      assert.equal(q.options.length, 4, `${topic}#${seed}`);
      assert.equal(new Set(q.options).size, 4, `${topic}#${seed}: ${q.options}`);
      assert.ok(q.answer >= 0 && q.answer < 4, `${topic}#${seed}`);
      assert.ok(q.prompt && q.explanation && q.seconds > 0);
      assert.ok(!/NaN|undefined|Infinity/.test(`${q.prompt}${q.options}${q.explanation}`), `${topic}#${seed}: ${q.prompt} ${q.options} ${q.explanation}`);
    }
  }
  assert.deepEqual(generateQuestion("clocks", "x", 1), generateQuestion("clocks", "x", 1));
});

test("computed answers are independently correct for clocks, calendars and remainders", () => {
  for (let seed = 0; seed < 80; seed += 1) {
    const clock = generateQuestion("clocks", `c${seed}`, seed);
    const [, h, m] = clock.prompt.match(/at (\d+):(\d+)/).map(Number);
    const raw = Math.abs(30 * (h % 12) - 5.5 * m);
    assert.equal(clock.options[clock.answer], `${Math.min(raw, 360 - raw)}°`.replace(/\.0°/, "°"));

    const cal = generateQuestion("calendars", `d${seed}`, seed);
    const [, day, month, year] = cal.prompt.match(/was (\d+) (\w+) (\d+)\?/);
    const date = new Date(`${month} ${day}, ${year} 12:00:00`);
    assert.equal(cal.options[cal.answer], date.toLocaleDateString("en-US", { weekday: "long" }));

    const rem = generateQuestion("remainders", `r${seed}`, seed);
    const [, base, power] = rem.prompt.match(/when (\d+)\^(\d+)/).map(Number);
    assert.equal(rem.options[rem.answer], String(BigInt(base) ** BigInt(power) % 5n));
  }
});

test("practice sets and mocks are reproducible, distinct and scored by a frozen policy", () => {
  assert.equal(AREAS.length, 3);
  const set = practiceSet("percentages", 1);
  assert.equal(set.length, 10);
  assert.equal(new Set(set.map((q) => q.prompt)).size, 10);
  assert.deepEqual(practiceSet("percentages", 1), set);
  assert.equal(practiceSet("synonyms", 2).length, 10);
  const mock = buildMock("mixed", "seed-1", 20);
  assert.equal(mock.length, 20);
  assert.ok(new Set(mock.map((q) => q.topic)).size >= 10);
  const answers = { [mock[0].id]: { choice: mock[0].answer }, [mock[1].id]: { choice: (mock[1].answer + 1) % 4 } };
  const result = scoreSession(mock, answers);
  assert.deepEqual([result.correct, result.wrong, result.skipped, result.score], [1, 1, 18, 0.75]);
  assert.equal(scoreSession(mock, answers, { correct: 4, wrong: -1, skipped: 0 }).score, 3);
});

import { appealReport, applyModeration, applyVote, buildThread, importPosts, exportPosts, makeReport, redactContacts, resolveReport, sortPosts, validateExperience, validatePost } from "../src/pages/dsa/prep/lib/community.js";
import { aggregateCompanies } from "../src/pages/dsa/prep/lib/companies.js";

const experience = (company, rounds, extra = {}) => ({ id: `${company}-${Math.random()}`, type: "experience", status: "published", title: "x", body: "", createdAt: "2026-09-01T00:00:00Z", comments: [], experience: { company, role: "SDE-1", outcome: "offer", consent: true, rounds, ...extra } });

test("votes are one-per-person replacements and ranking modes behave", () => {
  let votes = applyVote({}, "p1", 1);
  assert.deepEqual(applyVote(votes, "p1", 1), {});
  assert.deepEqual(applyVote(votes, "p1", -1), { p1: -1 });
  votes = { p2: 1 };
  const now = Date.parse("2026-09-23T12:00:00Z");
  const posts = [
    { id: "p1", createdAt: "2026-09-23T11:00:00Z", comments: [] },
    { id: "p2", createdAt: "2026-09-20T11:00:00Z", comments: [{ id: "c", status: "published" }, { id: "d", status: "removed" }] },
  ];
  assert.deepEqual(sortPosts(posts, "recent", votes, now).map((p) => p.id), ["p1", "p2"]);
  assert.deepEqual(sortPosts(posts, "top", votes, now).map((p) => p.id), ["p2", "p1"]);
  assert.deepEqual(sortPosts(posts, "discussed", votes, now).map((p) => p.id), ["p2", "p1"]);
  assert.deepEqual(sortPosts(posts, "trending", votes, now).map((p) => p.id), ["p1", "p2"]);
});

test("reply depth is bounded", () => {
  const c = (id, parentId, minute) => ({ id, parentId, createdAt: `2026-09-01T00:0${minute}:00Z` });
  const roots = buildThread([c("a", null, 0), c("b", "a", 1), c("c", "b", 2), c("d", "c", 3), c("e", "d", 4)]);
  assert.equal(roots.length, 1);
  const level2 = roots[0].replies[0].replies;
  assert.deepEqual(level2.map((x) => x.id), ["c", "d", "e"]);
  assert.ok(level2.every((x) => x.replies.length === 0));
});

test("posts are validated and contact details redacted, but big numbers survive", () => {
  assert.ok(validatePost({ type: "discussion", title: "short", body: "tiny" }).length >= 2);
  const links = Array.from({ length: 6 }, (_, i) => `https://e.com/${i}`).join(" ");
  assert.ok(validatePost({ type: "discussion", title: "A fine title here", body: `${links} and enough words to pass.` }).some((e) => /links/.test(e)));
  assert.ok(validatePost({ type: "discussion", title: "Same title here", body: "Same body with enough characters." }, [{ id: "x", title: "Same title here", body: "Same body with enough characters." }]).some((e) => /identical/.test(e)));
  const exp = { company: "Acme", role: "SDE", consent: true, rounds: [{ type: "Technical", summary: "Two pointers on arrays", durationMinutes: 0 }] };
  assert.ok(validateExperience(exp).some((e) => /blank/.test(e)));
  assert.deepEqual(validateExperience({ ...exp, rounds: [{ ...exp.rounds[0], durationMinutes: null }] }), []);
  const redacted = redactContacts("mail me at a.b@x.io or +91 98765 43210, or 9876543210. n <= 1000000000 and 10^9.");
  assert.equal(redacted.count, 3);
  assert.match(redacted.text, /1000000000/);
  assert.doesNotMatch(redacted.text, /a\.b@x\.io|98765/);
});

test("moderation decisions are logged, hide content and can be appealed once", () => {
  const posts = [{ id: "p", status: "published", comments: [{ id: "c", status: "published" }] }];
  let report = makeReport({ id: "r", targetType: "comment", targetId: "c", postId: "p", reason: "spam" });
  assert.throws(() => resolveReport(report, "upheld", ""), /reason/);
  report = resolveReport(report, "upheld", "Advertising");
  assert.equal(applyModeration(posts, report)[0].comments[0].status, "hidden");
  const appealed = appealReport(report, "It was a genuine tip");
  assert.equal(appealed.status, "open");
  assert.throws(() => appealReport({ ...appealed, status: "upheld" }, "again"), /already/);
  assert.deepEqual(appealed.log.map((entry) => entry.action), ["reported", "upheld", "appealed"]);
  const dismissed = resolveReport(appealed, "dismissed", "On review, fine");
  assert.equal(applyModeration(applyModeration(posts, report), dismissed)[0].comments[0].status, "published");
});

test("company pages count reports once per topic and label sample size", () => {
  const posts = [
    experience("Acme ", [{ type: "Technical", topics: ["Graphs", "graphs"], problems: ["3sum"] }, { type: "Technical", topics: ["DP"], problems: ["3sum"] }], { month: "2026-05", difficulty: 4 }),
    experience("acme", [{ type: "HR", topics: ["graphs"] }], { month: "2026-07", difficulty: 2, outcome: "rejected" }),
    { ...experience("Hidden Co", [{ type: "HR", topics: [] }]), status: "hidden" },
  ];
  const [acme, ...rest] = aggregateCompanies(posts);
  assert.equal(rest.length, 0);
  assert.equal(acme.reports, 2);
  assert.deepEqual(acme.topics[0], ["graphs", 2]);
  assert.deepEqual(acme.problems, [["3sum", 1]]);
  assert.equal(acme.avgDifficulty, 3);
  assert.equal(acme.latest, "2026-07");
  assert.equal(acme.confidence, "very low");
  assert.deepEqual(acme.outcomes, { offer: 1, rejected: 1 });
});

test("community export drops private author links; import rejects foreign files", () => {
  const exported = exportPosts([{ id: "a", status: "published", anonymous: true, authorName: "Me", authorId: "me", title: "t", body: "b", comments: [] }, { id: "h", status: "hidden", title: "t", body: "b" }]);
  assert.equal(exported.posts.length, 1);
  assert.equal(exported.posts[0].authorName, null);
  assert.equal("authorId" in exported.posts[0], false);
  assert.equal(importPosts(exported, new Set(), () => "n")[0].authorId, "imported");
  assert.equal(importPosts(exported, new Set(["a"]), () => "n").length, 0);
  assert.throws(() => importPosts({ format: "x" }, new Set(), () => "n"));
});

import { AIFS_PHASES } from "../src/data/aiFromScratchData.js";
import { buildIndex, filterLessons, neighbours, nextLesson, recordQuizResult, scoreQuiz, trackStats, typeFamily } from "../src/pages/dsa/prep/lib/aifs.js";
import { readFileSync as readAifsFile } from "node:fs";

test("AI from Scratch index covers every lesson once, per track, in reading order", () => {
  const index = buildIndex(AIFS_PHASES);
  const total = AIFS_PHASES.reduce((sum, phase) => sum + phase.lessons.length, 0);
  assert.equal(index.lessonBySlug.size, total);
  assert.equal(Object.values(index.order).reduce((sum, list) => sum + list.length, 0), total);
  const curriculum = index.order.curriculum;
  assert.deepEqual(neighbours(curriculum, curriculum[0]), { previous: null, next: curriculum[1] });
  assert.equal(neighbours(curriculum, curriculum.at(-1)).next, null);
  const phases = index.byTrack.curriculum;
  const progress = { [curriculum[0]]: 1, [curriculum[1]]: 1 };
  assert.equal(nextLesson(phases, progress).lesson.slug, curriculum[2]);
  const stats = trackStats(phases, progress, { [curriculum[0]]: { passedAt: "x" } });
  assert.equal(stats.done, 2);
  assert.equal(stats.quizzesPassed, 1);
  assert.ok(stats.minutesLeft > 0);
  assert.deepEqual(["Build (Capstone)", "Learn + Build", "Build + Learn", "Reference", ""].map(typeFamily), ["Capstone", "Learn", "Build", "Reference", "Other"]);
  assert.ok(filterLessons(phases[0], { status: "done", progress }).every((lesson) => progress[lesson.slug]));
});

test("lesson quizzes grade check + post questions, ignore the warm-up, and need 70%", () => {
  const bundle = JSON.parse(readAifsFile(new URL("../public/ai-from-scratch/bundle/00-setup-and-tooling/01-dev-environment.json", import.meta.url), "utf8"));
  const questions = bundle.quiz;
  const graded = questions.map((question, index) => ({ question, index })).filter(({ question }) => question.stage !== "pre");
  const allRight = Object.fromEntries(questions.map((question, index) => [index, question.correct]));
  assert.equal(scoreQuiz(questions, allRight).passed, true);
  const preWrong = { ...allRight, ...Object.fromEntries(questions.map((q, i) => [i, q]).filter(([, q]) => q.stage === "pre").map(([i, q]) => [i, (q.correct + 1) % q.options.length])) };
  assert.equal(scoreQuiz(questions, preWrong).passed, true, "warm-up answers don't count");
  const missing = { ...allRight };
  delete missing[graded[0].index];
  assert.equal(scoreQuiz(questions, missing).passed, false, "unanswered graded question blocks passing");
  const wrongCount = Math.ceil(graded.length * 0.31);
  const mostlyWrong = { ...allRight };
  graded.slice(0, wrongCount).forEach(({ question, index }) => { mostlyWrong[index] = (question.correct + 1) % question.options.length; });
  assert.equal(scoreQuiz(questions, mostlyWrong).passed, false);
  const first = recordQuizResult(null, scoreQuiz(questions, mostlyWrong), "t1");
  const second = recordQuizResult(first, scoreQuiz(questions, allRight), "t2");
  const third = recordQuizResult(second, scoreQuiz(questions, mostlyWrong), "t3");
  assert.equal(first.passedAt, null);
  assert.equal(second.passedAt, "t2");
  assert.equal(third.passedAt, "t2");
  assert.equal(third.best, graded.length);
  assert.equal(third.attempts, 3);
});

test("passing an AI lesson quiz counts toward streaks and its achievement", () => {
  const ledger = [{ ruleId: "aifs_quiz", day: "2026-09-22" }, { ruleId: "aifs_quiz", day: "2026-09-23" }];
  assert.equal(streakStats([], ledger, "2026-09-23").current, 2);
  const stats = achievementStats({ completed: new Set(), recalled: new Set(), submissions: [], ledger, categories: catalog.categories, problemBySlug });
  assert.equal(stats.aifsQuizzes, 2);
  assert.equal(evaluateAchievements(stats).find((entry) => entry.id === "aifs-10").value, 2);
});

import { lessonChains, DEFAULT_LESSON_MINUTES } from "../src/pages/dsa/prep/lib/planner.js";

const aifsGoal = (patch = {}) => ({ ...defaultGoal("2026-09-21"), targetDate: "2027-03-31", aifs: { enabled: true, track: "curriculum", phaseIds: ["00-setup-and-tooling", "01-math-foundations"], share: 0.4 }, ...patch });
const aifsCtx = { ...planCtx, aifsPhases: AIFS_PHASES };

test("plans mix AI from Scratch lessons with problems at roughly the chosen share", () => {
  const plan = buildPlan(aifsGoal(), sprint, aifsCtx);
  assert.equal(plan.unscheduled.length, 0);
  const work = plan.tasks.filter((task) => task.kind !== "review");
  const lessons = work.filter((task) => task.kind === "lesson");
  assert.equal(lessons.length, 12 + 22);
  assert.equal(plan.stats.lessons, lessons.length);
  assert.equal(new Set(work.map((task) => task.id)).size, work.length);
  for (const [day, minutes] of Object.entries(workByDay(plan))) assert.ok(minutes <= dayCapacity(aifsGoal(), day).work, day);
  // Share holds over the first four weeks, while both streams still have work.
  const early = work.filter((task) => task.day < "2026-10-19");
  const lessonShare = early.filter((task) => task.kind === "lesson").reduce((sum, task) => sum + task.minutes, 0) / early.reduce((sum, task) => sum + task.minutes, 0);
  assert.ok(lessonShare > 0.3 && lessonShare < 0.5, `lesson share ${lessonShare}`);
  // Lessons stay in reading order within each phase.
  for (const phase of AIFS_PHASES.filter((entry) => ["00-setup-and-tooling", "01-math-foundations"].includes(entry.id))) {
    const days = phase.lessons.map((lesson) => lessons.find((task) => task.slug === lesson.slug).day);
    assert.deepEqual(days, [...days].sort(), phase.id);
  }
});

test("lesson-only plans, estimates, skipping done lessons and completion via shared progress", () => {
  const goal = aifsGoal({ includeDsa: false });
  const chains = lessonChains(goal, AIFS_PHASES, new Set(["00-setup-and-tooling/01-dev-environment"]));
  assert.equal(chains.flatMap((chain) => chain.items).length, 12 + 22 - 1);
  const zero = AIFS_PHASES.flatMap((phase) => phase.lessons).find((lesson) => !lesson.minutes && lesson.slug.startsWith("0"));
  if (zero) {
    const phase = AIFS_PHASES.find((entry) => entry.lessons.includes(zero));
    const item = lessonChains({ ...goal, aifs: { ...goal.aifs, phaseIds: [phase.id] } }, AIFS_PHASES).flatMap((chain) => chain.items).find((entry) => entry.slug === zero.slug);
    assert.equal(item.minutes, DEFAULT_LESSON_MINUTES);
    assert.equal(item.estimated, true);
  }
  const plan = buildPlan(goal, sprint, aifsCtx);
  assert.ok(plan.tasks.every((task) => task.kind !== "problem"));
  const first = plan.tasks.find((task) => task.kind === "lesson");
  assert.equal(isTaskDone(first, {}, new Set([first.slug])), true);
  assert.deepEqual(validateGoal({ ...goal, aifs: { ...goal.aifs, enabled: false } }, "2026-09-21"), ["Include DSA problems, AI from Scratch lessons, or both."]);
  assert.throws(() => buildPlan(goal, sprint, planCtx), /aren't loaded/);
});

test("rebalancing carries missed lessons forward alongside problems", () => {
  const goal = aifsGoal();
  const plan = buildPlan(goal, sprint, aifsCtx);
  const today = "2026-09-28";
  const missedLessons = plan.tasks.filter((task) => task.kind === "lesson" && task.day < today);
  assert.ok(missedLessons.length > 0);
  const next = rebalancePlan(plan, sprint, { taskState: {}, completed: new Set(), today, problemBySlug, aifsPhases: AIFS_PHASES, now: planCtx.now });
  const work = next.tasks.filter((task) => task.kind !== "review");
  assert.equal(work.length, plan.tasks.filter((task) => task.kind !== "review").length);
  assert.ok(missedLessons.every((task) => work.find((entry) => entry.id === task.id).day >= today));
  assert.throws(() => rebalancePlan(plan, sprint, { today, problemBySlug, now: planCtx.now }), /aren't loaded/);
});
