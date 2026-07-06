import React from "react";
import { Layers, ArrowRight, Target } from "lucide-react";
import MobileShell from "../../components/mobile/MobileShell";
import "../../styles/roadmap-mobile.css";

const PATH_LABELS = {
  dsa: "DSA",
  aicxm_aws: "AICXM AWS",
  aicxm_azure: "AICXM AZURE",
  aicxm_databricks: "AICXM DATABRICKS",
  ds: "DATA SCIENCE",
  genai: "GEN AI",
  agentic: "AGENTIC AI",
};

function getStatusConfig(state) {
  switch (state) {
    case "done":
      return { label: "COMPLETED", color: "#00ff88" };
    case "progress":
      return { label: "IN PROGRESS", color: "#a855f7" };
    default:
      return { label: "READY", color: "#ffffff" };
  }
}

/**
 * RoadmapMobile
 * -------------
 * Mobile-optimized replacement for RoadmapGraph's zigzag/central-line
 * layout, which doesn't translate well to a narrow touch screen. Renders
 * the same node data as a vertical, scrollable list of cards instead.
 *
 * Deliberately mirrors RoadmapGraph's prop signature so it's a drop-in
 * swap at the call site in App.jsx:
 *
 *   {isMobile ? <RoadmapMobile ...sameProps /> : <RoadmapGraph ...sameProps />}
 *
 * Tapping a node still calls `onNodeClick(node)` exactly as RoadmapGraph
 * does, so the existing ModulePanel -> DetailPanel -> ResourcePanel
 * mobile drill-down flow in App.jsx is unaffected — only the top-level
 * node list changes.
 */
export default function RoadmapMobile({
  path,
  activePath,
  setActivePath,
  pathsData,
  onNodeClick,
  getNodeState,
  completedCount,
}) {
  if (!path) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--text2)" }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Loading Roadmap Data...</h2>
        <p style={{ fontSize: 12 }}>
          If you see this permanently, please Reset Defaults from the Sidebar.
        </p>
      </div>
    );
  }

  const { title, color, nodes = [] } = path;
  const total = nodes.length || 0;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const inProgress = nodes.filter((n) => getNodeState(n.id) === "progress").length;
  const notStarted = Math.max(0, total - completedCount - inProgress);

  const tabLabels = Object.keys(pathsData || {}).map((key) => ({
    key,
    label: PATH_LABELS[key] || (pathsData[key]?.title || key).toUpperCase(),
  }));

  const handleJumpToCurrent = () => {
    const target =
      nodes.find((n) => getNodeState(n.id) === "progress") ||
      nodes.find((n) => getNodeState(n.id) === "default");
    if (target) {
      const el = document.getElementById(`rgm-node-${target.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <MobileShell
      title={title}
      subtitle={`${completedCount}/${total} completed · ${pct}%`}
      accentColor={color}
      scrollPadBottom={90}
      rightSlot={
        <button
          type="button"
          className="rgm-jump-btn"
          style={{ "--rgm-accent": color }}
          onClick={handleJumpToCurrent}
        >
          <Target size={13} />
        </button>
      }
    >
      {/* Path switch tabs */}
      {tabLabels.length > 1 && (
        <div className="rgm-tabs">
          {tabLabels.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`rgm-tab ${activePath === t.key ? "active" : ""}`}
              style={{
                "--tab-color": activePath === t.key ? color : undefined,
              }}
              onClick={() => setActivePath && setActivePath(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Progress summary strip */}
      <div className="rgm-progress-strip">
        <div className="rgm-progress-bar-track">
          <div
            className="rgm-progress-bar-fill"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <div className="rgm-progress-badges">
          <span className="rgm-badge">{inProgress} in progress</span>
          <span className="rgm-badge">{notStarted} not started</span>
        </div>
      </div>

      {/* Vertical node list */}
      <div className="rgm-list">
        {nodes.map((node, i) => {
          const state = getNodeState(node.id);
          const statusConfig = getStatusConfig(state);
          return (
            <button
              key={node.id}
              id={`rgm-node-${node.id}`}
              type="button"
              className="rgm-card"
              style={{ "--node-color": color }}
              onClick={() => onNodeClick(node)}
            >
              <div className="rgm-card-top">
                <span className="rgm-card-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="rgm-card-subnodes">
                  <Layers size={11} /> {node.modules?.length || 0} modules
                </span>
              </div>

              <div className="rgm-card-title">{node.title}</div>
              {(node.subtitle || node.description) && (
                <div className="rgm-card-desc">{node.subtitle || node.description}</div>
              )}

              <div className="rgm-card-bottom">
                <span
                  className="rgm-status"
                  style={{ "--status-color": statusConfig.color }}
                >
                  <span className="rgm-status-dot" />
                  {statusConfig.label}
                </span>
                <span className="rgm-explore">
                  Open <ArrowRight size={13} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </MobileShell>
  );
}
