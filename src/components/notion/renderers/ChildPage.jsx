import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

export default function ChildPage({ block, onNavigateToPage }) {
  const [icon, setIcon] = useState(null);
  const title = block.child_page?.title || "Untitled";
  const pageId = block.id;

  useEffect(() => {
    async function fetchPageIcon() {
      try {
        const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY;
        const res = await fetch(`/notion-api/v1/pages/${pageId}`, {
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.icon) {
            setIcon(data.icon);
          }
        }
      } catch (err) {
        console.error("Failed to fetch child page icon", err);
      }
    }
    fetchPageIcon();
  }, [pageId]);

  const renderIcon = () => {
    if (!icon) return <FileText size={18} color="var(--text3)" />;
    if (icon.type === 'emoji') {
      return <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{icon.emoji}</span>;
    }
    if (icon.type === 'external') {
      return <img src={icon.external.url} alt="icon" style={{ width: 18, height: 18, objectFit: 'contain' }} />;
    }
    if (icon.type === 'file') {
      return <img src={icon.file.url} alt="icon" style={{ width: 18, height: 18, objectFit: 'contain' }} />;
    }
    return <FileText size={18} color="var(--text3)" />;
  };

  return (
    <div 
      onClick={() => {
        if (onNavigateToPage) onNavigateToPage(pageId.replace(/-/g, ''));
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 500,
        color: 'var(--text)',
        transition: 'background 0.2s',
        marginBottom: '0.5em',
        borderBottom: '1px solid transparent',
        width: 'auto'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {renderIcon()}
      <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--text3)', wordBreak: 'break-word' }}>{title}</span>
    </div>
  );
}
