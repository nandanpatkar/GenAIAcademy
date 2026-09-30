import React, { memo, useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, Handle, MarkerType, MiniMap, Position } from "reactflow";
import "reactflow/dist/style.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot, Box, Brain, ChevronLeft, ChevronRight, Database, FileText, Flag, GitBranch, Globe, Layers, MessageSquare, Pause, Play, ScrollText, Search, ShieldCheck, Wrench,
} from "lucide-react";
import { layeredLayout } from "./layout";

/**
 * A `flow` artifact drawn with React Flow: laid out automatically (layered,
 * loops drawn as dashed curves), node kinds get an icon and colour, groups
 * become labelled regions, and `steps` play as a walkthrough that lights up
 * the active nodes and edges. Loaded lazily (React Flow is only fetched when
 * a flow is shown).
 */

const NODE_W = 196;
const NODE_H = 62;
const GROUP_PAD = 26;

const KINDS = [
  [/^(input|user|query|question|start|client|request)/, "input", MessageSquare],
  [/^(llm|model|generator|generate|gpt|claude|reader|synth)/, "llm", Brain],
  [/^(agent|planner|orchestrator|controller|supervisor)/, "agent", Bot],
  [/^(tool|function|action|executor|api_call)/, "tool", Wrench],
  [/^(retriev|search|rank|rerank|lookup)/, "retriever", Search],
  [/^(store|db|database|vector|index|memory|cache|kb|knowledge)/, "store", Database],
  [/^(decision|router|route|condition|branch|gate|if)/, "decision", GitBranch],
  [/^(eval|grader|grade|critic|judge|check|verify|reflect|guard)/, "eval", ShieldCheck],
  [/^(doc|document|chunk|file|source|corpus)/, "doc", FileText],
  [/^(prompt|template|context)/, "prompt", ScrollText],
  [/^(web|external|internet|service|http)/, "web", Globe],
  [/^(output|answer|response|end|result|final)/, "output", Flag],
];
const kindOf = (kind) => KINDS.find(([pattern]) => pattern.test(kind || "")) || [null, "process", Box];

const FlowNode = memo(({ data }) => {
  const [, kind, Icon] = kindOf(data.kind);
  const vertical = data.direction === "TB";
  return (
    <div className={`dcx-flow-node is-${kind}${data.active ? " is-active" : ""}${data.dim ? " is-dim" : ""}${data.selected ? " is-selected" : ""}`}>
      <Handle type="target" position={vertical ? Position.Top : Position.Left} />
      <span className="dcx-flow-icon"><Icon size={15} /></span>
      <span className="dcx-flow-text"><b>{data.label}</b>{data.sublabel && <small>{data.sublabel}</small>}</span>
      <Handle type="source" position={vertical ? Position.Bottom : Position.Right} />
    </div>
  );
});

const GroupNode = memo(({ data }) => <div className={`dcx-flow-group${data.dim ? " is-dim" : ""}`}><span>{data.label}</span></div>);

const NODE_TYPES = { dcx: FlowNode, dcxGroup: GroupNode };

export default function FlowArtifact({ artifact, full = false, isDark = true }) {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState("");
  const [flow, setFlow] = useState(null);
  const { steps } = artifact;
  const current = step >= 0 ? steps[step] : null;

  const layout = useMemo(() => layeredLayout(
    artifact.nodes.map((node) => ({ id: node.id, group: node.group })),
    artifact.edges,
    { direction: artifact.direction, nodeWidth: NODE_W, nodeHeight: NODE_H, gapX: artifact.direction === "TB" ? 60 : 90, gapY: artifact.direction === "TB" ? 40 : 34 },
  ), [artifact]);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setStep((value) => {
      if (value >= steps.length - 1) { setPlaying(false); return value; }
      return value + 1;
    }), 2200);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const activeNodes = useMemo(() => new Set(current?.nodes || []), [current]);
  const activeEdges = useMemo(() => {
    if (!current) return new Set();
    if (current.edges.length) return new Set(current.edges);
    return new Set(artifact.edges.filter((edge) => activeNodes.has(edge.source) && activeNodes.has(edge.target)).map((edge) => `${edge.source}->${edge.target}`));
  }, [current, artifact.edges, activeNodes]);

  const nodes = useMemo(() => {
    const position = (node) => node.position || layout.positions[node.id] || { x: 0, y: 0 };
    const groupNodes = artifact.groups.filter((group) => group.nodes.length).map((group) => {
      const points = group.nodes.map((id) => position(artifact.nodes.find((node) => node.id === id)));
      const minX = Math.min(...points.map((point) => point.x)) - GROUP_PAD;
      const minY = Math.min(...points.map((point) => point.y)) - GROUP_PAD - 14;
      const maxX = Math.max(...points.map((point) => point.x)) + NODE_W + GROUP_PAD;
      const maxY = Math.max(...points.map((point) => point.y)) + NODE_H + GROUP_PAD;
      return {
        id: `group:${group.id}`,
        type: "dcxGroup",
        position: { x: minX, y: minY },
        data: { label: group.label, dim: Boolean(current) && !group.nodes.some((id) => activeNodes.has(id)) },
        style: { width: maxX - minX, height: maxY - minY },
        draggable: false,
        selectable: false,
        zIndex: -1,
      };
    });
    const flowNodes = artifact.nodes.map((node) => ({
      id: node.id,
      type: "dcx",
      position: position(node),
      data: { ...node, direction: artifact.direction, active: activeNodes.has(node.id), dim: Boolean(current) && !activeNodes.has(node.id), selected: selected === node.id },
      style: { width: NODE_W },
    }));
    return [...groupNodes, ...flowNodes];
  }, [artifact, layout, activeNodes, current, selected]);

  const edges = useMemo(() => artifact.edges.map((edge) => {
    const key = `${edge.source}->${edge.target}`;
    const loop = layout.backEdges.has(key);
    const active = activeEdges.has(key);
    const color = active ? "var(--ws-brand, #327cf6)" : "var(--dcx-flow-edge, #5b6272)";
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label || undefined,
      type: loop ? "default" : "smoothstep",
      animated: active || edge.animated,
      className: `${active ? "is-active" : ""}${current && !active ? " is-dim" : ""}`,
      style: { stroke: color, strokeWidth: active ? 2.2 : 1.4, strokeDasharray: loop || edge.dashed ? "6 5" : undefined },
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      labelBgPadding: [6, 3],
      labelBgBorderRadius: 6,
    };
  }), [artifact.edges, layout, activeEdges, current]);

  // Keep text legible: the overview fits the whole graph but never below a
  // readable zoom, and each walkthrough step pans/zooms to its active nodes.
  const overviewZoom = full ? 0.35 : 0.5;
  useEffect(() => {
    if (!flow) return undefined;
    const timer = window.setTimeout(() => {
      if (current && current.nodes.length) flow.fitView({ nodes: current.nodes.map((id) => ({ id })), padding: full ? 0.6 : 0.35, maxZoom: 1.15, minZoom: 0.45, duration: 550 });
      else flow.fitView({ padding: 0.12, minZoom: overviewZoom, maxZoom: 1.1, duration: 400 });
    }, 30);
    return () => window.clearTimeout(timer);
  }, [flow, current, full, overviewZoom]);

  const selectedNode = artifact.nodes.find((node) => node.id === selected);

  return (
    <div className={`dcx-flow${full ? " is-full" : ""}`}>
      {artifact.description && !full && <p className="dcx-flow-desc">{artifact.description}</p>}
      <div className="dcx-flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onInit={setFlow}
          fitView
          fitViewOptions={{ padding: 0.12, minZoom: overviewZoom, maxZoom: 1.1 }}
          minZoom={0.2}
          maxZoom={1.8}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => { if (node.type === "dcx") setSelected((value) => (value === node.id ? "" : node.id)); }}
          onPaneClick={() => setSelected("")}
          panOnScroll={full}
          zoomOnScroll={full}
          preventScrolling={full}
        >
          <Background gap={18} size={1} color={isDark ? "#2a2e37" : "#dfe4ec"} />
          <Controls showInteractive={false} />
          {full && <MiniMap pannable zoomable nodeColor={(node) => (node.type === "dcxGroup" ? "transparent" : node.data?.active ? "#327cf6" : isDark ? "#3a3f4b" : "#c9d1dd")} maskColor={isDark ? "rgba(10,10,12,.6)" : "rgba(240,242,246,.6)"} />}
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="dcx-flow-detail">
          <b>{selectedNode.label}</b>
          {selectedNode.detail ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedNode.detail}</ReactMarkdown> : <p>{selectedNode.sublabel || "No extra detail for this step."}</p>}
        </div>
      )}

      {steps.length > 0 && (
        <div className="dcx-flow-steps">
          <div className="dcx-flow-step-text" aria-live="polite">
            <small>{current ? `Step ${step + 1} of ${steps.length}` : `${steps.length}-step walkthrough`}</small>
            <b>{current ? current.title : "Overview — press play to walk through it"}</b>
            {current?.note && <ReactMarkdown remarkPlugins={[remarkGfm]}>{current.note}</ReactMarkdown>}
          </div>
          <div className="dcx-trace-controls">
            <button type="button" className="dcx-icon" onClick={() => { setPlaying(false); setStep(-1); }} aria-label="Overview" title="Overview"><Layers size={14} /></button>
            <button type="button" className="dcx-icon" onClick={() => { setPlaying(false); setStep((value) => Math.max(-1, value - 1)); }} disabled={step < 0} aria-label="Previous step"><ChevronLeft size={15} /></button>
            <button type="button" className="dcx-icon is-primary" onClick={() => { if (step >= steps.length - 1) setStep(-1); setPlaying((value) => !value); if (step < 0) setStep(0); }} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>
            <button type="button" className="dcx-icon" onClick={() => { setPlaying(false); setStep((value) => Math.min(steps.length - 1, value + 1)); }} disabled={step >= steps.length - 1} aria-label="Next step"><ChevronRight size={15} /></button>
            <input type="range" min={-1} max={steps.length - 1} value={step} onChange={(event) => { setPlaying(false); setStep(Number(event.target.value)); }} aria-label="Step" />
            <span className="dcx-trace-count">{step + 1} / {steps.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
