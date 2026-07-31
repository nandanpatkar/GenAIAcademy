import React from 'react';
import { motion } from 'framer-motion';
import { X, Layers, ExternalLink } from 'lucide-react';

export default function FreeSystemDesign({ onClose }) {
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
            <Layers size={24} style={{ color: '#000000' }} />
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
                fontFamily: 'var(--font-heading, inherit)'
              }}>
              Free System Design
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
              Learn System Design by Building It
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
          title="Close Free System Design"
        >
          <X size={20} />
        </motion.button>
      </header>

      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32
      }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '48px 40px'
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #00ff88, #0088ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 24px rgba(0, 255, 136, 0.25)'
          }}>
            <Layers size={26} style={{ color: '#000' }} />
          </div>

          <h2 style={{
            margin: '0 0 12px',
            fontSize: 20,
            fontWeight: 800,
            color: 'var(--text, #fff)',
            letterSpacing: '-0.4px'
          }}>
            This site can't be embedded
          </h2>

          <p style={{
            margin: '0 0 28px',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.55)'
          }}>
            freesystemdesign.com blocks being displayed inside another site's frame,
            so it can't be shown here directly. You can still open it in a new tab.
          </p>

          <motion.a
            href="https://freesystemdesign.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #00ff88, #0088ff)',
              color: '#000',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0, 255, 136, 0.25)'
            }}
          >
            Open Free System Design
            <ExternalLink size={16} />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
