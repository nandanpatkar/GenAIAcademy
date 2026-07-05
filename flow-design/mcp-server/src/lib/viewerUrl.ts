/**
 * Build a shareable URL that opens the Flow Design viewer with the given DSL
 * pre-loaded. Matches `encodeDslForViewer` in the web app.
 *
 * Encoding: deflate(utf8(dsl)) → base64url, prefixed with `~` to mark the
 * compressed format. The viewer falls back to legacy `btoa(encodeURIComponent(...))`
 * when the prefix is absent, so old links keep working.
 *
 * Override the base origin with FLOW_DESIGN_APP_URL (e.g. http://localhost:5173
 * for local dev). Defaults to https://app.flow-design.com. The app currently
 * uses hash routing, so the viewer path must live after `#/`.
 */
import { deflate } from 'pako';

const DEFAULT_APP_URL = 'https://app.flow-design.com';
const PAKO_PREFIX = '~';

function getAppBaseUrl(): string {
  const fromEnv = process.env.FLOW_DESIGN_APP_URL?.trim();
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/+$/, '');
  }
  return DEFAULT_APP_URL;
}

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function encodeDslForViewer(dsl: string): string {
  const compressed = deflate(new TextEncoder().encode(dsl), { level: 9 });
  return PAKO_PREFIX + toBase64Url(compressed);
}

/** URL that opens the DSL in Flow Design's read-only viewer. */
export function buildViewerUrl(dsl: string): string {
  return `${getAppBaseUrl()}/#/view?flow=${encodeDslForViewer(dsl)}`;
}
