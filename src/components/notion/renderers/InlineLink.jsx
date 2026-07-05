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
        style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.4)', textUnderlineOffset: '3px', wordBreak: 'break-all' }}
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
        color: 'var(--text)',
        textDecoration: 'none',
        background: 'rgba(255,255,255,0.05)',
        padding: '0 4px',
        borderRadius: '3px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        wordBreak: 'break-word',
        verticalAlign: 'bottom',
        transition: 'background 0.2s',
        lineHeight: 1.4
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
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
