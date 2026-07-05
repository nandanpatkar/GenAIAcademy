import React from 'react';
import BlockRenderer from '../BlockRenderer';

export default function ColumnList({ block, onNavigateToPage }) {
  if (!block.children || block.children.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '24px', width: '100%', minWidth: 0, marginBottom: '1.5em', alignItems: 'stretch' }}>
      {block.children.map(col => (
        <BlockRenderer key={col.id} block={col} onNavigateToPage={onNavigateToPage} />
      ))}
    </div>
  );
}
