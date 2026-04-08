import React, { useState, useMemo, useRef } from 'react';
import { 
  Folder, File, Download, Upload, Video, Search, Globe, BookOpen, Trash2, 
  ArrowLeft, Play, FolderOpen, FileText, Link, ChevronRight, ChevronDown, 
  FolderPlus, X, Plus, Info, Database, Layers, Activity, Clapperboard, Monitor,
  FileCode, FileArchive, MousePointer2, ExternalLink
} from "lucide-react";

const getFileIcon = (type) => {
  const t = (type || "").toLowerCase();
  if (["pdf", "doc", "docx"].includes(t)) return <FileText size={18} />;
  if (["ipynb", "py", "js"].includes(t)) return <FileCode size={18} />;
  if (["zip", "rar", "gz"].includes(t)) return <FileArchive size={18} />;
  return <File size={18} />;
};

export default function ResourceManager({ pathsData, setPathsData, onClose, isEditMode }) {
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
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
      const extract = (obj, pKey) => {
        const p = pathsData[pKey] || {};
        const pColor = p.color || "#3b82f6";
        const src = obj.title || p.title || `Path ${pKey}`;
        (obj.videos || []).forEach(v => videos.push({ ...v, parentId: obj.id, source: src, pathColor: pColor }));
        (obj.files || []).forEach(f => files.push({ ...f, parentId: obj.id, source: src, pathColor: pColor }));
        (obj.links || []).forEach(l => links.push({ ...l, parentId: obj.id, source: src, pathColor: pColor }));
      };

      if (selected.type === 'path') {
        const p = pathsData[selected.pathKey];
        if (p) {
          extract(p, selected.pathKey);
          (p.nodes || []).forEach(n => {
            extract(n, selected.pathKey);
            (n.modules || []).forEach(m => extract(m, selected.pathKey));
          });
        }
      } else if (selected.type === 'node') {
        const p = pathsData[selected.pathKey];
        const n = p?.nodes?.find(nx => nx.id === selected.nodeId);
        if (n) {
          extract(n, selected.pathKey);
          (n.modules || []).forEach(m => extract(m, selected.pathKey));
        }
      } else if (selected.type === 'module') {
        const p = pathsData[selected.pathKey];
        const n = p?.nodes?.find(nx => nx.id === selected.nodeId);
        const m = n?.modules?.find(mx => mx.id === selected.module.id);
        if (m) extract(m, selected.pathKey);
      }
    }
    return { videos, files, links };
  }, [selected, pathsData, customData]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return resources;
    return {
      videos: resources.videos.filter(v => (v.title||"").toLowerCase().includes(q) || (v.source||"").toLowerCase().includes(q)),
      files: resources.files.filter(f => (f.name||"").toLowerCase().includes(q) || (f.source||"").toLowerCase().includes(q)),
      links: resources.links.filter(l => (l.title||"").toLowerCase().includes(q) || (l.source||"").toLowerCase().includes(q))
    };
  }, [resources, searchQuery]);

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
            <div className="pill-switcher" style={{ '--active-color': activeColor }}>
               <button className={`pill-btn ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')}><Clapperboard size={14}/> Videos</button>
               <button className={`pill-btn ${tab === 'files' ? 'active' : ''}`} onClick={() => setTab('files')}><FileText size={14}/> Files</button>
               <button className={`pill-btn ${tab === 'links' ? 'active' : ''}`} onClick={() => setTab('links')}><Link size={14}/> Links</button>
            </div>
            <div className="admin-search-wrapper" style={{ width: 300 }}>
               <Search size={14} />
               <input placeholder="Search curriculum blocks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '8px 12px 8px 40px', borderRadius: 10, fontSize: 13 }} />
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
                      <div key={i} className="video-premium-card" onClick={() => v.url && window.open(getSafeUrl(v.url), '_blank')}>
                        <div className="video-thumb-container">
                          {extractYTId(v.url) ? (
                            <img src={`https://img.youtube.com/vi/${extractYTId(v.url)}/maxresdefault.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
