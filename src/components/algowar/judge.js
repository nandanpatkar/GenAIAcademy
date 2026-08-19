// AI judge for the local mirror. AlgoWars grades submissions on its own judge service,
// which is a server rather than data and so could not be extracted. This routes a
// submission through the app's configured AI provider instead: it reviews the solution
// against the problem statement and returns a structured verdict.
import { callAI, getActiveAIProviderStatus } from "../../services/aiService";
import { toPlainText } from "./statement";

export const judgeStatus = () => getActiveAIProviderStatus();

const SYSTEM = `You are the judge for a competitive-programming arena. You receive a problem
statement and a candidate solution. Evaluate correctness by reasoning about the algorithm and
tracing the provided examples — you cannot execute code, so judge by analysis.

Respond with ONLY a JSON object:
{
  "verdict": "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "COMPILE_ERROR" | "INCOMPLETE",
  "summary": "one sentence on the outcome",
  "reasoning": "2-4 sentences: what the code does and why it passes or fails",
  "failingCase": "a concrete input that breaks it, or null if accepted",
  "timeComplexity": "e.g. O(n log n)",
  "spaceComplexity": "e.g. O(n)",
  "optimalApproach": "the intended approach, one or two sentences",
  "hints": ["actionable next step", "..."]
}
Use INCOMPLETE if the submission is a stub or unchanged skeleton. Be strict: only ACCEPTED when
the logic is genuinely correct for all stated constraints.`;

function parseJson(raw) {
  if (!raw) throw new Error("Empty response from the AI provider.");
  const text = String(raw).trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The AI provider did not return JSON.");
  return JSON.parse(text.slice(start, end + 1));
}

export async function judgeSubmission({ title, statement, constraints, examples = [], language, code }) {
  const status = judgeStatus();
  if (!status.configured) {
    const error = new Error(`${status.label} is not configured. ${status.setupMessage}`);
    error.code = "NOT_CONFIGURED";
    throw error;
  }

  const problem = [
    `Problem: ${title}`,
    toPlainText(statement).slice(0, 4000),
    constraints ? `Constraints:\n${toPlainText(constraints)}` : "",
    examples.length ? `Examples:\n${examples.map(toPlainText).join("\n\n").slice(0, 1500)}` : "",
  ].filter(Boolean).join("\n\n");

  const raw = await callAI(
    [
      { role: "system", content: SYSTEM },
      { role: "user", content: `${problem}\n\nLanguage: ${language}\nSubmission:\n\`\`\`\n${code}\n\`\`\`` },
    ],
    1200,
    0.2,
    true,
  );

  const result = parseJson(raw);
  return { ...result, accepted: result.verdict === "ACCEPTED" };
}
