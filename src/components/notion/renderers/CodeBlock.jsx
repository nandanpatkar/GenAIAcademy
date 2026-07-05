import React, { useState } from 'react';
import RichTextRenderer from '../RichTextRenderer';
import { Copy, Check, Play } from 'lucide-react';

export default function CodeBlock({ block }) {
  const [copied, setCopied] = useState(false);
  const codeContent = block.code?.rich_text;
  const language = block.code?.language || 'text';
  
  if (!codeContent) return null;

  const rawCode = codeContent.map(t => t.plain_text).join('');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="notion-code-block" style={{
      background: '#0d1117',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '1.5em',
      border: '1px solid var(--border)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid var(--border)'
      }}>
        <span style={{ color: 'var(--text3)', fontSize: '0.8rem', textTransform: 'capitalize' }}>
          {language}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              transition: 'color 0.2s'
            }}
          >
            {copied ? <Check size={14} color="var(--neon)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {language.toLowerCase() === 'python' && (
             <button 
             style={{
               background: 'transparent',
               border: 'none',
               color: 'var(--neon)',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '4px',
               fontSize: '0.8rem',
               transition: 'color 0.2s'
             }}
           >
             <Play size={14} /> Run in IDE
           </button>
          )}
        </div>
      </div>
      <pre style={{
        margin: 0,
        padding: '16px',
        overflowX: 'auto',
        color: '#c9d1d9',
        fontSize: '0.9rem',
        fontFamily: 'monospace',
        lineHeight: '1.5'
      }}>
        <code>
          {rawCode}
        </code>
      </pre>
    </div>
  );
}
