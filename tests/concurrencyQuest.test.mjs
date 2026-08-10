import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { ASYNC_THEORY, MISSION_THEORY, QUEST_MISSIONS } from "../src/data/concurrencyScenarios.js";

const evaluate = (mission, code, output) => {
  const check = mission.check || {};
  if ((check.requiredCode || []).some((piece) => !code.includes(piece))) return false;
  if ((check.forbiddenCode || []).some((piece) => code.includes(piece))) return false;
  if ((check.outputIncludes || []).some((piece) => !output.includes(piece))) return false;

  let cursor = -1;
  for (const piece of check.outputOrder || []) {
    cursor = output.indexOf(piece, cursor + 1);
    if (cursor === -1) return false;
  }
  return true;
};

test("quest contains a progressive eight-mission curriculum", () => {
  assert.equal(QUEST_MISSIONS.length, 8);
  assert.equal(new Set(QUEST_MISSIONS.map((mission) => mission.id)).size, 8);
  assert.equal(QUEST_MISSIONS.reduce((sum, mission) => sum + mission.quiz.length, 0), 16);
});

test("every question has one valid answer", () => {
  for (const mission of QUEST_MISSIONS) {
    for (const question of mission.quiz) {
      assert.ok(question.options.length >= 3, `${mission.id} needs at least three choices`);
      assert.ok(question.answer >= 0 && question.answer < question.options.length, `${mission.id} has an invalid answer index`);
      assert.ok(question.explanation.length > 20, `${mission.id} needs an explanatory answer`);
    }
  }
});

test("beginner theory covers the async mental model and every mission", () => {
  assert.ok(ASYNC_THEORY.definition.includes("waiting"));
  assert.equal(ASYNC_THEORY.steps.length, 4);
  assert.ok(ASYNC_THEORY.glossary.some((item) => item.term === "await"));

  for (const mission of QUEST_MISSIONS) {
    const theory = MISSION_THEORY[mission.id];
    assert.ok(theory, `${mission.id} needs a theory section`);
    assert.ok(theory.paragraphs.length >= 2, `${mission.id} needs a beginner explanation`);
    assert.ok(theory.remember.length > 20, `${mission.id} needs a memorable summary`);
  }
});

test("every Python reference solution executes and passes its mission checks", () => {
  for (const mission of QUEST_MISSIONS) {
    const result = spawnSync("python3", ["-c", mission.solutionCode], {
      encoding: "utf8",
      timeout: 5000,
    });

    assert.equal(result.status, 0, `${mission.id} failed to execute:\n${result.stderr}`);
    assert.ok(evaluate(mission, mission.solutionCode, result.stdout), `${mission.id} did not satisfy its own grader:\n${result.stdout}`);
  }
});
