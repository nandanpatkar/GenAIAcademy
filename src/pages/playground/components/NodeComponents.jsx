import { memo, useState } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { COLORS, PORT_TYPES } from "../data/nodes.js";

// ─── Icon renderer (inline to avoid cross-file issues in Vite) ────────────────
// Uses lucide via CDN string names stored in data — we import them dynamically
// via a central map in the parent. Here we receive icon as a string prop
// and the parent passes the rendered element as `data.iconEl`.

const STATUS_COLORS = {
  planned:     { bg: "rgba(100, 116, 139, 0.15)", text: "#64748b", label: "Planned"     },
  in_progress: { bg: "rgba(56, 189, 248, 0.15)",  text: "#38bdf8", label: "In Progress" },
  done:        { bg: "rgba(52, 211, 153, 0.15)",  text: "#34d399", label: "Done"        },
};

// ─── Main GenAI Node ──────────────────────────────────────────────────────────
export const GenAINode = memo(({ id, data, selected }) => {
  const col    = COLORS[data.colorOverride || data.colorKey] || COLORS.agent;
  const status = STATUS_COLORS[data.status] || STATUS_COLORS.planned;
  const inPort  = PORT_TYPES[data.inputPort]  || PORT_TYPES.any;
  const outPort = PORT_TYPES[data.outputPort] || PORT_TYPES.any;

  if (data.collapsed) {
    return (
      <div style={{
        background: "var(--pg-sidebar)", border: `1.5px solid ${selected ? col.bg : col.border}`,
        borderRadius: 8, padding: "6px 10px", minWidth: 140,
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "'DM Mono',monospace",
        boxShadow: selected ? `0 0 0 2px ${col.bg}44` : "0 2px 8px rgba(0,0,0,0.2)",
      }}>
        <Handle type="target" position={Position.Left} id="in" style={{ background: inPort.color, border: "2px solid var(--pg-sidebar)", width: 8, height: 8, left: -5 }} />
        <div style={{ width: 18, height: 18, borderRadius: 4, background: col.dim, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {data.iconEl}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--pg-text)" }}>{data.label}</span>
        <Handle type="source" position={Position.Right} id="out" style={{ background: outPort.color, border: "2px solid var(--pg-sidebar)", width: 8, height: 8, right: -5 }} />
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(145deg, var(--pg-sidebar) 0%, var(--pg-panel) 100%)",
      border: `1.5px solid ${selected ? col.bg : col.border}`,
      borderRadius: 10, minWidth: 190, maxWidth: 260,
      boxShadow: selected
        ? `0 0 0 2px ${col.bg}44, 0 6px 24px ${col.bg}22`
        : "0 2px 10px rgba(0,0,0,0.5)",
      transition: "all 0.15s", fontFamily: "'DM Mono',monospace", overflow: "hidden",
    }}>
      <NodeResizer minWidth={190} minHeight={80} isVisible={selected} lineStyle={{ border: `1px solid ${col.bg}` }} handleStyle={{ background: col.bg, width: 7, height: 7 }} />

      {/* Color bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg,${col.bg},${col.bg}33)` }} />

      {/* Input handle with port type tooltip */}
      <div title={`Input: ${inPort.label}`}>
        <Handle type="target" position={Position.Left} id="in"
          style={{ background: inPort.color, border: "2px solid var(--pg-sidebar)", width: 10, height: 10, left: -6, borderRadius: "50%" }} />
      </div>

      {/* Header */}
      <div style={{ padding: "8px 10px 6px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${col.border}` }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: col.dim, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {data.iconEl}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pg-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.label}</div>
          <div style={{ fontSize: 8, color: col.bg, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>{data.nodeType}</div>
        </div>
        {/* Status badge */}
        <div style={{ background: status.bg, color: status.text, fontSize: 7, fontWeight: 700, padding: "2px 5px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
          {status.label}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "6px 10px 8px" }}>
        <div style={{ fontSize: 9.5, color: "var(--pg-text2)", lineHeight: 1.5 }}>{data.sub}</div>
        {data.note && (
          <div style={{ marginTop: 5, fontSize: 9, color: "#fbbf24", background: "#fbbf2411", border: "1px solid #fbbf2433", borderRadius: 4, padding: "3px 6px", lineHeight: 1.4 }}>
            📝 {data.note}
          </div>
        )}
        {data.cost && (
          <div style={{ marginTop: 4, fontSize: 8.5, color: "#34d399", background: "#34d3991a", border: "1px solid #34d39933", borderRadius: 3, padding: "2px 5px", display: "inline-block" }}>
            💰 {data.cost}
          </div>
        )}
        {/* Port labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 7.5, color: inPort.color, opacity: 0.8 }}>← {inPort.label}</span>
          <span style={{ fontSize: 7.5, color: outPort.color, opacity: 0.8 }}>{outPort.label} →</span>
        </div>
      </div>

      {/* Output handle */}
      <div title={`Output: ${outPort.label}`}>
        <Handle type="source" position={Position.Right} id="out"
          style={{ background: outPort.color, border: "2px solid var(--pg-sidebar)", width: 10, height: 10, right: -6, borderRadius: "50%" }} />
      </div>
    </div>
  );
});

// ─── Sticky Note Node ─────────────────────────────────────────────────────────
export const NoteNode = memo(({ id, data, selected }) => {
  const [text, setText] = useState(data.text || "");

  return (
    <div style={{
      background: "var(--pg-panel)", border: `1.5px solid ${selected ? "#facc15" : "#facc1544"}`,
      borderRadius: 8, padding: 10, minWidth: 180, maxWidth: 300,
      boxShadow: selected ? "0 0 0 2px #facc1533" : "0 2px 8px rgba(0,0,0,0.1)",
      fontFamily: "'DM Mono',monospace",
    }}>
      <NodeResizer minWidth={160} minHeight={80} isVisible={selected} lineStyle={{ border: "1px solid #facc15" }} handleStyle={{ background: "#facc15", width: 7, height: 7 }} />
      <div style={{ fontSize: 8.5, color: "#facc15", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
        📝 Sticky Note
      </div>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); if (data.onChange) data.onChange(id, e.target.value); }}
        placeholder="Type a note..."
        className="nodrag"
        style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--pg-text)", fontSize: 11, lineHeight: 1.6, resize: "none", minHeight: 60, fontFamily: "'DM Mono',monospace", boxSizing: "border-box" }}
      />
    </div>
  );
});

// ─── Group / Bounding Box Node ────────────────────────────────────────────────
export const GroupNode = memo(({ id, data, selected }) => {
  return (
    <div style={{
      border: `2px dashed ${selected ? data.color || "#6b7280" : (data.color || "#6b7280") + "66"}`,
      borderRadius: 14, background: (data.color || "#6b7280") + "0a",
      minWidth: 300, minHeight: 200, position: "relative",
      fontFamily: "'DM Mono',monospace",
    }}>
      <NodeResizer minWidth={280} minHeight={180} isVisible={selected}
        lineStyle={{ border: `1px solid ${data.color || "#6b7280"}` }}
        handleStyle={{ background: data.color || "#6b7280", width: 8, height: 8 }} />
      <div style={{
        position: "absolute", top: -12, left: 14,
        background: "var(--pg-sidebar)", padding: "2px 10px", borderRadius: 4,
        fontSize: 10, fontWeight: 700, color: data.color || "var(--pg-text2)",
        border: `1px solid ${(data.color || "#6b7280") + "44"}`,
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {data.label || "Group"}
      </div>
    </div>
  );
});
