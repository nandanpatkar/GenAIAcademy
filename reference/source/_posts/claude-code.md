---
title: Claude Code
date: 2026-04-03 12:00:00
background: bg-[#cc785c]
tags:
  - AI
  - CLI
  - Anthropic
  - coding
  - assistant
categories:
  - AI
intro: |
  [Claude Code](https://code.claude.com) is an agentic AI coding tool by Anthropic — reads your codebase, edits files, runs commands, and integrates with your development tools.
plugins:
  - copyCode
---

## Getting Started

### Installation {.row-span-2}

#### macOS / Linux / WSL

```bash
$ curl -fsSL https://claude.ai/install.sh | bash
```

#### Windows PowerShell

```powershell
> irm https://claude.ai/install.ps1 | iex
```

#### Homebrew (macOS)

```bash
$ brew install --cask claude-code
```

#### WinGet (Windows)

```powershell
> winget install Anthropic.ClaudeCode
```

Native install auto-updates. Homebrew/WinGet require `brew upgrade claude-code` or `winget upgrade Anthropic.ClaudeCode` to update.

Windows requires [Git for Windows](https://git-scm.com/downloads/win).

### First Session

```bash
$ cd your-project
$ claude
```

- Log in on first run (Claude Pro / Max / Team / Enterprise or Anthropic Console)
- Type `/help` for all commands
- Type `/resume` to continue a prior conversation
- Press `?` to see keyboard shortcuts
- Type `exit` or press `Ctrl+D` to quit

### Key Concepts {.secondary}

| Concept         | Description                                           |
| --------------- | ----------------------------------------------------- |
| Agent loop      | Claude reads, edits files, runs commands, and repeats |
| CLAUDE.md       | Persistent instructions Claude reads every session    |
| Auto memory     | Claude saves learnings across sessions automatically  |
| Skills          | Custom `/commands` for reusable workflows             |
| Hooks           | Shell scripts triggered at lifecycle events           |
| MCP             | Connect Claude to external tools and APIs             |
| Permission mode | Controls what Claude can do without asking            |

{.bold-first}

### Common Prompts

- `what does this project do?`
- `find the bug causing the login error`
- `write unit tests for the auth module`
- `refactor this to use async/await`
- `commit my changes with a descriptive message`
- `create a PR and describe my changes`
- `review my changes for security issues`
- `add input validation to the signup form`

{.cols-2 .marker-none}

## CLI Commands {.cols-2}

### Session Commands {.row-span-3}

| Command                     | Description                       |
| --------------------------- | --------------------------------- |
| `claude`                    | Start interactive session         |
| `claude "task"`             | Start with initial prompt         |
| `claude -p "query"`         | Print response and exit           |
| `claude -c`                 | Continue most recent conversation |
| `claude -r [name]`          | Resume session by name or ID      |
| `claude -n "name"`          | Name this session                 |
| `claude -w [name]`          | Start in isolated git worktree    |
| `claude update`             | Update to latest version          |
| `claude -v`                 | Show version number               |
| `claude doctor`             | Check installation health         |
| `claude auto-mode defaults` | Print auto mode classifier rules  |
| `claude agents`             | List configured subagents         |

{.show-header}

#### Auth Commands

| Command                       | Description                    |
| ----------------------------- | ------------------------------ |
| `claude auth login`           | Sign in to account             |
| `claude auth login --console` | Sign in with Anthropic Console |
| `claude auth logout`          | Sign out                       |
| `claude auth status`          | Show auth status               |

#### MCP Commands

| Command                    | Description                |
| -------------------------- | -------------------------- |
| `claude mcp list`          | List configured servers    |
| `claude mcp add <n> <cmd>` | Add a stdio MCP server     |
| `claude mcp get <name>`    | Show server details        |
| `claude mcp remove <name>` | Remove a server            |
| `claude mcp serve`         | Start Claude as MCP server |

#### Plugin Commands

| Command                        | Description            |
| ------------------------------ | ---------------------- |
| `claude plugin install <name>` | Install a plugin       |
| `claude plugin list`           | List installed plugins |
| `claude plugin remove <name>`  | Remove a plugin        |

### Pipe Examples

```bash
# Explain a build error
$ cat error.log | claude -p "explain the root cause"
```

```bash
# Review changed files
$ git diff main --name-only | claude -p "review for issues"
```

```bash
# Analyze logs
$ tail -200 app.log | claude -p "summarize anomalies"
```

```bash
# Save output to file
$ cat data.txt | claude -p "summarize this" > summary.txt
```

### Unix Integration

Add Claude as a linter in `package.json`:

```json {.wrap}
{
  "scripts": {
    "lint:ai": "claude -p 'review changes vs main, report file:line + issue'"
  }
}
```

Use `--output-format` for structured output:

```bash
$ claude -p "analyze for bugs" --output-format json
```

## CLI Flags {.cols-3}

### Session & Mode {.row-span-2}

| Flag                    | Description                               |
| ----------------------- | ----------------------------------------- |
| `--model <model>`       | Model alias: `sonnet`, `opus`, or full ID |
| `--permission-mode <m>` | Set permission mode at startup            |
| `-c, --continue`        | Load most recent conversation             |
| `-r, --resume [id]`     | Resume by session ID or name              |
| `-n, --name <name>`     | Name the current session                  |
| `-w, --worktree [name]` | Create isolated git worktree              |
| `-p, --print`           | Non-interactive print mode                |
| `--effort <level>`      | `low` `medium` `high` `max`               |
| `--ide`                 | Auto-connect to IDE on startup            |
| `--verbose`             | Show full turn-by-turn output             |
| `--debug [filter]`      | Enable debug (e.g. `"api,hooks"`)         |
| `--fork-session`        | New ID when resuming                      |
| `--from-pr [num]`       | Resume sessions linked to PR              |
| `--version, -v`         | Print version number                      |

{.bold-first}

### Output & Format

| Flag                         | Description                     |
| ---------------------------- | ------------------------------- |
| `--output-format`            | `text` / `json` / `stream-json` |
| `--input-format`             | `text` or `stream-json`         |
| `--max-turns <n>`            | Limit agentic turns             |
| `--max-budget-usd <n>`       | Spending cap (print mode)       |
| `--json-schema <s>`          | Validate structured output      |
| `--include-partial-messages` | Stream partial chunks           |
| `--no-session-persistence`   | Don't save session to disk      |
| `--fallback-model <m>`       | Fallback when overloaded        |

{.bold-first}

### Tools & Access

| Flag                                   | Description                    |
| -------------------------------------- | ------------------------------ |
| `--allowedTools <tools>`               | Pre-approve tools (no prompt)  |
| `--disallowedTools <tools>`            | Deny specific tools            |
| `--tools <list>`                       | Restrict available tools       |
| `--add-dir <dirs>`                     | Extra directories to access    |
| `--dangerously-skip-permissions`       | Bypass all permission checks   |
| `--allow-dangerously-skip-permissions` | Add bypass to mode cycle       |
| `--enable-auto-mode`                   | Add auto to Shift+Tab cycle    |
| `--bare`                               | Minimal mode (no hooks/memory) |
| `--mcp-config <file>`                  | Load MCP config from file      |
| `--strict-mcp-config`                  | Only use CLI MCP config        |

{.bold-first}

### System Prompt Flags

| Flag                              | Behavior                      |
| --------------------------------- | ----------------------------- |
| `--system-prompt <text>`          | Replace entire default prompt |
| `--system-prompt-file <file>`     | Replace from file             |
| `--append-system-prompt <text>`   | Append to default prompt      |
| `--append-system-prompt-file <f>` | Append from file              |

{.bold-first}

Prefer `--append-*` to preserve Claude's built-in capabilities. Use `--system-prompt` only when full control is needed.

## Slash Commands {.cols-3}

### Session & Context {.row-span-2}

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `/clear`           | Clear history (aliases: `/new`, `/reset`) |
| `/compact [focus]` | Compact context with optional focus       |
| `/resume [name]`   | Resume session (alias: `/continue`)       |
| `/branch [name]`   | Fork conversation (alias: `/fork`)        |
| `/rewind`          | Undo to checkpoint (alias: `/checkpoint`) |
| `/diff`            | View uncommitted changes interactively    |
| `/export [file]`   | Export conversation as plain text         |
| `/copy [N]`        | Copy Nth-last response to clipboard       |
| `/cost`            | Show token usage stats                    |
| `/usage`           | Show plan limits and rate limit status    |
| `/context`         | Visualize context window usage            |
| `/btw <q>`         | Side question without adding to history   |

{.show-header}

### Code & Git

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| `/plan [desc]`        | Enter plan (read-only) mode              |
| `/security-review`    | Audit branch changes for vulnerabilities |
| `/pr-comments [PR]`   | Fetch GitHub PR comments                 |
| `/install-github-app` | Set up GitHub Actions integration        |
| `/install-slack-app`  | Install Slack integration                |

### Settings & Config

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `/config`         | Open settings (alias: `/settings`)      |
| `/model [model]`  | Change AI model                         |
| `/effort [level]` | Set effort: `low` `medium` `high` `max` |
| `/permissions`    | Manage allow / ask / deny rules         |
| `/hooks`          | View configured hooks                   |
| `/memory`         | Edit CLAUDE.md and auto memory          |
| `/mcp`            | Manage MCP server connections           |
| `/agents`         | Manage subagent configurations          |
| `/skills`         | List available skills                   |
| `/plugin`         | Manage installed plugins                |
| `/keybindings`    | Open keybindings config file            |

### Display & UI

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `/theme`          | Change color theme            |
| `/vim`            | Toggle vim editing mode       |
| `/color [color]`  | Set prompt bar color          |
| `/statusline`     | Configure status line display |
| `/stats`          | View daily usage and streaks  |
| `/insights`       | Analyze session patterns      |
| `/fast [on\|off]` | Toggle fast mode              |
| `/powerup`        | Interactive feature tour      |
| `/tasks`          | Manage background tasks       |
| `/add-dir <path>` | Add working directory         |

### Help & System

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `/help`            | Show available commands           |
| `/init`            | Generate CLAUDE.md for project    |
| `/doctor`          | Diagnose installation             |
| `/voice`           | Toggle voice dictation            |
| `/schedule [desc]` | Create cloud scheduled task       |
| `/login`           | Sign in to account                |
| `/logout`          | Sign out                          |
| `/feedback`        | Submit feedback (alias: `/bug`)   |
| `/release-notes`   | View changelog                    |
| `/status`          | Show version, model, account info |

## Keyboard Shortcuts {.cols-3}

### General Controls {.row-span-2}

| Shortcut    | Description                        |
| ----------- | ---------------------------------- |
| `Ctrl+C`    | Cancel current input or generation |
| `Ctrl+D`    | Exit Claude Code                   |
| `Shift+Tab` | Cycle permission modes             |
| `Ctrl+R`    | Reverse search command history     |
| `Ctrl+G`    | Open prompt in text editor         |
| `Ctrl+L`    | Redraw the screen                  |
| `Ctrl+O`    | Toggle verbose output              |
| `Ctrl+V`    | Paste image from clipboard         |
| `Ctrl+B`    | Background the running command     |
| `Ctrl+T`    | Toggle task list display           |
| `Esc Esc`   | Rewind or summarize conversation   |
| `Option+P`  | Switch model (macOS)               |
| `Option+T`  | Toggle extended thinking (macOS)   |
| `Option+O`  | Toggle fast mode (macOS)           |

{.shortcuts}

### Text Editing

| Shortcut | Description             |
| -------- | ----------------------- |
| `Ctrl+K` | Delete to end of line   |
| `Ctrl+U` | Delete to start of line |
| `Ctrl+Y` | Paste deleted text      |
| `Alt+Y`  | Cycle paste history     |
| `Alt+B`  | Move back one word      |
| `Alt+F`  | Move forward one word   |

{.shortcuts}

### Vim Mode

Enable with `/vim` or in `/config`. `Esc` → NORMAL, `i`/`a`/`o` → INSERT.

| Key             | Action                        |
| --------------- | ----------------------------- |
| `h j k l`       | Move left / down / up / right |
| `w` / `b`       | Next / previous word          |
| `0` / `$`       | Line start / end              |
| `gg` / `G`      | Input start / end             |
| `dd` / `yy`     | Delete / yank line            |
| `cc` / `p`      | Change line / paste           |
| `f{c}` / `F{c}` | Jump to character             |
| `.`             | Repeat last change            |

### Multiline & Input

| Method                    | How                     |
| ------------------------- | ----------------------- |
| Multiline (all terminals) | `\` then `Enter`        |
| Multiline (macOS default) | `Option+Enter`          |
| Multiline (modern terms)  | `Shift+Enter`           |
| Run bash directly         | `!` prefix              |
| File path autocomplete    | `@` prefix              |
| All commands / skills     | `/` prefix              |
| Session picker shortcut   | `P` preview, `R` rename |

macOS: set Option as Meta in terminal prefs for `Alt+*` shortcuts to work.

## Permission Modes {.cols-3}

### Modes Overview {.col-span-2 .row-span-2}

| Mode                | What Claude does without asking        | Best for                             |
| ------------------- | -------------------------------------- | ------------------------------------ |
| `default`           | Read files only                        | Getting started, sensitive work      |
| `acceptEdits`       | Read + edit files                      | Active coding, iteration             |
| `plan`              | Read only, writes a plan file          | Exploration, planning before editing |
| `auto`              | All actions with background classifier | Long tasks, fewer interruptions      |
| `dontAsk`           | Only pre-approved tools                | Locked CI/CD environments            |
| `bypassPermissions` | All actions except protected dirs      | Containers and VMs only              |

{.show-header}

Regardless of mode, writes to `.git`, `.vscode`, `.idea`, `.husky`, and `.claude` always prompt (except `.claude/commands`, `.claude/agents`, `.claude/skills`).

#### Configure Default Mode

```json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  }
}
```

#### Auto Mode Notes

Requires Team / Enterprise / API plan + Claude Sonnet 4.6 or Opus 4.6. A separate classifier reviews each action before it runs and blocks actions that escalate beyond your intent. Enable at startup:

```bash
$ claude --enable-auto-mode
```

### Switch Modes

**During a session:**

Press `Shift+Tab` to cycle:

```
default → acceptEdits → plan → (auto)
```

**At startup:**

```bash
$ claude --permission-mode plan
$ claude --permission-mode acceptEdits
```

**Bypass all (containers only):** {.primary}

```bash
$ claude --dangerously-skip-permissions
```

### Permission Rules

Layer allow / deny rules on top of any mode in `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(git log *)"],
    "deny": ["Bash(rm -rf *)"]
  }
}
```

View and edit rules with `/permissions`.

## Memory & CLAUDE.md {.cols-3}

### CLAUDE.md Locations {.col-span-2 .row-span-2}

| Scope          | Location                                  | Shared with            |
| -------------- | ----------------------------------------- | ---------------------- |
| Managed policy | System-level (IT/DevOps deployed)         | All users on machine   |
| Project        | `./CLAUDE.md` or `./.claude/CLAUDE.md`    | Team via git           |
| User           | `~/.claude/CLAUDE.md`                     | Personal, all projects |
| Local          | `./CLAUDE.local.md` (add to `.gitignore`) | Personal, this project |

{.show-header}

Files in parent directories load at launch. Subdirectory files load on demand when Claude reads files there. More specific scope wins on conflict.

#### Write Effective Instructions

- **Size**: keep each file under 200 lines — longer files reduce adherence
- **Specific**: `"Use 2-space indentation"` not `"format code nicely"`
- **Structured**: use markdown headers to group related rules
- **Consistent**: avoid conflicting instructions across files

Run `/init` to auto-generate a CLAUDE.md from your codebase. Set `CLAUDE_CODE_NEW_INIT=1` for an interactive multi-phase flow that also sets up skills and hooks.

#### Organize with `.claude/rules/`

```text
.claude/
├── CLAUDE.md
└── rules/
    ├── code-style.md   # style guidelines
    ├── testing.md      # test conventions
    └── security.md     # security requirements
```

#### Path-scoped Rules

```yaml
---
paths:
  - 'src/api/**/*.ts'
  - 'tests/**/*.test.ts'
---
# API Rules
All endpoints must include input validation.
```

Rules without `paths` load every session. Rules with `paths` load only when matching files are opened.

### Auto Memory

Claude saves its own notes in:

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # index (first 200 lines loaded)
├── debugging.md       # topic files (loaded on demand)
└── api-conventions.md
```

- On by default; toggle in `/memory` or set `autoMemoryEnabled: false`
- Persists across sessions and worktrees in the same git repo
- Machine-local — not shared across machines

Disable via env:

```bash
$ export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

### Import Syntax

Reference other files from CLAUDE.md:

```markdown
See @README.md for project overview.
Build commands: @package.json

# Workflows

@docs/git-workflow.md
```

- Both relative and absolute paths are supported
- Max import depth: 5 hops
- Imported files are expanded at session start
- HTML comments in CLAUDE.md are stripped from context

## Hooks {.cols-2}

### Hook Events {.row-span-2}

| Event                | When it fires                      |
| -------------------- | ---------------------------------- |
| `SessionStart`       | Session begins, resumes, or clears |
| `UserPromptSubmit`   | User submits a prompt              |
| `PreToolUse`         | Before a tool executes             |
| `PermissionRequest`  | Before permission dialog shows     |
| `PostToolUse`        | After tool completes successfully  |
| `PostToolUseFailure` | After tool execution fails         |
| `PermissionDenied`   | Auto mode classifier denies action |
| `Stop`               | Claude finishes responding         |
| `StopFailure`        | Turn ends due to API error         |
| `Notification`       | Claude needs attention             |
| `SubagentStart`      | Subagent is spawned                |
| `SubagentStop`       | Subagent finishes                  |
| `FileChanged`        | Watched file changes on disk       |
| `PreCompact`         | Before context compaction          |
| `PostCompact`        | After context compaction           |
| `WorktreeCreate`     | Worktree being created             |
| `WorktreeRemove`     | Worktree being removed             |
| `InstructionsLoaded` | CLAUDE.md file loaded              |
| `ConfigChange`       | Settings file changes              |
| `TaskCreated`        | Task created via TaskCreate        |
| `TaskCompleted`      | Task marked complete               |

{.show-header}

**Exit codes**: `0` = success (JSON decision), `2` = block action (stderr to model), other = non-blocking error.

Use `$CLAUDE_PROJECT_DIR` to reference hook scripts relative to the project root.

### Hook Types

| Type      | Description                             |
| --------- | --------------------------------------- |
| `command` | Run shell script, reads JSON from stdin |
| `http`    | POST JSON to an HTTP endpoint           |
| `prompt`  | Ask Claude for a yes/no decision        |
| `agent`   | Spawn subagent with tools to verify     |

{.bold-first}

#### Auto-format After File Edits

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --silent"
          }
        ]
      }
    ]
  }
}
```

#### Notify When Claude Needs You (macOS)

```json {.wrap}
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

Config in `~/.claude/settings.json` (user) or `.claude/settings.json` (project). View hooks with `/hooks`.

## MCP Servers {.cols-2}

### Add MCP Server {.row-span-2}

#### Stdio server (local process)

```bash
$ claude mcp add my-server -- npx my-mcp-server
```

#### With environment variables

```bash
$ claude mcp add -e KEY=val my-server -- npx server
```

#### HTTP server

```bash {.wrap}
$ claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

#### HTTP with auth header

```bash {.wrap}
$ claude mcp add --transport http my-api https://api.example.com/mcp --header "Authorization: Bearer $TOKEN"
```

#### JSON format

```bash
$ claude mcp add-json my-server '{"command":"npx","args":["my-mcp"]}'
```

#### Import from Claude Desktop

```bash
$ claude mcp add-from-claude-desktop
```

#### Manage servers

```bash
$ claude mcp list           # list all servers
$ claude mcp get <name>     # show server details
$ claude mcp remove <name>  # remove a server
```

Config stored in `~/.claude/settings.json` (user) or `.claude/settings.json` (project).

### MCP in Session

**Reference MCP resources with `@`:**

```
@github:repos/owner/repo/issues
@memory:entities
@filesystem:/path/to/file
```

**Run MCP prompts as slash commands:**

```
/mcp__github__search_repositories
/mcp__memory__create_entities
```

MCP tool pattern: `mcp__<server>__<tool>`

**Manage in session:**

```
/mcp
```

**Hook on MCP tools:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [{ "type": "command", "command": "logger.sh" }]
      }
    ]
  }
}
```

## Worktrees & Agents {.cols-2}

### Git Worktrees {.row-span-2}

Run parallel sessions in isolated branches:

```bash
# Create worktree and start Claude
$ claude --worktree feature-auth
$ claude -w bugfix-123

# Auto-generated name
$ claude --worktree
```

Worktrees are created at `.claude/worktrees/<name>/` and branch from `origin/HEAD`.

**Auto-cleanup:** no changes → removed on exit. With changes → Claude prompts to keep or remove.

Add to `.gitignore`:

```
.claude/worktrees/
```

#### Copy secrets to worktrees

Create `.worktreeinclude` in project root:

```
.env
.env.local
config/secrets.json
```

#### Manual worktree commands

```bash
# Create with specific branch
$ git worktree add ../project-feat -b feat

# List all worktrees
$ git worktree list

# Remove when done
$ git worktree remove ../project-feat
```

Re-sync origin HEAD after remote branch change:

```bash
$ git remote set-head origin -a
```

### Subagents

Create in `.claude/agents/<name>.md`:

```yaml
---
name: code-reviewer
description: Reviews code for bugs and style
tools:
  - Read
  - Grep
  - Glob
---
You are an expert code reviewer.
Focus on correctness and clarity.
```

Use subagents naturally in conversation:

- `review the auth module for security issues`
- `use the code-reviewer agent on api.ts`
- `/agents` — manage agent configs

**Subagent with worktree isolation:**

```yaml
---
name: parallel-worker
isolation: worktree
description: Works in isolated branch
---
```

**Shared auto memory for subagents** — add to frontmatter:

```yaml
autoMemoryEnabled: true
```

## Headless & Scripting {.cols-2}

### Non-interactive Mode {.row-span-2}

Run Claude programmatically with `-p` / `--print`:

```bash
# Basic one-off query
$ claude -p "what does this file do?"

# Stream JSON (real-time events)
$ claude -p "query" --output-format stream-json

# JSON with full metadata
$ claude -p "query" --output-format json

# Limit turns and cost
$ claude -p "query" --max-turns 5 --max-budget-usd 1.00

# Validated structured output
$ claude -p "query" --json-schema '{"type":"object"}'
```

#### Resume in headless mode

```bash
# Continue most recent session
$ claude -c -p "follow-up question"

# Resume named session
$ claude -r my-session -p "continue the task"
```

#### Output formats

| Format        | Use case                  |
| ------------- | ------------------------- |
| `text`        | Human-readable (default)  |
| `json`        | Full metadata + cost info |
| `stream-json` | Real-time per-turn events |

{.bold-first}

#### Bare mode (faster startup)

```bash
$ claude --bare -p "query"
```

Skips hooks, CLAUDE.md auto-discovery, plugins, MCP, and auto memory. Sets `CLAUDE_CODE_SIMPLE=1`. Ideal for scripting.

#### Session persistence

```bash
# Don't save session to disk
$ claude -p "query" --no-session-persistence
```

### Scheduling

**Create a cloud scheduled task:**

```
/schedule review open PRs every morning at 9am
```

**Session-scoped loop (stays open):**

```
/loop 5m check for new issues
```

#### GitHub Actions

```yaml
- uses: anthropics/claude-code-action@beta
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: 'review this PR for issues and comment'
```

#### GitLab CI/CD

```yaml
claude-review:
  script:
    - claude -p "review changes in this MR"
      --output-format json
```

| Scheduling option       | Runs on                  |
| ----------------------- | ------------------------ |
| Cloud scheduled tasks   | Anthropic infrastructure |
| Desktop scheduled tasks | Your local machine       |
| GitHub Actions          | CI/CD pipeline           |
| `/loop`                 | Current CLI session only |

## Also see {.cols-1}

- [Claude Code Docs](https://code.claude.com/docs/en/overview) _(code.claude.com)_
- [CLI Reference](https://code.claude.com/docs/en/cli-reference) _(code.claude.com)_
- [All Slash Commands](https://code.claude.com/docs/en/commands) _(code.claude.com)_
- [Hooks Reference](https://code.claude.com/docs/en/hooks) _(code.claude.com)_
- [MCP Documentation](https://code.claude.com/docs/en/mcp) _(code.claude.com)_
- [Memory & CLAUDE.md](https://code.claude.com/docs/en/memory) _(code.claude.com)_
- [Permission Modes](https://code.claude.com/docs/en/permission-modes) _(code.claude.com)_
- [GitHub Repository](https://github.com/anthropics/claude-code) _(github.com)_
- [Community Discord](https://www.anthropic.com/discord) _(anthropic.com)_
