import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    // In development, proxy /api/upload to the Vercel dev server
    // Run: vercel dev (instead of vite) for full local S3 testing
    // OR keep using `npm run dev` and the upload will hit the serverless fn via vercel dev
  },
});
