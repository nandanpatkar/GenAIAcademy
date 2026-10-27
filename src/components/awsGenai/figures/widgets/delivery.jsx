import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Controls, FigureFrame, GridY, PlayControls, Segmented, Slider, Stat, Toggle,
  KIND_COLOR, fmt, linePath, scale, usePlayback, useSweep,
} from "../kit";

/* Delivery widgets: safe rollouts, DNS routing, edge rate limiting, and the
   exam blueprint itself. */

/* ── traffic shifting ──────────────────────────────────────────────────── */

const SHIFT_PRESETS = {
  sagemaker: {
    title: "SageMaker deployment guardrails: shift traffic, bake, roll back on an alarm",
    strategies: {
      all: { label: "All at once", steps: [[1, 100]] },
      canary: { label: "Canary 20%", steps: [[1, 20], [7, 100]] },
      linear: { label: "Linear 25% / 3 min", steps: [[1, 25], [4, 50], [7, 75], [10, 100]] },
    },
    note: "Blue/green on a real-time or asynchronous endpoint: a canary is at most 50% of the green fleet, every step bakes while CloudWatch alarms watch, and the old fleet stays until TerminationWaitInSeconds.",
  },
  codedeploy: {
    title: "CodeDeploy shifts a Lambda alias between versions",
    strategies: {
      all: { label: "AllAtOnce", steps: [[1, 100]] },
      canary: { label: "Canary10Percent5Minutes", steps: [[1, 10], [6, 100]] },
      linear: { label: "Linear10PercentEvery1Minute", steps: Array.from({ length: 10 }, (_, i) => [1 + i, (i + 1) * 10]) },
    },
    note: "Lambda and ECS deployments are always blue/green: the alias weights move traffic, a BeforeAllowTraffic hook can test the new version first, and an alarm rolls the alias back.",
  },
  appconfig: {
    title: "AppConfig rolls a configuration change out gradually",
    strategies: {
      all: { label: "AllAtOnce", steps: [[1, 100]] },
      canary: { label: "Canary10Percent20Minutes", steps: [[1, 10], [3, 21], [5, 33], [7, 46], [9, 61], [11, 77], [13, 100]] },
      linear: { label: "Linear50PercentEvery30Seconds", steps: [[1, 50], [1.5, 100]] },
    },
    note: "The same model switch, done as configuration: targets pick up the new value gradually, then the change bakes; an alarm during rollout or bake time rolls the configuration back automatically.",
  },
};
const SHIFT_MINUTES = 20;
const ALARM_DELAY = 2;

function shareAt(steps, minute) {
  let share = 0;
  steps.forEach(([at, value]) => { if (minute >= at) share = value; });
  return share;
}

export function TrafficShift({ config = {} }) {
  const preset = SHIFT_PRESETS[config.preset] || SHIFT_PRESETS.sagemaker;
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [strategy, setStrategy] = useState("canary");
  const [bad, setBad] = useState(false);
  const [t, setT] = useSweep(playback, 7000, { hold: 2600 });
  useEffect(() => { setT(0); }, [strategy, bad, setT]);

  const steps = preset.strategies[strategy].steps;
  // A bad release raises the new version's error rate at once; the alarm
  // needs ~2 minutes of datapoints to fire, whatever share it is serving.
  // So the strategy decides how many users meet the bad version, not when.
  const timeline = useMemo(() => {
    const points = [];
    let exposure = 0;
    const firstServed = steps[0][0];
    const rolledBack = bad ? firstServed + ALARM_DELAY : null;
    for (let step = 0; step <= SHIFT_MINUTES * 10; step += 1) {
      const minute = step / 10;
      let share = shareAt(steps, minute);
      if (rolledBack !== null && minute >= rolledBack) share = 0;
      else if (bad) exposure += share * 0.1;
      points.push({ minute, share });
    }
    return { points, rolledBack, exposure: Math.round(exposure) };
  }, [steps, bad]);

  const now = t * SHIFT_MINUTES;
  const current = timeline.points[Math.min(timeline.points.length - 1, Math.round(now * 10))];
  const W = 700;
  const H = 150;
  const x = scale(0, SHIFT_MINUTES, 50, W - 16);
  const y = scale(0, 100, H - 22, 10);
  const view = timeline.points.filter((point) => point.minute <= now);
  const finished = steps[steps.length - 1][0];

  return (
    <FigureFrame
      kind="Simulation"
      title={preset.title}
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={bad
        ? `The alarm fired at minute ${fmt(timeline.rolledBack, 1)} and traffic went back to the old version. ${strategy === "all"
          ? "All-at-once sent every user to the bad version while the alarm gathered its datapoints."
          : "Only the first slice of traffic met the bad release: that is what canary and linear steps buy you."}`
        : preset.note}
    >
      <Controls>
        <Segmented label="Strategy" value={strategy} onChange={setStrategy} options={Object.entries(preset.strategies).map(([id, item]) => ({ id, label: item.label }))} />
        <Toggle label="The new version is bad (alarm will fire)" checked={bad} onChange={setBad} />
      </Controls>
      <div className="aipf-shift">
        <div className="aipf-shift-fleet is-blue">
          <b>Current version</b>
          <span>{100 - current.share}%</span>
          <i style={{ width: `${100 - current.share}%` }} />
        </div>
        <div className={`aipf-shift-fleet is-green${bad && current.share > 0 ? " is-bad" : ""}`}>
          <b>New version</b>
          <span>{current.share}%</span>
          <i style={{ width: `${current.share}%` }} />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <GridY x0={50} x1={W - 16} ticks={[0, 50, 100]} y={y} format={(v) => `${v}%`} />
        <path d={linePath(view.map((point) => [x(point.minute), y(point.share)]))} className="aipf-line is-on" style={{ stroke: KIND_COLOR.storage }} />
        {timeline.rolledBack !== null && now >= timeline.rolledBack ? (
          <g>
            <line x1={x(timeline.rolledBack)} x2={x(timeline.rolledBack)} y1="8" y2={H - 22} className="aipf-limit is-bad" />
            <text x={x(timeline.rolledBack) + 6} y="22" className="aipf-mono aipf-limit-text aipf-bad">ALARM → rollback</text>
          </g>
        ) : null}
        <line x1={x(now)} x2={x(now)} y1="8" y2={H - 22} className="aipf-cursor-line" />
        <text x="50" y={H - 6} className="aipf-small">0 min</text>
        <text x={W - 16} y={H - 6} textAnchor="end" className="aipf-small">{SHIFT_MINUTES} min</text>
      </svg>
      <div className="aipf-stats">
        <Stat label="New version share" value={`${current.share}%`} />
        <Stat label="Fully shifted at" value={bad ? "—" : `${finished} min`} />
        {bad ? <Stat label="Exposure before rollback" value={`${timeline.exposure} %·min`} tone={timeline.exposure > 100 ? "bad" : "warn"} sub="share × minutes" /> : null}
      </div>
    </FigureFrame>
  );
}

/* ── Route 53 routing policies ─────────────────────────────────────────── */

const R53_USERS = [
  { id: "na", label: "North America", x: 120, y: 90 },
  { id: "sa", label: "South America", x: 170, y: 210 },
  { id: "eu", label: "Europe", x: 360, y: 70 },
  { id: "asia", label: "Asia", x: 560, y: 110 },
];
const R53_ENDPOINTS = [
  { id: "use1", label: "us-east-1", x: 200, y: 140 },
  { id: "euw1", label: "eu-west-1", x: 390, y: 150 },
  { id: "apse1", label: "ap-southeast-1", x: 590, y: 200 },
];
const LATENCY_ORDER = { na: ["use1", "euw1", "apse1"], sa: ["use1", "euw1", "apse1"], eu: ["euw1", "use1", "apse1"], asia: ["apse1", "euw1", "use1"] };

function route53Target(policy, user, unhealthy, roll) {
  const healthy = (id) => !(unhealthy && id === "use1");
  if (policy === "simple") return "use1";
  if (policy === "weighted") {
    const pick = roll < 0.7 ? "use1" : "euw1";
    return healthy(pick) ? pick : "euw1";
  }
  if (policy === "latency") return LATENCY_ORDER[user].find(healthy);
  if (policy === "failover") return healthy("use1") ? "use1" : "euw1";
  return user === "eu" ? "euw1" : user === "asia" ? "apse1" : "use1";
}

const R53_COPY = {
  simple: "Simple routing returns the record with no health checks. When the endpoint dies, users keep getting it.",
  weighted: "Weighted routing splits traffic by ratio (70/30 here): good for canary-style tests across endpoints. Health checks remove an unhealthy one.",
  latency: "Latency routing sends each user to the Region with the lowest measured latency, and skips unhealthy endpoints.",
  failover: "Failover routing serves the primary while its health check passes and switches to the secondary when it fails.",
  geolocation: "Geolocation routing chooses by where the user is, not by speed: for example keep EU users in the EU.",
};

export function Route53Routing() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [policy, setPolicy] = useState("latency");
  const [unhealthy, setUnhealthy] = useState(false);
  const [t] = useSweep(playback, 2600, { hold: 0 });

  const packets = R53_USERS.flatMap((user, u) => Array.from({ length: 3 }, (_, k) => {
    const roll = ((u * 3 + k) * 0.37) % 1;
    const target = route53Target(policy, user.id, unhealthy, roll);
    const end = R53_ENDPOINTS.find((endpoint) => endpoint.id === target);
    const phase = (t + k / 3) % 1;
    return { key: `${user.id}-${k}`, user, end, phase, dead: unhealthy && target === "use1" };
  }));

  return (
    <FigureFrame
      kind="Animation"
      title="Five Route 53 routing policies, one set of users"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} />}
      caption={`${R53_COPY[policy]} DNS answers are cached for the record's TTL, so failover is never instant.`}
    >
      <Controls>
        <Segmented label="Policy" value={policy} onChange={setPolicy} options={["simple", "weighted", "latency", "failover", "geolocation"].map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1) }))} />
        <Toggle label="us-east-1 fails its health check" checked={unhealthy} onChange={setUnhealthy} />
      </Controls>
      <svg viewBox="0 0 700 260" className="aipf-svg">
        <rect x="10" y="10" width="680" height="240" rx="14" className="aipf-map" />
        {R53_USERS.map((user) => (
          <g key={user.id} className="aipf-r53-user">
            <circle cx={user.x} cy={user.y} r="16" />
            <text x={user.x} y={user.y - 22} textAnchor="middle" className="aipf-small">{user.label}</text>
          </g>
        ))}
        {R53_ENDPOINTS.map((endpoint) => {
          const down = unhealthy && endpoint.id === "use1";
          return (
            <g key={endpoint.id} className={`aipf-r53-end${down ? " is-down" : ""}`}>
              <rect x={endpoint.x - 52} y={endpoint.y - 15} width="104" height="30" rx="8" />
              <text x={endpoint.x} y={endpoint.y + 4} textAnchor="middle" className="aipf-mono">{endpoint.label}</text>
            </g>
          );
        })}
        {packets.map((packet) => {
          const px = packet.user.x + (packet.end.x - packet.user.x) * packet.phase;
          const py = packet.user.y + (packet.end.y - packet.user.y) * packet.phase;
          return (
            <g key={packet.key}>
              <line x1={packet.user.x} y1={packet.user.y} x2={packet.end.x} y2={packet.end.y} className={`aipf-r53-path${packet.dead ? " is-dead" : ""}`} />
              <circle cx={px} cy={py} r="4" className={`aipf-r53-dot${packet.dead ? " is-dead" : ""}`} />
            </g>
          );
        })}
      </svg>
    </FigureFrame>
  );
}

/* ── WAF rate-based rule ───────────────────────────────────────────────── */

const WAF_IPS = [
  { id: "user-a", rate: 0.2, label: "user A", color: KIND_COLOR.client },
  { id: "user-b", rate: 0.5, label: "user B", color: KIND_COLOR.ai },
  { id: "user-c", rate: 1.2, label: "power user", color: KIND_COLOR.network },
  { id: "bot", rate: 20, start: 180, label: "bot", color: "var(--aipf-bad)" },
];
const WAF_SECONDS = 900;

function simulateWaf(windowS, limit, countOnly) {
  const step = 10;
  return WAF_IPS.map((ip) => {
    const series = [];
    let blockedRequests = 0;
    let total = 0;
    for (let s = 0; s <= WAF_SECONDS; s += step) {
      const active = s >= (ip.start || 0);
      const perStep = active ? ip.rate * step : 0;
      const since = Math.max(ip.start || 0, s - windowS);
      const windowCount = Math.max(0, (s - since) * (active ? ip.rate : 0));
      const blocked = !countOnly && windowCount > limit;
      total += perStep;
      if (blocked) blockedRequests += perStep;
      series.push({ s, windowCount, blocked });
    }
    return { ...ip, series, blockedShare: total ? blockedRequests / total : 0 };
  });
}

export function WafRate() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [windowS, setWindowS] = useState(300);
  const [limit, setLimit] = useState(1000);
  const [countOnly, setCountOnly] = useState(false);
  const ips = useMemo(() => simulateWaf(windowS, limit, countOnly), [windowS, limit, countOnly]);
  const [t, setT] = useSweep(playback, 6500, { hold: 2600 });
  useEffect(() => { setT(0); }, [windowS, limit, countOnly, setT]);

  const W = 700;
  const H = 200;
  const x = scale(0, WAF_SECONDS, 56, W - 16);
  const yMax = Math.max(limit * 1.6, 600);
  const y = scale(0, yMax, H - 24, 10);
  const upto = t * WAF_SECONDS;
  const bot = ips.find((ip) => ip.id === "bot");
  const legitBlocked = ips.filter((ip) => ip.id !== "bot" && ip.blockedShare > 0);

  return (
    <FigureFrame
      kind="Simulation"
      title="An AWS WAF rate-based rule counts each IP over a sliding window"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={countOnly
        ? "Count mode records what the rule would block without blocking anything: the safe way to tune a limit on real traffic."
        : legitBlocked.length
          ? `The limit is too low: ${legitBlocked.map((ip) => ip.label).join(" and ")} got blocked too. Size the limit from real per-client traffic, and use usage plans for per-customer quotas.`
          : `The bot crosses ${fmt(limit)} requests per ${windowS / 60}-minute window and is blocked while it stays above it; normal users never come close. Rate limiting is approximate, not exact.`}
    >
      <Controls>
        <Segmented label="Evaluation window" value={windowS} onChange={setWindowS} options={[60, 120, 300, 600].map((value) => ({ id: value, label: `${value} s` }))} />
        <Slider label="Limit per window" value={limit} min={10} max={3000} step={10} onChange={setLimit} />
        <Toggle label="Count mode (don't block yet)" checked={countOnly} onChange={setCountOnly} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <GridY x0={56} x1={W - 16} ticks={[0, limit, Math.round(yMax / 100) * 100].filter((v, i, a) => a.indexOf(v) === i && v <= yMax)} y={y} />
        {bot.series.filter((point) => point.blocked && point.s <= upto).map((point) => (
          <rect key={point.s} x={x(point.s)} y="10" width={x(10) - x(0)} height={H - 34} className="aipf-band is-bad" />
        ))}
        <line x1="56" x2={W - 16} y1={y(limit)} y2={y(limit)} className="aipf-limit is-bad" />
        <text x={W - 18} y={y(limit) - 5} textAnchor="end" className="aipf-mono aipf-limit-text">limit {fmt(limit)}</text>
        {ips.map((ip) => (
          <path key={ip.id} d={linePath(ip.series.filter((point) => point.s <= upto).map((point) => [x(point.s), y(Math.min(yMax, point.windowCount))]))}
            className="aipf-line is-on" style={{ stroke: ip.color }} />
        ))}
        {/* A line pinned to the top of the axis is clipped: print its real count. */}
        {ips.map((ip) => {
          const shown = ip.series.filter((point) => point.s <= upto);
          const last = shown[shown.length - 1];
          return last && last.windowCount > yMax ? (
            <text key={`${ip.id}-clip`} x={x(last.s) - 4} y={y(yMax) + 14} textAnchor="end" className="aipf-mono aipf-small" style={{ fill: ip.color }}>
              {fmt(last.windowCount)} ↑
            </text>
          ) : null;
        })}
        <text x="56" y={H - 6} className="aipf-small">0 min</text>
        <text x={W - 16} y={H - 6} textAnchor="end" className="aipf-small">15 min</text>
      </svg>
      <div className="aipf-legend">
        {ips.map((ip) => <span key={ip.id}><i style={{ background: ip.color }} />{ip.label} · {ip.rate} req/s</span>)}
      </div>
      <div className="aipf-stats">
        <Stat label="Bot requests blocked" value={`${Math.round(bot.blockedShare * 100)}%`} tone={bot.blockedShare > 0.5 ? "ok" : "warn"} />
        <Stat label="Legitimate users blocked" value={legitBlocked.length} tone={legitBlocked.length ? "bad" : "ok"} />
      </div>
    </FigureFrame>
  );
}

/* ── exam domains ──────────────────────────────────────────────────────── */

const EXAM_DOMAINS = [
  {
    n: 1, weight: 31, name: "Foundation Model Integration, Data Management, and Compliance", color: KIND_COLOR.ai,
    tasks: ["1.1 Analyze requirements and design GenAI solutions", "1.2 Select and configure foundation models", "1.3 Data validation and processing for FMs", "1.4 Vector store solutions", "1.5 Retrieval mechanisms", "1.6 Prompt engineering and governance"],
    modules: "Modules 00–02, 05, 09",
  },
  {
    n: 2, weight: 26, name: "Implementation and Integration", color: KIND_COLOR.compute,
    tasks: ["2.1 Agentic AI and tool integrations", "2.2 Model deployment strategies", "2.3 Enterprise integration", "2.4 FM API integrations", "2.5 Application patterns and developer tools"],
    modules: "Modules 03, 05, 06",
  },
  {
    n: 3, weight: 20, name: "AI Safety, Security, and Governance", color: KIND_COLOR.security,
    tasks: ["3.1 Input and output safety controls", "3.2 Data security and privacy", "3.3 Governance and compliance", "3.4 Responsible AI"],
    modules: "Lesson 01/07, modules 07 and 08",
  },
  {
    n: 4, weight: 12, name: "Operational Efficiency and Optimization for GenAI Applications", color: KIND_COLOR.network,
    tasks: ["4.1 Cost optimization", "4.2 Performance optimization", "4.3 Monitoring"],
    modules: "Modules 04 and 07",
  },
  {
    n: 5, weight: 11, name: "Testing, Validation, and Troubleshooting", color: KIND_COLOR.monitor,
    tasks: ["5.1 Evaluation systems", "5.2 Troubleshooting"],
    modules: "Modules 07 and 06",
  },
];

export function DomainWeights() {
  const [active, setActive] = useState(1);
  // Draw the ring in once: a CSS transition on stroke-dasharray, started a
  // frame after mount so it has a zero-length state to animate from.
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const domain = EXAM_DOMAINS.find((item) => item.n === active);

  return (
    <FigureFrame kind="Interactive" title="The AIP-C01 blueprint: five domains, weighted"
      caption="65 scored and 10 unscored questions, scaled 100–1,000 with 750 to pass. Scoring is compensatory: you pass on the total, not domain by domain. Pick a domain to see its tasks.">
      <div className="aipf-split">
        <svg viewBox="0 0 220 220" className="aipf-svg aipf-donut">
          {EXAM_DOMAINS.map((item) => {
            const length = (item.weight / 100) * circumference;
            const dash = `${drawn ? Math.max(0, length - 3) : 0} ${circumference}`;
            const segment = (
              <circle key={item.n} cx="110" cy="110" r={radius} className={`aipf-donut-seg${item.n === active ? " is-on" : ""}`}
                style={{ stroke: item.color, strokeDasharray: dash, strokeDashoffset: -offset }}
                onClick={() => setActive(item.n)} onMouseEnter={() => setActive(item.n)} />
            );
            offset += length;
            return segment;
          })}
          <text x="110" y="104" textAnchor="middle" className="aipf-big">{domain.weight}%</text>
          <text x="110" y="124" textAnchor="middle" className="aipf-small">≈ {Math.round((domain.weight / 100) * 65)} scored questions</text>
        </svg>
        <div className="aipf-domain-card" style={{ "--k": domain.color }}>
          <div className="aipf-domain-tabs">
            {EXAM_DOMAINS.map((item) => (
              <button key={item.n} type="button" className={item.n === active ? "is-on" : ""} style={{ "--k": item.color }} onClick={() => setActive(item.n)}>
                D{item.n} · {item.weight}%
              </button>
            ))}
          </div>
          <h4>Domain {domain.n}: {domain.name}</h4>
          <ul>{domain.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
          <p className="aipf-muted">Taught in: {domain.modules}</p>
        </div>
      </div>
    </FigureFrame>
  );
}
