import React, { useEffect, useMemo, useRef, useState } from "react";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const pct = (value) => `${Math.round(value)}%`;

function Icon({ name, size = 18 }) {
  const paths = {
    lab: <><path d="M9 3v5l-5 9a3 3 0 0 0 2.6 4.5h10.8A3 3 0 0 0 20 17l-5-9V3" /><path d="M7 15h10M8 3h8" /></>,
    run: <path d="m8 5 11 7-11 7Z" />,
    tune: <><path d="M4 6h16M7 12h10M10 18h4" /><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></>,
    inspect: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.7-3.7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    alert: <><path d="M12 3 2.5 20h19Z" /><path d="M12 9v4M12 17h.01" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
    pause: <><path d="M9 6v12M15 6v12" /></>,
    reset: <><path d="M4 11a8 8 0 1 1 2.3 6" /><path d="M4 4v7h7" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function CurveVisual({ values, accent }) {
  const points = Array.from({ length: 18 }, (_, index) => {
    const x = 12 + index * 12.5;
    const wave = Math.sin(index * .72 + values[0] / 18) * (10 + values[1] / 8);
    const trend = 92 - index * (2 + values[2] / 40);
    return [x, clamp(trend + wave, 15, 105)];
  });
  const path = points.map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" ");
  return <svg className="cs-visual" viewBox="0 0 240 125" role="img" aria-label="Interactive model curve"><path className="cs-gridline" d="M10 25H230M10 55H230M10 85H230M10 115H230" /><path d={path} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.filter((_, index) => index % 3 === 0).map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3.2" fill={accent} />)}</svg>;
}

function GridVisual({ values, accent }) {
  return <div className="cs-cell-grid" role="img" aria-label="Interactive decision grid">{Array.from({ length: 64 }, (_, index) => { const row = Math.floor(index / 8); const column = index % 8; const active = ((row * values[0] + column * values[1] + values[2]) % 100) > 42; return <button key={index} aria-label={`Cell ${row + 1}, ${column + 1}: ${active ? "active" : "inactive"}`} style={{ background: active ? accent : "var(--soft)", opacity: active ? .45 + ((index % 5) / 10) : .45 }} />; })}</div>;
}

function TreeVisual({ values, accent }) {
  const depth = clamp(Math.round(values[0] / 20) + 2, 2, 6);
  const nodes = Array.from({ length: Math.min(31, 2 ** depth - 1) }, (_, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const first = 2 ** level - 1;
    const position = index - first;
    return { index, x: ((position + 1) / (2 ** level + 1)) * 220 + 10, y: 14 + level * 24 };
  });
  return <svg className="cs-visual" viewBox="0 0 240 132" role="img" aria-label="Interactive decision tree">{nodes.slice(1).map((node) => { const parent = nodes[Math.floor((node.index - 1) / 2)]; return <line key={`edge-${node.index}`} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y} stroke="var(--line)" strokeWidth="1.2" />; })}{nodes.map((node) => <g key={node.index}><circle cx={node.x} cy={node.y} r={node.index ? 5 : 7} fill={node.index % 3 === 0 ? accent : "var(--panel)"} stroke={accent} strokeWidth="1.5" /><text x={node.x} y={node.y + 2} textAnchor="middle" fontSize="5" fill="var(--ink)">{node.index + 1}</text></g>)}</svg>;
}

function NeighborsVisual({ values, accent }) {
  const radius = 12 + values[0] / 3;
  return <svg className="cs-visual" viewBox="0 0 240 130" role="img" aria-label="Interactive neighborhood map"><circle cx="120" cy="64" r={radius} fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" />{Array.from({ length: 28 }, (_, index) => { const x = 16 + ((index * 47 + values[1]) % 208); const y = 12 + ((index * 31 + values[2]) % 105); const group = (index + Math.round(values[0])) % 3; return <circle key={index} cx={x} cy={y} r={index % 5 === 0 ? 4.5 : 3} fill={group === 0 ? accent : group === 1 ? "var(--accent-2)" : "var(--soft)"} stroke="var(--panel)" strokeWidth="1" />; })}<circle cx="120" cy="64" r="6" fill="var(--ink)" stroke={accent} strokeWidth="2" /></svg>;
}

function MatrixVisual({ values, accent }) {
  return <div className="cs-matrix" role="img" aria-label="Interactive matrix heatmap">{Array.from({ length: 49 }, (_, index) => { const row = Math.floor(index / 7); const column = index % 7; const intensity = ((row + 1) * values[0] + (column + 2) * values[1] + values[2]) % 100; return <button key={index} aria-label={`Row ${row + 1}, column ${column + 1}: ${Math.round(intensity)}`} style={{ background: `color-mix(in srgb, ${accent} ${Math.round(intensity)}%, var(--panel))` }}><span>{Math.round(intensity)}</span></button>; })}</div>;
}

function TimelineVisual({ values, accent }) {
  return <div className="cs-timeline" role="img" aria-label="Interactive training timeline">{Array.from({ length: 14 }, (_, index) => { const height = 18 + ((index * values[0] + values[1] * 2 + values[2]) % 82); return <div key={index}><i style={{ height: `${height}%`, background: index % 4 === 0 ? "var(--accent-2)" : accent }} /><span>{index + 1}</span></div>; })}</div>;
}

function DistributionVisual({ values, accent }) {
  const bars = Array.from({ length: 21 }, (_, index) => { const center = 10 + (values[0] - 50) / 18; const spread = 2.2 + values[1] / 24; return Math.exp(-((index - center) ** 2) / (2 * spread ** 2)) * (55 + values[2] / 2); });
  return <div className="cs-distribution" role="img" aria-label="Interactive probability distribution">{bars.map((height, index) => <div key={index}><i style={{ height: `${height}%`, background: index >= 14 ? "var(--accent-2)" : accent }} /><span>{index - 10}</span></div>)}</div>;
}

function ImageVisual({ values, accent }) {
  return <div className="cs-image-grid" role="img" aria-label="Interactive image feature map">{Array.from({ length: 100 }, (_, index) => { const row = Math.floor(index / 10); const column = index % 10; const edge = Math.abs(row - column) < 2 || Math.abs(row + column - 9) < 2; const intensity = edge ? clamp(values[0] + (index % 4) * 8, 20, 100) : (values[1] + row * column + values[2]) % 58; return <i key={index} style={{ background: `color-mix(in srgb, ${accent} ${Math.round(intensity)}%, var(--panel))` }} />; })}</div>;
}

function NetworkVisual({ values, accent }) {
  const layers = [4, clamp(Math.round(values[0] / 15), 3, 7), clamp(Math.round(values[1] / 16), 3, 6), 3];
  const nodes = layers.flatMap((count, layer) => Array.from({ length: count }, (_, index) => ({ id: `${layer}-${index}`, layer, index, x: 28 + layer * 61, y: 18 + ((index + 1) / (count + 1)) * 92 })));
  return <svg className="cs-visual" viewBox="0 0 240 130" role="img" aria-label="Interactive neural network">{nodes.filter(node => node.layer > 0).flatMap(node => nodes.filter(source => source.layer === node.layer - 1).map(source => <line key={`${source.id}-${node.id}`} x1={source.x} y1={source.y} x2={node.x} y2={node.y} stroke="var(--line)" strokeWidth=".45" opacity=".65" />))}{nodes.map(node => <circle key={node.id} cx={node.x} cy={node.y} r={node.layer === 0 ? 4 : 5} fill={node.index % 2 ? accent : "var(--accent-2)"} stroke="var(--panel)" strokeWidth="1" />)}</svg>;
}

const VISUALS = { curve: CurveVisual, grid: GridVisual, tree: TreeVisual, neighbors: NeighborsVisual, matrix: MatrixVisual, timeline: TimelineVisual, distribution: DistributionVisual, image: ImageVisual, network: NetworkVisual };

function Metric({ label, value, detail, accent }) {
  return <article className="cs-metric" style={{ borderTopColor: accent }}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

export default function ConceptSimulator({ config, cases }) {
  const [caseId, setCaseId] = useState(cases[0]?.id);
  const [values, setValues] = useState(() => config.controls.map(control => control.default));
  const [run, setRun] = useState(1);
  const [compare, setCompare] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [checkpointAnswer, setCheckpointAnswer] = useState(null);
  const [completed, setCompleted] = useState(() => new Set());
  const timerRef = useRef(null);
  const item = cases.find(entry => entry.id === caseId) || cases[0];
  const Visual = VISUALS[config.mode] || CurveVisual;
  const baselineValues = useMemo(() => config.controls.map(control => control.default), [config.controls]);
  const score = useMemo(() => {
    const balance = 100 - Math.abs(values[0] - values[1]) * .42;
    const pressure = config.mode === "distribution" ? values[1] : config.mode === "tree" ? values[0] : values[2];
    const caseFactor = ((item.seed || 7) % 17) - 8;
    return clamp(balance * .58 + (100 - pressure) * .24 + values[1] * .18 + caseFactor, 24, 98);
  }, [values, item, config.mode, run]);
  const secondary = clamp(100 - Math.abs(values[0] - values[1]) * .55 - values[2] * .08 + (compare ? 2 : 0), 18, 97);
  const cost = Math.round(12 + values.reduce((sum, value) => sum + value, 0) * (config.costScale || .8));
  const confidence = clamp((score + secondary) / 2 - item.difficulty * 2, 20, 96);
  const updateValue = (index, value) => setValues(current => current.map((entry, entryIndex) => entryIndex === index ? value : entry));
  const reset = () => { setValues(config.controls.map(control => control.default)); setCompare(false); setRun(current => current + 1); };
  const metricValues = [pct(score), pct(secondary), cost.toLocaleString(), pct(confidence)];
  const baselineScore = useMemo(() => {
    const balance = 100 - Math.abs(baselineValues[0] - baselineValues[1]) * .42;
    const pressure = config.mode === "distribution" ? baselineValues[1] : config.mode === "tree" ? baselineValues[0] : baselineValues[2];
    return clamp(balance * .58 + (100 - pressure) * .24 + baselineValues[1] * .18 + (((item.seed || 7) % 17) - 8), 24, 98);
  }, [baselineValues, config.mode, item]);
  const scoreDelta = Math.round(score - baselineScore);
  const missionItems = [
    { id: "tune", label: "Change an experiment control", done: completed.has("tune") },
    { id: "run", label: "Run the simulation", done: completed.has("run") },
    { id: "compare", label: "Compare against the baseline", done: completed.has("compare") },
    { id: "check", label: "Pass the concept checkpoint", done: completed.has("check") },
  ];
  const mastery = Math.round(missionItems.filter(step => step.done).length / missionItems.length * 100);
  const storageKey = `genai-lab-mastery:${config.title}`;
  const markComplete = (id) => setCompleted(current => new Set([...current, id]));
  const runExperiment = () => {
    if (isRunning) { clearInterval(timerRef.current); setIsRunning(false); return; }
    setIsRunning(true);
    setRun(value => value + 1);
    markComplete("run");
    let frame = 0;
    const origin = [...values];
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      frame += 1;
      setValues(origin.map((value, index) => clamp(value + Math.sin(frame * .7 + index * 1.8) * (5 + index * 2), config.controls[index].min, config.controls[index].max)));
      if (frame >= 8) { clearInterval(timerRef.current); setIsRunning(false); }
    }, 110);
  };
  const selectCheckpoint = (index) => {
    setCheckpointAnswer(index);
    if (index === selectedInsight) markComplete("check");
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setCompleted(new Set(Array.isArray(saved) ? saved : []));
    } catch { setCompleted(new Set()); }
    setCheckpointAnswer(null);
    return () => clearInterval(timerRef.current);
  }, [storageKey]);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch { /* storage can be disabled in embedded labs */ }
  }, [completed, storageKey]);

  return <main className={`concept-simulator cs-variant-${config.variant || 0} ${config.dark ? "is-dark" : ""}`} style={{ "--primary": config.palette.primary, "--accent-2": config.palette.secondary, "--background": config.palette.background, "--panel": config.palette.panel, "--ink": config.palette.ink, "--muted": config.palette.muted, "--line": config.palette.line, "--soft": config.palette.soft }}>
    <a className="cs-skip" href="#cs-workbench">Skip to simulation</a>
    <header className="cs-header"><div><span className="cs-kicker"><Icon name="lab" size={15} /> {config.kicker}</span><h1>{config.title}</h1><p>{config.description}</p></div><div className="cs-run"><span>simulation {String(run).padStart(2, "0")} · mastery {mastery}%</span><button onClick={runExperiment} aria-pressed={isRunning}><Icon name={isRunning ? "pause" : "run"} size={15} /> {isRunning ? "Pause experiment" : "Run experiment"}</button></div></header>
    <section className="cs-casebar"><label><span>Challenge case</span><select value={caseId} onChange={event => setCaseId(event.target.value)}>{cases.map(entry => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label><div><span>Scenario</span><strong>{item.scenario}</strong></div><div><span>Failure to inspect</span><p>{item.failure}</p></div></section>
    <div className="cs-layout" id="cs-workbench">
      <aside className="cs-controls"><header><Icon name="tune" /><div><span>Experiment controls</span><strong>{config.controlTitle}</strong></div></header>{config.controls.map((control, index) => <label key={control.label}><span><b>{control.label}</b><output>{Math.round(values[index] * 10) / 10}{control.unit || ""}</output></span><input aria-label={control.label} type="range" min={control.min} max={control.max} step={control.step || 1} value={values[index]} onChange={event => { updateValue(index, Number(event.target.value)); markComplete("tune"); }} /><small>{control.help}</small></label>)}<button className={`cs-compare ${compare ? "is-on" : ""}`} onClick={() => { setCompare(value => !value); markComplete("compare"); }} aria-pressed={compare}><span><strong>Compare baseline</strong><small>Measure the decision against defaults</small></span><i>{compare ? "ON" : "OFF"}</i></button><button className="cs-reset" onClick={reset}><Icon name="reset" size={14} /> Reset controls</button></aside>
      <section className="cs-workspace"><header><div><span>{config.visualTitle}</span><strong>{item.subtitle}</strong></div><span className={`cs-live ${isRunning ? "is-running" : ""}`}>{isRunning ? "sampling…" : "computed locally"}</span></header><div className={`cs-canvas cs-mode-${config.mode} ${isRunning ? "is-running" : ""}`}><Visual values={values} accent={config.palette.primary} />{compare && <div className="cs-baseline" aria-label={`Baseline score ${Math.round(baselineScore)} percent`}><span>Baseline {Math.round(baselineScore)}%</span><strong className={scoreDelta >= 0 ? "up" : "down"}>{scoreDelta >= 0 ? "+" : ""}{scoreDelta} pts</strong></div>}<div className="cs-formula"><span>Model relationship</span><code>{config.formula}</code></div></div><div className="cs-metrics">{config.metrics.map((metric, index) => <Metric key={metric.label} label={metric.label} value={metricValues[index]} detail={metric.detail} accent={index === 1 ? config.palette.secondary : config.palette.primary} />)}</div></section>
      <aside className="cs-inspector"><span className="cs-kicker">Experiment reading</span><h2>{item.title}</h2><p>{item.explanation}</p><dl><div><dt>Difficulty</dt><dd>{item.difficulty}/5</dd></div><div><dt>Data regime</dt><dd>{item.regime}</dd></div><div><dt>Primary score</dt><dd>{pct(score)}</dd></div><div><dt>Confidence</dt><dd>{pct(confidence)}</dd></div></dl><div className={`cs-verdict ${score >= 72 ? "good" : "warn"}`}><Icon name={score >= 72 ? "check" : "alert"} /><span>{score >= 72 ? config.success : config.warning}</span></div><section className="cs-mission" aria-labelledby="mission-title"><header><Icon name="target" /><div><span>Guided mission</span><strong id="mission-title">{mastery}% mastered</strong></div></header><div className="cs-mastery"><i style={{ width: `${mastery}%` }} /></div>{missionItems.map(step => <p key={step.id} className={step.done ? "done" : ""}><Icon name={step.done ? "check" : "target"} size={13} /> {step.label}</p>)}</section></aside>
    </div>
    <section className="cs-insights"><header><Icon name="book" /><div><span>Concept notebook</span><strong>Study, predict, then prove it in the simulator</strong></div></header><div>{config.principles.map((principle, index) => <button key={principle.title} className={selectedInsight === index ? "is-active" : ""} onClick={() => { setSelectedInsight(index); setCheckpointAnswer(null); }}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{principle.title}</strong><p>{principle.body}</p></div></button>)}</div><footer><Icon name="inspect" /><p><b>Current lesson:</b> {item.lesson}</p></footer><div className="cs-checkpoint"><div><span>Knowledge checkpoint</span><strong>Which principle best explains the selected lesson?</strong></div><div>{config.principles.map((principle, index) => <button key={principle.title} onClick={() => selectCheckpoint(index)} className={checkpointAnswer === index ? (index === selectedInsight ? "correct" : "wrong") : ""}>{principle.title}</button>)}</div>{checkpointAnswer !== null && <p role="status">{checkpointAnswer === selectedInsight ? "Correct — now change a control and see the principle in motion." : `Look again at principle ${selectedInsight + 1}, then retry.`}</p>}</div></section>
    <style>{`
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--background); }
      button, input, select { font: inherit; }
      button, input[type="range"], select { cursor: pointer; }
      .concept-simulator { min-height: 100vh; padding: 30px clamp(14px,4vw,58px) 48px; color: var(--ink); background: radial-gradient(circle at 90% 0%, color-mix(in srgb,var(--primary) 13%,transparent), transparent 28%), var(--background); font-family: Inter,ui-sans-serif,system-ui,sans-serif; }
      .cs-skip { position: fixed; left: 12px; top: -60px; z-index: 20; padding: 10px 14px; color: var(--panel); background: var(--ink); }
      .cs-skip:focus { top: 12px; }
      .cs-header { max-width: 1460px; margin: 0 auto 18px; display: flex; justify-content: space-between; align-items: end; gap: 24px; }
      .cs-kicker { display: inline-flex; align-items: center; gap: 7px; color: var(--primary); font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
      .cs-header h1 { margin: 8px 0 6px; max-width: 950px; font-size: clamp(36px,5.2vw,72px); line-height: .93; letter-spacing: -.055em; }
      .cs-header p { max-width: 760px; margin: 0; color: var(--muted); font-size: 14px; }
      .cs-run { min-width: 180px; display: grid; justify-items: end; gap: 7px; }
      .cs-run > span { color: var(--muted); font: 800 8px ui-monospace,monospace; text-transform: uppercase; }
      .cs-run button { min-height: 44px; padding: 10px 14px; border: 0; border-radius: var(--radius,8px); color: var(--panel); background: var(--ink); display: inline-flex; align-items: center; gap: 7px; font-weight: 800; transition: transform .2s ease,box-shadow .2s ease; }
      .cs-run button:hover { transform: translateY(-2px); box-shadow: 0 10px 24px color-mix(in srgb,var(--primary) 24%,transparent); }
      .cs-run button[aria-pressed="true"] { color: var(--ink); background: var(--primary); }
      .cs-casebar { max-width: 1460px; margin: 0 auto 10px; display: grid; grid-template-columns: minmax(220px,.75fr) 1fr 1fr; border: 1px solid var(--line); border-top: 4px solid var(--primary); background: var(--panel); }
      .cs-casebar > * { min-width: 0; padding: 12px 14px; }
      .cs-casebar > * + * { border-left: 1px solid var(--line); }
      .cs-casebar span { display: block; margin-bottom: 5px; color: var(--primary); font-size: 8px; font-weight: 800; text-transform: uppercase; }
      .cs-casebar select { width: 100%; min-height: 42px; padding: 8px; color: var(--ink); border: 1px solid var(--line); border-radius: var(--radius,6px); background: var(--background); }
      .cs-casebar strong { display: block; font-size: 11px; line-height: 1.45; }
      .cs-casebar p { margin: 0; color: var(--muted); font-size: 9px; line-height: 1.5; }
      .cs-layout { max-width: 1460px; margin: 0 auto 10px; display: grid; grid-template-columns: 260px minmax(0,1fr) 250px; gap: 10px; align-items: start; }
      .cs-controls,.cs-workspace,.cs-inspector,.cs-insights { min-width: 0; border: 1px solid var(--line); border-radius: var(--radius,8px); background: color-mix(in srgb,var(--panel) 96%,transparent); }
      .cs-controls > header,.cs-workspace > header,.cs-insights > header { min-height: 57px; padding: 11px 13px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 9px; }
      .cs-controls header svg { color: var(--primary); }
      .cs-controls header span,.cs-controls header strong,.cs-workspace header span,.cs-workspace header strong,.cs-insights header span,.cs-insights header strong { display: block; }
      .cs-controls header span,.cs-workspace header span,.cs-insights header span { color: var(--muted); font-size: 8px; text-transform: uppercase; }
      .cs-controls header strong,.cs-workspace header strong,.cs-insights header strong { margin-top: 3px; font-size: 10px; }
      .cs-controls > label { display: block; padding: 14px 13px; border-bottom: 1px solid var(--line); }
      .cs-controls label > span { display: flex; justify-content: space-between; gap: 8px; font-size: 8px; }
      .cs-controls output { color: var(--primary); font-weight: 800; }
      .cs-controls input { width: 100%; margin: 12px 0 6px; accent-color: var(--primary); }
      .cs-controls label small { display: block; color: var(--muted); font-size: 8px; line-height: 1.45; }
      .cs-compare { width: calc(100% - 24px); min-height: 54px; margin: 12px; padding: 9px; border: 1px solid var(--line); border-radius: var(--radius,6px); color: var(--muted); background: var(--background); display: flex; justify-content: space-between; text-align: left; }
      .cs-compare.is-on { color: var(--ink); border-color: var(--primary); background: var(--soft); }
      .cs-compare strong,.cs-compare small { display: block; }
      .cs-compare strong { font-size: 9px; }
      .cs-compare small { margin-top: 3px; font-size: 7px; }
      .cs-compare i { align-self: center; color: var(--primary); font-size: 7px; font-style: normal; }
      .cs-reset { width: calc(100% - 24px); min-height: 40px; margin: 0 12px 12px; border: 1px solid var(--primary); border-radius: var(--radius,6px); color: var(--primary); background: transparent; display:flex;align-items:center;justify-content:center;gap:6px;font-size: 8px; font-weight: 800; }
      .cs-workspace > header { justify-content: space-between; }
      .cs-live { color: var(--primary) !important; font-weight: 800; }
      .cs-live::before { content:"";display:inline-block;width:6px;height:6px;margin-right:6px;border-radius:50%;background:currentColor;box-shadow:0 0 0 4px color-mix(in srgb,currentColor 12%,transparent); }
      .cs-live.is-running::before { animation:csPulse .75s ease-in-out infinite alternate; }
      .cs-canvas { min-height: 390px; padding: 18px; position: relative; display: grid; place-items: center; overflow:hidden;background: linear-gradient(var(--soft) 1px,transparent 1px),linear-gradient(90deg,var(--soft) 1px,transparent 1px),var(--background); background-size: 27px 27px; }
      .cs-canvas::before { content:"";position:absolute;inset:-40%;pointer-events:none;opacity:.16;background:conic-gradient(from 90deg,transparent,var(--primary),transparent 35%);transform:translateX(-55%) rotate(0);transition:transform .6s ease; }
      .cs-canvas.is-running::before { animation:csSweep 1.1s linear infinite; }
      .cs-canvas.is-running .cs-visual,.cs-canvas.is-running .cs-cell-grid,.cs-canvas.is-running .cs-matrix,.cs-canvas.is-running .cs-image-grid,.cs-canvas.is-running .cs-timeline,.cs-canvas.is-running .cs-distribution { animation:csBreathe .55s ease-in-out infinite alternate; }
      .cs-mode-tree { background-size:40px 40px;background-image:radial-gradient(var(--soft) 1.5px,transparent 1.5px); }
      .cs-mode-network { background:radial-gradient(circle at center,color-mix(in srgb,var(--primary) 13%,var(--background)),var(--background) 64%); }
      .cs-mode-image { background:linear-gradient(135deg,var(--background),var(--soft)); }
      .cs-mode-distribution,.cs-mode-timeline { background-image:linear-gradient(180deg,transparent 93%,var(--line) 93%);background-size:100% 28px; }
      .cs-visual { width: 100%; max-width: 680px; height: 320px; }
      .cs-gridline { fill: none; stroke: var(--line); stroke-width: .6; }
      .cs-formula { position: absolute; left: 14px; bottom: 13px; padding: 9px 11px; border-left: 3px solid var(--primary); color: var(--ink); background: color-mix(in srgb,var(--panel) 90%,transparent); box-shadow: 0 5px 15px color-mix(in srgb,var(--ink) 9%,transparent); }
      .cs-formula span,.cs-formula code { display: block; }
      .cs-formula span { color: var(--muted); font-size: 7px; text-transform: uppercase; }
      .cs-formula code { margin-top: 4px; font-size: 8px; }
      .cs-baseline { position:absolute;right:14px;top:14px;display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--line);border-radius:999px;background:color-mix(in srgb,var(--panel) 92%,transparent);box-shadow:0 6px 18px color-mix(in srgb,var(--ink) 8%,transparent);font-size:8px; }
      .cs-baseline strong.up { color:#14805e; }.cs-baseline strong.down { color:#c73d4d; }
      .cs-cell-grid,.cs-matrix,.cs-image-grid { width: min(100%,460px); aspect-ratio: 1; display: grid; gap: 4px; }
      .cs-cell-grid { grid-template-columns: repeat(8,1fr); }
      .cs-cell-grid button,.cs-matrix button { min-width: 0; border: 1px solid var(--line); border-radius: calc(var(--radius,6px)/2); }
      .cs-matrix { grid-template-columns: repeat(7,1fr); }
      .cs-matrix button { display: grid; place-items: center; color: var(--ink); }
      .cs-matrix button span { font: 700 7px ui-monospace,monospace; }
      .cs-image-grid { grid-template-columns: repeat(10,1fr); gap: 2px; background: var(--line); padding: 2px; }
      .cs-image-grid i { min-width: 0; }
      .cs-timeline,.cs-distribution { width: min(100%,650px); height: 300px; padding: 12px 8px 20px; display: flex; align-items: end; gap: 5px; border-left: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .cs-timeline > div,.cs-distribution > div { height: 100%; flex: 1; display: flex; flex-direction: column; justify-content: end; align-items: center; }
      .cs-timeline i,.cs-distribution i { width: 70%; min-height: 3px; display: block; border-radius: 3px 3px 0 0; }
      .cs-timeline span,.cs-distribution span { margin-top: 5px; color: var(--muted); font-size: 6px; }
      .cs-metrics { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--line); }
      .cs-metric { min-width: 0; padding: 11px; border-top: 3px solid; }
      .cs-metric + .cs-metric { border-left: 1px solid var(--line); }
      .cs-metric span,.cs-metric strong,.cs-metric small { display: block; }
      .cs-metric span { color: var(--muted); font-size: 7px; text-transform: uppercase; }
      .cs-metric strong { margin: 5px 0 2px; color: var(--primary); font-size: 20px; }
      .cs-metric small { color: var(--muted); font-size: 7px; }
      .cs-inspector { padding: 15px; }
      .cs-inspector h2 { margin: 9px 0 7px; font-family: Georgia,serif; font-size: 24px; font-weight: 500; }
      .cs-inspector > p { color: var(--muted); font-size: 9px; line-height: 1.55; }
      .cs-inspector dl { margin: 16px 0; }
      .cs-inspector dl div { padding: 8px 0; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 8px; }
      .cs-inspector dt { color: var(--muted); font-size: 8px; }
      .cs-inspector dd { margin: 0; font: 800 8px ui-monospace,monospace; text-align: right; }
      .cs-verdict { padding: 10px; display: flex; align-items: start; gap: 7px; border-radius: var(--radius,6px); font-size: 8px; line-height: 1.45; }
      .cs-verdict.good { color: #176747; background: #e6f5ee; }
      .cs-verdict.warn { color: #914626; background: #fff0e5; }
      .cs-verdict svg { flex: none; }
      .cs-mission { margin-top:14px;padding-top:13px;border-top:1px solid var(--line); }
      .cs-mission header { display:flex;align-items:center;gap:8px;color:var(--primary); }
      .cs-mission header span,.cs-mission header strong { display:block; }.cs-mission header span { color:var(--muted);font-size:7px;text-transform:uppercase; }.cs-mission header strong { margin-top:2px;font-size:10px; }
      .cs-mastery { height:5px;margin:10px 0;background:var(--soft);overflow:hidden;border-radius:99px; }.cs-mastery i { display:block;height:100%;background:var(--primary);transition:width .35s ease; }
      .cs-mission p { margin:7px 0;display:flex;gap:6px;align-items:center;color:var(--muted);font-size:8px; }.cs-mission p.done { color:#14805e;text-decoration:line-through;text-decoration-color:color-mix(in srgb,#14805e 35%,transparent); }
      .cs-insights { max-width: 1460px; margin: 0 auto; }
      .cs-insights > div { display: grid; grid-template-columns: repeat(3,1fr); }
      .cs-insights > div button { min-height: 100px; padding: 12px; border: 0; border-right: 1px solid var(--line); background: transparent; color: var(--ink); display: flex; gap: 9px; text-align: left; }
      .cs-insights > div button.is-active { background: var(--soft); box-shadow: inset 0 3px var(--primary); }
      .cs-insights button > span { color: var(--primary); font: 800 9px ui-monospace,monospace; }
      .cs-insights button strong { font-size: 9px; text-transform: uppercase; }
      .cs-insights button p { margin: 5px 0 0; color: var(--muted); font-size: 8px; line-height: 1.5; }
      .cs-insights footer { padding: 11px 13px; border-top: 1px solid var(--line); display: flex; align-items: center; gap: 8px; color: var(--primary); }
      .cs-insights footer p { margin: 0; color: var(--muted); font-size: 8px; }
      .cs-checkpoint { padding:14px;border-top:1px solid var(--line);display:grid;grid-template-columns:minmax(180px,.8fr) minmax(300px,1.5fr);gap:12px;align-items:center; }
      .cs-checkpoint > div:first-child span,.cs-checkpoint > div:first-child strong { display:block; }.cs-checkpoint > div:first-child span { color:var(--primary);font-size:8px;font-weight:800;text-transform:uppercase; }.cs-checkpoint > div:first-child strong { margin-top:4px;font-size:10px; }
      .cs-checkpoint > div:nth-child(2) { display:flex;gap:7px;flex-wrap:wrap; }.cs-checkpoint button { min-height:38px;padding:7px 10px;border:1px solid var(--line);border-radius:var(--radius,6px);color:var(--ink);background:var(--background);font-size:8px;font-weight:750; }.cs-checkpoint button:hover { border-color:var(--primary);transform:translateY(-1px); }.cs-checkpoint button.correct { color:#176747;border-color:#77bda1;background:#e6f5ee; }.cs-checkpoint button.wrong { color:#914626;border-color:#e6a37d;background:#fff0e5; }.cs-checkpoint > p { grid-column:1/-1;margin:0;color:var(--primary);font-size:8px;font-weight:700; }
      .cs-variant-1 { --radius: 0px; }
      .cs-variant-1 .cs-header h1 { font-family: "Arial Black",Impact,sans-serif; text-transform: uppercase; }
      .cs-variant-2 .cs-header h1 { font-family: Georgia,serif; font-weight: 500; }
      .cs-variant-2 .cs-layout { grid-template-columns: 290px minmax(0,1fr) 220px; }
      .cs-variant-3 .cs-layout { grid-template-columns: 230px minmax(0,1.2fr) 290px; }
      .cs-variant-3 .cs-canvas { min-height: 430px; }
      .cs-variant-4 .cs-header { align-items: center; }
      .cs-variant-4 .cs-casebar { border-radius: 14px; overflow: hidden; }
      .cs-variant-5 { --radius: 14px; }
      .cs-variant-1 .cs-canvas { box-shadow:inset 8px 8px 0 color-mix(in srgb,var(--primary) 12%,transparent); }
      .cs-variant-2 .cs-insights { border-radius:22px;overflow:hidden; }.cs-variant-2 .cs-workspace { box-shadow:0 18px 50px color-mix(in srgb,var(--primary) 10%,transparent); }
      .cs-variant-3 .cs-casebar { transform:skewX(-1deg); }.cs-variant-3 .cs-controls { border-top:5px solid var(--accent-2); }
      .cs-variant-4 .cs-metric:nth-child(even) { background:var(--soft); }.cs-variant-4 .cs-formula { border-left:0;border-bottom:3px solid var(--primary); }
      .cs-variant-5 .cs-canvas { border-radius:18px;margin:10px;min-height:370px; }.cs-variant-5 .cs-workspace { overflow:hidden; }
      .is-dark { color-scheme: dark; }
      @keyframes csPulse { to { transform:scale(1.45);opacity:.55; } }
      @keyframes csSweep { to { transform:translateX(55%) rotate(180deg); } }
      @keyframes csBreathe { to { transform:scale(1.012);filter:saturate(1.18); } }
      button:focus-visible,select:focus-visible,input:focus-visible,a:focus-visible { outline: 3px solid var(--accent-2); outline-offset: 3px; }
      @media (max-width:1050px) { .cs-layout,.cs-variant-2 .cs-layout,.cs-variant-3 .cs-layout { grid-template-columns: 250px 1fr; } .cs-inspector { grid-column: 1/-1; } }
      @media (max-width:700px) { .concept-simulator { padding: 22px 10px 35px; } .cs-header { align-items: start; flex-direction: column; } .cs-run { width: 100%; justify-items: stretch; } .cs-run button { justify-content: center; } .cs-casebar,.cs-layout,.cs-variant-2 .cs-layout,.cs-variant-3 .cs-layout,.cs-insights > div,.cs-checkpoint { grid-template-columns: 1fr; } .cs-casebar > * + * { border-left: 0; border-top: 1px solid var(--line); } .cs-inspector { grid-column: auto; } .cs-canvas { min-height: 330px; padding: 10px; } .cs-visual { height: 270px; } .cs-metrics { grid-template-columns: 1fr 1fr; } .cs-metric:nth-child(3) { border-left: 0; } .cs-insights > div button { border-right: 0; border-bottom: 1px solid var(--line); } }
      @media (prefers-reduced-motion:reduce) { *,*::before,*::after { transition-duration:.01ms!important; animation-duration:.01ms!important; scroll-behavior:auto!important; } }
    `}</style>
  </main>;
}
