import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, 
  Send, 
  Users, 
  Settings, 
  Plus, 
  MessageSquare, 
  Bell, 
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  Shield,
  Zap,
  Globe,
  Terminal,
  Cpu,
  ChevronRight,
  Activity,
  Code,
  Layout,
  Command,
  Info,
  Edit,
  Trash2,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LetterAvatar from './LetterAvatar';
import '../../styles/Community.css';

const Community = ({ isSidebarCollapsed }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [dms, setDms] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showMemberSidebar, setShowMemberSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('groups');
  
  // Modals state
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState('create');
  const [groupForm, setGroupForm] = useState({ name: '', description: '' });
  
  const [showDmModal, setShowDmModal] = useState(false);
  const [dmEmail, setDmEmail] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingChannelRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial Data Fetch: Groups, DMs, and Active Users
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Groups & DMs
      const { data } = await supabase
        .from('community_groups')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data) {
        const publicGroups = data.filter(g => !g.is_private);
        const privateDms = data.filter(g => g.is_private);
        
        setGroups(publicGroups);
        setDms(privateDms);
        
        if (!activeGroup && publicGroups.length > 0) {
          setActiveGroup(publicGroups[0]);
        }
      }

      // Fetch Active Users (from messages) for DM suggestions
      if (user) {
        const { data: msgData } = await supabase
          .from('messages')
          .select('user_email')
          .not('user_email', 'is', null);
          
        if (msgData) {
          const uniqueEmails = [...new Set(msgData.map(d => d.user_email))];
          setActiveUsers(uniqueEmails.filter(email => email !== user.email));
        }
      }
    };
    
    fetchInitialData();
  }, [user]);

  // Fetch Channels & Members when Active Group changes
  useEffect(() => {
    if (!activeGroup) return;

    const fetchChannels = async () => {
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('group_id', activeGroup.id)
        .order('created_at', { ascending: true });
      
      if (data) {
        setChannels(data);
        if (data.length > 0) setActiveChannel(data[0]);
        else setActiveChannel(null);
      }
    };
    
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('community_members')
        .select('*')
        .eq('group_id', activeGroup.id);
      
      if (data) setMembers(data);
    };

    fetchChannels();
    fetchMembers();
  }, [activeGroup]);

  // Fetch Messages when Active Channel changes
  useEffect(() => {
    if (!activeChannel) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`*`)
        .eq('channel_id', activeChannel.id)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel(`room:${activeChannel.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `channel_id=eq.${activeChannel.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    // Typing Channel Integration
    const presenceChannel = supabase.channel(`presence:${activeChannel.id}`);

    presenceChannel
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.userId !== user?.id) {
          setTypingUsers(prev => {
            if (payload.isTyping) {
              if (prev.find(u => u.id === payload.userId)) return prev;
              return [...prev, { id: payload.userId, name: payload.userName }];
            } else {
              return prev.filter(u => u.id !== payload.userId);
            }
          });
        }
      })
      .subscribe();

    typingChannelRef.current = presenceChannel;

    return () => {
      messageSubscription.unsubscribe();
      presenceChannel.unsubscribe();
      typingChannelRef.current = null;
    };
  }, [activeChannel, user]);

  const openCreateGroupModal = () => {
    setGroupModalMode('create');
    setGroupForm({ name: '', description: '' });
    setShowGroupModal(true);
  };

  const openEditGroupModal = (group, e) => {
    e.stopPropagation();
    setGroupModalMode('edit');
    setGroupForm({ name: group.name, description: group.description || '' });
    setShowGroupModal(true);
  };

  const submitGroupForm = async () => {
    if (!groupForm.name.trim() || !user) return;
    
    if (groupModalMode === 'create') {
      const { data, error } = await supabase
        .from('community_groups')
        .insert([{ name: groupForm.name.trim(), description: groupForm.description.trim(), created_by: user.id, is_private: false }])
        .select();
      
      if (!error && data) {
        setGroups([...groups, data[0]]);
        setActiveGroup(data[0]);
        await supabase.from('community_members').insert([{ group_id: data[0].id, user_id: user.id, role: 'admin' }]);
        await supabase.from('channels').insert([{ group_id: data[0].id, name: 'general', description: 'General tactical channel' }]);
      }
    } else if (groupModalMode === 'edit') {
      const { error } = await supabase
        .from('community_groups')
        .update({ name: groupForm.name.trim(), description: groupForm.description.trim() })
        .eq('id', activeGroup.id);
        
      if (!error) {
        setGroups(groups.map(g => g.id === activeGroup.id ? { ...g, name: groupForm.name, description: groupForm.description } : g));
        setActiveGroup({ ...activeGroup, name: groupForm.name, description: groupForm.description });
      }
    }
    
    setShowGroupModal(false);
  };

  const handleDeleteGroup = async (group, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      const { error } = await supabase.from('community_groups').delete().eq('id', group.id);
      if (!error) {
        if (group.is_private) {
          setDms(dms.filter(g => g.id !== group.id));
        } else {
          setGroups(groups.filter(g => g.id !== group.id));
        }
        
        if (activeGroup?.id === group.id) {
          setActiveGroup(null);
          setActiveChannel(null);
        }
      }
    }
  };

  const handleLeaveGroup = async (group, e) => {
    e.stopPropagation();
    if (!user) return;
    if (window.confirm('Are you sure you want to leave this group?')) {
      const { error } = await supabase.from('community_members').delete().eq('group_id', group.id).eq('user_id', user.id);
      if (!error) {
        if (group.is_private) {
          setDms(dms.filter(g => g.id !== group.id));
        } else {
          setGroups(groups.filter(g => g.id !== group.id));
        }
        if (activeGroup?.id === group.id) {
          setActiveGroup(null);
          setActiveChannel(null);
        }
      }
    }
  };

  const openDmModal = () => {
    setDmEmail('');
    setShowDmModal(true);
  };

  const startDirectMessage = async () => {
    if (!dmEmail.trim() || !user) return;
    
    // Check if DM already exists with this name
    const existingDm = dms.find(dm => dm.name.toLowerCase() === dmEmail.trim().toLowerCase());
    if (existingDm) {
      setActiveGroup(existingDm);
      setSidebarTab('dms');
      setShowDmModal(false);
      return;
    }

    // Create a private group for the DM
    const { data, error } = await supabase
      .from('community_groups')
      .insert([{ 
        name: dmEmail.trim(), 
        description: `Direct message with ${dmEmail.trim()}`, 
        created_by: user.id,
        is_private: true 
      }])
      .select();
      
    if (!error && data) {
      setDms([...dms, data[0]]);
      setActiveGroup(data[0]);
      setSidebarTab('dms');
      await supabase.from('community_members').insert([{ group_id: data[0].id, user_id: user.id, role: 'admin' }]);
      await supabase.from('channels').insert([{ group_id: data[0].id, name: 'chat', description: 'Direct Message' }]);
    }
    
    setShowDmModal(false);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user || !activeChannel) return;

    const messageContent = inputText.trim();
    setInputText('');
    stopTyping();

    // System Commands Integration
    if (messageContent.startsWith('/')) {
      const command = messageContent.slice(1).toLowerCase();
      if (command === 'clear') { setMessages([]); return; }
      if (command === 'status') {
        setMessages(prev => [...prev, { 
          id: 'sys-' + Date.now(),
          content: '### System Analysis\n- **Nodes:** Active\n- **Buffer:** Clear\n- **Sync:** Verified',
          user_email: 'SYSTEM',
          is_ai: true,
          created_at: new Date().toISOString()
        }]);
        return;
      }
    }

    try {
      await supabase.from('messages').insert([{ 
        channel_id: activeChannel.id, 
        user_id: user.id, 
        content: messageContent,
        user_email: user.email || 'Agent'
      }]);
    } catch (err) {
      console.error('Send Error:', err);
    }
  };

  const startTyping = () => {
    if (isTyping || !typingChannelRef.current) return;
    setIsTyping(true);
    typingChannelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, userName: user.email?.split('@')[0], isTyping: true },
    });
  };

  const stopTyping = () => {
    if (!isTyping || !typingChannelRef.current) return;
    setIsTyping(false);
    typingChannelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, userName: user.email?.split('@')[0], isTyping: false },
    });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (e.target.value.length > 0) startTyping();
    else stopTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 3000);
  };

  const confirmCodeAttach = () => {
    if (codeSnippet.trim()) {
      const formatted = `\n\`\`\`${codeLanguage}\n${codeSnippet}\n\`\`\`\n`;
      setInputText(prev => prev + formatted);
    }
    setShowCodeModal(false);
    setCodeSnippet('');
  };

  return (
    <div className={`community-root ${isSidebarCollapsed ? 'full-width' : ''}`}>
      <div className="community-container">
        <header className="community-main-header">
          <div className="header-info-group">
            <h1>{activeGroup ? activeGroup.name : 'COMMUNITY'} <span className="glow-text">CHAT</span></h1>
          </div>
          
          <div className="header-status-area">
            <div className="header-actions">
              <Users size={18} onClick={() => setShowMemberSidebar(!showMemberSidebar)} className="action-icon" />
              <Bell size={18} className="action-icon" />
              <Settings size={18} className="action-icon" />
            </div>
          </div>
        </header>

        <div className="community-body">
          {/* Pane 2: Channel Sidebar */}
          <aside className="channel-sidebar">
            <div className="sidebar-tabs">
              <button className={`sidebar-tab ${sidebarTab === 'groups' ? 'active' : ''}`} onClick={() => setSidebarTab('groups')}>GROUPS</button>
              <button className={`sidebar-tab ${sidebarTab === 'dms' ? 'active' : ''}`} onClick={() => setSidebarTab('dms')}>DIRECT MESSAGES</button>
            </div>
            
            <div className="channel-list">
              {sidebarTab === 'groups' ? (
                <>
                  <div className="category-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>YOUR GROUPS</span>
                    <button className="group-action-btn" onClick={openCreateGroupModal} title="Create Group"><Plus size={14} /></button>
                  </div>
                  
                  {groups.map(group => (
                    <div key={group.id} className="group-wrapper">
                      <div 
                        className={`group-header ${activeGroup?.id === group.id ? 'active' : ''}`}
                        onClick={() => setActiveGroup(group)}
                      >
                        <div className="group-info">
                          <Hash size={16} />
                          <span>{group.name}</span>
                        </div>
                        <div className="group-actions">
                          {user?.id === group.created_by ? (
                            <>
                              <button className="group-action-btn" onClick={(e) => openEditGroupModal(group, e)}><Edit size={14} /></button>
                              <button className="group-action-btn danger" onClick={(e) => handleDeleteGroup(group, e)}><Trash2 size={14} /></button>
                            </>
                          ) : (
                            <button className="group-action-btn danger" onClick={(e) => handleLeaveGroup(group, e)}><LogOut size={14} /></button>
                          )}
                        </div>
                      </div>
                      
                      {activeGroup?.id === group.id && (
                        <div className="group-channels" style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                          {channels.map(channel => (
                            <div 
                              key={channel.id} 
                              className={`channel-item ${activeChannel?.id === channel.id ? 'active' : ''}`}
                              onClick={(e) => { e.stopPropagation(); setActiveChannel(channel); }}
                            >
                              <MessageSquare size={16} />
                              <span>{channel.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="category-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>DIRECT MESSAGES</span>
                    <button className="group-action-btn" onClick={openDmModal} title="Start DM"><Plus size={14} /></button>
                  </div>
                  
                  {dms.length === 0 ? (
                    <div style={{ padding: '16px', color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center' }}>
                      No direct messages yet. Start one to connect privately.
                    </div>
                  ) : (
                    dms.map(dm => (
                      <div key={dm.id} className="group-wrapper">
                        <div 
                          className={`group-header ${activeGroup?.id === dm.id ? 'active' : ''}`}
                          onClick={() => setActiveGroup(dm)}
                        >
                          <div className="group-info">
                            <User size={16} />
                            <span>{dm.name}</span>
                          </div>
                          <div className="group-actions">
                            <button className="group-action-btn danger" onClick={(e) => handleDeleteGroup(dm, e)}><Trash2 size={14} /></button>
                          </div>
                        </div>
                        
                        {activeGroup?.id === dm.id && (
                          <div className="group-channels" style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                            {channels.map(channel => (
                              <div 
                                key={channel.id} 
                                className={`channel-item ${activeChannel?.id === channel.id ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); setActiveChannel(channel); }}
                              >
                                <MessageSquare size={16} />
                                <span>{channel.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </aside>

          {/* Pane 3: Chat Area */}
          <main className="chat-feed">
            <div className="chat-header">
              <div className="header-info">
                {sidebarTab === 'dms' ? <User size={20} className="header-hash" /> : <Hash size={20} className="header-hash" />}
                <div className="channel-meta">
                  <span className="channel-name">{activeChannel?.name || 'select a channel'}</span>
                  <p className="channel-desc">{sidebarTab === 'dms' ? 'Encrypted private channel.' : 'Tactical stream established.'}</p>
                </div>
              </div>
            </div>

            <div className="message-list">
              <div className="messages-inner">
                {messages.length === 0 && activeChannel ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                    No messages in this channel yet. Be the first to transmit.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`message-wrap ${msg.user_id === user?.id ? 'self-message' : ''}`}>
                      <div className="avatar-area">
                        <LetterAvatar name={msg.user_email || 'A'} size={28} />
                      </div>
                      <div className="msg-content-area">
                        <div className="msg-header">
                          <span className="author">{msg.user_id === user?.id ? 'You' : msg.user_email?.split('@')[0]}</span>
                          <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="message-text">
                          <ReactMarkdown
                            components={{
                              code({ inline, className, children }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <SyntaxHighlighter style={atomDark} language={match[1]} className="code-block">
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className}>{children}</code>
                                );
                              }
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="typing-indicator-wrap">
                <span className="typing-text">{typingUsers[0].name} is typing...</span>
              </div>
            )}

            {/* Input Area */}
            <div className="input-area">
              <div className="input-wrapper">
                <button className="input-icon" onClick={() => setShowCodeModal(true)}>
                  <Code size={20} />
                </button>
                <textarea
                  className="main-input-textarea"
                  placeholder={activeChannel ? `Transmission to #${activeChannel.name}...` : 'Select a channel to begin transmission...'}
                  value={inputText}
                  onChange={handleInputChange}
                  disabled={!activeChannel}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                />
                <button className="send-btn" onClick={handleSendMessage} disabled={!inputText.trim() || !activeChannel}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </main>

          {/* Pane 4: Member Sidebar */}
          {showMemberSidebar && (
            <aside className="member-list">
              <div className="section-header">ONLINE NODES</div>
              <div className="member-card">
                <LetterAvatar name="System" size={34} />
                <div className="member-info">
                  <div className="name">GenAI Bot</div>
                  <div className="role">CORE SYSTEM</div>
                </div>
              </div>
              <div className="section-header">MEMBERS</div>
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <LetterAvatar name={member.user_email || 'Agent'} size={34} />
                  <div className="member-info">
                    <div className="name">{member.user_email?.split('@')[0]}</div>
                    <div className="role">ACTIVE NODE</div>
                  </div>
                </div>
              ))}
            </aside>
          )}
        </div>

        {/* Code Modal */}
        <AnimatePresence>
          {showCodeModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="code-modal-overlay"
              onClick={() => setShowCodeModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="code-modal-content"
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="modal-title"><Code size={20} /> ATCH CODE SNIPPET</div>
                  <div className="language-selector">
                    {['javascript', 'python', 'sql'].map(lang => (
                      <button key={lang} className={`lang-btn ${codeLanguage === lang ? 'active' : ''}`} onClick={() => setCodeLanguage(lang)}>{lang.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <textarea 
                  className="code-textarea" 
                  placeholder="Initialize code block..." 
                  value={codeSnippet} 
                  onChange={e => setCodeSnippet(e.target.value)} 
                  autoFocus 
                />
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={() => setShowCodeModal(false)}>CANCEL</button>
                  <button className="confirm-btn" onClick={confirmCodeAttach}>ATTACH TO MESSAGE</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Group Management Modal */}
        <AnimatePresence>
          {showGroupModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="code-modal-overlay"
              onClick={() => setShowGroupModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="code-modal-content group-modal-content"
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="modal-title">
                    <Settings size={20} /> 
                    {groupModalMode === 'create' ? 'INITIALIZE NEW GROUP' : 'CONFIGURE GROUP PARAMETERS'}
                  </div>
                </div>
                <div style={{ padding: '32px 0 0' }}>
                  <div className="form-group">
                    <label>GROUP DESIGNATION (NAME)</label>
                    <input 
                      className="form-input" 
                      placeholder="e.g. Project Nexus" 
                      value={groupForm.name} 
                      onChange={e => setGroupForm({...groupForm, name: e.target.value})} 
                      autoFocus 
                    />
                  </div>
                  <div className="form-group">
                    <label>MISSION BRIEF (DESCRIPTION)</label>
                    <input 
                      className="form-input" 
                      placeholder="Optional description" 
                      value={groupForm.description} 
                      onChange={e => setGroupForm({...groupForm, description: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="modal-footer" style={{ marginTop: '0', borderTop: 'none', padding: '0 40px' }}>
                  <button className="cancel-btn" onClick={() => setShowGroupModal(false)}>CANCEL</button>
                  <button className="confirm-btn" onClick={submitGroupForm}>
                    {groupModalMode === 'create' ? 'EXECUTE CREATION' : 'SAVE CONFIGURATION'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start DM Modal */}
        <AnimatePresence>
          {showDmModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="code-modal-overlay"
              onClick={() => setShowDmModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="code-modal-content group-modal-content"
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="modal-title">
                    <User size={20} /> 
                    ESTABLISH DIRECT LINK
                  </div>
                </div>
                <div style={{ padding: '32px 0 0' }}>
                  <div className="form-group">
                    <label>RECIPIENT EMAIL / IDENTIFIER</label>
                    <input 
                      className="form-input" 
                      placeholder="Enter user email..." 
                      value={dmEmail} 
                      onChange={e => setDmEmail(e.target.value)} 
                      autoFocus 
                    />
                  </div>
                  
                  {activeUsers.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px', display: 'block' }}>SUGGESTED RECIPIENTS:</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {activeUsers.map(email => (
                          <div 
                            key={email} 
                            style={{ 
                              padding: '6px 12px', 
                              background: 'rgba(0, 255, 136, 0.05)', 
                              border: '1px solid rgba(0, 255, 136, 0.2)', 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: 'var(--accent-glow)'
                            }}
                            onClick={() => setDmEmail(email)}
                          >
                            {email}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer" style={{ marginTop: '0', borderTop: 'none', padding: '0 40px' }}>
                  <button className="cancel-btn" onClick={() => setShowDmModal(false)}>CANCEL</button>
                  <button className="confirm-btn" onClick={startDirectMessage} disabled={!dmEmail.trim()}>
                    INITIATE CONNECTION
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Community;


