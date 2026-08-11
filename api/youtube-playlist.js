// Fetches all videos in a YouTube playlist via the YouTube Data API v3.
const API_BASE = "https://www.googleapis.com/youtube/v3";
const MAX_PAGES = 20; // safety cap: 20 * 50 = up to 1000 videos

function extractPlaylistId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  const match = trimmed.match(/[?&]list=([^&]+)/);
  if (match) return decodeURIComponent(match[1]);
  // Allow a bare playlist ID (starts with PL/UU/LL/FL/OL, no spaces/slashes)
  if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed) && !trimmed.includes("/")) return trimmed;
  return null;
}

// Converts an ISO-8601 duration (e.g. "PT1H2M10S") to "H:MM:SS" / "M:SS".
function formatDuration(iso) {
  const m = (iso || "").match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "--:--";
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

function formatViews(count) {
  const n = parseInt(count || "0", 10);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

async function fetchAllPlaylistItems(playlistId, apiKey) {
  const items = [];
  let pageToken = "";
  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
      key: apiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${API_BASE}/playlistItems?${params}`);
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.error?.message || "Failed to fetch playlist");
      err.status = res.status;
      throw err;
    }

    items.push(...(data.items || []));
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  return items;
}

async function fetchVideoDetails(videoIds, apiKey) {
  const details = new Map();
  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const params = new URLSearchParams({
      part: "contentDetails,statistics",
      id: chunk.join(","),
      key: apiKey,
    });
    const res = await fetch(`${API_BASE}/videos?${params}`);
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.error?.message || "Failed to fetch video details");
      err.status = res.status;
      throw err;
    }
    (data.items || []).forEach((v) => details.set(v.id, v));
  }
  return details;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "YouTube API is not configured (missing YOUTUBE_API_KEY)" });
  }

  const rawUrl = req.query.url;
  const playlistId = extractPlaylistId(Array.isArray(rawUrl) ? rawUrl[0] : rawUrl);
  if (!playlistId) {
    return res.status(400).json({ error: "Could not find a playlist ID in that URL" });
  }

  try {
    const playlistItems = await fetchAllPlaylistItems(playlistId, apiKey);

    const usable = playlistItems.filter((it) => {
      const title = it.snippet?.title;
      return it.contentDetails?.videoId && title && title !== "Private video" && title !== "Deleted video";
    });

    const videoIds = usable.map((it) => it.contentDetails.videoId);
    const detailsById = videoIds.length ? await fetchVideoDetails(videoIds, apiKey) : new Map();

    const videos = usable.map((it) => {
      const videoId = it.contentDetails.videoId;
      const d = detailsById.get(videoId);
      return {
        videoId,
        title: it.snippet.title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        channel: it.snippet.videoOwnerChannelTitle || it.snippet.channelTitle || "Unknown",
        duration: d ? formatDuration(d.contentDetails?.duration) : "--:--",
        views: d ? formatViews(d.statistics?.viewCount) : "0",
      };
    });

    return res.status(200).json({
      playlistId,
      count: videos.length,
      skipped: playlistItems.length - usable.length,
      videos,
    });
  } catch (err) {
    console.error("YouTube playlist fetch error:", err);
    const status = err.status === 403 ? 403 : err.status === 404 ? 404 : 500;
    const message =
      status === 403
        ? "YouTube API quota exceeded or key is invalid"
        : status === 404
        ? "Playlist not found or is private"
        : "Failed to fetch playlist";
    return res.status(status).json({ error: message, details: err.message });
  }
}
