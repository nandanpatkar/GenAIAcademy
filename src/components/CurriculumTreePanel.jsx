import React, { useState } from 'react';
import { ChevronRight, Hexagon, Minus, Box } from "lucide-react";

export default function CurriculumTreePanel({
  paths, activePath, setActivePath,
  pathData,
  activeNode, setActiveNode,
  activeModule, setActiveModule,
  activeTopic, setActiveTopic,
  onClose
}) {
  const nodes = pathData?.nodes || [];

  const [expandedNodes, setExpandedNodes] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [viewMode, setViewMode] = useState("flowchart"); // "list" | "flowchart"
  const [zoomLevel, setZoomLevel] = useState(1);

  const PATH_LABELS = {
    agentic: "AGENTIC AI",
    aicxm_aws: "AICXM AWS",
    aicxm_azure: "AICXM AZURE",
    aicxm_databricks: "AICXM DATABRICKS",
    ds: "DATA SCIENCE",
    genai: "GEN AI",
  };

  const tabLabels = Object.keys(paths || {}).map(key => ({
    key,
    label: PATH_LABELS[key] || (paths[key]?.title || key).toUpperCase(),
  }));

  const toggleNode = (e, nodeId) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const toggleModule = (e, modId) => {
    e.stopPropagation();
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleSelect = (e, node, mod, topic) => {
    if (e) e.stopPropagation();
    if (setActiveNode) setActiveNode(node);
    if (setActiveModule) setActiveModule(mod);
    if (setActiveTopic) setActiveTopic(topic);
    if (onClose) onClose();
  };

  const expandAll = () => {
    const allN = {};
    const allM = {};
    nodes.forEach(n => {
      allN[n.id] = true;
      (n.modules || []).forEach(m => {
        allM[m.id] = true;
      });
    });
    setExpandedNodes(allN);
    setExpandedModules(allM);
  };

  const collapseAll = () => {
    setExpandedNodes({});
    setExpandedModules({});
  };

  return (
    <div className="curriculum-tree-panel" style={{ "--path-color": pathData.color }}>
      <header className="cm-header">
        <div className="cm-header-top">
          <div className="cm-title-group">
            <h1>Study Map</h1>
            <p>Architectural visualization of the current learning path.</p>
          </div>

          <div className="rg-tabs-overlay">
            {tabLabels.map((t) => (
              <button
                key={t.key}
                className={`rg-tab ${activePath === t.key ? "active" : ""}`}
                style={{
                  "--tab-color": activePath === t.key ? paths[t.key]?.color : undefined,
                  "--tab-bg": activePath === t.key ? `${paths[t.key]?.color}12` : "rgba(255,255,255,0.03)",
                }}
                onClick={() => setActivePath(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="cm-close-btn">
            Close Map ✕
          </button>
        </div>

        <div className="cm-controls-bar">
          {/* View Mode Switching */}
          <div className="cm-control-group">
            <button
              className={`cm-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              Directory List
            </button>
            <button
              className={`cm-view-btn ${viewMode === "flowchart" ? "active" : ""}`}
              onClick={() => setViewMode("flowchart")}
            >
              Hybrid Flowchart
            </button>
          </div>

          {/* Zoom Controls (Flowchart only) */}
          {viewMode === "flowchart" && (
            <div className="cm-control-group cm-zoom-bar">
              <button onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.4))}>-</button>
              <span className="cm-zoom-pct">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={() => setZoomLevel(z => Math.min(z + 0.2, 3))}>+</button>
              <div className="cm-divider" />
              <button className="cm-reset-btn" onClick={() => setZoomLevel(1)}>RESET</button>
            </div>
          )}

          {/* Global Actions */}
          <div className="cm-control-group">
            <button className="cm-action-btn" onClick={expandAll}>Expand All</button>
            <button className="cm-action-btn" onClick={collapseAll}>Collapse All</button>
          </div>
        </div>
      </header>

      {viewMode === "list" ? (
        <div className="full-tree-container" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {nodes.map((node) => {
            const isNodeExpanded = expandedNodes[node.id];
            const hasModules = node.modules && node.modules.length > 0;

            return (
              <div key={node.id} className="tree-node-group" style={{ background: "var(--bg2)", borderRadius: 12, padding: 20, border: `1px solid ${pathData.color}33`, transition: "all 0.2s" }}>
                <div
                  className="tree-item node"
                  onClick={(e) => hasModules ? toggleNode(e, node.id) : handleSelect(e, node, null, null)}
                  style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}
                >
                  <div
                    onClick={(e) => hasModules && toggleNode(e, node.id)}
                    style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text3)", transition: "transform 0.2s", transform: isNodeExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                  >
                    {hasModules ? <ChevronRight size={16} /> : ""}
                  </div>
                  <span className="tree-icon" style={{ background: pathData.color, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, color: "#fff" }}><Box size={18} /></span>
                  <span className="tree-label" style={{ transition: "color 0.2s", flex: 1 }} onMouseOver={e => e.target.style.color = pathData.color} onMouseOut={e => e.target.style.color = "var(--text)"}>{node.title}</span>

                  <button
                    onClick={(e) => handleSelect(e, node, null, null)}
                    className="rg-btn view-btn"
                    style={{ fontSize: 11, padding: "4px 10px", background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: 4 }}
                  >
                    View Details ↗
                  </button>
                </div>

                {isNodeExpanded && (
                  <div className="tree-children" style={{ paddingLeft: 46, borderLeft: "2px solid var(--border)", marginLeft: 34, display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
                    {(node.modules || []).map((mod) => {
                      const isModExpanded = expandedModules[mod.id];
                      const hasTopics = mod.subtopics && mod.subtopics.length > 0;

                      return (
                        <div key={mod.id} className="tree-module-group">
                          <div
                            className="tree-item module"
                            onClick={(e) => hasTopics ? toggleModule(e, mod.id) : handleSelect(e, node, mod, null)}
                            style={{ fontSize: 15, fontWeight: 600, color: "var(--text2)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
                          >
                            <div
                              onClick={(e) => hasTopics && toggleModule(e, mod.id)}
                              style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--border2)", transition: "transform 0.2s", transform: isModExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                            >
                              {hasTopics ? <ChevronRight size={14} /> : ""}
                            </div>
                            <span style={{ color: pathData.color, display: "flex", alignItems: "center" }}>{isModExpanded ? <Hexagon size={14} fill="currentColor" /> : <Hexagon size={14} />}</span>
                            <span className="tree-label" style={{ transition: "color 0.2s", flex: 1 }} onMouseOver={e => e.target.style.color = "var(--text)"} onMouseOut={e => e.target.style.color = "var(--text2)"}>{mod.title}</span>

                            <button
                              onClick={(e) => handleSelect(e, node, mod, null)}
                              className="rg-btn view-btn"
                              style={{ fontSize: 10, padding: "2px 8px", background: "transparent", border: "1px solid transparent", color: "var(--text3)", borderRadius: 4 }}
                              onMouseOver={e => e.target.style.border = "1px solid var(--border)"} onMouseOut={e => e.target.style.border = "1px solid transparent"}
                            >
                              Open ↗
                            </button>
                          </div>

                          {isModExpanded && (
                            <div className="tree-subchildren" style={{ paddingLeft: 24, borderLeft: "1px dashed var(--border)", marginLeft: 22, display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                              {(mod.subtopics || []).map((topic) => {
                                const topicId = typeof topic === "object" ? topic.id : topic;
                                const topicTitle = typeof topic === "object" ? topic.title : topic;

                                return (
                                  <div
                                    key={topicId}
                                    className="tree-item topic"
                                    onClick={(e) => handleSelect(e, node, mod, typeof topic === "object" ? topic : { id: topic, title: topic, content: "" })}
                                    style={{ fontSize: 13, color: "var(--text3)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 0" }}
                                    onMouseOver={e => e.target.style.color = "var(--text)"} onMouseOut={e => e.target.style.color = "var(--text3)"}
                                  >
                                    <span style={{ color: "var(--border2)", display: "flex" }}><Minus size={12} /></span>
                                    <span className="tree-label" style={{ flex: 1 }}>{topicTitle}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="hybrid-tree-wrapper" style={{
          "--connector-color": `${pathData.color}CC`,
          paddingBottom: 80, paddingLeft: 40, paddingTop: 40,
          overflowX: "auto", display: "flex", flexDirection: "column", alignItems: "flex-start",
          zoom: zoomLevel, transition: "zoom 0.2s ease-in-out"
        }}>

          <div className="org-node root-node" style={{ marginBottom: 40 }}>{pathData.title || "Study Path"}</div>

          {nodes.length > 0 && (
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 40, paddingLeft: 60 }}>
              {/* PRIMARY VERTICAL TRUNK */}
              <div style={{ position: "absolute", left: -40 + 34, top: -40, bottom: 20, borderLeft: "2px solid var(--connector-color)" }}></div>

              {nodes.map(node => {
                const isNodeExpanded = expandedNodes[node.id];
                const hasModules = node.modules && node.modules.length > 0;

                return (
                  <div key={node.id} style={{ position: "relative" }}>
                    {/* BRANCH STUB TO NODE */}
                    <div style={{ position: "absolute", left: -60 + 34, top: 32, width: 26, borderTop: "2px solid var(--connector-color)" }}></div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div className="org-node level-1" onClick={(e) => handleSelect(e, node, null, null)} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <span style={{ display: "flex", alignItems: "center" }}><Box size={20} /></span>
                        <span>{node.title}</span>
                      </div>

                      {hasModules && (
                        <button
                          onClick={(e) => toggleNode(e, node.id)}
                          className="rg-btn"
                          style={{ background: "var(--bg3)", color: "var(--text3)", border: "1px solid var(--border)", width: 28, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                        >
                          <div style={{ transition: "transform 0.3s", transform: isNodeExpanded ? "rotate(90deg)" : "rotate(0deg)", display: "flex" }}><ChevronRight size={16} /></div>
                        </button>
                      )}
                    </div>

                    {isNodeExpanded && hasModules && (
                      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 32, marginTop: 32, paddingLeft: 60 }}>
                        {/* MODULE TRUNK */}
                        <div style={{ position: "absolute", left: -60 + 34, top: -32, bottom: 32, borderLeft: "2px dashed var(--connector-color)" }}></div>

                        {node.modules.map(mod => {
                          const isModExpanded = expandedModules[mod.id];
                          const hasTopics = mod.subtopics && mod.subtopics.length > 0;

                          return (
                            <div key={mod.id} style={{ position: "relative" }}>
                              {/* BRANCH STUB TO MODULE */}
                              <div style={{ position: "absolute", left: -60 + 34, top: 24, width: 26, borderTop: "2px dashed var(--connector-color)" }}></div>

                              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div className="org-node level-2" onClick={(e) => handleSelect(e, node, mod, null)}>
                                  {mod.title}
                                </div>

                                {hasTopics && (
                                  <button
                                    onClick={(e) => toggleModule(e, mod.id)}
                                    className="rg-btn"
                                    style={{ background: "transparent", color: "var(--text3)", border: "1px solid var(--border)", width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                                  >
                                    <div style={{ transition: "transform 0.3s", transform: isModExpanded ? "rotate(90deg)" : "rotate(0deg)", display: "flex" }}><ChevronRight size={14} /></div>
                                  </button>
                                )}
                              </div>

                              {/* LEAF FLOWCHART - Renders Horizontally side-by-side! */}
                              {isModExpanded && hasTopics && (
                                <div style={{ position: "relative", marginTop: 12, paddingLeft: 0 }}>
                                  <ul className="leaf-flowchart">
                                    {mod.subtopics.map(topic => {
                                      const topicId = typeof topic === "object" ? topic.id : topic;
                                      const topicTitle = typeof topic === "object" ? topic.title : topic;

                                      return (
                                        <li key={topicId}>
                                          <div className="org-node level-3" onClick={(e) => handleSelect(e, node, mod, typeof topic === "object" ? topic : { id: topic, title: topic, content: "" })}>
                                            {topicTitle}
                                          </div>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
