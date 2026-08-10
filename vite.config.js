import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Middleware to run Vercel serverless functions locally
const apiMiddleware = () => ({
  name: "vercel-api-middleware",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      let url = req.url.split("?")[0];

      // /graphql → /api/graphql
      if (url === "/graphql") {
        req.url = "/api/graphql" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");
        url = "/api/graphql";
      }

      // /api/copilot/* → /api/copilot (single handler with full URL preserved)
      if (url.startsWith("/api/copilot/")) {
        // Keep the original url so the handler can parse sessionId from it
        const filePath = path.join(process.cwd(), "api/copilot.js");
        if (fs.existsSync(filePath)) {
          try {
            const urlObj = new URL(req.url, "http://localhost");
            req.query = Object.fromEntries(urlObj.searchParams.entries());

            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            };
            res.write = res.write.bind(res);
            res.end = res.end.bind(res);

            const module = await import(`${filePath}?update=${Date.now()}`);
            await module.default(req, res);
            return;
          } catch (err) {
            console.error("Copilot Middleware error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
      }

      // /api/auth/* → /api/auth (single handler with full URL preserved)
      if (url.startsWith("/api/auth/")) {
        const filePath = path.join(process.cwd(), "api/auth.js");
        if (fs.existsSync(filePath)) {
          try {
            const urlObj = new URL(req.url, "http://localhost");
            req.query = Object.fromEntries(urlObj.searchParams.entries());

            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            };
            res.write = res.write.bind(res);
            res.end = res.end.bind(res);

            const module = await import(`${filePath}?update=${Date.now()}`);
            await module.default(req, res);
            return;
          } catch (err) {
            console.error("Auth Middleware error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
      }

      if (url.startsWith("/api/")) {
        const endpoint = url;
        const filePath = path.join(process.cwd(), `${endpoint}.js`);
        if (fs.existsSync(filePath)) {
          try {
            const urlObj = new URL(req.url, "http://localhost");
            req.query = Object.fromEntries(urlObj.searchParams.entries());

            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            };

            // Collect body for POST — only pre-parse JSON here; leave other
            // content types (e.g. multipart/form-data from AFFiNE's GraphQL
            // client) as an unconsumed stream so the handler can read it itself.
            const reqContentType = req.headers["content-type"] || "";
            if (req.method === "POST" && !req.body && reqContentType.includes("application/json")) {
              await new Promise((resolve, reject) => {
                let data = "";
                req.on("data", chunk => { data += chunk; });
                req.on("end", () => {
                  try {
                    req.body = data ? JSON.parse(data) : {};
                  } catch {
                    req.body = {};
                  }
                  resolve();
                });
                req.on("error", reject);
              });
            }

            const module = await import(`${filePath}?update=${Date.now()}`);
            await module.default(req, res);
            return;
          } catch (err) {
            console.error("API Middleware execution error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
      }
      next();
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), apiMiddleware()],
    base: "./",
    // Avoid serializing the dependency map for every lazy feature (including
    // thousands of studio icon assets) into the app's startup bundle. Lazy
    // modules still load on demand; they simply aren't preloaded at startup.
    build: {
      modulePreload: false,
      rollupOptions: {
        output: {
          // Split the dependencies that never change into their own chunks, so a
          // deploy that touches only app code doesn't invalidate them in every
          // returning visitor's cache. Without this, React, Supabase and the icon
          // set were rebuilt into the entry chunk under a new hash on every ship.
          // NOTE: lucide-react is deliberately NOT listed here. Grouping it into
          // one chunk defeats per-chunk tree-shaking — the union of every icon
          // imported anywhere in the app (~900 KB) ends up on the startup path
          // instead of each lazy screen carrying only the icons it renders.
          // Measured: adding an `icons` chunk made first-load JS worse, not better.
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            supabase: ["@supabase/supabase-js"],
            motion: ["framer-motion"],
          },
        },
      },
      // The entry is large and we are actively splitting it; keep the warning
      // meaningful rather than firing on chunks we already know about.
      chunkSizeWarningLimit: 900,
    },
    // PGlite ships its own .wasm / .data payload and must not be pre-bundled,
    // otherwise esbuild rewrites the URLs it uses to locate them at runtime.
    optimizeDeps: {
      exclude: ["@electric-sql/pglite"],
    },
    server: {
      proxy: {
        "/notion-api": {
          target: "https://api.notion.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/notion-api/, ""),
        },
      },
    },
  };
});
