# Host agent or tools with Amazon Bedrock AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html

---

# Host agent or tools with Amazon Bedrock AgentCore Runtime

Amazon Bedrock AgentCore Runtime provides a secure, serverless and purpose-built hosting environment for deploying and running AI agents or tools. It offers the following benefits:

Framework agnostic
    

AgentCore Runtime lets you transform any local agent code to cloud-native deployments with a few lines of code no matter the underlying framework. Works seamlessly with popular frameworks like LangGraph, Strands, and CrewAI. You can also leverage it with custom agents that don’t use a specific framework.

Model flexibility
    

AgentCore Runtime works with any Large Language Model, such as models offered by Amazon Bedrock, Anthropic Claude, Google Gemini, and OpenAI.

Protocol support
    

AgentCore Runtime lets agents communicate with other agents and tools via Model Context Protocol (MCP) or Agent to Agent (A2A).

Session isolation
    

In AgentCore Runtime, each user session runs in a dedicated microVM with isolated CPU, memory, and filesystem resources. This helps create complete separation between user sessions, safeguarding stateful agent reasoning processes and helps prevent cross-session data contamination. After session completion, the entire microVM is terminated and memory is sanitized, delivering deterministic security even when working with non-deterministic AI processes.

Extended execution time
    

AgentCore Runtime supports both real-time interactions and long-running workloads up to 8 hours, enabling complex agent reasoning and asynchronous workloads that may involve multi-agent collaboration or extended problem-solving sessions.

Persistent filesystems
    

Runtime supports persisting filesystem state across session stop/resume cycles. The agent’s files, installed packages, and build artifacts can survive session stops without external storage.

Consumption-based pricing model
    

Runtime implements consumption-based pricing that charges only for resources actually consumed. Unlike allocation-based models that require pre-selecting resources, Runtime dynamically provisions what’s needed without requiring right-sizing. The service aligns CPU billing with actual active processing - typically eliminating charges during I/O wait periods when agents are primarily waiting for LLM responses - while continuously maintaining your session state.

Built-in authentication
    

AgentCore Runtime, powered by AgentCore Identity, assigns distinct identities to AI agents and seamlessly integrates with your corporate identity provider such as Okta, Microsoft Entra ID, or Amazon Cognito, enabling your end users to authenticate into only the agents they have access to. In addition, Runtime lets outbound authentication flows to securely access third-party services like Slack, Zoom, and GitHub - whether operating on behalf of users or autonomously (using either OAuth or API keys).

Agent-specific observability
    

AgentCore Runtime provides specialized built-in tracing that captures agent reasoning steps, tool invocations, and model interactions, providing clear visibility into agent decision-making processes, a critical capability for debugging and auditing AI agent behaviors.

Enhanced payload handling
    

AgentCore Runtime can process 100MB payloads enabling seamless processing of multiple modalities (text, images, audio, video), with rich media content or large datasets.

Bidirectional streaming
    

AgentCore Runtime supports both HTTP API calls and persistent WebSocket connections for real-time bidirectional streaming, enabling interactive applications with immediate response feedback and maintained conversation context.

Unified set of agent-specific capabilities
    

AgentCore Runtime is delivered through a single, comprehensive SDK that provides streamlined access to the complete AgentCore capabilities including Memory, Tools, and Gateway. This integrated approach eliminates the integration work typically required when building equivalent agent infrastructure from disparate components.

###### Topics

  * [How it works](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-how-it-works.html>)

  * [Understand the AgentCore Runtime service contract](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-service-contract.html>)

  * [IAM Permissions for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-permissions.html>)

  * [Get started with AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-getting-started.html>)

  * [Use any agent framework](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./using-any-agent-framework.html>)

  * [Use any foundation model](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./using-any-model.html>)

  * [Deploy MCP servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html>)

  * [Stateful MCP server features](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./mcp-stateful-features.html>)

  * [Deploy A2A servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-a2a.html>)

  * [Deploy AG-UI servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-agui.html>)

  * [Use isolated sessions for agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-sessions.html>)

  * [File system configurations for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-filesystem-configurations.html>)

  * [Handle asynchronous and long running agents with Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-long-run.html>)

  * [Stream agent responses](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./response-streaming.html>)

  * [Bidirectional streaming](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-bidirectional-streaming.html>)

  * [Pass custom headers to Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-header-allowlist.html>)

  * [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html>)

  * [AgentCore Runtime versioning and endpoints](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agent-runtime-versioning.html>)

  * [Invoke an AgentCore Runtime agent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-invoke-agent.html>)

  * [Shell execution](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-shell-execution.html>)

  * [Observe agents in Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-observability.html>)

  * [Security best practices for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html>)

  * [Troubleshoot AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-troubleshooting.html>)



