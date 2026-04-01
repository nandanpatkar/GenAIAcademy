import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Square, Loader, Terminal as TerminalIcon, Save, FolderOpen, Trash2, Code2, Folder, ChevronRight, ChevronDown, FolderPlus } from 'lucide-react';

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
        setStderr("Failed to load Pyodide execution environment.");
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
  const [code, setCode] = useState("# Write your Python code here...\nprint('Hello, GenAI Academy!')\n\n");
  const { runPython, stdout, stderr, isLoading, isRunning, interruptExecution } = useSimplePyodide();

  // Snippets Logic
  const [snippetsData, setSnippetsData] = useState(() => {
    try {
      const oldFlat = localStorage.getItem('genai_ide_snippets');
      if (oldFlat) {
        const parsed = JSON.parse(oldFlat);
        localStorage.removeItem('genai_ide_snippets');
        const migrated = { folders: [], snippets: parsed.map(s => ({ ...s, folderId: null })) };
        localStorage.setItem('genai_ide_data', JSON.stringify(migrated));
        return migrated;
      }
      return JSON.parse(localStorage.getItem('genai_ide_data')) || { folders: [], snippets: [] };
    } catch { return { folders: [], snippets: [] }; }
  });

  const [showSaved, setShowSaved] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [currentSnippetId, setCurrentSnippetId] = useState(null);
  const [snippetName, setSnippetName] = useState("main.py");
  
  // Save Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftFolder, setDraftFolder] = useState("");

  const saveToStorage = (data) => {
    setSnippetsData(data);
    localStorage.setItem('genai_ide_data', JSON.stringify(data));
  };

  const openSaveModal = () => {
    setDraftName(snippetName);
    const existingSnippet = snippetsData.snippets.find(s => s.id === currentSnippetId);
    setDraftFolder(existingSnippet?.folderId || "");
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    if (!draftName.trim()) return;
    
    let updatedSnippets = [...snippetsData.snippets];
    if (currentSnippetId) {
       const existingIndex = updatedSnippets.findIndex(s => s.id === currentSnippetId);
       if (existingIndex >= 0) {
         updatedSnippets[existingIndex] = { ...updatedSnippets[existingIndex], name: draftName, code, folderId: draftFolder || null, updatedAt: Date.now() };
       } else {
         updatedSnippets.push({ id: currentSnippetId, name: draftName, code, folderId: draftFolder || null, updatedAt: Date.now() });
       }
    } else {
       const newId = 's-' + Date.now().toString();
       updatedSnippets.push({ id: newId, name: draftName, code, folderId: draftFolder || null, updatedAt: Date.now() });
       setCurrentSnippetId(newId);
    }
    
    setSnippetName(draftName);
    saveToStorage({ ...snippetsData, snippets: updatedSnippets });
    setShowSaveModal(false);
  };

  const handleNewFolder = () => {
    const name = window.prompt("Enter new folder name:");
    if (!name?.trim()) return;
    const newFolder = { id: 'f-' + Date.now(), name: name.trim() };
    saveToStorage({ ...snippetsData, folders: [...snippetsData.folders, newFolder] });
    setExpandedFolders(prev => ({ ...prev, [newFolder.id]: true }));
  };

  const deleteFolder = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Delete this folder and all snippets inside it?")) {
      const remainingFolders = snippetsData.folders.filter(f => f.id !== id);
      const remainingSnippets = snippetsData.snippets.filter(s => s.folderId !== id);
      saveToStorage({ folders: remainingFolders, snippets: remainingSnippets });
      if (snippetsData.snippets.find(s => s.id === currentSnippetId && s.folderId === id)) {
         setCurrentSnippetId(null);
         setSnippetName("main.py");
         setCode("# Write your Python code here...\n");
      }
    }
  };

  const loadSnippet = (snippet) => {
    setCode(snippet.code);
    setCurrentSnippetId(snippet.id);
    setSnippetName(snippet.name);
  };

  const deleteSnippet = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Delete this snippet?")) {
      const remainingSnippets = snippetsData.snippets.filter(s => s.id !== id);
      saveToStorage({ ...snippetsData, snippets: remainingSnippets });
      if (currentSnippetId === id) {
         setCurrentSnippetId(null);
         setSnippetName("main.py");
         setCode("# Write your Python code here...\n");
      }
    }
  };

  const handleNew = () => {
    setCurrentSnippetId(null);
    setSnippetName("main.py");
    setCode("# Write your Python code here...\n");
  };

  const handleRun = () => {
    runPython(code);
  };

  const toggleFolder = (e, id) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSnippets = (folderId) => {
    const filtered = snippetsData.snippets.filter(s => s.folderId === folderId);
    return filtered.map(s => (
      <div 
        key={s.id}
        onClick={() => loadSnippet(s)}
        style={{ padding: "8px 16px", paddingLeft: folderId ? 32 : 16, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: currentSnippetId === s.id ? "var(--bg4)" : "transparent", borderLeft: currentSnippetId === s.id ? "3px solid #00ff88" : "3px solid transparent", transition: "all 0.2s" }}
        onMouseOver={(e) => { if (currentSnippetId !== s.id) e.currentTarget.style.background = "var(--bg3)"; }}
        onMouseOut={(e) => { if (currentSnippetId !== s.id) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
          <Code2 size={13} color="var(--text2)" />
          <span style={{ fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</span>
        </div>
        <button onClick={(e) => deleteSnippet(e, s.id)} title="Delete Snippet" style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: 4, display: "flex" }}>
          <Trash2 size={12} />
        </button>
      </div>
    ));
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)", height: "100%", overflow: "hidden", position: "relative" }}>
      
      {showSaveModal && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}>
          <div style={{ background: "var(--bg2)", padding: "24px 32px", borderRadius: 16, border: "1px solid var(--border)", width: 400, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "var(--text)" }}>Save Snippet</h3>
            
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Snippet Name</label>
            <input 
              value={draftName} 
              onChange={e => setDraftName(e.target.value)} 
              placeholder="e.g. data_processing.py"
              style={{ width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", marginBottom: 20, fontFamily: "var(--mono)", boxSizing: "border-box" }}
              autoFocus
            />

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Folder Location</label>
            <select 
               value={draftFolder} 
               onChange={e => setDraftFolder(e.target.value)}
               style={{ width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", marginBottom: 24, boxSizing: "border-box", appearance: "none" }}
            >
               <option value="">-- No Folder (Root) --</option>
               {snippetsData.folders.map(f => (
                 <option key={f.id} value={f.id}>{f.name}</option>
               ))}
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
               <button onClick={() => setShowSaveModal(false)} className="rg-btn" style={{ padding: "8px 16px", background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
               <button onClick={handleConfirmSave} className="rg-btn hover-success" style={{ padding: "8px 16px", background: "#00ff88", color: "#000", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Confirm Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#00ff88", background: "rgba(0,255,136,0.1)", padding: 8, borderRadius: 8, display: "flex" }}>
            <TerminalIcon size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: "var(--text)" }}>Python Practice IDE</h2>
            <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>Interactive WebAssembly Playground</div>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setShowSaved(!showSaved)} className="rg-btn" style={{ display: "flex", alignItems: "center", gap: 8, background: showSaved ? "var(--bg4)" : "var(--bg3)", color: "var(--text)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
            <FolderOpen size={14} /> Browse
          </button>
          <button onClick={openSaveModal} className="rg-btn" style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg3)", color: "var(--text)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
            <Save size={14} /> Save
          </button>
          {isLoading ? (
            <button className="rg-btn" style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg3)", color: "var(--text2)", padding: "8px 16px", borderRadius: 8, fontWeight: 700 }} disabled>
              <Loader size={14} className="spin" /> Initializing Sandbox...
            </button>
          ) : isRunning ? (
            <button onClick={interruptExecution} className="rg-btn hover-danger" style={{ display: "flex", alignItems: "center", gap: 8, background: "#ef444433", color: "#ef4444", border: "1px solid #ef4444", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 800 }}>
              <Square size={14} fill="currentColor" /> Stop
            </button>
          ) : (
            <button onClick={handleRun} className="rg-btn hover-success" style={{ display: "flex", alignItems: "center", gap: 8, background: "#00ff88", color: "#000", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 800 }}>
              <Play size={14} fill="currentColor" /> Run Code
            </button>
          )}
          <button onClick={onClose} className="rg-btn" style={{ padding: "8px 16px", background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Close IDE</button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", padding: "24px 40px", gap: 24, height: "100%", overflow: "hidden", boxSizing: "border-box" }}>
        
        {showSaved && (
          <div style={{ width: 280, display: "flex", flexDirection: "column", background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ padding: "16px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "1px" }}>WORKSPACE</span>
              <div style={{ display: "flex", gap: 8 }}>
                 <button onClick={handleNewFolder} title="New Folder" style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", padding: 4, display: "flex" }}><FolderPlus size={16} /></button>
                 <button onClick={handleNew} title="New Snippet" style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", padding: 4, display: "flex" }}><Code2 size={16} /></button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              
              {snippetsData.folders.map(f => (
                <div key={f.id} style={{ display: "flex", flexDirection: "column" }}>
                  <div onClick={(e) => toggleFolder(e, f.id)} style={{ padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "var(--bg3)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {expandedFolders[f.id] ? <ChevronDown size={14} color="var(--text3)" /> : <ChevronRight size={14} color="var(--text3)" />}
                      <Folder size={14} color="#3b82f6" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>{f.name}</span>
                    </div>
                    <button onClick={(e) => deleteFolder(e, f.id)} title="Delete Folder" style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: 4, display: "flex" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {expandedFolders[f.id] && renderSnippets(f.id)}
                </div>
              ))}

              {renderSnippets(null)}

              {snippetsData.folders.length === 0 && snippetsData.snippets.length === 0 && (
                <div style={{ padding: 20, color: "var(--text3)", fontSize: 13, textAlign: "center", fontStyle: "italic" }}>Workspace is empty.</div>
              )}
            </div>
          </div>
        )}

        <div style={{ flex: 2, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", background: "#1e1e1e", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--text2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{color: "var(--text)", background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: 4}}>{snippetName}</span>
            <span style={{color: "var(--text3)", fontWeight: 500}}>Python 3.11</span>
          </div>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={val => setCode(val)}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontFamily: "var(--mono)",
              scrollBeyondLastLine: false,
              padding: { top: 24 }
            }}
          />
        </div>
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--border)", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--text2)", letterSpacing: "1px", display: "flex", alignItems: "center", gap: 8 }}>
              <TerminalIcon size={14} /> TERMINAL OUTPUT
            </div>
            <div style={{ flex: 1, padding: 20, overflowY: "auto", fontFamily: "var(--mono)", fontSize: 14, color: "var(--text)", whiteSpace: "pre-wrap", background: "#0d0d12", lineHeight: 1.6 }}>
              {stdout ? <span style={{color: "var(--text)"}}>{stdout}</span> : stderr ? <span style={{ color: "#ef4444" }}>{stderr}</span> : <span style={{ color: "var(--text3)", fontStyle: "italic" }}>Awaiting execution...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
