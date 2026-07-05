export const ENTRY_POINT_PATTERNS = [
  /^index\.[jt]sx?$/,
  /^main\.[jt]sx?$/,
  /^app\.[jt]sx?$/,
  /^main\.py$/,
  /^app\.py$/,
  /^main\.go$/,
  /^cmd\//,
  /^src\/index\.[jt]sx?$/,
  /^src\/main\.[jt]sx?$/,
  /^src\/app\.[jt]sx?$/,
];

export function resolveRelativeImport(fromPath: string, importSource: string): string | null {
  if (!importSource.startsWith('.')) return null;
  const dir = fromPath.split('/').slice(0, -1).join('/');
  const resolved = [...dir.split('/').filter(Boolean), ...importSource.split('/').filter(Boolean)];
  const normalized: string[] = [];
  for (const part of resolved) {
    if (part === '..') normalized.pop();
    else if (part !== '.') normalized.push(part);
  }
  return normalized.join('/');
}

export function tryResolvePath(path: string, allFiles: Set<string>): string | null {
  const extensions = [
    '',
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '/index.ts',
    '/index.tsx',
    '/index.js',
  ];
  for (const ext of extensions) {
    const candidate = path + ext;
    if (allFiles.has(candidate)) return candidate;
  }
  return null;
}
