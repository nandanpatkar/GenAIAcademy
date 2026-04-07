import React, { useState, useEffect } from "react";
import { Users, Shield, Lock, Unlock, BarChart3, Search, UserPlus, X, Trash2, ShieldCheck, Activity, Globe, Map } from "lucide-react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import "../styles/global.css";

export default function AdminManagement({ onClose }) {
  const { adminsList, setAdminsList, lockedUsers, setLockedUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // "users" | "analytics" | "admins"

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_curriculum')
        .select('*')
        .not('id', 'eq', '00000000-0000-0000-0000-000000000000'); // Exclude global config
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const updateGlobalConfig = async (newAdmins, newLocked) => {
    try {
      await supabase
        .from('user_curriculum')
        .upsert({
          id: '00000000-0000-0000-0000-000000000000',
          paths_data: {
            admins: newAdmins,
            locked: newLocked,
            updated_at: new Date().toISOString()
          }
        });
    } catch (err) {
      console.error("Error updating global config:", err);
    }
  };

  const handleToggleLock = async (userId) => {
    let newLocked;
    if (lockedUsers.includes(userId)) {
      newLocked = lockedUsers.filter(id => id !== userId);
    } else {
      newLocked = [...lockedUsers, userId];
    }
    setLockedUsers(newLocked);
    await updateGlobalConfig(adminsList, newLocked);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes("@")) return;
    if (adminsList.includes(newAdminEmail)) return;

    const newAdmins = [...adminsList, newAdminEmail];
    setAdminsList(newAdmins);
    setNewAdminEmail("");
    await updateGlobalConfig(newAdmins, lockedUsers);
  };

  const handleRemoveAdmin = async (email) => {
    if (adminsList.length <= 1) return alert("Cannot remove the last admin.");
    const newAdmins = adminsList.filter(e => e !== email);
    setAdminsList(newAdmins);
    await updateGlobalConfig(newAdmins, lockedUsers);
  };

  const filteredUsers = users.filter(u => 
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.paths_data?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeAdmins: adminsList.length,
    lockedCount: lockedUsers.length,
    totalNodes: users.reduce((acc, u) => acc + (Object.values(u.paths_data || {}).reduce((a, b) => a + (b.nodes?.length || 0), 0)), 0)
  };

  return (
    <div className="admin-management-page" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '32px 48px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)', backdropFilter: 'blur(10px)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Admin Management
          </h1>
          <p style={{ color: 'var(--text3)', margin: '4px 0 0', fontSize: '0.95rem' }}>
            System control panel for user access and platform analytics.
          </p>
        </div>
        <button className="rg-btn" onClick={onClose} style={{ padding: '8px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
          <X size={18} /> Close Panel
        </button>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 48px', display: 'flex', gap: 32, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        {[
          { id: 'users', label: 'Registered Users', icon: <Users size={16} /> },
          { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 size={16} /> },
          { id: 'admins', label: 'System Admins', icon: <Shield size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '16px 4px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text3)',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 400 }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                <input 
                  type="text" 
                  placeholder="Search user ID or curriculum..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', outline: 'none' }}
                />
              </div>
              <button className="rg-btn" onClick={fetchUsers} style={{ padding: '10px 16px' }}>
                 <Activity size={16} /> Refresh List
              </button>
            </div>

            <div style={{ background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '16px 24px' }}>User ID</th>
                    <th style={{ padding: '16px 24px' }}>Last Updated</th>
                    <th style={{ padding: '16px 24px' }}>Status</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>Loading users...</td></tr>
                  ) : filteredUsers.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>👤</div>
                          <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: 'var(--text)' }}>{user.id}</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '0.85rem', color: 'var(--text2)' }}>
                        {new Date(user.updated_at).toLocaleString()}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: 20, 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          background: lockedUsers.includes(user.id) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: lockedUsers.includes(user.id) ? '#ef4444' : '#10b981',
                          border: `1px solid ${lockedUsers.includes(user.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                        }}>
                          {lockedUsers.includes(user.id) ? 'Locked' : 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleToggleLock(user.id)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: lockedUsers.includes(user.id) ? '#10b981' : '#ef4444', 
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          {lockedUsers.includes(user.id) ? <><Unlock size={14} /> Unlock</> : <><Lock size={14} /> Lock Access</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {[
                { label: 'Total Registered', value: stats.totalUsers, icon: <Users />, color: 'var(--primary)' },
                { label: 'Active Admins', value: stats.activeAdmins, icon: <Shield />, color: '#8b5cf6' },
                { label: 'Access Restricted', value: stats.lockedCount, icon: <Lock />, color: '#ef4444' },
                { label: 'Total Learning Nodes', value: stats.totalNodes, icon: <Map />, color: '#3b82f6' }
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24, padding: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: 'var(--text3)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>{s.label}</span>
                    <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', fontWeight: 800, color: 'var(--text)' }}>{s.value}</h3>
                  </div>
                  <div style={{ color: s.color, opacity: 0.2 }}>
                    {React.cloneElement(s.icon, { size: 48 })}
                  </div>
                </div>
              ))}
            </div>

            {/* Path Distribution */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24, padding: 40 }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 24px', color: 'var(--text)' }}>Learning Path Popularity</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {['ds', 'genai', 'agentic'].map(path => {
                    const count = users.filter(u => u.paths_data && u.paths_data[path]).length;
                    const percent = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
                    return (
                      <div key={path} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text2)', textTransform: 'capitalize' }}>{path} Curriculum</span>
                            <span style={{ color: 'var(--text1)' }}>{count} users ({percent.toFixed(1)}%)</span>
                         </div>
                         <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text)' }}>Grant Administrative Access</h3>
              <p style={{ color: 'var(--text3)', margin: '0 0 24px', fontSize: '0.9rem' }}>Invite other users to manage content and platform settings.</p>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <input 
                  type="email" 
                  placeholder="Enter email address..."
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  style={{ flex: 1, padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', outline: 'none' }}
                />
                <button onClick={handleAddAdmin} className="rg-btn" style={{ padding: '0 24px' }}>
                  <UserPlus size={18} /> Add Admin
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Active Administrators</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {adminsList.map(email => (
                  <div key={email} style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={20} />
                      </div>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text1)', fontWeight: 500 }}>{email}</span>
                      {email === 'nandanpatkar14114@gmail.com' && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'var(--bg3)', color: 'var(--text3)', fontWeight: 800 }}>CORE</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemoveAdmin(email)}
                      style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
