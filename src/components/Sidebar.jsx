import { LayoutDashboard, Network, CheckSquare, CircleDashed, BookOpen, Users, Hexagon, Edit2, Edit3, Eye, RotateCcw, Terminal, LogOut, Sun, Moon, Boxes, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({
  activePath, setActivePath, paths,
  activeNode, onReset, isEditMode, setIsEditMode, onAddPath, onEditPath,
  showCurriculumMap, setShowCurriculumMap,
  showIDE, setShowIDE,
  showResources, setShowResources,
  showProgress, setShowProgress,
  showPlayground, setShowPlayground,
  setActiveNode, setActiveModule, setActiveTopic,
  theme, toggleTheme
}) {
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={16} />, label: "Overview",      id: "overview" },
    { icon: <Network size={16} />,         label: "Curriculum Map", id: "curriculum_map" },
    { icon: <Terminal size={16} />,        label: "Practice IDE",   id: "ide" },
    { icon: <CheckSquare size={16} />,     label: "Tasks",          id: "tasks" },
    { icon: <CircleDashed size={16} />,    label: "Progress",       id: "progress" },
    { icon: <BookOpen size={16} />,        label: "Resources",      id: "resources" },
    { icon: <Boxes size={16} />,           label: "Playground",     id: "playground" },
    { icon: <Users size={16} />,           label: "Community",      id: "community" },
  ];

  const getActiveId = () => {
    if (showPlayground)    return "playground";
    if (showProgress)      return "progress";
    if (showIDE)           return "ide";
    if (showResources)     return "resources";
    if (showCurriculumMap) return "curriculum_map";
    if (!activeNode)       return "overview";
    return null;
  };

  const activeNavId = getActiveId();

  const handleNavClick = (id) => {
    if (setActiveNode)   setActiveNode(null);
    if (setActiveModule) setActiveModule(null);
    if (setActiveTopic)  setActiveTopic(null);

    // Close all panels
    setShowCurriculumMap(false);
    if (setShowIDE)        setShowIDE(false);
    if (setShowResources)  setShowResources(false);
    if (setShowProgress)   setShowProgress(false);
    if (setShowPlayground) setShowPlayground(false);

    // Open selected
    switch (id) {
      case "curriculum_map": setShowCurriculumMap(true);             break;
      case "ide":            if (setShowIDE)        setShowIDE(true);        break;
      case "resources":      if (setShowResources)  setShowResources(true);  break;
      case "progress":       if (setShowProgress)   setShowProgress(true);   break;
      case "playground":     if (setShowPlayground) setShowPlayground(true); break;
      default: break;
    }
  };

  const pathList = Object.keys(paths || {}).map(k => {
    const p = paths[k];
    if (!p) return null;
    const nodeCount = p.nodes ? p.nodes.length : 0;

    let totalModules = 0;
    let completedModules = 0;
    (p.nodes || []).forEach(n => {
      (n.modules || []).forEach(m => {
        totalModules++;
        if (m.status === 'complete') completedModules++;
      });
    });
    const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    let bg = "rgba(255,255,255,0.05)";
    if (p.color && p.color.startsWith("#")) {
      const hex = p.color.replace("#", "");
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        bg = `rgba(${r},${g},${b},0.08)`;
      }
    }

    let label = p.title || p.id || k;
    if (k === "ds"      && (!p.title || p.title === "Data Science Curriculum")) label = "Data Science";
    if (k === "genai"   && (!p.title || p.title === "Gen AI Curriculum"))       label = "Gen AI";
    if (k === "agentic" && (!p.title || p.title === "Agentic AI Curriculum"))   label = "Agentic AI";
    if (label.includes("Curriculum")) label = label.replace(" Curriculum", "");

    return { key: k, label, color: p.color || "#00ff88", bg, badge: `${nodeCount} nodes`, progressPercent };
  });

  /* Active path color for the collapsed path dot */
  const activePColor = pathList.find(p => p?.key === activePath)?.color || "#00ff88";

  return (
    <aside className={`sidebar${isCollapsed ? " sidebar-collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-logo">
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "rgba(0,255,136,.15)", border: "1px solid rgba(0,255,136,.3)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff88",
          flexShrink: 0
        }}>
          <Hexagon size={16} />
        </div>
        {!isCollapsed && <span className="brand">GenAI<span>Academy</span></span>}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(c => !c)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        <div className="sidebar-section">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${activeNavId === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
              data-label={item.label}
            >
              <span className="sidebar-item-icon">
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Collapsed: active path dot indicator */}
      {isCollapsed && (
        <div className="sidebar-path-dot-strip">
          <div
            className="sidebar-path-dot-btn"
            style={{ background: activePColor, boxShadow: `0 0 8px ${activePColor}80` }}
            title={pathList.find(p => p?.key === activePath)?.label || "Active Path"}
          />
        </div>
      )}

      {!isCollapsed && <div className="sidebar-path-pills">
        <div className="sidebar-section-label">Learning Paths</div>
        {pathList.filter(Boolean).map((p) => (
          <div key={p.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className={`path-pill ${activePath === p.key ? "active" : ""}`}
              style={{
                "--pill-color": p.color,
                "--pill-bg": p.bg,
                flex: 1,
                flexDirection: "column",
                alignItems: "stretch",
                gap: 8,
                padding: "8px 10px"
              }}
              onClick={() => setActivePath(p.key)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                <span className="pill-dot" style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
                  {p.label}
                </span>
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
      </div>}

      <div className="sidebar-footer">
        <div
          className="sidebar-footer-item"
          onClick={() => setIsEditMode(!isEditMode)}
          data-label={isEditMode ? "Edit Mode: ON" : "View Mode"}
          style={{ cursor: "pointer", color: isEditMode ? "#f59e0b" : "var(--text2)", fontWeight: 700 }}
        >
          {isEditMode ? <Edit3 size={15} /> : <Eye size={15} />}
          {!isCollapsed && <span>{isEditMode ? "Edit Mode: ON" : "View Mode"}</span>}
        </div>
        <div
          className="sidebar-footer-item"
          onClick={toggleTheme}
          data-label={theme === "dark" ? "Light Mode" : "Dark Mode"}
          style={{ cursor: "pointer", color: "var(--text2)", fontWeight: 700 }}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </div>
        <div
          className="sidebar-footer-item"
          onClick={onReset}
          data-label="Reset Defaults"
          style={{ cursor: "pointer", color: "#ec4899", fontWeight: 700 }}
        >
          <RotateCcw size={15} />
          {!isCollapsed && <span>Reset Defaults</span>}
        </div>
        <div
          className="sidebar-footer-item sidebar-footer-signout"
          onClick={signOut}
          data-label="Sign Out"
        >
          <LogOut size={15} />
          {!isCollapsed && <span>Sign Out</span>}
        </div>
      </div>
    </aside>
  );
}