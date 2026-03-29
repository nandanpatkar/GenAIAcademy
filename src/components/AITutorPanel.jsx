import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Assuming installed if they have tables, else we drop it
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { askAITutor } from "../services/aiService";

SyntaxHighlighter.registerLanguage('python', python);

export default function AITutorPanel({ isOpen, onClose, activeTopic, activeModule, activeCode }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your GenAI Academy Tutor. \n\  \nI can see you're currently working on **" + (activeTopic || "a new problem") + "**. Let me know if you need any hints or if you'd like me to review your code!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Reset chat if topic changes
  useEffect(() => {
    if (activeTopic) {
      setMessages([{ 
        role: "assistant", 
        content: `Hi! I'm your GenAI Academy Tutor. I can see you're currently working on **${activeTopic}**. Let me know if you need any hints or if you'd like me to review it!` 
      }]);
    }
  }, [activeTopic]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Pass history excluding the current message
      const history = newMessages.slice(0, -1);
      const contextData = { topicTitle: activeTopic, moduleTitle: activeModule, activeCode };
      
      const responseText = await askAITutor(userMsg, contextData, history);
      
      setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
    } catch (error) {
       setMessages(prev => [...prev, { role: "assistant", content: "Oops, " + error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      position: "fixed", top: 16, right: 16, bottom: 16, width: 400,
      background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16,
      boxShadow: "0 12px 48px rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", flexDirection: "column",
      backdropFilter: "blur(20px)",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "var(--neon-dim)", color: "var(--neon)", padding: 6, borderRadius: 8 }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--text)" }}>AI Socratic Tutor</h3>
            <p style={{ fontSize: 11, color: "var(--text2)", margin: 0 }}>Context updated in real-time</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text3)", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }} className="hover-node">
          <X size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: msg.role === "assistant" ? "var(--neon-dim)" : "var(--bg4)", color: msg.role === "assistant" ? "var(--neon)" : "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {msg.role === "assistant" ? <Sparkles size={16} /> : <User size={16} />}
            </div>
            <div style={{
              background: msg.role === "assistant" ? "var(--bg3)" : "var(--neon-dim)",
              color: msg.role === "assistant" ? "var(--text)" : "var(--neon)",
              padding: "12px 16px", borderRadius: 12,
              border: msg.role === "assistant" ? "1px solid var(--border)" : "1px solid rgba(0,255,136,0.2)",
              maxWidth: "80%", fontSize: 13, lineHeight: 1.5,
              borderTopLeftRadius: msg.role === "assistant" ? 4 : 12,
              borderTopRightRadius: msg.role === "user" ? 4 : 12
            }}>
              {msg.role === "user" ? msg.content : (
                <div className="markdown-body" style={{ fontSize: 13, background: "transparent", color: "inherit", overflow: "hidden" }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <div style={{ margin: "8px 0", borderRadius: 6, overflow: "hidden", fontSize: 12 }}>
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, '')}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, background: "#1e1e1e" }}
                              {...props}
                            />
                          </div>
                        ) : (
                          <code className={className} style={{ background: "rgba(255,255,255,0.1)", padding: "2px 4px", borderRadius: 4, color: "var(--neon)" }} {...props}>
                            {children}
                          </code>
                        )
                      },
                      a({node, children, ...props}) {
                        return <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: "var(--neon)", textDecoration: "underline" }}>{children}</a>
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: 12, flexDirection: "row" }}>
            <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "var(--neon-dim)", color: "var(--neon)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={16} />
            </div>
            <div style={{ padding: "12px 16px", borderRadius: 12, borderTopLeftRadius: 4, background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <Loader2 size={14} className="spin" style={{ color: "var(--neon)" }} /> <span style={{ color: "var(--text2)", fontSize: 13 }}>Thinking contextually...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: 16, borderTop: "1px solid var(--border)", background: "var(--bg3)" }}>
        <div style={{ position: "relative" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeTopic ? `Ask about ${activeTopic}...` : "Ask your tutor..."}
            rows={1}
            style={{ 
              width: "100%", padding: "14px 44px 14px 16px", borderRadius: 8, 
              background: "var(--bg2)", border: "1px solid var(--border)", 
              color: "var(--text)", fontSize: 13, resize: "none", overflow: "hidden",
              fontFamily: "var(--font)", outline: "none", transition: "border .2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--neon)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{ 
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: input.trim() && !isLoading ? "var(--neon)" : "var(--bg5)", 
              color: input.trim() && !isLoading ? "#000" : "var(--text3)",
              border: "none", width: 32, height: 32, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() && !isLoading ? "pointer" : "default",
              transition: "all .2s"
            }}
          >
            <Send size={14} />
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "var(--text3)" }}>
          Press Enter to send, Shift + Enter for new line.
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: tutor-spin 1s linear infinite; }
        @keyframes tutor-spin { 100% { transform: rotate(360deg); } }
        .hover-node:hover { background: var(--bg4) !important; color: var(--text) !important; }
      `}} />
    </div>
  );
}
