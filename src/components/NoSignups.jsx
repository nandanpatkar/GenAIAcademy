import React from 'react';
import { motion } from 'framer-motion';
import { X, Globe } from 'lucide-react';

export default function NoSignups({ onClose }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: 'var(--bg, #020202)',
      position: 'relative'
    }}>
      <header style={{ 
        height: 80, 
        background: 'rgba(15, 15, 15, 0.4)', 
        backdropFilter: 'blur(30px) saturate(200%)',
        borderBottom: `1px solid rgba(255, 255, 255, 0.08)`, 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 32px', 
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        overflow: 'hidden'
      }}>
        {/* Neon Glow in background */}
        <motion.div
          animate={{
            background: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.15), transparent 50%)'
          }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <motion.div 
            initial={{ scale: 0.8, rotate: -15, filter: 'blur(10px)' }}
            animate={{ scale: 1, rotate: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #00ff88, #0088ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
            <Globe size={24} style={{ color: '#000000' }} />
          </motion.div>
          <div>
            <motion.h1 
              layout
              style={{ 
                fontSize: 24, 
                fontWeight: 900, 
                color: '#fff', 
                letterSpacing: '-0.8px', 
                lineHeight: 1, 
                margin: 0,
                fontFamily: 'Syne, sans-serif'
              }}>
              NoSignups Tools
            </motion.h1>
            <motion.p 
              layout
              style={{ 
                margin: '4px 0 0 0', 
                fontSize: 10, 
                color: 'rgba(0, 255, 136, 0.8)', 
                fontWeight: 700, 
                letterSpacing: '1px', 
                textTransform: 'uppercase' 
              }}>
              Open-Source & In-Browser Directory (Zero Signups)
            </motion.p>
          </div>
        </div>

        <motion.button 
          onClick={onClose} 
          whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#ef4444', borderColor: '#ef4444' }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: '#fff',
            width: '40px', 
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.3s, border-color 0.3s, transform 0.3s',
            position: 'relative',
            zIndex: 101
          }}
          title="Close NoSignups"
        >
          <X size={20}/>
        </motion.button>
      </header>

      <div style={{ flex: 1, position: 'relative' }}>
        <iframe 
          src="https://nosignups.net/" 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="NoSignups Directory"
        />
      </div>
    </div>
  );
}
