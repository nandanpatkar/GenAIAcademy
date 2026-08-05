import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, Check, Cpu, Gauge, Lock, LockOpen, Play, RotateCcw,
  ShieldCheck, SkipForward, Split, Unlock, X, Zap,
} from "lucide-react";
import { SCENARIOS } from "../data/concurrencyScenarios";
import "./ConcurrencyLab.css";

/**
 * Concurrency & Race Condition Lab.
 *
 * Races are invisible in normal execution — the broken interleaving fires once
 * in ten thousand runs and never on your machine. This lab makes the scheduler
 * the thing you control: you pick which thread takes the next step, so you can
 * *drive* the program into the failure by hand.
 *
 * Then it does the part a debugger can't: enumerates every possible interleaving
 * and reports what fraction of them violate the invariant. "This bug fires in
 * 33% of schedules" is a fact you can act on; "it worked on my machine" is not.
 */

const EXPLORE_CAP = 200000;

// ── scheduler engine (pure) ──────────────────────────────────────────────────

const initialState = (scenario, threads) => ({
  mem: { ...scenario.memory },
  locals: threads.map(() => ({})),
  locks: {},
  pcs: threads.map(() => 0),
  log: [],
});

const threadDone = (state, threads, ti) => state.pcs[ti] >= threads[ti].steps.length;

const canRun = (state, threads, ti) => {
  if (threadDone(state, threads, ti)) return false;
  const step = threads[ti].steps[state.pcs[ti]];
  if (step.kind === "lock") {
    const holder = state.locks[step.target];
    return holder === undefined || holder === ti;
  }
  return true;
};

const advance = (state, threads, ti) => {
  const pc = state.pcs[ti];
  const step = threads[ti].steps[pc];

  let mem = state.mem;
  const locals = [...state.locals];
  const locks = { ...state.locks };

  if (step.kind === "lock") {
    locks[step.target] = ti;
  } else if (step.kind === "unlock") {
    delete locks[step.target];
  } else {
    const next = step.run(state.mem, state.locals[ti]);
    mem = next.mem;
    locals[ti] = next.local;
  }

  const pcs = [...state.pcs];
  pcs[ti] = pc + 1;

  return {
    mem,
    locals,
    locks,
    pcs,
    log: [...state.log, { ti, pc, label: step.label, kind: step.kind, threadName: threads[ti].name }],
  };
};

const allDone = (state, threads) => threads.every((_, i) => threadDone(state, threads, i));
const runnableThreads = (state, threads) => threads.map((_, i) => i).filter((i) => canRun(state, threads, i));
const isDeadlocked = (state, threads) => !allDone(state, threads) && runnableThreads(state, threads).length === 0;

/**
 * Depth-first enumeration of every interleaving. Returns pass/fail/deadlock
 * counts plus one concrete failing schedule the learner can replay step by step.
 */
const exploreAll = (scenario, threads) => {
  let pass = 0, fail = 0, deadlock = 0, total = 0, truncated = false;
  let failPath = null, deadPath = null;

  const walk = (state, path) => {
    if (total >= EXPLORE_CAP) { truncated = true; return; }

    if (allDone(state, threads)) {
      total++;
      if (scenario.check(state.mem)) pass++;
      else { fail++; if (!failPath) failPath = path; }
      return;
    }

    const runnable = runnableThreads(state, threads);
    if (!runnable.length) {
      total++; deadlock++;
      if (!deadPath) deadPath = path;
      return;
    }

    for (const ti of runnable) {
      walk(advance(state, threads, ti), [...path, ti]);
      if (total >= EXPLORE_CAP) { truncated = true; return; }
    }
  };

  walk(initialState(scenario, threads), []);
  return { pass, fail, deadlock, total, truncated, failPath, deadPath };
};

// ── UI helpers ───────────────────────────────────────────────────────────────

const KIND_ICON = { lock: Lock, unlock: Unlock, read: Activity, write: Zap, compute: Cpu };
const pct = (n, d) => (d > 0 ? ((n / d) * 100) : 0);

// ── component ────────────────────────────────────────────────────────────────

export default function ConcurrencyLab({ onClose }) {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [variant, setVariant] = useState("unsafe");
  const [state, setState] = useState(null);
  const [report, setReport] = useState(null);
  const [queue, setQueue] = useState(null);     // scripted schedule being replayed
  const [autoplay, setAutoplay] = useState(false);
  const logRef = useRef(null);

  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId), [scenarioId]);
  const threads = useMemo(() => scenario.variants[variant], [scenario, variant]);

  const reset = useCallback(() => {
    setState(initialState(scenario, threads));
    setQueue(null);
    setAutoplay(false);
  }, [scenario, threads]);

  useEffect(() => { reset(); setReport(null); }, [reset]);

  // Exploration is synchronous and fast (worst case ~35k paths), but yield a
  // frame first so the button's pressed state paints.
  const runExploration = () => {
    setReport({ pending: true });
    requestAnimationFrame(() => setReport(exploreAll(scenario, threads)));
  };

  const step = useCallback((ti) => {
    setState((prev) => {
      if (!prev || !canRun(prev, threads, ti)) return prev;
      return advance(prev, threads, ti);
    });
  }, [threads]);

  // Replay a specific failing schedule found by the explorer.
  const loadSchedule = (path) => {
    setState(initialState(scenario, threads));
    setQueue([...path]);
    setAutoplay(true);
  };

  useEffect(() => {
    if (!autoplay || !state) return;
    const done = allDone(state, threads) || isDeadlocked(state, threads);
    if (done) { setAutoplay(false); setQueue(null); return; }

    const timer = setTimeout(() => {
      if (queue && queue.length) {
        const [next, ...rest] = queue;
        setQueue(rest);
        step(next);
      } else if (queue) {
        setAutoplay(false);
      } else {
        const runnable = runnableThreads(state, threads);
        if (runnable.length) step(runnable[Math.floor(Math.random() * runnable.length)]);
      }
    }, 420);
    return () => clearTimeout(timer);
  }, [autoplay, state, queue, threads, step]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state?.log.length]);

  if (!state) return null;

  const finished = allDone(state, threads);
  const deadlocked = isDeadlocked(state, threads);
  const invariantHolds = scenario.check(state.mem);
  const runnable = runnableThreads(state, threads);
  const totalSteps = threads.reduce((n, t) => n + t.steps.length, 0);

  const outcome = deadlocked
    ? { tone: "dead", title: "Deadlock", body: "No thread can proceed. Every one is waiting for a lock another holds — the program is stuck, not crashed." }
    : finished && !invariantHolds
      ? { tone: "fail", title: "Invariant violated", body: `Expected ${scenario.invariantLabel}. This schedule broke it.` }
      : finished
        ? { tone: "pass", title: "Invariant holds", body: `${scenario.invariantLabel} — this particular interleaving was fine. Others may not be.` }
        : null;

  return (
    <div className="concurrency-lab">
      {/* ── top bar ── */}
      <header className="cl-topbar">
        <div className="cl-brand">
          <span className="cl-brand-mark"><Split size={17} /></span>
          <div>
            <strong>Concurrency &amp; Race Condition Lab</strong>
            <small>deterministic scheduler · exhaustive interleaving search</small>
          </div>
        </div>
        <div className="cl-top-actions">
          <div className="cl-variant">
            <button className={variant === "unsafe" ? "is-on" : ""} onClick={() => setVariant("unsafe")}>
              <LockOpen size={12} /> Unsynchronised
            </button>
            <button className={variant === "fixed" ? "is-on" : ""} onClick={() => setVariant("fixed")}>
              <ShieldCheck size={12} /> {scenario.fixLabel.length > 34 ? "Synchronised" : "Fixed"}
            </button>
          </div>
          {onClose && <button className="cl-close" onClick={onClose}><X size={15} /></button>}
        </div>
      </header>

      <div className="cl-body">
        {/* ── left rail ── */}
        <aside className="cl-rail">
          <h4>Scenarios</h4>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              className={`cl-scenario ${scenarioId === s.id ? "is-active" : ""}`}
              onClick={() => { setScenarioId(s.id); setVariant("unsafe"); }}
            >
              <span className="cl-scenario-title">{s.title}</span>
              <span className="cl-scenario-tag">{s.tagline}</span>
              <span className="cl-scenario-meta"><em>{s.difficulty}</em> · {s.concept}</span>
            </button>
          ))}
        </aside>

        {/* ── centre ── */}
        <main className="cl-main">
          <section className="cl-brief">
            <div className="cl-brief-head">
              <h3>{scenario.title}</h3>
              <span className="cl-chip">{scenario.concept}</span>
              <span className="cl-invariant">
                invariant: <b>{scenario.invariantLabel}</b>
              </span>
            </div>
            <p>{scenario.brief}</p>
            {variant === "fixed" && <div className="cl-fixnote"><ShieldCheck size={13} /> <span>{scenario.fixNote}</span></div>}
          </section>

          {/* thread columns */}
          <section className="cl-threads" style={{ "--cl-cols": threads.length }}>
            {threads.map((t, ti) => {
              const pc = state.pcs[ti];
              const done = threadDone(state, threads, ti);
              const blocked = !done && !canRun(state, threads, ti);
              return (
                <div key={t.name} className={`cl-thread ${blocked ? "is-blocked" : ""} ${done ? "is-done" : ""}`}>
                  <div className="cl-thread-head">
                    <span className="cl-thread-name">{t.name}</span>
                    {blocked && <span className="cl-blocked-tag"><Lock size={10} /> blocked</span>}
                    {done && <span className="cl-done-tag"><Check size={10} /> done</span>}
                  </div>

                  <ol className="cl-steps">
                    {t.steps.map((s, si) => {
                      const Icon = KIND_ICON[s.kind] || Cpu;
                      const isCurrent = si === pc && !done;
                      return (
                        <li
                          key={si}
                          className={`cl-step kind-${s.kind} ${si < pc ? "is-past" : ""} ${isCurrent ? "is-current" : ""}`}
                        >
                          <Icon size={11} />
                          <code>{s.code}</code>
                        </li>
                      );
                    })}
                  </ol>

                  <button
                    className="cl-step-btn"
                    disabled={done || blocked || autoplay}
                    onClick={() => step(ti)}
                  >
                    <SkipForward size={12} /> {done ? "finished" : blocked ? "waiting on lock" : "Step this thread"}
                  </button>
                </div>
              );
            })}
          </section>

          {/* memory + log */}
          <section className="cl-runtime">
            <div className="cl-memory">
              <h4>Shared memory</h4>
              <div className="cl-mem-grid">
                {Object.entries(state.mem).map(([k, v]) => (
                  <div key={k} className="cl-mem-cell">
                    <span>{k}</span><b>{String(v)}</b>
                  </div>
                ))}
              </div>
              {Object.keys(state.locks).length > 0 && (
                <div className="cl-locks">
                  {Object.entries(state.locks).map(([name, holder]) => (
                    <span key={name} className="cl-lock-held">
                      <Lock size={10} /> {name} held by {threads[holder].name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="cl-log">
              <h4>Execution order <span>{state.log.length}/{totalSteps}</span></h4>
              <div className="cl-log-list" ref={logRef}>
                {state.log.length === 0 && <div className="cl-log-empty">Pick a thread to take the first step.</div>}
                {state.log.map((e, i) => (
                  <div key={i} className={`cl-log-row t${e.ti} kind-${e.kind}`}>
                    <span className="cl-log-n">{i + 1}</span>
                    <span className="cl-log-thread">{e.threadName}</span>
                    <code>{e.label}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {outcome && (
            <div className={`cl-outcome tone-${outcome.tone}`}>
              {outcome.tone === "pass" ? <Check size={15} /> : <AlertTriangle size={15} />}
              <div><strong>{outcome.title}</strong><p>{outcome.body}</p></div>
              <button onClick={reset}><RotateCcw size={12} /> Reset</button>
            </div>
          )}
        </main>

        {/* ── right: exploration ── */}
        <aside className="cl-explore">
          <h4><Gauge size={12} /> Interleaving search</h4>
          <p className="cl-explore-blurb">
            Enumerate every legal ordering of these {totalSteps} steps and check the invariant on each one.
          </p>

          <div className="cl-explore-actions">
            <button className="cl-primary" onClick={runExploration}>
              <Gauge size={13} /> Explore all interleavings
            </button>
            <div className="cl-run-row">
              <button onClick={() => { setQueue(null); setAutoplay((v) => !v); }} disabled={finished || deadlocked}>
                <Play size={12} /> {autoplay ? "Pause" : "Random run"}
              </button>
              <button onClick={reset}><RotateCcw size={12} /> Reset</button>
            </div>
          </div>

          {report?.pending && <div className="cl-explore-pending">Enumerating…</div>}

          {report && !report.pending && (
            <div className="cl-report">
              <div className="cl-headline">
                <span className={`cl-headline-num ${report.fail + report.deadlock > 0 ? "is-bad" : "is-good"}`}>
                  {pct(report.fail + report.deadlock, report.total).toFixed(1)}%
                </span>
                <span className="cl-headline-label">
                  of {report.total.toLocaleString()} interleavings
                  {report.fail + report.deadlock > 0 ? " break the invariant" : " are correct"}
                </span>
              </div>

              <div className="cl-bar">
                <div className="cl-bar-pass" style={{ width: `${pct(report.pass, report.total)}%` }} />
                <div className="cl-bar-fail" style={{ width: `${pct(report.fail, report.total)}%` }} />
                <div className="cl-bar-dead" style={{ width: `${pct(report.deadlock, report.total)}%` }} />
              </div>

              <ul className="cl-legend">
                <li><i className="pass" /> correct <b>{report.pass.toLocaleString()}</b></li>
                <li><i className="fail" /> invariant broken <b>{report.fail.toLocaleString()}</b></li>
                <li><i className="dead" /> deadlocked <b>{report.deadlock.toLocaleString()}</b></li>
              </ul>

              {report.truncated && (
                <div className="cl-trunc">Search capped at {EXPLORE_CAP.toLocaleString()} paths.</div>
              )}

              {report.failPath && (
                <button className="cl-replay" onClick={() => loadSchedule(report.failPath)}>
                  <Play size={12} /> Replay a failing schedule
                </button>
              )}
              {report.deadPath && (
                <button className="cl-replay is-dead" onClick={() => loadSchedule(report.deadPath)}>
                  <Play size={12} /> Replay the deadlock
                </button>
              )}

              {report.fail + report.deadlock === 0 && (
                <div className="cl-safe">
                  <ShieldCheck size={14} />
                  <span>No interleaving breaks the invariant. This code is correct under <em>every</em> schedule — not just the ones you happened to test.</span>
                </div>
              )}

              {variant === "unsafe" && report.fail + report.deadlock > 0 && (
                <button className="cl-try-fix" onClick={() => setVariant("fixed")}>
                  <ShieldCheck size={12} /> Apply the fix &amp; re-measure
                </button>
              )}
            </div>
          )}

          <div className="cl-tip">
            <strong>Why this matters</strong>
            <p>
              A race that breaks {report && !report.pending ? `${pct(report.fail + report.deadlock, report.total).toFixed(0)}%` : "5%"} of
              schedules can still pass a thousand test runs, because a real scheduler
              doesn't sample interleavings uniformly — it strongly favours a few. That's
              why races reach production and then fire under load.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
