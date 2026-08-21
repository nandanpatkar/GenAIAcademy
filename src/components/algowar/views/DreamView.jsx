import React, { useEffect, useState } from "react";
import { NinjaLoader } from "../../NinjaEye";
import Icon from "../icons";
import { companies, loadCompany, loadDreamProblem } from "../data";
import { renderStatement } from "../statement";
import SolutionConsole from "./SolutionConsole";

export default function DreamView() {
  const [slug, setSlug] = useState(null);
  const [company, setCompany] = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [problem, setProblem] = useState(null);
  const [solving, setSolving] = useState(false);

  useEffect(() => {
    if (!slug) { setCompany(null); return undefined; }
    let live = true;
    setCompany(null);
    setProblemId(null);
    setProblem(null);
    loadCompany(slug).then((c) => { if (live) setCompany(c); });
    return () => { live = false; };
  }, [slug]);

  useEffect(() => {
    if (!problemId) { setProblem(null); return undefined; }
    let live = true;
    setSolving(false);
    loadDreamProblem(problemId).then((p) => { if (live) setProblem(p); });
    return () => { live = false; };
  }, [problemId]);

  if (!slug) {
    return (
      <div className="aw-page aw-dream">
        <header className="aw-band-head">
          <span className="aw-kicker"><Icon name="rocket" size={14} /> Dream mode</span>
          <h1>Questions your dream companies ask</h1>
          <p>{companies.length} companies · {companies.reduce((n, c) => n + (c.questionCount ?? 0), 0)} questions.</p>
        </header>
        <div className="aw-company-grid">
          {companies.map((c) => (
            <button key={c.slug} type="button" className="aw-card aw-company" onClick={() => setSlug(c.slug)}>
              <span className="aw-company-mark">{c.name.slice(0, 2).toUpperCase()}</span>
              <strong>{c.name}</strong>
              <small>{c.questionCount} questions</small>
              <span className="aw-bar sm"><span style={{ width: `${c.questionCount ? (c.solvedCount / c.questionCount) * 100 : 0}%` }} /></span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const questions = company?.questions ?? [];

  return (
    <div className="aw-page aw-dream">
      <header className="aw-band-head aw-dream-head">
        <button type="button" className="aw-btn aw-btn-ghost" onClick={() => setSlug(null)}>
          <Icon name="chevron_left" size={16} /> All companies
        </button>
        <div>
          <span className="aw-kicker">Dream mode</span>
          <h1>{company?.company?.name ?? slug}</h1>
          <p>{questions.length} questions ranked by interview frequency.</p>
        </div>
      </header>

      <div className="aw-dream-body">
        <section className="aw-card aw-question-list">
          {!company && <NinjaLoader label="Loading questions" size="sm" />}
          {questions.map((q) => (
            <button
              key={q.problemId}
              type="button"
              className={`aw-question${q.problemId === problemId ? " is-selected" : ""}`}
              onClick={() => setProblemId(q.problemId)}
            >
              <span className="aw-q-order">{q.orderIndex}</span>
              <span className="aw-q-body">
                <strong>{q.title}</strong>
                <small className={`aw-diff is-${(q.difficulty ?? "").toLowerCase()}`}>{q.difficulty}</small>
              </span>
              <span className="aw-q-freq" title="Interview frequency">{Math.round(q.frequency)}%</span>
            </button>
          ))}
        </section>

        <section className="aw-card aw-inspector">
          {!problemId && <p className="aw-muted-sm">Pick a question to read its statement.</p>}
          {problemId && !problem && <NinjaLoader label="Loading problem" size="sm" />}
          {problem && (() => {
            // The dream endpoint nests the payload under `problem` and names the body
            // `statement`, unlike the career levels which return statementHtml at the top.
            const d = problem.problem ?? problem;
            return (
              <>
                <div className="aw-inspector-head">
                  <span className="aw-kicker">Problem</span>
                  {d.difficulty && <span className={`aw-chip is-${String(d.difficulty).toLowerCase()}`}>{d.difficulty}</span>}
                </div>
                <h2>{d.title}</h2>
                {d.tags?.length > 0 && (
                  <div className="aw-tag-row">{d.tags.map((t) => <span key={t}>{t}</span>)}</div>
                )}
                <div className="aw-inspector-stats">
                  <div><span><Icon name="schedule" size={14} /> Time</span><strong>{d.timeLimit ?? "—"}</strong></div>
                  <div><span><Icon name="memory" size={14} /> Memory</span><strong>{d.memoryLimit ?? "—"}</strong></div>
                </div>
                {d.statement && (
                  <div className="aw-statement problem-statement">
                    <div className="aw-html" dangerouslySetInnerHTML={{ __html: renderStatement(d.statement) }} />
                  </div>
                )}
                {!solving && (
                  <button type="button" className="aw-btn aw-btn-primary aw-solve-btn" onClick={() => setSolving(true)}>
                    <Icon name="code" size={17} /> Solve Problem
                  </button>
                )}
                {solving && (
                  <SolutionConsole
                    storageKey={`dream:${d.id}`}
                    subtitle={`Submit your solution for ${d.title}`}
                    problem={{ title: d.title, statement: d.statement, examples: [] }}
                    footer={
                      <button type="button" className="aw-btn aw-btn-ghost" onClick={() => setSolving(false)}>
                        Close console
                      </button>
                    }
                  />
                )}
                {problem.unavailable && <p className="aw-note">This problem was not available to fetch.</p>}
              </>
            );
          })()}
        </section>
      </div>
    </div>
  );
}
