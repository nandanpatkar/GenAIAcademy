// Visual Learning inside the DSA hub: the course index bound to its data, and
// the persistence the hub adds on top of the shared viewer progress
// (components/visual/visualProgress.js), which the main sidebar viewer uses
// too — a lesson watched in either place counts in both.
import { useMemo } from "react";
import { CV_TRACKS } from "../../../../data/chaiVisualCourseData";
import visualLinks from "../../../../data/practice/visualLinks.json";
import { bumpStreak, markWatched, rememberLastLesson, VISUAL_KEYS } from "../../../../components/visual/visualProgress";
import { practiceProblems } from "../../practice/practiceData";
import { useLegacyValue } from "../hooks";
import { KEYS } from "../keys";
import { buildVisualIndex } from "../lib/visual";
import { writeStore } from "../lib/store";

export const visualIndex = buildVisualIndex({ tracks: CV_TRACKS, links: visualLinks, problems: practiceProblems });
export const DSA_TRACK = CV_TRACKS.find((track) => track.id === "dsa");

export { SECTION_TRACKS, TRACK_SECTIONS, sectionForPath } from "./sections";

/** The set of watched lesson paths, live across the hub and the main viewer. */
export function useWatched() {
  const list = useLegacyValue(VISUAL_KEYS.read, []);
  return useMemo(() => new Set(Array.isArray(list) ? list : []), [list]);
}

/** Record an opened lesson for Today's "continue watching" and the day streak. */
export function rememberVisualLesson(lesson) {
  if (!lesson) return;
  rememberLastLesson(lesson.path);
  bumpStreak();
  writeStore(KEYS.visualLast, {
    path: lesson.path,
    title: lesson.title,
    group: lesson.group.title,
    track: lesson.track.name,
    at: new Date().toISOString(),
  });
}

export { markWatched };
