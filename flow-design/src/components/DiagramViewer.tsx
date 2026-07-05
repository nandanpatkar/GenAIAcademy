import React, { useEffect, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MarkerType,
    Position,
    ReactFlow,
    ReactFlowProvider,
    type NodeProps,
} from '@/lib/reactflowCompat';
import { AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { createFlowEditorOpenFlowDslRouteState } from '@/app/routeState';
import { parseDslOrThrow } from '@/hooks/ai-generation/graphComposer';
import { getElkLayout } from '@/services/elkLayout';
import { decodeDslFromViewerParam } from '@/services/viewerUrlCodec';
import { useWorkspaceDocumentActions } from '@/store/documentHooks';
import { OpenFlowLogo } from './icons/OpenFlowLogo';
import type { FlowNode, FlowEdge } from '@/lib/types';

type ParsedGraph = ReturnType<typeof parseDslOrThrow>;
type ViewerSize = 'badge' | 'card' | 'full';
type LayoutState =
    | { status: 'loading' }
    | { status: 'error'; error: string }
    | { status: 'ready'; nodes: FlowNode[]; edges: FlowEdge[] };

type ParsedViewerGraph = ParsedGraph & { dsl: string };

const VIEWER_NODE_WIDTH = 184;
const VIEWER_NODE_HEIGHT = 76;
const VIEWER_DECISION_SIZE = 150;

const VIEWER_NODE_TYPES = {
    viewer: ViewerNode,
};

function parseGraphFromSearch(search: string): ParsedViewerGraph | { parseError: string } {
    const encoded = new URLSearchParams(search).get('flow');
    if (!encoded) return { parseError: 'No diagram data in URL. Add ?flow=BASE64_DSL to the URL.' };
    let dsl: string;
    try {
        dsl = decodeDslFromViewerParam(encoded);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown decode error';
        return { parseError: `Could not decode diagram data. ${message}` };
    }
    try {
        return { ...parseDslOrThrow(dsl), dsl };
    } catch (err) {
        return { parseError: `DSL parse error: ${err instanceof Error ? err.message : String(err)}` };
    }
}

function parseViewerSize(search: string): ViewerSize {
    const size = new URLSearchParams(search).get('size');
    if (size === 'badge' || size === 'card') return size;
    return 'full';
}

function getViewerNodeDimensions(node: FlowNode): { width: number; height: number } {
    return node.data?.shape === 'diamond'
        ? { width: VIEWER_DECISION_SIZE, height: VIEWER_DECISION_SIZE }
        : { width: VIEWER_NODE_WIDTH, height: VIEWER_NODE_HEIGHT };
}

function prepareViewerNodes(nodes: FlowNode[]): FlowNode[] {
    return nodes.map((node) => {
        const dimensions = getViewerNodeDimensions(node);
        return {
            ...node,
            type: 'viewer',
            width: dimensions.width,
            height: dimensions.height,
            style: {
                ...node.style,
                width: dimensions.width,
                height: dimensions.height,
            },
            data: {
                ...node.data,
                viewerShape: node.data?.shape,
            },
        };
    });
}

function prepareViewerEdges(edges: FlowEdge[]): FlowEdge[] {
    return edges.map((edge) => ({
        ...edge,
        type: 'smoothstep',
        markerEnd: edge.markerEnd ?? { type: MarkerType.ArrowClosed },
        style: {
            stroke: '#64748b',
            strokeWidth: 1.8,
            ...edge.style,
        },
    }));
}

function ViewerNode({ data }: NodeProps): React.ReactElement {
    const label = typeof data.label === 'string' ? data.label : 'Untitled';
    const subLabel = typeof data.subLabel === 'string' ? data.subLabel : '';
    const shape = data.viewerShape === 'diamond' ? 'diamond' : 'rounded';
    const isDecision = shape === 'diamond';

    return (
        <div className="relative h-full w-full">
            <Handle id="top" type="source" position={Position.Top} className="opacity-0" />
            <Handle id="right" type="source" position={Position.Right} className="opacity-0" />
            <Handle id="bottom" type="source" position={Position.Bottom} className="opacity-0" />
            <Handle id="left" type="source" position={Position.Left} className="opacity-0" />
            <Handle id="top" type="target" position={Position.Top} className="opacity-0" />
            <Handle id="right" type="target" position={Position.Right} className="opacity-0" />
            <Handle id="bottom" type="target" position={Position.Bottom} className="opacity-0" />
            <Handle id="left" type="target" position={Position.Left} className="opacity-0" />
            <div
                className={[
                    'flex h-full w-full items-center justify-center border bg-white px-4 text-center shadow-sm',
                    isDecision
                        ? 'rotate-45 border-amber-300'
                        : 'rounded-lg border-slate-200',
                ].join(' ')}
            >
                <div className={isDecision ? '-rotate-45 max-w-[92px]' : 'max-w-[148px]'}>
                    <div className="truncate text-[13px] font-semibold leading-5 text-slate-900">
                        {label}
                    </div>
                    {subLabel ? (
                        <div className="mt-0.5 truncate text-[11px] leading-4 text-slate-500">
                            {subLabel}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function ViewerCanvas({
    nodes,
    edges,
    size,
}: {
    nodes: FlowNode[];
    edges: FlowEdge[];
    size: ViewerSize;
}): React.ReactElement {
    return (
        <ReactFlow
            nodes={prepareViewerNodes(nodes)}
            edges={prepareViewerEdges(edges)}
            nodeTypes={VIEWER_NODE_TYPES}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnScroll
            zoomOnScroll
            zoomOnPinch
            minZoom={0.2}
            maxZoom={1.6}
            fitView
            fitViewOptions={{ padding: size === 'badge' ? 0.16 : size === 'card' ? 0.18 : 0.2 }}
            className="bg-slate-50"
        >
            <Background variant={BackgroundVariant.Dots} gap={22} size={size === 'badge' ? 1 : 1.4} color="#cbd5e1" />
            {size === 'full' ? <Controls showInteractive={false} /> : null}
        </ReactFlow>
    );
}

function DiagramViewerInner(): React.ReactElement {
    const location = useLocation();
    const navigate = useNavigate();
    const { createDocument } = useWorkspaceDocumentActions();
    const viewerSize = parseViewerSize(location.search);

    // Parse synchronously once on mount via lazy initializer — no effect needed.
    const [parsed] = useState<ParsedViewerGraph | { parseError: string }>(() =>
        parseGraphFromSearch(location.search)
    );

    const [layoutState, setLayoutState] = useState<LayoutState>(() =>
        'parseError' in parsed
            ? { status: 'error', error: parsed.parseError }
            : { status: 'loading' }
    );

    // Run layout asynchronously — only when parse succeeded.
    useEffect(() => {
        if ('parseError' in parsed) return;
        getElkLayout(prepareViewerNodes(parsed.nodes), prepareViewerEdges(parsed.edges), {
            source: 'import',
            direction: 'LR',
            spacing: 'normal',
        })
            .then(({ nodes, edges }) => {
                setLayoutState({ status: 'ready', nodes, edges });
            })
            .catch((err: unknown) => {
                setLayoutState({ status: 'error', error: `Layout failed: ${err instanceof Error ? err.message : String(err)}` });
            });
    }, [parsed]);

    function handleOpenInEditor(): void {
        if ('parseError' in parsed) {
            return;
        }

        const documentId = createDocument();
        navigate(`/flow/${documentId}`, {
            state: createFlowEditorOpenFlowDslRouteState(parsed.dsl),
        });
    }

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
            {viewerSize !== 'badge' ? (
                <div className={`flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur ${viewerSize === 'card' ? 'h-10' : 'h-12'}`}>
                    <div className="flex items-center gap-2">
                        <OpenFlowLogo className="h-5 w-5 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-700">
                            {viewerSize === 'card' ? 'Flow Designer Viewer' : 'Flow Designer'}
                        </span>
                    </div>
                    <button
                        onClick={handleOpenInEditor}
                        disabled={'parseError' in parsed}
                        className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:text-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ExternalLink className="h-3 w-3" />
                        Open in Editor
                    </button>
                </div>
            ) : (
                <div className="flex h-7 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    <span>Flow Designer</span>
                    <span>Badge Viewer</span>
                </div>
            )}

            <div className="relative min-h-0 flex-1">
                {layoutState.status === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-secondary)]" />
                    </div>
                )}
                {layoutState.status === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="flex max-w-sm flex-col items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                            <p className="text-sm font-medium text-amber-800">Could not render diagram</p>
                            <p className="text-xs text-amber-600">{layoutState.error}</p>
                        </div>
                    </div>
                )}
                {layoutState.status === 'ready' && (
                    <ViewerCanvas nodes={layoutState.nodes} edges={layoutState.edges} size={viewerSize} />
                )}
            </div>
        </div>
    );
}

export function DiagramViewer(): React.ReactElement {
    return (
        <ReactFlowProvider>
            <DiagramViewerInner />
        </ReactFlowProvider>
    );
}
