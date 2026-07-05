import React from 'react';
import RichTextRenderer, { darkColorMap } from '../RichTextRenderer';

export default function Paragraph({ block }) {
  const content = block.paragraph?.rich_text;
  
  if (!content || content.length === 0) {
    // Return empty div to preserve line breaks, taking into account color if it's a background block
    return <div style={{ minHeight: '1.5em' }}></div>;
  }

  const blockColor = block.paragraph?.color || 'default';
  const isBg = blockColor.includes('_background');
  const mappedColor = darkColorMap[blockColor] || 'inherit';

  return (
    <p style={{
      color: isBg ? 'inherit' : mappedColor,
      backgroundColor: isBg ? mappedColor : 'transparent',
      padding: isBg ? '4px 8px' : '0',
      borderRadius: isBg ? '4px' : '0',
      lineHeight: 1.6, 
      marginBottom: '0.8em',
      marginTop: '0.2em'
    }}>
      <RichTextRenderer textArray={content} />
    </p>
  );
}
