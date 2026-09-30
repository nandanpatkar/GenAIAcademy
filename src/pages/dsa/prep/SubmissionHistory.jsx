import React, { useMemo, useState } from "react";
import { ChevronDown, CircleCheckBig, CircleX, Clock3, Code2, History, RotateCcw } from "lucide-react";
import { useStore } from "./hooks";
import { KEYS } from "./keys";
import { relativeTime } from "./lib/dates";
import { Badge, EmptyState } from "./ui";

const VERDICT_LABEL = {
  accepted: "Accepted",
  wrong_answer: "Wrong answer",
  runtime_error: "Runtime error",
  syntax_error: "Syntax error",
  timeout: "Time limit",
};

/**
 * Every judged submission for one problem, newest first. Rejected attempts are
 * kept too — the code you tried is often the most useful thing to revisit.
 */
export default function SubmissionHistory({ slug, currentCode, onLoadCode }) {
  const [submissions] = useStore(KEYS.submissions, []);
  const [openId, setOpenId] = useState("");
  const mine = useMemo(() => submissions.filter((entry) => entry.slug === slug), [slug, submissions]);
  const acceptedCount = mine.filter((entry) => entry.verdict === "accepted").length;

  const load = (entry) => {
    if (entry.code === currentCode) return;
    if (currentCode?.trim() && !window.confirm("Replace the code in your editor with this submission? Your current draft will be overwritten.")) return;
    onLoadCode(entry.code);
  };

  if (!mine.length) {
    return (
      <div className="dsp-subs">
        <EmptyState icon={History} title="No submissions yet" body="Submit a solution and every verdict — accepted or not — is kept here with the code you sent. Runs don't count as submissions." />
      </div>
    );
  }

  return (
    <div className="dsp-subs">
      <header>
        <span className="dsa-workspace-kicker">SUBMISSION HISTORY</span>
        <h2>{mine.length} submission{mine.length === 1 ? "" : "s"}</h2>
        <p>{acceptedCount} accepted · stored on this device</p>
      </header>
      <ul>
        {mine.map((entry) => {
          const accepted = entry.verdict === "accepted";
          const open = openId === entry.id;
          return (
            <li key={entry.id} className={open ? "is-open" : ""}>
              <button type="button" className="dsp-subs-row" onClick={() => setOpenId(open ? "" : entry.id)} aria-expanded={open}>
                {accepted ? <CircleCheckBig size={17} className="is-ok" /> : <CircleX size={17} className="is-bad" />}
                <div>
                  <b>{VERDICT_LABEL[entry.verdict] || entry.verdict.replace(/_/g, " ")}</b>
                  <small><Clock3 size={11} /> {relativeTime(entry.at)} · {entry.passed}/{entry.total} tests{entry.runtime ? ` · ${entry.runtime}s` : ""}</small>
                </div>
                <Badge tone={accepted ? "success" : "danger"}>{entry.passed}/{entry.total}</Badge>
                <ChevronDown size={15} />
              </button>
              {open && (
                <div className="dsp-subs-code">
                  <pre><code>{entry.code || "# (no code recorded)"}</code></pre>
                  {entry.truncated && <small className="dsp-muted">Long submission — only the first 8,000 characters were kept.</small>}
                  <div className="dsp-row">
                    <button type="button" className="dsp-btn is-small" onClick={() => load(entry)} disabled={entry.code === currentCode}>
                      {entry.code === currentCode ? <><Code2 size={13} /> In editor</> : <><RotateCcw size={13} /> Load into editor</>}
                    </button>
                    <span className="dsp-muted dsp-small">{new Date(entry.at).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
