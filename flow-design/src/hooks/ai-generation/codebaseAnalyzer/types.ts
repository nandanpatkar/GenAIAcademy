import type { SupportedLanguage } from '../codeToArchitecture';
import type { FileImport } from '../codebaseParser';

export interface CodebaseFile {
  path: string;
  content: string;
  language: SupportedLanguage | null;
  imports: FileImport[];
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export type CloudPlatform = 'aws' | 'gcp' | 'azure' | 'cncf' | 'docker' | 'mixed' | 'unknown';

export type DetectedServiceType =
  | 'database'
  | 'cache'
  | 'queue'
  | 'api'
  | 'compute'
  | 'storage'
  | 'identity'
  | 'network'
  | 'observability'
  | 'service'
  | 'messaging';

export type DetectedServiceProvider =
  | 'aws'
  | 'gcp'
  | 'azure'
  | 'cncf'
  | 'docker'
  | 'third-party'
  | 'unknown';

export type SuggestedArchitectureResourceType =
  | 'service'
  | 'database'
  | 'queue'
  | 'cdn'
  | 'dns'
  | 'load_balancer'
  | 'firewall';

export type SuggestedNodeColor =
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'red'
  | 'slate'
  | 'pink'
  | 'yellow';

export interface DetectedService {
  name: string;
  type: DetectedServiceType;
  provider: DetectedServiceProvider;
  resourceType: SuggestedArchitectureResourceType;
  suggestedColor: SuggestedNodeColor;
  iconPackId?: string;
  iconShapeId?: string;
  evidence: string[];
}

export interface CodebaseAnalysis {
  files: CodebaseFile[];
  edges: DependencyEdge[];
  entryPoints: string[];
  cloudPlatform: CloudPlatform;
  detectedServices: DetectedService[];
  infraFiles: string[];
  stats: {
    totalFiles: number;
    sourceFiles: number;
    languages: Record<string, number>;
    directories: number;
  };
  summary: string;
}
