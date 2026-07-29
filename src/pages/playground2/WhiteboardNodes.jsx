import { memo } from "react";
import { Handle, NodeResizer, Position } from "reactflow";
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  FileJson,
  FileText,
  GitBranch,
  Globe2,
  KeyRound,
  Layers3,
  Lightbulb,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  User,
  Users,
  Zap,
} from "lucide-react";

const ICONS = {
  Bot, BrainCircuit, CheckCircle2, Cloud, Code2, Database, FileJson, FileText,
  GitBranch, Globe2, KeyRound, Layers3, Lightbulb, MessageSquare, Network,
  ShieldCheck, Sparkles, Star, Target, User, Users, Zap,
};

const clipPaths = {
  diamond: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
  hexagon: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)",
  parallelogram: "polygon(14% 0,100% 0,86% 100%,0 100%)",
  triangle: "polygon(50% 0,100% 100%,0 100%)",
};

const resizeProps = {
  minWidth: 90,
  minHeight: 56,
  lineClassName: "g2-resizer-line",
  handleClassName: "g2-resizer-handle",
};

function Ports() {
  return <>
    <Handle type="source" position={Position.Left} id="left-out" className="g2-wb-port" style={{ top: "43%" }} />
    <Handle type="target" position={Position.Left} id="left-in" className="g2-wb-port" style={{ top: "57%" }} />
    <Handle type="source" position={Position.Right} id="right-out" className="g2-wb-port" style={{ top: "43%" }} />
    <Handle type="target" position={Position.Right} id="right-in" className="g2-wb-port" style={{ top: "57%" }} />
    <Handle type="source" position={Position.Top} id="top-out" className="g2-wb-port" style={{ left: "43%" }} />
    <Handle type="target" position={Position.Top} id="top-in" className="g2-wb-port" style={{ left: "57%" }} />
    <Handle type="source" position={Position.Bottom} id="bottom-out" className="g2-wb-port" style={{ left: "43%" }} />
    <Handle type="target" position={Position.Bottom} id="bottom-in" className="g2-wb-port" style={{ left: "57%" }} />
  </>;
}

export const WhiteboardShapeNode = memo(({ id, data, selected }) => {
  const shape = data.shape || "rectangle";
  const style = data.style || {};
  const clipped = clipPaths[shape];
  const borderRadius = shape === "ellipse" ? "50%" : shape === "rounded" ? 24 : shape === "document" ? 10 : 10;
  return <div className={`g2-wb-shape-wrap ${selected ? "is-selected" : ""}`}>
    <NodeResizer {...resizeProps} isVisible={selected} onResizeStart={data.onHistory} />
    <Ports />
    <div
      className={`g2-wb-shape g2-wb-shape-${shape}`}
      style={{
        "--wb-fill": style.fill || "#ffffff",
        "--wb-stroke": style.stroke || "#7c3aed",
        "--wb-text": style.text || "#172033",
        "--wb-radius": `${borderRadius}px`,
        clipPath: clipped,
      }}
    >
      <textarea
        className="nodrag nowheel"
        value={data.label || ""}
        onChange={(event) => data.onTextChange?.(id, event.target.value)}
        onFocus={data.onHistory}
        onPointerDown={(event) => { data.onSelect?.(id); event.stopPropagation(); }}
        aria-label="Shape text"
        spellCheck
      />
      {data.subtitle && <small>{data.subtitle}</small>}
    </div>
  </div>;
});

export const WhiteboardNoteNode = memo(({ id, data, selected }) => {
  const style = data.style || {};
  return <div className={`g2-wb-note ${selected ? "is-selected" : ""}`} style={{ "--note-fill": style.fill || "#fef3a5", "--note-text": style.text || "#4a3710" }}>
    <NodeResizer {...resizeProps} minWidth={130} minHeight={110} isVisible={selected} onResizeStart={data.onHistory} />
    <Ports />
    <span className="g2-wb-note-fold" />
    <textarea
      className="nodrag nowheel"
      value={data.label || ""}
      onChange={(event) => data.onTextChange?.(id, event.target.value)}
      onFocus={data.onHistory}
      onPointerDown={(event) => { data.onSelect?.(id); event.stopPropagation(); }}
      placeholder="Type an idea…"
      aria-label="Sticky note"
    />
    {data.author && <small>{data.author}</small>}
  </div>;
});

export const WhiteboardTextNode = memo(({ id, data, selected }) => <div className={`g2-wb-text ${selected ? "is-selected" : ""}`} style={{ "--text-color": data.style?.text || "#172033" }}>
  <NodeResizer {...resizeProps} minWidth={80} minHeight={38} isVisible={selected} onResizeStart={data.onHistory} />
  <textarea
    className="nodrag nowheel"
    value={data.label || ""}
    onChange={(event) => data.onTextChange?.(id, event.target.value)}
    onFocus={data.onHistory}
    onPointerDown={(event) => { data.onSelect?.(id); event.stopPropagation(); }}
    aria-label="Canvas text"
  />
</div>);

export const WhiteboardFrameNode = memo(({ id, data, selected }) => <div className={`g2-wb-frame ${selected ? "is-selected" : ""}`} style={{ "--frame-color": data.style?.stroke || "#8b5cf6" }}>
  <NodeResizer minWidth={260} minHeight={180} lineClassName="g2-resizer-line" handleClassName="g2-resizer-handle" isVisible={selected} onResizeStart={data.onHistory} />
  <input
    className="nodrag"
    value={data.label || ""}
    onChange={(event) => data.onTextChange?.(id, event.target.value)}
    onFocus={data.onHistory}
    onPointerDown={(event) => { data.onSelect?.(id); event.stopPropagation(); }}
    aria-label="Frame title"
  />
  {data.subtitle && <small>{data.subtitle}</small>}
</div>);

export const WhiteboardIconNode = memo(({ id, data, selected }) => {
  const Icon = ICONS[data.icon] || Sparkles;
  return <div className={`g2-wb-icon-card ${selected ? "is-selected" : ""}`} style={{ "--icon-color": data.style?.stroke || "#7c3aed" }}>
    <NodeResizer {...resizeProps} minWidth={90} minHeight={86} isVisible={selected} onResizeStart={data.onHistory} />
    <Ports />
    <span><Icon size={28} /></span>
    <input
      className="nodrag"
      value={data.label || ""}
      onChange={(event) => data.onTextChange?.(id, event.target.value)}
      onFocus={data.onHistory}
      onPointerDown={(event) => { data.onSelect?.(id); event.stopPropagation(); }}
      aria-label="Icon label"
    />
  </div>;
});

export const WhiteboardStrokeNode = memo(({ data, selected }) => {
  const points = Array.isArray(data.points) ? data.points : [];
  return <div className={`g2-wb-stroke ${selected ? "is-selected" : ""}`}>
    <NodeResizer minWidth={12} minHeight={12} lineClassName="g2-resizer-line" handleClassName="g2-resizer-handle" isVisible={selected} onResizeStart={data.onHistory} />
    <svg viewBox={`0 0 ${Math.max(1, data.viewWidth || 1)} ${Math.max(1, data.viewHeight || 1)}`} preserveAspectRatio="none">
      <polyline
        points={points.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="none"
        stroke={data.color || "#172033"}
        strokeWidth={data.strokeWidth || 3}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>;
});
