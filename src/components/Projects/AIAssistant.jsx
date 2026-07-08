/**
 * AIAssistant.jsx — AI coding assistant panel for the IDE
 *
 * Provides chat, code generation, explanation, and multi-file edit
 * capabilities using the existing aiService.js infrastructure.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Send, ChevronDown, File, Code2, FolderOpen, CheckSquare } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectsContext';
import { callAI } from '../../services/aiService';
import ReactMarkdown from 'react-markdown';


const MODES = [
  { id: 'chat', label: 'Chat' },
  { id: 'generate', label: 'Generate' },
  { id: 'edit', label: 'Edit' },
  { id: 'explain', label: 'Explain' },
];

const CONTEXT_OPTIONS = [
  { id: 'current', label: 'Current File', icon: <File size={9} /> },
  { id: 'selected', label: 'Selection', icon: <Code2 size={9} /> },
  { id: 'open', label: 'Open Files', icon: <FolderOpen size={9} /> },
  { id: 'project', label: 'Full Project', icon: <CheckSquare size={9} /> },
];

// Build prompt context string based on selected context options
const buildContext = ({ activeFile, openFiles, selectedCode, flatFiles, activeContexts, mode }) => {
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
      parts.push(`### Open File: ${f.path}\n\`\`\`${f.language}\n${(f.content || '').slice(0, 2000)}${f.content?.length > 2000 ? '\n… (truncated)' : ''}\n\`\`\``);
    }
  }
  if (activeContexts.includes('project') && flatFiles.length > 0) {
    const tree = flatFiles.map(f => f.file_path).join('\n');
    parts.push(`### Project File Tree\n\`\`\`\n${tree}\n\`\`\``);
  }

  return parts.join('\n\n');
};

// Extract code blocks from AI response
const extractCodeBlocks = (text) => {
  const blocks = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push({ language: match[1] || 'plaintext', code: match[2].trim() });
  }
  return blocks;
};

// Parse multi-file edit response
const parseMultiFileEdit = (text) => {
  const files = [];
  const fileRegex = /###\s*FILE:\s*(.+?)\n```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = fileRegex.exec(text)) !== null) {
    files.push({ path: match[1].trim(), language: match[2], newContent: match[3].trim() });
  }
  return files;
};

export default function AIAssistant({ onToast }) {
  const {
    aiMessages, setAiMessages, aiMode, setAiMode,
    activeFile, openFiles, selectedCode, flatFiles,
    setPendingDiff, currentProject,
  } = useProjects();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeContexts, setActiveContexts] = useState(['current', 'selected']);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, loading]);

  const toggleContext = (id) => {
    setActiveContexts(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const buildSystemPrompt = () => {
    const projectName = currentProject?.name || 'the project';
    const modeInstructions = {
      generate: `You are an expert coding assistant. Generate complete, production-ready code. When creating multiple files, use the format:\n### FILE: /path/to/file.ext\n\`\`\`language\ncode here\n\`\`\``,
      edit: `You are an expert code editor. When modifying files, show the COMPLETE new file content. Use the format:\n### FILE: /path/to/file.ext\n\`\`\`language\ncomplete new content\n\`\`\``,
      explain: `You are an expert code explainer. Provide clear, educational explanations. Use markdown formatting.`,
      chat: `You are an expert AI coding assistant for ${projectName}. Answer questions about the codebase, suggest improvements, and help debug issues.`,
    };
    return `${modeInstructions[aiMode] || modeInstructions.chat}\n\nProject: ${projectName}`;
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const context = buildContext({ activeFile, openFiles, selectedCode, flatFiles, activeContexts, mode: aiMode });
    const userMessage = context ? `${input.trim()}\n\n---\n${context}` : input.trim();
    const displayMessage = input.trim();

    setAiMessages(prev => [...prev, { role: 'user', content: displayMessage }]);
    setInput('');
    setLoading(true);

    try {

      const formattedMessages = [
        { role: 'user', content: buildSystemPrompt() + '\n\n---\nPrevious messages follow.' },
        ...aiMessages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content })),
        { role: 'user', content: userMessage },
      ];
      const response = await callAI(formattedMessages, 4096, 0.7);
      const assistantContent = response || 'No response generated.';

      setAiMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);

      // Auto-detect multi-file edits
      if ((aiMode === 'edit' || aiMode === 'generate') && assistantContent.includes('### FILE:')) {
        const editedFiles = parseMultiFileEdit(assistantContent);
        if (editedFiles.length > 0) {
          const diffFiles = editedFiles.map(ef => {
            const openFile = openFiles.find(f => f.path === ef.path);
            return {
              path: ef.path,
              language: ef.language || openFile?.language || 'plaintext',
              originalContent: openFile?.content || '',
              newContent: ef.newContent,
            };
          });
          setPendingDiff({ files: diffFiles });
        }
      }
    } catch (err) {
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Error: ${err.message || 'Failed to get AI response. Check your API key in settings.'}`
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, aiMode, aiMessages, activeFile, openFiles, selectedCode, flatFiles, activeContexts, setAiMessages, setPendingDiff, currentProject]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
  };

  const triggerAIAction = useCallback((action, code, file) => {
    const actionMessages = {
      explain: `Explain this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      refactor: `Refactor this code for better readability and maintainability:\n\`\`\`\n${code}\n\`\`\``,
      fix: `Find and fix all bugs in this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      optimize: `Optimize this code for better performance:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      'generate-tests': `Generate comprehensive unit tests for this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      'add-comments': `Add detailed comments and docstrings to this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
      convert: `Convert this code to a different but equivalent implementation. Suggest the best alternative:\n\`\`\`\n${code}\n\`\`\``,
      'generate-docs': `Generate comprehensive documentation for this code:\n\`\`\`\n${code || file?.content || ''}\n\`\`\``,
    };

    const modeMap = { explain: 'explain', refactor: 'edit', fix: 'edit', optimize: 'edit', 'generate-tests': 'generate', 'add-comments': 'edit', convert: 'edit', 'generate-docs': 'generate' };
    setAiMode(modeMap[action] || 'chat');
    setInput(actionMessages[action] || `${action} this code`);
    textareaRef.current?.focus();
  }, [setAiMode]);

  // Expose triggerAIAction for EditorPane
  useEffect(() => {
    window.__ideAITrigger = triggerAIAction;
    return () => { delete window.__ideAITrigger; };
  }, [triggerAIAction]);

  return (
    <div className="ide-ai-panel">
      {/* Header */}
      <div className="ide-ai-header">
        <div className="ide-ai-title">
          <Sparkles size={14} className="ai-icon" />
          AI Assistant
        </div>

        {/* Mode selector */}
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

        {/* Context pills */}
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
          <div style={{ textAlign: 'center', padding: '20px 12px' }}>
            <Sparkles size={24} style={{ color: 'var(--ide-accent)', opacity: 0.5, margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12, color: 'var(--ide-text-muted)', lineHeight: 1.6 }}>
              Ask me to <strong style={{ color: 'var(--ide-text)' }}>generate</strong>,{' '}
              <strong style={{ color: 'var(--ide-text)' }}>edit</strong>, or{' '}
              <strong style={{ color: 'var(--ide-text)' }}>explain</strong> code.
              <br />
              <span style={{ fontSize: 10 }}>Right-click in the editor for quick actions.</span>
            </div>
          </div>
        )}

        {aiMessages.map((msg, i) => (
          <div key={i} className={`ide-ai-message ${msg.role}`}>
            <div className="ide-ai-message-role">
              {msg.role === 'user' ? 'You' : '✦ AI'}
            </div>
            <div className="ide-ai-message-body">
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>

              {/* Apply button if AI message has file edits */}
              {msg.role === 'assistant' && msg.content.includes('### FILE:') && (
                <button
                  className="ide-ai-apply-btn"
                  onClick={() => {
                    const files = parseMultiFileEdit(msg.content);
                    if (files.length > 0) {
                      const diffFiles = files.map(ef => {
                        const openFile = openFiles.find(f => f.path === ef.path);
                        return {
                          path: ef.path,
                          language: ef.language || openFile?.language || 'plaintext',
                          originalContent: openFile?.content || '',
                          newContent: ef.newContent,
                        };
                      });
                      setPendingDiff({ files: diffFiles });
                    }
                  }}
                >
                  <ChevronDown size={12} /> Preview & Apply Changes
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ide-ai-loading">
            <div className="ide-spinner" />
            <span>AI is thinking…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ide-ai-input-area">
        {activeContexts.includes('selected') && selectedCode && (
          <div style={{
            fontSize: 10, color: 'var(--ide-accent)', marginBottom: 6, padding: '3px 8px',
            background: 'rgba(0,255,136,0.06)', borderRadius: 4, border: '1px solid rgba(0,255,136,0.2)',
          }}>
            ✓ {selectedCode.split('\n').length} lines selected
          </div>
        )}

        <div className="ide-ai-textarea-wrap">
          <textarea
            ref={textareaRef}
            className="ide-ai-textarea"
            placeholder={`${aiMode === 'generate' ? 'Describe what to build…' : aiMode === 'edit' ? 'Describe what to change…' : aiMode === 'explain' ? 'What do you want explained?' : 'Ask anything about the project…'} (Ctrl+Enter to send)`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-height
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="ide-ai-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            title="Send (Ctrl+Enter)"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
