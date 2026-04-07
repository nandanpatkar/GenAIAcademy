import React, { useState, useRef } from "react";
import { UploadCloud, FileJson, FileText, CheckCircle, AlertCircle, X, Download } from "lucide-react";
import "../styles/global.css";

export default function ContentStudio({ pathsData, setPathsData, onClose, theme }) {
  const [dragActive, setDragActive] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [activeImportTab, setActiveImportTab] = useState("file"); // "file" | "paste"
  const [rawPasteContent, setRawPasteContent] = useState("");
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setErrorInfo(null);
    setSuccessInfo(null);
    
    // Read contents
    const text = await file.text();
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === "json") {
      try {
        const json = JSON.parse(text);
        if (json.nodes || json.id || json.title) {
          // single path format
          importPath(json);
        } else if (typeof json === "object") {
          // Object maps dictionary of paths
          let count = 0;
          let newPathsData = { ...pathsData };
          for (const key of Object.keys(json)) {
             newPathsData[key] = json[key];
             count++;
          }
          setPathsData(newPathsData);
          setSuccessInfo(`Successfully imported ${count} paths from JSON map.`);
        } else {
          throw new Error("Invalid JSON schema. Ensure it matches the GenAIAcademy path format.");
        }
      } catch (err) {
        setErrorInfo(err.message || "Failed to parse JSON.");
      }
    } else if (ext === "md" || ext === "markdown" || ext === "txt") {
      try {
        const pathObj = parseMarkdown(text, file.name);
        importPath(pathObj);
      } catch (err) {
        setErrorInfo("Failed to parse Markdown: " + err.message);
      }
    } else {
      setErrorInfo(`Unsupported file format: .${ext}. Please use .json or .md`);
    }
  };

  const handlePasteProcess = () => {
    setErrorInfo(null);
    setSuccessInfo(null);
    
    if (!rawPasteContent.trim()) {
      setErrorInfo("Please paste some content first.");
      return;
    }

    const trimmed = rawPasteContent.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      // Treat as JSON
      try {
        const json = JSON.parse(trimmed);
        if (json.nodes || json.id || json.title) {
          importPath(json);
        } else if (typeof json === "object") {
          let count = 0;
          let newPathsData = { ...pathsData };
          for (const key of Object.keys(json)) {
            newPathsData[key] = json[key];
            count++;
          }
          setPathsData(newPathsData);
          setSuccessInfo(`Successfully imported ${count} paths from JSON map.`);
        }
      } catch (err) {
        setErrorInfo("Failed to parse JSON: " + err.message);
      }
    } else {
      // Treat as Markdown
      try {
        const pathObj = parseMarkdown(trimmed, "Pasted Content.md");
        importPath(pathObj);
      } catch (err) {
        setErrorInfo("Failed to parse Markdown: " + err.message);
      }
    }
  };

  const importPath = (pathObj) => {
    const id = pathObj.id || `path-${Date.now()}`;
    
    // Aggregation logic to promote resources from subtopics to module level for UI visibility
    const cleanNodes = (pathObj.nodes || []).map(node => ({
        ...node,
        description: node.description || node.subtitle || "",
        tag: node.tag || "CORE MODULE",
        tagColor: node.tagColor || "#00ff88",
        modules: (node.modules || []).map(mod => {
        const enrichedMod = { ...mod };
        if (!enrichedMod.videos) enrichedMod.videos = [];
        if (!enrichedMod.files) enrichedMod.files = [];
        if (!enrichedMod.links) enrichedMod.links = [];

        (mod.subtopics || []).forEach(topic => {
          if (Array.isArray(topic.resources)) {
            topic.resources.forEach(res => {
              if (res.type === 'video') enrichedMod.videos.push(res);
              else if (res.type === 'file') enrichedMod.files.push(res);
              else enrichedMod.links.push(res);
            });
          }
        });
        return enrichedMod;
      })
    }));

    const cleanPath = {
      id,
      title: pathObj.title || "Imported Path",
      color: pathObj.color || "#8b5cf6",
      nodes: cleanNodes
    };

    setPathsData(prev => ({
      ...prev,
      [cleanPath.id]: cleanPath
    }));

    setSuccessInfo(`Successfully imported path: ${cleanPath.title}`);
  };

  const parseMarkdown = (text, filename) => {
    const newPath = {
      id: `path-${Date.now()}`,
      title: filename.replace('.md', '').replace('.txt', ''),
      color: "#8b5cf6",
      nodes: []
    };
    
    let currentNode = null;
    let currentModule = null;
    
    const lines = text.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      if (line.startsWith('# ')) {
        newPath.title = line.substring(2).trim();
      } else if (line.startsWith('## ')) {
        currentNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: line.substring(3).trim(),
          modules: []
        };
        newPath.nodes.push(currentNode);
        currentModule = null;
      } else if (line.startsWith('### ')) {
        if (!currentNode) {
          currentNode = { id: `node-${Date.now()}`, title: "Core Concepts", modules: [] };
          newPath.nodes.push(currentNode);
        }
        currentModule = {
          id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: line.substring(4).trim(),
          subtopics: [],
          status: "pending"
        };
        currentNode.modules.push(currentModule);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!currentModule) {
          if (!currentNode) {
              currentNode = { id: `node-${Date.now()}`, title: "Core Concepts", modules: [] };
              newPath.nodes.push(currentNode);
          }
          currentModule = { id: `mod-${Date.now()}`, title: "Main Module", subtopics: [], status: "pending" };
          currentNode.modules.push(currentModule);
        }
        currentModule.subtopics.push({
          title: line.substring(2).trim(),
          status: "pending",
          id: `topic-${Math.random().toString(36).substr(2, 9)}`
        });
      }
    }
    return newPath;
  };

  const downloadSampleMD = () => {
    const sample = `# AI Product Management
## Product Strategy
### Understanding User Needs
- Target Audience Analysis
- Pain Points Identification
- Value Proposition Design
### Market Positioning
- Competitor Analysis
- Pricing Strategies

## Technical Feasibility
### Evaluating Models
- LLM Benchmarking
- Cost vs Performance
- Context Window Limitations`;
    
    const blob = new Blob([sample], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_curriculum.md';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const downloadSampleJSON = () => {
    const sample = {
      "id": "system-design-curriculum",
      "title": "System Design Mastery",
      "color": "#6366f1",
      "nodes": [
        {
          "id": "node-basics",
          "title": "System Design Fundamentals",
          "subtitle": "Core syntax, data structures, and algorithms. Foundations for data science.",
          "tag": "READY TO START",
          "tagColor": "#00ff88",
          "modules": [
            {
              "id": "mod-intro",
              "title": "Introduction to System Design",
              "status": "pending",
              "subtopics": [
                {
                  "id": "topic-what-is-sd",
                  "title": "What is System Design?",
                  "status": "pending",
                  "resources": [
                    {
                      "type": "video",
                      "title": "System Design Basics",
                      "url": "https://www.youtube.com/watch?v=UzLMhqg3_Wc"
                    },
                    {
                      "type": "link",
                      "title": "System Design Primer",
                      "url": "https://github.com/donnemartin/system-design-primer"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "node-db",
          "title": "SQL & NoSQL Databases",
          "subtitle": "Relational querying and executing at scale for large data pipelines.",
          "tag": "DATA LAYER",
          "tagColor": "#a855f7",
          "modules": [
            {
              "id": "mod-db-basics",
              "title": "Database Optimization",
              "status": "pending",
              "subtopics": [
                {
                  "id": "topic-indexing",
                  "title": "Indexing Strategies",
                  "status": "pending"
                }
              ]
            }
          ]
        }
      ]
    };
    
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_curriculum.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    paths: Object.keys(pathsData || {}).length,
    nodes: Object.values(pathsData || {}).reduce((acc, p) => acc + (p.nodes?.length || 0), 0)
  };

  return (
    <div className="content-studio-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: "30px 40px", borderBottom: "1px solid var(--border1)", flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, letterSpacing: "-0.03em", color: "var(--text1)" }}>
            Content Studio
          </h1>
          <p style={{ color: "var(--text2)", margin: "8px 0 0", fontSize: "0.95rem" }}>
            Admin dashboard for managing and importing curriculum resources.
          </p>
        </div>
        <button className="rg-btn rg-btn-secondary" onClick={onClose}>
          <X size={18} /> Close Studio
        </button>
      </div>

      <div style={{ padding: "40px", flex: 1, display: 'flex', flexDirection: 'column', gap: "40px", maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
           <div style={{ background: "var(--bg2)", border: "1px solid var(--border1)", borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: "var(--text3)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Total Paths</span>
              <span style={{ color: "var(--text1)", fontSize: "2.5rem", fontWeight: 800 }}>{stats.paths}</span>
           </div>
           <div style={{ background: "var(--bg2)", border: "1px solid var(--border1)", borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: "var(--text3)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Total Nodes</span>
              <span style={{ color: "var(--text1)", fontSize: "2.5rem", fontWeight: 800 }}>{stats.nodes}</span>
           </div>
        </div>

        {/* Upload Section */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border1)", borderRadius: 24, padding: "40px", display: 'flex', flexDirection: 'column', gap: "24px" }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <div>
               <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text1)", margin: "0 0 8px" }}>Bulk Curriculum Importer</h2>
               <p style={{ color: "var(--text2)", margin: 0 }}>Create entire learning paths instantly via file upload or direct paste.</p>
             </div>
             <div style={{ display: 'flex', background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border1)' }}>
               {['file', 'paste'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveImportTab(tab)}
                  style={{ 
                    padding: '6px 16px', 
                    borderRadius: 8, 
                    border: 'none', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    background: activeImportTab === tab ? 'var(--primary)' : 'transparent',
                    color: activeImportTab === tab ? '#000' : 'var(--text3)',
                    transition: 'all 0.2s'
                  }}
                 >
                   {tab}
                 </button>
               ))}
             </div>
           </div>

           {activeImportTab === 'file' ? (
             <div
               onDragEnter={handleDrag}
               onDragLeave={handleDrag}
               onDragOver={handleDrag}
               onDrop={handleDrop}
               style={{
                 border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border2)'}`,
                 background: dragActive ? 'rgba(0,255,136,0.05)' : 'var(--bg)',
                 borderRadius: 20,
                 padding: "60px 20px",
                 textAlign: "center",
                 cursor: "pointer",
                 transition: "all 0.2s ease"
               }}
               onClick={() => fileInputRef.current?.click()}
             >
               <input
                 ref={fileInputRef}
                 type="file"
                 multiple={false}
                 accept=".json,.md,.txt"
                 onChange={handleFileSelect}
                 style={{ display: "none" }}
               />
               <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                 <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <UploadCloud size={32} color={dragActive ? 'var(--accent)' : 'var(--text3)'} />
                 </div>
               </div>
               <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text1)", margin: "0 0 12px" }}>
                 Drag & Drop your file here
               </h3>
               <p style={{ color: "var(--text3)", margin: 0, fontSize: "0.95rem" }}>
                 Supports <FileJson size={14} style={{ display: "inline", verticalAlign: "middle" }}/> .json and <FileText size={14} style={{ display: "inline", verticalAlign: "middle" }}/> .md representations
               </p>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <textarea 
                value={rawPasteContent}
                onChange={e => setRawPasteContent(e.target.value)}
                placeholder="Paste your JSON or Markdown here..."
                className="custom-scrollbar"
                style={{ 
                  width: '100%', 
                  height: 300, 
                  background: 'var(--bg)', 
                  border: '1px solid var(--border1)', 
                  borderRadius: 16, 
                  padding: 20, 
                  color: 'var(--text)', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'none'
                }}
               />
               <div style={{ display: 'flex', gap: 12 }}>
                 <button 
                  className="rg-btn" 
                  onClick={handlePasteProcess}
                  style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: '#000' }}
                 >
                   <CheckCircle size={16} /> Process & Import Content
                 </button>
                 <button 
                  className="rg-btn rg-btn-secondary" 
                  onClick={() => setRawPasteContent("")}
                  style={{ padding: '12px 20px' }}
                 >
                   Clear
                 </button>
               </div>
             </div>
           )}

           {errorInfo && (
             <div style={{ padding: 16, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, color: "#ef4444" }}>
               <AlertCircle size={18} />
               <span>{errorInfo}</span>
             </div>
           )}

           {successInfo && (
             <div style={{ padding: 16, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, color: "#10b981" }}>
               <CheckCircle size={18} />
               <span>{successInfo}</span>
             </div>
           )}

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
              <button className="rg-btn" onClick={downloadSampleJSON} style={{ background: "transparent", border: "1px solid var(--border1)", color: "var(--text2)", flex: 1 }}>
                <FileJson size={15} style={{ marginRight: 8 }} /> Download Sample JSON
              </button>
              <button className="rg-btn" onClick={downloadSampleMD} style={{ background: "transparent", border: "1px solid var(--border1)", color: "var(--text2)", flex: 1 }}>
                <Download size={15} style={{ marginRight: 8 }} /> Download Sample MD
              </button>
            </div>
        </div>

      </div>
    </div>
  );
}
