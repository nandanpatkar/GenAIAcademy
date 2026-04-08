import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import ReactFlow, {
  addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState,
  Handle, Position, BackgroundVariant, MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  X, Play, BarChart2, ChevronDown, ChevronRight, Trash2, Zap,
  Globe, Network, Server, Database, MessageSquare, Activity,
  Shield, GitBranch, Clock, Search, Archive, HardDrive, Radio,
  Lock, Layers, Waves, Bell, Share2, TrendingUp, Warehouse,
  MapPin, FolderOpen, Megaphone, Fingerprint, Hash, Settings,
  ShieldAlert, ShieldOff, ShieldCheck, Box, Brain, Compass,
  Router, Cloudy, KeyRound, Users, Info, AlertCircle,
  RefreshCw, BookOpen, Target, ChevronLeft, Cpu, Timer,
  Plus, Minus, CheckCircle, XCircle, Lightbulb, TrendingDown, PanelLeft,
} from "lucide-react";
import { getConceptByComponentId } from "./data/sdsConceptLibrary";
import { TRADEOFF_CARDS } from "./data/sdsTradeoffCards";
import { LEARNING_PATH, PROBLEM_CONCEPTS } from "./data/sdsLearningPath";
import { PROBLEMS } from "./data/sdsProblems";
import { SYSTEM_COMPONENTS, COMPONENT_CATEGORIES, getComponentById } from "./data/sdsComponents";
import { runSimulation, scoreDesign } from "./engine/sdsSimulator";
import { Maximize2, ExternalLink, Book, GraduationCap, ArrowRight } from "lucide-react";

// ── Theme (premium indigo/violet) ────────────────────────────────────────────
const G = "#818cf8";          // primary indigo
const G2 = "rgba(129,140,248,0.10)";
const G3 = "rgba(129,140,248,0.22)";
const BG = "#0a0c10";         // main bg — pure near-black
const BG2 = "#12151c";        // panel bg
const BG3 = "#1a1e2a";        // card bg
const BORDER = "#252a38";
const TEXT = "#e2e8f0";
const TEXT2 = "#7c8899";
const TEXT3 = "#3e4556";

// ── Icon registry ─────────────────────────────────────────────────────────────
const ICON_MAP = {
  Globe, Network, Server, Database, MessageSquare, Activity, Shield,
  GitBranch, Clock, Search, Archive, HardDrive, Radio, Lock, Layers,
  Waves, Bell, Share2, TrendingUp, Warehouse, MapPin, FolderOpen,
  Megaphone, Fingerprint, Hash, Settings, ShieldAlert, ShieldOff,
  ShieldCheck, Box, Brain, Compass, Router, Cloudy, KeyRound, Users, Zap, Cpu,
  Maximize2, ExternalLink, Book, GraduationCap, ArrowRight
};
const IC = ({ name, size = 14, color = TEXT2 }) => { const C = ICON_MAP[name] || Box; return <C size={size} color={color} />; };

const STATUS_COLOR = {
  healthy:  { bg:"rgba(129,140,248,.10)", border:"rgba(129,140,248,.32)", text: G,        label:"Healthy"  },
  warning:  { bg:"rgba(245,158,11,.10)",  border:"rgba(245,158,11,.30)",  text:"#f59e0b", label:"Warning"  },
  critical: { bg:"rgba(239,68,68,.10)",   border:"rgba(239,68,68,.30)",   text:"#ef4444", label:"Critical" },
  idle:     { bg:"rgba(62,69,86,.15)",    border:BORDER,                  text: TEXT3,    label:"Idle"     },
};

function fmtQPS(v) {
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v/1_000).toFixed(1)}K`;
  return `${Math.round(v)}`;
}

// ── Simulator Node ────────────────────────────────────────────────────────────
function SimNode({ id, data, selected }) {
  const comp    = getComponentById(data.componentId) || {};
  const color   = comp.color || "#64748b";
  const metrics = data.metrics;
  const st      = metrics ? (STATUS_COLOR[metrics.status] || STATUS_COLOR.idle) : null;

  return (
    <div 
      className={`
        ${st?.label === "Critical" ? "node-critical" : ""} 
        ${metrics?.utilization >= 1.0 ? "node-blast" : ""}
      `}
      style={{
      background: selected ? `linear-gradient(135deg,${color}18 0%,${BG} 100%)` : BG2,
      border: `1.5px solid ${selected ? color : st ? st.border : BORDER}`,
      borderRadius: 10, minWidth: 140, maxWidth: 180,
      boxShadow: selected ? `0 0 0 2px ${color}33,0 8px 24px rgba(0,0,0,.5)` : "0 4px 12px rgba(0,0,0,.3)",
      transition: "all .2s", fontFamily: "var(--font)", overflow: "hidden", cursor: "pointer",
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,${color},${color}44)` }} />
      <Handle type="target" position={Position.Left} style={{ background: color, border: `2px solid ${BG}`, width:10, height:10, left:-6 }} />
      <div style={{ padding:"10px 12px 8px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:`${color}20`, border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <IC name={comp.icon||"Box"} size={13} color={color} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:700, color:TEXT, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{data.label||comp.label}</div>
            <div style={{ fontSize:8.5, color, textTransform:"uppercase", letterSpacing:".05em", marginTop:1 }}>{comp.category}</div>
          </div>
        </div>
        {data.replicas > 1 && (
          <div style={{ fontSize:8, color:TEXT3, background:BG3, border:`1px solid ${BORDER}`, borderRadius:4, padding:"2px 6px", display:"inline-block", marginBottom:5 }}>
            {data.replicas}× replicas
          </div>
        )}
        {metrics && st && (
          <div style={{ background:st.bg, border:`1px solid ${st.border}`, borderRadius:6, padding:"5px 7px", marginTop:4 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:8, color:TEXT3 }}>QPS</span>
              <span style={{ fontSize:9, fontWeight:700, color:st.text }}>{fmtQPS(metrics.incomingQPS)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:8, color:TEXT3 }}>Latency</span>
              <span style={{ fontSize:9, fontWeight:700, color:TEXT2 }}>{metrics.latencyMs}ms</span>
            </div>
            <div style={{ height:3, background:BG, borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${Math.min(metrics.utilization*100,100)}%`, height:"100%", background:st.text, borderRadius:3, transition:"width .4s ease-out" }} />
            </div>
            <div style={{ fontSize:7.5, color:TEXT3, marginTop:2, textAlign:"right" }}>{Math.round(metrics.utilization*100)}%</div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background:color, border:`2px solid ${BG}`, width:10, height:10, right:-6 }} />
    </div>
  );
}

const NODE_TYPES = { simNode: SimNode };
let uid = 1;
const mkId = () => `sn_${uid++}_${Date.now()}`;

const CAT_COLOR = { networking:"#06b6d4", compute:"#22c55e", storage:"#3b82f6", messaging:"#f59e0b", infrastructure:"#8b5cf6" };

// ── Interview timer ───────────────────────────────────────────────────────────
function InterviewTimer({ seconds, onStop }) {
  const m = String(Math.floor(seconds/60)).padStart(2,"0");
  const s = String(seconds%60).padStart(2,"0");
  const pct = seconds / (45*60);
  const color = seconds < 5*60 ? "#ef4444" : seconds < 15*60 ? "#f59e0b" : "#818cf8";
  return (
    <div style={{ position:"fixed", top:16, right:24, zIndex:9999, background:BG2, border:`1px solid ${color}55`, borderRadius:12, padding:"10px 18px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 8px 32px rgba(0,0,0,.5)" }}>
      <div style={{ position:"relative", width:36, height:36 }}>
        <svg width={36} height={36} viewBox="0 0 36 36" style={{ transform:"rotate(-90deg)" }}>
          <circle cx={18} cy={18} r={15} fill="none" stroke={BG3} strokeWidth={3} />
          <circle cx={18} cy={18} r={15} fill="none" stroke={color} strokeWidth={3} strokeDasharray={`${Math.PI*2*15}`} strokeDashoffset={`${Math.PI*2*15*(1-pct)}`} strokeLinecap="round" style={{ transition:"stroke-dashoffset 1s linear" }} />
        </svg>
        <Timer size={12} color={color} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
      </div>
      <div>
        <div style={{ fontSize:9, color:TEXT3, textTransform:"uppercase", letterSpacing:".05em" }}>Interview Mode</div>
        <div style={{ fontSize:18, fontWeight:900, color, letterSpacing:"0.05em", lineHeight:1 }}>{m}:{s}</div>
      </div>
      <button onClick={onStop} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:6, color:TEXT3, padding:"4px 8px", cursor:"pointer", fontSize:10 }}>End</button>
    </div>
  );
}
// ── Full-Screen Reader ────────────────────────────────────────────────────────
function FullPageReader({ content, onClose }) {
  if (!content) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:10000, background:BG, display:"flex", flexDirection:"column", animation:"fadeIn .2s ease-out" }}>
      <div style={{ height:64, background:BG2, borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", padding:"0 32px", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:G2, border:`1px solid ${G3}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <BookOpen size={18} color={G} />
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:TEXT }}>{content.title}</div>
            <div style={{ fontSize:11, color:TEXT3, textTransform:"uppercase", letterSpacing:".05em" }}>{content.subtitle}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ width:40, height:40, borderRadius:20, background:BG3, border:`1px solid ${BORDER}`, color:TEXT2, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"48px 32px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          {content.type === "tradeoff" ? (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
               <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:16, padding:32 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:G, marginBottom:20 }}>{content.data.optionA.name}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:TEXT, marginBottom:16 }}>Pros</div>
                  <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                    {content.data.optionA.pros.map(p=><li key={p} style={{ display:"flex", gap:12, fontSize:15, color:TEXT2 }}><span style={{color:G}}>✓</span>{p}</li>)}
                  </ul>
                  <div style={{ fontSize:14, fontWeight:700, color:TEXT, margin:"24px 0 16px" }}>Cons</div>
                  <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                    {content.data.optionA.cons.map(c=><li key={c} style={{ display:"flex", gap:12, fontSize:15, color:TEXT2 }}><span style={{color:"#ef4444"}}>✗</span>{c}</li>)}
                  </ul>
               </div>
               <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:16, padding:32 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:"#3b82f6", marginBottom:20 }}>{content.data.optionB.name}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:TEXT, marginBottom:16 }}>Pros</div>
                  <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                    {content.data.optionB.pros.map(p=><li key={p} style={{ display:"flex", gap:12, fontSize:15, color:TEXT2 }}><span style={{color:"#3b82f6"}}>✓</span>{p}</li>)}
                  </ul>
                  <div style={{ fontSize:14, fontWeight:700, color:TEXT, margin:"24px 0 16px" }}>Cons</div>
                  <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                    {content.data.optionB.cons.map(c=><li key={c} style={{ display:"flex", gap:12, fontSize:15, color:TEXT2 }}><span style={{color:"#ef4444"}}>✗</span>{c}</li>)}
                  </ul>
               </div>
            </div>
          ) : (
            <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:16, padding:48, lineHeight:1.8 }}>
              {content.sections.map((sec, idx) => (
                <div key={idx} style={{ marginBottom:32 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:sec.color||G, textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>{sec.title}</div>
                  <div style={{ fontSize:16, color:TEXT, whiteSpace:"pre-wrap" }}>
                    {Array.isArray(sec.content) ? (
                      <ul style={{ listStyle:"none", padding:0 }}>
                        {sec.content.map((item, i) => (
                          <li key={i} style={{ marginBottom:12, display:"flex", gap:12 }}>
                            <span style={{ color:sec.color||G }}>•</span>
                            <span>{typeof item === "string" ? item : item.name + ": " + item.description}</span>
                          </li>
                        ))}
                      </ul>
                    ) : sec.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══ MAIN COMPONENT ════════════════════════════════════════════════════════════
export default function SystemDesignSimulator({ onClose }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfi, setRfi] = useState(null);
  const rfWrapper = useRef(null);

  // Left panel
  const [leftTab, setLeftTab]             = useState("problems");
  const [activeProblem, setActiveProblem] = useState(null);
  const [showProblemDetail, setShowProblemDetail] = useState(false);
  const [expandedHints, setExpandedHints] = useState({});
  const [compSearch, setCompSearch]       = useState("");
  const [catOpen, setCatOpen]             = useState({});
  const [conceptComp, setConceptComp]     = useState(null);
  const [problemMode, setProblemMode]     = useState("all"); // "all" or "path"
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  // Reader state
  const [readerContent, setReaderContent] = useState(null);
  const [tradeoffSearch, setTradeoffSearch] = useState("");

  // Right panel / inspector
  const [rightTab, setRightTab]           = useState("sim");
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Simulation
  const [simQPS, setSimQPS]               = useState(10000);
  const [simResult, setSimResult]         = useState(null);
  const [isSimRunning, setIsSimRunning]   = useState(false);
  const [scoreResult, setScoreResult]     = useState(null);

  // Interview mode
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewTime, setInterviewTime]     = useState(45 * 60);
  const timerRef = useRef(null);

  const [tradeoffsText, setTradeoffsText] = useState("");
  const [capacitySettings, setCapacitySettings] = useState({
    dau: 1000000,
    readsPerUser: 10,
    writesPerUser: 2,
    readSizeKb: 10,
    writeSizeKb: 5,
    storageMonths: 12
  });

  useEffect(() => {
    if (interviewActive) {
      timerRef.current = setInterval(() => {
        setInterviewTime(t => {
          if (t <= 1) { clearInterval(timerRef.current); setInterviewActive(false); return 0; }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [interviewActive]);

  const startInterview = () => { setInterviewTime(45*60); setInterviewActive(true); };

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const selectedComp = selectedNode ? getComponentById(selectedNode.data.componentId) : null;
  const concept = selectedComp ? getConceptByComponentId(selectedComp.id) : null;

  const edgeDef = { animated:true, style:{stroke:"#6366f1", strokeWidth:1.5}, markerEnd:{type:MarkerType.ArrowClosed, color:"#6366f1", width:12, height:12} };

  const onDragOver = useCallback(e => { e.preventDefault(); e.dataTransfer.dropEffect="move"; }, []);
  const onDrop = useCallback(e => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/sds-component");
    if (!raw || !rfi) return;
    const comp = JSON.parse(raw);
    const pos  = rfi.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes(ns => ns.concat({ id:mkId(), type:"simNode", position:pos,
      data:{ componentId:comp.id, label:comp.label, replicas:1, maxQPS:comp.maxQPS, latencyMs:comp.latencyMs, metrics:null }
    }));
    setSimResult(null); setScoreResult(null);
  }, [rfi, setNodes]);

  const onConnect = useCallback(params => setEdges(eds => addEdge({...params,...edgeDef}, eds)), [setEdges]);

  const onNodeClick = useCallback((_,node) => { setSelectedNodeId(node.id); setRightTab("inspector"); }, []);
  const onPaneClick = useCallback(() => { setSelectedNodeId(null); }, []);

  const updateReplicas = (id, val) => {
    setNodes(ns => ns.map(n => n.id===id ? {...n, data:{...n.data, replicas:Math.max(1,val)}} : n));
  };
  const deleteNode = (id) => {
    setNodes(ns => ns.filter(n => n.id!==id));
    setEdges(es => es.filter(e => e.source!==id && e.target!==id));
    setSelectedNodeId(null);
  };

  const runSim = useCallback(() => {
    if (!nodes.length) return;
    setIsSimRunning(true);
    setEdges(eds => eds.map(e => ({ ...e, animated: true })));
    
    // Simulate processing delay for smooth transition
    setTimeout(() => {
      const enriched = nodes.map(n => {
        const comp = getComponentById(n.data.componentId) || {};
        return { ...n, ...comp, id: n.id, componentId: n.data.componentId, replicas: n.data.replicas??1 };
      });
      const result   = runSimulation(enriched, edges, simQPS);
      setSimResult(result);
      setNodes(ns => ns.map(n => ({...n, data:{...n.data, metrics:result.nodeMetrics.get(n.id)||null}})));
      setScoreResult(scoreDesign(nodes.map(n=>({...n,componentId:n.data.componentId})), edges, activeProblem, result.nodeMetrics));
      setRightTab("sim");
      setIsSimRunning(false);
      
      // Stop edge animation after results are shown
      setTimeout(() => {
        setEdges(eds => eds.map(e => ({ ...e, animated: false })));
      }, 3000);
    }, 1500);
  }, [nodes, edges, simQPS, activeProblem, setNodes, setEdges]);

  const loadReference = useCallback(() => {
    if (!activeProblem?.referenceSolution) return;
    const {nodes:rn, edges:re} = activeProblem.referenceSolution;
    const fn = rn.map((n,i) => {
      const c = getComponentById(n.componentId);
      return { id:`ref_${i}`, type:"simNode", position:{x:n.x,y:n.y}, data:{componentId:n.componentId, label:c?.label||n.componentId, replicas:1, maxQPS:c?.maxQPS, latencyMs:c?.latencyMs, metrics:null} };
    });
    const idMap = {}; fn.forEach((f,i)=>{ idMap[rn[i].componentId]=f.id; });
    const fe = re.map((e,i)=>({id:`ref_e_${i}`, source:idMap[e.source], target:idMap[e.target],...edgeDef})).filter(e=>e.source&&e.target);
    setNodes(fn); setEdges(fe); setSimResult(null); setScoreResult(null);
    setTimeout(()=>rfi?.fitView({padding:.12}),100);
  }, [activeProblem, rfi, setNodes, setEdges]);

  const clearCanvas = () => { setNodes([]); setEdges([]); setSimResult(null); setScoreResult(null); setSelectedNodeId(null); };

  const filteredCats = useMemo(() =>
    COMPONENT_CATEGORIES.map(cat => ({
      ...cat, items: SYSTEM_COMPONENTS.filter(c => c.category===cat.key && (!compSearch||c.label.toLowerCase().includes(compSearch.toLowerCase())))
    })).filter(c=>c.items.length>0), [compSearch]);

  const verdictColor = v => v?.includes("Architect") ? "#f59e0b" : v?.includes("Excellent") ? G : v?.includes("Good") ? "#3b82f6" : v?.includes("Decent") ? "#8b5cf6" : "#ef4444";

  // Shared panel style
  const panelStyle = { background:BG2, border:`1px solid ${BORDER}` };

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, height:"100%", overflow:"hidden", background:BG, fontFamily:"var(--font)" }}>
      {interviewActive && <InterviewTimer seconds={interviewTime} onStop={()=>setInterviewActive(false)} />}
      {readerContent && <FullPageReader content={readerContent} onClose={()=>setReaderContent(null)} />}

      {/* ══ TOP BAR ══════════════════════════════════════════════════════════════ */}
      <div style={{ height:62, background:BG2, borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", padding:"0 20px", gap:14, flexShrink:0 }}>

        {/* Sidebar toggle */}
        <button
          onClick={() => setShowLeftPanel(p => !p)}
          title="Toggle Sidebar"
          style={{
            background: showLeftPanel ? BG3 : "transparent",
            border: `1px solid ${showLeftPanel ? BORDER : "transparent"}`,
            color: showLeftPanel ? TEXT : TEXT3,
            cursor:"pointer", borderRadius:7, width:30, height:30,
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0, transition:"all .15s",
          }}
        >
          <PanelLeft size={15} />
        </button>

        {/* Logo + Title */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:`linear-gradient(135deg,#818cf8,#6366f1)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 0 18px rgba(99,102,241,0.35)" }}>
            <Activity size={19} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize:24, fontWeight:800, color:TEXT, letterSpacing:"-0.5px", lineHeight:1.1 }}>System Design Simulator</div>
            <div style={{ fontSize:10, color:TEXT3, fontWeight:600 }}>{activeProblem ? `📌 ${activeProblem.title}` : "Drag components · Connect · Run Simulation"}</div>
          </div>
        </div>

        <div style={{ flex:1 }} />
        <span style={{ fontSize:9.5, color:TEXT3 }}>{nodes.length}n · {edges.length}e</span>

        {/* Interview mode */}
        {!interviewActive && (
          <button onClick={startInterview} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:7, color:TEXT2, fontSize:10, padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
            <Timer size={11} /> Interview Mode
          </button>
        )}

        {/* Run simulation */}
        <button onClick={runSim} disabled={!nodes.length||isSimRunning}
          style={{ background:`linear-gradient(135deg,#818cf8,#6366f1)`, border:"none", borderRadius:8, color:"#fff", fontSize:11, fontWeight:800, padding:"8px 18px", cursor:nodes.length?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:6, opacity:nodes.length?1:.5, boxShadow:"0 0 18px rgba(99,102,241,0.35)" }}>
          {isSimRunning ? <RefreshCw size={12} style={{animation:"spin 1s linear infinite"}} /> : <Play size={12} fill="#fff" />}
          Run Simulation
        </button>
        <button onClick={clearCanvas} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:7, color:TEXT3, padding:"7px 10px", cursor:"pointer" }}><Trash2 size={13} /></button>
        <button onClick={onClose} style={{ background:"none", border:"none", color:TEXT3, cursor:"pointer", padding:"4px 8px", lineHeight:1 }}><X size={18} /></button>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ══ LEFT PANEL ═══════════════════════════════════════════════════════════ */}
        {showLeftPanel && (
        <div style={{ width:260, minWidth:240, background:BG2, borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
          <div style={{ display:"flex", borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
            {[{id:"problems",icon:BookOpen,label:"Problems"},{id:"components",icon:Layers,label:"Components"},{id:"concepts",icon:Lightbulb,label:"Concepts"}].map(tab=>(
              <button key={tab.id} onClick={()=>setLeftTab(tab.id)} style={{ flex:1, background:"none", border:"none", borderBottom:`2px solid ${leftTab===tab.id?G:"transparent"}`, padding:"9px 4px", cursor:"pointer", fontSize:9.5, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:leftTab===tab.id?G:TEXT3, display:"flex", alignItems:"center", justifyContent:"center", gap:4, transition:"all .15s" }}>
                <tab.icon size={10} />{tab.label}
              </button>
            ))}
          </div>

          {/* ── Problems tab ── */}
          {leftTab==="problems" && (
            <div style={{ flex:1, overflowY:"auto" }}>
              {showProblemDetail && activeProblem ? (
                <div style={{ padding:14 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <button onClick={()=>setShowProblemDetail(false)} style={{ background:"none", border:"none", color:TEXT3, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:9.5 }}>
                      <ChevronLeft size={11} /> Back
                    </button>
                    <button onClick={() => setReaderContent({
                      title: activeProblem.title,
                      subtitle: "System Design Problem",
                      sections: [
                        { title: "Description", content: activeProblem.description },
                        { title: "Requirements", content: [
                            `Reads per sec: ${fmtQPS(activeProblem.requirements.readsPerSec)}`,
                            `Writes per sec: ${fmtQPS(activeProblem.requirements.writesPerSec)}`,
                            `Storage: ${activeProblem.requirements.storageGB}GB`,
                            `Latency: ${activeProblem.requirements.latencyMs}ms`
                          ] },
                        { title: "Constraints", content: activeProblem.constraints, color: "#f59e0b" },
                        { title: "Hints", content: activeProblem.hints.map(h => ({ name: h.title, description: h.content })), color: "#8b5cf6" }
                      ]
                    })} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:6, padding:"4px 8px", color:TEXT2, fontSize:9, display:"flex", alignItems:"center", gap:4, cursor:"pointer" }}>
                      <Maximize2 size={10} /> Full Screen
                    </button>
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color:TEXT, marginBottom:4 }}>{activeProblem.title}</div>
                  <span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:4, display:"inline-block", marginBottom:10,
                    background: activeProblem.difficulty==="Easy"?`${G}18`:activeProblem.difficulty==="Medium"?"rgba(245,158,11,.12)":"rgba(239,68,68,.12)",
                    color:activeProblem.difficulty==="Easy"?G:activeProblem.difficulty==="Medium"?"#f59e0b":"#ef4444" }}>
                    {activeProblem.difficulty}
                  </span>
                  <div style={{ fontSize:10, color:TEXT2, lineHeight:1.6, marginBottom:12 }}>{activeProblem.description}</div>
                  <div style={{ fontSize:9.5, fontWeight:700, color:G, marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>Requirements</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
                    {[["Reads/s",fmtQPS(activeProblem.requirements.readsPerSec)],["Writes/s",fmtQPS(activeProblem.requirements.writesPerSec)],
                      ["Storage",activeProblem.requirements.storageGB>=1000?(activeProblem.requirements.storageGB/1000).toFixed(0)+"TB":activeProblem.requirements.storageGB+"GB"],
                      ["Latency",`${activeProblem.requirements.latencyMs}ms`]].map(([k,v])=>(
                      <div key={k} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:6, padding:"6px 8px" }}>
                        <div style={{ fontSize:7.5, color:TEXT3, marginBottom:2 }}>{k}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:TEXT }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:9.5, fontWeight:700, color:G, marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>Constraints</div>
                  <ul style={{ listStyle:"none", padding:0, margin:"0 0 12px", display:"flex", flexDirection:"column", gap:5 }}>
                    {activeProblem.constraints.map((c,i)=>(
                      <li key={i} style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
                        <span style={{ color:G, marginTop:2, flexShrink:0 }}>•</span>
                        <span style={{ fontSize:9.5, color:TEXT2, lineHeight:1.5 }}>{c}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontSize:9.5, fontWeight:700, color:G, marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>Hints</div>
                  {activeProblem.hints.map((h,i)=>(
                    <div key={i} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:7, marginBottom:6, overflow:"hidden" }}>
                      <button onClick={()=>setExpandedHints(p=>({...p,[i]:!p[i]}))} style={{ width:"100%", background:"none", border:"none", padding:"8px 10px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:TEXT2 }}>💡 {h.title}</span>
                        {expandedHints[i]?<ChevronDown size={11} color={TEXT3}/>:<ChevronRight size={11} color={TEXT3}/>}
                      </button>
                      {expandedHints[i]&&<div style={{ padding:"0 10px 10px", fontSize:9.5, color:TEXT3, lineHeight:1.6 }}>{h.content}</div>}
                    </div>
                  ))}
                  <button onClick={loadReference} style={{ width:"100%", marginTop:8, background:G2, border:`1px solid ${G3}`, borderRadius:8, color:G, fontSize:10, fontWeight:700, padding:"9px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Target size={12} /> Load Reference Solution
                  </button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
                  <div style={{ display:"flex", background:BG3, borderBottom:`1px solid ${BORDER}`, padding:"4px" }}>
                    <button onClick={()=>setProblemMode("all")} style={{ flex:1, padding:"6px", borderRadius:6, background:problemMode==="all"?BG: "transparent", border:"none", color:problemMode==="all"?G:TEXT3, fontSize:9.5, fontWeight:700, cursor:"pointer" }}>All Problems</button>
                    <button onClick={()=>setProblemMode("path")} style={{ flex:1, padding:"6px", borderRadius:6, background:problemMode==="path"?BG: "transparent", border:"none", color:problemMode==="path"?G:TEXT3, fontSize:9.5, fontWeight:700, cursor:"pointer" }}>Learning Path</button>
                  </div>
                  <div style={{ flex:1, overflowY:"auto", padding:"10px" }}>
                    {problemMode === "all" ? (
                      ["Easy","Medium","Hard"].map(diff=>{
                        const probs = PROBLEMS.filter(p=>p.difficulty===diff);
                        const dc = diff==="Easy"?G:diff==="Medium"?"#f59e0b":"#ef4444";
                        return (
                          <div key={diff} style={{ marginBottom:14 }}>
                            <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:dc, marginBottom:7, paddingLeft:2 }}>{diff}</div>
                            {probs.map(p=>(
                              <div key={p.id} onClick={()=>{setActiveProblem(p);setShowProblemDetail(true);setExpandedHints({});}}
                                style={{ padding:"10px", borderRadius:8, marginBottom:5, cursor:"pointer", background:activeProblem?.id===p.id?`${G}10`:BG3, border:`1px solid ${activeProblem?.id===p.id?G:BORDER}`, transition:"all .15s" }}>
                                <div style={{ fontSize:11, fontWeight:700, color:TEXT, marginBottom:5 }}>{p.title}</div>
                                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                  {p.tags.map(t=><span key={t} style={{ fontSize:8, color:G, background:G2, border:`1px solid ${G3}`, borderRadius:3, padding:"1px 5px" }}>{t}</span>)}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      LEARNING_PATH.map(tier => (
                        <div key={tier.name} style={{ marginBottom:20 }}>
                          <div style={{ fontSize:11, fontWeight:800, color:G, marginBottom:2 }}>{tier.name}</div>
                          <div style={{ fontSize:9, color:TEXT3, marginBottom:10 }}>{tier.description}</div>
                          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            {tier.problemIds.map(pid => {
                              const p = PROBLEMS.find(x => x.id === pid);
                              if (!p) return null;
                              return (
                                <div key={pid} onClick={()=>{setActiveProblem(p);setShowProblemDetail(true);setExpandedHints({});}}
                                  style={{ padding:"10px", borderRadius:8, background:BG3, border:`1px solid ${BORDER}`, cursor:"pointer", opacity:1 }}>
                                  <div style={{ fontSize:10, fontWeight:700, color:TEXT }}>{p.title}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Components tab ── */}
          {leftTab==="components" && (
            <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"10px", borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
                <div style={{ position:"relative" }}>
                  <Search size={12} color={TEXT3} style={{ position:"absolute", left:10, top:9 }} />
                  <input value={compSearch} onChange={e=>setCompSearch(e.target.value)} placeholder="Search components..."
                    style={{ width:"100%", background:BG3, border:`1px solid ${BORDER}`, borderRadius:7, color:TEXT, fontSize:10.5, padding:"7px 10px 7px 28px", outline:"none", fontFamily:"var(--font)", boxSizing:"border-box" }} />
                </div>
              </div>
              <div style={{ flex:1, overflowY:"auto" }}>
                {filteredCats.map(cat=>{
                  const isOpen = !!catOpen[cat.key];
                  const cc = CAT_COLOR[cat.key]||"#64748b";
                  return (
                    <div key={cat.key}>
                      <button onClick={()=>setCatOpen(p=>({...p,[cat.key]:!isOpen}))}
                        style={{ width:"100%", background:"none", border:"none", padding:"8px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.style.background=BG3} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:20, height:20, borderRadius:5, background:`${cc}20`, border:`1px solid ${cc}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <IC name={cat.icon} size={10} color={cc} />
                          </div>
                          <span style={{ fontSize:11, fontWeight:600, color:isOpen?TEXT:TEXT2 }}>{cat.label}</span>
                          <span style={{ fontSize:8, color:TEXT3, background:BG3, borderRadius:4, padding:"1px 5px" }}>{cat.items.length}</span>
                        </div>
                        {isOpen?<ChevronDown size={11} color={TEXT3}/>:<ChevronRight size={11} color={TEXT3}/>}
                      </button>
                      {isOpen && cat.items.map(comp=>(
                        <div key={comp.id} draggable
                          onDragStart={e=>e.dataTransfer.setData("application/sds-component",JSON.stringify(comp))}
                          style={{ margin:"2px 8px", padding:"7px 10px", background:BG3, border:`1px solid ${BORDER}`, borderRadius:7, cursor:"grab", display:"flex", alignItems:"center", gap:8, transition:"all .12s", userSelect:"none" }}
                          onMouseEnter={e=>{e.currentTarget.style.background=`${comp.color}10`;e.currentTarget.style.borderColor=`${comp.color}55`;e.currentTarget.style.transform="translateX(2px)";}}
                          onMouseLeave={e=>{e.currentTarget.style.background=BG3;e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.transform="translateX(0)";}}>
                          <div style={{ width:22, height:22, borderRadius:5, background:`${comp.color}20`, border:`1px solid ${comp.color}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <IC name={comp.icon} size={11} color={comp.color} />
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:10, fontWeight:700, color:TEXT, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{comp.label}</div>
                            <div style={{ fontSize:8, color:TEXT3, marginTop:1 }}>{fmtQPS(comp.maxQPS)} max QPS · {comp.latencyMs}ms</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div style={{ padding:"8px 12px", borderTop:`1px solid ${BORDER}`, fontSize:9, color:TEXT3, textAlign:"center", flexShrink:0 }}>Drag onto canvas to place</div>
            </div>
          )}

          {/* ── Concepts tab ── */}
          {leftTab==="concepts" && (
            <div style={{ flex:1, overflowY:"auto" }}>
              {!conceptComp ? (
                <div style={{ padding:12 }}>
                  <div style={{ fontSize:10, color:TEXT3, marginBottom:10, lineHeight:1.6 }}>Click a component to explore its interview playbook — trade-offs, patterns, and real-world examples.</div>
                  {SYSTEM_COMPONENTS.filter(c => getConceptByComponentId(c.id)).map(comp=>(
                    <div key={comp.id} onClick={()=>setConceptComp(comp)}
                      style={{ padding:"8px 10px", borderRadius:7, marginBottom:5, cursor:"pointer", background:BG3, border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:8, transition:"all .12s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.background=G2;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.background=BG3;}}>
                      <div style={{ width:22, height:22, borderRadius:5, background:`${comp.color}20`, border:`1px solid ${comp.color}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <IC name={comp.icon} size={11} color={comp.color} />
                      </div>
                      <span style={{ fontSize:10.5, fontWeight:700, color:TEXT }}>{comp.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:14 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <button onClick={()=>setConceptComp(null)} style={{ background:"none", border:"none", color:TEXT3, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:9.5 }}>
                      <ChevronLeft size={11} /> All Components
                    </button>
                    <button onClick={() => {
                        const c = getConceptByComponentId(conceptComp.id);
                        setReaderContent({
                          title: conceptComp.label + " Playbook",
                          subtitle: "Deep Dive Concept Library",
                          sections: [
                            { title: "When to Use", content: c.whenToUse, color: G },
                            { title: "When NOT to Use", content: c.whenNotToUse, color: "#ef4444" },
                            { title: "Key Trade-offs", content: c.keyTradeoffs, color: "#f59e0b" },
                            { title: "Interview Tips", content: c.interviewTips, color: "#8b5cf6" },
                            { title: "Common Patterns", content: c.commonPatterns, color: "#06b6d4" },
                            { title: "Real World Examples", content: c.realWorldExamples, color: "#f59e0b" }
                          ]
                        });
                      }} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:6, padding:"4px 8px", color:TEXT2, fontSize:9, display:"flex", alignItems:"center", gap:4, cursor:"pointer" }}>
                      <Maximize2 size={10} /> Full Screen
                    </button>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:`${conceptComp.color}20`, border:`1px solid ${conceptComp.color}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <IC name={conceptComp.icon} size={14} color={conceptComp.color} />
                    </div>
                    <div style={{ fontSize:13, fontWeight:800, color:TEXT }}>{conceptComp.label}</div>
                  </div>
                  {(() => {
                    const c = getConceptByComponentId(conceptComp.id);
                    if (!c) return <div style={{color:TEXT3,fontSize:10}}>No concept data yet.</div>;
                    return (
                      <>
                        {[
                          {title:"✅ When to Use", items:c.whenToUse, color:G},
                          {title:"❌ When NOT to Use", items:c.whenNotToUse, color:"#ef4444"},
                          {title:"⚖️ Key Trade-offs", items:c.keyTradeoffs, color:"#f59e0b"},
                          {title:"🎤 Interview Tips", items:c.interviewTips, color:"#8b5cf6"},
                        ].map(({title,items,color})=>(
                          <div key={title} style={{ marginBottom:12 }}>
                            <div style={{ fontSize:9.5, fontWeight:700, color, marginBottom:6, textTransform:"uppercase", letterSpacing:".05em" }}>{title}</div>
                            {items.map((item,i)=>(
                              <div key={i} style={{ display:"flex", gap:6, marginBottom:5 }}>
                                <span style={{ color, flexShrink:0, marginTop:1 }}>•</span>
                                <span style={{ fontSize:9.5, color:TEXT2, lineHeight:1.55 }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                        <div style={{ fontSize:9.5, fontWeight:700, color:"#06b6d4", marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>🔧 Common Patterns</div>
                        {c.commonPatterns.map((p,i)=>(
                          <div key={i} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:7, padding:"8px 10px", marginBottom:6 }}>
                            <div style={{ fontSize:10, fontWeight:700, color:TEXT, marginBottom:3 }}>{p.name}</div>
                            <div style={{ fontSize:9, color:TEXT3, lineHeight:1.5 }}>{p.description}</div>
                          </div>
                        ))}
                        <div style={{ fontSize:9.5, fontWeight:700, color:"#f59e0b", marginBottom:8, textTransform:"uppercase", letterSpacing:".05em", marginTop:10 }}>🌍 Real World</div>
                        {c.realWorldExamples.map((ex,i)=>(
                          <div key={i} style={{ display:"flex", gap:6, marginBottom:5 }}>
                            <span style={{ color:"#f59e0b", flexShrink:0 }}>→</span>
                            <span style={{ fontSize:9.5, color:TEXT2, lineHeight:1.5 }}>{ex}</span>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* ══ CANVAS ═══════════════════════════════════════════════════════════════ */}
        <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
          <div ref={rfWrapper} style={{ width:"100%", height:"100%" }} onDragOver={onDragOver} onDrop={onDrop}>
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
              onConnect={onConnect} onInit={setRfi} nodeTypes={NODE_TYPES}
              onNodeClick={onNodeClick} onPaneClick={onPaneClick}
              deleteKeyCode="Delete" fitView style={{ background:BG }} defaultEdgeOptions={edgeDef}>
              <Background variant={BackgroundVariant.Dots} gap={28} size={1} color={BORDER} />
              <Controls style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:8 }} />
              <MiniMap style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:8 }}
                nodeColor={n=>getComponentById(n.data?.componentId)?.color||TEXT3} maskColor={`${BG}bb`} />
            </ReactFlow>
            {isSimRunning && (
              <div style={{ position:"absolute", inset:0, background:"rgba(13,17,23,0.4)", backdropFilter:"blur(2px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, animation:"fadeIn 0.3s ease-out" }}>
                <div style={{ background:BG2, border:`1px solid rgba(129,140,248,0.3)`, borderRadius:12, padding:"16px 24px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
                  <RefreshCw size={20} color="#818cf8" style={{ animation:"spin 1s linear infinite" }} />
                  <div style={{ fontSize:14, fontWeight:700, color:TEXT }}>Simulating Traffic...</div>
                </div>
              </div>
            )}
            {!nodes.length && (
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
                <div style={{ fontSize:48, marginBottom:12, opacity:.2 }}>🏗️</div>
                <div style={{ fontSize:13, color:TEXT3, fontWeight:700, marginBottom:6 }}>{activeProblem?`Designing: ${activeProblem.title}`:"Select a problem to begin"}</div>
                <div style={{ fontSize:10, color:TEXT3, opacity:.6 }}>Drag components from the left panel · Connect them · Run Simulation</div>
              </div>
            )}
          </div>
          {/* QPS slider */}
          <div style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", background:`${BG2}f0`, border:`1px solid rgba(129,140,248,0.25)`, borderRadius:10, padding:"8px 16px", display:"flex", alignItems:"center", gap:12, backdropFilter:"blur(12px)", boxShadow:"0 8px 24px rgba(0,0,0,.5),0 0 0 1px rgba(129,140,248,0.08)" }}>
            <span style={{ fontSize:9.5, fontWeight:700, color:"#818cf8", whiteSpace:"nowrap" }}><Zap size={10} style={{display:"inline",marginRight:4}}/>Simulated Load</span>
            <input type="range" min={1000} max={500000} step={1000} value={simQPS} onChange={e=>setSimQPS(Number(e.target.value))} style={{ width:160, accentColor:"#818cf8" }} />
            <span style={{ fontSize:11, fontWeight:700, color:TEXT, minWidth:60 }}>{fmtQPS(simQPS)} RPS</span>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══════════════════════════════════════════════════════════ */}
        <div style={{ width:280, minWidth:260, background:BG2, borderLeft:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ display:"flex", borderBottom:`1px solid ${BORDER}`, flexShrink:0, overflowX:"auto" }}>
            {[
              {id:"inspector",icon:Settings,label:"Props"},
              {id:"sim",icon:Activity,label:"Simulate"},
              {id:"score",icon:Target,label:"Score"},
              {id:"capacity",icon:HardDrive,label:"Capacity"},
              {id:"tradeoffs",icon:Layers,label:"Trade-offs"}
            ].map(tab=>(
              <button key={tab.id} onClick={()=>setRightTab(tab.id)} style={{ flex:"0 0 auto", minWidth:60, background:"none", border:"none", borderBottom:`2px solid ${rightTab===tab.id?G:"transparent"}`, padding:"9px 8px", cursor:"pointer", fontSize:9.5, fontWeight:700, letterSpacing:".02em", color:rightTab===tab.id?G:TEXT3, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:12 }}>
            {/* ── NODE INSPECTOR ── */}
            {rightTab==="inspector" && (
              !selectedNode ? (
                <div style={{ textAlign:"center", padding:"32px 16px" }}>
                  <Info size={28} color={BORDER} style={{ display:"block", margin:"0 auto 10px" }} />
                  <div style={{ fontSize:11, color:TEXT3, fontWeight:700, marginBottom:4 }}>Click a node</div>
                  <div style={{ fontSize:9.5, color:TEXT3, opacity:.7 }}>Select a component on the canvas to inspect and configure it</div>
                </div>
              ) : (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${selectedComp?.color||"#64748b"}20`, border:`1px solid ${selectedComp?.color||"#64748b"}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <IC name={selectedComp?.icon||"Box"} size={16} color={selectedComp?.color||"#64748b"} />
                    </div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:800, color:TEXT }}>{selectedComp?.label||selectedNode.data.label}</div>
                      <div style={{ fontSize:9, color:selectedComp?.color||TEXT3, textTransform:"uppercase" }}>{selectedComp?.category}</div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
                    {[["Max QPS",fmtQPS(selectedComp?.maxQPS||0)],["Base Latency",`${selectedComp?.latencyMs||0}ms`],
                      ["Scalable",selectedComp?.scalable?"✓ Yes":"✗ No"],["Stateful",selectedComp?.stateful?"Yes":"No"]
                    ].map(([k,v])=>(
                      <div key={k} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:6, padding:"6px 8px" }}>
                        <div style={{ fontSize:7.5, color:TEXT3, marginBottom:2 }}>{k}</div>
                        <div style={{ fontSize:11, fontWeight:700, color:TEXT }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Replica slider */}
                  <div style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:8, padding:12, marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:G, marginBottom:8 }}>Replicas</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <button onClick={()=>updateReplicas(selectedNode.id,(selectedNode.data.replicas||1)-1)}
                        style={{ width:24, height:24, borderRadius:6, background:BG2, border:`1px solid ${BORDER}`, color:TEXT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Minus size={11}/>
                      </button>
                      <input type="range" min={1} max={20} value={selectedNode.data.replicas||1}
                        onChange={e=>updateReplicas(selectedNode.id,Number(e.target.value))}
                        style={{ flex:1, accentColor:G }} />
                      <button onClick={()=>updateReplicas(selectedNode.id,(selectedNode.data.replicas||1)+1)}
                        style={{ width:24, height:24, borderRadius:6, background:BG2, border:`1px solid ${BORDER}`, color:TEXT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Plus size={11}/>
                      </button>
                    </div>
                    <div style={{ textAlign:"center", fontSize:11, fontWeight:700, color:G, marginTop:6 }}>
                      {selectedNode.data.replicas||1}× instances
                    </div>
                    <div style={{ fontSize:8.5, color:TEXT3, textAlign:"center", marginTop:3 }}>
                      Effective QPS: {fmtQPS((selectedComp?.maxQPS||0)*(selectedNode.data.replicas||1))}
                    </div>
                  </div>

                  {/* Description */}
                  {selectedComp?.description && (
                    <div style={{ fontSize:9.5, color:TEXT2, lineHeight:1.6, marginBottom:12 }}>{selectedComp.description}</div>
                  )}

                  <button onClick={()=>deleteNode(selectedNode.id)} style={{ width:"100%", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.3)", borderRadius:7, color:"#ef4444", fontSize:10, fontWeight:700, padding:"8px", cursor:"pointer" }}>
                    <Trash2 size={11} style={{display:"inline",marginRight:5}}/>Remove from Canvas
                  </button>
                </>
              )
            )}

            {/* ── SIMULATION TAB ── */}
            {rightTab==="sim" && (
              !simResult ? (
                <div style={{ textAlign:"center", padding:"32px 16px" }}>
                  <Activity size={28} color={BORDER} style={{ display:"block", margin:"0 auto 10px" }} />
                  <div style={{ fontSize:11, color:TEXT3, fontWeight:700, marginBottom:4 }}>No simulation yet</div>
                  <div style={{ fontSize:9.5, color:TEXT3, opacity:.7 }}>Build a design and click "Run Simulation"</div>
                </div>
              ) : (
                <div className="results-animate">
                  <div style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:8, padding:12, marginBottom:12 }}>
                    <div style={{ fontSize:9.5, fontWeight:700, color:G, marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>Summary</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {[["Throughput",fmtQPS(simResult.throughput)+" RPS"],["P99 Latency",simResult.totalLatencyMs+"ms"],
                        ["Bottlenecks",simResult.bottleneckNodes.length.toString()],["Nodes",nodes.length.toString()]
                      ].map(([k,v])=>(
                        <div key={k} style={{ background:BG2, borderRadius:6, padding:"7px 8px" }}>
                          <div style={{ fontSize:7.5, color:TEXT3, marginBottom:2 }}>{k}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:k==="Bottlenecks"&&parseInt(v)>0?"#ef4444":TEXT }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {simResult.warnings.map((w,i)=>(
                    <div key={i} style={{ background:"rgba(245,158,11,.08)", border:"1px solid rgba(245,158,11,.25)", borderRadius:7, padding:"8px 10px", marginBottom:10, display:"flex", gap:7 }}>
                      <AlertCircle size={11} color="#f59e0b" style={{flexShrink:0,marginTop:2}}/>
                      <span style={{ fontSize:9.5, color:"#f59e0b", lineHeight:1.5 }}>{w}</span>
                    </div>
                  ))}
                  <div style={{ fontSize:9.5, fontWeight:700, color:TEXT3, marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>Node Metrics</div>
                  {[...simResult.nodeMetrics.values()].sort((a,b)=>b.incomingQPS-a.incomingQPS).map(m=>{
                    const node = nodes.find(n=>n.id===m.nodeId);
                    const comp = getComponentById(node?.data?.componentId);
                    const st   = STATUS_COLOR[m.status]||STATUS_COLOR.idle;
                    return (
                      <div key={m.nodeId} style={{ background:BG3, border:`1px solid ${st.border}`, borderRadius:7, padding:"8px 10px", marginBottom:6 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <IC name={comp?.icon||"Box"} size={11} color={comp?.color||TEXT3}/>
                            <span style={{ fontSize:10, fontWeight:700, color:TEXT }}>{comp?.label||node?.data?.label||m.nodeId}</span>
                          </div>
                          <span style={{ fontSize:8, fontWeight:700, color:st.text, background:st.bg, border:`1px solid ${st.border}`, borderRadius:4, padding:"1px 6px" }}>{st.label}</span>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:8.5, color:TEXT3 }}>{fmtQPS(m.incomingQPS)} QPS</span>
                          <span style={{ fontSize:8.5, color:TEXT2 }}>{m.latencyMs}ms</span>
                        </div>
                        <div style={{ height:3, background:BG2, borderRadius:3, overflow:"hidden" }}>
                          <div style={{ width:`${Math.min(m.utilization*100,100)}%`, height:"100%", background:st.text, borderRadius:3, transition:"width .5s ease-out" }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* ── SCORE TAB ── */}
            {rightTab==="score" && (
              !scoreResult ? (
                <div style={{ textAlign:"center", padding:"32px 16px" }}>
                  <BarChart2 size={28} color={BORDER} style={{ display:"block", margin:"0 auto 10px" }}/>
                  <div style={{ fontSize:11, color:TEXT3, fontWeight:700, marginBottom:4 }}>No score yet</div>
                  <div style={{ fontSize:9.5, color:TEXT3, opacity:.7 }}>Run the simulation to get scored</div>
                </div>
              ) : (
                <>
                  <div style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:10, padding:16, marginBottom:12, textAlign:"center" }}>
                    <div style={{ fontSize:38, fontWeight:900, color:verdictColor(scoreResult.verdict), lineHeight:1 }}>{scoreResult.total}</div>
                    <div style={{ fontSize:10, color:TEXT3, marginBottom:6 }}>/ 100</div>
                    <div style={{ fontSize:13, fontWeight:700, color:verdictColor(scoreResult.verdict) }}>{scoreResult.verdict}</div>
                  </div>
                  {[
                    {key:"scalability",label:"Scalability",hint:"LB, cache, queue"},
                    {key:"reliability",label:"Reliability",hint:"Monitoring, circuit breaker, auth"},
                    {key:"performance",label:"Performance",hint:"No bottlenecked nodes"},
                    {key:"coverage",label:"Coverage",hint:"Match reference components"},
                    {key:"connections",label:"Connections",hint:"No isolated nodes"},
                  ].map(({key,label,hint})=>{
                    const val = scoreResult.scores[key]??0;
                    const pct = (val/20)*100;
                    const col = pct>=75?G:pct>=40?"#f59e0b":"#ef4444";
                    return (
                      <div key={key} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:7, padding:"10px 12px", marginBottom:8 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                          <span style={{ fontSize:10, fontWeight:700, color:TEXT }}>{label}</span>
                          <span style={{ fontSize:11, fontWeight:800, color:col }}>{val}/20</span>
                        </div>
                        <div style={{ height:4, background:BG2, borderRadius:4, overflow:"hidden", marginBottom:4 }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${col},${col}88)`, borderRadius:4, transition:"width .6s ease-out" }}/>
                        </div>
                        <div style={{ fontSize:8.5, color:TEXT3 }}>{hint}</div>
                      </div>
                    );
                  })}
                </>
              )
            )}

            {/* ── CAPACITY TAB ── */}
            {rightTab==="capacity" && (
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:TEXT, marginBottom:10 }}>Capacity Estimator</div>
                <div style={{ display:"grid", gap:8, marginBottom:16 }}>
                  {[{k:"dau",l:"DAU"},{k:"readsPerUser",l:"Reads/User/Day"},{k:"writesPerUser",l:"Writes/User/Day"},
                    {k:"readSizeKb",l:"Read Size (KB)"},{k:"writeSizeKb",l:"Write Size (KB)"},{k:"storageMonths",l:"Storage (Months)"}].map(({k,l}) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:BG3, padding:"6px 10px", borderRadius:6, border:`1px solid ${BORDER}` }}>
                      <span style={{ fontSize:9.5, color:TEXT2 }}>{l}</span>
                      <input type="number" value={capacitySettings[k]} onChange={e=>setCapacitySettings(p=>({...p,[k]:Number(e.target.value)}))}
                        style={{ width:80, background:BG2, border:`1px solid ${BORDER}`, color:TEXT, fontSize:10, padding:"4px", borderRadius:4, outline:"none", textAlign:"right" }} />
                    </div>
                  ))}
                </div>
                {(() => {
                  const s = capacitySettings;
                  const rp = (s.dau * s.readsPerUser) / 86400;
                  const wp = (s.dau * s.writesPerUser) / 86400;
                  const bwIn = wp * s.writeSizeKb / 1024; // MB/s
                  const bwOut = rp * s.readSizeKb / 1024; // MB/s
                  const storageGb = (s.dau * s.writesPerUser * s.writeSizeKb * 30 * s.storageMonths) / (1024 * 1024);
                  return (
                    <div style={{ background:BG3, border:`1px solid ${G}44`, borderRadius:8, padding:12 }}>
                      <div style={{ fontSize:9.5, fontWeight:700, color:G, marginBottom:8, textTransform:"uppercase" }}>Estimates</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        {[["Read QPS",Math.round(rp)],["Write QPS",Math.round(wp)],
                          ["Peak QPS",Math.round((rp+wp)*2)],["Memory (20%)",`${(storageGb*0.2).toFixed(1)} GB`],
                          ["Inbound",`${bwIn.toFixed(2)} MB/s`],["Outbound",`${bwOut.toFixed(2)} MB/s`]
                        ].map(([k,v])=>(
                          <div key={k} style={{ background:BG2, borderRadius:6, padding:"6px 8px" }}>
                            <div style={{ fontSize:7.5, color:TEXT3, marginBottom:2 }}>{k}</div>
                            <div style={{ fontSize:11, fontWeight:700, color:TEXT }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop:8, background:BG2, borderRadius:6, padding:"6px 8px" }}>
                        <div style={{ fontSize:7.5, color:TEXT3, marginBottom:2 }}>Storage Required</div>
                        <div style={{ fontSize:13, fontWeight:800, color:G }}>{storageGb>1024 ? `${(storageGb/1024).toFixed(2)} TB` : `${storageGb.toFixed(1)} GB`}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── TRADE-OFFS TAB ── */}
            {rightTab==="tradeoffs" && (
              <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
                <div style={{ fontSize:11, fontWeight:800, color:TEXT, marginBottom:10 }}>Decision Cards</div>
                <div style={{ position:"relative", marginBottom:12 }}>
                  <Search size={10} color={TEXT3} style={{ position:"absolute", left:8, top:8 }} />
                  <input value={tradeoffSearch} onChange={e=>setTradeoffSearch(e.target.value)} placeholder="Search trade-offs..."
                    style={{ width:"100%", background:BG3, border:`1px solid ${BORDER}`, borderRadius:6, color:TEXT, fontSize:9, padding:"5px 10px 5px 24px", outline:"none" }} />
                </div>
                <div style={{ flex:1, overflowY:"auto", paddingRight:4 }}>
                  {TRADEOFF_CARDS.filter(tc => !tradeoffSearch || tc.title.toLowerCase().includes(tradeoffSearch.toLowerCase())).map(tc => (
                    <div key={tc.id} onClick={() => setReaderContent({ type: "tradeoff", title: tc.title, subtitle: "Decision Analysis Card", data: tc })}
                      style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:8, padding:10, marginBottom:8, cursor:"pointer", transition:"all.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=G}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ fontSize:10.5, fontWeight:800, color:TEXT }}>{tc.title}</span>
                        <Maximize2 size={10} color={TEXT3} />
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:8.5, color:TEXT3 }}>
                        <span style={{ color:G }}>{tc.optionA.name}</span>
                        <span>vs</span>
                        <span style={{ color:"#3b82f6" }}>{tc.optionB.name}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop:16, borderTop:`1px solid ${BORDER}`, paddingTop:16 }}>
                    <div style={{ fontSize:10, fontWeight:800, color:TEXT, marginBottom:8 }}>Design Notes</div>
                    <textarea
                      value={tradeoffsText}
                      onChange={e=>setTradeoffsText(e.target.value)}
                      placeholder="Document choices specific to this design..."
                      style={{ width:"100%", minHeight:150, background:BG3, border:`1px solid ${BORDER}`, color:TEXT, fontSize:10, padding:"8px", borderRadius:6, outline:"none", fontFamily:"var(--font)", resize:"none", lineHeight:1.5 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); border-color: rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); border-color: rgba(239, 68, 68, 0.8); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); border-color: rgba(239, 68, 68, 0.4); }
        }
        @keyframes blast {
          0% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 0 red); }
          5% { transform: scale(1.05) rotate(1deg); filter: brightness(1.5) drop-shadow(0 0 15px red); }
          10% { transform: scale(1.05) rotate(-1deg); }
          15% { transform: scale(1.05) rotate(1deg); }
          20% { transform: scale(1) rotate(0); filter: brightness(1.2); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        .node-critical { animation: pulse-red 2s infinite !important; }
        .node-blast { animation: blast 0.6s infinite !important; border-color: #ef4444 !important; border-width: 2px !important; z-index: 100; }
        .results-animate { animation: slideInRight 0.4s ease-out; }
        .react-flow__controls button { background: ${BG2} !important; border-color: ${BORDER} !important; color: ${TEXT3} !important; }
        .react-flow__controls button:hover { background: ${BG3} !important; color: #818cf8 !important; }
        .react-flow__edge-path { stroke: #6366f1 !important; transition: stroke 0.3s; }
        .react-flow__edge.selected .react-flow__edge-path { stroke: #818cf8 !important; stroke-width: 2 !important; }
        .react-flow__minimap-mask { fill: ${BG}cc; }
        .react-flow__attribution { display: none; }
      `}</style>
    </div>
  );
}
