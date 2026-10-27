import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge, Controls, FigureFrame, GridY, PlayControls, Segmented, Slider, Stat, Toggle,
  KIND_COLOR, areaPath, fmt, linePath, scale, usePlayback, useSweep,
} from "../kit";

/* Quality widgets: drift, evaluation metrics, fairness, alarms and traces. */

/* ── drift monitor ─────────────────────────────────────────────────────── */

function erf(x) {
  const sign = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return sign * y;
}
const normalCdf = (x, mean, sd) => 0.5 * (1 + erf((x - mean) / (sd * Math.SQRT2)));
const BINS = Array.from({ length: 20 }, (_, i) => [i * 30, (i + 1) * 30]);
const binned = (mean, sd) => BINS.map(([lo, hi]) => Math.max(1e-4, normalCdf(hi, mean, sd) - normalCdf(lo, mean, sd)));
const psi = (base, live) => base.reduce((sum, b, i) => sum + (live[i] - b) * Math.log(live[i] / b), 0);
const BASE = binned(220, 60);

export function DriftMonitor() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [speed, setSpeed] = useState(12);
  const [t, setT] = useSweep(playback, 7000, { hold: 2600 });
  useEffect(() => { setT(0); }, [speed, setT]);
  const weeks = 12;
  const week = t * weeks;
  const liveAt = (w) => binned(220 + speed * w, 60 + w * 1.5);
  const live = liveAt(week);
  const score = psi(BASE, live);
  const history = Array.from({ length: Math.floor(week * 4) + 1 }, (_, i) => [i / 4, psi(BASE, liveAt(i / 4))]);
  const alarmWeek = Array.from({ length: weeks * 4 + 1 }, (_, i) => i / 4).find((w) => psi(BASE, liveAt(w)) > 0.2);

  const W = 700;
  const H = 170;
  const bx = scale(0, 600, 30, 410);
  const by = scale(0, 0.22, H - 22, 12);
  const px = scale(0, weeks, 450, W - 14);
  const py = scale(0, 1, H - 22, 12);
  const bars = (dist) => BINS.map(([lo], i) => [bx(lo + 15), by(Math.min(0.22, dist[i]))]);

  return (
    <FigureFrame
      kind="Simulation"
      title="Drift: live inputs slowly stop looking like the baseline"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={`Prompt length drifts by ${speed} tokens a week. The population stability index (PSI) crosses 0.2 ${alarmWeek !== undefined ? `in week ${fmt(alarmWeek, 1)}` : "after this window"}, so the scheduled check raises a violation and an alarm. Model Monitor is closed to new customers; the same check runs with open-source tools plus CloudWatch.`}
    >
      <Controls>
        <Slider label="Drift per week" value={speed} min={0} max={30} onChange={setSpeed} format={(v) => `+${v} tokens`} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <path d={areaPath(bars(live), by(0))} className="aipf-area" style={{ fill: `color-mix(in srgb, ${score > 0.2 ? "var(--aipf-bad)" : KIND_COLOR.ai} 28%, transparent)` }} />
        <path d={linePath(bars(live))} className="aipf-line is-on" style={{ stroke: score > 0.2 ? "var(--aipf-bad)" : KIND_COLOR.ai }} />
        <path d={linePath(bars(BASE))} className="aipf-line is-on" style={{ stroke: "var(--aipf-ink-3)", strokeDasharray: "4 4" }} />
        <text x="34" y="20" className="aipf-small">prompt length distribution · dashed = baseline</text>
        {[0, 300, 600].map((v) => <text key={v} x={bx(v)} y={H - 6} textAnchor="middle" className="aipf-small">{v}</text>)}
        <line x1={px(0)} x2={px(weeks)} y1={py(0.2)} y2={py(0.2)} className="aipf-limit is-bad" />
        <text x={px(weeks)} y={py(0.2) - 5} textAnchor="end" className="aipf-mono aipf-limit-text">PSI 0.2</text>
        <path d={linePath(history.map(([w, v]) => [px(w), py(Math.min(1, v))]))} className="aipf-line is-on" style={{ stroke: KIND_COLOR.monitor }} />
        <text x={px(0)} y={H - 6} className="aipf-small">week 0</text>
        <text x={px(weeks)} y={H - 6} textAnchor="end" className="aipf-small">week {weeks}</text>
      </svg>
      <div className="aipf-stats">
        <Stat label="Week" value={fmt(week, 1)} />
        <Stat label="PSI" value={score.toFixed(3)} tone={score > 0.2 ? "bad" : score > 0.1 ? "warn" : "ok"} />
        <Stat label="Monitor" value={score > 0.2 ? "violation" : "OK"} tone={score > 0.2 ? "bad" : "ok"} />
      </div>
    </FigureFrame>
  );
}

/* ── evaluation metrics ────────────────────────────────────────────────── */

const REFERENCE = "Unused items can be returned within 30 days for a full refund; after 30 days you get store credit.";
const CANDIDATES = {
  paraphrase: { label: "Correct paraphrase", text: "You have a month to send back unused products for your money back, and after that we offer store credit.", semantic: 0.91, judge: 5, why: "Same facts: 30 days for a refund, store credit afterwards." },
  verbatim: { label: "Copies the reference", text: REFERENCE, semantic: 1, judge: 5, why: "Identical to the reference." },
  wrong: { label: "Wrong number", text: "Unused items can be returned within 60 days for a full refund; after 60 days you get store credit.", semantic: 0.96, judge: 1, why: "States 60 days; the policy says 30. A factual error." },
  vague: { label: "Vague", text: "Returns are possible in some cases.", semantic: 0.52, judge: 2, why: "Not wrong, but omits every fact the user needs." },
};
const words = (text) => text.toLowerCase().match(/[a-z0-9]+/g) || [];

function rouge1(candidate, reference) {
  const ref = words(reference);
  const cand = words(candidate);
  const counts = {};
  ref.forEach((word) => { counts[word] = (counts[word] || 0) + 1; });
  let overlap = 0;
  cand.forEach((word) => { if (counts[word]) { overlap += 1; counts[word] -= 1; } });
  const p = overlap / cand.length;
  const r = overlap / ref.length;
  return p + r ? (2 * p * r) / (p + r) : 0;
}

export function EvalScorer() {
  const [pick, setPick] = useState("wrong");
  const rows = Object.entries(CANDIDATES).map(([id, item]) => ({ id, ...item, rouge: rouge1(item.text, REFERENCE) }));
  const current = rows.find((row) => row.id === pick);
  const metrics = [
    { id: "rouge", label: "ROUGE-1 F1 (word overlap)", value: current.rouge },
    { id: "semantic", label: "BERTScore-style (embeddings)", value: current.semantic },
    { id: "judge", label: "LLM-as-a-judge: correctness", value: current.judge / 5, text: `${current.judge}/5` },
  ];

  return (
    <FigureFrame
      kind="Interactive"
      title="Same reference, three scores: which metric notices a wrong fact?"
      caption={pick === "wrong"
        ? "Word overlap scores the wrong answer near-perfectly and even embeddings barely move: both reward looking like the reference. A judge model with a rubric that checks facts gives it 1/5, which is why judge and human evaluations exist (and why judges must be calibrated)."
        : pick === "paraphrase"
          ? "A correct paraphrase shares few exact words, so ROUGE punishes it. Prefer semantic or judge-based scoring for open-ended answers; keep ROUGE for summaries close to a reference."
          : "Each metric measures something different. Bedrock evaluation jobs offer programmatic metrics, judge-model Builtin.* metrics, and human review."}
    >
      <Controls>
        <Segmented label="Candidate answer" value={pick} onChange={setPick} options={rows.map((row) => ({ id: row.id, label: row.label }))} />
      </Controls>
      <div className="aipf-compare">
        <p><Badge tone="ok">reference</Badge> {REFERENCE}</p>
        <p><Badge tone="accent">candidate</Badge> {current.text}</p>
      </div>
      <div className="aipf-meters">
        {metrics.map((metric) => (
          <div key={metric.id} className="aipf-meter">
            <span>{metric.label}</span>
            <div className="aipf-meter-track"><i style={{ width: `${metric.value * 100}%`, background: metric.value > 0.8 ? "var(--aipf-ok)" : metric.value > 0.5 ? "var(--aipf-warn)" : "var(--aipf-bad)" }} /></div>
            <b>{metric.text || metric.value.toFixed(2)}</b>
          </div>
        ))}
      </div>
      <p className="aipf-judge"><Badge tone="muted">judge rationale</Badge> {current.why}</p>
      <div className="aipf-table-wrap">
        <table className="aipf-table">
          <thead><tr><th>Candidate</th><th>ROUGE-1</th><th>Embeddings</th><th>Judge</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={row.id === pick ? "is-on" : ""} onClick={() => setPick(row.id)}>
                <td>{row.label}</td><td>{row.rouge.toFixed(2)}</td><td>{row.semantic.toFixed(2)}</td><td>{row.judge}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FigureFrame>
  );
}

/* ── fairness slices ───────────────────────────────────────────────────── */

const pdf = (x, mean, sd) => Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

export function FairnessSlices() {
  const [threshold, setThreshold] = useState(0.6);
  const [fixed, setFixed] = useState(false);
  const groups = [
    { id: "A", mean: 0.62, sd: 0.12, color: KIND_COLOR.ai },
    { id: "B", mean: fixed ? 0.61 : 0.53, sd: 0.12, color: KIND_COLOR.compute },
  ].map((group) => ({ ...group, rate: 1 - normalCdf(threshold, group.mean, group.sd) }));
  const ratio = groups[1].rate / Math.max(1e-6, groups[0].rate);
  const flips = Math.abs(groups[0].rate - groups[1].rate);

  const W = 700;
  const H = 180;
  const x = scale(0.1, 1, 30, 470);
  const y = scale(0, 3.5, H - 24, 12);
  const curve = (group) => Array.from({ length: 60 }, (_, i) => {
    const v = 0.1 + (0.9 * i) / 59;
    return [x(v), y(pdf(v, group.mean, group.sd))];
  });

  return (
    <FigureFrame
      kind="Interactive"
      title="Fairness by slice: does one group get referred less often?"
      caption={ratio < 0.8
        ? `Group B is referred at ${Math.round(ratio * 100)}% of group A's rate, below the common 0.8 rule of thumb, and swapping only the group attribute flips about ${Math.round(flips * 100)}% of decisions. Investigate before release; Bedrock evaluations (stereotyping, judge rubrics) and counterfactual tests produce the evidence.`
        : `The ratio is ${ratio.toFixed(2)}. Passing one metric is not proof of fairness; keep slice metrics and counterfactual tests in the release gate.`}
    >
      <Controls>
        <Slider label="Refer when score ≥" value={threshold} min={0.3} max={0.9} step={0.01} onChange={setThreshold} format={(v) => v.toFixed(2)} />
        <Toggle label="Fix the prompt (remove the biased cue)" checked={fixed} onChange={setFixed} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        {groups.map((group, index) => (
          <g key={group.id}>
            <path d={areaPath(curve(group), y(0))} style={{ fill: `color-mix(in srgb, ${group.color} 20%, transparent)`, transition: "d .4s" }} />
            <path d={linePath(curve(group))} className="aipf-line is-on" style={{ stroke: group.color }} />
            {/* A to the right of its peak, B to the left, so close peaks never stack their labels. */}
            <text
              x={x(group.mean) + (index ? -8 : 8)}
              y={y(pdf(group.mean, group.mean, group.sd)) + 4}
              textAnchor={index ? "end" : "start"}
              className="aipf-small"
              style={{ fill: group.color }}
            >
              group {group.id}
            </text>
          </g>
        ))}
        <line x1={x(threshold)} x2={x(threshold)} y1="10" y2={H - 22} className="aipf-limit is-bad" />
        <text x={x(threshold) + 4} y={H - 28} className="aipf-mono aipf-limit-text">threshold</text>
        {groups.map((group, index) => (
          <g key={`bar-${group.id}`}>
            <text x="500" y={50 + index * 50} className="aipf-small">group {group.id} referred</text>
            <rect x="500" y={58 + index * 50} width="180" height="14" rx="4" className="aipf-track" />
            <rect x="500" y={58 + index * 50} width={180 * group.rate} height="14" rx="4" style={{ fill: group.color, transition: "width .3s" }} />
            <text x="684" y={70 + index * 50} textAnchor="end" className="aipf-mono aipf-small">{Math.round(group.rate * 100)}%</text>
          </g>
        ))}
      </svg>
      <div className="aipf-stats">
        <Stat label="Disparate impact ratio" value={ratio.toFixed(2)} tone={ratio < 0.8 ? "bad" : "ok"} sub="B ÷ A, rule of thumb ≥ 0.8" />
        <Stat label="Counterfactual flips" value={`${Math.round(flips * 100)}%`} tone={flips > 0.05 ? "warn" : "ok"} />
      </div>
    </FigureFrame>
  );
}

/* ── CloudWatch alarm evaluation ───────────────────────────────────────── */

const LATENCY = [820, 860, 790, 900, 880, 3400, 870, 910, 850, 880, 940, 990, 2600, 3100, 3500, 3300, 2900, 2700, 1200, 980, 910, 940, null, null, 880, 860, 900, 870, 850, 890];

function evaluateAlarm(threshold, m, n, missing) {
  let state = "INSUFFICIENT_DATA";
  return LATENCY.map((value, index) => {
    const window = LATENCY.slice(Math.max(0, index - n + 1), index + 1);
    const present = window.filter((v) => v !== null);
    if (window.length < n && present.length < m) return { value, state };
    if (!present.length && missing === "missing") { state = "INSUFFICIENT_DATA"; return { value, state }; }
    if (missing === "ignore" && present.length < window.length) return { value, state };
    const breaching = window.filter((v) => (v === null ? missing === "breaching" : v > threshold)).length;
    state = breaching >= m ? "ALARM" : "OK";
    return { value, state };
  });
}

export function AlarmEval() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [threshold, setThreshold] = useState(2000);
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [missing, setMissing] = useState("missing");
  const evaluated = useMemo(() => evaluateAlarm(threshold, Math.min(m, n), n, missing), [threshold, m, n, missing]);
  const [t, setT] = useSweep(playback, 6500, { hold: 2600 });
  useEffect(() => { setT(0); }, [threshold, m, n, missing, setT]);
  const upto = Math.floor(t * (LATENCY.length - 1));
  const alarms = evaluated.filter((point, index) => point.state === "ALARM" && evaluated[index - 1]?.state !== "ALARM").length;

  const W = 700;
  const H = 200;
  const x = scale(0, LATENCY.length - 1, 50, W - 16);
  const y = scale(0, 4000, H - 52, 10);
  const shown = evaluated.slice(0, upto + 1);
  const segments = [];
  shown.forEach((point, index) => {
    if (point.value === null) return;
    if (index && shown[index - 1].value !== null) segments.push([[x(index - 1), y(shown[index - 1].value)], [x(index), y(point.value)]]);
  });

  return (
    <FigureFrame
      kind="Simulation"
      title="Alarm on M out of N datapoints, and decide what missing data means"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={`${alarms} transition${alarms === 1 ? "" : "s"} to ALARM, so ${alarms} notification${alarms === 1 ? "" : "s"}. ${Math.min(m, n) > 1 ? `Requiring ${Math.min(m, n)} of ${n} breaching minutes ignores the single spike at minute 5 but still catches the real incident.` : "One breaching minute is enough here, so the single spike at minute 5 pages someone."} Missing data is treated as “${missing}”.`}
    >
      <Controls>
        <Slider label="Threshold (p90 latency)" value={threshold} min={1000} max={3600} step={100} onChange={setThreshold} format={(v) => `${fmt(v)} ms`} />
        <Slider label="Datapoints to alarm (M)" value={m} min={1} max={5} onChange={setM} />
        <Slider label="Evaluation periods (N)" value={n} min={1} max={5} onChange={setN} />
        <Segmented label="Missing data" value={missing} onChange={setMissing} options={["missing", "notBreaching", "breaching", "ignore"].map((id) => ({ id, label: id }))} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <GridY x0={50} x1={W - 16} ticks={[0, 2000, 4000]} y={y} format={(v) => `${v / 1000}s`} />
        <line x1="50" x2={W - 16} y1={y(threshold)} y2={y(threshold)} className="aipf-limit is-bad" />
        {segments.map(([a, b], index) => <path key={index} d={linePath([a, b])} className="aipf-line is-on" style={{ stroke: KIND_COLOR.monitor }} />)}
        {shown.map((point, index) => (point.value === null
          ? <circle key={index} cx={x(index)} cy={y(threshold)} r="4" className="aipf-missing" />
          : <circle key={index} cx={x(index)} cy={y(point.value)} r="3.6" style={{ fill: point.value > threshold ? "var(--aipf-bad)" : KIND_COLOR.monitor }} />))}
        {shown.map((point, index) => (
          <rect key={`s${index}`} x={x(index) - (x(1) - x(0)) / 2} y={H - 40} width={x(1) - x(0)} height="16" className={`aipf-alarm-cell is-${point.state.toLowerCase()}`} />
        ))}
        <text x="46" y={H - 28} textAnchor="end" className="aipf-small">state</text>
        <text x="50" y={H - 6} className="aipf-small">0 min</text>
        <text x={W - 16} y={H - 6} textAnchor="end" className="aipf-small">{LATENCY.length} min</text>
      </svg>
      <div className="aipf-legend">
        <span><i className="aipf-alarm-cell is-ok" />OK</span>
        <span><i className="aipf-alarm-cell is-alarm" />ALARM</span>
        <span><i className="aipf-alarm-cell is-insufficient_data" />INSUFFICIENT_DATA</span>
      </div>
      <div className="aipf-stats">
        <Stat label="Notifications" value={alarms} tone={alarms > 1 ? "warn" : alarms ? "ok" : undefined} />
        <Stat label="Minutes in ALARM" value={evaluated.filter((point) => point.state === "ALARM").length} />
      </div>
    </FigureFrame>
  );
}

/* ── trace waterfall ───────────────────────────────────────────────────── */

const TRACES = {
  healthy: {
    label: "Healthy",
    spans: [
      { name: "API Gateway", start: 0, end: 2400, depth: 0 },
      { name: "Lambda handler", start: 40, end: 2380, depth: 1 },
      { name: "Query rewrite · Bedrock", start: 60, end: 420, depth: 2 },
      { name: "KB Retrieve", start: 430, end: 700, depth: 2 },
      { name: "Rerank", start: 700, end: 820, depth: 2 },
      { name: "Converse · Bedrock", start: 830, end: 2300, depth: 2, ttft: 1250 },
      { name: "DynamoDB PutItem", start: 2310, end: 2360, depth: 2 },
    ],
    note: "Most of the time is generation, after the first token at about 1.25 s. Streaming would show text early; a smaller model or fewer output tokens would shorten it.",
  },
  retrieval: {
    label: "Slow retrieval",
    spans: [
      { name: "API Gateway", start: 0, end: 4800, depth: 0 },
      { name: "Lambda handler", start: 40, end: 4780, depth: 1 },
      { name: "Query rewrite · Bedrock", start: 60, end: 420, depth: 2 },
      { name: "KB Retrieve", start: 430, end: 3100, depth: 2, slow: true },
      { name: "Rerank", start: 3100, end: 3220, depth: 2 },
      { name: "Converse · Bedrock", start: 3230, end: 4700, depth: 2, ttft: 3650 },
      { name: "DynamoDB PutItem", start: 4710, end: 4760, depth: 2 },
    ],
    note: "Retrieval dominates: check the vector store (shard sizing, filters, ef_search) before touching the model.",
  },
  throttled: {
    label: "Throttled model",
    spans: [
      { name: "API Gateway", start: 0, end: 3800, depth: 0 },
      { name: "Lambda handler", start: 40, end: 3780, depth: 1 },
      { name: "Query rewrite · Bedrock", start: 60, end: 420, depth: 2 },
      { name: "KB Retrieve", start: 430, end: 700, depth: 2 },
      { name: "Converse attempt 1 · 429", start: 830, end: 900, depth: 2, error: true },
      { name: "Converse attempt 2 · 429", start: 1300, end: 1360, depth: 2, error: true },
      { name: "Converse attempt 3", start: 2160, end: 3650, depth: 2, ttft: 2580 },
    ],
    note: "Two ThrottlingExceptions with backoff gaps between them: the fix is quota, cross-Region inference or less traffic, not a faster model.",
  },
  cold: {
    label: "Lambda cold start",
    spans: [
      { name: "API Gateway", start: 0, end: 3800, depth: 0 },
      { name: "Lambda init", start: 20, end: 1420, depth: 1, slow: true },
      { name: "Lambda handler", start: 1420, end: 3780, depth: 1 },
      { name: "Query rewrite · Bedrock", start: 1440, end: 1800, depth: 2 },
      { name: "KB Retrieve", start: 1810, end: 2080, depth: 2 },
      { name: "Converse · Bedrock", start: 2090, end: 3700, depth: 2, ttft: 2500 },
    ],
    note: "Initialization before the handler: trim dependencies, reuse clients across invocations, or use provisioned concurrency for latency-sensitive paths.",
  },
};

export function TraceWaterfall() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [scenario, setScenario] = useState("throttled");
  const trace = TRACES[scenario];
  const total = trace.spans[0].end;
  const [t, setT] = useSweep(playback, 4000, { hold: 3000 });
  useEffect(() => { setT(0); }, [scenario, setT]);
  const now = t * total;
  const slowest = trace.spans.slice(2).reduce((best, span) => (span.end - span.start > best.end - best.start ? span : best), trace.spans[2]);

  const x = scale(0, Math.max(total, 4800), 190, 684);
  const rowH = 24;
  return (
    <FigureFrame
      kind="Simulation"
      title="One request, every hop: reading a trace waterfall"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={`${trace.note} X-Ray's SDKs and daemon are in maintenance mode, so new work should send OpenTelemetry (ADOT) traces; MLflow traces read the same way.`}
    >
      <Controls>
        <Segmented label="Scenario" value={scenario} onChange={setScenario} options={Object.entries(TRACES).map(([id, item]) => ({ id, label: item.label }))} />
      </Controls>
      <svg viewBox={`0 0 700 ${trace.spans.length * rowH + 34}`} className="aipf-svg">
        {[0, 1000, 2000, 3000, 4000].map((ms) => (
          <g key={ms} className="aipf-grid">
            <line x1={x(ms)} x2={x(ms)} y1="4" y2={trace.spans.length * rowH + 8} />
            <text x={x(ms)} y={trace.spans.length * rowH + 24} textAnchor="middle">{ms / 1000}s</text>
          </g>
        ))}
        {trace.spans.map((span, index) => {
          const y0 = 6 + index * rowH;
          const end = Math.min(span.end, now);
          const width = Math.max(0, x(end) - x(span.start));
          const tone = span.error ? "var(--aipf-bad)" : span.slow ? "var(--aipf-warn)" : span === slowest ? KIND_COLOR.ai : span.depth === 0 ? KIND_COLOR.network : span.depth === 1 ? KIND_COLOR.compute : KIND_COLOR.analytics;
          return (
            <g key={span.name}>
              <text x={182} y={y0 + 14} textAnchor="end" className={`aipf-small${span.error ? " aipf-bad" : ""}`}>{"· ".repeat(span.depth)}{span.name}</text>
              {now >= span.start ? <rect x={x(span.start)} y={y0 + 3} width={width} height={rowH - 9} rx="3" style={{ fill: tone }} opacity={span.depth === 0 ? 0.55 : 0.9} /> : null}
              {span.ttft && now >= span.ttft ? <line x1={x(span.ttft)} x2={x(span.ttft)} y1={y0} y2={y0 + rowH - 3} className="aipf-ttft" /> : null}
              {now >= span.end ? <text x={x(span.end) + 4} y={y0 + 14} className="aipf-mono aipf-small">{fmt(span.end - span.start)} ms</text> : null}
            </g>
          );
        })}
      </svg>
      <div className="aipf-stats">
        <Stat label="End-to-end" value={`${fmt(total)} ms`} tone={total > 3000 ? "warn" : "ok"} />
        <Stat label="Biggest segment" value={slowest.name} />
        <Stat label="Annotations (searchable)" value="model_id · tenant" sub="metadata is not indexed" />
      </div>
    </FigureFrame>
  );
}

