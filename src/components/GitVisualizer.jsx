import React from 'react';

export default function GitVisualizer({ onClose }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: 'var(--bg)',
      position: 'relative'
    }}>

      <div style={{ flex: 1, position: 'relative' }}>
        <iframe 
          src="/git-visualizer/index.html" 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Git Visualizer"
        />
      </div>
    </div>
  );
}
