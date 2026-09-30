// Result comparison for SQL problems. Results are compared as typed
// multisets: duplicates count, NULL equals NULL, numbers compare with a small
// tolerance (so 2.5 and "2.50" match), and row order matters only when the
// problem asks for ORDER BY. Column names are ignored — aliases vary — but the
// number and order of columns must match.

const NUMERIC = /^-?\d+(\.\d+)?(e[-+]?\d+)?$/i;
const EPSILON = 1e-6;

export function normalizeValue(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  const text = String(value);
  return NUMERIC.test(text.trim()) ? Number(text) : text;
}

const valuesEqual = (a, b) => {
  if (a === null || b === null) return a === b;
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
  return a === b;
};

const rowsEqual = (a, b) => a.length === b.length && a.every((value, index) => valuesEqual(value, b[index]));

// Canonical sort key for unordered comparison; numbers rounded so tolerance holds.
const rowKey = (row) => JSON.stringify(row.map((value) => (typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value)));

export const formatValue = (value) => (value === null ? "NULL" : String(value));

/**
 * Compare actual against expected. Returns { pass, reason, message, detail }.
 * `detail` points at the first mismatch (row index, expected/actual rows) so
 * a visible dataset can show exactly what went wrong.
 */
export function compareResults(expected, actual, { ordered = false } = {}) {
  const exp = expected.rows.map((row) => row.map(normalizeValue));
  const act = actual.rows.map((row) => row.map(normalizeValue));
  const expCols = expected.columns.length;
  const actCols = actual.columns.length;
  if (expCols !== actCols) return { pass: false, reason: "columns", message: `Expected ${expCols} column${expCols === 1 ? "" : "s"}, got ${actCols}.` };
  if (exp.length !== act.length) return { pass: false, reason: "rowcount", message: `Expected ${exp.length} row${exp.length === 1 ? "" : "s"}, got ${act.length}.` };

  if (ordered) {
    const index = exp.findIndex((row, i) => !rowsEqual(row, act[i]));
    if (index === -1) return { pass: true, reason: "ok", message: "Rows and order match." };
    const sameMultiset = compareResults(expected, actual, { ordered: false }).pass;
    return {
      pass: false,
      reason: sameMultiset ? "order" : "values",
      message: sameMultiset ? `Right rows, wrong order — first difference at row ${index + 1}.` : `Row ${index + 1} differs.`,
      detail: { index, expected: exp[index], actual: act[index] },
    };
  }

  const sortedExp = [...exp].sort((a, b) => rowKey(a).localeCompare(rowKey(b)));
  const sortedAct = [...act].sort((a, b) => rowKey(a).localeCompare(rowKey(b)));
  const index = sortedExp.findIndex((row, i) => !rowsEqual(row, sortedAct[i]));
  if (index === -1) return { pass: true, reason: "ok", message: "Same rows (order not required)." };
  // Name a concrete row that's missing, and one that shouldn't be there.
  const remaining = [...act];
  const missing = exp.find((row) => {
    const at = remaining.findIndex((candidate) => rowsEqual(candidate, row));
    if (at === -1) return true;
    remaining.splice(at, 1);
    return false;
  });
  return { pass: false, reason: "values", message: "Some rows don't match.", detail: { missing: missing || null, unexpected: remaining[0] || null } };
}

/**
 * Light pre-check before the database sees the query. The database role is the
 * real boundary; this just gives a friendlier message for common slips.
 */
export function precheckQuery(sql) {
  const stripped = String(sql || "")
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .trim()
    .replace(/;+\s*$/, "")
    .trim();
  if (!stripped) return { ok: false, message: "Write a query first." };
  if (!/^(select|with|values|table)\b/i.test(stripped)) return { ok: false, message: "Only a single read-only query is judged — start with SELECT or WITH." };
  return { ok: true, sql: stripped };
}
