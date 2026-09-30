// PGlite is ~16MB of WASM plus a preloaded data image. Serving that from our own
// origin would burn Vercel Hobby's 100GB/month bandwidth budget roughly 6,000
// first-time visits in, so pull it from jsDelivr and fall back to the bundled
// copy when the CDN is unreachable. Set to false to always serve locally.
const LOAD_PGLITE_FROM_CDN = true;
const PGLITE_CDN = "https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.4/dist/index.js";

export const loadPGlite = async () => {
  if (LOAD_PGLITE_FROM_CDN) {
    try {
      const mod = await import(/* @vite-ignore */ PGLITE_CDN);
      if (mod?.PGlite) return mod.PGlite;
    } catch {
      // Offline, blocked, or behind a corporate proxy — use the bundled copy.
    }
  }
  const local = await import("@electric-sql/pglite");
  return local.PGlite;
};
