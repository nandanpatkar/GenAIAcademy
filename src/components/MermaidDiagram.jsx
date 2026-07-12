import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'var(--font)'
});

export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        if (chart) {
          const id = `mermaid-chart-${Math.round(Math.random() * 100000)}`;
          const { svg } = await mermaid.render(id, chart);
          if (isMounted) {
            setSvg(svg);
            setError('');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to render flowchart');
          setSvg('');
        }
      }
    };
    renderChart();
    return () => { isMounted = false; };
  }, [chart]);

  return (
    <div className="mermaid-wrapper" style={{ margin: '20px 0', background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', overflowX: 'auto' }}>
      {error ? (
        <div style={{ color: '#ef4444', fontSize: '13px' }}>{error}</div>
      ) : (
        <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} style={{ display: 'flex', justifyContent: 'center' }} />
      )}
    </div>
  );
}
