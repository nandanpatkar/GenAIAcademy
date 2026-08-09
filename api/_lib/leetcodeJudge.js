import manifestData from "../_data/codelabManifests.json" with { type: "json" };
import { buildPythonHarness, RESULT_MARKER } from "./pythonHarness.js";

const JDOODLE_URL = "https://api.jdoodle.com/v1/execute";

// Problems are addressed by slug. LeetCode-sourced ones also keep their
// question number so older clients (and deep links) that send a number resolve.
const manifestBySlug = new Map(manifestData.problems.map((problem) => [problem.slug, problem]));
const manifestByNumber = new Map(
  manifestData.problems
    .filter((problem) => Number.isInteger(problem.id))
    .map((problem) => [problem.id, problem]),
);
const rateBuckets = new Map();

export function getManifest(problemId) {
  if (typeof problemId === "string" && manifestBySlug.has(problemId)) {
    return manifestBySlug.get(problemId);
  }
  const asNumber = Number(problemId);
  return Number.isInteger(asNumber) ? manifestByNumber.get(asNumber) || null : null;
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body || "{}"); } catch { return {}; }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
}

export function allowRequest(req, action) {
  const now = Date.now();
  const ip = String(req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "anonymous").split(",")[0].trim();
  const key = `${action}:${ip}`;
  const limit = action === "submit" ? 12 : 30;
  const recent = (rateBuckets.get(key) || []).filter((stamp) => now - stamp < 60_000);
  if (recent.length >= limit) return false;
  recent.push(now);
  rateBuckets.set(key, recent);
  if (rateBuckets.size > 2_000) {
    for (const [bucketKey, stamps] of rateBuckets) {
      if (!stamps.some((stamp) => now - stamp < 60_000)) rateBuckets.delete(bucketKey);
    }
  }
  return true;
}

export function validateSubmission(body) {
  const problemId = body?.problemId;
  const isSlug = typeof problemId === "string" && /^[a-z0-9-]{1,80}$/.test(problemId);
  if (!isSlug && !Number.isInteger(Number(problemId))) return "A problemId slug is required.";
  if (typeof body?.code !== "string" || !body.code.trim()) return "Code is required.";
  if (body.code.length > 100_000) return "Code exceeds the 100KB submission limit.";
  return null;
}

export function buildHarness({ code, manifest, tests }) {
  const config = {
    entrypoint: manifest.entrypoint,
    serializers: manifest.serializers || {},
    operationSerializers: manifest.operationSerializers || {},
    judge: manifest.judge || { comparator: "deep-equal" },
    tests: tests.map((test, index) => ({
      id: String(test.id || `case-${index + 1}`).slice(0, 80),
      input: test.input && typeof test.input === "object" ? test.input : {},
      expected: test.expected,
      hidden: Boolean(test.hidden),
    })),
  };
  return buildPythonHarness(config, code);
}

export async function executeHarness(script) {
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    const error = new Error("The code runner is not configured.");
    error.code = "RUNNER_NOT_CONFIGURED";
    throw error;
  }
  if (script.length > 200_000) throw new Error("The generated submission exceeds the runner's 200KB limit.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let response;
  try {
    response = await fetch(JDOODLE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret, script, language: "python3", versionIndex: "5" }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Execution timed out before the runner responded.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `Execution service failed (HTTP ${response.status}).`);
  const output = String(data.output || "").slice(-1_000_000);
  const markerIndex = output.lastIndexOf(RESULT_MARKER);
  if (markerIndex < 0) {
    const syntaxError = /SyntaxError|IndentationError|TabError/.test(output);
    return { status: syntaxError ? "syntax_error" : "runtime_error", cases: [], summary: { passed: 0, failed: 1, total: 0 }, error: output.slice(-8000) || "The program ended before the judge produced a result.", runtime: data.cpuTime ?? null, memory: data.memory ?? null };
  }
  try {
    const resultLine = output.slice(markerIndex + RESULT_MARKER.length).split("\n")[0];
    return { ...JSON.parse(resultLine), runtime: data.cpuTime ?? null, memory: data.memory ?? null };
  } catch {
    throw new Error("The judge returned an unreadable result.");
  }
}

export function redactHiddenResults(result) {
  return {
    ...result,
    cases: (result.cases || []).map((test) => test.hidden ? {
      id: test.id,
      status: test.status,
      passed: test.passed,
      runtimeMs: test.runtimeMs,
      hidden: true,
      ...(test.passed ? {} : { error: test.error ? "The submission failed a hidden case at runtime." : "Your output did not match the expected result for this hidden case." }),
    } : test),
  };
}
