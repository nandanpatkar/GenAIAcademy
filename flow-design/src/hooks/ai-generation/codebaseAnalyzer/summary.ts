import type { DirectoryNode } from '../codebaseParser';
import type {
  CloudPlatform,
  CodebaseFile,
  DependencyEdge,
  DetectedService,
} from './types';

interface DirInfo {
  path: string;
  fileCount: number;
}

function countFilesInNode(node: DirectoryNode): number {
  let count = node.files.length;
  for (const child of node.children.values()) {
    count += countFilesInNode(child);
  }
  return count;
}

function getTopDirectories(tree: DirectoryNode): DirInfo[] {
  const dirs: DirInfo[] = [];
  for (const [name, child] of tree.children) {
    dirs.push({ path: name, fileCount: countFilesInNode(child) });
  }
  return dirs.sort((a, b) => b.fileCount - a.fileCount);
}

export function buildSummary(
  files: CodebaseFile[],
  edges: DependencyEdge[],
  entryPoints: string[],
  tree: DirectoryNode,
  languages: Record<string, number>,
  dirCount: number,
  cloudPlatform: CloudPlatform,
  detectedServices: DetectedService[],
  infraFiles: string[]
): string {
  const lines: string[] = [];

  const langSummary = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => `${lang}: ${count}`)
    .join(', ');

  lines.push(`CODEBASE STRUCTURE`);
  lines.push(`Files: ${files.length} source files across ${dirCount} directories`);
  lines.push(`Languages: ${langSummary}`);
  lines.push(`Detected platform: ${cloudPlatform}`);
  lines.push('');

  if (detectedServices.length > 0) {
    lines.push('DETECTED SERVICES:');
    for (const service of detectedServices.slice(0, 12)) {
      const evidence = service.evidence.length > 0 ? ` — ${service.evidence.join(', ')}` : '';
      const iconHint =
        service.iconPackId && service.iconShapeId
          ? ` icon=${service.iconPackId}:${service.iconShapeId}`
          : '';
      lines.push(
        `  ${service.name} [${service.type}] via ${service.provider} -> ${service.resourceType}/${service.suggestedColor}${iconHint}${evidence}`
      );
    }
    lines.push('');
  }

  if (infraFiles.length > 0) {
    lines.push('INFRA FILES:');
    for (const infraFile of infraFiles.slice(0, 12)) {
      lines.push(`  ${infraFile}`);
    }
    lines.push('');
  }

  if (entryPoints.length > 0) {
    lines.push('ENTRY POINTS:');
    for (const ep of entryPoints.slice(0, 10)) {
      lines.push(`  ${ep}`);
    }
    lines.push('');
  }

  const depCounts = new Map<string, { incoming: number; outgoing: number }>();
  for (const edge of edges) {
    const from = depCounts.get(edge.from) ?? { incoming: 0, outgoing: 0 };
    from.outgoing++;
    depCounts.set(edge.from, from);
    const to = depCounts.get(edge.to) ?? { incoming: 0, outgoing: 0 };
    to.incoming++;
    depCounts.set(edge.to, to);
  }

  const hotFiles = [...depCounts.entries()]
    .filter(([, counts]) => counts.incoming >= 2)
    .sort((a, b) => b[1].incoming - a[1].incoming)
    .slice(0, 10);

  if (hotFiles.length > 0) {
    lines.push('KEY MODULES (most depended-on):');
    for (const [path, counts] of hotFiles) {
      lines.push(`  ${path} (${counts.incoming} dependents)`);
    }
    lines.push('');
  }

  const topDirs = getTopDirectories(tree);
  if (topDirs.length > 0) {
    lines.push('TOP-LEVEL STRUCTURE:');
    for (const dir of topDirs.slice(0, 15)) {
      lines.push(`  ${dir.path}/ — ${dir.fileCount} files`);
    }
    lines.push('');
  }

  if (edges.length > 0) {
    lines.push('DEPENDENCY GRAPH (local imports only):');
    const grouped = new Map<string, string[]>();
    for (const edge of edges.slice(0, 100)) {
      const dir = edge.from.split('/').slice(0, -1).join('/') || '/';
      if (!grouped.has(dir)) grouped.set(dir, []);
      grouped.get(dir)!.push(`  ${edge.from} → ${edge.to}`);
    }
    for (const [dir, deps] of grouped) {
      lines.push(`[${dir}]`);
      for (const dep of deps.slice(0, 5)) {
        lines.push(dep);
      }
    }
  }

  return lines.join('\n');
}
