import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, File, Download, Upload, Video, Search, Globe, BookOpen, Trash2, 
  ArrowLeft, Play, FolderOpen, FileText, Link, ChevronRight, ChevronDown, 
  FolderPlus, X, Plus, Info, Database, Layers, Activity, Clapperboard, Monitor,
  FileCode, FileArchive, MousePointer2, ExternalLink, Brain, Sparkles,
  ChevronLeft, Library, CheckSquare, Network, AlignLeft, Clock
} from "lucide-react";
import { getSavedSets, deleteSavedSet, MODE_LABELS } from "../store/savedStudyStore";
import { AIResult } from "./AIStudyContent";
import YouTubeThumbnail from './YouTubeThumbnail';

const MODE_ICONS = { quiz: CheckSquare, flashcards: Library, mindmap: Network, summary: AlignLeft };

const RESOURCE_TABS = [
  { id: 'videos', label: 'Videos', icon: Clapperboard, color: '#f59e0b' },
  { id: 'files', label: 'Files', icon: FileText, color: '#3b82f6' },
  { id: 'links', label: 'Links', icon: Link, color: '#34d399' },
  { id: 'knowledge', label: 'Knowledge', icon: Brain, color: '#a78bfa' }
];

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const getFileIcon = (type) => {
  const t = (type || "").toLowerCase();
  if (["pdf", "doc", "docx"].includes(t)) return <FileText size={18} />;
  if (["ipynb", "py", "js"].includes(t)) return <FileCode size={18} />;
  if (["zip", "rar", "gz"].includes(t)) return <FileArchive size={18} />;
  return <File size={18} />;
};

export default function ResourceManager({ pathsData, setPathsData, onClose, isEditMode, onVideoSelect }) {
  const [expandedPaths, setExpandedPaths] = useState({});
  const [expandedNodes, setExpandedNodes] = useState({});
  const [customData, setCustomData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('genai_custom_resources')) || { folders: [], assets: [] };
    } catch { return { folders: [], assets: [] }; }
  });

  const saveCustom = (data) => {
    setCustomData(data);
    localStorage.setItem('genai_custom_resources', JSON.stringify(data));
  };

  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("videos");
  const [hoveredTab, setHoveredTab] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [savedSets, setSavedSets] = useState(() => getSavedSets());
  const [viewingSet, setViewingSet] = useState(null);
  const [flip, setFlip] = useState({});

  // Re-sync saved sets
  useEffect(() => {
    if (tab === "knowledge") {
      setSavedSets(getSavedSets());
    }
  }, [tab]);

  // ── Breadcrumb Logic ──
  const breadcrumbs = useMemo(() => {
    if (!selected) return [{ label: "Ecosystem", type: 'root' }];
    const crumbs = [{ label: "Ecosystem", type: 'root', onClick: () => setSelected(null) }];
    
    if (selected.type === 'custom_folder') {
      crumbs.push({ label: "My Folders", type: 'meta' });
      crumbs.push({ label: selected.folder.name, type: 'folder' });
    } else {
      const p = pathsData[selected.pathKey];
      if (p) {
        crumbs.push({ label: p.title || selected.pathKey, type: 'path', onClick: () => setSelected({ type: 'path', pathKey: selected.pathKey }) });
        if (selected.type === 'node' || selected.type === 'module') {
          const n = p.nodes?.find(nx => nx.id === selected.nodeId);
          if (n) {
            crumbs.push({ label: n.title, type: 'node', onClick: () => setSelected({ type: 'node', pathKey: selected.pathKey, nodeId: n.id, node: n }) });
            if (selected.type === 'module') {
              crumbs.push({ label: selected.module.title, type: 'module' });
            }
          }
        }
      }
    }
    return crumbs;
  }, [selected, pathsData]);

  // ── Resource Aggregation ──
  const resources = useMemo(() => {
    let videos = [];
    let files = [];
    let links = [];

    if (!selected) return { videos, files, links };

    if (selected.type === 'custom_folder') {
      const folderAssets = customData.assets.filter(a => a.folderId === selected.folderId);
      videos = folderAssets.filter(a => a.assetType === 'video').map(v => ({ ...v, source: selected.folder.name, pathColor: '#f59e0b' }));
      files = folderAssets.filter(a => a.assetType === 'file').map(f => ({ ...f, source: selected.folder.name, pathColor: '#f59e0b' }));
      links = folderAssets.filter(a => a.assetType === 'link').map(l => ({ ...l, source: selected.folder.name, pathColor: '#f59e0b' }));
    } else {
      const extract = (obj, pKey, nId, mId) => {
        const p = pathsData[pKey] || {};
        const pColor = p.color || "#3b82f6";
        const src = obj.title || p.title || `Path ${pKey}`;
        (obj.videos || []).forEach(v => videos.push({ 
          ...v, 
          parentId: obj.id, 
          source: src, 
          pathColor: pColor,
          pathKey: pKey,
          nodeId: nId,
          moduleId: mId || (obj.subtopics ? obj.id : null) // If obj is a module, it has subtopics
        }));
        (obj.files || []).forEach(f => files.push({ ...f, parentId: obj.id, source: src, pathColor: pColor, pathKey: pKey, nodeId: nId, moduleId: mId }));
        (obj.links || []).forEach(l => links.push({ ...l, parentId: obj.id, source: src, pathColor: pColor, pathKey: pKey, nodeId: nId, moduleId: mId }));
      };

      if (selected.type === 'path') {
        const p = pathsData[selected.pathKey];
        if (p) {
          extract(p, selected.pathKey);
          (p.nodes || []).forEach(n => {
            extract(n, selected.pathKey, n.id);
            (n.modules || []).forEach(m => extract(m, selected.pathKey, n.id, m.id));
          });
        }
      } else if (selected.type === 'node') {
        const p = pathsData[selected.pathKey];
        const n = p?.nodes?.find(nx => nx.id === selected.nodeId);
        if (n) {
          extract(n, selected.pathKey, n.id);
          (n.modules || []).forEach(m => extract(m, selected.pathKey, n.id, m.id));
        }
      } else if (selected.type === 'module') {
        const p = pathsData[selected.pathKey];
        const n = p?.nodes?.find(nx => nx.id === selected.nodeId);
        const m = n?.modules?.find(mx => mx.id === selected.module.id);
        if (m) extract(m, selected.pathKey, n.id, m.id);
      }
    }
    return { videos, files, links };
  }, [selected, pathsData, customData]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    
    // Aggregate Relevant Saved Sets
    let knowledge = [];
    if (!selected || selected.type === 'root') {
      knowledge = savedSets; // Global view
    } else if (selected.type === 'path') {
      const p = pathsData[selected.pathKey];
      knowledge = savedSets.filter(s => {
        // Find if this saved set belongs to any module in this path
        return p.nodes?.some(n => n.modules?.some(m => m.title === s.moduleTitle));
      });
    } else if (selected.type === 'node') {
      knowledge = savedSets.filter(s => selected.node.modules?.some(m => m.title === s.moduleTitle));
    } else if (selected.type === 'module') {
      knowledge = savedSets.filter(s => s.moduleTitle === selected.module.title);
    }

    if (!q) return { ...resources, knowledge };
    
    return {
      videos: resources.videos.filter(v => (v.title||"").toLowerCase().includes(q) || (v.source||"").toLowerCase().includes(q)),
      files: resources.files.filter(f => (f.name||"").toLowerCase().includes(q) || (f.source||"").toLowerCase().includes(q)),
      links: resources.links.filter(l => (l.title||"").toLowerCase().includes(q) || (l.source||"").toLowerCase().includes(q)),
      knowledge: knowledge.filter(k => (k.moduleTitle || "").toLowerCase().includes(q) || (MODE_LABELS[k.mode] || "").toLowerCase().includes(q))
    };
  }, [resources, searchQuery, savedSets, selected, pathsData]);

  // ── Actions ──
  const extractYTId = (url) => url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1];
  const getSafeUrl = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const addAsset = (type, data) => {
    if (selected.type === 'custom_folder') {
      saveCustom({ ...customData, assets: [...customData.assets, { id: 'a-'+Date.now(), folderId: selected.folderId, assetType: type, ...data }] });
      return;
    }
    setPathsData(prev => {
      const next = { ...prev };
      const p = { ...next[selected.pathKey] };
      const key = type === 'video' ? 'videos' : type === 'file' ? 'files' : 'links';
      
      const push = (obj) => ({ ...obj, [key]: [...(obj[key] || []), data] });

      if (selected.type === 'path') next[selected.pathKey] = push(p);
      else if (selected.type === 'node') p.nodes = p.nodes.map(n => n.id === selected.nodeId ? push(n) : n);
      else if (selected.type === 'module') p.nodes = p.nodes.map(n => n.id === selected.nodeId ? { ...n, modules: n.modules.map(m => m.id === selected.module.id ? push(m) : m) } : n);
      
      next[selected.pathKey] = p;
      return next;
    });
  };

  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", headers: { "x-file-name": encodeURIComponent(f.name) }, body: f });
      const data = await res.json();
      addAsset('file', { name: f.name, size: (f.size/1048576).toFixed(2)+" MB", type: f.name.split('.').pop(), url: data.url });
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const activeColor = selected?.type === 'custom_folder' ? '#f59e0b' : pathsData[selected?.pathKey]?.color || "#3b82f6";

  return (
    <div className="resource-vault-shell">
      <header className="vault-header sticky-header" style={{ padding: '16px 24px' }}>
        <div className="admin-header-left">
          <div className="admin-logo-orb" style={{ width: 32, height: 32 }}>
             <BookOpen size={16} color={activeColor} />
             <div className="orb-pulse" style={{ background: activeColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.5px', margin: 0, color: 'var(--text)', fontFamily: 'var(--font)' }}>Discovery Hub</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
               {breadcrumbs.map((crumb, idx) => (
                 <React.Fragment key={idx}>
                   {idx > 0 && <span style={{ color: 'var(--text3)', fontSize: 10 }}>/</span>}
                   <span 
                     onClick={crumb.onClick}
                     style={{ 
                       fontSize: 11, cursor: crumb.onClick ? 'pointer' : 'default', 
                       color: idx === breadcrumbs.length - 1 ? 'var(--text)' : 'var(--text3)',
                       fontWeight: idx === breadcrumbs.length - 1 ? 700 : 500
                     }}
                   >
                     {crumb.label}
                   </span>
                 </React.Fragment>
               ))}
            </div>
          </div>
        </div>
        <div className="header-actions">
           {selected && (
             <div style={{ display: 'flex', gap: 8 }}>
                <div className="admin-status-badge active" style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{resources.videos.length} Videos</div>
                <div className="admin-status-badge active" style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{resources.files.length} Files</div>
             </div>
           )}
           <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />
           <button className="admin-close-btn" onClick={onClose} style={{ width: 32, height: 32 }}><X size={16} /></button>
        </div>
      </header>

      <main className="vault-main" style={{ padding: '12px' }}>
        {/* Sidebar: Tactical Directory */}
        <aside className="vault-sidebar" style={{ width: 360 }}>
          <div className="sidebar-header" style={{ padding: '12px 16px' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', letterSpacing: 1.5, fontFamily: "var(--font)" }}>STRATEGIC TOPOLOGY</span>
            <button onClick={() => {
              const n = window.prompt("New folder name:");
              if (n) saveCustom({ ...customData, folders: [...customData.folders, { id: 'cf-'+Date.now(), name: n }] });
            }} className="mini-action-btn" style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}><FolderPlus size={12}/></button>
          </div>
          
          <div className="tree-container mini-scrollbar">
            {customData.folders.map(f => (
              <div key={f.id} className={`tree-row ${selected?.folderId === f.id ? 'active' : ''}`} onClick={() => setSelected({ type: 'custom_folder', folderId: f.id, folder: f })}>
                 <Folder size={14} color="#f59e0b" />
                 <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{f.name}</span>
                 <Trash2 size={12} color="#ef4444" style={{ marginLeft: 'auto', opacity: 0.4 }} onClick={(e) => { e.stopPropagation(); saveCustom({ ...customData, folders: customData.folders.filter(fx => fx.id !== f.id) }); }} />
              </div>
            ))}

            <div style={{ margin: '12px 16px 6px', fontSize: 10, fontWeight: 800, color: 'var(--text3)', letterSpacing: 1, fontFamily: "var(--font)" }}>ECOSYSTEM PATHS</div>
            
            {Object.entries(pathsData).map(([pk, p]) => (
              <div key={pk} className="tree-item">
                <div className={`tree-row ${selected?.type === 'path' && selected.pathKey === pk ? 'active' : ''}`} onClick={() => setSelected({ type: 'path', pathKey: pk })}>
                  <ChevronRight size={12} style={{ transform: expandedPaths[pk] ? 'rotate(90deg)' : 'none', transition: '0.2s' }} onClick={(e) => { e.stopPropagation(); setExpandedPaths(ex => ({ ...ex, [pk]: !ex[pk] })); }} />
                  <Database size={14} color={p.color} />
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', fontFamily: "var(--font)" }}>{p.title || pk}</span>
                </div>
                
                {expandedPaths[pk] && p.nodes?.map(n => (
                  <div key={n.id} className="tree-sub-group" style={{ position: 'relative' }}>
                    <div className="tree-row-line" style={{ background: p.color, left: 24, opacity: 0.2 }} />
                    <div className={`tree-row ${selected?.nodeId === n.id ? 'active' : ''}`} style={{ paddingLeft: 32 }} onClick={() => setSelected({ type: 'node', pathKey: pk, nodeId: n.id, node: n })}>
                      <ChevronRight size={10} style={{ transform: expandedNodes[n.id] ? 'rotate(90deg)' : 'none', transition: '0.2s' }} onClick={(e) => { e.stopPropagation(); setExpandedNodes(ex => ({ ...ex, [n.id]: !ex[n.id] })); }} />
                      <Layers size={13} color={`${p.color}cc`} />
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{n.title}</span>
                    </div>

                    {expandedNodes[n.id] && n.modules?.map(m => (
                      <div key={m.id} className={`tree-row ${selected?.module?.id === m.id ? 'active' : ''}`} style={{ paddingLeft: 52 }} onClick={() => setSelected({ type: 'module', pathKey: pk, nodeId: n.id, module: m })}>
                        <div style={{ width: 4, height: 4, borderRadius: 2, background: p.color, opacity: 0.6 }} />
                        <span style={{ fontSize: 11, color: 'var(--text3)' }}>{m.title}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Dashboard Content */}
        <section className="vault-dashboard" style={{ borderRadius: 20 }}>
          <div className="dashboard-toolbar" style={{ padding: '12px 20px' }}>
            <div 
               style={{ 
                 display: 'flex', 
                 background: 'rgba(255, 255, 255, 0.03)',
                 padding: '4px',
                 borderRadius: '12px',
                 gap: '4px',
                 border: '1px solid rgba(255, 255, 255, 0.08)',
                 position: 'relative',
                 backdropFilter: 'blur(10px)',
                 flexShrink: 0
               }}
               onMouseLeave={() => setHoveredTab(null)}
             >
               <AnimatePresence>
                 {hoveredTab && (
                   <motion.div
                     layoutId="hoverIndicator_res"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     style={{
                       position: 'absolute',
                       top: 4,
                       left: 4,
                       bottom: 4,
                       width: `calc((100% - ${8 + (RESOURCE_TABS.length - 1) * 4}px) / ${RESOURCE_TABS.length})`,
                       background: 'rgba(255, 255, 255, 0.05)',
                       borderRadius: '8px',
                       zIndex: 0,
                       pointerEvents: 'none',
                       x: RESOURCE_TABS.findIndex(t => t.id === hoveredTab) * (100 + (400 / (RESOURCE_TABS.length * 10))) + '%'
                     }}
                   />
                 )}
               </AnimatePresence>

               {RESOURCE_TABS.map(t => {
                 const isActive = tab === t.id;
                 const Icon = t.icon;
                 return (
                   <button 
                     key={t.id}
                     onMouseEnter={() => setHoveredTab(t.id)}
                     onClick={() => { setTab(t.id); setViewingSet(null); }}
                     style={{
                       position: 'relative',
                       zIndex: 1,
                       padding: '6px 14px',
                       borderRadius: 8,
                       fontSize: 11,
                       fontWeight: 700,
                       color: isActive ? t.color : 'var(--text3)',
                       border: 'none',
                       cursor: 'pointer',
                       transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                       background: 'transparent',
                       display: 'flex',
                       alignItems: 'center',
                       gap: 6
                     }}
                   >
                     <Icon size={14} style={{ opacity: isActive ? 1 : 0.6 }} />
                     {t.label}
                     {isActive && (
                       <motion.div
                         layoutId="activePill_res"
                         style={{
                           position: 'absolute',
                           inset: 0,
                           background: `${t.color}15`,
                           border: `1px solid ${t.color}33`,
                           borderRadius: 8,
                           zIndex: -1
                         }}
                       />
                     )}
                   </button>
                 );
               })}
             </div>
            <div className="admin-search-wrapper" style={{ width: 300 }}>
               <Search size={14} />
               <input placeholder="Search study blocks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '8px 12px 8px 40px', borderRadius: 10, fontSize: 13 }} />
            </div>
          </div>

          <div className="asset-scroll-area mini-scrollbar" style={{ padding: '24px' }}>
            {!selected ? (
              <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                 <MousePointer2 size={64} strokeWidth={1} />
                 <p style={{ marginTop: 20, fontWeight: 700, fontSize: 14 }}>Select a topology element to explore assets.</p>
              </div>
            ) : (
              <>
                {tab === 'videos' && (
                  <div className="video-grid">
                    {filtered.videos.map((v, i) => (
                      <div key={i} className="video-premium-card" onClick={() => v.url && onVideoSelect ? onVideoSelect(v) : window.open(getSafeUrl(v.url), '_blank')}>
                        <div className="video-thumb-container">
                          {extractYTId(v.url) ? (
                            <YouTubeThumbnail 
                              url={v.url} 
                              alt={v.title}
                              style={{ width: '100%', height: '100%' }}
                            />
                          ) : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #111, #222)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={32} color="var(--text3)" /></div>}
                          <div className="video-play-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.2)' }}><Play size={20} fill="currentColor" /></div>
                        </div>
                        <div className="video-meta-glass">
                          <div className="video-title">{v.title}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                             <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>{v.source}</span>
                             <ExternalLink size={12} color="var(--text3)" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(isEditMode || selected.type === 'custom_folder') && (
                      <div className="video-premium-card" style={{ border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160, background: 'transparent' }} onClick={() => {
                        const u = window.prompt("YouTube URL:");
                        if (u) addAsset('video', { title: "New Asset", url: u, channel: "System", duration: "--", views: "0" });
                      }}>
                        <Plus size={24} color="var(--text3)" />
                      </div>
                    )}
                  </div>
                )}

                {tab === 'files' && (
                  <div className="file-list">
                    {filtered.files.map((f, i) => (
                      <div key={i} className="file-premium-row" onClick={() => f.url && window.open(getSafeUrl(f.url), '_blank')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                           <div className="file-icon-shell">{getFileIcon(f.type)}</div>
                           <div>
                             <div style={{ fontSize: 13, fontWeight: 700 }}>{f.name}</div>
                             <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{f.size} · {f.source}</div>
                           </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                           <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', cursor: 'pointer' }}>DOWNLOAD</div>
                           <ExternalLink size={14} color="var(--text3)" opacity={0.5} />
                        </div>
                      </div>
                    ))}
                    {(isEditMode || selected.type === 'custom_folder') && (
                      <button className="rg-btn" style={{ padding: '12px', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text3)', borderRadius: 12 }} onClick={() => fileInputRef.current.click()}>
                        {uploading ? "SYNCING..." : "+ ATTACH PAYLOAD"}
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} />
                      </button>
                    )}
                  </div>
                )}

                {tab === 'links' && (
                  <div className="link-hub-grid">
                    {filtered.links.map((l, i) => (
                      <div key={i} className="link-hub-card" onClick={() => l.url && window.open(getSafeUrl(l.url), '_blank')}>
                         <div style={{ background: 'var(--bg4)', padding: 10, borderRadius: 10 }}><Link size={14} color="var(--text2)" /></div>
                         <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{l.source}</div>
                         </div>
                         <ExternalLink size={14} color="var(--text3)" opacity={0.5} />
                      </div>
                    ))}
                    {(isEditMode || selected.type === 'custom_folder') && (
                      <button className="link-hub-card" style={{ border: '1px dashed var(--border)', background: 'transparent', justifyContent: 'center' }} onClick={() => {
                        const u = window.prompt("Target URL:");
                        if (u) addAsset('link', { title: u, url: u });
                      }}><Plus size={16} color="var(--text3)" /></button>
                    )}
                  </div>
                )}

                {tab === 'knowledge' && (
                  <div style={{ animation: "fadeIn 0.3s ease", width: '100%' }}>
                    {viewingSet ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <button 
                          onClick={() => setViewingSet(null)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                            borderRadius: 10, padding: "8px 14px", color: "var(--text2)",
                            fontSize: 12, fontWeight: 700, cursor: "pointer", alignSelf: "flex-start",
                          }}
                          className="hover-node"
                        >
                          <ChevronLeft size={14} /> BACK TO DISCOVERY LIB
                        </button>
                        
                        <div style={{
                          padding: "16px", borderRadius: 16, background: `${activeColor}10`,
                          border: `1px solid ${activeColor}30`,
                        }}>
                          <div style={{ fontSize: 10, fontWeight: 900, color: activeColor, letterSpacing: "1px", marginBottom: 6 }}>
                            {MODE_LABELS[viewingSet.mode]?.toUpperCase()} · {fmtDate(viewingSet.savedAt)}
                          </div>
                          <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 700, marginBottom: 4 }}>
                            {viewingSet.moduleTitle}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text2)", fontStyle: "italic", opacity: 0.8 }}>
                            Contextual knowledge artifacts stored in your workspace.
                          </div>
                        </div>

                        <AIResult 
                          result={viewingSet.data}
                          mode={viewingSet.mode}
                          pathColor={activeColor}
                          flip={flip}
                          setFlip={setFlip}
                        />
                      </div>
                    ) : (
                      <>
                        <div style={{ 
                          fontSize: 10, fontWeight: 800, color: "var(--text3)", 
                          marginBottom: 20, letterSpacing: "1px", textTransform: 'uppercase'
                        }}>
                          ARCHIVED KNOWLEDGE PILLARS ({filtered.knowledge.length})
                        </div>
                        
                        <div className="file-list">
                          {filtered.knowledge.length ? filtered.knowledge.map((s) => {
                            const MIcon = MODE_ICONS[s.mode] || Sparkles;
                            return (
                              <div 
                                key={s.id} 
                                className="file-premium-row" 
                                onClick={() => { setViewingSet(s); setFlip({}); }}
                                style={{ cursor: "pointer" }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                  <div className="file-icon-shell" style={{ background: `${activeColor}15`, border: `1px solid ${activeColor}30` }}>
                                    <MIcon size={16} color={activeColor} />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 700 }}>{MODE_LABELS[s.mode]} - {s.moduleTitle}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <Clock size={10} /> {fmtDate(s.savedAt)}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                   <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        deleteSavedSet(s.id); 
                                        setSavedSets(getSavedSets()); 
                                      }}
                                      style={{
                                        background: "rgba(239,68,68,0.1)", border: "none",
                                        borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                                        color: "#ef4444", fontSize: 10, fontWeight: 700
                                      }}
                                    >
                                      DELETE
                                    </button>
                                   <ExternalLink size={14} color="var(--text3)" opacity={0.5} />
                                </div>
                              </div>
                            );
                          }) : (
                            <div style={{ 
                              textAlign: "center", padding: "60px 40px", 
                              background: "rgba(255,255,255,0.01)", borderRadius: 16, 
                              border: "1px dashed var(--border)", width: '100%', opacity: 0.6
                            }}>
                              <Brain size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: 20 }} />
                              <div style={{ fontSize: 13, color: "var(--text3)", fontWeight: 500 }}>
                                No knowledge artifacts preserved in this scope.<br/>
                                <span style={{ fontSize: 11, opacity: 0.7 }}>Generate study sets in learning modules to see them archived here.</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
