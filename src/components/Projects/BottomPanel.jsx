/**
 * BottomPanel.jsx — Tabbed bottom panel for the IDE
 *
 * Tabs: Terminal (AI-powered + react-py), Git, Search, Problems
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, GitBranch, Search, AlertCircle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import GitPanel from './GitPanel';
import { searchFiles } from '../../services/projectService';
import { callAI } from '../../services/aiService';

// ─── Terminal ────────────────────────────────────────────────────────────────
function TerminalTab({ onToast }) {
  const { currentProject, activeFile } = useProjects();
  const [lines, setLines] = useState([
    { type: 'info', text: '⚡ AI Terminal — Python via react-py, AI-powered shell assistance' },
    { type: 'info', text: `Project: ${currentProject?.name || 'Unknown'}` },
    { type: 'prompt', text: '$ ' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines]);

  const addLine = (text, type = 'output') => {
    setLines(prev => [...prev, { text, type }]);
  };

  const handleCommand = useCallback(async (cmd) => {
    if (!cmd.trim()) return;
    setHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistIdx(-1);
    addLine(`$ ${cmd}`, 'prompt');
    setRunning(true);

    try {
      // Python execution
      if (cmd.startsWith('python ') || cmd.startsWith('python3 ') || cmd === 'python' || cmd === 'python3') {
        const filename = cmd.split(' ')[1];
        if (filename) {
          // Try to find file in project
          addLine(`[Running ${filename} via react-py...]`, 'info');
          // Note: react-py needs to be set up at a higher level; we show simulated output here
          addLine('Note: Full Python execution available in Practice IDE (react-py)', 'ai');
        } else {
          addLine('Interactive Python REPL not available. Use the Practice IDE.', 'info');
        }
      }
      // AI-powered command simulation
      else {
        const termMessages = [{
          role: 'user',
          content: `You are a terminal assistant. The user typed: "${cmd}". 
Context: Cloud IDE for project "${currentProject?.name}". 
Respond with what this command would output (simulate it realistically), or explain what it does and how to run it properly in this browser environment. Keep responses short.`
        }];
        const response = await callAI(termMessages, 400);
        const lines = (response || 'Command processed').split('\n');
        lines.forEach(l => addLine(l || ' ', l.startsWith('$') ? 'prompt' : 'output'));
      }
    } catch (err) {
      addLine(`Error: ${err.message}`, 'error');
    } finally {
      setRunning(false);
      addLine('$ ', 'prompt');
    }
  }, [currentProject]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setInput('');
      if (cmd === 'clear') { setLines([{ type: 'prompt', text: '$ ' }]); return; }
      handleCommand(cmd);
    }
    if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      if (history[idx]) setInput(history[idx]);
    }
    if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  };

  return (
    <div className="ide-terminal">
      <div className="ide-terminal-output" ref={outputRef}>
        {lines.map((line, i) => (
          <div key={i} className={`ide-terminal-line ${line.type}`}>
            {line.type === 'prompt' ? (
              i === lines.length - 1 ? null : <>{line.text}</>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
      <div className="ide-terminal-input-row">
        <span className="ide-terminal-prompt-label">$</span>
        <input
          className="ide-terminal-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={running ? 'Running…' : 'Enter command or ask AI…'}
          disabled={running}
          autoFocus
        />
        {running && <span className="ide-spinner" style={{ width: 12, height: 12 }} />}
      </div>
    </div>
  );
}

// ─── Search Tab ──────────────────────────────────────────────────────────────
function SearchTab({ onToast, onFileOpen }) {
  const { currentProject, flatFiles } = useProjects();
  const [query, setQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [results, setResults] = useState([]);
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !currentProject) return;
    setLoading(true);
    try {
      const res = await searchFiles(currentProject.id, query, { regex: isRegex, caseSensitive });
      setResults(res);
      if (res.length === 0) onToast?.('No results found', 'info');
    } catch (err) {
      onToast?.('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  }, [query, currentProject, isRegex, caseSensitive, onToast]);

  return (
    <div className="ide-search-panel">
      <div className="ide-search-controls">
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="ide-search-input-wrap" style={{ flex: 1 }}>
            <Search size={11} style={{ color: 'var(--ide-text-muted)', flexShrink: 0 }} />
            <input
              className="ide-search-input"
              placeholder="Search in files…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="ide-search-flags">
            <button
              className={`ide-search-flag-btn ${caseSensitive ? 'active' : ''}`}
              title="Case Sensitive"
              onClick={() => setCaseSensitive(p => !p)}
            >Aa</button>
            <button
              className={`ide-search-flag-btn ${isRegex ? 'active' : ''}`}
              title="Use Regular Expression"
              onClick={() => setIsRegex(p => !p)}
            >.*</button>
          </div>
        </div>
        <div className="ide-search-input-wrap">
          <input
            className="ide-search-input"
            placeholder="Replace…"
            value={replaceText}
            onChange={e => setReplaceText(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <span className="ide-spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <div className="ide-search-results">
          {results.map((file) => (
            <div key={file.id} className="ide-search-result-file">
              <div className="ide-search-result-file-header" onClick={() => onFileOpen?.(file)}>
                📄 {file.file_path} ({file.matches.length} match{file.matches.length !== 1 ? 'es' : ''})
              </div>
              {file.matches.slice(0, 5).map((m, i) => (
                <div key={i} className="ide-search-result-match">
                  <span className="ide-search-result-line-no">{m.lineNumber}</span>
                  <span className="ide-search-result-content">{m.lineContent}</span>
                </div>
              ))}
              {file.matches.length > 5 && (
                <div style={{ padding: '2px 16px', fontSize: 10, color: 'var(--ide-text-muted)' }}>
                  +{file.matches.length - 5} more matches
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Problems Tab ─────────────────────────────────────────────────────────────
function ProblemsTab() {
  return (
    <div style={{ padding: 16, textAlign: 'center', color: 'var(--ide-text-muted)', fontSize: 12 }}>
      <AlertCircle size={20} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
      <div>No problems detected</div>
      <div style={{ fontSize: 10, marginTop: 4 }}>Monaco will surface syntax errors here</div>
    </div>
  );
}

// ─── Bottom Panel ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'terminal', label: 'Terminal', icon: <Terminal size={11} /> },
  { id: 'git', label: 'Source Control', icon: <GitBranch size={11} /> },
  { id: 'search', label: 'Search', icon: <Search size={11} /> },
  { id: 'problems', label: 'Problems', icon: <AlertCircle size={11} /> },
];

export default function BottomPanel({ onToast, onFileOpen }) {
  const { bottomTab, setBottomTab, isBottomOpen, setIsBottomOpen, gitStatus } = useProjects();

  const gitBadge = gitStatus.staged.length + gitStatus.unstaged.length;

  return (
    <div className="ide-bottom-section">
      <div className="ide-resize-handle-h" />
      <div className="ide-bottom-panel" style={{ height: isBottomOpen ? 'var(--ide-bottom-h)' : 0, minHeight: 0 }}>
        <div className="ide-bottom-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`ide-bottom-tab ${bottomTab === tab.id && isBottomOpen ? 'active' : ''}`}
              onClick={() => {
                if (bottomTab === tab.id && isBottomOpen) {
                  setIsBottomOpen(false);
                } else {
                  setBottomTab(tab.id);
                  setIsBottomOpen(true);
                }
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'git' && gitBadge > 0 && (
                <span style={{
                  background: 'var(--ide-accent)', color: '#000', fontSize: 9, fontWeight: 800,
                  padding: '1px 5px', borderRadius: 20, marginLeft: 2,
                }}>
                  {gitBadge}
                </span>
              )}
            </button>
          ))}
          <button
            className="ide-bottom-close"
            onClick={() => setIsBottomOpen(p => !p)}
            title={isBottomOpen ? 'Collapse' : 'Expand'}
          >
            {isBottomOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        </div>

        {isBottomOpen && (
          <div className="ide-bottom-content">
            {bottomTab === 'terminal' && <TerminalTab onToast={onToast} />}
            {bottomTab === 'git' && <GitPanel onToast={onToast} />}
            {bottomTab === 'search' && <SearchTab onToast={onToast} onFileOpen={onFileOpen} />}
            {bottomTab === 'problems' && <ProblemsTab />}
          </div>
        )}
      </div>
    </div>
  );
}
