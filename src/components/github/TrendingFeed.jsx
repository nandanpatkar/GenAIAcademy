import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Search, Star, GitFork, ExternalLink, Plus, Loader2, RefreshCw, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTrendingRepos, getAvailableTopics, formatCount, timeAgo, LANG_COLORS } from "../../services/githubService";

const LANGUAGES = ["", "python", "javascript", "typescript", "rust", "go", "java", "c++", "jupyter-notebook"];
const LANG_LABELS = { "": "All Languages", python: "Python", javascript: "JavaScript", typescript: "TypeScript", rust: "Rust", go: "Go", java: "Java", "c++": "C++", "jupyter-notebook": "Jupyter" };
const PERIODS = [
  { value: "daily", label: "Today" },
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function TrendingFeed({ onSaveRepo }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState("AI/ML");
  const [language, setLanguage] = useState("");
  const [since, setSince] = useState("weekly");
  const [minStars, setMinStars] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  const topics = getAvailableTopics();

  const loadRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchTrendingRepos({ topic, language, since, minStars });
      setRepos(items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [topic, language, since, minStars]);

  useEffect(() => { loadRepos(); }, [loadRepos]);

  const handleSave = (repo) => {
    const saved = {
      id: `github-${repo.id}`,
      url: repo.html_url,
      label: repo.full_name,
      description: repo.description || "",
      color: LANG_COLORS[repo.language] || "#0088ff",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      pinned: false,
      category: "",
      studyStatus: "to_study",
      order: 0,
      lastFetched: new Date().toISOString(),
    };
    onSaveRepo(saved);
    setSavedIds(prev => new Set([...prev, repo.id]));
  };

  return (
    <div className="gh-trending">
      {/* Topic Chips */}
      <div className="gh-trending-topics">
        {topics.map(t => (
          <button key={t} className={`gh-topic-chip ${topic === t ? "active" : ""}`} onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="gh-trending-controls">
        <div className="gh-period-tabs">
          {PERIODS.map(p => (
            <button key={p.value} className={`gh-period-btn ${since === p.value ? "active" : ""}`} onClick={() => setSince(p.value)}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="gh-filter-toggle" onClick={() => setShowFilters(v => !v)}>
            <Filter size={14} />
            {showFilters ? "Hide" : "Filters"}
          </button>
          <button className="gh-refresh-btn" onClick={loadRepos} disabled={loading}>
            <RefreshCw size={14} className={loading ? "gh-spin" : ""} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="gh-filter-bar"
          >
            <div className="gh-filter-group">
              <label className="gh-filter-label">Language</label>
              <select className="gh-select" value={language} onChange={e => setLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
              </select>
            </div>
            <div className="gh-filter-group">
              <label className="gh-filter-label">Min Stars: {minStars}</label>
              <input type="range" min={0} max={1000} step={10} value={minStars} onChange={e => setMinStars(Number(e.target.value))} className="gh-range" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="gh-trending-list">
        {loading ? (
          <div className="gh-center-msg">
            <Loader2 size={28} className="gh-spin" />
            <span>Searching GitHub…</span>
          </div>
        ) : error ? (
          <div className="gh-center-msg gh-error">
            <span>⚠️ {error}</span>
            <button className="gh-retry-btn" onClick={loadRepos}>Retry</button>
          </div>
        ) : repos.length === 0 ? (
          <div className="gh-center-msg">
            <TrendingUp size={32} style={{ opacity: 0.3 }} />
            <span>No repos found. Try different filters.</span>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {repos.map((repo, i) => (
              <motion.div 
                key={repo.id} 
                className="gh-trending-card"
                variants={cardVariants}
                whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <div className="gh-trending-rank">#{i + 1}</div>
                <div className="gh-trending-content">
                  <div className="gh-trending-header">
                    <img src={repo.owner?.avatar_url} alt="" className="gh-trending-avatar" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="gh-trending-name">
                        {repo.full_name}
                        <ExternalLink size={11} style={{ opacity: 0.4 }} />
                      </a>
                      <div className="gh-trending-desc">{repo.description || "No description"}</div>
                    </div>
                  </div>

                  <div className="gh-trending-meta">
                    {repo.language && (
                      <span className="gh-lang-badge">
                        <span className="gh-lang-dot" style={{ background: LANG_COLORS[repo.language] || "#888" }} />
                        {repo.language}
                      </span>
                    )}
                    <span className="gh-stat"><Star size={12} /> {formatCount(repo.stargazers_count)}</span>
                    <span className="gh-stat"><GitFork size={12} /> {formatCount(repo.forks_count)}</span>
                    <span className="gh-stat-dim">{timeAgo(repo.pushed_at)}</span>
                  </div>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="gh-trending-tags">
                      {repo.topics.slice(0, 5).map(t => (
                        <span key={t} className="gh-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className={`gh-save-btn ${savedIds.has(repo.id) ? "saved" : ""}`}
                  onClick={() => handleSave(repo)}
                  disabled={savedIds.has(repo.id)}
                >
                  {savedIds.has(repo.id) ? "✓ Saved" : <><Plus size={14} /> Save</>}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

