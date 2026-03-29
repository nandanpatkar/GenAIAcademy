import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const fileUploadPlugin = () => ({
  name: "vite-plugin-file-upload",
  configureServer(server) {
    server.middlewares.use("/api/upload", (req, res) => {
      if (req.method === "POST") {
        const fileName = decodeURIComponent(req.headers["x-file-name"]) || `upload-${Date.now()}`;
        const dir = path.resolve(__dirname, "public/uploads");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const filePath = path.join(dir, fileName);
        const writeStream = fs.createWriteStream(filePath);
        req.pipe(writeStream);
        
        req.on("end", () => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ url: `/uploads/${fileName}` }));
        });
      } else {
        res.statusCode = 405;
        res.end();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), fileUploadPlugin()],
  base: "./",
});
