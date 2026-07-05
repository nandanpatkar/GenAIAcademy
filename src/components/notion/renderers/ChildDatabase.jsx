import React from 'react';
import { Database } from 'lucide-react';

export default function ChildDatabase({ block }) {
  const title = block.child_database?.title || 'Untitled Database';

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        margin: '4px 0',
        borderRadius: '6px',
        backgroundColor: 'transparent',
        cursor: 'default',
        transition: 'background 0.2s ease',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Database size={18} style={{ marginRight: '12px', color: 'var(--text2)' }} />
      <span style={{ 
        color: 'var(--text)',
        fontSize: '1rem',
        fontWeight: 500,
        textDecoration: 'none'
      }}>
        {title}
      </span>
    </div>
  );
}
