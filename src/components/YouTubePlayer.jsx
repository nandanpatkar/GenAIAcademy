import React, { useEffect, useRef, useState } from "react";

export default function YouTubePlayer({ url, title, onTimeUpdate, onEnded, startTime = 0 }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const extractYTId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  };

  const videoId = extractYTId(url);

  // 1. Load the YouTube IFrame API script
  useEffect(() => {
    // Timeout fallback: If API isn't ready in 3s, use direct Iframe
    const timer = setTimeout(() => {
      if (!window.YT || !window.YT.Player) {
        console.warn("YouTube API timeout - switching to fallback iframe");
        setUseFallback(true);
      }
    }, 3000);

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
        clearTimeout(timer);
      };
    } else {
      setIsApiReady(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, []);

  // 2. Initialize the player when API and videoId are ready
  useEffect(() => {
    if (!isApiReady || !videoId || !containerRef.current || useFallback) return;

    // Destroy existing player if any
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    try {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          start: Math.floor(startTime)
        },
        events: {
          onReady: (event) => {
            if (startTime > 0) {
              event.target.seekTo(startTime, true);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (onEnded) onEnded();
            }
          }
        }
      });
    } catch (e) {
      console.error("Failed to init YT player", e);
      setUseFallback(true);
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, isApiReady, useFallback]);

  // 3. High-precision time polling
  useEffect(() => {
    let interval;
    if (onTimeUpdate && !useFallback) {
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const time = playerRef.current.getCurrentTime();
          onTimeUpdate(time);
        }
      }, 100); // 10 times per second for frame-accurate notes
    }
    return () => clearInterval(interval);
  }, [onTimeUpdate, useFallback]);

  if (!videoId) {
    return (
      <div style={{ 
        width: "100%", aspectRatio: "16/9", background: "rgba(0,0,0,0.4)", 
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 16, color: "var(--text3)", fontSize: 14, border: "1px dashed var(--border)"
      }}>
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="youtube-player-container" style={{
      width: "100%",
      aspectRatio: "16/9",
      background: "#000",
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
    }}>
      {useFallback ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&start=${Math.floor(startTime)}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
      )}
    </div>
  );
}
