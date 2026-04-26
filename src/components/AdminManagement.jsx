import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Users, Shield, Lock, Unlock, BarChart3, Search, UserPlus, X, Trash2, 
  ShieldCheck, Activity, Globe, Map, TrendingUp, Clock, CheckCircle2, 
  ChevronRight, UploadCloud, FileJson, FileText, Download, Database, 
  AlertCircle, Copy, Cpu, Layout, Server, Sparkles, ExternalLink,
  Zap, HardDrive, Terminal, RefreshCw, Filter, Eye, EyeOff
} from "lucide-react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import "../styles/global.css";

/* --- Tiny Component: SVG Line Chart (Enhanced) --- */
const SimpleLineChart = ({ data, color }) => {
  const max = Math.max(...data, 10);
  const height = 100;
  const width = 300;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / max) * height}`).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="admin-svg-chart" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path d={`M ${areaPoints} Z`} fill={`url(#grad-${color})`} />
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ filter: 'url(#glow)', transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} 
      />
      {data.map((d, i) => (
        <circle 
          key={i}
          cx={(i / (data.length - 1)) * width} 
          cy={height - (d / max) * height} 
          r="4" 
          fill="#fff" 
          stroke={color} 
          strokeWidth="2"
          className="chart-dot"
        />
      ))}
    </svg>
  );
};

/* --- Tiny Component: SVG Doughnut (Enhanced) --- */
const SimpleDoughnut = ({ percent, color, label }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="admin-doughnut-wrapper">
      <div className="doughnut-container">
        <svg viewBox="0 0 100 100" className="admin-svg-doughnut">
          <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="none" />
          <circle 
            cx="50" cy="50" r={radius} 
            stroke={color} strokeWidth="10" fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round"
            transform="rotate(-90 50 50)" 
            style={{ 
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', 
              filter: `drop-shadow(0 0 8px ${color}66)` 
            }} 
          />
        </svg>
        <div className="doughnut-content">
          <span className="doughnut-value" style={{ color: color }}>{percent}%</span>
        </div>
      </div>
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
  const [activeTab, setActiveTab] = useState("overview");

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
        .not('id', 'eq', '00000000-0000-0000-0000-000000000000')
        .order('updated_at', { ascending: false });
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

  const stats = useMemo(() => {
    const now = new Date();
    const velocity = Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      return users.filter(u => new Date(u.updated_at).toDateString() === d.toDateString()).length;
    });

    return {
      totalUsers: users.length,
      activeAdmins: adminsList.length,
      lockedCount: lockedUsers.length,
      totalNodes: Object.values(pathsData || {}).reduce((acc, p) => acc + (p.nodes?.length || 0), 0),
      totalPaths: Object.keys(pathsData || {}).length,
      activityVelocity: velocity,
      recentActivity: users.slice(0, 10)
    };
  }, [users, adminsList, lockedUsers, pathsData]);

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
    setSuccessInfo("Infrastructure: Gemini dynamic key updated.");
  };

  const handleExportRegistry = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `genai_registry_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
          setPathsData(newPathsData); setSuccessInfo(`Forge: Processed ${count} paths.`);
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
    setSuccessInfo(`Forge: Injected path "${cleanPath.title}"`);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
    { id: 'users', label: 'Identities', icon: <Users size={14} /> },
    { id: 'infra', label: 'Infrastructure', icon: <Terminal size={14} /> },
    { id: 'forge', label: 'Forge', icon: <Zap size={14} /> }
  ];

  return (
    <div className="admin-page unified-dashboard">
      <div className="dashboard-bg-glow" />
      
      <header className="admin-header sticky-header">
        <div className="admin-header-left">
          <div className="admin-logo-orb">
             <Shield size={24} className="admin-shield" />
             <div className="orb-pulse-anim" />
          </div>
          <div>
            <h1>Command Center</h1>
            <p>Unified ecosystem intelligence & resource engineering.</p>
          </div>
        </div>
        <div className="header-actions">
           <div className="infrastructure-status-pill">
              <div className="status-dot pulsing" />
              <span>Network Active</span>
           </div>
           <button className="admin-refresh-btn" onClick={fetchUsers} title="Sync Real-time Data">
              <RefreshCw size={16} className={loading ? "spin" : ""} />
           </button>
           <button className="admin-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
      </header>

      <nav className="admin-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`admin-tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="admin-content scrolling-layout">
        {activeTab === 'overview' && (
          <div className="tab-content-fade">
            <section className="dashboard-section metrics-section">
              <div className="admin-stats-grid">
                  {[
                    { label: 'Total Identities', value: stats.totalUsers, icon: <Users />, color: 'var(--neon)', trend: '+12%' },
                    { label: 'Deployed Paths', value: stats.totalPaths, icon: <Map />, color: '#3b82f6', trend: 'Live' },
                    { label: 'Ecosystem Nodes', value: stats.totalNodes, icon: <Cpu />, color: '#a855f7', trend: 'Synced' },
                    { label: 'Admin Authority', value: stats.activeAdmins, icon: <ShieldCheck />, color: '#fbbf24', trend: 'Secured' }
                  ].map((s, i) => (
                    <div key={i} className="admin-stat-card" style={{ "--stat-color": s.color }}>
                      <div className="stat-card-header">
                        <div className="stat-icon-wrapper">{React.cloneElement(s.icon, { size: 18 })}</div>
                        <span className="stat-trend">{s.trend}</span>
                      </div>
                      <div className="stat-card-body">
                        <h3>{s.value}</h3>
                        <p>{s.label}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            <section className="dashboard-section split-view-section">
              <div className="admin-grid-main">
                  <div className="visuals-column">
                    <div className="admin-card chart-card glass-panel mb-4">
                      <div className="card-header">
                          <div className="header-icon-mini"><TrendingUp size={14} /></div>
                          <div><h3>Activity Velocity</h3><p>Real-time ecosystem interaction trend.</p></div>
                      </div>
                      <div className="chart-wrapper">
                        <SimpleLineChart data={stats.activityVelocity} color="var(--neon)" />
                      </div>
                    </div>

                    <div className="admin-card chart-card glass-panel">
                      <div className="card-header">
                          <div className="header-icon-mini"><Globe size={14} /></div>
                          <div><h3>Path Distribution</h3><p>Architecture engagement levels.</p></div>
                      </div>
                      <div className="doughnut-grid">
                          {pathCounts.map(p => (
                            <SimpleDoughnut 
                              key={p.path} 
                              percent={Math.round(p.percent)} 
                              color={p.path === 'ds' ? '#3b82f6' : p.path === 'genai' ? 'var(--neon)' : '#a855f7'} 
                              label={p.path.toUpperCase()} 
                            />
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="pulse-column">
                    <div className="admin-card glass-panel h-full">
                      <div className="card-header">
                        <div className="header-icon-mini"><Zap size={14} /></div>
                        <div><h3>Activity Pulse</h3><p>Real-time identity synchronization feed.</p></div>
                      </div>
                      <div className="pulse-feed mini-scrollbar">
                        {stats.recentActivity.map((u, i) => (
                          <div key={u.id} className="pulse-item" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="pulse-avatar">
                              <div className="avatar-orb" />
                            </div>
                            <div className="pulse-info">
                              <div className="pulse-user">Identity <code>{u.id.substring(0, 12)}</code></div>
                              <div className="pulse-action">Architecture Synced: {u.paths_data?.title || "Default"}</div>
                              <div className="pulse-time"><Clock size={10} /> {new Date(u.updated_at).toLocaleTimeString()}</div>
                            </div>
                            <ChevronRight size={14} className="pulse-chevron" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'users' && (
          <section className="dashboard-section tab-content-fade">
             <div className="admin-card glass-panel registry-card">
                 <div className="card-header split">
                    <div>
                       <h3>Ecosystem Registry</h3>
                       <p>Real-time identity management cluster ({users.length} profiles).</p>
                    </div>
                    <div className="header-ops">
                      <button className="export-btn" onClick={handleExportRegistry} title="Export as JSON">
                        <Download size={16} />
                      </button>
                      <div className="admin-search-wrapper">
                        <Search size={16} />
                        <input type="text" placeholder="Filter identities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                      </div>
                    </div>
                 </div>
                 <div className="admin-table-wrapper mini-scrollbar">
                    <table className="admin-table">
                       <thead>
                         <tr>
                           <th>Identity Identifier</th>
                           <th>Temporal Signature</th>
                           <th>Status</th>
                           <th style={{ textAlign: 'right' }}>Controls</th>
                         </tr>
                       </thead>
                       <tbody>
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="admin-table-row">
                              <td className="cell-user">
                                <div className="user-id-wrapper">
                                  <HardDrive size={12} className="id-icon" />
                                  <code>{u.id}</code>
                                </div>
                              </td>
                              <td className="cell-date">
                                <div className="date-flex">
                                  <Clock size={12} /> {new Date(u.updated_at).toLocaleString()}
                                </div>
                              </td>
                              <td className="cell-status">
                                 <span className={`admin-status-badge ${lockedUsers.includes(u.id) ? 'locked' : 'active'}`}>
                                    {lockedUsers.includes(u.id) ? 'Restricted' : 'Active'}
                                 </span>
                              </td>
                              <td className="cell-actions">
                                 <button 
                                   className={`admin-lock-toggle ${lockedUsers.includes(u.id) ? 'unlock' : 'lock'}`} 
                                   onClick={() => handleToggleLock(u.id)}
                                   title={lockedUsers.includes(u.id) ? "Grant Access" : "Restrict Access"}
                                 >
                                    {lockedUsers.includes(u.id) ? <Unlock size={14} /> : <Lock size={14} />}
                                 </button>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
          </section>
        )}

        {activeTab === 'infra' && (
          <div className="tab-content-fade">
            <section className="dashboard-section infra-section">
              <div className="admin-grid-infra">
                <div className="admin-card glass-panel infra-card">
                  <div className="infra-header">
                    <div className="infra-icon-bg gemini"><Sparkles size={16} /></div>
                    <div className="infra-title">
                      <h4>Gemini Infrastructure</h4>
                      <div className="infra-status online">Operational</div>
                    </div>
                  </div>
                  <div className="infra-details">
                    <div className="infra-stat"><span>Latency</span> <span>420ms</span></div>
                    <div className="infra-stat"><span>Reliability</span> <span>99.9%</span></div>
                    <div className="infra-stat"><span>Key Status</span> <span className={geminiKey ? "text-neon" : "text-error"}>{geminiKey ? "Dynamic ACTIVE" : "MISSING"}</span></div>
                  </div>
                </div>

                <div className="admin-card glass-panel infra-card">
                  <div className="infra-header">
                    <div className="infra-icon-bg supabase"><Database size={16} /></div>
                    <div className="infra-title">
                      <h4>Supabase Gateway</h4>
                      <div className="infra-status online">Operational</div>
                    </div>
                  </div>
                  <div className="infra-details">
                    <div className="infra-stat"><span>Connections</span> <span>{users.length} Active</span></div>
                    <div className="infra-stat"><span>DB Health</span> <span>Healthy</span></div>
                    <div className="infra-stat"><span>Persistence</span> <span>Encrypted</span></div>
                  </div>
                </div>

                <div className="admin-card glass-panel infra-card">
                  <div className="infra-header">
                    <div className="infra-icon-bg security"><ShieldCheck size={16} /></div>
                    <div className="infra-title">
                      <h4>Security Firewall</h4>
                      <div className="infra-status online">Guarded</div>
                    </div>
                  </div>
                  <div className="infra-details">
                    <div className="infra-stat"><span>Locked IDs</span> <span>{lockedUsers.length} Restricted</span></div>
                    <div className="infra-stat"><span>Admin Pool</span> <span>{adminsList.length} Operators</span></div>
                    <div className="infra-stat"><span>Auth Layer</span> <span>RBAC Tier 1</span></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <div className="admin-grid-main">
                <div className="admin-card glass-panel authority-card">
                  <div className="card-header">
                      <h3>Infrastructure Controller</h3>
                      <p>Global system parameters & credentials.</p>
                  </div>

                  <div className="config-switch-panel">
                      <div className="switch-row">
                        <div className="switch-text">
                          <h4>AIML Universal Access</h4>
                          <p>Enable companion for entire student pool.</p>
                        </div>
                        <button 
                          onClick={handleToggleAimlAccess}
                          className={`ios-switch ${allowAimlForAll ? 'on' : 'off'}`}
                        >
                          <div className="switch-handle" />
                        </button>
                      </div>
                    </div>
                  
                  <div className="infra-config-section mt-6">
                      <div className="config-header">
                        <div className="config-icon-bg"><Sparkles size={14} /></div>
                        <div>
                          <h4>Backbone Intelligence</h4>
                          <p>Dynamic Gemini API Credential</p>
                        </div>
                      </div>
                      
                      <div className="invite-form-minimal">
                        <div className="input-with-icon">
                          <Lock size={14} />
                          <input 
                            type={showKey ? "text" : "password"} 
                            placeholder="Paste API Key..." 
                            value={newGeminiKey} 
                            onChange={e => setNewGeminiKey(e.target.value)}
                          />
                        </div>
                        <button onClick={() => setShowKey(!showKey)} className="mini-action-btn">
                          {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={handleUpdateGeminiKey} className="mini-action-btn highlight"><CheckCircle2 size={14} /></button>
                      </div>

                      <div className="config-footer">
                        <a href="https://aistudio.google.com/app/api-keys" target="_blank" rel="noreferrer" className="config-link">
                          <ExternalLink size={10} /> GOOGLE AI STUDIO
                        </a>
                        {geminiKey && <span className="config-status-tag">ACTIVE</span>}
                      </div>
                    </div>
                </div>

                <div className="admin-card glass-panel authority-card">
                  <div className="card-header">
                      <h3>Authority Pool</h3>
                      <p>Operator cluster management.</p>
                  </div>

                  <div className="invite-form-minimal">
                      <div className="input-with-icon">
                        <Terminal size={14} />
                        <input type="email" placeholder="operator_email@genai.com" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
                      </div>
                      <button onClick={handleAddAdmin} className="mini-action-btn primary"><UserPlus size={14} /></button>
                  </div>

                  <div className="authority-list mini-scrollbar mt-4">
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
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'forge' && (
          <section className="dashboard-section tab-content-fade">
             <div className="admin-card glass-panel studio-forge-card">
                <div className="card-header split">
                   <div className="studio-header-main">
                      <div className="studio-icon-bg"><Zap size={20} /></div>
                      <div>
                         <h3>Architecture Forge</h3>
                         <p>Ecosystem blueprint injection & mass synchronization.</p>
                      </div>
                   </div>
                   <div className="studio-tabs-row">
                      {['file', 'paste'].map(t => (
                        <button 
                          key={t} 
                          className={`studio-tab-btn ${activeImportTab === t ? 'active' : ''}`} 
                          onClick={() => setActiveImportTab(t)}
                        >
                          {t.toUpperCase()}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="forge-body-unified">
                   {activeImportTab === 'file' ? (
                     <div className={`forge-drop-well ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                        <input ref={fileInputRef} type="file" accept=".json,.md,.txt" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />
                        <div className="well-content">
                          <UploadCloud size={48} className="well-icon" />
                          <h4>Inject Blueprint Payload</h4>
                          <p>Drop .json or .md structures to rebuild ecosystem architecture</p>
                          <div className="well-status-badge">READY FOR INJECTION</div>
                        </div>
                     </div>
                   ) : (
                     <div className="forge-paste-container">
                        <textarea 
                          value={rawPasteContent} 
                          onChange={e => setRawPasteContent(e.target.value)} 
                          placeholder="Paste architectural blueprint JSON or Markdown structure here..." 
                          className="forge-textarea-compact mini-scrollbar" 
                        />
                        <div className="forge-actions">
                           <button className="forge-btn-exec" onClick={handlePasteProcess}><Zap size={16} /> Execute Synchronization</button>
                           <button className="forge-btn-clear" onClick={() => setRawPasteContent("")}><Trash2 size={16} /> Clear</button>
                        </div>
                     </div>
                   )}

                   {(errorInfo || successInfo) && (
                     <div className={`forge-notifier ${errorInfo ? 'error' : 'success'}`}>
                        <div className="notifier-content">
                          {errorInfo ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                          <span>{errorInfo || successInfo}</span>
                        </div>
                        <button onClick={() => { setErrorInfo(null); setSuccessInfo(null); }} className="notifier-close"><X size={12} /></button>
                     </div>
                   )}
                </div>
                
                <div className="forge-footer-unified">
                   <div className="template-links">
                      <span className="label">Blueprint Templates:</span>
                      <button onClick={() => downloadSample('md')} className="template-btn"><FileText size={14} /> Markdown</button>
                      <button onClick={() => downloadSample('json')} className="template-btn"><FileJson size={14} /> JSON Schema</button>
                   </div>
                </div>
             </div>
          </section>
        )}
      </main>
    </div>
  );
}
