/**
 * GitPanel.jsx — Source control panel for the IDE
 *
 * Shows staged/unstaged files, diff viewer, commit, push, pull.
 */

import React, { useState, useCallback } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { configureMonaco } from "../../config/monacoLoader";

// Point Monaco at its CDN before any editor mounts. Moved out of main.jsx
// so @monaco-editor/react stays out of the app entry chunk.
configureMonaco();
import {
  GitBranch, Plus, Minus, RefreshCw, Upload, Download,
  Check, ChevronDown, GitCommit
} from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import { pushFilesToGitHub, getRepoBranches, createBranch } from '../../services/githubIDEService';
import { listFiles, saveFile } from '../../services/projectService';

export default function GitPanel({ onToast }) {
  const {
    currentProject, githubToken, gitStatus, setGitStatus,
    stageFile, unstageFile, clearGitStatus, flatFiles, openFiles,
  } = useProjects();

  const [commitMsg, setCommitMsg] = useState('');
  const [pushing, setPushing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [diffFile, setDiffFile] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [branches, setBranches] = useState([]);
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [progress, setProgress] = useState(null);

  const hasGitHub = !!(currentProject?.github_repo && currentProject?.github_owner && githubToken);
  const totalChanges = gitStatus.staged.length + gitStatus.unstaged.length;

  // ── Stage All ────────────────────────────────────────────────────────────
  const handleStageAll = () => {
    const all = [...gitStatus.unstaged];
    setGitStatus(prev => ({
      ...prev,
      staged: [...prev.staged, ...all],
      unstaged: [],
    }));
  };

  // ── Commit & Push ────────────────────────────────────────────────────────
  const handlePush = useCallback(async () => {
    if (!hasGitHub) {
      onToast?.('Connect GitHub in Project Settings first', 'error');
      return;
    }
    if (gitStatus.staged.length === 0) {
      onToast?.('No staged files to push', 'info');
      return;
    }
    if (!commitMsg.trim()) {
      onToast?.('Enter a commit message', 'info');
      return;
    }

    setPushing(true);
    try {
      const results = await pushFilesToGitHub(
        currentProject.github_owner,
        currentProject.github_repo,
        currentProject.github_branch || 'main',
        gitStatus.staged,
        commitMsg.trim(),
        githubToken,
        (done, total) => setProgress({ done, total })
      );

      const failed = results.filter(r => !r.success);
      if (failed.length === 0) {
        onToast?.(`✓ Pushed ${results.length} file(s) to GitHub`, 'success');
        clearGitStatus();
        setCommitMsg('');
      } else {
        onToast?.(`Pushed ${results.length - failed.length}/${results.length}. ${failed.length} failed.`, 'error');
      }
    } catch (err) {
      onToast?.(err.message || 'Push failed', 'error');
    } finally {
      setPushing(false);
      setProgress(null);
    }
  }, [hasGitHub, gitStatus, commitMsg, currentProject, githubToken, clearGitStatus, onToast]);

  // ── Pull (fetch latest from GitHub) ─────────────────────────────────────
  const handlePull = useCallback(async () => {
    if (!hasGitHub) {
      onToast?.('Connect GitHub in Project Settings first', 'error');
      return;
    }
    setPulling(true);
    try {
      const { importRepoToProject } = await import('../../services/githubIDEService');
      await importRepoToProject({
        owner: currentProject.github_owner,
        repo: currentProject.github_repo,
        branch: currentProject.github_branch || 'main',
        projectId: currentProject.id,
        token: githubToken,
        onProgress: (done, total) => setProgress({ done, total, label: 'Pulling' }),
      });
      onToast?.('✓ Pulled latest changes from GitHub', 'success');
    } catch (err) {
      onToast?.(err.message || 'Pull failed', 'error');
    } finally {
      setPulling(false);
      setProgress(null);
    }
  }, [hasGitHub, currentProject, githubToken, onToast]);

  // ── Diff View ─────────────────────────────────────────────────────────────
  const handleViewDiff = (file) => {
    setDiffFile(file);
    setShowDiff(true);
  };

  // ── Branch Management ─────────────────────────────────────────────────────
  const handleLoadBranches = async () => {
    if (!hasGitHub) return;
    try {
      const data = await getRepoBranches(
        currentProject.github_owner,
        currentProject.github_repo,
        githubToken
      );
      setBranches(data.map(b => b.name));
      setShowBranchPicker(true);
    } catch (err) {
      onToast?.('Failed to load branches', 'error');
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim() || !hasGitHub) return;
    try {
      await createBranch(
        currentProject.github_owner,
        currentProject.github_repo,
        newBranchName.trim(),
        currentProject.github_branch || 'main',
        githubToken
      );
      setGitStatus(prev => ({ ...prev, branch: newBranchName.trim() }));
      onToast?.(`Branch "${newBranchName}" created`, 'success');
      setNewBranchName('');
      setShowBranchPicker(false);
    } catch (err) {
      onToast?.(err.message || 'Failed to create branch', 'error');
    }
  };

  const renderFileList = (files, isStaged) => files.map(file => {
    const filename = file.path.split('/').pop();
    return (
      <div key={file.path} className="ide-git-file-item">
        <span className={`ide-git-file-status M`}>M</span>
        <span className="ide-git-file-path" title={file.path}>{filename}</span>
        <span style={{ fontSize: 10, color: 'var(--ide-text-muted)', flexShrink: 0 }}>
          {file.path.split('/').slice(0, -1).join('/') || '/'}
        </span>
        <button
          className="ide-git-file-action"
          title="View diff"
          onClick={() => handleViewDiff(file)}
        >
          {isStaged
            ? <Minus size={11} onClick={(e) => { e.stopPropagation(); unstageFile(file.path); }} title="Unstage" />
            : <Plus size={11} onClick={(e) => { e.stopPropagation(); stageFile(file.path, file.content); }} title="Stage" />
          }
        </button>
      </div>
    );
  });

  return (
    <div className="ide-git-panel">
      {/* Branch bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 5, background: 'var(--ide-surface2)',
            border: '1px solid var(--ide-border)', borderRadius: 4, color: 'var(--ide-text-muted)',
            fontSize: 11, padding: '3px 10px', cursor: 'pointer',
          }}
          onClick={handleLoadBranches}
        >
          <GitBranch size={11} /> {gitStatus.branch}
          <ChevronDown size={10} />
        </button>

        {hasGitHub && (
          <>
            <button
              className="ide-git-btn pull"
              style={{ flex: 'none', padding: '3px 10px' }}
              onClick={handlePull}
              disabled={pulling}
            >
              {pulling ? <><span className="ide-spinner" style={{ width: 10, height: 10 }} /> Pulling…</> : <><Download size={11} /> Pull</>}
            </button>
          </>
        )}

        {!hasGitHub && (
          <span style={{ fontSize: 10, color: 'var(--ide-text-muted)' }}>
            Connect GitHub in Settings →
          </span>
        )}
      </div>

      {/* Branch picker */}
      {showBranchPicker && (
        <div style={{
          background: 'var(--ide-surface2)', border: '1px solid var(--ide-border)',
          borderRadius: 6, padding: 10, marginBottom: 8,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ide-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Switch Branch
          </div>
          {branches.map(b => (
            <div
              key={b}
              onClick={() => { setGitStatus(prev => ({ ...prev, branch: b })); setShowBranchPicker(false); }}
              style={{
                padding: '4px 8px', fontSize: 12, cursor: 'pointer', borderRadius: 4,
                color: b === gitStatus.branch ? 'var(--ide-accent)' : 'var(--ide-text)',
                background: b === gitStatus.branch ? 'rgba(0,255,136,0.08)' : 'transparent',
              }}
            >
              {b === gitStatus.branch ? '✓ ' : '  '}{b}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              className="ide-field-input"
              style={{ height: 28, fontSize: 11 }}
              placeholder="new-branch-name"
              value={newBranchName}
              onChange={e => setNewBranchName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateBranch()}
            />
            <button className="ide-git-btn commit" style={{ flex: 'none', padding: '0 10px' }} onClick={handleCreateBranch}>
              Create
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {progress && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--ide-text-muted)', marginBottom: 4 }}>
            {progress.label || 'Pushing'}: {progress.done}/{progress.total} files
          </div>
          <div className="ide-progress-bar-wrap">
            <div className="ide-progress-bar" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Staged files */}
      {gitStatus.staged.length > 0 && (
        <>
          <div className="ide-git-section-title">
            <Check size={10} /> Staged ({gitStatus.staged.length})
            <button
              style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 10, color: 'var(--ide-text-muted)', cursor: 'pointer' }}
              onClick={() => setGitStatus(prev => ({ ...prev, staged: [], unstaged: [...prev.unstaged, ...prev.staged] }))}
            >
              Unstage All
            </button>
          </div>
          {renderFileList(gitStatus.staged, true)}
        </>
      )}

      {/* Unstaged files */}
      {gitStatus.unstaged.length > 0 && (
        <>
          <div className="ide-git-section-title">
            <GitCommit size={10} /> Changes ({gitStatus.unstaged.length})
            <button
              style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 10, color: 'var(--ide-text-muted)', cursor: 'pointer' }}
              onClick={handleStageAll}
            >
              Stage All
            </button>
          </div>
          {renderFileList(gitStatus.unstaged, false)}
        </>
      )}

      {totalChanges === 0 && (
        <div style={{ textAlign: 'center', padding: '16px', fontSize: 12, color: 'var(--ide-text-muted)' }}>
          No changes detected
        </div>
      )}

      {/* Commit area */}
      <div className="ide-git-commit-area">
        <textarea
          className="ide-git-commit-input"
          placeholder="Commit message…"
          value={commitMsg}
          onChange={e => setCommitMsg(e.target.value)}
        />
        <div className="ide-git-actions">
          <button
            className="ide-git-btn commit"
            onClick={handlePush}
            disabled={pushing || gitStatus.staged.length === 0 || !commitMsg.trim()}
            title={!hasGitHub ? 'Connect GitHub in Project Settings' : ''}
          >
            {pushing
              ? <><span className="ide-spinner" style={{ width: 10, height: 10 }} /> Pushing…</>
              : <><Upload size={11} /> {hasGitHub ? 'Commit & Push' : 'Commit'}</>
            }
          </button>
        </div>
      </div>

      {/* Diff modal */}
      {showDiff && diffFile && (
        <div className="ide-modal-overlay" onClick={() => setShowDiff(false)}>
          <div className="ide-modal xl" onClick={e => e.stopPropagation()}>
            <div className="ide-modal-header">
              <div className="ide-modal-title">Diff: {diffFile.path}</div>
              <button className="ide-modal-close" onClick={() => setShowDiff(false)}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <DiffEditor
                original=""
                modified={diffFile.content || ''}
                language="plaintext"
                theme="vs-dark"
                options={{ readOnly: true, renderSideBySide: false, minimap: { enabled: false } }}
                height="400px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
