import { LayoutDashboard, Network, CheckSquare, CircleDashed, BookOpen, Users, Hexagon, Edit2, Edit3, Eye, RotateCcw, Terminal, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ 
  activePath, setActivePath, paths, 
  activeNode, onReset, isEditMode, setIsEditMode, onAddPath, onEditPath,
  showCurriculumMap, setShowCurriculumMap,
  showIDE, setShowIDE,
  showResources, setShowResources,
  showProgress, setShowProgress,
  setActiveNode, setActiveModule, setActiveTopic,
  theme, toggleTheme
}) {
  const { signOut } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={14} />, label: "Overview", id: "overview" },
    { icon: <Network size={14} />, label: "Curriculum Map", id: "curriculum_map" },
    { icon: <Terminal size={14} />, label: "Practice IDE", id: "ide" },
    { icon: <CheckSquare size={14} />, label: "Tasks", id: "tasks" },
    { icon: <CircleDashed size={14} />, label: "Progress", id: "progress" },
    { icon: <BookOpen size={14} />, label: "Resources", id: "resources" },
    { icon: <Users size={14} />, label: "Community", id: "community" },
  ];

  const pathList = Object.keys(paths || {}).map(k => {
    const p = paths[k];
    if (!p) return null;
    const nodeCount = p.nodes ? p.nodes.length : 0;
    
    // Progress Calculation
    let totalModules = 0;
    let completedModules = 0;
    (p.nodes || []).forEach(n => {
       (n.modules || []).forEach(m => {
          totalModules++;
          if (m.status === 'complete') completedModules++;
       });
    });
    const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Hex to RGBA conversion for background highlight
    let bg = "rgba(255,255,255,0.05)";
    if (p.color && p.color.startsWith("#")) {
      const hex = p.color.replace("#", "");
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        bg = `rgba(${r},${g},${b},0.08)`;
      }
    }
    
    // Fallback names for old datasets
    let label = p.title || p.id || k;
    if (k === "ds" && (!p.title || p.title === "Data Science Curriculum")) label = "Data Science";
    if (k === "genai" && (!p.title || p.title === "Gen AI Curriculum")) label = "Gen AI";
    if (k === "agentic" && (!p.title || p.title === "Agentic AI Curriculum")) label = "Agentic AI";
    
    // Convert full titles to short sidebar labels if too long
    if (label.includes("Curriculum")) label = label.replace(" Curriculum", "");

    return {
      key: k,
      label: label,
      color: p.color || "#00ff88",
      bg: bg,
      badge: `${nodeCount} nodes`,
      progressPercent
    };
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(0,255,136,.15)", border: "1px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff88" }}><Hexagon size={16} /></div>
        <span className="brand">GenAI<span>Academy</span></span>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-section">
          {navItems.map((item) => (
            <div 
              key={item.id} 
              className={`sidebar-item ${(item.id === "curriculum_map" && showCurriculumMap) || (item.id === "ide" && showIDE) || (item.id === "resources" && showResources) || (item.id === "progress" && showProgress) || (item.id === "overview" && !showCurriculumMap && !showIDE && !showResources && !showProgress && !activeNode) ? "active" : ""}`}
              onClick={() => {
                if (item.id === "curriculum_map") {
                  setShowCurriculumMap(true);
                  if (setShowIDE) setShowIDE(false);
                  if (setShowResources) setShowResources(false);
                  if (setShowProgress) setShowProgress(false);
                } else if (item.id === "ide") {
                  if (setShowIDE) setShowIDE(true);
                  if (setShowResources) setShowResources(false);
                  if (setShowProgress) setShowProgress(false);
                  setShowCurriculumMap(false);
                  if (setActiveNode) setActiveNode(null);
                  if (setActiveModule) setActiveModule(null);
                  if (setActiveTopic) setActiveTopic(null);
                } else if (item.id === "resources") {
                  if (setShowResources) setShowResources(true);
                  if (setShowIDE) setShowIDE(false);
                  if (setShowProgress) setShowProgress(false);
                  setShowCurriculumMap(false);
                  if (setActiveNode) setActiveNode(null);
                  if (setActiveModule) setActiveModule(null);
                  if (setActiveTopic) setActiveTopic(null);
                } else if (item.id === "progress") {
                  if (setShowProgress) setShowProgress(true);
                  if (setShowResources) setShowResources(false);
                  if (setShowIDE) setShowIDE(false);
                  setShowCurriculumMap(false);
                  if (setActiveNode) setActiveNode(null);
                  if (setActiveModule) setActiveModule(null);
                  if (setActiveTopic) setActiveTopic(null);
                } else if (item.id === "overview") {
                  setShowCurriculumMap(false);
                  if (setShowIDE) setShowIDE(false);
                  if (setShowResources) setShowResources(false);
                  if (setShowProgress) setShowProgress(false);
                  if (setActiveNode) setActiveNode(null);
                  if (setActiveModule) setActiveModule(null);
                  if (setActiveTopic) setActiveTopic(null);
                }
              }}
            >
              <span style={{ width: 14, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-path-pills">
        <div className="sidebar-section-label">Learning Paths</div>
        {pathList.filter(Boolean).map((p) => (
          <div key={p.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className={`path-pill ${activePath === p.key ? "active" : ""}`}
              style={{ "--pill-color": p.color, "--pill-bg": p.bg, flex: 1, flexDirection: "column", alignItems: "stretch", gap: 8, padding: "8px 10px" }}
              onClick={() => setActivePath(p.key)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                <span className="pill-dot" style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>{p.label}</span>
                <span className="pill-badge" style={{ marginLeft: "auto" }}>{p.progressPercent}%</span>
              </div>
              <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                 <div style={{ width: `${p.progressPercent}%`, height: "100%", background: p.color, transition: "width 0.4s ease-out" }} />
              </div>
            </button>
            {isEditMode && activePath === p.key && onEditPath && (
              <button 
                onClick={() => onEditPath(paths[p.key])} 
                className="rg-btn" 
                style={{ padding: "8px", background: "var(--bg3)", flexShrink: 0 }}
                title="Edit Path Settings"
              >
                <Edit2 size={12} />
              </button>
            )}
          </div>
        ))}
        {isEditMode && onAddPath && (
          <button 
            className="path-pill" 
            style={{ 
              "--pill-color": "var(--text3)", 
              "--pill-bg": "transparent", 
              border: "1px dashed var(--border2)", 
              justifyContent: "center", 
              marginTop: 8 
            }}
            onClick={onAddPath}
          >
            + Create New Path
          </button>
        )}
      </div>

      <div className="sidebar-footer">
        <div 
          className="sidebar-footer-item" 
          onClick={() => setIsEditMode(!isEditMode)} 
          style={{ cursor: "pointer", color: isEditMode ? "#f59e0b" : "var(--text)", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
        >
          {isEditMode ? <><Edit3 size={14} /> Edit Mode: ON</> : <><Eye size={14} /> View Mode</>}
        </div>
        <div 
          className="sidebar-footer-item" 
          onClick={toggleTheme} 
          style={{ cursor: "pointer", color: "var(--text)", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
        >
          {theme === "dark" ? <><Sun size={14} /> Light Mode</> : <><Moon size={14} /> Dark Mode</>}
        </div>
        <div className="sidebar-footer-item" onClick={onReset} style={{ cursor: "pointer", color: "#ec4899", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <RotateCcw size={14} /> Reset Defaults
        </div>
        <div className="sidebar-footer-item" onClick={signOut} style={{ cursor: "pointer", color: "var(--text3)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <LogOut size={14} /> Sign Out
        </div>
      </div>
    </aside>
  );
}
