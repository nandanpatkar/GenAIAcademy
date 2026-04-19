import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  Search, 
  Calendar, 
  Clock, 
  Trash2, 
  Plus, 
  Code, 
  FileText, 
  ChevronRight, 
  ExternalLink,
  Save,
  X,
  Sparkles,
  Command,
  Edit2,
  Eye,
  Maximize2,
  Link as LinkIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/WorkplaceLab.css';

// --- Enhanced Markdown Components ---
const MarkdownComponents = {
  h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
  p: ({ children }) => <div className="md-p">{children}</div>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="md-link">
      {children} <ExternalLink size={10} style={{ display: 'inline', marginLeft: 2 }} />
    </a>
  ),
  img: ({ src, alt }) => (
    <img 
      src={src} 
      alt={alt} 
      className="md-img" 
      referrerPolicy="no-referrer" 
      loading="lazy"
      onError={(e) => {
        e.target.style.display = 'none'; // Hide broken images if CORS fails
      }}
    />
  ),
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline ? (
      <div className="md-code-block">
        <SyntaxHighlighter
          style={atomDark}
          language={match ? match[1] : 'javascript'}
          PreTag="pre"
          customStyle={{ background: 'transparent', padding: '16px', margin: 0 }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="md-inline-code" {...props}>
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="md-table-wrapper">
      <table className="md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="md-thead">{children}</thead>,
  tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
  tr: ({ children }) => <tr className="md-tr">{children}</tr>,
  th: ({ children }) => <th className="md-th">{children}</th>,
  td: ({ children }) => <td className="md-td">{children}</td>,
  ul: ({ children }) => <ul className="md-ul">{children}</ul>,
  ol: ({ children }) => <ol className="md-ol">{children}</ol>,
  li: ({ children }) => <li className="md-li">{children}</li>,
};

export default function WorkplaceLab({ 
  history = [], 
  notes = [], 
  onSaveNote, 
  onUpdateNote,
  onDeleteNote, 
  onJumpToNode, 
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', type: 'note' });
  
  // Full Screen Hub State
  const [selectedNote, setSelectedNote] = useState(null);
  const [hubMode, setHubMode] = useState('preview'); // 'edit' | 'preview'

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const snippetNotes = filteredNotes.filter(n => n.type === 'snippet');
  const theoryNotes = filteredNotes.filter(n => n.type === 'note');

  const handleCreate = () => {
    if (!newNote.title.trim()) return;
    onSaveNote({
      ...newNote,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    setNewNote({ title: '', content: '', type: 'note' });
    setIsCreating(false);
  };

  const handleUpdate = (updated) => {
    onUpdateNote(updated);
    setSelectedNote(updated);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="workplace-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="workplace-container"
      >
        {/* --- Sidebar / Header --- */}
        <header className="workplace-header" style={{ height: 62, background: 'var(--bg2)', borderBottom: `1px solid var(--border)`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0 }}>
          
          {/* Placeholder for sidebar toggle alignment */}
          <div style={{ width: 30, height: 30, flexShrink: 0 }} />

          {/* Logo + Title Stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, #f59e0b, #d97706)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 18px rgba(245, 158, 11, 0.35)' }}>
              <FileText size={19} color="#000" />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>Quick Notes</h1>
              <p style={{ margin: 0, fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>Personal Intelligence Vault · Research Snippets</p>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div className="workplace-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              className={`nav-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
              style={{
                background: activeTab === 'notes' ? 'var(--bg3)' : 'transparent',
                border: `1px solid ${activeTab === 'notes' ? 'var(--border)' : 'transparent'}`,
                color: activeTab === 'notes' ? 'var(--text)' : 'var(--text3)',
                padding: '6px 12px', borderRadius: 7, fontSize: 10, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s'
              }}
            >
              <FileText size={14} />
              <span>KNOWLEDGE_BASE</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              style={{
                background: activeTab === 'history' ? 'var(--bg3)' : 'transparent',
                border: `1px solid ${activeTab === 'history' ? 'var(--border)' : 'transparent'}`,
                color: activeTab === 'history' ? 'var(--text)' : 'var(--text3)',
                padding: '6px 12px', borderRadius: 7, fontSize: 10, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s'
              }}
            >
              <Clock size={14} />
              <span>TEMPORAL_HISTORY</span>
            </button>
          </div>

          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

          <button className="close-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px 8px' }}>
            <X size={20} />
          </button>
        </header>

        <div className="workplace-layout">
          {/* --- Main Content --- */}
          <div className="workplace-main">
            
            {/* --- Recently Studied --- */}
            <div className="history-quick-access">
              <div className="section-head">
                <Bookmark size={14} />
                <span>RECENTLY_STUDIED_NODES</span>
              </div>
              <div className="history-grid">
                {history.length > 0 ? history.map((item, i) => (
                  <motion.div 
                    key={item.id + i}
                    className="history-card"
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => onJumpToNode(item.id, item.pathId)}
                  >
                    <div className="card-top">
                      <span className="path-tag" style={{ color: item.pathColor }}>{item.pathTitle || 'PATH'}</span>
                      <ExternalLink size={12} />
                    </div>
                    <h3>{item.title}</h3>
                    <div className="card-foot">
                      <span>OPEN_NODE</span>
                    </div>
                  </motion.div>
                )) : (
                    <div className="empty-history">
                        No recent activity recorded yet. Start exploring the roadmap!
                    </div>
                )}
              </div>
            </div>

            {/* --- Snippets & Notes Section --- */}
            <div className="content-section">
              <div className="content-controls">
                <div className="search-wrapper">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search your intelligence base..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <motion.button 
                  className="add-btn" 
                  onClick={() => setIsCreating(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                  <span>NEW_ENTRY</span>
                </motion.button>
              </div>

              <div className="notes-scroll">
                <AnimatePresence>
                  {isCreating && (
                    <motion.div 
                      className="note-editor"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="editor-head">
                        <input 
                          placeholder="Entry Title..." 
                          value={newNote.title}
                          onChange={e => setNewNote({...newNote, title: e.target.value})}
                        />
                        <div className="type-toggle">
                          <motion.button 
                            className={newNote.type === 'note' ? 'active' : ''}
                            onClick={() => setNewNote({...newNote, type: 'note'})}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >Note</motion.button>
                          <motion.button 
                            className={newNote.type === 'snippet' ? 'active' : ''}
                            onClick={() => setNewNote({...newNote, type: 'snippet'})}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >Snippet</motion.button>
                        </div>
                      </div>
                      <textarea 
                        className="editor-textarea"
                        placeholder={newNote.type === 'note' ? "Write your findings (Supports Markdown)..." : "Paste your code snippet..."}
                        value={newNote.content}
                        onChange={e => setNewNote({...newNote, content: e.target.value})}
                      />
                      <div className="editor-foot">
                        <motion.button 
                          className="cancel-btn" 
                          onClick={() => setIsCreating(false)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >Cancel</motion.button>
                        <motion.button 
                          className="save-btn" 
                          onClick={handleCreate}
                          whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Save size={14} />
                          Save Entry
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="dual-repositories">
                  {/* --- SNIPPETS SECTION --- */}
                  <div className="repo-section">
                    <div className="repo-head">
                      <Code size={18} />
                      <span>Snippets</span>
                    </div>
                    <div className="notes-grid single-col">
                      {snippetNotes.map((note) => (
                        <NoteCard 
                          key={note.id} 
                          note={note} 
                          onDelete={() => onDeleteNote(note.id)} 
                          onClick={() => {
                            setSelectedNote(note);
                            setHubMode('preview');
                          }}
                          formatTimestamp={formatTimestamp}
                        />
                      ))}
                      {snippetNotes.length === 0 && <div className="empty-repo">No code snippets saved.</div>}
                    </div>
                  </div>

                  {/* --- NOTES SECTION --- */}
                  <div className="repo-section">
                    <div className="repo-head">
                      <FileText size={18} />
                      <span>Quick Notes</span>
                    </div>
                    <div className="notes-grid single-col">
                      {theoryNotes.map((note) => (
                        <NoteCard 
                          key={note.id} 
                          note={note} 
                          onDelete={() => onDeleteNote(note.id)} 
                          onClick={() => {
                            setSelectedNote(note);
                            setHubMode('preview');
                          }}
                          formatTimestamp={formatTimestamp}
                        />
                      ))}
                      {theoryNotes.length === 0 && <div className="empty-repo">No theory notes saved.</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Full Screen Hub --- */}
      <AnimatePresence>
        {selectedNote && (
          <FullScreenHub 
            note={selectedNote} 
            mode={hubMode} 
            setMode={setHubMode}
            onUpdate={handleUpdate}
            onClose={() => setSelectedNote(null)}
            formatTimestamp={formatTimestamp}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NoteCard({ note, onDelete, onClick, formatTimestamp }) {
  return (
    <motion.div 
      layout
      className={`note-card ${note.type === 'snippet' ? 'snippet-style' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
    >
      <div className="note-card-head">
        <div className="note-meta">
          {note.type === 'snippet' ? <Code size={14} /> : <FileText size={14} />}
          <span>{formatTimestamp(note.timestamp)}</span>
        </div>
        <motion.button 
          className="del-btn" 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={12} />
        </motion.button>
      </div>
      
      <h3>{note.title}</h3>
      
      <div className="note-content mini-preview">
        {note.type === 'snippet' ? (
          <SyntaxHighlighter 
            language="javascript" 
            style={atomDark} 
            customStyle={{ fontSize: '11px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}
          >
            {note.content}
          </SyntaxHighlighter>
        ) : (
          <div className="md-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{note.content}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="card-footer-action">
        <Maximize2 size={10} />
        <span>EXPAND_ENTRY</span>
      </div>
    </motion.div>
  );
}

function FullScreenHub({ note, mode, setMode, onUpdate, onClose, formatTimestamp }) {
  const [draft, setDraft] = useState({ ...note });

  const handleSave = () => {
    onUpdate(draft);
    setMode('preview');
  };

  return (
    <motion.div 
      className="hub-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div className="hub-header">
        <div className="hub-title-section">
          {mode === 'edit' ? (
            <input 
              className="hub-title-input"
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              placeholder="ENTRY_TITLE"
              autoFocus
            />
          ) : (
            <h1 className="hub-title-display">{note.title}</h1>
          )}
          <div className="timestamp-badge">
            <Calendar size={14} />
            <span>RECORDED: {formatTimestamp(note.timestamp)}</span>
          </div>
        </div>

        <div className="hub-controls">
          <motion.button 
            className={`hub-toggle-btn ${mode === 'edit' ? 'active' : ''}`}
            onClick={() => setMode('edit')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit2 size={14} />
            Edit
          </motion.button>
          <motion.button 
            className={`hub-toggle-btn ${mode === 'preview' ? 'active' : ''}`}
            onClick={() => setMode('preview')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={14} />
            Preview
          </motion.button>
          
          <div className="hub-divider" />
          
          {mode === 'edit' && (
            <motion.button 
              className="hub-save-btn" 
              onClick={handleSave}
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={14} />
              Save Changes
            </motion.button>
          )}
          
          <motion.button 
            className="hub-close-btn" 
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={14} />
          </motion.button>
        </div>
      </div>

      <div className="hub-main">
        {mode === 'edit' ? (
          <div className="hub-editor-wrap">
            <textarea 
              className="hub-textarea"
              value={draft.content}
              onChange={e => setDraft({ ...draft, content: e.target.value })}
              placeholder="Record your intelligence here (Markdown supported)..."
            />
          </div>
        ) : (
          <div className="hub-preview-wrap">
            <div className="md-renderer-container">
              {note.type === 'snippet' ? (
                <SyntaxHighlighter 
                  language="javascript" 
                  style={atomDark} 
                  customStyle={{ 
                    fontSize: '16px', 
                    borderRadius: '16px', 
                    background: 'transparent',
                    padding: 0
                  }}
                >
                  {note.content}
                </SyntaxHighlighter>
              ) : (
                <div className="md-content glass-render">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{note.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
