/**
 * projectService.js — Supabase CRUD for Projects Cloud IDE
 *
 * Handles all database operations for projects, files, and version history.
 */

import { supabase } from '../config/supabaseClient';

// ─── EXT → Language map ───────────────────────────────────────────────────────
const EXT_LANG_MAP = {
  '.js': 'javascript', '.jsx': 'javascript', '.ts': 'typescript', '.tsx': 'typescript',
  '.py': 'python', '.rs': 'rust', '.go': 'go', '.java': 'java',
  '.cpp': 'cpp', '.c': 'c', '.rb': 'ruby', '.swift': 'swift',
  '.kt': 'kotlin', '.dart': 'dart', '.sh': 'shell', '.bash': 'shell',
  '.html': 'html', '.css': 'css', '.scss': 'scss', '.json': 'json',
  '.yaml': 'yaml', '.yml': 'yaml', '.md': 'markdown', '.sql': 'sql',
  '.toml': 'toml', '.xml': 'xml', '.dockerfile': 'dockerfile',
  '.env': 'shell', '.gitignore': 'plaintext', '.txt': 'plaintext',
};

export const detectLanguage = (filename) => {
  const ext = filename.includes('.') ? '.' + filename.split('.').pop().toLowerCase() : '';
  const lower = filename.toLowerCase();
  if (lower === 'dockerfile') return 'dockerfile';
  if (lower === 'makefile') return 'makefile';
  return EXT_LANG_MAP[ext] || 'plaintext';
};

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Create a new project for the given user.
 */
export const createProject = async (userId, { name, description = '', defaultLanguage = 'python' }) => {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name: name.trim(),
      description: description.trim(),
      default_language: defaultLanguage,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * List all projects for a user, ordered by last updated.
 */
export const listProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

/**
 * Get a single project by ID.
 */
export const getProject = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Update project metadata.
 */
export const updateProject = async (projectId, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Delete a project (cascade deletes files & versions via FK).
 */
export const deleteProject = async (projectId) => {
  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw error;
};

/**
 * Duplicate a project: clones metadata and all files.
 */
export const duplicateProject = async (userId, projectId) => {
  const original = await getProject(projectId);
  const newProject = await createProject(userId, {
    name: `${original.name} (Copy)`,
    description: original.description,
    defaultLanguage: original.default_language,
  });

  // Clone all files
  const files = await listFiles(projectId);
  if (files.length > 0) {
    const cloned = files.map(f => ({
      project_id: newProject.id,
      parent_folder: f.parent_folder,
      filename: f.filename,
      file_path: f.file_path,
      file_type: f.file_type,
      content: f.content,
      language: f.language,
      version: 1,
    }));
    const { error } = await supabase.from('project_files').insert(cloned);
    if (error) throw error;
  }

  await updateFileCount(newProject.id);
  return newProject;
};

// ─── Files ────────────────────────────────────────────────────────────────────

/**
 * List all files/folders in a project.
 */
export const listFiles = async (projectId) => {
  const { data, error } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .order('file_path', { ascending: true });
  if (error) throw error;
  return data || [];
};

/**
 * Get a single file by ID.
 */
export const getFile = async (fileId) => {
  const { data, error } = await supabase
    .from('project_files')
    .select('*')
    .eq('id', fileId)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Save (upsert) a file. Saves a version snapshot before overwriting content.
 */
export const saveFile = async (projectId, filePath, content, metadata = {}) => {
  const filename = filePath.split('/').filter(Boolean).pop() || filePath;
  const parentFolder = filePath.split('/').slice(0, -1).join('/') || '/';
  const language = metadata.language || detectLanguage(filename);

  // Check if file already exists
  const { data: existing } = await supabase
    .from('project_files')
    .select('id, version, content')
    .eq('project_id', projectId)
    .eq('file_path', filePath)
    .single();

  let fileId;
  let newVersion = 1;

  if (existing) {
    // Save old content as a version before overwriting
    if (existing.content && existing.content !== content) {
      await supabase.from('file_versions').insert({
        file_id: existing.id,
        content: existing.content,
        version: existing.version,
      });
      // Keep only last 20 versions
      await pruneVersions(existing.id, 20);
    }

    newVersion = (existing.version || 1) + 1;
    const { data, error } = await supabase
      .from('project_files')
      .update({
        content,
        language,
        version: newVersion,
        updated_at: new Date().toISOString(),
        ...metadata,
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    fileId = existing.id;
  } else {
    const { data, error } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        parent_folder: parentFolder,
        filename,
        file_path: filePath,
        file_type: metadata.file_type || 'file',
        content,
        language,
        version: 1,
        ...metadata,
      })
      .select()
      .single();
    if (error) throw error;
    fileId = data.id;
  }

  // Update project updated_at and file_count
  await updateFileCount(projectId);
  return { id: fileId, version: newVersion };
};

/**
 * Create a folder entry.
 */
export const createFolder = async (projectId, folderPath) => {
  const folderName = folderPath.split('/').filter(Boolean).pop() || folderPath;
  const parentFolder = folderPath.split('/').slice(0, -1).join('/') || '/';

  const { data, error } = await supabase
    .from('project_files')
    .insert({
      project_id: projectId,
      parent_folder: parentFolder,
      filename: folderName,
      file_path: folderPath,
      file_type: 'folder',
      content: '',
      language: '',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Delete a file or folder (and all children for folders).
 */
export const deleteFile = async (projectId, filePath) => {
  // Delete this file and any children (for folders)
  const { error } = await supabase
    .from('project_files')
    .delete()
    .eq('project_id', projectId)
    .or(`file_path.eq.${filePath},file_path.like.${filePath}/%`);
  if (error) throw error;
  await updateFileCount(projectId);
};

/**
 * Rename a file or folder.
 */
export const renameFile = async (projectId, oldPath, newPath) => {
  const newFilename = newPath.split('/').filter(Boolean).pop() || newPath;
  const newParent = newPath.split('/').slice(0, -1).join('/') || '/';

  // Rename this file
  const { error: e1 } = await supabase
    .from('project_files')
    .update({
      file_path: newPath,
      filename: newFilename,
      parent_folder: newParent,
      updated_at: new Date().toISOString(),
    })
    .eq('project_id', projectId)
    .eq('file_path', oldPath);
  if (e1) throw e1;

  // Update children paths (for folder rename)
  const { data: children } = await supabase
    .from('project_files')
    .select('id, file_path, parent_folder')
    .eq('project_id', projectId)
    .like('file_path', `${oldPath}/%`);

  if (children && children.length > 0) {
    const updates = children.map(c => ({
      id: c.id,
      file_path: c.file_path.replace(oldPath, newPath),
      parent_folder: c.parent_folder.replace(oldPath, newPath),
    }));
    for (const u of updates) {
      await supabase.from('project_files').update({
        file_path: u.file_path,
        parent_folder: u.parent_folder,
      }).eq('id', u.id);
    }
  }
};

/**
 * Move a file to a new folder.
 */
export const moveFile = async (projectId, filePath, newParentFolder) => {
  const filename = filePath.split('/').filter(Boolean).pop() || filePath;
  const newPath = `${newParentFolder}/${filename}`.replace('//', '/');
  await renameFile(projectId, filePath, newPath);
  return newPath;
};

// ─── Version History ─────────────────────────────────────────────────────────

/**
 * List version history for a file.
 */
export const listFileVersions = async (fileId) => {
  const { data, error } = await supabase
    .from('file_versions')
    .select('*')
    .eq('file_id', fileId)
    .order('version', { ascending: false });
  if (error) throw error;
  return data || [];
};

/**
 * Restore a file to a specific version.
 */
export const restoreFileVersion = async (projectId, fileId, versionId) => {
  const { data: ver, error: ve } = await supabase
    .from('file_versions')
    .select('content')
    .eq('id', versionId)
    .single();
  if (ve) throw ve;

  const { data: file } = await supabase
    .from('project_files')
    .select('file_path')
    .eq('id', fileId)
    .single();

  await saveFile(projectId, file.file_path, ver.content);
};

/**
 * Keep only the N most recent versions for a file.
 */
const pruneVersions = async (fileId, keep = 20) => {
  const { data } = await supabase
    .from('file_versions')
    .select('id')
    .eq('file_id', fileId)
    .order('version', { ascending: false })
    .range(keep, 999);
  if (data && data.length > 0) {
    const ids = data.map(d => d.id);
    await supabase.from('file_versions').delete().in('id', ids);
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Recount and update file_count on a project.
 */
const updateFileCount = async (projectId) => {
  const { count } = await supabase
    .from('project_files')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('file_type', 'file');

  await supabase.from('projects').update({
    file_count: count || 0,
    updated_at: new Date().toISOString(),
  }).eq('id', projectId);
};

/**
 * Build a tree structure from a flat list of files.
 */
export const buildFileTree = (files) => {
  const root = { name: '/', type: 'folder', children: [], path: '/' };
  const map = { '/': root };

  // Sort: folders first, then files, alphabetically
  const sorted = [...files].sort((a, b) => {
    if (a.file_type !== b.file_type) return a.file_type === 'folder' ? -1 : 1;
    return a.file_path.localeCompare(b.file_path);
  });

  for (const file of sorted) {
    const parts = file.file_path.split('/').filter(Boolean);
    let current = root;
    let currentPath = '';

    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += '/' + parts[i];
      if (!map[currentPath]) {
        const node = { name: parts[i], type: 'folder', children: [], path: currentPath };
        map[currentPath] = node;
        current.children.push(node);
      }
      current = map[currentPath];
    }

    const node = {
      id: file.id,
      name: file.filename,
      type: file.file_type,
      path: file.file_path,
      language: file.language,
      children: file.file_type === 'folder' ? [] : undefined,
    };
    if (!map[file.file_path]) {
      map[file.file_path] = node;
      current.children.push(node);
    }
  }

  return root;
};

/**
 * Search files by content or name.
 */
export const searchFiles = async (projectId, query, { regex = false, caseSensitive = false } = {}) => {
  const { data, error } = await supabase
    .from('project_files')
    .select('id, file_path, filename, content, language')
    .eq('project_id', projectId)
    .eq('file_type', 'file');

  if (error) throw error;

  return (data || []).reduce((acc, file) => {
    const flags = caseSensitive ? 'g' : 'gi';
    let pattern;
    try {
      pattern = regex ? new RegExp(query, flags) : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } catch {
      pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    }

    const matches = [];
    const lines = (file.content || '').split('\n');
    lines.forEach((line, idx) => {
      if (pattern.test(line)) {
        matches.push({ lineNumber: idx + 1, lineContent: line.trim() });
        pattern.lastIndex = 0;
      }
    });

    const nameMatch = pattern.test(file.filename);
    pattern.lastIndex = 0;

    if (matches.length > 0 || nameMatch) {
      acc.push({ ...file, matches, nameMatch });
    }
    return acc;
  }, []);
};
