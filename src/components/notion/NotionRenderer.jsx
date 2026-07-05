import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import BlockRenderer from './BlockRenderer';
import { Loader2, AlertCircle, Maximize, Minimize, Eye, EyeOff } from 'lucide-react';
import FocusPulse from '../FocusPulse';

export default function NotionRenderer({ passedPageId }) {
  const defaultPage = "1dfb2067f6d580ffbf61fdec2aca1a1c";
  const [pageIdInput, setPageIdInput] = useState(passedPageId || defaultPage);
  const [activePageId, setActivePageId] = useState(passedPageId || defaultPage);
  const [showInput, setShowInput] = useState(!passedPageId && !defaultPage);
  const [fontStyle, setFontStyle] = useState('sans'); // 'sans', 'serif', 'mono'
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchNotionData(pageId) {
      try {
        setLoading(true);
        const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY;
        
        // Fetch Page Metadata
        const pageRes = await fetch(`/notion-api/v1/pages/${pageId}`, {
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28'
          }
        });
        if (!pageRes.ok) throw new Error(`Failed to fetch Notion page: ${pageRes.statusText}`);
        const pageData = await pageRes.json();

        // Recursive fetch for blocks
        async function fetchBlocks(blockId) {
          const res = await fetch(`/notion-api/v1/blocks/${blockId}/children?page_size=100`, {
            headers: {
              'Authorization': `Bearer ${NOTION_API_KEY}`,
              'Notion-Version': '2022-06-28'
            }
          });
          if (!res.ok) throw new Error(`Failed to fetch Notion blocks: ${res.statusText}`);
          const data = await res.json();
          
          const blocks = data.results;
          
          // Fetch children recursively if they exist
          for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i];
            // Do not recursively fetch child pages or databases to avoid downloading the entire workspace
            if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') {
              blocks[i].children = await fetchBlocks(b.id);
            }
          }
          
          return blocks;
        }

        const blocksData = await fetchBlocks(pageId);

        setData({ page: pageData, blocks: blocksData });
        setError(null);
      } catch (err) {
        console.error("Error fetching notion data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (activePageId) {
      fetchNotionData(activePageId);
    }
  }, [activePageId]);

  const handleLoadPage = (e) => {
    e.preventDefault();
    if (pageIdInput.trim()) {
      setHistory([]);
      setActivePageId(pageIdInput.trim());
      setShowInput(false);
    }
  };

  const handleNavigate = (id) => {
    setHistory(prev => [...prev, activePageId]);
    setActivePageId(id);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const previousPageId = newHistory.pop();
    setHistory(newHistory);
    setActivePageId(previousPageId);
  };

  const renderInput = () => {
    if (activePageId && !showInput) {
      return (
        <div style={{ padding: isFocusMode ? '10px 20px 0 20px' : '1rem 40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setFontStyle('sans')}
              style={{
                padding: '4px 10px',
                background: fontStyle === 'sans' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: fontStyle === 'sans' ? 'var(--text)' : 'var(--text3)',
                border: 'none',
                borderRight: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              Sans
            </button>
            <button
              onClick={() => setFontStyle('serif')}
              style={{
                padding: '4px 10px',
                background: fontStyle === 'serif' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: fontStyle === 'serif' ? 'var(--text)' : 'var(--text3)',
                border: 'none',
                borderRight: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'Lyon-Text, Georgia, ui-serif, serif'
              }}
            >
              Serif
            </button>
            <button
              onClick={() => setFontStyle('mono')}
              style={{
                padding: '4px 10px',
                background: fontStyle === 'mono' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: fontStyle === 'mono' ? 'var(--text)' : 'var(--text3)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'iawriter-mono, Nitti, Menlo, Courier, monospace'
              }}
            >
              Mono
            </button>
          </div>
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            style={{
              padding: '6px 12px',
              background: isFocusMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isFocusMode ? <Minimize size={14} /> : <Maximize size={14} />} {isFocusMode ? 'Exit Focus' : 'Focus'}
          </button>
          {isFocusMode && (
            <button
              onClick={() => setIsUIHidden(true)}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <EyeOff size={14} /> Hide UI
            </button>
          )}
          <button
            onClick={() => setShowInput(true)}
            style={{
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Load New Page
          </button>
        </div>
      );
    }

    return (
      <div style={{ padding: '2rem 10%', margin: '0 auto', maxWidth: 1000, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--text)', margin: 0 }}>Load Notion Page</h2>
          {activePageId && (
            <button
              onClick={() => setShowInput(false)}
              style={{
                background: 'transparent',
                color: 'var(--text3)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
          )}
        </div>
        <form onSubmit={handleLoadPage} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={pageIdInput}
            onChange={(e) => setPageIdInput(e.target.value)}
            placeholder="Enter Notion Page ID (e.g. 1265dbde...)" 
            style={{ 
              flex: 1, 
              padding: '10px 15px', 
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              background: 'var(--neon)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Load
          </button>
        </form>
        {error && (
          <div style={{ padding: '1rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
            <AlertCircle size={20} style={{ marginBottom: 4, verticalAlign: 'middle', marginRight: 8 }} />
            <span style={{ verticalAlign: 'middle' }}>{error}</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9em', color: 'var(--text2)' }}>
              Make sure your Notion Integration is invited to the page! (Click the ••• menu on your Notion page, go to "Add connections", and select your integration).
            </p>
          </div>
        )}
      </div>
    );
  };

  let notionContent = null;

  if (!activePageId) {
    notionContent = renderInput();
  } else if (loading) {
    notionContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {!isUIHidden && renderInput()}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text3)' }}>
          <Loader2 className="spin" size={24} style={{ marginRight: 8 }} />
          <span>Loading Notion Content...</span>
        </div>
      </div>
    );
  } else if (error) {
    notionContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {!isUIHidden && renderInput()}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#ff4444' }}>
          <span>Error loading Notion content.</span>
        </div>
      </div>
    );
  } else if (data && data.blocks) {
    const getFontFamily = () => {
      if (fontStyle === 'serif') return 'Lyon-Text, Georgia, ui-serif, serif';
      if (fontStyle === 'mono') return 'iawriter-mono, Nitti, Menlo, Courier, monospace';
      return 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';
    };

    const currentFont = getFontFamily();

    notionContent = (
      <>
        {!isUIHidden && renderInput()}
        {isUIHidden && isFocusMode && (
          <button
            onClick={() => setIsUIHidden(false)}
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10001,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '100px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <Eye size={16} /> Show UI
          </button>
        )}
        <div className="notion-renderer-container" style={{ padding: isFocusMode ? '0 20px' : '0 40px', margin: '0 auto', maxWidth: '100%', overflowY: 'auto', flex: 1, width: '100%', boxSizing: 'border-box' }}>
          <style>
            {`
              .notion-blocks > *:first-child {
                margin-top: 0 !important;
              }
              .notion-blocks > *:last-child {
                margin-bottom: 0 !important;
              }
            `}
          </style>
          {data.page?.properties?.title?.title?.[0]?.plain_text && (
            <h1 style={{ marginTop: 0, fontFamily: currentFont, fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              {history.length > 0 && (
                <button 
                  onClick={handleBack}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                  title="Go Back"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
              )}
              {data.page.properties.title.title[0].plain_text}
            </h1>
          )}
          
          <div className="notion-blocks" style={{ 
            fontFamily: currentFont,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere'
          }}>
            {data.blocks.map(block => (
              <BlockRenderer key={block.id} block={block} onNavigateToPage={handleNavigate} />
            ))}
          </div>
        </div>
      </>
    );
  }

  const getFontFamilyFallback = () => {
    if (fontStyle === 'serif') return 'Lyon-Text, Georgia, ui-serif, serif';
    if (fontStyle === 'mono') return 'iawriter-mono, Nitti, Menlo, Courier, monospace';
    return 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';
  };
  const finalFont = getFontFamilyFallback();

  if (isFocusMode) {
    return (
      <FocusPulse mode="custom" onClose={() => setIsFocusMode(false)} hidePlayer={isUIHidden}>
        <div className="notion-renderer-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', '--notion-font': finalFont, width: '100%' }}>
          {notionContent}
        </div>
      </FocusPulse>
    );
  }

  return (
    <div className="notion-renderer-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', '--notion-font': finalFont }}>
      {notionContent}
    </div>
  );
}
