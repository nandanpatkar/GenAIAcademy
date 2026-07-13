---
title: Gemini CLI
date: 2026-04-03 12:00:00
background: bg-[#1a73e8]
tags:
  - gemini
  - ai
  - cli
  - google
categories:
  - AI
intro: |
  [Gemini CLI](https://geminicli.com/docs/) brings Google Gemini models directly into your terminal for code understanding, task automation, and workflow building.
plugins:
  - copyCode
---

## Getting Started {.cols-3}

### Quick Start {.row-span-2}

```bash
# Install globally
$ npm install -g @google/gemini-cli

# Or via Homebrew
$ brew install gemini-cli

# Or run without installing
$ npx @google/gemini-cli

# Launch interactive session
$ gemini

# Non-interactive (headless)
$ gemini -p "summarize README.md"

# Pipe content to Gemini
$ cat logs.txt | gemini -p "find errors"

# Run prompt and continue interactively
$ gemini -i "explain this project"

# Resume most recent session
$ gemini -r latest

# Resume with new prompt
$ gemini -r latest "check for type errors"
```

### Authentication

| Method          | How                                        |
| --------------- | ------------------------------------------ |
| Google Account  | Run `gemini`, select "Sign in with Google" |
| API Key         | Set `GEMINI_API_KEY` env var               |
| Vertex AI (ADC) | `gcloud auth application-default login`    |
| Vertex AI (SA)  | Set `GOOGLE_APPLICATION_CREDENTIALS`       |

Vertex AI also requires `GOOGLE_CLOUD_PROJECT` and `GOOGLE_CLOUD_LOCATION`.

### Installation Methods

| Method           | Command                             |
| ---------------- | ----------------------------------- |
| npm              | `npm install -g @google/gemini-cli` |
| Homebrew         | `brew install gemini-cli`           |
| MacPorts         | `sudo port install gemini-cli`      |
| npx (no install) | `npx @google/gemini-cli`            |

**System requirements:** Node.js 20+, macOS 15+, Windows 11 24H2+, or Ubuntu 20.04+

### Model Aliases

| Alias        | Model                         | Use For           |
| ------------ | ----------------------------- | ----------------- |
| `auto`       | gemini-2.5-pro / gemini-3-pro | Default, balanced |
| `pro`        | gemini-2.5-pro / gemini-3-pro | Complex reasoning |
| `flash`      | gemini-2.5-flash              | Fast, balanced    |
| `flash-lite` | gemini-2.5-flash-lite         | Simple, fastest   |

{.show-header}

Set with `-m flash` or `GEMINI_MODEL` env var.

### Key Concepts

| Concept     | Description                                     |
| ----------- | ----------------------------------------------- |
| `GEMINI.md` | Project context file loaded automatically       |
| Skills      | On-demand expertise loaded via `activate_skill` |
| Extensions  | Bundles of prompts, MCP servers, tools          |
| MCP Servers | External tools via Model Context Protocol       |
| Plan Mode   | Read-only mode for planning before coding       |
| Hooks       | Scripts that run at key agent lifecycle points  |
| Headless    | Non-interactive mode via `-p` flag              |
| Sessions    | Saved conversation history, resumable           |

## CLI Options {.cols-2}

### Core Options {.row-span-2}

| Option                       | Alias | Description                                               |
| ---------------------------- | ----- | --------------------------------------------------------- |
| `--prompt <text>`            | `-p`  | Non-interactive prompt                                    |
| `--prompt-interactive`       | `-i`  | Prompt then continue                                      |
| `--model <name>`             | `-m`  | Model to use                                              |
| `--worktree [name]`          | `-w`  | Start in new git worktree                                 |
| `--sandbox`                  | `-s`  | Enable sandboxed execution                                |
| `--approval-mode <mode>`     |       | default / auto_edit / yolo / plan                         |
| `--yolo`                     | `-y`  | Auto-approve all (deprecated, use `--approval-mode=yolo`) |
| `--resume <id>`              | `-r`  | Resume session by ID or `latest`                          |
| `--list-sessions`            |       | List sessions and exit                                    |
| `--delete-session <n>`       |       | Delete session by index                                   |
| `--output-format <fmt>`      | `-o`  | text / json / stream-json                                 |
| `--extensions <list>`        | `-e`  | Extensions to load                                        |
| `--list-extensions`          | `-l`  | List extensions and exit                                  |
| `--include-directories`      |       | Additional workspace dirs                                 |
| `--allowed-mcp-server-names` |       | Restrict MCP server names                                 |
| `--screen-reader`            |       | Enable accessibility mode                                 |
| `--acp`                      |       | Start in ACP (Agent Code Pilot) mode                      |
| `--debug`                    | `-d`  | Verbose debug logging                                     |
| `--version`                  | `-v`  | Show version                                              |
| `--help`                     | `-h`  | Show help                                                 |

### Subcommands

```bash
# MCP server management
$ gemini mcp add <name> <cmd-or-url>
$ gemini mcp remove <name>
$ gemini mcp list
$ gemini mcp enable <name>
$ gemini mcp disable <name>

# Extension management
$ gemini extensions install <source>
$ gemini extensions uninstall <name>
$ gemini extensions list
$ gemini extensions update [name] [--all]
$ gemini extensions enable/disable <name>
$ gemini extensions link <path>
$ gemini extensions new <path>

# Skills management
$ gemini skills list [--all]
$ gemini skills install <source>
$ gemini skills link <path>
$ gemini skills uninstall <name>
$ gemini skills enable/disable <name>

# Hooks
$ gemini hooks migrate
```

### Headless Output Formats

| Format        | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `text`        | Plain text (default)                                                        |
| `json`        | Single JSON object with `response` and `stats`                              |
| `stream-json` | JSONL: `init` · `message` · `tool_use` · `tool_result` · `error` · `result` |

**Exit codes:** `0` Success · `1` Error · `42` Bad input · `53` Turn limit exceeded

## Interactive Commands {.cols-3}

### Slash Commands `/` {.row-span-3}

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `/help`              | Show all commands               |
| `/quit` `/exit`      | Exit Gemini CLI                 |
| `/clear`             | Clear terminal screen           |
| `/about`             | Show version info               |
| `/auth`              | Change authentication           |
| `/model`             | Set / manage model              |
| `/settings`          | Open settings editor            |
| `/theme`             | Change visual theme             |
| `/vim`               | Toggle vim mode                 |
| `/plan [goal]`       | Enter Plan Mode                 |
| `/compress`          | Compress chat context           |
| `/copy`              | Copy last output to clipboard   |
| `/init`              | Generate GEMINI.md for project  |
| `/docs`              | Open documentation              |
| `/bug`               | File a GitHub issue             |
| `/stats`             | Session / model / tools stats   |
| `/tools`             | List available tools            |
| `/memory show`       | Show all context files          |
| `/memory add <text>` | Add to global GEMINI.md         |
| `/memory reload`     | Reload context files            |
| `/resume`            | Browse & resume sessions        |
| `/rewind`            | Rewind conversation history     |
| `/restore`           | Restore pre-tool file state     |
| `/hooks list`        | List configured hooks           |
| `/mcp list`          | List MCP servers                |
| `/mcp reload`        | Restart MCP servers             |
| `/skills list`       | List available skills           |
| `/extensions list`   | List extensions                 |
| `/permissions trust` | Trust current folder            |
| `/policies list`     | List active policies            |
| `/directory add`     | Add workspace directory         |
| `/ide status`        | IDE integration status          |
| `/shells`            | Toggle background shells        |
| `/terminal-setup`    | Configure multiline keybindings |
| `/setup-github`      | Setup GitHub Actions            |

Reload commands: `/skills reload`, `/agents reload`, `/commands reload`, `/memory reload`, `/mcp reload`, `/extensions reload`

### At Commands `@`

Include file or directory content in your prompt:

```bash
# Include a file
@src/main.ts fix the bug on line 42

# Include a directory
@src/ what does this module do?

# Include multiple paths
@package.json @src/ audit dependencies
```

Git-aware: respects `.gitignore` for directory inclusion.

### Shell Mode `!`

```bash
# Run a single shell command
!ls -la

# Toggle persistent shell mode
!

# Shell output injected into context
!git diff HEAD~1
```

`GEMINI_CLI=1` is set in all shell subprocesses.

## Keyboard Shortcuts {.cols-3}

### Cursor & Editing {.row-span-2}

| Key                   | Action                  |
| --------------------- | ----------------------- |
| `Ctrl+A` / `Home`     | Move to line start      |
| `Ctrl+E` / `End`      | Move to line end        |
| `Ctrl+←` / `Alt+B`    | Move word left          |
| `Ctrl+→` / `Alt+F`    | Move word right         |
| `Ctrl+K`              | Delete to end of line   |
| `Ctrl+U`              | Delete to start of line |
| `Ctrl+W` / `Alt+Bksp` | Delete word left        |
| `Alt+D`               | Delete word right       |
| `Backspace`           | Delete left             |
| `Delete` / `Ctrl+D`   | Delete right            |
| `Cmd+Z`               | Undo                    |
| `Ctrl+Shift+Z`        | Redo                    |

{.shortcuts}

### Text Input

| Key              | Action                 |
| ---------------- | ---------------------- |
| `Enter`          | Submit message         |
| `Ctrl/Cmd+Enter` | Insert newline         |
| `Tab`            | Queue message          |
| `Ctrl+X`         | Open external editor   |
| `Ctrl+V`         | Paste                  |
| `Ctrl+R`         | Reverse history search |
| `Ctrl+P`         | Previous history entry |
| `Ctrl+N`         | Next history entry     |

{.shortcuts}

### App Controls

| Key         | Action                    |
| ----------- | ------------------------- |
| `Shift+Tab` | Cycle approval modes      |
| `Ctrl+T`    | Toggle todos panel        |
| `Alt+M`     | Toggle markdown rendering |
| `Ctrl+Y`    | Toggle YOLO mode          |
| `Ctrl+L`    | Clear screen              |
| `Ctrl+Z`    | Suspend process           |
| `F12`       | Show error details        |
| `Esc` twice | Open rewind dialog        |
| `Ctrl+C`    | Cancel / quit             |
| `Ctrl+D`    | Exit                      |

{.shortcuts}

## Sessions & History {.cols-3}

### Session Management {.row-span-2}

```bash
# List all sessions
$ gemini --list-sessions

# Resume most recent
$ gemini -r latest

# Resume specific session
$ gemini -r <session-id>

# Delete by index
$ gemini --delete-session 3
```

**Inside the `/resume` browser:**

- `↑↓` to navigate sessions
- `Enter` to resume selected session
- `x` to delete a session
- Search by typing

### Rewind Workflow

`/rewind` or press `Esc` twice to open the rewind dialog:

| Option          | Effect                              |
| --------------- | ----------------------------------- |
| Rewind + Revert | Reset chat history AND file changes |
| Rewind only     | Reset chat history, keep files      |
| Revert only     | Restore files, keep chat history    |
| Do nothing      | Cancel (Esc)                        |

Applies only to AI-made file changes, not manual edits or `!` shell commands.

### Fork a Conversation

Save and restore named checkpoints to explore multiple approaches:

```bash
# 1. Save current state
/resume save my-decision-point

# 2. Try approach A...

# 3. Restore to saved state
/resume resume my-decision-point

# 4. Try approach B...
```

## Context & Memory {.cols-3}

### GEMINI.md Hierarchy {.row-span-2}

Context files are loaded in this order (all merged):

| Priority           | Location                       |
| ------------------ | ------------------------------ |
| 1. Global          | `~/.gemini/GEMINI.md`          |
| 2. Parent dirs     | Scanned up from workspace      |
| 3. Workspace       | `.gemini/GEMINI.md`            |
| 4. JIT (on-demand) | Scanned when tools access dirs |

```markdown
# Importing other files inside GEMINI.md

@./docs/architecture.md
@./docs/conventions.md
```

Customize the filename via `context.fileName` in `settings.json` (can be an array: `["AGENTS.md", "GEMINI.md"]`).

### Memory Commands

```bash
# Show all loaded context
/memory show

# Force reload all context files
/memory reload

# Append text to global GEMINI.md
/memory add "Always use TypeScript strict mode"

# Generate project GEMINI.md
/init
```

### Ignoring Files

Create `.geminiignore` in project root (follows `.gitignore` syntax):

```gitignore
# Exclude a directory
/packages/

# Exclude specific files
apikeys.txt
*.log

# Exclude all .md except README
*.md
!README.md
```

Files are hidden from CLI tools but remain visible to Git and other services.

## MCP Servers {.cols-2}

### MCP Config {.row-span-2}

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "my-mcp-package"],
      "env": { "API_KEY": "$MY_API_KEY" },
      "timeout": 30000,
      "trust": false,
      "includeTools": ["tool1", "tool2"],
      "excludeTools": ["dangerous-tool"]
    },
    "remote-server": {
      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer $TOKEN" }
    }
  }
}
```

Env vars support `$VAR`, `${VAR}`, and `%VAR%` (Windows) expansion.

Tool FQN pattern: `mcp_{serverName}_{toolName}`

### Managing Servers

```bash {.wrap}
# Add stdio server
$ gemini mcp add myserver npx -y my-mcp-package

# Add HTTP server
$ gemini mcp add myserver https://api.example.com/mcp

# Add with options
$ gemini mcp add myserver cmd --transport http --trust --timeout 30000

# List all servers
$ gemini mcp list

# Remove a server
$ gemini mcp remove myserver

# Enable / disable
$ gemini mcp enable myserver
$ gemini mcp disable myserver --session
```

### MCP Server Config Fields

| Field          | Description                             |
| -------------- | --------------------------------------- |
| `command`      | Executable for stdio transport          |
| `args`         | Arguments array                         |
| `url`          | URL for SSE transport                   |
| `httpUrl`      | URL for Streamable HTTP                 |
| `env`          | Environment variables                   |
| `cwd`          | Working directory                       |
| `timeout`      | Connection timeout (ms, default 600000) |
| `trust`        | Skip confirmation for all tools         |
| `includeTools` | Whitelist specific tools                |
| `excludeTools` | Blacklist specific tools                |

### MCP Resources

Reference MCP resources in prompts:

```bash
# Reference a resource
@server://resource/path summarize this

# Slash commands from MCP prompts
/prompt-name --arg=value
```

## Extensions & Skills {.cols-3}

### Managing Extensions {.row-span-2}

```bash
# Install from GitHub
$ gemini extensions install https://github.com/org/ext

# Install from local path
$ gemini extensions install ./my-extension

# List installed
$ gemini extensions list

# Update all
$ gemini extensions update --all

# Update specific
$ gemini extensions update my-ext

# Enable / disable
$ gemini extensions enable my-ext
$ gemini extensions disable my-ext --scope user

# Link for development
$ gemini extensions link ./dev-extension

# Create new extension
$ gemini extensions new ./my-new-ext

# Validate structure
$ gemini extensions validate ./my-ext
```

Extensions bundle: prompts, MCP servers, custom commands, themes, hooks, subagents, and skills.

### Agent Skills

Skills provide on-demand expertise — loaded only when `activate_skill` is called.

**Discovery locations (precedence):**

| Tier      | Path                                       |
| --------- | ------------------------------------------ |
| Workspace | `.gemini/skills/` or `.agents/skills/`     |
| User      | `~/.gemini/skills/` or `~/.agents/skills/` |
| Extension | Bundled within extension                   |

```bash
# List all skills
$ gemini skills list --all

# Install from Git or local
$ gemini skills install https://github.com/org/skill
$ gemini skills install ./local-skill

# Link for development
$ gemini skills link ./my-skill

# Enable / disable
$ gemini skills enable my-skill
$ gemini skills disable my-skill
```

### Custom Commands

Save reusable prompts as slash commands.

**File locations:**

- User: `~/.gemini/commands/`
- Project: `.gemini/commands/`

```toml
# .gemini/commands/git/commit.toml
description = "Generate commit message"
prompt = """
Generate a conventional commit message for:

!{git diff --staged}

{{args}}
"""
```

Command becomes `/git:commit`. Subdirectory `/` → `:` namespace.

**Placeholders:**
| Placeholder | Meaning |
|---|---|
| `{{args}}` | Inject user arguments |
| `!{cmd}` | Execute shell, inject output |
| `@{path}` | Embed file content |

## Plan Mode {.cols-3}

### Enabling Plan Mode {.row-span-2}

```bash
# One-time via flag
$ gemini --approval-mode=plan

# Natural language trigger
> let's plan the refactor first

# Slash command
/plan redesign the auth module

# Cycle modes with Shift+Tab during session
```

Set as default in `settings.json`:

```json
{
  "general": {
    "defaultApprovalMode": "plan"
  }
}
```

### Plan Mode Tools

**Read-only (always available):**

- `read_file`, `list_directory`, `glob`
- `grep_search`, `google_web_search`
- `web_fetch` (with confirmation)
- `codebase_investigator`, `cli_help`
- `ask_user`

**Write (restricted):**

- `write_file`, `replace` — only for `.md` files inside plans directory

**Memory:**

- `save_memory`, `activate_skill`

### Plan Mode Workflow

```
1. Set goal
   └─ natural language or /plan <goal>

2. Discuss strategy
   └─ Gemini may ask clarifying questions

3. Review plan
   └─ Markdown file written to plans dir
   └─ Ctrl+X to edit in external editor

4. Approve or iterate

5. Switch to YOLO/auto_edit to implement
```

Auto model routing: Pro during planning → Flash during implementation.

## Configuration {.cols-2}

### Settings File Locations {.row-span-2}

| Scope            | Path                                      |
| ---------------- | ----------------------------------------- |
| User             | `~/.gemini/settings.json`                 |
| Project          | `.gemini/settings.json`                   |
| System (Linux)   | `/etc/gemini-cli/settings.json`           |
| System (macOS)   | `/Library/Application Support/GeminiCli/` |
| System (Windows) | `C:\ProgramData\gemini-cli\settings.json` |

{.no-wrap}

**Precedence (highest wins):**
CLI args → env vars → system settings → project settings → user settings → system defaults

**Common settings:**

```json
{
  "general": {
    "defaultApprovalMode": "default",
    "checkpointing": { "enabled": true }
  },
  "ui": {
    "theme": "dark"
  },
  "model": {
    "name": "auto"
  },
  "tools": {
    "sandbox": "docker"
  }
}
```

Open the visual editor with `/settings`.

### Key Environment Variables

| Variable                         | Purpose                                           |
| -------------------------------- | ------------------------------------------------- |
| `GEMINI_API_KEY`                 | Gemini API authentication                         |
| `GEMINI_MODEL`                   | Default model override                            |
| `GEMINI_CLI_HOME`                | Override config directory                         |
| `GOOGLE_CLOUD_PROJECT`           | Vertex AI project                                 |
| `GOOGLE_CLOUD_LOCATION`          | Vertex AI region                                  |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account JSON path                         |
| `GOOGLE_API_KEY`                 | Google Cloud API key                              |
| `GEMINI_SANDBOX`                 | Sandbox type: `true`, `docker`, `podman`, `runsc` |
| `GEMINI_SYSTEM_MD`               | Path to system prompt file                        |
| `NO_COLOR`                       | Disable colored output                            |
| `CLI_TITLE`                      | Override terminal window title                    |

Persist in `~/.bashrc`, `~/.zshrc`, or `.gemini/.env`.

### Sandboxing Options

| Method          | Platform           | How to Enable                          |
| --------------- | ------------------ | -------------------------------------- |
| macOS Seatbelt  | macOS only         | `GEMINI_SANDBOX=sandbox-exec`          |
| Docker/Podman   | Cross-platform     | `--sandbox` or `GEMINI_SANDBOX=docker` |
| gVisor (runsc)  | Linux only         | `GEMINI_SANDBOX=runsc`                 |
| LXC/LXD         | Linux experimental | `GEMINI_SANDBOX=lxc`                   |
| Windows Sandbox | Windows only       | `GEMINI_SANDBOX=true`                  |

{.show-header}

## Hooks {.cols-2}

### Hook Events {.row-span-3}

| Event                 | When                   | Can Block?        |
| --------------------- | ---------------------- | ----------------- |
| `SessionStart`        | Session begins         | No (advisory)     |
| `SessionEnd`          | Session ends           | No (best effort)  |
| `BeforeAgent`         | Before planning starts | Yes (exit 2)      |
| `AfterAgent`          | Agent loop ends        | Yes (force retry) |
| `BeforeModel`         | Before LLM call        | Yes (exit 2)      |
| `AfterModel`          | After each LLM chunk   | Yes (exit 2)      |
| `BeforeToolSelection` | Before tool choice     | Filter tools      |
| `BeforeTool`          | Before tool runs       | Yes (exit 2)      |
| `AfterTool`           | After tool runs        | Yes (hide result) |
| `PreCompress`         | Before compression     | No (advisory)     |
| `Notification`        | System notifications   | No                |

**Exit codes:** `0` = success · `2` = block/critical · other = warning

**Hook config in `settings.json`:**

```json
{
  "hooks": {
    "BeforeTool": [
      {
        "type": "command",
        "command": "~/.gemini/hooks/validate-tool.sh",
        "matcher": "write_file",
        "timeout": 10000
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "command": "echo '{\"systemMessage\": \"Be concise.\"}'"
      }
    ]
  }
}
```

### Hook I/O Protocol

All hooks receive JSON via **stdin**:

```json
{
  "session_id": "...",
  "transcript_path": "/path/to/transcript",
  "cwd": "/project/dir",
  "hook_event_name": "BeforeTool",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

Respond with JSON on **stdout**:

| Field            | Description             |
| ---------------- | ----------------------- |
| `decision`       | `"allow"` or `"deny"`   |
| `reason`         | Shown to user on denial |
| `systemMessage`  | Injected into context   |
| `suppressOutput` | Hide hook output        |
| `continue`       | `false` to halt agent   |

**BeforeTool** extra: `hookSpecificOutput.tool_input` overrides args.

**AfterTool** extra: `hookSpecificOutput.additionalContext` appended to result.

**BeforeAgent** extra: `hookSpecificOutput.additionalContext` appended to prompt.

**Environment vars available:**
`GEMINI_PROJECT_DIR`, `GEMINI_SESSION_ID`, `GEMINI_CWD`

## Also see {.cols-1}

- [Official Documentation](https://geminicli.com/docs/) _(geminicli.com)_
- [CLI Cheatsheet](https://geminicli.com/docs/cli/cli-reference) _(geminicli.com)_
- [Keyboard Shortcuts Reference](https://geminicli.com/docs/reference/keyboard-shortcuts) _(geminicli.com)_
- [Configuration Reference](https://geminicli.com/docs/reference/configuration) _(geminicli.com)_
- [Hooks Reference](https://geminicli.com/docs/hooks/reference) _(geminicli.com)_
- [GitHub Repository](https://github.com/google-gemini/gemini-cli) _(github.com)_
