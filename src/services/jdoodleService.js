/**
 * jdoodleService.js — client for the /api/execute JDoodle proxy.
 *
 * Credentials live only on the server (Vercel env vars); this file just
 * maps languages and posts the script.
 */

// UI language options shown in the Run dropdown.
// `versionIndex` values are JDoodle's latest-at-time-of-writing indices.
export const RUN_LANGUAGES = [
  { id: 'python3', label: 'Python 3', versionIndex: '5', ext: 'py', monaco: 'python' },
  { id: 'nodejs',  label: 'JavaScript (Node)', versionIndex: '4', ext: 'js', monaco: 'javascript' },
  { id: 'java',    label: 'Java', versionIndex: '5', ext: 'java', monaco: 'java' },
  { id: 'cpp17',   label: 'C++ (17)', versionIndex: '1', ext: 'cpp', monaco: 'cpp' },
  { id: 'go',      label: 'Go', versionIndex: '4', ext: 'go', monaco: 'go' },
];

// Map a filename extension to a run language (or null if unsupported).
const EXT_MAP = {
  py: 'python3',
  js: 'nodejs',
  mjs: 'nodejs',
  cjs: 'nodejs',
  jsx: 'nodejs',
  java: 'java',
  cpp: 'cpp17',
  cc: 'cpp17',
  cxx: 'cpp17',
  h: 'cpp17',
  hpp: 'cpp17',
  go: 'go',
};

export const languageForFilename = (filename = '') => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return EXT_MAP[ext] || null;
};

export const getLanguageOption = (id) =>
  RUN_LANGUAGES.find(l => l.id === id) || null;

/**
 * Execute code via the serverless proxy.
 * @returns { output, statusCode, memory, cpuTime } or throws Error.
 */
export const executeCode = async ({ script, language, versionIndex, stdin = '' }) => {
  const opt = getLanguageOption(language);
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      script,
      language,
      versionIndex: versionIndex || opt?.versionIndex || '0',
      stdin,
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Runner returned an unreadable response (HTTP ${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data?.error || `Execution failed (HTTP ${res.status})`);
  }
  return data;
};
