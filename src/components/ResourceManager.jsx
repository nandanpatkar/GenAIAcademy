import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, File, Download, Upload, Video, Search, Globe, BookOpen, Trash2,
  ArrowLeft, Play, FolderOpen, FileText, Link, ChevronRight, ChevronDown,
  FolderPlus, X, Plus, Info, Database, Layers, Activity, Clapperboard, Monitor,
  FileCode, FileArchive, MousePointer2, ExternalLink, Brain, Sparkles,
  ChevronLeft, Library, CheckSquare, Network, AlignLeft, Clock,
  ListVideo, Loader2, AlertCircle
} from "lucide-react";
import { getSavedSets, deleteSavedSet, MODE_LABELS } from "../store/savedStudyStore";
import { AIResult } from "./AIStudyContent";
import YouTubeThumbnail from './YouTubeThumbnail';
import "../styles/ResourceManager.css";

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
        (obj.videos || []).forEach((v, _idx) => videos.push({
          ...v,
          _idx,
          parentId: obj.id,
          source: src,
          pathColor: pColor,
          pathKey: pKey,
          nodeId: nId,
          moduleId: mId || (obj.subtopics ? obj.id : null) // If obj is a module, it has subtopics
        }));
        (obj.files || []).forEach((f, _idx) => files.push({ ...f, _idx, parentId: obj.id, source: src, pathColor: pColor, pathKey: pKey, nodeId: nId, moduleId: mId }));
        (obj.links || []).forEach((l, _idx) => links.push({ ...l, _idx, parentId: obj.id, source: src, pathColor: pColor, pathKey: pKey, nodeId: nId, moduleId: mId }));
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

  const addAssets = (type, dataArray) => {
    if (!dataArray.length) return;
    if (selected.type === 'custom_folder') {
      const newAssets = dataArray.map(d => ({ id: 'a-'+Date.now()+'-'+Math.random().toString(36).slice(2), folderId: selected.folderId, assetType: type, ...d }));
      saveCustom({ ...customData, assets: [...customData.assets, ...newAssets] });
      return;
    }
    setPathsData(prev => {
      const next = { ...prev };
      const p = { ...next[selected.pathKey] };
      const key = type === 'video' ? 'videos' : type === 'file' ? 'files' : 'links';

      const push = (obj) => ({ ...obj, [key]: [...(obj[key] || []), ...dataArray] });

      if (selected.type === 'path') next[selected.pathKey] = push(p);
      else if (selected.type === 'node') p.nodes = p.nodes.map(n => n.id === selected.nodeId ? push(n) : n);
      else if (selected.type === 'module') p.nodes = p.nodes.map(n => n.id === selected.nodeId ? { ...n, modules: n.modules.map(m => m.id === selected.module.id ? push(m) : m) } : n);

      next[selected.pathKey] = p;
      return next;
    });
  };

  const addAsset = (type, data) => addAssets(type, [data]);

  const deleteAsset = (type, item) => {
    if (!window.confirm(`Remove "${item.title || item.name}" from this collection?`)) return;

    if (selected.type === 'custom_folder') {
      saveCustom({ ...customData, assets: customData.assets.filter(a => a.id !== item.id) });
      return;
    }

    const key = type === 'video' ? 'videos' : type === 'file' ? 'files' : 'links';
    const removeAt = (arr) => (arr || []).filter((_, idx) => idx !== item._idx);

    setPathsData(prev => {
      const next = { ...prev };
      const p = { ...next[item.pathKey] };

      if (!item.nodeId) {
        p[key] = removeAt(p[key]);
      } else if (!item.moduleId) {
        p.nodes = p.nodes.map(n => n.id === item.nodeId ? { ...n, [key]: removeAt(n[key]) } : n);
      } else {
        p.nodes = p.nodes.map(n => n.id === item.nodeId ? {
          ...n,
          modules: n.modules.map(m => m.id === item.moduleId ? { ...m, [key]: removeAt(m[key]) } : m)
        } : n);
      }

      next[item.pathKey] = p;
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

  // ── YouTube Playlist Import ──
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistUrlInput, setPlaylistUrlInput] = useState("");
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState("");
  const [playlistResult, setPlaylistResult] = useState(null); // { videos: [{...,checked}], skipped }

  const existingVideoIds = useMemo(
    () => new Set(resources.videos.map(v => extractYTId(v.url)).filter(Boolean)),
    [resources.videos]
  );

  const closePlaylistModal = () => {
    setShowPlaylistModal(false);
    setPlaylistUrlInput("");
    setPlaylistError("");
    setPlaylistResult(null);
    setPlaylistLoading(false);
  };

  const handleFetchPlaylist = async () => {
    if (!playlistUrlInput.trim()) return;
    setPlaylistLoading(true);
    setPlaylistError("");
    setPlaylistResult(null);
    try {
      const res = await fetch(`/api/youtube-playlist?url=${encodeURIComponent(playlistUrlInput.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch playlist");
      const videos = data.videos.map(v => ({ ...v, checked: !existingVideoIds.has(v.videoId) }));
      setPlaylistResult({ videos, skipped: data.skipped });
    } catch (err) {
      setPlaylistError(err.message || "Something went wrong while fetching the playlist");
    } finally {
      setPlaylistLoading(false);
    }
  };

  const togglePlaylistVideo = (videoId) => {
    setPlaylistResult(r => ({ ...r, videos: r.videos.map(v => v.videoId === videoId ? { ...v, checked: !v.checked } : v) }));
  };

  const handleImportPlaylist = () => {
    const toImport = playlistResult.videos
      .filter(v => v.checked)
      .map(({ checked, videoId, ...rest }) => rest);
    addAssets('video', toImport);
    closePlaylistModal();
  };

  const activeColor = selected?.type === 'custom_folder' ? '#f59e0b' : pathsData[selected?.pathKey]?.color || "#3b82f6";
  const selectedLabel = selected?.type === 'custom_folder'
    ? selected.folder.name
    : selected?.type === 'module'
      ? selected.module.title
      : selected?.type === 'node'
        ? selected.node.title
        : selected?.type === 'path'
          ? pathsData[selected.pathKey]?.title || selected.pathKey
          : 'Choose a collection';

  return (
    <div className="resource-vault-shell">
      <header className="vault-header">
        <div className="vault-brand">
          <div className="vault-brand-mark" style={{ '--brand-color': activeColor }}>
            <BookOpen size={17} />
            <span />
          </div>
          <div className="vault-brand-copy">
            <div className="vault-eyebrow"><span className="vault-live-dot" /> Personal learning library</div>
            <h1>Discovery Hub</h1>
            <div className="vault-breadcrumbs">
               {breadcrumbs.map((crumb, idx) => (
                 <React.Fragment key={idx}>
                   {idx > 0 && <span className="vault-crumb-separator">/</span>}
                   <span 
                     onClick={crumb.onClick}
                     className={idx === breadcrumbs.length - 1 ? 'is-current' : ''}
                   >
                     {crumb.label}
                   </span>
               </React.Fragment>
             ))}
            </div>
          </div>
        </div>
        <div className="vault-header-actions">
          <div className="vault-header-metrics">
            <span><strong>{resources.videos.length}</strong> videos</span>
            <span><strong>{resources.files.length}</strong> files</span>
            <span><strong>{resources.links.length}</strong> links</span>
          </div>
          <button className="vault-close-btn" onClick={onClose} aria-label="Close resources"><X size={17} /></button>
        </div>
      </header>

      <main className="vault-main">
        {/* Sidebar: Tactical Directory */}
        <aside className="vault-sidebar">
          <div className="vault-sidebar-intro">
            <div>
              <span className="vault-section-label">Library index</span>
              <h2>Browse your space</h2>
            </div>
            <button className="vault-icon-btn" onClick={() => {
              const n = window.prompt("New folder name:");
              if (n) saveCustom({ ...customData, folders: [...customData.folders, { id: 'cf-'+Date.now(), name: n }] });
            }} aria-label="Create folder" title="Create folder"><FolderPlus size={14}/></button>
          </div>
          <div className="vault-sidebar-summary">
            <div className="vault-summary-orb"><Library size={16} /></div>
            <div><strong>{selected ? selectedLabel : 'All resources'}</strong><span>{selected ? 'Current collection' : 'Select a path to explore'}</span></div>
            <Activity size={14} className="vault-summary-signal" />
          </div>
          
          <div className="tree-container mini-scrollbar">
            <div className="vault-tree-label"><span>YOUR FOLDERS</span><em>{customData.folders.length}</em></div>
            {customData.folders.map(f => (
              <div key={f.id} className={`tree-row ${selected?.folderId === f.id ? 'active' : ''}`} style={{ '--path-color': '#f59e0b' }} onClick={() => setSelected({ type: 'custom_folder', folderId: f.id, folder: f })}>
                 <span className="vault-tree-icon vault-folder-icon"><FolderOpen size={14} /></span>
                 <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{f.name}</span>
                 <Trash2 size={12} color="#ef4444" style={{ marginLeft: 'auto', opacity: 0.4 }} onClick={(e) => { e.stopPropagation(); saveCustom({ ...customData, folders: customData.folders.filter(fx => fx.id !== f.id) }); }} />
              </div>
            ))}

            <div className="vault-tree-label ecosystem-label"><span>ECOSYSTEM PATHS</span><em>{Object.keys(pathsData).length}</em></div>
            
            {Object.entries(pathsData).map(([pk, p]) => (
              <div key={pk} className="tree-item">
                <div className={`tree-row ${selected?.type === 'path' && selected.pathKey === pk ? 'active' : ''}`} style={{ '--path-color': p.color }} onClick={() => setSelected({ type: 'path', pathKey: pk })}>
                  <ChevronRight size={12} style={{ transform: expandedPaths[pk] ? 'rotate(90deg)' : 'none', transition: '0.2s' }} onClick={(e) => { e.stopPropagation(); setExpandedPaths(ex => ({ ...ex, [pk]: !ex[pk] })); }} />
                  <span className="vault-tree-icon vault-path-icon"><Network size={14} /></span>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', fontFamily: "var(--font)" }}>{p.title || pk}</span>
                </div>
                
                {expandedPaths[pk] && p.nodes?.map(n => (
                  <div key={n.id} className="tree-sub-group" style={{ position: 'relative' }}>
                    <div className="tree-row-line" style={{ background: p.color, left: 24, opacity: 0.2 }} />
                    <div className={`tree-row ${selected?.nodeId === n.id ? 'active' : ''}`} style={{ paddingLeft: 32, '--path-color': p.color }} onClick={() => setSelected({ type: 'node', pathKey: pk, nodeId: n.id, node: n })}>
                      <ChevronRight size={10} style={{ transform: expandedNodes[n.id] ? 'rotate(90deg)' : 'none', transition: '0.2s' }} onClick={(e) => { e.stopPropagation(); setExpandedNodes(ex => ({ ...ex, [n.id]: !ex[n.id] })); }} />
                      <span className="vault-tree-icon vault-node-icon"><Layers size={13} /></span>
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{n.title}</span>
                    </div>

                    {expandedNodes[n.id] && n.modules?.map(m => (
                      <div key={m.id} className={`tree-row ${selected?.module?.id === m.id ? 'active' : ''}`} style={{ paddingLeft: 52, '--path-color': p.color }} onClick={() => setSelected({ type: 'module', pathKey: pk, nodeId: n.id, module: m })}>
                        <span className="vault-module-icon"><span /></span>
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
        <section className="vault-dashboard">
          <div className="vault-dashboard-hero">
            <div className="vault-hero-copy">
              <span className="vault-section-label"><Sparkles size={12} /> Curated workspace</span>
              <h2>Everything you need,<br /><span>right where you left it.</span></h2>
              <p>Collect videos, files, links, and generated study sets without losing the context that makes them useful.</p>
            </div>
            <div className="vault-hero-visual" aria-hidden="true">
              <div className="vault-hero-ring ring-one" /><div className="vault-hero-ring ring-two" />
              <div className="vault-hero-core"><BookOpen size={18} /><span>LIBRARY<br />CORE</span></div>
              <div className="vault-hero-orbit orbit-one"><Video size={12} /></div><div className="vault-hero-orbit orbit-two"><Link size={12} /></div><div className="vault-hero-orbit orbit-three"><Brain size={12} /></div>
            </div>
          </div>
          <div className="dashboard-toolbar">
            <div className="vault-tab-switcher"
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
                     <small>{filtered[t.id]?.length || 0}</small>
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
            <div className="admin-search-wrapper vault-search">
               <Search size={14} />
               <input placeholder="Search your library..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '8px 12px 8px 40px', borderRadius: 10, fontSize: 13 }} />
            </div>
          </div>

          <div className="asset-scroll-area mini-scrollbar">
            {!selected ? (
              <div className="vault-empty-state">
                 <div className="vault-empty-icon"><MousePointer2 size={22} /></div>
                 <span className="vault-section-label">Start exploring</span>
                 <h3>Pick a collection to unlock your resources</h3>
                 <p>Choose an ecosystem path or one of your folders from the library index.</p>
                 <div className="vault-empty-hints"><span><Database size={13} /> Ecosystem paths</span><span><Folder size={13} /> Personal folders</span><span><Search size={13} /> Instant search</span></div>
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
                          {(isEditMode || selected.type === 'custom_folder') && (
                            <button
                              className="asset-delete-btn"
                              onClick={(e) => { e.stopPropagation(); deleteAsset('video', v); }}
                              aria-label="Remove video"
                              title="Remove video"
                            ><Trash2 size={13} /></button>
                          )}
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
                      <div className="video-premium-card add-tile" style={{ border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 160, background: 'transparent' }}>
                        <div onClick={() => {
                          const u = window.prompt("YouTube URL:");
                          if (u) addAsset('video', { title: "New Asset", url: u, channel: "System", duration: "--", views: "0" });
                        }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', padding: 8 }}>
                          <Plus size={22} color="var(--text3)" />
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>ADD VIDEO</span>
                        </div>
                        <div style={{ width: '60%', height: 1, background: 'var(--border)' }} />
                        <div onClick={() => setShowPlaylistModal(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', padding: 8 }}>
                          <ListVideo size={22} color="var(--text3)" />
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>IMPORT PLAYLIST</span>
                        </div>
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
                           {(isEditMode || selected.type === 'custom_folder') && (
                             <Trash2
                               size={14}
                               color="#ef4444"
                               style={{ opacity: 0.5, cursor: 'pointer' }}
                               onClick={(e) => { e.stopPropagation(); deleteAsset('file', f); }}
                               aria-label="Remove file"
                             />
                           )}
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
                         {(isEditMode || selected.type === 'custom_folder') && (
                           <Trash2
                             size={14}
                             color="#ef4444"
                             style={{ opacity: 0.5, cursor: 'pointer' }}
                             onClick={(e) => { e.stopPropagation(); deleteAsset('link', l); }}
                             aria-label="Remove link"
                           />
                         )}
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

      {showPlaylistModal && (
        <div
          className="playlist-modal-overlay"
          onClick={closePlaylistModal}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}
        >
          <div
            className="playlist-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(560px, 92vw)', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
              background: 'var(--bg2, #14151a)', border: '1px solid var(--border)', borderRadius: 16,
              padding: 24, gap: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ListVideo size={18} color={activeColor} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Import YouTube playlist</h3>
              </div>
              <button
                onClick={closePlaylistModal}
                aria-label="Close"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}
              ><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                autoFocus
                placeholder="Paste a YouTube playlist URL..."
                value={playlistUrlInput}
                onChange={(e) => setPlaylistUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !playlistLoading && handleFetchPlaylist()}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)',
                  background: 'var(--bg4)', color: 'var(--text)', fontSize: 13
                }}
              />
              <button
                onClick={handleFetchPlaylist}
                disabled={playlistLoading || !playlistUrlInput.trim()}
                style={{
                  padding: '10px 16px', borderRadius: 10, border: 'none',
                  background: activeColor, color: '#0a0a0a', fontWeight: 800, fontSize: 12,
                  cursor: playlistLoading ? 'not-allowed' : 'pointer', opacity: playlistLoading || !playlistUrlInput.trim() ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}
              >
                {playlistLoading ? <Loader2 size={14} className="spin" /> : null}
                {playlistLoading ? 'FETCHING' : 'FETCH'}
              </button>
            </div>

            {playlistError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 12px' }}>
                <AlertCircle size={14} /> {playlistError}
              </div>
            )}

            {playlistResult && (
              <>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700 }}>
                  {playlistResult.videos.length} video{playlistResult.videos.length !== 1 ? 's' : ''} found
                  {playlistResult.skipped > 0 ? ` · ${playlistResult.skipped} unavailable video${playlistResult.skipped !== 1 ? 's' : ''} skipped` : ''}
                </div>
                <div className="mini-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
                  {playlistResult.videos.map(v => (
                    <label
                      key={v.videoId}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10,
                        background: 'var(--bg4)', cursor: 'pointer', opacity: existingVideoIds.has(v.videoId) ? 0.55 : 1
                      }}
                    >
                      <input type="checkbox" checked={v.checked} onChange={() => togglePlaylistVideo(v.videoId)} />
                      <img src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`} alt="" style={{ width: 44, height: 33, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                          {v.channel} · {v.duration}{existingVideoIds.has(v.videoId) ? ' · already added' : ''}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleImportPlaylist}
                  disabled={!playlistResult.videos.some(v => v.checked)}
                  style={{
                    padding: '12px', borderRadius: 10, border: 'none', background: activeColor, color: '#0a0a0a',
                    fontWeight: 800, fontSize: 12, cursor: 'pointer',
                    opacity: playlistResult.videos.some(v => v.checked) ? 1 : 0.5
                  }}
                >
                  IMPORT {playlistResult.videos.filter(v => v.checked).length} SELECTED
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
