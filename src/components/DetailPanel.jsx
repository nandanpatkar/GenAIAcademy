import { Box } from "lucide-react";
import ProjectIdeasPanel from "./ProjectIdeasPanel";

const STATUS_LABELS = { complete: "COMPLETE", in_progress: "IN PROGRESS", locked: "LOCKED", default: "NOT STARTED" };
const STATUS_COLORS = { complete: "#00ff88", in_progress: "#f59e0b", locked: "#555570", default: "#555570" };

export default function DetailPanel({ node, module, pathColor, onMarkDone, onMarkProgress, onMarkModuleStatus, onToggleSubtopicStatus, nodeState, onModuleSelect, onTopicSelect, isEditMode }) {

  if (!node || !module) return (
    <div className="no-select">
      <div className="no-select-icon"><Box size={48} strokeWidth={1} /></div>
      <h3>Select a node</h3>
      <p>Click any node in the roadmap to explore its modules and resources.</p>
    </div>
  );

  const statusColor = STATUS_COLORS[module.status] || STATUS_COLORS.default;
  const doneCount = node.modules?.filter((m) => m.status === "complete").length || 0;
  const pct = Math.round((doneCount / (node.modules?.length || 1)) * 100);

  const titleWords = module.title.split(" ");
  const firstWord = titleWords.slice(0, -1).join(" ") || titleWords[0];
  const lastWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : "";

  return (
    <div className="detail-panel" style={{ "--dp-color": pathColor }}>
      {/* Header */}
      <div className="dp-header">
        <div className="dp-breadcrumb">
          DATA SCIENCE <span>·</span> {node.title.toUpperCase()} <span>·</span> {module.title.toUpperCase()}
        </div>
        <div className="dp-title-row">
          <div>
            <div className="dp-title">
              {firstWord && <span>{firstWord}</span>}
              {lastWord && <span className="highlight">{lastWord}</span>}
            </div>
            <div className="dp-badges">
              <span
                className="dp-badge"
                style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}10` }}
              >
                {STATUS_LABELS[module.status]}
              </span>
              <span className="dp-badge" style={{ color: "var(--text2)", borderColor: "var(--border)", background: "var(--bg3)" }}>
                {module.duration}
              </span>
              <span className="dp-badge" style={{ color: "var(--text2)", borderColor: "var(--border)", background: "var(--bg3)" }}>
                {module.subtopics?.length} TOPICS
              </span>
            </div>
          </div>
          <button className="dp-share-btn">↑ SHARE</button>
        </div>
        <div className="dp-progress-bar">
          <div className="dp-progress-fill" style={{ width: `${pct}%`, background: pathColor }} />
        </div>
      </div>

      {/* Body */}
      <div className="dp-body">
        {/* Overview */}
        <div className="dp-overview">{module.overview}</div>

        {/* All modules in this node */}
        <div className="dp-section-label">All modules in this node</div>
        <div className="dp-module-list">

          {node.modules?.map((m) => {
            const isActive = m.id === module.id;
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div 
                  className={`dp-module-row ${isActive ? "active" : ""}`}
                  onClick={() => onModuleSelect && onModuleSelect(m)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={`dp-module-circle ${m.status}`}>
                    {m.status === "complete" ? "✓" : m.status === "in_progress" ? "⟳" : m.status === "locked" ? "🔒" : "◌"}
                  </div>
                  <div className="dp-module-info">
                    <div className="dp-module-name">{m.title}</div>
                    <div className="dp-module-desc">{m.subtitle}</div>
                  </div>
                  <div>
                    {(m.status === "complete" || m.status === "in_progress") && (
                      <span className={`dp-module-status-pill ${m.status}`}>
                        {m.status === "complete" ? "COMPLETE" : "IN PROGRESS"}
                      </span>
                    )}
                  </div>
                </div>
                
                {isActive && m.subtopics && m.subtopics.length > 0 && (
                  <div style={{ marginLeft: 36, paddingLeft: 16, borderLeft: "2px solid var(--border)", display: "flex", flexDirection: "column", gap: 4, marginBottom: 12, marginTop: 4 }}>
                    {m.subtopics.map((s, sidx) => {
                      const st = typeof s === "object" ? s : { title: s, status: "pending" };
                      const isComplete = st.status === "complete";
                      
                      return (
                        <div 
                          key={sidx} 
                          onClick={(e) => { e.stopPropagation(); onTopicSelect && onTopicSelect(st); }}
                          style={{ 
                            fontSize: 12, fontWeight: 600, color: isComplete ? "var(--text)" : "var(--text2)", cursor: "pointer", 
                            padding: "8px 12px", borderRadius: 6, background: isComplete ? "rgba(0,255,136,0.05)" : "rgba(255,255,255,0.02)", 
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            transition: "all .15s"
                          }}
                          className="hover-node"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div 
                              onClick={(e) => { e.stopPropagation(); onToggleSubtopicStatus && onToggleSubtopicStatus(st.title); }}
                              style={{ 
                                width: 12, height: 12, borderRadius: "50%", 
                                border: `1.5px solid ${isComplete ? "#00ff88" : "var(--text3)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 8, color: "#00ff88", cursor: "pointer",
                                background: isComplete ? "rgba(0,255,136,0.1)" : "transparent"
                              }}
                            >
                              {isComplete && "✓"}
                            </div>
                            <span>{st.title}</span>
                          </div>

                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {st.companies && st.companies.length > 0 && (
                              <span style={{ fontSize: 8, color: "var(--text3)", background: "var(--bg3)", padding: "2px 6px", borderRadius: 4 }}>{st.companies[0]}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {[
            { label: "Videos", val: module.videos?.length || 0, icon: "🎬" },
            { label: "Files", val: module.files?.length || 0, icon: "📁" },
            { label: "Links", val: module.links?.length || 0, icon: "🔗" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "var(--text3)", fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Project Ideas */}
        <ProjectIdeasPanel module={module} pathColor={pathColor} />
      </div>

      {/* Actions */}
      <div className="dp-actions">
        {/* Module Trackers */}
        <button
          className={`dp-btn dp-btn-done ${module.status === "complete" ? "active" : ""}`}
          onClick={() => onMarkModuleStatus("complete")}
        >
          {module.status === "complete" ? "✓ MODULE COMPLETED" : "MARK MODULE COMPLETE ✓"}
        </button>
        <button
          className={`dp-btn dp-btn-progress ${module.status === "in_progress" ? "active" : ""}`}
          onClick={() => onMarkModuleStatus("in_progress")}
        >
          {module.status === "in_progress" ? "⟳ MODULE IN PROGRESS" : "MARK MODULE IN PROGRESS"}
        </button>

        {/* Node Global Trackers */}
        <button
          className={`dp-btn dp-btn-done ${nodeState === "done" ? "active" : ""}`}
          style={{ background: nodeState === "done" ? pathColor : "transparent", borderColor: pathColor, borderStyle: "dashed", opacity: 0.8 }}
          onClick={onMarkDone}
        >
          {nodeState === "done" ? "NODE COMPLETED 🏆" : "MARK ENTIRE NODE DONE"}
        </button>
      </div>
    </div>
  );
}
