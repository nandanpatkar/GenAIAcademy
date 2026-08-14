/**
 * Typed client for the Python API. Same-origin in the built console; in dev it
 * points at :8000 via NEXT_PUBLIC_API_BASE.
 */

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export type Job = {
  rank: number;
  job_id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  fit_score: number;
  why: string;
};

export type Pack = {
  headline: string;
  summary: string;
  cover_letter: string;
  honesty_note: string;
  flags: number;
  verdict: string;
};

export type Candidate = {
  name: string;
  role: string;
  seniority: string;
  locations: string[];
  remote_ok: boolean;
};

export type RunStatus = {
  running: boolean;
  kind?: string;
  latest_status?: string;
  done?: boolean;
  failed?: boolean;
  error?: string;
  note?: string;
};

export type State = {
  step: string;
  thread_id: string;
  candidate: Candidate | null;
  jobs: Job[];
  pack: Pack | null;
  run: RunStatus;
};

export type Config = {
  voice_ok: boolean;
  voice_hint: string;
  wizard_url: string;
  has_candidate: boolean;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) throw new Error(`${path} failed: ${response.status}`);
  return (await response.json()) as T;
}

export const getConfig = () => getJson<Config>("/api/config");
export const getState = () => getJson<State>("/api/state");

export type SessionStart = {
  token: string;
  /** Fills persona.FIRST_MESSAGE — unset, the agent greets you with literal braces. */
  dynamicVariables: Record<string, string>;
};

/** Mint a conversation token. The ElevenLabs key never reaches the browser. */
export async function getSessionStart(): Promise<SessionStart> {
  const response = await fetch(`${BASE}/api/voice/token`, { method: "POST" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail ?? `token request failed: ${response.status}`);
  return { token: body.token as string, dynamicVariables: body.dynamic_variables ?? {} };
}

/**
 * Run one client tool in Python.
 *
 * This is the whole grounding story in one function: the agent asks for a fact,
 * and the answer comes from the LangGraph checkpoint rather than from the
 * model. The browser is a courier, not a source.
 */
export async function callTool(name: string, parameters: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(`${BASE}/api/tools/${name}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parameters ?? {}),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return { error: body.detail ?? `tool ${name} failed with ${response.status}` };
  }
  return await response.json();
}

/** Why the last conversation died. The SDK only ever says "Unknown error". */
export async function getLastVoiceError(): Promise<{ reason: string; quota: boolean }> {
  try {
    return await getJson<{ reason: string; quota: boolean }>("/api/voice/last-error");
  } catch {
    return { reason: "", quota: false };
  }
}

export const packUrl = (kind: "pdf" | "tex") => `${BASE}/api/pack/${kind}`;
export const eventsUrl = () => `${BASE}/api/events`;
