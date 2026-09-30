import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Heart, MessageSquare, Users } from "lucide-react";

const LANGUAGES = [
  ["cpp", /```(?:cpp|c\+\+)/i, "C++"],
  ["java", /```java\b/i, "Java"],
  ["python", /```(?:python|py)\b/i, "Python"],
  ["javascript", /```(?:javascript|js)\b/i, "JavaScript"],
];

const languageOf = (content) => LANGUAGES.find(([, pattern]) => pattern.test(content))?.[2] || "Solution";
const dateLabel = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.valueOf()) ? date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) : "";
};

/**
 * Solutions other learners shared on the reference site (from the local
 * scrape), most-liked first. Read-only here.
 */
export default function PeerSolutions({ solutions }) {
  const [openId, setOpenId] = useState("");
  const [language, setLanguage] = useState("All");
  const sorted = useMemo(() => [...(solutions || [])].sort((a, b) => (b.reactions || 0) - (a.reactions || 0)), [solutions]);
  const languages = useMemo(() => ["All", ...new Set(sorted.map((entry) => languageOf(entry.content)))], [sorted]);
  const visible = sorted.filter((entry) => language === "All" || languageOf(entry.content) === language);
  const open = sorted.find((entry) => entry.id === openId);

  if (!sorted.length) {
    return (
      <div className="dsa-ws-peers is-empty">
        <Users size={22} />
        <b>No peer solutions yet</b>
        <p>Solutions shared by other learners appear here when they're part of the offline data.</p>
      </div>
    );
  }

  if (open) {
    return (
      <article className="dsa-ws-peers dsa-ws-peer-full">
        <button type="button" className="dsa-ws-peer-back" onClick={() => setOpenId("")}><ArrowLeft size={14} /> All peer solutions</button>
        <h2>{open.title}</h2>
        <div className="dsa-ws-peer-meta">
          <span className="dsa-ws-peer-avatar" aria-hidden="true">{(open.author || "?").slice(0, 1)}</span>
          <b>{open.author}</b>
          {open.username && <span>@{open.username}</span>}
          {dateLabel(open.date) && <span>· {dateLabel(open.date)}</span>}
          <span className="dsa-ws-peer-stats"><Heart size={13} /> {open.reactions || 0} <MessageSquare size={13} /> {open.comments || 0}</span>
        </div>
        <div className="dsa-ws-richtext"><ReactMarkdown remarkPlugins={[remarkGfm]}>{open.content}</ReactMarkdown></div>
      </article>
    );
  }

  return (
    <div className="dsa-ws-peers">
      <header className="dsa-ws-peer-head">
        <div><h2>Peer Solutions</h2><p>{sorted.length} approaches shared by other learners, most-liked first.</p></div>
        <div className="dsa-ws-peer-langs" role="group" aria-label="Language">
          {languages.map((entry) => <button type="button" key={entry} aria-pressed={language === entry} className={language === entry ? "is-active" : ""} onClick={() => setLanguage(entry)}>{entry}</button>)}
        </div>
      </header>
      <ul className="dsa-ws-peer-list">
        {visible.map((entry) => (
          <li key={entry.id}>
            <button type="button" onClick={() => setOpenId(entry.id)}>
              <span className="dsa-ws-peer-title">{entry.title}</span>
              <span className="dsa-ws-peer-preview">{String(entry.content || "").replace(/```[\s\S]*?```/g, "").replace(/[`*#]/g, "").trim().slice(0, 180)}</span>
              <span className="dsa-ws-peer-meta">
                <span className="dsa-ws-peer-avatar" aria-hidden="true">{(entry.author || "?").slice(0, 1)}</span>
                <b>{entry.author}</b>
                <span className="dsa-ws-peer-lang">{languageOf(entry.content)}</span>
                <span className="dsa-ws-peer-stats"><Heart size={13} /> {entry.reactions || 0} <MessageSquare size={13} /> {entry.comments || 0}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
