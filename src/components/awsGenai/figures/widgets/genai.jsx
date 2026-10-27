import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge, Controls, FigureFrame, GridY, PlayControls, Segmented, Slider, Stat, Toggle,
  KIND_COLOR, fmt, linePath, scale, seeded, useFrame, usePlayback, useSweep,
} from "../kit";

/* Model-behavior widgets: sampling, context budgets, LoRA, routing, memory
   and the agent loop. Numbers are illustrative unless a lesson states them;
   every caption says what the reader should take away. */

/* ── token sampler ─────────────────────────────────────────────────────── */

const SAMPLER_PROMPTS = {
  factual: {
    label: "Factual",
    prompt: "The capital of France is",
    tokens: [["Paris", 6.4], ["a", 3.6], ["the", 3.3], ["located", 2.9], ["known", 2.4], ["Lyon", 1.9], ["not", 1.5], ["beautiful", 1.1]],
  },
  creative: {
    label: "Creative",
    prompt: "Once upon a time there was a",
    tokens: [["little", 2.6], ["young", 2.4], ["king", 2.2], ["girl", 2.0], ["dragon", 1.9], ["small", 1.7], ["brave", 1.5], ["robot", 1.2]],
  },
};

function samplingDistribution(tokens, temperature, topK, topP) {
  const logits = tokens.map(([, value]) => value);
  let probs;
  if (temperature <= 0.001) {
    const best = logits.indexOf(Math.max(...logits));
    probs = logits.map((_, index) => (index === best ? 1 : 0));
  } else {
    const peak = Math.max(...logits);
    const weights = logits.map((value) => Math.exp((value - peak) / temperature));
    const total = weights.reduce((a, b) => a + b, 0);
    probs = weights.map((value) => value / total);
  }
  let cumulative = 0;
  const eligible = probs.map((p, index) => {
    const keep = index < topK && (cumulative < topP || index === 0);
    cumulative += p;
    return keep;
  });
  const kept = probs.reduce((sum, p, index) => sum + (eligible[index] ? p : 0), 0) || 1;
  return probs.map((p, index) => ({ token: tokens[index][0], raw: p, eligible: eligible[index], p: eligible[index] ? p / kept : 0 }));
}

export function TokenSampler() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [preset, setPreset] = useState("factual");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [topK, setTopK] = useState(8);
  const [history, setHistory] = useState([]);
  const [flash, setFlash] = useState(null);
  const clock = useRef(0);

  const { prompt, tokens } = SAMPLER_PROMPTS[preset];
  const dist = useMemo(() => samplingDistribution(tokens, temperature, topK, topP), [tokens, temperature, topK, topP]);

  useEffect(() => { setHistory([]); }, [preset, temperature, topP, topK]);

  useFrame(playback.playing, (dt) => {
    clock.current += dt;
    if (clock.current < 850) return;
    clock.current = 0;
    let roll = Math.random();
    let pick = dist.findIndex((item) => item.eligible);
    for (let index = 0; index < dist.length; index += 1) {
      if (!dist[index].eligible) continue;
      if (roll < dist[index].p) { pick = index; break; }
      roll -= dist[index].p;
    }
    setFlash(pick);
    setHistory((prev) => [...prev, dist[pick].token].slice(-14));
  });

  const distinct = new Set(history).size;
  const top = dist[0];
  const caption = temperature <= 0.001
    ? "Temperature 0 is greedy decoding: the top token every time. Best for extraction and classification, where you want the same answer twice."
    : top.p > 0.9
      ? `“${top.token}” takes ${Math.round(top.p * 100)}% after filtering, so samples barely vary. Lower temperature and top-p make output predictable.`
      : `The distribution is flatter: ${dist.filter((item) => item.eligible).length} candidates remain, so repeated runs differ. Good for creative text, risky for facts.`;

  const W = 700;
  const rowH = 27;
  const barX = 120;
  const barW = 470;
  return (
    <FigureFrame
      kind="Interactive"
      title="Temperature, top-p and top-k reshape the next-token choice"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setHistory([])} />}
      caption={caption}
    >
      <Controls>
        <Segmented label="Prompt" value={preset} options={Object.entries(SAMPLER_PROMPTS).map(([id, item]) => ({ id, label: item.label }))} onChange={setPreset} />
        <Slider label="Temperature" value={temperature} min={0} max={2} step={0.05} onChange={setTemperature} format={(v) => v.toFixed(2)} />
        <Slider label="Top-p" value={topP} min={0.05} max={1} step={0.05} onChange={setTopP} format={(v) => v.toFixed(2)} />
        <Slider label="Top-k" value={topK} min={1} max={8} onChange={setTopK} />
      </Controls>
      <p className="aipf-prompt"><span>{prompt}</span><span className="aipf-cursor">▍</span></p>
      <svg viewBox={`0 0 ${W} ${dist.length * rowH + 8}`} className="aipf-svg">
        {dist.map((item, index) => {
          const y = index * rowH + 4;
          const isFlash = flash === index && playback.playing;
          return (
            <g key={item.token} className={`aipf-row${item.eligible ? "" : " is-off"}${isFlash ? " is-flash" : ""}`}>
              <text x={barX - 10} y={y + 16} textAnchor="end" className="aipf-mono aipf-token">{item.token}</text>
              <rect x={barX} y={y + 3} width={barW} height={rowH - 9} rx="4" className="aipf-track" />
              <rect x={barX} y={y + 3} width={Math.max(1, barW * item.raw)} height={rowH - 9} rx="4" className="aipf-bar-ghost" />
              <rect x={barX} y={y + 3} width={Math.max(item.eligible ? 2 : 0, barW * item.p)} height={rowH - 9} rx="4" className="aipf-bar" />
              <text x={barX + barW + 10} y={y + 16} className="aipf-mono aipf-val">
                {item.eligible ? `${(item.p * 100).toFixed(item.p < 0.1 ? 1 : 0)}%` : "cut"}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="aipf-chips">
        <span className="aipf-chips-label">Samples</span>
        {history.length ? history.map((token, index) => <span key={index} className="aipf-chip">{token}</span>) : <span className="aipf-muted">press play to sample</span>}
        {history.length > 4 ? <Badge tone={distinct > 2 ? "warn" : "ok"}>{distinct} distinct</Badge> : null}
      </div>
    </FigureFrame>
  );
}

/* ── context budget ────────────────────────────────────────────────────── */

const WINDOWS = [8_000, 32_000, 128_000, 200_000];
const TURN_TOKENS = 180;

export function ContextBudget() {
  const [windowSize, setWindowSize] = useState(32_000);
  const [system, setSystem] = useState(1800);
  const [turns, setTurns] = useState(24);
  const [chunks, setChunks] = useState(8);
  const [chunkSize, setChunkSize] = useState(512);
  const [maxOut, setMaxOut] = useState(4096);
  const [summarize, setSummarize] = useState(false);

  const history = summarize ? Math.min(turns, 6) * TURN_TOKENS + (turns > 6 ? 400 : 0) : turns * TURN_TOKENS;
  const parts = [
    { id: "system", label: "System + tools", value: system, color: KIND_COLOR.devtools },
    { id: "history", label: summarize && turns > 6 ? "History (6 turns + summary)" : `History (${turns} turns)`, value: history, color: KIND_COLOR.db },
    { id: "chunks", label: `Chunks (${chunks} × ${chunkSize})`, value: chunks * chunkSize, color: KIND_COLOR.storage },
    { id: "question", label: "Question", value: 60, color: KIND_COLOR.client },
    { id: "output", label: "Reserved output", value: maxOut, color: KIND_COLOR.ai, hatch: true },
  ];
  const input = parts.slice(0, 4).reduce((sum, part) => sum + part.value, 0);
  const total = input + maxOut;
  const over = total - windowSize;
  const W = 700;
  const unit = (W - 10) / Math.max(windowSize, total);
  let cursor = 5;
  const windowX = 5 + windowSize * unit;

  return (
    <FigureFrame
      kind="Interactive"
      title="Budget the context window before you call the model"
      caption={over > 0
        ? `Over by ${fmt(over)} tokens: input + maxTokens must fit the window, so the call fails validation. Trim history, retrieve fewer or smaller chunks, or lower maxTokens.`
        : `Fits with ${fmt(-over)} tokens to spare (${Math.round((total / windowSize) * 100)}% used). Every token here is also billed and counted against your tokens-per-minute quota.`}
    >
      <Controls>
        <Segmented label="Context window" value={windowSize} options={WINDOWS.map((value) => ({ id: value, label: `${value / 1000}K` }))} onChange={setWindowSize} />
        <Slider label="System prompt + tools" value={system} min={200} max={8000} step={100} onChange={setSystem} />
        <Slider label="Chat turns" value={turns} min={0} max={60} onChange={setTurns} />
        <Slider label="Retrieved chunks (k)" value={chunks} min={0} max={24} onChange={setChunks} />
        <Slider label="Chunk size (tokens)" value={chunkSize} min={128} max={1024} step={64} onChange={setChunkSize} />
        <Slider label="maxTokens (output)" value={maxOut} min={256} max={8192} step={256} onChange={setMaxOut} />
        <Toggle label="Summarize all but the last 6 turns" checked={summarize} onChange={setSummarize} />
      </Controls>
      <svg viewBox={`0 0 ${W} 92`} className="aipf-svg">
        <defs>
          <pattern id="aipf-hatch-out" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" style={{ fill: `color-mix(in srgb, ${KIND_COLOR.ai} 30%, transparent)` }} />
            <line x1="0" y1="0" x2="0" y2="7" style={{ stroke: KIND_COLOR.ai }} strokeWidth="2.4" />
          </pattern>
          <pattern id="aipf-hatch-bad" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="6" style={{ stroke: "var(--aipf-bad)" }} strokeWidth="2" />
          </pattern>
        </defs>
        <rect x="5" y="20" width={W - 10} height="34" rx="6" className="aipf-track" />
        {parts.map((part) => {
          const x = cursor;
          const width = part.value * unit;
          cursor += width;
          return (
            <g key={part.id}>
              <rect className="aipf-seg-rect" x={x} y="20" width={Math.max(0, width)} height="34"
                style={{ fill: part.hatch ? "url(#aipf-hatch-out)" : part.color }} />
              {width > 64 ? <text x={x + width / 2} y="41" textAnchor="middle" className="aipf-seg-text">{fmt(part.value)}</text> : null}
            </g>
          );
        })}
        {over > 0 ? <rect x={windowX} y="16" width={W - 5 - windowX} height="42" fill="url(#aipf-hatch-bad)" opacity="0.55" /> : null}
        <line x1={windowX} x2={windowX} y1="8" y2="66" className={`aipf-limit${over > 0 ? " is-bad" : ""}`} />
        <text x={Math.min(windowX, W - 6)} y="80" textAnchor={windowX > W - 90 ? "end" : "middle"} className="aipf-mono aipf-limit-text">
          {windowSize / 1000}K window
        </text>
      </svg>
      <div className="aipf-legend">
        {parts.map((part) => (
          <span key={part.id}><i style={{ background: part.hatch ? "transparent" : part.color, borderColor: part.color }} />{part.label}</span>
        ))}
      </div>
      <div className="aipf-stats">
        <Stat label="Input tokens" value={fmt(input)} />
        <Stat label="Reserved output" value={fmt(maxOut)} />
        <Stat label="Input + output" value={fmt(total)} tone={over > 0 ? "bad" : "ok"} sub={over > 0 ? "ValidationException" : "fits"} />
      </div>
    </FigureFrame>
  );
}

/* ── LoRA rank ─────────────────────────────────────────────────────────── */

export function LoraRank() {
  const [d, setD] = useState(4096);
  const [rank, setRank] = useState(8);
  const [layers, setLayers] = useState(32);
  const [targets, setTargets] = useState(2);

  const full = d * d;
  const lora = 2 * d * rank;
  const trainable = layers * targets * lora;
  const adapted = layers * targets * full;
  const mb = (trainable * 2) / 1024 / 1024;
  const thin = Math.max(3, (170 * rank) / d);
  const share = (lora / full) * 100;

  return (
    <FigureFrame
      kind="Interactive"
      title="LoRA trains two thin matrices instead of the big one"
      className="aipf--lora"
      caption={`Rank ${rank} trains ${share.toFixed(share < 1 ? 2 : 1)}% of each adapted matrix. The base model stays frozen and shared; the ${mb < 1 ? mb.toFixed(2) : fmt(mb, 1)} MB adapter is what you deploy, version and roll back.`}
    >
      <Controls>
        <Slider label="Hidden size d" value={d} min={1024} max={8192} step={512} onChange={setD} />
        <Slider label="Rank r" value={rank} min={1} max={64} onChange={setRank} />
        <Slider label="Layers" value={layers} min={8} max={80} step={4} onChange={setLayers} />
        <Segmented label="Adapted matrices / layer" value={targets} options={[{ id: 2, label: "q, v" }, { id: 4, label: "q, k, v, o" }]} onChange={setTargets} />
      </Controls>
      <svg viewBox="0 0 700 230" className="aipf-svg">
        <g transform="translate(40 26)">
          <rect width="170" height="170" rx="6" className="aipf-frozen" />
          <text x="85" y="80" textAnchor="middle" className="aipf-big">W</text>
          <text x="85" y="102" textAnchor="middle" className="aipf-mono aipf-small">{d} × {d}</text>
          <text x="85" y="190" textAnchor="middle" className="aipf-small">frozen · {fmt(full / 1e6, 1)}M params</text>
        </g>
        <text x="250" y="117" textAnchor="middle" className="aipf-big">+</text>
        <g transform="translate(300 26)">
          <rect width={170} height={thin} rx="2" className="aipf-train" />
          <text x="85" y={thin + 16} textAnchor="middle" className="aipf-mono aipf-small">B: {rank} × {d}</text>
        </g>
        <text x="490" y="117" textAnchor="middle" className="aipf-big">·</text>
        <g transform={`translate(${520} 26)`}>
          <rect width={thin} height="170" rx="2" className="aipf-train" />
          <text x={thin + 10} y="90" className="aipf-mono aipf-small">A: {d} × {rank}</text>
        </g>
        <text x="420" y="216" textAnchor="middle" className="aipf-small">trainable · {fmt(lora / 1e3, 1)}K params per matrix</text>
      </svg>
      <div className="aipf-stats">
        <Stat label="Trainable (all layers)" value={`${fmt(trainable / 1e6, 2)}M`} tone="ok" />
        <Stat label="Adapted weights" value={`${fmt(adapted / 1e9, 2)}B`} />
        <Stat label="Adapter size (fp16)" value={`${mb < 1 ? mb.toFixed(2) : fmt(mb, 1)} MB`} />
      </div>
    </FigureFrame>
  );
}

/* ── model cascade ─────────────────────────────────────────────────────── */

const CASCADE_REQUESTS = (() => {
  const rand = seeded(42);
  return Array.from({ length: 32 }, (_, index) => {
    const bucket = rand();
    const complexity = bucket < 0.6 ? rand() * 0.4 : bucket < 0.9 ? 0.4 + rand() * 0.3 : 0.7 + rand() * 0.3;
    return { index, complexity, r1: rand(), r2: rand(), noise: (rand() - 0.5) * 0.25 };
  });
})();
const SMALL_COST = 1;
const LARGE_COST = 15;

function routeRequest(request, strategy, threshold) {
  const smallOk = request.r1 < 1 - 0.85 * request.complexity ** 1.5;
  const largeOk = request.r2 < 0.97 - 0.08 * request.complexity;
  if (strategy === "large") return { lane: "large", ok: largeOk, cost: LARGE_COST };
  if (strategy === "small") return { lane: "small", ok: smallOk, cost: SMALL_COST };
  if (strategy === "route") {
    return request.complexity >= threshold
      ? { lane: "large", ok: largeOk, cost: LARGE_COST }
      : { lane: "small", ok: smallOk, cost: SMALL_COST };
  }
  const confidence = 1 - request.complexity + request.noise;
  return confidence < threshold
    ? { lane: "large", escalated: true, ok: largeOk, cost: SMALL_COST + LARGE_COST }
    : { lane: "small", ok: smallOk, cost: SMALL_COST };
}

export function ModelCascade() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [strategy, setStrategy] = useState("cascade");
  const [threshold, setThreshold] = useState(0.55);
  const [t, setT] = useSweep(playback, 5200);
  useEffect(() => { setT(0); }, [strategy, threshold, setT]);

  const routed = CASCADE_REQUESTS.map((request) => ({ ...request, ...routeRequest(request, strategy, threshold) }));
  const shown = Math.floor(t * routed.length + 0.0001);
  const visible = routed.slice(0, shown);
  const cost = routed.reduce((sum, item) => sum + item.cost, 0);
  const baseline = routed.length * LARGE_COST;
  const accuracy = routed.filter((item) => item.ok).length / routed.length;
  const lanes = { small: visible.filter((item) => item.lane === "small"), large: visible.filter((item) => item.lane === "large") };

  const lane = (items, y, label, color) => (
    <g>
      <text x="16" y={y + 4} className="aipf-lane-label">{label}</text>
      <rect x="150" y={y - 16} width="530" height="32" rx="8" className="aipf-track" />
      {items.map((item, index) => (
        <g key={item.index} className="aipf-pop">
          <circle cx={166 + index * 16.5} cy={y} r="6.5" style={{ fill: item.ok ? "var(--aipf-ok)" : "var(--aipf-bad)" }} />
          {item.escalated ? <circle cx={166 + index * 16.5} cy={y} r="9.5" fill="none" style={{ stroke: "var(--aipf-warn)" }} strokeWidth="1.6" /> : null}
        </g>
      ))}
      <circle cx="140" cy={y} r="5" style={{ fill: color }} />
    </g>
  );

  return (
    <FigureFrame
      kind="Simulation"
      title="Route easy requests to a small model, hard ones to a large one"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={`${Math.round((cost / baseline) * 100)}% of the always-large cost at ${Math.round(accuracy * 100)}% correct. Relative prices (small 1, large ${LARGE_COST}) are illustrative; the shape of the trade-off is the point.`}
    >
      <Controls>
        <Segmented label="Strategy" value={strategy} onChange={setStrategy} options={[
          { id: "large", label: "Always large" }, { id: "small", label: "Always small" },
          { id: "route", label: "Route by complexity" }, { id: "cascade", label: "Cascade" },
        ]} />
        {strategy === "route" || strategy === "cascade" ? (
          <Slider label={strategy === "route" ? "Send to large when complexity ≥" : "Escalate when confidence <"} value={threshold} min={0.1} max={0.9} step={0.05} onChange={setThreshold} format={(v) => v.toFixed(2)} />
        ) : null}
      </Controls>
      <svg viewBox="0 0 700 120" className="aipf-svg">
        {lane(lanes.small, 34, "Small model", KIND_COLOR.ai)}
        {lane(lanes.large, 86, "Large model", KIND_COLOR.compute)}
      </svg>
      <div className="aipf-legend">
        <span><i style={{ background: "var(--aipf-ok)" }} />correct</span>
        <span><i style={{ background: "var(--aipf-bad)" }} />wrong</span>
        <span><i style={{ border: "1.6px solid var(--aipf-warn)", background: "transparent", borderRadius: 99 }} />escalated after the small model</span>
      </div>
      <div className="aipf-stats">
        <Stat label="Relative cost" value={`${Math.round((cost / baseline) * 100)}%`} tone={cost / baseline < 0.5 ? "ok" : undefined} sub="of always-large" />
        <Stat label="Correct" value={`${Math.round(accuracy * 100)}%`} tone={accuracy > 0.9 ? "ok" : accuracy < 0.75 ? "bad" : "warn"} />
        <Stat label="To the large model" value={`${routed.filter((item) => item.lane === "large").length}/${routed.length}`} />
      </div>
    </FigureFrame>
  );
}

/* ── memory window ─────────────────────────────────────────────────────── */

const MEMORY_STRATEGIES = {
  full: { label: "Full history", color: "var(--aipf-bad)" },
  window: { label: "Last 8 turns", color: KIND_COLOR.compute },
  summary: { label: "Summary + 4", color: KIND_COLOR.ai },
  longterm: { label: "Long-term memory", color: KIND_COLOR.db },
};
const FACTS = [{ turn: 3, text: "name: Sam" }, { turn: 5, text: "prefers email" }];
const MEMORY_WINDOW = 8_000;

function memoryTokens(strategy, turn) {
  if (strategy === "full") return 400 + 160 * turn;
  if (strategy === "window") return 400 + 160 * Math.min(turn, 8);
  if (strategy === "summary") return 400 + 160 * Math.min(turn, 4) + (turn > 4 ? 300 : 0);
  return 400 + 160 * Math.min(turn, 4) + (turn > 4 ? 120 : 0);
}

function remembers(strategy, turn, fact, nextDay) {
  if (turn < fact.turn) return null;
  if (nextDay) return strategy === "longterm";
  if (strategy === "full") return memoryTokens("full", turn) <= MEMORY_WINDOW;
  if (strategy === "window") return fact.turn > turn - 8;
  return true;
}

export function MemoryWindow() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [strategy, setStrategy] = useState("window");
  const [nextDay, setNextDay] = useState(false);
  const [t, setT] = useSweep(playback, 9000);
  const turn = Math.max(1, Math.round(1 + t * 59));

  const W = 700;
  const H = 170;
  const x = scale(1, 60, 50, W - 20);
  const y = scale(0, 10_000, H - 24, 10);
  return (
    <FigureFrame
      kind="Simulation"
      title="Short-term context vs long-term memory over a long chat"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={nextDay
        ? "A new session starts empty: only long-term memory brings back the facts. Session context is not persistent memory, which is a classic exam distinction."
        : strategy === "full"
          ? "Resending everything grows the cost of every call and eventually overflows the window (8K here), when old turns get dropped anyway."
          : strategy === "window"
            ? "A sliding window caps tokens but forgets: after turn 12 the name from turn 3 is gone."
            : strategy === "summary"
              ? "A running summary keeps the gist at a fixed cost, but summaries are lossy and paid for on every call."
              : "Facts are extracted in the background and retrieved when relevant: small prompts, and the memory survives across sessions."}
    >
      <Controls>
        <Segmented label="Strategy" value={strategy} onChange={setStrategy} options={Object.entries(MEMORY_STRATEGIES).map(([id, item]) => ({ id, label: item.label }))} />
        <Toggle label="New session the next day" checked={nextDay} onChange={setNextDay} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <GridY x0={50} x1={W - 20} ticks={[0, 4000, 8000]} y={y} format={(v) => `${v / 1000}K`} />
        <line x1="50" x2={W - 20} y1={y(MEMORY_WINDOW)} y2={y(MEMORY_WINDOW)} className="aipf-limit is-bad" />
        <text x={W - 22} y={y(MEMORY_WINDOW) - 5} textAnchor="end" className="aipf-mono aipf-limit-text">8K window</text>
        {Object.entries(MEMORY_STRATEGIES).map(([id, item]) => (
          <path key={id} d={linePath(Array.from({ length: 60 }, (_, i) => [x(i + 1), y(Math.min(10_000, memoryTokens(id, i + 1)))]))}
            className={`aipf-line${id === strategy ? " is-on" : ""}`} style={{ stroke: item.color }} />
        ))}
        <line x1={x(turn)} x2={x(turn)} y1="8" y2={H - 22} className="aipf-cursor-line" />
        <circle cx={x(turn)} cy={y(Math.min(10_000, memoryTokens(strategy, turn)))} r="5" style={{ fill: MEMORY_STRATEGIES[strategy].color }} />
        <text x={x(turn)} y={H - 6} textAnchor="middle" className="aipf-mono aipf-small">turn {turn}</text>
      </svg>
      <div className="aipf-stats">
        <Stat label="Tokens this call" value={nextDay ? fmt(400 + (strategy === "longterm" ? 120 : 0)) : fmt(memoryTokens(strategy, turn))} />
        {FACTS.map((fact) => {
          const state = remembers(strategy, turn, fact, nextDay);
          return <Stat key={fact.text} label={`Turn ${fact.turn}: ${fact.text}`} value={state === null ? "not said yet" : state ? "remembered" : "forgotten"} tone={state === null ? undefined : state ? "ok" : "bad"} />;
        })}
      </div>
    </FigureFrame>
  );
}

/* ── ReAct loop ────────────────────────────────────────────────────────── */

function reactScript(timeout) {
  const lines = [
    { kind: "user", text: "Where is order #1042, and can I still change the delivery address?" },
    { kind: "thought", text: "I need the order status first." },
    { kind: "action", text: 'getOrderStatus(order_id="1042")', call: true },
  ];
  if (timeout) {
    lines.push({ kind: "error", text: "TimeoutError after 10 s" });
    lines.push({ kind: "thought", text: "Transient failure. Retry once." });
    lines.push({ kind: "action", text: 'getOrderStatus(order_id="1042")', call: true });
  }
  lines.push(
    { kind: "observation", text: '{"status": "packed", "carrier": "pending"}' },
    { kind: "thought", text: "Packed, not shipped. Check the address-change policy." },
    { kind: "action", text: 'searchKnowledgeBase("change address after packing")', call: true },
    { kind: "observation", text: '"Address changes are allowed until the order ships."' },
    { kind: "thought", text: "I have enough to answer." },
    { kind: "final", text: "Order #1042 is packed and has not shipped, so you can still change the address." },
  );
  return lines;
}

const STAGE_OF = { thought: 0, action: 1, observation: 2, error: 2 };

export function ReactLoop() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [maxIterations, setMaxIterations] = useState(4);
  const [timeout, setTimeoutFailure] = useState(false);
  const script = useMemo(() => reactScript(timeout), [timeout]);

  // Cut the run where the iteration limit stops it.
  const run = useMemo(() => {
    const out = [];
    let calls = 0;
    for (const line of script) {
      if (line.call) {
        if (calls >= maxIterations) {
          out.push({ kind: "stop", text: `Stopped: max ${maxIterations} tool call${maxIterations === 1 ? "" : "s"} reached. Return a partial answer and escalate.` });
          return out;
        }
        calls += 1;
      }
      out.push(line);
    }
    return out;
  }, [script, maxIterations]);

  const [t, setT] = useSweep(playback, run.length * 900);
  useEffect(() => { setT(0); }, [run, setT]);
  const shown = Math.min(run.length, Math.floor(t * run.length) + 1);
  const current = run[shown - 1];
  const calls = run.slice(0, shown).filter((line) => line.call).length;
  const stage = STAGE_OF[current?.kind];
  const angle = stage === undefined ? -90 : -90 + stage * 120;

  return (
    <FigureFrame
      kind="Simulation"
      title="The agent loop: reason, act, observe, with a hard stop"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption="The model only proposes actions; the orchestrator runs the tools and feeds the results back. Iteration limits, timeouts and retries are safeguards you configure, not something the model does for you."
    >
      <Controls>
        <Slider label="Max tool calls" value={maxIterations} min={1} max={4} onChange={setMaxIterations} />
        <Toggle label="First tool call times out" checked={timeout} onChange={setTimeoutFailure} />
      </Controls>
      <div className="aipf-split">
        <svg viewBox="0 0 220 220" className="aipf-svg aipf-loop">
          <circle cx="110" cy="110" r="72" className="aipf-loop-ring" />
          {["Reason", "Act", "Observe"].map((label, index) => {
            const a = ((-90 + index * 120) * Math.PI) / 180;
            const on = stage === index;
            return (
              <g key={label} className={`aipf-loop-node${on ? " is-on" : ""}`}>
                <circle cx={110 + 72 * Math.cos(a)} cy={110 + 72 * Math.sin(a)} r="27" />
                <text x={110 + 72 * Math.cos(a)} y={114 + 72 * Math.sin(a)} textAnchor="middle">{label}</text>
              </g>
            );
          })}
          <g style={{ transform: `rotate(${angle + 90}deg)`, transformOrigin: "110px 110px", transition: "transform .5s cubic-bezier(.4,0,.2,1)" }}>
            <path d="M110 70 L103.5 83 L116.5 83 Z" className="aipf-loop-pointer" />
          </g>
          <text x="110" y="106" textAnchor="middle" className="aipf-big">{calls}/{maxIterations}</text>
          <text x="110" y="124" textAnchor="middle" className="aipf-small">tool calls</text>
        </svg>
        <ol className="aipf-trace">
          {run.slice(0, shown).map((line, index) => (
            <li key={index} className={`is-${line.kind}`}>
              <span className="aipf-trace-tag">{line.kind === "final" ? "answer" : line.kind}</span>
              <span>{line.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </FigureFrame>
  );
}
