import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Search, RefreshCw, ChevronRight } from "lucide-react";
import ExamHub from "./examBank/ExamHub";
import { getVendorMeta } from "./examBank/vendorMeta";

/**
 * Exam Bank — practice, study guide, flashcards, and videos scraped from
 * open-exam-prep.com.
 *
 * Default tab inside QuizApp (see activeTab initial state in QuizApp.jsx).
 * Renders inside the parent's .quiz-container, so it inherits all the
 * --bg-card / --accent / --text-primary etc. theme vars from QuizApp.css.
 *
 * Flow: browse (cards) -> ExamHub (Practice/Study Guide/Flashcards/Videos
 * tabs for the selected exam). Practice hands transformed questions back up
 * to QuizApp via onStartExam, which takes over with its existing
 * quiz-taking UI (timer, question map, flag for review, AI tutor, save &
 * exit, results/review).
 *
 * Data flow:
 *   public/data/exam-list.json  → browse/search list (static, lazy-fetched)
 *   /api/exam-*                 → cache-first per-resource fetches (Supabase)
 */
export default function ExamPractice({ onStartExam }) {
  const [allExams, setAllExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // { slug, name, vendor }

  useEffect(() => {
    fetch("/data/exam-list.json")
      .then((r) => r.json())
      .then((data) => setAllExams(data))
      .catch((err) => console.error("Failed to load exam list:", err))
      .finally(() => setExamsLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = q
      ? allExams.filter((e) => e.name.toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q))
      : allExams;

    const groups = {};
    filtered.forEach((e) => {
      if (!groups[e.vendor]) groups[e.vendor] = [];
      groups[e.vendor].push(e);
    });
    return groups;
  }, [allExams, search]);

  if (selected) {
    return <ExamHub exam={selected} onBack={() => setSelected(null)} onStartExam={onStartExam} />;
  }

  return (
    <div>
      <div className="quiz-upload-area" style={{ marginBottom: 24, textAlign: "left", padding: 20 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search exams (AWS, Azure, Databricks...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "10px 12px 10px 36px", color: "var(--text-primary)", fontSize: 14,
            }}
          />
        </div>
      </div>

      {examsLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
          <RefreshCw size={24} className="spin" style={{ marginBottom: 8 }} />
          <div>Loading exam list…</div>
        </div>
      ) : (
        Object.keys(grouped).sort().map((vendor) => (
          <div key={vendor} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-muted)", marginBottom: 10, paddingLeft: 4 }}>
              {vendor}
            </div>
            <div className="exambank-grid">
              {grouped[vendor].map((exam) => {
                const meta = getVendorMeta(vendor);
                return (
                  <div
                    key={exam.slug}
                    className="exambank-card"
                    style={{ "--vendor-color": meta.color }}
                    onClick={() => setSelected(exam)}
                  >
                    <div className="exambank-card-header">
                      <div className="exambank-card-icon">
                        <Icon icon={meta.icon} width={18} height={18} />
                      </div>
                    </div>
                    <h3 className="exambank-card-title">{exam.name}</h3>
                    <div className="exambank-card-vendor">
                      <span>{vendor}</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
