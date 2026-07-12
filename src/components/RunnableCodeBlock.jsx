import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, Copy, Check } from 'lucide-react';
import { executeCode, RUN_LANGUAGES } from '../services/jdoodleService';

const LANGUAGE_MAP = {
  python: 'python3',
  py: 'python3',
  js: 'nodejs',
  javascript: 'nodejs',
  java: 'java',
  cpp: 'cpp17',
  'c++': 'cpp17',
  go: 'go'
};

export default function RunnableCodeBlock({ language, code, ...props }) {
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const mappedLang = LANGUAGE_MAP[language?.toLowerCase()] || null;
  const isRunnable = !!mappedLang;

  const handleRun = async () => {
    if (!isRunnable) return;
    setIsExecuting(true);
    setOutput('Running...');
    setError(false);
    try {
      const res = await executeCode({
        script: code,
        language: mappedLang
      });
      setOutput(res.output || 'Execution finished with no output.');
    } catch (err) {
      setError(true);
      setOutput(err.message || 'Execution failed.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="runnable-code-wrapper">
      <div className="runnable-code-header">
        <span className="runnable-code-lang">{language?.toUpperCase() || 'CODE'}</span>
        <div className="runnable-code-actions">
          <button className="runnable-action-btn" onClick={handleCopy} title="Copy Code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {isRunnable && (
            <button className="runnable-action-btn run-btn" onClick={handleRun} disabled={isExecuting}>
              <Play size={14} />
              <span>{isExecuting ? 'Running...' : 'Run'}</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="runnable-code-content">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: 13,
            fontFamily: "var(--mono)",
            lineHeight: 1.5,
            border: "none",
            borderBottomLeftRadius: output ? "0" : "12px",
            borderBottomRightRadius: output ? "0" : "12px"
          }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {output && (
        <div className={`runnable-code-output ${error ? 'error' : ''}`}>
          <div className="output-label">Output:</div>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
