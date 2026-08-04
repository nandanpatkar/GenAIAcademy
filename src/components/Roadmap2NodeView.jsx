import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, CheckCircle2, RotateCcw, Layers, Clock, Video, Play,
  Link2, ExternalLink, Wrench, Fuel, Flag, ListChecks,
  FileText, Orbit, Sparkles, NotebookPen, Pencil, Trash2, Plus, X, UploadCloud,
} from "lucide-react";
import { DeepLearningSuite } from "./AIStudyPanel";
import ModuleNotes from "./ModuleNotes";
import YouTubeThumbnail from "./YouTubeThumbnail";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Roadmap2Node.css";

const extractYTId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
  return match ? match[1] : null;
};

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
  onTopicSelect, onVideoSelect, onEnterFocusMode,
  isEditMode, onAddModule, onEditModule, onDeleteModule, onSaveModule,
  onAddTopic, onDeleteTopic,
  onBack,
}) {
  const pathColor = path?.color || "#a855f7";
  const modules = node.modules || [];
  const doneModules = modules.filter((m) => m.status === "complete").length;
  const modPct = modules.length ? Math.round((doneModules / modules.length) * 100) : 0;
  const { user } = useAuth();

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
  const [wsTab, setWsTab] = useState("checkpoints"); // "checkpoints" | "notes"

  // Reset to the checkpoints tab whenever the selected module changes.
  useEffect(() => { setWsTab("checkpoints"); }, [mod?.id]);

  const subtopics = useMemo(() => (mod?.subtopics || []).map(normalizeSubtopic), [mod]);
  const doneTopics = subtopics.filter((s) => s.status === "complete").length;

  const videos = (mod?.videos || []).filter((v) => v && (v.url || v.title));
  const links = (mod?.links || []).filter((l) => l && (l.url || l.title));
  const files = (mod?.files || []).filter((f) => f && (f.url || f.title || f.name));

  // Stable module_id for the per-module notes editor's Supabase keying.
  const noteModuleId = mod?.id
    ? `${mod.id}`
    : `${node?.id ?? "unknown"}__${(mod?.title ?? "").replace(/\s+/g, "_").toLowerCase()}`;

  const modStatus = (m) => MODULE_STATUS[m.status] || MODULE_STATUS.default;

  // ── Attach-a-resource (video link / web link / file) ──
  const [fuelTab, setFuelTab] = useState("video"); // "video" | "link" | "file"
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  useEffect(() => { setUrlInput(""); setFuelTab("video"); }, [mod?.id]);

  const handleAddVideo = () => {
    if (!urlInput.trim() || !mod || !onSaveModule) return;
    const newVideo = { title: "YouTube Video", url: urlInput.trim(), channel: "External", duration: "--:--", views: "0" };
    onSaveModule({ ...mod, videos: [...(mod.videos || []), newVideo] });
    setUrlInput("");
  };

  const handleAddLink = () => {
    if (!urlInput.trim() || !mod || !onSaveModule) return;
    const newLink = { title: urlInput.trim(), url: urlInput.trim() };
    onSaveModule({ ...mod, links: [...(mod.links || []), newLink] });
    setUrlInput("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !mod || !onSaveModule) return;
    setUploading(true);
    setUploadMsg("Uploading...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-file-name": encodeURIComponent(file.name),
          "content-type": file.type || "application/octet-stream",
        },
        body: file,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      const ext = file.name.split(".").pop()?.toLowerCase();
      const newFile = {
        name: file.name,
        title: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: ext,
        url: data.url,
      };
      onSaveModule({ ...mod, files: [...(mod.files || []), newFile] });
      setUploadMsg("Uploaded!");
      setTimeout(() => setUploadMsg(""), 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMsg("");
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleRemoveResource = (kind, index) => {
    if (!mod || !onSaveModule) return;
    const key = kind === "video" ? "videos" : kind === "link" ? "links" : "files";
    const next = (mod[key] || []).filter((_, i) => i !== index);
    onSaveModule({ ...mod, [key]: next });
  };

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
          {isEditMode && onAddModule && modules.length > 0 && (
            <button className="r2n-insert-divider first" onClick={() => onAddModule(0)}>
              <Plus size={10} /> Insert bay at start
            </button>
          )}
          {modules.map((m, i) => {
            const st = modStatus(m);
            const isSel = mod && m.id === mod.id;
            const topicList = (m.subtopics || []).map(normalizeSubtopic);
            const tDone = topicList.filter((s) => s.status === "complete").length;
            return (
              <React.Fragment key={m.id}>
                <div
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
                  {isEditMode ? (
                    <div className="r2n-bay-edit-actions" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onEditModule && onEditModule(m)} title="Edit module"><Pencil size={11} /></button>
                      <button className="danger" onClick={() => onDeleteModule && onDeleteModule(m.id)} title="Delete module"><Trash2 size={11} /></button>
                    </div>
                  ) : (
                    <span className="r2n-bay-status">{st.label}</span>
                  )}
                </div>
                {isEditMode && onAddModule && (
                  <button className="r2n-insert-divider" onClick={() => onAddModule(i + 1)}>
                    <Plus size={10} /> Insert bay after {m.title}
                  </button>
                )}
              </React.Fragment>
            );
          })}
          {modules.length === 0 && (
            <div className="r2n-none">No modules in this node yet.</div>
          )}
          {isEditMode && onAddModule && (
            <button className="r2n-add-btn" onClick={() => onAddModule(-1)}>
              <Plus size={13} /> ADD SERVICE BAY
            </button>
          )}
        </div>

        {/* Right: selected module workshop */}
        {mod && (
          <div className="r2n-workshop" key={mod.id} style={{ "--dp-color": pathColor }}>
            <div className="r2n-ws-header">
              <div>
                <div className="r2n-ws-eyebrow" style={{ color: modStatus(mod).color }}>
                  {modStatus(mod).label}
                </div>
                <h2 className="r2n-ws-title">{mod.title}</h2>
                {mod.subtitle && <p className="r2n-ws-sub">{mod.subtitle}</p>}
              </div>
              <div className="r2n-ws-actions">
                {onEnterFocusMode && (
                  <button className="r2n-focus-btn" onClick={onEnterFocusMode} title="Enter distraction-free focus mode">
                    <Orbit size={13} className="pulse-icon" /> FOCUS
                  </button>
                )}
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

            <div className="r2n-ws-tabs">
              <button
                className={`r2n-ws-tab ${wsTab === "checkpoints" ? "active" : ""}`}
                onClick={() => setWsTab("checkpoints")}
              >
                <ListChecks size={12} /> OVERVIEW
              </button>
              <button
                className={`r2n-ws-tab ${wsTab === "notes" ? "active" : ""}`}
                onClick={() => setWsTab("notes")}
              >
                <NotebookPen size={12} /> PIT NOTES
              </button>
            </div>

            {wsTab === "notes" ? (
              <div className="r2n-ws-section r2n-notes-section">
                <ModuleNotes moduleId={noteModuleId} userId={user?.id} pathColor={pathColor} />
              </div>
            ) : (
              <>
                {mod.overview && (
                  <div className="r2n-ws-section">
                    <div className="r2n-ws-section-label">ROUTE BRIEFING</div>
                    <p className="r2n-ws-overview">{mod.overview}</p>
                  </div>
                )}

                {(subtopics.length > 0 || isEditMode) && (
                  <div className="r2n-ws-section">
                    <div className="r2n-ws-section-label">
                      <ListChecks size={12} /> CHECKPOINTS <span className="r2n-ws-section-count">· {doneTopics}/{subtopics.length}</span>
                    </div>
                    <div className="r2n-checkpoints">
                      {subtopics.map((s, i) => {
                        const isDone = s.status === "complete";
                        const topicId = s.id || s.title;
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
                            {isEditMode && onDeleteTopic && (
                              <button
                                className="r2n-checkpoint-delete"
                                onClick={(e) => { e.stopPropagation(); onDeleteTopic(topicId); }}
                                title="Delete checkpoint"
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {subtopics.length === 0 && (
                        <div className="r2n-none" style={{ padding: "14px 0" }}>No checkpoints in this bay yet.</div>
                      )}
                    </div>
                    {isEditMode && onAddTopic && (
                      <button className="r2n-add-btn" onClick={() => onAddTopic(-1)}>
                        <Plus size={13} /> ADD CHECKPOINT
                      </button>
                    )}
                  </div>
                )}

                {(videos.length > 0 || links.length > 0 || files.length > 0 || isEditMode) && (
                  <div className="r2n-ws-section">
                    <div className="r2n-ws-section-label">
                      <Fuel size={12} /> FUEL STATIONS <span className="r2n-ws-section-count">· {videos.length + links.length + files.length}</span>
                    </div>
                    {videos.length > 0 && (
                      <div className="r2n-video-list">
                        {videos.map((v, i) => {
                          const ytId = extractYTId(v.url);
                          return (
                            <div key={`v-${i}`} className="r2n-video-card">
                              <button
                                className="r2n-video-main"
                                onClick={() =>
                                  onVideoSelect && v.url
                                    ? onVideoSelect(v)
                                    : v.url && window.open(v.url, "_blank", "noopener,noreferrer")
                                }
                              >
                                <span className="r2n-video-thumb">
                                  {ytId ? (
                                    <YouTubeThumbnail url={v.url} alt={v.title || "Video thumbnail"} />
                                  ) : (
                                    <Video size={16} />
                                  )}
                                  <span className="r2n-video-play"><Play size={12} fill="currentColor" /></span>
                                </span>
                                <span className="r2n-video-info">
                                  <span className="r2n-video-title">{v.title || v.url}</span>
                                  <span className="r2n-video-meta">
                                    {v.channel && v.channel !== "External" ? v.channel : ytId ? "YouTube" : "Video link"}
                                    {v.duration && v.duration !== "--:--" ? ` · ${v.duration}` : ""}
                                  </span>
                                </span>
                              </button>
                              {isEditMode && onSaveModule && (
                                <button className="r2n-fuel-remove" onClick={() => handleRemoveResource("video", i)} title="Remove video">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="r2n-fuel">
                      {links.map((l, i) => (
                        <div key={`l-${i}`} className="r2n-fuel-card link">
                          <button
                            className="r2n-fuel-main"
                            onClick={() => {
                              const url = l.url && (/^https?:\/\//i.test(l.url) ? l.url : `https://${l.url}`);
                              if (url) window.open(url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            <Link2 size={14} />
                            <span className="r2n-fuel-title">{l.title || l.url}</span>
                            <ExternalLink size={11} className="r2n-fuel-ext" />
                          </button>
                          {isEditMode && onSaveModule && (
                            <button className="r2n-fuel-remove" onClick={() => handleRemoveResource("link", i)} title="Remove link">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      {files.map((f, i) => (
                        <div key={`f-${i}`} className="r2n-fuel-card file">
                          <button
                            className="r2n-fuel-main"
                            onClick={() => {
                              const url = f.url && (/^https?:\/\//i.test(f.url) ? f.url : `https://${f.url}`);
                              if (url) window.open(url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            <FileText size={14} />
                            <span className="r2n-fuel-title">{f.title || f.name || "Module Document"}</span>
                            <ExternalLink size={11} className="r2n-fuel-ext" />
                          </button>
                          {isEditMode && onSaveModule && (
                            <button className="r2n-fuel-remove" onClick={() => handleRemoveResource("file", i)} title="Remove file">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      {videos.length === 0 && links.length === 0 && files.length === 0 && (
                        <div className="r2n-none" style={{ padding: "14px 0" }}>No fuel stations added yet.</div>
                      )}
                    </div>

                    {isEditMode && onSaveModule && (
                      <div className="r2n-fuel-add">
                        <div className="r2n-fuel-add-tabs">
                          {["video", "link", "file"].map((t) => (
                            <button
                              key={t}
                              className={`r2n-fuel-add-tab ${fuelTab === t ? "active" : ""}`}
                              onClick={() => setFuelTab(t)}
                            >
                              {t === "video" ? "Video Link" : t === "link" ? "Web Link" : "File"}
                            </button>
                          ))}
                        </div>
                        {fuelTab === "file" ? (
                          <label className={`r2n-fuel-upload ${uploading ? "busy" : ""}`}>
                            <UploadCloud size={13} />
                            {uploadMsg || (uploading ? "Uploading…" : "Choose a file to attach (PDF, DOC, PNG…)")}
                            <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={uploading} />
                          </label>
                        ) : (
                          <div className="r2n-fuel-add-row">
                            <input
                              className="r2n-fuel-add-input"
                              placeholder={fuelTab === "video" ? "Paste a YouTube URL you studied from…" : "Paste a URL you studied from…"}
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (fuelTab === "video" ? handleAddVideo() : handleAddLink())}
                            />
                            <button
                              className="r2n-fuel-add-btn"
                              onClick={fuelTab === "video" ? handleAddVideo : handleAddLink}
                            >
                              <Plus size={13} /> Add
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="r2n-ws-section">
                  <div className="r2n-ws-section-label">
                    <Sparkles size={12} /> PIT LAB · AI STUDY TOOLS
                  </div>
                  <DeepLearningSuite module={mod} pathColor={pathColor} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
