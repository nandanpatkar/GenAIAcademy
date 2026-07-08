/**
 * ProjectsContext.jsx — IDE State Management
 *
 * Provides IDE state (open tabs, active file, file tree, git status)
 * and project-level actions to all Projects components.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ProjectsContext = createContext(null);

export const ProjectsProvider = ({ children }) => {
  // ── Project Navigation ──────────────────────────────────────────────────
  const [currentProject, setCurrentProject] = useState(null); // null = show dashboard
  const [projectsList, setProjectsList] = useState([]);

  // ── Editor Tabs ─────────────────────────────────────────────────────────
  const [openFiles, setOpenFiles] = useState([]); // [{ id, path, filename, content, language }]
  const [activeFileId, setActiveFileId] = useState(null);

  // ── File Tree ───────────────────────────────────────────────────────────
  const [fileTree, setFileTree] = useState(null);
  const [flatFiles, setFlatFiles] = useState([]);

  // ── Unsaved Changes ──────────────────────────────────────────────────────
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());

  // ── Git Status ───────────────────────────────────────────────────────────
  const [gitStatus, setGitStatus] = useState({
    staged: [],    // [{ path, content }]
    unstaged: [],  // [{ path, content }]
    branch: 'main',
  });

  // ── Bottom Panel ─────────────────────────────────────────────────────────
  const [bottomTab, setBottomTab] = useState('terminal'); // 'terminal' | 'git' | 'search' | 'problems'
  const [isBottomOpen, setIsBottomOpen] = useState(true);

  // ── GitHub PAT ───────────────────────────────────────────────────────────
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('ide_github_token') || '');

  const saveGithubToken = useCallback((token) => {
    setGithubToken(token);
    if (token) localStorage.setItem('ide_github_token', token);
    else localStorage.removeItem('ide_github_token');
  }, []);

  // ── AI Assistant ─────────────────────────────────────────────────────────
  const [aiMessages, setAiMessages] = useState([]);
  const [aiMode, setAiMode] = useState('chat'); // 'generate' | 'edit' | 'explain' | 'chat'
  const [selectedCode, setSelectedCode] = useState('');
  const [pendingDiff, setPendingDiff] = useState(null); // { files: [{ path, originalContent, newContent }] }

  // ── Recent Files ─────────────────────────────────────────────────────────
  const [recentFiles, setRecentFiles] = useState([]);

  // ── Search ───────────────────────────────────────────────────────────────
  const [searchResults, setSearchResults] = useState([]);

  // ── Selection from Editor (for AI context) ───────────────────────────────
  const editorRef = useRef(null);

  // ─── Actions ─────────────────────────────────────────────────────────────

  /**
   * Open a file in a new tab (or focus if already open).
   */
  const openFile = useCallback((file) => {
    setOpenFiles(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) return prev;
      return [...prev, { ...file }];
    });
    setActiveFileId(file.id);

    // Track recently opened
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.id !== file.id);
      return [{ id: file.id, path: file.path, filename: file.filename }, ...filtered].slice(0, 10);
    });
  }, []);

  /**
   * Close a file tab.
   */
  const closeFile = useCallback((fileId) => {
    setOpenFiles(prev => {
      const idx = prev.findIndex(f => f.id === fileId);
      const next = prev.filter(f => f.id !== fileId);

      // Switch active tab to adjacent file
      if (fileId === activeFileId && next.length > 0) {
        const newActive = next[Math.max(0, idx - 1)];
        setActiveFileId(newActive.id);
      } else if (next.length === 0) {
        setActiveFileId(null);
      }

      return next;
    });
    setUnsavedFiles(prev => { const s = new Set(prev); s.delete(fileId); return s; });
  }, [activeFileId]);

  /**
   * Update in-memory content of an open file (for real-time editor changes).
   */
  const updateOpenFileContent = useCallback((fileId, content) => {
    setOpenFiles(prev => prev.map(f => f.id === fileId ? { ...f, content } : f));
  }, []);

  /**
   * Mark a file as having unsaved changes.
   */
  const markUnsaved = useCallback((fileId) => {
    setUnsavedFiles(prev => new Set([...prev, fileId]));
  }, []);

  /**
   * Mark a file as saved (clear unsaved indicator).
   */
  const markSaved = useCallback((fileId, newContent) => {
    setUnsavedFiles(prev => { const s = new Set(prev); s.delete(fileId); return s; });
    if (newContent !== undefined) {
      setOpenFiles(prev => prev.map(f => f.id === fileId ? { ...f, content: newContent } : f));
    }
  }, []);

  /**
   * Close all tabs for the current project (when switching projects).
   */
  const closeAllTabs = useCallback(() => {
    setOpenFiles([]);
    setActiveFileId(null);
    setUnsavedFiles(new Set());
    setAiMessages([]);
    setPendingDiff(null);
  }, []);

  /**
   * Open a project (navigate into IDE view).
   */
  const openProject = useCallback((project) => {
    closeAllTabs();
    setCurrentProject(project);
    setGitStatus(prev => ({ ...prev, branch: project.github_branch || 'main' }));
  }, [closeAllTabs]);

  /**
   * Return to dashboard.
   */
  const closeDashboard = useCallback(() => {
    closeAllTabs();
    setCurrentProject(null);
    setFileTree(null);
    setFlatFiles([]);
  }, [closeAllTabs]);

  /**
   * Stage a file for commit.
   */
  const stageFile = useCallback((filePath, content) => {
    setGitStatus(prev => ({
      ...prev,
      staged: [...prev.staged.filter(f => f.path !== filePath), { path: filePath, content }],
      unstaged: prev.unstaged.filter(f => f.path !== filePath),
    }));
  }, []);

  /**
   * Unstage a file.
   */
  const unstageFile = useCallback((filePath) => {
    setGitStatus(prev => {
      const file = prev.staged.find(f => f.path === filePath);
      return {
        ...prev,
        staged: prev.staged.filter(f => f.path !== filePath),
        unstaged: file ? [...prev.unstaged, file] : prev.unstaged,
      };
    });
  }, []);

  /**
   * Mark a file as modified (adds to unstaged).
   */
  const markFileModified = useCallback((filePath, content) => {
    setGitStatus(prev => {
      const alreadyStaged = prev.staged.find(f => f.path === filePath);
      if (alreadyStaged) return prev;
      return {
        ...prev,
        unstaged: [...prev.unstaged.filter(f => f.path !== filePath), { path: filePath, content }],
      };
    });
  }, []);

  /**
   * Clear git status after successful push.
   */
  const clearGitStatus = useCallback(() => {
    setGitStatus(prev => ({ ...prev, staged: [], unstaged: [] }));
  }, []);

  // Active file object
  const activeFile = openFiles.find(f => f.id === activeFileId) || null;

  const value = {
    // State
    currentProject, setCurrentProject,
    projectsList, setProjectsList,
    openFiles, activeFileId, activeFile,
    fileTree, setFileTree,
    flatFiles, setFlatFiles,
    unsavedFiles,
    gitStatus, setGitStatus,
    bottomTab, setBottomTab,
    isBottomOpen, setIsBottomOpen,
    githubToken, saveGithubToken,
    aiMessages, setAiMessages,
    aiMode, setAiMode,
    selectedCode, setSelectedCode,
    pendingDiff, setPendingDiff,
    recentFiles,
    searchResults, setSearchResults,
    editorRef,

    // Actions
    openFile,
    closeFile,
    updateOpenFileContent,
    markUnsaved,
    markSaved,
    closeAllTabs,
    openProject,
    closeDashboard,
    stageFile,
    unstageFile,
    markFileModified,
    clearGitStatus,
    setActiveFileId,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used inside <ProjectsProvider>');
  return ctx;
};
