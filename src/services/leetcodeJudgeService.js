const JUDGE_ENDPOINT = "/api/leetcode-judge";

async function postJudge(payload) {
  const request = (body) => fetch(JUDGE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let response = await request(payload);
  let data = await response.json().catch(() => ({}));

  // Older dev servers rejected an empty/stale case selection with 400. A run
  // without a filter has a well-defined meaning: execute all visible cases.
  if (payload.action === "run" && response.status === 400 && data.error === "Select at least one test case." && payload.caseIds !== undefined) {
    response = await request({ ...payload, caseIds: undefined });
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    throw new Error(data.error || `Judge request failed (HTTP ${response.status}).`);
  }
  return data;
}

export function runLeetCodeTests({ problemId, code, caseIds, customCases = [], provider = "jdoodle" }) {
  if (typeof code !== "string" || !code.trim()) {
    return Promise.reject(new Error("Enter a Python solution before you run the tests."));
  }
  const payload = { action: "run", problemId, code, customCases, provider };
  if (Array.isArray(caseIds) && caseIds.length) payload.caseIds = caseIds;
  return postJudge(payload);
}

export function submitLeetCodeSolution({ problemId, code, provider = "jdoodle" }) {
  if (typeof code !== "string" || !code.trim()) {
    return Promise.reject(new Error("Enter a Python solution before you submit."));
  }
  return postJudge({ action: "submit", problemId, code, provider });
}
