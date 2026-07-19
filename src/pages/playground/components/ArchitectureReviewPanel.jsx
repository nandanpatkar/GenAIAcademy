import React from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Info, Link2, PanelRight, ShieldCheck, Sparkles, X } from "lucide-react";
import { PHASES } from "./DesignBriefPanel";

function getHealth(nodes, edges) {
  const issues = [];
  if (!nodes.length) issues.push({ type: "info", text: "Start with a template or add an entry point to begin the design." });
  if (nodes.length && !nodes.some(node => node.data?.nodeType === "io" || node.data?.colorKey === "io")) issues.push({ type: "warning", text: "No user-facing entry or response node is mapped yet." });
  if (nodes.length && !edges.length) issues.push({ type: "warning", text: "The data plane is disconnected. Connect the major stages before reviewing it." });
  if (nodes.length > 1 && edges.length < nodes.length - 1) issues.push({ type: "warning", text: "Some components may be isolated from the main request path." });
  if (nodes.length && !nodes.some(node => ["security", "observ", "eval"].includes(node.data?.nodeType) || ["security", "observ", "eval"].includes(node.data?.colorKey))) issues.push({ type: "warning", text: "Add guardrails, evaluation, or observability for a production-ready design." });
  return issues;
}

export default function ArchitectureReviewPanel({ nodes, edges, selectedNode, onClose, onInspect, compact = false }) {
  const issues = getHealth(nodes, edges);
  const covered = PHASES.filter(phase => nodes.some(node => phase.matches.includes(node.data?.nodeType) || phase.matches.includes(node.data?.colorKey))).length;
  const score = nodes.length ? Math.max(35, Math.min(98, 44 + covered * 9 + Math.min(edges.length, 8) * 3 - issues.filter(issue => issue.type === "warning").length * 7)) : 0;

  return (
    <aside className={`pg-review-panel${compact ? " is-compact" : ""}`}>
      <div className="pg-review-header">
        <div><div className="pg-panel-kicker"><ShieldCheck size={12} /> ARCHITECTURE REVIEW</div><h3>{selectedNode ? "Component details" : "Design health"}</h3></div>
        {onClose && <button className="pg-icon-button" onClick={onClose} aria-label="Close review panel"><X size={14} /></button>}
      </div>

      {selectedNode ? (
        <div className="pg-selected-summary">
          <div className="pg-selected-icon"><Sparkles size={17} /></div>
          <div><strong>{selectedNode.data?.label}</strong><span>{selectedNode.data?.nodeType || "component"}</span></div>
          <button className="pg-link-button" onClick={() => onInspect?.(selectedNode)}><PanelRight size={12} /> Open inspector</button>
        </div>
      ) : (
        <>
          <div className="pg-health-score"><div><span>Readiness score</span><strong>{score}<small>/100</small></strong></div><div className="pg-score-ring" style={{ "--score": `${score * 3.6}deg` }}><span>{covered}/5</span></div></div>
          <div className="pg-health-meter"><span style={{ width: `${score}%` }} /></div>
          <div className="pg-review-stats"><div><strong>{nodes.length}</strong><span>components</span></div><div><strong>{edges.length}</strong><span>connections</span></div><div><strong>{covered}</strong><span>phases</span></div></div>
        </>
      )}

      <div className="pg-review-section-title"><span>{issues.length ? "Review notes" : "Review notes"}</span><span className={issues.length ? "pg-warning-count" : "pg-ok-count"}>{issues.length || "All clear"}</span></div>
      <div className="pg-review-notes">
        {issues.length ? issues.map((issue, index) => <div className={`pg-review-note is-${issue.type}`} key={`${issue.type}-${index}`}>{issue.type === "warning" ? <AlertTriangle size={13} /> : <Info size={13} />}<span>{issue.text}</span></div>) : <div className="pg-review-note is-ok"><CheckCircle2 size={13} /><span>Every current check passes. Add more detail as you move toward production.</span></div>}
      </div>

      <div className="pg-review-section-title"><span>System framing</span><Link2 size={13} /></div>
      <div className="pg-framing-list">
        <div><CircleDot size={12} /><span>Data plane</span><small>Request and response path</small><b>{edges.length ? "Mapped" : "Open"}</b></div>
        <div><ShieldCheck size={12} /><span>Control plane</span><small>Security, quality, operations</small><b>{nodes.some(node => ["security", "observ", "eval"].includes(node.data?.nodeType)) ? "Mapped" : "Add"}</b></div>
      </div>
      <div className="pg-review-tip"><Sparkles size={13} /><span>Select a component to inspect its contract, ports, notes, and documentation.</span></div>
    </aside>
  );
}
