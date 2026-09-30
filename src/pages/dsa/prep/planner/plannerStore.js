// Planner persistence. A plan is a goal plus a stack of schedule revisions;
// every change (edit, rebalance) appends a revision, so "undo" is just moving
// back one. Task state (done / pinned / minutes spent) lives beside the
// revisions so it survives rescheduling.
import { useEffect, useMemo, useState } from "react";
import { categories, problemBySlug } from "../catalog";
import { useLegacyValue, useStore } from "../hooks";
import visualLinks from "../../../../data/practice/visualLinks.json";
import { useAifsProgress } from "../aifs/aifsStore";
import { useLearnerState } from "../learner";
import { KEYS } from "../keys";
import { buildAllTracks } from "../lib/curriculum";
import { buildPlan, rebalancePlan } from "../lib/planner";
import { readLegacyArray, readRaw, LEGACY_KEYS, updateStore } from "../lib/store";
import { patternForProblems } from "../lib/visual";

export const planTracks = buildAllTracks(categories, problemBySlug);
export const trackFor = (id) => planTracks.find((track) => track.id === id) || planTracks[0];

const MAX_REVISIONS = 12;
/**
 * Solved problems, completed AI from Scratch lessons and watched Visual
 * Learning lessons — what ticks plan tasks off. Task slugs don't collide:
 * problems are slugs, lessons `NN-name`, visual lessons `pattern/lesson`.
 */
const completedNow = () => new Set([
  ...readLegacyArray(LEGACY_KEYS.completed),
  ...Object.keys(readRaw(LEGACY_KEYS.aifsProgress, {})),
  ...readLegacyArray(LEGACY_KEYS.visualRead),
]);

export function usePlanDone() {
  const { completed } = useLearnerState();
  const lessons = useAifsProgress();
  const watched = useLegacyValue(LEGACY_KEYS.visualRead, []);
  return useMemo(() => new Set([...completed, ...Object.keys(lessons || {}), ...(Array.isArray(watched) ? watched : [])]), [completed, lessons, watched]);
}

/** A section's Visual Learning intros, for plans that open patterns with one. */
const visualIntros = (slugs) => patternForProblems(visualLinks, slugs)?.intros || [];

// The AI from Scratch index is ~420 KB; plans only load it when they include lessons.
let aifsPhasesPromise = null;
export const loadAifsPhases = () => {
  aifsPhasesPromise ||= import("../../../../data/aiFromScratchData").then((module) => module.AIFS_PHASES).catch((error) => { aifsPhasesPromise = null; throw error; });
  return aifsPhasesPromise;
};

export function useAifsPhases(needed) {
  const [phases, setPhases] = useState(null);
  useEffect(() => {
    if (!needed || phases) return undefined;
    let alive = true;
    loadAifsPhases().then((list) => { if (alive) setPhases(list); }).catch(() => {});
    return () => { alive = false; };
  }, [needed, phases]);
  return phases;
}

export function previewPlan(goal, aifsPhases) {
  return buildPlan(goal, trackFor(goal.trackId), { problemBySlug, completed: completedNow(), aifsPhases, visualIntros });
}

function pushRevision(state, revision) {
  const kept = state.revisions.slice(0, state.active + 1);
  const revisions = [...kept, revision].slice(-MAX_REVISIONS);
  return { ...state, goal: revision.goal, revisions, active: revisions.length - 1 };
}

export function savePlan(revision, { keepTaskState = true } = {}) {
  updateStore(KEYS.planner, null, (state) => {
    if (!state) return { goal: revision.goal, revisions: [revision], active: 0, taskState: {}, timer: null, createdAt: new Date().toISOString() };
    return pushRevision({ ...state, taskState: keepTaskState ? state.taskState : {} }, revision);
  });
}

export function previewRebalance(state, today, aifsPhases) {
  const revision = state.revisions[state.active];
  return rebalancePlan(revision, trackFor(revision.goal.trackId), { taskState: state.taskState, completed: completedNow(), today, problemBySlug, aifsPhases, visualIntros });
}

export function undoRevision() {
  updateStore(KEYS.planner, null, (state) => (state && state.active > 0 ? { ...state, goal: state.revisions[state.active - 1].goal, active: state.active - 1 } : state));
}

export function deletePlan() {
  updateStore(KEYS.planner, null, () => null);
}

export function patchTask(taskId, patch) {
  updateStore(KEYS.planner, null, (state) => (state ? { ...state, taskState: { ...state.taskState, [taskId]: { ...(state.taskState[taskId] || {}), ...patch } } } : state));
}

export function toggleTaskDone(taskId) {
  updateStore(KEYS.planner, null, (state) => {
    if (!state) return state;
    const current = state.taskState[taskId] || {};
    return { ...state, taskState: { ...state.taskState, [taskId]: { ...current, done: !current.done, doneAt: current.done ? null : new Date().toISOString() } } };
  });
}

/** Focus timer: one running task at a time; elapsed minutes fold into the task on stop. */
export function startTimer(taskId) {
  updateStore(KEYS.planner, null, (state) => {
    if (!state) return state;
    const folded = foldTimer(state);
    return { ...folded, timer: { taskId, startedAt: Date.now() } };
  });
}

export function stopTimer() {
  updateStore(KEYS.planner, null, (state) => (state ? foldTimer(state) : state));
}

function foldTimer(state) {
  if (!state.timer) return state;
  const minutes = (Date.now() - state.timer.startedAt) / 60000;
  const current = state.taskState[state.timer.taskId] || {};
  return { ...state, timer: null, taskState: { ...state.taskState, [state.timer.taskId]: { ...current, minutesSpent: (current.minutesSpent || 0) + minutes } } };
}

export const timerMinutes = (state, taskId, now = Date.now()) => {
  const base = state?.taskState?.[taskId]?.minutesSpent || 0;
  return state?.timer?.taskId === taskId ? base + (now - state.timer.startedAt) / 60000 : base;
};

export function usePlanner() {
  const [state] = useStore(KEYS.planner, null);
  return useMemo(() => ({ state, revision: state ? state.revisions[state.active] : null }), [state]);
}
