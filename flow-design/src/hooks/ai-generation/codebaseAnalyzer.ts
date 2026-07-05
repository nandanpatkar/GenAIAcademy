import {
  buildFileTree,
  shouldIncludeFile,
  detectLanguage,
  parseImports,
  parseTsConfigAliases,
  resolveAliasImport,
} from './codebaseParser';
import {
  ENTRY_POINT_PATTERNS,
  resolveRelativeImport,
  tryResolvePath,
} from './codebaseAnalyzer/pathResolution';
import {
  detectCloudPlatform,
  detectInfraFiles,
  detectServices,
} from './codebaseAnalyzer/serviceDetection';
import { buildSummary } from './codebaseAnalyzer/summary';
import type {
  CodebaseAnalysis,
  CodebaseFile,
  DependencyEdge,
} from './codebaseAnalyzer/types';

export type {
  CloudPlatform,
  CodebaseAnalysis,
  CodebaseFile,
  DependencyEdge,
  DetectedService,
  DetectedServiceProvider,
  DetectedServiceType,
  SuggestedArchitectureResourceType,
  SuggestedNodeColor,
} from './codebaseAnalyzer/types';

export function analyzeCodebase(
  rawFiles: Array<{ path: string; content: string }>,
  maxFiles = 500
): CodebaseAnalysis {
  const tsconfigContent = rawFiles.find(
    (f) => f.path === 'tsconfig.json' || f.path === 'jsconfig.json'
  )?.content;
  const packageJsonContent = rawFiles.find((f) => f.path === 'package.json')?.content;
  const aliases = parseTsConfigAliases(tsconfigContent ?? null, packageJsonContent ?? null);

  const filteredFiles = rawFiles
    .filter((f) => shouldIncludeFile(f.path) && !f.path.endsWith('.json'))
    .slice(0, maxFiles);

  const allPaths = new Set(filteredFiles.map((f) => f.path));

  const files: CodebaseFile[] = filteredFiles.map((f) => {
    const language = detectLanguage(f.path);
    const imports = parseImports(f.content, language, aliases);
    return { path: f.path, content: f.content, language, imports };
  });

  const edges: DependencyEdge[] = [];
  for (const file of files) {
    for (const imp of file.imports) {
      let resolved: string | null = null;
      if (imp.isLocal && imp.source.startsWith('.')) {
        resolved = resolveRelativeImport(file.path, imp.source);
      } else if (imp.isLocal) {
        resolved = resolveAliasImport(imp.source, aliases);
      }
      if (!resolved) continue;
      const target = tryResolvePath(resolved, allPaths);
      if (target && target !== file.path) {
        edges.push({ from: file.path, to: target });
      }
    }
  }

  const entryPoints = files
    .filter((f) => ENTRY_POINT_PATTERNS.some((p) => p.test(f.path)))
    .map((f) => f.path);

  const languages: Record<string, number> = {};
  for (const file of files) {
    if (file.language) {
      languages[file.language] = (languages[file.language] ?? 0) + 1;
    }
  }

  const dirSet = new Set<string>();
  for (const file of files) {
    const parts = file.path.split('/');
    for (let i = 1; i < parts.length; i++) {
      dirSet.add(parts.slice(0, i).join('/'));
    }
  }

  const tree = buildFileTree(files.map((f) => f.path));
  const cloudPlatform = detectCloudPlatform(rawFiles);
  const detectedServices = detectServices(rawFiles);
  const infraFiles = detectInfraFiles(rawFiles);
  const summary = buildSummary(
    files,
    edges,
    entryPoints,
    tree,
    languages,
    dirSet.size,
    cloudPlatform,
    detectedServices,
    infraFiles
  );

  return {
    files,
    edges,
    entryPoints,
    cloudPlatform,
    detectedServices,
    infraFiles,
    stats: {
      totalFiles: rawFiles.length,
      sourceFiles: files.length,
      languages,
      directories: dirSet.size,
    },
    summary,
  };
}
