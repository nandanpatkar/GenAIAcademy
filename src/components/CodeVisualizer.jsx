import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { 
  Handle, Position, Background, Controls, 
  MarkerType, useNodesState, useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, 
  Terminal, Code, Layout, Settings, BookOpen, 
  ChevronRight, Search, Activity, Cpu, Sparkles, X,
  Monitor, Info, Zap, Layers, Share2, Download,
  Compass, Grid, Eye, PanelLeftClose, PanelLeftOpen, Plus, Cloud,
  Minimize2, Maximize2, Columns, Grid3X3, Box, RotateCw, ChevronLeft,
  ChevronDown, RefreshCcw, MoreHorizontal
} from 'lucide-react';
import { ALGO_EXAMPLES } from '../data/algoExamples';

// --- Pyodide Singleton ---
let _pyodideInstance = null;
let _pyodidePromise = null;

async function getPyodide() {
  if (_pyodideInstance) return _pyodideInstance;
  if (_pyodidePromise) return _pyodidePromise;
  
  _pyodidePromise = (async () => {
    try {
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        await new Promise((resolve) => { script.onload = resolve; document.body.appendChild(script); });
      }
      _pyodideInstance = await window.loadPyodide({ 
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" 
      });
      return _pyodideInstance;
    } catch (err) {
      _pyodidePromise = null;
      throw err;
    }
  })();
  return _pyodidePromise;
}

const TRACER_TEMPLATE = `
import sys, json, io, collections

_stdout_capture = io.StringIO()
_real_stdout = sys.stdout
sys.stdout = _stdout_capture

class Tracer:
    def __init__(self, limit=1000):
        self.frames = []
        self.step_count = 0
        self.limit = limit
        self.prev_locals = {}
        self.EXCLUDE = {
            'sys','json','io','Tracer','tracer','__name__',
            '__doc__','__builtins__','__spec__','__loader__','collections','trace_output'
        }

    def serialize_value(self, v):
        try:
            if isinstance(v, (int, float, bool, str, type(None))):
                return {'type': type(v).__name__, 'value': v}
            elif isinstance(v, list):
                return {'type': 'list', 'value': [self.serialize_value(i) for i in v[:30]]}
            elif isinstance(v, dict):
                return {'type': 'dict', 'value': {str(k): self.serialize_value(vv) for k,vv in list(v.items())[:20]}}
            elif isinstance(v, (tuple, set)):
                return {'type': type(v).__name__, 'value': [self.serialize_value(i) for i in list(v)[:30]]}
            elif hasattr(v, '__name__'):
                return {'type': 'function', 'value': f'<function {v.__name__}>'}
            else:
                return {'type': 'object', 'value': f'<{type(v).__name__} object>'}
        except:
            return {'type': 'error', 'value': 'unserializable'}

    def get_concise_repr(self, v):
        try:
            if isinstance(v, (int, float, bool, str, type(None))): return repr(v)
            if isinstance(v, list): return '[' + ', '.join([self.get_concise_repr(i) for i in v[:10]]) + (', ...' if len(v) > 10 else '') + ']'
            if isinstance(v, dict): return '{...}'
            return f'<{type(v).__name__}>'
        except: return '...'

    def get_call_stack(self, frame):
        stack = []
        f = frame
        depth = 0
        while f and depth < 8:
            if f.f_code.co_filename != '<exec>':
                f = f.f_back
                continue
            
            name = f.f_code.co_name
            if name in ('trace_hook', 'Tracer', 'serialize_value', 'get_call_stack'):
                f = f.f_back
                continue
            
            # Identify arguments for the header
            arg_count = f.f_code.co_argcount
            arg_names = f.f_code.co_varnames[:arg_count]
            arg_vals = [self.get_concise_repr(f.f_locals.get(name)) for name in arg_names]
            
            locals_clean = {
                k: self.serialize_value(v)
                for k, v in f.f_locals.items()
                if k not in self.EXCLUDE and not k.startswith('_') and k != 'self'
            }
            stack.append({
                'func': name,
                'args': ', '.join(arg_vals),
                'line': f.f_lineno,
                'locals': locals_clean
            })
            f = f.f_back
            depth += 1
        return stack

    def trace_hook(self, frame, event, arg):
        if self.step_count >= self.limit: return None
        if event not in ('line', 'call', 'return'): return self.trace_hook
        if frame.f_code.co_filename != '<exec>': return self.trace_hook

        self.step_count += 1
        curr_key = id(frame)
        curr_locals_repr = {k: repr(v) for k, v in frame.f_locals.items() if k not in self.EXCLUDE}
        prev = self.prev_locals.get(curr_key, {})
        changed = [k for k in curr_locals_repr if curr_locals_repr.get(k) != prev.get(k)]
        self.prev_locals[curr_key] = curr_locals_repr

        self.frames.append({
            'step': self.step_count,
            'event': event,
            'line': frame.f_lineno,
            'func': frame.f_code.co_name,
            'call_stack': self.get_call_stack(frame),
            'changed_vars': changed,
            'stdout': _stdout_capture.getvalue(),
            'return_value': self.get_concise_repr(arg) if event == 'return' else None
        })
        return self.trace_hook

tracer = Tracer()
sys.settrace(tracer.trace_hook)
try:
{{USER_CODE}}
finally:
    sys.settrace(None)
    sys.stdout = _real_stdout
    trace_output = json.dumps(tracer.frames)
`;

// --- Custom Nodes ---

const MainBlockNode = ({ data }) => (
  <div className="p-node main-node">
    <Handle type="source" position={Position.Right} id="r" style={{ top: '50%', background: '#60a5fa', opacity: 0 }} />
    <div className="p-node-header">Main Block</div>
    <div className="p-node-body">
      <div className="p-section-label">Variables</div>
      <div className="p-table">
        {Object.entries(data.locals).length > 0 ? (
          Object.entries(data.locals).map(([k, v]) => (
            <div key={k} className="p-row">
              <span className="p-key">{k}</span>
              <span className="p-val"><ValueRenderer val={v} /></span>
            </div>
          ))
        ) : (
          <div className="p-row empty">None</div>
        )}
      </div>
    </div>
  </div>
);

const FunctionFrameNode = ({ data }) => (
  <div className={`p-node func-node ${data.isActive ? 'active' : ''}`}>
    <Handle type="target" position={Position.Left} id="l" style={{ top: '50%', opacity: 0 }} />
    <Handle type="target" position={Position.Top} id="t" style={{ left: '50%', opacity: 0 }} />
    <Handle type="source" position={Position.Bottom} id="b" style={{ left: '50%', opacity: 0 }} />
    
    <div className="p-node-header">
      <span className="p-badge">function</span>
      <span className="p-func-name">{data.func}({data.args})</span>
    </div>
    <div className="p-node-body">
      <div className="p-table">
        {Object.entries(data.locals).map(([k, v]) => (
          <div key={k} className={`p-row ${data.changedVars?.includes(k) ? 'p-flash' : ''}`}>
            <span className="p-key">{k}</span>
            <span className="p-val"><ValueRenderer val={v} /></span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const nodeTypes = {
  mainBlock: MainBlockNode,
  functionFrame: FunctionFrameNode
};

export default function CodeVisualizer({ savedAlgos = [], onSaveAlgo, onClose }) {
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [code, setCode] = useState(ALGO_EXAMPLES[0].code);
  const [trace, setTrace] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(500);
  const [activeTab, setActiveTab] = useState('trace'); 

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const TRACE_OFFSET = useMemo(() => {
    return TRACER_TEMPLATE.split('{{USER_CODE}}')[0].split('\n').length - 1;
  }, []);

  const currentFrame = trace[currentFrameIdx] || null;

  useEffect(() => {
    getPyodide().then(setPyodide).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!currentFrame) { setNodes([]); setEdges([]); return; }

    const stack = [...currentFrame.call_stack].reverse();
    const newNodes = stack.map((frame, idx) => {
      let x = 20, y = 200;
      if (idx === 1) { x = 400; y = 80; }
      if (idx > 1) { x = 400; y = 80 + (idx - 1) * 240; }

      return {
        id: `frame-${idx}`,
        type: frame.func === '<module>' ? 'mainBlock' : 'functionFrame',
        position: { x, y },
        data: { 
          ...frame, 
          isActive: idx === stack.length - 1,
          changedVars: idx === stack.length - 1 ? currentFrame.changed_vars : []
        }
      };
    });

    const newEdges = [];
    for (let i = 0; i < stack.length - 1; i++) {
        const isRecursion = i >= 1;
        newEdges.push({
          id: `e-${i}-${i+1}`,
          source: `frame-${i}`,
          target: `frame-${i+1}`,
          sourceHandle: isRecursion ? 'b' : 'r',
          targetHandle: isRecursion ? 't' : 'l',
          animated: true,
          style: { stroke: '#4b5563', strokeDasharray: '4,4', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#4b5563', size: 10 },
          label: isRecursion ? '' : stack[i+1].func + '()'
        });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [currentFrameIdx, currentFrame]);

  useEffect(() => {
    if (!isPlaying || !trace.length) return;
    if (currentFrameIdx >= trace.length - 1) { setIsPlaying(false); return; }
    const timer = setTimeout(() => setCurrentFrameIdx(prev => prev + 1), playbackSpeed);
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIdx, playbackSpeed, trace.length]);

  const runCode = async () => {
    if (!pyodide) return;
    setIsExecuting(true); setIsPlaying(false); setTrace([]); setCurrentFrameIdx(-1);
    try {
      const indentedCode = code.split('\n').map(l => '    ' + l).join('\n');
      const wrappedCode = TRACER_TEMPLATE.replace('{{USER_CODE}}', indentedCode);
      
      // Use a fresh dictionary for every run to prevent global scope contamination
      const customGlobals = pyodide.runPython("dict()");
      await pyodide.runPythonAsync(wrappedCode, { globals: customGlobals });
      
      const output = customGlobals.get('trace_output');
      setTrace(JSON.parse(output));
      setCurrentFrameIdx(0);
      
      // Cleanup
      customGlobals.delete();
    } finally { setIsExecuting(false); }
  };

  const getExplanationJSX = () => {
    if (!currentFrame) return <span>Ready to simulate. Press <b>RUN</b> to begin.</span>;
    const { event, func, changed_vars, call_stack } = currentFrame;
    const activeLocals = call_stack[0]?.locals || {};
    if (event === 'call') return <span>Calling function <b>{func}()</b>. Initializing local scope.</span>;
    if (event === 'return') return <span>Finishing <b>{func}()</b> execution. Returning control to caller.</span>;
    if (changed_vars.length > 0) {
      const v = changed_vars[0];
      const val = JSON.stringify(activeLocals[v]?.value);
      return <span>The value <b>{val}</b> is assigned to the variable <b>{v}</b>.</span>;
    }
    return <span>Executing logic inside <b>{func === '<module>' ? 'Main Block' : func + '()'}</b>.</span>;
  };

  return (
    <motion.div className="p-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="p-header">
        <div className="p-header-left">
           <div className="p-badge-group">
              <div className="p-pill dropdown">Python <ChevronDown size={12} /></div>
              <div className="p-pill">{ALGO_EXAMPLES.find(ex => ex.code === code)?.title || "General"}</div>
           </div>
        </div>

        <div className="p-header-center">
           <div className="p-controls">
              <button disabled={currentFrameIdx <= 0} onClick={() => setCurrentFrameIdx(i => i - 1)}><ChevronLeft size={18} /> Prev Step</button>
              <div className="p-divider" />
              <button className="p-play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                 {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                 <div className="p-progress" style={{ width: `${((currentFrameIdx+1)/(trace.length || 1))*100}%` }} />
              </button>
              <div className="p-step-info">Step {currentFrameIdx + 1} of {trace.length || 0}</div>
              <div className="p-speed-group">
                 {[1000, 500, 250].map(s => (
                   <button key={s} className={playbackSpeed === s ? 'active' : ''} onClick={() => setPlaybackSpeed(s)}>
                     {s === 1000 ? '0.5x' : s === 500 ? '1x' : '2x'}
                   </button>
                 ))}
              </div>
              <div className="p-divider" />
              <button disabled={currentFrameIdx >= trace.length - 1} onClick={() => setCurrentFrameIdx(i => i + 1)}>Next Step <ChevronRight size={18} /></button>
           </div>
        </div>

        <div className="p-header-right">
           <button className="p-reset-btn" onClick={() => { setTrace([]); setCurrentFrameIdx(-1); setIsPlaying(false); }}>
              <RotateCcw size={14} /> Reset
           </button>
           <button className="p-run-btn" onClick={runCode} disabled={isExecuting}>
              {isExecuting ? <RotateCw className="spin" size={14} /> : <Play size={14} fill="currentColor" />}
              <span>RUN</span>
           </button>
           <button className="p-close" onClick={onClose}><X size={18} /></button>
        </div>
      </header>

      {isLoading ? (
        <div className="p-loader">
          <Sparkles className="spin" size={40} />
          <p>INITIALIZING_VISUALIZER...</p>
        </div>
      ) : (
        <main className="p-workspace">
          <div className="p-side p-editor-side">
            <div className="p-tabs">
               <button className={activeTab === 'trace' ? 'active' : ''} onClick={() => setActiveTab('trace')}>Simulation</button>
               <button className={activeTab === 'code' ? 'active' : ''} onClick={() => setActiveTab('code')}>Editor</button>
            </div>
            <div className="p-pane">
              {activeTab === 'code' ? (
                <Editor height="100%" theme="vs-dark" defaultLanguage="python" value={code} onChange={setCode} options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'Fira Code', monospace", padding: { top: 20 } }} />
              ) : (
                <div className="p-trace-view mini-scrollbar">
                  <CodePanel code={code} currentLine={currentFrame?.line ? currentFrame.line - TRACE_OFFSET : -1} />
                </div>
              )}
            </div>
          </div>

          <div className="p-side p-canvas-side">
            <div className="p-canvas">
               <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} style={{ background: 'transparent' }}>
                 <Background color="#1a1a1a" gap={24} />
                 <div className="p-terminal">
                    <div className="pt-header"><Terminal size={12} /> Output</div>
                    <div className="pt-body">{(currentFrame?.stdout || '').split('\n').filter(Boolean).map((l, i) => <div key={i} className="pt-line"><span>&gt;</span>{l}</div>)}</div>
                 </div>
               </ReactFlow>
            </div>

            <div className="p-explanation">
               <div className="px-meta">Explanation of this code:</div>
               <div className="px-body">
                  <div className="px-snippet">
                     <span className="px-ln">Ln {currentFrame?.line ? currentFrame.line - TRACE_OFFSET : '--'}</span>
                     <span className="px-txt">{currentFrame?.event === 'line' ? code.split('\n')[currentFrame.line - TRACE_OFFSET - 1] : '---'}</span>
                  </div>
                  <motion.div key={currentFrameIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="px-desc">
                    {getExplanationJSX()}
                  </motion.div>
               </div>
            </div>
          </div>
        </main>
      )}

      <style>{`
        .p-overlay { position: fixed; inset: 0; z-index: 10000; background: #050505; color: #fff; display: flex; flex-direction: column; font-family: var(--font), sans-serif; }
        .p-header { height: 72px; border-bottom: 1px solid #111; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: #050505; }
        .p-badge-group { display: flex; gap: 8px; }
        .p-pill { background: #111; border: 1px solid #222; padding: 6px 12px; border-radius: 8px; color: #888; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .p-pill.dropdown { cursor: pointer; color: #fff; }

        .p-controls { background: #0a0a0a; border: 1px solid #222; border-radius: 12px; display: flex; align-items: center; padding: 4px; gap: 4px; }
        .p-controls button { padding: 8px 16px; font-size: 11px; font-weight: 800; color: #666; display: flex; align-items: center; gap: 8px; border-radius: 8px; }
        .p-controls button:hover:not(:disabled) { color: #fff; background: #111; }
        .p-divider { width: 1px; height: 24px; background: #222; margin: 0 4px; }
        
        .p-play-btn { width: 36px; height: 36px; position: relative; color: #fff !important; overflow: hidden; border: 1px solid #333 !important; }
        .p-progress { position: absolute; bottom: 0; left: 0; height: 2px; background: var(--neon); opacity: 0.5; transition: 0.3s; }
        .p-step-info { font-size: 11px; font-weight: 900; color: #ddd; white-space: nowrap; padding: 0 16px; }
        .p-speed-group { display: flex; gap: 2px; background: #111; padding: 2px; border-radius: 6px; }
        .p-speed-group button { width: 32px; height: 28px; padding: 0; justify-content: center; color: #444; }
        .p-speed-group button.active { color: var(--neon); background: rgba(0,255,136,0.05); }

        .p-reset-btn { border: 1px solid rgba(248,113,113,0.2); color: #f87171; padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
        .p-run-btn { background: var(--neon); color: #000; padding: 8px 24px; border-radius: 8px; font-weight: 900; font-size: 11px; display: flex; align-items: center; gap: 10px; }
        .p-close { color: #444; margin-left: 12px; }

        .p-workspace { flex: 1; display: grid; grid-template-columns: 480px 1fr; overflow: hidden; }
        .p-side { display: flex; flex-direction: column; overflow: hidden; }
        .p-editor-side { border-right: 1px solid #111; background: #080808; }
        .p-tabs { display: flex; border-bottom: 1px solid #111; }
        .p-tabs button { flex: 1; padding: 14px; font-size: 10px; font-weight: 900; color: #444; border-bottom: 2px solid transparent; }
        .p-tabs button.active { color: #fff; border-color: var(--neon); background: #050505; }
        .p-pane { flex: 1; overflow: hidden; }

        .p-trace-view { height: 100%; padding: 24px 0; overflow-y: auto; }
        .ct-line { display: flex; font-family: var(--mono); font-size: 13px; line-height: 28px; color: #333; position: relative; }
        .ct-line.active { color: #fff; background: rgba(0,255,136,0.03); }
        .l-num { width: 52px; text-align: right; padding-right: 18px; font-size: 11px; color: #222; }
        .l-ptr-svg { position: absolute; left: 0; top: 0; width: 48px; height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 2px; }
        .l-txt { white-space: pre; }

        .p-canvas-side { background: #050505; }
        .p-canvas { flex: 1; position: relative; }
        .p-terminal { position: absolute; top: 20px; left: 20px; width: 260px; background: #0a0a0a; border: 1px solid #222; border-radius: 10px; z-index: 100; overflow: hidden; opacity: 0.9; }
        .pt-header { padding: 8px 12px; font-size: 10px; font-weight: 800; color: #444; background: #111; border-bottom: 1px solid #222; display: flex; align-items: center; gap: 8px; }
        .pt-body { max-height: 140px; overflow-y: auto; padding: 12px; font-family: var(--mono); font-size: 11px; }
        .pt-line { display: flex; gap: 8px; color: var(--neon); margin-bottom: 3px; }
        .pt-line span { opacity: 0.3; }

        .p-explanation { height: 220px; background: #080808; border-top: 1px solid #111; padding: 32px 64px; }
        .px-meta { font-size: 10px; font-weight: 900; color: #444; letter-spacing: 1px; margin-bottom: 24px; }
        .px-body { display: flex; flex-direction: column; gap: 20px; }
        .px-snippet { display: flex; align-items: center; gap: 20px; font-family: var(--mono); font-size: 14px; color: var(--neon); border-left: 4px solid var(--neon); background: rgba(0,255,136,0.02); padding: 12px 24px; border-radius: 8px; }
        .px-ln { color: #333; font-size: 11px; }
        .px-desc { color: #888; font-size: 16px; line-height: 1.6; max-width: 1000px; }
        .px-desc b { color: #fff; font-weight: 800; padding: 0 4px; }

        .p-node { background: #0d0d0d; border: 1px dashed #333 !important; border-radius: 12px; width: 320px; color: #fff; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
        .p-node.active { border-color: var(--neon) !important; box-shadow: 0 0 25px rgba(0,255,136,0.15); }
        .p-node-header { padding: 14px 18px; font-size: 13px; font-weight: 800; border-bottom: 1px solid #1a1a1a; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.02); }
        .p-badge { font-size: 9px; color: #666; border: 1px solid #333; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .p-node-body { padding: 0; }
        .p-section-label { padding: 10px 18px; font-size: 10px; color: #444; font-weight: 900; background: #0f0f0f; border-bottom: 1px solid #111; }
        .p-table { display: flex; flex-direction: column; }
        .p-row { display: grid; grid-template-columns: 120px 1fr; padding: 10px 18px; border-bottom: 1px solid #111; font-size: 12px; }
        .p-row:last-child { border-bottom: none; }
        .p-flash { animation: eb-flash 1.2s ease; }
        @keyframes eb-flash { 0% { background: rgba(0,255,136,0.2); } 100% { background: transparent; } }
        .p-key { color: #888; font-family: var(--mono); }
        .p-val { font-family: var(--mono); color: #ddd; }

        .mini-scrollbar::-webkit-scrollbar { width: 4px; }
        .mini-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}

// --- Sub-Components ---

function CodePanel({ code, currentLine }) {
  const lines = code.split('\n');
  return (
    <div className="code-trace-list">
      {lines.map((line, i) => (
        <div key={i} className={`ct-line ${i === currentLine - 1 ? 'active' : ''}`}>
          <div className="l-num">{i + 1}</div>
          {i === currentLine - 1 && (
            <motion.div layoutId="gutter-ptr" className="l-ptr-svg">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                 <path d="M2 1L10 6L2 11V1Z" fill="#00ff88" />
               </svg>
            </motion.div>
          )}
          <div className="l-txt">{line}</div>
        </div>
      ))}
    </div>
  );
}

function ValueRenderer({ val }) {
  const { type, value } = val;
  if (type === 'list' && Array.isArray(value)) {
    return <span style={{ color: '#60a5fa' }}>[{value.map(i => i.value).join(', ')}]</span>;
  }
  const color = type === 'int' ? '#60a5fa' : type === 'str' ? '#00ff88' : type === 'float' ? '#fbbf24' : '#f87171';
  return <span style={{ color }}>{String(value)}</span>;
}
