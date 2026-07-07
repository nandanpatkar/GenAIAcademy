import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronRight, ArrowLeft, CheckCircle2, Circle, Loader2, AlertCircle, ChevronLeft, ArrowRight, X } from "lucide-react";
import useIsMobile from "../hooks/useIsMobile";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabaseClient";
import "../styles/InterviewPrep.css";

const DATA_URL = "/data/interview-prep.json";

export default function InterviewPrep({ onClose }) {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  const [completedLessons, setCompletedLessons] = useState({});
  const hasFetchedProgress = useRef(false);
  const isProgressLoaded = useRef(false);

  // ── Load course content (lazy, only while this section is open) ──────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load Interview Prep data (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setCourses(json);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error loading interview prep data:", err);
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Load progress from Supabase ───────────────────────────────────────────
  useEffect(() => {
    if (!user || hasFetchedProgress.current) return;
    hasFetchedProgress.current = true;

    (async () => {
      const { data, error: fetchErr } = await supabase
        .from("user_interview_prep")
        .select("completed_lessons")
        .eq("id", user.id)
        .single();

      if (!fetchErr && data && data.completed_lessons) {
        const map = {};
        (data.completed_lessons || []).forEach((id) => { map[id] = true; });
        setCompletedLessons(map);
      }
      isProgressLoaded.current = true;
    })();
  }, [user]);

  // ── Debounced save of progress to Supabase ────────────────────────────────
  useEffect(() => {
    if (!user || !isProgressLoaded.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        await supabase.from("user_interview_prep").upsert({
          id: user.id,
          completed_lessons: Object.keys(completedLessons),
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Interview Prep progress sync failed:", e);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [completedLessons, user]);

  const toggleLessonComplete = (id) => {
    setCompletedLessons((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  // ── Flatten for search + lookup ───────────────────────────────────────────
  const flatLessons = useMemo(() => {
    if (!courses) return [];
    const flat = [];
    courses.forEach((course) => {
      course.chapters.forEach((chapter) => {
        chapter.lessons.forEach((lesson) => {
          flat.push({
            ...lesson,
            courseId: course.id,
            courseTitle: course.course_title,
            chapterId: chapter.id,
            chapterTitle: chapter.chapter_title,
          });
        });
      });
    });
    return flat;
  }, [courses]);

  const activeLesson = useMemo(
    () => flatLessons.find((l) => l.id === activeLessonId) || null,
    [flatLessons, activeLessonId]
  );

  const activeIndex = useMemo(
    () => flatLessons.findIndex((l) => l.id === activeLessonId),
    [flatLessons, activeLessonId]
  );

  const searchLower = search.trim().toLowerCase();
  const isSearching = searchLower.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return flatLessons
      .filter((l) =>
        l.lesson_title.toLowerCase().includes(searchLower) ||
        (l.content_text || "").toLowerCase().includes(searchLower) ||
        l.courseTitle.toLowerCase().includes(searchLower)
      )
      .slice(0, 80);
  }, [flatLessons, isSearching, searchLower]);

  const courseProgress = (course) => {
    let total = 0, done = 0;
    course.chapters.forEach((ch) => ch.lessons.forEach((l) => {
      total++;
      if (completedLessons[l.id]) done++;
    }));
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  const handleSelectLesson = (lesson) => {
    setActiveLessonId(lesson.id);
    setExpandedCourse(lesson.courseId);
    setExpandedChapter(lesson.chapterId);
  };

  const goToLesson = (offset) => {
    const next = flatLessons[activeIndex + offset];
    if (next) handleSelectLesson(next);
  };

  const showList = !isMobile || !activeLessonId;
  const showDetail = !isMobile || !!activeLessonId;

  return (
    <div className="ip-root">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="ip-header">
        {isMobile && activeLessonId && (
          <button className="ip-icon-btn" onClick={() => setActiveLessonId(null)} title="Back to list">
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="ip-search-wrap">
          <Search size={14} className="ip-search-icon" />
          <input
            className="ip-search-input"
            placeholder="Search 22 courses, chapters & questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ip-search-clear" onClick={() => setSearch("")}>
              <X size={13} />
            </button>
          )}
        </div>
        {onClose && (
          <button className="ip-icon-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="ip-body">
        {/* ── List pane ─────────────────────────────────────────────────── */}
        {showList && (
          <div className="ip-list-pane" style={isMobile ? { width: "100%" } : undefined}>
            {loading && (
              <div className="ip-state">
                <Loader2 size={20} className="ip-spin" />
                <span>Loading interview prep content…</span>
              </div>
            )}
            {error && (
              <div className="ip-state ip-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && isSearching && (
              <div className="ip-search-results">
                <div className="ip-search-count">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""}</div>
                {searchResults.map((l) => (
                  <button
                    key={l.id}
                    className={"ip-search-result" + (l.id === activeLessonId ? " active" : "")}
                    onClick={() => handleSelectLesson(l)}
                  >
                    {completedLessons[l.id] ? <CheckCircle2 size={13} className="ip-done-icon" /> : <Circle size={13} className="ip-todo-icon" />}
                    <div className="ip-search-result-text">
                      <div className="ip-sr-title">{l.lesson_title}</div>
                      <div className="ip-sr-meta">{l.courseTitle} · {l.chapterTitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && !error && !isSearching && courses && (
              <div className="ip-course-list">
                {courses.map((course) => {
                  const isOpen = expandedCourse === course.id;
                  const prog = courseProgress(course);
                  return (
                    <div key={course.id} className="ip-course-block">
                      <button
                        className="ip-course-header"
                        onClick={() => setExpandedCourse(isOpen ? null : course.id)}
                      >
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <span className="ip-course-title">{course.course_title}</span>
                        <span className="ip-course-pct">{prog.pct}%</span>
                      </button>
                      <div className="ip-course-progress-track">
                        <div className="ip-course-progress-fill" style={{ width: `${prog.pct}%` }} />
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ overflow: "hidden" }}
                          >
                            {course.chapters.map((chapter) => {
                              const chOpen = expandedChapter === chapter.id;
                              return (
                                <div key={chapter.id} className="ip-chapter-block">
                                  <button
                                    className="ip-chapter-header"
                                    onClick={() => setExpandedChapter(chOpen ? null : chapter.id)}
                                  >
                                    {chOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    <span>{chapter.chapter_title}</span>
                                    <span className="ip-chapter-count">{chapter.lessons.length}</span>
                                  </button>
                                  {chOpen && (
                                    <div className="ip-lesson-list">
                                      {chapter.lessons.map((lesson) => (
                                        <button
                                          key={lesson.id}
                                          className={"ip-lesson-item" + (lesson.id === activeLessonId ? " active" : "")}
                                          onClick={() => handleSelectLesson({ ...lesson, courseId: course.id, courseTitle: course.course_title, chapterId: chapter.id, chapterTitle: chapter.chapter_title })}
                                        >
                                          {completedLessons[lesson.id]
                                            ? <CheckCircle2 size={12} className="ip-done-icon" />
                                            : <Circle size={12} className="ip-todo-icon" />}
                                          <span>{lesson.lesson_title}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Detail pane ───────────────────────────────────────────────── */}
        {showDetail && (
          <div className="ip-detail-pane">
            {!activeLesson ? (
              <div className="ip-empty-state">
                <span>Select a question from the left to begin.</span>
              </div>
            ) : (
              <div className="ip-lesson-detail">
                <div className="ip-lesson-breadcrumb">
                  {activeLesson.courseTitle} <ChevronRight size={11} /> {activeLesson.chapterTitle}
                </div>
                <h2 className="ip-lesson-title">{activeLesson.lesson_title}</h2>

                <div
                  className="ip-content"
                  dangerouslySetInnerHTML={{ __html: activeLesson.content_html }}
                />

                <div className="ip-lesson-footer">
                  <button
                    className={"ip-complete-btn" + (completedLessons[activeLesson.id] ? " done" : "")}
                    onClick={() => toggleLessonComplete(activeLesson.id)}
                  >
                    {completedLessons[activeLesson.id] ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    {completedLessons[activeLesson.id] ? "Completed" : "Mark as complete"}
                  </button>

                  <div className="ip-nav-buttons">
                    <button
                      className="ip-nav-btn"
                      disabled={activeIndex <= 0}
                      onClick={() => goToLesson(-1)}
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <button
                      className="ip-nav-btn"
                      disabled={activeIndex < 0 || activeIndex >= flatLessons.length - 1}
                      onClick={() => goToLesson(1)}
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
