import React, { useMemo, useState } from "react";
import {
  ArrowRight, Award, Bolt, BrainCircuit, CalendarDays, ChevronRight,
  Clock3, Code2, Copy, Crown, ExternalLink, Flame, Gamepad2, LockKeyhole,
  Play, ShieldCheck, Sparkles, Swords, Timer, Trophy, Users, X,
} from "lucide-react";
import trialData from "../data/algowar/trial_problem.json";
import leaderboardData from "../data/algowar/leaderboard.json";
import dailyChallenges from "../data/algowar/daily_challenges.json";
// 452 KB PNG at 605×499 for a 42×42 render → 8 KB WebP at 168px wide.
import logo from "../assets/algowar/logo.webp";
// WebP at 256×384 instead of the original 1024×1536 PNGs. These render at 72×72
// (58×58 on mobile) behind `object-fit: cover`, so the source files were shipping
// 6.7 MB to paint three thumbnails; the WebP versions total 80 KB.
// The .png originals are kept in Algowar/ (gitignored scrape reference) as masters.
import avatarRogue from "../assets/algowar/avatars/runtine_rouge.webp";
import avatarQuantum from "../assets/algowar/avatars/quantom_hacker.webp";
import avatarSage from "../assets/algowar/avatars/syntax_sage.webp";
import "../styles/AlgoWarArena.css";

const LIVE_ARENA_URL = "https://arena.algowars.online/arena";

const MODES = [
  { id: "blitz", name: "Blitz", description: "A fast 1v1 sprint where every second counts.", meta: "10 min", icon: Bolt, tone: "lime" },
  { id: "classical", name: "Classical", description: "A full competitive duel with room to reason.", meta: "30 min", icon: Swords, tone: "blue" },
  { id: "solo", name: "Against Time", description: "Sharpen your speed against a solo countdown.", meta: "Solo", icon: Timer, tone: "violet" },
  { id: "private", name: "Private Duel", description: "Create a room and challenge someone you know.", meta: "Invite", icon: LockKeyhole, tone: "amber" },
  { id: "daily", name: "Daily Challenge", description: "One shared problem. One fresh rank every day.", meta: `${dailyChallenges.length} archived`, icon: CalendarDays, tone: "rose" },
  { id: "dream", name: "Dream", description: "Practice interview-style problems by company.", meta: "Career", icon: Sparkles, tone: "cyan" },
];

const AVATARS = {
  "runtine_rouge.png": avatarRogue,
  "quantom_hacker.png": avatarQuantum,
  "syntax_sage.png": avatarSage,
};

const DEFAULT_INPUT = "4\nabc def\nx y\nhey bye\naaa bbb";

function solveCreatingWords(value) {
  const lines = value.trim().split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const count = Number(lines[0]);
  const cases = Number.isFinite(count) ? lines.slice(1, count + 1) : lines;
  if (!cases.length) throw new Error("Add at least one pair of words.");
  return cases.map((line, index) => {
    const [a, b] = line.split(/\s+/);
    if (!a || !b) throw new Error(`Test case ${index + 1} needs two space-separated words.`);
    return `${b[0]}${a.slice(1)} ${a[0]}${b.slice(1)}`;
  }).join("\n");
}

function ModeCard({ mode, selected, onSelect }) {
  const Icon = mode.icon;
  return (
    <button
      type="button"
      className={`aw-mode-card aw-tone-${mode.tone}${selected ? " is-selected" : ""}`}
      onClick={() => onSelect(mode.id)}
      aria-pressed={selected}
    >
      <span className="aw-mode-icon"><Icon size={22} aria-hidden="true" /></span>
      <span className="aw-mode-copy">
        <span className="aw-mode-title">{mode.name}</span>
        <span className="aw-mode-description">{mode.description}</span>
      </span>
      <span className="aw-mode-meta">{mode.meta}</span>
      <ChevronRight className="aw-mode-arrow" size={18} aria-hidden="true" />
    </button>
  );
}

export default function AlgoWarArena({ onClose }) {
  const [view, setView] = useState("arena");
  const [selectedMode, setSelectedMode] = useState("blitz");
  const [challengeInput, setChallengeInput] = useState(DEFAULT_INPUT);
  const [challengeOutput, setChallengeOutput] = useState("");
  const [runState, setRunState] = useState("idle");

  const leaders = useMemo(() => leaderboardData.users.slice(0, 10), []);
  const selected = MODES.find((mode) => mode.id === selectedMode) || MODES[0];

  const runTrial = () => {
    try {
      setChallengeOutput(solveCreatingWords(challengeInput));
      setRunState("passed");
    } catch (error) {
      setChallengeOutput(error.message);
      setRunState("error");
    }
  };

  const openLiveArena = (path = "arena") => {
    window.open(`https://arena.algowars.online/${path}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="aw-shell" aria-label="AlgoWar Arena">
      <div className="aw-grid-glow" aria-hidden="true" />

      <header className="aw-header">
        <button type="button" className="aw-brand" onClick={() => setView("arena")} aria-label="Open AlgoWar arena overview">
          <img src={logo} alt="" width="42" height="42" />
          <span><strong>ALGO<span>WAR</span></strong><small>Competitive coding arena</small></span>
        </button>

        <nav className="aw-tabs" aria-label="AlgoWar sections">
          {[
            ["arena", "Arena", Gamepad2],
            ["challenge", "Trial", Code2],
            ["leaderboard", "Ranks", Trophy],
          ].map(([id, label, Icon]) => (
            <button key={id} type="button" className={view === id ? "is-active" : ""} onClick={() => setView(id)}>
              <Icon size={16} aria-hidden="true" />{label}
            </button>
          ))}
        </nav>

        <div className="aw-header-actions">
          <button type="button" className="aw-live-link" onClick={() => openLiveArena()}>
            Live arena <ExternalLink size={15} aria-hidden="true" />
          </button>
          <button type="button" className="aw-close" onClick={onClose} aria-label="Close AlgoWar Arena"><X size={20} /></button>
        </div>
      </header>

      <div className="aw-content">
        {view === "arena" && (
          <>
            <section className="aw-hero">
              <div className="aw-hero-copy">
                <span className="aw-eyebrow"><span /> Ranked coding battles</span>
                <h1>Think fast.<br /><em>Code faster.</em></h1>
                <p>Pick a format, enter the queue, and turn algorithm practice into head-to-head competition.</p>
                <div className="aw-hero-actions">
                  <button type="button" className="aw-primary" onClick={() => openLiveArena(selected.id === "solo" ? "solo" : "arena")}>
                    Enter {selected.name} <ArrowRight size={18} aria-hidden="true" />
                  </button>
                  <button type="button" className="aw-secondary" onClick={() => setView("challenge")}>
                    <Play size={17} aria-hidden="true" /> Try a problem
                  </button>
                </div>
                <div className="aw-trust-row">
                  <span><ShieldCheck size={15} /> Fair-play rounds</span>
                  <span><Clock3 size={15} /> Real-time scoring</span>
                  <span><Users size={15} /> Global matchmaking</span>
                </div>
              </div>

              <div className="aw-command-card">
                <div className="aw-card-topline"><span>Match preview</span><span className="aw-live-dot">Live</span></div>
                <div className="aw-versus">
                  <div><span className="aw-player-avatar">NP</span><strong>You</strong><small>1000 rating</small></div>
                  <span className="aw-vs-mark">VS</span>
                  <div><img src={avatarRogue} alt="SyntaxWraith avatar" /><strong>SyntaxWraith</strong><small>1100 rating</small></div>
                </div>
                <div className="aw-match-track"><span style={{ width: "64%" }} /></div>
                <div className="aw-match-stats"><span>Difficulty <strong>800</strong></span><span>Mode <strong>{selected.name}</strong></span></div>
                <div className="aw-code-lines" aria-hidden="true"><i /><i /><i /><i /></div>
              </div>
            </section>

            <section className="aw-section">
              <div className="aw-section-heading">
                <div><span className="aw-kicker">Choose your battle</span><h2>Every round tests a different edge.</h2></div>
                <span className="aw-selection-note"><Flame size={16} /> {selected.name} selected</span>
              </div>
              <div className="aw-mode-grid">
                {MODES.map((mode) => <ModeCard key={mode.id} mode={mode} selected={mode.id === selectedMode} onSelect={setSelectedMode} />)}
              </div>
            </section>
          </>
        )}

        {view === "challenge" && (
          <section className="aw-trial-view">
            <div className="aw-section-heading">
              <div><span className="aw-kicker">Practice terminal</span><h1>{trialData.problem.title}</h1></div>
              <span className="aw-difficulty"><Award size={16} /> {trialData.problem.difficulty} rating</span>
            </div>
            <div className="aw-trial-grid">
              <article className="aw-problem-card">
                <div className="aw-problem-meta"><span><Clock3 size={15} /> 1 second</span><span><BrainCircuit size={15} /> 256 MB</span></div>
                <p>Matthew has two words and swaps their first characters. For each test case, print both transformed words.</p>
                <h2>Input</h2>
                <p>The first line contains the number of test cases. Each following line contains two space-separated words.</p>
                <h2>Output</h2>
                <p>Print the two words after swapping their first characters.</p>
                <button type="button" className="aw-text-link" onClick={() => navigator.clipboard?.writeText(trialData.problem.statement)}><Copy size={15} /> Copy full statement</button>
              </article>
              <div className="aw-runner">
                <div className="aw-runner-bar"><span>Input</span><button type="button" onClick={() => setChallengeInput(DEFAULT_INPUT)}>Reset</button></div>
                <textarea aria-label="Trial problem input" value={challengeInput} onChange={(event) => { setChallengeInput(event.target.value); setRunState("idle"); }} spellCheck="false" />
                <div className="aw-runner-bar"><span>Output</span>{runState !== "idle" && <strong className={`is-${runState}`}>{runState === "passed" ? "Passed" : "Check input"}</strong>}</div>
                <pre aria-live="polite">{challengeOutput || "Run the sample to see output."}</pre>
                <button type="button" className="aw-primary aw-run-button" onClick={runTrial}><Play size={17} fill="currentColor" /> Run sample</button>
              </div>
            </div>
          </section>
        )}

        {view === "leaderboard" && (
          <section className="aw-ranks-view">
            <div className="aw-section-heading">
              <div><span className="aw-kicker">Global standings</span><h1>The arena’s top contenders.</h1></div>
              <button type="button" className="aw-secondary" onClick={() => openLiveArena("leaderboard")}>Full leaderboard <ExternalLink size={16} /></button>
            </div>
            <div className="aw-podium">
              {leaders.slice(0, 3).map((player, index) => (
                <article key={player.username} className={`aw-podium-player place-${index + 1}`}>
                  {index === 0 && <Crown size={22} className="aw-crown" />}
                  {AVATARS[player.avatar] ? <img src={AVATARS[player.avatar]} alt={`${player.username} avatar`} /> : <span className="aw-player-avatar">{player.username.slice(0, 2).toUpperCase()}</span>}
                  <strong>{player.username}</strong><small>{player.rating} rating</small><span>{player.wins} wins</span>
                </article>
              ))}
            </div>
            <div className="aw-table-wrap">
              <table>
                <thead><tr><th>Rank</th><th>Player</th><th>Rating</th><th>Record</th><th>Best streak</th></tr></thead>
                <tbody>{leaders.map((player) => (
                  <tr key={player.username}>
                    <td><span className="aw-rank-number">#{player.rank}</span></td>
                    <td><span className="aw-table-player">{AVATARS[player.avatar] ? <img src={AVATARS[player.avatar]} alt="" /> : <span>{player.username.slice(0, 2).toUpperCase()}</span>}<strong>{player.username}</strong></span></td>
                    <td><strong>{player.rating}</strong></td>
                    <td>{player.wins}W · {player.losses}L · {player.draws}D</td>
                    <td><span className="aw-streak"><Flame size={14} /> {player.maxStreak}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <footer className="aw-footer"><span>Built from the AlgoWars Arena design system and supplied dataset.</span><a href={LIVE_ARENA_URL} target="_blank" rel="noreferrer">arena.algowars.online <ExternalLink size={13} /></a></footer>
    </main>
  );
}
