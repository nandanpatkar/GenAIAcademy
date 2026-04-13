import React, { useState } from "react";
import { Box, Hexagon, Star, CheckCircle, Navigation, ArrowLeft, Trash2, Plus } from "lucide-react";

const SECTION_ICONS = {
  Overview: <Box size={14} />,
  Fundamentals: <Hexagon size={14} />,
  Advanced: <Navigation size={14} />,
  Mastery: <CheckCircle size={14} />,
  Certification: <Star size={14} />,
};

export default function ModulePanel({ 
  node, activeModule, setActiveModule, pathColor, onClose, onBack, onAddModule, onEditModule, onDeleteModule, isEditMode, activePath
}) {
  const sections = ["Overview", "Fundamentals", "Advanced", "Mastery", "Certification"];

  
  const filteredModules = node.modules || [];


  const doneCount = node.modules?.filter((m) => m.status === "complete").length || 0;
  const pct = Math.round((doneCount / (node.modules?.length || 1)) * 100);

  return (
    <div className="module-panel">
      {/* Header */}
      <div className="mp-header">
        <div className="mp-close-row">
          <button 
            className="mp-back-btn" 
            onClick={onBack || onClose}
            style={{ 
              background: "transparent", border: "none", color: "var(--text2)", cursor: "pointer", 
              fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
            fontFamily: "var(--mono)", letterSpacing: ".5px"
          }}
        >
          <ArrowLeft size={14} /> BACK TO ROADMAP
        </button>
          <button className="mp-close" onClick={onClose}>✕</button>
        </div>
        <div className="mp-node-title">{node.title}</div>
        <div className="mp-node-sub">{node.subtitle}</div>
        <div className="mp-progress">
          <div className="mp-progress-row">
            <span className="mp-progress-label">PROGRESS</span>
            <span className="mp-progress-val" style={{ color: pathColor }}>{doneCount}/{node.modules?.length || 0} completed</span>
          </div>
          <div className="mp-progress-bar">
            <div className="mp-progress-fill" style={{ width: `${pct}%`, background: pathColor }} />
          </div>
        </div>
      </div>

      {/* Section nav */}
      <div className="mp-sections">
        {sections.map((sec) => (
          <button
            key={sec}
            className={`mp-section-btn ${sec === "Overview" ? "active" : ""}`}
            style={{ "--mp-color": `${pathColor}25` }}
          >
            <div className="mp-section-icon">{SECTION_ICONS[sec]}</div>
            {sec}
            {sec === "Advanced" && (
              <span className="mp-lock">🔒</span>
            )}
            {sec === "Overview" && (
              <div className="mp-section-dot" style={{ background: pathColor }} />
            )}
          </button>
        ))}
      </div>

      {/* Module list */}
      <div className="mp-modules">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1px", color: "var(--text3)", textTransform: "uppercase" }}>
            Modules · {filteredModules.length}
          </div>
        </div>

        {isEditMode && filteredModules.length > 0 && (
          <div className="mp-insert-divider first" onClick={() => onAddModule(0)}>
            <Plus size={10} /> Insert at beginning
          </div>
        )}

        {filteredModules.map((mod, i) => {
          return (
            <React.Fragment key={mod.id}>
              <div
                className={`mp-module-item ${activeModule?.id === mod.id ? "active" : ""}`}
                onClick={() => setActiveModule(mod)}
              >
                <div className={`mp-module-status ${mod.status}`}>
                  {mod.status === "complete" ? "✓" : mod.status === "in_progress" ? "⟳" : mod.status === "locked" ? "🔒" : "◌"}
                </div>
                <div className="mp-module-body" style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="mp-module-title">{mod.title}</div>
                  </div>

                  {isEditMode && (
                    <div className="mp-module-actions" onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, display: "flex", gap: 6 }}>
                      <button 
                        className="edit-btn" 
                        onClick={(e) => { e.stopPropagation(); onEditModule(mod); }}
                        title="Edit Module"
                      >✎</button>
                      <button 
                        className="edit-btn" 
                        style={{ color: "#ff4444", borderColor: "rgba(255,68,68,0.3)" }}
                        onClick={(e) => { e.stopPropagation(); onDeleteModule && onDeleteModule(mod.id); }}
                        title="Delete Module"
                      ><Trash2 size={10} /></button>
                    </div>
                  )}
                  <div className="mp-module-sub" style={{ paddingRight: 48, marginBottom: 8 }}>{mod.subtitle}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="mp-module-dur">{mod.duration} · {mod.subtopics?.length || 0} topics</div>
                  </div>

                </div>
              </div>
              {isEditMode && (
                <div className="mp-insert-divider" onClick={() => onAddModule(i + 1)}>
                  <Plus size={10} /> Insert after {mod.title}
                </div>
              )}
            </React.Fragment>
          );
        })}
        
        {isEditMode && filteredModules.length === 0 && (
          <button className="add-module-btn" onClick={() => onAddModule(-1)}>
            + Add Module
          </button>
        )}
      </div>
    </div>
  );
}
