import { useState, useRef } from "react";
import { X, Star, Trash2, Copy, FolderOpen, Plus, Search, Tag, Clock, Download, Upload } from "lucide-react";
import { importFlowJSON } from "../utils/flowUtils.js";

const TAG_OPTIONS = ["rag", "agent", "multi-agent", "aws", "azure", "databricks", "mcp", "prototype", "production"];
const TAG_COLORS  = { rag:"#22d3ee", agent:"#818cf8", "multi-agent":"#a78bfa", aws:"#fb923c", azure:"#60a5fa", databricks:"#fc8181", mcp:"#c084fc", prototype:"#fbbf24", production:"#34d399" };

export default function FlowManager({ flows, onLoad, onDelete, onDuplicate, onFavorite, onNew, onImport, onClose }) {
  const [search,    setSearch]    = useState("");
  const [tagFilter, setTagFilter] = useState(null);
  const [showFavs,  setShowFavs]  = useState(false);
  const fileRef = useRef(null);

  const flowList = Object.values(flows).sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return  1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  }).filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.name?.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q);
    const matchTag    = !tagFilter || (f.tags || []).includes(tagFilter);
    const matchFav    = !showFavs  || f.favorite;
    return matchSearch && matchTag && matchFav;
  });

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    importFlowJSON(file, (data) => { onImport(data); e.target.value = ""; }, (err) => alert("Import failed: " + err));
  };

  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9990, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 680, maxHeight: "80vh", background: "var(--pg-sidebar)", border: "1px solid var(--pg-border)", borderRadius: 12, display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", fontFamily: "'DM Mono',monospace", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--pg-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--pg-text)" }}>My Flows</div>
            <div style={{ fontSize: 9, color: "var(--pg-text3)", marginTop: 2 }}>{Object.keys(flows).length} saved · click to load</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()}
              style={{ background: "transparent", border: "1px solid var(--pg-border)", borderRadius: 5, color: "var(--pg-text2)", fontSize: 9.5, padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: 5 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.color = "var(--pg-accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--pg-border)"; e.currentTarget.style.color = "var(--pg-text2)"; }}>
              <Upload size={11} /> Import JSON
            </button>
            <button onClick={onNew}
              style={{ background: "var(--pg-accent)", border: "none", borderRadius: 5, color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: 5 }}>
              <Plus size={11} /> New Flow
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pg-text3)", padding: 4 }}><X size={14} /></button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--pg-border2)", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={11} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--pg-text3)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search flows..."
              style={{ width: "100%", background: "var(--pg-panel)", border: "1px solid var(--pg-border)", borderRadius: 5, color: "var(--pg-text)", fontSize: 11, padding: "5px 8px 5px 26px", fontFamily: "'DM Mono',monospace", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "var(--pg-accent)"} onBlur={e => e.target.style.borderColor = "var(--pg-border)"} />
          </div>
          <button onClick={() => setShowFavs(!showFavs)}
            style={{ background: showFavs ? "#fbbf2422" : "transparent", border: `1px solid ${showFavs ? "#fbbf24" : "var(--pg-border)"}`, borderRadius: 5, color: showFavs ? "#fbbf24" : "var(--pg-text3)", fontSize: 9.5, padding: "5px 9px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={11} /> Favorites
          </button>
        </div>

        {/* Tag pills */}
        <div style={{ padding: "8px 16px", display: "flex", gap: 5, flexWrap: "wrap", borderBottom: "1px solid var(--pg-border2)" }}>
          <button onClick={() => setTagFilter(null)}
            style={{ background: !tagFilter ? "var(--pg-panel)" : "transparent", border: `1px solid ${!tagFilter ? "var(--pg-accent)" : "var(--pg-border)"}`, borderRadius: 3, color: !tagFilter ? "var(--pg-accent)" : "var(--pg-text3)", fontSize: 8.5, padding: "2px 8px", cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>
            All
          </button>
          {TAG_OPTIONS.map(tag => (
            <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              style={{ background: tagFilter === tag ? (TAG_COLORS[tag] + "22") : "transparent", border: `1px solid ${tagFilter === tag ? TAG_COLORS[tag] : "var(--pg-border)"}`, borderRadius: 3, color: tagFilter === tag ? TAG_COLORS[tag] : "var(--pg-text3)", fontSize: 8.5, padding: "2px 8px", cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>
              {tag}
            </button>
          ))}
        </div>

        {/* Flow list */}
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          {flowList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--pg-text3)" }}>
              <FolderOpen size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
              <div style={{ fontSize: 11 }}>{Object.keys(flows).length === 0 ? "No saved flows yet — create your first!" : "No flows match your filter"}</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {flowList.map(flow => (
                <div key={flow.id}
                  style={{ padding: 12, background: "var(--pg-panel)", border: "1px solid var(--pg-border2)", borderRadius: 8, cursor: "pointer", transition: "all 0.15s", position: "relative" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.background = "var(--pg-border2)44"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--pg-border2)"; e.currentTarget.style.background = "var(--pg-panel)"; }}
                  onClick={() => onLoad(flow)}>
                  {/* Favorite */}
                  <button onClick={ev => { ev.stopPropagation(); onFavorite(flow.id); }}
                    style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: flow.favorite ? "#fbbf24" : "var(--pg-border)", padding: 2 }}
                    onMouseEnter={e => e.stopPropagation()}>
                    <Star size={12} fill={flow.favorite ? "#fbbf24" : "none"} />
                  </button>

                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pg-text)", marginBottom: 4, paddingRight: 20, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{flow.name}</div>
                  {flow.description && <div style={{ fontSize: 8.5, color: "var(--pg-text2)", lineHeight: 1.5, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{flow.description}</div>}

                  {/* Tags */}
                  {(flow.tags || []).length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {(flow.tags || []).map(t => (
                        <span key={t} style={{ background: (TAG_COLORS[t] || "#818cf8") + "22", color: TAG_COLORS[t] || "#818cf8", border: `1px solid ${(TAG_COLORS[t] || "#818cf8") + "44"}`, fontSize: 7.5, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>{t}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--pg-text3)", fontSize: 8.5 }}>
                      <Clock size={9} />
                      {fmt(flow.updatedAt)}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={ev => { ev.stopPropagation(); onDuplicate(flow.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pg-text3)", padding: 2 }}
                        onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.color = "var(--pg-accent)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--pg-text3)" }}>
                        <Copy size={11} />
                      </button>
                      <button onClick={ev => { ev.stopPropagation(); if (window.confirm("Delete this flow?")) onDelete(flow.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pg-text3)", padding: 2 }}
                        onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--pg-text3)" }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
