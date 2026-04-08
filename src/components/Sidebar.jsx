import { LayoutDashboard, Network, CheckSquare, CircleDashed, BookOpen, Users, Hexagon, Edit2, Edit3, Eye, RotateCcw, Terminal, LogOut, Sun, Moon, Boxes, ChevronLeft, ChevronRight, Clapperboard, BookMarked, Database, Shield } from "lucide-react";
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
  showDSAAnimator, setShowDSAAnimator,
  showBlog, setShowBlog,
  showContentStudio, setShowContentStudio,
  showAdminManagement, setShowAdminManagement,
  setActiveNode, setActiveModule, setActiveTopic,
  theme, toggleTheme,
  onSignOut
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAdmin } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={16} />,  label: "Overview",      id: "overview" },
    { icon: <Network size={16} />,          label: "Curriculum Map", id: "curriculum_map" },
    { icon: <Terminal size={16} />,         label: "Practice IDE",   id: "ide" },
    { icon: <CheckSquare size={16} />,      label: "Tasks",          id: "tasks" },
    { icon: <CircleDashed size={16} />,     label: "Progress",       id: "progress" },
    { icon: <BookOpen size={16} />,         label: "Resources",      id: "resources" },
    { icon: <Boxes size={16} />,            label: "Playground",     id: "playground" },
    { icon: <Clapperboard size={16} />,     label: "DSA Animator",   id: "dsa_animator" },
    { icon: <BookMarked size={16} />,       label: "Blog",           id: "blog" },
    ...(isAdmin ? [
      { icon: <Database size={16} />, label: "Content Studio", id: "content_studio" },
      { icon: <Shield size={16} />,   label: "System Admin",   id: "admin_management" }
    ] : []),
    { icon: <Users size={16} />,            label: "Community",      id: "community" },
  ];

  const getActiveId = () => {
    if (showAdminManagement) return "admin_management";
    if (showContentStudio) return "content_studio";
    if (showBlog)          return "blog";
    if (showDSAAnimator)   return "dsa_animator";
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
    if (setShowIDE)           setShowIDE(false);
    if (setShowResources)     setShowResources(false);
    if (setShowProgress)      setShowProgress(false);
    if (setShowPlayground)    setShowPlayground(false);
    if (setShowDSAAnimator)   setShowDSAAnimator(false);
    if (setShowBlog)          setShowBlog(false);
    if (setShowContentStudio) setShowContentStudio(false);
    if (setShowAdminManagement) setShowAdminManagement(false);

    // Open selected
    switch (id) {
      case "curriculum_map": setShowCurriculumMap(true);                             break;
      case "ide":            if (setShowIDE)          setShowIDE(true);          break;
      case "resources":      if (setShowResources)    setShowResources(true);    break;
      case "progress":       if (setShowProgress)     setShowProgress(true);     break;
      case "playground":     if (setShowPlayground)   setShowPlayground(true);   break;
      case "dsa_animator":   if (setShowDSAAnimator)  setShowDSAAnimator(true);  break;
      case "blog":           if (setShowBlog)         setShowBlog(true);         break;
      case "content_studio": if (setShowContentStudio)setShowContentStudio(true); break;
      case "admin_management": if (setShowAdminManagement) setShowAdminManagement(true); break;
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
      {/* ── Morphing Header ── */}
      <div className="sidebar-logo morphing-header">
        <div className="logo-orb">
          <svg className="quantum-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Orbit 1 */}
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(-30 50 50)" className="logo-orbit" />
            {/* Outer Orbit 2 */}
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(30 50 50)" className="logo-orbit" />
            {/* Outer Orbit 3 */}
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(90 50 50)" className="logo-orbit" />
            
            {/* Orbiting Nodes */}
            <circle r="3" className="logo-node node-1" />
            <circle r="3" className="logo-node node-2" />
            <circle r="3" className="logo-node node-3" />

            {/* Central Nucleus */}
            <path d="M50 35L63 42.5V57.5L50 65L37 57.5V42.5L50 35Z" className="logo-nucleus" />
            <circle cx="50" cy="50" r="4" className="logo-core" />
          </svg>
          <div className="logo-pulse" />
        </div>
        
        <div className="logo-morph-wrapper">
          <div className="brand-layer">
            <span className="brand pixar-brand">
              {"GenAI".split("").map((char, i) => (
                <span key={i} className={`pixar-char ${char === 'I' ? 'char-i' : ''}`} style={{ "--idx": i }}>
                  {char}
                </span>
              ))}
              <span className="pixar-space">&nbsp;</span>
              {"Academy".split("").map((char, i) => (
                <span key={i + 5} className="pixar-char academy-char" style={{ "--idx": i + 6 }}>
                  {char}
                </span>
              ))}
            </span>
          </div>

          <div className="controls-layer">
            <button 
              className={`morph-icon ${isEditMode ? "active" : ""}`}
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Edit Mode: ON" : "View Mode"}
              style={{ "--idx": 1 }}
            >
              {isEditMode ? <Edit3 size={14} /> : <Eye size={14} />}
            </button>
            <button 
              className="morph-icon"
              onClick={toggleTheme}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              style={{ "--idx": 2 }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button 
              className="morph-icon warning"
              onClick={onReset}
              title="Reset Defaults"
              style={{ "--idx": 3 }}
            >
              <RotateCcw size={14} />
            </button>
            <div className="morph-divider" />
            <button 
              className="morph-icon danger"
              onClick={onSignOut}
              title="Sign Out"
              style={{ "--idx": 4 }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(c => !c)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* ── Independent Navigation Scroll ── */}
      <div className="sidebar-nav-container">
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
      </div>

      <div className="sidebar-divider" />

      {/* ── Independent Paths Scroll ── */}
      <div className="sidebar-paths-container">
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
            <div key={p.key} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
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
                onClick={() => {
                  setActivePath(p.key);
                  if (setActiveNode) setActiveNode(null);
                  if (setActiveModule) setActiveModule(null);
                  if (setActiveTopic) setActiveTopic(null);
                }}
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
      </div>


    </aside>
  );
}