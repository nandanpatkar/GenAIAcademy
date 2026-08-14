/**
 * api/_lib/hackerearth.js — HackerEarth Code Evaluation API (v4) client.
 *
 * HackerEarth's API is asynchronous: a submission is created, then polled
 * until the platform reports it complete, and the actual stdout is fetched
 * from a separate S3 URL. This wraps that flow behind the same
 * { output, statusCode, memory, cpuTime } shape JDoodle returns, so callers
 * can treat both providers interchangeably.
 */

const HE_BASE = "https://api.hackerearth.com/v4/partner/code-evaluation/submissions/";

const LANG_MAP = {
  python3: "PYTHON3",
  nodejs: "JAVASCRIPT_NODE",
  java: "JAVA14",
  cpp17: "CPP17",
  cpp: "CPP14",
  go: "GO",
};

export const HACKEREARTH_LANGUAGES = new Set(Object.keys(LANG_MAP));

const POLL_INTERVAL_MS = 700;
const MAX_POLL_ATTEMPTS = 10;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function executeOnHackerEarth({ script, language, stdin, clientSecret }) {
  const lang = LANG_MAP[language];
  if (!lang) {
    const error = new Error(`HackerEarth: unsupported language "${language}"`);
    error.statusCode = 400;
    throw error;
  }

  const createRes = await fetch(HE_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", "client-secret": clientSecret },
    body: JSON.stringify({
      lang,
      source: script,
      input: stdin || "",
      time_limit: 5,
      memory_limit: 262144,
    }),
  });
  const created = await createRes.json().catch(() => ({}));
  if (!createRes.ok || !created.he_id) {
    const error = new Error(created?.request_status?.message || "HackerEarth submission failed");
    error.statusCode = createRes.status && createRes.status >= 400 ? createRes.status : 502;
    throw error;
  }

  const statusUrl = created.status_update_url || `${HE_BASE}${created.he_id}/`;

  let polled = null;
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);
    const pollRes = await fetch(statusUrl, { headers: { "client-secret": clientSecret } });
    const body = await pollRes.json().catch(() => ({}));
    if (body?.request_status?.code === "REQUEST_COMPLETED") {
      polled = body;
      break;
    }
  }

  if (!polled) {
    const error = new Error("HackerEarth execution timed out");
    error.statusCode = 504;
    throw error;
  }

  const compileStatus = polled?.result?.compile_status;
  if (compileStatus && compileStatus !== "OK") {
    return { output: String(compileStatus), statusCode: 400, memory: null, cpuTime: null };
  }

  const runStatus = polled?.result?.run_status;
  if (!runStatus) {
    const error = new Error("HackerEarth returned no run result");
    error.statusCode = 502;
    throw error;
  }

  let output = runStatus.stderr || "";
  if (runStatus.output) {
    try {
      const outRes = await fetch(runStatus.output);
      const stdout = await outRes.text();
      output = runStatus.stderr ? `${stdout}\n${runStatus.stderr}`.trim() : stdout;
    } catch {
      // Keep whatever we already have (stderr, or empty) if the S3 fetch fails.
    }
  }

  return {
    output,
    statusCode: runStatus.status === "AC" ? 200 : 400,
    memory: runStatus.memory_used != null ? Number(runStatus.memory_used) : null,
    cpuTime: runStatus.time_used != null ? Number(runStatus.time_used) : null,
  };
}
