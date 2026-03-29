import React, { useState, useMemo } from 'react';
import { Folder, File, Link as LinkIcon, Download, Upload, Video, Search, Globe, BookOpen, Trash2, ArrowLeft, Play, FolderOpen, FileText, Link, ChevronRight, ChevronDown, FolderPlus } from "lucide-react";

const FILE_ICONS = { pdf: "📄", doc: "📝", docx: "📝", ipynb: "📓", pptx: "📊", default: "📁" };

export default function ResourceManager({ pathsData, setPathsData, onClose, isEditMode }) {
  const [expandedPaths, setExpandedPaths] = useState({});
  const [expandedNodes, setExpandedNodes] = useState({});
  
  // Custom standalone folders logic
  const [customData, setCustomData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('genai_custom_resources')) || { folders: [], assets: [] };
    } catch { return { folders: [], assets: [] }; }
  });

  const saveCustom = (data) => {
    setCustomData(data);
    localStorage.setItem('genai_custom_resources', JSON.stringify(data));
  };

  // selected = { type: 'path' | 'node' | 'module' | 'custom_folder', pathKey, nodeId, module, folderId, folder }
  const [selected, setSelected] = useState(null);
  
  const [tab, setTab] = useState("videos");
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const togglePath = (e, key) => {
    e.stopPropagation();
    setExpandedPaths(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNode = (e, id) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectPath = (pathKey) => {
    setSelected({ type: 'path', pathKey });
  };

  const handleSelectNode = (pathKey, node) => {
    setSelected({ type: 'node', pathKey, nodeId: node.id, node });
  };

  const handleSelectModule = (pathKey, nodeId, module) => {
    setSelected({ type: 'module', pathKey, nodeId, module });
  };

  const handleNewCustomFolder = () => {
    const name = window.prompt("Enter new resource folder name:");
    if (!name?.trim()) return;
    const newFolder = { id: 'cf-' + Date.now(), name: name.trim() };
    saveCustom({ ...customData, folders: [...customData.folders, newFolder] });
    setSelected({ type: 'custom_folder', folderId: newFolder.id, folder: newFolder });
  };

  const deleteCustomFolder = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Delete this folder and all its resources?")) {
      const remainingFolders = customData.folders.filter(f => f.id !== id);
      const remainingAssets = customData.assets.filter(a => a.folderId !== id);
      saveCustom({ folders: remainingFolders, assets: remainingAssets });
      if (selected?.type === 'custom_folder' && selected.folderId === id) {
         setSelected(null);
      }
    }
  };

  const deleteCustomAsset = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Remove this asset?")) {
      saveCustom({ ...customData, assets: customData.assets.filter(a => a.id !== id) });
    }
  };

  // Aggregation Logic
  const getAggregatedResources = () => {
    let videos = [];
    let files = [];
    let links = [];

    if (!selected) return { videos, files, links };

    if (selected.type === 'custom_folder') {
      const folderAssets = customData.assets.filter(a => a.folderId === selected.folderId);
      videos = folderAssets.filter(a => a.assetType === 'video').map(v => ({ ...v, source: selected.folder.name, pathColor: '#f59e0b' }));
      files = folderAssets.filter(a => a.assetType === 'file').map(f => ({ ...f, source: selected.folder.name, pathColor: '#f59e0b' }));
      links = folderAssets.filter(a => a.assetType === 'link').map(l => ({ ...l, source: selected.folder.name, pathColor: '#f59e0b' }));
      return { videos, files, links };
    }

    const extractFromObject = (obj, pathColor) => {
      (obj.videos || []).forEach(v => videos.push({ ...v, parentId: obj.id, source: obj.title || `Path ${selected.pathKey}`, pathColor }));
      (obj.files || []).forEach(f => files.push({ ...f, parentId: obj.id, source: obj.title || `Path ${selected.pathKey}`, pathColor }));
      (obj.links || []).forEach(l => links.push({ ...l, parentId: obj.id, source: obj.title || `Path ${selected.pathKey}`, pathColor }));
    };

    if (selected.type === 'path') {
      const p = pathsData[selected.pathKey];
      if (p) {
        extractFromObject(p, p.color);
        (p.nodes || []).forEach(n => {
          extractFromObject(n, p.color);
          (n.modules || []).forEach(m => extractFromObject(m, p.color));
        });
      }
    } else if (selected.type === 'node') {
      const p = pathsData[selected.pathKey];
      const n = p?.nodes?.find(n => n.id === selected.nodeId);
      if (n) {
        extractFromObject(n, p?.color);
        (n.modules || []).forEach(m => extractFromObject(m, p?.color));
      }
    } else if (selected.type === 'module') {
      const p = pathsData[selected.pathKey];
      const n = p?.nodes?.find(n => n.id === selected.nodeId);
      const m = n?.modules?.find(m => m.id === selected.module.id);
      if (m) {
         extractFromObject(m, p?.color);
      }
    }

    return { videos, files, links };
  };

  const resources = getAggregatedResources();

  // Search filtering logic
  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return resources;
    return {
      videos: resources.videos.filter(v => (v.title||"").toLowerCase().includes(q) || (v.source||"").toLowerCase().includes(q)),
      files: resources.files.filter(f => (f.name||"").toLowerCase().includes(q) || (f.source||"").toLowerCase().includes(q)),
      links: resources.links.filter(l => (l.title||"").toLowerCase().includes(q) || (l.source||"").toLowerCase().includes(q))
    };
  }, [resources, searchQuery]);

  // Helper formats
  const extractYTId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  };

  const getSafeUrl = (url) => {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url) || url.startsWith('/')) return url;
    return `https://${url}`;
  };

  const addAssetToSelected = (assetKey, newAsset) => {
    if (selected?.type === 'custom_folder') {
       saveCustom({ ...customData, assets: [...customData.assets, newAsset] });
       return;
    }
    
    setPathsData(prev => {
      const next = { ...prev };
      const p = { ...next[selected.pathKey] };
      
      if (selected.type === 'path') {
        p[assetKey] = [...(p[assetKey] || []), newAsset];
      } else if (selected.type === 'node') {
        p.nodes = p.nodes.map(n => {
          if (n.id === selected.nodeId) {
            return { ...n, [assetKey]: [...(n[assetKey] || []), newAsset] };
          }
          return n;
        });
      } else if (selected.type === 'module') {
        p.nodes = p.nodes.map(n => {
          if (n.id === selected.nodeId) {
            const updatedModules = (n.modules || []).map(m => {
              if (m.id === selected.module.id) {
                return { ...m, [assetKey]: [...(m[assetKey] || []), newAsset] };
              }
              return m;
            });
            return { ...n, modules: updatedModules };
          }
          return n;
        });
      }
      
      next[selected.pathKey] = p;
      return next;
    });
  };

  const handleAddVideo = () => {
    if (!urlInput) return;
    
    if (selected?.type === 'custom_folder') {
       addAssetToSelected('assets', { id: 'a-' + Date.now(), folderId: selected.folderId, assetType: 'video', title: "YouTube Video", url: urlInput, channel: "External", duration: "--:--", views: "0" });
    } else {
       addAssetToSelected('videos', { title: "YouTube Video", url: urlInput, channel: "External", duration: "--:--", views: "0" });
    }
    setUrlInput("");
  };

  const handleAddLink = () => {
    if (!urlInput) return;

    if (selected?.type === 'custom_folder') {
       addAssetToSelected('assets', { id: 'a-' + Date.now(), folderId: selected.folderId, assetType: 'link', title: urlInput, url: urlInput });
    } else {
       addAssetToSelected('links', { title: urlInput, url: urlInput });
    }
    setUrlInput("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-file-name": encodeURIComponent(file.name) },
        body: file
      });
      const data = await res.json();
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      if (selected?.type === 'custom_folder') {
         addAssetToSelected('assets', { id: 'a-' + Date.now(), folderId: selected.folderId, assetType: 'file', name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB", type: ext, url: data.url });
      } else {
         addAssetToSelected('files', { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB", type: ext, url: data.url });
      }
    } catch (err) {
      alert("Upload failed. Make sure Vite is running and the plugin is active.");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const activeColor = selected?.type === 'path' ? pathsData[selected.pathKey]?.color 
                    : selected?.type === 'node' ? pathsData[selected.pathKey]?.color 
                    : selected?.type === 'module' ? pathsData[selected.pathKey]?.color 
                    : selected?.type === 'custom_folder' ? '#f59e0b'
                    : "#3b82f6";
  const activeTitle = selected?.type === 'path' ? pathsData[selected.pathKey]?.title 
                    : selected?.type === 'node' ? selected.node.title 
                    : selected?.type === 'module' ? selected.module.title 
                    : selected?.type === 'custom_folder' ? selected.folder.name
                    : "Global Resources";
  
  const canEdit = isEditMode || selected?.type === 'custom_folder';

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)", height: "100%", overflow: "hidden", position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: selected?.type === 'custom_folder' ? "#f59e0b" : "#3b82f6", background: selected?.type === 'custom_folder' ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)", padding: 8, borderRadius: 8, display: "flex" }}>
            <BookOpen size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
              {activeTitle} <span style={{ fontSize: 13, background: "var(--bg4)", padding: "2px 8px", borderRadius: 4, color: "var(--text2)" }}>{resources.videos.length + resources.files.length + resources.links.length} assets</span>
            </h2>
            <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>Curriculum Asset Management</div>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} className="rg-btn" style={{ padding: "8px 16px", background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Close Manager</button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", padding: "24px 40px", gap: 24, height: "100%", overflow: "hidden", boxSizing: "border-box" }}>
        
        {/* Left Tree Explorer */}
        <div style={{ width: 320, display: "flex", flexDirection: "column", background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "16px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "1px", display: "flex", alignItems: "center", gap: 8 }}><FolderOpen size={14}/> DIRECTORY</span>
            <button onClick={handleNewCustomFolder} title="New standalone folder" style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", padding: 4, display: "flex" }}><FolderPlus size={16} /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            
            {/* Custom Folders block */}
            {customData.folders.length > 0 && (
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ padding: "8px 16px", fontSize: 11, fontWeight: 800, color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase" }}>My Folders</div>
                {customData.folders.map(f => {
                   const isActive = selected?.type === 'custom_folder' && selected.folderId === f.id;
                   return (
                     <div key={f.id} style={{ display: "flex", flexDirection: "column" }}>
                        <div 
                          onClick={() => setSelected({ type: 'custom_folder', folderId: f.id, folder: f })} 
                          style={{ padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.2s", background: isActive ? "var(--bg4)" : "transparent", borderLeft: isActive ? `3px solid #f59e0b` : "3px solid transparent" }}
                          onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg3)"; }}
                          onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                           <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                             <Folder size={14} color="#f59e0b" style={{flexShrink: 0}} />
                             <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                           </div>
                           <button onClick={(e) => deleteCustomFolder(e, f.id)} title="Delete Folder" style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 }}>
                             <Trash2 size={12} />
                           </button>
                        </div>
                     </div>
                   );
                })}
              </div>
            )}

            <div style={{ padding: "8px 16px", fontSize: 11, fontWeight: 800, color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase" }}>Curriculum</div>
            {Object.keys(pathsData).map(pathKey => {
              const p = pathsData[pathKey];
              const isPathActive = selected?.type === 'path' && selected.pathKey === pathKey;
              return (
                <div key={pathKey} style={{ display: "flex", flexDirection: "column" }}>
                  <div 
                    onClick={() => handleSelectPath(pathKey)} 
                    style={{ padding: "8px 16px", display: "flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s", background: isPathActive ? "var(--bg4)" : "transparent", borderLeft: isPathActive ? `3px solid ${p.color}` : "3px solid transparent" }}
                    onMouseOver={(e) => { if (!isPathActive) e.currentTarget.style.background = "var(--bg3)"; }}
                    onMouseOut={(e) => { if (!isPathActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div onClick={(e) => togglePath(e, pathKey)} style={{ cursor: "pointer", padding: "0 6px 0 0" }}>
                      {expandedPaths[pathKey] ? <ChevronDown size={14} color="var(--text3)" /> : <ChevronRight size={14} color="var(--text3)" />}
                    </div>
                    <Folder size={14} color={p.color} style={{ marginRight: 8, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title || `Path ${pathKey}`}</span>
                  </div>

                  {expandedPaths[pathKey] && (p.nodes || []).map(n => {
                    const isNodeActive = selected?.type === 'node' && selected.nodeId === n.id;
                    return (
                      <div key={n.id} style={{ display: "flex", flexDirection: "column" }}>
                        <div 
                          onClick={() => handleSelectNode(pathKey, n)}
                          style={{ padding: "8px 16px", paddingLeft: 32, display: "flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s", background: isNodeActive ? "var(--bg4)" : "transparent", borderLeft: isNodeActive ? `3px solid ${p.color}80` : "3px solid transparent" }}
                          onMouseOver={(e) => { if (!isNodeActive) e.currentTarget.style.background = "var(--bg3)"; }}
                          onMouseOut={(e) => { if (!isNodeActive) e.currentTarget.style.background = "transparent"; }}
                        >
                          <div onClick={(e) => toggleNode(e, n.id)} style={{ cursor: "pointer", padding: "0 6px 0 0" }}>
                            {expandedNodes[n.id] ? <ChevronDown size={14} color="var(--text3)" /> : <ChevronRight size={14} color="var(--text3)" />}
                          </div>
                          <span style={{ fontSize: 13, color: "var(--text2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</span>
                        </div>

                        {expandedNodes[n.id] && (n.modules || []).map(m => {
                          const isModActive = selected?.type === 'module' && selected.module.id === m.id;
                          return (
                            <div 
                              key={m.id}
                              onClick={() => handleSelectModule(pathKey, n.id, m)}
                              style={{ padding: "8px 16px", paddingLeft: 50, display: "flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s", background: isModActive ? "var(--bg3)" : "transparent" }}
                              onMouseOver={(e) => { if (!isModActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                              onMouseOut={(e) => { if (!isModActive) e.currentTarget.style.background = "transparent"; }}
                            >
                              <div style={{ width: 4, height: 4, background: p.color, borderRadius: "50%", marginRight: 8, opacity: 0.6, flexShrink: 0 }} />
                              <span style={{ fontSize: 13, color: isModActive ? "var(--text)" : "var(--text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Dashboard */}
        <div style={{ flex: 1, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg2)", display: "flex", flexDirection: "column" }}>
          
          <div style={{ padding: "0 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg3)" }}>
            <div style={{ display: "flex", gap: 24 }}>
              {["videos", "files", "links"].map(t => (
                 <div 
                   key={t}
                   onClick={() => setTab(t)}
                   style={{ 
                     padding: "16px 0", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                     color: tab === t ? activeColor : "var(--text3)",
                     borderBottom: tab === t ? `2px solid ${activeColor}` : "2px solid transparent",
                     display: "flex", alignItems: "center", gap: 6
                   }}
                 >
                   {t === "videos" ? <Video size={14} /> : t === "files" ? <FileText size={14} /> : <Link size={14} />} {t}
                   <span style={{ background: "var(--bg4)", color: "var(--text2)", padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>
                     {t === "videos" ? filteredResources.videos.length : t === "files" ? filteredResources.files.length : filteredResources.links.length}
                   </span>
                 </div>
              ))}
            </div>
            
            <div style={{ display: "flex", alignItems: "center", background: "var(--bg1)", padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", width: 240 }}>
              <Search size={14} color="var(--text3)" style={{ marginRight: 8 }} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: "transparent", border: "none", color: "var(--text)", outline: "none", fontSize: 13, width: "100%" }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {!selected ? (
               <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", flexDirection: "column", gap: 12 }}>
                 <FolderOpen size={48} strokeWidth={1} />
                 <span style={{ fontSize: 14 }}>Select a folder from the directory to view resources.</span>
               </div>
            ) : (
              <>
                {/* VIDEOS */}
                {tab === "videos" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {filteredResources.videos.map((v, i) => (
                      <div key={i} className="vid-card" style={{ width: 260 }}>
                        <div className="vid-thumb" onClick={() => v.url && window.open(getSafeUrl(v.url), '_blank')}>
                          {v.url && extractYTId(v.url) ? (
                            <>
                              <img src={`https://img.youtube.com/vi/${extractYTId(v.url)}/maxresdefault.jpg`} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <div className="vid-play" style={{ position: "absolute", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={16} fill="currentColor" strokeWidth={0} /></div>
                            </>
                          ) : (
                            <>
                              <div className="vid-thumb-bg" style={{ color: v.pathColor || activeColor }} />
                              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${v.pathColor || activeColor}15 0%, transparent 60%)` }} />
                              <div className="vid-play" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={16} fill="currentColor" strokeWidth={0} /></div>
                            </>
                          )}
                        </div>
                        <div className="vid-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div className="vid-title" style={{ WebkitLineClamp: 2 }}>{v.title}</div>
                            <div className="vid-meta" style={{ marginTop: 8 }}>
                              <span>{v.channel}</span> <span className="dot">·</span> <span>{v.source}</span>
                            </div>
                          </div>
                          {selected.type === 'custom_folder' && (
                             <button onClick={(e) => deleteCustomAsset(e, v.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 }} title="Remove Asset"><Trash2 size={12} /></button>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredResources.videos.length === 0 && <div style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>No video resources found.</div>}
                  </div>
                )}

                {/* FILES */}
                {tab === "files" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filteredResources.files.map((f, i) => (
                      <div key={i} className="file-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }} onClick={() => f.url && window.open(getSafeUrl(f.url), '_blank')}>
                          <div className="file-icon" style={{ background: "var(--bg3)", padding: 8, borderRadius: 8 }}>{FILE_ICONS[f.type] || FILE_ICONS.default}</div>
                          <div className="file-info">
                            <div className="file-name">{f.name}</div>
                            <div className="file-size" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span>{f.size}</span> <span className="dot">·</span> <span style={{ color: f.pathColor || activeColor }}>{f.source}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="file-dl" onClick={() => f.url && window.open(getSafeUrl(f.url), '_blank')}>↓ DOWNLOAD</div>
                          {selected.type === 'custom_folder' && (
                             <button onClick={(e) => deleteCustomAsset(e, f.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: 8, display: "flex" }} title="Remove Asset"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredResources.files.length === 0 && <div style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>No files found.</div>}
                  </div>
                )}

                {/* LINKS */}
                {tab === "links" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {resources.links.map((l, i) => (
                      <div key={i} className="link-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }} onClick={() => l.url && window.open(getSafeUrl(l.url), '_blank')}>
                           <div className="link-favicon" style={{ background: "var(--bg3)", padding: 8, borderRadius: 8 }}>🔗</div>
                           <div className="link-info">
                             <div className="link-title">{l.title}</div>
                             <div className="link-url" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                               <span>{l.url}</span> <span className="dot">·</span> <span style={{ color: l.pathColor || activeColor }}>{l.source}</span>
                             </div>
                           </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                           <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, cursor: "pointer" }} onClick={() => l.url && window.open(getSafeUrl(l.url), '_blank')}>VISIT ↗</div>
                           {selected.type === 'custom_folder' && (
                              <button onClick={(e) => deleteCustomAsset(e, l.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: 8, display: "flex" }} title="Remove Asset"><Trash2 size={14} /></button>
                           )}
                        </div>
                      </div>
                    ))}
                    {resources.links.length === 0 && <div style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>No links available.</div>}
                  </div>
                )}

                {/* Controls */}
                {canEdit && (
                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px dashed var(--border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 12, textTransform: "uppercase" }}>ATTACH RESOURCES TO THIS FOLDER</div>
                    {tab === "videos" && (
                      <div className="rp-add-row" style={{ maxWidth: 600 }}>
                        <input className="rp-input" placeholder="Paste YouTube URL..." value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddVideo()}/>
                        <button className="rp-add-btn" onClick={handleAddVideo} style={{ background: activeColor, color: "#000" }}>+ Add</button>
                      </div>
                    )}
                    {tab === "links" && (
                      <div className="rp-add-row" style={{ maxWidth: 600 }}>
                        <input className="rp-input" placeholder="Paste External URL..." value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddLink()}/>
                        <button className="rp-add-btn" onClick={handleAddLink} style={{ background: activeColor, color: "#000" }}>+ Add</button>
                      </div>
                    )}
                    {tab === "files" && (
                      <label style={{ display: "block", maxWidth: 600, border: "1.5px dashed var(--border2)", borderRadius: 9, padding: "16px", textAlign: "center", color: "var(--text3)", fontSize: 12, cursor: "pointer", transition: "all .15s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = activeColor; e.currentTarget.style.color = activeColor; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text3)"; }}>
                        {uploading ? "Uploading directly to /public/uploads/ ..." : "+ Upload File (.pdf, .png, .ipynb)..."}
                        <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={uploading} />
                      </label>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
