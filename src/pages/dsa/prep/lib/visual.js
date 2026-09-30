// Visual Learning ↔ practice problems: pure lookups over the course tree
// (chaiVisualCourseData.js) and the generated link map (visualLinks.json,
// from scripts/build_visual_links.mjs). Kept free of imports so the tests can
// build it from the raw data.

/**
 * The Visual Learning pattern (lesson group) a set of practice problems
 * practises: the group most of the linked problems belong to, when at least
 * `min` of them do, with its intro and concept lessons. Needs only the link
 * map, so pages that don't load the course tree can call it. Null when the
 * problems don't clearly share one pattern or it has no intros.
 */
export function patternForProblems(links, ids, { min = 2 } = {}) {
  const groupOf = patternForProblems.cache.get(links) || new Map(Object.entries(links.groups || {}).flatMap(([title, group]) => group.lessons.map((path) => [path, title])));
  patternForProblems.cache.set(links, groupOf);
  const counts = new Map();
  ids.forEach((id) => {
    const title = groupOf.get(links.byProblem?.[id]);
    if (title) counts.set(title, (counts.get(title) || 0) + 1);
  });
  const [title, count] = [...counts].sort((a, b) => b[1] - a[1])[0] || [];
  const intros = title ? links.groups[title].intros : [];
  if (!title || count < min || !intros.length) return null;
  return { title, intros: intros.map((path) => ({ path, title: links.introTitles?.[path] || path.split("/").pop() })) };
}
patternForProblems.cache = new WeakMap();

/**
 * `tracks` is CV_TRACKS, `links` the parsed visualLinks.json, `problems` the
 * practice problems (index.json's `problems`).
 */
export function buildVisualIndex({ tracks, links, problems }) {
  const problemById = new Map(problems.map((problem) => [problem.id, problem]));
  const lessonByPath = new Map();
  const order = [];
  tracks.forEach((track) => track.groups.forEach((group) => group.items.forEach((item, indexInGroup) => {
    lessonByPath.set(item.path, { ...item, track, group, indexInGroup });
    order.push(item.path);
  })));

  const locked = new Set(links.locked || []);
  const byLesson = links.byLesson || {};
  const byProblem = links.byProblem || {};
  const groups = links.groups || {};
  const byTopic = links.byTopic || {};
  const introPaths = new Set(Object.values(groups).flatMap((entry) => entry.intros || []));

  const lesson = (path) => (locked.has(path) ? null : lessonByPath.get(path) || null);

  const problemsForLesson = (path) => (byLesson[path] || []).map((id) => problemById.get(id)).filter(Boolean);

  const lessonForProblem = (id) => lesson(byProblem[id]);

  /** Every problem linked to a lesson in the same pattern, the lesson's own first. */
  const patternProblems = (path) => {
    const entry = lessonByPath.get(path);
    if (!entry) return [];
    const own = problemsForLesson(path);
    const seen = new Set(own.map((problem) => problem.id));
    const rest = [];
    entry.group.items.forEach((item) => problemsForLesson(item.path).forEach((problem) => {
      if (!seen.has(problem.id)) { seen.add(problem.id); rest.push(problem); }
    }));
    return [...own, ...rest];
  };

  /** Intro and concept lessons that teach a practice topic, in course order. */
  const introsForTopic = (topic) => {
    const seen = new Set();
    return (byTopic[topic] || [])
      .flatMap((title) => groups[title]?.intros || [])
      .filter((path) => (seen.has(path) ? false : seen.add(path)))
      .map(lesson)
      .filter(Boolean);
  };

  /** The lesson groups (patterns) teaching a practice topic. */
  const groupsForTopic = (topic) => (byTopic[topic] || []).map((title) => ({ title, ...groups[title] }));

  /** Practice topics a lesson group maps to. */
  const topicsForGroup = (title) => groups[title]?.topics || [];

  const neighbours = (path) => {
    const at = order.indexOf(path);
    const entry = lessonByPath.get(path);
    const sameTrack = (candidate) => candidate && lessonByPath.get(candidate)?.track.id === entry?.track.id;
    return {
      previous: at > 0 && sameTrack(order[at - 1]) ? lessonByPath.get(order[at - 1]) : null,
      next: at >= 0 && sameTrack(order[at + 1]) ? lessonByPath.get(order[at + 1]) : null,
    };
  };

  /** First lesson of a track not yet watched, in course order. */
  const nextUnwatched = (track, watched) => {
    for (const group of track.groups) {
      for (const item of group.items) if (!watched.has(item.path) && !locked.has(item.path)) return lessonByPath.get(item.path);
    }
    return null;
  };

  /** Lessons across every track whose title, subtitle or pattern contains the query. */
  const search = (query, limit = 40) => {
    const q = String(query || "").trim().toLowerCase();
    if (q.length < 2) return [];
    const hits = [];
    for (const path of order) {
      const entry = lessonByPath.get(path);
      if (`${entry.title} ${entry.subtitle || ""} ${entry.group.title}`.toLowerCase().includes(q)) hits.push(entry);
      if (hits.length >= limit) break;
    }
    return hits;
  };

  return {
    tracks,
    order,
    lesson,
    lessonByPath,
    isLocked: (path) => locked.has(path),
    isIntro: (path) => introPaths.has(path),
    problemsForLesson,
    lessonForProblem,
    patternProblems,
    introsForTopic,
    groupsForTopic,
    topicsForGroup,
    neighbours,
    nextUnwatched,
    search,
    hasVisual: (id) => Boolean(byProblem[id] && !locked.has(byProblem[id])),
  };
}
