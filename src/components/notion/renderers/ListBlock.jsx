import React from 'react';
import RichTextRenderer from '../RichTextRenderer';

export default function ListBlock({ block }) {
  const { type } = block;
  const content = block[type]?.rich_text;
  
  if (!content) return null;

  const textContent = <RichTextRenderer textArray={content} />;
  const style = {
    color: 'var(--text2)',
    lineHeight: '1.6',
    marginBottom: '0.5em',
    marginLeft: '1.5em'
  };

  if (type === 'bulleted_list_item') {
    return (
      <ul style={{ margin: 0, padding: 0 }}>
        <li style={style}>{textContent}</li>
      </ul>
    );
  }

  if (type === 'numbered_list_item') {
    return (
      <ol style={{ margin: 0, padding: 0 }}>
        <li style={style}>{textContent}</li>
      </ol>
    );
  }

  return null;
}
