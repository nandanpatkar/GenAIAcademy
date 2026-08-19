import React from "react";
import Icon from "../icons";
import { MODES, profile, streak, entitlement, daily, tierProgress } from "../data";
import { avatarFor } from "../avatars";

const RAIL = [
  { id: "career", label: "Career Mode", note: "Level up run by run", icon: "route" },
  { id: "duo", label: "Duo", note: "Shared goals & streak", icon: "handshake" },
  { id: "friends", label: "Friends", note: "Challenge your friends", icon: "group" },
];

const PRO_FEATURES = [
  "Unlimited ranked matches",
  "Skip-ahead career — every level unlocked",
  "Detailed AI feedback & complexity analysis",
  "Dream mode: every question from every company",
  "Full match history, replays & analytics",
];

const MODE_TARGET = { "Daily Challenge": "daily", Dream: "dream", "Against Time": "career" };

export default function ArenaView({ onNavigate }) {
  const stats = profile.stats ?? {};
  const xp = stats.xp ?? 0;
  const { tier, percentage, next } = tierProgress(xp);
  const played = (stats.wins ?? 0) + (stats.losses ?? 0) + (stats.draws ?? 0);
  const winRate = played ? Math.round(((stats.wins ?? 0) / played) * 100) : 0;

  return (
    <div className="aw-page aw-arena">
      <aside className="aw-rail">
        <section className="aw-card aw-profile">
          <span className="aw-avatar"><img src={avatarFor(profile.avatar)} alt="" /></span>
          <h2>{profile.username}</h2>
          <p className="aw-tier">{tier.name}</p>

          <div className="aw-xp">
            <div className="aw-xp-head"><span>XP Progress</span><span>{percentage}%</span></div>
            <div className="aw-bar"><span style={{ width: `${percentage}%` }} /></div>
            <div className="aw-xp-head aw-xp-foot">
              <span>{xp} XP</span>{next && <span>{next} XP</span>}
            </div>
          </div>

          <div className="aw-stat-row">
            <div><span><Icon name="social_leaderboard" size={12} /> Rating</span><strong>{stats.rating ?? 0}</strong></div>
            <div><span><Icon name="emoji_events" size={12} /> Win %</span><strong>{winRate}%</strong></div>
            <div><span><Icon name="local_fire_department" size={12} /> Streak</span><strong>{streak.current ?? 0}</strong></div>
          </div>
        </section>

        <section className="aw-card aw-rail-links">
          {RAIL.map((link) => (
            <button key={link.id} type="button" onClick={() => onNavigate(link.id === "career" ? "career" : "profile")}>
              <span className="aw-rail-icon"><Icon name={link.icon} size={19} /></span>
              <span className="aw-rail-copy"><strong>{link.label}</strong><small>{link.note}</small></span>
              <Icon name="chevron_right" size={17} />
            </button>
          ))}
        </section>

        <section className="aw-card aw-placement">
          <span className="aw-gold-kicker"><Icon name="workspace_premium" size={15} /> Placement Chance</span>
          <p className="aw-placement-lead">Finish in the top 20 and we'll connect you directly with companies' HR.</p>
          <p className="aw-muted-sm">A direct interview opportunity — company revealed soon.</p>
        </section>
      </aside>

      <div className="aw-arena-main">
        <header className="aw-band-head aw-arena-head">
          <div>
            <span className="aw-kicker aw-jp">戦いを選べ</span>
            <h1>Choose Your Battle</h1>
            <p>Select a game mode to start coding.</p>
          </div>
        </header>

        <button type="button" className="aw-daily-card" onClick={() => onNavigate("daily")}>
          <span className="aw-daily-top">
            <span className="aw-daily-label"><Icon name="local_fire_department" size={15} /> Today's Challenge</span>
            <span className="aw-daily-badge">Streak open</span>
          </span>
          <strong>Solve once. Keep the fire alive.</strong>
          <span className="aw-muted-sm">Same problem for everyone today. One clean run keeps your daily streak moving.</span>
          <span className="aw-daily-cta">Enter Daily <Icon name="chevron_right" size={17} /></span>
          {daily.problem && <span className="aw-daily-problem">{daily.problem.title} · {daily.problem.difficulty}</span>}
        </button>

        <div className="aw-mode-grid">
          {MODES.map((mode) => {
            const target = MODE_TARGET[mode.title];
            return (
              <button
                key={mode.title}
                type="button"
                className={`aw-mode${mode.live ? "" : " is-soon"}`}
                onClick={() => target && onNavigate(target)}
                disabled={!mode.live}
              >
                <span className="aw-mode-icon"><Icon name={mode.icon} size={21} /></span>
                <span className="aw-mode-meta">{mode.live ? "Live" : "Coming Soon"}</span>
                <strong>{mode.title}</strong>
                <small>{mode.description}</small>
              </button>
            );
          })}
        </div>

        <section className="aw-card aw-pro">
          <div className="aw-pro-head">
            <span className="aw-gold-kicker"><Icon name="workspace_premium" size={15} /> AlgoWars Pro</span>
            <span className="aw-pro-badge">
              {entitlement.hasEntitlement ? (entitlement.isTrial ? "Trial active" : "Active") : "Free"}
            </span>
          </div>
          <p className="aw-muted-sm">
            Free players get 10 ranked matches per day. Pro removes the cap and unlocks the whole campaign.
          </p>
          <ul className="aw-pro-list">
            {PRO_FEATURES.map((f) => <li key={f}><Icon name="check" size={14} /> {f}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
