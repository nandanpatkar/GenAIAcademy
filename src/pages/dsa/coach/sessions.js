import { useCallback, useMemo } from "react";
import { useStore } from "../prep/hooks";
import { uid, updateStore } from "../prep/lib/store";
import { DEFAULT_PREFS, titleFrom } from "./prompt";

/**
 * Coach chats, per problem, in the prep store (so profile export/reset cover
 * them): `coach.sessions.<slug>` = { sessions, activeId, openIds }.
 *
 * Every write is a read-modify-write on the stored value for the slug it
 * names, so an answer that arrives after the learner switched problems still
 * lands in the chat it belongs to.
 */
const MAX_SESSIONS = 30;
const MAX_MESSAGES = 80;
const MAX_OPEN = 4;

export const sessionsKey = (slug) => `coach.sessions.${slug}`;
export const PREFS_KEY = "coach.prefs";
const EMPTY = { sessions: [], activeId: "", openIds: [] };

const blankSession = () => {
  const now = new Date().toISOString();
  return { id: uid("chat"), title: "New chat", createdAt: now, updatedAt: now, messages: [] };
};

const normalize = (value) => ({
  sessions: Array.isArray(value?.sessions) ? value.sessions : [],
  activeId: typeof value?.activeId === "string" ? value.activeId : "",
  openIds: Array.isArray(value?.openIds) ? value.openIds : [],
});

export function mutateSessions(slug, updater) {
  if (!slug) return EMPTY;
  return updateStore(sessionsKey(slug), EMPTY, (stored) => {
    const next = updater(normalize(stored));
    const sessions = next.sessions.slice(0, MAX_SESSIONS).map((session) => ({ ...session, messages: session.messages.slice(-MAX_MESSAGES) }));
    const ids = new Set(sessions.map((session) => session.id));
    return { sessions, activeId: ids.has(next.activeId) ? next.activeId : sessions[0]?.id || "", openIds: next.openIds.filter((id) => ids.has(id)).slice(-MAX_OPEN) };
  });
}

const touch = (session, messages) => ({ ...session, messages, updatedAt: new Date().toISOString() });

export function useCoachSessions(slug) {
  const [stored] = useStore(sessionsKey(slug || "none"), EMPTY);
  const data = normalize(stored);
  const active = data.sessions.find((session) => session.id === data.activeId) || null;
  const open = useMemo(() => {
    const byId = new Map(data.sessions.map((session) => [session.id, session]));
    const ids = data.openIds.length ? data.openIds : active ? [active.id] : [];
    return ids.map((id) => byId.get(id)).filter(Boolean);
  }, [data.sessions, data.openIds, active]);

  /** A new chat; an empty active chat is reused instead of piling up. */
  const create = useCallback(() => {
    let id = "";
    mutateSessions(slug, (prev) => {
      const current = prev.sessions.find((session) => session.id === prev.activeId);
      if (current && !current.messages.length) { id = current.id; return prev; }
      const session = blankSession();
      id = session.id;
      return { sessions: [session, ...prev.sessions], activeId: session.id, openIds: [...prev.openIds, session.id] };
    });
    return id;
  }, [slug]);

  /** The active chat's id, creating one if there is none. */
  const ensureActive = useCallback(() => {
    let id = "";
    mutateSessions(slug, (prev) => {
      if (prev.sessions.some((session) => session.id === prev.activeId)) { id = prev.activeId; return prev; }
      const session = blankSession();
      id = session.id;
      return { sessions: [session, ...prev.sessions], activeId: session.id, openIds: [...prev.openIds, session.id] };
    });
    return id;
  }, [slug]);

  const select = useCallback((id) => mutateSessions(slug, (prev) => ({ ...prev, activeId: id, openIds: prev.openIds.includes(id) ? prev.openIds : [...prev.openIds, id] })), [slug]);

  const close = useCallback((id) => mutateSessions(slug, (prev) => {
    const openIds = prev.openIds.filter((item) => item !== id);
    const activeId = prev.activeId === id ? openIds[openIds.length - 1] || "" : prev.activeId;
    // Closing an empty chat discards it; others stay in history.
    const sessions = prev.sessions.filter((session) => session.id !== id || session.messages.length);
    return { sessions, activeId: activeId || "", openIds };
  }), [slug]);

  const remove = useCallback((id) => mutateSessions(slug, (prev) => ({
    sessions: prev.sessions.filter((session) => session.id !== id),
    activeId: prev.activeId === id ? "" : prev.activeId,
    openIds: prev.openIds.filter((item) => item !== id),
  })), [slug]);

  const rename = useCallback((id, title) => mutateSessions(slug, (prev) => ({
    ...prev,
    sessions: prev.sessions.map((session) => (session.id === id ? { ...session, title: String(title || "").trim().slice(0, 60) || session.title } : session)),
  })), [slug]);

  return { sessions: data.sessions, active, open, create, ensureActive, select, close, remove, rename };
}

/* ── Message writes (by slug + chat id, usable after the component moved on) ── */

export function appendMessage(slug, sessionId, message) {
  const entry = { id: uid("msg"), at: new Date().toISOString(), ...message };
  mutateSessions(slug, (prev) => ({
    ...prev,
    sessions: prev.sessions.map((session) => {
      if (session.id !== sessionId) return session;
      const title = session.title === "New chat" && message.role === "user" ? titleFrom(message.content) : session.title;
      return { ...touch(session, [...session.messages, entry]), title };
    }),
  }));
  return entry;
}

export function updateMessage(slug, sessionId, messageId, patch) {
  mutateSessions(slug, (prev) => ({
    ...prev,
    sessions: prev.sessions.map((session) => (session.id !== sessionId ? session : {
      ...session,
      messages: session.messages.map((message) => (message.id === messageId ? { ...message, ...(typeof patch === "function" ? patch(message) : patch) } : message)),
    })),
  }));
}

/** Drop a message and everything after it (retry / regenerate). */
export function truncateFrom(slug, sessionId, messageId) {
  mutateSessions(slug, (prev) => ({
    ...prev,
    sessions: prev.sessions.map((session) => {
      if (session.id !== sessionId) return session;
      const index = session.messages.findIndex((message) => message.id === messageId);
      return index < 0 ? session : touch(session, session.messages.slice(0, index));
    }),
  }));
}

export function useCoachPrefs() {
  const [stored, setStored] = useStore(PREFS_KEY, DEFAULT_PREFS);
  const prefs = { ...DEFAULT_PREFS, ...(stored && typeof stored === "object" ? stored : {}) };
  const update = useCallback((patch) => setStored((prev) => ({ ...DEFAULT_PREFS, ...(prev || {}), ...patch })), [setStored]);
  return [prefs, update];
}
