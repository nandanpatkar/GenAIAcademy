import { deflate, inflate } from 'pako';

const PAKO_PREFIX = '~';

function fromBase64Url(value: string): Uint8Array {
  const pad = value.length % 4 === 0 ? '' : '='.repeat(4 - (value.length % 4));
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeDslFromViewerParam(encoded: string): string {
  if (encoded.startsWith(PAKO_PREFIX)) {
    const bytes = fromBase64Url(encoded.slice(PAKO_PREFIX.length));
    return new TextDecoder().decode(inflate(bytes));
  }

  return decodeURIComponent(atob(encoded));
}

export function encodeDslForViewer(dsl: string): string {
  const compressed = deflate(new TextEncoder().encode(dsl), { level: 9 });
  return PAKO_PREFIX + toBase64Url(compressed);
}
