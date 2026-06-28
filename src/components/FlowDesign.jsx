import React from 'react';

export default function FlowDesign({ onClose }) {
  const srcUrl = "/flow-design/index.html";

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
          src={srcUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Flow Design"
        />
      </div>
    </div>
  );
}
