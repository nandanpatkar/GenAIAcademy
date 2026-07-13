---
title: Grok CLI
date: 2026-04-03 14:00:00
background: bg-[#7c3aed]
tags:
  - grok
  - xai
  - ai
  - cli
categories:
  - AI
intro: |
  [Grok CLI](https://www.grokcli.dev/docs/) is a conversational AI terminal tool powered by X.AI's Grok models, with file operations, code analysis, Plan Mode, and MCP support.
plugins:
  - copyCode
---

## Getting Started {.cols-3}

### Quick Start {.row-span-2}

```bash
# Run immediately (no install)
$ GROK_API_KEY=your_key npx -y grok-cli-hurry-mode@latest

# Install globally
$ npm install -g grok-cli-hurry-mode@latest

# Start interactive session
$ grok

# Send initial message
$ grok "Help me understand this project"

# Headless / non-interactive mode
$ grok -p "explain the auth module"

# Use a specific model
$ grok -m grok-4-latest "refactor this file"

# Set working directory
$ grok -d /path/to/project

# Set max tool rounds
$ grok --max-tool-rounds 100 "rewrite the API"
```

### Authentication

| Method        | How                                               |
| ------------- | ------------------------------------------------- |
| Env variable  | `export GROK_API_KEY=your_key`                    |
| Inline (npx)  | `GROK_API_KEY=key npx grok-cli-hurry-mode@latest` |
| CLI flag      | `grok --api-key your_key`                         |
| Settings file | Set `apiKey` in `~/.grok/user-settings.json`      |

Get your API key from [console.x.ai](https://console.x.ai).

Persist in shell profile:

```bash
echo 'export GROK_API_KEY=your_key' >> ~/.zshrc
source ~/.zshrc
```

### Installation Methods

| Method            | Command                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| npm (recommended) | `npm install -g grok-cli-hurry-mode@latest`                                                           |
| npx (no install)  | `npx grok-cli-hurry-mode@latest`                                                                      |
| yarn              | `yarn global add grok-cli-hurry-mode@latest`                                                          |
| pnpm              | `pnpm add -g grok-cli-hurry-mode@latest`                                                              |
| bun               | `bun add -g grok-cli-hurry-mode@latest`                                                               |
| Auto script       | `curl -fsSL https://raw.githubusercontent.com/hinetapora/grok-cli-hurry-mode/main/install.sh \| bash` |

**Requirements:** Node.js (latest LTS), npm/yarn/pnpm, internet connection.

### AI Models

| Model              | Description                   |
| ------------------ | ----------------------------- |
| `grok-code-fast-1` | Default — optimized for code  |
| `grok-4-latest`    | Latest, enhanced capabilities |
| `grok-3-fast`      | Fast, general-purpose         |

Override with `-m`, `GROK_MODEL` env var, or `~/.grok/user-settings.json`.

Custom base URL: `-u https://api.x.ai/v1` or `GROK_BASE_URL`.

## CLI Options {.cols-2}

### All Options {.row-span-2}

| Option                  | Alias | Description                    |
| ----------------------- | ----- | ------------------------------ |
| `--api-key <key>`       | `-k`  | Grok API key                   |
| `--base-url <url>`      | `-u`  | API base URL                   |
| `--model <model>`       | `-m`  | Model to use                   |
| `--prompt <text>`       | `-p`  | Headless mode prompt           |
| `--directory <dir>`     | `-d`  | Set working directory          |
| `--max-tool-rounds <n>` |       | Max tool rounds (default: 400) |
| `--version`             | `-V`  | Show version                   |
| `--help`                | `-h`  | Show help                      |

**Environment variables:**

| Variable        | Purpose             |
| --------------- | ------------------- |
| `GROK_API_KEY`  | API key (required)  |
| `GROK_MODEL`    | Default model       |
| `GROK_BASE_URL` | Custom API endpoint |

### Subcommands

```bash
# AI-generated git commit and push
$ grok git commit-and-push
$ grok git commit-and-push -d /path/to/repo
$ grok git commit-and-push -m grok-4-latest

# MCP server management
$ grok mcp add <name>
$ grok mcp add-json <name> <json>
$ grok mcp remove <name>
$ grok mcp list
$ grok mcp test <name>
```

`git commit-and-push` accepts the same `-d`, `-k`, `-u`, `-m`, `--max-tool-rounds` flags as the main command.

## Interactive Mode {.cols-3}

### Keyboard Shortcuts {.row-span-2}

| Key               | Action                           |
| ----------------- | -------------------------------- |
| `Shift+Tab` twice | Enter Plan Mode                  |
| `Shift+Tab`       | Toggle auto-edit mode            |
| `Ctrl+I`          | Context tooltip (workspace info) |
| `Ctrl+C`          | Clear current input              |
| `Esc`             | Interrupt current operation      |
| `↑` / `↓`         | Browse input history             |

{.shortcuts}

**Auto-edit mode:** Hands-free file editing — the AI edits files without confirmation prompts.

**Context tooltip (`Ctrl+I`):** Shows project stats, git branch, memory pressure, and session info.

### Slash Commands

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `/help`              | Show available commands       |
| `/clear`             | Clear terminal screen         |
| `/models`            | List available models         |
| `/exit`              | Quit the application          |
| `/compact`           | Compress conversation context |
| `/commit-and-push`   | AI commit message and push    |
| `/init-agent`        | Initialize agent docs         |
| `/docs`              | Open documentation            |
| `/readme`            | Generate README               |
| `/api-docs`          | Generate API docs             |
| `/changelog`         | Generate changelog            |
| `/comments`          | Add code comments             |
| `/update-agent-docs` | Update agent docs             |
| `/heal`              | Self-healing system check     |
| `/guardrails`        | Show guardrails status        |

### Config Files

| File                         | Purpose                |
| ---------------------------- | ---------------------- |
| `~/.grok/user-settings.json` | Global user settings   |
| `.grok/settings.json`        | Project-level settings |
| `.grok/GROK.md`              | Project context for AI |

**user-settings.json example:**

```json
{
  "apiKey": "your_api_key",
  "model": "grok-code-fast-1",
  "baseURL": "https://api.x.ai/v1"
}
```

**Create project context:**

```bash
# Add custom context for Plan Mode
$ mkdir -p .grok
$ echo "# Project Rules" > .grok/GROK.md
```

## Tools {.cols-3}

### Core Tools {.row-span-2}

| Tool      | Purpose                                    |
| --------- | ------------------------------------------ |
| **Read**  | Read files — text, images, PDFs, notebooks |
| **Write** | Create or overwrite files                  |
| **Edit**  | Precise string find-and-replace            |
| **Bash**  | Execute shell commands                     |
| **Grep**  | Regex search via ripgrep                   |
| **Glob**  | File pattern matching                      |
| **LS**    | Directory listing                          |

**Read** supports line offset/limit for large files and displays images visually.

**Edit** supports:

- Exact string replacement
- Regex patterns
- Single or all-occurrence replacement

**Bash** supports:

- stdout/stderr capture
- Background processes
- Timeout management
- Environment variable handling

### Advanced Tools

| Tool          | Purpose                               |
| ------------- | ------------------------------------- |
| **MultiEdit** | Atomic multi-file edits with rollback |
| **WebFetch**  | Retrieve and parse web content        |
| **WebSearch** | Real-time web search                  |
| **Task**      | Delegate to specialized sub-agents    |
| **TodoWrite** | Task tracking and progress            |

**MultiEdit** operations: create, edit, delete, rename, move — all in one atomic transaction.

**Task** (sub-agent delegation):

- Token-optimized processing
- Complex research and analysis
- Autonomous completion with report

**WebFetch:** HTML → Markdown conversion with AI content extraction and caching.

### IDE Tools

| Tool             | Purpose                          |
| ---------------- | -------------------------------- |
| **NotebookEdit** | Edit Jupyter notebook cells      |
| **BashOutput**   | Stream background process output |
| **KillBash**     | Terminate background processes   |

The AI **automatically selects** the right tool combination for your request — no manual invocation needed.

## Plan Mode {.cols-3}

### Activating Plan Mode {.row-span-2}

Press **`Shift+Tab` twice** in quick succession:

```
🎯 Plan Mode: Analysis
📊 Exploring codebase and gathering insights...
```

**Or use headless mode:**

```bash {.wrap}
$ grok -p "analyze changes in this PR and create plan"
$ grok -p "check if changes follow architecture guidelines"
```

**What is blocked in Plan Mode:**

- All file write/edit operations
- Destructive bash commands
- Any state-modifying operations

**What is allowed:**

- Reading files (`ls`, `cat`, `grep`)
- Web search and fetch
- Project structure analysis
- Plan generation (writes only to plan output)

**Exit Plan Mode:**

- `Enter` — confirm and execute the plan
- `Esc` — exit without executing

### Plan Mode Phases

| Phase           | Duration        | What Happens                     |
| --------------- | --------------- | -------------------------------- |
| 🔍 Analysis     | 1–5 sec         | Project type, structure, deps    |
| 🧠 Strategy     | 5–15 sec        | AI generates implementation plan |
| 📋 Presentation | 1–2 sec         | Format plan for review           |
| ✅ Approval     | User-controlled | Review, confirm, or refine       |

{.show-header}

Plan Mode analyzes: project type (Node/Python/React/etc.), directory structure, key components, dependencies, entry points, modules, and architectural patterns.

### Plan Mode Tips

Use Plan Mode for:

- Complex multi-file features
- Large-scale refactoring
- Exploring unfamiliar codebases
- Risk assessment before changes

**Tips:**

- Be specific about what you want
- Review the plan before approving
- Use `/heal` if something breaks
- Create `.grok/GROK.md` for custom context

## MCP Servers {.cols-2}

### Managing MCP Servers {.row-span-2}

```bash
# Add stdio server
$ grok mcp add myserver \
  -t stdio \
  -c npx \
  -a -y my-mcp-package

# Add HTTP/SSE server
$ grok mcp add myserver \
  -t http \
  -u https://api.example.com/mcp

# Add with env vars and headers
$ grok mcp add myserver \
  -t http \
  -u https://api.example.com/mcp \
  -e API_KEY=secret \
  -h Authorization="Bearer token"

# Add from raw JSON
$ grok mcp add-json myserver \
  '{"transport":{"type":"stdio","command":"npx","args":["-y","pkg"]}}'

# List all servers
$ grok mcp list

# Test connection
$ grok mcp test myserver

# Remove a server
$ grok mcp remove myserver
```

### MCP Config Schema

**In `.grok/settings.json`:**

```json
{
  "mcpServers": [
    {
      "name": "my-server",
      "transport": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "my-mcp-package"],
        "env": { "KEY": "value" }
      }
    },
    {
      "name": "remote-server",
      "transport": {
        "type": "http",
        "url": "https://api.example.com/mcp",
        "headers": { "Authorization": "Bearer $TOKEN" }
      }
    }
  ]
}
```

**Transport types:**

| Type              | When to Use                |
| ----------------- | -------------------------- |
| `stdio`           | Local subprocess (default) |
| `http`            | Remote HTTP endpoint       |
| `sse`             | Server-Sent Events         |
| `streamable_http` | Streaming HTTP             |

### Add Server Options

| Option               | Alias | Description                          |
| -------------------- | ----- | ------------------------------------ |
| `--transport <type>` | `-t`  | stdio / http / sse / streamable_http |
| `--command <cmd>`    | `-c`  | Executable (stdio only)              |
| `--args [args...]`   | `-a`  | Command arguments (stdio only)       |
| `--url <url>`        | `-u`  | Server URL (http/sse)                |
| `--headers [kv...]`  | `-h`  | HTTP headers (`key=value`)           |
| `--env [kv...]`      | `-e`  | Env vars (`key=value`)               |

## Troubleshooting {.cols-3}

### Common Issues {.row-span-2}

**API key not found:**

```bash
# Verify env var is set
$ echo $GROK_API_KEY

# Or set inline
$ GROK_API_KEY=key grok "hello"
```

**Command not found after install:**

```bash {.wrap}
# Add npm global bin to PATH
$ echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
$ source ~/.zshrc
$ which grok
```

**Permission errors on install:**

```bash
# Use sudo (not recommended) or node version manager
$ npm install -g grok-cli-hurry-mode --force

# Or use nvm/fnm without sudo
$ nvm use --lts
$ npm install -g grok-cli-hurry-mode
```

**Stuck / cached installation:**

```bash
$ pkill -f grok
$ npm uninstall -g grok-cli-hurry-mode
$ npm cache clean --force
$ npm install -g grok-cli-hurry-mode@latest
```

### Useful Env Vars

| Variable        | Description            |
| --------------- | ---------------------- |
| `GROK_API_KEY`  | API key (required)     |
| `GROK_MODEL`    | Override default model |
| `GROK_BASE_URL` | Custom API endpoint    |

**Default API endpoint:** `https://api.x.ai/v1`

### Git Smart Push

The automated release system creates version bump commits, so always use smart push to avoid conflicts:

```bash
# Correct — handles auto version bumps
$ npm run smart-push
$ git pushup

# Wrong — causes "fetch first" errors
$ git push origin main
```

## Also see {.cols-1}

- [Official Documentation](https://www.grokcli.dev/docs/) _(grokcli.dev)_
- [Plan Mode Guide](https://www.grokcli.dev/docs/guides/plan-mode) _(grokcli.dev)_
- [Tools Overview](https://www.grokcli.dev/docs/tools/overview) _(grokcli.dev)_
- [Architecture Overview](https://www.grokcli.dev/docs/architecture/overview) _(grokcli.dev)_
- [GitHub Repository](https://github.com/hinetapora/grok-cli-hurry-mode) _(github.com)_
- [xAI API Console](https://console.x.ai) _(console.x.ai)_
