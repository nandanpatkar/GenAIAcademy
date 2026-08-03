import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Layers, ArrowRight, Target, Flag, Car } from "lucide-react";
import "../styles/Roadmap2.css";

// Same tab labels as the classic RoadmapGraph so both views feel like one family.
const PATH_LABELS = {
  dsa: "DSA",
  manual: "MANUAL",
  aicxm_aws: "AICXM AWS",
  aicxm_azure: "AICXM AZURE",
  aicxm_databricks: "AICXM DATABRICKS",
  ds: "DATA SCIENCE",
  genai: "GEN AI",
  agentic: "AGENTIC AI",
};

// Scene geometry (SVG viewBox units)
const W = 1200;
const SEG_BASE = 380;     // baseline vertical gap between stops before per-hop variance
const MIN_SEG = 300;      // shortest hop (also the clearance kept under the HUD for hop 0)
const MAX_SEG = 620;      // longest hop
const CENTER = 600;
const MAX_AMP = 320;      // widest a curve ever swings out from centre
const BOTTOM = 380;       // space after the last milestone (finish line)
// A hop's sideways move can never exceed this fraction of its vertical length.
// Keeps every curve's radius comfortably wider than the road's own stroke
// width, so a thick stroke never folds into a self-intersecting loop at a bend.
const MAX_RATIO = 0.48;

const SVG_NS = "http://www.w3.org/2000/svg";

// Paths whose intro drive already played this session — on later mounts the car
// is parked at the current stop instantly instead of re-driving from START.
const introPlayed = new Set();

// Deterministic single-hash PRNG: same seed always yields the same [0,1) float,
// so the road's shape is stable across re-renders without keeping generator state.
function hashRand(seed) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Weighted table of "road types" a hop can roll into — this is what replaces
// the old fixed left/right zigzag with a route that reads as hand-driven:
// long straight highway stretches, lazy sweeping avenues, sustained one-way
// bends, and short, sharp mountain-pass hairpins.
const ROAD_KINDS = [
  { kind: "straight", weight: 2 },
  { kind: "gentle", weight: 3 },
  { kind: "sweep", weight: 2 },
  { kind: "hold", weight: 1 },
  { kind: "switchback", weight: 2 },
];
const KIND_WEIGHT_TOTAL = ROAD_KINDS.reduce((s, k) => s + k.weight, 0);

function pickKind(i) {
  let r = hashRand(i * 9973 + 11) * KIND_WEIGHT_TOTAL;
  for (const entry of ROAD_KINDS) {
    r -= entry.weight;
    if (r <= 0) return entry.kind;
  }
  return "gentle";
}

// Builds a winding road: a start point, one anchor per node, and a finish
// point. Every hop between anchors independently rolls a "kind" that sets how
// far it moves sideways and how much road it gets to do it in — so the route
// mixes straight runs, wide lazy sweeps, sustained one-way bends and quick
// switchbacks rather than alternating identically forever. Crucially, a hop's
// segment length is never picked independently of its sideways move: it's
// always widened (never narrowed) until the move safely fits within
// MAX_RATIO, which is what keeps every curve's stroke from folding into a
// loop at the bend. Control points always share their anchor's x-coordinate,
// so the tangent at every stop stays exactly vertical (the car always parks
// facing down the road) no matter how the curve is shaped.
function buildGeometry(count) {
  const anchors = [];
  let curX = CENTER;
  let dir = 1; // current lateral trend: +1 drifting right, -1 drifting left
  let curY = 70; // the fixed start point's y

  for (let i = 0; i < count; i++) {
    const kind = pickKind(i);
    const j = (k) => hashRand(i * 131 + k);
    let baseSeg, deltaMag, dyRatio, flips = false;

    switch (kind) {
      case "straight":
        // Barely any sideways drift — reads as a long, flat highway run.
        baseSeg = SEG_BASE * (1.05 + j(1) * 0.3);
        deltaMag = j(2) * 24 - 12;
        dyRatio = 0.4;
        break;
      case "hold":
        // Keeps drifting the same direction as the last hop — a sustained bend.
        baseSeg = SEG_BASE * (0.85 + j(3) * 0.3);
        deltaMag = 70 + j(4) * 70;
        dyRatio = 0.44 + j(5) * 0.06;
        break;
      case "sweep":
        // Widest move, but paired with the longest road — a lazy highway curve.
        flips = true;
        baseSeg = SEG_BASE * (1.15 + j(6) * 0.3);
        deltaMag = 170 + j(7) * 70;
        dyRatio = 0.44 + j(8) * 0.06;
        break;
      case "switchback":
        // Smaller move, shortest base road — the quickest direction change.
        flips = true;
        baseSeg = SEG_BASE * (0.55 + j(9) * 0.2);
        deltaMag = 90 + j(10) * 60;
        dyRatio = 0.44 + j(11) * 0.06;
        break;
      case "gentle":
      default:
        flips = true;
        baseSeg = SEG_BASE * (0.95 + j(12) * 0.25);
        deltaMag = 90 + j(13) * 70;
        dyRatio = 0.44 + j(14) * 0.06;
        break;
    }

    if (flips) dir = -dir;
    const nextX = clamp(curX + dir * deltaMag, CENTER - MAX_AMP, CENTER + MAX_AMP);
    const actualDelta = Math.abs(nextX - curX);
    const segLen = clamp(Math.max(baseSeg, actualDelta / MAX_RATIO), MIN_SEG, MAX_SEG);

    curY += segLen;
    anchors.push({ x: nextX, y: curY, side: nextX < CENTER ? "left" : "right", kind, dyRatio });
    curX = nextX;
  }

  // The finish line sits a fixed distance below the last stop — but if that
  // stop landed far from centre, stretch the gap so the final approach curve
  // stays exactly as safe as every other hop instead of a fixed distance.
  const lastX = anchors.length ? anchors[anchors.length - 1].x : CENTER;
  const bottomGap = Math.max(BOTTOM, Math.abs(CENTER - lastX) / MAX_RATIO);

  const H = curY + bottomGap;
  const start = { x: CENTER, y: 70 };
  const end = { x: CENTER, y: H - 130 };
  const pts = [start, ...anchors, end];

  // `partials` accumulates the combined path string up to each point, used to
  // measure cumulative length for the car's stop positions. `hops` keeps each
  // gap as its own standalone path + kind, so every stretch can carry its own
  // road-surface styling without disturbing the single continuous curve used
  // for length measurement and the "travelled" overlay.
  const partials = [];
  const hops = [];
  let d = `M ${start.x} ${start.y}`;
  partials.push(d);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const n = pts[i];
    const gap = n.y - p.y;
    const ratio = n.dyRatio ?? 0.42;
    const dx = Math.abs(n.x - p.x);
    // Capped at half the gap: beyond that the control point would sit past
    // the far anchor's y and the curve would bulge backward instead of flow.
    // Also capped relative to the hop's actual sideways move: an unbounded
    // vertical handle on a hop that barely moves sideways (a tight switchback
    // or a sustained "hold") swings the tangent past the anchor and curls the
    // stroke into a closed loop right at the stop marker instead of a bend.
    const dy = Math.min(gap * ratio, gap * 0.5, dx * 1.35 + 60);
    const seg = ` C ${p.x} ${p.y + dy}, ${n.x} ${n.y - dy}, ${n.x} ${n.y}`;
    d += seg;
    partials.push(d);
    hops.push({ d: `M ${p.x} ${p.y}${seg}`, kind: n.kind || "straight" });
  }
  return { anchors, d, H, start, end, partials, hops };
}

// Measures a path string without touching the DOM tree.
function pathLength(d) {
  const p = document.createElementNS(SVG_NS, "path");
  p.setAttribute("d", d);
  return p.getTotalLength();
}

// Deterministic pseudo-random scenery so the scene is stable across renders.
function sceneryFor(anchors, startY) {
  const trees = [];
  const lamps = [];
  let prevY = startY;
  anchors.forEach((a, i) => {
    const anchorLeft = a.side === "left";
    const span = Math.max(80, a.y - prevY);
    // Trees hug the outer edge opposite the road's swing.
    const edgeX = anchorLeft ? 1050 : 150;
    trees.push({ x: edgeX + ((i * 53) % 90) - 45, y: prevY + ((i * 97) % span) + 20, s: 0.8 + ((i * 31) % 40) / 100 });
    trees.push({ x: (anchorLeft ? 130 : 1070) + ((i * 71) % 80) - 40, y: prevY + ((i * 137) % span) + 40, s: 0.7 + ((i * 17) % 50) / 100 });
    // A street lamp on the shoulder next to every stop, opposite the card.
    lamps.push({ x: a.x + (anchorLeft ? 74 : -74), y: a.y - 40, flip: !anchorLeft });
    prevY = a.y;
  });
  return { trees, lamps };
}

export default function Roadmap2({
  path, activePath, setActivePath, pathsData,
  onNodeClick, getNodeState, completedCount,
}) {
  const scrollRef = useRef(null);
  const sceneRef = useRef(null);
  const measureRef = useRef(null);   // invisible copy of the road used for getPointAtLength
  const carRef = useRef(null);
  const doneTrackRef = useRef(null); // glowing "travelled" overlay stroke
  const rafRef = useRef(null);
  const curLenRef = useRef(0);
  const [driving, setDriving] = useState(false);

  const nodes = path?.nodes || [];
  const geo = useMemo(() => buildGeometry(nodes.length), [nodes.length]);
  const scenery = useMemo(() => sceneryFor(geo.anchors, geo.start.y), [geo]);

  // Length along the road at the start, each anchor, and the finish line.
  const lens = useMemo(() => geo.partials.map(pathLength), [geo]);
  const totalLen = lens[lens.length - 1] || 1;
  const anchorLen = (i) => lens[i + 1] || 0; // pts[0] is the start point

  const tabLabels = Object.keys(pathsData || {})
    .filter((key) => !["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx", "onboarding", "appearance", "leetcode"].includes(key))
    .map((key) => ({ key, label: PATH_LABELS[key] || (pathsData[key]?.title || key).toUpperCase() }));

  const total = nodes.length;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const inProgress = nodes.filter((n) => getNodeState(n.id) === "progress").length;
  const notStarted = Math.max(0, total - completedCount - inProgress);

  // First in-progress stop, else the first stop not yet completed (App reports
  // untouched nodes as "default", so match on anything-but-done rather than a
  // literal "ready"). -1 only when every stop is done → head to the finish line.
  const currentIndex = useMemo(() => {
    let idx = nodes.findIndex((n) => getNodeState(n.id) === "progress");
    if (idx === -1) idx = nodes.findIndex((n) => getNodeState(n.id) !== "done");
    return idx;
  }, [nodes, getNodeState]);

  const statusOf = (state) => {
    switch (state) {
      case "done": return { label: "COMPLETED", color: "#00ff88" };
      case "progress": return { label: "IN PROGRESS", color: "#a855f7" };
      default: return { label: "READY", color: "#ffffff" };
    }
  };

  // Positions the car sprite + travelled-road glow at `len` along the road.
  const placeCar = useCallback((len) => {
    const p = measureRef.current;
    const car = carRef.current;
    if (!p || !car) return;
    const clamped = Math.max(0, Math.min(len, totalLen));
    const pt = p.getPointAtLength(clamped);
    const ahead = p.getPointAtLength(Math.min(clamped + 2, totalLen));
    const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI + 90;
    car.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
    if (doneTrackRef.current) {
      doneTrackRef.current.setAttribute("stroke-dasharray", `${clamped} ${totalLen}`);
    }
    curLenRef.current = clamped;
    return pt;
  }, [totalLen]);

  const scrollToLen = useCallback((len, smooth) => {
    const p = measureRef.current;
    const scroller = scrollRef.current;
    const scene = sceneRef.current;
    if (!p || !scroller || !scene) return;
    const pt = p.getPointAtLength(Math.max(0, Math.min(len, totalLen)));
    const yPx = scene.offsetTop + (pt.y / geo.H) * scene.getBoundingClientRect().height;
    scroller.scrollTo({ top: yPx - scroller.clientHeight * 0.45, behavior: smooth ? "smooth" : "auto" });
  }, [geo.H, totalLen]);

  // Animates the car from wherever it is to targetLen, following it with the
  // camera, then fires onArrive.
  const driveTo = useCallback((targetLen, onArrive) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = curLenRef.current;
    const dist = Math.abs(targetLen - from);
    if (dist < 1) { onArrive && onArrive(); return; }

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      placeCar(targetLen);
      scrollToLen(targetLen, false);
      onArrive && onArrive();
      return;
    }

    // A leisurely cruise: short hops take ~2s, a full-path drive ~8s.
    const duration = Math.min(8000, 1800 + (dist / totalLen) * 6500);
    const startT = performance.now();
    setDriving(true);
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const step = (now) => {
      const t = Math.min(1, (now - startT) / duration);
      const len = from + (targetLen - from) * ease(t);
      const pt = placeCar(len);
      // Camera-follow: keep the car around 45% of the viewport.
      const scroller = scrollRef.current;
      const scene = sceneRef.current;
      if (pt && scroller && scene) {
        const yPx = scene.offsetTop + (pt.y / geo.H) * scene.getBoundingClientRect().height;
        scroller.scrollTop = yPx - scroller.clientHeight * 0.45;
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDriving(false);
        onArrive && onArrive();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [geo.H, placeCar, scrollToLen, totalLen]);

  // On mount / path switch: park at the start, then cruise to the current stop.
  // If this path's intro already played this session, park at the stop directly.
  useEffect(() => {
    if (!nodes.length) return;
    const target = currentIndex === -1 ? totalLen : anchorLen(currentIndex);
    if (introPlayed.has(activePath)) {
      placeCar(target);
      scrollToLen(target, false);
      return;
    }
    placeCar(0);
    scrollToLen(0, false);
    const timer = setTimeout(() => {
      introPlayed.add(activePath);
      driveTo(target);
    }, 650);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // Intentionally re-run only when the road itself changes, not on every progress tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath, nodes.length]);

  const handleMilestoneClick = (node, i) => {
    if (driving) return;
    driveTo(anchorLen(i), () => {
      setTimeout(() => onNodeClick && onNodeClick(node), 250);
    });
  };

  const handleDriveToCurrent = () => {
    if (driving) return;
    driveTo(currentIndex === -1 ? totalLen : anchorLen(currentIndex));
  };

  if (!path) {
    return (
      <div className="r2-root" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ color: "var(--text2)", textAlign: "center" }}>
          <h2>Loading Roadmap Data...</h2>
          <p>If you see this permanently, please Reset Defaults from the Sidebar.</p>
        </div>
      </div>
    );
  }

  const pathColor = path.color || "#a855f7";

  // Gauge arc: 240° sweep starting at 150°.
  const gaugeR = 26;
  const gaugeC = 2 * Math.PI * gaugeR;
  const gaugeArc = gaugeC * (240 / 360);

  return (
    <div className="r2-root" style={{ "--path-color": pathColor }}>
      {/* ===== HUD ===== */}
      <div className="r2-hud">
        <div className="r2-tabs">
          {tabLabels.map((t) => (
            <button
              key={t.key}
              className={`r2-tab ${activePath === t.key ? "active" : ""}`}
              onClick={() => setActivePath && setActivePath(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="r2-dashboard">
          <div className="r2-gauge">
            <svg viewBox="0 0 64 64" width="58" height="58">
              <circle
                cx="32" cy="32" r={gaugeR} fill="none"
                stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${gaugeArc} ${gaugeC}`}
                transform="rotate(150 32 32)"
              />
              <circle
                cx="32" cy="32" r={gaugeR} fill="none"
                stroke={pathColor} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${gaugeArc * (pct / 100)} ${gaugeC}`}
                transform="rotate(150 32 32)"
                style={{ filter: `drop-shadow(0 0 6px ${pathColor})`, transition: "stroke-dasharray 0.8s ease" }}
              />
            </svg>
            <div className="r2-gauge-label">
              <span className="r2-gauge-pct">{pct}</span>
              <span className="r2-gauge-unit">%</span>
            </div>
          </div>

          <div className="r2-odometer">
            <div className="r2-odo-main">{completedCount} / {total} STOPS</div>
            <div className="r2-odo-sub">EST. {path.estimatedHours || "400+ HOURS"} OF ROAD</div>
            <div className="r2-odo-chips">
              <span className="r2-chip progress">{inProgress} IN PROGRESS</span>
              <span className="r2-chip">{notStarted} NOT STARTED</span>
            </div>
          </div>

          <button className="r2-drive-btn" onClick={handleDriveToCurrent} disabled={driving}>
            <Target size={14} />
            {driving ? "DRIVING…" : "DRIVE TO CURRENT"}
          </button>
        </div>
      </div>

      {/* ===== SCENE ===== */}
      <div className="r2-scroll" ref={scrollRef}>
        <div
          className="r2-scene"
          ref={sceneRef}
          style={{ aspectRatio: `${W} / ${geo.H}` }}
        >
          <svg
            className="r2-svg"
            viewBox={`0 0 ${W} ${geo.H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="r2CarBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="45%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
              <linearGradient id="r2CarRoof" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <radialGradient id="r2Beam" cx="0.5" cy="0" r="1">
                <stop offset="0%" stopColor="rgba(255,241,178,0.55)" />
                <stop offset="100%" stopColor="rgba(255,241,178,0)" />
              </radialGradient>
              <radialGradient id="r2LampGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="rgba(255,214,120,0.45)" />
                <stop offset="100%" stopColor="rgba(255,214,120,0)" />
              </radialGradient>
            </defs>

            {/* Scenery: trees */}
            {scenery.trees.map((t, i) => (
              <g key={`tree-${i}`} className="r2-tree" transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
                <rect x="-4" y="12" width="8" height="18" rx="3" fill="#2a2333" />
                <circle cx="0" cy="0" r="22" fill="#1c2b25" />
                <circle cx="-10" cy="8" r="14" fill="#20332b" />
                <circle cx="11" cy="7" r="13" fill="#182721" />
              </g>
            ))}

            {/* Road: glow → edge rim → asphalt → centre dashes, per hop so each
                stretch (highway / avenue / mountain pass) can carry its own look */}
            {geo.hops.map((hop, idx) => (
              <g key={`hop-${idx}`} className={`r2-hop kind-${hop.kind}`}>
                <path d={hop.d} className="r2-road-glow" fill="none" />
                <path d={hop.d} className="r2-road-edge" fill="none" />
                <path d={hop.d} className="r2-road-asphalt" fill="none" />
                <path d={hop.d} className="r2-road-dashes" fill="none" />
              </g>
            ))}
            {/* Travelled portion, lit in the path colour */}
            <path
              d={geo.d}
              ref={doneTrackRef}
              className="r2-road-done"
              fill="none"
              style={{ stroke: pathColor }}
              strokeDasharray={`0 ${totalLen}`}
            />
            {/* Invisible measurement twin */}
            <path d={geo.d} ref={measureRef} fill="none" stroke="none" />

            {/* Street lamps at every stop */}
            {scenery.lamps.map((l, i) => (
              <g key={`lamp-${i}`} transform={`translate(${l.x} ${l.y})${l.flip ? " scale(-1,1)" : ""}`}>
                <rect x="-2" y="0" width="4" height="52" rx="2" fill="#33333f" />
                <path d="M 0 2 Q 18 -6 30 4" stroke="#33333f" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="30" cy="6" r="5" fill="#ffd678" className="r2-lamp-bulb" />
                <circle cx="30" cy="14" r="26" fill="url(#r2LampGlow)" />
              </g>
            ))}

            {/* Start banner */}
            <g transform={`translate(${geo.start.x} ${geo.start.y})`}>
              <circle r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <circle r="4" fill="#fff" />
              <text y="-22" textAnchor="middle" className="r2-road-text">START YOUR JOURNEY</text>
            </g>

            {/* Finish line: checkered strip across the road */}
            <g transform={`translate(${geo.end.x} ${geo.end.y})`}>
              {[0, 1].map((row) =>
                Array.from({ length: 8 }).map((_, col) => (
                  <rect
                    key={`fin-${row}-${col}`}
                    x={-48 + col * 12} y={-12 + row * 12} width="12" height="12"
                    fill={(row + col) % 2 === 0 ? "#e8e8f0" : "#16161e"}
                  />
                ))
              )}
              <text y="42" textAnchor="middle" className="r2-road-text">FINISH — MASTERY</text>
            </g>

            {/* Milestone markers on the road */}
            {geo.anchors.map((a, i) => {
              const node = nodes[i];
              const st = statusOf(getNodeState(node.id));
              const isCurrent = i === currentIndex;
              return (
                <g
                  key={node.id}
                  transform={`translate(${a.x} ${a.y})`}
                  className={`r2-stop ${isCurrent ? "current" : ""}`}
                  onClick={() => handleMilestoneClick(node, i)}
                >
                  <circle r="22" fill="none" stroke={st.color} strokeOpacity="0.18" strokeWidth="2" className="r2-stop-ring" />
                  <circle r="13" fill="#0d0d12" stroke={st.color} strokeWidth="2.5" />
                  <circle r="5" fill={st.color} className="r2-stop-core" />
                </g>
              );
            })}

            {/* The car */}
            <g ref={carRef} className={`r2-car ${driving ? "driving" : ""}`} visibility={total > 0 ? "visible" : "hidden"}>
              <g className="r2-car-inner">
                {/* headlight beams (front = -y) */}
                <path className="r2-beams" d="M -14 -24 L -26 -86 L -2 -86 Z M 14 -24 L 26 -86 L 2 -86 Z" fill="url(#r2Beam)" />
                <ellipse cx="0" cy="6" rx="24" ry="34" fill="rgba(0,0,0,0.45)" className="r2-car-shadow" />
                {/* wheels */}
                <rect x="-23" y="-22" width="9" height="16" rx="4" fill="#0b0b10" />
                <rect x="14" y="-22" width="9" height="16" rx="4" fill="#0b0b10" />
                <rect x="-23" y="8" width="9" height="16" rx="4" fill="#0b0b10" />
                <rect x="14" y="8" width="9" height="16" rx="4" fill="#0b0b10" />
                {/* body */}
                <rect x="-18" y="-30" width="36" height="60" rx="14" fill="url(#r2CarBody)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                {/* windshield + roof + rear window */}
                <path d="M -13 -12 Q 0 -20 13 -12 L 13 -4 Q 0 -10 -13 -4 Z" fill="#0f1020" opacity="0.85" />
                <rect x="-12" y="-4" width="24" height="18" rx="6" fill="url(#r2CarRoof)" />
                <path d="M -12 18 Q 0 24 12 18 L 12 22 Q 0 27 -12 22 Z" fill="#0f1020" opacity="0.8" />
                {/* headlights / taillights */}
                <rect x="-13" y="-31" width="8" height="4" rx="2" fill="#fff1b2" className="r2-headlight" />
                <rect x="5" y="-31" width="8" height="4" rx="2" fill="#fff1b2" className="r2-headlight" />
                <rect x="-13" y="27" width="8" height="4" rx="2" fill="#ff5470" />
                <rect x="5" y="27" width="8" height="4" rx="2" fill="#ff5470" />
              </g>
            </g>
          </svg>

          {/* ===== Milestone cards (HTML overlay) ===== */}
          {geo.anchors.map((a, i) => {
            const node = nodes[i];
            const st = statusOf(getNodeState(node.id));
            const isCurrent = i === currentIndex;
            return (
              <div
                key={node.id}
                className={`r2-card ${a.side} ${isCurrent ? "current" : ""}`}
                style={{
                  left: `${(a.x / W) * 100}%`,
                  top: `${(a.y / geo.H) * 100}%`,
                  "--status-color": st.color,
                }}
                onClick={() => handleMilestoneClick(node, i)}
              >
                <div className="r2-card-top">
                  <span className="r2-card-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="r2-card-milestag">MILE {i + 1}</span>
                  <span className="r2-card-subnodes">
                    <Layers size={10} />
                    {node.modules?.length || 0} SUBNODES
                  </span>
                </div>
                <div className="r2-card-title">
                  {node.icon && <span className="r2-card-icon">{node.icon}</span>}
                  {node.title}
                </div>
                <div className="r2-card-desc">{node.subtitle || node.description}</div>
                <div className="r2-card-footer">
                  <span className="r2-card-status">
                    <span className="r2-card-status-dot" />
                    {st.label}
                  </span>
                  <span className="r2-card-explore">
                    {isCurrent ? <Car size={13} /> : null}
                    EXPLORE <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}

          {total === 0 && (
            <div className="r2-empty">
              <Flag size={28} />
              <p>This path has no stops yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
