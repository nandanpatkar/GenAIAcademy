import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Archive,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Globe2,
  Maximize2,
  MessageSquarePlus,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { askContextCopilot } from "../services/aiService";
import { searchWeb } from "../services/webSearchService";
import { useAuth } from "../contexts/AuthContext";
import "../styles/full-context-chatbot.css";
import "../styles/full-context-chatbot-sources.css";
import "../styles/full-context-chatbot-overrides.css";

const STORAGE_PREFIX = "genai_atlas_chats_v1";

function AtlasLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 3.5C22.7 11.2 28.8 17.3 36.5 20C28.8 22.7 22.7 28.8 20 36.5C17.3 28.8 11.2 22.7 3.5 20C11.2 17.3 17.3 11.2 20 3.5Z" fill="currentColor" opacity=".22" />
      <path d="M20 8C22.1 14.2 25.8 17.9 32 20C25.8 22.1 22.1 25.8 20 32C17.9 25.8 14.2 22.1 8 20C14.2 17.9 17.9 14.2 20 8Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="3.2" fill="currentColor" />
    </svg>
  );
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeTopic = (topic) => {
  if (!topic) return "No topic selected";
  if (typeof topic === "string") return topic;
  return topic.title || topic.name || "Selected topic";
};

const compactValue = (value, depth = 0) => {
  if (depth > 4) return "…";
  if (Array.isArray(value)) return value.slice(0, 80).map((item) => compactValue(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).slice(0, 80).map(([key, item]) => [key, compactValue(item, depth + 1)]));
  }
  return value;
};

const buildProjectContext = ({ pathsData, activePath, activeNode, activeModule, activeTopic }) => {
  const hiddenKeys = new Set(["appearance", "onboarding"]);
  const paths = Object.entries(pathsData || {})
    .filter(([key, value]) => !hiddenKeys.has(key) && value && typeof value === "object")
    .map(([key, value]) => ({
      id: key,
      title: value.title || value.name || key,
      description: value.description || value.subtitle || "",
      nodes: (value.nodes || []).map((node) => ({
        id: node.id,
        title: node.title || node.name,
        status: node.status,
        modules: (node.modules || []).map((module) => ({
          id: module.id,
          title: module.title || module.name,
          status: module.status,
          subtopics: (module.subtopics || []).map((item) => typeof item === "string" ? item : {
            title: item.title,
            status: item.status,
          }),
        })),
      })),
    }));

  const workspace = pathsData?.workspace || {};
  return JSON.stringify(compactValue({
    currentView: {
      path: activePath,
      node: activeNode ? { id: activeNode.id, title: activeNode.title || activeNode.name } : null,
      module: activeModule ? { id: activeModule.id, title: activeModule.title || activeModule.name } : null,
      topic: normalizeTopic(activeTopic),
    },
    curriculum: paths,
    workspace: {
      notes: workspace.notes || [],
      maps: workspace.maps || [],
      history: workspace.history || [],
    },
    savedAlgorithms: pathsData?.saved_algos || [],
    savedProjects: pathsData?.projects || [],
  }), null, 2);
};

const createChat = (provider = "gemini") => ({
  id: makeId(),
  title: "New conversation",
  updatedAt: Date.now(),
  provider,
  webEnabled: false,
  messages: [{
    id: makeId(),
    role: "assistant",
    content: "Hi, I’m Atlas — your project-aware copilot. I can connect the dots across your roadmap, progress, workspace notes, and current topic. What are we working through?",
  }],
});

const readChats = (storageKey, provider = "gemini") => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) && saved.length ? saved : [createChat(provider)];
  } catch (_) {
    return [createChat(provider)];
  }
};

export default function FullContextChatbot({
  pathsData,
  activePath,
  activeNode,
  activeModule,
  activeTopic,
  user,
}) {
  const { geminiKey, aiProvider, azureEndpoint, azureKey } = useAuth();
  const storageKey = `${STORAGE_PREFIX}_${user?.id || "local"}`;
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [chats, setChats] = useState(() => readChats(storageKey, aiProvider));
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyQuery, setHistoryQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const nextChats = readChats(storageKey, aiProvider);
    setChats(nextChats);
    setActiveChatId(nextChats[0]?.id);
  }, [storageKey, aiProvider]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(chats.slice(0, 30)));
  }, [chats, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId, isLoading]);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0];
  const providerReady = activeChat?.provider === "azure-openai"
    ? Boolean(azureEndpoint?.trim() && azureKey?.trim())
    : Boolean(geminiKey?.trim());
  const projectContext = useMemo(() => buildProjectContext({ pathsData, activePath, activeNode, activeModule, activeTopic }), [pathsData, activePath, activeNode, activeModule, activeTopic]);
  const currentPathTitle = pathsData?.[activePath]?.title || pathsData?.[activePath]?.name || activePath || "Workspace";
  const currentTopicTitle = normalizeTopic(activeTopic);

  const updateActiveChat = (update) => {
    setChats((current) => current.map((chat) => chat.id === activeChatId ? {
      ...chat,
      ...update,
      updatedAt: Date.now(),
    } : chat));
  };

  const startNewChat = () => {
    const next = createChat(aiProvider);
    setChats((current) => [next, ...current]);
    setActiveChatId(next.id);
    setInput("");
  };

  const deleteChat = (chatId) => {
    setChats((current) => {
      const remaining = current.filter((chat) => chat.id !== chatId);
      const next = remaining.length ? remaining : [createChat(aiProvider)];
      if (chatId === activeChatId) setActiveChatId(next[0].id);
      return next;
    });
  };

  const sendMessage = async (preset) => {
    const text = (preset || input).trim();
    if (!text || isLoading || !activeChat || !providerReady) return;
    setInput("");
    const userMessage = { id: makeId(), role: "user", content: text };
    const nextMessages = [...activeChat.messages, userMessage];
    updateActiveChat({
      messages: nextMessages,
      title: activeChat.title === "New conversation" ? text.slice(0, 42) : activeChat.title,
    });
    setIsLoading(true);

    try {
      let webResults = [];
      if (activeChat.webEnabled) webResults = await searchWeb(text, 5);
      const response = await askContextCopilot({
        userMessage: text,
        projectContext,
        chatHistory: activeChat.messages,
        provider: activeChat.provider,
        webResults,
      });
      updateActiveChat({ messages: [...nextMessages, { id: makeId(), role: "assistant", content: response, sources: webResults }] });
    } catch (error) {
      updateActiveChat({ messages: [...nextMessages, { id: makeId(), role: "assistant", content: `I couldn’t complete that request. ${error.message || "Please try again."}` }] });
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = async (message) => {
    await navigator.clipboard?.writeText(message.content);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(historyQuery.toLowerCase()));
  const suggestions = [
    `How should I approach ${currentTopicTitle === "No topic selected" ? "my next learning milestone" : currentTopicTitle}?`,
    "Summarize my progress and suggest the highest-value next step.",
    "Turn my current roadmap into a focused 7-day study plan.",
  ];

  return (
    <>
      {!isOpen && (
        <button className="atlas-fab" onClick={() => setIsOpen(true)} aria-label="Open Atlas project copilot">
          <span className="atlas-fab-orbit" />
          <AtlasLogo size={24} />
          <span className="atlas-fab-label">Ask Atlas</span>
        </button>
      )}

      {isOpen && (
        <div className={`atlas-overlay ${isFullscreen ? "atlas-overlay-fullscreen" : ""}`} role="dialog" aria-modal="true" aria-label="Atlas project copilot">
          <div className={`atlas-shell ${isHistoryOpen ? "history-visible" : "history-hidden"} ${isFullscreen ? "atlas-fullscreen" : ""}`}>
            <aside className="atlas-history">
              <div className="atlas-history-topline">
                <div className="atlas-brand-mark"><AtlasLogo size={18} /></div>
                <div>
                  <div className="atlas-brand-name">ATLAS</div>
                  <div className="atlas-brand-subtitle">PROJECT COPILOT</div>
                </div>
                <button className="atlas-icon-button atlas-mobile-close" onClick={() => setIsOpen(false)} aria-label="Close"><X size={16} /></button>
              </div>
              <button className="atlas-new-chat" onClick={startNewChat}><MessageSquarePlus size={16} /> New conversation <Plus size={14} /></button>
              <label className="atlas-history-search"><Search size={14} /><input value={historyQuery} onChange={(e) => setHistoryQuery(e.target.value)} placeholder="Search history" /></label>
              <div className="atlas-history-label"><span>RECENT</span><span>{filteredChats.length}</span></div>
              <div className="atlas-history-list">
                {filteredChats.map((chat) => (
                  <button key={chat.id} className={`atlas-history-item ${chat.id === activeChatId ? "active" : ""}`} onClick={() => setActiveChatId(chat.id)}>
                    <span className="atlas-history-icon"><Clock3 size={13} /></span>
                    <span className="atlas-history-copy"><strong>{chat.title}</strong><small>{chat.messages.length - 1} messages · {chat.provider === "azure-openai" ? "Azure" : "Gemini"}</small></span>
                    <span className="atlas-history-delete" onClick={(event) => { event.stopPropagation(); deleteChat(chat.id); }}><Trash2 size={13} /></span>
                  </button>
                ))}
              </div>
              <div className="atlas-history-footer"><Archive size={14} /><span>Chats stay on this device</span></div>
            </aside>

            <section className="atlas-main">
              <header className="atlas-header">
                <div className="atlas-header-left">
                  <button className="atlas-icon-button atlas-history-toggle" onClick={() => setIsHistoryOpen((value) => !value)} aria-label="Toggle chat history">{isHistoryOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</button>
                  <div className="atlas-avatar"><AtlasLogo size={20} /></div>
                  <div><h2>Atlas <span>·</span> your project-aware copilot</h2><div className="atlas-context-status"><i /> Full workspace context active</div></div>
                </div>
                <div className="atlas-header-actions">
                  <div className="atlas-model-select"><Zap size={13} /><select value={activeChat?.provider || "gemini"} onChange={(e) => updateActiveChat({ provider: e.target.value })}><option value="gemini">Gemini</option><option value="azure-openai">Azure OpenAI</option></select><ChevronDown size={13} /></div>
                  <button className={`atlas-web-toggle ${activeChat?.webEnabled ? "enabled" : ""}`} onClick={() => updateActiveChat({ webEnabled: !activeChat?.webEnabled })}><Globe2 size={14} /> Web {activeChat?.webEnabled ? "on" : "off"}</button>
                  <button className="atlas-icon-button atlas-fullscreen-toggle" onClick={() => setIsFullscreen((value) => !value)} aria-label={isFullscreen ? "Exit full screen" : "Open full screen"} title={isFullscreen ? "Exit full screen" : "Open full screen"}>{isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
                  <button className="atlas-icon-button" onClick={() => setIsOpen(false)} aria-label="Close Atlas"><X size={18} /></button>
                </div>
              </header>

              <div className="atlas-context-strip"><span className="atlas-context-pulse" /><span>Seeing</span><strong>{currentPathTitle}</strong><span>/</span><strong>{activeNode?.title || activeNode?.name || "Roadmap"}</strong><span>/</span><strong>{activeModule?.title || activeModule?.name || currentTopicTitle}</strong><span className="atlas-context-spacer" /><span className="atlas-context-caption">{activeChat?.webEnabled ? "Live web grounding enabled" : "Roadmap + workspace memory"}</span></div>

              <div className="atlas-messages">
                {activeChat?.messages.map((message, index) => (
                  <div key={message.id} className={`atlas-message-row ${message.role}`}>
                    {message.role === "assistant" && <div className="atlas-message-avatar"><AtlasLogo size={16} /></div>}
                    <div className="atlas-message-wrap">
                      {index === 0 && message.role === "assistant" && <span className="atlas-eyebrow">ATLAS / READY</span>}
                      <div className="atlas-message-bubble"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></div>
                      <div className={`atlas-message-actions ${message.role === "user" ? "atlas-user-message-actions" : ""}`}><button onClick={() => copyMessage(message)} aria-label={copiedId === message.id ? "Copied" : "Copy message"} title={copiedId === message.id ? "Copied" : "Copy message"}>{copiedId === message.id ? <Check size={12} /> : <Copy size={12} />}<span>{copiedId === message.id ? "Copied" : "Copy"}</span></button>{message.role === "assistant" && message.sources?.length > 0 && <span className="atlas-source-count"><Globe2 size={12} /> {message.sources.length} sources</span>}</div>
                      {message.role === "assistant" && message.sources?.length > 0 && <div className="atlas-source-list">{message.sources.map((source, sourceIndex) => <a key={`${message.id}-${source.url}`} href={source.url} target="_blank" rel="noopener noreferrer"><span>[{sourceIndex + 1}]</span>{source.title}<ArrowUpRight size={11} /></a>)}</div>}
                    </div>
                  </div>
                ))}
                {activeChat?.messages.length === 1 && !isLoading && <div className="atlas-suggestions"><div className="atlas-suggestion-heading"><Sparkles size={13} /> Try asking Atlas</div>{suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}<ArrowUp size={13} /></button>)}</div>}
                {isLoading && <div className="atlas-message-row assistant"><div className="atlas-message-avatar"><AtlasLogo size={16} /></div><div className="atlas-typing"><span /><span /><span /> <em>Atlas is connecting the dots…</em></div></div>}
                <div ref={messagesEndRef} />
              </div>

              {!providerReady && <div className="atlas-credentials-warning"><Zap size={14} /><span><strong>Personal credentials required.</strong> Open Settings, choose {activeChat?.provider === "azure-openai" ? "Azure OpenAI" : "Gemini"}, and save your own credentials before sending.</span></div>}

              <div className="atlas-composer-area">
                <div className="atlas-composer">
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={!providerReady ? "Configure your personal AI credentials in Settings first" : activeChat?.webEnabled ? "Ask anything — Atlas can search the web too" : "Ask Atlas about your project…"} rows={1} />
                  <div className="atlas-composer-bottom"><span><span className="atlas-command-key">⌘</span> Enter to send <span className="atlas-composer-divider" /> Shift + Enter for a new line</span><button className={`atlas-send ${input.trim() ? "ready" : ""}`} onClick={() => sendMessage()} disabled={!input.trim() || isLoading} aria-label="Send message"><ArrowUp size={17} /></button></div>
                </div>
                <div className="atlas-disclaimer"><Sparkles size={11} /> Atlas can make mistakes. Check important details and cited sources.</div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
