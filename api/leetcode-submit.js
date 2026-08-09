import { allowRequest, buildHarness, executeHarness, getManifest, readJsonBody, redactHiddenResults, validateSubmission } from "./_lib/leetcodeJudge.js";

export default async function handler(req, res) {
  res.setHeader("Allow", "POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!allowRequest(req, "submit")) return res.status(429).json({ error: "Too many submissions. Please wait a minute and try again." });
  const body = await readJsonBody(req);
  const validationError = validateSubmission(body);
  if (validationError) return res.status(400).json({ error: validationError });
  const manifest = getManifest(body.problemId);
  if (!manifest) return res.status(404).json({ error: "Problem not found." });
  if (!manifest.judgeAvailable) return res.status(422).json({ error: "This problem is not judge-enabled yet." });
  const tests = [
    ...manifest.visibleTests,
    ...manifest.hiddenTests.map((test) => ({ ...test, hidden: true })),
  ];
  try {
    const result = redactHiddenResults(await executeHarness(buildHarness({ code: body.code, manifest, tests })));
    const accepted = result.summary.total > 0 && result.summary.passed === result.summary.total;
    return res.status(200).json({ ...result, verdict: accepted ? "accepted" : "rejected", accepted });
  } catch (error) {
    return res.status(error.code === "RUNNER_NOT_CONFIGURED" ? 503 : 502).json({ error: error.message || "Submission failed." });
  }
}

