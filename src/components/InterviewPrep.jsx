import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronRight, ArrowLeft, CheckCircle2, Circle,
  Loader2, AlertCircle, X, BookOpen, Layers, Target,
  Zap, ArrowRight, ChevronLeft, ChevronDown, Hash,
  BarChart2, Clock, Star, Plus, Download, Edit3, Save, Trash2, Edit2,
  Bot, Send, Globe, NotebookText
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useIsMobile from "../hooks/useIsMobile";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabaseClient";
import { askInterviewPrepBot } from "../services/aiService";
import ApiBeamConnectionNotice from "./ApiBeamConnectionNotice";
import { searchWeb } from "../services/webSearchService";
import { tiptapToText, extractKeywords, keywordOverlapScore } from "../utils/tiptapToText";
import "../styles/InterviewPrep.css";

const DATA_URL = "/data/interview-prep.json";

const COURSE_COLORS = [
  "#00ff88","#0088ff","#a855f7","#f59e0b",
  "#f43f5e","#22d3ee","#84cc16","#fb923c",
  "#ec4899","#14b8a6","#8b5cf6","#f97316",
];

// View levels for the drill-down roadmap
const VIEW = { COURSES: "courses", CHAPTERS: "chapters", LESSONS: "lessons" };

export default function InterviewPrep({ onClose, initialLessonId = null, pathsData = {} }) {
  const isMobile = useIsMobile();
  const { user, isAdmin } = useAuth();

  const [courses, setCourses]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const hasFetchedProgress  = useRef(false);
  const isProgressLoaded    = useRef(false);

  // Drill-down state
  const [view, setView]                   = useState(VIEW.COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [navDirection, setNavDirection]         = useState(1);

  // Admin / Edit state
  const [isEditMode, setIsEditMode] = useState(false);
  const [addModal, setAddModal] = useState({ open: false, mode: 'add', type: null, parentId: null, itemToEdit: null });
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");

  // AI Tutor chat state — mirrors QuizApp's aiChatOpen/aiMessages/aiInput/aiLoading pattern
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadingLabel, setAiLoadingLabel] = useState("Thinking...");

  // AI Tutor context toggles — both independently ON/OFF
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useCourseNotes, setUseCourseNotes] = useState(false);

  // Course notes: fetched once (lazily, on first use) and cached for the session
  const notesCache = useRef(null); // { moduleId: plainTextNote }
  const hasFetchedNotes = useRef(false);

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    fetch(DATA_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => { if (!cancelled) { setCourses(json); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // ── Progress sync ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || hasFetchedProgress.current) return;
    hasFetchedProgress.current = true;
    (async () => {
      const { data } = await supabase.from("user_interview_prep")
        .select("completed_lessons").eq("id", user.id).single();
      if (data?.completed_lessons) {
        const m = {};
        data.completed_lessons.forEach(id => { m[id] = true; });
        setCompletedLessons(m);
      }
      isProgressLoaded.current = true;
    })();
  }, [user]);

  useEffect(() => {
    if (!user || !isProgressLoaded.current) return;
    const tid = setTimeout(async () => {
      try {
        await supabase.from("user_interview_prep").upsert({
          id: user.id,
          completed_lessons: Object.keys(completedLessons),
          updated_at: new Date().toISOString(),
        });
      } catch (e) { console.error(e); }
    }, 1500);
    return () => clearTimeout(tid);
  }, [completedLessons, user]);

  const toggleDone = (id) =>
    setCompletedLessons(prev => {
      const n = { ...prev };
      if (n[id]) delete n[id]; else n[id] = true;
      return n;
    });

  // ── Flat list for search + nav ────────────────────────────────────────────
  const flatLessons = useMemo(() => {
    if (!courses) return [];
    const out = [];
    courses.forEach((course, ci) => {
      course.chapters.forEach(ch => {
        ch.lessons.forEach(lesson => {
          out.push({
            ...lesson,
            courseId: course.id, courseTitle: course.course_title,
            courseColor: COURSE_COLORS[ci % COURSE_COLORS.length],
            chapterId: ch.id, chapterTitle: ch.chapter_title,
          });
        });
      });
    });
    return out;
  }, [courses]);

  const activeLesson = useMemo(
    () => flatLessons.find(l => l.id === activeLessonId) || null,
    [flatLessons, activeLessonId]
  );
  const activeIndex = useMemo(
    () => flatLessons.findIndex(l => l.id === activeLessonId),
    [flatLessons, activeLessonId]
  );

  // ── Search ────────────────────────────────────────────────────────────────
  const searchLower = search.trim().toLowerCase();
  const isSearching = searchLower.length > 0;
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return flatLessons.filter(l =>
      l.lesson_title.toLowerCase().includes(searchLower) ||
      (l.content_text || "").toLowerCase().includes(searchLower) ||
      l.courseTitle.toLowerCase().includes(searchLower)
    ).slice(0, 80);
  }, [flatLessons, isSearching, searchLower]);

  // ── Derived data for current view ─────────────────────────────────────────
  const selectedCourse = useMemo(
    () => courses?.find(c => c.id === selectedCourseId) || null,
    [courses, selectedCourseId]
  );
  const selectedChapter = useMemo(
    () => selectedCourse?.chapters.find(ch => ch.id === selectedChapterId) || null,
    [selectedCourse, selectedChapterId]
  );

  const courseColor = (ci) => COURSE_COLORS[ci % COURSE_COLORS.length];

  const courseProgress = (course, ci) => {
    let total = 0, done = 0;
    course.chapters.forEach(ch => ch.lessons.forEach(l => {
      total++; if (completedLessons[l.id]) done++;
    }));
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0, color: courseColor(ci) };
  };

  // ── Navigation helpers ────────────────────────────────────────────────────
  const openCourse = (course) => {
    setSelectedCourseId(course.id);
    setView(VIEW.CHAPTERS);
  };

  const openChapter = (chapter) => {
    setSelectedChapterId(chapter.id);
    setView(VIEW.LESSONS);
  };

  const openLesson = (lesson, course, chapter) => {
    const newIndex = flatLessons.findIndex(l => l.id === lesson.id);
    setNavDirection(newIndex > activeIndex ? 1 : -1);
    setActiveLessonId(lesson.id);
    setSelectedCourseId(course.id);
    setSelectedChapterId(chapter.id);
  };

  const goBack = () => {
    if (view === VIEW.LESSONS) { setView(VIEW.CHAPTERS); setActiveLessonId(null); }
    else if (view === VIEW.CHAPTERS) { setView(VIEW.COURSES); setSelectedCourseId(null); }
  };

  const goToLesson = (offset) => {
    setNavDirection(offset > 0 ? 1 : -1);
    const next = flatLessons[activeIndex + offset];
    if (next) setActiveLessonId(next.id);
  };

  // ── Deep-link from Global Search (Cmd+K) ────────────────────────────────
  const hasAppliedDeepLink = useRef(false);
  useEffect(() => {
    if (!courses || !initialLessonId || hasAppliedDeepLink.current) return;
    for (const course of courses) {
      for (const chapter of course.chapters) {
        const lesson = chapter.lessons.find(l => l.id === initialLessonId);
        if (lesson) {
          setView(VIEW.LESSONS);
          openLesson(lesson, course, chapter);
          hasAppliedDeepLink.current = true;
          return;
        }
      }
    }
  }, [courses, initialLessonId]);

  // ── AI Tutor: reset chat whenever the active question changes ──────────
  useEffect(() => {
    setAiMessages([]);
    setAiChatOpen(false);
  }, [activeLessonId]);

  // Flat map moduleId -> module (for resolving note labels + keyword matching)
  const moduleIndex = useMemo(() => {
    const map = {};
    Object.values(pathsData || {}).forEach(pd => {
      (pd?.nodes || []).forEach(node => {
        (node.modules || []).forEach(module => { map[module.id] = module; });
      });
    });
    return map;
  }, [pathsData]);

  // Lazily fetch all of the user's module notes once per session (only when
  // the Course Notes toggle is actually used — not on every app load).
  const fetchNotesIfNeeded = async () => {
    if (hasFetchedNotes.current || !user) return;
    hasFetchedNotes.current = true;
    try {
      const { data, error } = await supabase
        .from("module_notes")
        .select("module_id, content")
        .eq("user_id", user.id);
      if (error) throw error;
      const map = {};
      (data || []).forEach(row => {
        const text = tiptapToText(row.content).trim();
        if (text) map[row.module_id] = text;
      });
      notesCache.current = map;
    } catch (err) {
      console.error("Failed to load course notes for AI Tutor:", err);
      notesCache.current = {};
      hasFetchedNotes.current = false; // allow retry next time
    }
  };

  // Keyword-overlap match between the current question and the user's notes
  const findRelevantNotes = (lessonContext, maxNotes = 2) => {
    if (!notesCache.current) return [];
    const lessonKeywords = extractKeywords(
      [lessonContext.lessonTitle, lessonContext.courseTitle, lessonContext.chapterTitle].join(" ")
    );
    const scored = Object.entries(notesCache.current).map(([moduleId, text]) => {
      const module = moduleIndex[moduleId];
      const moduleTitle = module?.title || "Your Notes";
      const moduleKeywords = extractKeywords([moduleTitle, module?.subtitle || "", text].join(" "));
      return { moduleTitle, text: text.slice(0, 500), score: keywordOverlapScore(lessonKeywords, moduleKeywords) };
    });
    return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, maxNotes);
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim() || aiLoading || !activeLesson) return;
    const query = aiInput;
    setAiInput("");
    const newMsg = { role: 'user', text: query };
    setAiMessages(prev => [...prev, newMsg]);
    setAiLoading(true);
    setAiLoadingLabel("Thinking...");

    try {
      const lessonContext = {
        courseTitle: activeLesson.courseTitle,
        chapterTitle: activeLesson.chapterTitle,
        lessonTitle: activeLesson.lesson_title,
        answerText: activeLesson.content_text,
      };

      let webResults = [];
      let courseNotes = [];

      if (useWebSearch) {
        setAiLoadingLabel("Searching the web...");
        try {
          webResults = await searchWeb(`${activeLesson.lesson_title} ${query}`.slice(0, 300));
        } catch (err) {
          console.error("Web search failed, continuing without it:", err);
        }
      }

      if (useCourseNotes) {
        setAiLoadingLabel("Checking your notes...");
        await fetchNotesIfNeeded();
        courseNotes = findRelevantNotes(lessonContext);
      }

      setAiLoadingLabel("Thinking...");
      const response = await askInterviewPrepBot(lessonContext, aiMessages, query, { webResults, courseNotes });
      const botText = typeof response === 'string' ? response : (response?.answer || response?.content || JSON.stringify(response));

      setAiMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (e) {
      setAiMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the AI." }]);
    } finally {
      setAiLoading(false);
    }
  };

  // ── Admin Actions ─────────────────────────────────────────────────────────
  const handleExportJson = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview-prep.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const submitAddItem = () => {
    if (!newItemTitle.trim()) return;
    const newCourses = [...courses];

    if (addModal.mode === 'add') {
      if (addModal.type === "course") {
        newCourses.push({
          id: Date.now().toString(),
          course_title: newItemTitle,
          chapters: []
        });
      } else if (addModal.type === "chapter") {
        const course = newCourses.find(c => c.id === addModal.parentId);
        if (course) {
          course.chapters.push({
            id: Date.now().toString(),
            chapter_title: newItemTitle,
            lessons: []
          });
        }
      } else if (addModal.type === "lesson") {
        const course = newCourses.find(c => c.id === selectedCourseId);
        if (course) {
          const chapter = course.chapters.find(ch => ch.id === addModal.parentId);
          if (chapter) {
            chapter.lessons.push({
              id: Date.now().toString(),
              lesson_title: newItemTitle,
              content_html: `<div class="ip-content"><p>${newItemContent.replace(/\n/g, '<br/>')}</p></div>`,
              content_text: newItemContent
            });
          }
        }
      }
    } else if (addModal.mode === 'edit') {
      if (addModal.type === "course") {
        const course = newCourses.find(c => c.id === addModal.itemToEdit.id);
        if (course) course.course_title = newItemTitle;
      } else if (addModal.type === "chapter") {
        const course = newCourses.find(c => c.id === selectedCourseId);
        if (course) {
          const chapter = course.chapters.find(ch => ch.id === addModal.itemToEdit.id);
          if (chapter) chapter.chapter_title = newItemTitle;
        }
      } else if (addModal.type === "lesson") {
        const course = newCourses.find(c => c.id === selectedCourseId);
        if (course) {
          const chapter = course.chapters.find(ch => ch.id === selectedChapterId);
          if (chapter) {
            const lesson = chapter.lessons.find(l => l.id === addModal.itemToEdit.id);
            if (lesson) {
              lesson.lesson_title = newItemTitle;
              lesson.content_html = `<div class="ip-content"><p>${newItemContent.replace(/\n/g, '<br/>')}</p></div>`;
              lesson.content_text = newItemContent;
            }
          }
        }
      }
    }

    setCourses(newCourses);
    setAddModal({ open: false, mode: 'add', type: null, parentId: null, itemToEdit: null });
    setNewItemTitle("");
    setNewItemContent("");
  };

  const handleDelete = (type, id, parentId = null) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    const newCourses = [...courses];
    
    if (type === 'course') {
      const idx = newCourses.findIndex(c => c.id === id);
      if (idx !== -1) newCourses.splice(idx, 1);
    } else if (type === 'chapter') {
      const course = newCourses.find(c => c.id === parentId);
      if (course) {
        const idx = course.chapters.findIndex(ch => ch.id === id);
        if (idx !== -1) course.chapters.splice(idx, 1);
      }
    } else if (type === 'lesson') {
      const course = newCourses.find(c => c.id === selectedCourseId);
      if (course) {
        const chapter = course.chapters.find(ch => ch.id === parentId);
        if (chapter) {
          const idx = chapter.lessons.findIndex(l => l.id === id);
          if (idx !== -1) chapter.lessons.splice(idx, 1);
        }
      }
    }
    setCourses(newCourses);
  };

  const showList   = !isMobile || !activeLessonId;
  const showDetail = !isMobile || !!activeLessonId;

  const totalLessons    = flatLessons.length;
  const completedCount  = Object.keys(completedLessons).length;
  const overallPct      = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // ── Breadcrumb label ──────────────────────────────────────────────────────
  const breadcrumb = () => {
    if (view === VIEW.CHAPTERS && selectedCourse) return selectedCourse.course_title;
    if (view === VIEW.LESSONS && selectedCourse && selectedChapter)
      return `${selectedCourse.course_title} › ${selectedChapter.chapter_title}`;
    return null;
  };

  return (
    <div className="ip-root">
      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <div className="ip-topbar">
        <div className="ip-topbar-left">
          {isMobile && activeLessonId && (
            <button className="ip-icon-btn" onClick={() => setActiveLessonId(null)}><ArrowLeft size={16} /></button>
          )}
          {!isMobile && view !== VIEW.COURSES && (
            <button className="ip-back-btn" onClick={goBack}>
              <ChevronLeft size={15} /> Back
            </button>
          )}
          <div className="ip-brand">
            <Zap size={14} className="ip-brand-icon" />
            <span className="ip-brand-text">INTERVIEW PREP</span>
          </div>
          {!isMobile && (
            <div className="ip-overall-progress">
              <div className="ip-overall-bar">
                <div className="ip-overall-fill" style={{ width: `${overallPct}%` }} />
              </div>
              <span className="ip-overall-label">{completedCount}/{totalLessons}</span>
            </div>
          )}
        </div>

        <div className="ip-search-wrap">
          <Search size={13} className="ip-search-icon" />
          <input
            className="ip-search-input"
            placeholder="Search courses, chapters & questions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="ip-search-clear" onClick={() => setSearch("")}><X size={13} /></button>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAdmin && (
            <button 
              className={`ip-admin-toggle ${isEditMode ? 'active' : ''}`} 
              onClick={() => setIsEditMode(!isEditMode)}
              title="Toggle Edit Mode"
            >
              <Edit3 size={15} /> {isEditMode && "Edit Mode"}
            </button>
          )}
          {isEditMode && (
            <button className="ip-export-btn" onClick={handleExportJson} title="Export updated JSON">
              <Download size={15} /> Export
            </button>
          )}
          {onClose && <button className="ip-icon-btn" onClick={onClose}><X size={16} /></button>}
        </div>
      </div>

      <div className="ip-body">
        {/* ── Left pane ────────────────────────────────────────────────── */}
        {showList && (
          <div className="ip-list-pane" style={isMobile ? { width: "100%" } : undefined}>

            {/* Mobile back */}
            {isMobile && view !== VIEW.COURSES && (
              <button className="ip-mobile-back" onClick={goBack}>
                <ChevronLeft size={14} /> {view === VIEW.CHAPTERS ? "All Courses" : selectedCourse?.course_title}
              </button>
            )}

            {/* Breadcrumb trail */}
            {breadcrumb() && (
              <div className="ip-breadcrumb">
                <span onClick={() => { setView(VIEW.COURSES); setSelectedCourseId(null); setActiveLessonId(null); }} className="ip-bc-link">All Courses</span>
                {view === VIEW.LESSONS && (
                  <>
                    <ChevronRight size={11} />
                    <span onClick={() => { setView(VIEW.CHAPTERS); setActiveLessonId(null); }} className="ip-bc-link">{selectedCourse?.course_title}</span>
                    <ChevronRight size={11} />
                    <span className="ip-bc-current">{selectedChapter?.chapter_title}</span>
                  </>
                )}
                {view === VIEW.CHAPTERS && (
                  <>
                    <ChevronRight size={11} />
                    <span className="ip-bc-current">{selectedCourse?.course_title}</span>
                  </>
                )}
              </div>
            )}

            {/* Loading / error */}
            {loading && <div className="ip-state"><Loader2 size={18} className="ip-spin" /><span>Loading…</span></div>}
            {error   && <div className="ip-state ip-error"><AlertCircle size={18} /><span>{error}</span></div>}

            {/* ── Search results ──────────────────────────────────────── */}
            {!loading && !error && isSearching && (
              <div className="ip-search-results-pane">
                <div className="ip-search-count">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""}</div>
                {searchResults.map(l => (
                  <button
                    key={l.id}
                    className={"ip-search-result" + (l.id === activeLessonId ? " active" : "")}
                    style={{ "--sr-color": l.courseColor }}
                    onClick={() => {
                      setActiveLessonId(l.id);
                      setSelectedCourseId(l.courseId);
                      setSelectedChapterId(l.chapterId);
                    }}
                  >
                    {completedLessons[l.id]
                      ? <CheckCircle2 size={13} className="ip-done-icon" />
                      : <Circle size={13} className="ip-todo-icon" />}
                    <div>
                      <div className="ip-sr-title">{l.lesson_title}</div>
                      <div className="ip-sr-meta">{l.courseTitle} · {l.chapterTitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ── COURSES view ─────────────────────────────────────────── */}
            {!loading && !error && !isSearching && view === VIEW.COURSES && courses && (
              <div className="ip-roadmap">
                <div className="ip-spine" />
                {courses.map((course, ci) => {
                  const prog = courseProgress(course, ci);
                  return (
                    <motion.div
                      key={course.id}
                      className="ip-rm-node course-node"
                      style={{ "--node-color": prog.color }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: ci * 0.04 }}
                    >
                      <div className="ip-rm-dot glow" />
                      <div className="ip-rm-string" />
                      <button className="ip-course-card" onClick={() => openCourse(course)}>
                        {isEditMode && (
                          <div className="ip-card-actions">
                            <button className="ip-action-btn edit" onClick={(e) => { e.stopPropagation(); setNewItemTitle(course.course_title); setAddModal({ open: true, mode: 'edit', type: 'course', parentId: null, itemToEdit: course }); }}><Edit2 size={13} /></button>
                            <button className="ip-action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete('course', course.id); }}><Trash2 size={13} /></button>
                          </div>
                        )}
                        <div className="ip-cc-top">
                          <div className="ip-cc-icon" style={{ background: `${prog.color}18`, border: `1px solid ${prog.color}40` }}>
                            <BookOpen size={14} style={{ color: prog.color }} />
                          </div>
                          <span className="ip-cc-badge" style={{ color: prog.color, borderColor: `${prog.color}40`, background: `${prog.color}12` }}>COURSE</span>
                          <span className="ip-cc-pct" style={{ color: prog.color }}>{prog.pct}%</span>
                          <ChevronRight size={14} className="ip-cc-chevron" />
                        </div>
                        <div className="ip-cc-title">{course.course_title}</div>
                        <div className="ip-cc-meta">
                          <span><Layers size={10} />{course.chapters.length} chapters</span>
                          <span><Hash size={10} />{prog.total} questions</span>
                          <span><CheckCircle2 size={10} />{prog.done} done</span>
                        </div>
                        <div className="ip-cc-progress">
                          <div className="ip-cc-prog-fill" style={{ width: `${prog.pct}%`, background: prog.color }} />
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
                {isEditMode && (
                  <div className="ip-add-node course-add">
                    <button className="ip-add-btn" onClick={() => setAddModal({ open: true, type: 'course', parentId: null })}>
                      <Plus size={16} /> Add Course
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── CHAPTERS view ─────────────────────────────────────────── */}
            {!loading && !error && !isSearching && view === VIEW.CHAPTERS && selectedCourse && (() => {
              const ci = courses.findIndex(c => c.id === selectedCourse.id);
              const color = courseColor(ci);
              return (
                <div className="ip-roadmap">
                  <div className="ip-spine" />
                  <div className="ip-view-header" style={{ "--vh-color": color }}>
                    <div className="ip-vh-dot" />
                    <div className="ip-vh-label">{selectedCourse.course_title}</div>
                  </div>
                  {selectedCourse.chapters.map((chapter, chi) => {
                    const chDone = chapter.lessons.filter(l => completedLessons[l.id]).length;
                    const chPct = chapter.lessons.length ? Math.round((chDone / chapter.lessons.length) * 100) : 0;
                    const isLeft = chi % 2 === 0;
                    return (
                      <motion.div
                        key={chapter.id}
                        className={`ip-rm-node chapter-node ${isLeft ? "left" : "right"}`}
                        style={{ "--node-color": color }}
                        initial={{ opacity: 0, x: isLeft ? -12 : 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: chi * 0.04 }}
                      >
                        <div className="ip-rm-dot" />
                        <div className="ip-rm-arm" />
                        <button className="ip-chapter-card" onClick={() => openChapter(chapter)}>
                          {isEditMode && (
                            <div className="ip-card-actions">
                              <button className="ip-action-btn edit" onClick={(e) => { e.stopPropagation(); setNewItemTitle(chapter.chapter_title); setAddModal({ open: true, mode: 'edit', type: 'chapter', parentId: selectedCourse.id, itemToEdit: chapter }); }}><Edit2 size={13} /></button>
                              <button className="ip-action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete('chapter', chapter.id, selectedCourse.id); }}><Trash2 size={13} /></button>
                            </div>
                          )}
                          <div className="ip-chc-top">
                            <span className="ip-chc-num" style={{ color }}>{String(chi + 1).padStart(2, "0")}</span>
                            <span className="ip-chc-qcount">{chapter.lessons.length} Q</span>
                            <ChevronRight size={13} className="ip-cc-chevron" />
                          </div>
                          <div className="ip-chc-title">{chapter.chapter_title}</div>
                          <div className="ip-chc-footer">
                            <div className="ip-chc-bar">
                              <div className="ip-chc-fill" style={{ width: `${chPct}%`, background: color }} />
                            </div>
                            <span style={{ color }} className="ip-chc-pct">{chDone}/{chapter.lessons.length}</span>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                  {isEditMode && (
                    <div className="ip-add-node chapter-add">
                      <button className="ip-add-btn" onClick={() => setAddModal({ open: true, type: 'chapter', parentId: selectedCourse.id })}>
                        <Plus size={16} /> Add Chapter
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── LESSONS view ─────────────────────────────────────────── */}
            {!loading && !error && !isSearching && view === VIEW.LESSONS && selectedCourse && selectedChapter && (() => {
              const ci = courses.findIndex(c => c.id === selectedCourse.id);
              const color = courseColor(ci);
              return (
                <div className="ip-roadmap lessons-view">
                  <div className="ip-spine" />
                  <div className="ip-view-header" style={{ "--vh-color": color }}>
                    <div className="ip-vh-dot" />
                    <div className="ip-vh-label">{selectedChapter.chapter_title}</div>
                  </div>
                  {selectedChapter.lessons.map((lesson, li) => {
                    const isDone = !!completedLessons[lesson.id];
                    const isActive = lesson.id === activeLessonId;
                    const isLeft = li % 2 === 0;
                    return (
                      <motion.div
                        key={lesson.id}
                        className={`ip-rm-node lesson-node ${isLeft ? "left" : "right"} ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                        style={{ "--node-color": color }}
                        initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: li * 0.03 }}
                      >
                        <div className="ip-rm-dot small" />
                        <div className="ip-rm-string-h" />
                        <button
                          className="ip-lesson-card"
                          onClick={() => openLesson(lesson, selectedCourse, selectedChapter)}
                        >
                          {isEditMode && (
                            <div className="ip-card-actions">
                              <button className="ip-action-btn edit" onClick={(e) => { e.stopPropagation(); setNewItemTitle(lesson.lesson_title); setNewItemContent(lesson.content_text || ""); setAddModal({ open: true, mode: 'edit', type: 'lesson', parentId: selectedChapter.id, itemToEdit: lesson }); }}><Edit2 size={13} /></button>
                              <button className="ip-action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete('lesson', lesson.id, selectedChapter.id); }}><Trash2 size={13} /></button>
                            </div>
                          )}
                          <div className="ip-lc-icon">
                            {isDone
                              ? <CheckCircle2 size={12} className="ip-done-icon" />
                              : <Circle size={12} className="ip-todo-icon" />}
                          </div>
                          <span className="ip-lc-title">{lesson.lesson_title}</span>
                          {isActive && <div className="ip-lc-active-dot" style={{ background: color }} />}
                        </button>
                      </motion.div>
                    );
                  })}
                  {isEditMode && (
                    <div className="ip-add-node lesson-add">
                      <button className="ip-add-btn" onClick={() => setAddModal({ open: true, type: 'lesson', parentId: selectedChapter.id })}>
                        <Plus size={16} /> Add Question
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Detail pane ─────────────────────────────────────────────── */}
        {showDetail && (
          <div className="ip-detail-pane">
            <AnimatePresence mode="wait" custom={navDirection}>
              {!activeLesson ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ip-empty-state"
                >
                  <div className="ip-empty-orb">
                    <BookOpen size={28} />
                  </div>
                  <p className="ip-empty-title">Select a question</p>
                  <p className="ip-empty-sub">Browse courses → chapters → questions on the left to open an answer here.</p>
                  {!isMobile && (
                    <div className="ip-empty-stats">
                      <div className="ip-es-stat">
                        <span className="ip-es-val">{totalLessons}</span>
                        <span className="ip-es-lbl">Questions</span>
                      </div>
                      <div className="ip-es-stat">
                        <span className="ip-es-val">{completedCount}</span>
                        <span className="ip-es-lbl">Completed</span>
                      </div>
                      <div className="ip-es-stat">
                        <span className="ip-es-val">{overallPct}%</span>
                        <span className="ip-es-lbl">Progress</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key={activeLessonId}
                  custom={navDirection}
                  initial={{ opacity: 0, x: navDirection === 1 ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: navDirection === 1 ? -20 : 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="ip-lesson-detail"
                >
                  {/* Breadcrumb */}
                  <div className="ip-lesson-breadcrumb" style={{ "--bc-color": activeLesson.courseColor }}>
                    <span>{activeLesson.courseTitle}</span>
                    <ChevronRight size={11} />
                    <span>{activeLesson.chapterTitle}</span>
                  </div>

                  {/* Question */}
                  <div className="ip-question-block" style={{ "--qb-color": activeLesson.courseColor }}>
                    <div className="ip-qb-label">
                      <Hash size={11} />
                      <span>Question {activeIndex + 1} of {flatLessons.length}</span>
                    </div>
                    <h2 className="ip-lesson-title">{activeLesson.lesson_title}</h2>
                  </div>

                  {/* Answer */}
                  <div className="ip-answer-block">
                    <div className="ip-ab-label">
                      <Star size={11} />
                      <span>Answer</span>
                    </div>
                    <div
                      className="ip-content"
                      dangerouslySetInnerHTML={{ __html: activeLesson.content_html }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="ip-lesson-footer">
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className={"ip-complete-btn" + (completedLessons[activeLesson.id] ? " done" : "")}
                        style={{ "--btn-color": activeLesson.courseColor }}
                        onClick={() => toggleDone(activeLesson.id)}
                      >
                        {completedLessons[activeLesson.id]
                          ? <><CheckCircle2 size={14} /> Completed</>
                          : <><Circle size={14} /> Mark complete</>}
                      </button>

                      <button
                        className={"ip-ai-tutor-btn" + (aiChatOpen ? " active" : "")}
                        style={{ "--btn-color": activeLesson.courseColor }}
                        onClick={() => setAiChatOpen(o => !o)}
                      >
                        <Bot size={14} /> Ask AI Tutor
                      </button>
                    </div>

                    <div className="ip-nav-buttons">
                      <button className="ip-nav-btn" disabled={activeIndex <= 0} onClick={() => goToLesson(-1)}>
                        <ChevronLeft size={14} /> Prev
                      </button>
                      <span className="ip-nav-counter">{activeIndex + 1} / {flatLessons.length}</span>
                      <button className="ip-nav-btn" disabled={activeIndex >= flatLessons.length - 1} onClick={() => goToLesson(1)}>
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* AI Tutor Chat Panel — context-aware for THIS question */}
                  {aiChatOpen && (
                    <div className="ip-ai-chat-panel" style={{ "--btn-color": activeLesson.courseColor }}>
                      <div className="ip-ai-header">
                        <h4><Bot size={16} /> AI Tutor — {activeLesson.lesson_title}</h4>
                        <button onClick={() => setAiChatOpen(false)}><X size={15} /></button>
                      </div>

                      <div style={{ padding: "0 12px" }}><ApiBeamConnectionNotice compact /></div>

                      <div className="ip-ai-toggles">
                        <button
                          className={"ip-ai-toggle" + (useWebSearch ? " active" : "")}
                          onClick={() => setUseWebSearch(v => !v)}
                          title="Include recent web search results as context"
                        >
                          <Globe size={12} /> Web Search
                        </button>
                        <button
                          className={"ip-ai-toggle" + (useCourseNotes ? " active" : "")}
                          onClick={() => setUseCourseNotes(v => !v)}
                          title="Include your relevant course notes as context"
                        >
                          <NotebookText size={12} /> Course Notes
                        </button>
                      </div>

                      <div className="ip-ai-messages">
                        {aiMessages.length === 0 && (
                          <div className="ip-ai-empty">Ask me to explain this answer differently, go deeper, or quiz you on a follow-up.</div>
                        )}
                        {aiMessages.map((m, idx) => (
                          <div key={idx} className={`ip-ai-msg ${m.role}`}>
                            {m.role === 'user' ? (
                              m.text
                            ) : (
                              <div className="ip-ai-markdown">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    code({ node, inline, className, children, ...props }) {
                                      const match = /language-(\w+)/.exec(className || '');
                                      return !inline && match ? (
                                        <SyntaxHighlighter
                                          style={vscDarkPlus}
                                          language={match[1]}
                                          PreTag="div"
                                          customStyle={{ margin: '8px 0', borderRadius: 6, fontSize: 12 }}
                                          {...props}
                                        >
                                          {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                      ) : (
                                        <code className={className} style={{ background: 'rgba(0,255,136,0.1)', padding: '2px 6px', borderRadius: 4, color: 'var(--neon)', fontSize: '0.9em' }} {...props}>
                                          {children}
                                        </code>
                                      );
                                    },
                                    a({ node, children, ...props }) {
                                      return <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon)', textDecoration: 'underline' }}>{children}</a>;
                                    }
                                  }}
                                >
                                  {m.text}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        ))}
                        {aiLoading && (
                          <div className="ip-ai-msg model loading">
                            <Loader2 size={14} className="spin" /> {aiLoadingLabel}
                          </div>
                        )}
                      </div>
                      <div className="ip-ai-input-area">
                        <input
                          type="text"
                          placeholder="Ask about this question..."
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                        />
                        <button onClick={handleAiSubmit} disabled={!aiInput.trim() || aiLoading}>
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Admin Add Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {addModal.open && (
          <div className="ip-modal-overlay">
            <motion.div 
              className="ip-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="ip-modal-header">
                <h3>{addModal.mode === 'edit' ? 'Edit' : 'Add New'} {addModal.type.charAt(0).toUpperCase() + addModal.type.slice(1)}</h3>
                <button className="ip-icon-btn" onClick={() => setAddModal({ open: false })}><X size={16} /></button>
              </div>
              <div className="ip-modal-body">
                <div className="ip-input-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={newItemTitle} 
                    onChange={e => setNewItemTitle(e.target.value)} 
                    placeholder={`Enter ${addModal.type} title...`}
                    autoFocus
                  />
                </div>
                {addModal.type === 'lesson' && (
                  <div className="ip-input-group">
                    <label>Answer Content</label>
                    <textarea 
                      value={newItemContent} 
                      onChange={e => setNewItemContent(e.target.value)}
                      placeholder="Enter the detailed answer or explanation..."
                      rows={6}
                    />
                  </div>
                )}
              </div>
              <div className="ip-modal-footer">
                <button className="ip-btn-cancel" onClick={() => setAddModal({ open: false })}>Cancel</button>
                <button className="ip-btn-save" onClick={submitAddItem} disabled={!newItemTitle.trim()}>
                  <Save size={15} /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
