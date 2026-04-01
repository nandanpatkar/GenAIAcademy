import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowLeft, Play, Square, Loader, ExternalLink, Terminal as TerminalIcon, Sparkles } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useSimplePyodide } from "./PythonIDE";
import AITutorPanel from "./AITutorPanel";

export default function TopicContentPanel({ topic, module, pathColor, activePath, onClose, onSaveTopic, isEditMode }) {
  const [content, setContent] = useState(topic.content || "");
  const [title, setTitle] = useState(topic.title || "");
  const [linkUrl, setLinkUrl] = useState(topic.linkUrl || "");
  const [pythonCode, setPythonCode] = useState(topic.pythonCode || "# Write your python solution here...\n");
  const [saveText, setSaveText] = useState("SAVE CHANGES");
  const [showTutor, setShowTutor] = useState(false);


  const { runPython, stdout, stderr, isLoading, isRunning, interruptExecution } = useSimplePyodide();

  useEffect(() => {
    setContent(topic.content || "");
    setTitle(topic.title || "");
    setLinkUrl(topic.linkUrl || "");
    setPythonCode(topic.pythonCode || "# Write your python solution here...\n");
  }, [topic]);

  const practiceLinks = module?.links?.filter(l => {
    const matchTopic = l.title.includes(title) || 
                       title.includes(l.title.split('(')[0].trim()) || 
                       title.includes(l.title.split('—')[0].trim());
    return matchTopic;
  }) || [];


  const handleSave = () => {
    onSaveTopic({ ...topic, title, content, linkUrl, pythonCode });
    setSaveText("✓ SAVED!");
    setTimeout(() => setSaveText("SAVE CHANGES"), 2000);
  };
  
  // Autosave code changes when typing so they aren't lost if unmounted
  // This is optional if we prefer manual saves, but for coding autosave is better.
  useEffect(() => {
    if (!isEditMode && topic.pythonCode !== pythonCode) {
      const timeout = setTimeout(() => {
        onSaveTopic({ ...topic, title, content, linkUrl, pythonCode });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [pythonCode, isEditMode, topic, title, content, linkUrl, onSaveTopic]);

  const handleRun = () => {
    runPython(pythonCode);
  };

  const showIDE = activePath === "dsa";

  return (
    <div className="topic-panel" style={{ flex: 1, background: "var(--bg2)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="tp-header" style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <button 
          onClick={onClose}
          style={{ background: "transparent", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)" }}
        >
          <ArrowLeft size={14} /> BACK TO MODULE
        </button>
        
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!showIDE && (
            <button 
              onClick={() => setShowTutor(true)} 
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "var(--neon-dim)", color: "var(--neon)", border: "1px solid rgba(0,255,136,.3)", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}
              className="hover-node"
            >
              <Sparkles size={12} fill="currentColor" /> ASK AI
            </button>
          )}
          {practiceLinks.length > 0 ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {practiceLinks.map((link, i) => (

                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg3)", padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", transition: "all .2s" }}>
                  <a 
                    href={link.url}
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text)", textDecoration: "none", fontSize: 12, fontWeight: 600 }}
                  >
                    <ExternalLink size={14} /> 
                    <span>{link.title.includes("LeetCode") || link.title.includes("Practice") ? "LeetCode" : link.title.split('—')[0].trim()}</span>

                  </a>
                  {link.companies && link.companies.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginLeft: 8, borderLeft: "1px solid var(--border)", paddingLeft: 8 }}>
                      {link.companies.slice(0, 2).map((c, ci) => (
                        <span key={ci} style={{ fontSize: 8, fontWeight: 700, color: "var(--text3)", background: "var(--bg4)", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>{c}</span>
                      ))}
                      {link.companies.length > 2 && <span key="more" style={{ fontSize: 8, color: "var(--text3)" }}>+{link.companies.length - 2}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : !isEditMode && linkUrl && (
             <a 
               href={linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`} 
               target="_blank" 
               rel="noreferrer"
               style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text)", textDecoration: "none", fontSize: 12, fontWeight: 600, background: "var(--bg3)", padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", transition: "all .2s" }}
             >
               <ExternalLink size={14} /> View Original Problem
             </a>
          )}
          {isEditMode && (
            <button 
              onClick={handleSave}
              style={{ padding: "8px 16px", background: saveText === "✓ SAVED!" ? "#00ff88" : (pathColor || "var(--neon)"), color: "#000", border: "none", borderRadius: "8px", fontWeight: 800, fontSize: 11, cursor: "pointer", transition: "all .2s" }}
            >
              {saveText}
            </button>
          )}
        </div>
      </div>

      <div className="tp-body" style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        
        <div style={{ width: showIDE ? (isEditMode ? "50%" : "40%") : "100%", padding: 24, overflowY: "auto", borderRight: showIDE ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", gap: 24, margin: showIDE ? 0 : "0 auto", maxWidth: showIDE ? "none" : 960 }}>
          {isEditMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: "1px" }}>EDIT PROBLEM STATEMENT</div>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", background: "transparent", border: "none", outline: "none", width: "100%", fontFamily: "var(--font)", letterSpacing: "-1px" }}
                placeholder="Topic / Problem Title..."
              />
              <input 
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                style={{ fontSize: 13, color: "var(--text2)", background: "var(--bg3)", border: "1px solid var(--border)", outline: "none", width: "100%", padding: "10px 14px", borderRadius: 8 }}
                placeholder="External Link (e.g. LeetCode URL)..."
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your problem description or content here..."
                style={{ flex: 1, background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "12px", padding: 20, fontSize: 14, lineHeight: 1.6, fontFamily: "var(--mono)", outline: "none", resize: "none" }}
              />
            </div>
          ) : (
            <div className="markdown-body" style={{ color: "var(--text)", fontSize: 15, lineHeight: 1.7, fontFamily: "var(--font)", paddingRight: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 0, letterSpacing: "-1px" }}>{title || "Untitled Topic"}</h1>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                </div>

              </div>
              
              {topic.companies && topic.companies.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
                  {topic.companies.map((c, ci) => (
                    <span key={ci} style={{ fontSize: 9, fontWeight: 700, color: "var(--text2)", background: "var(--bg3)", padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{c}</span>
                  ))}
                </div>
              )}

              {content ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ borderRadius: "12px", padding: "16px", margin: "20px 0", background: "#1e1e1e", border: "1px solid var(--border)", fontSize: 13, fontFamily: "var(--mono)", lineHeight: 1.5 }} {...props}>{String(children).replace(/\n$/, "")}</SyntaxHighlighter>
                      ) : (
                        <code className={className} style={{ background: "var(--bg4)", padding: inline ? "2px 6px" : "16px", borderRadius: inline ? 6 : 12, display: inline ? "inline" : "block", overflowX: inline ? "visible" : "auto", fontFamily: "var(--mono)", fontSize: 13, border: inline ? "none" : "1px solid var(--border)", color: inline ? "var(--neon)" : "var(--text)", lineHeight: 1.5 }} {...props}>{children}</code>
                      )
                    },
                    h1: ({node, ...props}) => <h1 style={{fontSize: 24, marginTop: 32, marginBottom: 16, fontWeight: 800, borderBottom: "1px solid var(--border)", paddingBottom: 8}} {...props} />,
                    h2: ({node, ...props}) => <h2 style={{fontSize: 20, marginTop: 24, marginBottom: 16, fontWeight: 700}} {...props} />,
                    h3: ({node, ...props}) => <h3 style={{fontSize: 18, marginTop: 20, marginBottom: 12, fontWeight: 700}} {...props} />,
                    a: ({node, href, ...props}) => <a href={href} style={{color: pathColor || "var(--neon)"}} target="_blank" {...props} />,
                    img: ({node, ...props}) => <img style={{maxWidth: "100%", borderRadius: 8, border: "1px solid var(--border)", margin: "20px 0"}} {...props} />,
                    blockquote: ({node, ...props}) => <blockquote style={{borderLeft: `4px solid ${pathColor || "var(--neon)"}`, paddingLeft: 16, color: "var(--text2)", margin: "20px 0", fontStyle: "italic", background: "rgba(255,255,255,0.02)", padding: "12px 16px", borderRadius: "0 8px 8px 0"}} {...props} />,
                    ul: ({node, ...props}) => <ul style={{paddingLeft: 20, margin: "16px 0", color: "var(--text2)"}} {...props} />,
                    ol: ({node, ...props}) => <ol style={{paddingLeft: 20, margin: "16px 0", color: "var(--text2)"}} {...props} />,
                    li: ({node, ...props}) => <li style={{marginBottom: 8}} {...props} />,
                    p: ({node, ...props}) => <p style={{margin: "0 0 16px 0"}} {...props} />
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: 32 }}>
                  <div style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 15 }}>
                    No problem description available. Switch to Edit Mode to add context!
                  </div>
                  {practiceLinks.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, background: "rgba(255,255,255,0.02)", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)", letterSpacing: "1px" }}>PRACTICE LINKS</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {practiceLinks.map((link, i) => (
                          <a 
                            key={i}
                            href={link.url}
                            target="_blank" 
                            rel="noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 12, color: pathColor || "var(--neon)", textDecoration: "none", fontSize: 15, fontWeight: 600, padding: "12px 16px", background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)", transition: "all .2s" }}
                          >
                            <ExternalLink size={16} /> 
                            {link.title.includes("LeetCode") || link.title.includes("Practice") ? "Solve on LeetCode" : link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {showIDE && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1e1e1e" }}>
            <div style={{ padding: "10px 16px", background: "var(--bg1)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", display: "flex", alignItems: "center", gap: 6 }}><TerminalIcon size={14} /> SOLUTION WORKSPACE</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button 
                  onClick={() => setShowTutor(true)} 
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "var(--neon-dim)", color: "var(--neon)", border: "1px solid rgba(0,255,136,.3)", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}
                  className="hover-node"
                >
                  <Sparkles size={12} fill="currentColor" /> ASK AI
                </button>
                {isLoading && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text3)", fontSize: 12 }}><Loader size={14} className="spin" /> Loading Kernel...</div>}
                {isRunning ? (
                  <button onClick={interruptExecution} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    <Square size={12} fill="currentColor" /> STOP
                  </button>

                ) : (
                  <button onClick={handleRun} disabled={isLoading} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: isLoading ? "var(--bg3)" : (pathColor || "#00ff88"), color: "#000", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1 }}>
                    <Play size={12} fill="currentColor" /> RUN CODE
                  </button>
                )}
              </div>
            </div>
            <div style={{ flex: 2, position: "relative" }}>
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={pythonCode}
                onChange={val => setPythonCode(val || "")}
                options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'var(--mono)', scrollBeyondLastLine: false, smoothScrolling: true, padding: { top: 16 } }}
              />
            </div>
            <div style={{ height: "30%", minHeight: 150, borderTop: "1px solid #333", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
              <div style={{ background: "#1e1e1e", padding: "6px 12px", borderBottom: "1px solid #333", fontSize: 10, fontWeight: 700, color: "#8b949e", letterSpacing: "1px" }}>OUTPUT CONSOLE</div>
              <pre className="custom-scrollbar" style={{ flex: 1, padding: 12, margin: 0, overflowY: "auto", background: "transparent", color: stderr ? "#ff7b72" : "#a5d6ff", fontSize: 13, fontFamily: "var(--mono)", whiteSpace: "pre-wrap" }}>
                {(stdout || stderr) || <span style={{ color: "#484f58", fontStyle: "italic" }}>Execution output will appear here...</span>}
              </pre>
            </div>
          </div>
        )}
        <AITutorPanel 
          isOpen={showTutor} 
          onClose={() => setShowTutor(false)} 
          activeTopic={title} 
          activeModule={module?.title || "Algorithms"}
          activeCode={showIDE ? pythonCode : ""} 
        />
      </div>
    </div>
  );
}
