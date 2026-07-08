// src/utils/buildSearchIndex.js
//
// Flattens pathsData (curriculum) + static top-level sections + optional
// interview prep data into one searchable array, plus a lightweight
// VS-Code-"quick open"-style fuzzy scorer. Pure functions — no React,
// no Supabase calls — so it's cheap to recompute in a useMemo whenever
// pathsData changes.

// ── Static sections (top-level nav destinations in App.jsx) ────────────────
// `action` must match a case in handleSearchNavigate (see App.jsx wiring doc).
const SECTIONS = [
  { id: "sec-roadmap",    label: "Visual Roadmap",           type: "section", action: "roadmap",        icon: "Map" },
  { id: "sec-progress",   label: "Progress",                 type: "section", action: "progress",       icon: "PieChart" },
  { id: "sec-playground", label: "System Design Playground",  type: "section", action: "playground",     icon: "FlaskConical" },
  { id: "sec-algostudio", label: "Algo Studio (DSA)",         type: "section", action: "algoStudio",     icon: "Code2" },
  { id: "sec-workplace",  label: "WorkplaceLab",              type: "section", action: "workplaceLab",   icon: "StickyNote" },
  { id: "sec-interviewprep", label: "Interview Prep",         type: "section", action: "interviewPrep",  icon: "FileText" },
  { id: "sec-aiinterviewer", label: "AI Interviewer",         type: "section", action: "aiInterviewer",  icon: "Mic" },
  { id: "sec-blog",       label: "Blog",                      type: "section", action: "blog",           icon: "PenTool" },
  { id: "sec-community",  label: "Community",                 type: "section", action: "community",      icon: "Users" },
  { id: "sec-knowledge",  label: "Knowledge Graph",           type: "section", action: "knowledgeGraph", icon: "GitBranch" },
];

/**
 * @param {Object} opts
 * @param {Object} opts.pathsData - the App.jsx pathsData state (paths -> nodes -> modules -> subtopics)
 * @param {Array}  [opts.interviewCourses] - optional flattened interview prep data: [{id, title, chapters:[{id,title,lessons:[{id,title}]}]}]
 * @returns {Array} flat, searchable item list
 */
export function buildSearchIndex({ pathsData = {}, interviewCourses = [] } = {}) {
  const items = [...SECTIONS];

  // ── Curriculum: paths -> nodes -> modules -> subtopics ───────────────────
  Object.entries(pathsData).forEach(([pathKey, pathData]) => {
    if (!pathData || pathKey === "videoIntelligence") return; // skip non-path blobs

    (pathData.nodes || []).forEach((node) => {
      (node.modules || []).forEach((module) => {
        items.push({
          id: `mod-${module.id}`,
          type: "module",
          label: module.title,
          subtitle: `${pathData.label || pathKey} → ${node.title}`,
          pathKey,
          nodeId: node.id,
          moduleId: module.id,
          icon: "BookOpen",
        });

        (module.subtopics || []).forEach((sub, i) => {
          const subTitle = typeof sub === "object" ? sub.title : sub;
          if (!subTitle) return;
          items.push({
            id: `sub-${module.id}-${i}`,
            type: "subtopic",
            label: subTitle,
            subtitle: `${module.title} · ${pathData.label || pathKey}`,
            pathKey,
            nodeId: node.id,
            moduleId: module.id,
            icon: "Layers",
          });
        });
      });
    });
  });

  // ── Interview Prep: courses -> chapters -> lessons (optional) ────────────
  (interviewCourses || []).forEach((course) => {
    items.push({
      id: `iv-course-${course.id}`,
      type: "interview-course",
      label: course.title,
      subtitle: "Interview Prep",
      courseId: course.id,
      icon: "Mic",
    });
    (course.chapters || []).forEach((chapter) => {
      (chapter.lessons || []).forEach((lesson) => {
        items.push({
          id: `iv-lesson-${lesson.id}`,
          type: "interview-lesson",
          label: lesson.title,
          subtitle: `${course.title} → ${chapter.title}`,
          courseId: course.id,
          chapterId: chapter.id,
          lessonId: lesson.id,
          icon: "FileText",
        });
      });
    });
  });

  return items;
}

// ── Lightweight fuzzy scorer ────────────────────────────────────────────────
// Returns null if no match; otherwise a score where higher = better.
// Exact substring beats fuzzy subsequence; prefix matches beat mid-string.
export function fuzzyScore(query, text) {
  if (!query || !text) return null;
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  const idx = t.indexOf(q);
  if (idx !== -1) {
    return idx === 0 ? 1000 - q.length : 500 - idx;
  }

  // Fuzzy subsequence: every query char must appear in order in text.
  let qi = 0;
  let score = 0;
  let consecutive = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      consecutive++;
      score += consecutive; // reward runs of consecutive matches
    } else {
      consecutive = 0;
    }
  }
  return qi === q.length ? score : null;
}

export function searchIndex(items, query, limit = 30) {
  if (!query || !query.trim()) return [];
  const scored = [];
  for (const item of items) {
    const labelScore = fuzzyScore(query, item.label || "");
    const subScore = item.subtitle ? fuzzyScore(query, item.subtitle) : null;
    const best =
      labelScore != null ? labelScore : subScore != null ? subScore * 0.5 : null;
    if (best != null) scored.push({ ...item, _score: best });
  }
  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, limit);
}
