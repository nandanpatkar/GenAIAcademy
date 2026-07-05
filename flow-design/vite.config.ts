import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ---------------------------------------------------------------------------
// Icon Upload Middleware Plugin
// Handles multipart POST /api/upload-icon and GET /api/list-icons so the
// settings UI can persist new icons directly into the source asset tree.
// Only active in dev mode (plugin is not used in build).
// ---------------------------------------------------------------------------
function iconUploadPlugin() {
  const ICONS_ROOT = path.resolve(__dirname, 'assets/third-party-icons');

  function sanitizeSegment(value: string): string {
    return value
      .trim()
      .replace(/[^a-zA-Z0-9\-_ ]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 64);
  }

  function collectIcons(provider: string): { category: string; name: string; file: string }[] {
    const providerDir = path.join(ICONS_ROOT, provider, 'processed');
    const icons: { category: string; name: string; file: string }[] = [];
    if (!fs.existsSync(providerDir)) return icons;
    for (const category of fs.readdirSync(providerDir)) {
      const catDir = path.join(providerDir, category);
      if (!fs.statSync(catDir).isDirectory()) continue;
      for (const file of fs.readdirSync(catDir)) {
        if (/\.(svg|png|jpg|jpeg|webp)$/i.test(file)) {
          icons.push({ category, name: path.basename(file, path.extname(file)), file });
        }
      }
    }
    return icons;
  }

  return {
    name: 'icon-upload-middleware',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        // ---- GET /api/list-icons?provider=aws ----
        if (req.method === 'GET' && req.url?.startsWith('/api/list-icons')) {
          const url = new URL(req.url, 'http://localhost');
          const provider = sanitizeSegment(url.searchParams.get('provider') ?? '').toLowerCase();
          if (!provider) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'provider param required' }));
            return;
          }
          const icons = collectIcons(provider);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ provider, icons }));
          return;
        }

        // ---- POST /api/upload-icon ----
        if (req.method === 'POST' && req.url === '/api/upload-icon') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const body = Buffer.concat(chunks).toString('utf-8');
              const payload = JSON.parse(body) as {
                provider: string;
                category: string;
                name: string;
                dataUrl: string; // base64 data URL
              };

              const provider = sanitizeSegment(payload.provider).toLowerCase();
              const category = sanitizeSegment(payload.category);
              const name = sanitizeSegment(payload.name);

              if (!provider || !category || !name || !payload.dataUrl) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required fields: provider, category, name, dataUrl' }));
                return;
              }

              // Determine extension from data URL
              const mimeMatch = payload.dataUrl.match(/^data:([^;]+);base64,/);
              const mime = mimeMatch?.[1] ?? 'image/svg+xml';
              const extMap: Record<string, string> = {
                'image/svg+xml': '.svg',
                'image/png': '.png',
                'image/jpeg': '.jpg',
                'image/jpg': '.jpg',
                'image/webp': '.webp',
              };
              const ext = extMap[mime] ?? '.svg';

              const base64Data = payload.dataUrl.replace(/^data:[^;]+;base64,/, '');
              const fileBuffer = Buffer.from(base64Data, 'base64');

              const targetDir = path.join(ICONS_ROOT, provider, 'processed', category);
              fs.mkdirSync(targetDir, { recursive: true });

              const targetFile = path.join(targetDir, `${name}${ext}`);
              fs.writeFileSync(targetFile, fileBuffer);

              console.log(`[icon-upload] Saved: ${targetFile}`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                ok: true,
                path: `assets/third-party-icons/${provider}/processed/${category}/${name}${ext}`,
                provider,
                category,
                name,
              }));
            } catch (err) {
              console.error('[icon-upload] Error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // ---- DELETE /api/delete-icon ----
        if (req.method === 'DELETE' && req.url === '/api/delete-icon') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const payload = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as {
                provider: string;
                category: string;
                file: string;
              };
              const provider = sanitizeSegment(payload.provider).toLowerCase();
              const category = sanitizeSegment(payload.category);
              const file = path.basename(payload.file); // strip any path traversal
              const targetFile = path.join(ICONS_ROOT, provider, 'processed', category, file);

              // Safety: must be inside ICONS_ROOT
              if (!targetFile.startsWith(ICONS_ROOT)) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Forbidden path' }));
                return;
              }
              if (fs.existsSync(targetFile)) {
                fs.unlinkSync(targetFile);
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), iconUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: './',
    build: {
      chunkSizeWarningLimit: 900,
      modulePreload: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Collapse the per-SVG `?url` lazy stubs (1600+ icons) into a small
            // number of bucketed chunks, one per provider pack. Without this,
            // Vite emits one tiny JS module per icon and Cloudflare Pages
            // upload chokes on the file count.
            if (id.includes('/assets/third-party-icons/') && id.includes('.svg')) {
              const match = id.match(/assets\/third-party-icons\/([^/]+)\//);
              return match ? `icon-urls-${match[1]}` : 'icon-urls';
            }

            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('/node_modules/reactflow/')) {
              return 'vendor-reactflow';
            }

            if (id.includes('/node_modules/elkjs/')) {
              // Split the in-process fallback (elk.bundled) from the worker-mode API
              // so production loads only the small api shim; the bundled engine is
              // fetched only when the worker path is unavailable.
              if (id.includes('elk.bundled')) return 'vendor-elk-bundled';
              return 'vendor-elk';
            }

            if (
              id.includes('/node_modules/react-markdown/') ||
              id.includes('/node_modules/remark-gfm/') ||
              id.includes('/node_modules/remark-breaks/') ||
              id.includes('/node_modules/rehype-slug/') ||
              id.includes('/node_modules/react-syntax-highlighter/')
            ) {
              return 'vendor-markdown';
            }

            if (
              id.includes('/node_modules/i18next') ||
              id.includes('/node_modules/react-i18next/')
            ) {
              return 'vendor-i18n';
            }

            if (id.includes('/node_modules/lucide-react/')) {
              return 'vendor-lucide';
            }

            if (id.includes('/node_modules/framer-motion/')) {
              return 'vendor-motion';
            }

            if (id.includes('/node_modules/@google/genai/')) {
              return 'vendor-ai';
            }
            return undefined;
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      testTimeout: 10000,
      maxWorkers: 2,
      exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'mcp-server/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.d.ts', 'src/i18n/**'],
      },
    },
  };
});
