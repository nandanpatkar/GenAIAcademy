import React, { Suspense, createContext, lazy, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import {
  AppWindow,
  ArrowRight,
  Atom,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clipboard,
  ClipboardCheck,
  Code2,
  FilePlus2,
  Gauge,
  GitBranch,
  Image as ImageIcon,
  Layers,
  Workflow,
  Lightbulb,
  ListChecks,
  Maximize2,
  Pause,
  Play,
  Replace,
  RotateCcw,
  Route,
  ScanSearch,
  Table2,
  X,
} from "lucide-react";
import { practiceById } from "../practice/practiceData";
import { parseCaseInput } from "./replyParser";
import { summarizeResult } from "./prompt";
import { ArtifactShell, SandboxFrame } from "./ArtifactShell";
import { BarsViz, GraphViz, LinkedListViz, TreeViz } from "./VizArtifacts";

// React Flow is only downloaded when a flow artifact is shown.
const FlowArtifact = lazy(() => import("./FlowArtifact"));

SyntaxHighlighter.registerLanguage("python", python);

/**
 * What artifacts can do in the workspace: apply code, run it, add a test
 * case, open a problem, send a follow-up. Provided by DsaAiCoach.
 */
export const CoachActions = createContext({});
const useActions = () => useContext(CoachActions);

const pretty = (value) => (typeof value === "string" ? value : JSON.stringify(value, null, 0));
const levelClass = (level) => String(level || "").toLowerCase();

export function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" /> }}
    >
      {children}
    </ReactMarkdown>
  );
}

function Card({ icon: Icon, title, kicker, children, className = "", actions }) {
  return (
    <section className={`dcx-card ${className}`}>
      {(title || actions) && (
        <header className="dcx-card-head">
          {Icon && <span className="dcx-card-icon"><Icon size={14} /></span>}
          <div className="dcx-card-title">{kicker && <small>{kicker}</small>}<h4>{title}</h4></div>
          {actions && <div className="dcx-card-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

function Accordion({ title, children, defaultOpen = false, tone = "" }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={`dcx-acc${open ? " is-open" : ""}${tone ? ` is-${tone}` : ""}`}>
      <button type="button" className="dcx-acc-head" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
        <span>{title}</span><ChevronDown size={16} />
      </button>
      {open && <div className="dcx-acc-body" id={id}>{children}</div>}
    </div>
  );
}

/* ── Hints ───────────────────────────────────────────────────────────────── */

function HintsArtifact({ artifact }) {
  return (
    <div className="dcx-block">
      <p className="dcx-block-label">{artifact.title}:</p>
      {artifact.hints.map((hint, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Accordion key={index} title={hint.title}><Markdown>{hint.body}</Markdown></Accordion>
      ))}
    </div>
  );
}

/* ── Test cases ──────────────────────────────────────────────────────────── */

function TestCase({ test }) {
  const { addCustomCase, params } = useActions();
  const [added, setAdded] = useState(false);
  const input = parseCaseInput(test.input, params);
  const canAdd = Boolean(addCustomCase && input);
  return (
    <Accordion title={test.name}>
      {test.explanation && <div className="dcx-muted"><Markdown>{test.explanation}</Markdown></div>}
      <div className="dcx-io"><span>Input</span><pre>{input ? Object.entries(input).map(([key, value]) => `${key} = ${pretty(value)}`).join("\n") : pretty(test.input)}</pre></div>
      {test.hasExpected && <div className="dcx-io"><span>Expected</span><pre>{pretty(test.expected)}</pre></div>}
      {canAdd && (
        <button type="button" className="dcx-btn is-ghost" disabled={added} onClick={() => { addCustomCase(input, test.hasExpected ? test.expected : undefined); setAdded(true); }}>
          {added ? <><Check size={13} /> Added to sample cases</> : <><FilePlus2 size={13} /> Add to sample case</>}
        </button>
      )}
    </Accordion>
  );
}

function TestCasesArtifact({ artifact }) {
  return (
    <div className="dcx-block">
      <p className="dcx-block-label">{artifact.title}:</p>
      {artifact.cases.map((test, index) => <TestCase key={`${index}-${test.name}`} test={test} />)}
    </div>
  );
}

/* ── Code card (full solution, and any code block) ──────────────────────── */

function CodeView({ code, language, large = false }) {
  const lang = language === "python" ? "python" : "text";
  return (
    <SyntaxHighlighter
      language={lang}
      useInlineStyles={false}
      showLineNumbers={code.split("\n").length > 1}
      wrapLongLines={false}
      className={`dcx-code${large ? " is-large" : ""}`}
      codeTagProps={{ className: "dcx-code-inner" }}
      lineNumberStyle={{}}
    >
      {code}
    </SyntaxHighlighter>
  );
}

function CopyButton({ text, label = "Copy code" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="dcx-icon"
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { /* clipboard blocked */ }
      }}
    >
      {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
    </button>
  );
}

function ExpandedCode({ title, language, code, onClose }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div className="dcx-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="dcx-modal-scrim" aria-label="Close" onClick={onClose} />
      <div className="dcx-modal-body">
        <header><b>{title}</b><span>{language === "python" ? "Python" : language}</span><CopyButton text={code} /><button type="button" className="dcx-icon" onClick={onClose} aria-label="Close"><X size={15} /></button></header>
        <CodeView code={code} language={language} large />
      </div>
    </div>,
    // Inside the workspace shell, so the modal reads its theme tokens.
    document.querySelector(".dsa-workspace-shell, .dcx-host") || document.body,
  );
}

function RunOutcome({ outcome, script = false }) {
  if (!outcome) return null;
  if (outcome.state === "running") return <p className="dcx-run is-running">{script ? "Running…" : "Running on the samples…"}</p>;
  if (outcome.state === "error") return <p className="dcx-run is-fail"><CircleX size={14} /> {outcome.message}</p>;
  // A plain script run (AI from Scratch): show its output.
  if (!outcome.result.summary) {
    return (
      <div className="dcx-run is-output">
        <span>Output{outcome.result.cpuTime != null ? ` · ${outcome.result.cpuTime}s` : ""}</span>
        <pre>{outcome.result.output || "(no output)"}</pre>
      </div>
    );
  }
  const summary = outcome.result.summary || {};
  const ok = !summary.failed;
  return (
    <details className={`dcx-run ${ok ? "is-pass" : "is-fail"}`}>
      <summary>{ok ? <CircleCheck size={14} /> : <CircleX size={14} />} {summary.passed ?? 0}/{summary.total ?? 0} sample cases passed{summary.unjudged ? ` · ${summary.unjudged} ran without expected output` : ""}</summary>
      <pre>{summarizeResult(outcome.result, { max: 5 })}</pre>
    </details>
  );
}

export function CodeCard({ title, language = "python", code, intro, time, space, solution = false, readOnly = false }) {
  const { applyCode, runCode, runReady, codeMode } = useActions();
  // Lessons save code to CodeSpace and run it as a script; problems apply it
  // to the editor and run it on the sample tests.
  const lessonMode = codeMode === "lesson";
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const isPython = language === "python";
  const lines = code.split("\n").length;

  // applyCode may be async (saving to CodeSpace loads it on first use).
  const apply = async (mode) => {
    setMenuOpen(false);
    try {
      const label = await applyCode?.(code, mode, language);
      if (label) setApplied(label);
    } catch (error) {
      setApplied(`Couldn't save: ${error.message}`);
    }
  };
  const run = async () => {
    setOutcome({ state: "running" });
    try { setOutcome({ state: "done", result: await runCode(code) }); } catch (error) { setOutcome({ state: "error", message: error.message }); }
  };

  return (
    <div className={`dcx-codecard${solution ? " is-solution" : ""}`}>
      {solution && (
        <div className="dcx-codecard-title">
          <h4>{title}</h4>
          {(time || space) && <span className="dcx-complexity-pill">{time && <>Time <b>{time}</b></>}{space && <> · Space <b>{space}</b></>}</span>}
        </div>
      )}
      {intro && <div className="dcx-muted"><Markdown>{intro}</Markdown></div>}
      <div className="dcx-code-frame">
        <header>
          <span>{isPython ? "Python" : language || "Text"}{!solution && title && title !== "Full solution" ? ` · ${title}` : ""}</span>
          <CopyButton text={code} />
          {lines > 3 && <button type="button" className="dcx-icon" onClick={() => setExpanded(true)} aria-label="Expand code" title="Expand"><Maximize2 size={14} /></button>}
        </header>
        <CodeView code={code} language={language} />
      </div>
      {!readOnly && lessonMode && applyCode && lines > 1 && (
        <div className="dcx-code-actions">
          <button type="button" className="dcx-btn" onClick={() => apply("new")} disabled={Boolean(applied)}>{applied ? <><Check size={13} /> {applied}</> : <><FilePlus2 size={13} /> Save to CodeSpace</>}</button>
          {isPython && runReady && runCode && <button type="button" className="dcx-btn is-ghost" onClick={run} disabled={outcome?.state === "running"}><Play size={13} /> Run</button>}
        </div>
      )}
      {!readOnly && !lessonMode && isPython && applyCode && lines > 1 && (
        <div className="dcx-code-actions">
          <div className="dcx-split">
            <button type="button" className="dcx-btn" onClick={() => apply("new")}>{applied ? <><Check size={13} /> {applied}</> : <><Code2 size={13} /> Apply to compiler</>}</button>
            <button type="button" className="dcx-btn is-caret" aria-label="More ways to apply" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><ChevronDown size={13} /></button>
            {menuOpen && (
              <div className="dcx-menu" role="menu">
                <button type="button" role="menuitem" onClick={() => apply("new")}><FilePlus2 size={13} /> Open in a new tab</button>
                <button type="button" role="menuitem" onClick={() => apply("replace")}><Replace size={13} /> Replace the current tab</button>
              </div>
            )}
          </div>
          {runReady && runCode && <button type="button" className="dcx-btn is-ghost" onClick={run} disabled={outcome?.state === "running"}><Play size={13} /> Run on samples</button>}
        </div>
      )}
      <RunOutcome outcome={outcome} script={lessonMode} />
      {expanded && <ExpandedCode title={title || "Code"} language={language} code={code} onClose={() => setExpanded(false)} />}
    </div>
  );
}

/* ── Dry run ─────────────────────────────────────────────────────────────── */

function DataTable({ headers, rows }) {
  return (
    <div className="dcx-table-wrap">
      <table className="dcx-table">
        <thead><tr>{headers.map((header, index) => <th key={`${index}-${header}`}>{header}</th>)}</tr></thead>
        {/* eslint-disable-next-line react/no-array-index-key */}
        <tbody>{rows.map((row, index) => <tr key={index}>{headers.map((_, cell) => <td key={cell}>{row[cell] ?? ""}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function DryRunArtifact({ artifact }) {
  const [index, setIndex] = useState(0);
  const run = artifact.runs[Math.min(index, artifact.runs.length - 1)];
  return (
    <Card icon={ScanSearch} title={artifact.title} className="is-dryrun">
      {artifact.runs.length > 1 && (
        <div className="dcx-seg" role="tablist">
          {artifact.runs.map((item, runIndex) => <button type="button" role="tab" key={`${runIndex}-${item.name}`} aria-selected={runIndex === index} className={runIndex === index ? "is-active" : ""} onClick={() => setIndex(runIndex)}>{item.name}</button>)}
        </div>
      )}
      {run.intro && <div className="dcx-muted"><Markdown>{run.intro}</Markdown></div>}
      {run.input && <div className="dcx-io"><span>Input</span><pre>{run.input}</pre></div>}
      {run.steps.length > 0 && <ol className="dcx-steps">{run.steps.map((step, stepIndex) => <li key={`${stepIndex}-${step.slice(0, 12)}`}><Markdown>{step}</Markdown></li>)}</ol>}
      {run.table && <DataTable headers={run.table.headers} rows={run.table.rows} />}
      {run.walkthrough && <div className="dcx-walk"><b>Walkthrough</b><Markdown>{run.walkthrough}</Markdown></div>}
      {run.result && <div className="dcx-result"><ArrowRight size={13} /> <div><Markdown>{run.result}</Markdown></div></div>}
    </Card>
  );
}

/* ── Trace: an animated array / grid walkthrough ─────────────────────────── */

const cellKey = (value) => (Array.isArray(value) ? value.join(",") : String(value));

function TraceArray({ frame }) {
  const highlight = new Set(frame.highlight.filter(Number.isInteger));
  const done = new Set(frame.done);
  const pointersAt = {};
  Object.entries(frame.pointers).forEach(([name, at]) => { if (Number.isInteger(at)) (pointersAt[at] ||= []).push(name); });
  return (
    <div className="dcx-trace-array" style={{ "--cells": frame.array.length }}>
      {frame.array.map((value, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={`dcx-cell${highlight.has(index) ? " is-hl" : ""}${done.has(index) ? " is-done" : ""}`}>
          <span className="dcx-cell-value">{pretty(value)}</span>
          <span className="dcx-cell-index">{index}</span>
          <span className="dcx-cell-ptr">{(pointersAt[index] || []).join(" ")}</span>
        </div>
      ))}
    </div>
  );
}

function TraceGrid({ frame }) {
  const highlight = new Set(frame.highlight.filter(Array.isArray).map(cellKey));
  const pointersAt = {};
  Object.entries(frame.pointers).forEach(([name, at]) => { if (Array.isArray(at)) (pointersAt[cellKey(at)] ||= []).push(name); });
  return (
    <div className="dcx-table-wrap">
      <table className="dcx-trace-grid">
        <tbody>
          {frame.grid.map((row, r) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={r}>
              {row.map((value, c) => {
                const key = `${r},${c}`;
                // eslint-disable-next-line react/no-array-index-key
                return <td key={c} className={highlight.has(key) ? "is-hl" : pointersAt[key] ? "is-ptr" : ""}>{pretty(value)}{pointersAt[key] && <small>{pointersAt[key].join(" ")}</small>}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TraceArtifact({ artifact }) {
  const { frames } = artifact;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = frames[index];

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= frames.length - 1) { setPlaying(false); return current; }
        return current + 1;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [playing, frames.length]);

  const go = (next) => { setPlaying(false); setIndex(Math.max(0, Math.min(frames.length - 1, next))); };
  const onKey = (event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
  };

  return (
    <Card icon={Route} title={artifact.title} kicker="Visual walkthrough" className="is-trace">
      <div className="dcx-trace-stage" tabIndex={0} onKeyDown={onKey} aria-label={`Step ${index + 1} of ${frames.length}. Use the arrow keys to step.`}>
        {frame.array ? <TraceArray frame={frame} /> : <TraceGrid frame={frame} />}
        {frame.vars && Object.keys(frame.vars).length > 0 && (
          <div className="dcx-vars">{Object.entries(frame.vars).map(([name, value]) => <span key={name}><b>{name}</b> = {pretty(value)}</span>)}</div>
        )}
        <p className="dcx-trace-note" aria-live="polite">{frame.note || " "}</p>
      </div>
      <div className="dcx-trace-controls">
        <button type="button" className="dcx-icon" onClick={() => go(0)} aria-label="Restart" title="Restart"><RotateCcw size={14} /></button>
        <button type="button" className="dcx-icon" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous step"><ChevronLeft size={15} /></button>
        <button
          type="button"
          className="dcx-icon is-primary"
          onClick={() => { if (index >= frames.length - 1) setIndex(0); setPlaying((value) => !value); }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button type="button" className="dcx-icon" onClick={() => go(index + 1)} disabled={index === frames.length - 1} aria-label="Next step"><ChevronRight size={15} /></button>
        <input type="range" min={0} max={frames.length - 1} value={index} onChange={(event) => go(Number(event.target.value))} aria-label="Step" />
        <span className="dcx-trace-count">{index + 1} / {frames.length}</span>
      </div>
    </Card>
  );
}

/* ── Complexity, review, pattern, approach ───────────────────────────────── */

function ComplexityArtifact({ artifact }) {
  const verdict = artifact.meetsExpected;
  return (
    <Card
      icon={Gauge}
      title="Complexity"
      className="is-complexity"
      actions={verdict !== null && <span className={`dcx-badge ${verdict ? "is-pass" : "is-warn"}`}>{verdict ? "Meets expected" : "Does not meet expected"}</span>}
    >
      {artifact.intro && <div className="dcx-muted"><Markdown>{artifact.intro}</Markdown></div>}
      <div className="dcx-cx-grid">
        <span />
        <b>Time</b>
        <b>Space</b>
        <span className="dcx-cx-row">Yours</span>
        <code>{artifact.yoursTime || "–"}</code>
        <code>{artifact.yoursSpace || "–"}</code>
        <span className="dcx-cx-row">Expected</span>
        <code className="is-expected">{artifact.expectedTime || "–"}</code>
        <code className="is-expected">{artifact.expectedSpace || "–"}</code>
      </div>
      {artifact.summary && <div className="dcx-summary"><Markdown>{artifact.summary}</Markdown></div>}
    </Card>
  );
}

function ReviewArtifact({ artifact }) {
  return (
    <Card icon={ListChecks} title="Code review" className="is-review">
      {artifact.verdict && <p className="dcx-verdict">{artifact.verdict}</p>}
      {artifact.good && <div className="dcx-review-part is-good"><b><CircleCheck size={14} /> What you&apos;ve done well</b><Markdown>{artifact.good}</Markdown></div>}
      {artifact.missing && <div className="dcx-review-part is-missing"><b><CircleX size={14} /> What&apos;s missing</b><Markdown>{artifact.missing}</Markdown></div>}
      {artifact.improvements.length > 0 && (
        <div className="dcx-review-part">
          <b>Improvements</b>
          <ul className="dcx-improvements">
            {artifact.improvements.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>{item.focus && <span className="dcx-tag">{item.focus}</span>}<Markdown>{item.advice}</Markdown></li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function PatternArtifact({ artifact }) {
  return (
    <Card icon={Lightbulb} kicker="Pattern" title={artifact.pattern} className="is-pattern">
      {artifact.why && <div className="dcx-labelled"><b>Why it fits</b><Markdown>{artifact.why}</Markdown></div>}
      {artifact.whenToUse && <div className="dcx-labelled"><b>When to use it</b><Markdown>{artifact.whenToUse}</Markdown></div>}
    </Card>
  );
}

function ApproachArtifact({ artifact }) {
  return (
    <Card icon={GitBranch} kicker="Approach" title={artifact.title} className="is-approach">
      {artifact.intro && <div className="dcx-muted"><Markdown>{artifact.intro}</Markdown></div>}
      {artifact.algorithm && <div className="dcx-labelled"><b>Algorithm</b><Markdown>{artifact.algorithm}</Markdown></div>}
      {artifact.pseudocode && <div className="dcx-labelled"><b>Pseudocode</b><pre className="dcx-pseudo">{artifact.pseudocode}</pre></div>}
    </Card>
  );
}

/* ── MCQ ─────────────────────────────────────────────────────────────────── */

function McqArtifact({ artifact }) {
  const { sendPrompt } = useActions();
  const [picked, setPicked] = useState(null);
  const known = artifact.answer !== null;
  const correct = known && picked === artifact.answer;
  return (
    <Card icon={ListChecks} kicker="Quick check" title={artifact.question} className="is-mcq">
      <div className="dcx-options" role="radiogroup" aria-label={artifact.question}>
        {artifact.options.map((option, index) => {
          const state = picked === null || !known ? "" : option.id === artifact.answer ? " is-correct" : option.id === picked ? " is-wrong" : "";
          return (
            <button
              type="button"
              role="radio"
              aria-checked={picked === option.id}
              key={option.id}
              className={`dcx-option${picked === option.id ? " is-picked" : ""}${state}`}
              disabled={picked !== null && known}
              onClick={() => setPicked(option.id)}
            >
              <span className="dcx-option-key">{String.fromCharCode(65 + index)}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && known && (
        <div className={`dcx-mcq-result ${correct ? "is-pass" : "is-fail"}`}>
          <b>{correct ? "Correct!" : "Not quite."}</b>
          {artifact.explanation && <Markdown>{artifact.explanation}</Markdown>}
        </div>
      )}
      {picked !== null && !known && sendPrompt && (
        <button type="button" className="dcx-btn is-ghost" onClick={() => sendPrompt(`My answer: ${artifact.options.find((option) => option.id === picked)?.label}. Is that right? Explain.`)}>Check my answer</button>
      )}
    </Card>
  );
}

/* ── Table, problems ─────────────────────────────────────────────────────── */

function TableArtifact({ artifact }) {
  return (
    <Card icon={Table2} title={artifact.title || "Comparison"} className="is-table">
      <DataTable headers={artifact.headers} rows={artifact.rows} />
      {artifact.caption && <p className="dcx-caption">{artifact.caption}</p>}
    </Card>
  );
}

function ProblemsArtifact({ artifact }) {
  const { openProblem } = useActions();
  const items = artifact.items.map((item) => ({ ...item, problem: practiceById.get(item.id) })).filter((item) => item.problem);
  if (!items.length) return null;
  return (
    <Card icon={Route} title={artifact.title} className="is-problems">
      <ul className="dcx-problems">
        {items.map(({ problem, reason }) => (
          <li key={problem.id}>
            <button type="button" onClick={() => openProblem?.(problem.id)} disabled={!openProblem}>
              <span><b>{problem.title}</b>{reason && <small>{reason}</small>}</span>
              <em className={`dcx-level ${levelClass(problem.difficulty)}`}>{problem.difficulty}</em>
              <ArrowRight size={14} />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── Flashcards, lessons ─────────────────────────────────────────────────── */

function FlashcardsArtifact({ artifact }) {
  const { cards } = artifact;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());
  const card = cards[index];
  const go = (next) => { setFlipped(false); setIndex((next + cards.length) % cards.length); };
  const markKnown = () => {
    setKnown((prev) => new Set(prev).add(index));
    if (known.size + 1 < cards.length) go(index + 1);
  };
  return (
    <Card icon={Layers} kicker="Flashcards" title={artifact.title} className="is-flashcards" actions={<span className="dcx-badge is-pass">{known.size}/{cards.length} known</span>}>
      <button
        type="button"
        className={`dcx-flashcard${flipped ? " is-flipped" : ""}`}
        onClick={() => setFlipped((value) => !value)}
        aria-label={flipped ? "Show the question" : "Show the answer"}
      >
        <small>{flipped ? "Answer" : `Card ${index + 1} of ${cards.length}`}</small>
        <div className="dcx-flashcard-body">{flipped ? <Markdown>{card.back}</Markdown> : <p>{card.front}</p>}</div>
        <span className="dcx-flashcard-hint">{flipped ? "Tap to see the question" : "Tap to reveal"}</span>
      </button>
      <div className="dcx-flash-controls">
        <button type="button" className="dcx-icon" onClick={() => go(index - 1)} aria-label="Previous card"><ChevronLeft size={15} /></button>
        <button type="button" className="dcx-btn is-ghost" onClick={() => go(index + 1)}>Still learning</button>
        <button type="button" className="dcx-btn" onClick={markKnown} disabled={known.has(index)}><Check size={13} /> Got it</button>
        <button type="button" className="dcx-icon" onClick={() => go(index + 1)} aria-label="Next card"><ChevronRight size={15} /></button>
      </div>
    </Card>
  );
}

function LessonsArtifact({ artifact }) {
  const { resolveLesson, openLesson } = useActions();
  const items = artifact.items.map((item) => ({ ...item, lesson: resolveLesson?.(item.slug) })).filter((item) => item.lesson);
  if (!items.length) return null;
  return (
    <Card icon={BookOpen} title={artifact.title} className="is-problems">
      <ul className="dcx-problems">
        {items.map(({ lesson, reason }) => (
          <li key={lesson.slug}>
            <button type="button" onClick={() => openLesson?.(lesson.slug)} disabled={!openLesson}>
              <span><b>{lesson.title}</b>{(reason || lesson.phaseTitle) && <small>{reason || lesson.phaseTitle}</small>}</span>
              {lesson.time && <em className="dcx-level">{lesson.time.replace(/^~\s*/, "")}</em>}
              <ArrowRight size={14} />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── Mermaid (lazy, strict) ──────────────────────────────────────────────── */

let mermaidQueue = Promise.resolve();
let mermaidModule = null;
const loadMermaid = () => (mermaidModule ||= import("mermaid").then((module) => module.default));

/** Renders one diagram at a time in `strict` mode, then restores the app's
 *  shared config (MermaidDiagram.jsx sets it once at import). */
function renderMermaid(code, dark) {
  const job = mermaidQueue.then(async () => {
    const mermaid = await loadMermaid();
    mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default", securityLevel: "strict", fontFamily: "inherit" });
    try {
      const { svg } = await mermaid.render(`dcx-mermaid-${Math.random().toString(36).slice(2)}`, code);
      return svg;
    } finally {
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose", fontFamily: "var(--font)" });
    }
  });
  mermaidQueue = job.catch(() => {});
  return job;
}

function MermaidArtifact({ code, title }) {
  const { isDark = true, sendPrompt } = useActions();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    renderMermaid(code, isDark).then((result) => { if (alive) { setSvg(result); setError(""); } }).catch((reason) => { if (alive) setError(reason?.message || "This diagram couldn't be drawn."); });
    return () => { alive = false; };
  }, [code, isDark]);
  return (
    <ArtifactShell
      icon={GitBranch}
      kind="Mermaid diagram"
      title={title || "Diagram"}
      code={code}
      language="mermaid"
      filename="diagram.mmd"
      error={error ? `Couldn't draw this diagram: ${error.split("\n")[0]}` : ""}
      onFix={sendPrompt ? () => sendPrompt(`The Mermaid diagram "${title || "Diagram"}" failed to render: ${error.split("\n")[0]}. Fix the syntax and send the full corrected diagram.`) : null}
      renderPreview={({ full }) => (error ? <pre className="dcx-artifact-code">{code}</pre>
        // strict-mode Mermaid output is sanitized by Mermaid itself
        : svg ? <div className={`dcx-mermaid${full ? " is-full" : ""}`} dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="dcx-muted">Drawing…</p>)}
    />
  );
}

/* ── Sandboxed HTML / React, SVG, React Flow ─────────────────────────────── */

function SandboxArtifact({ code, title, mode }) {
  const { isDark = true, sendPrompt } = useActions();
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const kind = mode === "react" ? "React component" : "HTML";
  const theme = isDark ? "dark" : "light";
  return (
    <ArtifactShell
      icon={mode === "react" ? Atom : AppWindow}
      kind={kind}
      title={title}
      code={code}
      language={mode === "react" ? "jsx" : "html"}
      filename={mode === "react" ? "Artifact.jsx" : "artifact.html"}
      mime={mode === "react" ? "text/javascript" : "text/html"}
      error={error}
      onReload={() => { setError(""); setReloadKey((value) => value + 1); }}
      onFix={sendPrompt ? () => sendPrompt(`The ${kind} artifact "${title}" failed with this error: ${error}\nFix it and send the complete corrected artifact.`) : null}
      renderPreview={({ full }) => <SandboxFrame source={code} mode={mode} theme={theme} full={full} title={title} reloadKey={reloadKey} onError={(message) => setError((current) => current || message)} />}
    />
  );
}

function SvgArtifact({ code, title }) {
  // As an <img>, an SVG can't run scripts or load anything.
  const src = useMemo(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(code)}`, [code]);
  return (
    <ArtifactShell
      icon={ImageIcon}
      kind="SVG"
      title={title}
      code={code}
      language="svg"
      filename="image.svg"
      mime="image/svg+xml"
      renderPreview={({ full }) => <div className={`dcx-svg${full ? " is-full" : ""}`}><img src={src} alt={title} /></div>}
    />
  );
}

function FlowArtifactCard({ artifact }) {
  const { isDark = true } = useActions();
  const source = useMemo(() => JSON.stringify({ type: "flow", title: artifact.title, direction: artifact.direction, nodes: artifact.nodes, edges: artifact.edges, groups: artifact.groups, steps: artifact.steps }, null, 2), [artifact]);
  return (
    <ArtifactShell
      icon={Workflow}
      kind={`React Flow · ${artifact.nodes.length} nodes${artifact.steps.length ? ` · ${artifact.steps.length} steps` : ""}`}
      title={artifact.title}
      code={source}
      language="json"
      filename="flow.json"
      mime="application/json"
      renderPreview={({ full }) => (
        <Suspense fallback={<p className="dcx-muted">Loading the diagram…</p>}>
          <FlowArtifact artifact={artifact} full={full} isDark={isDark} />
        </Suspense>
      )}
    />
  );
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */

const RENDERERS = {
  hints: HintsArtifact,
  test_cases: TestCasesArtifact,
  dry_run: DryRunArtifact,
  trace: TraceArtifact,
  complexity: ComplexityArtifact,
  review: ReviewArtifact,
  pattern: PatternArtifact,
  approach: ApproachArtifact,
  mcq: McqArtifact,
  table: TableArtifact,
  problems: ProblemsArtifact,
  flashcards: FlashcardsArtifact,
  lessons: LessonsArtifact,
  flow: FlowArtifactCard,
  tree: TreeViz,
  graph: GraphViz,
  bars: BarsViz,
  linked_list: LinkedListViz,
};

export function Segment({ segment }) {
  if (segment.type === "markdown") return <div className="dcx-md"><Markdown>{segment.text}</Markdown></div>;
  if (segment.type === "code") return <CodeCard language={segment.lang} code={segment.code} title={segment.meta.replace(/^title=["']?|["']$/g, "")} />;
  if (segment.type === "mermaid") return <MermaidArtifact code={segment.code} title={segment.title} />;
  if (segment.type === "html") return <SandboxArtifact code={segment.code} title={segment.title} mode="html" />;
  if (segment.type === "react") return <SandboxArtifact code={segment.code} title={segment.title} mode="react" />;
  if (segment.type === "svg") return <SvgArtifact code={segment.code} title={segment.title} />;
  if (segment.type === "invalid") return <CodeCard language="text" title="Couldn't render this block" code={segment.source} readOnly />;
  if (segment.type !== "artifact") return null;
  const { artifact } = segment;
  if (artifact.type === "solution") return <CodeCard solution {...artifact} />;
  const Renderer = RENDERERS[artifact.type];
  return Renderer ? <Renderer artifact={artifact} /> : null;
}

export function FollowUps({ items, disabled }) {
  const { sendPrompt } = useActions();
  const unique = useMemo(() => [...new Set(items)], [items]);
  const ref = useRef(null);
  if (!unique.length || !sendPrompt) return null;
  return (
    <div className="dcx-followups" ref={ref}>
      {unique.map((item) => <button type="button" key={item} onClick={() => sendPrompt(item)} disabled={disabled}>{item}</button>)}
    </div>
  );
}
