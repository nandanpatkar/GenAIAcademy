/**
 * The client tools Jobvis may call, by the same names `voice/persona.py`
 * declares on the agent (`TOOL_SPECS`) and `voice/tools.py` implements.
 *
 * Every one is the same two lines: forward to Python, return the answer as a
 * string. Keeping the list here rather than generating it means a tool added on
 * the agent without a handler fails loudly in one obvious place.
 */

import { callTool } from "./api";

export const TOOL_NAMES = [
  "get_session_status",
  "get_top_jobs",
  "get_job_details",
  "read_application",
  "start_search",
  "start_tailoring",
  "get_run_status",
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

export type ToolLogEntry = { name: string; at: number };

/**
 * Build the clientTools map for useConversation.
 *
 * Results go back as JSON strings on purpose. The ConvAI protocol wants a
 * string result, and a raw object once killed the socket with a 1008 policy
 * violation on the Python side — no reason to relearn that lesson here.
 */
export function buildClientTools(onCall: (entry: ToolLogEntry) => void) {
  const tools: Record<string, (parameters: Record<string, unknown>) => Promise<string>> = {};
  for (const name of TOOL_NAMES) {
    tools[name] = async (parameters: Record<string, unknown>) => {
      onCall({ name, at: Date.now() });
      const result = await callTool(name, parameters ?? {});
      return JSON.stringify(result);
    };
  }
  return tools;
}
