import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Code2, Copy, Download, FileText, GitBranch, Play, Sparkles } from "lucide-react";

const keyFor = (name) => `genai_playground_doc_v1_${name.replace(/[^a-z0-9]/gi, "_")}`;

const escape = (value = "") => String(value).replace(/[\n\[\]]/g, " ").trim();

export function flowToCode(nodes, edges) {
  const ids = new Map(nodes.map((node, index) => [node.id, `N${index + 1}`]));
  const lines = ["# Gen AI Playground diagram", "# One node or connection per line", ""];
  nodes.forEach(node => lines.push(`${ids.get(node.id)} [${escape(node.data?.label || "Component")}]`));
  if (edges.length) lines.push("");
  edges.forEach(edge => lines.push(`${ids.get(edge.source)} -> ${ids.get(edge.target)}${edge.label ? ` : ${escape(edge.label)}` : ""}`));
  return lines.join("\n");
}

export function codeToFlow(source, existingNodes = []) {
  const declarations = new Map();
  const connections = [];
  source.split("\n").forEach((raw) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const edge = line.match(/^([\w-]+)\s*->\s*([\w-]+)(?:\s*:\s*(.+))?$/);
    if (edge) { connections.push({ from: edge[1], to: edge[2], label: edge[3] || "" }); return; }
    const node = line.match(/^([\w-]+)\s*\[(.+)\]$/);
    if (node) declarations.set(node[1], node[2].trim());
  });
  connections.forEach(({ from, to }) => {
    if (!declarations.has(from)) declarations.set(from, from);
    if (!declarations.has(to)) declarations.set(to, to);
  });
  if (!declarations.size) throw new Error("Add nodes like `API [API Gateway]` and connections like `API -> MODEL : prompt`.");
  const existingByLabel = new Map(existingNodes.map(node => [node.data?.label, node]));
  const idMap = new Map();
  const nodes = [...declarations.entries()].map(([token, label], index) => {
    const known = existingByLabel.get(label);
    const id = `code_${token}_${Date.now()}_${index}`;
    idMap.set(token, id);
    return {
      id, type: "genai", position: { x: 80 + (index % 4) * 260, y: 110 + Math.floor(index / 4) * 160 },
      data: known ? { ...known.data, label } : { label, icon: "Cpu", sub: "Diagram component", nodeType: "component", colorKey: "processing", status: "planned", collapsed: false, inputPort: "any", outputPort: "any" },
    };
  });
  const edges = connections.map(({ from, to, label }, index) => ({ id: `code_edge_${Date.now()}_${index}`, source: idMap.get(from), target: idMap.get(to), label, animated: true }));
  return { nodes, edges };
}

export default function DocsWorkspace({ flowName, nodes, edges, onApplyFlow }) {
  const initialDoc = `# ${flowName}\n\n## Context\nDescribe the problem, users, and constraints.\n\n## Architecture\nThis living design note is linked to the canvas beside it. Update the diagram in the **Diagram as code** tab, then apply it to keep implementation and documentation aligned.\n\n## Decisions\n- Capture the trade-off and why it was chosen.\n\n## Risks & open questions\n- What should we validate before shipping?`;
  const [tab, setTab] = useState("doc");
  const [doc, setDoc] = useState(() => localStorage.getItem(keyFor(flowName)) || initialDoc);
  const [code, setCode] = useState(() => flowToCode(nodes, edges));
  const [status, setStatus] = useState("Saved locally");

  useEffect(() => {
    const timer = setTimeout(() => { localStorage.setItem(keyFor(flowName), doc); setStatus("Saved locally"); }, 450);
    return () => clearTimeout(timer);
  }, [doc, flowName]);
  useEffect(() => setCode(flowToCode(nodes, edges)), [nodes, edges]);

  const diagramMarkdown = useMemo(() => `\n\n---\n\n### Diagram snapshot\n\n${nodes.length} components · ${edges.length} relationships\n\n\`\`\`diagram\n${code}\n\`\`\`\n`, [nodes.length, edges.length, code]);
  const download = (name, content, type) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href);
  };
  const apply = () => {
    try { onApplyFlow(codeToFlow(code, nodes)); setStatus("Diagram applied to canvas"); }
    catch (error) { setStatus(error.message); }
  };

  return <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: "var(--pg-bg)", color: "var(--pg-text)", fontFamily: "'DM Mono', monospace" }}>
    <div style={{ height: 50, display: "flex", alignItems: "center", gap: 6, padding: "0 16px", borderBottom: "1px solid var(--pg-border)", background: "var(--pg-sidebar)" }}>
      {[{ id: "doc", label: "Design doc", icon: FileText }, { id: "code", label: "Diagram as code", icon: Code2 }].map(item => <button key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 6, border: `1px solid ${tab === item.id ? "var(--pg-accent)" : "transparent"}`, background: tab === item.id ? "var(--pg-accent)18" : "transparent", color: tab === item.id ? "var(--pg-text)" : "var(--pg-text3)", cursor: "pointer", font: "inherit", fontSize: 10 }}><item.icon size={12} />{item.label}</button>)}
      <span style={{ marginLeft: 8, fontSize: 9, color: status.includes("applied") ? "#34d399" : "var(--pg-text3)" }}>{status}</span>
      <div style={{ flex: 1 }} />
      <button onClick={() => navigator.clipboard?.writeText(tab === "doc" ? doc : code)} title="Copy" style={toolStyle}><Copy size={12} /></button>
      <button onClick={() => download(`${flowName.replace(/\s+/g, "_")}.${tab === "doc" ? "md" : "diagram.txt"}`, tab === "doc" ? doc + diagramMarkdown : code, "text/plain")} title="Download" style={toolStyle}><Download size={12} /></button>
    </div>
    {tab === "doc" ? <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <textarea value={doc} onChange={e => { setStatus("Saving…"); setDoc(e.target.value); }} spellCheck={false} aria-label="Design document Markdown" style={editorStyle} />
      <article className="pg-doc-preview"><ReactMarkdown>{doc + diagramMarkdown}</ReactMarkdown></article>
    </div> : <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.1fr .9fr" }}>
      <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} aria-label="Diagram source" style={editorStyle} />
      <div style={{ padding: 28, overflow: "auto", borderLeft: "1px solid var(--pg-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--pg-accent)", fontSize: 11, fontWeight: 700 }}><GitBranch size={14} /> Portable diagram source</div>
        <p style={{ color: "var(--pg-text2)", fontSize: 11, lineHeight: 1.7 }}>Use a node declaration per line, then connect tokens. The canvas updates only when you apply, so this is safe to experiment with.</p>
        <pre style={{ padding: 12, border: "1px solid var(--pg-border)", borderRadius: 8, background: "var(--pg-panel)", fontSize: 10, color: "#a5b4fc", lineHeight: 1.7 }}>{"API [API Gateway]\nMODEL [LLM]\nAPI -> MODEL : prompt"}</pre>
        <button onClick={apply} style={{ marginTop: 8, padding: "9px 13px", border: "none", borderRadius: 7, background: "linear-gradient(135deg,#818cf8,#a78bfa)", color: "white", cursor: "pointer", font: "inherit", fontSize: 10, fontWeight: 700, display: "flex", gap: 6, alignItems: "center" }}><Play size={12} /> Apply to canvas</button>
      </div>
    </div>}
    <style>{`.pg-doc-preview{overflow:auto;padding:26px 34px;border-left:1px solid var(--pg-border);font-family:system-ui,sans-serif;font-size:14px;line-height:1.7;color:var(--pg-text2)}.pg-doc-preview h1,.pg-doc-preview h2,.pg-doc-preview h3{color:var(--pg-text);line-height:1.25}.pg-doc-preview code{color:#c4b5fd;background:var(--pg-panel);padding:2px 5px;border-radius:4px}.pg-doc-preview pre{overflow:auto;padding:14px;background:var(--pg-panel);border:1px solid var(--pg-border);border-radius:8px}`}</style>
  </div>;
}

const toolStyle = { width: 28, height: 28, border: "1px solid var(--pg-border2)", borderRadius: 5, background: "transparent", color: "var(--pg-text2)", cursor: "pointer", display: "grid", placeItems: "center" };
const editorStyle = { width: "100%", height: "100%", boxSizing: "border-box", resize: "none", border: "none", outline: "none", padding: 24, background: "var(--pg-bg)", color: "#d1d5db", font: "12px/1.7 'DM Mono',monospace" };
