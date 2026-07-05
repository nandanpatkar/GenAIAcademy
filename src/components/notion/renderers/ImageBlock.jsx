import React from 'react';
import RichTextRenderer from '../RichTextRenderer';

export default function ImageBlock({ block }) {
  const image = block.image;
  
  if (!image) return null;

  // Notion images can be 'external' or 'file' (hosted by Notion)
  const src = image.type === 'external' ? image.external.url : image.file.url;
  const caption = image.caption && image.caption.length > 0 ? image.caption : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5em 0' }}>
      <img 
        src={src} 
        alt="Notion Block"
        style={{
          maxWidth: '100%',
          borderRadius: '4px',
          display: 'block'
        }}
      />
      {caption && (
        <div style={{ marginTop: '8px', color: 'var(--text3)', fontSize: '0.9em', textAlign: 'center' }}>
          <RichTextRenderer textArray={caption} />
        </div>
      )}
    </div>
  );
}
