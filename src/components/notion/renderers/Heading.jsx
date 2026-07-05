import React from 'react';
import RichTextRenderer, { darkColorMap } from '../RichTextRenderer';

export default function Heading({ block }) {
  const { type } = block;
  const content = block[type]?.rich_text;
  
  const textContent = <RichTextRenderer textArray={content} />;
  
  const blockColor = block[type]?.color || 'default';
  const isBg = blockColor.includes('_background');
  const mappedColor = darkColorMap[blockColor] || 'inherit';

  const style = {
    color: isBg ? 'var(--text)' : mappedColor,
    backgroundColor: isBg ? mappedColor : 'transparent',
    marginTop: '1.5em',
    marginBottom: '0.5em',
    fontWeight: 700,
    padding: isBg ? '4px 8px' : '0',
    borderRadius: isBg ? '4px' : '0',
    display: 'inline-block', // to avoid background stretching 100% width unless desired, but Notion usually fills width or wraps text
  };

  switch (type) {
    case 'heading_1':
      return <h1 style={{ ...style, fontSize: '2em' }}>{textContent}</h1>;
    case 'heading_2':
      return <h2 style={{ ...style, fontSize: '1.5em', borderBottom: '1px solid var(--border)', paddingBottom: '0.3em' }}>{textContent}</h2>;
    case 'heading_3':
      return <h3 style={{ ...style, fontSize: '1.17em' }}>{textContent}</h3>;
    default:
      return null;
  }
}
