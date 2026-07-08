import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function NotebookViewer({ content }) {
  const cells = useMemo(() => {
    try {
      const data = JSON.parse(content);
      return data.cells || [];
    } catch (e) {
      console.error('Failed to parse notebook:', e);
      return [];
    }
  }, [content]);

  if (!cells || cells.length === 0) {
    return (
      <div style={{ padding: 20, color: 'var(--ide-text-muted)', textAlign: 'center' }}>
        No valid notebook cells found or unable to parse JSON.
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      overflowY: 'auto',
      height: '100%',
      backgroundColor: 'var(--ide-bg)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {cells.map((cell, i) => {
          const source = Array.isArray(cell.source) ? cell.source.join('') : (cell.source || '');
          
          if (cell.cell_type === 'markdown') {
            return (
              <div key={i} style={{ color: 'var(--ide-text)', fontSize: '14px', lineHeight: '1.6' }}>
                <ReactMarkdown>{source}</ReactMarkdown>
              </div>
            );
          }
          
          if (cell.cell_type === 'code') {
            const outputs = cell.outputs || [];
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Code block */}
                <div style={{
                  border: '1px solid var(--ide-border)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    background: 'var(--ide-surface2)',
                    color: 'var(--ide-text-muted)',
                    borderBottom: '1px solid var(--ide-border)'
                  }}>
                    [ {cell.execution_count !== null && cell.execution_count !== undefined ? cell.execution_count : ' '} ]
                  </div>
                  <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '12px', fontSize: '13px', background: 'var(--ide-surface)' }}
                  >
                    {source}
                  </SyntaxHighlighter>
                </div>
                
                {/* Outputs */}
                {outputs.length > 0 && (
                  <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {outputs.map((out, outIdx) => {
                      if (out.output_type === 'stream') {
                        const text = Array.isArray(out.text) ? out.text.join('') : out.text;
                        return (
                          <pre key={outIdx} style={{ margin: 0, fontSize: '12px', color: out.name === 'stderr' ? '#ff6b6b' : 'var(--ide-text)', whiteSpace: 'pre-wrap' }}>
                            {text}
                          </pre>
                        );
                      }
                      
                      if (out.output_type === 'execute_result' || out.output_type === 'display_data') {
                        const data = out.data || {};
                        if (data['image/png']) {
                          return <img key={outIdx} src={`data:image/png;base64,${data['image/png']}`} style={{ maxWidth: '100%', background: '#fff' }} alt="output" />;
                        }
                        if (data['image/jpeg']) {
                          return <img key={outIdx} src={`data:image/jpeg;base64,${data['image/jpeg']}`} style={{ maxWidth: '100%', background: '#fff' }} alt="output" />;
                        }
                        if (data['text/html']) {
                          const html = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html'];
                          return <div key={outIdx} dangerouslySetInnerHTML={{ __html: html }} style={{ background: '#fff', color: '#000', padding: 8, borderRadius: 4 }} />;
                        }
                        if (data['text/plain']) {
                          const text = Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'];
                          return <pre key={outIdx} style={{ margin: 0, fontSize: '12px', color: 'var(--ide-text)', whiteSpace: 'pre-wrap' }}>{text}</pre>;
                        }
                      }
                      
                      if (out.output_type === 'error') {
                        const traceback = Array.isArray(out.traceback) ? out.traceback.join('\n') : '';
                        return (
                          <pre key={outIdx} style={{ margin: 0, fontSize: '12px', color: '#ff6b6b', whiteSpace: 'pre-wrap' }}>
                            {traceback}
                          </pre>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
