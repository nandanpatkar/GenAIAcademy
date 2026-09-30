// CodeSpace: folders of source files with an explicit revision history.
// Files are stored data, never executed by this app's server — "Run" sends a
// copy to the same sandboxed runner the IDE uses.

import { hashString } from "./problems.js";

export const MAX_REVISIONS = 30;
export const MAX_FILE_CHARS = 100_000;

const RESERVED = new Set(["con", "prn", "aux", "nul", ...Array.from({ length: 9 }, (_, i) => `com${i + 1}`), ...Array.from({ length: 9 }, (_, i) => `lpt${i + 1}`)]);

// Extension → Monaco language and (when runnable) runner language id.
export const EXTENSIONS = {
  py: { monaco: "python", run: "python3", label: "Python" },
  js: { monaco: "javascript", run: "nodejs", label: "JavaScript" },
  mjs: { monaco: "javascript", run: "nodejs", label: "JavaScript" },
  java: { monaco: "java", run: "java", label: "Java" },
  cpp: { monaco: "cpp", run: "cpp17", label: "C++" },
  cc: { monaco: "cpp", run: "cpp17", label: "C++" },
  go: { monaco: "go", run: "go", label: "Go" },
  sql: { monaco: "sql", run: null, label: "SQL" },
  md: { monaco: "markdown", run: null, label: "Markdown" },
  txt: { monaco: "plaintext", run: null, label: "Text" },
  json: { monaco: "json", run: null, label: "JSON" },
};

export const extensionOf = (name) => (String(name).includes(".") ? String(name).split(".").pop().toLowerCase() : "");
export const languageOf = (name) => EXTENSIONS[extensionOf(name)] || { monaco: "plaintext", run: null, label: "Text" };

/** Returns an error message, or null when the name is acceptable. */
export function validateName(rawName, siblingNames = [], { requireExtension = false } = {}) {
  const name = String(rawName || "").trim();
  if (!name) return "Give it a name.";
  if (name.length > 60) return "Keep names under 60 characters.";
  if (/[\\/]/.test(name) || name.includes("..")) return "Names can't contain slashes or “..”.";
  if (!/^[A-Za-z0-9][A-Za-z0-9._ -]*$/.test(name)) return "Use letters, numbers, spaces, dots, dashes or underscores, starting with a letter or number.";
  if (RESERVED.has(name.split(".")[0].toLowerCase())) return "That name is reserved by some operating systems.";
  if (requireExtension && !extensionOf(name)) return "Add an extension, e.g. solution.py.";
  if (siblingNames.some((sibling) => sibling.toLowerCase() === name.toLowerCase())) return "Something here already has that name.";
  return null;
}

export const contentHash = (content) => hashString(content).toString(16).padStart(8, "0");

/** Append a revision unless the content is identical to the latest one. */
export function addRevision(file, message, now = new Date().toISOString()) {
  const hash = contentHash(file.content);
  const latest = file.revisions[file.revisions.length - 1];
  if (latest && latest.hash === hash) return { file, added: false };
  const revision = { id: `${now}-${hash}`, at: now, hash, message: String(message || "").trim() || "Saved", content: file.content, size: file.content.length };
  return { file: { ...file, revisions: [...file.revisions, revision].slice(-MAX_REVISIONS), savedHash: hash, updatedAt: now }, added: true };
}

export const hasUnsavedChanges = (file) => contentHash(file.content) !== (file.savedHash || contentHash(""));

/** Every live file with its folder path, for ZIP export. */
export function exportEntries(state) {
  const folderName = new Map(state.folders.map((folder) => [folder.id, folder.name]));
  return state.files
    .filter((file) => !file.deletedAt)
    .map((file) => ({ path: file.folderId ? `${folderName.get(file.folderId) || "folder"}/${file.name}` : file.name, content: file.content, revisions: file.revisions.length }));
}

export const STARTERS = {
  python3: "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    print(\"Hello from CodeSpace\", data)\n\nif __name__ == \"__main__\":\n    main()\n",
  nodejs: "const input = require(\"fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/);\nconsole.log(\"Hello from CodeSpace\", input);\n",
  java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        System.out.println(\"Hello from CodeSpace\");\n    }\n}\n",
  cpp17: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cout << \"Hello from CodeSpace\" << endl;\n    return 0;\n}\n",
  go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello from CodeSpace\")\n}\n",
};
