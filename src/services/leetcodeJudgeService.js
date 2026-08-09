async function postJudge(endpoint, payload) {
  const request = (body) => fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let response = await request(payload);
  let data = await response.json().catch(() => ({}));

  // Older dev servers rejected an empty/stale case selection with 400. A run
  // without a filter has a well-defined meaning: execute all visible cases.
  if (endpoint.endsWith("/leetcode-run") && response.status === 400 && data.error === "Select at least one test case." && payload.caseIds !== undefined) {
    response = await request({ ...payload, caseIds: undefined });
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    throw new Error(data.error || `Judge request failed at ${endpoint} (HTTP ${response.status}).`);
  }
  return data;
}

export function runLeetCodeTests({ problemId, code, caseIds, customCases = [] }) {
  if (typeof code !== "string" || !code.trim()) {
    return Promise.reject(new Error("Enter a Python solution before you run the tests."));
  }
  const payload = { problemId, code, customCases };
  if (Array.isArray(caseIds) && caseIds.length) payload.caseIds = caseIds;
  return postJudge("/api/leetcode-run", payload);
}

export function submitLeetCodeSolution({ problemId, code }) {
  if (typeof code !== "string" || !code.trim()) {
    return Promise.reject(new Error("Enter a Python solution before you submit."));
  }
  return postJudge("/api/leetcode-submit", { problemId, code });
}
