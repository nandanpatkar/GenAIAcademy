import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabaseClient';
import BlockRenderer from './BlockRenderer';
import { Loader2, AlertCircle, Maximize, Minimize, Eye, EyeOff } from 'lucide-react';
import FocusPulse from '../FocusPulse';

async function readFunctionError(functionError, fallbackMessage) {
  const response = functionError?.context;
  if (response && typeof response.clone === 'function') {
    try {
      const payload = await response.clone().json();
      if (payload?.error) return payload.error;
    } catch {
      // Keep the SDK's fallback message when the Edge Function did not return JSON.
    }
  }
  return fallbackMessage;
}

function formatNotionError(message) {
  const normalized = String(message || '');
  if (/rate limit|rate limited|too many requests/i.test(normalized)) {
    return 'Notion is temporarily rate-limiting requests. Wait a few seconds, then load the page again.';
  }
  if (/unauthorized|invalid.*token|authentication/i.test(normalized)) {
    return 'The Notion connection is not authorized. Check the NOTION_API_KEY secret and integration access.';
  }
  if (/could not find|not found|object_not_found/i.test(normalized)) {
    return 'This Notion page was not found. Confirm the page ID and invite the integration to the page.';
  }
  return normalized || 'Unable to load the Notion page.';
}

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
  const requestInFlightRef = useRef(null);

  useEffect(() => {
    async function fetchNotionData(pageId) {
      // React Strict Mode re-runs effects in development. Avoid issuing a
      // second identical Notion request while the first one is still active.
      if (requestInFlightRef.current === pageId) return;
      requestInFlightRef.current = pageId;

      try {
        setLoading(true);

        // Fetch Page Metadata + top-level blocks via Supabase Edge Function
        // (keeps NOTION_API_KEY server-side instead of shipping it to the browser)
        const { data: pageResult, error: pageError } = await supabase.functions.invoke('notion-fetch', {
          body: { pageId }
        });
        if (pageError) {
          const message = await readFunctionError(pageError, pageError.message);
          throw new Error(`Failed to fetch Notion page: ${message}`);
        }
        if (pageResult?.error) throw new Error(`Failed to fetch Notion page: ${pageResult.error}`);

        const pageData = pageResult.page;
        const topLevelBlocks = pageResult.blocks;

        // Recursive fetch for nested children, using blockId (not pageId)
        async function fetchBlocks(blockId) {
          const { data: blockResult, error: blockError } = await supabase.functions.invoke('notion-fetch', {
            body: { blockId }
          });
          if (blockError) {
            const message = await readFunctionError(blockError, blockError.message);
            throw new Error(`Failed to fetch Notion blocks: ${message}`);
          }
          if (blockResult?.error) throw new Error(`Failed to fetch Notion blocks: ${blockResult.error}`);

          const blocks = blockResult.blocks;

          for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i];
            // Do not recursively fetch child pages or databases to avoid downloading the entire workspace
            if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') {
              blocks[i].children = await fetchBlocks(b.id);
            }
          }

          return blocks;
        }

        for (let i = 0; i < topLevelBlocks.length; i++) {
          const b = topLevelBlocks[i];
          if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') {
            topLevelBlocks[i].children = await fetchBlocks(b.id);
          }
        }

        setData({ page: pageData, blocks: topLevelBlocks });
        setError(null);
      } catch (err) {
        console.error("Error fetching notion data:", err);
        setError(formatNotionError(err.message));
      } finally {
        setLoading(false);
        if (requestInFlightRef.current === pageId) requestInFlightRef.current = null;
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {!isUIHidden && renderInput()}
        <div className="notion-loading-state" role="status" aria-live="polite">
          <div className="notion-loading-orbit" aria-hidden="true">
            <span className="notion-loading-ring notion-loading-ring-one" />
            <span className="notion-loading-ring notion-loading-ring-two" />
            <span className="notion-loading-packet notion-loading-packet-one" />
            <span className="notion-loading-packet notion-loading-packet-two" />
            <div className="notion-loading-core"><Loader2 size={22} /></div>
          </div>
          <div className="notion-loading-copy">
            <span className="notion-loading-kicker"><span className="notion-loading-dot" /> SYNCING / NOTION API</span>
            <strong>Connecting your knowledge graph</strong>
            <span>Fetching page blocks and nested content</span>
          </div>
          <div className="notion-loading-progress" aria-hidden="true"><span /></div>
          <div className="notion-loading-skeleton" aria-hidden="true">
            <span className="notion-loading-skeleton-title" />
            <span />
            <span />
            <span className="notion-loading-skeleton-short" />
          </div>
        </div>
      </div>
    );
  } else if (error) {
    notionContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {!isUIHidden && renderInput()}
        <div className="notion-error-state" role="alert">
          <div className="notion-error-copy">
            <strong>Error loading Notion content</strong>
            <span>{error}</span>
          </div>
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
        <div className="notion-renderer-container notion-reading-surface" style={{ padding: isFocusMode ? '0 20px' : '0 40px', margin: '0 auto', maxWidth: '100%', overflowY: 'auto', flex: 1, width: '100%', boxSizing: 'border-box' }}>
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

  const awsBackdrop = (
    <div className="notion-aws-backdrop" aria-hidden="true">
      <div className="notion-aws-backdrop-grid" />
      <div className="notion-aws-backdrop-glow notion-aws-backdrop-glow-one" />
      <div className="notion-aws-backdrop-glow notion-aws-backdrop-glow-two" />
      <svg className="notion-aws-backdrop-graph" viewBox="0 0 900 520" preserveAspectRatio="none">
        <path d="M40 330 C180 330 190 155 340 155 S510 330 665 330 S780 200 870 200" />
        <path d="M40 330 C190 330 205 420 360 420 S515 330 665 330" />
        <path d="M340 155 C430 155 455 64 540 64 S650 160 665 330" />
        <circle cx="40" cy="330" r="4" />
        <circle cx="340" cy="155" r="4" />
        <circle cx="540" cy="64" r="4" />
        <circle cx="665" cy="330" r="4" />
        <circle cx="870" cy="200" r="4" />
      </svg>
      <div className="notion-aws-backdrop-label notion-aws-backdrop-label-client">CLIENT</div>
      <div className="notion-aws-backdrop-label notion-aws-backdrop-label-edge">EDGE</div>
      <div className="notion-aws-backdrop-label notion-aws-backdrop-label-compute">COMPUTE</div>
      <div className="notion-aws-backdrop-label notion-aws-backdrop-label-data">DATA</div>
      <div className="notion-aws-backdrop-label notion-aws-backdrop-label-observe">OBSERVE</div>
      <div className="notion-aws-backdrop-caption">
        <span className="notion-aws-backdrop-status" />
        AWS SYSTEM DESIGN / READING CONTEXT
      </div>
    </div>
  );

  if (isFocusMode) {
    return (
      <FocusPulse mode="custom" onClose={() => setIsFocusMode(false)} hidePlayer={isUIHidden}>
        <div className="notion-renderer-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', '--notion-font': finalFont, width: '100%', position: 'relative', overflow: 'hidden' }}>
          {awsBackdrop}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {notionContent}
          </div>
        </div>
      </FocusPulse>
    );
  }

  return (
    <div className="notion-renderer-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minWidth: 0, '--notion-font': finalFont, position: 'relative', overflow: 'hidden' }}>
      {awsBackdrop}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {notionContent}
      </div>
    </div>
  );
}
