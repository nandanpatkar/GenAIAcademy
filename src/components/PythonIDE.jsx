import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, Loader, Terminal as TerminalIcon, Save, FolderOpen, 
  Trash2, Code2, Folder, ChevronRight, ChevronDown, FolderPlus, 
  X, Database, Plus, ShieldCheck, Cpu, Braces, Activity, ExternalLink,
  Layers, Command, Zap, LayoutPanelLeft, Edit3, PanelLeft
} from 'lucide-react';

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
      <header className="studio-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Sidebar Toggle — DSA Animator style */}
          <button 
            onClick={() => setShowWorkspace(!showWorkspace)}
            title="Toggle Workspace"
            style={{
              background: showWorkspace ? 'var(--bg3)' : 'transparent',
              border: `1px solid ${showWorkspace ? 'var(--border)' : 'transparent'}`,
              color: showWorkspace ? 'var(--text)' : 'var(--text3)',
              cursor: 'pointer', borderRadius: 7, width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s', flexShrink: 0,
            }}
          >
            <PanelLeft size={15} />
          </button>

          <div style={{ width: 1, height: 28, background: 'var(--border)' }} />

          <div>
            <h1 style={{ fontFamily: 'var(--font)', fontSize: 24, margin: 0, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>Python Engineering Studio</h1>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Mission Control · {snippetName}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           <button className="studio-btn-ghost" onClick={() => setShowSaveModal(true)}><Save size={16} /> COMMIT MODULE</button>
           
           <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
           
           {isLoading ? (
             <button className="studio-btn-primary" style={{ background: 'var(--bg4)', color: 'var(--text3)', height: 36, padding: '0 16px', fontSize: 11 }} disabled>
               <Loader className="spin" size={14} /> INITIALIZING...
             </button>
           ) : isRunning ? (
             <button className="studio-btn-primary" style={{ background: '#ef4444', color: '#fff', height: 36, padding: '0 16px', fontSize: 11 }} onClick={interruptExecution}>
               <Zap size={14} fill="currentColor" /> TERMINATE
             </button>
           ) : (
             <button className="studio-btn-primary" style={{ height: 36, padding: '0 16px', fontSize: 11 }} onClick={() => runPython(code)}>
               <Play size={14} fill="currentColor" /> RUN
             </button>
           )}
           
           <button className="admin-close-btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text2)' }} onClick={onClose}><X size={18} /></button>
        </div>
      </header>

      <main className="studio-main" style={{ position: 'relative' }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#121212',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <div style={{ display: 'flex', gap: '30px' }}>
                <motion.span
                  animate={{ 
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ fontSize: '84px', fontWeight: 300, color: '#00ccff', fontFamily: 'monospace' }}
                >
                  &#123;
                </motion.span>
                <motion.span
                  animate={{ 
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4
                  }}
                  style={{ fontSize: '84px', fontWeight: 300, color: '#00ccff', fontFamily: 'monospace' }}
                >
                  &#125;
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Structured Sidebar */}
        {showWorkspace && (
          <aside className="studio-sidebar">
             <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span className="studio-label-premium">Explorer</span>
               <div style={{ display: 'flex', gap: 8 }}>
                   <button onClick={() => {
                     const n = window.prompt("New Package Name:");
                     if (n) saveToStorage({ ...snippetsData, folders: [...snippetsData.folders, { id: 'f-'+Date.now(), name: n }] });
                   }} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}><FolderPlus size={14} /></button>
                   <button onClick={() => { setCurrentSnippetId(null); setSnippetName("main.py"); setCode("# New engineering sequence...\n"); }} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}><Plus size={16} /></button>
               </div>
             </div>

             <div className="tree-container mini-scrollbar" style={{ padding: '8px 0' }}>
               {/* Always-visible active file */}
               <div style={{ padding: '4px 14px 8px', marginBottom: 4 }}>
                 <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, padding: '0 6px' }}>OPEN</div>
                 <div 
                   style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(0, 255, 136, 0.07)', border: '1px solid rgba(0, 255, 136, 0.15)', cursor: 'default' }}
                 >
                   <Braces size={13} color="var(--neon)" strokeWidth={2.5} />
                   <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', flex: 1 }}>{snippetName}</span>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', flexShrink: 0 }} />
                 </div>
               </div>

               {/* Saved snippets section */}
               {(snippetsData.snippets.length > 0 || snippetsData.folders.length > 0) && (
                 <div style={{ padding: '0 14px', marginBottom: 4 }}>
                   <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, padding: '0 6px' }}>COMMITTED</div>
                 </div>
               )}

               <div style={{ padding: '0 10px' }}>
                 {snippetsData.folders.map(f => (
                   <div key={f.id} style={{ marginBottom: 2 }}>
                      <div className={`tree-row ${snippetsData.snippets.find(s=>s.id===currentSnippetId)?.folderId === f.id ? 'active' : ''}`} onClick={() => setExpandedFolders(p => ({ ...p, [f.id]: !p[f.id] }))} style={{ borderRadius: 8 }}>
                        <ChevronRight size={14} style={{ transform: expandedFolders[f.id] ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                        <Folder size={14} color="#3b82f6" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>{f.name}</span>
                      </div>
                      {expandedFolders[f.id] && snippetsData.snippets.filter(s=>s.folderId === f.id).map(s => (
                        <div key={s.id} style={{ marginLeft: 20, borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 8, marginBottom: 1 }} onClick={() => loadSnippet(s)}>
                           <div className={`tree-row ${currentSnippetId === s.id ? 'active' : ''}`} style={{ borderRadius: 6 }}>
                              <Braces size={12} color="var(--neon)" strokeWidth={2.5} />
                              <span style={{ fontSize: 12, color: currentSnippetId === s.id ? 'var(--text)' : 'var(--text2)' }}>{s.name}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                 ))}
                 
                 {snippetsData.snippets.filter(s=>!s.folderId).map(s => (
                   <div key={s.id} className={`tree-row ${currentSnippetId === s.id ? 'active' : ''}`} style={{ borderRadius: 8 }} onClick={() => loadSnippet(s)}>
                      <Code2 size={14} color="var(--text3)" />
                      <span style={{ fontSize: 13, color: currentSnippetId === s.id ? 'var(--text)' : 'var(--text2)' }}>{s.name}</span>
                   </div>
                 ))}
               </div>

               {snippetsData.snippets.length === 0 && snippetsData.folders.length === 0 && (
                 <div style={{ padding: '16px 20px', color: 'var(--text3)', fontSize: 11, textAlign: 'center', opacity: 0.5, lineHeight: 1.6 }}>
                   Use COMMIT MODULE<br/>to save your work
                 </div>
               )}
             </div>
          </aside>
        )}

        {/* Central Editor + Terminal Column */}
        <section className="studio-editor-area">
          {/* Tab Bar */}
          <div className="editor-tab-bar" style={{ background: 'rgba(255,255,255,0.02)', height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: '100%', borderBottom: '2px solid var(--neon)', padding: '0 4px' }}>
                <Braces size={14} color="var(--neon)" />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font)' }}>{snippetName}</span>
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
                  style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Edit3 size={11} />
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
                fontSize: 15,
                fontFamily: "'DM Mono', 'Fira Code', monospace",
                lineNumbers: "on",
                renderLineHighlight: "line",
                cursorBlinking: "phase",
                smoothScrolling: true,
                padding: { top: 24 },
                scrollbar: { vertical: 'auto', horizontal: 'auto' },
              }}
            />
          </div>

          {/* Terminal — bottom panel, always close to the code */}
          <div style={{ height: 220, borderTop: '1px solid rgba(255,255,255,0.08)', background: '#050508', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
             <div style={{ padding: '10px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <TerminalIcon size={13} color="var(--text3)" />
                 <span className="studio-label-premium">TERMINAL</span>
               </div>
               <Activity size={13} color={isRunning ? "var(--neon)" : "var(--text3)"} className={isRunning ? 'spin' : ''} />
             </div>
             <div className="studio-terminal-body mini-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
               {isRunning && (
                 <div style={{ color: 'var(--neon)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Loader className="spin" size={12} />
                    <span>Running...</span>
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
