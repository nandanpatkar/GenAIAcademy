// Main-thread handle on the SQL worker. Each request carries a wall-clock
// deadline; missing it terminates the worker (the only way to stop a query in
// PGlite) and the next request quietly starts a fresh one.

const INIT_TIMEOUT_MS = 45000;
export const QUERY_TIMEOUT_MS = 5000;

let worker = null;
let ready = null;
let seq = 0;
const pending = new Map();

function rejectAll(error) {
  pending.forEach(({ reject, timer }) => { clearTimeout(timer); reject(error); });
  pending.clear();
}

function kill(reason) {
  if (worker) worker.terminate();
  worker = null;
  ready = null;
  rejectAll(reason);
}

function spawn() {
  worker = new Worker(new URL("./sqlWorker.js", import.meta.url), { type: "module" });
  worker.onmessage = ({ data }) => {
    const entry = pending.get(data.id);
    if (!entry) return;
    pending.delete(data.id);
    clearTimeout(entry.timer);
    if (data.ok) entry.resolve(data);
    else entry.reject(new Error(data.error));
  };
  worker.onerror = (event) => kill(new Error(event.message || "The SQL engine crashed."));
}

function send(message, timeoutMs) {
  if (!worker) spawn();
  seq += 1;
  const id = seq;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      const error = new Error(message.type === "init"
        ? "The SQL engine took too long to start. Check your connection and try again."
        : `Time limit exceeded — the query ran longer than ${Math.round(timeoutMs / 1000)}s. Look for unbounded recursion or an accidental cross join.`);
      error.code = message.type === "init" ? "INIT_TIMEOUT" : "TIMEOUT";
      kill(error);
      reject(error);
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    worker.postMessage({ ...message, id });
  });
}

/** Start the engine early (downloads PGlite on first use). */
export function warmUp() {
  ready ||= send({ type: "init" }, INIT_TIMEOUT_MS).catch((error) => { ready = null; throw error; });
  return ready;
}

/** Run jobs [{ key, fixture, sql }] in order; resolves to results keyed like the jobs. */
export async function runJobs(jobs, timeoutMs = QUERY_TIMEOUT_MS) {
  await warmUp();
  const response = await send({ type: "run", jobs }, timeoutMs * Math.max(1, jobs.length));
  return Object.fromEntries(response.results.map((result) => [result.key, result]));
}
