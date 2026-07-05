import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ClientId = 'claude' | 'cursor' | 'windsurf';

interface ClientOption {
  id: ClientId;
  label: string;
  configPath: string;
  hint: string;
}

const CLIENTS: ClientOption[] = [
  {
    id: 'claude',
    label: 'Claude Desktop',
    configPath: '~/Library/Application Support/Claude/claude_desktop_config.json',
    hint: 'Edit the JSON, restart Claude, open the tool picker.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    configPath: '~/.cursor/mcp.json',
    hint: 'Settings → MCP → enable flow-design after saving.',
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    configPath: '~/.codeium/windsurf/mcp_config.json',
    hint: 'Cascade refreshes available tools on next prompt.',
  },
];

interface ToolGroup {
  label: string;
  tools: { name: string; desc: string }[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    label: 'Author',
    tools: [
      { name: 'validate_openflow_dsl', desc: 'Lint and validate agent-authored DSL' },
      { name: 'create_viewer_url', desc: 'Turn DSL into a shareable Flow Designer link' },
    ],
  },
  {
    label: 'Inspect',
    tools: [
      { name: 'analyze_codebase', desc: 'Summarize codebase structure for diagramming' },
      { name: 'find_icon', desc: 'Find exact cloud and developer icon slugs' },
    ],
  },
  {
    label: 'Discover',
    tools: [
      { name: 'list_starter_templates', desc: 'List available diagram templates' },
      { name: 'get_starter_template', desc: 'Fetch a specific template by name' },
      { name: 'list_diagram_node_types', desc: 'List supported node types and shapes' },
      { name: 'server_info', desc: 'Server version and capability info' },
    ],
  },
];

function buildConfig(): string {
  return JSON.stringify(
    {
      mcpServers: {
        'flow-design': {
          command: 'npx',
          args: ['-y', '@genai-roadmap/flow-design-mcp'],
        },
      },
    },
    null,
    2,
  );
}

function CopyButton({ value, ariaLabel }: { value: string; ariaLabel: string }): React.ReactElement {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-brand-border)] bg-[var(--brand-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--brand-secondary)] transition-colors hover:text-[var(--brand-text)] hover:border-[var(--brand-primary)]/40"
    >
      {copied ? <Check className="h-3 w-3 text-[var(--brand-primary)]" /> : <Copy className="h-3 w-3" />}
      <span className="tracking-wide">
        {copied ? t('mcpSettings.copied', 'Copied') : t('mcpSettings.copy', 'Copy')}
      </span>
    </button>
  );
}

function CodeSurface({
  code,
  ariaLabel,
  caption,
  wrap = false,
}: {
  code: string;
  ariaLabel: string;
  caption?: React.ReactNode;
  wrap?: boolean;
}): React.ReactElement {
  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--color-brand-border)] bg-[var(--brand-background)]">
      <div className="flex items-center justify-between border-b border-[var(--color-brand-border)]/60 px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-secondary)]">
          {caption ?? 'shell'}
        </span>
        <CopyButton value={code} ariaLabel={ariaLabel} />
      </div>
      <pre
        className={`px-3 py-2.5 text-[12px] leading-relaxed text-[var(--brand-text)] font-mono ${
          wrap ? 'whitespace-pre-wrap break-words' : 'overflow-x-auto'
        }`}
      >
        {code}
      </pre>
    </div>
  );
}

function StepRail({
  index,
  title,
  children,
  isLast,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}): React.ReactElement {
  return (
    <div className="relative grid grid-cols-[28px_1fr] gap-4">
      <div className="flex flex-col items-center">
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-brand-border)] bg-[var(--brand-surface)] text-[11px] font-bold text-[var(--brand-text)]"
        >
          {index}
        </span>
        {!isLast ? (
          <span aria-hidden className="mt-1 w-px flex-1 bg-[var(--color-brand-border)]" />
        ) : null}
      </div>
      <div className="min-w-0 pb-7">
        <h4 className="text-[13px] font-semibold tracking-tight text-[var(--brand-text)]">
          {title}
        </h4>
        <div className="mt-2 space-y-3">{children}</div>
      </div>
    </div>
  );
}

interface MCPSettingsProps {
  /** 'page' hides the intro header (the standalone page supplies its own); 'panel' is the in-Settings tab. */
  variant?: 'page' | 'panel';
}

export function MCPSettings({ variant = 'panel' }: MCPSettingsProps = {}): React.ReactElement {
  const { t } = useTranslation();
  const [client, setClient] = useState<ClientId>('claude');
  const installCmd = 'npx -y @genai-roadmap/flow-design-mcp';
  const config = buildConfig();
  const activeClient = CLIENTS.find((c) => c.id === client) ?? CLIENTS[0];

  return (
    <div className="space-y-8">
      {variant === 'panel' ? (
        <header className="rounded-xl border border-[var(--color-brand-border)] bg-[var(--brand-background)]/60 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            {t('mcpSettings.eyebrow', 'Model Context Protocol')}
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-[var(--brand-text)]">
            {t('mcpSettings.title', 'Connect AI tools (MCP)')}
          </h3>
          <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-[var(--brand-secondary)]">
            {t(
              'mcpSettings.intro',
              'Add the Flow Designer MCP server to Claude Desktop, Cursor, Windsurf, or any MCP client. Your assistant uses its own model to author diagrams, while Flow Designer supplies local validation, templates, icon lookup, codebase analysis, and viewer links.',
            )}
          </p>
        </header>
      ) : null}

      <ol className="list-none" aria-label={t('mcpSettings.stepsLabel', 'Setup steps')}>
        <StepRail index={1} title={t('mcpSettings.installHeading', 'Install the server')}>
          <p className="text-[12px] text-[var(--brand-secondary)]">
            {t('mcpSettings.installNote', 'Requires Node 18+. No global install needed — npx fetches on demand.')}
          </p>
          <CodeSurface
            code={installCmd}
            ariaLabel={t('mcpSettings.copyInstall', 'Copy install command')}
            caption="npm"
          />
        </StepRail>

        <StepRail index={2} title={t('mcpSettings.configHeading', 'Add to your AI assistant')}>
          <div
            role="tablist"
            aria-label={t('mcpSettings.clientPicker', 'AI assistant')}
            className="inline-flex w-full rounded-lg border border-[var(--color-brand-border)] bg-[var(--brand-background)] p-1"
          >
            {CLIENTS.map((c) => {
              const selected = c.id === client;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="mcp-config-block"
                  onClick={() => setClient(c.id)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                    selected
                      ? 'bg-[var(--brand-surface)] text-[var(--brand-text)] shadow-sm'
                      : 'text-[var(--brand-secondary)] hover:text-[var(--brand-text)]'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          <div
            id="mcp-config-block"
            role="tabpanel"
            aria-label={activeClient.label}
            className="space-y-2"
          >
            <p className="text-[12px] text-[var(--brand-secondary)]">
              {t('mcpSettings.configPathLabel', 'Add to')}{' '}
              <code className="rounded bg-[var(--brand-background)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--brand-text)]">
                {activeClient.configPath}
              </code>
            </p>
            <p className="text-[12px] text-[var(--brand-secondary)]">
              {activeClient.hint}{' '}
              {t(
                'mcpSettings.keysNote',
                'No API keys needed. Your AI client already has the model; this server adds diagram-specific tools.',
              )}
            </p>
          </div>
          <CodeSurface
            code={config}
            ariaLabel={t('mcpSettings.copyConfig', 'Copy MCP config')}
            caption="json"
          />
        </StepRail>

        <StepRail index={3} title={t('mcpSettings.toolsHeading', 'Tools your assistant will use')}>
          <p className="text-[12px] text-[var(--brand-secondary)]">
            {t('mcpSettings.toolsIntro', 'These are the capabilities your AI assistant gains. It picks one automatically based on your request.')}
          </p>
          <div className="divide-y divide-[var(--color-brand-border)] overflow-hidden rounded-lg border border-[var(--color-brand-border)] bg-[var(--brand-surface)]">
            {TOOL_GROUPS.map((group) => (
              <section key={group.label} className="grid grid-cols-1 sm:grid-cols-[140px_1fr]">
                <header className="border-b border-[var(--color-brand-border)] bg-[var(--brand-background)]/40 px-4 py-3 sm:border-b-0 sm:border-r">
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--brand-text)]">
                    {group.label}
                  </h5>
                  <p className="mt-0.5 text-[10.5px] text-[var(--brand-secondary)]">
                    {group.tools.length} {group.tools.length === 1 ? 'tool' : 'tools'}
                  </p>
                </header>
                <ul className="divide-y divide-[var(--color-brand-border)]/60">
                  {group.tools.map((tool) => (
                    <li key={tool.name} className="grid grid-cols-1 gap-0.5 px-4 py-2.5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-3">
                      <code className="text-[11.5px] font-semibold text-[var(--brand-text)] font-mono">
                        {tool.name}
                      </code>
                      <span className="text-[11.5px] text-[var(--brand-secondary)]">
                        {tool.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </StepRail>

        <StepRail index={4} title={t('mcpSettings.tryItHeading', 'Try it with a prompt')} isLast>
          <p className="text-[12px] text-[var(--brand-secondary)]">
            {t(
              'mcpSettings.tryItIntro',
              'Paste these into your AI assistant. The install prompt asks an agentic client (Cursor, Claude Code, Windsurf) to write the config for you; the test prompt verifies the connection.',
            )}
          </p>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-text)]">
                  {t('mcpSettings.installPromptLabel', 'Install prompt')}
                </h5>
                <span className="text-[10.5px] text-[var(--brand-secondary)]">
                  {t('mcpSettings.installPromptHint', 'For Cursor / Claude Code / Windsurf agents')}
                </span>
              </div>
              <CodeSurface
                code={`Add an MCP server called "flow-design" to ${activeClient.configPath}. Use this entry exactly:\n\n${config}\n\nAfter saving, tell me to restart ${activeClient.label}.`}
                ariaLabel={t('mcpSettings.copyInstallPrompt', 'Copy install prompt')}
                caption="prompt"
                wrap
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-text)]">
                  {t('mcpSettings.testPromptLabel', 'Test prompt')}
                </h5>
                <span className="text-[10.5px] text-[var(--brand-secondary)]">
                  {t('mcpSettings.testPromptHint', 'Paste into any connected client')}
                </span>
              </div>
              <CodeSurface
                code={`Using the flow-design MCP server: read flow-design://docs/dsl-cheatsheet, then write an OpenFlow DSL flowchart for a checkout flow (cart → shipping → payment → apply promo code branch → confirm). Call validate_openflow_dsl on your output, fix any errors, then call create_viewer_url. Show me the final DSL and viewer URL.`}
                ariaLabel={t('mcpSettings.copyTestPrompt', 'Copy test prompt')}
                caption="prompt"
                wrap
              />
            </div>
          </div>
        </StepRail>
      </ol>

      <footer className="flex items-center justify-between gap-3 border-t border-[var(--color-brand-border)] pt-4">
        <p className="text-[12px] text-[var(--brand-secondary)]">
          {t('mcpSettings.footerNote', 'Need to debug a connection or build a custom client?')}
        </p>
        <a
          href="https://github.com/GenAIAcademy/flow-design/tree/main/mcp-server#readme"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--brand-primary)] hover:underline"
        >
          {t('mcpSettings.docsLink', 'Full MCP documentation')}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </footer>
    </div>
  );
}
