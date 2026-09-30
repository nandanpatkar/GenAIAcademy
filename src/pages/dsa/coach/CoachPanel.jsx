import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  AtSign,
  Check,
  CircleAlert,
  Clipboard,
  ClipboardCheck,
  Code2,
  FilePenLine,
  FileText,
  FlaskConical,
  History,
  LoaderCircle,
  NotebookText,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Square,
  TextQuote,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { callAI } from "../../../services/aiService";
import DsaBrandMark from "../DsaBrandMark";
import { relativeTime } from "../prep/lib/dates";
import { readStore } from "../prep/lib/store";
import { CoachCancelled, runCoachAgent } from "./agent";
import { CoachActions, FollowUps, Segment } from "./Artifacts";
import ContextMenu from "./ContextMenu";
import { LEARNING_PREFERENCES, PERSONALITIES, SKILL_LEVELS, STYLES, statusFor } from "./prompt";
import { splitReply } from "./replyParser";
import { appendMessage, sessionsKey, truncateFrom, updateMessage, useCoachPrefs, useCoachSessions } from "./sessions";
import "../../../styles/DsaCoach.css";

// Room for a complete rich artifact (a full HTML page or React Flow component).
const MODEL_MAX_TOKENS = 8192;
const GROUP_MS = 5 * 60 * 1000;
const NEAR_BOTTOM_PX = 48;
const CONTEXT_ICONS = { problem_description: FileText, lesson: FileText, editorial: NotebookText, submission: History, editor_tab: Code2, code_file: Code2, test_result: FlaskConical, selected_text: TextQuote };

const dayOf = (iso) => new Date(iso).toDateString();
const dateLabel = (iso) => {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric", ...(date.getFullYear() !== today.getFullYear() ? { year: "numeric" } : {}) });
};
const timeLabel = (iso) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** The stored messages of one chat, read fresh (never a stale React copy). */
const storedMessages = (slug, sessionId) => (readStore(sessionsKey(slug), null)?.sessions || []).find((session) => session.id === sessionId)?.messages || [];

function busyReducer(prev, event) {
  if (!prev) return prev;
  if (event.type === "status") return { ...prev, status: event.label };
  if (event.type === "tool_start") return { ...prev, status: `${event.label}…`, steps: [...prev.steps, { id: event.id, label: event.label, status: "running" }] };
  if (event.type === "tool_result") return { ...prev, steps: prev.steps.map((step) => (step.id === event.id ? { ...step, status: event.status, summary: event.summary } : step)) };
  if (event.type === "final") return { ...prev, status: "Writing the answer…" };
  return prev;
}

function Steps({ steps, live = false }) {
  if (!steps?.length) return null;
  const list = (
    <ul className="dcx-steps-list">
      {steps.map((step) => (
        <li key={step.id} className={`is-${step.status}`}>
          {step.status === "running" ? <LoaderCircle size={13} className="dcx-spin" /> : step.status === "error" ? <CircleAlert size={13} /> : <Check size={13} />}
          <span>{step.label}</span>
          {step.summary && <small>{step.summary}</small>}
        </li>
      ))}
    </ul>
  );
  if (live) return list;
  return (
    <details className="dcx-used">
      <summary><Wrench size={12} /> Used {steps.length} tool{steps.length === 1 ? "" : "s"}</summary>
      {list}
    </details>
  );
}

function AssistantMessage({ message, isLast, busy, onRetry, onRegenerate, onFeedback, onSaveNote }) {
  const segments = useMemo(() => splitReply(message.content), [message.content]);
  const followUps = segments.filter((segment) => segment.type === "artifact" && segment.artifact.type === "follow_ups").flatMap((segment) => segment.artifact.items);
  const body = segments.filter((segment) => !(segment.type === "artifact" && segment.artifact.type === "follow_ups"));
  const [copied, setCopied] = useState(false);

  if (message.isError) {
    return (
      <div className="dcx-msg is-assistant is-error">
        <DsaBrandMark className="dcx-avatar" />
        <div className="dcx-bubble">
          <p><CircleAlert size={14} /> {message.content}</p>
          {onRetry && <button type="button" className="dcx-btn is-ghost" onClick={onRetry} disabled={busy}><RefreshCw size={13} /> Retry</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="dcx-msg is-assistant">
      <DsaBrandMark className="dcx-avatar" />
      <div className="dcx-bubble">
        <Steps steps={message.steps} />
        {/* eslint-disable-next-line react/no-array-index-key */}
        {body.map((segment, index) => <Segment key={index} segment={segment} />)}
        <div className="dcx-msg-actions">
          <button
            type="button"
            className="dcx-icon"
            aria-label={copied ? "Copied" : "Copy answer"}
            title={copied ? "Copied" : "Copy answer"}
            onClick={async () => { try { await navigator.clipboard.writeText(message.content); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { /* blocked */ } }}
          >
            {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
          </button>
          <button type="button" className={`dcx-icon${message.feedback === "up" ? " is-on" : ""}`} aria-pressed={message.feedback === "up"} aria-label="Helpful" title="Helpful" onClick={() => onFeedback(message.feedback === "up" ? null : "up")}><ThumbsUp size={14} /></button>
          <button type="button" className={`dcx-icon${message.feedback === "down" ? " is-on" : ""}`} aria-pressed={message.feedback === "down"} aria-label="Not helpful" title="Not helpful" onClick={() => onFeedback(message.feedback === "down" ? null : "down")}><ThumbsDown size={14} /></button>
          {isLast && onRegenerate && <button type="button" className="dcx-icon" onClick={onRegenerate} disabled={busy} aria-label="Regenerate answer" title="Regenerate"><RefreshCw size={14} /></button>}
          {onSaveNote && (
            <button type="button" className="dcx-text-btn" onClick={onSaveNote} disabled={message.savedNote} title="Save this answer to your notes">
              <FilePenLine size={13} /> {message.savedNote ? "Saved as note draft" : "Save as note"}
            </button>
          )}
        </div>
        {isLast && <FollowUps items={followUps} disabled={busy} />}
      </div>
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="dcx-msg is-user">
      <div className="dcx-bubble">
        {message.context?.length > 0 && <div className="dcx-msg-context">{message.context.map((label) => <span key={label}><AtSign size={11} /> {label}</span>)}</div>}
        <p>{message.content}</p>
      </div>
    </div>
  );
}

function Working({ busy }) {
  return (
    <div className="dcx-msg is-assistant is-working" aria-live="polite">
      <DsaBrandMark className="dcx-avatar" />
      <div className="dcx-bubble">
        <Steps steps={busy.steps} live />
        <p className="dcx-status"><span className="dcx-dots" aria-hidden="true"><i /><i /><i /></span> {busy.status}</p>
      </div>
    </div>
  );
}

function HistoryMenu({ sessions, activeId, noun, onSelect, onRemove, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (event) => { if (ref.current && !ref.current.contains(event.target) && !event.target.closest?.("[data-dcx-history]")) onClose(); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [onClose]);
  const withMessages = sessions.filter((session) => session.messages.length);
  return (
    <div className="dcx-pop dcx-history" ref={ref} role="dialog" aria-label="Chat history">
      <header><b>Chats for this {noun}</b><button type="button" className="dcx-icon" onClick={onClose} aria-label="Close"><X size={14} /></button></header>
      {withMessages.length ? (
        <ul>
          {withMessages.map((session) => (
            <li key={session.id} className={session.id === activeId ? "is-active" : ""}>
              <button type="button" onClick={() => { onSelect(session.id); onClose(); }}>
                <b>{session.title}</b>
                <small>{session.messages.length} message{session.messages.length === 1 ? "" : "s"} · {relativeTime(session.updatedAt)}</small>
              </button>
              <button type="button" className="dcx-icon" aria-label={`Delete “${session.title}”`} title="Delete chat" onClick={() => { if (window.confirm(`Delete “${session.title}”?`)) onRemove(session.id); }}><Trash2 size={13} /></button>
            </li>
          ))}
        </ul>
      ) : <p className="dcx-muted">No past chats for this {noun} yet.</p>}
    </div>
  );
}

function SettingsMenu({ prefs, onChange, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (event) => { if (ref.current && !ref.current.contains(event.target) && !event.target.closest?.("[data-dcx-settings]")) onClose(); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [onClose]);
  const togglePreference = (value) => onChange({ preferences: prefs.preferences.includes(value) ? prefs.preferences.filter((item) => item !== value) : [...prefs.preferences, value] });
  return (
    <div className="dcx-pop dcx-settings" ref={ref} role="dialog" aria-label="Personalize the coach">
      <header><b>Personalize your coach</b><button type="button" className="dcx-icon" onClick={onClose} aria-label="Close"><X size={14} /></button></header>
      <label className="dcx-field"><span>What should the coach call you?</span><input value={prefs.nickname} maxLength={40} onChange={(event) => onChange({ nickname: event.target.value })} placeholder="Nickname" /></label>
      <div className="dcx-field-row">
        <label className="dcx-field"><span>Skill level</span>
          <select value={prefs.skillLevel} onChange={(event) => onChange({ skillLevel: event.target.value })}>
            <option value="">Not set</option>
            {SKILL_LEVELS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="dcx-field"><span>Tone</span>
          <select value={prefs.style} onChange={(event) => onChange({ style: event.target.value })}>
            {STYLES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      <fieldset className="dcx-field">
        <legend>Tutor personality</legend>
        <div className="dcx-chips">
          {PERSONALITIES.map((option) => <button type="button" key={option.value} aria-pressed={prefs.personality === option.value} className={prefs.personality === option.value ? "is-on" : ""} onClick={() => onChange({ personality: option.value })}>{option.label}</button>)}
        </div>
      </fieldset>
      <fieldset className="dcx-field">
        <legend>You learn best with</legend>
        <div className="dcx-chips">
          {LEARNING_PREFERENCES.map((option) => <button type="button" key={option.value} aria-pressed={prefs.preferences.includes(option.value)} className={prefs.preferences.includes(option.value) ? "is-on" : ""} onClick={() => togglePreference(option.value)}>{option.label}</button>)}
        </div>
      </fieldset>
      <label className="dcx-switch"><input type="checkbox" checked={prefs.hintFirst} onChange={(event) => onChange({ hintFirst: event.target.checked })} /><span><b>Hints before answers</b><small>The coach holds back full solutions until you ask for one.</small></span></label>
      <label className="dcx-switch"><input type="checkbox" checked={prefs.allowRuns} onChange={(event) => onChange({ allowRuns: event.target.checked })} /><span><b>Let the coach run code</b><small>It can run code (yours or its own) in a sandbox before answering.</small></span></label>
    </div>
  );
}

/**
 * The AI coach panel: an agent that reads the page's material through tools,
 * can run code, and answers with interactive artifacts. What it knows and can
 * do comes from `adapter` (see DsaAiCoach for problems, LessonCoach for AI
 * from Scratch lessons):
 *
 *   sessionKey        chats are stored per key
 *   noun, subject     "problem" / "lesson", and the title for the input hint
 *   defaultContext    items attached on open (e.g. the problem description)
 *   contextGroups()   the @ menu
 *   resolveContext()  attached items → prompt text
 *   toolSpecs()       the tools to advertise, given attached types and prefs
 *   tools             { name: { label(args), run(args) } }
 *   systemPrompt()    the system prompt for a turn
 *   quickActions, intro, actions (what artifacts can do)
 *
 * `request` starts a turn from outside: each new `request.id` attaches
 * `request.context` and sends `request.prompt`.
 */
export default function CoachPanel({ adapter, request, onSaveNote, onClose, closeLabel = "Close AI panel" }) {
  const slug = adapter.sessionKey;
  const chats = useCoachSessions(slug);
  const [prefs, setPrefs] = useCoachPrefs();
  const [input, setInput] = useState("");
  const [context, setContext] = useState(adapter.defaultContext || []);
  const [menu, setMenu] = useState("");
  const [busy, setBusy] = useState(null);
  const [atBottom, setAtBottom] = useState(true);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const cancelRef = useRef(null);
  // The latest adapter, so a long turn always reads the current page state.
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  const active = chats.active;
  const messages = active?.messages || [];
  const busyHere = Boolean(busy && busy.slug === slug && busy.sessionId === active?.id);

  useEffect(() => { setContext(adapterRef.current.defaultContext || []); setInput(""); setMenu(""); }, [slug]);

  /* ── Scrolling ──────────────────────────────────────────────────────── */
  const scrollToBottom = useCallback((behavior = "smooth") => {
    const node = scrollRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior });
  }, []);
  const onScroll = () => {
    const node = scrollRef.current;
    if (node) setAtBottom(node.scrollHeight - node.scrollTop - node.clientHeight < NEAR_BOTTOM_PX);
  };
  useEffect(() => { scrollToBottom("auto"); setAtBottom(true); }, [active?.id, scrollToBottom]);
  useEffect(() => { if (atBottom) scrollToBottom(); }, [messages.length, busy?.steps.length, busy?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sending ────────────────────────────────────────────────────────── */
  const send = async (raw, { extraContext = [], replaceFrom = null } = {}) => {
    const message = String(raw || "").trim();
    if (!message || busy || !slug) return;
    const targetSlug = slug;
    const sessionId = chats.ensureActive();
    if (replaceFrom) truncateFrom(targetSlug, sessionId, replaceFrom);
    const history = storedMessages(targetSlug, sessionId);
    const attached = [...context, ...extraContext.filter((item) => !context.some((entry) => entry.key === item.key))];

    appendMessage(targetSlug, sessionId, { role: "user", content: message, context: attached.filter((item) => !item.implicit).map((item) => item.label) });
    setInput("");
    setMenu("");
    // A selection is a one-off; the rest stays attached for the next message.
    setContext((items) => items.filter((item) => item.type !== "selected_text"));
    setAtBottom(true);

    const current = adapterRef.current;
    const specs = current.toolSpecs(attached.map((item) => item.type), prefs);
    const names = new Set(specs.map((spec) => spec.name));
    const tools = Object.fromEntries(Object.entries(current.tools).filter(([name]) => names.has(name)));
    const system = current.systemPrompt({ context: current.resolveContext(attached), prefs, tools: specs });

    const cancel = { cancelled: false };
    cancelRef.current = cancel;
    setBusy({ slug: targetSlug, sessionId, status: statusFor(message), steps: [] });
    try {
      const result = await runCoachAgent({
        system,
        history,
        message,
        callModel: (transcript) => callAI(transcript, MODEL_MAX_TOKENS, 0.4),
        tools,
        isCancelled: () => cancel.cancelled,
        onEvent: (event) => { if (!cancel.cancelled) setBusy((prev) => busyReducer(prev, event)); },
      });
      appendMessage(targetSlug, sessionId, { role: "assistant", content: result.content, steps: result.steps.map(({ id, label, status, summary }) => ({ id, label, status, summary })) });
    } catch (error) {
      if (!(error instanceof CoachCancelled)) {
        appendMessage(targetSlug, sessionId, { role: "assistant", isError: true, content: error?.message ? `I couldn't finish that answer. ${error.message}` : "Sorry — I couldn't finish that answer. Please try again." });
      }
    } finally {
      if (cancelRef.current === cancel) {
        cancelRef.current = null;
        setBusy(null);
      }
    }
  };

  const sendRef = useRef(send);
  sendRef.current = send;
  const stop = () => {
    if (cancelRef.current) cancelRef.current.cancelled = true;
    cancelRef.current = null;
    setBusy(null);
  };

  // Outside requests: Guide Me, "Ask AI" on a selection, …
  useEffect(() => {
    if (!request?.id) return;
    const extra = request.context || [];
    if (request.prompt) sendRef.current(request.prompt, { extraContext: extra });
    else if (extra.length) {
      setContext((items) => [...items.filter((item) => !extra.some((entry) => entry.key === item.key)), ...extra]);
      inputRef.current?.focus();
    }
  }, [request?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const retryFrom = (index) => {
    const userMessage = [...messages.slice(0, index)].reverse().find((message) => message.role === "user");
    if (userMessage) send(userMessage.content, { replaceFrom: userMessage.id });
  };

  const toggleContext = (item) => {
    setContext((items) => (items.some((entry) => entry.key === item.key) ? items.filter((entry) => entry.key !== item.key) : [...items, item]));
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    // "@" at the start of a word opens the context menu, like the reference.
    if (value.length > input.length && /(^|\s)@$/.test(value)) {
      setInput(value.slice(0, -1));
      setMenu("context");
      return;
    }
    setInput(value);
  };
  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
    if (event.key === "Escape" && menu) { event.preventDefault(); setMenu(""); }
  };

  const actions = useMemo(() => ({ ...adapter.actions, sendPrompt: (text) => sendRef.current(text) }), [adapter.actions]);

  const lastAssistant = messages.length - 1;

  return (
    <CoachActions.Provider value={actions}>
      <section className="dsa-coach dcx" aria-label="AI coach">
        <header className="dcx-head">
          <div className="dcx-tabs" role="tablist" aria-label="Chats">
            {chats.open.length ? chats.open.map((session) => (
              <div key={session.id} className={`dcx-tab${session.id === active?.id ? " is-active" : ""}`}>
                <button type="button" role="tab" aria-selected={session.id === active?.id} onClick={() => chats.select(session.id)} title={session.title}>{session.title}</button>
                {chats.open.length > 1 && <button type="button" className="dcx-tab-close" onClick={() => chats.close(session.id)} aria-label={`Close ${session.title}`}><X size={11} /></button>}
              </div>
            )) : <div className="dcx-tab is-active"><button type="button" role="tab" aria-selected="true">New chat</button></div>}
          </div>
          <button type="button" className="dcx-icon" onClick={() => { chats.create(); inputRef.current?.focus(); }} aria-label="New chat" title="New chat"><Plus size={16} /></button>
          <span className="dcx-head-gap" />
          <button type="button" data-dcx-history className={`dcx-icon${menu === "history" ? " is-on" : ""}`} onClick={() => setMenu(menu === "history" ? "" : "history")} aria-label="Chat history" aria-expanded={menu === "history"} title="Chat history"><History size={15} /></button>
          <button type="button" data-dcx-settings className={`dcx-icon${menu === "settings" ? " is-on" : ""}`} onClick={() => setMenu(menu === "settings" ? "" : "settings")} aria-label="Personalize the coach" aria-expanded={menu === "settings"} title="Personalize"><SlidersHorizontal size={15} /></button>
          {onClose && <button type="button" className="dcx-icon" onClick={onClose} aria-label={closeLabel} title={closeLabel}><X size={16} /></button>}
          {menu === "history" && <HistoryMenu noun={adapter.noun || "page"} sessions={chats.sessions} activeId={active?.id} onSelect={chats.select} onRemove={chats.remove} onClose={() => setMenu("")} />}
          {menu === "settings" && <SettingsMenu prefs={prefs} onChange={setPrefs} onClose={() => setMenu("")} />}
        </header>

        <div className="dcx-messages" ref={scrollRef} onScroll={onScroll}>
          {!messages.length && !busyHere && (
            <div className="dcx-empty">
              <DsaBrandMark className="dcx-mascot" />
              <h2>Hey{prefs.nickname ? ` ${prefs.nickname}` : ""}, {adapter.intro?.title || "I'm your AI coach"}</h2>
              <p>{adapter.intro?.body}</p>
              <div className="dcx-quick" aria-label="Suggested questions">
                {(adapter.quickActions || []).map((action) => <button type="button" key={action.id} onClick={() => send(action.prompt)} disabled={Boolean(busy)}>{action.label}</button>)}
              </div>
            </div>
          )}

          {messages.map((message, index) => {
            const prev = messages[index - 1];
            const next = messages[index + 1];
            const showDate = !prev || dayOf(prev.at) !== dayOf(message.at);
            const showTime = !next || next.role !== message.role || Date.parse(next.at) - Date.parse(message.at) > GROUP_MS;
            return (
              <Fragment key={message.id}>
                {showDate && <div className="dcx-date"><span>{dateLabel(message.at)}</span></div>}
                {message.role === "user" ? <UserMessage message={message} /> : (
                  <AssistantMessage
                    message={message}
                    isLast={index === lastAssistant && !busyHere}
                    busy={Boolean(busy)}
                    onRetry={() => retryFrom(index)}
                    onRegenerate={() => retryFrom(index)}
                    onFeedback={(value) => updateMessage(slug, active.id, message.id, { feedback: value })}
                    onSaveNote={onSaveNote ? () => { onSaveNote(message.content); updateMessage(slug, active.id, message.id, { savedNote: true }); } : null}
                  />
                )}
                {showTime && <time className={`dcx-time is-${message.role}`} dateTime={message.at}>{timeLabel(message.at)}</time>}
              </Fragment>
            );
          })}
          {busyHere && <Working busy={busy} />}
        </div>
        {!atBottom && messages.length > 0 && <button type="button" className="dcx-jump" onClick={() => scrollToBottom()}><ArrowDown size={13} /> Jump to latest</button>}

        <div className="dcx-composer">
          {context.length > 0 && (
            <div className="dcx-context-row" aria-label="Attached context">
              {context.map((item) => {
                const Icon = CONTEXT_ICONS[item.type] || AtSign;
                return (
                  <span className="dcx-context-chip" key={item.key} title={item.type === "selected_text" ? item.text : item.label}>
                    <Icon size={12} /> <span>{item.label}</span>
                    <button type="button" onClick={() => toggleContext(item)} aria-label={`Remove ${item.label}`}><X size={11} /></button>
                  </span>
                );
              })}
            </div>
          )}
          <label htmlFor="dcx-input" className="sr-only">Message the coach</label>
          <textarea
            id="dcx-input"
            ref={inputRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder={`Ask about ${adapter.subject || `this ${adapter.noun || "page"}`}… (@ to add context)`}
          />
          <div className="dcx-composer-row">
            <button type="button" data-dcx-at className={`dcx-icon${menu === "context" ? " is-on" : ""}`} onClick={() => setMenu(menu === "context" ? "" : "context")} aria-label="Add context" aria-expanded={menu === "context"} title="Add context (@)"><AtSign size={16} /></button>
            <span className="dcx-hint">⇧ ↵ to insert a line break</span>
            {busyHere ? (
              <button type="button" className="dcx-send is-stop" onClick={stop} aria-label="Stop"><Square size={12} fill="currentColor" /></button>
            ) : (
              <button type="button" className="dcx-send" onClick={() => send(input)} disabled={!input.trim() || Boolean(busy)} aria-label="Send message" title={busy ? "Answering in another chat…" : "Send"}><ArrowUp size={16} /></button>
            )}
          </div>
          {menu === "context" && <ContextMenu groups={adapter.contextGroups()} selected={context} onToggle={toggleContext} onClose={() => setMenu("")} />}
        </div>
      </section>
    </CoachActions.Provider>
  );
}
