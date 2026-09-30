import React, { useEffect, useId, useMemo, useState } from "react";
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from "d3";
import { BarChart3, ChevronLeft, ChevronRight, GitFork, Link2, Network, Pause, Play, RotateCcw } from "lucide-react";
import { circleLayout, layeredLayout, treeFromLevelOrder, treeLayout } from "./layout";

/**
 * Step-by-step visual artifacts for DSA problems — all SVG, all driven by
 * `frames` and played by one FramePlayer:
 *
 *   tree         binary trees from LeetCode level-order arrays
 *   graph        BFS / DFS / Dijkstra / topo states on a fixed layout
 *   bars         heights with an overlay (trapping rain water, histograms)
 *   linked_list  nodes and their next pointers (reversal, merging…)
 */

const pretty = (value) => (typeof value === "string" ? value : JSON.stringify(value));
const same = (a, b) => String(a) === String(b);

export function FramePlayer({ icon: Icon, kicker, title, frames, children, speed = 1200 }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = frames[Math.min(index, frames.length - 1)];

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setIndex((current) => {
      if (current >= frames.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), speed);
    return () => window.clearInterval(timer);
  }, [playing, frames.length, speed]);

  const go = (next) => { setPlaying(false); setIndex(Math.max(0, Math.min(frames.length - 1, next))); };
  const extras = { ...(frame.vars || {}), ...(frame.queue ? { queue: frame.queue } : {}), ...(frame.stack ? { stack: frame.stack } : {}) };

  return (
    <section className="dcx-card is-trace is-viz">
      <header className="dcx-card-head">
        {Icon && <span className="dcx-card-icon"><Icon size={14} /></span>}
        <div className="dcx-card-title"><small>{kicker}</small><h4>{title}</h4></div>
      </header>
      <div
        className="dcx-trace-stage"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
        }}
        aria-label={`Step ${index + 1} of ${frames.length}. Use the arrow keys to step.`}
      >
        <div className="dcx-viz-canvas">{children(frame, index)}</div>
        {Object.keys(extras).length > 0 && <div className="dcx-vars">{Object.entries(extras).map(([name, value]) => <span key={name}><b>{name}</b> = {pretty(value)}</span>)}</div>}
        <p className="dcx-trace-note" aria-live="polite">{frame.note || " "}</p>
      </div>
      {frames.length > 1 && (
        <div className="dcx-trace-controls">
          <button type="button" className="dcx-icon" onClick={() => go(0)} aria-label="Restart" title="Restart"><RotateCcw size={14} /></button>
          <button type="button" className="dcx-icon" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous step"><ChevronLeft size={15} /></button>
          <button type="button" className="dcx-icon is-primary" onClick={() => { if (index >= frames.length - 1) setIndex(0); setPlaying((value) => !value); }} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>
          <button type="button" className="dcx-icon" onClick={() => go(index + 1)} disabled={index === frames.length - 1} aria-label="Next step"><ChevronRight size={15} /></button>
          <input type="range" min={0} max={frames.length - 1} value={index} onChange={(event) => go(Number(event.target.value))} aria-label="Step" />
          <span className="dcx-trace-count">{index + 1} / {frames.length}</span>
        </div>
      )}
    </section>
  );
}

/* ── Tree ──────────────────────────────────────────────────────────────── */

const R = 17;

function TreeFrame({ frame }) {
  const nodes = useMemo(() => treeFromLevelOrder(frame.tree), [frame.tree]);
  const { positions, width, height } = useMemo(() => treeLayout(nodes, { gapX: 46, gapY: 62, pad: 28 }), [nodes]);
  const hit = (list, node) => list.some((value) => same(value, node.value));
  const pointerNames = (node) => Object.entries(frame.pointers).filter(([, value]) => same(value, node.value)).map(([name]) => name);
  if (!nodes.length) return <p className="dcx-muted">Empty tree</p>;
  return (
    <svg className="dcx-viz-svg" width={Math.max(width, 120)} height={height + 18} viewBox={`0 0 ${Math.max(width, 120)} ${height + 18}`} role="img" aria-label="Binary tree">
      {nodes.filter((node) => node.parent !== null).map((node) => {
        const from = positions[node.parent];
        const to = positions[node.index];
        return <line key={`e${node.index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="dcx-viz-edge" />;
      })}
      {nodes.map((node) => {
        const { x, y } = positions[node.index];
        const state = hit(frame.highlight, node) ? "is-active" : hit(frame.visited, node) ? "is-visited" : "";
        const names = pointerNames(node);
        const label = frame.labels[String(node.value)];
        return (
          <g key={node.index} className={`dcx-viz-node ${state}`}>
            <circle cx={x} cy={y} r={R} />
            <text x={x} y={y} dy="0.35em" textAnchor="middle">{String(node.value)}</text>
            {names.length > 0 && <text className="dcx-viz-ptr" x={x} y={y - R - 6} textAnchor="middle">{names.join(" ")}</text>}
            {label !== undefined && <text className="dcx-viz-label" x={x} y={y + R + 13} textAnchor="middle">{pretty(label)}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function TreeViz({ artifact }) {
  return <FramePlayer icon={GitFork} kicker="Tree" title={artifact.title} frames={artifact.frames}>{(frame) => <TreeFrame frame={frame} />}</FramePlayer>;
}

/* ── Graph ─────────────────────────────────────────────────────────────── */

function graphPositions(artifact) {
  const ids = artifact.nodes.map((node) => node.id);
  const edges = artifact.edges.filter((edge) => ids.includes(edge.source) && ids.includes(edge.target));
  const layout = artifact.layout || (artifact.directed ? "layered" : ids.length <= 12 ? "circle" : "force");
  if (layout === "layered" || layout === "tree") {
    const size = 56;
    const result = layeredLayout(ids.map((id) => ({ id })), edges, { direction: "TB", nodeWidth: size, nodeHeight: size, gapX: 50, gapY: 22 });
    const positions = Object.fromEntries(Object.entries(result.positions).map(([id, point]) => [id, { x: point.x + size / 2 + 12, y: point.y + size / 2 + 12 }]));
    return { positions, width: result.width + 24, height: result.height + 24 };
  }
  if (layout === "circle") return circleLayout(ids, { radius: Math.max(80, ids.length * 18) });
  const nodes = ids.map((id) => ({ id }));
  const simulation = forceSimulation(nodes)
    .force("link", forceLink(edges.map((edge) => ({ source: edge.source, target: edge.target }))).id((node) => node.id).distance(80))
    .force("charge", forceManyBody().strength(-260))
    .force("center", forceCenter(0, 0))
    .force("collide", forceCollide(30))
    .stop();
  for (let tick = 0; tick < 300; tick += 1) simulation.tick();
  const minX = Math.min(...nodes.map((node) => node.x));
  const minY = Math.min(...nodes.map((node) => node.y));
  const positions = Object.fromEntries(nodes.map((node) => [node.id, { x: node.x - minX + 36, y: node.y - minY + 36 }]));
  return { positions, width: Math.max(...nodes.map((node) => node.x)) - minX + 72, height: Math.max(...nodes.map((node) => node.y)) - minY + 72 };
}

function GraphFrame({ artifact, frame, positions, width, height, markerId }) {
  const path = new Set(frame.path);
  const onPath = (edge) => path.has(`${edge.source}->${edge.target}`) || (!artifact.directed && path.has(`${edge.target}->${edge.source}`));
  return (
    <svg className="dcx-viz-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Graph">
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" className="dcx-viz-arrow" /></marker>
        <marker id={`${markerId}-on`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" className="dcx-viz-arrow is-on" /></marker>
      </defs>
      {artifact.edges.map((edge, index) => {
        const from = positions[edge.source];
        const to = positions[edge.target];
        if (!from || !to) return null;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.hypot(dx, dy) || 1;
        const x1 = from.x + (dx / length) * R;
        const y1 = from.y + (dy / length) * R;
        const x2 = to.x - (dx / length) * (R + (artifact.directed ? 3 : 0));
        const y2 = to.y - (dy / length) * (R + (artifact.directed ? 3 : 0));
        const on = onPath(edge);
        return (
          // eslint-disable-next-line react/no-array-index-key
          <g key={index}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} className={`dcx-viz-edge${on ? " is-on" : ""}`} markerEnd={artifact.directed ? `url(#${on ? `${markerId}-on` : markerId})` : undefined} />
            {artifact.weighted && edge.weight !== null && edge.weight !== "" && <text className="dcx-viz-weight" x={(from.x + to.x) / 2} y={(from.y + to.y) / 2} dy="-0.4em" textAnchor="middle">{String(edge.weight)}</text>}
          </g>
        );
      })}
      {artifact.nodes.map((node) => {
        const point = positions[node.id];
        if (!point) return null;
        const state = frame.active.includes(node.id) ? "is-active" : frame.visited.includes(node.id) ? "is-visited" : "";
        const label = frame.labels[node.id];
        return (
          <g key={node.id} className={`dcx-viz-node ${state}`}>
            <circle cx={point.x} cy={point.y} r={R} />
            <text x={point.x} y={point.y} dy="0.35em" textAnchor="middle">{node.label}</text>
            {label !== undefined && <text className="dcx-viz-label" x={point.x} y={point.y - R - 6} textAnchor="middle">{pretty(label)}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function GraphViz({ artifact }) {
  const markerId = `dcx-arrow-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const layout = useMemo(() => graphPositions(artifact), [artifact]);
  return (
    <FramePlayer icon={Network} kicker={artifact.directed ? "Directed graph" : "Graph"} title={artifact.title} frames={artifact.frames}>
      {(frame) => <GraphFrame artifact={artifact} frame={frame} markerId={markerId} {...layout} />}
    </FramePlayer>
  );
}

/* ── Bars (trapping rain water, histograms, prices) ──────────────────────── */

const BAR_W = 30;
const BAR_GAP = 6;
const CHART_H = 150;

function BarsFrame({ frame, overlayLabel }) {
  const { values } = frame;
  const water = frame.water || [];
  const max = Math.max(1, ...values.map((value, index) => value + (water[index] || 0)));
  const scale = CHART_H / max;
  const width = values.length * (BAR_W + BAR_GAP) + BAR_GAP;
  const pointersAt = {};
  Object.entries(frame.pointers).forEach(([name, at]) => { if (Number.isInteger(at)) (pointersAt[at] ||= []).push(name); });
  const top = 16;
  return (
    <svg className="dcx-viz-svg" width={width} height={top + CHART_H + 44} viewBox={`0 0 ${width} ${top + CHART_H + 44}`} role="img" aria-label="Bar chart">
      <line x1={0} y1={top + CHART_H} x2={width} y2={top + CHART_H} className="dcx-viz-axis" />
      {values.map((value, index) => {
        const x = BAR_GAP + index * (BAR_W + BAR_GAP);
        const barH = Math.max(0, value) * scale;
        const waterH = Math.max(0, water[index] || 0) * scale;
        const state = frame.highlight.includes(index) ? "is-active" : frame.done.includes(index) ? "is-done" : "";
        return (
          <g key={index} className={`dcx-viz-bar ${state}`}>
            {waterH > 0 && <rect className="dcx-viz-water" x={x} y={top + CHART_H - barH - waterH} width={BAR_W} height={waterH} rx={2}><title>{`${overlayLabel}: ${water[index]}`}</title></rect>}
            {barH > 0 && <rect x={x} y={top + CHART_H - barH} width={BAR_W} height={barH} rx={3} />}
            <text className="dcx-viz-value" x={x + BAR_W / 2} y={top + CHART_H - barH - waterH - 4} textAnchor="middle">{value}{water[index] ? `+${water[index]}` : ""}</text>
            <text className="dcx-viz-index" x={x + BAR_W / 2} y={top + CHART_H + 13} textAnchor="middle">{index}</text>
            {pointersAt[index] && <text className="dcx-viz-ptr" x={x + BAR_W / 2} y={top + CHART_H + 30} textAnchor="middle">{pointersAt[index].join(" ")}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function BarsViz({ artifact }) {
  return (
    <FramePlayer icon={BarChart3} kicker="Bars" title={artifact.title} frames={artifact.frames}>
      {(frame) => (
        <>
          <BarsFrame frame={frame} overlayLabel={artifact.overlayLabel} />
          {frame.water && <div className="dcx-viz-legend"><span className="is-bar" /> height <span className="is-water" /> {artifact.overlayLabel} (total {frame.water.reduce((sum, value) => sum + (value || 0), 0)})</div>}
        </>
      )}
    </FramePlayer>
  );
}

/* ── Linked list ───────────────────────────────────────────────────────── */

const BOX_W = 48;
const BOX_H = 34;
const BOX_GAP = 38;

function LinkedListFrame({ frame, markerId }) {
  const width = frame.nodes.length * (BOX_W + BOX_GAP) + 40;
  const y = 58;
  const x = (index) => 20 + index * (BOX_W + BOX_GAP);
  const pointersAt = {};
  Object.entries(frame.pointers).forEach(([name, at]) => { if (Number.isInteger(at)) (pointersAt[at] ||= []).push(name); });
  const nullPointers = Object.entries(frame.pointers).filter(([, at]) => at === null).map(([name]) => name);
  return (
    <svg className="dcx-viz-svg" width={width} height={148} viewBox={`0 0 ${width} 148`} role="img" aria-label="Linked list">
      <defs><marker id={markerId} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" className="dcx-viz-arrow is-on" /></marker></defs>
      {frame.links.map(([from, to], index) => {
        if (from < 0 || from >= frame.nodes.length) return null;
        const startX = x(from) + BOX_W / 2;
        if (to === null || to >= frame.nodes.length) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <g key={index}>
              <line x1={startX} y1={y + BOX_H} x2={startX} y2={y + BOX_H + 22} className="dcx-viz-edge is-on" markerEnd={`url(#${markerId})`} />
              <text className="dcx-viz-null" x={startX} y={y + BOX_H + 36} textAnchor="middle">null</text>
            </g>
          );
        }
        const forward = to > from;
        const endX = x(to) + (forward ? 0 : BOX_W);
        if (forward && to === from + 1) {
          // eslint-disable-next-line react/no-array-index-key
          return <line key={index} x1={x(from) + BOX_W} y1={y + BOX_H / 2} x2={endX - 2} y2={y + BOX_H / 2} className="dcx-viz-edge is-on" markerEnd={`url(#${markerId})`} />;
        }
        const lift = 26 + Math.abs(to - from) * 6;
        const sx = forward ? x(from) + BOX_W : x(from);
        // eslint-disable-next-line react/no-array-index-key
        return <path key={index} d={`M ${sx} ${y} C ${sx} ${y - lift}, ${endX} ${y - lift}, ${endX} ${y - 2}`} className="dcx-viz-edge is-on is-curve" markerEnd={`url(#${markerId})`} />;
      })}
      {frame.nodes.map((value, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <g key={index} className={`dcx-viz-node is-box${frame.highlight.includes(index) ? " is-active" : ""}`}>
          <rect x={x(index)} y={y} width={BOX_W} height={BOX_H} rx={7} />
          <text x={x(index) + BOX_W / 2} y={y + BOX_H / 2} dy="0.35em" textAnchor="middle">{pretty(value)}</text>
          {pointersAt[index] && <text className="dcx-viz-ptr" x={x(index) + BOX_W / 2} y={y + BOX_H + 50} textAnchor="middle">{pointersAt[index].join(" ")}</text>}
        </g>
      ))}
      {nullPointers.length > 0 && <text className="dcx-viz-ptr" x={width - 10} y={20} textAnchor="end">{nullPointers.join(" ")} = null</text>}
    </svg>
  );
}

export function LinkedListViz({ artifact }) {
  const markerId = `dcx-ll-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return <FramePlayer icon={Link2} kicker="Linked list" title={artifact.title} frames={artifact.frames}>{(frame) => <LinkedListFrame frame={frame} markerId={markerId} />}</FramePlayer>;
}
