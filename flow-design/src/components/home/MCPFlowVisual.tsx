import React from 'react';
import { useTranslation } from 'react-i18next';

interface ToolNode {
    id: string;
    label: string;
    cy: number;
    wire: string;
    delay: string;
}

const CORE = { x: 380, y: 150, r: 46 };
const CLIENT_WIRE = 'M242 150 L334 150';

const TOOLS: ToolNode[] = [
    { id: 'validate', label: 'validate_dsl', cy: 74, wire: 'M426 150 C 488 150 500 74 556 74', delay: '0s' },
    { id: 'template', label: 'get_template', cy: 120, wire: 'M426 150 C 488 150 508 120 556 120', delay: '0.5s' },
    { id: 'icon', label: 'find_icon', cy: 166, wire: 'M426 150 C 488 150 508 166 556 166', delay: '1s' },
    { id: 'viewer', label: 'viewer_url', cy: 212, wire: 'M426 150 C 488 150 500 212 556 212', delay: '1.5s' },
];

/**
 * Animated schematic of the MCP exchange: an AI client talks to the Flow Design
 * core over stdio, which fans out to local diagramming tools. Motion is gated on
 * prefers-reduced-motion; the static frame still reads as a complete topology.
 */
export function MCPFlowVisual(): React.ReactElement {
    const { t } = useTranslation();

    return (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-brand-border)] bg-[var(--brand-background)]">
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(var(--color-brand-border)_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.35]"
            />
            <div
                aria-hidden
                className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[var(--brand-primary)] opacity-[0.06] blur-3xl"
            />

            <style>{mcpFlowStyles}</style>

            <svg
                viewBox="0 0 760 300"
                className="relative block h-[240px] w-full sm:h-[280px] md:h-[320px]"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={t(
                    'mcp.visualAlt',
                    'Your AI client connects to the Flow Designer MCP server over stdio, which provides local diagramming tools.'
                )}
            >
                {/* connection wires (static spine) */}
                <path d={CLIENT_WIRE} className="mcpflow-wire" />
                {TOOLS.map((tool) => (
                    <path key={`wire-${tool.id}`} d={tool.wire} className="mcpflow-wire" />
                ))}

                {/* request / response packets on the stdio wire */}
                <circle r="3.6" className="mcpflow-packet mcpflow-req" style={{ offsetPath: `path('${CLIENT_WIRE}')` }} />
                <circle r="3.6" className="mcpflow-packet mcpflow-req" style={{ offsetPath: `path('${CLIENT_WIRE}')`, animationDelay: '1.2s' }} />
                <circle r="3.6" className="mcpflow-packet mcpflow-res" style={{ offsetPath: `path('${CLIENT_WIRE}')`, animationDelay: '0.6s' }} />

                {/* invoke packets fanning out to each tool */}
                {TOOLS.map((tool) => (
                    <circle
                        key={`pkt-${tool.id}`}
                        r="3.2"
                        className="mcpflow-packet mcpflow-tool"
                        style={{ offsetPath: `path('${tool.wire}')`, animationDelay: tool.delay }}
                    />
                ))}

                {/* AI client */}
                <g className="mcpflow-client">
                    <rect x="34" y="112" width="202" height="76" rx="16" className="mcpflow-node" />
                    <circle cx="66" cy="150" r="16" className="mcpflow-client-badge" />
                    <path
                        d="M66 140 l2.6 5.4 6 0.9 -4.3 4.2 1 6 -5.3 -2.8 -5.3 2.8 1 -6 -4.3 -4.2 6 -0.9 z"
                        className="mcpflow-spark"
                    />
                    <text x="94" y="147" className="mcpflow-label-strong">{t('mcp.visualClient', 'Your AI client')}</text>
                    <text x="94" y="164" className="mcpflow-label-sub">Claude · Cursor · Windsurf</text>
                </g>

                {/* stdio label */}
                <text x="288" y="140" className="mcpflow-wire-label">stdio</text>

                {/* Flow Design core */}
                <g className="mcpflow-core">
                    <circle cx={CORE.x} cy={CORE.y} r={CORE.r + 8} className="mcpflow-core-halo" />
                    <circle cx={CORE.x} cy={CORE.y} r={CORE.r} className="mcpflow-core-ring" />
                    <image
                        href="/favicon.svg"
                        x={CORE.x - 26}
                        y={CORE.y - 26}
                        width="52"
                        height="52"
                        preserveAspectRatio="xMidYMid meet"
                    />
                    <text x={CORE.x} y={CORE.y + CORE.r + 22} className="mcpflow-core-label">Flow Designer</text>
                </g>

                {/* tools */}
                {TOOLS.map((tool) => (
                    <g key={`chip-${tool.id}`} className="mcpflow-chip" style={{ animationDelay: tool.delay }}>
                        <circle cx="556" cy={tool.cy} r="3" className="mcpflow-port" />
                        <rect x="556" y={tool.cy - 17} width="166" height="34" rx="9" className="mcpflow-node" />
                        <text x="574" y={tool.cy + 4} className="mcpflow-tool-label">{tool.label}</text>
                    </g>
                ))}
            </svg>

            <p className="absolute bottom-3 left-4 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                {t('mcp.visualCaption', 'Local · stdio · no API key')}
            </p>
        </div>
    );
}

const mcpFlowStyles = `
.mcpflow-wire { fill: none; stroke: var(--color-brand-border); stroke-width: 1.5; }
.mcpflow-node { fill: var(--brand-surface); stroke: var(--color-brand-border); stroke-width: 1.5; }
.mcpflow-client-badge { fill: color-mix(in srgb, var(--brand-primary), transparent 88%); }
.mcpflow-spark { fill: var(--brand-primary); }
.mcpflow-label-strong { fill: var(--brand-text); font-size: 13px; font-weight: 650; }
.mcpflow-label-sub { fill: var(--brand-secondary); font-size: 10.5px; font-weight: 500; }
.mcpflow-wire-label { fill: var(--brand-secondary); font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; text-anchor: middle; }
.mcpflow-core-halo { fill: color-mix(in srgb, var(--brand-primary), transparent 90%); }
.mcpflow-core-ring { fill: var(--brand-surface); stroke: var(--brand-primary); stroke-width: 2; }
.mcpflow-core-mark { fill: var(--brand-primary); }
.mcpflow-core-label { fill: var(--brand-text); font-size: 12px; font-weight: 700; text-anchor: middle; }
.mcpflow-port { fill: var(--brand-primary); }
.mcpflow-tool-label { fill: var(--brand-text); font-size: 12px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.mcpflow-packet { opacity: 0; }
.mcpflow-req { fill: var(--brand-secondary); }
.mcpflow-res { fill: var(--brand-primary); }
.mcpflow-tool { fill: var(--brand-primary); }

@media (prefers-reduced-motion: no-preference) {
  .mcpflow-packet { offset-rotate: 0deg; animation: mcpflow-travel 2.4s linear infinite; }
  .mcpflow-res { animation-direction: reverse; }
  .mcpflow-tool { animation-duration: 2s; }
  .mcpflow-core-halo { transform-box: fill-box; transform-origin: center; animation: mcpflow-breathe 3.4s ease-in-out infinite; }
  .mcpflow-chip { animation: mcpflow-wake 2s ease-in-out infinite; }
}

@keyframes mcpflow-travel {
  0% { offset-distance: 0%; opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}
@keyframes mcpflow-breathe {
  0%, 100% { opacity: 0.5; transform: scale(0.94); }
  50% { opacity: 1; transform: scale(1.06); }
}
@keyframes mcpflow-wake {
  0%, 60%, 100% { opacity: 0.78; }
  20% { opacity: 1; }
}
`;
