import { useCallback, useEffect, useRef, useState } from "react";
import { readLegacyArray, readRaw, readStore, STORE_EVENT, STORE_PREFIX, updateStore, writeLegacyArray } from "./lib/store";

const changedKey = (event) => event?.detail?.key ?? event?.key ?? null;

function useSubscription(fullKey, refresh, extraEvents = []) {
  useEffect(() => {
    const onChange = (event) => {
      const key = changedKey(event);
      if (!key || key === "*" || key === fullKey) refresh();
    };
    window.addEventListener(STORE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    extraEvents.forEach((name) => window.addEventListener(name, refresh));
    return () => {
      window.removeEventListener(STORE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
      extraEvents.forEach((name) => window.removeEventListener(name, refresh));
    };
    // extraEvents is a static list at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey, refresh]);
}

/**
 * A stored collection as React state. The setter accepts a value or an updater
 * and always applies it to the latest stored copy, so two sections writing the
 * same key never clobber each other with stale state.
 */
export function useStore(key, fallback) {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState(() => readStore(key, fallback));
  const refresh = useCallback(() => setValue(readStore(key, fallbackRef.current)), [key]);

  useEffect(refresh, [refresh]);
  useSubscription(STORE_PREFIX + key, refresh);

  const update = useCallback((next) => {
    updateStore(key, fallbackRef.current, (current) => (typeof next === "function" ? next(current) : next));
  }, [key]);

  return [value, update];
}

/** The pre-existing `leetcode_*` / bookmark arrays, shared with the rest of the app. */
export function useLegacyArray(key) {
  const [value, setValue] = useState(() => readLegacyArray(key));
  const refresh = useCallback(() => setValue(readLegacyArray(key)), [key]);
  useSubscription(key, refresh, ["leetcode-progress"]);
  const update = useCallback((next) => {
    const current = readLegacyArray(key);
    writeLegacyArray(key, typeof next === "function" ? next(current) : next);
  }, [key]);
  return [value, update];
}

/** Re-render on an interval — countdowns and "due now" labels. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

/** Debounced autosave: calls `save(value)` once `value` stops changing. */
export function useAutosave(value, save, delay = 600, enabled = true) {
  const saveRef = useRef(save);
  saveRef.current = save;
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return undefined; }
    if (!enabled) return undefined;
    const timer = window.setTimeout(() => saveRef.current(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay, enabled]);
}

/** A JSON value under a key outside the hub's prefix (e.g. the shared `aifs_progress`). */
export function useLegacyValue(key, fallback) {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState(() => readRaw(key, fallback));
  const refresh = useCallback(() => setValue(readRaw(key, fallbackRef.current)), [key]);
  useSubscription(key, refresh);
  return value;
}
