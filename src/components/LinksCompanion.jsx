import { useState, useEffect } from "react";
import { X, Search, ChevronDown, ChevronUp, PanelLeft, Link2 as LinkIcon, Globe, BookOpen, ArrowUpRight, Loader2, Plus, Trash2, Edit2 } from "lucide-react";

// ── In-memory preview cache ───────────────────────────────────────────────────
const previewCache = {};

async function fetchPreview(url) {
  if (previewCache[url]) return previewCache[url];
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`
    );
    const data = await res.json();
    const result = {
      title:       data.data?.title       || null,
      description: data.data?.description || null,
      image:       data.data?.screenshot?.url || data.data?.image?.url || null,
      logo:        data.data?.logo?.url   || null,
    };
    previewCache[url] = result;
    return result;
  } catch {
    return { title: null, description: null, image: null, logo: null };
  }
}

// ── Preview Card ──────────────────────────────────────────────────────────────
function PreviewCard({ item }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const accent = item.currColor || "#00ff88";

  useEffect(() => {
    setLoading(true);
    setPreview(null);
    fetchPreview(item.url).then(p => {
      setPreview(p);
      setLoading(false);
    });
  }, [item.url]);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 40px", overflowY: "auto",
    }}>
      <div style={{
        width: "100%", maxWidth: 660,
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 20, overflow: "hidden",
        boxShadow: `0 0 0 1px ${accent}15, 0 20px 60px rgba(0,0,0,0.3)`,
      }}>

        {/* Screenshot strip */}
        <div style={{
          width: "100%", aspectRatio: "16/9",
          background: "var(--bg3)", position: "relative", overflow: "hidden",
          borderBottom: "1px solid var(--border)",
        }}>
          {/* Accent top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 2,
            background: `linear-gradient(90deg, ${accent}, ${accent}44)`,
          }} />

          {loading ? (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, color: "var(--text3)", fontSize: 12,
            }}>
              <Loader2 size={16} style={{ animation: "aiml-spin 1s linear infinite" }} />
              Fetching preview…
            </div>
          ) : preview?.image ? (
            <img
              src={preview.image} alt={item.label}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 10,
              background: `radial-gradient(ellipse at 50% 50%, ${accent}10 0%, transparent 70%)`,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${accent}15`, border: `1px solid ${accent}28`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Globe size={24} style={{ color: accent }} />
              </div>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>No screenshot available</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: "26px 30px 30px" }}>

          {/* Curriculum breadcrumb */}
          {item.currLabel && (
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              color: accent, textTransform: "uppercase",
              marginBottom: 8, opacity: 0.9,
            }}>
              {item.currLabel}
            </div>
          )}

          {/* Title */}
          <div style={{
            fontSize: 21, fontWeight: 800, color: "var(--text)",
            fontFamily: "var(--font)", lineHeight: 1.25, marginBottom: 10,
          }}>
            {item.label || preview?.title || "Unnamed Link"}
          </div>

          {/* Description */}
          <div style={{
            fontSize: 13, color: "var(--text3)", lineHeight: 1.7, marginBottom: 22, minHeight: 42,
          }}>
            {item.description ? (
              item.description
            ) : loading ? (
              "Loading description…"
            ) : preview?.description ? (
              preview.description.length > 200 ? preview.description.slice(0, 200) + "…" : preview.description
            ) : (
              "No description provided."
            )}
          </div>

          {/* URL pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 10, color: "var(--text3)",
            background: "var(--bg3)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "4px 10px", marginBottom: 22,
            maxWidth: "100%", overflow: "hidden",
          }}>
            {preview?.logo
              ? <img src={preview.logo} alt="" style={{ width: 13, height: 13, borderRadius: 3, objectFit: "contain", flexShrink: 0 }} />
              : <Globe size={11} style={{ flexShrink: 0 }} />
            }
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.url}
            </span>
          </div>

          {/* CTA */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 22px",
              background: accent, color: "#000",
              fontWeight: 800, fontSize: 13,
              borderRadius: 10, textDecoration: "none",
              transition: "all .2s", fontFamily: "var(--font)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <BookOpen size={14} />
            Open Link
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <style>{`@keyframes aiml-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LinksCompanion({ isEditMode, onClose }) {
  const [search, setSearch]               = useState("");
  const [showSidebar, setShowSidebar]     = useState(true);
  const [activeItem, setActiveItem]       = useState(null);
  const [links, setLinks]                 = useState([]);
  const [editingId, setEditingId]         = useState(null); // 'new' or link.id
  const [newUrl, setNewUrl]               = useState("");
  const [newLabel, setNewLabel]           = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Load links from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("genai_custom_links");
      if (saved) {
        setLinks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load links", e);
    }
  }, []);

  // Save links to local storage
  const saveLinks = (updatedLinks) => {
    setLinks(updatedLinks);
    try {
      localStorage.setItem("genai_custom_links", JSON.stringify(updatedLinks));
    } catch (e) {
      console.error("Failed to save links", e);
    }
  };

  const handleAddNew = () => {
    if (editingId === 'new') {
      setEditingId(null);
    } else {
      setEditingId('new');
      setNewUrl("");
      setNewLabel("");
      setNewDescription("");
    }
  };

  const handleEditLink = (e, link) => {
    e.stopPropagation();
    setEditingId(link.id);
    setNewUrl(link.url);
    setNewLabel(link.label);
    setNewDescription(link.description || "");
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!newUrl) return;
    
    // Ensure URL has protocol
    let urlToSave = newUrl;
    if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
      urlToSave = 'https://' + urlToSave;
    }

    if (editingId === 'new') {
      const newLink = {
        id: `link-${Date.now()}`,
        url: urlToSave,
        label: newLabel || newUrl,
        description: newDescription,
        color: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') // Random color
      };
      saveLinks([newLink, ...links]);
      setActiveItem({
        id: newLink.id,
        url: newLink.url,
        label: newLink.label,
        currLabel: "My Links",
        currColor: newLink.color,
        description: newLink.description
      });
    } else {
      const updatedLinks = links.map(l => {
        if (l.id === editingId) {
          return { ...l, url: urlToSave, label: newLabel || newUrl, description: newDescription };
        }
        return l;
      });
      saveLinks(updatedLinks);
      
      if (activeItem && activeItem.id === editingId) {
        const editedLink = updatedLinks.find(l => l.id === editingId);
        setActiveItem({
          id: editedLink.id,
          url: editedLink.url,
          label: editedLink.label,
          currLabel: "My Links",
          currColor: editedLink.color || "#00ff88",
          description: editedLink.description
        });
      }
    }
    
    setEditingId(null);
    setNewUrl("");
    setNewLabel("");
    setNewDescription("");
  };

  const handleDeleteLink = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this link?")) {
      const updatedLinks = links.filter(l => l.id !== id);
      saveLinks(updatedLinks);
      if (activeItem && activeItem.id === id) {
        setActiveItem(null);
      }
    }
  };

  const query = search.toLowerCase();
  const filteredLinks = links.filter(l => 
    l.label.toLowerCase().includes(query) || 
    l.url.toLowerCase().includes(query) || 
    (l.description && l.description.toLowerCase().includes(query))
  );

  const handleSelect = (link) => {
    setActiveItem({
      id: link.id,
      url: link.url,
      label: link.label,
      currLabel: "My Links",
      currColor: link.color || "#00ff88",
      description: link.description
    });
  };

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      background: "var(--bg)", color: "var(--text)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }}>

      <header className="aiml-header" style={{ height: 62, background: 'var(--bg2)', borderBottom: `1px solid var(--border)`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0 }}>
        
        <button
          onClick={() => setShowSidebar(v => !v)}
          title="Toggle Sidebar"
          style={{
            background: showSidebar ? "var(--bg3)" : "transparent",
            border: "1px solid " + (showSidebar ? "var(--border)" : "transparent"),
            color: showSidebar ? "var(--text)" : "var(--text3)",
            cursor: "pointer", borderRadius: 7, width: 30, height: 30,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0
          }}
        >
          <PanelLeft size={16} />
        </button>

        {/* Logo + Title Stack */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, #00ff88, #00cc66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 18px rgba(0, 255, 136, 0.35)' }}>
            <LinkIcon size={19} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>Links</h1>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>{links.length} saved links · Personal Collection</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px 8px' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        {showSidebar && (
          <div style={{
            width: 280, minWidth: 280, borderRight: "1px solid var(--border)",
            background: "var(--bg2)", display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              margin: "14px 14px 10px", padding: "8px 12px",
              background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)",
            }}>
              <Search size={14} style={{ color: "var(--text3)", flexShrink: 0 }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search links…"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13 }}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", display: "flex" }}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Add Link Button */}
            {isEditMode && (
              <div style={{ padding: "0 14px 10px" }}>
                <button 
                  onClick={handleAddNew}
                  style={{
                    width: "100%", padding: "9px", borderRadius: 8,
                    background: editingId === 'new' ? "var(--bg4)" : "var(--neon)",
                    color: editingId === 'new' ? "var(--text)" : "#000",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    fontWeight: 700, fontSize: 12, transition: "all .15s"
                  }}
                >
                  {editingId === 'new' ? <X size={14} /> : <Plus size={14} />}
                  {editingId === 'new' ? "Cancel" : "Add New Link"}
                </button>
              </div>
            )}

            {/* Add/Edit Form */}
            {editingId && (
              <form onSubmit={handleSaveSubmit} style={{
                padding: "0 14px 14px", borderBottom: "1px solid var(--border)",
                display: "flex", flexDirection: "column", gap: 10
              }}>
                {editingId !== 'new' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Edit Link</span>
                    <button type="button" onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                )}
                <input
                  required
                  placeholder="URL (e.g. https://example.com)"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 12, outline: "none" }}
                />
                <input
                  placeholder="Label / Title (Optional)"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 12, outline: "none" }}
                />
                <textarea
                  placeholder="Description (Optional)"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  rows={2}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 12, outline: "none", resize: "none" }}
                />
                <button type="submit" style={{
                  padding: "8px", borderRadius: 6, background: "var(--neon)", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12
                }}>
                  Save Link
                </button>
              </form>
            )}

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
              {filteredLinks.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "var(--text3)", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <LinkIcon size={32} style={{ opacity: 0.5 }} />
                  {search ? `No links match "${search}"` : "No links saved yet. Add one above!"}
                </div>
              ) : (
                filteredLinks.map(link => {
                  const isActive = activeItem?.id === link.id;
                  const accent = link.color || "#00ff88";
                  return (
                    <div key={link.id} style={{ display: "flex", alignItems: "center", paddingRight: 8 }}>
                      <button
                        onClick={() => handleSelect(link)}
                        style={{
                          flex: 1, display: "flex", flexDirection: "column", gap: 4,
                          padding: "10px 14px", margin: "2px 8px", borderRadius: 8,
                          background: isActive ? "rgba(0,255,136,0.07)" : "transparent",
                          border: "1px solid " + (isActive ? `${accent}30` : "transparent"),
                          cursor: "pointer", textAlign: "left", transition: "all .12s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg3)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                          <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "var(--text)" : "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {link.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text3)", paddingLeft: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                          {link.url}
                        </div>
                      </button>
                      {isEditMode && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <button 
                            onClick={(e) => handleEditLink(e, link)}
                            style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, transition: "0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg3)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
                            title="Edit Link"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteLink(e, link.id)}
                            style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, transition: "0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
                            title="Delete Link"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div style={{ flex: 1, background: "var(--bg)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          {activeItem ? (
            <PreviewCard key={activeItem.url} item={activeItem} />
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "var(--text3)", padding: 40, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                <LinkIcon size={32} style={{ color: "var(--text3)" }} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: 18, color: "var(--text2)", fontWeight: 700 }}>No Link Selected</h3>
                <p style={{ margin: 0, fontSize: 13, maxWidth: 300, lineHeight: 1.5 }}>Select a link from the sidebar or add a new one to preview it here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}