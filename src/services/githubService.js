/**
 * githubService.js — GitHub API Service Layer for GitHubHub
 * 
 * All GitHub REST API calls with in-memory caching (5-min TTL).
 * Supports optional GitHub PAT for higher rate limits.
 */

// ─── Config ──────────────────────────────────────────────────────────────────
let githubToken = import.meta.env.VITE_GITHUB_TOKEN || "";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

export const setGitHubToken = (token) => { githubToken = token; };
export const getGitHubToken = () => githubToken;

// ─── Internal Helpers ────────────────────────────────────────────────────────
const headers = () => {
  const h = { Accept: "application/vnd.github.v3+json" };
  if (githubToken) h.Authorization = `token ${githubToken}`;
  return h;
};

const cached = (key) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, ts: Date.now() });
  return data;
};

const ghFetch = async (url) => {
  const hit = cached(url);
  if (hit) return hit;

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API ${res.status}`);
  }
  const data = await res.json();
  return setCache(url, data);
};

// ─── Public: Trending / Search ───────────────────────────────────────────────
const TOPIC_QUERIES = {
  "AI/ML": "artificial-intelligence OR machine-learning",
  "GenAI": "generative-ai OR large-language-model OR llm",
  "LLM": "llm OR large-language-model OR chatgpt",
  "RAG": "retrieval-augmented-generation OR rag",
  "Agents": "ai-agents OR autonomous-agents OR multi-agent",
  "Fine-tuning": "fine-tuning OR lora OR qlora",
  "MLOps": "mlops OR model-deployment OR ml-pipeline",
  "MCP": "model-context-protocol OR mcp-server",
};

/**
 * Search trending/popular repos using GitHub Search API
 * @param {Object} opts
 * @param {string} opts.topic - Key from TOPIC_QUERIES or custom query
 * @param {string} opts.language - e.g. "python", "" for all
 * @param {string} opts.since - "daily"|"weekly"|"monthly"
 * @param {number} opts.minStars - minimum stars filter
 * @param {number} opts.page - pagination
 */
export const fetchTrendingRepos = async ({ topic = "AI/ML", language = "", since = "weekly", minStars = 10, page = 1 } = {}) => {
  const dateMap = { daily: 1, weekly: 7, monthly: 30 };
  const days = dateMap[since] || 7;
  const dateThreshold = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];

  const topicQ = TOPIC_QUERIES[topic] || topic;
  let q = `${topicQ} stars:>=${minStars} pushed:>=${dateThreshold}`;
  if (language) q += ` language:${language}`;

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=20&page=${page}`;
  const data = await ghFetch(url);
  return data.items || [];
};

export const getAvailableTopics = () => Object.keys(TOPIC_QUERIES);

// ─── Public: Repo Details ────────────────────────────────────────────────────
export const fetchRepoDetails = async (owner, repo) => {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
};

// ─── Public: Repo Tree ───────────────────────────────────────────────────────
export const fetchRepoTree = async (owner, repo, branch = "main") => {
  try {
    return await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  } catch {
    // Fallback to "master" branch
    return ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
  }
};

// ─── Public: File Content ────────────────────────────────────────────────────
export const fetchFileContent = async (owner, repo, path) => {
  const data = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
  if (data.content) {
    try {
      return { ...data, decodedContent: atob(data.content) };
    } catch {
      return { ...data, decodedContent: "[Binary file — cannot display]" };
    }
  }
  return data;
};

// ─── Public: README ──────────────────────────────────────────────────────────
export const fetchReadme = async (owner, repo) => {
  const data = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
  if (data.content) {
    try {
      return { ...data, decodedContent: atob(data.content) };
    } catch {
      return { ...data, decodedContent: "" };
    }
  }
  return data;
};

// ─── Public: User Profile ────────────────────────────────────────────────────
export const fetchUserProfile = async (username) => {
  return ghFetch(`https://api.github.com/users/${username}`);
};

// ─── Public: User Events (recent activity) ───────────────────────────────────
export const fetchUserEvents = async (username, page = 1) => {
  return ghFetch(`https://api.github.com/users/${username}/events/public?per_page=30&page=${page}`);
};

// ─── Public: User Repos ──────────────────────────────────────────────────────
export const fetchUserRepos = async (username) => {
  return ghFetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
};

// ─── Public: Contributors ────────────────────────────────────────────────────
export const fetchContributors = async (owner, repo) => {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`);
};

// ─── Public: Languages ──────────────────────────────────────────────────────
export const fetchLanguages = async (owner, repo) => {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
};

// ─── Public: Repo Health Score ───────────────────────────────────────────────
export const computeHealthScore = (repoData) => {
  if (!repoData) return { score: 0, breakdown: {} };

  let score = 0;
  const breakdown = {};

  // 1. Recency of last push (30 pts)
  const daysSincePush = (Date.now() - new Date(repoData.pushed_at).getTime()) / 86400000;
  const recency = daysSincePush < 1 ? 30 : daysSincePush < 7 ? 25 : daysSincePush < 30 ? 20 : daysSincePush < 90 ? 12 : daysSincePush < 365 ? 5 : 0;
  breakdown.recency = recency;
  score += recency;

  // 2. Issue responsiveness (20 pts) — proxy: low open issues relative to size
  const issueRatio = repoData.open_issues_count / Math.max(repoData.stargazers_count, 1);
  const issueScore = issueRatio < 0.01 ? 20 : issueRatio < 0.05 ? 15 : issueRatio < 0.1 ? 10 : 5;
  breakdown.issues = issueScore;
  score += issueScore;

  // 3. Documentation (20 pts) — has description + has wiki or homepage
  let docScore = 0;
  if (repoData.description) docScore += 8;
  if (repoData.homepage) docScore += 6;
  if (repoData.has_wiki) docScore += 3;
  if (repoData.license) docScore += 3;
  breakdown.docs = Math.min(docScore, 20);
  score += breakdown.docs;

  // 4. Stars momentum (15 pts)
  const stars = repoData.stargazers_count;
  const starScore = stars > 10000 ? 15 : stars > 1000 ? 12 : stars > 100 ? 9 : stars > 10 ? 5 : 2;
  breakdown.stars = starScore;
  score += starScore;

  // 5. Contributor diversity (15 pts) — proxy: forks as indicator
  const forks = repoData.forks_count;
  const forkScore = forks > 1000 ? 15 : forks > 100 ? 12 : forks > 10 ? 8 : forks > 0 ? 4 : 1;
  breakdown.contributors = forkScore;
  score += forkScore;

  return { score: Math.min(score, 100), breakdown };
};

// ─── Utility: Parse GitHub URL ───────────────────────────────────────────────
export const parseGitHubUrl = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
};

// ─── Utility: Format number ─────────────────────────────────────────────────
export const formatCount = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
};

// ─── Utility: Relative time ──────────────────────────────────────────────────
export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

// ─── Utility: Language colors ────────────────────────────────────────────────
export const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", Ruby: "#701516",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  Shell: "#89e051", HTML: "#e34c26", CSS: "#563d7c",
  Jupyter: "#DA5B0B", Dockerfile: "#384d54", Makefile: "#427819",
};

// ─── Utility: File extension → language ──────────────────────────────────────
export const EXT_LANG = {
  ".js": "javascript", ".jsx": "javascript", ".ts": "typescript", ".tsx": "typescript",
  ".py": "python", ".rs": "rust", ".go": "go", ".java": "java",
  ".cpp": "cpp", ".c": "c", ".rb": "ruby", ".swift": "swift",
  ".kt": "kotlin", ".dart": "dart", ".sh": "bash", ".bash": "bash",
  ".html": "html", ".css": "css", ".json": "json", ".yaml": "yaml",
  ".yml": "yaml", ".md": "markdown", ".sql": "sql", ".toml": "toml",
  ".xml": "xml", ".dockerfile": "dockerfile",
};

export const FILE_COLORS = {
  ".py": "#3572A5", ".js": "#f1e05a", ".jsx": "#f1e05a",
  ".ts": "#3178c6", ".tsx": "#3178c6", ".md": "#00cc88",
  ".json": "#a0a0a0", ".yaml": "#cb171e", ".yml": "#cb171e",
  ".toml": "#9c4221", ".rs": "#dea584", ".go": "#00ADD8",
  ".html": "#e34c26", ".css": "#563d7c", ".sh": "#89e051",
};
