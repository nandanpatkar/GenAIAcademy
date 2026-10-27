import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Controls, FigureFrame, GridY, PlayControls, Segmented, Slider, Stat, Toggle,
  KIND_COLOR, areaPath, clamp, fmt, linePath, scale, seeded, usePlayback, useSweep,
} from "../kit";

/* Performance and resilience widgets. Each runs a small deterministic
   simulation (seeded randomness), so the same settings always draw the same
   picture and a reader can compare strategies fairly. Capacities and prices
   are illustrative; the documented rules (29 s gateway timeout, 5-minute
   prompt-cache TTL, quota reservation = input + max_tokens, Kinesis shard
   limits) are the ones the lessons verify. */

/* ── streaming vs buffered ─────────────────────────────────────────────── */

const FILLER = "Here is a step-by-step answer that walks through each part of the question, cites the policy section it relies on, and ends with a short summary of what to do next. ".repeat(40).split(" ");

export function LatencyStream() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [mode, setMode] = useState("stream");
  const [tokens, setTokens] = useState(1200);
  const [speed, setSpeed] = useState(45);
  const [ttft, setTtft] = useState(0.8);
  const total = ttft + tokens / speed;
  const horizon = Math.max(32, total * 1.08);
  const [t, setT] = useSweep(playback, 6500, { hold: 2600 });
  useEffect(() => { setT(0); }, [mode, tokens, speed, ttft, setT]);

  const now = t * horizon;
  const gatewayFail = mode === "buffered" && total > 29;
  const end = gatewayFail ? 29 : total;
  const received = mode === "stream"
    ? clamp(Math.floor((now - ttft) * speed), 0, tokens)
    : now >= total && !gatewayFail ? tokens : 0;
  const words = Math.round((received / tokens) * Math.min(90, tokens / 1.3));
  const x = scale(0, horizon, 20, 680);

  return (
    <FigureFrame
      kind="Simulation"
      title="Streaming changes when the user sees something, not how long the answer takes"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={gatewayFail
        ? `A buffered response needs ${fmt(total, 1)} s, but an API Gateway REST integration gives up at 29 s by default: the user gets a 504 after staring at a spinner. Stream the response (REST response streaming, ConverseStream) instead.`
        : mode === "stream"
          ? `First words after ${fmt(ttft, 1)} s, the full answer after ${fmt(total, 1)} s. Streaming needs bedrock:InvokeModelWithResponseStream and every hop must allow long-lived responses.`
          : `Nothing on screen for ${fmt(total, 1)} s, then everything at once. Total time is the same; perceived latency is far worse.`}
    >
      <Controls>
        <Segmented label="Delivery" value={mode} onChange={setMode} options={[{ id: "buffered", label: "Buffered (sync)" }, { id: "stream", label: "Streaming" }]} />
        <Slider label="Output tokens" value={tokens} min={50} max={4000} step={50} onChange={setTokens} />
        <Slider label="Generation speed" value={speed} min={20} max={150} step={5} onChange={setSpeed} format={(v) => `${v} tok/s`} />
        <Slider label="Time to first token" value={ttft} min={0.2} max={3} step={0.1} onChange={setTtft} format={(v) => `${v.toFixed(1)} s`} />
      </Controls>
      <svg viewBox="0 0 700 74" className="aipf-svg">
        <rect x="20" y="22" width="660" height="18" rx="5" className="aipf-track" />
        {mode === "stream"
          ? <rect x={x(ttft)} y="22" width={Math.max(0, x(Math.min(now, total)) - x(ttft))} height="18" rx="5" className="aipf-fill is-ok" />
          : <rect x="20" y="22" width={Math.max(0, x(Math.min(now, end)) - 20)} height="18" rx="5" className={`aipf-fill${gatewayFail ? " is-bad" : " is-wait"}`} />}
        <line x1={x(29)} x2={x(29)} y1="12" y2="50" className="aipf-limit is-bad" />
        <text x={x(29)} y="64" textAnchor="middle" className="aipf-mono aipf-limit-text">29 s REST timeout</text>
        <line x1={x(now)} x2={x(now)} y1="14" y2="48" className="aipf-cursor-line" />
        <text x={x(Math.min(now, horizon - 2))} y="10" textAnchor="middle" className="aipf-mono aipf-small">{fmt(now, 1)} s</text>
      </svg>
      <div className={`aipf-bubble${gatewayFail && now >= 29 ? " is-error" : ""}`}>
        {gatewayFail && now >= 29
          ? <><b>504 Gateway Timeout</b> — the integration did not answer within 29 seconds.</>
          : received
            ? <>{FILLER.slice(0, Math.max(1, words)).join(" ")}{received < tokens ? <span className="aipf-cursor">▍</span> : null}</>
            : <span className="aipf-typing"><i /><i /><i /></span>}
      </div>
      <div className="aipf-stats">
        <Stat label="First words visible" value={mode === "stream" ? `${fmt(ttft, 1)} s` : gatewayFail ? "never" : `${fmt(total, 1)} s`} tone={mode === "stream" ? "ok" : "warn"} />
        <Stat label="Complete answer" value={gatewayFail ? "504" : `${fmt(total, 1)} s`} tone={gatewayFail ? "bad" : undefined} />
        <Stat label="Tokens received" value={`${fmt(received)}/${fmt(tokens)}`} />
      </div>
    </FigureFrame>
  );
}

/* ── prompt cache ──────────────────────────────────────────────────────── */

const PREFIX = 4500;   // tool definitions + system prompt + documents
const TTL = 300;       // seconds, refreshed on every hit
const CALLS = 8;
const PRICE = { input: 1, write: 1.25, read: 0.1 };

export function PromptCache() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [gap, setGap] = useState(120);
  const [checkpoint, setCheckpoint] = useState(true);
  const [edit, setEdit] = useState(false);
  const [t, setT] = useSweep(playback, CALLS * 700, { hold: 2600 });
  useEffect(() => { setT(0); }, [gap, checkpoint, edit, setT]);

  const calls = useMemo(() => {
    let entry = null;
    return Array.from({ length: CALLS }, (_, index) => {
      const time = index * gap;
      const question = 40 + ((index * 7) % 20);
      const key = edit && index >= 4 ? "v2" : "v1";
      if (!checkpoint) return { time, question, read: 0, write: 0, input: PREFIX + question };
      if (entry && entry.key === key && entry.expires >= time) {
        entry.expires = time + TTL;
        return { time, question, read: PREFIX, write: 0, input: question };
      }
      entry = { key, expires: time + TTL };
      return { time, question, read: 0, write: PREFIX, input: question };
    });
  }, [gap, checkpoint, edit]);

  const shown = Math.min(CALLS, Math.floor(t * CALLS) + 1);
  const cost = calls.reduce((sum, call) => sum + call.input * PRICE.input + call.write * PRICE.write + call.read * PRICE.read, 0);
  const baseline = calls.reduce((sum, call) => sum + (PREFIX + call.question) * PRICE.input, 0);
  const quotaTokens = calls.reduce((sum, call) => sum + call.input + call.write, 0);
  const reads = calls.filter((call) => call.read).length;
  const maxTokens = PREFIX + 60;
  const barH = 150;

  return (
    <FigureFrame
      kind="Simulation"
      title="Prompt caching: pay once for the stable prefix, read it cheaply after"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={!checkpoint
        ? "Without a cache checkpoint every call re-sends and re-bills the same 4,500-token prefix."
        : gap > TTL
          ? `Calls ${gap} s apart outlive the 5-minute TTL, so every call writes the cache again and pays the write premium. Prompt caching suits bursts of calls that share a prefix.`
          : `${reads} of ${CALLS} calls read the prefix from cache; each hit refreshes the 5-minute TTL. Anything that changes earlier in the prefix (a system-prompt edit) starts a new entry. Cache reads also do not count toward the quota.`}
    >
      <Controls>
        <Slider label="Time between calls" value={gap} min={10} max={600} step={10} onChange={setGap} format={(v) => `${v} s`} />
        <Toggle label="cachePoint after the documents" checked={checkpoint} onChange={setCheckpoint} />
        <Toggle label="System prompt edited before call 5" checked={edit} onChange={setEdit} />
      </Controls>
      <svg viewBox="0 0 700 200" className="aipf-svg">
        {calls.map((call, index) => {
          const x0 = 40 + index * 80;
          const visible = index < shown;
          const h = (value) => (value / maxTokens) * barH;
          let y = 170;
          const parts = [["write", call.write, "var(--aipf-warn)"], ["read", call.read, "var(--aipf-ok)"], ["input", call.input, KIND_COLOR.network]];
          return (
            <g key={index} className={visible ? "aipf-pop" : "aipf-hidden"}>
              {parts.map(([name, value, color]) => {
                if (!value) return null;
                y -= h(value);
                return <rect key={name} x={x0} y={y} width="46" height={Math.max(1.5, h(value))} rx="3" style={{ fill: color }} />;
              })}
              <text x={x0 + 23} y="186" textAnchor="middle" className="aipf-mono aipf-small">#{index + 1}</text>
              <text x={x0 + 23} y="198" textAnchor="middle" className="aipf-small">{fmt(call.time / 60, call.time % 60 ? 1 : 0)} min</text>
              {call.read ? <text x={x0 + 23} y={y - 6} textAnchor="middle" className="aipf-mono aipf-small aipf-ok">hit</text> : null}
              {call.write ? <text x={x0 + 23} y={y - 6} textAnchor="middle" className="aipf-mono aipf-small aipf-warn">write</text> : null}
            </g>
          );
        })}
      </svg>
      <div className="aipf-legend">
        <span><i style={{ background: "var(--aipf-warn)" }} />cacheWriteInputTokens (×{PRICE.write})</span>
        <span><i style={{ background: "var(--aipf-ok)" }} />cacheReadInputTokens (×{PRICE.read})</span>
        <span><i style={{ background: KIND_COLOR.network }} />inputTokens (×1)</span>
      </div>
      <div className="aipf-stats">
        <Stat label="Input cost vs no cache" value={`${Math.round((cost / baseline) * 100)}%`} tone={cost < baseline * 0.6 ? "ok" : cost > baseline ? "bad" : undefined} sub="illustrative price ratios" />
        <Stat label="Cache hits" value={`${reads}/${CALLS}`} />
        <Stat label="Tokens counted in quota" value={fmt(quotaTokens)} sub="reads not counted" />
      </div>
    </FigureFrame>
  );
}

/* ── throughput vs quota ───────────────────────────────────────────────── */

const TPM = 1_000_000;
const INPUT = 3000;
const DEMAND = (() => {
  const rand = seeded(11);
  return Array.from({ length: 60 }, (_, minute) => {
    const burst = minute > 14 && minute < 22 ? 150 : minute > 38 && minute < 44 ? 210 : 0;
    return Math.round(90 + 30 * Math.sin(minute / 6) + burst + rand() * 25);
  });
})();

export function ThroughputCapacity() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [mode, setMode] = useState("ondemand");
  const [maxTokens, setMaxTokens] = useState(8000);
  const [units, setUnits] = useState(3);
  const [t, setT] = useSweep(playback, 6000, { hold: 2600 });
  useEffect(() => { setT(0); }, [mode, maxTokens, units, setT]);

  const perRequest = INPUT + maxTokens;
  const onDemand = TPM / perRequest;
  const capacity = mode === "cris" ? onDemand * 2.5 : mode === "provisioned" ? units * 60 : onDemand;
  const demand = mode === "batch" ? DEMAND.map((value) => Math.round(value * 0.6)) : DEMAND;
  const throttled = demand.reduce((sum, value) => sum + Math.max(0, value - capacity), 0);
  const totalDemand = demand.reduce((sum, value) => sum + value, 0);

  const W = 700;
  const H = 210;
  const x = scale(0, 59, 50, W - 16);
  const yMax = Math.max(400, ...demand, capacity * 1.1);
  const y = scale(0, yMax, H - 24, 10);
  const shownTo = Math.floor(t * 59);
  const pts = demand.slice(0, shownTo + 1).map((value, minute) => [x(minute), y(value)]);
  const over = demand.slice(0, shownTo + 1).map((value, minute) => [x(minute), y(Math.max(value, capacity))]);

  return (
    <FigureFrame
      kind="Simulation"
      title="Quota admits requests by reservation: input + max_tokens"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={mode === "ondemand"
        ? `Each request reserves ${fmt(perRequest)} tokens up front (input + max_tokens), so a ${fmt(TPM)} TPM quota admits about ${fmt(onDemand)} requests a minute, even though answers average 800 tokens. Lower max_tokens to admit more.`
        : mode === "cris"
          ? "Cross-Region inference spreads on-demand traffic over several Regions' capacity: higher effective throughput with no commitment (illustrative ×2.5)."
          : mode === "provisioned"
            ? "Provisioned Throughput buys dedicated model units: predictable capacity, billed whether used or not, and required for some custom models."
            : "Batch inference moves work that can wait (here 40% of it) to asynchronous jobs, leaving the on-demand quota for interactive traffic."}
    >
      <Controls>
        <Segmented label="Capacity" value={mode} onChange={setMode} options={[
          { id: "ondemand", label: "On-demand" }, { id: "cris", label: "+ Cross-Region" },
          { id: "provisioned", label: "Provisioned" }, { id: "batch", label: "Offload to batch" },
        ]} />
        {mode === "provisioned"
          ? <Slider label="Model units" value={units} min={1} max={6} onChange={setUnits} />
          : <Slider label="max_tokens per request" value={maxTokens} min={500} max={32000} step={500} onChange={setMaxTokens} />}
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <GridY x0={50} x1={W - 16} ticks={[0, 100, 200, 300].filter((v) => v < yMax)} y={y} />
        <path d={areaPath(over, y(capacity))} className="aipf-area is-bad" />
        <path d={linePath(pts)} className="aipf-line is-on" style={{ stroke: KIND_COLOR.client }} />
        <line x1="50" x2={W - 16} y1={y(capacity)} y2={y(capacity)} className="aipf-limit is-ok" />
        <text x={W - 18} y={y(capacity) - 6} textAnchor="end" className="aipf-mono aipf-limit-text">capacity ≈ {fmt(capacity)} req/min</text>
        <text x="50" y={H - 6} className="aipf-small">0 min</text>
        <text x={W - 16} y={H - 6} textAnchor="end" className="aipf-small">60 min</text>
      </svg>
      <div className="aipf-stats">
        <Stat label="Admitted per minute" value={fmt(capacity)} />
        <Stat label="Throttled (429)" value={`${Math.round((throttled / totalDemand) * 100)}%`} tone={throttled ? "bad" : "ok"} sub={`${fmt(throttled)} requests`} />
        <Stat label="Reservation / request" value={mode === "provisioned" ? "dedicated" : fmt(perRequest)} />
      </div>
    </FigureFrame>
  );
}

/* ── backoff and jitter ────────────────────────────────────────────────── */

const SLOT_MS = 100;
const SLOTS = 120;
const SLOT_CAPACITY = 6;
const CLIENTS = 50;

function simulateRetries(strategy, base, cap, maxAttempts) {
  const rand = seeded(5);
  const queue = Array.from({ length: CLIENTS }, (_, client) => ({ time: rand() * 20, client, attempt: 0 }));
  const slots = Array.from({ length: SLOTS }, () => ({ ok: 0, fail: 0 }));
  const done = new Array(CLIENTS).fill(null);
  let attempts = 0;
  let gaveUp = 0;
  while (queue.length) {
    queue.sort((a, b) => a.time - b.time);
    const event = queue.shift();
    const slot = Math.floor(event.time / SLOT_MS);
    if (slot >= SLOTS) { gaveUp += 1; continue; }
    attempts += 1;
    if (slots[slot].ok < SLOT_CAPACITY) {
      slots[slot].ok += 1;
      done[event.client] = event.time;
      continue;
    }
    slots[slot].fail += 1;
    const next = event.attempt + 1;
    if (next >= maxAttempts) { gaveUp += 1; continue; }
    const ceiling = Math.min(cap, base * 2 ** event.attempt);
    const delay = strategy === "none" ? 50 : strategy === "exp" ? ceiling : rand() * ceiling;
    queue.push({ time: event.time + delay, client: event.client, attempt: next });
  }
  const finished = done.filter((value) => value !== null);
  return { slots, attempts, gaveUp, succeeded: finished.length, last: finished.length ? Math.max(...finished) : 0 };
}

export function BackoffJitter() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [strategy, setStrategy] = useState("jitter");
  const [base, setBase] = useState(200);
  const [cap, setCap] = useState(8000);
  const [maxAttempts, setMaxAttempts] = useState(6);
  const result = useMemo(() => simulateRetries(strategy, base, cap, maxAttempts), [strategy, base, cap, maxAttempts]);
  const [t, setT] = useSweep(playback, 5200, { hold: 2600 });
  useEffect(() => { setT(0); }, [strategy, base, cap, maxAttempts, setT]);

  const W = 700;
  const H = 190;
  // The opening burst (every client at once) dwarfs everything after it, so
  // the axis stops at 3× capacity and taller bars are clipped with their
  // real height printed above, one label per burst.
  const yMax = SLOT_CAPACITY * 3;
  const y = scale(0, yMax, H - 26, 22);
  const barW = (W - 60) / SLOTS;
  const shownSlots = Math.floor(t * SLOTS);
  const overflowLabels = [];
  result.slots.slice(0, shownSlots).forEach((slot, index) => {
    const total = slot.ok + slot.fail;
    if (total <= yMax) return;
    const x = 44 + index * barW + barW / 2;
    const last = overflowLabels[overflowLabels.length - 1];
    if (last && x - last.x < 22) { if (total > last.total) Object.assign(last, { total }); return; }
    overflowLabels.push({ x, total });
  });

  return (
    <FigureFrame
      kind="Simulation"
      title="50 clients throttled at once: retry storms vs jittered backoff"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={strategy === "none"
        ? "Immediate retries arrive together and keep exceeding capacity: a retry storm that turns a blip into an outage."
        : strategy === "exp"
          ? "Exponential backoff waits longer each time, but clients that failed together still retry together: synchronized spikes."
          : "Full jitter spreads each retry randomly over [0, min(cap, base × 2ⁿ)], so load stays under capacity and everyone finishes sooner. Never retry a 400 or a 403."}
    >
      <Controls>
        <Segmented label="Retry strategy" value={strategy} onChange={setStrategy} options={[
          { id: "none", label: "Immediate retry" }, { id: "exp", label: "Exponential" }, { id: "jitter", label: "Exponential + full jitter" },
        ]} />
        <Slider label="Base delay" value={base} min={50} max={1000} step={50} onChange={setBase} format={(v) => `${v} ms`} />
        <Slider label="Cap" value={cap} min={1000} max={20000} step={1000} onChange={setCap} format={(v) => `${v / 1000} s`} />
        <Slider label="Max attempts" value={maxAttempts} min={2} max={8} onChange={setMaxAttempts} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <GridY x0={44} x1={W - 16} ticks={[0, SLOT_CAPACITY, SLOT_CAPACITY * 2, yMax]} y={y} />
        {result.slots.slice(0, shownSlots).map((slot, index) => {
          const x0 = 44 + index * barW;
          const ok = Math.min(slot.ok, yMax);
          const total = Math.min(slot.ok + slot.fail, yMax);
          return (
            <g key={index}>
              <rect x={x0} y={y(ok)} width={Math.max(1, barW - 1)} height={y(0) - y(ok)} style={{ fill: "var(--aipf-ok)" }} />
              <rect x={x0} y={y(total)} width={Math.max(1, barW - 1)} height={y(ok) - y(total)} style={{ fill: "var(--aipf-bad)" }} />
            </g>
          );
        })}
        {overflowLabels.map((label) => (
          <text key={label.x} x={label.x} y={y(yMax) - 5} textAnchor="middle" className="aipf-mono aipf-small">{label.total}</text>
        ))}
        <line x1="44" x2={W - 16} y1={y(SLOT_CAPACITY)} y2={y(SLOT_CAPACITY)} className="aipf-limit is-ok" />
        <text x={W - 18} y={y(SLOT_CAPACITY) - 5} textAnchor="end" className="aipf-mono aipf-limit-text">capacity per 100 ms</text>
        <text x="44" y={H - 8} className="aipf-small">0 s</text>
        <text x={W - 16} y={H - 8} textAnchor="end" className="aipf-small">12 s</text>
      </svg>
      <div className="aipf-legend">
        <span><i style={{ background: "var(--aipf-ok)" }} />admitted</span>
        <span><i style={{ background: "var(--aipf-bad)" }} />throttled (429)</span>
      </div>
      <div className="aipf-stats">
        <Stat label="Succeeded" value={`${result.succeeded}/${CLIENTS}`} tone={result.succeeded === CLIENTS ? "ok" : "bad"} />
        <Stat label="Total attempts" value={result.attempts} />
        <Stat label="Gave up" value={result.gaveUp} tone={result.gaveUp ? "bad" : undefined} />
        <Stat label="All done by" value={result.succeeded ? `${fmt(result.last / 1000, 1)} s` : "—"} />
      </div>
    </FigureFrame>
  );
}

/* ── circuit breaker ───────────────────────────────────────────────────── */

const REQUESTS = 64;

function simulateBreaker(outage, threshold, openFor, fallback) {
  const rand = seeded(9);
  let state = "closed";
  let failures = 0;
  let openedAt = 0;
  return Array.from({ length: REQUESTS }, (_, index) => {
    const down = outage && index >= 10 && index < 40;
    const fails = down ? true : rand() < 0.04;
    if (state === "open" && index - openedAt >= openFor) state = "half";
    if (state === "open") return { index, state, kind: fallback ? "fallback" : "rejected" };
    if (fails) {
      failures += 1;
      if (state === "half" || failures >= threshold) {
        const from = state;
        state = "open";
        openedAt = index;
        failures = 0;
        return { index, state: from, kind: "fail", tripped: true };
      }
      return { index, state, kind: "fail" };
    }
    const from = state;
    failures = 0;
    state = "closed";
    return { index, state: from, kind: from === "half" ? "trial" : "ok" };
  });
}

const BREAKER_STATES = [
  { id: "closed", label: "CLOSED", x: 110 },
  { id: "open", label: "OPEN", x: 350 },
  { id: "half", label: "HALF-OPEN", x: 590 },
];

export function CircuitBreaker() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [outage, setOutage] = useState(true);
  const [threshold, setThreshold] = useState(3);
  const [openFor, setOpenFor] = useState(8);
  const [fallback, setFallback] = useState(true);
  const events = useMemo(() => simulateBreaker(outage, threshold, openFor, fallback), [outage, threshold, openFor, fallback]);
  const [t, setT] = useSweep(playback, 8000, { hold: 2400 });
  useEffect(() => { setT(0); }, [outage, threshold, openFor, fallback, setT]);
  const shown = Math.min(REQUESTS, Math.floor(t * REQUESTS) + 1);
  const current = events[shown - 1];
  const currentState = current.kind === "fallback" || current.kind === "rejected" ? "open" : current.tripped ? "open" : current.state === "half" ? "half" : "closed";
  const failed = events.filter((event) => event.kind === "fail").length;
  const shielded = events.filter((event) => event.kind === "fallback" || event.kind === "rejected").length;

  return (
    <FigureFrame
      kind="Simulation"
      title="A circuit breaker stops calling a dependency that is down"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={`During the outage only ${failed} calls reach the failing model; ${shielded} are short-circuited${fallback ? " to the fallback model" : " with a fast error"} instead of waiting on timeouts. In Step Functions the pattern keeps the circuit status, with an expiry time, in DynamoDB.`}
    >
      <Controls>
        <Toggle label="Model A outage (requests 10–40)" checked={outage} onChange={setOutage} />
        <Slider label="Failures to open" value={threshold} min={2} max={8} onChange={setThreshold} />
        <Slider label="Stay open for" value={openFor} min={3} max={16} onChange={setOpenFor} format={(v) => `${v} requests`} />
        <Toggle label="Fallback to model B" checked={fallback} onChange={setFallback} />
      </Controls>
      <svg viewBox="0 0 700 180" className="aipf-svg">
        <defs>
          <marker id="aipf-cb-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--aipf-edge)" }} />
          </marker>
        </defs>
        <path d="M156 34 Q230 6 304 34" className="aipf-edge-plain" markerEnd="url(#aipf-cb-arrow)" />
        <text x="230" y="14" textAnchor="middle" className="aipf-small">{threshold} failures</text>
        <path d="M396 34 Q470 6 544 34" className="aipf-edge-plain" markerEnd="url(#aipf-cb-arrow)" />
        <text x="470" y="14" textAnchor="middle" className="aipf-small">after {openFor}</text>
        <path d="M546 66 Q470 92 398 66" className="aipf-edge-plain" markerEnd="url(#aipf-cb-arrow)" />
        <text x="470" y="98" textAnchor="middle" className="aipf-small">trial fails</text>
        <path d="M590 72 Q350 136 112 72" className="aipf-edge-plain" markerEnd="url(#aipf-cb-arrow)" />
        <text x="350" y="118" textAnchor="middle" className="aipf-small">trial succeeds</text>
        {BREAKER_STATES.map((state) => (
          <g key={state.id} className={`aipf-state${currentState === state.id ? " is-on" : ""} is-${state.id}`}>
            <rect x={state.x - 46} y="30" width="92" height="40" rx="20" />
            <text x={state.x} y="55" textAnchor="middle">{state.label}</text>
          </g>
        ))}
        {events.slice(0, shown).map((event) => (
          <circle key={event.index} cx={14 + event.index * 10.7} cy="160" r="4"
            className={`aipf-req is-${event.kind}`} />
        ))}
      </svg>
      <div className="aipf-legend">
        <span><i style={{ background: "var(--aipf-ok)" }} />model A ok</span>
        <span><i style={{ background: "var(--aipf-bad)" }} />model A failed</span>
        <span><i style={{ background: "var(--aipf-warn)" }} />{fallback ? "served by model B" : "fast-failed"}</span>
        <span><i style={{ background: "transparent", border: "1.6px solid var(--aipf-ok)", borderRadius: 99 }} />half-open trial</span>
      </div>
      <div className="aipf-stats">
        <Stat label="Calls to failing model" value={failed} tone={failed > 10 ? "bad" : "ok"} />
        <Stat label="Short-circuited" value={shielded} />
        <Stat label="State now" value={BREAKER_STATES.find((state) => state.id === currentState).label} />
      </div>
    </FigureFrame>
  );
}

/* ── SQS buffer ────────────────────────────────────────────────────────── */

const SECONDS = 120;
const WORK_SECONDS = 1.5;

function simulateQueue(direct, concurrency, maxReceive) {
  const arrivals = Array.from({ length: SECONDS }, (_, second) => 3 + (second >= 20 && second < 30 ? 25 : 0));
  const rate = concurrency / WORK_SECONDS;
  let depth = 0;
  let dlq = 0;
  let carry = 0;
  let maxAge = 0;
  const poisonFailures = [0, 0, 0, 0];
  const series = [];
  let throttled = 0;
  const backlogStart = [];
  for (let second = 0; second < SECONDS; second += 1) {
    const incoming = arrivals[second];
    if (direct) {
      const served = Math.min(incoming, rate);
      throttled += incoming - served;
      series.push({ depth: 0, served, dlq: 0 });
      continue;
    }
    depth += incoming;
    for (let i = 0; i < incoming; i += 1) backlogStart.push(second);
    carry += rate;
    let capacity = Math.floor(carry);
    carry -= capacity;
    // Poison messages: received at second 25, fail every 10 s visibility timeout.
    if (second >= 25 && second % 10 === 5) {
      poisonFailures.forEach((count, index) => {
        if (count < maxReceive && capacity > 0) {
          capacity -= 1;
          poisonFailures[index] += 1;
          if (poisonFailures[index] >= maxReceive) dlq += 1;
        }
      });
    }
    const served = Math.min(depth, capacity);
    depth -= served;
    backlogStart.splice(0, served);
    if (backlogStart.length) maxAge = Math.max(maxAge, second - backlogStart[0]);
    series.push({ depth, served, dlq });
  }
  const drained = series.findIndex((point, index) => index > 30 && point.depth === 0);
  return { series, throttled: Math.round(throttled), maxAge, drained, dlq, peak: Math.max(...series.map((point) => point.depth)) };
}

export function QueueBuffer() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [direct, setDirect] = useState(false);
  const [concurrency, setConcurrency] = useState(6);
  const [maxReceive, setMaxReceive] = useState(3);
  const result = useMemo(() => simulateQueue(direct, concurrency, maxReceive), [direct, concurrency, maxReceive]);
  const [t, setT] = useSweep(playback, 6500, { hold: 2600 });
  useEffect(() => { setT(0); }, [direct, concurrency, maxReceive, setT]);

  const W = 700;
  const H = 200;
  const x = scale(0, SECONDS - 1, 50, W - 16);
  const yMax = Math.max(60, result.peak * 1.1);
  const y = scale(0, yMax, H - 24, 10);
  const upto = Math.floor(t * (SECONDS - 1));
  const pts = result.series.slice(0, upto + 1).map((point, second) => [x(second), y(point.depth)]);

  return (
    <FigureFrame
      kind="Simulation"
      title="A queue absorbs the burst; a dead-letter queue catches poison messages"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={direct
        ? `Without a buffer, a burst of 28 requests a second meets ${fmt(concurrency / WORK_SECONDS, 1)} per second of model capacity: ${fmt(result.throttled)} requests are rejected and must be retried by the caller.`
        : `The burst waits in SQS (peak ${fmt(result.peak)} messages) and drains ${result.drained > 0 ? `by ${result.drained} s` : "slowly"}. Alarm on ApproximateAgeOfOldestMessage (${result.maxAge} s here). Messages that fail ${maxReceive}× move to the DLQ instead of looping forever.`}
    >
      <Controls>
        <Segmented label="Integration" value={direct ? "direct" : "queue"} onChange={(value) => setDirect(value === "direct")} options={[{ id: "queue", label: "SQS queue" }, { id: "direct", label: "Direct calls" }]} />
        <Slider label="Lambda concurrency" value={concurrency} min={1} max={20} onChange={setConcurrency} />
        {!direct ? <Slider label="maxReceiveCount" value={maxReceive} min={1} max={5} onChange={setMaxReceive} /> : null}
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <rect x={x(20)} y="10" width={x(30) - x(20)} height={H - 34} className="aipf-band" />
        <text x={(x(20) + x(30)) / 2} y="22" textAnchor="middle" className="aipf-small">burst</text>
        <GridY x0={50} x1={W - 16} ticks={[0, Math.round(yMax / 2 / 10) * 10]} y={y} />
        {!direct ? <path d={pts.length > 1 ? `${linePath(pts)}L${pts[pts.length - 1][0]},${y(0)}L${pts[0][0]},${y(0)}Z` : ""} className="aipf-area" style={{ fill: `color-mix(in srgb, ${KIND_COLOR.integration} 22%, transparent)` }} /> : null}
        {!direct ? <path d={linePath(pts)} className="aipf-line is-on" style={{ stroke: KIND_COLOR.integration }} /> : null}
        {direct ? result.series.slice(0, upto + 1).map((point, second) => (second >= 20 && second < 30 ? (
          <rect key={second} x={x(second)} y={y(28 - point.served)} width={x(1) - x(0) - 1} height={y(0) - y(28 - point.served)} style={{ fill: "var(--aipf-bad)" }} opacity="0.75" />
        ) : null)) : null}
        <text x="50" y={H - 6} className="aipf-small">0 s</text>
        <text x={W - 16} y={H - 6} textAnchor="end" className="aipf-small">{SECONDS} s</text>
      </svg>
      <div className="aipf-stats">
        {direct ? <Stat label="Rejected (429)" value={fmt(result.throttled)} tone="bad" /> : <Stat label="Peak queue depth" value={fmt(result.peak)} />}
        {!direct ? <Stat label="Oldest message age" value={`${result.maxAge} s`} tone={result.maxAge > 60 ? "warn" : undefined} /> : null}
        {!direct ? <Stat label="In the DLQ" value={result.dlq} tone={result.dlq ? "warn" : undefined} sub="poison messages" /> : null}
      </div>
    </FigureFrame>
  );
}

/* ── Kinesis shards ────────────────────────────────────────────────────── */

const KEY_MODES = {
  order: { label: "order_id", spread: (n) => Array.from({ length: n }, () => 1 / n) },
  region: { label: "region (4 values)", spread: (n) => Array.from({ length: n }, (_, i) => (i < Math.min(4, n) ? 1 / Math.min(4, n) : 0)) },
  single: { label: "one constant key", spread: (n) => Array.from({ length: n }, (_, i) => (i === 0 ? 1 : 0)) },
};

export function KinesisShards() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [rps, setRps] = useState(1500);
  const [sizeKB, setSizeKB] = useState(2);
  const [consumers, setConsumers] = useState(2);
  const [efo, setEfo] = useState(false);
  const [keyMode, setKeyMode] = useState("order");
  const [phase] = useSweep(playback, 1800, { hold: 0 });

  const writeMiB = (rps * sizeKB) / 1024;
  const byWrite = Math.max(writeMiB / 1, rps / 1000);
  const byRead = efo ? writeMiB / 2 : (writeMiB * consumers) / 2;
  const shards = Math.max(1, Math.ceil(Math.max(byWrite, byRead)));
  const shares = KEY_MODES[keyMode].spread(shards);
  const lanes = shares.map((share) => ({ write: (writeMiB * share) / 1, records: (rps * share) / 1000 }));
  const hot = lanes.filter((lane) => Math.max(lane.write, lane.records) > 1).length;
  const shown = lanes.slice(0, 10);

  return (
    <FigureFrame
      kind="Simulation"
      title="Size a Kinesis stream, then watch the partition key decide where load lands"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} />}
      caption={hot
        ? `${hot} shard${hot === 1 ? " is" : "s are"} over the 1 MB/s or 1,000 records/s write limit: WriteProvisionedThroughputExceeded. More shards do not help a hot key; a high-cardinality partition key does.`
        : `${shards} shard${shards === 1 ? "" : "s"} = ceiling(max(write MiB/s ÷ 1, records/s ÷ 1,000, read MiB/s ÷ 2)). ${efo ? "Enhanced fan-out gives each consumer its own 2 MB/s per shard." : "Without enhanced fan-out, all consumers share 2 MB/s per shard."}`}
    >
      <Controls>
        <Slider label="Records per second" value={rps} min={100} max={10000} step={100} onChange={setRps} />
        <Slider label="Record size" value={sizeKB} min={0.5} max={20} step={0.5} onChange={setSizeKB} format={(v) => `${v} KB`} />
        <Slider label="Consumers" value={consumers} min={1} max={5} onChange={setConsumers} />
        <Toggle label="Enhanced fan-out" checked={efo} onChange={setEfo} />
        <Segmented label="Partition key" value={keyMode} onChange={setKeyMode} options={Object.entries(KEY_MODES).map(([id, item]) => ({ id, label: item.label }))} />
      </Controls>
      <svg viewBox={`0 0 700 ${shown.length * 26 + 12}`} className="aipf-svg">
        {shown.map((lane, index) => {
          const load = Math.max(lane.write, lane.records);
          const y0 = 6 + index * 26;
          const dots = Math.min(8, Math.round(load * 6));
          return (
            <g key={index}>
              <text x="70" y={y0 + 15} textAnchor="end" className="aipf-mono aipf-small">shard {index + 1}</text>
              <rect x="80" y={y0 + 3} width="520" height="17" rx="8" className="aipf-track" />
              <rect x="80" y={y0 + 3} width={Math.min(520, 520 * load)} height="17" rx="8" className={`aipf-fill${load > 1 ? " is-bad" : load > 0.8 ? " is-wait" : " is-ok"}`} />
              {Array.from({ length: dots }, (_, d) => (
                <circle key={d} cx={80 + (((phase + d / dots) % 1) * 520)} cy={y0 + 11.5} r="2.6" className="aipf-flow-dot" />
              ))}
              <text x="610" y={y0 + 15} className="aipf-mono aipf-small">{Math.round(load * 100)}%</text>
            </g>
          );
        })}
      </svg>
      {lanes.length > shown.length ? <p className="aipf-muted aipf-note">+{lanes.length - shown.length} more shards</p> : null}
      <div className="aipf-stats">
        <Stat label="Shards needed" value={shards} />
        <Stat label="Write" value={`${fmt(writeMiB, 2)} MiB/s`} />
        <Stat label="Hot shards" value={hot} tone={hot ? "bad" : "ok"} />
      </div>
    </FigureFrame>
  );
}

/* ── target-tracking autoscaling ───────────────────────────────────────── */

const LOAD = (() => {
  const rand = seeded(23);
  return Array.from({ length: 144 }, (_, i) => {
    const hour = i / 6;
    const day = Math.max(0, Math.sin(((hour - 6) / 24) * Math.PI * 2));
    return Math.round(400 + 4200 * day ** 1.6 + rand() * 300 + (hour > 12 && hour < 13 ? 1400 : 0));
  });
})();

function simulateScaling(target, minCap, maxCap, scheduled) {
  let capacity = minCap;
  let lastScaleIn = -99;
  return LOAD.map((load, index) => {
    const hour = index / 6;
    const floor = scheduled && hour >= 8 && hour < 18 ? Math.max(minCap, 6) : minCap;
    const desired = clamp(Math.ceil(load / target), floor, maxCap);
    if (desired > capacity) capacity = desired;
    else if (desired < capacity && index - lastScaleIn >= 3) { capacity -= 1; lastScaleIn = index; }
    capacity = Math.max(capacity, floor);
    return { load, capacity };
  });
}

export function AutoscaleTarget() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [target, setTarget] = useState(600);
  const [minCap, setMinCap] = useState(1);
  const [maxCap, setMaxCap] = useState(10);
  const [scheduled, setScheduled] = useState(false);
  const series = useMemo(() => simulateScaling(target, minCap, maxCap, scheduled), [target, minCap, maxCap, scheduled]);
  const [t, setT] = useSweep(playback, 7000, { hold: 2600 });
  useEffect(() => { setT(0); }, [target, minCap, maxCap, scheduled, setT]);

  const W = 700;
  const H = 210;
  const x = scale(0, 143, 50, W - 16);
  const yMax = Math.max(...LOAD, ...series.map((point) => point.capacity * target)) * 1.05;
  const y = scale(0, yMax, H - 70, 10);
  const yInst = scale(0, maxCap, H - 22, H - 62);
  const upto = Math.floor(t * 143);
  const view = series.slice(0, upto + 1);
  const overMinutes = series.filter((point) => point.load > point.capacity * target).length * 10;
  const instanceHours = series.reduce((sum, point) => sum + point.capacity, 0) / 6;

  return (
    <FigureFrame
      kind="Simulation"
      title="Target tracking: keep invocations per instance near a target"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={`Scale-out is quick; scale-in is deliberately slower so a brief dip does not remove capacity you need a minute later. ${overMinutes ? `Load exceeded capacity for ${overMinutes} minutes${scheduled ? "" : ": a scheduled action can pre-scale for the known morning ramp"}.` : "Capacity kept up with every peak."} Don't edit the alarms the policy manages.`}
    >
      <Controls>
        <Slider label="Target invocations / instance" value={target} min={200} max={1500} step={50} onChange={setTarget} />
        <Slider label="Min capacity" value={minCap} min={1} max={4} onChange={setMinCap} />
        <Slider label="Max capacity" value={maxCap} min={4} max={20} onChange={setMaxCap} />
        <Toggle label="Scheduled action: min 6 from 08:00 to 18:00" checked={scheduled} onChange={setScheduled} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <path d={linePath(view.map((point, index) => [x(index), y(point.capacity * target)]))}
          className="aipf-line is-on" style={{ stroke: "var(--aipf-ok)", strokeDasharray: "5 4" }} />
        <path d={linePath(view.map((point, index) => [x(index), y(point.load)]))} className="aipf-line is-on" style={{ stroke: KIND_COLOR.client }} />
        {view.map((point, index) => (point.load > point.capacity * target ? (
          <rect key={index} x={x(index)} y={y(point.load)} width={Math.max(1, x(1) - x(0))} height={y(point.capacity * target) - y(point.load)} style={{ fill: "var(--aipf-bad)" }} opacity="0.35" />
        ) : null))}
        <path d={linePath(view.flatMap((point, index) => [[x(index), yInst(point.capacity)], [x(index + 1), yInst(point.capacity)]]))} className="aipf-line is-on" style={{ stroke: KIND_COLOR.compute }} />
        <text x="46" y={yInst(maxCap) + 4} textAnchor="end" className="aipf-mono aipf-small">{maxCap}</text>
        <text x="46" y={yInst(0) + 4} textAnchor="end" className="aipf-mono aipf-small">0</text>
        <text x="54" y={yInst(maxCap) - 4} className="aipf-small">instances</text>
        {[0, 6, 12, 18, 24].map((hour) => <text key={hour} x={x(Math.min(143, hour * 6))} y="206" textAnchor="middle" className="aipf-small">{String(hour).padStart(2, "0")}:00</text>)}
      </svg>
      <div className="aipf-legend">
        <span><i style={{ background: KIND_COLOR.client }} />load (invocations/min)</span>
        <span><i style={{ background: "var(--aipf-ok)" }} />capacity × target</span>
        <span><i style={{ background: KIND_COLOR.compute }} />instances</span>
      </div>
      <div className="aipf-stats">
        <Stat label="Minutes over capacity" value={overMinutes} tone={overMinutes ? "warn" : "ok"} />
        <Stat label="Instance-hours" value={fmt(instanceHours, 1)} />
      </div>
    </FigureFrame>
  );
}

