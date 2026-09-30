// Study planner: a deterministic capacity scheduler.
//
// Inputs are the learner's goal (deadline, minutes per weekday, content scope,
// what they already know), a DSA track and, optionally, AI from Scratch
// phases. Problems and lessons are two "streams" packed into the same days;
// each day draws first from whichever stream is furthest below its share of
// the time placed so far, so the split holds across the week without leaving
// minutes idle on short days. The scheduler:
//   1. takes the track's required items in order, minus mastered modules and
//      (optionally) problems already solved;
//   2. estimates each item's minutes from difficulty × the learner's pace;
//   3. reserves a share of every study day (20% by default) for spaced review
//      and slack;
//   4. packs items into days first-fit, never splitting an item and never
//      exceeding a day's capacity — within a module items stay in order, so a
//      later problem never lands before an earlier one;
//   5. reports what didn't fit, and the date that would fit it, instead of
//      silently overbooking.
// Same inputs → same schedule, so any plan can be explained and reproduced.
// No LLM is involved.

import { addDays, daysBetween, weekdayOf } from "./dates.js";
import { difficultyKey, estimateMinutes } from "./problems.js";

export const ROLES = [
  { id: "intern", label: "Internship", hint: "Campus or off-campus intern roles" },
  { id: "sde1", label: "SDE-1 / new grad", hint: "First full-time engineering role" },
  { id: "sde2", label: "SDE-2 and above", hint: "Experienced hire loops" },
  { id: "switch", label: "Career switch", hint: "Moving into software from another field" },
];
export const EXPERIENCE = [
  { id: "student", label: "Student" },
  { id: "0-2", label: "0–2 years" },
  { id: "2-5", label: "2–5 years" },
  { id: "5+", label: "5+ years" },
];
export const PACES = [
  { id: "relaxed", label: "Relaxed", factor: 1.3, hint: "Extra time to read and take notes" },
  { id: "steady", label: "Steady", factor: 1, hint: "Typical time per problem" },
  { id: "fast", label: "Fast", factor: 0.75, hint: "You've seen most of this before" },
];
export const STRATEGIES = [
  { id: "sequential", label: "Module by module", hint: "Finish one topic before the next — like working down a sheet" },
  { id: "interleave", label: "Interleaved", hint: "Rotate between topics each day — harder, but better for retention" },
];

export const DEFAULT_REVIEW_SHARE = 0.2;
export const DEFAULT_AIFS_SHARE = 0.4;
// AI from Scratch lessons without a time estimate are planned at this length.
export const DEFAULT_LESSON_MINUTES = 45;
export const MAX_PLAN_DAYS = 730;
// A Visual Learning pattern intro, watched before the section's first problem.
export const VISUAL_INTRO_MINUTES = 10;
export const MAX_INTROS_PER_SECTION = 2;

export function defaultGoal(today, trackId = "pattern-sprint") {
  return {
    role: "sde1",
    experience: "0-2",
    startDate: today,
    targetDate: addDays(today, 55),
    // Sunday-first to match Date#getDay: weekdays 60m, weekends 150m.
    weeklyMinutes: [150, 60, 60, 60, 60, 60, 150],
    dailyCap: 240,
    trackId,
    includeDsa: true,
    moduleIds: null, // null = every module in the track
    // AI from Scratch: which track and phases, and its share of study time.
    aifs: { enabled: false, track: "curriculum", phaseIds: null, share: DEFAULT_AIFS_SHARE },
    // Open each pattern with its Visual Learning intro. Plans made before this
    // existed have no flag, so rebuilding them doesn't add tasks unasked.
    visualIntros: true,
    masteredModuleIds: [],
    skipSolved: true,
    pace: "steady",
    strategy: "sequential",
    reviewShare: DEFAULT_REVIEW_SHARE,
  };
}

export const paceFactor = (goal) => PACES.find((pace) => pace.id === goal.pace)?.factor ?? 1;

/** Minutes of *problem* work a given day can hold, and the review reserve. */
export function dayCapacity(goal, key) {
  const raw = Math.min(goal.weeklyMinutes[weekdayOf(key)] || 0, goal.dailyCap || Infinity);
  const review = raw > 0 ? Math.round(raw * (goal.reviewShare ?? DEFAULT_REVIEW_SHARE)) : 0;
  return { total: raw, review, work: raw - review };
}

/** The ordered work list: one chain per module, items in track order. */
/**
 * DSA chains: one per module, problems in order. With `goal.visualIntros` and
 * a `visualIntros(slugs)` lookup (→ [{ path, title }], see lib/visual), each
 * section opens with the Visual Learning intro for the pattern it practises —
 * once per plan, however many sections share the pattern.
 */
export function planItems(goal, track, { problemBySlug, completed = new Set(), visualIntros = null }) {
  if (goal.includeDsa === false) return [];
  const allowed = goal.moduleIds ? new Set(goal.moduleIds) : null;
  const mastered = new Set(goal.masteredModuleIds || []);
  const factor = paceFactor(goal);
  const introsFor = goal.visualIntros && visualIntros ? visualIntros : null;
  const planned = new Set();
  return track.modules
    .filter((module) => (!allowed || allowed.has(module.id)) && !mastered.has(module.id))
    .map((module, moduleIndex) => ({
      moduleId: module.id,
      moduleTitle: module.title,
      moduleIndex,
      stream: "dsa",
      items: module.sections.flatMap((section) => {
        const problems = section.items
          .filter((item) => item.required && !item.repeat)
          .filter((item) => !(goal.skipSolved && completed.has(item.slug)))
          .map((item) => {
            const problem = problemBySlug.get(item.slug);
            return {
              kind: "problem",
              stream: "dsa",
              slug: item.slug,
              title: problem?.title || item.slug,
              difficulty: difficultyKey(problem),
              minutes: Math.max(10, Math.round((estimateMinutes(problem) * factor) / 5) * 5),
              moduleId: module.id,
              moduleTitle: module.title,
              sectionTitle: section.title,
            };
          });
        if (!introsFor || !problems.length) return problems;
        const intros = (introsFor(section.items.map((item) => item.slug)) || [])
          .filter((intro) => !planned.has(intro.path) && !(goal.skipSolved && completed.has(intro.path)))
          .slice(0, MAX_INTROS_PER_SECTION);
        intros.forEach((intro) => planned.add(intro.path));
        return [
          ...intros.map((intro) => ({
            kind: "visual",
            stream: "dsa",
            slug: intro.path,
            title: intro.title,
            minutes: round5(VISUAL_INTRO_MINUTES * factor),
            moduleId: module.id,
            moduleTitle: module.title,
            sectionTitle: `${section.title} · watch first`,
          })),
          ...problems,
        ];
      }),
    }))
    .filter((chain) => chain.items.length);
}

const round5 = (minutes) => Math.max(10, Math.round(minutes / 5) * 5);

/**
 * AI from Scratch chains: one per phase, lessons in reading order. `phases` is
 * the curriculum index (passed in, so this module never loads it itself);
 * `completed` holds finished lesson slugs alongside solved problem slugs.
 */
export function lessonChains(goal, phases, completed = new Set()) {
  const aifs = goal.aifs;
  if (!aifs?.enabled || !phases?.length) return [];
  const allowed = aifs.phaseIds ? new Set(aifs.phaseIds) : null;
  const factor = paceFactor(goal);
  return phases
    .filter((phase) => phase.track === aifs.track && (!allowed || allowed.has(phase.id)))
    .map((phase) => ({
      moduleId: phase.id,
      moduleTitle: phase.title,
      stream: "aifs",
      items: phase.lessons
        .filter((lesson) => !(goal.skipSolved && completed.has(lesson.slug)))
        .map((lesson) => ({
          kind: "lesson",
          stream: "aifs",
          slug: lesson.slug,
          title: lesson.title,
          minutes: round5((lesson.minutes || DEFAULT_LESSON_MINUTES) * factor),
          estimated: !lesson.minutes,
          moduleId: phase.id,
          moduleTitle: phase.title,
          sectionTitle: `Lesson ${lesson.n}`,
        })),
    }))
    .filter((chain) => chain.items.length);
}

export function allChains(goal, track, ctx) {
  // Without the index, lessons would silently vanish from a rebuilt plan.
  if (goal.aifs?.enabled && !ctx.aifsPhases?.length) throw new Error("AI from Scratch lessons aren't loaded yet.");
  return [...planItems(goal, track, ctx), ...lessonChains(goal, ctx.aifsPhases, ctx.completed)];
}

export const isWork = (task) => task.kind === "problem" || task.kind === "lesson" || task.kind === "visual";

/**
 * Pack chains into days from `fromDay` to `goal.targetDate`.
 * `reserved` maps day → minutes already taken (pinned or completed tasks).
 */
export function packSchedule(goal, chains, { fromDay, reserved = {}, reasonFor } = {}) {
  const heads = chains.map(() => 0);
  const tasks = [];
  const start = fromDay || goal.startDate;
  const days = Math.max(0, daysBetween(start, goal.targetDate)) + 1;
  const maxWork = Math.max(0, ...Array.from({ length: 7 }, (_, weekday) => {
    const raw = Math.min(goal.weeklyMinutes[weekday] || 0, goal.dailyCap || Infinity);
    return raw - Math.round(raw * (goal.reviewShare ?? DEFAULT_REVIEW_SHARE));
  }));
  const tooLong = [];
  chains.forEach((chain) => chain.items.forEach((item) => { if (item.minutes > maxWork) tooLong.push(item); }));
  const tooLongSlugs = new Set(tooLong.map((item) => item.slug));
  const aifsShare = goal.aifs?.enabled ? Math.min(0.9, Math.max(0.1, goal.aifs.share ?? DEFAULT_AIFS_SHARE)) : 0;
  const share = { dsa: 1 - aifsShare, aifs: aifsShare };
  const placedMinutes = { dsa: 0, aifs: 0 };
  const rotate = { dsa: 0, aifs: 0 };

  // Streams furthest below their share go first; within a stream, chains
  // stay in track order (or rotate, when interleaving).
  const eligible = () => {
    const byStream = { dsa: [], aifs: [] };
    chains.forEach((chain, index) => {
      while (heads[index] < chain.items.length && tooLongSlugs.has(chain.items[heads[index]].slug)) heads[index] += 1;
      if (heads[index] < chain.items.length) byStream[chain.stream || "dsa"].push(index);
    });
    const total = placedMinutes.dsa + placedMinutes.aifs;
    const deficit = (stream) => share[stream] * total - placedMinutes[stream];
    const streams = ["dsa", "aifs"].filter((stream) => byStream[stream].length).sort((a, b) => deficit(b) - deficit(a) || (a === "dsa" ? -1 : 1));
    return streams.flatMap((stream) => {
      const list = byStream[stream];
      if (goal.strategy !== "interleave") return list;
      const offset = rotate[stream] % list.length;
      return [...list.slice(offset), ...list.slice(0, offset)];
    });
  };

  for (let d = 0; d < days; d += 1) {
    const key = addDays(start, d);
    const capacity = dayCapacity(goal, key);
    let remaining = capacity.work - (reserved[key] || 0);
    let order = 0;
    let placedToday = false;
    if (capacity.total > 0) {
      let placed = true;
      while (placed && remaining > 0) {
        placed = false;
        for (const chainIndex of eligible()) {
          const item = chains[chainIndex].items[heads[chainIndex]];
          if (item.minutes <= remaining) {
            const kind = item.kind || "problem";
            const stream = chains[chainIndex].stream || "dsa";
            tasks.push({
              id: `${kind}:${item.slug}`,
              kind,
              stream,
              estimated: Boolean(item.estimated),
              day: key,
              order: order += 1,
              slug: item.slug,
              title: item.title,
              minutes: item.minutes,
              moduleId: item.moduleId,
              moduleTitle: item.moduleTitle,
              sectionTitle: item.sectionTitle,
              reason: reasonFor?.(item) || `Next in ${item.moduleTitle} · ${item.sectionTitle}`,
            });
            heads[chainIndex] += 1;
            remaining -= item.minutes;
            placedMinutes[stream] += item.minutes;
            placed = true;
            placedToday = true;
            if (goal.strategy === "interleave") rotate[stream] += 1;
            break;
          }
        }
      }
      if (capacity.review > 0 && (placedToday || reserved[key])) {
        tasks.push({ id: `review:${key}`, kind: "review", day: key, order: 999, minutes: capacity.review, title: "Review & buffer", reason: `${Math.round((goal.reviewShare ?? DEFAULT_REVIEW_SHARE) * 100)}% of the day kept for spaced review and slack` });
      }
    }
  }

  const unscheduled = chains.flatMap((chain, index) => chain.items.slice(heads[index])).filter((item) => !tooLongSlugs.has(item.slug));
  return { tasks, unscheduled, tooLong };
}

/** Earliest target date that fits everything, searching forward (bounded). */
export function suggestTargetDate(goal, chains, options = {}) {
  const hasCapacity = goal.weeklyMinutes.some((minutes) => minutes > 0);
  if (!hasCapacity) return null;
  let low = goal.targetDate;
  let high = addDays(goal.startDate, MAX_PLAN_DAYS);
  if (packSchedule({ ...goal, targetDate: high }, chains, options).unscheduled.length) return null;
  while (daysBetween(low, high) > 1) {
    const mid = addDays(low, Math.floor(daysBetween(low, high) / 2));
    if (packSchedule({ ...goal, targetDate: mid }, chains, options).unscheduled.length) low = mid; else high = mid;
  }
  return high;
}

export function validateGoal(goal, today) {
  const errors = [];
  if (!goal.targetDate || goal.targetDate < (goal.startDate || today)) errors.push("The target date has to be after the start date.");
  if (daysBetween(goal.startDate, goal.targetDate) > MAX_PLAN_DAYS) errors.push("Plans are limited to two years.");
  if (!goal.weeklyMinutes.some((minutes) => minutes > 0)) errors.push("Give at least one day some study time.");
  const dsa = goal.includeDsa !== false;
  if (!dsa && !goal.aifs?.enabled) errors.push("Include DSA problems, AI from Scratch lessons, or both.");
  if (dsa && goal.moduleIds && !goal.moduleIds.length) errors.push("Pick at least one module.");
  if (goal.aifs?.enabled && goal.aifs.phaseIds && !goal.aifs.phaseIds.length) errors.push("Pick at least one AI from Scratch phase.");
  return errors;
}

/** Build a complete schedule revision from a goal. */
export function buildPlan(goal, track, ctx) {
  const chains = allChains(goal, track, ctx);
  const packed = packSchedule(goal, chains, { fromDay: goal.startDate });
  return finishRevision(goal, chains, packed, { kind: "created", note: "Plan created" }, ctx);
}

function finishRevision(goal, chains, packed, meta, ctx, extraTasks = []) {
  const tasks = [...extraTasks, ...packed.tasks].sort((a, b) => a.day.localeCompare(b.day) || a.order - b.order);
  const workItems = chains.reduce((sum, chain) => sum + chain.items.length, 0);
  const warnings = [];
  let suggestedDate = null;
  if (packed.tooLong.length) warnings.push({ kind: "too-long", message: `${packed.tooLong.length} item${packed.tooLong.length === 1 ? " is" : "s are"} longer than your longest study day (${packed.tooLong.slice(0, 2).map((item) => `“${item.title}”, ${item.minutes}m`).join("; ")}${packed.tooLong.length > 2 ? "…" : ""}), so ${packed.tooLong.length === 1 ? "it" : "they"} can't be scheduled without splitting. Add time to at least one day, pick a faster pace, or leave that phase out.`, slugs: packed.tooLong.map((item) => item.slug) });
  if (packed.unscheduled.length) {
    suggestedDate = suggestTargetDate(goal, chains, { fromDay: meta.fromDay || goal.startDate, reserved: meta.reserved });
    warnings.push({ kind: "infeasible", message: `${packed.unscheduled.length} of ${workItems} items don't fit before your target date.`, slugs: packed.unscheduled.map((item) => item.slug) });
  }
  const workTasks = tasks.filter(isWork);
  return {
    id: `rev_${ctx.now || Date.now()}`,
    createdAt: new Date(ctx.now || Date.now()).toISOString(),
    kind: meta.kind,
    note: meta.note,
    goal,
    tasks,
    unscheduled: packed.unscheduled.map((item) => item.slug),
    warnings,
    suggestedDate,
    stats: {
      items: workTasks.length,
      problems: workTasks.filter((task) => task.kind === "problem").length,
      lessons: workTasks.filter((task) => task.kind === "lesson").length,
      visuals: workTasks.filter((task) => task.kind === "visual").length,
      estimatedLessons: workTasks.filter((task) => task.estimated).length,
      minutes: workTasks.reduce((sum, task) => sum + task.minutes, 0),
      lastDay: workTasks.length ? workTasks[workTasks.length - 1].day : null,
    },
    moved: meta.moved || [],
  };
}

/**
 * A task is done when ticked in the plan, or when its problem was accepted /
 * its lesson completed anywhere. `completed` holds both kinds of slug (lesson
 * slugs contain a "/", problem slugs never do, so they can't collide).
 */
export const isTaskDone = (task, taskState, completed) => Boolean(taskState?.[task.id]?.done || (isWork(task) && completed?.has(task.slug)));

/** Unfinished problem and lesson tasks on days before `today`. */
export function missedTasks(revision, taskState, completed, today) {
  return (revision?.tasks || []).filter((task) => isWork(task) && task.day < today && !isTaskDone(task, taskState, completed));
}

/**
 * Rebalance after missed days: completed and past tasks stay where they are
 * (history), pinned future tasks keep their day, and everything else still
 * outstanding is re-packed from `today`. The result lists every task that
 * moved so the learner can see why before accepting.
 */
export function rebalancePlan(revision, track, { taskState = {}, completed = new Set(), today, problemBySlug, aifsPhases, visualIntros, now }) {
  const { goal } = revision;
  const history = revision.tasks.filter((task) => task.day < today && (task.kind === "review" || isTaskDone(task, taskState, completed)));
  const pinned = revision.tasks.filter((task) => isWork(task) && task.day >= today && taskState[task.id]?.pinned && !isTaskDone(task, taskState, completed));
  const doneFuture = revision.tasks.filter((task) => isWork(task) && task.day >= today && isTaskDone(task, taskState, completed));
  const fixedSlugs = new Set([...pinned, ...doneFuture].map((task) => task.slug));
  const doneSlugs = new Set([...history, ...doneFuture].filter(isWork).map((task) => task.slug));
  const reserved = {};
  [...pinned, ...doneFuture].forEach((task) => { reserved[task.day] = (reserved[task.day] || 0) + task.minutes; });

  // Outstanding items keep their original relative order.
  const scheduledOrder = new Map(revision.tasks.filter(isWork).map((task, index) => [task.slug, index]));
  const chains = allChains(goal, track, { problemBySlug, completed, aifsPhases, visualIntros })
    .map((chain) => ({ ...chain, items: chain.items.filter((item) => !fixedSlugs.has(item.slug) && !doneSlugs.has(item.slug)) }))
    .filter((chain) => chain.items.length);
  chains.forEach((chain) => chain.items.sort((a, b) => (scheduledOrder.get(a.slug) ?? 1e9) - (scheduledOrder.get(b.slug) ?? 1e9)));

  const previousDay = new Map(revision.tasks.filter(isWork).map((task) => [task.slug, task.day]));
  const packed = packSchedule(goal, chains, {
    fromDay: today,
    reserved,
    reasonFor: (item) => (previousDay.has(item.slug) && previousDay.get(item.slug) < today ? `Carried over from ${previousDay.get(item.slug)}` : null),
  });
  const moved = packed.tasks
    .filter((task) => isWork(task) && previousDay.has(task.slug) && previousDay.get(task.slug) !== task.day)
    .map((task) => ({ slug: task.slug, title: task.title, from: previousDay.get(task.slug), to: task.day }));
  return finishRevision(goal, chains, packed, { kind: "rebalanced", note: `Rebalanced on ${today}`, moved, fromDay: today, reserved }, { now }, [...history, ...pinned, ...doneFuture]);
}

/** Summary numbers for a revision. */
export function planProgress(revision, taskState, completed, today) {
  const work = (revision?.tasks || []).filter(isWork);
  const done = work.filter((task) => isTaskDone(task, taskState, completed)).length;
  // Today isn't over, so only earlier days count as "due" when judging pace.
  const duePast = work.filter((task) => task.day < today).length;
  return {
    done,
    total: work.length,
    missed: missedTasks(revision, taskState, completed, today).length,
    // Positive = ahead of schedule, negative = behind.
    delta: done - duePast,
    onTrack: done >= duePast,
  };
}
