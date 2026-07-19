import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export default function InlineLink({ url }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    // Check if it's actually a valid http url before trying to fetch
    if (!url.startsWith('http')) {
      setLoading(false);
      return;
    }

    async function fetchMetadata() {
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          const data = await res.json();
          setMetadata(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch inline link metadata", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [url]);

  if (!url) return null;

  if (loading || !metadata || !metadata.title) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--notion-link-bright, #9fe8ff)', textDecoration: 'underline', textDecorationColor: 'rgba(130, 217, 255, 0.9)', textUnderlineOffset: '3px', wordBreak: 'break-all' }}
      >
        {url}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: 'var(--notion-link-bright, #9fe8ff)',
        textDecoration: 'none',
        background: 'rgba(56, 189, 248, 0.16)',
        padding: '0 4px',
        borderRadius: '3px',
        borderBottom: '1px solid rgba(130, 217, 255, 0.62)',
        wordBreak: 'break-word',
        verticalAlign: 'bottom',
        transition: 'background 0.2s',
        lineHeight: 1.4
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.28)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.16)'}
    >
      {metadata.logo?.url ? (
        <img src={metadata.logo.url} alt="icon" style={{ width: 14, height: 14, objectFit: 'contain' }} />
      ) : (
        <ExternalLink size={12} color="var(--text3)" />
      )}
      <span style={{ fontWeight: 500 }}>{metadata.title}</span>
    </a>
  );
}
