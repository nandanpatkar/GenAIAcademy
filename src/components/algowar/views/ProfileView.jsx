import React, { useState } from "react";
import Icon from "../icons";
import { profile, streak, entitlement, tierProgress } from "../data";
import { avatarFor } from "../avatars";
import { getProgress, setUnlockAll, resetAllProgress } from "../progress";
import { judgeStatus } from "../judge";

export default function ProfileView() {
  const [progress, setProgress] = useState(() => getProgress());
  const provider = judgeStatus();
  const s = profile.stats ?? {};
  const cleared = Object.keys(progress.levels).length;
  const { tier, percentage, next } = tierProgress(s.xp ?? 0);
  const played = (s.wins ?? 0) + (s.losses ?? 0) + (s.draws ?? 0);

  return (
    <div className="aw-page aw-profile-page">
      <section className="aw-card aw-profile-hero">
        <span className="aw-avatar lg"><img src={avatarFor(profile.avatar)} alt="" /></span>
        <div>
          <h1>{profile.username}</h1>
          <p className="aw-tier">{tier.name}</p>
          <p className="aw-muted-sm">Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="aw-xp">
          <div className="aw-xp-head"><span>XP Progress</span><span>{percentage}%</span></div>
          <div className="aw-bar"><span style={{ width: `${percentage}%` }} /></div>
          <div className="aw-xp-head aw-xp-foot"><span>{s.xp ?? 0} XP</span>{next && <span>{next} XP</span>}</div>
        </div>
      </section>

      <div className="aw-stat-grid">
        {[
          ["Rating", s.rating ?? 0, "social_leaderboard"],
          ["Matches", played, "swords"],
          ["Wins", s.wins ?? 0, "emoji_events"],
          ["Losses", s.losses ?? 0, "target"],
          ["Daily streak", streak.current ?? 0, "local_fire_department"],
          ["Best daily", streak.best ?? s.maxDailyStreak ?? 0, "military_tech"],
        ].map(([label, value, icon]) => (
          <article key={label} className="aw-card aw-stat-tile">
            <span><Icon name={icon} size={15} /> {label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <section className="aw-card aw-campaign-controls">
        <span className="aw-gold-kicker"><Icon name="route" size={15} /> Campaign</span>
        <div className="aw-toggle-row">
          <div>
            <strong>Unlock all levels</strong>
            <p className="aw-muted-sm">
              Skip-ahead access, the way Pro works on the live site — every chapter and level
              becomes playable in any order instead of unlocking in sequence.
            </p>
          </div>
          <button
            type="button"
            className={`aw-switch${progress.unlockAll ? " is-on" : ""}`}
            role="switch"
            aria-checked={progress.unlockAll}
            aria-label="Unlock all levels"
            onClick={() => setProgress(setUnlockAll(!progress.unlockAll))}
          >
            <span />
          </button>
        </div>
        <div className="aw-toggle-row">
          <div>
            <strong>Local progress</strong>
            <p className="aw-muted-sm">{cleared} {cleared === 1 ? "level" : "levels"} cleared · {progress.xp} XP · {progress.coins} coins earned in this mirror.</p>
          </div>
          <button type="button" className="aw-btn aw-btn-ghost" onClick={() => { resetAllProgress(); setProgress(getProgress()); }}>
            Reset all
          </button>
        </div>
      </section>

      <section className="aw-card">
        <span className="aw-gold-kicker"><Icon name="psychology" size={15} /> AI Judge</span>
        <div className="aw-toggle-row">
          <div>
            <strong>{provider.label}</strong>
            <p className="aw-muted-sm">
              {provider.configured
                ? "Configured — submissions are reviewed for correctness, complexity and an optimal approach."
                : provider.setupMessage}
            </p>
          </div>
          <span className={`aw-chip${provider.configured ? " is-good" : ""}`}>
            {provider.configured ? "Ready" : "Not configured"}
          </span>
        </div>
      </section>

      <section className="aw-card">
        <span className="aw-gold-kicker"><Icon name="workspace_premium" size={15} /> Subscription</span>
        <div className="aw-sub-grid">
          <div><span>Status</span><strong>{entitlement.entitlementStatus ?? "free"}</strong></div>
          <div><span>Plan</span><strong>{entitlement.productKey ?? "—"}</strong></div>
          <div><span>Trial</span><strong>{entitlement.isTrial ? "Yes" : "No"}</strong></div>
          <div><span>Renews</span><strong>{entitlement.currentPeriodEnd ? new Date(entitlement.currentPeriodEnd).toLocaleDateString() : "—"}</strong></div>
        </div>
      </section>
    </div>
  );
}
