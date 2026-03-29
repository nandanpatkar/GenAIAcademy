import { Box } from "lucide-react";

const STATUS_LABELS = { complete: "COMPLETE", in_progress: "IN PROGRESS", locked: "LOCKED", default: "NOT STARTED" };
const STATUS_COLORS = { complete: "#00ff88", in_progress: "#f59e0b", locked: "#555570", default: "#555570" };

export default function DetailPanel({ node, module, pathColor, onMarkDone, onMarkProgress, onMarkModuleStatus, nodeState, onModuleSelect, onTopicSelect, isEditMode }) {
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

        {/* Subtopics */}
        <div className="dp-section-label">What you'll learn</div>
        <div className="dp-subtopic-grid">
          {module.subtopics?.map((s, idx) => {
            const isObj = typeof s === "object";
            const topicId = isObj ? s.id : s;
            const topicTitle = isObj ? s.title : s;
            const topicObj = isObj ? s : { id: s, title: s, content: "" };
            
            return (
              <div 
                key={topicId || idx} 
                className="dp-subtopic" 
                onClick={() => onTopicSelect && onTopicSelect(topicObj)}
                style={{ cursor: "pointer", transition: "all .15s" }}
              >
                {topicTitle}
              </div>
            );
          })}
          {onTopicSelect && isEditMode && (
            <div 
              className="dp-subtopic"
              style={{ background: "transparent", border: "1px dashed var(--border2)", cursor: "pointer", color: "var(--text3)" }}
              onClick={() => onTopicSelect({ id: `topic-${Date.now()}`, title: "New Topic", content: "" })}
            >
              + Add Topic
            </div>
          )}
        </div>

        {/* All modules in this node */}
        <div className="dp-section-label">All modules in this node</div>
        <div className="dp-module-list">
          {node.modules?.map((m) => (
            <div 
              key={m.id} 
              className={`dp-module-row ${m.id === module.id ? "active" : ""}`}
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
          ))}
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
