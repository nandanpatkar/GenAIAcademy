import { getGitHubToken } from "./githubService";

export const AGENT_LIBRARY_STORAGE_KEY = "genai_agent_library_v1";
export const AGENT_LIBRARY_SOURCE_KEY = "genai_agent_library_skill_source_v1";
export const DEFAULT_SKILLS_SOURCE = "https://github.com/sickn33/agentic-awesome-skills/tree/main/skills";
export const EXCLUDED_SKILL_NAMES = [
  "accesslint-diff",
  "accesslint-audit",
  "accessibility-compliance-accessibility-audit",
  "acceptance-orchestrator",
  "ab-testing",
  "ab-test-setup",
  "3d-web-experience",
  "2slides-ppt-generator",
  "andruia-niche-intelligence",
  "andruia-skill-smith",
  "007",
  "andruia-consultant",
  "00-andruia-consultant"
];

export const EMPTY_AGENT_LIBRARY = {
  schemaVersion: 1,
  prompts: [],
  skills: [],
  mcps: []
};

const text = (value) => String(value ?? "").trim();
const unique = (values) => [...new Set(values.filter(Boolean))];
const id = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const normalizeSkillName = (value) => text(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function isExcludedSkill(skill) {
  const name = normalizeSkillName(skill?.name);
  const path = skill?.source?.files?.[0] || "";
  const folder = normalizeSkillName(path.split("/").filter(Boolean).slice(-2, -1)[0]);
  return EXCLUDED_SKILL_NAMES.includes(name) || EXCLUDED_SKILL_NAMES.includes(folder);
}

export function filterAllowedSkills(skills) {
  return (Array.isArray(skills) ? skills : []).filter((skill) => !isExcludedSkill(skill));
}

export const makeId = id;

export function loadAgentLibrary() {
  if (typeof window === "undefined") return EMPTY_AGENT_LIBRARY;
  try {
    const stored = JSON.parse(window.localStorage.getItem(AGENT_LIBRARY_STORAGE_KEY) || "null");
    if (!stored || typeof stored !== "object") return EMPTY_AGENT_LIBRARY;
    return {
      schemaVersion: 1,
      prompts: Array.isArray(stored.prompts) ? stored.prompts : [],
      skills: filterAllowedSkills(stored.skills),
      mcps: Array.isArray(stored.mcps) ? stored.mcps : []
    };
  } catch {
    return EMPTY_AGENT_LIBRARY;
  }
}

export function saveAgentLibrary(library) {
  if (typeof window === "undefined") return true;

  // A large GitHub collection can contain hundreds of full SKILL.md files.
  // Keep the searchable index in localStorage, but keep skill bodies in the
  // active React session so localStorage never becomes the size bottleneck.
  const compact = {
    ...library,
    skills: library.skills.map(({ content: _content, ...skill }) => ({ ...skill, content: "" }))
  };

  try {
    window.localStorage.setItem(AGENT_LIBRARY_STORAGE_KEY, JSON.stringify(compact));
    return true;
  } catch {
    // Replacing a previously oversized value may itself fail until the old
    // value is removed. Only remove this feature's own key, never user data.
    try {
      window.localStorage.removeItem(AGENT_LIBRARY_STORAGE_KEY);
      window.localStorage.setItem(AGENT_LIBRARY_STORAGE_KEY, JSON.stringify(compact));
      return true;
    } catch {
      // The library continues to work in memory for this session. Persistence
      // is best-effort and must never take down the Agent Library UI.
      return false;
    }
  }
}

export function loadSavedSkillSource() {
  if (typeof window === "undefined") return DEFAULT_SKILLS_SOURCE;
  return window.localStorage.getItem(AGENT_LIBRARY_SOURCE_KEY) || DEFAULT_SKILLS_SOURCE;
}

export function saveSkillSource(source) {
  if (typeof window !== "undefined") window.localStorage.setItem(AGENT_LIBRARY_SOURCE_KEY, source);
}

function githubHeaders() {
  const token = getGitHubToken();
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: githubHeaders() });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `GitHub returned ${response.status}`);
  return body;
}

async function fetchText(url, { raw = false } = {}) {
  // raw.githubusercontent.com rejects the browser preflight triggered by
  // Authorization. Public raw files do not need the token, so keep this
  // request CORS-simple and reserve auth headers for the GitHub API calls.
  const headers = raw ? { Accept: "text/plain" } : { ...githubHeaders(), Accept: "text/plain" };
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Could not read ${url} (${response.status})`);
  return response.text();
}

export function parseGitHubSkillSource(input) {
  try {
    const parsed = new URL(text(input));
    if (!["github.com", "www.github.com"].includes(parsed.hostname)) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const mode = parts[2] || "repo";
    const branch = mode === "tree" || mode === "blob" ? parts[3] : "";
    const path = mode === "tree" || mode === "blob" ? parts.slice(4).join("/") : "";
    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
      mode,
      branch,
      path,
      url: parsed.toString().replace(/\/$/, "")
    };
  } catch {
    return null;
  }
}

async function listContents(owner, repo, path, branch, files, visited = new Set()) {
  const key = `${owner}/${repo}/${branch}/${path}`;
  if (visited.has(key)) return;
  visited.add(key);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path ? `${path}?ref=${encodeURIComponent(branch)}` : `?ref=${encodeURIComponent(branch)}`}`;
  const entries = await fetchJson(url);
  if (!Array.isArray(entries)) return;
  for (const entry of entries) {
    if (entry.type === "file" && /(^|\/)SKILL\.md$/i.test(entry.path)) files.push(entry.path);
    if (entry.type === "dir") await listContents(owner, repo, entry.path, branch, files, visited);
  }
}

async function discoverSkillFiles(source) {
  const repo = await fetchJson(`https://api.github.com/repos/${source.owner}/${source.repo}`);
  const branch = source.branch || repo.default_branch;
  const prefix = source.path.replace(/^\/+|\/+$/g, "");

  if (source.mode === "blob") {
    if (!/SKILL\.md$/i.test(prefix)) throw new Error("Choose a SKILL.md file or a folder that contains skills.");
    return { branch, files: [prefix] };
  }

  try {
    const tree = await fetchJson(`https://api.github.com/repos/${source.owner}/${source.repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
    const files = (tree.tree || [])
      .filter((entry) => entry.type === "blob" && /(^|\/)SKILL\.md$/i.test(entry.path))
      .map((entry) => entry.path)
      .filter((path) => !prefix || path === prefix || path.startsWith(`${prefix}/`));
    if (!tree.truncated) return { branch, files };
  } catch {
    // The contents API below is slower but works for repositories with a large or truncated git tree.
  }

  const files = [];
  await listContents(source.owner, source.repo, prefix, branch, files);
  return { branch, files: unique(files).filter((path) => !prefix || path === prefix || path.startsWith(`${prefix}/`)) };
}

function parseFrontmatter(content) {
  const block = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!block) return {};
  const get = (key) => block[1].match(new RegExp(`(?:^|\\n)${key}:\\s*["']?([^"'\\n]+)`, "i"))?.[1]?.trim();
  return { name: get("name"), description: get("description") };
}

function skillNameFromPath(path) {
  const parts = path.split("/").filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] : parts[parts.length - 1].replace(/\.md$/i, "");
}

function skillDescription(content, name, source) {
  const frontmatter = parseFrontmatter(content);
  if (frontmatter.description) return frontmatter.description;
  const heading = content.match(/^#{1,2}\s+(.+)$/m)?.[1]?.trim();
  return heading || `${name} skill from ${source.owner}/${source.repo}`;
}

function skillTags(path, source) {
  const directoryParts = path.split("/").slice(0, -1).filter(Boolean);
  const skillDirectory = directoryParts[directoryParts.length - 1];
  return unique(["github", "skill", skillDirectory, source.owner]);
}

function skillRecord(content, path, source, branch) {
  const frontmatter = parseFrontmatter(content);
  const name = frontmatter.name || skillNameFromPath(path);
  const sourceUrl = `https://github.com/${source.owner}/${source.repo}/blob/${branch}/${path}`;
  const importedAt = new Date().toISOString();
  return {
    id: `skill-${source.owner}-${source.repo}-${path}`.replace(/[^a-z0-9-]/gi, "-").toLowerCase(),
    name,
    description: skillDescription(content, name, source),
    tags: skillTags(path, source),
    content,
    source: {
      label: `${source.owner}/${source.repo}/${path}`,
      url: sourceUrl,
      rootUrl: source.url,
      files: [path],
      importedAt,
      branch
    },
    createdAt: importedAt,
    updatedAt: importedAt
  };
}

export async function loadGitHubSkills(input) {
  const source = parseGitHubSkillSource(input);
  if (!source) throw new Error("Enter a valid GitHub repository, tree folder, or SKILL.md URL.");
  if (source.mode !== "repo" && source.mode !== "tree" && source.mode !== "blob") {
    throw new Error("Use a GitHub URL shaped like /tree/main/skills.");
  }

  const { branch, files } = await discoverSkillFiles(source);
  if (!files.length) throw new Error("No SKILL.md files were found under this GitHub path.");

  const skills = [];
  const failures = [];
  for (let index = 0; index < files.length; index += 8) {
    const batch = files.slice(index, index + 8);
    const results = await Promise.all(batch.map(async (path) => {
      try {
        const content = await fetchText(`https://raw.githubusercontent.com/${source.owner}/${source.repo}/${branch}/${path}`, { raw: true });
        return skillRecord(content, path, source, branch);
      } catch {
        failures.push(path);
        return null;
      }
    }));
    skills.push(...results.filter(Boolean));
  }

  if (!skills.length) throw new Error("GitHub listed skills, but none of the files could be read.");
  const allowedSkills = filterAllowedSkills(skills);
  return {
    source: { ...source, branch },
    skills: allowedSkills,
    filesDiscovered: files.length,
    filesExcluded: skills.length - allowedSkills.length,
    failures
  };
}

export function createManualRecord(kind, editor, existing = null) {
  const createdAt = existing?.createdAt || new Date().toISOString();
  const common = {
    id: existing?.id || id(kind === "skills" ? "skill" : "mcp"),
    name: text(editor.name),
    description: text(editor.description),
    tags: unique(text(editor.tags).split(",").map((tag) => tag.trim())),
    createdAt,
    updatedAt: new Date().toISOString(),
    source: existing?.source
  };

  if (kind === "prompts") {
    const versions = existing?.versions || [];
    return {
      ...common,
      versions: [...versions, {
        id: id("version"),
        number: (versions.at(-1)?.number || 0) + 1,
        content: editor.content,
        note: text(editor.note) || (existing ? "Updated prompt" : "Initial version"),
        createdAt: new Date().toISOString()
      }]
    };
  }

  return {
    ...common,
    content: editor.content,
    ...(kind === "mcps" ? {
      config: {
        name: text(editor.name),
        transport: editor.transport,
        command: text(editor.command),
        args: text(editor.args).split("\n").map((arg) => arg.trim()).filter(Boolean),
        url: text(editor.url),
        envVars: unique(text(editor.envVars).split(",").map((value) => value.trim()))
      }
    } : {})
  };
}

export function mcpConfigText(record) {
  const config = record?.config || {};
  const name = (config.name || record?.name || "server").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  const rows = [`[mcp_servers.${name}]`];
  if (config.transport === "http" && config.url) {
    rows.push(`url = ${JSON.stringify(config.url)}`);
    if (config.envVars?.length) rows.push(`bearer_token_env_var = ${JSON.stringify(config.envVars[0])}`);
  }
  if (config.transport !== "http" && config.command) {
    rows.push(`command = ${JSON.stringify(config.command)}`);
    if (config.args?.length) rows.push(`args = ${JSON.stringify(config.args)}`);
    if (config.envVars?.length) rows.push(`env_vars = ${JSON.stringify(config.envVars)}`);
  }
  return rows.join("\n");
}
