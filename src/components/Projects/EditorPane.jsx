/**
 * EditorPane.jsx — Monaco Editor with multi-tab support
 *
 * Features: tabs, auto-save, Cmd+S save, Monaco diff viewer,
 * context menu for AI actions, syntax highlighting.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { X, Save, Code2, GitCompare, Play, Settings2, Columns2, RotateCcw, Eye, FileCode } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import { saveFile, getFile } from '../../services/projectService';
import { languageForFilename } from '../../services/jdoodleService';
import { useEditorSettings, applySettings } from './useEditorSettings';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NotebookViewer from './NotebookViewer';

const MONACO_OPTIONS = {
  fontSize: 13,
  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
  fontLigatures: true,
  lineHeight: 1.6,
  minimap: { enabled: true, scale: 0.7 },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  formatOnPaste: true,
  formatOnType: true,
  bracketPairColorization: { enabled: true },
  guides: { bracketPairs: true, indentation: true },
  wordWrap: 'off',
  renderLineHighlight: 'gutter',
  scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
  padding: { top: 12, bottom: 12 },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  theme: 'vs-dark',
};

const FILE_ICONS = {
  py: '🐍', js: '⚡', jsx: '⚛', ts: '🔷', tsx: '⚛',
  html: '🌐', css: '🎨', scss: '🎨', json: '📋',
  md: '📝', sql: '🗄️', sh: '💻', yaml: '⚙️', yml: '⚙️',
  go: '🐹', rs: '🦀', java: '☕', rb: '💎', swift: '🐦',
};

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return FILE_ICONS[ext] || '📄';
};

// AI Context Menu actions
const AI_ACTIONS = [
  { id: 'explain', label: 'Explain Selection', icon: '💡' },
  { id: 'refactor', label: 'Refactor', icon: '🔧' },
  { id: 'fix', label: 'Fix Bugs', icon: '🐛' },
  { id: 'optimize', label: 'Optimize', icon: '⚡' },
  { id: 'generate-tests', label: 'Generate Tests', icon: '🧪' },
  { id: 'add-comments', label: 'Add Comments', icon: '💬' },
  { id: 'convert', label: 'Convert Language', icon: '🔄' },
  { id: 'generate-docs', label: 'Generate Docs', icon: '📚' },
];

function EditorContextMenu({ x, y, onClose, onAIAction, hasSelection }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="ide-editor-context-menu"
      style={{ left: Math.min(x, window.innerWidth - 220), top: Math.min(y, window.innerHeight - 280) }}
    >
      <div style={{ padding: '4px 10px 6px', fontSize: 9, fontWeight: 700, color: 'var(--ide-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
        AI Actions {!hasSelection && '(select code first)'}
      </div>
      {AI_ACTIONS.map(a => (
        <div
          key={a.id}
          className="projects-context-menu-item"
          style={{ opacity: !hasSelection && ['explain', 'refactor', 'fix', 'optimize', 'generate-tests', 'add-comments', 'convert'].includes(a.id) ? 0.5 : 1 }}
          onClick={() => { onAIAction(a.id); onClose(); }}
        >
          <span>{a.icon}</span> {a.label}
        </div>
      ))}
    </div>
  );
}

// ── Editor settings popover ────────────────────────────────────────────────
function EditorSettingsPopover({ settings, update, reset, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="ide-settings-popover">
      <div className="ide-settings-title">Editor Settings</div>

      <label className="ide-settings-row">
        <span>Font size</span>
        <div className="ide-settings-stepper">
          <button onClick={() => update({ fontSize: Math.max(9, settings.fontSize - 1) })}>−</button>
          <span>{settings.fontSize}</span>
          <button onClick={() => update({ fontSize: Math.min(28, settings.fontSize + 1) })}>+</button>
        </div>
      </label>

      <label className="ide-settings-row">
        <span>Tab size</span>
        <select value={settings.tabSize} onChange={e => update({ tabSize: Number(e.target.value) })}>
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={8}>8</option>
        </select>
      </label>

      <label className="ide-settings-row">
        <span>Word wrap</span>
        <select value={settings.wordWrap} onChange={e => update({ wordWrap: e.target.value })}>
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>
      </label>

      <label className="ide-settings-row">
        <span>Line numbers</span>
        <select value={settings.lineNumbers} onChange={e => update({ lineNumbers: e.target.value })}>
          <option value="on">On</option>
          <option value="relative">Relative</option>
          <option value="off">Off</option>
        </select>
      </label>

      <label className="ide-settings-row">
        <span>Theme</span>
        <select value={settings.theme} onChange={e => update({ theme: e.target.value })}>
          <option value="vs-dark">Dark</option>
          <option value="hc-black">High contrast</option>
          <option value="vs">Light</option>
        </select>
      </label>

      <label className="ide-settings-row toggle" onClick={() => update({ minimap: !settings.minimap })}>
        <span>Minimap</span>
        <span className={`ide-settings-switch ${settings.minimap ? 'on' : ''}`} />
      </label>

      <button className="ide-settings-reset" onClick={reset}>
        <RotateCcw size={11} /> Reset to defaults
      </button>
    </div>
  );
}

export default function EditorPane({ onAIAction, onToast }) {
  const {
    openFiles, activeFileId, setActiveFileId, closeFile,
    unsavedFiles, markUnsaved, markSaved, updateOpenFileContent,
    pendingDiff, setPendingDiff, setSelectedCode, editorRef,
    currentProject, markFileModified,
    setBottomTab, setIsBottomOpen,
  } = useProjects();

  const [contextMenu, setContextMenu] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [splitFileId, setSplitFileId] = useState(null); // second pane file
  const [mdPreview, setMdPreview] = useState(true); // .md files open in preview by default
  const autoSaveTimers = useRef({});
  const monacoRef = useRef(null);

  const isMarkdown = (f) => !!f && /\.(md|markdown)$/i.test(f.filename);

  const { settings, update: updateSettings, reset: resetSettings } = useEditorSettings();
  const editorOptions = applySettings(MONACO_OPTIONS, settings);

  const activeFile = openFiles.find(f => f.id === activeFileId);
  const splitFile = splitFileId ? openFiles.find(f => f.id === splitFileId) : null;

  // If the split file was closed, clear split.
  useEffect(() => {
    if (splitFileId && !openFiles.some(f => f.id === splitFileId)) setSplitFileId(null);
  }, [openFiles, splitFileId]);

  // Pick a sensible second file when entering split view.
  const toggleSplit = useCallback(() => {
    if (splitFileId) { setSplitFileId(null); return; }
    const other = openFiles.find(f => f.id !== activeFileId);
    if (!other) { onToast?.('Open a second file to split', 'info'); return; }
    setSplitFileId(other.id);
  }, [splitFileId, openFiles, activeFileId, onToast]);

  // ── Monaco setup ────────────────────────────────────────────────────────
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Cmd+S / Ctrl+S shortcut
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => handleManualSave()
    );

    // Track selection for AI
    editor.onDidChangeCursorSelection(() => {
      const sel = editor.getSelection();
      const model = editor.getModel();
      if (sel && model) {
        const text = model.getValueInRange(sel);
        setSelectedCode(text || '');
      }
    });

    // Right-click context menu
    editor.onContextMenu((e) => {
      e.event.preventDefault();
      const sel = editor.getSelection();
      const model = editor.getModel();
      const hasSelection = sel && model && model.getValueInRange(sel).trim().length > 0;
      setContextMenu({ x: e.event.posx, y: e.event.posy, hasSelection });
    });
  };

  // ── Content change → auto-save ──────────────────────────────────────────
  const handleChange = useCallback((value, fileId) => {
    if (value === undefined) return;
    updateOpenFileContent(fileId, value);
    markUnsaved(fileId);
    markFileModified(activeFile?.path, value);

    // Debounce auto-save (2s)
    clearTimeout(autoSaveTimers.current[fileId]);
    autoSaveTimers.current[fileId] = setTimeout(async () => {
      await doSave(fileId, value);
    }, 2000);
  }, [updateOpenFileContent, markUnsaved, markFileModified, activeFile]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const doSave = async (fileId, content) => {
    const file = openFiles.find(f => f.id === fileId);
    if (!file || !currentProject) return;
    try {
      await saveFile(currentProject.id, file.path, content, { language: file.language });
      markSaved(fileId, content);
    } catch (err) {
      onToast?.('Auto-save failed', 'error');
    }
  };

  const handleManualSave = useCallback(async () => {
    if (!activeFile || saving) return;
    setSaving(true);
    clearTimeout(autoSaveTimers.current[activeFile.id]);
    try {
      await doSave(activeFile.id, activeFile.content);
      onToast?.('Saved', 'success');
    } finally {
      setSaving(false);
    }
  }, [activeFile, saving]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => Object.values(autoSaveTimers.current).forEach(clearTimeout);
  }, []);

  // ── Diff: accept / reject ─────────────────────────────────────────────
  const handleAcceptDiff = async () => {
    if (!pendingDiff) return;
    for (const change of pendingDiff.files) {
      await saveFile(currentProject.id, change.path, change.newContent);
      const openFile = openFiles.find(f => f.path === change.path);
      if (openFile) markSaved(openFile.id, change.newContent);
    }
    setPendingDiff(null);
    onToast?.('Changes applied ✓', 'success');
  };

  const handleRejectDiff = () => {
    setPendingDiff(null);
    onToast?.('Changes rejected', 'info');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (openFiles.length === 0) {
    return (
      <div className="ide-editor-pane">
        <div className="ide-tabs-bar" />
        <div className="ide-no-file">
          <div className="ide-no-file-icon">
            <Code2 size={48} style={{ opacity: 0.15 }} />
          </div>
          <div style={{ color: 'var(--ide-text-muted)', fontSize: 13 }}>
            Open a file from the Explorer to start editing
          </div>
          <div style={{ fontSize: 11, color: 'var(--ide-text-muted)', marginTop: 4 }}>
            Tip: Click any file in the sidebar →
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ide-editor-pane">
      {/* Tab Bar */}
      <div className="ide-tabs-bar">
        {openFiles.map(file => {
          const isActive = file.id === activeFileId;
          const isUnsaved = unsavedFiles.has(file.id);
          return (
            <div
              key={file.id}
              className={`ide-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveFileId(file.id)}
              title={file.path}
            >
              <span style={{ fontSize: 11 }}>{getFileIcon(file.filename)}</span>
              <span className="ide-tab-name">{file.filename}</span>
              {isUnsaved && <span className="ide-tab-unsaved" title="Unsaved changes" />}
              <button
                className="ide-tab-close"
                onClick={(e) => { e.stopPropagation(); closeFile(file.id); }}
                title="Close"
              >
                <X size={11} />
              </button>
            </div>
          );
        })}

        {/* Run active file (JDoodle) */}
        {activeFile && languageForFilename(activeFile.filename) && (
          <button
            className="ide-tabbar-run"
            title={`Run ${activeFile.filename}`}
            onClick={() => {
              setBottomTab('run');
              setIsBottomOpen(true);
              // Let the Run tab mount, then trigger via the bridge.
              setTimeout(() => window.__ideRunTrigger?.(), 60);
            }}
          >
            <Play size={12} /> Run
          </button>
        )}

        {/* Split view + settings */}
        <div className="ide-tabbar-tools" style={{ marginLeft: activeFile && languageForFilename(activeFile.filename) ? 0 : 'auto' }}>
          {isMarkdown(activeFile) && (
            <button
              className={`ide-tabbar-tool ${mdPreview ? 'active' : ''}`}
              title={mdPreview ? 'Show source' : 'Show preview'}
              onClick={() => setMdPreview(p => !p)}
            >
              {mdPreview ? <FileCode size={13} /> : <Eye size={13} />}
            </button>
          )}
          <button
            className={`ide-tabbar-tool ${splitFile ? 'active' : ''}`}
            title={splitFile ? 'Close split view' : 'Split editor'}
            onClick={toggleSplit}
          >
            <Columns2 size={13} />
          </button>
          <div style={{ position: 'relative' }}>
            <button
              className={`ide-tabbar-tool ${showSettings ? 'active' : ''}`}
              title="Editor settings"
              onClick={() => setShowSettings(s => !s)}
            >
              <Settings2 size={13} />
            </button>
            {showSettings && (
              <EditorSettingsPopover
                settings={settings}
                update={updateSettings}
                reset={resetSettings}
                onClose={() => setShowSettings(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Editor / Diff area */}
      <div className="ide-editor-wrapper" style={{ position: 'relative' }}>
        {/* Show diff overlay if there are pending AI changes for active file */}
        {pendingDiff && pendingDiff.files.some(f => f.path === activeFile?.path) ? (
          <div className="ide-diff-panel">
            <div className="ide-diff-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <GitCompare size={14} color="var(--ide-accent)" />
                <span className="ide-diff-title">AI Proposed Changes — {activeFile?.filename}</span>
                <span style={{ fontSize: 11, color: 'var(--ide-text-muted)' }}>
                  {pendingDiff.files.length} file{pendingDiff.files.length > 1 ? 's' : ''} modified
                </span>
              </div>
              <div className="ide-diff-actions">
                <button className="ide-diff-btn reject" onClick={handleRejectDiff}>✕ Reject All</button>
                <button className="ide-diff-btn accept" onClick={handleAcceptDiff}>✓ Accept All</button>
              </div>
            </div>
            {pendingDiff.files.map(change => (
              <div key={change.path} style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ padding: '4px 12px', fontSize: 11, color: 'var(--ide-text-muted)', borderBottom: '1px solid var(--ide-border)', background: 'var(--ide-surface)' }}>
                  {change.path}
                </div>
                <DiffEditor
                  original={change.originalContent}
                  modified={change.newContent}
                  language={change.language || 'plaintext'}
                  theme="vs-dark"
                  options={{
                    ...editorOptions,
                    readOnly: true,
                    renderSideBySide: true,
                    minimap: { enabled: false },
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          activeFile && (
            activeFile.filename.endsWith('.ipynb') ? (
              <NotebookViewer content={activeFile.content || ''} />
            ) : (isMarkdown(activeFile) && mdPreview && !splitFile) ? (
              <div className="ide-md-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeFile.content || '*This markdown file is empty.*'}
                </ReactMarkdown>
              </div>
            ) : splitFile ? (
              <div className="ide-split-wrap">
                <div className="ide-split-pane">
                  <div className="ide-split-label">{activeFile.filename}</div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <Editor
                      key={`split-a-${activeFile.id}`}
                      language={activeFile.language || 'plaintext'}
                      value={activeFile.content || ''}
                      theme={settings.theme}
                      options={editorOptions}
                      onMount={handleEditorDidMount}
                      onChange={(v) => handleChange(v, activeFile.id)}
                    />
                  </div>
                </div>
                <div className="ide-split-pane">
                  <div className="ide-split-label">
                    <select
                      className="ide-split-select"
                      value={splitFile.id}
                      onChange={(e) => setSplitFileId(e.target.value)}
                    >
                      {openFiles.filter(f => f.id !== activeFileId).map(f => (
                        <option key={f.id} value={f.id}>{f.filename}</option>
                      ))}
                    </select>
                    <button className="ide-split-close" onClick={() => setSplitFileId(null)} title="Close split">
                      <X size={11} />
                    </button>
                  </div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <Editor
                      key={`split-b-${splitFile.id}`}
                      language={splitFile.language || 'plaintext'}
                      value={splitFile.content || ''}
                      theme={settings.theme}
                      options={editorOptions}
                      onChange={(v) => handleChange(v, splitFile.id)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Editor
                key={activeFile.id}
                language={activeFile.language || 'plaintext'}
                value={activeFile.content || ''}
                theme={settings.theme}
                options={editorOptions}
                onMount={handleEditorDidMount}
                onChange={(v) => handleChange(v, activeFile.id)}
              />
            )
          )
        )}

        {/* Saving indicator */}
        {saving && (
          <div style={{
            position: 'absolute', bottom: 8, right: 12, fontSize: 10,
            color: 'var(--ide-accent)', display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: 4,
          }}>
            <Save size={10} /> Saving…
          </div>
        )}

        {/* Editor right-click context menu */}
        {contextMenu && (
          <EditorContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            hasSelection={contextMenu.hasSelection}
            onClose={() => setContextMenu(null)}
            onAIAction={(action) => {
              const editor = editorRef.current;
              const sel = editor?.getSelection();
              const model = editor?.getModel();
              const code = sel && model ? model.getValueInRange(sel) : '';
              onAIAction?.(action, code, activeFile);
            }}
          />
        )}
      </div>
    </div>
  );
}
