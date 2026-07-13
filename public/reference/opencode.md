---
title: OpenCode
date: 2026-04-03 14:00:00
background: bg-[#7c3aed]
tags:
  - AI
  - CLI
  - TUI
  - agent
  - coding
categories:
  - AI
intro: |
  [OpenCode](https://opencode.ai) is an open-source AI coding agent with a TUI, CLI, and desktop app — supports any LLM provider, fully extensible via config, plugins, and MCP.
plugins:
  - copyCode
---

## Getting Started

### Basic Usage {.row-span-2}

```bash
# Start TUI for current directory
$ opencode

# Start TUI for a specific project
$ opencode /path/to/project

# Run non-interactively (headless)
$ opencode run "Explain how closures work in JS"

# Continue last session
$ opencode run -c "Fix the failing tests"

# Pipe input into opencode
$ cat error.log | opencode run "Explain this error"
```

Inside the TUI:

```
/init           # analyze project, create AGENTS.md
@src/api.ts     # fuzzy-reference a file
!ls -la         # run a shell command inline
Tab             # switch agent (Build / Plan / Ask)
```

### Introduction

- [Official Docs](https://opencode.ai/docs) _(opencode.ai)_
- [GitHub](https://github.com/anomalyco/opencode) _(github.com)_
- [Discord](https://discord.gg/opencode) _(discord.gg)_

### Install

#### Script (recommended)

```bash
$ curl -fsSL https://opencode.ai/install | bash
```

#### Node.js

```bash
$ npm install -g opencode-ai
```

#### macOS / Linux

```bash
$ brew install anomalyco/tap/opencode
```

#### Windows

```bash
choco install opencode      # Chocolatey
scoop install opencode      # Scoop
```

#### Docker

```bash {.wrap}
$ docker run -it --rm ghcr.io/anomalyco/opencode
```

### Key Concepts

| Term           | Description                 |
| -------------- | --------------------------- |
| TUI            | Interactive terminal UI     |
| `opencode run` | Headless / scripting mode   |
| Session        | Saved conversation history  |
| AGENTS.md      | Project context for the AI  |
| Snapshot       | Git-based undo/redo state   |
| Compaction     | Auto-summarize full context |
| Agent          | Task-specific AI persona    |
| MCP            | External tool integrations  |

## TUI Slash Commands {.cols-3}

### All Commands {.row-span-2}

| Command     | Keybind | Description                   |
| ----------- | ------- | ----------------------------- |
| `/connect`  |         | Add provider API key          |
| `/init`     | `<L>i`  | Create / update AGENTS.md     |
| `/new`      | `<L>n`  | New session (alias: `/clear`) |
| `/sessions` | `<L>l`  | List & switch sessions        |
| `/models`   | `<L>m`  | List available models         |
| `/themes`   | `<L>t`  | List & change themes          |
| `/compact`  | `<L>c`  | Compact session context       |
| `/undo`     | `<L>u`  | Undo last message + edits     |
| `/redo`     | `<L>r`  | Redo undone message           |
| `/share`    | `<L>s`  | Share session (get URL)       |
| `/unshare`  |         | Remove shared session         |
| `/export`   | `<L>x`  | Export to Markdown            |
| `/editor`   | `<L>e`  | Open `$EDITOR` for input      |
| `/details`  | `<L>d`  | Toggle tool details           |
| `/thinking` |         | Toggle reasoning blocks       |
| `/help`     | `<L>h`  | Show help dialog              |
| `/exit`     | `<L>q`  | Exit (alias: `/quit`, `/q`)   |

{.show-header}

`<L>` = leader key (default `ctrl+x`)

### Input Tips

| Syntax        | Effect                     |
| ------------- | -------------------------- |
| `@filename`   | Fuzzy file reference       |
| `!command`    | Run shell command inline   |
| `Tab`         | Cycle agent mode           |
| `Shift+Tab`   | Reverse cycle agent        |
| `Drag & drop` | Attach image to prompt     |
| `Ctrl+P`      | Command palette            |
| `Ctrl+T`      | Cycle model variant        |
| `F2`          | Cycle recent model         |
| `Escape`      | Interrupt running response |

### Editor Setup

```bash
# For terminal editors
export EDITOR=nvim
export EDITOR=vim

# For GUI editors (need --wait)
export EDITOR="code --wait"
export EDITOR="cursor --wait"
export EDITOR="zed --wait"
```

Add to `~/.zshrc` or `~/.bashrc` to persist.

## Keyboard Shortcuts {.cols-3}

### Session Controls {.row-span-2}

| Shortcut     | Action                 |
| ------------ | ---------------------- |
| `Ctrl+X` `N` | New session            |
| `Ctrl+X` `L` | Sessions list          |
| `Ctrl+X` `C` | Compact session        |
| `Ctrl+X` `U` | Undo last message      |
| `Ctrl+X` `R` | Redo message           |
| `Ctrl+X` `S` | Share session          |
| `Ctrl+X` `X` | Export to Markdown     |
| `Ctrl+X` `E` | Open editor            |
| `Ctrl+X` `M` | Model picker           |
| `Ctrl+X` `A` | Agent picker           |
| `Ctrl+X` `T` | Theme picker           |
| `Ctrl+X` `H` | Help / command palette |
| `Ctrl+X` `Q` | Exit                   |
| `Ctrl+X` `D` | Toggle tool details    |
| `Ctrl+X` `B` | Toggle sidebar         |
| `Ctrl+X` `G` | Session timeline       |
| `Ctrl+X` `Y` | Copy messages          |
| `Escape`     | Interrupt response     |
| `Ctrl+P`     | Command palette        |
| `Ctrl+T`     | Cycle model variant    |
| `F2`         | Next recent model      |
| `Shift+F2`   | Prev recent model      |
| `Tab`        | Cycle agent forward    |
| `Shift+Tab`  | Cycle agent backward   |

{.shortcuts}

### Scroll Navigation

| Shortcut             | Action           |
| -------------------- | ---------------- |
| `Page Up`            | Scroll page up   |
| `Page Down`          | Scroll page down |
| `Ctrl+Alt+Y`         | Scroll line up   |
| `Ctrl+Alt+E`         | Scroll line down |
| `Ctrl+Alt+U`         | Half page up     |
| `Ctrl+Alt+D`         | Half page down   |
| `Ctrl+G` / `Home`    | Jump to top      |
| `Ctrl+Alt+G` / `End` | Jump to bottom   |

{.shortcuts}

### Input Editing

| Shortcut       | Action             |
| -------------- | ------------------ |
| `Ctrl+A`       | Start of line      |
| `Ctrl+E`       | End of line        |
| `Alt+B`        | Word backward      |
| `Alt+F`        | Word forward       |
| `Ctrl+K`       | Kill to line end   |
| `Ctrl+U`       | Kill to line start |
| `Ctrl+W`       | Kill prev word     |
| `Alt+D`        | Kill next word     |
| `Ctrl+V`       | Paste              |
| `Return`       | Submit message     |
| `Shift+Return` | New line in input  |

{.shortcuts}

## CLI Commands {.cols-2}

### All Commands {.row-span-3}

| Command                      | Description                   |
| ---------------------------- | ----------------------------- |
| `opencode`                   | Start TUI                     |
| `opencode [path]`            | Start TUI in directory        |
| `opencode run [msg]`         | Headless/non-interactive run  |
| `opencode serve`             | Headless HTTP API server      |
| `opencode web`               | HTTP server + web UI          |
| `opencode attach [url]`      | Attach TUI to remote server   |
| `opencode acp`               | Start ACP (JSON-RPC) server   |
| `opencode agent create`      | Create new agent              |
| `opencode agent list`        | List agents                   |
| `opencode auth login`        | Configure provider API key    |
| `opencode auth list`         | List authenticated providers  |
| `opencode auth logout`       | Remove provider credentials   |
| `opencode mcp add`           | Add MCP server                |
| `opencode mcp list`          | List MCP servers              |
| `opencode mcp auth [name]`   | Authenticate OAuth MCP server |
| `opencode mcp logout [name]` | Remove MCP OAuth credentials  |
| `opencode mcp debug <name>`  | Debug MCP connection          |
| `opencode models [provider]` | List available models         |
| `opencode models --refresh`  | Refresh models cache          |
| `opencode session list`      | List all sessions             |
| `opencode stats`             | Show token & cost stats       |
| `opencode export [id]`       | Export session as JSON        |
| `opencode import <file>`     | Import session / share URL    |
| `opencode github install`    | Set up GitHub Actions agent   |
| `opencode github run`        | Run GitHub agent              |
| `opencode upgrade [ver]`     | Upgrade to latest / specific  |
| `opencode uninstall`         | Uninstall opencode            |

{.bold-first}

### Headless Mode

```bash
# Basic print/run
$ opencode run "Summarize this codebase"

# Continue last session
$ opencode run -c "Fix the lint errors"

# Specific session
$ opencode run -s <session-id> "Add tests"

# Fork a session
$ opencode run -s <id> --fork "Try different approach"

# Attach files
$ opencode run -f diagram.png "Implement this"

# JSON output
$ opencode run "List all TODOs" --format json

# Share the session
$ opencode run --share "Refactor auth module"

# Attach to running server
$ opencode serve &
$ opencode run --attach http://localhost:4096 "task"
```

### Server & Remote

```bash
# Headless API server
$ opencode serve --port 4096

# Web UI server
$ opencode web --port 4096 --hostname 0.0.0.0

# Enable mDNS discovery
$ opencode serve --mdns

# Enable basic auth
$ OPENCODE_SERVER_PASSWORD=secret opencode serve

# ACP server (JSON-RPC over stdio)
$ opencode acp --cwd /my/project

# Attach TUI to remote server
$ opencode attach http://10.20.30.40:4096
```

## CLI Flags {.cols-3}

### TUI Flags

| Flag         | Short | Description              |
| ------------ | ----- | ------------------------ |
| `--continue` | `-c`  | Continue last session    |
| `--session`  | `-s`  | Session ID to use        |
| `--fork`     |       | Fork on continue         |
| `--prompt`   |       | Initial prompt           |
| `--model`    | `-m`  | Model (`provider/model`) |
| `--agent`    |       | Agent to use             |
| `--port`     |       | Port to listen on        |
| `--hostname` |       | Hostname to listen on    |

{.show-header}

### Run Flags

| Flag         | Short | Description           |
| ------------ | ----- | --------------------- |
| `--continue` | `-c`  | Continue last session |
| `--session`  | `-s`  | Session ID to use     |
| `--fork`     |       | Fork on continue      |
| `--model`    | `-m`  | Model to use          |
| `--agent`    |       | Agent to use          |
| `--file`     | `-f`  | Attach file(s)        |
| `--format`   |       | `default` or `json`   |
| `--share`    |       | Share the session     |
| `--title`    |       | Set session title     |
| `--attach`   |       | Attach to server URL  |
| `--port`     |       | Local server port     |

{.show-header}

### Global Flags

| Flag           | Short | Description           |
| -------------- | ----- | --------------------- |
| `--help`       | `-h`  | Display help          |
| `--version`    | `-v`  | Print version         |
| `--print-logs` |       | Print logs to stderr  |
| `--log-level`  |       | DEBUG/INFO/WARN/ERROR |

{.show-header}

## Configuration {.cols-2}

### opencode.json {.row-span-2}

Main config at `~/.config/opencode/opencode.json` or `./opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "default_agent": "build",
  "autoupdate": true,
  "snapshot": true,
  "share": "manual",
  "instructions": ["AGENTS.md", "docs/*.md"],
  "provider": {
    "anthropic": {
      "options": { "timeout": 600000 }
    }
  },
  "permission": {
    "edit": "ask",
    "bash": "ask"
  },
  "compaction": {
    "auto": true,
    "prune": true,
    "reserved": 10000
  },
  "server": {
    "port": 4096,
    "mdns": true
  },
  "tools": {
    "write": false,
    "bash": false
  },
  "disabled_providers": ["openai"],
  "enabled_providers": ["anthropic"]
}
```

### tui.json

TUI config at `~/.config/opencode/tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "tokyonight",
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": true
  },
  "diff_style": "auto",
  "keybinds": {
    "leader": "ctrl+x",
    "session_compact": "none"
  }
}
```

### Config Locations

| Source       | Path                               | Priority    |
| ------------ | ---------------------------------- | ----------- |
| Remote       | `.well-known/opencode`             | 1 (lowest)  |
| Global       | `~/.config/opencode/opencode.json` | 2           |
| Custom       | `$OPENCODE_CONFIG` path            | 3           |
| Project      | `./opencode.json`                  | 4           |
| `.opencode/` | agents/, commands/, plugins/       | 5           |
| Inline       | `OPENCODE_CONFIG_CONTENT`          | 6 (highest) |

{.show-header}

Configs **merge** — later sources override conflicting keys only.

### Variable Substitution

```json
{
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{env:OPENAI_API_KEY}"
      }
    },
    "anthropic": {
      "options": {
        "apiKey": "{file:~/.secrets/anthropic}"
      }
    }
  }
}
```

## Environment Variables {.cols-2}

### Core Variables {.row-span-2}

| Variable                        | Type   | Description                       |
| ------------------------------- | ------ | --------------------------------- |
| `OPENCODE_CONFIG`               | string | Custom config file path           |
| `OPENCODE_TUI_CONFIG`           | string | Custom TUI config path            |
| `OPENCODE_CONFIG_DIR`           | string | Custom config directory           |
| `OPENCODE_CONFIG_CONTENT`       | string | Inline JSON config                |
| `OPENCODE_PERMISSION`           | string | Inline JSON permissions           |
| `OPENCODE_AUTO_SHARE`           | bool   | Auto-share sessions               |
| `OPENCODE_SERVER_PASSWORD`      | string | Basic auth for serve/web          |
| `OPENCODE_SERVER_USERNAME`      | string | Auth username (default: opencode) |
| `OPENCODE_MODELS_URL`           | string | Custom models config URL          |
| `OPENCODE_ENABLE_EXA`           | bool   | Enable Exa web search             |
| `OPENCODE_DISABLE_AUTOUPDATE`   | bool   | Disable update checks             |
| `OPENCODE_DISABLE_PRUNE`        | bool   | Disable old data pruning          |
| `OPENCODE_DISABLE_AUTOCOMPACT`  | bool   | Disable auto-compaction           |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` | bool   | Disable LSP auto-download         |
| `OPENCODE_DISABLE_MODELS_FETCH` | bool   | Disable remote model fetch        |
| `OPENCODE_DISABLE_CLAUDE_CODE`  | bool   | Disable .claude/ reading          |
| `OPENCODE_GIT_BASH_PATH`        | string | Git Bash path (Windows)           |
| `OPENCODE_CLIENT`               | string | Client ID (default: cli)          |

{.show-header}

### Experimental Variables

| Variable                                        | Description                      |
| ----------------------------------------------- | -------------------------------- |
| `OPENCODE_EXPERIMENTAL`                         | Enable all experimental features |
| `OPENCODE_EXPERIMENTAL_PLAN_MODE`               | Enable plan mode                 |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL`                | Enable experimental LSP tool     |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER`             | Enable full-dir file watcher     |
| `OPENCODE_EXPERIMENTAL_MARKDOWN`                | Experimental markdown features   |
| `OPENCODE_EXPERIMENTAL_EXA`                     | Experimental Exa features        |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX`        | Max output tokens override       |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | Bash timeout in ms               |

## Also see {.cols-1}

- [OpenCode Docs](https://opencode.ai/docs) _(opencode.ai)_
- [CLI Reference](https://opencode.ai/docs/cli/) _(opencode.ai)_
- [TUI Guide](https://opencode.ai/docs/tui/) _(opencode.ai)_
- [Config Reference](https://opencode.ai/docs/config) _(opencode.ai)_
- [GitHub Repository](https://github.com/anomalyco/opencode) _(github.com)_
