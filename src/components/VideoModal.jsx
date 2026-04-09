import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, Sparkles, MessageSquare, 
  Library, Clock, Play, Trash2, Send, Save, Share2,
  ChevronRight, Brain, Zap, Target, BookOpen, Layers,
  CheckCircle, PlayCircle, SkipForward, GraduationCap, UserCheck, Activity, AlertTriangle
} from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";
import { generateVideoIntelligence, generateStudyContent, generateInterviewCoachContent, generateDetailedNotes } from "../services/aiService";
import { QuizCard } from "./AIStudyContent";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactFlow, { Background, Controls, MiniMap, Handle, Position, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

const extractText = (node) => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && node.props && node.props.children) return extractText(node.props.children);
  return "";
};

const CustomNode = ({ data }) => (
  <div style={{ 
    padding: "12px 16px", 
    borderRadius: "14px", 
    background: "rgba(17,17,17,0.9)", 
    border: "1px solid var(--neon)", 
    color: "white", 
    fontSize: "10px", 
    fontWeight: 900,
    boxShadow: "0 0 20px rgba(0,255,136,0.1), inset 0 0 10px rgba(0,255,136,0.05)",
    minWidth: 140,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6
  }}>
    <Handle type="target" position={Position.Top} style={{ background: 'var(--neon)', border: 'none', width: 6, height: 6 }} />
    <div style={{ color: "var(--neon)", fontSize: 8, opacity: 0.8 }}>STEP</div>
    <div style={{ textAlign: "center" }}>{data.label}</div>
    <Handle type="source" position={Position.Bottom} style={{ background: 'var(--neon)', border: 'none', width: 6, height: 6 }} />
  </div>
);

const nodeTypes = {
  custom: CustomNode,
};

const AiLoader = ({ type = 'text', count = 4, message = "GENERATING AI CONTENT..." }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", padding: "10px 0", alignItems: "stretch" }}>
      {message && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: [0.3, 1, 0.3] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: 10, fontWeight: 900, color: "var(--neon)", letterSpacing: 2, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}
        >
          <Sparkles size={12} fill="currentColor" /> {message}
        </motion.div>
      )}
      {type === 'card' && (
        <motion.div
          initial={{ backgroundPosition: "200% 0" }} 
          animate={{ backgroundPosition: "-200% 0" }} 
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          style={{ height: 200, width: "100%", borderRadius: 16, background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(0,255,136,0.08) 50%, rgba(255,255,255,0.02) 75%)", backgroundSize: "200% 100%", border: "1px dashed rgba(0,255,136,0.2)", marginBottom: 8 }}
        />
      )}
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, filter: "blur(4px)", backgroundPosition: "200% 0" }}
          animate={{ opacity: 1, filter: "blur(0px)", backgroundPosition: "-200% 0" }}
          transition={{ 
            opacity: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
            filter: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
            backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          style={{
            height: type === 'quiz' ? 60 : (i === 0 && type !== 'card' ? 32 : 16),
            width: type === 'card' ? '100%' : (i === count - 1 ? '70%' : (i === count - 2 ? '85%' : '100%')),
            borderRadius: type === 'quiz' ? 12 : 8,
            background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(0,255,136,0.1) 50%, rgba(255,255,255,0.03) 75%)",
            backgroundSize: "200% 100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}
        />
      ))}
    </div>
  );
};

export default function VideoModal({ 
  video: initialVideo, 
  onClose, 
  videoIntelligence: initialVideoIntelligence, 
  onUpdateProgress, 
  onSaveNote, 
  onDeleteNote,
  moduleContext: initialModuleContext,
  pathsData,
  onNavigate
}) {
  const [currentVideo, setCurrentVideo] = useState(initialVideo);
  const [isPip, setIsPip] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [capturedTime, setCapturedTime] = useState(null);
  const timeRef = useRef(0);

  // Challenge State
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [errorAI, setErrorAI] = useState(null);

  // Interview Coach State
  const [isGeneratingCoach, setIsGeneratingCoach] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [isCoachMaximized, setIsCoachMaximized] = useState(false);

  // Detailed AI Notes State
  const [isGeneratingDetailedNotes, setIsGeneratingDetailedNotes] = useState(false);
  const [detailedNotes, setDetailedNotes] = useState(null);
  const [showNoteSuccess, setShowNoteSuccess] = useState(false);
  const [isNotesFullScreen, setIsNotesFullScreen] = useState(false);
  const [isDiagramFullScreen, setIsDiagramFullScreen] = useState(false);

  // States for interactive ReactFlow
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);

  useEffect(() => {
    if (detailedNotes?.flowData) {
      setFlowNodes(detailedNotes.flowData.nodes.map(n => ({ ...n, type: 'custom' })));
      setFlowEdges(detailedNotes.flowData.edges.map(e => ({ ...e, animated: true, style: { stroke: 'var(--neon)', strokeWidth: 2 } })));
    }
  }, [detailedNotes]);

  const onNodesChange = useCallback((changes) => {
    setFlowNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setFlowEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Sync state with props when modal re-opens or video changes from outside
  useEffect(() => {
    if (initialVideo) {
      setCurrentVideo(initialVideo);
      setAiData(null);
      setQuizData(null);
      setCoachData(null);
      setDetailedNotes(null);
      setIsPip(false);
      setIsCoachMaximized(false);
    }
  }, [initialVideo]);

  const videoId = useMemo(() => 
    currentVideo?.url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1], 
    [currentVideo]
  );

  const videoIntelligence = useMemo(() => {
     if (currentVideo === initialVideo) return initialVideoIntelligence;
     return pathsData.videoIntelligence?.[videoId] || {};
  }, [currentVideo, initialVideo, initialVideoIntelligence, pathsData, videoId]);

  // Derived Module Context Fallback
  const moduleContext = useMemo(() => {
    if (initialModuleContext) return initialModuleContext;
    // Attempt to reconstruct context from currentVideo metadata
    if (currentVideo?.moduleId && pathsData) {
      for (const p of Object.values(pathsData)) {
        for (const n of (p.nodes || [])) {
          const m = (n.modules || []).find(mx => mx.id === currentVideo.moduleId);
          if (m) return m;
        }
      }
    }
    return { title: currentVideo?.title || "Video Lesson" };
  }, [initialModuleContext, currentVideo, pathsData]);

  const handleGenerateAI = async () => {
    setIsLoadingAI(true);
    setErrorAI(null);
    try {
      const data = await generateVideoIntelligence(currentVideo.title, moduleContext);
      setAiData(data);
      setActiveTab("summary");
    } catch (e) {
      console.error(e);
      setErrorAI("The AI service is currently busy. Please try again in a moment.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setErrorAI(null);
    try {
      const data = await generateStudyContent("quiz", {
        ...moduleContext,
        videoTitle: currentVideo.title,
        promptOverride: `Generate a high-fidelity quiz with exactly 6 questions about: "${currentVideo.title}" in the context of ${moduleContext.title}.\n\n` +
                        `RULES:\n- Return ONLY valid JSON\n- Exactly 4 choices per question in an "options" array\n- One correct "answer" key\n- A short "explanation" key\n\n` +
                        `FORMAT: {"questions":[{"question":"...","options":["A","B","C","D"],"answer":"A","explanation":"..."}]}`
      });
      setQuizData(data);
    } catch (e) {
      console.error(e);
      setErrorAI("Knowledge Check generation failed. This usually happens during peak traffic.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateCoach = async () => {
    setIsGeneratingCoach(true);
    setErrorAI(null);
    try {
      const data = await generateInterviewCoachContent(currentVideo.title, moduleContext);
      setCoachData(data);
    } catch (e) {
      console.error(e);
      setErrorAI("Coach generation failed. Please try again.");
    } finally {
      setIsGeneratingCoach(false);
    }
  };

  const handleGenerateDetailedNotes = async () => {
    setIsGeneratingDetailedNotes(true);
    setErrorAI(null);
    try {
      const data = await generateDetailedNotes(currentVideo.title, moduleContext);
      setDetailedNotes(data);
    } catch (e) {
      console.error(e);
      setErrorAI("Failed to generate detailed notes. Please try again.");
    } finally {
      setIsGeneratingDetailedNotes(false);
    }
  };

  const playlist = useMemo(() => moduleContext?.videos || [], [moduleContext]);
  const currentIdx = playlist.findIndex(v => v.url === currentVideo?.url);
  const nextVideo = currentIdx !== -1 && currentIdx < playlist.length - 1 ? playlist[currentIdx + 1] : null;

  const handleVideoEnd = useCallback(() => {
    const currentIndex = playlist.findIndex(v => v.url === currentVideo.url);
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      setCurrentVideo(playlist[currentIndex + 1]);
    }
  }, [playlist, currentVideo]);

  const handleAddNote = (e) => {
    if (e) e.preventDefault();
    if (!noteText.trim()) return;
    
    // Use the ref for better frame accuracy if capturedTime is not manually set
    const finalTimestamp = capturedTime !== null ? capturedTime : timeRef.current;
    
    onSaveNote({
      text: noteText,
      timestamp: finalTimestamp,
      createdAt: new Date().toISOString(),
      videoId: videoId
    });
    setNoteText("");
    setCapturedTime(null);
    setShowNoteSuccess(true);
    setTimeout(() => setShowNoteSuccess(false), 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const relatedModules = useMemo(() => {
    if (!pathsData || !currentVideo) return [];
    const allModules = [];
    Object.values(pathsData).forEach(path => {
      path.nodes?.forEach(node => {
        node.modules?.forEach(m => {
          allModules.push({ ...m, nodeTitle: node.title, pathColor: path.color, pathKey: path.id || Object.keys(pathsData).find(k => pathsData[k] === path), nodeId: node.id });
        });
      });
    });

    const keywords = (currentVideo.title + " " + (moduleContext?.title || "")).toLowerCase().split(/\s+/);
    return allModules
      .filter(m => {
        const mTitle = m.title.toLowerCase();
        if (m.title === moduleContext?.title) return false;
        return keywords.some(k => k.length > 3 && mTitle.includes(k));
      })
      .slice(0, 3);
  }, [pathsData, currentVideo, moduleContext]);


  const modalVariants = {
    full: {
      opacity: 1,
      width: "100%",
      maxWidth: "100vw",
      height: "100%",
      maxHeight: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: "0px",
      borderRadius: "0px"
    },
    pip: {
      opacity: 1,
      width: "340px",
      maxWidth: "340px",
      height: "auto",
      position: "fixed",
      right: "24px",
      bottom: "24px",
      padding: "0px",
      borderRadius: "24px",
      zIndex: 3000
    }
  };

  if (!currentVideo) return null;

  return (
    <div className={`video-modal-wrap ${isPip ? 'is-pip' : ''}`} style={{
      position: "fixed",
      inset: 0,
      zIndex: 2000,
      display: isPip ? "block" : "flex", // Block layout for PiP to avoid flex centering fighting
      alignItems: "center",
      justifyContent: "center",
      background: isPip ? "transparent" : "rgba(0, 0, 0, 0.85)",
      pointerEvents: isPip ? "none" : "auto", // Allow roadmaps to be clicked in PiP mode
    }}
    onClick={() => !isPip && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={isPip ? "pip" : "full"}
        variants={modalVariants}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          zIndex: 2001,
          pointerEvents: "auto",
          background: "#111", 
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: isPip ? "1px solid var(--border)" : "none",
          boxShadow: isPip ? "0 20px 40px rgba(0,0,0,0.6)" : "none"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: isPip ? "12px 16px" : "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid var(--border)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--neon-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Play size={16} color="var(--neon)" fill="currentColor" />
            </div>
            {!isPip && (
              <div>
                 <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text3)", letterSpacing: 2, textTransform: "uppercase" }}>{moduleContext?.title || 'Video Player'}</div>
                 <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{currentVideo.title}</div>
              </div>
            )}
            {isPip && (
               <div style={{ fontSize: 12, fontWeight: 700, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{currentVideo.title}</div>
            )}
          </div>
          
          <div style={{ display: "flex", gap: 8 }}>
            <button 
              onClick={() => setIsPip(!isPip)}
              className="hover-node"
              style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text2)", cursor: "pointer" }}
            >
              {isPip ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button 
              onClick={onClose}
              className="hover-node"
              style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text2)", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Unified Inner Content */}
        <div style={{ display: "flex", flexDirection: isPip ? "column" : "row", flex: 1, minHeight: 0 }}>
          
          {/* Main Player Area */}
          <div style={{ 
            display: "flex",
            flex: isNotesFullScreen ? 0 : ((isCoachMaximized && (activeTab === "coach" || activeTab === "aiNotes")) ? 1 : 2.5), 
            width: isNotesFullScreen ? 0 : "auto",
            opacity: isNotesFullScreen ? 0 : 1,
            pointerEvents: isNotesFullScreen ? "none" : "auto",
            overflow: "hidden",
            background: "#000", 
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: isPip ? "auto" : "100%",
            zIndex: 10,
            transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.5s ease"
          }}>
             <YouTubePlayer 
               key={currentVideo.url} 
               url={currentVideo.url} 
               title={currentVideo.title} 
               onTimeUpdate={useCallback((t) => {
                  timeRef.current = t;
                  setCurrentTime(t);
                  if (Math.floor(t) % 5 === 0) onUpdateProgress(t);
                }, [onUpdateProgress])}
               onEnded={handleVideoEnd}
               startTime={videoIntelligence?.progress || 0}
             />
             
             {!isPip && (
               <div style={{ padding: "16px 24px", background: "var(--bg3)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text3)", fontSize: 11, fontWeight: 700 }}>
                    <Clock size={14} /> 
                    <span>PLAYING @ {formatTime(currentTime)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                     {nextVideo && (
                       <button 
                         onClick={() => setCurrentVideo(nextVideo)}
                         style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,0.03)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer" }}
                       >
                         NEXT UP <SkipForward size={14} />
                       </button>
                     )}
                     <button 
                       onClick={handleGenerateAI}
                       disabled={isLoadingAI}
                       style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "var(--neon-dim)", color: "var(--neon)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer" }}
                     >
                       <Sparkles size={14} fill="currentColor" /> {isLoadingAI ? "LOADING..." : "AI INTEL"}
                     </button>
                  </div>
               </div>
             )}
            </div>

          {/* Sidebar Area */}
          {!isPip && (
            <div style={{ 
              flex: (isNotesFullScreen ? 1 : ((isCoachMaximized && (activeTab === "coach" || activeTab === "aiNotes")) ? 3 : 1)), 
              borderLeft: "1px solid var(--border)", 
              display: "flex", 
              flexDirection: "column", 
              background: "var(--bg1)", 
              minWidth: 340,
              height: "100%",
              overflow: "hidden", // Let child components handle their own scrolling
              transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              {/* Tab Bar */}
              <div style={{ display: "flex", padding: "10px", gap: 4, background: "rgba(0,0,0,0.2)", overflowX: "auto" }} className="mini-scrollbar">
                 {[
                   { id: "notes", icon: MessageSquare, label: "Notes" },
                   { id: "aiNotes", icon: BookOpen, label: "Detailed Notes" },
                   { id: "coach", icon: UserCheck, label: "Coach" },
                   { id: "challenge", icon: Target, label: "Challenge" },
                   { id: "summary", icon: Zap, label: "Intel" },
                   { id: "playlist", icon: Layers, label: "Ecosystem" },
                   { id: "knowledge", icon: Library, label: "Path" }
                 ].map(t => (
                   <button 
                     key={t.id}
                     onClick={() => setActiveTab(t.id)}
                     style={{
                       flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                       padding: "8px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                       background: activeTab === t.id ? "var(--bg3)" : "transparent",
                       color: activeTab === t.id ? "var(--text)" : "var(--text3)",
                       border: activeTab === t.id ? "1px solid var(--border)" : "1px solid transparent",
                       cursor: "pointer", transition: "all 0.2s"
                     }}
                   >
                     <t.icon size={14} /> {t.label}
                   </button>
                 ))}
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px" }} className="mini-scrollbar">
                
                {activeTab === "notes" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                     <form onSubmit={handleAddNote} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: 1 }}>
                              STAMPED AT {formatTime(capturedTime !== null ? capturedTime : currentTime)}
                           </div>
                           {noteText.length > 0 && capturedTime === null && (
                             <button 
                               type="button"
                               onClick={() => setCapturedTime(currentTime)}
                               style={{ fontSize: 9, fontWeight: 800, background: "rgba(255,255,255,0.05)", color: "var(--text3)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
                             >
                               SNAPSHOT TIME
                             </button>
                           )}
                           {capturedTime !== null && (
                             <button 
                               type="button"
                               onClick={() => setCapturedTime(null)}
                               style={{ fontSize: 9, fontWeight: 800, background: "rgba(0,255,136,0.1)", color: "var(--neon)", border: "1px solid var(--neon)", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
                             >
                               LIVE SYNC
                             </button>
                           )}
                        </div>
                        <div style={{ position: "relative" }}>
                          <textarea 
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            placeholder="Add a thought at this moment..."
                            style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px", color: "white", fontSize: 13, minHeight: 80, outline: "none", resize: "none" }}
                          />
                          <button type="submit" style={{ position: "absolute", bottom: 12, right: 12, background: "var(--neon)", color: "black", border: "none", borderRadius: 8, padding: "6px", cursor: "pointer" }}>
                            <Send size={14} />
                          </button>
                        </div>
                        <AnimatePresence>
                          {showNoteSuccess && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              style={{ fontSize: 10, fontWeight: 900, color: "var(--neon)", textAlign: "center", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                            >
                              <CheckCircle size={12} /> SNAPSHOT SAVED TO TIMELINE
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </form>

                     <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {(videoIntelligence?.notes || []).slice().reverse().map(note => (
                          <div key={note.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px", position: "relative" }} className="group">
                             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 10, fontWeight: 900, color: "var(--neon)" }}>{formatTime(note.timestamp)}</span>
                                <button onClick={() => onDeleteNote(note.id)} style={{ background: "transparent", border: "none", color: "var(--text3)", cursor: "pointer", opacity: 0.5 }}>
                                  <Trash2 size={12} />
                                </button>
                             </div>
                             <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{note.text}</div>
                          </div>
                        ))}
                        {(!videoIntelligence?.notes || videoIntelligence.notes.length === 0) && (
                          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)", fontSize: 12 }}>
                            No notes yet. Start typing above to save high-fidelity bookmarks.
                          </div>
                        )}
                     </div>
                  </div>
                )}

                {activeTab === "aiNotes" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text3)", letterSpacing: 1 }}>SENIOR STUDY GUIDE (RECALL MODE)</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button 
                            onClick={() => setIsCoachMaximized(!isCoachMaximized)}
                            style={{ background: isCoachMaximized ? "var(--neon)" : "var(--bg3)", color: isCoachMaximized ? "black" : "white", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 10, fontWeight: 900, cursor: "pointer" }}
                          >
                            {isCoachMaximized ? "NORMAL" : "MAXIMIZE"}
                          </button>
                          <button 
                            onClick={() => setIsNotesFullScreen(!isNotesFullScreen)}
                            style={{ background: isNotesFullScreen ? "var(--neon)" : "var(--bg3)", color: isNotesFullScreen ? "black" : "white", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 10, fontWeight: 900, cursor: "pointer" }}
                          >
                            {isNotesFullScreen ? "EXIT FULL" : "FULL SCREEN"}
                          </button>
                        </div>
                     </div>

                     {!detailedNotes && !isGeneratingDetailedNotes ? (
                       <div style={{ textAlign: "center", padding: "40px 0" }}>
                         <BookOpen size={48} color="var(--text3)" opacity={0.2} style={{ marginBottom: 16 }} />
                         <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 16 }}>Senior Engineering Study Notes</div>
                         <button onClick={handleGenerateDetailedNotes} style={{ padding: "12px 24px", background: "var(--neon)", color: "black", border: "none", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                           GENERATE STUDY GUIDE
                         </button>
                       </div>
                     ) : isGeneratingDetailedNotes ? (
                        <AiLoader type="text" count={6} message="SYNTHESIZING SENIOR STUDY GUIDE..." />
                     ) : (
                       <div className="markdown-body senior-notes" style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>
                           <div style={{ padding: "16px", background: "var(--bg2)", borderLeft: "4px solid var(--neon)", borderRadius: "0 12px 12px 0", marginBottom: 24 }}>
                             <div style={{ fontSize: 10, fontWeight: 900, color: "var(--neon)", letterSpacing: 1, marginBottom: 4 }}>TOPIC FOCUS</div>
                             <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{detailedNotes.title}</div>
                          </div>

                          {detailedNotes.flowData && (
                            <div style={{ 
                              ...(isDiagramFullScreen ? {
                                position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: "#0a0a0a", padding: 24, paddingBorder: 0, borderRadius: 0
                              } : {
                                height: isNotesFullScreen ? "70vh" : (isCoachMaximized ? 450 : 300), background: "rgba(0,0,0,0.3)", borderRadius: 16, border: "1px solid var(--border)", position: "relative", overflow: "hidden", transition: "height 0.5s ease", marginBottom: 24
                              })
                             }}>
                               <div style={{ position: "absolute", top: isDiagramFullScreen ? 24 : 12, left: isDiagramFullScreen ? 24 : 12, zIndex: 10, display: "flex", gap: 8 }}>
                                 <div style={{ fontSize: 10, fontWeight: 900, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 6, color: "var(--neon)", border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center" }}>
                                    CONCEPT ARCHITECTURE (INTERACTIVE)
                                 </div>
                                 <button
                                   onClick={() => setIsDiagramFullScreen(!isDiagramFullScreen)}
                                   style={{ fontSize: 10, fontWeight: 900, background: "var(--bg2)", padding: "4px 8px", borderRadius: 6, color: "white", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                                 >
                                   {isDiagramFullScreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                                   {isDiagramFullScreen ? "EXIT FULL SCREEN" : "STRETCH MODEL"}
                                 </button>
                               </div>
                               <ReactFlow
                                 nodes={flowNodes}
                                 edges={flowEdges}
                                 onNodesChange={onNodesChange}
                                 onEdgesChange={onEdgesChange}
                                 nodeTypes={nodeTypes}
                                 fitView
                                 fitViewOptions={{ padding: 0.2 }}
                                 style={{ width: '100%', height: '100%' }}
                               >
                                 <Background color="rgba(255,255,255,0.05)" gap={20} />
                                 <Controls showInteractive={true} style={{ display: 'flex' }} />
                                 {!isDiagramFullScreen && (
                                   <MiniMap 
                                     style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid var(--border)' }} 
                                     maskColor="rgba(0,0,0,0.2)"
                                     nodeColor="var(--neon)"
                                   />
                                 )}
                               </ReactFlow>
                            </div>
                          )}
                          
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({node, ...props}) => <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", marginTop: 40, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16, letterSpacing: "-0.5px" }} {...props} />,
                              h2: ({node, ...props}) => <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--neon)", marginTop: 32, marginBottom: 16, letterSpacing: "-0.3px" }} {...props} />,
                              h3: ({node, ...props}) => <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginTop: 24, marginBottom: 12 }} {...props} />,
                              p: ({node, ...props}) => {
                                const content = extractText(props.children);
                                const isInterviewTrap = content.toLowerCase().includes("trap") || content.toLowerCase().includes("red flag") || content.toLowerCase().includes("misconception") || content.toLowerCase().includes("notable");
                                
                                if (isInterviewTrap) {
                                  return (
                                    <div style={{ 
                                      marginBottom: 24, 
                                      padding: "16px 20px",
                                      background: "rgba(239,68,68,0.08)",
                                      borderLeft: "4px solid #ef4444",
                                      borderRadius: "0 16px 16px 0",
                                      color: "#ffa0a0",
                                    }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                        <AlertTriangle size={14} color="#ef4444" />
                                        <span style={{ fontSize: 11, fontWeight: 900, color: "#ef4444", letterSpacing: 1 }}>CRITICAL TRAP & MISCONCEPTION</span>
                                      </div>
                                      <p style={{ fontSize: 16, lineHeight: 1.8, margin: 0 }}>{props.children}</p>
                                    </div>
                                  );
                                }
                                return <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text2)", marginBottom: 24 }} {...props} />;
                              },
                              ul: ({node, ...props}) => <ul style={{ marginBottom: 24, paddingLeft: 24, color: "var(--text2)", listStyleType: "disc" }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ marginBottom: 24, paddingLeft: 24, color: "var(--text2)", listStyleType: "decimal" }} {...props} />,
                              li: ({node, ...props}) => <li style={{ marginBottom: 12, fontSize: 16, lineHeight: 1.8 }} {...props} />,
                              strong: ({node, ...props}) => <strong style={{ color: "white", fontWeight: 700 }} {...props} />,
                              em: ({node, ...props}) => <em style={{ color: "var(--neon)", fontStyle: "normal", fontWeight: 600 }} {...props} />,
                              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: "4px solid var(--neon)", background: "rgba(0, 255, 136, 0.05)", padding: "16px 24px", borderRadius: "0 16px 16px 0", margin: "0 0 24px", color: "white", fontSize: 16, fontStyle: "italic", lineHeight: 1.8 }} {...props} />,
                              code: ({node, inline, ...props}) => (
                                inline 
                                  ? <code style={{ background: "rgba(255,255,255,0.08)", padding: "4px 6px", borderRadius: 6, fontFamily: "monospace", fontSize: 14, color: "var(--neon)" }} {...props} />
                                  : <pre style={{ background: "#0a0a0a", padding: "20px", borderRadius: 16, border: "1px solid var(--border)", overflowX: "auto", marginBottom: 24, boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }}><code style={{ fontFamily: "monospace", fontSize: 14, color: "#e2e8f0" }} {...props} /></pre>
                              )
                            }}
                          >
                            {detailedNotes.content}
                          </ReactMarkdown>

                          {detailedNotes.checkpoints?.length > 0 && (
                            <div style={{ marginTop: 32, padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid var(--border)" }}>
                               <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text3)", letterSpacing: 1, marginBottom: 16 }}>KEY MOMENTS & VISUALS</div>
                               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                  {detailedNotes.checkpoints.map((cp, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                                       <div style={{ padding: "4px 8px", background: "var(--bg3)", color: "var(--neon)", borderRadius: 6, fontSize: 10, fontWeight: 900, fontFamily: "monospace" }}>{cp.time}</div>
                                       <div style={{ fontSize: 12, color: "var(--text2)", flex: 1 }}>{cp.instruction}</div>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}
                          
                          <button onClick={() => setDetailedNotes(null)} style={{ marginTop: 24, width: "100%", padding: "10px", background: "transparent", border: "1px dashed var(--border)", borderRadius: 10, color: "var(--text3)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            REFRESH NOTES
                          </button>
                       </div>
                     )}
                  </div>
                )}

                {activeTab === "coach" && (
                   <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text3)", letterSpacing: 1 }}>STUDY GUIDE & MENTAL MODELS</div>
                        <button 
                          onClick={() => setIsCoachMaximized(!isCoachMaximized)}
                          className="hover-node"
                          style={{ 
                            background: isCoachMaximized ? "var(--neon)" : "var(--bg3)", 
                            color: isCoachMaximized ? "black" : "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 14px",
                            fontSize: 10,
                            fontWeight: 900,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: isCoachMaximized ? "0 0 20px rgba(0,255,136,0.3)" : "none"
                          }}
                        >
                          {isCoachMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                          {isCoachMaximized ? "FOCUSED VIEW" : "MAXIMIZE GUIDE"}
                        </button>
                     </div>

                     {!coachData && !isGeneratingCoach ? (
                       <div style={{ textAlign: "center", padding: "40px 0" }}>
                         <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(0,255,136,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <GraduationCap size={32} color="var(--neon)" />
                         </div>
                         <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 8 }}>Senior Interview Expert</div>
                         <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>Generate a structured interview guide with interactive logic flowcharts and "Negative Learning" strategies.</p>
                         <button onClick={handleGenerateCoach} style={{ padding: "12px 24px", background: "var(--neon)", color: "black", border: "none", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                           PREPARE FOR INTERVIEW
                         </button>
                       </div>
                     ) : isGeneratingCoach ? (
                        <AiLoader type="card" count={5} message="MAPPING INTERVIEW LOGIC..." />
                     ) : (
                       <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                          {/* Interactive Flowchart */}
                           <div style={{ height: isCoachMaximized ? 450 : 300, background: "rgba(0,0,0,0.3)", borderRadius: 16, border: "1px solid var(--border)", position: "relative", overflow: "hidden", transition: "height 0.5s ease" }}>
                              <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, fontSize: 10, fontWeight: 900, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 6, color: "var(--neon)", border: "1px solid rgba(0,255,136,0.2)" }}>
                                 LOGIC FLOWCHART
                              </div>
                              <ReactFlow
                                nodes={coachData.flowData.nodes.map(n => ({ ...n, type: 'custom' }))}
                                edges={coachData.flowData.edges.map(e => ({ ...e, animated: true, style: { stroke: 'var(--neon)', strokeWidth: 2 } }))}
                                nodeTypes={nodeTypes}
                                fitView
                                style={{ width: '100%', height: '100%' }}
                              >
                                <Background color="rgba(255,255,255,0.05)" gap={20} />
                                <Controls showInteractive={false} style={{ display: 'none' }} />
                              </ReactFlow>
                           </div>

                          {/* Markdown Content */}
                          <div className="markdown-body interview-guide" style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>
                             <ReactMarkdown 
                               remarkPlugins={[remarkGfm]}
                               components={{
                                 h1: ({node, ...props}) => <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", marginTop: 40, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16, letterSpacing: "-0.5px" }} {...props} />,
                                 h2: ({node, ...props}) => <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--neon)", marginTop: 32, marginBottom: 16, letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: 8 }} {...props} />,
                                 h3: ({node, ...props}) => <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginTop: 24, marginBottom: 12 }} {...props} />,
                                 p: ({node, ...props}) => {
                                   const content = extractText(props.children);
                                   const isWarning = content.toLowerCase().includes("notable") || content.toLowerCase().includes("misconception") || content.toLowerCase().includes("red flag") || content.toLowerCase().includes("trap");
                                   
                                   if (isWarning) {
                                     return (
                                       <div style={{ 
                                         marginBottom: 24, 
                                         padding: "16px 20px",
                                         background: "rgba(239,68,68,0.08)",
                                         borderLeft: "4px solid #ef4444",
                                         borderRadius: "0 16px 16px 0",
                                         color: "#ffa0a0",
                                       }}>
                                         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                           <AlertTriangle size={14} color="#ef4444" />
                                           <span style={{ fontSize: 11, fontWeight: 900, color: "#ef4444", letterSpacing: 1 }}>CRITICAL TRAP & MISCONCEPTION</span>
                                         </div>
                                         <p style={{ fontSize: 16, lineHeight: 1.8, margin: 0 }}>{props.children}</p>
                                       </div>
                                     );
                                   }
                                   return <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text2)", marginBottom: 24 }} {...props} />;
                                 },
                                 ul: ({node, ...props}) => <ul style={{ marginBottom: 24, paddingLeft: 24, color: "var(--text2)", listStyleType: "disc" }} {...props} />,
                                 ol: ({node, ...props}) => <ol style={{ marginBottom: 24, paddingLeft: 24, color: "var(--text2)", listStyleType: "decimal" }} {...props} />,
                                 li: ({node, ...props}) => <li style={{ marginBottom: 12, fontSize: 16, lineHeight: 1.8 }} {...props} />,
                                 strong: ({node, ...props}) => <strong style={{ color: "white", fontWeight: 700 }} {...props} />,
                                 em: ({node, ...props}) => <em style={{ color: "var(--neon)", fontStyle: "normal", fontWeight: 600 }} {...props} />,
                                 blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: "4px solid var(--neon)", background: "rgba(0, 255, 136, 0.05)", padding: "16px 24px", borderRadius: "0 16px 16px 0", margin: "0 0 24px", color: "white", fontSize: 16, fontStyle: "italic", lineHeight: 1.8 }} {...props} />,
                                 code: ({node, inline, ...props}) => (
                                   inline 
                                     ? <code style={{ background: "rgba(255,255,255,0.08)", padding: "4px 6px", borderRadius: 6, fontFamily: "monospace", fontSize: 14, color: "var(--neon)" }} {...props} />
                                     : <pre style={{ background: "#0a0a0a", padding: "20px", borderRadius: 16, border: "1px solid var(--border)", overflowX: "auto", marginBottom: 24, boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }}><code style={{ fontFamily: "monospace", fontSize: 14, color: "#e2e8f0" }} {...props} /></pre>
                                 )
                               }}
                             >
                               {coachData.fullMarkdown}
                             </ReactMarkdown>
                          </div>

                          <button onClick={() => setCoachData(null)} style={{ padding: "10px", color: "var(--text3)", background: "transparent", border: "1px dashed var(--border)", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", marginTop: 20 }}>
                            REGENERATE COACHING SESSION
                          </button>
                       </div>
                     )}
                  </div>
                )}

                {activeTab === "challenge" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                     {errorAI && activeTab === "challenge" && (
                        <div style={{ padding: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "#ef4444", fontSize: 11, textAlign: "center" }}>
                           {errorAI}
                           <button onClick={handleGenerateQuiz} style={{ display: "block", margin: "10px auto 0", background: "white", color: "black", border: "none", borderRadius: 6, padding: "4px 10px", fontWeight: 700, cursor: "pointer" }}>Retry</button>
                        </div>
                     )}
                     {!quizData && !isGeneratingQuiz && !errorAI ? (
                       <div style={{ textAlign: "center", padding: "40px 0" }}>
                         <Target size={48} color="var(--text3)" opacity={0.2} style={{ marginBottom: 16 }} />
                         <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 16 }}>Personalized Quiz for: {currentVideo.title}</div>
                         <button onClick={handleGenerateQuiz} style={{ padding: "12px 24px", background: "var(--neon)", color: "black", border: "none", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                           START CHALLENGE
                         </button>
                       </div>
                     ) : isGeneratingQuiz ? (
                        <AiLoader type="quiz" count={5} message="GENERATING KNOWLEDGE CHECKS..." />
                     ) : (
                       <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text3)", letterSpacing: 1, marginBottom: 8 }}>{quizData?.questions?.length || 0} KNOWLEDGE CHECKS</div>
                          {quizData?.questions?.map((q, i) => (
                            <QuizCard key={i} q={q} i={i} pathColor="var(--neon)" />
                          ))}
                          <button onClick={() => setQuizData(null)} style={{ padding: "10px", color: "var(--text3)", background: "transparent", border: "1px dashed var(--border)", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            REGENERATE CHALLENGE
                          </button>
                       </div>
                     )}
                  </div>
                )}

                {activeTab === "summary" && (
                  <div>
                    {errorAI && activeTab === "summary" && (
                        <div style={{ padding: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "#ef4444", fontSize: 11, textAlign: "center", marginBottom: 20 }}>
                           {errorAI}
                           <button onClick={handleGenerateAI} style={{ display: "block", margin: "10px auto 0", background: "white", color: "black", border: "none", borderRadius: 6, padding: "4px 10px", fontWeight: 700, cursor: "pointer" }}>Retry</button>
                        </div>
                    )}
                    {!aiData && !isLoadingAI && !errorAI ? (
                      <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <Brain size={48} color="var(--text3)" opacity={0.2} style={{ marginBottom: 16 }} />
                        <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 16 }}>AI Intel Analysis: {currentVideo.title}</div>
                        <button onClick={handleGenerateAI} style={{ padding: "10px 20px", background: "var(--bg3)", border: "1px solid var(--border)", color: "white", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                           Analyze Content
                        </button>
                      </div>
                    ) : isLoadingAI ? (
                       <AiLoader type="text" count={4} message="ANALYZING CONTENT & EXTRACTING INTEL..." />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                         <div style={{ background: "var(--neon-dim)", padding: "16px", borderRadius: 16, border: "1px solid rgba(0,255,136,0.1)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                               <Target size={16} color="var(--neon)" />
                               <span style={{ fontSize: 11, fontWeight: 900, color: "var(--neon)", letterSpacing: 1 }}>ANALYSIS SUMMARY</span>
                            </div>
                            <div style={{ fontSize: 13, color: "white", lineHeight: 1.6 }}>{aiData.summary}</div>
                         </div>
                         
                         <div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: 1, marginBottom: 12 }}>CORE TAKEAWAYS</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                               {aiData.keyTakeaways?.map((t, i) => (
                                 <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text2)" }}>
                                    <ChevronRight size={12} color="var(--neon)" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span>{t}</span>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: 1, marginBottom: 12 }}>KEYWORDS</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                               {aiData.technicalKeywords?.map((k, i) => (
                                 <span key={i} style={{ fontSize: 9, fontWeight: 700, background: "var(--bg3)", color: "var(--text)", padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)" }}>{k}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "playlist" && (
                   <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: 1 }}>MODULE PLAYLIST ({playlist.length})</div>
                      {playlist.map((v, i) => (
                        <div 
                          key={i} 
                          onClick={() => setCurrentVideo(v)}
                          style={{ 
                            padding: "12px", background: v.url === currentVideo.url ? "var(--neon-dim)" : "var(--bg3)", 
                            border: `1px solid ${v.url === currentVideo.url ? "var(--neon)" : "var(--border)"}`, 
                            borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 
                          }}
                        >
                           <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {v.url === currentVideo.url ? <PlayCircle size={14} color="var(--neon)" /> : <span style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)" }}>{i+1}</span>}
                           </div>
                           <div style={{ fontSize: 12, fontWeight: 700, color: v.url === currentVideo.url ? "white" : "var(--text2)", flex: 1 }}>{v.title}</div>
                        </div>
                      ))}
                      {playlist.length === 0 && (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)", fontSize: 11 }}>
                          Searching module siblings... none found for this source.
                        </div>
                      )}
                   </div>
                )}

                {activeTab === "knowledge" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                     <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: 1 }}>CONNECTED ROADMAP NODES</div>
                     <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {relatedModules.map((m, i) => (
                          <div key={i} style={{ padding: "16px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 6, height: 6, borderRadius: 3, background: m.pathColor }} />
                                <span style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)" }}>{m.nodeTitle}</span>
                             </div>
                             <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{m.title}</div>
                             <button 
                               onClick={() => {
                                 onNavigate(m.pathKey, m.nodeId, m);
                                 onClose();
                               }}
                               style={{ alignSelf: "flex-end", padding: "8px 14px", background: "var(--neon-dim)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, fontSize: 10, fontWeight: 700, color: "var(--neon)", cursor: "pointer" }}
                             >
                               GO TO PATH
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
