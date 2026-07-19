import React from 'react';
import RichTextRenderer, { darkColorMap } from '../RichTextRenderer';

export default function TodoBlock({ block }) {
  const content = block.to_do?.rich_text;
  const checked = block.to_do?.checked || false;
  
  if (!content) return null;

  const blockColor = block.to_do?.color || 'default';
  const isBg = blockColor.includes('_background');
  const mappedColor = darkColorMap[blockColor] || 'inherit';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '6px',
      color: isBg ? 'inherit' : mappedColor,
      backgroundColor: isBg ? mappedColor : 'transparent',
      padding: isBg ? '4px 8px' : '2px 0',
      borderRadius: isBg ? '4px' : '0',
      opacity: checked ? 0.78 : 1,
    }}>
      <div style={{
        marginTop: '3px',
        width: '16px',
        height: '16px',
        borderRadius: '3px',
        border: checked ? 'none' : '2px solid var(--notion-link-bright, #9fe8ff)',
        backgroundColor: checked ? 'var(--neon)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, textDecoration: checked ? 'line-through' : 'none', textDecorationColor: 'var(--notion-text-muted, #ced8ea)' }}>
        <RichTextRenderer textArray={content} />
      </div>
    </div>
  );
}
