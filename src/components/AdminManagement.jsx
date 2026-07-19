import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertCircle, CheckCircle2, ChevronRight, Clock, Database, Download,
  Eye, EyeOff, ExternalLink, FileJson, FileText, Layout, Lock, Map, RefreshCw,
  Search, Shield, ShieldCheck, Sparkles, Terminal, Trash2, Unlock, UploadCloud,
  UserPlus, Users, X, Zap
} from "lucide-react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import "../styles/global.css";
import "../styles/admin.css";

const SimpleLineChart = ({ data, color }) => {
  const max = Math.max(...data, 10);
  const width = 300;
  const height = 100;
  const points = data.map((value, index) => `${(index / Math.max(data.length - 1, 1)) * width},${height - (value / max) * height}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="admin-line-chart" preserveAspectRatio="none" aria-label="Activity trend chart">
      <defs><linearGradient id="admin-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`M 0 ${height} L ${points} L ${width} ${height} Z`} fill="url(#admin-chart-fill)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((value, index) => <circle key={index} cx={(index / Math.max(data.length - 1, 1)) * width} cy={height - (value / max) * height} r="3" fill="var(--admin-surface)" stroke={color} strokeWidth="2" />)}
    </svg>
  );
};

export default function AdminManagement({ onClose, pathsData, setPathsData }) {
  const {
    adminsList, setAdminsList, lockedUsers, setLockedUsers, allowAimlForAll,
    setAllowAimlForAll, geminiKey, updateGeminiKey, aiProvider, updateAiProvider,
    azureEndpoint, updateAzureEndpoint, azureKey, updateAzureKey
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newGeminiKey, setNewGeminiKey] = useState(geminiKey || "");
  const [newAiProvider, setNewAiProvider] = useState(aiProvider || "gemini");
  const [newAzureEndpoint, setNewAzureEndpoint] = useState(azureEndpoint || "");
  const [newAzureKey, setNewAzureKey] = useState(azureKey || "");
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dragActive, setDragActive] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [activeImportTab, setActiveImportTab] = useState("file");
  const [rawPasteContent, setRawPasteContent] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("user_curriculum").select("*").not("id", "eq", "00000000-0000-0000-0000-000000000000").order("updated_at", { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalConfig = async (newAdmins, newLocked, newAllowAiml, newKey, newProvider, newEndpoint, newAzureApiKey) => {
    try {
      await supabase.from("user_curriculum").upsert({
        id: "00000000-0000-0000-0000-000000000000",
        paths_data: {
          admins: newAdmins, locked: newLocked, allowAimlForAll: newAllowAiml,
          geminiKey: newKey !== undefined ? newKey : geminiKey,
          aiProvider: newProvider !== undefined ? newProvider : aiProvider,
          azureEndpoint: newEndpoint !== undefined ? newEndpoint : azureEndpoint,
          azureKey: newAzureApiKey !== undefined ? newAzureApiKey : azureKey,
          updated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Could not update global admin config:", error);
    }
  };

  const stats = useMemo(() => {
    const now = new Date();
    const activityVelocity = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(now.getDate() - (6 - index));
      return users.filter(user => new Date(user.updated_at).toDateString() === date.toDateString()).length;
    });
    return {
      totalUsers: users.length,
      activeAdmins: adminsList.length,
      totalNodes: Object.values(pathsData || {}).reduce((total, path) => total + (path.nodes?.length || 0), 0),
      totalPaths: Object.keys(pathsData || {}).length,
      activityVelocity,
      recentActivity: users.slice(0, 10)
    };
  }, [users, adminsList, pathsData]);

  const pathCounts = ["ds", "genai", "agentic"].map(path => {
    const count = users.filter(user => user.paths_data && user.paths_data[path]).length;
    return { path, count, percent: stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0 };
  });
  const filteredUsers = users.filter(user => user.id.toLowerCase().includes(searchQuery.toLowerCase()) || (user.paths_data?.title || "").toLowerCase().includes(searchQuery.toLowerCase()));

  const handleToggleLock = async (userId) => {
    const nextLocked = lockedUsers.includes(userId) ? lockedUsers.filter(id => id !== userId) : [...lockedUsers, userId];
    setLockedUsers(nextLocked);
    await updateGlobalConfig(adminsList, nextLocked, allowAimlForAll, geminiKey, aiProvider, azureEndpoint, azureKey);
  };
  const handleAddAdmin = async () => {
    const email = newAdminEmail.trim();
    if (!email || adminsList.includes(email)) return;
    const nextAdmins = [...adminsList, email];
    setAdminsList(nextAdmins); setNewAdminEmail("");
    await updateGlobalConfig(nextAdmins, lockedUsers, allowAimlForAll, geminiKey, aiProvider, azureEndpoint, azureKey);
  };
  const handleRemoveAdmin = async (email) => {
    if (adminsList.length <= 1) return;
    const nextAdmins = adminsList.filter(item => item !== email);
    setAdminsList(nextAdmins);
    await updateGlobalConfig(nextAdmins, lockedUsers, allowAimlForAll, geminiKey, aiProvider, azureEndpoint, azureKey);
  };
  const handleToggleAimlAccess = async () => {
    const nextValue = !allowAimlForAll;
    setAllowAimlForAll(nextValue);
    await updateGlobalConfig(adminsList, lockedUsers, nextValue, geminiKey, aiProvider, azureEndpoint, azureKey);
  };
  const handleUpdateAiConfig = async () => {
    updateGeminiKey(newGeminiKey); updateAiProvider(newAiProvider); updateAzureEndpoint(newAzureEndpoint); updateAzureKey(newAzureKey);
    await updateGlobalConfig(adminsList, lockedUsers, allowAimlForAll, newGeminiKey, newAiProvider, newAzureEndpoint, newAzureKey);
    setSuccessInfo("AI configuration saved.");
  };
  const handleExportRegistry = () => {
    const anchor = document.createElement("a");
    anchor.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    anchor.download = `nucleus-registry-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
  };

  const parseMarkdown = (text, filename) => {
    const path = { id: `path-${Date.now()}`, title: filename.replace(/\.(md|markdown)$/i, ""), color: "#8b5cf6", nodes: [] };
    let currentNode = null; let currentModule = null;
    text.split("\n").forEach(rawLine => {
      const line = rawLine.trim(); if (!line) return;
      if (line.startsWith("# ")) path.title = line.slice(2).trim();
      else if (line.startsWith("## ")) { currentNode = { id: `node-${Date.now()}-${path.nodes.length}`, title: line.slice(3).trim(), modules: [] }; path.nodes.push(currentNode); currentModule = null; }
      else if (line.startsWith("### ")) { if (!currentNode) { currentNode = { id: `node-${Date.now()}`, title: "Module", modules: [] }; path.nodes.push(currentNode); } currentModule = { id: `mod-${Date.now()}-${currentNode.modules.length}`, title: line.slice(4).trim(), subtopics: [], status: "pending" }; currentNode.modules.push(currentModule); }
      else if (line.startsWith("- ") || line.startsWith("* ")) { if (!currentModule) { currentModule = { id: `mod-${Date.now()}`, title: "Unit", subtopics: [], status: "pending" }; if (currentNode) currentNode.modules.push(currentModule); } currentModule.subtopics.push({ id: `topic-${Math.random().toString(36).slice(2, 7)}`, title: line.slice(2).trim(), status: "pending" }); }
    });
    return path;
  };
  const importPath = (pathObject) => {
    const path = { ...pathObject, id: pathObject.id || `path-${Date.now()}`, title: pathObject.title || "Untitled path" };
    setPathsData(previous => ({ ...previous, [path.id]: path }));
    setSuccessInfo(`Added “${path.title}” to the roadmap.`);
  };
  const handleFile = async file => {
    setErrorInfo(null); setSuccessInfo(null);
    try {
      const text = await file.text(); const extension = file.name.split(".").pop().toLowerCase();
      if (extension === "json") {
        const json = JSON.parse(text);
        if (json.nodes || json.id || json.title) importPath(json);
        else if (json && typeof json === "object") { setPathsData(previous => ({ ...previous, ...json })); setSuccessInfo(`Added ${Object.keys(json).length} paths to the roadmap.`); }
      } else if (["md", "markdown", "txt"].includes(extension)) importPath(parseMarkdown(text, file.name));
      else setErrorInfo("Please choose a JSON, Markdown, or text file.");
    } catch (error) { setErrorInfo(`Could not read this blueprint: ${error.message}`); }
  };
  const handleDrop = event => { event.preventDefault(); setDragActive(false); if (event.dataTransfer.files?.[0]) handleFile(event.dataTransfer.files[0]); };
  const handleDrag = event => { event.preventDefault(); if (event.type === "dragleave") setDragActive(false); else setDragActive(true); };
  const handlePasteProcess = () => {
    setErrorInfo(null); setSuccessInfo(null);
    if (!rawPasteContent.trim()) return setErrorInfo("Paste a blueprint before processing.");
    try { const value = rawPasteContent.trim(); importPath(value.startsWith("{") || value.startsWith("[") ? JSON.parse(value) : parseMarkdown(value, "Pasted blueprint.md")); } catch (error) { setErrorInfo(error.message); }
  };
  const downloadSample = type => {
    const content = type === "md" ? "# AI Roadmap\n## Theory\n### Basics\n- Introduction" : JSON.stringify({ title: "Sample path", nodes: [] }, null, 2);
    const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(new Blob([content], { type: "text/plain" })); anchor.download = `sample.${type}`; anchor.click();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={15} /> },
    { id: "users", label: "People", icon: <Users size={15} /> },
    { id: "infra", label: "Infrastructure", icon: <Terminal size={15} /> },
    { id: "forge", label: "Content forge", icon: <Zap size={15} /> }
  ];
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];
  const pageCopy = {
    overview: ["Workspace overview", "Good morning, operator.", "A quick read on your learning platform, access, and content health."],
    users: ["People", "Identity directory", "Review learner accounts and keep access in good standing."],
    infra: ["Configuration", "Infrastructure", "Manage the services and permissions that power the workspace."],
    forge: ["Content operations", "Content forge", "Bring new roadmap structures into the platform with confidence."]
  }[activeTab];
  const openTab = tab => { setActiveTab(tab); setErrorInfo(null); setSuccessInfo(null); };
  const displayDate = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <div className="admin-redesign">
      <aside className="admin-rail">
        <div className="admin-brand"><div className="admin-brand-mark"><ShieldCheck size={19} /></div><div><strong>Nucleus</strong><span>Admin workspace</span></div></div>
        <div className="admin-rail-label">Manage</div>
        <nav className="admin-rail-nav" aria-label="Admin sections">{tabs.map(tab => <button key={tab.id} className={`admin-rail-item ${activeTab === tab.id ? "active" : ""}`} onClick={() => openTab(tab.id)}><span className="admin-rail-icon">{tab.icon}</span><span>{tab.label}</span>{tab.id === "users" && <span className="admin-rail-count">{stats.totalUsers}</span>}</button>)}</nav>
        <div className="admin-rail-spacer" />
        <div className="admin-rail-status"><div className="admin-status-heading"><span className="admin-live-dot" />All systems normal</div><p>Last synced just now</p><div className="admin-rail-status-line"><span>Workspace</span><strong>Production</strong></div></div>
        <button className="admin-back-button" onClick={onClose}><ChevronRight size={15} /><span>Back to workspace</span></button>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar"><div className="admin-breadcrumb"><span>Admin</span><ChevronRight size={13} /><strong>{currentTab.label}</strong></div><div className="admin-topbar-actions"><div className="admin-network-status"><span className="admin-live-dot" />Live data</div><button className="admin-icon-button" onClick={fetchUsers} title="Refresh data"><RefreshCw size={16} className={loading ? "spin" : ""} /></button><button className="admin-icon-button close" onClick={onClose} title="Close admin"><X size={17} /></button></div></header>
        <main className="admin-main-scroll">
          <div className="admin-page-heading"><div><span className="admin-eyebrow">{pageCopy[0]}</span><h1>{pageCopy[1]}</h1><p>{pageCopy[2]}</p></div><span className="admin-date-label">{displayDate}</span></div>

          {activeTab === "overview" && <div className="admin-view admin-view-overview">
            <section className="admin-welcome-card"><div className="admin-welcome-copy"><span className="admin-card-kicker">Platform pulse</span><h2>Your workspace is in a good place.</h2><p>There are no outstanding system alerts. Use the shortcuts to jump into the work that needs your attention.</p></div><div className="admin-welcome-art"><div className="admin-art-ring ring-one" /><div className="admin-art-ring ring-two" /><div className="admin-art-core"><Sparkles size={23} /></div></div><div className="admin-quick-actions"><button onClick={() => openTab("users")}><Users size={15} /> Review people <ChevronRight size={14} /></button><button onClick={() => openTab("forge")}><Zap size={15} /> Add content <ChevronRight size={14} /></button></div></section>
            <section className="admin-stat-row">{[{ label: "Total people", value: stats.totalUsers, note: "Registered accounts", icon: <Users size={17} />, tone: "mint" }, { label: "Roadmap paths", value: stats.totalPaths, note: "Published learning paths", icon: <Map size={17} />, tone: "blue" }, { label: "Content nodes", value: stats.totalNodes, note: "Across all roadmaps", icon: <Layout size={17} />, tone: "violet" }, { label: "Admins", value: stats.activeAdmins, note: "With workspace access", icon: <ShieldCheck size={17} />, tone: "amber" }].map(stat => <div className={`admin-stat-tile ${stat.tone}`} key={stat.label}><div className="admin-stat-tile-top"><span className="admin-stat-icon">{stat.icon}</span><span className="admin-stat-dot" /></div><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.note}</small></div>)}</section>
            <div className="admin-overview-grid"><section className="admin-panel admin-activity-panel"><div className="admin-panel-heading"><div><span className="admin-card-kicker">Engagement</span><h3>Activity this week</h3></div><span className="admin-panel-meta">Last 7 days</span></div><div className="admin-chart-area"><SimpleLineChart data={stats.activityVelocity} color="var(--admin-accent)" /></div><div className="admin-chart-labels"><span>6 days ago</span><span>Today</span></div></section><section className="admin-panel"><div className="admin-panel-heading"><div><span className="admin-card-kicker">Reliability</span><h3>System health</h3></div><span className="admin-health-score">100%</span></div><div className="admin-health-list"><div><span className="admin-health-name"><span className="admin-health-dot" />AI provider</span><strong>Operational</strong></div><div><span className="admin-health-name"><span className="admin-health-dot" />Data gateway</span><strong>Operational</strong></div><div><span className="admin-health-name"><span className="admin-health-dot" />Access control</span><strong>Protected</strong></div></div><button className="admin-text-button" onClick={() => openTab("infra")}>View infrastructure <ChevronRight size={14} /></button></section><section className="admin-panel admin-path-panel"><div className="admin-panel-heading"><div><span className="admin-card-kicker">Learning catalog</span><h3>Path coverage</h3></div><button className="admin-text-button" onClick={() => openTab("forge")}>Manage paths <ChevronRight size={14} /></button></div><div className="admin-path-list">{pathCounts.map(path => <div className="admin-path-row" key={path.path}><div className="admin-path-row-label"><span>{path.path === "ds" ? "Data structures" : path.path === "genai" ? "Generative AI" : "Agentic systems"}</span><strong>{path.count} people</strong></div><div className="admin-progress-track"><span style={{ width: `${Math.max(path.percent, path.count ? 4 : 0)}%`, background: path.path === "ds" ? "#4f8cff" : path.path === "genai" ? "var(--admin-accent)" : "#a78bfa" }} /></div></div>)}</div></section><section className="admin-panel admin-recent-panel"><div className="admin-panel-heading"><div><span className="admin-card-kicker">Live feed</span><h3>Recent activity</h3></div><button className="admin-text-button" onClick={() => openTab("users")}>View all <ChevronRight size={14} /></button></div><div className="admin-recent-list">{stats.recentActivity.slice(0, 4).map(user => <div className="admin-recent-item" key={user.id}><span className="admin-recent-avatar"><span>{user.id.slice(0, 2).toUpperCase()}</span></span><div><strong>{user.id.slice(0, 18)}…</strong><p>Updated {user.paths_data?.title || "learning profile"}</p></div><time>{new Date(user.updated_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time></div>)}</div></section></div>
          </div>}

          {activeTab === "users" && <div className="admin-view admin-view-directory"><section className="admin-panel admin-directory-panel"><div className="admin-panel-heading directory-heading"><div><span className="admin-card-kicker">Access management</span><h3>People directory</h3><p>{filteredUsers.length} of {users.length} profiles shown</p></div><div className="admin-directory-actions"><div className="admin-search"><Search size={15} /><input type="text" placeholder="Search by identity…" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} /></div><button className="admin-secondary-button" onClick={handleExportRegistry}><Download size={15} /> Export</button></div></div><div className="admin-table-shell"><table className="admin-directory-table"><thead><tr><th>Person</th><th>Last activity</th><th>Access</th><th /></tr></thead><tbody>{filteredUsers.map(user => { const locked = lockedUsers.includes(user.id); return <tr key={user.id}><td><div className="admin-person-cell"><span className="admin-person-avatar">{user.id.slice(0, 2).toUpperCase()}</span><div><strong>{user.id.slice(0, 24)}…</strong><small>{user.paths_data?.title || "Default learning profile"}</small></div></div></td><td><span className="admin-date-cell"><Clock size={14} />{new Date(user.updated_at).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span></td><td><span className={`admin-access-badge ${locked ? "restricted" : "active"}`}><span />{locked ? "Restricted" : "Active"}</span></td><td className="admin-row-action"><button className={`admin-table-action ${locked ? "unlock" : ""}`} onClick={() => handleToggleLock(user.id)} title={locked ? "Grant access" : "Restrict access"}>{locked ? <Unlock size={15} /> : <Lock size={15} />}{locked ? "Grant access" : "Restrict"}</button></td></tr>; })}</tbody></table>{!loading && filteredUsers.length === 0 && <div className="admin-empty-state"><Users size={26} /><strong>No profiles found</strong><span>Try a different search term.</span></div>}{loading && <div className="admin-empty-state"><RefreshCw size={24} className="spin" /><span>Loading profiles…</span></div>}</div></section></div>}

          {activeTab === "infra" && <div className="admin-view admin-view-infra"><section className="admin-service-grid">{[{ name: "AI provider", detail: newAiProvider === "azure-openai" ? "Azure OpenAI" : "Google Gemini", status: geminiKey || newAzureKey ? "Configured" : "Needs setup", icon: <Sparkles size={18} />, tone: "mint" }, { name: "Data gateway", detail: "Supabase", status: "Operational", icon: <Database size={18} />, tone: "blue" }, { name: "Access control", detail: "Role-based access", status: "Protected", icon: <ShieldCheck size={18} />, tone: "violet" }].map(service => <div className="admin-service-card" key={service.name}><div className={`admin-service-icon ${service.tone}`}>{service.icon}</div><div><span>{service.name}</span><strong>{service.detail}</strong></div><em className={service.status === "Needs setup" ? "attention" : ""}><span />{service.status}</em></div>)}</section><div className="admin-infra-grid"><section className="admin-panel admin-config-panel"><div className="admin-panel-heading"><div><span className="admin-card-kicker">Workspace controls</span><h3>AI configuration</h3><p>Shared credentials are disabled. Each learner must add personal credentials in Settings.</p></div><span className="admin-config-lock"><Lock size={13} /> Private</span></div><label className="admin-field-label">Provider<select className="admin-field" value={newAiProvider} onChange={event => setNewAiProvider(event.target.value)}><option value="gemini">Google Gemini</option><option value="azure-openai">Azure OpenAI</option></select></label>{newAiProvider === "gemini" && <label className="admin-field-label">API key<div className="admin-field-with-action"><input className="admin-field" type={showKey ? "text" : "password"} placeholder="Paste your Gemini API key" value={newGeminiKey} onChange={event => setNewGeminiKey(event.target.value)} /><button onClick={() => setShowKey(!showKey)} title={showKey ? "Hide key" : "Show key"}>{showKey ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label>}{newAiProvider === "azure-openai" && <><label className="admin-field-label">Endpoint<input className="admin-field" type="text" placeholder="https://your-resource.openai.azure.com" value={newAzureEndpoint} onChange={event => setNewAzureEndpoint(event.target.value)} /></label><label className="admin-field-label">API key<div className="admin-field-with-action"><input className="admin-field" type={showKey ? "text" : "password"} placeholder="Paste your Azure API key" value={newAzureKey} onChange={event => setNewAzureKey(event.target.value)} /><button onClick={() => setShowKey(!showKey)}>{showKey ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label></>}<div className="admin-config-footer"><a href="https://aistudio.google.com/app/api-keys" target="_blank" rel="noreferrer">Get an API key <ExternalLink size={13} /></a><button className="admin-primary-button" onClick={handleUpdateAiConfig}><CheckCircle2 size={15} /> Save changes</button></div></section><section className="admin-panel admin-access-panel"><div className="admin-panel-heading"><div><span className="admin-card-kicker">Permissions</span><h3>Admin access</h3><p>People who can manage this workspace.</p></div></div><div className="admin-invite-row"><input className="admin-field" type="email" placeholder="name@company.com" value={newAdminEmail} onChange={event => setNewAdminEmail(event.target.value)} /><button className="admin-primary-button icon-only" onClick={handleAddAdmin} title="Add admin"><UserPlus size={16} /></button></div><div className="admin-admin-list">{adminsList.map(email => <div className="admin-admin-row" key={email}><span className="admin-person-avatar small"><Shield size={14} /></span><span>{email}</span>{email !== "nandanpatkar14114@gmail.com" && <button onClick={() => handleRemoveAdmin(email)} title="Remove admin"><Trash2 size={14} /></button>}</div>)}</div><div className="admin-permission-note"><ShieldCheck size={15} /><span>At least one administrator must remain active.</span></div></section></div><section className="admin-panel admin-access-setting"><div><span className="admin-card-kicker">Feature access</span><h3>AI companion for everyone</h3><p>Allow every learner to use the companion without individual approval.</p></div><button onClick={handleToggleAimlAccess} className={`admin-toggle ${allowAimlForAll ? "on" : ""}`} aria-label="Toggle AI companion access"><span /></button></section></div>}

          {activeTab === "forge" && <div className="admin-view admin-view-forge"><section className="admin-forge-intro"><div><span className="admin-card-kicker">Content operations</span><h2>Bring a new path to life.</h2><p>Import a Markdown outline or JSON blueprint. Existing paths stay untouched unless the incoming file uses the same path ID.</p></div><div className="admin-forge-stat"><FileJson size={17} /><span><strong>{stats.totalPaths}</strong> paths live</span></div></section><section className="admin-panel admin-forge-panel"><div className="admin-panel-heading"><div><h3>Import blueprint</h3><p>Choose a source, then review the result in your roadmap.</p></div><div className="admin-source-tabs">{["file", "paste"].map(type => <button key={type} className={activeImportTab === type ? "active" : ""} onClick={() => setActiveImportTab(type)}>{type === "file" ? <UploadCloud size={15} /> : <Terminal size={15} />}{type === "file" ? "Upload file" : "Paste content"}</button>)}</div></div>{activeImportTab === "file" ? <div className={`admin-drop-zone ${dragActive ? "active" : ""}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}><input ref={fileInputRef} type="file" accept=".json,.md,.txt" onChange={event => event.target.files?.[0] && handleFile(event.target.files[0])} hidden /><span className="admin-drop-icon"><UploadCloud size={23} /></span><strong>Drop a blueprint here</strong><p>or click to browse · .json, .md, .txt</p></div> : <div className="admin-paste-area"><textarea value={rawPasteContent} onChange={event => setRawPasteContent(event.target.value)} placeholder="Paste JSON or Markdown here…" /><div><button className="admin-primary-button" onClick={handlePasteProcess}><Zap size={15} /> Process content</button><button className="admin-secondary-button" onClick={() => setRawPasteContent("")}><Trash2 size={15} /> Clear</button></div></div>}{(errorInfo || successInfo) && <div className={`admin-notice ${errorInfo ? "error" : "success"}`}>{errorInfo ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}<span>{errorInfo || successInfo}</span><button onClick={() => { setErrorInfo(null); setSuccessInfo(null); }}><X size={14} /></button></div>}</section><div className="admin-template-grid"><button onClick={() => downloadSample("md")}><FileText size={17} /><span><strong>Markdown outline</strong><small>Best for a quick draft</small></span><Download size={14} /></button><button onClick={() => downloadSample("json")}><FileJson size={17} /><span><strong>JSON blueprint</strong><small>Best for a complete import</small></span><Download size={14} /></button></div></div>}
        </main>
      </div>
    </div>
  );
}
