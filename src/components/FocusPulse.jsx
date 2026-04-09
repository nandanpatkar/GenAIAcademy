import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { X, Sparkles, Zap, Brain, Orbit, CheckCircle2, Video, Link2, FileText, ExternalLink, ChevronDown, ArrowLeft, BookOpen, Music, Play, Pause, SkipForward, Volume2 } from "lucide-react";

// Ambient Tracks (Pixabay Creative Commons)
const TRACKS = [
  { 
    id: "binaural", 
    name: "Binaural Deep", 
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8b8a0d923.mp3" 
  },
  { 
    id: "lofi", 
    name: "Neural Lofi", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
  },
  { 
    id: "rain", 
    name: "Rainy Studio", 
    url: "https://cdn.pixabay.com/audio/2021/11/25/audio_15b768e833.mp3" 
  }
];

const Particle = ({ delay, left }) => (
  <motion.div
    initial={{ bottom: "-10%", opacity: 0, scale: 0.5 }}
    animate={{ 
      bottom: "110%", 
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
      x: [0, Math.random() * 40 - 20, 0]
    }}
    transition={{ 
      duration: 15 + Math.random() * 10, 
      repeat: Infinity, 
      delay,
      ease: "linear" 
    }}
    style={{
      position: "absolute",
      left: `${left}%`,
      width: "2px",
      height: "2px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.4)",
      boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
      zIndex: 1,
    }}
  />
);

const Waveform = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 12 }}>
    {[1, 2, 3, 4].map(i => (
      <motion.div
        key={i}
        animate={{ height: [4, 12, 4] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        style={{ width: 2, background: "#00ff88", borderRadius: 1 }}
      />
    ))}
  </div>
);

const FocusPulse = ({ node, module, onClose, onToggleSubtopicStatus, onVideoSelect }) => {
  const [seconds, setSeconds] = useState(0);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const containerRef = useRef(null);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(new Audio(TRACKS[0].url));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Audio Logic
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIdx]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = TRACKS[currentTrackIdx].url;
    if (isPlaying) audio.play();
    
    // Auto loop
    audio.loop = true;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [currentTrackIdx]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20
    }));
  }, []);

  const handleToggleStatus = (e, title) => {
    e.stopPropagation();
    onToggleSubtopicStatus && onToggleSubtopicStatus(title);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#0a0502",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Inter', sans-serif",
        overflowY: "auto",
        padding: selectedSubtopic ? "0" : "80px 20px",
        scrollBehavior: "smooth",
      }}
    >
      {/* Background Glow Layers */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: "20%",
          left: "20%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed",
          bottom: "10%",
          right: "10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />

      {/* Synaptic Particles */}
      {!selectedSubtopic && particles.map(p => (
        <Particle key={p.id} delay={p.delay} left={p.left} />
      ))}

      {/* HUD Elements (Pinned) */}
      <div style={{
        position: "fixed",
        top: 40,
        left: 40,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: 0.6,
        zIndex: 100,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Brain size={16} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: "3px", textTransform: "uppercase" }}>
          Neural Sync Optimized
        </div>
      </div>

      <div style={{
        position: "fixed",
        top: 40,
        right: 40,
        zIndex: 100,
      }}>
        <button 
          onClick={selectedSubtopic ? () => setSelectedSubtopic(null) : onClose}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "12px",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        >
          {selectedSubtopic ? <ArrowLeft size={20} /> : <X size={20} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!selectedSubtopic ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            {/* Hero Section */}
            <div style={{ 
              maxWidth: "800px", 
              width: "90%", 
              textAlign: "center", 
              zIndex: 10, 
              position: "relative",
              marginBottom: "60px"
            }}>
              <div style={{ 
                fontSize: "12px", 
                fontWeight: 800, 
                letterSpacing: "5px", 
                color: "rgba(255,255,255,0.4)", 
                marginBottom: "24px",
                textTransform: "uppercase"
              }}>
                Deep Work Session
              </div>
              
              <h1 style={{ 
                fontSize: "4.5rem", 
                fontWeight: 900, 
                marginBottom: "24px", 
                letterSpacing: "-2px",
                background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.7))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Syne', sans-serif"
              }}>
                {node.title}
              </h1>
              
              <div style={{ 
                fontSize: "3rem", 
                fontWeight: 200, 
                fontFamily: "monospace", 
                color: "#fff",
                opacity: 0.9,
                letterSpacing: "4px",
                marginBottom: "8px"
              }}>
                {formatTime(seconds)}
              </div>
              <div style={{ 
                fontSize: "10px", 
                fontWeight: 900, 
                color: "rgba(255,255,255,0.3)", 
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "40px"
              }}>
                Focus Duration
              </div>

              <p style={{ 
                fontSize: "1.25rem", 
                lineHeight: "1.8", 
                color: "rgba(255,255,255,0.7)", 
                fontStyle: "italic", 
                fontFamily: "'Georgia', serif",
                maxWidth: "650px",
                margin: "0 auto 40px auto"
              }}>
                {module.subtitle || module.overview}
              </p>
            </div>

            {/* Study Content Section */}
            <div style={{
              width: "100%",
              maxWidth: "960px",
              zIndex: 10,
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "40px",
              padding: "40px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "32px",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(40px)",
              marginBottom: "100px"
            }}>
              {/* Left Column: Subtopics */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "24px" }}>
                  <Sparkles size={16} color="rgba(255,255,255,0.4)" />
                  <h3 style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                    Knowledge Hierarchy
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {module.subtopics?.map((sub, idx) => {
                    const sObj = typeof sub === "object" ? sub : { title: sub, status: "pending" };
                    const isDone = sObj.status === "complete";
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.05)" }}
                        onClick={() => setSelectedSubtopic(sObj)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "18px 24px",
                          background: isDone ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 255, 255, 0.03)",
                          border: "1px solid",
                          borderColor: isDone ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          borderRadius: "20px",
                          cursor: "pointer",
                          transition: "all 0.3s",
                        }}
                      >
                        <div 
                          onClick={(e) => handleToggleStatus(e, sObj.title)}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "1.5px solid",
                            borderColor: isDone ? "#00ff88" : "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#00ff88",
                            fontSize: "10px",
                            background: isDone ? "rgba(0,255,136,0.1)" : "transparent",
                            transition: "all 0.2s"
                          }}
                        >
                          {isDone && "✓"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: "15px", 
                            fontWeight: 700, 
                            color: isDone ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)",
                            textDecoration: isDone ? "line-through" : "none"
                          }}>
                            {sObj.title}
                          </div>
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                            <BookOpen size={10} /> CLICK TO READ
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Resources */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "24px" }}>
                  <Orbit size={16} color="rgba(255,255,255,0.4)" />
                  <h3 style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                    Deep Study Links
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {module.videos?.map((v, i) => (
                    <a
                      key={`vid-${i}`}
                      href={v.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        if (onVideoSelect) {
                          e.preventDefault();
                          onVideoSelect(v);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "16px 20px",
                        background: "rgba(239, 68, 68, 0.05)",
                        border: "1px solid rgba(239, 68, 68, 0.1)",
                        borderRadius: "16px",
                        color: "white",
                        textDecoration: "none",
                        transition: "all 0.3s",
                      }}
                    >
                      <div style={{ color: "#ef4444" }}><Video size={18} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 700 }}>{v.title || "Module Video"}</div>
                        <div style={{ fontSize: "10px", opacity: 0.5 }}>YouTube Source</div>
                      </div>
                      <ExternalLink size={14} style={{ opacity: 0.3 }} />
                    </a>
                  ))}
                  {module.links?.map((l, i) => (
                    <a
                      key={`link-${i}`}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "16px 20px",
                        background: "rgba(59, 130, 246, 0.05)",
                        border: "1px solid rgba(59, 130, 246, 0.1)",
                        borderRadius: "16px",
                        color: "white",
                        textDecoration: "none",
                        transition: "all 0.3s",
                      }}
                    >
                      <div style={{ color: "#3b82f6" }}><Link2 size={18} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 700 }}>{l.title || "Reference Link"}</div>
                        <div style={{ fontSize: "10px", opacity: 0.5 }}>External Article</div>
                      </div>
                      <ExternalLink size={14} style={{ opacity: 0.3 }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            style={{ 
              width: "100%", 
              maxWidth: "1000px", 
              zIndex: 10, 
              padding: "40px",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              gap: "40px"
            }}
          >
            {/* Reader Header */}
            <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <span style={{ fontSize: "11px", fontWeight: 900, background: "rgba(255,255,255,0.05)", padding: "6px 16px", borderRadius: "100px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)" }}>
                  DEEP KNOWLEDGE READER
                </span>
              </div>
              <h2 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px", fontFamily: "'Syne', sans-serif" }}>
                {selectedSubtopic.title}
              </h2>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
                <div style={{ fontSize: "1.5rem", fontFamily: "monospace", opacity: 0.6 }}>{formatTime(seconds)}</div>
                <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
                <button 
                  onClick={() => onToggleSubtopicStatus && onToggleSubtopicStatus(selectedSubtopic.title)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "100px",
                    background: selectedSubtopic.status === "complete" ? "#00ff88" : "transparent",
                    border: "1px solid",
                    borderColor: selectedSubtopic.status === "complete" ? "#00ff88" : "rgba(255,255,255,0.2)",
                    color: selectedSubtopic.status === "complete" ? "#000" : "#fff",
                    fontSize: "11px",
                    fontWeight: 900,
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  {selectedSubtopic.status === "complete" ? "✓ COMPLETED" : "MARK AS DONE"}
                </button>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="immersive-markdown" style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "rgba(255,255,255,0.85)" }}>
              {selectedSubtopic.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter 
                          style={vscDarkPlus} 
                          language={match[1]} 
                          PreTag="div" 
                          customStyle={{ 
                            borderRadius: "20px", 
                            padding: "24px", 
                            margin: "32px 0", 
                            background: "rgba(0,0,0,0.3)", 
                            border: "1px solid rgba(255,255,255,0.05)", 
                            fontSize: "14px",
                            fontFamily: "'JetBrains Mono', monospace"
                          }} 
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code style={{ background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: "6px", fontFamily: "monospace", color: "#00ff88" }} {...props}>
                          {children}
                        </code>
                      )
                    },
                    h1: ({node, ...props}) => <h1 style={{fontSize: "2.5rem", fontWeight: 800, marginTop: "60px", marginBottom: "24px"}} {...props} />,
                    h2: ({node, ...props}) => <h2 style={{fontSize: "2rem", fontWeight: 800, marginTop: "48px", marginBottom: "20px"}} {...props} />,
                    h3: ({node, ...props}) => <h3 style={{fontSize: "1.5rem", fontWeight: 700, marginTop: "32px", marginBottom: "16px"}} {...props} />,
                    p: ({node, ...props}) => <p style={{marginBottom: "24px"}} {...props} />,
                    ul: ({node, ...props}) => <ul style={{marginBottom: "24px", paddingLeft: "20px"}} {...props} />,
                    li: ({node, ...props}) => <li style={{marginBottom: "12px"}} {...props} />,
                    a: ({node, ...props}) => <a style={{color: "#3b82f6", textDecoration: "underline"}} target="_blank" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote style={{ 
                        borderLeft: "4px solid #00ff88", 
                        padding: "20px 32px", 
                        margin: "32px 0", 
                        background: "rgba(0,255,136,0.03)", 
                        borderRadius: "0 16px 16px 0",
                        fontStyle: "italic",
                        color: "rgba(255,255,255,0.7)"
                      }} {...props} />
                    )
                  }}
                >
                  {selectedSubtopic.content}
                </ReactMarkdown>
              ) : (
                <div style={{ textAlign: "center", padding: "100px 20px", opacity: 0.5 }}>
                  <Zap size={32} style={{ marginBottom: 20 }} />
                  <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>Pure Conceptual Focus</div>
                  <div style={{ fontSize: "14px" }}>No expanded notes for this topic.</div>
                  <button 
                    onClick={() => setSelectedSubtopic(null)}
                    style={{ marginTop: 32, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "12px 32px", borderRadius: "100px", cursor: "pointer", fontWeight: 800 }}
                  >
                    BACK TO OVERVIEW
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural Soundscapes HUD */}
      <div style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 16px",
        borderRadius: "100px",
        backdropFilter: "blur(20px)",
      }}>
        <button 
          onClick={togglePlay}
          style={{ 
            background: "rgba(0,255,136,0.1)", 
            border: "none", 
            width: 32, 
            height: 32, 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#00ff88",
            cursor: "pointer"
          }}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" style={{ marginLeft: 2 }} />}
        </button>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
            {isPlaying && <Waveform />} Neural Soundscape
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: isPlaying ? "#fff" : "rgba(255,255,255,0.4)" }}>
            {TRACKS[currentTrackIdx].name}
          </div>
        </div>

        <button 
          onClick={nextTrack}
          style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <SkipForward size={14} />
        </button>

        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Volume2 size={12} color="rgba(255,255,255,0.4)" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ 
              width: 60, 
              accentColor: "#00ff88",
              cursor: "pointer"
            }} 
          />
        </div>
      </div>

      {/* Bottom HUD (Pinned) */}
      <div style={{
        position: "fixed",
        bottom: 40,
        left: 40,
        display: "flex",
        gap: 40,
        opacity: 0.4,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "2px",
        textTransform: "uppercase",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Orbit size={12} /> SYNCING
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={12} /> OPTIMIZED
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); borderRadius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        .immersive-markdown h1, .immersive-markdown h2, .immersive-markdown h3 { font-family: 'Syne', sans-serif; }
        input[type=range]::-webkit-slider-runnable-track {
          height: 2px;
          background: rgba(255,255,255,0.1);
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #00ff88;
          margin-top: -4px;
        }
      `}</style>
    </motion.div>
  );
};

export default FocusPulse;
