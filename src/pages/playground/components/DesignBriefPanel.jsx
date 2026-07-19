import React from "react";
import {
  Activity,
  ArrowRight,
  Check,
  Database,
  GitBranch,
  Layers3,
  MessageSquare,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const PHASES = [
  {
    id: "define",
    label: "Define",
    eyebrow: "01",
    description: "Clarify the user request, boundaries, and success signal.",
    icon: MessageSquare,
    color: "#60a5fa",
    matches: ["io"],
  },
  {
    id: "ingest",
    label: "Ingest",
    eyebrow: "02",
    description: "Bring documents, events, and reference data into the system.",
    icon: Database,
    color: "#34d399",
    matches: ["datasource", "vectordb", "store", "memory"],
  },
  {
    id: "orchestrate",
    label: "Orchestrate",
    eyebrow: "03",
    description: "Route requests through models, agents, tools, and memory.",
    icon: Workflow,
    color: "#a78bfa",
    matches: ["agent", "llm", "processing", "tool"],
  },
  {
    id: "serve",
    label: "Serve",
    eyebrow: "04",
    description: "Shape the response contract and make the user-facing path clear.",
    icon: Radio,
    color: "#fbbf24",
    matches: ["io", "multimodal"],
  },
  {
    id: "operate",
    label: "Operate",
    eyebrow: "05",
    description: "Make the design safe, observable, resilient, and cost-aware.",
    icon: ShieldCheck,
    color: "#fb7185",
    matches: ["security", "observ", "eval"],
  },
];

export { PHASES };

function phaseCount(phase, nodes) {
  return nodes.filter(node => phase.matches.includes(node.data?.nodeType) || phase.matches.includes(node.data?.colorKey)).length;
}

export default function DesignBriefPanel({
  nodes,
  edges,
  phase,
  onPhaseChange,
  brief,
  onBriefChange,
  onBuildMode,
  onRun,
  runState,
}) {
  const totalCovered = PHASES.filter(item => phaseCount(item, nodes) > 0).length;
  const active = PHASES.find(item => item.id === phase) || PHASES[0];
  const ActiveIcon = active.icon;

  return (
    <aside className="pg-brief-panel">
      <div className="pg-panel-kicker"><Sparkles size={12} /> DESIGN WORKSPACE</div>
      <div className="pg-brief-heading">
        <div>
          <h2>Build the path</h2>
          <p>Use the AWS mental model: define the request, trace the data plane, then review the control plane.</p>
        </div>
        <div className="pg-coverage-badge"><strong>{totalCovered}</strong><span>/ 5</span></div>
      </div>

      <label className="pg-brief-label" htmlFor="pg-design-brief">Design brief</label>
      <textarea
        id="pg-design-brief"
        className="pg-brief-input"
        value={brief}
        onChange={event => onBriefChange(event.target.value)}
        placeholder="What are you designing? e.g. A grounded support assistant for internal docs"
        rows={3}
      />

      <div className="pg-phase-title"><span>Architecture path</span><span>{nodes.length} components</span></div>
      <div className="pg-phase-list">
        {PHASES.map(item => {
          const Icon = item.icon;
          const count = phaseCount(item, nodes);
          const isActive = item.id === active.id;
          return (
            <button
              key={item.id}
              className={`pg-phase-card${isActive ? " is-active" : ""}`}
              style={{ "--phase-color": item.color }}
              onClick={() => onPhaseChange(item.id)}
            >
              <span className="pg-phase-index">{item.eyebrow}</span>
              <span className="pg-phase-icon"><Icon size={15} /></span>
              <span className="pg-phase-copy"><strong>{item.label}</strong><small>{count ? `${count} component${count > 1 ? "s" : ""}` : "Not mapped yet"}</small></span>
              <span className={`pg-phase-state${count ? " is-covered" : ""}`}>{count ? <Check size={12} /> : <ArrowRight size={12} />}</span>
            </button>
          );
        })}
      </div>

      <div className="pg-active-phase" style={{ "--phase-color": active.color }}>
        <div className="pg-active-phase-head"><ActiveIcon size={14} /><span>{active.label} phase</span><GitBranch size={13} /></div>
        <p>{active.description}</p>
        <div className="pg-phase-connection"><span className="pg-connection-dot" /> {phaseCount(active, nodes)} mapped · {edges.length} total connections</div>
      </div>

      <div className="pg-brief-actions">
        <button className="pg-secondary-action" onClick={onBuildMode}><Layers3 size={14} /> Add components</button>
        <button className="pg-primary-action" onClick={onRun} disabled={!nodes.length || runState === "running"}><Play size={13} fill="currentColor" /> {runState === "running" ? "Running flow" : "Run walkthrough"}</button>
      </div>
      <div className="pg-brief-footer"><Activity size={12} /> Design as data moves through the system</div>
    </aside>
  );
}
