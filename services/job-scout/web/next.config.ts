import type { NextConfig } from "next";

/**
 * Static export, served by the Python API on :8000 so readers run one command
 * and open one URL. Everything here is client-side (Three.js, WebRTC, MediaPipe),
 * so there is nothing for a Node server to do — and no route handlers, which is
 * deliberate: the ElevenLabs key belongs to the Python process, not to Next.
 *
 * In development `next dev` serves :3000 and talks to the API cross-origin
 * (NEXT_PUBLIC_API_BASE + the CORS allowance in job_scout/api.py), because
 * rewrites are not available under `output: "export"`.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
