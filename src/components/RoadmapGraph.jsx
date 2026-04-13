import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Edit2, Folder, Eye, ArrowRight, Plus, Layers, Trash2 } from "lucide-react";

export default function RoadmapGraph({
  path, activePath, setActivePath, pathsData,
  activeNode, onNodeClick,
  getNodeState, completedCount, onMarkState,
  onAddNode, onEditNode, onDeleteNode, isEditMode,
  lastCompletedNodeId, onAnimationTriggered
}) {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [traveler, setTraveler] = useState(null);

  useEffect(() => {
    if (!path?.nodes || !lastCompletedNodeId) return;
    
    // Find the node that was just completed
    const nodeIdx = path.nodes.findIndex(n => n.id === lastCompletedNodeId);
    if (nodeIdx !== -1) {
      const node = path.nodes[nodeIdx];
      const nextNode = path.nodes[nodeIdx + 1];

      if (nextNode) {
        // Wait a small bit for layout to settle after remount
        const timer = setTimeout(() => {
          const fromEl = nodeRefs.current[node.id];
          const toEl = nodeRefs.current[nextNode.id];
          const containerEl = containerRef.current;

          if (fromEl && toEl && containerEl) {
            // Auto-scroll to ensure target is visible
            toEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const containerRect = containerEl.getBoundingClientRect();
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            const fromY = (fromRect.top + fromRect.height / 2) - containerRect.top;
            const toY = (toRect.top + toRect.height / 2) - containerRect.top;

            setTraveler({ fromY, toY, nextNode });
            if (onAnimationTriggered) onAnimationTriggered();
          }
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // No next node, still clear it
        if (onAnimationTriggered) onAnimationTriggered();
      }
    }
  }, [path?.nodes, lastCompletedNodeId, onAnimationTriggered]);

  if (!path) {
    return (
      <div className="roadmap-graph" style={{ padding: 40, color: "var(--text2)", textAlign: "center" }}>
        <h2>Loading Roadmap Data...</h2>
        <p>If you see this permanently, please Reset Defaults from the Sidebar.</p>
      </div>
    );
  }

  const { title, subtitle, color, nodes = [] } = path;
  const total = nodes.length || 0;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const inProgress = (nodes || []).filter((n) => getNodeState(n.id) === "progress").length;
  const notStarted = Math.max(0, total - completedCount - inProgress);

  // Build tabs
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

  const getStatusConfig = (state) => {
    switch (state) {
      case "done": return { label: "COMPLETED", color: "#00ff88" };
      case "progress": return { label: "IN PROGRESS", color: "#a855f7" };
      default: return { label: "READY", color: "#ffffff" };
    }
  };

  return (
    <div className="roadmap-graph" style={{ "--path-color": color }}>
      {/* Path Tabs Overlay */}
      <div className="rg-tabs-overlay">
        {tabLabels.map((t) => (
          <button
            key={t.key}
            className={`rg-tab ${activePath === t.key ? "active" : ""}`}
            style={{
              "--tab-color": activePath === t.key ? path.color : undefined,
              "--tab-bg": activePath === t.key ? `${path.color}12` : "rgba(255,255,255,0.03)",
            }}
            onClick={() => setActivePath && setActivePath(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rg-premium-header">
        <div className="rg-progress-pill">
          <div className="rg-pill-top">
            <div className="rg-pill-stats">
              <span className="rg-pill-title">{completedCount} / {total} COMPLETED</span>
              <span className="rg-pill-pct">{pct}%</span>
            </div>
            <div className="rg-pill-estimate">
              ESTIMATED TIME: {path.estimatedHours || "400+ HOURS"}
            </div>
          </div>
          
          <div className="rg-pill-bar-container">
            <div 
              className="rg-pill-bar-fill" 
              style={{ width: `${pct}%`, background: color }}
            />
          </div>

          <div className="rg-pill-badges">
            <div className="rg-pill-badge">{inProgress} IN PROGRESS</div>
            <div className="rg-pill-badge">{notStarted} NOT STARTED</div>
          </div>
        </div>
      </div>

      <div className="rg-nodes">
        <div className="rg-nodes-container" ref={containerRef}>
          {/* Central Line */}
          <div className="rg-central-line" />

          {/* Minimalist Traveler Animation */}
          <AnimatePresence>
            {traveler && (
              <motion.div
                key="traveler-dot"
                className="rg-traveler-dot"
                initial={{ 
                  top: traveler.fromY, 
                  left: "50%", 
                  translateX: "-50%", 
                  opacity: 0, 
                  scale: 0 
                }}
                animate={{ 
                  top: traveler.toY, 
                  opacity: [0, 1, 1, 0], 
                  scale: [0, 1.4, 1.2, 0] 
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2.2, 
                  ease: [0.65, 0, 0.35, 1],
                }}
                onAnimationComplete={() => {
                  // Add a small delay so the dot "lands" before opening the next node
                  setTimeout(() => {
                    if (traveler.nextNode && onNodeClick) {
                      onNodeClick(traveler.nextNode);
                    }
                    setTraveler(null);
                  }, 500); 
                }}
              />
            )}
          </AnimatePresence>

          {/* Insertion button BEFORE the first node */}
          {isEditMode && nodes.length > 0 && (
            <div 
              className="rg-line-plus-btn top"
              onClick={() => onAddNode(0)}
              title="Insert Node at Beginning"
            >
              <Plus size={12} />
            </div>
          )}

          {nodes.map((node, i) => {
            const state = getNodeState(node.id);
            const statusConfig = getStatusConfig(state);
            const isActive = activeNode?.id === node.id;
            const isLeft = i % 2 === 0;

            return (
              <React.Fragment key={node.id}>
                <div 
                  className={`rg-node-item ${isLeft ? 'left' : 'right'}`}
                >
                  {/* Glowing Point on Line */}
                  <div 
                    ref={el => nodeRefs.current[node.id] = el}
                    className="rg-line-point" 
                    style={{ "--status-color": statusConfig.color }}
                  />

                  {/* The Card */}
                  <div 
                    className={`rg-node-card ${isActive ? 'active' : ''}`}
                    onClick={() => onNodeClick(node)}
                    style={{ "--node-color": color }}
                  >
                    <div className="rg-node-card-header">
                      <div className="rg-node-idx-pill">
                        <div className="rg-node-num">{String(i + 1).padStart(2, "0")}</div>
                        <div className="rg-node-subnodes-tag">
                          <Layers size={10} />
                          {node.modules?.length || 0} SUBNODES
                        </div>
                      </div>
                      <div className="rg-node-actions">
                        <Folder size={14} className="rg-node-action-icon" />
                        <Eye size={14} className="rg-node-action-icon" />
                        {isEditMode && (
                          <>
                            <div 
                              className="rg-node-action-icon"
                              onClick={(e) => { e.stopPropagation(); onEditNode(node); }}
                              title="Edit Node"
                            >
                              <Edit2 size={14} />
                            </div>
                            <div 
                              className="rg-node-action-icon delete"
                              onClick={(e) => { e.stopPropagation(); onDeleteNode && onDeleteNode(node.id); }}
                              title="Delete Node"
                            >
                              <Trash2 size={14} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Floating Module Waves */}
                    <div className="rg-module-waves">
                      {(node.modules || []).slice(0, 5).map((mod, idx) => (
                        <div 
                          key={mod.id} 
                          className="rg-module-wave"
                          style={{ "--idx": idx, "--count": Math.min(node.modules.length, 5) }}
                        >
                          <div className="rg-module-string" />
                          {mod.title}
                        </div>
                      ))}
                    </div>

                    <div className="rg-node-title">{node.title}</div>
                    <div className="rg-node-desc">{node.subtitle || node.description}</div>

                    <div className="rg-node-card-footer">
                      <div 
                        className="rg-node-status-label"
                        style={{ "--status-color": statusConfig.color }}
                      >
                        <div className="rg-node-status-dot" />
                        {statusConfig.label}
                      </div>
                      <div className="rg-node-explore">
                        EXPLORE <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Insertion button AFTER this node (centered in the gap) */}
                  {isEditMode && i < nodes.length - 1 && (
                    <div 
                      className="rg-line-plus-btn"
                      onClick={() => onAddNode(i + 1)}
                      title="Insert Node Here"
                    >
                      <Plus size={12} />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* Add Node Button */}
          {isEditMode && (
            <div className="rg-add-node-btn-container" onClick={() => onAddNode(-1)}>
              <div className="rg-add-icon-circle">
                <Plus size={24} />
              </div>
              <span className="rg-add-label">Add New Node</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

