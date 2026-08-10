/**
 * build_interview_index.mjs — search manifest for the command palette.
 *
 * `public/data/interview-prep.json` is 13.4 MB: 1,194 lessons, each carrying
 * `content_html` and `content_text`. GlobalSearchPalette fetched that entire file
 * the first time it was opened, purely to search over lesson TITLES — then held
 * the parsed object graph (considerably larger than 13.4 MB in heap) for the rest
 * of the session, in an app that never reloads the page.
 *
 * This emits the same hierarchy with the lesson bodies stripped: ~137 KB, roughly
 * 1% of the original, and everything the palette actually reads.
 *
 * The full file is still used by InterviewPrep.jsx, which genuinely renders the
 * lesson content.
 *
 * Run via `npm run build:interview-index` (wired into `npm run build`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const SRC = path.join(root, "public", "data", "interview-prep.json");
const OUT = path.join(root, "public", "data", "interview-prep-index.json");

if (!fs.existsSync(SRC)) {
  console.warn(`build_interview_index: ${SRC} not found — skipping.`);
  process.exit(0);
}

const courses = JSON.parse(fs.readFileSync(SRC, "utf8"));

const index = courses.map((course) => ({
  id: course.id,
  course_title: course.course_title,
  chapters: (course.chapters || []).map((chapter) => ({
    id: chapter.id,
    chapter_title: chapter.chapter_title,
    lessons: (chapter.lessons || []).map((lesson) => ({
      id: lesson.id,
      lesson_title: lesson.lesson_title,
    })),
  })),
}));

fs.writeFileSync(OUT, JSON.stringify(index));

const srcMb = (fs.statSync(SRC).size / 1048576).toFixed(1);
const outKb = (fs.statSync(OUT).size / 1024).toFixed(0);
const lessons = index.reduce(
  (n, c) => n + c.chapters.reduce((m, ch) => m + ch.lessons.length, 0),
  0
);
console.log(`Wrote ${OUT} (${outKb} KB from ${srcMb} MB, ${lessons} lessons)`);
