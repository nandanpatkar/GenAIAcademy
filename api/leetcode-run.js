import { allowRequest, buildHarness, executeHarness, getManifest, readJsonBody, validateSubmission } from "./_lib/leetcodeJudge.js";

export default async function handler(req, res) {
  res.setHeader("Allow", "POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!allowRequest(req, "run")) return res.status(429).json({ error: "Too many runs. Please wait a minute and try again." });
  const body = await readJsonBody(req);
  const validationError = validateSubmission(body);
  if (validationError) return res.status(400).json({ error: validationError });
  const manifest = getManifest(body.problemId);
  if (!manifest) return res.status(404).json({ error: "Problem not found." });
  if (!manifest.judgeAvailable) return res.status(422).json({ error: "Executable test metadata is not available for this problem yet." });
  // Treat an omitted or empty selection as "run all visible tests". The UI can
  // briefly have no active case while switching problems, and that should not
  // turn an otherwise valid run into a 400 response.
  const requested = Array.isArray(body.caseIds) && body.caseIds.length
    ? new Set(body.caseIds.map(String))
    : null;
  const visible = manifest.visibleTests.filter((test) => !requested || requested.has(String(test.id)));
  const custom = Array.isArray(body.customCases) ? body.customCases.slice(0, 5).map((test, index) => ({ ...test, id: `custom-${index + 1}` })) : [];
  if (JSON.stringify(custom).length > 20_000) return res.status(413).json({ error: "Custom test cases exceed the 20KB limit." });
  // A stale case id can survive a problem switch in an already-open tab. In
  // that situation, fall back to the visible suite instead of returning a 400.
  const tests = visible.length || custom.length ? [...visible, ...custom] : manifest.visibleTests;
  if (!tests.length) return res.status(400).json({ error: "Select at least one test case." });
  try {
    const result = await executeHarness(buildHarness({ code: body.code, manifest, tests }));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.code === "RUNNER_NOT_CONFIGURED" ? 503 : 502).json({ error: error.message || "Execution failed." });
  }
}
