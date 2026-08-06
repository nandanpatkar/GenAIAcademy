OpenWiki is an open source CLI that writes and maintains a Markdown wiki about your codebase or personal knowledge. The wiki captures details such as architecture, integrations, evals, and workflows so [coding agents](lc:oss/python/deepagents/overview) can use it as durable context instead of rediscovering the repository on every task.

That makes agent work faster and cheaper in tokens: agents read a curated wiki first, then inspect source only where they need more detail. Humans can browse the same Markdown (and the local [visualizer](https://docs.langchain.com/oss/openwiki/visualize)), but the primary audience is agents.

OpenWiki is built on [Deep Agents](lc:oss/python/deepagents/overview) and supports tracing with [LangSmith](lc:langsmith/observability-quickstart).

## Get started

Install the CLI, then initialize documentation for the current repository:

```bash
npm install -g openwiki
openwiki --init
```

See the [Quickstart](lc:oss/openwiki/quickstart) to choose a model provider, generate docs, and keep them up to date.

## Modes

OpenWiki has two modes:

| Mode | Command | Output | Use when |
| --- | --- | --- | --- |
| **Code** (default) | `openwiki` / `openwiki code` | `openwiki/` in the current repository | You want repository context and documentation for coding agents |
| **Personal** | `openwiki personal` | `~/.openwiki/wiki` | You want a local personal brain from configured sources |

Bare `openwiki --init` and `openwiki --update` run in code mode. Use `openwiki personal --init` or `openwiki personal --update` for the personal wiki.

## Capabilities

    ### [Repository wikis](#)
Generate Markdown docs under `openwiki/`, then wire them into `AGENTS.md` and `CLAUDE.md` so coding agents can find them.

    ### [Personal brain](#)
Build a local wiki from git repos, Gmail, Notion, web search, Hacker News, and X/Twitter.

    ### [Automatic updates](#)
Refresh docs from GitHub Actions, GitLab CI, or Bitbucket Pipelines and open a PR when content changes.

    ### [Model providers](#)
Use OpenAI, Anthropic, Gemini, Bedrock, OpenRouter, GitHub Copilot, and other providers out of the box.

    ### [Open Knowledge Format](#)
Emit OKF v0.1 Markdown bundles with front matter, indexes, and linked concepts.

    ### [LangSmith tracing](#)
Trace documentation runs with LangSmith.

## Next steps

    ### [Quickstart](#)
Install OpenWiki, configure a provider, and generate your first wiki.

    ### [CLI reference](#)
Review commands, flags, and connector subcommands.
