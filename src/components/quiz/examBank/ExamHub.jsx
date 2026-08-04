import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { ArrowLeft } from "lucide-react";
import PracticeTab from "./PracticeTab";
import StudyGuideTab from "./StudyGuideTab";
import FlashcardsTab from "./FlashcardsTab";
import VideosTab from "./VideosTab";
import { safeFetchJson } from "./apiHelpers";
import { getVendorMeta } from "./vendorMeta";

const TABS = [
  { id: "practice", label: "Practice", key: "practice" },
  { id: "studyguide", label: "Study Guide", key: "studyguide" },
  { id: "flashcards", label: "Flashcards", key: "flashcards" },
  { id: "videos", label: "Videos", key: "videos" },
];

/**
 * Per-exam hub: Practice / Study Guide / Flashcards / Videos.
 *
 * All four tabs are always clickable — availability is fetched in the
 * background purely as a hint (a small dot on tabs known to be empty), it
 * never disables a tab. Each tab does its own fetch and shows its own
 * empty/error state, so a wrong or slow availability signal can never
 * hide content that's actually there — worst case the tab shows "nothing
 * found" instead of being blocked from loading at all.
 *
 * Practice hands off to QuizApp's shared quiz-taking UI via onStartExam;
 * the other three tabs are self-contained.
 */
export default function ExamHub({ exam, onBack, onStartExam }) {
  const [availability, setAvailability] = useState(null); // null while unknown
  const [activeTab, setActiveTab] = useState("practice");
  const vendorMeta = getVendorMeta(exam.vendor);
  const vendorTheme = exam.vendor.startsWith("AWS") ? "aws" : exam.vendor === "Azure" ? "azure" : exam.vendor === "Google / GCP" ? "gcp" : exam.vendor === "Databricks" ? "databricks" : "default";

  useEffect(() => {
    let cancelled = false;
    setAvailability(null);
    setActiveTab("practice");
    safeFetchJson(`/api/exam?resource=resources&exam=${encodeURIComponent(exam.slug)}`)
      .then((data) => { if (!cancelled) setAvailability(data); })
      .catch(() => { /* silently ignore — tabs stay fully usable without this hint */ });
    return () => { cancelled = true; };
  }, [exam.slug]);

  return (
    <div className={`exam-hub exam-hub--${vendorTheme}`} style={{ "--hub-accent": vendorMeta.color }}>
      <button
        className="exam-hub-back"
        onClick={onBack}
      >
        <ArrowLeft size={15} /> Back to Exam Bank
      </button>

      <div className="exam-hub-heading">
        <span className="exam-hub-provider-mark"><Icon icon={vendorMeta.icon} width={30} height={30} /></span>
        <div><span className="exam-hub-eyebrow">CERTIFICATION WORKSPACE · {exam.vendor.replace(" (Amazon Web Services)", "")}</span><h2>{exam.name}</h2><p>Practice, revise, and build confidence in one focused provider-themed workspace.</p></div>
      </div>

      <div className="exam-hub-tabs" role="tablist" aria-label={`${exam.name} study modes`}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          // Only ever used as a subtle hint once resolved false — never gates the click.
          const knownEmpty = availability !== null && tab.key !== "practice" && availability[tab.key] === false;
          return (
            <button
              key={tab.id}
              className={`exam-hub-tab ${active ? "active" : ""}`}
              role="tab"
              aria-selected={active}
              title={knownEmpty ? "May be limited for this exam — click to check" : undefined}
              style={{
                opacity: knownEmpty ? 0.6 : 1,
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "practice" && <PracticeTab exam={exam} onStartExam={onStartExam} />}
      {activeTab === "studyguide" && <StudyGuideTab exam={exam} />}
      {activeTab === "flashcards" && <FlashcardsTab exam={exam} />}
      {activeTab === "videos" && <VideosTab exam={exam} />}
    </div>
  );
}
