import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpenCheck, BrainCircuit, Bug, Code2, CornerDownLeft, Lightbulb, Loader2, Route, ScanLine, Send, ShieldCheck, Sparkles, User, Workflow } from "lucide-react";
import { askAITutor } from "../../services/aiService";

const quickPrompts = [
  { label: "Give me a hint", prompt: "Give me one small hint without revealing the full solution.", icon: Lightbulb },
  { label: "Explain the pattern", prompt: "Explain why this DSA pattern fits the problem, with a small conceptual example.", icon: Route },
  { label: "Review my code", prompt: "Review my current code. Identify the first important issue and guide me to fix it without rewriting everything.", icon: ScanLine },
  { label: "Find edge cases", prompt: "Find the most important edge cases for this problem and explain what each one tests.", icon: Bug },
];

const extractCode = (message) => {
  const match = String(message || "").match(/```(?:\w+)?\s*\n?([\s\S]*?)```/);
  return match?.[1]?.trimEnd() || "";
};

export default function DsaAiCoach({ problem, pattern, code, onInsertCode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: `I’m ready to help with **${problem?.title || "this problem"}**. I can use the problem pattern and the code currently open in your editor. Ask for a hint, an edge case, or a review of your approach.` }]);
    setInput("");
  }, [problem?.slug, problem?.title]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async (preset) => {
    const message = String(preset || input).trim();
    if (!message || loading) return;

    const history = [...messages];
    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    try {
      const response = await askAITutor(message, {
        topicTitle: `${problem?.title || "DSA problem"} (${pattern || "Core DSA"})`,
        moduleTitle: "DSA problem workspace",
        activeCode: code,
      }, history);
      setMessages((current) => [...current, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", isError: true, content: `I couldn’t reach the configured AI provider. ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="dsa-inline-ai" aria-label="DSA AI coach">
      <header className="dsa-inline-ai-head">
        <span><BrainCircuit size={18} /></span>
        <div><h2>DSA AI</h2><p>Problem-aware guidance, using your current code</p></div>
        <em><i /> Context ready</em>
      </header>

      <div className="dsa-inline-ai-context">
        <div><i><BookOpenCheck size={13} /></i><span>ACTIVE PROBLEM</span><b>{problem?.title}</b></div>
        <div><i><Workflow size={13} /></i><span>PATTERN</span><b>{pattern || "Core DSA"}</b></div>
        <div><i><Code2 size={13} /></i><span>EDITOR CONTEXT</span><b>{code?.trim() ? `${code.split("\n").length} lines attached` : "No code yet"}</b></div>
      </div>

      <div className="dsa-ai-guidance-mode"><span><ShieldCheck size={13} /> Guided learning</span><small>Hint-first responses · Your code stays in context</small></div>

      <div className="dsa-inline-ai-prompts" aria-label="Suggested AI prompts">
        {quickPrompts.map(({ label, prompt, icon: Icon }) => <button type="button" key={label} onClick={() => sendMessage(prompt)} disabled={loading}><Icon size={13} /> {label}</button>)}
      </div>

      <div className="dsa-inline-ai-messages" aria-live="polite">
        {messages.map((message, index) => {
          const suggestedCode = message.role === "assistant" ? extractCode(message.content) : "";
          return (
            <div className={`dsa-inline-ai-message ${message.role}${message.isError ? " error" : ""}`} key={`${message.role}-${index}`}>
              <span>{message.role === "assistant" ? <Sparkles size={14} /> : <User size={14} />}</span>
              <div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                {suggestedCode && <button type="button" className="dsa-ai-use-code" onClick={() => onInsertCode(suggestedCode)}><Code2 size={13} /> Use in editor</button>}
              </div>
            </div>
          );
        })}
        {loading && <div className="dsa-inline-ai-message assistant thinking"><span><Loader2 size={14} /></span><div>Reviewing the problem and your current code…</div></div>}
        <div ref={endRef} />
      </div>

      <div className="dsa-inline-ai-composer">
        <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} rows={2} placeholder={`Ask about ${problem?.title || "this problem"}…`} />
        <button type="button" onClick={() => sendMessage()} disabled={!input.trim() || loading} aria-label="Send message"><Send size={16} /></button>
        <small><CornerDownLeft size={11} /> Enter to send · Shift + Enter for a new line</small>
      </div>
    </section>
  );
}
