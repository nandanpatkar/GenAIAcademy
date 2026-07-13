---
title: Cursor CLI
date: 2026-04-03 12:00:00
background: bg-[#1a1a1a]
tags:
  - AI
  - CLI
  - agent
  - cursor
  - coding
categories:
  - AI
intro: |
  [Cursor CLI](https://cursor.com/docs/cli/overview) (`agent`) is the terminal interface for Cursor's AI coding agent — run agentic tasks, scripts, and CI pipelines from the command line.
plugins:
  - copyCode
---

## Getting Started

### Hello World {.row-span-2}

```bash
# Interactive agent session
$ agent

# One-shot prompt (print mode)
$ agent -p "List all TODO comments in this repo"

# Ask a question (read-only)
$ agent --mode=ask "How does auth work here?"

# Plan only (no edits)
$ agent --plan "Refactor the payment module"
```

### Install

#### macOS / Linux / WSL

```bash {.wrap}
$ curl https://cursor.com/install -fsS | bash
```

#### Windows (PowerShell)

```powershell {.wrap}
irm 'https://cursor.com/install?win32=true' | iex
```

#### Post-install

```bash
# Add to PATH if needed
export PATH="$HOME/.local/bin:$PATH"

# Verify
$ agent --version

# Update
$ agent update
```

### Key Concepts

| Concept     | Description                         |
| ----------- | ----------------------------------- |
| Agent mode  | Full access: read, write, run shell |
| Plan mode   | Read-only analysis, no edits        |
| Ask mode    | Q&A / explanations, read-only       |
| Cloud agent | Delegates to remote Cursor cloud    |
| Session     | Saved conversation with history     |
| Worktree    | Isolated git branch environment     |
| ACP         | Agent Client Protocol (JSON-RPC)    |
| MCP         | External tool/data integrations     |

## CLI Flags {.cols-2}

### Session & Mode {.row-span-2}

| Flag                 | Description                           |
| -------------------- | ------------------------------------- |
| `--mode=plan`        | Plan mode (read-only, no edits)       |
| `--mode=ask`         | Ask mode (Q&A, read-only)             |
| `--plan`             | Shorthand for `--mode=plan`           |
| `-p, --print`        | Headless/print mode (non-interactive) |
| `-c, --cloud`        | Start in cloud agent mode             |
| `--continue`         | Continue previous session             |
| `--resume [chatId]`  | Resume a specific session             |
| `-n, --name`         | Name for the session                  |
| `--workspace <path>` | Set workspace directory               |
| `--model <model>`    | Model to use (e.g., `sonnet-4`)       |
| `--list-models`      | List available models and exit        |

{.bold-first}

### Worktree & Sandbox

| Flag                    | Description                           |
| ----------------------- | ------------------------------------- |
| `-w, --worktree [name]` | Start in isolated git worktree        |
| `--worktree-base <ref>` | Branch/ref to base the worktree on    |
| `--skip-worktree-setup` | Skip `.cursor/worktrees.json` scripts |
| `--sandbox <mode>`      | `enabled` or `disabled`               |
| `--trust`               | Trust workspace without prompting     |
| `--approve-mcps`        | Auto-approve all MCP servers          |

{.bold-first}

### Output & Permissions

| Flag                      | Description                             |
| ------------------------- | --------------------------------------- |
| `--output-format <fmt>`   | `text` \| `json` \| `stream-json`       |
| `--stream-partial-output` | Stream text deltas (stream-json only)   |
| `-f, --force`             | Allow commands unless explicitly denied |
| `--yolo`                  | Alias for `--force`                     |
| `--api-key <key>`         | Auth key (or `CURSOR_API_KEY`)          |
| `-H, --header <h>`        | Custom request header (`Name: Value`)   |

{.bold-first}

## Commands {.cols-2}

### All Subcommands {.row-span-2}

| Command                             | Description                             |
| ----------------------------------- | --------------------------------------- |
| `agent [prompt]`                    | Start interactive or print session      |
| `agent ls`                          | List sessions to resume                 |
| `agent resume`                      | Resume latest chat session              |
| `agent login`                       | Authenticate with Cursor                |
| `agent logout`                      | Sign out and clear auth                 |
| `agent status`                      | View auth status / whoami               |
| `agent update`                      | Update to latest version                |
| `agent about`                       | Show version, system, account info      |
| `agent models`                      | List available models                   |
| `agent create-chat`                 | Create new empty chat, return ID        |
| `agent rule`                        | Generate new Cursor rule interactively  |
| `agent mcp`                         | Manage MCP servers                      |
| `agent mcp list`                    | List configured MCP servers             |
| `agent mcp list-tools <id>`         | List tools for a specific MCP server    |
| `agent mcp enable <id>`             | Add MCP server to approved list         |
| `agent mcp disable <id>`            | Disable an MCP server                   |
| `agent mcp login <id>`              | Authenticate with an MCP server         |
| `agent install-shell-integration`   | Install shell integration to `~/.zshrc` |
| `agent uninstall-shell-integration` | Remove shell integration                |
| `agent acp`                         | Start ACP server (JSON-RPC over stdio)  |

{.bold-first}

### Session Management

```bash
# List sessions to resume
$ agent ls

# Continue previous session
$ agent --continue

# Resume specific session by ID
$ agent --resume abc123

# Resume latest session
$ agent resume
```

### Auth & Account

```bash
$ agent login
$ agent logout
$ agent status     # or: agent whoami
$ agent about      # version + account info
$ agent models     # list available models
```

## Execution Modes {.cols-3}

### Agent Mode {.secondary}

Full agentic access — reads files, writes code, runs shell commands, and uses all tools.

```bash
$ agent
$ agent "Fix the bug in auth.ts"
```

Default mode when no `--mode` flag is given.

### Plan Mode

Read-only analysis. Proposes a plan without making any edits to the codebase.

```bash
$ agent --plan
$ agent --mode=plan "Refactor auth"
```

Cannot modify files or run commands.

### Ask Mode

Question & answer style. Explains code, answers questions — no edits, no shell.

```bash
$ agent --mode=ask
$ agent --mode=ask "How does caching work?"
```

Best for understanding code without risk.

## Headless & Scripting {.cols-2}

### Pipe & Script Usage {.row-span-2}

```bash
# Summarize a diff
$ git diff | agent -p "Summarize these changes"

# Review a file
$ cat src/auth.ts | agent -p "Find security issues"

# Process logs
$ tail -200 app.log | agent -p "Identify errors"

# Reference images in prompt
$ agent -p "Describe this diagram: /path/to/image.png"
```

Output formats:

```bash
# Plain text (default)
$ agent -p "task" --output-format text

# Full JSON response
$ agent -p "task" --output-format json

# Streaming JSON deltas
$ agent -p "task" --output-format stream-json

# Stream text chunks as they arrive
$ agent -p "task" --output-format stream-json \
    --stream-partial-output
```

### CI / CD Usage

```bash
# Allow all file modifications
$ agent -p "Update changelog" --force

# Run with API key from env
$ CURSOR_API_KEY=xxx agent -p "Run tests"

# Trusted workspace (skip prompts)
$ agent -p "Deploy" --trust

# Specific workspace directory
$ agent -p "Analyze" --workspace /repo
```

Batch processing:

```bash {.wrap}
for f in src/**/*.ts; do
  agent -p "Add JSDoc to $f" --force
done
```

## Worktrees {.cols-2}

### Isolated Environments {.row-span-2}

Worktrees create an isolated git branch at `~/.cursor/worktrees/<repo>/<name>` — keeping the main working tree clean.

```bash
# Auto-named worktree
$ agent -w

# Named worktree
$ agent -w feature-auth

# Worktree from specific branch
$ agent -w fix --worktree-base main

# Skip setup scripts
$ agent -w feature --skip-worktree-setup
```

Worktree config in `.cursor/worktrees.json`:

```json
{
  "setup": ["npm install", "cp .env.example .env"]
}
```

### Worktree Files

Control what's copied to a new worktree:

```
# .worktreeinclude (glob patterns)
.env
.env.local
secrets/
node_modules/
```

Files matching these patterns are copied from the main tree to the new worktree on creation.

## Shell Mode {.cols-2}

### Shell Execution

Shell mode runs in `$SHELL`. Navigate with `cd` chained to commands:

```bash
# Change directory then run
cd /my/project && agent "optimize this"

# Shell commands inside session
$ ls -la              # runs in $SHELL
$ npm test            # runs tests
$ git status          # git operations
```

Shell controls:

| Key      | Action                       |
| -------- | ---------------------------- |
| `Ctrl+C` | Cancel current shell command |
| `Ctrl+O` | Expand / view full output    |
| `Tab`    | Add command to allowlist     |

{.shortcuts}

### Shell Notes

- Each command runs in `$SHELL` (zsh/bash/fish)
- 30-second timeout per command
- `cd dir && cmd` for directory-specific commands
- Shell integration improves context awareness:

```bash
$ agent install-shell-integration
# adds hooks to ~/.zshrc
```

## MCP Servers {.cols-2}

### Configure MCP {.row-span-2}

User-level config at `~/.cursor/mcp.json`, project-level at `.cursor/mcp.json`:

#### stdio server (Node.js)

```json
{
  "mcpServers": {
    "my-tool": {
      "command": "npx",
      "args": ["-y", "my-mcp-server"],
      "env": { "API_KEY": "value" }
    }
  }
}
```

#### stdio server (Python)

```json
{
  "mcpServers": {
    "my-tool": {
      "command": "python",
      "args": ["-m", "my_mcp_server"]
    }
  }
}
```

#### HTTP / SSE server

```json
{
  "mcpServers": {
    "remote-tool": {
      "url": "https://my-server.com/mcp"
    }
  }
}
```

### MCP Commands

```bash
# List all configured servers
$ agent mcp list

# List tools for a server
$ agent mcp list-tools my-tool

# Approve a server
$ agent mcp enable my-tool

# Disable a server
$ agent mcp disable my-tool

# Authenticate with a server
$ agent mcp login my-tool

# Auto-approve all in session
$ agent --approve-mcps
```

## ACP Protocol {.cols-2}

### ACP Overview {.row-span-2}

ACP (Agent Client Protocol) exposes the Cursor agent as a JSON-RPC 2.0 server over **stdio**. Build custom IDE integrations or headless clients.

```bash
# Start ACP server
$ agent acp

# With API key
$ agent --api-key "$CURSOR_API_KEY" acp
```

**Request flow:**

```
initialize
authenticate (cursor_login)
session/new  or  session/load
session/prompt
  → session/update (streaming chunks)
  → session/request_permission (tool approval)
session/cancel  (optional)
```

Permission outcomes:

| Response       | Effect                   |
| -------------- | ------------------------ |
| `allow-once`   | Approve this time only   |
| `allow-always` | Always approve this tool |
| `reject-once`  | Deny this time only      |

### ACP Extension Methods

Cursor extension methods sent over ACP:

| Method                  | Type     | Purpose                |
| ----------------------- | -------- | ---------------------- |
| `cursor/ask_question`   | Blocking | Multiple-choice prompt |
| `cursor/create_plan`    | Blocking | Request plan approval  |
| `cursor/update_todos`   | Notify   | Update todo list state |
| `cursor/task`           | Notify   | Subagent task status   |
| `cursor/generate_image` | Notify   | Image generation event |

{.show-header}

Minimal Node.js client:

```js {.wrap}
const agent = spawn('agent', ['acp'], { stdio: ['pipe', 'pipe', 'inherit'] });
// send initialize → authenticate → session/new → session/prompt
```

**IDE integrations via ACP:**

- JetBrains (IntelliJ, WebStorm, PyCharm)
- Neovim via `avante.nvim` plugin
- Zed editor extensions
- Any editor with extension support

## Cloud Agents {.cols-2}

### Cloud Mode

Cloud agents run tasks remotely in Cursor's infrastructure. Use for long-running or parallel workloads.

```bash
# Launch cloud agent picker
$ agent -c
$ agent --cloud

# Cloud agent with a prompt
$ agent -c "Migrate all tests to Vitest"
```

Cloud agents support:

- Remote execution (no local resources)
- Parallel task delegation
- Longer-running workflows

### Subagent Types

When using ACP or cloud, subagents can be typed:

| Type                 | Description             |
| -------------------- | ----------------------- |
| `explore`            | Codebase exploration    |
| `browser_use`        | Web browser automation  |
| `computer_use`       | Desktop GUI actions     |
| `shell`              | Shell command execution |
| `video_review`       | Video content analysis  |
| `{ custom: "type" }` | Custom subagent type    |

## Also see {.cols-1}

- [Cursor CLI Docs](https://cursor.com/docs/cli/overview) _(cursor.com)_
- [ACP Protocol Docs](https://cursor.com/docs/cli/acp) _(cursor.com)_
- [Cursor Marketplace](https://cursor.com/marketplace) _(cursor.com)_
- [MCP Overview](https://cursor.com/docs/mcp) _(cursor.com)_
