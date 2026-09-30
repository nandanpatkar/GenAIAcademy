import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CircleCheck, CircleX, Flame, Hand, Lightbulb, RotateCcw, Sparkles, Tags } from "lucide-react";
import { codelabStatementBody } from "../../../services/codelabProblemService";

const hastText = (node) => {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  return (node.children || []).map(hastText).join("");
};

/**
 * Statements are Markdown with a "## Problem Statement" heading (the panel
 * title already says that) and a trailing "**Constraints:**" block, which is
 * shown in its own box.
 */
export function splitStatement(statement) {
  const body = codelabStatementBody(statement).replace(/^##\s*Problem Statement\s*\n+/im, "").trim();
  const marker = body.search(/\*\*Constraints:?\*\*:?/);
  if (marker === -1) return { body, constraints: "" };
  return {
    body: body.slice(0, marker).trim(),
    constraints: body.slice(marker).replace(/^\*\*Constraints:?\*\*:?\s*/, "").trim(),
  };
}

const EXAMPLE_LABEL = /^(Input|Output|Explanation)\s*:\s*(.*)$/;

/** Example code fences ("Input: … / Output: …") read as labelled lines, not code. */
function ExampleBlock({ text }) {
  return (
    <div className="dsa-ws-example">
      {text.trim().split("\n").map((line, index) => {
        const match = line.match(EXAMPLE_LABEL);
        // Lines repeat verbatim often enough (blank explanation rows); index keeps keys unique.
        // eslint-disable-next-line react/no-array-index-key
        return match ? <p key={index}><strong>{match[1]}:</strong> {match[2]}</p> : line.trim() ? <p key={index}>{line}</p> : null;
      })}
    </div>
  );
}

const markdownComponents = {
  pre({ node, children }) {
    const text = hastText(node);
    if (/^\s*(Input|Output)\s*:/.test(text)) return <ExampleBlock text={text} />;
    return <pre>{children}</pre>;
  },
  a({ href, children }) {
    return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
  },
};

const Markdown = ({ children }) => <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{children || ""}</ReactMarkdown>;
const levelClass = (value) => String(value || "").toLowerCase();

/**
 * "Now Your Turn": pick the output for an unseen input. The answer key comes
 * from running the reference solution at build time; where that wasn't
 * possible the pick is checked with the AI coach instead.
 */
function YourTurn({ quiz, problemId, onAskCoach }) {
  const storageKey = `dsa_your_turn_${problemId}`;
  const [picked, setPicked] = useState(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setPicked(saved === null ? null : Number(saved));
    } catch {
      setPicked(null);
    }
  }, [storageKey]);
  const choose = (index) => {
    if (picked !== null) return;
    setPicked(index);
    try { localStorage.setItem(storageKey, String(index)); } catch { /* storage unavailable */ }
  };
  const reset = () => {
    setPicked(null);
    try { localStorage.removeItem(storageKey); } catch { /* storage unavailable */ }
  };
  const known = Number.isInteger(quiz.answer);
  const right = known && picked === quiz.answer;

  return (
    <section className="dsa-ws-turn" aria-labelledby={`dsa-ws-turn-${problemId}`}>
      <header>
        <span className="dsa-ws-turn-icon" aria-hidden="true"><Hand size={15} /></span>
        <div>
          <h2 id={`dsa-ws-turn-${problemId}`}>Now Your Turn!</h2>
          <p>Pick the correct output for the given input</p>
        </div>
      </header>
      <div className="dsa-ws-turn-card">
        <div className="dsa-ws-turn-prompt">
          {quiz.prompt.split("\n").map((line) => {
            const match = line.match(/^(Input)\s*:\s*(.*)$/);
            return <p key={line}>{match ? <><strong>{match[1]}</strong>: {match[2]}</> : line}</p>;
          })}
        </div>
        <div className="dsa-ws-turn-options" role="radiogroup" aria-label="Possible outputs">
          {quiz.options.map((option, index) => {
            const state = picked === null ? "" : known && index === quiz.answer ? " is-correct" : index === picked ? (known ? " is-wrong" : " is-picked") : "";
            return (
              // Options can repeat textually; their position is the identity.
              // eslint-disable-next-line react/no-array-index-key
              <button key={index} type="button" role="radio" aria-checked={picked === index} className={`dsa-ws-turn-option${state}`} onClick={() => choose(index)} disabled={picked !== null && picked !== index && !(known && index === quiz.answer)}>
                <i aria-hidden="true" />
                <code>{option}</code>
                {state === " is-correct" && <CircleCheck size={15} />}
                {state === " is-wrong" && <CircleX size={15} />}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`dsa-ws-turn-result${known ? (right ? " is-right" : " is-wrong") : ""}`} aria-live="polite">
            {known ? (right ? "Correct — nicely traced." : "Not quite. The highlighted option is the output.") : "There's no answer key for this one yet."}
            {!known && onAskCoach && (
              <button type="button" onClick={() => onAskCoach(`For this problem, the input is: ${quiz.prompt.replace(/\n/g, " ")}. The options are ${quiz.options.map((option, index) => `(${index + 1}) ${option}`).join(", ")}. I picked option ${picked + 1}. Is that the correct output? Explain briefly by tracing the input.`)}>
                <Sparkles size={13} /> Check with the AI coach
              </button>
            )}
            <button type="button" onClick={reset}><RotateCcw size={13} /> Try again</button>
          </div>
        )}
      </div>
    </section>
  );
}

function QAList({ items }) {
  return (
    <div className="dsa-ws-accordion">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <div className="dsa-ws-richtext"><Markdown>{String(item.answer || "").replace(/\n(?!\n)/g, "\n\n")}</Markdown></div>
        </details>
      ))}
    </div>
  );
}

export default function ProblemStatement({ problem, detail, isChallenge, solved, catalog, onSelectProblem, completed, onAskCoach }) {
  const hintsRef = useRef(null);
  const topicsRef = useRef(null);
  const extras = detail?.extras || null;
  const split = useMemo(() => splitStatement(detail?.statement || ""), [detail?.statement]);
  const constraints = split.constraints || detail?.constraints || extras?.constraints || "";
  const pattern = problem?.patterns?.[0]?.pattern || "Core DSA";
  const category = problem?.patterns?.[0]?.category || problem?.topicTags?.[0] || "DSA";
  const similar = useMemo(() => {
    const fromScrape = (extras?.similar || [])
      .map((item) => catalog.find((entry) => entry.tuf === item.slug))
      .filter((entry) => entry && entry.slug !== problem?.slug);
    if (fromScrape.length) return fromScrape.slice(0, 6);
    return catalog.filter((item) => item.slug !== problem?.slug && item.patterns?.[0]?.pattern === pattern).slice(0, 6);
  }, [catalog, extras, pattern, problem?.slug]);
  const topics = [...new Set([...(problem?.topicTags || []), category, pattern])];

  const reveal = (ref) => {
    const section = ref.current;
    if (!section) return;
    const first = section.querySelector("details");
    if (first) first.open = true;
    section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  const hints = extras?.hints?.length
    ? extras.hints.map((hint, index) => ({ title: hint.title || `Hint ${index + 1}`, body: hint.body }))
    : [
      { title: "Hint 1", body: `Think in terms of the **${pattern}** pattern (${category}). What does it let you avoid recomputing?` },
      detail?.approach && { title: "Hint 2", body: detail.approach },
      (problem?.timeComplexity || problem?.spaceComplexity) && {
        title: "Hint 3",
        body: `Aim for **${problem.timeComplexity || "an efficient"}** time and **${problem.spaceComplexity || "minimal"}** extra space.`,
      },
    ].filter(Boolean);

  return (
    <div className="dsa-ws-statement">
      <header className="dsa-ws-statement-head">
        <h1>{problem?.number ? `${problem.number}. ` : ""}{problem?.title}</h1>
        <div className="dsa-ws-chips">
          <span className={`dsa-ws-difficulty ${levelClass(problem?.level)}`}>{problem?.level || "Unrated"}</span>
          <button type="button" className="dsa-ws-chip" onClick={() => reveal(hintsRef)}><Lightbulb size={13} /> Hints</button>
          <button type="button" className="dsa-ws-chip is-topics" onClick={() => reveal(topicsRef)}><Tags size={13} /> Topics</button>
          {isChallenge && <span className="dsa-ws-chip is-potd" title="Accepted today earns the daily bonus"><Flame size={13} /> Problem of the Day</span>}
          {solved && <span className="dsa-ws-chip is-solved"><CircleCheck size={13} /> Solved</span>}
          {extras?.minutes ? <span className="dsa-ws-chip">~{extras.minutes} min</span> : null}
        </div>
      </header>

      <div className="dsa-ws-richtext"><Markdown>{split.body}</Markdown></div>

      {extras?.quiz?.options?.length > 0 && <YourTurn quiz={extras.quiz} problemId={problem?.slug} onAskCoach={onAskCoach} />}

      {constraints && (
        <section className="dsa-ws-section">
          <h2>Constraints</h2>
          <div className="dsa-ws-constraints dsa-ws-richtext"><Markdown>{constraints}</Markdown></div>
        </section>
      )}

      <section className="dsa-ws-section" ref={hintsRef}>
        <h2>Hints</h2>
        <div className="dsa-ws-accordion">
          {hints.map((hint) => (
            <details key={hint.title}>
              <summary>{hint.title}</summary>
              <div className="dsa-ws-richtext"><Markdown>{hint.body}</Markdown></div>
            </details>
          ))}
        </div>
      </section>

      <section className="dsa-ws-section" ref={topicsRef}>
        <h2>Topics</h2>
        <div className="dsa-ws-accordion">
          <details>
            <summary>Topic tags</summary>
            <div className="dsa-ws-tag-row">{topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
          </details>
        </div>
      </section>

      {extras?.doubts?.length > 0 && (
        <section className="dsa-ws-section">
          <h2>Frequently Occurring Doubts</h2>
          <QAList items={extras.doubts} />
        </section>
      )}

      {extras?.followUps?.length > 0 && (
        <section className="dsa-ws-section">
          <h2>Interview Follow-up Questions</h2>
          <QAList items={extras.followUps} />
        </section>
      )}

      {extras?.facts?.length > 0 && (
        <section className="dsa-ws-section">
          <h2>Fun Facts</h2>
          <div className="dsa-ws-accordion">
            <details>
              <summary>{extras.facts.length === 1 ? "1 fun fact" : `${extras.facts.length} fun facts`}</summary>
              <ul className="dsa-ws-facts">{extras.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
            </details>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="dsa-ws-section">
          <h2>Similar problems</h2>
          <div className="dsa-ws-similar">
            {similar.map((item) => (
              <button type="button" key={item.slug} onClick={() => onSelectProblem(item)}>
                <i className={levelClass(item.level)} aria-hidden="true" />
                <span>{item.title}</span>
                {completed.includes(item.slug) && <CircleCheck size={13} aria-label="Solved" />}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
