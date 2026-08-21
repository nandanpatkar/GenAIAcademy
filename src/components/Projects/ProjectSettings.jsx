/**
 * ProjectSettings.jsx — Project settings modal
 *
 * Tabs: General, GitHub, Environment, Build
 */

import React, { useState, useEffect } from 'react';
import { NinjaEye } from '../NinjaEye';
import { Settings, GitBranch, Terminal, Package, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import { updateProject } from '../../services/projectService';
import { validateToken } from '../../services/githubIDEService';

const LANGUAGE_OPTIONS = [
  'python', 'javascript', 'typescript', 'go', 'rust', 'java', 'cpp', 'ruby', 'swift', 'kotlin', 'other'
];

function GeneralTab({ project, form, setForm }) {
  return (
    <div>
      <div className="ide-field">
        <label className="ide-field-label">Project Name</label>
        <input
          className="ide-field-input"
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        />
      </div>
      <div className="ide-field">
        <label className="ide-field-label">Description</label>
        <textarea
          className="ide-field-textarea"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        />
      </div>
      <div className="ide-field">
        <label className="ide-field-label">Default Language</label>
        <select
          className="ide-field-select"
          value={form.defaultLanguage}
          onChange={e => setForm(p => ({ ...p, defaultLanguage: e.target.value }))}
        >
          {LANGUAGE_OPTIONS.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function GitHubTab({ form, setForm, onValidateToken }) {
  const { githubToken, saveGithubToken } = useProjects();
  const [token, setToken] = useState(githubToken || '');
  const [showToken, setShowToken] = useState(false);
  const [validating, setValidating] = useState(false);
  const [tokenStatus, setTokenStatus] = useState(null);

  const handleValidate = async () => {
    if (!token.trim()) return;
    setValidating(true);
    const result = await validateToken(token.trim());
    setTokenStatus(result);
    if (result.valid) {
      saveGithubToken(token.trim());
    }
    setValidating(false);
  };

  return (
    <div>
      <div className="ide-field">
        <label className="ide-field-label">GitHub Personal Access Token</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="ide-search-input-wrap" style={{ flex: 1 }}>
            <input
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--ide-text)', fontSize: 12 }}
              type={showToken ? 'text' : 'password'}
              placeholder="ghp_xxxxxxxxxxxxxxxx"
              value={token}
              onChange={e => setToken(e.target.value)}
            />
            <button
              style={{ background: 'none', border: 'none', color: 'var(--ide-text-muted)', cursor: 'pointer' }}
              onClick={() => setShowToken(p => !p)}
            >
              {showToken ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          <button
            className="ide-modal-btn primary"
            style={{ padding: '0 14px', height: 32, fontSize: 12 }}
            onClick={handleValidate}
            disabled={validating || !token.trim()}
          >
            {validating ? <NinjaEye size={16} labelled={false} /> : 'Validate'}
          </button>
        </div>
        {tokenStatus && (
          <div style={{
            fontSize: 11, marginTop: 4, padding: '4px 8px', borderRadius: 4,
            color: tokenStatus.valid ? 'var(--ide-accent)' : 'var(--ide-danger)',
            background: tokenStatus.valid ? 'rgba(0,255,136,0.07)' : 'rgba(255,68,68,0.07)',
            border: `1px solid ${tokenStatus.valid ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,68,0.2)'}`,
          }}>
            {tokenStatus.valid ? `✓ Connected as @${tokenStatus.login}` : `✕ ${tokenStatus.error}`}
          </div>
        )}
        <div style={{ fontSize: 10, color: 'var(--ide-text-muted)', marginTop: 4 }}>
          Requires repo + workflow scopes. Token is stored locally in your browser.
        </div>
      </div>

      <div className="ide-field">
        <label className="ide-field-label">Repository Owner</label>
        <input
          className="ide-field-input"
          placeholder="github-username or org-name"
          value={form.githubOwner}
          onChange={e => setForm(p => ({ ...p, githubOwner: e.target.value }))}
        />
      </div>
      <div className="ide-field">
        <label className="ide-field-label">Repository Name</label>
        <input
          className="ide-field-input"
          placeholder="my-repo"
          value={form.githubRepo}
          onChange={e => setForm(p => ({ ...p, githubRepo: e.target.value }))}
        />
      </div>
      <div className="ide-field">
        <label className="ide-field-label">Branch</label>
        <input
          className="ide-field-input"
          placeholder="main"
          value={form.githubBranch}
          onChange={e => setForm(p => ({ ...p, githubBranch: e.target.value }))}
        />
      </div>
    </div>
  );
}

function EnvironmentTab({ form, setForm }) {
  const [entries, setEntries] = useState(() => {
    const env = form.envVars || {};
    return Object.entries(env).map(([k, v]) => ({ key: k, value: v }));
  });

  const updateForm = (newEntries) => {
    const obj = {};
    newEntries.forEach(e => { if (e.key.trim()) obj[e.key.trim()] = e.value; });
    setForm(p => ({ ...p, envVars: obj }));
    setEntries(newEntries);
  };

  const addRow = () => updateForm([...entries, { key: '', value: '' }]);
  const removeRow = (i) => updateForm(entries.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => {
    const updated = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e);
    updateForm(updated);
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--ide-text-muted)', marginBottom: 12 }}>
        Environment variables are stored securely in your project settings.
      </div>
      {entries.map((entry, i) => (
        <div key={i} className="ide-env-row">
          <input
            className="ide-env-key"
            placeholder="KEY"
            value={entry.key}
            onChange={e => updateRow(i, 'key', e.target.value)}
          />
          <input
            className="ide-env-value"
            placeholder="value"
            value={entry.value}
            onChange={e => updateRow(i, 'value', e.target.value)}
          />
          <button
            style={{ background: 'none', border: 'none', color: 'var(--ide-danger)', cursor: 'pointer' }}
            onClick={() => removeRow(i)}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button
        className="ide-modal-btn secondary"
        style={{ marginTop: 8, fontSize: 11, padding: '4px 12px' }}
        onClick={addRow}
      >
        <Plus size={11} /> Add Variable
      </button>
    </div>
  );
}

function BuildTab({ form, setForm }) {
  return (
    <div>
      <div className="ide-field">
        <label className="ide-field-label">Build Command</label>
        <input
          className="ide-field-input"
          style={{ fontFamily: 'var(--ide-font-mono)', fontSize: 12 }}
          placeholder="npm run build"
          value={form.buildCommand}
          onChange={e => setForm(p => ({ ...p, buildCommand: e.target.value }))}
        />
      </div>
      <div className="ide-field">
        <label className="ide-field-label">Run Command</label>
        <input
          className="ide-field-input"
          style={{ fontFamily: 'var(--ide-font-mono)', fontSize: 12 }}
          placeholder="python main.py"
          value={form.runCommand}
          onChange={e => setForm(p => ({ ...p, runCommand: e.target.value }))}
        />
      </div>
    </div>
  );
}

const TABS = [
  { id: 'general', label: 'General', icon: <Settings size={12} /> },
  { id: 'github', label: 'GitHub', icon: <GitBranch size={12} /> },
  { id: 'environment', label: 'Environment', icon: <Package size={12} /> },
  { id: 'build', label: 'Build', icon: <Terminal size={12} /> },
];

export default function ProjectSettings({ onClose, onToast }) {
  const { currentProject, setCurrentProject } = useProjects();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: currentProject?.name || '',
    description: currentProject?.description || '',
    defaultLanguage: currentProject?.default_language || 'python',
    githubOwner: currentProject?.github_owner || '',
    githubRepo: currentProject?.github_repo || '',
    githubBranch: currentProject?.github_branch || 'main',
    envVars: currentProject?.env_vars || {},
    buildCommand: currentProject?.build_command || '',
    runCommand: currentProject?.run_command || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProject(currentProject.id, {
        name: form.name,
        description: form.description,
        default_language: form.defaultLanguage,
        github_owner: form.githubOwner,
        github_repo: form.githubRepo,
        github_branch: form.githubBranch,
        env_vars: form.envVars,
        build_command: form.buildCommand,
        run_command: form.runCommand,
      });
      setCurrentProject(updated);
      onToast?.('Settings saved', 'success');
      onClose();
    } catch (err) {
      onToast?.('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ide-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ide-modal large">
        <div className="ide-modal-header">
          <div className="ide-modal-title">
            <Settings size={14} style={{ marginRight: 6 }} />
            Project Settings — {currentProject?.name}
          </div>
          <button className="ide-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ide-modal-body">
          <div className="ide-settings-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`ide-settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'general' && <GeneralTab project={currentProject} form={form} setForm={setForm} />}
          {activeTab === 'github' && <GitHubTab form={form} setForm={setForm} />}
          {activeTab === 'environment' && <EnvironmentTab form={form} setForm={setForm} />}
          {activeTab === 'build' && <BuildTab form={form} setForm={setForm} />}
        </div>

        <div className="ide-modal-footer">
          <button className="ide-modal-btn secondary" onClick={onClose}>Cancel</button>
          <button className="ide-modal-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? <><NinjaEye size={16} labelled={false} /> Saving…</> : '✓ Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
