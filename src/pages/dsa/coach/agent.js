import { stripToolBlocks, toolCallsOf } from "./replyParser.js";

/**
 * The coach's agent loop, provider-agnostic: tools are described in the
 * system prompt and called with fenced ```tool blocks, so it works with any
 * chat-completions model (no native function calling needed).
 *
 *   model → tool calls? → run them → results back to the model → … → answer
 *
 * Events (mirroring TUFY's stream): `status` {label}, `tool_start`
 * {id, name, args, label}, `tool_result` {id, ok, summary}, `final`.
 */
export const MAX_STEPS = 5;
const MAX_CALLS_PER_STEP = 3;
const MAX_RESULT_CHARS = 7000;
const MAX_HISTORY = 14;
const MAX_HISTORY_CHARS = 5000;

const clip = (text, max) => (text.length > max ? `${text.slice(0, max)}\n…(truncated)` : text);

export class CoachCancelled extends Error {
  constructor() { super("Cancelled"); this.name = "CoachCancelled"; }
}

/** Earlier turns, trimmed: the last few messages, each capped. */
export function historyMessages(messages = []) {
  return messages
    .filter((message) => (message.role === "user" || message.role === "assistant") && !message.isError && String(message.content || "").trim())
    .slice(-MAX_HISTORY)
    .map((message) => ({ role: message.role, content: clip(String(message.content), MAX_HISTORY_CHARS) }));
}

/**
 * `callModel(messages)` returns the reply text. `tools` is
 * `{ [name]: { label(args), run(args) → string | {text, summary} } }`.
 * Resolves `{ content, steps }`; `steps` records each tool call for the UI.
 */
export async function runCoachAgent({ system, history = [], message, callModel, tools = {}, onEvent = () => {}, isCancelled = () => false, maxSteps = MAX_STEPS }) {
  const transcript = [{ role: "system", content: system }, ...historyMessages(history), { role: "user", content: message }];
  const steps = [];
  const check = () => { if (isCancelled()) throw new CoachCancelled(); };

  for (let step = 0; step < maxSteps; step += 1) {
    check();
    const reply = String(await callModel(transcript) || "");
    check();
    const calls = toolCallsOf(reply).slice(0, MAX_CALLS_PER_STEP);
    const lastStep = step === maxSteps - 1;
    if (!calls.length || lastStep) {
      const content = stripToolBlocks(reply);
      if (content || !calls.length) {
        onEvent({ type: "final" });
        return { content: content || "I couldn't put an answer together. Try asking again.", steps };
      }
      break;
    }

    const results = [];
    for (const call of calls) {
      check();
      const tool = tools[call.name];
      const id = `${step}-${steps.length}`;
      const label = tool?.label?.(call.args || {}) || `Using ${call.name}`;
      const entry = { id, name: call.name, args: call.args || {}, label, status: "running" };
      steps.push(entry);
      onEvent({ type: "tool_start", ...entry });
      let output;
      try {
        if (!tool) throw new Error(`Unknown tool "${call.name}". Use one of: ${Object.keys(tools).join(", ")}.`);
        output = await tool.run(call.args || {});
        check();
        const text = typeof output === "string" ? output : output?.text || "";
        entry.status = "ok";
        entry.summary = typeof output === "object" && output?.summary ? output.summary : "";
        results.push(`### ${call.name} ${JSON.stringify(call.args || {})}\n${clip(text || "(no output)", MAX_RESULT_CHARS)}`);
      } catch (error) {
        if (error instanceof CoachCancelled) throw error;
        entry.status = "error";
        entry.summary = error.message || "Failed";
        results.push(`### ${call.name} failed\n${entry.summary}`);
      }
      onEvent({ type: "tool_result", id, ok: entry.status === "ok", summary: entry.summary, status: entry.status });
    }

    transcript.push({ role: "assistant", content: reply });
    transcript.push({
      role: "user",
      content: `Tool results (not visible to the learner):\n\n${results.join("\n\n")}\n\n${step + 1 >= maxSteps - 1
        ? "Now write the final answer for the learner. Don't call more tools."
        : "Continue: call another tool if you really need it, otherwise write the final answer for the learner."}`,
    });
    onEvent({ type: "status", label: "Putting it together…" });
  }

  // Out of steps while the model still wanted tools: ask for an answer.
  check();
  transcript.push({ role: "user", content: "Answer the learner now with what you have. Don't call tools." });
  const reply = stripToolBlocks(String(await callModel(transcript) || ""));
  onEvent({ type: "final" });
  return { content: reply || "I couldn't put an answer together. Try asking again.", steps };
}
