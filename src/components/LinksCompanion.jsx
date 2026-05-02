import { useState, useEffect, useRef } from "react";
import { X, Search, ChevronDown, ChevronUp, PanelLeft, Link2 as LinkIcon, Globe, BookOpen, ArrowUpRight, Loader2, Plus, Trash2, Edit2, Star, GitFork, GitBranch } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabaseClient";

// ── In-memory preview cache ───────────────────────────────────────────────────
const previewCache = {};

async function fetchPreview(url) {
  if (previewCache[url]) return previewCache[url];
  
  // Special handling for Github URLs
  if (url.includes("github.com")) {
    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const [, owner, repo] = match;
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (res.ok) {
          const data = await res.json();
          const result = {
            title: data.full_name,
            description: data.description,
            stars: data.stargazers_count,
            forks: data.forks_count,
            language: data.language,
            image: data.owner?.avatar_url,
            isGithub: true,
            repoUrl: data.html_url
          };
          previewCache[url] = result;
          return result;
        }
      }
    } catch (e) {
      console.error("Github fetch failed", e);
    }
  }

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
          <div style={{ display: 'flex', gap: 12 }}>
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
              {preview?.isGithub ? <GitBranch size={14} /> : <BookOpen size={14} />}
              {preview?.isGithub ? "View on Github" : "Open Link"}
              <ArrowUpRight size={14} />
            </a>

            {preview?.isGithub && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text2)', fontSize: 13, fontWeight: 600 }}>
                  <Star size={14} color="#eab308" /> {preview.stars?.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text2)', fontSize: 13, fontWeight: 600 }}>
                  <GitFork size={14} color="var(--text3)" /> {preview.forks?.toLocaleString()}
                </div>
                {preview.language && (
                  <div style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--bg3)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                    {preview.language}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes aiml-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LinksCompanion({ isEditMode, onClose, initialTab = "links" }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab]       = useState(initialTab); // 'links' or 'github'

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [search, setSearch]               = useState("");
  const [showSidebar, setShowSidebar]     = useState(true);
  const [activeItem, setActiveItem]       = useState(null);
  const [links, setLinks]                 = useState([]);
  const [githubRepos, setGithubRepos]     = useState([]);
  const [editingId, setEditingId]         = useState(null); // 'new' or link.id
  const [newUrl, setNewUrl]               = useState("");
  const [newLabel, setNewLabel]           = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading]         = useState(true);

  const isInitialSync = useRef(true);

  // Load from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLinks([]);
        setGithubRepos([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_links')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setLinks(data.links || []);
          setGithubRepos(data.github_repos || []);
        } else if (error && error.code === 'PGRST116') {
          // No record yet, create one with empty arrays to ensure isolation
          setLinks([]);
          setGithubRepos([]);
          await supabase.from('user_links').insert({
            id: user.id,
            links: [],
            github_repos: []
          });
        }
      } catch (e) {
        console.error("Supabase fetch failed", e);
        setLinks([]);
        setGithubRepos([]);
      }
      
      setIsLoading(false);
      isInitialSync.current = false;
    };

    fetchData();
  }, [user]);

  // Save to Supabase (debounced)
  useEffect(() => {
    if (isInitialSync.current || !user) return;

    const saveToSupabase = async () => {
      try {
        await supabase
          .from('user_links')
          .upsert({
            id: user.id,
            links: links,
            github_repos: githubRepos,
            updated_at: new Date().toISOString()
          });
          
        // Also keep local storage for offline/quick access
        // Removed shared localStorage to prevent user leakage

      } catch (e) {
        console.error("Supabase save failed", e);
      }
    };

    const timer = setTimeout(saveToSupabase, 1000);
    return () => clearTimeout(timer);
  }, [links, githubRepos, user]);

  const saveLinks = (updated) => {
    if (activeTab === 'links') setLinks(updated);
    else setGithubRepos(updated);
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
    
    let urlToSave = newUrl;
    if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
      urlToSave = 'https://' + urlToSave;
    }

    const currentList = activeTab === 'links' ? links : githubRepos;
    const isGithub = activeTab === 'github' || urlToSave.includes("github.com");

    if (editingId === 'new') {
      const newItem = {
        id: `${activeTab}-${Date.now()}`,
        url: urlToSave,
        label: newLabel || newUrl,
        description: newDescription,
        type: activeTab,
        color: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
      };
      
      const updatedList = [newItem, ...currentList];
      if (activeTab === 'links') setLinks(updatedList);
      else setGithubRepos(updatedList);

      setActiveItem({
        id: newItem.id,
        url: newItem.url,
        label: newItem.label,
        currLabel: activeTab === 'links' ? "My Links" : "Github Repos",
        currColor: newItem.color,
        description: newItem.description
      });
    } else {
      const updatedList = currentList.map(l => {
        if (l.id === editingId) {
          return { ...l, url: urlToSave, label: newLabel || newUrl, description: newDescription };
        }
        return l;
      });
      
      if (activeTab === 'links') setLinks(updatedList);
      else setGithubRepos(updatedList);
      
      if (activeItem && activeItem.id === editingId) {
        const editedItem = updatedList.find(l => l.id === editingId);
        setActiveItem({
          id: editedItem.id,
          url: editedItem.url,
          label: editedItem.label,
          currLabel: activeTab === 'links' ? "My Links" : "Github Repos",
          currColor: editedItem.color || "#00ff88",
          description: editedItem.description
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
    if (window.confirm(`Are you sure you want to delete this ${activeTab === 'links' ? 'link' : 'repo'}?`)) {
      if (activeTab === 'links') setLinks(links.filter(l => l.id !== id));
      else setGithubRepos(githubRepos.filter(l => l.id !== id));
      
      if (activeItem && activeItem.id === id) {
        setActiveItem(null);
      }
    }
  };

  const query = search.toLowerCase();
  const activeList = activeTab === 'links' ? links : githubRepos;
  const filteredItems = activeList.filter(l => 
    (l.label || "").toLowerCase().includes(query) || 
    (l.url || "").toLowerCase().includes(query) || 
    (l.description && l.description.toLowerCase().includes(query))
  );

  const handleSelect = (item) => {
    setActiveItem({
      id: item.id,
      url: item.url,
      label: item.label,
      currColor: item.color || (activeTab === 'github' ? "#0088ff" : "#00ff88"),
      description: item.description
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
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${activeTab === 'links' ? '#00ff88, #00cc66' : '#0088ff, #004488'} )`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 18px ${activeTab === 'links' ? 'rgba(0, 255, 136, 0.35)' : 'rgba(0, 136, 255, 0.35)'}` }}>
            {activeTab === 'links' ? <LinkIcon size={19} color="#000" /> : <GitBranch size={19} color="#fff" />}
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>
              {activeTab === 'links' ? 'Links' : 'Github'}
            </h1>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>
              {activeList.length} saved {activeTab} · Personal Collection
            </p>
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
            {/* Tab Switcher */}
            <div style={{ 
              display: 'flex', padding: '14px 14px 0', gap: 4
            }}>
              <button 
                onClick={() => { setActiveTab('links'); setActiveItem(null); }}
                style={{
                  flex: 1, padding: '8px', fontSize: 11, fontWeight: 700, borderRadius: '6px 6px 0 0',
                  background: activeTab === 'links' ? 'var(--bg3)' : 'transparent',
                  color: activeTab === 'links' ? 'var(--neon)' : 'var(--text3)',
                  border: '1px solid ' + (activeTab === 'links' ? 'var(--border)' : 'transparent'),
                  borderBottom: activeTab === 'links' ? 'none' : '1px solid var(--border)',
                  cursor: 'pointer', transition: '0.2s'
                }}
              >
                Links
              </button>
              <button 
                onClick={() => { setActiveTab('github'); setActiveItem(null); }}
                style={{
                  flex: 1, padding: '8px', fontSize: 11, fontWeight: 700, borderRadius: '6px 6px 0 0',
                  background: activeTab === 'github' ? 'var(--bg3)' : 'transparent',
                  color: activeTab === 'github' ? '#0088ff' : 'var(--text3)',
                  border: '1px solid ' + (activeTab === 'github' ? 'var(--border)' : 'transparent'),
                  borderBottom: activeTab === 'github' ? 'none' : '1px solid var(--border)',
                  cursor: 'pointer', transition: '0.2s'
                }}
              >
                Github
              </button>
            </div>

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              margin: "0 14px 10px", padding: "8px 12px",
              background: "var(--bg3)", borderRadius: "0 0 8px 8px", border: "1px solid var(--border)",
              borderTop: 'none'
            }}>
              <Search size={14} style={{ color: "var(--text3)", flexShrink: 0 }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${activeTab === 'links' ? 'links' : 'repos'}…`}
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
                  {editingId === 'new' ? <X size={14} /> : (activeTab === 'links' ? <Plus size={14} /> : <GitBranch size={14} />)}
                  {editingId === 'new' ? "Cancel" : (activeTab === 'links' ? "Add New Link" : "Add Github Repo")}
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
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Edit {activeTab === 'links' ? 'Link' : 'Repo'}</span>
                    <button type="button" onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                )}
                <input
                  required
                  placeholder={activeTab === 'links' ? "URL (e.g. https://example.com)" : "Github URL (e.g. github.com/user/repo)"}
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
                  padding: "8px", borderRadius: 6, background: activeTab === 'links' ? "var(--neon)" : "#0088ff", color: activeTab === 'links' ? "#000" : "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12
                }}>
                  Save {activeTab === 'links' ? 'Link' : 'Repository'}
                </button>
              </form>
            )}

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
              {isLoading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>
                  <Loader2 size={24} style={{ animation: "aiml-spin 1s linear infinite", marginBottom: 12 }} />
                  <div style={{ fontSize: 12 }}>Syncing with database…</div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "var(--text3)", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  {activeTab === 'links' ? <LinkIcon size={32} style={{ opacity: 0.5 }} /> : <GitBranch size={32} style={{ opacity: 0.5 }} />}
                  {search ? `No items match "${search}"` : `No ${activeTab} saved yet. Add one above!`}
                </div>
              ) : (
                filteredItems.map(item => {
                  const isActive = activeItem?.id === item.id;
                  const accent = item.color || (activeTab === 'github' ? "#0088ff" : "#00ff88");
                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", paddingRight: 8 }}>
                      <button
                        onClick={() => handleSelect(item)}
                        style={{
                          flex: 1, display: "flex", flexDirection: "column", gap: 4,
                          padding: "10px 14px", margin: "2px 8px", borderRadius: 8,
                          background: isActive ? (activeTab === 'links' ? "rgba(0,255,136,0.07)" : "rgba(110,84,148,0.1)") : "transparent",
                          border: "1px solid " + (isActive ? `${accent}30` : "transparent"),
                          cursor: "pointer", textAlign: "left", transition: "all .12s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg3)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                          {activeTab === 'links' 
                            ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                            : <GitBranch size={12} style={{ color: accent, flexShrink: 0 }} />
                          }
                          <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "var(--text)" : "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text3)", paddingLeft: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                          {item.url.replace('https://', '').replace('http://', '')}
                        </div>
                      </button>
                      {isEditMode && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <button 
                            onClick={(e) => handleEditLink(e, item)}
                            style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, transition: "0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg3)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteLink(e, item.id)}
                            style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, transition: "0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
                            title="Delete"
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
                {activeTab === 'links' ? <LinkIcon size={32} style={{ color: "var(--text3)" }} /> : <GitBranch size={32} style={{ color: "var(--text3)" }} />}
              </div>
              <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: 18, color: "var(--text2)", fontWeight: 700 }}>No {activeTab === 'links' ? 'Link' : 'Repo'} Selected</h3>
                <p style={{ margin: 0, fontSize: 13, maxWidth: 300, lineHeight: 1.5 }}>Select a {activeTab === 'links' ? 'link' : 'repository'} from the sidebar or add a new one to preview it here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}