import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function K8sGames({ onClose }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: 'var(--bg)',
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
        {/* Dynamic Background Glow */}
        <motion.div
          animate={{
            background: 'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.15), transparent 50%)'
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
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 12px 32px rgba(14, 165, 233, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 900, fontFamily: 'Syne, sans-serif' }}>K8s</span>
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
              Deployment Game
            </motion.h1>
            <motion.p 
              layout
              style={{ margin: '4px 0 0 0', fontSize: 10, color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Interactive Kubernetes Learning Experience
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
          title="Close K8s Game"
        >
          <X size={20}/>
        </motion.button>
      </header>
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe 
          src="/k8sgames/index.html" 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="K8s Deployment Game"
        />
      </div>
    </div>
  );
}
