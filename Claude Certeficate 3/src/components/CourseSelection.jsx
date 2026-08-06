import { useId, useMemo, useState } from 'react';
import CourseCard from './CourseCard.jsx';
import Icon from './Icon.jsx';
import { getTrackId } from '../data/courses.js';

/*
 * Landing view: the library, grouped into tracks.
 *
 * With one hand-written track and thirty-odd Amazon Connect courses, an
 * unfiltered grid is hard to scan, so the tracks are separate shelves and a
 * search box filters across all of them at once. Filtering is a plain substring
 * match over the fields a learner would search by — title, description, level
 * and category — which is enough at this size and needs no index.
 */

function matches(course, query) {
  if (!query) return true;
  const haystack = [
    course.title,
    course.description,
    course.level,
    course.category,
    course.provider,
    course.code,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  /* Every word must appear, so "flows intermediate" narrows rather than widens. */
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export default function CourseSelection({
  courses,
  tracks,
  progressByCourse,
  onSelectCourse,
  loadingCourseId,
  loadError,
  trackFilter,
}) {
  const [query, setQuery] = useState('');
  const searchId = useId();

  const visible = useMemo(
    () => courses.filter((course) => matches(course, query)),
    [courses, query]
  );

  /* A deep link (?track=amazon-connect) narrows the library to one shelf, so a
     card on the parent site can land a learner directly on its track instead
     of the full, mixed library. */
  const activeTracks = useMemo(
    () => (trackFilter ? tracks.filter((track) => track.id === trackFilter) : tracks),
    [tracks, trackFilter]
  );

  const shelves = useMemo(
    () =>
      activeTracks
        .map((track) => ({
          track,
          items: visible.filter((course) => getTrackId(course) === track.id),
        }))
        .filter((shelf) => shelf.items.length > 0),
    [activeTracks, visible]
  );

  return (
    <div className="shell view">
      <div className="page-head">
        <h1 className="page-head__title">Course Library</h1>
        <p className="page-head__lede">
          Study material and scenario practice for professional certifications and for
          Amazon Connect. Open a course to read it topic by topic, or run a practice quiz
          where one is available.
        </p>
      </div>

      <div className="library-search">
        <label className="library-search__label" htmlFor={searchId}>
          Search courses
        </label>
        <div className="library-search__field">
          <Icon name="search" className="library-search__icon" />
          <input
            id={searchId}
            type="search"
            className="library-search__input"
            placeholder="Search by name, topic, or level — try “routing” or “intermediate”"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="library-search__clear"
              onClick={() => setQuery('')}
            >
              <Icon name="x" title="Clear search" />
            </button>
          ) : null}
        </div>
        <p className="library-search__count" aria-live="polite">
          {query
            ? `${visible.length} of ${courses.length} courses match “${query}”`
            : `${courses.length} courses across ${tracks.length} tracks`}
        </p>
      </div>

      {trackFilter && activeTracks.length > 0 ? (
        <p className="library-search__count">
          Showing <strong>{activeTracks[0].title}</strong> courses only.
        </p>
      ) : null}

      {loadError ? (
        <p className="blk-callout blk-callout--warning" role="alert">
          <span className="blk-callout__icon">
            <Icon name="alert" />
          </span>
          <span className="blk-callout__body">
            <span className="blk-callout__title">That course did not open</span>
            <span className="blk-callout__text">
              {courses.find((course) => course.id === loadError.courseId)?.title ??
                'The course'}{' '}
              could not be loaded: {loadError.message} Try again, or reload the page.
            </span>
          </span>
        </p>
      ) : null}

      {shelves.length === 0 ? (
        <p className="library-empty">
          No courses match <strong>{query}</strong>. Try a shorter search, or{' '}
          <button type="button" className="link-btn" onClick={() => setQuery('')}>
            clear the search
          </button>
          .
        </p>
      ) : (
        shelves.map(({ track, items }) => (
          <section
            key={track.id}
            className="library-shelf"
            data-track={track.id}
            aria-labelledby={`shelf-${track.id}`}
          >
            <div className="library-shelf__head">
              <h2 className="section-title" id={`shelf-${track.id}`}>
                {track.title}
              </h2>
              <span className="chip">
                {items.length} course{items.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="library-shelf__blurb">{track.blurb}</p>

            <div className="course-grid">
              {items.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  completedCount={progressByCourse[course.id]?.size ?? 0}
                  isLoading={loadingCourseId === course.id}
                  onOpen={() => onSelectCourse(course.id)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
