import React from "react";
import Icon from "../icons";
import { leaderboard, profile } from "../data";
import { avatarForUser } from "../avatars";

export default function LeaderboardView() {
  const top = leaderboard.slice(0, 3);

  return (
    <div className="aw-page aw-leaderboard">
      <header className="aw-band-head">
        <span className="aw-kicker">Global standings</span>
        <h1>The arena's top contenders</h1>
        <p>{leaderboard.length} ranked players.</p>
      </header>

      <div className="aw-podium">
        {top.map((p, i) => (
          <article key={p.username} className={`aw-card aw-podium-slot place-${i + 1}`}>
            {i === 0 && <Icon name="crown" size={20} className="aw-crown" />}
            <span className="aw-avatar"><img src={avatarForUser(p.username, p.avatar)} alt="" /></span>
            <strong>{p.username}</strong>
            <small>{p.rating} rating</small>
            <span className="aw-muted-sm">{p.wins}W · {p.losses}L · {p.draws}D</span>
          </article>
        ))}
      </div>

      <div className="aw-card aw-table-wrap">
        <table>
          <thead>
            <tr><th>Rank</th><th>Player</th><th>Rating</th><th>Record</th><th>Streak</th></tr>
          </thead>
          <tbody>
            {leaderboard.map((p) => (
              <tr key={p.username} className={p.username === profile.username ? "is-me" : ""}>
                <td><span className="aw-rank">#{p.rank}</span></td>
                <td><span className="aw-table-player"><span className="aw-avatar sm"><img src={avatarForUser(p.username, p.avatar)} alt="" /></span><strong>{p.username}</strong></span></td>
                <td><strong>{p.rating}</strong></td>
                <td>{p.wins}W · {p.losses}L · {p.draws}D</td>
                <td><span className="aw-streak-chip"><Icon name="local_fire_department" size={13} /> {p.maxStreak}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
