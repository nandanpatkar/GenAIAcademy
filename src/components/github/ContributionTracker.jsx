import { useState, useEffect, useMemo } from "react";
import { User, Loader2, GitPullRequest, GitCommit, Star, GitFork, Award, Flame, Target, BookOpen, Trophy, Zap, ExternalLink, Search } from "lucide-react";
import { fetchUserProfile, fetchUserEvents, fetchUserRepos, timeAgo, LANG_COLORS } from "../../services/githubService";

const BADGES = [
  { id: "active", icon: <Flame size={16}/>, label: "Active Contributor", desc: "5+ commits this week", color: "#f97316", check: (s) => s.commitsThisWeek >= 5 },
  { id: "pr", icon: <GitPullRequest size={16}/>, label: "PR Machine", desc: "5+ PRs this month", color: "#8b5cf6", check: (s) => s.prsThisMonth >= 5 },
  { id: "stars", icon: <Star size={16}/>, label: "Star Collector", desc: "10+ starred repos", color: "#eab308", check: (s) => s.totalStars >= 10 },
  { id: "poly", icon: <Zap size={16}/>, label: "Polyglot", desc: "Repos in 3+ languages", color: "#06b6d4", check: (s) => s.languages >= 3 },
  { id: "oss", icon: <BookOpen size={16}/>, label: "Open Source", desc: "Contributed to other repos", color: "#10b981", check: (s) => s.ossContributions > 0 },
  { id: "streak", icon: <Trophy size={16}/>, label: "Streak Master", desc: "7-day commit streak", color: "#ef4444", check: (s) => s.longestStreak >= 7 },
];

function ContributionGrid({ events }) {
  const grid = useMemo(() => {
    const days = {};
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      days[d.toISOString().split("T")[0]] = 0;
    }
    for (const ev of events) {
      if (ev.type === "PushEvent") {
        const day = ev.created_at.split("T")[0];
        if (days[day] !== undefined) days[day] += (ev.payload?.commits?.length || 1);
      }
    }
    return Object.entries(days).reverse();
  }, [events]);

  const maxCount = Math.max(1, ...grid.map(([,c]) => c));

  return (
    <div className="gh-contrib-grid">
      {grid.map(([date, count]) => {
        const intensity = count === 0 ? 0 : Math.ceil((count / maxCount) * 4);
        return <div key={date} className={`gh-contrib-cell level-${intensity}`} title={`${date}: ${count} contributions`} />;
      })}
    </div>
  );
}

export default function ContributionTracker({ githubUsername, onSetUsername }) {
  const [username, setUsername] = useState(githubUsername || "");
  const [inputVal, setInputVal] = useState(githubUsername || "");
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (githubUsername) { setUsername(githubUsername); setInputVal(githubUsername); } }, [githubUsername]);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const [p, e, r] = await Promise.all([fetchUserProfile(username), fetchUserEvents(username), fetchUserRepos(username)]);
        setProfile(p); setEvents(e); setRepos(r);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, [username]);

  const handleConnect = () => { if (inputVal.trim()) { setUsername(inputVal.trim()); onSetUsername(inputVal.trim()); } };

  const stats = useMemo(() => {
    if (!events.length) return {};
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;
    const monthAgo = now - 30 * 86400000;
    let commitsThisWeek = 0, prsThisMonth = 0, ossContributions = 0;

    const commitDays = new Set();
    for (const ev of events) {
      const t = new Date(ev.created_at).getTime();
      if (ev.type === "PushEvent") {
        if (t >= weekAgo) commitsThisWeek += (ev.payload?.commits?.length || 1);
        commitDays.add(ev.created_at.split("T")[0]);
      }
      if (ev.type === "PullRequestEvent" && t >= monthAgo) prsThisMonth++;
      if (ev.type === "PullRequestEvent" && ev.repo?.name && profile && !ev.repo.name.startsWith(profile.login + "/")) ossContributions++;
    }

    const sortedDays = [...commitDays].sort();
    let streak = 0, maxStreak = 0, prev = null;
    for (const d of sortedDays) {
      const cur = new Date(d);
      if (prev && (cur - prev) / 86400000 === 1) streak++;
      else streak = 1;
      maxStreak = Math.max(maxStreak, streak);
      prev = cur;
    }

    const langSet = new Set(repos.map(r => r.language).filter(Boolean));
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

    return { commitsThisWeek, prsThisMonth, ossContributions, longestStreak: maxStreak, languages: langSet.size, totalStars };
  }, [events, repos, profile]);

  const recentActivity = events.slice(0, 12);

  const eventIcon = (type) => {
    if (type === "PushEvent") return <GitCommit size={13} />;
    if (type === "PullRequestEvent") return <GitPullRequest size={13} />;
    if (type === "WatchEvent") return <Star size={13} />;
    if (type === "ForkEvent") return <GitFork size={13} />;
    return <Zap size={13} />;
  };

  const eventLabel = (ev) => {
    if (ev.type === "PushEvent") return `Pushed ${ev.payload?.commits?.length || 1} commit(s)`;
    if (ev.type === "PullRequestEvent") return `${ev.payload?.action} PR`;
    if (ev.type === "WatchEvent") return "Starred";
    if (ev.type === "ForkEvent") return "Forked";
    if (ev.type === "CreateEvent") return `Created ${ev.payload?.ref_type || "ref"}`;
    if (ev.type === "IssuesEvent") return `${ev.payload?.action} issue`;
    return ev.type.replace("Event", "");
  };

  if (!username && !githubUsername) {
    return (
      <div className="gh-profile-connect">
        <div className="gh-profile-connect-card">
          <User size={48} style={{ opacity: 0.2 }} />
          <h3>Connect Your GitHub</h3>
          <p>Enter your GitHub username to view your contribution stats and earn badges.</p>
          <div className="gh-profile-connect-input">
            <input placeholder="GitHub username" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleConnect(); }} className="gh-connect-input" />
            <button className="gh-connect-btn" onClick={handleConnect} disabled={!inputVal.trim()}>Connect</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="gh-center-msg" style={{ flex: 1 }}><Loader2 size={28} className="gh-spin" /><span>Loading profile…</span></div>;
  if (error) return <div className="gh-center-msg gh-error" style={{ flex: 1 }}>⚠️ {error}</div>;
  if (!profile) return null;

  return (
    <div className="gh-profile">
      {/* Profile Card */}
      <div className="gh-profile-card">
        <img src={profile.avatar_url} alt="" className="gh-profile-avatar" />
        <div className="gh-profile-info">
          <div className="gh-profile-name">{profile.name || profile.login}</div>
          <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="gh-profile-handle">@{profile.login} <ExternalLink size={10} /></a>
          {profile.bio && <div className="gh-profile-bio">{profile.bio}</div>}
        </div>
        <div className="gh-profile-stats-row">
          <div className="gh-profile-stat"><strong>{profile.public_repos}</strong><span>Repos</span></div>
          <div className="gh-profile-stat"><strong>{profile.followers}</strong><span>Followers</span></div>
          <div className="gh-profile-stat"><strong>{profile.following}</strong><span>Following</span></div>
        </div>
      </div>

      {/* Change username */}
      <div className="gh-change-user">
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} className="gh-connect-input small" placeholder="Change username" onKeyDown={e => { if (e.key === "Enter") handleConnect(); }} />
        <button className="gh-connect-btn small" onClick={handleConnect}>Update</button>
      </div>

      {/* Badges */}
      <div className="gh-badges-section">
        <h4 className="gh-section-title"><Award size={14} /> Achievements</h4>
        <div className="gh-badges-grid">
          {BADGES.map(b => {
            const earned = b.check(stats);
            return (
              <div key={b.id} className={`gh-badge ${earned ? "earned" : "locked"}`} style={{ "--badge-color": b.color }}>
                <div className="gh-badge-icon">{b.icon}</div>
                <div className="gh-badge-label">{b.label}</div>
                <div className="gh-badge-desc">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribution Grid */}
      <div className="gh-contrib-section">
        <h4 className="gh-section-title"><GitCommit size={14} /> Contribution Activity</h4>
        <ContributionGrid events={events} />
        <div className="gh-contrib-legend">
          <span>Less</span>
          {[0,1,2,3,4].map(l => <div key={l} className={`gh-contrib-cell level-${l} legend`} />)}
          <span>More</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="gh-activity-section">
        <h4 className="gh-section-title"><Zap size={14} /> Recent Activity</h4>
        <div className="gh-activity-list">
          {recentActivity.map((ev, i) => (
            <div key={i} className="gh-activity-item">
              <div className="gh-activity-icon">{eventIcon(ev.type)}</div>
              <div className="gh-activity-content">
                <span className="gh-activity-label">{eventLabel(ev)}</span>
                <a href={`https://github.com/${ev.repo?.name}`} target="_blank" rel="noopener noreferrer" className="gh-activity-repo">{ev.repo?.name}</a>
              </div>
              <span className="gh-activity-time">{timeAgo(ev.created_at)}</span>
            </div>
          ))}
          {recentActivity.length === 0 && <div className="gh-center-msg">No recent activity</div>}
        </div>
      </div>
    </div>
  );
}
