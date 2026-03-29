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

// Extracted internal App logic to consume useAuth context
function MainApp() {
  const { user, signOut } = useAuth();

  const [theme, setTheme] = useState(() => localStorage.getItem("genai_theme") || "dark");

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pathsData, setPathsData] = useState({});
  const [activePath, setActivePath] = useState("ds");
  const [activeNode, setActiveNode] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [nodeStates, setNodeStates] = useState({});

  useEffect(() => {
    if (!user) return;
    const fetchCurriculum = async () => {
      const { data } = await supabase
        .from('user_curriculum')
        .select('paths_data')
        .eq('id', user.id)
        .single();
        
      if (data && data.paths_data && Object.keys(data.paths_data).length > 0) {
        // Merge fetched data with the current PATHS configuration to ensure newly added paths (like dsa) show up
        const defaultPaths = injectDefaultIcons(PATHS);
        const mergedData = { ...defaultPaths, ...data.paths_data };
        
        // Smart Merge Override: The `pattern-wise-dsa` AST was massively updated securely natively dynamically
        if (defaultPaths["dsa"] && mergedData["dsa"]) {
          mergedData["dsa"].nodes = defaultPaths["dsa"].nodes;
        }
        
        setPathsData(mergedData);
        const keys = Object.keys(mergedData);
        if (keys.length > 0) setActivePath(keys[0]);
      } else {
        // Fallback local storage or defaults
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
          
          if (defaultPaths["dsa"] && initialData["dsa"]) {
            initialData["dsa"].nodes = defaultPaths["dsa"].nodes;
          }
        }
        
        setPathsData(initialData);
        const keys = Object.keys(initialData);
        if (keys.length > 0) setActivePath(keys[0]);
        
        // Insert first record
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
    
    // Local Backup
    localStorage.setItem("genai_paths_v3", JSON.stringify(pathsData));
    
    // Cloud Sync Debounced (Upsert)
    const timeoutId = setTimeout(async () => {
      await supabase
        .from('user_curriculum')
        .upsert({ id: user.id, paths_data: pathsData, updated_at: new Date().toISOString() });
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [pathsData, user, isDataLoaded]);

  // Theme Sync
  useEffect(() => {
    localStorage.setItem("genai_theme", theme);
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  // Edits
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPath, setEditingPath] = useState(false);
  const [editingNode, setEditingNode] = useState(false);
  const [editingModule, setEditingModule] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showCurriculumMap, setShowCurriculumMap] = useState(false);
  const [showIDE, setShowIDE] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const pathData = pathsData[activePath] || Object.values(pathsData)[0];

  const handleNodeClick = (node) => {
    setActiveNode(node);
    setActiveModule(node.modules?.[0] || null);
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
      setNodeStates({}); // Also reset progress
    }
  };

  // Path Actions
  const handleSavePath = (newPathData) => {
    let targetKey = newPathData.id || `path-${Date.now()}`;
    const existing = pathsData[targetKey];
    const finalData = { ...existing, ...newPathData, id: targetKey, nodes: existing?.nodes || [] };

    setPathsData(prev => ({
      ...prev,
      [targetKey]: finalData
    }));

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
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === activeNode.id) {
          const updatedModules = n.modules?.map(m => {
            if (m.id === activeModule.id) {
              let found = false;
              const newSubtopics = (m.subtopics || []).map(s => {
                const isObj = typeof s === "object";
                const sid = isObj ? s.id : s;
                if (sid === updatedTopic.id) {
                  found = true;
                  return updatedTopic;
                }
                return s;
              });

              if (!found) {
                newSubtopics.push(updatedTopic);
              }

              return { ...m, subtopics: newSubtopics };
            }
            return m;
          });
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    setActiveTopic(updatedTopic);
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

    // Auto-select the newly added module if there wasn't one active
    if (!activeModule) {
      setActiveModule(newModule);
    } else if (activeModule.id === newModule.id) {
      setActiveModule(newModule); // Update active reference
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
      if (activeModule?.id === moduleId) {
        setActiveModule(null);
      }
      setEditingModule(false);
    }
  };

  // To refresh activeNode after module updates, we can find it in pathsData
  const freshActiveNode = activeNode ? pathData.nodes.find(n => n.id === activeNode.id) : null;
  const freshActiveModule = activeModule && freshActiveNode ? freshActiveNode.modules?.find(m => m.id === activeModule.id) : null;

  const handleMarkModuleStatus = (moduleId, newStatus) => {
    if (!freshActiveNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === freshActiveNode.id) {
          const updatedModules = (n.modules || []).map(m =>
            m.id === moduleId ? { ...m, status: newStatus } : m
          );
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    
    // Auto mark node as progress if we are starting a module
    if (newStatus === "in_progress" && getNodeState(freshActiveNode.id) === "default") {
        handleMarkState(freshActiveNode.id, "progress");
    }
  };

  // If no user is authenticated, render the Auth Interface
  if (!user) {
    return <AuthInterface />;
  }

  return (
    <div className="app">
      <Sidebar
        activePath={activePath}
        setActivePath={(p) => {
          setActivePath(p);
          setShowCurriculumMap(false);
          setShowResources(false);
          setShowProgress(false);
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
        activeNode={activeNode}
        setActiveNode={setActiveNode}
        setActiveModule={setActiveModule}
        setActiveTopic={setActiveTopic}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      {showProgress ? (
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

      {/* Modals */}
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

// Final wrapper injecting global Providers
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
