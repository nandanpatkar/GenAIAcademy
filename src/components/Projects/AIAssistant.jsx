/**
 * AIAssistant.jsx — Modern AI coding assistant panel for the IDE
 *
 * A chat-first assistant where every code block the model emits gets its own
 * inline action bar: Copy, Insert into active file, Create new file, and
 * Preview diff. All actions route through the existing project plumbing
 * (saveFile / openFile / pendingDiff) so generated code is directly importable.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles, Send, File, Code2, FolderOpen, CheckSquare,
  Copy, Check, FilePlus2, CornerDownLeft, GitCompare, Trash2, StopCircle,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProjects } from '../../contexts/ProjectsContext';
import { callAI } from '../../services/aiService';
import { saveFile } from '../../services/projectService';

const MODES = [
  { id: 'chat', label: 'Chat', hint: 'Ask anything about the project…' },
  { id: 'generate', label: 'Generate', hint: 'Describe what to build…' },
  { id: 'edit', label: 'Edit', hint: 'Describe what to change…' },
  { id: 'explain', label: 'Explain', hint: 'What should I explain?' },
];

const CONTEXT_OPTIONS = [
  { id: 'current', label: 'Current File', icon: <File size={9} /> },
  { id: 'selected', label: 'Selection', icon: <Code2 size={9} /> },
  { id: 'open', label: 'Open Files', icon: <FolderOpen size={9} /> },
  { id: 'project', label: 'Full Project', icon: <CheckSquare size={9} /> },
];

// Map a fenced-code language token to a Monaco language + file extension.
const LANG_META = {
  javascript: { mono: 'javascript', ext: 'js' },
  js: { mono: 'javascript', ext: 'js' },
  jsx: { mono: 'javascript', ext: 'jsx' },
  typescript: { mono: 'typescript', ext: 'ts' },
  ts: { mono: 'typescript', ext: 'ts' },
  tsx: { mono: 'typescript', ext: 'tsx' },
  python: { mono: 'python', ext: 'py' },
  py: { mono: 'python', ext: 'py' },
  json: { mono: 'json', ext: 'json' },
  html: { mono: 'html', ext: 'html' },
  css: { mono: 'css', ext: 'css' },
  bash: { mono: 'shell', ext: 'sh' },
  sh: { mono: 'shell', ext: 'sh' },
  sql: { mono: 'sql', ext: 'sql' },
  markdown: { mono: 'markdown', ext: 'md' },
  md: { mono: 'markdown', ext: 'md' },
  yaml: { mono: 'yaml', ext: 'yml' },
  go: { mono: 'go', ext: 'go' },
  rust: { mono: 'rust', ext: 'rs' },
  java: { mono: 'java', ext: 'java' },
};
const metaFor = (lang) => LANG_META[(lang || '').toLowerCase()] || { mono: 'plaintext', ext: 'txt' };

// Build the context block appended to a user prompt.
const buildContext = ({ activeFile, openFiles, selectedCode, flatFiles, activeContexts }) => {
  const parts = [];
  if (activeContexts.includes('current') && activeFile) {
    parts.push(`### Current File: ${activeFile.path}\n\`\`\`${activeFile.language}\n${activeFile.content || ''}\n\`\`\``);
  }
  if (activeContexts.includes('selected') && selectedCode) {
    parts.push(`### Selected Code\n\`\`\`\n${selectedCode}\n\`\`\``);
  }
  if (activeContexts.includes('open') && openFiles.length > 1) {
    const others = openFiles.filter(f => f.id !== activeFile?.id);
    for (const f of others.slice(0, 5)) {
      const body = (f.content || '').slice(0, 2000);
      parts.push(`### Open File: ${f.path}\n\`\`\`${f.language}\n${body}${f.content?.length > 2000 ? '\n… (truncated)' : ''}\n\`\`\``);
    }
  }
  if (activeContexts.includes('project') && flatFiles.length > 0) {
    parts.push(`### Project File Tree\n\`\`\`\n${flatFiles.map(f => f.file_path).join('\n')}\n\`\`\``);
  }
  return parts.join('\n\n');
};

// Look at the code just before a fence to recover a "### FILE: path" hint,
// or read a leading "// path/to/file.ext" comment from the code itself.
const inferPath = ({ precedingText, code, lang }) => {
  const headerMatch = /###\s*FILE:\s*([^\n]+?)\s*$/i.exec(precedingText || '');
  if (headerMatch) return headerMatch[1].trim().replace(/^`|`$/g, '');
  const firstLine = (code || '').split('\n')[0].trim();
  const commentMatch = /^(?:\/\/|#|<!--)\s*([\w./-]+\.\w+)/.exec(firstLine);
  if (commentMatch) return commentMatch[1];
  return null;
};

export default function AIAssistant({ onToast }) {
  const {
    aiMessages, setAiMessages, aiMode, setAiMode,
    activeFile, openFiles, selectedCode, flatFiles,
    setPendingDiff, currentProject, openFile,
  } = useProjects();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeContexts, setActiveContexts] = useState(['current', 'selected']);
  const [newFilePrompt, setNewFilePrompt] = useState(null); // { code, lang, suggested }
  const [newFileName, setNewFileName] = useState('');
  const abortRef = useRef(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentHint = MODES.find(m => m.id === aiMode)?.hint || 'Ask anything…';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, loading]);

  const toggleContext = (id) =>
    setActiveContexts(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const buildSystemPrompt = () => {
    const name = currentProject?.name || 'the project';
    const modeInstructions = {
      generate: `You are an expert coding assistant for ${name}. Generate complete, production-ready code. When a code block belongs in a specific file, put "### FILE: /path/to/file.ext" on its own line directly above the fenced block so it can be imported.`,
      edit: `You are an expert code editor for ${name}. When modifying files, output the COMPLETE new file content, and put "### FILE: /path/to/file.ext" on its own line directly above each fenced block.`,
      explain: `You are an expert code explainer. Give clear, educational explanations in markdown. Keep code snippets minimal.`,
      chat: `You are an expert AI coding assistant for ${name}. Answer questions about the codebase, suggest improvements, and help debug. When you emit code meant for a file, prefix the fence with "### FILE: /path".`,
    };
    return modeInstructions[aiMode] || modeInstructions.chat;
  };

  // ── Code-block actions ──────────────────────────────────────────────────
  const insertIntoActive = useCallback((code) => {
    if (!activeFile) { onToast?.('Open a file first to insert', 'error'); return; }
    setPendingDiff({
      files: [{
        path: activeFile.path,
        language: activeFile.language || 'plaintext',
        originalContent: activeFile.content || '',
        newContent: code,
      }],
    });
    onToast?.('Preview ready in editor — Accept to apply', 'info');
  }, [activeFile, setPendingDiff, onToast]);

  const previewDiff = useCallback((code, path, lang) => {
    const target = openFiles.find(f => f.path === path);
    setPendingDiff({
      files: [{
        path: path || activeFile?.path || `untitled.${metaFor(lang).ext}`,
        language: metaFor(lang).mono,
        originalContent: target?.content || activeFile?.content || '',
        newContent: code,
      }],
    });
    onToast?.('Diff opened in editor', 'info');
  }, [openFiles, activeFile, setPendingDiff, onToast]);

  const doCreateFile = useCallback(async (path, code, lang) => {
    if (!currentProject) return;
    try {
      const clean = path.startsWith('/') ? path : `/${path}`;
      await saveFile(currentProject.id, clean, code, { language: metaFor(lang).mono });
      openFile({
        id: `local-${Date.now()}`,
        path: clean,
        filename: clean.split('/').pop(),
        content: code,
        language: metaFor(lang).mono,
      });
      onToast?.(`Created ${clean.split('/').pop()} ✓`, 'success');
    } catch (err) {
      onToast?.(err.message || 'Could not create file', 'error');
    }
  }, [currentProject, openFile, onToast]);

  const requestNewFile = useCallback((code, lang, suggested) => {
    const fallback = suggested || `generated.${metaFor(lang).ext}`;
    setNewFilePrompt({ code, lang });
    setNewFileName(fallback.startsWith('/') ? fallback : `/${fallback}`);
  }, []);

  const confirmNewFile = useCallback(() => {
    if (!newFilePrompt || !newFileName.trim()) return;
    doCreateFile(newFileName.trim(), newFilePrompt.code, newFilePrompt.lang);
    setNewFilePrompt(null);
    setNewFileName('');
  }, [newFilePrompt, newFileName, doCreateFile]);

  // ── Send ────────────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    const context = buildContext({ activeFile, openFiles, selectedCode, flatFiles, activeContexts });
    const userMessage = context ? `${input.trim()}\n\n---\n${context}` : input.trim();
    const displayMessage = input.trim();

    setAiMessages(prev => [...prev, { role: 'user', content: displayMessage }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);
    abortRef.current = false;

    try {
      const formatted = [
        { role: 'user', content: buildSystemPrompt() + '\n\n---\nConversation follows.' },
        ...aiMessages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content })),
        { role: 'user', content: userMessage },
      ];
      const response = await callAI(formatted, 4096, 0.7);
      if (abortRef.current) return;
      setAiMessages(prev => [...prev, { role: 'assistant', content: response || 'No response generated.' }]);
    } catch (err) {
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Error: ${err.message || 'Failed to reach the model. Check your API key in Settings.'}`,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, aiMode, aiMessages, activeFile, openFiles, selectedCode, flatFiles, activeContexts, setAiMessages, currentProject]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
  };

  // Editor right-click bridge
  const triggerAIAction = useCallback((action, code, file) => {
    const templates = {
      explain: `Explain this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      refactor: `Refactor this code for readability and maintainability:\n\`\`\`\n${code}\n\`\`\``,
      fix: `Find and fix all bugs in this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      optimize: `Optimize this code for performance:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      'generate-tests': `Generate comprehensive unit tests for this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      'add-comments': `Add clear comments and docstrings to this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      'generate-docs': `Generate documentation for this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
    };
    const modeMap = { explain: 'explain', refactor: 'edit', fix: 'edit', optimize: 'edit', 'generate-tests': 'generate', 'add-comments': 'edit', 'generate-docs': 'generate' };
    setAiMode(modeMap[action] || 'chat');
    setInput(templates[action] || `${action} this code`);
    textareaRef.current?.focus();
  }, [setAiMode]);

  useEffect(() => {
    window.__ideAITrigger = triggerAIAction;
    return () => { delete window.__ideAITrigger; };
  }, [triggerAIAction]);

  // ── Markdown renderer with per-block action bar ─────────────────────────
  const renderMessage = useCallback((content) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, node, ...props }) {
          const text = String(children).replace(/\n$/, '');
          const langMatch = /language-(\w+)/.exec(className || '');
          // react-markdown v10 dropped the `inline` prop: a fenced block has a
          // language class or spans multiple lines; everything else is inline.
          const isBlock = !!langMatch || text.includes('\n');
          if (!isBlock) return <code className="ide-inline-code" {...props}>{children}</code>;

          const lang = langMatch?.[1] || 'plaintext';
          // Recover the "### FILE:" hint that appeared just above this fence.
          const parentText = node?.position && content
            ? content.slice(0, node.position.start.offset)
            : '';
          const suggested = inferPath({ precedingText: parentText, code: text, lang });

          return (
            <CodeBlock
              code={text}
              lang={lang}
              suggested={suggested}
              hasActiveFile={!!activeFile}
              onInsert={() => (suggested ? previewDiff(text, suggested, lang) : insertIntoActive(text))}
              onNewFile={() => requestNewFile(text, lang, suggested)}
              onDiff={() => previewDiff(text, suggested, lang)}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  ), [activeFile, insertIntoActive, previewDiff, requestNewFile]);

  return (
    <div className="ide-ai-panel">
      {/* Header */}
      <div className="ide-ai-header">
        <div className="ide-ai-header-top">
          <div className="ide-ai-title">
            <span className="ide-ai-orb"><Sparkles size={13} /></span>
            AI Assistant
          </div>
          {aiMessages.length > 0 && (
            <button className="ide-ai-clear" onClick={() => setAiMessages([])} title="Clear conversation">
              <Trash2 size={12} />
            </button>
          )}
        </div>

        <div className="ide-ai-mode-bar">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`ide-ai-mode-btn ${aiMode === m.id ? 'active' : ''}`}
              onClick={() => setAiMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="ide-ai-context-pills">
          {CONTEXT_OPTIONS.map(c => (
            <button
              key={c.id}
              className={`ide-ai-context-pill ${activeContexts.includes(c.id) ? 'active' : ''}`}
              onClick={() => toggleContext(c.id)}
              title={`Include ${c.label} as context`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="ide-ai-messages">
        {aiMessages.length === 0 && (
          <div className="ide-ai-empty">
            <span className="ide-ai-empty-orb"><Sparkles size={22} /></span>
            <div className="ide-ai-empty-title">Build with AI</div>
            <div className="ide-ai-empty-sub">
              Generate code, edit files, or explain what you're looking at.
              Every code block can be imported straight into your project.
            </div>
            <div className="ide-ai-empty-chips">
              {['Scaffold a component', 'Explain this file', 'Write a test'].map(s => (
                <button key={s} className="ide-ai-empty-chip" onClick={() => { setInput(s); textareaRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {aiMessages.map((msg, i) => (
          <div key={i} className={`ide-ai-msg ${msg.role}`}>
            <div className="ide-ai-msg-avatar">{msg.role === 'user' ? 'You' : <Sparkles size={12} />}</div>
            <div className="ide-ai-msg-body">
              {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ide-ai-msg assistant">
            <div className="ide-ai-msg-avatar"><Sparkles size={12} /></div>
            <div className="ide-ai-msg-body">
              <div className="ide-ai-typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ide-ai-input-area">
        {activeContexts.includes('selected') && selectedCode && (
          <div className="ide-ai-selpill">✓ {selectedCode.split('\n').length} lines selected as context</div>
        )}
        <div className="ide-ai-textarea-wrap">
          <textarea
            ref={textareaRef}
            className="ide-ai-textarea"
            placeholder={`${currentHint}  ·  Ctrl+Enter to send`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
            }}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          {loading ? (
            <button className="ide-ai-send-btn stop" onClick={() => { abortRef.current = true; setLoading(false); }} title="Stop">
              <StopCircle size={13} />
            </button>
          ) : (
            <button className="ide-ai-send-btn" onClick={handleSend} disabled={!input.trim()} title="Send (Ctrl+Enter)">
              <Send size={13} />
            </button>
          )}
        </div>
      </div>

      {/* New-file modal */}
      {newFilePrompt && (
        <div className="ide-ai-modal-overlay" onClick={() => setNewFilePrompt(null)}>
          <div className="ide-ai-modal" onClick={e => e.stopPropagation()}>
            <div className="ide-ai-modal-title"><FilePlus2 size={14} /> Create new file</div>
            <input
              className="ide-ai-modal-input"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmNewFile()}
              placeholder="/src/components/Example.jsx"
              autoFocus
            />
            <div className="ide-ai-modal-actions">
              <button className="ide-ai-modal-btn ghost" onClick={() => setNewFilePrompt(null)}>Cancel</button>
              <button className="ide-ai-modal-btn primary" onClick={confirmNewFile}>Create & open</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Single code block with header + action bar ─────────────────────────────
function CodeBlock({ code, lang, suggested, hasActiveFile, onInsert, onNewFile, onDiff }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.split('\n').length, [code]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {}
  };

  return (
    <div className="ide-cb">
      <div className="ide-cb-head">
        <span className="ide-cb-lang">{suggested || lang}</span>
        <span className="ide-cb-meta">{lines} line{lines !== 1 ? 's' : ''}</span>
        <div className="ide-cb-actions">
          <button className="ide-cb-btn" onClick={copy} title="Copy">
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          {hasActiveFile && (
            <button className="ide-cb-btn" onClick={onInsert} title="Insert into active file (preview)">
              <CornerDownLeft size={12} /> Insert
            </button>
          )}
          <button className="ide-cb-btn" onClick={onDiff} title="Preview as diff">
            <GitCompare size={12} /> Diff
          </button>
          <button className="ide-cb-btn primary" onClick={onNewFile} title="Create a new file from this">
            <FilePlus2 size={12} /> New file
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={metaFor(lang).mono === 'plaintext' ? 'text' : lang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0, borderRadius: 0, background: 'var(--ide-bg)',
          fontSize: 11.5, padding: '10px 12px', maxHeight: 360, overflow: 'auto',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
