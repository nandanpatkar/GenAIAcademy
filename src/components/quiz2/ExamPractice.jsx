import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import {
  Search, RefreshCw, ChevronRight, ArrowUpRight, Layers3,
  SlidersHorizontal, Cloud, ShieldCheck, BookOpenCheck,
  Gauge, Route, CheckCircle2,
} from "lucide-react";
import ExamHub from "./examBank/ExamHub";
import { getVendorMeta } from "./examBank/vendorMeta";

/**
 * Quiz 2.0's Exam Bank browse screen — a straight copy of
 * quiz/ExamPractice.jsx. This file itself makes no API calls (its child
 * ExamHub does, against /api/exam2 instead of /api/exam — see
 * quiz2/examBank/ExamHub.jsx), so it only needed the import paths kept
 * relative to this folder, no other changes.
 *
 * Data flow:
 *   public/data/exam-list.json  → browse/search list (static, lazy-fetched, shared with Quiz 1.0)
 *   /api/exam2?resource=*        → cache-first per-resource fetches (isolated Supabase tables)
 */
export default function ExamPractice({ onStartExam, theme = "dark", onWorkspaceChange }) {
  const [allExams, setAllExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("All tracks");
  const [selected, setSelected] = useState(null); // { slug, name, vendor }
  const [showClaude, setShowClaude] = useState(false);

  useEffect(() => {
    onWorkspaceChange?.(showClaude);
    return () => onWorkspaceChange?.(false);
  }, [showClaude, onWorkspaceChange]);

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
  const awsStarter = allExams.find((exam) => exam.slug === "aws-cloud-practitioner") || allExams.find((exam) => exam.vendor.startsWith("AWS"));
  const azureStarter = allExams.find((exam) => exam.slug === "azure-az-900") || allExams.find((exam) => exam.vendor === "Azure");
  const gcpStarter = allExams.find((exam) => exam.slug === "gcp-cloud-digital-leader") || allExams.find((exam) => exam.vendor === "Google / GCP");
  const databricksStarter = allExams.find((exam) => exam.slug === "databricks-engineer") || allExams.find((exam) => exam.vendor === "Databricks");

  const openExam = (exam) => setSelected(exam);

  if (selected) {
    return <ExamHub exam={selected} onBack={() => setSelected(null)} onStartExam={onStartExam} />;
  }

  if (showClaude) {
    return <ClaudeCertificationWorkspace theme={theme} onBack={() => setShowClaude(false)} />;
  }

  return (
    <div className="quiz-bank-page">
      <section className="quiz-bank-hero">
        <div className="quiz-bank-hero-copy">
          <div className="quiz-eyebrow"><span className="quiz-eyebrow-dot" /> CLOUD CERTIFICATION ACADEMY <span className="quiz-eyebrow-line" /> {allExams.length || "110"} EXAM TRACKS</div>
          <h1>Build cloud fluency.<br /><span>Prove what you know.</span></h1>
          <p>One focused home for guided study, exam-style practice, flashcards, and the confidence to sit your certification.</p>
          <div className="quiz-hero-actions">
            <button className="quiz-btn quiz-btn-primary" onClick={() => awsStarter && openExam(awsStarter)} disabled={!awsStarter}>
              Start with cloud foundations <ArrowUpRight size={16} />
            </button>
            <a className="quiz-hero-link" href="#certification-paths">Explore learning paths <ChevronRight size={15} /></a>
          </div>
          <div className="quiz-trust-row"><span><CheckCircle2 size={13} /> Exam-style questions</span><span><CheckCircle2 size={13} /> AI explanations</span><span><CheckCircle2 size={13} /> Progress review</span></div>
        </div>
        <div className="quiz-bank-hero-visual" aria-hidden="true">
          <div className="quiz-cloud-grid" />
          <div className="quiz-cloud-line quiz-cloud-line-a" />
          <div className="quiz-cloud-line quiz-cloud-line-b" />
          <div className="quiz-cloud-node quiz-cloud-node-aws"><Icon icon="logos:aws" width={42} /></div>
          <div className="quiz-cloud-node quiz-cloud-node-core"><Cloud size={39} /><span>CLOUD<br />READY</span></div>
          <div className="quiz-cloud-node quiz-cloud-node-azure"><Icon icon="logos:microsoft-azure" width={40} /></div>
          <div className="quiz-cloud-node quiz-cloud-node-gcp"><Icon icon="logos:google-cloud" width={34} /></div>
          <div className="quiz-cloud-node quiz-cloud-node-databricks"><Icon icon="simple-icons:databricks" width={31} /></div>
          <div className="quiz-float-card quiz-float-card-top"><span className="quiz-float-icon is-green"><Gauge size={14} /></span><div><strong>84%</strong><small>practice readiness</small></div></div>
          <div className="quiz-float-card quiz-float-card-bottom"><span className="quiz-float-icon is-orange"><ShieldCheck size={14} /></span><div><strong>4</strong><small>study modes</small></div></div>
        </div>
      </section>

      <section className="quiz-learning-strip" aria-label="How certification preparation works">
        <div><span>01</span><Route size={17} /><strong>Choose a path</strong><small>Match a credential to your role</small></div>
        <i />
        <div><span>02</span><BookOpenCheck size={17} /><strong>Learn the domains</strong><small>Study guides and flashcards</small></div>
        <i />
        <div><span>03</span><Gauge size={17} /><strong>Test readiness</strong><small>Timed, exam-style practice</small></div>
      </section>

      <section className="quiz-primary-paths" id="certification-paths">
        <div className="quiz-section-heading"><span className="quiz-section-kicker">01 / FEATURED PATHS</span><h2>Pick the cloud you want to master</h2><p>Start broad, build practical depth, then move into role-based certification.</p></div>
        <div className="quiz-path-grid">
          <PathCard
            theme="aws" vendor="AWS" icon="logos:aws" color="#ff9900" secondary="#8aa4bd" eyebrow="FOUNDATIONAL → PROFESSIONAL"
            title="AWS certification path" description="Build from cloud concepts and shared responsibility into resilient architecture, operations, data, and generative AI."
            modules={["Cloud foundations", "Architecture & security", "Role-based practice"]}
            exam={awsStarter} examCount={allExams.filter((exam) => exam.vendor.startsWith("AWS")).length} onOpen={openExam}
          />
          <PathCard
            theme="azure" vendor="Microsoft Azure" icon="logos:microsoft-azure" color="#36c3ff" secondary="#0078d4" eyebrow="FUNDAMENTALS → EXPERT"
            title="Azure certification path" description="Connect Azure services to real job roles across administration, development, architecture, data, and AI."
            modules={["Azure fundamentals", "Identity & governance", "Applied role skills"]}
            exam={azureStarter} examCount={allExams.filter((exam) => exam.vendor === "Azure").length} onOpen={openExam}
          />
          <PathCard
            theme="gcp" vendor="Google Cloud" icon="logos:google-cloud" color="#4285f4" secondary="#34a853" eyebrow="FOUNDATIONAL → PROFESSIONAL"
            title="Google Cloud certification path" description="Turn Google Cloud’s data, AI, infrastructure, and security services into practical skills for modern cloud roles."
            modules={["Cloud digital leader", "Data & AI systems", "Professional role skills"]}
            exam={gcpStarter} examCount={allExams.filter((exam) => exam.vendor === "Google / GCP").length} onOpen={openExam}
          />
          <PathCard
            theme="databricks" vendor="Databricks" icon="simple-icons:databricks" color="#ff3621" secondary="#ff8f7f" eyebrow="LAKEHOUSE → GENERATIVE AI"
            title="Databricks certification path" description="Master the lakehouse from Apache Spark and data engineering through machine learning, analytics, administration, and GenAI."
            modules={["Lakehouse foundations", "Data & ML workloads", "Platform specialization"]}
            exam={databricksStarter} examCount={allExams.filter((exam) => exam.vendor === "Databricks").length} onOpen={openExam}
          />
          <PathCard
            theme="claude" vendor="Claude" icon="simple-icons:anthropic" color="#d97757" secondary="#e9b9a7" eyebrow="ASSOCIATE → ARCHITECT"
            title="Claude certification path" description="Build disciplined Claude skills from structured prompting and output evaluation through APIs, agents, tools, MCP, and production delivery."
            modules={["Associate foundations", "Developer systems", "Architect practice"]}
            countLabel="3 certifications" onAction={() => setShowClaude(true)}
          />
        </div>
      </section>

      <section className="quiz-bank-toolbar">
        <div className="quiz-section-heading"><span className="quiz-section-kicker">02 / COMPLETE LIBRARY</span><h2>Explore every exam track</h2></div>
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

function PathCard({ theme, vendor, icon, color, secondary, eyebrow, title, description, modules, exam, examCount, countLabel, onOpen, onAction }) {
  return (
    <article className={`quiz-path-card quiz-path-card--${theme}`} style={{ "--path-color": color, "--path-secondary": secondary }}>
      <div className="quiz-path-art" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="quiz-path-card-top"><span className="quiz-path-logo"><Icon icon={icon} width={43} /></span><span className="quiz-path-count">{countLabel || `${examCount || "—"} exam tracks`}</span></div>
      <span className="quiz-path-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="quiz-path-modules">{modules.map((module, index) => <span key={module}><i>{index + 1}</i>{module}</span>)}</div>
      <button onClick={() => onAction ? onAction() : exam && onOpen(exam)} disabled={!onAction && !exam}>Begin {vendor} path <ArrowUpRight size={16} /></button>
    </article>
  );
}

function ClaudeCertificationWorkspace({ theme, onBack }) {
  const childTheme = theme === "light" ? "light" : "dark";
  return (
    <section className="quiz-claude-workspace quiz-claude-workspace--embedded" aria-label="Claude certification workspace">
      <button className="quiz-claude-back" onClick={onBack}>← Back to certification paths</button>
      <div className="quiz-claude-frame-shell">
        <div className="quiz-claude-frame-bar"><span><i /> Claude Certifications</span><small>Associate · Developer · Architect</small></div>
        <iframe className="quiz-claude-frame" src={`/claude-certificate/index.html?theme=${childTheme}`} title="Claude Certifications — Associate, Developer, and Architect courses" loading="eager" />
      </div>
    </section>
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
