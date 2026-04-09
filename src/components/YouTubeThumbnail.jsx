import React, { useState } from 'react';

/**
 * YouTubeThumbnail component that tries multiple resolution levels 
 * if the highest one fails (404).
 */
const YouTubeThumbnail = ({ url, alt, className, style }) => {
  const extractYTId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  };

  const videoId = extractYTId(url);
  const [level, setLevel] = useState(0); // 0: maxres, 1: hq, 2: sd, 3: default

  if (!videoId) return null;

  const thumbnailLevels = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/default.jpg`
  ];

  const handleError = () => {
    if (level < thumbnailLevels.length - 1) {
      setLevel(level + 1);
    }
  };

  return (
    <img 
      src={thumbnailLevels[level]} 
      alt={alt || "Video Thumbnail"}
      className={className}
      style={{ 
        ...style,
        objectFit: 'cover',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}
      onError={handleError}
    />
  );
};

export default YouTubeThumbnail;
