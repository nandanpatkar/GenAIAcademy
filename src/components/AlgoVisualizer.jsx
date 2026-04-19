import React, { useState, useEffect, useRef, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, 
  Terminal, Code, Layout, Settings, BookOpen, 
  ChevronRight, Search, Activity, Cpu, Sparkles, X,
  Monitor, Info, Zap, Layers, Share2, Download,
  Compass, Grid, Eye, PanelLeftClose, PanelLeftOpen, Plus, Cloud,
  Minimize2, Maximize2, Columns, Grid3X3
} from 'lucide-react';
import { ALGO_EXAMPLES } from '../data/algoExamples';
import { findAlgorithmTemplates } from '../services/aiService';

// --- Pyodide Singleton (Prevents Race Conditions) ---
let pyodideInstance = null;
let pyodideLoading = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;
  
  pyodideLoading = (async () => {
    try {
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        await new Promise((resolve) => { script.onload = resolve; document.body.appendChild(script); });
      }
      pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
      return pyodideInstance;
    } catch (err) {
      pyodideLoading = null;
      throw err;
    }
  })();
  return pyodideLoading;
}

const TRACER_TEMPLATE = `
import sys
import json
import math
import functools
import collections
import heapq
import io
from typing import List, Dict, Any, Tuple, Optional, Union, Set

# LeetCode-friendly environment
inf = float('inf')
nan = float('nan')
Counter = collections.Counter
deque = collections.deque
defaultdict = collections.defaultdict

class AlgoTracer:
    def __init__(self, limit=2000):
        self.limit = limit
        self.frames = []
        self.step_count = 0
        self.stdout_buf = io.StringIO()
        self._orig_stdout = sys.stdout
        sys.stdout = self.stdout_buf
        self.exclude_vars = {'sys', 'json', 'AlgoTracer', 'tracer', '__name__', '__doc__', '__package__', '__loader__', '__spec__', '__builtins__', 'io', 'inf', 'nan', 'Counter', 'deque', 'defaultdict'}

    def trace_hook(self, frame, event, arg):
        if self.step_count >= self.limit or frame.f_code.co_filename != '<exec>':
            return self.trace_hook
        
        if event in ('line', 'call', 'return'):
            self.step_count += 1
            curr_locals = self.serialize_locals(frame.f_locals)
            
            snapshot = {
                'line': frame.f_lineno,
                'event': event,
                'func': frame.f_code.co_name,
                'locals': curr_locals,
                'stdout': self.stdout_buf.getvalue(),
                'changed_vars': []
            }
            
            if self.frames:
                prev_vars = self.frames[-1]['locals'].get('vars', {})
                new_vars = curr_locals.get('vars', {})
                snapshot['changed_vars'] = [k for k in new_vars if k not in prev_vars or new_vars[k] != prev_vars[k]]
            else:
                snapshot['changed_vars'] = list(curr_locals.get('vars', {}).keys())

            self.frames.append(snapshot)
        return self.trace_hook

    def serialize_locals(self, locals_dict):
        serializable = {'vars': {}, 'objects': {}}
        for k, v in locals_dict.items():
            if k in self.exclude_vars or k.startswith('_') or k == 'tracer': continue
            obj_type = type(v).__name__
            if obj_type in ('module', 'function', 'type', 'builtin_function_or_method'): continue
            
            # Simple value serialization
            if isinstance(v, (int, str, bool, type(None))):
                serializable['vars'][k] = v
            elif isinstance(v, float):
                if math.isinf(v): serializable['vars'][k] = "inf" if v > 0 else "-inf"
                elif math.isnan(v): serializable['vars'][k] = "nan"
                else: serializable['vars'][k] = v
            elif isinstance(v, (list, dict, set, tuple)):
                # For basic visualization we send the full object if small
                if len(str(v)) < 1000:
                    serializable['vars'][k] = list(v) if isinstance(v, (set, tuple)) else v
                else:
                    serializable['vars'][k] = str(v)[:100] + "..."
            else:
                serializable['vars'][k] = str(v)[:50]
        return serializable

    def get_trace(self):
        sys.stdout = self._orig_stdout
        return json.dumps(self.frames)

tracer = AlgoTracer()
sys.settrace(tracer.trace_hook)

try:
{{USER_CODE}}
finally:
    sys.settrace(None)
    trace_output = tracer.get_trace()
`;

const TRACE_OFFSET = TRACER_TEMPLATE.split('{{USER_CODE}}')[0].split('\n').length - 1;

export default function AlgoVisualizer({ user, savedAlgos = [], onSaveAlgo, onClose }) {
  // State
  const [code, setCode] = useState(ALGO_EXAMPLES[0].code);
  const [isNewProblemMode, setIsNewProblemMode] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [trace, setTrace] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(-1);
  const [playbackSpeedDivisor, setPlaybackSpeedDivisor] = useState(1); // 0.25, 0.5, 1, 2
  const playbackSpeed = useMemo(() => 500 / playbackSpeedDivisor, [playbackSpeedDivisor]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgoId, setSelectedAlgoId] = useState(ALGO_EXAMPLES[0].id);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'code' | 'solution'

  // Global Explorer State
  const [exploreModalOpen, setExploreModalOpen] = useState(false);
  const [exploreSearch, setExploreSearch] = useState('');
  const [isExploring, setIsExploring] = useState(false);
  const [exploreResults, setExploreResults] = useState([]);
  const [executionError, setExecutionError] = useState(null);

  const [isVizMaximized, setIsVizMaximized] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Resizable Panes State
  const [paneWidth, setPaneWidth] = useState(450); // Default width
  const [isResizing, setIsResizing] = useState(false);

  const playbackTimerRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef(null);
  const codeHighlightRef = useRef(null); // Reference for the floating highlight bar

  const combinedAlgos = useMemo(() => {
    return [...ALGO_EXAMPLES, ...savedAlgos];
  }, [savedAlgos]);

  const currentAlgo = useMemo(() => combinedAlgos.find(a => a.id === selectedAlgoId), [selectedAlgoId, combinedAlgos]);

  // Resize Logic
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      // Constraints: 300px to 800px
      const newWidth = Math.min(Math.max(300, e.clientX), 850);
      setPaneWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Initialize Pyodide
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const py = await getPyodide();
        if (mounted) {
          setPyodide(py);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Pyodide Init Error:", err);
        if (mounted) setIsLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Execution Logic
  const runTrace = async () => {
    if (!pyodide || isExecuting) return;
    setIsExecuting(true);
    setIsPlaying(false);
    setTrace([]); // CLEAR TRACE IMMEDIATELY
    setCurrentFrameIdx(-1);
    setExecutionError(null);
    setActiveTab('code'); // Switch to code view to see tracing

    try {
      // Indent user code by 4 spaces to fit into the tracer's try block
      const indentedCode = code.split('\n').map(line => '    ' + line).join('\n');
      const wrappedCode = TRACER_TEMPLATE.replace('{{USER_CODE}}', indentedCode);
      
      await pyodide.runPythonAsync(wrappedCode);
      const jsonStr = pyodide.globals.get('trace_output');
      // Sanitize JSON because Python's json.dumps produces invalid "Infinity" and "NaN"
      const sanitized = jsonStr.replace(/\b(Infinity|-Infinity|NaN)\b/g, '"$1"');
      const data = JSON.parse(sanitized);
      setTrace(data);
      if (data.length > 0) setCurrentFrameIdx(0);
    } catch (err) {
      console.error("Execution Error:", err);
      setExecutionError(err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExploreSearch = async () => {
    if (!exploreSearch.trim()) return;
    setIsExploring(true);
    try {
      const resp = await findAlgorithmTemplates(exploreSearch);
      setExploreResults(resp.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExploring(false);
    }
  };

  const handleNewProblem = () => {
    setIsNewProblemMode(true);
    setSelectedAlgoId(null);
    setCode(`# Title: Untitled Algorithm\n# Category: Custom\n\ndef main():\n    # Write your code here\n    data = [1, 2, 3]\n    print(data)\n\nmain()`);
    setTrace([]);
    setCurrentFrameIdx(-1);
    setActiveTab('code');
  };

  const handleSaveCurrent = () => {
    if (!onSaveAlgo) return;
    
    // Create a new algo object from current state
    const newAlgo = {
      id: isNewProblemMode ? `custom-${Date.now()}` : (currentAlgo?.id || `ai-${Date.now()}`),
      title: isNewProblemMode ? 'New Algorithm' : (currentAlgo?.title || 'Fetched Algorithm'),
      category: isNewProblemMode ? 'Custom' : (currentAlgo?.category || 'Algorithm'),
      code: code,
      difficulty: 'Medium',
      description: 'Saved from Algo Studio session.'
    };
    
    onSaveAlgo(newAlgo);
    if (isNewProblemMode) {
      setIsNewProblemMode(false);
      setSelectedAlgoId(newAlgo.id);
    }
  };

  const handleVisualize = (algo) => {
    setCode(algo.code);
    setTrace([]);
    setCurrentFrameIdx(-1);
    setExecutionError(null);
    setExploreModalOpen(false);
    setActiveTab('code');
  };

  // Playback Control
  useEffect(() => {
    if (isPlaying && currentFrameIdx < trace.length - 1) {
      playbackTimerRef.current = setTimeout(() => {
        setCurrentFrameIdx(prev => prev + 1);
      }, playbackSpeed);
    } else if (currentFrameIdx >= trace.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(playbackTimerRef.current);
  }, [isPlaying, currentFrameIdx, trace.length, playbackSpeed]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  const handleStepForward = () => setCurrentFrameIdx(prev => Math.min(trace.length - 1, prev + 1));
  const handleStepBack = () => setCurrentFrameIdx(prev => Math.max(0, prev - 1));
  const handleReset = () => { setIsPlaying(false); setCurrentFrameIdx(trace.length > 0 ? 0 : -1); };

  const currentFrame = trace[currentFrameIdx] || { line: 0, locals: { vars: {}, objects: {} } };
  
  // Detect visualizable data (lists, graphs)
  const visualizableData = useMemo(() => {
    const lists = [];
    const vars = [];
    const matrices = [];
    const objects = currentFrame.locals.objects || {};
    const localVars = currentFrame.locals.vars || {};
    
    Object.entries(localVars).forEach(([name, val]) => {
      if (Array.isArray(val)) {
        // Detect if it's a 2D Array (Matrix)
        if (val.length > 0 && Array.isArray(val[0])) {
          matrices.push({ name, val });
        } else {
          lists.push({ name, val });
        }
      } else if (val && typeof val === 'object' && val.ref) {
        vars.push({ name, val, isRef: true });
      } else {
        vars.push({ name, val });
      }
    });

    return { lists, vars, objects, matrices };
  }, [currentFrame]);

  // Pointer Mapping: Connect variable names to Node IDs for floating labels
  const floatingPointers = useMemo(() => {
    const map = {};
    visualizableData.vars.forEach(v => {
      if (v.isRef && v.val.ref) {
        const nodeId = v.val.ref;
        if (!map[nodeId]) map[nodeId] = [];
        map[nodeId].push(v.name);
      }
    });
    return map;
  }, [visualizableData.vars]);

  // Pro Layout Engine: Automatically detects Tree vs Graph structures
  const graphNodes = useMemo(() => {
    // FILTER: Ensure lists are ONLY handled by the Bar Chart renderer, never the Graph engine
    const nodes = Object.values(visualizableData.objects).filter(n => n.type !== 'list');
    if (!nodes.length) return [];
    
    // 1. Detect if it's a Tree (has left/right or children pointers)
    const isTree = nodes.some(n => n.edges.some(e => ['left', 'right', 'children'].includes(e.label)));
    
    if (isTree) {
      // Hierarchical Layout
      const levels = {};
      const rootCandidates = new Set(nodes.map(n => n.id));
      nodes.forEach(n => n.edges.forEach(e => rootCandidates.delete(e.to)));
      const rootId = rootCandidates.size > 0 ? Array.from(rootCandidates)[0] : nodes[0].id;

      const assignLevels = (id, level = 0, xOffset = 0) => {
        if (!levels[level]) levels[level] = [];
        const n = nodes.find(node => node.id === id);
        if (!n || n.visited) return;
        n.visited = true;
        levels[level].push(id);
        
        n.edges.forEach((e, i) => {
          assignLevels(e.to, level + 1);
        });
      };
      
      nodes.forEach(n => n.visited = false);
      assignLevels(rootId);

      return nodes.map(node => {
        const level = Object.keys(levels).find(l => levels[l].includes(node.id));
        const idx = levels[level].indexOf(node.id);
        const width = levels[level].length * 120;
        return {
          ...node,
          x: 400 - (width / 2) + (idx * 120) + 60,
          y: 80 + (level * 100),
          color: '#fbbf24'
        };
      });
    }

    // Default Circular Layout
    return nodes.map((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = nodes.length > 8 ? 220 : 160;
      return {
        ...node,
        x: 400 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        color: node.type.toLowerCase().includes('list') ? '#60a5fa' : '#00ff88'
      };
    });
  }, [visualizableData.objects]);

  // Pointer Detection Logic (Find variables that point to indices)
  const pointers = useMemo(() => {
    const listPointers = {};
    visualizableData.lists.forEach(list => {
      const arrLen = list.val.length;
      listPointers[list.name] = visualizableData.vars.filter(v => 
        typeof v.val === 'number' && 
        v.val >= 0 && v.val < arrLen && 
        ['i', 'j', 'k', 'low', 'high', 'mid', 'target_idx', 'idx', 'p', 'q'].includes(v.name.toLowerCase())
      );
    });
    return listPointers;
  }, [visualizableData]);

  // Sync Monaco Highlight with Execution
  useEffect(() => {
    if (editorRef.current && currentFrame.line > 0) {
      const line = currentFrame.line - TRACE_OFFSET;
      if (line > 0) {
        // We still use revealLine to keep the code in view
        editorRef.current.revealLineInCenterIfOutsideViewport(line);
      }
    }
  }, [currentFrameIdx, currentFrame.line]);

  const classification = useMemo(() => {
    const vars = currentFrame.locals.vars || {};
    const changed = currentFrame.changed_vars || [];
    
    return {
      arrays: Object.entries(vars).filter(([_, v]) => Array.isArray(v) && !Array.isArray(v[0])),
      matrices: Object.entries(vars).filter(([_, v]) => Array.isArray(v) && Array.isArray(v[0])),
      scalars: Object.entries(vars).filter(([_, v]) => !Array.isArray(v) && typeof v !== 'object'),
      pointers: Object.entries(vars).filter(([k, v]) => 
        ['i', 'j', 'k', 'low', 'high', 'mid', 'left', 'right', 'p', 'q', 'idx'].includes(k.toLowerCase()) && 
        typeof v === 'number'
      ),
      changedSet: new Set(changed)
    };
  }, [currentFrame]);


  const filteredAlgos = ALGO_EXAMPLES.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="algo-studio-overlay"
    >
      <div className="studio-pro-shell">
      <header className="studio-header">
        <div className="window-dots">
          <div className="dot red" />
          <div className="dot yellow" />
          <div className="dot green" />
        </div>
        <div className="studio-title">
          <Cpu size={14} className="emerald-pulse" />
          <span>ALGO_STUDIO_PRO</span>
          <span className="v-tag">v2.6</span>
        </div>
        
        <div className="header-nav">
          <div className="pro-pill-btn" onClick={() => setExploreModalOpen(true)}>
            <Compass size={16} />
            <span>EXPLORE</span>
          </div>
          <div className="pro-pill-btn secondary" onClick={handleNewProblem}>
            <Plus size={16} />
            <span>NEW</span>
          </div>
        </div>

        <div className="header-actions">
           <button 
             className={`run-btn ${isExecuting ? 'executing' : ''}`} 
             onClick={runTrace}
             disabled={isLoading || isExecuting}
           >
             {isExecuting ? <Activity size={14} className="spin" /> : <Play size={14} fill="currentColor" />}
             <span>{isExecuting ? 'RUN' : 'RUN'}</span>
           </button>
           <button className="pro-btn close" onClick={onClose}><X size={18} /></button>
        </div>
      </header>

      <div className="studio-body">

        <main className="studio-main">
          <div className={`workspace ${isVizMaximized ? 'sidebar-collapsed' : ''}`}>
            
            {/* --- Editor & Theory Section (30%) --- */}
            <section 
              className={`editor-pane ${isVizMaximized ? 'collapsed' : ''}`}
              style={{ width: isVizMaximized ? 0 : paneWidth }}
            >
              <div className="pane-header">
                <div className="tabs-pill">
                  <button className={`tab ${activeTab === 'theory' ? 'active' : ''}`} onClick={() => setActiveTab('theory')}>
                    <BookOpen size={14} />
                    <span>Theory</span>
                  </button>
                  <button className={`tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>
                    <Code size={14} />
                    <span>source.py</span>
                  </button>
                </div>
              </div>
              
              <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                {activeTab === 'theory' ? (
                   // ... (reduced for brevity in instruction, keeping same logic)
                  <div className="question-content mini-scrollbar">
                    <div className="q-card">
                      <div className="q-meta">
                        <div className="q-tag">{currentAlgo?.category}</div>
                        <div className={`q-diff ${currentAlgo?.difficulty?.toLowerCase()}`}>{currentAlgo?.difficulty}</div>
                      </div>
                      <h2>{currentAlgo?.title}</h2>
                      <div className="complexity-row">
                        <div className="comp-item">
                           <span className="label">TIME</span>
                           <span className="val">{currentAlgo?.complexity?.time || 'O(N²)'}</span>
                        </div>
                        <div className="comp-item">
                           <span className="label">SPACE</span>
                           <span className="val">{currentAlgo?.complexity?.space || 'O(1)'}</span>
                        </div>
                      </div>
                      <section className="q-section highlight"><h3>Problem Statement</h3><p>{currentAlgo?.question || currentAlgo?.description}</p></section>
                      <button className="start-btn" onClick={() => setActiveTab('code')}><span>ACCESS SOURCE CODE</span><ChevronRight size={16} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="editor-tab-content">
                    <div className="monaco-wrapper">
                      {currentFrame.line > 0 && (
                        <motion.div 
                          className="code-highlight-bar"
                          animate={{ 
                            y: (currentFrame.line - TRACE_OFFSET - 1) * 19 + 20, // 19px line height, 20px padding
                            opacity: 1 
                          }}
                          initial={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Editor 
                        height="100%" 
                        defaultLanguage="python" 
                        theme="vs-dark" 
                        value={code} 
                        onChange={setCode} 
                        options={{ 
                          minimap: { enabled: false }, 
                          fontSize: 13, 
                          fontFamily: "'Fira Code', monospace", 
                          lineNumbers: "on", 
                          padding: { top: 20 }, 
                          cursorBlinking: "smooth", 
                          automaticLayout: true 
                        }} 
                        onMount={(editor, monaco) => { 
                          editorRef.current = editor; 
                          monacoRef.current = monaco; 
                        }} 
                      />
                    </div>
                    {/* --- Pro Output Terminal --- */}
                    <div className="studio-terminal">
                      <div className="terminal-header">
                        <Terminal size={12} />
                        <span>INTELLIGENCE_OUTPUT</span>
                        <div className="terminal-status"><div className="status-dot" /> READY</div>
                      </div>
                      <div className="terminal-body mini-scrollbar">
                        {executionError ? (
                           <div className="t-log error"><span className="t-time">[{new Date().toLocaleTimeString()}]</span> ERROR: {executionError}</div>
                        ) : trace.length > 0 ? (
                           <div className="t-log success"><span className="t-time">[{new Date().toLocaleTimeString()}]</span> TRACE_COMPLETE: Captured {trace.length} simulation steps.</div>
                        ) : (
                           <div className="t-log muted"><span className="t-time">[{new Date().toLocaleTimeString()}]</span> SYSTEM_IDLE: Waiting for execution trigger...</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* --- Resizer (Splitter) --- */}
            {!isVizMaximized && (
              <div 
                className={`studio-resizer ${isResizing ? 'active' : ''}`}
                onMouseDown={startResizing}
              />
            )}

            {/* --- Visualization Section (70%) --- */}
            <section className={`viz-section ${isVizMaximized ? 'maximized' : ''}`}>
              <div className="pane-header">
                <div className="tabs-pill">
                  <button className="tab active">
                    <Monitor size={14} />
                    <span>Visualization</span>
                  </button>
                </div>
                <div className="tab-actions" style={{ display: 'flex', gap: 12 }}>
                     <button 
                        className="pro-action-btn" 
                        onClick={() => { setZoom(1); setPan({x:0, y:0}); }}
                        title="Reset View"
                     >
                       <Minimize2 size={14} />
                     </button>
                     <button 
                        className="pro-action-btn" 
                        onClick={() => setIsVizMaximized(!isVizMaximized)}
                        title={isVizMaximized ? "Restore Split" : "Maximize Studio"}
                     >
                       {isVizMaximized ? <Columns size={14} /> : <Maximize2 size={14} />}
                     </button>
                </div>
              </div>

              <div className="viz-canvas mini-scrollbar">
                {executionError ? (
                  <div className="error-console mini-scrollbar">
                    <div className="error-header">
                      <Terminal size={16} />
                      <span>Python Execution Error</span>
                    </div>
                    <pre className="error-body">{executionError}</pre>
                  </div>
                ) : trace.length === 0 ? (
                  <div className="aero-splash">
                    <div className="splash-core">
                       <div className="pulse-ring" />
                       <Cpu size={64} className="splash-icon emerald-pulse" />
                    </div>
                    {isLoading ? (
                      <div className="boot-loader">
                        <h3>INITIALIZING_PYTHON_RUNTIME</h3>
                        <div className="skeleton-bar-container">
                          <motion.div 
                            className="skeleton-progress"
                            animate={{ width: ["0%", "80%", "90%"] }}
                            transition={{ duration: 3 }}
                          />
                        </div>
                        <p>Loading Pyodide environment... (first load ~3s)</p>
                      </div>
                    ) : (
                      <>
                        <h3>READY_FOR_INTELLIGENCE</h3>
                        <p>Compile your source and step into the logic engine to begin visualization.</p>
                      </>
                    )}
                  </div>
                ) : executionError ? (
                  <div className="error-card-pro">
                    <div className="e-header">
                      <Zap size={16} />
                      <span>RUNTIME_EXCEPTION</span>
                      <button onClick={() => { navigator.clipboard.writeText(executionError); }} className="copy-e">COPY ERROR</button>
                    </div>
                    <div className="e-body mini-scrollbar">
                      <pre>{executionError}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="canvas-content mini-scrollbar">
                    {/* Render Arrays */}
                    {classification.arrays.map(([name, arr]) => (
                      <div key={name} className="viz-group-container secondary">
                        <div className="viz-group-header">
                           <Layers size={14} />
                           <span>{name.toUpperCase()} (ARRAY)</span>
                           <span className="v-count">{arr.length} ITEMS</span>
                        </div>
                        <div className="array-viz-wrapper">
                          <AnimatePresence>
                            {/* Pointers for this array */}
                            <div className="pointer-row">
                              {classification.pointers
                                .filter(([_, val]) => val >= 0 && val < arr.length)
                                .map(([pName, pVal]) => {
                                    const getPointerColor = (name) => {
                                      const n = name.toLowerCase();
                                      if (n === 'i') return '#00ff88';
                                      if (n === 'j') return '#fbbf24';
                                      if (n === 'k') return '#8b5cf6';
                                      return '#3b82f6';
                                    };
                                    const pColor = getPointerColor(pName);

                                    return (
                                      <motion.div
                                        key={`pointer-${pName}`}
                                        className="ptr-indicator"
                                        style={{ color: pColor }}
                                        animate={{ x: pVal * 45 + 22.5 }} // Based on cell width
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                      >
                                        <div className="ptr-label" style={{ background: pColor }}>{pName}</div>
                                        <ChevronRight className="rotate-90" size={14} />
                                      </motion.div>
                                    );
                                  })}
                            </div>
                          </AnimatePresence>
                          <div className="array-cells-row">
                            {arr.map((val, idx) => {
                              const isChanged = classification.changedSet.has(name);
                              return (
                                <motion.div
                                  layoutId={`cell-${name}-${val}-${idx}`} // Use idx to keep it stable if values repeat
                                  key={`${name}-${idx}`}
                                  layout
                                  className="array-cell-pro"
                                  animate={{
                                    backgroundColor: classification.changedSet.has(name) ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.03)',
                                    borderColor: classification.changedSet.has(name) ? '#00ff88' : 'rgba(255,255,255,0.1)'
                                  }}
                                >
                                  <span className="c-val">{val}</span>
                                  <span className="c-idx">{idx}</span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Render Matrices */}
                    {classification.matrices.map(([name, matrix]) => (
                      <div key={name} className="viz-group-container">
                        <div className="viz-group-header">
                           <Grid size={14} />
                           <span>{name.toUpperCase()} (MATRIX)</span>
                        </div>
                        <div className="matrix-viz-wrapper mini-scrollbar">
                           <table className="pro-matrix">
                             <tbody>
                               {matrix.map((row, rIdx) => (
                                 <tr key={rIdx}>
                                   {row.map((cell, cIdx) => (
                                      <td key={cIdx}>
                                        <motion.div 
                                          className="matrix-cell-pro"
                                          animate={{ 
                                            backgroundColor: classification.changedSet.has(name) ? 'rgba(0,255,136,0.1)' : 'transparent'
                                          }}
                                        >
                                          {cell}
                                        </motion.div>
                                      </td>
                                   ))}
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>
                      </div>
                    ))}

                    {/* Render Scalars (Variable Cards) */}
                    <div className="scalars-viz-grid">
                      {classification.scalars.map(([name, val]) => (
                        <motion.div 
                          key={name} 
                          className={`scalar-card-pro ${classification.changedSet.has(name) ? 'hl' : ''}`}
                          layout
                        >
                           <div className="s-label">{name}</div>
                           <motion.div 
                             key={val}
                             initial={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
                             animate={{ backgroundColor: 'transparent' }}
                             className="s-value"
                           >
                             {String(val)}
                           </motion.div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Stdout Terminal */}
                    {currentFrame.stdout && (
                      <div className="viz-stdout-panel">
                        <div className="vh-header"><Terminal size={12} /><span>STDOUT</span></div>
                        <pre className="stdout-content">{currentFrame.stdout}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* --- Improved Cinematic Playback Bar --- */}
              <div className="studio-playback-bar">
                <div className="pb-glass-content">
                  <div className="pb-left">
                    <div className="pb-controls">
                      <button onClick={handleReset} className="pb-btn"><RotateCcw size={14} /></button>
                      <button onClick={handleStepBack} disabled={currentFrameIdx <= 0} className="pb-btn"><SkipBack size={14} /></button>
                      <button className="pb-play-main" onClick={handleTogglePlay}>
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                      </button>
                      <button onClick={handleStepForward} disabled={currentFrameIdx >= trace.length - 1} className="pb-btn"><SkipForward size={14} /></button>
                    </div>
                    <div className="pb-status">
                      <span className="pb-step">STEP {currentFrameIdx + 1} / {trace.length}</span>
                      <span className="pb-desc">
                        {currentFrame.func !== '<module>' ? `· ${currentFrame.func}` : '· entry'}
                      </span>
                    </div>
                  </div>

                  <div className="pb-center">
                    <div className="scrubber-track">
                      <input 
                        className="pb-scrubber-pro"
                        type="range" min="0" max={Math.max(0, trace.length - 1)}
                        value={currentFrameIdx} 
                        onChange={e => setCurrentFrameIdx(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="pb-right">
                    <div className="speed-pills-pro">
                      {[0.25, 0.5, 1, 2].map(speed => (
                        <button 
                          key={speed}
                          className={`speed-pill-pro ${playbackSpeedDivisor === speed ? 'active' : ''}`}
                          onClick={() => setPlaybackSpeedDivisor(speed)}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        </main>
      </div>
    </div>



        <AnimatePresence>
          {exploreModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="market-overlay"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="market-modal"
              >
                <div className="market-header">
                  <div className="m-title-group">
                    <h2>Intelligence Repository</h2>
                    <span>Select a blueprint to begin simulation</span>
                  </div>
                  <button className="close-m-btn" onClick={() => setExploreModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="market-body mini-scrollbar">
                  <div className="m-results-grid">
                    {combinedAlgos.map(algo => (
                      <div key={algo.id} className="m-card">
                        <div className="m-card-header">
                          <h3>{algo.title}</h3>
                          <span className="m-tag">{algo.category}</span>
                        </div>
                        <p>{algo.description}</p>
                        <div className="m-card-footer">
                          <div className={`m-diff ${algo.difficulty?.toLowerCase()}`}>{algo.difficulty}</div>
                          <button className="m-viz-btn" onClick={() => handleVisualize(algo)}>INITIALIZE</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


      <style>{`
        .algo-studio-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9999;
          background: #000;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          color: #fff;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* --- STUDIO PRO REDESIGN --- */
        .studio-pro-shell {
          height: 100vh;
          width: 100%;
          background: #000;
          display: flex;
          flex-direction: column;
          padding: 0;
          gap: 0;
          font-family: 'Syne', sans-serif;
        }
        .studio-header {
          display: grid;
          grid-template-columns: 100px 1fr 240px 180px;
          align-items: center;
          padding: 0 24px;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          height: 64px;
          z-index: 100;
        }

        .studio-playback-bar {
          position: absolute;
          bottom: 24px;
          left: 0;
          right: 0;
          height: 64px;
          display: flex;
          justify-content: center;
          padding: 0 24px;
          z-index: 1000;
          pointer-events: none;
        }

        .pb-glass-content {
          width: 100%;
          max-width: 900px;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          display: grid;
          grid-template-columns: 240px 1fr 180px;
          align-items: center;
          padding: 0 20px;
          gap: 20px;
          pointer-events: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .pb-left { display: flex; align-items: center; gap: 16px; min-width: 0; }
        .pb-controls { display: flex; align-items: center; gap: 8px; }
        
        .pb-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .pb-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
        .pb-btn:disabled { opacity: 0.1; cursor: not-allowed; }

        .pb-play-main {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #fff;
          color: #000;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
          box-shadow: 0 4px 12px rgba(255,255,255,0.2);
        }
        .pb-play-main:hover { transform: scale(1.05); }

        .pb-status { display: flex; flex-direction: row; align-items: center; gap: 6px; min-width: 0; overflow: hidden; }
        .pb-step { font-size: 10px; font-weight: 900; color: #00ff88; letter-spacing: 1px; white-space: nowrap; }
        .pb-desc { font-size: 10px; font-weight: 600; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.6; }

        .scrubber-track {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 10px;
        }

        .pb-scrubber-pro {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .pb-scrubber-pro::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,255,136,0.5);
          border: 2px solid #000;
        }

        .pb-right { display: flex; justify-content: flex-end; }
        .speed-pills-pro {
          display: flex;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 2px;
          border-radius: 8px;
          gap: 2px;
        }

        .speed-pill-pro {
          background: transparent;
          border: none;
          color: #444;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s;
        }

        .speed-pill-pro.active { background: rgba(0, 255, 136, 0.15); color: #00ff88; }
        .speed-pill-pro:hover:not(.active) { color: #888; }

        .studio-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          color: #fff;
          font-size: 13px;
        }

        .header-nav {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .header-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
        }


        .pane-header {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .viz-canvas {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: 
            linear-gradient(rgba(0, 255, 136, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center;
        }

        .window-dots { display: flex; gap: 8px; }
        .window-dots .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot.red { background: #ff5f56; }
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #27c93f; }

        .studio-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 11px;
        }

        .studio-title .v-tag {
          color: #00ff88;
          font-size: 9px;
          background: rgba(0, 255, 136, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .studio-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          background: #000;
        }

        .studio-sidebar {
          display: none;
        }

        .logo-box {
           width: 40px;
           height: 40px;
           background: rgba(0, 255, 136, 0.1);
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
           margin-bottom: 40px;
        }

        .sidebar-nav {
           display: flex;
           flex-direction: column;
           gap: 20px;
        }

        .nav-item {
           width: 44px;
           height: 44px;
           background: transparent;
           border: none;
           color: #444;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: 10px;
           cursor: pointer;
           transition: 0.3s;
        }

        .nav-item:hover { color: #00ff88; background: rgba(0, 255, 136, 0.05); }
        .nav-item.active { color: #00ff88; background: rgba(0, 255, 136, 0.1); }

        .studio-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: radial-gradient(circle at top right, rgba(0,255,136,0.03), transparent);
        }

        .workspace {
          flex: 1;
          display: grid;
          grid-template-columns: ${paneWidth}px 1px 1fr;
          overflow: hidden;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: #000;
          width: 100%;
        }

        .studio-resizer {
          width: 4px;
          margin: 0 -2px;
          background: transparent;
          cursor: col-resize;
          position: relative;
          z-index: 1000;
          transition: 0.2s;
        }

        .studio-resizer:hover, .studio-resizer.active {
          background: rgba(0, 255, 136, 0.5);
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
        }

        /* --- GLASS DOCK --- */
        .glass-dock {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          width: fit-content;
        }

        .dock-content {
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 12px 24px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .playback-controls { display: flex; align-items: center; gap: 16px; }

        .play-ring {
           width: 52px;
           height: 52px;
           border-radius: 50%;
           background: #fff;
           color: #000;
           border: none;
           display: flex;
           align-items: center;
           justify-content: center;
           position: relative;
           cursor: pointer;
           transition: 0.3s;
        }

        .play-ring:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,255,255,0.3); }

        .ring-pulse {
           position: absolute;
           inset: -4px;
           border: 2px solid rgba(0, 255, 136, 0.3);
           border-radius: 50%;
           animation: dock-pulse 2s infinite;
        }

        @keyframes dock-pulse {
           0% { transform: scale(1); opacity: 0.8; }
           100% { transform: scale(1.3); opacity: 0; }
        }

        .dock-btn {
           background: rgba(255,255,255,0.05);
           border: 1px solid rgba(255,255,255,0.08);
           color: #888;
           width: 40px;
           height: 40px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: 0.3s;
        }

        .dock-btn:hover:not(:disabled) { color: #fff; background: rgba(255,255,255,0.15); border-color: #fff; }
        .dock-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        .dock-separator { width: 1px; height: 32px; background: rgba(255,255,255,0.08); }

        .dock-telemetry { display: flex; align-items: center; gap: 32px; }

        .telemetry-item { display: flex; flex-direction: column; gap: 4px; }
        .telemetry-item.wide { width: 180px; }
        
        .t-header { display: flex; justify-content: space-between; width: 100%; }
        .t-label { font-size: 8px; font-weight: 800; color: #555; letter-spacing: 1px; text-transform: uppercase; }
        .t-val { font-size: 9px; font-weight: 900; color: #00ff88; }
        
        .t-slider { margin-top: 4px; }

        /* --- AERO SPLASH --- */
        .aero-splash {
           height: 100%;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           text-align: center;
           gap: 24px;
        }

        .splash-core { position: relative; margin-bottom: 20px; }
        .splash-icon { position: relative; z-index: 2; color: #00ff88; opacity: 0.8; }
        
        .pulse-ring {
           position: absolute;
           top: 50%; left: 50%;
           transform: translate(-50%, -50%);
           width: 120px; height: 120px;
           border: 1px solid rgba(0, 255, 136, 0.2);
           border-radius: 50%;
           animation: splash-pulse 3s infinite;
        }

        @keyframes splash-pulse {
           0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
           50% { opacity: 1; }
           100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        .aero-splash h3 { font-weight: 800; letter-spacing: 4px; font-size: 14px; color: #fff; }
        .aero-splash p { font-size: 12px; color: #444; max-width: 300px; line-height: 1.6; }

        /* --- TABS PILL --- */
        .tabs-pill {
           background: rgba(10, 10, 10, 0.5);
           border: 1px solid rgba(255, 255, 255, 0.05);
           padding: 4px;
           border-radius: 20px;
           display: flex;
        }

        .tab {
           background: transparent;
           border: none;
           color: #555;
           padding: 6px 16px;
           border-radius: 16px;
           font-size: 11px;
           font-weight: 800;
           display: flex;
           align-items: center;
           gap: 8px;
           cursor: pointer;
           transition: 0.3s;
        }

        .tab.active { background: rgba(0, 255, 136, 0.1); color: #00ff88; }
        .tab:hover:not(.active) { color: #888; }

        .pro-action-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #888;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pro-action-btn:hover {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          border-color: #00ff88;
        }

        .close-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.8;
          transition: 0.2s;
        }
        .close-btn:hover { opacity: 1; transform: scale(1.05); }

        .studio-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          width: 100%;
        }

        .workspace.sidebar-collapsed {
          grid-template-columns: 0px 1fr;
        }

        .editor-pane {
          min-width: 0;
          height: 100%;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0a0a0a;
        }

        .sidebar-collapsed .editor-pane {
          width: 0;
          opacity: 0;
          pointer-events: none;
        }

        .viz-section {
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #020202;
          overflow: hidden;
        }

        .editor-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .editor-tab-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .monaco-wrapper {
          flex: 1;
          min-height: 0;
          position: relative;
        }

        .tabs-group {
          display: flex;
          background: rgba(255,255,255,0.03);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px;
          font-size: 11px;
          font-weight: 800;
          color: #555;
          border-radius: 7px;
          cursor: pointer;
          transition: 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tab:hover { color: #888; }
        .tab.active { 
          color: #00ff88; 
          background: rgba(0,255,136,0.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }

        .run-btn {
          background: linear-gradient(to bottom, #00ff88, #00cc6a);
          color: #000;
          border: none;
          padding: 8px 20px;
          border-radius: 10px;
          font-weight: 900;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(0,255,136,0.3);
          height: 32px;
        }
        .run-btn:hover:not(:disabled) { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(0,255,136,0.5); 
        }
        .run-btn.executing { background: #111; color: #444; cursor: wait; box-shadow: none; }

        /* --- Intelligence Terminal --- */
        .studio-terminal {
          height: 220px;
          background: #050505;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
        }

        .terminal-header {
          height: 32px;
          padding: 0 16px;
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .terminal-header span { font-size: 9px; font-weight: 800; color: #555; letter-spacing: 1px; }
        
        .terminal-status { margin-left: auto; font-size: 8px; font-weight: 900; color: #00ff88; display: flex; align-items: center; gap: 6px; }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 10px #00ff88; }

        .terminal-body { flex: 1; padding: 12px 16px; font-family: 'Fira Code', monospace; overflow-y: auto; }
        .t-log { font-size: 11px; margin-bottom: 4px; line-height: 1.4; }
        .t-time { color: #333; margin-right: 10px; }
        .t-log.muted { color: #444; }
        .t-log.success { color: #00ff88; }
        .t-log.error { color: #ef4444; }

        /* --- Iteration Pointers --- */
        .pointer-flag {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          z-index: 10;
        }

        .p-arrow {
          color: #fbbf24;
          font-size: 16px;
          filter: drop-shadow(0 0 5px rgba(251,191,36,0.8));
          animation: float 2s infinite ease-in-out;
          line-height: 1;
          margin-top: -4px;
        }

        .p-tag {
          background: #fbbf24;
          color: #000;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          white-space: nowrap;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .glow-icon { color: #00ff88; filter: blur(20px); opacity: 0.5; margin-bottom: 24px; }
        .empty-state h3 { color: #ddd; margin: 0 0 8px; }
        .empty-state p { font-size: 13px; max-width: 240px; }

        .viz-row {
          padding: 60px 20px 20px;
          margin-bottom: 40px;
          background: rgba(255,255,255,0.01);
          border-radius: 12px;
        }

        .array-container {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          padding-top: 40px;
          min-height: 200px;
        }

        .viz-graph-container {
          background: rgba(0, 255, 136, 0.01);
          border: 1px solid rgba(0, 255, 136, 0.1);
          backdrop-filter: blur(40px);
          border-radius: 24px;
          margin-bottom: 32px;
          padding: 32px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .graph-svg {
          width: 100%;
          height: 600px;
          filter: drop-shadow(0 0 20px rgba(0,255,136,0.05));
        }

        .pro-scrub {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }

        .pro-scrub::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,255,136,0.5);
        }

        .graph-svg circle {
          filter: drop-shadow(0 0 5px rgba(0,255,136,0.2));
          cursor: crosshair;
        }

        .graph-svg text {
          user-select: none;
          pointer-events: none;
          font-family: 'Syne', sans-serif;
        }

        .viz-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .viz-row .row-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 0 8px;
        }

        .row-header .icon-group {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.6);
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .row-header .stats-group {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
        }

        .array-container {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 12px;
          min-height: 220px;
          padding: 60px 40px 40px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          overflow-x: auto;
          position: relative;
          margin: 0 auto;
          width: fit-content;
          max-width: 100%;
        }

        .array-node {
          width: 50px;
          min-width: 50px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 8px 8px 4px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 12px;
          position: relative;
          transition: background 0.3s ease;
          box-shadow: inset 0 0 20px rgba(0, 255, 136, 0.05);
        }

        .array-node.pointed {
          background: rgba(0, 255, 136, 0.2);
          border-color: #00ff88;
        }

        .pointer-flag {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background: #00ff88;
          color: #000;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
          z-index: 10;
        }

        .pointer-flag::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #00ff88;
        }

        .array-node .val {
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          font-family: 'Fira Code', monospace;
        }

        .array-node .idx {
          position: absolute;
          bottom: -24px;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          font-weight: 700;
        }

        .vars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .var-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 12px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          overflow: hidden;
          max-height: 120px;
        }

        .var-card .v-name { font-size: 10px; font-weight: 700; color: #666; text-transform: uppercase; }
        .var-card .v-val { 
          font-size: 14px; 
          font-weight: 900; 
          color: #fff; 
          font-family: 'Fira Code'; 
          overflow-wrap: anywhere;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .code-highlight-bar {
          position: absolute;
          left: 0;
          right: 0;
          height: 19px;
          background: rgba(0, 255, 136, 0.1);
          border-left: 3px solid #00ff88;
          z-index: 1;
          pointer-events: none;
        }

        .viz-group-container {
          background: rgba(10, 10, 10, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .viz-group-container.secondary {
          background: rgba(0, 255, 136, 0.02);
          border-color: rgba(0, 255, 136, 0.1);
        }

        .viz-group-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          font-weight: 800;
          font-size: 11px;
          color: #666;
          letter-spacing: 1px;
        }

        .viz-group-header .v-count {
          margin-left: auto;
          color: #444;
        }

        /* --- Array Visualization --- */
        .array-viz-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 20px;
        }

        .pointer-row {
          height: 40px;
          position: relative;
          margin-bottom: 4px;
        }

        .ptr-indicator {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateX(-50%);
          z-index: 20;
        }

        .ptr-label {
          color: #000;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 2px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .array-cells-row {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .array-cell-pro {
          width: 40px;
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          position: relative;
        }

        .array-cell-pro .c-val {
          font-size: 14px;
          font-weight: 800;
          color: #fff;
          font-family: 'Fira Code', monospace;
        }

        .array-cell-pro .c-idx {
          position: absolute;
          bottom: -18px;
          font-size: 9px;
          font-weight: 700;
          color: #444;
        }

        /* --- Matrix Visualization --- */
        .pro-matrix {
          border-collapse: separate;
          border-spacing: 4px;
        }

        .matrix-cell-pro {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #ddd;
        }

        /* --- Scalars / Variable Cards --- */
        .scalars-viz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
          margin-top: 24px;
        }

        .scalar-card-pro {
          background: rgba(10, 10, 10, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .scalar-card-pro.hl {
          border-color: #fbbf24;
          background: rgba(251, 191, 36, 0.05);
        }

        .scalar-card-pro .s-label {
          font-size: 9px;
          font-weight: 800;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .scalar-card-pro .s-value {
          font-size: 15px;
          font-weight: 900;
          color: #fff;
          font-family: 'Fira Code', monospace;
        }

        /* --- Stdout Terminal --- */
        .viz-stdout-panel {
          margin-top: 40px;
          background: #000;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          overflow: hidden;
        }

        .viz-stdout-panel .vh-header {
          background: rgba(255,255,255,0.02);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 9px;
          font-weight: 800;
          color: #444;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .stdout-content {
          padding: 16px;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
          color: #00ff88;
          white-space: pre-wrap;
          margin: 0;
        }

        .rotate-90 { transform: rotate(90deg); }

        .viz-canvas::-webkit-scrollbar { width: 4px; height: 4px; }
        .viz-canvas::-webkit-scrollbar-thumb { background: rgba(0, 255, 136, 0.1); border-radius: 2px; }

        .playback-group button:hover:not(:disabled) { color: #fff; transform: scale(1.1); }
        .playback-group button:disabled { opacity: 0.3; cursor: not-allowed; }

        .play-btn {
          width: 58px;
          height: 58px;
          border-radius: 50% !important;
          background: #fff !important;
          color: #000 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0,0,0,0.5);
        }

        .play-btn:hover { transform: scale(1.1) rotate(5deg) !important; }
        .play-btn:active { transform: scale(0.95) !important; }

        .play-btn:hover { background: rgba(0, 255, 136, 0.2) !important; transform: scale(1.1) !important; }

        .speed-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 140px;
        }

        .speed-group span { font-size: 10px; font-weight: 800; color: #555; text-transform: uppercase; }

        .progress-track {
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255,255,255,0.05);
          cursor: pointer;
        }

        .progress-fill {
          height: 100%;
          background: #00ff88;
          box-shadow: 0 0 10px rgba(0,255,136,0.5);
          transition: width 0.1s linear;
        }

        @keyframes pulse {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.4; transform: scale(1); }
        }

        .matrix-grid-scroll {
          overflow: auto;
          max-height: 400px;
          padding: 20px;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
        }

        .matrix-table {
          border-collapse: separate;
          border-spacing: 4px;
          margin: 0 auto;
        }

        .matrix-cell {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 6px;
          text-align: center;
          vertical-align: middle;
          transition: 0.3s;
        }

        .matrix-cell:hover {
          background: rgba(0, 255, 136, 0.1);
          border-color: #00ff88;
        }

        .cell-inner {
          color: #fff;
          font-family: 'Fira Code', monospace;
          font-weight: 700;
          font-size: 13px;
        }

        /* Error Console Styles */
        .error-console {
          flex: 1;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: slideIn 0.3s ease-out;
        }

        .error-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ef4444;
          font-weight: 800;
          font-size: 13px;
          text-transform: uppercase;
        }

        .error-body {
          margin: 0;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          color: #fca5a5;
          background: rgba(0,0,0,0.3);
          padding: 16px;
          border-radius: 8px;
          white-space: pre-wrap;
          line-height: 1.5;
          border-left: 3px solid #ef4444;
        }

        .error-tip {
          font-size: 12px;
          color: #666;
          font-style: italic;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Question View Styles */
        .question-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          background: #000;
        }

        .q-card {
          padding: 32px;
          background: rgba(255,255,255,0.01);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .q-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .q-tag {
          font-size: 10px;
          font-weight: 800;
          color: #00ff88;
          letter-spacing: 1px;
          padding: 4px 8px;
          background: rgba(0,255,136,0.1);
          border-radius: 4px;
        }

        .q-diff {
          font-size: 10px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .q-diff.easy { color: #00ff88; background: rgba(0,255,136,0.1); }
        .q-diff.medium { color: #fbbf24; background: rgba(251,191,36,0.1); }
        .q-diff.hard { color: #ef4444; background: rgba(239,68,68,0.1); }

        .complexity-row {
          display: flex;
          gap: 24px;
          margin: 24px 0;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .comp-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .comp-item .label {
          font-size: 9px;
          font-weight: 800;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.5px;
        }

        .comp-item .val {
          font-family: 'Fira Code', monospace;
          font-size: 14px;
          color: #00ff88;
          font-weight: 600;
        }

        .q-card h2 {
          font-size: 32px;
          font-weight: 900;
          margin: 0 0 12px;
          letter-spacing: -1px;
        }

        .q-diff {
          font-size: 11px;
          font-weight: 700;
          background: rgba(255,191,36,0.1);
          color: #fbbf24;
          padding: 4px 12px;
          border-radius: 6px;
          display: inline-block;
          margin-bottom: 32px;
        }

        .q-section {
          margin-bottom: 32px;
        }

        .q-section h3 {
          font-size: 14px;
          font-weight: 800;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .q-section p {
          font-size: 15px;
          line-height: 1.6;
          color: #aaa;
        }

        .q-section.highlight {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 24px;
          border-radius: 12px;
        }

        .q-section.highlight p {
          color: #eee;
          font-weight: 500;
        }

        .start-btn {
          margin-top: 16px;
          background: #fff;
          color: #000;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .start-btn:hover {
          background: #00ff88;
          transform: translateX(5px);
        }

        /* Global Classes for Editor */
        :global(.current-execution-line) {
          background: rgba(0, 255, 136, 0.15) !important;
          border-left: 2px solid #00ff88;
        }

        :global(.current-execution-margin) {
          background: #00ff88;
          width: 2px !important;
          margin-left: 4px;
        }
        .market-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .market-modal {
          width: 100%;
          max-width: 1000px;
          max-height: 85vh;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8);
        }

        .market-header {
          padding: 32px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
        }

        .m-title-group h2 { font-size: 28px; font-weight: 900; margin: 0 0 4px; color: #00ff88; }
        .m-title-group span { color: #666; font-size: 14px; font-weight: 600; }

        .close-m-btn {
          background: rgba(255,255,255,0.05);
          border: none;
          color: #888;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .close-m-btn:hover { background: #ef4444; color: #fff; }

        .market-search {
          padding: 0 40px 32px;
          margin-top: -16px;
          display: flex;
          gap: 16px;
        }

        .m-input-area {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 16px;
          color: #444;
          transition: 0.3s;
        }
        .m-input-area:focus-within { border-color: #00ff88; background: rgba(0,255,136,0.05); color: #00ff88; }
        .m-input-area input {
          flex: 1;
          height: 60px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          outline: none;
        }

        .m-search-btn {
          background: #00ff88;
          color: #000;
          border: none;
          padding: 0 32px;
          border-radius: 16px;
          font-weight: 900;
          font-size: 15px;
          cursor: pointer;
          transition: 0.3s;
        }
        .m-search-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,255,136,0.3); }
        .m-search-btn:disabled { opacity: 0.5; cursor: wait; }

        .market-body {
          flex: 1;
          overflow-y: auto;
          padding: 0 40px 40px;
        }

        .m-results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .m-card {
           background: rgba(255,255,255,0.02);
           border: 1px solid rgba(255,255,255,0.05);
           border-radius: 20px;
           padding: 24px;
           transition: 0.3s;
        }
        .m-card:hover { border-color: #00ff88; background: rgba(0,255,136,0.02); }

        .m-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .m-card h3 { font-size: 18px; font-weight: 800; margin: 0; color: #fff; }
        .m-tag { font-size: 10px; font-weight: 800; color: #00ff88; background: rgba(0,255,136,0.1); padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }

        .m-card p {
          color: #888;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 24px;
        }

        .m-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .m-diff { font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; }
        .m-diff.easy { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .m-diff.medium { background: rgba(234, 179, 8, 0.1); color: #eab308; }
        .m-diff.hard { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .m-actions { display: flex; gap: 12px; }
        .m-view-btn {
          background: rgba(255,255,255,0.05);
          color: #aaa;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .m-viz-btn {
          background: #00ff88;
          color: #000;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
        }

        .m-loading {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #00ff88;
          gap: 20px;
        }
        .m-loading p { font-weight: 700; font-size: 14px; color: #666; }

        .m-empty {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #222;
          gap: 16px;
        }
        .m-empty h3 { color: #444; margin: 0; }
        .m-empty p { font-size: 13px; max-width: 300px; }
        .new-algo-btn {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 136, 255, 0.1));
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: #00ff88;
          width: auto;
          height: 36px;
          padding: 0 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .new-algo-btn:hover {
          background: #00ff88;
          color: #000;
          border-color: #00ff88;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
        }

        .new-algo-btn.active {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .nav-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.08);
          margin: 0 8px;
        }

        .side-nav-divider {
          width: 24px;
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 12px 0;
        }
      `}</style>
    </motion.div>
  );
}
