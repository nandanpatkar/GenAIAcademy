import React, { useEffect, useState } from "react";
import Icon from "../icons";
import { loadLevel } from "../data";
import { completeLevel, levelStatus, resetLevel } from "../progress";
import { renderStatement } from "../statement";
import SolutionConsole from "./SolutionConsole";

function Stat({ icon, label, value }) {
  return (
    <div className="aw-lv-stat">
      <Icon name={icon} size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function LevelView({ levelNumber, onBack, onCompleted }) {
  const [level, setLevel] = useState(null);
  const [status, setStatus] = useState(() => levelStatus(levelNumber));
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    let live = true;
    setLevel(null);
    setCleared(false);
    setStatus(levelStatus(levelNumber));
    loadLevel(levelNumber).then((d) => { if (live) setLevel(d); });
    return () => { live = false; };
  }, [levelNumber]);

  const markCleared = (perfect) => {
    completeLevel(levelNumber, { xp: level?.xpReward ?? 0, coins: level?.coinReward ?? 0, perfect });
    setStatus(perfect ? "perfect" : "completed");
    setCleared(true);
    onCompleted?.();
  };

  if (!level) return <div className="aw-page"><p className="aw-muted-sm">Loading career level…</p></div>;

  const isTheory = level.levelType === "theory";

  return (
    <div className="aw-page aw-level">
      <header className="aw-lv-top">
        <button type="button" className="aw-btn aw-btn-ghost" onClick={onBack}>
          <Icon name="chevron_left" size={16} /> Back to Career
        </button>
        <div className="aw-lv-badges">
          {level.isBoss && <span className="aw-chip is-hard"><Icon name="emoji_events" size={12} /> Boss Level</span>}
          <span className={`aw-chip is-${String(level.difficulty).toLowerCase()}`}>{level.difficulty}</span>
          {status && <span className="aw-chip is-good">{status === "perfect" ? "Perfect" : "Cleared"}</span>}
        </div>
      </header>

      <div className="aw-lv-grid">
        <section className="aw-card aw-lv-brief">
          <div className="aw-lv-head">
            <div>
              <span className="aw-kicker">{isTheory ? "Theory Mission" : "Problem Brief"}</span>
              <h1>{level.title}</h1>
            </div>
            <Icon name="route" size={24} className="aw-lv-route" />
          </div>

          <div className={`aw-lv-scroll ${isTheory ? "aw-article" : "problem-statement"}`}>
            {level.unavailable && <p className="aw-note">Content pending — AlgoWars has not authored this level yet.</p>}
            {level.statementHtml && (
              <div
                className={isTheory ? undefined : "aw-html"}
                dangerouslySetInnerHTML={{ __html: renderStatement(level.statementHtml) }}
              />
            )}
            {level.examples?.length > 0 && (
              <>
                <h4 className="problem-heading">Examples</h4>
                {level.examples.map((ex, i) => (
                  <div key={i} className="aw-example aw-html" dangerouslySetInnerHTML={{ __html: renderStatement(ex) }} />
                ))}
              </>
            )}
            {level.constraintsHtml && (
              <>
                <h4 className="problem-heading">Constraints</h4>
                <div className="aw-html" dangerouslySetInnerHTML={{ __html: renderStatement(level.constraintsHtml) }} />
              </>
            )}
          </div>
        </section>

        {isTheory ? (
          <section className="aw-card aw-lv-console">
            <span className="aw-kicker">Theory Mission</span>
            <h2>Read and unlock</h2>
            <p className="aw-muted-sm">
              This level is concept-only. Study the lesson, then mark it complete to earn XP and unlock the next campaign node.
            </p>
            <div className="aw-lv-stats">
              <Stat icon="bolt" label="Reward" value={`+${level.xpReward} XP`} />
              <Stat icon="route" label="Next Node" value="Unlocked" />
            </div>
            <button type="button" className="aw-btn aw-btn-primary aw-lv-submit" onClick={() => markCleared(true)}>
              Complete Theory
            </button>
          </section>
        ) : (
          <SolutionConsole
            storageKey={`level:${levelNumber}`}
            subtitle={`Submit to clear Level ${level.displayNumber}`}
            problem={{
              title: level.title,
              statement: level.statementHtml,
              constraints: level.constraintsHtml,
              examples: level.examples ?? [],
            }}
            onAccepted={() => markCleared(true)}
            footer={status && (
              <button type="button" className="aw-btn aw-btn-ghost" onClick={() => { resetLevel(levelNumber); setStatus(null); setCleared(false); onCompleted?.(); }}>
                Reset progress
              </button>
            )}
          />
        )}
      </div>

      {cleared && (
        <div className="aw-victory" role="status">
          <div className="aw-card aw-victory-card">
            <Icon name="emoji_events" size={34} className="aw-victory-icon" />
            <h2>Level Cleared</h2>
            <div className="aw-lv-stats">
              <Stat icon="bolt" label="Experience" value={`+${level.xpReward ?? 0} XP`} />
              <Stat icon="monetization_on" label="Coins" value={`+${level.coinReward ?? 0}`} />
            </div>
            <button type="button" className="aw-btn aw-btn-primary" onClick={onBack}>
              Back to Map <Icon name="chevron_right" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
