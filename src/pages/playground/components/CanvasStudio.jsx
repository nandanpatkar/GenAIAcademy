import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, { addEdge, Background, BackgroundVariant, Controls, Handle, MiniMap, Position, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { Bot, Circle, Diamond, Eraser, FileText, Frame, LayoutPanelTop, Lightbulb, MousePointer2, PenLine, Plus, RectangleHorizontal, Sparkles, StickyNote, Type, Users, Wand2, X } from "lucide-react";
import { generateFlowArchitecture } from "../../../services/aiService";

const uid = () => `canvas_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const AI_TYPES = ["mindmap", "journey", "wireframe", "flowchart", "architecture"];

function CanvasNode({ id, data, selected }) {
  const colors = { note: ["#fef3c7", "#92400e"], text: ["#172554", "#dbeafe"], card: ["#18181b", "#f4f4f5"], person: ["#3b0764", "#f3e8ff"] };
  const [bg, color] = colors[data.kind] || colors.card;
  const shape = data.shape || "rectangle";
  const clip = shape === "diamond" ? "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" : shape === "ellipse" ? "ellipse(50% 50% at 50% 50%)" : "none";
  return <div style={{ minWidth: data.kind === "text" ? 150 : 200, maxWidth: 300, minHeight: shape === "diamond" ? 105 : undefined, background: shape === "ellipse" || shape === "diamond" ? "transparent" : bg, color, border: `1px solid ${selected ? "#818cf8" : "rgba(148,163,184,.35)"}`, borderRadius: shape === "ellipse" ? "50%" : data.kind === "text" ? 0 : 10, padding: data.kind === "text" ? 4 : shape === "diamond" ? "28px 32px" : 12, boxShadow: selected ? "0 0 0 2px #818cf844" : "0 8px 18px rgba(0,0,0,.2)", fontFamily: "Inter,system-ui,sans-serif", position: "relative" }}>
    {(shape === "ellipse" || shape === "diamond") && <div style={{ position: "absolute", inset: 0, background: bg, clipPath: clip, zIndex: -1, border: "inherit" }} />}
    <Handle type="target" position={Position.Left} style={{ opacity: .5 }} />
    {data.kind === "note" && <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".08em", opacity: .7, marginBottom: 5 }}>NOTE</div>}
    <textarea className="nodrag" value={data.label || ""} onChange={event => data.onChange?.(id, event.target.value)} placeholder="Type something…" rows={data.kind === "text" ? 1 : 3} style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", outline: "none", resize: "none", color: "inherit", font: data.kind === "text" ? "700 18px/1.25 Inter,system-ui" : "13px/1.5 Inter,system-ui" }} />
    <Handle type="source" position={Position.Right} style={{ opacity: .5 }} />
  </div>;
}

function FrameNode({ data, selected }) {
  return <div style={{ width: "100%", height: "100%", border: `2px dashed ${selected ? "#a78bfa" : "#a78bfa88"}`, borderRadius: 14, background: "#a78bfa08", position: "relative" }}><div style={{ position: "absolute", top: -14, left: 16, padding: "3px 8px", background: "#161b22", color: "#c4b5fd", border: "1px solid #a78bfa55", borderRadius: 5, font: "700 10px 'DM Mono',monospace" }}>{data.label || "Frame"}</div></div>;
}

const nodeTypes = { canvas: CanvasNode, frame: FrameNode };

export default function CanvasStudio() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("mindmap");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTool, setActiveTool] = useState("select");
  const [strokes, setStrokes] = useState([]);
  const [drawing, setDrawing] = useState(null);
  const wrapper = useRef(null);
  const [instance, setInstance] = useState(null);
  const add = useCallback((kind, label, style, shape = "rectangle") => {
    const rect = wrapper.current?.getBoundingClientRect();
    const point = instance && rect ? instance.screenToFlowPosition({ x: rect.left + rect.width / 2 + (nodes.length % 4) * 28, y: rect.top + rect.height / 2 + (nodes.length % 3) * 28 }) : { x: 180, y: 140 };
    const id = uid();
    const node = kind === "frame" ? { id, type: "frame", position: point, style: { width: 440, height: 270 }, data: { label } } : { id, type: "canvas", position: point, data: { kind, shape, label, onChange: (nodeId, next) => setNodes(current => current.map(node => node.id === nodeId ? { ...node, data: { ...node.data, label: next } } : node)) } };
    setNodes(current => [...current, node]);
  }, [instance, nodes.length, setNodes]);
  const onConnect = useCallback(params => setEdges(current => addEdge({ ...params, animated: true, style: { stroke: "#a78bfa", strokeWidth: 1.6 }, labelStyle: { fill: "#cbd5e1", fontSize: 10 } }, current)), [setEdges]);
  const pointFor = (event) => { const rect = wrapper.current?.getBoundingClientRect(); return rect ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : null; };
  const beginDraw = (event) => { if (activeTool !== "draw") return; const point = pointFor(event); if (point) setDrawing([point]); };
  const continueDraw = (event) => { if (!drawing) return; const point = pointFor(event); if (point) setDrawing(current => [...current, point]); };
  const finishDraw = () => { if (drawing?.length > 1) setStrokes(current => [...current, { id: uid(), points: drawing }]); setDrawing(null); };
  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true); setError("");
    try {
      const design = await generateFlowArchitecture(prompt, format);
      const idMap = new Map();
      const nextNodes = design.nodes.map((node, index) => { const id = uid(); idMap.set(node.id, id); const shape = format === "mindmap" ? "ellipse" : format === "flowchart" && /decision|approve|check|valid|condition/i.test(node.label) ? "diamond" : format === "erd" || format === "wireframe" ? "document" : "rectangle"; return { id, type: "canvas", position: format === "mindmap" ? { x: 480 + Math.cos((index / Math.max(design.nodes.length, 1)) * Math.PI * 2) * (index ? 300 : 0), y: 330 + Math.sin((index / Math.max(design.nodes.length, 1)) * Math.PI * 2) * (index ? 210 : 0) } : { x: 80 + (index % 4) * 270, y: 80 + Math.floor(index / 4) * 150 }, data: { kind: format === "journey" ? "person" : "card", shape, label: `${node.label}${node.sub ? `\n${node.sub}` : ""}`, onChange: (nodeId, next) => setNodes(current => current.map(item => item.id === nodeId ? { ...item, data: { ...item.data, label: next } } : item)) } }; });
      setNodes(nextNodes);
      setEdges(design.edges.filter(edge => idMap.has(edge.source) && idMap.has(edge.target)).map(edge => ({ id: uid(), source: idMap.get(edge.source), target: idMap.get(edge.target), label: edge.label || "", animated: true, style: { stroke: "#a78bfa", strokeWidth: 1.6 }, labelStyle: { fill: "#cbd5e1", fontSize: 10 } })));
      setAiOpen(false); setTimeout(() => instance?.fitView({ padding: .16 }), 80);
    } catch (err) { setError(err.message || "Could not generate this canvas."); } finally { setLoading(false); }
  };
  const empty = useMemo(() => !nodes.length, [nodes.length]);
  const manualTools = [{ icon: StickyNote, label: "Sticky note", kind: "note", value: "New thought" }, { icon: Type, label: "Text", kind: "text", value: "Heading" }, { icon: LayoutPanelTop, label: "Card", kind: "card", value: "New card" }, { icon: Users, label: "Persona", kind: "person", value: "User / stakeholder" }, { icon: Frame, label: "Frame", kind: "frame", value: "New area" }];
  const shapes = [{ icon: RectangleHorizontal, label: "Rectangle", shape: "rectangle" }, { icon: Circle, label: "Ellipse", shape: "ellipse" }, { icon: Diamond, label: "Decision", shape: "diamond" }, { icon: FileText, label: "Document", shape: "document" }];
  return <div style={{ flex: 1, minHeight: 0, display: "flex", background: "#0b1020", fontFamily: "Inter,system-ui,sans-serif" }}>
    <aside style={{ width: 244, background: "#111827", borderRight: "1px solid #263047", padding: 14, display: "flex", flexDirection: "column", gap: 18, color: "#e5e7eb" }}>
      <div><div style={{ display: "flex", alignItems: "center", gap: 7, color: "#c4b5fd", fontWeight: 800, fontSize: 13 }}><Wand2 size={15} /> Canvas Studio</div><p style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.6, margin: "7px 0 0" }}>An open canvas for ideas, product flows, workshops, docs, and technical design.</p></div>
      <button onClick={() => setAiOpen(true)} style={{ border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", padding: "10px", cursor: "pointer", fontWeight: 800, fontSize: 11, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}><Sparkles size={13} /> Create with AI</button>
      <div><div style={{ color: "#94a3b8", fontSize: 9, fontWeight: 800, letterSpacing: ".1em", marginBottom: 8 }}>MANUAL TOOLS</div>{manualTools.map(tool => <button key={tool.label} onClick={() => add(tool.kind, tool.value)} style={{ width: "100%", border: "1px solid transparent", borderRadius: 7, background: "transparent", color: "#d1d5db", padding: "8px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textAlign: "left", fontSize: 11 }} onMouseEnter={event => event.currentTarget.style.background = "#1f2937"} onMouseLeave={event => event.currentTarget.style.background = "transparent"}><tool.icon size={13} color="#a78bfa" />{tool.label}</button>)}</div>
      <div><div style={{ color: "#94a3b8", fontSize: 9, fontWeight: 800, letterSpacing: ".1em", marginBottom: 8 }}>SHAPES</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>{shapes.map(tool => <button key={tool.label} onClick={() => add("card", tool.label, undefined, tool.shape)} style={{ border: "1px solid #263047", borderRadius: 6, background: "#0b1020", color: "#cbd5e1", padding: "7px 3px", cursor: "pointer", fontSize: 8.5, display: "grid", gap: 3, placeItems: "center" }}><tool.icon size={15} color="#c4b5fd" />{tool.label}</button>)}</div></div>
      <div><div style={{ color: "#94a3b8", fontSize: 9, fontWeight: 800, letterSpacing: ".1em", marginBottom: 8 }}>CANVAS MODE</div><div style={{ display: "flex", gap: 4 }}><button onClick={() => setActiveTool("select")} title="Select and move" style={modeButton(activeTool === "select")}><MousePointer2 size={13} /></button><button onClick={() => setActiveTool("draw")} title="Freehand draw" style={modeButton(activeTool === "draw")}><PenLine size={13} /></button><button onClick={() => { setStrokes([]); setActiveTool("select"); }} title="Erase all drawing" style={modeButton(false)}><Eraser size={13} /></button></div></div>
      <div style={{ marginTop: "auto", borderTop: "1px solid #263047", paddingTop: 12, color: "#64748b", fontSize: 9, lineHeight: 1.6 }}>Drag to position. Connect handles to show relationships. Click text to edit. Use the pen for freehand annotations.</div>
    </aside>
    <main ref={wrapper} style={{ flex: 1, position: "relative", cursor: activeTool === "draw" ? "crosshair" : "default" }}><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onInit={setInstance} fitView defaultEdgeOptions={{ animated: true }}><Background variant={BackgroundVariant.Dots} gap={24} color="#253047" /><Controls /><MiniMap nodeColor="#8b5cf6" /></ReactFlow>{activeTool === "draw" && <svg onPointerDown={beginDraw} onPointerMove={continueDraw} onPointerUp={finishDraw} onPointerLeave={finishDraw} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 7, touchAction: "none" }}>{strokes.map(stroke => <polyline key={stroke.id} points={stroke.points.map(point => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />)}{drawing?.length > 1 && <polyline points={drawing.map(point => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}</svg>}{empty && <div style={{ pointerEvents: "none", position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", color: "#94a3b8" }}><div><Lightbulb size={36} style={{ color: "#a78bfa", marginBottom: 10 }} /><div style={{ color: "#e5e7eb", fontWeight: 800, fontSize: 15 }}>Start with an idea</div><div style={{ fontSize: 11, marginTop: 5 }}>Use AI to shape it, or add cards and sticky notes yourself.</div></div></div>}</main>
    {aiOpen && <div style={{ position: "fixed", inset: 0, zIndex: 10030, background: "rgba(0,0,0,.65)", display: "grid", placeItems: "center" }}><div style={{ width: 560, maxWidth: "calc(100vw - 30px)", background: "#111827", border: "1px solid #374151", borderRadius: 12, padding: 18, color: "#e5e7eb" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><div style={{ fontWeight: 800, display: "flex", gap: 7, alignItems: "center" }}><Bot size={16} color="#a78bfa" /> AI Canvas co-pilot</div><button onClick={() => setAiOpen(false)} style={{ border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button></div><textarea autoFocus value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Example: plan an onboarding experience for a music-learning app" rows={4} style={{ width: "100%", boxSizing: "border-box", background: "#0b1020", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb", padding: 10, resize: "vertical", outline: "none" }} /><div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "11px 0" }}>{AI_TYPES.map(type => <button key={type} onClick={() => setFormat(type)} style={{ border: `1px solid ${format === type ? "#a78bfa" : "#374151"}`, borderRadius: 20, background: format === type ? "#7c3aed22" : "transparent", color: format === type ? "#ddd6fe" : "#94a3b8", padding: "5px 9px", textTransform: "capitalize", cursor: "pointer", fontSize: 10 }}>{type === "mindmap" ? "Mind map" : type === "journey" ? "User journey" : type}</button>)}</div>{error && <div style={{ fontSize: 10, color: "#fca5a5", marginBottom: 8 }}>{error}</div>}<button disabled={!prompt.trim() || loading} onClick={generate} style={{ width: "100%", border: "none", borderRadius: 8, padding: 10, cursor: loading ? "wait" : "pointer", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", fontWeight: 800, fontSize: 11 }}>{loading ? "Creating canvas…" : "Generate canvas"}</button></div></div>}
  </div>;
}

const modeButton = (active) => ({ flex: 1, height: 30, border: `1px solid ${active ? "#a78bfa" : "#263047"}`, borderRadius: 6, background: active ? "#7c3aed33" : "#0b1020", color: active ? "#ddd6fe" : "#94a3b8", cursor: "pointer", display: "grid", placeItems: "center" });
