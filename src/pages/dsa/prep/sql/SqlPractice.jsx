import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  AlertTriangle, ArrowLeft, CheckCircle2, Circle, CircleDot, Database, Eye, History, Info, Lightbulb, Loader2, Play, Send, Table2, XCircle,
} from "lucide-react";
import { grant } from "../habit";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { relativeTime } from "../lib/dates";
import { RULES } from "../lib/rewards";
import { compareResults, formatValue, precheckQuery } from "../lib/sqlJudge";
import { SCHEMAS, SQL_PROBLEMS, datasetsFor, sqlProblemById } from "../lib/sqlProblems";
import { CodeEditor } from "../spaces/CodeTools";
import { Badge, DifficultyPill, EmptyState, Panel, PrepPage, SearchInput, Stat, Tabs } from "../ui";
import { runJobs, warmUp } from "./sqlEngine";

const STATUS_ICON = { solved: CheckCircle2, attempted: CircleDot };
const expectedCache = new Map(); // `${problem}:${dataset}` → reference result

function ResultTable({ result, caption, max = 50 }) {
  if (!result) return null;
  if (!result.ok) return <pre className="dsp-sql-error"><AlertTriangle size={13} /> {result.error}</pre>;
  return (
    <div className="dsp-sql-table-wrap">
      {caption && <div className="dsp-sql-caption">{caption} · {result.rows.length} row{result.rows.length === 1 ? "" : "s"}{result.ms != null ? ` · ${result.ms} ms` : ""}</div>}
      <div className="dsp-sql-table-scroll">
        <table className="dsp-sql-table">
          <thead><tr>{result.columns.map((column, index) => <th key={`${column}-${index}`}>{column}</th>)}</tr></thead>
          <tbody>
            {result.rows.slice(0, max).map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((value, index) => <td key={index} className={value === null ? "is-null" : ""}>{formatValue(value)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.rows.length > max && <small className="dsp-muted">Showing {max} of {result.rows.length} rows.</small>}
    </div>
  );
}

async function expectedFor(problem, dataset) {
  const key = `${problem.id}:${dataset.name}`;
  if (!expectedCache.has(key)) {
    const results = await runJobs([{ key: "expected", fixture: dataset.fixture, sql: problem.solution }]);
    if (!results.expected.ok) throw new Error(`Reference solution failed: ${results.expected.error}`);
    expectedCache.set(key, results.expected);
  }
  return expectedCache.get(key);
}

function SampleTables({ problem }) {
  const schema = SCHEMAS[problem.schema];
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const fixture = schema.ddl + schema.datasets.sample;
    runJobs(schema.tables.map((table) => ({ key: table.name, fixture, sql: `SELECT * FROM ${table.name}` })))
      .then((results) => { if (!cancelled) setData(results); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [schema]);
  return (
    <div className="dsp-stack">
      <p className="dsp-muted dsp-small">Schema <b>{schema.title}</b>. This is the visible sample data; submissions are also checked against hidden datasets with ties, NULLs and empty groups.</p>
      {error && <pre className="dsp-sql-error">{error}</pre>}
      {schema.tables.map((table) => (
        <section key={table.name} className="dsp-sql-schema">
          <h4><Table2 size={13} /> {table.name}</h4>
          <p className="dsp-mono dsp-small">{table.columns.map(([name, type]) => `${name} ${type}`).join(" · ")}</p>
          {data ? <ResultTable result={data[table.name]} max={12} /> : !error && <p className="dsp-muted dsp-small"><Loader2 size={12} className="dsp-spin" /> Loading sample rows…</p>}
        </section>
      ))}
    </div>
  );
}

function Workspace({ problem, onBack }) {
  const [drafts, setDrafts] = useStore(KEYS.sqlDrafts, {});
  const [progressMap, setProgressMap] = useStore(KEYS.sqlProgress, {});
  const progress = progressMap[problem.id] || {};
  const [tab, setTab] = useState("description");
  const [busy, setBusy] = useState("");
  const [outcome, setOutcome] = useState(null);
  const sql = drafts[problem.id] ?? "SELECT\n  \nFROM ";
  const setSql = (value) => setDrafts((prev) => ({ ...prev, [problem.id]: value }));

  useEffect(() => { warmUp().catch(() => {}); }, []);

  const record = (entry) => setProgressMap((prev) => {
    const current = prev[problem.id] || { attempts: 0, history: [] };
    const solved = current.status === "solved" || entry.verdict === "accepted";
    return {
      ...prev,
      [problem.id]: {
        ...current,
        status: solved ? "solved" : "attempted",
        attempts: current.attempts + 1,
        solvedAt: current.solvedAt || (entry.verdict === "accepted" ? entry.at : null),
        history: [entry, ...(current.history || [])].slice(0, 20),
      },
    };
  });

  const run = async () => {
    const check = precheckQuery(sql);
    if (!check.ok) { setOutcome({ kind: "run", error: check.message }); return; }
    setBusy("run");
    setOutcome(null);
    try {
      const sample = datasetsFor(problem)[0];
      const expected = await expectedFor(problem, sample);
      const { actual } = await runJobs([{ key: "actual", fixture: sample.fixture, sql: check.sql }]);
      setOutcome({ kind: "run", expected, actual, verdict: actual.ok ? compareResults(expected, actual, { ordered: problem.ordered }) : null });
    } catch (error) {
      setOutcome({ kind: "run", error: error.message, timeout: error.code === "TIMEOUT" });
    } finally {
      setBusy("");
    }
  };

  const submit = async () => {
    const check = precheckQuery(sql);
    if (!check.ok) { setOutcome({ kind: "submit", error: check.message }); return; }
    setBusy("submit");
    setOutcome(null);
    const at = new Date().toISOString();
    let current = null;
    try {
      for (const dataset of datasetsFor(problem)) {
        current = dataset;
        const expected = await expectedFor(problem, dataset);
        const { actual } = await runJobs([{ key: "actual", fixture: dataset.fixture, sql: check.sql }]);
        const verdict = actual.ok ? compareResults(expected, actual, { ordered: problem.ordered }) : { pass: false, reason: "error", message: actual.error };
        if (!verdict.pass) {
          record({ at, verdict: verdict.reason === "error" ? "error" : "wrong", dataset: dataset.name, sql: check.sql });
          setOutcome({ kind: "submit", accepted: false, dataset, verdict, expected: dataset.hidden ? null : expected, actual: dataset.hidden ? null : actual });
          return;
        }
      }
      record({ at, verdict: "accepted", sql: check.sql });
      grant("sql_accept", problem.id, RULES.sql_accept.points(problem.difficulty.toLowerCase()), { title: problem.title });
      setOutcome({ kind: "submit", accepted: true, datasets: datasetsFor(problem).length });
    } catch (error) {
      // A query that blows the time limit is the learner's verdict; any other
      // engine failure is infrastructure trouble and records nothing.
      if (error.code === "TIMEOUT") record({ at, verdict: "timeout", dataset: current?.name || "sample", sql: check.sql });
      setOutcome({ kind: "submit", error: error.message, timeout: error.code === "TIMEOUT" });
    } finally {
      setBusy("");
    }
  };

  const solved = progress.status === "solved";

  return (
    <PrepPage
      eyebrow={`SQL · ${problem.topic}`}
      title={problem.title}
      actions={(
        <>
          <button type="button" className="dsp-btn is-quiet" onClick={onBack}><ArrowLeft size={15} /> All SQL problems</button>
          <DifficultyPill difficulty={problem.difficulty} />
          {solved && <Badge tone="success">Solved</Badge>}
        </>
      )}
    >
      <div className="dsp-sql-layout">
        <section className="dsp-box dsp-stack">
          <Tabs value={tab} onChange={setTab} options={[{ id: "description", label: "Description" }, { id: "data", label: "Schema & data", icon: Database }, { id: "solution", label: "Solution", icon: Eye }, { id: "history", label: "Submissions", icon: History, count: progress.history?.length || 0 }]} />
          {tab === "description" && (
            <div className="dsp-stack">
              <div className="dsp-markdown"><ReactMarkdown>{problem.statement}</ReactMarkdown></div>
              <div className="dsp-notice"><Info size={16} /><span>Column names don't matter — the number and order of columns do. {problem.ordered ? <b>Row order is checked for this problem.</b> : "Row order doesn't matter unless the problem asks for it."} Dialect: PostgreSQL.</span></div>
              <details className="dsp-hint"><summary><Lightbulb size={14} /> Hint</summary><p>{problem.hint}</p></details>
            </div>
          )}
          {tab === "data" && <SampleTables problem={problem} />}
          {tab === "solution" && (solved || progress.viewedSolution ? (
            <div className="dsp-stack">
              {!solved && <p className="dsp-muted dsp-small">You opened this before solving it — try writing it again from memory later.</p>}
              <pre className="dsp-sql-solution">{problem.solution}</pre>
              <p className="dsp-muted dsp-small">One correct approach of several; any query returning the same rows on every dataset is accepted.</p>
            </div>
          ) : (
            <EmptyState compact icon={Eye} title="Solution hidden until you solve it" body="Try the hint first. You can still look — it'll be noted on this problem." action={<button type="button" className="dsp-btn is-small" onClick={() => setProgressMap((prev) => ({ ...prev, [problem.id]: { ...(prev[problem.id] || { attempts: 0, history: [] }), viewedSolution: true } }))}>Show anyway</button>} />
          ))}
          {tab === "history" && (progress.history?.length ? (
            <ul className="dsp-list">
              {progress.history.map((entry) => (
                <li key={entry.at} className="dsp-list-row">
                  <span className={`dsp-list-icon${entry.verdict === "accepted" ? " is-done" : ""}`}>{entry.verdict === "accepted" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}</span>
                  <div><b>{entry.verdict === "accepted" ? "Accepted" : entry.verdict === "error" ? `Error on ${entry.dataset}` : entry.verdict === "timeout" ? `Time limit on ${entry.dataset}` : `Wrong on ${entry.dataset}`}</b><small className="dsp-mono">{entry.sql.replace(/\s+/g, " ").slice(0, 90)}</small></div>
                  <small className="dsp-muted">{relativeTime(entry.at)}</small>
                  <button type="button" className="dsp-btn is-small is-quiet" onClick={() => setSql(entry.sql)}>Load</button>
                </li>
              ))}
            </ul>
          ) : <EmptyState compact icon={History} title="No submissions yet" />)}
        </section>

        <section className="dsp-box dsp-stack">
          <div className="dsp-code-monaco dsp-sql-editor"><CodeEditor value={sql} language="sql" onChange={setSql} /></div>
          <div className="dsp-row">
            <button type="button" className="dsp-btn" onClick={run} disabled={Boolean(busy)}>{busy === "run" ? <Loader2 size={14} className="dsp-spin" /> : <Play size={14} />} Run on sample</button>
            <button type="button" className="dsp-btn is-primary" onClick={submit} disabled={Boolean(busy)}>{busy === "submit" ? <Loader2 size={14} className="dsp-spin" /> : <Send size={14} />} Submit</button>
            <span className="dsp-muted dsp-small">Runs in an in-browser PostgreSQL, one fresh throwaway schema per run.</span>
          </div>

          {busy && !outcome && <p className="dsp-muted dsp-small" role="status"><Loader2 size={13} className="dsp-spin" /> {busy === "submit" ? "Judging on every dataset…" : "Running…"} The first run downloads the database engine.</p>}
          {outcome?.error && (
            <div className={`dsp-notice ${outcome.timeout ? "is-warning" : "is-danger"}`} role="alert"><AlertTriangle size={16} /><span>{outcome.error}{outcome.kind === "submit" && !outcome.timeout ? " — this wasn't counted as an attempt." : ""}</span></div>
          )}
          {outcome?.kind === "run" && !outcome.error && (
            <div className="dsp-stack">
              {outcome.verdict && <div className={`dsp-verdict ${outcome.verdict.pass ? "is-pass" : "is-fail"}`}>{outcome.verdict.pass ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {outcome.verdict.pass ? "Matches the sample. Submit to check the hidden datasets." : outcome.verdict.message}</div>}
              <div className="dsp-grid cols-2">
                <ResultTable result={outcome.actual} caption="Your output" />
                <ResultTable result={outcome.expected} caption="Expected on sample" />
              </div>
            </div>
          )}
          {outcome?.kind === "submit" && !outcome.error && (outcome.accepted ? (
            <div className="dsp-verdict is-pass"><CheckCircle2 size={16} /> Accepted — correct on all {outcome.datasets} datasets.</div>
          ) : (
            <div className="dsp-stack">
              <div className="dsp-verdict is-fail"><XCircle size={16} /> {outcome.verdict.reason === "error" ? "Query error" : "Wrong answer"} on the <b>{outcome.dataset.hidden ? "hidden" : "sample"}</b> dataset “{outcome.dataset.name}”: {outcome.verdict.message}</div>
              {outcome.dataset.hidden
                ? <p className="dsp-muted dsp-small">Hidden data isn't shown — think about ties, NULLs, empty groups and boundary values.</p>
                : <div className="dsp-grid cols-2"><ResultTable result={outcome.actual} caption="Your output" /><ResultTable result={outcome.expected} caption="Expected" /></div>}
            </div>
          ))}
        </section>
      </div>
    </PrepPage>
  );
}

export default function SqlPractice() {
  const [progressMap] = useStore(KEYS.sqlProgress, {});
  const [openId, setOpenId] = useState("");
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const open = sqlProblemById(openId);

  const visible = useMemo(() => SQL_PROBLEMS.filter((problem) => {
    const state = progressMap[problem.id]?.status || "new";
    return (difficulty === "all" || problem.difficulty.toLowerCase() === difficulty)
      && (status === "all" || state === status || (status === "new" && !progressMap[problem.id]?.status))
      && (!query.trim() || `${problem.title} ${problem.topic}`.toLowerCase().includes(query.trim().toLowerCase()));
  }), [difficulty, progressMap, query, status]);

  if (open) return <Workspace key={open.id} problem={open} onBack={() => setOpenId("")} />;

  const solved = SQL_PROBLEMS.filter((problem) => progressMap[problem.id]?.status === "solved").length;
  const topics = [...new Set(SQL_PROBLEMS.map((problem) => problem.topic))];

  return (
    <PrepPage
      eyebrow="Practice"
      title="SQL"
      description="Query real PostgreSQL right in your browser. Each problem is judged against a visible sample and hidden datasets, comparing typed results — duplicates, NULLs and (when asked) row order all count."
    >
      <div className="dsp-grid cols-3">
        <Stat icon={CheckCircle2} label="Solved" value={`${solved}/${SQL_PROBLEMS.length}`} tone="success" />
        <Stat icon={Database} label="Schemas" value={Object.keys(SCHEMAS).length} hint={Object.values(SCHEMAS).map((schema) => schema.title).join(" · ")} />
        <Stat icon={Table2} label="Topics" value={topics.length} hint={topics.slice(0, 4).join(", ")} />
      </div>
      <div className="dsp-toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Search SQL problems" />
        <div className="dsp-chips">{["all", "easy", "medium", "hard"].map((value) => <button type="button" key={value} className={`dsp-chip${difficulty === value ? " is-active" : ""}`} onClick={() => setDifficulty(value)}>{value === "all" ? "Any difficulty" : value[0].toUpperCase() + value.slice(1)}</button>)}</div>
        <div className="dsp-chips">{[["all", "All"], ["new", "Not started"], ["attempted", "Attempted"], ["solved", "Solved"]].map(([value, label]) => <button type="button" key={value} className={`dsp-chip${status === value ? " is-active" : ""}`} onClick={() => setStatus(value)}>{label}</button>)}</div>
      </div>
      <Panel>
        {visible.length ? (
          <ul className="dsp-list">
            {visible.map((problem) => {
              const state = progressMap[problem.id]?.status;
              const Icon = STATUS_ICON[state] || Circle;
              return (
                <li key={problem.id}>
                  <button type="button" className="dsp-list-row" onClick={() => setOpenId(problem.id)}>
                    <span className={`dsp-list-icon${state === "solved" ? " is-done" : ""}`}><Icon size={15} /></span>
                    <div><b>{problem.title}</b><small>{problem.topic} · {SCHEMAS[problem.schema].title} schema{problem.ordered ? " · ordered" : ""}</small></div>
                    <DifficultyPill difficulty={problem.difficulty} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : <EmptyState compact icon={Database} title="No problems match" />}
      </Panel>
    </PrepPage>
  );
}
