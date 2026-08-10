/**
 * monacoLoader.js — Monaco CDN configuration, applied lazily.
 *
 * This `loader.config()` call used to sit at the very top of `src/main.jsx`. It
 * only sets a CDN path, but importing `@monaco-editor/react` from the app entry
 * forced the whole package into the entry chunk — parsed and executed on every
 * page load, including for the majority of visitors who never open an editor.
 *
 * Every component that mounts an editor calls `configureMonaco()` first instead.
 * The call is idempotent, so multiple editors mounting is fine.
 */

import { loader } from '@monaco-editor/react';

let configured = false;

export function configureMonaco() {
  if (configured) return;
  configured = true;
  // Resolves "MonacoEnvironment is not defined" and the web-worker fallback warning.
  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs',
    },
  });
}
