import React, { useEffect, useMemo, useState } from "react";
import Icon from "../icons";
import { worlds, loadWorld, loadLevel, gradientFor, themeIcon } from "../data";
import { getProgress, nodeState, worldProgress } from "../progress";
import { renderStatement, toPlainText } from "../statement";

import LevelView from "./LevelView";

const LANE_X = { left: 25, center: 50, right: 75 };

// The site labels chapters one below the world number — Array Valley (world 3) shows
// as "Chapter 2" — so Foundation Gate reads as the prologue.
const chapterNumber = (worldNumber) => Math.max(0, worldNumber - 1);

// Main label is "Level N" for level nodes and the node title otherwise.
const nodeLabel = (node) => (node.level ? `Level ${node.level.displayNumber}` : node.title);

function nodeSublabel(node, state) {
  if (node.level?.isBoss) return `${state} boss - ${node.level.title}`;
  if (node.level) return `${state} - ${node.level.title}`;
  return node.subtitle ?? state;
}

function nodeIcon(node, state) {
  if (state === "locked") return "lock";
  if (state === "completed" || state === "perfect") return "check";
  if (node.nodeType === "intro") return "flag";
  if (node.nodeType === "checkpoint") return "redeem";
  if (node.nodeType === "boss" || node.level?.isBoss) return "emoji_events";
  return "code";
}

// The inspector shows a short teaser; theory levels carry whole articles, so render the
// statement and flatten it rather than dumping markup into a small panel.
function preview(html, limit = 320) {
  const text = toPlainText(renderStatement(html));
  return text.length > limit ? `${text.slice(0, limit).trim()}…` : text;
}

function worldRank(world) {
  const hard = Number(world.difficultySummary?.Hard ?? 0);
  const medium = Number(world.difficultySummary?.Medium ?? 0);
  if (hard > 0) return "A";
  return medium > world.levelCount / 2 ? "B" : "C";
}

function Connector({ from, to, index, done }) {
  const a = LANE_X[from] ?? 50;
  const b = LANE_X[to] ?? 50;
  return (
    <svg className="aw-connector" viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true"
      style={{ animationDelay: `${0.05 * index}s` }}>
      <path d={`M ${a} 0 C ${a} 60, ${b} 60, ${b} 120`} fill="none"
        stroke={done ? "rgba(74,222,128,0.45)" : "rgba(255,51,68,0.28)"} strokeWidth="3"
        strokeDasharray={done ? "none" : "6 6"} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// The world panel's own backdrop: theme wash, 64px grid, top-light/bottom-dark gradient
// and two rotated outline rectangles.
function WorldBackdrop({ theme }) {
  return (
    <div className="aw-map-bg" aria-hidden="true">
      <div className="aw-map-wash" style={{ "--grad-1": gradientFor(theme).split(",")[0], "--grad-2": gradientFor(theme).split(",")[1] }} />
      <div className="aw-map-grid" />
      <div className="aw-map-vignette" />
      <div className="aw-map-frame a" />
      <div className="aw-map-frame b" />
    </div>
  );
}

function LevelInspector({ node, detail, state, onStart }) {
  if (!node) return <div className="aw-card aw-inspector"><p className="aw-muted-sm">Pick a node on the map.</p></div>;
  const level = node.level;
  const locked = state === "locked";

  return (
    <div className="aw-card aw-inspector">
      <div className="aw-inspector-head">
        <span className="aw-kicker">Level Inspector</span>
        <span className={`aw-state-chip is-${state}`}>{state}</span>
      </div>
      <h2>{nodeLabel(node)}</h2>
      <p className="aw-muted-sm">{node.description ?? node.subtitle ?? "Campaign node"}</p>

      {!level && (
        <p className="aw-note">
          {node.nodeType === "intro"
            ? "This world intro explains what you are about to unlock."
            : "Checkpoint rewards will be claimable once level completion is active."}
          {node.rewards?.coins ? ` Reward: ${node.rewards.coins} coins.` : ""}
        </p>
      )}

      {level && (
        <>
          <div className="aw-inspector-stats">
            <div><span><Icon name="signal_cellular_alt" size={14} /> Difficulty</span><strong>{level.difficulty}</strong></div>
            <div><span><Icon name="bolt" size={14} /> Reward</span><strong>{level.xpReward} XP</strong></div>
          </div>

          <div className="aw-inspector-statement">
            {detail?.statementHtml
              ? <p className="aw-muted-sm aw-preview-text">{preview(detail.statementHtml)}</p>
              : <p className="aw-muted-sm">{detail ? "Content pending — this level has no statement yet." : "Loading…"}</p>}
          </div>

          <button type="button" className="aw-btn aw-btn-primary aw-start-level" onClick={() => onStart(level.levelNumber)} disabled={locked}>
            {locked ? "Locked" : level.levelType === "theory" ? "Open Theory" : "Start Level"}
            <Icon name="chevron_right" size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export default function CareerView() {
  const [selectedWorld, setSelectedWorld] = useState(worlds[0]?.slug ?? null);
  const [world, setWorld] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [detail, setDetail] = useState(null);
  const [progress, setProgress] = useState(() => getProgress());
  const [openLevel, setOpenLevel] = useState(null);

  const refreshProgress = () => setProgress(getProgress());

  useEffect(() => {
    let live = true;
    setWorld(null);
    setSelectedNode(null);
    setDetail(null);
    loadWorld(selectedWorld).then((w) => {
      if (!live || !w) return;
      setWorld(w);
      setSelectedNode(w.nodes?.find((n) => n.level) ?? w.nodes?.[0] ?? null);
    });
    return () => { live = false; };
  }, [selectedWorld]);

  useEffect(() => {
    const n = selectedNode?.level?.levelNumber;
    if (!n) { setDetail(null); return undefined; }
    let live = true;
    loadLevel(n).then((d) => { if (live) setDetail(d); });
    return () => { live = false; };
  }, [selectedNode]);

  const totals = useMemo(() => ({
    levels: worlds.reduce((n, w) => n + (w.levelCount ?? 0), 0),
    xp: worlds.reduce((n, w) => n + (w.xpAvailable ?? 0), 0),
  }), []);

  const active = worlds.find((w) => w.slug === selectedWorld);
  const selectedState = world && selectedNode ? nodeState(selectedNode, world, progress) : undefined;

  if (openLevel !== null) {
    return (
      <LevelView
        levelNumber={openLevel}
        onBack={() => { setOpenLevel(null); refreshProgress(); }}
        onCompleted={refreshProgress}
      />
    );
  }

  // The floating CTA follows the selected node, exactly as the live map does, and hides
  // for locked nodes or levels with no authored content.
  const playable = selectedNode?.level && selectedState !== "locked";

  return (
    <div className="aw-page aw-career">
      <section className="aw-command" style={{ "--grad-1": gradientFor(active?.theme).split(",")[0] }}>
        <div>
          <span className="aw-kicker">Career Command</span>
          <h1>AlgoWars Campaign</h1>
          <p>Clear coding levels, unlock worlds, defeat boss challenges, and build your long-term DSA rank path.</p>
        </div>
        <div className="aw-command-stats">
          <div><span>Worlds</span><strong>{worlds.length}</strong></div>
          <div><span>Levels</span><strong>{totals.levels}</strong></div>
          <div><span>Total XP</span><strong>{totals.xp}</strong></div>
        </div>
      </section>

      <header className="aw-band-head aw-world-head">
        <div>
          <span className="aw-kicker">Campaign Chapters</span>
          <h2>World Selection</h2>
        </div>
        <span className="aw-muted-sm">Pro: every chapter is unlocked — jump in anywhere.</span>
      </header>

      <div className="aw-world-strip">
        {worlds.map((w) => {
          const pct = worldProgress(w.nodes ? w : { nodes: [] }, progress);
          return (
            <button
              key={w.slug}
              type="button"
              className={`aw-world${w.slug === selectedWorld ? " is-active" : ""}`}
              style={{ "--grad-1": gradientFor(w.theme).split(",")[0] }}
              onClick={() => setSelectedWorld(w.slug)}
            >
              <span className="aw-world-ghost" aria-hidden="true"><Icon name={themeIcon(w.theme)} size={120} /></span>
              <span className="aw-world-diag" aria-hidden="true" />
              <span className="aw-world-top">
                <span className="aw-world-no">Chapter {chapterNumber(w.worldNumber)}</span>
                <Icon name="military_tech" size={16} />
              </span>
              <strong>{w.title}</strong>
              <span className="aw-world-cells">
                <span><small>Levels</small><b>{w.levelCount}</b></span>
                <span><small>Total XP</small><b>{w.xpAvailable}</b></span>
                <span><small>Rank</small><b>{worldRank(w)}</b></span>
              </span>
              <span className="aw-bar sm"><span style={{ width: `${pct}%` }} /></span>
              <small className="aw-world-pct">{pct ? `${pct}% campaign cleared` : "Not started"}</small>
            </button>
          );
        })}
      </div>

      <div className="aw-career-body">
        <section className="aw-card aw-map">
          <WorldBackdrop theme={active?.theme} />

          <div className="aw-map-header">
            <span className="aw-map-emblem"><Icon name={themeIcon(active?.theme)} size={30} /></span>
            <div className="aw-map-title">
              <span className="aw-kicker">Chapter {chapterNumber(active?.worldNumber ?? 0)}</span>
              <h2>{active?.title}</h2>
              <p className="aw-muted-sm">{active?.description}</p>
            </div>
            <div className="aw-map-chips">
              <span><Icon name="route" size={14} /> {active?.levelCount} levels</span>
              <span><Icon name="bolt" size={14} /> {active?.xpAvailable} Total XP</span>
              {active?.completionReward?.badgeTitle && (
                <span><Icon name="military_tech" size={14} /> {active.completionReward.badgeTitle}</span>
              )}
            </div>
          </div>

          <div className="aw-map-scroll">
            <div className="aw-map-fade top" aria-hidden="true" />
            {!world && <p className="aw-muted-sm aw-map-loading">Loading campaign map…</p>}

            {world && (
              <ol className="aw-nodes">
                {world.nodes.map((node, i) => {
                  const nextNode = world.nodes[i + 1];
                  const isSelected = node.nodeKey === selectedNode?.nodeKey;
                  const boss = node.nodeType === "boss" || node.level?.isBoss;
                  const state = nodeState(node, world, progress);
                  const done = state === "completed" || state === "perfect";
                  return (
                    <li key={node.nodeKey} className="aw-node-row">
                      {nextNode && <Connector from={node.mapLane} to={nextNode.mapLane} index={i} done={done} />}
                      <div className="aw-node-slot" style={{ left: `${LANE_X[node.mapLane] ?? 50}%` }}>
                        <button
                          type="button"
                          className={`aw-node is-${node.nodeType}${boss ? " is-boss" : ""} is-state-${state}${isSelected ? " is-selected" : ""}`}
                          onClick={() => setSelectedNode(node)}
                          onDoubleClick={() => node.level && state !== "locked" && setOpenLevel(node.level.levelNumber)}
                        >
                          <Icon name={nodeIcon(node, state)} size={boss ? 24 : 19} />
                        </button>
                        <span className={`aw-node-label lane-${node.mapLane} is-${state}${isSelected ? " is-selected" : ""}`}>
                          <strong>{nodeLabel(node)}</strong>
                          <small>{nodeSublabel(node, state)}</small>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
            <div className="aw-map-fade bottom" aria-hidden="true" />
          </div>
        </section>

        <LevelInspector node={selectedNode} detail={detail} state={selectedState} onStart={setOpenLevel} />
      </div>

      {playable && (
        <button type="button" className="aw-play-fab" onClick={() => setOpenLevel(selectedNode.level.levelNumber)}>
          <Icon name="play" size={17} fill />
          {selectedNode.level.levelType === "theory"
            ? `Open Theory ${selectedNode.level.displayNumber}`
            : `Play Level ${selectedNode.level.displayNumber}`}
        </button>
      )}
    </div>
  );
}
