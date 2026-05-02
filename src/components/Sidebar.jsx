import React, { useState, useEffect } from "react";
import { LayoutDashboard, Network, CheckSquare, CircleDashed, BookOpen, Users, Hexagon, Edit2, Edit3, Eye, RotateCcw, Terminal, LogOut, Sun, Moon, Boxes, Box, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clapperboard, BookMarked, Database, Shield, Cpu, Orbit, GraduationCap, Layers, BoxSelect, Sparkles, ExternalLink, Share2, Bookmark, GitCommit, GitBranch } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import BentoCard from "./BentoCard";

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
  showAdminManagement, setShowAdminManagement,
  showSimulator, setShowSimulator,
  showGalaxy, setShowGalaxy,
  showAimlCompanion, setShowAimlCompanion,
  showLinks, setShowLinks,
  showAIInterviewer, setShowAIInterviewer,
  showAlgoStudio, setShowAlgoStudio,
  showAlgoVisualizer, setShowAlgoVisualizer,
  showK8sGames, setShowK8sGames,
  showGitVisualizer, setShowGitVisualizer,
  showIntelligenceHub, setShowIntelligenceHub,
  showWorkplaceLab, setShowWorkplaceLab,
  showKnowledgeGraph, setShowKnowledgeGraph,
  showCommunity, setShowCommunity,
  isMobileMenuOpen, setIsMobileMenuOpen,
  setActiveNode, setActiveModule, setActiveTopic,
  theme, toggleTheme,
  onSignOut,
  onHubNav,
  setLinksInitialTab,
  showGitHubHub, setShowGitHubHub,
  isCollapsed, setIsCollapsed
}) {
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [isPathsVisible, setIsPathsVisible] = useState(true);
  const { isAdmin, isAdminView, setIsAdminView, allowAimlForAll, geminiKey, updateGeminiKey } = useAuth();
  const [localKey, setLocalKey] = useState(geminiKey || "");

  useEffect(() => {
    if (geminiKey) setLocalKey(geminiKey);
  }, [geminiKey]);

  const sidebarGroups = [
    {
      label: "Learn",
      items: [
        { icon: <LayoutDashboard size={14} />, label: "Home", id: "overview" },
        { icon: <Orbit size={14} />, label: "Knowledge Galaxy", id: "galaxy" },
        { icon: <Share2 size={14} />, label: "Knowledge Graph", id: "knowledge_graph" },
        { icon: <Network size={14} />, label: "Study Map", id: "curriculum_map" },
        { icon: <CircleDashed size={14} />, label: "Progress", id: "progress" },
      ]
    },
    {
      label: "Tools",
      items: [
        { icon: <Terminal size={14} />, label: "Practice IDE", id: "ide" },
        { icon: <Boxes size={14} />, label: "GenAI Simulator", id: "playground" },
        { icon: <Layers size={14} />, label: "System Simulator", id: "simulator" },
        { icon: <Clapperboard size={14} />, label: "DSA Animator", id: "dsa_animator" },
        { icon: <Box size={14} />, label: "Algo Visualizer", id: "algo_visualizer" },
        { icon: <Boxes size={14} />, label: "K8s Games", id: "k8s_games" },
        { icon: <GitCommit size={14} />, label: "Git Visualizer", id: "git_visualizer" },
      ]
    },
    {
      label: "Content",
      items: [
        { icon: <BookMarked size={14} />, label: "Blog", id: "blog" },
        { icon: <Bookmark size={14} />, label: "Links", id: "links" },
        { icon: <GitBranch size={14} />, label: "Github", id: "github" },
        { icon: <CheckSquare size={14} />, label: "Quick Notes", id: "tasks" },
        { icon: <BookOpen size={14} />, label: "Resources", id: "resources" },
        ...((isAdmin || allowAimlForAll) ? [
          { icon: <GraduationCap size={14} />, label: "AIML Companion", id: "aiml_companion" }
        ] : []),
        { icon: <Users size={14} />, label: "AI Interviewer", id: "interviewer" },
        { icon: <Users size={14} />, label: "Community", id: "community" },
      ]
    },
    ...(isAdmin && isAdminView ? [{
      label: "Admin",
      items: [
        { icon: <Shield size={14} />, label: "Admin Panel", id: "admin_management" },
        { icon: <Cpu size={14} />, label: "Algo Studio", id: "algo_studio" },
        { icon: <BoxSelect size={14} />, label: "Intelligence Hub", id: "hub" },
      ]
    }] : [])
  ];

  const handleResetClick = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    } else {
      onReset();
      setResetConfirm(false);
    }
  };

  const getActiveId = () => {
    if (showKnowledgeGraph) return "knowledge_graph";
    if (showAdminManagement) return "admin_management";
    if (showBlog) return "blog";
    if (showSimulator) return "simulator";
    if (showGalaxy) return "galaxy";
    if (showDSAAnimator) return "dsa_animator";
    if (showAimlCompanion) return "aiml_companion";
    if (showLinks) return "links";
    if (showPlayground) return "playground";
    if (showProgress) return "progress";
    if (showIDE) return "ide";
    if (showResources) return "resources";
    if (showCurriculumMap) return "curriculum_map";
    if (showAIInterviewer) return "interviewer";
    if (showAlgoStudio) return "algo_studio";
    if (showAlgoVisualizer) return "algo_visualizer";
    if (showK8sGames) return "k8s_games";
    if (showGitVisualizer) return "git_visualizer";
    if (showCommunity) return "community";
    if (showWorkplaceLab) return "tasks";
    if (showGitHubHub) return "github";
    if (showIntelligenceHub) return "hub";
    if (!activeNode) return "overview";
    return null;
  };

  const activeNavId = getActiveId();

  const handleNavClick = (id) => {
    if (setActiveNode) setActiveNode(null);
    if (setActiveModule) setActiveModule(null);
    if (setActiveTopic) setActiveTopic(null);

    setShowCurriculumMap(false);
    if (setShowIDE) setShowIDE(false);
    if (setShowResources) setShowResources(false);
    if (setShowProgress) setShowProgress(false);
    if (setShowPlayground) setShowPlayground(false);
    if (setShowDSAAnimator) setShowDSAAnimator(false);
    if (setShowAimlCompanion) setShowAimlCompanion(false);
    if (setShowLinks) setShowLinks(false);
    if (setShowBlog) setShowBlog(false);
    if (setShowAdminManagement) setShowAdminManagement(false);
    if (setShowSimulator) setShowSimulator(false);
    if (setShowGalaxy) setShowGalaxy(false);
    if (setShowAIInterviewer) setShowAIInterviewer(false);
    if (setShowAlgoStudio) setShowAlgoStudio(false);
    if (setShowAlgoVisualizer) setShowAlgoVisualizer(false);
    if (setShowK8sGames) setShowK8sGames(false);
    if (setShowGitVisualizer) setShowGitVisualizer(false);
    if (setShowWorkplaceLab) setShowWorkplaceLab(false);
    if (setShowKnowledgeGraph) setShowKnowledgeGraph(false);
    if (setShowGitHubHub) setShowGitHubHub(false);
    if (setShowCommunity) setShowCommunity(false);
    if (setShowIntelligenceHub) setShowIntelligenceHub(false);

    switch (id) {
      case "knowledge_graph": if (setShowKnowledgeGraph) setShowKnowledgeGraph(true); break;
      case "curriculum_map": setShowCurriculumMap(true); break;
      case "ide": if (setShowIDE) setShowIDE(true); break;
      case "resources": if (setShowResources) setShowResources(true); break;
      case "progress": if (setShowProgress) setShowProgress(true); break;
      case "playground": if (setShowPlayground) setShowPlayground(true); break;
      case "dsa_animator": if (setShowDSAAnimator) setShowDSAAnimator(true); break;
      case "aiml_companion": if (setShowAimlCompanion) setShowAimlCompanion(true); break;
      case "links": 
        if (setLinksInitialTab) setLinksInitialTab("links");
        if (setShowLinks) setShowLinks(true); 
        break;
      case "github":
        if (setShowGitHubHub) setShowGitHubHub(true);
        break;
      case "simulator": if (setShowSimulator) setShowSimulator(true); break;
      case "galaxy": if (setShowGalaxy) setShowGalaxy(true); break;
      case "blog": 
        setIsBlogExpanded(!isBlogExpanded);
        if (onHubNav) onHubNav({ view: 'blog', year: null, isAI: false }); 
        break;
      case "admin_management":
        if (setShowAdminManagement) setShowAdminManagement(true);
        break;
      case "interviewer":
        if (setShowAIInterviewer) setShowAIInterviewer(true);
        break;
      case "algo_studio":
        if (setShowAlgoStudio) setShowAlgoStudio(true);
        break;
      case "algo_visualizer":
        if (setShowAlgoVisualizer) setShowAlgoVisualizer(true);
        break;
      case "k8s_games":
        if (setShowK8sGames) setShowK8sGames(true);
        break;
      case "git_visualizer":
        if (setShowGitVisualizer) setShowGitVisualizer(true);
        break;
      case "tasks":
        if (setShowWorkplaceLab) setShowWorkplaceLab(true);
        break;
      case "hub":
        if (setShowIntelligenceHub) setShowIntelligenceHub(true);
        break;
      case "community":
        if (setShowCommunity) setShowCommunity(true);
        break;
      default: break;
    }

    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
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
    if (k === "ds" && (!p.title || p.title === "Data Science Curriculum")) label = "Data Science";
    if (k === "genai" && (!p.title || p.title === "Gen AI Curriculum")) label = "Gen AI";
    if (k === "agentic" && (!p.title || p.title === "Agentic AI Curriculum")) label = "Agentic AI";
    if (label.includes("Curriculum")) label = label.replace(" Curriculum", "");

    return { key: k, label, color: p.color || "#00ff88", bg, badge: `${nodeCount} nodes`, progressPercent };
  });

  return (
    <aside className={`sidebar${isCollapsed ? " sidebar-collapsed" : ""}${isMobileMenuOpen ? " sidebar-mobile-open" : ""}${isPathsVisible ? " sidebar-paths-visible" : ""}`}>
      <div className="sidebar-logo morphing-header">
        <div className="logo-orb">
          <svg className="quantum-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(-30 50 50)" className="logo-orbit" />
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(30 50 50)" className="logo-orbit" />
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(90 50 50)" className="logo-orbit" />
            <circle r="3" className="logo-node node-1" />
            <circle r="3" className="logo-node node-2" />
            <circle r="3" className="logo-node node-3" />
            <path d="M50 35L63 42.5V57.5L50 65L37 57.5V42.5L50 35Z" className="logo-nucleus" />
            <circle cx="50" cy="50" r="4" className="logo-core" />
          </svg>
          <div className="logo-pulse" />
        </div>

        {!isCollapsed && (
          <div className="brand-layer">
            <div className="brand-stack">
              <span className="brand pixar-brand line-1">
                {"GenAI".split("").map((char, i) => (
                  <span key={i} className={`pixar-char ${char === 'I' ? 'char-i' : ''}`} style={{ "--idx": i }}>
                    {char}
                  </span>
                ))}
              </span>
              <span className="brand pixar-brand line-2">
                {"Academy".split("").map((char, i) => (
                  <span key={i + 6} className="pixar-char academy-char" style={{ "--idx": i + 6 }}>
                    {char}
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      <button
        className="sidebar-collapse-btn"
        onClick={() => setIsCollapsed(c => !c)}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="sidebar-nav-container">
        <div className="sidebar-nav">
          {sidebarGroups.map((group) => (
            <div key={group.label} className="sidebar-group">
              {!isCollapsed && (
                <div className="sidebar-section-header">
                  <span className="sidebar-section-label">{group.label}</span>
                </div>
              )}
              <div className="sidebar-section">
                {group.items.map((item) => (
                  <React.Fragment key={item.id}>
                    <div
                      className={`sidebar-item ${activeNavId === item.id ? "active" : ""}`}
                      onClick={() => handleNavClick(item.id)}
                      data-label={item.label}
                    >
                      <span className="sidebar-item-icon">
                        {item.icon}
                      </span>
                      {!isCollapsed && <span>{item.label}</span>}
                      {!isCollapsed && item.id === 'blog' && (
                        <ChevronRight size={12} style={{ marginLeft: 'auto', transition: '0.3s', transform: isBlogExpanded ? 'rotate(90deg)' : 'none' }} />
                      )}
                    </div>

                    {!isCollapsed && item.id === 'blog' && isBlogExpanded && (
                      <div className="sidebar-sub-menu">
                        <div className="sub-item ai-sub" onClick={() => onHubNav({ view: 'blog', year: null, isAI: true })}>
                          <Sparkles size={12} />
                          <span>Neural Pilot</span>
                        </div>
                        <div className="sub-item" onClick={() => onHubNav({ view: 'blog', year: '2025', isAI: false })}>
                          <div className="sub-dot" />
                          <span>2025 Repository</span>
                        </div>
                        <div className="sub-item" onClick={() => onHubNav({ view: 'blog', year: '2024', isAI: false })}>
                          <div className="sub-dot" />
                          <span>2024 Repository</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {!isCollapsed && <div className="group-divider" />}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-divider-wrapper">
        <div className="sidebar-divider" />
        {!isCollapsed && (
          <button 
            className="sidebar-paths-toggle"
            onClick={() => setIsPathsVisible(!isPathsVisible)}
            title={isPathsVisible ? "Hide Learning Paths" : "Show Learning Paths"}
          >
            {isPathsVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        )}
      </div>

      <div className="sidebar-paths-container">
        {isCollapsed && (
          <div className="sidebar-path-dot-strip">
            {pathList.filter(Boolean).map(p => (
              <div
                key={p.key}
                className={`sidebar-path-dot-btn ${activePath === p.key ? "active" : ""}`}
                style={{ 
                  background: activePath === p.key ? p.color : 'transparent',
                  border: `1.5px solid ${p.color}`,
                  boxShadow: activePath === p.key ? `0 0 10px ${p.color}80` : 'none'
                }}
                onClick={() => setActivePath(p.key)}
                data-label={`${p.label} (${p.progressPercent}%)`}
              >
                <span>{p.label.charAt(0)}</span>
              </div>
            ))}
          </div>
        )}

        {!isCollapsed && <div className="sidebar-path-pills">
          <div className="sidebar-section-header">
            <span className="sidebar-section-label">Study Paths</span>
          </div>
          <AnimatePresence>
            {isPathsVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
                exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="sidebar-paths-list"
              >
                {pathList.filter(Boolean).map((p) => (
                  <div
                    key={p.key}
                    className={`path-pill-container ${activePath === p.key ? "active" : ""}`}
                    style={{ "--pill-color": p.color, "--pill-bg": p.bg }}
                  >
                    <button
                      className="path-pill"
                      onClick={() => {
                        setActivePath(p.key);
                        if (setActiveNode) setActiveNode(null);
                        if (setActiveModule) setActiveModule(null);
                        if (setActiveTopic) setActiveTopic(null);
                        if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="path-pill-main">
                        <span className="pill-dot" />
                        <span className="pill-label">{p.label}</span>
                        <span className="pill-percentage">{p.progressPercent}%</span>
                      </div>
                      <div className="path-pill-progress">
                        <div className="path-pill-progress-fill" style={{ width: `${p.progressPercent}%`, background: p.color }} />
                      </div>
                    </button>

                    {isEditMode && activePath === p.key && onEditPath && (
                      <button
                        onClick={() => onEditPath(paths[p.key])}
                        className="path-edit-btn"
                        title="Path Settings"
                      >
                        <Edit2 size={11} />
                      </button>
                    )}
                  </div>
                ))}

                {isEditMode && onAddPath && (
                  <button
                    className="path-pill-add"
                    onClick={onAddPath}
                  >
                    <Edit3 size={12} style={{ opacity: 0.6 }} />
                    <span>Create New Path</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>}
      </div>

      <div className="sidebar-footer">
        <div className="footer-super-button-container">
          <div className="footer-popout-menu">
            <div className="popout-section-label" style={{ fontSize: 9, fontWeight: 900, color: 'var(--text3)', padding: '8px 16px 4px', letterSpacing: 1 }}>SYSTEM_CONFIG</div>
            
            {isAdmin && (
              <div className="popout-item" style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Shield size={14} color={isAdminView ? "var(--neon)" : "var(--text3)"} />
                  <span>Admin View</span>
                </div>
                <div 
                  className={`admin-view-toggle ${isAdminView ? 'active' : ''}`}
                  onClick={() => {
                    const nextState = !isAdminView;
                    setIsAdminView(nextState);
                    localStorage.setItem('genai_isAdminView', nextState.toString());
                  }}
                  style={{
                    width: 32,
                    height: 18,
                    borderRadius: 20,
                    background: isAdminView ? 'var(--neon)' : 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <motion.div 
                    animate={{ x: isAdminView ? 16 : 2 }}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: isAdminView ? '#000' : '#fff',
                      position: 'absolute',
                      top: 2,
                      left: 0
                    }}
                  />
                </div>
              </div>
            )}

            <button 
              className={`popout-item ${isEditMode ? 'active edit' : ''}`}
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            >
              {isEditMode ? <Edit3 size={14} /> : <Eye size={14} />}
              <span>{isEditMode ? "Edit Mode" : "View Mode"}</span>
            </button>

            <button 
              className={`popout-item theme-toggle overlay-item ${theme === 'dark' ? 'dark' : 'light'}`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              <span>{theme === 'dark' ? "Dark Mode" : "Light Mode"}</span>
            </button>

            <button 
              className={`popout-item reset overlay-item ${resetConfirm ? 'danger confirmed' : ''}`}
              onClick={handleResetClick}
            >
              <RotateCcw size={14} className={resetConfirm ? "spin-warning" : ""} />
              <span>{resetConfirm ? "Confirm Reset" : "Reset Data"}</span>
            </button>

            <div className="popout-divider" />
            <div className="popout-section-label" style={{ fontSize: 9, fontWeight: 900, color: 'var(--text3)', padding: '12px 16px 4px', letterSpacing: 1 }}>INTELLIGENCE_KEY</div>
            
            <div style={{ padding: '4px 12px 12px' }}>
              <div style={{ position: 'relative', display: 'flex', gap: 6 }}>
                <input 
                  type="password"
                  placeholder="Paste Gemini Key..."
                  value={localKey}
                  onChange={(e) => setLocalKey(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: 11,
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--neon)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <motion.button 
                  onClick={() => updateGeminiKey(localKey)}
                  whileHover={{ scale: 1.05, background: 'var(--neon)', color: '#000', boxShadow: '0 0 12px var(--neon)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'var(--neon)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 16px',
                    color: '#000',
                    fontSize: 10,
                    fontWeight: 950,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  SAVE
                </motion.button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <p style={{ margin: 0, fontSize: 9, color: 'var(--text3)', opacity: 0.6 }}>Keys are stored locally.</p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: 9, 
                    color: 'var(--neon)', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4,
                    fontWeight: 700,
                    opacity: 0.8
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                  onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                >
                  GET KEY <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="popout-divider" />

            <button className="popout-item logout overlay-item" onClick={onSignOut}>
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>

          <button className="super-control-btn">
            <div className={`control-orb ${isEditMode ? 'editing' : ''}`}>
              <Orbit size={18} />
            </div>
            {!isCollapsed && <span className="control-label">Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

const styles = `
  .sidebar-divider-wrapper {
    position: relative;
    height: 1px;
    margin: 4px 0;
  }
  .sidebar-paths-toggle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--bg2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text3);
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
  }
  .sidebar-paths-toggle:hover {
    background: var(--bg3);
    color: var(--neon);
    border-color: var(--neon);
    box-shadow: 0 0 10px var(--neon-dim);
  }
  .sidebar-paths-toggle svg {
    transition: transform 0.3s ease;
  }
  .sidebar-paths-visible .sidebar-paths-toggle svg {
    /* transform: rotate(180deg); */
  }
  .sidebar-group {
    margin-bottom: 12px;
  }
  .group-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 8px 20px;
    opacity: 0.3;
  }
  .edit-pill {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text3);
    font-size: 9px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
  }
  .edit-pill.active {
    background: rgba(245, 158, 11, 0.1);
    border-color: #f59e0b;
    color: #f59e0b;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
  }
  .sidebar-path-dot-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
  }
  .sidebar-path-dot-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 900;
    color: #fff;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }
  .sidebar-path-dot-btn:hover {
    transform: scale(1.1);
  }
  .sidebar-path-dot-btn.active {
    color: #000;
  }
  .sidebar-path-dot-btn[data-label]:hover::after {
    content: attr(data-label);
    position: absolute;
    left: calc(100% + 10px);
    background: var(--bg5);
    border: 1px solid var(--border2);
    color: #fff;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    white-space: nowrap;
    z-index: 1000;
  }
  .spin-warning {
    animation: spin 3s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}