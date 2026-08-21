/**
 * ImportGitHubModal.jsx — Import a GitHub repository into a project
 *
 * Allows users to browse their GitHub repos or paste a URL,
 * choose a branch, and import the full file tree.
 */

import React, { useState, useEffect } from 'react';
import { NinjaEye } from '../NinjaEye';
import { Search, GitBranch, Lock, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectsContext';
import { createProject } from '../../services/projectService';
import {
  getUserReposAuthenticated, getRepoBranches,
  importRepoToProject, parseGitHubUrl, validateToken
} from '../../services/githubIDEService';

export default function ImportGitHubModal({ onClose, onImported, onToast }) {
  const { user } = useAuth();
  const { githubToken, saveGithubToken, openProject } = useProjects();

  const [step, setStep] = useState(githubToken ? 'browse' : 'token'); // 'token' | 'browse' | 'importing'
  const [token, setToken] = useState(githubToken || '');
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [urlInput, setUrlInput] = useState('');
  const [search, setSearch] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState([]);
  const [useUrl, setUseUrl] = useState(false);

  // ── Load repos when token is ready ──────────────────────────────────────
  useEffect(() => {
    if (step === 'browse' && githubToken) {
      loadRepos();
    }
  }, [step]);

  // ── Search filter ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!search) { setFilteredRepos(repos); return; }
    const q = search.toLowerCase();
    setFilteredRepos(repos.filter(r =>
      r.full_name.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q)
    ));
  }, [search, repos]);

  const loadRepos = async () => {
    setLoadingRepos(true);
    try {
      const data = await getUserReposAuthenticated(githubToken);
      setRepos(data);
      setFilteredRepos(data);
    } catch (err) {
      onToast?.('Failed to load repos: ' + err.message, 'error');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleTokenSubmit = async () => {
    if (!token.trim()) return;
    const result = await validateToken(token.trim());
    if (result.valid) {
      saveGithubToken(token.trim());
      setStep('browse');
    } else {
      onToast?.(result.error || 'Invalid token', 'error');
    }
  };

  const handleSelectRepo = async (repo) => {
    setSelectedRepo(repo);
    try {
      const data = await getRepoBranches(repo.owner.login, repo.name, githubToken);
      const branchNames = data.map(b => b.name);
      setBranches(branchNames);
      setSelectedBranch(repo.default_branch || branchNames[0] || 'main');
    } catch {
      setBranches([repo.default_branch || 'main']);
    }
  };

  const handleImport = async () => {
    let owner, repo, branch;

    if (useUrl) {
      const parsed = parseGitHubUrl(urlInput);
      if (!parsed) { onToast?.('Invalid GitHub URL', 'error'); return; }
      owner = parsed.owner;
      repo = parsed.repo;
      branch = selectedBranch || 'main';
    } else {
      if (!selectedRepo) { onToast?.('Select a repository first', 'info'); return; }
      owner = selectedRepo.owner.login;
      repo = selectedRepo.name;
      branch = selectedBranch;
    }

    setStep('importing');
    setProgress({ done: 0, total: 0, currentFile: 'Initializing…' });
    setErrors([]);

    try {
      // Create project
      const project = await createProject(user.id, {
        name: repo,
        description: (selectedRepo?.description || `Imported from github.com/${owner}/${repo}`),
        defaultLanguage: detectRepoLanguage(selectedRepo),
      });

      // Update project with GitHub info
      const { updateProject } = await import('../../services/projectService');
      await updateProject(project.id, {
        github_owner: owner,
        github_repo: repo,
        github_branch: branch,
      });

      const errs = [];
      const result = await importRepoToProject({
        owner,
        repo,
        branch,
        projectId: project.id,
        token: githubToken,
        onProgress: (done, total, currentFile) => setProgress({ done, total, currentFile }),
        onError: (path, err) => errs.push({ path, error: err.message }),
      });

      if (errs.length > 0) setErrors(errs);

      onToast?.(`✓ Imported ${result.imported} files from ${owner}/${repo}`, 'success');
      openProject(project);
      onImported?.();
      onClose();
    } catch (err) {
      onToast?.(err.message || 'Import failed', 'error');
      setStep('browse');
    }
  };

  const detectRepoLanguage = (repo) => {
    const lang = (repo?.language || '').toLowerCase();
    const map = { javascript: 'javascript', typescript: 'typescript', python: 'python', go: 'go', rust: 'rust', java: 'java', 'c++': 'cpp', ruby: 'ruby' };
    return map[lang] || 'other';
  };

  return (
    <div className="ide-modal-overlay" onClick={(e) => e.target === e.currentTarget && step !== 'importing' && onClose()}>
      <div className="ide-modal large">
        <div className="ide-modal-header">
          <div className="ide-modal-title">
            <GitBranch size={15} style={{ marginRight: 8 }} />
            Import from GitHub
          </div>
          {step !== 'importing' && (
            <button className="ide-modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="ide-modal-body">
          {/* Step 1: Token */}
          {step === 'token' && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--ide-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
                A GitHub Personal Access Token is required to browse and import private repositories.
              </div>
              <div className="ide-field">
                <label className="ide-field-label">Personal Access Token</label>
                <input
                  className="ide-field-input"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTokenSubmit()}
                  autoFocus
                />
                <div style={{ fontSize: 10, color: 'var(--ide-text-muted)', marginTop: 4 }}>
                  Generate at github.com → Settings → Developer settings → Personal access tokens
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Browse */}
          {step === 'browse' && (
            <div>
              {/* URL or browse toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button
                  className={`ide-settings-tab ${!useUrl ? 'active' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setUseUrl(false)}
                >
                  Browse My Repos
                </button>
                <button
                  className={`ide-settings-tab ${useUrl ? 'active' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setUseUrl(true)}
                >
                  Paste URL
                </button>
              </div>

              {useUrl ? (
                <div className="ide-field">
                  <label className="ide-field-label">Repository URL</label>
                  <input
                    className="ide-field-input"
                    placeholder="https://github.com/owner/repo"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    autoFocus
                  />
                  <div className="ide-field" style={{ marginTop: 12 }}>
                    <label className="ide-field-label">Branch</label>
                    <input
                      className="ide-field-input"
                      placeholder="main"
                      value={selectedBranch}
                      onChange={e => setSelectedBranch(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="ide-search-input-wrap" style={{ marginBottom: 10 }}>
                    <Search size={12} style={{ color: 'var(--ide-text-muted)' }} />
                    <input
                      className="ide-search-input"
                      placeholder="Search repositories…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="ide-repo-list">
                    {loadingRepos && (
                      <div style={{ textAlign: 'center', padding: 16 }}>
                        <NinjaEye size={28} labelled={false} style={{ margin: '0 auto' }} />
                      </div>
                    )}
                    {filteredRepos.map(repo => (
                      <div
                        key={repo.id}
                        className={`ide-repo-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                        onClick={() => handleSelectRepo(repo)}
                      >
                        <div style={{ flex: 1 }}>
                          <div className="ide-repo-name">{repo.full_name}</div>
                          {repo.description && (
                            <div className="ide-repo-desc">{repo.description}</div>
                          )}
                          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                            {repo.language && (
                              <span style={{ fontSize: 10, color: 'var(--ide-text-muted)' }}>
                                {repo.language}
                              </span>
                            )}
                          </div>
                        </div>
                        {repo.private && <span className="ide-repo-private"><Lock size={9} /> Private</span>}
                      </div>
                    ))}
                  </div>

                  {/* Branch selector */}
                  {selectedRepo && branches.length > 0 && (
                    <div className="ide-field" style={{ marginTop: 12 }}>
                      <label className="ide-field-label">Branch</label>
                      <select
                        className="ide-field-select"
                        value={selectedBranch}
                        onChange={e => setSelectedBranch(e.target.value)}
                      >
                        {branches.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Importing */}
          {step === 'importing' && progress && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ide-text)', marginBottom: 8 }}>
                Importing Repository…
              </div>
              <div style={{ fontSize: 11, color: 'var(--ide-text-muted)', marginBottom: 16 }}>
                {progress.currentFile || 'Reading files…'}
              </div>
              <div className="ide-progress-bar-wrap">
                <div
                  className="ide-progress-bar"
                  style={{ width: progress.total > 0 ? `${(progress.done / progress.total) * 100}%` : '30%' }}
                />
              </div>
              <div style={{ fontSize: 10, color: 'var(--ide-text-muted)', marginTop: 8 }}>
                {progress.done} / {progress.total || '?'} files
              </div>
            </div>
          )}
        </div>

        <div className="ide-modal-footer">
          {step === 'token' && (
            <>
              <button className="ide-modal-btn secondary" onClick={onClose}>Cancel</button>
              <button className="ide-modal-btn primary" onClick={handleTokenSubmit} disabled={!token.trim()}>
                Connect →
              </button>
            </>
          )}
          {step === 'browse' && (
            <>
              <button className="ide-modal-btn secondary" onClick={onClose}>Cancel</button>
              <button
                className="ide-modal-btn primary"
                onClick={handleImport}
                disabled={!useUrl ? !selectedRepo : !urlInput.trim()}
              >
                <GitBranch size={13} /> Import Repository
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
