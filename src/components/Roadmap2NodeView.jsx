import React, { useEffect, useMemo } from "react";
import {
  ArrowLeft, CheckCircle2, RotateCcw, Layers, Clock, Video,
  Link2, ExternalLink, Wrench, Fuel, Flag, ListChecks,
} from "lucide-react";
import "../styles/Roadmap2Node.css";

// The "Pit Stop" view — Roadmap 2.0's take on the node detail screen.
// It drives the exact same data and handlers as the classic
// ModulePanel/DetailPanel stack, but as a single full-screen garage scene.

const MODULE_STATUS = {
  complete: { label: "COMPLETE", color: "#00ff88", glyph: "✓" },
  in_progress: { label: "IN PROGRESS", color: "#a855f7", glyph: "⟳" },
  locked: { label: "LOCKED", color: "#555570", glyph: "🔒" },
  default: { label: "NOT STARTED", color: "#8888a0", glyph: "◌" },
};

const normalizeSubtopic = (s) =>
  typeof s === "object" ? s : { title: s, status: "pending" };

export default function Roadmap2NodeView({
  node, nodeIndex, path, nodeState,
  activeModule, setActiveModule,
  onMarkNodeState, onMarkModuleStatus, onToggleSubtopicStatus,
  onTopicSelect, onVideoSelect,
  onBack,
}) {
  const pathColor = path?.color || "#a855f7";
  const modules = node.modules || [];
  const doneModules = modules.filter((m) => m.status === "complete").length;
  const modPct = modules.length ? Math.round((doneModules / modules.length) * 100) : 0;

  // Keep App's activeModule as the single source of selection so shared
  // surfaces (TopicContentPanel, VideoModal) get the right module context.
  const selected = activeModule && modules.find((m) => m.id === activeModule.id);

  useEffect(() => {
    if (selected || !modules.length) return;
    const firstOpen =
      modules.find((m) => m.status === "in_progress") ||
      modules.find((m) => m.status !== "complete") ||
      modules[0];
    setActiveModule(firstOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id, selected, modules.length]);

  const mod = selected || modules[0];
  const subtopics = useMemo(() => (mod?.subtopics || []).map(normalizeSubtopic), [mod]);
  const doneTopics = subtopics.filter((s) => s.status === "complete").length;

  const videos = (mod?.videos || []).filter((v) => v && (v.url || v.title));
  const links = (mod?.links || []).filter((l) => l && (l.url || l.title));

  const modStatus = (m) => MODULE_STATUS[m.status] || MODULE_STATUS.default;

  // Ring gauge for module completion
  const ringR = 30;
  const ringC = 2 * Math.PI * ringR;

  return (
    <div className="r2n-root" style={{ "--path-color": pathColor }}>
      {/* ===== Top bar ===== */}
      <div className="r2n-topbar">
        <button className="r2n-back" onClick={onBack}>
          <ArrowLeft size={14} /> BACK TO HIGHWAY
        </button>
        <div className="r2n-topbar-path">
          <span className="r2n-mile-pill">MILE {String((nodeIndex ?? 0) + 1).padStart(2, "0")}</span>
          <span className="r2n-path-name">{path?.title || ""}</span>
        </div>
        <div className="r2n-node-actions">
          <button
            className={`r2n-state-btn progress ${nodeState === "progress" ? "active" : ""}`}
            onClick={() => onMarkNodeState("progress")}
          >
            <RotateCcw size={13} />
            {nodeState === "progress" ? "DRIVING THIS MILE" : "START THIS MILE"}
          </button>
          <button
            className={`r2n-state-btn done ${nodeState === "done" ? "active" : ""}`}
            onClick={() => onMarkNodeState("done")}
          >
            <Flag size={13} />
            {nodeState === "done" ? "MILE CLEARED" : "CLEAR THIS MILE"}
          </button>
        </div>
      </div>

      {/* ===== Hero: node identity + mile strip ===== */}
      <div className="r2n-hero">
        <div className="r2n-hero-id">
          {node.icon && <div className="r2n-hero-icon">{node.icon}</div>}
          <div className="r2n-hero-text">
            <h1 className="r2n-hero-title">{node.title}</h1>
            <p className="r2n-hero-sub">{node.subtitle || node.description}</p>
          </div>
          <div className="r2n-hero-ring">
            <svg viewBox="0 0 72 72" width="72" height="72">
              <circle cx="36" cy="36" r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle
                cx="36" cy="36" r={ringR} fill="none"
                stroke={pathColor} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${ringC * (modPct / 100)} ${ringC}`}
                transform="rotate(-90 36 36)"
                style={{ filter: `drop-shadow(0 0 6px ${pathColor})`, transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
            <div className="r2n-ring-label">
              <span>{modPct}%</span>
              <small>{doneModules}/{modules.length}</small>
            </div>
          </div>
        </div>

        {/* Mile strip: the node's modules as stops on a mini road */}
        <div className="r2n-milestrip">
          <div className="r2n-milestrip-road">
            <div className="r2n-milestrip-dashes" />
            {modules.map((m, i) => {
              const st = modStatus(m);
              const isSel = mod && m.id === mod.id;
              return (
                <button
                  key={m.id}
                  className={`r2n-milestrip-stop ${isSel ? "selected" : ""}`}
                  style={{ left: `${modules.length === 1 ? 50 : (i / (modules.length - 1)) * 100}%`, "--stop-color": st.color }}
                  onClick={() => setActiveModule(m)}
                  title={m.title}
                >
                  {isSel && <span className="r2n-milestrip-car">🏎️</span>}
                  <span className="r2n-milestrip-dot" />
                  <span className="r2n-milestrip-num">{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="r2n-body">
        {/* Left: service bays (modules) */}
        <div className="r2n-bays">
          <div className="r2n-col-label">
            <Wrench size={12} /> SERVICE BAYS · {modules.length}
          </div>
          {modules.map((m, i) => {
            const st = modStatus(m);
            const isSel = mod && m.id === mod.id;
            const topicList = (m.subtopics || []).map(normalizeSubtopic);
            const tDone = topicList.filter((s) => s.status === "complete").length;
            return (
              <div
                key={m.id}
                className={`r2n-bay ${isSel ? "selected" : ""}`}
                style={{ "--bay-color": st.color }}
                onClick={() => setActiveModule(m)}
              >
                <div className="r2n-bay-glyph">{st.glyph}</div>
                <div className="r2n-bay-info">
                  <div className="r2n-bay-title">
                    <span className="r2n-bay-num">{String(i + 1).padStart(2, "0")}</span>
                    {m.title}
                  </div>
                  <div className="r2n-bay-meta">
                    {m.duration && <span><Clock size={10} /> {m.duration}</span>}
                    <span><Layers size={10} /> {topicList.length ? `${tDone}/${topicList.length} topics` : "no topics"}</span>
                  </div>
                  {topicList.length > 0 && (
                    <div className="r2n-bay-bar">
                      <div
                        className="r2n-bay-bar-fill"
                        style={{ width: `${(tDone / topicList.length) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <span className="r2n-bay-status">{st.label}</span>
              </div>
            );
          })}
          {modules.length === 0 && (
            <div className="r2n-none">No modules in this node yet.</div>
          )}
        </div>

        {/* Right: selected module workshop */}
        {mod && (
          <div className="r2n-workshop" key={mod.id}>
            <div className="r2n-ws-header">
              <div>
                <div className="r2n-ws-eyebrow" style={{ color: modStatus(mod).color }}>
                  {modStatus(mod).label}
                </div>
                <h2 className="r2n-ws-title">{mod.title}</h2>
                {mod.subtitle && <p className="r2n-ws-sub">{mod.subtitle}</p>}
              </div>
              <div className="r2n-ws-actions">
                <button
                  className={`r2n-state-btn progress ${mod.status === "in_progress" ? "active" : ""}`}
                  onClick={() => onMarkModuleStatus(mod.id, "in_progress")}
                >
                  <RotateCcw size={13} />
                  {mod.status === "in_progress" ? "IN PROGRESS" : "START"}
                </button>
                <button
                  className={`r2n-state-btn done ${mod.status === "complete" ? "active" : ""}`}
                  onClick={() => onMarkModuleStatus(mod.id, "complete")}
                >
                  <CheckCircle2 size={13} />
                  {mod.status === "complete" ? "COMPLETE" : "MARK COMPLETE"}
                </button>
              </div>
            </div>

            {mod.overview && (
              <div className="r2n-ws-section">
                <div className="r2n-ws-section-label">ROUTE BRIEFING</div>
                <p className="r2n-ws-overview">{mod.overview}</p>
              </div>
            )}

            {subtopics.length > 0 && (
              <div className="r2n-ws-section">
                <div className="r2n-ws-section-label">
                  <ListChecks size={12} /> CHECKPOINTS · {doneTopics}/{subtopics.length}
                </div>
                <div className="r2n-checkpoints">
                  {subtopics.map((s, i) => {
                    const isDone = s.status === "complete";
                    return (
                      <div
                        key={s.id || s.title || i}
                        className={`r2n-checkpoint ${isDone ? "done" : ""}`}
                        onClick={() => onTopicSelect && onTopicSelect(s)}
                      >
                        <button
                          className="r2n-checkbox"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSubtopicStatus(mod.id, s.title);
                          }}
                          title={isDone ? "Mark as pending" : "Mark as complete"}
                        >
                          {isDone && "✓"}
                        </button>
                        <span className="r2n-checkpoint-title">{s.title}</span>
                        {s.companies?.length > 0 && (
                          <span className="r2n-checkpoint-tag">{s.companies[0]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(videos.length > 0 || links.length > 0) && (
              <div className="r2n-ws-section">
                <div className="r2n-ws-section-label">
                  <Fuel size={12} /> FUEL STATIONS · {videos.length + links.length}
                </div>
                <div className="r2n-fuel">
                  {videos.map((v, i) => (
                    <button
                      key={`v-${i}`}
                      className="r2n-fuel-card video"
                      onClick={() =>
                        onVideoSelect && v.url
                          ? onVideoSelect(v)
                          : v.url && window.open(v.url, "_blank", "noopener,noreferrer")
                      }
                    >
                      <Video size={14} />
                      <span className="r2n-fuel-title">{v.title || v.url}</span>
                      {v.duration && <span className="r2n-fuel-meta">{v.duration}</span>}
                    </button>
                  ))}
                  {links.map((l, i) => (
                    <button
                      key={`l-${i}`}
                      className="r2n-fuel-card link"
                      onClick={() => {
                        const url = l.url && (/^https?:\/\//i.test(l.url) ? l.url : `https://${l.url}`);
                        if (url) window.open(url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <Link2 size={14} />
                      <span className="r2n-fuel-title">{l.title || l.url}</span>
                      <ExternalLink size={11} className="r2n-fuel-ext" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
