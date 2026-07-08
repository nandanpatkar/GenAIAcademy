/**
 * BottomPanel.jsx — Tabbed bottom panel for the IDE
 *
 * Tabs: Terminal (AI-powered + react-py), Git, Search, Problems
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, GitBranch, Search, AlertCircle, X, ChevronUp, ChevronDown, Play, Square, Loader2 } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import GitPanel from './GitPanel';
import { searchFiles, saveFile } from '../../services/projectService';
import { callAI } from '../../services/aiService';
import { RUN_LANGUAGES, languageForFilename, executeCode } from '../../services/jdoodleService';

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
  const { currentProject, flatFiles, openFiles, updateOpenFileContent } = useProjects();
  const [query, setQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [results, setResults] = useState([]);
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replacing, setReplacing] = useState(false);

  const totalMatches = results.reduce((n, f) => n + f.matches.length, 0);

  const buildPattern = () => {
    const flags = caseSensitive ? 'g' : 'gi';
    try {
      return isRegex
        ? new RegExp(query, flags)
        : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } catch {
      return null;
    }
  };

  const handleReplaceAll = useCallback(async () => {
    if (!query.trim() || !currentProject || results.length === 0 || replacing) return;
    const pattern = buildPattern();
    if (!pattern) { onToast?.('Invalid regular expression', 'error'); return; }
    setReplacing(true);
    let changed = 0;
    try {
      for (const file of results) {
        const original = file.content || '';
        const updated = original.replace(pattern, replaceText);
        if (updated !== original) {
          await saveFile(currentProject.id, file.file_path, updated, { language: file.language });
          // Keep any open tab for this file in sync.
          const open = openFiles.find(f => f.path === file.file_path);
          if (open) updateOpenFileContent(open.id, updated);
          changed++;
        }
      }
      onToast?.(`Replaced across ${changed} file${changed !== 1 ? 's' : ''}`, 'success');
      setResults([]);
    } catch (err) {
      onToast?.('Replace failed', 'error');
    } finally {
      setReplacing(false);
    }
  }, [query, replaceText, results, currentProject, replacing, isRegex, caseSensitive, openFiles, updateOpenFileContent, onToast]);

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
        <div className="ide-search-input-wrap" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            className="ide-search-input"
            placeholder="Replace…"
            value={replaceText}
            onChange={e => setReplaceText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReplaceAll(); }}
          />
          <button
            className="ide-search-replace-btn"
            onClick={handleReplaceAll}
            disabled={!query.trim() || results.length === 0 || replacing}
            title="Replace all matches across files"
          >
            {replacing ? 'Replacing…' : 'Replace All'}
          </button>
        </div>
        {results.length > 0 && (
          <div className="ide-search-count">
            {totalMatches} match{totalMatches !== 1 ? 'es' : ''} in {results.length} file{results.length !== 1 ? 's' : ''}
          </div>
        )}
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

// ─── Run (JDoodle) ─────────────────────────────────────────────────────────────
function RunTab({ onToast }) {
  const { activeFile } = useProjects();
  const [language, setLanguage] = useState('python3');
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null); // { output, statusCode, memory, cpuTime }
  const [error, setError] = useState('');
  const abortRef = useRef(false);

  // Auto-pick language from the active file's extension when it changes.
  useEffect(() => {
    const detected = languageForFilename(activeFile?.filename);
    if (detected) setLanguage(detected);
  }, [activeFile?.id]);

  const run = useCallback(async () => {
    if (!activeFile) { onToast?.('Open a file to run', 'error'); return; }
    if (running) return;
    setRunning(true);
    setError('');
    setResult(null);
    abortRef.current = false;
    try {
      const res = await executeCode({
        script: activeFile.content || '',
        language,
        stdin,
      });
      if (abortRef.current) return;
      setResult(res);
      if (res.statusCode && res.statusCode !== 200) {
        onToast?.('Ran with errors', 'info');
      } else {
        onToast?.('Executed ✓', 'success');
      }
    } catch (err) {
      if (abortRef.current) return;
      setError(err.message || 'Execution failed');
      onToast?.(err.message || 'Execution failed', 'error');
    } finally {
      setRunning(false);
    }
  }, [activeFile, language, stdin, running, onToast]);

  // Bridge so the editor's Run button (and Ctrl/Cmd+Enter) can trigger a run.
  useEffect(() => {
    window.__ideRunTrigger = () => run();
    return () => { delete window.__ideRunTrigger; };
  }, [run]);

  return (
    <div className="ide-run-tab">
      <div className="ide-run-toolbar">
        <button className="ide-run-btn" onClick={run} disabled={running || !activeFile}>
          {running ? <Loader2 size={12} className="ide-spin" /> : <Play size={12} />}
          {running ? 'Running…' : 'Run'}
        </button>
        {running && (
          <button className="ide-run-btn ghost" onClick={() => { abortRef.current = true; setRunning(false); }}>
            <Square size={11} /> Stop
          </button>
        )}

        <select
          className="ide-run-lang"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          title="Language"
        >
          {RUN_LANGUAGES.map(l => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>

        <button
          className={`ide-run-stdin-toggle ${showStdin ? 'active' : ''}`}
          onClick={() => setShowStdin(s => !s)}
          title="Standard input"
        >
          stdin
        </button>

        <span className="ide-run-file">
          {activeFile ? activeFile.filename : 'no file open'}
        </span>

        {result && (
          <span className="ide-run-stats">
            {result.cpuTime != null && <span>{result.cpuTime}s CPU</span>}
            {result.memory != null && <span>{result.memory} KB</span>}
          </span>
        )}
      </div>

      {showStdin && (
        <textarea
          className="ide-run-stdin"
          placeholder="Standard input (one value per line)…"
          value={stdin}
          onChange={e => setStdin(e.target.value)}
          rows={2}
        />
      )}

      <div className="ide-run-output">
        {!result && !error && !running && (
          <div className="ide-run-empty">Press Run to execute the active file. Output appears here.</div>
        )}
        {running && <div className="ide-run-empty">Executing on JDoodle…</div>}
        {error && <pre className="ide-run-stream error">{error}</pre>}
        {result && (
          <pre className={`ide-run-stream ${result.statusCode && result.statusCode !== 200 ? 'error' : ''}`}>
            {result.output || '(no output)'}
          </pre>
        )}
      </div>
    </div>
  );
}

// ─── Bottom Panel ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'terminal', label: 'Terminal', icon: <Terminal size={11} /> },
  { id: 'run', label: 'Run', icon: <Play size={11} /> },
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
            {bottomTab === 'run' && <RunTab onToast={onToast} />}
            {bottomTab === 'git' && <GitPanel onToast={onToast} />}
            {bottomTab === 'search' && <SearchTab onToast={onToast} onFileOpen={onFileOpen} />}
            {bottomTab === 'problems' && <ProblemsTab />}
          </div>
        )}
      </div>
    </div>
  );
}
