import { useState, useEffect } from "react";
import { X, Check, Copy, Trash2, ChevronDown, ExternalLink, AlertCircle, CheckCircle, Info, Minimize2 } from "lucide-react";
import { COLORS, COLOR_OVERRIDES, PORT_TYPES } from "../data/nodes.js";

const STATUS_OPTIONS = [
  { value: "planned",     label: "Planned",     color: "#64748b" },
  { value: "in_progress", label: "In Progress", color: "#38bdf8" },
  { value: "done",        label: "Done",        color: "#34d399" },
];

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 11 }}>
    <div style={{ fontSize: 8.5, color: "var(--pg-text3)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>{label}</div>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", background: "var(--pg-panel)", border: "1px solid var(--pg-border)",
  borderRadius: 5, color: "var(--pg-text)", fontSize: 11, padding: "5px 8px",
  fontFamily: "'DM Mono',monospace", outline: "none", boxSizing: "border-box",
};

export default function InspectorPanel({ node, issues = [], onClose, onUpdate, onDelete, onDuplicate }) {
  const [label,    setLabel]    = useState(node.data.label    || "");
  const [note,     setNote]     = useState(node.data.note     || "");
  const [status,   setStatus]   = useState(node.data.status   || "planned");
  const [collapse, setCollapse] = useState(node.data.collapsed|| false);
  const [override, setOverride] = useState(node.data.colorOverride || null);
  const [inPort,   setInPort]   = useState(node.data.inputPort  || "any");
  const [outPort,  setOutPort]  = useState(node.data.outputPort || "any");
  const [activeTab,setActiveTab]= useState("edit"); // "edit" | "info" | "issues"

  // Sync when node changes
  useEffect(() => {
    setLabel(node.data.label || "");
    setNote(node.data.note || "");
    setStatus(node.data.status || "planned");
    setCollapse(node.data.collapsed || false);
    setOverride(node.data.colorOverride || null);
    setInPort(node.data.inputPort || "any");
    setOutPort(node.data.outputPort || "any");
  }, [node.id]);

  const col = COLORS[override || node.data.colorKey] || COLORS.agent;
  const nodeIssues = issues.filter(i => i.nodeId === node.id);

  const save = () => onUpdate(node.id, { label, note, status, collapsed: collapse, colorOverride: override, inputPort: inPort, outputPort: outPort });

  return (
    <div style={{ width: 264, minWidth: 264, background: "var(--pg-sidebar)", borderLeft: "1px solid var(--pg-border)", display: "flex", flexDirection: "column", fontFamily: "'DM Mono',monospace", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--pg-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 8.5, color: col.bg, textTransform: "uppercase", letterSpacing: "0.1em" }}>Node Inspector</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pg-text3)", padding: 2 }}><X size={13} /></button>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 2 }}>
          {[
            { id: "edit",   label: "Edit"   },
            { id: "info",   label: "Info"   },
            { id: "issues", label: `Issues${nodeIssues.length ? ` (${nodeIssues.length})` : ""}` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, background: "none", border: `1px solid ${activeTab === tab.id ? col.bg : "var(--pg-border)"}`, borderRadius: 4, padding: "4px 4px", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: activeTab === tab.id ? 700 : 400, color: activeTab === tab.id ? col.bg : "var(--pg-text3)", transition: "all 0.12s" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>

        {activeTab === "edit" && (<>
          {/* Node type badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "7px 8px", background: col.dim, border: `1px solid ${col.border}`, borderRadius: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--pg-text)" }}>{node.data.nodeType?.toUpperCase()}</div>
              <div style={{ fontSize: 8.5, color: "var(--pg-text2)" }}>{node.data.sub}</div>
            </div>
            {node.data.cost && <div style={{ fontSize: 8, color: "#34d399", background: "#34d3991a", border: "1px solid #34d39933", padding: "2px 5px", borderRadius: 3 }}>💰 {node.data.cost}</div>}
          </div>

          <Field label="Label">
            <input value={label} onChange={e => setLabel(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = col.bg} onBlur={e => e.target.style.borderColor = "var(--pg-border)"} />
          </Field>

          <Field label="Status">
            <div style={{ display: "flex", gap: 5 }}>
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setStatus(opt.value)}
                  style={{ flex: 1, background: status === opt.value ? opt.color + "22" : "transparent", border: `1px solid ${status === opt.value ? opt.color : "var(--pg-border)"}`, borderRadius: 4, color: status === opt.value ? opt.color : "var(--pg-text3)", fontSize: 8.5, padding: "4px 2px", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontWeight: status === opt.value ? 700 : 400, transition: "all 0.12s" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Color Override">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              <button onClick={() => setOverride(null)}
                style={{ width: 20, height: 20, borderRadius: 4, background: "var(--pg-panel)", border: `2px solid ${!override ? "var(--pg-text)" : "var(--pg-border)"}`, cursor: "pointer", fontSize: 10, color: "var(--pg-text3)" }}>✕</button>
              {COLOR_OVERRIDES.map(c => (
                <button key={c} onClick={() => setOverride(c)}
                  style={{ width: 20, height: 20, borderRadius: 4, background: c, border: `2px solid ${override === c ? "var(--pg-text)" : "transparent"}`, cursor: "pointer" }} />
              ))}
            </div>
          </Field>

          <Field label="Input Port Type">
            <select value={inPort} onChange={e => setInPort(e.target.value)}
              style={{ ...inputStyle, background: "#161b22" }}>
              {Object.entries(PORT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>

          <Field label="Output Port Type">
            <select value={outPort} onChange={e => setOutPort(e.target.value)}
              style={{ ...inputStyle, background: "#161b22" }}>
              {Object.entries(PORT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>

          <Field label="Annotation / Note">
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add a note..."
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = col.bg} onBlur={e => e.target.style.borderColor = "var(--pg-border)"} />
          </Field>

          <Field label="Display">
            <button onClick={() => setCollapse(!collapse)}
              style={{ width: "100%", background: collapse ? col.dim : "transparent", border: `1px solid ${collapse ? col.bg : "#30363d"}`, borderRadius: 5, color: collapse ? col.bg : "#484f58", fontSize: 9.5, padding: "6px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.12s" }}>
              <Minimize2 size={11} /> {collapse ? "Collapsed (click to expand)" : "Collapse node"}
            </button>
          </Field>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            <button onClick={save}
              style={{ background: col.bg, border: "none", borderRadius: 5, color: "#fff", fontSize: 10, fontWeight: 700, padding: "7px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Check size={11} /> Save Changes
            </button>
            <button onClick={() => onDuplicate(node.id)}
              style={{ background: "transparent", border: "1px solid var(--pg-border)", borderRadius: 5, color: "var(--pg-text2)", fontSize: 10, padding: "6px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.color = "var(--pg-accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--pg-border)"; e.currentTarget.style.color = "var(--pg-text2)"; }}>
              <Copy size={11} /> Duplicate
            </button>
            <button onClick={() => { onDelete(node.id); onClose(); }}
              style={{ background: "transparent", border: "1px solid var(--pg-border)", borderRadius: 5, color: "var(--pg-text2)", fontSize: 10, padding: "6px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--pg-border)"; e.currentTarget.style.color = "var(--pg-text2)"; }}>
              <Trash2 size={11} /> Delete Node
            </button>
          </div>
        </>)}

        {activeTab === "info" && (<>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--pg-text)", marginBottom: 8 }}>{node.data.label}</div>
          <div style={{ fontSize: 10, color: "var(--pg-text2)", lineHeight: 1.7, marginBottom: 14 }}>
            {node.data.info || "No description available for this node."}
          </div>
          {node.data.cost && (
            <div style={{ padding: "8px 10px", background: "#064e3b", border: "1px solid #34d39933", borderRadius: 6, marginBottom: 10 }}>
              <div style={{ fontSize: 8.5, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Estimated Cost</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#34d399" }}>{node.data.cost}</div>
            </div>
          )}
          {node.data.docsUrl && (
            <a href={node.data.docsUrl} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#818cf8", textDecoration: "none", padding: "6px 8px", background: "#818cf811", border: "1px solid #818cf833", borderRadius: 5 }}>
              <ExternalLink size={11} /> View Documentation
            </a>
          )}
          {/* Port info */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 8.5, color: "var(--pg-text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Port Types</div>
            {[{ side: "Input", type: node.data.inputPort }, { side: "Output", type: node.data.outputPort }].map(p => {
              const pt = PORT_TYPES[p.type] || PORT_TYPES.any;
              return (
                <div key={p.side} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, padding: "5px 7px", background: "var(--pg-panel)", borderRadius: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: pt.color, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 8.5, color: "var(--pg-text3)" }}>{p.side}:</span>{" "}
                    <span style={{ fontSize: 9, color: pt.color, fontWeight: 700 }}>{pt.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {activeTab === "issues" && (<>
          {nodeIssues.length === 0
            ? <div style={{ textAlign: "center", padding: "20px 0", color: "var(--pg-text3)" }}>
                <CheckCircle size={24} style={{ marginBottom: 8, color: "#34d399" }} />
                <div style={{ fontSize: 10 }}>No issues with this node</div>
              </div>
            : nodeIssues.map((issue, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "8px", background: issue.type === "error" ? "#f8717111" : issue.type === "warning" ? "#fbbf2411" : "var(--pg-accent)11", border: `1px solid ${issue.type === "error" ? "#f8717133" : issue.type === "warning" ? "#fbbf2433" : "var(--pg-accent)33"}`, borderRadius: 6, marginBottom: 6 }}>
                  {issue.type === "error" ? <AlertCircle size={12} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} /> : <Info size={12} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />}
                  <div style={{ fontSize: 9.5, color: "var(--pg-text)", lineHeight: 1.5 }}>{issue.message}</div>
                </div>
              ))
          }
        </>)}
      </div>

      <div style={{ padding: "6px 12px", borderTop: "1px solid var(--pg-border)", fontSize: 8, color: "var(--pg-text3)" }}>id: {node.id}</div>
    </div>
  );
}
