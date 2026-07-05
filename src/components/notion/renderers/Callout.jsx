import React from 'react';
import RichTextRenderer, { darkColorMap } from '../RichTextRenderer';

export default function Callout({ block }) {
  const content = block.callout?.rich_text;
  const icon = block.callout?.icon;
  
  if (!content) return null;

  let emoji = '💡';
  if (icon && icon.type === 'emoji') {
    emoji = icon.emoji;
  }

  const blockColor = block.callout?.color || 'default';
  const mappedColor = darkColorMap[blockColor] || 'inherit';
  const isBg = blockColor.includes('_background');

  let bgColor = isBg ? mappedColor : 'rgba(255,255,255,0.05)';
  let borderColor = isBg ? mappedColor : 'var(--border)';

  // Fallback for default background to make it look like a standard callout
  if (blockColor === 'default') {
    bgColor = 'rgba(255,255,255,0.05)';
  }

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px 20px',
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      marginBottom: '1.5em',
      alignItems: 'flex-start'
    }}>
      <div style={{ fontSize: '1.2rem', marginTop: '2px' }}>
        {emoji}
      </div>
      <div style={{ color: 'var(--text)', lineHeight: '1.5' }}>
        <RichTextRenderer textArray={content} />
      </div>
    </div>
  );
}
