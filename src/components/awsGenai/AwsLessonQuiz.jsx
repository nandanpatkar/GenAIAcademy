import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Eye, Layers, RotateCcw, Shuffle, X } from "lucide-react";
import { aipUrlTransform } from "./AwsGenAiMarkdown";

/* The Quiz tab of an AWS GenAI lesson, in three parts, all parsed from the
 * lesson itself by scripts/build_aws_genai.py:
 *
 *   practice   — the lesson's exam-style questions (§7b, and the module's
 *                mixed review §7c), single answer or "select TWO", each with
 *                the explanation from §14. Options are shuffled at build time
 *                (the source puts nearly every answer at A or B) and the
 *                letters in each explanation were relabelled to match.
 *   recall     — the knowledge checkpoints (§7): answer in your head, reveal.
 *   cards      — the revision cards (§12), one at a time.
 */

const LETTERS = "ABCDEF";

function Inline({ text, components }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{ ...components, p: ({ children }) => <>{children}</> }}
      urlTransform={aipUrlTransform}
    >
      {text || ""}
    </ReactMarkdown>
  );
}

function PracticeQuestion({ item, number, components, state, onChange }) {
  const picked = state?.picked || [];
  const revealed = Boolean(state?.revealed);
  const correctSet = new Set(item.correct);
  const right = revealed && picked.length === item.correct.length && picked.every((index) => correctSet.has(index));

  const toggle = (index) => {
    if (revealed) return;
    if (!item.multi) {
      onChange({ picked: [index], revealed: true });
      return;
    }
    const next = picked.includes(index) ? picked.filter((value) => value !== index) : [...picked, index];
    onChange({ picked: next, revealed: false });
  };

  return (
    <div className={`aifs-question aip-question${revealed ? (right ? " is-right" : " is-wrong") : ""}`}>
      <div className="aip-question-top">
        <span className="aip-qnum">Q{number}</span>
        {item.source === "7c" ? <span className="aip-qtag">mixed review</span> : null}
        {item.multi ? <span className="aip-qtag is-multi">select {item.select}</span> : null}
      </div>
      <p className="aifs-question-text"><Inline text={item.question.replace(/^\(Select\s+\w+\)\s*/i, "")} components={components} /></p>
      <div className="aifs-options">
        {item.options.map((option, index) => {
          const chosen = picked.includes(index);
          let tone = "";
          if (revealed && correctSet.has(index)) tone = " aifs-option--right";
          else if (revealed && chosen) tone = " aifs-option--wrong";
          else if (chosen) tone = " aip-option--picked";
          return (
            <button key={index} type="button" disabled={revealed} className={`aifs-option${tone}`} onClick={() => toggle(index)}>
              <span className="aifs-option-key">{LETTERS[index]}</span>
              <span><Inline text={option} components={components} /></span>
            </button>
          );
        })}
      </div>
      {item.multi && !revealed ? (
        <button
          type="button"
          className="aip-check"
          disabled={picked.length !== item.select}
          onClick={() => onChange({ picked, revealed: true })}
        >
          <Eye size={13} /> Check answer {picked.length !== item.select ? `(pick ${item.select})` : ""}
        </button>
      ) : null}
      {revealed ? (
        <div className={`aip-explain${right ? " is-right" : " is-wrong"}`}>
          <b>{right ? <><Check size={13} /> Correct</> : <><X size={13} /> Answer: {item.correct.map((index) => LETTERS[index]).join(", ")}</>}</b>
          {item.explanation ? <span> <Inline text={item.explanation} components={components} /></span> : null}
        </div>
      ) : null}
    </div>
  );
}

function RecallItem({ item, components, number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`aip-recall${open ? " is-open" : ""}`}>
      <p className="aip-recall-q"><span className="aip-qnum">{number}</span><Inline text={item.question} components={components} /></p>
      {open
        ? <p className="aip-recall-a"><Inline text={item.answer} components={components} /></p>
        : <button type="button" className="aip-reveal" onClick={() => setOpen(true)}><Eye size={13} /> Show answer</button>}
    </div>
  );
}

function Flashcards({ cards, components }) {
  const [order, setOrder] = useState(() => cards.map((_, index) => index));
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setOrder(cards.map((_, index) => index)); setPosition(0); setFlipped(false); }, [cards]);
  if (!cards.length) return null;
  const card = cards[order[position]];
  const go = (delta) => { setFlipped(false); setPosition((value) => (value + delta + cards.length) % cards.length); };
  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setPosition(0);
    setFlipped(false);
  };

  return (
    <div className="aip-cards">
      <button
        type="button"
        className={`aip-card${flipped ? " is-flipped" : ""}`}
        onClick={() => setFlipped((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
        }}
        aria-label={flipped ? "Show the question" : "Show the answer"}
      >
        <span className="aip-card-inner">
          <span className="aip-card-face aip-card-front"><small>Question</small><Inline text={card.front} components={components} /></span>
          <span className="aip-card-face aip-card-back"><small>Answer</small><Inline text={card.back} components={components} /></span>
        </span>
      </button>
      <div className="aip-card-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous card"><ArrowLeft size={14} /></button>
        <span>{position + 1} / {cards.length}</span>
        <button type="button" onClick={() => go(1)} aria-label="Next card"><ArrowRight size={14} /></button>
        <button type="button" onClick={shuffle} aria-label="Shuffle the cards"><Shuffle size={14} /></button>
      </div>
    </div>
  );
}

export default function AwsLessonQuiz({ practice = [], recall = [], cards = [], components }) {
  const [answers, setAnswers] = useState({});
  useEffect(() => { setAnswers({}); }, [practice]);

  const score = useMemo(() => {
    let correct = 0;
    let done = 0;
    practice.forEach((item, index) => {
      const state = answers[index];
      if (!state?.revealed) return;
      done += 1;
      const set = new Set(item.correct);
      if (state.picked.length === item.correct.length && state.picked.every((value) => set.has(value))) correct += 1;
    });
    return { correct, done };
  }, [answers, practice]);

  if (!practice.length && !recall.length && !cards.length) {
    return <div className="aifs-state">This page has no quiz.</div>;
  }

  return (
    <div className="aifs-quiz aip-quiz">
      {practice.length ? (
        <section className="aifs-quiz-stage">
          <div className="aip-quiz-head">
            <h3><CircleHelp size={13} /> Exam-style questions</h3>
            <span className="aip-quiz-score">
              {score.done ? `${score.correct} / ${score.done} correct` : `${practice.length} questions`}
              {score.done ? (
                <button type="button" onClick={() => setAnswers({})} aria-label="Reset the quiz"><RotateCcw size={12} /></button>
              ) : null}
            </span>
          </div>
          <p className="aip-quiz-note">Options are shuffled; the letters in each explanation follow the order shown here.</p>
          {practice.map((item, index) => (
            <PracticeQuestion
              key={item.id}
              item={item}
              number={index + 1}
              components={components}
              state={answers[index]}
              onChange={(state) => setAnswers((prev) => ({ ...prev, [index]: state }))}
            />
          ))}
          {score.done === practice.length ? (
            <div className={`aip-quiz-done${score.correct / practice.length >= 0.75 ? " is-pass" : ""}`}>
              {score.correct} of {practice.length} correct ({Math.round((score.correct / practice.length) * 100)}%).
              {score.correct / practice.length >= 0.75 ? " Exam-ready on this topic." : " Re-read the exam notes and try the misses again."}
            </div>
          ) : null}
        </section>
      ) : null}

      {recall.length ? (
        <section className="aifs-quiz-stage">
          <h3><Eye size={13} /> Recall · answer in your head, then check</h3>
          {recall.map((item, index) => <RecallItem key={index} item={item} components={components} number={index + 1} />)}
        </section>
      ) : null}

      {cards.length ? (
        <section className="aifs-quiz-stage">
          <h3><Layers size={13} /> Revision cards</h3>
          <Flashcards cards={cards} components={components} />
        </section>
      ) : null}
    </div>
  );
}
