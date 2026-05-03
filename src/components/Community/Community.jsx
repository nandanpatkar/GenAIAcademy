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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [bio, setBio] = useState('');
  const [tempBio, setTempBio] = useState('');
  const [profiles, setProfiles] = useState({});
  const [emailToId, setEmailToId] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [channelToGroupMap, setChannelToGroupMap] = useState({});
  const [groupToChannelsMap, setGroupToChannelsMap] = useState({});
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  
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
      // Fetch Public Groups
      const { data: publicData } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: true });

      // Fetch Groups where User is a Member (to catch private DMs and joined groups)
      const { data: memberGroupsData } = await supabase
        .from('community_members')
        .select(`
          community_groups (*)
        `)
        .eq('user_id', user.id);
      
      if (publicData || memberGroupsData) {
        const memberGroups = memberGroupsData 
          ? memberGroupsData.map(m => m.community_groups).filter(Boolean)
          : [];
          
        // Combine and deduplicate
        const allGroupsList = [...(publicData || []), ...memberGroups];
        const uniqueGroupsMap = new Map();
        allGroupsList.forEach(g => uniqueGroupsMap.set(g.id, g));
        const uniqueGroups = Array.from(uniqueGroupsMap.values());
        
        const publicGroups = uniqueGroups.filter(g => !g.is_private);
        const privateDms = uniqueGroups.filter(g => g.is_private);
        
        setGroups(publicGroups);
        setDms(privateDms);
        
        if (!activeGroup && publicGroups.length > 0) {
          setActiveGroup(publicGroups[0]);
        }
      }

      // Fetch Profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*');
      
      if (profileData) {
        const profileMap = {};
        profileData.forEach(p => {
          profileMap[p.id] = p;
        });
        setProfiles(profileMap);
        
        if (user && profileMap[user.id]) {
          setNickname(profileMap[user.id].nickname || '');
          setBio(profileMap[user.id].bio || '');
          setTempNickname(profileMap[user.id].nickname || '');
          setTempBio(profileMap[user.id].bio || '');
        }
      }

      // Fetch All Channels for mapping
      const { data: channelData } = await supabase
        .from('channels')
        .select('id, group_id');
      
      if (channelData) {
        const cMap = {};
        const gMap = {};
        channelData.forEach(c => {
          cMap[c.id] = c.group_id;
          if (!gMap[c.group_id]) gMap[c.group_id] = [];
          gMap[c.group_id].push(c.id);
        });
        setChannelToGroupMap(cMap);
        setGroupToChannelsMap(gMap);
      }

      // Fetch Active Users (from messages) for DM suggestions
      if (user) {
        const { data: msgData } = await supabase
          .from('messages')
          .select('user_email, user_id')
          .not('user_email', 'is', null);
          
        if (msgData) {
          const uniqueEmails = [...new Set(msgData.map(d => d.user_email))];
          setActiveUsers(uniqueEmails.filter(email => email !== user.email));
          
          const eMap = {};
          msgData.forEach(m => {
            if (m.user_email && m.user_id) eMap[m.user_email] = m.user_id;
          });
          setEmailToId(eMap);
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

  // Global Message Listener for Unread Counts
  useEffect(() => {
    if (!user) return;

    const globalSub = supabase
      .channel('global-messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        const newMessage = payload.new;
        
        // Don't count our own messages
        if (newMessage.user_id === user.id) return;

        // Determine if it's currently active
        const isCurrentChannel = activeChannel && newMessage.channel_id === activeChannel.id;
        const isCurrentGroup = activeGroup && newMessage.group_id === activeGroup.id && !newMessage.channel_id;

        if (!isCurrentChannel && !isCurrentGroup) {
          const key = newMessage.channel_id || newMessage.group_id;
          if (key) {
            setUnreadCounts(prev => ({
              ...prev,
              [key]: (prev[key] || 0) + 1
            }));

            // Audio Notification
            if (audioEnabled) {
              const audio = new Audio('/git-visualizer/sounds/notification.mp3');
              audio.play().catch(e => console.warn('Audio play failed:', e));
            }
          }
        }

        // Update email to ID mapping if new
        if (newMessage.user_email && newMessage.user_id) {
          setEmailToId(prev => {
            if (prev[newMessage.user_email]) return prev;
            return { ...prev, [newMessage.user_email]: newMessage.user_id };
          });
        }
      })
      .subscribe();

    return () => {
      globalSub.unsubscribe();
    };
  }, [user, activeChannel, activeGroup]);

  // Clear unread counts when switching
  useEffect(() => {
    if (activeChannel) {
      setUnreadCounts(prev => ({ ...prev, [activeChannel.id]: 0 }));
    }
  }, [activeChannel]);

  useEffect(() => {
    if (activeGroup && !activeChannel) {
      setUnreadCounts(prev => ({ ...prev, [activeGroup.id]: 0 }));
    }
  }, [activeGroup, activeChannel]);

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
    if (!groupForm.name.trim() || !user || isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (groupModalMode === 'create') {
        const { data: groupData, error: groupError } = await supabase
          .from('community_groups')
          .insert([{ 
            name: groupForm.name.trim(), 
            description: groupForm.description.trim(), 
            created_by: user.id, 
            is_private: false 
          }])
          .select();
        
        if (groupError) throw groupError;
        if (!groupData || groupData.length === 0) throw new Error("Failed to create group");

        const newGroup = groupData[0];

        // 1. Add owner
        const { error: memberError } = await supabase
          .from('community_members')
          .insert([{ 
            group_id: newGroup.id, 
            user_id: user.id, 
            role: 'admin' 
          }]);
        
        if (memberError) throw memberError;

        // 2. Create default channel
        const { data: channelData, error: channelError } = await supabase
          .from('channels')
          .insert([{ 
            group_id: newGroup.id, 
            name: 'general', 
            description: 'General tactical channel' 
          }])
          .select();
        
        if (channelError) throw channelError;

        // 3. Update all states immediately for a seamless transition
        setGroups(prev => [...prev, newGroup]);
        if (channelData && channelData.length > 0) {
          setChannels(channelData);
          setActiveChannel(channelData[0]);
        }
        setActiveGroup(newGroup);
        setSidebarTab('groups');
      } else if (groupModalMode === 'edit') {
        const { error: updateError } = await supabase
          .from('community_groups')
          .update({ 
            name: groupForm.name.trim(), 
            description: groupForm.description.trim() 
          })
          .eq('id', activeGroup.id);
          
        if (updateError) throw updateError;

        setGroups(prev => prev.map(g => g.id === activeGroup.id ? { ...g, name: groupForm.name, description: groupForm.description } : g));
        setActiveGroup({ ...activeGroup, name: groupForm.name, description: groupForm.description });
      }
      setShowGroupModal(false);
    } catch (err) {
      console.error('Group operation failed:', err);
      alert(`Operation failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteGroup = async (group, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      const { error } = await supabase.from('community_groups').delete().eq('id', group.id);
      if (!error) {
        if (group.is_private) {
          setDms(prev => prev.filter(g => g.id !== group.id));
        } else {
          setGroups(prev => prev.filter(g => g.id !== group.id));
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
          setDms(prev => prev.filter(g => g.id !== group.id));
        } else {
          setGroups(prev => prev.filter(g => g.id !== group.id));
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

  const startDirectMessage = async (targetEmail = null) => {
    const finalEmail = (targetEmail || dmEmail).trim();
    if (!finalEmail || !user || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Check if DM already exists with this name (case-insensitive)
      const existingDm = dms.find(dm => dm.name.toLowerCase() === finalEmail.toLowerCase());
      if (existingDm) {
        setActiveGroup(existingDm);
        setSidebarTab('dms');
        
        // Fetch and set channels for existing DM immediately
        const { data: existingChannels } = await supabase
          .from('channels')
          .select('*')
          .eq('group_id', existingDm.id)
          .order('created_at', { ascending: true });
        
        if (existingChannels && existingChannels.length > 0) {
          setChannels(existingChannels);
          setActiveChannel(existingChannels[0]);
        }
        
        setShowDmModal(false);
        return;
      }

      // Find recipient ID
      let recipientId = emailToId[finalEmail];
      if (!recipientId) {
        const { data: foundUser, error: findError } = await supabase
          .from('messages')
          .select('user_id')
          .eq('user_email', finalEmail)
          .limit(1);
        
        if (findError) throw findError;
        
        if (foundUser && foundUser.length > 0) {
          recipientId = foundUser[0].user_id;
        } else {
          throw new Error("User not found. They must have sent at least one message to be discoverable.");
        }
      }

      // Create a private group for the DM
      const { data: groupData, error: groupError } = await supabase
        .from('community_groups')
        .insert([{ 
          name: finalEmail, 
          description: `Direct message with ${finalEmail}`, 
          created_by: user.id,
          is_private: true 
        }])
        .select();
        
      if (groupError) throw groupError;
      if (!groupData || groupData.length === 0) throw new Error("Failed to create DM group");

      const newGroup = groupData[0];
      
      // 1. Add both participants to community_members
      const { error: memberError } = await supabase.from('community_members').insert([
        { group_id: newGroup.id, user_id: user.id, role: 'admin' },
        { group_id: newGroup.id, user_id: recipientId, role: 'member' }
      ]);
      
      if (memberError) throw memberError;
      
      // 2. Create the channel
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .insert([{ 
          group_id: newGroup.id, 
          name: 'chat', 
          description: 'Direct Message' 
        }])
        .select();
      
      if (channelError) throw channelError;
      
      // 3. Finally update state and select it
      setDms(prev => [...prev, newGroup]);
      if (channelData && channelData.length > 0) {
        setChannels(channelData);
        setActiveChannel(channelData[0]);
      }
      setSidebarTab('dms');
      setActiveGroup(newGroup);
      setShowDmModal(false);
    } catch (err) {
      console.error('Direct Message failure:', err);
      alert(err.message || "Failed to start direct message");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        nickname: tempNickname.trim(),
        bio: tempBio.trim(),
        updated_at: new Date().toISOString()
      });
      
    if (!error) {
      setNickname(tempNickname.trim());
      setBio(tempBio.trim());
      setProfiles(prev => ({
        ...prev,
        [user.id]: { 
          ...prev[user.id], 
          nickname: tempNickname.trim(),
          bio: tempBio.trim() 
        }
      }));
      setShowSettingsModal(false);
    }
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

  const getGroupUnreadCount = (groupId) => {
    const channelIds = groupToChannelsMap[groupId] || [];
    return channelIds.reduce((sum, id) => sum + (unreadCounts[id] || 0), 0) + (unreadCounts[groupId] || 0);
  };

  const totalUnreads = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  const groupsUnreadTotal = groups.reduce((sum, g) => sum + getGroupUnreadCount(g.id), 0);
  const dmsUnreadTotal = dms.reduce((sum, d) => sum + getGroupUnreadCount(d.id), 0);

  return (
    <div className={`community-root ${isSidebarCollapsed ? 'full-width' : ''}`}>
      <div className="community-container">
        <header className="community-main-header">
          <div className="header-content">
            <div className="title-area">
              <span className="header-prefix">NETWORK INTERFACE</span>
              <h1>GenAi Academy <span className="glow-text">chat</span></h1>
            </div>
            
            <div className="header-status-area">
              <div className="header-actions">
                <div className="action-icon-wrap" onClick={() => setShowMemberSidebar(!showMemberSidebar)}>
                  <Users 
                    size={20} 
                    className={`action-icon ${showMemberSidebar ? 'active' : ''}`} 
                    title="Members"
                  />
                </div>
                
                <div className="action-icon-wrap">
                  <Bell size={20} className="action-icon" title="Notifications" />
                  <AnimatePresence>
                    {totalUnreads > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="header-badge"
                      >
                        {totalUnreads}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="action-icon-wrap" onClick={() => {
                   setTempNickname(nickname);
                   setTempBio(bio);
                   setActiveSettingsTab('profile');
                   setShowSettingsModal(true);
                }}>
                  <Settings size={20} className="action-icon" title="Settings & Profile" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="community-body">
          {/* Pane 2: Channel Sidebar */}
          <aside className="channel-sidebar">
            <div className="sidebar-tabs">
              <button className={`sidebar-tab ${sidebarTab === 'groups' ? 'active' : ''}`} onClick={() => setSidebarTab('groups')}>
                GROUPS 
                <AnimatePresence>
                  {groupsUnreadTotal > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="tab-badge"
                    >
                      {groupsUnreadTotal}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button className={`sidebar-tab ${sidebarTab === 'dms' ? 'active' : ''}`} onClick={() => setSidebarTab('dms')}>
                DIRECT MESSAGES 
                <AnimatePresence>
                  {dmsUnreadTotal > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="tab-badge"
                    >
                      {dmsUnreadTotal}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
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
                          {getGroupUnreadCount(group.id) > 0 && activeGroup?.id !== group.id && (
                            <span className="unread-badge small">{getGroupUnreadCount(group.id)}</span>
                          )}
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
                              <div className="channel-item-content">
                                <MessageSquare size={16} />
                                <span>{channel.name}</span>
                              </div>
                              {unreadCounts[channel.id] > 0 && (
                                <span className="unread-badge">{unreadCounts[channel.id]}</span>
                              )}
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
                            <span>{profiles[emailToId[dm.name]]?.nickname || dm.name}</span>
                          </div>
                          {unreadCounts[dm.id] > 0 && (
                            <span className="unread-badge">{unreadCounts[dm.id]}</span>
                          )}
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
                  <span className="channel-name">
                    {sidebarTab === 'dms' && activeGroup 
                      ? (profiles[emailToId[activeGroup.name]]?.nickname || activeGroup.name.split('@')[0])
                      : (activeChannel?.name || 'select a channel')}
                  </span>
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
                    <div key={msg.id} className={`message-wrap ${msg.user_id === user?.id ? 'self-message' : ''} ${msg.is_ai ? 'ai-message' : ''}`}>
                      <div className="avatar-area">
                        <LetterAvatar name={profiles[msg.user_id]?.nickname || msg.user_email || 'A'} size={28} />
                      </div>
                      <div className="msg-content-area">
                        <div className="msg-header">
                          <span className={`author ${msg.user_id === user?.id ? 'self' : ''}`}>
                            {msg.user_id === user?.id 
                              ? 'YOU' 
                              : (profiles[msg.user_id]?.nickname || msg.user_email?.split('@')[0])}
                            {msg.is_ai && <span className="ai-tag">AI</span>}
                          </span>
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
                  <LetterAvatar name={profiles[member.user_id]?.nickname || member.user_email || 'Agent'} size={34} />
                  <div className="member-info">
                    <div className={`name ${member.user_id === user?.id ? 'self' : ''}`}>
                      {member.user_id === user?.id 
                        ? 'YOU' 
                        : (profiles[member.user_id]?.nickname || member.user_email?.split('@')[0])}
                    </div>
                    <div className="role">{member.user_id === user?.id ? 'OPERATOR' : 'ACTIVE NODE'}</div>
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
                  <button className="cancel-btn" onClick={() => setShowGroupModal(false)} disabled={isProcessing}>CANCEL</button>
                  <button className="confirm-btn" onClick={submitGroupForm} disabled={isProcessing || !groupForm.name.trim()}>
                    {isProcessing ? 'INITIALIZING...' : (groupModalMode === 'create' ? 'EXECUTE CREATION' : 'SAVE CONFIGURATION')}
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
                            onClick={() => startDirectMessage(email)}
                          >
                            {email}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer" style={{ marginTop: '0', borderTop: 'none', padding: '0 40px' }}>
                  <button className="cancel-btn" onClick={() => setShowDmModal(false)} disabled={isProcessing}>CANCEL</button>
                  <button className="confirm-btn" onClick={() => startDirectMessage()} disabled={!dmEmail.trim() || isProcessing}>
                    {isProcessing ? 'ESTABLISHING LINK...' : 'INITIATE CONNECTION'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal (Nickname) */}
        <AnimatePresence>
          {showSettingsModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="code-modal-overlay"
              onClick={() => setShowSettingsModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="code-modal-content group-modal-content"
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="modal-title">
                    {activeSettingsTab === 'profile' ? <User size={20} /> : <Settings size={20} />} 
                    {activeSettingsTab === 'profile' ? 'IDENTITY PARAMETERS' : 'SYSTEM PREFERENCES'}
                  </div>
                </div>

                <div className="sidebar-tabs" style={{ padding: '16px 40px 0' }}>
                  <button 
                    className={`sidebar-tab ${activeSettingsTab === 'profile' ? 'active' : ''}`} 
                    onClick={() => setActiveSettingsTab('profile')}
                  >
                    PROFILE
                  </button>
                  <button 
                    className={`sidebar-tab ${activeSettingsTab === 'settings' ? 'active' : ''}`} 
                    onClick={() => setActiveSettingsTab('settings')}
                  >
                    SETTINGS
                  </button>
                </div>

                <div style={{ padding: '24px 0 0' }}>
                  {activeSettingsTab === 'profile' ? (
                    <div style={{ padding: '0 40px' }}>
                      <div className="form-group">
                        <label>CURRENT IDENTITY</label>
                        <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                          {user?.email}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>TACTICAL NICKNAME</label>
                        <input 
                          className="form-input" 
                          placeholder="e.g. Ghost_01" 
                          value={tempNickname} 
                          onChange={e => setTempNickname(e.target.value)} 
                          autoFocus 
                        />
                      </div>
                      <div className="form-group">
                        <label>PERSONNEL BIO</label>
                        <textarea 
                          className="form-input" 
                          placeholder="Tell us about your specialization..." 
                          value={tempBio} 
                          onChange={e => setTempBio(e.target.value)} 
                          style={{ minHeight: '80px', resize: 'none' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '0 40px' }}>
                      <div className="form-group">
                        <label>NOTIFICATIONS</label>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Audio Transmissions</span>
                          <div 
                            style={{ 
                              width: '40px', 
                              height: '20px', 
                              background: audioEnabled ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)', 
                              borderRadius: '20px', 
                              position: 'relative', 
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => setAudioEnabled(!audioEnabled)}
                          >
                            <div style={{ 
                              position: 'absolute', 
                              left: audioEnabled ? 'auto' : '2px',
                              right: audioEnabled ? '2px' : 'auto', 
                              top: '2px', 
                              width: '16px', 
                              height: '16px', 
                              background: audioEnabled ? 'var(--accent-emerald)' : 'var(--text-tertiary)', 
                              borderRadius: '50%',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>PRIVACY PROTOCOLS</label>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Stealth Mode (Incognito)</span>
                          <div 
                            style={{ 
                              width: '40px', 
                              height: '20px', 
                              background: stealthMode ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)', 
                              borderRadius: '20px', 
                              position: 'relative', 
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => setStealthMode(!stealthMode)}
                          >
                            <div style={{ 
                              position: 'absolute', 
                              left: stealthMode ? 'auto' : '2px',
                              right: stealthMode ? '2px' : 'auto', 
                              top: '2px', 
                              width: '16px', 
                              height: '16px', 
                              background: stealthMode ? 'var(--accent-emerald)' : 'var(--text-tertiary)', 
                              borderRadius: '50%',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>DISPLAY MODE</label>
                        <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                          Obsidian Neon (System Default)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer" style={{ marginTop: '0', borderTop: 'none', padding: '0 40px 32px' }}>
                  <button className="cancel-btn" onClick={() => setShowSettingsModal(false)}>CLOSE</button>
                  {activeSettingsTab === 'profile' && (
                    <button className="confirm-btn" onClick={updateProfile}>UPDATE IDENTITY</button>
                  )}
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


