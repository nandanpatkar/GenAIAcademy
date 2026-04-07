import { useState, useCallback } from “react”;
import ReactFlow, {
Background,
Controls,
MiniMap,
addEdge,
useNodesState,
useEdgesState,
Handle,
Position,
MarkerType,
} from “reactflow”;
import “reactflow/dist/style.css”;

const C = {
bg: “#050810”,
panel: “#0c1120”,
card: “#111827”,
border: “#1e293b”,
accent: “#f97316”,
accentDim: “#7c3a10”,
blue: “#38bdf8”,
green: “#4ade80”,
purple: “#a78bfa”,
text: “#e2e8f0”,
muted: “#64748b”,
};

const STATUS = {
locked:     { border: C.border,  glow: “none”,                   badge: “#334155”,   label: “Locked” },
available:  { border: C.blue,    glow: “0 0 12px #38bdf840”,     badge: “#0c4a6e”,   label: “Start” },
inprogress: { border: C.accent,  glow: “0 0 16px #f9731650”,     badge: C.accentDim, label: “In Progress” },
done:       { border: C.green,   glow: “0 0 12px #4ade8040”,     badge: “#14532d”,   label: “Done” },
};

function RoadmapNode({ data, selected }) {
const s = STATUS[data.status] || STATUS.locked;
const icons = { locked: “🔒”, available: “⚡”, inprogress: “🔥”, done: “✅” };

return (
<div
onClick={() => data.onSelect(data)}
style={{
background: C.card,
border: `1.5px solid ${selected ? C.accent : s.border}`,
boxShadow: selected ? “0 0 20px #f9731660” : s.glow,
borderRadius: 14,
padding: “14px 18px”,
width: 200,
cursor: “pointer”,
transition: “all 0.2s”,
fontFamily: “‘DM Mono’, monospace”,
}}
>
<Handle type=“target” position={Position.Top}    style={{ background: C.muted, border: “none”, width: 8, height: 8 }} />
<div style={{ display: “flex”, alignItems: “center”, gap: 8, marginBottom: 6 }}>
<span style={{ fontSize: 18 }}>{data.icon || “📘”}</span>
<span style={{
fontSize: 10, padding: “2px 7px”, borderRadius: 99,
background: s.badge, color: “#fff”, fontWeight: 600,
letterSpacing: “0.05em”, textTransform: “uppercase”,
}}>
{icons[data.status]} {s.label}
</span>
</div>
<div style={{ color: C.text, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{data.title}</div>
<div style={{ color: C.muted, fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>{data.description}</div>
{data.duration && (
<div style={{ marginTop: 8, color: C.accent, fontSize: 10, fontWeight: 600 }}>⏱ {data.duration}</div>
)}
<Handle type=“source” position={Position.Bottom} style={{ background: C.muted, border: “none”, width: 8, height: 8 }} />
</div>
);
}

const nodeTypes = { roadmap: RoadmapNode };

function Sidebar({ node, onClose, onStatusChange }) {
if (!node) return null;

return (
<div style={{
position: “absolute”, right: 0, top: 0, height: “100%”, width: 320,
background: C.panel, borderLeft: `1px solid ${C.border}`,
zIndex: 100, display: “flex”, flexDirection: “column”,
fontFamily: “‘DM Mono’, monospace”, overflow: “hidden”,
}}>
<div style={{ padding: “20px 20px 16px”, borderBottom: `1px solid ${C.border}` }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div>
<div style={{ fontSize: 22 }}>{node.icon || “📘”}</div>
<div style={{ color: C.text, fontWeight: 700, fontSize: 16, marginTop: 6 }}>{node.title}</div>
<div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{node.description}</div>
</div>
<button onClick={onClose} style={{ background: “none”, border: “none”, color: C.muted, cursor: “pointer”, fontSize: 18, padding: 4 }}>✕</button>
</div>
<div style={{ display: “flex”, gap: 6, marginTop: 14, flexWrap: “wrap” }}>
{Object.entries(STATUS).map(([key, val]) => (
<button key={key} onClick={() => onStatusChange(node.id, key)} style={{
padding: “4px 10px”, borderRadius: 99,
border: `1px solid ${node.status === key ? val.border : C.border}`,
background: node.status === key ? val.badge : “transparent”,
color: node.status === key ? “#fff” : C.muted,
fontSize: 10, cursor: “pointer”, fontFamily: “inherit”,
fontWeight: 600, textTransform: “uppercase”, letterSpacing: “0.05em”,
}}>
{val.label}
</button>
))}
</div>
</div>

```
  <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
    {node.duration && <InfoRow label="Est. Time" value={node.duration} color={C.accent} />}
    {node.skills && node.skills.length > 0 && (
      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Skills</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {node.skills.map((sk, i) => (
            <span key={i} style={{ padding: "3px 9px", borderRadius: 99, background: "#1e293b", color: C.blue, fontSize: 11 }}>{sk}</span>
          ))}
        </div>
      </div>
    )}
    {node.resources && node.resources.length > 0 && (
      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Resources</SectionLabel>
        {node.resources.map((r, i) => (
          <div key={i} style={{ padding: "10px 12px", background: C.card, borderRadius: 8, marginBottom: 6, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{r.title}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{r.type} · {r.platform}</div>
          </div>
        ))}
      </div>
    )}
    {node.notes && (
      <div>
        <SectionLabel>Notes</SectionLabel>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, background: C.card, padding: 12, borderRadius: 8, border: `1px solid ${C.border}` }}>
          {node.notes}
        </div>
      </div>
    )}
  </div>
</div>
```

);
}

function SectionLabel({ children }) {
return <div style={{ color: C.muted, fontSize: 10, textTransform: “uppercase”, letterSpacing: “0.08em”, marginBottom: 8 }}>{children}</div>;
}

function InfoRow({ label, value, color }) {
return (
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 10, fontSize: 12 }}>
<span style={{ color: C.muted }}>{label}</span>
<span style={{ color: color || C.text, fontWeight: 600 }}>{value}</span>
</div>
);
}

function AIPanel({ onGenerate, loading }) {
const [topic, setTopic] = useState(””);
return (
<div style={{
position: “absolute”, top: 16, left: “50%”, transform: “translateX(-50%)”,
zIndex: 200, display: “flex”, gap: 8, alignItems: “center”,
background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12,
padding: “8px 12px”, boxShadow: “0 4px 32px #00000060”,
fontFamily: “‘DM Mono’, monospace”,
}}>
<span style={{ fontSize: 16 }}>🧠</span>
<input
value={topic}
onChange={(e) => setTopic(e.target.value)}
onKeyDown={(e) => e.key === “Enter” && topic.trim() && onGenerate(topic)}
placeholder=“I want to learn…”
style={{ background: “transparent”, border: “none”, outline: “none”, color: C.text, fontSize: 13, width: 240, fontFamily: “inherit” }}
/>
<button
onClick={() => topic.trim() && onGenerate(topic)}
disabled={loading || !topic.trim()}
style={{
padding: “6px 14px”, borderRadius: 8, border: “none”,
background: loading ? C.border : C.accent, color: “#fff”,
fontSize: 12, fontWeight: 700, cursor: loading ? “not-allowed” : “pointer”,
fontFamily: “inherit”, whiteSpace: “nowrap”, transition: “background 0.2s”,
}}
>
{loading ? “Generating…” : “Generate ⚡”}
</button>
</div>
);
}

function StatsBar({ nodes }) {
const counts = { locked: 0, available: 0, inprogress: 0, done: 0 };
nodes.forEach((n) => { if (counts[n.data?.status] !== undefined) counts[n.data.status]++; });
const total = nodes.length;
const pct = total ? Math.round((counts.done / total) * 100) : 0;

return (
<div style={{
position: “absolute”, bottom: 16, left: 16, zIndex: 200,
background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10,
padding: “10px 14px”, fontFamily: “‘DM Mono’, monospace”, fontSize: 11, color: C.muted, minWidth: 200,
}}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 6 }}>
<span style={{ color: C.text, fontWeight: 700 }}>Progress</span>
<span style={{ color: C.green, fontWeight: 700 }}>{pct}%</span>
</div>
<div style={{ background: C.border, borderRadius: 99, height: 4, marginBottom: 8, overflow: “hidden” }}>
<div style={{ width: `${pct}%`, height: “100%”, background: C.green, borderRadius: 99, transition: “width 0.4s” }} />
</div>
<div style={{ display: “flex”, gap: 10 }}>
{[[“Done”, counts.done, C.green], [“Active”, counts.inprogress, C.accent], [“Open”, counts.available, C.blue], [“Locked”, counts.locked, C.muted]].map(([label, val, color]) => (
<div key={label} style={{ textAlign: “center” }}>
<div style={{ color, fontWeight: 700, fontSize: 13 }}>{val}</div>
<div style={{ color: C.muted, fontSize: 9, textTransform: “uppercase” }}>{label}</div>
</div>
))}
</div>
</div>
);
}

const EDGE_STYLE = (e) => ({ …e, animated: true, style: { stroke: C.border }, markerEnd: { type: MarkerType.ArrowClosed, color: C.muted } });

function makeDefaultRoadmap(onSelect) {
const raw = [
{ id: “1”, title: “Python Basics”,       icon: “🐍”,  desc: “Variables, loops, functions”,    status: “done”,       duration: “2 weeks”, x: 300, y:  40, skills: [“Python”,“OOP”],            resources: [{ title: “Python Crash Course”, type: “Book”,     platform: “Amazon”            }, { title: “CS50P”,           type: “Course”,   platform: “edX”              }], notes: “Master list comprehensions and decorators.” },
{ id: “2”, title: “Data Structures”,     icon: “🗂️”, desc: “Lists, dicts, trees, graphs”,    status: “done”,       duration: “2 weeks”, x: 100, y: 200, skills: [“DSA”,“Python”],             resources: [{ title: “LeetCode Easy”,       type: “Practice”, platform: “LeetCode”          }], notes: “Focus on time/space complexity.” },
{ id: “3”, title: “NumPy & Pandas”,      icon: “📊”,  desc: “Array ops and dataframes”,       status: “inprogress”, duration: “1 week”,  x: 500, y: 200, skills: [“NumPy”,“Pandas”],           resources: [{ title: “Pandas Docs”,         type: “Docs”,     platform: “pandas.pydata.org” }], notes: “Practice on Kaggle datasets.” },
{ id: “4”, title: “Statistics & Math”,   icon: “📐”,  desc: “Probability, linear algebra”,    status: “available”,  duration: “3 weeks”, x: 100, y: 380, skills: [“Stats”,“Linear Algebra”],   resources: [{ title: “Khan Academy Stats”,  type: “Course”,   platform: “Khan Academy”      }], notes: “” },
{ id: “5”, title: “Scikit-learn”,        icon: “⚙️”,  desc: “Classical ML models”,            status: “available”,  duration: “2 weeks”, x: 500, y: 380, skills: [“ML”,“Sklearn”],             resources: [{ title: “Hands-On ML”,         type: “Book”,     platform: “O’Reilly”          }], notes: “” },
{ id: “6”, title: “Neural Networks”,     icon: “🧠”,  desc: “Backprop, activations, loss”,    status: “locked”,     duration: “3 weeks”, x: 300, y: 540, skills: [“Deep Learning”,“Math”],     resources: [], notes: “” },
{ id: “7”, title: “PyTorch / TensorFlow”,icon: “🔥”,  desc: “Framework deep-dive”,            status: “locked”,     duration: “2 weeks”, x: 300, y: 700, skills: [“PyTorch”],                  resources: [], notes: “” },
{ id: “8”, title: “Transformers & LLMs”, icon: “🤖”,  desc: “Attention, BERT, GPT”,           status: “locked”,     duration: “4 weeks”, x: 300, y: 860, skills: [“NLP”,“HuggingFace”],        resources: [], notes: “” },
{ id: “9”, title: “Deploy & MLOps”,      icon: “🚀”,  desc: “Docker, FastAPI, CI/CD”,         status: “locked”,     duration: “2 weeks”, x: 300, y:1020, skills: [“MLOps”,“Docker”],           resources: [], notes: “” },
];

const nodes = raw.map((n) => ({
id: n.id, type: “roadmap”, position: { x: n.x, y: n.y },
data: { id: n.id, title: n.title, icon: n.icon, description: n.desc, status: n.status, duration: n.duration, skills: n.skills, resources: n.resources, notes: n.notes, onSelect },
}));

const edges = [
{ id: “e1-2”, source: “1”, target: “2” }, { id: “e1-3”, source: “1”, target: “3” },
{ id: “e2-4”, source: “2”, target: “4” }, { id: “e3-5”, source: “3”, target: “5” },
{ id: “e4-6”, source: “4”, target: “6” }, { id: “e5-6”, source: “5”, target: “6” },
{ id: “e6-7”, source: “6”, target: “7” }, { id: “e7-8”, source: “7”, target: “8” },
{ id: “e8-9”, source: “8”, target: “9” },
].map(EDGE_STYLE);

return { nodes, edges };
}

function parseRoadmapJSON(text) {
const cleaned = text.replace(/`json|`/g, “”).trim();
const match = cleaned.match(/{[\s\S]*}/);
if (!match) throw new Error(“No JSON found”);
return JSON.parse(match[0]);
}

function buildFlowFromLLM(data, onSelect) {
const nodes = data.nodes.map((n, i) => {
const cols = 3;
return {
id: String(n.id || i + 1),
type: “roadmap”,
position: { x: (i % cols) * 260 + 80, y: Math.floor(i / cols) * 180 + 80 },
data: {
id: String(n.id || i + 1),
title: n.title, icon: n.icon || “📘”, description: n.description || “”,
status: i === 0 ? “available” : “locked”,
duration: n.duration || “”, skills: n.skills || [],
resources: (n.resources || []).map((r) => typeof r === “string” ? { title: r, type: “Resource”, platform: “” } : r),
notes: n.notes || “”, onSelect,
},
};
});

const edges = (data.edges || []).map((e) => EDGE_STYLE({
id: `e${e.source}-${e.target}`,
source: String(e.source),
target: String(e.target),
}));

return { nodes, edges };
}

export default function App() {
const [selectedNodeData, setSelectedNodeData] = useState(null);
const [loadingAI, setLoadingAI] = useState(false);
const [roadmapTitle, setRoadmapTitle] = useState(“Machine Learning Roadmap”);
const [error, setError] = useState(””);

const handleSelect = useCallback((data) => setSelectedNodeData(data), []);

const { nodes: defaultNodes, edges: defaultEdges } = makeDefaultRoadmap(handleSelect);
const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);

const syncHandlers = useCallback((ns) =>
ns.map((n) => ({ …n, data: { …n.data, onSelect: handleSelect } })),
[handleSelect]);

const handleStatusChange = useCallback((nodeId, newStatus) => {
setNodes((prev) => prev.map((n) => n.id === nodeId ? { …n, data: { …n.data, status: newStatus } } : n));
setSelectedNodeData((prev) => prev ? { …prev, status: newStatus } : prev);
}, [setNodes]);

const handleGenerate = useCallback(async (topic) => {
setLoadingAI(true);
setError(””);

```
const PROMPT = `You are a learning roadmap expert. Generate a structured learning roadmap for: "${topic}".
```

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
“title”: “Roadmap title”,
“nodes”: [
{
“id”: 1,
“title”: “Topic name”,
“icon”: “emoji”,
“description”: “One sentence description”,
“duration”: “X weeks”,
“skills”: [“skill1”, “skill2”],
“resources”: [
{“title”: “Resource name”, “type”: “Course/Book/Docs/Practice”, “platform”: “Platform name”}
],
“notes”: “Brief learning tip”
}
],
“edges”: [
{“source”: 1, “target”: 2}
]
}

Requirements:

- 8-12 nodes in a logical learning sequence
- Mix of foundational to advanced topics
- Practical resources for each node
- Edges show prerequisite relationships (DAG, not just linear)
- Icons should be relevant emojis`;
  
  try {
  const res = await fetch(“https://api.anthropic.com/v1/messages”, {
  method: “POST”,
  headers: { “Content-Type”: “application/json” },
  body: JSON.stringify({
  model: “claude-sonnet-4-20250514”,
  max_tokens: 1000,
  messages: [{ role: “user”, content: PROMPT }],
  }),
  });
  
  ```
  const data = await res.json();
  const text = data.content?.map((c) => c.text || "").join("");
  if (!text) throw new Error("Empty response");
  
  const roadmap = parseRoadmapJSON(text);
  const { nodes: newNodes, edges: newEdges } = buildFlowFromLLM(roadmap, handleSelect);
  
  setRoadmapTitle(roadmap.title || `${topic} Roadmap`);
  setNodes(syncHandlers(newNodes));
  setEdges(newEdges);
  setSelectedNodeData(null);
  ```
  
  } catch (e) {
  setError(“Generation failed — check console”);
  console.error(e);
  } finally {
  setLoadingAI(false);
  }
  }, [handleSelect, setNodes, setEdges, syncHandlers]);
  
  const onConnect = useCallback(
  (params) => setEdges((eds) => addEdge(EDGE_STYLE(params), eds)),
  [setEdges]
  );
  
  return (
  
    <div style={{ width: "100vw", height: "100vh", background: C.bg, position: "relative", fontFamily: "'DM Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; }`}</style>
  
  ```
  {/* Title */}
  <div style={{ position: "absolute", top: 16, left: 16, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ fontSize: 18 }}>🗺️</span>
    <span style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{roadmapTitle}</span>
  </div>
  
  <AIPanel onGenerate={handleGenerate} loading={loadingAI} />
  
  {error && (
    <div style={{ position: "absolute", top: 72, left: "50%", transform: "translateX(-50%)", zIndex: 300, background: "#450a0a", border: "1px solid #dc2626", color: "#fca5a5", padding: "8px 16px", borderRadius: 8, fontSize: 12 }}>
      {error}
    </div>
  )}
  
  <div style={{ width: selectedNodeData ? "calc(100% - 320px)" : "100%", height: "100%" }}>
    <ReactFlow
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
      nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.3} maxZoom={2}
    >
      <Background color="#1e293b" gap={28} size={1} />
      <Controls style={{ background: C.panel, border: `1px solid ${C.border}` }} />
      <MiniMap style={{ background: C.panel, border: `1px solid ${C.border}` }} nodeColor={(n) => STATUS[n.data?.status]?.border || C.border} />
    </ReactFlow>
  </div>
  
  <Sidebar node={selectedNodeData} onClose={() => setSelectedNodeData(null)} onStatusChange={handleStatusChange} />
  <StatsBar nodes={nodes} />
  ```
  
    </div>
  );

}