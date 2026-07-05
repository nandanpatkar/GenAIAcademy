import React from 'react';

export default function VideoBlock({ block }) {
  const url = block.video?.external?.url || block.video?.file?.url;
  
  if (!url) return null;

  // Try to parse YouTube to embed format
  let embedUrl = url;
  if (url.includes('youtube.com/watch')) {
    const videoId = new URLSearchParams(new URL(url).search).get('v');
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0];
    if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  return (
    <div style={{ marginBottom: '1.5em', position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, borderRadius: '8px', overflow: 'hidden' }}>
      <iframe
        src={embedUrl}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
