import React, { useState } from 'react';
import RichTextRenderer, { darkColorMap } from '../RichTextRenderer';
import BlockRenderer from '../BlockRenderer';

export default function ToggleBlock({ block, onNavigateToPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const content = block.toggle?.rich_text;
  
  if (!content) return null;

  const blockColor = block.toggle?.color || 'default';
  const isBg = blockColor.includes('_background');
  const mappedColor = darkColorMap[blockColor] || 'inherit';

  return (
    <div style={{
      marginBottom: '6px',
      color: isBg ? 'inherit' : mappedColor,
      backgroundColor: isBg ? mappedColor : 'transparent',
      padding: isBg ? '4px 8px' : '2px 0',
      borderRadius: isBg ? '4px' : '0',
    }}>
      <div 
        style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div style={{ flex: 1, marginTop: '2px', fontWeight: 500 }}>
          <RichTextRenderer textArray={content} />
        </div>
      </div>
      
      {isOpen && block.children && block.children.length > 0 && (
        <div style={{ paddingLeft: '28px', marginTop: '4px' }}>
          {block.children.map(child => (
            <BlockRenderer key={child.id} block={child} onNavigateToPage={onNavigateToPage} />
          ))}
        </div>
      )}
    </div>
  );
}
