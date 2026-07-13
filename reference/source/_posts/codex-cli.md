---
title: Codex CLI
date: 2026-04-03 10:00:00
background: bg-[#10a37f]
tags:
  - CLI
  - AI
  - OpenAI
  - coding-agent
categories:
  - AI
intro: |
  OpenAI Codex CLI (v0.116+) is an open-source AI coding agent that reads, edits, and runs code directly in your terminal. See the [official docs](https://developers.openai.com/codex/cli) _(developers.openai.com)_.
plugins:
  - copyCode
---

## Getting Started {.cols-2}

### Install & Run {.row-span-2}

#### npm (recommended)

```bash
$ npm install -g @openai/codex
$ npm install -g @openai/codex@latest   # upgrade
```

#### Homebrew (macOS)

```bash
$ brew install codex
```

#### First run

```bash
$ codex                          # launch interactive TUI
$ codex "Explain this codebase"  # with initial prompt
```

On first run you'll be prompted to sign in via ChatGPT or an API key.

#### Shell completions

```bash
# Zsh – add to ~/.zshrc
$ eval "$(codex completion zsh)"

# Bash – add to ~/.bashrc
$ eval "$(codex completion bash)"

# Fish
$ codex completion fish | source
```

### Platform Support

| Platform         | Status       |
| ---------------- | ------------ |
| macOS            | Stable       |
| Linux            | Stable       |
| Windows (WSL)    | Recommended  |
| Windows (native) | Experimental |

{.show-header}

### Authentication

```bash
$ codex login                # ChatGPT OAuth
$ codex login --device-auth  # device flow
# Pipe API key from env
$ printenv OPENAI_API_KEY | codex login --with-api-key
$ codex login status         # check auth state
$ codex logout               # remove credentials
```

## Subcommands {.cols-3}

### Command Reference {.col-span-2 .row-span-2}

| Command            | Alias     | Status       | Description                       |
| ------------------ | --------- | ------------ | --------------------------------- |
| `codex`            |           | Stable       | Launch interactive TUI            |
| `codex exec`       | `codex e` | Stable       | Run non-interactively (scripting) |
| `codex review`     |           | Stable       | Non-interactive code review       |
| `codex resume`     |           | Stable       | Resume a previous session         |
| `codex fork`       |           | Stable       | Fork a session into new thread    |
| `codex apply`      | `codex a` | Stable       | Apply Cloud task diff locally     |
| `codex login`      |           | Stable       | Authenticate Codex                |
| `codex logout`     |           | Stable       | Remove stored credentials         |
| `codex completion` |           | Stable       | Generate shell completions        |
| `codex features`   |           | Stable       | Manage feature flags              |
| `codex app`        |           | Stable       | Launch Codex desktop app          |
| `codex mcp`        |           | Experimental | Manage MCP servers                |
| `codex mcp-server` |           | Experimental | Run Codex as an MCP server        |
| `codex cloud`      |           | Experimental | Browse and exec Cloud tasks       |
| `codex sandbox`    |           | Experimental | Run cmds inside sandbox           |
| `codex debug`      |           | Experimental | Debugging tools                   |

{.show-header}

### Exec (Non-interactive)

```bash
# Basic non-interactive run
$ codex exec "Fix the race condition"
$ codex e "Add unit tests for utils"

# Prompt from stdin
$ echo "Explain main.go" | codex exec -

# Prompt-plus-stdin (0.118+): pipe data AND pass a prompt
$ cat error.log | codex exec "Diagnose this log" -

# Output options
$ codex exec --json "Audit security"
$ codex exec -o last.txt "Summarize"

# Resume a previous exec session
$ codex exec resume --last "Fix the bugs"
$ codex exec resume <SESSION_ID> "Implement"
```

## Global Options {.cols-2}

### All Flags {.row-span-3}

| Flag                      | Values          | Description                        |
| ------------------------- | --------------- | ---------------------------------- |
| `-m, --model`             | string          | Model override (e.g. `gpt-5.4`)    |
| `-s, --sandbox`           | see below       | Sandbox policy                     |
| `-a, --ask-for-approval`  | see below       | Approval policy                    |
| `--full-auto`             | flag            | workspace-write + on-request       |
| `--yolo`                  | flag            | Bypass all approvals/sandbox       |
| `-i, --image`             | path            | Attach image(s) to initial prompt  |
| `-c, --config`            | `key=val`       | Override a config value            |
| `-C, --cd`                | path            | Agent working directory            |
| `-p, --profile`           | string          | Config profile name                |
| `--search`                | flag            | Enable live web search             |
| `--add-dir`               | path            | Grant extra directory write access |
| `--oss`                   | flag            | Use local OSS provider             |
| `--local-provider`        | lmstudio/ollama | Specify OSS provider               |
| `--enable`                | feature         | Enable a feature flag              |
| `--disable`               | feature         | Disable a feature flag             |
| `--no-alt-screen`         | flag            | Inline TUI mode (no alt screen)    |
| `--remote`                | ws://host:port  | Connect to remote app server       |
| `--remote-auth-token-env` | ENV_VAR         | Bearer token env var for remote WS |
| `-V, --version`           |                 | Print version                      |
| `-h, --help`              |                 | Print help                         |

{.show-header}

### Usage Examples

```bash {.wrap}
# Specify model
$ codex -m gpt-5.4 "Refactor the auth module"

# Auto mode (low friction)
$ codex --full-auto "Run tests and fix failures"

# Attach a screenshot
$ codex -i mockup.png "Implement this UI"

# Override config inline
$ codex -c model="gpt-5.4-mini" "Quick scan"

# Live web search
$ codex --search "Find the latest async syntax"

# Set working directory
$ codex -C ~/projects/api "Review this codebase"
```

## Sandbox & Approvals {.cols-3}

### Sandbox Modes

| Mode                 | Description                             |
| -------------------- | --------------------------------------- |
| `read-only`          | Inspect only, no edits without approval |
| `workspace-write`    | Edit workspace + run local commands     |
| `danger-full-access` | No restrictions (use in hardened envs)  |

### Approval Policies

| Policy       | Description                               |
| ------------ | ----------------------------------------- |
| `untrusted`  | Ask before all non-trusted commands       |
| `on-request` | Ask when going beyond sandbox boundary    |
| `never`      | Never ask; all commands run automatically |

### Presets {.primary}

| Preset        | Equivalent setting               |
| ------------- | -------------------------------- |
| `--full-auto` | `workspace-write` + `on-request` |
| `--yolo`      | No sandbox + No approvals        |

Use `/permissions` in the TUI to change modes mid-session.

## Slash Commands {.cols-3}

### Session Control {.row-span-2}

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `/model`          | Switch model / reasoning effort |
| `/fast`           | Toggle GPT-5.4 Fast mode        |
| `/permissions`    | Adjust approval mode            |
| `/personality`    | Set response style              |
| `/plan`           | Enter planning mode             |
| `/status`         | Show model, tokens, config      |
| `/compact`        | Summarize to free context       |
| `/clear`          | Clear chat + start fresh        |
| `/new`            | New chat, keep CLI session      |
| `/fork`           | Fork current conversation       |
| `/resume`         | Resume saved session            |
| `/exit` / `/quit` | Exit the CLI                    |

### Review & Code

| Command    | Description                 |
| ---------- | --------------------------- |
| `/review`  | Launch code reviewer        |
| `/diff`    | Show Git diff               |
| `/copy`    | Copy latest Codex output    |
| `/mention` | Attach file to conversation |
| `/init`    | Generate AGENTS.md scaffold |

### Tools & Debug

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `/agent`                | Switch active agent thread     |
| `/mcp`                  | List MCP tools                 |
| `/apps`                 | Browse connector apps          |
| `/experimental`         | Toggle experimental features   |
| `/statusline`           | Configure TUI footer           |
| `/ps`                   | Show background terminals      |
| `/sandbox-add-read-dir` | Add readable dir (Windows)     |
| `/feedback`             | Send logs to maintainers       |
| `/plugins`              | Browse and manage plugins      |
| `/title`                | Set terminal title for session |
| `/debug-config`         | Print config diagnostics       |
| `/logout`               | Sign out of Codex              |

## Models {.cols-3}

### Available Models {.col-span-2}

| Model                 | Speed | Best for                                 |
| --------------------- | ----- | ---------------------------------------- |
| `gpt-5.4`             | ★★★   | Default – coding + reasoning + workflows |
| `gpt-5.4-mini`        | ★★★★★ | Subagents, light tasks, higher limits    |
| `gpt-5.3-codex`       | ★★★★  | Complex software engineering             |
| `gpt-5.3-codex-spark` | ★★★★★ | Near-instant iteration (Pro only)        |

{.show-header}

### Select a Model

```bash
$ codex -m gpt-5.4 "Your prompt"
$ codex -m gpt-5.4-mini "Quick task"
$ codex --oss    # local Ollama / LM Studio
# Mid-session: type /model in the TUI
```

## Configuration {.cols-2}

### config.toml Keys {.row-span-2}

```toml
# ~/.codex/config.toml

# Model settings
model = "gpt-5.4"
model_provider = "openai"
model_reasoning_effort = "medium"  # low | medium | high

# Sandbox & approvals
sandbox_mode = "workspace-write"
approval_policy = "on-request"

# Web search: cached | live | disabled
web_search = "cached"

# Review model override
review_model = "gpt-5.4"

# TUI appearance
[tui]
theme = "dark"
alternate_screen = true

# Profile example
[profile.ci]
model = "gpt-5.4-mini"
approval_policy = "never"
sandbox_mode = "workspace-write"
```

Use `-p ci` to activate a profile.

### Feature Flags

```bash
$ codex features list
$ codex features enable unified_exec
$ codex features disable shell_snapshot

# Per-session (not persisted)
$ codex --enable unified_exec
$ codex --disable shell_snapshot
```

### Config Locations

| File                   | Purpose               |
| ---------------------- | --------------------- |
| `~/.codex/config.toml` | Global defaults       |
| `~/.codex/AGENTS.md`   | Personal instructions |
| `~/.agents/skills/`    | Personal skills       |
| `.agents/skills/`      | Repo-level skills     |
| `AGENTS.md`            | Repo instructions     |

## Customization {.cols-3}

### AGENTS.md {.row-span-2}

Persistent repo instructions, checked in alongside code:

```markdown
## Build & test commands

- Install: `npm install`
- Test: `npm test`
- Lint: `npm run lint`

## Conventions

- TypeScript strict mode
- No PII in logs
- Auth middleware on all routes

## Review guidelines

- Flag unhandled promise rejections
```

When to add rules:

- Repeated agent mistakes
- Recurring PR review feedback
- Tag `@codex add to AGENTS.md` in GitHub

### Skills

Reusable workflows packaged as `SKILL.md`:

```
my-skill/
  SKILL.md      ← metadata + instructions
  scripts/      ← optional helper scripts
  references/   ← optional documentation
  assets/       ← optional templates
```

Example `SKILL.md`:

```markdown
---
name: commit
description: Stage and commit changes
  in semantic groups.
---

1. Stage files in logical groups.
2. Group: feat → test → docs → chore
3. Write concise commit messages.
```

### MCP Servers

```bash
# Add a stdio server
$ codex mcp add myserver -- npx my-mcp-server

# Add an HTTP server
$ codex mcp add myserver \
    --url https://api.example.com/mcp

# With auth token
$ codex mcp add myserver \
    --url https://api.example.com/mcp \
    --bearer-token-env-var MY_TOKEN

# List / remove
$ codex mcp list
$ codex mcp remove myserver

# Run Codex itself as MCP server
$ codex mcp-server
```

## Session Management {.cols-3}

### Resume Sessions

```bash
$ codex resume           # session picker
$ codex resume --last    # most recent session
$ codex resume --all     # across all directories
$ codex resume <ID> "Continue fixing tests"
```

Sessions stored at `~/.codex/sessions/`

### Fork a Session

```bash
$ codex fork             # fork from picker
$ codex fork --last      # fork most recent
$ codex fork <SESSION_ID> "New direction"
```

Forking preserves the original transcript while starting a new branch.

### Image Inputs

```bash
# Single image
$ codex -i screenshot.png "Fix this error"

# Multiple images
$ codex --image img1.png,img2.jpg "Compare"

# Or drag images into the TUI composer
```

Supported: PNG, JPEG and other common formats.

## Cloud & GitHub {.cols-3}

### Cloud Tasks {.col-span-2}

```bash
# Browse cloud environments
$ codex cloud

# Submit a cloud task
$ codex cloud exec --env <ENV_ID> "Fix bug"

# With multiple attempts (best-of-N)
$ codex cloud exec --env <ENV_ID> \
    --attempts 3 "Write failing tests"

# List recent tasks
$ codex cloud list

# Check task status
$ codex cloud status <TASK_ID>

# Show diff for a task
$ codex cloud diff <TASK_ID>

# Apply diff to local working tree
$ codex apply <TASK_ID>
```

### GitHub Integration

```
# In a PR comment – trigger code review:
@codex review

# Custom focus:
@codex review for security regressions

# Delegate any task using PR as context:
@codex fix the CI failures
@codex add tests for the new endpoint
```

Enable in Codex Settings → Code review → your repo. Turn on Automatic reviews to review every new PR.

## Subagent Workflows {.cols-2}

### Subagents Guide {.row-span-2}

Offload noisy work to parallel agents to avoid **context pollution** and **context rot**:

```
codex "Review this branch with parallel agents.
Spawn one for security risks, one for test gaps,
and one for maintainability. Wait for all three,
then summarize findings with file references."
```

- Use for: exploration, tests, triage, log analysis
- Avoid parallel write-heavy work (conflicts)
- Each subagent consumes extra tokens

**Subagent model guide:**

| Role                    | Model          | Reasoning |
| ----------------------- | -------------- | --------- |
| Main coordinator        | `gpt-5.4`      | medium    |
| Fast exploration        | `gpt-5.4-mini` | low       |
| Security / logic review | `gpt-5.4`      | high      |

{.show-header}

### Reasoning Effort

| Level    | Use when                       |
| -------- | ------------------------------ |
| `high`   | Complex logic, security audits |
| `medium` | General tasks (default)        |
| `low`    | Simple or speed-critical tasks |

Set in `config.toml`:

```toml
model_reasoning_effort = "medium"
```

Or inline: `-c model_reasoning_effort="high"`

## Also See {.cols-1}

- [Official Codex Docs](https://developers.openai.com/codex/cli) _(developers.openai.com)_
- [Codex CLI GitHub](https://github.com/openai/codex) _(github.com)_
- [Codex Pricing](https://developers.openai.com/codex/pricing) _(developers.openai.com)_
- [Customization Guide](https://developers.openai.com/codex/concepts/customization) _(developers.openai.com)_
- [Prompting Best Practices](https://developers.openai.com/codex/prompting) _(developers.openai.com)_
- [Workflows & Examples](https://developers.openai.com/codex/workflows) _(developers.openai.com)_
