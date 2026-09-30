import React, { useMemo, useRef, useState } from "react";
import { Copy, Crown, Download, Info, Medal, Trash2, Upload, UserRound, Users } from "lucide-react";
import { useHabitSummary } from "../habit";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { useLearnerState } from "../learner";
import { makeScorecard, parseScorecard, rankBoard } from "../lib/rewards";
import { Badge, Dialog, EmptyState, Field, Panel, PrepPage, Tabs, downloadFile, readFileText } from "../ui";

const initials = (name) => String(name || "?").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export default function Leaderboard({ displayName }) {
  const habit = useHabitSummary();
  const learner = useLearnerState();
  const [profile] = useStore(KEYS.profile, {});
  const [peers, setPeers] = useStore(KEYS.scorecards, []);
  const [period, setPeriod] = useState("month");
  const [importOpen, setImportOpen] = useState(false);
  const [pasted, setPasted] = useState("");
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const handle = profile.handle || displayName || "You";
  const mine = useMemo(() => makeScorecard({ handle, ledger: habit.ledger, submissions: habit.submissions, solved: learner.completed.size, today: habit.today }), [habit.ledger, habit.submissions, habit.today, handle, learner.completed.size]);
  const monthKey = habit.today.slice(0, 7);
  const board = rankBoard([{ ...mine, isYou: true }, ...peers], period, monthKey);
  const myRow = board.find((row) => row.isYou);

  const addCards = (text) => {
    const card = parseScorecard(text);
    if (card.handle === mine.handle) throw new Error("That's your own scorecard handle — ask your friend to set their own handle in Profile.");
    setPeers((list) => {
      const others = list.filter((entry) => entry.handle !== card.handle);
      const existing = list.find((entry) => entry.handle === card.handle);
      // Keep whichever card is newer for a handle already on the board.
      return [...others, existing && existing.generatedAt > card.generatedAt ? existing : card];
    });
  };

  const importPasted = () => {
    try { addCards(pasted); setPasted(""); setImportError(""); setImportOpen(false); } catch (error) { setImportError(error.message); }
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try { addCards(await readFileText(file)); setImportError(""); setImportOpen(false); } catch (error) { setImportError(error.message); }
  };
  const copyCard = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(mine)); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { downloadFile(`scorecard-${mine.handle}.json`, JSON.stringify(mine, null, 2)); }
  };

  return (
    <PrepPage
      eyebrow="Unlock"
      title="Leaderboard"
      description="Compare with your study group. There's no shared server behind this hub, so boards are built from scorecards people exchange — small self-reported summaries you import here."
      actions={(
        <>
          <button type="button" className="dsp-btn" onClick={copyCard}><Copy size={15} /> {copied ? "Copied" : "Copy my scorecard"}</button>
          <button type="button" className="dsp-btn" onClick={() => downloadFile(`scorecard-${mine.handle.replace(/[^a-z0-9]+/gi, "-")}.json`, JSON.stringify(mine, null, 2))}><Download size={15} /> Download</button>
          <button type="button" className="dsp-btn is-primary" onClick={() => setImportOpen(true)}><Upload size={15} /> Add a friend</button>
        </>
      )}
    >
      <div className="dsp-grid cols-3">
        <div className="dsp-stat"><span className="dsp-stat-label"><Crown size={14} /> Your rank</span><b className="dsp-stat-value">#{myRow?.rank || 1} <small className="dsp-muted">of {board.length}</small></b><small>{period === "month" ? "This month" : "All time"}</small></div>
        <div className="dsp-stat"><span className="dsp-stat-label"><Medal size={14} /> Your score</span><b className="dsp-stat-value">{period === "month" ? mine.month.points : mine.total}</b><small>coins · {mine.solved} solved</small></div>
        <div className="dsp-stat"><span className="dsp-stat-label"><Users size={14} /> Group</span><b className="dsp-stat-value">{peers.length}</b><small>imported scorecard{peers.length === 1 ? "" : "s"}</small></div>
      </div>

      <Panel title={period === "month" ? `Monthly board · ${monthKey}` : "All-time board"} subtitle="Ties break by who reached the score first, then by handle — ranks never shuffle between visits." actions={<Tabs value={period} onChange={setPeriod} options={[{ id: "month", label: "This month" }, { id: "all", label: "All time" }]} label="Period" />}>
        <div className="dsp-board" role="table" aria-label="Leaderboard">
          <div className="dsp-board-row is-head" role="row"><span role="columnheader">Rank</span><span role="columnheader">Name</span><span role="columnheader">Streak</span><span role="columnheader">Solved</span><span role="columnheader">Coins</span><span role="columnheader"><span className="sr-only">Actions</span></span></div>
          {board.map((row) => (
            <div key={row.handle + (row.isYou ? "-you" : "")} className={`dsp-board-row${row.isYou ? " is-you" : ""}${row.rank <= 3 ? ` is-top-${row.rank}` : ""}`} role="row">
              <span role="cell" className="dsp-board-rank">{row.rank <= 3 ? <Medal size={16} /> : null}#{row.rank}</span>
              <span role="cell" className="dsp-board-name"><i>{initials(row.handle)}</i><b>{row.handle}</b>{row.isYou ? <Badge tone="accent">You</Badge> : <Badge title={`Scorecard from ${new Date(row.generatedAt).toLocaleString()}`}>Self-reported</Badge>}</span>
              <span role="cell">{row.streak}d</span>
              <span role="cell">{row.solved}</span>
              <span role="cell" className="dsp-points">{row.score}</span>
              <span role="cell">{!row.isYou && <button type="button" className="dsp-icon-btn" onClick={() => setPeers((list) => list.filter((entry) => entry.handle !== row.handle))} aria-label={`Remove ${row.handle}`}><Trash2 size={14} /></button>}</span>
            </div>
          ))}
        </div>
        {!peers.length && <EmptyState compact icon={UserRound} title="It's just you for now" body="Send your scorecard to friends and import theirs with “Add a friend”. Monthly scores reset each calendar month; your ledger never does." />}
      </Panel>

      <div className="dsp-notice is-warning"><Info size={16} /><span><b>Scorecards are self-reported.</b> Anyone can edit a JSON file, so treat this as a friendly comparison, not a verified ranking. Your handle comes from Profile › Public profile.</span></div>

      <Dialog open={importOpen} title="Add a friend's scorecard" description="Paste the text they copied, or upload the file they downloaded." onClose={() => { setImportOpen(false); setImportError(""); }}
        footer={(
          <>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importFile} />
            <button type="button" className="dsp-btn" onClick={() => fileRef.current?.click()}><Upload size={14} /> Upload file</button>
            <button type="button" className="dsp-btn is-primary" onClick={importPasted} disabled={!pasted.trim()}>Add to board</button>
          </>
        )}
      >
        <Field label="Scorecard JSON" error={importError}>
          <textarea className="dsp-textarea dsp-mono" data-autofocus value={pasted} onChange={(event) => setPasted(event.target.value)} placeholder='{"format":"dsa-prep-scorecard", …}' />
        </Field>
      </Dialog>
    </PrepPage>
  );
}
