import React from "react";
import Icon from "../icons";

// Copy is taken verbatim from the AlgoWars landing page.
const FEATURES = [
  { icon: "flash_on", title: "REAL-TIME COMBAT", body: "Face opponents in live 1v1 algorithmic battles. Your code executes in real-time with instant feedback." },
  { icon: "social_leaderboard", title: "RANKED MATCHMAKING", body: "Our Glicko-2 rating system ensures fair matches. Rise through the ranks from Novice to Shogun." },
  { icon: "group", title: "CHALLENGE FRIENDS", body: "Invite friends to private duels via shareable links. Same ranked intensity, personal rivalry." },
];

const STEPS = [
  { n: "01", icon: "queue", title: "ENTER QUEUE", body: "Join the matchmaking queue and get paired with an opponent of similar skill." },
  { n: "02", icon: "code", title: "BATTLE", body: "Race to solve the same algorithmic problem. First to submit a correct solution wins." },
  { n: "03", icon: "trending_up", title: "CLIMB RANKS", body: "Win matches to increase your rating and climb the global leaderboard." },
];

export default function HomeView({ onEnter }) {
  return (
    <div className="aw-page aw-home">
      <section className="aw-hero">
        <span className="aw-pill">BETA VERSION NOW LIVE</span>
        <h1>CODE. COMPETE.<br /><em>CONQUER.</em></h1>
        <p>The arena for elite developers. Real-time 1v1 algorithmic combat. Prove your skill through code efficiency.</p>
        <div className="aw-hero-actions">
          <button type="button" className="aw-btn aw-btn-primary" onClick={() => onEnter("arena")}>
            Enter the Arena <Icon name="chevron_right" size={18} />
          </button>
          <button type="button" className="aw-btn" onClick={() => onEnter("career")}>
            <Icon name="route" size={17} /> Career campaign
          </button>
        </div>
        <span className="aw-hero-kanji" aria-hidden="true">戦</span>
      </section>

      <section className="aw-band">
        <div className="aw-feature-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="aw-feature">
              <span className="aw-feature-icon"><Icon name={f.icon} size={22} /></span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aw-band">
        <header className="aw-band-head">
          <span className="aw-kicker">HOW IT WORKS</span>
          <p>Three steps to prove your algorithmic prowess</p>
        </header>
        <div className="aw-step-grid">
          {STEPS.map((s) => (
            <article key={s.n} className="aw-step">
              <span className="aw-step-n">{s.n}</span>
              <span className="aw-feature-icon"><Icon name={s.icon} size={20} /></span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aw-band aw-campaign-band">
        <span className="aw-kicker"><Icon name="route" size={14} /> CAREER MODE</span>
        <h2>DSA AS A CAMPAIGN. WORLDS. BOSSES. REAL XP.</h2>
        <div className="aw-legend">
          {[
            ["workspace_premium", "COMPLETED"], ["star", "PERFECT"], ["rocket_launch", "AVAILABLE"],
            ["lock", "LOCKED"], ["skull", "BOSS"],
          ].map(([icon, label]) => (
            <span key={label}><Icon name={icon} size={15} /> {label}</span>
          ))}
        </div>
        <button type="button" className="aw-btn aw-btn-primary" onClick={() => onEnter("career")}>
          Open the campaign <Icon name="chevron_right" size={17} />
        </button>
      </section>

    </div>
  );
}
