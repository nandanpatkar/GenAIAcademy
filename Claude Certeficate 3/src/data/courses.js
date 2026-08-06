/*
 * Course registry.
 *
 * ============================================================================
 * ADDING A NEW COURSE
 * ============================================================================
 * 1. Create a folder under src/data/<your-course-id>/ mirroring the structure
 *    of src/data/claude-associate-foundations/:
 *
 *      <your-course-id>/
 *        modules/module1.js ... moduleN.js   <- teaching content + review Qs
 *        quizPartA.js / quizPartB.js         <- quiz bank (any file layout)
 *        index.js                            <- assembles the course object
 *
 * 2. Import that course object here and append it to the `eagerCourses` array
 *    below. Nothing in src/components/ needs to change — every view reads
 *    from this registry.
 *
 * The Amazon Connect track is generated rather than hand-written; see
 * tools/build-connect-data.mjs and src/data/amazon-connect/index.js.
 * ============================================================================
 *
 * COURSE SHAPE
 *
 *   {
 *     id, code, title, provider, level, description,
 *     examFormat, passMarkPercent,
 *     track?,       <- 'amazon-connect' groups and themes the course; omit for
 *                      the default track
 *     category?,    <- shelf within a track
 *     modules: [{
 *       id, number, title, shortTitle, summary, duration, lede,
 *       objectives: [string],
 *       sections: [{ id, eyebrow, duration, title, blocks: [Block] }],
 *       reviewQuestions: [{ id, question, options, correctOptionId, rationale }]
 *     }],
 *     quiz: {       <- null when a course has no scored quiz bank
 *       domains:  [{ id, title, weight, moduleId }],
 *       questions:[{
 *         id, ref, source, moduleId, domainId, question,
 *         options: [{ id, text }], correctOptionId, rationale,
 *         note?, rationaleSource?
 *       }]
 *     }
 *   }
 *
 * BLOCK TYPES understood by ModuleContent (src/components/ModuleContent.jsx):
 *
 *   { type: 'p',    text, variant?: 'lede' }
 *   { type: 'h',    level: 3 | 4, text }
 *   { type: 'ul' | 'ol', items: [string] }
 *   { type: 'code', text, language? }
 *   { type: 'table', caption?, headers: [string], rows: [[string]] }
 *   { type: 'callout', variant: 'key'|'note'|'warning'|'disclaimer',
 *                      title, body: [string] }
 *   { type: 'cards', items: [{ eyebrow, title, body }] }
 *   { type: 'steps', items: [{ title, text }] }
 *   { type: 'quote', label, text }
 *   { type: 'compare', items: [{ tone?: 'positive'|'negative', label, title, body }] }
 *   { type: 'takeaways', items: [{ title, text }] }
 *
 * Inside `text`, `**bold**` is rendered as <strong>. No other markup is parsed.
 */

import { claudeAssociateFoundations } from './claude-associate-foundations/index.js';
import { claudeDeveloperFoundations } from './claude-developer-foundations/index.js';
import { claudeArchitect } from './claude-architect/index.js';
import {
  AMAZON_CONNECT_TRACK,
  AMAZON_CONNECT_CATEGORIES,
  amazonConnectCatalog,
  loadAmazonConnectCourse,
} from './amazon-connect/index.js';

/*
 * Courses whose content ships in the initial bundle. Hand-written courses are
 * small enough to sit here; the Amazon Connect track is not, so it appears in
 * the library as metadata and loads its content on demand.
 */
const eagerCourses = [
  claudeAssociateFoundations,
  claudeDeveloperFoundations,
  claudeArchitect,
  /* <-- Add the next hand-written course object here. */
];

/*
 * Tracks are the shelves on the library screen. The first is the default one
 * every hand-written course belongs to.
 */
export const tracks = [
  {
    id: 'certifications',
    title: 'Certification courses',
    provider: 'Anthropic',
    blurb: 'Full certification prep: study modules plus a scored practice quiz.',
    categories: [],
  },
  { ...AMAZON_CONNECT_TRACK, categories: AMAZON_CONNECT_CATEGORIES },
];

/*
 * Every course in the library, content-bearing or not. Entries with
 * `lazy: true` carry metadata only — call `loadCourse` before rendering one.
 */
export const courses = [...eagerCourses, ...amazonConnectCatalog];

export function getCourseById(courseId) {
  return courses.find((course) => course.id === courseId) ?? null;
}

export function getTrackId(course) {
  return course?.track ?? 'certifications';
}

/*
 * Resolve a course to its full content. Returns a promise for lazily loaded
 * courses and the course object itself for eager ones, so callers should
 * `await` unconditionally.
 */
export function loadCourse(courseId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  if (!course.lazy) return course;
  return loadAmazonConnectCourse(courseId);
}

/*
 * What a course calls its units. The Amazon Connect exports are organised as
 * lessons rather than certification modules, and the UI should say so.
 */
export function unitLabel(course) {
  return getTrackId(course) === 'amazon-connect'
    ? { one: 'topic', many: 'topics', Cap: 'Topic' }
    : { one: 'module', many: 'modules', Cap: 'Module' };
}

/* How many units a course has, whether or not its content is loaded yet. */
export function unitCount(course) {
  return course?.modules?.length ?? course?.topicCount ?? 0;
}
