import React from 'react';
import './LetterAvatar.css';

const LetterAvatar = ({ name, size = 40, status = null, glow = false, emoji = null }) => {
  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n[0].toUpperCase();
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#22d3ee', // Cyan
      '#8b5cf6', // Violet
      '#00ff88', // Emerald
      '#f472b6', // Pink
      '#fbbf24', // Amber
      '#38bdf8', // Sky
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const color = stringToColor(name);
  
  return (
    <div 
      className={`letter-avatar ${glow ? 'glow' : ''} ${status ? `status-${status}` : ''}`}
      style={{ 
        width: size, 
        height: size, 
        fontSize: size * 0.4,
        '--avatar-color': color,
        '--avatar-glow': `${color}40`
      }}
    >
      {emoji ? (
        <span className="avatar-emoji">{emoji}</span>
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
      {status && <div className="status-dot" />}
    </div>
  );
};

export default LetterAvatar;
