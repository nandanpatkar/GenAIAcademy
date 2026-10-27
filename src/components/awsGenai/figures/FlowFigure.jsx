import React, { useMemo, useRef, useState } from "react";
import {
  ArrowDefs, FigureFrame, KIND_COLOR, Pill, PlayControls, ServiceTile, TONE_COLOR,
  clamp, easeInOut, useFrame, usePlayback,
} from "./kit";
import FLOWS from "./flows.json";

/* Animated architecture diagrams.
 *
 * A flow (figures/flows.json) is a grid of service nodes and a list of steps.
 * Each step walks one or more paths through the nodes; a packet travels the
 * path, the nodes it reaches light up, and the step's note appears on arrival.
 * Edges are every hop any step takes, plus any declared for context, so a
 * flow is authored as "what happens", not as a drawing.
 *
 *   { title, grid: [cols, rows], h?, nodes: [{ id, at: [col, row], label, sub?, kind }],
 *     groups?: [{ label, nodes, kind? }], edges?: [[from, to, { bend?, dashed?, label? }]],
 *     steps: [{ path | paths, label, note?, packet?, tone? }] }
 *
 * scripts/build_aws_genai.py refuses to build if a step walks a node a flow
 * does not declare, so a typo cannot reach a lesson.
 */

const W = 760;
const PAD = 14;
const NODE_H = 46;
const TILE = 22;
const TILE_X = 8;                  // tile inset from the node's left edge
const TEXT_X = TILE_X + TILE + 7;  // where the label starts
const TEXT_PAD = 7;                // space kept after the longest line
const TRAVEL_MS = 720;
const HOLD_MS = 1700;
const LOOP_GAP_MS = 900;

// Must match .aipf-node-label / .aipf-node-sub in AwsGenAi.css.
const FONT_STACK = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';
const LABEL_FONT = `600 11px ${FONT_STACK}`;
const SUB_FONT = `400 9.5px ${FONT_STACK}`;

let measureContext = null;
function textWidth(text, font) {
  if (!text) return 0;
  if (!measureContext && typeof document !== "undefined") {
    measureContext = document.createElement("canvas").getContext("2d");
  }
  if (!measureContext) return text.length * 6;
  measureContext.font = font;
  return measureContext.measureText(text).width;
}

/** Trim to `max` pixels with an ellipsis, so a long label never spills out of its node. */
function fit(text, font, max) {
  if (!text || textWidth(text, font) <= max) return text || "";
  let cut = text.length - 1;
  while (cut > 1 && textWidth(`${text.slice(0, cut)}…`, font) > max) cut -= 1;
  return `${text.slice(0, cut).trimEnd()}…`;
}

function buildGeometry(flow) {
  const [cols, rows] = flow.grid || [5, 3];
  const top = flow.groups?.length ? 22 : 10;
  const height = flow.h || Math.round(rows * 94 + top + 8);
  const cellW = (W - PAD * 2) / cols;
  const cellH = (height - top - 8) / rows;
  const nodes = {};
  flow.nodes.forEach((node) => {
    const [col, row] = node.at;
    const textW = Math.max(textWidth(node.label, LABEL_FONT), textWidth(node.sub, SUB_FONT));
    const w = node.w || clamp(Math.round(textW + TEXT_X + TEXT_PAD + 3), 104, Math.max(104, cellW - 8));
    const cx = PAD + (col + 0.5) * cellW;
    const cy = top + (row + 0.5) * cellH;
    const room = w - TEXT_X - TEXT_PAD;
    nodes[node.id] = {
      ...node, cx, cy, w, h: NODE_H, x: cx - w / 2, y: cy - NODE_H / 2,
      shownLabel: fit(node.label, LABEL_FONT, room),
      shownSub: fit(node.sub, SUB_FONT, room),
    };
  });

  // One drawn edge per unordered pair; which directions the steps use decides
  // the arrowheads.
  const edges = new Map();
  const touch = (from, to, options = {}) => {
    const key = [from, to].sort().join("|");
    const existing = edges.get(key) || { a: from, b: to, forward: false, backward: false, ...options };
    if (existing.a === from) existing.forward = true; else existing.backward = true;
    edges.set(key, { ...existing, ...options });
  };
  (flow.edges || []).forEach(([from, to, options]) => touch(from, to, options || {}));
  flow.steps.forEach((step) => pathsOf(step).forEach((path) => {
    for (let index = 0; index + 1 < path.length; index += 1) touch(path[index], path[index + 1]);
  }));
  edges.forEach((edge) => Object.assign(edge, edgeShape(nodes[edge.a], nodes[edge.b], edge.bend || 0)));

  const groups = (flow.groups || []).map((group) => {
    const members = group.nodes.map((id) => nodes[id]).filter(Boolean);
    const x1 = Math.min(...members.map((n) => n.x)) - 10;
    const y1 = Math.min(...members.map((n) => n.y)) - 18;
    const x2 = Math.max(...members.map((n) => n.x + n.w)) + 10;
    const y2 = Math.max(...members.map((n) => n.y + n.h)) + 10;
    return { ...group, x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  });
  return { nodes, edges, groups, height };
}

const pathsOf = (step) => step.paths || (step.path ? [step.path] : []);

/** Where the segment from a node's center toward `toward` leaves its box. */
function border(node, toward) {
  const dx = toward.x - node.cx;
  const dy = toward.y - node.cy;
  const sx = dx === 0 ? Infinity : (node.w / 2 + 4) / Math.abs(dx);
  const sy = dy === 0 ? Infinity : (node.h / 2 + 4) / Math.abs(dy);
  const scale = Math.min(sx, sy);
  return { x: node.cx + dx * scale, y: node.cy + dy * scale };
}

function edgeShape(a, b, bend) {
  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2;
  const len = Math.hypot(b.cx - a.cx, b.cy - a.cy) || 1;
  const control = { x: mx - ((b.cy - a.cy) / len) * bend, y: my + ((b.cx - a.cx) / len) * bend };
  const start = border(a, bend ? control : { x: b.cx, y: b.cy });
  const end = border(b, bend ? control : { x: a.cx, y: a.cy });
  const d = bend
    ? `M${start.x},${start.y} Q${control.x},${control.y} ${end.x},${end.y}`
    : `M${start.x},${start.y} L${end.x},${end.y}`;
  return { start, end, control: bend ? control : null, d };
}

function pointOn(edge, t) {
  const { start, end, control } = edge;
  if (!control) return { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
  const u = 1 - t;
  return {
    x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
    y: u * u * start.y + 2 * u * t * control.y + t * t * end.y,
  };
}

function edgeBetween(edges, from, to) {
  const edge = edges.get([from, to].sort().join("|"));
  return { edge, reversed: edge && edge.a !== from };
}

const travelTime = (step) => Math.max(...pathsOf(step).map((path) => (path.length - 1) * TRAVEL_MS), TRAVEL_MS);

/** Packet position and lit/visited state for one path at `elapsed` ms. */
function walk(path, elapsed, edges) {
  const segments = path.length - 1;
  const done = Math.min(segments, elapsed / TRAVEL_MS);
  const index = Math.min(segments - 1, Math.floor(done));
  const local = done >= segments ? 1 : easeInOut(done - index);
  const { edge, reversed } = edgeBetween(edges, path[index], path[index + 1]);
  const position = edge ? pointOn(edge, reversed ? 1 - local : local) : null;
  const reached = new Set(path.slice(0, Math.floor(done) + 1));
  if (done >= segments) reached.add(path[segments]);
  const lit = new Set();
  for (let hop = 0; hop < segments; hop += 1) {
    if (hop < done) lit.add([path[hop], path[hop + 1]].sort().join("|"));
  }
  return { position, reached, lit, arrived: done >= segments, last: path[segments] };
}

export default function FlowFigure({ id }) {
  const flow = FLOWS[id];
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const geometry = useMemo(() => (flow ? buildGeometry(flow) : null), [flow]);
  const [state, setState] = useState(() => ({ step: 0, elapsed: playback.reduced ? 1e9 : 0 }));

  const steps = flow?.steps || [];
  useFrame(playback.playing && steps.length > 0, (dt) => {
    setState((prev) => {
      const stepTotal = travelTime(steps[prev.step]) + HOLD_MS + (prev.step === steps.length - 1 ? LOOP_GAP_MS : 0);
      const elapsed = Math.min(prev.elapsed, stepTotal) + dt;
      if (elapsed < stepTotal) return { step: prev.step, elapsed };
      return { step: (prev.step + 1) % steps.length, elapsed: 0 };
    });
  });

  if (!flow || !geometry) return null;
  const { nodes, edges, groups, height } = geometry;
  const step = steps[state.step];
  const tone = step.tone || "accent";
  const toneColor = TONE_COLOR[tone] || TONE_COLOR.accent;
  const walks = pathsOf(step).map((path) => walk(path, state.elapsed, edges));
  const reached = new Set(walks.flatMap((item) => [...item.reached]));
  const lit = new Set(walks.flatMap((item) => [...item.lit]));
  const onRoute = new Set(pathsOf(step).flatMap((path) => path.slice(1).map((node, i) => [path[i], node].sort().join("|"))));
  const arrived = walks.every((item) => item.arrived);
  const markerId = `aipf-flow-${id}`;

  const goto = (next) => {
    playback.pause();
    setState({ step: (next + steps.length) % steps.length, elapsed: 1e9 });
  };

  return (
    <FigureFrame
      kind="Animation"
      title={flow.title}
      frameRef={frameRef}
      className="aipf--flow"
      {...playback.hoverProps}
      controls={(
        <PlayControls
          playback={playback}
          onPrev={() => goto(state.step - 1)}
          onNext={() => goto(state.step + 1)}
          onReset={() => { setState({ step: 0, elapsed: 0 }); playback.play(); }}
        />
      )}
      caption={(
        <div className="aipf-flow-caption">
          <span className="aipf-flow-step" style={{ color: toneColor }}>Step {state.step + 1}/{steps.length}</span>
          <span className="aipf-flow-text">{step.label}</span>
          <span className="aipf-flow-dots">
            {steps.map((item, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Step ${index + 1}: ${item.label}`}
                className={index === state.step ? "is-on" : index < state.step ? "is-done" : ""}
                onClick={() => goto(index)}
              />
            ))}
          </span>
        </div>
      )}
    >
      <svg viewBox={`0 0 ${W} ${height}`} className="aipf-svg" role="img" aria-label={`${flow.title}. ${steps.map((item, index) => `Step ${index + 1}: ${item.label}`).join(" ")}`}>
        <ArrowDefs id={markerId} />
        {groups.map((group) => (
          <g key={group.label} className="aipf-group" style={{ "--k": KIND_COLOR[group.kind] || "var(--aipf-ink-3)" }}>
            <rect x={group.x} y={group.y} width={group.w} height={group.h} rx="12" />
            <text x={group.x + 10} y={group.y + 12}>{group.label}</text>
          </g>
        ))}

        {[...edges.entries()].map(([key, edge]) => {
          const isLit = lit.has(key);
          const isRoute = onRoute.has(key);
          const marker = isLit ? tone : "idle";
          return (
            <g key={key} className={`aipf-edge${isRoute ? " is-route" : ""}${isLit ? " is-lit" : ""}${edge.dashed ? " is-dashed" : ""}`} style={isLit || isRoute ? { "--tone": toneColor } : undefined}>
              <path
                d={edge.d}
                markerEnd={edge.forward ? `url(#${markerId}-${marker})` : undefined}
                markerStart={edge.backward ? `url(#${markerId}-${marker})` : undefined}
              />
              {edge.label ? (
                <text className="aipf-edge-label" x={edge.control ? edge.control.x : (edge.start.x + edge.end.x) / 2} y={(edge.control ? edge.control.y : (edge.start.y + edge.end.y) / 2) - 5} textAnchor="middle">
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {Object.values(nodes).map((node) => {
          const isReached = reached.has(node.id);
          const isTarget = arrived && walks.some((item) => item.last === node.id);
          return (
            <g
              key={node.id}
              className={`aipf-node${isReached ? " is-active" : ""}${isTarget ? " is-target" : ""}`}
              style={{ "--k": KIND_COLOR[node.kind] || KIND_COLOR.compute, "--tone": toneColor }}
            >
              {isTarget ? <rect className="aipf-node-ring" x={node.x - 4} y={node.y - 4} width={node.w + 8} height={node.h + 8} rx="13" /> : null}
              <rect className="aipf-node-box" x={node.x} y={node.y} width={node.w} height={node.h} rx="10" />
              <ServiceTile kind={node.kind} x={node.x + TILE_X} y={node.cy - TILE / 2} size={TILE} />
              <text className="aipf-node-label" x={node.x + TEXT_X} y={node.sub ? node.cy - 2.5 : node.cy + 4}>
                {node.shownLabel}
                {node.shownLabel !== node.label ? <title>{node.label}</title> : null}
              </text>
              {node.sub ? (
                <text className="aipf-node-sub" x={node.x + TEXT_X} y={node.cy + 11.5}>
                  {node.shownSub}
                  {node.shownSub !== node.sub ? <title>{node.sub}</title> : null}
                </text>
              ) : null}
            </g>
          );
        })}

        {walks.map((item, index) => (item.position && !item.arrived ? (
          <g key={index} className="aipf-packet" style={{ "--tone": toneColor }}>
            <circle cx={item.position.x} cy={item.position.y} r="11" className="aipf-packet-halo" />
            <circle cx={item.position.x} cy={item.position.y} r="5.5" className="aipf-packet-dot" />
            {step.packet && index === 0 ? <Pill x={item.position.x} y={item.position.y - 14} text={step.packet} tone={tone} size={9.5} /> : null}
          </g>
        ) : null))}

        {arrived && step.note ? (() => {
          const target = nodes[walks[0].last];
          const above = target.y > 34;
          return <Pill x={target.cx} y={above ? target.y - 9 : target.y + target.h + 19} text={step.note} tone={tone} />;
        })() : null}
      </svg>
    </FigureFrame>
  );
}

export const FLOW_IDS = Object.keys(FLOWS);
