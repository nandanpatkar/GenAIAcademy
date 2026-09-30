import { useMemo } from "react";
import { useLegacyArray, useStore } from "./hooks";
import { KEYS } from "./keys";
import { LEGACY_KEYS } from "./lib/store";

/**
 * The learner's per-problem state as Sets, shared by every section that shows
 * a status: completed (accepted or manually ticked), attempted (submitted but
 * never accepted), recalled (solved again on a later day, or graded good on a
 * spaced review), plus bookmarks.
 */
export function useLearnerState() {
  const [completedList, setCompletedList] = useLegacyArray(LEGACY_KEYS.completed);
  const [bookmarkList, setBookmarkList] = useLegacyArray(LEGACY_KEYS.bookmarks);
  const [attempts] = useStore(KEYS.attempts, {});
  const [reviewCards] = useStore(KEYS.review, {});

  return useMemo(() => {
    const completed = new Set(completedList);
    const bookmarks = new Set(bookmarkList);
    const attempted = new Set();
    const recalled = new Set();
    Object.entries(attempts || {}).forEach(([slug, entry]) => {
      if (entry?.attempts && !entry.accepted) attempted.add(slug);
      if ((entry?.acceptedDays?.length || 0) >= 2) recalled.add(slug);
    });
    Object.entries(reviewCards || {}).forEach(([slug, card]) => {
      if (card?.history?.some((event) => event.grade === "good" || event.grade === "easy")) recalled.add(slug);
    });
    const toggleCompleted = (slug) => setCompletedList((list) => (list.includes(slug) ? list.filter((item) => item !== slug) : [...list, slug]));
    const toggleBookmark = (slug) => setBookmarkList((list) => (list.includes(slug) ? list.filter((item) => item !== slug) : [...list, slug]));
    return { completed, bookmarks, attempted, recalled, attempts: attempts || {}, reviewCards: reviewCards || {}, toggleCompleted, toggleBookmark };
  }, [attempts, bookmarkList, completedList, reviewCards, setBookmarkList, setCompletedList]);
}
