// Dedicated worker holding the practice database. Everything heavy — PGlite's
// WASM, seeding fixtures, running learner queries — happens here, so a runaway
// query can be stopped by terminating the worker (PGlite has no working
// statement_timeout, and a stuck query would otherwise freeze the tab).
import { loadPGlite } from "../../../../services/pgliteLoader";
import { ensureRole, executeInSandbox } from "../lib/sqlExec";

let dbPromise = null;
let runId = 0;

const getDb = () => {
  dbPromise ||= (async () => {
    const PGlite = await loadPGlite();
    const pg = new PGlite();
    await pg.waitReady;
    await ensureRole(pg);
    return pg;
  })();
  return dbPromise;
};

self.onmessage = async ({ data }) => {
  const { id, type } = data;
  try {
    const pg = await getDb();
    if (type === "init") {
      self.postMessage({ id, ok: true });
      return;
    }
    const results = [];
    for (const job of data.jobs) {
      runId += 1;
      results.push({ key: job.key, ...(await executeInSandbox(pg, job.fixture, job.sql, runId)) });
    }
    self.postMessage({ id, ok: true, results });
  } catch (error) {
    self.postMessage({ id, ok: false, error: String(error?.message || error) });
  }
};
