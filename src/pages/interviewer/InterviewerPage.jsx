import React, { useState, useEffect, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { createRetellWebCall, generateInterviewAnalysis, updateRetellCallVariables } from "../../services/aiService";
import { 
  Mic, MicOff, PhoneOff, Play, CheckCircle, 
  AlertCircle, Loader2, User, Briefcase, 
  ChevronRight, Zap, MessageSquare, BarChart2, Activity, Code2
} from "lucide-react";
import "../../styles/Interviewer.css";


export default function InterviewerPage({ onClose }) {
  const [stage, setStage] = useState("setup"); // setup | calling | feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [volume, setVolume] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));

  // Metrics state
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  const client = useRef(new RetellWebClient());
  const micAnalyser = useRef(null);
  const audioCtx = useRef(null);
  const micStream = useRef(null);

  const [form, setForm] = useState({
    role: "Software Engineer",
    seniority: "Mid-Level",
    jobDescription: "",
    resumeText: "",
    language: "English"
  });

  // IDE State
  const [isIdeOpen, setIsIdeOpen] = useState(false);
  const [code, setCode] = useState("# Write your Python solution here...\n\ndef main():\n    nums = [1, 2, 3, 4, 5]\n    evens = [x for x in nums if x % 2 == 0]\n    print(f\"Found evens: {evens}\")\n\nif __name__ == \"__main__\":\n    main()");
  const [codeOutput, setCodeOutput] = useState("");
  const [lastSharedCallId, setLastSharedCallId] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  // Initialize Pyodide on mount or when IDE is opened
  useEffect(() => {
    if (isIdeOpen && !pyodide && !pyodideLoading) {
      const loadPython = async () => {
        setPyodideLoading(true);
        try {
          // Check if already loaded in script tag
          if (!window.loadPyodide) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
            script.async = true;
            document.body.appendChild(script);
            await new Promise((resolve) => (script.onload = resolve));
          }
          
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
          });
          setPyodide(py);
        } catch (err) {
          console.error("Pyodide loading error:", err);
          setCodeOutput("Failed to load Python environment. Using fallback mode.");
        } finally {
          setPyodideLoading(false);
        }
      };
      loadPython();
    }
  }, [isIdeOpen, pyodide, pyodideLoading]);

  const animationFrameRef = useRef();

  // Handle Retell events
  useEffect(() => {
    const currentClient = client.current;

    currentClient.on("call_started", () => {
      console.log("Call started");
      setIsCalling(true);
      setStage("calling");
      setLoading(false);
    });

    currentClient.on("call_ended", () => {
      console.log("Call ended");
      setIsCalling(false);
      setStage(prev => {
        if (prev === "calling") {
          setTimeout(() => handleAnalysis(), 500); 
          return "loading_report";
        }
        return prev;
      });
    });

    currentClient.on("error", (err) => {
      console.error("Retell Error:", err);
      setError("Voice session hit a snag. Please try again.");
      setLoading(false);
      setIsCalling(false);
    });

    currentClient.on("update", (update) => {
      if (update.transcript) {
        setTranscriptHistory(update.transcript);
        
        // Calculate WPM using only user text
        const userText = update.transcript
          .filter(t => t.role === "user")
          .map(t => t.content)
          .join(" ");
        
        const wordCount = userText.split(/\s+/).filter(w => w.length > 0).length;
        setTotalWords(wordCount);

        if (!startTime && wordCount > 0) {
          setStartTime(Date.now());
        }

        if (startTime) {
          const minutes = (Date.now() - startTime) / 60000;
          if (minutes > 0.05) { // Avoid spike at start
            setWpm(Math.round(wordCount / minutes));
          }
        }
      }
    });

    // Native Audio Engine (Hardware Direct)
    let isActive = true;
    const updateAudioMetrics = () => {
      if (!isActive || !micAnalyser.current) return;
      
      const analyser = micAnalyser.current;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      setFrequencyData(dataArray);

      // Volume calculation from raw frequency data
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      setVolume(avg / 255); // Normalize to 0-1

      // Pitch estimation (Simple peak-based Hz estimation)
      let maxVal = 0;
      let maxIdx = 0;
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i];
          maxIdx = i;
        }
      }
      const nyquist = audioCtx.current.sampleRate / 2;
      const hzPerBin = nyquist / analyser.frequencyBinCount;
      const estimatedPitch = maxIdx * hzPerBin;
      
      if (avg > 5) { // Sensitivity threshold
        setPitch(Math.round(estimatedPitch));
      } else {
        setPitch(0);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateAudioMetrics);
    };

    const startNativeAudio = async () => {
      try {
        if (!audioCtx.current) {
          audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
          micAnalyser.current = audioCtx.current.createAnalyser();
          micAnalyser.current.fftSize = 512;
        }
        
        if (audioCtx.current.state === "suspended") {
          await audioCtx.current.resume();
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.current = stream;
        const source = audioCtx.current.createMediaStreamSource(stream);
        source.connect(micAnalyser.current);
        
        updateAudioMetrics();
      } catch (err) {
        console.error("Native Audio Failed:", err);
      }
    };

    if (isCalling) {
      startNativeAudio();
    }

    return () => {
      isActive = false;
      currentClient.off("call_started");
      currentClient.off("call_ended");
      currentClient.off("error");
      currentClient.off("update");
      
      if (micStream.current) {
        micStream.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCalling]);

  const handleStartCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await createRetellWebCall(form);
      setTranscriptHistory([]);
      setLastSharedCallId(data.call_id); // Store ID for IDE updates
      await client.current.startCall({
        accessToken: data.access_token,
      });
    } catch (err) {
      console.error("Failed to start call:", err);
      setError(err.message || "Could not initialize interview session.");
      setLoading(false);
    }
  };

  const handleStopCall = () => {
    client.current.stopCall();
  };

  const handleAnalysis = async () => {
    setStage("loading_report");
    setLoading(true);
    try {
      // For analysis, we use the LIVE transcript we collected or fetch a fresh one
      const actualTranscript = transcriptHistory.length > 0 
        ? transcriptHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")
        : `User role: ${form.role}. Seniority: ${form.seniority}. JD Context: ${form.jobDescription}. The session ended unexpectedly early.`;
      
      const report = await generateInterviewAnalysis(actualTranscript, form);
      setAnalysis(report);
      setStage("feedback");
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Could not generate performance report.");
      setStage("setup");
    } finally {
      setLoading(false);
    }
  };

  // IDE Actions
  const runCode = async () => {
    if (!pyodide) {
      setCodeOutput("Python environment is still warming up...");
      return;
    }

    setCodeOutput("> Initializing Python session...\n");
    
    try {
      // Redirect stdout to our console
      await pyodide.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
`);
      
      await pyodide.runPythonAsync(code);
      
      const stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      setCodeOutput(stdout || "Executed successfully (no output).");
    } catch (err) {
      setCodeOutput(`Python Error:\n${err.message}`);
    }
  };

  const shareToInterviewer = async () => {
    if (!lastSharedCallId) return;
    setSharing(true);
    setIsShared(false);
    try {
      // Prioritize the code snapshot at the top of the prompt override
      const codeSnapshot = `\n[URGENT_CODE_TO_REVIEW]\n${code}\n[OUTPUT]\n${codeOutput || "No output."}\n`;
      
      const languageDirective = form.language === "English" 
        ? "Speak ONLY in English."
        : "USE COLLOQUIAL HINGLISH.";

      const directiveUpdate = `SYSTEM: THE USER HAS JUST UPDATED THE CODE. 
      REVIEW THIS IMMEDIATELY: ${codeSnapshot} 
      Persona: VINOD (Tech Lead). Language: ${languageDirective}. 
      Context: ${form.jobDescription || "Technical interview."}`;

      await updateRetellCallVariables(lastSharedCallId, {
        shared_code: code,
        shared_output: codeOutput || "No output generated yet.",
        job_description: directiveUpdate // Snapshot injection
      });
      
      setIsShared(true);
      setCodeOutput(prev => prev + "\n> SYNCED WITH VINOD ✓");
    } catch (err) {
      console.error("Sharing failed:", err);
      setError("Failed to sync code with interviewer. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="interviewer-page">
      <div className="interviewer-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00ff88, #0088ff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={18} color="#000" />
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>INTELLIGENCE STUDIO</h1>
              <p style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.4)", margin: 0, fontWeight: 700, textTransform: "uppercase" }}>
                {stage === "setup" ? "Session Ready" : stage === "calling" ? "Live Interview" : "Performance Report"}
              </p>
            </div>
        </div>

        {isCalling && (
          <div className="status-badge">
            <div className="pulse-dot" /> LIVE SESSION
          </div>
        )}

        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(255, 255, 255, 0.4)", cursor: "pointer" }}>
          <PhoneOff size={20} />
        </button>
      </div>

      <div className="interviewer-content">
        {stage === "setup" && (
          <div className="setup-container">
            <div className="setup-card">
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ display: "inline-flex", padding: 14, borderRadius: 20, background: "rgba(0, 255, 136, 0.1)", marginBottom: 16 }}>
                  <Mic size={40} color="#00ff88" />
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Practice for Perfection</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, maxWidth: 400, margin: "0 auto" }}>Real-time voice interview simulation with a custom AI Tech Lead.</p>
              </div>

              {/* Target Role & Seniority */}
              <div className="form-grid">
                <div className="form-group">
                  <label><Briefcase size={16} /> Target Role</label>
                  <input 
                    className="form-input"
                    type="text" 
                    value={form.role} 
                    onChange={(e) => setForm({...form, role: e.target.value})}
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div className="form-group">
                  <label><BarChart2 size={16} /> Seniority</label>
                  <select 
                    className="form-select"
                    value={form.seniority}
                    onChange={(e) => setForm({...form, seniority: e.target.value})}
                  >
                    <option>Entry-Level</option>
                    <option>Mid-Level</option>
                    <option>Senior</option>
                    <option>Lead / Architect</option>
                  </select>
                </div>
              </div>

              {/* Language Selection Row */}
              <div className="form-group">
                <label><MessageSquare size={16} /> Interview Language</label>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  {["English", "Hindi"].map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setForm({...form, language: lang})}
                      style={{
                        flex: 1,
                        padding: "16px",
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: form.language === lang ? "#00ff88" : "rgba(255, 255, 255, 0.1)",
                        background: form.language === lang 
                          ? "rgba(0, 255, 136, 0.1)" 
                          : "rgba(255, 255, 255, 0.05)",
                        color: form.language === lang ? "#00ff88" : "rgba(255, 255, 255, 0.4)",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontWeight: 800, fontSize: 13
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label><Briefcase size={16} /> Job Description (Skills Focus)</label>
                  <textarea 
                    className="form-textarea"
                    value={form.jobDescription}
                    onChange={(e) => setForm({...form, jobDescription: e.target.value})}
                    placeholder="Paste JD text here..."
                    rows={4}
                    style={{ resize: "none" }}
                  />
                </div>

                <div className="form-group">
                  <label><User size={16} /> Your Resume (Personalization)</label>
                  <textarea 
                    className="form-textarea"
                    value={form.resumeText}
                    onChange={(e) => setForm({...form, resumeText: e.target.value})}
                    placeholder="Paste your resume content here..."
                    rows={4}
                    style={{ resize: "none" }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: 16, borderRadius: 12, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button 
                className="start-btn" 
                onClick={handleStartCall}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                {loading ? "INITIALIZING AGENT..." : "START VOICE INTERVIEW"}
              </button>
            </div>
          </div>
        )}

        {stage === "calling" && (
          <div className="calling-stage">
            {error && (
              <div className="live-error-toast">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            <div className="metrics-overlay">
              <div className="metric-pill">
                <span className="metric-label">Voice Pitch</span>
                <span className="metric-value">{pitch > 0 ? pitch : 0} Hz</span>
              </div>
              <div className="metric-pill">
                <span className="metric-label">Active Band</span>
                <span className="metric-value highlight">{volume > 0.01 ? (0.5 + (pitch / 2000)).toFixed(1) : 0} kHz</span>
              </div>
              <div className="metric-pill">
                <span className="metric-label">Session Time</span>
                <span className="metric-value">
                  {startTime ? Math.floor((Date.now() - startTime) / 60000) : 0}m {startTime ? Math.floor(((Date.now() - startTime) / 1000) % 60) : 0}s
                </span>
              </div>
            </div>

            <div className={`siri-stage ${isIdeOpen ? "is-ide-active" : ""}`}>
              {/* Zone 1: Transcript Sidebar (Dynamic Shift) */}
              <div className="live-transcript-container">
                <div className="live-transcript-feed">
                  {transcriptHistory.slice(-3).map((msg, i) => (
                    <div key={i} className={`live-bubble-wrapper ${msg.role === "user" ? "right" : "left"}`}>
                      <div className={`live-bubble ${msg.role}`}>
                        <span className="bubble-label">{msg.role === "user" ? "CANDIDATE" : "INTERVIEWER"}</span>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone 2: Visualizer Core (Central Anchor) */}
              <div className="neural-core" style={{ transform: `scale(${1 + volume * 0.8})` }}>
                <div className="blob-container">
                  <div className="blob blob-1" />
                  <div className="blob blob-2" />
                  <div className="blob blob-3" />
                  <div className="blob blob-4" />
                  <div className="blob blob-5" />
                </div>
                <div className="core-pulse" style={{ transform: `scale(${1 + volume * 1.5})`, opacity: 0.2 + volume * 0.5 }} />
              </div>

              <div className="waveform-horizontal">
                {[...Array(60)].map((_, i) => {
                  const dataValue = frequencyData[i % frequencyData.length] || 0;
                  const h = Math.max(8, (dataValue / 255) * 160 + (volume * 15));
                  return (
                    <div key={i} className="wave-bar" style={{ height: h, background: `hsla(${140 + i*3}, 80%, 60%, ${0.4 + volume})` }} />
                  );
                })}
              </div>

              <div className="ide-toggle-container">
                <button 
                  className={`ide-toggle-btn ${isIdeOpen ? 'active' : ''}`}
                  onClick={() => setIsIdeOpen(!isIdeOpen)}
                >
                  <Code2 size={18} /> {isIdeOpen ? "CLOSE SANDBOX" : "OPEN CODE SANDBOX"}
                </button>
              </div>

              {/* Zone 3: IDE Sidebar (Overlay Shift) */}
              {isIdeOpen && (
                <div className="ide-panel-overlay">
                  <div className="ide-container">
                    <div className="ide-header">
                      <div className="ide-title">
                        <Code2 size={16} color="#00ff88" /> 
                        <span>PYTHON 3.11 SANDBOX</span>
                        {pyodideLoading && <Loader2 size={12} className="spin-animate" style={{ marginLeft: 8 }} />}
                      </div>
                      <div className="ide-actions">
                        <button onClick={runCode} className="ide-run-btn" disabled={pyodideLoading}>
                          {pyodideLoading ? <Loader2 size={12} className="spin-animate" /> : <Play size={14} />} 
                          {pyodideLoading ? " LOADING..." : " RUN"}
                        </button>
                        <button 
                          onClick={shareToInterviewer} 
                          className={`ide-share-btn ${isShared ? 'shared' : ''}`} 
                          disabled={sharing}
                        >
                          {sharing ? "SYNCING..." : isShared ? "SHARED ✓" : "SHARE TO INTERVIEWER"}
                        </button>
                      </div>
                    </div>
                    
                    <div className="ide-editor-area">
                      <div className="ide-line-numbers">
                        {Array.from({ length: code.split('\n').length }).map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        className="ide-textarea"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                          setIsShared(false); // Reset shared status on edit
                        }}
                        spellCheck="false"
                      />
                    </div>
                    
                    <div className="ide-console">
                      <div className="console-header">CONSOLE OUTPUT</div>
                      <pre className="console-content">{codeOutput || "> Ready for input..."}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="interviewer-controls">
              <button className="stop-btn" onClick={handleStopCall}>
                <PhoneOff size={24} /> END SESSION
              </button>
            </div>
          </div>
        )}

        {stage === "loading_report" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="score-visual" style={{ width: 240, height: 240, marginBottom: 32 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #00ff88", borderTopColor: "transparent", opacity: 0.1 }} />
              <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: "3px solid #0088ff", borderRightColor: "transparent", animation: "spin 2s linear infinite" }} />
              <Activity size={64} className="animate-pulse" color="#00ff88" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, textTransform: "uppercase", letterSpacing: 4 }}>ANALYZING PERFORMANCE</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: 1 }}>VINOD is preparing your technical scorecard...</p>
          </div>
        )}

        {stage === "feedback" && analysis && (
          <div className="feedback-container">
            <div className="score-hero" style={{ padding: 60, gap: 60, borderRadius: 48, background: "rgba(20, 20, 20, 0.4)", border: "1px solid rgba(255, 255, 255, 0.05)", backdropFilter: "blur(20px)" }}>
              <div className="score-visual" style={{ width: 140, height: 140 }}>
                <span className="score-number" style={{ fontSize: 48, background: "linear-gradient(135deg, #00ff88, #0088ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{analysis.score}</span>
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, letterSpacing: -1.5 }}>PERFORMANCE REPORT</h1>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{analysis.verdict}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button 
                  onClick={() => setStage("setup")}
                  style={{ padding: "16px 32px", borderRadius: 16, background: "#00ff88", color: "#000", fontWeight: 900, cursor: "pointer", border: "none", fontSize: 14 }}
                >
                  RESTART PREP
                </button>
                <button onClick={onClose} style={{ padding: "16px 32px", borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white", fontWeight: 700, fontSize: 14 }}>
                  EXIT
                </button>
              </div>
            </div>

            <div className="feedback-grid" style={{ marginTop: 40 }}>
              <div className="scorecard-mini">
                <div className="score-big tech">{analysis.detailedScores?.technical || 0}</div>
                <div className="score-label">Technical Depth</div>
              </div>
              <div className="scorecard-mini">
                <div className="score-big comm">{analysis.detailedScores?.communication || 0}</div>
                <div className="score-label">Communication</div>
              </div>
              <div className="scorecard-mini">
                <div className="score-big conf">{analysis.detailedScores?.confidence || 0}</div>
                <div className="score-label">Confidence</div>
              </div>

              <div className="analysis-card" style={{ gridColumn: "span 1.5" }}>
                <div className="card-title"><CheckCircle size={16} /> KEY STRENGTHS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {analysis.strengths?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                      <span style={{ color: "#00ff88" }}>•</span> {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="analysis-card" style={{ gridColumn: "span 1.5" }}>
                <div className="card-title"><AlertCircle size={16} color="#ff3b30" /> GROWTH AREAS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {analysis.weaknesses?.map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                      <span style={{ color: "#ff3b30" }}>•</span> {w}
                    </div>
                  ))}
                </div>
              </div>

              <div className="transcript-section">
                <div className="card-title" style={{ marginBottom: 24, letterSpacing: 3 }}>
                  <MessageSquare size={16} /> FULL INTERVIEW TRANSCRIPT
                </div>
                <div className="transcript-scroll">
                  {transcriptHistory.map((msg, idx) => (
                    <div key={idx} style={{ 
                      padding: 20, 
                      borderRadius: 16, 
                      background: msg.role === "user" ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 255, 255, 0.03)",
                      border: "1px solid",
                      borderColor: msg.role === "user" ? "rgba(0, 255, 136, 0.15)" : "rgba(255, 255, 255, 0.08)",
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%"
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 900, marginBottom: 8, color: msg.role === "user" ? "#00ff88" : "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
                        {msg.role === "user" ? "CANDIDATE" : "INTERVIEWER"}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>{msg.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
