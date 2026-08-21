/**
 * FileExplorer.jsx — VS Code–style file tree for the IDE
 *
 * Supports nested folders, right-click context menu, drag-and-drop,
 * inline rename, and file upload (including ZIP extraction).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NinjaEye } from '../NinjaEye';
import {
  ChevronRight, File, Folder, FolderOpen, Plus, FolderPlus,
  Trash2, Edit2, Copy, Upload, MoreHorizontal, RefreshCw, PanelLeftClose
} from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import {
  listFiles, saveFile, createFolder, deleteFile,
  renameFile, buildFileTree, detectLanguage
} from '../../services/projectService';

// ─── File icon colors (by extension) ────────────────────────────────────────
const FILE_COLORS = {
  '.py': '#3572A5', '.js': '#f1e05a', '.jsx': '#61dafb',
  '.ts': '#3178c6', '.tsx': '#3178c6', '.md': '#00cc88',
  '.json': '#a0a0a0', '.yaml': '#cb171e', '.yml': '#cb171e',
  '.html': '#e34c26', '.css': '#563d7c', '.scss': '#cc6699',
  '.sh': '#89e051', '.go': '#00ADD8', '.rs': '#dea584',
  '.sql': '#e38c00', '.env': '#ffcc00', '.txt': '#888',
  '.toml': '#9c4221', '.xml': '#f60',
};

const getFileColor = (filename) => {
  const ext = filename.includes('.') ? '.' + filename.split('.').pop().toLowerCase() : '';
  return FILE_COLORS[ext] || '#888';
};

// ─── Context Menu ────────────────────────────────────────────────────────────
function FileContextMenu({ x, y, node, onClose, onNewFile, onNewFolder, onRename, onDelete, onCopyPath }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="projects-context-menu"
      style={{ left: Math.min(x, window.innerWidth - 190), top: Math.min(y, window.innerHeight - 220) }}
    >
      {node?.type === 'folder' && (
        <>
          <div className="projects-context-menu-item" onClick={() => { onNewFile(node.path); onClose(); }}>
            <Plus size={11} /> New File
          </div>
          <div className="projects-context-menu-item" onClick={() => { onNewFolder(node.path); onClose(); }}>
            <FolderPlus size={11} /> New Folder
          </div>
          <div className="projects-context-menu-divider" />
        </>
      )}
      <div className="projects-context-menu-item" onClick={() => { onRename(node); onClose(); }}>
        <Edit2 size={11} /> Rename
      </div>
      <div className="projects-context-menu-item" onClick={() => { onCopyPath(node.path); onClose(); }}>
        <Copy size={11} /> Copy Path
      </div>
      <div className="projects-context-menu-divider" />
      <div className="projects-context-menu-item danger" onClick={() => { onDelete(node); onClose(); }}>
        <Trash2 size={11} /> Delete
      </div>
    </div>
  );
}

// ─── Tree Node ───────────────────────────────────────────────────────────────
function TreeNode({ node, depth, activeFileId, onFileClick, onRightClick, onDragStart, onDragOver, onDrop, renaming, onRenameSubmit, onRenameCancel }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const inputRef = useRef(null);
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeFileId;
  const isRenaming = renaming?.id === node.id;

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleClick = () => {
    if (isFolder) setExpanded(e => !e);
    else onFileClick(node);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onRenameSubmit(node, e.target.value);
    if (e.key === 'Escape') onRenameCancel();
  };

  const indent = depth * 12;

  return (
    <>
      <div
        className={`ide-tree-item ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: 8 + indent }}
        onClick={handleClick}
        onContextMenu={(e) => { e.preventDefault(); onRightClick(e, node); }}
        draggable={!isFolder}
        onDragStart={(e) => onDragStart(e, node)}
        onDragOver={(e) => { e.preventDefault(); onDragOver(e, node); }}
        onDrop={(e) => onDrop(e, node)}
        title={node.path}
      >
        {/* Arrow for folders */}
        {isFolder ? (
          <span className={`ide-tree-arrow ${expanded ? 'open' : ''}`}>
            <ChevronRight size={11} />
          </span>
        ) : (
          <span style={{ width: 11, flexShrink: 0 }} />
        )}

        {/* Icon */}
        <span className="ide-tree-icon">
          {isFolder
            ? (expanded ? <FolderOpen size={13} color="#d4a55a" /> : <Folder size={13} color="#d4a55a" />)
            : <File size={13} color={getFileColor(node.name)} />
          }
        </span>

        {/* Name (or rename input) */}
        {isRenaming ? (
          <input
            ref={inputRef}
            className="ide-tree-name-input"
            defaultValue={node.name}
            onKeyDown={handleKeyDown}
            onBlur={(e) => onRenameSubmit(node, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="ide-tree-name">{node.name}</span>
        )}
      </div>

      {/* Children */}
      {isFolder && expanded && node.children?.map(child => (
        <TreeNode
          key={child.path}
          node={child}
          depth={depth + 1}
          activeFileId={activeFileId}
          onFileClick={onFileClick}
          onRightClick={onRightClick}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          renaming={renaming}
          onRenameSubmit={onRenameSubmit}
          onRenameCancel={onRenameCancel}
        />
      ))}
    </>
  );
}

// ─── Main Explorer ───────────────────────────────────────────────────────────
export default function FileExplorer({ onFileOpen, onToast, onCollapse }) {
  const { currentProject, activeFileId, fileTree, setFileTree, setFlatFiles, flatFiles } = useProjects();

  const [contextMenu, setContextMenu] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [creatingFile, setCreatingFile] = useState(null); // { type: 'file'|'folder', parentPath }
  const [dragging, setDragging] = useState(null);
  const [loading, setLoading] = useState(false);
  const newItemInputRef = useRef(null);
  const uploadInputRef = useRef(null);

  const loadFiles = useCallback(async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const files = await listFiles(currentProject.id);
      setFlatFiles(files);
      setFileTree(buildFileTree(files));
    } catch (err) {
      onToast?.('Failed to load files', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentProject, setFlatFiles, setFileTree, onToast]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  useEffect(() => {
    if (creatingFile && newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  }, [creatingFile]);

  // ── Context menu actions ──────────────────────────────────────────────────

  const handleNewFile = (parentPath = '/') => {
    setContextMenu(null);
    setCreatingFile({ type: 'file', parentPath });
  };

  const handleNewFolder = (parentPath = '/') => {
    setContextMenu(null);
    setCreatingFile({ type: 'folder', parentPath });
  };

  const handleCreateSubmit = async (name) => {
    if (!name.trim()) { setCreatingFile(null); return; }
    const path = `${creatingFile.parentPath}/${name}`.replace('//', '/');
    try {
      if (creatingFile.type === 'folder') {
        await createFolder(currentProject.id, path);
      } else {
        await saveFile(currentProject.id, path, '', { language: detectLanguage(name) });
      }
      await loadFiles();
      setCreatingFile(null);
    } catch (err) {
      onToast?.(err.message || 'Failed to create', 'error');
    }
  };

  const handleRename = (node) => setRenaming(node);

  const handleRenameSubmit = async (node, newName) => {
    setRenaming(null);
    if (!newName.trim() || newName === node.name) return;
    const parts = node.path.split('/');
    parts[parts.length - 1] = newName.trim();
    const newPath = parts.join('/');
    try {
      await renameFile(currentProject.id, node.path, newPath);
      await loadFiles();
    } catch (err) {
      onToast?.(err.message || 'Failed to rename', 'error');
    }
  };

  const handleDelete = async (node) => {
    if (!window.confirm(`Delete "${node.name}"?`)) return;
    try {
      await deleteFile(currentProject.id, node.path);
      await loadFiles();
    } catch (err) {
      onToast?.(err.message || 'Failed to delete', 'error');
    }
  };

  const handleCopyPath = (path) => {
    navigator.clipboard.writeText(path).then(() => onToast?.('Path copied', 'info'));
  };

  // ── Drag and Drop ────────────────────────────────────────────────────────
  const handleDragStart = (e, node) => {
    e.dataTransfer.setData('text/plain', node.path);
    setDragging(node);
  };

  const handleDrop = async (e, targetNode) => {
    e.preventDefault();
    const sourcePath = e.dataTransfer.getData('text/plain');
    if (!sourcePath || sourcePath === targetNode.path) { setDragging(null); return; }
    const targetFolder = targetNode.type === 'folder' ? targetNode.path : targetNode.path.split('/').slice(0, -1).join('/');
    const filename = sourcePath.split('/').pop();
    const newPath = `${targetFolder}/${filename}`.replace('//', '/');
    if (newPath === sourcePath) { setDragging(null); return; }
    try {
      await renameFile(currentProject.id, sourcePath, newPath);
      await loadFiles();
    } catch (err) {
      onToast?.(err.message || 'Failed to move', 'error');
    }
    setDragging(null);
  };

  // ── File Upload ───────────────────────────────────────────────────────────
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (file.name.endsWith('.zip')) {
        // Dynamic import JSZip
        try {
          const JSZip = (await import('jszip')).default;
          const zip = await JSZip.loadAsync(file);
          for (const [relPath, zipEntry] of Object.entries(zip.files)) {
            if (zipEntry.dir) continue;
            const content = await zipEntry.async('string').catch(() => null);
            if (content !== null) {
              await saveFile(currentProject.id, '/' + relPath, content);
            }
          }
          await loadFiles();
          onToast?.(`Extracted ${file.name}`, 'success');
        } catch (err) {
          onToast?.('Failed to extract ZIP', 'error');
        }
      } else {
        const content = await file.text().catch(() => '');
        await saveFile(currentProject.id, '/' + file.name, content);
      }
    }
    await loadFiles();
    e.target.value = '';
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const children = fileTree?.children || [];

  return (
    <div className="ide-explorer">
      {/* Header */}
      <div className="ide-explorer-header">
        <span className="ide-explorer-title">Explorer</span>
        <div className="ide-explorer-actions">
          <button
            className="ide-explorer-action-btn"
            title="New File"
            onClick={() => handleNewFile('/')}
          >
            <Plus size={13} />
          </button>
          <button
            className="ide-explorer-action-btn"
            title="New Folder"
            onClick={() => handleNewFolder('/')}
          >
            <FolderPlus size={13} />
          </button>
          <button
            className="ide-explorer-action-btn"
            title="Upload Files / ZIP"
            onClick={() => uploadInputRef.current?.click()}
          >
            <Upload size={13} />
          </button>
          <button
            className="ide-explorer-action-btn"
            title="Refresh"
            onClick={loadFiles}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
          </button>
          {onCollapse && (
            <button
              className="ide-explorer-action-btn"
              title="Collapse sidebar"
              onClick={onCollapse}
            >
              <PanelLeftClose size={13} />
            </button>
          )}
        </div>
        <input
          ref={uploadInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleUpload}
          accept="*"
        />
      </div>

      {/* Project name label */}
      <div style={{
        padding: '6px 12px',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--ide-accent)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        borderBottom: '1px solid var(--ide-border)',
      }}>
        <FolderOpen size={11} />
        {currentProject?.name?.toUpperCase()}
      </div>

      {/* Tree */}
      <div
        className="ide-explorer-tree"
        onContextMenu={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY, node: fileTree });
          }
        }}
      >
        {loading && children.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <NinjaEye size={28} labelled={false} style={{ margin: '0 auto' }} />
          </div>
        )}

        {/* New file/folder inline input */}
        {creatingFile && (
          <div className="ide-tree-item" style={{ paddingLeft: 8 }}>
            <span style={{ width: 11 }} />
            {creatingFile.type === 'folder'
              ? <Folder size={13} color="#d4a55a" />
              : <File size={13} color="#888" />}
            <input
              ref={newItemInputRef}
              className="ide-tree-name-input"
              placeholder={creatingFile.type === 'folder' ? 'folder-name' : 'file.py'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSubmit(e.target.value);
                if (e.key === 'Escape') setCreatingFile(null);
              }}
              onBlur={(e) => handleCreateSubmit(e.target.value)}
            />
          </div>
        )}

        {children.map(node => (
          <TreeNode
            key={node.path}
            node={node}
            depth={0}
            activeFileId={activeFileId}
            onFileClick={(n) => {
              const flat = flatFiles.find(f => f.file_path === n.path);
              if (flat) onFileOpen(flat);
            }}
            onRightClick={(e, n) => setContextMenu({ x: e.clientX, y: e.clientY, node: n })}
            onDragStart={handleDragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            renaming={renaming}
            onRenameSubmit={handleRenameSubmit}
            onRenameCancel={() => setRenaming(null)}
          />
        ))}

        {!loading && children.length === 0 && (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--ide-text-muted)', fontSize: 12 }}>
            <div>📂</div>
            <div style={{ marginTop: 4 }}>Empty project</div>
            <div style={{ marginTop: 4, fontSize: 10 }}>Click + to create files</div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={() => setContextMenu(null)}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
          onRename={handleRename}
          onDelete={handleDelete}
          onCopyPath={handleCopyPath}
        />
      )}
    </div>
  );
}
