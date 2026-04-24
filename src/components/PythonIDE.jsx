import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, Loader, Terminal as TerminalIcon, Save, FolderOpen, 
  Trash2, Code2, Folder, ChevronRight, ChevronDown, FolderPlus, 
  X, Database, Plus, ShieldCheck, Cpu, Braces, Activity, ExternalLink,
  Layers, Command, Zap, LayoutPanelLeft, Edit3, PanelLeft, Cloud, Monitor
} from 'lucide-react';

const IDE_MODES = [
  { id: 'local', label: 'LOCAL', icon: Monitor, color: 'var(--neon)' },
  { id: 'cloud', label: 'CLOUD', icon: Cloud, color: '#3b82f6' }
];

export function useSimplePyodide() {
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    let script = document.getElementById("pyodide-script");
    
    if (window.pyodideInstance) {
      setPyodide(window.pyodideInstance);
      setIsLoading(false);
      return;
    }

    const initPyodide = async () => {
      try {
        window.pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        setPyodide(window.pyodideInstance);
      } catch (e) {
        setStderr("CRITICAL: Python Runtime Failure.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = "pyodide-script";
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      script.onload = initPyodide;
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", initPyodide);
    }
  }, []);

  const runPython = async (code) => {
    if (!pyodide) return;
    setIsRunning(true);
    setStdout("");
    setStderr("");
    try {
      pyodide.setStdout({ batched: (str) => setStdout(prev => prev + str + "\n") });
      pyodide.setStderr({ batched: (str) => setStderr(prev => prev + str + "\n") });
      await pyodide.runPythonAsync(code);
    } catch (err) {
      setStderr(err.toString());
    } finally {
      setIsRunning(false);
    }
  };

  const interruptExecution = () => setIsRunning(false);

  return { runPython, stdout, stderr, isLoading, isRunning, interruptExecution };
}

export default function PythonIDE({ onClose }) {
  const [code, setCode] = useState("# Welcome to the Python Intelligence Studio\n# Redesigned for maximum engineering efficiency\n\nimport time\n\ndef initialize_workflow():\n    print(\"Initializing mission-critical modules...\")\n    time.sleep(0.4)\n    print(\"Accessing Neural Core: OK\")\n    print(\"Ready for engineering protocols.\")\n\ninitialize_workflow()\n");
  const { runPython, stdout, stderr, isLoading, isRunning, interruptExecution } = useSimplePyodide();

  const [snippetsData, setSnippetsData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('genai_ide_data')) || { folders: [], snippets: [] };
    } catch { return { folders: [], snippets: [] }; }
  });

  const [expandedFolders, setExpandedFolders] = useState({});
  const [currentSnippetId, setCurrentSnippetId] = useState(null);
  const [snippetName, setSnippetName] = useState("main.py");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftFolder, setDraftFolder] = useState("");
  const [showWorkspace, setShowWorkspace] = useState(true);
  const [viewMode, setViewMode] = useState('local'); // 'local' | 'cloud'
  const [hoveredMode, setHoveredMode] = useState(null);

  const saveToStorage = (data) => {
    setSnippetsData(data);
    localStorage.setItem('genai_ide_data', JSON.stringify(data));
  };

  const handleConfirmSave = () => {
    if (!draftName.trim()) return;
    let updatedSnippets = [...snippetsData.snippets];
    if (currentSnippetId) {
       const existingIndex = updatedSnippets.findIndex(s => s.id === currentSnippetId);
       if (existingIndex >= 0) updatedSnippets[existingIndex] = { ...updatedSnippets[existingIndex], name: draftName, code, folderId: draftFolder || null, updatedAt: Date.now() };
    } else {
       const newId = 's-' + Date.now().toString();
       updatedSnippets.push({ id: newId, name: draftName, code, folderId: draftFolder || null, updatedAt: Date.now() });
       setCurrentSnippetId(newId);
    }
    setSnippetName(draftName);
    saveToStorage({ ...snippetsData, snippets: updatedSnippets });
    setShowSaveModal(false);
  };

  const loadSnippet = (s) => {
    setCode(s.code);
    setCurrentSnippetId(s.id);
    setSnippetName(s.name);
  };

  return (
    <div className="studio-shell">
      {/* Premium Header */}
      <header className="studio-header" style={{ padding: '0 20px', height: 60, borderBottom: 'none', background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Sidebar Toggle — DSA Animator style */}
          <button 
            onClick={() => setShowWorkspace(!showWorkspace)}
            title="Toggle Workspace"
            style={{
              background: showWorkspace ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: 'none',
              color: showWorkspace ? 'var(--neon)' : 'var(--text3)',
              cursor: 'pointer', borderRadius: 8, width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s cubic-bezier(0.4, 0, 0.2, 1)', flexShrink: 0,
            }}
          >
            <PanelLeft size={16} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <h1 style={{ 
              fontFamily: 'var(--font)', 
              fontSize: 18, 
              margin: 0, 
              fontWeight: 800, 
              letterSpacing: '-0.3px', 
              lineHeight: 1,
              background: 'linear-gradient(135deg, #fff 0%, #a5a5a5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Python Engineering Studio
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: 8, 
              color: 'var(--text3)', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              lineHeight: 1,
              marginTop: 0
            }}>
              <Activity size={10} color="var(--neon)" /> MISSION CONTROL · {snippetName}
            </p>
          </div>

          {/* Mode Switcher */}
          <div 
            style={{ 
              display: 'flex', 
              background: 'rgba(255, 255, 255, 0.03)',
              padding: 4, 
              borderRadius: 12, 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              gap: 2,
              position: 'relative',
              backdropFilter: 'blur(10px)'
            }}
            onMouseLeave={() => setHoveredMode(null)}
          >
            <AnimatePresence>
              {hoveredMode && (
                <motion.div
                  layoutId="hoverIndicator_ide"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    bottom: 4,
                    width: `calc((100% - ${8 + (IDE_MODES.length - 1) * 2}px) / ${IDE_MODES.length})`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    zIndex: 0,
                    pointerEvents: 'none',
                    x: IDE_MODES.findIndex(m => m.id === hoveredMode) * (100 + (200 / (IDE_MODES.length * 10))) + '%'
                  }}
                />
              )}
            </AnimatePresence>

            {IDE_MODES.map(mode => {
              const isActive = viewMode === mode.id;
              const Icon = mode.icon;
              return (
                <button 
                  key={mode.id}
                  onMouseEnter={() => setHoveredMode(mode.id)}
                  onClick={() => setViewMode(mode.id)}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '6px 14px',
                    borderRadius: 9,
                    fontSize: 10,
                    fontWeight: 800,
                    color: isActive ? (mode.id === 'local' ? '#000' : '#fff') : 'var(--text3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    letterSpacing: '0.8px',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Icon size={12} />
                  {mode.label}
                  {isActive && (
                    <motion.div
                      layoutId="activePill_ide"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: mode.color,
                        borderRadius: 8,
                        zIndex: -1
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
           {viewMode === 'local' && (
             <>
               <button className="studio-btn-ghost" onClick={() => setShowSaveModal(true)} style={{ fontSize: 10, letterSpacing: 0.5 }}>
                 <Save size={14} /> COMMIT
               </button>
             </>
           )}
           
           {viewMode === 'local' ? (
             isLoading ? (
               <button className="studio-btn-primary" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text3)', height: 38, padding: '0 18px', fontSize: 10, border: 'none' }} disabled>
                 <Loader className="spin" size={14} /> INITIALIZING...
               </button>
             ) : isRunning ? (
               <button className="studio-btn-primary" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', height: 38, padding: '0 18px', fontSize: 10, border: 'none' }} onClick={interruptExecution}>
                 <Square size={12} fill="currentColor" /> TERMINATE
               </button>
             ) : (
               <button className="studio-btn-primary" style={{ height: 38, padding: '0 18px', fontSize: 10, boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)', border: 'none' }} onClick={() => runPython(code)}>
                 <Play size={12} fill="currentColor" /> EXECUTE
               </button>
             )
           ) : (
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neon)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(0, 255, 136, 0.05)', padding: '8px 16px', borderRadius: 10, border: 'none' }}>
               <ShieldCheck size={14} /> SECURE CLOUD ACTIVE
             </div>
           )}
           
           <button className="admin-close-btn" style={{ background: 'rgba(255,255,255,0.03)', border: 'none', color: 'var(--text2)', width: 38, height: 38, borderRadius: 10 }} onClick={onClose}><X size={18} /></button>
        </div>
      </header>

      <main className="studio-main" style={{ position: 'relative', background: '#050507', padding: 0, gap: 0 }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#050507',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <div style={{ position: 'relative' }}>
                <motion.div
                  animate={{ 
                    rotate: 360,
                    borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "70% 30% 50% 50% / 30% 60% 40% 70%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    width: 120,
                    height: 120,
                    background: 'radial-gradient(circle, rgba(0,204,255,0.2) 0%, transparent 70%)',
                    border: '1px solid rgba(0,204,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Cpu size={40} color="#00ccff" style={{ opacity: 0.8 }} />
                </motion.div>
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <div style={{ color: 'var(--text)', fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.8 }}>Initializing Core</div>
                  <div style={{ color: '#00ccff', fontSize: 10, fontWeight: 600, marginTop: 4, letterSpacing: 1, opacity: 0.5 }}>SYNCHRONIZING NEURAL PROTOCOLS...</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Structured Sidebar */}
        {showWorkspace && (
          <aside className="studio-sidebar" style={{ width: 280, border: 'none', background: 'rgba(10, 10, 15, 0.4)', borderRadius: 0 }}>
             <div style={{ padding: '24px', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span className="studio-label-premium" style={{ letterSpacing: 2, fontSize: 11 }}>WORKSPACE EXPLORER</span>
               <div style={{ display: 'flex', gap: 4 }}>
                   <button onClick={() => {
                     const n = window.prompt("New Package Name:");
                     if (n) saveToStorage({ ...snippetsData, folders: [...snippetsData.folders, { id: 'f-'+Date.now(), name: n }] });
                   }} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: 'none', color: 'var(--text3)', cursor: 'pointer', transition: 'all 0.2s' }}><FolderPlus size={13} /></button>
                   <button onClick={() => { setCurrentSnippetId(null); setSnippetName("main.py"); setCode("# New engineering sequence...\n"); }} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: 'none', color: 'var(--text3)', cursor: 'pointer', transition: 'all 0.2s' }}><Plus size={15} /></button>
               </div>
             </div>

             <div className="tree-container mini-scrollbar" style={{ padding: '16px' }}>
               {/* Always-visible active file */}
               <div style={{ marginBottom: 20 }}>
                 <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>ACTIVE SEQUENCE</div>
                 <div 
                   style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: 12, 
                     padding: '12px 14px', 
                     borderRadius: 12, 
                     background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.02) 100%)', 
                     border: 'none', 
                     cursor: 'default',
                     boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                     backdropFilter: 'blur(10px)'
                   }}
                 >
                   <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0, 255, 136, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Braces size={16} color="var(--neon)" strokeWidth={2.5} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{snippetName}</div>
                     <div style={{ fontSize: 9, color: 'var(--neon)', opacity: 0.6, fontWeight: 700 }}>NEURAL MODULE</div>
                   </div>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', boxShadow: '0 0 10px var(--neon)' }} />
                 </div>
               </div>

               {/* Saved snippets section */}
               {(snippetsData.snippets.length > 0 || snippetsData.folders.length > 0) && (
                 <div style={{ marginBottom: 10 }}>
                   <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', paddingLeft: 4 }}>COMMITTED ARCHIVE</div>
                 </div>
               )}

               <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                 {snippetsData.folders.map(f => (
                   <div key={f.id}>
                      <div className={`tree-row ${snippetsData.snippets.find(s=>s.id===currentSnippetId)?.folderId === f.id ? 'active' : ''}`} 
                        onClick={() => setExpandedFolders(p => ({ ...p, [f.id]: !p[f.id] }))} 
                        style={{ borderRadius: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: 'none' }}>
                        <ChevronRight size={14} style={{ transform: expandedFolders[f.id] ? 'rotate(90deg)' : 'none', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', opacity: 0.5 }} />
                        <Folder size={14} color="#3b82f6" opacity={0.8} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{f.name}</span>
                      </div>
                      <AnimatePresence>
                        {expandedFolders[f.id] && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', marginLeft: 20, borderLeft: 'none', paddingLeft: 8 }}
                          >
                            {snippetsData.snippets.filter(s=>s.folderId === f.id).map(s => (
                              <div key={s.id} style={{ padding: '2px 0' }} onClick={() => loadSnippet(s)}>
                                 <div className={`tree-row ${currentSnippetId === s.id ? 'active' : ''}`} style={{ borderRadius: 8, padding: '6px 10px' }}>
                                    <Code2 size={12} color={currentSnippetId === s.id ? "var(--neon)" : "rgba(255,255,255,0.3)"} />
                                    <span style={{ fontSize: 12, color: currentSnippetId === s.id ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: currentSnippetId === s.id ? 700 : 400 }}>{s.name}</span>
                                 </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 ))}
                 
                 {snippetsData.snippets.filter(s=>!s.folderId).map(s => (
                   <div key={s.id} className={`tree-row ${currentSnippetId === s.id ? 'active' : ''}`} 
                    style={{ borderRadius: 10, padding: '8px 12px', background: currentSnippetId === s.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', border: 'none' }} 
                    onClick={() => loadSnippet(s)}>
                      <Code2 size={14} color={currentSnippetId === s.id ? "var(--neon)" : "rgba(255,255,255,0.3)"} />
                      <span style={{ fontSize: 12, color: currentSnippetId === s.id ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: currentSnippetId === s.id ? 700 : 400 }}>{s.name}</span>
                   </div>
                 ))}
               </div>

               {snippetsData.snippets.length === 0 && snippetsData.folders.length === 0 && (
                 <div style={{ padding: '32px 20px', color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'center', lineHeight: 1.8, letterSpacing: 0.5 }}>
                   COMMITTED ARCHIVE EMPTY<br/>INITIATE COMMIT TO PERSIST
                 </div>
               )}
             </div>
          </aside>
        )}

        {/* Central Editor + Terminal Column */}
        <section className="studio-editor-area" style={{ background: '#000', borderRadius: 0 }}>
          {viewMode === 'local' ? (
            <>
              {/* Tab Bar */}
              <div className="editor-tab-bar" style={{ background: '#0a0a0f', height: 48, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: 'none', flexShrink: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  height: '100%', 
                  borderBottom: '2px solid var(--neon)', 
                  padding: '0 12px',
                  background: 'linear-gradient(to top, rgba(0, 255, 136, 0.05), transparent)'
                }}>
                    <Braces size={14} color="var(--neon)" />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'var(--font)', letterSpacing: 0.5 }}>{snippetName}</span>
                    <button 
                      onClick={() => {
                        const n = window.prompt("Rename Module:", snippetName);
                        if (n) {
                          setSnippetName(n);
                          if (currentSnippetId) {
                            const updated = snippetsData.snippets.map(s => s.id === currentSnippetId ? { ...s, name: n } : s);
                            saveToStorage({ ...snippetsData, snippets: updated });
                          }
                        }
                      }}
                      style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4, transition: 'all 0.2s' }}
                    >
                      <Edit3 size={10} />
                    </button>
                </div>
              </div>

              {/* Monaco Editor - fills remaining space */}
              <div style={{ flex: 1, background: '#000', position: 'relative', minHeight: 0 }}>
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  theme="vs-dark"
                  value={code}
                  onChange={setCode}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'DM Mono', 'Fira Code', monospace",
                    lineNumbers: "on",
                    renderLineHighlight: "line",
                    cursorBlinking: "phase",
                    smoothScrolling: true,
                    padding: { top: 20 },
                    scrollbar: { vertical: 'auto', horizontal: 'auto', useShadows: false },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    glyphMargin: false
                  }}
                />
              </div>

              {/* Terminal — bottom panel */}
              <div style={{ height: 260, borderTop: 'none', background: '#020204', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '12px 24px', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: isRunning ? 'var(--neon)' : 'rgba(255,255,255,0.1)', boxShadow: isRunning ? '0 0 10px var(--neon)' : 'none' }} />
                    <span className="studio-label-premium" style={{ letterSpacing: 2, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>NEURAL EXECUTION LOG</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>STATUS: {isRunning ? 'RUNNING' : 'READY'}</div>
                    <Activity size={14} color={isRunning ? "var(--neon)" : "rgba(255,255,255,0.2)"} className={isRunning ? 'spin' : ''} />
                  </div>
                </div>
                <div className="studio-terminal-body mini-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                  {isRunning && (
                    <div style={{ color: 'var(--neon)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, background: 'rgba(0, 255, 136, 0.03)', padding: '10px 14px', borderRadius: 8, border: 'none' }}>
                        <Loader className="spin" size={14} />
                        <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 1 }}>INITIALIZING EXECUTION PROTOCOL...</span>
                    </div>
                  )}
                  {stdout && (
                    <div className="mission-log-entry success">
                        <div style={{ opacity: 0.5, fontSize: 10, marginBottom: 4 }}>[STDOUT]</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{stdout}</div>
                    </div>
                  )}
                  {stderr && (
                    <div className="mission-log-entry error">
                        <div style={{ opacity: 0.5, fontSize: 10, marginBottom: 4 }}>[STDERR]</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{stderr}</div>
                    </div>
                  )}
                  {!isRunning && !stdout && !stderr && (
                    <div style={{ color: 'var(--text3)', opacity: 0.4, fontSize: 12 }}>
                      Press <strong style={{ color: 'var(--neon)' }}>RUN</strong> to execute your code...
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
              flex: 1, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: '#0a0a0c',
              position: 'relative',
              overflow: 'hidden'
            }}>

              {/* Iframe Container */}
              <div style={{ flex: 1, position: 'relative', background: '#0a0a0c' }}>
                <iframe
                  src="https://www.jdoodle.com/python3-programming-online?theme=dark"
                  title="JDoodle Python IDE"
                  style={{
                    width: '100%',
                    height: '100%', 
                    border: 'none',
                    background: 'transparent'
                  }}
                  allow="clipboard-read; clipboard-write"
                />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Commit Modal */}
      {showSaveModal && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 }}>
           <div className="glass-panel fade-in" style={{ width: 440, padding: 40, background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'var(--font)', margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Commit Module</h2>
              <p style={{ fontSize: 13, color: 'var(--text3)', margin: '0 0 32px' }}>Persist changes to your intelligence workspace.</p>

              <div style={{ marginBottom: 20 }}>
                 <label className="studio-label-premium" style={{ display: 'block', marginBottom: 8 }}>Identity</label>
                 <input 
                   className="admin-input" 
                   value={draftName} 
                   onChange={e => setDraftName(e.target.value)}
                   style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, color: 'var(--text)' }}
                 />
              </div>

              <div style={{ marginBottom: 32 }}>
                 <label className="studio-label-premium" style={{ display: 'block', marginBottom: 8 }}>Package Path</label>
                 <select 
                   className="admin-input" 
                   value={draftFolder} 
                   onChange={e => setDraftFolder(e.target.value)}
                   style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, color: 'var(--text)', appearance: 'none' }}
                 >
                    <option value="">ROOT_DIRECTORY</option>
                    {snippetsData.folders.map(f => <option key={f.id} value={f.id}>{f.name.toUpperCase()}</option>)}
                 </select>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                 <button className="studio-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowSaveModal(false)}>CANCEL</button>
                 <button className="studio-btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleConfirmSave}>CONFIRM COMMIT</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
