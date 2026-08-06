# Shell execution - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-shell-execution.html

---

# Shell execution

Amazon Bedrock AgentCore Runtime lets you run shell commands inside a running agent’s session. Two modes are available depending on your use case:

One-shot command execution - `InvokeAgentRuntimeCommand`
    

Runs a single command, streams stdout/stderr over HTTP/2, and returns the exit code. Each command starts a fresh shell process with no persistent state. Best for automated pipelines, CI/CD gates, and deterministic operations.

Interactive shells (terminals) - `InvokeAgentRuntimeCommandShell`
    

Opens a persistent terminal session over WebSocket with full shell state (environment variables, working directory, history). Supports reconnection via `shellId`. Best for debugging, environment inspection, and terminal UIs.

**Feature comparison**

Feature | One-shot (`InvokeAgentRuntimeCommand`) | Interactive (`InvokeAgentRuntimeCommandShell`)  
---|---|---  
Protocol |  HTTP/2 (request-response stream) |  WebSocket (persistent connection)  
Shell state |  Stateless — each command starts a fresh process |  Persistent — environment, working directory, and history carry across commands  
Output format |  Structured events (`contentStart`, `contentDelta`, `contentStop` with exit code) |  Binary frames (raw terminal I/O — supports colors, cursor control, full-screen apps)  
Reconnection |  No — each call is independent |  Yes, via `shellId`  
Duration |  Configurable timeout (1–3,600 seconds) |  1 hour max (reconnect with same `shellId` to continue)  
  
**Choosing the right mode**

Use one-shot execution when…​ | Use interactive shells when…​  
---|---  
The operation has a known command (`npm test`, `git push`) |  You need persistent shell state across multiple commands  
You want deterministic execution with a structured exit code |  You want to explore the environment interactively  
You’re automating a CI/CD pipeline step or validation gate |  You’re building a terminal UI (Claude Code, Amazon Kiro, OpenAI Codex)  
Each command is independent with no shared state |  You need reconnection support for long-running work  
You’re bootstrapping the environment before the agent starts |  You’re debugging or inspecting a running agent  
  
###### Topics

  * [Execute shell commands in AgentCore Runtime sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-execute-command.html>)

  * [Interactive Shells (Terminals)](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-command-shell.html>)



