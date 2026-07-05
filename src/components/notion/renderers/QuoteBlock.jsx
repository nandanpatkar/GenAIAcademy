import React from 'react';
import RichTextRenderer, { darkColorMap } from '../RichTextRenderer';

export default function QuoteBlock({ block }) {
  const content = block.quote?.rich_text;
  
  if (!content) return null;

  const blockColor = block.quote?.color || 'default';
  const isBg = blockColor.includes('_background');
  const mappedColor = darkColorMap[blockColor] || 'inherit';

  return (
    <blockquote style={{
      borderLeft: '3px solid var(--text)',
      paddingLeft: '14px',
      marginLeft: 0,
      marginRight: 0,
      marginTop: '0.8em',
      marginBottom: '0.8em',
      color: isBg ? 'inherit' : mappedColor,
      backgroundColor: isBg ? mappedColor : 'transparent',
      padding: isBg ? '8px 14px' : '0 14px',
      borderRadius: isBg ? '0 4px 4px 0' : '0',
      fontSize: '1.1em',
    }}>
      <RichTextRenderer textArray={content} />
    </blockquote>
  );
}
