import { useState, useEffect, useCallback } from "react";
import { Loader2, Search, Star, GitFork, Eye, Users, Scale, Calendar, Activity, ExternalLink, Hash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { fetchRepoDetails, fetchReadme, fetchLanguages, computeHealthScore, parseGitHubUrl, formatCount, timeAgo, LANG_COLORS } from "../../services/githubService";

function HealthGauge({ score }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work";
  return (
    <div className="gh-health-gauge">
      <svg viewBox="0 0 120 120" width="100" height="100">
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg4)" strokeWidth="8" />
        <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${(score / 100) * 314} 314`}
          strokeLinecap="round" transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x="60" y="55" textAnchor="middle" fill={color} fontSize="28" fontWeight="800">{score}</text>
        <text x="60" y="72" textAnchor="middle" fill="var(--text3)" fontSize="10" fontWeight="600">{label}</text>
      </svg>
    </div>
  );
}

function LanguageBar({ languages }) {
  const total = Object.values(languages).reduce((s, v) => s + v, 0);
  if (!total) return null;
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  return (
    <div className="gh-lang-bar-section">
      <div className="gh-lang-bar">{sorted.map(([lang, bytes]) => (
        <div key={lang} className="gh-lang-segment" style={{ width: `${(bytes / total) * 100}%`, background: LANG_COLORS[lang] || "#666" }} title={`${lang}: ${((bytes / total) * 100).toFixed(1)}%`} />
      ))}</div>
      <div className="gh-lang-legend">{sorted.slice(0, 6).map(([lang, bytes]) => (
        <span key={lang} className="gh-lang-legend-item"><span className="gh-lang-dot" style={{ background: LANG_COLORS[lang] || "#666" }} />{lang} {((bytes / total) * 100).toFixed(1)}%</span>
      ))}</div>
    </div>
  );
}

export default function ReadmeViewer({ initialUrl }) {
  const [url, setUrl] = useState(initialUrl || "");
  const [repo, setRepo] = useState(null);
  const [readme, setReadme] = useState(null);
  const [langs, setLangs] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (initialUrl) setUrl(initialUrl); }, [initialUrl]);

  const load = useCallback(async (targetUrl) => {
    const u = targetUrl || url;
    const p = parseGitHubUrl(u);
    if (!p) { setError("Invalid GitHub URL"); return; }
    setLoading(true); setError(null);
    try {
      const [repoData, readmeData, langData] = await Promise.all([
        fetchRepoDetails(p.owner, p.repo),
        fetchReadme(p.owner, p.repo).catch(() => null),
        fetchLanguages(p.owner, p.repo).catch(() => ({})),
      ]);
      setRepo(repoData);
      setReadme(readmeData);
      setLangs(langData);
      setHealth(computeHealthScore(repoData));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [url]);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      load(initialUrl);
    }
  }, [initialUrl, load]);

  return (
    <div className="gh-readme-viewer">
      <div className="gh-explorer-input-bar">
        <Search size={16} style={{ color: "var(--text3)", flexShrink: 0 }} />
        <input className="gh-explorer-input" placeholder="Paste GitHub repo URL…" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === "Enter") load(); }} />
        <button className="gh-explore-btn" onClick={() => load()} disabled={loading || !url}>{loading ? <Loader2 size={14} className="gh-spin" /> : "Load"}</button>
      </div>
      {error && <div className="gh-error-msg">⚠️ {error}</div>}
      {loading && <div className="gh-center-msg" style={{ flex: 1 }}><Loader2 size={28} className="gh-spin" /><span>Loading repository…</span></div>}
      {repo && !loading && (
        <div className="gh-readme-body">
          {/* Health Sidebar */}
          <div className="gh-health-panel">
            <div className="gh-health-card">
              <h4 className="gh-section-title"><Activity size={14} /> Health Score</h4>
              {health && <HealthGauge score={health.score} />}
              {health && (
                <div className="gh-health-breakdown">
                  {Object.entries(health.breakdown).map(([k, v]) => (
                    <div key={k} className="gh-health-row">
                      <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                      <div className="gh-health-minibar"><div style={{ width: `${(v / 30) * 100}%`, background: "var(--neon)" }} /></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="gh-health-card">
              <h4 className="gh-section-title"><Star size={14} /> Stats</h4>
              <div className="gh-stats-grid">
                <div className="gh-stat-card"><Star size={16} /><div><strong>{formatCount(repo.stargazers_count)}</strong><span>Stars</span></div></div>
                <div className="gh-stat-card"><GitFork size={16} /><div><strong>{formatCount(repo.forks_count)}</strong><span>Forks</span></div></div>
                <div className="gh-stat-card"><Eye size={16} /><div><strong>{formatCount(repo.watchers_count)}</strong><span>Watchers</span></div></div>
                <div className="gh-stat-card"><Hash size={16} /><div><strong>{repo.open_issues_count}</strong><span>Issues</span></div></div>
                <div className="gh-stat-card"><Users size={16} /><div><strong>{repo.subscribers_count || "—"}</strong><span>Subscribers</span></div></div>
                <div className="gh-stat-card"><Calendar size={16} /><div><strong>{timeAgo(repo.pushed_at)}</strong><span>Last Push</span></div></div>
              </div>
            </div>
            {repo.license && <div className="gh-health-card mini"><Scale size={12} /> {repo.license.spdx_id || repo.license.name}</div>}
            {repo.topics && repo.topics.length > 0 && (
              <div className="gh-health-card"><h4 className="gh-section-title"><Hash size={14} /> Topics</h4>
                <div className="gh-trending-tags">{repo.topics.map(t => <span key={t} className="gh-tag">{t}</span>)}</div>
              </div>
            )}
            {langs && Object.keys(langs).length > 0 && (
              <div className="gh-health-card"><h4 className="gh-section-title">Languages</h4><LanguageBar languages={langs} /></div>
            )}
          </div>
          {/* README Content */}
          <div className="gh-readme-content">
            <div className="gh-readme-header-bar">
              <h3>{repo.full_name}</h3>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="gh-file-link"><ExternalLink size={12} /> View on GitHub</a>
            </div>
            {repo.description && <p className="gh-readme-desc">{repo.description}</p>}
            {readme?.decodedContent ? (
              <div className="gh-markdown-body readme">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter language={match[1]} style={oneDark} customStyle={{ borderRadius: 8, fontSize: 12 }} {...props}>{String(children).replace(/\n$/, "")}</SyntaxHighlighter>
                    ) : <code className={className} {...props}>{children}</code>;
                  }
                }}>{readme.decodedContent}</ReactMarkdown>
              </div>
            ) : <div className="gh-center-msg">No README found</div>}
          </div>
        </div>
      )}
      {!repo && !loading && !error && (
        <div className="gh-center-msg" style={{ flex: 1, paddingTop: 80 }}>
          <Activity size={48} style={{ opacity: 0.15 }} />
          <span style={{ fontSize: 15, fontWeight: 600 }}>README + Health Dashboard</span>
          <span style={{ fontSize: 12, opacity: 0.5 }}>Paste a repo URL to view its full README and health metrics</span>
        </div>
      )}
    </div>
  );
}
