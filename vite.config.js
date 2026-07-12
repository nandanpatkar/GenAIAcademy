import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Middleware to run Vercel serverless functions locally
const apiMiddleware = () => ({
  name: "vercel-api-middleware",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith("/api/")) {
        const endpoint = req.url.split("?")[0];
        const filePath = path.join(process.cwd(), `${endpoint}.js`);
        if (fs.existsSync(filePath)) {
          try {
            // Polyfill Vercel/Express response methods
            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            };

            // Add a cache buster so we can edit api files without restarting the server
            const module = await import(`${filePath}?update=${Date.now()}`);
            await module.default(req, res);
            return; // Handled!
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
  // Load env variables (including .env.local where Vercel secrets might be)
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), apiMiddleware()],
    base: "./",
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
