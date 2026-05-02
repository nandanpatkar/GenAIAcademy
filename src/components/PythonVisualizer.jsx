import React from "react";
import { X, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function PythonVisualizer({ onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="python-visualizer-panel"
      style={{
        position: 'absolute',
        top: 16, left: 16, right: 16, bottom: 16,
        background: 'var(--bg)',
        borderRadius: 24,
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 100
      }}
    >
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 12, 
            background: 'rgba(245, 158, 11, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Code size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Python Visualizer</h2>
            <p style={{ fontSize: 12, color: 'var(--text3)', margin: '2px 0 0 0' }}>Step-by-step code execution</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          style={{
            width: 32, height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'var(--text2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = 'var(--text2)';
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ flex: 1, background: '#fff', position: 'relative' }}>
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0"
          src="https://pythontutor.com/iframe-embed.html#code=x+%3D+5%0Ay+%3D+10%0Az+%3D+x+%2B+y&cumulative=false&py=2&curInstr=3"
          style={{ display: 'block', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          title="Python Visualizer"
        />
      </div>
    </motion.div>
  );
}
