import { Box, Edit2 } from "lucide-react";

const PATH_ICONS = {
  ds: ["🐍", "📊", "🔬", "🗄️", "🤖", "🧠", "💬", "🚀"],
  genai: ["🏗️", "✨", "⛓️", "🗃️", "🔍", "🎯", "📡", "☁️"],
  agentic: ["🤖", "🕸️", "👥", "🛠️", "🧠", "☁️", "⚡"],
};

export default function RoadmapGraph({
  path, activePath, setActivePath, pathsData,
  activeNode, onNodeClick,
  getNodeState, completedCount, onMarkState,
  onAddNode, onEditNode, isEditMode
}) {
  if (!path) {
    return (
      <div className="roadmap-graph" style={{ padding: 40, color: "var(--text2)", textAlign: "center" }}>
        <h2>Loading Roadmap Data...</h2>
        <p>If you see this permanently, please Reset Defaults from the Sidebar.</p>
      </div>
    );
  }

  const { title, subtitle, color, nodes } = path;

  const total = nodes?.length || 1;
  const pct = nodes?.length === 0 ? 0 : Math.round((completedCount / nodes.length) * 100);
  const inProgress = (nodes || []).filter((n) => getNodeState(n.id) === "progress").length;
  const icons = PATH_ICONS[activePath] || [];

  // Dynamically split title to retain two-tone aesthetic for infinite custom paths
  const words = (path.title || "Custom Path").trim().split(" ");
  const accent = words.length > 1 ? words.pop() : "";
  const plain = words.join(" ");

  // Build tabs only from paths that actually exist, with friendly labels
  const PATH_LABELS = {
    dsa: "DSA",
    aicxm_aws: "AICXM AWS",
    aicxm_azure: "AICXM AZURE",
    aicxm_databricks: "AICXM DATABRICKS",
    ds: "DATA SCIENCE",
    genai: "GEN AI",
    agentic: "AGENTIC AI",
  };
  const tabLabels = Object.keys(pathsData || {}).map(key => ({
    key,
    label: PATH_LABELS[key] || (pathsData[key]?.title || key).toUpperCase(),
  }));

  return (
    <div className="roadmap-graph">
      {/* Header */}
      <div className="rg-header" style={{ paddingTop: 32 }}>
        <div className="rg-path-tabs">
          {tabLabels.map((t) => (
            <button
              key={t.key}
              className={`rg-tab ${activePath === t.key ? "active" : ""}`}
              style={{
                "--tab-color": activePath === t.key ? path.color : undefined,
                "--tab-bg": activePath === t.key ? `${path.color}12` : "transparent",
              }}
              onClick={() => setActivePath && setActivePath(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rg-title" style={{ "--path-color": path.color }}>
          {plain} <span>{accent}</span>
        </div>
        <div className="rg-subtitle">{path.description}</div>

        <div className="rg-progress-row">
          <span className="rg-progress-label">{completedCount} / {total} COMPLETED</span>
          <span className="rg-progress-pct">{pct}%</span>
        </div>
        <div className="rg-progress-bar">
          <div
            className="rg-progress-fill"
            style={{ width: `${pct}%`, background: path.color }}
          />
        </div>
        <div className="rg-stats">
          <span className="rg-stat done">✓ {completedCount} done</span>
          <span className="rg-stat progress">⟳ {inProgress} progress</span>
          <span className="rg-stat none">◌ {total - completedCount - inProgress} todo</span>
        </div>
      </div>

      {/* Node list */}
      <div className="rg-nodes">
        {path.nodes.map((node, i) => {
          const state = getNodeState(node.id);
          const isActive = activeNode?.id === node.id;
          const icon = <Box size={20} />;

          return (
            <div key={node.id}>
              {i > 0 && (
                <div className="node-connector">
                  <div className="node-connector-line" />
                  <div className="node-connector-dot" />
                </div>
              )}
              <div
                className={`node-card ${state} ${isActive ? "active" : ""}`}
                style={{ "--node-color": path.color }}
                onClick={() => onNodeClick(node)}
              >
                <div
                  className="node-card-glow"
                  style={{ background: path.color }}
                />
                <div className="node-row">
                  <div
                    className="node-icon"
                    style={{ background: isActive ? path.bgColor : "var(--bg3)", border: `1px solid ${isActive ? path.borderColor : "var(--border)"}` }}
                  >
                    {icon}
                  </div>
                  <div className="node-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div className="node-num">
                          {String(i + 1).padStart(2, "0")} · {node.modules?.length || 0} modules
                        </div>
                        <div className="node-title">{node.title}</div>
                      </div>
                      {isEditMode && (
                        <button
                          className="edit-btn"
                          onClick={(e) => { e.stopPropagation(); onEditNode(node); }}
                          title="Edit Node"
                        ><Edit2 size={12} /></button>
                      )}
                    </div>
                    <div className="node-subtitle">{node.subtitle}</div>
                    <div
                      className="node-tag"
                      style={{ color: node.tagColor, borderColor: `${node.tagColor}40`, background: `${node.tagColor}10` }}
                    >
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: node.tagColor, display: "inline-block" }} />
                      {node.tag}
                    </div>
                  </div>
                  <div className={`node-status-dot ${state}`} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Node Button */}
        {isEditMode && (
          <div className="add-node-card" onClick={onAddNode}>
            + ADD NODE TO PATH
          </div>
        )}

        {/* CTA */}
        <div className="rg-cta" style={{ marginTop: 24 }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>✦</div>
          <h4>Evolve into a {activePath === "ds" ? "Data Scientist" : activePath === "genai" ? "GenAI Engineer" : "AI Architect"}</h4>
          <p>Complete this roadmap to unlock advanced projects and career pathways in high-performance AI.</p>
          <button className="rg-cta-btn">Initialize Path</button>
        </div>
      </div>
    </div>
  );
}
