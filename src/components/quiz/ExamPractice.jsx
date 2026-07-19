import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Search, RefreshCw, ChevronRight, ArrowUpRight, Clock3, Layers3, Sparkles, SlidersHorizontal } from "lucide-react";
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
 *   /api/exam?resource=*         → cache-first per-resource fetches (Supabase)
 */
export default function ExamPractice({ onStartExam }) {
  const [allExams, setAllExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("All tracks");
  const [selected, setSelected] = useState(null); // { slug, name, vendor }

  useEffect(() => {
    fetch("/data/exam-list.json")
      .then((r) => r.json())
      .then((data) => setAllExams(data))
      .catch((err) => console.error("Failed to load exam list:", err))
      .finally(() => setExamsLoading(false));
  }, []);

  const filteredExams = useMemo(() => {
    const q = search.toLowerCase();
    return allExams.filter((e) => {
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q);
      const matchesVendor = vendorFilter === "All tracks" || e.vendor === vendorFilter;
      return matchesSearch && matchesVendor;
    });
  }, [allExams, search, vendorFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    filteredExams.forEach((e) => {
      if (!groups[e.vendor]) groups[e.vendor] = [];
      groups[e.vendor].push(e);
    });
    return groups;
  }, [filteredExams]);

  const vendors = useMemo(() => ["All tracks", ...new Set(allExams.map((e) => e.vendor))], [allExams]);
  const featured = filteredExams[0];

  const openExam = (exam) => setSelected(exam);

  if (selected) {
    return <ExamHub exam={selected} onBack={() => setSelected(null)} onStartExam={onStartExam} />;
  }

  return (
    <div className="quiz-bank-page">
      <section className="quiz-bank-hero">
        <div className="quiz-bank-hero-copy">
          <div className="quiz-eyebrow"><span className="quiz-eyebrow-dot" /> PRACTICE LAB <span className="quiz-eyebrow-line" /> 110 EXAM TRACKS</div>
          <h1>Train for the moment<br /><span>that matters.</span></h1>
          <p>Choose a certification track, sharpen your weak spots, and turn every answer into momentum.</p>
          <div className="quiz-hero-actions">
            <button className="quiz-btn quiz-btn-primary" onClick={() => featured && openExam(featured)} disabled={!featured}>
              {featured ? "Explore featured track" : "Loading tracks"} <ArrowUpRight size={16} />
            </button>
            <span className="quiz-hero-note"><Sparkles size={14} /> Adaptive practice with AI support</span>
          </div>
        </div>
        <div className="quiz-bank-hero-visual" aria-hidden="true">
          <div className="quiz-orbit quiz-orbit-one" />
          <div className="quiz-orbit quiz-orbit-two" />
          <div className="quiz-hero-core"><span>Q</span><small>READY<br />WHEN<br />YOU ARE</small></div>
          <div className="quiz-float-card quiz-float-card-top"><span className="quiz-float-icon is-green"><Layers3 size={14} /></span><div><strong>4</strong><small>learning paths</small></div></div>
          <div className="quiz-float-card quiz-float-card-bottom"><span className="quiz-float-icon is-orange"><Clock3 size={14} /></span><div><strong>∞</strong><small>practice sessions</small></div></div>
        </div>
      </section>

      <section className="quiz-bank-toolbar">
        <div className="quiz-section-heading"><span className="quiz-section-kicker">01 / EXAM BANK</span><h2>Find your next challenge</h2></div>
        <div className="quiz-bank-search-wrap"><Search size={17} /><input type="search" placeholder="Search exams, clouds, or roles" value={search} onChange={(e) => setSearch(e.target.value)} /><kbd>⌘ K</kbd></div>
      </section>

      <div className="quiz-track-filters" role="tablist" aria-label="Filter exam tracks">
        <SlidersHorizontal size={15} className="quiz-filter-icon" />
        {vendors.map((vendor) => <button key={vendor} className={vendorFilter === vendor ? "active" : ""} onClick={() => setVendorFilter(vendor)}>{vendor === "All tracks" ? vendor : vendor.replace(" (Amazon Web Services)", "").replace(" / GCP", "")}</button>)}
      </div>

      {examsLoading ? (
        <div className="quiz-bank-empty"><RefreshCw size={22} className="spin" /><span>Loading your exam library…</span></div>
      ) : filteredExams.length === 0 ? (
        <div className="quiz-bank-empty"><Search size={22} /><span>No tracks match that search.</span><button className="quiz-text-button" onClick={() => { setSearch(""); setVendorFilter("All tracks"); }}>Clear filters</button></div>
      ) : (
        <>
          <div className="quiz-featured-row">
            <button className="quiz-featured-card" style={{ "--vendor-color": getVendorMeta(featured.vendor).color }} onClick={() => openExam(featured)}>
              <div className="quiz-featured-sheen" />
              <div className="quiz-featured-top"><span className="quiz-featured-label">RECOMMENDED START</span><span className="quiz-featured-arrow"><ArrowUpRight size={18} /></span></div>
              <div className="quiz-featured-brand"><span className="quiz-featured-icon"><Icon icon={getVendorMeta(featured.vendor).icon} width={22} height={22} /></span><span>{featured.vendor.replace(" (Amazon Web Services)", "")}</span></div>
              <h3>{featured.name}</h3>
              <p>A balanced first step into the certification path, with practice, study notes, and review tools in one place.</p>
              <div className="quiz-featured-footer"><span><Layers3 size={14} /> Practice + study guide</span><span>Open track <ChevronRight size={15} /></span></div>
            </button>
            <div className="quiz-quick-stats">
              <div><span className="quiz-stat-overline">YOUR LIBRARY</span><strong>{allExams.length}</strong><small>certification tracks</small></div>
              <div><span className="quiz-stat-overline">PROVIDERS</span><strong>{vendors.length - 1}</strong><small>cloud ecosystems</small></div>
              <div><span className="quiz-stat-overline">BEST NEXT STEP</span><strong>15 min</strong><small>focused warm-up</small></div>
            </div>
          </div>

          {Object.keys(grouped).sort().map((vendor) => {
            const meta = getVendorMeta(vendor);
            return <section key={vendor} className="quiz-vendor-section"><div className="quiz-vendor-heading"><div><span className="quiz-vendor-mark" style={{ "--vendor-color": meta.color }}><Icon icon={meta.icon} width={16} height={16} /></span><span className="quiz-vendor-name">{vendor}</span></div><span className="quiz-vendor-count">{grouped[vendor].length} tracks <ChevronRight size={14} /></span></div><div className="exambank-grid">{grouped[vendor].map((exam, index) => <ExamCard key={exam.slug} exam={exam} index={index} onOpen={openExam} />)}</div></section>;
          })}
        </>
      )}
    </div>
  );
}

function ExamCard({ exam, index, onOpen }) {
  const meta = getVendorMeta(exam.vendor);
  const modes = ["Practice", "Study guide", "Flashcards"];
  return (
    <button className="exambank-card" style={{ "--vendor-color": meta.color }} onClick={() => onOpen(exam)}>
      <div className="exambank-card-header"><div className="exambank-card-icon"><Icon icon={meta.icon} width={19} height={19} /></div><span className="exambank-card-index">{String(index + 1).padStart(2, "0")}</span></div>
      <h3 className="exambank-card-title">{exam.name}</h3>
      <div className="exambank-card-meta"><span>{modes[index % modes.length]}</span><span className="exambank-card-dot" /><span>Timed mode</span></div>
      <div className="exambank-card-footer"><span>Open track</span><ChevronRight size={15} /></div>
    </button>
  );
}
