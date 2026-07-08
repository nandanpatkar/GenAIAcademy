/**
 * ProjectIDE.jsx — Main IDE orchestrator
 *
 * Assembles: toolbar, file explorer, editor pane, AI assistant, bottom panel.
 * Manages resizable panel widths, and renders dashboard vs. IDE view.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, GitBranch, Settings, History, Upload,
  Sparkles, LayoutPanelLeft, PanelRightClose, X
} from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import { useAuth } from '../../contexts/AuthContext';
import ProjectsDashboard from './ProjectsDashboard';
import FileExplorer from './FileExplorer';
import EditorPane from './EditorPane';
import AIAssistant from './AIAssistant';
import BottomPanel from './BottomPanel';
import ProjectSettings from './ProjectSettings';
import ImportGitHubModal from './ImportGitHubModal';
import VersionHistory from './VersionHistory';
import { getFile } from '../../services/projectService';
import '../../styles/ProjectIDE.css';

// ─── Resizable panel hook ─────────────────────────────────────────────────────
// `invert` is true for panels docked on the right (like the AI panel), where the
// resize handle is on the panel's LEFT edge: dragging left must grow the panel.
function usePanelResize(initial, min, max, invert = false) {
  const [size, setSize] = useState(initial);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startSize = useRef(initial);

  const onMouseDown = useCallback((e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startSize.current = size;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (e) => {
      if (!dragging.current) return;
      const delta = (e.clientX - startX.current) * (invert ? -1 : 1);
      setSize(Math.max(min, Math.min(max, startSize.current + delta)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [size, min, max, invert]);

  return [size, onMouseDown];
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`ide-toast ${toast.type}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
        >
          {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}{' '}
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main IDE View ────────────────────────────────────────────────────────────
function IDEView({ onToast }) {
  const {
    currentProject, closeDashboard, gitStatus, openFile, activeFile,
    setBottomTab, setIsBottomOpen, flatFiles,
  } = useProjects();

  const [showSettings, setShowSettings] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [showExplorer, setShowExplorer] = useState(true);

  // Resizable panel widths
  const [explorerW, explorerDrag] = usePanelResize(240, 160, 400);
  const [aiW, aiDrag] = usePanelResize(300, 200, 480, true);

  const gitBadge = gitStatus.staged.length + gitStatus.unstaged.length;

  // Open a file from explorer or search
  const handleFileOpen = useCallback(async (fileEntry) => {
    // fileEntry might be a flat file object or a search result
    const file = fileEntry;
    if (!file.content && file.id) {
      try {
        const full = await getFile(file.id);
        openFile({
          id: full.id,
          path: full.file_path,
          filename: full.filename,
          content: full.content,
          language: full.language,
        });
      } catch {
        openFile({
          id: file.id,
          path: file.file_path || file.path,
          filename: file.filename,
          content: '',
          language: file.language || 'plaintext',
        });
      }
    } else {
      openFile({
        id: file.id,
        path: file.file_path || file.path,
        filename: file.filename,
        content: file.content || '',
        language: file.language || 'plaintext',
      });
    }
  }, [openFile]);

  // AI action from editor right-click
  const handleAIAction = useCallback((action, code, file) => {
    setShowAI(true);
    // Trigger via global bridge set in AIAssistant
    setTimeout(() => {
      window.__ideAITrigger?.(action, code, file);
    }, 50);
  }, []);

  return (
    <div className="ide-layout">
      {/* Toolbar */}
      <div className="ide-toolbar">
        <button className="ide-toolbar-back" onClick={closeDashboard} title="Back to Projects">
          <ArrowLeft size={13} />
          Projects
        </button>
        <div className="ide-toolbar-divider" />
        <div className="ide-toolbar-project">{currentProject?.name}</div>

        {currentProject?.github_repo && (
          <div className="ide-toolbar-branch">
            <GitBranch size={10} />
            {gitStatus.branch}
          </div>
        )}

        <div className="ide-toolbar-spacer" />

        {/* Toggle panels */}
        <button
          className={`ide-toolbar-btn ${showExplorer ? 'primary' : ''}`}
          onClick={() => setShowExplorer(p => !p)}
          title="Toggle Explorer"
        >
          <LayoutPanelLeft size={12} />
        </button>

        <button
          className={`ide-toolbar-btn ${showAI ? 'primary' : ''}`}
          onClick={() => setShowAI(p => !p)}
          title="Toggle AI Assistant"
        >
          <Sparkles size={12} />
        </button>

        <div className="ide-toolbar-divider" />

        {/* Version history */}
        {activeFile && (
          <button className="ide-toolbar-btn" onClick={() => setShowHistory(true)} title="Version History">
            <History size={12} /> History
          </button>
        )}

        {/* Git badge */}
        <button
          className="ide-toolbar-btn"
          onClick={() => { setBottomTab('git'); setIsBottomOpen(true); }}
          title="Source Control"
        >
          <GitBranch size={12} />
          {gitBadge > 0 && (
            <span style={{ background: 'var(--ide-accent)', color: '#000', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 20 }}>
              {gitBadge}
            </span>
          )}
        </button>

        {/* Import */}
        <button className="ide-toolbar-btn" onClick={() => setShowImport(true)} title="Import from GitHub">
          <Upload size={12} /> Import
        </button>

        {/* Settings */}
        <button className="ide-toolbar-btn" onClick={() => setShowSettings(true)} title="Project Settings">
          <Settings size={12} />
        </button>
      </div>

      {/* Main body */}
      <div className="ide-body">
        {/* File Explorer */}
        {showExplorer ? (
          <>
            <div style={{ width: explorerW, flexShrink: 0 }}>
              <FileExplorer
                onFileOpen={handleFileOpen}
                onToast={onToast}
                onCollapse={() => setShowExplorer(false)}
              />
            </div>
            <div
              className="ide-resize-handle"
              onMouseDown={explorerDrag}
              title="Drag to resize"
            />
          </>
        ) : (
          <button
            className="ide-explorer-rail"
            onClick={() => setShowExplorer(true)}
            title="Expand sidebar"
          >
            <PanelRightClose size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}

        {/* Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <EditorPane onAIAction={handleAIAction} onToast={onToast} />
          <BottomPanel onToast={onToast} onFileOpen={handleFileOpen} />
        </div>

        {/* AI Panel */}
        {showAI ? (
          <>
            <div
              className="ide-resize-handle"
              onMouseDown={aiDrag}
              title="Drag to resize"
            />
            <div style={{ width: aiW, flexShrink: 0, minWidth: 0, height: '100%', display: 'flex' }}>
              <AIAssistant onToast={onToast} onCollapse={() => setShowAI(false)} />
            </div>
          </>
        ) : (
          <button
            className="ide-explorer-rail ide-ai-rail"
            onClick={() => setShowAI(true)}
            title="Show AI Assistant"
          >
            <Sparkles size={14} />
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="ide-status-bar">
        <span className="ide-status-item accent">
          <GitBranch size={9} /> {gitStatus.branch}
        </span>
        {activeFile && (
          <>
            <span className="ide-status-item">
              {activeFile.filename}
            </span>
            <span className="ide-status-item">
              {activeFile.language}
            </span>
          </>
        )}
        <span className="ide-status-item" style={{ marginLeft: 'auto' }}>
          {flatFiles.length} files
        </span>
        {gitBadge > 0 && (
          <span className="ide-status-item" style={{ color: 'var(--ide-warning)' }}>
            {gitBadge} change{gitBadge !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <ProjectSettings onClose={() => setShowSettings(false)} onToast={onToast} />
        )}
        {showImport && (
          <ImportGitHubModal onClose={() => setShowImport(false)} onToast={onToast} />
        )}
        {showHistory && activeFile && (
          <VersionHistory onClose={() => setShowHistory(false)} onToast={onToast} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root (Dashboard or IDE) ──────────────────────────────────────────────────
export default function ProjectIDE() {
  const { currentProject } = useProjects();
  const [toast, setToast] = useState(null);
  const toastTimeout = useRef(null);

  const showToast = useCallback((msg, type = 'info') => {
    clearTimeout(toastTimeout.current);
    setToast({ msg, type });
    toastTimeout.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimeout.current), []);

  return (
    <div className="projects-root" style={{ height: '100%', overflow: 'hidden' }}>
      {currentProject ? (
        <IDEView onToast={showToast} />
      ) : (
        <ProjectsDashboard />
      )}
      <Toast toast={toast} />
    </div>
  );
}
