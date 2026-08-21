/**
 * VersionHistory.jsx — File version history viewer
 *
 * Shows snapshot history for the currently active file with diff preview
 * and one-click restore.
 */

import React, { useState, useEffect } from 'react';
import { NinjaEye } from '../NinjaEye';
import { DiffEditor } from '@monaco-editor/react';
import { configureMonaco } from "../../config/monacoLoader";

// Point Monaco at its CDN before any editor mounts. Moved out of main.jsx
// so @monaco-editor/react stays out of the app entry chunk.
configureMonaco();
import { Clock, RotateCcw, ChevronLeft } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import { listFileVersions, restoreFileVersion } from '../../services/projectService';

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

export default function VersionHistory({ onClose, onToast }) {
  const { activeFile, currentProject, markSaved, openFiles, updateOpenFileContent } = useProjects();

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (!activeFile) return;
    loadVersions();
  }, [activeFile]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const data = await listFileVersions(activeFile.id);
      setVersions(data);
    } catch (err) {
      onToast?.('Failed to load version history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version) => {
    if (!window.confirm(`Restore to version ${version.version}? Current content will be saved as a new version.`)) return;
    setRestoring(true);
    try {
      await restoreFileVersion(currentProject.id, activeFile.id, version.id);

      // Update in-editor content
      updateOpenFileContent(activeFile.id, version.content || '');
      markSaved(activeFile.id, version.content || '');

      onToast?.(`✓ Restored to version ${version.version}`, 'success');
      onClose();
    } catch (err) {
      onToast?.('Failed to restore version', 'error');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="ide-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ide-modal xl">
        <div className="ide-modal-header">
          <button
            className="ide-toolbar-back"
            style={{ marginRight: 8 }}
            onClick={onClose}
          >
            <ChevronLeft size={12} />
          </button>
          <div className="ide-modal-title">
            <Clock size={14} style={{ marginRight: 6 }} />
            Version History — {activeFile?.filename}
          </div>
          <button className="ide-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ide-modal-body" style={{ display: 'flex', gap: 16, overflow: 'hidden', padding: 0, height: '500px' }}>
          {/* Version List */}
          <div style={{
            width: 240, flexShrink: 0, borderRight: '1px solid var(--ide-border)',
            padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 16 }}>
                <NinjaEye size={28} labelled={false} style={{ margin: '0 auto' }} />
              </div>
            ) : versions.length === 0 ? (
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ide-text-muted)', padding: 20 }}>
                No version history yet.
                <br />
                Versions are saved automatically as you edit.
              </div>
            ) : (
              <>
                {/* Current version */}
                <div
                  className={`ide-version-item ${!selectedVersion ? 'active' : ''}`}
                  onClick={() => setSelectedVersion(null)}
                >
                  <span className="ide-version-number">Current</span>
                  <span className="ide-version-date">Now</span>
                </div>

                {versions.map(v => (
                  <div
                    key={v.id}
                    className={`ide-version-item ${selectedVersion?.id === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVersion(v)}
                  >
                    <span className="ide-version-number">v{v.version}</span>
                    <span className="ide-version-date">{timeAgo(v.created_at)}</span>
                    <button
                      style={{
                        background: 'none', border: 'none', color: 'var(--ide-text-muted)',
                        cursor: 'pointer', padding: '2px 4px', borderRadius: 3, fontSize: 10,
                        display: 'flex', alignItems: 'center', gap: 3,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                      className="version-restore-btn"
                      onClick={(e) => { e.stopPropagation(); handleRestore(v); }}
                      disabled={restoring}
                      title="Restore this version"
                    >
                      <RotateCcw size={10} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Diff Preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selectedVersion ? (
              <>
                <div style={{
                  padding: '8px 16px', borderBottom: '1px solid var(--ide-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--ide-surface)', flexShrink: 0,
                }}>
                  <span style={{ fontSize: 12, color: 'var(--ide-text-muted)' }}>
                    v{selectedVersion.version} → Current
                  </span>
                  <button
                    className="ide-modal-btn primary"
                    style={{ padding: '4px 14px', fontSize: 11 }}
                    onClick={() => handleRestore(selectedVersion)}
                    disabled={restoring}
                  >
                    {restoring
                      ? <><NinjaEye size={14} labelled={false} /> Restoring…</>
                      : <><RotateCcw size={11} /> Restore this Version</>}
                  </button>
                </div>
                <DiffEditor
                  original={selectedVersion.content || ''}
                  modified={activeFile?.content || ''}
                  language={activeFile?.language || 'plaintext'}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    renderSideBySide: true,
                    minimap: { enabled: false },
                    fontSize: 12,
                    scrollBeyondLastLine: false,
                  }}
                />
              </>
            ) : (
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ide-text-muted)', fontSize: 13, flexDirection: 'column', gap: 8,
              }}>
                <Clock size={28} style={{ opacity: 0.2 }} />
                <div>Select a version to compare</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ide-version-item:hover .version-restore-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
