import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const publicData = JSON.parse(await readFile(new URL("../src/data/leetcode/problemManifests.json", import.meta.url), "utf8"));
const serverData = JSON.parse(await readFile(new URL("../api/_data/leetcodeManifests.json", import.meta.url), "utf8"));

assert.equal(publicData.schemaVersion, 1, "Unsupported public manifest schema");
assert.equal(serverData.schemaVersion, 1, "Unsupported server manifest schema");
assert.equal(publicData.problems.length, serverData.problems.length, "Public/server problem counts differ");
assert.ok(serverData.problems.length >= 280, "Expected the complete numbered LeetCode corpus");

const ids = new Set();
for (const problem of serverData.problems) {
  assert.ok(Number.isInteger(problem.id), "Every problem needs an integer ID");
  assert.ok(!ids.has(problem.id), `Duplicate problem ID ${problem.id}`);
  ids.add(problem.id);
  assert.ok(problem.title && problem.sourcePath, `Problem ${problem.id} is missing metadata`);
  assert.ok(["solution-method", "class-operations", "codec-roundtrip", "unsupported"].includes(problem.entrypoint?.kind), `Problem ${problem.id} has an invalid entrypoint`);
  assert.ok(Array.isArray(problem.visibleTests) && Array.isArray(problem.hiddenTests), `Problem ${problem.id} has invalid tests`);
  const caseIds = new Set();
  for (const test of [...problem.visibleTests, ...problem.hiddenTests]) {
    assert.ok(test.id && !caseIds.has(test.id), `Problem ${problem.id} has a duplicate/empty case ID`);
    caseIds.add(test.id);
    assert.ok(test.input && typeof test.input === "object" && !Array.isArray(test.input), `Problem ${problem.id}/${test.id} input must be an object`);
    assert.ok(Object.hasOwn(test, "expected"), `Problem ${problem.id}/${test.id} needs expected output`);
  }
  if (problem.judgeAvailable) {
    assert.ok(problem.visibleTests.length > 0, `Problem ${problem.id} is enabled without visible tests`);
    assert.notEqual(problem.entrypoint.kind, "unsupported", `Problem ${problem.id} is enabled without an entrypoint`);
  }
}

for (const problem of publicData.problems) {
  assert.ok(!Object.hasOwn(problem, "hiddenTests"), `Public problem ${problem.id} exposes hidden tests`);
}

const enabled = serverData.problems.filter((problem) => problem.judgeAvailable).length;
assert.equal(enabled, serverData.problems.length, `Judge coverage regressed: only ${enabled} of ${serverData.problems.length} problems are enabled`);
console.log(`Validated ${serverData.problems.length} manifests (${enabled} judge-enabled); hidden tests are server-only.`);
