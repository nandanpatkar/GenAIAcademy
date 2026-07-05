import React from 'react';
import BlockRenderer from '../BlockRenderer';

export default function Column({ block, onNavigateToPage }) {
  // block.children will contain the actual blocks inside the column
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      {block.children && block.children.map(child => (
        <BlockRenderer key={child.id} block={child} onNavigateToPage={onNavigateToPage} />
      ))}
    </div>
  );
}
