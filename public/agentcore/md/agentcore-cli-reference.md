# AgentCore CLI reference - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-cli-reference.html

---

# AgentCore CLI reference

This reference documents the public Amazon Bedrock AgentCore CLI releases.

###### Topics

  * Project Lifecycle

  * Resource Management

  * Optimization & Config Bundles


## Project Lifecycle

_Auto-generated from`@aws/agentcore` v0.24.2 — do not edit by hand._

### agentcore create

```bash
agentcore create [options]
```
Create a new AgentCore project

**Parameters**

`--name <name>` _(optional)_
    

Resource name [non-interactive]

`--project-name <name>` _(optional)_
    

Project name (start with letter, alphanumeric only, max 23 chars) [non-interactive]

`--no-agent` _(optional)_
    

Skip agent creation [non-interactive]

`--defaults` _(optional)_
    

Create a harness project with default settings (this is the default) [non-interactive]

`--build <type>` _(optional)_
    

Build type: CodeZip or Container (default: CodeZip) [non-interactive]

`--language <language>` _(optional)_
    

Target language: Python or TypeScript (default: Python) [non-interactive]

`--framework <framework>` _(optional)_
    

Agent framework (Strands, LangChain_LangGraph, GoogleADK, OpenAIAgents, VercelAI) [non-interactive]

`--model-provider <provider>` _(optional)_
    

Model provider (Bedrock, Anthropic, OpenAI, Gemini) [non-interactive]

`--api-key <key>` _(optional)_
    

API key for non-Bedrock providers [non-interactive]

`--memory <option>` _(optional)_
    

Memory option (none, shortTerm, longAndShortTerm) [non-interactive]

`--protocol <protocol>` _(optional)_
    

Protocol: HTTP, MCP, A2A, AGUI (default: HTTP) [non-interactive]

`--type <type>` _(optional)_
    

Agent type: create or import (default: create) [non-interactive]

`--agent-id <id>` _(optional)_
    

Bedrock Agent ID (required for --type import) [non-interactive]

`--agent-alias-id <id>` _(optional)_
    

Bedrock Agent Alias ID (required for --type import) [non-interactive]

`--region <region>` _(optional)_
    

The AWS Region for Bedrock Agent (required for --type import) [non-interactive]

`--network-mode <mode>` _(optional)_
    

Network mode (PUBLIC, VPC) [non-interactive]

`--subnets <ids>` _(optional)_
    

Comma-separated subnet IDs (required for VPC mode) [non-interactive]

`--security-groups <ids>` _(optional)_
    

Comma-separated security group IDs (required for VPC mode) [non-interactive]

`--vpc-id <id>` _(optional)_
    

VPC ID (required for Container builds with VPC mode) [non-interactive]

`--idle-timeout <seconds>` _(optional)_
    

Idle session timeout in seconds (60-28800) [non-interactive]

`--max-lifetime <seconds>` _(optional)_
    

Max instance lifetime in seconds (60-28800) [non-interactive]

`--session-storage-mount-path <path>` _(optional)_
    

Absolute mount path for session filesystem storage under /mnt (for example, /mnt/data) [non-interactive]

`--efs-access-point-arn <arn>` _(optional)_
    

EFS access point ARN (repeatable, paired with --efs-mount-path) [non-interactive] (default: [])

`--efs-mount-path <path>` _(optional)_
    

EFS mount path (for example, /mnt/tools, paired with --efs-access-point-arn) [non-interactive] (default: [])

`--s3-access-point-arn <arn>` _(optional)_
    

S3 Files access point ARN (repeatable, paired with --s3-mount-path) [non-interactive] (default: [])

`--s3-mount-path <path>` _(optional)_
    

S3 Files mount path (for example, /mnt/datasets, paired with --s3-access-point-arn) [non-interactive] (default: [])

`--with-config-bundle` _(optional)_
    

Create a config bundle wired into the agent template [non-interactive]

`--output-dir <dir>` _(optional)_
    

Output directory (default: current directory) [non-interactive]

`--skip-git` _(optional)_
    

Skip git repository initialization [non-interactive]

`--skip-python-setup` _(optional)_
    

Skip Python virtual environment setup [non-interactive]

`--skip-install` _(optional)_
    

Skip all dependency installation (npm install, uv sync) [non-interactive]

`--dry-run` _(optional)_
    

Preview what would be created without making changes [non-interactive]

`--json` _(optional)_
    

Output as JSON [non-interactive]

`--model-id <id>` _(optional)_
    

Model ID for harness [non-interactive]

`--api-key-arn <arn>` _(optional)_
    

API key ARN for non-Bedrock harness providers [non-interactive]

`--api-base <url>` _(optional)_
    

Base URL for the harness model provider API endpoint (lite_llm) [non-interactive]

`--additional-params <json>` _(optional)_
    

Provider-specific harness params as a JSON object (lite_llm) [non-interactive]

`--no-harness-memory` _(optional)_
    

Disable memory for the harness (this is the default) [non-interactive]

`--max-iterations <n>` _(optional)_
    

Max agent loop iterations (harness) [non-interactive]

`--max-tokens <n>` _(optional)_
    

Max tokens per iteration (harness) [non-interactive]

`--timeout <seconds>` _(optional)_
    

Max execution duration in seconds (harness) [non-interactive]

`--truncation-strategy <strategy>` _(optional)_
    

Truncation strategy: sliding_window or summarization (harness) [non-interactive]

`--container <uri-or-path>` _(optional)_
    

Container image URI or Dockerfile path (harness) [non-interactive]

### agentcore deploy

```bash
agentcore deploy|dp [options]
```
Deploy project infrastructure to AWS via CDK.

**Parameters**

`--target <target>` _(optional)_
    

Deployment target name (default: "default") [non-interactive]

`-y, --yes` _(optional)_
    

Auto-confirm prompts, read credentials from env [non-interactive]

`-v, --verbose` _(optional)_
    

Show resource-level deployment events [non-interactive]

`--json` _(optional)_
    

Output as JSON [non-interactive]

`--dry-run` _(optional)_
    

Preview deployment without deploying [non-interactive]

`--diff` _(optional)_
    

Show CDK diff without deploying [non-interactive]

### agentcore dev

```bash
agentcore dev|d [options] [prompt]
```
Launch local dev server, or invoke an agent locally.

**Parameters**

`prompt`
    

Send a prompt to a running dev server [non-interactive]

`-p, --port <port>` _(optional)_
    

Port for development server. Used as-is when set explicitly; the default is offset by the runtime index in multi-runtime projects. (default: "8080")

`-r, --runtime <name>` _(optional)_
    

Runtime to run or invoke (required if multiple runtimes)

`-s, --stream` _(optional)_
    

Stream response when invoking [non-interactive]

`-l, --logs` _(optional)_
    

Run dev server with logs to stdout [non-interactive]

`--exec` _(optional)_
    

Execute a shell command in the running dev container (Container agents only) [non-interactive]

`--tool <name>` _(optional)_
    

MCP tool name (used with "call-tool" prompt) [non-interactive]

`--input <json>` _(optional)_
    

MCP tool arguments as JSON (used with --tool) [non-interactive]

`--skip-deploy` _(optional)_
    

Skip automatic resource deployment before starting dev server

`-H, --header <header>` _(optional)_
    

Custom header to forward to the agent (format: "Name: Value", repeatable) [non-interactive] (default: [])

`-b, --no-browser` _(optional)_
    

Use terminal TUI instead of web-based chat UI

`--no-traces` _(optional)_
    

Disable local OTEL trace collection

### agentcore package

```bash
agentcore package|pkg [options]
```
Package agent artifacts without deploying.

**Parameters**

`-d, --directory <path>` _(optional)_
    

Project directory containing agentcore config

`-r, --runtime <name>` _(optional)_
    

Package only the specified runtime

### agentcore export

```bash
agentcore export [options] [command]
```
Export a harness to a Strands runtime agent.

### agentcore update

```bash
agentcore update [options] [command]
```
Check for and install CLI updates

**Parameters**

`-c, --check` _(optional)_
    

Check for updates without installing

### agentcore validate

```bash
agentcore validate [options]
```
Validate agentcore/ config files.

**Parameters**

`-d, --directory <path>` _(optional)_
    

Project directory containing agentcore config

`--json` _(optional)_
    

Output as JSON [non-interactive]

## Resource Management

_Auto-generated from`@aws/agentcore` v0.24.2 — do not edit by hand._

### agentcore add

```bash
agentcore add [options] [command] [subcommand]
```
Add resources to project config.

### agentcore remove

```bash
agentcore remove [options] [command] [subcommand]
```
Remove resources from project config.

### agentcore import

```bash
agentcore import [options] [command]
```
Import a runtime, memory, or starter toolkit into this project.

**Parameters**

`--source <path>` _(optional)_
    

Path to the .bedrock_agentcore.yaml configuration file

`--target <target>` _(optional)_
    

Deployment target name (only needed if project has multiple targets)

`-y, --yes` _(optional)_
    

Auto-confirm prompts

## Optimization & Config Bundles

_Auto-generated from`@aws/agentcore` v0.24.2 — do not edit by hand._

### agentcore config-bundle

```bash
agentcore config-bundle|cb [options] [command]
```
Manage configuration bundles (use bundle name from agentcore.json, not the ID)

### agentcore promote

```bash
agentcore promote [options] [command]
```
Promote resources

### agentcore archive

```bash
agentcore archive [options] [command]
```
Archive (delete) a batch evaluation or recommendation on the service and clear local history.

