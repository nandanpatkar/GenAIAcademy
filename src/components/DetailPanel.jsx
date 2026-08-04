import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box, ExternalLink, CheckCircle2,
  Video, FileText, Link2,
  Orbit, Plus, Trash2, RotateCcw
} from "lucide-react";
import { DeepLearningSuite, toAbsoluteUrl } from "./AIStudyPanel";
import ModuleNotes from "./ModuleNotes";
import { useAuth } from "../contexts/AuthContext";


const STATUS_LABELS = { complete: "Complete", in_progress: "In progress", locked: "Locked", default: "Not started" };
const STATUS_COLORS = { complete: "#00ff88", in_progress: "#f59e0b", locked: "#555570", default: "#555570" };

// ── Main DetailPanel ──────────────────────────────────────────────────────────

export default function DetailPanel({
  node, module, pathColor,
  onMarkDone, onMarkProgress, onMarkModuleStatus, onToggleSubtopicStatus,
  nodeState, onModuleSelect, onTopicSelect, isEditMode, onBackToGalaxy,
  onAddTopic, onDeleteTopic,
  onEnterFocusMode, onVideoSelect, onClose
}) {
  if (!node || !module) return (
    <div className="no-select">
      <div className="no-select-icon"><Box size={48} strokeWidth={1} /></div>
      <h3>Select a node</h3>
      <p>Click any node in the roadmap to explore its modules and resources.</p>
    </div>
  );

  const statusColor = STATUS_COLORS[module.status] || STATUS_COLORS.default;
  const doneCount   = node.modules?.filter((m) => m.status === "complete").length || 0;
  const pct         = Math.round((doneCount / (node.modules?.length || 1)) * 100);
  const titleWords  = module.title.split(" ");
  const firstWord   = titleWords.slice(0, -1).join(" ") || titleWords[0];
  const lastWord    = titleWords.length > 1 ? titleWords[titleWords.length - 1] : "";

  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("overview"); // "overview" | "notes"

  // Reset tab when module changes
  React.useEffect(() => {
    setActiveTab("overview");
  }, [module?.id]);

  // Build a stable module_id for Supabase keying
  const noteModuleId = module?.id
    ? `${module.id}`
    : `${node?.id ?? "unknown"}__${(module?.title ?? "").replace(/\s+/g, "_").toLowerCase()}`;

  return (
    <div className="detail-panel" style={{ "--dp-color": pathColor }}>
      {/* ── Header ── */}
      <div className="dp-header">
        <div className="dp-breadcrumb" style={{ fontSize: "11px", fontWeight: 700, opacity: 0.6, letterSpacing: '0.5px', display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", width: "100%", overflow: "hidden" }}>
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            DS <span>·</span> {node.title.substring(0, 15).toUpperCase()} <span>·</span> {module.title.toUpperCase()}
          </div>
          {onClose && <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "14px", padding: "0 4px", flexShrink: 0 }}>✕</button>}
        </div>
        <div className="dp-title-row">
          <div>
            <div className="dp-title">
              {firstWord && <span>{firstWord}</span>}
              {lastWord && <span className="highlight">{lastWord}</span>}
            </div>
            <div className="dp-badges">
              <span className="dp-badge" style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}10` }}>
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
          <div style={{ display: "flex", gap: 8 }}>
            {onEnterFocusMode && (
              <button 
                className="dp-focus-btn" 
                onClick={onEnterFocusMode}
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text2)",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: "9px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.color = "var(--text2)";
                }}
              >
                <Orbit size={12} className="pulse-icon" />
                FOCUS
              </button>
            )}
            {onBackToGalaxy && (
              <button className="dp-back-galaxy-btn" onClick={onBackToGalaxy}>🌌 GALAXY</button>
            )}
            <button className="dp-share-btn">↑ SHARE</button>
          </div>
        </div>
        <div className="dp-progress-bar">
          <div className="dp-progress-fill" style={{ width: `${pct}%`, background: pathColor }} />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="dp-actions">
        <button
          className={`dp-btn dp-btn-done ${module.status === "complete" ? "active" : ""}`}
          onClick={() => onMarkModuleStatus("complete")}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {module.status === "complete" ? <CheckCircle2 size={14} /> : null}
          <span>{module.status === "complete" ? "Module complete" : "Mark complete"}</span>
        </button>
        <button
          className={`dp-btn dp-btn-progress ${module.status === "in_progress" ? "active" : ""}`}
          onClick={() => onMarkModuleStatus("in_progress")}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {module.status === "in_progress" ? <RotateCcw size={14} /> : null}
          <span>{module.status === "in_progress" ? "In progress" : "Mark in progress"}</span>
        </button>
        <button
          className={`dp-btn dp-btn-done ${nodeState === "done" ? "active" : ""}`}
          style={{
            background: nodeState === "done" ? pathColor : "transparent",
            borderColor: pathColor, borderStyle: "dashed", opacity: 0.8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
          onClick={onMarkDone}
        >
          {nodeState === "done" ? <CheckCircle2 size={14} /> : null}
          <span>{nodeState === "done" ? "Node complete" : "Mark node done"}</span>
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        display: "flex", gap: 2,
        padding: "0 16px",
        borderBottom: "1px solid var(--border)",
        marginTop: 2,
        flexShrink: 0,
      }}>
        {[
          { id: "overview", label: "OVERVIEW" },
          { id: "notes",    label: "MY NOTES" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "9px 14px",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.6px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: activeTab === tab.id ? "var(--dp-color, var(--primary))" : "var(--text3)",
              borderBottom: activeTab === tab.id
                ? "2px solid var(--dp-color, var(--primary))"
                : "2px solid transparent",
              marginBottom: -1,
              transition: "all .15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
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
                          {m.status === "complete" ? "Complete" : "In progress"}
                        </span>
                      )}
                    </div>
                  </div>

                  {isActive && m.subtopics && m.subtopics.length > 0 && (
                    <div style={{
                      marginLeft: 36, paddingLeft: 16,
                      borderLeft: "2px solid var(--border)",
                      display: "flex", flexDirection: "column", gap: 4,
                      marginBottom: 12, marginTop: 4,
                    }}>
                      {isEditMode && (
                        <div className="dp-insert-divider first" onClick={() => onAddTopic && onAddTopic(0)}>
                          <Plus size={10} /> Insert at beginning
                        </div>
                      )}
                      {m.subtopics.map((s, sidx) => {
                        const st = typeof s === "object" ? s : { title: s, status: "pending" };
                        const isComplete = st.status === "complete";
                        const topicId = st.id || st.title;
                        return (
                          <React.Fragment key={sidx}>
                            <div
                              onClick={(e) => { e.stopPropagation(); onTopicSelect && onTopicSelect(st); }}
                              style={{
                                fontSize: 12, fontWeight: 600,
                                color: isComplete ? "var(--text)" : "var(--text2)",
                                cursor: "pointer",
                                padding: "8px 12px", borderRadius: 6,
                                background: isComplete ? "rgba(0,255,136,0.05)" : "rgba(255,255,255,0.02)",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                transition: "all .15s",
                                position: "relative"
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
                                    background: isComplete ? "rgba(0,255,136,0.1)" : "transparent",
                                  }}
                                >
                                  {isComplete && "✓"}
                                </div>
                                <span>{st.title}</span>
                              </div>
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                {st.companies && st.companies.length > 0 && (
                                  <span style={{ fontSize: 8, color: "var(--text3)", background: "var(--bg3)", padding: "2px 6px", borderRadius: 4 }}>
                                    {st.companies[0]}
                                  </span>
                                )}
                                {isEditMode && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteTopic && onDeleteTopic(topicId); }}
                                    style={{ background: "transparent", border: "none", color: "var(--text3)", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#ff4444"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}
                                    title="Delete Topic"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                            {isEditMode && (
                              <div className="dp-insert-divider" onClick={() => onAddTopic && onAddTopic(sidx + 1)}>
                                <Plus size={10} /> Insert after {st.title}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                      {isEditMode && (
                        <button 
                          className="add-subtopic-btn" 
                          onClick={() => onAddTopic && onAddTopic(-1)}
                          style={{ 
                            width: "100%",
                            marginTop: 8,
                            background: "rgba(255,255,255,0.03)", 
                            border: "1px dashed var(--border)", 
                            color: "var(--text3)", 
                            padding: "10px", 
                            borderRadius: 8, 
                            fontSize: 10, 
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all .2s"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text2)"; e.currentTarget.style.color = "var(--text)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text3)"; }}
                        >
                          + ADD NEW TOPIC
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Curriculum Resources ── */}
          {(module.links?.length > 0 || module.videos?.length > 0 || module.files?.length > 0) && (
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="dp-section-label" style={{ marginBottom: 4 }}>Curated Resources</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                {/* Videos */}
                {module.videos?.map((v, i) => (
                  <a
                    key={`vid-${i}`}
                    href={toAbsoluteUrl(v.url)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (onVideoSelect) {
                        e.preventDefault();
                        onVideoSelect(v);
                      }
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", borderRadius: 12,
                      background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                      color: "var(--text)", textDecoration: "none", transition: "all .2s",
                    }}
                    className="hover-node"
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "rgba(239,68,68,0.1)", display: "flex",
                      alignItems: "center", justifyContent: "center"
                    }}>
                      <Video size={16} color="#ef4444" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{v.title || "Module Video"}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>Watch on YouTube</div>
                    </div>
                    <ExternalLink size={14} color="var(--text3)" style={{ opacity: 0.5 }} />
                  </a>
                ))}

                {/* Links */}
                {module.links?.map((l, i) => (
                  <a
                    key={`link-${i}`}
                    href={toAbsoluteUrl(l.url)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", borderRadius: 12,
                      background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                      color: "var(--text)", textDecoration: "none", transition: "all .2s",
                    }}
                    className="hover-node"
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${pathColor}15`, display: "flex",
                      alignItems: "center", justifyContent: "center"
                    }}>
                      <Link2 size={16} color={pathColor} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{l.title || "Reference Link"}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>External Resource</div>
                    </div>
                    <ExternalLink size={14} color="var(--text3)" style={{ opacity: 0.5 }} />
                  </a>
                ))}

                {/* Files */}
                {module.files?.map((f, i) => (
                  <a
                    key={`file-${i}`}
                    href={toAbsoluteUrl(f.url)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "12px 16px", borderRadius: 12,
                      background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                      color: "var(--text)", textDecoration: "none", transition: "all .2s",
                    }}
                    className="hover-node"
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "rgba(59,130,246,0.1)", display: "flex",
                      alignItems: "center", justifyContent: "center"
                    }}>
                      <FileText size={16} color="#3b82f6" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{f.title || f.name || "Module Document"}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>Download Resource</div>
                    </div>
                    <ExternalLink size={14} color="var(--text3)" style={{ opacity: 0.5 }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Deep Learning Suite ── */}
          <div style={{ marginTop: 32 }}>
            <div className="dp-section-label" style={{ marginBottom: 16 }}>Advanced AI Study Tools</div>
            <DeepLearningSuite module={module} pathColor={pathColor} />
          </div>
        </div>
      )}

      {/* ── Notes Tab ── */}
      {activeTab === "notes" && (
        <div style={{ flex: 1, padding: "16px", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <ModuleNotes
            moduleId={noteModuleId}
            userId={user?.id}
            pathColor={pathColor}
          />
        </div>
      )}

      {/* Animations for loader and retry indicator */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}