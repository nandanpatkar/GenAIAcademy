import React, { useState, useEffect, useMemo, useRef } from "react";
import { Users, Shield, Lock, Unlock, BarChart3, Search, UserPlus, X, Trash2, ShieldCheck, Activity, Globe, Map, TrendingUp, Clock, CheckCircle2, ChevronRight, UploadCloud, FileJson, FileText, Download, Database, AlertCircle, Copy, Cpu, Layout, Server, Sparkles, ExternalLink } from "lucide-react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import "../styles/global.css";

/* --- Tiny Component: SVG Line Chart --- */
const SimpleLineChart = ({ data, color }) => {
  const max = Math.max(...data, 10);
  const height = 100;
  const width = 300;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / max) * height}`).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="admin-svg-chart">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 0,${height} ${points} V ${height} Z`} fill="url(#lineGrad)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
    </svg>
  );
};

/* --- Tiny Component: SVG Doughnut --- */
const SimpleDoughnut = ({ percent, color, label }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="admin-doughnut-wrapper">
      <svg viewBox="0 0 100 100" className="admin-svg-doughnut">
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r={radius} stroke={color} strokeWidth="8" fill="none" 
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        <text x="50" y="55" textAnchor="middle" fill="var(--text)" fontSize="14" fontWeight="800">
          {percent}%
        </text>
      </svg>
      <span className="doughnut-label">{label}</span>
    </div>
  );
};

export default function AdminManagement({ onClose, pathsData, setPathsData }) {
  const { adminsList, setAdminsList, lockedUsers, setLockedUsers, allowAimlForAll, setAllowAimlForAll, geminiKey, setGeminiKey } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newGeminiKey, setNewGeminiKey] = useState(geminiKey || "");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (geminiKey) setNewGeminiKey(geminiKey);
  }, [geminiKey]);

  // Content Studio State
  const [dragActive, setDragActive] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [activeImportTab, setActiveImportTab] = useState("file"); 
  const [rawPasteContent, setRawPasteContent] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_curriculum')
        .select('*')
        .not('id', 'eq', '00000000-0000-0000-0000-000000000000'); 
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const updateGlobalConfig = async (newAdmins, newLocked, newAllowAiml, newKey) => {
    try {
      await supabase
        .from('user_curriculum')
        .upsert({
          id: '00000000-0000-0000-0000-000000000000',
          paths_data: { 
            admins: newAdmins, 
            locked: newLocked, 
            allowAimlForAll: newAllowAiml,
            geminiKey: newKey || geminiKey,
            updated_at: new Date().toISOString() 
          }
        });
    } catch (err) { console.error(err); }
  };

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeAdmins: adminsList.length,
    lockedCount: lockedUsers.length,
    totalNodes: Object.values(pathsData || {}).reduce((acc, p) => acc + (p.nodes?.length || 0), 0),
    totalPaths: Object.keys(pathsData || {}).length,
    weeklyGrowth: [12, 18, 15, 22, 28, 35, 42],
  }), [users, adminsList, lockedUsers, pathsData]);

  const pathCounts = ['ds', 'genai', 'agentic'].map(path => {
    const count = users.filter(u => u.paths_data && u.paths_data[path]).length;
    return { path, count, percent: stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0 };
  });

  /* --- Operations Logic --- */
  const filteredUsers = users.filter(u => 
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.paths_data?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleLock = async (userId) => {
    let newLocked = lockedUsers.includes(userId) ? lockedUsers.filter(id => id !== userId) : [...lockedUsers, userId];
    setLockedUsers(newLocked); await updateGlobalConfig(adminsList, newLocked, allowAimlForAll, geminiKey);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || adminsList.includes(newAdminEmail)) return;
    const newAdmins = [...adminsList, newAdminEmail];
    setAdminsList(newAdmins); setNewAdminEmail(""); await updateGlobalConfig(newAdmins, lockedUsers, allowAimlForAll, geminiKey);
  };

  const handleRemoveAdmin = async (email) => {
    if (adminsList.length <= 1) return;
    const newAdmins = adminsList.filter(e => e !== email);
    setAdminsList(newAdmins); await updateGlobalConfig(newAdmins, lockedUsers, allowAimlForAll, geminiKey);
  };

  const handleToggleAimlAccess = async () => {
    const newVal = !allowAimlForAll;
    setAllowAimlForAll(newVal);
    await updateGlobalConfig(adminsList, lockedUsers, newVal, geminiKey);
  };

  const handleUpdateGeminiKey = async () => {
    setGeminiKey(newGeminiKey);
    await updateGlobalConfig(adminsList, lockedUsers, allowAimlForAll, newGeminiKey);
    setSuccessInfo("Gemini Infrastructure Synchronized.");
  };

  /* --- Content Studio Logic --- */
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFile = async (file) => {
    setErrorInfo(null); setSuccessInfo(null);
    const text = await file.text();
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === "json") {
      try {
        const json = JSON.parse(text);
        if (json.nodes || json.id || json.title) importPath(json);
        else if (typeof json === "object") {
          let count = 0; let newPathsData = { ...pathsData };
          for (const key of Object.keys(json)) { newPathsData[key] = json[key]; count++; }
          setPathsData(newPathsData); setSuccessInfo(`Successfully imported ${count} paths.`);
        }
      } catch (err) { setErrorInfo("JSON Error: " + err.message); }
    } else if (ext === "md" || ext === "markdown" || ext === "txt") {
      try { importPath(parseMarkdown(text, file.name)); } catch (err) { setErrorInfo(err.message); }
    }
  };

  const parseMarkdown = (text, filename) => {
    const newPath = { id: `path-${Date.now()}`, title: filename.replace('.md', ''), color: "#8b5cf6", nodes: [] };
    let currentNode = null; let currentModule = null;
    const lines = text.split('\n');
    for (let line of lines) {
      line = line.trim(); if (!line) continue;
      if (line.startsWith('# ')) newPath.title = line.substring(2).trim();
      else if (line.startsWith('## ')) {
        currentNode = { id: `node-${Date.now()}`, title: line.substring(3).trim(), modules: [] };
        newPath.nodes.push(currentNode); currentModule = null;
      } else if (line.startsWith('### ')) {
        if (!currentNode) { currentNode = { id: `node-${Date.now()}`, title: "Module", modules: [] }; newPath.nodes.push(currentNode); }
        currentModule = { id: `mod-${Date.now()}`, title: line.substring(4).trim(), subtopics: [], status: "pending" };
        currentNode.modules.push(currentModule);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!currentModule) {
           currentModule = { id: `mod-${Date.now()}`, title: "Unit", subtopics: [], status: "pending" };
           if (currentNode) currentNode.modules.push(currentModule);
        }
        currentModule.subtopics.push({ title: line.substring(2).trim(), status: "pending", id: `topic-${Math.random().toString(36).substr(2, 5)}` });
      }
    }
    return newPath;
  };

  const importPath = (pathObj) => {
    const id = pathObj.id || `path-${Date.now()}`;
    const cleanPath = { ...pathObj, id, title: pathObj.title || "Untitled Path" };
    setPathsData(prev => ({ ...prev, [id]: cleanPath }));
    setSuccessInfo(`Architecture Synchronized: ${cleanPath.title}`);
  };

  const handlePasteProcess = () => {
    setErrorInfo(null); setSuccessInfo(null);
    if (!rawPasteContent.trim()) return setErrorInfo("Payload required.");
    const trimmed = rawPasteContent.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try { importPath(JSON.parse(trimmed)); } catch (e) { setErrorInfo(e.message); }
    } else {
      try { importPath(parseMarkdown(trimmed, "Pasted Blueprint.md")); } catch (e) { setErrorInfo(e.message); }
    }
  };

  const downloadSample = (type) => {
    let content = type === 'md' ? "# AI Roadmap\n## Theory\n### Basics\n- Introduction" : JSON.stringify({ title: "Sample", nodes: [] }, null, 2);
    const b = new Blob([content], { type: "text/plain" });
    const u = URL.createObjectURL(b); const a = document.createElement('a');
    a.href = u; a.download = `sample.${type}`; a.click(); URL.revokeObjectURL(u);
  };

  return (
    <div className="admin-page unified-dashboard">
      <header className="admin-header sticky-header">
        <div className="admin-header-left">
          <div className="admin-logo-orb">
             <Shield size={24} className="admin-shield" />
             <div className="orb-pulse" />
          </div>
          <div>
            <h1>Command Center</h1>
            <p>Unified ecosystem intelligence & resource engineering.</p>
          </div>
        </div>
        <div className="header-actions">
           <button className="admin-refresh-btn" onClick={fetchUsers}><Activity size={16} /> <span>Sync</span></button>
           <button className="admin-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
      </header>

      <main className="admin-content scrolling-layout">
        
        {/* Row 1: Key Metrics */}
        <section className="dashboard-section metrics-section">
           <div className="admin-stats-grid">
              {[
                { label: 'Ecosystem Enrolled', value: stats.totalUsers, icon: <Users />, color: 'var(--neon)', trend: '+12%' },
                { label: 'Architectures', value: stats.totalPaths, icon: <Map />, color: '#3b82f6', trend: 'Global' },
                { label: 'Infrastructure Nodes', value: stats.totalNodes, icon: <Cpu />, color: '#a855f7', trend: 'Live' },
                { label: 'Admin Authority', value: stats.activeAdmins, icon: <ShieldCheck />, color: '#fbbf24', trend: 'Stable' }
              ].map((s, i) => (
                <div key={i} className="admin-stat-card" style={{ "--stat-color": s.color }}>
                  <div className="stat-card-header">
                    <div className="stat-icon-wrapper">{React.cloneElement(s.icon, { size: 18 })}</div>
                    <span className="stat-trend">{s.trend}</span>
                  </div>
                  <div className="stat-card-body"><h3>{s.value}</h3><p>{s.label}</p></div>
                </div>
              ))}
           </div>
        </section>

        {/* Row 2: Intelligence Visualizers */}
        <section className="dashboard-section charts-section">
           <div className="admin-grid-two">
              <div className="admin-card chart-card glass-panel">
                 <div className="card-header">
                    <div className="header-icon-mini"><TrendingUp size={14} /></div>
                    <div><h3>Registration Velocity</h3><p>7-day user acquisition trend.</p></div>
                 </div>
                 <div className="chart-wrapper"><SimpleLineChart data={stats.weeklyGrowth} color="var(--neon)" /></div>
              </div>
              <div className="admin-card chart-card glass-panel">
                 <div className="card-header">
                    <div className="header-icon-mini"><Globe size={14} /></div>
                    <div><h3>Path Distribution</h3><p>Study path engagement metrics.</p></div>
                 </div>
                 <div className="doughnut-grid">
                    {pathCounts.map(p => <SimpleDoughnut key={p.path} percent={Math.round(p.percent)} color={p.path === 'ds' ? '#3b82f6' : 'var(--neon)'} label={p.path.toUpperCase()} />)}
                 </div>
              </div>
           </div>
        </section>

        {/* Row 3: Operations & Authority */}
        <section className="dashboard-section operations-section">
           <div className="admin-grid-main">
              {/* Wide Left: Ecosystem Registry */}
              <div className="admin-card glass-panel registry-card">
                 <div className="card-header split">
                    <div>
                       <h3>Ecosystem Registry</h3>
                       <p>Real-time synchronization of all user instances.</p>
                    </div>
                    <div className="admin-search-wrapper">
                       <Search size={16} />
                       <input type="text" placeholder="Filter identities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                 </div>
                 <div className="admin-table-wrapper mini-scrollbar">
                    <table className="admin-table">
                       <thead><tr><th>Identity Identifier</th><th>Temporal Update</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                       <tbody>
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="admin-table-row">
                              <td className="cell-user"><code>{u.id.substring(0, 32)}...</code></td>
                              <td className="cell-date">{new Date(u.updated_at).toLocaleString()}</td>
                              <td className="cell-status">
                                 <span className={`admin-status-badge ${lockedUsers.includes(u.id) ? 'locked' : 'active'}`}>
                                    {lockedUsers.includes(u.id) ? 'Restricted' : 'Active'}
                                 </span>
                              </td>
                              <td className="cell-actions">
                                 <button className={`admin-lock-toggle ${lockedUsers.includes(u.id) ? 'unlock' : 'lock'}`} onClick={() => handleToggleLock(u.id)}>
                                    {lockedUsers.includes(u.id) ? <Unlock size={14} /> : <Lock size={14} />}
                                 </button>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Narrow Right: Authority Control */}
              <div className="admin-card glass-panel authority-card">
                 <div className="card-header">
                    <h3>Authority Registry</h3>
                    <p>Manage system operators.</p>
                 </div>

                 <div style={{ padding: "0 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>AIML Companion Access</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Unlock for all students globally.</div>
                      </div>
                      <button 
                        onClick={handleToggleAimlAccess}
                        style={{
                          width: 44, height: 22, borderRadius: 11, background: allowAimlForAll ? "var(--neon)" : "rgba(255,255,255,0.1)",
                          position: "relative", cursor: "pointer", border: "none", transition: "all .3s"
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%", background: allowAimlForAll ? "#000" : "#fff",
                          position: "absolute", top: 3, left: allowAimlForAll ? 25 : 3, transition: "all .3s"
                        }} />
                      </button>
                    </div>
                  </div>
                 <div className="invite-form-minimal">
                    <input type="email" placeholder="new.operator@genai.com" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
                    <button onClick={handleAddAdmin} className="mini-action-btn"><UserPlus size={14} /></button>
                 </div>
                 <div className="authority-list mini-scrollbar">
                    {adminsList.map(email => (
                      <div key={email} className="authority-item-compact">
                         <div className="auth-user-info">
                            <Shield size={14} className="auth-icon" />
                            <span className="auth-email">{email}</span>
                         </div>
                         {email !== 'nandanpatkar14114@gmail.com' && (
                           <button className="auth-remove-btn" onClick={() => handleRemoveAdmin(email)}><Trash2 size={14} /></button>
                         )}
                      </div>
                    ))}
                 </div>

                  {/* Gemini Configuration Section */}
                  <div style={{ marginTop: 24, padding: 20, borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(66,133,244,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Sparkles size={14} color="#4285F4" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>AI Infrastructure</h4>
                        <p style={{ fontSize: 10, color: "var(--text3)" }}>Dynamic Gemini API Credential</p>
                      </div>
                    </div>
                    
                    <div className="invite-form-minimal" style={{ marginBottom: 12 }}>
                      <input 
                        type={showKey ? "text" : "password"} 
                        placeholder="Paste Gemini API Key..." 
                        value={newGeminiKey} 
                        onChange={e => setNewGeminiKey(e.target.value)}
                        style={{ fontFamily: showKey ? "monospace" : "inherit" }}
                      />
                      <button 
                         onClick={() => setShowKey(!showKey)} 
                         className="mini-action-btn"
                         style={{ marginRight: 4 }}
                      >
                        {showKey ? <Unlock size={12} /> : <Lock size={12} />}
                      </button>
                      <button onClick={handleUpdateGeminiKey} className="mini-action-btn" style={{ background: "var(--neon)", color: "#000" }}><CheckCircle2 size={12} /></button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <a 
                        href="https://aistudio.google.com/app/api-keys?project=gen-lang-client-0401997559" 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ fontSize: 9, color: "#4285F4", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}
                      >
                        <ExternalLink size={10} /> GET GEMINI API KEY
                      </a>
                      {geminiKey && (
                        <div style={{ fontSize: 8, color: "var(--neon)", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                          <ShieldCheck size={10} /> DYNAMIC CONFIG ACTIVE
                        </div>
                      )}
                    </div>
                  </div>
              </div>
           </div>
        </section>

        {/* Row 4: Engineering (Studio) */}
        <section className="dashboard-section engineering-section">
           <div className="admin-card glass-panel studio-forge-card">
              <div className="card-header split">
                 <div className="studio-header-main">
                    <div className="studio-icon-bg"><Server size={20} /></div>
                    <div>
                       <h3>Architecture Forge</h3>
                       <p>Mass study path synchronization & injection engine.</p>
                    </div>
                 </div>
                 <div className="studio-tabs-row">
                    {['file', 'paste'].map(t => <button key={t} className={`studio-tab-btn ${activeImportTab === t ? 'active' : ''}`} onClick={() => setActiveImportTab(t)}>{t}</button>)}
                 </div>
              </div>

              <div className="forge-body-unified">
                 {activeImportTab === 'file' ? (
                   <div className={`forge-drop-well ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                      <input ref={fileInputRef} type="file" accept=".json,.md,.txt" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />
                      <Activity size={24} className="well-icon" />
                      <div>
                         <h4>Inject Architectural Payload</h4>
                         <p>Directly drop study path files (.json / .md)</p>
                      </div>
                   </div>
                 ) : (
                   <div className="forge-paste-container">
                      <textarea value={rawPasteContent} onChange={e => setRawPasteContent(e.target.value)} placeholder="Paste architectural blueprint JSON or Markdown..." className="forge-textarea-compact" />
                      <div className="forge-actions">
                         <button className="forge-btn-exec" onClick={handlePasteProcess}><CheckCircle2 size={16} /> Execute Injection</button>
                         <button className="forge-btn-clear" onClick={() => setRawPasteContent("")}><Trash2 size={16} /></button>
                      </div>
                   </div>
                 )}

                 {(errorInfo || successInfo) && (
                   <div className={`forge-notifier ${errorInfo ? 'error' : 'success'}`}>
                      {errorInfo ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                      <span>{errorInfo || successInfo}</span>
                      <button onClick={() => { setErrorInfo(null); setSuccessInfo(null); }} className="notifier-close"><X size={12} /></button>
                   </div>
                 )}
              </div>
              
              <div className="forge-footer-unified">
                 <div className="template-links">
                    <span className="label">Download Blueprints:</span>
                    <button onClick={() => downloadSample('md')}><FileText size={12} /> MD Template</button>
                    <button onClick={() => downloadSample('json')}><FileJson size={12} /> JSON Schema</button>
                 </div>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}
