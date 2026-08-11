import { execFileSync } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const extensionRoot = join(projectRoot, "api_beam", "apibeam-main");
const extensionBuild = join(extensionRoot, "dist_chrome");
const archivePath = join(projectRoot, "public", "downloads", "apibeam-chrome-extension.zip");

const addDirectoryToArchive = async (zip, directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) {
      await addDirectoryToArchive(zip, source);
      return;
    }
    if (!entry.isFile()) return;
    zip.file(relative(extensionBuild, source), await readFile(source));
  }));
};

execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build:chrome"], {
  cwd: extensionRoot,
  stdio: "inherit",
});

const zip = new JSZip();
await addDirectoryToArchive(zip, extensionBuild);
zip.file("README.txt", `ApiBeam for Chrome\n\n1. Extract this ZIP file.\n2. In Chrome, open chrome://extensions.\n3. Turn on Developer mode.\n4. Click Load unpacked and select the extracted folder.\n5. Open ApiBeam Settings, enter your Atlas relay URL, then connect.\n\nSign in to ChatGPT in the same Chrome profile. Do not share the private API URL shown by ApiBeam after connecting.\n`);

await mkdir(dirname(archivePath), { recursive: true });
await writeFile(archivePath, await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 9 },
}));

console.log(`Created ${relative(projectRoot, archivePath)}`);
