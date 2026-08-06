// Auto-generated index of the Amazon Bedrock AgentCore Developer Guide.
//
// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/
// 516 pages across 17 sections. The page bodies live as Markdown
// under public/agentcore/md/ and are fetched on demand by AgentCoreViewer;
// referenced diagrams live under public/agentcore/images/.
//
// Regenerate rather than hand-edit.

export const AGENTCORE_SOURCE_URL =
  "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/";

export const AGENTCORE_TOTAL_PAGES = 516;

export const AGENTCORE_SECTIONS = [
  {
    "id": "intro",
    "label": "Introduction",
    "icon": "Compass",
    "color": "#00d4ff",
    "blurb": "What AgentCore is, where it runs, and how to get moving with the CLI.",
    "pages": [
      {
        "slug": "what-is-bedrock-agentcore",
        "title": "Overview",
        "desc": "Amazon Bedrock AgentCore is an agentic platform for building, deploying, and operating highly effective agents securely at scale using any framework and foundation model. With AgentCore, you can...",
        "file": "/agentcore/md/what-is-bedrock-agentcore.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html"
      },
      {
        "slug": "agentcore-regions",
        "title": "Supported AWS Regions",
        "desc": "The following table shows which features are supported in each AWS Region:",
        "file": "/agentcore/md/agentcore-regions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html"
      },
      {
        "slug": "agentcore-get-started-cli",
        "title": "Get started with Amazon Bedrock AgentCore",
        "desc": "This quickstart gets you from zero to a running agent in a few minutes using the AgentCore CLI. You will install the CLI, scaffold a project, test locally, deploy to AWS, and invoke your agent.",
        "file": "/agentcore/md/agentcore-get-started-cli.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html"
      }
    ]
  },
  {
    "id": "harness",
    "label": "Harness",
    "icon": "Boxes",
    "color": "#7c5cff",
    "blurb": "The managed agent harness: models, tools, skills, memory, and operations.",
    "pages": [
      {
        "slug": "harness",
        "title": "AgentCore harness",
        "desc": "Every agent has an orchestration layer: a loop that calls the model, picks tools, passes results back, manages context, and handles failures. Running it in production takes real infrastructure...",
        "file": "/agentcore/md/harness.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness.html"
      },
      {
        "slug": "harness-get-started",
        "title": "Get started",
        "desc": "You can use the harness through the AgentCore CLI or directly with AWS SDKs such as boto3. The CLI is the fastest path for most developers; SDKs are for programmatic use from your own application.",
        "file": "/agentcore/md/harness-get-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-get-started.html"
      },
      {
        "slug": "harness-models",
        "title": "Models and instructions",
        "desc": "Define a harness once with defaults for model, system prompt, tools, memory, and execution limits. Override any of those on a single invocation when you want to experiment. The harness resource...",
        "file": "/agentcore/md/harness-models.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-models.html"
      },
      {
        "slug": "harness-tools",
        "title": "Tools",
        "desc": "Tools are declarative. You list what the agent can call; AgentCore handles invocation, credentials, and results. The harness supports five tool types, plus the built-in filesystem and shell tools.",
        "file": "/agentcore/md/harness-tools.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-tools.html"
      },
      {
        "slug": "harness-skills",
        "title": "Skills",
        "desc": "Skills use progressive disclosure: metadata is injected into the system prompt upfront (~100 tokens), and full instructions are loaded on demand via a tool call. This avoids flooding the context...",
        "file": "/agentcore/md/harness-skills.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-skills.html"
      },
      {
        "slug": "harness-memory",
        "title": "Memory",
        "desc": "The harness automatically persists conversation state in AgentCore Memory. On every invocation, the conversation is saved, scoped by session ID (and additionally by actor ID, if provided). On...",
        "file": "/agentcore/md/harness-memory.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-memory.html"
      },
      {
        "slug": "harness-environment",
        "title": "Environment and filesystem",
        "desc": "Every harness session runs in an isolated microVM with its own filesystem and shell. This page covers configuring the execution environment (default or custom container), running commands directly...",
        "file": "/agentcore/md/harness-environment.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-environment.html"
      },
      {
        "slug": "harness-operations",
        "title": "Observability and cost controls",
        "desc": "This page covers monitoring your harness, controlling execution costs, and managing resource tags.",
        "file": "/agentcore/md/harness-operations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-operations.html"
      },
      {
        "slug": "harness-versioning",
        "title": "AgentCore harness versioning and endpoints",
        "desc": "Amazon Bedrock AgentCore implements automatic versioning for AgentCore harnesses and lets you manage different configurations using endpoints. Harness versioning works the same way as AgentCore...",
        "file": "/agentcore/md/harness-versioning.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-versioning.html"
      },
      {
        "slug": "harness-export",
        "title": "Export harness to code",
        "desc": "Export harness to code takes a managed harness configuration and generates the equivalent agent as editable Python source code using the Strands framework. The generated agent is a normal...",
        "file": "/agentcore/md/harness-export.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-export.html"
      },
      {
        "slug": "harness-security",
        "title": "Security and access controls",
        "desc": "The harness gives you the same security primitives as the rest of AgentCore, wired in by configuration.",
        "file": "/agentcore/md/harness-security.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-security.html"
      },
      {
        "slug": "harness-vs-runtime",
        "title": "AgentCore harness vs. Runtime",
        "desc": "AgentCore harness and AgentCore Runtime solve different parts of the same problem. This page explains the conceptual difference and provides a feature-by-feature comparison to help you choose...",
        "file": "/agentcore/md/harness-vs-runtime.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-vs-runtime.html"
      }
    ]
  },
  {
    "id": "runtime",
    "label": "Runtime",
    "icon": "Rocket",
    "color": "#00ff88",
    "blurb": "Deploy and serve agents — protocols, sessions, streaming, and invocation.",
    "pages": [
      {
        "slug": "develop-agents",
        "title": "Understand the available interfaces for using Amazon Bedrock AgentCore",
        "desc": "Amazon Bedrock AgentCore supports various interfaces for developing and deploying your agent code. The simplest approach is to use the AgentCore Python SDK to create your agent code and use the...",
        "file": "/agentcore/md/develop-agents.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/develop-agents.html"
      },
      {
        "slug": "agents-tools-runtime",
        "title": "Host agent or tools with Amazon Bedrock AgentCore Runtime",
        "desc": "Amazon Bedrock AgentCore Runtime provides a secure, serverless and purpose-built hosting environment for deploying and running AI agents or tools. It offers the following benefits:",
        "file": "/agentcore/md/agents-tools-runtime.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html"
      },
      {
        "slug": "runtime-how-it-works",
        "title": "How it works",
        "desc": "The Amazon Bedrock AgentCore Runtime handles scaling, session management, security isolation, and infrastructure management, allowing you to focus on building intelligent agent experiences rather...",
        "file": "/agentcore/md/runtime-how-it-works.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html"
      },
      {
        "slug": "runtime-service-contract",
        "title": "Understand the AgentCore Runtime service contract",
        "desc": "The AgentCore Runtime service contract defines the standardized communication protocol that your agent application must implement to integrate with the Amazon Bedrock agent hosting infrastructure....",
        "file": "/agentcore/md/runtime-service-contract.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html"
      },
      {
        "slug": "runtime-http-protocol-contract",
        "title": "HTTP protocol contract",
        "desc": "Understand the requirements for implementing the HTTP protocol in your agent application. Use the HTTP protocol to create direct REST API endpoints for traditional request/response patterns and...",
        "file": "/agentcore/md/runtime-http-protocol-contract.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-http-protocol-contract.html"
      },
      {
        "slug": "runtime-mcp-protocol-contract",
        "title": "MCP protocol contract",
        "desc": "Understand the requirements for implementing the Model Context Protocol (MCP) so that agents can call tools and agent servers.",
        "file": "/agentcore/md/runtime-mcp-protocol-contract.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-mcp-protocol-contract.html"
      },
      {
        "slug": "runtime-a2a-protocol-contract",
        "title": "A2A protocol contract",
        "desc": "The A2A protocol contract defines the requirements for implementing agent-to-agent communication in Amazon Bedrock AgentCore Runtime. This contract specifies the technical requirements, endpoints,...",
        "file": "/agentcore/md/runtime-a2a-protocol-contract.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-a2a-protocol-contract.html"
      },
      {
        "slug": "runtime-agui-protocol-contract",
        "title": "AG-UI protocol contract",
        "desc": "The AG-UI protocol contract defines the requirements for implementing agent-to-user interface communication in Amazon Bedrock AgentCore Runtime. This contract specifies the technical requirements,...",
        "file": "/agentcore/md/runtime-agui-protocol-contract.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-agui-protocol-contract.html"
      },
      {
        "slug": "runtime-permissions",
        "title": "IAM Permissions for AgentCore Runtime",
        "desc": "The following are IAM permissions you need to create an agent in an AgentCore Runtime and the execution role permissions that an agent needs to run in an AgentCore Runtime. You can also use...",
        "file": "/agentcore/md/runtime-permissions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html"
      },
      {
        "slug": "runtime-getting-started",
        "title": "Get started with AgentCore Runtime",
        "desc": "You can use the following tutorials to get started with Amazon Bedrock AgentCore Runtime.",
        "file": "/agentcore/md/runtime-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-getting-started.html"
      },
      {
        "slug": "runtime-get-started-cli",
        "title": "Get started with the AgentCore CLI",
        "desc": "This tutorial shows you how to use the AgentCore CLI to create, deploy, and invoke a Python agent on Amazon Bedrock AgentCore Runtime.",
        "file": "/agentcore/md/runtime-get-started-cli.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html"
      },
      {
        "slug": "runtime-get-started-cli-typescript",
        "title": "Get started with the AgentCore CLI in TypeScript",
        "desc": "This tutorial shows you how to use the AgentCore CLI to create, deploy, and invoke a TypeScript agent on Amazon Bedrock AgentCore Runtime. This tutorial takes approximately 20 minutes to complete.",
        "file": "/agentcore/md/runtime-get-started-cli-typescript.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli-typescript.html"
      },
      {
        "slug": "getting-started-custom",
        "title": "Get started without the AgentCore CLI",
        "desc": "You can create a AgentCore Runtime agent without the AgentCore CLI. Instead you can use a combination of command line tools to configure and deploy your agent to an AgentCore Runtime.",
        "file": "/agentcore/md/getting-started-custom.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html"
      },
      {
        "slug": "runtime-get-started-code-deploy",
        "title": "Get started with Amazon Bedrock AgentCore Runtime direct code deployment",
        "desc": "Direct code deployment enables you to bring your agent to Amazon Bedrock AgentCore Runtime simply by packaging agent code and its dependencies in a .zip file archive. Your agent still needs to...",
        "file": "/agentcore/md/runtime-get-started-code-deploy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy.html"
      },
      {
        "slug": "runtime-get-started-code-deploy-python",
        "title": "Direct code deployment for Python",
        "desc": "Direct code deployment enables you to bring your Python-based agent to Amazon Bedrock AgentCore Runtime simply by packaging agent code and its dependencies in a .zip file archive. Your agent still...",
        "file": "/agentcore/md/runtime-get-started-code-deploy-python.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy-python.html"
      },
      {
        "slug": "runtime-get-started-code-deploy-node",
        "title": "Direct code deployment for Node.js",
        "desc": "Direct code deployment enables you to bring your Node.js-based agent to Amazon Bedrock AgentCore Runtime simply by packaging agent code and its dependencies in a .zip file archive. Your agent...",
        "file": "/agentcore/md/runtime-get-started-code-deploy-node.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy-node.html"
      },
      {
        "slug": "runtime-code-deploy-supported-runtimes",
        "title": "Supported language runtimes and deprecation policy",
        "desc": "The following table lists the supported AgentCore Runtime direct code deploy language runtimes and projected deprecation dates. After a language environment is deprecated, you’re still able to...",
        "file": "/agentcore/md/runtime-code-deploy-supported-runtimes.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-code-deploy-supported-runtimes.html"
      },
      {
        "slug": "runtime-code-deploy-common-issues",
        "title": "Troubleshooting direct code deployment",
        "desc": "Common issues and solutions when getting started with Amazon Bedrock AgentCore direct code deployment. For more troubleshooting information, see Troubleshoot Amazon Bedrock AgentCore Runtime.",
        "file": "/agentcore/md/runtime-code-deploy-common-issues.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-code-deploy-common-issues.html"
      },
      {
        "slug": "runtime-get-started-websocket",
        "title": "Get started with bidirectional streaming using WebSocket",
        "desc": "Amazon Bedrock AgentCore Runtime lets you deploy agents that support WebSocket streaming for real-time bidirectional communication. This guide walks you through creating, testing, and deploying...",
        "file": "/agentcore/md/runtime-get-started-websocket.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-websocket.html"
      },
      {
        "slug": "using-any-agent-framework",
        "title": "Use any agent framework",
        "desc": "You can use open source AI frameworks to create an agent or tool. This topic shows examples for a variety of frameworks, including Strands Agents, LangGraph, and Google ADK.",
        "file": "/agentcore/md/using-any-agent-framework.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/using-any-agent-framework.html"
      },
      {
        "slug": "using-any-model",
        "title": "Use any foundation model",
        "desc": "You can use any foundation model with AgentCore Runtime The following are examples for Amazon Bedrock, Open AI, Gemini and Fireworks AI:",
        "file": "/agentcore/md/using-any-model.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/using-any-model.html"
      },
      {
        "slug": "runtime-mcp",
        "title": "Deploy MCP servers in AgentCore Runtime",
        "desc": "Amazon Bedrock AgentCore Runtime lets you deploy and run Model Context Protocol (MCP) servers in the AgentCore Runtime. This guide walks you through creating, testing, and deploying your first MCP...",
        "file": "/agentcore/md/runtime-mcp.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-mcp.html"
      },
      {
        "slug": "mcp-stateful-features",
        "title": "Stateful MCP server features",
        "desc": "The Model Context Protocol (MCP) provides a standardized way for AI applications to interact with external data and capabilities. This guide demonstrates how to build a comprehensive MCP server...",
        "file": "/agentcore/md/mcp-stateful-features.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/mcp-stateful-features.html"
      },
      {
        "slug": "runtime-a2a",
        "title": "Deploy A2A servers in AgentCore Runtime",
        "desc": "Amazon Bedrock AgentCore AgentCore Runtime lets you deploy and run Agent-to-Agent (A2A) servers in the AgentCore Runtime. This guide walks you through creating, testing, and deploying your first...",
        "file": "/agentcore/md/runtime-a2a.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-a2a.html"
      },
      {
        "slug": "runtime-agui",
        "title": "Deploy AG-UI servers in AgentCore Runtime",
        "desc": "Amazon Bedrock AgentCore Runtime lets you deploy and run Agent User Interface (AG-UI) servers in the AgentCore Runtime. This guide walks you through creating, testing, and deploying your first...",
        "file": "/agentcore/md/runtime-agui.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-agui.html"
      },
      {
        "slug": "runtime-sessions",
        "title": "Use isolated sessions for agents",
        "desc": "Amazon Bedrock AgentCore Runtime lets you isolate each user session and safely reuse context across multiple invocations in a user session. Session isolation is critical for AI agent workloads due...",
        "file": "/agentcore/md/runtime-sessions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html"
      },
      {
        "slug": "runtime-lifecycle-settings",
        "title": "Configure Amazon Bedrock AgentCore lifecycle settings",
        "desc": "The LifecycleConfiguration input parameter to CreateAgentRuntime lets you manage the lifecycle of runtime sessions and resources in Amazon Bedrock AgentCore Runtime. This configuration helps...",
        "file": "/agentcore/md/runtime-lifecycle-settings.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html"
      },
      {
        "slug": "runtime-stop-session",
        "title": "Stop a running session",
        "desc": "The StopRuntimeSession operation lets you immediately terminate active agent AgentCore Runtime sessions for proper resource cleanup and session lifecycle management.",
        "file": "/agentcore/md/runtime-stop-session.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-stop-session.html"
      },
      {
        "slug": "runtime-filesystem-configurations",
        "title": "File system configurations for AgentCore Runtime",
        "desc": "AgentCore Runtime supports persistent file systems through the filesystemConfigurations parameter. Each configuration mounts storage at a path you specify. You don’t need custom mount code,...",
        "file": "/agentcore/md/runtime-filesystem-configurations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html"
      },
      {
        "slug": "runtime-long-run",
        "title": "Handle asynchronous and long running agents with Amazon Bedrock AgentCore Runtime",
        "desc": "Amazon Bedrock AgentCore Runtime can handle asynchronous processing and long running agents. Asynchronous tasks allow your agent to continue processing after responding to the client and handle...",
        "file": "/agentcore/md/runtime-long-run.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-long-run.html"
      },
      {
        "slug": "response-streaming",
        "title": "Stream agent responses",
        "desc": "The following Strands Agents example shows how an AgentCore Runtime agent can stream a response back to a client.",
        "file": "/agentcore/md/response-streaming.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/response-streaming.html"
      },
      {
        "slug": "runtime-bidirectional-streaming",
        "title": "Bidirectional streaming",
        "desc": "Amazon Bedrock AgentCore Runtime supports bidirectional streaming, enabling real-time, two-way communication between clients and agents. This is essential for interactive applications such as...",
        "file": "/agentcore/md/runtime-bidirectional-streaming.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-bidirectional-streaming.html"
      },
      {
        "slug": "runtime-bidirectional-streaming-websocket",
        "title": "Bidirectional streaming with WebSocket",
        "desc": "To get started with WebSocket streaming, see Get started with bidirectional streaming using WebSocket.",
        "file": "/agentcore/md/runtime-bidirectional-streaming-websocket.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-bidirectional-streaming-websocket.html"
      },
      {
        "slug": "runtime-webrtc",
        "title": "Bidirectional streaming with WebRTC",
        "desc": "With Amazon Bedrock AgentCore Runtime, you can use WebRTC (Web Real-Time Communication) to enable real-time media streaming between clients and agents. WebRTC is useful when building voice agents...",
        "file": "/agentcore/md/runtime-webrtc.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-webrtc.html"
      },
      {
        "slug": "runtime-webrtc-get-started-kvs",
        "title": "Tutorial: WebRTC with TURN relaying using Amazon Kinesis Video Streams",
        "desc": "In this tutorial, you build a WebRTC voice connection between a browser client and an agent running on AgentCore Runtime, using Amazon Kinesis Video Streams (KVS) managed TURN for media relaying....",
        "file": "/agentcore/md/runtime-webrtc-get-started-kvs.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-webrtc-get-started-kvs.html"
      },
      {
        "slug": "runtime-bidirectional-streaming-examples",
        "title": "Code examples",
        "desc": "The following sample applications demonstrate bidirectional streaming on Amazon Bedrock AgentCore Runtime.",
        "file": "/agentcore/md/runtime-bidirectional-streaming-examples.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-bidirectional-streaming-examples.html"
      },
      {
        "slug": "runtime-header-allowlist",
        "title": "Pass custom headers to Amazon Bedrock AgentCore Runtime",
        "desc": "Custom headers let you pass contextual information from your application directly to your agent code without cluttering the main request payload. You can pass any valid HTTP header that is not in...",
        "file": "/agentcore/md/runtime-header-allowlist.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-header-allowlist.html"
      },
      {
        "slug": "runtime-oauth",
        "title": "Authenticate and authorize with Inbound Auth and Outbound Auth",
        "desc": "This section shows you how to implement authentication and authorization for your agent runtime using OAuth and JWT bearer tokens with AgentCore Identity . You’ll learn how to set up Cognito user...",
        "file": "/agentcore/md/runtime-oauth.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-oauth.html"
      },
      {
        "slug": "agent-runtime-versioning",
        "title": "AgentCore Runtime versioning and endpoints",
        "desc": "Amazon Bedrock AgentCore implements automatic versioning for AgentCore Runtimes and lets you manage different configurations using endpoints.",
        "file": "/agentcore/md/agent-runtime-versioning.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agent-runtime-versioning.html"
      },
      {
        "slug": "runtime-invoke-agent",
        "title": "Invoke an AgentCore Runtime agent",
        "desc": "The InvokeAgentRuntime operation lets you send requests to specific AgentCore Runtime endpoints identified by their Amazon Resource Name (ARN) and receive streaming responses containing the...",
        "file": "/agentcore/md/runtime-invoke-agent.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-invoke-agent.html"
      },
      {
        "slug": "runtime-shell-execution",
        "title": "Shell execution",
        "desc": "Amazon Bedrock AgentCore Runtime lets you run shell commands inside a running agent’s session. Two modes are available depending on your use case:",
        "file": "/agentcore/md/runtime-shell-execution.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-shell-execution.html"
      },
      {
        "slug": "runtime-execute-command",
        "title": "Execute shell commands in AgentCore Runtime sessions",
        "desc": "The InvokeAgentRuntimeCommand operation lets you execute shell commands directly inside a running AgentCore Runtime session and stream the output back over HTTP/2. Commands run in the same...",
        "file": "/agentcore/md/runtime-execute-command.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-execute-command.html"
      },
      {
        "slug": "runtime-get-started-command-shell",
        "title": "Interactive Shells (Terminals)",
        "desc": "The InvokeAgentRuntimeCommandShell operation opens a persistent, interactive terminal session inside a running AgentCore Runtime session over WebSocket. Unlike one-shot command execution, shell...",
        "file": "/agentcore/md/runtime-get-started-command-shell.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-command-shell.html"
      },
      {
        "slug": "runtime-observability",
        "title": "Observe agents in Amazon Bedrock AgentCore Runtime",
        "desc": "For information about the AgentCore Runtime observability metrics, see Add observability to your Amazon Bedrock AgentCore resources.",
        "file": "/agentcore/md/runtime-observability.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-observability.html"
      },
      {
        "slug": "runtime-security-best-practices",
        "title": "Security best practices for AgentCore Runtime",
        "desc": "This topic consolidates security best practices for Amazon Bedrock AgentCore Runtime. Use these recommendations to secure your agent deployments, protect data, and follow the principle of least...",
        "file": "/agentcore/md/runtime-security-best-practices.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-security-best-practices.html"
      },
      {
        "slug": "runtime-troubleshooting",
        "title": "Troubleshoot AgentCore Runtime",
        "desc": "This troubleshooting topic helps you identify and resolve common issues when working with AgentCore Runtime. By following these solutions, you can quickly diagnose and fix problems with your agent...",
        "file": "/agentcore/md/runtime-troubleshooting.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-troubleshooting.html"
      }
    ]
  },
  {
    "id": "memory",
    "label": "Memory",
    "icon": "Database",
    "color": "#ff9f1c",
    "blurb": "Short-term events and long-term strategies that let agents remember.",
    "pages": [
      {
        "slug": "memory",
        "title": "Add memory to your Amazon Bedrock AgentCore agent",
        "desc": "AgentCore Memory is a fully managed service that gives your AI agents the ability to remember past interactions, enabling them to provide more intelligent, context-aware, and personalized...",
        "file": "/agentcore/md/memory.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html"
      },
      {
        "slug": "how-it-works",
        "title": "How it works",
        "desc": "AgentCore Memory provides a set of APIs that let your AI agents seamlessly store, retrieve, and utilize both short-term and long-term memory. The architecture is designed to separate the immediate...",
        "file": "/agentcore/md/how-it-works.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/how-it-works.html"
      },
      {
        "slug": "memory-terminology",
        "title": "Memory terminology",
        "desc": "The primary, top-level container for your agent’s memory resource. Each AgentCore Memory holds all the events and extracted insights for agents or applications.",
        "file": "/agentcore/md/memory-terminology.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-terminology.html"
      },
      {
        "slug": "memory-types",
        "title": "Memory types",
        "desc": "AgentCore Memory offers two types of memory that work together to create intelligent, context-aware AI agents:",
        "file": "/agentcore/md/memory-types.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-types.html"
      },
      {
        "slug": "memory-strategies",
        "title": "Memory strategies",
        "desc": "In AgentCore Memory, you can add memory strategies to your memory resource. These strategies determine what types of information to extract from raw conversations. Strategies are configurations...",
        "file": "/agentcore/md/memory-strategies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-strategies.html"
      },
      {
        "slug": "built-in-strategies",
        "title": "Built-in strategies",
        "desc": "AgentCore Memory provides built-in strategies to create memories. Each built-in strategy consists of steps to handle memory creation, including the following (different strategies employ different...",
        "file": "/agentcore/md/built-in-strategies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/built-in-strategies.html"
      },
      {
        "slug": "semantic-memory-strategy",
        "title": "Semantic memory strategy",
        "desc": "The semantic memory strategy is designed to identify and extract key pieces of factual information and contextual knowledge from conversational data. This lets your agent to build a persistent...",
        "file": "/agentcore/md/semantic-memory-strategy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/semantic-memory-strategy.html"
      },
      {
        "slug": "memory-system-prompt",
        "title": "System prompt for semantic memory strategy",
        "desc": "The semantic strategy includes instructions and output schemas in the default prompts for the extraction and consolidation steps.",
        "file": "/agentcore/md/memory-system-prompt.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-system-prompt.html"
      },
      {
        "slug": "user-preference-memory-strategy",
        "title": "User preference memory strategy",
        "desc": "The UserPreferenceMemoryStrategy is designed to automatically identify and extract user preferences, choices, and styles from conversational data. This lets your agent to learn from interactions...",
        "file": "/agentcore/md/user-preference-memory-strategy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/user-preference-memory-strategy.html"
      },
      {
        "slug": "memory-user-prompt",
        "title": "System prompt for user preference memory strategy",
        "desc": "The user preference strategy includes instructions and output schemas in the default prompts for the extraction and consolidation steps.",
        "file": "/agentcore/md/memory-user-prompt.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-user-prompt.html"
      },
      {
        "slug": "summary-strategy",
        "title": "Summary strategy",
        "desc": "The SummaryStrategy is responsible for generating condensed, real-time summaries of conversations within a single session. It captures key topics, main tasks, and decisions, providing a high-level...",
        "file": "/agentcore/md/summary-strategy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/summary-strategy.html"
      },
      {
        "slug": "memory-summary-prompt",
        "title": "System prompt for summary strategy",
        "desc": "The semantic strategy includes instructions and an output schema in the default system prompt for a single consolidation step.",
        "file": "/agentcore/md/memory-summary-prompt.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-summary-prompt.html"
      },
      {
        "slug": "episodic-memory-strategy",
        "title": "Episodic memory strategy",
        "desc": "Its strength comes from having structured context that spans many interactions, while remaining efficient to store, search, and update. Developers get a balance of freshness, accuracy, and long...",
        "file": "/agentcore/md/episodic-memory-strategy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html"
      },
      {
        "slug": "memory-episodic-prompt",
        "title": "System prompts for episodic memory strategy",
        "desc": "The episodic memory strategy includes instructions and output schemas in the default prompts for episode extraction, episode consolidation, and reflection generation.",
        "file": "/agentcore/md/memory-episodic-prompt.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-episodic-prompt.html"
      },
      {
        "slug": "memory-custom-strategy",
        "title": "Customize a built-in strategy or create your own strategy",
        "desc": "For advanced or domain-specific use cases, you can create a built-in with overrides strategy to gain fine-grained control over the long-term memory process. Built-in with overrides strategies let...",
        "file": "/agentcore/md/memory-custom-strategy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-custom-strategy.html"
      },
      {
        "slug": "memory-self-managed-strategies",
        "title": "Self-managed strategy",
        "desc": "A self-managed strategy in Amazon Bedrock AgentCore Memory gives you complete control over your memory extraction and consolidation pipelines. With a self-managed strategy, you can build custom...",
        "file": "/agentcore/md/memory-self-managed-strategies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-self-managed-strategies.html"
      },
      {
        "slug": "memory-organization",
        "title": "Memory organization in AgentCore Memory",
        "desc": "You can set how short-term and long-term memories are organized in an AgentCore Memory. This lets you isolate memories by session and by actor. For long-term memory, you can also set a namespace...",
        "file": "/agentcore/md/memory-organization.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-organization.html"
      },
      {
        "slug": "memory-record-streaming",
        "title": "Memory record streaming",
        "desc": "Memory record streaming in Amazon Bedrock AgentCore Memory delivers real-time notifications when memory records are created, updated, or deleted. Instead of polling APIs to detect changes, you...",
        "file": "/agentcore/md/memory-record-streaming.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-record-streaming.html"
      },
      {
        "slug": "memory-cross-account-access",
        "title": "Cross-account memory access",
        "desc": "Amazon Bedrock AgentCore Memory supports cross-account access, enabling you to build multi-account architectures where memory resources and consuming agents span multiple AWS accounts....",
        "file": "/agentcore/md/memory-cross-account-access.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-cross-account-access.html"
      },
      {
        "slug": "memory-ltm-rag",
        "title": "Compare long-term memory with Retrieval-Augmented Generation",
        "desc": "Retrieval-Augmented Generation (RAG) complements long-term memory by providing access to authoritative, current information from large-scale repositories. Use these system to retrieve up-to-date...",
        "file": "/agentcore/md/memory-ltm-rag.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-ltm-rag.html"
      },
      {
        "slug": "memory-get-started",
        "title": "Get started with AgentCore Memory",
        "desc": "Amazon Bedrock Amazon Bedrock AgentCore Memory lets you create and manage AgentCore Memory resources that store conversation context for your AI agents. This getting started guides you through...",
        "file": "/agentcore/md/memory-get-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-get-started.html"
      },
      {
        "slug": "memory-create-a-memory-store",
        "title": "Create an AgentCore Memory",
        "desc": "You can create an AgentCore Memory with the AgentCore CLI, the AWS console, or with the CreateMemory AWS SDK operation. When creating a memory, you can configure settings such as name,...",
        "file": "/agentcore/md/memory-create-a-memory-store.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-create-a-memory-store.html"
      },
      {
        "slug": "storage-encryption",
        "title": "Encrypt your Amazon Bedrock AgentCore Memory",
        "desc": "When creating an AgentCore Memory, it is important to make sure your data is safe and secure. If your application handles sensitive information (such as customer details, payment data, or personal...",
        "file": "/agentcore/md/storage-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/storage-encryption.html"
      },
      {
        "slug": "using-memory-short-term",
        "title": "Use short-term memory",
        "desc": "In your AI agent, you write code to add events to short-term memory in an AgentCore Memory. These events are stored as short-term memory. They form the foundation for structured information...",
        "file": "/agentcore/md/using-memory-short-term.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/using-memory-short-term.html"
      },
      {
        "slug": "short-term-create-event",
        "title": "Create an event",
        "desc": "Events are the fundamental units of short-term from which structured informations are extracted into long-term memory in AgentCore Memory. The CreateEvent operation lets you store various types of...",
        "file": "/agentcore/md/short-term-create-event.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-create-event.html"
      },
      {
        "slug": "short-term-get-event",
        "title": "Get an event",
        "desc": "The GetEvent API retrieves a specific raw event by its identifier from short-term memory in AgentCore Memory. This API requires you to specify the memoryId , actorId , sessionId , and eventId as...",
        "file": "/agentcore/md/short-term-get-event.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-get-event.html"
      },
      {
        "slug": "short-term-list-events",
        "title": "List events",
        "desc": "The ListEvents operation is valuable for applications that need to reconstruct conversation histories, analyze interaction patterns, or implement memory-based features like conversation...",
        "file": "/agentcore/md/short-term-list-events.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-list-events.html"
      },
      {
        "slug": "short-term-delete-event",
        "title": "Delete an event",
        "desc": "The DeleteEvent operation removes individual events from your AgentCore Memory. This operation helps maintain data privacy and relevance by letting you selectively remove specific events from a...",
        "file": "/agentcore/md/short-term-delete-event.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-delete-event.html"
      },
      {
        "slug": "long-term-memory-long-term",
        "title": "Use long-term memory",
        "desc": "Long-term memory is enabled by adding one or more memory strategies to a memory resource. These strategies define what kind of information is extracted from conversations and stored persistently....",
        "file": "/agentcore/md/long-term-memory-long-term.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-memory-long-term.html"
      },
      {
        "slug": "long-term-enabling-long-term-memory",
        "title": "Enable long-term memory",
        "desc": "You can enable long-term memory in two ways: by adding strategies when you first create an AgentCore Memory , or by updating an existing resource to include them.",
        "file": "/agentcore/md/long-term-enabling-long-term-memory.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-enabling-long-term-memory.html"
      },
      {
        "slug": "specify-long-term-memory-organization",
        "title": "Specify long-term memory organization with namespaces",
        "desc": "When you create an AgentCore Memory, use a namespace to specify where the long-term memories for a memory strategy are logically grouped. Every time a new long-term memory is extracted using the...",
        "file": "/agentcore/md/specify-long-term-memory-organization.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/specify-long-term-memory-organization.html"
      },
      {
        "slug": "long-term-configuring-built-in-strategies",
        "title": "Configure built-in strategies",
        "desc": "AgentCore Memory provides pre-configured, built-in memory strategies for common use cases.",
        "file": "/agentcore/md/long-term-configuring-built-in-strategies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-configuring-built-in-strategies.html"
      },
      {
        "slug": "long-term-configuring-custom-strategies",
        "title": "Configure a custom strategy",
        "desc": "For advanced use cases, built-in with overrides strategies give you fine-grained control over the memory extraction process. This lets you override the default logic of a built-in strategy by...",
        "file": "/agentcore/md/long-term-configuring-custom-strategies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-configuring-custom-strategies.html"
      },
      {
        "slug": "long-term-saving-and-retrieving-insights",
        "title": "Save and retrieve insights",
        "desc": "Once you have configured an AgentCore Memory with at least one long-term memory strategy and the strategy is ACTIVE, the service will automatically begin processing conversational data to extract...",
        "file": "/agentcore/md/long-term-saving-and-retrieving-insights.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-saving-and-retrieving-insights.html"
      },
      {
        "slug": "long-term-retrieve-records",
        "title": "Retrieve memory records",
        "desc": "You can retrieve extracted memories using the RetrieveMemoryRecords API. This operation lets you search extracted memory records based on semantic queries, making it easy to find relevant...",
        "file": "/agentcore/md/long-term-retrieve-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-retrieve-records.html"
      },
      {
        "slug": "long-term-list-memory-records",
        "title": "List memory records",
        "desc": "The ListMemoryRecords operation lets you retrieve memory records from a specific namespace or under a particular namespace path hierarchy without performing a semantic search. This is useful when...",
        "file": "/agentcore/md/long-term-list-memory-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-list-memory-records.html"
      },
      {
        "slug": "long-term-memory-metadata",
        "title": "Structured metadata for long-term memories",
        "desc": "Metadata filtering in Amazon Bedrock AgentCore Memory lets you add structured attributes to your long-term memory records. You can use those attributes to narrow which records are returned during...",
        "file": "/agentcore/md/long-term-memory-metadata.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-memory-metadata.html"
      },
      {
        "slug": "long-term-delete-memory-records",
        "title": "Delete memory records",
        "desc": "The DeleteMemoryRecord API removes individual memory records from your AgentCore Memory, giving you control over what information persists in your application’s memory. This API helps maintain...",
        "file": "/agentcore/md/long-term-delete-memory-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-delete-memory-records.html"
      },
      {
        "slug": "long-term-redrive",
        "title": "Redrive failed ingestions",
        "desc": "Extraction from short-term memory to long-term memory is usually automatic. If extraction from short-term memory to long-term memory is unsuccessful for any reason, AgentCore Memory attempts to...",
        "file": "/agentcore/md/long-term-redrive.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-redrive.html"
      },
      {
        "slug": "memory-examples",
        "title": "Amazon Bedrock AgentCore Memory examples",
        "desc": "You can use AgentCore Memory with a variety of SDKS and agent frameworks.",
        "file": "/agentcore/md/memory-examples.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-examples.html"
      },
      {
        "slug": "memory-customer-scenario",
        "title": "Scenario: A customer support AI agent using AgentCore Memory",
        "desc": "In this section you learn how to build a customer support AI agent that uses AgentCore Memory to provide personalized assistance by maintaining conversation history and extracting long-term...",
        "file": "/agentcore/md/memory-customer-scenario.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-customer-scenario.html"
      },
      {
        "slug": "memory-integrate-lang",
        "title": "Integrate AgentCore Memory with LangChain or LangGraph",
        "desc": "Within LangGraph there are two main memory concepts when it comes to memory persistence . Short-term, raw context is saved through checkpoint objects, while intelligent long term memory retrieval...",
        "file": "/agentcore/md/memory-integrate-lang.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-integrate-lang.html"
      },
      {
        "slug": "aws-sdk-memory",
        "title": "AWS SDK",
        "desc": "Use the AWS SDK to directly interact with AgentCore Memory fine-grained control over memory operations. The following examples show how to access the AWS SDK with the SDK for Python (Boto3).",
        "file": "/agentcore/md/aws-sdk-memory.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/aws-sdk-memory.html"
      },
      {
        "slug": "agentcore-sdk-memory",
        "title": "Amazon Bedrock AgentCore SDK",
        "desc": "Use the Amazon Bedrock AgentCore Python SDK for a higher-level abstraction that simplifies memory operations and provides convenient methods for common use cases.",
        "file": "/agentcore/md/agentcore-sdk-memory.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-sdk-memory.html"
      },
      {
        "slug": "strands-sdk-memory",
        "title": "Strands Agents SDK",
        "desc": "Use the Strands Agents SDK for seamless integration with agent frameworks, providing automatic memory management and retrieval within conversational agents.",
        "file": "/agentcore/md/strands-sdk-memory.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/strands-sdk-memory.html"
      },
      {
        "slug": "bedrock-capacity",
        "title": "Amazon Bedrock capacity for built-in with overrides strategies",
        "desc": "When configuring built-in with overrides strategies with CreateMemory or UpdateMemory , you must provide an IAM execution role ( memoryExecutionRoleArn ). The AgentCore Memory service assumes this...",
        "file": "/agentcore/md/bedrock-capacity.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-capacity.html"
      },
      {
        "slug": "memory-observability",
        "title": "Observability",
        "desc": "You can monitor usage metrics for your memory in CloudWatch metrics. Some of the critical metrics are displayed in AgentCore Memory console.",
        "file": "/agentcore/md/memory-observability.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-observability.html"
      },
      {
        "slug": "best-practices",
        "title": "Best practices",
        "desc": "We recommend these best practices for using AgentCore Memory effectively in your AI agent applications.",
        "file": "/agentcore/md/best-practices.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/best-practices.html"
      }
    ]
  },
  {
    "id": "gateway",
    "label": "Gateway",
    "icon": "Network",
    "color": "#ff5c8a",
    "blurb": "Turn APIs, Lambdas, and MCP servers into governed agent tools.",
    "pages": [
      {
        "slug": "gateway",
        "title": "Amazon Bedrock AgentCore Gateway: A secure AI gateway for agents, tools, and models",
        "desc": "Amazon Bedrock AgentCore Gateway is a fully managed AI gateway that provides a single, secure entry point for agentic traffic—connecting agents to tools, to other agents, and to large language...",
        "file": "/agentcore/md/gateway.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html"
      },
      {
        "slug": "gateway-quick-start",
        "title": "Get started with AgentCore Gateway",
        "desc": "In this quick start guide you’ll learn how to set up a gateway and integrate it into your agents using the AgentCore CLI. For more comprehensive guides and examples, see the Amazon Bedrock...",
        "file": "/agentcore/md/gateway-quick-start.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-quick-start.html"
      },
      {
        "slug": "gateway-core-concepts",
        "title": "Core concepts for Amazon Bedrock AgentCore Gateway",
        "desc": "Amazon Bedrock AgentCore Gateway provides a standardized, secure entry point for agentic traffic, letting AI agents discover and interact with tools, other agents, and large language models...",
        "file": "/agentcore/md/gateway-core-concepts.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-core-concepts.html"
      },
      {
        "slug": "gateway-features",
        "title": "Amazon Bedrock AgentCore Gateway features",
        "desc": "Amazon Bedrock AgentCore Gateway provides features that you can optionally enable for your gateway. The following table provides a brief description of these features and links to documentation to...",
        "file": "/agentcore/md/gateway-features.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-features.html"
      },
      {
        "slug": "gateway-supported-targets",
        "title": "Supported targets for Amazon Bedrock AgentCore gateways",
        "desc": "Targets define the capabilities that your gateway will host. Amazon Bedrock AgentCore Gateway supports three categories of targets:",
        "file": "/agentcore/md/gateway-supported-targets.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-supported-targets.html"
      },
      {
        "slug": "gateway-targets-mcp",
        "title": "MCP targets",
        "desc": "MCP targets operate in aggregation mode — the gateway acts as an MCP server whose capabilities combine those of all its MCP targets. Clients see a single consolidated tools/list response that...",
        "file": "/agentcore/md/gateway-targets-mcp.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-targets-mcp.html"
      },
      {
        "slug": "gateway-add-target-lambda",
        "title": "AWS Lambda function targets",
        "desc": "Lambda targets allow you to connect your gateway to AWS Lambda functions that implement your tools. This is useful when you want to execute custom code in response to tool invocations.",
        "file": "/agentcore/md/gateway-add-target-lambda.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-lambda.html"
      },
      {
        "slug": "gateway-target-api-gateway",
        "title": "Amazon API Gateway REST API stages as targets",
        "desc": "An API Gateway REST API target connects your gateway to a stage of your REST API. The gateway translates incoming MCP requests into HTTP requests to your REST API and handles response formatting....",
        "file": "/agentcore/md/gateway-target-api-gateway.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-api-gateway.html"
      },
      {
        "slug": "gateway-schema-openapi",
        "title": "OpenAPI schema targets",
        "desc": "OpenAPI (formerly known as Swagger) is a widely used standard for describing RESTful APIs. Gateway supports OpenAPI 3.0 specifications for defining API targets.",
        "file": "/agentcore/md/gateway-schema-openapi.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-schema-openapi.html"
      },
      {
        "slug": "gateway-building-smithy-targets",
        "title": "Smithy model targets",
        "desc": "Smithy is a language for defining services and software development kits (SDKs). Smithy models provide a more structured approach to defining APIs compared to OpenAPI, and are particularly useful...",
        "file": "/agentcore/md/gateway-building-smithy-targets.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-smithy-targets.html"
      },
      {
        "slug": "gateway-target-MCPservers",
        "title": "MCP servers targets",
        "desc": "MCP servers provide local tools, data access, or custom functions for your interactions with models and agents in Bedrock AgentCore. In Bedrock AgentCore, you can define a preconfigured MCP server...",
        "file": "/agentcore/md/gateway-target-MCPservers.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html"
      },
      {
        "slug": "gateway-target-integrations",
        "title": "Built-in templates from integration providers as targets",
        "desc": "Amazon Bedrock AgentCore lets you add open source templates from the following integration providers as targets in your gateway:",
        "file": "/agentcore/md/gateway-target-integrations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-integrations.html"
      },
      {
        "slug": "gateway-target-connectors",
        "title": "Built-in connectors as targets",
        "desc": "Amazon Bedrock AgentCore lets you add the following built-in connectors as targets in your gateway:",
        "file": "/agentcore/md/gateway-target-connectors.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connectors.html"
      },
      {
        "slug": "gateway-target-connector-managed-kb",
        "title": "Amazon Bedrock Managed Knowledge Bases as Connector Target",
        "desc": "Amazon Bedrock Managed Knowledge Bases provides fully managed retrieval-augmented generation (RAG): Amazon Bedrock handles the vector store, data ingestion, and retrieval optimization, so there is...",
        "file": "/agentcore/md/gateway-target-connector-managed-kb.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-managed-kb.html"
      },
      {
        "slug": "gateway-target-connector-web-search-tool",
        "title": "Web Search Tool",
        "desc": "AI agents are transforming how organizations interact with information, but they face a fundamental limitation: their knowledge is frozen at training time. When a user asks about today’s stock...",
        "file": "/agentcore/md/gateway-target-connector-web-search-tool.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-web-search-tool.html"
      },
      {
        "slug": "gateway-target-connector-versions",
        "title": "Connector versions",
        "desc": "Built-in connectors on Amazon Bedrock AgentCore Gateway use semantic versioning (MAJOR.MINOR.PATCH). You can pin a target to a specific connector version or let it use the connector’s current...",
        "file": "/agentcore/md/gateway-target-connector-versions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-versions.html"
      },
      {
        "slug": "gateway-tool-naming",
        "title": "Understand how AgentCore Gateway tools are named",
        "desc": "The name of a tool in your gateway is dependent on the name of the target through which the tool can be accessed. Tool names are constructed in the following pattern:",
        "file": "/agentcore/md/gateway-tool-naming.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-tool-naming.html"
      },
      {
        "slug": "gateway-targets-http",
        "title": "HTTP targets",
        "desc": "For HTTP targets, the gateway sends traffic directly to the target without aggregation or protocol translation. Unlike MCP targets, HTTP targets do not support capability synchronization or...",
        "file": "/agentcore/md/gateway-targets-http.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-targets-http.html"
      },
      {
        "slug": "gateway-target-http-runtime",
        "title": "Amazon Bedrock AgentCore Runtime targets",
        "desc": "You can add an Amazon Bedrock AgentCore Runtime agent as a gateway target. The gateway sends traffic directly to the runtime agent without aggregation or protocol translation. Unlike MCP targets...",
        "file": "/agentcore/md/gateway-target-http-runtime.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-runtime.html"
      },
      {
        "slug": "gateway-target-http-passthrough",
        "title": "HTTP passthrough targets",
        "desc": "You can add an HTTP passthrough target to route traffic through the gateway to any HTTP endpoint. The gateway forwards requests to the target endpoint without protocol translation, acting as a...",
        "file": "/agentcore/md/gateway-target-http-passthrough.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-passthrough.html"
      },
      {
        "slug": "gateway-targets-inference",
        "title": "Inference targets",
        "desc": "You can add inference targets to your gateway to route LLM traffic to model providers. The gateway acts as a unified LLM proxy layer, allowing clients to connect to a single endpoint and route...",
        "file": "/agentcore/md/gateway-targets-inference.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-targets-inference.html"
      },
      {
        "slug": "gateway-target-inference-connector",
        "title": "Inference connector targets",
        "desc": "Inference connector targets provide preconfigured setup for supported model providers. When you use a connector, the gateway automatically handles operations, model discovery, model ID...",
        "file": "/agentcore/md/gateway-target-inference-connector.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-inference-connector.html"
      },
      {
        "slug": "gateway-target-inference-provider",
        "title": "Inference provider targets",
        "desc": "Inference provider targets give you explicit control over the endpoint, model mappings, and operations for a model provider. Use a provider configuration when you need to customize which models...",
        "file": "/agentcore/md/gateway-target-inference-provider.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-inference-provider.html"
      },
      {
        "slug": "gateway-prerequisites",
        "title": "Prerequisites for using the Amazon Bedrock AgentCore gateway service",
        "desc": "To interact with the AgentCore Gateway service, you’ll need to complete the following prerequisites:",
        "file": "/agentcore/md/gateway-prerequisites.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-prerequisites.html"
      },
      {
        "slug": "gateway-setup-tools-credentials",
        "title": "Set up dependencies and credentials to create, maintain, and use gateway resources",
        "desc": "The AgentCore Gateway service involves the following main processes:",
        "file": "/agentcore/md/gateway-setup-tools-credentials.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-setup-tools-credentials.html"
      },
      {
        "slug": "gateway-prerequisites-permissions",
        "title": "Set up permissions for AgentCore Gateway",
        "desc": "To use Amazon Bedrock AgentCore Gateway and its capabilities, you’ll need to consider the following permissions:",
        "file": "/agentcore/md/gateway-prerequisites-permissions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-prerequisites-permissions.html"
      },
      {
        "slug": "gateway-inbound-auth",
        "title": "Set up inbound authorization for your gateway",
        "desc": "Before you create your gateway, you must set up inbound authorization. Inbound authorization validates users who attempt to access targets through your AgentCore gateway. AgentCore supports the...",
        "file": "/agentcore/md/gateway-inbound-auth.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-inbound-auth.html"
      },
      {
        "slug": "gateway-outbound-auth",
        "title": "Set up outbound authorization for your gateway",
        "desc": "Outbound authorization lets Amazon Bedrock AgentCore gateways securely access gateway targets on behalf of users that were authenticated and authorized during inbound authorization.",
        "file": "/agentcore/md/gateway-outbound-auth.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html"
      },
      {
        "slug": "gateway-building",
        "title": "Set up an Amazon Bedrock AgentCore gateway",
        "desc": "Amazon Bedrock AgentCore Gateway provides a unified connectivity layer between agents and the tools and resources they need to interact with. Before setting up your Gateway, it’s important to...",
        "file": "/agentcore/md/gateway-building.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building.html"
      },
      {
        "slug": "gateway-create",
        "title": "Create an Amazon Bedrock AgentCore gateway",
        "desc": "This guide walks you through the process of creating and configuring an Amazon Bedrock AgentCore Gateway. The Gateway serves as a unified entry point for agents to access tools and resources...",
        "file": "/agentcore/md/gateway-create.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create.html"
      },
      {
        "slug": "gateway-create-console",
        "title": "Create an AgentCore gateway using the AWS Management Console",
        "desc": "1. Open the AgentCore console at https://console.aws.amazon.com/bedrock-agentcore/home#.",
        "file": "/agentcore/md/gateway-create-console.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create-console.html"
      },
      {
        "slug": "gateway-create-cli",
        "title": "Create an AgentCore gateway using the CLI",
        "desc": "You can use the AgentCore CLI to create gateways with simplified commands. The CLI handles common configurations automatically, including IAM role creation and authorization setup.",
        "file": "/agentcore/md/gateway-create-cli.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create-cli.html"
      },
      {
        "slug": "gateway-create-api",
        "title": "Create an AgentCore gateway using the API",
        "desc": "To create a AgentCore gateway using the API, make a CreateGateway request with one of the AgentCore control plane endpoints.",
        "file": "/agentcore/md/gateway-create-api.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create-api.html"
      },
      {
        "slug": "gateway-building-adding-targets",
        "title": "Add targets to an existing AgentCore gateway",
        "desc": "After creating a gateway, you can add targets, which define the tools that your gateway will host. AgentCore Gateway supports multiple target type that are detailed in the following topics. Each...",
        "file": "/agentcore/md/gateway-building-adding-targets.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets.html"
      },
      {
        "slug": "gateway-add-target-console",
        "title": "Add a target using the AWS Management Console",
        "desc": "In the AWS Management Console, you can add gateway targets when you create the gateway. After you’ve created a gateway, you can add targets by doing the following:",
        "file": "/agentcore/md/gateway-add-target-console.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-console.html"
      },
      {
        "slug": "gateway-add-target-cli",
        "title": "Add a target using the CLI",
        "desc": "You can use the AgentCore CLI to add targets to an existing gateway with simplified commands.",
        "file": "/agentcore/md/gateway-add-target-cli.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-cli.html"
      },
      {
        "slug": "gateway-add-target-api",
        "title": "Add a target using the API",
        "desc": "To add a target using the API, make a CreateGatewayTarget request with one of the AgentCore control plane endpoints and define a target configuration that matches the target type.",
        "file": "/agentcore/md/gateway-add-target-api.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-api.html"
      },
      {
        "slug": "gateway-building-adding-targets-authorization",
        "title": "Specify the authorization type and credentials to access the gateway target",
        "desc": "In the CreateGatewayTarget request body, you specify the credential provider configuration in the credentialProviderConfigurations array. The configuration depends on the outbound authorization...",
        "file": "/agentcore/md/gateway-building-adding-targets-authorization.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets-authorization.html"
      },
      {
        "slug": "gateway-add-target-api-target-config",
        "title": "Define the gateway target configuration",
        "desc": "The target configuration depends on the target type that you’re adding to the gateway. For more information about supported gateway target types, see Supported targets for Amazon Bedrock AgentCore...",
        "file": "/agentcore/md/gateway-add-target-api-target-config.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-api-target-config.html"
      },
      {
        "slug": "gateway-using",
        "title": "Use an AgentCore gateway",
        "desc": "After setting up your gateway with targets , you can configure your application or agent to use the gateway through the Model Context Protocol (MCP) . The MCP provides a standardized way for...",
        "file": "/agentcore/md/gateway-using.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using.html"
      },
      {
        "slug": "gateway-using-auth",
        "title": "Authorize and authenticate to an AgentCore gateway and gateway target",
        "desc": "To invoke your gateway and gateway target, you’ll need to make sure that the following credentials that you set up while fulfilling the prerequisites are recognized during gateway invocation:",
        "file": "/agentcore/md/gateway-using-auth.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-auth.html"
      },
      {
        "slug": "gateway-using-auth-ex-starter",
        "title": "Example: Authorization for the default gateway and target created by the AgentCore CLI",
        "desc": "If you used the AgentCore CLI to create a gateway and a Lambda target, the CLI configures JWT-based inbound authorization and IAM-based outbound authorization for you automatically.",
        "file": "/agentcore/md/gateway-using-auth-ex-starter.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-auth-ex-starter.html"
      },
      {
        "slug": "gateway-using-auth-ex-3lo",
        "title": "Example: Authentication with an authorization code grant when invoking a gateway",
        "desc": "If you set up your gateway target with an authorization code grant (for more information, see OAuth authorization ), the defaultReturnUrl that you specified when creating the gateway will be the...",
        "file": "/agentcore/md/gateway-using-auth-ex-3lo.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-auth-ex-3lo.html"
      },
      {
        "slug": "gateway-using-mcp-list",
        "title": "List available tools in an AgentCore gateway",
        "desc": "To list all available tools that an AgentCore gateway provides, make a POST request to the gateway’s MCP endpoint and specify tools/list as the method in the request body:",
        "file": "/agentcore/md/gateway-using-mcp-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-list.html"
      },
      {
        "slug": "gateway-using-mcp-call",
        "title": "Call a tool in a AgentCore gateway",
        "desc": "To call a specific tool, make a POST request to the gateway’s MCP endpoint. Specify tools/call as the method in the request body, along with the name of the tool and its arguments. The request...",
        "file": "/agentcore/md/gateway-using-mcp-call.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-call.html"
      },
      {
        "slug": "gateway-using-mcp-prompts-list",
        "title": "List available prompts in an AgentCore gateway",
        "desc": "To list all available prompts that an AgentCore gateway provides, make a POST request to the gateway’s MCP endpoint and specify prompts/list as the method in the request body:",
        "file": "/agentcore/md/gateway-using-mcp-prompts-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-prompts-list.html"
      },
      {
        "slug": "gateway-using-mcp-prompts-get",
        "title": "Get a prompt from an AgentCore gateway",
        "desc": "To get a specific prompt, make a POST request to the gateway’s MCP endpoint and specify prompts/get as the method in the request body, name of the prompt, and the arguments:",
        "file": "/agentcore/md/gateway-using-mcp-prompts-get.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-prompts-get.html"
      },
      {
        "slug": "gateway-using-mcp-resources-list",
        "title": "List available resources in an AgentCore gateway",
        "desc": "To list all available resources that an AgentCore gateway provides, make a POST request to the gateway’s MCP endpoint and specify resources/list as the method in the request body:",
        "file": "/agentcore/md/gateway-using-mcp-resources-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-resources-list.html"
      },
      {
        "slug": "gateway-using-mcp-resources-read",
        "title": "Read a resource from an AgentCore gateway",
        "desc": "To read a specific resource, make a POST request to the gateway’s MCP endpoint and specify resources/read as the method in the request body and the URI of the resource:",
        "file": "/agentcore/md/gateway-using-mcp-resources-read.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-resources-read.html"
      },
      {
        "slug": "gateway-using-mcp-resources-templates-list",
        "title": "List resource templates in an AgentCore gateway",
        "desc": "To list all available resource templates that an AgentCore gateway provides, make a POST request to the gateway’s MCP endpoint and specify resources/templates/list as the method in the request body:",
        "file": "/agentcore/md/gateway-using-mcp-resources-templates-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-resources-templates-list.html"
      },
      {
        "slug": "gateway-mcp-elicitation",
        "title": "Use elicitation with your AgentCore gateway",
        "desc": "Elicitation is an MCP feature that allows an MCP server to request additional information from the client during a tool call. When a tool needs user confirmation, authentication, or additional...",
        "file": "/agentcore/md/gateway-mcp-elicitation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-elicitation.html"
      },
      {
        "slug": "gateway-mcp-progress",
        "title": "Receive progress notifications from your AgentCore gateway",
        "desc": "Progress notifications allow MCP server targets to report incremental progress on long-running tool calls. When a tool call takes time to complete, the server can send notifications/progress...",
        "file": "/agentcore/md/gateway-mcp-progress.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-progress.html"
      },
      {
        "slug": "gateway-mcp-logging",
        "title": "Receive logging messages from your AgentCore gateway",
        "desc": "MCP server targets can send log messages to clients during tool execution using the notifications/message method. These messages provide real-time visibility into what the server is doing, useful...",
        "file": "/agentcore/md/gateway-mcp-logging.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-logging.html"
      },
      {
        "slug": "gateway-mcp-sampling",
        "title": "Use sampling with your AgentCore gateway",
        "desc": "Sampling is an MCP feature that allows an MCP server to request an LLM completion from the client during a tool call. This enables servers to leverage AI capabilities without needing direct access...",
        "file": "/agentcore/md/gateway-mcp-sampling.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-sampling.html"
      },
      {
        "slug": "gateway-using-mcp-semantic-search",
        "title": "Search for tools in your AgentCore gateway with a natural language query",
        "desc": "If you enabled semantic search for your gateway when you created it, you can call the xamzbedrockagentcoresearch tool to search for tools in your gateway with a natural language query. Semantic...",
        "file": "/agentcore/md/gateway-using-mcp-semantic-search.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-semantic-search.html"
      },
      {
        "slug": "gateway-agent-integration",
        "title": "Create an agent that uses your AgentCore gateway",
        "desc": "After creating and testing your gateway, you can create and connect AI agents to your gateway. An agent connected to your gateway is able to call the tools in the gateway and use a Amazon Bedrock...",
        "file": "/agentcore/md/gateway-agent-integration.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-agent-integration.html"
      },
      {
        "slug": "gateway-rules",
        "title": "Add rules to a gateway",
        "desc": "Gateway rules let you control traffic routing and override target configurations on your gateway without redeploying targets. You create configuration bundles that override a target’s behavior,...",
        "file": "/agentcore/md/gateway-rules.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules.html"
      },
      {
        "slug": "gateway-rules-propagation",
        "title": "Configuration bundle propagation and observability",
        "desc": "When the gateway resolves a configuration bundle through rules, it propagates the bundle to downstream services through OpenTelemetry (OTel) baggage headers. This enables end-to-end configuration...",
        "file": "/agentcore/md/gateway-rules-propagation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules-propagation.html"
      },
      {
        "slug": "gateway-rules-session-stickiness",
        "title": "Session stickiness for weighted rules",
        "desc": "When you use weighted rules for A/B testing or canary deployments, you want each session to receive a consistent experience across multiple requests. Without session stickiness, a session could...",
        "file": "/agentcore/md/gateway-rules-session-stickiness.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules-session-stickiness.html"
      },
      {
        "slug": "gateway-rules-examples",
        "title": "Gateway rules API examples",
        "desc": "The following examples show how to manage gateway rules using the AWS CLI and AWS Python SDK (Boto3).",
        "file": "/agentcore/md/gateway-rules-examples.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules-examples.html"
      },
      {
        "slug": "gateway-fine-grained-access-control",
        "title": "Fine-grained access control for Amazon Bedrock AgentCore Gateway",
        "desc": "Amazon Bedrock AgentCore Gateway provides fine-grained access control capabilities that allow you to control which users and agents can access specific tools and resources. You can implement...",
        "file": "/agentcore/md/gateway-fine-grained-access-control.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-fine-grained-access-control.html"
      },
      {
        "slug": "gateway-building-debug",
        "title": "Debug and assess your gateway",
        "desc": "You can use different tools to help debug your gateway before putting it into a production environment, including built-in AWS and AgentCore Gateway tools, as well as external tools such as the...",
        "file": "/agentcore/md/gateway-building-debug.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-debug.html"
      },
      {
        "slug": "gateway-debug-messages",
        "title": "Turn on debugging messages",
        "desc": "While your gateway is in development, you can turn on debugging messages to return details on target configuration issues, including lambda function errors, egress authorizer errors, target...",
        "file": "/agentcore/md/gateway-debug-messages.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-debug-messages.html"
      },
      {
        "slug": "gateway-using-inspector",
        "title": "Use the MCP Inspector",
        "desc": "The MCP Inspector, available through the Model Context Protocol (MCP) , is a developer tool that helps you test and debug MCP servers by through an interactive interface. You can connect your...",
        "file": "/agentcore/md/gateway-using-inspector.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-inspector.html"
      },
      {
        "slug": "gateway-cloudtrail",
        "title": "Log Amazon Bedrock AgentCore Gateway API calls with CloudTrail",
        "desc": "Amazon Bedrock AgentCore Gateway is integrated with AWS CloudTrail, a service that provides a record of actions taken by a user, role, or an AWS service in Gateway. CloudTrail captures all API...",
        "file": "/agentcore/md/gateway-cloudtrail.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-cloudtrail.html"
      },
      {
        "slug": "gateway-event-types",
        "title": "Amazon Bedrock AgentCore Gateway event types",
        "desc": "This section provides information about the types of events that Amazon Bedrock AgentCore Gateway logs to CloudTrail.",
        "file": "/agentcore/md/gateway-event-types.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-event-types.html"
      },
      {
        "slug": "enabling-cloudtrail-data-event-logging",
        "title": "Enable CloudTrail data event logging for Amazon Bedrock AgentCore Gateway resources",
        "desc": "You can use CloudTrail data events to get information about Amazon Bedrock AgentCore Gateway requests. To enable CloudTrail data events for Gateway, you must create a trail manually in CloudTrail...",
        "file": "/agentcore/md/enabling-cloudtrail-data-event-logging.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/enabling-cloudtrail-data-event-logging.html"
      },
      {
        "slug": "understanding-gateway-cloudtrail-log-entries",
        "title": "Understanding Amazon Bedrock AgentCore Gateway CloudTrail events",
        "desc": "A trail is a configuration that enables delivery of events as log files to an Amazon S3 bucket that you specify. CloudTrail log files contain one or more log entries. An event represents a single...",
        "file": "/agentcore/md/understanding-gateway-cloudtrail-log-entries.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/understanding-gateway-cloudtrail-log-entries.html"
      },
      {
        "slug": "gateway-advanced",
        "title": "Advanced features and topics for Amazon Bedrock AgentCore Gateway",
        "desc": "This chapter covers some advanced topics and additional information that can help supplement your knowledge of gateways and how you can use them effectively in your applications.",
        "file": "/agentcore/md/gateway-advanced.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-advanced.html"
      },
      {
        "slug": "gateway-sessions",
        "title": "Use MCP sessions with your AgentCore gateway",
        "desc": "MCP sessions enable stateful interactions between clients and your AgentCore gateway. When sessions are enabled, the gateway generates a unique session identifier during initialization and...",
        "file": "/agentcore/md/gateway-sessions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-sessions.html"
      },
      {
        "slug": "gateway-mcp-streaming",
        "title": "Enable MCP response streaming for your AgentCore gateway",
        "desc": "MCP response streaming enables your AgentCore gateway to deliver real-time Server-Sent Events (SSE) to clients during tool execution. Instead of waiting for the entire tool call to complete before...",
        "file": "/agentcore/md/gateway-mcp-streaming.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-streaming.html"
      },
      {
        "slug": "gateway-encryption",
        "title": "Encrypt your AgentCore gateway with a customer-managed KMS key",
        "desc": "By default, Gateway encrypts your data at rest using a service-managed AWS Key Management Service key. However, you can optionally provide your own customer managed KMS key for encrypting data at...",
        "file": "/agentcore/md/gateway-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-encryption.html"
      },
      {
        "slug": "gateway-custom-domains",
        "title": "Setting up custom domain names for Gateway endpoints",
        "desc": "By default, Gateway endpoints are provided with an AWS-managed domain name in the format <gateway-id>.gateway.bedrock-agentcore.<region>.amazonaws.com . For production environments or to create a...",
        "file": "/agentcore/md/gateway-custom-domains.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-custom-domains.html"
      },
      {
        "slug": "gateway-interceptors",
        "title": "Using interceptors with Gateway",
        "desc": "Configuring interceptors on your gateway allows you to run custom code during each invocation of your gateway. This section provides guidance on implementing and configuring interceptors for your...",
        "file": "/agentcore/md/gateway-interceptors.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors.html"
      },
      {
        "slug": "gateway-interceptors-permissions",
        "title": "Permissions for interceptors",
        "desc": "When configuring interceptors, your gateway service role must have the lambda:InvokeFunction IAM permissions to invoke the Lambda functions that serve as interceptors. The service role needs...",
        "file": "/agentcore/md/gateway-interceptors-permissions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-permissions.html"
      },
      {
        "slug": "gateway-interceptors-types",
        "title": "Types of interceptors",
        "desc": "There are two types of interceptors that you can configure on your gateway: REQUEST interceptors and RESPONSE interceptors. The interceptor payload structure depends on the target type configured...",
        "file": "/agentcore/md/gateway-interceptors-types.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-types.html"
      },
      {
        "slug": "gateway-interceptors-configuration",
        "title": "Configuration",
        "desc": "Interceptors can be configured with an input parameter called passRequestHeaders",
        "file": "/agentcore/md/gateway-interceptors-configuration.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-configuration.html"
      },
      {
        "slug": "gateway-interceptors-examples",
        "title": "Examples",
        "desc": "The following example shows a Python Lambda function that can handle both REQUEST and RESPONSE interceptor types. The REQUEST interceptor logs the MCP method and passes the request through...",
        "file": "/agentcore/md/gateway-interceptors-examples.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-examples.html"
      },
      {
        "slug": "gateway-waf",
        "title": "Protecting your gateway with AWS WAF",
        "desc": "You can use AWS WAF with Amazon Bedrock AgentCore Gateway to protect your gateway from web exploits, bot traffic, and volumetric attacks. AWS WAF provides an inline security layer that evaluates...",
        "file": "/agentcore/md/gateway-waf.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-waf.html"
      },
      {
        "slug": "gateway-headers",
        "title": "Header propagation with Gateway",
        "desc": "Header propagation refers to the systematic forwarding of selective HTTP headers from incoming requests through your gateway to configured targets, and selective forwarding of response headers...",
        "file": "/agentcore/md/gateway-headers.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-headers.html"
      },
      {
        "slug": "gateway-advanced-performance",
        "title": "Performance optimization",
        "desc": "To optimize the performance of your Gateway implementations, consider the following best practices:",
        "file": "/agentcore/md/gateway-advanced-performance.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-advanced-performance.html"
      }
    ]
  },
  {
    "id": "identity",
    "label": "Identity",
    "icon": "KeyRound",
    "color": "#4cc9f0",
    "blurb": "Inbound auth, outbound credentials, and 25+ identity provider integrations.",
    "pages": [
      {
        "slug": "identity",
        "title": "Provide identity and credential management for agent applications with Amazon Bedrock AgentCore Identity",
        "desc": "Amazon Bedrock AgentCore Identity is an identity and credential management service designed specifically for AI agents and automated workloads. It provides secure authentication, authorization,...",
        "file": "/agentcore/md/identity.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html"
      },
      {
        "slug": "identity-overview",
        "title": "Overview of Amazon Bedrock AgentCore Identity",
        "desc": "In the rapidly evolving landscape of AI agents, organizations need robust identity management solutions that can handle the unique challenges associated with non-human identities. Amazon Bedrock...",
        "file": "/agentcore/md/identity-overview.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-overview.html"
      },
      {
        "slug": "key-features-and-benefits",
        "title": "Features of AgentCore Identity",
        "desc": "AgentCore Identity offers a set of features designed to address the unique challenges of workload identity management and credential security:",
        "file": "/agentcore/md/key-features-and-benefits.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/key-features-and-benefits.html"
      },
      {
        "slug": "identity-terminology",
        "title": "AgentCore Identity terminology",
        "desc": "AgentCore Identity uses specific terminology to describe the components, processes, and relationships involved in workload identity management and credential handling. Understanding these terms...",
        "file": "/agentcore/md/identity-terminology.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-terminology.html"
      },
      {
        "slug": "identity-use-cases",
        "title": "Example use cases",
        "desc": "Amazon Bedrock AgentCore Identity supports a wide range of use cases across different industries and application types. This section provides detailed examples of how the service can be applied in...",
        "file": "/agentcore/md/identity-use-cases.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-use-cases.html"
      },
      {
        "slug": "identity-getting-started",
        "title": "Get started with AgentCore Identity",
        "desc": "If you’re building AI agents that need to access external services like Google Drive, Slack, or GitHub, Amazon Bedrock AgentCore Identity provides the secure authentication infrastructure you...",
        "file": "/agentcore/md/identity-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-getting-started.html"
      },
      {
        "slug": "identity-getting-started-cognito",
        "title": "Build your first authenticated agent",
        "desc": "This getting started tutorial walks you through building a complete authenticated agent from the ground up using Amazon Bedrock AgentCore Identity and will help you get started with implementing...",
        "file": "/agentcore/md/identity-getting-started-cognito.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-getting-started-cognito.html"
      },
      {
        "slug": "identity-getting-started-google",
        "title": "Integrate with Google Drive using OAuth2",
        "desc": "This getting started tutorial walks you through the essential steps to start using Amazon Bedrock AgentCore Identity for your AI agents. You’ll learn how to set up your development environment,...",
        "file": "/agentcore/md/identity-getting-started-google.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-getting-started-google.html"
      },
      {
        "slug": "identity-how-to",
        "title": "Using the AgentCore Identity console",
        "desc": "The AgentCore Identity console provides a centralized interface for managing your agent authentication configurations. You can use the console to set up outbound identity providers for external...",
        "file": "/agentcore/md/identity-how-to.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-how-to.html"
      },
      {
        "slug": "identity-oauth-client",
        "title": "Configure an OAuth client",
        "desc": "An OAuth client enables your agent to securely access external services on behalf of users without requiring them to share their credentials directly. For example, your agent can access a user’s...",
        "file": "/agentcore/md/identity-oauth-client.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-oauth-client.html"
      },
      {
        "slug": "identity-add-oauth-client-included",
        "title": "Add OAuth client using included provider",
        "desc": "Built-in providers offer streamlined setup for popular services including Google, GitHub, Slack, and Salesforce. These providers have pre-configured authorization server endpoints and...",
        "file": "/agentcore/md/identity-add-oauth-client-included.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-add-oauth-client-included.html"
      },
      {
        "slug": "identity-add-oauth-client-custom",
        "title": "Add OAuth client using custom provider",
        "desc": "Custom providers enable you to connect to any OAuth2-compatible resource server beyond the built-in provider options. You can configure custom providers by having the system retrieve configuration...",
        "file": "/agentcore/md/identity-add-oauth-client-custom.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-add-oauth-client-custom.html"
      },
      {
        "slug": "identity-update-oauth-client",
        "title": "Update OAuth client",
        "desc": "You can modify the configuration settings for your existing OAuth client. For example, you can update your client credentials (Client ID and Client secret) when they’ve been rotated or changed by...",
        "file": "/agentcore/md/identity-update-oauth-client.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-update-oauth-client.html"
      },
      {
        "slug": "identity-delete-oauth-client",
        "title": "Delete OAuth client",
        "desc": "When you no longer need an OAuth client, you can delete it from your account. Deleting an OAuth client removes the stored configuration and credentials, making them unavailable to your agents. Any...",
        "file": "/agentcore/md/identity-delete-oauth-client.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-delete-oauth-client.html"
      },
      {
        "slug": "identity-api-key",
        "title": "Configure an API key",
        "desc": "API keys provide key-based authentication for services that require direct key access with secure storage capabilities. An API key is a unique identifier used to authenticate and authorize access...",
        "file": "/agentcore/md/identity-api-key.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-api-key.html"
      },
      {
        "slug": "identity-add-api-key",
        "title": "Add API key",
        "desc": "API keys provide key-based authentication for services that require direct key access with secure storage capabilities. An API key is a unique identifier used to authenticate and authorize access...",
        "file": "/agentcore/md/identity-add-api-key.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-add-api-key.html"
      },
      {
        "slug": "identity-update-api-key",
        "title": "Update API key",
        "desc": "You can update an existing API key to replace the key value when your external service provider rotates credentials. Updating the API key ensures your agents continue to have access to the...",
        "file": "/agentcore/md/identity-update-api-key.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-update-api-key.html"
      },
      {
        "slug": "identity-delete-api-key",
        "title": "Delete API key",
        "desc": "When you no longer need an API key, you can delete it from your account. Deleting an API key removes the stored credentials and makes them unavailable to your agents. Any invocations that...",
        "file": "/agentcore/md/identity-delete-api-key.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-delete-api-key.html"
      },
      {
        "slug": "identity-manage-agent-ids",
        "title": "Manage workload identities with AgentCore Identity",
        "desc": "Agent identities in AgentCore Identity are implemented as workload identities with specialized attributes that enable agent-specific capabilities. This approach follows established industry...",
        "file": "/agentcore/md/identity-manage-agent-ids.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-manage-agent-ids.html"
      },
      {
        "slug": "understanding-agent-identities",
        "title": "Understanding workload identities",
        "desc": "Workload identities represent the digital identity of your agents within the AWS environment. They serve as a stable anchor point that persists across different deployment environments and...",
        "file": "/agentcore/md/understanding-agent-identities.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/understanding-agent-identities.html"
      },
      {
        "slug": "agent-identity-directory",
        "title": "Understanding the agent identity directory",
        "desc": "The agent identity directory is a centralized collection of all workload identities within your AWS account. It serves as the authoritative registry for managing and organizing agent identities,...",
        "file": "/agentcore/md/agent-identity-directory.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agent-identity-directory.html"
      },
      {
        "slug": "creating-agent-identities",
        "title": "Create and manage workload identities",
        "desc": "You can create agent identities using several methods, including the AWS CLI and the AgentCore SDK, depending on your workflow and integration requirements. AgentCore Identity provides multiple...",
        "file": "/agentcore/md/creating-agent-identities.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/creating-agent-identities.html"
      },
      {
        "slug": "inbound-jwt-authorizer",
        "title": "Configure inbound JWT authorizer",
        "desc": "The inbound authorizer authenticates and authorizes incoming OAuth 2.0 API requests to AgentCore Runtime and AgentCore Gateway. It validates JSON Web Tokens (JWTs) before allowing access to agents...",
        "file": "/agentcore/md/inbound-jwt-authorizer.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/inbound-jwt-authorizer.html"
      },
      {
        "slug": "identity-outbound-credential-provider",
        "title": "Manage credential providers with AgentCore Identity",
        "desc": "Credential management is a core feature of Amazon Bedrock AgentCore Identity that addresses the complex challenge of securely storing, retrieving, and managing credentials across multiple trust...",
        "file": "/agentcore/md/identity-outbound-credential-provider.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-outbound-credential-provider.html"
      },
      {
        "slug": "common-use-cases",
        "title": "Supported authentication patterns",
        "desc": "AgentCore Identity supports two primary authentication patterns that address different agent use cases. Understanding these patterns will help you choose the right approach for your specific agent...",
        "file": "/agentcore/md/common-use-cases.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/common-use-cases.html"
      },
      {
        "slug": "on-behalf-of-token-exchange",
        "title": "On-behalf-of token exchange with AgentCore Identity",
        "desc": "Amazon Bedrock AgentCore Identity supports On-Behalf-Of (OBO) token exchange, enabling agents and other workloads—such as MCP servers—to exchange an inbound user access token for a new, scoped...",
        "file": "/agentcore/md/on-behalf-of-token-exchange.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/on-behalf-of-token-exchange.html"
      },
      {
        "slug": "client-auth-methods",
        "title": "Client authentication methods",
        "desc": "Client authentication method controls how the OAuth client authenticates with the authorization server’s token endpoint when requesting access tokens.",
        "file": "/agentcore/md/client-auth-methods.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/client-auth-methods.html"
      },
      {
        "slug": "private-key-jwt",
        "title": "Private Key JWT client authentication",
        "desc": "With Private Key JWT, AgentCore Identity authenticates to a downstream identity provider’s token endpoint using a signed JWT client assertion, per RFC 7523, Section 2.2, instead of a client...",
        "file": "/agentcore/md/private-key-jwt.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/private-key-jwt.html"
      },
      {
        "slug": "resource-providers",
        "title": "Configure credential provider",
        "desc": "Resource credential providers in AgentCore Identity act as intelligent intermediaries that manage the complex relationships between agents, identity providers, and resource servers. Each provider...",
        "file": "/agentcore/md/resource-providers.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/resource-providers.html"
      },
      {
        "slug": "obtain-credentials",
        "title": "Obtain credentials",
        "desc": "AgentCore Identity uses a workload access token to authorize agent access to credentials stored in the vault, and this token contains both the identity of the agent and the identity of the end...",
        "file": "/agentcore/md/obtain-credentials.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/obtain-credentials.html"
      },
      {
        "slug": "get-workload-access-token",
        "title": "Get workload access token",
        "desc": "Understanding what workload access tokens are, how to obtain them, and the security aspects of working with them is essential for building secure agent applications. This section covers the key...",
        "file": "/agentcore/md/get-workload-access-token.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/get-workload-access-token.html"
      },
      {
        "slug": "identity-authentication",
        "title": "Obtain OAuth 2.0 access token",
        "desc": "AgentCore Identity enables developers to obtain OAuth tokens for either user-delegated access or machine-to-machine authentication based on the configured OAuth 2.0 credential providers. The...",
        "file": "/agentcore/md/identity-authentication.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-authentication.html"
      },
      {
        "slug": "oauth2-authorization-url-session-binding",
        "title": "OAuth 2.0 authorization URL session binding",
        "desc": "AgentCore Identity provides OAuth 2.0 access token retrievals for your agent applications to access third-party application vendors or resources protected by identity providers / authorization...",
        "file": "/agentcore/md/oauth2-authorization-url-session-binding.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/oauth2-authorization-url-session-binding.html"
      },
      {
        "slug": "scope-credential-provider-access",
        "title": "Scope down access to credential providers by workload identity",
        "desc": "You can use IAM policies to control which workload identities have access to specific credential providers. This enables fine-grained access control, ensuring that only authorized agents can...",
        "file": "/agentcore/md/scope-credential-provider-access.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/scope-credential-provider-access.html"
      },
      {
        "slug": "obtain-api-key",
        "title": "Obtain API key",
        "desc": "Once you have stored your API keys in the AgentCore Identity vault, you can retrieve them directly in your agent using the AgentCore SDK and the @requiresapikey annotation. For example, the code...",
        "file": "/agentcore/md/obtain-api-key.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/obtain-api-key.html"
      },
      {
        "slug": "identity-idps",
        "title": "Provider setup and configuration",
        "desc": "Amazon Bedrock AgentCore Identity provides managed OAuth 2.0 supported providers for both inbound and outbound authentication. Each provider encapsulates the specific authentication protocols,...",
        "file": "/agentcore/md/identity-idps.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idps.html"
      },
      {
        "slug": "identity-idp-cognito",
        "title": "Amazon Cognito",
        "desc": "Amazon Cognito can be configured as an identity provider for accessing AgentCore Gateway and Runtime, or an AgentCore Identity credential provider for outbound resource access. This allows your...",
        "file": "/agentcore/md/identity-idp-cognito.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-cognito.html"
      },
      {
        "slug": "identity-idp-auth0",
        "title": "Auth0 by Okta",
        "desc": "Auth0 can be configured as an identity provider for accessing AgentCore Gateway and Runtime, or an AgentCore Identity credential provider for outbound resource access. This allows your agents to...",
        "file": "/agentcore/md/identity-idp-auth0.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-auth0.html"
      },
      {
        "slug": "identity-idp-atlassian",
        "title": "Atlassian",
        "desc": "Atlassian can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Atlassian’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-atlassian.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-atlassian.html"
      },
      {
        "slug": "identity-idp-cyberark",
        "title": "CyberArk",
        "desc": "CyberArk can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through CyberArk’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-cyberark.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-cyberark.html"
      },
      {
        "slug": "identity-idp-dropbox",
        "title": "Dropbox",
        "desc": "Dropbox can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Dropbox’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-dropbox.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-dropbox.html"
      },
      {
        "slug": "identity-idp-facebook",
        "title": "Facebook",
        "desc": "Facebook can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Facebook’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-facebook.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-facebook.html"
      },
      {
        "slug": "identity-idp-fusionauth",
        "title": "FusionAuth",
        "desc": "FusionAuth can be configured as an outbound resource credential provider for AgentCore Identity. This allows your agents to authenticate users through FusionAuth’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-fusionauth.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-fusionauth.html"
      },
      {
        "slug": "identity-idp-github",
        "title": "GitHub",
        "desc": "GitHub can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through GitHub’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-github.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-github.html"
      },
      {
        "slug": "identity-idp-google",
        "title": "Google",
        "desc": "Google can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Google’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-google.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-google.html"
      },
      {
        "slug": "identity-idp-hubspot",
        "title": "HubSpot",
        "desc": "HubSpot can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through HubSpot’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-hubspot.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-hubspot.html"
      },
      {
        "slug": "identity-idp-linkedin",
        "title": "LinkedIn",
        "desc": "LinkedIn can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through LinkedIn’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-linkedin.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-linkedin.html"
      },
      {
        "slug": "identity-idp-microsoft",
        "title": "Microsoft",
        "desc": "Microsoft Entra ID can be configured as an identity provider for accessing AgentCore Gateway and Runtime, or an AgentCore Identity credential provider for outbound resource access. This allows...",
        "file": "/agentcore/md/identity-idp-microsoft.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-microsoft.html"
      },
      {
        "slug": "identity-idp-notion",
        "title": "Notion",
        "desc": "Notion can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Notion’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-notion.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-notion.html"
      },
      {
        "slug": "identity-idp-okta",
        "title": "Okta",
        "desc": "Okta can be configured as an identity provider for accessing AgentCore Gateway and Runtime, or an AgentCore Identity credential provider for outbound resource access. This allows your agents to...",
        "file": "/agentcore/md/identity-idp-okta.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-okta.html"
      },
      {
        "slug": "identity-idp-onelogin",
        "title": "OneLogin",
        "desc": "OneLogin can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through OneLogin’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-onelogin.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-onelogin.html"
      },
      {
        "slug": "identity-idp-pingidentity",
        "title": "Ping Identity",
        "desc": "Ping Identity’s PingOne platform can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through PingOne’s OAuth2...",
        "file": "/agentcore/md/identity-idp-pingidentity.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-pingidentity.html"
      },
      {
        "slug": "identity-idp-reddit",
        "title": "Reddit",
        "desc": "Reddit can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Reddit’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-reddit.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-reddit.html"
      },
      {
        "slug": "identity-idp-salesforce",
        "title": "Salesforce",
        "desc": "Salesforce can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Salesforce’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-salesforce.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-salesforce.html"
      },
      {
        "slug": "identity-idp-slack",
        "title": "Slack",
        "desc": "Slack can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Slack’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-slack.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-slack.html"
      },
      {
        "slug": "identity-idp-spotify",
        "title": "Spotify",
        "desc": "Spotify can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Spotify’s OAuth2 service and obtain...",
        "file": "/agentcore/md/identity-idp-spotify.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-spotify.html"
      },
      {
        "slug": "identity-idp-twitch",
        "title": "Twitch",
        "desc": "Twitch can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Twitch’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-twitch.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-twitch.html"
      },
      {
        "slug": "identity-idp-x",
        "title": "X",
        "desc": "X can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through X’s OAuth2 service and obtain access tokens for...",
        "file": "/agentcore/md/identity-idp-x.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-x.html"
      },
      {
        "slug": "identity-idp-yandex",
        "title": "Yandex",
        "desc": "Yandex can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Yandex’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-yandex.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-yandex.html"
      },
      {
        "slug": "identity-idp-zoom",
        "title": "Zoom",
        "desc": "Zoom can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Zoom’s OAuth2 service and obtain access...",
        "file": "/agentcore/md/identity-idp-zoom.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-zoom.html"
      },
      {
        "slug": "identity-private-idp",
        "title": "Connect to private identity providers",
        "desc": "Amazon Bedrock AgentCore Identity supports connecting to OAuth 2.0 identity providers (IdPs) hosted inside your AWS VPC, such as self-hosted Keycloak, PingFederate, or other OIDC-compliant...",
        "file": "/agentcore/md/identity-private-idp.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-private-idp.html"
      },
      {
        "slug": "identity-data-protection",
        "title": "Data protection in Amazon Bedrock AgentCore Identity",
        "desc": "The AWS shared responsibility model applies to data protection in Amazon Bedrock AgentCore Identity. As described in this model, AWS is responsible for protecting the global infrastructure that...",
        "file": "/agentcore/md/identity-data-protection.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-data-protection.html"
      },
      {
        "slug": "identity-data-encryption",
        "title": "Data encryption",
        "desc": "Data encryption typically falls into two categories: encryption at rest and encryption in transit.",
        "file": "/agentcore/md/identity-data-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-data-encryption.html"
      },
      {
        "slug": "kms-key-policy-configuration",
        "title": "Set customer managed key policy",
        "desc": "Currently we don’t support configuring CMK on token vault through console.",
        "file": "/agentcore/md/kms-key-policy-configuration.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/kms-key-policy-configuration.html"
      },
      {
        "slug": "api-configuration-encryption",
        "title": "Configure with API operations or an AWS SDK",
        "desc": "Set your key configuration in a SetTokenVaultCMK API request. The following partial example request body sets the token vault to use the provided customer managed key.",
        "file": "/agentcore/md/api-configuration-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/api-configuration-encryption.html"
      },
      {
        "slug": "console-configuration-encryption",
        "title": "Configure KMS key for Token Vault on Console",
        "desc": "The KMS key configuration determines how your token vault encrypts data at rest. You can choose between an AWS owned key or a customer managed key (stored in your account and managed through AWS KMS).",
        "file": "/agentcore/md/console-configuration-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/console-configuration-encryption.html"
      },
      {
        "slug": "identity-tagging",
        "title": "Tagging AgentCore Identity resources",
        "desc": "Amazon Bedrock AgentCore Identity supports comprehensive tagging capabilities across its resource hierarchy to enable better resource management, cost allocation, access control, and operational...",
        "file": "/agentcore/md/identity-tagging.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-tagging.html"
      }
    ]
  },
  {
    "id": "payments",
    "label": "Payments",
    "icon": "CreditCard",
    "color": "#f72585",
    "blurb": "Give agents scoped spending power with wallets, instruments, and sessions.",
    "pages": [
      {
        "slug": "payments",
        "title": "Amazon Bedrock AgentCore payments: Enable secure microtransaction payments for AI agents",
        "desc": "Amazon Bedrock AgentCore payments is a fully managed service that enables microtransaction payments in AI agents to access paid APIs, MCP servers, and content. AI agents increasingly handle...",
        "file": "/agentcore/md/payments.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments.html"
      },
      {
        "slug": "payments-concepts",
        "title": "Core concepts for AgentCore payments",
        "desc": "Personas that interact with AgentCore payments can vary from organization to organization. The following are the general personas found across organizations.",
        "file": "/agentcore/md/payments-concepts.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-concepts.html"
      },
      {
        "slug": "payments-getting-started",
        "title": "AgentCore payments quick start",
        "desc": "This tutorial walks you through setting up AgentCore payments and processing your first microtransaction. By the end, your agent will pay for a resource using the x402 protocol on a test network.",
        "file": "/agentcore/md/payments-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-getting-started.html"
      },
      {
        "slug": "payments-how-it-works",
        "title": "How AgentCore payments works",
        "desc": "Amazon Bedrock AgentCore payments offers payment connection, wallet management, payment limits, payment processing, and payment observability. Using the components and workflows described on this...",
        "file": "/agentcore/md/payments-how-it-works.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-how-it-works.html"
      },
      {
        "slug": "payments-prerequisites",
        "title": "Prerequisites for AgentCore payments",
        "desc": "Complete the prerequisites on this page before you use AgentCore payments.",
        "file": "/agentcore/md/payments-prerequisites.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-prerequisites.html"
      },
      {
        "slug": "payments-iam-roles",
        "title": "IAM roles for AgentCore payments",
        "desc": "AgentCore payments uses a four-role IAM model that separates administrative, management, agent execution, and service operations. Set up IAM permissions based on the persona that matches your role.",
        "file": "/agentcore/md/payments-iam-roles.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-iam-roles.html"
      },
      {
        "slug": "payments-create-manager",
        "title": "Create a Payment Manager and Connector",
        "desc": "A Payment Manager is the top-level resource that coordinates payment operations for your AWS account. When you create a Payment Manager, you specify an authorizer type and an IAM role, and the...",
        "file": "/agentcore/md/payments-create-manager.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-create-manager.html"
      },
      {
        "slug": "payments-processing",
        "title": "Processing payments",
        "desc": "After you complete the control plane setup, use the following workflows to create instruments, sessions, and process payments.",
        "file": "/agentcore/md/payments-processing.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-processing.html"
      },
      {
        "slug": "payments-create-instrument",
        "title": "Create a payment instrument",
        "desc": "A payment instrument represents an embedded crypto wallet that an agent uses to pay merchants on behalf of a user. Each instrument is associated with a specific blockchain network. The ETHEREUM...",
        "file": "/agentcore/md/payments-create-instrument.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-create-instrument.html"
      },
      {
        "slug": "payments-fund-wallet",
        "title": "Fund the wallet and grant agent permissions",
        "desc": "After you create a payment instrument, the end user must fund the wallet with USDC and grant the agent permission to sign transactions. Until both steps are complete, the process payment operation...",
        "file": "/agentcore/md/payments-fund-wallet.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-fund-wallet.html"
      },
      {
        "slug": "payments-create-session",
        "title": "Create a payment session",
        "desc": "A payment session is a time-bounded payment context that optionally enforces a spending budget. When the session expires or the budget is reached, further payment requests within that session are...",
        "file": "/agentcore/md/payments-create-session.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-create-session.html"
      },
      {
        "slug": "payments-connect-bazaar",
        "title": "Coinbase Bazaar via AgentCore Gateway",
        "desc": "AgentCore Gateway lets you connect to paid MCP servers and API endpoints. You can add the Coinbase x402 Bazaar MCP server as a target in a Gateway to discover 10,000+ existing paid MCP tools that...",
        "file": "/agentcore/md/payments-connect-bazaar.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-connect-bazaar.html"
      },
      {
        "slug": "payments-process-payment",
        "title": "Process a payment",
        "desc": "To process a payment, you need two resources:",
        "file": "/agentcore/md/payments-process-payment.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-process-payment.html"
      },
      {
        "slug": "payments-framework-integrations",
        "title": "Framework integrations for AgentCore payments",
        "desc": "AgentCore payments integrates with popular agent frameworks to provide automated payment processing. Each framework uses a different integration pattern:",
        "file": "/agentcore/md/payments-framework-integrations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-framework-integrations.html"
      },
      {
        "slug": "payments-observability",
        "title": "Observability with Amazon CloudWatch",
        "desc": "AgentCore payments supports observability through Amazon CloudWatch, so you can monitor and troubleshoot your payment integration.",
        "file": "/agentcore/md/payments-observability.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-observability.html"
      },
      {
        "slug": "payments-security-best-practices",
        "title": "Security in Amazon Bedrock AgentCore payments",
        "desc": "The following best practices can help you prevent security incidents when using Amazon Bedrock AgentCore payments. Preventative controls stop unsafe actions before they happen. Detective controls...",
        "file": "/agentcore/md/payments-security-best-practices.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-security-best-practices.html"
      },
      {
        "slug": "payments-browser",
        "title": "Integrating AgentCore payments with Browser Tool",
        "desc": "There are two ways your agent can access x402 paid content: via the Browser Tool or via standard HTTP calls.",
        "file": "/agentcore/md/payments-browser.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-browser.html"
      },
      {
        "slug": "payments-troubleshooting",
        "title": "Troubleshooting AgentCore payments",
        "desc": "This section provides solutions to common errors when using AWS Amazon Bedrock AgentCore payments.",
        "file": "/agentcore/md/payments-troubleshooting.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-troubleshooting.html"
      }
    ]
  },
  {
    "id": "code-interpreter",
    "label": "Code Interpreter",
    "icon": "Terminal",
    "color": "#90be6d",
    "blurb": "Sandboxed code execution with file, S3, and session management.",
    "pages": [
      {
        "slug": "code-interpreter-tool",
        "title": "Execute code and analyze data using Amazon Bedrock AgentCore Code Interpreter",
        "desc": "The Amazon Bedrock AgentCore Code Interpreter enables AI agents to write and execute code securely in sandbox environments, enhancing their accuracy and expanding their ability to solve complex...",
        "file": "/agentcore/md/code-interpreter-tool.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html"
      },
      {
        "slug": "code-interpreter-preinstalled-libraries",
        "title": "Pre-installed libraries",
        "desc": "The AgentCore Code Interpreter comes with pre-installed libraries for both Python and Node.js. These libraries are available immediately without requiring additional installation.",
        "file": "/agentcore/md/code-interpreter-preinstalled-libraries.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-preinstalled-libraries.html"
      },
      {
        "slug": "code-interpreter-getting-started",
        "title": "Get started with AgentCore Code Interpreter",
        "desc": "AgentCore Code Interpreter enables your agents to execute Python code in a secure, managed environment. The agent can perform calculations, analyze data, generate visualizations, and validate...",
        "file": "/agentcore/md/code-interpreter-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-getting-started.html"
      },
      {
        "slug": "code-interpreter-using-strands",
        "title": "Using AgentCore Code Interpreter via AWS Strands",
        "desc": "The following sections show you how to use the Amazon Bedrock AgentCore Code Interpreter with the Strands SDK. Before you go through the examples in this section, see Prerequisites.",
        "file": "/agentcore/md/code-interpreter-using-strands.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-using-strands.html"
      },
      {
        "slug": "code-interpreter-using-directly",
        "title": "Using AgentCore Code Interpreter directly",
        "desc": "The following sections show you how to use the Amazon Bedrock AgentCore Code Interpreter directly without an agent framework. This is especially useful when you want to execute specific code...",
        "file": "/agentcore/md/code-interpreter-using-directly.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-using-directly.html"
      },
      {
        "slug": "code-interpreter-building-agents",
        "title": "Run code in Code Interpreter from Agents",
        "desc": "You can build agents that use the Code Interpreter tool to execute code and analyze data. This section demonstrates how to build agents using different frameworks.",
        "file": "/agentcore/md/code-interpreter-building-agents.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-building-agents.html"
      },
      {
        "slug": "code-interpreter-file-operations",
        "title": "Write files to a session",
        "desc": "You can use the Code Interpreter to read and write files in the sandbox environment. This allows you to upload data files, process them with code, and retrieve the results.",
        "file": "/agentcore/md/code-interpreter-file-operations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-file-operations.html"
      },
      {
        "slug": "code-interpreter-s3-integration",
        "title": "Using Terminal Commands with an execution role",
        "desc": "You can create a custom Code Interpreter tool with an execution role to upload/download files from Amazon S3. This allows your code to interact with S3 buckets for storing and retrieving data.",
        "file": "/agentcore/md/code-interpreter-s3-integration.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-s3-integration.html"
      },
      {
        "slug": "code-interpreter-resource-session-management",
        "title": "Resource and session management",
        "desc": "The following topics show how the Amazon Bedrock AgentCore Code Interpreter works and how you can create the resources and manage sessions.",
        "file": "/agentcore/md/code-interpreter-resource-session-management.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-session-management.html"
      },
      {
        "slug": "code-interpreter-resource-management",
        "title": "Resource management",
        "desc": "The AgentCore Code Interpreter provides two types of resources:",
        "file": "/agentcore/md/code-interpreter-resource-management.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-management.html"
      },
      {
        "slug": "code-interpreter-create",
        "title": "Creating an AgentCore Code Interpreter",
        "desc": "You can create a Code Interpreter using the Amazon Bedrock AgentCore console, AWS CLI, or AWS SDK.",
        "file": "/agentcore/md/code-interpreter-create.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-create.html"
      },
      {
        "slug": "code-interpreter-list",
        "title": "Listing AgentCore Code Interpreter tools",
        "desc": "You can view a list of all your Code Interpreter tools to manage and monitor them.",
        "file": "/agentcore/md/code-interpreter-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-list.html"
      },
      {
        "slug": "code-interpreter-delete",
        "title": "Deleting an AgentCore Code Interpreter",
        "desc": "When you no longer need a Code Interpreter, you can delete it to free up resources and avoid unnecessary charges.",
        "file": "/agentcore/md/code-interpreter-delete.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-delete.html"
      },
      {
        "slug": "code-interpreter-session-characteristics",
        "title": "Session management",
        "desc": "The AgentCore Code Interpreter sessions have the following characteristics:",
        "file": "/agentcore/md/code-interpreter-session-characteristics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-session-characteristics.html"
      },
      {
        "slug": "code-interpreter-start-session",
        "title": "Starting a AgentCore Code Interpreter session",
        "desc": "After creating a Code Interpreter, you can start a session to execute code.",
        "file": "/agentcore/md/code-interpreter-start-session.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-start-session.html"
      },
      {
        "slug": "code-interpreter-execute-code",
        "title": "Executing code",
        "desc": "Once you have started a Code Interpreter session, you can execute code in the session.",
        "file": "/agentcore/md/code-interpreter-execute-code.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-execute-code.html"
      },
      {
        "slug": "code-interpreter-runtime-selection",
        "title": "Runtime selection",
        "desc": "For a language, you can optionally specify a particular runtime. The following table shows the supported languages and their available runtimes.",
        "file": "/agentcore/md/code-interpreter-runtime-selection.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-runtime-selection.html"
      },
      {
        "slug": "code-interpreter-stop-session",
        "title": "Stopping a AgentCore Code Interpreter session",
        "desc": "When you are finished using a Code Interpreter session, you should stop it to release resources and avoid unnecessary charges.",
        "file": "/agentcore/md/code-interpreter-stop-session.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-stop-session.html"
      },
      {
        "slug": "code-interpreter-filesystem-configurations",
        "title": "File system configurations for AgentCore Code Interpreter",
        "desc": "AgentCore Code Interpreter supports mounting your own file systems into code interpreter sessions through the filesystemConfigurations parameter. Each configuration mounts an Amazon S3 Files or...",
        "file": "/agentcore/md/code-interpreter-filesystem-configurations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-filesystem-configurations.html"
      },
      {
        "slug": "code-interpreter-api-reference-examples",
        "title": "Code Interpreter API Reference Examples",
        "desc": "This section provides reference examples for common Code Interpreter operations using different approaches. Each example shows how to perform the same operation using AWS CLI, Boto3 SDK, and...",
        "file": "/agentcore/md/code-interpreter-api-reference-examples.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-api-reference-examples.html"
      },
      {
        "slug": "code-interpreter-observability",
        "title": "Observability",
        "desc": "The AgentCore Code Interpreter provides the following observability features:",
        "file": "/agentcore/md/code-interpreter-observability.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-observability.html"
      },
      {
        "slug": "code-interpreter-root-ca-certificates",
        "title": "Configure Root Certificate Authority for Amazon Bedrock AgentCore Code Interpreter",
        "desc": "By default, Amazon Bedrock AgentCore Code Interpreter sessions trust only publicly recognized certificate authorities. If your agents need to access internal services or resources behind a...",
        "file": "/agentcore/md/code-interpreter-root-ca-certificates.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-root-ca-certificates.html"
      },
      {
        "slug": "code-interpreter-troubleshooting",
        "title": "Troubleshoot AgentCore Code Interpreter",
        "desc": "This section provides solutions to common issues you might encounter when using the Amazon Bedrock AgentCore Code Interpreter.",
        "file": "/agentcore/md/code-interpreter-troubleshooting.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-troubleshooting.html"
      }
    ]
  },
  {
    "id": "browser",
    "label": "Browser Tool",
    "icon": "Globe",
    "color": "#43aa8b",
    "blurb": "Headless browsing for agents — sessions, recording, profiles, and proxies.",
    "pages": [
      {
        "slug": "browser-tool",
        "title": "Interact with web applications using Amazon Bedrock AgentCore Browser",
        "desc": "The Amazon Bedrock AgentCore Browser provides a secure, isolated browser environment for your agents to interact with web applications. It runs in a containerized environment, keeping web activity...",
        "file": "/agentcore/md/browser-tool.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html"
      },
      {
        "slug": "browser-quickstart",
        "title": "Get started with AgentCore Browser",
        "desc": "AgentCore Browser enables your agents to interact with web pages through a managed Chrome browser. In this guide, you’ll create an AI agent that navigates a website and extracts information — in...",
        "file": "/agentcore/md/browser-quickstart.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-quickstart.html"
      },
      {
        "slug": "browser-quickstart-nova-act",
        "title": "Using AgentCore Browser with Nova Act",
        "desc": "You can build a browser agent using Nova Act to automate web interactions:",
        "file": "/agentcore/md/browser-quickstart-nova-act.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-quickstart-nova-act.html"
      },
      {
        "slug": "browser-quickstart-playwright",
        "title": "Using AgentCore Browser with Playwright",
        "desc": "You can use the Playwright automation framework with the Browser Tool:",
        "file": "/agentcore/md/browser-quickstart-playwright.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-quickstart-playwright.html"
      },
      {
        "slug": "browser-resource-session-management",
        "title": "Fundamentals",
        "desc": "The following topics show how the Amazon Bedrock AgentCore Browser works and how you can create the resources and manage sessions.",
        "file": "/agentcore/md/browser-resource-session-management.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-resource-session-management.html"
      },
      {
        "slug": "browser-using-tool",
        "title": "Using Browser Tool",
        "desc": "You can create a Browser Tool using the Amazon Bedrock AgentCore console, AWS CLI, or AWS SDK.",
        "file": "/agentcore/md/browser-using-tool.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-using-tool.html"
      },
      {
        "slug": "browser-managing-sessions",
        "title": "Managing Browser Sessions",
        "desc": "After creating a browser, you can start a session to interact with web applications.",
        "file": "/agentcore/md/browser-managing-sessions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-managing-sessions.html"
      },
      {
        "slug": "browser-observability",
        "title": "Observability",
        "desc": "The Amazon Bedrock AgentCore Browser provides built-in observability features including live view, session recording, session replay, and CloudWatch metrics.",
        "file": "/agentcore/md/browser-observability.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-observability.html"
      },
      {
        "slug": "browser-dcv-integration",
        "title": "Live View",
        "desc": "Amazon Bedrock AgentCore’s Live View is powered by AWS DCV. Each browser session launches a dedicated DCV server that streams the browser interface and enables real-time user interaction.",
        "file": "/agentcore/md/browser-dcv-integration.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-dcv-integration.html"
      },
      {
        "slug": "browser-session-recording",
        "title": "Session Recording and Replay",
        "desc": "Browser session recording and replay provides comprehensive observability for debugging, auditing, or training purposes. When you create a browser with session recording enabled, Amazon Bedrock...",
        "file": "/agentcore/md/browser-session-recording.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-session-recording.html"
      },
      {
        "slug": "browser-metrics",
        "title": "CloudWatch Metrics",
        "desc": "You can view the following metrics in Amazon CloudWatch:",
        "file": "/agentcore/md/browser-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-metrics.html"
      },
      {
        "slug": "browser-features",
        "title": "Features",
        "desc": "Amazon Bedrock AgentCore Browser provides advanced features including CAPTCHA reduction, browser extensions, session profiles, proxy configuration, and OS-level interaction.",
        "file": "/agentcore/md/browser-features.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-features.html"
      },
      {
        "slug": "browser-web-bot-auth",
        "title": "Reducing CAPTCHAs with Web Bot Auth",
        "desc": "Amazon Bedrock AgentCore Browser Web Bot Auth (Preview) is based on the draft IETF Web Bot Auth protocol, which is subject to change as the specification evolves toward finalization.",
        "file": "/agentcore/md/browser-web-bot-auth.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-web-bot-auth.html"
      },
      {
        "slug": "browser-extensions",
        "title": "Using browser extensions",
        "desc": "Browser Extensions allow you to install custom extensions into browser sessions at session creation time. This enables you to customize browser behavior with your own extensions for automation...",
        "file": "/agentcore/md/browser-extensions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-extensions.html"
      },
      {
        "slug": "browser-profiles",
        "title": "Using browser profiles",
        "desc": "Browser profiles enable you to persist and reuse browser profile data across multiple browser sessions. A browser profile stores session information including cookies and local storage.",
        "file": "/agentcore/md/browser-profiles.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-profiles.html"
      },
      {
        "slug": "browser-proxies",
        "title": "Using browser proxies",
        "desc": "Amazon Bedrock AgentCore Browser supports routing browser traffic through your own external proxy servers. This enables organizations to:",
        "file": "/agentcore/md/browser-proxies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-proxies.html"
      },
      {
        "slug": "browser-enterprise-policies",
        "title": "Using browser enterprise policies",
        "desc": "Enterprise policies allow you to control browser behavior using the Chromium enterprise policy mechanism. You provide policy files as JSON in your Amazon S3 bucket, and the service applies them to...",
        "file": "/agentcore/md/browser-enterprise-policies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-enterprise-policies.html"
      },
      {
        "slug": "browser-root-ca-certificates",
        "title": "Configure Root Certificate Authority for Amazon Bedrock AgentCore Browser",
        "desc": "By default, Amazon Bedrock AgentCore Browser sessions trust only publicly recognized certificate authorities. If your agents need to access internal services, corporate websites, or resources...",
        "file": "/agentcore/md/browser-root-ca-certificates.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-root-ca-certificates.html"
      },
      {
        "slug": "browser-invoke",
        "title": "Browser OS action",
        "desc": "The InvokeBrowser API provides direct operating system-level control over Amazon Bedrock AgentCore Browser sessions. While the WebSocket-based automation endpoint uses Chrome DevTools Protocol...",
        "file": "/agentcore/md/browser-invoke.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-invoke.html"
      },
      {
        "slug": "browser-filesystem-configurations",
        "title": "File system configurations for AgentCore Browser",
        "desc": "AgentCore Browser supports mounting your own file systems into browser sessions through the filesystemConfigurations parameter. Each configuration mounts an Amazon S3 Files or Amazon EFS access...",
        "file": "/agentcore/md/browser-filesystem-configurations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-filesystem-configurations.html"
      },
      {
        "slug": "browser-tool-troubleshooting",
        "title": "Troubleshoot AgentCore Browser",
        "desc": "This section provides solutions to common issues you might encounter when using the Amazon Bedrock AgentCore Browser.",
        "file": "/agentcore/md/browser-tool-troubleshooting.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool-troubleshooting.html"
      }
    ]
  },
  {
    "id": "observability",
    "label": "Observability",
    "icon": "Activity",
    "color": "#f9c74f",
    "blurb": "Traces, metrics, and telemetry across every AgentCore component.",
    "pages": [
      {
        "slug": "observability",
        "title": "Observe your agent applications on Amazon Bedrock AgentCore Observability",
        "desc": "With AgentCore, you can trace, debug, and monitor AI agents' performance in production environments.",
        "file": "/agentcore/md/observability.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html"
      },
      {
        "slug": "observability-get-started",
        "title": "Get started with AgentCore Observability",
        "desc": "Amazon Bedrock Amazon Bedrock AgentCore Observability helps you trace, debug, and monitor agent performance in production environments. This guide helps you implement observability features in...",
        "file": "/agentcore/md/observability-get-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-get-started.html"
      },
      {
        "slug": "observability-configure",
        "title": "Add observability to your Amazon Bedrock AgentCore resources",
        "desc": "Amazon Bedrock AgentCore provides a number of built-in metrics to monitor the performance of resources for the AgentCore runtime, memory, gateway, built-in tools, and identity resource types. This...",
        "file": "/agentcore/md/observability-configure.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html"
      },
      {
        "slug": "observability-telemetry",
        "title": "Understand observability for agentic resources in AgentCore",
        "desc": "This section defines the concepts of sessions, traces and spans as they relate to monitoring and observability of agents.",
        "file": "/agentcore/md/observability-telemetry.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-telemetry.html"
      },
      {
        "slug": "observability-service-provided",
        "title": "Amazon Bedrock AgentCore generated observability data",
        "desc": "For agents running in the AgentCore runtime, AgentCore automatically generates a set of session metrics which you can view in the Amazon CloudWatch Logs generative AI observability page. You can...",
        "file": "/agentcore/md/observability-service-provided.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-service-provided.html"
      },
      {
        "slug": "observability-runtime-metrics",
        "title": "AgentCore generated runtime observability data",
        "desc": "The runtime metrics provided by AgentCore give you visibility into your agent execution activity levels, processing latency, resource utilization, and error rates. AgentCore also provides...",
        "file": "/agentcore/md/observability-runtime-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-runtime-metrics.html"
      },
      {
        "slug": "observability-memory-metrics",
        "title": "AgentCore generate memory observability data",
        "desc": "For the AgentCore memory resource type, AgentCore outputs metrics to Amazon CloudWatch by default. AgentCore also outputs a default set of spans and logs, if you enable these. See Enabling...",
        "file": "/agentcore/md/observability-memory-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-memory-metrics.html"
      },
      {
        "slug": "observability-payments-metrics",
        "title": "AgentCore generated payments observability data",
        "desc": "AgentCore payments automatically generates spans and metrics for every data plane API call. This data is available in Amazon CloudWatch and AWS X-Ray.",
        "file": "/agentcore/md/observability-payments-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-payments-metrics.html"
      },
      {
        "slug": "observability-gateway-metrics",
        "title": "AgentCore generated gateway observability data",
        "desc": "The following sections describe the gateway metrics, logs, and spans output by AgentCore to Amazon CloudWatch. These metrics aren’t available on the CloudWatch generative AI observability page....",
        "file": "/agentcore/md/observability-gateway-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-gateway-metrics.html"
      },
      {
        "slug": "observability-tool-metrics",
        "title": "AgentCore generated built-in tools observability data",
        "desc": "AgentCore provides the following built-in metrics for the code interpreter and browser tools. Built-in tool metrics are batched at one minute intervals. To learn more about AgentCore tools, see...",
        "file": "/agentcore/md/observability-tool-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-tool-metrics.html"
      },
      {
        "slug": "observability-identity-metrics",
        "title": "AgentCore generated identity observability data",
        "desc": "This document described observability data emitted by the Bedrock AgentCore Identity Service. This data provides visibility into the performance, usage, and operational health of the service,...",
        "file": "/agentcore/md/observability-identity-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-identity-metrics.html"
      },
      {
        "slug": "observability-policy-metrics",
        "title": "AgentCore generated Policy in AgentCore observability data",
        "desc": "For policy and policy engine resource types, Amazon Bedrock AgentCore publishes invocation metrics to CloudWatch by default. Additional span data is available when traces are enabled for the...",
        "file": "/agentcore/md/observability-policy-metrics.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-policy-metrics.html"
      },
      {
        "slug": "observability-view",
        "title": "View observability data for your Amazon Bedrock AgentCore agents",
        "desc": "After implementing observability in your agent, you can view the collected metrics and traces in both the CloudWatch console generative AI observability page and in CloudWatch Logs. Refer to the...",
        "file": "/agentcore/md/observability-view.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-view.html"
      },
      {
        "slug": "observability-cross-account",
        "title": "Monitor AgentCore resources across accounts",
        "desc": "You can use Amazon CloudWatch cross-account observability to monitor Amazon Bedrock AgentCore resources across multiple AWS accounts from a single monitoring account. This enables you to view...",
        "file": "/agentcore/md/observability-cross-account.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-cross-account.html"
      },
      {
        "slug": "mcp-getting-started",
        "title": "Amazon Bedrock AgentCore MCP Server: Vibe coding with your coding assistant",
        "desc": "The Amazon Bedrock AgentCore Model Context Protocol (MCP) server helps you transform, deploy, and test Amazon Bedrock AgentCore-compatible agents directly from your preferred development...",
        "file": "/agentcore/md/mcp-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/mcp-getting-started.html"
      }
    ]
  },
  {
    "id": "policy",
    "label": "Policy",
    "icon": "Shield",
    "color": "#577590",
    "blurb": "Cedar-based authorization, guardrails, and enforcement for agent actions.",
    "pages": [
      {
        "slug": "policy",
        "title": "Policy in Amazon Bedrock AgentCore: Control Agent Interactions",
        "desc": "Policy in Amazon Bedrock AgentCore enables developers to define and enforce security controls for AI agent interactions with tools by creating a protective boundary around agent operations. AI...",
        "file": "/agentcore/md/policy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html"
      },
      {
        "slug": "policy-getting-started",
        "title": "Getting started with Policy in AgentCore",
        "desc": "In this tutorial, you’ll learn how to set up Policy in AgentCore and integrate it with a Amazon Bedrock AgentCore Gateway using the AgentCore CLI. You’ll create a refund processing tool with Cedar...",
        "file": "/agentcore/md/policy-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-getting-started.html"
      },
      {
        "slug": "policy-core-concepts",
        "title": "Core concepts",
        "desc": "Before using Policy in Amazon Bedrock AgentCore, it’s important to understand the key concepts and components that work together to provide policy-based governance for your AI agents.",
        "file": "/agentcore/md/policy-core-concepts.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-core-concepts.html"
      },
      {
        "slug": "policy-permissions",
        "title": "AgentCore Gateway and Policy in AgentCore IAM Permissions",
        "desc": "This guide provides the required IAM permissions for using Amazon Bedrock AgentCore Gateway with Policy in AgentCore for fine-grained authorization control using Cedar policies.",
        "file": "/agentcore/md/policy-permissions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-permissions.html"
      },
      {
        "slug": "policy-create-engine",
        "title": "Create a policy engine",
        "desc": "A policy engine is a collection of policies that evaluates and authorizes agent tool calls. When associated with a gateway, the policy engine intercepts all agent requests and determines whether...",
        "file": "/agentcore/md/policy-create-engine.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-create-engine.html"
      },
      {
        "slug": "policy-create-policies",
        "title": "Create a policy",
        "desc": "Policy in Amazon Bedrock AgentCore uses Cedar as its authorization language to control access to tools and resources. This guide explains how to understand Cedar policies and write authorization...",
        "file": "/agentcore/md/policy-create-policies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-create-policies.html"
      },
      {
        "slug": "policy-understanding-cedar",
        "title": "Understanding Cedar policies",
        "desc": "Policy in AgentCore uses Cedar policies to control access to AgentCore Gateway tools. This section explains Cedar policy structure, evaluation semantics, and key concepts.",
        "file": "/agentcore/md/policy-understanding-cedar.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-understanding-cedar.html"
      },
      {
        "slug": "policy-scope",
        "title": "Policy scope",
        "desc": "The scope defines what the policy applies to. Every Cedar policy specifies three components:",
        "file": "/agentcore/md/policy-scope.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-scope.html"
      },
      {
        "slug": "policy-conditions",
        "title": "Policy conditions",
        "desc": "Conditions add fine-grained logic to policies using when and unless clauses:",
        "file": "/agentcore/md/policy-conditions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-conditions.html"
      },
      {
        "slug": "policy-authorization-flow",
        "title": "Authorization flow",
        "desc": "Amazon Bedrock AgentCore Gateway evaluates Cedar policies against incoming requests. This section explains how authorization information flows from the request to policy evaluation.",
        "file": "/agentcore/md/policy-authorization-flow.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-authorization-flow.html"
      },
      {
        "slug": "policy-time-based",
        "title": "Time-based policy support",
        "desc": "Policy in AgentCore supports time-based restrictions in Cedar policies through the context.system.now datetime value. This enables you to enforce policies based on specific dates, times, or time...",
        "file": "/agentcore/md/policy-time-based.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-time-based.html"
      },
      {
        "slug": "policy-schema-constraints",
        "title": "Schema constraints",
        "desc": "Policies for Amazon Bedrock AgentCore Gateway must validate against a specific Cedar schema that is automatically generated from the Gateway’s MCP tool manifest. This schema defines what’s...",
        "file": "/agentcore/md/policy-schema-constraints.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-schema-constraints.html"
      },
      {
        "slug": "policy-limitations-section",
        "title": "Limitations",
        "desc": "Cedar policies and the current Amazon Bedrock AgentCore Gateway implementation have certain limitations that affect policy authoring and functionality.",
        "file": "/agentcore/md/policy-limitations-section.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-limitations-section.html"
      },
      {
        "slug": "policy-common-patterns",
        "title": "Common policy patterns",
        "desc": "These examples demonstrate frequently used Cedar policy patterns. The patterns work with both OAuth and IAM authentication—select the appropriate principal type for your AgentCore Gateway...",
        "file": "/agentcore/md/policy-common-patterns.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-common-patterns.html"
      },
      {
        "slug": "policy-guardrails-getting-started",
        "title": "Getting started with guardrails in the AgentCore CLI",
        "desc": "Guardrails let you add content filtering policies to your agent’s gateway. When a request matches a policy rule (for example, violent content), the gateway blocks it before it reaches your agent.",
        "file": "/agentcore/md/policy-guardrails-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-guardrails-getting-started.html"
      },
      {
        "slug": "policy-guardrails-in-policies",
        "title": "Guardrails in policies",
        "desc": "This section explains how to define Bedrock Guardrails in policy. Bedrock Guardrails provides configurable safeguards that can run on both requests and responses to keep AI applications safe. You...",
        "file": "/agentcore/md/policy-guardrails-in-policies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-guardrails-in-policies.html"
      },
      {
        "slug": "policy-natural-language",
        "title": "Writing policies in natural language",
        "desc": "Policy in AgentCore will automatically select the optimal region within your geography to process your inference requests made through Policy authoring service. This maximizes available compute...",
        "file": "/agentcore/md/policy-natural-language.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-natural-language.html"
      },
      {
        "slug": "policy-validate-policies",
        "title": "Validate and test policies",
        "desc": "Before deploying policies to production, Policy in AgentCore provides validation capabilities to catch errors and identify potential issues. Validation works differently depending on whether you...",
        "file": "/agentcore/md/policy-validate-policies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-validate-policies.html"
      },
      {
        "slug": "policy-test-a-policy",
        "title": "Test a policy in LOG_ONLY mode",
        "desc": "Using the policy-level enforcement mode, you can toggle between ACTIVE and LOGONLY to answer the question: \"What would this policy do to my traffic if it was applied?\" Per policy LOGONLY mode lets...",
        "file": "/agentcore/md/policy-test-a-policy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-test-a-policy.html"
      },
      {
        "slug": "policy-validation-overview",
        "title": "Validation and analysis overview",
        "desc": "Schema checks verify that policies comply with the Cedar schema for your gateways:",
        "file": "/agentcore/md/policy-validation-overview.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-validation-overview.html"
      },
      {
        "slug": "policy-generation-validation",
        "title": "Policy generation: per-policy validation",
        "desc": "When using the policy authoring service to generate policies from natural language, validation and analysis occur per individual policy during generation.",
        "file": "/agentcore/md/policy-generation-validation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-generation-validation.html"
      },
      {
        "slug": "policy-create-update-validation",
        "title": "Policy create and update: per-policy engine validation",
        "desc": "When creating or updating policies directly (not through generation), validation and analysis takes into account the new policy as well as its interactions with all preexisting policies in the...",
        "file": "/agentcore/md/policy-create-update-validation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-create-update-validation.html"
      },
      {
        "slug": "policy-use-policies",
        "title": "Use policies",
        "desc": "This section explains how to create and manage Cedar policies.",
        "file": "/agentcore/md/policy-use-policies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-use-policies.html"
      },
      {
        "slug": "add-policies-to-engine",
        "title": "Add policies to the Policy Engine",
        "desc": "You can create one or more policies in your policy engine to control how agents interact with your enterprise tools and data through Amazon Bedrock AgentCore Gateway.",
        "file": "/agentcore/md/add-policies-to-engine.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/add-policies-to-engine.html"
      },
      {
        "slug": "create-gateway-with-policy",
        "title": "Create gateway with Policy Engine",
        "desc": "This section provides examples of creating a gateway with a policy engine associated for policy enforcement.",
        "file": "/agentcore/md/create-gateway-with-policy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/create-gateway-with-policy.html"
      },
      {
        "slug": "update-gateway-with-policy",
        "title": "Update existing gateway with Policy Engine",
        "desc": "Associate a policy engine with an existing gateway:",
        "file": "/agentcore/md/update-gateway-with-policy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/update-gateway-with-policy.html"
      },
      {
        "slug": "policy-enforcement-modes",
        "title": "Policy enforcement modes",
        "desc": "Enforcement mode defines how the gateway applies policy decisions. The policy engine supports two modes:",
        "file": "/agentcore/md/policy-enforcement-modes.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-enforcement-modes.html"
      },
      {
        "slug": "use-gateway-with-policy",
        "title": "Use an AgentCore Gateway with Policy in AgentCore",
        "desc": "Follow the gateway authorization and authentication guide to obtain the credentials needed for gateway access.",
        "file": "/agentcore/md/use-gateway-with-policy.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/use-gateway-with-policy.html"
      },
      {
        "slug": "manage-policies-engines",
        "title": "Manage Policies and Policy Engines",
        "desc": "Use these operations to manage your Policy Engines and policies.",
        "file": "/agentcore/md/manage-policies-engines.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/manage-policies-engines.html"
      },
      {
        "slug": "policy-use-errors",
        "title": "Errors",
        "desc": "Policy in AgentCore operations can return the following types of errors:",
        "file": "/agentcore/md/policy-use-errors.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-use-errors.html"
      },
      {
        "slug": "example-policies",
        "title": "Example policies",
        "desc": "This section provides comprehensive examples of Cedar authorization policies for an insurance management system. These examples demonstrate various Cedar language features and authorization...",
        "file": "/agentcore/md/example-policies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/example-policies.html"
      },
      {
        "slug": "policy-advanced",
        "title": "Advanced features and topics for Policy in AgentCore",
        "desc": "This chapter covers some advanced topics and additional information that can help supplement your knowledge of Policy in AgentCore and how you can use it effectively in your applications.",
        "file": "/agentcore/md/policy-advanced.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-advanced.html"
      },
      {
        "slug": "policy-encryption",
        "title": "Encrypt your AgentCore policy engine with a customer-managed KMS key",
        "desc": "Policy in AgentCore provides encryption by default to protect sensitive customer data at rest using AWS owned encryption keys. As an extra layer of protection, Policy in AgentCore allows you to...",
        "file": "/agentcore/md/policy-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-encryption.html"
      }
    ]
  },
  {
    "id": "evaluations",
    "label": "Evaluations",
    "icon": "ClipboardCheck",
    "color": "#b5179e",
    "blurb": "Score agent quality — built-in and custom evaluators, online and batch.",
    "pages": [
      {
        "slug": "evaluations",
        "title": "Evaluate agent performance with Amazon Bedrock AgentCore Evaluations",
        "desc": "Amazon Bedrock AgentCore Evaluations provides automated assessment tools to measure how well your agent or tools perform specific tasks, handle edge cases, and maintain consistency across...",
        "file": "/agentcore/md/evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html"
      },
      {
        "slug": "how-it-works-evaluations",
        "title": "How it works",
        "desc": "Amazon Bedrock AgentCore Evaluations provides capabilities to assess the performance of AI agents. It can compute metrics such as an agent’s end-to-end task completion (goal attainment)...",
        "file": "/agentcore/md/how-it-works-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/how-it-works-evaluations.html"
      },
      {
        "slug": "evaluations-terminology",
        "title": "Evaluation terminology",
        "desc": "Understanding key concepts and terminology is essential for effectively using AgentCore Evaluations. The following terms define the core components and processes involved in agent evaluation.",
        "file": "/agentcore/md/evaluations-terminology.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-terminology.html"
      },
      {
        "slug": "evaluators",
        "title": "Evaluators",
        "desc": "Evaluators are the core components that assess your agent’s performance across different dimensions. They analyze agent traces and provide quantitative scores based on specific criteria such as...",
        "file": "/agentcore/md/evaluators.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluators.html"
      },
      {
        "slug": "evaluations-types",
        "title": "Evaluation types",
        "desc": "AgentCore Evaluations provides three evaluation types, which differ in when and how the evaluation is performed:",
        "file": "/agentcore/md/evaluations-types.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-types.html"
      },
      {
        "slug": "supported-frameworks",
        "title": "Supported agent frameworks",
        "desc": "Amazon Bedrock AgentCore Evaluations evaluates agents built with several agent frameworks. What an agent emits as telemetry, and how that telemetry is structured, depends on the agent framework...",
        "file": "/agentcore/md/supported-frameworks.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks.html"
      },
      {
        "slug": "supported-frameworks-telemetry",
        "title": "Telemetry setup and delivery",
        "desc": "Your agent emits spans that Amazon Bedrock AgentCore Evaluations uses to reconstruct each session. For how AgentCore represents sessions, traces, and spans, see Understand observability for...",
        "file": "/agentcore/md/supported-frameworks-telemetry.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-telemetry.html"
      },
      {
        "slug": "supported-frameworks-strands",
        "title": "Strands Agents",
        "desc": "This page explains how to instrument a Strands Agents agent, how spans are identified, and how evaluation fields are extracted.",
        "file": "/agentcore/md/supported-frameworks-strands.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-strands.html"
      },
      {
        "slug": "supported-frameworks-langgraph",
        "title": "LangGraph",
        "desc": "This page explains how to instrument a LangGraph agent, how spans are identified, and how evaluation fields are extracted. It closes with best practices for structuring a LangGraph agent so that...",
        "file": "/agentcore/md/supported-frameworks-langgraph.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-langgraph.html"
      },
      {
        "slug": "supported-frameworks-openai-agents",
        "title": "OpenAI Agents",
        "desc": "This page explains how to instrument an OpenAI Agents agent, how spans are identified, and how evaluation fields are extracted.",
        "file": "/agentcore/md/supported-frameworks-openai-agents.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-openai-agents.html"
      },
      {
        "slug": "supported-frameworks-llamaindex",
        "title": "LlamaIndex",
        "desc": "This page explains how to instrument a LlamaIndex agent, how spans are identified, and how evaluation fields are extracted. It closes with best practices for structuring a LlamaIndex agent so that...",
        "file": "/agentcore/md/supported-frameworks-llamaindex.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-llamaindex.html"
      },
      {
        "slug": "supported-frameworks-google-adk",
        "title": "Google ADK",
        "desc": "This page explains how to instrument a Google Agent Development Kit (ADK) agent, how spans are identified, and how evaluation fields are extracted.",
        "file": "/agentcore/md/supported-frameworks-google-adk.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-google-adk.html"
      },
      {
        "slug": "supported-frameworks-claude-agent-sdk",
        "title": "Claude Agent SDK",
        "desc": "This page explains how to instrument a Claude Agent SDK agent, how spans are identified, and how evaluation fields are extracted.",
        "file": "/agentcore/md/supported-frameworks-claude-agent-sdk.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-claude-agent-sdk.html"
      },
      {
        "slug": "supported-frameworks-generic",
        "title": "Generic framework support",
        "desc": "Amazon Bedrock AgentCore Evaluations reads telemetry through two open standards: the OpenTelemetry generative AI semantic conventions and the OpenInference semantic conventions. Alongside the...",
        "file": "/agentcore/md/supported-frameworks-generic.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-generic.html"
      },
      {
        "slug": "built-in-evaluators-overview",
        "title": "Built-in evaluators",
        "desc": "Built-in evaluators in AgentCore AgentCore Evaluations provide pre-configured evaluator for assessing your agents. These evaluators use predefined evaluator models and prompt templates that have...",
        "file": "/agentcore/md/built-in-evaluators-overview.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/built-in-evaluators-overview.html"
      },
      {
        "slug": "evaluations-cross-region-inference",
        "title": "Cross region inference",
        "desc": "AgentCore Evaluations will automatically select the optimal region within your geography to process your inference requests. This maximizes available compute resources, model availability, and...",
        "file": "/agentcore/md/evaluations-cross-region-inference.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-cross-region-inference.html"
      },
      {
        "slug": "prompt-templates-builtin",
        "title": "Prompt templates",
        "desc": "Each prompt template contains at least one placeholder, which is replaced with actual trace information before it is sent to the judge model.",
        "file": "/agentcore/md/prompt-templates-builtin.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/prompt-templates-builtin.html"
      },
      {
        "slug": "custom-evaluators",
        "title": "Custom evaluators",
        "desc": "Custom evaluators in AgentCore Evaluations allow you to define your own evaluator model, evaluation instruction and scoring schemas. You can create custom evaluators that are tailored to your...",
        "file": "/agentcore/md/custom-evaluators.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/custom-evaluators.html"
      },
      {
        "slug": "create-evaluator",
        "title": "Create evaluator",
        "desc": "The CreateEvaluator API creates a new custom evaluator that defines how to assess specific aspects of your agent’s behavior. This asynchronous operation returns immediately while the evaluator is...",
        "file": "/agentcore/md/create-evaluator.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/create-evaluator.html"
      },
      {
        "slug": "list-evaluators",
        "title": "List evaluators",
        "desc": "The ListEvaluators API returns a paginated list of all custom evaluators in your account and Region, including both your custom evaluators and built-in evaluators. Built-in evaluators are returned...",
        "file": "/agentcore/md/list-evaluators.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/list-evaluators.html"
      },
      {
        "slug": "update-evaluator",
        "title": "Update evaluator",
        "desc": "The UpdateEvaluator API modifies an existing custom evaluator’s configuration, description, or evaluation level. This asynchronous operation is only allowed on unlocked evaluators.",
        "file": "/agentcore/md/update-evaluator.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/update-evaluator.html"
      },
      {
        "slug": "get-evaluator",
        "title": "Get evaluator",
        "desc": "The GetEvaluator API retrieves complete details of a specific custom or built-in evaluator including its configuration, status, and lock state.",
        "file": "/agentcore/md/get-evaluator.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/get-evaluator.html"
      },
      {
        "slug": "delete-evaluator",
        "title": "Delete evaluator",
        "desc": "The DeleteEvaluator API permanently removes a custom evaluator and all its configuration data. This asynchronous operation is irreversible.",
        "file": "/agentcore/md/delete-evaluator.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/delete-evaluator.html"
      },
      {
        "slug": "code-based-evaluators",
        "title": "Custom code-based evaluator",
        "desc": "Custom code-based evaluators let you use your own AWS Lambda function to programmatically evaluate agent performance, instead of using an LLM as a judge. This gives you full control over the...",
        "file": "/agentcore/md/code-based-evaluators.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-based-evaluators.html"
      },
      {
        "slug": "online-evaluations",
        "title": "Online evaluation",
        "desc": "An online evaluation configuration is a resource that defines how your agent is evaluated, including which evaluators to apply, which data sources to monitor, and evaluation parameters.",
        "file": "/agentcore/md/online-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/online-evaluations.html"
      },
      {
        "slug": "evaluations-prerequisites",
        "title": "Prerequisites",
        "desc": "Before you begin using Amazon Bedrock AgentCore Evaluations, ensure you have the necessary AWS permissions and service roles configured.",
        "file": "/agentcore/md/evaluations-prerequisites.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-prerequisites.html"
      },
      {
        "slug": "create-deploy-agent",
        "title": "Create and deploy your agent",
        "desc": "If you have an agent already up and running in AgentCore Runtime, you can skip the following steps",
        "file": "/agentcore/md/create-deploy-agent.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/create-deploy-agent.html"
      },
      {
        "slug": "create-online-evaluations",
        "title": "Create online evaluation",
        "desc": "The CreateOnlineEvaluationConfig API creates a new online evaluation configuration that continuously monitors your agent’s performance using live traffic. This asynchronous operation sets up the...",
        "file": "/agentcore/md/create-online-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/create-online-evaluations.html"
      },
      {
        "slug": "get-online-evaluations",
        "title": "Get online evaluation",
        "desc": "The GetOnlineEvaluationConfig API retrieves the complete details and current status of an existing online evaluation configuration. This synchronous operation returns the full configuration...",
        "file": "/agentcore/md/get-online-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/get-online-evaluations.html"
      },
      {
        "slug": "list-online-evaluations",
        "title": "List online evaluations",
        "desc": "The ListOnlineEvaluationConfigs API retrieves a paginated list of all online evaluation configurations in your account and Region. This synchronous operation uses the POST method and returns...",
        "file": "/agentcore/md/list-online-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/list-online-evaluations.html"
      },
      {
        "slug": "update-online-evaluations",
        "title": "Update online evaluation",
        "desc": "The UpdateOnlineEvaluationConfig API modifies an existing online evaluation configuration, allowing you to change evaluators, data sources, execution settings, and other parameters. This operation...",
        "file": "/agentcore/md/update-online-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/update-online-evaluations.html"
      },
      {
        "slug": "delete-online-evaluations",
        "title": "Delete online evaluation",
        "desc": "The DeleteOnlineEvaluationConfig API permanently removes an online evaluation configuration and stops all associated evaluation processing. This asynchronous operation disables the evaluation...",
        "file": "/agentcore/md/delete-online-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/delete-online-evaluations.html"
      },
      {
        "slug": "results-and-output",
        "title": "Results and output",
        "desc": "Online evaluation results are automatically saved to Amazon CloudWatch. When you create an online evaluation configuration, the service creates a dedicated CloudWatch log group to store your...",
        "file": "/agentcore/md/results-and-output.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/results-and-output.html"
      },
      {
        "slug": "on-demand-evaluations",
        "title": "On-demand evaluation",
        "desc": "On-demand evaluation provides a flexible way to evaluate specific agent interactions by directly analyzing a chosen set of spans. Unlike online evaluation which continuously monitors production...",
        "file": "/agentcore/md/on-demand-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/on-demand-evaluations.html"
      },
      {
        "slug": "iam-permissions-on-demand",
        "title": "IAM permissions for on-demand evaluation",
        "desc": "Your IAM user or role needs the following permissions to run on-demand evaluations:",
        "file": "/agentcore/md/iam-permissions-on-demand.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/iam-permissions-on-demand.html"
      },
      {
        "slug": "getting-started-on-demand",
        "title": "Getting started with on-demand evaluation",
        "desc": "Follow these steps to set up and run your first on-demand evaluation.",
        "file": "/agentcore/md/getting-started-on-demand.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-on-demand.html"
      },
      {
        "slug": "ground-truth-evaluations",
        "title": "Ground truth evaluations",
        "desc": "Ground truth is the known correct answer or expected behavior for a given input — the \"gold standard\" you compare actual results against. For agent evaluation, ground truth transforms subjective...",
        "file": "/agentcore/md/ground-truth-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ground-truth-evaluations.html"
      },
      {
        "slug": "understanding-input-spans",
        "title": "Understanding input spans",
        "desc": "The evaluate API accepts a list of sessionSpans , which consists of two types of entities: spans and events",
        "file": "/agentcore/md/understanding-input-spans.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/understanding-input-spans.html"
      },
      {
        "slug": "batch-evaluations",
        "title": "Batch evaluation",
        "desc": "Batch evaluation runs evaluators against multiple agent sessions in a single job with server-side orchestration. Unlike on-demand evaluation where you collect spans and call the Evaluate API...",
        "file": "/agentcore/md/batch-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations.html"
      },
      {
        "slug": "batch-evaluations-prereqs",
        "title": "Prerequisites",
        "desc": "Before you can run batch evaluations, make sure the following are in place.",
        "file": "/agentcore/md/batch-evaluations-prereqs.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-prereqs.html"
      },
      {
        "slug": "batch-evaluations-getting-started",
        "title": "Getting started with batch evaluation",
        "desc": "This walkthrough takes you from a deployed agent to batch evaluation results using an Acme Store customer support agent. You will create the agent, deploy it, generate sample sessions, run a batch...",
        "file": "/agentcore/md/batch-evaluations-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-getting-started.html"
      },
      {
        "slug": "batch-evaluations-start",
        "title": "Start batch evaluation",
        "desc": "Start a batch evaluation to run evaluators against multiple agent sessions. The service discovers sessions from CloudWatch Logs, runs each evaluator against each session, and produces aggregate...",
        "file": "/agentcore/md/batch-evaluations-start.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-start.html"
      },
      {
        "slug": "batch-evaluations-get",
        "title": "Get batch evaluation results",
        "desc": "Retrieve the status and results of a batch evaluation job. Poll this operation until the job reaches a terminal state (COMPLETED, FAILED, or STOPPED).",
        "file": "/agentcore/md/batch-evaluations-get.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-get.html"
      },
      {
        "slug": "batch-evaluations-list",
        "title": "List batch evaluations",
        "desc": "List all batch evaluation jobs in your account. Results are paginated.",
        "file": "/agentcore/md/batch-evaluations-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-list.html"
      },
      {
        "slug": "batch-evaluations-stop",
        "title": "Stop batch evaluation",
        "desc": "Stop a running batch evaluation job. The job transitions to STOPPING and then STOPPED. Partial results from sessions that were already evaluated may be available in the response.",
        "file": "/agentcore/md/batch-evaluations-stop.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-stop.html"
      },
      {
        "slug": "batch-evaluations-delete",
        "title": "Delete batch evaluation",
        "desc": "Delete a batch evaluation job and its associated metadata. The job must be in a terminal state (COMPLETED, FAILED, or STOPPED) before it can be deleted.",
        "file": "/agentcore/md/batch-evaluations-delete.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-delete.html"
      },
      {
        "slug": "batch-evaluations-results",
        "title": "Understanding results and output",
        "desc": "Batch evaluation results come in two layers: aggregate summaries in the API response, and per-session detail in CloudWatch Logs.",
        "file": "/agentcore/md/batch-evaluations-results.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-results.html"
      },
      {
        "slug": "batch-evaluations-encryption",
        "title": "Batch evaluation encryption",
        "desc": "When you specify a kmsKeyArn on a batch evaluation, the service encrypts all output artifacts stored in S3 using S3 server-side encryption with KMS (SSE-KMS). This includes the data source...",
        "file": "/agentcore/md/batch-evaluations-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-encryption.html"
      },
      {
        "slug": "dataset-evaluations",
        "title": "Dataset evaluation",
        "desc": "Dataset evaluation is in public preview. Features and APIs may change before general availability.",
        "file": "/agentcore/md/dataset-evaluations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations.html"
      },
      {
        "slug": "datasets-prereqs",
        "title": "Prerequisites",
        "desc": "Before you can manage datasets, make sure the following are in place.",
        "file": "/agentcore/md/datasets-prereqs.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-prereqs.html"
      },
      {
        "slug": "datasets-getting-started",
        "title": "Getting started",
        "desc": "This topic provides an end-to-end workflow for creating, populating, and publishing a dataset.",
        "file": "/agentcore/md/datasets-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-getting-started.html"
      },
      {
        "slug": "dataset-evaluations-schema",
        "title": "Dataset schema",
        "desc": "A dataset contains one or more scenarios. Each scenario represents a conversation (session) with the agent. Both the on-demand and batch dataset runners use the same dataset format.",
        "file": "/agentcore/md/dataset-evaluations-schema.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations-schema.html"
      },
      {
        "slug": "datasets-manage",
        "title": "Manage datasets",
        "desc": "This topic covers creating, retrieving, listing, updating, and deleting datasets.",
        "file": "/agentcore/md/datasets-manage.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-manage.html"
      },
      {
        "slug": "datasets-examples",
        "title": "Manage dataset examples",
        "desc": "After a dataset reaches ACTIVE status, you can add, update, delete, and list examples in the Draft. All example mutations are asynchronous (HTTP 202) and use all-or-nothing semantics — if any...",
        "file": "/agentcore/md/datasets-examples.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-examples.html"
      },
      {
        "slug": "datasets-versions",
        "title": "Manage dataset versions",
        "desc": "Use CreateDatasetVersion to publish the current Draft as an immutable numbered version. The Draft persists unchanged after publishing — draftStatus changes from MODIFIED to UNMODIFIED.",
        "file": "/agentcore/md/datasets-versions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-versions.html"
      },
      {
        "slug": "datasets-encryption",
        "title": "Dataset encryption",
        "desc": "When you specify a kmsKeyArn on a dataset, the service encrypts all stored examples using S3 server-side encryption with KMS (SSE-KMS). This includes examples in the Draft and all published versions.",
        "file": "/agentcore/md/datasets-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-encryption.html"
      },
      {
        "slug": "dataset-evaluations-on-demand",
        "title": "On-demand dataset runner",
        "desc": "The OnDemandEvaluationDatasetRunner orchestrates the entire evaluation lifecycle client-side: invoke the agent, wait for telemetry ingestion, collect spans from CloudWatch, and call the Evaluate...",
        "file": "/agentcore/md/dataset-evaluations-on-demand.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations-on-demand.html"
      },
      {
        "slug": "dataset-evaluations-batch",
        "title": "Batch dataset runner",
        "desc": "The BatchEvaluationRunner delegates span collection and evaluation entirely to the service via the StartBatchEvaluation and GetBatchEvaluation APIs. After invoking your agent for each scenario,...",
        "file": "/agentcore/md/dataset-evaluations-batch.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations-batch.html"
      },
      {
        "slug": "simulation",
        "title": "Simulation",
        "desc": "Simulation lets you evaluate your agent against dynamic, multi-turn conversations generated by LLM-backed actors. Instead of replaying fixed scripts, you define actor profiles with personas and...",
        "file": "/agentcore/md/simulation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/simulation.html"
      },
      {
        "slug": "user-simulation",
        "title": "User simulation",
        "desc": "User simulation uses an LLM-backed actor to play the role of an end user interacting with your agent. You define the actor’s profile and goal, and the actor drives a multi-turn conversation with...",
        "file": "/agentcore/md/user-simulation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/user-simulation.html"
      },
      {
        "slug": "diagnose-evaluation-issues",
        "title": "Diagnose AgentCore Evaluation issues with an AI coding assistant",
        "desc": "If your AgentCore Evaluation configuration isn’t producing results — or if you’re seeing errors like LogEventMissingException, AgentSpanMappingException, or empty evaluation scores — you can use...",
        "file": "/agentcore/md/diagnose-evaluation-issues.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/diagnose-evaluation-issues.html"
      },
      {
        "slug": "diagnose-evaluation-skill-source",
        "title": "Diagnostic skill source",
        "desc": "The following is the full source of the AgentCore Evaluation Diagnostic Skill. The skill follows the open Agent Skills standard. Copy the entire code block and save it as SKILL.md inside a new...",
        "file": "/agentcore/md/diagnose-evaluation-skill-source.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/diagnose-evaluation-skill-source.html"
      },
      {
        "slug": "evaluations-encryption",
        "title": "Encryption at rest for AgentCore Evaluations",
        "desc": "This page covers customer managed key encryption for custom evaluators. For dataset encryption, see Dataset encryption.",
        "file": "/agentcore/md/evaluations-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-encryption.html"
      }
    ]
  },
  {
    "id": "optimization",
    "label": "Optimization",
    "icon": "TrendingUp",
    "color": "#ff7b00",
    "blurb": "Configuration bundles, recommendations, A/B testing, and insights.",
    "pages": [
      {
        "slug": "optimization",
        "title": "AgentCore optimization: Improve agent quality loop with recommendations and A/B tests",
        "desc": "Amazon Bedrock AgentCore optimization provides tools to continuously improve your agent’s performance through data-driven configuration changes. Instead of manually rewriting prompts and testing...",
        "file": "/agentcore/md/optimization.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html"
      },
      {
        "slug": "optimization-how-it-works",
        "title": "How it works",
        "desc": "AgentCore optimization connects evaluation findings to validated improvements through a repeatable cycle. A typical iteration follows these steps:",
        "file": "/agentcore/md/optimization-how-it-works.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-how-it-works.html"
      },
      {
        "slug": "optimization-prereqs",
        "title": "Prerequisites",
        "desc": "Before using AgentCore optimization features, make sure the following are in place.",
        "file": "/agentcore/md/optimization-prereqs.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-prereqs.html"
      },
      {
        "slug": "configuration-bundles",
        "title": "Configuration bundles",
        "desc": "A configuration bundle is a versioned, immutable snapshot of your agent’s dynamic configuration — system prompts, model IDs, tool descriptions, and any other key-value pairs your agent reads at...",
        "file": "/agentcore/md/configuration-bundles.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles.html"
      },
      {
        "slug": "configuration-bundles-getting-started",
        "title": "Getting started with configuration bundles",
        "desc": "This walkthrough takes you from zero to a versioned configuration bundle that your agent reads at runtime. You will create a bundle, update it to produce a new version, read the configuration, and...",
        "file": "/agentcore/md/configuration-bundles-getting-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-getting-started.html"
      },
      {
        "slug": "configuration-bundles-create",
        "title": "Create a configuration bundle",
        "desc": "Create a configuration bundle to store a versioned snapshot of your agent’s dynamic configuration. The bundle is created with an initial version on the mainline branch.",
        "file": "/agentcore/md/configuration-bundles-create.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-create.html"
      },
      {
        "slug": "configuration-bundles-update",
        "title": "Update a configuration bundle",
        "desc": "Update a configuration bundle to create a new immutable version with changed configuration. Each update produces a new version ID; existing versions are never modified. Versions form a chain via...",
        "file": "/agentcore/md/configuration-bundles-update.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-update.html"
      },
      {
        "slug": "configuration-bundles-get",
        "title": "Get a configuration bundle",
        "desc": "Retrieve a configuration bundle to inspect its metadata or read the full configuration content of a specific version. Two operations are available:",
        "file": "/agentcore/md/configuration-bundles-get.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-get.html"
      },
      {
        "slug": "configuration-bundles-list",
        "title": "List configuration bundles",
        "desc": "List configuration bundles in your account, or list versions of a specific bundle. Two operations are available:",
        "file": "/agentcore/md/configuration-bundles-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-list.html"
      },
      {
        "slug": "configuration-bundles-delete",
        "title": "Delete a configuration bundle",
        "desc": "Delete a configuration bundle and all of its versions. Deletion is asynchronous — the API returns immediately with a DELETING status, and the service removes the bundle and its version history in...",
        "file": "/agentcore/md/configuration-bundles-delete.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-delete.html"
      },
      {
        "slug": "configuration-bundles-runtime",
        "title": "Use configuration bundles at runtime",
        "desc": "Your agent reads configuration from a bundle at runtime to apply dynamic settings without redeploying code. The gateway and runtime propagate the bundle reference through W3C baggage headers, so...",
        "file": "/agentcore/md/configuration-bundles-runtime.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-runtime.html"
      },
      {
        "slug": "configuration-bundles-encryption",
        "title": "Configuration bundle encryption",
        "desc": "When you specify a kmsKeyArn on a configuration bundle, the service encrypts the component configurations (system prompts, tool descriptions, and other configuration content) using envelope...",
        "file": "/agentcore/md/configuration-bundles-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-encryption.html"
      },
      {
        "slug": "optimization-recommendations",
        "title": "Recommendations",
        "desc": "Recommendations use AI to generate optimized agent configurations from real session traces. Instead of manually rewriting prompts or tool descriptions, you point the service at your agent’s...",
        "file": "/agentcore/md/optimization-recommendations.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-recommendations.html"
      },
      {
        "slug": "recommendations-system-prompt",
        "title": "Start a system prompt recommendation",
        "desc": "Start a recommendation to generate an optimized system prompt for your agent. The service analyzes agent traces, identifies failure patterns, and produces a revised system prompt that improves...",
        "file": "/agentcore/md/recommendations-system-prompt.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-system-prompt.html"
      },
      {
        "slug": "recommendations-tool-description",
        "title": "Start a tool description recommendation",
        "desc": "Start a recommendation to generate optimized tool descriptions for your agent. The service analyzes agent traces to identify tool selection confusion and produces sharpened descriptions that...",
        "file": "/agentcore/md/recommendations-tool-description.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-tool-description.html"
      },
      {
        "slug": "recommendations-get",
        "title": "Get recommendation",
        "desc": "Retrieve the status and results of a recommendation. Poll this operation until the recommendation reaches a terminal state (COMPLETED or FAILED).",
        "file": "/agentcore/md/recommendations-get.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-get.html"
      },
      {
        "slug": "recommendations-list",
        "title": "List recommendations",
        "desc": "List all recommendations in your account. Results are paginated and can be filtered by status.",
        "file": "/agentcore/md/recommendations-list.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-list.html"
      },
      {
        "slug": "recommendations-delete",
        "title": "Delete recommendation",
        "desc": "Delete a recommendation and its associated metadata. The recommendation must be in a terminal state (COMPLETED or FAILED) before it can be deleted.",
        "file": "/agentcore/md/recommendations-delete.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-delete.html"
      },
      {
        "slug": "recommendations-encryption",
        "title": "Recommendation encryption",
        "desc": "When you specify a kmsKeyArn on a recommendation, the service encrypts the recommendation configuration and recommendation result using envelope encryption with the AWS Encryption SDK. All other...",
        "file": "/agentcore/md/recommendations-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-encryption.html"
      },
      {
        "slug": "ab-testing",
        "title": "A/B testing",
        "desc": "A/B testing splits live production traffic between two variants and continuously evaluates performance with statistical significance. The AgentCore Gateway handles traffic routing; your agent code...",
        "file": "/agentcore/md/ab-testing.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing.html"
      },
      {
        "slug": "ab-testing-prereqs",
        "title": "A/B testing prerequisites",
        "desc": "Before you create an A/B test, ensure the following resources are in place.",
        "file": "/agentcore/md/ab-testing-prereqs.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-prereqs.html"
      },
      {
        "slug": "ab-testing-target-based",
        "title": "Run an A/B test with target-based routing",
        "desc": "Use the target-based routing pattern when the change you are testing involves code changes, a framework upgrade, or an entirely different agent implementation. Target-based routing routes traffic...",
        "file": "/agentcore/md/ab-testing-target-based.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-target-based.html"
      },
      {
        "slug": "ab-testing-config-bundle",
        "title": "Run an A/B test with configuration bundles",
        "desc": "Use the configuration bundle pattern when the change you are testing is purely configuration — a different system prompt, a different model ID, or different tool descriptions. Both variants run on...",
        "file": "/agentcore/md/ab-testing-config-bundle.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-config-bundle.html"
      },
      {
        "slug": "ab-testing-3p-agents",
        "title": "Run an A/B test for agents hosted outside of AgentCore",
        "desc": "You can A/B test an agent that runs outside an AgentCore Runtime with an agent hosted anywhere, for example on AWS Lambda, Amazon EKS, or Amazon ECS. For A/B testing agents, AgentCore gateway...",
        "file": "/agentcore/md/ab-testing-3p-agents.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-3p-agents.html"
      },
      {
        "slug": "ab-testing-manage",
        "title": "Manage an A/B test",
        "desc": "Update an A/B test to start it, pause it, or stop it. You use the UpdateABTest operation to change execution status.",
        "file": "/agentcore/md/ab-testing-manage.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-manage.html"
      },
      {
        "slug": "insights",
        "title": "AgentCore insights: Triage agent failures with pattern analysis",
        "desc": "AgentCore insights is in public preview. Features and APIs may change before general availability.",
        "file": "/agentcore/md/insights.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights.html"
      },
      {
        "slug": "insights-how-it-works",
        "title": "How it works",
        "desc": "AgentCore insights answers three questions about your agent’s production behavior: Why is it failing? What are users asking for? and How is it solving problems?",
        "file": "/agentcore/md/insights-how-it-works.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-how-it-works.html"
      },
      {
        "slug": "insights-prerequisites",
        "title": "Prerequisites",
        "desc": "Before you begin using AgentCore insights, ensure you have the following:",
        "file": "/agentcore/md/insights-prerequisites.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-prerequisites.html"
      },
      {
        "slug": "insights-one-time-report",
        "title": "One-time insights report",
        "desc": "Use StartBatchEvaluation to run an on-demand insights analysis over your agent’s sessions. This is useful when you want to investigate agent behavior after a deployment, a spike in failures, or as...",
        "file": "/agentcore/md/insights-one-time-report.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-one-time-report.html"
      },
      {
        "slug": "insights-recurring-report",
        "title": "Recurring insights report",
        "desc": "Create an online evaluation configuration with insights and a clustering schedule. The service automatically runs insights analysis on the configured cadence without manual intervention.",
        "file": "/agentcore/md/insights-recurring-report.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-recurring-report.html"
      },
      {
        "slug": "insights-generate-recommendation",
        "title": "Generate a recommendation from insights findings",
        "desc": "After reviewing your insights results, you can use the same agent traces to generate an improved system prompt. Point StartRecommendation at the completed batch evaluation that produced your...",
        "file": "/agentcore/md/insights-generate-recommendation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-generate-recommendation.html"
      }
    ]
  },
  {
    "id": "registry",
    "label": "Registry",
    "icon": "Library",
    "color": "#06d6a0",
    "blurb": "Discover, curate, and govern agents and tools across your org.",
    "pages": [
      {
        "slug": "registry",
        "title": "AWS Agent Registry: Discover and manage agents, tools, and resources (Preview)",
        "desc": "AWS Agent Registry is a fully managed discovery service that provides a centralized catalog for organizing, curating, and discovering resources across your organization. With AWS Agent Registry,...",
        "file": "/agentcore/md/registry.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html"
      },
      {
        "slug": "registry-key-capabilities",
        "title": "Key capabilities",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-key-capabilities.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-key-capabilities.html"
      },
      {
        "slug": "registry-concepts",
        "title": "Concepts and terminology",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-concepts.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-concepts.html"
      },
      {
        "slug": "registry-prerequisites",
        "title": "Prerequisites",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-prerequisites.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-prerequisites.html"
      },
      {
        "slug": "registry-use-cases",
        "title": "Sample use cases",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-use-cases.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-use-cases.html"
      },
      {
        "slug": "registry-get-started",
        "title": "Get started with AWS Agent Registry",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-get-started.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-get-started.html"
      },
      {
        "slug": "registry-managing-registries",
        "title": "Creating and managing registries",
        "desc": "A registry is the top-level resource in AWS Agent Registry. Before you can publish records, you need to create a registry and configure its authorization and approval settings. This section covers...",
        "file": "/agentcore/md/registry-managing-registries.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-managing-registries.html"
      },
      {
        "slug": "registry-supported-auth-types",
        "title": "Supported Inbound Authorization types",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-supported-auth-types.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-supported-auth-types.html"
      },
      {
        "slug": "registry-create-manage",
        "title": "Create and manage registries",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-create-manage.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-create-manage.html"
      },
      {
        "slug": "registry-managing-records",
        "title": "Creating and managing registry records",
        "desc": "Registry records represent the individual resources published into a registry. Each record captures metadata that describes the underlying resource — what it is, what it does, and how it can be...",
        "file": "/agentcore/md/registry-managing-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-managing-records.html"
      },
      {
        "slug": "registry-supported-record-types",
        "title": "Supported record types",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-supported-record-types.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-supported-record-types.html"
      },
      {
        "slug": "registry-record-lifecycle",
        "title": "Record lifecycle",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-record-lifecycle.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-record-lifecycle.html"
      },
      {
        "slug": "registry-create-manage-records",
        "title": "Create and manage records",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-create-manage-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-create-manage-records.html"
      },
      {
        "slug": "registry-sync-records",
        "title": "Synchronize records from external sources",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-sync-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-sync-records.html"
      },
      {
        "slug": "registry-curating",
        "title": "Curating the registry",
        "desc": "Curators are the quality gatekeepers of the registry. They review records that publishers have submitted for approval, evaluate each record against the organization’s standards for security,...",
        "file": "/agentcore/md/registry-curating.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-curating.html"
      },
      {
        "slug": "registry-reviewing-records",
        "title": "Reviewing registry records",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-reviewing-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-reviewing-records.html"
      },
      {
        "slug": "registry-deprecating-records",
        "title": "Deprecating registry records",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-deprecating-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-deprecating-records.html"
      },
      {
        "slug": "registry-notifications-approvals",
        "title": "Notifications for pending approvals",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-notifications-approvals.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-notifications-approvals.html"
      },
      {
        "slug": "registry-searching",
        "title": "Searching the registry",
        "desc": "Consumers search the registry to discover MCP servers, agents, skills, and other resources that have been approved and published. AWS Agent Registry combines semantic search with keyword matching...",
        "file": "/agentcore/md/registry-searching.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-searching.html"
      },
      {
        "slug": "registry-search-records",
        "title": "Search for registry records",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-search-records.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-search-records.html"
      },
      {
        "slug": "registry-mcp-endpoint",
        "title": "Using the Registry MCP endpoint",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-mcp-endpoint.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-mcp-endpoint.html"
      },
      {
        "slug": "registry-eventbridge",
        "title": "Notifications (Amazon EventBridge)",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-eventbridge.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-eventbridge.html"
      },
      {
        "slug": "registry-cloudtrail",
        "title": "Log Registry API calls with AWS CloudTrail",
        "desc": "AWS Agent Registry control plane API calls are logged in AWS CloudTrail, providing a complete audit trail of who did what and when. Control plane operations are logged as management events by default.",
        "file": "/agentcore/md/registry-cloudtrail.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-cloudtrail.html"
      },
      {
        "slug": "registry-cloudtrail-integration",
        "title": "AWS CloudTrail integration",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-cloudtrail-integration.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-cloudtrail-integration.html"
      },
      {
        "slug": "registry-iam-permissions",
        "title": "IAM Permissions",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-iam-permissions.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-iam-permissions.html"
      },
      {
        "slug": "registry-troubleshooting",
        "title": "Troubleshooting",
        "desc": "AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry,...",
        "file": "/agentcore/md/registry-troubleshooting.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-troubleshooting.html"
      },
      {
        "slug": "registry-faq",
        "title": "Comprehensive registry migration guide",
        "desc": "AWS Agent Registry — Migrating from Public Preview to General Availability",
        "file": "/agentcore/md/registry-faq.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-faq.html"
      }
    ]
  },
  {
    "id": "reference",
    "label": "CLI & SDK Reference",
    "icon": "BookMarked",
    "color": "#8ecae6",
    "blurb": "Command-line and Python/TypeScript SDK reference material.",
    "pages": [
      {
        "slug": "agentcore-cli-reference",
        "title": "AgentCore CLI reference",
        "desc": "This reference documents the public Amazon Bedrock AgentCore CLI releases.",
        "file": "/agentcore/md/agentcore-cli-reference.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-cli-reference.html"
      },
      {
        "slug": "agentcore-python-sdk-reference",
        "title": "AgentCore Python SDK reference",
        "desc": "This reference documents the public Amazon Bedrock AgentCore Python SDK releases.",
        "file": "/agentcore/md/agentcore-python-sdk-reference.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-python-sdk-reference.html"
      },
      {
        "slug": "agentcore-typescript-sdk-reference",
        "title": "AgentCore TypeScript SDK reference",
        "desc": "This reference documents the public Amazon Bedrock AgentCore TypeScript SDK releases.",
        "file": "/agentcore/md/agentcore-typescript-sdk-reference.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-typescript-sdk-reference.html"
      }
    ]
  },
  {
    "id": "security",
    "label": "Security & Compliance",
    "icon": "Lock",
    "color": "#e63946",
    "blurb": "IAM, encryption, VPC, data protection, resilience, and compliance.",
    "pages": [
      {
        "slug": "security",
        "title": "Security in Amazon Bedrock AgentCore",
        "desc": "Cloud security at AWS is the highest priority. As an AWS customer, you benefit from data centers and network architectures that are designed to help meet with the requirements of the most...",
        "file": "/agentcore/md/security.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security.html"
      },
      {
        "slug": "data-protection",
        "title": "Data protection in Amazon Bedrock AgentCore",
        "desc": "The AWS shared responsibility model applies to data protection in Amazon Bedrock AgentCore. As described in this model, AWS is responsible for protecting the global infrastructure that runs all of...",
        "file": "/agentcore/md/data-protection.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/data-protection.html"
      },
      {
        "slug": "data-encryption",
        "title": "Data encryption",
        "desc": "Amazon Bedrock AgentCore stores data at rest using Amazon DynamoDB and Amazon Simple Storage Service (Amazon S3). The data at rest is encrypted using AWS encryption solutions by default. AgentCore...",
        "file": "/agentcore/md/data-encryption.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/data-encryption.html"
      },
      {
        "slug": "vpc",
        "title": "Protecting your data using VPC and AWS PrivateLink",
        "desc": "You can use Amazon Virtual Private Cloud (Amazon VPC) and AWS PrivateLink to create private connections between your VPC and Amazon Bedrock AgentCore.",
        "file": "/agentcore/md/vpc.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/vpc.html"
      },
      {
        "slug": "vpc-interface-endpoints",
        "title": "Use interface VPC endpoints (AWS PrivateLink) to create a private connection between your VPC and your Amazon Bedrock AgentCore resources",
        "desc": "You can use AWS PrivateLink to create a private connection between your VPC and Amazon Bedrock AgentCore. You can access AgentCore as if it were in your VPC, without the use of an internet...",
        "file": "/agentcore/md/vpc-interface-endpoints.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/vpc-interface-endpoints.html"
      },
      {
        "slug": "gateway-vpc-egress",
        "title": "Configure Amazon Bedrock AgentCore Gateway VPC Egress for Gateway Targets",
        "desc": "The AgentCore Gateway service provides secure and controlled egress traffic management for your applications, enabling seamless communication with resources within your Virtual Private Cloud...",
        "file": "/agentcore/md/gateway-vpc-egress.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-vpc-egress.html"
      },
      {
        "slug": "vpc-egress-private-endpoints",
        "title": "Connect to private resources in your VPC using VPC Lattice",
        "desc": "Amazon Bedrock AgentCore supports private connectivity to resources hosted inside your AWS VPC or on-premises environments connected to your VPC, such as private MCP servers, internal REST APIs,...",
        "file": "/agentcore/md/vpc-egress-private-endpoints.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/vpc-egress-private-endpoints.html"
      },
      {
        "slug": "agentcore-vpc",
        "title": "Configure Amazon Bedrock AgentCore Runtime and tools for VPC",
        "desc": "You can configure Amazon Bedrock AgentCore Runtime and built-in tools (Code Interpreter and Browser Tool) to connect to resources in your Amazon Virtual Private Cloud (VPC). By configuring VPC...",
        "file": "/agentcore/md/agentcore-vpc.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-vpc.html"
      },
      {
        "slug": "security-vpc-condition",
        "title": "Use IAM condition keys with AgentCore VPC settings",
        "desc": "Use Amazon Bedrock AgentCore-specific condition keys for VPC settings to more precisely control permissions for your AgentCore resources. For example, require that all runtimes in your...",
        "file": "/agentcore/md/security-vpc-condition.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-vpc-condition.html"
      },
      {
        "slug": "cross-region-inference",
        "title": "Cross-region inference in Amazon Bedrock AgentCore Memory, Policy in Amazon Bedrock AgentCore, and AgentCore Evaluations",
        "desc": "With cross-region inference, Amazon Bedrock AgentCore Memory, Policy in AgentCore, and AgentCore Evaluations will automatically select the optimal region (as described in more detail below) to...",
        "file": "/agentcore/md/cross-region-inference.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/cross-region-inference.html"
      },
      {
        "slug": "security-iam",
        "title": "Identity and access management for Amazon Bedrock AgentCore",
        "desc": "AWS Identity and Access Management (IAM) is an AWS service that helps an administrator securely control access to AWS resources. IAM administrators control who can be authenticated (signed in) and...",
        "file": "/agentcore/md/security-iam.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam.html"
      },
      {
        "slug": "security_iam_service-with-iam",
        "title": "How Amazon Bedrock AgentCore works with IAM",
        "desc": "Before you use IAM to manage access to AgentCore, learn what IAM features are available to use with AgentCore.",
        "file": "/agentcore/md/security_iam_service-with-iam.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security_iam_service-with-iam.html"
      },
      {
        "slug": "security-gateway-condition-keys",
        "title": "Use IAM condition keys with Amazon Bedrock AgentCore Gateway",
        "desc": "Use Amazon Bedrock AgentCore-specific condition keys to control how you create and configure gateways and gateway targets in your organization. These condition keys apply to control plane...",
        "file": "/agentcore/md/security-gateway-condition-keys.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-gateway-condition-keys.html"
      },
      {
        "slug": "security_iam_id-based-policy-examples",
        "title": "Identity-based policy examples for Amazon Bedrock AgentCore",
        "desc": "By default, users and roles don’t have permission to create or modify AgentCore resources. To grant users permission to perform actions on the resources that they need, an IAM administrator can...",
        "file": "/agentcore/md/security_iam_id-based-policy-examples.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security_iam_id-based-policy-examples.html"
      },
      {
        "slug": "security-iam-awsmanpol",
        "title": "AWS managed policies for Amazon Bedrock AgentCore",
        "desc": "An AWS managed policy is a standalone policy that is created and administered by AWS. AWS managed policies are designed to provide permissions for many common use cases so that you can start...",
        "file": "/agentcore/md/security-iam-awsmanpol.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam-awsmanpol.html"
      },
      {
        "slug": "service-linked-roles",
        "title": "Using service-linked roles for Amazon Bedrock AgentCore",
        "desc": "Amazon Bedrock AgentCore uses AWS Identity and Access Management (IAM) service-linked roles. A service-linked role is a unique type of IAM role that is linked directly to AgentCore. Service-linked...",
        "file": "/agentcore/md/service-linked-roles.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/service-linked-roles.html"
      },
      {
        "slug": "security-credentials-management",
        "title": "Understanding Credentials Management in Amazon Bedrock AgentCore",
        "desc": "When you configure an execution role with Amazon Bedrock AgentCore Browser, AgentCore Code Interpreter, or AgentCore Runtime, the underlying compute uses MMDS to access credentials, similar to how...",
        "file": "/agentcore/md/security-credentials-management.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-credentials-management.html"
      },
      {
        "slug": "security_iam_troubleshoot",
        "title": "Troubleshooting Amazon Bedrock AgentCore identity and access",
        "desc": "Use the following information to help you diagnose and fix common issues that you might encounter when working with AgentCore and IAM.",
        "file": "/agentcore/md/security_iam_troubleshoot.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security_iam_troubleshoot.html"
      },
      {
        "slug": "resource-based-policies",
        "title": "Resource-based policies for Amazon Bedrock AgentCore",
        "desc": "Resource-based policies in Amazon Bedrock AgentCore allow you to control which principals (AWS accounts, IAM users, or IAM roles) can invoke and manage your Amazon Bedrock AgentCore resources...",
        "file": "/agentcore/md/resource-based-policies.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/resource-based-policies.html"
      },
      {
        "slug": "compliance-validation",
        "title": "Compliance validation for Amazon Bedrock AgentCore",
        "desc": "Amazon Bedrock AgentCore is HIPAA eligible and FedRAMP (Class C), SOC 2 and ISO (27001:2022, 27017:2015, 27018:2019, 27701:2019, 22301:2019, 20000-1:2018, 9001:2015) and CSA STAR compliant. In...",
        "file": "/agentcore/md/compliance-validation.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/compliance-validation.html"
      },
      {
        "slug": "disaster-recovery-resiliency",
        "title": "Resilience in Amazon Bedrock AgentCore",
        "desc": "The AWS global infrastructure is built around AWS Regions and Availability Zones. AWS Regions provide multiple physically separated and isolated Availability Zones, which are connected with...",
        "file": "/agentcore/md/disaster-recovery-resiliency.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/disaster-recovery-resiliency.html"
      },
      {
        "slug": "cross-service-confused-deputy-prevention",
        "title": "Cross-service confused deputy prevention",
        "desc": "The confused deputy problem is a security issue where an entity that doesn’t have permission to perform an action can coerce a more-privileged entity to perform the action. In AWS, cross-service...",
        "file": "/agentcore/md/cross-service-confused-deputy-prevention.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/cross-service-confused-deputy-prevention.html"
      },
      {
        "slug": "tagging",
        "title": "Tagging AgentCore resources",
        "desc": "A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value , both of which you define.",
        "file": "/agentcore/md/tagging.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/tagging.html"
      }
    ]
  },
  {
    "id": "limits",
    "label": "Limits & Releases",
    "icon": "Gauge",
    "color": "#adb5bd",
    "blurb": "Service quotas and the running release-notes history.",
    "pages": [
      {
        "slug": "bedrock-agentcore-limits",
        "title": "Quotas for Amazon Bedrock AgentCore",
        "desc": "Your AWS account has default quotas, formerly referred to as limits, for each AWS service. Unless otherwise noted, each quota is Region-specific. You can request increases for some quotas, and...",
        "file": "/agentcore/md/bedrock-agentcore-limits.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html"
      },
      {
        "slug": "release-notes",
        "title": "Release notes for Amazon Bedrock AgentCore",
        "desc": "We recommend subscribing to the RSS feed so updates to these notes are delivered to your Inbox.",
        "file": "/agentcore/md/release-notes.md",
        "source": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html"
      }
    ]
  }
];

export const AGENTCORE_ALL_PAGES = AGENTCORE_SECTIONS.flatMap(
  (section) => section.pages.map((page) => ({ ...page, sectionId: section.id, sectionLabel: section.label, color: section.color }))
);
