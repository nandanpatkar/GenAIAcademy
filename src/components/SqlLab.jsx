import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  AlertTriangle, Check, ChevronRight, Database, Gauge, Loader2, Play,
  RefreshCw, Table2, Target, Terminal, X, Zap,
} from "lucide-react";
import { CHALLENGES, SCHEMA_SUMMARY, SEED_SQL, SNIPPETS } from "../data/sqlLabContent";
import "./SqlLab.css";

/**
 * SQL & Query Plan Lab — a real PostgreSQL 17 engine (PGlite, compiled to WASM)
 * running entirely in the browser tab. No server, no connection string.
 *
 * The point isn't "run some SQL" — it's reading EXPLAIN ANALYZE output. Every
 * plan node is rendered with its estimated vs. actual row counts and its share
 * of total runtime, so the learner can see a Seq Scan turn into an Index Scan
 * and watch the milliseconds fall. Challenge validators inspect the plan JSON
 * rather than the result set, so passing means "you fixed the access path",
 * not "you got the right answer by luck".
 */

// PGlite is ~16MB of WASM plus a preloaded data image. Serving that from our own
// origin would burn Vercel Hobby's 100GB/month bandwidth budget roughly 6,000
// first-time visits in, so pull it from jsDelivr and fall back to the bundled
// copy when the CDN is unreachable. Set to false to always serve locally.
const LOAD_PGLITE_FROM_CDN = true;
const PGLITE_CDN = "https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.4/dist/index.js";

const loadPGlite = async () => {
  if (LOAD_PGLITE_FROM_CDN) {
    try {
      const mod = await import(/* @vite-ignore */ PGLITE_CDN);
      if (mod?.PGlite) return mod.PGlite;
    } catch {
      // Offline, blocked, or behind a corporate proxy — use the bundled copy.
    }
  }
  const local = await import("@electric-sql/pglite");
  return local.PGlite;
};

// ── plan helpers ─────────────────────────────────────────────────────────────

const flattenPlan = (node, depth = 0, out = []) => {
  if (!node) return out;
  out.push({ ...node, __depth: depth });
  (node.Plans || []).forEach((child) => flattenPlan(child, depth + 1, out));
  return out;
};

// Time attributable to this node alone: Postgres reports Actual Total Time as
// inclusive of children, so subtract them to get self time.
const selfTime = (node) => {
  const total = (node["Actual Total Time"] || 0) * (node["Actual Loops"] || 1);
  const kids = (node.Plans || []).reduce(
    (sum, c) => sum + (c["Actual Total Time"] || 0) * (c["Actual Loops"] || 1),
    0
  );
  return Math.max(0, total - kids);
};

// Estimate drift is only meaningful on scan nodes. Anything above a LIMIT stops
// early by design, so a Sort reporting fewer actual rows than estimated is
// correct behaviour, not a bad estimate — badging it would teach the wrong thing.
const estimateDrift = (node) => {
  if (!/Scan/.test(node["Node Type"] || "")) return 1;
  const loops = node["Actual Loops"] || 1;
  const est = (node["Plan Rows"] ?? 0) * loops;
  const act = (node["Actual Rows"] ?? 0) * loops;
  if (est < 1 || act < 1) return 1;
  return Math.max(est / act, act / est);
};

const NODE_TONE = (type = "") => {
  if (/Seq Scan/.test(type)) return "warn";
  if (/Index Only Scan/.test(type)) return "best";
  if (/Index Scan|Bitmap/.test(type)) return "good";
  if (/Sort|Hash(?!\s*Join)/.test(type)) return "note";
  if (/Nested Loop|Join/.test(type)) return "join";
  return "plain";
};

const fmtMs = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(2)} ms`);
const fmtNum = (n) => (n == null ? "—" : Number(n).toLocaleString());

// ── plan tree row ────────────────────────────────────────────────────────────

function PlanNode({ node, totalTime }) {
  const tone = NODE_TONE(node["Node Type"]);
  const self = selfTime(node);
  const share = totalTime > 0 ? (self / totalTime) * 100 : 0;
  const drift = estimateDrift(node);
  const relation = node["Relation Name"];
  const detail = node["Index Cond"] || node["Hash Cond"] || node["Filter"] || node["Join Filter"];

  return (
    <div className="sqll-plan-node" style={{ marginLeft: node.__depth * 18 }}>
      <div className="sqll-plan-line">
        {node.__depth > 0 && <span className="sqll-plan-elbow">└─</span>}
        <span className={`sqll-node-badge tone-${tone}`}>{node["Node Type"]}</span>
        {relation && <span className="sqll-node-rel">on {relation}</span>}
        {node["Index Name"] && <span className="sqll-node-idx">using {node["Index Name"]}</span>}
        <span className="sqll-node-spacer" />
        {drift >= 10 && (
          <span className="sqll-node-drift" title="Estimated rows differ from actual by 10x or more">
            <AlertTriangle size={11} /> {drift.toFixed(1)}× off
          </span>
        )}
        <span className="sqll-node-time">{fmtMs(self)}</span>
      </div>

      <div className="sqll-plan-meta">
        <span>rows est <b>{fmtNum(node["Plan Rows"])}</b> · actual <b>{fmtNum(node["Actual Rows"])}</b></span>
        {node["Actual Loops"] > 1 && <span>loops <b>{fmtNum(node["Actual Loops"])}</b></span>}
        <span>cost <b>{node["Total Cost"]?.toFixed?.(1) ?? "—"}</b></span>
        {node["Rows Removed by Filter"] > 0 && (
          <span className="sqll-meta-warn">discarded <b>{fmtNum(node["Rows Removed by Filter"])}</b></span>
        )}
      </div>

      {detail && <div className="sqll-plan-cond">{detail}</div>}

      <div className="sqll-plan-bar">
        <div className={`sqll-plan-bar-fill tone-${tone}`} style={{ width: `${Math.min(100, share)}%` }} />
      </div>
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────

export default function SqlLab({ onClose }) {
  const dbRef = useRef(null);
  const [boot, setBoot] = useState({ state: "loading", message: "Downloading PostgreSQL (WASM)…" });
  const [sql, setSql] = useState(CHALLENGES[0].sql);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tab, setTab] = useState("results");
  const [activeId, setActiveId] = useState(CHALLENGES[0].id);
  const [verdict, setVerdict] = useState(null);
  const [solved, setSolved] = useState({});
  const [indexes, setIndexes] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const challenge = useMemo(() => CHALLENGES.find((c) => c.id === activeId), [activeId]);

  // ── boot PGlite + seed ─────────────────────────────────────────────────────
  const seed = useCallback(async (db) => {
    setBoot({ state: "loading", message: "Seeding 165,000 rows…" });
    await db.exec(SEED_SQL);
  }, []);

  const refreshIndexes = useCallback(async () => {
    const db = dbRef.current;
    if (!db) return;
    try {
      const res = await db.query(
        "select indexname, tablename from pg_indexes where schemaname = 'public' order by tablename, indexname;"
      );
      setIndexes(res.rows || []);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const PGlite = await loadPGlite();
        if (cancelled) return;
        setBoot({ state: "loading", message: "Starting the Postgres engine…" });
        const db = await PGlite.create();
        if (cancelled) return;
        dbRef.current = db;
        await seed(db);
        if (cancelled) return;
        setBoot({ state: "ready" });
        refreshIndexes();
      } catch (e) {
        if (!cancelled) setBoot({ state: "error", message: e?.message || String(e) });
      }
    })();
    return () => { cancelled = true; };
  }, [seed, refreshIndexes]);

  const resetDb = async () => {
    const db = dbRef.current;
    if (!db) return;
    setRunning(true);
    try {
      await seed(db);
      setBoot({ state: "ready" });
      setResult(null); setPlan(null); setError(null); setVerdict(null);
      await refreshIndexes();
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setRunning(false);
    }
  };

  // ── execution ──────────────────────────────────────────────────────────────

  // The editor may hold several statements (e.g. CREATE INDEX; SELECT …).
  // exec() runs them all; we surface the last one that produced rows.
  const runSql = async () => {
    const db = dbRef.current;
    if (!db || running) return;
    setRunning(true); setError(null); setVerdict(null);
    const started = performance.now();
    try {
      const batches = await db.exec(sql);
      const withRows = [...batches].reverse().find((b) => b.rows?.length) || batches[batches.length - 1];
      setResult({
        rows: withRows?.rows || [],
        fields: (withRows?.fields || []).map((f) => f.name),
        elapsed: performance.now() - started,
        statements: batches.length,
      });
      setTab("results");
      await refreshIndexes();
    } catch (e) {
      setError(e?.message || String(e));
      setResult(null);
      setTab("results");
    } finally {
      setRunning(false);
    }
  };

  // Explain only makes sense for one statement, so we run everything before the
  // final statement as setup, then EXPLAIN ANALYZE the last one.
  const explainSql = async () => {
    const db = dbRef.current;
    if (!db || running) return;
    setRunning(true); setError(null); setVerdict(null);
    try {
      const statements = sql
        .split(/;\s*(?=(?:[^']*'[^']*')*[^']*$)/)
        .map((s) => s.replace(/--.*$/gm, "").trim())
        .filter(Boolean);

      const target = statements.pop();
      for (const setup of statements) await db.exec(setup);

      const res = await db.query(`explain (analyze, verbose false, format json) ${target}`);
      const root = res.rows?.[0]?.["QUERY PLAN"]?.[0];
      if (!root) throw new Error("No plan returned.");

      const nodes = flattenPlan(root.Plan);
      const nextPlan = {
        root: root.Plan,
        nodes,
        planningTime: root["Planning Time"] || 0,
        executionTime: root["Execution Time"] || 0,
      };
      setPlan(nextPlan);
      setTab("plan");
      await refreshIndexes();

      // Score the challenge against the plan, not the rows.
      if (challenge) {
        const colsRes = await db.query(target).catch(() => null);
        const ctx = { columns: (colsRes?.fields || []).map((f) => f.name) };
        const v = challenge.validate(nodes, root.Plan, ctx);
        setVerdict(v);
        if (v.pass) setSolved((prev) => ({ ...prev, [challenge.id]: true }));
      }
    } catch (e) {
      setError(e?.message || String(e));
      setPlan(null);
      setTab("results");
    } finally {
      setRunning(false);
    }
  };

  const loadChallenge = async (c) => {
    setActiveId(c.id);
    setSql(c.sql);
    setResult(null); setPlan(null); setError(null); setVerdict(null); setShowHint(false);
    if (c.setup && dbRef.current) {
      try { await dbRef.current.exec(c.setup); await refreshIndexes(); } catch { /* non-fatal */ }
    }
  };

  // Cmd/Ctrl+Enter runs, Shift+Enter explains.
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === "Enter") { e.preventDefault(); e.shiftKey ? explainSql() : runSql(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const totalSelfTime = plan ? plan.nodes.reduce((s, n) => s + selfTime(n), 0) : 0;
  const solvedCount = Object.keys(solved).length;

  // ── boot / error screens ───────────────────────────────────────────────────
  if (boot.state !== "ready" && boot.state !== "error") {
    return (
      <div className="sql-lab sqll-booting">
        <div className="sqll-boot-card">
          <Database size={30} />
          <h2>Booting PostgreSQL 17</h2>
          <p>{boot.message}</p>
          <div className="sqll-boot-bar"><span /></div>
          <small>Real Postgres compiled to WebAssembly — runs entirely in this tab, nothing leaves your machine.</small>
        </div>
      </div>
    );
  }

  if (boot.state === "error") {
    return (
      <div className="sql-lab sqll-booting">
        <div className="sqll-boot-card sqll-boot-error">
          <AlertTriangle size={30} />
          <h2>Couldn't start the database</h2>
          <p>{boot.message}</p>
          <button className="sqll-primary" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sql-lab">
      {/* ── top bar ── */}
      <header className="sqll-topbar">
        <div className="sqll-brand">
          <span className="sqll-brand-mark"><Database size={17} /></span>
          <div>
            <strong>SQL &amp; Query Plan Lab</strong>
            <small>PostgreSQL 17 · WebAssembly · in-tab</small>
          </div>
        </div>
        <span className="sqll-live"><i /> engine ready</span>
        <div className="sqll-top-actions">
          <span className="sqll-solved">{solvedCount}/{CHALLENGES.length} solved</span>
          <button onClick={resetDb} disabled={running} title="Re-seed the database">
            <RefreshCw size={13} /> Reset data
          </button>
          {onClose && <button className="sqll-close" onClick={onClose}><X size={15} /></button>}
        </div>
      </header>

      <div className="sqll-body">
        {/* ── left rail: challenges + schema ── */}
        <aside className="sqll-rail">
          <div className="sqll-rail-section">
            <h4><Target size={12} /> Challenges</h4>
            {CHALLENGES.map((c) => (
              <button
                key={c.id}
                className={`sqll-challenge ${activeId === c.id ? "is-active" : ""} ${solved[c.id] ? "is-solved" : ""}`}
                onClick={() => loadChallenge(c)}
              >
                <span className="sqll-challenge-top">
                  <span className="sqll-challenge-title">{c.title}</span>
                  {solved[c.id] ? <Check size={13} className="sqll-tick" /> : <ChevronRight size={13} />}
                </span>
                <span className="sqll-challenge-tags">
                  <em>{c.difficulty}</em> · {c.concept}
                </span>
              </button>
            ))}
          </div>

          <div className="sqll-rail-section">
            <h4><Table2 size={12} /> Schema</h4>
            {SCHEMA_SUMMARY.map((t) => (
              <details key={t.table} className="sqll-table">
                <summary><b>{t.table}</b><span>{t.rows}</span></summary>
                <ul>{t.columns.map((col) => <li key={col}>{col}</li>)}</ul>
              </details>
            ))}
          </div>

          <div className="sqll-rail-section">
            <h4><Zap size={12} /> Indexes <span className="sqll-count">{indexes.length}</span></h4>
            <div className="sqll-index-list">
              {indexes.map((i) => (
                <div key={i.indexname} className="sqll-index">
                  <b>{i.indexname}</b><span>{i.tablename}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sqll-rail-section">
            <h4><Terminal size={12} /> Snippets</h4>
            {SNIPPETS.map((s) => (
              <button key={s.label} className="sqll-snippet" onClick={() => setSql(s.sql)}>{s.label}</button>
            ))}
          </div>
        </aside>

        {/* ── centre: brief + editor + output ── */}
        <main className="sqll-main">
          {challenge && (
            <section className="sqll-brief">
              <div className="sqll-brief-head">
                <h3>{challenge.title}</h3>
                <span className="sqll-chip">{challenge.concept}</span>
                <button className="sqll-hint-btn" onClick={() => setShowHint((v) => !v)}>
                  {showHint ? "Hide hint" : "Hint"}
                </button>
              </div>
              <p>{challenge.brief}</p>
              {showHint && <div className="sqll-hint">{challenge.hint}</div>}
            </section>
          )}

          <section className="sqll-editor">
            <div className="sqll-editor-head">
              <span>query.sql</span>
              <div className="sqll-run-group">
                <button className="sqll-run" onClick={runSql} disabled={running}>
                  {running ? <Loader2 size={13} className="sqll-spin" /> : <Play size={13} />} Run
                  <kbd>⌘↵</kbd>
                </button>
                <button className="sqll-explain" onClick={explainSql} disabled={running}>
                  <Gauge size={13} /> Explain Analyze
                  <kbd>⇧⌘↵</kbd>
                </button>
              </div>
            </div>
            <div className="sqll-editor-shell">
              <Editor
                height="100%"
                defaultLanguage="sql"
                theme="vs-dark"
                value={sql}
                onChange={(v) => setSql(v ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'var(--font-mono, "DM Mono", monospace)',
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: "line",
                  automaticLayout: true,
                }}
              />
            </div>
          </section>

          <section className="sqll-output">
            <div className="sqll-tabs">
              <button className={tab === "results" ? "is-on" : ""} onClick={() => setTab("results")}>
                Results {result?.rows ? <span>{result.rows.length}</span> : null}
              </button>
              <button className={tab === "plan" ? "is-on" : ""} onClick={() => setTab("plan")} disabled={!plan}>
                Query Plan
              </button>
              {plan && (
                <span className="sqll-timing">
                  planning <b>{fmtMs(plan.planningTime)}</b> · execution <b>{fmtMs(plan.executionTime)}</b>
                </span>
              )}
              {!plan && result && (
                <span className="sqll-timing">
                  {result.statements} statement{result.statements === 1 ? "" : "s"} · <b>{fmtMs(result.elapsed)}</b>
                </span>
              )}
            </div>

            {verdict && (
              <div className={`sqll-verdict ${verdict.pass ? "is-pass" : "is-fail"}`}>
                {verdict.pass ? <Check size={14} /> : <AlertTriangle size={14} />}
                <span>{verdict.message}</span>
              </div>
            )}

            <div className="sqll-output-body">
              {error && <pre className="sqll-error">{error}</pre>}

              {!error && tab === "results" && result && (
                result.rows.length ? (
                  <div className="sqll-table-wrap">
                    <table>
                      <thead>
                        <tr>{result.fields.map((f) => <th key={f}>{f}</th>)}</tr>
                      </thead>
                      <tbody>
                        {result.rows.slice(0, 200).map((row, i) => (
                          <tr key={i}>
                            {result.fields.map((f) => (
                              <td key={f}>{row[f] === null ? <em>null</em> : String(row[f])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.rows.length > 200 && (
                      <div className="sqll-truncated">showing first 200 of {fmtNum(result.rows.length)} rows</div>
                    )}
                  </div>
                ) : <div className="sqll-empty">Statement ran. No rows returned.</div>
              )}

              {!error && tab === "results" && !result && (
                <div className="sqll-empty">Run a query to see results, or hit Explain Analyze to read its plan.</div>
              )}

              {!error && tab === "plan" && plan && (
                <div className="sqll-plan">
                  {plan.nodes.map((n, i) => <PlanNode key={i} node={n} totalTime={totalSelfTime} />)}
                  <div className="sqll-plan-legend">
                    <span><i className="tone-warn" /> sequential scan</span>
                    <span><i className="tone-good" /> index access</span>
                    <span><i className="tone-join" /> join</span>
                    <span><i className="tone-note" /> sort / hash</span>
                    <span className="sqll-legend-note">bar length = share of execution time</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
