import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const catalog = JSON.parse(await readFile(new URL("../src/data/codelab/catalog.json", import.meta.url), "utf8"));
const server = JSON.parse(await readFile(new URL("../api/_data/codelabManifests.json", import.meta.url), "utf8"));
const payloadDir = fileURLToPath(new URL("../public/codelab/problems/", import.meta.url));

const VALID_ENTRYPOINTS = new Set([
  "solution-method", "class-operations", "codec-roundtrip",
  "linked-list-cycle", "clone-graph", "multilevel-flatten",
]);

assert.equal(server.schemaVersion, 2, "Unsupported server manifest schema");
assert.ok(catalog.problems.length >= 300, "Expected the full pattern-wise corpus");
assert.equal(catalog.problems.length, server.problems.length, "Catalog/server problem counts differ");

const catalogSlugs = new Set();
for (const problem of catalog.problems) {
  assert.ok(/^[a-z0-9-]+$/.test(problem.slug), `Invalid slug ${problem.slug}`);
  assert.ok(!catalogSlugs.has(problem.slug), `Duplicate slug ${problem.slug}`);
  catalogSlugs.add(problem.slug);
  assert.ok(problem.title, `${problem.slug} is missing a title`);
  assert.ok(["Easy", "Medium", "Hard"].includes(problem.difficulty), `${problem.slug} has an odd difficulty`);
  assert.ok(problem.patterns?.length, `${problem.slug} is not attached to a pattern`);
  assert.ok(problem.testCount > 0, `${problem.slug} has no tests`);
  assert.ok(existsSync(`${payloadDir}${problem.slug}.json`), `${problem.slug} has no payload file`);
}

// Every problem referenced by the navigation tree must exist in the index.
let placements = 0;
for (const category of catalog.categories) {
  assert.ok(category.patterns.length, `Category ${category.title} has no patterns`);
  for (const pattern of category.patterns) {
    for (const slug of pattern.problems) {
      placements += 1;
      assert.ok(catalogSlugs.has(slug), `${category.title}/${pattern.title} references unknown problem ${slug}`);
    }
  }
}
assert.ok(placements >= catalogSlugs.size, "Navigation tree is missing problems");

for (const problem of server.problems) {
  assert.ok(catalogSlugs.has(problem.slug), `Server manifest ${problem.slug} is not in the catalog`);
  assert.ok(VALID_ENTRYPOINTS.has(problem.entrypoint?.kind), `${problem.slug} has an invalid entrypoint`);
  assert.ok(problem.judge?.comparator, `${problem.slug} has no comparator`);
  assert.ok(Array.isArray(problem.visibleTests) && Array.isArray(problem.hiddenTests), `${problem.slug} has invalid tests`);
  assert.ok(problem.judgeAvailable, `${problem.slug} is not judge-enabled`);
  assert.ok(problem.visibleTests.length > 0, `${problem.slug} is enabled without visible tests`);

  const caseIds = new Set();
  for (const test of [...problem.visibleTests, ...problem.hiddenTests]) {
    assert.ok(test.id && !caseIds.has(test.id), `${problem.slug} has a duplicate/empty case ID`);
    caseIds.add(test.id);
    assert.ok(test.input && typeof test.input === "object" && !Array.isArray(test.input), `${problem.slug}/${test.id} input must be an object`);
    assert.ok(Object.hasOwn(test, "expected"), `${problem.slug}/${test.id} needs an expected output`);
  }

  if (problem.entrypoint.kind === "solution-method") {
    assert.ok(problem.entrypoint.methodName, `${problem.slug} has no method name`);
    for (const test of problem.visibleTests) {
      for (const name of problem.entrypoint.parameters) {
        assert.ok(Object.hasOwn(test.input, name), `${problem.slug}/${test.id} is missing argument "${name}"`);
      }
    }
  }
}

// Hidden cases exist to make Submit mean something; they must never ship to the client.
for (const problem of catalog.problems) {
  const payload = JSON.parse(await readFile(`${payloadDir}${problem.slug}.json`, "utf8"));
  assert.ok(!Object.hasOwn(payload, "hiddenTests"), `${problem.slug} payload exposes hidden tests`);
  assert.ok(payload.statement?.length > 40, `${problem.slug} payload has no statement`);
  assert.ok(payload.starterCode?.includes("class "), `${problem.slug} payload has no starter code`);
  assert.ok(payload.solution?.length > 20, `${problem.slug} payload has no reference solution`);
}

const withHidden = server.problems.filter((problem) => problem.hiddenTests.length).length;
console.log(`Validated ${server.problems.length} Code Lab manifests across ${catalog.counts.patterns} patterns (${withHidden} with hidden cases); payloads are statement-only.`);
