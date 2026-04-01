import { MarkerType } from "reactflow";

// ── Auto-layout (simple left→right DAG using topological sort) ────────────────
export function autoLayout(nodes, edges) {
  if (!nodes.length) return nodes;

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = { ...n, rank: 0 }; });

  // Build adjacency & compute ranks via longest path
  const inEdges = {};
  nodes.forEach(n => { inEdges[n.id] = []; });
  edges.forEach(e => { if (inEdges[e.target]) inEdges[e.target].push(e.source); });

  const getRank = (id, visited = new Set()) => {
    if (visited.has(id)) return 0;
    visited.add(id);
    const preds = inEdges[id] || [];
    if (!preds.length) return 0;
    return 1 + Math.max(...preds.map(p => getRank(p, new Set(visited))));
  };

  const ranks = {};
  nodes.forEach(n => { ranks[n.id] = getRank(n.id); });

  // Group by rank
  const cols = {};
  nodes.forEach(n => {
    const r = ranks[n.id];
    if (!cols[r]) cols[r] = [];
    cols[r].push(n.id);
  });

  const COL_W = 260, ROW_H = 140;
  const positioned = { ...nodeMap };

  Object.keys(cols).sort((a,b) => a-b).forEach(rank => {
    const ids = cols[rank];
    ids.forEach((id, i) => {
      positioned[id] = {
        ...positioned[id],
        position: {
          x: parseInt(rank) * COL_W + 60,
          y: i * ROW_H + 60 - ((ids.length - 1) * ROW_H) / 2 + 300,
        },
      };
    });
  });

  return nodes.map(n => ({ ...n, position: positioned[n.id].position }));
}

// ── Flow validation ───────────────────────────────────────────────────────────
export function validateFlow(nodes, edges) {
  const issues = [];
  const nodeIds = new Set(nodes.map(n => n.id));

  // 1. Orphan nodes (no connections)
  const connected = new Set();
  edges.forEach(e => { connected.add(e.source); connected.add(e.target); });
  nodes.forEach(n => {
    if (!connected.has(n.id) && n.type !== "noteNode" && n.type !== "groupNode") {
      issues.push({ type: "warning", nodeId: n.id, message: `"${n.data?.label}" is not connected to anything` });
    }
  });

  // 2. Dangling edges
  edges.forEach(e => {
    if (!nodeIds.has(e.source)) issues.push({ type: "error", message: `Edge has missing source: ${e.source}` });
    if (!nodeIds.has(e.target)) issues.push({ type: "error", message: `Edge has missing target: ${e.target}` });
  });

  // 3. Check for I/O nodes
  const hasInput  = nodes.some(n => n.data?.nodeType === "io" && (n.data?.label?.toLowerCase().includes("input") || n.data?.label?.toLowerCase().includes("trigger")));
  const hasOutput = nodes.some(n => n.data?.nodeType === "io" && (n.data?.label?.toLowerCase().includes("response") || n.data?.label?.toLowerCase().includes("output")));
  if (nodes.length > 1 && !hasInput)  issues.push({ type: "info",    message: "No input node found — consider adding a User Input node" });
  if (nodes.length > 1 && !hasOutput) issues.push({ type: "info",    message: "No output node found — consider adding a Final Response node" });

  return issues;
}

// ── JSON Export ───────────────────────────────────────────────────────────────
export function exportFlowJSON(name, nodes, edges, tags = [], description = "") {
  const data = {
    version: "1.0",
    name,
    description,
    tags,
    exportedAt: new Date().toISOString(),
    nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
    edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, label: e.label || "" })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name.replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── JSON Import ───────────────────────────────────────────────────────────────
export function importFlowJSON(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.nodes || !data.edges) throw new Error("Invalid flow file — missing nodes or edges");
      const edgeStyle = {
        animated: true,
        style: { stroke: "#818cf8", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8", width: 14, height: 14 },
        labelStyle: { fill: "#94a3b8", fontSize: 9, fontFamily: "'DM Mono',monospace" },
        labelBgStyle: { fill: "#161b22", fillOpacity: 0.9 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 3,
      };
      onSuccess({
        name: data.name || "Imported Flow",
        tags: data.tags || [],
        description: data.description || "",
        nodes: data.nodes,
        edges: data.edges.map(e => ({ ...e, ...edgeStyle })),
      });
    } catch (err) { onError(err.message); }
  };
  reader.readAsText(file);
}

// ── SVG Export ────────────────────────────────────────────────────────────────
export function exportFlowSVG(rfInstance, flowName) {
  if (!rfInstance) return;
  const { x, y, zoom } = rfInstance.getViewport();
  const vb = rfInstance.getNodes();
  if (!vb.length) { alert("Canvas is empty"); return; }

  // Get bounding box
  const xs = vb.map(n => n.position.x);
  const ys = vb.map(n => n.position.y);
  const minX = Math.min(...xs) - 40;
  const minY = Math.min(...ys) - 40;
  const maxX = Math.max(...xs) + 240;
  const maxY = Math.max(...ys) + 140;
  const W = maxX - minX, H = maxY - minY;

  // Build SVG node rectangles
  const nodesSvg = vb.map(n => {
    const col = n.data?.colorKey;
    const colors = { agent:"#818cf8", llm:"#a78bfa", prompt:"#22d3ee", vectordb:"#34d399", datasource:"#fbbf24", tool:"#f87171", memory:"#f472b6", processing:"#94a3b8", io:"#38bdf8", aws:"#fb923c", azure:"#60a5fa", databricks:"#fc8181", mcp:"#c084fc" };
    const accent = colors[col] || "#818cf8";
    const nx = n.position.x - minX, ny = n.position.y - minY;
    return `
      <g transform="translate(${nx},${ny})">
        <rect x="0" y="0" width="190" height="70" rx="10" fill="#161b22" stroke="${accent}" stroke-width="1.5"/>
        <rect x="0" y="0" width="190" height="2" rx="1" fill="${accent}"/>
        <text x="36" y="22" font-family="monospace" font-size="11" font-weight="bold" fill="#e6edf3">${(n.data?.label||"").substring(0,22)}</text>
        <text x="36" y="36" font-family="monospace" font-size="8" fill="${accent}" text-transform="uppercase">${(n.data?.nodeType||"").toUpperCase()}</text>
        <text x="10" y="56" font-family="monospace" font-size="8.5" fill="#8b949e">${(n.data?.sub||"").substring(0,28)}</text>
      </g>`;
  }).join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#010409"/>
  ${nodesSvg}
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(flowName||"flow").replace(/\s+/g,"_")}.svg`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── PNG Export ────────────────────────────────────────────────────────────────
export function exportFlowPNG(el, flowName) {
  if (!el) return alert("Use Cmd+Shift+4 to screenshot");
  const run = () => window.html2canvas(el, { backgroundColor: "#010409", scale: 2 }).then(canvas => {
    const a = document.createElement("a");
    a.download = `${(flowName||"flow").replace(/\s+/g,"_")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
  if (!window.html2canvas) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = run;
    document.head.appendChild(s);
  } else run();
}
