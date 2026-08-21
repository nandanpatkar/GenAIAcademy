/**
 * ProjectsDashboard.jsx — Projects listing page
 *
 * Shows all user projects with search, sort, and CRUD actions.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NinjaEye } from '../NinjaEye';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Plus, Search, FolderCode, GitBranch, FileText, MoreVertical,
  Trash2, Copy, Edit2, Clock, Calendar, SortAsc, ChevronRight,
  Terminal, Upload, ArrowLeft, Sparkles, Code2, GitMerge, Bot, Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectsContext';
import {
  listProjects, createProject, deleteProject,
  updateProject, duplicateProject
} from '../../services/projectService';
import '../../styles/ProjectIDE.css';

const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Recently Updated' },
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'file_count', label: 'File Count' },
];

const LANG_OPTIONS = [
  'python', 'javascript', 'typescript', 'go', 'rust', 'java', 'cpp', 'ruby', 'other'
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function ContextMenu({ x, y, project, onClose, onRename, onDuplicate, onDelete }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="projects-context-menu"
      style={{ left: Math.min(x, window.innerWidth - 180), top: Math.min(y, window.innerHeight - 160) }}
    >
      <div className="projects-context-menu-item" onClick={() => { onRename(project); onClose(); }}>
        <Edit2 size={12} /> Rename
      </div>
      <div className="projects-context-menu-item" onClick={() => { onDuplicate(project); onClose(); }}>
        <Copy size={12} /> Duplicate
      </div>
      <div className="projects-context-menu-divider" />
      <div className="projects-context-menu-item danger" onClick={() => { onDelete(project); onClose(); }}>
        <Trash2 size={12} /> Delete Project
      </div>
    </div>
  );
}

function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate({ name, description, defaultLanguage: language });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ide-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ide-modal">
        <div className="ide-modal-header">
          <div className="ide-modal-title">Create New Project</div>
          <button className="ide-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ide-modal-body">
          <div className="ide-field">
            <label className="ide-field-label">Project Name *</label>
            <input
              id="new-project-name"
              className="ide-field-input"
              placeholder="my-awesome-project"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>
          <div className="ide-field">
            <label className="ide-field-label">Description</label>
            <textarea
              className="ide-field-textarea"
              placeholder="What does this project do?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="ide-field">
            <label className="ide-field-label">Default Language</label>
            <select className="ide-field-select" value={language} onChange={e => setLanguage(e.target.value)}>
              {LANG_OPTIONS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="ide-modal-footer">
          <button className="ide-modal-btn secondary" onClick={onClose}>Cancel</button>
          <button
            id="create-project-btn"
            className="ide-modal-btn primary"
            onClick={handleCreate}
            disabled={!name.trim() || loading}
          >
            {loading ? <><NinjaEye size={16} labelled={false} /> Creating…</> : <><Plus size={13} /> Create Project</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function RenameModal({ project, onClose, onRename }) {
  const [name, setName] = useState(project.name);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!name.trim() || name === project.name) return;
    setLoading(true);
    try { await onRename(project.id, name.trim()); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <div className="ide-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ide-modal">
        <div className="ide-modal-header">
          <div className="ide-modal-title">Rename Project</div>
          <button className="ide-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ide-modal-body">
          <div className="ide-field">
            <label className="ide-field-label">New Name</label>
            <input
              className="ide-field-input"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRename()}
              autoFocus
            />
          </div>
        </div>
        <div className="ide-modal-footer">
          <button className="ide-modal-btn secondary" onClick={onClose}>Cancel</button>
          <button className="ide-modal-btn primary" onClick={handleRename} disabled={!name.trim() || loading}>
            {loading ? 'Renaming…' : 'Rename'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectHomeVisual({ projectCount, fileCount }) {
  const shouldReduceMotion = useReducedMotion();
  const stages = [
    { label: 'Plan', icon: <Sparkles size={13} /> },
    { label: 'Build', icon: <Code2 size={13} /> },
    { label: 'Ship', icon: <GitMerge size={13} /> },
  ];

  return (
    <div className="project-home-visual" role="img" aria-label="Animated project workspace showing plan, build, and ship stages">
      <div className="project-home-visual-grid" />
      <motion.div
        className="project-home-orbit project-home-orbit-one"
        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="project-home-orbit project-home-orbit-two"
        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: -360 }}
        transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="project-home-core"
        animate={shouldReduceMotion
          ? { scale: 1 }
          : { scale: [1, 1.04, 1], boxShadow: ['0 0 0 0 rgba(var(--neon-rgb, 0, 255, 136), 0)', '0 0 34px 4px rgba(var(--neon-rgb, 0, 255, 136), .16)', '0 0 0 0 rgba(var(--neon-rgb, 0, 255, 136), 0)'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Bot size={22} />
        <span>workspace</span>
        <strong>ready</strong>
      </motion.div>

      <div className="project-home-stage-list">
        {stages.map((stage, index) => (
          <motion.div
            className="project-home-stage"
            key={stage.label}
            animate={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: [0, -5, 0], opacity: [0.72, 1, 0.72] }}
            transition={{ duration: 3.4, delay: index * 0.55, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="project-home-stage-icon">{stage.icon}</span>
            <span>{stage.label}</span>
            <i />
          </motion.div>
        ))}
      </div>

      <div className="project-home-visual-footer">
        <span><Activity size={12} /> live workspace</span>
        <span>{projectCount} projects · {fileCount} files</span>
      </div>
    </div>
  );
}

export default function ProjectsDashboard({ onClose }) {
  const { user } = useAuth();
  const { openProject, setProjectsList } = useProjects();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [contextMenu, setContextMenu] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [renameProject, setRenameProject] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await listProjects(user.id);
      setProjects(data);
      setProjectsList(data);
    } catch (err) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, setProjectsList, showToast]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  // Close context menu on any click
  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => setContextMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [contextMenu]);

  const handleCreate = async (data) => {
    try {
      await createProject(user.id, data);
      await loadProjects();
      showToast('Project created!', 'success');
    } catch (err) {
      showToast('Failed to create project', 'error');
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
      showToast('Project deleted', 'info');
    } catch (err) {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleDuplicate = async (project) => {
    try {
      await duplicateProject(user.id, project.id);
      await loadProjects();
      showToast(`Duplicated "${project.name}"`, 'success');
    } catch (err) {
      showToast('Failed to duplicate', 'error');
    }
  };

  const handleRename = async (projectId, name) => {
    try {
      await updateProject(projectId, { name });
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name } : p));
      showToast('Project renamed', 'success');
    } catch (err) {
      showToast('Failed to rename', 'error');
    }
  };

  // Filter + sort
  const filtered = projects
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) ||
                 p.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'file_count') return (b.file_count || 0) - (a.file_count || 0);
      return new Date(b[sortBy]) - new Date(a[sortBy]);
    });

  const totalFiles = projects.reduce((sum, project) => sum + (project.file_count || 0), 0);

  return (
    <div className="projects-root" id="projects-dashboard-root">
      <div className="projects-dashboard">
        {/* Header */}
        <div className="projects-dashboard-header">
          <div>
            <div className="projects-dashboard-title">⚡ Projects</div>
            <div className="projects-dashboard-subtitle">
              Cloud IDE — create, code, and ship from your browser
            </div>
          </div>

          <div className="projects-toolbar">
            {/* Search */}
            <div className="projects-search-bar">
              <Search size={13} style={{ color: 'var(--ide-text-muted)', flexShrink: 0 }} />
              <input
                id="projects-search-input"
                placeholder="Search projects…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <select
              className="projects-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* New Project */}
            <button
              id="new-project-btn"
              className="projects-btn-new"
              onClick={() => setShowNewModal(true)}
            >
              <Plus size={14} /> New Project
            </button>
          </div>
        </div>

        <div className="project-home-hero">
          <div className="project-home-hero-copy">
            <div className="project-home-eyebrow"><span /> PROJECT HOME <span className="project-home-eyebrow-line" /></div>
            <h1>Turn a blank canvas into <em>something real.</em></h1>
            <p>Your ideas, code, and shipping workflow in one focused workspace.</p>
            <div className="project-home-signals">
              <span><strong>{projects.length}</strong> projects</span>
              <span><strong>{totalFiles}</strong> files in orbit</span>
              <span><span className="project-home-live-dot" /> cloud synced</span>
            </div>
          </div>
          <ProjectHomeVisual projectCount={projects.length} fileCount={totalFiles} />
        </div>

        {/* Content */}
        {loading ? (
          <div className="projects-empty">
            <NinjaEye size={40} labelled={false} />
            <div style={{ color: 'var(--ide-text-muted)', fontSize: 14 }}>Loading projects…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="projects-empty">
            <div className="projects-empty-icon">
              <FolderCode size={32} />
            </div>
            <div className="projects-empty-title">
              {search ? 'No projects found' : 'No projects yet'}
            </div>
            <div className="projects-empty-text">
              {search
                ? `No projects match "${search}". Try a different search.`
                : 'Create your first project and start building with AI-powered code editing.'}
            </div>
            {!search && (
              <button className="projects-btn-new" onClick={() => setShowNewModal(true)}>
                <Plus size={14} /> Create First Project
              </button>
            )}
          </div>
        ) : (
          <motion.div
            className="projects-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  onClick={() => openProject(project)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, project });
                  }}
                >
                  <div className="project-card-header">
                    <div className="project-card-name">{project.name}</div>
                    <button
                      className="project-card-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenu({ x: e.clientX, y: e.clientY, project });
                      }}
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  <div className="project-card-desc">
                    {project.description || 'No description provided.'}
                  </div>

                  <div className="project-card-meta">
                    <span className={`project-card-badge ${project.github_repo ? 'github' : 'no-github'}`}>
                      <GitBranch size={9} />
                      {project.github_repo ? 'GitHub' : 'No GitHub'}
                    </span>

                    <span className="project-card-badge files">
                      <FileText size={9} />
                      {project.file_count || 0} files
                    </span>

                    <span className="project-card-badge" style={{ color: 'var(--ide-text-muted)', borderColor: 'var(--ide-border)' }}>
                      <Terminal size={9} />
                      {project.default_language}
                    </span>

                    <span className="project-card-date">
                      <Clock size={9} style={{ marginRight: 3 }} />
                      {timeAgo(project.updated_at)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            {...contextMenu}
            onClose={() => setContextMenu(null)}
            onRename={(p) => setRenameProject(p)}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showNewModal && (
          <NewProjectModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />
        )}
        {renameProject && (
          <RenameModal
            project={renameProject}
            onClose={() => setRenameProject(null)}
            onRename={handleRename}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`ide-toast ${toast.type}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
