import React, { useState, useEffect, Component } from "react";
import Sidebar from "./components/Sidebar";
import RoadmapGraph from "./components/RoadmapGraph";
import ModulePanel from "./components/ModulePanel";
import ResourcePanel from "./components/ResourcePanel";
import DetailPanel from "./components/DetailPanel";
import TopicContentPanel from "./components/TopicContentPanel";
import EditorModal from "./components/EditorModal";
import CurriculumTreePanel from "./components/CurriculumTreePanel";
import PythonIDE from "./components/PythonIDE";
import ResourceManager from "./components/ResourceManager";
import ProgressTracker from "./components/ProgressTracker";
import SystemDesignPlayground from "./pages/playground/SystemDesignPlayground";
import SystemDesignSimulator from "./pages/simulator/SystemDesignSimulator";
import DSAAnimator from "./components/DSAAnimator";
import BlogPage from "./pages/blog/BlogPage";
import AdminManagement from "./components/AdminManagement";
import { 
  Box, BookOpen, Brain, Loader2, ChevronDown, ChevronUp, 
  ExternalLink, X, CheckSquare, Library, Network, AlignLeft,
  Sparkles, Bookmark, Video, FileText, Link2, CheckCircle2,
  Menu, Map, Layout, User, Settings, PieChart, FlaskConical, PenTool, Lock, Orbit
} from "lucide-react";
import { PATHS } from "./data/roadmap";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { supabase } from "./config/supabaseClient";
import AuthInterface from "./components/AuthInterface";
import KnowledgeGalaxy from "./components/KnowledgeGalaxy";
import "./styles/global.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 50, color: 'maroon', background: '#ffebee', flex: 1, zIndex: 9999 }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>ResourceManager Render Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }}>{this.state.error?.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 11, opacity: 0.7, marginTop: 12 }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const PATH_ICONS = {
  ds: ["🐍", "📊", "🔬", "🗄️", "🤖", "🧠", "💬", "🚀"],
  genai: ["🏗️", "✨", "⛓️", "🗃️", "🔍", "🎯", "📡", "☁️"],
  agentic: ["🤖", "🕸️", "👥", "🛠️", "🧠", "☁️", "⚡"],
  aicxm_aws: ["📱", "🐍", "🏗️", "☁️", "🗣️", "🤖", "✨", "🔍", "🕸️", "🔗", "⚡", "📊"],
  aicxm_azure: ["📱", "🐍", "🏗️", "☁️", "🗣️", "🤖", "✨", "🔍", "🕸️", "🚀", "🧩", "📊"],
  aicxm_databricks: ["📱", "🐍", "🏗️", "☁️", "🗣️", "🤖", "✨", "🔍", "🕸️", "🧱", "📊"],
};

const injectDefaultIcons = (paths) => {
  const updated = JSON.parse(JSON.stringify(paths));
  Object.keys(updated).forEach(k => {
    updated[k].nodes = updated[k].nodes.map((n, i) => ({
      ...n, icon: n.icon || PATH_ICONS[k]?.[i] || "◈"
    }));
  });
  return updated;
};

function MainApp() {
  const { user, isAdmin, isLocked, signOut } = useAuth();

  const [theme, setTheme] = useState(() => localStorage.getItem("genai_theme") || "dark");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pathsData, setPathsData] = useState({});
  const [activePath, setActivePath] = useState("ds");
  const [activeNode, setActiveNode] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [nodeStates, setNodeStates] = useState({});

  // Keep a ref to latest pathsData so the flush function always has current data
  const pathsDataRef = React.useRef(pathsData);
  React.useEffect(() => { pathsDataRef.current = pathsData; }, [pathsData]);

  const hasFetched = React.useRef(false);

  // Flush save to Supabase immediately, then sign out
  const handleSignOut = React.useCallback(async () => {
    setActiveTopic(null);
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentData = pathsDataRef.current;
    if (user && Object.keys(currentData).length > 0) {
      try {
        localStorage.setItem("genai_paths_v3", JSON.stringify(currentData));
        await supabase
          .from('user_curriculum')
          .upsert({ id: user.id, paths_data: currentData, updated_at: new Date().toISOString() });
      } catch (e) {
        console.error("Flush save before sign-out failed:", e);
      }
    }
    hasFetched.current = false;
    setIsDataLoaded(false);
    signOut();
  }, [user, signOut]);

  useEffect(() => {
    if (!user) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCurriculum = async () => {
      const { data } = await supabase
        .from('user_curriculum')
        .select('paths_data')
        .eq('id', user.id)
        .single();

      if (data && data.paths_data && Object.keys(data.paths_data).length > 0) {
        const defaultPaths = injectDefaultIcons(PATHS);
        const mergedData = {};
        const allKeys = new Set([...Object.keys(defaultPaths), ...Object.keys(data.paths_data)]);

        for (const key of allKeys) {
          const defaultPath = defaultPaths[key];
          const savedPath = data.paths_data[key];
          if (!defaultPath) { mergedData[key] = savedPath; continue; }
          if (!savedPath) { mergedData[key] = defaultPath; continue; }

          const savedNodes = savedPath.nodes || [];
          const mergedNodes = (defaultPath.nodes || []).map(defaultNode => {
            const savedNode = savedNodes.find(n => n.id === defaultNode.id);
            if (!savedNode) return defaultNode;
            return {
              ...defaultNode,
              modules: (defaultNode.modules || []).map(defaultModule => {
                const savedModule = (savedNode.modules || []).find(m => m.id === defaultModule.id);
                if (!savedModule) return defaultModule;
                return {
                  ...defaultModule,
                  status: savedModule.status ?? defaultModule.status,
                  completionDate: savedModule.completionDate ?? null,
                  subtopics: (defaultModule.subtopics || []).map(defaultSub => {
                    const defaultTitle = typeof defaultSub === "object" ? defaultSub.title : defaultSub;
                    const savedSub = (savedModule.subtopics || []).find(s =>
                      (typeof s === "object" ? s.title : s) === defaultTitle
                    );
                    if (!savedSub || typeof savedSub !== "object") return defaultSub;
                    const base = typeof defaultSub === "object" ? defaultSub : { title: defaultSub, status: "pending" };
                    return { ...base, ...savedSub };
                  }),
                };
              }),
            };
          });
          const extraNodes = savedNodes.filter(sn => !(defaultPath.nodes || []).some(dn => dn.id === sn.id));
          mergedData[key] = { ...defaultPath, ...savedPath, nodes: [...mergedNodes, ...extraNodes] };
        }

        setPathsData(mergedData);
        const keys = Object.keys(mergedData);
        if (keys.length > 0) setActivePath(keys[0]);
      } else {
        let initialData = null;
        try {
          const saved = localStorage.getItem("genai_paths_v3");
          if (saved) initialData = JSON.parse(saved);
        } catch(e) {}

        if (!initialData || Object.keys(initialData).length === 0) {
          initialData = injectDefaultIcons(PATHS);
        } else {
          const defaultPaths = injectDefaultIcons(PATHS);
          initialData = { ...defaultPaths, ...injectDefaultIcons(initialData) };
        }

        setPathsData(initialData);
        const keys = Object.keys(initialData);
        if (keys.length > 0) setActivePath(keys[0]);
        await supabase.from('user_curriculum').insert({ id: user.id, paths_data: initialData });
      }
      setIsDataLoaded(true);
    };
    fetchCurriculum();
  }, [user]);

  useEffect(() => {
    if (!user || !isDataLoaded) return;
    if (Object.keys(pathsData).length === 0) return;
    localStorage.setItem("genai_paths_v3", JSON.stringify(pathsData));
    const timeoutId = setTimeout(async () => {
      await supabase
        .from('user_curriculum')
        .upsert({ id: user.id, paths_data: pathsData, updated_at: new Date().toISOString() });
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [pathsData, user, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem("genai_theme", theme);
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPath, setEditingPath] = useState(false);
  const [editingNode, setEditingNode] = useState(false);
  const [editingModule, setEditingModule] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showCurriculumMap, setShowCurriculumMap] = useState(false);
  const [showIDE, setShowIDE] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [showDSAAnimator, setShowDSAAnimator] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showGalaxy, setShowGalaxy] = useState(false);

  const closeAllPanels = () => {
    setShowCurriculumMap(false);
    setShowIDE(false);
    setShowResources(false);
    setShowProgress(false);
    setShowPlayground(false);
    setShowDSAAnimator(false);
    setShowBlog(false);
    setShowAdminManagement(false);
    setShowSimulator(false);
    setShowGalaxy(false);
  };

  const pathData = pathsData[activePath] || Object.values(pathsData)[0];

  const handleNodeClick = (node, pathId) => {
    if (pathId) setActivePath(pathId);
    setActiveNode(node);
    setActiveModule(node.modules?.[0] || null);
    setActiveTopic(null);
  };

  const handleMarkState = (nodeId, state) => {
    setNodeStates((prev) => ({ ...prev, [`${activePath}_${nodeId}`]: state }));
  };

  const getNodeState = (nodeId) => nodeStates[`${activePath}_${nodeId}`] || "default";

  const completedCount = (pathData?.nodes || []).filter(n => getNodeState(n.id) === "done").length;

  const handleResetData = () => {
    if (window.confirm("Reset all pathways to original defaults?")) {
      setPathsData(injectDefaultIcons(PATHS));
      setActiveNode(null); setActiveModule(null); setEditingNode(false); setEditingModule(false); setNodeStates({});
    }
  };

  const handleSavePath = (newPathData) => {
    let targetKey = newPathData.id || `path-${Date.now()}`;
    const existing = pathsData[targetKey];
    const finalData = { ...existing, ...newPathData, id: targetKey, nodes: existing?.nodes || [] };
    setPathsData(prev => ({ ...prev, [targetKey]: finalData }));
    setActivePath(targetKey); setActiveNode(null); setActiveModule(null); setActiveTopic(null); setEditingPath(false);
  };

  const handleDeletePath = (pathId) => {
    if (Object.keys(pathsData).length <= 1) return alert("Cannot delete the last path.");
    if (window.confirm("Delete this Learning Path?")) {
      setPathsData(prev => { const copy = { ...prev }; delete copy[pathId]; return copy; });
      const remainingKeys = Object.keys(pathsData).filter(k => k !== pathId);
      if (remainingKeys.length > 0) setActivePath(remainingKeys[0]);
      setActiveNode(null); setActiveModule(null); setActiveTopic(null); setEditingPath(false);
    }
  };

  const handleSaveNode = (newNode) => {
    setPathsData(prev => {
      const parent = prev[activePath];
      const isExisting = parent.nodes.find(n => n.id === newNode.id);
      const updatedNodes = isExisting ? parent.nodes.map(n => n.id === newNode.id ? { ...n, ...newNode } : n) : [...parent.nodes, newNode];
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    setEditingNode(false);
  };

  const handleSaveTopic = (updatedTopic) => {
    if (!activeNode || !activeModule) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id !== activeNode.id) return n;
        const updatedModules = (n.modules || []).map(m => {
          if (m.id !== activeModule.id) return m;
          let found = false;
          const newSubtopics = (m.subtopics || []).map(s => {
            const sObj = typeof s === "object" ? s : { title: s, status: "pending" };
            const isMatch = (updatedTopic.id && sObj.id && sObj.id === updatedTopic.id) || (sObj.title === updatedTopic.title);
            if (isMatch) { found = true; return { ...sObj, ...updatedTopic, id: sObj.id || updatedTopic.id || `topic-${Date.now()}` }; }
            return sObj.id ? sObj : { ...sObj, id: `topic-${sObj.title.replace(/\s+/g, '-').toLowerCase()}` };
          });
          if (!found) newSubtopics.push({ ...updatedTopic, id: updatedTopic.id || `topic-${Date.now()}` });
          return { ...m, subtopics: newSubtopics };
        });
        return { ...n, modules: updatedModules };
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
  };

  const handleDeleteNode = (nodeId) => {
    if (window.confirm("Delete this node?")) {
      setPathsData(prev => {
        const parent = prev[activePath];
        const newNodes = parent.nodes.filter(n => n.id !== nodeId);
        return { ...prev, [activePath]: { ...parent, nodes: newNodes } };
      });
      if (activeNode?.id === nodeId) { setActiveNode(null); setActiveModule(null); }
      setEditingNode(false);
    }
  };

  const handleSaveModule = (newModule) => {
    if (!activeNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === activeNode.id) {
          const isExisting = n.modules?.find(m => m.id === newModule.id);
          const updatedModules = isExisting ? n.modules.map(m => m.id === newModule.id ? { ...m, ...newModule } : m) : [...(n.modules || []), newModule];
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    if (!activeModule || activeModule.id === newModule.id) setActiveModule(newModule);
    setEditingModule(false);
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Delete this module?")) {
      setPathsData(prev => {
        const parent = prev[activePath];
        const updatedNodes = parent.nodes.map(n => {
          if (n.id === activeNode.id) return { ...n, modules: n.modules?.filter(m => m.id !== moduleId) || [] };
          return n;
        });
        return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
      });
      if (activeModule?.id === moduleId) setActiveModule(null);
      setEditingModule(false);
    }
  };

  const freshActiveNode = activeNode ? pathData?.nodes?.find(n => n.id === activeNode.id) : null;
  const freshActiveModule = activeModule && freshActiveNode ? freshActiveNode.modules?.find(m => m.id === activeModule.id) : null;

  const handleMarkModuleStatus = (moduleId, newStatus) => {
    if (!freshActiveNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === freshActiveNode.id) {
          const updatedModules = (n.modules || []).map(m => m.id === moduleId ? { ...m, status: newStatus, completionDate: newStatus === 'complete' ? new Date().toISOString() : m.completionDate } : m);
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    if (newStatus === "in_progress" && getNodeState(freshActiveNode.id) === "default") handleMarkState(freshActiveNode.id, "progress");
  };

  const handleToggleSubtopicStatus = (moduleId, subtopicTitle) => {
    if (!freshActiveNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === freshActiveNode.id) {
          const updatedModules = (n.modules || []).map(m => {
            if (m.id === moduleId) {
              const newSubtopics = (m.subtopics || []).map(s => {
                const stitle = typeof s === "object" ? s.title : s;
                if (stitle === subtopicTitle) {
                  const newStatus = (typeof s === "object" && s.status === "complete") ? "pending" : "complete";
                  const baseObj = typeof s === "object" ? s : { title: s, id: `topic-${Math.random().toString(36).substr(2, 9)}` };
                  return { ...baseObj, status: newStatus, completionDate: newStatus === "complete" ? new Date().toISOString() : null };
                }
                return typeof s === "object" ? s : { title: s, status: "pending", id: `topic-${Math.random().toString(36).substr(2, 9)}` };
              });
              const allComplete = newSubtopics.every(s => s.status === "complete");
              return { ...m, subtopics: newSubtopics, status: allComplete ? "complete" : (m.status === "complete" ? "in_progress" : m.status) };
            }
            return m;
          });
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
  };

  if (!user) return <AuthInterface />;
  if (isLocked) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', gap: 24, padding: 40, textAlign: 'center' }}>
      <Lock size={40} color="#ef4444" />
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Access Restricted</h1>
      <button className="rg-btn" onClick={() => signOut()}>Sign Out</button>
    </div>
  );

  return (
    <div className="app">
      <MobileHeader theme={theme} toggleTheme={toggleTheme} user={user} onSignOut={handleSignOut} />
      <Sidebar
        activePath={activePath} setActivePath={p => { setActivePath(p); closeAllPanels(); }}
        paths={pathsData} onReset={handleResetData} isEditMode={isEditMode} setIsEditMode={setIsEditMode}
        onAddPath={() => { setEditData(null); setEditingPath(true); }}
        onEditPath={p => { setEditData({ ...p, id: activePath }); setEditingPath(true); }}
        showCurriculumMap={showCurriculumMap} setShowCurriculumMap={setShowCurriculumMap}
        showIDE={showIDE} setShowIDE={setShowIDE}
        showResources={showResources} setShowResources={setShowResources}
        showProgress={showProgress} setShowProgress={setShowProgress}
        showPlayground={showPlayground} setShowPlayground={setShowPlayground}
        showDSAAnimator={showDSAAnimator} setShowDSAAnimator={setShowDSAAnimator}
        showBlog={showBlog} setShowBlog={setShowBlog}
        showAdminManagement={showAdminManagement} setShowAdminManagement={setShowAdminManagement}
        showSimulator={showSimulator} setShowSimulator={setShowSimulator}
        showGalaxy={showGalaxy} setShowGalaxy={setShowGalaxy}
        activeNode={activeNode} setActiveNode={setActiveNode} setActiveModule={setActiveModule} setActiveTopic={setActiveTopic}
        theme={theme} toggleTheme={toggleTheme} onSignOut={handleSignOut}
      />

      <MobileBottomNav 
        activeView={showAdminManagement ? "admin" : showBlog ? "blog" : showPlayground ? "playground" : showProgress ? "progress" : "roadmap"}
        setView={v => {
          closeAllPanels();
          if (v === "admin") setShowAdminManagement(true);
          else if (v === "blog") setShowBlog(true);
          else if (v === "playground") setShowPlayground(true);
          else if (v === "progress") setShowProgress(true);
        }}
      />

      {showAdminManagement && isAdmin ? (
        <AdminManagement 
          onClose={() => setShowAdminManagement(false)} 
          pathsData={pathsData}
          setPathsData={setPathsData}
        />
      ) :
       showBlog ? <BlogPage theme={theme} isEditMode={isEditMode} onClose={() => setShowBlog(false)} /> :
       showGalaxy ? (
         <KnowledgeGalaxy 
           nodes={pathsData} 
           activePath={activePath} 
           onNodeClick={handleNodeClick} 
           onModuleClick={(node, mod, pathId) => { 
             if (pathId) setActivePath(pathId); 
             setActiveNode(node); 
             setActiveModule(mod); 
             setActiveTopic(null); 
           }} 
           onSubtopicClick={(node, mod, topic, pathId) => {
             if (pathId) setActivePath(pathId);
             setActiveNode(node);
             setActiveModule(mod);
             setActiveTopic(topic);
           }}
           onClose={() => setShowGalaxy(false)} 
         />
       ) :
       showSimulator ? <SystemDesignSimulator onClose={() => setShowSimulator(false)} /> :
       showDSAAnimator ? <DSAAnimator onClose={() => setShowDSAAnimator(false)} /> :
       showPlayground ? <SystemDesignPlayground theme={theme} onClose={() => setShowPlayground(false)} /> :
       showProgress ? <ProgressTracker pathsData={pathsData} onClose={() => setShowProgress(false)} /> :
       showIDE ? <PythonIDE onClose={() => setShowIDE(false)} /> :
       showResources ? <ErrorBoundary><ResourceManager pathsData={pathsData} setPathsData={setPathsData} onClose={() => setShowResources(false)} isEditMode={isEditMode} /></ErrorBoundary> :
       showCurriculumMap ? <CurriculumTreePanel paths={pathsData} activePath={activePath} setActivePath={setActivePath} pathData={pathData} activeNode={activeNode} setActiveNode={setActiveNode} activeModule={activeModule} setActiveModule={setActiveModule} activeTopic={activeTopic} setActiveTopic={setActiveTopic} onClose={() => setShowCurriculumMap(false)} /> :
       <>
         {!freshActiveNode && (
           <RoadmapGraph
             path={pathData} activePath={activePath} setActivePath={setActivePath} pathsData={pathsData}
             activeNode={freshActiveNode} onNodeClick={handleNodeClick} getNodeState={getNodeState}
             completedCount={completedCount} onMarkState={handleMarkState}
             onAddNode={() => { setEditData(null); setEditingNode(true); }}
             onEditNode={n => { setEditData(n); setEditingNode(true); }}
             isEditMode={isEditMode}
           />
         )}
         {freshActiveNode && !activeTopic && (
           <ModulePanel
             node={freshActiveNode} activeModule={freshActiveModule} setActiveModule={setActiveModule}
             pathColor={pathData.color} onClose={() => { setActiveNode(null); setActiveModule(null); setActiveTopic(null); }}
             onBack={() => { setActiveNode(null); setActiveModule(null); setActiveTopic(null); }}
             onAddModule={() => { setEditData(null); setEditingModule(true); }}
             onEditModule={m => { setEditData(m); setEditingModule(true); }}
             isEditMode={isEditMode} activePath={activePath}
           />
         )}
         {freshActiveModule && freshActiveNode && !activeTopic && (
            <DetailPanel
              node={freshActiveNode} module={freshActiveModule} pathColor={pathData.color}
              onMarkDone={() => handleMarkState(freshActiveNode.id, "done")}
              onMarkProgress={() => handleMarkState(freshActiveNode.id, "progress")}
              onMarkModuleStatus={status => handleMarkModuleStatus(freshActiveModule.id, status)}
              onToggleSubtopicStatus={title => handleToggleSubtopicStatus(freshActiveModule.id, title)}
              nodeState={getNodeState(freshActiveNode.id)} onModuleSelect={setActiveModule} onTopicSelect={setActiveTopic} isEditMode={isEditMode}
              onBackToGalaxy={() => setShowGalaxy(true)}
            />
         )}
         {freshActiveModule && freshActiveNode && !activeTopic && (
           <ResourcePanel
             module={freshActiveModule}
             pathColor={pathData.color}
             onClose={() => setActiveModule(null)}
             onEditModule={handleSaveModule}
             isEditMode={isEditMode}
           />
         )}
         {activeTopic && (
           <TopicContentPanel
             topic={activeTopic} module={freshActiveModule} pathColor={pathData.color}
             activePath={activePath} onClose={() => setActiveTopic(null)} isEditMode={isEditMode} onSaveTopic={handleSaveTopic}
           />
         )}
       </>
      }

      {editingPath && <EditorModal type="path" data={editData} pathColor={editData?.color || "#3b82f6"} onClose={() => setEditingPath(false)} onSave={handleSavePath} onDelete={handleDeletePath} />}
      {editingNode && <EditorModal type="node" data={editData} pathColor={pathData.color} onClose={() => setEditingNode(false)} onSave={handleSaveNode} onDelete={handleDeleteNode} />}
      {editingModule && <EditorModal type="module" data={editData} pathColor={pathData.color} onClose={() => setEditingModule(false)} onSave={handleSaveModule} onDelete={handleDeleteModule} />}
    </div>
  );
}

function MobileHeader({ theme, toggleTheme, user, onSignOut }) {
  return (
    <div className="mobile-header mobile-only">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00ff88, #0088ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(0,255,136,0.3)" }}>
          <Sparkles size={18} color="black" />
        </div>
        <div style={{ fontSize: 13, fontWeight: 900 }}>GEN<span>AI</span> ACADEMY</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={toggleTheme} style={{ background: "none", border: "none", color: "var(--text2)" }}>
          {theme === "dark" ? <Sparkles size={18} /> : <Brain size={18} />}
        </button>
        <div onClick={onSignOut} style={{ cursor: "pointer", opacity: 0.6 }}><User size={18} /></div>
      </div>
    </div>
  );
}

function MobileBottomNav({ activeView, setView }) {
  const items = [
    { id: "roadmap", icon: Map, label: "Roadmap" },
    { id: "progress", icon: PieChart, label: "Progress" },
    { id: "playground", icon: FlaskConical, label: "Lab" },
    { id: "blog", icon: PenTool, label: "Blog" },
    { id: "admin", icon: Settings, label: "Admin" },
  ];
  return (
    <div className="mobile-nav mobile-only">
      {items.map(item => (
        <div key={item.id} className={`mobile-nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => setView(item.id)}>
          <div className="mobile-nav-icon"><item.icon size={20} /></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}