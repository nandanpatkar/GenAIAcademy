---
title: OpenClaw
date: 2026-04-03 10:00:00
background: bg-[#cc2200]
tags:
  - whatsapp
  - telegram
  - ai-gateway
  - automation
categories:
  - AI
intro: |
  [OpenClaw](https://openclaw.ai) is a self-hosted AI gateway that bridges WhatsApp, Telegram, Discord, iMessage, and more to AI coding agents.
plugins:
  - copyCode
---

## Getting Started

### Quick Setup {.row-span-2}

#### 1. Install

```bash
# macOS / Linux / WSL2
curl -fsSL https://openclaw.ai/install.sh | bash
# or via npm
npm install -g openclaw@latest
```

#### 2. Onboard & install service

```bash
openclaw onboard --install-daemon
```

#### 3. Verify the gateway

```bash
openclaw gateway status
```

#### 4. Open dashboard

```bash
openclaw dashboard
# Local default: http://127.0.0.1:18789/
```

### Introduction

- [Docs](https://docs.openclaw.ai) _(docs.openclaw.ai)_
- [GitHub](https://github.com/openclaw/openclaw) _(github.com)_
- [Discord](https://discord.gg/openclaw) _(discord.gg)_
- [Releases](https://github.com/openclaw/openclaw/releases) _(github.com)_

Self-hosted, MIT licensed, multi-channel

### Alternative Install

```bash {.wrap}
# From source
git clone https://github.com/openclaw/openclaw.git
cd openclaw && pnpm install && pnpm build
pnpm link --global
```

### Verify Install

```bash
openclaw --version  # confirm CLI available
openclaw doctor     # health check + fixes
openclaw status     # channels + gateway status
```

### Global Flags

| Flag                 | Description              |
| -------------------- | ------------------------ |
| `--dev`              | Dev profile, port 19001  |
| `--profile <name>`   | Named isolated profile   |
| `--container <name>` | Run inside a container   |
| `--log-level <l>`    | Log level (silent…trace) |
| `--no-color`         | Disable ANSI colors      |

{.bold-first}

## Gateway {.cols-2}

### Service Management {.row-span-2}

```bash
# Install as system service
openclaw gateway install
# Start / stop / restart
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
# Uninstall service
openclaw gateway uninstall
```

#### Status & health

```bash
openclaw gateway status       # service status + probe
openclaw gateway status --deep
openclaw gateway status --json
openclaw health               # fetch health from gateway
openclaw logs --follow        # tail gateway logs
```

### Startup Options

```bash
openclaw gateway run             # foreground
openclaw gateway run --port 19001
openclaw gateway run --force     # kill existing listener
openclaw gateway run --verbose   # verbose to stdout
openclaw gateway run --bind lan  # bind to LAN
openclaw gateway run --auth token --token <t>
```

### Hot Reload Modes

| `gateway.reload.mode` | Behavior                                    |
| --------------------- | ------------------------------------------- |
| `hybrid` _(default)_  | Hot-apply safe changes, restart when needed |
| `hot`                 | Apply only hot-safe changes                 |
| `restart`             | Restart on any reload-required change       |
| `off`                 | No config reload                            |

{.show-header}

### Remote Access

```bash
# SSH tunnel (recommended fallback)
ssh -N -L 18789:127.0.0.1:18789 user@host
# then connect to ws://127.0.0.1:18789

# Tailscale (preferred for always-on)
openclaw gateway run --tailscale serve
```

### OpenAI-Compatible API

| Endpoint                    | Purpose               |
| --------------------------- | --------------------- |
| `GET /v1/models`            | List agents as models |
| `POST /v1/chat/completions` | Chat with agent       |
| `POST /v1/responses`        | Agent-native response |
| `POST /v1/embeddings`       | Embedding pipeline    |

All endpoints run on the main gateway port.

## Channels {.cols-2}

### Connect Channels {.row-span-2}

```bash
# List + status
openclaw channels list
openclaw channels status
openclaw channels status --probe

# Login (QR/OAuth flow)
openclaw channels login --channel whatsapp
openclaw channels login --channel telegram

# Add with token (non-interactive)
openclaw channels add \
  --channel telegram --token <BOT_TOKEN>

# Logout / remove
openclaw channels logout --channel whatsapp
openclaw channels remove --channel telegram

# Logs + capabilities
openclaw channels logs
openclaw channels capabilities
```

#### Resolve contact IDs

```bash
openclaw directory self --channel telegram
openclaw directory peers list --channel slack
openclaw directory groups list --channel discord
```

### Supported Channels {.col-span-2}

#### Built-in

| Channel     | Notes                            |
| ----------- | -------------------------------- |
| WhatsApp    | QR pairing via Baileys           |
| Telegram    | Bot API — fastest to set up      |
| Discord     | Bot API + Gateway, DMs + servers |
| BlueBubbles | iMessage via macOS server        |
| Signal      | Via signal-cli                   |
| Slack       | Bolt SDK workspace apps          |
| Google Chat | HTTP webhook                     |
| IRC         | Classic IRC, DMs + channels      |
| QQ Bot      | QQ Bot API                       |
| WebChat     | Built-in browser chat UI         |

{.show-header}

#### Via plugin (`openclaw plugins install`)

- Matrix
- Mattermost
- Microsoft Teams
- LINE
- Nextcloud Talk
- Feishu / Lark
- Nostr
- Synology Chat
- Twitch
- WeChat
- Zalo / Zalo Personal
- Voice Call (Plivo/Twilio)

{.cols-3 .marker-none}

## Messaging {.cols-2}

### Send Messages {.row-span-2}

```bash
# Basic text
openclaw message send \
  --target +15555550123 --message "Hello"

# Telegram by username
openclaw message send \
  --channel telegram --target @user \
  --message "Hello"

# Discord channel
openclaw message send \
  --channel discord --target channel:123 \
  --message "Hello"

# With media
openclaw message send \
  --target +15555550123 \
  --media photo.jpg --message "Look"

# Silent (no notification)
openclaw message send \
  --target +15555550123 \
  --message "Quiet" --silent

# Reply to a message
openclaw message send \
  --target +15555550123 \
  --message "Reply" --reply-to <msg-id>
```

### Read Messages

```bash
openclaw message read \
  --channel whatsapp --target +15555550123

openclaw message read \
  --channel discord --target channel:123 \
  --limit 20 --json
```

### Message Actions

```bash
# Broadcast to multiple targets
openclaw message broadcast \
  --message "Alert" --targets @u1 @u2

# React to a message
openclaw message react \
  --channel discord --target 123 \
  --message-id 456 --emoji "✅"

# Pin / unpin
openclaw message pin \
  --channel discord --target 123 \
  --message-id 456

# Edit / delete
openclaw message edit --message-id 456
openclaw message delete --message-id 456
```

## Agents & Sessions {.cols-3}

### Run Agent {.row-span-2}

```bash
# New session
openclaw agent \
  --to +15555550123 --message "Hello"

# Named agent
openclaw agent \
  --agent ops --message "Status"

# With thinking level
openclaw agent \
  --to +15555550123 \
  --message "Analyze" --thinking high

# Deliver reply back to channel
openclaw agent \
  --to +15555550123 \
  --message "Summary" --deliver

# Cross-channel delivery
openclaw agent \
  --agent ops --message "Report" \
  --deliver \
  --reply-channel slack \
  --reply-to "#reports"

# JSON output + verbose
openclaw agent \
  --to +15555550123 \
  --message "Trace" --verbose on --json
```

### Manage Agents

```bash
openclaw agents list
openclaw agents list --bindings
openclaw agents add work
openclaw agents delete work
openclaw agents bind
openclaw agents unbind
openclaw agents bindings
openclaw agents set-identity \
  --agent work --name "Work Bot"
```

### Sessions

```bash
openclaw sessions              # all sessions
openclaw sessions --agent work
openclaw sessions --all-agents
openclaw sessions --active 120 # last 2h
openclaw sessions --json
openclaw sessions cleanup
```

### Routing Priority {.col-span-2}

| Priority    | Match type                         |
| ----------- | ---------------------------------- |
| 1 (highest) | `peer` — exact DM/group/channel ID |
| 2           | `parentPeer` — thread inheritance  |
| 3           | `guildId` + roles (Discord)        |
| 4           | `guildId` (Discord)                |
| 5           | `teamId` (Slack)                   |
| 6           | `accountId` match for channel      |
| 7           | `accountId: "*"` channel fallback  |
| 8 (lowest)  | Default agent                      |

{.show-header}

## Models {.cols-2}

### Configure Models {.row-span-2}

```bash
# Set primary model
openclaw models set anthropic/claude-sonnet-4-6

# Set image model
openclaw models set-image openai/dall-e-3

# List models
openclaw models list            # configured
openclaw models list --all      # full catalog
openclaw models list --provider anthropic

# Status (auth + model overview)
openclaw models status
openclaw models status --check  # exit 1 if missing

# Aliases
openclaw models aliases list
openclaw models aliases add Sonnet \
  anthropic/claude-sonnet-4-6
openclaw models aliases remove Sonnet

# Fallback chains
openclaw models fallbacks list
openclaw models fallbacks add anthropic/claude-haiku-4-5
openclaw models fallbacks clear
```

### In-chat /model

```bash
/model             # interactive picker
/model list        # numbered model list
/model 3           # select by number
/model openai/gpt-4o
/model status      # auth + provider details
```

Switch takes effect on the next agent run.

### Model Scan (OpenRouter)

```bash
# Scan free models (metadata only)
openclaw models scan --no-probe

# Full scan with capability probe
openclaw models scan \
  --min-params 7 --max-age-days 30

# Auto-set best free model
openclaw models scan \
  --set-default --yes
```

Requires `OPENROUTER_API_KEY` for probing.

## Config & Environment {.cols-2}

### Config Commands {.row-span-2}

```bash
# Show config file path
openclaw config file

# Get a value
openclaw config get gateway.port
openclaw config get channels.telegram.botToken

# Set a value
openclaw config set gateway.port 19001
openclaw config set \
  agents.defaults.model.primary \
  anthropic/claude-sonnet-4-6

# Unset a value
openclaw config unset gateway.port

# Validate config
openclaw config validate

# Print JSON schema
openclaw config schema

# Interactive guided setup
openclaw configure
```

### Environment Variables

| Variable                    | Description            |
| --------------------------- | ---------------------- |
| `OPENCLAW_GATEWAY_PORT`     | Gateway port           |
| `OPENCLAW_GATEWAY_TOKEN`    | Auth token             |
| `OPENCLAW_GATEWAY_PASSWORD` | Auth password          |
| `OPENCLAW_CONFIG_PATH`      | Config file path       |
| `OPENCLAW_STATE_DIR`        | State directory        |
| `OPENCLAW_PROFILE`          | Active profile name    |
| `OPENCLAW_CONTAINER`        | Default container name |

{.bold-first}

### Default Paths

| Path                               | Description         |
| ---------------------------------- | ------------------- |
| `~/.openclaw/openclaw.json`        | Main config         |
| `~/.openclaw/`                     | State directory     |
| `~/.openclaw/workspace`            | Agent workspace     |
| `~/.openclaw/agents/<id>/agent`    | Agent auth + models |
| `~/.openclaw/agents/<id>/sessions` | Session store       |
| `~/.openclaw/credentials/`         | Channel credentials |
| `~/.openclaw/skills/`              | Shared skills       |

{.bold-first}

## Memory & Backup {.cols-3}

### Memory Search

```bash
openclaw memory status
openclaw memory status --deep   # probe embedding
openclaw memory index --force   # full reindex
openclaw memory search "notes"
openclaw memory search \
  --query "deploy" --max-results 20
openclaw memory status --json
```

### Backup & Restore

```bash
# Create backup archive
openclaw backup create

# Verify backup integrity
openclaw backup verify backup.tar.gz
```

Backs up: config, credentials, sessions, workspaces.

### Reset & Update

```bash
# Reset config + state (keeps CLI)
openclaw reset

# Update to latest
openclaw update
openclaw update --channel beta
openclaw update --channel dev
openclaw update --dry-run

# Full uninstall
openclaw uninstall
```

## Plugins & Skills {.cols-3}

### Plugin Commands {.row-span-2}

```bash
# Discover + inspect
openclaw plugins list
openclaw plugins inspect <name>
openclaw plugins marketplace

# Install (path / npm / clawhub)
openclaw plugins install clawhub:mattermost
openclaw plugins install ./my-plugin
openclaw plugins install @org/pkg@latest

# Enable / disable
openclaw plugins enable <name>
openclaw plugins disable <name>

# Update + uninstall
openclaw plugins update
openclaw plugins uninstall <name>

# Diagnose load issues
openclaw plugins doctor
```

### Skill Commands

```bash
openclaw skills list
openclaw skills check      # readiness check
openclaw skills info <name>
openclaw skills search "browser"
openclaw skills install clawhub:browser
openclaw skills update
```

### Hook Commands

```bash
openclaw hooks list
openclaw hooks info <name>
openclaw hooks check
openclaw hooks enable <name>
openclaw hooks disable <name>
```

## Ops & Maintenance {.cols-2}

### Health & Diagnostics {.row-span-2}

```bash
# Quick health checks
openclaw health               # gateway health
openclaw doctor               # check + suggest fixes
openclaw doctor --fix         # apply safe fixes
openclaw status               # channels + sessions
openclaw logs --follow        # tail log file

# Channel readiness
openclaw channels status --probe

# Gateway probe (full)
openclaw gateway probe
openclaw gateway status --deep --json

# Security audit
openclaw security audit
openclaw security audit --deep
openclaw security audit --fix
openclaw security audit --json
```

### Cron Jobs

```bash
openclaw cron list
openclaw cron status

# Add job (every / cron / at)
openclaw cron add \
  --name "daily" \
  --every 24h \
  --message "Daily summary" \
  --agent main --announce

openclaw cron add \
  --cron "0 9 * * *" \
  --message "Morning brief" \
  --tz America/New_York

openclaw cron enable <id>
openclaw cron disable <id>
openclaw cron edit <id>
openclaw cron rm <id>
openclaw cron run <id>   # debug: run now
openclaw cron runs       # run history
```

### Nodes (iOS/Android)

```bash
# List + status
openclaw nodes list
openclaw nodes status

# Pairing
openclaw qr                        # iOS QR code
openclaw nodes pending
openclaw nodes approve --node <id>
openclaw nodes reject  --node <id>

# Media capture
openclaw nodes camera snap --node <id>
openclaw nodes canvas  --node <id>
openclaw nodes screen  --node <id>
openclaw nodes location --node <id>

# Invoke + notify
openclaw nodes invoke \
  --node <id> \
  --command system.which \
  --params '{"name":"uname"}'
openclaw nodes notify \
  --node <id> --message "Hello"
```

### Security Controls

```bash
# DM pairing
openclaw pairing list
openclaw pairing approve <code>

# Exec approvals
openclaw approvals get
openclaw approvals allowlist
openclaw approvals set --file approvals.json

# Device tokens
openclaw devices list
openclaw devices revoke --role admin
openclaw devices rotate --role admin
```

### Multi-agent Config {.col-span-2}

```json
{
  "agents": {
    "list": [
      {
        "id": "chat",
        "workspace": "~/.openclaw/workspace-chat",
        "model": "anthropic/claude-sonnet-4-6"
      },
      {
        "id": "work",
        "workspace": "~/.openclaw/workspace-work",
        "model": "anthropic/claude-opus-4-6"
      }
    ]
  },
  "bindings": [
    { "agentId": "chat", "match": { "channel": "whatsapp" } },
    { "agentId": "work", "match": { "channel": "telegram" } }
  ],
  "channels": {
    "whatsapp": { "dmPolicy": "pairing" },
    "telegram": { "accounts": { "default": { "botToken": "TOKEN" } } }
  },
  "gateway": { "port": 18789, "bind": "loopback" }
}
```

Config lives at `~/.openclaw/openclaw.json` (JSON5 format)

## Also see {.cols-1}

- [Official Documentation](https://docs.openclaw.ai) _(docs.openclaw.ai)_
- [GitHub Repository](https://github.com/openclaw/openclaw) _(github.com)_
- [Discord Community](https://discord.gg/openclaw) _(discord.gg)_
- [Releases & Changelog](https://github.com/openclaw/openclaw/releases) _(github.com)_
- [CLI Reference](https://docs.openclaw.ai/cli) _(docs.openclaw.ai)_
- [Model Providers](https://docs.openclaw.ai/models) _(docs.openclaw.ai)_
- [Channel Setup Guides](https://docs.openclaw.ai/channels) _(docs.openclaw.ai)_
