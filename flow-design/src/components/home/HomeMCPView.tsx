import React from 'react';
import { useTranslation } from 'react-i18next';
import { MCPFlowVisual } from './MCPFlowVisual';
import { MCPSettings } from '../SettingsModal/MCPSettings';

export function HomeMCPView(): React.ReactElement {
    const { t } = useTranslation();

    return (
        <div className="flex-1 animate-in overflow-y-auto px-4 py-6 duration-300 fade-in sm:px-6 md:px-10 md:py-12">
            <div className="mb-8 max-w-3xl">
                <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--brand-text)]">
                    {t('mcp.pageTitle', 'Connect AI tools')}
                </h1>
                <p className="text-sm text-[var(--brand-secondary)]">
                    {t(
                        'mcp.pageSubtitle',
                        'Give Claude, Cursor, Windsurf, or any MCP client first-class diagramming tools. Local-first, no API key, no cloud round-trip.'
                    )}
                </p>
            </div>

            <div className="mb-10 md:mb-12">
                <MCPFlowVisual />
            </div>

            <MCPSettings variant="page" />
        </div>
    );
}
