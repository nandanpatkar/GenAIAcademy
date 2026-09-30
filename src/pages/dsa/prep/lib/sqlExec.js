// Runs one learner query against one fixture inside PGlite, isolated:
//   BEGIN → fresh schema → seed fixture → switch to a SELECT-only role →
//   run the single statement → ROLLBACK.
// The rollback discards the schema, so nothing leaks between runs or between
// datasets. `query()` uses the extended protocol, which rejects multiple
// statements; the SELECT-only role stops a stray INSERT/DDL from corrupting
// the fixture before it's compared. That role is hygiene, not a security
// boundary: the session is a superuser, so `SET ROLE` can undo it — which is
// fine, because this database is a throwaway inside the learner's own tab.
// (A shared server-side runner would need real isolation.) Wall-clock limits
// are enforced by the caller terminating the worker — PGlite ignores
// statement_timeout. Shared by the browser worker and the Node tests.

const ROLE = "sql_learner";
const MAX_ROWS = 1000;

export async function ensureRole(pg) {
  try { await pg.exec(`CREATE ROLE ${ROLE} NOLOGIN`); } catch { /* already exists */ }
}

const serialize = (value, typeId) => {
  if (value == null) return null;
  if (value instanceof Date) return typeId === 1082 ? value.toISOString().slice(0, 10) : value.toISOString();
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "object") return JSON.stringify(value);
  return value;
};

export async function executeInSandbox(pg, fixtureSql, querySql, runId = 0) {
  const schema = `run_${Date.now().toString(36)}_${runId}`;
  const started = Date.now();
  try {
    await pg.exec("BEGIN");
    await pg.exec(`CREATE SCHEMA ${schema}; SET LOCAL search_path TO ${schema};`);
    await pg.exec(fixtureSql);
    await pg.exec(`GRANT USAGE ON SCHEMA ${schema} TO ${ROLE}; GRANT SELECT ON ALL TABLES IN SCHEMA ${schema} TO ${ROLE}; SET LOCAL ROLE ${ROLE};`);
    const result = await pg.query(querySql, [], { rowMode: "array" });
    const types = result.fields.map((field) => field.dataTypeID);
    return {
      ok: true,
      columns: result.fields.map((field) => field.name),
      rows: result.rows.slice(0, MAX_ROWS).map((row) => row.map((value, index) => serialize(value, types[index]))),
      truncated: result.rows.length > MAX_ROWS,
      ms: Date.now() - started,
    };
  } catch (error) {
    return { ok: false, error: String(error?.message || error), ms: Date.now() - started };
  } finally {
    try { await pg.exec("ROLLBACK"); } catch { /* nothing open */ }
  }
}
