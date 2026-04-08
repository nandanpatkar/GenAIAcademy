import React, { useState, useEffect, Component } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
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
import DSAAnimator from "./components/DSAAnimator";
import BlogPage from "./pages/blog/BlogPage";
import ContentStudio from "./components/ContentStudio";
import AdminManagement from "./components/AdminManagement";
import { PATHS } from "./data/roadmap";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { supabase } from "./config/supabaseClient";
import AuthInterface from "./components/AuthInterface";
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
    // Step 1: Close the topic panel — this triggers its unmount effect which flushes
    // any unsaved local edits into pathsData via onSaveTopic → setPathsData
    setActiveTopic(null);

    // Step 2: Wait for React to process the state updates from the unmount flush
    await new Promise(resolve => setTimeout(resolve, 300));

    // Step 3: Now pathsDataRef has the absolute latest data — save to Supabase
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
    // Reset fetch guard so re-login triggers a fresh fetch
    hasFetched.current = false;
    setIsDataLoaded(false);
    signOut();
  }, [user, signOut]);

  useEffect(() => {
    if (!user) return;
    if (hasFetched.current) return; // Only fetch ONCE per session
    hasFetched.current = true;

    const fetchCurriculum = async () => {
      const { data } = await supabase
        .from('user_curriculum')
        .select('paths_data')
        .eq('id', user.id)
        .single();

      if (data && data.paths_data && Object.keys(data.paths_data).length > 0) {
        const defaultPaths = injectDefaultIcons(PATHS);

        // Deep merge ALL paths: preserve user content while keeping default structure
        const mergedData = {};
        const allKeys = new Set([...Object.keys(defaultPaths), ...Object.keys(data.paths_data)]);

        for (const key of allKeys) {
          const defaultPath = defaultPaths[key];
          const savedPath = data.paths_data[key];

          // If no default exists, use saved as-is (user-created path)
          if (!defaultPath) { mergedData[key] = savedPath; continue; }
          // If no saved exists, use default as-is
          if (!savedPath) { mergedData[key] = defaultPath; continue; }

          // Deep merge nodes: keep default structure, overlay saved user data
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
                    // Merge: default as base, overlay all saved fields (content, code, status, id, etc.)
                    const base = typeof defaultSub === "object" ? defaultSub : { title: defaultSub, status: "pending" };
                    return { ...base, ...savedSub };
                  }),
                };
              }),
            };
          });

          // Also include any saved nodes not in defaults (user-added nodes)
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

  // Sync to Cloud
  useEffect(() => {
    if (!user || !isDataLoaded) return;
    if (Object.keys(pathsData).length === 0) return;

    localStorage.setItem("genai_paths_v3", JSON.stringify(pathsData));

    const timeoutId = setTimeout(async () => {
      const { error } = await supabase
        .from('user_curriculum')
        .upsert({ id: user.id, paths_data: pathsData, updated_at: new Date().toISOString() });
      if (error) console.error("Supabase upsert error!", error);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [pathsData, user, isDataLoaded]);

  // Theme Sync
  useEffect(() => {
    localStorage.setItem("genai_theme", theme);
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  // Edit states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPath, setEditingPath] = useState(false);
  const [editingNode, setEditingNode] = useState(false);
  const [editingModule, setEditingModule] = useState(false);
  const [editData, setEditData] = useState(null);

  // Panel visibility
  const [showCurriculumMap, setShowCurriculumMap] = useState(false);
  const [showIDE, setShowIDE] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [showDSAAnimator, setShowDSAAnimator] = useState(false);  // ← NEW
  const [showBlog, setShowBlog] = useState(false);
  const [showContentStudio, setShowContentStudio] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);

  // Helper to close all panels at once
  const closeAllPanels = () => {
    setShowCurriculumMap(false);
    setShowIDE(false);
    setShowResources(false);
    setShowProgress(false);
    setShowPlayground(false);
    setShowDSAAnimator(false);
    setShowBlog(false);
    setShowContentStudio(false);
    setShowAdminManagement(false);
  };

  const pathData = pathsData[activePath] || Object.values(pathsData)[0];

  const handleNodeClick = (node) => {
    setActiveNode(node);
    setActiveModule(node.modules?.[0] || null);
    setActiveTopic(null); // CRITICAL: close any open topic when switching nodes
  };

  const handleMarkState = (nodeId, state) => {
    setNodeStates((prev) => ({ ...prev, [`${activePath}_${nodeId}`]: state }));
  };

  const getNodeState = (nodeId) =>
    nodeStates[`${activePath}_${nodeId}`] || "default";

  const completedCount = (pathData?.nodes || []).filter(
    (n) => getNodeState(n.id) === "done"
  ).length;

  const handleResetData = () => {
    if (window.confirm("Reset all pathways to original defaults? All custom edits will be lost.")) {
      setPathsData(injectDefaultIcons(PATHS));
      setActiveNode(null);
      setActiveModule(null);
      setEditingNode(false);
      setEditingModule(false);
      setNodeStates({});
    }
  };

  // Path Actions
  const handleSavePath = (newPathData) => {
    let targetKey = newPathData.id || `path-${Date.now()}`;
    const existing = pathsData[targetKey];
    const finalData = { ...existing, ...newPathData, id: targetKey, nodes: existing?.nodes || [] };

    setPathsData(prev => ({ ...prev, [targetKey]: finalData }));
    setActivePath(targetKey);
    setActiveNode(null);
    setActiveModule(null);
    setActiveTopic(null);
    setEditingPath(false);
  };

  const handleDeletePath = (pathId) => {
    if (Object.keys(pathsData).length <= 1) {
      alert("Cannot delete the last remaining path.");
      return;
    }
    if (window.confirm("Delete this entire Learning Path and all its contents? This cannot be undone.")) {
      setPathsData(prev => {
        const copy = { ...prev };
        delete copy[pathId];
        return copy;
      });

      const remainingKeys = Object.keys(pathsData).filter(k => k !== pathId);
      if (remainingKeys.length > 0) setActivePath(remainingKeys[0]);

      setActiveNode(null);
      setActiveModule(null);
      setActiveTopic(null);
      setEditingPath(false);
    }
  };

  // Node Actions
  const handleSaveNode = (newNode) => {
    setPathsData(prev => {
      const parent = prev[activePath];
      const isExisting = parent.nodes.find(n => n.id === newNode.id);
      const updatedNodes = isExisting
        ? parent.nodes.map(n => n.id === newNode.id ? { ...n, ...newNode } : n)
        : [...parent.nodes, newNode];
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    setEditingNode(false);
  };

  const handleSaveTopic = (updatedTopic) => {
    if (!activeNode || !activeModule) return;

    setPathsData(prev => {
      const parent = prev[activePath];
      if (!parent) return prev;

      const updatedNodes = parent.nodes.map(n => {
        if (n.id !== activeNode.id) return n;

        const updatedModules = (n.modules || []).map(m => {
          if (m.id !== activeModule.id) return m;

          let found = false;
          const newSubtopics = (m.subtopics || []).map(s => {
            const sObj = typeof s === "object" ? s : { title: s, status: "pending" };
            
            // Match by ID first, then by title
            const isMatch = (updatedTopic.id && sObj.id && sObj.id === updatedTopic.id) ||
                            (sObj.title === updatedTopic.title);

            if (isMatch) {
              found = true;
              const stableId = sObj.id || updatedTopic.id || `topic-${Date.now()}`;
              return { ...sObj, ...updatedTopic, id: stableId };
            }
            return sObj.id ? sObj : { ...sObj, id: `topic-${sObj.title.replace(/\s+/g, '-').toLowerCase()}` };
          });

          if (!found) {
            const newId = updatedTopic.id || `topic-${Date.now()}`;
            newSubtopics.push({ ...updatedTopic, id: newId });
          }

          return { ...m, subtopics: newSubtopics };
        });

        return { ...n, modules: updatedModules };
      });

      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    // NOTE: Do NOT call setActiveTopic/setActiveNode/setActiveModule here.
    // pathsData is the source of truth. freshActiveNode/freshActiveModule derive from it.
    // TopicContentPanel owns its local edits and only reads from activeTopic on identity change.
  };

  const handleDeleteNode = (nodeId) => {
    if (window.confirm("Delete this node and all its modules?")) {
      setPathsData(prev => {
        const parent = prev[activePath];
        const newNodes = parent.nodes.filter(n => n.id !== nodeId);
        return { ...prev, [activePath]: { ...parent, nodes: newNodes } };
      });
      if (activeNode?.id === nodeId) {
        setActiveNode(null);
        setActiveModule(null);
      }
      setEditingNode(false);
    }
  };

  // Module Actions
  const handleSaveModule = (newModule) => {
    if (!activeNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === activeNode.id) {
          const isExisting = n.modules?.find(m => m.id === newModule.id);
          const updatedModules = isExisting
            ? n.modules.map(m => m.id === newModule.id ? { ...m, ...newModule } : m)
            : [...(n.modules || []), newModule];
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });

    if (!activeModule) {
      setActiveModule(newModule);
    } else if (activeModule.id === newModule.id) {
      setActiveModule(newModule);
    }

    setEditingModule(false);
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Delete this module?")) {
      setPathsData(prev => {
        const parent = prev[activePath];
        const updatedNodes = parent.nodes.map(n => {
          if (n.id === activeNode.id) {
            return { ...n, modules: n.modules?.filter(m => m.id !== moduleId) || [] };
          }
          return n;
        });
        return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
      });
      if (activeModule?.id === moduleId) setActiveModule(null);
      setEditingModule(false);
    }
  };

  const freshActiveNode = activeNode ? pathData?.nodes?.find(n => n.id === activeNode.id) : null;
  const freshActiveModule = activeModule && freshActiveNode
    ? freshActiveNode.modules?.find(m => m.id === activeModule.id)
    : null;

  const handleMarkModuleStatus = (moduleId, newStatus) => {
    if (!freshActiveNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === freshActiveNode.id) {
          const updatedModules = (n.modules || []).map(m =>
            m.id === moduleId ? { ...m, status: newStatus, completionDate: newStatus === 'complete' ? new Date().toISOString() : m.completionDate } : m
          );
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });

    if (newStatus === "in_progress" && getNodeState(freshActiveNode.id) === "default") {
      handleMarkState(freshActiveNode.id, "progress");
    }
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
                const isObj = typeof s === "object";
                const stitle = isObj ? s.title : s;
                
                if (stitle === subtopicTitle) {
                  const currentStatus = isObj ? s.status : "pending";
                  const newStatus = currentStatus === "complete" ? "pending" : "complete";
                  const baseObj = isObj ? s : { title: s, id: `topic-${Math.random().toString(36).substr(2, 9)}` };
                  
                  return { 
                    ...baseObj, 
                    status: newStatus,
                    completionDate: newStatus === "complete" ? new Date().toISOString() : null 
                  };
                }
                return isObj ? s : { title: s, status: "pending", id: `topic-${Math.random().toString(36).substr(2, 9)}` };
              });
              
              // Auto-module completion logic
              const allComplete = newSubtopics.every(s => typeof s === "object" && s.status === "complete");
              const currentStatus = allComplete ? "complete" : (m.status === "complete" ? "in_progress" : m.status);
              
              return { ...m, subtopics: newSubtopics, status: currentStatus };
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


  if (!user) {
    return <AuthInterface />;
  }

  if (isLocked) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', gap: 24, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <Lock size={40} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>Access Restricted</h1>
        <p style={{ maxWidth: 500, fontSize: '1.1rem', color: 'var(--text2)', lineHeight: 1.6 }}>
          Your account has been locked by a system administrator. If you believe this is an error, please contact support.
        </p>
        <button className="rg-btn" onClick={() => signOut()} style={{ padding: '12px 32px', background: 'var(--bg2)', border: '1px solid var(--border)' }}>
           Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        activePath={activePath}
        setActivePath={(p) => {
          setActivePath(p);
          closeAllPanels();
        }}
        paths={pathsData}
        onReset={handleResetData}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onAddPath={() => { setEditData(null); setEditingPath(true); }}
        onEditPath={(p) => {
          setEditData({ ...p, id: activePath });
          setEditingPath(true);
        }}
        showCurriculumMap={showCurriculumMap}
        setShowCurriculumMap={setShowCurriculumMap}
        showIDE={showIDE}
        setShowIDE={setShowIDE}
        showResources={showResources}
        setShowResources={setShowResources}
        showProgress={showProgress}
        setShowProgress={setShowProgress}
        showPlayground={showPlayground}
        setShowPlayground={setShowPlayground}
        showDSAAnimator={showDSAAnimator}
        setShowDSAAnimator={setShowDSAAnimator}
        showBlog={showBlog}
        setShowBlog={setShowBlog}
        showContentStudio={showContentStudio}
        setShowContentStudio={setShowContentStudio}
        showAdminManagement={showAdminManagement}
        setShowAdminManagement={setShowAdminManagement}
        activeNode={activeNode}
        setActiveNode={setActiveNode}
        setActiveModule={setActiveModule}
        setActiveTopic={setActiveTopic}
        theme={theme}
        toggleTheme={toggleTheme}
        onSignOut={handleSignOut}
      />

      {/* ── View Switcher ── */}
      {showAdminManagement && isAdmin ? (
        <AdminManagement onClose={() => setShowAdminManagement(false)} />
      ) : showContentStudio && isAdmin ? (
        <ContentStudio pathsData={pathsData} setPathsData={setPathsData} onClose={() => setShowContentStudio(false)} theme={theme} />
      ) : showBlog ? (
        <BlogPage theme={theme} isEditMode={isEditMode} onClose={() => setShowBlog(false)} />
      ) : showDSAAnimator ? (
        <DSAAnimator onClose={() => setShowDSAAnimator(false)} />
      ) : showPlayground ? (
        <SystemDesignPlayground theme={theme} onClose={() => setShowPlayground(false)} />
      ) : showProgress ? (
        <ProgressTracker
          pathsData={pathsData}
          onClose={() => setShowProgress(false)}
        />
      ) : showIDE ? (
        <PythonIDE onClose={() => setShowIDE(false)} />
      ) : showResources ? (
        <ErrorBoundary>
          <ResourceManager
            pathsData={pathsData}
            setPathsData={setPathsData}
            onClose={() => setShowResources(false)}
            isEditMode={isEditMode}
          />
        </ErrorBoundary>
      ) : showCurriculumMap ? (
        <CurriculumTreePanel
          pathData={pathData}
          activeNode={activeNode}
          setActiveNode={setActiveNode}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          onClose={() => setShowCurriculumMap(false)}
        />
      ) : (
        <>
          {!freshActiveNode && (
            <RoadmapGraph
              path={pathData}
              activePath={activePath}
              setActivePath={setActivePath}
              pathsData={pathsData}
              activeNode={freshActiveNode}
              onNodeClick={handleNodeClick}
              getNodeState={getNodeState}
              completedCount={completedCount}
              onMarkState={handleMarkState}
              onAddNode={() => { setEditData(null); setEditingNode(true); }}
              onEditNode={(n) => { setEditData(n); setEditingNode(true); }}
              isEditMode={isEditMode}
            />
          )}
          {freshActiveNode && !activeTopic && (
            <ModulePanel
              node={freshActiveNode}
              activeModule={freshActiveModule}
              setActiveModule={setActiveModule}
              pathColor={pathData.color}
              onClose={() => { setActiveNode(null); setActiveModule(null); setActiveTopic(null); }}
              onBack={() => { setActiveNode(null); setActiveModule(null); setActiveTopic(null); }}
              onAddModule={() => { setEditData(null); setEditingModule(true); }}
              onEditModule={(m) => { setEditData(m); setEditingModule(true); }}
              isEditMode={isEditMode}
              activePath={activePath}
            />
          )}
          {freshActiveModule && !activeTopic && (
            <ResourcePanel
              module={freshActiveModule}
              pathColor={pathData.color}
              onClose={() => setActiveModule(null)}
              onEditModule={handleSaveModule}
              isEditMode={isEditMode}
            />
          )}
          {freshActiveModule && freshActiveNode && !activeTopic && (
            <DetailPanel
              node={freshActiveNode}
              module={freshActiveModule}
              pathColor={pathData.color}
              onMarkDone={() => handleMarkState(freshActiveNode.id, "done")}
              onMarkProgress={() => handleMarkState(freshActiveNode.id, "progress")}
              onMarkModuleStatus={(status) => handleMarkModuleStatus(freshActiveModule.id, status)}
              onToggleSubtopicStatus={(title) => handleToggleSubtopicStatus(freshActiveModule.id, title)}
              nodeState={getNodeState(freshActiveNode.id)}
              onModuleSelect={setActiveModule}
              onTopicSelect={setActiveTopic}
              isEditMode={isEditMode}
            />

          )}
          {activeTopic && (
            <TopicContentPanel
              topic={activeTopic}
              module={freshActiveModule}
              pathColor={pathData.color}
              activePath={activePath}
              onClose={() => setActiveTopic(null)}
              isEditMode={isEditMode}
              onSaveTopic={handleSaveTopic}
            />
          )}
        </>
      )}


      {/* ── Modals ── */}
      {editingPath && (
        <EditorModal
          type="path"
          data={editData}
          pathColor={editData?.color || "#3b82f6"}
          onClose={() => setEditingPath(false)}
          onSave={handleSavePath}
          onDelete={handleDeletePath}
        />
      )}
      {editingNode && (
        <EditorModal
          type="node"
          data={editData}
          pathColor={pathData.color}
          onClose={() => setEditingNode(false)}
          onSave={handleSaveNode}
          onDelete={handleDeleteNode}
        />
      )}
      {editingModule && (
        <EditorModal
          type="module"
          data={editData}
          pathColor={pathData.color}
          onClose={() => setEditingModule(false)}
          onSave={handleSaveModule}
          onDelete={handleDeleteModule}
        />
      )}
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