import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Monitor, Info, RefreshCcw, WifiOff, AlertTriangle } from 'lucide-react';

export default function CodeVisualizer({ onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);
  const [key, setKey] = useState(0); // For forcing iframe reload
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Auto-reveal the engine after a short delay for an "instant" feel, 
    // rather than waiting for every background tracking script to finish.
    const autoReveal = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(autoReveal);
  }, [key]);

  const handleManualRetry = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <motion.div 
      className="cv-iframe-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="cv-iframe-header" style={{ height: 62, background: 'var(--bg2)', borderBottom: `1px solid var(--border)`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0, position: 'relative' }}>
        
        {/* Placeholder for sidebar toggle alignment */}
        <div style={{ width: 30, height: 30, flexShrink: 0 }} />

        {/* Logo + Title Stack */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, #3b82f6, #2563eb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 18px rgba(59, 130, 246, 0.35)' }}>
            <Monitor size={19} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>Algo Visualizer</h1>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>Active Simulation Engine · Real-time Execution</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div className="cv-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            className="cv-icon-btn" 
            title="Reload Engine" 
            onClick={handleManualRetry}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--text2)', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <RefreshCcw size={18} />
          </button>
          
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />
          
          <button className="cv-close-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px 8px' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      <main className="cv-iframe-viewport">
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="cv-iframe-loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Sparkles className="spin neon-text" size={40} />
              <p className="loading-txt">INITIALIZING_ENGINE...</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="iframe-mask">
          <iframe 
            key={key}
            src="https://programiz.pro/code-visualizer/python" 
            className="simulation-viewport"
            onLoad={handleIframeLoad}
            title="Code Simulator Studio"
          />
          {/* Blocks the external chat widget from the iframe */}
          <div className="chat-widget-hider" />
        </div>
      </main>

      <style>{`
        .cv-iframe-container {
          position: relative;
          flex: 1;
          height: 100%;
          background: #000;
          color: #fff;
          display: flex;
          flex-direction: column;
          font-family: 'Syne', sans-serif;
          overflow: hidden;
        }

        .cv-iframe-header {
          height: 80px;
          background: #050505;
          border-bottom: 2px solid #111;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          position: relative;
        }

        .cv-iframe-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 950;
          letter-spacing: 1.5px;
          font-size: 14px;
          min-width: 0;
          overflow: hidden; /* added to ensure inner content truncates */
        }
        .brand-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .cv-iframe-hint {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          color: #555;
          font-weight: 700;
          background: rgba(255,255,255,0.02);
          padding: 8px 18px;
          border-radius: 100px;
          border: 1px solid #111;
          text-transform: uppercase;
          z-index: 10;
        }

        @media (max-width: 1100px) {
          .cv-iframe-hint { display: none; }
        }

        .status-dot-pulse {
          width: 6px;
          height: 6px;
          background: #00ff88;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ff88;
          animation: dot-pulse 2s infinite;
        }
        @keyframes dot-pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

        .cv-header-actions { 
          display: flex; 
          align-items: center; 
          gap: 16px; 
          justify-content: flex-end;
        }
        .cv-icon-btn { color: #444; transition: 0.2s; background: none; border: none; cursor: pointer; }
        .cv-icon-btn:hover { color: #fff; transform: rotate(45deg); }
        .cv-v-divider { width: 1px; height: 20px; background: #222; }

        .cv-close-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.8;
          transition: 0.2s;
        }
        .cv-close-btn:hover { opacity: 1; transform: scale(1.05); }

        .cv-iframe-viewport {
          flex: 1;
          position: relative;
          background: #000;
        }

        .cv-iframe-loader {
          position: absolute;
          inset: 0;
          z-index: 100;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .loading-txt { font-size: 10px; font-weight: 900; letter-spacing: 2px; color: #444; }

        .timeout-fallback {
          text-align: center;
          max-width: 400px;
          padding: 40px;
          background: #080808;
          border: 1px solid #111;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .timeout-content h3 { font-size: 18px; margin-bottom: 12px; }
        .timeout-content p { font-size: 12px; color: #666; line-height: 1.6; margin-bottom: 24px; }
        
        .retry-btn { background: #00ff88; color: #000; padding: 10px 24px; border-radius: 8px; font-weight: 900; font-size: 10px; display: flex; align-items: center; gap: 8px; }
        .force-btn { background: none; color: #444; font-size: 10px; font-weight: 700; margin-top: 12px; text-decoration: underline; }

        .iframe-mask {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          background: #080808;
        }

        .simulation-viewport {
          position: absolute;
          /* Precise negative offset to hide external branding and banners perfectly */
          top: -105px; 
          left: 0;
          width: 100%;
          /* Scaled height to eliminate bottom gaps and maintain alignment */
          height: calc(100% + 105px);
          border: none;
          background: #000;
        }

        .chat-widget-hider {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 90px;
          height: 90px;
          background: #1f2023;
          z-index: 10;
        }

        .neon-text { color: #00ff88; }
        .warn-text { color: #facc15; }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
