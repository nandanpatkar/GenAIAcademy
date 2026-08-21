import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NinjaEye } from "./NinjaEye";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, File, Download, Upload, Video, Search, Globe, BookOpen, Trash2,
  ArrowLeft, Play, FolderOpen, FileText, Link, ChevronRight, ChevronDown,
  FolderPlus, X, Plus, Info, Database, Layers, Activity, Clapperboard, Monitor,
  FileCode, FileArchive, MousePointer2, ExternalLink, Brain, Sparkles,
  ChevronLeft, Library, CheckSquare, Network, AlignLeft, Clock,
  ListVideo, Loader2, AlertCircle, RefreshCw, Pin, Tag, CheckCircle2, Circle
} from "lucide-react";
import { getSavedSets, deleteSavedSet, MODE_LABELS } from "../store/savedStudyStore";
import {
  getLocalCustomResources,
  saveLocalCustomResources,
  loadUserCustomResources,
  saveUserCustomResources,
  migrateLocalCustomResourcesToUser,
} from "../store/customResourcesStore";
import { useAuth } from "../contexts/AuthContext";
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
  const { user, loading: authLoading } = useAuth();
  const [customData, setCustomData] = useState(() => getLocalCustomResources());
  const [customSyncError, setCustomSyncError] = useState("");

  // Signed-in users sync "My Folders" to Supabase so it follows their
  // account across devices; guest bookmarks are imported once on first
  // sign-in, same pattern as favoriteBlogsStore/BlogPage.jsx.
  useEffect(() => {
    let alive = true;
    setCustomSyncError("");
    if (authLoading) return () => { alive = false; };

    if (!user?.id) {
      setCustomData(getLocalCustomResources());
      return () => { alive = false; };
    }

    (async () => {
      try {
        await migrateLocalCustomResourcesToUser(user.id);
        const remote = await loadUserCustomResources(user.id);
        if (alive) setCustomData(remote);
      } catch (err) {
        console.error("Could not sync custom resources:", err);
        if (alive) setCustomSyncError("Your folders could not be synced. Changes are saved on this device only.");
      }
    })();

    return () => { alive = false; };
  }, [user?.id, authLoading]);

  // Accepts either a plain object or an updater fn (prev => next), mirroring
  // React's own setState so callers can safely base changes off the latest
  // state rather than a value closed over at click-time. The state updater
  // itself stays pure (React may invoke it more than once, e.g. StrictMode)
  // — it just drops the computed value in a ref "mailbox" for the effect
  // below to actually persist, exactly once per real change.
  const pendingCustomSaveRef = useRef(null);
  const saveCustom = (updater) => {
    setCustomData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      pendingCustomSaveRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    if (pendingCustomSaveRef.current === null) return;
    const payload = pendingCustomSaveRef.current;
    pendingCustomSaveRef.current = null;
    if (user?.id) {
      saveUserCustomResources(user.id, payload).catch((err) => {
        console.error("Could not save custom resources:", err);
        setCustomSyncError("Your latest change could not be synced.");
      });
    } else {
      saveLocalCustomResources(payload);
    }
  }, [customData]);

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
  const keyOf = (type) => type === 'video' ? 'videos' : type === 'file' ? 'files' : 'links';
  const genId = () => 'a-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  // A stable identity for both custom-folder assets (which carry a real id)
  // and pathsData-embedded resources (addressed by their recorded location).
  const keyFor = (item) => item.id || `${item.pathKey}|${item.nodeId || ''}|${item.moduleId || ''}|${item._idx}`;

  /** Applies `transformObj` to whichever path/node/module is currently selected in the tree. */
  const updateSelectedCollection = (transformObj) => {
    setPathsData(prev => {
      const next = { ...prev };
      const p = { ...next[selected.pathKey] };
      if (selected.type === 'path') next[selected.pathKey] = transformObj(p);
      else if (selected.type === 'node') p.nodes = p.nodes.map(n => n.id === selected.nodeId ? transformObj(n) : n);
      else if (selected.type === 'module') p.nodes = p.nodes.map(n => n.id === selected.nodeId ? { ...n, modules: n.modules.map(m => m.id === selected.module.id ? transformObj(m) : m) } : n);
      next[selected.pathKey] = p;
      return next;
    });
  };

  /** Applies `transform` to the exact array (videos/files/links) an already-extracted item was read from. */
  const applyAssetArrayMutation = (pd, item, key, transform) => {
    const next = { ...pd };
    const p = { ...next[item.pathKey] };
    if (!item.nodeId) {
      p[key] = transform(p[key] || []);
    } else if (!item.moduleId) {
      p.nodes = p.nodes.map(n => n.id === item.nodeId ? { ...n, [key]: transform(n[key] || []) } : n);
    } else {
      p.nodes = p.nodes.map(n => n.id === item.nodeId ? {
        ...n,
        modules: n.modules.map(m => m.id === item.moduleId ? { ...m, [key]: transform(m[key] || []) } : m)
      } : n);
    }
    next[item.pathKey] = p;
    return next;
  };

  const pushIntoSelected = (fieldKey, items) => updateSelectedCollection(obj => ({ ...obj, [fieldKey]: [...(obj[fieldKey] || []), ...items] }));

  const addAssets = (type, dataArray) => {
    if (!dataArray.length) return;
    if (selected.type === 'custom_folder') {
      const newAssets = dataArray.map(d => ({ id: genId(), folderId: selected.folderId, assetType: type, ...d }));
      saveCustom(cur => ({ ...cur, assets: [...cur.assets, ...newAssets] }));
      return;
    }
    pushIntoSelected(keyOf(type), dataArray);
  };

  const addAsset = (type, data) => addAssets(type, [data]);

  const isDuplicateVideo = (url) => {
    const vid = extractYTId(url);
    return vid ? existingVideoIds.has(vid) : false;
  };
  const isDuplicateLink = (url) => resources.links.some(l => (l.url || '').trim().toLowerCase() === (url || '').trim().toLowerCase());

  const stripMeta = (item) => {
    const { _idx, parentId, source, pathColor, pathKey, nodeId, moduleId, ...clean } = item;
    return clean;
  };

  const deleteAssets = (type, items) => {
    if (!items.length) return;
    if (selected.type === 'custom_folder') {
      const ids = new Set(items.map(i => i.id));
      saveCustom(cur => ({ ...cur, assets: cur.assets.filter(a => !ids.has(a.id)) }));
    } else {
      const key = keyOf(type);
      const groups = new Map();
      items.forEach(item => {
        const gKey = `${item.pathKey}|${item.nodeId || ''}|${item.moduleId || ''}`;
        if (!groups.has(gKey)) groups.set(gKey, { sample: item, idxs: new Set() });
        groups.get(gKey).idxs.add(item._idx);
      });
      setPathsData(prev => {
        let next = prev;
        groups.forEach(({ sample, idxs }) => {
          next = applyAssetArrayMutation(next, sample, key, arr => arr.filter((_, idx) => !idxs.has(idx)));
        });
        return next;
      });
    }
    showUndoToast(type, items);
  };

  const deleteAsset = (type, item) => deleteAssets(type, [item]);

  // Restores by the deleted items' own recorded origin, not the currently
  // selected collection — the user may have navigated elsewhere before
  // clicking Undo on the toast, so `selected` can no longer be trusted here.
  const restoreAssets = (type, items) => {
    const customItems = items.filter(i => i.folderId !== undefined);
    const pathItems = items.filter(i => i.folderId === undefined);

    if (customItems.length) {
      saveCustom(cur => ({ ...cur, assets: [...cur.assets, ...customItems.map(stripMeta)] }));
    }

    if (pathItems.length) {
      const key = keyOf(type);
      const groups = new Map();
      pathItems.forEach(item => {
        const gKey = `${item.pathKey}|${item.nodeId || ''}|${item.moduleId || ''}`;
        if (!groups.has(gKey)) groups.set(gKey, { sample: item, entries: [] });
        groups.get(gKey).entries.push(item);
      });
      setPathsData(prev => {
        let next = prev;
        groups.forEach(({ sample, entries }) => {
          const sorted = [...entries].sort((a, b) => a._idx - b._idx);
          next = applyAssetArrayMutation(next, sample, key, arr => {
            const copy = [...arr];
            sorted.forEach(it => copy.splice(Math.min(it._idx, copy.length), 0, stripMeta(it)));
            return copy;
          });
        });
        return next;
      });
    }
  };

  const patchAsset = (type, item, patch) => {
    if (selected.type === 'custom_folder') {
      saveCustom(cur => ({ ...cur, assets: cur.assets.map(a => a.id === item.id ? { ...a, ...patch } : a) }));
      return;
    }
    const key = keyOf(type);
    setPathsData(prev => applyAssetArrayMutation(prev, item, key, arr => arr.map((x, idx) => idx === item._idx ? { ...x, ...patch } : x)));
  };

  const togglePin = (type, item) => patchAsset(type, item, { pinned: !item.pinned });
  const toggleWatched = (item) => patchAsset('video', item, { watched: !item.watched });
  const editTags = (type, item) => {
    const input = window.prompt("Tags (comma-separated):", (item.tags || []).join(", "));
    if (input === null) return;
    const tags = input.split(",").map(t => t.trim()).filter(Boolean);
    patchAsset(type, item, { tags });
  };

  // ── Undo toast for deletes ──
  const [undoToast, setUndoToast] = useState(null); // { id, type, items }
  const undoTimeoutRef = useRef(null);

  const showUndoToast = (type, items) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    const id = Date.now() + Math.random();
    setUndoToast({ id, type, items });
    undoTimeoutRef.current = setTimeout(() => {
      setUndoToast(t => (t && t.id === id ? null : t));
    }, 6000);
  };

  const handleUndo = () => {
    if (!undoToast) return;
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    restoreAssets(undoToast.type, undoToast.items);
    setUndoToast(null);
  };

  // ── Bulk select ──
  const [selectMode, setSelectMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());

  const toggleSelectMode = () => { setSelectMode(m => !m); setSelectedKeys(new Set()); };
  const toggleSelectItem = (item) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      const k = keyFor(item);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };
  const handleBulkDelete = (type, list) => {
    const items = list.filter(it => selectedKeys.has(keyFor(it)));
    if (!items.length) return;
    deleteAssets(type, items);
    setSelectedKeys(new Set());
    setSelectMode(false);
  };

  // ── Linked playlists (for re-sync) ──
  const linkedPlaylists = useMemo(() => {
    if (!selected) return [];
    if (selected.type === 'custom_folder') {
      return customData.folders.find(f => f.id === selected.folderId)?.playlists || [];
    }
    const p = pathsData[selected.pathKey];
    if (!p) return [];
    if (selected.type === 'path') return p._playlists || [];
    const n = p.nodes?.find(nx => nx.id === selected.nodeId);
    if (!n) return [];
    if (selected.type === 'node') return n._playlists || [];
    const m = n.modules?.find(mx => mx.id === selected.module.id);
    return m?._playlists || [];
  }, [selected, pathsData, customData]);

  const linkPlaylist = (playlistId, url) => {
    if (!playlistId) return;
    const entry = { id: playlistId, url, importedAt: new Date().toISOString() };
    const upsert = (list) => [...(list || []).filter(pl => pl.id !== playlistId), entry];
    if (selected.type === 'custom_folder') {
      saveCustom(cur => ({ ...cur, folders: cur.folders.map(f => f.id === selected.folderId ? { ...f, playlists: upsert(f.playlists) } : f) }));
      return;
    }
    updateSelectedCollection(obj => ({ ...obj, _playlists: upsert(obj._playlists) }));
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

  const fetchPlaylist = async (url) => {
    setPlaylistLoading(true);
    setPlaylistError("");
    setPlaylistResult(null);
    try {
      const res = await fetch(`/api/youtube-playlist?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch playlist");
      const videos = data.videos.map(v => ({ ...v, checked: !existingVideoIds.has(v.videoId) }));
      setPlaylistResult({ videos, skipped: data.skipped, playlistId: data.playlistId });
    } catch (err) {
      setPlaylistError(err.message || "Something went wrong while fetching the playlist");
    } finally {
      setPlaylistLoading(false);
    }
  };

  const handleFetchPlaylist = () => {
    if (!playlistUrlInput.trim()) return;
    fetchPlaylist(playlistUrlInput.trim());
  };

  /** Re-opens the import modal pre-filled with a previously linked playlist, to pull in anything new. */
  const openPlaylistModalFor = (url) => {
    setShowPlaylistModal(true);
    setPlaylistUrlInput(url);
    fetchPlaylist(url);
  };

  const togglePlaylistVideo = (videoId) => {
    setPlaylistResult(r => ({ ...r, videos: r.videos.map(v => v.videoId === videoId ? { ...v, checked: !v.checked } : v) }));
  };

  const handleImportPlaylist = () => {
    const toImport = playlistResult.videos
      .filter(v => v.checked)
      .map(({ checked, videoId, ...rest }) => rest);
    addAssets('video', toImport);
    linkPlaylist(playlistResult.playlistId, playlistUrlInput.trim());
    closePlaylistModal();
  };

  const canEdit = Boolean(selected) && (isEditMode || selected.type === 'custom_folder');

  // ── Pins + tag filter (applied on top of search-filtered results) ──
  const sortPinned = (arr) => [...arr].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const [activeTags, setActiveTags] = useState(() => new Set());
  useEffect(() => { setActiveTags(new Set()); setSelectMode(false); setSelectedKeys(new Set()); }, [selected]);
  const toggleTagFilter = (tag) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  };
  const applyTagFilter = (arr) => activeTags.size === 0 ? arr : arr.filter(it => (it.tags || []).some(t => activeTags.has(t)));

  const visible = useMemo(() => ({
    videos: sortPinned(applyTagFilter(filtered.videos)),
    files: sortPinned(applyTagFilter(filtered.files)),
    links: sortPinned(applyTagFilter(filtered.links)),
    knowledge: filtered.knowledge,
  }), [filtered, activeTags]);

  const allTagsForTab = useMemo(() => {
    const set = new Set();
    (filtered[tab] || []).forEach(it => (it.tags || []).forEach(t => set.add(t)));
    return [...set].sort();
  }, [filtered, tab]);

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

      {customSyncError && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 24px',
          background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444', fontSize: 11, fontWeight: 600
        }}>
          <AlertCircle size={13} /> {customSyncError}
        </div>
      )}

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
                     onClick={() => { setTab(t.id); setViewingSet(null); if (t.id === 'knowledge') { setSelectMode(false); setSelectedKeys(new Set()); } }}
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
                     <small>{(t.id === 'knowledge' ? filtered.knowledge?.length : visible[t.id]?.length) || 0}</small>
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
            {canEdit && tab !== 'knowledge' && (visible[tab]?.length > 0 || selectMode) && (
              <button
                onClick={toggleSelectMode}
                style={{
                  padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                  border: `1px solid ${selectMode ? activeColor : 'var(--border)'}`,
                  background: selectMode ? `${activeColor}15` : 'transparent',
                  color: selectMode ? activeColor : 'var(--text3)', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {selectMode ? 'CANCEL' : 'SELECT'}
              </button>
            )}
          </div>

          {selectMode && tab !== 'knowledge' && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '10px 16px', margin: '0 0 14px', borderRadius: 12,
              background: `${activeColor}12`, border: `1px solid ${activeColor}30`
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>
                {selectedKeys.size} selected
              </span>
              <button
                onClick={() => handleBulkDelete(tab === 'videos' ? 'video' : tab === 'files' ? 'file' : 'link', visible[tab])}
                disabled={selectedKeys.size === 0}
                style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)',
                  color: '#ef4444', fontSize: 11, fontWeight: 800, cursor: selectedKeys.size ? 'pointer' : 'not-allowed',
                  opacity: selectedKeys.size ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6
                }}
              ><Trash2 size={12} /> DELETE SELECTED</button>
            </div>
          )}

          {tab !== 'knowledge' && allTagsForTab.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {allTagsForTab.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  style={{
                    padding: '5px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${activeTags.has(tag) ? activeColor : 'var(--border)'}`,
                    background: activeTags.has(tag) ? `${activeColor}20` : 'transparent',
                    color: activeTags.has(tag) ? activeColor : 'var(--text3)'
                  }}
                >#{tag}</button>
              ))}
            </div>
          )}

          {tab === 'videos' && linkedPlaylists.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {linkedPlaylists.map(pl => (
                <div key={pl.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 10,
                  background: 'var(--bg4)', border: '1px solid var(--border)', fontSize: 10, color: 'var(--text3)'
                }}>
                  <ListVideo size={12} />
                  <span>Linked playlist · synced {fmtDate(pl.importedAt)}</span>
                  {canEdit && (
                    <button
                      onClick={() => openPlaylistModalFor(pl.url)}
                      title="Check for new videos"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeColor, display: 'flex', alignItems: 'center' }}
                    ><RefreshCw size={12} /></button>
                  )}
                </div>
              ))}
            </div>
          )}

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
                    {visible.videos.map((v, i) => {
                      return (
                      <div
                        key={i}
                        className="video-premium-card"
                        style={{ opacity: v.watched ? 0.6 : 1 }}
                        onClick={() => {
                          if (selectMode) { toggleSelectItem(v); return; }
                          if (v.url && onVideoSelect) onVideoSelect(v, resources.videos);
                          else window.open(getSafeUrl(v.url), '_blank');
                        }}
                      >
                        <div className="video-thumb-container">
                          {extractYTId(v.url) ? (
                            <YouTubeThumbnail
                              url={v.url}
                              alt={v.title}
                              style={{ width: '100%', height: '100%' }}
                            />
                          ) : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #111, #222)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={32} color="var(--text3)" /></div>}
                          <div className="video-play-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.2)' }}><Play size={20} fill="currentColor" /></div>
                          {selectMode && (
                            <button
                              className="asset-delete-btn"
                              style={{ left: 8, right: 'auto', opacity: 1, color: selectedKeys.has(keyFor(v)) ? activeColor : '#fff' }}
                              onClick={(e) => { e.stopPropagation(); toggleSelectItem(v); }}
                            >{selectedKeys.has(keyFor(v)) ? <CheckCircle2 size={14} /> : <Circle size={14} />}</button>
                          )}
                          {canEdit && !selectMode && (
                            <>
                              <button
                                className="asset-delete-btn"
                                style={{ right: 40, color: v.pinned ? '#f59e0b' : '#fff' }}
                                onClick={(e) => { e.stopPropagation(); togglePin('video', v); }}
                                aria-label="Pin video"
                                title="Pin to top"
                              ><Pin size={13} fill={v.pinned ? '#f59e0b' : 'none'} /></button>
                              <button
                                className="asset-delete-btn"
                                onClick={(e) => { e.stopPropagation(); deleteAsset('video', v); }}
                                aria-label="Remove video"
                                title="Remove video"
                              ><Trash2 size={13} /></button>
                            </>
                          )}
                        </div>
                        <div className="video-meta-glass">
                          <div className="video-title">{v.title}</div>
                          {v.tags?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                              {v.tags.map(t => <span key={t} style={{ fontSize: 9, fontWeight: 700, color: activeColor, background: `${activeColor}15`, borderRadius: 999, padding: '2px 7px' }}>#{t}</span>)}
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                             <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>{v.source}</span>
                             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                               {canEdit && (
                                 <button
                                   onClick={(e) => { e.stopPropagation(); toggleWatched(v); }}
                                   title={v.watched ? "Mark as unwatched" : "Mark as watched"}
                                   style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: v.watched ? '#34d399' : 'var(--text3)', display: 'flex' }}
                                 >{v.watched ? <CheckCircle2 size={13} /> : <Circle size={13} />}</button>
                               )}
                               {canEdit && (
                                 <button
                                   onClick={(e) => { e.stopPropagation(); editTags('video', v); }}
                                   title="Edit tags"
                                   style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}
                                 ><Tag size={12} /></button>
                               )}
                               <ExternalLink size={12} color="var(--text3)" />
                             </div>
                          </div>
                        </div>
                      </div>
                    );})}
                    {canEdit && !selectMode && (
                      <div className="video-premium-card add-tile" style={{ border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 160, background: 'transparent' }}>
                        <div onClick={() => {
                          const u = window.prompt("YouTube URL:");
                          if (!u) return;
                          if (isDuplicateVideo(u) && !window.confirm("This video is already in this collection. Add it anyway?")) return;
                          addAsset('video', { title: "New Asset", url: u, channel: "System", duration: "--", views: "0" });
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
                    {visible.files.map((f, i) => (
                      <div
                        key={i}
                        className="file-premium-row"
                        onClick={() => {
                          if (selectMode) { toggleSelectItem(f); return; }
                          if (f.url) window.open(getSafeUrl(f.url), '_blank');
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                           {selectMode && (
                             <span onClick={(e) => { e.stopPropagation(); toggleSelectItem(f); }} style={{ color: selectedKeys.has(keyFor(f)) ? activeColor : 'var(--text3)', display: 'flex', cursor: 'pointer' }}>
                               {selectedKeys.has(keyFor(f)) ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                             </span>
                           )}
                           <div className="file-icon-shell">{getFileIcon(f.type)}</div>
                           <div>
                             <div style={{ fontSize: 13, fontWeight: 700 }}>{f.name}{f.pinned ? ' 📌' : ''}</div>
                             <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{f.size} · {f.source}</div>
                             {f.tags?.length > 0 && (
                               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                 {f.tags.map(t => <span key={t} style={{ fontSize: 9, fontWeight: 700, color: activeColor, background: `${activeColor}15`, borderRadius: 999, padding: '2px 7px' }}>#{t}</span>)}
                               </div>
                             )}
                           </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                           <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', cursor: 'pointer' }}>DOWNLOAD</div>
                           <ExternalLink size={14} color="var(--text3)" opacity={0.5} />
                           {canEdit && !selectMode && (
                             <>
                               <Pin
                                 size={13}
                                 fill={f.pinned ? '#f59e0b' : 'none'}
                                 color={f.pinned ? '#f59e0b' : 'var(--text3)'}
                                 style={{ opacity: f.pinned ? 1 : 0.5, cursor: 'pointer' }}
                                 onClick={(e) => { e.stopPropagation(); togglePin('file', f); }}
                                 aria-label="Pin file"
                               />
                               <Tag
                                 size={13}
                                 color="var(--text3)"
                                 style={{ opacity: 0.5, cursor: 'pointer' }}
                                 onClick={(e) => { e.stopPropagation(); editTags('file', f); }}
                                 aria-label="Edit tags"
                               />
                               <Trash2
                                 size={14}
                                 color="#ef4444"
                                 style={{ opacity: 0.5, cursor: 'pointer' }}
                                 onClick={(e) => { e.stopPropagation(); deleteAsset('file', f); }}
                                 aria-label="Remove file"
                               />
                             </>
                           )}
                        </div>
                      </div>
                    ))}
                    {canEdit && !selectMode && (
                      <button className="rg-btn" style={{ padding: '12px', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text3)', borderRadius: 12 }} onClick={() => fileInputRef.current.click()}>
                        {uploading ? "SYNCING..." : "+ ATTACH PAYLOAD"}
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} />
                      </button>
                    )}
                  </div>
                )}

                {tab === 'links' && (
                  <div className="link-hub-grid">
                    {visible.links.map((l, i) => (
                      <div
                        key={i}
                        className="link-hub-card"
                        onClick={() => {
                          if (selectMode) { toggleSelectItem(l); return; }
                          if (l.url) window.open(getSafeUrl(l.url), '_blank');
                        }}
                      >
                         {selectMode ? (
                           <span onClick={(e) => { e.stopPropagation(); toggleSelectItem(l); }} style={{ color: selectedKeys.has(keyFor(l)) ? activeColor : 'var(--text3)', display: 'flex', cursor: 'pointer' }}>
                             {selectedKeys.has(keyFor(l)) ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                           </span>
                         ) : (
                           <div style={{ background: 'var(--bg4)', padding: 10, borderRadius: 10 }}><Link size={14} color="var(--text2)" /></div>
                         )}
                         <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.pinned ? '📌 ' : ''}{l.title}</div>
                            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{l.source}</div>
                            {l.tags?.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                {l.tags.map(t => <span key={t} style={{ fontSize: 9, fontWeight: 700, color: activeColor, background: `${activeColor}15`, borderRadius: 999, padding: '2px 7px' }}>#{t}</span>)}
                              </div>
                            )}
                         </div>
                         <ExternalLink size={14} color="var(--text3)" opacity={0.5} />
                         {canEdit && !selectMode && (
                           <>
                             <Pin
                               size={13}
                               fill={l.pinned ? '#f59e0b' : 'none'}
                               color={l.pinned ? '#f59e0b' : 'var(--text3)'}
                               style={{ opacity: l.pinned ? 1 : 0.5, cursor: 'pointer' }}
                               onClick={(e) => { e.stopPropagation(); togglePin('link', l); }}
                               aria-label="Pin link"
                             />
                             <Tag
                               size={13}
                               color="var(--text3)"
                               style={{ opacity: 0.5, cursor: 'pointer' }}
                               onClick={(e) => { e.stopPropagation(); editTags('link', l); }}
                               aria-label="Edit tags"
                             />
                             <Trash2
                               size={14}
                               color="#ef4444"
                               style={{ opacity: 0.5, cursor: 'pointer' }}
                               onClick={(e) => { e.stopPropagation(); deleteAsset('link', l); }}
                               aria-label="Remove link"
                             />
                           </>
                         )}
                      </div>
                    ))}
                    {canEdit && !selectMode && (
                      <button className="link-hub-card" style={{ border: '1px dashed var(--border)', background: 'transparent', justifyContent: 'center' }} onClick={() => {
                        const u = window.prompt("Target URL:");
                        if (!u) return;
                        if (isDuplicateLink(u) && !window.confirm("This link is already in this collection. Add it anyway?")) return;
                        addAsset('link', { title: u, url: u });
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
                {playlistLoading ? <NinjaEye size={16} labelled={false} /> : null}
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

      {undoToast && (
        <div
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1100,
            display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 12,
            background: 'var(--bg2, #14151a)', border: '1px solid var(--border)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>
            Removed {undoToast.items.length > 1 ? `${undoToast.items.length} items` : `"${undoToast.items[0].title || undoToast.items[0].name}"`}
          </span>
          <button
            onClick={handleUndo}
            style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: activeColor, color: '#0a0a0a', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}
          >UNDO</button>
        </div>
      )}
    </div>
  );
}
