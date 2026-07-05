import React from 'react';
import { ExternalLink, File, FileText } from 'lucide-react';

export default function GenericLinkBlock({ block }) {
  let url = null;
  let label = "Link";
  let Icon = ExternalLink;

  if (block.type === 'file') {
    url = block.file?.file?.url || block.file?.external?.url;
    label = block.file?.name || "File Attachment";
    Icon = File;
  } else if (block.type === 'pdf') {
    url = block.pdf?.file?.url || block.pdf?.external?.url;
    label = "PDF Document";
    Icon = FileText;
  } else if (block.type === 'link_preview' || block.type === 'bookmark') {
    url = block.link_preview?.url || block.bookmark?.url;
    label = url;
  }

  if (!url) return null;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '6px',
        color: 'var(--text)',
        textDecoration: 'none',
        marginBottom: '1em',
        background: 'rgba(255,255,255,0.02)',
        transition: 'background 0.2s',
        fontSize: '0.9em',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
    >
      <Icon size={18} color="var(--text3)" style={{ flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>{label}</span>
    </a>
  );
}
