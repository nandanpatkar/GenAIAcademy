import type { Position } from '@/lib/reactflowCompat';

export interface MinimalEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface MinimalNode {
  id: string;
  position?: { x: number; y: number };
  positionAbsolute?: { x: number; y: number };
  width?: number;
  height?: number;
  data?: {
    shape?: string;
  };
}

export interface EdgePathParams {
  id: string;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
}

export type EdgeVariant = 'bezier' | 'smoothstep' | 'step' | 'straight';
export type LoopDirection = 'right' | 'top' | 'left' | 'bottom';

// Re-export curve taxonomy so consumers depending on this types module can
// reach it without a new import path.
export type { EdgeCurve } from './edgeCurve';

export interface EdgePathOptions {
  forceOrthogonal?: boolean;
  mermaidPreservedEndpoints?: boolean;
  mermaidSourceContainer?: boolean;
  mermaidTargetContainer?: boolean;
  elkPoints?: { x: number; y: number }[];
  importRoutePoints?: { x: number; y: number }[];
  importRoutePath?: string;
  mindmapBranchKind?: 'root' | 'branch';
  routingMode?: 'auto' | 'elk' | 'manual' | 'import-fixed';
  waypoints?: { x: number; y: number }[];
  waypoint?: {
    x: number;
    y: number;
  };
  /** Overrides the visual curve interpolation. Falls back to `variant` mapping when unset. */
  curve?: import('./edgeCurve').EdgeCurve;
}

export interface SelfLoopResult {
  path: string;
  labelX: number;
  labelY: number;
}

export interface EdgePathResult {
  edgePath: string;
  labelX: number;
  labelY: number;
}
