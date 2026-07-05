import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export default function BookmarkBlock({ block }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  const url = block.bookmark?.url || block.link_preview?.url;

  useEffect(() => {
    if (!url) return;

    async function fetchMetadata() {
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          const data = await res.json();
          setMetadata(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch link metadata", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [url]);

  if (!url) return null;

  const hostname = new URL(url).hostname;

  // Fallback rendering if metadata fails or is loading
  if (loading || !metadata) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'block',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px',
          color: 'var(--text)',
          textDecoration: 'none',
          marginBottom: '1em',
          background: 'transparent',
          transition: 'background 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExternalLink size={16} color="var(--text3)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            {url}
          </span>
        </div>
      </a>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '4px',
        color: 'var(--text)',
        textDecoration: 'none',
        marginBottom: '1em',
        background: 'transparent',
        transition: 'background 0.2s',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: '100px'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center' }}>
        <div style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {metadata.title || hostname}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
          {metadata.description || ""}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text)', marginTop: 'auto' }}>
          {metadata.logo?.url ? (
            <img src={metadata.logo.url} alt="logo" style={{ width: 16, height: 16, objectFit: 'contain' }} />
          ) : (
            <ExternalLink size={14} color="var(--text3)" />
          )}
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {hostname}
          </span>
        </div>
      </div>
      {metadata.image?.url && (
        <div style={{ width: '30%', minWidth: '100px', maxWidth: '200px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={metadata.image.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
    </a>
  );
}
