/**
 * githubIDEService.js — GitHub Write Operations for Cloud IDE
 *
 * Extends the read-only githubService.js with write operations:
 * push files, create repos, import repos into projects.
 */

import { saveFile } from './projectService';

// GitHub API base
const API = 'https://api.github.com';

// ─── Auth Headers ─────────────────────────────────────────────────────────────

const authHeaders = (token) => ({
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `token ${token}` } : {}),
});

const ghRequest = async (method, path, body, token) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: authHeaders(token),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `GitHub API ${res.status}: ${path}`);
  return data;
};

// ─── Read (Authenticated) ─────────────────────────────────────────────────────

/**
 * Get repos for the authenticated user (includes private repos).
 */
export const getUserReposAuthenticated = async (token, page = 1) => {
  return ghRequest('GET', `/user/repos?sort=updated&per_page=50&page=${page}&type=all`, null, token);
};

/**
 * Get the SHA of a file (required before updating via Contents API).
 */
export const getFileSHA = async (owner, repo, branch, filePath, token) => {
  try {
    const data = await ghRequest('GET', `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, null, token);
    return data.sha || null;
  } catch {
    return null; // File doesn't exist yet
  }
};

/**
 * Get repository branches.
 */
export const getRepoBranches = async (owner, repo, token) => {
  return ghRequest('GET', `/repos/${owner}/${repo}/branches?per_page=50`, null, token);
};

/**
 * Get the full file tree for a repo branch.
 */
export const getRepoTree = async (owner, repo, branch, token) => {
  let data;
  try {
    data = await ghRequest('GET', `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, null, token);
  } catch {
    data = await ghRequest('GET', `/repos/${owner}/${repo}/git/trees/master?recursive=1`, null, token);
  }
  return data.tree || [];
};

/**
 * Get a single file's content from GitHub.
 */
export const getFileContent = async (owner, repo, filePath, branch, token) => {
  const data = await ghRequest('GET', `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, null, token);
  if (data.content) {
    try {
      return atob(data.content);
    } catch {
      return '[Binary file — cannot display]';
    }
  }
  return '';
};

// ─── Write Operations ─────────────────────────────────────────────────────────

/**
 * Push (create or update) a single file to GitHub via Contents API.
 *
 * @param {string} owner      - GitHub repo owner
 * @param {string} repo       - Repository name
 * @param {string} branch     - Target branch
 * @param {string} filePath   - File path in repo (e.g. src/main.py)
 * @param {string} content    - File content (plain text)
 * @param {string} message    - Commit message
 * @param {string} token      - GitHub PAT
 * @returns {object}          - Commit data from GitHub API
 */
export const pushFileToGitHub = async (owner, repo, branch, filePath, content, message, token) => {
  // Get existing SHA (needed for updates)
  const sha = await getFileSHA(owner, repo, branch, filePath, token);

  // Encode content to base64
  const encoded = btoa(unescape(encodeURIComponent(content)));

  const body = {
    message: message || `Update ${filePath}`,
    content: encoded,
    branch,
    ...(sha ? { sha } : {}),
  };

  return ghRequest('PUT', `/repos/${owner}/${repo}/contents/${filePath}`, body, token);
};

/**
 * Push multiple files as a series of commits.
 * Returns array of results per file.
 */
export const pushFilesToGitHub = async (owner, repo, branch, files, message, token, onProgress) => {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const { filePath, content } = files[i];
    try {
      const result = await pushFileToGitHub(owner, repo, branch, filePath, content, message, token);
      results.push({ filePath, success: true, sha: result.content?.sha });
    } catch (err) {
      results.push({ filePath, success: false, error: err.message });
    }
    if (onProgress) onProgress(i + 1, files.length);
  }
  return results;
};

/**
 * Create a new GitHub repository.
 */
export const createGitHubRepo = async ({ name, description = '', isPrivate = false, autoInit = true }, token) => {
  return ghRequest('POST', '/user/repos', {
    name,
    description,
    private: isPrivate,
    auto_init: autoInit,
  }, token);
};

/**
 * Create a new branch from an existing branch.
 */
export const createBranch = async (owner, repo, newBranch, fromBranch, token) => {
  // Get SHA of the source branch HEAD
  const ref = await ghRequest('GET', `/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`, null, token);
  const sha = ref.object.sha;
  return ghRequest('POST', `/repos/${owner}/${repo}/git/refs`, {
    ref: `refs/heads/${newBranch}`,
    sha,
  }, token);
};

// ─── Import Repository ────────────────────────────────────────────────────────

/**
 * Import a GitHub repository into a Supabase project.
 * Walks the tree, fetches each file's content, and saves to project_files.
 *
 * @param {object} params
 * @param {string} params.owner       - GitHub repo owner
 * @param {string} params.repo        - Repository name
 * @param {string} params.branch      - Branch to import
 * @param {string} params.projectId   - Target Supabase project ID
 * @param {string} params.token       - GitHub PAT
 * @param {function} params.onProgress - (done, total, currentFile) => void
 * @param {function} params.onError    - (filePath, error) => void
 */
export const importRepoToProject = async ({
  owner,
  repo,
  branch = 'main',
  projectId,
  token,
  onProgress,
  onError,
}) => {
  // Get full file tree
  const tree = await getRepoTree(owner, repo, branch, token);
  const files = tree.filter(item => item.type === 'blob');
  const folders = tree.filter(item => item.type === 'tree');

  const total = files.length;
  let done = 0;

  // Skip files that are too large or binary
  const SKIP_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp',
    '.mp4', '.mp3', '.woff', '.woff2', '.ttf', '.eot', '.zip', '.tar', '.gz',
    '.pyc', '.pyo', '.class', '.o', '.so', '.dylib', '.dll', '.exe'];

  const MAX_SIZE = 1024 * 1024; // 1MB

  // Import each file
  for (const file of files) {
    const filePath = '/' + file.path;
    const ext = '.' + (file.path.split('.').pop() || '').toLowerCase();

    if (SKIP_EXTENSIONS.includes(ext) || file.size > MAX_SIZE) {
      done++;
      if (onProgress) onProgress(done, total, file.path);
      continue;
    }

    try {
      const content = await getFileContent(owner, repo, file.path, branch, token);
      await saveFile(projectId, filePath, content);
    } catch (err) {
      if (onError) onError(file.path, err);
    }

    done++;
    if (onProgress) onProgress(done, total, file.path);

    // Rate limit: GitHub API allows ~5000 requests/hour for authenticated users
    // Add small delay every 50 files to be safe
    if (done % 50 === 0) await sleep(200);
  }

  return { imported: done, total };
};

// ─── Utility ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Parse a GitHub URL into owner/repo.
 */
export const parseGitHubUrl = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
};

/**
 * Validate that a token has the required scopes by checking /user.
 */
export const validateToken = async (token) => {
  try {
    const user = await ghRequest('GET', '/user', null, token);
    return { valid: true, login: user.login, avatar: user.avatar_url };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};
